# / (home): sources

Every outside fact changed on `/` (`server/templates/pages/home.ts`, copy only; the auction, timeout explorer and GSAP scripts are untouched). All pages were opened and read on 2026-10-23.

| Claim on the page | URL | Publisher | Date | Supporting quote |
|---|---|---|---|---|
| Video format: VAST 4.x with OMID for verification and SIMID for interactivity, replacing VPAID | https://iabtechlab.com/simid/ | IAB Tech Lab | retrieved 2026-10-23 | "the Digital Video Technical Working Group is replacing VPAID (Video Player-Ad Interface Definition) with a set of more focused standards – Open Measurement Interface Definition (OMID) for measurement/verification and Secure Interactive Media Interface Definition (SIMID) for interactive" |
| VAST 4.1 added Open Measurement; VAST 4.2 added SIMID | https://iabtechlab.com/standards/vast/ | IAB Tech Lab | retrieved 2026-10-23 | "VAST 4.1 was released in November 2018 with support for Ad Requests, Ad verification with Open Measurement … VAST 4.2 was released in June 2019 with support for interactivity with SIMID." |
| Display: reserve each slot's height so the page does not shift | https://developers.google.com/publisher-tag/guides/minimize-layout-shift | Google Publisher Tag | retrieved 2026-10-23 | "Minimizing layout shifts involves reserving space for ad slots using CSS, particularly min-height and min-width." |
| Display: Better Ads density limits | https://www.betterads.org/mobile-ad-density-higher-than-30/ | Coalition for Better Ads | revised 2018-02-16 | "Ad Experience: Ad Density Higher Than 30%" |
| In-app: "In-App SDK or SDK-less Integration" (comparison row) | `docs/DECISIONS.md` D-027 #5 | HBDR (Matt) | 2026-10-23 | "HBDR offers an in-app SDK or an SDK-less server-side integration" |
| Logo strip "Xandr" → "Microsoft Monetize" | https://learn.microsoft.com/en-us/xandr/ | Microsoft Learn | retrieved 2026-10-23 | "Microsoft Monetize (Powered by Xandr)" |
| "Teads.tv" → "Teads" | https://www.teads.com/blog/outbrain-completes-the-acquisition-of-teads/3145/ | Teads | 2025-02-03 | "The new company will operate under the name Teads." |
| "ShareThrough" → "Sharethrough" | https://www.sharethrough.com/ | Sharethrough | retrieved 2026-10-23 | "Life at Sharethrough … Equativ and Sharethrough commissioned independent research" |
| "Freewheel" → "FreeWheel" | https://www.freewheel.com/ | FreeWheel | retrieved 2026-10-23 | Page title: "Direct Connections to Streaming Video Inventory \| FreeWheel" |
| "Bidmachine" → "BidMachine" | https://bidmachine.io/ | BidMachine | retrieved 2026-10-23 | Page title: "BidMachine. Fastest Growing Mobile Ad Exchange" |
| "Mobilefuse" → "MobileFuse" | https://mobilefuse.com/ | MobileFuse | retrieved 2026-10-23 | Page title: "Home \| MobileFuse" |

## Other copy changes

- Hero fact "50%+" → "Up to 50%" (D-027).
- Display format body and list ("smart layouts", "viewability optimization") → reserved slot sizes, lazy loading below the fold, Better Ads density limits.
- CTV format body ("captures the growing streaming audience") → what the format is (ad breaks in streaming apps, 15- and 30-second spots, VAST).
- Meta and OG descriptions ("enterprise-grade", "cutting-edge") → D-005/D-027 facts: 65+ demand sources, 1B+ impressions a month, since 2015.

## For Matt (not changed)

- Logo strip names left as they are because I could not open a primary source for their status: "AdColony" (the audit says Digital Turbine absorbed it; Digital Turbine is already listed), "Playbuzz" (the audit says it is now EX.CO), "Unity Technology" (the company is Unity). Names that are not demand sources (audit H8): Pixalate, Kevel, Gannett, Vistar Media.
- Comparison rows "Managed Prebid Server", "Dynamic Floor Pricing", "Custom Video Player", "24/7 Technical Support", "Dedicated Account Manager", "Revenue Guarantee"; "Get Started Free"; "based in Miami".
- The new display list says "Lazy loading below the fold" (already claimed on /publishers) and "Reserved slot sizes": confirm HBDR does both.
