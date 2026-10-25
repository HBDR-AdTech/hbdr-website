import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection } from "../components/blueprint";

const DIMENSIONS = [
  { title: "By Ad Unit", tab: "Ad unit", description: "Break down performance by individual ad units to identify top performers and underperformers across your inventory." },
  { title: "By Geography", tab: "Geography", description: "See revenue, CPMs, and fill rates broken down by country, region, and city to optimize your geo-targeting strategy." },
  { title: "By Carrier", tab: "Carrier", description: "Mobile carrier-level analytics showing performance across different network providers for granular mobile insights." },
  { title: "By App Name & App ID", tab: "App", description: "For in-app publishers, drill down into individual app-level performance metrics with full app name and ID visibility." },
  { title: "By Device Type", tab: "Device", description: "Desktop, mobile, and tablet breakdowns with device-specific optimization insights to tailor your ad strategy." },
  { title: "By Demand Source", tab: "Demand source", description: "See which SSPs and demand partners are driving the most value, compare bid rates, and optimize your partner mix." },
];

const VIEWS = [
  { testid: "card-adx-revenue", title: "AdX Revenue & Performance", description: "Google Ad Exchange metrics including CPMs, fill rates, revenue, and impression-level data. Track your AdX performance hour by hour." },
  { testid: "card-adserver-revenue", title: "Ad Server Revenue & Performance", description: "Overall ad server (GAM) metrics and delivery data. Monitor line item pacing, total impressions served, and overall ad server revenue across all demand channels." },
  { testid: "card-ssp-revenue", title: "SSP Performance", description: "Individual SSP and demand partner performance comparison. Evaluate bid rates, win rates, CPMs, and revenue contribution from each partner to optimize your demand stack." },
];

const FEATURES = [
  { title: "Hourly Data", description: "Reporting updates every hour." },
  { title: "Custom Date Ranges", description: "Select any date range to analyze trends, compare periods, and track growth." },
  { title: "Exportable Reports", description: "Download your data in CSV or PDF format for offline analysis and stakeholder sharing." },
  { title: "Automated Email Reports", description: "Schedule daily or weekly reports delivered straight to your inbox." },
  { title: "Revenue Forecasting", description: "Predictive analytics that help you plan ahead with revenue projections." },
  { title: "Anomaly Detection", description: "Automatic alerts when revenue, fill rates, or CPMs deviate from expected patterns." },
  { title: "Multi-Site Management", description: "A single view across all your properties for consolidated performance monitoring." },
  { title: "Access Controls", description: "User-level permissions so your team sees exactly what they need." },
];

const EXTERNAL = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>';

// An example report drawn as a wireframe: the dimensions, date range, export and anomaly alert named on this page.
// It carries no numbers on purpose, so nothing in it reads as real performance data.
function renderExampleReport(): string {
  let x = 20;
  const tabs = DIMENSIONS.map((d, i) => {
    const w = d.tab.length * 8.4 + 28, at = x; x += w + 6;
    return `<text class="co-mock-tab${i === 0 ? " co-mock-tab-on" : ""}" x="${at + 14}" y="44">${d.tab}</text>${i === 0 ? `<path class="co-flow-hi" d="M${at} 60 H${at + w}"/>` : ""}`;
  }).join("");
  const trend = [[20, 220], [120, 196], [220, 206], [320, 170], [420, 182], [520, 150], [620, 160], [700, 236], [780, 168], [880, 142], [980, 150], [1080, 124], [1140, 130]];
  const cols = [["Ad unit", 20], ["Revenue", 420], ["CPM", 600], ["Fill rate", 780], ["Impressions", 960]] as const;
  const rows = [0, 1, 2, 3].map((r) => {
    const y = 400 + r * 40;
    return `<path class="co-grid-line" d="M20 ${y + 22} H1140"/><rect class="bp-copy" x="20" y="${y}" width="${[220, 180, 200, 150][r]}" height="10" rx="2"/>${cols.slice(1).map(([, cx]) => `<rect class="bp-copy" x="${cx}" y="${y}" width="${[90, 70, 80, 60][r]}" height="10" rx="2"/>`).join("")}`;
  }).join("");
  return `
        <svg class="co-wide" viewBox="0 0 1160 560" role="img" aria-label="Example report layout: dimension tabs for ad unit, geography, carrier, app, device and demand source; a custom date range and CSV or PDF export; a revenue trend line with one anomaly alert; and a table of revenue, CPM, fill rate and impressions with placeholder rows">
          ${tabs}
          <path class="co-grid-line" d="M20 61 H1140"/>
          <rect class="co-node" x="850" y="22" width="170" height="30" rx="4"/><text class="co-sub" x="866" y="42">Date range: custom</text>
          <rect class="co-node" x="1030" y="22" width="110" height="30" rx="4"/><text class="co-sub" x="1046" y="42">CSV · PDF</text>
          <text class="co-sub" x="20" y="100">Revenue · updates every hour</text>
          ${[130, 180, 230, 280].map((y) => `<path class="co-grid-line" d="M20 ${y} H1140"/>`).join("")}
          <path class="co-trend" d="M${trend.map((p) => p.join(" ")).join(" L")}"/>
          <circle cx="700" cy="236" r="6" fill="var(--accent)"/><circle cx="700" cy="236" r="13" fill="none" stroke="var(--accent)" stroke-width="1" opacity="0.6"/>
          <path class="co-callout" d="M713 242 L760 290 H850"/><text class="bp-label" x="858" y="295" style="fill:var(--accent);font-size:13px">anomaly alert</text>
          <path class="co-grid-line" d="M20 330 H1140"/>
          ${cols.map(([t, cx]) => `<text class="co-sub" x="${cx}" y="370">${t}</text>`).join("")}
          <path class="co-grid-line" d="M20 382 H1140"/>
          ${rows}
        </svg>`;
}

