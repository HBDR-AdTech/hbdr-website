# /how-it-works: sources

Every outside fact on `/how-it-works` (`server/templates/pages/how-it-works.ts`). All pages were opened and read on 2026-10-23. The new sections "What to check in any header bidding proposal" and "Timeouts and floors in plain terms" are vendor-neutral advice; the facts inside them are below. The onboarding times, support and optimization claims are unchanged (Matt).

| Claim on the page | URL | Publisher | Date | Supporting quote |
|---|---|---|---|---|
| Auction timeout trade-off; each publisher picks its own value from time on page, direct sell-through, channel value and network delay | https://docs.prebid.org/features/timeouts.html | Prebid.org | retrieved 2026-10-23 | "too short, and header bidding won't have enough time to take place; too long, and revenue may go down due to delaying the ad server call to the point where users have left the page. Publishers must determine the value that works for them, considering a balance of factors: average user time on page, direct sellthrough, value of different ad channels, and average user network delay." |
| Prebid Server timeout below the auction timeout, 50–75%; default 75% | same | Prebid.org | retrieved 2026-10-23 | "should probably be within the range of 50%-75% of the Auction Timeout." / "The default value for s2sConfig.timeout is 75% of the PBJS timeout." |
| Failsafe timeout: a setTimeout outside Prebid, much larger than the auction timeout | same | Prebid.org | retrieved 2026-10-23 | "It's a JavaScript setTimeout() that publishers should consider establishing after the Prebid.js code is loaded. It's a safety net that invokes the ad server callback in case something goes wrong. … This value should be much larger than the auction timeout." |
| Diagnose timeouts by region, then by pre-auction time (CMP, user ID, real-time data modules) | same | Prebid.org | retrieved 2026-10-23 | "It could be caused by geographic distribution. Try looking at timeout data by geographic region for patterns." / "check how long you're allowing the Consent Management Platform, User ID modules, and Real Time Data modules to take." |
| Prebid advises against static floors | https://docs.prebid.org/dev-docs/modules/floors.html | Prebid.org | retrieved 2026-10-23 | "Prebid does not recommend setting static floors. They are blunt tools and you'll forget to update them." |
| Floor dimensions: ad unit, GPT slot, media type, size, domain; skip rate = A/B test | same | Prebid.org | retrieved 2026-10-23 | "defined by one or more set of rules containing any or all of the following dimensions: AdUnit, GPT Slot Name, MediaType, Ad Size, Domain" / "If the skipRate flag is specified, there's an A/B test in progress, so the module will decide for this request whether floors processing should be 'skipped' or not." |
| Ad Manager pricing rules apply to Price Priority line items, header bidding trafficking and Open Bidding; higher price wins on overlap | https://support.google.com/admanager/answer/9298008?hl=en | Google Ad Manager Help | retrieved 2026-10-23 | "Prices in pricing rules apply in the following contexts: … Third-party exchanges that participate in Open Bidding; Remnant line item types Price Priority, Network, and Bulk; … Header bidding trafficking" / "If two pricing rules target overlapping inventory, the rule with the higher price applies." |
| Good Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | https://web.dev/articles/vitals | web.dev (Google) | retrieved 2026-10-23 | "LCP should occur within 2.5 seconds" / "pages should have a INP of 200 milliseconds or less" / "pages should maintain a CLS of 0.1. or less" |
| INP replaced FID as a Core Web Vital in March 2024 | https://web.dev/blog/inp-cwv-march-12 | web.dev (Google) | 2024 | "Interaction to Next Paint will officially become a Core Web Vital and will replace First Input Delay on March 12." / "has officially replaced First Input Delay (FID)." |
| Ad Manager uses the TCF via a certified CMP for EEA, UK, Swiss traffic; reads GPP for US states | https://support.google.com/admanager/answer/14117049?hl=en | Google Ad Manager Help | retrieved 2026-10-23 | "served to users in the European Economic Area, the UK, or Switzerland, Ad Manager will continue to use the IAB Europe TCF through the use of a certified Consent Management Platform." |
| DIRECT only for accounts the publisher controls; otherwise RESELLER | https://github.com/InteractiveAdvertisingBureau/Supply-Chain-Validation/blob/main/ads.txt%20v1.1.md | IAB Tech Lab, ads.txt 1.1 | retrieved 2026-10-23 | see `docs/research/trust.md` (same quote) |
| An ads.txt line should match a seller ID in the exchange's sellers.json | https://iabtechlab.com/sellers-json/ | IAB Tech Lab | page updated 2026-10-07 | "A published and accessible sellers.json file allows the identity of the final seller of a bid request to be discovered (assuming that they are ads.txt authorized)." |

## Other copy changes

- Hero "weeks, not months" and steps lede "simple … streamlined" → what the page covers and what to have ready.
- FAQ "new premium demand partners" → "HBDR's 65+ demand sources" (D-027).
- Link to the home page timeout explorer (D-026).

## HBDR claims left as they are (waiting on Matt)

"2-4 weeks" integration and "zero downtime"; "proprietary AI-powered bid optimization, managed Prebid server"; "Our algorithms continuously analyze auction data"; "dedicated account manager who monitors your performance daily"; "consistently drive quarter-over-quarter revenue growth"; "24/7 technical support team".
