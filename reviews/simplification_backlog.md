# Active simplification backlog

**Status: planning only. No site revision is approved or implemented.** Updated November 3, 2026.

The strongest candidates are optional styling, the number of primary routes, duplicate explanations and competing controls. The research evidence and accountability functions remain essential. **Updated audience direction:** general public first, Fellows/alumni second. Search and random discovery are core tasks, the machine-assisted synthesis remains visible, and design history is preserved in some form. [Compare three mockup directions](mockups/README.md). Most recommendations reduce prominence or duplication rather than remove the original capability or evidence. Several candidates were expressly requested earlier, so their value depends on the project’s current priorities.

This is a source-based heuristic review by Codex, not a human usability study. The inspected source/deployment revisions and static inventory are recorded in [the machine-readable backlog](simplification_backlog.json). Priority now reflects Ian’s November 3 public-first clarification; the earlier review used the previous research/examination-first preference. This is not usage analytics. Effort and risk are estimates.

## Priorities at a glance

| ID | Priority | Component | Proposed direction |
|---|---|---|---|
| SIM-01 | P1 | Appearance lab and annual style controls | Move to an optional design-history page; use a stable reading appearance in the main explorer. Retain readable type, contrast and comfortable spacing controls. |
| SIM-02 | P1 | Thirteen primary navigation destinations | Consolidate into approximately five destinations: Overview; Posts; Patterns; Methods & evidence; Credits & project history. Put topic/word/theme tools inside Patterns and technical checks inside Methods. |
| SIM-03 | P1 | Long overview and repeated entry points | Shorten the landing page to purpose, source/snapshot, brief status disclosure and three actions: browse posts, read the interpretation, inspect methods. Relocate the detailed process, repeated route lists and most scope definitions. |
| SIM-04 | P1 | Dense and repeated filter controls | Show search, academic year and author first in the index. Place technical topic thresholds, record-status/type distinctions and membership evidence in a clearly labelled advanced area. Use consistent control wording and an always-visible active-filter/scope summary. |
| SIM-05 | P1 | Network open before post results, showing all authors | Keep the author/year graph as an optional visualization, closed initially; put matching post results first. Offer the existing table as a direct alternative and render large graphs only when requested. |
| SIM-06 | P1 | Standalone random-post route and separate reader tools | Consolidate post reading with the searchable index and retain Draw a random post as an optional action there. Use one post-detail component with original link, credit evidence and expandable saved analysis. |
| SIM-07 | P1 | Duplicate publication and keyword charts in the legacy audit route | Retire the legacy audit view from primary navigation and link its preserved tables/charts from Methods. Use Themes as the primary place for interactive keyword comparisons. |
| SIM-08 | P1 | Repeated methods, report guidance, histories and long disclosures | Keep one concise methods hub, one contributor/AI disclosure, and linked report/reuse/history appendices. Replace repeated paragraphs with short context-specific caveats plus links to authoritative detail. |
| SIM-09 | P1 | Advanced statistics in ordinary exploration and every post profile | Keep one primary model in ordinary views; place model-run choice, token weighting, seed stability, quality metrics and writer-exclusion sensitivity in a coherent advanced-research section. |
| SIM-10 | P2 | Several thematic charts competing on one page | Lead with the theme/year view and supporting post list. Make co-occurrence and writer bars optional secondary analyses rather than presenting every chart at equal prominence. |
| SIM-11 | P2 | Phrase statistics and fixed early/recent comparison in the word route | Keep basic word counts visible and place phrase association measures and fixed-period contrasts behind an advanced disclosure or in Methods. |
| SIM-12 | P2 | Multiple export/control actions with limited primary-task value | Prioritize matching-post CSVs, displayed chart-table exports and stable source/view links. Consider retiring appearance-settings JSON and redundant chart copies from the main interface while preserving archived files. |
| SIM-13 | P3 | One large offline page embedding several datasets and all feature code | Investigate a lighter web entry point and clearer module ownership only after the visible hierarchy is simplified. Keep an explicit self-contained offline research package as an alternative. |

## Evidence and tradeoffs

