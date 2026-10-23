# HBDR Website Handoff — 007 — 2026-10-23 (long lines, D-027 claims, real research content across the site)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-006.md (navy, pro finish, timeout explorer; addendum with Matt's D-027 answers).
> Append-only / numbered / immutable.

## Next turn

- **Matt answers the 14 open questions in §5.** Each answer either confirms an HBDR claim (it stays, gets recorded in DECISIONS) or removes it. Apply them on this branch (`fix/content-answers`) as one code PR, with tests that fail if a removed claim returns.
- **Operator (Matt):** approve deleting the 5 legacy blog posts with invented authors from prod D1 (Sarah Chen, Marcus Johnson, Elena Rodriguez, David Park; one is an invented product launch). Matt runs the delete; then remove `seedBlogPosts()` legacy entries (`server/d1Storage.ts:156-215`).
- **Legal pages (counsel):**
  - The cookie policy lists 10 cookies the site never sets.
  - The pages say "Last Updated: February 2026", predate D-018 and have no US state-law rights section.
  - Matt decides: counsel rewrites them, or an accurate draft goes to counsel.
- **/tools:** the header-bidding calculator's timeout slider feeds no formula; the page now says so. Decide: wire it in, or remove the slider.
- **Carried:**
  - Turnstile switch-on at `/admin/form`.
  - DNSSEC DS at the registrar.
  - Dependabot PR #25 (vite dev dependency).

---

## 1 · Current state

