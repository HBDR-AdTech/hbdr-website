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
