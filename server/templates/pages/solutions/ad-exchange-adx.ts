import { renderLayout } from "../../layout";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";
import { renderBlueprintHero, renderEyebrow, renderFeatureRows, renderSection } from "../../components/blueprint";

// The two lists the page always had, paired row by row; AdX is the page's subject, so its column is the mint one
const COMPARE: [string, string, string][] = [
  ["Auction", "Real-time auction with thousands of competing buyers", "Fixed pricing with limited competition"],
  ["Demand", "Access to premium brand and agency demand", "Smaller pool of advertisers"],
  ["Controls", "Granular floor pricing and blocking controls", "Limited pricing and blocking controls"],
  ["Private marketplace", "Private marketplace (PMP) deal support", "No private marketplace support"],
  ["Programmatic deals", "Preferred deal and programmatic guaranteed capabilities", "No programmatic deal capabilities"],
  ["Reporting", "Advanced reporting with buyer-level insights", "Basic reporting with limited transparency"],
];

const FEATURES = [
  { title: "Optimized configuration", body: "Expert setup of AdX line items, pricing rules, and creative controls tailored to your specific inventory and traffic patterns for maximum yield." },
  { title: "Header bidding + AdX", body: "Our hybrid setup ensures AdX competes against Prebid demand in a true unified auction, driving the highest possible clearing prices for every impression." },
  { title: "Policy & compliance", body: "Full ads.txt and sellers.json management, content policy monitoring, and proactive compliance reviews to protect your AdX account standing." },
  { title: "Deal management", body: "Set up and manage private marketplace deals, preferred deals, and programmatic guaranteed campaigns to capture premium direct-sold revenue through AdX." },
  { title: "Revenue analytics", body: "Comprehensive AdX performance dashboards with buyer-level insights, price floor analysis, and competitive intelligence to inform optimization strategy." },
  { title: "Dedicated support", body: "Priority escalation to Google for account reviews, policy questions, and feature access. Our direct relationship with Google ensures faster resolution times." },
];

export function renderAdExchangePage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Google Ad Exchange (AdX)",
    lede: "Access the world's largest programmatic exchange with premium demand, real-time auctions, and CPMs that outperform standard AdSense by 2-3x. HBDR is your gateway to Google AdX.",
    actions: [
      { label: "Get AdX Access", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "Compare AdX and AdSense", href: "#compare", testid: "button-hero-learn" },
    ],
  })}

  <section class="bp-section" data-testid="adx-overview-section">
    <div class="bp-wrap bp-grid12 sg-split" data-testid="card-adx-overview">
      <div class="col-span-12 lg:col-span-5 grid gap-5 content-start">${renderEyebrow("Premium exchange")}<h2>What is Google Ad Exchange?</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 sg-prose">
        <p>Google Ad Exchange (AdX) is a premium programmatic marketplace that connects publishers with the world's largest pool of brand advertisers and agency demand. Unlike Google AdSense, which serves as an ad network with fixed pricing, AdX operates as a real-time auction exchange where thousands of buyers compete for every impression — resulting in significantly higher CPMs and fill rates.</p>
        <p>Access to Google AdX requires either direct qualification through Google or partnership with a certified Google MCM or reseller partner like HBDR. Through our partnership, publishers of all sizes gain access to AdX's premium demand, advanced reporting, and granular controls that are otherwise only available to the largest media companies.</p>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "compare",
    testid: "adx-comparison-section",
    eyebrow: "AdX vs AdSense",
    title: "Why AdX outperforms AdSense.",
    lede: "The key differences that drive 2-3x higher revenue for publishers.",
    body: `
      <div class="bp-table-wrap" data-testid="adx-comparison-table">
        <table class="bp-table sg-table">
          <thead><tr><th scope="col"><span class="sr-only">Area</span></th><th scope="col" class="hi" data-testid="card-adx-benefits">Google Ad Exchange</th><th scope="col" data-testid="card-adsense-comparison">Google AdSense</th></tr></thead>
          <tbody>${COMPARE.map(([k, adx, adsense]) => `
            <tr><td>${k}</td><td class="hi">${adx}</td><td>${adsense}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>`,
  })}

  ${renderSection({
    testid: "adx-features-section",
    eyebrow: "HBDR + AdX",
    title: "Maximize your AdX revenue.",
    lede: "Our expertise turns AdX access into maximum revenue.",
    body: renderFeatureRows(FEATURES.map((f, i) => ({ ...f, testid: `adx-feature-card-${i}` }))),
  })}

  ${renderStatsSection()}

  ${renderCTASection("Ready to access Google Ad Exchange?", "Get AdX Access")}`;

  return renderLayout({
    title: "Google Ad Exchange (AdX) - HBDR",
    description: "Access Google Ad Exchange premium demand through HBDR. Real-time auctions, 2-3x higher CPMs than AdSense, and expert AdX management for publishers.",
    canonicalPath: "/solutions/ad-exchange-adx",
    bodyContent: content,
  });
}
