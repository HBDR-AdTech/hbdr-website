import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderSection, renderFeatureRows } from "../components/blueprint";

// Facts come from D-005 and D-027 only; roles and benefits are listed only when Matt supplies real ones
export function renderCareersPage(): string {
  const content = `
  ${renderPageHero("Careers", "Careers at HBDR", "No open roles are listed right now. You can still send us your CV for future openings.")}

  ${renderSection({
    testid: "careers-positions-section",
    eyebrow: "Open Roles",
    title: "Open Positions",
    lede: "Send a CV now to be considered when a role opens.",
    body: `
      <div class="bp-grid12">
        <div class="res-half" data-testid="careers-apply">
          <p>To be considered for future roles, email your CV to <a href="mailto:contact@hbdr.com" class="text-[var(--accent)] underline underline-offset-2" data-testid="link-careers-email">contact@hbdr.com</a> with "Careers" in the subject line.</p>
          <ul class="bp-list">
            <li>The kind of work you do: engineering, ad operations, sales or another area</li>
            <li>What you have built or run, with links to work you can share</li>
            <li>Where you are based</li>
          </ul>
        </div>
      </div>`,
  })}

  ${renderSection({
    testid: "careers-why-section",
    eyebrow: "The Work",
    title: "What HBDR Does",
    lede: "HBDR has run header bidding and ad monetization for publishers since 2015.",
    body: renderFeatureRows([
      { title: "Header bidding for publishers", body: "HBDR runs the auctions in which demand sources bid for a publisher's ad space before the ad server picks a winner. It connects 65+ demand sources and works with 500+ publishers." },
      { title: "Scale", body: "HBDR serves 1B+ ad impressions a month and has served 1T+ ads in total. It has worked with 47,000+ sites." },
      { title: "Formats", body: "Display, video, in-app and CTV/OTT. For apps, HBDR offers an in-app SDK or an SDK-less server-side integration." },
      { title: "The team", body: "The team has 25+ years of combined ad-tech experience." },
    ].map((r, i) => ({ ...r, testid: `careers-why-card-${i}` }))),
  })}

  ${renderCTASection("Questions about working at HBDR?", "Contact Us")}`;

  return renderLayout({
    title: "Careers - HBDR",
    description: "Careers at HBDR. No open roles are listed right now; send your CV to contact@hbdr.com for future openings.",
    canonicalPath: "/careers",
    bodyContent: content,
  });
}

