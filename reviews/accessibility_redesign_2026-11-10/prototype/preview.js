/* Inputs: six saved public article examples in data.js. Outputs: sample reading
 * cards and source links. Search and random selection affect these six examples
 * only; no model, live archive query, tracking or settings storage runs here. */
"use strict";
const preview = window.REDESIGN_PREVIEW;
const get = (id) => document.getElementById(id);
const make = (tag, text) => {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  return el;
};
let path = "all";
function render() {
  const query = get("sample-search").value.trim().toLowerCase();
  const rows = preview.posts.filter(
    (row) =>
      (path === "all" || row.path === path) &&
      (!query ||
        [row.title, row.authors.join(" "), row.paragraph]
          .join(" ")
          .toLowerCase()
          .includes(query)),
  );
  const root = get("examples");
  root.replaceChildren();
  for (const row of rows) {
    const post = make("article");
    post.className = "post";
    const title = make("h3", row.title);
    post.append(title, make("p", row.connection));
    post.lastChild.className = "connection";
    const names = row.authors.join("; ");
    if (row.authors.length > 3) {
      const credits = make("details");
      credits.className = "credits";
      credits.append(
        make(
          "summary",
          row.authors.length + " source-credited coauthors · " + row.year,
        ),
        make("p", names),
      );
      post.append(credits);
    } else {
      const credits = make("p", names + " · " + row.year);
      credits.className = "credits";
      post.append(credits);
    }
    const detail = make("details");
    detail.append(
      make("summary", "Read a saved passage"),
      make("blockquote", row.paragraph),
    );
    post.append(detail);
    const original = make("a", "Read the original post ↗");
    original.href = row.url;
    post.append(original);
    const credit = make(
      "p",
      row.creditEvidence === "source-supported"
        ? "Credit supported by the saved source."
        : "Credit recorded in the post’s author metadata.",
    );
    credit.className = "credits";
    post.append(credit);
    root.append(post);
  }
  get("results-status").textContent = rows.length + " of 6 prototype examples shown.";
  if (!rows.length)
    root.append(make("p", "No examples match. Clear the search or show all examples."));
  return rows;
}
for (const button of document.querySelectorAll("[data-path]"))
  button.onclick = () => {
    path = button.dataset.path;
    for (const other of document.querySelectorAll("[data-path]"))
      other.setAttribute("aria-pressed", String(other === button));
    render();
  };
get("sample-search").addEventListener("input", render);
get("reset").onclick = () => {
  path = "all";
  get("sample-search").value = "";
  for (const button of document.querySelectorAll("[data-path]"))
    button.setAttribute("aria-pressed", "false");
  render();
};
get("random").onclick = () => {
  const rows = render();
  if (!rows.length) return;
  const index = Math.floor(Math.random() * rows.length);
  const card = get("examples").children[index];
  card.querySelector("details:not(.credits)").open = true;
  card.tabIndex = -1;
  card.focus();
  get("results-status").textContent = "Selected an example: " + rows[index].title;
};
const analysisFrame = document.querySelector(".analysis-frame");

// The published prototype and explorer share an origin. A local preview
// can still display the public explorer with its own styles.
function applyAnalysisReadingOptions() {
  const explorer = analysisFrame.contentDocument;
  if (!explorer?.documentElement || explorer.URL === "about:blank") return;

  if (!explorer.getElementById("prototype-analysis-reading-style")) {
    const stylesheet = explorer.createElement("link");
    stylesheet.id = "prototype-analysis-reading-style";
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("analysis-reading.css", document.baseURI).href;
    explorer.head.append(stylesheet);
  }

  explorer.documentElement.dataset.readingTheme = get("appearance").value;
  explorer.documentElement.dataset.readingFont = get("font").value;
  explorer.documentElement.dataset.readingSize = get("size").value;
}

analysisFrame.addEventListener("load", applyAnalysisReadingOptions);
applyAnalysisReadingOptions();

for (const [control, attribute] of [
  ["font", "data-font"],
  ["size", "data-size"],
  ["spacing", "data-spacing"],
  ["appearance", "data-theme"],
])
  get(control).addEventListener("change", () => {
    document.documentElement.setAttribute(attribute, get(control).value);
    applyAnalysisReadingOptions();
  });
render();
