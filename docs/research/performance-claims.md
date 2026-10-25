# Performance claims — decision per number (D-029 row 8)

Rule: a number stays only if it is an HBDR fact in DECISIONS (D-005, D-027, D-029, D-030, D-031) or an outside fact with a quoted source in `docs/research/`. Each kept number is stated the same way on every page. `server/routes/__tests__/claims.test.ts` (`REMOVED`) fails if a removed number returns.

| Number (old wording) | Where it was | Decision | Why |
|---|---|---|---|
| +35% calculator uplift (`× 1.35`) | /tools, every calculator | **Changed** to "up to +50%" (`× 1.5`), labelled "With HBDR, up to", with a note that results depend on traffic and setup | HBDR's only revenue-lift claim is "up to 50%" (D-027). A flat 35% projection was a second, unsourced claim. |
| "20–40% within 30 days" | (removed before this change) | Stays removed | No source; contradicts D-027. |
| 95%+ publisher retention | /publishers FAQ | **Removed** | Not in DECISIONS; no record supports it. |
| < 100 ms auction / "less than 100ms added to page load" / "Zero impact on page load" | /solutions/header-bidding (spec list and server-side card), /support FAQ | **Removed** | Not in DECISIONS. Prebid Server time depends on each bidder's response and the publisher's timeout (see `docs/research/header-bidding.md`, `tools.md`). |
| Viewability "above 70%" (lazy loading) and "above 85%" (adhesion) | /solutions/display-ads (body and spec list) | **Removed**; the spec list now gives the MRC viewable definition (≥ 50% of pixels for 1 continuous second) | No HBDR measurement supports the percentages. The MRC definition is quoted in `docs/research/tools.md`. |
| "90%+ completion rates", "Highest eCPMs" (rewarded video) | /solutions/in-app-ads | **Removed** | No source. |
| AdX "2–3×" AdSense | (removed in #31) | Stays removed | No source. |
| CTV "5–10×" display | (removed in #31) | Stays removed | No source. |
| "Real-time dashboard", "updates every few minutes" | home table, /publishers, /support, /dashboard, /trust, /solutions/header-bidding, /solutions/manage-inventory | **Changed** to "hourly reporting" | D-031: the dashboard updates hourly. |
| Support "Response within 24 hours" / "within 4 hours" (Priority) | /support channel table and form confirmation | **Changed** to "Tickets open 24/7; people answer Mon–Fri, 9am–6pm ET" and an account-manager row | D-029 row 6 sets the hours; no response-time commitment is in DECISIONS. |

## Kept numbers (each from DECISIONS)

| Number | Decision |
|---|---|
| Up to 50% revenue lift | D-027 |
| 1B+ impressions a month (reached 2024); 1T+ ads served (passed 2025) | D-005, D-030 |
| 500+ publishers; 47,000+ sites; 65+ demand sources | D-027 |
| 500,000+ monthly pageviews | D-027 |
| Average go-live 1–3 business days | D-029 |
| Net 30 (Google) / Net 60 (other sources) | D-029 |
| Founded 2015; 25+ years combined team experience | D-005 |
