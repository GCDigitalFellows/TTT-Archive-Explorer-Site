# A reader's guide to the Tagging the Tower analysis code

You do not need to be an experienced NLTK or MALLET user to review this analysis. Start with the decisions, the evidence tables, and the small demonstration. Read the model-fitting code after you understand what was included and what a topic weight means.

The figures now also have an [interactive explorer](interactive_explorer.html). Its [usage and code guide](INTERACTIVE_GUIDE.html) explains which filters recalculate which values, how the different corpus populations are kept separate, and how the new calculations are checked against saved results.

This revision reorganizes and explains the existing analysis. It does not change the study's exclusions, stoplists, model settings, or interpretations. The companion `verify_revision.py` compares 43 saved result files with their contents before this revision. See `review_verification.txt` for the completed comparison.

The explorer now also includes fifteen adjustable design presets (2012–2026). Read the [design methodology and linked evidence](STYLE_METHODOLOGY.html), then the [appearance-code guide](design/README.md). Appearance controls are separate from the corpus and topic calculations.

## Choose a reading route

| Your purpose | Start here | What it gives you |
|---|---|---|
| Explain the analysis in a meeting | [Shareable walkthrough](SHAREABLE_WALKTHROUGH.html) | Short code examples, plain-language explanations, and important limits |
| Check the corpus and attribution | [analyze.py](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/attribution_revision/before/analyze.py) and `post_inventory.csv` | Published versus draft, writer versus posting account, curation, and membership evidence |
| Understand the earlier keyword analysis | [deeper_text.py](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/attribution_revision/before/deeper_text.py) | Analyst-written dictionaries, matching text, and observed links between posts |
| Review cleaning and model decisions | [nlp_pipeline.py](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/attribution_revision/before/nlp_pipeline.py) | Named steps from article bodies to NLTK results and MALLET topic mixtures |
| Locate the main numerical choices | [nlp_settings.py](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/attribution_revision/before/nlp_settings.py) | Annotated thresholds, model runs, and sampling settings in one small file |
| Check how charts were made | [nlp_figures.py](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/attribution_revision/before/nlp_figures.py) and [nlp_report.py](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/attribution_revision/before/nlp_report.py) | Chart inputs, denominators, seed comparisons, and author sensitivity |
| Review the human interpretation | [Interpretation template](nlp/interpretation_template.md) and `nlp/topic_labels.json` | Editable prose and topic names, kept separate from model fitting |

If you are reading the downloaded bundle, its top-level folder contains these files. To rerun the scripts using the commands below, place that folder at `analysis` inside a project folder, as explained in [the setup README](nlp/README.md).

## The workflow in ordinary language

The analysis has three different layers. The inventory establishes what the records say about posts and people. Keyword searches make explicitly chosen language patterns inspectable. NLTK and MALLET then provide additional ways to examine the bodies. These layers support one another, but they answer different questions.

| Step | Function or file | Receives | Produces | What a reviewer should inspect |
|---|---|---|---|---|
| Audit records | `analyze.py` | Original WordPress XML | `records.json`, inventory, cohort evidence, counts | Are drafts and curated items separated? Are credited writers distinct from posting accounts? |
| Read article bodies | `load_documents()` | XML plus audited metadata | Paragraphs, dates, credits, and welcome flags | Are references, captions, and unusual HTML extracted as intended? |
| Select and clean | `prepare_corpus()` | Published post records | Readable text, filtered words, and an exclusion ledger | Is a meaningful group of posts being excluded or altered? |
| Choose vocabulary | `build_vocabulary()` | Cleaned words | Word counts, excluded vocabulary, and the shared MALLET input | Which rare or widespread words disappear? |
| Examine language | `analyze_lexicon()` | Words, sentences, and document IDs | Phrase associations, concordances, and period contrasts | Do phrases occur across several posts? What do surrounding sentences say? |
| Fit topic models | `train_models()` | The same model input for every run | Five numbered sets of topics and post mixtures | Do different topic counts and starting seeds change the groupings? |
| Compare and summarize | `compare_random_seeds()` and `summarize_topics()` | Model outputs and metadata | Seed comparisons and year/cohort tables | Are topic numbers aligned? Which denominator does each table use? |
| Draw and interpret | `nlp_figures.py` and `nlp_report.py` | Saved numbers and human labels | PNG/SVG charts and the written report | Does the prose make a stronger claim than the numbers support? |

