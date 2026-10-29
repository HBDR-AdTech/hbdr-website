# HBDR Website Handoff — 008 — 2026-10-25 (company facts sitewide, legal rewrite, legacy posts, sellers.json/ads.txt admin, growth plan)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-007.md (D-027 claims, line length, research content; addendum with D-029/D-030 work).
> Append-only / numbered / immutable.

## Next turn

- **Operator (Matt): merge #33, then #34.** #34 contains #33, so merge in that order. CI deploys main.
- **After #33 deploys:**
  - Smoke-test hbdr.com: all routes return 200, and /publishers shows "Available now" and "Coming soon".
  - **Operator:** run `npx wrangler d1 execute hbdr-website-database --remote --file=seed/blog-legacy-rewrite-2026-10-24.sql`. The check query in its header must then return 5 rows.
  - **Operator:** submit one live test lead and confirm the email arrives with no IP row (D-011, D-036).
- **After #34 deploys:**
  - **Operator:** run `seed/supply-sellers-from-headerbiddr-2026-10-23.sql` on remote D1.
  - Run the comparison command in the #34 body. The only differences should be the 41 repeated ids.
  - **Operator:** in /admin/supply, pick one company per repeated id, and give the other companies new ids (D-036).
- **Growth plan:** Matt picks the first items from https://claude.ai/code/artifact/afada8df-76b5-41c4-b393-50b1b47c4140. The recommendation is 01, 02, 06, 07 and 09. Build nothing from it before his yes.
- **Publisher ads.txt guidance:** `getPublisherAdsTxtLines()` exists, but no public page shows the lines yet, because the partner-lines table is empty. Build the /publishers block when Matt supplies the partner lines.
- **Carried:**
  - Turnstile switch-on at /admin/form.
  - DNSSEC DS at the registrar.
  - Dependabot PR #25.
  - Check whether HeaderBiddr has an X account (D-030 row 12). Not done this session.

---

## 1 · Current state

- **Branches:**
  - `fix/content-answers` at `a6d95a9` → PR #33.
  - `feat/supply-files` at `a4d4f1c` → PR #34. It contains #33.
- **Tests:**
  - #33: 379 / 379.
  - #34 (with #33): 407 / 407.
  - `npm run check` is clean on both.
