# Interactive source: a small map for reviewers

Open `../interactive_explorer.html` to use the finished explorer. Open `../INTERACTIVE_GUIDE.html` for the full reading and review guide. The template in this folder contains placeholders and must be built before use.

The files are separated by responsibility:

- `core.js` contains the calculations. It knows nothing about buttons, page layout, or the network. The same functions run in the page and the independent Node checks.
- `explorer.js` connects native controls to those calculations and displays their results. Start with `initialize()` and `renderActiveView()`.
- `template.html` contains headings, controls, explanatory notes, and locations for the charts.
- `styles.css` controls appearance and reflow. It does not determine which posts are analyzed or what a percentage means.
- `../build_interactive.py` reads earlier outputs and embeds the data and these files into one shareable page. It does not train MALLET or rerun NLTK.
- `test_core.js` compares the new calculations with independent saved Python tables. `validation.txt` records the eight completed numerical checks.

## Read the compact data

`explorer_data.json` is generated evidence, not code a person needs to edit. Each modeled post has a stable ID, academic year, credited-name list, roster matches, input-token count, and word counts. Word counts are pairs of a dictionary index and an occurrence count; `dictionary[index]` retrieves the word. This avoids repeating long words thousands of times in the shareable page.

Each model maps post IDs to an array of topic weights. The array order is the topic number for that run. IDs do not align across runs automatically. Human topic labels apply only to the primary eight-topic, seed-42 model; the alternative runs show their own leading words.

Publication records, body-text motifs, and title/tag signals have their own populations. They are not silently filtered to the 299 modeled posts. The interface states each denominator and which controls affect it.

The builder copies selected earlier tables into `test_references.json`. These expected numbers come from the earlier Python analysis, not from the JavaScript calculation being tested. `build_audit.json` records the embedded-data fingerprint. `browser_validation.json` records the additional manual browser checks and the tested preview width.

## Rebuild and verify

From the project root:

```bash
python3 analysis/build_interactive.py
node --test analysis/interactive/test_core.js
python3 analysis/verify_revision.py
```

Only ordinary Python is required to build, and only Node's built-in test runner is required for numerical checks. A person opening the finished HTML needs neither. The finished page loads no external scripts or data; the original post links are the only actions that navigate to an external website.

The JavaScript is formatted for reading, and comments explain scope and interpretation choices. Code-formatting tools are not runtime dependencies and are not needed to rebuild. Changing a filter changes an aggregation of the saved results, not the training corpus or model itself.
