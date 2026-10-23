import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import { MEASURED_COOKIES } from "../../templates/pages/legal/gdpr-cookie-policy";

const app = new Hono();
const storage = new MemStorage();
beforeAll(async () => {
  await storage.seedBlogPosts();
  registerPageRoutes(app, () => storage);
});

const page = async (path: string) => (await app.request(path)).text();
const legal = ["/privacy-policy", "/terms", "/gdpr-cookie-policy"];

// Cookies the old cookie policy listed; hbdr.com never set any of them (measured 2026-10-23, docs/research/legal.md)
const INVENTED_COOKIES = ["_hbdr_session", "_hbdr_csrf", "_hbdr_consent", "_ga", "_ga_*", "_gid", "_pbjs_userid_*", "__gads", "_hbdr_prefs", "_hbdr_tz"];
// Measured on live hbdr.com/admin (CF_AppSession) or documented by Cloudflare Access (CF_Authorization)
const MEASURED = ["CF_AppSession", "CF_Authorization"];

describe("legal pages describe what the site does (D-030 row 13, D-032)", () => {
  it.each(legal)("%s renders and names the legal entity, its address and the real mailbox", async (route) => {
    const res = await app.request(route);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("HeaderBiddr LLC");
    expect(html).toContain("1200 Brickell Ave, Ste 1950, Miami, FL 33131");
    expect(html).toContain("mailto:contact@hbdr.com");
  });

  it.each(legal)("%s shows the 2026-10-23 update and none of the invented text", async (route) => {
    const html = await page(route);
    expect(html).toContain('datetime="2026-10-23">2026-10-23</time>');
    expect(html).not.toContain("February 2026");
    expect(html).not.toMatch(/Data Protection Officer/i);
    expect(html).not.toMatch(/we honou?r Do Not Track/i);
  });

  it("the cookie table lists exactly the measured cookies", async () => {
    const html = await page("/gdpr-cookie-policy");
    const table = html.match(/<table class="bp-table" data-testid="cookie-table">[\s\S]*?<\/table>/)?.[0] ?? "";
    const names = [...table.matchAll(/<td class="mono">([^<]+)<\/td>/g)].map((m) => m[1]);
    expect(names).toEqual(MEASURED);
    expect(MEASURED_COOKIES.map((c) => c.name)).toEqual(MEASURED);
  });

  it.each(legal)("%s names none of the cookies the site never set", async (route) => {
    const html = await page(route);
    for (const name of INVENTED_COOKIES) {
      const pattern = new RegExp(`(^|[^A-Za-z0-9_])${name.replace(/[*]/g, "\\*")}([^A-Za-z0-9_]|$)`);
      expect(html, `${route} mentions ${name}`).not.toMatch(pattern);
    }
  });

  it("the privacy policy has a US state-law section that covers Global Privacy Control and no sale or sharing", async () => {
    const html = await page("/privacy-policy");
    const section = html.match(/<section class="legal-sec" id="us-state-privacy-rights"[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(section).toContain("Global Privacy Control");
    expect(section).toContain("CCPA");
    expect(section).toContain("We do not sell personal information");
  });

  it("the privacy policy states the retention decisions D-013 and D-018 and the 15-minute rate-limit window", async () => {
    const html = await page("/privacy-policy");
    expect(html).toContain("Form submissions, including your IP address");
    expect(html).toContain("No set deletion date");
    expect(html).toContain("15 minutes");
  });

  it("the terms keep Florida law and Miami-Dade venue and send commercial terms to signed agreements", async () => {
    const html = await page("/terms");
    expect(html).toContain("laws of the State of Florida");
    expect(html).toContain("Miami-Dade County, Florida");
    expect(html).toContain("separate signed agreement");
    expect(html).toContain("HBDR does not guarantee revenue");
  });
});
