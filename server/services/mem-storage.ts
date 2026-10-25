// In-memory storage for local development (no database required)
import type {
  IStorage, ContactLead, BlogPost, InsertContactLead, InsertBlogPost, LeadDetails, FormConfigChange,
  SupplySeller, AdsTxtLine, SupplyChange,
} from "./storage";
import { LEAD_DETAIL_COLUMNS } from "./storage";
import { LEGACY_POSTS } from "./legacy-posts";

export class MemStorage implements IStorage {
  private contactLeads = new Map<string, ContactLead>();
  private blogPosts = new Map<string, BlogPost>();
  private fieldOverrides = new Map<string, string>();
  private formSettings = new Map<string, string>();
  private formChanges: FormConfigChange[] = [];
  private sellers = new Map<string, SupplySeller>();
  private adsTxtLines = new Map<string, AdsTxtLine>();
  private supplySettings = new Map<string, string>();
  private supplyChanges: SupplyChange[] = [];
  private seeded = false;

  async createContactLead(lead: InsertContactLead & { ip?: string; source?: string }): Promise<ContactLead> {
    const id = crypto.randomUUID();
    const newLead: ContactLead = {
      id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      impressions: lead.impressions,
      message: lead.message || null,
      ip: lead.ip || null,
      source: lead.source || "contact",
      status: "new",
      createdAt: new Date(),
      ...(Object.fromEntries(LEAD_DETAIL_COLUMNS.map(([key]) => [key, lead[key] ?? null])) as unknown as LeadDetails),
    };
    this.contactLeads.set(id, newLead);
    return newLead;
  }