export function renderDashboardPage(): string {
  const content = `
  ${renderPageHero("Dashboard", "Analytics Dashboard", "Hourly analytics and reporting that show publishers how their ads perform, by demand source, ad unit, geography and device.")}

  <section class="bp-section" data-testid="dashboard-overview-section">
    <div class="bp-wrap bp-grid12" data-testid="card-dashboard-overview">
      <div class="col-span-12 lg:col-span-5 grid gap-4 content-start">
        ${renderEyebrow("Analytics Suite")}
        <h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">Your Revenue Command Center</h2>
      </div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 grid gap-5 text-[1.0625rem] leading-relaxed text-[var(--text-muted)]">
        <p>HBDR's proprietary analytics dashboard is a comprehensive data suite that gives publishers complete visibility into their ad performance. From hourly revenue tracking to breakdowns by geography, device, and demand source, every metric you need is at your fingertips.</p>
        <p>The dashboard is fully web-based, updates every hour, and is accessible from anywhere. Whether you manage a single site or a portfolio of properties, our command center consolidates all your data into one powerful interface.</p>
        <div><a href="https://dashboard.hbdr.com" target="_blank" rel="noopener noreferrer" class="glass-btn text-[0.9375rem]" data-testid="link-dashboard-external">Access Dashboard${EXTERNAL}</a></div>
      </div>
    </div>
  </section>
  ${renderSection({
    testid: "dashboard-dimensions-section",
    eyebrow: "Data Dimensions",
    title: "Slice Your Data Any Way You Need",
    lede: "Drill down into performance across every dimension that matters to your business.",
    body: `${renderDiagramFrame({
      label: "Example report layout",
      blueprint: true,
      bar: ["Example report", "Illustrative layout · no real data"],
      caption: "Example: a layout drawn for this page, not a screenshot of the live dashboard. Rows are placeholders.",
      body: renderExampleReport(),
      testid: "dashboard-example-report",
    })}
      <div class="mt-12">${renderFeatureRows(DIMENSIONS.map((d, i) => ({ title: d.title, body: d.description, testid: `dashboard-dimension-card-${i}` })))}</div>`,
  })}
  ${renderSection({
    testid: "dashboard-revenue-section",
    eyebrow: "Revenue Views",
    title: "Complete Revenue Visibility",
    lede: "Understand exactly where your revenue comes from with dedicated views for every monetization channel.",
    body: `
      <ul class="co-defs">${VIEWS.map((v) => `
        <li data-testid="${v.testid}"><h3>${v.title}</h3><p>${v.description}</p></li>`).join("")}
      </ul>
      <div class="mt-12"><a href="https://dashboard.hbdr.com" target="_blank" rel="noopener noreferrer" class="glass-btn text-[0.9375rem]" data-testid="link-dashboard-external-2">Access Dashboard${EXTERNAL}</a></div>`,
  })}
  ${renderSection({
    testid: "dashboard-features-section",
    eyebrow: "Platform Features",
    title: "Everything You Need in One Dashboard",
    lede: "Built for publishers who demand speed, accuracy, and actionable insights.",
    body: `
      <ul class="co-defs" style="--cols:4">${FEATURES.map((f, i) => `
        <li data-testid="dashboard-feature-card-${i}"><h3>${f.title}</h3><p>${f.description}</p></li>`).join("")}
      </ul>`,
  })}
  ${renderCTASection("Ready to see your data?", "Access Dashboard")}`;

  return renderLayout({
    title: "Analytics Dashboard - HBDR",
    description: "HBDR's proprietary analytics dashboard gives publishers complete visibility into ad performance with hourly data, revenue breakdowns and alerts.",
    canonicalPath: "/dashboard",
    bodyContent: content,
  });
}
