# Word clouds, sunburst lenses and year-comparison heatmaps

**Display analysis version 2.0 · November 4, 2026.** This revision implements Ian G. Williams’s request to explore alternative framings. It supersedes the initial top-five-count-only sunburst; the first implementation remains in Git history and its dated work-log entry. Ian approved the Welcoming pathways interface as the public layout on November 4, 2026; the previous interface is archived privately.

## Shared inputs and scope

All modes use the same **299 saved analyzed post IDs**, out of the 421 published archive records. The [inclusion ledger](../nlp/corpus_manifest.csv) accounts for excluded curated/source-linked records, welcome/roster material, exact cleaned duplicates and texts below 30 retained tokens. Nine drafts are outside the public-reading and analyzed populations. No inclusion rule, source author or fellowship decision changes here.

The 137,094 saved cleaned tokens contain 10,988 forms. The [NLP guide](../nlp/README.md) and [annotated pipeline](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/nlp_pipeline.py) explain inherited boilerplate/credit-line removal, alphabetic tokenization, lowercase and possessive normalization, part-of-speech-aware WordNet lemmatization, [English](../nlp/stopwords_english.txt) and [custom](../nlp/stopwords_custom.txt) stopword removal, and the short-form rule (three characters except `ai` and `r`). These English-language guesses can misread names, code or multilingual writing; stopword removal can erase negation. The saved readable text retains more context.

Counts are taken before MALLET’s additional document-frequency vocabulary pruning. Join files to **current post metadata by ID**, not old manifest byline strings. Academic years use saved August–July assignments. The November 1, 2026 export provides only a partial **2026–2027**, with three modeled posts. The controls do not apply author/evidence filters from other displays.

Python creates these versioned descriptive aggregates at build time. The browser selects them; it does not run NLTK, infer new topics or refit MALLET. Phrase extraction and distinctive-word scoring are new calculations on preserved inputs. The underlying NLTK corpus, five MALLET fits and saved weights remain unchanged.

## Five analytic lenses

| Lens | Question and calculation | Sector sizes and limits |
| --- | --- | --- |
| **Shared vocabulary** — default | Which cleaned forms recur across posts? Count each form once per containing post; rank by this document frequency. Keep five per year, breaking ties alphabetically. | Every eligible year gets one equal unit. Within it, shares divide **all word–post incidences**, not distinct posts; each post contains many different forms. Other words completes the denominator. Repetition inside one post cannot increase that word’s count. |
| **Subject mixtures** | Which recurring word groups appear in the saved eight-topic, seed-42 model? Sum each post’s eight saved weights. | Each modeled post contributes one fractional unit split over topics. A year’s size follows modeled-post count. All eight topics are retained. Year → topic and topic → year preserve identical contributions; a topic branch expands to its yearly distribution and source posts ranked by saved weight. Positive weights are not manually verified assignments. |
| **Distinctive vocabulary — research** | Which forms are relatively more frequent in a year than in the remaining corpus? Use the positive smoothed log₂ rate ratio below; retain five highest eligible scores. | Each eligible year gets one equal unit, split by its five positive scores. **Score shares are not percentages of writing or posts**. No Other category has a meaningful additive interpretation here. Rankings are threshold-sensitive and descriptive, without significance tests. |
| **Adjacent-word phrases** | Which literal neighbouring content-word pairs recur? Extract pairs from saved readable text, not stripped-token sequences. | Equal-sized years; five leading pair types plus Other phrases partition retained pair occurrences. Pairs may overlap within a sentence; they are phrase candidates, not established concepts or statistical collocations. Longer writing has more chances to contribute. |
| **Raw-frequency comparison** | Which cleaned forms recur most often, including repetition within a post? Sum all retained token occurrences. | Equal-sized years; leading five plus Other words partition all retained tokens. This retains the long-post/repetition sensitivity for explicit comparison. |

### Leading-five focus versus complete distribution

Shared, phrase and raw sunbursts initially **enlarge the leading five branches**, omitting Other from the chart and rescaling those five to fill each year. The checkbox explicitly names this focus; the explanation repeats it. Uncheck it to see the complete distribution including Other. Exact tables always retain Other, all underlying counts and the complete denominator. The two representations must not be mistaken for one another.

