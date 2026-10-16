import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection } from "../components/blueprint";

export function renderTrustCompliancePage(): string {
  const supplyChainCards = [
    { title: "ads.txt Management", desc: "Every publisher in our network maintains an up-to-date ads.txt file listing HBDR as an authorized seller. We proactively monitor and manage ads.txt entries to prevent unauthorized inventory reselling and ensure buyers always know they're purchasing legitimate inventory." },
    { title: "sellers.json Compliance", desc: "HBDR maintains a complete and transparent sellers.json file, providing buyers with full visibility into who is selling inventory on our platform. Every publisher relationship is documented and verifiable." },
    { title: "app-ads.txt for Mobile", desc: "For our in-app publishers, we implement and maintain app-ads.txt to authorize legitimate ad sources and prevent mobile ad fraud across our app inventory." },
    { title: "SupplyChain Object (schain)", desc: "We pass complete supply chain objects in every bid request, giving DSPs and advertisers full transparency into every node in the supply path from publisher to buyer." },
  ];

  const antiFraudCards = [
    { title: "Invalid Traffic (IVT) Detection", desc: "We use multiple layers of fraud detection including pre-bid filtering, real-time monitoring, and post-bid analysis to identify and block bot traffic, click fraud, and other forms of invalid traffic." },
    { title: "Confiant Integration", desc: "Real-time creative security scanning that detects and blocks malicious ads, forced redirects, and cryptomining scripts before they reach users." },
    { title: "AdLightning Protection", desc: "Automated malvertising protection that scans every creative for quality, security, and compliance violations in real time." },
    { title: "TAG Anti-Fraud Certification", desc: "HBDR adheres to TAG's anti-fraud guidelines and participates in industry-wide efforts to combat ad fraud and protect advertiser spend." },
    { title: "Traffic Quality Monitoring", desc: "Continuous monitoring of traffic patterns across all publisher properties to identify anomalies, suspicious spikes, and potential fraud indicators." },
  ];

  const privacyCards = [
    { title: "GDPR Compliance", desc: "Full compliance with the EU General Data Protection Regulation. We implement proper consent collection, data processing agreements, and user rights management across all European traffic." },
    { title: "CCPA / CPRA Compliance", desc: "Compliance with California Consumer Privacy Act and California Privacy Rights Act, including support for the US Privacy String and Global Privacy Control signals." },
    { title: "TCF 2.0 Integration", desc: "Integration with IAB Europe's Transparency and Consent Framework, ensuring proper consent signals are passed through the programmatic supply chain." },
    { title: "CMP Integration", desc: "We work with leading Consent Management Platforms (OneTrust, Cookiebot, Didomi, etc.) to ensure publishers collect and manage user consent properly." },
    { title: "GPP Support", desc: "Support for IAB Tech Lab's Global Privacy Platform, a unified framework for handling privacy signals across multiple jurisdictions." },
    { title: "Data Minimization", desc: "We follow data minimization principles — we only collect and process data that is necessary for ad delivery and do not build user profiles or sell personal data." },
  ];

  const certifications = [
    { title: "TAG Certified", desc: "Trustworthy Accountability Group certification across anti-fraud, brand safety, and anti-piracy programs" },
    { title: "IAB Member", desc: "Active member of the Interactive Advertising Bureau, participating in industry standards development" },
    { title: "IAB Tech Lab", desc: "Compliance with IAB Tech Lab specifications including OpenRTB, ads.txt, sellers.json, and prebid standards" },
    { title: "Google Certified Publishing Partner (GCPP)", desc: "Certified by Google as a trusted partner for publisher monetization through Google Ad Manager and AdX" },
    { title: "Prebid Member", desc: "Active participant in the Prebid.org community, contributing to open-source header bidding standards" },
    { title: "Coalition for Better Ads", desc: "Adherence to the Coalition for Better Ads standards, ensuring ad formats meet user experience guidelines" },
  ];

  const capabilities = [
    { title: "Header Bidding", desc: "Client-side and server-side header bidding setup, optimization, and management using Prebid.js and server-to-server integrations" },
    { title: "Google Ad Manager (GAM)", desc: "Complete GAM account setup, configuration, yield management, and ongoing ad operations" },
    { title: "Programmatic Monetization", desc: "Open exchange, PMP, PG, and Preferred Deal management across all major SSPs and exchanges" },
    { title: "Video Advertising", desc: "Instream, outstream, and OTT/CTV video monetization with our custom-built high-performance video player" },
    { title: "Display & Native", desc: "Standard display, rich media, and native ad format optimization for maximum RPMs" },
    { title: "In-App Monetization", desc: "Mobile app ad monetization across banner, interstitial, rewarded video, and native formats" },
    { title: "Identity Solutions", desc: "Implementation of UID2, LiveRamp, ID5, and other identity solutions for the cookieless future" },
    { title: "Ad Quality & Safety", desc: "Malvertising protection, creative scanning, and brand safety controls across all inventory" },
    { title: "Consent Management", desc: "GDPR/CCPA/GPP compliant consent collection and signal propagation" },
    { title: "Analytics & Reporting", desc: "Real-time revenue dashboard with granular breakdowns by every dimension" },
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
    "Independent bloggers & content creators",
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
  ${renderPageHero("Trust & Compliance", "Trust & Compliance", "At HBDR, trust isn't just a value — it's the foundation of everything we build. We maintain the highest standards of transparency, compliance, and security across all our operations.")}

  <section class="bp-section" data-testid="trust-commitment-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-5">${renderEyebrow("Commitment")}<h2 class="mt-4 text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">Built on Trust</h2></div>
      <p class="col-span-12 lg:col-start-7 lg:col-span-6 self-end text-[var(--text-muted)] text-[1.0625rem] leading-relaxed">HBDR operates in one of the most complex ecosystems in digital advertising. With billions of ad transactions happening daily, trust and compliance aren't optional — they're essential. HBDR is committed to maintaining the highest standards across every aspect of our operations, from how we manage publisher inventory to how we handle user data.</p>
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
      <div class="mt-12">${renderFeatureRows(supplyChainCards.map((c, i) => ({ title: c.title, body: c.desc, testid: `trust-supply-${i}` })))}</div>`,
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
    body: defs(privacyCards, "trust-privacy"),
  })}
  ${renderSection({
    testid: "trust-certifications-section",
    eyebrow: "Industry",
    title: "Industry Partnerships & Certifications",
    body: `
      <div class="bp-table-wrap">
        <table class="bp-table">
          <thead><tr><th scope="col">Program</th><th scope="col">Scope</th></tr></thead>
          <tbody>${certifications.map((c, i) => `
            <tr data-testid="trust-cert-${i}"><td>${c.title}</td><td>${c.desc}</td></tr>`).join("")}
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
    description: "HBDR's commitment to transparency, compliance, and trust in ad technology. Learn about our certifications, policies, and industry partnerships.",
    canonicalPath: "/trust",
    bodyContent: content,
  });
}

