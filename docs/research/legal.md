# Legal pages: sources

Every fact stated on `/privacy-policy`, `/terms` and `/gdpr-cookie-policy` (`server/templates/pages/legal/`), with the record that shows it. Measured on 2026-10-23. Line numbers are at commit `e4e860b` (branch `fix/legal-pages`). Test: `server/routes/__tests__/legal-pages.test.ts`.

## 1. Cookies (measured)

| Fact on the pages | How it was measured | Result |
|---|---|---|
| Public pages set no cookies | Dev server (`npm run css:build`, `tsx server/index.ts`, port 5000): `curl -D` on all 27 `PAGE_ROUTES` (`server/config.ts:18-26`) plus `/robots.txt` and `/sitemap.xml` | 29 responses, 200 each, 0 `Set-Cookie` |
| Same on the live site | `fetch` of the same 29 paths on https://hbdr.com (cf-ray `a4f366b7ad38ce96-EWR`, Fri 23 Oct 2026 20:13 GMT) | 29 × 200, 0 `Set-Cookie` |
| Blog posts set no cookies | All 92 `/blog/*` URLs in the live sitemap (119 URLs) | 0 `Set-Cookie`, no external images, iframes or media |
| Form responses set no cookies | Dev server: `POST /api/contact` with a valid contact body and a valid support body (`_source: support`) | 200 "Message Sent!" both, 0 `Set-Cookie`. Not run on live: it would create a real lead and email (D-011) |
| No code sets cookies or browser storage | `rg "localStorage|sessionStorage|document.cookie|setCookie|Set-Cookie|getCookie" server shared worker.ts src public` | No match |
| `CF_AppSession` on admin addresses, 24 hours | Live `GET /admin`, `/admin/leads`, `/api/leads` (no sign-in) | 302 to `securehbdr.cloudflareaccess.com`, `Set-Cookie: CF_AppSession=…; Expires=Sat, 24 Oct 2026 20:13:39 GMT; Path=/; Secure; HttpOnly` (24 h after the request) |
| `CF_AppSession` purpose | https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/ (updated Aug 3, 2026) | "CSRF token used per application domain, scoped to individual applications behind Access … 24 hours … Required" |
| `CF_Authorization` after sign-in | same page | "JSON web token (JWT) set on the domain protected by Access that allows Access to confirm that the user has been authenticated and is authorized to reach the origin … If neither are set, defaults to 24 hours." Also set on the team domain: "set on the `cloudflareaccess.com` team domain that contains the user's identity" |
| Session is 24 hours | D-008: "one-time PIN, 24h session" | — |
| `cf_clearance` only when Cloudflare challenges | https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/ (updated Oct 12, 2026) | "`cf_clearance` Clearance Cookie stores the proof of challenge passed. It is used to no longer issue a challenge if present." Not seen in any measured response |
| Third-party hosts set no cookies | `fetch` of the Google Fonts CSS URL from `layout.ts:45`, one fonts.gstatic.com font file from it, both jsDelivr scripts (`layout.ts:47-48`), both cdnjs scripts (`layout.ts:17-18`) | All 200, `Set-Cookie: []` each |
| No cookie banner | `rg -i "cookie.?banner|cookie.?consent|consent" server/templates` outside `legal/`: only article text on `/trust` and `/solutions/in-app-ads` about HBDR's ad services; no banner markup or script | — |

The old cookie table listed `_hbdr_session`, `_hbdr_csrf`, `_hbdr_consent`, `_ga`, `_ga_*`, `_gid`, `_pbjs_userid_*`, `__gads`, `_hbdr_prefs`, `_hbdr_tz`. None appears in any measured response; the test fails if any returns.

## 2. Third-party scripts and requests (measured)

