import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderDiagramFrame, renderSection } from "../components/blueprint";

export function renderPartnersPage(): string {
  const sspPartners = [
    { name: "Google Ad Exchange (AdX)", desc: "Premium programmatic demand from Google's marketplace" },
    { name: "Amazon TAM/UAM", desc: "Amazon's Transparent Ad Marketplace and Unified Ad Marketplace" },
    { name: "Magnite (formerly Rubicon Project)", desc: "Leading independent sell-side platform" },
    { name: "PubMatic", desc: "Cloud infrastructure platform for digital advertising" },
    { name: "Index Exchange", desc: "Transparent, real-time programmatic marketplace" },
    { name: "OpenX", desc: "Technology-forward SSP with quality-focused marketplace" },
    { name: "Xandr (Microsoft)", desc: "Microsoft's advertising platform and exchange" },
    { name: "Sovrn", desc: "Publisher-focused monetization and data platform" },
    { name: "TripleLift", desc: "Native, video, and display programmatic advertising" },
    { name: "GumGum", desc: "Contextual intelligence and advertising platform" },
    { name: "33Across", desc: "Attention-based programmatic marketplace" },
    { name: "Sharethrough", desc: "Enhanced supply-side platform for human-centric advertising" },
    { name: "Sonobi", desc: "Technology platform connecting premium publishers to demand" },
    { name: "EMX Digital", desc: "Full-service programmatic exchange" },
    { name: "Criteo", desc: "Commerce media and performance advertising" },
    { name: "Kargo", desc: "Premium digital advertising for mobile and web" },
  ];

  const dspPartners = [
    { name: "Google DV360 (Display & Video 360)", desc: "Google's enterprise demand-side platform" },
    { name: "The Trade Desk", desc: "Independent DSP for omnichannel advertising" },
    { name: "Amazon DSP", desc: "Amazon's demand-side platform for programmatic buying" },
    { name: "MediaMath", desc: "Enterprise DSP for omnichannel campaigns" },
    { name: "Xandr Invest", desc: "Microsoft's programmatic buying platform" },
    { name: "Yahoo DSP", desc: "Unified demand-side buying platform" },
    { name: "Basis Technologies (Centro)", desc: "Comprehensive media automation platform" },
    { name: "StackAdapt", desc: "Multi-channel programmatic advertising platform" },
  ];

  const identityPartners = [
    { name: "Unified ID 2.0 (UID2)", desc: "Open-source identity framework built on encrypted email and phone number data" },
    { name: "LiveRamp ATS (Authenticated Traffic Solution)", desc: "People-based identity resolution" },
    { name: "ID5", desc: "Universal, privacy-compliant identity infrastructure" },
    { name: "SharedID (Prebid)", desc: "First-party cookie-based identity from Prebid" },
    { name: "Google PPID (Publisher Provided Identifiers)", desc: "First-party audience signals to Google" },
    { name: "Lotame Panorama ID", desc: "People-based, privacy-compliant identity solution" },
  ];

  const compliancePartners = [
    { name: "TAG (Trustworthy Accountability Group)", desc: "Anti-fraud certification and brand safety" },
    { name: "IAB Tech Lab", desc: "ads.txt, sellers.json, app-ads.txt implementation" },
    { name: "Google CMP (Consent Management)", desc: "GDPR and CCPA consent collection" },
    { name: "Integral Ad Science (IAS)", desc: "Ad verification, viewability, and brand safety" },
    { name: "DoubleVerify", desc: "Media quality and performance authentication" },
    { name: "MOAT (Oracle)", desc: "Attention analytics and ad measurement" },
    { name: "Pixalate", desc: "Ad fraud detection and compliance analytics" },
  ];

  const techPartners = [
    { name: "Google Ad Manager (GAM)", desc: "Full ad serving and yield management integration" },
    { name: "Prebid.js", desc: "Open-source header bidding wrapper" },
    { name: "Amazon APS (A9)", desc: "Amazon Publisher Services server-to-server integration" },
    { name: "Google Open Bidding", desc: "Server-side exchange bidding through GAM" },
    { name: "Confiant", desc: "Real-time creative quality and security scanning" },
    { name: "AdLightning", desc: "Malvertising protection and creative blocking" },
    { name: "CMP Integration (OneTrust, Cookiebot, etc.)", desc: "Consent management platform integration" },
    { name: "Google Analytics & GA4", desc: "Revenue attribution and performance analytics" },
  ];

  // Outside facts only, each one sourced in docs/research/partners.md
  const cookieStatus = [
    ["Chrome", "Still supported. In April 2025 Google kept its current approach, a user choice in Chrome settings, and dropped the planned standalone prompt. Incognito mode blocks them by default."],
    ["Privacy Sandbox", "In October 2025 Google announced it is retiring most of its APIs, including Topics, Protected Audience and Attribution Reporting. CHIPS and FedCM stay."],
    ["Safari", "Blocked by default since March 2020 (Safari 13.1, iOS 13.4)."],
    ["Firefox", "Total Cookie Protection by default since June 2022: each website gets a separate cookie jar, so a tracker sees behaviour on one site only."],
  ];

  const list = (items: { name: string; desc: string }[], prefix: string, cols = 4) => `
      <ul class="co-defs" style="--cols:${cols}">${items.map((p, i) => `
        <li data-testid="partner-${prefix}-${i}"><span class="co-name">${p.name}</span><p>${p.desc}</p></li>`).join("")}
      </ul>`;

  // Where each partner group sits between a publisher and the advertiser; counts are the lists below
  const node = (x: number, w: number, title: string, sub: string, hi = false) => `
          <rect class="${hi ? "co-node-hi" : "co-node"}" x="${x}" y="50" width="${w}" height="100" rx="4"/>
          <text class="co-title" x="${x + 16}" y="92">${title}</text><text class="co-sub${hi ? " co-hi" : ""}" x="${x + 16}" y="118">${sub}</text>`;
  const band = (x: number, w: number, y: number, title: string, sub: string) => `
          <rect class="co-node-dash" x="${x}" y="${y}" width="${w}" height="58" rx="4"/>
          <text class="co-title" x="${x + 16}" y="${y + 25}">${title}</text><text class="co-sub" x="${x + 16}" y="${y + 45}">${sub}</text>`;
  const ecosystem = `
        <svg class="co-wide" viewBox="0 0 1160 380" role="img" aria-label="Supply path: your site or app, the HBDR stack with ${techPartners.length} technology integrations, ${sspPartners.length} SSP and exchange partners, ${dspPartners.length} DSP partners, then advertisers; ${identityPartners.length} identity integrations and ${compliancePartners.length} compliance and verification partners work along the path">
          <defs><marker id="pt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="co-arrow" d="M0 0 L10 5 L0 10 Z"/></marker></defs>
          ${node(20, 170, "Your site or app", "inventory")}
          ${node(250, 210, "HBDR stack", `${techPartners.length} tech integrations`, true)}
          ${node(520, 200, "SSPs & exchanges", `${sspPartners.length} partners`)}
          ${node(780, 170, "DSPs", `${dspPartners.length} partners`)}
          ${node(1010, 130, "Advertisers", "demand")}
          <path class="co-flow" d="M190 100 H248" marker-end="url(#pt-arrow)"/><path class="co-flow" d="M460 100 H518" marker-end="url(#pt-arrow)"/>
          <path class="co-flow" d="M720 100 H778" marker-end="url(#pt-arrow)"/><path class="co-flow" d="M950 100 H1008" marker-end="url(#pt-arrow)"/>
          ${band(250, 700, 200, `Identity &amp; data · ${identityPartners.length} integrations`, "addressability where no third-party cookie is set")}
          ${band(20, 1120, 288, `Compliance &amp; verification · ${compliancePartners.length} partners`, "fraud, viewability, consent and ads.txt checks along the whole path")}
          <path class="bp-tick" d="M250 182 V192 M950 182 V192 M20 270 V280 M1140 270 V280"/>
        </svg>`;

  const content = `
  ${renderPageHero("Partners", "Partners & Integrations", "HBDR's demand partners, technology integrations and data solutions, and where each one sits on the supply path.")}
  ${renderSection({
    testid: "partners-demand-section",
    eyebrow: "Integrated Demand Partners",
    title: "Demand Ecosystem",
    lede: "HBDR connects publishers to 65+ demand sources, so more buyers compete for every impression.",
    body: `${renderDiagramFrame({
      label: "Where each partner group sits in the supply path",
      blueprint: true,
      bar: ["supply path", "publisher → advertiser"],
      caption: "Schematic. Counts are the partners listed on this page.",
      body: ecosystem,
      testid: "partners-ecosystem-diagram",
    })}
      <h3 class="mt-16 mb-8 text-[1.5rem]">SSP &amp; Exchange Partners</h3>${list(sspPartners, "ssp")}
      <h3 class="mt-16 mb-8 text-[1.5rem]">DSP Partners</h3>${list(dspPartners, "dsp")}`,
  })}
  ${renderSection({
    testid: "partners-identity-section",
    eyebrow: "Identity",
    title: "Identity & Data Integrations",
    lede: "Identity solutions keep an audience addressable where no third-party cookie is set. Third-party cookies did not go away; they are missing on part of your traffic.",
    body: `
      <div class="bp-table-wrap mb-12" data-testid="partners-cookie-status">
        <table class="bp-table">
          <caption class="sr-only">Third-party cookie status by browser, October 2026</caption>
          <thead><tr><th scope="col">Browser or program</th><th scope="col">Third-party cookies, October 2026</th></tr></thead>
          <tbody>${cookieStatus.map(([who, what]) => `
            <tr><td>${who}</td><td>${what}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>${list(identityPartners, "identity", 3)}
      <p class="mt-8 mono text-[0.75rem] text-[var(--text-muted)]">Sources: Privacy Sandbox news, 22 Apr 2025 and 17 Oct 2025; WebKit blog, 24 Mar 2020; Mozilla blog, 14 Jun 2022.</p>`,
  })}
  ${renderSection({
    testid: "partners-compliance-section",
    eyebrow: "Verification",
    title: "Compliance & Verification Partners",
    body: list(compliancePartners, "compliance"),
  })}
  ${renderSection({
    testid: "partners-tech-section",
    eyebrow: "Technology",
    title: "Technology Integrations",
    body: list(techPartners, "tech"),
  })}
  ${renderCTASection("Ready to access our demand ecosystem?", "Become a Partner")}`;

  return renderLayout({
    title: "Partners & Integrations - HBDR",
    description: "HBDR's demand partners, SSPs, DSPs, identity, verification and technology integrations, and where each one sits on the supply path.",
    canonicalPath: "/partners",
    bodyContent: content,
  });
}

