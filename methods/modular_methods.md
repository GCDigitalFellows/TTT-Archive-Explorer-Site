# Modular explorer build

Ian G. Williams requested implementation on November 8, 2026 after reviewing how
the 5.6 MB page limited contribution through GitHub. The working build separates
markup, styles, scripts and saved data. Its data population and calculations
match the preceding offline build.

## Where to edit

| Intended change | Editable source | Generated browser output |
| --- | --- | --- |
| Shared header/footer | `template.html` | `index.html` |
| Page copy and controls | `views/home.html`, `browse.html`, `read.html`, `wisdom.html`, `analysis.html`, `about.html`, `design.html` | Sections assembled into `index.html` |
| Layout and appearance | `styles.css`; shared lab styles in `../../../demos/word_cloud_lab/cloud.css` | `web/assets/styles/explorer.css` |
| Loading and retry | `loader.js` | `web/assets/scripts/loader.js` |
| Navigation, browsing and reader | `ui.js`, `route_core.js`, `core.js`, shared `../../../interactive/search_core.js` | `interface.js`, `routes.js`, `core.js`, `search.js` under `web/assets/scripts/` |
| Analysis, people and words | `analysis_core.js`, `analysis_ui.js`, `people_ui.js`, `word_ui.js`, `exclusive_ui.js`, shared cloud lab code | `analysis-core.js`, `analysis.js`, `people.js`, `words.js`, `exclusive.js`, `cloud.js` under the same scripts directory |
| Quotation selection/display | `quote_core.js`, `quote_ui.js` | `quote-core.js`, `quotes.js` |
| Data assembly and splitting | `build_prototype.py`, `build_modular.py` | `web/data/manifest.json` and referenced JSON files |

Browser outputs are readable and can be reviewed directly on GitHub. Carry
compatible public edits back to the corresponding source before rebuilding.
The existing shared-contribution policy governs significant changes. Data edits
still need their own source evidence and attribution review.

## Build and inspect locally

From the private repository root, after the required GitHub comparison:

```sh
python3 analysis/reviews/mockups/welcoming-pathways/build_prototype.py
python3 scripts/prepare_public_site.py /tmp/ttt-modular-site-new
python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp/ttt-modular-site-new
```

The first command reads the saved research page and evidence and writes the
modular entry, browser assets, offline export and audits. It does not fit a new
model. To refresh the research evidence page first, provide `WORDPRESS_XML` and
run `python3 analysis/build_interactive.py` as documented in the root README.
The packager requires a new output directory and copies only the reviewed
release allowlist. Serving the package makes its relative paths match GitHub
Pages. The source entry also works through a local server rooted at the project.

The optional `offline.html` is a generated single-file export with the same data.
It is ignored by Git and excluded from the public release. It can be opened
without a server. The large `prototype_fragment.html` and private research page
remain supporting generated artifacts; the public entry point is the modular
page. Frozen workflow diagrams describe their cited historical revisions.

## Data files and reconstruction

The manifest contains a version, the original post order, a reconstruction recipe
for each saved JSON document, and the script order. The recipes use five plain
operations:

- `file` reads one JSON file and checks its SHA-256 checksum.
- `fields` assembles an object from named child recipes.
- `items` assembles an array from child recipes.
- `merge` combines disjoint object pieces. Duplicate keys are an error.
- `concat` joins array pieces in their declared order.

Articles are grouped by academic year before splitting. Each generated asset
and data file must fit a 180,000-byte budget. Oversized lists/maps are divided
without dropping values; an oversized single scalar stops the build for review.
The manifest restores the original article order. It retains complete reading
text, credits, rights, saved model weights, word data and quotation records.
The budget is a project review target rather than a GitHub guarantee. Large
multi-file migrations can still exceed GitHub's aggregate diff limits.

## Readiness, consistency and recovery

The current implementation loads complete reading text, credit metadata, topic profiles and quotations before enabling the interface. Full-text
search therefore covers all 423 published records when available. The larger
word-cloud counts, word-view summaries, sunburst hierarchies and year-exclusive
vocabulary are loaded only when the word-analysis tab is opened. Writer/cohort records load as
a separate group when People & methods opens.

Manifest version 2 declares separate word-analysis and people data groups. `loader.js` shares one
request for a group, commits its fields together after all checks pass, caches a
successful result, and allows retry after failure. The UI reads a shared saved-data
object; the offline export uses its complete embedded object instead. The welcome page’s initial JSON transfer is 3,307,889 bytes in 37 files. The
word-analysis group defers 3,474,177 bytes in 29 files, and the people group defers
766,981 bytes in seven files. Together, these reduce initial JSON content by about
56% compared with the first modular build. These byte counts do not establish
load-time performance. A bookmark opening People & methods requests its group
immediately for that page.

