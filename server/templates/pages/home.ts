import { renderLayout } from "../layout";
import { renderContactFormSection } from "../components/contact-form";
import { renderActions, renderSectionHead, renderSpecList, renderSteps } from "../components/blueprint";
import type { FormConfig } from "../../services/form-config";

// D-005: the strip is titled "Integrated Demand Partners"; names only, no logos
const PARTNERS = [
  "Verve", "AppLovin", "Sovrn", "Xandr", "OpenX", "Index Exchange", "Magnite", "Google AdX", "TripleLift", "ShareThrough", "Equativ",
  "BidSwitch", "InMobi", "Amazon Publisher Services", "Taboola", "Dianomi", "Criteo", "PubMatic", "MGID", "Digital Turbine", "Liftoff", "Bidmachine",
  "Affinity Global", "Pubpower", "AdMile", "Mobilefuse", "Bigo Ads", "Nexxen", "Freewheel", "Beachfront", "Playbuzz", "Amagi", "MediaFuse",
  "Mintegral", "Improve Digital", "Algorix", "Edge226", "SportX", "Unity Technology", "Perion", "Optima", "Seedtag", "Sun Media", "TaurusX",
  "SilverMob", "CPMStar", "LoopMe", "TopOn", "Actirise", "Gadsme", "Nimbus Ads", "Pixalate", "Media.net", "AdYouLike", "33Across",
  "Gannett", "Teads.tv", "ConnectAd", "Vistar Media", "GumGum", "Nativo Edge", "E-Planning", "AdMob", "AdColony", "Adform", "Kevel", "Underdog Media",
];

// Copy from the solution pages; w/h are the format's real size, s scales it into the 760×460 stage
const FORMATS = {
  display: { w: 300, h: 250, s: 1, play: 0, name: "medium rectangle · IAB", title: "Display advertising", href: "/solutions/display-ads",
    body: "Website display monetization with smart layouts that maximize revenue while preserving user experience.",
    list: ["Smart layouts", "Viewability optimization", "Brand safety"], sizes: "300×250 · 728×90 · 160×600 · 320×50", via: "Prebid header bidding" },
  video: { w: 640, h: 360, s: 0.66, play: 1, name: "instream player · VAST", title: "Video ad solutions", href: "/solutions/video-player",
    body: "Instream, outstream and interactive video formats in HBDR’s own player, built for engagement and viewability.",
    list: ["VAST / VPAID", "High viewability", "Engagement metrics"], sizes: "640×360 · 16:9 instream and outstream", via: "Custom video player" },
  ctv: { w: 1920, h: 1080, s: 0.24, play: 1, name: "connected TV · 16:9", title: "CTV and OTT monetization", href: "/solutions/ctv-ott",
    body: "Connected-TV advertising that captures the growing streaming audience with premium video inventory.",
    list: ["SSAI support", "Premium buyers", "Cross-platform"], sizes: "1920×1080 · 15s and 30s spots", via: "Server-side ad insertion" },
  app: { w: 320, h: 480, s: 0.58, play: 0, name: "interstitial · in-app", title: "In-app monetization", href: "/solutions/in-app-ads",
    body: "Banner, native, video and app-open ads for mobile apps, with Google AdX integration.",
    list: ["Native formats", "Rewarded video", "Open bidding"], sizes: "320×50 · 320×480 · 300×250 · rewarded", via: "In-app SDK and open bidding" },
};
const TABS: [keyof typeof FORMATS, string][] = [["display", "Display"], ["video", "Video"], ["ctv", "CTV &amp; OTT"], ["app", "In-app"]];

// Example timeline (labelled as such): request at 40 ms, responses at fixed times, one bidder misses the 1000 ms timeout
const LANES: [string, number, number | null, boolean?][] = [
  ["Bidder 1", 310, 2.41], ["Bidder 2", 520, 4.86, true], ["Bidder 3", 190, 3.37], ["Bidder 4", 760, 1.92], ["Bidder 5", 1150, null], ["Bidder 6", 430, 3.05],
];
const tx = (ms: number) => 140 + ms * 0.68;

