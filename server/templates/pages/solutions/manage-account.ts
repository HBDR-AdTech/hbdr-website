import { renderLayout } from "../../layout";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";
import { renderBlueprintHero, renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection, renderSteps } from "../../components/blueprint";

const BENEFITS = [
  { title: "Premium AdX access", body: "Gain access to Google Ad Exchange's premium programmatic demand pool through HBDR's parent MCM account. AdX buyers compete directly in your GAM auction, driving up CPMs across all your inventory." },
  { title: "Keep your own GAM", body: "Unlike other MCM arrangements, a Manage Account connection means you remain the operator of your Google Ad Manager. Your ad stack, your rules, your reporting — nothing changes except more demand." },
  { title: "Instant revenue lift", body: "Publishers typically see a 20-40% revenue increase within the first 30 days of activating HBDR MA. AdX fills impressions that your existing partners miss and raises the floor for every auction." },
  { title: "Unified reporting", body: "See all AdX revenue alongside your other demand sources inside your own GAM reports. Full transparency into what HBDR MA is earning you — broken down by ad unit, geography, device, and more." },
  { title: "No technical overhead", body: "There's no SDK to install, no code to add to your site, and no tags to change. The MCM connection is established entirely within Google Ad Manager — HBDR handles the setup and you approve it." },
  { title: "Dedicated support", body: "Every HBDR MA publisher gets a dedicated account manager who monitors AdX performance, handles policy compliance, manages ads.txt and sellers.json updates, and provides monthly performance reviews." },
];

const WHO = [
  "Publishers with their own GAM who need AdX access",
  "Sites with 1M+ monthly pageviews seeking higher CPMs",
  "Ad ops teams who want to keep control of their stack",
  "Publishers switching from underperforming MCM partners",
  "Multi-site networks looking for a single AdX connection",
  "Content creators ready to monetize with premium demand",
];

const FAQ = [
  { q: "What does 'Manage Account' mean in Google Ad Manager?", a: "In Google Ad Manager's MCM (Multiple Customer Management) program, 'Manage Account' means the parent network (HBDR) provides demand — specifically Google AdX — to the child publisher, but the publisher continues to operate in their own GAM. The publisher manages their own ad units, line items, and yield strategy independently." },
  { q: "Will HBDR have access to my GAM?", a: "No. In a Manage Account arrangement, HBDR does not log into or manage your Google Ad Manager. The MCM link simply enables AdX demand to flow from our parent account into your auction. You maintain full administrative control of your own GAM network." },
  { q: "How is Google MA different from Manage Inventory?", a: "With Manage Account, you run your own ad operations and HBDR provides AdX access. With Manage Inventory, HBDR takes over the operational management of your ad stack entirely — setting up ad units, optimizing yield, and managing your GAM on your behalf. MA is hands-off for HBDR; MI is full-service from HBDR." },
  { q: "How quickly can I get started with HBDR MA?", a: "Once your site is approved, the MCM invitation is typically sent within 24-48 hours. After you accept the invitation in your GAM, AdX demand usually begins flowing within a few days once Google completes the policy review." },
  { q: "What are the revenue share terms?", a: "HBDR operates on a transparent revenue share model. Contact us for specific terms based on your traffic volume and inventory profile. There are no setup fees, no minimums, and no long-term contracts required." },
];

// Inside one child network: AdX arrives over the MCM link (the one mint path) and competes with the publisher's own demand
const INPUTS: [string, number, boolean?][] = [["Header bidding", 96], ["Direct deals", 164], ["Google AdX via HBDR", 232, true], ["Programmatic partners", 300]];
const LINK_SVG = `
          <svg viewBox="0 0 960 440" role="img" aria-label="HBDR's Google Ad Manager 360 parent network sends AdX demand over the MCM link into the publisher's own Google Ad Manager, where it competes with header bidding, direct deals and programmatic partners in one auction">
            <rect class="sg-node" x="24" y="172" width="250" height="120" rx="6"/>
            <text class="sg-name" x="149" y="212" text-anchor="middle">HBDR parent network</text>
            <text class="sg-sub" x="149" y="234" text-anchor="middle">Google Ad Manager 360</text>
            <text class="sg-sub" x="149" y="262" text-anchor="middle">ads.txt · sellers.json · policy</text>
            <path class="sg-flow sg-flow-hi" d="M274 232 H430"/><path class="sg-tick sg-tick-hi" d="M274 224 V240 M430 224 V240"/>
            <text class="sg-tag sg-tag-hi" x="337" y="220" text-anchor="middle">MCM link</text>
            <text class="sg-tag" x="337" y="258" text-anchor="middle">AdX demand</text>
            <rect class="sg-zone" x="400" y="24" width="536" height="392" rx="10"/>
            <text class="sg-tag" x="430" y="54">Your Google Ad Manager · you operate</text>
            ${INPUTS.map(([name, cy, hi]) => `<rect class="${hi ? "sg-node-hi" : "sg-node"}" x="430" y="${cy - 24}" width="240" height="48" rx="6"/>
            <text class="sg-name" x="550" y="${cy + 5}" text-anchor="middle" style="font-size:15px">${name}</text>
            <path class="sg-flow${hi ? " sg-flow-hi" : ""}" d="M670 ${cy} H700"/>`).join("\n            ")}
            <path class="sg-flow" d="M700 96 V300 M700 215 H730"/><path class="sg-tick" d="M730 207 V223"/>
            <rect class="sg-node" x="730" y="156" width="180" height="118" rx="6"/>
            <text class="sg-name" x="820" y="206" text-anchor="middle">Unified auction</text>
            <text class="sg-sub" x="820" y="228" text-anchor="middle">More competition for</text>
            <text class="sg-sub" x="820" y="246" text-anchor="middle">every impression</text>
            <path class="sg-zone" d="M430 348 H910"/>
            <text class="sg-tag" x="430" y="376">You run</text>
            <text class="sg-sub" x="430" y="398">Ad units · line item priorities · targeting · reporting · yield strategy</text>
          </svg>`;

