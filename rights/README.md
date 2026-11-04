# Source-rights evidence, not a blanket license

Ian G. Williams selected MIT for original project code, documentation and analysis on November 3, 2026. The project can license only rights it holds. Original source texts, quotations, adaptations, media and third-party resources retain separate terms. Read the root `NOTICE.md` and `LICENSE` together.

`build_rights.py` uses the original XML and reviewed `records.json`. It checks the exact export SHA-256 before extracting `cac_cc_license` verbatim for all 430 category records. It does not alter authorship, membership, the corpus or fitted analyses. It also scans published source-item content/excerpts for license URLs and Creative Commons mentions, plus five identified attachment/revision captions (3646, 4141, 5605, 20647, 23853). These extra contexts are not added to the article population. Generic discussions are retained as mentions, not permission. The extractor intentionally does not follow external links or infer missing license versions.

Outputs: `source_rights.json` and `../SOURCE_RIGHTS.html`. Source links are omitted for drafts. The ledger publishes no author email or raw private export. Recorded credit strings retain the reviewed register’s uncertainty; account-only credits are not verified writers. All 430 titles and recorded credits remain discoverable alongside evidence status.

Run from the repository root:

```sh
python3 analysis/rights/build_rights.py
python3 -m unittest discover -s analysis/rights -p 'test_*.py'
```

The default export path is Ian’s supplied Downloads file; provide another path as the first argument if needed. A changed export requires a new explicit source review rather than changing the hash to bypass the guard. Inspect license context as well as test results. These automated checks verify inventory structure and preservation, not legal ownership, a complete audit of remote assets or permission to reuse a particular third-party work.
