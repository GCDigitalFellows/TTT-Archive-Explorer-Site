# Inclusive-design review: revised draft and published site

**November 3, 2026 · AI-assisted review · recommendations only · implementation not approved**

The Welcoming pathways draft provides a stronger public entry point. It explains the institutional context, gives search and random discovery clear purposes, and separates interpretation from analysis. The published page preserves more research capability, but makes readers pass through too many controls and a large network before reaching posts. The next iteration should combine the draft’s clearer organization with the published site’s fuller search, reading and evidence access.

Historical review note: no project files, data, models, instructions, changelogs or deployed pages were changed during the November 3 review. This preserved report was added to the project on November 4 alongside Ian’s partial approvals. This report and temporary review copies are outside the project checkout. Proposed findings have not been marked approved in the active simplification backlog.

## What was reviewed

- **Draft:** the existing isolated `Welcoming pathways` fragment, including Analysis & networks. SHA-256: `840deb7c3087947bb438fb8580ced6876944080b5178f28ba1936d244dcf8045`. The repository fragment exactly matches the existing conversation-preview file. A temporary HTML wrapper supplied only document metadata and a zero-margin body; it did not change the prototype’s code. The fragment was not rebuilt against newer production metadata.
- **Published:** [Tagging The Tower Archives Explorer](https://gcdigitalfellows.github.io/TTT-Archive-Explorer-Site/), public commit `fa14d07517627fc43c74fd4cff117adad8f1743d`. Downloaded HTML exactly matches that checkout: SHA-256 `e23a33ed96e2b906833ab3d0ca8e860ce7fb07c4614e1defdfb08dfa61bcd93f`.
- **Research checkout:** commit `994c8eadb3aadada4c4ed61e25e1419c39adf34d`; both remotes fetched and aligned with their local revisions when checked.
- **Method:** inspect the draft first, then inspect the live page; compare equivalent tasks with browser interaction, accessibility-tree/DOM observations, screenshots and relevant source inspection. Views sampled: welcome/overview, browse/search, reading/random discovery, draft synthesis, draft text patterns/networks, people/methods, draft design history and published topic analysis.
- **Widths:** desktop 1280 CSS pixels and selected narrow states at 320 CSS pixels. The browser viewport setting applied per reviewed tab; reported dimensions were confirmed from each tab’s DOM. No claim is made about all sizes, actual zoom behavior or every appearance preset.

## Skills actually applied

[Cognitive load](https://github.com/Owl-Listener/inclusive-design-skills/blob/6e0740f04b2130af60bc57abe3401b91e460e70d/cognitive-accessibility/skills/cognitive-load-assessment/SKILL.md), wayfinding/navigation, plain language, keyboard navigation, heading structure, colour independence, table accessibility, responsive accessibility, user-preference respect, decision documentation, accessibility-debt tracking and tradeoff analysis. The pinned source and original MIT attribution are in the project’s [integration guide](https://github.com/GCDigitalFellows/TTT-Archive-Explorer-Site/blob/fa14d07517627fc43c74fd4cff117adad8f1743d/accessibility/README.md).

Skill checklists were used as review prompts, not as measured user behavior or automatic WCAG verdicts. In particular, the upstream responsive skill conflates a 200% zoom check with the reflow criterion. This review instead distinguishes [320 CSS-pixel reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) from [text resizing to 200%](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html). The latter was not tested. No unsupported testing-coverage percentages or mandatory remediation deadlines were adopted.

## What is already working

| Task | Revised draft | Published page |
| --- | --- | --- |
| Understand the institution | Explains CUNY/Graduate Center context, Fellows’ support work and guest participation near the beginning. | Contains a more detailed and sourced explanation, below the global header/navigation. |
| Find writing | Search is visible on the welcome page; browsing exposes year/name before optional filters. Empty results give recovery guidance and disable random drawing; Clear filters restores all 421 published records. | Searches fuller published reading-copy text and offers extensive research filters, exports and a complete 430-record accounting. |
| Discover randomly | “Surprise me,” an eligible-population label, another draw and a contextual return button make the purpose apparent. | A working random reader supplies a fuller plain-text reading copy, source link, evidence and rights notice. The top-level label “Read a post” does not announce randomness. |
| Inspect attribution | The sampled linked-data article distinguishes A. L. McMichael’s credit from Sam O’Hana’s posting account. | The sampled linked-data search result also correctly credits McMichael; the reader links article-specific license evidence. This sampling is not a new audit of all authors. |
| Read interpretation | States that the six interpretive groups use 19 selected examples, are AI-assisted and do not establish author consensus or prevalence. | Retains detailed interpretation, methodology, contribution history and evidence access. |
| Explore visual evidence | Topic bars expose numeric labels and source-post actions. The network has complete tables and switches to them at narrow width. | Topic tables include captions and numeric values; network nodes expose named actions in the accessibility tree. |
| Explore design history | Optional exhibit clearly distinguishes design year from publication year. Selecting 2022 left all 421 published records available. | Fifteen sourced treatments remain available, with methodology and adaptation controls. |

These provisions should travel into the next revision. A reduction in visible controls should not erase evidence, source authors, guest contributions or research capabilities.

## Findings and proposed revisions

**Priority P1** means address before promoting the draft to the public default or during the next approved navigation revision. **P2** means improve comprehension/maintenance after the core flow is settled. These are proposed priorities, not approved deadlines. No total task-blocking failure was established in the sampled browser workflows; actual assistive-technology use remains untested.

### R1 · P1 · Put post results before the network and compact the repeated header

**Published evidence:** the index opens its network before the results, with all 71 credited names. At 320 × 800, from the page’s initial top position, the search field began at about 1,656 CSS pixels and the result container at about 5,295. The network itself uses an 800-pixel horizontal region inside a roughly 248-pixel container. The page did not overflow horizontally; the graph has its own scrolling region. The issue is access effort and reading order, rather than a demonstrated reflow failure.

**Draft comparison:** an unfiltered browse page at the same width began its results at about 850 pixels. The network is in a separate view. These positions are observations of particular states, not task-time measurements.

**Recommendation:** prioritize search and post cards; move the network to Analysis & networks or an initially closed disclosure. Use a compact masthead after the welcome page. Preserve a clear link to the complete network and all names. This supports keyboard users, readers with limited attention and people on small screens.

**Evidence:** [published network template](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/994c8eadb3aadada4c4ed61e25e1419c39adf34d/analysis/interactive/template.html#L372). Related active proposals: **SIM-03, SIM-05**.

### R2 · P1 · Preserve search coverage and define matching behavior before a production port

**Observed example:** searching `linked data` returned three records in each interface, but not the same records. Both included McMichael’s two linked-data posts. The published index also found **On Being Stuck**; the draft instead included **What about Public Presence?**

**Source explanation:** the draft searches shortened excerpts and requires each normalized query token to occur somewhere in its indexed fields. Its substring matching lets `linked` match `LinkedIn`. The published index searches the literal query string in a broader saved reading-copy index. Neither behavior is semantic understanding. Identical result counts concealed a meaningful difference in retrieval.

**Recommendation:** keep a full saved-text search index even if cards remain short. Decide whether the default is all words, an exact phrase or another clearly described rule. Offer a simple phrase option and show a relevant matching snippet. Keep name/alias matching explicit. Do not port the draft’s excerpt-only coverage as an unnoticed simplification.

**Evidence:** [draft search](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/994c8eadb3aadada4c4ed61e25e1419c39adf34d/analysis/reviews/mockups/welcoming-pathways/core.js#L13), [published search](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/994c8eadb3aadada4c4ed61e25e1419c39adf34d/analysis/interactive/index_core.js#L5). Related **SIM-04, SIM-13**. Changing the search rule requires explicit acceptance checks; it is not a new corpus/model fit.

### R3 · P1 · Manage focus, return position and shareable location

**Draft observation:** submitting welcome search with Enter changed the view but left `document.activeElement` as the page body. Opening a result and the sampled random draw also left focus on the body. The live-status message announced the new kind of view, which helps, but it did not establish a focused destination. Draft navigation leaves the URL unchanged.

**Published comparison:** view changes have a hash route, and a share control explicitly warns that filters and individual posts are not saved. The main site has a `main` landmark, but no skip link was found in the inspected document. A main landmark alone does not provide the same bypass route to every keyboard-only user.

**Recommendation:** after a view-changing action, move focus to an appropriate heading/results summary; on return, restore the activating result and reading position. Add a reliable skip-to-current-content route. Preserve search and reading state through browser Back, reload and explicitly scoped sharing. Avoid publishing personal search text in URLs without making that behavior clear. The standalone draft wrapper is not evidence that the eventual host will lack landmarks; supply those deliberately during a production port.

**Evidence:** [draft navigate/openPost](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/994c8eadb3aadada4c4ed61e25e1419c39adf34d/analysis/reviews/mockups/welcoming-pathways/ui.js#L44), [published sharing scope](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/994c8eadb3aadada4c4ed61e25e1419c39adf34d/analysis/interactive/template.html#L64). Standards references: [focus order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), [bypass blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html). This is a targeted finding, not a whole-site conformance determination.

### R4 · P1 · Make the network’s uncertainty visible in the visual evidence

**Observation:** both versions include account-only publication credits. The unfiltered network describes 249 account-only posts among 325 local posts. In the draft’s complete table, the largest recorded-name total is Sam O’Hana’s 51 credits, 50 of them account-only. This does not establish that he wrote those 50 articles. The draft initially draws 12 names selected by recorded credit count; the published index draws all names. Both include cautionary text.

**Recommendation:** keep complete records accessible, but distinguish evidence types at the point of reading a node/count, using text and an additional non-colour encoding. Consider beginning with a selected year/person rather than an apparent leader ranking. Offer a clearly described evidence comparison. Do not silently replace the archive-wide population with the smaller source-supported subset or describe either view as verified productivity, appointments or collaboration.

**Decision:** choose the default and legend deliberately. Complete inclusion and stronger evidence are different goals, not interchangeable measures. Related **SIM-05**.

### R5 · P1 · Verify the network’s accessible interactions and strengthen its table alternative

**Draft observation:** the SVG is exposed as a single labelled graphic in the accessibility snapshot; its internal links were not individually exposed there. Source creates interactive links inside an SVG with `role="img"`. The complete table is available but initially collapsed on desktop. At 320 pixels the table opens and replaces the graph, preserving all 71 eligible names.

**Published comparison:** named author/year button actions appear in its network accessibility tree. This is a capability worth preserving rather than replacing without comparison.

**Recommendation:** determine whether the graphic is a static overview with an equally prominent interactive table, or an accessible interactive diagram. Test the chosen model with actual screen-reader navigation and keyboard actions. Add descriptive table captions/names and explicit header associations where useful. The draft tables have `th` cells but no caption/accessible name or explicit `scope`; missing `scope` on a simple table is not by itself proof of failure.

**Evidence:** [draft table builder](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/994c8eadb3aadada4c4ed61e25e1419c39adf34d/analysis/reviews/mockups/welcoming-pathways/analysis_ui.js#L41), [SVG semantics](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/994c8eadb3aadada4c4ed61e25e1419c39adf34d/analysis/reviews/mockups/welcoming-pathways/analysis_ui.js#L56), [WAI simple-table guidance](https://www.w3.org/WAI/tutorials/tables/one-header/). Actual screen-reader behavior is an open verification item.

### R6 · P1 · Carry current rights and reading capabilities into the draft

**Observation:** the draft’s sampled reader shows a shortened plain-text excerpt and an original-post link, but no article-specific source-rights link. The published reader provides a fuller plain-text copy and the newer source-license evidence. The prototype snapshot predates the MIT/source-rights integration; its README has a later superseding license note, but that does not add the notice to the interactive reader.

**Recommendation:** include the current scoped MIT/source-rights notices and correction route in any production port. Keep a fuller in-app reading option, with an explicit original-site route for missing images, embeds and formatting. A compact introduction can be the default, but should not force all readers to leave the companion to continue a text. This is a release-integration gap, not a claim that every excerpt has the same license or a legal violation has been established. Related **SIM-06, SIM-08**.

### R7 · P2 · Use the draft’s simpler navigation without losing research routes

**Observation:** the draft has five primary destinations. The published page has 13; ordinary browsing exposes eleven select menus including the network limit, plus search and explanatory text. Its topic route exposes models, weighting and membership choices alongside the basic topic question.

**Recommendation:** retain approximately five public destinations and keep search, year and credited name prominent. Put model settings, appointment-evidence comparisons, exports and detailed diagnostics under clearly named research/methods routes. Preserve existing view links and all audit records. Keep random discovery visible as a stable action rather than relying only on the ambiguous published label “Read a post.” Related **SIM-02, SIM-04, SIM-06, SIM-09**.

### R8 · P2 · Make analysis easier to enter, while retaining precise definitions

**Observation:** the draft separates saved model topic weights, overlapping keyword matches and the 19-example interpretation correctly. Numeric bars do not depend on colour alone. However, the default text-patterns screen exposes two measures and 30 year buttons, several populations and terms such as “equal-post,” “eligible local,” “mixture” and “MALLET” before a reader has practiced interpreting one result.

**Recommendation:** begin with one plain-language question and one measure. Explain one real example, then offer the alternate measure and full definitions. Keep denominators, zero-versus-unavailable distinctions and partial-year cautions visible where they affect interpretation. Present 421 as the reading-archive size; introduce 325, 299 and the 19 selected examples in the views where they apply. Do not round away exact research counts or rename statistical topics as author-endorsed themes. Related **SIM-09, SIM-10**.

### R9 · P2 · Clarify the scope of “collective wisdom” and the featured voice

**Observation:** the draft explicitly rejects consensus/prevalence claims, but its inviting title can still suggest that the interpretation represents all writers. The welcome page spotlights one positive participant quotation. Both versions qualify that account; neither establishes program-wide impact.

**Recommendation:** keep a concise selection/method note immediately adjacent to the synthesis, explain why examples were selected, and include tensions and counterexamples where supported. Consider “What the archive suggests” or a qualifying subtitle rather than treating a warmer title as a finding. Choose the featured passage editorially with a stated rationale. Do not rotate quotes automatically or replace sourced nuance with promotional outcome claims. Related **SIM-03, SIM-08**.

### R10 · P2 · Improve structural clarity and contextual terminology

**Observation:** the draft welcome jumps from an H1 to H3 card/context headings before its later H2. Some narrow tables/analysis labels use 12-pixel text. These are review concerns, not automatic standards failures. Both versions preserve technical evidence labels that may be unfamiliar to a public audience.

**Recommendation:** use a logical heading hierarchy, make evidence text comfortably readable, and introduce a small contextual glossary. For example, explain “Account-only credit” as “The export names the posting account; the writer has not been verified.” “Source-supported” should retain its important qualification that checked evidence is not personal confirmation. Keep original quotations intact. Test real text resizing and line spacing before declaring the typography satisfactory.

### R11 · P2 · Keep design history optional and set accessibility guardrails

**Observation:** the draft’s 2022 and default 2026 treatments kept the sampled narrow layout within the viewport; selecting design year did not filter publication years. The optional positioning is a useful reduction. Not all fifteen treatments, operating-system preferences or colour modes were tested.

**Recommendation:** preserve the exhibit and cited historical interpretations. Decide whether experiments restyle only a preview/reader or the whole application. Maintain a stable navigation/control structure, obvious reset and consistent focus cues. Before release, test combinations of appearance, reduced motion, forced colours, contrast settings, text resizing and narrow layout. A missing custom media query alone does not establish inaccessible behavior; verify the resulting experience. Related **SIM-01**.

## Open decisions for Ian

| Decision | Suggested starting point | Tradeoff to resolve |
| --- | --- | --- |
| Main structure | Continue the five-destination draft, keeping random discovery visible. | Which research tools remain direct routes, and which move under Methods? Existing bookmarks should survive. |
| Search | Search all saved published reading-copy text; show short matching excerpts. Define all-word versus phrase matching explicitly. | Better coverage can require a larger search payload; excerpt-only searching is lighter but misses material. |
| Reading | Short initial preview with a fuller in-app reading option, attribution, rights and original-source link. | Minimal pages versus reading continuity/offline access. Images/embeds still require the original presentation. |
| Publication default | Default public browsing to 421 published records; retain the complete 430-record ledger and a research route to nine drafts’ metadata. | Public clarity versus making the complete accounting immediately visible. This changes an interface default, not the coverage definition. |
| Network entry and evidence | Start with a chosen year/person and make uncertainty visible; retain complete all-credit tables and a labelled source-supported comparison. | Overview versus apparent ranking; evidence strength versus representativeness. Which population should be the first view? |
| Analysis entry | One public question/measure first, with the second measure and diagnostics available on demand. | Guided interpretation versus rapid comparison for experienced users. Which question should lead: changing word groups, recurring concerns, or recorded writers over time? |
| Synthesis title and editorial voice | Keep warmth, but add a prominent “AI-assisted interpretation of 19 selected posts” qualifier; consider a more tentative title. | “Collective wisdom” is inviting, but might imply consensus. Should there be named human editorial review before promotion? |
| Design history | Preserve it as an optional exhibit, with a stable default reading appearance. | Should selecting an era restyle the whole site or only an exhibit/reader preview? |
| Documentation | Short contextual notices with clearly linked full methods, rights, credits and correction evidence. | Which details must always be visible, and which can be disclosed on demand without hiding material uncertainty? |
| Human evaluation | Reserve time for expert keyboard/screen-reader checks and task sessions with public readers, Fellows/alumni and disabled readers. | Who can coordinate and resource this work? No recruitment, participant claims, deadlines or contact is assumed by this review. |

## Proposed sequence, pending approval

1. **Agree on product defaults:** structure, public/draft scope, search rule, reading depth and network evidence. Keep all existing SIM items proposed until a decision is recorded.
2. **Revise the isolated prototype:** address focus/state, search coverage, source-rights propagation and network/table access; improve analysis explanations. Keep the published page intact while the result is reviewed.
3. **Validate the candidate:** search comparison cases, all 421 records, credit/right propagation, keyboard/return paths, 320-pixel reflow, actual text resizing, screen-reader interactions and selected appearance combinations. Include actual users when authorized and feasible. [WAI explains why user evaluation and standards-based evaluation should be combined](https://www.w3.org/WAI/test-evaluate/involving-users/).
4. **Approve and port:** preserve old routes and evidence/advanced tools, review remote edits, update attributed work records and only then publish the approved design. Changing analysis populations, authorship, identity or methods is outside this design proposal.

## Limits and attribution

This is an agent-led heuristic and sampled browser/source review, not a human user study, disabled-person testimony, complete accessibility audit, legal assessment or scientific validation of every article/claim. No screen reader, keyboard-only end-to-end traversal, actual 200% text-resize test, comprehensive contrast test, grayscale simulation, all-preset review, reduced-motion/forced-colour check, network-throttling benchmark or new NLTK/MALLET fit was performed. Browser Enter submission and focus observations are narrower than a complete keyboard audit. Possible impacts on different readers are reasoned hypotheses.

**Human contribution:** Ian G. Williams requested the comparison, supplied the inclusive-design repository in the preceding task, established public-first/Fellows-alumni priorities and required approval before changes. Supported CRediT roles for this direction: **Methodology; Project administration**. No human execution of these checks or approval of the recommendations is recorded.

**AI contribution:** OpenAI Codex, exact model build not recorded, selected/read the named skills, inspected the existing source and live/draft interfaces, performed the described browser/DOM checks, compared evidence, identified limits and drafted this report. Applicable saved GAIDeT tasks: **Quality assessment (0000044); Validation (0000023), limited to the checks actually described; Text generation (0000030); Identification of limitations (0000046); Recommendations (0000047)**. No additional agents were launched. Upstream skill attribution to MC Dean remains separate from project-human credit; original post writers retain source-text credit and are not reviewers or endorsers of these recommendations.

This review record is held outside the repository to honor the no-change request. If the recommendations or review record are incorporated into the project, add the corresponding CRediT/GAIDeT work-log entry and generated README changelog in that same approved change; do not backdate human approval.


## Subsequent decision record · November 4, 2026

Ian approved both full-text search modes, excerpt/full reading and published-only public browsing with draft metadata in the accounting route. See `approved_reading_revision_2026-11-04.json` and the current work log. The original recommendations above remain a dated review, not blanket approval of every proposal.
