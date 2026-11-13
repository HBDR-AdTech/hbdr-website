# Legacy blog posts: sources (D-030 row 14)

The five posts that predate the weekly backfill were rewritten on 2026-10-24 (`server/services/legacy-posts.ts`, production via `seed/blog-legacy-rewrite-2026-10-24.sql`). Each keeps its slug, category and published date and is bylined "HBDR Research" (D-006, D-029). No HBDR figure, product, client or feature appears in any of them; the only HBDR fact D-005 allows ("founded in 2015") was not needed.

## How the date rule was checked

D-006 requires every fact to be verifiable on or before the post's date. Every source was opened on 2026-10-24/25 and its text was taken **as it stood before the post's date**:

- **Prebid.org docs** (`docs.prebid.org`): the page's source file in the `prebid/prebid.github.io` repository at the last commit before 00:00 UTC on the post's date.
- **Pages with their own date before the post** (Google's July 2024 Privacy Sandbox post, WebKit's March 2020 post, Google's 2019 first-price post, web.dev "Web Vitals" updated 2024-10-31, web.dev's INP announcement updated 2024-01-31): the live page.
- **Every other page**: the last Internet Archive snapshot taken the day before the post or earlier.

A script then searched those texts for every string the post puts in quotation marks, and for the key unquoted facts (second table under each post). All of them were found. The script was also run against a copy of a post with an invented quote and with a format that is on the Coalition for Better Ads list today but was not before the post's date ("Sticky, Pop-Out Video Ads"); it reported both as missing. That check removed "Sticky, Pop-Out Video Ads" from the ad-experience post: the Coalition's mobile list on 2024-12-30 had eight formats, not nine.

Quotes keep the source's wording, typos included ("pages should have a INP"). Curly apostrophes and quotation marks in the sources are written as straight ones.

## The Future of Header Bidding: Trends to Watch in 2025

`/blog/future-of-header-bidding-2025`, published 2025-01-15. Sources and how each was dated:

- Google, "A new path for Privacy Sandbox on the web" (July 22, 2024): https://privacysandbox.com/news/privacy-sandbox-update/  
  Dated by: live, page dated 2024-07-22
- WebKit, "Full Third-Party Cookie Blocking and More" (March 2020): https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/  
  Dated by: live, post dated 2020-03-24
- Mozilla, "Firefox rolls out Total Cookie Protection by default" (June 14, 2022): https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/  
  Dated by: Wayback snapshot 2024-12-23: https://web.archive.org/web/20241223114057/https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/
- Prebid.org, "pbjs.setConfig: Configure User Syncing": https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html  
  Dated by: prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/dev-docs/publisher-api-reference/setConfig.md
- Prebid.org, "Module: User ID": https://docs.prebid.org/dev-docs/modules/userId.html  
  Dated by: prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/dev-docs/modules/userId.md
- Prebid.org, "Introduction to Prebid": https://docs.prebid.org/overview/intro.html  
  Dated by: prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/overview/intro.md
- web.dev, "Interaction to Next Paint becomes a Core Web Vital on March 12" (2024): https://web.dev/blog/inp-cwv-march-12  
  Dated by: live, last updated 2024-01-31
- web.dev, "Web Vitals": https://web.dev/articles/vitals  
  Dated by: live, last updated 2024-10-31
- web.dev, "Interaction to Next Paint (INP)": https://web.dev/articles/inp  
  Dated by: Wayback snapshot 2025-01-14: https://web.archive.org/web/20250114233945/https://web.dev/articles/inp
- IAB Tech Lab, "ads.txt": https://iabtechlab.com/ads-txt/  
  Dated by: Wayback snapshot 2024-12-17: https://web.archive.org/web/20241217194918/https://iabtechlab.com/ads-txt/
- IAB Tech Lab, "sellers.json": https://iabtechlab.com/sellers-json/  
  Dated by: Wayback snapshot 2025-01-08: https://web.archive.org/web/20250108214103/https://iabtechlab.com/sellers-json/

