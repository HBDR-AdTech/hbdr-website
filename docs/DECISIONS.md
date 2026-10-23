# Decisions

Append-only. One line of context per decision, dated, with who decided it and what it supersedes. A PR that changes a rule cites the id in its body. A builder (human or agent) reads this file before starting and writes the directive here first, not in chat.

Format: `## D-NNN — YYYY-MM-DD — who — one-line title`, then the decision in plain words, then `Supersedes:` when it replaces an earlier rule. Same convention as buyleads-dashboard/docs/DECISIONS.md.

## D-001 — 2026-09-30 — Matt — Form notifications send through Cloudflare Email Sending

Contact and support notifications go out through the Worker `EMAIL` binding (`[[send_email]]` in wrangler.toml), from `noreply@hbdr.com`, to contact@ / support@hbdr.com with reply-to set to the submitter. hbdr.com is onboarded as a sending domain (DKIM selector `cf-bounce`, bounce MX on `cf-bounce.hbdr.com`); the Google Workspace MX on the apex is untouched. The send runs inside `waitUntil` so the Worker is not cancelled after the response. DMARC stays `p=none`: Cloudflare suggested `p=reject`, which would put Google, Zendesk and SendGrid mail from hbdr.com at risk without an alignment audit first. Rollback: revert the commit; the Resend DKIM record is still on the zone.
Supersedes: Resend API notifications (`RESEND_API_KEY` secret, sandbox sender).

## D-002 — 2026-09-30 — Matt — hbdr.com is the canonical host

`www.hbdr.com` answers with a 301 to `https://hbdr.com` (path and query kept) via a zone redirect rule (`http_request_dynamic_redirect` phase), not Worker code. `SITE_URL` is `https://hbdr.com` and feeds canonical, OG, JSON-LD and the sitemap; no page references the workers.dev hostname.

## D-003 — 2026-09-30 — Matt — Changes ship as a branch and PR

Work lands on a `feat/` or `fix/` branch with a PR carrying screenshots and test output; Matt reviews and merges. A merge to main deploys production through CI.


## D-004 — 2026-09-30 — Matt — Email goes through Cloudflare only

All site email is sent with Cloudflare Email Sending. No Resend or other third-party sender: the `RESEND_API_KEY` Worker secret was deleted on 2026-09-30 and no code path references Resend.
Supersedes: the rollback note in D-001 that relied on Resend.

## D-005 — 2026-09-30 — Matt — Company claims used on the site

HBDR was founded in 2015. "25+ years" refers only to the team's combined experience. HBDR serves 1B+ impressions per month (never "daily"); 1T+ is total ads served through HBDR's pipes. Comparisons never name a competitor; use generic alternatives ("Typical Ad Network", "DIY In-House Setup"). The partner logo strip is titled "Integrated Demand Partners".

## D-006 — 2026-09-30 — Matt — Weekly blog backfill, bylined HBDR Research

The blog carries one post per week from January 2025 on. New posts are bylined "HBDR Research" (no invented people). Every named event, figure or ruling must be verifiable and dated on or before the post's date; posts never invent HBDR news, clients or performance figures (D-005 facts only). This is a one-time backfill through 2026-09-28; there is no scheduled writer for future weeks.

## D-007 — 2026-09-30 — Matt — Resend DNS removed

The Resend sending records on hbdr.com (`resend._domainkey` TXT, `send.hbdr.com` MX and SPF to Amazon SES) were deleted. Only Cloudflare Email Sending (`cf-bounce`) remains as an outbound path for the website (D-004).

## D-008 — 2026-09-30 — Matt — Cloudflare Access in front of the site admin

Access app "HBDR Website Admin" (id `ed8b2081-38dc-487d-a816-5be437b2606d`, team domain securehbdr.cloudflareaccess.com) covers `hbdr.com/admin`, `hbdr.com/api/blog` and `hbdr.com/api/leads`: one-time PIN, 24h session, allow matt.ortolani@gmail.com and matt@hbdr.com. The app's own cookie login stays behind it. `GET /api/contact` (lead list) shares its path with the public form POST, so Access cannot cover it; it stays on the app's cookie auth.

