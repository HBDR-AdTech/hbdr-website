import { renderLayout } from "../../layout";
import { renderBlueprintHero, renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection, renderSpecList } from "../../components/blueprint";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";

// SSAI: content segments and the ad pod are stitched into one stream server-side; slots 3 and 4 are the ad break
const SLOT_X = (i: number) => 200 + i * 108;
const SLOTS = [0, 1, 2, 3, 4, 5, 6, 7];
const isAd = (i: number) => i === 3 || i === 4;

function renderSsaiDiagram(): string {
  let c = 0, a = 0;
  const label = SLOTS.map((i) => (isAd(i) ? `ad ${++a}` : `c${++c}`));
  const lane = (y: number, name: string, sub: string, sub2 = "") =>
    `<text class="sm-name" x="0" y="${y + 18}">${name}</text><text class="sm-v${sub2}" x="0" y="${y + 40}">${sub}</text>`;
  const seg = (i: number, y: number) => `<rect class="${isAd(i) ? "sm-ad" : "sm-seg"}" x="${SLOT_X(i)}" y="${y}" width="100" height="40" rx="2"/><text class="sm-v${isAd(i) ? " is-win" : ""}" x="${SLOT_X(i) + 50}" y="${y + 25}" text-anchor="middle">${label[i]}</text>`;
  const content = SLOTS.filter((i) => !isAd(i));
  const ads = SLOTS.filter(isAd);
  return `<svg viewBox="0 0 1100 420" role="img" aria-label="Server-side ad insertion: the content stream has an ad break after its third segment, the auction fills the break with a two-ad pod, and both are stitched into one continuous HLS, DASH or CMAF stream.">
            ${lane(50, "Content", "your stream")}
            ${content.map((i) => seg(i, 50)).join("")}
            <rect class="sm-node is-off" x="${SLOT_X(3)}" y="50" width="208" height="40" rx="2" style="fill:none"/>
            <text class="sm-k" x="${SLOT_X(3) + 104}" y="75" text-anchor="middle">ad break</text>
            ${lane(170, "Ad pod", "from the auction", " is-win")}
            ${ads.map((i) => seg(i, 170)).join("")}
            ${content.map((i) => `<path class="sm-wire is-off" d="M${SLOT_X(i) + 50} 90 V300"/>`).join("")}
            ${ads.map((i) => `<path class="sm-wire is-win" d="M${SLOT_X(i) + 50} 210 V300"/>`).join("")}
            ${lane(300, "Stitched stream", "HLS · DASH · CMAF")}
            ${SLOTS.map((i) => seg(i, 300)).join("")}
            <path class="sm-rule" d="M200 372 H1056"/>
            <text class="sm-v" x="200" y="400">One continuous stream to the screen: no buffering between content and ads</text>
          </svg>`;
}

const FEATURES = [
  { title: "Audience Targeting", body: "Leverage first-party data, ACR signals, and contextual metadata to deliver highly targeted ads across CTV environments." },
  { title: "Unified Reporting", body: "Cross-platform analytics that unify CTV, OTT, and web video performance into a single dashboard with real-time metrics." },
  { title: "Premium Demand", body: "Direct connections to top-tier video DSPs including The Trade Desk, DV360, Amazon, and brand-direct programmatic guaranteed deals." },
];

