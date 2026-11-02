# Reviewing the project history and methodology page

Open `../PROJECT_HISTORY.html`, or choose **Project history** in the explorer. The history starts with the request to add a searchable post index and author–year network, then follows the author-credit correction, the CRediT/GAIDeT page, and the request to explain this evolution.

## Evidence and scope

`prompts.json` contains exactly four selected user-authored requests retrieved from the project chat **Analyze Tagging the Tower trends**. Its provenance records the thread, turn and user-message identifiers, and recorded turn-start timestamps. Dates on the page use America/New_York. These records establish what was requested, not that an implementation automatically satisfied it.

Only the relevant user prompts were selected for this page. The file is not an export of the full chat or its tool/command records. The thread reader provided identifiers but no supported original-message URLs. Links such as `PROJECT_HISTORY.html#history-prompt-index` therefore open preserved excerpts in the local standalone document. They are not original-chat permalinks. No unsupported app URL scheme or guessed message link is used.

`stages.json` supplies the agent-drafted synthesis connecting each request to implementation decisions, corrections and checks. The narrative distinguishes the initial top-20 display, the 60-name initial network population, and the later 70-name corrected population. It also distinguishes the broader 163-name source register. These are documented snapshots and different scopes, not interchangeable counts of verified individuals.

## How the page is generated

Read `../build_history.py` from `main()` downward. It reads the selected prompts, narrative, corrected inventory and saved model/credit metadata. It derives current scope counts, escapes source text, and writes `page_fragment.html` and the standalone HTML. `../build_interactive.py` rebuilds the credits page first, then the history page, and embeds the same history fragment in the explorer.

The new tab needs no additional runtime package or external assets. The standalone page works without JavaScript. The CSS is scoped to this explanation; normal anchor links connect the narrative to exact prompt excerpts. Draft bodies are not reproduced, and prompt text never executes as HTML.

The page documents decisions and their evidence; it does not rerun NLTK/MALLET, reassign authors, or alter existing analytical selections. The history is not a Git commit log, complete session reconstruction, or independent human audit. Exact earlier model builds and historical identities remain uncertain as stated in the linked attribution pages.

## Review and rebuild

From the project folder:

```sh
python3 analysis/build_interactive.py
python3 -m unittest discover -s analysis/history -p 'test_*.py'
node --test analysis/interactive/test_index.js analysis/interactive/test_core.js analysis/design/test_styles.js
python3 analysis/verify_revision.py
python3 analysis/package_report.py ATTRIBUTION_REVIEW.md
```

The history tests check prompt/stage correspondence, chronological order, verified prompt fingerprints, unique HTML anchors, source-file links, and the scope counts used in the explanation. The existing result checks remain separate. Browser review checks tab switching, prompt jumps, standalone links and narrow-screen layout.

To add a future stage, retrieve its actual request and preserve its wording and provenance. Review the narrative against saved artifacts. Update the scope and tests deliberately; do not silently relabel a later correction as part of an earlier snapshot.

## Current work log

The first four prompt-linked stages remain a historical snapshot. The history now includes a separate current-release work log generated from process/work_log.json. This extends the record through interpretation, contribution disclosure, identity grouping, the landing page, simulated reviews and the research-first revision, without inventing unavailable chat message permalinks. Actual requester decisions and AI execution are identified separately; canonical CRediT/GAIDeT mappings are checked against the profile.


## External review provenance clarification · November 2, 2026

Ian G. Williams identified the supplied review as produced by **Deepseek V4.1 Flash 1017**, running in the **CAIL sandbox in OpenWebUI**, from a **ZIP export of a previous project iteration**. This is distinct from the two Codex sub-agent simulations and Codex implementation work. The model/environment provenance is requester-reported, not independently verified from external session logs. The exact input ZIP filename, hash and iteration identifier are not recorded. The review document’s stated manifest-level inspection limits remain relevant; its recommendations were checked against current source files. None of these simulations establishes actual human user testing.


## Thematic visualization revision

The current work log and contribution profile include Ian’s theme-visualization request and Codex’s data joining, counting definitions, charts, index/network integration, documentation and checks. Eight dictionary categories, six selected-example interpretations and MALLET topics remain distinct. No new human coding or model refit is claimed. See ../themes/METHODOLOGY.md and ../process/work_log.json.
