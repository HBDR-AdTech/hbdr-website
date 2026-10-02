# Security model — hbdr.com

One page per surface: what it exposes, who can reach it, what stops abuse, how we know. Decisions referenced are in `docs/DECISIONS.md`. Update this file in the same PR as any change to a surface.

## Assets worth protecting

1. **Lead PII** in D1 `contact_leads` (name, email, company, message, IP). Highest value.
2. **Blog content integrity** (`blog_posts`); defacement or stored XSS would hit every visitor.
3. **The hbdr.com sending reputation** (Cloudflare Email Sending, DKIM `cf-bounce`).
4. **The Cloudflare account and GitHub repo** that deploy everything above.

## Surfaces

### Public pages (`/`, solutions, blog, tools, legal)
- Server-rendered strings; no user input is rendered except blog content (admin-authored, passed through the allowlist sanitizer `server/middleware/sanitize.ts`) and the blog filter attributes (escaped with `sanitizeText`).
- Response headers on every Worker response (`server/middleware/security-headers.ts`): CSP with a host allowlist, `frame-ancestors 'none'`, `form-action 'self'`, `object-src 'none'`, `base-uri 'self'`; HSTS 1 year (no `includeSubDomains`; some subdomains are not HTTPS); `X-Frame-Options: DENY`; `nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; Permissions-Policy denies camera, mic, geolocation, payment, USB.
- Known gap: CSP needs `'unsafe-inline'` and `'unsafe-eval'` (Alpine.js CDN build evaluates expressions; inline scripts have no nonces). Upgrade path: Alpine CSP build plus nonces in `renderLayout`.
- Zone: HTTPS forced, TLS 1.2 minimum, TLS 1.3 on, www 301 to apex (D-002).

### Contact and support form (`POST /api/contact`)
- Origin/Referer must match Host (`validateOrigin`), Zod schema validation, disposable-email blocklist, honeypot field, D1-backed per-IP rate limit (`rate_limits`), text sanitized before storage.
- Notification email (D-001, D-004): the `EMAIL` binding may send **only from** `noreply@hbdr.com` and **only to** contact@ / support@hbdr.com (`wrangler.toml`), so a compromised Worker cannot mail anyone else. Submitter text is HTML-escaped in the email body; reply-to is the submitter.
- Failures return 500 and the form shows them (never a fake success).
- Known gap: no CAPTCHA. Upgrade path: Cloudflare Turnstile if spam appears in the leads table.

### Admin (`/admin/*`, `/api/blog*`, `/api/leads*`)
- Authentication is Cloudflare Access only (D-008, D-009): app "HBDR Website Admin", one-time PIN, 24h session, allowlisted emails. There is no app password.
- Defense in depth: the Worker verifies the `Cf-Access-Jwt-Assertion` JWT on every admin path (`server/middleware/auth.ts`): RS256 signature against the team JWKS, issuer, audience (`ACCESS_AUD`), expiry. Missing config fails closed (403). Tested in `server/middleware/__tests__/auth.test.ts`.
- Access also covers every workers.dev hostname of both Workers (and their version-preview wildcards), so there is no path to admin that skips Access.
- Admin mutations are JSON API calls checked by `validateOrigin`; the Access cookie is SameSite=Lax.
- Lead CSV export neutralizes spreadsheet formulas (`csvCell`).
- Logout: `/cdn-cgi/access/logout`.

### Branch previews (`hbdr-website-preview`)
- Deployed by `preview.yml` with `--env preview`: own D1 (`hbdr-website-preview`), no email binding, whole hostname behind Access. Unreviewed branch code never touches production leads.

### Local dev (`npm run dev`)
- MemStorage, no Access, admin open: the server binds to `127.0.0.1` only.

## Supply chain and repo
- Repo is public. `main` is protected: PR required, `preview` check (typecheck, tests, CSS build) must pass, no force-push or deletion.
- GitHub secret scanning with push protection and Dependabot security updates are on. A history scan on 2026-10-02 found no committed credentials.
- CI installs with `npm ci` from the lockfile; third-party actions are pinned by SHA.
- Worker secrets: none. Config that isn't secret (Access team domain and AUD) lives in `wrangler.toml` vars.
- Operator credentials: the Cloudflare API token lives in `~/.config/hbdr/cloudflare.env` (mode 600). It is broad (DNS, Workers, D1, Access); a scoped deploy-only token for CI is the upgrade.

## Email domain
- SPF/DKIM for Cloudflare Email Sending on `cf-bounce.hbdr.com`; Resend records removed (D-007).
- Known gap: DMARC is `p=none` on hbdr.com. Move to `p=quarantine` after reviewing aggregate reports for Google Workspace, Zendesk and SendGrid alignment.

## If something goes wrong
- Suspected admin compromise: remove the email from the Access policy, revoke sessions in Zero Trust (Access → Users), rotate the Cloudflare API token.
- Spam wave on the form: tighten `rate_limits` window, add Turnstile.
- Rollback any Worker change: `npx wrangler rollback` or revert the merge commit.
