import { renderLayout } from "../../layout";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";
import { renderBlueprintHero, renderEyebrow, renderFeatureRows, renderSection, renderSteps } from "../../components/blueprint";

// Who owns what under each MCM arrangement; MI is this page's subject, so its column is the mint one
const COMPARE: [string, string, string][] = [
  ["Who runs GAM?", "You (the publisher)", "HBDR"],
  ["AdX access", "Yes, via HBDR MCM", "Yes, via HBDR MCM"],
  ["Ad unit setup", "You handle it", "HBDR handles it"],
  ["Header bidding", "You configure Prebid", "HBDR configures Prebid"],
  ["Yield optimization", "You optimize", "HBDR optimizes"],
  ["Floor pricing", "You set floors", "HBDR sets floors (ML-powered)"],
  ["Best for", "Publishers with ad ops teams", "Publishers who want hands-off monetization"],
];

const SERVICES = [
  { testid: "card-gam-management", title: "GAM setup & configuration", body: "HBDR builds your Google Ad Manager configuration from the ground up. We create optimized ad units, set up line item structures, configure key-value targeting, and implement the ad tags on your site. If you already have a GAM setup, we audit and restructure it for maximum performance.",
    list: ["Ad unit creation and placement strategy", "Line item architecture and priority management", "Key-value targeting and audience segmentation"] },
  { testid: "card-demand-management", title: "Demand partner stack", body: "We select, integrate, and manage a curated stack of demand partners tailored to your traffic profile. This includes Prebid.js header bidding, Google AdX through our MCM parent account, Open Bidding partners, and direct SSP relationships — all continuously optimized for your specific audience and content verticals.",
    list: ["Prebid.js configuration and bidder management", "Google AdX access through HBDR parent MCM", "65+ demand source integrations"] },
  { testid: "card-yield-optimization", title: "Yield optimization", body: "HBDR's yield management team uses our proprietary optimization tools to squeeze maximum revenue from every impression. We run continuous A/B tests on floor prices, bidder configurations, ad layouts, refresh strategies, and timeout settings — making data-driven decisions that compound into significant revenue growth over time.",
    list: ["Dynamic floor pricing powered by ML", "Automated A/B testing across ad configurations", "Ad refresh and lazy-load optimization"] },
  { testid: "card-reporting-compliance", title: "Reporting & compliance", body: "Full transparency into your ad performance with custom dashboards, monthly strategy reviews, and proactive policy compliance monitoring. HBDR manages your ads.txt, sellers.json, privacy consent (CMP), and all Google policy requirements so you never have to worry about account flags or violations.",
    list: ["Custom revenue dashboards and reports", "ads.txt and sellers.json management", "CMP/consent and privacy compliance"] },
];

const TOOLS = [
  { title: "Real-time analytics platform", body: "HBDR's proprietary analytics dashboard gives our team (and you) real-time visibility into revenue, CPMs, fill rates, and bidder performance across every ad unit, geo, and device." },
  { title: "ML-powered floor engine", body: "Our machine learning floor pricing engine analyzes billions of bid signals to set optimal floors per impression, adjusting dynamically for time of day, seasonality, user value, and market conditions." },
  { title: "24/7 monitoring & alerts", body: "Automated systems monitor your revenue around the clock. Our team gets instant alerts for fill rate drops, traffic anomalies, demand partner issues, and policy flags — so problems are fixed before you even notice." },
  { title: "Automated A/B testing", body: "HBDR runs continuous multivariate tests on bidder configurations, timeout settings, ad layouts, and refresh strategies — compounding incremental gains into significant long-term revenue growth." },
  { title: "Dedicated account manager", body: "Your dedicated HBDR account manager provides monthly performance reviews, strategic recommendations, and direct communication for any questions or requests. Real people, real responsiveness." },
  { title: "Transparent reporting", body: "No black boxes. You get full access to your revenue data, see exactly how every demand source performs, and receive clear explanations for every optimization decision HBDR makes on your behalf." },
];

const WHO = [
  "Publishers without an in-house ad ops team",
  "Content creators who want to focus on content, not ads",
  "Sites looking for fully outsourced monetization",
  "Publishers frustrated with underperforming ad partners",
  "Growing sites that need expert yield management from day one",
  "Multi-site operators who need a single partner for all properties",
];

