# HBDR Website Handoff — 005 — 2026-10-16 (blueprint redesign live on every page; #21 → #22 → #23 merged)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-004.md (plan and authority for the sitewide blueprint redesign).
> Append-only / numbered / immutable.

## Next turn

- **Operator (Matt):** confirm the lead email "TEST Deploy Check (blueprint redesign)" (sent 2026-10-16 19:05 UTC) arrived in contact@hbdr.com. The row is in prod D1 (§2). The email goes out in `waitUntil` after the insert, and the Gmail connector was not connected this session.
- **Matt decides the copy contradictions in §5.** Then fix them on `fix/content-claims` (this branch) as one code PR, with a test that fails if the old wording returns.
- **Operator (carried from HANDOFF-003/004):**
  - Turnstile switch-on at `/admin/form`: site key `0x4AAAAAAFWkEWJNRrR2hyVh`, then one live test lead.
  - DNSSEC DS at the registrar: check with `dig +short DS hbdr.com @a.gtld-servers.net`.
- **Optional, needs Matt's OK (it would be agents 6 and 7, beyond the 5 approved):** Impeccable finish reviewer and documenter. The documenter writes DESIGN.md, local only.
- **Follow-up design work, if Matt wants it:** mobile versions of the side-by-side diagrams. At 390px they scroll sideways inside their frame with a cue (§3), rather than restacking.

---

## 1 · Current state

