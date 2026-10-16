import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderSection, renderFeatureRows } from "../components/blueprint";

export function renderCareersPage(): string {
  const content = `
  ${renderPageHero("Careers", "Join Our Team", "Shape the future of ad tech. We're building the next generation of ad monetization technology and we want you on our team.")}

  ${renderSection({
    testid: "careers-why-section",
    eyebrow: "Why Join Us",
    title: "Why HBDR",
    lede: "Join a team that's redefining digital advertising technology.",
    body: renderFeatureRows([
      { title: "Cutting-Edge Technology", body: "Work with the latest in ad tech, real-time bidding systems, machine learning optimization, and distributed computing at massive scale." },
      { title: "Global Impact", body: "Your work impacts billions of ad impressions every month across 500+ publishers worldwide. Build systems that operate at truly global scale." },
      { title: "Growth & Learning", body: "Continuous learning opportunities, mentorship from industry veterans, and a clear career growth path in one of tech's fastest-growing sectors." },
    ].map((r, i) => ({ ...r, testid: `careers-why-card-${i}` }))),
  })}

  ${renderSection({
    testid: "careers-benefits-section",
    eyebrow: "Perks & Benefits",
    title: "Benefits",
    lede: "We take care of our team so they can focus on doing their best work.",
    body: `
      <ul class="res-cols">${[
        { title: "Remote-First", description: "Work from anywhere in the world with flexible location policies." },
        { title: "Competitive Pay", description: "Top-of-market compensation with equity and performance bonuses." },
        { title: "Health & Wellness", description: "Comprehensive health, dental, and vision coverage for you and your family." },
        { title: "Learning Budget", description: "Annual learning stipend for courses, conferences, and professional development." },
        { title: "Flexible Hours", description: "Results-oriented culture with flexible working hours and unlimited PTO." },
        { title: "Team Retreats", description: "Annual company retreats and quarterly team offsites around the world." },
      ].map((b, i) => `
        <li data-testid="benefit-card-${i}"><h3>${b.title}</h3><p>${b.description}</p></li>`).join("")}
      </ul>`,
  })}

  ${renderSection({
    testid: "careers-positions-section",
    eyebrow: "Open Roles",
    title: "Open Positions",
    lede: "Find your next opportunity at HBDR.",
    body: `
      <ul class="res-roles">${[
        { title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Remote", description: "Build and scale our ad-serving infrastructure handling billions of monthly requests. Work with real-time bidding systems, distributed architectures, and performance-critical code." },
        { title: "Ad Operations Manager", dept: "Operations", location: "New York", description: "Manage publisher relationships and optimize ad configurations for maximum revenue. Analyze performance data and implement strategic improvements across our publisher network." },
        { title: "Product Designer", dept: "Design", location: "Remote", description: "Shape the user experience of our publisher dashboard and internal tools. Design intuitive interfaces that make complex ad tech data accessible and actionable." },
        { title: "Data Scientist", dept: "Data", location: "San Francisco", description: "Develop ML models for bid optimization and revenue prediction. Build and iterate on algorithms that process billions of data points to maximize publisher yield." },
      ].map((pos, i) => `
        <li data-testid="position-card-${i}">
          <div class="res-role-main"><h3>${pos.title}</h3><p>${pos.description}</p></div>
          <dl class="res-role-meta"><div><dt>Team</dt><dd>${pos.dept}</dd></div><div><dt>Location</dt><dd>${pos.location}</dd></div></dl>
          <a href="/contact" class="glass-btn-outline text-sm" data-testid="button-apply-${i}">Apply Now</a>
        </li>`).join("")}
      </ul>`,
  })}

  ${renderCTASection("Don't see your role? Reach out anyway.", "Contact Us")}`;

  return renderLayout({
    title: "Careers - HBDR",
    description: "Join the HBDR team and shape the future of ad tech. Explore open positions in engineering, design, operations, and data science.",
    canonicalPath: "/careers",
    bodyContent: content,
  });
}

