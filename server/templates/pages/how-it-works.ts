import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderDiagramFrame, renderFeatureRows, renderSection, renderSteps } from "../components/blueprint";

const STEPS = [
  { title: "Discovery Call", description: "We start with a comprehensive analysis of your current ad setup. Our team reviews your traffic patterns, existing demand partners, ad placement strategy, and revenue performance to identify optimization opportunities and set clear goals.", details: ["Deep dive into your current ad stack", "Traffic and audience analysis", "Revenue goal setting", "Competitive landscape review"] },
  { title: "Customized Proposal", description: "Based on our discovery findings, we create a tailored monetization strategy with detailed revenue forecasts, recommended ad configurations, and a clear implementation roadmap designed specifically for your properties.", details: ["Detailed revenue projections", "Custom ad placement strategy", "Demand partner recommendations", "Implementation timeline and milestones"] },
  { title: "Technical Implementation", description: "Our expert engineering team handles the complete integration. We configure your accounts, implement header bidding wrappers, set up analytics dashboards, and run thorough testing to ensure everything performs optimally from day one.", details: ["Header bidding code implementation", "Platform and account configuration", "Analytics dashboard setup", "Performance testing and QA"] },
];

const NEXT = [
  { title: "Ongoing Optimization", description: "Our algorithms continuously analyze auction data and adjust configurations to maximize your yield. We A/B test ad placements, floor prices, and demand partner configurations to ensure peak performance." },
  { title: "Dedicated Support", description: "Every publisher gets a dedicated account manager who monitors your performance daily, provides strategic recommendations, and is available whenever you need assistance with your ad operations." },
  { title: "Revenue Growth", description: "Through continuous optimization, new demand partner integrations, and advanced bidding strategies, we consistently drive quarter-over-quarter revenue growth for our publisher partners." },
];

const FAQS = [
  { q: "How long does integration take?", a: "Most integrations are completed within 2-4 weeks, depending on the complexity of your existing ad stack. Our engineering team handles the heavy lifting, and we work closely with your technical team to ensure a smooth transition with zero downtime." },
  { q: "Do I need to change my existing ad stack?", a: "No. HBDR works alongside your existing setup. We integrate with your current ad server and add our header bidding layer on top, complementing your existing demand sources while adding HBDR's 65+ demand sources to increase competition and revenue." },
  { q: "What's the minimum traffic requirement?", a: "We work with publishers starting at 500,000 monthly pageviews. This threshold ensures that our optimization algorithms have sufficient data to deliver meaningful revenue improvements. If you're below this threshold, reach out and we'll discuss options." },
  { q: "How is HBDR different from other solutions?", a: "Unlike traditional ad networks, HBDR uses real-time header bidding technology that creates true competition for every impression. Combined with our proprietary AI-powered bid optimization, managed Prebid server, and dedicated account management, we help publishers increase revenue by up to 50% over alternatives." },
  { q: "What kind of support do you provide?", a: "Every publisher gets a dedicated account manager who serves as your primary point of contact. You also have access to our 24/7 technical support team, detailed analytics dashboards, and regular performance review meetings to ensure your revenue goals are being met." },
];

// Questions a publisher can put to any header bidding vendor; outside facts are sourced in docs/research/how-it-works.md
const EVALUATE = [
  { title: "How the lift will be measured", body: "Ask for a split test: part of your traffic on the new setup and part on the old one, over the same days. A before-and-after comparison mixes in seasonality and news cycles. Compare revenue per session, not CPM alone: a higher CPM on a slower page can still earn less per visit." },
  { title: "Which demand, and how it connects", body: "Get the list of SSPs and exchanges, and for each one whether it bids in the browser (Prebid.js), from a server (Prebid Server), through Google Open Bidding or through Amazon's TAM or UAM. Browser bidders add page weight; server bidders add a network hop." },
  { title: "The exact ads.txt lines", body: "Every line the proposal asks you to add should match a seller ID in that exchange's sellers.json. DIRECT is only for accounts you control. An account a partner controls is RESELLER, whatever the partner asks for." },
  { title: "Timeout and floor settings", body: "Ask for the auction timeout, the Prebid Server timeout and the floor method, with the reason for each. The basics are below." },
  { title: "Page experience, before and after", body: "Agree a Core Web Vitals baseline from field data before launch. Good is LCP within 2.5 s, INP of 200 ms or less and CLS of 0.1 or less. INP replaced First Input Delay as a Core Web Vital in March 2024." },
  { title: "Consent handling", body: "Ask what happens to requests without consent. For EEA, UK and Swiss traffic, Google Ad Manager uses the TCF string from a certified CMP; for US states it reads GPP." },
  { title: "Who owns what if you leave", body: "Name who owns the ad server network, the line items, the demand accounts and the ads.txt lines, and what stays with you on exit." },
];

