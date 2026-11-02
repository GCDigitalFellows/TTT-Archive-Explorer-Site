/* Page behavior for the offline explorer.
 *
 * Read initialize() and renderActiveView() first. Each view has its own scope
 * and controls. Calculations live in core.js so that they can be independently
 * tested without a browser. This file never trains a model or sends data away.
 */

"use strict";

(() => {
  const data = JSON.parse(document.getElementById("explorer-data").textContent);
  const math = window.TowerMath;
  const primary = data.models.k8_seed42;
  const allYears = [...new Set(data.posts.map((post) => post.year))].sort();
  const allAuthors = [
    ...new Set(data.posts.flatMap((post) => post.authors)),
  ].sort();
  let activeView = window.TowerNavigation.viewFromHash(window.location.hash);
  let topic = 1;
  let detailYear = "all";
  let postLimit = 12;
  let auditLimit = 15;
  let chosenWord = "";
  let rankedSelection = [];

  function byId(id) {
    return document.getElementById(id);
  }

  function element(tag, className = "", text = "") {
    // User-supplied titles and names are text, never executable HTML.
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function replaceContents(id, children) {
    byId(id).replaceChildren(...children);
  }

  function announce(message) {
    byId("status").textContent = message;
  }
  function percentage(value) {
    return (100 * value).toFixed(1) + "%";
  }
  function integer(value) {
    return value.toLocaleString("en-US");
  }

  function options(id, rows, selected) {
    const select = byId(id);
    select.replaceChildren();
    for (const row of rows) {
      const option = element("option", "", row.label);
      option.value = String(row.value);
      select.append(option);
    }
    if (selected !== undefined) select.value = String(selected);
  }

  function safePostLink(post) {
    // The XML is a source of evidence, not permission to execute arbitrary URLs.
    try {
      const address = new URL(post.url);
      if (["http:", "https:"].includes(address.protocol)) {
        const link = element("a", "post-title", post.title);
        link.href = address.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        return link;
      }
    } catch (_) {
      /* A malformed URL is displayed as ordinary text below. */
    }
    return element("span", "post-title", post.title);
  }

  function emptyMessage(message = "No posts match these choices.") {
    return element("p", "empty", message);
  }

  function renderBars(containerId, rows, settings) {
    // A directly labelled horizontal bar works at small widths and with a
    // keyboard. Clicking the label supplies the same detail as a pointer hover.
    if (!rows.length) {
      replaceContents(containerId, [
        emptyMessage("No values match these choices."),
      ]);
      return;
    }
    const maximum =
      settings.maximum || Math.max(...rows.map((row) => row.value), 0.001);
    const list = element("ol", "bar-list");
    list.setAttribute("aria-label", settings.description);
    for (const [rowIndex, row] of rows.entries()) {
      const item = element("li", "bar-row");
      const label = element(
        settings.onSelect ? "button" : "span",
        "bar-label",
        row.label,
      );
      if (settings.onSelect) {
        label.type = "button";
        label.id = containerId + "-choice-" + rowIndex;
        label.addEventListener("click", () => {
          const previousView = activeView;
          settings.onSelect(row);
          // Rebuilding a chart must not strand keyboard focus on the page body.
          if (activeView === previousView) byId(label.id)?.focus();
        });
      }
      const track = element("span", "bar-track");
      track.setAttribute("aria-hidden", "true");
      const fill = element("span", "bar-fill");
      fill.style.setProperty(
        "--bar-size",
        (100 * Math.max(0, row.value)) / maximum + "%",
      );
      track.append(fill);
      const value = element("span", "bar-value", settings.format(row.value));
      item.title = row.detail || row.label + ": " + settings.format(row.value);
      item.append(label, track, value);
      list.append(item);
    }
    replaceContents(containerId, [list]);
  }

  function renderPostList(
    containerId,
    posts,
    limit,
    includeWeights = false,
    audit = false,
  ) {
    if (!posts.length) {
      replaceContents(containerId, [emptyMessage()]);
      return;
    }
    const list = element("ol", "post-list");
    for (const post of posts.slice(0, limit)) {
      const item = element("li");
      item.append(safePostLink(post));
      if (includeWeights)
        item.append(
          element("span", "post-weight", " · " + percentage(post.weight)),
        );
      item.append(
        element("p", "post-meta", post.year + " · " + post.authors.join("; ")),
      );
      if (audit) {
        item.append(
          element(
            "p",
            "post-meta",
            post.status +
              " · " +
              post.kind +
              " · Posting account: " +
              post.creator,
          ),
        );
      } else if (post.cohortNames) {
        item.append(
          element(
            "p",
            "post-meta",
            post.cohortNames.length
              ? "Roster evidence: " + post.cohortNames.join("; ")
              : "No confirmed same-semester roster match in this evidence",
          ),
        );
      }
      list.append(item);
    }
    replaceContents(containerId, [list]);
  }

  function currentTopicChoices() {
    return {
      firstYear: Number(byId("first-year").value),
      lastYear: Number(byId("last-year").value),
      cohortOnly: byId("cohort-only").checked,
      author: byId("include-author").value,
      excludeAuthor: byId("exclude-author").value,
    };
  }

  function renderTopicHeatmap(rows, model) {
    if (!rows.length) {
      replaceContents("topic-heatmap", [emptyMessage()]);
      return;
    }
    const table = element("table", "heatmap");
    const caption = element(
      "caption",
      "secondary",
      "Mean topic weights · select a percentage or a topic heading",
    );
    table.append(caption);
    const head = element("thead");
    const heading = element("tr");
    heading.append(element("th", "", "Academic year"));
    for (const item of model.topics) {
      const cell = element("th");
      cell.scope = "col";
      const button = element("button", "", "T" + item.id);
      button.type = "button";
      button.id = "topic-heading-" + item.id;
      button.title = item.label;
      button.setAttribute(
        "aria-label",
        "Inspect topic " + item.id + ": " + item.label,
      );
      button.addEventListener("click", () => {
        topic = item.id;
        postLimit = 12;
        renderTopics();
        byId(button.id)?.focus();
        announce("Selected topic " + topic + ": " + item.label);
      });
      cell.append(button);
      heading.append(cell);
    }
    head.append(heading);
    const body = element("tbody");
    const maximum = Math.max(...rows.flatMap((row) => row.weights), 0.001);
    for (const row of rows) {
      const line = element("tr");
      const year = element("th", "", row.year);
      year.scope = "row";
      year.append(element("span", "year-count", " · n=" + row.posts));
      line.append(year);
      row.weights.forEach((value, index) => {
        const cell = element("td");
        const button = element(
          "button",
          "heat-cell",
          (100 * value).toFixed(0) + "%",
        );
        button.type = "button";
        button.id = "cell-" + row.year.slice(0, 4) + "-" + index;
        button.style.setProperty("--intensity", (45 * value) / maximum + "%");
        button.setAttribute(
          "aria-pressed",
          String(topic === index && detailYear === row.year),
        );
        button.setAttribute(
          "aria-label",
          row.year +
            ", " +
            model.topics[index].label +
            ": " +
            percentage(value) +
            ", " +
            row.posts +
            " posts",
        );
        button.title = percentage(value) + " · " + model.topics[index].label;
        button.addEventListener("click", () => {
          topic = index;
          detailYear = row.year;
          postLimit = 12;
          renderTopics();
          byId(button.id)?.focus();
          announce(
            "Selected " +
              row.year +
              ", topic " +
              index +
              ": " +
              percentage(value),
          );
        });
        cell.append(button);
        line.append(cell);
      });
      body.append(line);
    }
    table.append(head, body);
    replaceContents("topic-heatmap", [table]);
  }

  function renderTopics() {
    const model = data.models[byId("topic-model").value];
    topic = Math.min(topic, model.count - 1);
    const choices = currentTopicChoices();
    const invalidYears = choices.firstYear > choices.lastYear;
    byId("topic-error").hidden = !invalidYears;
    byId("topic-error").textContent = invalidYears
      ? "The first academic year must not follow the last academic year."
      : "";
    const posts = invalidYears ? [] : math.filterPosts(data.posts, choices);
    const rows = math.topicAverages(
      posts,
      model,
      byId("topic-weighting").value,
    );
    const availableYears = rows.map((row) => row.year);
    if (detailYear !== "all" && !availableYears.includes(detailYear))
      detailYear = "all";
    options(
      "detail-year",
      [
        { value: "all", label: "All filtered years" },
        ...availableYears.map((year) => ({ value: year, label: year })),
      ],
      detailYear,
    );
    byId("topic-scope").textContent =
      integer(posts.length) +
      " of 299 modeled posts · " +
      rows.length +
      " academic years · " +
      model.count +
      " topics, seed " +
      model.seed +
      " · darker fill means greater weight within this view";
    renderTopicHeatmap(rows, model);
    const selectedTopic = model.topics[topic];
    byId("selected-topic-heading").textContent =
      "T" + topic + " · " + selectedTopic.label;
    byId("topic-label-note").textContent = selectedTopic.interpretiveLabel
      ? "Agent-developed interpretive label for the eight-topic, seed-42 run; independent human confirmation is not recorded. Topic numbers in other runs are different."
      : "Described by this run's leading words. No interpretive label is assigned to this alternative run.";
    renderBars(
      "topic-word-bars",
      selectedTopic.words
        .slice(0, 15)
        .map(([word, probability]) => ({ label: word, value: probability })),
      {
        description: "Leading word probabilities for selected topic",
        format: percentage,
      },
    );
    rankedSelection = math.rankPosts(posts, model, topic, detailYear);
    byId("ranked-posts-caption").textContent =
      rankedSelection.length +
      " matching posts; ranked by this topic's individual post weight. Showing up to " +
      postLimit +
      ".";
    renderPostList("ranked-posts", rankedSelection, postLimit, true);
    byId("more-posts").hidden = rankedSelection.length <= postLimit;
    byId("export-posts").disabled = rankedSelection.length === 0;
  }

  function languagePosts() {
    return data.posts.filter(
      (post) =>
        (byId("word-year").value === "all" ||
          post.year === byId("word-year").value) &&
        (!byId("word-cohort").checked || post.cohortNames.length > 0),
    );
  }

  function renderWordFrequencies() {
    const posts = languagePosts();
    const measure = byId("word-measure").value;
    const rows = math.wordFrequencies(posts, data.dictionary, measure);
    byId("word-scope").textContent =
      posts.length +
      " modeled posts · " +
      integer(posts.reduce((sum, post) => sum + post.cleanedTokens, 0)) +
      " cleaned word occurrences · before MALLET vocabulary pruning";
    renderBars(
      "frequency-bars",
      rows.slice(0, 20).map((row) => ({
        label: row.word,
        value: row[measure],
        word: row.word,
        detail:
          row.word +
          ": " +
          row.count +
          " occurrences across " +
          row.documents +
          " selected posts",
      })),
      {
        description: "Most frequent cleaned words",
        format: integer,
        onSelect: (row) => {
          chosenWord = row.word;
          renderWordFrequencies();
          announce("Selected word " + row.word);
        },
      },
    );
    const dictionaryIndex = data.dictionary.indexOf(chosenWord);
    if (dictionaryIndex >= 0 && chosenWord) {
      const matches = posts.filter((post) =>
        post.wordCounts.some(([index]) => index === dictionaryIndex),
      );
      byId("selected-word-note").textContent =
        "Posts containing “" +
        chosenWord +
        "” · " +
        matches.length +
        " matches; up to eight shown. Presence does not establish the writer's stance.";
      renderPostList("word-posts", matches, 8);
    } else {
      byId("selected-word-note").textContent =
        "Select a word to inspect posts containing it.";
      replaceContents("word-posts", []);
    }
  }

  function renderPhrases() {
    const measure = byId("phrase-measure").value;
    const entered = Number(byId("phrase-minimum").value);
    const minimum = Number.isFinite(entered)
      ? Math.max(3, Math.min(299, Math.trunc(entered)))
      : 3;
    byId("phrase-minimum").value = String(minimum);
    const rows = math
      .phraseRanking(data.phrases, measure, minimum)
      .slice(0, 18);
    renderBars(
      "phrase-bars",
      rows.map((row) => ({ ...row, label: row.phrase, value: row[measure] })),
      {
        description: "Whole-corpus associated phrases",
        format: ["count", "documents"].includes(measure)
          ? integer
          : (value) => value.toFixed(2),
        onSelect: (row) => {
          byId("selected-phrase").textContent =
            "“" +
            row.phrase +
            "”: " +
            row.count +
            " occurrences in " +
            row.documents +
            " posts · PMI " +
            row.pmi.toFixed(2) +
            " · log-likelihood " +
            row.likelihood.toFixed(2) +
            " · whole 299-post corpus";
        },
      },
    );
    byId("selected-phrase").textContent =
      "Select a phrase for both association scores and its occurrence/post counts.";
  }

  function renderContrasts() {
    const recent = byId("contrast-direction").value === "recent";
    const rows = data.contrasts
      .filter((row) =>
        recent
          ? row.recent >= 15 && row.ratio > 0
          : row.early >= 15 && row.ratio < 0,
      )
      .slice()
      .sort((a, b) => (recent ? b.ratio - a.ratio : a.ratio - b.ratio))
      .slice(0, 15);
    renderBars(
      "contrast-bars",
      rows.map((row) => ({
        ...row,
        label: row.word,
        value: Math.abs(row.ratio),
      })),
      {
        description: "Early/recent smoothed vocabulary contrasts",
        format: (value) => value.toFixed(2),
        onSelect: (row) => {
          byId("selected-contrast").textContent =
            row.word +
            ": " +
            row.early +
            " occurrences in 2012–16; " +
            row.recent +
            " in 2024–26. Signed recent/early log₂ ratio: " +
            row.ratio.toFixed(2) +
            ".";
        },
      },
    );
    byId("selected-contrast").textContent =
      "Select a word to inspect the underlying period counts.";
  }

  function openModel(runId, selectedTopic = 0) {
    byId("topic-model").value = runId;
    topic = selectedTopic;
    detailYear = "all";
    showView("topics");
    document.querySelector('[data-view="topics"]').focus();
    announce(
      "Exploring " +
        data.models[runId].count +
        " topics, seed " +
        data.models[runId].seed +
        ". Existing topic filters remain active.",
    );
  }

  function renderModelChecks() {
    const measure = byId("quality-measure").value;
    renderBars(
      "quality-bars",
      Object.values(data.models).map((model) => ({
        id: model.id,
        label: model.count + " topics · seed " + model.seed,
        value: model[measure],
        detail:
          "NPMI " +
          model.npmi.toFixed(3) +
          "; diversity " +
          percentage(model.diversity),
      })),
      {
        description: "Comparison of fitted model runs",
        format:
          measure === "diversity" ? percentage : (value) => value.toFixed(3),
        onSelect: (row) => openModel(row.id),
      },
    );
    const selected = Number(byId("stability-topic").value);
    const matches = data.stability.filter((row) => row.topic === selected);
    renderBars(
      "stability-bars",
      matches.map((row) => ({
        ...row,
        label: "Seed " + row.seed + " · matched T" + row.match,
        value: row.distance,
      })),
      {
        description: "Matched topic distances across seeds",
        maximum: 1,
        format: (value) => value.toFixed(3),
        onSelect: (row) => openModel("k8_seed" + row.seed, row.match),
      },
    );
    replaceContents(
      "stability-detail",
      matches.map((row) =>
        element(
          "p",
          "secondary",
          "Seed " +
            row.seed +
            ": leading-word Jaccard overlap " +
            percentage(row.overlap) +
            ". Select its bar label to inspect the matched alternative topic.",
        ),
      ),
    );
    renderAuthorComparison();
  }

  function renderAuthorComparison() {
    const selectedTopic = Number(byId("author-topic").value);
    const excluded = byId("sensitivity-author").value;
    const table = element("table");
    const head = element("tr");
    [
      "Academic year",
      "All included",
      "Without selected writer",
      "Roster matched",
    ].forEach((label) => head.append(element("th", "", label)));
    const thead = element("thead");
    thead.append(head);
    table.append(thead);
    const body = element("tbody");
    for (const year of ["2023–2024", "2024–2025", "2025–2026"]) {
      const posts = data.posts.filter((post) => post.year === year);
      const groups = [
        posts,
        posts.filter((post) => !post.authors.includes(excluded)),
        posts.filter((post) => post.cohortNames.length),
      ];
      const row = element("tr");
      row.append(element("th", "", year));
      for (const group of groups) {
        const average = math.topicAverages(group, primary)[0];
        row.append(
          element(
            "td",
            "",
            average
              ? percentage(average.weights[selectedTopic]) +
                  " · n=" +
                  group.length
              : "Unavailable · n=0",
          ),
        );
      }
      body.append(row);
    }
    table.append(body);
    replaceContents("author-comparison", [table]);
  }

  function renderPublications() {
    const counts = math.publicationCounts(data.publications);
    const maximum = Math.max(...counts.map((row) => row.local + row.curated));
    const legend = element("div", "legend");
    for (const [label, style] of [
      ["Local/unflagged", ""],
      ["Curated/source-linked", "curated"],
    ]) {
      const part = element("span");
      part.append(
        element("span", "swatch " + style),
        document.createTextNode(label),
      );
      legend.append(part);
    }
    const list = element("ol", "bar-list");
    for (const count of counts) {
      const row = element("li", "bar-row");
      const button = element("button", "bar-label", count.year);
      button.type = "button";
      button.addEventListener("click", () => {
        byId("audit-year").value = count.year;
        auditLimit = 15;
        renderAuditPosts();
        announce("Selected publishing records for " + count.year);
      });
      const track = element("span", "stack-track");
      track.setAttribute("aria-hidden", "true");
      const local = element("span", "stack-local");
      local.style.width = (100 * count.local) / maximum + "%";
      const curated = element("span", "stack-curated");
      curated.style.width = (100 * count.curated) / maximum + "%";
      track.append(local, curated);
      row.append(
        button,
        track,
        element("span", "bar-value", String(count.local + count.curated)),
      );
      row.title =
        count.local +
        " local; " +
        count.curated +
        " curated; " +
        count.drafts +
        " drafts excluded from bar";
      list.append(row);
    }
    replaceContents("publication-bars", [legend, list]);
    renderAuditPosts();
    renderMotifs();
    renderHeadlineThemes();
  }

  function renderAuditPosts() {
    const kind = byId("audit-kind").value;
    const year = byId("audit-year").value;
    const rows = data.publications.filter(
      (post) =>
        (year === "all" || post.year === year) &&
        (kind === "draft"
          ? post.status === "draft"
          : post.status === "publish") &&
        (kind !== "local" || post.kind === "local/unflagged") &&
        (kind !== "curated" || post.kind !== "local/unflagged"),
    );
    byId("audit-scope").textContent =
      rows.length +
      " records match · showing up to " +
      auditLimit +
      ". The bars above always count published posts only.";
    renderPostList("audit-posts", rows, auditLimit, false, true);
    byId("more-audit").hidden = rows.length <= auditLimit;
  }

  function renderMotifs() {
    const motif = byId("motif-select").value;
    const rows = math.motifCounts(data.motifs, motif);
    renderBars(
      "motif-bars",
      rows.map((row) => ({
        ...row,
        label: row.period + " · n=" + row.posts,
        value: row.proportion,
      })),
      {
        description: "Dictionary motif presence by academic-year period",
        maximum: 1,
        format: percentage,
        onSelect: (row) => {
          byId("motif-selection").textContent =
            motif +
            ": " +
            row.count +
            " of " +
            row.posts +
            " posts in " +
            row.period +
            " contain a matching term. This does not validate a thematic reading.";
        },
      },
    );
    byId("motif-selection").textContent =
      "Select a period to see its numerator and denominator.";
  }

  function renderHeadlineThemes() {
    // This deliberately uses the earlier title/tag counts, not MALLET weights
    // or the narrower 299-post modeling corpus.
    const theme = byId("headline-theme").value;
    const rows = data.headlineThemes.map((row) => ({
      label: row.year + " · n=" + row.posts,
      value: row.counts[theme] / row.posts,
      year: row.year,
      count: row.counts[theme],
      posts: row.posts,
    }));
    renderBars("headline-bars", rows, {
      description: "Title and tag keyword signals by academic year",
      maximum: 1,
      format: percentage,
      onSelect: (row) => {
        byId("headline-selection").textContent =
          theme +
          ": " +
          row.count +
          " of " +
          row.posts +
          " local/unflagged posts in " +
          row.year +
          " match the title/category/tag dictionary.";
      },
    });
    byId("headline-selection").textContent =
      "Select an academic year to inspect its numerator and denominator.";
  }

  function renderActiveView() {
    if (activeView === "topics") renderTopics();
    if (activeView === "themes") window.TowerThemes.open();
    if (activeView === "language") {
      renderWordFrequencies();
      renderPhrases();
      renderContrasts();
    }
    if (activeView === "checks") renderModelChecks();
    if (activeView === "audit") renderPublications();
    if (activeView === "random") window.TowerReader.open();
    if (activeView === "index") window.TowerIndex.open();
  }

  function showView(view, updateAddress = true) {
    if (!window.TowerNavigation.TOWER_VIEWS.includes(view)) return;
    activeView = view;
    for (const name of window.TowerNavigation.TOWER_VIEWS) {
      byId("view-" + name).hidden = name !== view;
      document
        .querySelector('[data-view="' + name + '"]')
        .setAttribute("aria-pressed", String(name === view));
    }
    renderActiveView();
    if (updateAddress) {
      try { window.history.pushState(null, "", window.TowerNavigation.hashForView(view, window.location.hash)); }
      catch (_) { /* The visible view still works in restrictive local-file hosts. */ }
    }
    byId("view-link-address").value = window.location.href;
  }

  function exportRankedPosts() {
    const model = data.models[byId("topic-model").value];
    const choices = currentTopicChoices();
    const rows = rankedSelection.map((post) => ({
      model: model.id,
      topic,
      topic_description: model.topics[topic].label,
      post_id: post.id,
      title: post.title,
      academic_year: post.year,
      credited_writers: post.authors.join("; "),
      roster_matches: post.cohortNames.join("; "),
      topic_weight: post.weight,
      writer_filter: choices.author,
      excluded_writer: choices.excludeAuthor,
      roster_required: choices.cohortOnly,
      url: post.url,
    }));
    const blob = new Blob([math.csvText(rows)], {
      type: "text/csv;charset=utf-8",
    });
    const address = URL.createObjectURL(blob);
    const link = element("a");
    link.href = address;
    link.download = "tagging-the-tower-ranked-posts.csv";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(address), 1000);
    announce(
      "Exported " +
        rows.length +
        " matching ranked posts; the file records model and filter choices.",
    );
  }

  function initialize() {
    byId("snapshot").textContent =
      "299 modeled posts · five fitted models · published records through October 2026 · 2026–27 is partial";
    options(
      "topic-model",
      Object.values(data.models).map((model) => ({
        value: model.id,
        label:
          model.count +
          " topics · seed " +
          model.seed +
          (model.id === "k8_seed42" ? " · interpretive labels" : ""),
      })),
      "k8_seed42",
    );
    const yearOptions = allYears.map((year) => ({
      value: year.slice(0, 4),
      label: year,
    }));
    options("first-year", yearOptions, "2012");
    options("last-year", yearOptions, "2026");
    const authors = allAuthors.map((author) => ({
      value: author,
      label: author,
    }));
    options(
      "include-author",
      [{ value: "", label: "All credited writers" }, ...authors],
      "",
    );
    options(
      "exclude-author",
      [{ value: "", label: "Exclude nobody" }, ...authors],
      "",
    );
    options("sensitivity-author", authors, "Parisa Setayesh");
    const years = [
      { value: "all", label: "All academic years" },
      ...allYears.map((year) => ({ value: year, label: year })),
    ];
    options("word-year", years, "all");
    options("audit-year", years, "all");
    const primaryTopics = primary.topics.map((item) => ({
      value: item.id,
      label: "T" + item.id + " · " + item.label,
    }));
    options("stability-topic", primaryTopics, 1);
    options("author-topic", primaryTopics, 1);
    options(
      "motif-select",
      data.motifNames.map((name) => ({ value: name, label: name })),
      data.motifNames[0],
    );
    options(
      "headline-theme",
      data.headlineNames.map((name) => ({
        value: name,
        label: name,
      })),
      "AI & machine learning",
    );

    // The author-first route reuses the complete credit register, including aliases.
    byId("overview-author-form").addEventListener("submit", (event) => {
      event.preventDefault();
      showView("credits");
      const search = byId("credits-search");
      search.value = byId("overview-author-search").value.trim();
      byId("credits-context").value = "all";
      search.dispatchEvent(new Event("input", { bubbles: true }));
      search.focus();
    });
    // Overview route controls reuse the existing tab switch, preserving filters.
    // They are separate from navigation tabs so only one tab is marked selected.
    document.querySelectorAll("[data-open-view]").forEach((button) =>
      button.addEventListener("click", () => {
        showView(button.dataset.openView);
        announce("Opened " + button.dataset.openView + " view.");
        document.querySelector('[data-view="' + button.dataset.openView + '"]').focus();
      }),
    );
    document.querySelectorAll("[data-view]").forEach((button) =>
      button.addEventListener("click", () => {
        showView(button.dataset.view);
        announce(button.textContent);
      }),
    );
    [
      "topic-model",
      "topic-weighting",
      "first-year",
      "last-year",
      "include-author",
      "exclude-author",
      "cohort-only",
    ].forEach((id) =>
      byId(id).addEventListener("change", () => {
        detailYear = "all";
        postLimit = 12;
        renderTopics();
        announce(byId("topic-scope").textContent);
      }),
    );
    byId("detail-year").addEventListener("change", () => {
      detailYear = byId("detail-year").value;
      postLimit = 12;
      renderTopics();
    });
    byId("more-posts").addEventListener("click", () => {
      postLimit += 20;
      renderTopics();
    });
    byId("export-posts").addEventListener("click", exportRankedPosts);
    byId("reset-topics").addEventListener("click", () => {
      byId("topic-model").value = "k8_seed42";
      byId("topic-weighting").value = "posts";
      byId("first-year").value = "2012";
      byId("last-year").value = "2026";
      byId("include-author").value = "";
      byId("exclude-author").value = "";
      byId("cohort-only").checked = false;
      topic = 1;
      detailYear = "all";
      postLimit = 12;
      renderTopics();
      announce("Restored the primary model and all 299 modeled posts.");
    });
    ["word-year", "word-measure", "word-cohort"].forEach((id) =>
      byId(id).addEventListener("change", () => {
        chosenWord = "";
        renderWordFrequencies();
        announce(byId("word-scope").textContent);
      }),
    );
    ["phrase-measure", "phrase-minimum"].forEach((id) =>
      byId(id).addEventListener("change", renderPhrases),
    );
    byId("contrast-direction").addEventListener("change", renderContrasts);
    ["quality-measure", "stability-topic"].forEach((id) =>
      byId(id).addEventListener("change", renderModelChecks),
    );
    ["author-topic", "sensitivity-author"].forEach((id) =>
      byId(id).addEventListener("change", renderAuthorComparison),
    );
    ["audit-year", "audit-kind"].forEach((id) =>
      byId(id).addEventListener("change", () => {
        auditLimit = 15;
        renderAuditPosts();
      }),
    );
    byId("more-audit").addEventListener("click", () => {
      auditLimit += 20;
      renderAuditPosts();
    });
    byId("motif-select").addEventListener("change", renderMotifs);
    byId("headline-theme").addEventListener("change", renderHeadlineThemes);
    // Back/forward and reload restore the named view. Research filters remain local.
    window.addEventListener("hashchange", () => showView(window.TowerNavigation.viewFromHash(window.location.hash), false));
    byId("copy-view-link").addEventListener("click", async () => {
      const address = new URL(window.location.href);
      address.hash = window.TowerNavigation.hashForView(activeView, window.location.hash);
      byId("view-link-address").value = address.href;
      try {
        await navigator.clipboard.writeText(address.href);
        byId("view-link-result").textContent = "Copied the view link. Research filters and individual post selections are not included.";
      } catch (_) {
        byId("view-link-address").select();
        byId("view-link-result").textContent = "Select and copy the link above. This browser does not permit automatic clipboard access.";
      }
    });
    showView(activeView, false);
  }

  initialize();
})();
