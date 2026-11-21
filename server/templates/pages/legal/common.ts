// Shared frame for the three legal pages: the facts every page states (D-032) and the contents list
// whose links must reach their numbered sections (resources-pages.test.ts).
import { CONTACT_EMAIL } from "../../../config";

export const LEGAL_ENTITY = "HeaderBiddr LLC";
export const LEGAL_ADDRESS = "1200 Brickell Ave, Ste 1950, Miami, FL 33131";
export const LEGAL_UPDATED = "2026-10-23";

export interface LegalSection { id: string; title: string; testid: string; body: string }

export const p = (text: string) => `<p class="text-[var(--text-muted)] leading-relaxed mb-4">${text}</p>`;
export const list = (items: string[]) => `<ul class="list-disc pl-6 text-[var(--text-muted)] space-y-2 mb-6">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
export const link = (href: string, text: string, testid?: string) =>
  `<a href="${href}" class="text-[var(--accent)] underline underline-offset-2"${testid ? ` data-testid="${testid}"` : ""}>${text}</a>`;
export const mail = (testid: string) => link(`mailto:${CONTACT_EMAIL}`, CONTACT_EMAIL, testid);

/** A bordered table is a real object (D-020 rule 2); rows are trusted template copy. */
export function table(o: { testid?: string; head: string[]; rows: string[][]; mono?: number[] }): string {
  return `
        <div class="bp-table-wrap">
          <table class="bp-table"${o.testid ? ` data-testid="${o.testid}"` : ""}>
            <thead><tr>${o.head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>
            <tbody>${o.rows.map((r) => `
              <tr>${r.map((cell, i) => `<td${o.mono?.includes(i) ? ' class="mono"' : ""}>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>`;
}

export function contactBlock(emailTestid: string): string {
  return `
        <div class="space-y-3 text-[var(--text-muted)]">
          <p><strong class="text-white/80">${LEGAL_ENTITY}</strong></p>
          <p>${LEGAL_ADDRESS}</p>
          <p>Email: ${mail(emailTestid)}</p>
        </div>`;
}

export function renderLegalDoc(o: { testid: string; updatedTestid: string; intro: string; sections: LegalSection[] }): string {
  const num = (i: number) => String(i + 1).padStart(2, "0");
  return `
  <section class="bp-section legal" data-testid="${o.testid}">
    <div class="bp-wrap bp-grid12">
      <nav class="legal-toc" aria-label="On this page">
        <span class="bp-eyebrow">Contents</span>
        <ol>${o.sections.map((s, i) => `
          <li><a href="#${s.id}"><span class="mono">${num(i)}</span>${s.title}</a></li>`).join("")}
        </ol>
      </nav>
      <div class="legal-doc">
      <div class="legal-intro" data-testid="${o.updatedTestid}">
        <p class="text-[var(--text-muted)] text-sm">Last updated: <time class="mono" datetime="${LEGAL_UPDATED}">${LEGAL_UPDATED}</time></p>
        <p class="text-[var(--text-muted)] mt-4 leading-relaxed">${o.intro}</p>
      </div>
${o.sections.map((s, i) => `
      <section class="legal-sec" id="${s.id}" data-testid="${s.testid}">
        <h2><span class="mono">${num(i)}</span>${s.title}</h2>
        ${s.body}
      </section>`).join("")}
      </div>
    </div>
  </section>`;
}
