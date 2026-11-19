# HBDR Website Handoff — 009 — 2026-11-19 (growth plan v2, four explainer page mockups, D-038–D-041)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-008.md (company facts, legal, legacy posts, sellers.json admin, growth plan).
> Append-only / numbered / immutable.

## Next turn

- **Run v3 of the four page mockups** from `.mockups/notes/brief-v3-fixes.md`. Use one fresh builder subagent for the four files. Then use a separate fresh verifier that writes `.mockups/notes/VERIFY-site-pages-v3.md`. All four pages must PASS. Then send Matt the four links (http://beast:8930/hbdr-website/<topic>.html).
- **Mobile page is Matt's priority.** D-041: the in-app SDK is built, so show it as available. Matt wants "the absolute best show of how this works". The v3 brief says what that means.
- **After Matt's yes on the mockups:** port them in a new worktree `../hbdr-website-wt-explainer-pages` on branch `feat/explainer-pages`. Replace `/solutions/header-bidding`, `/solutions/ctv-ott` and `/solutions/in-app-ads`. Add `/solutions/prebid-server` (`server/routes/pages.ts`, `PAGE_ROUTES` in `server/config.ts`, nav). Move the `.bp-grid12` 320 px fix and the 44 px button height into `src/styles/main.css`. Add tests to the per-group page tests, `claims.test.ts` and `blueprint.test.ts`.
- **Operator (carried from 008):** merge #33, then #34. Then run the 2 production SQL files named in HANDOFF-008, submit one live test lead, and pick the 41 repeated seller IDs.
- **Growth plan:** move the page to `.mockups/growth-plan.html` (rule of 2026-10-31). Matt has not answered its 4 questions.

---

## 1 · Current state

- **Branch:** `fix/content-answers` (PR #33). This handoff commit sits on top of `589c0d3`. PR #34 (`feat/supply-files`, `a4d4f1c`) is open and mergeable. PR #35 (Dependabot: undici, wrangler) is open.
- **Tests:** 379 / 379 on this branch (`npx vitest run`, 2026-11-19).
- **Production:** unchanged since `6f3fa8c` (#32, 2026-10-23). Nothing deployed this session.
- **Mockups:** served from `.mockups/` (gitignored) at http://beast:8930/hbdr-website/, through the symlink `~/mockups/hbdr-website`.

## 2 · What just shipped (session 009)

### Growth plan v2 (2026-10-25 to 2026-10-29)

- Matt called the 20 ideas of v1 "bush league". v2 starts from measured facts.
  - HeaderBiddr's 309 publisher domains are mostly large news and streaming sites in South and Southeast Asia, Taiwan and Turkey.
  - On its own sites, HBDR is one Google reseller among 51 on the median site. 14 other resellers sit on more of those sites than HBDR does.
  - The Trade Desk scores reseller paths lower.
- Bets: run the auction on existing sites, build a competitor map, start CTV from the streaming apps already in the base, sell curated deals, and offer faster pay.
- Record: `docs/research/reseller-map-2026-10-29.md`. Page: `docs/artifacts/growth-plan.html`. Link: https://claude.ai/code/artifact/b2db25e2-9698-46a0-bb6e-96ff2080dd1f. The first link stopped opening after an account switch, and `docs/artifacts/README.md` lists both.
- **Correction (own mistake):** the first v2 counted only the 184 single seller IDs (173 domains, 122 readable). The full file has 309 web domains, 228 of them readable. The research file keeps the correction note.
- **Phone fix:** the page scrolled sideways under 384 px, because the 12-track grid had 11 gaps of 32 px. It now uses one track at phone width.

### Explainer page mockups (2026-11-09 to 2026-11-12)

- Matt asked for 4 pages: mobile SDK bidding, CTV, Prebid Server and header bidding, with mockups first.
- The 3 existing pages are rendered from this branch as `.mockups/current-{header-bidding,ctv-ott,in-app-ads}.html`. Prebid Server had no page.
- 4 builders and 1 verifier wrote `.mockups/header-bidding.html` (v2), `prebid-server.html` (v2), `mobile-sdk-bidding.html` (v1) and `ctv.html` (v1). The shared brief is `.mockups/notes/brief-site-pages.md`.
- The verifier's record is `.mockups/notes/VERIFY-site-pages.md`. 3 pages passed with fixes, and CTV failed (11 "Available now" rows vs D-039's 4). Every page passed these checks: 0 claims-test hits, the same shell as the live site, no sideways scroll at 320–1440 px, 0 JS errors, and 44 source links returning 200.
- D-041 (2026-11-19) then changed the claim rules. `.mockups/notes/brief-v3-fixes.md` combines D-041 with every verifier fault.

### Decisions recorded

| ID | Topic |
|---|---|
| D-038 | In-app bidding not built (Matt, 2026-11-12). Superseded by D-041 item 1. |
| D-039 | CTV page shows VAST tag, SSAI, ad pods and the Roku / Fire TV SDK as available. |
| D-040 | The Prebid Server page names no hosting regions. |
| D-041 | In-app SDK, Prebid Server and CTV are shown as built. The footer and stats lines are true. "Up to 50%" and "1–3 business days" apply on every channel. |

- **Cleanup:** removed a stray conflict marker `||||||| e4e860b` from `docs/DECISIONS.md`. Session 008's merge `0160be7` had left it there.

### Verification

- Mockups: verifier record above.
- Repo: 379 / 379 tests. No code changed this session; all commits are docs.

## 3 · Architecture decisions worth remembering

- **Mockups use the real site shell and stylesheet.** Each one is a copy of a server render: nav, footer and `assets/styles.css` (copied into `.mockups/assets/`), with the `bp-*` block markup from `server/templates/components/blueprint.ts`. A port to a template is then a copy, not a redesign.
- **Matt's word overrides the code on claims (D-033, D-039, D-041).** The code does not show these items live:
  - `ads.hbdr.io` is not deployed (`~/code/hbdr-ctv/CLAUDE.md`).
  - `/vast/tag` returns one bid, not a pod (`vendor/prebid-video-hbdr` `index.ts:914`).
  - The tag reads no `ifa` or `bundle` (`index.ts:746-830`).
  - No Roku / Fire TV SDK code exists.
  - `~/code/prebid-server` reads stored requests only for AMP (`internal/api/amp.go:88`) and has no `/event` route.
  - No in-app SDK repo is on beast or in the GitHub orgs.
  - The site shows these by Matt's direction. Review at each handoff, as D-033 says.
- **Design checker ignores are per file.** `.impeccable/config.json` (git-excluded) scopes cramped-padding and overused-font to each mockup. The findings come from the site's own stylesheet (`src/styles/main.css:293`, `:314`, `:360`), and the live pages get the same findings.

## 4 · Open work

- **Ours:**
  - v3 mockups and their verification (Next turn).
  - The port to templates after Matt's yes.
  - Site-wide fixes found by the builders:
    - `.bp-grid12` scrolls sideways at 320 px on every page that uses it (the page is 368 px wide).
    - Glass buttons are 40 px tall, under the 44 px touch target.
  - Move the growth plan page to `.mockups/`.
- **Blocked on the operator:** the merges and production steps in HANDOFF-008. The partner ads.txt lines. The growth plan answers.
- **Carried from 008:**
  - Turnstile switch-on at /admin/form.
  - DNSSEC DS at the registrar.
  - The HeaderBiddr X account check.
  - Dependabot: #35 is now open.
- **Agent cost:** not read this session.

## 5 · Open questions for the operator

1. Merge #33 and #34 now?
2. Growth plan: do you agree with the direction, which 20 accounts and streaming apps have contacts, what trial terms, and may we read the old 47,000-site list?
3. After v3: yes on each of the four mockups, page by page.

## 6 · Files touched this session

```
COMMIT d14a25c  docs(artifacts): growth plan v2
  MODIFIED docs/artifacts/growth-plan.html
COMMIT 0343331  docs: reseller map from the full sellers.json; counts corrected, phone layout fixed
  NEW      docs/research/reseller-map-2026-10-29.md
  MODIFIED docs/artifacts/growth-plan.html
COMMIT 009c193  docs(artifacts): growth plan republished at a new link
  MODIFIED docs/artifacts/README.md
COMMIT badcc01  docs: D-038, D-039, D-040; stray conflict marker removed
  MODIFIED docs/DECISIONS.md
COMMIT 589c0d3  docs: D-041
  MODIFIED docs/DECISIONS.md

NOT IN GIT (gitignored .mockups/, served at http://beast:8930/hbdr-website/)
  .mockups/current-header-bidding.html, current-ctv-ott.html, current-in-app-ads.html
  .mockups/header-bidding.html, prebid-server.html, mobile-sdk-bidding.html, ctv.html
  .mockups/history/prebid-server.v1.html
  .mockups/assets/ (styles.css, logo, favicon)
  .mockups/notes/brief-site-pages.md, brief-v3-fixes.md, VERIFY-site-pages.md, verify-shots/ (8 PNG)
  ~/mockups/hbdr-website -> /home/beast/code/hbdr-website/.mockups (symlink)
  .impeccable/config.json: 12 per-file ignores for the 4 mockups; tight-leading ignore removed

LIVE ENV STATE
  No production, D1 or vendor change. One claude.ai artifact published (link in §2).
```

---

End of HANDOFF-009.
