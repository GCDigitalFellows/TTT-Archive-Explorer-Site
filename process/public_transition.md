# Approved public-interface transition · November 4, 2026

Ian G. Williams explicitly approved promotion of Welcoming pathways, private archiving of the previous interface and continued public access to research documentation. Publication approval does not certify every authorship record, calculation, interpretation or accessibility claim.

## Preserved release and rollback

The private snapshot is `archives/public-site/2026-11-04-before-welcoming-pathways/site/`, copied byte-for-byte from public commit `82d7a089c9dc1502964a3444fe4805ed05d3a81a`. Its source/build revision is `aa1405678637742df5e1ba4e62615496d534cdb9`. Its `manifest.json` records SHA-256 hashes for all 389 files. The archive is outside `analysis/`, and the public manifest rejects private archive inputs explicitly. Original license/rights notices and all source/build Git history are retained.

For rollback, prepare a fresh staged release from that snapshot, compare it with intervening contributions, review the resulting changes, then commit and publish normally. Do not reset or force-push. Absolute external links in the frozen snapshot may point to later live pages. The source commit restores corresponding builders; raw XML and external NLP dependencies remain separately required. Prior public Git history is not erased by this transition.

## Active source and public release

The active frontend stays at `analysis/reviews/mockups/welcoming-pathways/` to retain evidence references and tested builders. Historical names such as `build_prototype.py` and internal element IDs are implementation details, not public draft status. Private `analysis/index.html` and `interactive_explorer.html` remain internal research-evidence products read by the new projection builder. They are not republished as the main interface.

`scripts/public_release_manifest.json` enumerates the exact permitted source-to-destination mappings. It promotes the active frontend to public `index.html`, retains linked methods, rights, credits, record accounting, model/research reports, pinned inclusive-design provenance and source artifacts needed by those references. It excludes private archives, prior interactive templates/fragments, historical mockup apps, raw corpora, tests and model binaries. No wildcard release copying is used. New public files require an explicit reviewed manifest entry and same-change attribution.

The packager rebases HTML/Markdown links into the public layout. Existing research code files outside the release remain links to private source rather than silently copied. Research guides with earlier interface instructions receive a clear notice linking the current PUBLIC_GUIDE.html. The main page is titled Tagging The Tower Archives Explorer and described as a working research demonstration; human-verification, uncertainty, source-credit and rights qualifications remain.

To build a fresh staged release from saved evidence:

```
python3 analysis/reviews/mockups/welcoming-pathways/build_prototype.py
python3 scripts/prepare_public_site.py /tmp/ttt-new-reviewed-release
```

The packager creates a new directory and never removes another checkout. Compare a staged release with the latest public remote before synchronization. Preserve concurrent compatible edits in source/packaging before regenerating. Removing obsolete deployment files is part of the specifically approved transition; the snapshot and public Git history preserve them.

## Bookmarks and navigation

- Old `interactive_explorer.html` and the earlier draft address are compatibility redirects to the current main page, preserving URL query/fragment text.
- `#view=overview` opens Start here; `index` opens Browse; `reading` opens What the archive suggests; `themes`, `topics`, `language` and `checks` open Analysis & networks; `random` draws a published post.
- Prior `methods`, `credits`, `history`, `reports` and `audit` views reach retained methods, credit, history, reporting and accounting documents. Research pages retain a route back to the current main explorer.
- New `#view=read&post=19756` bookmarks open the published post by ID. Invalid/unavailable post IDs fall back to Browse with an explanation. Draft IDs never open reader bodies.
- Known design years remain optional bookmark settings. Normal navigation serializes only view, post ID and design year; author/search filters are not silently placed in URLs. Explicit inbound `q`, `year` and `author` parameters are recognized from fragments.
- In-page skip links remain in the active view. Browser history responds to route changes; source reading preserves its existing return controls.

Old topic/control-specific selections have no exact equivalent in every simplified view; those bookmarks open the relevant analysis route without claiming to reproduce the old full interface. No model fit, source-author merge, publication scope or appointment rule changes.

## Attribution, verification and limits

Human — Ian G. Williams approved this concrete transition, private archiving, public research documents and publication. CRediT: Project administration; Methodology. This is design/deployment direction, not personal execution of code, tests, an accessibility study or approval of all research claims.

AI — OpenAI Codex created/hashed the snapshot, implemented the explicit manifest, link rebasing, compatibility routes, release labelling, documentation and tests, and performed recorded browser/packaging/deployment checks. Exact model/build unknown/not recorded. GAIDeT saved mappings: Code generation 0000017; Data curation and organization 0000025; Validation 0000023; Reproducibility testing 0000028; Text generation 0000030; Proofreading and editing 0000031; Identification of limitations 0000046. Wayfinding-navigation and decision-documentation skills informed route preservation and decision records. Actual results and limits belong in `public_transition_validation.json` and the matching work log; no participant or screen-reader session is implied.