| Quoted in the post | Source | Publisher | Text as it stood before the post |
|---|---|---|---|
| "announced that they'll be shipping it by 2022." | https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ | WebKit | live, post dated 2020-03-24 |
| "instead of deprecating third-party cookies, we would introduce a new experience in Chrome that lets people make an informed choice that applies across their web browsing." | https://privacysandbox.com/news/privacy-sandbox-update/ | Google Privacy Sandbox | live, page dated 2024-07-22 |
| "cookies for cross-site resources are now blocked by default across the board." | https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ | WebKit | live, post dated 2020-03-24 |
| "a separate ‘cookie jar’ for each website you visit." | https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/ | Mozilla | Wayback snapshot 2024-12-23: https://web.archive.org/web/20241223114057/https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/ |
| "DSPs are more likely to bid on impressions where they know something about the history of the user." | https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html | Prebid.org | prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/dev-docs/publisher-api-reference/setConfig.md |
| "supports multiple ways of establishing pseudonymous IDs for users," | https://docs.prebid.org/dev-docs/modules/userId.html | Prebid.org | prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/dev-docs/modules/userId.md |
| "instead of having several exchanges sync IDs with dozens of demand sources, a publisher can choose to integrate with any of a number of ID schemes." | https://docs.prebid.org/dev-docs/modules/userId.html | Prebid.org | prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/dev-docs/modules/userId.md |
| "client-side implementations typically use 5 – 15 demand partners. Because of the faster processing speeds, server-side will often have more." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/overview/intro.md |
| "can reduce latency and improve page load time." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/overview/intro.md |
| "is required in environments that don't have HTML header sections in which to put JavaScript, such as mobiles apps and Accelerated Mobile Pages (AMP) sites." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/overview/intro.md |
| "the latency of all click, tap, and keyboard interactions that occur throughout the lifespan of a user's visit to a page." | https://web.dev/articles/inp | web.dev (Google) | Wayback snapshot 2025-01-14: https://web.archive.org/web/20250114233945/https://web.dev/articles/inp |
| "publicly declare the companies they authorize to sell their digital inventory." | https://iabtechlab.com/ads-txt/ | IAB Tech Lab | Wayback snapshot 2024-12-17: https://web.archive.org/web/20241217194918/https://iabtechlab.com/ads-txt/ |
| "enables buyers to see all parties who are selling or reselling a given bid request." | https://iabtechlab.com/sellers-json/ | IAB Tech Lab | Wayback snapshot 2025-01-08: https://web.archive.org/web/20250108214103/https://iabtechlab.com/sellers-json/ |

| Stated without quotation marks; source text | Source | Text as it stood before the post |
|---|---|---|
| "Firefox rolls out Total Cookie Protection by default" | https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/ | Wayback snapshot 2024-12-23: https://web.archive.org/web/20241223114057/https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/ |
| "June 14, 2022" | https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/ | Wayback snapshot 2024-12-23: https://web.archive.org/web/20241223114057/https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/ |
| "will replace First Input Delay on March 12" | https://web.dev/blog/inp-cwv-march-12 | live, last updated 2024-01-31 |
| "pages should have a INP of 200 milliseconds or less" | https://web.dev/articles/vitals | live, last updated 2024-10-31 |
| "source code in Go and Java is available" | https://docs.prebid.org/overview/intro.html | prebid.github.io at commit d33dd65b59 (2025-01-13): https://github.com/prebid/prebid.github.io/blob/d33dd65b591aa7cbba7d3145220d7720403cf76b/overview/intro.md |
| "The OpenRTB Working Group finalized the specifications for industry adoption on July 31, 2019" | https://iabtechlab.com/sellers-json/ | Wayback snapshot 2025-01-08: https://web.archive.org/web/20250108214103/https://iabtechlab.com/sellers-json/ |
| "We're discussing this new path with regulators" | https://privacysandbox.com/news/privacy-sandbox-update/ | live, page dated 2024-07-22 |

## How Publishers Can Maximize Ad Revenue Without Sacrificing User Experience

`/blog/maximize-ad-revenue-user-experience`, published 2025-01-08. Sources and how each was dated:

- web.dev, "Web Vitals" (updated October 31, 2024): https://web.dev/articles/vitals  
  Dated by: live, last updated 2024-10-31
- web.dev, "Interaction to Next Paint becomes a Core Web Vital on March 12" (2024): https://web.dev/blog/inp-cwv-march-12  
  Dated by: live, last updated 2024-01-31
- web.dev, "Optimize Cumulative Layout Shift": https://web.dev/articles/optimize-cls  
  Dated by: Wayback snapshot 2025-01-05: https://web.archive.org/web/20250105175014/https://web.dev/articles/optimize-cls
- Google Publisher Tag, "Minimize layout shift": https://developers.google.com/publisher-tag/guides/minimize-layout-shift  
  Dated by: Wayback snapshot 2024-11-27: https://web.archive.org/web/20241127103658/https://developers.google.com/publisher-tag/guides/minimize-layout-shift
