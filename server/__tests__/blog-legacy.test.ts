import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { D1Storage } from "../d1Storage";
import { MemStorage } from "../services/mem-storage";
import { LEGACY_POSTS } from "../services/legacy-posts";

// The production rewrite of the five legacy posts (D-030 row 14) runs against SQLite with every migration
// and the rows as they were before it, so the file Matt runs is the file under test.
const root = join(__dirname, "..", "..");
const migrations = join(root, "migrations");
const rewrite = readFileSync(join(root, "seed", "blog-legacy-rewrite-2026-10-24.sql"), "utf8");

const INVENTED = ["Sarah Chen", "Marcus Johnson", "Elena Rodriguez", "David Park", "200 active bidders", "Server-Side Bidding 2.0", "HBDR Launches", "35%"];

// The five rows as the old dev seed wrote them (title, author and the invented claims that must go)
const ORIGINALS = [
  ["future-of-header-bidding-2025", "The Future of Header Bidding: Trends to Watch in 2025", "Sarah Chen", "Industry Trends", "2025-01-15T00:00:00.000Z", "At HBDR, we've seen publishers experience up to 30% faster page load times"],
  ["maximize-ad-revenue-user-experience", "How Publishers Can Maximize Ad Revenue Without Sacrificing User Experience", "Marcus Johnson", "Best Practices", "2025-01-08T00:00:00.000Z", "Publishers should monitor their LCP, FID, and CLS scores."],
  ["understanding-programmatic-advertising-guide", "Understanding Programmatic Advertising: A Complete Guide for Publishers", "Elena Rodriguez", "Education", "2024-12-20T00:00:00.000Z", "partnering with an experienced monetization platform like HBDR."],
  ["hbdr-launches-server-side-bidding-platform", "HBDR Launches Next-Generation Server-Side Bidding Platform", "David Park", "Product Updates", "2025-02-01T00:00:00.000Z", "<h2>Introducing HBDR Server-Side Bidding 2.0</h2><p>bringing our total to over 200 active bidders.</p><li>Average revenue increase of 35%</li>"],
  ["common-header-bidding-mistakes", "5 Common Header Bidding Mistakes and How to Avoid Them", "Sarah Chen", "Best Practices", "2025-01-22T00:00:00.000Z", "Implementing dynamic timeouts can increase bid responses by 15-20%."],
];

const statements = rewrite.split(/^(?=UPDATE )/m).slice(1).map((s) => s.trim());

function migrated() {
  const db = new DatabaseSync(":memory:");
  for (const file of readdirSync(migrations).sort()) db.exec(readFileSync(join(migrations, file), "utf8"));
  return db;
}

let db: DatabaseSync;

beforeEach(() => {
  db = migrated();
  const insert = db.prepare("INSERT INTO blog_posts (title, slug, excerpt, content, author, category, tags, published, published_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'true', ?, ?)");
  for (const [slug, title, author, category, at, content] of ORIGINALS) insert.run(title, slug, "old excerpt", content, author, category, "old,tags", at, at);
  // a backfill post the rewrite must not touch
  insert.run("Header Bidding Timeouts", "header-bidding-timeouts-find-the-right-number", "x", "<p>x</p>", "HBDR Research", "Best Practices", "timeouts", "2025-02-24T13:00:00.000Z", "2025-02-24T13:00:00.000Z");
});

const rows = () => db.prepare("SELECT * FROM blog_posts ORDER BY slug").all() as Record<string, string>[];

