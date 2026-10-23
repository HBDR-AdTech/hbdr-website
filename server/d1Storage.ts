/// <reference types="@cloudflare/workers-types" />
import type {
  IStorage, ContactLead, BlogPost, InsertContactLead, InsertBlogPost, LeadDetails, FormConfigChange,
  SupplySeller, AdsTxtLine, SupplyChange,
} from "./services/storage";
import { LEAD_DETAIL_COLUMNS } from "./services/storage";

const SELLER_COLUMNS = "seller_id, name, domain, seller_type, is_confidential, comment, created_at, retired_at";
const LINE_COLUMNS = "id, ad_system_domain, account_id, relationship, cert_authority_id, comment, created_at, retired_at";

const mapSeller = (r: any): SupplySeller => ({
  sellerId: r.seller_id, name: r.name, domain: r.domain, sellerType: r.seller_type,
  isConfidential: r.is_confidential === 1, comment: r.comment, createdAt: r.created_at, retiredAt: r.retired_at,
});

const mapLine = (r: any): AdsTxtLine => ({
  id: r.id, adSystemDomain: r.ad_system_domain, accountId: r.account_id, relationship: r.relationship,
  certAuthorityId: r.cert_authority_id, comment: r.comment, createdAt: r.created_at, retiredAt: r.retired_at,
});

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

  // Both seller reads go through supply_sellers_active (retired_at, seller_id): a SEARCH, already in seller_id order
  async getActiveSellers(): Promise<SupplySeller[]> {
    const { results } = await this.db.prepare(`SELECT ${SELLER_COLUMNS} FROM supply_sellers WHERE retired_at IS NULL ORDER BY seller_id`).all();
    return results.map(mapSeller);
  }

  async getRetiredSellers(): Promise<SupplySeller[]> {
    const { results } = await this.db.prepare(`SELECT ${SELLER_COLUMNS} FROM supply_sellers WHERE retired_at IS NOT NULL ORDER BY retired_at DESC`).all();
    return results.map(mapSeller);
  }

  async getSeller(sellerId: string): Promise<SupplySeller | undefined> {
    const row = await this.db.prepare(`SELECT ${SELLER_COLUMNS} FROM supply_sellers WHERE seller_id = ?`).bind(sellerId).first();
    return row ? mapSeller(row) : undefined;
  }

  // The seller_id primary key is the reuse guard: a second insert of a taken id (retired or not) throws and rolls back its audit row
  async createSeller(seller: SupplySeller, actor: string): Promise<void> {
    await this.db.batch([
      this.db.prepare(
        "INSERT INTO supply_sellers (seller_id, name, domain, seller_type, is_confidential, comment, created_at, retired_at) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)"
      ).bind(seller.sellerId, seller.name, seller.domain, seller.sellerType, seller.isConfidential ? 1 : 0, seller.comment, seller.createdAt),
      this.supplyAuditRow(seller.createdAt, actor, `seller:${seller.sellerId}`, null, JSON.stringify(seller)),
    ]);
  }

  // retired_at IS NULL in the WHERE: a retired seller is never changed, even by a write that raced its retirement
  async updateSeller(seller: SupplySeller, before: SupplySeller, actor: string): Promise<void> {
    await this.db.batch([
      this.db.prepare(
        "UPDATE supply_sellers SET name = ?, domain = ?, seller_type = ?, is_confidential = ?, comment = ? WHERE seller_id = ? AND retired_at IS NULL"
      ).bind(seller.name, seller.domain, seller.sellerType, seller.isConfidential ? 1 : 0, seller.comment, seller.sellerId),
      this.supplyAuditRow(new Date().toISOString(), actor, `seller:${seller.sellerId}`, JSON.stringify(before), JSON.stringify(seller)),
    ]);
  }

  async retireSeller(before: SupplySeller, actor: string): Promise<void> {
    const at = new Date().toISOString();
    await this.db.batch([
      this.db.prepare("UPDATE supply_sellers SET retired_at = ? WHERE seller_id = ? AND retired_at IS NULL").bind(at, before.sellerId),
      this.supplyAuditRow(at, actor, `seller:${before.sellerId}`, JSON.stringify(before), JSON.stringify({ ...before, retiredAt: at })),
    ]);
  }

  async getActiveAdsTxtLines(): Promise<AdsTxtLine[]> {
    const { results } = await this.db.prepare(`SELECT ${LINE_COLUMNS} FROM supply_ads_txt_lines WHERE retired_at IS NULL ORDER BY created_at`).all();
    return results.map(mapLine);
  }

  async getAdsTxtLine(id: string): Promise<AdsTxtLine | undefined> {
    const row = await this.db.prepare(`SELECT ${LINE_COLUMNS} FROM supply_ads_txt_lines WHERE id = ?`).bind(id).first();
    return row ? mapLine(row) : undefined;
  }

  async createAdsTxtLine(line: AdsTxtLine, actor: string): Promise<void> {
    await this.db.batch([
      this.db.prepare(
        "INSERT INTO supply_ads_txt_lines (id, ad_system_domain, account_id, relationship, cert_authority_id, comment, created_at, retired_at) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)"
      ).bind(line.id, line.adSystemDomain, line.accountId, line.relationship, line.certAuthorityId, line.comment, line.createdAt),
      this.supplyAuditRow(line.createdAt, actor, `line:${line.id}`, null, JSON.stringify(line)),
    ]);
  }

  async retireAdsTxtLine(before: AdsTxtLine, actor: string): Promise<void> {
    const at = new Date().toISOString();
    await this.db.batch([
      this.db.prepare("UPDATE supply_ads_txt_lines SET retired_at = ? WHERE id = ? AND retired_at IS NULL").bind(at, before.id),
      this.supplyAuditRow(at, actor, `line:${before.id}`, JSON.stringify(before), JSON.stringify({ ...before, retiredAt: at })),
    ]);
  }

  // Named keys only: a primary-key SEARCH per key rather than a read of the whole table
  async getSupplySettings(keys: readonly string[]): Promise<Record<string, string>> {
    const { results } = await this.db.prepare(`SELECT key, value FROM supply_settings WHERE key IN (${keys.map(() => "?").join(", ")})`)
      .bind(...keys).all<{ key: string; value: string }>();
    return Object.fromEntries(results.map((r) => [r.key, r.value]));
  }

  async saveSupplySettings(changes: { key: string; value: string; before: string | null }[], actor: string): Promise<void> {
    if (!changes.length) return;
    const at = new Date().toISOString();
    await this.db.batch(changes.flatMap(({ key, value, before }) => [
      this.db.prepare(
        "INSERT INTO supply_settings (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by"
      ).bind(key, value, at, actor),
      this.supplyAuditRow(at, actor, `setting:${key}`, before, value),
    ]));
  }

  async getSupplyChanges(limit: number): Promise<SupplyChange[]> {
    const { results } = await this.db.prepare(
      "SELECT id, at, actor, target, before, after FROM supply_changes ORDER BY at DESC LIMIT ?"
    ).bind(limit).all<SupplyChange>();
    return results;
  }

  private supplyAuditRow(at: string, actor: string, target: string, before: string | null, after: string) {
    return this.db.prepare("INSERT INTO supply_changes (id, at, actor, target, before, after) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), at, actor, target, before, after);
  }

  async seedBlogPosts(): Promise<void> {
    const { results } = await this.db.prepare("SELECT COUNT(*) as count FROM blog_posts").all();
    const count = (results[0] as any).count;
    if (count > 0) return;

    console.log("Seeding blog posts to D1...");
    const posts = [
      {
        title: "The Future of Header Bidding: Trends to Watch in 2025",
        slug: "future-of-header-bidding-2025",
        excerpt: "Header bidding continues to evolve rapidly. From server-side auctions to AI-powered optimization, discover the key trends shaping the future of programmatic advertising.",
        content: `<h2>The Evolving Landscape of Header Bidding</h2><p>Header bidding has revolutionized the way publishers monetize their digital inventory. What started as a simple client-side auction mechanism has grown into a sophisticated ecosystem that drives higher CPMs and increased revenue for publishers worldwide.</p><h3>1. Server-Side Header Bidding Takes Center Stage</h3><p>The shift from client-side to server-side header bidding continues to accelerate. Server-side solutions reduce page latency, improve user experience, and allow publishers to connect with more demand partners simultaneously. At HBDR, we've seen publishers experience up to 30% faster page load times after migrating to server-side implementations.</p><h3>2. AI-Powered Bid Optimization</h3><p>Machine learning algorithms are becoming essential tools for optimizing bid responses. These systems analyze billions of data points in real-time to predict the optimal floor prices, identify high-value impressions, and dynamically adjust auction parameters. Publishers using AI-driven optimization report an average 15-25% increase in programmatic revenue.</p><h3>3. Privacy-First Monetization</h3><p>With the deprecation of third-party cookies and increasing privacy regulations, the industry is adapting. Contextual targeting, first-party data strategies, and privacy-compliant identity solutions are becoming critical components of any header bidding setup.</p><h3>4. Video and Connected TV Integration</h3><p>Header bidding is expanding beyond traditional display advertising. Video header bidding, particularly for Connected TV (CTV) inventory, represents one of the fastest-growing segments in programmatic.</p><h3>Looking Ahead</h3><p>The header bidding landscape will continue to evolve, but the core principle remains the same: creating fair, transparent auctions that maximize publisher revenue while delivering value to advertisers.</p>`,
        author: "Sarah Chen",
        category: "Industry Trends",
        tags: "header bidding,programmatic,trends,2025",
        published: "true",
        publishedAt: "2025-01-15T00:00:00.000Z",
      },
      {
        title: "How Publishers Can Maximize Ad Revenue Without Sacrificing User Experience",
        slug: "maximize-ad-revenue-user-experience",
        excerpt: "Balancing ad revenue with user experience is one of the biggest challenges publishers face. Learn proven strategies to optimize both simultaneously.",
        content: `<h2>The Revenue vs. Experience Balancing Act</h2><p>Every publisher faces the same fundamental challenge: maximizing ad revenue while maintaining a positive user experience.</p><h3>Strategic Ad Placement</h3><p>Not all ad placements are created equal. Research shows that ads placed within content generate significantly higher engagement and CPMs than sidebar or footer placements.</p><h3>Lazy Loading for Performance</h3><p>Implementing lazy loading for ad units that appear below the fold can dramatically improve page load times.</p><h3>Optimizing Ad Density</h3><p>Google's Better Ads Standards provide clear guidelines on ad density. Pages should maintain a maximum ad density of 30% on mobile.</p><h3>Core Web Vitals Optimization</h3><p>Google's Core Web Vitals directly impact search rankings and user experience. Publishers should monitor their LCP, FID, and CLS scores.</p><h3>The HBDR Approach</h3><p>At HBDR, we use proprietary algorithms to determine the optimal ad configuration for each page and user segment.</p>`,
        author: "Marcus Johnson",
        category: "Best Practices",
        tags: "user experience,ad revenue,optimization,core web vitals",
        published: "true",
        publishedAt: "2025-01-08T00:00:00.000Z",
      },
      {
        title: "Understanding Programmatic Advertising: A Complete Guide for Publishers",
        slug: "understanding-programmatic-advertising-guide",
        excerpt: "New to programmatic advertising? This comprehensive guide breaks down everything publishers need to know about RTB, header bidding, and maximizing yield.",
        content: `<h2>What is Programmatic Advertising?</h2><p>Programmatic advertising is the automated buying and selling of digital ad inventory using technology and data.</p><h3>Key Components of the Programmatic Ecosystem</h3><p><strong>Supply-Side Platforms (SSPs)</strong> help publishers manage and sell their ad inventory.</p><p><strong>Demand-Side Platforms (DSPs)</strong> allow advertisers to bid on and purchase ad inventory across multiple publishers simultaneously.</p><p><strong>Ad Exchanges</strong> are digital marketplaces where SSPs and DSPs connect.</p><h3>Real-Time Bidding (RTB) Explained</h3><p>RTB is the process by which individual ad impressions are bought and sold in real-time auctions.</p><h3>Where Header Bidding Fits In</h3><p>Header bidding is an advanced programmatic technique that allows publishers to offer inventory to multiple ad exchanges simultaneously.</p><h3>Getting Started with Programmatic</h3><p>Publishers looking to enter the programmatic space should start by partnering with an experienced monetization platform like HBDR.</p>`,
        author: "Elena Rodriguez",
        category: "Education",
        tags: "programmatic,RTB,header bidding,guide,beginners",
        published: "true",
        publishedAt: "2024-12-20T00:00:00.000Z",
      },
      {
        title: "HBDR Launches Next-Generation Server-Side Bidding Platform",
        slug: "hbdr-launches-server-side-bidding-platform",
        excerpt: "We're excited to announce the launch of our next-generation server-side bidding platform, delivering faster auctions, higher fill rates, and improved publisher revenue.",
        content: `<h2>Introducing HBDR Server-Side Bidding 2.0</h2><p>Today, we're thrilled to announce the launch of our next-generation server-side bidding platform.</p><h3>What's New</h3><p><strong>Ultra-Low Latency Auctions:</strong> Our new infrastructure processes bid requests in under 50ms, a 60% improvement over our previous platform.</p><p><strong>Expanded Demand Partners:</strong> We've integrated 40+ new demand partners, bringing our total to over 200 active bidders.</p><p><strong>Intelligent Floor Pricing:</strong> Our new machine learning model analyzes historical bid data to set optimal floor prices in real-time.</p><h3>Results from Beta Testing</h3><ul><li>Average revenue increase of 35%</li><li>Page load time improvement of 40%</li><li>Ad viewability rates increased by 18%</li><li>Fill rate improvement of 12%</li></ul><h3>Availability</h3><p>The new platform is available immediately for all existing HBDR partners.</p>`,
        author: "David Park",
        category: "Product Updates",
        tags: "product launch,server-side bidding,platform,announcement",
        published: "true",
        publishedAt: "2025-02-01T00:00:00.000Z",
      },
      {
        title: "5 Common Header Bidding Mistakes and How to Avoid Them",
        slug: "common-header-bidding-mistakes",
        excerpt: "Even experienced publishers make these header bidding mistakes. Learn what they are and how to fix them to unlock your full revenue potential.",
        content: `<h2>Are You Leaving Money on the Table?</h2><p>Header bidding is powerful, but it's only as effective as its implementation.</p><h3>Mistake #1: Too Many Demand Partners</h3><p>More isn't always better. Adding too many demand partners to a client-side setup can dramatically slow down page loads.</p><h3>Mistake #2: Static Timeout Settings</h3><p>Many publishers set a single, static timeout for all bid requests. Implementing dynamic timeouts can increase bid responses by 15-20%.</p><h3>Mistake #3: Ignoring Price Floors</h3><p>Running without price floors or with outdated floor prices is one of the quickest ways to leave money on the table.</p><h3>Mistake #4: Not Monitoring Discrepancies</h3><p>Revenue discrepancies between your ad server and SSP reports can add up quickly.</p><h3>Mistake #5: One-Size-Fits-All Configuration</h3><p>Different pages, content types, and user segments deserve different ad configurations.</p><h3>The Fix</h3><p>At HBDR, our platform addresses all five of these common issues automatically.</p>`,
        author: "Sarah Chen",
        category: "Best Practices",
        tags: "header bidding,mistakes,optimization,tips",
        published: "true",
        publishedAt: "2025-01-22T00:00:00.000Z",
      },
    ];

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
