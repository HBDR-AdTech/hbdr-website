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

## D-010 — 2026-10-04 — Matt — Site uses the Linear (linear.app) look and feel

The whole marketing site follows Linear's visual language: near-black canvas (`#08090a`), barely lighter surfaces, hairline borders, Inter for body and headings (semibold, tight tracking), muted gray body text (`#8a8f98`), restrained fade-up motion that honours prefers-reduced-motion (the partner marquee keeps moving), compact 8px-radius buttons, and at most one soft glow in a hero. HBDR mint `#2BDE73` replaces Linear's indigo as the single accent. No glassmorphism blur, floating orbs, gradient text or serif display face. Copy and claims are unchanged (D-005). Tokens live in `src/styles/main.css`.
Supersedes: the dark glassmorphism theme (Figtree + Instrument Serif, orbs, liquid gradients).
