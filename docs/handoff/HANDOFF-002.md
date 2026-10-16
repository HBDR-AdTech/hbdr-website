# HBDR Website Handoff — 002 — 2026-10-14 (solutions layout, qualifying lead form, security hardening, admin form settings + Turnstile)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-001.md (Phase A: deps, Tailwind build, Vitest).
> Append-only / numbered / immutable.

## Next turn

- Redesign the marketing site on this branch (`design/redesign-v2`), in a fresh Claude Code session so the Impeccable and GSAP plugins load (they are enabled for this repo only, local scope). Direction from Matt: the site "looks basic"; take it far beyond the current Linear look with strong GSAP motion; no three.js for now. Record a new D-NNN that supersedes D-012's restrained-motion rule before changing styles.
- Keep D-005 (no invented claims) and Core Web Vitals in view: GSAP from CDN with SRI (same pattern as Alpine in `server/templates/layout.ts`), honour `prefers-reduced-motion`.
- **Operator:** confirm the D-011 live test lead ("TEST Deploy Check", 2026-10-14 ~12:00 UTC) arrived in contact@hbdr.com with the new qualifying rows.
- **Operator:** Turnstile: create the widget (Managed; hbdr.com + hbdr-website-preview.webmaster-691.workers.dev), run `npx wrangler secret put TURNSTILE_SECRET`, paste the site key on `/admin/form`, switch on.
- **Operator:** Cloudflare dashboard gaps in `docs/SECURITY.md` "Open gaps": WAF rate-limit rule on `POST /api/contact`, preview-only CI token (GitHub Environments), DNSSEC, CAA; decide IP retention (D-013).
- **Operator:** roll the Cloudflare API token if the secrets printed during the GSAP plugin install were visible anywhere beyond the local terminal (cause looked like a malformed multi-command paste; the plugin itself has no executable code).

---

## 1 · Current state

