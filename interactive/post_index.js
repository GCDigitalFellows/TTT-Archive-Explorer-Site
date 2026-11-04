/* Search, grouping and a bipartite author–year network for the offline archive.
 * Start with open() and render(). Pure filtering/counting lives in index_core.js.
 * Drafts remain metadata-only. All source strings are inserted as text.
 */
"use strict";
(() => {
  const byId = (id) => document.getElementById(id);
  let posts,
    model,
    math,
    ready = false,
    limit = 50,
    selection = [];
  let networkSelectionOpen = false;
  function node(tag, text = "", className = "") {
    const n = document.createElement(tag);
    n.textContent = text;
    n.className = className;
    return n;
  }
  function options(id, entries) {
    byId(id).replaceChildren(
      ...entries.map(([value, text]) => {
        const option = node("option", text);
        option.value = value;
        return option;
      }),
    );
  }
  function choices() {
    return {
      evidence: byId("index-evidence").value,
      membershipBasis: byId("index-membership").value,
      query: byId("index-search").value,
      searchMode: byId("index-search-mode").value,
      year: byId("index-year").value,
      author: byId("index-author").value,
      status: byId("index-status").value,
      kind: byId("index-kind").value,
      topic: byId("index-topic").value,
      theme: byId("index-theme").value,
      threshold: Number(byId("index-threshold").value),
    };
  }
  function topicLabel(id) {
    return id === null
      ? "No saved MALLET profile"
      : "T" + id + " · " + model.topics[id].label;
  }
  function groupKeys(post) {
    const group = byId("index-group").value;
    if (group === "author")
      return post.authors.length
        ? [...new Set(post.authors)]
        : ["No recorded credit"];
    if (group === "theme") return post.themeSignals?.length ? post.themeSignals : ["No title/tag theme signal"];
    if (group === "topic")
      return [topicLabel(math.strongestTopic(post, model))];
    return [post.year];
  }
  function card(post) {
    const article = node("article", "", "index-card");
    const title = node("h4");
    // Draft permalinks may point at unpublished records; never present them as public posts.
    let heading = node("span", post.title);
    try {
      const url = new URL(post.url);
      if (
        post.status === "publish" &&
        ["https:", "http:"].includes(url.protocol)
      ) {
        heading = node("a", post.title);
        heading.href = url.href;
        heading.target = "_blank";
        heading.rel = "noopener noreferrer";
      }
    } catch (_) {
      /* Invalid source URLs remain plain text. */
    }
    title.append(heading);
    article.append(title);
    if (post.status === "publish") {
      const read = node("button", "Read excerpt and full saved text");
      read.type = "button";
      read.addEventListener("click", () => window.TowerReader.show(post.id, read));
      article.append(read);
      const snippet = window.TowerSearch.snippet(post.paragraphs || [], choices().query, choices().searchMode);
      if (snippet) article.append(node("p", snippet, "secondary"));
    }
    article.append(
      node(
        "p",
        post.date +
          " · " +
          post.year +
          " · " +
          (post.status === "publish" ? "Published" : "DRAFT · metadata only") +
          " · " +
          (post.kind === "local/unflagged"
            ? "Local / unflagged"
            : "Curated / source-linked"),
        "secondary",
      ),
    );
    article.append(
      node(
        "p",
        (post.kind === "local/unflagged"
          ? (post.creditStatus === "provisional posting-account attribution"
              ? "Account-only credit (writer unverified): "
              : "Credited writer(s): ")
          : "Credited source writer(s): ") +
          (post.authors.join(", ") || "Not recorded"),
      ),
    );
    if (post.kind !== "local/unflagged")
      article.append(
        node(
          "p",
          "Recorded source author: " + (post.sourceAuthor || "Not recorded"),
        ),
      );
    const weights = model.mixtures[post.id];
    if (weights) {
      const leading = weights
        .map((weight, id) => ({ weight, id }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3);
      article.append(
        node(
          "p",
          "Leading topic weights: " +
            leading
              .map(
                ({ weight, id }) =>
                  topicLabel(id) + " (" + (weight * 100).toFixed(1) + "%)",
              )
              .join(" · "),
          "secondary",
        ),
      );
    } else
      article.append(node("p", "No saved MALLET topic profile", "secondary"));
    article.append(node("p", "Title/tag theme signals: " + ((post.themeSignals || []).join("; ") || "No dictionary match"), "secondary"));
    if (post.tags.length)
      article.append(node("p", "Tags: " + post.tags.join(", "), "secondary"));
    article.append(
      node("p", "Review disposition: " + post.authorshipTier + " · Credit basis: " + post.creditStatus, "secondary"),
    );
    const evidence = node("details");
    evidence.append(
      node("summary", "Attribution evidence"),
      node("p", "Original credit: " + (post.originalAuthors || post.authors).join("; ")),
      node("p", post.authorEvidence + " · WordPress account: " + post.creator),
    );
    if (post.creditQuote) evidence.append(node("blockquote", post.creditQuote));
    article.append(evidence);
    return article;
  }
  function renderResults() {
    const sorted = [...selection].sort(
      (a, b) =>
        groupKeys(a)[0].localeCompare(groupKeys(b)[0]) ||
        b.date.localeCompare(a.date) ||
        a.title.localeCompare(b.title),
    );
    const visible = sorted.slice(0, limit);
    const groups = new Map();
    for (const post of visible)
      for (const key of groupKeys(post)) {
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(post);
      }
    const container = byId("index-results");
    container.replaceChildren();
    for (const [key, rows] of [...groups].sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      const section = node("section", "", "index-group");
      section.append(node("h3", key));
      for (const post of rows) section.append(card(post));
      container.append(section);
    }
    byId("index-scope").textContent =
      selection.length +
      " of " +
      posts.length +
      " records match · " +
      selection.filter((p) => p.status === "draft").length +
      " drafts · showing " +
      visible.length +
      " unique posts" +
      (byId("index-group").value === "author"
        ? ". Coauthored posts appear under each credited name."
        : ".");
    byId("index-more").hidden = limit >= selection.length;
    byId("index-export").disabled = !selection.length;
    if (!selection.length)
      container.append(node("p", "No records match. Try clearing a filter."));
  }
  function svg(tag, attributes = {}, text) {
    const result = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [key, value] of Object.entries(attributes))
      result.setAttribute(key, String(value));
    if (text !== undefined) result.textContent = text;
    return result;
  }
  function renderNetwork() {
    const allEdges = math.authorYearEdges(selection);
    const totals = new Map();
    for (const edge of allEdges)
      totals.set(edge.author, (totals.get(edge.author) || 0) + edge.count);
    const ranked = [...totals].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
    const setting = byId("network-limit").value;
    const authors = ranked
      .slice(0, setting === "all" ? ranked.length : Number(setting))
      .map(([name]) => name);
    const edges = allEdges.filter((e) => authors.includes(e.author));
    const years = [...new Set(edges.map((e) => e.year))].sort();
    const mount = byId("author-year-network");
    mount.replaceChildren();
    byId("network-scope").textContent =
      authors.length +
      " of " +
      ranked.length +
      " credited authors shown · " +
      years.length +
      " academic years · " +
      edges.length +
      " author–year connections. Author ranking uses post credits within the current filters.";
    // Count distinct posts behind the displayed authors, not duplicated coauthor credits.
    const shownPosts = selection.filter((post) => post.status === "publish" &&
      post.kind === "local/unflagged" && post.authors.some((name) => authors.includes(name)));
    const provisional = shownPosts.filter((post) => post.creditStatus === "provisional posting-account attribution").length;
    byId("network-uncertainty").textContent = `${provisional} of ${shownPosts.length} distinct posts behind the displayed network use provisional posting-account attribution. Other credits use reviewed evidence or author taxonomy. The network records publication credits, not verified personal productivity. Compare the Credit evidence filter above; changing it changes the population.`;
    // The table describes precisely the same limited graph, avoiding a hidden denominator.
    const table = node("table");
    const caption = node(
      "caption",
      "Author–year connections shown in the network",
    );
    table.append(caption);
    const head = node("thead"),
      hr = node("tr");
    for (const label of [
      "Credited author",
      "Academic year",
      "Published local posts",
      "Provisional account credits",
    ]) {
      const th = node("th", label);
      th.scope = "col";
      hr.append(th);
    }
    head.append(hr);
    table.append(head);
    const body = node("tbody");
    for (const edge of edges) {
      const row = node("tr");
      for (const value of [edge.author, edge.year, edge.count, shownPosts.filter((p) => p.year === edge.year && p.authors.includes(edge.author) && p.creditStatus === "provisional posting-account attribution").length])
        row.append(node("td", String(value)));
      body.append(row);
    }
    table.append(body);
    byId("network-table").replaceChildren(table);
    if (!edges.length) {
      mount.append(
        node(
          "p",
          "No published local author–year connections match these filters.",
        ),
      );
      return;
    }
    const height = Math.max(560, authors.length * 34 + 80);
    const graph = svg("svg", {
      viewBox: `0 0 1000 ${height}`,
      role: "group",
      "aria-label": "Author–year publication network",
      class: "author-year-svg",
    });
    graph.append(
      svg(
        "title",
        {},
        "Authors and academic years: select a node to filter the post index",
      ),
    );
    const y = (index, count) =>
      count === 1 ? height / 2 : 55 + (index * (height - 110)) / (count - 1);
    const authorPositions = new Map(
      authors.map((author, i) => [author, y(i, authors.length)]),
    );
    const yearPositions = new Map(
      years.map((year, i) => [year, y(i, years.length)]),
    );
    const paths = [];
    for (const edge of edges) {
      const ay = authorPositions.get(edge.author),
        yy = yearPositions.get(edge.year);
      const path = svg("path", {
        d: `M 350 ${ay} C 480 ${ay}, 550 ${yy}, 680 ${yy}`,
        fill: "none",
        class: "network-edge",
        "stroke-width": 1 + Math.sqrt(edge.count) * 1.5,
      });
      path.append(
        svg(
          "title",
          {},
          `${edge.author} · ${edge.year}: ${edge.count} published local posts`,
        ),
      );
      graph.append(path);
      paths.push({ path, edge });
    }
    function highlight(kind, value) {
      for (const { path, edge } of paths)
        path.classList.toggle(
          "network-dim",
          value !== null && edge[kind] !== value,
        );
    }
    function addNode(kind, value, x, yy, total) {
      const group = svg("g", {
        tabindex: "0",
        role: "button",
        "aria-label": `${value}: ${total} post credits. Filter by this ${kind === "author" ? "author" : "academic year"}.`,
        class: "network-node",
      });
      group.append(
        svg("circle", {
          cx: x,
          cy: yy,
          r: 5 + Math.min(11, Math.sqrt(total)),
          class: kind === "author" ? "network-author" : "network-year",
        }),
      );
      group.append(
        svg(
          "text",
          {
            x: kind === "author" ? x - 22 : x + 22,
            y: yy + 5,
            "text-anchor": kind === "author" ? "end" : "start",
          },
          value,
        ),
      );
      group.append(svg("title", {}, `${value}: ${total} post credits`));
      group.addEventListener("mouseenter", () => highlight(kind, value));
      group.addEventListener("mouseleave", () => highlight(kind, null));
      group.addEventListener("focus", () => highlight(kind, value));
      group.addEventListener("blur", () => highlight(kind, null));
      function select() {
        byId(kind === "author" ? "index-author" : "index-year").value = value;
        limit = 50;
        render();
        byId(kind === "author" ? "index-author" : "index-year").focus();
      }
      group.addEventListener("click", select);
      group.addEventListener("keydown", (event) => {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          select();
        }
      });
      graph.append(group);
    }
    for (const author of authors)
      addNode(
        "author",
        author,
        350,
        authorPositions.get(author),
        totals.get(author),
      );
    for (const year of years)
      addNode(
        "year",
        year,
        680,
        yearPositions.get(year),
        edges.filter((e) => e.year === year).reduce((n, e) => n + e.count, 0),
      );
    mount.append(graph);
  }
  function render() {
    const selecting = networkSelectionOpen || byId("index-year").value !== "all" || byId("index-author").value !== "all";
    byId("network-selection").hidden = !selecting;
    byId("network-year").value = byId("index-year").value;
    byId("network-author").value = byId("index-author").value;
    byId("network-all").setAttribute("aria-pressed", String(!selecting));
    byId("network-choose").setAttribute("aria-pressed", String(selecting));
    byId("network-credits-all").setAttribute("aria-pressed", String(byId("index-evidence").value === "all"));
    byId("network-credits-supported").setAttribute("aria-pressed", String(byId("index-evidence").value === "supported"));
    selection = math.filterIndexPosts(posts, model, choices());
    renderResults();
    renderNetwork();
  }
  function reset() {
    networkSelectionOpen = false;
    byId("index-search").value = "";
    for (const id of [
      "index-year",
      "index-author",
      "index-status",
      "index-kind",
      "index-topic",
      "index-theme",
      "index-evidence",
      "index-membership",
    ])
      byId(id).value = "all";
    byId("index-status").value = "publish";
    byId("index-search-mode").value = "words";
    byId("index-threshold").value = "0.2";
    limit = 50;
    render();
  }
  function exportCsv() {
    const rows = selection.map((post) => ({
      id: post.id,
      title: post.title,
      date: post.date,
      academic_year: post.year,
      status: post.status,
      kind: post.kind,
      credits: post.authors.join("; "),
      original_credits: (post.originalAuthors || post.authors).join("; "),
      posting_account: post.creator,
      credit_basis: post.creditStatus,
      authorship_disposition: post.authorshipTier,
      membership_basis: byId("index-membership").value,
      membership_matches: (post.membershipByBasis?.[byId("index-membership").value] || []).join("; "),
      attribution_evidence: post.creditQuote,
      source_author: post.sourceAuthor,
      title_tag_theme_signals: (post.themeSignals || []).join("; "),
      theme_filter: byId("index-theme").value,
      search_mode: byId("index-search-mode").value,
      strongest_topic: topicLabel(math.strongestTopic(post, model)),
      url: post.status === "publish" ? post.url : "",
    }));
    const url = URL.createObjectURL(
      new Blob([window.TowerMath.csvText(rows)], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const a = node("a");
    a.href = url;
    a.download = "tagging-the-tower-index.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  window.TowerIndex = {
    open() {
      if (ready) return;
      ready = true;
      const analysis = JSON.parse(byId("explorer-data").textContent);
      model = analysis.models.k8_seed42;
      math = window.TowerIndexMath;
      const reading = new Map(
        JSON.parse(byId("reader-data").textContent).map((post) => [
          post.id,
          post.paragraphs,
        ]),
      );
      posts = JSON.parse(byId("index-data").textContent).map((post) => ({
        ...post,
        paragraphs: reading.get(post.id) || [],
        searchFields: [
          post.title,
          ...post.authors,
          ...(post.originalAuthors || []),
          ...(post.authorSearchNames || []),
          post.creator,
          post.sourceAuthor,
          ...post.tags,
          ...(reading.get(post.id) || []),
        ],
      }));
      options("index-year", [
        ["all", "All academic years"],
        ...[...new Set(posts.map((p) => p.year))].sort().map((y) => [y, y]),
      ]);
      options("index-author", [
        ["all", "All credited names"],
        ...[...new Set(posts.flatMap((p) => p.authors))]
          .sort()
          .map((a) => [a, a]),
      ]);
      options("index-theme", [["all", "All title/tag theme signals"], ...analysis.headlineNames.map((theme) => [theme,theme])]);
      options("index-topic", [
        ["all", "All posts, including unmodeled"],
        ["unmodeled", "No saved MALLET profile"],
        ...model.topics.map((t) => [String(t.id), topicLabel(t.id)]),
      ]);
      for (const id of [
        "index-search-mode",
        "index-year",
        "index-author",
        "index-status",
        "index-kind",
        "index-topic",
        "index-theme",
        "index-evidence",
      "index-membership",
        "index-threshold",
        "index-group",
      ])
        byId(id).addEventListener("change", () => {
          limit = 50;
          render();
        });
      byId("index-drafts").addEventListener("click", () => {
        reset(); byId("index-research-controls").open = true; byId("index-status").value = "draft"; render();
        byId("index-scope").tabIndex = -1; byId("index-scope").focus();
      });
      byId("index-search").addEventListener("keydown", event => {
        if (event.key === "Enter") { event.preventDefault(); byId("index-scope").tabIndex = -1; byId("index-scope").focus(); }
      });
      byId("index-search").addEventListener("input", () => {
        limit = 50;
        render();
      });
      // Populate the mirrored controls from the same reviewed names/years.
      for (const [target, source] of [["network-year", "index-year"], ["network-author", "index-author"]])
        options(target, [...byId(source).options].map(option => [option.value, option.textContent]));
      byId("network-all").addEventListener("click", () => {
        networkSelectionOpen = false; byId("index-year").value = "all"; byId("index-author").value = "all"; limit = 50; render();
      });
      byId("network-choose").addEventListener("click", () => { networkSelectionOpen = true; render(); byId("network-year").focus(); });
      for (const [target, source] of [["network-year", "index-year"], ["network-author", "index-author"]])
        byId(target).addEventListener("change", () => { byId(source).value = byId(target).value; limit = 50; render(); });
      for (const [target, value] of [["network-credits-all", "all"], ["network-credits-supported", "supported"]])
        byId(target).addEventListener("click", () => { byId("index-evidence").value = value; limit = 50; render(); });
      byId("network-jump").addEventListener("click", () => {
        document.querySelector(".index-network").open = true;
        const heading = byId("network-controls-heading"); heading.tabIndex = -1; heading.focus(); heading.scrollIntoView({block:"start"});
      });
      byId("network-limit").addEventListener("change", renderNetwork);
      byId("index-reset").addEventListener("click", reset);
      byId("index-more").addEventListener("click", () => {
        limit += 50;
        renderResults();
      });
      byId("index-export").addEventListener("click", exportCsv);
      render();
    },
  };
})();
