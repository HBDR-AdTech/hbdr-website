import { renderFeatureRows } from "./blueprint";

// D-031: only "now" items may be presented as live (D-005). Move an item between
// the lists only on Matt's word, and record it in DECISIONS.
export const FEATURES_NOW: { title: string; body: string }[] = [
  { title: "Dynamic floor prices", body: "Floor prices set by a model for each impression or traffic segment." },
  { title: "A/B testing", body: "Split traffic to test bidders, timeouts and floors before a change goes to every visitor." },
  { title: "Managed Prebid Server", body: "Server-side bidding hosted and run by HBDR, beside Prebid.js in the browser." },
  { title: "Hourly reporting", body: "Revenue and bidder performance updated every hour, with alerts and CSV exports." },
  { title: "Invalid traffic filtering", body: "Invalid traffic is detected and filtered." },
  { title: "In-app mediation", body: "Mediation for mobile apps." },
  { title: "CTV server-side ad insertion", body: "Ads stitched into the stream on the server for connected TV and OTT." },
  { title: "AMP and companion ads", body: "Ads on AMP pages, and companion ads beside the video in the player." },
  { title: "Identity modules", body: "SharedID, UID2, ID5 and LiveRamp in the Prebid wrapper." },
  { title: "Lazy loading and viewable refresh", body: "Slots load as they near the screen and refresh only while they are in view." },
];

export const FEATURES_SOON: { title: string; body: string }[] = [
  { title: "Ad verification partners", body: "Confiant, IAS or DoubleVerify for ad quality and verification." },
  { title: "WordPress plugin", body: "Placements, ads.txt and onboarding managed from the WordPress admin." },
];

export function renderFeatureLists(testid: string): string {
  return `
      <p class="bp-eyebrow mb-4" data-testid="${testid}-now-title">Available now</p>
      <div data-testid="${testid}-now">${renderFeatureRows(FEATURES_NOW)}</div>
      <p class="bp-eyebrow mt-12 mb-4" data-testid="${testid}-soon-title">Coming soon</p>
      <div data-testid="${testid}-soon">${renderFeatureRows(FEATURES_SOON)}</div>`;
}