- Google Publisher Tag, "Lazy loading": https://developers.google.com/publisher-tag/samples/lazy-loading  
  Dated by: Wayback snapshot 2025-01-07: https://web.archive.org/web/20250107093010/https://developers.google.com/publisher-tag/samples/lazy-loading
- Google Publisher Tag, API reference: https://developers.google.com/publisher-tag/reference  
  Dated by: Wayback snapshot 2025-01-07: https://web.archive.org/web/20250107011833/https://developers.google.com/publisher-tag/reference
- Coalition for Better Ads, "The Initial Better Ads Standards": https://www.betterads.org/standards/  
  Dated by: Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/
- Coalition for Better Ads, "Ad Density Higher Than 30% [Mobile]": https://www.betterads.org/mobile-ad-density-higher-than-30/  
  Dated by: Wayback snapshot 2024-12-12: https://web.archive.org/web/20241212130933/https://www.betterads.org/mobile-ad-density-higher-than-30/
- Prebid.org, "pbjs.setConfig: Configure User Syncing": https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html  
  Dated by: prebid.github.io at commit 9aaf096a37 (2025-01-06): https://github.com/prebid/prebid.github.io/blob/9aaf096a3746136c37c3f366bbd8a621b2cf8fcd/dev-docs/publisher-api-reference/setConfig.md
- Prebid.org, "Introduction to Prebid": https://docs.prebid.org/overview/intro.html  
  Dated by: prebid.github.io at commit 9aaf096a37 (2025-01-06): https://github.com/prebid/prebid.github.io/blob/9aaf096a3746136c37c3f366bbd8a621b2cf8fcd/overview/intro.md

| Quoted in the post | Source | Publisher | Text as it stood before the post |
|---|---|---|---|
| "LCP should occur within 2.5 seconds of when the page first starts loading." | https://web.dev/articles/vitals | web.dev (Google) | live, last updated 2024-10-31 |
| "pages should have a INP of 200 milliseconds or less." | https://web.dev/articles/vitals | web.dev (Google) | live, last updated 2024-10-31 |
| "the 75th percentile of page loads, segmented across mobile and desktop devices." | https://web.dev/articles/vitals | web.dev (Google) | live, last updated 2024-10-31 |
| "Ads are one of the largest contributors to layout shifts on the web." | https://web.dev/articles/optimize-cls | web.dev (Google) | Wayback snapshot 2025-01-05: https://web.archive.org/web/20250105175014/https://web.dev/articles/optimize-cls |
| "if you don't reserve sufficient space for the ads being loaded, they can end up displacing visible non-ad content." | https://developers.google.com/publisher-tag/guides/minimize-layout-shift | Google for Developers | Wayback snapshot 2024-11-27: https://web.archive.org/web/20241127103658/https://developers.google.com/publisher-tag/guides/minimize-layout-shift |
| "min-height CSS rule to reserve space." | https://web.dev/articles/optimize-cls | web.dev (Google) | Wayback snapshot 2025-01-05: https://web.archive.org/web/20250105175014/https://web.dev/articles/optimize-cls |
| "Slots which are likely to be filled should always start out expanded. Slots which are unlikely to fill should always start out collapsed." | https://developers.google.com/publisher-tag/guides/minimize-layout-shift | Google for Developers | Wayback snapshot 2024-11-27: https://web.archive.org/web/20241127103658/https://developers.google.com/publisher-tag/guides/minimize-layout-shift |
| "enables pages to load faster, reduces resource consumption and contention, and improves viewability rate by pausing the requesting and rendering of ads until they approach the user's viewport." | https://developers.google.com/publisher-tag/samples/lazy-loading | Google for Developers | Wayback snapshot 2025-01-07: https://web.archive.org/web/20250107093010/https://developers.google.com/publisher-tag/samples/lazy-loading |
| "least preferred ad experiences." | https://www.betterads.org/standards/ | Coalition for Better Ads | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "by summing the heights of all ads within the main content portion of a mobile page, then dividing by the total height of the main content portion of the page." | https://www.betterads.org/mobile-ad-density-higher-than-30/ | Coalition for Better Ads | Wayback snapshot 2024-12-12: https://web.archive.org/web/20241212130933/https://www.betterads.org/mobile-ad-density-higher-than-30/ |
| "3 seconds after the auction ends" | https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html | Prebid.org | prebid.github.io at commit 9aaf096a37 (2025-01-06): https://github.com/prebid/prebid.github.io/blob/9aaf096a3746136c37c3f366bbd8a621b2cf8fcd/dev-docs/publisher-api-reference/setConfig.md |
| "may wish to move ad-related cookie work to much later in the page load after ads and content have loaded." | https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html | Prebid.org | prebid.github.io at commit 9aaf096a37 (2025-01-06): https://github.com/prebid/prebid.github.io/blob/9aaf096a3746136c37c3f366bbd8a621b2cf8fcd/dev-docs/publisher-api-reference/setConfig.md |
| "you may lose impressions from users who bounce very quickly." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit 9aaf096a37 (2025-01-06): https://github.com/prebid/prebid.github.io/blob/9aaf096a3746136c37c3f366bbd8a621b2cf8fcd/overview/intro.md |

