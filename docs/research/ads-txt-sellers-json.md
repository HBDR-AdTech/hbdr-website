# /sellers.json and /ads.txt on hbdr.com: spec rules

Every rule the hbdr.com implementation follows (`server/services/supply.ts`, `server/routes/seo.ts`, `migrations/0006_supply.sql`), with the spec text it comes from. All sources were opened and read on 2026-10-23.

Sources:

- sellers.json 1.0 (IAB Tech Lab, July 2019): https://github.com/InteractiveAdvertisingBureau/Supply-Chain-Validation/blob/main/sellers-json.md, linked as the specification from https://iabtechlab.com/sellers-json/
- ads.txt 1.1 (IAB Tech Lab, July 2022): https://github.com/InteractiveAdvertisingBureau/Supply-Chain-Validation/blob/main/ads.txt%20v1.1.md, linked as the specification from https://iabtechlab.com/ads-txt/

## sellers.json 1.0

| Rule implemented | Spec quote | Where |
|---|---|---|
| Served at `/sellers.json` on the root domain | "Advertising systems should post the sellers.json file on their root domain and any subdomains as needed." / "under a standard relative path on the server host: "/sellers.json"" (Access Method) | `GET /sellers.json`, `server/routes/seo.ts` |
| `Content-Type: application/json; charset=utf-8` (names include non-ASCII, e.g. "TURKUVAZ REKLAM PAZARLAMA DANIŞMANLIK A.Ş") | "HTTP request header containing "Content-Type: application/json". Additionally, you could use "Content-Type: application/json; charset=utf-8" to explicitly signal UTF8 support." (Access Method) | same |
| A failed database read returns HTTP 500, never an empty seller list | "If the server response indicates the resource does not exist (HTTP Status Code 404) or for any other HTTP error, the last successfully retrieved data set should be utilized." (Access Method) | `seo.ts` comment; test "returns 500, never an empty seller list" |
| `version` is the string `"1.0"` (headerbiddr.com publishes the number `1`) | "version \| string; required \| The version of this spec, currently the only valid value is 1.0." (Parent object) | `renderSellersJson` |
| `sellers` lists every active seller, confidential ones included | "sellers \| object array; required \| The list of all Seller objects that are represented by the advertising system. All sellers must be included even if they are confidential." (Parent object) | same |
| `contact_email`, `contact_address` are operator settings, left out when unset | "contact_email \| string; optional \| An email address to use to contact the Advertising System for questions or inquiries about this file." / "contact_address \| string; optional \| The business address of the advertising system." (Parent object) | `supply_settings`, `/admin/supply` |
| `seller_id` is a required string, also field #2 of the publisher's ads.txt line | "seller_id \| string; required \| This is the same ID that appears in an ads.txt file and in the SupplyChain.nodes array sid property." (Seller object) | `supply_sellers.seller_id` (primary key) |
| One seller_id is one entity, for good: ids are unique, retired instead of deleted, and a taken id (retired or not) is refused with 409 | "It is invalid for a seller_id to represent multiple entities. Every seller_id must map to only a single entity that is paid for inventory transacted with that seller_id. It is valid for a selling entity to have multiple seller_ids within an advertising system." (Seller object) | `POST /admin/api/supply/sellers`, primary key, `schema.test.ts` |
| `seller_type` is PUBLISHER, INTERMEDIARY or BOTH (stored upper case; the API refuses other spellings) | "seller_type \| string; required \| An enumeration of the type of account, either PUBLISHER, INTERMEDIARY, or BOTH. … Note that this field should be treated as case insensitive when interpreting the data." (Seller object) | Zod enum, SQL `CHECK` |
| `is_confidential` is 0 or 1; written only when 1 | "is_confidential \| integer; optional, default 0 \| Indicates whether the identity of the seller is confidential, where 0 = is not confidential and 1 = is confidential." (Seller object) | `renderSellersJson` |
| `name` is required unless confidential; left out for a confidential seller | "name \| string; required when is_confidential=0 \| The name of the company (the legal entity) that is paid for inventory that is transacted under the given seller_id. Can be omitted only when is_confidential is set to 1." (Seller object) | same |
| `domain` is optional: left out for a confidential seller or a seller with no web presence (nullable column) | "domain \| string; required if seller has a web presence and is_confidential=0 \| The business domain name of the company (the legal entity) … Can be omitted when is_confidential is set to 1 or when the seller doesn't have a web presence." (Seller object) | `supply_sellers.domain` nullable |
| `domain` is a bare domain, no scheme or path (the Zod check refuses `https://` and paths) | "Note that domain in sellers.json and SupplyChain are to be populated with only the **root domain** and not a full URL" (Seller object) | `DOMAIN` regex in `supply.ts` |
| Optional `comment` per seller | "comment \| string; optional \| Any helpful description for this inventory. It is useful for sellers that have multiple seller ids to describe what this seller_id represents." (Seller object) | `supply_sellers.comment` |
| Shape follows the sample file: `seller_id`, `seller_type`, `name`, `domain`, optional `comment`; a confidential entry is `seller_id`, `seller_type`, `is_confidential: 1` | Sample File Contents: `{ "seller_id": "00000001", "seller_type": "INTERMEDIARY", "is_confidential": 1 }` | `renderSellersJson` |