describe("legacy blog post rewrite (seed/blog-legacy-rewrite-2026-10-24.sql)", () => {
  it("updates exactly the five legacy rows to the shared post text, bylined HBDR Research", () => {
    const before = Number((db.prepare("SELECT total_changes() AS n").get() as { n: number }).n);
    db.exec(rewrite);
    const after = Number((db.prepare("SELECT total_changes() AS n").get() as { n: number }).n);
    expect(after - before).toBe(5);

    for (const post of LEGACY_POSTS) {
      const row = db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(post.slug) as Record<string, string>;
      expect(row).toMatchObject({
        title: post.title, excerpt: post.excerpt, content: post.content, author: "HBDR Research", tags: post.tags,
        category: post.category, published_at: post.publishedAt, published: "true",
      });
      expect(row.updated_at).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/);
      expect(row.updated_at > post.publishedAt).toBe(true);
    }
    // D-037: the old launch post now teaches, so it moves to Education; every other category stays
    const expected = ORIGINALS.map(([s, , , c, at]) => [s, s === "hbdr-launches-server-side-bidding-platform" ? "Education" : c, at]);
    expect(LEGACY_POSTS.map((p) => [p.slug, p.category, p.publishedAt]).sort()).toEqual(expected.sort());

    const untouched = db.prepare("SELECT * FROM blog_posts WHERE slug = 'header-bidding-timeouts-find-the-right-number'").get() as Record<string, string>;
    expect(untouched).toMatchObject({ title: "Header Bidding Timeouts", content: "<p>x</p>", updated_at: "2025-02-24T13:00:00.000Z" });
  });

  it("leaves no invented person, product or figure in the table", () => {
    db.exec(rewrite);
    const all = JSON.stringify(rows());
    for (const phrase of INVENTED) expect(all).not.toContain(phrase);
    expect(rows().filter((r) => r.slug !== "header-bidding-timeouts-find-the-right-number").map((r) => r.author)).toEqual(Array(5).fill("HBDR Research"));
  });

  // One index row per statement however many posts the blog holds; a SCAN would read the whole table
  it("finds each row through the slug's unique index", () => {
    expect(statements).toHaveLength(5);
    for (const sql of statements) {
      const plan = (db.prepare(`EXPLAIN QUERY PLAN ${sql.replace(/;$/, "")}`).all() as { detail: string }[]).map((r) => r.detail).join("\n");
      expect(plan).toBe("SEARCH blog_posts USING INDEX sqlite_autoindex_blog_posts_2 (slug=?)");
      expect(plan).not.toContain("SCAN");
    }
  });

  it("keeps each post to the allowed tags, a Sources list and a short excerpt", () => {
    for (const post of LEGACY_POSTS) {
      const tags = new Set([...post.content.matchAll(/<\/?([a-z0-9]+)/g)].map((m) => m[1]));
      expect([...tags].filter((t) => !["h2", "h3", "p", "ul", "li", "strong", "a"].includes(t))).toEqual([]);
      expect(post.content).toContain("<h2>Sources</h2>");
      expect(post.excerpt.length).toBeLessThanOrEqual(200);
      const words = post.content.split("<h2>Sources</h2>")[0].replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      expect(words).toBeGreaterThanOrEqual(600);
      expect(words).toBeLessThanOrEqual(1000);
    }
  });
});

describe("dev seeds match production after the rewrite", () => {
  it("MemStorage seeds the same five posts with no invented author", async () => {
    const storage = new MemStorage();
    await storage.seedBlogPosts();
    const posts = await storage.getBlogPosts();
    expect(posts).toHaveLength(5);
    for (const post of posts) expect(post.author).toBe("HBDR Research");
    expect(JSON.stringify(posts)).not.toMatch(new RegExp(INVENTED.join("|")));
  });

  it("D1Storage seeds rows identical to the rewritten production rows", async () => {
    db.exec(rewrite);
    const fresh = migrated();
    const statement = (sql: string, params: unknown[] = []) => ({
      bind: (...p: unknown[]) => statement(sql, p),
      all: async () => ({ results: fresh.prepare(sql).all(...(params as [])) }),
      run: async () => fresh.prepare(sql).run(...(params as [])),
    });
    await new D1Storage({ prepare: (sql: string) => statement(sql) } as unknown as D1Database).seedBlogPosts();
    const pick = (r: Record<string, string>) => [r.slug, r.title, r.excerpt, r.content, r.author, r.category, r.tags, r.published_at];
    const seeded = (fresh.prepare("SELECT * FROM blog_posts ORDER BY slug").all() as Record<string, string>[]).map(pick);
    expect(seeded).toEqual(rows().filter((r) => r.slug !== "header-bidding-timeouts-find-the-right-number").map(pick));
  });

  it("no seed source names an invented author", () => {
    for (const file of ["server/d1Storage.ts", "server/services/mem-storage.ts", "server/services/legacy-posts.ts"]) {
      const source = readFileSync(join(root, file), "utf8");
      for (const name of INVENTED.slice(0, 4)) expect(source).not.toContain(name);
    }
  });
});
