# HBDR Website Handoff — 004 — 2026-10-16 (sitewide blueprint redesign: plan and authority)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-003.md. Append-only / numbered / immutable.

## Next turn — build and publish the blueprint redesign on every page

Matt approved the inventory-blueprint design (`docs/design/home-blueprint.html`, screenshots in `docs/design/refs/`) and asked for it on every page, with no boxed content on informational pages, at an enterprise ad-tech SaaS level (D-020). Branch: `design/blueprint-home` (stacked on `design/auction-hero` → `design/redesign-v2`).

**Authority Matt gave on 2026-10-16:**
- The agent merges PR #21, then #22, then the redesign PR, in that order, after every check below is green. Report each merge. Then one live contact submission that lands in contact@hbdr.com (D-011).
- A fan-out of 5 agents: 4 builders (one per page group, each in its own worktree beside the repo in `~/code/`) and 1 skeptic. Report the actual cost after.
- Remove the home testimonials (D-021).

### Phase 1 — design system and home (main session, before any fan-out)
1. Read D-017 to D-021, PRODUCT.md (local, git-excluded) and `.impeccable/surfaces/server-templates-pages-home-ts.md` (direction contract).
2. Tokens and type in `src/styles/main.css`: Archivo (display, expanded widths), Inter (body), Geist Mono (measurements only), loaded in `layout.ts` from Google Fonts. Keep the existing token names working for the admin pages.
3. GSAP 3.12.5 + ScrollTrigger from cdnjs with SRI hashes (compute with `curl -s <url> | openssl dgst -sha384 -binary | openssl base64 -A`), added to the CSP `script-src` in `server/middleware/security-headers.ts`, loaded only on pages that use it. The D-019 auction moves onto GSAP.
4. Shared components in `server/templates/components/`: page hero (heading left, supporting line right), section head, spec list (`dl` rows), flowing feature list (hairline rows instead of cards), diagram frame, stat row. Redesign nav and footer in `layout.ts`.
5. Rebuild `home.ts` from the mockup: blueprint hero with live auctions, partners grid, formats morph, impression timeline, comparison table, three steps, company facts, contact. Keep the operator-configured form (`renderContactFormSection`, D-016) and every existing `data-testid` (tests rely on them). Drop testimonials.
6. Gates: `npm test`, `npm run check`, screenshots at 1440 and 390 of home, a reduced-motion check, no console errors.

### Phase 2 — 4 builders in parallel (after Phase 1 is committed)
Each builder gets: D-020 rules, the component list, the mockup, its page list, "keep every data-testid and route", "copy stays D-005; no new claims", and must run `npm test` + `npm run check` and screenshot each page at 1440 and 390.
- **B1:** solutions/header-bidding, display-ads, video-player, ctv-ott, in-app-ads
- **B2:** solutions/mcm, manage-account, manage-inventory, open-bidding, ad-exchange-adx
- **B3:** audience/publishers, audience/advertisers, about, how-it-works, partners, trust, dashboard
- **B4:** careers, press, contact, support, blog (list and post), legal (privacy, terms, gdpr-cookie), error, tools
Each solution page gets one teaching object (diagram, spec table or worked example) per D-020 rule 3.

### Phase 3 — integrate, verify, publish
1. Merge builder branches into `design/blueprint-home`; resolve conflicts in shared files only in the main session.
2. Skeptic agent: tries to falsify "every public page matches D-020" from screenshots, the detector (`impeccable detect --json`) and the templates; checks the contact and support forms still submit (local Worker + local D1) and admin pages are unchanged.
3. Impeccable finish reviewer and documenter (writes DESIGN.md, local only).
4. Lighthouse on home and one solution page (mobile and desktop); record LCP, CLS, JS weight in the PR body.
5. Open the redesign PR, merge #21 → #22 → redesign (retarget each to `main` as its base merges), watch the deploy run, live smoke of every page, live test lead (D-011), then HANDOFF-005.

## State

- PRs open: #21 (logo palette), #22 (auction hero). `design/blueprint-home` carries the mockup, Argon brief and D-020/D-021; no template changes yet.
- Tests 161/161, typecheck clean (on `design/auction-hero`).
- Operator items still open: Turnstile switch-on at `/admin/form` (site key `0x4AAAAAAFWkEWJNRrR2hyVh`, needs Matt's Access login), DNSSEC DS pending (check `dig +short DS hbdr.com @a.gtld-servers.net`).
- Argon: Matt's Google AI Pro does not include Argon in Antigravity/`agy` (`agy models` lists Gemini 3.8 Flash, Claude Opus/Sonnet 5.5, GPT-OSS 120B only); Argon is available to Pro only in the Gemini app. `agy` 1.3.5 is installed at `~/.local/bin/agy` and signed in. Prompt pack: `docs/design/ARGON-BRIEF.md`. If Matt brings an Argon design back, it lands in `docs/design/argon/<direction>/` and replaces Phase 1 step 5's source.

## Lessons

- Artifacts are private to the claude.ai account the Claude Code session is signed in to; Matt's browser may be on a different account. Local copies of every published page live in `.impeccable/mocks/` (git-excluded).
- Running a remote installer (`curl … | bash`) is refused by the auto-mode classifier; Matt runs it with `!`.

End of HANDOFF-004.
