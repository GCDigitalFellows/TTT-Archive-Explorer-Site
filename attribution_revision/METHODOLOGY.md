# Rechecking author credits against the article text

This correction addresses missing authors in the searchable archive and its author–year network. It changes attribution and attribution-dependent summaries. It does not turn every person named in an article into an author.

## Evidence and decisions

All 430 category records were scanned from the original XML. The opening-review ledger records the first three published text paragraphs (up to 1,000 characters), existing credits, posting accounts, corrected credits, and evidence status. A separate candidate scan examines the first six text paragraphs for common byline forms, including `By Name`, `By: Name`, guest introductions, and explicit “written by” declarations. HTML comments and formatting are stripped before inspection. This candidate scan is a review aid, not an automatic person-recognition or authorship classifier.

The review also inspected explicit authorship language throughout the local bodies and name-like emphasized headings. It identified signed first-person sections in two collective articles. Signed sections can occur well after the opening paragraph: limiting extraction to the first sentence would miss contributors such as Angela Crumdy. The accepted ledger contains 22 reviewed body-credit records, including credits already recovered in earlier versions. Eight records have changed names in this revision.

Each accepted credit has literal supporting quotations in `reviewed_credits.json`. The inventory builder asserts that those quotations occur in the source text. `credit_changes.csv` lists old and corrected credits with article URLs. `opening_review.csv` makes the full record-by-record scope inspectable. `byline_candidates.csv` records accepted candidates and rejected narrative/source-reference matches. This is an agent-assisted qualitative review, not independent human double-coding, exhaustive identity verification, or a guarantee that all historical authors have been recovered.

## Attribution rules

1. An explicit byline or signed first-person contribution takes precedence over a WordPress posting account. The account remains separately recorded.
2. A collective article credits its named writers, not every participant, interview subject, person thanked, workshop instructor, photographer, or cited author.
3. For the 2013 collective reflection, the six signed sections identify Andrew McKinney, Erin Glass, Laura Kane, Micki Kaufman, Keith Miyake, and A.L. McMichael. Andrew’s credit uses the existing directory form `Andrew G McKinney`; the quoted section name is preserved. `A.L. McMichael` stays as printed rather than silently inferring or merging a full identity.
4. Kelsey Chatlosh’s introduction and Angela Crumdy’s signed contributed account are both credited in the digital-forensics article. Librarians named as helpers are not assigned article authorship.
5. Source-linked/curated items retain source-author metadata separately from the curator’s posting account. Body names identifying the author of a linked work are not automatically authors of the local summary.
6. When no explicit body credit or author taxonomy resolves the record, account-based attribution remains **provisional**. In this export, 273 published local posts remain in that category. Concentration under an account, especially for older imported items, is not proof that the currently named account holder wrote them historically.
7. Article authorship does not establish fellowship membership. Only the existing same-semester roster evidence can supply that match. Correcting two 2022–2023 guest posts removes their inherited Rebecca Krisel cohort matches; their writers remain unconfirmed by that roster evidence, not proven non-fellows.

## What was rebuilt

The inventory, contributors-by-year table, body-text signal attribution, NLTK corpus-manifest credits, document-topic author fields, cohort-match summaries, roster-subset topic averages, related figures, reading copies, index, and network use corrected metadata. The network defaults to **all authors**, fixing the separate display limitation that initially showed only the top 20. Its full published-local population grows from 60 to 70 credited name strings. These counts are names in the evidence, not a verified census of distinct historical people.

The index and reader show credit basis and expandable body-credit quotations. An index evidence filter can restrict results to explicit body credits or author-taxonomy credits. The network follows that selection. The all-credits view retains provisional accounts visibly rather than hiding records whose authors remain uncertain.

## What was held fixed, and why

The 299-document NLTK corpus, cleaned words, vocabulary, five fitted MALLET models, and per-post topic weights are frozen for this **attribution-only correction**. Correcting author names does not itself require new topic fitting. Topic-by-year values remain identical; author filters and roster subsets are rejoined and recalculated from those same per-post weights. No new NLTK/MALLET execution is claimed for the button or this revision.

Some originally unrecognized bylines may remain in the historical cleaned corpus. This revision does not retroactively claim otherwise. A future cleaning revision that removes those additional bylines should use a new corpus version, refit the models, and review topic labels and comparisons anew. Running the full NLP recipe again after these credit corrections may change its author-aware byline removal, so it is a new analysis run, not reproduction of the frozen fit. The preserved saved input and model outputs identify the fit displayed here.

The pre-correction reference files are preserved under `before/`. The original readability baseline is retained. The revision-change ledger records intentional changed fingerprints and reasons; verification reports unchanged results separately from documented corrections, rather than claiming that all old files still match.

## Reproduce and review

From the project folder:

```sh
python3 analysis/analyze.py
python3 analysis/audit_author_credits.py
python3 analysis/deeper_text.py
```

Review the attribution ledger and the roster-subset changes before updating the interpretation fingerprint. `nlp_report.py` deliberately rejects changed editorial input files until their relationship to the existing interpretation is reviewed; the record for this revision explicitly says an agent checked metadata-only joins and does not claim a new human review. Then rebuild the presentation and run the current checks:

```sh
python3 analysis/build_interactive.py
python3 -m unittest discover -s analysis/attribution_revision -p 'test_*.py'
node --test analysis/interactive/test_index.js analysis/interactive/test_core.js analysis/design/test_styles.js
python3 analysis/verify_revision.py
```

Editing the accepted ledger should trigger another review of downstream attribution and cohort summaries. It is not permission to overwrite numerical checks or silently accept any changed model file.
