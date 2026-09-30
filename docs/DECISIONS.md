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
