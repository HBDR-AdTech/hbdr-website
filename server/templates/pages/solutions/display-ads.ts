import { renderLayout } from "../../layout";
import { renderBlueprintHero, renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection, renderSpecList } from "../../components/blueprint";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";

// Every unit drawn at the same scale (0.6 px per ad pixel), so the shapes compare at their real proportions
const S = 0.6;
const UNITS: { w: number; h: number; x: number; y: number; name: string; inline?: boolean; beside?: boolean }[] = [
  { w: 728, h: 90, x: 40, y: 60, name: "leaderboard", inline: true },
  { w: 300, h: 250, x: 40, y: 170, name: "medium rectangle" },
  { w: 336, h: 280, x: 256, y: 170, name: "large rectangle" },
  { w: 320, h: 50, x: 40, y: 380, name: "mobile adhesion", beside: true },
  { w: 160, h: 600, x: 520, y: 60, name: "skyscraper" },
  { w: 300, h: 600, x: 660, y: 60, name: "half page" },
];
// One responsive slot asks for three sizes; the example winner is drawn filled
const MULTI: [number, number][] = [[300, 600], [336, 280], [300, 250]];

function renderSizeDiagram(): string {
  const units = UNITS.map((u) => {
    const w = u.w * S, h = u.h * S, cx = u.x + w / 2, size = `${u.w}×${u.h}`;
    const label = u.beside
      ? `<text class="sm-v" x="${u.x + w + 16}" y="${u.y + h / 2 + 5}">${size} · ${u.name}</text>`
      : u.inline
        ? `<text class="sm-v" x="${cx}" y="${u.y + h / 2 + 5}" text-anchor="middle">${size} · ${u.name}</text>`
        : `<text class="sm-v" x="${cx}" y="${u.y + h / 2 - 4}" text-anchor="middle">${size}</text><text class="sm-name" x="${cx}" y="${u.y + h / 2 + 18}" text-anchor="middle">${u.name}</text>`;
    return `<rect class="sm-unit" x="${u.x}" y="${u.y}" width="${w}" height="${h}" rx="2"/>${label}`;
  }).join("");
  const mx = 900, my = 60;
  const asks = MULTI.map(([w, h]) => `<rect class="sm-unit is-ask" x="${mx}" y="${my}" width="${w * S}" height="${h * S}" rx="2"/>`).join("");
  return `<svg viewBox="0 0 1180 486" role="img" aria-label="IAB display units drawn at the same scale: 728×90 leaderboard, 300×250 medium rectangle, 336×280 large rectangle, 320×50 mobile adhesion, 160×600 skyscraper and 300×600 half page. Example: one responsive slot requests 300×250, 336×280 and 300×600, and the 300×600 creative serves.">
            <text class="sm-k" x="40" y="30">IAB standard units</text>
            ${units}
            <path class="sm-rule" d="M870 20 V476"/>
            <text class="sm-k is-win" x="${mx}" y="30">Responsive multi-size slot</text>
            <rect class="sm-ad" x="${mx}" y="${my}" width="${300 * S}" height="${600 * S}" rx="2"/>
            ${asks}
            <text class="sm-v is-win" x="${mx + 300 * S - 8}" y="${my + 600 * S - 12}" text-anchor="end">300×600 serves</text>
            <text class="sm-v" x="${mx}" y="450">one slot asks for three sizes:</text>
            <text class="sm-v" x="${mx}" y="472">${MULTI.map(([w, h]) => `${w}×${h}`).reverse().join(" · ")}</text>
          </svg>`;
}

const FEATURES = [
  { title: "Viewability Optimization", body: "Lazy loading and viewport detection ensure ads load only when visible, boosting viewability rates above 70%." },
  { title: "Mobile-First Design", body: "Responsive ad containers that adapt to any screen size with mobile-specific formats and touch-friendly interactions." },
  { title: "Brand Safety", body: "Comprehensive category blocking, advertiser exclusions, and malvertising protection to maintain site integrity." },
  { title: "Core Web Vitals", body: "Optimized ad delivery that protects CLS, LCP, and FID scores, preserving SEO rankings and user experience." },
];