- **Branch:** `main` at `8dcc2d4` (PRs #18, #19, #20 merged); this handoff rides `design/redesign-v2`.
- **Tests:** 160 / 160 passing; `npm run check` clean.
- **Deployed:** production Worker version `fb9b8b0d-b564-4747-82d0-526176e08bac` (deploy run 38560335338).
- **Migrations applied (prod):** through `0005_rate_limit_index.sql`.
- **Preview:** https://hbdr-website-preview.webmaster-691.workers.dev (behind Access, own D1, no email).

## 2 · What just shipped

### Solutions pages fill the width (PR #18)
Intro cards sat in `max-w-4xl` on the `7xl` grid, leaving the right third blank on desktop. 15 cards across 10 files in `server/templates/pages/solutions/` now use a 12-column split (heading left, copy right), stacked on mobile; the MA vs MI table spans full width.

### Qualifying lead form (PR #18, D-014)
Phone, role, inventory type (Website / Mobile app / CTV / OTT), domain/bundle ID/app URL, app store URLs (shown for app/CTV), ads.txt or app-ads.txt URL (required), current monetization, top region, timeline, referral. Each answer has its own `contact_leads` column (`migrations/0003_lead_details.sql`), shows in the lead email and admin table.

### Escaping fixed end to end (PR #18)
- Admin "View message" button spliced lead text into an Alpine `@click` expression (stored XSS); now uses `data-*` attributes.
- `_source` was stored as sent and printed raw in admin; now allowlisted to `contact`/`support`.
- Lead email double-escaped (`&#x27;` in inbox); now text is escaped once at the API and the email uses it as is; subject is plain text.
- 64 KB body limit, length caps, impressions enum (D-015).

### Security hardening (PR #19)
Atomic D1 rate limit (`INSERT … ON CONFLICT … RETURNING`, `cf-connecting-ip` only, IPv6 by /64, `0005` index); SRI on jsdelivr Alpine scripts; all actions SHA-pinned (verified against tags with `git ls-remote`), workflow token read-only; blog editor and blog list escaping; `npm audit fix` (prod deps clean).

### Admin form settings + Turnstile toggle (PR #20, D-016)
`/admin/form` (Access-covered): per-field visible/required/order/label/placeholder/options, up to 20 custom fields, append-only change log with the Access email as actor (`migrations/0004_form_config.sql`). Turnstile is off until the secret and site key exist; both contact and support forms carry the widget and every submission is checked; a siteverify outage saves the lead as `bot_check = unverified`. Honeypot non-string crash fixed; dead `users` storage code removed (table left).

### Live smoke / verification
- Each new safeguard's test fails with the fix reverted (mutation-checked).
- Local Worker + local D1: lead row read back with all 10 new columns.
- Real browser on dev: form submit, admin modal with `x'+(window.pwned=1)+'` stayed inert, `/admin/form` toggle saved + audit row + live form updated, locked field hide refused (400).
- Production after deploy: solutions page uses the new grid; jsdelivr scripts carry `integrity` and Alpine runs; contact form shows the new required fields; `/admin/form` redirects to `securehbdr.cloudflareaccess.com`; one live lead submitted ("Message Sent!"). Inbox arrival not yet confirmed (Matt).

## 3 · Architecture decisions worth remembering

- Qualifying fields are optional in the API even when required in the form: a visitor on a cached pre-change page must never lose a lead (D-011). Required = present-but-blank refused; absent accepted.
- Escape once, at the API boundary (`sanitizeText`). Every later sink (email body, admin HTML) uses stored text as is; plain-text sinks (email subject) decode. Never splice stored text into Alpine expressions.
- Form config is cached 60 s per isolate (2 queries, ≤37 rows per miss); writes invalidate the writing isolate only.
- Form admin API lives under `/admin/api/form-config` so the existing Access app covers it without a dashboard change.
- Turnstile outage never blocks a lead; a definitive failure does (403, nothing stored).
- Design plugins are `--scope local` (gitignored `.claude/settings.local.json`), telemetry off via env, their files in `.git/info/exclude`: nothing AI-related reaches git.
- Rejected: off-the-shelf form builders (Formbricks/HeyForm/Form.io) need their own Postgres/Mongo outside Workers; hosted forms move leads off D1.

## 4 · Open work

- Redesign (ours, queued; see Next turn).
- Dashboard-only gaps (operator): Turnstile widget + secret, WAF rate-limit rule, preview-only CI token, DNSSEC, CAA, DMARC `p=quarantine` after reports. Listed in `docs/SECURITY.md`.
- Known limits (accepted): two admins saving at once, last write wins; a visitor whose page loaded before Turnstile was switched on must reload; CSP still allows `unsafe-inline`/`unsafe-eval` for Alpine (upgrade: Alpine CSP build); 4 dev-only npm highs in the `@tailwindcss/cli` chain.
- From HANDOFF-001's queue: JSON-LD, admin layout dedup, blog editor preview, cover image upload still open; analytics beacon code exists but has no token; email validation (disposable blocklist) and D1 rate limiter are done.

## 5 · Open questions for the operator

- Redesign: supersede D-012 entirely (new visual language), or keep the near-black canvas + mint accent and add motion/depth on top?
- Submitter IP retention: keep forever (current) or null after N days?

## 6 · Files touched this session

```
PR #18 (merge dd9f53a): solutions templates (10), shared/schema.ts, server/services/{storage,mem-storage,email}.ts,
  server/d1Storage.ts, server/routes/api.ts, server/templates/{components/contact-form,admin/leads}.ts,
  server/middleware/sanitize.ts, migrations/0003_lead_details.sql, tests, docs (D-014, D-015, SECURITY.md), CLAUDE.md
PR #19 (merge 023cb54): server/middleware/rate-limit.ts, migrations/0005_rate_limit_index.sql, server/templates/layout.ts,
  server/templates/admin/blog.ts, .github/workflows/{deploy,preview}.yml, package-lock.json, tests, docs
PR #20 (merge 8dcc2d4): migrations/0004_form_config.sql, server/services/{form-config,turnstile}.ts,
  server/templates/admin/form.ts, server/templates/pages/support.ts, routes, middleware (auth, csrf, security-headers), tests, docs (D-016)
This commit: docs/handoff/HANDOFF-001.md (was untracked docs/HANDOFF.md), HANDOFF-002.md, INDEX.md

LIVE ENV STATE
  prod D1 contact_leads: one test lead "TEST Deploy Check" (matt@hbdr.com), kept per D-013
  local only: .claude/settings.local.json enables impeccable + gsap-skills, env DO_NOT_TRACK / IMPECCABLE_NO_TELEMETRY / IMPECCABLE_NO_UPDATE_CHECK; .git/info/exclude: .impeccable/, PRODUCT.md, DESIGN.md
```

---

End of HANDOFF-002.
