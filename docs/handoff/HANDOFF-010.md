# HBDR Website Handoff — 010 — 2026-11-20 (v3 of the four explainer page mockups, checked twice; growth plan page served from .mockups)

> See [INDEX.md](INDEX.md). Previous: HANDOFF-009.md (growth plan v2, four explainer page mockups, D-038–D-041).
> Append-only / numbered / immutable.

## Next turn

- **Operator: yes or no on each v3 mockup, page by page.** Links: http://beast:8930/hbdr-website/mobile-sdk-bidding.html, /ctv.html, /prebid-server.html, /header-bidding.html. Each page ends with "Decisions I need".
- **After the yes:** port in a new worktree `../hbdr-website-wt-explainer-pages` on branch `feat/explainer-pages`. Replace `/solutions/header-bidding`, `/solutions/ctv-ott` and `/solutions/in-app-ads`. Add `/solutions/prebid-server` (`server/routes/pages.ts`, `PAGE_ROUTES` in `server/config.ts`, nav). Move `.step-ctl` and `.step-btn`, the `.bp-grid12` 320 px fix and the 44 px button height into `src/styles/main.css`. Add tests to the per-group page tests, `claims.test.ts` and `blueprint.test.ts`. One page per PR, 200 source lines or fewer where possible.
- **Operator: answer mobile decisions 1 and 2.** Which platforms and primary ad SDKs does the HBDR SDK support, and does it follow Prebid's in-app design? Until then every step names "the bidding SDK".
- **Operator (carried from 008):** merge #33, then #34. Then run the 2 production SQL files named in HANDOFF-008, submit one live test lead, and pick the 41 repeated seller IDs.
- **Operator:** the 4 growth plan questions (HANDOFF-009 §5 item 2). The page is now at http://beast:8930/hbdr-website/growth-plan.html.

---

## 1 · Current state