Where the spec is silent, and what the code does:

- **Comment on a confidential seller.** The spec says name and domain may be omitted, and says nothing about `comment`. The code leaves `comment` out too, so an operator's note cannot name a confidential seller.
- **The same seller_id twice in one file.** The spec does not say in words that each seller_id appears once. It does say one seller_id maps to one entity, and that `domain` is that entity's business domain, so one entry per id carries everything the spec defines. The table makes seller_id unique.
- **Root domain check.** The spec says implementers "should incorporate Public Suffix list [16] to derive the root domain". The code checks domain syntax (RFC 1123 labels, at least one dot, no scheme, path, port or spaces), not the Public Suffix List: `www.example.com` is accepted. Adding the PSL is the upgrade if operators get it wrong.
- **Retired sellers.** The spec says nothing about removing a seller. A retired seller leaves the file; its row and id stay.
- **Cache headers.** "If no cache-control directives are present, consuming systems should default to an expiry of 7 days." (Expiration). The route sends no Cache-Control today, so crawlers may keep a copy for 7 days. Open question for Matt.
- **`identifiers` (TAG-ID, DUNS).** Optional. HBDR has no TAG certification (D-029), so none is published.

## ads.txt 1.1

| Rule implemented | Spec quote | Where |
|---|---|---|
| Served at `/ads.txt` with `Content-Type: text/plain; charset=utf-8` | "The declarations must be accessible via HTTP and/or HTTPS from the website that the instructions are to be applied to under a standard relative path on the server host: "/ads.txt" and HTTP request header containing "Content-Type: text/plain". It may be advisable to additionally use "Content-Type: text/plain; charset=utf-8" to signal UTF8 support." (3.1) | `GET /ads.txt` |
| Any other Content-Type is an error | "The HTTP Content-type should be ‘text/plain’, and all other Content-types should be treated as an error and the content ignored." (3.2) | test checks the header |
| **hbdr.com shows no ads, so its own /ads.txt is the placeholder record** | "For files that do not otherwise contain authorized advertising system records, use the following "placeholder" record to indicate that the file adheres to the ads.txt specification: `placeholder.example.com, placeholder, DIRECT, placeholder`" (3.2.1) | `renderAdsTxt` |
| Not an empty file and not a 404 | "Prior versions of the ads.txt specification indicated that publishers may simply use an empty ads.txt file to indicate that no advertising system is authorized to buy or sell ads on the website. That method is now deprecated because of ambiguities it creates and should be ignored by consuming systems after March 1, 2020." (3.2.1) | same |
| A `#` line states why the file is a placeholder | "Lines starting with # symbol are considered comments and are ignored." (3.2) | same |
| Record format: `<FIELD #1>, <FIELD #2>, <FIELD #3>[, <FIELD #4>]`, one per line | "`<FIELD #1>, <FIELD #2>, <FIELD #3>, <FIELD #4>`" (3.2) / "The core syntax is a comma separated format with three defined fields and one record per line." (3.4.2) | `adsTxtRecord` |
| Field #1 is a DNS domain name | "The allowed identifiers in field #1 and by definition assumed to be valid DNS domain names obeying RFC 1123" (3.4.2) | Zod `adSystemDomain`, `directLineDomain` |
| No field may hold commas, tabs or whitespace: seller_id, account id and cert id are plain tokens, and every operator value refuses line breaks (a newline would inject a record) | "No field should contain tabs, commas or whitespace, otherwise it should be escaped with URL encoding [13]." (3.4.2) | Zod regexes in `supply.ts` |
| Field #3 is DIRECT or RESELLER | "A value of ‘DIRECT’ indicates that the Publisher (content owner) directly controls the account indicated in field #2 on the system in field #1. … A value of ‘RESELLER’ indicates that the Publisher has authorized another entity to control the account indicated in field #2 and resell their ad space via the system in field #1." (3.3) | Zod enum, SQL `CHECK` |
| Field #4 (certification authority ID) is optional | "Field #4 \| Certification Authority ID \| (Optional) An ID that uniquely identifies the advertising system within a certification authority … A current certification authority is the Trustworthy Accountability Group (aka TAG), and the TAGID would be included here" (3.3) | `cert_authority_id` nullable |
| A line's comment follows `#` | "Comment are denoted by the character "#". Any line containing "#" should inform the data consumer to ignore the data after the "#" character to the end of the line." (3.4.1) | `adsTxtRecord` writes ` # comment` |
| `contact=` carries the sellers.json contact email | "CONTACT \| Contact information \| (Optional) Some human readable contact information for the owner of the file. This may be the contact of the advertising operations team for the website. This may be an email address" (3.5.1); example `contact=adops@example.com` (4.4) | `renderAdsTxt` |
| `OWNERDOMAIN=hbdr.com` | "It is recommended, for clarity, that this value is included in every ads.txt file even if the OWNERDOMAIN does not differ from the domain on which the ads.txt file is hosted." (4.7) and "If this variable is absent, it should be assumed that the OWNERDOMAIN is the same as the domain being monetized and where the ads.txt file was found." (4.7) | `renderAdsTxt` (host of `SITE_URL`) |
| No `MANAGERDOMAIN` on hbdr.com | "(Optional, use only when relevant) When the owner of the site does not manage monetization either globally or in a specific country, the domain of the exclusive management company is included in this variable." (3.5.1) | not written: hbdr.com has no monetization |

