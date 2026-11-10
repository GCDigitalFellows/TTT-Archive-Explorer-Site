/* Tagging The Tower Archives Explorer: public interface built from saved evidence.
 * State selects a view and filters. Render functions only read saved evidence.
 * Every source-derived string becomes textContent, never executable HTML.
 */
(() => {
  "use strict";
  const root = document.getElementById("welcoming-prototype");
  // The modular loader shares newly loaded fields with the analysis panels.
  // Offline exports already embed the complete object and need no loader.
  const data =
    globalThis.ArchiveData?.data ||
    JSON.parse(document.getElementById("wp-data").textContent);
  const byId = (id) => root.querySelector("#" + id);
  const posts = data.posts.map((post) => ({
    ...post,
    search: PathwaysCore.searchText(post),
  }));
  const byPost = new Map(posts.map((post) => [post.id, post]));
  // Visitor choices belong to this browser session. Saved post records are
  // read-only inputs; changing a filter never edits the corpus.
  const state = {
    view: "home",
    query: "",
    searchMode: "words",
    year: "all",
    author: "all",
    kind: "all",
    supported: false,
    limit: 12,
    previousRandom: null,
    randomPool: null,
    readOrigin: "browse",
    theme: 0,
    era: 2026,
  };
  const summaries = [
    "In these posts, writers choose tools to answer a research question or work within a practical constraint.",
    "In these examples, people learn with others and gain confidence to solve problems on their own.",
    "The essay treats maintenance and repair as part of scholarly work. It also asks what institutional support makes that work possible.",
    "These posts raise ethical questions about how researchers collect, represent, own, and share data.",
    "The selected posts approach AI in different ways. Some criticize its use, while others describe experiments in specific settings.",
    "The essay uses selected accounts to examine what people learn by organizing a discussion.",
  ];
  // These are editorial reading prompts, not new findings about the authors.
  // Edit them beside the summaries; keep source passages unchanged below.
  const readingNotes = [
    [
      "These examples connect a scholarly question, a tool choice and communication.",
      "When does access to a tool constrain the question a researcher can ask? These passages do not show that every tool choice is deliberate.",
    ],
    [
      "These examples describe learning through relationships as well as independent practice.",
      "Who has time or access to join? Personal confidence does not establish that institutional barriers have disappeared.",
    ],
    [
      "These examples bring repair, maintenance and ending a project into the account of scholarship.",
      "Care can sustain a project, but it can also require saying no. These examples cannot measure whose maintenance work remains uncredited.",
    ],
    [
      "These examples connect ethical choices to access, language, metadata and AI.",
      "Ethical aims may conflict. Read the differences between these cases rather than treating them as one agreed framework.",
    ],
    [
      "These examples deliberately put criticism of AI beside accounts of situated experimentation.",
      "Publication dates, tasks and judgments differ. The examples do not establish a consensus or a change in the whole community's opinion.",
    ],
    [
      "These accounts make organizing and reporting discussion visible as intellectual work.",
      "These accounts cannot establish the outcomes of every gathering or identify everyone who supported it.",
    ],
  ];
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(text, action, className) {
    const node = element("button", text, className);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  }
  function link(text, url) {
    const node = element("a", text);
    try {
      const parsed = new URL(url);
      if (["http:", "https:"].includes(parsed.protocol)) {
        node.href = parsed.href;
        node.target = "_blank";
        node.rel = "noopener noreferrer";
      }
    } catch (_) {
      /* Keep invalid source links as plain labels. */
    }
    return node;
  }
  function options(select, rows) {
    select.replaceChildren(
      ...rows.map(([value, label]) => {
        const node = element("option", label);
        node.value = value;
        return node;
      }),
    );
  }
  function announce(text) {
    byId("wp-announcement").textContent = text;
  }
  function savePresentation() {
    // Do not send searches or personal-name selections to the conversation.
    if (window.openai?.setWidgetState)
      window.openai
        .setWidgetState({
          modelContent: {
            prototype: "Welcoming pathways",
            view: state.view,
            designYear: state.era,
          },
          privateContent: { version: 1, theme: state.theme, era: state.era },
        })
        .catch(() => {});
  }
  let applyingRoute = false;
  function writeRoute() {
    if (!applyingRoute)
      history.pushState(
        null,
        "",
        ExplorerRoutes.hash(
          state.view,
          root.querySelector("#wp-read")?.dataset.postId,
          state.era,
        ),
      );
  }
  function currentPosts() {
    return PathwaysCore.filter(posts, state);
  }
  // Route changes update the visible panel and its heading together so
  // browser navigation and keyboard focus refer to the same place.
  function navigate(view, remember = true) {
    if (
      !["home", "browse", "read", "wisdom", "analysis", "about", "design"].includes(
        view,
      )
    )
      view = "home";
    state.view = view;
    for (const panel of root.querySelectorAll("[data-view]"))
      panel.hidden = panel.dataset.view !== view;
    for (const item of root.querySelectorAll("nav [data-route]"))
      item.setAttribute(
        "aria-pressed",
        String(item.dataset.route === (view === "read" ? "browse" : view)),
      );
    if (view === "browse") renderBrowse();
    if (view === "wisdom") renderWisdom();
    if (view === "analysis") analysisView.render();
    if (view === "about") renderPeople();
    announce(
      view === "read"
        ? "Post excerpt opened"
        : view === "browse"
          ? "Browse published posts"
          : view === "wisdom"
            ? "What the archive suggests and source passages"
            : view === "analysis"
              ? "Text analysis and authorship networks"
              : view === "about"
                ? "People, methods and attribution"
                : view === "design"
                  ? "Optional design-history exhibit"
                  : "Welcome to the archive",
    );
    const heading = root.querySelector('[data-view="' + view + '"] h1');
    root.querySelectorAll("#wp-active-heading").forEach((n) => n.removeAttribute("id"));
    if (heading) {
      heading.id = "wp-active-heading";
      heading.tabIndex = -1;
      if (remember) heading.focus();
    }
    if (remember) {
      savePresentation();
      writeRoute();
    }
  }
  function postCard(post) {
    const card = element("article", undefined, "post");
    card.append(
      element("p", post.year + " · " + post.authors.join("; "), "small"),
      button(
        post.title,
        (event) => openPost(post, undefined, event.currentTarget),
        "post-title",
      ),
    );
    card.querySelector("button").id = "wp-post-" + post.id;
    card.append(
      element(
        "p",
        PathwaysCore.creditLabel(post.tier) +
          (post.kind === "local/unflagged" ? "" : " · curated/source-linked"),
        "small",
      ),
    );
    const match = window.TowerSearch.snippet(
      post.fullParagraphs || post.paragraphs,
      state.query,
      state.searchMode,
    );
    const first =
      post.paragraphs.find((p) => p.length > 80) ||
      post.paragraphs[0] ||
      "No reading excerpt is available.";
    card.append(element("p", first, "excerpt"));
    // Short card previews are a display projection, never replacements for source text.
    card.lastChild.textContent =
      first.length > 160 ? first.slice(0, 160).replace(/\s+\S*$/, "") + "…" : first;
    if (match) card.append(element("p", match, "small"));
    return card;
  }
  function renderBrowse() {
    const selected = currentPosts();
    byId("wp-search").elements.query.value = state.query;
    byId("wp-search-mode").value = state.searchMode;
    byId("wp-home-mode").value = state.searchMode;
    byId("wp-year").value = state.year;
    byId("wp-author").value = state.author;
    byId("wp-kind").value = state.kind;
    byId("wp-evidence").value = state.supported ? "supported" : "all";
    const filtered = [];
    if (state.query) filtered.push("query “" + state.query + "”");
    if (state.year !== "all") filtered.push(state.year);
    if (state.author !== "all") filtered.push(state.author);
    if (state.kind !== "all") filtered.push(state.kind);
    if (state.supported) filtered.push("source-supported only");
    byId("wp-result-scope").textContent =
      selected.length +
      " of " +
      posts.length +
      " published records" +
      (filtered.length
        ? " · " + filtered.join(" · ")
        : " · all publication years and credits") +
      " · showing " +
      Math.min(state.limit, selected.length) +
      ".";
    byId("wp-results").replaceChildren(...selected.slice(0, state.limit).map(postCard));
    if (!selected.length)
      byId("wp-results").append(
        element(
          "p",
          "No records match. Clear a filter or try a different name or phrase.",
        ),
      );
    byId("wp-more").hidden = selected.length <= state.limit;
    byId("wp-random-filtered").disabled = !selected.length;
  }
  function resetFilters() {
    state.query = "";
    state.searchMode = "words";
    state.year = "all";
    state.author = "all";
    state.kind = "all";
    state.supported = false;
    state.limit = 12;
    renderBrowse();
  }
  // Keep the opening control so the reader can return to the same result
  // or evidence record, including after reading the complete saved text.
  function openPost(post, randomScope, returnTarget) {
    state.returnPostId = returnTarget ? post.id : null;
    state.returnControlId = returnTarget?.id || null; // Restore the actual originating control, including People evidence.
    if (state.view !== "read") state.readOrigin = state.view;
    const container = byId("wp-read");
    container.replaceChildren();
    container.dataset.postId = post.id;
    const reader = element("article", undefined, "reading");
    reader.append(
      element("p", randomScope || "Post excerpt", "eyebrow"),
      element("h1", post.title),
      element("div", post.date + " · academic year " + post.year, "small"),
    );
    reader.append(
      element(
        "div",
        (post.tier === "unresolved-account"
          ? "Account-only credit: "
          : "Credited writer(s): ") + post.authors.join("; "),
        "note",
      ),
    );
    const meta = element("div", undefined, "tight");
    meta.append(
      element(
        "p",
        PathwaysCore.creditLabel(post.tier) + " · " + post.creditStatus,
        "small",
      ),
      element(
        "p",
        "Posting account: " +
          post.account +
          (post.kind === "local/unflagged" ? "" : " · curated/source-linked record"),
        "small",
      ),
    );
    const evidence = element("details");
    evidence.append(element("summary", "Inspect the attribution evidence"));
    evidence.append(
      element("p", "Original credit string(s): " + post.originalAuthors.join("; ")),
    );
    if (post.creditQuote) evidence.append(element("blockquote", post.creditQuote));
    if (post.archivedBylineUrl) {
      const archive = element(
        "p",
        "The archived original shows the writer credit. The account above imported this record during migration. ",
      );
      archive.append(
        link(
          "View the archived byline for “" + post.title + "”",
          post.archivedBylineUrl,
        ),
      );
      evidence.append(archive);
    }
    evidence.append(
      element(
        "p",
        post.tier === "source-supported"
          ? "Source-supported means checked evidence, not personal author confirmation or a complete human audit."
          : "This credit remains limited by the saved evidence. A posting account or recorded name is not independent proof of article authorship.",
      ),
    );
    meta.append(evidence);
    reader.append(meta);
    const preview = element("div");
    for (const paragraph of post.paragraphs) preview.append(element("p", paragraph));
    reader.append(preview);
    const full = element("details");
    full.append(element("summary", "Read the full saved text"));
    full.append(
      element(
        "p",
        "Complete saved plain-text copy; images, embeds and original formatting are omitted.",
      ),
    );
    for (const paragraph of post.fullParagraphs || post.paragraphs)
      full.append(element("p", paragraph));
    full.addEventListener("toggle", () => {
      preview.hidden = full.open;
    });
    reader.append(full);
    const rights = element(
      "p",
      "Source rights: " + post.sourceLicense + ". MIT does not override source terms. ",
      "small",
    );
    rights.append(
      link(
        "License evidence and notices",
        "https://gcdigitalfellows.github.io/TTT-Archive-Explorer-Site/SOURCE_RIGHTS.html#post-" +
          post.id,
      ),
    );
    reader.append(rights);
    if (!post.paragraphs.length)
      reader.append(
        element("p", "The export supplied no reading text for this record."),
      );
    reader.append(
      element(
        "div",
        "Shortened plain-text excerpt. The original may contain more text, images, embeds and formatting.",
        "small",
      ),
      link("Read the complete original post ↗", post.url),
    );
    reader.append(savedAnalysis(post));
    container.append(reader);
    byId("wp-another-random").hidden = !randomScope;
    byId("wp-read-back").textContent =
      state.readOrigin === "analysis"
        ? "← Back to analysis"
        : state.readOrigin === "wisdom"
          ? "← Back to what the archive suggests"
          : state.readOrigin === "home"
            ? "← Back to the welcome page"
            : state.readOrigin === "about"
              ? "← Back to the people"
              : "← Back to results";
    navigate("read");
  }
  // Display the post’s saved analysis when available. An absent profile
  // is an excluded/unmodeled post, so do not calculate substitute weights.
  function savedAnalysis(post) {
    const details = element("details");
    details.append(element("summary", "Explore the saved text analysis"));
    if (!post.weights) {
      details.append(
        element(
          "p",
          "No saved model profile is available for this post. " +
            (post.exclusion || "It is outside the current fitted corpus.") +
            " This explorer does not infer a new profile.",
        ),
      );
      return details;
    }
    details.append(
      element(
        "p",
        "Primary MALLET model: " +
          data.model +
          ". Weights describe a mixture, not certainty, quality or exclusive categories. Labels are agent-developed interpretations. No model is retrained.",
      ),
    );
    for (const { weight, index } of post.weights
      .map((weight, index) => ({ weight, index }))
      .sort((a, b) => b.weight - a.weight)) {
      const row = element("div", undefined, "profile");
      row.append(element("span", data.topics[index].label));
      const track = element("div", undefined, "track");
      const fill = element("div", undefined, "fill");
      fill.style.width = 100 * weight + "%";
      track.append(fill);
      track.setAttribute("aria-hidden", "true");
      row.append(track, element("span", (100 * weight).toFixed(1) + "%"));
      details.append(row);
    }
    if (post.words.length)
      details.append(
        element(
          "p",
          "Frequent cleaned words: " +
            post.words.map(([word, count]) => word + " (" + count + ")").join(", ") +
            ". These counts describe the complete saved analysis text, not just this excerpt.",
        ),
      );
    return details;
  }
  function randomPost(pool) {
    const post = PathwaysCore.draw(pool, state.previousRandom);
    if (!post) {
      announce("No posts match these filters.");
      return;
    }
    state.previousRandom = post.id;
    state.randomPool = pool.map((p) => p.id);
    openPost(
      post,
      "Random discovery · " +
        pool.length +
        " eligible published records · equal chance",
    );
  }
  function renderWisdom() {
    const group = data.groups[state.theme];
    byId("wp-theme-list").replaceChildren(
      ...data.groups.map((g, index) => {
        const b = button(g.title, () => {
          state.theme = index;
          renderWisdom();
          savePresentation();
        });
        b.setAttribute("aria-pressed", String(index === state.theme));
        return b;
      }),
    );
    const content = byId("wp-theme-content");
    content.replaceChildren(
      element("h2", group.title),
      element("p", summaries[state.theme]),
      element(
        "p",
        group.sources.length +
          " selected source example" +
          (group.sources.length === 1 ? "" : "s") +
          " · this is not an estimate of prevalence.",
        "small",
      ),
    );
    const rationale = element("details");
    rationale.append(
      element("summary", "Why these passages? What complicates this reading?"),
      element("p", readingNotes[state.theme][0]),
      element("p", readingNotes[state.theme][1]),
      element(
        "p",
        "Selection and these reading prompts are AI-assisted editorial judgments. Illustrative accounts can matter without being statistically representative. Use People & methods to suggest another reading.",
        "small",
      ),
    );
    content.append(rationale);
    for (const source of group.sources) {
      const post = byPost.get(source.id);
      const card = element("article", undefined, "source");
      card.append(
        element("h3", post.title),
        element(
          "p",
          post.authors.join("; ") +
            " · " +
            post.year +
            " · " +
            PathwaysCore.creditLabel(post.tier),
          "small",
        ),
      );
      // The fragment is our interpretation; its disclosure preserves the exact
      // saved source passage. Do not substitute a generated paraphrase here.
      const passage = element("details", undefined, "term-help passage-help");
      const fragment = element("summary", source.connection);
      fragment.append(element("span", ": read the source passage", "sr"));
      const passagePanel = element("div", undefined, "term-help-panel");
      passagePanel.append(element("blockquote", source.passage));
      passage.append(fragment, passagePanel);
      enableReadingHelp(passage);
      card.append(passage);
      const actions = element("div", undefined, "row");
      actions.append(
        button("Read this post", () => openPost(post)),
        link("Original source ↗", post.url),
      );
      card.append(actions);
      content.append(card);
    }
  }
  // Contrast is evaluated from the saved hex palette before using its series
  // color for links/buttons. Historical appearance must not obscure controls.
  function luminance(hex) {
    const value = hex.replace("#", "");
    const channels = [0, 2, 4]
      .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  function contrast(first, second) {
    const a = luminance(first),
      b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }
  function renderEra() {
    const preset =
      data.design.presets.find((p) => p.year === Number(state.era)) ||
      data.design.presets[data.design.presets.length - 1];
    root.dataset.designYear = String(preset.year); // One root treatment for every internal view.
    const p = preset.palette;
    const readableAction = contrast(p.series, p.paper) >= 4.5 ? p.series : p.ink;
    root.style.setProperty(
      "--on-action",
      "light-dark(" +
        (luminance(readableAction) > 0.179 ? "#000000" : "#ffffff") +
        ",#193929)",
    );
    // Apply the saved light palette; keep an explicit readable dark adaptation.
    for (const [token, light, dark] of [
      ["paper", p.paper, "#1b2420"],
      ["ink", p.ink, "#e6eee8"],
      ["muted", p.quiet, "#b8cabe"],
      ["line", p.rule, "#4a6153"],
      ["wash", p.surface, "#2c3e33"],
      ["action", readableAction, "#b7dbc5"],
    ])
      root.style.setProperty("--" + token, "light-dark(" + light + "," + dark + ")");
    root.style.setProperty(
      "--heading",
      ["sans-light", "sans", "display", "rounded"].includes(preset.typography)
        ? "system-ui,sans-serif"
        : preset.typography === "monospace"
          ? "monospace"
          : "Georgia,serif",
    );
    root.style.setProperty("--round", Math.min(preset.controlRadius, 16) + "px");
    byId("wp-design-year").value = String(preset.year);
    byId("wp-era-status").textContent = "Appearance: " + preset.year;
    byId("wp-era-kind").textContent = preset.evidenceLabel;
    byId("wp-era-name").textContent = preset.year + " · " + preset.name;
    byId("wp-era-description").textContent = preset.description;
    byId("wp-era-caveat").textContent = preset.caveat;
    byId("wp-era-sources").replaceChildren(
      ...preset.sources.map((id) => {
        const source = data.design.sources.find((s) => s.id === id);
        return source
          ? link(source.title + " · " + source.publisher, source.url)
          : element("p", "Source record unavailable.");
      }),
    );
  }
  root.querySelector(".skip-content").addEventListener("click", (event) => {
    event.preventDefault();
    const heading = root.querySelector("#wp-active-heading");
    if (heading) {
      heading.focus();
      heading.scrollIntoView({ block: "start" });
    }
  });
  // People records are loaded as one verified group. Keep the page heading
  // and navigation available while waiting, and build its controls only once.
  let peopleView;
  let peoplePending = false;
  let peopleError = false;
  const peopleContent = byId("wp-people-content");
  const peopleLoading = byId("wp-people-loading");
  const peopleLoadStatus = byId("wp-people-load-status");
  const peopleRetry = byId("wp-people-load-retry");
  peopleContent.hidden = true;
  peopleRetry.addEventListener("click", () => {
    peopleError = false;
    root.querySelector('nav [data-route="about"]').focus();
    renderPeople();
  });

  function renderPeople() {
    if (!data.peopleHistory && globalThis.ArchiveData) {
      peopleContent.hidden = true;
      peopleLoading.hidden = false;
      peopleLoadStatus.textContent = peopleError
        ? "People records could not load. Browse posts or try again."
        : "Loading writer credits, cohort records and their sources…";
      peopleRetry.hidden = !peopleError;
      peopleContent.setAttribute("aria-busy", String(!peopleError));
      if (peoplePending || peopleError) return;
      peoplePending = true;
      globalThis.ArchiveData.ensure("people").then(
        () => {
          peoplePending = false;
          peopleContent.setAttribute("aria-busy", "false");
          if (state.view === "about") {
            renderPeople();
            announce("People records are ready.");
          }
        },
        (error) => {
          console.error(error);
          peoplePending = false;
          peopleError = true;
          peopleContent.setAttribute("aria-busy", "false");
          if (state.view === "about") renderPeople();
        },
      );
      return;
    }
    peopleLoading.hidden = true;
    peopleContent.hidden = false;
    if (!peopleView) {
      peopleView = createPathwaysPeople({ root, data, openPost, announce });
      peopleView.render();
    }
  }

  const analysisView = createPathwaysAnalysis({
    root,
    data,
    posts,
    openPost,
    announce,
  });
  // Initialize named choices from the actual included records, preserving all names.
  options(byId("wp-year"), [
    ["all", "All academic years"],
    ...[...new Set(posts.map((p) => p.year))]
      .sort()
      .reverse()
      .map((y) => [y, y]),
  ]);
  options(byId("wp-author"), [
    ["all", "All credited names"],
    ...[...new Set(posts.flatMap((p) => p.authors))]
      .sort((a, b) => a.localeCompare(b))
      .map((a) => [a, a]),
  ]);
  options(
    byId("wp-design-year"),
    data.design.presets.map((p) => [String(p.year), p.year + " · " + p.name]),
  );
  for (const b of root.querySelectorAll("[data-route]"))
    b.addEventListener("click", () => navigate(b.dataset.route));
  for (const b of root.querySelectorAll("[data-random]"))
    b.addEventListener("click", () =>
      randomPost(b.dataset.random === "all" ? posts : currentPosts()),
    );
  for (const b of root.querySelectorAll("[data-post]"))
    b.addEventListener("click", () => openPost(byPost.get(b.dataset.post)));
  // Explicit local actions work in both the conversation sandbox and a browser;
  // neither a click nor Enter may submit a network form.
  function searchFromHome() {
    state.query = byId("wp-home-search").querySelector("input").value;
    state.searchMode = byId("wp-home-mode").value;
    state.limit = 12;
    navigate("browse");
  }
  function searchFromBrowse() {
    state.query = byId("wp-search").querySelector("input").value;
    state.searchMode = byId("wp-search-mode").value;
    state.limit = 12;
    renderBrowse();
    byId("wp-result-scope").tabIndex = -1;
    byId("wp-result-scope").focus();
  }
  byId("wp-home-go").addEventListener("click", searchFromHome);
  byId("wp-search-go").addEventListener("click", searchFromBrowse);
  for (const [id, action] of [
    ["wp-home-search", searchFromHome],
    ["wp-search", searchFromBrowse],
  ]) {
    byId(id).addEventListener("submit", (event) => {
      event.preventDefault();
      action();
    });
    byId(id)
      .querySelector("input")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          action();
        }
      });
  }
  byId("wp-search").elements.query.addEventListener("input", (event) => {
    state.query = event.target.value;
    state.limit = 12;
    renderBrowse();
  });
  for (const [id, key] of [
    ["wp-year", "year"],
    ["wp-author", "author"],
    ["wp-kind", "kind"],
  ])
    byId(id).addEventListener("change", (event) => {
      state[key] = event.target.value;
      state.limit = 12;
      renderBrowse();
    });
  byId("wp-evidence").addEventListener("change", (event) => {
    state.supported = event.target.value === "supported";
    state.limit = 12;
    renderBrowse();
  });
  byId("wp-search-mode").addEventListener("change", (event) => {
    state.searchMode = event.target.value;
    state.limit = 12;
    renderBrowse();
  });
  byId("wp-clear").addEventListener("click", resetFilters);
  byId("wp-more").addEventListener("click", () => {
    state.limit += 12;
    renderBrowse();
  });
  byId("wp-read-back").addEventListener("click", () => {
    navigate(state.readOrigin);
    const target = state.returnControlId
      ? byId(state.returnControlId)
      : state.returnPostId
        ? byId("wp-post-" + state.returnPostId)
        : null;
    if (target) {
      target.focus();
      target.scrollIntoView({ block: "center" });
    }
  });
  byId("wp-another-random").addEventListener("click", () =>
    randomPost((state.randomPool || []).map((id) => byPost.get(id)).filter(Boolean)),
  );
  byId("wp-design-year").addEventListener("change", (event) => {
    state.era = Number(event.target.value);
    renderEra();
    savePresentation();
    writeRoute();
  });
  byId("wp-design-reset").addEventListener("click", () => {
    state.era = 2026;
    renderEra();
    savePresentation();
    writeRoute();
  });
  function restore(snapshot) {
    const saved = snapshot?.privateContent;
    if (saved?.version !== 1) return;
    state.theme =
      Number.isInteger(saved.theme) &&
      saved.theme >= 0 &&
      saved.theme < data.groups.length
        ? saved.theme
        : 0;
    state.era = data.design.presets.some((p) => p.year === saved.era)
      ? saved.era
      : 2026;
    // Restore presentation choices only. An echoed host-state update must
    // never navigate away from the post the reader just opened.
    renderEra();
    if (state.view === "wisdom") renderWisdom();
  }
  // Interpret bookmarks only after the data and controls are initialized.
  // In-page headings keep the current route rather than becoming new views.
  function applyRoute() {
    if (location.hash.startsWith("#wp-")) return; // Keep skip links and in-page anchors within the current view.
    const route = ExplorerRoutes.parse(location.hash);
    applyingRoute = true;
    if (ExplorerRoutes.documents[route.view]) {
      const anchor = /^#(?:history-|work-|credits-|credited-person-)/.test(
        location.hash,
      )
        ? location.hash
        : "";
      location.replace(
        new URL(
          (location.pathname.includes("/reviews/mockups/welcoming-pathways/")
            ? "../../../"
            : "") +
            ExplorerRoutes.documents[route.view] +
            anchor,
          location.href,
        ).href,
      );
      return;
    }
    if (data.design.presets.some((p) => String(p.year) === route.era))
      state.era = Number(route.era);
    state.query = route.query;
    state.year = data.posts.some((p) => p.year === route.year) ? route.year : "all";
    state.author = data.posts.some((p) => p.authors.includes(route.author))
      ? route.author
      : "all";
    renderEra();
    if (route.post && byPost.has(route.post)) {
      state.view = "browse";
      openPost(byPost.get(route.post));
    } else if (route.view === "random") randomPost(posts);
    else if (route.view === "read") {
      navigate("browse", false);
      announce(
        "That bookmark does not point to a published post. Try browsing or searching the archive.",
      );
    } else navigate(route.view, false);
    applyingRoute = false;
  }
  renderEra();
  navigate("home", false);
  restore(window.openai?.widgetState);
  applyRoute();
  window.addEventListener("popstate", applyRoute);
  window.addEventListener("hashchange", applyRoute);
  window.addEventListener("openai:set_globals", (event) =>
    restore(event.detail?.globals?.widgetState),
  );
  // Optional conversation-side layout tuning, not another product toolbar.
  if (globalThis.Tweak) {
    const layout = { spacing: 24, readingWidth: 76 };
    const tweak = new Tweak({
      container: root,
      onChange: () => {
        root.style.setProperty("--space", layout.spacing + "px");
        root.style.setProperty("--content", layout.readingWidth + "ch");
      },
    });
    tweak.addSlider(layout, "spacing", {
      label: "Section spacing",
      min: 18,
      max: 32,
      step: 2,
      unit: "px",
    });
    tweak.addSlider(layout, "readingWidth", {
      label: "Reading width",
      min: 55,
      max: 85,
      step: 5,
      unit: "ch",
    });
  }
  // Shared enhancement for static MALLET help and freshly rendered passages.
  // Native disclosure remains usable by touch/keyboard without this enhancement.
  // Keep the panel open while the pointer OR keyboard focus is within it.
  function enableReadingHelp(help) {
    const summary = help.querySelector("summary");
    let helpDismissed = false;
    help.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") {
        helpDismissed = false;
        help.open = true;
      }
    });
    help.addEventListener("pointerleave", () => {
      if (!help.contains(document.activeElement)) help.open = false;
      helpDismissed = false;
    });
    help.addEventListener("focusin", () => {
      if (!helpDismissed) help.open = true;
    });
    help.addEventListener("focusout", (event) => {
      if (!help.contains(event.relatedTarget)) {
        help.open = false;
        helpDismissed = false;
      }
    });
    help.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        helpDismissed = true;
        help.open = false;
        summary.focus();
      }
    });
  }
  enableReadingHelp(root.querySelector("#wp-mallet-help"));
})();
