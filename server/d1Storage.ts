/// <reference types="@cloudflare/workers-types" />
import type { IStorage, ContactLead, BlogPost, InsertContactLead, InsertBlogPost, LeadDetails, FormConfigChange } from "./services/storage";
import { LEAD_DETAIL_COLUMNS } from "./services/storage";
import { LEGACY_POSTS } from "./services/legacy-posts";

export class D1Storage implements IStorage {
  constructor(private db: D1Database) {}

  async createContactLead(lead: InsertContactLead & { ip?: string; source?: string }): Promise<ContactLead> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const details = Object.fromEntries(LEAD_DETAIL_COLUMNS.map(([key]) => [key, lead[key] ?? null])) as unknown as LeadDetails;
    const detailColumns = LEAD_DETAIL_COLUMNS.map(([, column]) => column);
    await this.db.prepare(
      `INSERT INTO contact_leads (id, name, email, company, impressions, message, ip, source, status, created_at, ${detailColumns.join(", ")}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${detailColumns.map(() => "?").join(", ")})`
    ).bind(
      id, lead.name, lead.email, lead.company, lead.impressions,
      lead.message || null, lead.ip || null, lead.source || "contact", "new", now,
      ...LEAD_DETAIL_COLUMNS.map(([key]) => details[key]),
    ).run();
    return {
      id, name: lead.name, email: lead.email, company: lead.company,
      impressions: lead.impressions, message: lead.message || null,
      ip: lead.ip || null, source: lead.source || "contact", status: "new",
      createdAt: new Date(now), ...details,
    };
  }

  async getContactLeads(): Promise<ContactLead[]> {
    const { results } = await this.db.prepare("SELECT * FROM contact_leads ORDER BY created_at DESC").all();
    return results.map(r => this.mapLead(r));
  }

  async getContactLeadById(id: string): Promise<ContactLead | undefined> {
    const row = await this.db.prepare("SELECT * FROM contact_leads WHERE id = ?").bind(id).first();
    return row ? this.mapLead(row) : undefined;
  }

  async updateContactLeadStatus(id: string, status: string): Promise<ContactLead | undefined> {
    await this.db.prepare("UPDATE contact_leads SET status = ? WHERE id = ?").bind(status, id).run();
    return this.getContactLeadById(id);
  }

  async getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
    const query = publishedOnly
      ? "SELECT * FROM blog_posts WHERE published = 'true' ORDER BY published_at DESC"
      : "SELECT * FROM blog_posts ORDER BY published_at DESC";
    const { results } = await this.db.prepare(query).all();
    return results.map(r => this.mapPost(r));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const row = await this.db.prepare("SELECT * FROM blog_posts WHERE slug = ?").bind(slug).first();
    return row ? this.mapPost(row) : undefined;
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const row = await this.db.prepare("SELECT * FROM blog_posts WHERE id = ?").bind(id).first();
    return row ? this.mapPost(row) : undefined;
  }

  async createBlogPost(post: InsertBlogPost & { publishedAt?: string | Date }): Promise<BlogPost> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const pubAt = post.publishedAt ? new Date(post.publishedAt).toISOString() : now;
    await this.db.prepare(
      "INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image, author, category, tags, published, published_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      id, post.title, post.slug, post.excerpt, post.content,
      post.coverImage || null, post.author, post.category,
      post.tags || null, post.published || "true", pubAt, now
    ).run();
    return {
      id, title: post.title, slug: post.slug, excerpt: post.excerpt,
      content: post.content, coverImage: post.coverImage || null,
      author: post.author, category: post.category, tags: post.tags || null,
      published: post.published || "true",
      publishedAt: new Date(pubAt), updatedAt: new Date(now),
    };
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = await this.getBlogPostById(id);
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) { fields.push("title = ?"); values.push(updates.title); }
    if (updates.slug !== undefined) { fields.push("slug = ?"); values.push(updates.slug); }
    if (updates.excerpt !== undefined) { fields.push("excerpt = ?"); values.push(updates.excerpt); }
    if (updates.content !== undefined) { fields.push("content = ?"); values.push(updates.content); }
    if (updates.coverImage !== undefined) { fields.push("cover_image = ?"); values.push(updates.coverImage || null); }
    if (updates.author !== undefined) { fields.push("author = ?"); values.push(updates.author); }
    if (updates.category !== undefined) { fields.push("category = ?"); values.push(updates.category); }
    if (updates.tags !== undefined) { fields.push("tags = ?"); values.push(updates.tags || null); }
    if (updates.published !== undefined) { fields.push("published = ?"); values.push(updates.published); }

    fields.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    await this.db.prepare(`UPDATE blog_posts SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
    return this.getBlogPostById(id);
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await this.db.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
    return result.meta.changes > 0;
  }

  // Both tables are bounded by the app (15 built-in + at most 20 custom fields, 2 settings): a full read is under 40 rows
  async getFieldOverrides(): Promise<Record<string, string>> {
    const { results } = await this.db.prepare("SELECT key, config FROM form_field_overrides").all<{ key: string; config: string }>();
    return Object.fromEntries(results.map((r) => [r.key, r.config]));
  }

  async getFormSettings(): Promise<Record<string, string>> {
    const { results } = await this.db.prepare("SELECT key, value FROM form_settings").all<{ key: string; value: string }>();
    return Object.fromEntries(results.map((r) => [r.key, r.value]));
  }

  // batch() is one transaction: a change and its audit row land together or not at all
  async saveFieldOverride(key: string, config: string, before: string | null, actor: string): Promise<void> {
    const at = new Date().toISOString();
    await this.db.batch([
      this.db.prepare(
        "INSERT INTO form_field_overrides (key, config, updated_at, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET config = excluded.config, updated_at = excluded.updated_at, updated_by = excluded.updated_by"
      ).bind(key, config, at, actor),
      this.auditRow(at, actor, `field:${key}`, before, config),
    ]);
  }

  async saveFormSettings(changes: { key: string; value: string; before: string | null }[], actor: string): Promise<void> {
    if (!changes.length) return;
    const at = new Date().toISOString();
    await this.db.batch(changes.flatMap(({ key, value, before }) => [
      this.db.prepare(
        "INSERT INTO form_settings (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by"
      ).bind(key, value, at, actor),
      this.auditRow(at, actor, `setting:${key}`, before, value),
    ]));
  }

  async getFormConfigChanges(limit: number): Promise<FormConfigChange[]> {
    const { results } = await this.db.prepare(
      "SELECT id, at, actor, target, before, after FROM form_config_changes ORDER BY at DESC LIMIT ?"
    ).bind(limit).all<FormConfigChange>();
    return results;
  }

  private auditRow(at: string, actor: string, target: string, before: string | null, after: string) {
    return this.db.prepare("INSERT INTO form_config_changes (id, at, actor, target, before, after) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), at, actor, target, before, after);
  }

  async seedBlogPosts(): Promise<void> {
    const { results } = await this.db.prepare("SELECT COUNT(*) as count FROM blog_posts").all();
    const count = (results[0] as any).count;
    if (count > 0) return;

    console.log("Seeding blog posts to D1...");
    const posts = LEGACY_POSTS.map((post) => ({ ...post, published: "true" }));

    for (const post of posts) {
      try {
        const id = crypto.randomUUID();
        await this.db.prepare(
          "INSERT OR IGNORE INTO blog_posts (id, title, slug, excerpt, content, cover_image, author, category, tags, published, published_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          id, post.title, post.slug, post.excerpt, post.content,
          null, post.author, post.category, post.tags, post.published,
          post.publishedAt, post.publishedAt
        ).run();
      } catch (e) {
        console.log(`Skipping duplicate post: ${post.slug}`);
      }
    }

    console.log(`Seeded blog posts to D1.`);
  }

  private mapLead(row: any): ContactLead {
    return {
      id: row.id, name: row.name, email: row.email, company: row.company,
      impressions: row.impressions, message: row.message,
      ip: row.ip, source: row.source, status: row.status,
      createdAt: row.created_at ? new Date(row.created_at) : null,
      ...(Object.fromEntries(LEAD_DETAIL_COLUMNS.map(([key, column]) => [key, row[column] ?? null])) as unknown as LeadDetails),
    };
  }

  private mapPost(row: any): BlogPost {
    return {
      id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt,
      content: row.content, coverImage: row.cover_image,
      author: row.author, category: row.category, tags: row.tags,
      published: row.published,
      publishedAt: row.published_at ? new Date(row.published_at) : null,
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    };
  }
}
