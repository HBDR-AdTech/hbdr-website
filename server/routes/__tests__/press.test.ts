import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import type { IStorage } from "../../services/storage";

function appWith(storage: IStorage) {
  const app = new Hono();
  registerPageRoutes(app, () => storage);
  return app;
}

const release = {
  title: "HBDR <b>news</b>", slug: "hbdr-news", excerpt: "A real release.", content: "<p>Body</p>",
  author: "HBDR Research", category: "Press", published: "true", publishedAt: "2026-10-20T00:00:00.000Z",
};

describe("/press releases (D-031)", () => {
  it("shows no releases section when no Press post exists", async () => {
    const html = await (await appWith(new MemStorage()).request("/press")).text();
    expect(html).toContain('data-testid="press-facts-section"');
    expect(html).not.toContain('data-testid="press-releases-section"');
  });

  it("lists published Press posts only, escaped and linked to the post", async () => {
    const storage = new MemStorage();
    await storage.createBlogPost(release);
    await storage.createBlogPost({ ...release, slug: "draft", title: "Draft", published: "false" });
    await storage.createBlogPost({ ...release, slug: "trend", title: "Trend piece", category: "Industry Trends" });
    const html = await (await appWith(storage).request("/press")).text();
    expect(html).toContain('data-testid="press-releases-section"');
    expect(html).toContain('href="/blog/hbdr-news"');
    expect(html).toContain("October 20, 2026");
    expect(html).not.toContain("<b>news</b>");
    expect(html).not.toMatch(/Draft|Trend piece/);
  });

  it("still renders the fact sheet when the blog read fails", async () => {
    const storage = new MemStorage();
    storage.getBlogPosts = async () => { throw new Error("D1 down"); };
    const res = await appWith(storage).request("/press");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('data-testid="press-facts-section"');
  });
});
