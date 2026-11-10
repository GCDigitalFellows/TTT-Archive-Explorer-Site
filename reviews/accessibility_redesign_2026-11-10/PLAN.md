# Accessibility redesign: plan and first prototype

Design feedback: **Lisa Marie Rhody** and **Sophie Bala**, credited at Ian G. Williams’s explicit request. Ian requested the plan and prototype and will write the archive introduction and personal process narrative. OpenAI Codex drafted this plan and implemented the prototype; exact model/build not recorded. Neither contributor’s review or approval of this prototype is established.

## Aim and current scope

Help a public reader understand what the blog is, why its writing might matter, and where to begin. This is an isolated six-post demonstration, not a replacement for the published explorer. No corpus, model, authorship rule or deployment setting changes.

## Proposed sequence

1. **Make reading comfortable.** Replace pixel typography in the reading interface with locally hosted Atkinson Hyperlegible Next, including headings and controls; offer system sans serif. Use relative sizes, generous line spacing and bounded line lengths. Retain the font’s OFL notice. A font choice alone does not establish readability for everyone.
2. **Give colors consistent jobs.** Dark body text, plum headings and teal underlined links on a light background; an optional dark version. Notes have labels and borders as well as color. Avoid pale, small explanatory text and competing accent colors. Test each actual foreground/background combination.
3. **Lead with Ian’s introduction.** Explain Tagging The Tower’s institutional setting, the occasions and questions behind its writing, and Ian’s proposed lens of living through and with change. Keep a short explanation of GCDI and of guest contributions. Leave the first-person writing to Ian.
4. **Offer clear ways into the archive.** Place question-led reading paths, search and random discovery after the introduction. Preserve the complete published archive search, full reading and source links when integrating. The prototype searches six examples only; its three paths are editorial proposals, not MALLET topics.
5. **Explain the making separately.** Give Ian’s account of using an AI tool its own section. Follow it with brief source → calculation → interpretation explanations and expandable methods. Keep credit evidence, denominators and unresolved questions discoverable.
6. **Carry the foundation across routes after review.** Apply shared typography/color tokens to browsing, reading, analysis and credits. Preserve design-history experimentation, but require every era to retain readable text, focus and contrast. Review charts separately: interface improvements do not fix chart labels or equivalent table access automatically.
7. **Test before promotion.** Check keyboard navigation and focus, screen-reader structure, large text, user spacing overrides, narrow reflow, forced colors, reduced motion and light/dark contrast. Invite limited human review when available; do not represent automated checks as participant testing.

## Prototype reading and editing route

Open `prototype/index.html` through a local web server. `prototype/styles.css` contains named color and reading tokens; `prototype/preview.js` controls the six examples and reader preferences. `build_preview.py` selects saved public article passages and supported/declared credits from the existing corpus and writes `prototype/data.js`. It fits no model and changes no source records. `test_preview.py` checks scope, basic structure and solid-color contrast. Editing the six-example demonstration does not change the full website.

The introduction, heading and reading paths are discussion copy. Two clearly labeled spaces await Ian’s writing. See [WRITING_GUIDE.md](WRITING_GUIDE.md) for evidence and prompts. Scope is the November 9, 2026 snapshot, not a promise that counts remain constant.

## Evidence used and limits

The project knowledge base’s S09–S11 supports examining how interface categories and defaults construct a reading: here, explicit labels separate proposed reading paths from fitted topics and prevent credit from implying membership. These are humanities arguments, not experimentally proven layout prescriptions. See the [project methods](../../METHODS_AND_DATA.html).

Primary accessibility references:

- [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): normal text at least 4.5:1, large text at least 3:1. Our focused test applies 4.5:1 to all named text pairs.
- [W3C text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html): content must tolerate user overrides without losing content or function; the listed values are not mandatory default styling.
- [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): test equivalent 320 CSS-pixel width, including zoom scenarios, with applicable exceptions for intrinsically two-dimensional content.

Applied local guidance: flexible typography, cognitive-load assessment and heading structure. Testing is limited to the checks recorded in the work log; no conformance certification or learner-comprehension claim is made.

## Decisions for the next review

- Does “Living and learning with digital change” suit Ian’s argument, or should his opening set a different frame?
- Which experiences and tensions should the introduction emphasize? The six examples are a starting selection, not a canon or representative sample.
- How much of the process narrative belongs on the landing page before linking to fuller methods?
- Which readers can assess the next version, and what support will make their review possible?

These choices do not block this prototype. Applying the redesign to the public site is a separate review step.
