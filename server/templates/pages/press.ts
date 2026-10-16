import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderSection, renderEyebrow, renderSpecList } from "../components/blueprint";

export function renderPressPage(): string {
  const content = `
  ${renderPageHero("Press", "Press & News", "Latest updates from HBDR. Stay informed about our milestones, product launches, and industry recognition.")}

  ${renderSection({
    testid: "press-releases-section",
    eyebrow: "Latest News",
    title: "Press Releases",
    body: `
      <ol class="res-dated">${[
        { title: "HBDR Surpasses 1 Trillion Ads Served", date: "January 2026", description: "A major milestone in programmatic advertising as HBDR processes its one trillionth ad impression, demonstrating the scale and reliability of its header bidding platform across 500+ global publishers." },
        { title: "HBDR Launches AI-Powered Bid Optimization", date: "November 2025", description: "New machine learning capabilities enable real-time bid optimization that automatically adjusts floor prices, demand partner priorities, and auction configurations to maximize publisher revenue by an additional 15-20%." },
        { title: "HBDR Expands European Operations", date: "September 2025", description: "Opening new offices in London and Berlin to better serve the growing European publisher market, bringing local expertise and GDPR-compliant ad monetization solutions to the region." },
        { title: "HBDR Named Top Ad Tech Company", date: "June 2025", description: "Industry recognition for innovation in header bidding technology. HBDR was selected from over 200 nominees for its contributions to advancing programmatic advertising and publisher revenue optimization." },
        { title: "HBDR Partners with Major CTV Platforms", date: "March 2025", description: "Expanding into connected TV advertising with partnerships across leading streaming platforms, enabling publishers to monetize CTV inventory through HBDR's unified auction technology." },
      ].map((pr, i) => `
        <li data-testid="press-card-${i}">
          <span class="mono">${pr.date}</span>
          <div><h3>${pr.title}</h3><p>${pr.description}</p></div>
        </li>`).join("")}
      </ol>`,
  })}

  <section class="bp-section" data-testid="press-contact-section">
    <div class="bp-wrap bp-grid12">
      <div class="res-half" data-testid="card-media-contact">
        ${renderEyebrow("Media Contact")}
        <h2>Get in Touch</h2>
        <p>For press inquiries, interview requests, or media partnerships, please reach out to our communications team.</p>${renderSpecList([
          { label: "Email", value: "press@hbdr.com" },
          { label: "Phone", value: '<span class="mono">(786) 675-6080</span>' },
        ])}
      </div>
      <div class="res-half" data-testid="card-brand-assets">
        ${renderEyebrow("Brand Assets")}
        <h2>Media Kit</h2>
        <p>Download our official logos, brand guidelines, and media assets for use in press coverage and publications. All assets are available in multiple formats and resolutions.</p>
        <p>For custom brand asset requests or high-resolution images, please contact our media team at press@hbdr.com.</p>
      </div>
    </div>
  </section>`;

  return renderLayout({
    title: "Press & News - HBDR",
    description: "Latest news, press releases, and media resources from HBDR. Stay updated on our milestones and industry recognition.",
    canonicalPath: "/press",
    bodyContent: content,
  });
}

