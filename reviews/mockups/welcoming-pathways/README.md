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