- **Branch:** `main` at `dd3f455` (merge of #23); this handoff is on `fix/content-claims`
- **Tests:** 228 / 228 passing (was 161 at HANDOFF-004); `npm run check` clean
- **Production:** deploy run `38952113779` succeeded for `dd3f455` (hbdr.com). Runs `38952063548` (#22) and `38952012515` (#21) succeeded before it.
- **Migrations:** unchanged, through 0005; this session added none
- **PRs:** #21, #22, #23 merged (merge commits `909611f`, `83a73ed`, `dd3f455`). No PRs open.

## 2 · What just shipped

### Phase 1: design system and home (`3783fb7`)
- **Fonts:** Archivo for display (expanded widths), Inter for body, Geist Mono for measurements. Loaded in `server/templates/layout.ts`.
- **Shared blocks:** `server/templates/components/blueprint.ts`, with `bp-*` classes at the end of `src/styles/main.css`.
- **Legacy helpers:** `renderPageHero`, `renderCTASection` and `renderStatsSection` now delegate to the blueprint blocks, so every page got the new hero, CTA and stats at once.
- **Home** (`server/templates/pages/home.ts`), rebuilt from `docs/design/home-blueprint.html`:
  - Inventory-sheet hero, with the auction on GSAP (D-022).
  - Integrated Demand Partners grid with all 67 names from the old marquee, not the 22 in PRODUCT.md.
  - Tabbed format stage, impression timeline and comparison table.
  - Steps, company facts and the contact form.
  - Testimonials removed (D-021).
- **Hero stats:** 50%+ / 500+ / 1B+ (the old facts), not the mockup's "22 demand partners".

### Phase 2: 4 builders in parallel
Each builder worked in its own worktree beside the repo, and each was merged with `--no-ff`:
- **B1** (`2b19561`): media solution pages.
- **B2** (`524e205`): Google solution pages.
- **B3** (`972184c`): company and audience pages.
- **B4** (`44ae5b4`): careers, press, contact, support, blog, legal, error and tools.

Each group:
- got its own stylesheet (`src/styles/pages/*.css`) and its own test file (`server/routes/__tests__/{solutions-media,solutions-google,company-pages,resources-pages}.test.ts`).
- Kept every route and `data-testid`; B3 checked 213/213 and B4 checked 318/318 against baseline dumps.
- Added one teaching object per page (diagram or spec table, labelled "Example data" or "Schematic").

The builder brief is at `.git/blueprint-builder-brief.md` (local only).

### Integration (`5a73adb`, `71a8c7d`, `ef10ed2`)
- **Sitewide test:** `server/routes/__tests__/blueprint.test.ts` fails if any informational page has `glass-card`, `icon-tile` or `glass-tag` outside a form.
- **Deleted:** the old scroll-reveal observer, counters, marquee, icon tiles, tag pills and step badges. That is about 250 lines with no users, and the reveal hid text until scroll.
- **A11y fixes from Lighthouse:**
  - Footer column headings changed from h4 to h2.
  - In-text accent links are now underlined.
- **Skeptic fixes:**
  - Home ticks and timeline lines are no longer hidden before scroll.
  - Overflowing diagrams and tables get a scroll cue on narrow screens.
  - The stats label "50%+ … up to" is back to "Revenue increase".
  - `/admin/blog` headings stay Inter.

### Live smoke / verification
- **Skeptic agent** on all 29 routes at 1440 and 390:
  - Zero JS errors and zero CSP violations.
  - No page-level horizontal scroll.
  - Reduced motion: no animations, and one "SOLD $4.86" (screenshots byte-identical 4 s apart).
  - Copy diff against main: no new factual claims.
  - Forms through `wrangler dev --local` with migrations 0001-0005: home and /support rows read back from D1 exactly as typed.
  - Its screenshots are in `.shots/skeptic/` (git-ignored).
- **Production (hbdr.com) after deploy:**
  - All 28 routes return 200 (404 for the missing page) with `bp-wrap` and no tag pills or icon tiles.
  - A blog post renders.
  - The CSP includes cdnjs, and GSAP from cdnjs passes its SRI check: `window.gsap` and `ScrollTrigger` are present in a real browser and the auction is running.
  - `styles.css` is served `max-age=0, must-revalidate`.
- **Live D-011 lead.** Submitted through the browser on hbdr.com. Prod D1 read-back: `SELECT … FROM contact_leads ORDER BY rowid DESC LIMIT 1`, rows_read 1:

  | field | value |
  |---|---|
  | name | TEST Deploy Check (blueprint redesign) |
  | email | matt@hbdr.com |
  | company | HBDR internal test |
  | impressions | 10m-50m |
  | inventory_types | Website |
  | property | hbdr.com |
  | ads_txt_url | https://hbdr.com/ads.txt |
  | current_setup | Google AdSense |
  | source | contact |
  | created_at | 2026-10-16T19:05:10.775Z |

  Inbox arrival is not confirmed (Next turn).
- **Lighthouse 12** (local Node server, simulated throttling). The preview is behind Access, so Lighthouse there scores the login page.

  | | perf | LCP | CLS |
  |---|---|---|---|
  | main `/` mobile (2 runs) | 80, 86 | 4.1 s, 3.6 s | 0 |
  | branch `/` mobile (2 runs) | 91, 76 | 2.9 s, 4.2 s | 0.057 |

  - Home JS 60 KB (GSAP is +42 KB, home only).
  - Fonts 158 KB on every page (+111 KB).
  - a11y 96-98, best practices 100, SEO 100.

## 3 · Architecture decisions worth remembering

- **GSAP loads only on pages that ask for it:** `renderLayout({ gsap: true })` (D-022). The SRI hashes are pinned in `GSAP_SCRIPTS`. A version bump needs new hashes: `curl -s <url> | openssl dgst -sha384 -binary | openssl base64 -A`.
- **Animations reset only when they start.** Any element that animates in must stay in its finished state until its trigger fires; the replay starts with `fromTo` inside `onEnter`. Hiding at load time breaks crawlers, print and full-page captures, and D-020 rule 4.
- **Narrow-screen diagrams scroll; they don't restack.** Wide diagrams and tables scroll inside `.bp-frame-body` / `.bp-table-wrap`. A layout script (`SCROLL_HINT` in `layout.ts`) adds "Scroll sideways for the full diagram →" only while the element overflows; CSS adds edge shadows under 960px. Redrawing each diagram for mobile is the larger alternative, not done.
- **Admin keeps Inter:** `body.is-admin`, set by `adminPage: true`. `/admin/blog` does not pass `adminPage` (pre-existing), so its h1s carry `font-sans`.
- **Page-group stylesheets** are imported at the top of `main.css`. Shared rules come later and win a tie, so a group rule must be more specific to override a `bp-*` rule.
- **Chrome flag here:** the headless Chrome on beast needs `--no-sandbox` (agent-browser: `--args "--no-sandbox"`).
- **Dev cache:** the dev server caches `styles.css` for a day (`server/index.ts:50`), so close the browser session after a CSS rebuild. Production revalidates every time.
- **Blocked ports:** Chrome refuses 5060/5061 (SIP).

## 4 · Open work

- **Reconciling HANDOFF-004's plan:**
  - Phase 1: done.
  - Phase 2: done.
  - Phase 3 steps 1, 2, 4 and 5: done.
  - Phase 3 step 3 (Impeccable finish reviewer and documenter): not run. It would exceed the 5-agent approval; Matt decides.
- **Done on our side, blocked on the operator:**
  - Inbox confirmation of the test lead.
  - Turnstile switch-on.
  - DNSSEC DS.
- **Agent cost:** unknown. `agent-usage --project hbdr-website` returned no data this session, and there is no per-agent cost readout here. Matt can read it in `/cost` or the console.
- **Stale dev server:** a dev server from 2026-10-15 is still listening on 127.0.0.1:5000 (pid 2877148, old code, `tsx server/index.ts` in this repo). It was left running; stop it before using port 5000.

## 5 · Open questions for the operator

All of these were already on main before this session; the redesign kept the wording (D-005 rule: no copy changes without Matt).

1. `/advertisers` says "thousands of premium publisher sites". Replace it with 500+ (D-005)?
2. `/about` says "average revenue increase of over 50%". Change it to "up to 50%" to match home?
3. `/how-it-works` says "30-50% higher revenue" and `/solutions/header-bidding` says "40-60% CPM uplift". Keep them, or drop them to "up to 50%"?
4. Minimum size: `/how-it-works` says 10M monthly impressions, `/publishers` says 100,000+ monthly page views. Which is right?
5. `/solutions/in-app-ads` says "SDK-less", while the home comparison table lists "In-App SDK". Which is right?
6. Pages say "50+ demand partners/SSPs" while home lists 67 integrated partners. Keep 50+, or use the list count?

## 6 · Files touched this session

```
COMMIT 3783fb7 (design: blueprint system and home page)
  NEW       server/templates/components/blueprint.ts
  MODIFIED  src/styles/main.css, server/templates/layout.ts, server/middleware/security-headers.ts,
            server/templates/components/{hero,cta,stats,contact-form}.ts, server/templates/pages/home.ts,
            server/routes/__tests__/pages.test.ts
COMMIT 432c00c (per-group page stylesheets)   NEW src/styles/pages/{solutions-media,solutions-google,company,resources}.css
COMMIT 1d28005 (ignore .shots/)               MODIFIED .gitignore
MERGES 1f1751b (b2), 6c1b9c9 (b4), 24baf13 (b1), a4a069c (b3): 26 page templates, tools/index.ts, 4 group CSS files, 4 test files
COMMIT 5a73adb (integrate; drop scroll-reveal) NEW server/routes/__tests__/blueprint.test.ts; MODIFIED main.css, layout.ts
COMMIT 65770d7 (docs)                          MODIFIED CLAUDE.md, docs/DECISIONS.md (D-022)
COMMIT 71a8c7d (a11y)                          MODIFIED layout.ts, contact-form.ts, support.ts, legal/*.ts
COMMIT ef10ed2 (skeptic fixes)                 MODIFIED home.ts, stats.ts, admin/blog.ts, layout.ts, main.css

LIVE ENV STATE
  prod D1 contact_leads: +1 test row "TEST Deploy Check (blueprint redesign)", matt@hbdr.com, 2026-10-16T19:05:10Z. Kept forever per D-013.
  Worktrees ~/code/hbdr-website-b1..b4 removed after verifying 0 unmerged commits and no uncommitted files. Deleted knowingly: ignored files only (.shots, built CSS, node_modules symlink). Local branches design/blueprint-b1..b4 deleted.
```

---

End of HANDOFF-005.