const COMPARE: [string, boolean | "partial", boolean | "partial", boolean | "partial"][] = [
  ["Header Bidding Implementation", true, true, false],
  ["Managed Prebid Server", true, false, false],
  ["In-App SDK (Desktop & Mobile)", true, "partial", false],
  ["Real-Time Analytics Dashboard", true, true, true],
  ["Dynamic Floor Pricing", true, false, false],
  ["Custom Video Player", true, "partial", false],
  ["CTV & OTT Support", true, false, false],
  ["24/7 Technical Support", true, true, "partial"],
  ["Dedicated Account Manager", true, false, false],
  ["Revenue Guarantee", true, false, false],
];
const CHECK = '<svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Included"><path d="M5 13l4 4L19 7" stroke-dasharray="22"/></svg>';
function compareCell(v: boolean | "partial", us = false): string {
  if (v === true) return `<td${us ? ' class="us"' : ""}>${CHECK}</td>`;
  if (v === "partial") return '<td class="part">Partial</td>';
  return '<td class="no"><span aria-label="Not included">—</span></td>';
}

function renderTimelineRows(): string {
  return LANES.map(([name, at, cpm, win], i) => {
    const y = 50 + i * 46, end = cpm === null ? 1000 : at;
    const mark = cpm === null
      ? `<text class="tl-label" x="${tx(1000) - 8}" y="${y - 8}" text-anchor="end">no bid in time</text>`
      : `<circle class="${win ? "tl-win-dot" : "tl-dot"}" cx="${tx(at)}" cy="${y}" r="5"/><text class="tl-label${win ? " tl-win-label" : ""}" x="${tx(at) + 10}" y="${y + 4}">$${cpm.toFixed(2)}${win ? " wins" : ""}</text>`;
    return `<text class="tl-row" x="0" y="${y + 5}">${name}</text><path class="tl-wait" d="M${tx(40)} ${y} H${tx(end)}"/><path class="tl-req${win ? " tl-win" : ""}" data-lane d="M${tx(40)} ${y} H${tx(end)}"/>${mark}`;
  }).join("");
}

