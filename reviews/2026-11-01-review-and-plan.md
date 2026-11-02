# Two simulated audience reviews and proposed revision plan

Date: November 1, 2026

## Status and method

Two separate AI sub-agents reviewed the current generated website and its readable source files without editing them. One adopted the perspective of someone familiar with Tagging the Tower and GCDI but with partial knowledge; the other adopted the perspective of a first-time public visitor. Neither is an actual human participant or institutional representative. Their reactions are hypotheses grounded in source inspection, not observed audience behavior. They did not conduct live-browser usability tests. The primary agent checked the selection-year gap against saved source and inventory records and synthesized this plan. No website revisions were implemented as part of the review.

The review concerns the current overview, interpretation, charts, reader, source index, network, history and contribution disclosures. The two perspectives are not statistically independent evidence of audience needs: both are AI-generated critiques using the same site artifacts.

## Shared strengths

- The overview provides a coherent research question and routes into the project.
- Named source authors, preserved original credits and linked excerpts make claims inspectable.
- The project distinguishes posting accounts, source writers, project contributions and delegated AI work.
- The saved analysis separates populations and avoids implying that the browser refits models.

## Simulated insider perspective

1. **Clarify institutional relationship.** The masthead couples Tagging the Tower and GCDI without establishing this companion's relationship to the original publication, sponsorship or institutional approval. Identify the maker and actual project status. Confirm before using labels such as official, independent or endorsed. Evidence: `interactive/template.html`, masthead; `overview/page_fragment.html`, introduction.
2. **Make roster coverage visible beside the controls.** Active-team snapshots do not establish entering cohorts or complete appointment histories. Provide semester-level coverage and distinguish unmatched names from unavailable evidence. “Unconfirmed” must not be read as “not a Fellow.” Evidence: `interactive/template.html`, roster controls; `report.md`, cohort-evidence discussion; `cohort_memberships_evidence.csv`.
3. **Expose attribution uncertainty in the network.** There are 273 provisional account-attributed records among 325 published local/unflagged posts. Although the site explains this and offers an explicit-credit filter, the graph initially gives all recorded credits equivalent visual treatment. Add selection-specific uncertainty counts and credit-basis breakdowns. Do not frame the network as verified personal productivity. Evidence: index/network section; `interactive/post_index.js`; `records.json`.
4. **Strengthen the interpretation's selection method.** The 14 selected posts cover 2012 (1), 2013 (1), 2016 (1), 2017 (2), 2023 (2), 2025 (4), and 2026 (3). None comes from 2018–2022, although those years contain 98 published local/unflagged posts. Explain the purposive selection, examine missing periods and counterexamples, and consider descriptive rather than imperative theme headings. This gap does not establish that the argument is false or that those years lacked relevant material. Evidence: `archive_reading/source_evidence.json`; `records.json`; `archive_reading/build_page.py`.
5. **Interpret curation as work.** Excluding externally sourced text from a local-writing model is not a judgment that curation lacks scholarly value. Explain curation's editorial role without inferring historical policy or motives from volume alone. Evidence: publishing view; `report.md`, period interpretations.
6. **Acknowledge the limits of a text-based archive reading.** Images, embeds, formatting and linked artifacts can carry digital-scholarly arguments. Explain what is omitted, retain original links and flag consequential media in the interpretive sample. Evidence: random-reader description and `random_posts.py`.
7. **Add a current release and correction process.** The four-stage history does not fully cover the later interpretation, alias merges and landing page. Separate current counts from historical snapshots, document changes and provide a correction template. A maintained contact or repository must be confirmed rather than invented. Evidence: `history/page_template.html`; `identity/review.json`.

## Simulated first-time public perspective