The `main()` function at the bottom of each script lists its steps in order. A function is simply a named section of work. Importing these scripts makes their functions available; it does not launch an analysis or train MALLET.

Some compact names remain in the numerical sections. This key helps connect them to the evidence:

| Name in the code | Meaning |
|---|---|
| `main` or `main_posts` inside a processing function | The list of included post records; distinct from the entry-point function `main()` |
| `d` or `r` in a loop | One document or table row |
| `tokens` | Stopword-filtered lemmas for one post |
| `model_tokens` | Those lemmas after the additional vocabulary-frequency filter |
| `freq` | Word-occurrence counts |
| `df` | How many distinct posts contain each word |
| `vocab` | The set of distinct words retained for MALLET |
| `primary["tops"]` | Leading words for each topic in the primary run |
| `primary["docs"]` | Each post ID's array of topic weights |
| `primary["phi"]` | A numerical table of topics by word probabilities |
| `cohort_link` | Credited names supported by same-semester roster evidence; an empty string means no confirmed match |

## The three versions of the text

**Readable text**, in `nlp/readable_text`, removes common web formatting but preserves ordinary wording, including negation. It supports close reading and contextual checks. It is still a cleaned extraction, not a replacement for the original XML or live page.

**Stopword-filtered text**, in `nlp/cleaned_text`, contains normalized words after stopword and length filtering. This is intentionally lossy. It helps count words, but cannot establish an author's position. Removing “not” can reverse what a sentence appears to say.

**Model input**, in `nlp/mallet_input.tsv`, additionally omits vocabulary present in fewer than three posts or at least 80% of included posts. Each line is a post ID, a generic label, and its words. The generic label is not a theme and does not supervise MALLET. The same input is used for every model run.

## Decisions worth reviewing closely

**Corpus membership.** Of 421 published category posts, 96 curated/source-linked items, 18 welcome messages, and 8 posts with fewer than 30 cleaned tokens are excluded from the main model. That leaves 299. The threshold addresses sparse text, but may remove useful handouts or announcements. Open `nlp/corpus_manifest.csv` to see each decision. A non-empty exclusion field is an explanation, not a judgment that the post lacks value.

**Stopwords.** The exact lists are in `nlp/stopwords_english.txt` and `nlp/stopwords_custom.txt`. The custom list is defined in `prepare_corpus()` so that the written lists are generated with the run. It removes site labels, markup fragments, and several low-specificity words. Review whether those removals also erase a concept important to your research question. English stopwords do not adequately handle multilingual material.

**Word normalization.** A token is one counted word occurrence. A lemma is a normalized word form: for example, “workers” becomes “worker.” NLTK guesses grammatical roles to help normalize words. Those guesses can fail in technical code, names, or multilingual writing. Normalization can also produce awkward phrases such as “social medium.”

**Repeated language.** The pipeline looks for exact paragraphs of at least 30 words appearing in five or more eligible posts. It found none after welcome-message exclusions. This does not mean all repeated or templated language has been removed; paraphrases and shorter repetitions can remain.

**Phrase boundaries.** Phrase analysis begins with sentence-level words before stopword filtering. Otherwise “data about the collection” could accidentally become “data collection.” The current procedure does not join across removed stopwords. It does remove punctuation, so lexical adjacency can span punctuation within a sentence.

**Authorship and membership.** The model does not decide who wrote a post or who was a fellow. It uses the earlier audit's evidence. Membership matches require a credited writer and same-semester roster evidence. A collective post is included in the matched subset if at least one writer matches. Missing evidence does not establish that a writer was not a fellow.

## Read the model without overreading it

MALLET's LDA model looks for word patterns and represents each post as a mixture of them. It does not read arguments as a person would. It cannot decide whether a writer endorses a technology, criticizes it, or quotes someone else discussing it.

The primary overview has eight topics at seed 42. The other runs use six and ten topics at seed 42, and eight topics at seeds 1729 and 99. A random seed makes the starting choices repeatable. It does not make the interpretation uniquely correct. One thread helps repeat this particular computation. Topic IDs are arbitrary across runs; Topic 1 in one run is not automatically Topic 1 in another.

Alpha and beta are smoothing settings: they keep the model from making overly sharp assignments based on limited observations. The initial values are later adjusted during training. An iteration is a repeated sampling pass. These settings are documented in `nlp_settings.py`; beginners do not need to change them to inspect the saved results.