- **Branch:** `fix/content-answers` (PR #33). This handoff commit sits on top of `12cce32`. PR #34 is open and mergeable. Dependabot PRs #25, #35, #36, #37 are open with a failed `preview` check.
- **Tests:** 379 / 379 (`npx vitest run`, 2026-11-20). No code changed this session.
- **Production:** unchanged since `6f3fa8c` (#32, 2026-10-23). Nothing deployed.
- **Mockups:** `.mockups/` (gitignored), served at http://beast:8930/hbdr-website/. All 5 pages return 200.

## 2 · What just shipped (session 010)

### v3 of the four page mockups

Built from `.mockups/notes/brief-v3-fixes.md` and D-041. The earlier files are in `.mockups/history/` (`header-bidding.v2`, `prebid-server.v2`, `mobile-sdk-bidding.v1`, `ctv.v1`).

- **mobile-sdk-bidding.html (rewrite of the teaching object).** In-app header bidding is shown as available: the HBDR SDK or server-to-server, on HBDR's managed Prebid Server (D-041 items 1 and 3). The step-through is now a flow diagram: a phone that holds the bidding SDK and the primary ad SDK, HBDR Prebid Server, four bidders and the ad server. Requests and bids move along the wires, the 320×50 slot fills at step 6, and a 0–900 ms timeline shows the 7 steps, the auction span and the 800 ms timeout. The 4 primary ad SDK choices and the SDK / SDK-less choice stay. The layout is one CSS grid: wires run down on a phone and right on a wide screen, so nothing scrolls sideways. The build plan is gone.
- **ctv.html.** Every ability stays "Available now" (D-041 item 5) in words that match the code. "Up to 50%" added (D-041 item 4).
- **header-bidding.html.** No "vs. waterfall" baseline. The Prebid Server decision is gone (D-041 item 3). Two wording fixes.
- **prebid-server.html.** The app path is available. GPP name and "Many sites run both" fixed. Back no longer wraps.
- **All four.** Controls read Back · Step · Play with one class (`.step-ctl`, `.step-btn`). Back is off at the first step and Step at the last. On a phone the wide diagrams on header-bidding and ctv scroll to the current step.

### Verification

Record: `.mockups/notes/VERIFY-site-pages-v3.md` (first check, then the section "Recheck after fixes").

- First check: header-bidding PASS; prebid-server 1 fault; mobile 4 faults (FAIL); ctv 1 fault. All six were fixed.
- Recheck: header-bidding PASS, prebid-server PASS, mobile and ctv PASS WITH FIXES (2 leftover wording lines on mobile, 1 wrong line citation on ctv, 2 minor notes). Those 5 items were then fixed and tested in the browser by the builder. **No verifier has seen that last edit.**
- Clean on all four pages in both checks: no sideways page scroll at 320, 390, 768 and 1440 px, 0 JS errors, 0 hits on the claims-test patterns, 0 running animations under reduced motion.

### Growth plan page

`.mockups/growth-plan.html` is a copy of `docs/artifacts/growth-plan.html` without the publishing tool's meta tag. The committed file stays as the record of the published page (rule of 2026-10-22).

## 3 · Architecture decisions worth remembering

- **The lane built the pages; one verifier checked.** RUN-CONTROL "Single loop" (2026-11-19) is newer than HANDOFF-009's "one fresh builder subagent".
- **The steps name "the bidding SDK", not the HBDR SDK.** D-041 says only that HBDR has an SDK. No SDK repo was found. So each step gives Prebid's documented behavior for a bidding SDK, and the page says only that the HBDR SDK takes that place. A step that says what the HBDR SDK does inside fails the claim rule while mobile decisions 1 and 2 are open.
- **CTV device signals reach 2 of 8 adapters.** Device type, make and OS go into the bid request only with `?ssai=` on the tag or `enable_ctv_enhancements` on, and only for openx and sovrn (`hbdr-ctv/vendor/prebid-video-hbdr/src/index.ts:844-847`, `ctv/bid-enhancements.ts:571-574`, `adapters/base.ts:92-98`). The page row says "with CTV signals turned on for your account". ctv decision 1 asks for all 8.
- **The site shell already adds "Scroll sideways for the full diagram" to any frame that overflows.** A second hint was written and removed.
- **A history copy renders unstyled.** `.mockups/history/*.html` links `assets/styles.css` by a relative path. Do not compare layout against a history file in the browser.
- **prebid-server at 320 px:** the readout table needed 279 px in a 254 px frame. The fault was in v2 too. Cell padding is 0.5rem under 400 px.

## 4 · Open work

- **Ours:** the port to templates after Matt's yes (Next turn). The `.bp-grid12` 320 px fix, the 44 px buttons and the shared step controls move to `src/styles/main.css` with the first port.
- **Blocked on the operator:** the mockup yes; mobile decisions 1 and 2; ctv decision 1; the merges and production steps of HANDOFF-008; the partner ads.txt lines; the growth plan answers.
- **Carried from 008:** Turnstile switch-on at /admin/form; DNSSEC DS at the registrar; the HeaderBiddr X account check; Dependabot PRs.
- **Agent cost:** 2 verifier runs, 247,881 and 153,671 tokens.

## 5 · Open questions for the operator

1. Yes on each of the four v3 mockups?
2. Which platforms and primary ad SDKs does the HBDR SDK support today?
3. Does the HBDR SDK follow Prebid's in-app design (stored requests, hb_ keys)?
4. CTV: send the device signals from all 8 adapters before launch?
5. Merge #33 and #34 now?

## 6 · Files touched this session

```
COMMIT (this commit)  docs(handoff): 010
  NEW      docs/handoff/HANDOFF-010.md
  MODIFIED docs/handoff/INDEX.md

NOT IN GIT (gitignored .mockups/)
  MODIFIED .mockups/header-bidding.html, prebid-server.html, mobile-sdk-bidding.html, ctv.html (v3)
  NEW      .mockups/history/header-bidding.v2.html, prebid-server.v2.html, mobile-sdk-bidding.v1.html, ctv.v1.html
  NEW      .mockups/growth-plan.html
  NEW      .mockups/notes/VERIFY-site-pages-v3.md, verify-shots/*-v3.png (8)

LIVE ENV STATE
  No production, D1 or vendor change.
```

---

End of HANDOFF-010.
