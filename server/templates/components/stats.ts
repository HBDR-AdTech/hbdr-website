import { renderSection, renderStatRow } from "./blueprint";

export function renderStatsSection(): string {
  return renderSection({
    testid: "stats-section",
    eyebrow: "Our Impact",
    title: "Delivering results at scale.",
    lede: "HBDR has served ads since 2015 for publishers on the web, in apps and on connected TV.",
    body: renderStatRow([
      { value: "1T+", label: "Ads served", testid: "stat-card-0" },
      { value: "Up to 50%", label: "Revenue increase", testid: "stat-card-1" },
      { value: "1B+", label: "Impressions a month", testid: "stat-card-2" },
      { value: "500+", label: "Publishers", testid: "stat-card-3" },
    ]),
  });
}