export function renderPage(form: FormConfig): string {
  const d = FORMATS.display;
  const homepageContent = `
  <main id="top">
  <section class="bp-home-hero" data-testid="hero-section">
    <div class="bp-wrap bp-grid12">
      <div class="hero-copy">
        <h1>Every ad slot, sold to the highest bidder.</h1>
        <p class="lede">HBDR runs header bidding for websites, apps and CTV. Your inventory goes to every demand partner at once and the best price wins, which helps publishers increase revenue by up to 50%.</p>
        <div class="flex flex-wrap gap-3">${renderActions([
          { label: "Get Started Free", href: "/contact", primary: true, testid: "button-hero-get-started" },
          { label: "See how an impression is sold", href: "#how", testid: "button-hero-learn" },
        ])}</div>
        <div class="hero-facts">
          <div data-testid="text-stat-revenue"><b>50%+</b><span>revenue increase</span></div>
          <div data-testid="text-stat-publishers"><b>500+</b><span>publishers</span></div>
          <div data-testid="text-stat-impressions"><b>1B+</b><span>impressions a month</span></div>
        </div>
      </div>

      <figure class="sheet bp-blueprint" aria-label="Example: a publisher page whose ad slots are sold one auction at a time" data-testid="hero-dashboard">
        <div class="bp-frame-bar mono"><span>yourdomain.com/article</span><span>Inventory spec · example auction</span></div>
        <div class="sheet-plate">
        <svg class="block w-full h-auto" viewBox="0 0 1180 760" role="img" aria-label="Page layout with a 728×90 leaderboard, two 300×250 rectangles, a native slot and a 320×50 mobile banner">
          <rect class="bp-copy" x="40" y="190" width="520" height="26" rx="3"/>
          <rect class="bp-copy" x="40" y="228" width="420" height="26" rx="3"/>
          <rect class="bp-copy" x="40" y="280" width="600" height="190" rx="4"/>
          <rect class="bp-copy" x="40" y="490" width="600" height="10" rx="2"/>
          <rect class="bp-copy" x="40" y="512" width="570" height="10" rx="2"/>
          <rect class="bp-copy" x="40" y="534" width="590" height="10" rx="2"/>
          <rect class="bp-copy" x="40" y="556" width="380" height="10" rx="2"/>
          <g class="slot" data-name="728×90 leaderboard" data-place="top of page">
            <rect class="slot-frame" x="136" y="60" width="728" height="90" rx="3"/>
            <rect class="slot-fill" x="136" y="60" width="728" height="90" rx="3"/>
            <text class="slot-name" x="500" y="110" text-anchor="middle">728×90 · leaderboard</text>
            <text class="slot-price" x="500" y="112" text-anchor="middle"></text>
          </g>
          <g class="slot" data-name="300×250 right rail" data-place="above the fold">
            <rect class="slot-frame" x="680" y="190" width="300" height="250" rx="3"/>
            <rect class="slot-fill" x="680" y="190" width="300" height="250" rx="3" style="opacity:1"/>
            <text class="slot-name" x="830" y="320" text-anchor="middle" style="opacity:0">300×250</text>
            <text class="slot-price" x="830" y="322" text-anchor="middle" style="opacity:1">SOLD $4.86</text>
          </g>
          <g class="slot" data-name="300×250 lower rail" data-place="below the fold">
            <rect class="slot-frame" x="680" y="470" width="300" height="250" rx="3"/>
            <rect class="slot-fill" x="680" y="470" width="300" height="250" rx="3"/>
            <text class="slot-name" x="830" y="600" text-anchor="middle">300×250</text>
            <text class="slot-price" x="830" y="602" text-anchor="middle"></text>
          </g>
          <g class="slot" data-name="Native in-article" data-place="in content">
            <rect class="slot-frame" x="40" y="590" width="600" height="130" rx="3"/>
            <rect class="slot-fill" x="40" y="590" width="600" height="130" rx="3"/>
            <text class="slot-name" x="340" y="660" text-anchor="middle">native · fluid</text>
            <text class="slot-price" x="340" y="662" text-anchor="middle"></text>
          </g>
          <rect x="1018" y="300" width="146" height="300" rx="18" fill="var(--surface-elevated)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
          <rect class="bp-copy" x="1032" y="330" width="118" height="70" rx="3"/>
          <rect class="bp-copy" x="1032" y="410" width="110" height="8" rx="2"/>
          <rect class="bp-copy" x="1032" y="426" width="96" height="8" rx="2"/>
          <rect class="bp-copy" x="1032" y="442" width="104" height="8" rx="2"/>
          <g class="slot" data-name="320×50 mobile anchor" data-place="sticky, mobile">
            <rect class="slot-frame" x="1027" y="556" width="128" height="20" rx="2"/>
            <rect class="slot-fill" x="1027" y="556" width="128" height="20" rx="2"/>
            <text class="slot-name" x="1091" y="571" text-anchor="middle" style="font-size:11px">320×50</text>
            <text class="slot-price" x="1091" y="571" text-anchor="middle" style="font-size:12px"></text>
          </g>
          <g class="dims">
            <path class="bp-line" d="M136 38 H864"/><path class="bp-tick" d="M136 30 V46 M864 30 V46"/>
            <text class="bp-label" x="500" y="28" text-anchor="middle">728</text>
            <path class="bp-line" d="M876 60 V150"/><path class="bp-tick" d="M868 60 H884 M868 150 H884"/>
            <text class="bp-label" x="892" y="110">90</text>
            <path class="bp-line" d="M680 172 H980"/><path class="bp-tick" d="M680 164 V180 M980 164 V180"/>
            <text class="bp-label" x="830" y="163" text-anchor="middle">300</text>
            <path class="bp-line" d="M996 190 V440"/><path class="bp-tick" d="M988 190 H1004 M988 440 H1004"/>
            <text class="bp-label" x="1010" y="320" transform="rotate(90 1010 320)" text-anchor="middle">250</text>
            <path class="bp-line" d="M1027 600 H1155"/><path class="bp-tick" d="M1027 593 V607 M1155 593 V607"/>
            <text class="bp-label" x="1091" y="626" text-anchor="middle" style="font-size:12px">320 × 50</text>
          </g>
        </svg>
        <div class="ladder">
          <div class="ladder-head"><strong data-slot-name>300×250 right rail</strong><span class="mono text-[var(--text-muted)]" data-slot-place>above the fold</span></div>
          <div class="auction-timer" aria-hidden="true"><span></span></div>
          <ul class="auction is-closed grid gap-[0.45rem]" aria-label="Example header bidding auction">
            <li class="auction-row"><span>Bidder 1</span><span class="auction-track"><span class="auction-fill" style="--w:.40"></span></span><span class="auction-cpm mono">$2.41</span></li>
            <li class="auction-row is-winner"><span>Bidder 2</span><span class="auction-track"><span class="auction-fill" style="--w:.81"></span></span><span class="auction-cpm mono">$4.86</span></li>
            <li class="auction-row"><span>Bidder 3</span><span class="auction-track"><span class="auction-fill" style="--w:.56"></span></span><span class="auction-cpm mono">$3.37</span></li>
            <li class="auction-row"><span>Bidder 4</span><span class="auction-track"><span class="auction-fill" style="--w:.32"></span></span><span class="auction-cpm mono">$1.92</span></li>
            <li class="auction-row"><span>Bidder 5</span><span class="auction-track"><span class="auction-fill" style="--w:.51"></span></span><span class="auction-cpm mono">$3.05</span></li>
          </ul>
        </div>
        </div>
        <div class="sheet-tally mono"><span><span data-filled>1</span> of 5 slots sold · page eCPM <span class="text-[var(--accent)]" data-ecpm>$4.86</span></span><span class="text-[var(--text-muted)]">Simulated bids, example data</span></div>
      </figure>
    </div>
  </section>

  <section class="bp-section" id="partners" data-testid="logo-carousel">
    <div class="bp-wrap">${renderSectionHead({
      eyebrow: "Integrated Demand Partners",
      title: "Every partner bids in the same auction.",
      lede: "Each one sees your inventory at the same moment, so no single network sets your price.",
    })}
      <ul class="partner-grid">${PARTNERS.map((p) => `<li>${p}</li>`).join("")}</ul>
    </div>
  </section>

  <section class="bp-section" id="solutions" data-testid="services-section">
    <div class="bp-wrap">${renderSectionHead({
      eyebrow: "Formats",
      title: "One stack for every screen your audience uses.",
      lede: "Display, video, connected TV and in-app inventory run through the same auction, the same reporting and the same account team.",
    })}
      <div class="bp-grid12">
        <div class="format-stage bp-frame">
          <div class="format-tabs" role="tablist" aria-label="Ad formats">${TABS.map(([k, label], i) => `
            <button type="button" class="format-tab" role="tab" id="tab-${k}" aria-selected="${i === 0}" aria-controls="format-panel" tabindex="${i === 0 ? 0 : -1}" data-format="${k}" data-testid="tab-format-${k}">${label}</button>`).join("")}
          </div>
          <svg viewBox="0 0 760 460" role="img" aria-label="The selected ad format drawn at its real proportions">
            <rect class="f-frame" x="230" y="70" width="300" height="250" rx="4" fill="rgba(0,250,168,0.10)" stroke="var(--accent)" stroke-width="1.5"/>
            <path class="f-play" d="M372 175 L372 215 L404 195 Z" fill="var(--accent)" opacity="0"/>
            <path class="f-dim-w bp-line" d="M230 350 H530"/>
            <path class="f-dim-w-t bp-tick" d="M230 342 V358 M530 342 V358"/>
            <path class="f-dim-h bp-line" d="M560 70 V320"/>
            <path class="f-dim-h-t bp-tick" d="M552 70 H568 M552 320 H568"/>
            <text class="f-w bp-label" x="380" y="380" text-anchor="middle">300</text>
            <text class="f-h bp-label" x="578" y="200">250</text>
            <text class="f-name bp-label" x="380" y="430" text-anchor="middle" style="fill:var(--text-muted)">medium rectangle · IAB</text>
          </svg>
        </div>
        <div class="format-copy" id="format-panel" role="tabpanel" aria-labelledby="tab-display" aria-live="polite">
          <h3 data-f="title">${d.title}</h3>
          <p class="text-[var(--text-muted)]" data-f="body">${d.body}</p>
          <ul class="bp-list" data-f="list">${d.list.map((l) => `<li>${l}</li>`).join("")}</ul>
          <div class="format-spec mono"><span class="text-[var(--text-muted)]">Sizes</span><span data-f="sizes">${d.sizes}</span><span class="text-[var(--text-muted)]">Sold by</span><span data-f="via">${d.via}</span></div>
          <a href="${d.href}" class="text-sm text-[var(--text-secondary)] hover:text-white inline-flex items-center gap-1.5" data-f="href" data-testid="link-format-learn-more">Learn more <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
  </section>

  <section class="bp-section" id="how" data-testid="auction-timeline-section">
    <div class="bp-wrap">${renderSectionHead({
      eyebrow: "Header bidding",
      title: "How one impression is sold.",
      lede: "Header bidding asks every partner at once while the page loads. Bids that miss the timeout are dropped, so a slow bidder never holds the page.",
    })}
      <div class="bp-grid12">
        <figure class="timeline-frame bp-frame" style="margin:0">
          <div class="bp-frame-body">
          <svg viewBox="0 0 860 400" role="img" aria-label="Example timeline: bid requests go out at 40 milliseconds, bids return between 190 and 760 milliseconds, one bidder times out, the highest bid wins and the ad renders">
            <path class="tl-axis" d="M140 360 H820"/>
            <g class="tl-label">
              <text x="140" y="388" text-anchor="middle">0 ms</text><text x="310" y="388" text-anchor="middle">250</text>
              <text x="480" y="388" text-anchor="middle">500</text><text x="650" y="388" text-anchor="middle">750</text>
              <text x="820" y="388" text-anchor="middle">1000</text>
            </g>
            <path class="tl-timeout" d="M820 30 V360"/>
            <text class="tl-label" x="812" y="24" text-anchor="end">timeout</text>
            <g class="tl-rows">${renderTimelineRows()}</g>
          </svg>
          </div>
          <figcaption class="mono">Example data: response times and bids are illustrative.</figcaption>
        </figure>
        <div class="timeline-points">
          <div><h3>Everyone bids at once</h3><p>The page sends one request to every partner in parallel instead of offering the slot to networks one after another.</p></div>
          <div><h3>The highest price wins</h3><p>Bids go to your ad server together, so the best offer for that impression is the one that serves.</p></div>
          <div><h3>Timeouts protect page speed</h3><p>A partner that answers too late is skipped for that impression. Readers never wait on a slow bidder.</p></div>
          <a href="/solutions/header-bidding" class="text-sm text-[var(--text-secondary)] hover:text-white inline-flex items-center gap-1.5">Header bidding in detail <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
  </section>

  <section class="bp-section" id="compare" data-testid="comparison-section">
    <div class="bp-wrap">${renderSectionHead({
      eyebrow: "Why HBDR",
      title: "What you get that a typical network doesn’t.",
      lede: "Compared with the two usual alternatives: a single ad network, or building and running header bidding in-house.",
    })}
      <div class="bp-table-wrap" data-testid="comparison-table">
        <table class="bp-table compare-table">
          <thead><tr><th scope="col">Feature</th><th scope="col" class="us">HBDR</th><th scope="col">Typical Ad Network</th><th scope="col">DIY In-House Setup</th></tr></thead>
          <tbody>${COMPARE.map((r, i) => `
            <tr data-testid="comparison-row-${i}"><td>${r[0].replace("&", "&amp;")}</td>${compareCell(r[1], true)}${compareCell(r[2])}${compareCell(r[3])}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="bp-section" id="how-it-works" data-testid="how-it-works-section">
    <div class="bp-wrap">${renderSectionHead({
      eyebrow: "Process",
      title: "Live in three steps.",
      lede: "Our team does the integration work. You review the proposal and approve the rollout.",
    })}${renderSteps([
      { title: "Discovery call", body: "We analyze your current ad setup, find the revenue you are leaving behind and agree on goals.", list: ["Current ad stack review", "Opportunities ranked", "Revenue goals"], testid: "step-card-0" },
      { title: "Customized proposal", body: "A tailored plan with revenue forecasts, ad placement strategy and an implementation roadmap.", list: ["Revenue projections", "Placement strategy", "Timeline"], testid: "step-card-1" },
      { title: "Technical implementation", body: "We configure accounts, implement the code and monitor performance after launch.", list: ["Code implementation", "Platform configuration", "Performance monitoring"], testid: "step-card-2" },
    ])}
      <div class="mt-12">${renderActions([{ label: "Start Your Journey", href: "/contact", primary: true, testid: "button-start-journey" }])}</div>
    </div>
  </section>

  <section class="bp-section" id="about" data-testid="stats-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-5 grid gap-4 content-start">
        <span class="bp-eyebrow">Company</span>
        <h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">The company behind the auction.</h2>
        <p class="text-[var(--text-muted)]">Founded in 2015 and based in Miami. A team with more than 25 years of combined experience in programmatic advertising.</p>
      </div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6">${renderSpecList([
        { label: "Ads served through HBDR", value: "1T+" },
        { label: "Impressions per month", value: "1B+" },
        { label: "Publishers", value: "500+" },
        { label: "Revenue increase", value: "50%<small>up to</small>" },
        { label: "Founded", value: "2015" },
      ], true)}</div>
    </div>
  </section>

  ${renderContactFormSection(form)}
  </main>

  <script>
  // Formats work with or without GSAP; everything else is GSAP motion over a finished server-rendered page (D-019, D-020 rule 4).
  // Under reduced motion only the hero auction plays, as fades with nothing moving (D-023).
  document.addEventListener('DOMContentLoaded', function () {
    var formats = ${JSON.stringify(FORMATS)};
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = !!window.gsap && !reduce;
    var q = function (s) { return document.querySelector(s); };
    function geom(f) { var w = f.w * f.s, h = f.h * f.s; return { x: 380 - w / 2, y: 195 - h / 2, w: w, h: h }; }
    function place(f, animate) {
      var g = geom(f), b = g.y + g.h, r = g.x + g.w;
      var attrs = [
        ['.f-frame', { x: g.x, y: g.y, width: g.w, height: g.h }],
        ['.f-dim-w', { d: 'M' + g.x + ' ' + (b + 30) + ' H' + r }],
        ['.f-dim-w-t', { d: 'M' + g.x + ' ' + (b + 22) + ' V' + (b + 38) + ' M' + r + ' ' + (b + 22) + ' V' + (b + 38) }],
        ['.f-dim-h', { d: 'M' + (r + 30) + ' ' + g.y + ' V' + b }],
        ['.f-dim-h-t', { d: 'M' + (r + 22) + ' ' + g.y + ' H' + (r + 38) + ' M' + (r + 22) + ' ' + b + ' H' + (r + 38) }],
        ['.f-w', { x: g.x + g.w / 2, y: b + 60 }],
        ['.f-h', { x: r + 48, y: g.y + g.h / 2 + 5 }],
        ['.f-name', { y: Math.min(452, b + 92) }],
        ['.f-play', { opacity: f.play }]
      ];
      attrs.forEach(function (a) {
        if (animate) { gsap.to(a[0], { attr: a[1], duration: 0.7, ease: 'expo.out' }); return; }
        var el = q(a[0]); Object.keys(a[1]).forEach(function (k) { el.setAttribute(k, a[1][k]); });
      });
    }
    function show(tab, focus) {
      var tabs = [].slice.call(document.querySelectorAll('.format-tab'));
      tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
      if (focus) tab.focus();
      var f = formats[tab.dataset.format];
      q('#format-panel').setAttribute('aria-labelledby', tab.id);
      q('[data-f="title"]').textContent = f.title;
      q('[data-f="body"]').textContent = f.body;
      q('[data-f="list"]').innerHTML = f.list.map(function (t) { return '<li>' + t + '</li>'; }).join('');
      q('[data-f="sizes"]').textContent = f.sizes;
      q('[data-f="via"]').textContent = f.via;
      q('[data-f="href"]').setAttribute('href', f.href);
      q('.f-w').textContent = f.w; q('.f-h').textContent = f.h; q('.f-name').textContent = f.name;
      place(f, hasGsap);
    }
    document.querySelectorAll('.format-tab').forEach(function (tab, i, all) {
      tab.addEventListener('click', function () { show(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (n) { e.preventDefault(); show(all[(i + n + all.length) % all.length], true); }
      });
    });

    if (!window.gsap) return; // the server-rendered page is complete on its own
    gsap.registerPlugin(ScrollTrigger);

    // Hero: dimension lines draw once, then the slots are sold one auction at a time
    if (!reduce) document.querySelectorAll('.dims .bp-line').forEach(function (p) {
      var len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: 'expo.out', delay: 0.15 });
    });
    var slots = [].slice.call(document.querySelectorAll('.slot')), order = [1, 0, 3, 2, 4];
    var ladderName = q('[data-slot-name]'), ladderPlace = q('[data-slot-place]');
    var bids = q('.auction'), items = [].slice.call(bids.children);
    var filledEl = q('[data-filled]'), ecpmEl = q('[data-ecpm]');
    var cycle, inView = false;
    function money(v) { return '$' + v.toFixed(2); }
    function buildCycle() {
      var tl = gsap.timeline({ paused: !inView || document.hidden, onComplete: function () { cycle = buildCycle(); } }), won = [];
      tl.set('.slot-fill, .slot-price', { opacity: 0 }).set('.slot-name', { opacity: 1 }).call(function () { filledEl.textContent = '0'; ecpmEl.textContent = '—'; });
      order.forEach(function (si) {
        var slot = slots[si], frame = slot.querySelector('.slot-frame'), fill = slot.querySelector('.slot-fill'), price = slot.querySelector('.slot-price'), label = slot.querySelector('.slot-name');
        var vals = items.map(function () { return Math.round((0.6 + Math.random() * 5.2) * 100) / 100; });
        var best = vals.indexOf(Math.max.apply(null, vals)), start = tl.duration();
        tl.call(function () {
          ladderName.textContent = slot.dataset.name; ladderPlace.textContent = slot.dataset.place;
          bids.classList.remove('is-closed');
          items.forEach(function (li) { li.classList.remove('is-winner'); li.querySelector('.auction-cpm').textContent = '—'; });
          frame.classList.add('is-live');
        }, null, start);
        if (!reduce) tl.fromTo('.auction-timer span', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'none' }, start);
        items.forEach(function (li, i) {
          var at = start + 0.1 + Math.random() * 0.85, bar = li.querySelector('.auction-fill');
          if (reduce) {
            // each bid fades in at its final length; nothing slides
            tl.set(bar, { scaleX: vals[i] / 6, opacity: 0 }, start);
            tl.to(bar, { opacity: 1, duration: 0.25 }, at);
          } else {
            tl.set(bar, { scaleX: 0 }, start);
            tl.to(bar, { scaleX: vals[i] / 6, duration: 0.45, ease: 'expo.out' }, at);
          }
          tl.call(function () { li.querySelector('.auction-cpm').textContent = money(vals[i]); }, null, at);
        });
        tl.call(function () {
          items[best].classList.add('is-winner'); bids.classList.add('is-closed'); frame.classList.remove('is-live');
          price.textContent = 'SOLD ' + money(vals[best]); won.push(vals[best]);
          filledEl.textContent = String(won.length);
          ecpmEl.textContent = money(won.reduce(function (a, b) { return a + b; }, 0) / won.length);
        }, null, start + 1.3);
        tl.to(fill, { opacity: 1, duration: 0.5, ease: 'expo.out' }, start + 1.3);
        tl.to(label, { opacity: 0, duration: 0.2 }, start + 1.3);
        tl.to(price, { opacity: 1, duration: 0.4 }, start + 1.4);
        tl.to({}, { duration: 0.9 }, start + 1.4);
      });
      tl.to({}, { duration: 1.8 });
      tl.to('.slot-fill, .slot-price', { opacity: 0, duration: 0.5 });
      tl.to('.slot-name', { opacity: 1, duration: 0.4 }, '<');
      return tl;
    }
    // Runs only while the sheet is on screen and the tab is visible
    function sync() { if (!cycle) return; (inView && !document.hidden) ? cycle.resume() : cycle.pause(); }
    ScrollTrigger.create({ trigger: '.sheet', start: 'top bottom', end: 'bottom top', onToggle: function (self) { inView = self.isActive; if (!cycle && inView) cycle = buildCycle(); sync(); } });
    document.addEventListener('visibilitychange', sync);
    if (reduce) return; // every other section stays in its finished state

    // Partners: dots light in a random order once, like bids arriving; names are always visible
    ScrollTrigger.create({ trigger: '.partner-grid', start: 'top 80%', once: true, onEnter: function () {
      gsap.utils.shuffle([].slice.call(document.querySelectorAll('.partner-grid li'))).forEach(function (li, i) { gsap.delayedCall(0.05 + i * 0.03, function () { li.classList.add('lit'); }); });
    } });

    // Timeline: request lines travel out to each response time, dots land with them
    // Lines stay drawn until the replay starts, so a page that is never scrolled still shows the whole timeline
    ScrollTrigger.create({ trigger: '.timeline-frame', start: 'top 75%', once: true, onEnter: function () {
      var tlAnim = gsap.timeline();
      document.querySelectorAll('[data-lane]').forEach(function (p, i) {
        var len = p.getTotalLength();
        tlAnim.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: len / 520, ease: 'power2.out' }, 0.1 + i * 0.04);
      });
      tlAnim.from('.tl-rows circle', { scale: 0, transformOrigin: 'center', duration: 0.35, ease: 'back.out(2)', stagger: 0.08 }, 0.6);
    } });

    // Comparison: checks in the HBDR column draw top to bottom
    ScrollTrigger.create({ trigger: '.compare-table', start: 'top 75%', once: true, onEnter: function () {
      gsap.fromTo('td.us .check path', { strokeDashoffset: 22 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 });
    } });

    // Steps: the hairline fills left to right as the section scrolls in (no pinning)
    gsap.fromTo('.bp-step-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.bp-steps', start: 'top 85%', end: 'top 35%', scrub: 0.6 } });
  });
  </script>`;

  return renderLayout({
    title: "HBDR - Header Bidding & Ad Monetization Solutions",
    description: "HBDR delivers enterprise-grade ad monetization and header bidding solutions. Maximize your ad revenue with our cutting-edge platform.",
    ogTitle: "HBDR - Header Bidding & Ad Monetization Solutions",
    ogDescription: "Maximize your ad revenue with HBDR's enterprise-grade header bidding platform.",
    canonicalPath: "/",
    bodyContent: homepageContent,
    gsap: true,
  });
}
