# Thematic visualizations — November 2, 2026

## Three evidence layers, not a single thematic truth

- **Title & tag signals:** eight dictionaries applied in the original audit to titles, categories and tags. These reproduce the saved year-level theme counts.
- **Title, tag & body signals:** the same eight dictionaries, using the saved broader flags that search title, tags and normalized body together. This is not a body-only measure. Welcome posts, repeated program language, incidental matches and negation can contribute.
- **Six interpretive themes:** the explicit groupings of 19 purposively selected source posts used in the essay. No other post is assigned a semantic theme by this feature. These groupings are agent-developed; independent human coding is not documented.

MALLET’s eight primary statistical topics remain separate from these eight dictionary categories and six interpretive headings. The number eight in the two systems does not establish an alignment. No model is retrained and no new corpus-wide thematic coding is claimed.

## Populations and denominators

Both dictionary layers cover the **325 published local/unflagged records**, including unmodeled and welcome records. Drafts and curated/source-linked records are excluded. This differs from the 299-post model corpus and the older 307-post body-motif analysis. Local/unflagged means no external-curation marker was detected, not verified original authorship.

A year cell’s numerator counts distinct posts carrying the chosen saved signal; its denominator includes every eligible post in that year, including posts without any dictionary match. Year, writer and explicit-credit filters change this denominator. Themes overlap and their counts/shares cannot be added as mutually exclusive categories. A missing denominator is shown as a dash, not a zero-percent observation.

The essay layer includes only the 19 selected examples and uses counts. Its zero-year cells do not establish the absence of a theme elsewhere in the archive. No co-occurrence matrix is shown for that layer: examples were organized under particular headings, not exhaustively coded for every possible theme.

## Views and interaction

1. **Year × theme heatmap:** select a cell to inspect the matching posts in that year. Cells include numerator/denominator text. Fill height scales to the displayed quantity: yearly shares or counts, scaled within the current view. Counts and shares are distinct measures.
2. **Theme co-occurrence:** for dictionary layers, each cell counts posts matching both signals; the diagonal counts one signal. Fill height scales to the largest displayed count in the matrix. Pair selection reports both marginal counts, intersection and union and opens the source list. These connections are not semantic equivalence, agreement or collaboration.
3. **Writers behind a theme:** bars count distinct credited-author/post pairs. A coauthored post counts once for each credited person, and duplicate credit strings never double-count one person. Provisional matching credits are reported per row. Writer bars describe the global filter selection; a cell inspection does not silently change their population. Selecting a writer applies an explicit global filter.
4. **Index/network integration:** the existing index now supports an optional title/tag theme-signal filter and overlapping grouping. The author–year publication network respects that filter. The index retains all 430 records, including draft metadata and curated records; its network continues to exclude curated and draft records. The thematic charts have their own narrower population, stated above.

The annual CSV export captures current filters and each cell’s numerator and denominator. The post export contains all matching rows, not just those shown, with canonical and original credits. Global filter changes clear any narrower inspected year/pair. View links preserve the tab and appearance, not thematic filter settings.

## Attribution and limitations

Human post authors retain their source-writing credits; they are not credited with producing or endorsing the dictionaries, theme assignments or visualizations. Name grouping uses the reviewed identity map; original credits and provisional status are preserved. Publication years are not proof of fellowship membership.

Ian G. Williams requested the thematic revision. Codex designed the presentation, joined saved evidence, wrote code and documentation, and ran checks. CRediT describes documented human project direction and methodology requests; GAIDeT records delegated data organization/analysis, visualization, code generation, explanatory drafting, validation and quality assessment. No new human coding, participant study or independent human approval is implied. See the full contribution profile and work log.

## Review the code

`build_themes.py` prepares inspectable data and independent Python annual-count references from corrected records and essay-source lists. `theme_core.js` contains pure filtering, counting, overlap and author functions. `theme_ui.js` manages controls and displays. `themes.css` changes presentation only. `test_themes.js` checks population boundaries, source-table agreement, overlap mathematics, coauthor counting, sample membership and the index filter.

Run from the project workspace:

```sh
python3 analysis/build_interactive.py
node --test analysis/themes/test_themes.js
python3 analysis/verify_revision.py
```

The builder refreshes this evidence view but does not run NLTK/MALLET. In the distributed package, omit the `analysis/` prefix when running from its root, and supply the original export for a rebuild.
