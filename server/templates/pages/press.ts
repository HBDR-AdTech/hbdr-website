import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderSection, renderEyebrow, renderSpecList } from "../components/blueprint";

// Company figures come from D-005 and D-027 only; no dated releases until real ones exist
export function renderPressPage(): string {
  const content = `
  ${renderPageHero("Press", "Press & Media", "Company facts, a media contact and logo files for anyone writing about HBDR.")}

  ${renderSection({
    testid: "press-facts-section",
    eyebrow: "Fact Sheet",
    title: "HBDR at a Glance",
    lede: "Figures stated by HBDR that you can quote. 1B+ is monthly impressions; 1T+ is the total ads served to date.",
    body: renderSpecList([
      { label: "Founded", value: '<span class="mono">2015</span>' },
      { label: "What HBDR does", value: "Header bidding and ad monetization for publishers" },
      { label: "Ad impressions served", value: '<span class="mono">1B+</span> per month' },
      { label: "Total ads served", value: '<span class="mono">1T+</span>' },
      { label: "Publishers", value: '<span class="mono">500+</span>' },
      { label: "Sites worked with", value: '<span class="mono">47,000+</span>' },
      { label: "Demand sources", value: '<span class="mono">65+</span>' },
      { label: "Team experience", value: '<span class="mono">25+</span> years combined' },
    ]),
  })}

  <section class="bp-section" data-testid="press-contact-section">
    <div class="bp-wrap bp-grid12">
      <div class="res-half" data-testid="card-media-contact">
        ${renderEyebrow("Media Contact")}
        <h2>Get in Touch</h2>
        <p>For interviews, comment or a fact check, email us. Include your publication, your deadline and the questions you need answered.</p>${renderSpecList([
          { label: "Email", value: '<a href="mailto:contact@hbdr.com" class="text-[var(--accent)] underline underline-offset-2" data-testid="link-press-email">contact@hbdr.com</a>' },
          { label: "Press email", value: "press@hbdr.com" },
          { label: "Phone", value: '<span class="mono">(786) 675-6080</span>' },
        ])}
      </div>
      <div class="res-half" data-testid="card-brand-assets">
        ${renderEyebrow("Brand Assets")}
        <h2>Logo Files</h2>
        <p>Two logo files are available to download now. For another format or size, email contact@hbdr.com.</p>${renderSpecList([
          { label: "Logo on dark background", value: '<a href="/assets/HBDR_Logo_Pack_all_sizes_-_2_1770577514801.jpeg" class="text-[var(--accent)] underline underline-offset-2" data-testid="link-logo-jpeg">JPEG <span class="mono">2048 × 2048</span></a>' },
          { label: "Wordmark for dark backgrounds", value: '<a href="/assets/HBDR_logo_wo_tagline_crp_370x116_web_1770664100214.png" class="text-[var(--accent)] underline underline-offset-2" data-testid="link-logo-png">PNG <span class="mono">370 × 116</span></a>' },
        ])}
      </div>
    </div>
  </section>`;

  return renderLayout({
    title: "Press & Media - HBDR",
    description: "Press resources for HBDR: a company fact sheet, a media contact and logo files.",
    canonicalPath: "/press",
    bodyContent: content,
  });
}

