import { renderLayout } from "../../layout";
import { renderPageHero } from "../../components/hero";
import { renderStatsSection } from "../../components/stats";
import { renderCTASection } from "../../components/cta";
import { renderFeatureRows, renderSection } from "../../components/blueprint";

export function renderPublishersPage(): string {
  const valueProps = [
    { title: "No Upfront Costs", desc: "Zero setup fees, no minimums. We invest in your success from day one." },
    { title: "Revenue Guarantee", desc: "We don't get paid unless your revenue increases. Our success is tied to yours." },
    { title: "Full Transparency", desc: "Real-time dashboard, detailed reporting, and complete visibility into every impression." },
    { title: "Dedicated Support", desc: "Your own account manager who understands your business and goals." },
    { title: "No Lock-In Contracts", desc: "Month-to-month agreements. Stay because of results, not because of contracts." },
    { title: "Enterprise Technology", desc: "The same ad stack used by the largest publishers in the world, available to everyone." },
  ];

  const onboardingSteps = [
    { num: "1", title: "Discovery Call", subtitle: "15-30 min", bullets: [
      "We learn about your site(s), traffic, current monetization setup, and goals",
      "No obligation, no pressure \u2014 just a conversation",
      "We'll give you an honest assessment of your revenue potential",
    ]},
    { num: "2", title: "Site Audit & Revenue Analysis", subtitle: "", bullets: [
      "Our team analyzes your current ad setup, page speed, and revenue data",
      "We identify optimization opportunities and projected revenue uplift",
      "You receive a detailed proposal with expected results",
    ]},
    { num: "3", title: "Technical Integration", subtitle: "", bullets: [
      "We handle all the technical work \u2014 you don't need developers",
      "We add our optimized ad tags to your Google Ad Manager (GAM) account",
      "If you don't have GAM, we set one up for you at no cost",
      "Average integration time: 2-3 business days",
    ]},
    { num: "4", title: "Testing & Optimization", subtitle: "", bullets: [
      "We run A/B tests to find the optimal ad configuration for your site",
      "Header bidding connections are activated and tuned",
      "We monitor performance closely during the first 2-4 weeks",
    ]},
    { num: "5", title: "Go Live & Ongoing Optimization", subtitle: "", bullets: [
      "Your optimized setup goes fully live",
      "Revenue dashboard access is activated with real-time data",
      "Continuous optimization \u2014 we never stop improving your performance",
      "Regular check-ins with your dedicated account manager",
    ]},
  ];

  const hbdrManages = [
    "Header bidding setup & optimization",
    "Demand partner management",
    "Ad layout & placement optimization",
    "Floor price optimization",
    "Page speed monitoring",
    "Ad quality & brand safety",
    "Revenue reporting & analytics",
    "GAM account management",
    "Consent management integration",
    "Ads.txt & sellers.json management",
  ];

  const youDo = [
    "Continue creating great content",
    "Approve ad placements on your site",
    "Review your revenue dashboard",
    "That's it \u2014 we handle everything else",
  ];

  const requirements = [
    { title: "Quality Content", desc: "Original, regularly updated content that provides value to readers" },
    { title: "Minimum Traffic", desc: "Generally 500,000+ monthly pageviews (we make exceptions for high-quality niche sites)" },
    { title: "Clean Traffic", desc: "Legitimate, organic traffic without bots or invalid activity" },
    { title: "Google Compliance", desc: "Site must comply with Google Ad Manager and AdSense policies" },
    { title: "User Experience", desc: "Willingness to maintain a good user experience alongside monetization" },
  ];

  const pubFaqs = [
    { q: "How much does it cost to work with HBDR?", a: "Nothing upfront. HBDR operates on a revenue-share model. We take a percentage of the incremental revenue we generate \u2014 meaning we only make money when you make more money. There are no setup fees, no monthly minimums, and no hidden charges." },
    { q: "Will HBDR's ads slow down my site?", a: "No. We prioritize page speed and use lazy loading, asynchronous ad loading, and optimized code to minimize any impact. Most publishers see no change in Core Web Vitals after integration. The three Core Web Vitals are LCP (good within 2.5 s), INP (200 ms or less; it replaced First Input Delay in March 2024) and CLS (0.1 or less). Reserving each ad slot's height in CSS is the main defence against layout shift." },
    { q: "Do I need a Google Ad Manager (GAM) account?", a: "Not necessarily. If you already have one, we integrate directly into it. If you don't, we can set one up for you at no cost as part of our onboarding process." },
    { q: "Can I keep my existing ad partners?", a: "Absolutely. We work alongside your existing setup and add our demand on top. We never ask you to remove existing revenue sources unless they're actively hurting performance." },
    { q: "What if I'm not happy with the results?", a: "We operate on month-to-month agreements with no lock-in contracts. If you're not seeing the results you want, you can part ways at any time. That said, our publisher retention rate is over 95% because we deliver." },
    { q: "How quickly will I see revenue improvements?", a: "Most publishers see measurable improvements within the first 2-4 weeks. Full optimization typically takes 30-60 days as we run tests and tune the setup for your specific audience and content." },
    { q: "What kind of reporting do I get?", a: "You get access to our real-time analytics dashboard with breakdowns by ad unit, geography, device, demand source, and more. We also provide weekly and monthly summary reports." },
    { q: "Do you work with sites outside the US?", a: "Yes. We work with publishers globally and have demand partners that cover traffic from virtually every country." },
  ];

  // Site preparation any header bidding setup needs; outside facts are sourced in docs/research/publishers.md
  const prepare = [
    { title: "Clean up ads.txt", body: "Post ads.txt at the root of your domain, and on subdomains that serve ads. One line per seller account: DIRECT only for accounts you control, RESELLER for accounts a partner controls. Remove lines for partners you no longer use, add OWNERDOMAIN (ads.txt 1.1) with your own business domain, and never geofence the file.", list: ["Root domain /ads.txt", "DIRECT vs RESELLER", "OWNERDOMAIN", "No geofence"] },
    { title: "Apps: app-ads.txt", body: "For apps, the same file lives on the developer website named in your Google Play and App Store listings. Google cannot find the file if the listing names no developer website." },
    { title: "Consent", body: "EEA, UK and Swiss traffic needs a certified CMP sending TCF v2.3 strings; v2.3 has been mandatory since 28 February 2026. US traffic should carry GPP, which replaced the US Privacy String in January 2024. California treats Global Privacy Control as an opt-out of sale and sharing." },
    { title: "Page experience baseline", body: "Record your Core Web Vitals from field data before any change, so you can compare after launch. Reserve each slot's size with CSS min-height and min-width, and keep fluid slots below the fold or fetch them early." },
    { title: "Ad density", body: "On mobile, the Coalition for Better Ads standard flags pages where ads take up more than 30% of the vertical height of the main content. Every format counts, and each sticky ad counts once." },
    { title: "Child-directed content", body: "If any section is aimed at children, flag it so its requests carry the COPPA flag. Under the FTC's amended COPPA Rule (compliance date 22 April 2026), a child's data needs separate parental consent before it goes to ad networks." },
  ];

  const CHECK = '<svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Yes"><path d="M5 13l4 4L19 7"/></svg>';
  const owner = (testid: string, items: string[], hbdr: boolean) => `
            <tbody data-testid="${testid}">${items.map((item) => `
              <tr><td>${item}</td>${hbdr ? `<td class="us">${CHECK}</td><td class="no"><span aria-label="No">—</span></td>` : `<td class="no"><span aria-label="No">—</span></td><td>${CHECK}</td>`}</tr>`).join("")}
            </tbody>`;
  const chevron = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>';

  const content = `
  ${renderPageHero("For Publishers", "Publisher Solutions", "What HBDR needs from your site, what to prepare before onboarding, who does what, and how the first weeks run. HBDR works with sites from 500,000 monthly pageviews.")}
  ${renderSection({
    testid: "publishers-why-section",
    eyebrow: "Why HBDR",
    title: "Why Publishers Choose HBDR",
    body: renderFeatureRows(valueProps.map((v, i) => ({ title: v.title, body: v.desc, testid: `publisher-value-${i}` }))),
  })}
  ${renderSection({
    testid: "publishers-onboarding-section",
    eyebrow: "Onboarding",
    title: "Getting Started Is Simple",
    lede: "Our onboarding process is designed to be fast and hassle-free. Most publishers are live within 5-7 business days.",
    body: `
      <ul class="bp-rows co-stack">${onboardingSteps.map((step, i) => `
        <li data-testid="onboarding-step-${i}">
          <span class="bp-row-index mono">${step.num.padStart(2, "0")}</span>
          <h3>${step.title}${step.subtitle ? `<span class="co-when mono">${step.subtitle}</span>` : ""}</h3>
          <div class="bp-row-body"><ul>${step.bullets.map((b) => `<li>${b}</li>`).join("")}</ul></div>
        </li>`).join("")}
      </ul>`,
  })}
  ${renderSection({
    testid: "publishers-handle-section",
    eyebrow: "Who does what",
    title: "We Do the Heavy Lifting",
    lede: youDo[youDo.length - 1] + ".",
    body: `
      <div class="bp-table-wrap">
        <table class="bp-table compare-table co-owner">
          <caption class="sr-only">Who handles each part of running your ads</caption>
          <thead><tr><th scope="col">Task</th><th scope="col" class="us">HBDR</th><th scope="col">You</th></tr></thead>${owner("publishers-hbdr-manages", hbdrManages, true)}${owner("publishers-you-do", youDo.slice(0, -1), false)}
        </table>
      </div>`,
  })}
  ${renderSection({
    testid: "publishers-requirements-section",
    eyebrow: "Requirements",
    title: "Who We Work With",
    lede: "HBDR works with publishers from 500,000 monthly pageviews, from independent sites to enterprise media companies. Here's what we look for:",
    body: renderFeatureRows(requirements.map((r, i) => ({ title: r.title, body: r.desc, testid: `publisher-req-${i}` }))),
  })}
  ${renderSection({
    testid: "publishers-prepare-section",
    eyebrow: "Before you start",
    title: "Prepare your site",
    lede: "Six checks that pay off with any header bidding partner. Each one is quicker to fix before launch than after.",
    body: `${renderFeatureRows(prepare.map((r, i) => ({ title: r.title, body: r.body, list: r.list, testid: `publisher-prepare-${i}` })))}
      <p class="mt-8 mono text-[0.75rem] text-[var(--text-muted)]">Sources: IAB Tech Lab, ads.txt 1.1; Google Ad Manager Help, ads.txt and GPP; Google AdMob Help, app-ads.txt; IAB Europe, TCF v2.3; IAB Tech Lab, USPrivacy; California Privacy Protection Agency; web.dev; Google Publisher Tag, minimize layout shift; Coalition for Better Ads; Federal Register, COPPA Rule.</p>`,
  })}
  ${renderSection({
    testid: "publishers-faq-section",
    eyebrow: "FAQ",
    title: "Common Publisher Questions",
    body: `
      <div class="co-faq" x-data="{ openFaq: null }">${pubFaqs.map((faq, i) => {
        const faqId = `pub-faq-${i}`;
        return `
        <div data-testid="${faqId}">
          <button type="button" @click="openFaq = openFaq === '${faqId}' ? null : '${faqId}'" :aria-expanded="openFaq === '${faqId}'" aria-expanded="false" data-testid="button-${faqId}">
            <span>${faq.q}</span>
            <span :class="openFaq === '${faqId}' ? 'rotate-180' : ''" class="inline-flex transition-transform duration-300">${chevron}</span>
          </button>
          <div x-show="openFaq === '${faqId}'" x-cloak x-transition.opacity.duration.200ms>
            <p class="co-answer">${faq.a}</p>
          </div>
        </div>`;
      }).join("")}
      </div>`,
  })}
  ${renderStatsSection()}
  ${renderCTASection("Ready to grow your ad revenue?", "Get Started")}`;

  return renderLayout({
    title: "For Publishers - HBDR",
    description: "Everything publishers need to know about partnering with HBDR. From onboarding to optimization, we make ad monetization simple.",
    canonicalPath: "/publishers",
    bodyContent: content,
  });
}

