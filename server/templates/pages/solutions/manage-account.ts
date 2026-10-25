import { renderLayout } from "../../layout";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";
import { renderBlueprintHero, renderDiagramFrame, renderEyebrow, renderFeatureRows, renderSection, renderSteps } from "../../components/blueprint";

const BENEFITS = [
  { title: "Premium AdX access", body: "Gain access to Google Ad Exchange's premium programmatic demand through HBDR's parent MCM account. AdX bids compete in your Ad Manager's unified auction through dynamic allocation, beside your line items and header bidding demand, so every impression has one more strong buyer." },
  { title: "Your account stays yours", body: "Under Manage Account the inventory is managed in your own Google Ad Manager network. Your ad units, tags and reports stay where they are, and you keep access to every setting. HBDR works in the account with edit access; Google keeps your billing information out of the parent's view." },
  { title: "Revenue lift", body: "Publishers can see a revenue lift of up to 50% once AdX competes for their inventory. AdX fills impressions that your existing partners miss and adds bid pressure to every auction." },
  { title: "Unified reporting", body: "Google shows all Manage Account reporting in your own network, so AdX revenue sits beside your other demand sources in your own Ad Manager reports, broken down by ad unit, geography, device, and more." },
  { title: "No technical overhead", body: "Because the inventory stays in your network, your pages keep their existing Ad Manager tags (Google: child publishers “use their own Ad Manager tags”), so there is no retagging. The link is made inside Google Ad Manager: HBDR sends the invitation and an admin on your network accepts it." },
  { title: "Dedicated support", body: "Every HBDR MA publisher gets a dedicated account manager who monitors AdX performance, handles policy compliance, keeps the HBDR entries in your ads.txt current, and reviews performance with you." },
];

const WHO = [
  "Publishers with their own GAM who need AdX access",
  "Sites with 500,000+ monthly pageviews seeking higher CPMs",
  "Teams that want to keep their own ad units, tags and reports",
  "Publishers switching from underperforming MCM partners",
  "Multi-site networks looking for a single AdX connection",
  "Publishers who want reporting to stay in their own network",
];

const FAQ = [
  { q: "What does 'Manage Account' mean in Google Ad Manager?", a: "Manage Account is one of the two delegation types in Google's Multiple Customer Management (MCM) program. The child publisher grants account access to the parent publisher, and the inventory is managed in the child's account. Google gives the parent access to the child account except billing information, the child keeps permissions and access to all settings, and all reporting is shown in the child's network." },
  { q: "Will HBDR have access to my GAM?", a: "Yes, edit access: that is what Manage Account means in Google's definition. HBDR can work on the inventory in your network but cannot see your billing information, and you keep admin access to every setting. If you want a parent with no access to your account, that is Google's other delegation type, Manage Inventory." },
  { q: "How is Google MA different from Manage Inventory?", a: "Under Manage Account, HBDR works inside your Ad Manager network, and the inventory, tags and reports stay there. Under Manage Inventory, you delegate specific inventory to the parent, which manages it in its own network with no access to yours: your pages carry the parent's tags with your child network code, and reporting shows in the parent's network. A child can have one Manage Account parent and up to 15 Manage Inventory parents, but not the same parent under both types. HBDR's service scope under each is compared on the <a href=\"/solutions/manage-inventory#compare\">Manage Inventory page</a>." },
  { q: "How quickly can I get started with HBDR MA?", a: "Once your site is approved, HBDR sends the MCM invitation; average go-live is 1–3 business days, depending on your current setup and Google's review. After an admin on your network accepts it, Google reviews the child account, and AdX demand usually begins flowing within a few days once that review is complete." },
  { q: "What are the revenue share terms?", a: "HBDR is paid through a revenue share on the revenue it is part of, from HBDR's own ad units up to the whole page. Contact us for the share for your traffic and inventory. There is no setup fee and no lock-in by default; sites need 500,000+ monthly pageviews. Under Manage Account, Google can route Ad Exchange earnings to the parent through payment facilitation, so check the share the MCM invitation sets before you accept it." },
];

// Manage Account (Google MCM): the inventory stays in the child network; HBDR reaches in with edit access and AdX arrives over the link (the one mint path)
const INPUTS: [string, number, boolean?][] = [["Header bidding", 96], ["Direct deals", 164], ["Google AdX via HBDR", 232, true], ["Programmatic partners", 300]];
const LINK_SVG = `
          <svg viewBox="0 0 960 440" role="img" aria-label="HBDR's Google Ad Manager 360 parent network has edit access to the publisher's own Google Ad Manager over the Manage Account link, without billing access. AdX demand competes there with header bidding, direct deals and programmatic partners in one unified auction. Ad units, tags, reports and settings stay in the publisher's network.">
            <rect class="sg-node" x="24" y="172" width="250" height="120" rx="6"/>
            <text class="sg-name" x="149" y="212" text-anchor="middle">HBDR parent network</text>
            <text class="sg-sub" x="149" y="234" text-anchor="middle">Google Ad Manager 360</text>
            <text class="sg-sub" x="149" y="262" text-anchor="middle">Edit access · no billing view</text>
            <path class="sg-flow sg-flow-hi" d="M274 232 H430"/><path class="sg-tick sg-tick-hi" d="M274 224 V240 M430 224 V240"/>
            <text class="sg-tag sg-tag-hi" x="337" y="220" text-anchor="middle">MCM link</text>
            <text class="sg-tag" x="337" y="258" text-anchor="middle">AdX demand</text>
            <rect class="sg-zone" x="400" y="24" width="536" height="392" rx="10"/>
            <text class="sg-tag" x="430" y="54">Your Google Ad Manager · inventory managed here</text>
            ${INPUTS.map(([name, cy, hi]) => `<rect class="${hi ? "sg-node-hi" : "sg-node"}" x="430" y="${cy - 24}" width="240" height="48" rx="6"/>
            <text class="sg-name" x="550" y="${cy + 5}" text-anchor="middle" style="font-size:15px">${name}</text>
            <path class="sg-flow${hi ? " sg-flow-hi" : ""}" d="M670 ${cy} H700"/>`).join("\n            ")}
            <path class="sg-flow" d="M700 96 V300 M700 215 H730"/><path class="sg-tick" d="M730 207 V223"/>
            <rect class="sg-node" x="730" y="156" width="180" height="118" rx="6"/>
            <text class="sg-name" x="820" y="206" text-anchor="middle">Unified auction</text>
            <text class="sg-sub" x="820" y="228" text-anchor="middle">More competition for</text>
            <text class="sg-sub" x="820" y="246" text-anchor="middle">every impression</text>
            <path class="sg-zone" d="M430 348 H910"/>
            <text class="sg-tag" x="430" y="376">Stays in your network</text>
            <text class="sg-sub" x="430" y="398">Ad units · tags · reports · settings · your admin access</text>
          </svg>`;