| Stated without quotation marks; source text | Source | Text as it stood before the post |
|---|---|---|
| "pages should maintain a CLS of 0.1" | https://web.dev/articles/vitals | live, last updated 2024-10-31 |
| "will replace First Input Delay on March 12" | https://web.dev/blog/inp-cwv-march-12 | live, last updated 2024-01-31 |
| "The minimum distance from the current viewport a slot must be before we" | https://developers.google.com/publisher-tag/reference | Wayback snapshot 2025-01-07: https://web.archive.org/web/20250107011833/https://developers.google.com/publisher-tag/reference |
| "before we render an ad" | https://developers.google.com/publisher-tag/reference | Wayback snapshot 2025-01-07: https://web.archive.org/web/20250107011833/https://developers.google.com/publisher-tag/reference |
| "percentage of viewport size" | https://developers.google.com/publisher-tag/reference | Wayback snapshot 2025-01-07: https://web.archive.org/web/20250107011833/https://developers.google.com/publisher-tag/reference |
| "Pop-up Ads" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "Prestitial Ads" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "Ad Density Higher Than 30%" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "Flashing Animated Ads" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "Auto-playing Video Ads with Sound" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "Postitial Ads with Countdown" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "Full-screen Scrollover Ads" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "Large Sticky Ads" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "All ad formats count toward ad density, including" | https://www.betterads.org/mobile-ad-density-higher-than-30/ | Wayback snapshot 2024-12-12: https://web.archive.org/web/20241212130933/https://www.betterads.org/mobile-ad-density-higher-than-30/ |
| "Extensive consumer input and empirical data shaped the Better Ads Standards" | https://www.betterads.org/standards/ | Wayback snapshot 2024-12-30: https://web.archive.org/web/20241230161018/https://www.betterads.org/standards/ |
| "the default behavior of Prebid.js is to wait 3 seconds after the auction ends" | https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html | prebid.github.io at commit 9aaf096a37 (2025-01-06): https://github.com/prebid/prebid.github.io/blob/9aaf096a3746136c37c3f366bbd8a621b2cf8fcd/dev-docs/publisher-api-reference/setConfig.md |

## Understanding Programmatic Advertising: A Plain-English Guide for Publishers

`/blog/understanding-programmatic-advertising-guide`, published 2024-12-20. Sources and how each was dated:

- Prebid.org, "Header Bidding Glossary": https://docs.prebid.org/overview/glossary.html  
  Dated by: prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/glossary.md
- Prebid.org, "Introduction to Header Bidding": https://docs.prebid.org/overview/intro-to-header-bidding.html  
  Dated by: prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/intro-to-header-bidding.md
- Prebid.org, "Prebid Timeouts": https://docs.prebid.org/features/timeouts.html  
  Dated by: prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/features/timeouts.md
- IAB Tech Lab, "OpenRTB": https://iabtechlab.com/standards/openrtb/  
  Dated by: Wayback snapshot 2024-11-18: https://web.archive.org/web/20241118215834/https://iabtechlab.com/standards/openrtb/
- Google, "Rolling out first price auctions to Google Ad Manager partners" (September 5, 2019): https://blog.google/products/admanager/rolling-out-first-price-auctions-google-ad-manager-partners/  
  Dated by: live, post dated 2019-09-05
- IAB Tech Lab, "ads.txt": https://iabtechlab.com/ads-txt/  
  Dated by: Wayback snapshot 2024-12-17: https://web.archive.org/web/20241217194918/https://iabtechlab.com/ads-txt/
- IAB Tech Lab, "sellers.json": https://iabtechlab.com/sellers-json/  
  Dated by: Wayback snapshot 2024-12-18: https://web.archive.org/web/20241218125905/https://iabtechlab.com/sellers-json/

