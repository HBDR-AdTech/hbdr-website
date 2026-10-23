import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";

const app = new Hono();
beforeAll(() => registerPageRoutes(app, () => new MemStorage()));
const page = async (route: string) => (await app.request(route)).text();

// Industry facts on the solution pages, each checked against the source recorded in docs/research/<slug>.md
const FACTS: Record<string, { gone: (string | RegExp)[]; present: string[] }> = {
  "/solutions/manage-account": {
    gone: ["does not log into or manage your Google Ad Manager", "does not log into your GAM", "AdX line items appear", "you operate", /1M\+ monthly/, /20[-–]40%/, "no minimums"],
    present: ["the inventory is managed in the child's account", "except billing information", "Yes, edit access", "up to 15 Manage Inventory parents", "500,000+ monthly pageviews", 'data-testid="ma-source"'],
  },
  "/solutions/manage-inventory": {
    gone: ["Who runs GAM?", "inside your Google Ad Manager.</p>", "granting HBDR the permissions to manage your ad inventory directly"],
    present: ["In HBDR's Ad Manager network", "HBDR has no access to your Ad Manager account", "HBDR's tags with your child network code", "<td class=\"hi\">Up to 15</td>", 'data-testid="mi-source"'],
  },
  "/solutions/mcm": {
    gone: ["We handle the Google approval process", "We handle all Google Ad Manager policy enforcement"],
    present: ["Google, not the parent, approves each child publisher", "Google enforces its Ad Manager policies", "only available in Google Ad Manager 360"],
  },
  "/solutions/open-bidding": {
    gone: [/zero latency/i, "eliminating page latency", "No JavaScript, no browser processing"],
    present: ["reduces the latency historically associated with header bidding", "net of Google's revenue share", "first-price auctions in 2019", 'data-testid="ob-source"'],
  },
  "/solutions/ad-exchange-adx": {
    gone: [/fixed pricing/i, "AdX line items"],
    present: ["AdSense also sells your space in a real-time auction", "No negotiated deals", 'data-testid="adx-source"'],
  },
  "/solutions/display-ads": {
    gone: [/\bFID\b(?! in March 2024)/],
    present: ["INP of 200 ms or less", "LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1", "INP replaced FID in March 2024", "30% of the main content", 'data-testid="display-source"'],
  },
  "/solutions/video-player": {
    gone: [/VAST\s*[·/]\s*VPAID/, /VPAID\s*[·/]\s*VMAP/, /<dd>[^<]*VPAID/],
    present: ["VPAID (replaced)", "OMID (Open Measurement)", "SIMID (interactivity)", "Accompanying Content", 'data-testid="video-source"'],
  },
  "/solutions/ctv-ott": {
    gone: ["SSAI and server-side ad insertion", /5[-–]10[x×]/, "No buffering, no latency, no ad blockers", "biggest names in streaming"],
    present: ["X-Device-IP", "Client-Side Ad Insertion (CSAI)", "podid", "ifa_type", "app-ads.txt", 'data-testid="ctv-source"'],
  },
  "/solutions/in-app-ads": {
    gone: ["SKAdNetwork/Privacy Sandbox", "SKAdNetwork · Privacy Sandbox", "primary revenue driver for the vast majority"],
    present: ["AdAttributionKit", "retiring the Privacy Sandbox technologies", "Global Privacy Protocol (GPP)", "TCF string (version 2.3", 'data-testid="inapp-source"'],
  },
  "/solutions/header-bidding": {
    gone: ["ads.txt/sellers.json management to ensure only quality demand", "revolutionizes programmatic advertising", "<dt>Brand safety</dt>"],
    present: ["Seller authorization", "50–75% of the auction timeout", "Safari blocks them all by default", 'data-testid="hb-source"'],
  },
};

describe("solution pages state current industry facts", () => {
  for (const [route, { gone, present }] of Object.entries(FACTS)) {
    it(`${route} drops the outdated wording and states the sourced facts`, async () => {
      const html = await page(route);
      for (const g of gone) typeof g === "string" ? expect(html, `${route} still has ${g}`).not.toContain(g) : expect(html, `${route} ${g}`).not.toMatch(g);
      for (const p of present) expect(html, `${route} lacks ${p}`).toContain(p);
    });
  }
});
