# CLAUDE.md

## Project Purpose

HBDR Website is a server-rendered marketing site for HBDR, an ad-tech company specializing in header bidding and publisher monetization. It includes 26+ pages, a blog with CMS admin panel, contact form with lead capture, and publisher revenue calculators.

## Tech Stack

- **Server**: Hono (TypeScript) on Node.js, deployable to Cloudflare Workers
- **Interactivity**: Alpine.js (CDN) for form state, toggles, accordions, tool calculators
- **Styling**: Tailwind CSS v4 + DaisyUI v5 (build step), inventory-blueprint design on every public page (D-020)
- **Motion**: GSAP 3.12.5 + ScrollTrigger (cdnjs, SRI) only on pages that pass `gsap: true` to `renderLayout` (D-022)
- **Fonts**: Archivo (display, expanded widths), Inter (body), Geist Mono (measurements only) via Google Fonts CDN
- **Validation**: Zod schemas (pure, no Drizzle dependency)
- **Storage**: D1 (Cloudflare production), MemStorage (local dev — ephemeral)
- **Auth**: Cloudflare Access (JWT verified in the Worker) for the admin panel
- **Build**: Tailwind CLI builds CSS, Wrangler deploys to Workers
- **Testing**: Vitest (270 tests across sanitizer, CSRF, rate limiter, email, blog helpers, routes, lead fields, form config, Turnstile)

## Key Commands

```bash
npm install              # Install all dependencies (3 prod + 10 dev; Node 24)
npm run dev              # CSS watch + dev server on port 5000
npm run css:build        # One-shot Tailwind CSS build (minified)
npm test                 # Run test suite (vitest)
npm run test:watch       # Run tests in watch mode
npm run check            # TypeScript type checking (tsc --noEmit)
npm run deploy           # Build CSS + deploy to Cloudflare Workers
```

## File Structure

```
worker.ts                    # Cloudflare Workers entry (38 lines, uses shared routes)
server/
  index.ts                   # Node.js dev server entry (72 lines, uses shared routes)
  config.ts                  # Site-wide constants (SITE_URL, PAGE_ROUTES)
  d1Storage.ts               # D1 implementation of IStorage (production)
  routes/
    pages.ts                 # All page GET routes (single source of truth)
    api.ts                   # API endpoints (contact, blog CRUD, leads)
    admin.ts                 # Admin routes (login, logout, leads, blog admin)
    seo.ts                   # robots.txt and sitemap.xml
    errors.ts                # Global 404/500 error handlers
  middleware/
    auth.ts                  # Cloudflare Access JWT guard for admin paths
    security-headers.ts      # CSP, HSTS, frame/referrer/permissions headers
    csrf.ts                  # Origin validation for API mutations
    sanitize.ts              # Allowlist-based HTML and text sanitization
    rate-limit.ts            # IP-based rate limiting
  services/
    storage.ts               # IStorage interface + type definitions
    mem-storage.ts           # In-memory implementation (dev)
    email.ts                 # Contact/support notifications (Cloudflare Email Sending, EMAIL binding)
    form-config.ts           # Contact form fields: code defaults + operator overrides, 60s cache, answer validation (D-016)
    turnstile.ts             # Server-side Cloudflare Turnstile check (siteverify)
  templates/
    layout.ts                # renderLayout() — head, nav, footer, scripts
    index.ts                 # Barrel re-export of all templates
    components/
      hero.ts                # Reusable page hero section
      cta.ts                 # Call-to-action section
      stats.ts               # Stats section
      blueprint.ts           # D-020 blocks: page hero, section head, feature rows, spec list, stat row, diagram frame, steps, CTA band
      contact-form.ts        # Contact form section
      blog-helpers.ts        # Shared BlogPostData type, formatDate, getCategoryColor, estimateReadTime
    pages/
      home.ts, about.ts, how-it-works.ts, careers.ts, press.ts, contact.ts
      blog.ts, dashboard.ts, partners.ts, trust.ts, support.ts, error.ts
      solutions/             # 10 solution pages
      audience/              # publishers.ts, advertisers.ts
      legal/                 # privacy-policy.ts, terms.ts, gdpr-cookie-policy.ts
    admin/
      leads.ts               # Admin login page + leads panel
      blog.ts                # Blog manager + post editor
      form.ts                # Form settings page (/admin/form): fields, custom fields, Turnstile, change log
    tools/
      index.ts               # Publisher revenue calculators (5 tools)
shared/
  schema.ts                  # Zod validation schemas (pure, no Drizzle)
src/styles/
  main.css                   # Tailwind CSS source (tokens, bp-* blueprint system, admin styles)
  pages/                     # one stylesheet per page group (solutions-media, solutions-google, company, resources)
public/assets/               # Static files served by Workers (styles.css is built here)
attached_assets/             # Source branding files (logos, research)
migrations/                  # D1 database schema (0001 init, 0002 rate limits, 0003 lead details, 0004 form config)
```

