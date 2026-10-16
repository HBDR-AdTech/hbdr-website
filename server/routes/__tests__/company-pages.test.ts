import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";

// Company pages on the blueprint system (D-020): every data-testid the card layout carried is still rendered,
// no card/tile/pill classes remain, and each page has its one teaching object.
const app = new Hono();
beforeAll(() => registerPageRoutes(app, () => new MemStorage()));

const PAGES: Record<string, { teaching: string; testids: string }> = {
  "/publishers": {
    teaching: '<table class="bp-table compare-table co-owner">',
    testids: "hero publishers-why-section publisher-value-0 publisher-value-1 publisher-value-2 publisher-value-3 publisher-value-4 publisher-value-5 publishers-onboarding-section onboarding-step-0 onboarding-step-1 onboarding-step-2 onboarding-step-3 onboarding-step-4 publishers-handle-section publishers-hbdr-manages publishers-you-do publishers-requirements-section publisher-req-0 publisher-req-1 publisher-req-2 publisher-req-3 publisher-req-4 publishers-faq-section pub-faq-0 button-pub-faq-0 pub-faq-1 button-pub-faq-1 pub-faq-2 button-pub-faq-2 pub-faq-3 button-pub-faq-3 pub-faq-4 button-pub-faq-4 pub-faq-5 button-pub-faq-5 pub-faq-6 button-pub-faq-6 pub-faq-7 button-pub-faq-7 stats-section stat-card-0 stat-card-1 stat-card-2 stat-card-3 cta-section button-cta",
  },
  "/advertisers": {
    teaching: 'data-testid="advertisers-deal-table"',
    testids: "hero advertisers-intro-section advertisers-deal-types-section advertiser-deal-0 advertiser-deal-1 advertiser-deal-2 advertisers-inventory-section advertiser-inventory-0 advertiser-inventory-1 advertiser-inventory-2 advertiser-inventory-3 advertiser-inventory-4 advertiser-inventory-5 advertisers-brand-safety-section advertisers-brand-safety-card advertisers-getting-started-section advertiser-step-0 advertiser-step-1 advertiser-step-2 advertiser-step-3 cta-section button-cta",
  },
  "/about": {
    teaching: '<ol class="co-years">',
    testids: "hero about-mission-section card-mission about-story-section timeline-card-0 timeline-card-1 timeline-card-2 about-values-section value-card-0 value-card-1 value-card-2 value-card-3 stats-section stat-card-0 stat-card-1 stat-card-2 stat-card-3 cta-section button-cta",
  },
  "/how-it-works": {
    teaching: 'data-testid="hiw-flow-diagram"',
    testids: "hero hiw-steps-section hiw-step-card-0 hiw-step-card-1 hiw-step-card-2 hiw-next-section hiw-next-card-0 hiw-next-card-1 hiw-next-card-2 hiw-faq-section faq-card-0 faq-toggle-0 faq-card-1 faq-toggle-1 faq-card-2 faq-toggle-2 faq-card-3 faq-toggle-3 faq-card-4 faq-toggle-4 cta-section button-cta",
  },
  "/partners": {
    teaching: 'data-testid="partners-ecosystem-diagram"',
    testids: "hero partners-demand-section partner-ssp-0 partner-ssp-1 partner-ssp-2 partner-ssp-3 partner-ssp-4 partner-ssp-5 partner-ssp-6 partner-ssp-7 partner-ssp-8 partner-ssp-9 partner-ssp-10 partner-ssp-11 partner-ssp-12 partner-ssp-13 partner-ssp-14 partner-ssp-15 partner-dsp-0 partner-dsp-1 partner-dsp-2 partner-dsp-3 partner-dsp-4 partner-dsp-5 partner-dsp-6 partner-dsp-7 partners-identity-section partner-identity-0 partner-identity-1 partner-identity-2 partner-identity-3 partner-identity-4 partner-identity-5 partners-compliance-section partner-compliance-0 partner-compliance-1 partner-compliance-2 partner-compliance-3 partner-compliance-4 partner-compliance-5 partner-compliance-6 partners-tech-section partner-tech-0 partner-tech-1 partner-tech-2 partner-tech-3 partner-tech-4 partner-tech-5 partner-tech-6 partner-tech-7 cta-section button-cta",
  },
  "/trust": {
    teaching: 'data-testid="trust-supply-diagram"',
    testids: "hero trust-commitment-section trust-supply-chain-section trust-supply-0 trust-supply-1 trust-supply-2 trust-supply-3 trust-anti-fraud-section trust-fraud-0 trust-fraud-1 trust-fraud-2 trust-fraud-3 trust-fraud-4 trust-privacy-section trust-privacy-0 trust-privacy-1 trust-privacy-2 trust-privacy-3 trust-privacy-4 trust-privacy-5 trust-certifications-section trust-cert-0 trust-cert-1 trust-cert-2 trust-cert-3 trust-cert-4 trust-cert-5 trust-capabilities-section trust-capability-0 trust-capability-1 trust-capability-2 trust-capability-3 trust-capability-4 trust-capability-5 trust-capability-6 trust-capability-7 trust-capability-8 trust-capability-9 trust-capability-10 trust-capability-11 trust-who-we-serve-section trust-publishers-served trust-advertisers-served cta-section button-cta",
  },
  "/dashboard": {
    teaching: 'data-testid="dashboard-example-report"',
    testids: "hero dashboard-overview-section card-dashboard-overview link-dashboard-external dashboard-dimensions-section dashboard-dimension-card-0 dashboard-dimension-card-1 dashboard-dimension-card-2 dashboard-dimension-card-3 dashboard-dimension-card-4 dashboard-dimension-card-5 dashboard-revenue-section card-adx-revenue card-adserver-revenue card-ssp-revenue link-dashboard-external-2 dashboard-features-section dashboard-feature-card-0 dashboard-feature-card-1 dashboard-feature-card-2 dashboard-feature-card-3 dashboard-feature-card-4 dashboard-feature-card-5 dashboard-feature-card-6 dashboard-feature-card-7 cta-section button-cta",
  },
};

const main = (html: string) => html.slice(html.indexOf("</nav>"), html.lastIndexOf("<footer"));

describe("company pages on the blueprint system", () => {
  for (const [route, page] of Object.entries(PAGES)) {
    it(`${route} keeps every testid, has no boxes and carries its teaching object`, async () => {
      const res = await app.request(route);
      expect(res.status).toBe(200);
      const html = main(await res.text());
      const missing = page.testids.split(" ").filter((t) => !html.includes(`data-testid="${t}"`));
      expect(missing).toEqual([]);
      expect(html).not.toMatch(/glass-card|icon-tile|glass-tag/);
      expect(html).toContain(page.teaching);
    });
  }

  it("example data is labelled and the dashboard drawing carries no numbers", async () => {
    const html = main(await (await app.request("/dashboard")).text());
    const report = html.slice(html.indexOf('data-testid="dashboard-example-report"'), html.indexOf("</figure>", html.indexOf('data-testid="dashboard-example-report"')));
    expect(report).toContain("Example");
    expect(report.replace(/<[^>]*>/g, " ")).not.toMatch(/\$|%|\d/);
  });

  it("/partners names partners as text, no logo images", async () => {
    const html = main(await (await app.request("/partners")).text());
    expect(html).toContain("Integrated Demand Partners");
    expect(html).not.toContain("<img");
  });
});
