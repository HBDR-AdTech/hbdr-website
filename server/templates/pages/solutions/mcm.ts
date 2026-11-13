import { renderLayout } from "../../layout";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";
import { renderBlueprintHero, renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection, renderSpecList } from "../../components/blueprint";

const BENEFITS = [
  { title: "Google AdX access", body: "Gain access to Google Ad Exchange premium demand without meeting individual eligibility requirements. Our MCM status opens the door to the world's largest programmatic exchange." },
  { title: "Revenue share", body: "HBDR is paid through a revenue share on the revenue it is part of, from HBDR's own ad units up to the whole page. There is no setup fee and no lock-in by default." },
  { title: "Policy compliance", body: "Google enforces its Ad Manager policies, and each child publisher stays responsible for its own content. We handle ads.txt management and compliance monitoring for every child so publishers can focus on creating content." },
  { title: "Network management", body: "Centralized dashboard to manage all publisher accounts, monitor performance across the network, and identify optimization opportunities at scale." },
  { title: "Dedicated support", body: "Priority access to HBDR's ad operations team and escalation paths to Google for account reviews, policy questions, and technical troubleshooting." },
  { title: "Transparent reporting", body: "Hourly revenue reporting with alerts and CSV exports." },
];

// Parent/child schematic: Google's demand reaches child publishers through HBDR's parent account (the one mint node)
const CHILD_X = [40, 360, 680];
const STRUCTURE_SVG = `
          <svg viewBox="0 0 960 430" role="img" aria-label="Google Ad Manager supplies Ad Exchange demand to HBDR, the MCM parent, which manages accounts for multiple child publishers">
            <rect class="sg-node" x="330" y="24" width="300" height="72" rx="6"/>
            <text class="sg-name" x="480" y="55" text-anchor="middle">Google Ad Manager</text>
            <text class="sg-sub" x="480" y="77" text-anchor="middle">Google Ad Exchange demand</text>
            <path class="sg-flow" d="M480 96 V164"/><path class="sg-tick" d="M472 96 H488 M472 164 H488"/>
            <text class="sg-tag" x="494" y="135">AdX access</text>
            <rect class="sg-node-hi" x="230" y="164" width="500" height="84" rx="6"/>
            <text class="sg-tag sg-tag-hi" x="480" y="190" text-anchor="middle">MCM parent</text>
            <text class="sg-name" x="480" y="214" text-anchor="middle">HBDR</text>
            <text class="sg-sub" x="480" y="236" text-anchor="middle">Account provisioning · policy compliance · revenue reconciliation</text>
            <path class="sg-flow" d="M480 248 V292 M160 292 H800 ${CHILD_X.map((x) => `M${x + 120} 292 V336`).join(" ")}"/>
            <path class="sg-tick" d="${CHILD_X.map((x) => `M${x + 112} 336 H${x + 128}`).join(" ")}"/>
            <text class="sg-tag" x="494" y="278">Multiple publishers</text>
            ${CHILD_X.map((x, i) => `<rect class="sg-node" x="${x}" y="336" width="240" height="72" rx="6"/>
            <text class="sg-name" x="${x + 120}" y="367" text-anchor="middle">Child publisher ${i + 1}</text>
            <text class="sg-sub" x="${x + 120}" y="389" text-anchor="middle">Keeps its account and data</text>`).join("\n            ")}
          </svg>`;