## Architecture Patterns

- **Server-side rendering**: All HTML generated as template literal strings in TypeScript functions. No React, no JSX, no client-side rendering.
- **Template composition**: `renderLayout()` wraps page content with shared head/nav/footer/scripts. Individual pages export `render*Page()` functions.
- **Shared routes**: Both entry points (`worker.ts` and `server/index.ts`) call the same `register*Routes()` functions from `server/routes/`. Zero route duplication.
- **Storage interface**: `IStorage` interface in `services/storage.ts`. Implementations: `D1Storage` (production), `MemStorage` (dev). Dependency-injected via `getStorage(c)` factory functions.
- **CSS build**: Tailwind v4 CLI compiles `src/styles/main.css` → `public/assets/styles.css`. Uses `@source` directive to scan template files. DaisyUI v5 loaded as `@plugin`. Alpine.js still CDN.

## Common Gotchas

1. **`published` is a string** -- Blog post `published` field is `"true"`/`"false"` string, not boolean. Use string comparison.
2. **Dev data is ephemeral** -- MemStorage resets on restart. D1 persists in production.
3. **Support form reuses contact schema** -- `/support` form packs subject+priority into the `company` field and sets `impressions` to `'support-request'` to reuse the contact lead schema. The email service parses these back out for proper display.
4. **Admin auth is Cloudflare Access** -- No app password. The Worker verifies the Access JWT on `/admin*`, `/api/blog*`, `/api/leads*`, `/admin/api/form-config*` (`server/middleware/auth.ts`, vars `ACCESS_TEAM_DOMAIN`/`ACCESS_AUD`). Local dev leaves admin open and binds to 127.0.0.1. See `docs/SECURITY.md`.
5. **CSS is a build artifact** -- `public/assets/styles.css` is generated by `npm run css:build` and gitignored. Run `npm run dev` (which includes watch) or `npm run css:build` before deploying.
6. **Tests use Vitest** -- Run `npm test`. Tests cover sanitizer, CSRF, rate limiter, email notifications, blog helpers, and all page routes, lead qualifying fields, admin leads escaping, form-to-inbox escaping, size limits, form config admin and audit, Turnstile, D1Storage SQL against node:sqlite with every migration, the D-020 no-boxes check and per-group page tests, polish and timeout explorer (270 tests). `data-testid` attributes are on key elements for future E2E testing.
7. **Unlayered CSS beats utilities** -- Tailwind v4 puts utilities in `@layer utilities`; any plain rule in `main.css` wins over them regardless of specificity. Put global element rules in `@layer base` (see the body and heading rules at the top).
8. **Migrations deploy with the code** -- CI applies `migrations/` to the remote D1 before `wrangler deploy` (D-010). Never ship code that needs a table without its migration file.
9. **Lead capture never fails silently (D-011)** -- form failures return non-2xx and show the error; every queried table has a migration (`server/__tests__/schema.test.ts`); after any deploy touching the form or email path, submit once live and confirm it lands in contact@hbdr.com.
10. **The contact form is operator config, cached 60s (D-016)** -- fields come from `DEFAULT_FORM_FIELDS` plus `form_field_overrides`/`form_settings`, cached per isolate for 60 seconds. An admin write clears its own isolate only, so other isolates show it within a minute. Tests that write overrides straight to storage must call `invalidateFormConfig()` first. Absent fields are accepted, blank required ones refused.

## Design System