The page currently has **13 navigation destinations**, **15 annual style presets**, **16 buttons in the overview markup**, and **11 select controls plus search across the index/network**. These are static source counts, not claims that all controls are visible at once or that users are confused. The generated page is **5,421,440 bytes**; its embedded reader text alone is 2,262,221 bytes. Size does not establish poor performance. The graph is initially open and defaults to all names in the current selection.

### SIM-01 · P1 · Appearance lab and annual style controls

**Proposal:** Move to an optional design-history page; use a stable reading appearance in the main explorer. Retain readable type, contrast and comfortable spacing controls.

**Rationale:** Fifteen annual presets, a year slider/select/step buttons, typography, surface, layout, spacing, color and strength controls plus settings download form a second product alongside archive research. They also create a distinction between design year and post year that readers must keep straight.

**Preserve:** The design-history experiment was explicitly requested earlier. Retain its sources, saved presets and project-history account; do not erase this work.

**Decision before implementation:** Confirm whether design history remains a primary research object or becomes an optional exhibit.

**Success check:** A visitor can read, search and inspect evidence without encountering year-style controls; the optional exhibit and sources remain reachable.

**Estimated effort / risk:** Medium / Medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `design-studio-title`) · [design/style_ui.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/design/style_ui.js) · [design/style_catalog.json](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/design/style_catalog.json).

### SIM-02 · P1 · Thirteen primary navigation destinations

**Proposal:** Consolidate into approximately five destinations: Overview; Posts; Patterns; Methods & evidence; Credits & project history. Put topic/word/theme tools inside Patterns and technical checks inside Methods.

**Rationale:** The current navigation gives reading, statistical diagnostics, report guidance and development history comparable prominence. A smaller set makes the task hierarchy clearer.

**Preserve:** Preserve existing view/section links through aliases or redirects and keep credit/correction access obvious.

**Decision before implementation:** Approve grouping and labels before any navigation change.

**Success check:** Existing bookmarks still open their intended content; a reviewer can find posts, methods and credits without guessing among diagnostic tabs.

**Estimated effort / risk:** Medium / Medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `view-nav`) · [interactive/navigation_core.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/navigation_core.js) (locator: `TOWER_VIEWS`).

### SIM-03 · P1 · Long overview and repeated entry points

**Proposal:** Shorten the landing page to purpose, source/snapshot, brief status disclosure and three actions: browse posts, read the interpretation, inspect methods. Relocate the detailed process, repeated route lists and most scope definitions.

**Rationale:** The overview source has 16 buttons plus multiple explanatory sections, in addition to the global navigation. Several routes repeat the same destination. The grouped-author count is harder to interpret than an archive size.

**Preserve:** Keep a short AI/project-status notice, original-site link and correction route. Retain detailed population counts where they are used.

**Decision before implementation:** Choose whether the primary action is Browse posts or Read the interpretation; research-first suggests Browse posts.

**Success check:** The first screen gives a clear purpose and primary action; 421 published records and the snapshot remain clear without presenting grouped author entries as a verified headcount.

**Estimated effort / risk:** Low–medium / Low–medium. **Status:** proposed, not approved or implemented.

Evidence: [overview/page_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/overview/page_fragment.html).

### SIM-04 · P1 · Dense and repeated filter controls

**Proposal:** Show search, academic year and author first in the index. Place technical topic thresholds, record-status/type distinctions and membership evidence in a clearly labelled advanced area. Use consistent control wording and an always-visible active-filter/scope summary.

**Rationale:** The index/network markup contains 11 selects plus text search; topics and themes expose different versions of authorship and membership controls. In topics/words, selecting a membership basis has no effect until a separate checkbox is checked. Themes has two overlapping credit checkboxes.

**Preserve:** Retain all 430 records, draft metadata and all five membership bases. Preserve all/source-supported distinctions and guests. Do not force one global filter across incompatible analytical populations.

**Decision before implementation:** Approve a basic/advanced layout and, later, any proposed change to default record scope.

**Success check:** Every applied filter is visible; controls change their advertised population; source-supported authorship remains distinct from fellowship membership and collective-post inclusion.

**Estimated effort / risk:** Medium / Medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `view-index`) · [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `membership-basis`) · [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `word-membership-basis`) · [themes/page_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/themes/page_fragment.html) (locator: `theme-explicit`) · [themes/page_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/themes/page_fragment.html) (locator: `theme-supported`).

