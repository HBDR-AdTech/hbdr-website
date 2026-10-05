export function renderCTASection(heading: string, buttonText: string): string {
  return `
  <section class="py-24 lg:py-32 border-t border-white/[0.06]" data-testid="cta-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 animate-on-scroll">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display text-gradient max-w-2xl">${heading}</h2>
      <a href="/contact" class="glass-btn text-[0.9375rem] self-start lg:self-auto" data-testid="button-cta">
        ${buttonText}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
    </div>
  </section>`;
}
