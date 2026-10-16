import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import { render404Page, render500Page } from "../../templates/pages/error";

const app = new Hono();
const storage = new MemStorage();

beforeAll(async () => {
  await storage.seedBlogPosts();
  registerPageRoutes(app, () => storage);
});

const page = async (path: string) => (await app.request(path)).text();
// The page body only: nav and footer belong to the shared layout
const main = (html: string) => html.replace(/<nav[\s\S]*?<\/nav>/, "").replace(/<footer[\s\S]*?<\/footer>/, "");

const routes = ["/careers", "/press", "/support", "/blog", "/blog/future-of-header-bidding-2025", "/privacy-policy", "/terms", "/gdpr-cookie-policy", "/tools"];

// D-020: resources, legal and tools pages flow on hairlines; no card grids, icon tiles or tag pills
describe("resources pages use the blueprint idiom", () => {
  it.each(routes)("%s has no glass cards, icon tiles or tag pills", async (route) => {
    const html = main(await page(route));
    expect(html).not.toMatch(/glass-card|icon-tile|glass-tag/);
    expect(html).toContain("bp-wrap");
  });

  it("error pages have no glass cards and keep their links", () => {
    const html404 = main(render404Page());
    expect(html404).not.toMatch(/glass-card|icon-tile|glass-tag/);
    for (const id of ["home", "solutions", "publishers", "blog", "contact", "tools"]) expect(html404).toContain(`data-testid="link-404-${id}"`);
    expect(main(render500Page())).not.toMatch(/glass-card|icon-tile|glass-tag/);
  });

  it("legal pages carry a contents list whose links reach their numbered sections", async () => {
    for (const route of ["/privacy-policy", "/terms", "/gdpr-cookie-policy"]) {
      const html = await page(route);
      const links = [...html.matchAll(/<li><a href="#([a-z0-9-]+)"><span class="mono">\d{2}<\/span>/g)].map((m) => m[1]);
      expect(links.length, route).toBeGreaterThan(3);
      for (const id of links) expect(html, `${route} #${id}`).toContain(`<section class="legal-sec" id="${id}"`);
    }
  });

  it("the support form still posts as a support request through the contact API", async () => {
    const html = await page("/support");
    for (const id of ["support-form", "input-support-name", "input-support-email", "select-support-subject", "select-support-priority", "textarea-support-description", "button-submit-support"]) {
      expect(html).toContain(`data-testid="${id}"`);
    }
    expect(html).toContain("impressions: 'support-request'");
    expect(html).toContain("_source: 'support'");
  });

  it("every calculator keeps its frame and Alpine state", async () => {
    const html = await page("/tools");
    for (const [tab, tool] of [["display", "display"], ["hb", "hb-uplift"], ["video", "video"], ["inapp", "inapp"], ["ctv", "ctv"]]) {
      expect(html).toMatch(new RegExp(`<div class="bp-frame calc" data-testid="tool-${tool}" x-data="`));
      expect(html).toContain(`data-testid="tab-${tab}"`);
    }
  });
});
