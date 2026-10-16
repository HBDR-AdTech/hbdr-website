# hbdr.com redesign — design handoff for Gemini 4 Argon

A prompt pack for designing the next hbdr.com in Google AI Studio (Gemini 4 Argon) and bringing the result back to this repo, where it gets wired into the Hono templates, the real contact form, tests and deploy.

Starting point: `docs/design/home-blueprint.html`, the "inventory blueprint" mockup (ad slots drawn at true IAB sizes and sold live by auctions). Screenshots are in `docs/design/refs/`.

## How to run it

1. Open Google AI Studio and pick Gemini 4 Argon.
2. Attach these files:
   - `attached_assets/HBDR_Logo_Pack_all_sizes_-_2_1770577514801.jpeg` (wordmark on the slate ground)
   - `attached_assets/HBDR_Logo_Pack_all_sizes_-_8_1770577514801.jpeg` (hex "H" mark)
   - `public/assets/HBDR_logo_wo_tagline_crp_370x116_web_1770664100214.png` (transparent wordmark used in the nav)
   - `docs/design/refs/*.png` (the current mockup, desktop and mobile)
   - `docs/design/home-blueprint.html` (the current mockup's code)
3. Paste **Prompt 0**. Keep the DESIGN.md it writes.
4. Paste **Prompt 1**, then one **direction prompt** from the list below. To compare directions, run two or three in separate chats.
5. Iterate in AI Studio until you like it, then paste **Prompt 2** to get the hand-back package.
6. Save the package under `docs/design/argon/<direction-name>/` in this repo and tell Claude Code "wire up the Argon design in docs/design/argon/<direction-name>".

## Prompt 0: design system first

```
You are the design lead for hbdr.com, the website of HBDR, a header-bidding and ad-monetization company for publishers (websites, mobile apps, CTV/OTT). Before designing anything, study the attached logo files and the attached mockup (screenshots + home-blueprint.html) and write a DESIGN.md for the new site.

Binding brand rules:
- Colors come from the logo: slate ground #15181F, logo mint #00FAA8, white. Supporting surfaces may be derived from the slate (for example #1B1F27, #222630). Mint is the only accent and is used for action, selection and "sold/won" states, never as decoration. No gradients on text, no glassmorphism, no glowing neon edges.
- Dark site. Body text at least 4.5:1 contrast on every surface.
- Fonts from Google Fonts only, at most three families: a display face with character (the mockup uses Archivo at expanded widths), Inter for body, and one monospace (Geist Mono) used only for measurements, prices, milliseconds and sizes.

DESIGN.md must define: color tokens as CSS custom properties, the type scale (sizes, weights, widths, tracking), spacing scale, grid (12 columns, max width), radii, border/hairline rules, component rules (buttons, inputs, tabs, tables, cards only where a card is the right object), motion principles and timings, and the reduced-motion behaviour. Keep it under 250 lines. Do not design pages yet.
```

## Prompt 1: the brief (paste before a direction prompt)

```
Design the hbdr.com home page as one self-contained HTML file that follows DESIGN.md.

Who it is for: a publisher's owner, ad-operations lead or revenue lead, comparing HBDR with their current ad network or an in-house setup. They think in eCPM, RPM, fill rate, viewability, impressions and IAB ad sizes (300×250, 728×90, 160×600, 320×50, 1920×1080 for CTV). The page must make them understand header bidding (every demand partner bids on each impression at once, the highest bid wins, late bids are dropped) and then book a call or send the contact form.

Feel: highly professional, impressive, cutting-edge and informative. Every animation must teach something or show the product working. Not flashy, not crypto, not a template.

Facts you may use (nothing else; do not invent numbers, clients, quotes or awards):
- Founded 2015, based in Miami (1200 Brickell Ave Ste 1950, Miami, FL 33131), (786) 675-6080, contact@hbdr.com.
- "25+ years" is the team's combined experience, not the company's age.
- 1B+ impressions per month. 1T+ ads served in total. 500+ publishers. Publishers increase revenue by up to 50%.
- 22 integrated demand partners (names only, no logos): Magnite, PubMatic, Index Exchange, OpenX, Xandr, Google AdX, Amazon Publisher Services, TripleLift, Sharethrough, Equativ, Sovrn, Criteo, Taboola, InMobi, AppLovin, Verve, Digital Turbine, Liftoff, BidMachine, BidSwitch, MGID, Dianomi.
- Products: header bidding (managed Prebid Server), display, video (custom player, VAST/VPAID, instream/outstream), CTV/OTT (SSAI), in-app (SDK, Google AdX, open bidding, rewarded video), dynamic floor pricing, real-time analytics dashboard, dedicated account manager, 24/7 technical support, revenue guarantee.
- Comparison columns: HBDR vs "Typical Ad Network" vs "DIY In-House Setup". Never name a competitor.
- Process: 1 Discovery call, 2 Customized proposal (revenue forecasts, placement strategy, roadmap), 3 Technical implementation (accounts, code, monitoring).
- Any auction, bid, eCPM or revenue figure shown in a demo is example data and must be labelled as simulated on screen.
- No testimonials.

Page sections, in an order you choose: hero, demand partners, formats, how an impression is sold, comparison, process, company facts, contact (form + address), footer. The contact form is rendered by our server from admin settings, so design only its container, one example text field, one select, one checkbox group, the submit button, an error state and a success state.

Technical rules:
- One HTML file, plain HTML/CSS/JS. No React, no Tailwind CDN, no build step.
- Motion with GSAP 3.12.5 and ScrollTrigger from cdnjs (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js and ScrollTrigger.min.js). No other JS libraries.
- No scroll-jacking and no pinned sections. Text is never hidden waiting for an animation; animate lines, shapes, fills and data, not paragraph fade-ins. Every section animates differently or not at all.
- prefers-reduced-motion: show the finished, static state of every animation.
- Fast: no images heavier than 150 KB, SVG for diagrams, text as real text, the hero headline renders before any script runs. Pause looping animations when off-screen.
- Responsive from 360px to 1600px wide with no horizontal scrolling. Keyboard focus visible on every control.
- Use the CSS custom properties from DESIGN.md everywhere; no hard-coded colors outside the token block.
- Add data-section="<name>" to each section so it can be mapped back to our templates.
```

## Direction prompts (pick one per chat)

**A. Blueprint, interactive (push the current mockup).** The strongest continuation.
```
Direction: "Inventory blueprint". The page is the publisher's own inventory drawn as an IAB spec sheet: ad slots at true proportions with dimension lines, filled in logo mint when an auction sells them. Push it much further than the attached mockup: in the hero, let the visitor choose their site type (news article, recipe, gaming, app, CTV) and the blueprint redraws that layout's real slot set with a GSAP morph, then sells each slot with a visible bid ladder (simulated bids). Carry the blueprint grammar through every section: the formats section morphs one frame between display, video, CTV and in-app sizes; the "how an impression is sold" section is a millisecond timing diagram with a 1000 ms timeout; the comparison table reads like a spec sheet. Precision drafting, not decoration.
```

**B. Signal flow.** Explains the mechanism best.
```
Direction: "Signal flow". Draw the path of one impression as a transit-style diagram: page loads → Prebid wrapper → 22 demand partners in parallel → bids return → ad server → ad renders. As the visitor scrolls (no pinning), the route draws itself station by station, and each station expands into the section that explains it (partners, formats, timeouts, floors, analytics). Lines are hairline white, the winning path is mint. It should read like a beautifully designed transit map crossed with an engineering diagram.
```

**C. Exchange tape.** Most energetic; keep it restrained.
```
Direction: "Exchange". Treat HBDR as the trading floor for the publisher's inventory: a live order-book bid ladder in the hero, a slow ticker tape of simulated sold impressions (size, format, CPM, time), and a large counter that frames the 1T+ ads served. Typography and layout borrow from financial terminals and exchange displays, but with generous space and restraint: one ticker, one ladder, no flashing colors, mint only for executed trades.
```

**D. Annual report.** Credibility for a CFO or revenue lead.
```
Direction: "Annual report". Design the page like a beautifully typeset annual report or research paper about publisher yield: large confident display type, editorial grids, numbered figures with captions, and data graphics that explain header bidding (waterfall vs header bidding, timeout distribution, format mix), all labelled as illustrative. Motion is limited to charts drawing in. Authoritative and calm.
```

**E. Product-led.** Only if Matt supplies real console screenshots from `hbdr-console`.
```
Direction: "Product-led". The attached screenshots are HBDR's real publisher console. Build the page around them: the console in a precise device frame, with annotated callouts that zoom into real features (partner performance, floors, reports) as the visitor scrolls. Never redraw or fake console data; use the screenshots as given.
```

## Prompt 2: the hand-back package

```
Package the final design for handoff to the engineering team. Output, as separate code blocks with file names:
1. index.html: the complete page, self-contained except for Google Fonts and the two GSAP files from cdnjs.
2. DESIGN.md: updated to match the final page exactly (tokens, type scale, components, motion).
3. MOTION.md: every animation, listed by data-section: trigger, what moves, duration, easing, loop or once, reduced-motion behaviour.
4. CONTENT.md: every piece of copy on the page, by section, so engineering can check it against the approved facts.
5. ASSETS.md: every image or SVG asset, with the exact prompt used to generate it, or its source.
Do not include analytics, trackers, external fonts beyond Google Fonts, or any other third-party script.
```

## What happens back here

Claude Code takes `docs/design/argon/<direction>/` and:

1. Checks every line of CONTENT.md against D-005 and PRODUCT.md; anything invented is removed or sent back as a question.
2. Moves the tokens into `src/styles/main.css`, the page into `server/templates/pages/home.ts` (and shared pieces into `layout.ts` and `components/`), keeping the operator-configured contact form (D-016) and every `data-testid`.
3. Loads GSAP 3.12.5 + ScrollTrigger with SRI hashes, the same way as Alpine in `layout.ts`, and keeps the reduced-motion path.
4. Measures: Lighthouse on desktop and mobile, JS weight, LCP element, layout shift; adds route tests; checks it in a real browser at 390 and 1440 wide.
5. Ships it as its own PR with a new D-NNN, and a live test lead after deploy (D-011).

## Multi-agent option inside Claude Code

Instead of, or alongside, Argon: run the `gauntlet` skill on the home page. Three builder agents each build one direction (for example A, B and D) from Prompt 1, a blind critic compares them against a named reference (stripe.com, linear.app or vercel.com) and picks the strongest sections, and a final builder merges them. About 8 agents; the actual cost is reported after the run. Ask for it by saying "run the gauntlet on the home page".
