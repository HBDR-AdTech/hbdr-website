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

// All static page routes that should return 200
const staticRoutes = [
  "/",
  "/about",
  "/how-it-works",
  "/careers",
  "/press",
  "/contact",
  "/solutions/header-bidding",
  "/solutions/display-ads",
  "/solutions/ctv-ott",
  "/solutions/in-app-ads",
  "/solutions/mcm",
  "/solutions/manage-account",
  "/solutions/manage-inventory",
  "/solutions/open-bidding",
  "/solutions/ad-exchange-adx",
  "/solutions/video-player",
  "/dashboard",
  "/partners",
  "/publishers",
  "/advertisers",
  "/trust",
  "/tools",
  "/privacy-policy",
  "/terms",
  "/gdpr-cookie-policy",
  "/support",
];

describe("page routes — 200 responses", () => {
  staticRoutes.forEach((route) => {
    it(`GET ${route} returns 200`, async () => {
      const res = await app.request(route);
      expect(res.status).toBe(200);
    });
  });
});

describe("blog routes", () => {
  it("GET /blog returns 200", async () => {
    const res = await app.request("/blog");
    expect(res.status).toBe(200);
  });

  it("GET /blog returns HTML with blog content", async () => {
    const res = await app.request("/blog");
    const html = await res.text();
    expect(html).toContain("Blog");
  });

  it("GET /blog/:slug returns 404 for missing slug", async () => {
    const res = await app.request("/blog/nonexistent-post-slug");
    expect(res.status).toBe(404);
  });
});

describe("page content structure", () => {
  // Without JS or with reduced motion the server-rendered auction is all a visitor sees, so it must be a finished one
  it("homepage renders a closed auction with exactly one winner", async () => {
    const html = await (await app.request("/")).text();
    expect(html).toContain('class="auction is-closed');
    expect(html.match(/auction-row is-winner/g)).toHaveLength(1);
    expect(html).toContain("SOLD $4.86");
    expect(html).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
  });

  // D-021: no testimonials until Matt supplies real ones
  it("homepage carries no testimonials", async () => {
    const html = await (await app.request("/")).text();
    expect(html).not.toContain("testimonials-section");
    expect(html).not.toContain("TechMedia Group");
  });

  // D-020 rule 4: GSAP only where a page has authored motion
  it("GSAP loads on the home page only when asked for", async () => {
    expect(await (await app.request("/")).text()).toContain("gsap/3.12.5/gsap.min.js");
    expect(await (await app.request("/about")).text()).not.toContain("gsap.min.js");
  });

  it("homepage includes styles.css link", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain('href="/assets/styles.css"');
  });

  it("pages include navigation", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain('data-testid="navigation"');
  });

  it("pages include footer", async () => {
    const res = await app.request("/about");
    const html = await res.text();
    expect(html).toContain('data-testid="footer"');
  });
});

describe("support page Turnstile", () => {
  it("renders the widget only when a site key is set", async () => {
    const { renderFaqSupportPage } = await import("../../templates/pages/support");
    expect(renderFaqSupportPage()).not.toContain("data-testid=\"turnstile-widget\"");
    expect(renderFaqSupportPage("0x4AAA\"<x>")).toContain('data-sitekey="0x4AAA&quot;&lt;x&gt;"');
  });
});

// A compromised CDN must not be able to run code on hbdr.com
describe("third-party scripts", () => {
  it("every external script carries an SRI hash", async () => {
    for (const route of [...staticRoutes, "/blog"]) {
      const html = await (await app.request(route)).text();
      const tags = [...html.matchAll(/<script\b[^>]*\bsrc="(?:https?:)?\/\/[^"]*"[^>]*>/g)].map((m) => m[0]);
      expect(tags.length, route).toBeGreaterThan(0);
      for (const tag of tags) expect(tag, route).toMatch(/ integrity="sha384-[A-Za-z0-9+/]{64}" crossorigin="anonymous"/);
    }
  });
});
