import { renderLayout } from "../../layout";
import { renderPageHero } from "../../components/hero";
import { renderCTASection } from "../../components/cta";
import { renderEyebrow, renderSection, renderSteps } from "../../components/blueprint";

export function renderAdvertisersPage(): string {
  const dealTypes = [
    {
      title: "Private Marketplace Deals (PMPs)",
      what: "Invitation-only auctions where select advertisers bid on premium inventory before it hits the open exchange",
      benefits: [
        "Access to premium, brand-safe inventory at priority pricing",
        "Curated publisher packages by vertical (news, entertainment, sports, tech, finance, etc.)",
        "Custom audience targeting using first-party publisher data",
        "Full transparency on where your ads run",
        "Higher viewability and engagement vs. open exchange",
      ],
      how: "Work with our team to define your targeting criteria, budget, and preferred publishers. We build a custom PMP deal ID that you activate in your DSP of choice.",
    },
    {
      title: "Programmatic Guaranteed (PG)",
      what: "Fixed-price, guaranteed impressions bought programmatically — combining the efficiency of programmatic with the certainty of a direct deal",
      benefits: [
        "Guaranteed impression volume at a fixed CPM",
        "Premium placements (homepage takeovers, high-impact units, etc.)",
        "No auction competition — your creative runs guaranteed",
        "Programmatic efficiency with direct-deal certainty",
        "First-look access before PMP and open auction",
      ],
      how: "Agree on CPM, volume, targeting, and flight dates with our team. We set up the PG deal in Google Ad Manager, and you activate it in your DSP. Delivery is guaranteed.",
    },
    {
      title: "Direct Sales & Direct Placements",
      what: "Traditional direct-sold campaigns placed directly into our publishers' Google Ad Manager (GAM) accounts — no DSP required",
      benefits: [
        "Run campaigns directly in publisher GAM accounts for maximum control",
        "Custom ad formats (skins, interstitials, native, rich media, video)",
        "Sponsorship and takeover opportunities",
        "Direct relationship — no intermediary fees",
        "Custom reporting and optimization by our ad ops team",
      ],
      how: "Share your campaign brief, creative assets, and targeting requirements. Our ad operations team traffics the campaign directly into the publisher's GAM, manages delivery, provides reporting, and optimizes throughout the flight.",
    },
  ];

  const inventoryStats = [
    "1B+ impressions a month across our publisher network",
    "Display, Video, Native, and Rich Media formats available",
    "Desktop, Mobile, Tablet, CTV, and In-App inventory",
    "Premium verticals: News, Entertainment, Sports, Technology, Finance, Lifestyle, Gaming, Health",
    "Global reach with strong US, UK, EU, LATAM, and APAC coverage",
    "All inventory is ads.txt authorized and sellers.json verified",
  ];

  const brandSafetyFeatures = [
    "All publishers vetted and approved by HBDR's quality team",
    "TAG (Trustworthy Accountability Group) certified",
    "IAS and DoubleVerify integration for viewability and brand safety",
    "Full ads.txt and sellers.json compliance across all publishers",
    "Content category and keyword-level blocking available",
    "GDPR and CCPA compliant with consent management in place",
    "Transparent reporting with placement-level data",
  ];

  const steps = [
    { num: "1", title: "Share Your Brief", desc: "Tell us about your campaign goals, target audience, budget, and preferred formats" },
    { num: "2", title: "Receive a Proposal", desc: "We'll put together a custom media plan with recommended publishers, deal types, and pricing" },
    { num: "3", title: "Activate Your Campaign", desc: "We set up deal IDs or traffic your creative directly — your campaign is live within days" },
    { num: "4", title: "Optimize & Report", desc: "Our team monitors performance, provides regular reports, and optimizes for your KPIs" },
  ];

  // Each cell restates the deal copy below; nothing here goes beyond it
  const dealCompare = [
    ["How it is bought", "Invitation-only auction, ahead of the open exchange", "Fixed CPM, no auction competition", "Direct-sold campaign"],
    ["Delivery", "Priority pricing on premium inventory", "Guaranteed impression volume, first look before PMP and open auction", "Managed by our ad ops team through the flight"],
    ["Where you activate it", "Custom PMP deal ID in your DSP", "PG deal set up in Google Ad Manager, activated in your DSP", "Trafficked into the publisher's GAM, no DSP required"],
  ];

  const content = `
  ${renderPageHero("For Advertisers", "Advertiser Solutions", "Buy brand-safe publisher inventory from HBDR's network through Private Marketplace deals, Programmatic Guaranteed campaigns and direct placements.")}

  <section class="bp-section" data-testid="advertisers-intro-section">
    <div class="bp-wrap bp-grid12">
      <div class="col-span-12 lg:col-span-6">${renderEyebrow("Inventory access")}<h2 class="mt-4 text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">Access to Publisher Inventory</h2></div>
      <p class="col-span-12 lg:col-start-8 lg:col-span-5 self-end text-[var(--text-muted)] text-[1.0625rem] leading-relaxed">HBDR has managed monetization for 47,000+ sites across verticals. Advertisers can access this inventory through several buying methods — each designed to deliver performance, transparency, and brand safety.</p>
    </div>
  </section>
  ${renderSection({
    testid: "advertisers-deal-types-section",
    eyebrow: "Deal types",
    title: "Flexible Deal Structures",
    lede: "Three ways to buy the same publisher inventory, from an invitation-only auction to a campaign trafficked straight into the ad server.",
    body: `
      <div class="bp-table-wrap" data-testid="advertisers-deal-table">
        <table class="bp-table">
          <thead><tr><th scope="col"><span class="sr-only">Attribute</span></th>${dealTypes.map((d) => `<th scope="col">${d.title}</th>`).join("")}</tr></thead>
          <tbody>${dealCompare.map((r) => `
            <tr><th scope="row" class="text-[var(--text-muted)] font-medium">${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="mt-16 grid gap-0 border-t border-[var(--hairline)]">${dealTypes.map((deal, i) => `
        <article class="bp-grid12 py-10 border-b border-[var(--hairline)]" data-testid="advertiser-deal-${i}">
          <div class="col-span-12 lg:col-span-4"><span class="mono text-[var(--accent)]">${String(i + 1).padStart(2, "0")}</span><h3 class="mt-3 text-[1.35rem] leading-tight">${deal.title}</h3></div>
          <div class="col-span-12 lg:col-start-6 lg:col-span-7 grid gap-6">
            <p class="text-[var(--text-secondary)] leading-relaxed">${deal.what}</p>
            <div><h4 class="bp-eyebrow mb-4">Benefits</h4><ul class="bp-list">${deal.benefits.map((b) => `<li>${b}</li>`).join("")}</ul></div>
            <div><h4 class="bp-eyebrow mb-3">How it works</h4><p class="text-[var(--text-muted)] leading-relaxed">${deal.how}</p></div>
          </div>
        </article>`).join("")}
      </div>`,
  })}
  ${renderSection({
    testid: "advertisers-inventory-section",
    eyebrow: "Inventory",
    title: "Our Inventory at a Glance",
    body: `
      <ul class="co-defs">${inventoryStats.map((stat, i) => `
        <li data-testid="advertiser-inventory-${i}"><p>${stat}</p></li>`).join("")}
      </ul>`,
  })}
  ${renderSection({
    testid: "advertisers-brand-safety-section",
    eyebrow: "Brand safety",
    title: "Brand Safety First",
    lede: "Every layer of our platform is built with brand safety and transparency at its core.",
    body: `
      <ul class="bp-list md:grid-cols-2 md:gap-x-8 md:gap-y-4" data-testid="advertisers-brand-safety-card">${brandSafetyFeatures.map((f) => `<li>${f}</li>`).join("")}</ul>`,
  })}
  ${renderSection({
    testid: "advertisers-getting-started-section",
    eyebrow: "Process",
    title: "How to Get Started",
    body: renderSteps(steps.map((s, i) => ({ title: s.title, body: s.desc, testid: `advertiser-step-${i}` }))),
  })}
  ${renderCTASection("Ready to reach premium audiences?", "Contact Our Sales Team")}`;

  return renderLayout({
    title: "For Advertisers - HBDR",
    description: "Access premium publisher inventory through HBDR. Run PMPs, Programmatic Guaranteed deals, and direct campaigns across our network.",
    canonicalPath: "/advertisers",
    bodyContent: content,
  });
}