**Topic labels are editorial.** Names such as “AI, access & sociotechnical power” were assigned after examining leading words and representative posts. They are stored in `nlp/topic_labels.json`, outside training. The interpretive prose is in `nlp/interpretation_template.md`. Double-braced placeholders in that document are filled with computed tables and counts; the surrounding prose is human-authored.

**Mean weight is not a post count.** A year with a 29% mean topic weight does not mean exactly 29% of posts are about that theme. Each post can contain several mixtures. `mean_post_weight` gives every included post equal influence on the average. `token_weighted_share` gives longer posts more influence. Training itself is based on word occurrences, so long posts still influence which topics are learned.

**Diagnostics answer limited questions.** NPMI measures how often leading topic words appear in the same documents. Diversity measures how much leading word lists overlap. Jensen–Shannon distance compares complete word distributions across seeds; lower means more similar. Jaccard compares overlap in leading word sets. None validates a historical or causal explanation. The eight-topic overview was preselected; it was not declared optimal, and the ten-topic run has the higher NPMI among these trials.

## A practical review using one post

- Find post ID `23845` in `post_inventory.csv`. Compare `creator_name`, `credited_authors`, and `author_evidence`. The account and the writer differ.
- Find the same ID in `nlp/corpus_manifest.csv`. Check its inclusion decision and cleaned token count.
- Compare `nlp/readable_text/23845.txt` with `nlp/cleaned_text/23845.txt`. Notice what is lost in the word list.
- Find it in `nlp/document_topic_weights.csv`. The eight topic columns should sum to one.
- Consult `nlp/topic_labels.json` and `nlp/representative_posts.csv` before naming its leading topic.
- Compare its role in an annual average with the roster-matched subset. A guest writer should not automatically become a cohort member.

This audit path connects a visible chart cell to a post, a cleaned text, an attribution decision, and an interpretation.

## Run only what you need

To check the revision without installing the modeling packages or retraining:

```bash
python3 analysis/verify_revision.py
```

To demonstrate cleaning and inspect one saved post using the existing project environment:

```bash
.venv-nlp/bin/python analysis/explain_analysis.py
```

To validate saved NLP outputs and recreate the extra figures/report, without retraining MALLET:

```bash
.venv-nlp/bin/python analysis/nlp_report.py
```

To rerun everything, use the documented order:

```bash
python3 analysis/analyze.py
python3 analysis/deeper_text.py
.venv-nlp/bin/python analysis/nlp_pipeline.py
.venv-nlp/bin/python analysis/nlp_report.py
python3 analysis/package_report.py nltk_mallet_report.md
```

The original XML and installed software are not included in the download bundle. Setup, package versions, and the `WORDPRESS_XML` and `MALLET_HOME` path options are explained in [the setup README](nlp/README.md).

## What happens if someone changes the analysis?

Changing a stoplist, exclusion, source file, vocabulary rule, seed, or model size creates a different analysis. Review the evidence and labels again rather than assuming the earlier prose still fits. Some tables and overview figures specifically describe the eight-topic study; changing the primary topic count also requires adapting those presentation sections.

`nlp_report.py` checks a saved fingerprint of the outputs used by the interpretation. If those outputs change, it stops before reusing the prose. After reviewing the updated narrative and labels, a reviewer can deliberately record the new evidence with `--record-reviewed-interpretation`. This is a bookkeeping check against stale text, not an endorsement that the interpretation is valid.

The earlier inventory's fixed accounting checks and the before-revision fingerprints describe this export. A new export should be treated as a new run with its own expectations. Do not overwrite the old reference merely to silence a discrepancy.

## Boundaries of this revision

The review-focused code separates steps, expands compressed statements, adds explanatory docstrings, centralizes the main settings, and separates editorial material from computation. The MALLET distribution under `tools` is upstream software and was not rewritten. The earlier code's extraction heuristics, topic definitions, cohort gaps, and English-language limitations remain subjects for substantive review. Improved readability does not resolve those methodological limits.


The **Post index & network** tab adds searchable metadata for all 430 records and a network of published local author credits by academic year. See the [index and network guide](INTERACTIVE_GUIDE.html). Read `interactive/index_core.js` for filtering and edge definitions, and `interactive/post_index.js` for the annotated interface. `interactive/test_index.js` independently checks population boundaries, topic thresholds, and coauthor counting.
