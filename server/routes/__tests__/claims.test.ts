import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import { PAGE_ROUTES } from "../../config";

const app = new Hono();
const storage = new MemStorage();
beforeAll(async () => {
  await storage.seedBlogPosts();
  registerPageRoutes(app, () => storage);
});

// D-027: Matt's answers to the contradicting claims; the superseded wording must not come back
const SUPERSEDED = [/thousands of premium publisher/i, /average revenue increase of over 50%/i, /30[-–]50%/, /40[-–]60%/, /10M monthly impressions/, /100,000\+ monthly/, /\b50\+ (demand|premium|SSP)/, /no (monthly )?minimums/i];

describe("company claims (D-027)", () => {
  PAGE_ROUTES.forEach((route) => {
    it(`${route} carries no superseded claim`, async () => {
      const html = await (await app.request(route)).text();
      for (const re of SUPERSEDED) expect(html, `${route} ${re}`).not.toMatch(re);
    });
  });

  it("states the D-027 facts where they apply", async () => {
    const text = async (r: string) => (await app.request(r)).text();
    expect(await text("/advertisers")).toContain("47,000+ sites");
    expect(await text("/how-it-works")).toContain("500,000 monthly pageviews");
    expect(await text("/publishers")).toContain("500,000+ monthly pageviews");
    expect(await text("/solutions/header-bidding")).toContain("65+ demand sources");
    expect(await text("/solutions/in-app-ads")).toMatch(/in-app SDK or SDK-less/);
  });
});
