// SEO routes — robots.txt and sitemap.xml
import type { Hono } from "hono";
import { SITE_URL, PAGE_ROUTES } from "../config";
import type { IStorage } from "../services/storage";
import { sanitizeText } from "../middleware/sanitize";

export function registerSeoRoutes(app: Hono<any>, getStorage: (c: any) => IStorage) {
  app.get("/robots.txt", (c) => {
    return c.text(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  app.get("/sitemap.xml", async (c) => {
    const posts = await getStorage(c).getBlogPosts();
    const urls = [
      ...PAGE_ROUTES.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`),
      ...posts.map((post) => {
        const lastmod = post.updatedAt ?? post.publishedAt;
        return `  <url><loc>${SITE_URL}/blog/${sanitizeText(post.slug)}</loc>${lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ""}</url>`;
      }),
    ].join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    return c.text(xml, 200, { "Content-Type": "application/xml" });
  });
}
