# /solutions/display-ads — sources

Retrieved 2026-10-23. HBDR claims left unchanged and waiting on Matt: "above 70%" (lazy-load viewability), "above 85%" (adhesion viewability), "proprietary viewability engine", brand-safety tooling. "Up to 50%" is D-027.

| Claim on the page | Source | Publisher | Date | Supporting quote |
|---|---|---|---|---|
| LCP within 2.5 s | https://web.dev/articles/vitals | web.dev (Google), "Web Vitals" | last updated 2024-10-31, retrieved 2026-10-23 | "LCP should occur within 2.5 seconds of when the page first starts loading." |
| INP of 200 ms or less | same | same | same | "pages should have a INP of 200 milliseconds or less." |
| CLS of 0.1 or less | same | same | same | "pages should maintain a CLS of 0.1. or less." |
| Measured at the 75th percentile | same | same | same | "a good threshold to measure is the 75th percentile of page loads, segmented across mobile and desktop devices." |
| INP replaced FID in March 2024 | https://web.dev/blog/inp-cwv-march-12 | web.dev blog | last updated 2024-01-31, retrieved 2026-10-23 | "Interaction to Next Paint will officially become a Core Web Vital and will replace First Input Delay on March 12." / "INP is now a stable Core Web Vital metric, and has officially replaced First Input Delay (FID)." |
| Ads are a leading cause of layout shift; reserve slot space | https://web.dev/articles/optimize-cls | web.dev, "Optimize Cumulative Layout Shift" | last updated 2025-02-07, retrieved 2026-10-23 | "Ads are one of the largest contributors to layout shifts on the web." / "add a min-height CSS rule to reserve space" |
| GPT lazy-load settings fetchMarginPercent and renderMarginPercent | https://developers.google.com/publisher-tag/reference | Google Publisher Tag reference | last updated 2026-10-21, retrieved 2026-10-23 | "The minimum distance from the current viewport a slot must be before we request an ad, expressed as a percentage of viewport size." / "...before we render an ad" |
| Better Ads Standards rule out pop-ups, prestitials, autoplay video with sound, large sticky ads on mobile | https://www.betterads.org/standards/ | Coalition for Better Ads | retrieved 2026-10-23 | Mobile Web Experiences: "Pop-up Ads", "Prestitial Ads", "Ad Density Higher Than 30%", "Auto-playing Video Ads with Sound", "Large Sticky Ads" |
| Mobile ad density at or below 30% of the main content's height | https://www.betterads.org/mobile-ad-density-higher-than-30/ | Coalition for Better Ads | retrieved 2026-10-23 | "Ad density is determined by summing the heights of all ads within the main content portion of a mobile page, then dividing by the total height of the main content portion of the page." |
| A mobile sticky ad over 30% of the screen fails the standard | https://www.betterads.org/mobile-large-sticky-ad/ | Coalition for Better Ads | retrieved 2026-10-23 | "this static, immobile sticky ad takes up more than 30% of the screen's real estate." |