export function renderMcmPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Multiple Customer Management",
    lede: "Scale your publishing network with Google's MCM program. HBDR manages the complexity of multi-publisher operations so you can focus on growing your partner portfolio.",
    actions: [
      { label: "Apply for MCM", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "See the MCM structure", href: "#overview", testid: "button-hero-learn" },
    ],
  })}

  <section class="bp-section" id="overview" data-testid="mcm-overview-section">
    <div class="bp-wrap bp-grid12 sg-split" data-testid="card-mcm-overview">
      <div class="col-span-12 lg:col-span-5 grid gap-5 content-start">${renderEyebrow("Google MCM")}<h2>What is Google MCM?</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 sg-prose">
        <p>Multiple Customer Management (MCM) is Google's program that allows ad management companies to represent and manage Google Ad Manager accounts on behalf of multiple publishers. HBDR is a Google MCM partner: an MCM parent on Google Ad Manager 360 that offers both Manage Account and Manage Inventory. It gives publishers access to Google Ad Exchange demand, yield optimization and a dedicated account manager, even if they don't meet Google's individual eligibility thresholds.</p>
        <p>Through our MCM relationship, publishers get Google Ad Exchange demand and a dedicated account manager. We handle all the technical complexity of account provisioning, policy compliance, and revenue reconciliation.</p>
        <p>MCM has two delegation types. Under <a href="/solutions/manage-account">Manage Account</a>, the parent works inside the child's Ad Manager account and the inventory stays there. Under <a href="/solutions/manage-inventory">Manage Inventory</a>, the child delegates inventory to the parent, which manages it in its own account with no access to the child's. A child can have one Manage Account parent and up to 15 Manage Inventory parents, but not the same parent under both.</p>
        <p>The MCM parent must run Google Ad Manager 360 (becoming a child doesn't change the child network's own features), and Google requires MCM whenever a publisher monetizes inventory it doesn't own and operate. Either way, the child needs its own Ad Manager network so Google can identify it and review it against its policies.</p>
      </div>
    </div>
    <div class="bp-wrap mt-14 sg-diagram">${renderDiagramFrame({
      label: "Diagram of the MCM parent and child publisher structure",
      testid: "mcm-structure-diagram",
      blueprint: true,
      bar: ["Google Multiple Customer Management", "Parent / child structure"],
      body: STRUCTURE_SVG,
      caption: "Schematic: three child publishers shown for illustration. MCM rules: Google Ad Manager Help, About Multiple Customer Management and About Manage Inventory (retrieved October 2026).",
    })}
    </div>
  </section>

  ${renderSection({
    testid: "mcm-benefits-section",
    eyebrow: "Benefits",
    title: "Why publishers choose MCM.",
    lede: "Unlock premium demand, simplified operations, and accelerated revenue growth through our MCM partnership.",
    body: renderFeatureRows(BENEFITS.map((b, i) => ({ ...b, testid: `mcm-benefit-card-${i}` }))),
  })}

  ${renderSection({
    testid: "mcm-process-section",
    eyebrow: "Onboarding",
    title: "Seamless MCM onboarding.",
    lede: "Getting started with HBDR's MCM program is straightforward.",
    body: `
      <div class="bp-grid12" data-testid="card-mcm-process">
        <div class="col-span-12 lg:col-span-6 sg-prose">
          <p>We send the MCM invitation and guide you through Google's review of your account — Google, not the parent, approves each child publisher — then configure Ad Manager, set up demand partnerships, and begin optimization. Average go-live is 1–3 business days, depending on your current setup and Google's review. Publishers retain full ownership of their accounts and data throughout the relationship.</p>
          <p>Our MCM agreement has no lock-in by default; a fixed term can be agreed in your contract if you prefer one. Publishers can review performance monthly and our team provides regular optimization recommendations to continuously improve yield across all demand channels.</p>
        </div>
        <div class="col-span-12 lg:col-start-8 lg:col-span-5">${renderSpecList([
          { label: "Child account review", value: "Google" },
          { label: "MCM invitation and Ad Manager setup", value: "HBDR" },
          { label: "Go-live, average", value: '<span class="mono text-[0.875rem]">1–3 business days</span>' },
          { label: "Account and data ownership", value: "Publisher" },
          { label: "Lock-in period", value: "None" },
        ])}</div>
      </div>`,
  })}

  ${renderStatsSection()}

  ${renderCTASection("Ready to join our MCM network?", "Apply for MCM")}`;

  return renderLayout({
    title: "Multiple Customer Management (MCM) - HBDR",
    description: "Join HBDR's Google MCM program. Access Google Ad Exchange, premium demand, and expert ad operations management for your publishing network.",
    canonicalPath: "/solutions/mcm",
    bodyContent: content,
  });
}
