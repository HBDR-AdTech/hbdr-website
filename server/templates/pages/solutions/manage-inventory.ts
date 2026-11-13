import { renderLayout } from "../../layout";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";
import { renderBlueprintHero, renderEyebrow, renderFeatureRows, renderSection, renderSteps } from "../../components/blueprint";

// Google's rules for each MCM delegation type (support.google.com/admanager/answer/11130475), then HBDR's service scope; MI is this page's subject, so its column is the mint one
const GOOGLE_RULES: [string, string, string][] = [
  ["Where the inventory is managed", "In your Ad Manager network", "In HBDR's Ad Manager network"],
  ["HBDR's access to your account", "Edit access, no billing information", "None"],
  ["Tags on your pages", "Unchanged", "HBDR's tags with your child network code"],
  ["Reporting", "In your network", "In HBDR's network, by child network code"],
  ["Parents a child can have", "One", "Up to 15"],
];
const SERVICE_SCOPE: [string, string, string][] = [
  ["AdX access", "Yes, via HBDR MCM", "Yes, via HBDR MCM"],
  ["Ad unit setup", "You handle it", "HBDR handles it"],
  ["Header bidding", "You configure Prebid", "HBDR configures Prebid"],
  ["Yield optimization", "You optimize", "HBDR optimizes"],
  ["Floor pricing", "You set floors", "HBDR sets floors (ML-powered)"],
  ["Best for", "Publishers with ad ops teams", "Publishers who want hands-off monetization"],
];

const SERVICES = [
  { testid: "card-gam-management", title: "GAM setup & configuration", body: "HBDR builds the Google Ad Manager setup for your delegated inventory from the ground up, in our own network: optimized ad units, line item structures and key-value targeting, plus the ad tags for your site. If you already run Google Ad Manager, we audit your current setup first.",
    list: ["Ad unit creation and placement strategy", "Line item architecture and priority management", "Key-value targeting and audience segmentation"] },
  { testid: "card-demand-management", title: "Demand partner stack", body: "We select, integrate, and manage a curated stack of demand partners tailored to your traffic profile. This includes Prebid.js header bidding, Google AdX through our MCM parent account, Open Bidding partners, and direct SSP relationships — all continuously optimized for your specific audience and content verticals.",
    list: ["Prebid.js configuration and bidder management", "Google AdX access through HBDR parent MCM", "65+ demand source integrations"] },
  { testid: "card-yield-optimization", title: "Yield optimization", body: "HBDR's yield management team uses our proprietary optimization tools to squeeze maximum revenue from every impression. We run continuous A/B tests on floor prices, bidder configurations, ad layouts, refresh strategies, and timeout settings — making data-driven decisions that compound into significant revenue growth over time.",
    list: ["Dynamic floor pricing powered by ML", "Automated A/B testing across ad configurations", "Ad refresh and lazy-load optimization"] },
  { testid: "card-reporting-compliance", title: "Reporting & compliance", body: "Full transparency into your ad performance with custom dashboards, monthly strategy reviews, and proactive policy compliance monitoring. HBDR manages your ads.txt, sellers.json, privacy consent (CMP), and all Google policy requirements so you never have to worry about account flags or violations.",
    list: ["Custom revenue dashboards and reports", "ads.txt and sellers.json management", "CMP/consent and privacy compliance"] },
];

