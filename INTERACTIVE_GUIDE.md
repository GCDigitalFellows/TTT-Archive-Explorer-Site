## Historical membership extension · November 2, 2026

The [GCDI People directory](https://gcdi.commons.gc.cuny.edu/people/) now supplies separately documented academic-year role histories. [Explore the historical role matrix](FELLOWS_HISTORY.html) or read the [methodology](membership/README.md). Ian confirmed Margaret/Maggie Schreiner and Anna Schlenz/Anna Corbett; original source names remain inspectable.

Earlier signed-roster tables remain a preserved baseline. The topic and word views, index/network and thematic charts now offer alternative evidence bases: original signed lists, reviewed signed names, dated Digital Fellow intervals, any dated GCDI role, or a combined Digital Fellow definition. Of 325 local records, 147 match the original signed lists, 237 match dated Digital Fellow intervals, and 246 match the combined basis. Of 299 modeled posts, the corresponding counts are 129, 216 and 223. These match **recorded credits**, including provisional accounts; they do not verify additional bylines. Apply the separate source-supported filter when needed.

The directory also changes how unmatched or guest credits should be interpreted: a guest byline does not establish that someone was outside GCDI. For example, the directory lists Ian Williams as a Social Media Fellow in 2022–2026; that is a different role from a dated GC Digital Fellow interval. Current roles are undated snapshots and are not backdated. All 430 records and their authorship decisions remain intact. No model fitting or word cleaning was rerun.


# Tagging The Tower Archives Explorer

The project has been renamed; the original publication remains **Tagging the Tower**. The GitHub account is **perlsdiver**. Repository status is recorded in project.json and the work log; this does not imply a public website deployment.

# Thematic views added · November 2, 2026

Choose **Themes & connections** under Explore. Compare saved title/tag signals, saved title/tag/body signals, or the six interpretive headings applied only to the essay’s 19 examples. These are separate evidence layers, not relabelled MALLET topics.

The view includes a year/theme heatmap, dictionary-signal co-occurrence matrix, writer bars, linked source posts with credit basis, and filtered CSV exports. Cells expose numerator/denominator; theme counts overlap. All 325 eligible local posts remain in dictionary-layer denominators, including unmatched and unmodeled posts. The essay layer uses counts only and deliberately omits a co-occurrence matrix because its examples were not exhaustively coded for every theme.

The post index and its publication network now accept a **Title/tag theme signal** filter. Index grouping by theme can place a post in more than one group. Its 430-record scope differs from the thematic charts’ 325-post scope; the network still excludes drafts and curated records. See [methodology](themes/METHODOLOGY.md) and [work log](WORK_LOG.html).

---

# Current research-first release · November 2, 2026

Open [index.html](index.html), the package front door. The previous explorer filename is an identical compatibility copy. Navigation is grouped into Read, Explore and How we know. The Story opens the archive interpretation; Who wrote what opens the complete credit register.

The landing page now has author-first search, a sourced GCDI/Fellows introduction and a concrete source-to-claim example. Methods & data provides definitions and reproducibility routes; For reports gives qualified counts. View links preserve the active view and appearance, not research filters or individual random posts. The revised reader action explicitly opens saved results.

The interpretation now has 19 sources after a targeted five-post expansion from 2018–2022, with a selection rationale, visible zero years and historically situated qualifications. The original 14-post discussion below describes an earlier version. All subsequent work, two AI sub-agent reviews, the additional supplied simulation and requester decisions are described in [the work log](WORK_LOG.html) and [revised plan](reviews/revision_plan.md). These simulations are not human usability studies.

The network shows selection-specific provisional-credit counts, and the topic view explains signed-list coverage beside the controls. Its labels are agent-developed interpretations; independent human confirmation is not documented. The frozen corpus, fitted weights and original baseline remain intact.

Correction contact: Ian G. Williams, ian.williams52@gc.cuny.edu; GitHub profile https://github.com/perldiver. No response time is promised. Licenses for new code and analysis await Ian’s choice. See [reuse status](REUSE_AND_CITATION.html), [accessibility limits](ACCESSIBILITY.html), and [validation record](process/validation.json). Direct file execution and narrow-screen behavior remain explicit unverified checks with the current browser tool; HTTP navigation and embedded-data checks passed.

---

# Using and reviewing the interactive visualizations

Open [the interactive explorer](interactive_explorer.html) in a browser. It is one self-contained file: no installation, server, account, or network connection is needed to explore the charts. Following a post link opens the original website and does require internet access.

The explorer changes how you inspect saved evidence. It does not retrain MALLET, change the original corpus, or add new claims to the written interpretation. The static figures and underlying tables remain available.

## Start with the project overview

The site now opens on **Overview**, a landing page introducing the project’s question, scope, interpretation, methods and contributions. Its route buttons open the existing reading, archive, chart and process views. Choose **Overview** or the Tagging the Tower home link to return. The annual appearance controls remain available under **Change the look** and start collapsed.

The four headline counts are derived during the build from the same saved records used elsewhere: published records, local posts, modeled posts and grouped source-author entries. The overview distinguishes these populations and retains the CRediT/GAIDeT disclosure and interpretive limits.

For a reviewer, `overview/page_fragment.html` is the editable narrative, `overview/overview.css` contains presentation only, and the builder inserts the current counts. Navigation reuses the existing tab-switching function in `interactive/explorer.js`; it does not reset analysis filters or run new models.

## Four analytical views, with explicit populations

| View | What you can change | What the values describe |
|---|---|---|
| Topics over time | Model, year range, credited writer, excluded writer, roster subset, and averaging method | Topic mixtures in selected posts from the 299-post modeling corpus |
| Words and phrases | Word-chart year and roster subset; phrase score and minimum document count; early/recent vocabulary direction | Word counts can be filtered; phrase scores always describe all 299 modeled posts; contrasts use the fixed early and recent periods |
| Model checks | Quality measure, seed-comparison topic, and excluded writer in the sensitivity table | Five already fitted models; matched eight-topic seed comparisons; a fixed-primary-model author comparison |
| Publishing and motifs | Publication year and record type; body-text motif and title/tag theme dictionary | Publishing covers 421 published posts and a separate 9-draft ledger; body motifs cover 307 non-welcome local posts; original title/tag signals cover 325 local posts |

These populations are deliberately different. The explorer labels them rather than pretending every filter applies to every chart.

## Start with a concrete question

To explore the recent AI/access/power grouping, stay with the eight-topic, seed-42 model. Limit the year range to 2023–24 through 2025–26. Select Topic 1 in a particular year, then inspect the ranked posts and their credited writers. The leading-word chart describes the fitted model; it does not change when you filter its documents.

Next exclude a writer, or require same-semester roster evidence. Watch both the average and the number of posts. Removing a collective post crediting that writer removes the whole post from the average. This is not a model refit or an estimate of the writer's causal influence.

Then select a different model. The alternative model is described by its leading words, because topic numbers and labels do not transfer automatically. The model-check view also lets you choose a run or matched seed topic and open it in the topic explorer.

For word frequency, switch between occurrence counts and the number of posts containing the word. Select a word to see article links. A post containing “AI” is not necessarily about AI throughout, and its presence does not reveal endorsement or criticism.

## Interactions and accessibility

- Select a heatmap percentage to inspect its topic and year. Select a topic heading to change topics while retaining the current inspected year.
- Select a bar label for its underlying counts, related posts, or model. Hover details are supplementary; essential interactions also work with a keyboard.
- Use native selects, checkboxes, and buttons with Tab, Space, or Enter. Dense heatmap tables can scroll horizontally on narrower windows.
- Reset topic filters to restore the primary model and all 299 modeled posts.
- An empty combination shows an explicit empty state. No matching posts is not displayed as a zero-valued topic estimate.
- Export ranked posts to CSV to preserve the selected model, topic, writers, cohort requirement, and individual post weights. The export includes all matching ranked posts, not just the first screenful. Annual averaging choices do not change individual post weights.

The CSV retains values for inspection; spreadsheet formula-like titles and names are escaped as text. Original website links open separately. Record text is inserted as text, not executable page markup.

## Share the page, or share the code

The generated `interactive_explorer.html` embeds the required data, code, and styles. Copy that one file when you want someone to use the explorer without installing software. It includes post titles, credited writers, links, topic mixtures, cleaned word counts, and the publication/draft audit metadata. It does not embed full post bodies, the original XML, or author email addresses.

For a code discussion, share the annotated source files and the [earlier shareable walkthrough](SHAREABLE_WALKTHROUGH.html). The calculation layer is intentionally small enough to read independently of the interface.

| File | Role | Suggested reading approach |
|---|---|---|
| [build_interactive.py](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/build_interactive.py) | Read saved outputs and assemble the single-page file | Start at `main()`, then follow each named input function |
| [interactive/core.js](interactive/core.js) | Filter posts and calculate averages, word counts, rankings, and exports | Read `filterPosts()` and `topicAverages()` first; they have no page controls |
| [interactive/explorer.js](interactive/explorer.js) | Connect choices to the displays | Start at `initialize()` and `renderActiveView()`, then the view you want to review |
| [interactive/template.html](interactive/template.html) | Headings, controls, notes, and empty chart locations | Read the visible wording before the JavaScript; this is a build template, not the finished page |
| [interactive/styles.css](interactive/styles.css) | Appearance, focus states, and responsive layout | Contains presentation rules only, not analytical decisions |
| [interactive/test_core.js](interactive/test_core.js) | Compare browser calculations with saved Python results | The test names explain each numerical expectation |

JavaScript here is the language that responds to page controls. The Python builder only packages data; the original NLTK/MALLET pipeline remains the source of the results. There are no third-party scripts or chart libraries loaded by the finished explorer.

## One calculation in plain language

`topicAverages()` first finds the posts in each selected year. For an equal-post average, it adds each post's topic weight divided by the number of selected posts. For a length-weighted average, it gives each post influence proportional to its count of MALLET-input tokens. It returns both the result and the denominator.

This calculation uses the existing document-topic mixtures. It does not estimate new topics for a selected writer or year. Even a filtered view is still examining a model originally trained on the full included corpus.

`wordFrequencies()` keeps two numbers: the number of word occurrences and the number of posts containing that word. A word repeated ten times in one post contributes ten occurrences but one document. These counts come from the stopword-filtered files before the extra MALLET vocabulary pruning.

`phraseRanking()` works differently: it reorders the saved whole-corpus association scores and applies a minimum-post threshold. It does not have the sentence-level data required to refit those scores for a selected year. The interface states that limitation beside the chart.

## Rebuild and check without retraining

From the project folder, run:

```bash
python3 analysis/build_interactive.py
node --test analysis/interactive/test_core.js
python3 analysis/verify_revision.py
python3 analysis/package_report.py INTERACTIVE_GUIDE.md
```

Building uses ordinary Python only. Numerical tests use Node's built-in test tools; there is no package-install step. Users opening the finished page need neither Python nor Node. The last command refreshes the reading page and downloadable bundle.

The builder reads the saved CSV, JSON, topic keys, word weights, document mixtures, and cleaned text files. It checks that every model has the expected post IDs and normalized mixtures. It also records a fingerprint of its embedded data in `interactive/build_audit.json`.

Eight independent numerical checks cover annual equal-post and length-weighted means, the roster subset, every cleaned word frequency, writer sensitivity, publication totals, motif counts, all five model mixtures, and empty/filter/export behavior. Expected values are copied from the earlier saved Python tables rather than produced by the new JavaScript functions under test.

The finished page is also checked in the browser for model switching, year/cohort filtering, topic-to-post drill-down, word-to-post drill-down, draft selection, writer comparisons, and page-level overflow in the available narrow preview window. Numerical and interface checks support implementation accuracy; they do not validate topic labels, resolve cohort gaps, or establish causal explanations.


## Adjust the design independently

The appearance lab offers a preset for each calendar year from 2012 through 2026. Use the year selector or arrow buttons, then expand the fine-tuning controls to change typography, surfaces, layout, spacing, color mode, or intensity. Reader mode provides a neutral appearance; reset restores the selected year’s defaults. Appearance settings can be downloaded or bookmarked without changing the analysis filters.

These are curated interpretations of documented design directions. They do not measure annual adoption. The 2026 interpretation is forecast-led. See the [methodology and all source links](STYLE_METHODOLOGY.html) and the [readable code guide](design/README.md).

## Read a random post

Choose **Random post** in the view navigation. The reader draws from all 421 published category posts, rather than only the 299 modeled articles. Drafts are excluded. Academic-year and post-type filters restrict the reading pool independently of the analysis filters. Each candidate has an equal chance on a draw, except that the current post is excluded when there are other candidates. Later repeats are possible; this is not a shuffled reading list.

The reading copy preserves ordinary body text and paragraph breaks. It omits images, embeds, executable markup, and original formatting. Use **Open original post** for the complete presentation. Curated items identify the recorded source credit separately from the WordPress posting account; local posts display the audited writer credit. Returning from another tab preserves the current article.

For reviewers: `random_posts.py` joins published export bodies to the audited metadata and produces a separate reading dataset. `interactive/random_reader.js` implements filtering, selection, and safe text rendering. Neither changes the NLP corpus or model data. Rebuilding now requires the original export, located by the `WORDPRESS_XML` environment variable or the documented default Downloads path.

## Analyze the post being read

Select **Explore this post’s text and saved analysis** beneath the article credit. The expandable panel explains and displays:

- **NLTK word profile:** the twelve most frequent cleaned lemmas, their occurrence counts, the cleaned token total, and the token total retained for MALLET. These are saved outputs of the existing Python cleaning pipeline.
- **MALLET topic mixture:** the current article’s weights across all topics, with leading model words. Switch among the five saved runs. Only the primary eight-topic, seed-42 run has reviewed human labels. Topic numbers are not aligned across runs.
- **Context search:** a case-insensitive literal word-or-phrase search across the displayed paragraphs, available for all published posts. This is a browser search, not an NLTK concordance or lemma-aware search. Up to eight matching paragraphs are shown.

The offline button reveals previously computed NLTK/MALLET outputs; it does not install or execute Python/Java, refit models, infer mixtures for excluded posts, or upload article text. The 299 modeled posts have saved profiles. Other posts display their recorded corpus-exclusion reason and still support context search. A topic mixture is not confidence, truth, or an exclusive thematic classification. Reading copies and cleaned analysis text differ because the earlier pipeline removes material and stopwords and lemmatizes words.

For code review, read `renderAnalysis()` in `interactive/random_reader.js`. It joins the current article to the saved analysis by post ID, sorts its word counts and topic weights, and renders text safely. It does not modify model data or the filters in other tabs. The saved model-run values are the same values checked by the independent numerical tests.

## Search and organize the post index

The **Post index & network** tab includes all 430 category records: 421 published posts and nine drafts. Drafts appear as labeled metadata records with no public-post link or embedded draft body. Search is a case-insensitive literal phrase match across titles, recorded credits, posting-account names, source authors, tags, and published reading-copy text. It is not a semantic or lemma-aware search. The source-author field is searchable as text but is not split into independently verified author identities for the author selector.

Combine academic year, credited name, publication status, post type, and topic filters. The author selector includes audited writer names and curated source-writer metadata; the curator’s WordPress account remains separately searchable and visible in attribution evidence. Inspect the attribution evidence on a card. These are publication credits, not independently verified claims about fellowship membership.

Topic filters use the primary saved eight-topic, seed-42 MALLET model. A post qualifies if its weight for the selected topic meets the chosen minimum (10%, 20%, 30%, or 50%). Several topics can qualify for one post. **Organize by topic** uses the strongest topic only, as a browsing convenience; it does not turn mixtures into exclusive thematic findings. Posts without a model profile form a separate group. No new topic weights are assigned to drafts, curated records, or other excluded items.

Organization can use academic year, author/posting credit, or strongest analyzed topic. The page loads 50 unique posts at a time; **Show 50 more** expands that subset. Author grouping repeats collective posts under each credited name, while the scope count remains a count of unique records. Group headings describe the currently displayed subset, not a complete set of group totals. The CSV export contains all matching records, including those not yet displayed; draft URLs are blank. Index filters persist when switching tabs and do not alter other tabs' analysis selections.

## Read the author–year publication network

The network is **bipartite**: one node set represents credited authors and the other represents academic years. An edge's weight is the number of published local/unflagged posts in the current index selection crediting that author in that year. Drafts and curated records do not contribute. A coauthored post contributes one count to each distinct credited author, so the sum of edge counts is a count of author credits, not necessarily unique articles. Provisional creator-based attribution from the existing audit remains provisional; this visualization does not resolve it.

The initial view shows **all authors** in the current selection (70 credited names in the full published-local network after the body-credit correction). Choose ten or twenty to show only the most prolific names. Years with no displayed edge disappear. The scope states how many authors, years, and connections are shown. Year-node totals count credits among the displayed authors, not every unique post that year. Node radius is `5 + min(11, sqrt(credits))`; line width is `1 + 1.5 × sqrt(edge count)`. These are display choices to preserve legibility, not statistical estimates.

Hover or keyboard-focus a node to highlight its connections. Select it with a pointer, Enter, or Space to set the corresponding index filter. Focus moves to that filter so keyboard users can adjust it or continue through the controls. Use **Clear index filters** to restore the full selection. The graph uses a deterministic two-column layout, ordered by author credit count and chronological year, rather than a force simulation. Distance, crossings, and placement do not measure social closeness, collaboration, centrality, or causal influence. It is not a cohort-membership network.

The graph scrolls internally for large selections and horizontally on narrow screens. **Read the network as a table** presents exactly the edges and counts in the currently displayed network. Changing index filters recomputes both network and table from the same selected records.

For a reviewer, `interactive/index_core.js` contains the pure filtering and edge-counting functions. `interactive/post_index.js` contains the annotated interface, grouping, SVG rendering, and export behavior. Metadata is embedded separately from the unchanged scientific dataset by `build_interactive.py`. Run `node --test analysis/interactive/test_index.js analysis/interactive/test_core.js analysis/design/test_styles.js` to check population boundaries, topic thresholds, coauthor counting, and the existing analysis and appearance checks.


## November 1 author-credit correction

Opening bylines and signed sections were rechecked against the export. Eight posts now have corrected credits, adding ten names to the published-local network. All authors are shown by default. Cards and reader entries display credit basis and literal body-credit quotations where available. Use **Credit evidence** to exclude provisional accounts and source metadata, retaining explicit body credits or author taxonomy. Many older posting-account attributions remain provisional. The two 2022–2023 guest posts by Marisa Iovino and Maren Rothfritz no longer inherit Rebecca Krisel’s roster match. See the [complete correction report](ATTRIBUTION_REVIEW.html) for sources, limits, and the distinction between revised attribution and the frozen NLP fit.

## Read attribution and process credits

Choose **Attribution & process**, or open the [standalone credits page](CREDITS_AND_PROCESS.html). It separates source-writing acknowledgment, Ian G. Williams’s documented project direction and feedback, and AI-delegated work using CRediT and GAIDeT. All 163 human-name entries from the corrected inventory are included, expanding reviewed joint-source credits and retaining provisional and draft status. Seven organizational/unresolved labels appear separately. Possible name variants are not silently merged.

The register can be searched by name or post title and filtered to local, curated-source, or draft contexts. **Show everyone** restores the full list. Each name links to its recorded posts and credit evidence; the downloadable CSV and JSON preserve provenance. Source writers are not automatically assigned roles in the new analysis, and individual CRediT role confirmation is not implied. The page documents actual oversight limits and unknown exact AI model versions rather than claiming full human verification. See [credits build/review notes](credits/README.md).


## Follow the project’s evolution

The **Project history** tab begins with the post-index request and traces the author-attribution correction, the CRediT/GAIDeT page, and the documentation of this process. It connects requests to design choices, evidence, checks, and unresolved cases. Read the [standalone history and methodology page](PROJECT_HISTORY.html) for the same explanation.

Each stage links to an exact user-prompt excerpt preserved on the page. “Link to this excerpt” provides a portable local section link. The app supplied message identifiers but no supported original-message URL, so these are excerpt links, not invented chat permalinks. The [selected prompt provenance](history/prompts.json) records the source references. See the [history build/review notes](history/README.md) for the readable generator and source files.

## Read the archive interpretation

The **Archive interpretation** tab presents six connected arguments about digital scholarship and the GC Digital Fellows. Theme links let readers move through the essay. Each source card names all credited writers, states the attribution basis and academic year, links to the original article, and expands to show an export-verified passage and posting account. The 14 selected posts are evidence for a qualitative reading, not a representative sample or a new topic model. Global year/model controls do not filter the essay. The view inherits annual design settings and works offline with the rest of the explorer.

For human reviewers, `archive_reading/build_page.py` separates the editable interpretive arguments from source metadata in `source_evidence.json`; `reading.css` contains presentation rules only. Rebuild with `python3 analysis/build_interactive.py`. The analysis data and fitted models are unchanged.

### Contribution statement for the interpretation

The interpretation now places a visible authorship and AI-use disclosure before the six themes. Expand **Read the CRediT contribution statement and GAIDeT declaration** for Ian G. Williams’s documented human project roles and the specific tasks delegated to OpenAI Codex. The statement distinguishes source-post writing from this new synthesis, records unknown model details and human-review limits, and links the primary taxonomy documentation. The same declaration appears in the source-evidence companion, with a downloadable JSON record. It does not imply source-author endorsement or final human approval.

For review, `archive_reading/attribution.py` supplies both displays from one statement and reuses the existing human-role profile. It adds essay-specific AI tasks, including formulation of conclusions; the quantitative corpus and fitted models remain unchanged.

## Reviewed author-name merges

The earlier register grouped **161 entries**, following two supported merges from the earlier 163-name snapshot: **Ian Williams → Ian G. Williams** (confirmed by the requester) and **Laura Wildemann Kane → Laura Kane** (supported by the GCDI annual report and professional record). The index, random reader, register and grouped inventory use the same explicit mapping. Searches also recognize known variants. The published-local network remains at 70 names because the additional variants occur in curated-source credits, which are excluded from that network.

Open the [name-review report](identity/review.html) for sources, retained separate names, review limits and downloads. No article records were deleted. Original credit strings, literal bylines, posting accounts and provisional status remain available. The [grouped inventory](identity/grouped_records.json) is an additional identity view; `records.json` and the historical analysis files remain intact. The fitted models and cohort matches were not changed. `author_identity.py` explains the shared grouping logic; `identity/review.json` records every merge decision.


## External review provenance clarification · November 2, 2026

Ian G. Williams identified the supplied review as produced by **Deepseek V4.1 Flash 1017**, running in the **CAIL sandbox in OpenWebUI**, from a **ZIP export of a previous project iteration**. This is distinct from the two Codex sub-agent simulations and Codex implementation work. The model/environment provenance is requester-reported, not independently verified from external session logs. The exact input ZIP filename, hash and iteration identifier are not recorded. The review document’s stated manifest-level inspection limits remain relevant; its recommendations were checked against current source files. None of these simulations establishes actual human user testing.

## November 2 attribution correction

Ten additional records have corrected names after checking author fields, full-body credit signals, revision notes and embedded source biographies. McMichael’s linked-data posts now credit A. L. McMichael. The current register groups 162 human-name entries; the network has 71 grouped local names. McMichael spacing variants are grouped while raw credits stay inspectable. The reviewed-credit filter includes accepted export metadata and institutional-guide evidence. There are 249 provisional local account credits, including 50 older Sam O’Hana account records whose historical writers remain unresolved. Consult [the correction audit](ATTRIBUTION_REVIEW.html), not preserved before/ snapshots, for current attribution.

## Complete export and authorship accounting

The comprehensive ledger accounts for every export item and every category article. Named article references add four writer corrections and strengthen five existing credits. All 421 published records have a documented evidence disposition: 52 source-supported, 120 declared-only and 249 unresolved account credits. “Source-supported” describes checked evidence; it does not claim personal author confirmation or independent human verification. The browser offers source-supported subsets for the index/network, themes, topic summaries and word counts. Population changes must accompany any comparison. See [complete archive coverage](https://gcdigitalfellows.github.io/TTT-Archive-Explorer-Site/ARCHIVE_COVERAGE.html).