- **CI:** the `preview` job passes on #33 and #34.
- **Production:** unchanged since `6f3fa8c` (#32). Nothing in this session is deployed.
- **Migrations:** through 0005 on main. #34 adds 0006 (`supply_*` tables).
- **Worktrees:** `~/code/hbdr-website` (`fix/content-answers`) and `~/code/hbdr-website-supply` (`feat/supply-files`). The legal and posts worktrees were merged and removed, and their branches deleted.

## 2 · What just shipped (session 008)

### Retroactively captured
#32 (`b22aaee`, `129719e`, `6f3fa8c`) merged after HANDOFF-007: the header bidding calculator now prices the timeout (D-028). That settles HANDOFF-007's slider question.

### Matt's answers, recorded
| Decision | Topic |
|---|---|
| D-031 | Features live vs coming soon; sellers.json on hbdr.com; no staff names; press through the blog CMS |
| D-032 | Entity HeaderBiddr LLC, 1200 Brickell Ave Ste 1950, Miami FL 33131; Florida law, Miami-Dade venue |
| D-033 | MCM access confirmed. CTV SSAI is shown as available before launch, by Matt's direction; it is not live on 2026-10-24. |
| D-034 | sellers.json and ads.txt on hbdr.com (in #34) |
| D-035 | Legal pages state only measured facts |
| D-036 | Phone number is real; IP out of the lead email (GDPR Art. 5(1)(c)); deletion honored on request; repeated seller_ids |
| D-037 | Posts show their update date; the launch post moves to Education; blog fields escaped; seller-edit rule |

### #33: company facts, legal, legacy posts
- **Claims:** every item in the HANDOFF-007 addendum's content list, applied on 20 templates. The per-number record is `docs/research/performance-claims.md`.
- **Features:** the one feature list is `server/templates/components/features.ts`, shown on /publishers and /how-it-works.
- **/press:** lists Press-category blog posts (`server/routes/pages.ts`, `pages/press.ts`).
- **Legal pages:** rewritten by a builder. Sources are in `docs/research/legal.md`.
  - Public pages set no cookies.
  - Admin sets `CF_AppSession`.
  - The site loads Google Fonts and jsDelivr on every page, and cdnjs on home.
- **Lead email:** no longer carries the IP (`server/services/email.ts`).
- **Legacy posts:** rewritten by a builder.
  - The text lives in `server/services/legacy-posts.ts`, which both dev seeds read.
  - The production change is `seed/blog-legacy-rewrite-2026-10-24.sql`.
  - Sources were checked as of each post's date: `docs/research/blog-legacy-posts.md`.
- **Security:** /blog escapes admin-written fields. JSON-LD escapes `<` (`server/templates/layout.ts`).

### #34: sellers.json and ads.txt
- **Routes:** `/sellers.json` and `/ads.txt` are built from D1.
- **Admin:** `/admin/supply` uses Access, an Origin check and Zod. Each change and its audit row go in one batch.
- **Seed:** loads the 184 seller_ids that appear once.
- **Docs:** spec quotes are in `docs/research/ads-txt-sellers-json.md`; the threat model is in `docs/SECURITY.md`. EXPLAIN plans and costs are in the PR body.

### Growth plan and audits
- **Plan page:** https://claude.ai/code/artifact/afada8df-76b5-41c4-b393-50b1b47c4140, saved at `docs/artifacts/growth-plan.html`.
- **ads.txt audit:** `docs/research/ads-txt-audit-2026-10-23.md` covers 325 publishers:
  - 65 have a line that matches their own seller_id.
  - 33 use another publisher's id.
  - 22 use an id not in sellers.json.
  - 120 have no HeaderBiddr line.
  - 85 have an unreadable ads.txt.
- **sellers.json:** headerbiddr.com/sellers.json has 325 rows but 225 ids. 41 ids repeat, and 14 of them name different companies, which the spec calls invalid.
- **Verification vendors:**
  - Confiant and IAS have Prebid.js RTD modules; DoubleVerify has none (docs.prebid.org, fetched 2026-10-24).
  - The hbdr-api Confiant adapter is a stub.

### Verification
- **Builders and verifier:** 3 builders and 1 adversarial verifier, within the RUN-CONTROL limits of 2 concurrent and 4 per batch.
- **Verifier result:** PARTIAL on #33. It found 7 "real-time" phrases, live PMP/PG wording, about 10 unsupported promises, and a claims test that missed 7 put-back claims.
  - All are fixed in `7e3c3b7`, `735f1cb` and `4189b9a`.
  - The widened test fails on all 8 put-back mutations.
- **Supply and legal:** PASS. The supply gaps (no batch test, the seller-edit rule) are fixed in `fe6945e`.
- **Layout:** no overflow and no overlap at 1440 and 390 px (verifier).
- **Preview smoke:** inconclusive. The preview Worker is behind Cloudflare Access, so every route returned the sign-in page. The live smoke runs after the merge.

## 3 · Architecture decisions worth remembering

- **One writer for claims.** Company facts live only in DECISIONS, and features live only in `FEATURES_NOW` / `FEATURES_SOON`. `claims.test.ts` REMOVED is the guard. When you remove a claim, add its pattern there and watch the test fail with the claim put back.
- **"Real-time" stays when it means the auction** (RTB, real-time auction). It goes when it describes reporting, which is hourly (D-031). The REMOVED pattern is written to tell the two apart.
- **/press reuses the /blog query** (about 92 rows per view) and filters in memory. A category index was judged not worth a migration at this traffic.
- **A sellers.json read failure returns 500, never an empty list.** Crawlers keep their last good copy on an error, but an empty list would tell buyers HBDR has no sellers.
- **The seed loads only the 184 unique ids.** Loading all 325 rows would violate the spec rule and our own primary key. The repeated ids wait for Matt.
- **The supply PR is stacked on the content PR** (#34 contains #33). Merging in order keeps DECISIONS in number order, D-030 to D-037.

## 4 · Open work

- **Ours:**
  - The publisher ads.txt guidance block on /publishers (waits on the partner lines).
  - The HeaderBiddr X account check.
  - The handoff for whichever growth items Matt picks.
- **Blocked on the operator:**
  - The merges and the 2 production SQL runs above.
  - Choosing an entity for each of the 41 repeated ids.
  - The partner ads.txt lines.
  - The lead-funnel count for plan item 03. The Cloudflare connector was not connected, so Matt runs: `npx wrangler d1 execute hbdr-website-database --remote --command "SELECT substr(created_at,1,7) m, COUNT(*) n, SUM(impressions='support-request') support FROM contact_leads GROUP BY m ORDER BY m"`. EXPLAIN it first: it is a full scan of a small table.
- **Agent cost this session:** unknown, because no usage data was read. Read it in `/cost`.

## 5 · Open questions for the operator

1. Merge #33 and #34 now?
2. Does the CornerCast outstream player run for publishers today?
3. Which verification vendor is closest to signing, Confiant or IAS?
4. Should /sellers.json and /ads.txt send Cache-Control? With none, crawlers default to 7 days.
5. Are sellers 301 "strm", 310 "JB" and 311 "SD" real? They are seeded with no domain.
6. Should a retired seller be restorable? Today a retirement is permanent.
7. For counsel, when engaged:
   - an EU/UK representative (Art. 27)
   - a lead retention period
   - a US state-law request process (identity check, response time, appeal)
   - confirmation that lead data is never sold
   - the `"license": "MIT"` in package.json
   - who owns the HBDR mark
   - the removed indemnity clause and fee cap

## 6 · Files touched this session

```
#33 fix/content-answers (28 commits over main; key ones)
  62fda1d e4e860b e05a1c7 f04cce4 5eac761 2da1800  docs: D-031, D-032, D-033, D-036, D-037
  24831ad fix: company facts across 20 templates; NEW components/features.ts, docs/research/performance-claims.md
  69ff0cc 7e3c3b7 735f1cb  tests (press, claims guard), review fixes, blog/JSON-LD escaping
  72129fb 5753d55  NEW docs/artifacts/growth-plan.html, docs/research/ads-txt-audit-2026-10-23.md
  4438324 merge fix/legacy-posts: NEW server/services/legacy-posts.ts, seed/blog-legacy-rewrite-2026-10-24.sql,
          server/__tests__/blog-legacy.test.ts, docs/research/blog-legacy-posts.md; 03b85a8 Education category
  0160be7 merge fix/legal-pages: NEW legal/common.ts, legal-pages.test.ts, docs/research/legal.md;
          MODIFIED the 3 legal templates, services/email.ts (+test); D-035
  a6d95a9 CLAUDE.md

#34 feat/supply-files (adds over #33)
  2e47009 5e6d502 6e5c1b4 aa38e87 b25941e fe6945e 9a6cba7
  NEW migrations/0006_supply.sql, server/services/supply.ts, server/templates/admin/supply.ts,
      server/routes/__tests__/supply.test.ts, seed/supply-sellers-from-headerbiddr-2026-10-23.sql,
      docs/research/ads-txt-sellers-json.md
  MODIFIED storage.ts, mem-storage.ts, d1Storage.ts, routes/api.ts, routes/seo.ts, routes/admin.ts,
      admin/form.ts, admin/leads.ts (nav), d1-storage.test.ts, schema.test.ts, docs/SECURITY.md, CLAUDE.md, DECISIONS (D-034)

LIVE ENV STATE
  None. No production deploy, no remote D1 write. Artifact published (link above).
  .impeccable/config.json (git-excluded): two file-scoped detector ignores for docs/artifacts/growth-plan.html.
```

---

End of HANDOFF-008.