1. **Explain the subject before the tools.** GCDI, the GC Digital Fellows and Tagging the Tower are named without a plain introduction explaining the organization, people and publication. Distinguish the original archive from this research companion. Verify the institutional descriptions against authoritative sources.
2. **Make the first screen about the project.** The large design-year badge and ten similarly weighted navigation choices precede the overview. Reduce the badge's prominence, retain the design experiment in a secondary position and organize routes as Read, Explore, and Methods & credits.
3. **Translate the counts.** Visitors need to understand why 430, 421, 325, 299 and 161 describe different things. Show the publication/analysis selection sequence with explanations. Keep the author-register count separate and make its uncertainty explicit. Importantly, describe 325 as local/unflagged records, not verified locally authored essays; the classification means no detected curation markers.
4. **Explain one chart before exposing all controls.** Terms such as topic mixture, roster match, author sensitivity, NLTK and MALLET assume prior knowledge. Add a worked example using a real saved result, plain definitions and progressively disclosed advanced controls. A statistical topic is not an authoritative content category, and a mixture weight is not the proportion of posts about a theme.
5. **Show a concrete source-to-claim example.** Put one named writer, short passage and interpretive connection on the landing page. Explain that the 14-post sample illustrates the qualitative reading rather than measuring prevalence.
6. **State project and review status plainly.** “Assisted” understates the documented AI drafting of the interpretation. Give a consistent short disclosure of project direction, AI-generated work, checks and unestablished human approval, with the detailed CRediT/GAIDeT statement behind it.
7. **Rename the reader action accurately.** “Analyze this post” may suggest a new computation or upload. Prefer “Explore this post's text and saved analysis”; explain that results are saved, paragraph search is local and no new model is fitted. Preserve the distinct exclusion reasons for unmodeled posts.
8. **Support sharing specific views.** Tabs do not currently update the URL. Add stable view fragments, reload/back/forward handling and a copy-link action. Decide separately whether and how filters can be included.

Relevant sources: `overview/page_fragment.html`; `interactive/template.html`; `interactive/explorer.js`, showView; `interactive/random_reader.js`; `design/year_styles.css`, hero styles.

## Proposed revision plan

### Phase 1 — Orientation and evidence status

- Verify concise descriptions of GCDI, the Fellows and the source publication; link their authoritative pages.
- State the actual relationship of this companion to GCDI and the original publication, without implying unconfirmed endorsement.
- Put the research question, a named source example and a clear reading action in the first screen.
- Make the AI-drafted interpretation and its current human-review status clear.
- Explain the different archive/model/author-register counts in plain language without upgrading uncertain classifications.
- Show attribution uncertainty and roster coverage beside the network and roster filters.

**Completion checks:** A reader can identify what the project is, whose writing it uses, what AI generated, why the main counts differ, and why unmatched authors are not necessarily non-Fellows. Existing source credits, corpus boundaries and model values remain intact.

### Phase 2 — Interpretation and historical context

- Publish a source-selection rationale and year-coverage table.
- Review additional posts from 2018–2022 and seek complicating or dissenting examples; do not impose a quota or assume the existing themes must survive.
- Revise claims and theme headings to reflect the expanded reading, recording source passages and attribution evidence.
- Add context on curation and multimodal omissions; distinguish supported history from questions for archive contributors.

**Completion checks:** Every revised claim links to named source writers and evidence; temporal omissions are explained; counterexamples and interpretive uncertainty are documented. New source selections do not silently change the frozen quantitative fit. Any future refit requires a separately versioned analytical change.

### Phase 3 — Navigation and explanation

- Group existing functions under Read, Explore, and Methods & credits without removing the current capabilities.
- Move the annual appearance experiment below primary orientation while keeping it accessible.
- Add one worked chart example and plain contextual definitions; progressively disclose advanced controls.
- Rename the saved-analysis action and support direct view links, browser history and reload continuity.

**Completion checks:** All routes are keyboard accessible, selected views are clear, links reopen the intended view, and the controls are usable at narrow widths. The design-year selector cannot reasonably be mistaken for an archive-year filter. Test existing analyses after navigation changes.

### Phase 4 — Real review, corrections and release

- Extend the project history to the interpretation, contribution revision, name merges and landing page.
- Publish a dated current-release note and a correction template asking for post ID, disputed credit/claim, supporting evidence and requested correction.
- Confirm an actual maintainer and correction destination before publishing contact details.
- Seek real archive-contributor review of institutional descriptions, roster gaps, credits and editorial history.
- Test the revised site with actual newcomers: explain the project; identify a finding and its writer; distinguish the counts; explain the design-year control; share a particular view.
- Record findings as human feedback only when actual people have participated. Disclose these AI reviews under GAIDeT as delegated quality assessment/recommendations, not human validation or contributor endorsement.

**Completion checks:** Institutional and historical claims have documented sources or explicit unresolved status; corrections are traceable; observed user difficulties are distinguished from simulated predictions; CRediT roles are not assigned merely because a person is consulted.

## Decisions requiring project-owner or stakeholder knowledge

- What relationship or institutional endorsement may this companion accurately claim?
- Which historical descriptions and Fellowship program boundaries are authoritative?
- What human review has actually been completed, and who will maintain the release/correction process?
- Which missing-period examples or editorial practices do actual contributors regard as indispensable?

These questions do not block drafting improved explanations or reorganizing the interface. They do block asserting unverified institutional facts, endorsements or human approvals.
