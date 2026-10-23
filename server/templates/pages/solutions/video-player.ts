import { renderLayout } from "../../layout";
import { renderBlueprintHero, renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection, renderSpecList } from "../../components/blueprint";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";

const ARROW = '<marker id="video-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path class="sm-arrowhead" d="M1 1 L9 5 L1 9"/></marker>';

// Request flow on top, then where the ad plays: inside content video (instream) or in the article itself (outstream)
function renderFlowDiagram(): string {
  const flow: [string, string, number, number][] = [
    ["Player", "instream or outstream", 0, 200], ["Video header bidding", "multiple demand sources", 290, 240],
    ["Ad response", "VAST · VMAP", 620, 220], ["Ad plays", "in the HBDR player", 930, 190],
  ];
  const nodes = flow.map(([name, sub, x, w], i) => {
    const win = i === flow.length - 1 ? " is-win" : "";
    const arrow = i ? `<path class="sm-wire" d="M${flow[i - 1][2] + flow[i - 1][3]} 66 H${x - 6}" marker-end="url(#video-arrow)"/>` : "";
    return `${arrow}<rect class="sm-node${win}" x="${x}" y="40" width="${w}" height="52" rx="4"/><text class="sm-name" x="${x + w / 2}" y="71" text-anchor="middle">${name}</text><text class="sm-v${win}" x="${x + w / 2}" y="118" text-anchor="middle">${sub}</text>`;
  }).join("");
  // [x0, x1, ad?, label]
  const timeline: [number, number, boolean, string][] = [
    [0, 100, true, "pre-roll"], [100, 470, false, "content"], [470, 570, true, ""], [570, 670, true, "mid-roll · ad pod"], [670, 1010, false, "content"], [1010, 1110, true, "post-roll"],
  ];
  const segs = timeline.map(([a, b, ad, label]) => `<rect class="${ad ? "sm-ad" : "sm-seg"}" x="${a}" y="190" width="${b - a}" height="40" rx="2"/>${label
    ? ad ? `<text class="sm-v is-win" x="${label.startsWith("mid") ? 570 : (a + b) / 2}" y="256" text-anchor="middle">${label}</text>` : `<text class="sm-v" x="${(a + b) / 2}" y="215" text-anchor="middle">${label}</text>`
    : ""}`).join("");
  const copy = [[20, 340, 500], [20, 360, 460], [20, 380, 490], [216, 418, 300], [216, 438, 280], [216, 458, 300], [216, 478, 250], [216, 498, 290]]
    .map(([x, y, w]) => `<rect class="bp-copy" x="${x}" y="${y}" width="${w}" height="10" rx="2"/>`).join("");
  return `<svg viewBox="0 0 1120 540" role="img" aria-label="The player requests an ad, video header bidding collects bids from multiple demand sources, a VAST ad response comes back and the ad plays. Instream: pre-roll, a mid-roll ad pod and post-roll around the content video. Outstream: a player inside the article that starts when it scrolls into view.">
            <defs>${ARROW}</defs>
            <text class="sm-k" x="0" y="20">Request flow</text>
            ${nodes}
            <path class="sm-rule" d="M0 146 H1120"/>
            <text class="sm-k" x="0" y="176">Instream · inside content video</text>
            ${segs}
            <path class="sm-rule" d="M0 290 H1120"/>
            <text class="sm-k" x="0" y="320">Outstream · no content video required</text>
            ${copy}
            <rect class="sm-node is-off" x="6" y="400" width="530" height="124" rx="4" style="fill:none"/>
            <text class="sm-k" x="548" y="414">viewport</text>
            <rect class="sm-ad" x="20" y="412" width="176" height="99" rx="3"/>
            <path class="sm-play" d="M98 446 L98 478 L124 462 Z"/>
            <text class="sm-name" x="600" y="440">Plays when it scrolls into view</text>
            <text class="sm-v" x="600" y="468">in-article · in-feed · in-banner</text>
            <text class="sm-v" x="600" y="492">viewability-triggered playback</text>
          </svg>`;
}

const REVENUE = [
  "Intelligent ad pod scheduling",
  "Viewability optimization",
  "Multi-demand-source video header bidding",
  "Lazy loading for performance",
  "Adaptive bitrate for quality across connections",
  "VAST and VMAP ad responses",
];