- **Look**: inventory blueprint (D-020) in deep navy (D-024) with the logo mint (D-017): slate canvas, hairline rules, one 12-column grid, heading left and supporting line right. Informational content flows in sections; a border, fill or radius marks only a real object (table, form, diagram, code, demo). No card grids, icon tiles or tag pills on public pages (`server/routes/__tests__/blueprint.test.ts`). Each solution page carries one teaching object (diagram, spec table or worked example) built from D-005 facts and labelled example data.
- **Accent**: logo mint `#00FAA8` (`var(--accent)`), used sparingly: primary button, eyebrow squares, the one highlighted thing in a diagram
- **Surfaces** (D-024 deep navy): canvas `#0b1121`, elevated `#111a2e`, raised `#18223a`; hairlines `rgba(255,255,255,0.08)` / `0.14`; `.bp-blueprint` adds the 8px drafting grid behind a diagram
- **Text**: primary `#f5f7fa`, secondary `#d0d6e0`, muted `#959ca8` (>= 4.5:1 on every surface)
- **Typography**: Archivo for h1-h3 on public pages (admin keeps Inter via `body.is-admin`), Inter body, `.mono` (Geist Mono) only for sizes, prices, timings and codes
- **Blocks** (`server/templates/components/blueprint.ts`): `renderBlueprintHero`, `renderSection`, `renderSectionHead`, `renderFeatureRows`, `renderSpecList`, `renderStatRow`, `renderDiagramFrame`, `renderSteps`, `renderCtaBand`, `renderActions`; CSS classes `bp-*` in `main.css`
- **Motion** (D-019, D-020 rule 4, D-022, D-023): GSAP only, no pinning or scroll-jacking, text never hidden waiting for an animation, the server render is the finished state. Under reduced motion only the hero auction plays, as fades (nothing slides or draws); every other section stays finished
- **Admin** keeps its D-012/D-017 layout and the `glass-*` classes

## Environment Setup

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5000`

No environment variables or Worker secrets are required. Branch previews deploy with `wrangler deploy --env preview` (own D1, no email).

## Adding New Pages

1. Create `server/templates/pages/your-page.ts` with `export function renderYourPage(): string { ... }`
2. Import `renderLayout` from `../layout` and any components from `../components/`
3. Add the route in `server/routes/pages.ts`
4. Add the path to `PAGE_ROUTES` in `server/config.ts` (for sitemap)
5. Add nav/footer links in `server/templates/layout.ts` if needed

## Current Project Status

### Done
- 26 page templates fully decomposed into individual files
- Shared route modules (zero duplication between worker.ts and index.ts)
- Blog category filters (fixed — Alpine.js x-show on articles)
- Admin authentication (cookie-based sessions)
- D1 persistent storage (production)
- Rate limiting on contact form
- Honeypot spam protection
- Email notifications via Cloudflare Email Sending (`[[send_email]]` binding `EMAIL`, sender noreply@hbdr.com; see docs/DECISIONS.md D-001)
- SEO: robots.txt, sitemap.xml
- Social links (LinkedIn, X, email) in footer
- Absolute OG image URLs
- Publisher revenue calculators (5 tools with tabbed UI, enhanced inputs, HBDR uplift projections)
- HTMX removed (was loaded but unused)
- Package.json cleaned (5 prod deps, 4 dev deps)
- Dead code removed (React app, Vite, Express, Drizzle ORM, 60+ unused packages)
- Branded error pages (404 with link grid, 500 with support link)
- Global error handlers via `registerErrorHandlers()` in `server/routes/errors.ts`
- CSRF protection (double-submit cookie for admin login, Origin validation for API endpoints)
- Allowlist-based HTML sanitizer (replaces regex approach)
- Blog search (Alpine.js client-side filtering by title/excerpt)
- Blog read time estimates (WPM-based, shown on cards and post pages)
- Blog cover image support (cards + post hero)
- Blog related posts (up to 3, same-category prioritized)
- Blog backfill: 87 weekly posts 2025-02-03..2026-09-28 in `seed/blog-backfill-2025-2026.sql` (idempotent on slug; D-006)
- CI/CD: production deploy workflow for main branch
- Tailwind CSS v4 build step (replaces CDN — `src/styles/main.css` → `public/assets/styles.css`)
- DaisyUI v5 (via `@plugin` directive, replaces CDN)
- Test suite: 161 tests (Vitest) covering sanitizer, CSRF, rate limiter, blog helpers, all page routes

### Still Needs Work
- Content decisions pending: footer X handle, hero claims ("25+ years" vs founded 2015, 1B vs 1T impressions), "Competitor A/B" table, stale blog
