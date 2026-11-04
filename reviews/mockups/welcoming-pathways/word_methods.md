# Word clouds and top-five sunburst

Added November 4, 2026 to the Welcoming pathways discussion draft. These are frequency views of the saved analyzed corpus, not a new topic-model fit or a new claim about all archived writing.

## Scope and reproducible calculation

1. Read the [saved inclusion ledger](../../../nlp/corpus_manifest.csv), selecting its 299 `included=True` IDs. The public archive contains 421 published records; 122 do not enter this saved text-analysis population. Nine drafts are outside both public reading and the fitted corpus. Inclusion is not a statement about a writer’s importance or fellow status.
2. Read every token in each matching [cleaned text file in the private research repository](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/tree/main/analysis/nlp/cleaned_text), before MALLET’s further document-frequency vocabulary pruning. Count occurrences with Python `collections.Counter`. Assert token totals against the manifest. Join to current post IDs and their saved academic-year assignments, not old manifest byline strings.
3. Sum counts over all 299 posts, and independently within every academic year present in the public metadata. Academic years use August–July; the export is dated November 1, 2026, so 2026–2027 is incomplete. Years without retained texts are explicitly unavailable.
4. Sort by descending count, breaking exact ties alphabetically. Save the first 60 forms per scope and the IDs of contributing posts for each displayed word. Save total posts, tokens and unique forms before this display truncation. A post contributes once to the containing-post list but all repeated token occurrences to its word count.
5. Browser controls select these build-time aggregates. They do not run NLTK/MALLET, refit a model, rerun cleaning, or apply the author/evidence filters on the other analysis displays. Saved topic weights, attribution and raw source files remain unchanged.

## Cleaning inherited from the saved recipe

The [annotated Python pipeline](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/nlp_pipeline.py) and [NLP guide](../../../nlp/README.md) document the historical recipe: remove repeated boilerplate/introductory credit lines, tokenize alphabetic forms, lowercase and normalize possessives, guess parts of speech, use WordNet lemmas, and remove the saved [English](../../../nlp/stopwords_english.txt) and [custom](../../../nlp/stopwords_custom.txt) stopwords. Forms shorter than three characters are removed except `ai` and `r`. The inclusion recipe excludes curated/source-linked records, welcome/roster material, exact cleaned duplicates and documents with fewer than **30 retained tokens**. Do not infer a missing author's identity from exclusion or inclusion.

These English-language tools can misread code, names and multilingual text. Stopword removal can erase negation. Read original or saved full text when interpreting a term. A lemma is a normalized word form, not a manually verified concept. The new views reuse saved outputs; no fresh NLTK run is claimed.

## Visual encodings

- **Word cloud:** up to 60 leading forms. Font size in rem is `0.85 + 2.8 × sqrt(count / largest count in this scope)`. A responsive wrapping layout avoids overlapping words; it is deterministic in rank but wraps according to viewport and font. Position and colour have no quantitative meaning. Because the size scale resets for each scope, use exact counts and per-1,000 rates to compare years.
- **Sunburst:** root → academic year → five most frequent forms in that year. A leaf’s angular share is its count divided by the sum of all displayed top-five counts. A year’s sector sums those five leaves. The centre is that restricted total; it is **not all retained tokens**. Repeated words in different years remain separate leaves. Selecting a year redraws the chart with only that year. No unshown-word remainder is included. Exact ties resolve alphabetically; exactly five forms are kept when available.
- **Table:** each displayed form has its occurrence count, occurrences per 1,000 of **all retained tokens in its year/scope**, and a keyboard-accessible button to inspect contributing posts with their current credit evidence. Rates and sunburst angular shares have different denominators, identified above.

The table supplies the full displayed information without relying on colour or small SVG labels. Hover/focus names each outer sector; exact tables retain every leaf even when its visual label is too small. Buttons and native selects support keyboard operation. No animation is introduced. Formal screen-reader and participant testing remain unperformed; the existing limited/TBD human-evaluation status remains unchanged.

## Interpretation and attribution

Raw counts weight longer posts more heavily. A larger wedge or word is not evidence of greater institutional impact, consensus, prevalence among all 421 posts or greater individual productivity. Year differences may reflect publication volume, genre, author mix, exclusions, custom stopwords and partial-year coverage. These frequencies remain separate from MALLET’s fitted topics, dictionary signals and the selected essay interpretation.

**Human:** Ian G. Williams requested the subtab, corpus/year toggles, top-five annual sunburst and methods explanation (CRediT: Conceptualization; Project administration). This does not establish that he executed or checked the calculations or approved all implementation choices.

**AI:** OpenAI Codex (exact model/build not recorded) wrote the aggregation and rendering code, drafted this explanation and ran recorded checks. GAIDeT saved mappings: Code generation `0000017`; Data analysis `0000026`; Visualization `0000027`; Validation `0000023`; Text generation `0000030`; Identification of limitations `0000046`. Python computes saved token counts; NLTK produced the inherited cleaned text and MALLET produced other, unchanged topic outputs. The model does not supply numerical observations itself. Original writers retain source-text credit and are not presumed to endorse these displays.

`test_words.py` independently recomputes all scopes from cleaned files and checks populations, sums, stopwords, ordering and contributing IDs. The detailed task/check record is in the project work log; automated and agent browser checks are not human user evaluation.
