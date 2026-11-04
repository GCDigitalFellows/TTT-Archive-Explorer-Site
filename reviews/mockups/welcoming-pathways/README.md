# Welcoming pathways — interactive discussion prototype

This is an isolated prototype of the direction Ian selected for further exploration. **It does not replace or modify the live website.** November 3, 2026.

## What works

- A public-first welcome explaining the Graduate Center/CUNY context and Digital Fellows without assuming institutional knowledge.
- Navigation among Start here, Browse posts, What the archive suggests and People & methods, with an optional design-history exhibit.
- All **421 published records**, including **96 curated/source-linked** records; search across titles, credited names/known aliases, tags and complete saved plain-text reading copies. **All words** matches whole words in any order; **Exact phrase** matches adjacent words within one indexed field or paragraph. Both normalize case, accents and punctuation. Original formatting, images and embeds are not searched.
- Academic-year and exact credited-name filters, optional type/evidence filters, visible result scope, reset, pagination and empty-state handling.
- Uniform random discovery from the complete published archive or the current search result set; the previous random draw is excluded when another record is eligible.
- A reading excerpt with expandable full saved text, original-source and source-rights links, original credit strings, posting account, evidence tier and available credit quotation. Excerpts are shortened to a display budget; original source content remains authoritative.
- The **299 existing saved primary-model profiles**, where available, with labelled mixture weights and top cleaned-word counts. Unmodeled posts receive an exclusion explanation; no new fit/inference occurs.
- Six existing interpretive groups with their **19 selected source examples** and literal saved passages. Condensed interpretive copy is AI-drafted; these are not a consensus, exhaustive coding or prevalence estimates.
- All **15 sourced annual design presets**, with a constrained appearance adaptation, caveats, source references and a reset. Design year is independent of publication year and never changes the evidence.

The canonical project still accounts for 430 category records, including 9 drafts. This public-reading prototype excludes draft metadata and bodies rather than presenting drafts as published material. Guest authorship and fellowship membership at publication remain distinct. No institutional-outcome or funder-impact claim is inferred from post counts or participant testimony.

## Small map for a human reviewer

`build_prototype.py` reads the named JSON evidence blocks in the unchanged production page, joins records by post ID, selects literal excerpts and saved analysis values, checks coverage and writes prototype-only files. It uses Python's standard library. It never reparses or changes the original export, corpus or fitted model.

`template.html` contains the isolated layout and product-scoped styles. `core.js` contains pure search/filter, random-selection and credit-label calculations. `ui.js` connects those functions to local navigation and displays source strings as text, not executable markup. Comments explain evidence boundaries, source projections and state handling. The optional conversation helper changes presentation only; search/name inputs are not sent to the conversation by the prototype.

`prototype_data.json` is an inspectable saved-data projection. `prototype_fragment.html` is generated for the conversation preview, not a production entry point. `build_audit.json` records input/output hashes and scope. `validation.json` records actual checks and limits. The screenshot files document tested states.

## Rebuild and check

From the source repository root:

```sh
python3 analysis/reviews/mockups/welcoming-pathways/build_prototype.py
node --test analysis/reviews/mockups/welcoming-pathways/test_core.js
```

The builder writes only within this prototype directory by default. An optional `--preview-output /absolute/path.html` copies the same fragment to an explicitly chosen local preview destination. The fragment needs the conversation renderer or its local wrapper; it is not a deployment-ready replacement for index.html. A future production port requires separate approval and integration review.

The eight Node checks compare coverage, saved model profiles, credited-name/alias retrieval, combined filters, published-credit dispositions, random selection, original essay passages and annual design references. Text search may match a name mentioned in an excerpt even when that person is not credited on the post; exact credited-name filtering is separate.

## Attribution

**Human — Ian G. Williams:** requested the Welcoming pathways interactive mock, supplied public-first priorities and the earlier quality, interpretability and design-history requirements. Selecting a discussion prototype does not approve production replacement or every statement. CRediT: Conceptualization, Methodology, Project administration.

**AI — OpenAI Codex:** generated the isolated builder/interface, condensed the existing interpretation for display, joined saved evidence, implemented interactions and performed source, automated and browser checks. GAIDeT: Code generation (0000017), Process automation (0000019), Visualization (0000027), Text generation (0000030), Validation (0000023). Exact underlying model/build is not recorded. No additional agents or human usability participants were used.

