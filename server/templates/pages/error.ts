import { renderLayout } from "../layout";

export function render404Page(): string {
  const links = [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions/header-bidding" },
    { label: "Publishers", href: "/publishers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Tools", href: "/tools" },
  ];

  const linkGrid = links.map(link => `
        <li><a href="${link.href}" data-testid="link-404-${link.label.toLowerCase()}"><span>${link.label}</span><span class="mono">${link.href}</span></a></li>`).join("");

  const content = `
  <section class="bp-hero err-hero" data-testid="error-404">
    <div class="bp-wrap bp-grid12">
      <span class="bp-eyebrow">Error <span class="mono">404</span></span>
      <h1>Page Not Found</h1>
      <p class="bp-lede">The page you're looking for doesn't exist or has been moved. Here are some helpful links to get you back on track.</p>
      <ul class="err-links">${linkGrid}
      </ul>
      <div class="bp-actions">
        <a href="/" class="glass-btn text-[0.9375rem]" data-testid="link-404-home-btn">Go to Homepage</a>
      </div>
    </div>
  </section>`;

  return renderLayout({
    title: "Page Not Found - HBDR",
    description: "The page you're looking for doesn't exist. Navigate back to HBDR's homepage or explore our solutions.",
    bodyContent: content,
  });
}

export function render500Page(): string {
  const content = `
  <section class="bp-hero err-hero" data-testid="error-500">
    <div class="bp-wrap bp-grid12">
      <span class="bp-eyebrow">Error <span class="mono">500</span></span>
      <h1>Something Went Wrong</h1>
      <p class="bp-lede">We're experiencing a temporary issue. Please try again in a moment, or reach out to our support team if the problem persists.</p>
      <div class="bp-actions">
        <a href="/" class="glass-btn text-[0.9375rem]" data-testid="link-500-home">Go to Homepage</a>
        <a href="/support" class="glass-btn-outline text-[0.9375rem]" data-testid="link-500-support">Contact Support</a>
      </div>
    </div>
  </section>`;

  return renderLayout({
    title: "Server Error - HBDR",
    description: "Something went wrong. Please try again or contact our support team.",
    bodyContent: content,
  });
}
