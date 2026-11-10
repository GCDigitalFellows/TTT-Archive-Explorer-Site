# Tagging The Tower Archives Explorer

Research/examination-first working release, November 2, 2026. Open **index.html** in a browser. It is the package front door; interactive_explorer.html is a compatibility copy of the same app. Data and code are embedded: no JSON fetch or internet connection is required for local views. Direct file execution could not be tested with the restricted browser tool; see the validation record. Original post links require internet access. Keep companion documents alongside the app for methods and downloads.

Project direction and correction contact: Ian G. Williams, ian.williams52@gc.cuny.edu; GitHub profile https://github.com/perlsdiver. This is an AI-drafted/developed research companion; institutional endorsement and complete human approval are not established. See WORK_LOG.html and CREDITS_AND_PROCESS.html.

## Inspect and check the saved package in three commands

From this package directory, with Python 3 and Node installed, in separate terminal commands:

```sh
python3 verify_revision.py
node --test interactive/test_core.js interactive/test_index.js interactive/test_navigation.js themes/test_themes.js design/test_styles.js
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/index.html. The last command serves locally until stopped. The app is built for direct file opening too, but this revision’s browser tool blocks file:// URLs, so actual file-mode execution remains an explicit manual check. HTTP browser checks and static embedded-data checks are recorded in process/validation.json. These commands check and serve saved results; they do not reproduce a full NLP fit.

## Rebuild the interface

The standard-library builder is build_interactive.py. It needs the original export for reading copies. Set WORDPRESS_XML to your local XML path. Source XML, the Python environment, Java, MALLET binaries and NLTK resource packages are not distributed in this package.

## Reproduce the NLP analysis as a NEW run

Read nlp/README.md and REVIEWER_GUIDE.html for setup. The saved run used NLTK 3.10.4, MALLET 2.0.8 and Java 8. Five fitted models compare k=6/8/10 and seeds; the primary display is k=8, seed 42, not an assertion of optimality. Requirements are pinned in nlp/requirements.txt. Full retraining runtime was not benchmarked in this revision. Do not overwrite the historical results to make a new run look identical: preprocessing and attribution corrections have evolved.

The NLP guide uses a parent project containing this folder as analysis/, external tools/ and NLTK data. Rename/place this directory accordingly or adjust its documented paths. A full environment setup cannot honestly be reduced to the three inspection commands above.

## Current versus historical data

records.json and post_inventory.csv preserve the current audited source credits. identity/grouped_records.json adds supported alias grouping without changing source strings. nlp/corpus_manifest.csv defines the modeled population. attribution_revision/before/ is a preserved audit snapshot, not a competing current inventory; do not rename or modify it, because preservation checks depend on it.

## Limits and reuse

Local/unflagged is a detection category, not proof of authorship; many account-based credits are provisional. Signed lists are incomplete active-team snapshots, not full appointment histories. Twenty-one purposive reading examples are not representative or causal evidence. Images and embeds are not analyzed as prose. Simulated AI reviews are not human user testing. Complete independent human validation is not documented.

See METHODS_AND_DATA.html, DATA_GUIDE.html, ACCESSIBILITY.html, CORRECTIONS.md and REUSE_AND_CITATION.html. Original project code, documentation and analysis are MIT-licensed to the extent project rights permit; source works retain separate rights. See LICENSE, NOTICE.md and SOURCE_RIGHTS.html.
