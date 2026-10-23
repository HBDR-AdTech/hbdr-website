# /publishers: sources

Every outside fact on `/publishers` (`server/templates/pages/audience/publishers.ts`). All pages were opened and read on 2026-10-23. The new section "Prepare your site" is vendor-neutral advice; the facts in it are below.

| Claim on the page | URL | Publisher | Date | Supporting quote |
|---|---|---|---|---|
| ads.txt at the root domain and subdomains as needed | https://github.com/InteractiveAdvertisingBureau/Supply-Chain-Validation/blob/main/ads.txt%20v1.1.md | IAB Tech Lab, ads.txt 1.1 | retrieved 2026-10-23 | "Publishers should post the "/ads.txt" file on their root domain and any subdomains as needed." |
| DIRECT vs RESELLER | same | IAB Tech Lab | retrieved 2026-10-23 | "A value of 'DIRECT' indicates that the Publisher (content owner) directly controls the account … A value of 'RESELLER' indicates that the Publisher has authorized another entity to control the account" |
| OWNERDOMAIN (ads.txt 1.1) is the business domain of the owner | same, and https://iabtechlab.com/ads-txt/ | IAB Tech Lab | retrieved 2026-10-23 | "OWNERDOMAIN | Specifies the business domain of the business entity that owns the domain/site/app … (Recommended)"; "Ads.txt 1.1 … Adds OWNERDOMAIN and MANAGERDOMAIN variables … August 2022" |
| Never geofence ads.txt | https://support.google.com/admanager/answer/7441288?hl=en | Google Ad Manager Help | retrieved 2026-10-23 | "Your ads.txt / app-ads.txt must not be blocked by a geofence." |
| app-ads.txt on the developer website named in the store listing | https://support.google.com/admob/answer/9363762?hl=en | Google AdMob Help | retrieved 2026-10-23 | "The app store listing must include a developer website" |
| TCF v2.3 mandatory since 28 February 2026; certified CMP for EEA, UK, Swiss traffic | https://iabeurope.eu/transparency-consent-framework/ and https://support.google.com/admanager/answer/14117049?hl=en | IAB Europe; Google Ad Manager Help | retrieved 2026-10-23 | "TCF participants have until 28 February 2026 to adopt TCF v2.3"; "Ad Manager will continue to use the IAB Europe TCF through the use of a certified Consent Management Platform." |
| GPP replaced the US Privacy String in January 2024 | https://github.com/InteractiveAdvertisingBureau/USPrivacy | IAB Tech Lab | retrieved 2026-10-23 | "The US Privacy signal has been deprecated as of January 31, 2024. We strongly advise all users of the US Privacy String to transition to the Global Privacy Protocol" |
| California treats GPC as an opt-out of sale and sharing | https://cppa.ca.gov/faq.html | California Privacy Protection Agency | retrieved 2026-10-23 | "Businesses must honor opt–out preference signals ("OOPS") that meet certain requirements, such as the Global Privacy Control, as a valid request to opt–out of sale/sharing." |
| Core Web Vitals thresholds; INP replaced FID in March 2024 | https://web.dev/articles/vitals and https://web.dev/blog/inp-cwv-march-12 | web.dev | retrieved 2026-10-23 | see `docs/research/how-it-works.md` (same quotes) |
| Reserve slot space with CSS min-height/min-width; fluid slots below the fold or fetched early | https://developers.google.com/publisher-tag/guides/minimize-layout-shift | Google Publisher Tag | retrieved 2026-10-23 | "Minimizing layout shifts involves reserving space for ad slots using CSS, particularly min-height and min-width. Fluid ad slots inherently cause layout shifts and are best placed below the fold or fetched early to reduce impact." |
| Better Ads: mobile ad density over 30% of the main content's height; all formats count; sticky ads count once | https://www.betterads.org/mobile-ad-density-higher-than-30/ | Coalition for Better Ads | revised 2018-02-16 | "Ads that take up more than 30% of the vertical height of a page. Ad density is determined by summing the heights of all ads within the main content portion of a mobile page" / "All ad formats count toward ad density, including "sticky" ads and inline ads. The height of each "sticky" ad is counted once" |
| COPPA compliance date 22 April 2026; separate parental consent before disclosure to ad networks | https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule | Federal Register (FTC) | 2025-04-22 | see `docs/research/trust.md` (same quotes) |

## Other copy changes

- Hero "makes ad monetization effortless" → what the page covers, with the D-027 minimum (500,000 monthly pageviews).
- Requirements lede "publishers of all sizes, from independent blogs" → "from 500,000 monthly pageviews" (D-027).
- Stat row "50%+" → "Up to 50%" (shared component, D-027).
- Core Web Vitals FAQ: the HBDR sentence stays; the three metrics and their thresholds were added.

## HBDR claims left as they are (waiting on Matt)

"No Upfront Costs … no minimums"; "Revenue Guarantee"; "Month-to-month"; "The same ad stack used by the largest publishers in the world"; GAM set up "at no cost"; "2-3 business days" / "5-7 business days" / "2-4 weeks" / "30-60 days"; "retention rate is over 95%"; "Most publishers see no change in Core Web Vitals"; "weekly and monthly summary reports"; the revenue-share FAQ.
