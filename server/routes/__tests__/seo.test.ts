import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { registerSeoRoutes } from "../seo";
import { MemStorage } from "../../services/mem-storage";

describe("GET /sitemap.xml", () => {
  it("lists static pages and every published blog post with lastmod", async () => {
    const storage = new MemStorage();
    await storage.seedBlogPosts();
    const app = new Hono();
    registerSeoRoutes(app, () => storage);

    const res = await app.request("/sitemap.xml");
    const xml = await res.text();
    expect(res.headers.get("Content-Type")).toContain("application/xml");
    expect(xml).toContain("<loc>https://hbdr.com/about</loc>");

    const posts = await storage.getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(xml).toMatch(new RegExp(`<loc>https://hbdr.com/blog/${post.slug}</loc><lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`));
    }
  });
});
