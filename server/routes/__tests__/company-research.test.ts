import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import { PAGE_ROUTES } from "../../config";

// Company and audience pages carry current industry facts (sources in docs/research/*.md); outdated ones must not return.
const app = new Hono();
beforeAll(() => registerPageRoutes(app, () => new MemStorage()));
const page = async (route: string) => {
  const html = await (await app.request(route)).text();
  return html.slice(html.indexOf("</nav>"), html.lastIndexOf("<footer"));
};
const head = async (route: string) => {
  const html = await (await app.request(route)).text();
  return html.slice(0, html.indexOf("</head>"));
};
const COMPANY = ["/", "/about", "/how-it-works", "/publishers", "/advertisers", "/partners", "/trust", "/dashboard"];

describe("company pages: current facts", () => {
  it("no page states the revenue lift as 50%+ (D-027: up to 50%)", async () => {
    for (const route of PAGE_ROUTES) expect(await (await app.request(route)).text(), route).not.toMatch(/50%\+/);
    expect(await page("/")).toContain("<b>Up to 50%</b>");
    expect(await page("/publishers")).toContain("<b>Up to 50%</b>");
  });

  it("no company page names FID, VPAID, TCF 2.0 or a cookieless future", async () => {
    for (const route of COMPANY) {
      const html = await page(route);
      expect(html, route).not.toMatch(/\bFID\b|VPAID|TCF 2\.0|cookieless/i);
    }
  });

  it("home format copy names VAST 4.x, OMID and SIMID, and the strip uses current names", async () => {
    const html = await page("/");
    for (const s of ["VAST 4.x", "OMID for verification", "SIMID for interactivity", "In-App SDK or SDK-less Integration"]) expect(html).toContain(s);
    expect(html).toContain("<li>Microsoft Monetize</li>");
    expect(html).not.toMatch(/<li>(Xandr|Teads\.tv|ShareThrough|Freewheel|Bidmachine|Mobilefuse)<\/li>/);
    const meta = await head("/");
    expect(meta).not.toMatch(/enterprise-grade|cutting-edge/);
    expect(meta).toContain("65+ demand sources");
  });

  it("/trust explains the supply-chain standards and current privacy signals", async () => {
    const html = await page("/trust");
    expect(html).toContain('data-testid="trust-standards-table"');
    for (const s of ["OWNERDOMAIN and MANAGERDOMAIN", "PUBLISHER (owns the inventory), INTERMEDIARY", "source.schain in OpenRTB 2.6", "IAB TCF Integration", "28 February 2026", "Global Privacy Protocol", "deprecated on 31 January 2024", "Indiana, Kentucky and Rhode Island", "regs.coppa = 1", "22 April 2026"]) expect(html).toContain(s);
    expect(html).not.toMatch(/support for the US Privacy String|Independent bloggers|isn&#39;t just a value|isn't just a value/);
  });

  it("/partners states the real cookie status and keeps every partner name unannotated (status list lives in docs/research/partners.md for Matt)", async () => {
    const html = await page("/partners");
    expect(html).toContain('data-testid="partners-cookie-status"');
    for (const s of ["dropped the planned standalone prompt", "Topics, Protected Audience and Attribution Reporting", "Blocked by default since March 2020", "Total Cookie Protection"]) expect(html).toContain(s);
    for (const name of ["Xandr (Microsoft)", "EMX Digital", "MediaMath", "Xandr Invest", "Basis Technologies (Centro)", "Lotame Panorama ID", "MOAT (Oracle)", "Amazon APS (A9)", "Google Analytics & GA4"]) expect(html).toContain(name);
    expect(html).not.toMatch(/partner-[a-z]+-[0-9]+-status|Closed:|Renamed:|Acquired:|Bankrupt:|are marked/);
    expect(html).not.toMatch(/World-Class|world&#39;s largest|world's largest/);
  });

  it("/how-it-works gives a proposal checklist and timeout and floor basics", async () => {
    const html = await page("/how-it-works");
    for (let i = 0; i < 7; i++) expect(html).toContain(`data-testid="hiw-evaluate-${i}"`);
    for (let i = 0; i < 6; i++) expect(html).toContain(`data-testid="hiw-basics-${i}"`);
    for (const s of ["50–75% of the auction timeout", "advises against static floors", "INP of 200 ms or less", "the higher price wins", "65+ demand sources"]) expect(html).toContain(s);
    expect(html).not.toMatch(/premium demand partners|weeks, not months/);
  });

  it("/publishers covers ads.txt hygiene, consent and page experience, and the D-027 minimum", async () => {
    const html = await page("/publishers");
    for (let i = 0; i < 6; i++) expect(html).toContain(`data-testid="publisher-prepare-${i}"`);
    for (const s of ["OWNERDOMAIN", "never geofence the file", "TCF v2.3", "more than 30% of the vertical height", "replaced First Input Delay in March 2024", "from 500,000 monthly pageviews"]) expect(html).toContain(s);
    expect(html).not.toMatch(/of all sizes, from independent blogs|makes ad monetization effortless/);
  });

  it("/about and /advertisers drop unsupported superlatives and outdated wording", async () => {
    const about = await page("/about");
    expect(about).not.toMatch(/global leader|consistently outperform|enterprise-grade/);
    const adv = await page("/advertisers");
    expect(adv).not.toMatch(/Billions of monthly|Premium Access/);
    expect(adv).toContain("1B+ impressions a month");
  });
});
