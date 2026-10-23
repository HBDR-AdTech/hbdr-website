# HBDR Website Handoff — 006 — 2026-10-23 (navy canvas, pro finish, timeout explorer, reduced-motion hero, touch drag)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-005.md (blueprint redesign live on every page).
> Append-only / numbered / immutable.

## Next turn

- **Matt answers the six copy questions in §5.** Then fix them on this branch (`fix/content-claims`) as one code PR, with a test that fails if the old wording returns.
- Long lines: the Impeccable design checker flags line lengths of about 97 characters (it aims for under 80) on `/how-it-works`, `/solutions/header-bidding`, `/solutions/in-app-ads` and `/trust`. Narrow those paragraphs in the same PR.
- **Operator (carried from HANDOFF-003/004/005):**
  - Turnstile switch-on at `/admin/form`: site key `0x4AAAAAAFWkEWJNRrR2hyVh`, then one live test lead.
  - DNSSEC DS at the registrar: `dig +short DS hbdr.com @a.gtld-servers.net`.
- **Optional, needs Matt's OK:**
  - Impeccable finish reviewer and documenter (DESIGN.md).
  - Mobile restacked versions of the side-by-side diagrams.
- **Operator, optional (for WebKit testing here):** in Matt's own terminal, `sudo <scratchpad>/pw/node_modules/.bin/playwright install-deps webkit`. It needs a password, so `!` can't run it. Without it, Safari can only be checked on Matt's iPhone.

---

## 1 · Current state