export function renderManageAccountPage(): string {
  const content = `
  ${renderBlueprintHero({
    eyebrow: "Solutions",
    title: "Manage Account (Google MA)",
    lede: "Connect to HBDR's parent MCM account in Google Ad Manager 360 and unlock premium AdX demand. Your inventory, tags and reports stay in your own Google Ad Manager network.",
    actions: [
      { label: "Get Your MA Connection", href: "/contact", primary: true, testid: "button-hero-cta" },
      { label: "See how the link works", href: "#structure", testid: "button-hero-learn" },
    ],
  })}

  <section class="bp-section" data-testid="account-overview-section">
    <div class="bp-wrap bp-grid12 sg-split" data-testid="card-account-overview">
      <div class="col-span-12 lg:col-span-5 grid gap-5 content-start">${renderEyebrow("Google MA · MCM connection")}<h2>What is HBDR Manage Account?</h2></div>
      <div class="col-span-12 lg:col-start-7 lg:col-span-6 sg-prose">
        <p>HBDR Manage Account (MA) is a <strong>Multiple Customer Management (MCM)</strong> relationship inside <strong>Google Ad Manager 360</strong>. Your Google Ad Manager network becomes a child of HBDR's parent network, and that link gives your site access to <strong>Google Ad Exchange (AdX)</strong> premium programmatic demand through HBDR — demand that is otherwise unavailable to publishers who don't meet Google's direct AdX eligibility requirements.</p>
        <p>Manage Account is the MCM delegation type in which <strong>the child grants the parent access to its account</strong>. In Google's definition, the inventory is managed in the child's account, the parent has access to it except billing information, the child keeps permissions and access to all settings, and all reporting is shown in the child's network. Your ad units, tags and reports stay where they are.</p>
        <p>Before you accept any MCM invitation, check two things in it: the delegation type (Manage Account or Manage Inventory), and the revenue share it sets for payments Google routes to the parent. A child can have only one Manage Account parent, so switching partners means ending the current link first.</p>
      </div>
    </div>
  </section>

  ${renderSection({
    id: "structure",
    testid: "mcm-structure-section",
    eyebrow: "How it works",
    title: "The MCM parent-child structure.",
    lede: "HBDR is the parent network, yours is the child, and the inventory stays in your account.",
    body: `
      <div class="sg-diagram mb-16">${renderDiagramFrame({
        label: "Diagram of a Manage Account MCM link",
        testid: "ma-link-diagram",
        blueprint: true,
        bar: ["Manage Account", "MCM link · inventory in your network"],
        body: LINK_SVG,
        caption: "Schematic: under Manage Account the inventory is managed in your network; HBDR works there with edit access and no billing view.",
      })}
      </div>${renderSteps([
        { title: "MCM invitation", body: "HBDR sends a Manage Account invitation from our Google Ad Manager 360 parent network to yours. An admin on your network accepts it inside your own Ad Manager, and Google then reviews the child account.", testid: "card-mcm-step-1" },
        { title: "AdX demand flows in", body: "Once the link is active, Google Ad Exchange competes for your inventory through dynamic allocation. Ad Manager compares the AdX bid with your best eligible line item and your header bidding demand in one unified auction; AdX adds no line items to your network.", testid: "card-mcm-step-2" },
        { title: "You keep your account", body: "Your ad units, tags, reports and settings stay in your network, and you keep admin access to all of them. HBDR works in the account with edit access and no view of your billing information.", testid: "card-mcm-step-3" },
      ])}
      <p class="mono mt-10 text-[var(--text-muted)]" data-testid="ma-source">Source: Google Ad Manager Help, About Multiple Customer Management and Manage Account (retrieved October 2026).</p>`,
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
          <p>HBDR Manage Account is built for publishers who already run their own Google Ad Manager network and want to keep it: the inventory, tags and reports stay in your account while HBDR works inside it. If you don't qualify for a direct Google Ad Exchange relationship — or if your current AdX partner isn't delivering the results you expect — HBDR MA is the solution.</p>
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
    description: "HBDR Manage Account links your Google Ad Manager to our parent MCM account in GAM 360 for premium AdX demand. Under Google's Manage Account type, your inventory, tags and reports stay in your own network.",
    ogTitle: "Google MA & HBDR MA - Manage Account MCM Connection | HBDR",
    ogDescription: "Connect to HBDR's parent MCM account in Google Ad Manager 360. Access premium AdX demand while your inventory stays in your own GAM. No code changes, no retagging.",
    canonicalPath: "/solutions/manage-account",
    bodyContent: content,
  });
}