| Quoted in the post | Source | Publisher | Text as it stood before the post |
|---|---|---|---|
| "delivered either through an open marketplace through an auction, or as a pre-arranged ‘deal’ that was initiated through systems outside of the publisher's ad server." | https://docs.prebid.org/overview/glossary.html | Prebid.org | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/glossary.md |
| "a system that allows a content publisher to manage their portfolio of ads and deliver those ads according to the defined targeting and pacing rules." | https://docs.prebid.org/overview/glossary.html | Prebid.org | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/glossary.md |
| "allows an individual ad impression to be put up for bid in real-time." | https://iabtechlab.com/standards/openrtb/ | IAB Tech Lab | Wayback snapshot 2024-11-18: https://web.archive.org/web/20241118215834/https://iabtechlab.com/standards/openrtb/ |
| "a protocol defined and managed by the IAB for transacting programmatic ad auctions." | https://docs.prebid.org/overview/glossary.html | Prebid.org | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/glossary.md |
| "The header bidding code calls out to a set of demand partners asking for bids." | https://docs.prebid.org/overview/intro-to-header-bidding.html | Prebid.org | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/intro-to-header-bidding.md |
| "The ad server considers all available ads that could be displayed, including the header bid(s)," | https://docs.prebid.org/overview/intro-to-header-bidding.html | Prebid.org | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/intro-to-header-bidding.md |
| "a delicate balance: too short, and header bidding won't have enough time to take place; too long, and revenue may go down due to delaying the ad server call to the point where users have left the page." | https://docs.prebid.org/features/timeouts.html | Prebid.org | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/features/timeouts.md |
| "transitioning to unified first price auctions for Google Ad Manager." | https://blog.google/products/admanager/rolling-out-first-price-auctions-google-ad-manager-partners/ | Google Ad Manager blog | live, post dated 2019-09-05 |
| "first price auctions have created a more competitive market," | https://blog.google/products/admanager/rolling-out-first-price-auctions-google-ad-manager-partners/ | Google Ad Manager blog | live, post dated 2019-09-05 |
| "indirect line items (like those from Header Bidding implementations) winning an increased share of impressions." | https://blog.google/products/admanager/rolling-out-first-price-auctions-google-ad-manager-partners/ | Google Ad Manager blog | live, post dated 2019-09-05 |
| "a simple, flexible and secure method that publishers and distributors can use to publicly declare the companies they authorize to sell their digital inventory." | https://iabtechlab.com/ads-txt/ | IAB Tech Lab | Wayback snapshot 2024-12-17: https://web.archive.org/web/20241217194918/https://iabtechlab.com/ads-txt/ |
| "discover who the entities are that are either direct sellers of or intermediaries in the selling of digital advertising." | https://iabtechlab.com/sellers-json/ | IAB Tech Lab | Wayback snapshot 2024-12-18: https://web.archive.org/web/20241218125905/https://iabtechlab.com/sellers-json/ |
| "enables buyers to see all parties who are selling or reselling a given bid request." | https://iabtechlab.com/sellers-json/ | IAB Tech Lab | Wayback snapshot 2024-12-18: https://web.archive.org/web/20241218125905/https://iabtechlab.com/sellers-json/ |

| Stated without quotation marks; source text | Source | Text as it stood before the post |
|---|---|---|
| "Ads.txt 1.0" | https://iabtechlab.com/ads-txt/ | Wayback snapshot 2024-12-17: https://web.archive.org/web/20241217194918/https://iabtechlab.com/ads-txt/ |
| "June 2017" | https://iabtechlab.com/ads-txt/ | Wayback snapshot 2024-12-17: https://web.archive.org/web/20241217194918/https://iabtechlab.com/ads-txt/ |
| "The OpenRTB Working Group finalized the specifications for industry adoption on July 31, 2019" | https://iabtechlab.com/sellers-json/ | Wayback snapshot 2024-12-18: https://web.archive.org/web/20241218125905/https://iabtechlab.com/sellers-json/ |
| "The expectation is that SSPs and exchanges would post their sellers.json files" | https://iabtechlab.com/sellers-json/ | Wayback snapshot 2024-12-18: https://web.archive.org/web/20241218125905/https://iabtechlab.com/sellers-json/ |
| "Ads sold by a publisher's sales staff and entered directly into the ad server" | https://docs.prebid.org/overview/glossary.html | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/glossary.md |
| "The demand partners reply with their bids" | https://docs.prebid.org/overview/intro-to-header-bidding.html | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/intro-to-header-bidding.md |
| "The ad server is called, with some or all bids attached to the call" | https://docs.prebid.org/overview/intro-to-header-bidding.html | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/intro-to-header-bidding.md |
| "The ad server displays the winner for each ad unit" | https://docs.prebid.org/overview/intro-to-header-bidding.html | prebid.github.io at commit c503da936c (2024-12-19): https://github.com/prebid/prebid.github.io/blob/c503da936cc1b62a2a37583211087492ea86e067/overview/intro-to-header-bidding.md |

