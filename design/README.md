# Reviewing and adapting the annual design system

Start with [the methodology](../STYLE_METHODOLOGY.html). It explains what the annual labels mean, how the sources were chosen, and where our interpretation enters the design. The presets are representative directions, not a ranking of what everyone used in a given year.

## Follow the work in four small steps

1. **Evidence and choices:** `style_catalog.json` contains fifteen year presets and the source ledger. Each preset names its sources, describes its features, and states a limitation. `annual_feature_matrix.csv` provides a compact comparison.
2. **Appearance calculations:** `style_math.js` blends the selected palette with a neutral reader palette, checks contrast for specified color roles, and validates saved choices. It has no access to post counts or topic calculations.
3. **Page controls:** `style_ui.js` connects the labeled controls to the appearance calculations. It changes CSS variables and design attributes, and can export appearance settings. Appearance bookmarks contain only design choices.
4. **Visible result:** `year_styles.css` draws the surfaces, headings, layouts, and decorative patterns. The original analysis controls and calculations remain in `../interactive/`.

Comments in these files explain the purpose of each stage and identify decisions a reviewer may want to change. The separate files are for editing; `build_interactive.py` embeds them in a single HTML page that works offline.

## Make a small change

To revise an annual interpretation, edit its entry in `style_catalog.json`. Keep the source identifiers and caveat attached to that interpretation. Use the existing allowed typography, depth, layout, and pattern names; adding a new name also requires updating its implementation and validation. Color values are our adaptations rather than exact reconstructions of vendor palettes.

The intensity control blends colors and corner sizes. Typography and layout remain categorical choices. At zero intensity the reader mode removes the annual treatment. Contrast adjustments protect the specified text and edge roles, but are not a complete accessibility certification. Read the methodology before drawing broader conclusions from these checks.

## Rebuild and review

Run these commands from the project folder, which contains `analysis/`:

```sh
python3 analysis/build_style_docs.py
python3 analysis/build_interactive.py
node --test analysis/design/test_styles.js analysis/interactive/test_core.js
python3 analysis/verify_revision.py
python3 analysis/package_report.py STYLE_METHODOLOGY.md
```

The JavaScript checks use Node's built-in test runner; the page itself needs no Node installation or server. Open `analysis/interactive_explorer.html` in a browser. Select a writer or academic-year range, then change the design year and check that the analysis selection stays fixed. Review at a narrow window width and with the keyboard as well as a pointer.

`test_styles.js` checks source coverage, safe settings, neutral mode, appearance-only bookmarks, and contrast across 270 combinations. The separate analysis tests check numerical behavior. `verify_revision.py` compares 43 saved scientific result files against the earlier snapshot; changing appearance does not rerun NLTK or MALLET.

## Source-based reference palettes

The [NYC PIT Pop Up flyer palette](https://github.com/GCDigitalFellows/TTT-Archive-Explorer/blob/main/analysis/design/palettes/nyc-pit-2026/README.md) records exact sampled colors, proposed roles, CSS tokens and contrast pairings. It is a reference, not an applied theme or change to annual presets.