### SIM-05 · P1 · Network open before post results, showing all authors

**Proposal:** Keep the author/year graph as an optional visualization, closed initially; put matching post results first. Offer the existing table as a direct alternative and render large graphs only when requested.

**Rationale:** The index network disclosure is currently open and its default is All in this selection. This can place a large graph ahead of the archive results. Its table alternative is nested inside the graph section.

**Preserve:** The network was explicitly requested and should remain available. Its edges count publication credits, not appointments, expertise or productivity.

**Decision before implementation:** Approve secondary placement rather than deletion.

**Success check:** Search results are reachable before the graph; table and graph expose the same eligible credits, coauthor counting and unresolved-credit warnings.

**Estimated effort / risk:** Low–medium / Low–medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `index-network`) · [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `network-limit`) · [interactive/post_index.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/post_index.js) (locator: `render`).

### SIM-06 · P1 · Standalone random-post route and separate reader tools

**Proposal:** Consolidate post reading with the searchable index and retain Draw a random post as an optional action there. Use one post-detail component with original link, credit evidence and expandable saved analysis.

**Rationale:** Search currently links titles to original posts, while the internal reading copy and saved-analysis action live in the random reader. These are related tasks split between routes. Consolidation may require a deliberate post-by-ID reader entry point.

**Preserve:** Random discovery and per-post analysis were explicitly requested. Preserve them as actions, including honest exclusions for unmodeled posts and plain-text/multimedia limits.

**Decision before implementation:** Approve one shared reader and retain random discovery as a secondary action.

**Success check:** Any selected published post can be read with the same evidence tools; drafts remain metadata-only; random sampling stays documented and does not invent model results.

**Estimated effort / risk:** Medium / Medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/post_index.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/post_index.js) (locator: `card`) · [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `view-random`) · [interactive/random_reader.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/random_reader.js) (locator: `renderAnalysis`).

### SIM-07 · P1 · Duplicate publication and keyword charts in the legacy audit route

**Proposal:** Retire the legacy audit view from primary navigation and link its preserved tables/charts from Methods. Use Themes as the primary place for interactive keyword comparisons.

**Rationale:** Publishing & motifs includes publication mix, the older 307-post body analysis and original 325-post title/tag signals, alongside newer thematic views. Similar-looking charts have different populations and can look like interchangeable evidence.

**Preserve:** Do not combine the 307- and 325-post measures or delete historical artifacts. Preserve their definitions, filenames and source tables.

**Decision before implementation:** Approve archival placement of legacy displays; any recalculation would be a separate decision.

**Success check:** One obvious route serves each current comparison, and historical charts remain reproducible with their original denominators.

**Estimated effort / risk:** Medium / Medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `view-audit`) · [themes/page_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/themes/page_fragment.html) · [overview/reports_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/overview/reports_fragment.html).

### SIM-08 · P1 · Repeated methods, report guidance, histories and long disclosures

**Proposal:** Keep one concise methods hub, one contributor/AI disclosure, and linked report/reuse/history appendices. Replace repeated paragraphs with short context-specific caveats plus links to authoritative detail.

**Rationale:** Overview, Methods, For reports, Credits, Project history, work log and standalone guides repeat portions of scope, AI provenance and process. Repetition creates reading burden and several places for old counts or wording to persist.

**Preserve:** Do not remove CRediT/GAIDeT records, the source-author register, attribution decisions, correction contact, rights status or source evidence. Important warnings must remain at the point where a result could be misread.

**Decision before implementation:** Approve canonical document ownership and which material becomes an appendix.

**Success check:** Each maintained claim has a canonical source; critical credit/denominator warnings are visible locally and full evidence remains at most one clearly labelled link away.

**Estimated effort / risk:** Medium / Medium. **Status:** proposed, not approved or implemented.

Evidence: [overview/page_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/overview/page_fragment.html) · [overview/methods_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/overview/methods_fragment.html) · [overview/reports_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/overview/reports_fragment.html) · [credits/page_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/credits/page_fragment.html) · [history/page_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/history/page_fragment.html) · [process/log_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/process/log_fragment.html).

### SIM-09 · P1 · Advanced statistics in ordinary exploration and every post profile

