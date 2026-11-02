# Reviewing the attribution and process page

Open `../CREDITS_AND_PROCESS.html`, or choose **Attribution & process** in the explorer. The page describes source-writing acknowledgment, project-level human contributions, and delegated AI tasks separately.

## Where to review each decision

- `process_profile.json` records Ian G. Williams’s requested public credit, the evidence-backed project-role mapping, GAIDeT task selections, and framework sources. A blank or unestablished role must not be filled merely to complete a taxonomy.
- `name_classification.json` lists the explicit joint-name expansions and organizational/unresolved labels. Names are not inferred by splitting every comma or the word “and.” Initials and possible aliases remain distinct unless reviewed evidence justifies merging them.
- `../build_credits.py` joins corrected `records.json` to those choices. Read `main()`, then `build_register()`. The generator preserves original credit strings, per-post status, quotation evidence and links. It produces `human_author_register.csv`, `credits_and_process.json`, the page fragment, and the standalone HTML.
- `page_template.html` contains the readable explanation. `credits.css` supplies a standalone reading layout and scoped styles for the embedded tab. `credits_ui.js` filters an already-complete register; without JavaScript, all names and linked records remain available.

The CSV has one row per name/post pair. The 163 name entries include local and named curated-source writers as well as provisional and draft metadata; they are not a verified census of distinct people. Joint-name expansions affect this acknowledgment register only. They do not silently change historical model inputs, the attribution ledger, or the network’s 70-name published-local population.

## Scope of the roles

The 14 CRediT labels describe human contribution categories; the page does not use them to decide authorship. The source writers receive acknowledgment for attributed source texts, without being assigned unsupported roles in the new analysis. The project mapping records Ian’s direction and critique without claiming that he personally executed the agent’s code or independently verified every result. Contributor confirmation is not implied.

The eight GAIDeT categories organize documented delegated tasks. Selected labels and term identifiers come from the public taxonomy. This is a project-specific application, not an official equivalence between CRediT and GAIDeT. The page explicitly limits claims about human oversight, exact model versions, and formal ethics review. It does not investigate whether original post writers used AI.

## Rebuild and check

From the project folder:

```sh
python3 analysis/build_credits.py
python3 analysis/build_interactive.py
python3 -m unittest discover -s analysis/credits -p 'test_*.py'
node --test analysis/interactive/test_index.js analysis/interactive/test_core.js analysis/design/test_styles.js
python3 analysis/verify_revision.py
python3 analysis/package_report.py ATTRIBUTION_REVIEW.md
```

The explorer builder also rebuilds this page, so the two versions use the same source register. The numerical analysis is not rerun by this addition. Tests check exhaustive credit-string accounting, coverage of source names and records, human/non-person separation, reviewed joint expansions, draft-link handling, and taxonomy structure. Browser review checks the filter, all-name reset, standalone page, embedded tab and narrow layouts.

## Framework attribution

CRediT is the ANSI/NISO Z39.104-2022 standard. Canonical roles and implementation guidance are linked on the page; short explanations here are paraphrases. GAIDeT is attributed to Yana Suchikova, Natalia Tsybuliak, Jaime A. Teixeira da Silva and Serhii Nazarovets, *Accountability in Research*, 33(3), 2544331 (2026; online August 8, 2025), DOI: https://doi.org/10.1080/08989621.2025.2544331. The public generator and source taxonomy were consulted November 1, 2026. Publisher full text was inaccessible in this session, so detailed task mapping uses the public taxonomy rather than claiming to reproduce the full paper. No declaration-generator code was copied.

Source posts retain their respective rights. The archive export does not establish a single license covering every original or linked work.

## Subsequent identity review — November 1, 2026

The current register has 161 grouped entries after two supported alias merges; 163 above describes the earlier snapshot. See `../identity/review.html` and its decision ledger. The shared `../author_identity.py` now expands the existing reviewed joint names and applies only the two documented aliases across website views. Raw credits remain in register entries and the source inventory. No automatic fuzzy merging or new cohort inference occurs. Run `python3 -m unittest discover -s analysis/identity -p 'test_*.py'` to check preservation and merged coverage.

## November 2 research-first review/revision

The profile and work log now include two simulated AI sub-agent reviews, the supplied manifest-based five-persona simulation, requester decisions, source verification, the 19-post interpretation, research navigation, roster/credit displays, methods/reporting support and release QA. Simulations are mapped to GAIDeT quality assessment/recommendations, not claimed as human validation. CRediT records Ian’s actual direction, supplied materials and feedback without assigning AI human roles. Contributor confirmation and complete human approval remain unestablished. See ../process/work_log.json and ../process/validation.json.


## External review provenance clarification · November 2, 2026

Ian G. Williams identified the supplied review as produced by **Deepseek V4.1 Flash 1017**, running in the **CAIL sandbox in OpenWebUI**, from a **ZIP export of a previous project iteration**. This is distinct from the two Codex sub-agent simulations and Codex implementation work. The model/environment provenance is requester-reported, not independently verified from external session logs. The exact input ZIP filename, hash and iteration identifier are not recorded. The review document’s stated manifest-level inspection limits remain relevant; its recommendations were checked against current source files. None of these simulations establishes actual human user testing.


## Thematic visualization revision

The current work log and contribution profile include Ian’s theme-visualization request and Codex’s data joining, counting definitions, charts, index/network integration, documentation and checks. Eight dictionary categories, six selected-example interpretations and MALLET topics remain distinct. No new human coding or model refit is claimed. See ../themes/METHODOLOGY.md and ../process/work_log.json.

## November 2 source-credit correction

The current register contains 162 grouped human-name entries and 71 published-local names (72 raw spelling strings); 258 local account credits remain provisional. Earlier counts above describe earlier snapshots. The new McMichael spacing merge is evidence-supported. Ten records have corrected names; additional revision-note checks confirm existing names. See ../ATTRIBUTION_REVIEW.html and ../attribution_revision/review_2026-11-02.json.