Where the spec is silent, and what the code does:

- **The lines a publisher adds.** The ads.txt spec defines the publisher's own file, not how an SSP or manager lists the lines it asks publishers to add. `getPublisherAdsTxtLines(storage, sellerId)` returns the publisher's own line `<direct_line_domain>, <seller_id>, DIRECT` first, then each active partner line. `direct_line_domain` starts as `headerbiddr.com` because existing publisher files point there; Matt switches it. The function returns null if the seller is unknown or retired, or the setting is unset, so a page never shows a wrong list.
- **DIRECT for the publisher's own line.** This follows the brief: HBDR's sellers are all PUBLISHER today. An INTERMEDIARY seller's line would arguably be RESELLER (3.3 definitions above); that case is open for Matt.
- **Line endings.** "The consumer systems should liberally interpret CR, CRLF etc as a record separator." (3.4.2). The file uses LF.

## The headerbiddr.com source file (2026-10-23)

`https://headerbiddr.com/sellers.json`, 41,775 bytes, sha256 `289658803d32a619fd0c40cf31d1107aa98e222e0896f96135c338a718d0be69`. Checked against the rules above:

| Finding | Count | Rule it breaks |
|---|---|---|
| Rows | 325 (all PUBLISHER, none confidential) | — |
| Distinct seller_ids | 225 | — |
| seller_ids repeated with one name, several site domains | 27 ids, 91 rows | `domain` is "The business domain name of the company", one per seller_id |
| seller_ids repeated with different entity names (120 127 136 157 170 173 179 181 186 207 217 223 224 234) | 14 ids, 50 rows | "It is invalid for a seller_id to represent multiple entities." |
| `version` is the number `1` | 1 | "currently the only valid value is 1.0" (string) |
| Domain is a URL (`https://www.wynk.in`) | 1 | "only the **root domain** and not a full URL" |
| Domain is not a domain (`strm`, `JB`, `SD`) | 3 | field is a business domain |
| Domain has capitals | 13 | none (DNS is case-insensitive); lowercased |
| Name with leading or trailing whitespace (2 of them a trailing `\r`); U+00A0 inside "HADS ADVERTISING SL" | 4; 25 | none; trimmed, U+00A0 made a space |
| `contact_address` is "HeaderBiddr a Division of Ortolani Enterprises Inc., 301 W Bay St Ste 14131, Jacksonville, FL 32202" | — | out of date per D-032 |
| https://headerbiddr.com/ads.txt | HTTP 404 | — |

`seed/supply-sellers-from-headerbiddr-2026-10-23.sql` loads the 184 ids that appear once, with only the mechanical cleanup listed in its header, and lists the 41 repeated ids for a person to resolve.
