// Inventory-blueprint building blocks (D-020). Content flows on hairlines; only real objects
// (tables, forms, diagrams, code, demos) get a border. Every argument is trusted template copy, not visitor input.

export interface Action { label: string; href: string; primary?: boolean; testid?: string }

const ARROW = '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

export function renderActions(actions: Action[]): string {
  return actions.map((a) => `<a href="${a.href}" class="${a.primary ? "glass-btn" : "glass-btn-outline"} text-[0.9375rem]"${a.testid ? ` data-testid="${a.testid}"` : ""}>${a.label}${a.primary ? ARROW : ""}</a>`).join("");
}

export function renderEyebrow(text: string): string {
  return `<span class="bp-eyebrow">${text}</span>`;
}

/** Page hero: eyebrow, heading left (8 cols), supporting line right (4 cols), optional actions. */
export function renderBlueprintHero(o: { eyebrow?: string; title: string; lede: string; actions?: Action[]; testid?: string }): string {
  return `
  <section class="bp-hero" data-testid="${o.testid ?? "hero"}">
    <div class="bp-wrap bp-grid12">
      ${o.eyebrow ? renderEyebrow(o.eyebrow) : ""}
      <h1>${o.title}</h1>
      <p class="bp-lede">${o.lede}</p>
      ${o.actions?.length ? `<div class="bp-actions">${renderActions(o.actions)}</div>` : ""}
    </div>
  </section>`;
}

/** Section heading: title left, supporting line right. */
export function renderSectionHead(o: { eyebrow?: string; title: string; lede?: string }): string {
  return `
      <div class="bp-head bp-grid12">
        <div>${o.eyebrow ? renderEyebrow(o.eyebrow) : ""}<h2>${o.title}</h2></div>
        ${o.lede ? `<p>${o.lede}</p>` : ""}
      </div>`;
}

/** A full section: hairline on top, wrapper, head, then body. */
export function renderSection(o: { id?: string; testid?: string; eyebrow?: string; title: string; lede?: string; body: string }): string {
  return `
  <section class="bp-section"${o.id ? ` id="${o.id}"` : ""}${o.testid ? ` data-testid="${o.testid}"` : ""}>
    <div class="bp-wrap">${renderSectionHead(o)}
      ${o.body}
    </div>
  </section>`;
}

/** Flowing feature rows instead of a card grid: index, title, body and an optional inline list. */
export function renderFeatureRows(items: { title: string; body: string; list?: string[]; testid?: string }[]): string {
  return `
      <ul class="bp-rows">${items.map((it, i) => `
        <li${it.testid ? ` data-testid="${it.testid}"` : ""}>
          <span class="bp-row-index mono">${String(i + 1).padStart(2, "0")}</span>
          <h3>${it.title}</h3>
          <div class="bp-row-body"><p>${it.body}</p>${it.list?.length ? `<ul>${it.list.map((l) => `<li>${l}</li>`).join("")}</ul>` : ""}</div>
        </li>`).join("")}
      </ul>`;
}

/** Spec list: label/value rows on hairlines. big = display-size values (company facts). */
export function renderSpecList(rows: { label: string; value: string }[], big = false): string {
  return `
      <dl class="bp-spec${big ? " bp-spec-big" : ""}">${rows.map((r) => `<div><dt>${r.label}</dt><dd>${r.value}</dd></div>`).join("")}</dl>`;
}

/** Stat row: D-005 facts on a hairline, no boxes. */
export function renderStatRow(stats: { value: string; label: string; testid?: string }[]): string {
  return `
      <div class="bp-stats" style="--cols:${stats.length}">${stats.map((s) => `
        <div${s.testid ? ` data-testid="${s.testid}"` : ""}><b>${s.value}</b><span>${s.label}</span></div>`).join("")}
      </div>`;
}

/** Diagram frame: the one bordered object; bar = [left, right] mono labels, caption below. */
export function renderDiagramFrame(o: { body: string; bar?: [string, string]; caption?: string; blueprint?: boolean; label: string; testid?: string }): string {
  return `
      <figure class="bp-frame${o.blueprint ? " bp-blueprint" : ""}" style="margin:0" aria-label="${o.label}"${o.testid ? ` data-testid="${o.testid}"` : ""}>
        ${o.bar ? `<div class="bp-frame-bar mono"><span>${o.bar[0]}</span><span>${o.bar[1]}</span></div>` : ""}
        <div class="bp-frame-body">${o.body}</div>
        ${o.caption ? `<figcaption class="mono">${o.caption}</figcaption>` : ""}
      </figure>`;
}

/** Numbered steps on one hairline; the mint progress line is animated only where GSAP is loaded. */
export function renderSteps(steps: { title: string; body: string; list?: string[]; testid?: string }[]): string {
  return `
      <div class="bp-steps" style="--cols:${steps.length}">
        <span class="bp-step-progress" aria-hidden="true"></span>${steps.map((s, i) => `
        <div class="bp-step"${s.testid ? ` data-testid="${s.testid}"` : ""}>
          <span class="mono">Step ${i + 1}</span>
          <h3>${s.title}</h3>
          <p>${s.body}</p>${s.list?.length ? `
          <ul class="bp-list">${s.list.map((l) => `<li>${l}</li>`).join("")}</ul>` : ""}
        </div>`).join("")}
      </div>`;
}

/** Closing call to action: heading left, buttons right. */
export function renderCtaBand(heading: string, actions: Action[]): string {
  return `
  <section class="bp-section" data-testid="cta-section">
    <div class="bp-wrap bp-grid12 bp-cta">
      <h2>${heading}</h2>
      <div class="bp-actions">${renderActions(actions)}</div>
    </div>
  </section>`;
}