## D-009 — 2026-10-02 — Matt — Cloudflare Access is the only admin login

The app password, login page, in-memory sessions and CSRF tokens are removed. Every admin path (`/admin*`, `/api/blog*`, `/api/leads*`) requires a valid Cloudflare Access JWT, verified in the Worker against the team JWKS, issuer and the app AUD; missing configuration fails closed. The lead list moved from `GET /api/contact` to `GET /api/leads` so Access covers it. Access also covers both Workers' workers.dev hostnames. Branch previews deploy with `--env preview` to their own D1 with no email binding. The `EMAIL` binding is allowlisted to send from noreply@ to contact@/support@ only. Threat model: `docs/SECURITY.md`.
Supersedes: the `ADMIN_PASSWORD` login (and its public default).

## D-010 — 2026-10-04 — Matt — CI applies D1 migrations before every deploy

Both workflows run `wrangler d1 migrations apply --remote` (prod DB on main, preview DB on branches) before `deploy`. Root cause it closes: `0002_rate_limits.sql` shipped on 2026-03-06 but was never applied to prod, so from that deploy until 2026-10-02 every contact/support submission threw on the missing table and the handler reported success; no leads were saved or emailed for seven months. Migrations stay additive (`IF NOT EXISTS`), so re-applying is a no-op.

## D-011 — 2026-10-04 — Matt — Lead capture never fails silently again

"Never mess this up again." Leads stopped from 2026-03-06 to 2026-10-02 and nobody knew. Standing rules:
1. A form failure returns a non-2xx status and the visitor sees the error; never a success message on failure (test: `server/routes/__tests__/api.test.ts`).
2. Code that queries a table ships with the migration that creates it (test: `server/__tests__/schema.test.ts` fails otherwise), and CI applies migrations before deploy (D-010).
3. Any change that touches the contact/support path or email is verified after deploy by one live submission that lands in contact@hbdr.com, and the PR says so.
4. Workers observability is on, and the Cloudflare notification "Workers errors (hbdr.com forms and all Workers)" (Workers Observability Real-Time Issue, policy `bf3c322a59a443ddb02f8dde4bc1e4d4`) emails matt@hbdr.com and matt.ortolani@gmail.com when a Worker starts throwing a new error.

## D-012 — 2026-10-04 — Matt — Site uses the Linear (linear.app) look and feel

The whole marketing site follows Linear's visual language: near-black canvas (`#08090a`), barely lighter surfaces, hairline borders, Inter for body and headings (semibold, tight tracking), muted gray body text (`#8a8f98`), restrained fade-up motion that honours prefers-reduced-motion (the partner marquee keeps moving), compact 8px-radius buttons, and at most one soft glow in a hero. HBDR mint `#2BDE73` replaces Linear's indigo as the single accent. No glassmorphism blur, floating orbs, gradient text or serif display face. Copy and claims are unchanged (D-005). Tokens live in `src/styles/main.css`.
Supersedes: the dark glassmorphism theme (Figtree + Instrument Serif, orbs, liquid gradients).

## D-013 — 2026-10-06 — Matt — Leads are kept forever

`contact_leads` is append-only: the app inserts leads and updates `status`, and nothing in code or migrations may delete, drop or truncate the table (`server/__tests__/schema.test.ts` fails otherwise). This includes the 16 Feb–Mar 2026 leads that never reached the inbox and the test submissions. Recovery layers: D1 Time Travel (30-day point-in-time restore, `wrangler d1 time-travel restore`), and offline exports at `~/.config/hbdr/backups/contact_leads-<UTC>.sql` (mode 600, PII, never committed); first export 2026-10-06 with 24 rows.

## D-014 — 2026-10-13 — Matt — Contact form asks qualifying questions

