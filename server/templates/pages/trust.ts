import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection } from "../components/blueprint";

export function renderTrustCompliancePage(): string {
  const supplyChainCards = [
    { title: "ads.txt Management", desc: "Each publisher gets the exact ads.txt lines to add for HBDR and its demand partners. Buyers check each line against the seller's sellers.json entry, so the account ID in the line must match the seller ID exactly." },
    { title: "sellers.json Compliance", desc: "HBDR publishes a sellers.json file that lists each publisher it sells for, with its seller ID, name, domain and seller type, so a buyer can see who is selling the impression." },
    { title: "app-ads.txt for Mobile", desc: "For our in-app publishers, we implement and maintain app-ads.txt to authorize legitimate ad sources and prevent mobile ad fraud across our app inventory." },
    { title: "SupplyChain Object (schain)", desc: "We pass complete supply chain objects in every bid request, giving DSPs and advertisers full transparency into every node in the supply path from publisher to buyer." },
  ];

  const antiFraudCards = [
    { title: "Invalid Traffic (IVT) Filtering", desc: "Invalid traffic, such as bots, is detected and filtered so buyers do not pay for it." },
    { title: "Traffic Quality Monitoring", desc: "Traffic patterns across publisher properties are watched for anomalies and sudden spikes." },
    { title: "Ad Verification (coming soon)", desc: "Creative scanning and verification through Confiant, IAS or DoubleVerify is on the roadmap. It is not live today." },
  ];

  const privacyCards = [
    { title: "GDPR Compliance", desc: "Full compliance with the EU General Data Protection Regulation. We implement proper consent collection, data processing agreements, and user rights management across all European traffic." },
    { title: "CCPA / CPRA Compliance", desc: "Compliance with California Consumer Privacy Act and California Privacy Rights Act, including support for US privacy signals and Global Privacy Control. California requires a business to treat Global Privacy Control as a valid opt-out of sale and sharing. The older US Privacy String was deprecated on 31 January 2024 in favour of GPP." },
    { title: "IAB TCF Integration", desc: "Integration with IAB Europe's Transparency and Consent Framework, ensuring proper consent signals are passed through the programmatic supply chain. TCF v2.3 is the current version: since 28 February 2026 every TC string must carry the Disclosed Vendors section." },
    { title: "CMP Integration", desc: "We work with leading Consent Management Platforms (OneTrust, Cookiebot, Didomi, etc.) to ensure publishers collect and manage user consent properly." },
    { title: "GPP Support", desc: "Support for IAB Tech Lab's Global Privacy Protocol (GPP), one string that carries the privacy signals of several jurisdictions: the US National section, US state sections, and the TCF for Europe and Canada." },
    { title: "Data Minimization", desc: "We follow data minimization principles: we only collect and process data that is necessary for ad delivery." },
    { title: "US State Privacy Laws", desc: "Twenty US states have a comprehensive privacy law in effect in 2026. Indiana, Kentucky and Rhode Island joined on 1 January 2026. Google Ad Manager accepts only the GPP sections for US National, California, Colorado, Connecticut, Florida and Virginia. An opt-out of sale, sharing or targeted advertising in the US National section makes Google switch to restricted data processing." },
    { title: "COPPA", desc: "The FTC's amended COPPA Rule took effect on 23 June 2025, and operators had until 22 April 2026 to comply. A child-directed site or app now needs separate verifiable parental consent before it discloses a child's data to third parties such as ad networks. Bid requests for that inventory carry the OpenRTB flag regs.coppa = 1." },
  ];

  // D-029: HBDR holds no certifications or memberships; list only standards it implements.
  const standardsWeFollow = [
    { title: "ads.txt and app-ads.txt (IAB Tech Lab)", desc: "Publishers list HBDR and its demand partners as authorized sellers, on the website or the app's developer site." },
    { title: "sellers.json (IAB Tech Lab)", desc: "HBDR publishes each seller it represents, with seller ID, name, domain and seller type." },
    { title: "SupplyChain object (IAB Tech Lab)", desc: "Bid requests carry each node on the supply path from the publisher to the buyer." },
    { title: "OpenRTB (IAB Tech Lab)", desc: "Server-side bid requests use OpenRTB; child-directed inventory carries regs.coppa = 1." },
    { title: "TCF v2.3 (IAB Europe)", desc: "The consent string from the publisher's CMP travels with each request for EEA, UK and Swiss traffic." },
    { title: "GPP and Global Privacy Control", desc: "US state privacy signals travel with each request." },
    { title: "Better Ads Standards (Coalition for Better Ads)", desc: "Ad layouts follow the Better Ads Standards, including the 30% ad density limit on mobile." },
  ];

  const capabilities = [
    { title: "Header Bidding", desc: "Client-side and server-side header bidding setup, optimization, and management using Prebid.js and server-to-server integrations" },
    { title: "Google Ad Manager (GAM)", desc: "GAM setup, yield management and ad operations. HBDR is a Google MCM partner: an MCM parent on Ad Manager 360 offering Manage Account and Manage Inventory" },
    { title: "Programmatic Monetization", desc: "Open exchange demand from SSPs and DSPs in every geography, with the ability to access PMP and programmatic guaranteed deals" },
    { title: "Video Advertising", desc: "Instream, outstream, and OTT/CTV video monetization with our custom-built high-performance video player" },
    { title: "Display & Native", desc: "Standard display, rich media, and native ad format optimization for maximum RPMs" },
    { title: "In-App Monetization", desc: "Mobile app ad monetization across banner, interstitial, rewarded video, and native formats" },
    { title: "Identity Solutions", desc: "Implementation of UID2, LiveRamp, ID5, and other identity solutions for traffic with no third-party cookie: Safari and Firefox by default, and Chrome users who block them" },
    { title: "Ad Quality & Safety", desc: "Invalid traffic filtering today; creative verification through Confiant, IAS or DoubleVerify is coming soon" },
    { title: "Consent Management", desc: "GDPR/CCPA/GPP compliant consent collection and signal propagation" },
    { title: "Analytics & Reporting", desc: "Hourly revenue and bidder reporting, with alerts and CSV exports" },
    { title: "Ad Layout Optimization", desc: "Data-driven ad placement and layout testing to maximize revenue without hurting UX" },
    { title: "Floor Price Management", desc: "Dynamic and rule-based floor pricing strategies to capture maximum value from every impression" },
  ];

  const publishersWeServe = [
    "News & Media companies",
    "Entertainment & Lifestyle sites",
    "Sports publishers",
    "Technology & SaaS blogs",
    "Finance & Investing platforms",
    "Gaming & Esports sites",
    "Education & Reference portals",
    "Health & Wellness publishers",
    "E-commerce & Shopping sites",
    "Mobile app developers",
    "CTV & OTT content providers",
  ];

  const advertisersWeServe = [
    "Brand advertisers seeking premium placements",
    "Performance marketers driving conversions",
    "Agencies managing multi-brand campaigns",
    "Direct-to-consumer (DTC) brands",
    "Enterprise B2B companies",
    "Regional and local businesses seeking targeted reach",
  ];

  // Outside facts only, each one sourced in docs/research/trust.md
  const standards = [
    ["ads.txt", "The publisher's root domain, at /ads.txt", "Which ad systems and account IDs may sell the site. DIRECT means the publisher controls the account; RESELLER means it has authorized another company to sell through it.", "v1.1 (August 2022) adds OWNERDOMAIN and MANAGERDOMAIN"],
    ["app-ads.txt", "The developer website named in the app store listing", "The same authorization for in-app inventory. Google finds the file only if the store listing names a developer website.", "v1.1, shared with ads.txt"],
    ["sellers.json", "Each SSP's and exchange's own domain", "Who is behind each seller ID: PUBLISHER (owns the inventory), INTERMEDIARY (resells it) or BOTH. A buyer matches the ID to the ads.txt line.", "Finalized July 2019"],
    ["SupplyChain object (schain)", "Inside every bid request", "Every company that handled the request, one node each (asi, sid, hp). complete = 1 says the chain reaches back to the inventory owner.", "source.schain in OpenRTB 2.6; source.ext.schain in 2.5"],
  ];

  const defs = (items: { title: string; desc: string }[], prefix: string) => `
      <ul class="co-defs">${items.map((c, i) => `
        <li data-testid="${prefix}-${i}"><h3>${c.title}</h3><p>${c.desc}</p></li>`).join("")}
      </ul>`;

  // The four supply-chain items above, drawn where each one lives on the path from publisher to buyer
  const node = (x: number, title: string, file: string, note: string, hi = false) => `
          <rect class="${hi ? "co-node-hi" : "co-node"}" x="${x}" y="40" width="300" height="116" rx="4"/>
          <text class="co-title" x="${x + 18}" y="78">${title}</text>
          <text class="co-sub${hi ? " co-hi" : ""}" x="${x + 18}" y="106">${file}</text><text class="co-sub" x="${x + 18}" y="128">${note}</text>`;
  const supplyPath = `
        <svg class="co-wide" viewBox="0 0 1160 300" role="img" aria-label="Publisher sites and apps list HBDR as an authorized seller in ads.txt and app-ads.txt; HBDR documents every publisher relationship in sellers.json; every bid request carries a SupplyChain object naming each node from publisher to buyer">
          <defs><marker id="tr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="co-arrow" d="M0 0 L10 5 L0 10 Z"/></marker></defs>
          ${node(20, "Publisher site or app", "ads.txt · app-ads.txt", "lists HBDR as authorized seller")}
          ${node(430, "HBDR", "sellers.json", "documents every publisher", true)}
          ${node(840, "DSPs and advertisers", "buyer", "sees who is selling")}
          <path class="co-flow" d="M320 98 H428" marker-end="url(#tr-arrow)"/><path class="co-flow" d="M730 98 H838" marker-end="url(#tr-arrow)"/>
          <text class="co-sub" x="375" y="88" text-anchor="middle">inventory</text><text class="co-sub" x="785" y="88" text-anchor="middle">bid request</text>
          <path class="co-flow-hi" d="M170 222 H990"/><path class="bp-tick" d="M170 212 V232 M580 212 V232 M990 212 V232" style="stroke:var(--accent)"/>
          <path class="co-flow-back" d="M170 156 V212 M580 156 V212 M990 156 V212"/>
          <text class="bp-label" x="580" y="262" text-anchor="middle">SupplyChain object (schain): every node from publisher to buyer</text>
        </svg>`;

  const content = `
  ${renderPageHero("Trust & Compliance", "Trust & Compliance", "The supply-chain files, traffic-quality checks and privacy signals behind every impression HBDR sells, and the current version of each standard.")}

  <section class="bp-section" data-testid="trust-commitment-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-5">${renderEyebrow("Commitment")}<h2 class="mt-4 text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">Trust a buyer can check</h2></div>
      <p class="col-span-12 lg:col-start-7 lg:col-span-6 self-end text-[var(--text-muted)] text-[1.0625rem] leading-relaxed">Before a buyer bids, it checks the impression against public files and signals: ads.txt on the publisher's domain, sellers.json on each seller's domain, the SupplyChain object in the bid request and the consent string that travels with it. This page explains each standard as it stands in October 2026 and how HBDR applies it.</p>
    </div>
  </section>
  ${renderSection({
    testid: "trust-supply-chain-section",
    eyebrow: "Supply chain",
    title: "Supply Chain Transparency",
    lede: "Each file and signal below answers one buyer question: is this seller authorized, and who touched the impression on its way to me?",
    body: `${renderDiagramFrame({
      label: "Where ads.txt, sellers.json and the SupplyChain object sit on the supply path",
      blueprint: true,
      bar: ["supply path", "publisher → buyer"],
      body: supplyPath,
      testid: "trust-supply-diagram",
    })}
      <div class="mt-12">${renderFeatureRows(supplyChainCards.map((c, i) => ({ title: c.title, body: c.desc, testid: `trust-supply-${i}` })))}</div>
      <h3 class="mt-16 mb-8 text-[1.5rem]">The standards, explained</h3>
      <div class="bp-table-wrap" data-testid="trust-standards-table">
        <table class="bp-table">
          <thead><tr><th scope="col">Standard</th><th scope="col">Where it lives</th><th scope="col">What it tells a buyer</th><th scope="col">Current version</th></tr></thead>
          <tbody>${standards.map((s) => `
            <tr><td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td>${s[3]}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="mt-6 mono text-[0.75rem] text-[var(--text-muted)]">Sources: IAB Tech Lab ads.txt 1.1, sellers.json and SupplyChain object specifications; Google AdMob Help, app-ads.txt.</p>`,
  })}
  ${renderSection({
    testid: "trust-anti-fraud-section",
    eyebrow: "Traffic quality",
    title: "Anti-Fraud & Traffic Quality",
    body: renderFeatureRows(antiFraudCards.map((c, i) => ({ title: c.title, body: c.desc, testid: `trust-fraud-${i}` }))),
  })}
  ${renderSection({
    testid: "trust-privacy-section",
    eyebrow: "Privacy",
    title: "Privacy & Data Protection",
    lede: "Consent and opt-out signals travel with each ad request: the TCF string for Europe, GPP for US states, and Global Privacy Control from the browser.",
    body: `${defs(privacyCards, "trust-privacy")}
      <p class="mt-8 mono text-[0.75rem] text-[var(--text-muted)]">Sources: IAB Europe, TCF v2.3; IAB Tech Lab, GPP and USPrivacy; Google Ad Manager Help, GPP; California Privacy Protection Agency FAQ; MultiState, Feb 2026; Federal Register, COPPA Rule, 22 Apr 2025; IAB Tech Lab, OpenRTB 2.6.</p>`,
  })}
  ${renderSection({
    testid: "trust-standards-we-follow-section",
    eyebrow: "Standards",
    title: "Standards We Follow",
    lede: "The industry standards HBDR implements in its own stack.",
    body: `
      <div class="bp-table-wrap">
        <table class="bp-table">
          <thead><tr><th scope="col">Standard</th><th scope="col">How HBDR applies it</th></tr></thead>
          <tbody>${standardsWeFollow.map((c, i) => `
            <tr data-testid="trust-follow-${i}"><td>${c.title}</td><td>${c.desc}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>`,
  })}
  ${renderSection({
    testid: "trust-capabilities-section",
    eyebrow: "Capabilities",
    title: "What HBDR Does",
    lede: "HBDR is a full-service ad technology and ad operations company serving publishers and advertisers across every channel, format, and device.",
    body: defs(capabilities, "trust-capability"),
  })}
  ${renderSection({
    testid: "trust-who-we-serve-section",
    eyebrow: "Customers",
    title: "Serving Every Type of Publisher & Advertiser",
    body: `
      <div class="bp-grid12 co-pair">
        <div class="col-span-12 md:col-span-6" data-testid="trust-publishers-served">
          <h3>Publishers We Serve</h3>
          <ul class="bp-list">${publishersWeServe.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="col-span-12 md:col-span-6" data-testid="trust-advertisers-served">
          <h3>Advertisers We Serve</h3>
          <ul class="bp-list">${advertisersWeServe.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>`,
  })}
  ${renderCTASection("Ready to work with a trusted partner?", "Get In Touch")}`;

  return renderLayout({
    title: "Trust & Compliance - HBDR",
    description: "HBDR's commitment to transparency, compliance, and trust in ad technology. Learn about the standards we follow and how we handle supply chain, traffic quality and privacy.",
    canonicalPath: "/trust",
    bodyContent: content,
  });
}