export function renderCtvOttPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "CTV & OTT Advertising",
    lede: "Sell connected TV and streaming inventory programmatically. Deliver premium video ads across connected TV and streaming platforms with server-side ad insertion (SSAI).",
    actions: [
      { label: "Launch CTV Ads", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "How SSAI works", href: "#ssai" },
    ],
  })}

  <section class="bp-section" data-testid="ctv-overview-section">
    <div class="bp-wrap">
      <div class="bp-grid12 sm-overview" data-testid="card-ctv-overview">
        <div class="col-span-12 lg:col-span-5">${renderEyebrow("Premium Video")}<h2>How CTV ads are sold.</h2></div>
        <div class="sm-copy col-span-12 lg:col-start-6 lg:col-span-7">
          <p>HBDR's CTV solution connects your streaming inventory to premium video demand from leading DSPs, agencies, and brand-direct buyers. On a TV there is no cookie: buyers bid on the device's advertising ID and its type, the limit-ad-tracking flag, the app bundle they check against your app-ads.txt, and the content being watched. Get those signals right before you tune floors.</p>
          <p>Our server-side ad insertion (SSAI) technology ensures seamless, broadcast-quality ad experiences that match the production value of the surrounding content, delivered to lean-back audiences on the biggest screen in the house. The trade-off is measurement: with SSAI the stitching server, not the TV, calls the ad server, so it must pass the viewer's IP address and user agent, or buyers may count the impressions as invalid traffic.</p>
        </div>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "ssai",
    testid: "ctv-capabilities-section",
    eyebrow: "Capabilities",
    title: "End-to-end CTV monetization.",
    lede: "From ad pod management to audience targeting, everything you need to monetize streaming content.",
    body: `
      <div class="sm-diagram">${renderDiagramFrame({
        label: "Server-side ad insertion: content and an ad pod stitched into one stream",
        bar: ["Server-side ad insertion", "Stitched at the manifest level"],
        body: renderSsaiDiagram(),
        caption: "Schematic: segment counts and lengths are illustrative.",
        blueprint: true,
        testid: "ctv-ssai-diagram",
      })}</div>
      <div class="sm-after">${renderFeatureRows([
        { title: "Server-Side Ad Insertion (SSAI)", body: "The stitching server requests the ads, conditions them to match the stream and writes them into the HLS or DASH manifest, so the device plays one continuous stream with no hand-off between content and ad. Tracking is the hard part. Either the device fires the VAST tracking events (client-side beaconing) or the server fires them on its behalf (server-side beaconing); VAST 4.1 requires a stitcher to send X-Device-IP and X-Device-User-Agent with those calls.",
          list: ["Broadcast-quality ad transitions", "Ad-block resistant delivery", "HLS, DASH, and CMAF support"], testid: "card-ssai" },
        { title: "Client-Side Ad Insertion (CSAI)", body: "The player pauses the content, requests VAST itself, plays the ad file and resumes. Measurement is simpler, because the device fires its own tracking and can run OM SDK verification, but every break is a hand-off that can stall on a slow connection, and the ad call is visible to ad blockers. CSAI suits apps with a capable player SDK; SSAI suits live streams and devices where switching streams is unreliable." },
        { title: "Ad Pod Management", body: "Intelligent ad pod construction with competitive separation, frequency capping, and optimal pod length configuration. Our system dynamically adjusts pre-roll, mid-roll, and post-roll positions based on content duration, viewer engagement, and revenue optimization models. In OpenRTB 2.6 each slot in a pod is its own impression sharing a podid; slotinpod marks the first or last slot, poddur and maxseq bound a dynamic pod, and rqddurs lists exact durations so a live break has no dead air.",
          list: ["Dynamic pod length optimization", "Competitive separation rules", "Viewer-centric frequency capping"], testid: "card-ad-pods" },
      ])}</div>`,
  })}

  ${renderSection({
    testid: "ctv-features-section",
    eyebrow: "Platform Features",
    title: "Built for streaming scale.",
    lede: "Targeting, reporting and demand for streaming inventory.",
    body: `
      <ul class="sm-points">${FEATURES.map((f, i) => `
        <li data-testid="ctv-feature-card-${i}"><h3>${f.title}</h3><p>${f.body}</p></li>`).join("")}
      </ul>`,
  })}

  ${renderSection({
    testid: "ctv-checklist-section",
    eyebrow: "Seller checklist",
    title: "What CTV buyers check before they bid.",
    lede: "Four things to get right in every bid request and every stream.",
    body: `${renderFeatureRows([
      { title: "app-ads.txt for every app", body: "Buyers match the app bundle in the bid request to the app's store listing, then read app-ads.txt on the developer website listed there. IAB Tech Lab's app-ads.txt covers mobile and CTV app stores. List every seller you authorize, and keep it current when partners change." },
      { title: "The device ID and its type", body: "Send the advertising ID in device.ifa with its source in ifa_type: dpid for a device ID such as Roku's rida or Android's aaid, ppid for a publisher ID, sspid, or sessionid for a short-lived ID. Set lmt to 1 when the viewer has limited ad tracking, and pass it on unchanged." },
      { title: "Pods and content described", body: "Describe each break with the OpenRTB 2.6 pod fields, and describe the content: genre, and livestream (1 for a scheduled, linear broadcast; 0 for on-demand). Buyers use these to choose what to bid on and how much." },
      { title: "Measurement on the device", body: "The IAB Tech Lab OM SDK covers Android TV and tvOS in native builds, and Samsung and LG TVs through its web video SDK. Where the app supports it, client-side measurement through OM SDK gives verification vendors the signals they need." },
    ])}
      <p class="mono mt-8 text-[var(--text-muted)]" data-testid="ctv-source">Sources: IAB Tech Lab, VAST 4.1 (section on ad stitching headers), VAST 4.x page (updated 18 July 2024), OpenRTB 2.6, ifa_type community extension, ads.txt and app-ads.txt (updated 14 September 2026), Open Measurement SDK (updated 4 November 2025).</p>`,
  })}

  <section class="bp-section" data-testid="ctv-spec-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-5 grid gap-4 content-start">${renderEyebrow("Specifications")}<h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">At a glance.</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6">${renderSpecList([
        { label: "Ad insertion", value: "Server-side (SSAI), manifest level" },
        { label: "Streaming protocols", value: "HLS · DASH · CMAF" },
        { label: "Ad positions", value: "Pre-roll · mid-roll · post-roll" },
        { label: "Pod controls", value: "Separation · frequency caps · pod length" },
        { label: "Video demand", value: "The Trade Desk · DV360 · Amazon" },
      ])}</div>
    </div>
  </section>

  ${renderStatsSection()}

  ${renderCTASection("Ready to monetize your streaming content?", "Launch CTV Ads")}`;

  return renderLayout({
    title: "CTV & OTT Advertising - HBDR",
    description: "Monetize connected TV and streaming content with SSAI, premium video demand, and ad pod management. Reach engaged audiences on the biggest screen.",
    canonicalPath: "/solutions/ctv-ott",
    bodyContent: content,
  });
}