**Proposal:** Keep one primary model in ordinary views; place model-run choice, token weighting, seed stability, quality metrics and writer-exclusion sensitivity in a coherent advanced-research section.

**Rationale:** Five saved runs, weighting choices and diagnostics have legitimate examination value, but most readers need first to understand a primary chart. Post-level model selectors repeat the run-selection task.

**Preserve:** Research/examination is the priority, so diagnostics remain accessible. Do not discard alternative runs, declare the default optimal or hide sensitivity limitations.

**Decision before implementation:** Approve advanced placement, not removal of statistical evidence.

**Success check:** A novice can inspect a primary topic and its posts; an examiner can still compare all saved models and reproduce scope-specific results.

**Estimated effort / risk:** Medium / Medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `view-topics`) · [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `view-checks`) · [interactive/random_reader.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/random_reader.js) (locator: `post-analysis-model`).

### SIM-10 · P2 · Several thematic charts competing on one page

**Proposal:** Lead with the theme/year view and supporting post list. Make co-occurrence and writer bars optional secondary analyses rather than presenting every chart at equal prominence.

**Rationale:** The thematic route contains a heatmap, pair matrix, writer bars, evidence cards and multiple exports. This supports several different questions and requires readers to understand both global filters and selections affecting only evidence lists.

**Preserve:** Preserve the distinction among keyword layers, the selected essay examples and MALLET topics. Retain overlap counts, denominators and original author/source evidence.

**Decision before implementation:** Choose the default thematic question and chart hierarchy.

**Success check:** The active question and the scope of a cell/pair selection are explicit; secondary analyses reproduce their current counts when opened.

**Estimated effort / risk:** Low–medium / Medium. **Status:** proposed, not approved or implemented.

Evidence: [themes/page_fragment.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/themes/page_fragment.html) · [themes/theme_ui.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/themes/theme_ui.js) (locator: `chooseEvidence`).

### SIM-11 · P2 · Phrase statistics and fixed early/recent comparison in the word route

**Proposal:** Keep basic word counts visible and place phrase association measures and fixed-period contrasts behind an advanced disclosure or in Methods.

**Rationale:** Word filters apply to one chart, while phrase scores always describe the 299-post corpus and contrasts use fixed periods. Multiple association measures are useful to specialists but increase explanation and filter-scope burden.

**Preserve:** Retain saved PMI/log-likelihood tables, thresholds and fixed-period definitions. Do not pretend these tools obey filters they do not use.

**Decision before implementation:** Approve secondary placement; assess whether the fixed-period contrast still answers a current research question.

**Success check:** It is clear which views respond to filters; specialist measures remain reproducible and no comparison silently changes population.

**Estimated effort / risk:** Low / Low–medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `view-language`).

### SIM-12 · P2 · Multiple export/control actions with limited primary-task value

**Proposal:** Prioritize matching-post CSVs, displayed chart-table exports and stable source/view links. Consider retiring appearance-settings JSON and redundant chart copies from the main interface while preserving archived files.

**Rationale:** Data/evidence exports support examination. Downloading appearance configuration and carrying design settings in shared links add maintenance to a secondary design experiment. Shared links currently omit research filters and selected posts.

**Preserve:** Preserve scientific downloads, stable original links and explicit share limitations. Do not label a view-only URL as a saved research selection or add personal filter serialization without review.

**Decision before implementation:** Approve which exports are primary; design-setting export can remain with the optional design exhibit if retained.

**Success check:** A reader can export the evidence they see and understand exactly what a shared link preserves.

**Estimated effort / risk:** Low–medium / Low–medium. **Status:** proposed, not approved or implemented.

Evidence: [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `design-download`) · [design/style_ui.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/design/style_ui.js) (locator: `link.download`) · [interactive/template.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/template.html) (locator: `view-link-address`) · [interactive/navigation_core.js](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/navigation_core.js) (locator: `hashForView`).

### SIM-13 · P3 · One large offline page embedding several datasets and all feature code

**Proposal:** Investigate a lighter web entry point and clearer module ownership only after the visible hierarchy is simplified. Keep an explicit self-contained offline research package as an alternative.

**Rationale:** The current HTML is 5,421,440 bytes and embeds explorer, index, reader, theme and style data. This is a maintenance/duplication candidate, not evidence of slow load times; no new runtime benchmark was performed.