  async getContactLeads(): Promise<ContactLead[]> {
    return Array.from(this.contactLeads.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getContactLeadById(id: string): Promise<ContactLead | undefined> {
    return this.contactLeads.get(id);
  }

  async updateContactLeadStatus(id: string, status: string): Promise<ContactLead | undefined> {
    const lead = this.contactLeads.get(id);
    if (!lead) return undefined;
    lead.status = status;
    return lead;
  }

  async getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values());
    const filtered = publishedOnly ? posts.filter(p => p.published === "true") : posts;
    return filtered.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(p => p.slug === slug);
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost & { publishedAt?: string | Date }): Promise<BlogPost> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newPost: BlogPost = {
      id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || null,
      author: post.author,
      category: post.category,
      tags: post.tags || null,
      published: post.published || "true",
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : now,
      updatedAt: now,
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    Object.assign(post, {
      ...updates,
      coverImage: updates.coverImage !== undefined ? (updates.coverImage || null) : post.coverImage,
      tags: updates.tags !== undefined ? (updates.tags || null) : post.tags,
      updatedAt: new Date(),
    });
    return post;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async getFieldOverrides(): Promise<Record<string, string>> {
    return Object.fromEntries(this.fieldOverrides);
  }

  async getFormSettings(): Promise<Record<string, string>> {
    return Object.fromEntries(this.formSettings);
  }

  async saveFieldOverride(key: string, config: string, before: string | null, actor: string): Promise<void> {
    this.fieldOverrides.set(key, config);
    this.formChanges.push({ id: crypto.randomUUID(), at: new Date().toISOString(), actor, target: `field:${key}`, before, after: config });
  }

  async saveFormSettings(changes: { key: string; value: string; before: string | null }[], actor: string): Promise<void> {
    const at = new Date().toISOString();
    for (const { key, value, before } of changes) {
      this.formSettings.set(key, value);
      this.formChanges.push({ id: crypto.randomUUID(), at, actor, target: `setting:${key}`, before, after: value });
    }
  }

  async getFormConfigChanges(limit: number): Promise<FormConfigChange[]> {
    return this.formChanges.slice(-limit).reverse();
  }

  async getActiveSellers(): Promise<SupplySeller[]> {
    return [...this.sellers.values()].filter((s) => !s.retiredAt).sort((a, b) => (a.sellerId < b.sellerId ? -1 : 1)).map((s) => ({ ...s }));
  }

  async getRetiredSellers(): Promise<SupplySeller[]> {
    return [...this.sellers.values()].filter((s) => s.retiredAt).sort((a, b) => b.retiredAt!.localeCompare(a.retiredAt!)).map((s) => ({ ...s }));
  }

  async getSeller(sellerId: string): Promise<SupplySeller | undefined> {
    const seller = this.sellers.get(sellerId);
    return seller && { ...seller };
  }

  // same guard as the D1 primary key
  async createSeller(seller: SupplySeller, actor: string): Promise<void> {
    if (this.sellers.has(seller.sellerId)) throw new Error("UNIQUE constraint failed: supply_sellers.seller_id");
    this.sellers.set(seller.sellerId, { ...seller });
    this.supplyAudit(seller.createdAt, actor, `seller:${seller.sellerId}`, null, JSON.stringify(seller));
  }

  async updateSeller(seller: SupplySeller, before: SupplySeller, actor: string): Promise<void> {
    if (this.sellers.get(seller.sellerId)?.retiredAt === null) this.sellers.set(seller.sellerId, { ...seller });
    this.supplyAudit(new Date().toISOString(), actor, `seller:${seller.sellerId}`, JSON.stringify(before), JSON.stringify(seller));
  }

  async retireSeller(before: SupplySeller, actor: string): Promise<void> {
    const at = new Date().toISOString();
    const seller = this.sellers.get(before.sellerId);
    if (seller && !seller.retiredAt) seller.retiredAt = at;
    this.supplyAudit(at, actor, `seller:${before.sellerId}`, JSON.stringify(before), JSON.stringify({ ...before, retiredAt: at }));
  }

  async getActiveAdsTxtLines(): Promise<AdsTxtLine[]> {
    return [...this.adsTxtLines.values()].filter((l) => !l.retiredAt).map((l) => ({ ...l }));
  }

  async getAdsTxtLine(id: string): Promise<AdsTxtLine | undefined> {
    const line = this.adsTxtLines.get(id);
    return line && { ...line };
  }

  async createAdsTxtLine(line: AdsTxtLine, actor: string): Promise<void> {
    this.adsTxtLines.set(line.id, { ...line });
    this.supplyAudit(line.createdAt, actor, `line:${line.id}`, null, JSON.stringify(line));
  }

  async retireAdsTxtLine(before: AdsTxtLine, actor: string): Promise<void> {
    const at = new Date().toISOString();
    const line = this.adsTxtLines.get(before.id);
    if (line && !line.retiredAt) line.retiredAt = at;
    this.supplyAudit(at, actor, `line:${before.id}`, JSON.stringify(before), JSON.stringify({ ...before, retiredAt: at }));
  }

  async getSupplySettings(keys: readonly string[]): Promise<Record<string, string>> {
    return Object.fromEntries([...this.supplySettings].filter(([key]) => keys.includes(key)));
  }

  async saveSupplySettings(changes: { key: string; value: string; before: string | null }[], actor: string): Promise<void> {
    const at = new Date().toISOString();
    for (const { key, value, before } of changes) {
      this.supplySettings.set(key, value);
      this.supplyAudit(at, actor, `setting:${key}`, before, value);
    }
  }

  async getSupplyChanges(limit: number): Promise<SupplyChange[]> {
    return this.supplyChanges.slice(-limit).reverse();
  }

  private supplyAudit(at: string, actor: string, target: string, before: string | null, after: string) {
    this.supplyChanges.push({ id: crypto.randomUUID(), at, actor, target, before, after });
  }

  async seedBlogPosts(): Promise<void> {
    if (this.seeded || this.blogPosts.size > 0) return;
    this.seeded = true;
    console.log("Seeding blog posts (in-memory)...");

    const posts: Array<InsertBlogPost & { publishedAt: string }> = LEGACY_POSTS.map((post) => ({ ...post, published: "true" }));

    for (const post of posts) {
      await this.createBlogPost(post);
    }
    console.log(`Seeded ${posts.length} blog posts.`);
  }
}
