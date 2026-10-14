# HBDR Website Handoff — 003 — 2026-10-14 (logo palette, auction hero, Cloudflare operator items)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-002.md. Append-only / numbered / immutable.

## Next turn

- Merge PR #21 (logo palette, `design/redesign-v2`) and send one live contact submission after its deploy (D-011: the lead email header color changed), confirm it lands in contact@hbdr.com.
- Retarget PR #22 (auction hero, `design/auction-hero`) to `main`, then merge.
- Turnstile: the widget and `TURNSTILE_SECRET` (prod + preview) exist. Remaining: on `/admin/form` paste site key `0x4AAAAAAFWkEWJNRrR2hyVh`, switch on, then one live test lead (D-011). Needs Matt's Access login in Chrome.
- **Operator (one command each):** `bash ~/.config/hbdr/waf-rate-limit.sh` (block more than 5 POSTs to `/api/contact` in 10 s per IP, free-plan rule) and `bash ~/.config/hbdr/dnssec-on.sh`. The auto-mode classifier refused both writes from the agent. Read back the results and update `docs/SECURITY.md` "Open gaps".
- Design follow-ups, offered and not started: eyebrow pills (`glass-tag`) above every heading and identical icon-card grids are the main remaining "template" signals (Impeccable craft floor). `/impeccable init` to write PRODUCT.md was offered and not run.

## 1 · Current state

- `main` unchanged at `8dcc2d4` (prod Worker `fb9b8b0d`).
- PR #21 `design/redesign-v2`: D-017 logo palette, D-018 IPs kept. Preview deploy run 38562396644 green.
- PR #22 `design/auction-hero` (stacked on #21): D-019 auction hero. 161/161 tests, `npm run check` clean.

## 2 · What shipped (on branches)

- **Logo palette (D-017).** Canvas `#15181f` (the logo's slate), surfaces `#1b1f27` / `#222630`, accent is now the logo mint `#00FAA8`; the old `#2BDE73` was off-brand. Muted text is `#959ca8` (≥5.4:1), placeholder `#848b97` (4.8:1). Selection, caret, scrollbars and `theme-color` are themed. Hex literals removed from admin, calculators, form status dot, success checks and the lead email.
- **Submitter IPs (D-018).** Kept forever. Read only behind Access (admin table and CSV, formula-escaped `server/routes/admin.ts:13`), not in email; `rate_limits` rows are deleted after their 15-minute window. No code change.
- **Auction hero (D-019).** Web Animations API, no GSAP. Replays in view, stops off-screen or when the tab is hidden; reduced motion or no JS shows the server-rendered finished auction.

## 3 · Cloudflare facts verified 2026-10-14

- Registrar for hbdr.com is **Cloudflare, Inc.** (Verisign RDAP; expires 2027-07-10). Zone `fa0a91947f602f807f740e0d203e3a66`, Free plan. DNSSEC was disabled; the registry shows `delegationSigned: false`.
- Turnstile widget "hbdr.com contact form" (managed; hbdr.com + preview workers.dev). Full API response, including the secret, in `~/.config/hbdr/turnstile-widget.json` (mode 600, never commit).
- `http_ratelimit` phase had no ruleset.
- CAA skipped on purpose: DNS-only hosts issue their own certs (dashboard on Vercel, crm on ludicrous.cloud, auth on PropelAuth, monitor on AWS), and a CAA record could block their renewals.
- The token in `~/.config/hbdr/cloudflare.env` is an account token: `/user/tokens/verify` fails and `/accounts/{id}/tokens/verify` passes. It cannot read the Registrar API.

## 4 · Lessons

- Never `git checkout -- <file>` to undo a test mutation. It wiped uncommitted work this session. Back the file up to the scratchpad and copy it back.
- Headless Chrome on beast needs `agent-browser --args --no-sandbox`. Close the browser between CSS rebuilds; `location.reload(true)` still served cached CSS.
- Killing the dev server with `pkill -f 'tsx server/index.ts'` also kills the calling shell. Kill the PID listening on :5000 instead.

## 5 · Files touched

```
PR #21: src/styles/main.css, server/services/email.ts, server/templates/{layout,tools/index,admin/leads,admin/form,
  components/contact-form,pages/home,pages/support}.ts, CLAUDE.md, docs/DECISIONS.md (D-017, D-018), docs/SECURITY.md
PR #22: server/templates/pages/home.ts, src/styles/main.css, server/routes/__tests__/pages.test.ts,
  docs/DECISIONS.md (D-019), CLAUDE.md, this handoff + INDEX.md
Outside the repo: ~/.config/hbdr/{turnstile-widget.json, waf-rate-limit.sh, dnssec-on.sh}; Worker secret TURNSTILE_SECRET (prod + preview)
```

End of HANDOFF-003.
