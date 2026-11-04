# Welcoming pathways — interactive discussion prototype

This is an isolated prototype of the direction Ian selected for further exploration. **It does not replace or modify the live website.** November 3, 2026.

## What works

- A public-first welcome explaining the Graduate Center/CUNY context and Digital Fellows without assuming institutional knowledge.
- Navigation among Start here, Browse posts, Collective wisdom and People & methods, with an optional design-history exhibit.
- All **421 published records**, including **96 curated/source-linked** records; search across titles, credited names/known aliases, tags and displayed excerpts. Search does **not** cover complete original text.
- Academic-year and exact credited-name filters, optional type/evidence filters, visible result scope, reset, pagination and empty-state handling.
- Uniform random discovery from the complete published archive or the current search result set; the previous random draw is excluded when another record is eligible.
- A reading excerpt, original-source link, original credit strings, posting account, evidence tier and available credit quotation. Excerpts are shortened to a display budget; original source content remains authoritative.
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