| Host | Where | Source |
|---|---|---|
| fonts.googleapis.com, fonts.gstatic.com | Every page | `layout.ts:43-45`; live HTML: 54 link tags to googleapis, 27 to gstatic over 27 pages |
| cdn.jsdelivr.net (Alpine.js 3.14.8 + intersect) | Every page | `layout.ts:47-48`; live HTML: 54 script tags over 27 pages, 184 over 92 posts |
| cdnjs.cloudflare.com (GSAP 3.12.5 + ScrollTrigger) | Home page only | `layout.ts:17-18, 48` (`gsap` option); only `home.ts:549` passes `gsap: true`; live: 2 script tags, both on `/` |
| challenges.cloudflare.com (Turnstile) | Contact and support forms, only while switched on | `contact-form.ts:151`, `support.ts:170` render it only with a site key; live `/contact` and `/support` HTML has no `turnstile/v0/api.js` (off on 2026-10-23) |
| static.cloudflareinsights.com (Web Analytics) | Not loaded | `layout.ts:345` renders it only with `cfAnalyticsToken`; no caller passes it (`rg cfAnalyticsToken`); live HTML of all 27 pages: no `cloudflareinsights` |
| Ad tags, pixels, trackers | None | Live HTML scanned for googletagmanager, google-analytics, gtag(, fbq(, facebook, doubleclick, linkedin px, hotjar, clarity, pbjs, prebid: the only hits are article text about Prebid (e.g. "Managed Prebid Server", "Source: Prebid.org") |

Visitors' browsers send their IP address and user agent to every host they download a file from; that is how HTTP works. Google's and jsDelivr's privacy pages did not return text to a plain fetch, so the pages make no claim about how those hosts use the data.

## 3. Data collected

| Fact | Source |
|---|---|
| Contact form fields, required flags | `server/services/form-config.ts:37-59` (`DEFAULT_FORM_FIELDS`): name, email, company, impressions locked and required; phone, role optional; inventoryTypes, property, adsTxtUrl, currentSetup required; appStoreUrls, topGeo, timeline, referral, message optional |
| Operator can change fields and add up to 20 custom fields | D-016; stored in `contact_leads.custom_fields` (`migrations/0004_form_config.sql`) |
| Support form fields: name, email, subject, priority, description | `server/templates/pages/support.ts:104-112` (subject and priority packed into `company`) |
| Core schema and length caps | `shared/schema.ts:9-14` |
| Stored columns | `migrations/0001_init.sql` (`name, email, company, impressions, message, ip, source, status, created_at`), `0003_lead_details.sql`, `0004_form_config.sql` (`custom_fields`, `bot_check`). No user-agent column |
| IP recorded on submit | `server/routes/api.ts:46` (`getClientIp` → `cf-connecting-ip`, `rate-limit.ts:91-95`), stored `api.ts:141` |
| Rate limit: 5 per 15 minutes, IPv6 by /64 | `server/middleware/rate-limit.ts:6-7`, `bucketKey` lines 31-38, D1 table `migrations/0002_rate_limits.sql` |
| Rate-limit rows removed after the window, on the next submission | `rate-limit.ts:63-66`: `DELETE FROM rate_limits WHERE window_start < now − 15 min`, run in the same batch as every check; the check runs on every `POST /api/contact` (`api.ts:49`) |
| Lead email includes all answers **and the IP address** | `server/services/email.ts:41-75` (IP row at lines 71-72); sent to contact@ or support@ (`server/config.ts:10-11`, `email.ts:119-121`) |
| Request logs hold name and email when a notification is sent; IP when the spam trap fires | `email.ts:126` (`console.log` with name and email), `api.ts:69` (honeypot logs IP), `worker.ts:26` (`logger()` logs method, path, status) |
| Workers Logs on | `wrangler.toml:11-12` |
| Workers Logs kept up to 7 days | https://developers.cloudflare.com/workers/observability/logs/workers-logs/ : "Maximum log retention period 7 Days" (Free plan 3 days, Paid 7 days) |
| Only forms send data from the browser | `rg "fetch\(|sendBeacon|XMLHttpRequest" server/templates`: public pages only `contact-form.ts:109` and `support.ts:101` (`/api/contact`); the rest are admin |
| No accounts, no payments on the site | No signup or payment route in `server/routes/` |

## 4. Retention

| Fact | Source |
|---|---|
| Leads kept, no deletion | D-013: "`contact_leads` is append-only … nothing in code or migrations may delete, drop or truncate the table" |
| IPs kept with the lead | D-018: "`contact_leads.ip` stays, kept forever with the lead (D-013); there is no retention job" |
| Offline backups | D-013: "offline exports at `~/.config/hbdr/backups/contact_leads-<UTC>.sql` (mode 600, PII, never committed)". No deletion rule exists for them |
| D1 Time Travel 30 days | D-013: "D1 Time Travel (30-day point-in-time restore)"; https://developers.cloudflare.com/d1/reference/time-travel/ : "up to 30 days in the past (Workers Paid plan) or 7 days (Workers Free plan)" |
| Rate-limit rows 15 minutes | §3 above; D-018: "`rate_limits` rows are deleted after their 15-minute window" |

## 5. Processors

| Provider | Role | Source |
|---|---|---|
| Cloudflare Workers, D1, Email Sending, Access, Workers Logs | Host, database, notifications, admin sign-in, logs | `wrangler.toml` (`main`, `[[d1_databases]]`, `[[send_email]]`, `[observability]`), D-001, D-008/D-009 |
| Cloudflare Turnstile | Bot check while switched on | D-016 rule 4; `server/services/turnstile.ts:17` sends `remoteip` to siteverify |
| Turnstile signals | https://www.cloudflare.com/turnstile-privacy-policy/ (updated June 18, 2025) §3: "Cloudflare Turnstile processes a variety of client-side signals ("Signals") such as client IP address, TLS Fingerprint, User-Agent Header and Sitekey and associated origin." §4: "The purpose of collecting these Signals is not to identify, profile or target any individuals but solely to detect and block bots." |
| Cloudflare cdnjs | GSAP on the home page | §2 |
| Google Workspace | Hosts contact@ and support@, where notifications land | `dig +short MX hbdr.com` → `aspmx.l.google.com` (priority 1) and alt1-4; D-001: "the Google Workspace MX on the apex is untouched" |
| Google Fonts | Fonts | §2 |
| jsDelivr | Alpine.js | §2 |
| Notifications go only to HBDR mailboxes | `wrangler.toml:29-30` (`allowed_destination_addresses = ["contact@hbdr.com", "support@hbdr.com"]`) |
| Cloudflare cookie data may be processed in the US | Cloudflare Cookies page: "By default, cookie data may be processed in Cloudflare's data center in the United States" |

## 6. Security statements

| Fact | Source |
|---|---|
| HTTPS only | `security-headers.ts` HSTS `max-age=31536000`; `docs/SECURITY.md:18` "Zone: HTTPS forced" |
| Admin behind Access, JWT checked by the Worker | D-009; `docs/SECURITY.md:28-29`; `server/middleware/auth.ts` |
| Input checked and length-capped | D-015 rule 1; `shared/schema.ts:9-14`; `form-config.ts` `maxLength` per field |

## 7. Rights and law

| Statement | Source |
|---|---|
| GDPR legal bases (Art. 6(1)(b), (f)) | https://gdpr-info.eu/art-6-gdpr/ : "(b) processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract; … (f) processing is necessary for the purposes of the legitimate interests pursued by the controller". The choice of basis per purpose is the builder's reading; counsel to confirm |
| Complaint to a supervisory authority | https://gdpr-info.eu/art-77-gdpr/ : "every data subject shall have the right to lodge a complaint with a supervisory authority, in particular in the Member State of his or her habitual residence, place of work or place of the alleged infringement" |
| CCPA rights: know, delete, opt out (incl. GPC), non-discrimination | https://oag.ca.gov/privacy/ccpa (updated August 28, 2026): "The right to know … The right to delete … The right to opt-out of the sale or sharing … including via the GPC; The right to non-discrimination" |
| GPC is an opt-out of sale/sharing | same page, FAQ B.8: "the GPC is a 'stop selling or sharing my data switch' … it must be honored by covered businesses as a valid consumer request to stop the sale or sharing of personal information"; https://cppa.ca.gov/faq.html (see `docs/research/trust.md`) |
| The site does not read GPC or DNT | `rg -i "sec-gpc|globalPrivacyControl|DNT"` in `server/`: no match. Nothing to switch off: §1 and §2 |
| No sale or sharing for cross-context advertising | Technical half measured (§1, §2: no ad or analytics tags; lead data goes only to the mailboxes allowed by `wrangler.toml:30`). Business half (no offline sale of lead lists) is from the brief, not from DECISIONS: Matt to confirm |
| Entity, address, venue | D-032 |
| No revenue guarantee; revenue share and payment set by contract | D-029 row 4 |
| Calculators are illustrative; demos use example data | D-028 ("the page labels it illustrative"), D-026, D-019/D-022 |
| Inventory types (websites, mobile apps, CTV / OTT) | D-014 |

## Removed because nothing supports them

Data Protection Officer, "respond within 30 days", "we honor Do Not Track", billing and payment information, ad performance and auction data, web beacons and pixel tags, SCCs and partner contracts, security audits and penetration testing, employee training, encryption at rest, 30-day notice of changes, account terms, 30-day termination and 60-day settlement, the 12-month fees liability cap, indemnification, and the phone number (786) 675-6080 (not in DECISIONS; the brief names contact@hbdr.com as the contact).
