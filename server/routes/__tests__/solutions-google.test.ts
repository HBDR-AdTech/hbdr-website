import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";

const app = new Hono();
const storage = new MemStorage();
beforeAll(() => registerPageRoutes(app, () => storage));

const range = (prefix: string, n: number, from = 0) => Array.from({ length: n }, (_, i) => `${prefix}${i + from}`);

// The Google solution pages (D-020): each carries one teaching object and keeps every testid it had before the redesign
const PAGES: { route: string; teaching: string; testids: string[] }[] = [
  {
    route: "/solutions/mcm",
    teaching: "mcm-structure-diagram",
    testids: ["mcm-overview-section", "card-mcm-overview", "mcm-benefits-section", ...range("mcm-benefit-card-", 6), "mcm-process-section", "card-mcm-process"],
  },
  {
    route: "/solutions/manage-account",
    teaching: "ma-link-diagram",
    testids: ["account-overview-section", "card-account-overview", "mcm-structure-section", ...range("card-mcm-step-", 3, 1), "ma-benefits-section",
      ...range("account-service-card-", 6), "ma-who-section", "card-ma-who", "ma-faq-section", ...range("ma-faq-", 5)],
  },
  {
    route: "/solutions/manage-inventory",
    teaching: "card-mi-vs-ma",
    testids: ["inventory-overview-section", "card-inventory-overview", "mi-how-section", ...range("card-mi-step-", 3, 1), "mi-services-section",
      "card-gam-management", "card-demand-management", "card-yield-optimization", "card-reporting-compliance", "mi-ma-comparison-section",
      "mi-tools-section", ...range("inventory-feature-card-", 6), "mi-who-section", "card-mi-who"],
  },
  {
    route: "/solutions/open-bidding",
    teaching: "ob-auction-diagram",
    testids: ["ob-overview-section", "card-ob-overview", "ob-advantages-section", ...range("ob-advantage-card-", 3), "ob-features-section", ...range("ob-feature-card-", 4)],
  },
  {
    route: "/solutions/ad-exchange-adx",
    teaching: "adx-comparison-table",
    testids: ["adx-overview-section", "card-adx-overview", "adx-comparison-section", "card-adx-benefits", "card-adsense-comparison", "adx-features-section", ...range("adx-feature-card-", 6)],
  },
];

describe("Google solution pages (D-020)", () => {
  PAGES.forEach(({ route, teaching, testids }) => {
    it(`${route} renders its teaching object as a real frame or table`, async () => {
      const html = await (await app.request(route)).text();
      expect(html).toMatch(new RegExp(`<(figure|div) class="bp-(frame|table-wrap)[^"]*"[^>]*data-testid="${teaching}"`));
    });

    it(`${route} flows without cards, icon tiles or tag pills`, async () => {
      const html = await (await app.request(route)).text();
      expect(html).not.toMatch(/class="[^"]*\b(glass-card|icon-tile|glass-tag|animate-on-scroll)\b/);
    });

    it(`${route} keeps every testid it had before the redesign`, async () => {
      const html = await (await app.request(route)).text();
      const missing = testids.filter((id) => !html.includes(`data-testid="${id}"`));
      expect(missing).toEqual([]);
    });
  });
});
