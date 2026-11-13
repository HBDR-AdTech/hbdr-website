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

// D-029, D-030, D-031: removed claims stay removed on every public page
const REMOVED = [
  /certified (Google )?MCM/i, /TAG[- ]certified|TAG \(Trustworthy|Trustworthy Accountability Group/i, /IAB member/i,
  /Certified Publishing Partner|\bGCPP\b/, /Prebid(\.org)? member/i, /Revenue Guarantee/i, /24\/7 (technical )?support/i,
  /real-time (analytics )?dashboard/i, /every few minutes/, /\b(5|2)[-–](7|3) business days/, /\b(1|2)[-–](2|4) weeks/,
  /x\.com\/haborMedia/, /incremental revenue we generate/, /Net-60/, /minimum payment threshold/, /retention rate/i,
  /Sub-100ms|&lt; 100 ms|less than 100ms/, /above (70|85)%/, /90%\+ completion/, /\+35%|× 1\.35/, /AdLightning/,
  /Xandr Invest|EMX Digital|MOAT \(Oracle\)/,
  // Gaps the 2026-10-25 verifier found by putting each claim back: these must fail too
  /real[- ]time (analytics|revenue|reporting|dashboard|metrics|visibility)|(dashboard|reporting|metrics)[^.<]{0,40}real[- ]time|(updates?|updated|track[^.<]{0,40}) in real time/i,
  /Amazon APS \(A9\)/, /(?<!Infillion \(|acquired )MediaMath/, /(?<!formerly )\bCentro\b/,
  /\$100 (minimum|threshold)|minimum payment/i, /\b95%/, /viewability (rates? )?(above|over|of) \d{2}%|\d{2}%\+? viewability/i,
  /(go[- ]live|live|delivered|replies|get back to you|sent) within \d+(\s?[-–]\s?\d+)? (hours|weeks)/i, /\b(2[-–]3|5[-–]10)\s?[x×]/i,
  /billions of bid signals|pricing tiers|priority support channels|exclusive demand|no intermediary fees/i,
  /We build a custom PMP|Delivery is guaranteed|malvertising protection/i,
];

describe("company facts (D-029, D-030, D-031)", () => {
  PAGE_ROUTES.forEach((route) => {
    it(`${route} carries no removed claim`, async () => {
      const html = await (await app.request(route)).text();
      for (const re of REMOVED) expect(html, `${route} ${re}`).not.toMatch(re);
    });
  });

  const text = async (r: string) => (await app.request(r)).text();

  it("states terms, go-live and support the way Matt set them", async () => {
    const pub = await text("/publishers");
    expect(pub).toContain("1–3 business days");
    expect(pub).toContain("Net 30 for Google revenue and Net 60 for other sources");
    expect(pub).toContain("from HBDR's own ad units up to the whole page");
    const support = await text("/support");
    for (const s of ["Net 30", "Net 60", "PayPal", "Mon–Fri, 9am–6pm ET", "Tickets open 24/7"]) expect(support).toContain(s);
    expect(await text("/solutions/mcm")).toContain("MCM parent on Google Ad Manager 360");
  });

  it("shows only live features as available now (D-031)", async () => {
    const { FEATURES_NOW, FEATURES_SOON } = await import("../../templates/components/features");
    const now = JSON.stringify(FEATURES_NOW);
    expect(now).not.toMatch(/Confiant|IAS|DoubleVerify|WordPress|real[- ]time/i);
    expect(JSON.stringify(FEATURES_SOON)).toMatch(/Confiant/);
    for (const r of ["/publishers", "/how-it-works"]) {
      const html = await text(r);
      expect(html).toContain("Available now");
      expect(html).toContain("Coming soon");
    }
  });

  it("dates the milestones 2024 and 2025 and drops the X link (D-030)", async () => {
    const about = await text("/about");
    expect(about).toMatch(/2024[\s\S]{0,400}1B Monthly Impressions/);
    expect(about).toMatch(/2025[\s\S]{0,400}1 Trillion Ads Served/);
    expect(about).not.toContain('"2020"');
    expect(await text("/press")).toMatch(/1B a month in <span class="mono">2024<\/span>; 1T total in <span class="mono">2025<\/span>/);
    const home = await text("/");
    expect(home).not.toMatch(/x\.com|button-social-twitter/);
  });
});