// What each current video ad standard is for; VPAID is listed because buyers and players are still moving off it
const STANDARDS = [
  { title: "VAST 4.x", body: "The XML response a player reads to play an ad. VAST 4 separated the media file from verification and interactive code and added a mezzanine file for server-side insertion; 4.1 added Open Measurement verification, 4.2 added SIMID interactivity, and 4.3 is the latest 4.x release, with a 2024 CTV addendum." },
  { title: "OMID (Open Measurement)", body: "One measurement API for viewability and invalid-traffic checks. The player integrates the IAB Tech Lab OM SDK once, and verification vendors read its signals instead of running their own scripts. Web players use the OM Web Video SDK." },
  { title: "SIMID (interactivity)", body: "Interactive overlays run in their own layer, separate from the video file, so the publisher's player stays in control of the stream. It works on mobile, in server-side insertion and on OTT devices." },
  { title: "VPAID (replaced)", body: "VPAID ran the ad as executable code inside the player, for measurement and interactivity at once. IAB Tech Lab replaced it with OMID for measurement and SIMID for interactivity. Ask demand partners for VAST with OMID verification instead of VPAID wrappers." },
  { title: "plcmt (OpenRTB 2.6)", body: "Buyers price on the placement label. Instream (plcmt 1) means sound on by default or a clear choice to watch the content. A player between paragraphs that starts when it scrolls into view is Accompanying Content (2); Interstitial is 3; No Content/Standalone is 4. Label each player honestly." },
];

const TECH = [
  { title: "Lightweight & Fast", body: "Minimal page load impact with optimized code that keeps Core Web Vitals in check." },
  { title: "Cross-Browser", body: "Full compatibility across Chrome, Safari, Firefox, Edge, and all major browsers." },
  { title: "AMP Compatible", body: "Full support for Accelerated Mobile Pages to reach the mobile-first audience." },
  { title: "Custom Branding", body: "Fully customizable player skin and branding to match your site's design." },
  { title: "Privacy Compliant", body: "GDPR/CCPA compliant consent integration built directly into the player." },
  { title: "Video Analytics", body: "Detailed video-specific analytics and reporting for every impression and engagement." },
  { title: "A/B Testing", body: "Test different ad configurations to find the optimal setup for your audience." },
  { title: "Anti-Fraud & IVT", body: "Built-in protection against invalid traffic and ad fraud to safeguard your revenue." },
];

