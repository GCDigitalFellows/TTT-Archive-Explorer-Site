# Source-credit review: accounts, writers and curators

Updated November 2, 2026 after Ian G. Williams identified a wrong credit on **Linked Data for the Uninitiated (Part 1)**. This is an agent-executed attribution correction under Ian’s direction, not independent human verification.

## What was checked

All 430 category records were screened for author-related XML fields and credit signals throughout their normalized bodies. The screening table records fields, candidate counts, posting accounts and final evidence status. Draft body text is not distributed. The full-body context list is a candidate-finding aid: references, OCR examples and narrative mentions do not automatically establish authorship.

The earlier November 1 review recovered opening bylines and signed sections but did not use the separate `author_name` field. The November 2 review adds metadata and source-biography checks, current-version revision notes and institutional-guide evidence. Accepted decisions are in `reviewed_credits.json`; the extractor checks each against its actual evidence location. The preserved November 1 ledger and pre-November-2 inventory support comparison without resetting the original baseline.

## November 2 name corrections and broader evidence review

- McMichael: both linked-data posts, Organizing Image Collections handout, Intro to Data Cleaning and Visualization Tools Handout, and DH and Design.
- Keith Miyake: Databases for Smart People Who Are Scared of Databases.
- Jeff Binder: Finding Digital Archives.
- Stefano Morello **and Olivia Ildefonso**: the fall-2020 GCDI is Here for You! revision.
- Sam O’Hana: the curated Password Management record, identified by its embedded source-author biography.
- Rebecca Krisel: the curated Building Your First Database in SQL record, identified by its embedded source-author biography.

The seven historical replacements are supported by the [GCDI Fall 2020 Open House guide](https://raw.githubusercontent.com/GCDigitalFellows/workshop-resources/master/GCDF_OH2020.pdf), page 23. The rendered page was visually inspected, and its title/author rows were transcribed into `institutional_guide_credits.json`; its source hash and page image are retained. The linked-data posts also contain explicit saved `author_name`/`item_author` metadata naming A. L. McMichael. These matching titles support grouping McMichael spacing variants; raw strings remain preserved.

The subsequent coverage review adds four writer corrections through explicit named references with matching target links: Rachel Rakov for the Python problem-solving post, Micki Kaufman for The lost art of spaghetti, and Keith Miyake for the ArcGIS StoryMaps and CartoDB guides. Five same-name article references also strengthen existing credits. Each accepted reference is checked against the source post and target URL; repeated welcome-page lists are one inherited source family, not independent confirmations. Contextual mentions and workshop/project credits were rejected as article authorship. See `cross_reference_decisions.json`.

## Rules and remaining uncertainty

Explicit current-post credits outrank a posting account. The posting account, original author taxonomy and raw source-author field remain separate. A biography embedded in an imported source article identifies the source writer, not the curator or necessarily the local summary writer. Earlier-version authors and image artists remain in the revision note; they are not automatically coauthors of every subsequent version. Body mentions, cited authors and OCR sample bylines are not accepted as current article credits.

249 published local/unflagged records still use provisional posting-account attribution. Among these are 50 older records under Sam O’Hana’s account. Their historical writers have not been established; no replacement names were guessed. Some cached live account headers conflict with saved source evidence, and direct requests encountered HTTP 403. Live headers were not accepted alone. The unresolved ledger is a research queue, not a claim that each named account is wrong. The archive-wide review does not guarantee complete author recovery.

There are 71 grouped published-local names (72 raw spelling strings) and 162 grouped human-name entries in the broader register. These are credit labels, not verified headcounts. Authorship does not establish fellowship membership; only the existing same-semester signed-list evidence supplies that match.

## What changed and what stayed fixed

Current inventory, author/year summaries, source-author register, body-signal credit columns, model-manifest author labels, document-topic author labels and roster-subset summaries are rebuilt from accepted credits. The index, reader, thematic author displays and network use corrected/grouped names. The reviewed-credit filter accepts body, metadata, institutional-guide and source-biography evidence alongside author taxonomy; account-only attribution remains excluded by that filter.

The 299-document cleaned corpus, vocabulary, five fitted MALLET models and per-post topic weights remain unchanged. Rejoining credits does not refit NLTK/MALLET. Some newly recognized credit text may remain in the historical cleaned corpus; changing the cleaning rules would require a separate corpus version and model review.

`record_checks.py` independently verifies that only attribution-related columns and aggregates change before recording new fingerprints. `verify_revision.py` checks those against the retained original baseline. Original `before/` snapshots are historical evidence and must not be used as the current inventory.

## Reproduce

```sh
python3 analysis/analyze.py
python3 analysis/review_source_credits.py
python3 analysis/audit_author_credits.py
python3 analysis/attribution_revision/record_checks.py
python3 analysis/build_interactive.py
python3 -m unittest discover -s analysis/attribution_revision -p 'test_*.py'
python3 analysis/verify_revision.py
```

`review_source_credits.py` joins current author labels into `body_text_signals.csv` while preserving every other column; the independent record check enforces this. Do not reset the model baseline or silently accept changed fitted values. The private source repository contains review scripts; the separate public website contains browser-ready output and evidence. Both correction commits use Ian’s requested message, `error correction in source data`.