## Client-Side vs. Server-Side Header Bidding: What Moves and What You Trade

`/blog/hbdr-launches-server-side-bidding-platform`, published 2025-02-01. Sources and how each was dated:

- Prebid.org, "Header Bidding Glossary": https://docs.prebid.org/overview/glossary.html  
  Dated by: prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/glossary.md
- Prebid.org, "Introduction to Prebid": https://docs.prebid.org/overview/intro.html  
  Dated by: prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/intro.md
- Prebid.org, "Module: Prebid Server Adapter": https://docs.prebid.org/dev-docs/modules/prebidServer.html  
  Dated by: prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/dev-docs/modules/prebidServer.md
- Prebid.org, "Prebid Server Overview": https://docs.prebid.org/prebid-server/overview/prebid-server-overview.html  
  Dated by: prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/overview/prebid-server-overview.md
- Prebid.org, "Prebid Server: Cookie Sync": https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html  
  Dated by: prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/developers/pbs-cookie-sync.md
- Prebid.org, "Prebid Timeouts": https://docs.prebid.org/features/timeouts.html  
  Dated by: prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/features/timeouts.md
- Prebid.org, "Module: User ID": https://docs.prebid.org/dev-docs/modules/userId.html  
  Dated by: prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/dev-docs/modules/userId.md
- Prebid.org, "pbjs.setConfig: Configure User Syncing": https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html  
  Dated by: prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/dev-docs/publisher-api-reference/setConfig.md
- WebKit, "Tracking Prevention in WebKit": https://webkit.org/tracking-prevention/  
  Dated by: Wayback snapshot 2025-01-30: https://web.archive.org/web/20250130121206/https://webkit.org/tracking-prevention/

| Quoted in the post | Source | Publisher | Text as it stood before the post |
|---|---|---|---|
| "the auction takes place on the client device of the user. Prebid.js is a client side bidding solution." | https://docs.prebid.org/overview/glossary.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/glossary.md |
| "the header-bidding auction takes place on a server." | https://docs.prebid.org/overview/glossary.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/glossary.md |
| "a meta-adapter. It's not an actual bidder, but rather a way to get a batch of bids from other bidders with one request." | https://docs.prebid.org/dev-docs/modules/prebidServer.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/dev-docs/modules/prebidServer.md |
| "if five bidders are moved from the client side to the server side, the browser just makes one request to PBS, which delegates the actual auctions to the server, lightening the load on the user's device." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/intro.md |
| "typically use 5 – 15 demand partners. Because of the faster processing speeds, server-side will often have more." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/intro.md |
| "is required in environments that don't have HTML header sections in which to put JavaScript, such as mobiles apps and Accelerated Mobile Pages (AMP) sites." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/intro.md |
| "Many bidders track their bidder-specific user IDs through cookies. Since bidders will generally serve ads from a different domain than where Prebid Server is hosted, those cookies must be consolidated under the Prebid Server domain so that they can be sent to each demand source as part of auction calls." | https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/developers/pbs-cookie-sync.md |
| "letting it know which server-side bidders will be participating." | https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/developers/pbs-cookie-sync.md |
| "determine whether any bidders are missing or need to be refreshed," | https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/developers/pbs-cookie-sync.md |
| "by default blocks all third-party cookies." | https://webkit.org/tracking-prevention/ | WebKit | Wayback snapshot 2025-01-30: https://web.archive.org/web/20250130121206/https://webkit.org/tracking-prevention/ |
| "DSPs are more likely to bid on impressions where they know something about the history of the user." | https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/dev-docs/publisher-api-reference/setConfig.md |
| "bidRequest.userIdAsEids is made available to Prebid.js adapters and Prebid Server S2S adapters." | https://docs.prebid.org/dev-docs/modules/userId.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/dev-docs/modules/userId.md |
| "within the range of 50%-75% of the Auction Timeout." | https://docs.prebid.org/features/timeouts.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/features/timeouts.md |
| "Unlike Prebid.js, Prebid Server is a server. It needs somewhere to run, and that somewhere ought to be scalable, distributed, and fast." | https://docs.prebid.org/prebid-server/overview/prebid-server-overview.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/overview/prebid-server-overview.md |
| "you can also use a combination of client and server processing to optimize your yield while still reducing latency." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/intro.md |