const BASICS = [
  { title: "Auction timeout", body: "How long Prebid.js waits for bids before it calls the ad server. Too short and bidders miss the auction; too long and readers leave before the ad loads. Prebid's guidance is that each publisher sets its own value from time on page, direct sell-through, the value of each channel and its users' network delay. The timeout explorer on the home page shows the trade-off." },
  { title: "Prebid Server timeout", body: "Set below the auction timeout, so server-side bids get back to the page in time. Prebid suggests 50–75% of the auction timeout; its default is 75%." },
  { title: "Failsafe timeout", body: "A plain JavaScript timer, much longer than the auction timeout, that calls the ad server anyway if something breaks." },
  { title: "When bidders time out", body: "Look at timeouts by region first: a bidder hosted far from your readers answers late. Then measure how long the CMP, user ID modules and real-time data modules hold the auction before any bid request goes out." },
  { title: "Price floors", body: "A floor is the lowest bid you accept. Prebid advises against static floors: they are blunt and go stale. Its Price Floors module sets floors by ad unit, GPT slot, media type, size or domain, and a skip rate leaves a share of auctions without floors as an A/B test." },
  { title: "Ad Manager pricing rules", body: "Unified pricing rules in Google Ad Manager also apply to Price Priority line items, header bidding trafficking and Open Bidding. Where two rules overlap, the higher price wins, so an old rule can block bids you meant to take." },
];

// The integration from the FAQ drawn as a flow: HBDR's header bidding layer sits between the page and the ad server you already run
const PARTNERS: [string, string, boolean][] = [["Existing demand source", "already connected", false], ["New demand partner", "added by HBDR", true], ["Existing demand source", "already connected", false], ["New demand partner", "added by HBDR", true]];
const py = (i: number) => 70 + i * 100;
function renderFlow(): string {
  const partners = PARTNERS.map(([name, sub, added], i) => `
          <rect class="${added ? "co-node" : "co-node-dash"}" x="520" y="${py(i)}" width="200" height="60" rx="4"/>
          <text class="co-title" x="536" y="${py(i) + 26}">${name}</text><text class="co-sub" x="536" y="${py(i) + 46}">${sub}</text>
          <path class="co-flow" d="M430 240 C 475 240, 475 ${py(i) + 30}, 520 ${py(i) + 30}" marker-end="url(#hiw-arrow)"/>
          <path class="co-flow-back" d="M720 ${py(i) + 30} C 765 ${py(i) + 30}, 765 240, 800 240" marker-end="url(#hiw-arrow)"/>`).join("");
  const caps = [[95, "01 · page loads"], [330, "02 · one request to all"], [620, "03 · partners bid"], [895, "04 · best price wins"], [1085, "05 · ad renders"]];
  return `
        <svg class="co-wide" viewBox="0 0 1160 520" role="img" aria-label="The page loads and calls HBDR's header bidding layer, which sends one request to every demand partner at once, existing sources and new partners alike; their bids go to your existing ad server together, the highest price wins and the ad renders">
          <defs><marker id="hiw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="co-arrow" d="M0 0 L10 5 L0 10 Z"/></marker></defs>
          <rect class="co-node" x="20" y="195" width="150" height="90" rx="4"/>
          <text class="co-title" x="36" y="232">Your page</text><text class="co-sub" x="36" y="256">ad slot loads</text>
          <path class="co-flow" d="M170 240 H228" marker-end="url(#hiw-arrow)"/>
          <rect class="co-node-hi" x="230" y="170" width="200" height="140" rx="4"/>
          <text class="co-title" x="248" y="208">HBDR header</text><text class="co-title" x="248" y="228">bidding layer</text>
          <text class="co-sub co-hi" x="248" y="262">wrapper on the page</text><text class="co-sub co-hi" x="248" y="282">managed Prebid server</text>
          ${partners}
          <rect class="co-node" x="800" y="185" width="190" height="110" rx="4"/>
          <text class="co-title" x="816" y="222">Your ad server</text><text class="co-sub" x="816" y="246">current setup</text><text class="co-sub" x="816" y="266">highest bid serves</text>
          <path class="co-flow" d="M990 240 H1028" marker-end="url(#hiw-arrow)"/>
          <rect class="co-node" x="1030" y="210" width="112" height="60" rx="4"/>
          <text class="co-title" x="1046" y="245">Ad renders</text>
          <path class="bp-line" d="M20 470 H1142"/><path class="bp-tick" d="M20 462 V478 M1142 462 V478"/>
          ${caps.map(([x, t]) => `<text class="bp-label" x="${x}" y="504" text-anchor="middle" style="font-size:13px">${t}</text>`).join("")}
        </svg>`;
}