Original authors retain source-text credit; they are not automatically contributors to this prototype or endorsers of its interpretation. The project’s existing source rights and unassigned new-code/analysis license status remain in force.

## Analysis & networks extension · November 3, 2026

Ian requested one additional tab for text-analysis visualizations and authorship networks. The isolated prototype now includes **Analysis & networks**, with two focused displays:

- **Text patterns:** equal-post mean weights for a selected saved MALLET topic across academic years (299 modeled posts before filters); and title/tag dictionary-signal shares with explicit numerators/denominators (325 published local/unflagged posts before filters). Missing denominators are unavailable, not zero. Keyword signals, statistical topics and the 19-post interpretive synthesis remain distinct.
- **Authorship networks:** author–academic-year credit edges and a shared-byline network around one credited name. Each edge retains its source post IDs. Shared bylines are not inferred collaboration. Curated/source-linked records and drafts are excluded. A named-person filter retains whole coauthored posts and therefore their coauthors.

Analysis filters (year, credited name, evidence tier) are separate from archive search. The source-supported subset has 50 local posts and 35 modeled posts. The complete local-credit network contains 71 names. Graphs initially limit display to 12 names/partners by recorded credits; the All option expands the graph, while complete tables always retain every eligible name and all 72 unfiltered shared-byline pairs. Narrow layouts use these tables instead of squeezing the graph. Any displayed name, year, edge, pair or chart year can lead to the recorded source posts and their byline evidence.

`analysis_core.js` contains pure population, topic/year, keyword/year and credit-network calculations. `analysis_ui.js` renders the one new tab using those calculations; it does not modify the source records. `analysis_references.json` contains independent expected results: original Python/MALLET annual CSV values, saved dictionary-count CSVs, and a Python calculation of deduplicated current author/year and shared-byline counts.

Run the original and new checks together:

```sh
node --test analysis/reviews/mockups/welcoming-pathways/test_core.js analysis/reviews/mockups/welcoming-pathways/test_analysis.js
```

All 16 prototype checks pass. Eight new checks protect populations, every unfiltered topic/year mean and keyword/year count, independent network counts, duplicate-name handling, no-data versus zero cases, and immutability under filtering. Browser checks covered chart-to-post-to-analysis navigation, the source-supported subset, all 71 names in the complete table/graph, shared-byline edges, sparse/empty subsets and 360px reflow. No new model fitting or production-page build occurred. Visual and browser checks are agent-run, not human usability research or formal accessibility certification.

**Attribution:** Ian supplied the request and the continuing public-first/evidence requirements (CRediT: Conceptualization, Project administration). Codex generated the tab and calculation/display code, re-aggregated saved data, prepared independent references, checked results and documented limitations (GAIDeT: Code generation 0000017; Process automation 0000019; Data analysis 0000026; Visualization 0000027; Validation 0000023; Text generation 0000030). Exact model/build is unrecorded. Original authors retain source-text credit and are not presumed to endorse this analysis.


## License update · November 3, 2026

Ian selected MIT for original project code, documentation and analysis, to the extent project rights permit. This supersedes earlier pending-license statements. Source posts and media retain separate terms; consult the project LICENSE, NOTICE.md and source-rights ledger. Never apply MIT to source works or infer a CC version from an unversioned field.


## Approved reading/search revision · November 4, 2026

Ian approved both search modes, excerpts with in-depth reading, and 421 published records as the public default with nine drafts’ metadata retained in research/accounting. The shared `analysis/interactive/search_core.js` implements whole-word and exact-phrase rules for both interfaces; snippets come from saved reading text, not model inference. `fullParagraphs` preserves each entire saved plain-text copy exactly. Cards/excerpts are display projections only.

Open `index.html` in this directory for the current standalone preview. Full text makes this preview larger than the conversation renderer’s former 1 MB limit; earlier inline previews are historical and are not the current complete-text version. `build_prototype.py` now also writes a complete standalone document. Do not pass the larger fragment to the inline renderer or silently truncate the corpus to meet its size budget.

Search submission and post opening focus a visible heading/summary; returning from a result restores its activating button. A skip route bypasses repeated navigation. Source-license evidence links to the current rights ledger, with missing or unversioned terms explicit. Public draft metadata remains separate from reader bodies.

