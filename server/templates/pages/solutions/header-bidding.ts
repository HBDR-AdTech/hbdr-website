import { renderLayout } from "../../layout";
import { renderBlueprintHero, renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection, renderSpecList } from "../../components/blueprint";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";

// Example auction (labelled as such): the same three bids, sold one network at a time and then all at once
const NETWORKS: [string, number][] = [["A", 1.8], ["B", 2.1], ["C", 3.4]];
const ROW_Y = [60, 170, 280];
const ARROW = '<marker id="hb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path class="sm-arrowhead" d="M1 1 L9 5 L1 9"/></marker>';

function renderAuctionDiagram(): string {
  const node = (x: number, y: number, w: number, label: string, cls = "") =>
    `<rect class="sm-node${cls}" x="${x}" y="${y}" width="${w}" height="52" rx="4"/><text class="sm-name${cls}" x="${x + w / 2}" y="${y + 31}" text-anchor="middle">${label}</text>`;
  const waterfall = `
            <text class="sm-k" x="0" y="20">Waterfall · one network at a time</text>
            ${node(0, 170, 130, "Ad request")}
            ${NETWORKS.map(([n], i) => node(250, ROW_Y[i], 170, `Network ${n}`, i === 2 ? " is-off" : "")).join("")}
            <path class="sm-wire" d="M130 196 H190 V86 H244" marker-end="url(#hb-arrow)"/>
            <path class="sm-wire" d="M335 112 V164" marker-end="url(#hb-arrow)"/>
            <path class="sm-wire is-off" d="M335 222 V280"/>
            <text class="sm-v" x="200" y="140">1</text><text class="sm-v" x="347" y="145">2</text>
            <text class="sm-v" x="436" y="91">passes</text>
            <text class="sm-v" x="436" y="201">fills at $2.10</text>
            <text class="sm-v is-off" x="436" y="301">$3.40 · never asked</text>
            <text class="sm-v" x="0" y="392">Sold at $2.10: the first network that accepts</text>`;
  const parallel = `
            <text class="sm-k is-win" x="600" y="20">Header bidding · every partner at once</text>
            ${node(600, 170, 130, "Ad request")}
            ${NETWORKS.map(([n], i) => node(830, ROW_Y[i], 150, `Bidder ${n}`, i === 2 ? " is-win" : "")).join("")}
            ${ROW_Y.map((y, i) => `<path class="sm-wire${i === 2 ? " is-win" : ""}" d="M730 196 H780 V${y + 26} H824" marker-end="url(#hb-arrow)"/>`).reverse().join("")}
            <text class="sm-v" x="742" y="186">1</text>
            ${NETWORKS.map(([, cpm], i) => `<text class="sm-v${i === 2 ? " is-win" : ""}" x="996" y="${ROW_Y[i] + 31}">$${cpm.toFixed(2)}${i === 2 ? " wins" : ""}</text>`).join("")}
            <text class="sm-v is-win" x="600" y="392">Sold at $3.40: the highest bid</text>`;
  return `<svg viewBox="0 0 1120 410" role="img" aria-label="Example: in a waterfall the ad request goes to Network A, which passes, then Network B, which fills at $2.10, so Network C's $3.40 is never asked for. With header bidding the request goes to all three bidders at once and Bidder C's $3.40 wins.">
            <defs>${ARROW}</defs>
            ${waterfall}
            <path class="sm-rule" d="M560 0 V410"/>
            ${parallel}
          </svg>`;
}

const FEATURES = [
  { title: "Dynamic Floor Pricing", body: "AI-driven floor prices that adapt in real time to market conditions, bid density, and historical performance to maximize CPMs." },
  { title: "Auto-Refresh Optimization", body: "Intelligent ad refresh cycles that maximize viewable impressions without sacrificing user experience or violating demand partner policies." },
  { title: "Granular Analytics", body: "Bid-level reporting across every demand partner, ad unit, device, and geography with real-time dashboards and automated alerting." },
  { title: "A/B Testing Engine", body: "Run controlled experiments on bidder configurations, timeout settings, and floor prices with statistical significance tracking." },
  { title: "Brand Safety Controls", body: "Comprehensive blocklists and category filters keep unwanted advertisers and creatives off your pages. ads.txt and sellers.json do a different job: they declare which companies are authorized to sell your inventory, which protects your revenue from spoofed supply." },
  { title: "Global Demand Network", body: "Access 65+ demand sources including Google AdX, Amazon TAM, Index Exchange, OpenX, and PubMatic from a single integration." },
];