- **Branch:** `main` at `8b219c6` (merge of #28). This handoff is on `fix/content-claims`.
- **Tests:** 271 / 271; `npm run check` clean.
- **Production:** hbdr.com, deployed from `8b219c6`. Deploy runs succeeded for #24, #26, #27 and #28.
- **PRs merged this session:**

  | PR | What |
  |---|---|
  | #24 | Reduced-motion hero, plus HANDOFF-005 |
  | #26 | Navy canvas |
  | #27 | Pro finish and timeout explorer |
  | #28 | Touch drag |

  Open: #25, dependabot vite 8.3.2 → 8.3.5 (dev dependency), not touched.
- **Migrations:** unchanged, through 0005.

## 2 · What just shipped

### Inbox confirmed (D-011)
Matt confirmed the "TEST Deploy Check (blueprint redesign)" lead email arrived in contact@hbdr.com. That closes HANDOFF-005's first item.

### Hero auction under Reduce Motion — #24 (D-023)
- **The report:** Matt's iPhone has Reduce Motion on, so the hero stood still. The record: Matt's answer, and Chromium emulation at 390 showing the auction runs with motion allowed.
- **The fix:** under reduced motion, the hero auction still cycles as fades. Bids fade in at their final length, then the slot fills and the price fades in. Nothing slides or draws, and every other section stays still.
- **Test:** the early return must come after the hero script (`pages.test.ts`).

### Deep navy canvas — #26 (D-024)
- **Surfaces:** `#0B1121`, `#111A2E`, `#18223A`.
- **Literals removed:** every slate literal now reads a token, including the channel tokens `--surface-rgb` and `--surface-elevated-rgb` for translucent fills.
- **Also navy:** `theme-color` and the lead email header.
- **Contrast:** muted text 5.7–6.8 : 1.
- `77083f9` (docs/artifacts: published artifact pages kept as HTML) arrived on main from Matt's account during this session. It is not this session's work, and is recorded here so the range is complete.

### Pro finish — #27 (D-025)
A builder agent in its own worktree built Matt's four picks:
- **Hero glow:** one soft glow per hero.
- **Lit frames:** a lit edge on real objects, plus a mouse-only pointer spotlight (`FRAME_SPOTLIGHT` in `layout.ts`).
- **Grain:** an SVG grain on the canvas.
- **Glass nav:** the nav and dropdowns are glass (this supersedes D-012's "no blur" for the nav).
All of it is scoped off admin. Test: `polish.test.ts`.

### Timeout explorer — #27 (D-026)
- **Where:** the #how timeline on home.
- **Controls:** a range input and a draggable timeout line, 200–1500 ms.
- **Bidders:** late bidders dim with "timed out · $x lost"; Bidder 5 is a late $5.20 bid.
- **Readout:** bids received, winning CPM, Page RPM (CPM × 3 slots), pages per session (4.0, −2% per 100 ms over 300 ms) and Session RPM, all labelled as an example model.
- **Key values:**

  | Timeout | Session RPM |
  |---|---|
  | 500 ms | $38.82 |
  | 520 ms (peak) | $55.75 |
  | 1000 ms (default) | $50.16 |
  | 1300 ms | $49.92 |

- **One source:** one TS function (`timeoutYield`) renders the default and runs in the page via `toString()`. Tests cover equality at every 10 ms step and guard against inner functions (esbuild keepNames `__name`). The served bundle was checked through `wrangler dev`.

### Touch drag — #28
- **The bug:** on live hbdr.com, a real finger drag (puppeteer CDP touch) moved the line one step, then `pointercancel`. Chrome ignores `touch-action` on SVG children.
- **The fix:** an HTML grab strip `.tl-grab` (44px, `touch-action: none`) sits over the line and carries the handlers.
- **Live check:**
  - Finger drag at 390: 1000 → 720 ms ($53.42).
  - Mouse drag at 1440: 1000 → 610 ms.
  - Strip vs line offset: 0 px.
  - Errors: none.

### Live smoke (hbdr.com, after #27 and #28)
- **Readout:** page-rpm $14.58 and session-rpm $50.16 at the default.
- **Slider:** set to 520, Session RPM reads $55.75.
- **Spotlight:** the script is present.
- **Mobile:** scrollWidth 390 at 390.
- **Errors:** none.
- **Reduced motion:** with an emulated iPhone and reduced motion, the auction advanced from 2 to 3 slots sold in 3 s.

## 3 · Architecture decisions worth remembering

- **Touch-draggable controls inside SVG** need an HTML overlay with `touch-action: none`. Chrome ignores `touch-action` on SVG children, and putting it on the whole `<svg>` would block the sideways chart pan on phones.
- **Touch testing with puppeteer:** the site has `scroll-behavior: smooth`. In scripts, use `scrollIntoView({ behavior: 'instant' })` before measuring rects, or touches land on stale coordinates (this cost one false alarm this session). Synthetic `PointerEvent`s can't test `setPointerCapture`; use CDP touch (`page.touchscreen`).
- **Grain:** its colour-matrix offsets encode the canvas colour (D-025). If the canvas changes again, retune them or the grain stops being zero-mean.
- **Headless agent-browser** reports `hover:none`/`pointer:none`, so it never shows the spotlight. Verify the spotlight with a Chrome launched with `--blink-settings=primaryHoverType=2,primaryPointerType=4`.
- **Lighthouse on beast** is unreliable while other sessions load the machine (load average 70–100 this session); compare builds alternately in one run.

## 4 · Open work

- Copy contradictions: waiting on Matt (§5).
- Line-length fixes: queued for the same PR.
- WebKit is not verified on this machine (needs sudo install-deps). Matt's iPhone is the real Safari check, for both the D-023 fades and the touch drag.
- Agent cost for this session's 2 builders: unknown, because `agent-usage` had no data. Read it in `/cost`.
- Done on our side, blocked on the operator: Turnstile switch-on, DNSSEC DS.

## 5 · Open questions for the operator

1. `/advertisers` "thousands of premium publisher sites": change to 500+ (D-005)?
2. `/about` "average revenue increase of over 50%": change to "up to 50%"?
3. `/how-it-works` "30–50% higher revenue" and `/solutions/header-bidding` "40–60% CPM uplift": keep, or change to "up to 50%"?
4. Minimum size: 10M monthly impressions (`/how-it-works`) or 100,000+ monthly page views (`/publishers`)?
5. `/solutions/in-app-ads` "SDK-less" vs "In-App SDK" in the home comparison table: which is right?
6. "50+ demand partners/SSPs" on several pages vs 67 listed on home: keep 50+, or use the list count?

## 6 · Files touched this session

```
#24 51c7a3b fix: hero auction as fades under reduced motion   home.ts, pages.test.ts
    b2fcab7 docs: D-023                                        DECISIONS.md, CLAUDE.md
#26 acad704 design: deep navy canvas                           main.css, pages/{company,solutions-media}.css, layout.ts, services/email.ts
    33b7338 docs: D-024                                        DECISIONS.md, CLAUDE.md
#27 4d7f1d1 design: glow, lit frames, grain, glass nav         main.css, layout.ts, __tests__/polish.test.ts
    ab4478e feat: timeout explorer                             home.ts, styles/pages/home.css (new), main.css, __tests__/timeout-explorer.test.ts (new)
    588029c test: guard timeoutYield against inner functions
    ea08f1c test: count the spotlight script                   __tests__/polish.test.ts
    add39cb docs: D-025, D-026                                 DECISIONS.md, CLAUDE.md
#28 (fix: touch drag)                                          home.ts, styles/pages/home.css, __tests__/timeout-explorer.test.ts

LIVE ENV STATE
  None this session besides the deploys. Worktrees ~/code/hbdr-website-p1, -p2 removed after 0 unmerged commits and 0 dirty files; local merged branches deleted.
```

---

End of HANDOFF-006.
