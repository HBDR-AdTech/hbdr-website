import { renderLayout } from "../../layout";
import { renderBlueprintHero, renderEyebrow, renderSection, renderSpecList } from "../../components/blueprint";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";

// Each phone drawing marks where the format sits on screen (mint = the ad)
const PHONE: Record<string, string> = {
  rewarded: '<rect class="ad" x="5" y="8" width="36" height="64" rx="2"/><path class="sm-play" d="M19 33 L19 47 L30 40 Z"/>',
  interstitial: '<rect class="ad" x="5" y="8" width="36" height="64" rx="2"/><path class="sm-arrowhead" d="M32 12 L37 17 M37 12 L32 17"/>',
  native: '<rect class="ui" x="5" y="9" width="36" height="12" rx="1.5"/><rect class="ad" x="5" y="25" width="36" height="16" rx="1.5"/><rect class="ui" x="5" y="45" width="36" height="12" rx="1.5"/><rect class="ui" x="5" y="61" width="36" height="10" rx="1.5"/>',
  banner: '<rect class="ui" x="5" y="9" width="36" height="12" rx="1.5"/><rect class="ui" x="5" y="25" width="36" height="12" rx="1.5"/><rect class="ui" x="5" y="41" width="36" height="12" rx="1.5"/><rect class="ad" x="5" y="64" width="36" height="7" rx="1"/>',
};

const FORMATS = [
  { key: "rewarded", title: "Rewarded Video", size: 'Full screen · <span class="mono">15–30 s</span>', description: "Users opt-in to watch 15-30 second video ads in exchange for in-app rewards. Highest eCPMs with 90%+ completion rates and positive user sentiment." },
  { key: "interstitial", title: "Interstitials", size: "Full screen", description: "Full-screen ads displayed at natural transition points. Smart frequency capping and contextual triggers ensure maximum impact without disrupting app flow." },
  { key: "native", title: "Native Ads", size: "Custom template", description: "Seamlessly integrated ads that match your app's look and feel. Custom templates ensure native placements feel organic while delivering strong eCPMs." },
  { key: "banner", title: "Banner Ads", size: "Standard · adaptive", description: "Standard and adaptive banner placements optimized for mobile viewports. Smart refresh cycles maximize revenue per session while maintaining quality." },
];

function renderFormatTable(): string {
  return `
      <div class="bp-table-wrap" data-testid="inapp-format-table">
        <table class="bp-table sm-format-table">
          <caption class="sr-only">In-app ad formats: where each one sits on screen, its size and how it is used</caption>
          <thead><tr><th scope="col">Placement</th><th scope="col">Format</th><th scope="col">Size</th><th scope="col">How it runs</th></tr></thead>
          <tbody>${FORMATS.map((f, i) => `
            <tr data-testid="inapp-format-card-${i}">
              <td><svg class="sm-phone" viewBox="0 0 46 80" role="img" aria-label="${f.title} placement on a phone screen"><rect class="body" x="1" y="1" width="44" height="78" rx="7"/>${PHONE[f.key]}</svg></td>
              <td>${f.title}</td>
              <td class="whitespace-nowrap">${f.size}</td>
              <td>${f.description}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
}

export function renderInAppAdsPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "In-App Advertising",
    lede: "Monetize your mobile app with SDK-less integration, rewarded video, interstitials, and native ad formats that drive revenue without compromising user retention.",
    actions: [
      { label: "Start Integration", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "See the formats", href: "#formats" },
    ],
  })}

  <section class="bp-section" data-testid="inapp-overview-section">
    <div class="bp-wrap">
      <div class="bp-grid12 sm-overview" data-testid="card-inapp-overview">
        <div class="col-span-12 lg:col-span-5">${renderEyebrow("Mobile Monetization")}<h2>Revenue without friction.</h2></div>
        <div class="sm-copy col-span-12 lg:col-start-6 lg:col-span-7">
          <p>In-app advertising is the primary revenue driver for the vast majority of free-to-play mobile applications. HBDR's in-app solution offers lightweight, SDK-less integration via server-side APIs, eliminating the bloat and complexity of traditional SDK stacks while connecting your app to the full breadth of programmatic demand.</p>
          <p>Our platform supports all major in-app ad formats — including rewarded video, interstitials, banners, and native ads — with intelligent mediation that maximizes eCPM across every user session. Advanced frequency capping and placement optimization ensure ads enhance rather than interrupt the user experience.</p>
        </div>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "formats",
    testid: "inapp-formats-section",
    eyebrow: "Ad Formats",
    title: "Formats that perform.",
    lede: "Every format optimized for engagement, revenue, and user retention.",
    body: renderFormatTable(),
  })}

  <section class="bp-section" data-testid="inapp-integration-section">
    <div class="bp-wrap" data-testid="card-inapp-integration">
      <div class="bp-grid12 sm-overview">
        <div class="col-span-12 lg:col-span-5">${renderEyebrow("Integration")}<h2>SDK-less architecture.</h2></div>
        <div class="sm-copy col-span-12 lg:col-start-6 lg:col-span-7">
          <p>Unlike traditional mediation platforms that require heavy SDK integrations, HBDR's server-side approach connects your app to our auction engine via lightweight API calls. This means smaller app binary sizes, fewer crashes, faster app review cycles, and the ability to update demand configurations without app store submissions.</p>
          <p>Our solution supports both iOS and Android with native-quality rendering, GDPR/CCPA-compliant consent management, and SKAdNetwork/Privacy Sandbox compatibility for post-IDFA attribution.</p>
        </div>
      </div>
      <div class="bp-grid12 sm-after">
        <div class="col-span-12 lg:col-start-6 lg:col-span-7">${renderSpecList([
          { label: "Integration", value: "Server-side API, no SDK" },
          { label: "Platforms", value: "iOS · Android" },
          { label: "Consent", value: "GDPR · CCPA" },
          { label: "Attribution", value: "SKAdNetwork · Privacy Sandbox" },
          { label: "Demand changes", value: "No app store submission" },
          { label: "Formats", value: "Rewarded · interstitial · native · banner" },
        ])}</div>
      </div>
    </div>
  </section>

  ${renderStatsSection()}

  ${renderCTASection("Ready to monetize your app?", "Start Integration")}`;

  return renderLayout({
    title: "In-App Advertising Solutions - HBDR",
    description: "Monetize mobile apps with rewarded video, interstitials, native ads, and SDK-less integration. Maximize eCPMs while protecting user experience.",
    canonicalPath: "/solutions/in-app-ads",
    bodyContent: content,
  });
}
