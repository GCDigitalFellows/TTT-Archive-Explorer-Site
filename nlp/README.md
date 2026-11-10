# Reproduce the NLTK/MALLET analysis

For a guided reading before installing anything, start with `../REVIEWER_GUIDE.html`. For short examples to share in a talk or workshop, use `../SHAREABLE_WALKTHROUGH.html`. The runnable `../explain_analysis.py` demonstrates the actual word-selection function and reads one saved result without training MALLET.

The analysis uses NLTK 3.10.4, MALLET 2.0.8, and Java 8. The pinned Python environment is in `requirements.txt`. The original export must be available locally; its SHA-256 appears in `nlp_audit.json`. The `records.json` beside the scripts supplies audited publication, attribution, curation, and cohort metadata.

Run from the project root:

```bash
python3 -m venv .venv-nlp
.venv-nlp/bin/python -m pip install -r analysis/nlp/requirements.txt
```

Download the official [MALLET 2.0.8 archive](https://mallet.cs.umass.edu/download.php) and unpack it into `tools/mallet-2.0.8`, or set `MALLET_HOME` to that installation. Java must be available as `java`. This release was selected to use the Java runtime already on this computer. It is not a claim that 2.0.8 is the latest MALLET release.

NLTK requires the official data packages `stopwords`, `wordnet`, `averaged_perceptron_tagger_eng`, and `punkt_tab`, in `.nlp-data` at the project root. They can be installed with:

```bash
.venv-nlp/bin/python -m nltk.downloader -d .nlp-data stopwords wordnet averaged_perceptron_tagger_eng punkt_tab
```

The original run downloaded those same packages from the official `nltk/nltk_data` repository and extracted them locally. Set `WORDPRESS_XML` if the XML is not at the original location recorded in the script. Then run:

```bash
.venv-nlp/bin/python analysis/nlp_pipeline.py
.venv-nlp/bin/python analysis/nlp_report.py
python3 analysis/package_report.py nltk_mallet_report.md
```

In the downloaded bundle, arrange its `Tagging_The_Tower_Archives_Explorer` directory as `analysis` within a project root before using these commands, or adjust the script paths accordingly. Neither source XML, external Java/MALLET binaries, NLTK resource packages, nor the Python environment is included in the bundle. They are dependencies, not analysis results.

The main pipeline trains five models: k=6/8/10 at seed 42, plus k=8 at seeds 1729 and 99. Each uses 1,000 iterations, one thread, initial total alpha=1.0, initial beta=.01, and hyperparameter optimization every 50 iterations after iteration 200. The primary overview is k=8, seed=42. The ten-topic run has higher in-sample document NPMI; eight is not declared optimal.

The official Java classes are invoked directly because the distributed shell launcher's unquoted paths fail when the project path contains spaces. The model implementation remains MALLET. The scripts do not call an external inference service or substitute another LDA implementation.

`cleaned_text` contains stopword-filtered lemmas before document-frequency pruning. `mallet_input.tsv` additionally restricts vocabulary to terms in at least three and fewer than 80% of included posts. `readable_text` preserves contextual words, including negation. `corpus_manifest.csv` is authoritative for inclusion; 301 of 423 published posts enter the main model. Curated posts, welcome messages, and very short items remain accounted for separately.

Phrase frequencies and concordances are generated with NLTK. Some normalized phrases look unnatural because plural nouns are lemmatized. Model topic IDs have meaning only within their own run. Interpretive labels apply to the primary run and should be reviewed if preprocessing, corpus membership, or model settings change.

The reviewer revision separates the main settings into `../nlp_settings.py`, chart creation into `../nlp_figures.py`, and the agent-drafted interpretation into `interpretation_template.md` and `topic_labels.json`. Each analysis script has named steps and a `main()` entry point. Importing one does not launch the analysis.

The reporting script checks `interpretation_review.json` before reusing the narrative. If model outputs change, review both the template and labels, then deliberately record that review with:

```bash
.venv-nlp/bin/python analysis/nlp_report.py --record-reviewed-interpretation
```

This records a new evidence fingerprint; it is not a model-quality test. The independent `../verify_revision.py` checks the original 43-file baseline while allowing the nine documented attribution/cohort corrections. A legitimate new analysis will differ from that reference and should be kept as a separate run rather than relabeled as the old one.

## Review-status clarification, November 2, 2026

Saved topic labels and narrative were agent-developed. A review fingerprint or file named theme_coding.csv does not establish independent human coding or human approval. See ../WORK_LOG.html for the distinction between automated numerical checks, agent source review, simulated audience critique and actual human participation. The current interface can be rebuilt without retraining the historical model.

## Proposed next analysis

See the [additional LDA plan](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/docs/research/lda/PLAN.md) and its primary-source bibliography. It preserves these fitted outputs and proposes isolated, versioned experiments; it does not authorize running this pipeline to overwrite them.

## Active November 9 refresh

The active source is a hash-recorded composite, located through `analysis/source_snapshot.json`. The earlier 299-post models remain privately preserved under `archives/research/2026-11-09-before-corpus-refresh/analysis/nlp/`; active `analysis/nlp/` holds five new fits on 301 posts. Three historical cleaned files lose ten residual byline/bio tokens under the existing rule, documented separately from the two new posts. Topic numbers changed; provisional labels were matched and checked against leading words. This is Codex review, not independent human coding. See the refresh report for fingerprints and checks.
