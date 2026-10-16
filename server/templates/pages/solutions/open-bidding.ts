import { renderLayout } from "../../layout";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";
import { renderBlueprintHero, renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection } from "../../components/blueprint";

const ADVANTAGES = [
  { title: "Zero latency impact", body: "All auction processing happens server-to-server within Google's infrastructure. No JavaScript, no browser processing, no impact on page load speed or Core Web Vitals scores." },
  { title: "Unified auction", body: "Open Bidding participants compete directly against AdX demand in the same auction, ensuring the highest bid always wins. No more waterfall inefficiencies or last-look advantages." },
  { title: "Simplified billing", body: "Revenue from all Open Bidding partners is consolidated in your Google Ad Manager payment, reducing reconciliation complexity and providing a single, reliable payment stream." },
];

const FEATURES = [
  { title: "Partner selection", body: "We analyze your traffic profile to identify the ideal Open Bidding yield partners that complement your existing demand stack." },
  { title: "Hybrid strategy", body: "We configure Open Bidding to work seamlessly alongside Prebid.js, ensuring no demand cannibalization and optimal auction pressure." },
  { title: "Revenue tracking", body: "Detailed reporting on Open Bidding contribution with win rate, CPM trends, and incremental revenue attribution versus other demand channels." },
  { title: "Ongoing tuning", body: "Continuous optimization of yield partner configurations, timeout settings, and floor prices specific to the Open Bidding auction environment." },
];

// Hybrid auction: Prebid.js runs in the browser, Open Bidding runs server-to-server from Google Ad Manager (the mint zone)
const PARTNERS: [string, number][] = [["Third-party exchanges", 272], ["SSPs", 498], ["Google AdX", 724]];
const AUCTION_SVG = `
          <svg viewBox="0 0 960 470" role="img" aria-label="The page sends Prebid.js bid requests from the browser and one ad request to Google Ad Manager; Google Ad Manager calls Open Bidding exchanges, SSPs and Google AdX server-to-server, and every bid meets in one unified auction">
            <rect class="sg-node" x="24" y="180" width="180" height="88" rx="6"/>
            <text class="sg-name" x="114" y="219" text-anchor="middle">Your page</text>
            <text class="sg-sub" x="114" y="241" text-anchor="middle">Browser</text>
            <path class="sg-flow" d="M114 180 V66 H290"/><path class="sg-tick" d="M290 58 V74"/>
            <text class="sg-tag" x="202" y="56" text-anchor="middle">Bid requests</text>
            <rect class="sg-node" x="290" y="30" width="260" height="72" rx="6"/>
            <text class="sg-name" x="420" y="61" text-anchor="middle">Prebid.js bidders</text>
            <text class="sg-sub" x="420" y="83" text-anchor="middle">Client-side, in the browser</text>
            <path class="sg-flow" d="M550 66 H685 V180"/><path class="sg-tick" d="M677 180 H693"/>
            <text class="sg-tag" x="618" y="56" text-anchor="middle">Prebid bids</text>
            <path class="sg-flow" d="M204 224 H560"/><path class="sg-tick" d="M204 216 V232 M560 216 V232"/>
            <text class="sg-tag" x="382" y="212" text-anchor="middle">One ad request</text>
            <rect class="sg-node" x="560" y="180" width="250" height="88" rx="6"/>
            <text class="sg-name" x="685" y="215" text-anchor="middle">Google Ad Manager</text>
            <text class="sg-sub" x="685" y="239" text-anchor="middle">Unified auction · highest bid wins</text>
            <path class="sg-flow sg-flow-hi" d="M685 268 V296 M372 296 H824 ${PARTNERS.map(([, x]) => `M${x + 100} 296 V340`).join(" ")}"/>
            <path class="sg-tick sg-tick-hi" d="${PARTNERS.map(([, x]) => `M${x + 92} 340 H${x + 108}`).join(" ")}"/>
            <rect class="sg-zone sg-zone-hi" x="240" y="316" width="696" height="132" rx="10"/>
            ${PARTNERS.map(([name, x]) => `<rect class="sg-node" x="${x}" y="340" width="200" height="56" rx="6"/>
            <text class="sg-name" x="${x + 100}" y="373" text-anchor="middle" style="font-size:15px">${name}</text>`).join("\n            ")}
            <text class="sg-tag sg-tag-hi" x="262" y="428">Open Bidding · server-to-server</text>
            <text class="sg-sub" x="914" y="428" text-anchor="end">No JavaScript, no browser processing</text>
          </svg>`;

export function renderOpenBiddingPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Open Bidding",
    lede: "Leverage Google Open Bidding (formerly EBDA) for server-to-server real-time auctions that bring additional demand into your Google Ad Manager stack without client-side overhead.",
    actions: [
      { label: "Get Started Today", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "See the hybrid auction", href: "#overview", testid: "button-hero-learn" },
    ],
  })}

  <section class="bp-section" id="overview" data-testid="ob-overview-section">
    <div class="bp-wrap bp-grid12 sg-split" data-testid="card-ob-overview">
      <div class="col-span-12 lg:col-span-5 grid gap-5 content-start">${renderEyebrow("Server-to-server bidding")}<h2>What is Open Bidding?</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 sg-prose">
        <p>Google Open Bidding (formerly Exchange Bidding Dynamic Allocation, or EBDA) is Google's server-side bidding solution that allows third-party exchanges and SSPs to compete in a unified auction alongside Google Ad Exchange demand — all within Google Ad Manager. Unlike client-side header bidding, Open Bidding happens server-to-server, eliminating page latency while maintaining competitive auction dynamics.</p>
        <p>HBDR configures and manages your Open Bidding setup to complement your existing header bidding stack, creating a multi-layered auction strategy that maximizes competition and revenue. Our hybrid approach ensures you capture demand from partners that perform better in server-side environments while maintaining the transparency benefits of client-side Prebid.</p>
      </div>
    </div>
    <div class="bp-wrap mt-14 sg-diagram">${renderDiagramFrame({
      label: "Diagram of a hybrid Prebid.js and Open Bidding auction",
      testid: "ob-auction-diagram",
      blueprint: true,
      bar: ["Open Bidding", "Hybrid auction · client + server"],
      body: AUCTION_SVG,
      caption: "Schematic: HBDR's hybrid setup runs Prebid.js and Open Bidding together; partner names omitted.",
    })}
    </div>
  </section>

  ${renderSection({
    testid: "ob-advantages-section",
    eyebrow: "Advantages",
    title: "Why Open Bidding matters.",
    lede: "Combine the best of server-side speed with the scale of Google's ecosystem.",
    body: `
      <div class="sg-cols" style="--cols:3">${ADVANTAGES.map((a, i) => `
        <div data-testid="ob-advantage-card-${i}"><h3>${a.title}</h3><p>${a.body}</p></div>`).join("")}
      </div>`,
  })}

  ${renderSection({
    testid: "ob-features-section",
    eyebrow: "HBDR advantage",
    title: "Our Open Bidding expertise.",
    lede: "We maximize Open Bidding performance through strategic partner selection and ongoing optimization.",
    body: renderFeatureRows(FEATURES.map((f, i) => ({ ...f, testid: `ob-feature-card-${i}` }))),
  })}

  ${renderStatsSection()}

  ${renderCTASection("Ready to activate Open Bidding?", "Get Started Today")}`;

  return renderLayout({
    title: "Open Bidding Solutions - HBDR",
    description: "Maximize revenue with Google Open Bidding. Server-to-server real-time auctions with zero latency impact and unified auction dynamics in Google Ad Manager.",
    canonicalPath: "/solutions/open-bidding",
    bodyContent: content,
  });
}