const TOOLS = [
  { title: "Hourly reporting", body: "HBDR's reporting gives our team (and you) hourly revenue and bidder performance, with alerts and CSV exports." },
  { title: "Dynamic floor prices", body: "Floor prices set by a model for each impression or traffic segment, tested with A/B splits before they reach all your traffic." },
  { title: "Monitoring & alerts", body: "Automated checks raise alerts for fill rate drops, traffic anomalies, demand partner issues and policy flags. Our team acts on them Mon–Fri, 9am–6pm ET." },
  { title: "Automated A/B testing", body: "HBDR runs continuous multivariate tests on bidder configurations, timeout settings, ad layouts, and refresh strategies — compounding incremental gains into significant long-term revenue growth." },
  { title: "Dedicated account manager", body: "Your dedicated HBDR account manager provides performance reviews, recommendations and direct communication for any questions or requests, Mon–Fri, 9am–6pm ET." },
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
    lede: "Full-stack ad operations by HBDR. Delegate your inventory to our parent MCM network and let our team manage it — yield optimization, demand management, and everything in between.",
    actions: [
      { label: "Let HBDR Manage Your Inventory", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "Compare MA and MI", href: "#compare", testid: "button-hero-learn" },
    ],
  })}

  <section class="bp-section" data-testid="inventory-overview-section">
    <div class="bp-wrap bp-grid12 sg-split" data-testid="card-inventory-overview">
      <div class="col-span-12 lg:col-span-5 grid gap-5 content-start">${renderEyebrow("Full-stack ad operations")}<h2>What is HBDR Manage Inventory?</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 sg-prose">
        <p>HBDR Manage Inventory is a <strong>full-service ad operations engagement</strong> built on Google's <strong>Multiple Customer Management (MCM)</strong> program. It uses Google's <strong>Manage Inventory</strong> delegation type: you delegate inventory to HBDR, and HBDR manages it <strong>in HBDR's own Google Ad Manager network</strong>. Unlike our <a href="/solutions/manage-account">Manage Account</a> offering, HBDR has no access to your Ad Manager account.</p>
        <p>The ad units, orders and line items for your delegated inventory live in HBDR's network. Your pages carry Google Publisher Tags that name HBDR's network plus your child network code, so Google can attribute the revenue to you. Google still requires you to have your own Ad Manager network, so it can identify you and review your account against its policies, but no trafficking or ad serving has to happen there.</p>
        <p>From there our team handles everything: ad unit configuration, header bidding setup, demand partner management, floor pricing, yield optimization, reporting, policy compliance, and ongoing performance tuning. You focus on creating content and growing your audience; we focus on maximizing every dollar your traffic earns.</p>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "compare",
    testid: "mi-ma-comparison-section",
    eyebrow: "MA vs. MI",
    title: "Manage Account vs. Manage Inventory.",
    lede: "Both connect your network to HBDR's parent network. Google's delegation type decides where the inventory lives and who can see what; HBDR's service scope decides who does the work.",
    body: `
      <div class="bp-table-wrap" data-testid="card-mi-vs-ma">
        <table class="bp-table sg-table">
          <caption class="sr-only">Manage Account and Manage Inventory: Google's rules for each delegation type, then HBDR's service scope</caption>
          <thead><tr><th scope="col">Responsibility</th><th scope="col">Manage Account (MA)</th><th scope="col" class="hi">Manage Inventory (MI)</th></tr></thead>
          <tbody>
            <tr><th scope="colgroup" colspan="3">Google's rules</th></tr>${GOOGLE_RULES.map(([k, ma, mi]) => `
            <tr><td>${k}</td><td>${ma}</td><td class="hi">${mi}</td></tr>`).join("")}
            <tr><th scope="colgroup" colspan="3">HBDR's service scope</th></tr>${SERVICE_SCOPE.map(([k, ma, mi]) => `
            <tr><td>${k}</td><td>${ma}</td><td class="hi">${mi}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="mono mt-6 text-[var(--text-muted)]" data-testid="mi-source">Source: Google Ad Manager Help, About Multiple Customer Management, About Manage Inventory and Update Google Publisher Tags for MCM Manage Inventory (retrieved October 2026). A child can't have the same parent under both types.</p>`,
  })}

  ${renderSection({
    testid: "mi-how-section",
    eyebrow: "How it works",
    title: "The MCM Manage Inventory connection.",
    lede: "You delegate inventory, update your tags, and our team runs that inventory from HBDR's network.",
    body: renderSteps([
      { title: "MCM inventory link", body: "HBDR sends a Manage Inventory invitation from our parent Google Ad Manager 360 network. You accept it with an email that has admin access to your own Ad Manager network, and Google reviews your account. HBDR gets no access to your account.", testid: "card-mi-step-1" },
      { title: "HBDR takes over", body: "Our ad ops team audits your current setup, then builds the delegated inventory in HBDR's network — ad units, Prebid configuration, Google AdX, Open Bidding, demand partners, floor pricing, and more — and your pages switch to tags with your child network code, which Google requires for Manage Inventory.", testid: "card-mi-step-2" },
      { title: "Continuous optimization", body: "HBDR's team continuously monitors and optimizes your yield using our own tools and hourly reporting data. Google keeps Manage Inventory reporting in the parent network, so you receive it from us as transparent reporting, with a dedicated account manager for ongoing communication.", testid: "card-mi-step-3" },
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
          <p>Before you accept any Manage Inventory invitation, give the parent an email with admin access to your Ad Manager network (Google can disapprove a wrong address as a duplicate account), plan the retag of every page that carries the delegated inventory, and agree how you will see reporting, because it lives in the parent's network.</p>
        </div>
        <ul class="bp-list col-span-12 lg:col-start-8 lg:col-span-5 content-start">${WHO.map((w) => `<li>${w}</li>`).join("")}</ul>
      </div>`,
  })}

  ${renderStatsSection()}

  ${renderCTASection("Ready for full-stack ad operations by HBDR?", "Let HBDR Manage Your Inventory")}`;

  return renderLayout({
    title: "Manage Inventory - Full-Stack Ad Operations by HBDR | MCM",
    description: "HBDR Manage Inventory is a full-service MCM engagement: you delegate inventory and HBDR manages it in its own Google Ad Manager network — yield optimization, header bidding, demand partners and floor pricing.",
    ogTitle: "HBDR Manage Inventory - Full-Stack Ad Operations & Yield Management",
    ogDescription: "Hand off your ad monetization to HBDR. Under Google's MCM Manage Inventory, we manage your delegated inventory, demand partners and yield optimization from our own Ad Manager network.",
    canonicalPath: "/solutions/manage-inventory",
    bodyContent: content,
  });
}
