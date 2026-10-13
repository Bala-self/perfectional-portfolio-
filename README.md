# Portfolio — Reconstruction (v9.12)

> **v9.12 (client assets: new project screenshots).** The last two images of
> every project's switcher are replaced with the client's new diagrams and
> showcases, mapped by file name: BillPro (connection flow + overview),
> Pizza Palace (connection flow + UI/architecture), TripAdvisor (showcase +
> flow, architecture overview), KADAI (system architecture + showcase).
> Converted PNG→JPEG q90 (6.2 MB → 635 KB worst case) with true pixel
> dimensions in width/height; captions and aria-labels rewritten from the
> diagram contents. Verified: all four switchers swap to the new images,
> viewer opens "2 / 3" with the new caption at full resolution, 0 errors,
> 0 overflow.


> **v9.11 (client instruction: fab bottom-right, 3 s pop).** The WhatsApp
> button now sits bottom-right (22 px), with back-to-top stacked directly
> above it on the same axis; having a real href, it also works without
> JavaScript. The Refresh Experience letter-pop phase now spans 3 s
> (`BURST_MS = 3000`, 700 ms per char, delays 0–2300 ms), with the preloader
> handoff at 2.4 s and scroll-home + restore at 3.4 s behind the opaque
> field; reduced motion still skips the burst. Re-verified end to end: chars
> alive mid-burst, overlay handoff, exact post-reset state, lock holds,
> 0 errors, 0 overflow.


> **v9.10 (client instruction: WhatsApp shortcut + Refresh Experience
> switch).** The footer gains a `role="switch"` "Refresh Experience" toggle:
> activating it pops every visible letter at random timing/drift/tilt (words
> stay nowrap so layout never moves), the EXISTING preloader rises over the
> mid-pop letters via a bridge (no second overlay), then — behind the opaque
> overlay — scroll returns home, text is restored, and on dismissal the page
> resets to its shipped initial state (accordion first row open, viewer
> closed, magnet/ripple cleared, all entry signatures re-armed to replay).
> A lock makes double restarts impossible; reduced motion skips the burst and
> takes a 400 ms path; no-JS hides the switch. A WhatsApp fab (green, dark
> glyph at 6.5:1) builds `wa.me/<number>?text=hi balakrishnan` from a
> `data-number` attribute — client number 9384590539, stored with India's
> country code (919384590539); the button self-removes if that is emptied. Latent v9.4 overflow fixed: sections now
> clip horizontally, so pre-entry slides never create a scrollbar (320 px
> fresh load = 320/320). Verified in audit-v910: 464 chars bursting, handoff,
> restore, exact post-reset state, re-arm replay, RM/no-JS clean, WhatsApp
> popup URL correct with an injected test number, 0 errors, 0 overflow.