| Stated without quotation marks; source text | Source | Text as it stood before the post |
|---|---|---|
| "Prebid Server" | https://docs.prebid.org/overview/glossary.html | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/glossary.md |
| "Amazon TAM" | https://docs.prebid.org/overview/glossary.html | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/glossary.md |
| "Google OpenBidding formerly known as Exchange Bidding" | https://docs.prebid.org/overview/glossary.html | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/glossary.md |
| "The default value for s2sConfig.timeout is 75% of the PBJS timeout" | https://docs.prebid.org/features/timeouts.html | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/features/timeouts.md |
| "source code in Go and Java is available" | https://docs.prebid.org/overview/intro.html | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/overview/intro.md |
| "Prebid Server will look at the uids cookie in the host domain" | https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/developers/pbs-cookie-sync.md |
| "It responds with an array of pixel syncs" | https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/developers/pbs-cookie-sync.md |
| "Several Prebid.org members host up-to-date server software" | https://docs.prebid.org/prebid-server/overview/prebid-server-overview.html | prebid.github.io at commit 20503bdb5a (2025-01-31): https://github.com/prebid/prebid.github.io/blob/20503bdb5ae2988102806b1bcaf59c64c42eabe0/prebid-server/overview/prebid-server-overview.md |
| "ITP by default blocks all third-party cookies. There are no exceptions to this blocking" | https://webkit.org/tracking-prevention/ | Wayback snapshot 2025-01-30: https://web.archive.org/web/20250130121206/https://webkit.org/tracking-prevention/ |

## 5 Common Header Bidding Mistakes and How to Avoid Them

`/blog/common-header-bidding-mistakes`, published 2025-01-22. Sources and how each was dated:

- Prebid.org, "Prebid Timeouts": https://docs.prebid.org/features/timeouts.html  
  Dated by: prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md
- Prebid.org, "Price Granularity": https://docs.prebid.org/adops/price-granularity.html  
  Dated by: prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/adops/price-granularity.md
- Prebid.org, "pbjs.setConfig": https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html  
  Dated by: prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/dev-docs/publisher-api-reference/setConfig.md
- Prebid.org, "Introduction to Prebid": https://docs.prebid.org/overview/intro.html  
  Dated by: prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/overview/intro.md
- IAB Tech Lab, "ads.txt": https://iabtechlab.com/ads-txt/  
  Dated by: Wayback snapshot 2024-12-17: https://web.archive.org/web/20241217194918/https://iabtechlab.com/ads-txt/

| Quoted in the post | Source | Publisher | Text as it stood before the post |
|---|---|---|---|
| "a delicate balance: too short, and header bidding won't have enough time to take place; too long, and revenue may go down due to delaying the ad server call to the point where users have left the page." | https://docs.prebid.org/features/timeouts.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md |
| "average user time on page, direct sellthrough, value of different ad channels, and average user network delay." | https://docs.prebid.org/features/timeouts.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md |
| "It could be caused by geographic distribution. Try looking at timeout data by geographic region for patterns." | https://docs.prebid.org/features/timeouts.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md |
| "should be much larger than the auction timeout." | https://docs.prebid.org/features/timeouts.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md |
| "should probably be within the range of 50%-75% of the Auction Timeout." | https://docs.prebid.org/features/timeouts.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md |
| "depends on average user network delay." | https://docs.prebid.org/features/timeouts.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md |
| "Bids received from your Prebid demand partners are rounded down according to your price granularity." | https://docs.prebid.org/adops/price-granularity.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/adops/price-granularity.md |
| "could lose to an ad server bidder that bid 2.51." | https://docs.prebid.org/adops/price-granularity.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/adops/price-granularity.md |
| "Bids also round down to reflect the top price in your granularity definition." | https://docs.prebid.org/adops/price-granularity.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/adops/price-granularity.md |
| "This is important to keep in mind for video inventory, which often sells for higher prices than other media types." | https://docs.prebid.org/adops/price-granularity.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/adops/price-granularity.md |
| "The fewer demand partners that have the opportunity to bid, the fewer the bids, and therefore the faster the processing. But fewer demand partners also means fewer chances for an optimal bid." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/overview/intro.md |
| "client-side implementations typically use 5 – 15 demand partners." | https://docs.prebid.org/overview/intro.html | Prebid.org | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/overview/intro.md |
| "publicly declare the companies they authorize to sell their digital inventory," | https://iabtechlab.com/ads-txt/ | IAB Tech Lab | Wayback snapshot 2024-12-17: https://web.archive.org/web/20241217194918/https://iabtechlab.com/ads-txt/ |