export function renderVideoPlayerPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Video Player",
    lede: "HBDR's custom-built, high-performance video player engineered for maximum ad revenue and seamless user experience across all devices.",
    actions: [
      { label: "Get Started", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "See where the ads play", href: "#formats" },
    ],
  })}

  <section class="bp-section" data-testid="video-overview-section">
    <div class="bp-wrap">
      <div class="bp-grid12 sm-overview" data-testid="card-video-overview">
        <div class="col-span-12 lg:col-span-5">${renderEyebrow("Custom-Built Player")}<h2>Built for revenue, designed for users.</h2></div>
        <div class="sm-copy col-span-12 lg:col-start-6 lg:col-span-7">
          <p>HBDR's video player is fully custom-built from the ground up — not a white-labeled third-party solution. Every line of code is optimized for both desktop and mobile, supporting instream and outstream video formats for online video (OLV).</p>
          <p>The player generates massive RPMs and yield for publishers by delivering high-quality video ads on websites and in apps. With intelligent ad scheduling, viewability optimization, and multi-source header bidding built in, our player turns every video impression into maximum revenue.</p>
        </div>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "formats",
    testid: "video-formats-section",
    eyebrow: "Format Support",
    title: "Every video format, one player.",
    lede: "From instream to outstream, our player handles every video ad format with ease.",
    body: `
      <div class="sm-diagram">${renderDiagramFrame({
        label: "How a video ad is requested and where it plays: instream and outstream",
        bar: ["Video ad request flow", "Instream · outstream"],
        body: renderFlowDiagram(),
        caption: "Ad breaks and placements are shown schematically, not to time.",
        blueprint: true,
        testid: "video-flow-diagram",
      })}</div>
      <div class="sm-after">${renderFeatureRows([
        { title: "Instream Video", body: "Pre-roll, mid-roll, and post-roll ads delivered within content video. Maximize engagement with ads that play alongside premium publisher content for the highest completion rates and CPMs. Under OpenRTB 2.6, buyers treat a placement as instream only when the content plays sound-on by default or the viewer chose to watch it.",
          list: ["Pre-roll, mid-roll, post-roll support", "Ad pod scheduling for multi-ad breaks", "Companion banner support"], testid: "card-instream" },
        { title: "Outstream Video", body: "In-article, in-feed, and in-banner video that plays without requiring content video. Unlock video ad revenue on any page, even without native video content. In OpenRTB 2.6 these placements are labelled Accompanying Content, Interstitial or No Content/Standalone, never instream.",
          list: ["In-article and in-feed placements", "No content video required", "Viewability-triggered playback"], testid: "card-outstream" },
        { title: "Floating / Sticky Player", body: "The player follows users as they scroll, maintaining viewability and engagement throughout the entire session. Maximize ad completion rates with a player that stays in view.",
          list: ["Scroll-triggered sticky behavior", "User-dismissible controls", "Configurable position and size"], testid: "card-sticky-player" },
        { title: "Mobile-Optimized", body: "A responsive player that adapts seamlessly to any screen size with touch-optimized controls. Deliver a native-like video experience on every mobile device.",
          list: ["Touch-friendly controls", "Adaptive aspect ratios", "Bandwidth-aware loading"], testid: "card-mobile-optimized" },
      ])}</div>`,
  })}

  <section class="bp-section" data-testid="video-revenue-section">
    <div class="bp-wrap">
      <div class="bp-grid12 sm-overview" data-testid="card-video-revenue">
        <div class="col-span-12 lg:col-span-5">${renderEyebrow("Revenue Engine")}<h2>Maximizing video RPMs.</h2></div>
        <div class="sm-copy col-span-12 lg:col-start-6 lg:col-span-7">
          <p>Every aspect of the HBDR video player is engineered for the highest possible RPMs. From intelligent ad pod scheduling that sequences ads for maximum yield, to viewability optimization that keeps the player in view, our technology ensures no revenue is left on the table.</p>
          <ul class="bp-list sm:grid-cols-2 mt-2">${REVENUE.map((r) => `<li>${r}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
  </section>

  ${renderSection({
    testid: "video-technical-section",
    eyebrow: "Technical Excellence",
    title: "Built to perform, built to scale.",
    lede: "Enterprise-grade video technology that meets the highest standards.",
    body: `
      <ul class="sm-points" style="--cols:4">${TECH.map((f, i) => `
        <li data-testid="video-tech-card-${i}"><h3>${f.title}</h3><p>${f.body}</p></li>`).join("")}
      </ul>`,
  })}

  ${renderSection({
    testid: "video-standards-section",
    eyebrow: "Standards",
    title: "The video ad standards in use today.",
    lede: "What each one does, and what replaced VPAID.",
    body: `${renderFeatureRows(STANDARDS)}
      <p class="mono mt-8 text-[var(--text-muted)]" data-testid="video-source">Sources: IAB Tech Lab, VAST (updated 18 July 2024), SIMID (updated 3 January 2024) and Open Measurement SDK (updated 4 November 2025); OpenRTB 2.6 and AdCOM 1.0, Plcmt Subtypes - Video.</p>`,
  })}

  <section class="bp-section" data-testid="video-spec-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-5 grid gap-4 content-start">${renderEyebrow("Specifications")}<h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">At a glance.</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6">${renderSpecList([
        { label: "Formats", value: "Instream · outstream · floating" },
        { label: "Ad breaks", value: "Pre-roll · mid-roll · post-roll · pods" },
        { label: "Standards", value: "VAST · VMAP" },
        { label: "Devices", value: "Desktop · mobile · AMP" },
        { label: "Browsers", value: "Chrome · Safari · Firefox · Edge" },
        { label: "Consent", value: "GDPR · CCPA" },
      ])}</div>
    </div>
  </section>

  ${renderStatsSection()}

  ${renderCTASection("Ready to monetize with video?", "Get Started")}`;

  return renderLayout({
    title: "Video Player - HBDR",
    description: "HBDR's custom-built video player optimized for maximum ad revenue. Supports instream, outstream, floating player, and mobile-optimized formats.",
    canonicalPath: "/solutions/video-player",
    bodyContent: content,
  });
}