> **v9.9 (client data: education timeline).** Education is now a connected
> four-node timeline on one drawn spine: Dalmia Higher Secondary School
> (2019, 60%) → Vettri Vedyalaya Higher Secondary School, Computer Science
> group (2021, 70%) → B.E. Robotics and Automation, Dhanalakshmi Srinivasan
> Engineering College (2021–2025, CGPA 7.4) → paid Full Stack Development
> internship, Shanthi IT Solutions (Aug 2026 – present), whose node is brand
> pink with a breathing ring. The spine draws once on entry (its own
> mechanism, distinct from experience's scroll-grown line), nodes pop 150 ms
> apart, and reduced-motion / no-JS render the full static spine.
> Certifications gallery unchanged below. Verified: node centres exactly on
> the spine, years in order, pulse live, 0 overflow 320–1440, 0 errors, both
> themes + mobile screenshots in audit-v99/. Class X/XII labels are the
> standard reading of the 2019/2021 completions — flagged as one-word
> corrections if wrong.


> **v9.8 (client instruction: "perfect color for preloader — light and dark
> mode").** The preloader joins the theme system: its field is the page's own
> paper (`var(--paper)`) in each scheme — seamless with the page it reveals
> and with the per-scheme `meta theme-color` — the trilingual introduction
> runs in `var(--ink)` (14.9:1 light / 15.2:1 dark), and the client's brand
> #EA4961 stays as the constant bar/ball accent (3.3:1 on light paper, 4.9:1
> on dark paper — both above the 3:1 non-text minimum). This overrides the
> v9.5 fixed pink field by client request. Re-verified in both schemes:
> computed colours per spec, 0 console errors, 0 overflow, screenshots in
> audit-v97/ (`preloader-light.png`, `preloader-dark.png`).


> **v9.7 (client instruction: dark + light mode connected to browser mode).**
> The palette is tokens on `:root`; one `@media (prefers-color-scheme: dark)`
> block re-declares them (paper #10151F, ink #ECEAE3, blue #8CA4FF and
> derivatives). No toggle, no JavaScript — it follows the OS/browser setting
> live. Hard-coded colours became tokens (`--edge`, `--blue-soft`,
> `--blue-faint`, `--blue-tint`, `--shadow`); the preloader keeps its brand
> #EA4961 field and the inspection viewer keeps its dark scrim in both themes
> (`--scrim`/`--scrim-ink`); dark-mode skill icons invert so black logos stay
> visible; `color-scheme` + two `meta theme-color` tags included. Measured
> contrast: light body 14.85:1 / muted 5.02:1 / links 7.68:1 / button 6.29:1;
> dark body 15.18:1 / muted 6.41:1 / links 9.97:1 / button 7.72:1. Verified in
> both schemes: 0 overflow 320–1440, 0 console errors, screenshots in
> audit-v97/.


> **v9.6 (client instruction: "header remove completely").** The whole
> `<header class="site-head">` is gone — markup, its CSS (sticky block, both
> responsive blocks, `--head-h`, the v9.4 cobalt reading-progress rule) and its
> JS (mobile-nav and scroll-spy modules deleted, remaining modules renumbered
> 1–8, `--sp` write removed). No capability is lost: the resume keeps three
> CTAs (hero, contact, footer), section wayfinding lives in the footer nav +
> back-to-top + skip link. Verified: 0 header nodes in the DOM, first Tab =
> skip link, footer nav jumps land on target, accordion/viewer/back-to-top
> regressions pass, 0 overflow 320–1440, 0 console errors, reduced-motion and
> no-JS unchanged. Trade noted honestly: mid-page section jumping now requires
> reaching the footer (client's call against the original wayfinding finding).


> **v9.5 (client instruction: certificate images + footer fixes + trilingual preloader).**
> (1) Certifications are now real, viewable images: a two-figure gallery built
> from the client's own certificate screenshots, each captioned with course,
> issuer and completion year (MERN bootcamp 2026 per the certificate's printed
> date of 23 June 2026; Prompt Engineering 2025 as already listed on the site —
> the second certificate image prints "Awarded Invalid Date", flagged to the
> client), and both open in the existing full-size viewer as their own 2-item
> group with arrows, Esc and focus return. (2) The v9.4 cobalt footer rule is
> gone and the footer is half its height: 564 px → 287 px measured at 1440 w,
> content unchanged. (3) A full-screen preloader on #EA4961 carries the
> client's original five-bar + bouncing-ball loader (SCSS converted to plain
> CSS, original 4 s rhythm and relative bar heights kept) beneath an
> introduction cycling "Hi, I'm Balakrishnan." → Tamil → Hindi at 1.5 s each in
> a fixed-height slot (no layout shift), repeating while visible; dismissal at
> max(window load, one full 4.8 s pass) with a 10 s cap for stalled assets,
> scroll lock while up, timers cleared on hide, no-JS hides the overlay
> entirely, reduced motion shows one static English sentence with frozen bars
> and an instant exit. Verified: EN/TA/HI sampled at 0/2/3.8 s, bars+ball
> animating, hidden+unlocked+timers-stopped after, cert viewer "1 / 2" →
> "2 / 2" → Esc returns focus, footer ::before none at 287 px, 0 overflow
> 320–1440, 0 console errors, reduced-motion and no-JS paths clean.


> **v9.4 (client instruction: "incredible animations for full page — but not same").**
> One signature mechanism per section, none repeated: header cobalt reading
> progress (scaleX on scroll) · hero kicker decode-scramble (real text kept in a
> visually-hidden span for AT) · section titles rise per character inside
> overflow masks (h2 keeps aria-label) · project rows wipe open left→right
> (clip-path, 100 ms apart) + opened frame settles once per expansion ·
> experience entries slide in from alternating sides behind one faint timeline
> line that grows with reading (scroll-linked scaleY) · education entries land
> like passport stamps (scale+rotate settle) · About rises word by word
> (77 words, 14 ms steps) · contact actions pull magnetically toward the cursor
> (pointer-fine only) · footer hairline inks itself cobalt left→right. Skills
> keep their v9.3 set. Entry-hidden states live inside
> `prefers-reduced-motion: no-preference`, so reduced-motion users never meet a
> hidden state; no-JS renders every section plain and complete (0 char/word
> splits, no timeline, kicker intact). Measured: 86 title chars, 77 about
> words, wipe clip-path none after entry, stamp keyframe on education,
> timeline --tp 0.41 → 0.88 through the section, progress --sp 1 at page end,
> magnet translate set/reset, 0 overflow at 320–1920, 0 console errors.

> **v9.3 (client instruction: "give incredible animations" for Technical Skills).**
> Five motion layers, all transform/opacity, all dead under
> `prefers-reduced-motion`, all absent without JS except two pure-CSS delights
> that hide nothing: (1) staggered cascade — all 25 skill rows rise once in
> reading order, 35 ms apart; (2) a soft cobalt light-sweep across each column
> as the section enters; (3) hover tiles — row tint, cobalt tick drawing at the
> left edge, icon colourising with an overshoot pop; (4) a cursor-proximity
> ripple field: rows within 150 px of the pointer lift and slide a few pixels
> (pointer-fine devices only, rAF-throttled, re-measured after scroll);
> (5) breathing cobalt dots on the "Currently learning" items. Measured:
> 25/25 rows visible after entrance, ripple --lift 1 near / 0 far and reset on
> pointer-leave, reduced-motion shows everything instantly with zero
> animations, no-JS shows every row, 0 console errors.

> **v9.2 (client correction):** "show the full image in small frame" — the v9.1
> full-bleed is revoked. The in-page frame is contained again (bordered,
> rounded, inside the reading column) and renders the **entire screenshot at
> its natural ratio** (`width:100%; height:auto` — no cover-crop), as do the
> small switcher thumbs. Full-screen remains where it was asked for: the
> inspect viewer (`#lightbox`) only. Measured: frame 1168 px in a 1240 px
> column, rendered ratio == natural ratio (1.6) on frame and thumbs.

> **v9.1 (client correction):** project images are full screen, not a contained
> box. The expanded row's frame is full-bleed — 100vw edge-to-edge, top/bottom
> hairlines only, 16:10 ratio kept so nothing crops (at 1440×900 the frame is
> exactly one screen). The inspect viewer is true full-screen: the image fills
> the viewport above a slim ink caption bar (caption + n / N), with close and
> prev/next overlaid. Measured: stage 1440/1440 px, viewer image+bar 900/900 px,
> 0 horizontal overflow at 320–1920.
>
> **v9 change (Selected Work, client instruction):** the v8 all-visible screenshot
> grid is gone. Selected Work is now a compact list of four hairline rows
> (index · title · one-line summary · category · caret). Each row is a native
> `<details>`: it opens with zero JavaScript, and ES6 adds one-at-a-time
> expansion plus a 320 ms height animation. The expanded row shows one big
> 16:10 screenshot; beneath it, left, three thumbnail links switch which of the
> project's three screens the big frame shows (without JS they open the files);
> beneath it, right, a per-browser like toggle (`aria-pressed` + localStorage,
> no fabricated global count). Then Problem / What I built / Stack / links, in
> flow. The big frame still opens the v8 full-size viewer (`#lightbox`) at the
> shown screen. The first row is open by default so evidence is visible without
> a click. Blueprint §C.5/E.2/F/H/K/L carry the v9 spec.
>
> **v8 record:** the scroll-snap carousel, arrows/dots and the segmented rail
> from v7 are gone; every screenshot sat in normal page flow (lead frame full
> width, rest two-up) and each frame opened a full-size accessible viewer
> (`#lightbox`: Escape closes, ← → move, Tab trapped, focus returns, scroll
> locks). Without JavaScript the same links opened the image files directly.

## v7 record (kept for history)

Rebuilt from `portfolioneww.zip` (audited 2026-10-11). Same content, same visual
identity (paper / ink / cobalt, Fraunces + Instrument Sans + IBM Plex Mono),
corrected architecture. HTML5 + CSS3 + vanilla ES6 only — no frameworks, no
build step.

## Run

```bash
cd portfolio-redesign
python3 -m http.server 8000
```

## What changed and why (each item was a confirmed defect in the audit)

| Change | Defect it fixes (measured) |
| --- | --- |
| Slim sticky header carries the site navigation at every scroll position; mobile disclosure menu with `aria-expanded`, Escape, outside-click, and a no-JS fallback that leaves the menu visible. | The only navigation was in the footer at ~9,000px; Contact sat 8,325px below the fold with no way to jump to it. |
| Project details (Problem / What I built / Stack) moved into normal document flow. | With JS on, the read-more overlay set `hidden` on the detail blocks: screen-reader/AT-visible text per project fell from 730–2,010 chars to 190–390 chars (~75% of the evidence hidden). |
| Read-more overlay deleted (no absolutely-positioned panel inside the image frame). | The panel's close button measured at `top: -511px` (off-viewport) once the card scrolled; on a 1280×620 laptop the panel was 758px tall in a 620px viewport with the close button out of view; on 390×844 the entire case study was a 222px nested scroll box. |
| Focus management simplified: nothing moves focus on open/close; Escape only closes the mobile menu and returns focus to its toggle. | `closeBtn.focus()` never landed (focus stayed on the toggle); pressing Escape anywhere on the page yanked focus to a read-more button ("focus steal"); tabbing from an open overlay walked into the next card's controls, visually covered by the overlay. |
| Screenshot viewer is a native scroll-snap strip; dots and counter moved below the frame; arrows scroll it; position mirrored into dots + a polite live region. | The transform carousel defeated `loading="lazy"` (9 of 12 images downloaded immediately); controls sat on a gradient over the screenshot (contrast gamble) and collided with the fixed back-to-top button at 390px. |
| Like button removed. | A localStorage "likes" counter that starts at 0 on every project is dead social proof; it added a tab stop, a storage write and a pop animation for no recruiter value. |
| Page scrollbar left alone (`scrollbar-width: none` removed). | The scrollbar was globally hidden — on a ~9,400px single page it was the reader's only persistent position indicator. |
| Back-to-top reduced to show-after-hero / hide-at-page-end. | The old visibility engine (~180 lines of rectangle collision math) still left the button hidden 30% of the scroll (14/20 samples) and oscillating. |
| All section headers left-aligned; footer column labels demoted from `h2` to styled `p`. | Centred headers for five sections vs left-aligned project masthead read as two different sites; `h2` "Navigate"/"Links" polluted the heading outline next to real content sections. |
| Hero compacted; quick-facts rail becomes a two-column grid ≤1023px. | Mobile hero was 1,025px tall — more than a full 844px viewport — pushing the first project title to 1,334px. |
| Header row fits 320px (brand collapses to a monogram with an `aria-label` keeping the full name). | 50px horizontal overflow at 320px (`A.btn right=370`). |
| Footer email link padded to a 25px target. | 19px touch target at 390px. |

## Verified after the rebuild (headless Chromium, 320–1920px)

- 0 console errors, 0 failed requests, 0 horizontal overflow at 360/480/768/1024/1280/1440/1920.
- Hidden project content: **0** elements; no-JS page exposes the full case study per project and all 12 screenshots in flow, each linked to its image file.
- v8 gallery: 12/12 frames visible in normal flow (2-up grid, lead frame full width, 1 column under 768px); 11 lazy + 1 eager.
- v8 viewer: click opens at full size with caption + "n / 3" counter; ← → wrap; Escape closes; Tab cycles close→prev→next only; focus returns to the opening frame; body scroll locks while open; scrim click closes; works under reduced motion.
- Header scroll-spy marks the section being read (`aria-current`); back-to-top hidden at the page end.
- Reduced motion: 0 of 38 reveals hidden, no transforms.
- Header text contrast measured from rendered pixels: 5.9:1 (anti-aliased edge) to 14.9:1 (glyph core) on paper.

## Known limitations (unchanged, content-level)

- KADAI and TripAdvisor screenshots show marketing/home screens only; cart, admin
  and auth flows are described but not pictured. Replacing two of the three
  frames per project with functional screens is a content task, not a code one.
- The resume PDF still carries unverified metrics and a LinkedIn URL that
  differs from the one used on this site; both need the candidate's own correction.
- Google Fonts remains the only external dependency; offline it falls back to system fonts.
