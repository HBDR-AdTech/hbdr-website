# /tools: sources

Every outside fact on `/tools` (`server/templates/tools/index.ts`). All pages were opened and read on 2026-10-23. The calculator math and the "+35%" HBDR uplift line are unchanged (Matt is confirming them); the page now describes each multiplier as an illustrative assumption because none has a cited benchmark.

| Claim on the page | URL | Publisher | Date | Supporting quote |
|---|---|---|---|---|
| Page RPM = earnings ÷ pageviews × 1,000 | https://support.google.com/adsense/answer/190515?hl=en | Google AdSense Help | retrieved 2026-10-23 | "RPM = (Estimated earnings / Number of page views) * 1000" |
| eCPM = earnings ÷ impressions × 1,000 | https://support.google.com/admob/table/16327896?hl=en | Google AdMob Help (Glossary) | retrieved 2026-10-23 | "eCPM is calculated as (Total Earnings / Impressions) x 1000." |
| ARPDAU = ad earnings ÷ daily active users | same | Google AdMob Help (Glossary) | retrieved 2026-10-23 | "ARPDAU (metric) The average revenue per daily active user (ARPDAU) from ad revenue. It's calculated by: Estimated earnings / Active users" |
| Fill rate = impressions ÷ ad requests | https://support.google.com/admanager/answer/7304688?hl=en | Google Ad Manager Help (historical sell-through report) | retrieved 2026-10-23 | "Total fill rate Formula: (# Total impressions) ∕ (# Total ad requests)" |
| Match rate = matched requests ÷ requests; not every matched ad is shown | https://support.google.com/admob/table/9462111?hl=en | Google AdMob Help (Reports glossary) | retrieved 2026-10-23 | "Match rate The percentage of ad requests that received a response from an ad source. It's calculated by dividing matched requests by requests" / "Show rate The percentage of returned ads that were displayed in the app to the user. It's calculated by dividing impressions by matched requests" |
| Display viewable: ≥50% of pixels for ≥1 continuous second; 30% for ads of 242,500+ pixels | https://www.mediaratingcouncil.org/sites/default/files/Standards/081815%20Viewable%20Ad%20Impression%20Guideline_v2.0_Final.pdf | Media Rating Council (with IAB) | Version 2.0, 2015-08-18 | "Pixel Requirement: Greater than or equal to 50% of the pixels in the advertisement were on an in-focus browser tab on the viewable space of the browser page, and Time Requirement: The time the pixel requirement is met was greater than or equal to one continuous second, post ad render." / "for display ads sized at 242,500 pixels (which is equivalent to the size of a 970 x 250 pixel display ad) or greater, a viewable impression should be counted if 30% of the pixels in the ad are on an in-focus browser tab on the viewable space of the browser page for a minimum of one continuous second." |
| Video viewable: ≥50% of pixels for 2 continuous seconds | same | Media Rating Council | 2015-08-18 | "A Video Ad that meets the criteria of 50% of the ad's pixels on an in-focus browser tab in the viewable space of the browser page can be counted as a Viewable Video Ad Impression if … it is required that 2 continuous seconds of the video advertisement is played" |
| Timeout trade-off; Prebid Server timeout 50–75% of the auction timeout | https://docs.prebid.org/features/timeouts.html | Prebid.org | retrieved 2026-10-23 | "too short, and header bidding won't have enough time to take place; too long, and revenue may go down due to delaying the ad server call to the point where users have left the page." / "should probably be within the range of 50%-75% of the Auction Timeout." |
| VAST 4.1 added Open Measurement verification; VAST 4.2 added SIMID | https://iabtechlab.com/standards/vast/ | IAB Tech Lab | retrieved 2026-10-23 | "VAST 4.1 was released in November 2018 with support for Ad Requests, Ad verification with Open Measurement, and integration of DAAST for Audio ads. VAST 4.2 was released in June 2019 with support for interactivity with SIMID." |
| VAST 4.3 is the latest listed release, with a 2024 CTV addendum | same | IAB Tech Lab | retrieved 2026-10-23 | Version history table: "VAST Addendum for CTV 2024 … July 2024", "VAST 4.3 … December 2022" (no later VAST version listed) |

## Removed because no source supports them

- "Estimates based on industry benchmarks" (no benchmark is cited) → "Multipliers are illustrative assumptions, not measured benchmarks."
- Tooltips: "CPM uplift ranges from 20-60%", "improves fill rates by 5-20%", "diminishing returns above ~20", "Direct sales command up to 40% premium", "iOS users typically generate higher eCPMs", "Ad spending peaks in Q4", and similar → each tooltip now says what the input does in the model.

## Model facts stated on the page (read from the code, not outside sources)

Display effective eCPM divides by all ad requests; viewability does not change revenue; the header bidding timeout is priced with the home explorer's illustrative assumptions (D-028: bids arrive evenly from 100 to 1,200 ms; 2% of impressions lost per 100 ms over 300 ms); partner factor runs 0.7x at 5 partners to 1.0x at 50; targetability factor 0.76x–1.3x; MAU = DAU × 3.2; CTV ad load assumes 30-second ads; HBDR uplift line = result × 1.35.

## HBDR claims left as they are (waiting on Matt)

"+35%" uplift on all five calculators; "Request a Free Audit"; "No commitment required. Results typically delivered within 48 hours."