Equal-sized years support comparison and visibility; they do not imply equal sample sizes. Topic mode instead preserves one-unit-per-post contributions, and labels say so. The native selector and year list show all full year names. Inner-ring labels fit the available space. Select an inner year or a year-list control to expand it. All years restores the temporal scope. Topic-first mode additionally has an All saved topics reset in its topic selector.

### Distinctiveness formula and safeguards

Let `c_y(w)` be a form’s token count in year `y`, `N_y` that year’s retained token total, and `c_rest(w)` / `N_rest` the corresponding totals outside that year. `V = 10,988` is the complete cleaned vocabulary size. The score is:

```
log2( ((c_y(w) + 0.5) / (N_y + 0.5*V))
    / ((c_rest(w) + 0.5) / (N_rest + 0.5*V)) )
```

A displayed candidate must occur at least **three times in the year**, in **two posts in the year**, and in **three posts across the corpus**, and have a positive score. The rest-of-corpus comparison is fixed to the full saved 299-post population, even when a reader expands one year. This additive smoothing and these thresholds are exploratory design choices, not validated optimal settings or inferential tests. Below-threshold, nonpositive or unavailable scores appear as **—**, not zero.

Sensitivity to increasing the year containing-post threshold from two to three is saved in `prototype_data.json` under `hierarchies.distinct_sensitivity`. The values below count how many original top-five forms remain in the stricter top five. A low overlap warns against treating a ranking as stable; the partial final year is especially fragile.

| Academic year | Original top five retained under stricter threshold |
| --- | ---: |
| 2012–2013 | 5 |
| 2013–2014 | 3 |
| 2014–2015 | 1 |
| 2015–2016 | 4 |
| 2016–2017 | 5 |
| 2017–2018 | 4 |
| 2018–2019 | 3 |
| 2019–2020 | 4 |
| 2020–2021 | 4 |
| 2021–2022 | 0 |
| 2022–2023 | 1 |
| 2023–2024 | 1 |
| 2024–2025 | 2 |
| 2025–2026 | 5 |
| 2026–2027 · partial | 0 |

This is one targeted sensitivity check, not a full robustness study over all smoothing values, thresholds or corpora.

### Phrase boundaries

`build_word_hierarchies.py` extracts alphabetic words with optional internal apostrophes from each readable paragraph. It lowercases and normalizes apostrophes, without lemmatizing these pairs. Two consecutive original words form a candidate only if both pass the saved stop/length rules and the intervening text is whitespace only. Punctuation, a removed word or a blank-line paragraph boundary prevents a pair. Thus “data and research” cannot become “data research.” This is a new Python regex recipe, not a claim that a new NLTK collocation model was run. Different inflections remain separate. Repeated navigation or surviving boilerplate can still influence candidates; inspect source context.

## Heatmaps, tables and interaction

The heatmap uses a **common set of rows across all 15 years**: the union of the five selected terms per year, or all eight topics. It computes a cell even when that term is outside a particular year’s top five. Other is excluded from the matrix. The matrix always compares all years; selecting a year opens the corresponding sunburst and count table.

- Shared-vocabulary cells: percent of that year’s **word–post incidences**. The source panel also reports containing-post counts. This percentage is not the percentage of posts using the form.
- Subject-mixture cells: mean saved topic weight × 100, giving every modeled post equal weight.
- Distinctive cells: positive eligible log₂ rate ratios, with ineligible values shown as dashes.
- Phrase cells: occurrences per 1,000 retained adjacent-pair occurrences.
- Raw-frequency cells: occurrences per 1,000 retained cleaned tokens.

Colour intensity runs from zero to the largest eligible value within the chosen lens and full matrix; it never compares unrelated units across lenses. Exact numbers appear in every cell and accessible labels retain additional precision. Zero is an observed zero; a dash is unavailable. Heatmaps and sunbursts share underlying evidence but their normalizations differ as explicitly described. They are exploration aids, not significance maps.