export function renderHeaderBiddingPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Header Bidding",
    lede: "Maximize every impression with unified auctions powered by Prebid.js and server-side bidding. Our header bidding stack drives fierce competition among demand partners to unlock your true revenue potential.",
    actions: [
      { label: "Start Your Free Audit", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "Waterfall vs. header bidding", href: "#how" },
    ],
  })}

  <section class="bp-section" id="how" data-testid="hb-overview-section">
    <div class="bp-wrap">
      <div class="bp-grid12 sm-overview" data-testid="card-hb-overview">
        <div class="col-span-12 lg:col-span-5">${renderEyebrow("Unified Auctions")}<h2>How header bidding works.</h2></div>
        <div class="sm-copy col-span-12 lg:col-start-6 lg:col-span-7">
          <p>Header bidding asks every demand partner for a bid at the same time, before the ad server is called, instead of offering the impression to one network after another in a waterfall. The best header bid then competes in the ad server's first-price auction. HBDR's implementation leverages Prebid.js — the industry-standard open-source framework — combined with our proprietary server-side bidding infrastructure to ensure every impression is sold at the highest possible price.</p>
          <p>Our unified auction engine processes bids from 65+ demand sources in under 100 milliseconds, eliminating latency concerns while creating genuine competition for every ad slot. Publishers using HBDR's header bidding solution can see CPM uplift of up to 50% compared to traditional waterfall setups.</p>
        </div>
      </div>
      <div class="sm-figure sm-diagram">${renderDiagramFrame({
        label: "Example: the same three bids sold through a waterfall and through header bidding",
        bar: ["Sequential vs. parallel", "One impression · three demand sources"],
        body: renderAuctionDiagram(),
        caption: "Example data: bids are illustrative.",
        blueprint: true,
        testid: "hb-auction-diagram",
      })}</div>
    </div>
  </section>

  ${renderSection({
    testid: "hb-approach-section",
    eyebrow: "Our Approach",
    title: "Client-side and server-side bidding.",
    lede: "We deploy a hybrid architecture that combines the transparency of client-side auctions with the speed and scale of server-to-server connections.",
    body: renderFeatureRows([
      { title: "Client-Side (Prebid.js)", body: "Our optimized Prebid.js wrapper runs directly in the browser, enabling full auction transparency. We configure bid adapters for each demand partner, implement smart timeout management, and utilize price granularity settings tailored to your inventory. Cookie-based targeting works only where browsers allow it: Chrome still offers third-party cookies, while Safari blocks them all by default, so Prebid's User ID modules and first-party data carry targeting there.",
        list: ["Full bid-level reporting and transparency", "Cookie-based audience targeting support", "Real-time bid debugging and analytics"], testid: "card-client-side" },
      { title: "Server-Side (Prebid Server)", body: "Our Prebid Server infrastructure handles high-volume server-to-server connections, dramatically reducing page latency. This enables more demand partners to participate without impacting user experience or Core Web Vitals scores. Server-side bidders recognise users through cookie syncing or IDs passed from the page, and the server call still has to return inside the page's auction timeout.",
        list: ["Sub-100ms auction completion times", "Unlimited demand partner connections", "Zero impact on page load performance"], testid: "card-server-side" },
    ]),
  })}

  ${renderSection({
    testid: "hb-features-section",
    eyebrow: "Key Features",
    title: "Enterprise-grade header bidding.",
    lede: "Every feature designed to maximize yield and simplify operations.",
    body: `
      <ul class="sm-points">${FEATURES.map((f, i) => `
        <li data-testid="hb-feature-card-${i}"><h3>${f.title}</h3><p>${f.body}</p></li>`).join("")}
      </ul>`,
  })}

  ${renderSection({
    testid: "hb-settings-section",
    eyebrow: "Settings that decide yield",
    title: "Three settings to get right.",
    lede: "Most header bidding revenue is won or lost in configuration, not in the number of bidders.",
    body: `${renderFeatureRows([
      { title: "Auction timeout", body: "The time Prebid waits for bids before it calls the ad server. Too short and bids miss the auction; too long and the ad server call is delayed until people leave the page. Set the Prebid Server timeout to 50–75% of the auction timeout so server bids get back in time, and use analytics to find the bidders that time out, by region." },
      { title: "How bids reach Ad Manager", body: "Classic setups pass the bid as a key-value that matches price-priority line items, so the price is rounded to your granularity buckets. Ad Manager's header bidding trafficking for the Prebid wrapper reads true bid values instead and reports bids across channels; it supports web display traffic only." },
      { title: "First-price bidding", body: "Ad Manager has run unified first-price auctions since 2019, so a winning bid pays what it bid. Floors, timeouts and bidder choice therefore move revenue directly: test one change at a time and compare revenue per page, not CPM alone." },
    ])}
      <p class="mono mt-8 text-[var(--text-muted)]" data-testid="hb-source">Sources: Prebid.org, Prebid Timeouts, Price Granularity, Prebid Server overview and User ID module; Google Ad Manager Help, Header bidding trafficking with the Prebid wrapper; Google Ad Manager blog, first-price auctions (5 September 2019); Google, Update on Plans for Privacy Sandbox Technologies (17 October 2025); WebKit, Tracking Prevention; IAB Tech Lab, ads.txt.</p>`,
  })}

  <section class="bp-section" data-testid="hb-spec-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-5 grid gap-4 content-start">${renderEyebrow("Specifications")}<h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">At a glance.</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6">${renderSpecList([
        { label: "Client-side wrapper", value: "Prebid.js" },
        { label: "Server-side bidding", value: "Prebid Server" },
        { label: "Demand sources", value: "65+" },
        { label: "Auction completion", value: '<span class="mono">&lt; 100 ms</span>' },
        { label: "CPM uplift vs. waterfall", value: "50%<small>up to</small>" },
        { label: "Seller authorization", value: "ads.txt · sellers.json" },
      ])}</div>
    </div>
  </section>

  ${renderStatsSection()}

  ${renderCTASection("Ready to supercharge your header bidding?", "Start Your Free Audit")}`;

  return renderLayout({
    title: "Header Bidding Solutions - HBDR",
    description: "Maximize ad revenue with HBDR's enterprise header bidding solutions. Prebid.js, server-side bidding, unified auctions, and 65+ demand sources.",
    canonicalPath: "/solutions/header-bidding",
    bodyContent: content,
  });
}
