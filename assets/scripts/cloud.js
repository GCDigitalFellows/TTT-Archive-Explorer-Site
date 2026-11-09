"use strict";

// The host passes saved post counts and reading copies, plus an optional render callback.
function createArchiveWordCloud(root, posts, onRender = () => {}) {
  const get = (id) => root.querySelector("#" + id);
  const postsByYear = new Map();
  const corpusPostCounts = new Map();
  for (const post of posts) {
    if (!postsByYear.has(post.year)) postsByYear.set(post.year, []);
    postsByYear.get(post.year).push(post);
    for (const word of Object.keys(post.words)) {
      corpusPostCounts.set(word, (corpusPostCounts.get(word) || 0) + 1);
    }
  }
  const years = [...postsByYear.keys()].sort();
  const yearLabel = (year) => year + (year === "2026–2027" ? " · partial" : "");
  for (const year of years) {
    get("year").add(new Option(yearLabel(year), year));
  }

  function make(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  }

  let lastYear;
  let scope;
  let vocabulary;
  let activeWord = "";
  let activeSources = [];
  let lastPick;
  let timelineWord;
  const sentences = new Intl.Segmenter("en", { granularity: "sentence" });

  // Aggregate each term once per post. Keep the post list for exact coverage
  // counts and source links when a reader selects a word.
  function loadScope(year) {
    if (lastYear === year) return;
    lastYear = year;
    scope = posts.filter((post) => !year || post.year === year);
    vocabulary = new Map();
    for (const post of scope) {
      for (const [word, count] of Object.entries(post.words)) {
        const row = vocabulary.get(word) || { word, occurrences: 0, sources: [] };
        row.occurrences += count;
        row.sources.push(post);
        vocabulary.set(word, row);
      }
    }
  }

  function sourceLink(post, newTab = false) {
    const link = make("a", post.title + (newTab ? " (opens in new tab)" : ""));
    link.href = post.url;
    if (newTab) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    return link;
  }

  function sourceCredit(post) {
    const authors = post.authors.join(", ") || "Author unresolved";
    return [authors, post.creditStatus, post.year, post.license]
      .filter(Boolean)
      .join(" · ");
  }

  // Use the saved reading copy for exact surface matches. Cleaned counts can
  // include other forms of the word, so the excerpts cannot explain every count.
  function showContexts() {
    const examples = [];
    for (const post of activeSources) {
      let excerpt;
      for (const paragraph of post.paragraphs) {
        excerpt = Array.from(sentences.segment(paragraph), (part) =>
          part.segment.trim(),
        ).find(
          (sentence) =>
            sentence.length <= 350 &&
            sentence
              .toLowerCase()
              .match(/[\p{L}\p{M}\p{N}]+/gu)
              ?.includes(activeWord),
        );
        if (excerpt) break;
      }
      if (!excerpt) continue;
      const figure = make("figure", "");
      const caption = make("figcaption", sourceCredit(post) + " · ");
      caption.append(sourceLink(post));
      figure.append(make("blockquote", excerpt), caption);
      examples.push(figure);
      if (examples.length === 5) break;
    }
    get("contexts").replaceChildren(
      ...(examples.length
        ? examples
        : [
            make(
              "p",
              "No short sentence with this exact written word was found in the matching posts.",
            ),
          ]),
    );
  }

  function selectYear(year) {
    get("year").value = year;
    render();
  }

  // Divide by all analyzed posts in each year. Cloud display filters affect
  // which words are drawn there, so they do not change these denominators.
  function showTimeline(word) {
    if (timelineWord !== word) {
      timelineWord = word;
      get("timeline-years").replaceChildren(
        ...years.map((year) => {
          const yearPosts = postsByYear.get(year);
          const count = yearPosts.filter((post) =>
            Object.hasOwn(post.words, word),
          ).length;
          const share = (count / yearPosts.length) * 100;
          const button = make("button", "");
          button.type = "button";
          button.value = year;
          button.addEventListener("click", () => selectYear(year));
          const label = make("span", yearLabel(year));
          const selected = make("strong", " · selected");
          label.append(selected);
          const values = make(
            "span",
            `${count} of ${yearPosts.length} posts · ${share.toFixed(1)}%`,
          );
          values.className = "timeline-count";
          const track = make("span", "");
          track.className = "timeline-track";
          track.setAttribute("aria-hidden", "true");
          const bar = make("span", "");
          bar.className = "timeline-bar";
          bar.style.width = `${share}%`;
          track.append(bar);
          button.append(label, values, track);
          const item = make("li", "");
          item.append(button);
          return item;
        }),
      );
    }
    // Keep the year buttons mounted during navigation so keyboard focus stays put.
    const selectedYear = get("year").value;
    get("timeline-all").setAttribute("aria-pressed", String(!selectedYear));
    for (const button of get("timeline-years").querySelectorAll("button")) {
      const selected = button.value === selectedYear;
      button.setAttribute("aria-pressed", String(selected));
      button.querySelector("strong").hidden = !selected;
    }
  }

  get("timeline-all").addEventListener("click", () => selectYear(""));
  get("timeline").addEventListener("toggle", () => {
    if (get("timeline").open && activeWord) showTimeline(activeWord);
  });

  get("context-panel").addEventListener("toggle", () => {
    if (get("context-panel").open) showContexts();
  });

  get("pick-post").addEventListener("click", () => {
    // Each matching post gets one chance, regardless of its word count.
    const choices =
      activeSources.length > 1
        ? activeSources.filter((post) => post !== lastPick)
        : activeSources;
    lastPick = choices[Math.floor(Math.random() * choices.length)];
    get("random-post").replaceChildren(
      sourceLink(lastPick, true),
      " · " + sourceCredit(lastPick),
    );
  });

  function showTerm(word, visibility = "") {
    const row = vocabulary.get(word);
    const sources = row?.sources || [];
    if (word !== activeWord || sources !== activeSources) {
      lastPick = undefined;
      get("random-post").replaceChildren();
    }
    activeWord = word;
    activeSources = sources;
    const panel = get("term-detail");
    panel.hidden = !word;
    get("related").hidden = !row;
    get("context-panel").hidden = !row;
    if (!word) return;
    get("term-title").textContent = word;
    if (get("timeline").open) showTimeline(word);
    get("term-counts").textContent = row
      ? `${row.occurrences} occurrences across ${row.sources.length} of ${scope.length} posts.${visibility}`
      : "This cleaned word is absent from the selected scope.";
    const comparison = get("term-comparison");
    comparison.hidden = !get("distinctive").checked || !get("year").value;
    if (!comparison.hidden)
      comparison.textContent = compareShares(word, sources.length).label;
    get("source-summary").textContent = row
      ? `Source posts (${row.sources.length})`
      : "Source posts";
    get("source-summary").parentElement.hidden = !row;
    get("sources").replaceChildren(
      ...(row?.sources || []).map((post) => {
        const item = make("li", "");
        item.append(sourceLink(post));
        return item;
      }),
    );
    if (row && get("context-panel").open) showContexts();
    for (const button of get("cloud").querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.textContent === word));
    }
  }

  // Each post contributes at most once. The rest of the archive excludes the
  // selected year, and both denominators include every analyzed post in scope.
  function compareShares(word, yearCount) {
    const restSize = posts.length - scope.length;
    const restCount = (corpusPostCounts.get(word) || 0) - yearCount;
    const yearShare = (yearCount / scope.length) * 100;
    const restShare = (restCount / restSize) * 100;
    // Compare integer products before division so equal shares tie exactly.
    const difference = yearCount * restSize - restCount * scope.length;
    const gap = (difference / (scope.length * restSize)) * 100;
    const label = `${yearCount}/${scope.length} posts (${yearShare.toFixed(1)}%) vs. ${restCount}/${restSize} (${restShare.toFixed(1)}%) · ${gap > 0 ? "+" : ""}${gap.toFixed(1)} percentage points`;
    return { difference, label };
  }

  function render() {
    const year = get("year").value;
    loadScope(year);
    const distinctive = get("distinctive").checked;
    const compare = distinctive && Boolean(year);
    get("metric").disabled = distinctive;
    get("comparison-heading").hidden = !compare;
    const minimum = Number(get("minimum").value);
    const hidden = new Set(
      get("hide")
        .value.toLowerCase()
        .split(/[\s,]+/)
        .filter(Boolean),
    );
    const commonMeasure =
      get("metric").value === "posts"
        ? (row) => row.sources.length
        : (row) => row.occurrences;
    const measure = compare ? (row) => row.comparison.difference : commonMeasure;
    const byName = (a, b) => a.word.localeCompare(b.word, "en");
    let eligible =
      distinctive && !year
        ? []
        : [...vocabulary.values()].filter(
            (row) =>
              row.sources.length >= (compare ? Math.max(2, minimum) : minimum) &&
              !hidden.has(row.word),
          );
    if (compare) {
      eligible = eligible
        .map((row) => ({
          ...row,
          comparison: compareShares(row.word, row.sources.length),
        }))
        .filter((row) => row.comparison.difference > 0);
    }
    eligible.sort((a, b) => measure(b) - measure(a) || byName(a, b));
    const selected = eligible.slice(0, Number(get("limit").value));
    const maximum = selected.length ? measure(selected[0]) : 1;
    if (get("order").value === "alphabetical") selected.sort(byName);
    const sizeLabel = compare
      ? "the gap in post shares"
      : get("metric").selectedOptions[0].text.toLowerCase();
    get("summary").textContent =
      distinctive && !year
        ? "Choose an academic year to compare it with all other years."
        : `${year ? yearLabel(year) : "All academic years"} · ${scope.length} analyzed posts · ${selected.length} of ${eligible.length.toLocaleString()} eligible words shown · Sized by ${sizeLabel}.`;
    get("cloud").replaceChildren(
      ...selected.map((row) => {
        const button = make("button", row.word);
        button.type = "button";
        button.style.fontSize = `${0.95 + 1.9 * Math.sqrt(measure(row) / maximum)}rem`;
        button.title =
          row.comparison?.label ||
          `${row.occurrences} occurrences in ${row.sources.length} posts`;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => showTerm(row.word));
        return button;
      }),
    );
    if (!selected.length && (!distinctive || year)) {
      get("cloud").append(
        make(
          "p",
          compare
            ? "No words meet the filters and have a higher post share in this year. Try another year or clear hidden terms."
            : "No words match. Try lowering the minimum post count or clearing hidden terms.",
        ),
      );
    }
    get("counts").replaceChildren(
      ...selected.map((row) => {
        const tr = make("tr", "");
        const heading = make("th", row.word);
        heading.scope = "row";
        tr.append(heading, make("td", row.occurrences), make("td", row.sources.length));
        if (compare) tr.append(make("td", row.comparison.label));
        return tr;
      }),
    );
    const find = activeWord;
    const outside = vocabulary.has(find) && !selected.some((row) => row.word === find);
    showTerm(find, outside ? " Outside the current cloud display." : "");
    onRender(year, distinctive ? "distinctive" : "common");
  }

  get("filters").addEventListener("submit", (event) => event.preventDefault());
  get("filters").addEventListener("input", (event) => {
    if (event.target === get("find"))
      activeWord = event.target.value.trim().toLowerCase();
    render();
  });
  get("filters").addEventListener("reset", () => {
    showTerm("");
    requestAnimationFrame(render);
  });
  render();
  return {
    setYear(year) {
      if (get("year").value !== year) selectYear(year);
    },
  };
}
