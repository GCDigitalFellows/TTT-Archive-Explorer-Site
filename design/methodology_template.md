# A changing web: methodology and sources for the 2012–2026 design lenses

[Open the rebuilt explorer](interactive_explorer.html). Its appearance lab offers fifteen annual presets, from 2012 through 2026, plus independent typography, surface, composition, spacing, color-mode, and strength controls. The design year is a calendar-year lens; it is separate from every academic-year filter in the analysis.

These are **representative, source-grounded visual directions**, not claims that a single style dominated every website in a given year. The presets are an interpretive design-history exercise. There is no market-share dataset behind the year labels.

## How the stylistic directions were identified

**1. Establish a bounded research question.** We looked for visible web and interface conventions that could be translated into a research explorer between 2012 and 2026. The reference cutoff is October 31, 2026, using this session's date context. We did not attempt to describe every country's, industry's, or platform's design history.

**2. Search for dated anchors and contemporary discussion.** The research combined year-specific searches for web-design trends with named product/design-system milestones. Microsoft, Apple, Google, and Android materials establish dated directions and implementation events. Nielsen Norman Group, contemporary design publications, practitioner examples, and annual reports help contextualize visibility. Primary launch evidence was preferred for event dates; it was not treated as proof of universal adoption.

**3. Classify what each source can support.** A launch announces a system. An implementation milestone demonstrates that a toolkit or product shipped. A tutorial or case study documents a practitioner's approach. An editorial review selects examples. A forecast records expectations. These are different kinds of evidence, and both the page and the ledger label them. Unknown publication dates remain unknown; a URL month or event year is not silently converted into an invented day.

**4. Code observable features.** We read for palette structure, heading treatment, geometry, control shape, surface depth, material cues, spacing, composition, and motion. The feature matrix records our coding, including the proposed source-to-feature relationship and its limitation. This was a qualitative synthesis, not automated image classification, a frequency count of screenshots, a formal systematic review, or an inter-rater reliability study.

**5. Choose one usable direction per year.** Selection favors a documented direction that is distinguishable in this interface and has an inspectable source trail. Where several directions coexisted, the chosen lens is one defensible example. The sequence is not a story in which each style suddenly appears on January 1 and replaces its predecessor.

**6. Translate features into design tokens and grouping rules.** Colors, headline font families, corner radii, borders, shadows, background accents, and containment are encoded in `design/style_catalog.json`. The same catalog drives the page, the annual table below, and the CSV feature matrix. The exact hexadecimal colors and pixel values are our adaptation, not measurements extracted from historical brand specifications.

**7. Preserve the analytical task.** Native controls, legible data labels, adequate contrast, stable reading order, and explicit chart scopes remain in every preset. We retained chart scales and label semantics. Historical conventions that would reduce usability were adapted: light type is kept readable, soft UI retains visible control edges, glass panels use mostly opaque reading surfaces, and expressive themes avoid distracting motion.

**8. Check both style and numerical continuity.** Pure JavaScript functions generate the appearance from whitelisted inputs. The design controller writes only CSS roles, design-state attributes, source descriptions, and appearance controls. It does not change model selections, corpus filters, topic mixtures, labels, or data. Separate checks compare the interactive mathematics with saved Python outputs, and the existing 43-file reference check remains in place. Browser checks examine style changes while a meaningful analysis selection is held fixed.

## What the annual mapping means

| Design year | Representative direction | Evidence basis | Features translated into the site | Important limitation | Direct supporting sources |
|---|---|---|---|---|---|
{{ANNUAL_TABLE}}

The downloadable feature matrix is `design/annual_feature_matrix.csv`; the full source catalog is `design/style_catalog.json`. The selected year's sources and caveat are also visible under “Why this look?” inside the explorer.

## Date and attribution distinctions that matter

Metro, flat interfaces, dark interfaces, duotone, and translucent materials have histories preceding their assigned years. The year marks the selected evidence lens, not an invention claim. The 2016 duotone sources discuss a 2015 precursor; the 2021 glass direction includes a 2020 product reference. Material You was introduced in 2021: the 2022 preset uses documented expansion and implementation milestones. The 2018 direction is Material Theming, not an asserted official release called “Material Design 2.0.”

The 2024 Webflow source is a forecast updated in December 2023, supplemented by within-2024 commentary. **The 2026 preset is explicitly forecast-led**, drawing on a Webflow article updated in December 2025 and a broader Adobe creative forecast. These sources support an expected direction and selected examples, not a completed empirical account of what dominated 2026. The Adobe source is not exclusively about websites. Current source pages may be revised after their original publication; the catalog preserves the date qualifications used for this interpretation rather than claiming an archived, immutable snapshot.