The contact form (home and /contact) asks, besides name, work email, company and monthly impressions: phone (optional), role (optional), inventory type (Website / Mobile app / CTV / OTT checkboxes, at least one), domain, bundle ID or app URL, app store URLs (optional, shown when Mobile app or CTV is ticked), ads.txt or app-ads.txt URL (required from 2026-10-14), current monetization, top traffic region, timeline and how they heard about HBDR (last three optional). Choice lists live once in `LEAD_OPTIONS` (`shared/schema.ts`); the API accepts only those values and stores each answer in its own `contact_leads` column (`migrations/0003_lead_details.sql`). The browser enforces the required ones; the API keeps every qualifying field optional so a visitor on a cached pre-change page still gets through (D-011). The lead email and the admin leads table show every answer given.
Rollback: revert the commit; the added columns are nullable and harmless to the old code.

## D-015 — 2026-10-14 — Matt — The lead form and admin are held to a production security baseline

"Make sure we use all best practices and full security measures." Standing rules for the contact/support form, its API and the admin panel:
1. Every visitor-supplied value is either an allowlisted choice (`LEAD_OPTIONS`, impressions, `_source`) or length-capped free text, HTML-escaped once at the API boundary; nothing visitor-controlled reaches admin HTML, an Alpine expression or the email unescaped (tests in `server/routes/__tests__/api.test.ts`, `server/templates/admin/__tests__/leads.test.ts`).
2. `POST /api/contact` refuses bodies over 64 KB before parsing.
3. Admin and every lead-reading path stay behind Cloudflare Access with the JWT verified in the Worker (D-008, D-009).
4. Open gaps are tracked in `docs/SECURITY.md` with an owner: bot challenge (Turnstile), edge rate limit on the form, a preview-only CI token, SRI on CDN scripts, DNSSEC and CAA.

## D-016 — 2026-10-14 — Matt — Operators control the contact form; Turnstile is an operator toggle

Settings are operator controls, not code constants. The contact form (home and /contact) is defined once in code (`DEFAULT_FORM_FIELDS`, `server/services/form-config.ts`) and changed from `/admin/form` behind Cloudflare Access: label, placeholder, shown, required, order, choice options, and up to 20 custom fields (short text, long text, dropdown, checkboxes; answers stored as JSON in `contact_leads.custom_fields`). A change is a row in `form_field_overrides` or `form_settings`, written in the same D1 batch as an append-only `form_config_changes` row whose actor is the verified Access email (`migrations/0004_form_config.sql`). The API is `/admin/api/form-config*`, covered by the Worker's Access check, and mutations need a same-origin `Origin` header. It sits under `/admin`, so the existing Access app already covers it. Rules:
1. Name, work email, company and monthly impressions are locked: always shown and required, only label and placeholder change. The impressions values are fixed (the support form sends `support-request`).
2. Options are retired, never deleted. A retired option leaves the form, but the API still accepts it from a page loaded earlier.
3. Required fields (D-011): a shown, required field sent blank is refused (400, naming the field). A field missing from the submission is accepted, because a page loaded before the change does not have it. A hidden field's value is ignored and stored as null. The support form is checked against the code defaults.
4. Cloudflare Turnstile stays off until an operator turns it on, and it cannot be turned on without the Worker secret `TURNSTILE_SECRET` and a site key. While it is on, every contact and support submission needs a token (both forms carry the widget). The token is checked with siteverify after the rate limit and honeypot and before the insert: action `contact`, hostname in `TURNSTILE_HOSTNAMES` (`server/config.ts`). A definitive failure returns 403 and stores nothing. If siteverify is unreachable, times out (5 s), returns non-200, or reports a secret or internal error, the lead is saved with `bot_check = 'unverified'`, and the email and admin show it, so a siteverify outage never costs a lead. A visitor whose browser can't load the widget (blocked script, Cloudflare outage) or whose page predates switching Turnstile on cannot get a token. Accepting a submission without a token would let any bot skip the check, so the form shows the error and contact@hbdr.com instead. Before refusing a submission without a token, the Worker re-reads the config, so a page rendered after Turnstile was switched off is never refused by an isolate that still has it cached as on.
5. Each Worker isolate caches the form config for 60 seconds. A cache miss costs 2 queries and reads fewer than 40 rows. An admin write clears the cache in its own isolate; other isolates show the change within 60 seconds. If an override row is not JSON (a hand edit in D1), it is skipped and the field keeps its default, so the row cannot stop lead capture.
Supersedes: D-014's `LEAD_OPTIONS` (the choice lists now live in `DEFAULT_FORM_FIELDS` plus overrides) and its "the API keeps every qualifying field optional" (now rule 3).
Rollback: revert the merge. Migration 0004 only adds tables and nullable columns, which the old code ignores. Turnstile is switched off with one toggle on `/admin/form`.

