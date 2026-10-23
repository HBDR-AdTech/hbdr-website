# /solutions/open-bidding — sources

Retrieved 2026-10-23. HBDR claims (partner selection, hybrid strategy, reporting, tuning) unchanged. Google publishes no Open Bidding fee percentage in its help pages, so the page names the revenue share and the Direct Pay media fee without a number.

| Claim on the page | Source | Publisher | Date | Supporting quote |
|---|---|---|---|---|
| Open Bidding reduces, but does not remove, header bidding latency | https://support.google.com/admanager/answer/7128453 | Google Ad Manager Help, "Introduction to Open Bidding" | retrieved 2026-10-23 | "Open Bidding in Ad Manager also reduces the latency historically associated with header bidding." |
| Ad Manager calls partners server-to-server; no bidder code on the page | same | same | same | "Ad Manager communicates directly with third-party demand partners in a server-to-server connection." / "Ad Manager ad server, which calls all yield partners at once" |
| A contract with each partner is needed before it can bid | same | same | same | "before a publisher can connect with an Open Bidding yield partner, the publisher must have an established contractual relationship with that partner." |
| The ad response waits while Ad Manager collects bids (sequence) | https://support.google.com/admanager/answer/7128958 | Google Ad Manager Help, "How Open Bidding works" | retrieved 2026-10-23 | "For each Open Bidding yield partner assigned to an eligible yield group, Ad Manager sends a bid request to collect their highest bids." then "2d. Ad Manager hosts a unified auction and selects a winner" |
| Partners compete with the AdX bid and the best line item in one unified auction | same | same | same | "comparing yield partner bids, the Ad Exchange bid and other direct line items via dynamic allocation" |
| A partner can time out | https://support.google.com/admanager/answer/9189594 | Google Ad Manager Help, "Open Bidding FAQ" | retrieved 2026-10-23 | "There was an unexpected system error or timeout on the yield partner's end." |
| Partner list limited to onboarded exchanges | same | same | same | "Review the list of bidders available for onboard online." |
| Highest net bid wins | https://support.google.com/admanager/answer/152039 | Google Ad Manager Help, "Auction model" | retrieved 2026-10-23 | "Ad Manager determines the winning bidder based on the highest net bid submitted. The net bid takes into account Google's revenue share" |
| Unified first-price auctions since 2019 (end of last look) | https://blog.google/products/admanager/rolling-out-first-price-auctions-google-ad-manager-partners/ | Google Ad Manager blog | 2019-09-05 | "we're transitioning to unified first price auctions for Google Ad Manager" / "we'll continue with the full roll out of first price auctions to all partners using Google Ad Manager" |
| Paid with the AdX payment, itemized, net of Google's revenue share | https://support.google.com/admanager/answer/9752368 | Google Ad Manager Help, "Open Bidding payments" | retrieved 2026-10-23 | "Payments for Open Bidding impressions are made net of Google's revenue share." / "an itemized list, displaying revenue from Ad Exchange and third-party exchanges separately." |
| Direct Pay beta: SSPs pay directly; Google bills a %-media fee | https://support.google.com/admanager/answer/15523248 | Google Ad Manager Help, "Set up Open Bidding Direct Pay (Beta)" | retrieved 2026-10-23 | "Publishers are paid directly by the SSP." / "Google bills the publisher a %-media fee for all Open Bidding Direct Pay impressions." |

Advice, not a sourced fact: calling the same exchange through Prebid and Open Bidding lets it bid against itself for one impression.
