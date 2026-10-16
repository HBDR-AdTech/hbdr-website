import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";

const app = new Hono();
const storage = new MemStorage();
beforeAll(async () => {
  await storage.seedBlogPosts();
  registerPageRoutes(app, () => storage);
});

// D-020 rule 2: informational pages flow on hairlines; a box marks only a real object (form, table, diagram, demo)
const informational = [
  "/solutions/header-bidding", "/solutions/display-ads", "/solutions/video-player", "/solutions/ctv-ott", "/solutions/in-app-ads",
  "/solutions/mcm", "/solutions/manage-account", "/solutions/manage-inventory", "/solutions/open-bidding", "/solutions/ad-exchange-adx",
  "/publishers", "/advertisers", "/about", "/how-it-works", "/partners", "/trust", "/dashboard",
  "/careers", "/press", "/privacy-policy", "/terms", "/gdpr-cookie-policy", "/",
];

// The contact form is a real object and keeps its frame, so its section is cut out before checking
function withoutForms(html: string): string {
  return html.replace(/<section id="contact"[\s\S]*?<\/section>/g, "").replace(/<form[\s\S]*?<\/form>/g, "");
}

describe("blueprint design on every public page (D-020)", () => {
  informational.forEach((route) => {
    it(`${route} has no card grids, icon tiles or tag pills`, async () => {
      const html = withoutForms(await (await app.request(route)).text());
      expect(html).not.toMatch(/class="[^"]*\b(glass-card|icon-tile|glass-tag)\b/);
    });
  });
});