The matrix scrolls within its own labelled keyboard-focusable region at narrow widths. Header cells, captions, exact tables, source buttons and a dedicated source-post jump provide alternatives to colour and small wedge labels. The sunburst measures rendered glyph bounds against each sector and checks for collisions between labels. Ring widths reserve more room for year labels. Text scales to a minimum of 0.75 rem on screen when a label fits. A compact year label can use the start of its academic year. Branch controls and tables provide full names and values.

Word clouds retain the original whole-corpus/year raw-frequency view, up to 60 forms. Font size is `0.85 + 2.8*sqrt(count/largest_count)` rem. Because the scale resets by scope, compare exact counts/rates rather than font sizes across years.

## Interpretation, validation and attribution

Frequency, coverage, distinctive scores and topic mixtures answer different questions. None establishes author consensus, fellowship membership, program impact or individual productivity. Genre, sample size, author mix, partial years, exclusions and preprocessing can influence them. Subject labels are agent-developed interpretations; original writers are not presumed to endorse them. The six essay interpretations remain a separate selected-source analysis.

`test_words.py` checks all original count groups, new hierarchy partitions, incidence counts, Other remainders, formula/threshold ranking, source-ID membership, phrase boundaries and every topic/year mean against the independent saved CSV. Browser checks and limits are recorded separately in `hierarchy_validation.json`. Passing automation is not comprehensive human validation.

**Human — Ian G. Williams:** requested implementation of the proposed alternative framings, comparisons and explanatory safeguards. CRediT: Conceptualization; Methodology; Project administration. Human execution of code/tests and approval of every numeric choice are not established.

**AI — OpenAI Codex:** implemented and annotated the new descriptive calculations, layouts, interactions and documentation; ran the recorded checks. Exact model/build unknown/not recorded. GAIDeT saved task mappings: Code generation `0000017`; Data analysis `0000026`; Visualization `0000027`; Validation `0000023`; Text generation `0000030`; Identification of limitations `0000046`. Python performs the new arithmetic/phrase extraction; inherited NLTK/MALLET outputs remain separately attributed. No new subagents, participants, external contacts or topic-model fits were used.