The word view has a persistent loading/error status and keyboard retry. Other
views stay usable. If the visitor leaves while data loads, completion does not
change their page or focus. The chart UI is constructed once, when visible, to
avoid duplicate handlers and zero-width chart initialization. Retry returns focus
to the word-analysis tab before the temporary retry control is hidden.

The shell identifies its expected manifest checksum. The manifest records data
checksums and script integrity values. A damaged initial download or mixed release fails
startup instead of exposing partial search. A failed deferred group is kept out
of the shared data object and affects only the view that needs it. Scripts execute in their original
order after data reconstruction. Layout remains measurable while hidden during
initialization so charts can calculate dimensions.

A loading status explains readiness. On failure, the archive remains unavailable
and a retry button reloads the page, retaining its bookmarked route. A clean
reload avoids duplicate handlers from a partly initialized interface. The modular
build requires HTTPS or localhost, where browser checksum APIs are available.
Direct `file://` use should use the optional offline export.

## Release and review checks

The release manifest lists each asset explicitly. A build that adds or removes
asset paths stops and requests an allowlist review. The packager never recursively
copies the output directory. Stable names make changes to existing data/code
visible in Git diffs; checksums detect files from inconsistent releases.

After building, run the following checks from the repository root:

```sh
python3 -m unittest discover -s analysis/reviews/mockups/welcoming-pathways -p 'test_*.py'
node --test analysis/reviews/mockups/welcoming-pathways/test_core.js analysis/reviews/mockups/welcoming-pathways/test_analysis.js analysis/reviews/mockups/welcoming-pathways/test_routes.js analysis/reviews/mockups/welcoming-pathways/test_quotes.js analysis/reviews/mockups/welcoming-pathways/test_loader.js
python3 -m unittest discover -s scripts -p 'test_public_release.py'
```

The modular tests compare every saved field and quotation against the offline
export and original saved public data. They also check the asset budget, data and
script hashes, and execution order. Browser checks cover full-text search,
reading/return, random selection, writer evidence focus/return, sunburst/network
rendering, and a deliberately damaged manifest followed by successful retry.
Additional checks cover deferred-data failure with functioning full-text search, keyboard retry, navigation during a deliberately delayed request, and the offline embedded-data path served locally. Direct file-mode execution was not checked in this phase. People-page checks also cover its independent failure/retry, preserved writer filters across navigation, writer and cohort evidence focus/return, full article reading/return, and the offline embedded-data path served locally. These are agent-run checks. Screen-reader testing, human learner evaluation,
production deployment and performance benchmarking remain separate activities.

## Pedagogical basis and attribution

The source/data boundary and explicit reconstruction recipe apply the knowledge
base's reproducibility and explorable-analysis guidance (S06, S08, S17). The page
fragments and source mapping apply its attention to understanding and bounded
review (S03–S05). These are project-specific applications; the papers do not
validate this implementation. See the [knowledge base](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/docs/knowledge/code-review-digital-humanities/README.md).

Ian G. Williams requested the architectural change and implementation. OpenAI
Codex (exact build not recorded) wrote the splitter, loader, regression checks,
source/output mapping and documentation, and performed the recorded tests.
CRediT describes Ian's documented direction. GAIDeT discloses AI code generation,
writing and checking in the project work log. Original article writers retain
source-text credit and their separate rights.

## Isolated component previews

`build_modular()` now accepts optional `output_directory`, `script_names` and `deferred_groups` arguments. The normal builder leaves them unset and retains identical output bytes. The [cleaning integration preview](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/demos/cleaning_comparison/integration_methods.md) uses them to build into a fresh directory with one extra deferred group, without modifying the active assets or public allowlist. This is preview support, not permission to publish new groups.

## Coverage and situated interpretation · November 9

Edit public scope/feedback copy in `views/analysis.html`, `views/home.html` and
`views/about.html`. Theme-specific selection notes and counterquestions live
beside `summaries` in `ui.js`; they are editorial prompts, not source quotations.
`analysis_core.js:coverageYears` compares the full saved published population
with the selected modeled population; `analysis_ui.js` renders both without
changing topic means. The full-year counts never inherit name/evidence filters.
Run `node --test analysis/reviews/mockups/welcoming-pathways/test_analysis.js`
after changing this calculation. The saved six-case cleaning inspection is in
`analysis/reviews/critical_methods_reassessment_2026-11-09/`; its literal counts
do not reproduce NLTK or license changes to the corpus. Rebuild with the usual
builder and use the separate integration builder for the cleaning-demo preview.

## Question-led network entry and shared writing · November 9

The network starts with three explicit visitor questions in `views/analysis.html`.
`analysis_ui.js` keeps the workspace hidden until a question is chosen; the
`networkStarted` state survives in-app navigation. Question buttons preserve the
existing year/name/evidence selection and explain the reset. Their actions select
the name/year graph, matrix or new article-centered shared-writing view. Existing
network/evidence controls remain available; the duplicate text-analysis controls
are hidden on this tab.