Network defaults, synthesis framing, design-history scope and human evaluation remain open decisions. The current production interface receives bounded reading/search improvements; this prototype does not replace the live layout.


## Network, framing and appearance decisions · November 4, 2026

Ian approved independent network scope/evidence toggles, the tentative synthesis label **What the archive suggests**, and design-year styling across all internal explorer views. Network choices expose all years/names or a chosen year/person, combined with all recorded or source-supported credits; existing uncertainty, coauthored-post inclusion and saved model weights remain explicit. Main-site network choices retain other active post filters. The selected era restyles navigation, analysis and reading without changing the content or academic-year scope; motion/system-colour safeguards and reset remain available. Separately opened reference documents and original external posts are not part of that appearance setting.

Human evaluation arrangements remain TBD, with limited reviewer availability reported by Ian. No new screen-reader session or participant study is claimed. These choices supersede the four open design questions in the earlier partial approval; human evaluation logistics and production replacement of the five-route preview still require separate decisions.

## Word clouds and annual sunburst · November 4, 2026

The Analysis & networks tab now has **Word clouds & sunburst**. Its independent selector switches the entire 299-post saved analyzed corpus or one of 15 academic years. Word clouds show up to 60 most frequent cleaned forms; the sunburst shows year → five leading forms, weighted by the occurrence counts of those five words only. Exact tables include counts, per-1,000-token rates and source-post buttons. These controls do not apply the other displays’ author/evidence filters.

The builder sums all 137,094 saved cleaned tokens before MALLET vocabulary pruning. It does not use the six-word post previews, change the corpus, refit models or newly run NLTK. The 421-post public reading archive remains complete. [Methods, scope, visual encodings, attribution and limitations](word_methods.md). New display code is annotated in `word_ui.js`; run `python3 -m unittest discover -s analysis/reviews/mockups/welcoming-pathways -p 'test_words.py'` to independently check every count group and word-source list. Human review and assistive-technology evaluation remain limited/TBD.


## Alternative hierarchy lenses · November 4, 2026 · version 2.0

Ian authorized the proposed sunburst reframings. The draft now defaults to **Shared vocabulary**, with **Subject mixtures**, **Distinctive vocabulary · research**, **Adjacent-word phrases** and **Raw-frequency comparison** lenses. Year-first/topic-first topic nesting, year/topic expansion, complete distribution versus enlarged leading-five focus, an adjacent source panel and numeric heatmaps support different questions. The word clouds remain available and unchanged.

`build_word_hierarchies.py` adds versioned descriptive calculations on the same saved 299 IDs: per-post word incidence, literal readable-text adjacent pairs, smoothed positive year-versus-rest word scores, and sums of existing topic weights. It does not change raw exports, source authors, inclusion rules, stoplists, cleaned files or fitted models. New settings and a stricter-threshold comparison are explicit in [methods](word_methods.md). The distinctive rankings are sensitive to thresholds; they are research prompts, not stable thematic conclusions. The complete heatmap uses one common term set across all years, exact numbers and source buttons; its scroll area remains within narrow pages.

Ten word/hierarchy tests now verify totals, remainders, source membership, formulas, phrase boundaries and annual topic means against the independent saved CSV, alongside the existing 18 prototype checks. See `hierarchy_validation.json` for actual browser/process checks and untested limits. This later entry supersedes the initial top-five-count-only sunburst description above, without claiming that earlier checks covered later work.


## Year-exclusive vocabulary companion · November 4, 2026

The sunburst now has an attached annual comparison of forms observed in exactly one academic year within the saved 299-post corpus. It counts all **5,731** qualifying cleaned forms, distinguishing **5,490 single-post** from **241 multi-post** forms, with shared-across-years forms completing each annual vocabulary bar. All fifteen year rows have exact counts, and selecting one synchronizes the sunburst and word list. Search, evidence filters, 50-row pagination and source-post buttons expose the complete saved list. This is a separate type-count comparison, not an incompatible extra ring under topic weights or top-five incidences. [Definition, limits and attribution](word_methods.md#year-exclusive-companion). Three new independent checks in `test_year_exclusive.py` supplement the ten existing word/hierarchy checks; `exclusive_validation.json` records actual checks and remaining uncertainty.