Hierarchy implementation reference: [Plotly’s sunburst documentation](https://plotly.com/python/sunburst-charts/) explains parent/child value accounting. It informed the framing, but no Plotly code or dependency was added. The SVG interface uses the project’s existing browser code approach. The installed colour-independence, table-accessibility and plain-language-design guidance informed presentation; their use is not a conformance claim.


## Year-exclusive companion

**Companion analysis version 1.0 · November 4, 2026.** Ian requested a graph of each year’s unique words, attached to the sunburst if feasible. Here **year-exclusive** means a saved cleaned form whose set of observed academic years contains exactly one year. It does not mean a word with only one occurrence, a form merely distinct within a year, the first historical use of a word, or the smoothed distinctive-vocabulary score above. The definition remains fixed against the full saved 299-post population when controls change.

`build_year_exclusive.py` constructs the year set for every cleaned form, retains all sets of size one, and records exact occurrences, containing-post counts and IDs. No extra frequency threshold or spelling correction is imposed. Of 10,988 corpus forms, **5,731** occur in exactly one academic year. Among those, **5,490** occur in only one post and **241** in multiple posts within that year. Separately, **4,665** have only one token occurrence; one-post and one-occurrence are different evidence. Multiple posts need not mean multiple authors.

The attached stacked-bar chart counts distinct forms once per year. Stripes identify year-exclusive forms seen in one post; a solid segment identifies exclusive forms seen in two or more posts; grey identifies forms also found in other years. Segment lengths share a common count scale whose maximum is the largest observed per-year vocabulary. Each bar’s segments add to that year’s complete distinct-form count. Year counts are not interchangeable with the global 10,988-form vocabulary, because shared forms can enter several annual totals. Exact row labels and accessible descriptions supply the counts without relying on colour. The comparison always shows all 15 years; the word list follows the main year selector.

This is an **attached comparison**, rather than an additional hierarchical sunburst ring: observed exclusivity of all forms does not subdivide a fitted topic’s fractional weight or the selected top-five word incidences. Nesting those unrelated quantities would imply unsupported parent–child accounting. It is connected by year selection, evidence controls and source-post navigation instead. The source chart remains unchanged.

The complete 5,731-form list is saved, with 50 rows displayed at a time and Show 50 more pagination. Years appear chronologically. Within each year, forms are ordered by descending occurrence count, then descending containing-post count, then alphabetical order. A separate evidence selector includes all forms, forms seen in at least two posts, or forms seen in only one post. Case-insensitive literal-substring search filters the cleaned forms. These controls affect only the list; the comparison chart always retains all categories. An empty filtered list is not evidence of an inactive year. Each form opens the current source-post/credit evidence without inferring an author’s fellowship status.

More writing and a larger sample provide more opportunities to observe vocabulary. A form can qualify because it is a name, code identifier, URL fragment, spelling artifact or an English-lemmatization mistake. It may appear in excluded curated/short/welcome records, other archives or writing outside the snapshot. The partial **2026–2027** contains only three analyzed posts and must not be read as a complete-year comparison. Source context and spelling require human examination; exclusivity establishes neither importance nor originality.

`test_year_exclusive.py` independently rebuilds the year sets and confirms completeness, every form’s source IDs/counts, annual category partitions, sorting and the one-post/one-occurrence distinction. Detailed browser checks and limitations are recorded in `exclusive_validation.json`. No raw export, stoplist, cleaned corpus, model, authorship or inclusion decision changes.

**Human — Ian G. Williams:** requested the annual unique-word analysis and its connection to the sunburst (CRediT: Conceptualization; Project administration). The operational definition and attachment design were AI implementation choices, not separately human-confirmed calculations.

**AI — OpenAI Codex:** implemented and annotated the saved-token set analysis, companion chart, searchable evidence list, source integration, methods and recorded checks. Exact model/build unknown/not recorded. GAIDeT: Code generation `0000017`; Data analysis `0000026`; Visualization `0000027`; Validation `0000023`; Text generation `0000030`; Identification of limitations `0000046`. Python performs the counts on inherited NLTK-cleaned files; no new NLTK/MALLET run is claimed. Original writers retain source-text credit without implied endorsement. Installed colour-independence and table-accessibility guidance informed presentation; no participant or screen-reader validation is inferred.

## Read every sunburst branch

The chart key lists the full names of the branches drawn in the selected lens and year. Hover or focus a name to outline its slice. Select the name to use the same drill-down or source action as the slice. Compact labels inside the circle can abbreviate a year or term. The key retains the complete wording and the count table provides exact values. Changing the academic year or the topic hierarchy restores all saved topics.

## Download the chart as PNG

The word cloud and sunburst each offer a PNG download at twice the rendered dimensions. The word cloud uses the visible label positions and line wraps. The sunburst uses the visible SVG geometry and computed presentation styles. The filename records the selected year or all-years scope. Sunburst filenames also carry the lens and applicable hierarchy, topic or leading-five setting. The chart tables remain available for exact counts and source evidence.

## Interactive word cloud

The cloud starts with 20 words and can show 40 or 60. **Common** sizes words by occurrences or by the number of posts containing them. **Distinctive** compares the share of posts containing the word in one selected year with the share in all other years combined. It ranks positive percentage-point gaps and requires at least two matching posts in the selected year. The minimum-post control can raise that threshold. This is a descriptive post-share comparison. The sunburst uses the separate smoothed token-rate score described above.

The live page includes unordered counts from the saved 299-post analysis corpus. Hiding terms, changing the minimum, or choosing a different word limit re-ranks the complete vocabulary. Alphabetical order rearranges the current set. The timeline uses the full analyzed denominator in each year, independent of display filters. Context shows up to five short sentences from different saved reading copies, with exact written-form matching, case ignored. Random related posts use the cleaned word counts and can include normalized variants. The filters, excerpts, and chart use saved evidence without new NLTK cleaning or a MALLET fit. The cloud PNG exports the displayed words.
