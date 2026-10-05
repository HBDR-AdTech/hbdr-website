export function renderStatsSection(): string {
  return `
  <section class="py-24 lg:py-32" data-testid="stats-section">
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

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08] rounded-xl overflow-hidden"
           x-data="{ shown: false }"
           x-intersect:enter="shown = true">
        ${[
          { value: "1T+", label: "Ads Served", sub: "And counting every second" },
          { value: "50%+", label: "Revenue Increase", sub: "Average publisher improvement" },
          { value: "1B+", label: "Monthly Impressions", sub: "Across all platforms" },
          { value: "500+", label: "Publishers", sub: "Trust us worldwide" },
        ]
          .map(
            (stat, i) => `
        <div class="bg-[var(--surface)] p-6 sm:p-8 animate-on-scroll stagger-${i + 1}" data-testid="stat-card-${i}">
          <div class="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-3 tabular-nums"
               x-show="shown"
               x-transition:enter="transition ease-out duration-700"
               x-transition:enter-start="opacity-0 translate-y-3"
               x-transition:enter-end="opacity-1 translate-y-0"
               style="transition-delay: ${i * 150}ms">
            ${stat.value}
          </div>
          <div class="text-sm font-medium text-white mb-1">${stat.label}</div>
          <div class="text-sm text-[var(--text-muted)]">${stat.sub}</div>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}
