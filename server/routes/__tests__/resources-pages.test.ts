import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import { render404Page, render500Page } from "../../templates/pages/error";
import { existsSync } from "node:fs";
import { join } from "node:path";

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

// Content pass: invented press, jobs and benefits stay gone; industry facts stay current and sourced (docs/research/)
describe("resources pages carry real content", () => {
  it("/press has a fact sheet from D-005/D-027 and no invented releases", async () => {
    const html = main(await page("/press"));
    expect(html).not.toMatch(/London|Berlin|Top Ad Tech Company|AI-Powered|Surpasses 1 Trillion|Major CTV Platforms|200 nominees|Press Releases/);
    for (const fact of ["2015", "1B+", "1T+", "500+", "47,000+", "65+", "25+"]) expect(html).toContain(fact);
    expect(html).toContain('href="mailto:contact@hbdr.com"');
  });

  it("/press links only logo files that exist", async () => {
    const html = (await page("/press")).split('data-testid="card-brand-assets"')[1];
    const files = [...html.matchAll(/href="\/assets\/([^"]+)"/g)].map((m) => m[1]);
    expect(files.length).toBe(2);
    for (const f of files) expect(existsSync(join(process.cwd(), "public/assets", f)), f).toBe(true);
  });

  it("/careers lists no invented roles or benefits and says how to send a CV", async () => {
    const html = main(await page("/careers"));
    expect(html).not.toMatch(/Full-Stack Engineer|Ad Operations Manager|Product Designer|Data Scientist|New York|San Francisco|unlimited PTO|equity|Apply Now|Remote-First|retreats/i);
    expect(html).toContain("No open roles are listed right now");
    expect(html).toContain('href="mailto:contact@hbdr.com"');
  });

  it("/support states the D-027 minimum and current, sourced industry facts", async () => {
    const html = main(await page("/support"));
    expect(html).toContain("500,000+ monthly pageviews");
    expect(html).not.toMatch(/1 million\+|1M\+ monthly|global leader/);
    expect(html).not.toMatch(/\bFID\b|First Input Delay/);
    // Eastern Time, not EST, which is wrong half the year
    expect(html).toContain("Mon-Fri, 9am-6pm ET<");
    expect(html).not.toMatch(/\bEST\b/);
    expect(html).toContain("Interaction to Next Paint (200 milliseconds or less");
    // Google MCM: MA = parent has access, one parent; MI = no access, up to 15 parents
    expect(html).toContain("Under Manage Account, the parent has access to your account (except billing)");
    expect(html).toContain("Under Manage Inventory, the parent has no access to your account and manages the delegated inventory from its own network; you can have up to 15 such parents");
    expect(html).toContain("Source: Google Ad Manager Help, About Multiple Customer Management");
  });

  it("/tools explains its formulas and claims no unsourced benchmark", async () => {
    const html = main(await page("/tools"));
    expect(html).not.toMatch(/industry benchmarks|20-60%|5-20%|VPAID/);
    for (const id of ["tools-metrics-table", "tools-formulas-table"]) expect(html).toContain(`data-testid="${id}"`);
    expect(html).toContain("50% of the ad's pixels in view for at least 1 continuous second");
    expect(html).toContain("The timeout input is not priced");
  });

  it("/contact says what to send instead of a slogan", async () => {
    const html = main(await page("/contact"));
    expect(html).not.toMatch(/transform your ad revenue/i);
    expect(html).toContain("a link to your ads.txt file");
  });
});
