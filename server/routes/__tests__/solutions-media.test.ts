import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";

const app = new Hono();
beforeAll(() => registerPageRoutes(app, () => new MemStorage()));

// D-020: each page keeps every testid it had before the redesign and gains one teaching object
const PAGES: Record<string, { testids: string[]; teaching: string; example?: boolean }> = {
  "/solutions/header-bidding": {
    testids: ["hb-overview-section", "card-hb-overview", "hb-approach-section", "card-client-side", "card-server-side", "hb-features-section",
      ...[0, 1, 2, 3, 4, 5].map((i) => `hb-feature-card-${i}`)],
    teaching: "hb-auction-diagram",
    example: true,
  },
  "/solutions/display-ads": {
    testids: ["display-overview-section", "card-display-overview", "display-formats-section", "display-features-section",
      ...[0, 1, 2].map((i) => `display-format-card-${i}`), ...[0, 1, 2, 3].map((i) => `display-feature-card-${i}`)],
    teaching: "display-size-diagram",
    example: true,
  },
  "/solutions/video-player": {
    testids: ["video-overview-section", "card-video-overview", "video-formats-section", "card-instream", "card-outstream", "card-sticky-player",
      "card-mobile-optimized", "video-revenue-section", "card-video-revenue", "video-technical-section", ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `video-tech-card-${i}`)],
    teaching: "video-flow-diagram",
  },
  "/solutions/ctv-ott": {
    testids: ["ctv-overview-section", "card-ctv-overview", "ctv-capabilities-section", "card-ssai", "card-ad-pods", "ctv-features-section",
      ...[0, 1, 2].map((i) => `ctv-feature-card-${i}`)],
    teaching: "ctv-ssai-diagram",
  },
  "/solutions/in-app-ads": {
    testids: ["inapp-overview-section", "card-inapp-overview", "inapp-formats-section", "inapp-integration-section", "card-inapp-integration",
      ...[0, 1, 2, 3].map((i) => `inapp-format-card-${i}`)],
    teaching: "inapp-format-table",
  },
};

describe("solutions media pages (D-020 blueprint)", () => {
  for (const [route, page] of Object.entries(PAGES)) {
    it(`${route} flows without boxes, keeps its testids and has a teaching object`, async () => {
      const res = await app.request(route);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).not.toMatch(/glass-card|icon-tile|glass-tag/);
      for (const id of [...page.testids, page.teaching, "stats-section", "cta-section", "button-cta"]) expect(html, id).toContain(`data-testid="${id}"`);
      // Example numbers in a teaching object are always labelled as such
      if (!page.example) return;
      const start = html.indexOf(`data-testid="${page.teaching}"`);
      expect(html.slice(start, html.indexOf("</section>", start))).toContain("Example");
    });
  }
});