| Stated without quotation marks; source text | Source | Text as it stood before the post |
|---|---|---|
| ""medium": $0.10 increments, capped at $20 CPM (the default)" | https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/dev-docs/publisher-api-reference/setConfig.md |
| "The default value for s2sConfig.timeout is 75% of the PBJS timeout" | https://docs.prebid.org/features/timeouts.html | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md |
| "If only the top bid is sent to the ad server, BidderA will be rounded down to 2.50 and sent" | https://docs.prebid.org/adops/price-granularity.html | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/adops/price-granularity.md |
| "If your price cap is 5.00 and you receive a bid of 20.00, that bid will be rounded down to 5.00" | https://docs.prebid.org/adops/price-granularity.html | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/adops/price-granularity.md |
| "Number of Line Items Required per Bidder" | https://docs.prebid.org/adops/price-granularity.html | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/adops/price-granularity.md |
| "the default behavior of Prebid.js is to wait 3 seconds after the auction ends, and then allow every adapter to drop up to 5 image-based user syncs" | https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/dev-docs/publisher-api-reference/setConfig.md |
| "a JavaScript setTimeout() that publishers should consider establishing after the Prebid.js code is loaded" | https://docs.prebid.org/features/timeouts.html | prebid.github.io at commit f985cefab7 (2025-01-21): https://github.com/prebid/prebid.github.io/blob/f985cefab7b5e507c9ff574789ff8fb90d76d5c5/features/timeouts.md |
## Statements that rest on reasoning, not a quote

These sentences follow from the sourced facts above. None adds a number or a dated event.

| Post | Statement | Based on |
|---|---|---|
| maximize-ad-revenue-user-experience | "So at least three of every four page loads must meet the target." | web.dev: targets are measured at "the 75th percentile of page loads". |
| future-of-header-bidding-2025 | "Readers on Safari and Firefox already arrive without the cross-site cookies that bidders rely on." | WebKit 2020 (cross-site cookies blocked by default) and Mozilla 2022 (a separate cookie jar for each site). |
| future-of-header-bidding-2025 | Chrome's 2022 date "did not happen." | Google's 2024-07-22 post proposes an approach "instead of deprecating third-party cookies", so they were still on in July 2024. |
| hbdr-launches-server-side-bidding-platform | "So in Safari, cookie-based syncing does not work." | Prebid's cookie sync stores bidder IDs in a `uids` cookie on the Prebid Server host's domain and reads each bidder's own cookie; both are third-party cookies on the publisher's page, and WebKit says ITP "by default blocks all third-party cookies. There are no exceptions to this blocking." |
| understanding-programmatic-advertising-guide | The roles of the SSP/exchange and the DSP. | Plain-language descriptions of standard industry roles; no figure or date. Prebid's glossary lists "Ad Server, SSPs, DSPs, etc." as the ad tech industry. |
| all | Practical steps ("What to do", checklists, "Fix") | Advice that applies the sourced facts; no outside figure. |

## Removed from the old posts

| Post | Removed | Why |
|---|---|---|
| all five | Bylines Sarah Chen, Marcus Johnson, Elena Rodriguez, David Park | Invented people (D-006, D-029). |
| hbdr-launches-server-side-bidding-platform | The whole launch: "HBDR Server-Side Bidding 2.0", "under 50ms, a 60% improvement", "40+ new demand partners", "over 200 active bidders", the machine-learning floor model, beta results (35% revenue, 40% page load, 18% viewability, 12% fill), "available immediately" | An invented product launch with invented figures (D-005, D-006). The post is now educational and announces nothing; the slug stays because the URL is indexed. |
| future-of-header-bidding-2025 | "up to 30% faster page load times" (HBDR), "15-25% increase in programmatic revenue", "the deprecation of third-party cookies" | Invented HBDR and industry figures; Chrome's cookie plan in January 2025 was the July 2024 user-choice proposal, not deprecation. |
| maximize-ad-revenue-user-experience | "Research shows that ads placed within content generate significantly higher engagement", "Google's Better Ads Standards", "LCP, FID, and CLS", HBDR "proprietary algorithms" | No source; the standards belong to the Coalition for Better Ads; INP replaced FID on 2024-03-12; invented HBDR feature. |
| understanding-programmatic-advertising-guide | "partnering with an experienced monetization platform like HBDR" | A sales line, not a fact. |
| common-header-bidding-mistakes | "dynamic timeouts can increase bid responses by 15-20%", "our platform addresses all five of these common issues automatically" | Invented figure and invented HBDR feature. |