export function renderManageInventoryPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Manage Inventory",
    lede: "Full-stack ad operations by HBDR. Connect to our parent MCM account and let our team manage your entire ad inventory — yield optimization, demand management, and everything in between.",
    actions: [
      { label: "Let HBDR Manage Your Inventory", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "Compare MA and MI", href: "#compare", testid: "button-hero-learn" },
    ],
  })}

  <section class="bp-section" data-testid="inventory-overview-section">
    <div class="bp-wrap bp-grid12 sg-split" data-testid="card-inventory-overview">
      <div class="col-span-12 lg:col-span-5 grid gap-5 content-start">${renderEyebrow("Full-stack ad operations")}<h2>What is HBDR Manage Inventory?</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 sg-prose">
        <p>HBDR Manage Inventory is a <strong>full-service ad operations engagement</strong> built on top of Google's <strong>Multiple Customer Management (MCM)</strong> program. Unlike our <a href="/solutions/manage-account">Manage Account</a> offering — where you run your own GAM and we simply provide AdX access — Manage Inventory means <strong>HBDR takes over the complete management of your ad inventory</strong> inside your Google Ad Manager.</p>
        <p>When you connect to HBDR's parent MCM account under a Manage Inventory arrangement, you're granting our team the access needed to operate your ad stack on your behalf. We handle everything: ad unit creation and configuration, header bidding setup, demand partner management, floor pricing, yield optimization, reporting, policy compliance, and ongoing performance tuning. You focus on creating content and growing your audience; we focus on maximizing every dollar your traffic earns.</p>
        <p>This is the engagement model for publishers who want to completely hand off ad monetization to a dedicated team with the tools, technology, and expertise to get the best possible results.</p>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "compare",
    testid: "mi-ma-comparison-section",
    eyebrow: "MA vs. MI",
    title: "Manage Account vs. Manage Inventory.",
    lede: "Both options connect your GAM to HBDR's parent MCM account, but the level of service is completely different. Here's how to decide which is right for you.",
    body: `
      <div class="bp-table-wrap" data-testid="card-mi-vs-ma">
        <table class="bp-table sg-table">
          <thead><tr><th scope="col">Responsibility</th><th scope="col">Manage Account (MA)</th><th scope="col" class="hi">Manage Inventory (MI)</th></tr></thead>
          <tbody>${COMPARE.map(([k, ma, mi]) => `
            <tr><td>${k}</td><td>${ma}</td><td class="hi">${mi}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>`,
  })}

  ${renderSection({
    testid: "mi-how-section",
    eyebrow: "How it works",
    title: "The MCM Manage Inventory connection.",
    lede: "You grant HBDR access to manage your GAM inventory, and our team takes it from there.",
    body: renderSteps([
      { title: "MCM inventory link", body: "HBDR sends an MCM invitation from our parent Google Ad Manager 360 account. You accept the invitation inside your GAM, granting HBDR the permissions to manage your ad inventory directly.", testid: "card-mi-step-1" },
      { title: "HBDR takes over", body: "Our ad ops team audits your current setup, then builds and optimizes your entire ad stack from scratch — ad units, Prebid configuration, Google AdX, Open Bidding, demand partners, floor pricing, and more.", testid: "card-mi-step-2" },
      { title: "Continuous optimization", body: "HBDR's team continuously monitors and optimizes your yield using our proprietary tools and real-time data. You receive transparent reporting and a dedicated account manager for ongoing communication.", testid: "card-mi-step-3" },
    ]),
  })}

  ${renderSection({
    testid: "mi-services-section",
    eyebrow: "What HBDR manages",
    title: "Complete yield management.",
    lede: "Every layer of your ad monetization stack, handled by our expert team using industry-leading tools.",
    body: renderFeatureRows(SERVICES),
  })}

  ${renderSection({
    testid: "mi-tools-section",
    eyebrow: "HBDR advantage",
    title: "Our tools & team.",
    lede: "Proprietary technology and seasoned ad ops professionals working together to maximize your revenue.",
    body: renderFeatureRows(TOOLS.map((t, i) => ({ ...t, testid: `inventory-feature-card-${i}` }))),
  })}

  ${renderSection({
    testid: "mi-who-section",
    eyebrow: "Ideal for",
    title: "Who should choose Manage Inventory?",
    body: `
      <div class="bp-grid12" data-testid="card-mi-who">
        <div class="col-span-12 lg:col-span-6 sg-prose">
          <p>HBDR Manage Inventory is the right choice for publishers who want to completely outsource their ad monetization. If you don't have an in-house ad ops team — or simply don't want to spend time managing demand partners, floor prices, and GAM configurations — this is the engagement model for you.</p>
        </div>
        <ul class="bp-list col-span-12 lg:col-start-8 lg:col-span-5 content-start">${WHO.map((w) => `<li>${w}</li>`).join("")}</ul>
      </div>`,
  })}

  ${renderStatsSection()}

  ${renderCTASection("Ready for full-stack ad operations by HBDR?", "Let HBDR Manage Your Inventory")}`;

  return renderLayout({
    title: "Manage Inventory - Full-Stack Ad Operations by HBDR | MCM",
    description: "HBDR Manage Inventory is a full-service MCM engagement where HBDR manages your entire ad stack — yield optimization, header bidding, demand partners, floor pricing, and GAM operations. Let our team and tools maximize your revenue.",
    ogTitle: "HBDR Manage Inventory - Full-Stack Ad Operations & Yield Management",
    ogDescription: "Hand off your ad monetization to HBDR. We manage your GAM inventory, demand partners, yield optimization, and everything else through our MCM parent account.",
    canonicalPath: "/solutions/manage-inventory",
    bodyContent: content,
  });
}