`analysis_core.js:sharedWriting` takes the already filtered local posts and returns
one entry per article with more than one distinct credited name. It does not infer
relationships or apply the graph's twelve-name drawing cap. `renderSharedWriting`
in `analysis_ui.js` creates native HTML paths with full names and credit evidence;
`styles.css` stacks their columns below 750px. Opening evidence saves the article
button ID so Return to selected connection can restore focus. The existing return
control ID remains stable for compatibility with matrix navigation.

Try: choose See who shares a post, select Anna Corbett in its byline, and inspect
the collective article. Predict how many articles and other names will remain;
then compare the optional person-to-person view. The article stays one item even
when its eleven names generate 55 pairs. This is a proposed learning activity,
not a tested measure of learner understanding. Run `node --test` on
`test_analysis.js` and the modular Python checks after changing these functions.
Other review recommendations (for example tier-specific SVG line patterns) remain
proposals, outside the two approved changes.

## November 9 corpus refresh

The active composite, counts and hash are in `analysis/source_snapshot.json`;
`source_snapshot.py` locates it for recipes. Route markup uses
`__PUBLISHED_COUNT__` and `__MODELED_COUNT__` tokens so count labels follow saved
data. The public allowlist adds only three explicit generated data shards; raw
exports, archives and model binaries remain excluded. The assessed quote shortlist
stays historical while the expanded eligible pool has a checked lineage receipt.
Do not rewrite its original assessment hash. Read the refresh report and run the
preservation checks before repeating a corpus update.

## Flyer typography · November 9, 2026

Ian approved the local font demonstration for the active site. Edit
`typography.css` for the default (2026) title/headings, body text, sizes and
orchid/ice-blue accents. Earlier design years retain their existing treatments;
selecting 2026 or resetting restores this default. The stylesheet is assembled
after `styles.css`, not after user/system preference overrides. Its own final
contrast rules restore system/foreground colors. Dark accents are sampled flyer
colors; light accents are darker adaptations, not extracted colors.

`fonts/manifest.json` pins each unmodified local font and notice by hash and
upstream revision. `build_modular.py` verifies/copies these into
`web/assets/fonts/`; the public allowlist maps that exact set to `assets/fonts/`.
The optional offline export embeds font bytes separately so it remains a
single file. No font download or system installation occurs during build/use.
SIL OFL remains separate from project MIT. The earlier isolated demo and its
controls remain a historical comparison, not a second production settings panel.

## Annual Digital Fellow composition

`analysis_core.js:cohortComposition` deduplicates the selected year’s people and intersects them with Digital Fellow names in the same year’s full saved roster. A selected person with several roles belongs to the Digital Fellow segment once; its complement is other recorded people, not proof of nonmembership. Filtering another role retains this same-year evidence test. `people_ui.js` renders both counts against the largest selected annual total and preserves the year evidence button. Edit `styles.css` for the solid/striped fills; preserve the text counts and missing-data state.

## Separate staffing sources · November 10, 2026

`build_staffing.py` reads saved report transcriptions and the report source
register into `peopleHistory.staffingReports`. It preserves each name, role,
period and physical PDF page. The report data does not enter the directory
appointment ledger, writing credits or NLP models. A whole-word Fellow title
is included unless explicitly postdoctoral; Fellowship Coordinator alone is
excluded. This is a role-based proxy, not verified student enrollment or FTE.

`people_ui.js` starts with the directory view (Ian’s revised default, November 10), with staff excluded. The report option labels missing annual rosters rather than backfilling directory counts. Pooled 2012–2014
and the 2015 Digital Fellows snapshot have separate evidence buttons. The current
2026–2027 human-confirmed roster has its own source label. Switching to directory
restores the directory scope/role controls. The staff checkbox applies to either
source; the comparison table always uses unfiltered fellowship-only counts.

Report evidence displays raw source names and links to physical PDF pages when
public URLs exist. Where no public PDF URL is recorded, it links to the saved
transcription with the report page stated explicitly. No new identity matching
is performed. Year and comparison buttons retain evidence/return focus behavior.

The new `peopleHistory-6.json` shard is explicitly allowlisted. The existing
180,000-byte budget, deferred people-data group, integrity checks and complete
search readiness are unchanged. Run the frontend Python tests, analysis JS tests
and release checks after editing this path. Predict how the current roster changes
from 19 fellowship-role holders to 20 people when staff are included, then compare
the two named rosters. This is a proposed review activity, not learner validation.
The evidence boundary and targeted checks apply knowledge-base S06/S17; they do
not establish the completeness or correctness of the historical staffing sources.