export function renderHowItWorksPage(): string {
  const chevron = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>';
  const content = `
  ${renderPageHero("Our Process", "How It Works", "Three steps from first call to launch, what to check in a proposal, and the timeout and floor settings that decide what a header bidding setup earns.")}
  ${renderSection({
    testid: "hiw-steps-section",
    eyebrow: "Getting Started",
    title: "Three Simple Steps",
    lede: "Have these ready: access to your ad server, your current ads.txt file, your consent platform and a few test pages.",
    body: renderSteps(STEPS.map((s, i) => ({ title: s.title, body: s.description, list: s.details, testid: `hiw-step-card-${i}` }))),
  })}
  ${renderSection({
    testid: "hiw-flow-section",
    eyebrow: "Integration",
    title: "Your stack stays. HBDR adds the auction.",
    lede: "We integrate with your current ad server and add our header bidding layer on top, so new demand partners compete alongside the sources you already have.",
    body: renderDiagramFrame({
      label: "How an impression flows once HBDR is integrated",
      blueprint: true,
      bar: ["impression flow", "after integration"],
      caption: "Schematic. Partner count is illustrative; your setup decides the real list.",
      body: renderFlow(),
      testid: "hiw-flow-diagram",
    }),
  })}
  ${renderSection({
    testid: "hiw-evaluate-section",
    eyebrow: "Evaluating a proposal",
    title: "What to check in any header bidding proposal",
    lede: "The same questions apply to HBDR or any other vendor. Get each answer in writing before you sign.",
    body: renderFeatureRows(EVALUATE.map((e, i) => ({ title: e.title, body: e.body, testid: `hiw-evaluate-${i}` }))),
  })}
  ${renderSection({
    testid: "hiw-basics-section",
    eyebrow: "Basics",
    title: "Timeouts and floors in plain terms",
    lede: "Two settings decide most of what an auction earns: how long it waits for bids, and the lowest bid it accepts.",
    body: `${renderFeatureRows(BASICS.map((b, i) => ({ title: b.title, body: b.body, testid: `hiw-basics-${i}` })))}
      <p class="mt-8 mono text-[0.75rem] text-[var(--text-muted)]">Sources: Prebid.org, Timeouts and Price Floors Module; Google Ad Manager Help, unified pricing rules and GPP; web.dev, Web Vitals and INP.</p>
      <p class="mt-4"><a href="/#how" class="text-sm text-[var(--text-secondary)] hover:text-white inline-flex items-center gap-1.5" data-testid="link-timeout-explorer">Open the timeout explorer <span aria-hidden="true">→</span></a></p>`,
  })}
  ${renderSection({
    testid: "hiw-next-section",
    eyebrow: "After Launch",
    title: "What Happens Next",
    lede: "Our partnership doesn't end at implementation. Here's how we continue to drive results.",
    body: renderFeatureRows(NEXT.map((n, i) => ({ title: n.title, body: n.description, testid: `hiw-next-card-${i}` }))),
  })}
  ${renderSection({
    testid: "hiw-faq-section",
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    lede: "Common questions about working with HBDR.",
    body: `
      <div class="co-faq" x-data="{ openFaq: null }">${FAQS.map((faq, i) => `
        <div data-testid="faq-card-${i}">
          <button type="button" @click="openFaq === ${i} ? openFaq = null : openFaq = ${i}" :aria-expanded="openFaq === ${i}" aria-expanded="false" data-testid="faq-toggle-${i}">
            <span>${faq.q}</span>
            <span :class="openFaq === ${i} ? 'rotate-180' : ''" class="inline-flex transition-transform duration-300">${chevron}</span>
          </button>
          <div x-show="openFaq === ${i}" x-cloak x-transition.opacity.duration.200ms>
            <p class="co-answer">${faq.a}</p>
          </div>
        </div>`).join("")}
      </div>`,
  })}
  ${renderCTASection("Ready to get started?", "Contact Us")}`;

  return renderLayout({
    title: "How It Works - HBDR",
    description: "Learn how HBDR's simple 3-step process helps publishers maximize ad revenue through header bidding and advanced monetization.",
    canonicalPath: "/how-it-works",
    bodyContent: content,
  });
}