## D-017 — 2026-10-14 — Matt — The site uses the logo's colors

"The jet black background is too deep. I like the mint accent because it goes with the logo. Match it to the logo colors and keep that theme throughout." The palette is sampled from the logo pack (`attached_assets/HBDR_Logo_Pack_all_sizes_-_2…jpeg`): canvas `#15181F` (the logo's slate ground), elevated `#1B1F27`, raised `#222630`, accent `#00FAA8` (the logo mint; the old `#2BDE73` was off-brand), white text `#F5F7FA`, muted text `#959CA8` (at least 5.4:1 on every surface), placeholder `#848B97` (4.8:1 on inputs). Buttons on mint use the canvas color for text (12.9:1). The lead email header, admin pages, calculators, selection, caret, scrollbars and `theme-color` use the same tokens. Tokens live in `src/styles/main.css`; templates reference `var(--accent)`, never a hex.
Supersedes: D-012's canvas `#08090a` and accent `#2BDE73`. The rest of D-012 (hairlines, Inter, no glass/orbs/gradient text) stands.
Rollback: revert the commit; only CSS tokens and color literals change.

## D-018 — 2026-10-14 — Matt — Submitter IPs are kept

"Keep the submitter IDs in the database. Make sure they're safe." `contact_leads.ip` stays, kept forever with the lead (D-013); there is no retention job. Checked 2026-10-14: the IP is read only behind Cloudflare Access (admin leads table and `/admin/leads/export`, whose cells are formula-escaped by `csvCell`), never sent in the lead email; `rate_limits` rows are deleted after their 15-minute window; offline exports are mode 600 outside the repo.
Closes: the "decide IP retention" item in `docs/SECURITY.md`.

## D-019 — 2026-10-14 — Matt — The hero's motion is a live header-bidding auction

Matt chose the auction hero over a sitewide GSAP pass. The home hero dashboard carries one authored motion: an example header auction for a 300×250 slot. A timeout bar runs for 1.4 s, five bidders' bids land at random points inside it, the highest bid turns logo mint, the others dim, and "Today's Revenue" ticks up from the second auction on. It replays while the panel is in view and stops when it scrolls off-screen or the tab is hidden. It uses the browser's Web Animations API with no GSAP or other library, so no new script download and no SRI entry. Bidders are labelled "Bidder 1–5" and bids are random example values (D-005: no partner names, no implied performance data). The server renders a finished auction (one winner, $4.86 CPM), and that is what visitors see without JavaScript or with `prefers-reduced-motion` (test: `server/routes/__tests__/pages.test.ts`).
Supersedes: HANDOFF-002's "strong GSAP motion" direction. D-012's restrained fade-up stays for every other section.
Rollback: revert the commit; the hero goes back to the revenue chart alone.

## D-020 — 2026-10-16 — Matt — The blueprint design runs on every page; informational pages flow without boxes

"Make sure the design goes throughout every page. Get rid of the boxes around the content on the informational pages; make everything flow more smoothly. Level up those pages: enterprise grade, higher quality, high-tech, like a true ad-tech software-as-a-service business." Standing rules:
1. Every public page uses the inventory-blueprint system from `docs/design/home-blueprint.html`: the D-017 palette, Archivo for display, Inter for body, Geist Mono only for measurements, sizes, prices and timings, hairline rules, one 12-column grid, a heading on the left and its supporting line on the right.
2. Informational pages (solutions, publishers, advertisers, about, how it works, trust, partners, careers, press, support, dashboard, legal) present content as flowing sections separated by hairlines and space. A border, fill or radius marks only a real object: a table, a form, a diagram, a code sample or an interactive demo. No card grids of icon + heading + text.
3. Each informational page explains its subject the way an ad-tech SaaS vendor would: a diagram, spec table or worked example where one teaches more than prose, built from D-005 facts and labelled example data.
4. Motion follows D-019 and the guardrails Matt set on 2026-10-14: GSAP only, no scroll-jacking or pinned sections, text never hidden waiting for an animation, a different treatment per section or none, and a static finished state under reduced motion.
Supersedes: D-012's card components (`glass-card` grids) on public pages. The admin pages keep their current layout.
Rollback: revert the redesign merge; tokens and templates return to the D-017 state.

## D-021 — 2026-10-16 — Matt — No testimonials until real ones exist

The home page testimonials ("TechMedia Group", "Digital Publishing Co", "Content Network Inc", "Mobile Media Labs", "Gaming Publishers United") are removed in the redesign. Testimonials return only with real quotes, names and companies that Matt supplies. Extends D-005 (no invented clients or quotes).

## D-022 — 2026-10-16 — Matt (via D-020 and HANDOFF-004) — The hero auction runs on GSAP, inside the inventory sheet

The home hero is the approved blueprint sheet (`docs/design/home-blueprint.html`): a publisher page drawn to IAB proportions whose five slots are sold one auction at a time, with the bid ladder over the page copy and a tally ("n of 5 slots sold · page eCPM"). The motion moves from the Web Animations API to GSAP 3.12.5 + ScrollTrigger, loaded from cdnjs with SRI hashes (`GSAP_SCRIPTS` in `server/templates/layout.ts`; `https://cdnjs.cloudflare.com` added to `script-src`) and only on pages that pass `gsap: true` to `renderLayout`. The cycle runs only while the sheet is on screen and the tab is visible. The server renders the finished state (one slot sold at $4.86, one winner), which is what no-JS and reduced-motion visitors see (`server/routes/__tests__/pages.test.ts`). The revenue dashboard and its "Today's Revenue" ticker are gone.
Supersedes: D-019's "Web Animations API with no GSAP, no new script download and no SRI entry" and its revenue ticker. D-019's example-data rules (Bidder 1–5, random example bids, D-005) stand.
Rollback: revert the commit; the CSP entry is harmless without the scripts.

## D-023 — 2026-10-16 — Matt — Reduced-motion visitors still see the hero auction, as fades

Matt saw the hero stand still on his iPhone, which has Reduce Motion on, and chose "play a gentle version" over keeping it still. With `prefers-reduced-motion: reduce`, the home hero auction keeps cycling: each bid fades in at its final bar length, the winning slot fills and its price fades in, and the tally updates. Nothing slides, sweeps or draws. The bid bars don't grow, the timeout bar doesn't sweep, and the dimension lines don't draw. It still runs only while the sheet is on screen and the tab is visible. Every other section keeps its finished state under reduced motion. Visitors without JavaScript or GSAP see the server-rendered finished auction (D-022).
Amends: D-020 rule 4 and D-022 ("a static finished state under reduced motion") for the hero auction only.
Rollback: revert the commit; reduced-motion visitors see the static finished auction again.

## D-024 — 2026-10-21 — Matt — The canvas is a deep navy, close to black

"I'd like the background color to be a little darker, almost like a deep navy blue, close to black but not black exactly." The surfaces move from D-017's logo slate to navy:

| Token | Value |
|---|---|
| canvas `--surface` | `#0B1121` |
| elevated | `#111A2E` |
| raised | `#18223A` |
| hover | `#15203A` |
| diagram ground `--surface-blueprint` | `#0E1528` |
| scrollbar | `#26314A` / `#34405C` |

Mint `#00FAA8`, the white text, hairlines and the text tokens stay as they are. Contrast against the slate:

| | Slate | Navy |
|---|---|---|
| Muted text on every surface | 5.5–6.4 : 1 | 5.7–6.8 : 1 |
| Placeholder on inputs | 4.8 : 1 | 5.0 : 1 |
| Canvas text on mint buttons | 12.9 : 1 | 13.7 : 1 |

Translucent fills use channel tokens (`rgb(var(--surface-rgb) / a)`), so no slate literal is left in CSS. `theme-color` and the lead email header use the canvas too. The logo PNG is transparent, so it sits on navy with no box.
Supersedes: D-017's canvas, elevated and raised values. D-017's mint and "templates reference tokens, never a hex" stand.
Rollback: revert the commit (tokens only, plus `layout.ts` theme-color and the email header color).

## D-025 — 2026-10-23 — Matt — Pro-level finish: hero glow, lit frames, grain, glass nav

Matt picked four elements on top of the navy blueprint. All are CSS plus one small script in `src/styles/main.css` and `server/templates/layout.ts`, scoped away from admin (`body.is-admin`):
1. **Hero glow:** each hero (`.bp-hero`, `.bp-home-hero`) gets one soft navy ellipse plus a faint mint one (alpha 0.055). No animation.
2. **Lit frames:** real objects get a lit edge (diagram frames, tables, the hero sheet, and the contact and support forms): a 1px top highlight and a gradient ring that brightens on hover. On mouse devices only, a pointer spotlight follows the cursor inside the frame. `FRAME_SPOTLIGHT`: one passive, rAF-batched `pointermove` listener on public pages. It is off on touch and under reduced motion.
3. **Grain:** a ~450-byte feTurbulence SVG tiled into the canvas background, zero-mean around `--surface`. Its colour-matrix offsets encode the canvas colour, so retune them when the canvas changes.
4. **Glass nav:** the nav and its dropdowns are translucent navy (alpha 0.85) with backdrop blur. Nav links measure 5.2–5.3 : 1 over a full mint slot.
Supersedes: D-012's "no glassmorphism blur" for the nav and its dropdowns only.
Rollback: revert the merge.

## D-026 — 2026-10-23 — Matt — The home impression timeline is a timeout explorer with Page and Session RPM

"Move the timeout line to see bidders time out and change page yield; show revenue per pageview and revenue per session as page RPM and session RPM." The #how timeline axis runs to 1500 ms.
- **Controls:** a range input (primary, keyboard and screen reader, 200–1500 ms in 10 ms steps) and the draggable timeout line stay in sync.
- **Bidders:** a bidder that answers after the timeout dims ("timed out · $x lost"). The highest bid in time wins. Bidder 5 is a late $5.20 bid.
- **Readout:** bids received, winning CPM, Page RPM (winning CPM × 3 slots), pages per session (4.0 baseline, −2% per 100 ms over 300 ms) and Session RPM (Page RPM × pages per session).
- **Example data:** every number is labelled example data, and the page says it is an illustrative model, not HBDR data (D-005). Session RPM peaks at 520 ms ($55.75), when the best timely bid arrives. That is the lesson the page teaches.
- **One source:** the TS model `timeoutYield` renders the default state (1000 ms: $4.86, Page RPM $14.58, 3.44 pages, Session RPM $50.16). The page script runs the same function via `toString()`. Tests check that both agree at every 10 ms step, and guard against inner functions, which esbuild keepNames would wrap in `__name`.
- **Reduced motion:** interaction works with or without GSAP and under reduced motion, because it is user-driven.
Rollback: revert the merge.

## D-027 — 2026-10-23 — Matt — Company claims: sites, revenue lift, minimum traffic, in-app integration, demand sources

Matt's answers to the six copy contradictions (HANDOFF-005 §5, HANDOFF-006 §5). These extend D-005:

| Topic | Answer |
|---|---|
| 1. Sites | HBDR has worked with 47,000+ sites overall ("not all were great quality"), so they are never called "premium". The 500+ publishers figure stands beside it. |
| 2–3. Revenue lift | Every revenue or CPM lift on the site reads "up to 50%". That replaces "average over 50%" (/about), "30–50%" (/how-it-works, /solutions/display-ads) and "40–60%" (/solutions/header-bidding). |
| 4. Minimum traffic | 500,000+ monthly pageviews. That replaces 10M monthly impressions (/how-it-works) and 100,000+ monthly page views (/publishers). |
| 5. In-app integration | HBDR offers an in-app SDK or an SDK-less server-side integration, whichever the publisher wants. |
| 6. Demand sources | 65+ demand sources, replacing "50+ demand partners/SSPs". |

Test: `server/routes/__tests__/claims.test.ts` fails if any superseded wording returns.

## D-028 — 2026-10-23 — Matt — The header bidding calculator prices the timeout

"Wire it to the math." The /tools header bidding calculator's timeout slider (200–3000 ms) now changes the result. It uses the same illustrative assumptions as the home timeout explorer (D-026):
- **Bids in time** = (timeout − 100 ms) ÷ 1,100 ms, clamped to 0–100%. Bids are assumed to arrive evenly between 100 and 1,200 ms.
- **Impressions kept** = 1 − 2% per 100 ms of timeout over 300 ms.
- **New CPM** = current CPM × geo × (1 + uplift × partner factor × method factor × bids in time).
- **Projected fill** = current fill + improvement × bids in time, capped at 100%.
- **Header bidding revenue** = impressions × impressions kept ÷ 1,000 × new CPM × projected fill.

The calculator shows "Bids In Time" and "Impressions Kept". The formula table states the model, and the page labels it illustrative.

At the default inputs:

| Timeout | Uplift |
|---|---|
| 300 ms | +10% |
| 1000 ms | +29% |
| 1200 ms (peak) | +33% |
| 2000 ms | +7% |

Test: `resources-pages.test.ts` evaluates the calculator's own `x-data` at 300, 1000, 1200 and 3000 ms.
Rollback: revert the commit.

## D-029 — 2026-10-23 — Matt — Company facts: no certifications, MCM parent, terms, go-live, support, partners

Matt's answers to the HANDOFF-007 §5 questions. These are HBDR facts, extending D-005/D-027. HANDOFF-007's addendum lists the work they create.

| # | Topic | Fact |
|---|---|---|
| 1 | Certifications | HBDR has **no** TAG certification, **no** IAB membership, is **not** a Google Certified Publishing Partner, and is **not** a Prebid.org member. Every such claim comes off the site. |
| 2 | Google | HBDR is an **MCM parent on Google Ad Manager 360** and offers **both Manage Account and Manage Inventory**. "Certified MCM partner" is not real: say "Google MCM partner" or say nothing. |
| 3 | ads.txt / sellers.json | HBDR's ads.txt lines and sellers.json come from **headerbiddr.com** (copy them over). hbdr.com gets back-end management for both files (operator controls, doctrine 14). |
| 4 | Revenue share | Applies to **all revenue HBDR is part of**, from HBDR's ad units up to and including the whole page. |
| 4 | Guarantee | There is **no revenue guarantee**; remove it. |
| 4 | Fees and lock-in | No setup fee and no lock-in today. Setup fees or lock-ins can be agreed by contract if a publisher prefers that structure. |
| 4 | Payment | **Net 30 for Google** revenue, **Net 60 for other sources**. Methods: wire, ACH, PayPal and crypto. Crypto is available but not advertised prominently. |
| 5 | Go-live | **Average 1–3 business days**, depending on the publisher and their current setup. |
| 6 | Support | **Mon–Fri 9am–6pm ET** for people; **24/7 for tickets and the knowledge base**. A **dedicated account manager** is offered: Matt or Ahmed (spelling to confirm) fills the role. |
| 7 | Features | Matt wants the full feature list on the site (AI floors, A/B testing, real-time dashboard with alerts and exports, managed Prebid Server, IVT filtering, Confiant/IAS/DoubleVerify, in-app mediation, CTV SSAI, AMP/companion ads), plus other current, impactful publisher ad-tech features. Open: which exist today and which are roadmap (HANDOFF-007 addendum, first question). |
| 8 | Performance numbers | Check every number against industry standards and best practice. Keep only what HBDR can legitimately claim, and state it the same way on every page. |
| 9 | Partners | Rename defunct or renamed partners to their current names. HBDR has **no DSP PMP or PG deals yet** (in progress) but has the **capability to access** them. The site may say HBDR works across all geographies with publisher monetization partners, DSPs and SSPs, with broad reach. |
| — | Blog bylines | Blog authors are HBDR staff: the byline is "HBDR Research" (D-006), never an invented person. |