export function renderDisplayAdsPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Display Ads",
    lede: "High-impact display advertising optimized for viewability, engagement, and revenue. From standard IAB units to rich media formats, we maximize every pixel.",
    actions: [
      { label: "Get Your Free Analysis", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "See the formats", href: "#formats" },
    ],
  })}

  <section class="bp-section" data-testid="display-overview-section">
    <div class="bp-wrap">
      <div class="bp-grid12 sm-overview" data-testid="card-display-overview">
        <div class="col-span-12 lg:col-span-5">${renderEyebrow("Display Monetization")}<h2>Beyond the banner.</h2></div>
        <div class="sm-copy col-span-12 lg:col-start-6 lg:col-span-7">
          <p>Display advertising remains the backbone of digital monetization, but the landscape has evolved far beyond simple banners. HBDR's display solution optimizes across all IAB standard formats — from leaderboards and skyscrapers to high-impact adhesion units and responsive multi-size placements — ensuring maximum fill rates and CPMs across every device.</p>
          <p>Our proprietary viewability engine ensures ads are only served when they have the highest probability of being seen, improving advertiser satisfaction and commanding premium pricing. Combined with lazy loading, smart refresh, and responsive ad unit management, publishers can increase display revenue by up to 50%.</p>
        </div>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "formats",
    testid: "display-formats-section",
    eyebrow: "Ad Formats",
    title: "Premium display formats.",
    lede: "Optimized ad units that balance user experience with maximum revenue potential.",
    body: `
      <div class="sm-diagram">${renderDiagramFrame({
        label: "IAB display units at true proportions, and an example responsive multi-size slot",
        bar: ["IAB units at true proportions", "Scale 0.6 : 1"],
        body: renderSizeDiagram(),
        caption: "Example: the slot asks for three sizes and the highest-paying creative that fits serves.",
        blueprint: true,
        testid: "display-size-diagram",
      })}</div>
      <div class="sm-after">${renderFeatureRows([
        { title: "Responsive Multi-Size", body: "Dynamic ad units that request multiple sizes (e.g., 300x250, 336x280, 300x600) and serve the highest-paying creative that fits the available space. Responsive containers ensure clean layouts across all viewports.", testid: "display-format-card-0" },
        { title: "Sticky & Adhesion Units", body: "Bottom and side adhesion placements that maintain visibility as users scroll, delivering consistently high viewability rates above 85%. Smart dismissal and frequency controls protect user experience.", testid: "display-format-card-1" },
        { title: "Rich Media & Interstitials", body: "High-impact interstitial and expandable formats for premium campaigns. Web interstitials fire between page navigations with compliant close controls and frequency capping per IAB and Google standards.", testid: "display-format-card-2" },
      ])}</div>`,
  })}

  ${renderSection({
    testid: "display-features-section",
    eyebrow: "Key Capabilities",
    title: "Intelligent display optimization.",
    lede: "Every tool you need to maximize display revenue while protecting user experience.",
    body: `
      <ul class="sm-points" style="--cols:4">${FEATURES.map((f, i) => `
        <li data-testid="display-feature-card-${i}"><h3>${f.title}</h3><p>${f.body}</p></li>`).join("")}
      </ul>`,
  })}

  <section class="bp-section" data-testid="display-spec-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-5 grid gap-4 content-start">${renderEyebrow("Specifications")}<h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">At a glance.</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6">${renderSpecList([
        { label: "Formats", value: "All IAB standard units" },
        { label: "Multi-size request", value: '<span class="mono">300×250 · 336×280 · 300×600</span>' },
        { label: "Adhesion viewability", value: "above 85%" },
        { label: "Viewability with lazy loading", value: "above 70%" },
        { label: "Display revenue", value: "50%<small>up to</small>" },
        { label: "Core Web Vitals", value: "CLS · LCP · FID protected" },
      ])}</div>
    </div>
  </section>

  ${renderStatsSection()}

  ${renderCTASection("Ready to optimize your display revenue?", "Get Your Free Analysis")}`;

  return renderLayout({
    title: "Display Ads Solutions - HBDR",
    description: "Maximize display ad revenue with responsive formats, viewability optimization, and brand safety controls. Premium IAB formats and intelligent refresh.",
    canonicalPath: "/solutions/display-ads",
    bodyContent: content,
  });
}