- **Branch:** `main` at `6a41c35` (merge of #31). This handoff is on `fix/content-answers`.
- **Tests:** 323 / 323; `npm run check` clean.
- **Production:** hbdr.com deployed from `6a41c35`. Deploy runs succeeded for #29, #30 and #31.
- **Migrations:** unchanged, through 0005.

## 2 · What just shipped

### D-027 company claims — #29
Matt's answers to the six contradictions:
- 47,000+ sites;
- "up to 50%" everywhere;
- 500,000+ monthly pageviews;
- in-app SDK or SDK-less;
- 65+ demand sources.

They are recorded as D-027 and in HANDOFF-006's addendum. `claims.test.ts` checks every public route.

### Line length — #30
- **Paragraph cap:** paragraphs on public pages cap at `34em`, about 77 characters. `ch` caps let 15px Inter run to 94 characters.
- **Page caps:** the caps in `resources.css` moved to `em`.
- **Lists:** legal and blog list items follow the same measure.
- **Centered paragraphs** keep `margin-inline: auto`.
- **Checker:** 0 Impeccable line-length findings on 20 pages plus a blog post.

### Real research content — #31
1. **Audit:** an agent read every route and 92 blog posts and found 208 findings. The report is at `.shots/content-audit.md` (git-ignored); a copy is at `.git/content-audit.md`.

   | Kind | Count |
   |---|---|
   | Placeholder | 16 |
   | Outdated or wrong | 40 |
   | Unsupported HBDR claims | 99 |
   | Fluff | 22 |
   | Inconsistent | 31 |

2. **Builders:** three builders, one worktree each:
   - the 10 solution pages;
   - home, audience and company pages;
   - press, careers, support, tools and contact.

   Their brief is at `.git/research-builder-brief.md`. Every outside fact has a source the builder opened, logged with its exact quote in `docs/research/*.md` (20 files).
3. **Skeptic:** all 79 recorded quotes it checked are on the live source pages. Its findings were fixed in `d397891`:
   - new HBDR claims crept in, so the wording was restored to main's;
   - an Open Bidding "last look" line contradicted the AdX remedies text;
   - "no minimums" was still there;
   - five overstatements: AM360-only trafficking, CLS, Privacy Sandbox "retired", GPP "replaced", and the MCM 360 parent.

Main corrections:
- **MCM:** Manage Account and Manage Inventory were backwards and now match Google's definitions. Live check: /solutions/manage-account contains "inventory is managed in the child".
- **Standards:**
  - VPAID → VAST 4.x / OMID / SIMID;
  - FID → INP;
  - TCF 2.0 → v2.3;
  - USP → GPP;
  - "cookieless future" → the real cookie status.
- **Services:** AdSense is not "fixed pricing", and Open Bidding is not "zero latency".
- **Invented content removed:** the 5 invented press releases and the 4 invented jobs.
- **New practical content:**
  - CTV SSAI/CSAI;
  - in-app ATT and attribution;
  - a header-bidding proposal checklist;
  - timeout and floor basics;
  - "Prepare your site";
  - the /trust standards table;
  - the /partners cookie-status table;
  - /tools metric definitions and formulas;
  - the /support FAQ.

### Live smoke (hbdr.com after #31)
- **Status:** all 27 routes return 200.
- **Removed wording:** none of FID, TCF 2.0, "cookieless future", 50%+, "no minimums", "Last look ended" or "thousands of premium" appears.
- **VPAID** appears only in the video page's "what replaced VPAID" standards section.
- **/blog** still shows "Sarah Chen": the legacy D1 posts, waiting on Matt.

## 3 · Architecture decisions worth remembering

- **Research rule (carried into future content work):** every outside fact cites a source opened at the time, with the exact quote, in `docs/research/<page>.md`. HBDR claims come only from DECISIONS (D-005, D-027). Builders never invent or change an HBDR claim; a skeptic checks quotes against the live source pages before merge.
- **Measure in em, not ch:** Inter averages about 0.44em per character, so `34em` is about 77 characters; `65ch` came out at about 94.
- **Fact tests:** `claims.test.ts`, `solutions-facts.test.ts`, `company-research.test.ts` and `resources-pages.test.ts` pin the corrected facts. A content edit that changes those exact phrases has to update them.
- **Branch names:** branches must use `feat/ fix/ refactor/ design/`. `content/*` was renamed before the PR.

## 4 · Open work

- §5 answers → claims PR (not started).
- Legacy D1 blog posts → Matt's delete.
- Legal pages → counsel.
- Calculator timeout slider → decision.
- Agent cost this session (1 audit, 3 builders, 1 skeptic): unknown, because `agent-usage` had no data. Read it in `/cost`.

## 5 · Open questions for the operator (all 14 from the audit)

1. **Certifications:** does HBDR really hold TAG certification, IAB membership, Google Certified Publishing Partner or Prebid.org membership?
2. **Google:** is HBDR an MCM parent on Ad Manager 360? Does it offer Manage Account, Manage Inventory or both? Is "certified MCM partner" accurate? Google has no MCM certification, only Certified Publishing Partners.
3. **sellers.json and ads.txt:** where are they, and which ads.txt lines do publishers add? hbdr.com/sellers.json and hbdr.com/ads.txt both return 404.
4. **Commercial terms:** is the rev-share on all revenue or only incremental revenue? Is there a "Revenue Guarantee"? Any setup fees or lock-in? Is Net-60 with a $100 threshold and wire/ACH correct?
5. **Time to go live:** the site says 2–3 days, 5–7 days, 1–2 weeks and 2–4 weeks.
6. **Support:** 24/7, or Mon–Fri 9–6 ET? Does every publisher get a dedicated account manager?
7. **Features:** which exist?
   - AI floors
   - A/B engine
   - real-time dashboard with alerts and exports
   - managed Prebid Server
   - IVT vendor
   - Confiant, IAS or DoubleVerify
   - in-app mediation
   - own CTV SSAI
   - AMP or companion ads in the player
8. **Performance numbers:** confirm or drop each.
   - +35% calculator uplift
   - 20–40% within 30 days
   - 95%+ retention
   - <100 ms
   - viewability 70% and 85%
   - 90%+ completion
   - AdX 2–3× AdSense
   - CTV 5–10× display
9. **Partners:** which are current? Defunct or renamed: Xandr Invest, EMX, MediaMath, Centro/Basis, MOAT, Lotame (see `docs/research/partners.md`). Any direct DSP deals?
10. **Milestones:** the year of 1B impressions a month; the date of 1T ads served (/about says 2025, /press said January 2026).
11. **Press and careers:** any real coverage or open roles? Is press@hbdr.com a working mailbox?
12. **X handle:** `x.com/haborMedia` looks like a typo.
13. **Legal pages:** counsel rewrite, or an accurate draft for counsel?
14. **Legacy blog posts:** approve the prod D1 delete of the 5 invented-author posts.

## 6 · Files touched this session

```
#29 fix: company claims per Matt (D-027): 8 page templates, __tests__/claims.test.ts; docs: D-027, HANDOFF-006 addendum
#30 design: line length: src/styles/main.css, src/styles/pages/resources.css
#31 content: research (3 builder branches merged + d397891 skeptic fixes): 22 page templates, tools/index.ts,
    resources.css, 4 test files, docs/research/*.md (20 new)

LIVE ENV STATE
  None beyond deploys. Worktrees hbdr-website-r1..r3 removed (all merged, clean); remote branch content/research deleted (renamed to fix/research-content, merged).
```

---

End of HANDOFF-007.
