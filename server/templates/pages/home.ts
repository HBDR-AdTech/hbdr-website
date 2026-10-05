import { renderLayout } from "../layout";
import { renderContactFormSection } from "../components/contact-form";

export function renderPage(): string {
  const homepageContent = `

  <!-- ========== HERO ========== -->
  <section class="relative overflow-hidden hero-glow" data-testid="hero-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pt-44 lg:pb-24">
      <div class="glass-tag mb-8" style="animation: fadeInUp 0.5s var(--ease-out) both">25+ Years of Combined Team Expertise</div>

      <h1 class="text-[2.5rem] leading-[1.08] sm:text-6xl lg:text-[4.5rem] lg:leading-[1.02] font-display max-w-5xl mb-6" style="animation: fadeInUp 0.6s 0.05s var(--ease-out) both">
        <span class="text-gradient">Maximize Your</span>
        <span class="text-gradient-accent">Ad Revenue</span><br class="hidden sm:block" />
        <span class="text-gradient">with Header Bidding</span>
      </h1>

      <p class="text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed mb-10 max-w-xl" style="animation: fadeInUp 0.6s 0.1s var(--ease-out) both">
        HBDR delivers enterprise-grade ad monetization solutions that help publishers increase revenue by up to 50%.
      </p>

      <div class="flex flex-wrap items-center gap-3" style="animation: fadeInUp 0.6s 0.15s var(--ease-out) both">
        <a href="/contact" class="glass-btn text-[0.9375rem]" data-testid="button-hero-get-started">
          Get Started Free
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
        <a href="/how-it-works" class="glass-btn-outline text-[0.9375rem]" data-testid="button-hero-learn">
          Learn More
        </a>
      </div>

      <div class="grid grid-cols-3 max-w-lg mt-14 divide-x divide-white/[0.08]" style="animation: fadeInUp 0.6s 0.2s var(--ease-out) both">
        <div class="pr-6">
          <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums" data-testid="text-stat-revenue"><span data-count="50" data-suffix="%+">50%+</span></div>
          <div class="text-xs sm:text-sm text-[var(--text-muted)] mt-1">Revenue Increase</div>
        </div>
        <div class="px-6">
          <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums" data-testid="text-stat-publishers"><span data-count="500" data-suffix="+">500+</span></div>
          <div class="text-xs sm:text-sm text-[var(--text-muted)] mt-1">Publishers</div>
        </div>
        <div class="pl-6">
          <div class="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums" data-testid="text-stat-impressions"><span data-count="1" data-suffix="B+">1B+</span></div>
          <div class="text-xs sm:text-sm text-[var(--text-muted)] mt-1">Monthly Impressions</div>
        </div>
      </div>

      <!-- Product panel: Linear-style app window -->
      <div class="relative mt-16 lg:mt-20" style="animation: fadeInUp 0.8s 0.25s var(--ease-out) both">
        <div class="rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden" data-testid="hero-dashboard">
          <div class="flex items-center justify-between h-11 px-4 border-b border-white/[0.06]">
            <div class="flex items-center gap-2 text-[0.8125rem]">
              <span class="text-[var(--text-muted)]">HBDR</span>
              <span class="text-white/20">/</span>
              <span class="text-white font-medium">Revenue Dashboard</span>
            </div>
            <span class="flex items-center gap-2 text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              <span class="text-[var(--text-secondary)]">Live</span>
            </span>
          </div>
          <div class="grid md:grid-cols-[200px_1fr]">
            <div class="hidden md:block border-r border-white/[0.06] p-3 space-y-0.5 text-[0.8125rem]" aria-hidden="true">
                <div class="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.05] text-white"><span class="w-3.5 h-3.5 rounded-[4px] border border-[var(--accent)] bg-[var(--accent)]/20"></span>Overview</div>
                <div class="flex items-center gap-2 px-2 py-1.5 rounded-md text-[var(--text-muted)]"><span class="w-3.5 h-3.5 rounded-[4px] border border-white/20"></span>Demand Partners</div>
                <div class="flex items-center gap-2 px-2 py-1.5 rounded-md text-[var(--text-muted)]"><span class="w-3.5 h-3.5 rounded-[4px] border border-white/20"></span>Ad Units</div>
                <div class="flex items-center gap-2 px-2 py-1.5 rounded-md text-[var(--text-muted)]"><span class="w-3.5 h-3.5 rounded-[4px] border border-white/20"></span>Floors</div>
                <div class="flex items-center gap-2 px-2 py-1.5 rounded-md text-[var(--text-muted)]"><span class="w-3.5 h-3.5 rounded-[4px] border border-white/20"></span>Reports</div>
            </div>
            <div class="p-4 sm:p-6">
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div class="metric-card">
                    <div class="text-[var(--text-muted)] text-xs mb-1.5">Today's Revenue</div>
                    <div class="text-lg font-semibold text-white tabular-nums"><span data-count="12847" data-prefix="$">$12,847</span></div>
                    <div class="text-[var(--accent)] text-xs mt-1 tabular-nums">+23%</div>
                  </div>
                  <div class="metric-card">
                    <div class="text-[var(--text-muted)] text-xs mb-1.5">Fill Rate</div>
                    <div class="text-lg font-semibold text-white tabular-nums"><span data-count="94.2" data-suffix="%">94.2%</span></div>
                    <div class="text-[var(--accent)] text-xs mt-1 tabular-nums">+5.1%</div>
                  </div>
                  <div class="metric-card">
                    <div class="text-[var(--text-muted)] text-xs mb-1.5">eCPM</div>
                    <div class="text-lg font-semibold text-white tabular-nums"><span data-count="4.82" data-prefix="$">$4.82</span></div>
                    <div class="text-[var(--accent)] text-xs mt-1 tabular-nums">+18%</div>
                  </div>
                  <div class="metric-card">
                    <div class="text-[var(--text-muted)] text-xs mb-1.5">Impressions</div>
                    <div class="text-lg font-semibold text-white tabular-nums"><span data-count="2.7" data-suffix="M">2.7M</span></div>
                    <div class="text-[var(--accent)] text-xs mt-1 tabular-nums">+31%</div>
                  </div>
              </div>
              <div class="rounded-lg border border-white/[0.06] p-4">
                <div class="text-[0.8125rem] text-white font-medium mb-4">Revenue</div>
                <div class="bar-chart" x-data x-init="$nextTick(() => { $el.querySelectorAll('div').forEach((b, i) => { b.style.height = b.dataset.h }) })">
                    <div data-h="40%" style="height: 0%"></div>
                    <div data-h="65%" style="height: 0%"></div>
                    <div data-h="45%" style="height: 0%"></div>
                    <div data-h="80%" style="height: 0%"></div>
                    <div data-h="55%" style="height: 0%"></div>
                    <div data-h="90%" style="height: 0%"></div>
                    <div data-h="70%" style="height: 0%"></div>
                    <div data-h="85%" style="height: 0%"></div>
                    <div data-h="60%" style="height: 0%"></div>
                    <div data-h="95%" style="height: 0%"></div>
                    <div data-h="75%" style="height: 0%"></div>
                    <div data-h="88%" style="height: 0%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--surface)] to-transparent"></div>
      </div>
    </div>
  </section>


  <!-- ========== LOGO CAROUSEL ========== -->
  <section class="py-16 lg:py-20 overflow-hidden border-t border-white/[0.06]" data-testid="logo-carousel">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <p class="text-center text-[var(--text-muted)] text-sm animate-on-scroll">
        Integrated Demand Partners
      </p>
    </div>
    <div class="space-y-3">
      ${(() => {
        const row1 = [
          { name: "Verve" },
          { name: "AppLovin" },
          { name: "Sovrn" },
          { name: "Xandr" },
          { name: "OpenX" },
          { name: "Index Exchange" },
          { name: "Magnite" },
          { name: "Google AdX" },
          { name: "TripleLift" },
          { name: "ShareThrough" },
          { name: "Equativ" },
        ];
        const row2 = [
          { name: "BidSwitch" },
          { name: "InMobi" },
          { name: "Amazon Publisher Services" },
          { name: "Taboola" },
          { name: "Dianomi" },
          { name: "Criteo" },
          { name: "PubMatic" },
          { name: "MGID" },
          { name: "Digital Turbine" },
          { name: "Liftoff" },
          { name: "Bidmachine" },
        ];
        const row3 = [
          { name: "Affinity Global" },
          { name: "Pubpower" },
          { name: "AdMile" },
          { name: "Mobilefuse" },
          { name: "Bigo Ads" },
          { name: "Nexxen" },
          { name: "Freewheel" },
          { name: "Beachfront" },
          { name: "Playbuzz" },
          { name: "Amagi" },
          { name: "MediaFuse" },
        ];
        const row4 = [
          { name: "Mintegral" },
          { name: "Improve Digital" },
          { name: "Algorix" },
          { name: "Edge226" },
          { name: "SportX" },
          { name: "Unity Technology" },
          { name: "Perion" },
          { name: "Optima" },
          { name: "Seedtag" },
          { name: "Sun Media" },
          { name: "TaurusX" },
        ];
        const row5 = [
          { name: "SilverMob" },
          { name: "CPMStar" },
          { name: "LoopMe" },
          { name: "TopOn" },
          { name: "Actirise" },
          { name: "Gadsme" },
          { name: "Nimbus Ads" },
          { name: "Pixalate" },
          { name: "Media.net" },
          { name: "AdYouLike" },
          { name: "33Across" },
        ];
        const row6 = [
          { name: "Gannett" },
          { name: "Teads.tv" },
          { name: "ConnectAd" },
          { name: "Vistar Media" },
          { name: "GumGum" },
          { name: "Nativo Edge" },
          { name: "E-Planning" },
          { name: "AdMob" },
          { name: "AdColony" },
          { name: "Adform" },
          { name: "Kevel" },
          { name: "Underdog Media" },
        ];

        const renderPartnerCard = (p: {name: string}) => `
          <div class="flex-shrink-0 mx-1.5">
            <div class="px-3.5 py-2 flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <div class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-semibold bg-white/[0.06] text-[var(--text-secondary)]" aria-hidden="true">${p.name.substring(0, 2).toUpperCase()}</div>
              <span class="text-sm font-medium text-[var(--text-muted)] whitespace-nowrap">${p.name}</span>
            </div>
          </div>`;

        const renderRow = (partners: typeof row1, scrollClass: string) => `
          <div class="relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[var(--surface)] to-transparent z-10"></div>
            <div class="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[var(--surface)] to-transparent z-10"></div>
            <div class="flex ${scrollClass}" style="width: max-content;">
              ${[...partners, ...partners].map(renderPartnerCard).join("")}
            </div>
          </div>`;

        return renderRow(row1, "logo-scroll") +
               renderRow(row2, "logo-scroll-reverse") +
               renderRow(row3, "logo-scroll") +
               renderRow(row4, "logo-scroll-reverse") +
               renderRow(row5, "logo-scroll") +
               renderRow(row6, "logo-scroll-reverse");
      })()}
    </div>
  </section>

  <div class="section-divider max-w-5xl mx-auto"></div>


  <!-- ========== SOLUTIONS ========== -->
  <section id="solutions" class="py-24 lg:py-32" data-testid="services-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-14 lg:mb-16 animate-on-scroll">
        <div class="glass-tag mb-6">Our Solutions</div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display mb-6">
          <span class="text-gradient">Complete Ad Monetization</span><br/>
          <span class="text-gradient-accent font-display">Platform</span>
        </h2>
        <p class="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          From header bidding to CTV, we provide end-to-end solutions to maximize your advertising revenue.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${[
          {
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>',
            title: "Header Bidding",
            description: "Advanced header bidding that creates open auctions, allowing multiple advertisers to bid simultaneously on your inventory.",
            features: ["Real-time bidding", "Premium demand", "Higher CPMs"],
            href: "/solutions/header-bidding",
          },
          {
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>',
            title: "Display Advertising",
            description: "Website display ad monetization with smart layouts that maximize revenue while preserving user experience.",
            features: ["Smart layouts", "Viewability optimization", "Brand safety"],
            href: "/solutions/display-ads",
          },
          {
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>',
            title: "In-App Monetization",
            description: "Mobile app advertising solutions including banner, native, video, and app open ads with Google AdX integration.",
            features: ["Native formats", "Rewarded video", "Open bidding"],
            href: "/solutions/in-app-ads",
          },
          {
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
            title: "CTV Monetization",
            description: "Connected-TV advertising solutions to capture the growing streaming audience with premium video inventory.",
            features: ["SSAI support", "Premium buyers", "Cross-platform"],
            href: "/solutions/ctv-ott",
          },
          {
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>',
            title: "Video Ad Solutions",
            description: "Comprehensive video ad solutions including instream, outstream, and interactive formats for maximum engagement.",
            features: ["VAST/VPAID", "High viewability", "Engagement metrics"],
            href: "/solutions/video-player",
          },
          {
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
            title: "Advanced Analytics",
            description: "Detailed metrics on partner-level performance, auction data, and A/B testing capabilities for optimization.",
            features: ["Real-time data", "Custom reports", "Revenue insights"],
            href: "/dashboard",
          },
        ]
          .map(
            (s, i) => `
        <a href="${s.href}" class="glass-card p-7 group animate-scale-in stagger-${i + 1} block" data-testid="card-service-${i}">
          <div class="icon-tile mb-5">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${s.icon}</svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">${s.title}</h3>
          <p class="text-[var(--text-muted)] mb-5 leading-relaxed text-[0.9375rem]">${s.description}</p>
          <ul class="space-y-2 mb-5">
            ${s.features.map((f) => `<li class="flex items-center gap-2.5 text-sm text-[var(--text-muted)]"><div class="w-1 h-1 rounded-full bg-white/40"></div>${f}</li>`).join("")}
          </ul>
          <div class="flex items-center gap-1.5 text-[var(--text-secondary)] text-sm font-medium group-hover:text-white transition-colors">
            Learn more
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </div>
        </a>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <div class="section-divider max-w-5xl mx-auto"></div>


  <!-- ========== COMPARISON TABLE ========== -->
  <section class="py-24 lg:py-32" data-testid="comparison-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 *:max-w-5xl">
      <div class="mb-14 lg:mb-16 animate-on-scroll">
        <div class="glass-tag mb-6">Why HBDR</div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight mb-6 text-gradient">
          The HBDR Advantage
        </h2>
        <p class="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          See how HBDR compares to the usual alternatives.
        </p>
      </div>

      <div class="glass-card overflow-hidden animate-on-scroll" data-testid="comparison-table">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/5">
                <th class="text-left p-4 lg:p-5 text-sm font-semibold text-white/60">Features</th>
                <th class="p-4 lg:p-5 text-center">
                  <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-sm font-semibold">HBDR</span>
                </th>
                <th class="p-4 lg:p-5 text-center text-sm text-[var(--text-muted)] font-medium">Typical Ad Network</th>
                <th class="p-4 lg:p-5 text-center text-sm text-[var(--text-muted)] font-medium">DIY In-House Setup</th>
              </tr>
            </thead>
            <tbody>
              ${[
                ["Header Bidding Implementation", true, true, false],
                ["Managed Prebid Server", true, false, false],
                ["In-App SDK (Desktop & Mobile)", true, "partial", false],
                ["Real-Time Analytics Dashboard", true, true, true],
                ["Dynamic Floor Pricing", true, false, false],
                ["Custom Video Player", true, "partial", false],
                ["CTV & OTT Support", true, false, false],
                ["24/7 Technical Support", true, true, "partial"],
                ["Dedicated Account Manager", true, false, false],
                ["Revenue Guarantee", true, false, false],
              ]
                .map(
                  (row, i) => `
              <tr class="border-t border-white/5 comparison-row ${i % 2 === 0 ? "" : "bg-white/[0.02]"}" style="transition-delay: ${i * 0.08}s" data-testid="comparison-row-${i}">
                <td class="p-4 lg:p-5 text-sm font-medium text-white/80">${row[0]}</td>
                ${[row[1], row[2], row[3]]
                  .map((val) => {
                    if (val === true) return '<td class="p-4 lg:p-5 text-center"><span class="check-icon check-animate"><svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span></td>';
                    if (val === false) return '<td class="p-4 lg:p-5 text-center"><span class="x-icon"><svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></span></td>';
                    return '<td class="p-4 lg:p-5 text-center"><span class="partial-icon"><svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg></span></td>';
                  })
                  .join("")}
              </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider max-w-5xl mx-auto"></div>


  <!-- ========== HOW IT WORKS ========== -->
  <section id="how-it-works" class="py-24 lg:py-32" data-testid="how-it-works-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-14 lg:mb-16 animate-on-scroll">
        <div class="glass-tag mb-6">Simple Process</div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight mb-6 text-gradient">
          How It Works
        </h2>
        <p class="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Getting started with HBDR is simple. Our streamlined process gets you monetizing faster.
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-4 relative">
        ${[
          {
            step: "01",
            title: "Discovery Call",
            description: "We analyze your current ad setup, identify optimization opportunities, and discuss revenue goals in a comprehensive discovery call.",
            details: ["Analyze current ad stack", "Identify opportunities", "Discuss revenue goals"],
          },
          {
            step: "02",
            title: "Customized Proposal",
            description: "Based on our discovery, we create a tailored proposal with revenue forecasts, ad placement strategy, and implementation roadmap.",
            details: ["Revenue projections", "Ad placement strategy", "Implementation timeline"],
          },
          {
            step: "03",
            title: "Technical Implementation",
            description: "Our expert team handles the complete integration, configuring accounts, implementing code, and ensuring smooth performance.",
            details: ["Code implementation", "Platform configuration", "Performance monitoring"],
          },
        ]
          .map(
            (step, i) => `
        <div class="glass-card p-8 relative animate-scale-in stagger-${i + 1}" data-testid="step-card-${i}">
          <div class="step-number mb-6">${step.step}</div>
          <h3 class="text-lg font-semibold text-white mb-3">${step.title}</h3>
          <p class="text-[var(--text-muted)] mb-6 leading-relaxed text-[0.9375rem]">${step.description}</p>
          <ul class="space-y-3">
            ${step.details
              .map(
                (d) => `
            <li class="flex items-center gap-3 text-sm text-[var(--text-muted)]">
              <svg class="w-4 h-4 text-[var(--accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              ${d}
            </li>`
              )
              .join("")}
          </ul>
        </div>`
          )
          .join("")}
      </div>

      <div class="mt-12 animate-on-scroll">
        <a href="/contact" class="glass-btn text-[0.9375rem]" data-testid="button-start-journey">
          Start Your Journey
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </div>
    </div>
  </section>


  <!-- ========== STATS ========== -->
  <section id="about" class="py-24 lg:py-32" data-testid="stats-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-14 lg:mb-16 animate-on-scroll">
        <div class="glass-tag mb-6">Our Impact</div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight mb-6">
          <span class="text-gradient">Delivering Results</span> <span class="text-gradient-accent">at Scale</span>
        </h2>
        <p class="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Numbers that speak for themselves.
        </p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08] rounded-xl overflow-hidden">
        ${[
          { count: "1", suffix: "T+", label: "Ads Served", sub: "And counting every second" },
          { count: "50", suffix: "%+", label: "Revenue Increase", sub: "Average publisher improvement" },
          { count: "1", suffix: "B+", label: "Monthly Impressions", sub: "Across all platforms" },
          { count: "500", suffix: "+", label: "Publishers", sub: "Trust us worldwide" },
        ]
          .map(
            (stat, i) => `
        <div class="bg-[var(--surface)] p-6 sm:p-8 animate-scale-in stagger-${i + 1}" data-testid="stat-card-${i}">
          <div class="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-3 tabular-nums">
            <span data-count="${stat.count}" data-suffix="${stat.suffix}">${stat.count}${stat.suffix}</span>
          </div>
          <div class="text-sm font-medium text-white mb-1">${stat.label}</div>
          <div class="text-sm text-[var(--text-muted)]">${stat.sub}</div>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <div class="section-divider max-w-5xl mx-auto"></div>


  <!-- ========== TESTIMONIALS ========== -->
  <section class="py-24 lg:py-32" data-testid="testimonials-section"
           x-data="{
             current: 0,
             testimonials: [
               { quote: 'HBDR has been the behind-the-scenes engine powering billions of monthly impressions across our sites. I never have to worry about scaling or downtime \\u2014 it just works flawlessly.', author: 'Sarah Chen', title: 'VP of Revenue Operations', company: 'TechMedia Group', initials: 'SC' },
               { quote: 'Working with HBDR has been a game-changer for us. We managed to boost our RPMs by 56%, and it has been a huge lifesaver for our ad operations team.', author: 'Michael Torres', title: 'Director of Ad Monetization', company: 'Digital Publishing Co', initials: 'MT' },
               { quote: 'Considering HBDR? Know this: Their team is committed to delivering the best results for your organization, actively working to continually enhance performance.', author: 'Emily Richardson', title: 'Head of Publisher Solutions', company: 'Content Network Inc', initials: 'ER' },
               { quote: 'Working with HBDR has been an eye-opener for our business. Not only has performance substantially improved, but our understanding of the marketplace has as well.', author: 'David Park', title: 'CEO', company: 'Mobile Media Labs', initials: 'DP' },
               { quote: 'Working with HBDR has been the single most impactful decision I have ever made for my business. There is not a single company that would not benefit from working with them.', author: 'Jessica Martinez', title: 'Founder', company: 'Gaming Publishers United', initials: 'JM' }
             ],
             next() { this.current = (this.current + 1) % this.testimonials.length },
             prev() { this.current = (this.current - 1 + this.testimonials.length) % this.testimonials.length },
             autoplay: null,
             startAutoplay() { this.autoplay = setInterval(() => this.next(), 6000) },
             stopAutoplay() { if (this.autoplay) clearInterval(this.autoplay) }
           }"
           x-init="startAutoplay()"
           @mouseenter="stopAutoplay()"
           @mouseleave="startAutoplay()">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 *:max-w-5xl">
      <div class="mb-14 lg:mb-16 animate-on-scroll">
        <div class="glass-tag mb-6">Testimonials</div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight mb-6 text-gradient">
          What Publishers Say
        </h2>
        <p class="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Don't just take our word for it.
        </p>
      </div>

      <div class="relative">
        <div class="glass-card p-8 sm:p-12" data-testid="testimonial-card">
          <svg class="w-8 h-8 text-white/15 mb-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z"/>
          </svg>

          <div class="relative min-h-[320px] sm:min-h-[180px]">
            <template x-for="(t, index) in testimonials" :key="index">
              <div x-show="current === index"
                   x-transition:enter="transition ease-out duration-500"
                   x-transition:enter-start="opacity-0 translate-x-8"
                   x-transition:enter-end="opacity-100 translate-x-0"
                   x-transition:leave="transition ease-in duration-300"
                   x-transition:leave-start="opacity-100 translate-x-0"
                   x-transition:leave-end="opacity-0 -translate-x-8"
                   class="absolute inset-0">
                <blockquote class="text-xl sm:text-2xl text-white leading-snug tracking-tight mb-8" x-text="'&ldquo;' + t.quote + '&rdquo;'"></blockquote>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[var(--text-secondary)] font-medium text-sm" x-text="t.initials"></div>
                  <div>
                    <div class="font-semibold text-white" x-text="t.author"></div>
                    <div class="text-sm text-[var(--text-muted)]" x-text="t.title"></div>
                    <div class="text-sm text-[var(--text-muted)]" x-text="t.company"></div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="flex items-center justify-center gap-4 mt-8">
          <button @click="prev()" class="glass-card w-10 h-10 flex items-center justify-center !rounded-full cursor-pointer" data-testid="button-prev-testimonial" style="border-radius: 50%;">
            <svg class="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>

          <div class="flex gap-2">
            <template x-for="(_, index) in testimonials" :key="index">
              <button @click="current = index"
                      :class="current === index ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-white/20 hover:bg-white/40'"
                      class="h-2 rounded-full transition-all duration-300 cursor-pointer"
                      :data-testid="'testimonial-dot-' + index"></button>
            </template>
          </div>

          <button @click="next()" class="glass-card w-10 h-10 flex items-center justify-center !rounded-full cursor-pointer" data-testid="button-next-testimonial" style="border-radius: 50%;">
            <svg class="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider max-w-5xl mx-auto"></div>

  ${renderContactFormSection()}`;

  return renderLayout({
    title: "HBDR - Header Bidding & Ad Monetization Solutions",
    description: "HBDR delivers enterprise-grade ad monetization and header bidding solutions. Maximize your ad revenue with our cutting-edge platform.",
    ogTitle: "HBDR - Header Bidding & Ad Monetization Solutions",
    ogDescription: "Maximize your ad revenue with HBDR's enterprise-grade header bidding platform.",
    canonicalPath: "/",
    bodyContent: homepageContent,
  });
}
