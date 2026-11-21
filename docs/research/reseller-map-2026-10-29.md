# Google resellers on HeaderBiddr's publisher sites — 2026-10-29

**Question.** On the sites that list HeaderBiddr as a seller, which other companies hold a Google reseller seat, and how often?

**Method.**
1. Source list: every `domain` in https://headerbiddr.com/sellers.json, fetched 2026-10-29: 325 rows, 225 distinct seller_ids, 309 web domains plus 3 Android app IDs (Vidio), which have no ads.txt.
2. For each web domain, `GET https://<domain>/ads.txt` (12 s timeout, redirects followed). A non-200 response, or `<html` in the first 500 bytes, counts as unreadable.
3. From each readable file, take every `google.com, pub-…, RESELLER` line and look up the pub ID in https://realtimebidding.google.com/sellers.json (fetched 2026-10-25: 955,051 sellers, 107 MB).
4. HeaderBiddr LLC is in Google's file as `pub-5040103142722271` and `pub-6254331789601537`; those two IDs are counted separately from the others.

**Results.**

| Measure | Value |
|---|---|
| Web domains | 309 |
| ads.txt readable | 228 |
| Sites with a HeaderBiddr Google reseller line | 120 |
| Other Google reseller lines | 17,009 |
| Lines whose pub ID resolves to a company name | 12,660 (74.4%) |
| Other Google reseller lines on the median site | 51 |
| Companies on more of these sites than HeaderBiddr | 14 |

**Top 20 companies by sites (of 228 readable).** A company can hold several pub IDs on one site, so lines can exceed sites.

| Company (name in Google sellers.json) | Sites | Lines |
|---|---|---|
| Medmob | 160 | 289 |
| Yediot Internet | 155 | 226 |
| Playstream | 150 | 150 |
| Gannett Co., Inc. DBA Gannett Media Corp. | 147 | 147 |
| DIDNA, INC. | 145 | 150 |
| Streamlyn Semisoft Private Limited | 142 | 142 |
| Aniview | 132 | 132 |
| Datawrkz Pte Ltd | 129 | 204 |
| Readwhere Digital DMCC | 129 | 140 |
| Mediology Software Private Limited | 129 | 139 |
| Vidgyor Media Technologies Pvt. Ltd. | 128 | 129 |
| Greeter HOLDINGS LTD | 124 | 124 |
| Journkey LTD | 122 | 122 |
| Advergame Techonologies Private Limited | 121 | 204 |
| *HeaderBiddr LLC* | *120* | — |
| INCREMENTX PRIVATE LIMITED | 119 | 119 |
| Niche Classified Media, LLC | 118 | 118 |
| Rockolmo LLC | 114 | 114 |
| ADSOLUT TECHNOLOGY SERVICES L.L.C | 113 | 113 |
| Sharethrough Inc | 110 | 110 |
| Zero1 Inc | 108 | 108 |

**Limits.**
- HeaderBiddr is counted by its Google reseller line only. Its own `headerbiddr.com` lines are covered in `ads-txt-audit-2026-10-23.md`.
- A line in ads.txt shows a seat is authorized, not that it serves impressions or how much revenue it earns.
- 81 of 309 sites returned no readable ads.txt (404, bot block or site down), so the counts are a floor.

**Correction.** The 2026-10-25 run (growth plan v2, first publish) read only the 184 seller_ids that appear once in the seed, so it reported 173 domains, 122 readable, 69 with a HeaderBiddr line and 8,942 other lines. This file replaces those figures.
