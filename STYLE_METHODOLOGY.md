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
| 2012 | Metro / typography first | Product-system lens | Rectangular fields, an open grid and emphatic typography. | Metro predates 2012; these sources document its contemporary articulation. | [Microsoft Devices Blog](https://blogs.windows.com/devices/2012/01/30/metro-and-print/); [Microsoft / TechEd Europe](https://learn.microsoft.com/en-us/shows/teched-2012/dev351) |
| 2013 | Flat / reduction and clarity | Launch + contemporary reporting | Bright accents, reduced ornament and lightweight headings. | We retain readable weights and visible control boundaries instead of copying extreme thinness. | [Apple Newsroom](https://www.apple.com/newsroom/2013/06/10Apple-Unveils-iOS-7/); [Ars Technica](https://arstechnica.com/gadgets/2013/06/apple-announces-flatter-sleeker-ios-7/) |
| 2014 | Material / paper layers | Primary launch | Elevated paper-like planes, organized color and clear hierarchy. | The launch dates the direction, not universal adoption that year. | [Google Developers Blog](https://developers.googleblog.com/en/this-is-material-design/) |
| 2015 | Flat 2.0 / quiet depth | Contemporary analysis + review | Mostly flat composition with restrained elevation and explicit affordances. | The preset keeps clickable controls recognizable, following the usability critique. | [Nielsen Norman Group](https://www.nngroup.com/articles/flat-design/); [Creative Bloq](https://www.creativebloq.com/netmag/10-website-trends-defined-2015-111517948) |
| 2016 | Duotone / graphic color | Contemporary trend commentary | Two-color fields, bold headings and contrasting graphic accents. | Without photographs, paired color fields translate image duotone rather than reproduce it literally. | [Obergine](https://obergine.com/news-and-blog/2016/august/design-trends-duotone-images); [Creative Bloq](https://www.creativebloq.com/features/9-top-design-trends-of-2016) |
| 2017 | Fluent / light and layers | Product-system lens | Subtle layered materials, spatial hierarchy and light cues. | A Windows design-system influence, not a claim of web-wide dominance; no Mica/glass equivalence. | [Windows Insider Blog](https://blogs.windows.com/windows-insider/2017/05/11/build-2017-sparking-the-next-wave-of-creativity-with-the-windows-10-fall-creators-update/); [Microsoft](https://news.microsoft.com/wp-content/uploads/2017/05/Build-2017-Joe-Belfiore-transcript.pdf) |
| 2018 | Material Theming / brand expression | Launch coverage + implementation | Custom color, type and component shape within a coherent system. | The serif heading and our colors are an illustrative brand treatment, not Google’s exact typeface or palette. | [Google Design](https://design.google/library/making-more-with-material); [Android Developers Blog](https://android-developers.googleblog.com/2018/08/google-releases-source-for-google-io.html); [Fast Company](https://www.fastcompany.com/90171179/exclusive-meet-material-theming-googles-ambitious-design-tool) |
| 2019 | Dark mode / restrained light | Primary launch + web implementation | Dark planes, differentiated foreground levels and luminous accents. | Dark interfaces have earlier histories; 2019 supplies product and web implementation milestones. | [Apple Newsroom](https://www.apple.com/newsroom/2019/06/apple-previews-ios-13/); [web.dev](https://web.dev/articles/prefers-color-scheme) |
| 2020 | Soft UI / neumorphism | Practitioner artifact + case study | Near-monochrome surfaces and paired raised/recessed shadows. | Visible borders and focus indicators remain; shadow alone never identifies a control. | [Agente](https://agentestudio.com/blog/neumorphism-icon-set); [F5 Studio](https://f5-studio.com/articles/using-neumorphism-in-ui-design-of-a-business-site/) |
| 2021 | Glass / translucent layers | Contemporary tutorial + preceding launch | Frosted panels over diffuse color fields with subtle highlighted edges. | This is a 2021 visibility lens with older antecedents; no claim that glass was invented then. | [Creative Tim](https://www.creative-tim.com/blog/web-design/glassmorphism-new-design-trend/); [Apple Newsroom](https://www.apple.com/newsroom/2020/06/apple-introduces-macos-big-sur-with-a-beautiful-new-design/) |
| 2022 | Material You / tonal roles | Diffusion + implementation milestone | Coordinated tonal surfaces, rounded controls and generous spacing. | Uses 2022 expansion and toolkit milestones; Material You was introduced in 2021. | [Android Developers Blog](https://android-developers.googleblog.com/2022/02/material-you-coming-to-more-android.html); [Android Developers Blog](https://android-developers.googleblog.com/2022/10/material-design-3-compose-stable.html) |
| 2023 | Bento / modular compartments | Contemporary trend commentary | Rounded compartments, consistent gaps and a modular visual hierarchy. | Bento is a documented direction, not a 2023 invention or measured majority style. | [Design Shack](https://designshack.net/articles/trends/bento-style-rounded-corners/); [Flux Academy](https://www.youtube.com/watch?v=onQ9KGWysQY) |
| 2024 | Expressive editorial / rich graphics | Forecast + within-year review | Oversized type, assertive lines and restrained patterned graphic accents. | This translates selected expressive features to a research interface, rather than reproducing maximalist distraction. | [Webflow](https://webflow.com/blog/web-design-trends-2024); [Creative Bloq](https://www.creativebloq.com/web-design/the-best-web-design-trends-of-2024) |
| 2025 | Material 3 Expressive / shape and focus | Primary launch + design rationale | Varied containment, strongly shaped actions and tonal emphasis. | A source-specific direction; the optional spring-like motion is not reproduced in this reading tool. | [Google](https://blog.google/products-and-platforms/platforms/android/material-3-expressive-android-wearos-launch/); [Google Design](https://design.google/library/expressive-material-design-google-research) |
| 2026 | Human craft / expressive systems | Forecast-led interpretation | Warm editorial type, paper-like accents and a deliberate color family. | Forecasts frame this lens; they do not establish that these styles dominated 2026. | [Webflow](https://webflow.com/blog/web-design-trends-2026); [Adobe](https://business.adobe.com/resources/creative-trends-report.html) |

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

### S01. Microsoft Devices Blog

[Metro and Print](https://blogs.windows.com/devices/2012/01/30/metro-and-print/)

Date: 2012-01-30. Evidence type: primary design explanation. Research record consulted: 2026-10-31.

Use and limitation: Typography and rectangular composition as an established Metro direction; not its invention date.

### S02. Microsoft / TechEd Europe

[Designing Apps With Metro Principles and Windows Personality](https://learn.microsoft.com/en-us/shows/teched-2012/dev351)

Date: 2012 (event). Evidence type: primary conference session. Research record consulted: 2026-10-31.

Use and limitation: Color, typography and motion in a particular product-design language.

### S03. Apple Newsroom

[Apple Unveils iOS 7](https://www.apple.com/newsroom/2013/06/10Apple-Unveils-iOS-7/)

Date: 2013-06-10. Evidence type: primary launch. Research record consulted: 2026-10-31.

Use and limitation: A dated redesign of Apple interfaces; does not establish web-wide prevalence.

### S04. Ars Technica

[Apple announces flatter, sleeker iOS 7](https://arstechnica.com/gadgets/2013/06/apple-announces-flatter-sleeker-ios-7/)

Date: 2013-06-10. Evidence type: contemporaneous independent reporting. Research record consulted: 2026-10-31.

Use and limitation: Independent contemporary characterization of a flatter interface.

### S05. Google Developers Blog

[This is material design](https://developers.googleblog.com/en/this-is-material-design/)

Date: 2014-06-25. Evidence type: primary launch. Research record consulted: 2026-10-31.

Use and limitation: Launch of paper-like surfaces, elevation and a coordinated cross-platform language including web tooling.

### S06. Nielsen Norman Group

[Flat Design: Its Origins, Its Problems, and Why Flat 2.0 Is Better for Users](https://www.nngroup.com/articles/flat-design/)

Date: 2015-09-27. Evidence type: contemporaneous usability analysis. Research record consulted: 2026-10-31.

Use and limitation: Explains reduced ornament and the importance of retaining visible interaction cues.

### S07. Creative Bloq

[10 website trends that defined 2015](https://www.creativebloq.com/netmag/10-website-trends-defined-2015-111517948)

Date: 2015-11-30. Evidence type: within-year editorial review. Research record consulted: 2026-10-31.

Use and limitation: Selected examples of visible web conventions; not a representative usage survey.

### S08. Obergine

[Design trends: Duotone images](https://obergine.com/news-and-blog/2016/august/design-trends-duotone-images)

Date: 2016-08-02. Evidence type: contemporaneous practitioner commentary. Research record consulted: 2026-10-31.

Use and limitation: Discusses paired colors and a 2015 Spotify campaign as a precursor.

### S09. Creative Bloq

[9 top design trends of 2016](https://www.creativebloq.com/features/9-top-design-trends-of-2016)

Date: 2016-11-07. Evidence type: within-year editorial review. Research record consulted: 2026-10-31.

Use and limitation: Corroborates visibility of bold graphic directions, without market-share evidence.

### S10. Windows Insider Blog

[Build 2017: Sparking the next wave of creativity with the Windows 10 Fall Creators Update](https://blogs.windows.com/windows-insider/2017/05/11/build-2017-sparking-the-next-wave-of-creativity-with-the-windows-10-fall-creators-update/)

Date: 2017-05-11. Evidence type: primary launch. Research record consulted: 2026-10-31.

Use and limitation: Dated Fluent introduction; evidence of a product-system influence, not a web census.

### S11. Microsoft

[Build 2017 Joe Belfiore transcript](https://news.microsoft.com/wp-content/uploads/2017/05/Build-2017-Joe-Belfiore-transcript.pdf)

Date: 2017 (Build event). Evidence type: primary conference transcript. Research record consulted: 2026-10-31.

Use and limitation: Articulates Fluent light, depth, motion, material and scale.

### S12. Google Design

[Making More with Material](https://design.google/library/making-more-with-material)

Date: 2018 context; exact page date not verified. Evidence type: primary design explanation. Research record consulted: 2026-10-31.

Use and limitation: Describes customizable color, type and component shape.

### S13. Android Developers Blog

[Google releases source for Google I/O 2018 for Android](https://android-developers.googleblog.com/2018/08/google-releases-source-for-google-io.html)

Date: 2018-08 (URL month; day not verified). Evidence type: primary implementation milestone. Research record consulted: 2026-10-31.

Use and limitation: Confirms Material Theming at I/O 2018 through an implementation.

### S14. Fast Company

[Exclusive: Meet Material Theming, Google’s ambitious design tool](https://www.fastcompany.com/90171179/exclusive-meet-material-theming-googles-ambitious-design-tool)

Date: 2018-05-08. Evidence type: contemporaneous independent reporting. Research record consulted: 2026-10-31.

Use and limitation: Dated contemporary reporting supporting the 2018 assignment.

### S15. Apple Newsroom

[Apple previews iOS 13](https://www.apple.com/newsroom/2019/06/apple-previews-ios-13/)

Date: 2019-06-03. Evidence type: primary launch. Research record consulted: 2026-10-31.

Use and limitation: System-wide dark appearance as a prominent product milestone; not its origin.

### S16. web.dev

[prefers-color-scheme: Hello darkness, my old friend](https://web.dev/articles/prefers-color-scheme)

Date: 2019-06-27 shown update. Evidence type: contemporaneous implementation guidance. Research record consulted: 2026-10-31.

Use and limitation: Documents web implementation and user-override considerations.

### S17. Agente

[Neumorphism in UI: Free Icon Set](https://agentestudio.com/blog/neumorphism-icon-set)

Date: 2020-03-05. Evidence type: primary practitioner artifact. Research record consulted: 2026-10-31.

Use and limitation: Demonstrates rounded soft surfaces with paired shadows.

### S18. F5 Studio

[Using Neumorphism in the UI Design of business sites](https://f5-studio.com/articles/using-neumorphism-in-ui-design-of-a-business-site/)

Date: 2020-12-03. Evidence type: contemporaneous implementation case study. Research record consulted: 2026-10-31.

Use and limitation: An actual business-site example, not a frequency estimate.

### S19. Creative Tim

[Glassmorphism UI—the new design trend used by Apple and Microsoft](https://www.creative-tim.com/blog/web-design/glassmorphism-new-design-trend/)

Date: 2021-03-31; updated 2021-11-03. Evidence type: contemporaneous practitioner tutorial. Research record consulted: 2026-10-31.

Use and limitation: Demonstrates translucent layered panels and acknowledges older antecedents.

### S20. Apple Newsroom

[Apple introduces macOS Big Sur with a beautiful new design](https://www.apple.com/newsroom/2020/06/apple-introduces-macos-big-sur-with-a-beautiful-new-design/)

Date: 2020-06-22. Evidence type: preceding primary launch. Research record consulted: 2026-10-31.

Use and limitation: Prior-year context for materials and spacious rounded interfaces; not a 2021 invention.

### S21. Android Developers Blog

[Material You: Coming to more Android devices near you](https://android-developers.googleblog.com/2022/02/material-you-coming-to-more-android.html)

Date: 2022-02-10. Evidence type: primary diffusion milestone. Research record consulted: 2026-10-31.

Use and limitation: Supports a 2022 expansion lens; Material You was introduced in 2021.

### S22. Android Developers Blog

[Material Design 3 for Compose hits stable](https://android-developers.googleblog.com/2022/10/material-design-3-compose-stable.html)

Date: 2022-10-24. Evidence type: primary implementation milestone. Research record consulted: 2026-10-31.

Use and limitation: Supports coordinated tonal roles and shaped components in an available toolkit.

### S23. Design Shack

[The Bento-Style Rounded Corner Trend: Explored & Explained](https://designshack.net/articles/trends/bento-style-rounded-corners/)

Date: 2023-07-24. Evidence type: contemporaneous design commentary. Research record consulted: 2026-10-31.

Use and limitation: Documents modular rounded compartments and compositional hierarchy.

### S24. Flux Academy

[Bento Grids—New Web Design Trend for 2024?](https://www.youtube.com/watch?v=onQ9KGWysQY)

Date: 2023-11-16. Evidence type: contemporaneous practitioner forecast. Research record consulted: 2026-10-31.

Use and limitation: Records visibility and forward-looking discussion in late 2023.

### S25. Webflow

[7 emerging web design trends for 2024 and beyond](https://webflow.com/blog/web-design-trends-2024)

Date: 2023-12-12 shown update; 2024 forecast. Evidence type: vendor editorial forecast. Research record consulted: 2026-10-31.

Use and limitation: Richer graphic treatments and expressive presentation are forecast, not measured dominance.

### S26. Creative Bloq

[The best (and worst) web design trends of 2024](https://www.creativebloq.com/web-design/the-best-web-design-trends-of-2024)

Date: 2024-08-31. Evidence type: within-year editorial review. Research record consulted: 2026-10-31.

Use and limitation: Corroborates experimental typography and more graphic/expressive treatments.

### S27. Google

[Android and Wear OS are getting a big refresh](https://blog.google/products-and-platforms/platforms/android/material-3-expressive-android-wearos-launch/)

Date: 2025-05-13. Evidence type: primary launch. Research record consulted: 2026-10-31.

Use and limitation: Dated Material 3 Expressive launch; supports shape, color and containment.

### S28. Google Design

[Expressive Design: Google’s UX Research](https://design.google/library/expressive-material-design-google-research)

Date: publication date not reliably exposed. Evidence type: primary design rationale. Research record consulted: 2026-10-31.

Use and limitation: Provides feature-level rationale, not the date anchor or independent evaluation of Google’s claims.

### S29. Webflow

[8 web design trends to watch in 2026](https://webflow.com/blog/web-design-trends-2026)

Date: 2025-12-23 shown update; 2026 forecast. Evidence type: vendor editorial forecast. Research record consulted: 2026-10-31.

Use and limitation: Human craft, art and expressive systems are forecast-led directions, not a measured 2026 census.

### S30. Adobe

[2026 Creative Trends Forecast: Innovation and Authenticity](https://business.adobe.com/resources/creative-trends-report.html)

Date: 2026 report label; publication date not reliably exposed. Evidence type: broader creative-industry forecast. Research record consulted: 2026-10-31.

Use and limitation: Broader corroboration of sensory/craft concerns, not web-specific adoption evidence.

### S31. W3C WAI

[Understanding Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

Date: living technical explanation; consulted 2026-10-31. Evidence type: accessibility guidance. Research record consulted: 2026-10-31.

Use and limitation: Used for present-day readability safeguards rather than dating a visual trend.

### S32. W3C WAI

[Understanding Success Criterion 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

Date: living technical explanation; consulted 2026-10-31. Evidence type: accessibility guidance. Research record consulted: 2026-10-31.

Use and limitation: Used to keep style changes respectful of reduced-motion preferences.