**Preserve:** Offline/shareable behavior and source/model preservation are intentional. Splitting files can break direct-file use, stable links or no-network operation and is not an automatic improvement.

**Decision before implementation:** Decide whether a separate lightweight web edition is worth maintaining; benchmark representative tasks first.

**Success check:** Any future architecture change is supported by measured benefit and preserves an independently verified offline package, dataset fingerprints and current attribution joins.

**Estimated effort / risk:** High / High. **Status:** proposed, not approved or implemented.

Evidence: [index.html](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/index.html) · [build_interactive.py](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/build_interactive.py) (locator: `write_explorer`) · [interactive/build_audit.json](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/d7620afe66b57b821e4aceef479bd35db48a3aca/analysis/interactive/build_audit.json).

## Suggested sequence

1. **Choose the scope:** compare the three public-first mockup directions (or a deliberate blend), keep search/random/synthesis prominent, and choose a preserved optional design-history form.
2. **Reduce surface complexity:** basic/advanced filters, results before the optional network, concise local caveats and canonical methods/credit documentation. Preserve current calculations and evidence distinctions.
3. **Consolidate related tools:** one reader, a coherent Patterns area, advanced diagnostics, archived legacy charts and prioritized data exports. These require focused plans before implementation.
4. **Consider architecture last:** benchmark the current page and confirm offline requirements before proposing a split web/offline edition.

No implementation starts until Ian authorizes it. A rejected or deferred recommendation remains in the list with its decision rationale.

## Keep, even in a simpler interface

- Source post links and article-level byline/account/curator distinctions, original credit strings, supported aliases and correction evidence.
- Guest/GCDRI participation distinguished from fellowship membership at publication; separate role families, undated snapshots and dated evidence.
- All-record accounting and inspectable drafts metadata; the differences among 430 records, 421 published posts, 325 local posts, 299 modeled posts, the legacy 307-post analysis and 19 essay examples.
- Local denominator, missingness and uncertainty statements; keyword signals, interpretive essay themes and MALLET topics must remain distinct.
- Readable code, source snapshots, frozen model/corpus evidence, alternative runs, essential data exports, offline access, keyboard/table alternatives and stable links.
- Human source-author acknowledgment, CRediT/GAIDeT disclosure, an accessible correction contact, rights status and the full change history. Shortening their presentation must not erase their evidence.

## Keep the list active

Canonical records: this file and `simplification_backlog.json`, with stable SIM IDs. Revisit them at the next authorized revision, before adding a new top-level feature, and during release review. This is a maintained project backlog, not a scheduled reminder or automatically approved execution queue. Statuses are proposed → approved → in progress → implemented → verified, with deferred/rejected alternatives. Record Ian’s decision, concrete scope, checks, tradeoffs and source revision when status changes.

## Attribution and limits

**Human — Ian G. Williams:** requested this review, set the research-first priority and instructed that changes not be implemented now. This does not establish human agreement with the recommendations. CRediT roles for that direction: Conceptualization; Project administration.

**AI — OpenAI Codex:** inspected source components and recorded static counts; assessed feature fit and uncertainty; drafted the backlog and revision sequence. GAIDeT tasks: Quality assessment (0000044), Identification of limitations (0000046), Recommendations (0000047), Text generation (0000030). Exact underlying model/build is not recorded. No additional reviewer agents were launched.

No new human usability testing, browser validation, performance benchmarking, model fitting or semantic coding occurred. No claim is made about actual feature use or measured time savings. The JSON includes fingerprints of protected site code, pages, data and evidence so this planning change can be checked for unintended implementation.

## Interactive Welcoming pathways follow-up

Ian requested an interactive mock of Welcoming pathways. The [isolated prototype and checks](mockups/welcoming-pathways/README.md) cover real published-record navigation, random discovery, excerpts, saved analysis, source passages and optional design history. This authorizes prototype exploration only; the live site and all production SIM decisions remain unchanged.

The interactive prototype now also has an **Analysis & networks** tab, requested by Ian: saved topic/year and title/tag-signal charts plus author/year and shared-byline credit networks, linked source records and full-name tables. This is a prototype extension; production SIM decisions remain pending.
