import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection, renderSpecList } from "../components/blueprint";

const MILESTONES = [
  { step: "2015", title: "Founded", description: "HBDR was founded with a vision to revolutionize ad monetization for digital publishers through advanced header bidding technology." },
  { step: "2020", title: "1B Monthly Impressions", description: "Reached the milestone of processing over 1 billion monthly ad impressions across our global network of publishers." },
  { step: "2025", title: "500+ Publishers Globally", description: "Expanded to serve over 500 publishers worldwide, processing more than 1 trillion ads served across all platforms." },
];

const VALUES = [
  { title: "Innovation", description: "Constantly pushing boundaries with cutting-edge ad tech solutions and AI-powered optimization." },
  { title: "Transparency", description: "Full visibility into performance data, auction mechanics, and revenue attribution for every publisher." },
  { title: "Partnership", description: "We succeed when our publishers succeed. Every relationship is built on mutual growth and trust." },
  { title: "Performance", description: "Relentless focus on delivering measurable results and maximizing revenue for every partner." },
];

export function renderAboutPage(): string {
  const content = `
  ${renderPageHero("About Us", "About HBDR", "HBDR runs header bidding and ad monetization for publishers on the web, in apps and on connected TV, and has since 2015.")}

  <section class="bp-section" data-testid="about-mission-section">
    <div class="bp-wrap bp-grid12" data-testid="card-mission">
      <div class="col-span-12 lg:col-span-5 grid gap-4 content-start">
        ${renderEyebrow("Our Mission")}
        <h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">Maximizing Publisher Revenue</h2>
      </div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 grid gap-5 text-[1.0625rem] leading-relaxed text-[var(--text-muted)]">
        <p>HBDR sells publishers' ad inventory through header bidding with 65+ demand sources: buyers bid on an impression in the same auction, and the highest bid that arrives in time wins. HBDR serves more than 1 billion impressions a month and has served more than 1 trillion ads in total.</p>
        <p>Our team brings more than 25 years of combined experience in programmatic advertising, and we pair the technology with hands-on ad operations to outperform traditional ad networks, helping our partners increase revenue by up to 50%.</p>
      </div>
    </div>
  </section>
  ${renderSection({
    testid: "about-story-section",
    eyebrow: "Our Journey",
    title: "Our Story",
    lede: "Key milestones that shaped who we are today.",
    body: renderDiagramFrame({
      label: "Timeline of HBDR milestones from 2015 to 2025",
      blueprint: true,
      bar: ["HBDR", "2015 → 2025"],
      body: `
        <ol class="co-years">${MILESTONES.map((m, i) => `
          <li${i === MILESTONES.length - 1 ? ' class="co-now"' : ""} data-testid="timeline-card-${i}">
            <span class="co-year">${m.step}</span>
            <h3>${m.title}</h3>
            <p>${m.description}</p>
          </li>`).join("")}
        </ol>`,
    }),
  })}
  ${renderSection({
    testid: "about-values-section",
    eyebrow: "What We Stand For",
    title: "Our Values",
    lede: "The principles that guide everything we do.",
    body: renderFeatureRows(VALUES.map((v, i) => ({ title: v.title, body: v.description, testid: `value-card-${i}` }))),
  })}

  <section class="bp-section" data-testid="stats-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-5 grid gap-4 content-start">
        ${renderEyebrow("Company")}
        <h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">HBDR in numbers.</h2>
      </div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6">${renderSpecList([
        { label: "Ads served through HBDR", value: '<span data-testid="stat-card-0">1T+</span>' },
        { label: "Impressions per month", value: '<span data-testid="stat-card-2">1B+</span>' },
        { label: "Publishers", value: '<span data-testid="stat-card-3">500+</span>' },
        { label: "Revenue increase", value: '<span data-testid="stat-card-1">50%</span><small>up to</small>' },
        { label: "Combined team experience in programmatic advertising", value: "25+<small>years</small>" },
        { label: "Founded", value: "2015" },
      ], true)}</div>
    </div>
  </section>

  ${renderCTASection("Ready to partner with us?", "Get In Touch")}`;

  return renderLayout({
    title: "About Us - HBDR",
    description: "Learn about HBDR's mission to maximize publisher revenue through advanced header bidding and ad monetization solutions.",
    canonicalPath: "/about",
    bodyContent: content,
  });
}
