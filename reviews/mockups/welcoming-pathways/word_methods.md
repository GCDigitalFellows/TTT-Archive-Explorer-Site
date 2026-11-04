# Word clouds, sunburst lenses and year-comparison heatmaps

**Display analysis version 2.0 · November 4, 2026.** This revision implements Ian G. Williams’s request to explore alternative framings. It supersedes the initial top-five-count-only sunburst; the first implementation remains in Git history and its dated work-log entry. The standalone Welcoming pathways draft remains separate from the production layout.

## Shared inputs and scope

All modes use the same **299 saved analyzed post IDs**, out of the 421 published archive records. The [inclusion ledger](../../../nlp/corpus_manifest.csv) accounts for excluded curated/source-linked records, welcome/roster material, exact cleaned duplicates and texts below 30 retained tokens. Nine drafts are outside the public-reading and analyzed populations. No inclusion rule, source author or fellowship decision changes here.

The 137,094 saved cleaned tokens contain 10,988 forms. The [NLP guide](../../../nlp/README.md) and [annotated pipeline](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/nlp_pipeline.py) explain inherited boilerplate/credit-line removal, alphabetic tokenization, lowercase and possessive normalization, part-of-speech-aware WordNet lemmatization, [English](../../../nlp/stopwords_english.txt) and [custom](../../../nlp/stopwords_custom.txt) stopword removal, and the short-form rule (three characters except `ai` and `r`). These English-language guesses can misread names, code or multilingual writing; stopword removal can erase negation. The saved readable text retains more context.

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

Shared, phrase and raw sunbursts initially **enlarge the leading five branches**, omitting Other from the chart and rescaling those five to fill each year. The checkbox explicitly names this focus; the explanation and centre label repeat it. Uncheck it to see the complete distribution including Other. Exact tables always retain Other, all underlying counts and the complete denominator. The two representations must not be mistaken for one another.

Equal-sized years support comparison and visibility; they do not imply equal sample sizes. Topic mode instead preserves one-unit-per-post contributions, and labels say so. All year names remain available on the inner ring and in a native selector/year list. Select an inner year or a year-list control to expand it. All years restores the temporal scope. Topic-first mode additionally has an All saved topics reset in its topic selector.

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

The matrix scrolls within its own labelled keyboard-focusable region at narrow widths. Header cells, captions, exact tables, source buttons and a dedicated source-post jump provide alternatives to colour and small wedge labels. Small outer labels are suppressed below 0.045 radians; full labels/counts remain in the table and source panel, and year expansion enlarges them. Every inner year is named without the previous year-label cutoff. Topic labels may be visually shortened; full labels remain on controls and in the tables. No animation is introduced. Reduced-motion/system-colour safeguards remain; actual OS mode and screen-reader/participant sessions are not established by these checks.

Word clouds retain the original whole-corpus/year raw-frequency view, up to 60 forms. Font size is `0.85 + 2.8*sqrt(count/largest_count)` rem. Because the scale resets by scope, compare exact counts/rates rather than font sizes across years.

## Interpretation, validation and attribution

Frequency, coverage, distinctive scores and topic mixtures answer different questions. None establishes author consensus, fellowship membership, program impact or individual productivity. Genre, sample size, author mix, partial years, exclusions and preprocessing can influence them. Subject labels are agent-developed interpretations; original writers are not presumed to endorse them. The six essay interpretations remain a separate selected-source analysis.

`test_words.py` checks all original count groups, new hierarchy partitions, incidence counts, Other remainders, formula/threshold ranking, source-ID membership, phrase boundaries and every topic/year mean against the independent saved CSV. Browser checks and limits are recorded separately in `hierarchy_validation.json`. Passing automation is not comprehensive human validation.

**Human — Ian G. Williams:** requested implementation of the proposed alternative framings, comparisons and explanatory safeguards. CRediT: Conceptualization; Methodology; Project administration. Human execution of code/tests and approval of every numeric choice are not established.

**AI — OpenAI Codex:** implemented and annotated the new descriptive calculations, layouts, interactions and documentation; ran the recorded checks. Exact model/build unknown/not recorded. GAIDeT saved task mappings: Code generation `0000017`; Data analysis `0000026`; Visualization `0000027`; Validation `0000023`; Text generation `0000030`; Identification of limitations `0000046`. Python performs the new arithmetic/phrase extraction; inherited NLTK/MALLET outputs remain separately attributed. No new subagents, participants, external contacts or topic-model fits were used.

Hierarchy implementation reference: [Plotly’s sunburst documentation](https://plotly.com/python/sunburst-charts/) explains parent/child value accounting. It informed the framing, but no Plotly code or dependency was added. The SVG interface uses the project’s existing browser code approach. The installed colour-independence, table-accessibility and plain-language-design guidance informed presentation; their use is not a conformance claim.
