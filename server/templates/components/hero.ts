export function renderPageHero(tag: string, title: string, description: string): string {
  return `
  <section class="relative overflow-hidden hero-glow pt-36 pb-20 lg:pt-44 lg:pb-24 border-b border-white/[0.06]" data-testid="hero">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="glass-tag mb-6" style="animation: fadeInUp 0.5s var(--ease-out) both">${tag}</div>
      <h1 class="text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.05] font-display mb-6 max-w-4xl" style="animation: fadeInUp 0.6s 0.05s var(--ease-out) both">
        ${title}
      </h1>
      <p class="text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed max-w-2xl" style="animation: fadeInUp 0.6s 0.1s var(--ease-out) both">
        ${description}
      </p>
    </div>
  </section>`;
}
