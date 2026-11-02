# Every record, its scope and its authorship evidence

Start with `../ARCHIVE_COVERAGE.html`. This page and the CSVs explain why a record is included or excluded and how strongly its writer credit is supported.

- `export_item_accounting.csv`: all 857 XML items; revisions and attachments are not extra articles.
- `ordinary_posts_accounting.csv`: all 436 ordinary posts, including six outside the Tagging the Tower category. Private-post details are withheld.
- `article_review_ledger.csv` / `.json`: all 430 category records, with writer credits, posting account, evidence, review disposition and model/body-analysis inclusion.
- `coverage_audit.json`: population totals and completed consistency checks.

**Source-supported** means accepted evidence was checked in a byline, author field, guide row, source biography or explicit named article reference. It is not personal author confirmation. **Declared-credit** means a name is recorded in source metadata or author taxonomy without a separately established byline. **Unresolved-account** means the account remains the only basis for a writer credit.

Every record has a decision; not every writer is established. In the 421 published records, the current dispositions are 52 source-supported, 120 declared-only and 249 unresolved. Nine draft records remain metadata-only. Completeness is within this export, not proof that every historical post was exported or correctly categorized.

Run `python3 analysis/build_coverage.py --verify-views` from the project root after rebuilding. It checks exact ID sets rather than counts alone, saved author columns, all five models, every dataset embedded in the actual index.html, the compatibility copy, reading copies, themes, contributor register and selected interpretation sources. It does not refit models or silently repair mismatches.

The 299-post fitted corpus and weights remain frozen. The browser can recompute summaries and word counts for the narrower source-supported subset. A changed denominator must travel with the result. The source-supported index/network filter excludes author-taxonomy-only declarations as well as account-only credits. Drafts and curated records remain excluded from the local author–year network.

The named-reference decisions are in `../attribution_revision/cross_reference_decisions.json`. References to workshop leaders, cited authors or project creators are not automatically article bylines; repeated welcome-page lists are one inherited source family. Ian directed this review; Codex performed the source checks and implementation. No independent human verification is claimed.