## Adaptation rather than historical imitation

The site contains no copied brand logos, copyrighted source screenshots, or downloaded historical typefaces. Fonts are local substitutes and fallbacks. Georgia stands in for an editorial serif direction; available system sans, rounded, display, and monospace stacks express other categories. The actual face depends on the viewer's installed fonts. We do not claim these are the exact original product typefaces.

The 2016 preset uses paired-color regions instead of literal duotone photographs. Fluent-inspired layers are a source-specific spatial treatment, not a claim that opaque Mica and translucent glass are identical. The 2024 preset borrows expressive type and graphic patterning without reproducing every maximalist technique. The 2026 paper-like accent is a CSS interpretation of craft, not an image extracted from a trend report.

This translation is a designed argument about a period. It can be questioned, recoded, or replaced by editing the catalog. Its qualitative status should remain visible if the explorer is shared.

## How the modulation controls work

- **Design year** selects a complete preset. The slider, dropdown, and previous/next buttons stay synchronized.
- **Typography** chooses the heading family and treatment; the body and data labels remain readable system text.
- **Surface treatment** switches among flat, quiet, elevated, soft, glass, and hard-edged treatments.
- **Composition** switches between open flow, layered panels, and bento-style containment without changing content order.
- **Spacing** changes density, preserving text size and control usability.
- **Color appearance** uses the year palette or a light/dark adaptation. A contrast safeguard adjusts role colors where needed.
- **Styling strength** blends palette and shape toward a neutral treatment. Type and composition are categorical choices, not interpolated fonts or layouts. At zero, a neutral reader treatment overrides decorative features.
- **Reset this year's look** clears custom overrides for the current year. Custom overrides otherwise persist as the year changes.
- **Download appearance settings** exports the choices and source references as readable JSON. It does not export or alter analysis filters.

The URL fragment can preserve appearance settings for a bookmark. Only whitelisted appearance fields are read from it; it never changes academic-year, writer, cohort, or model settings. No network request is needed to switch a year or adjust the look. Reference links and the separate documentation page are deliberate navigation actions.

## Accessibility and test limits

The palette checks use W3C's explanation of relative luminance and the ordinary-text 4.5:1 minimum as a safeguard. Main text, secondary text, links, and chart-label backgrounds are checked across presets, strength levels, and light/dark adaptations. Visible control edges are retained. Native focus indicators and keyboard interactions remain available. The W3C motion guidance informs the reduced-motion rule; there is no autoplay or decorative spring/parallax animation. Subtle color transitions are disabled when a reduced-motion preference is active.

These checks are not a certification of complete WCAG conformance. Browser rendering, installed fonts, transparency, zoom, device behavior, and actual assistive-technology use still deserve review. The accompanying test record distinguishes numerical/palette checks from browser observations and records the viewports used.

## Biases and open questions

The source set favors English-language, widely documented technology companies and design publications. Vendor announcements and forecasts have promotional incentives. Editorial lists favor visible, novel examples. Desktop web, mobile platforms, and operating-system interfaces influence one another but are not interchangeable markets. Our annual binning also compresses overlapping and uneven adoption.

A stronger adoption study would sample archived sites across sectors, regions, and screen sizes; establish a coding scheme; use multiple coders; and report feature frequencies and disagreement. That study was not performed here. The current reconstruction is transparent about its source-grounded but curated character.

## Review and rebuild the code

Start with `design/style_catalog.json` for the research decisions, `design/style_math.js` for the appearance calculation, and `design/style_ui.js` for the control bindings. `design/year_styles.css` contains the visual implementation. The analysis functions remain in their existing files. The new builder and scripts retain named stages and plain-language comments for a reviewer who is not an advanced package user.

```bash
python3 analysis/build_style_docs.py
python3 analysis/build_interactive.py
node --test analysis/design/test_styles.js analysis/interactive/test_core.js
python3 analysis/verify_revision.py
python3 analysis/package_report.py STYLE_METHODOLOGY.md
```

The finished explorer remains a self-contained offline file. Keep `STYLE_METHODOLOGY.html` alongside it to use the separate documentation link, or share the complete bundle. The selected-year source trail is also embedded in the explorer itself.

## Complete linked source ledger

Every source used for the annual presets or the accessibility rationale is linked below. Search results that were not used as evidence are not presented as supporting references.

{{SOURCE_LEDGER}}