export function renderManageAccountPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Manage Account (Google MA)",
    lede: "Connect to HBDR's parent MCM account in Google Ad Manager 360 and unlock premium AdX demand — while keeping full control of your own GAM and ad operations.",
    actions: [
      { label: "Get Your MA Connection", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "See how the link works", href: "#structure", testid: "button-hero-learn" },
    ],
  })}

  <section class="bp-section" data-testid="account-overview-section">
    <div class="bp-wrap bp-grid12 sg-split" data-testid="card-account-overview">
      <div class="col-span-12 lg:col-span-5 grid gap-5 content-start">${renderEyebrow("Google MA · MCM connection")}<h2>What is HBDR Manage Account?</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 sg-prose">
        <p>HBDR Manage Account (MA) is a <strong>Multiple Customer Management (MCM)</strong> relationship inside <strong>Google Ad Manager 360</strong>. When you connect to HBDR's parent MCM account, your Google Ad Manager network is linked to our parent network as a child publisher. This connection grants your site access to <strong>Google Ad Exchange (AdX)</strong> premium programmatic demand through HBDR — demand that is otherwise unavailable to publishers who don't meet Google's direct AdX eligibility requirements.</p>
        <p>The key advantage of a Google MA arrangement is that <strong>you continue to operate inside your own GAM</strong>. You keep your existing ad units, line items, reporting, and trafficking workflows exactly as they are. HBDR's parent MCM simply extends AdX eligibility to your account so high-value exchange demand can compete in your unified auction alongside your other demand partners.</p>
        <p>Whether you call it a Google MA, an HBDR MA, or an MCM Manage Account connection — the result is the same: more competition for every impression, higher CPMs, and significantly more revenue, all without giving up control of your ad operations.</p>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "structure",
    testid: "mcm-structure-section",
    eyebrow: "How it works",
    title: "The MCM parent-child structure.",
    lede: "A transparent relationship where HBDR provides the AdX connection and you stay in the driver's seat.",
    body: `
      <div class="sg-diagram mb-16">${renderDiagramFrame({
        label: "Diagram of a Manage Account MCM link",
        testid: "ma-link-diagram",
        blueprint: true,
        bar: ["Manage Account", "MCM link · you operate GAM"],
        body: LINK_SVG,
        caption: "Schematic: HBDR provides the AdX connection and does not log into your GAM.",
      })}
      </div>${renderSteps([
        { title: "MCM invitation", body: "HBDR sends an MCM invitation from our Google Ad Manager 360 parent account to your GAM network. You accept the invitation directly inside your own GAM — a simple, one-click approval.", testid: "card-mcm-step-1" },
        { title: "AdX demand flows in", body: "Once the MCM link is active, Google Ad Exchange demand from HBDR's parent account is made available to compete in your ad auctions. AdX line items appear inside your GAM, competing alongside your existing header bidding, direct deals, and other programmatic partners.", testid: "card-mcm-step-2" },
        { title: "You stay in control", body: "You continue to manage your own GAM — your ad units, line item priorities, targeting, reporting, and yield strategy remain entirely under your control. HBDR provides the AdX connection; you run the show.", testid: "card-mcm-step-3" },
      ])}`,
  })}

  ${renderSection({
    testid: "ma-benefits-section",
    eyebrow: "Benefits",
    title: "Why publishers choose HBDR MA.",
    lede: "Access premium Google AdX demand without changing how you run your ads.",
    body: renderFeatureRows(BENEFITS.map((b, i) => ({ ...b, testid: `account-service-card-${i}` }))),
  })}

  ${renderSection({
    testid: "ma-who-section",
    eyebrow: "Ideal for",
    title: "Who is Google MA right for?",
    body: `
      <div class="bp-grid12" data-testid="card-ma-who">
        <div class="col-span-12 lg:col-span-6 sg-prose">
          <p>HBDR Manage Account is built for publishers who already have an ad ops team (or handle their own ad operations) and simply need access to premium AdX demand. If you're comfortable managing your own Google Ad Manager but don't qualify for a direct Google Ad Exchange relationship — or if your current AdX partner isn't delivering the results you expect — HBDR MA is the solution.</p>
        </div>
        <ul class="bp-list col-span-12 lg:col-start-8 lg:col-span-5 content-start">${WHO.map((w) => `<li>${w}</li>`).join("")}</ul>
      </div>`,
  })}

  ${renderSection({
    testid: "ma-faq-section",
    eyebrow: "FAQ",
    title: "Common questions about Google MA.",
    body: renderFeatureRows(FAQ.map((f, i) => ({ title: f.q, body: f.a, testid: `ma-faq-${i}` }))),
  })}

  ${renderStatsSection()}

  ${renderCTASection("Ready to unlock AdX with HBDR Manage Account?", "Get Your MA Connection")}`;

  return renderLayout({
    title: "Manage Account (Google MA) - MCM Connection for AdX Access | HBDR",
    description: "HBDR Manage Account connects your Google Ad Manager to our parent MCM account in GAM 360, giving you premium AdX demand while you keep full control of your own GAM and ad operations. Learn about Google MA and HBDR MA.",
    ogTitle: "Google MA & HBDR MA - Manage Account MCM Connection | HBDR",
    ogDescription: "Connect to HBDR's parent MCM account in Google Ad Manager 360. Access premium AdX demand while running your own GAM. No code changes, no loss of control.",
    canonicalPath: "/solutions/manage-account",
    bodyContent: content,
  });
}
