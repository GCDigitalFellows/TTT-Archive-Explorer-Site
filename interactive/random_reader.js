/* A small reading companion, independent of the analysis and design controls.
 * Read draw() for the sampling rule and render() for the attribution choices.
 * Source text is always inserted as text, never as executable HTML.
 */
"use strict";
(() => {
  const posts = JSON.parse(document.getElementById("reader-data").textContent);
  const analysis = JSON.parse(
    document.getElementById("explorer-data").textContent,
  );
  const modeledById = new Map(analysis.posts.map((post) => [post.id, post]));
  const byId = (id) => document.getElementById(id);
  let currentId = null;
  let ready = false;

  function node(tag, text, className = "") {
    const result = document.createElement(tag);
    result.textContent = text;
    result.className = className;
    return result;
  }

  function eligiblePosts() {
    return posts.filter(
      (post) =>
        (byId("random-year").value === "all" ||
          post.year === byId("random-year").value) &&
        (byId("random-kind").value === "all" ||
          (byId("random-kind").value === "curated"
            ? post.kind !== "local/unflagged"
            : post.kind === "local/unflagged")),
    );
  }

  function render(post, count) {
    const article = byId("random-article");
    article.replaceChildren();
    byId("random-scope").textContent =
      count +
      " eligible published posts" +
      (post
        ? " · now reading: " + post.title
        : " · no posts match these filters.");
    byId("random-next").disabled = count === 0;
    if (!post) {
      currentId = null;
      return;
    }
    const heading = node("h3", post.title);
    heading.id = "random-title";
    article.append(
      heading,
      node("p", post.date + " · " + post.year, "secondary"),
    );
    const curated = post.kind !== "local/unflagged";
    article.append(
      node(
        "p",
        curated
          ? "Curated / reblogged · source credit: " +
              (post.authors.join(", ") || "not recorded")
          : (post.creditStatus === "provisional posting-account attribution"
              ? "Account-only credit (writer unverified): "
              : "Credited writer(s): ") +
              (post.authors.join(", ") || "not recorded"),
      ),
    );
    article.append(
      node(
        "p",
        "WordPress posting account: " +
          post.creator +
          (curated ? " (not necessarily the original author)" : ""),
        "secondary",
      ),
    );
    try {
      const url = new URL(post.url);
      if (["http:", "https:"].includes(url.protocol)) {
        const link = node("a", "Open original post ↗");
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        article.append(link);
      }
    } catch (_) {
      /* An invalid source URL is not made clickable. */
    }
    article.append(
      node("p", "Review disposition: " + post.authorshipTier + " · Credit basis: " + post.creditStatus, "secondary"),
      node("p", "Original credit: " + (post.originalAuthors || post.authors).join("; "), "secondary"),
    );
    const rights = node("p", "Source rights: " + post.sourceLicense + ". MIT applies to original project work, not this source text. ", "secondary");
    const rightsLink = node("a", "License evidence and notices");
    rightsLink.href = "SOURCE_RIGHTS.html#post-" + encodeURIComponent(post.id);
    rights.append(rightsLink);
    article.append(rights);
    if (post.creditQuote) {
      const evidence = node("details");
      evidence.append(
        node("summary", "Read the attribution evidence"),
        node("blockquote", post.creditQuote),
      );
      article.append(evidence);
    }
    const tools = node("div", "", "post-analysis-tools");
    const analyze = node("button", "Explore this post’s text and saved analysis");
    analyze.type = "button";
    analyze.id = "analyze-post";
    analyze.setAttribute("aria-expanded", "false");
    analyze.setAttribute("aria-controls", "post-analysis");
    const panel = node("section", "", "post-analysis");
    panel.id = "post-analysis";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Text analysis for this post");
    analyze.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      analyze.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden && !panel.childElementCount)
        renderAnalysis(post, panel);
    });
    tools.append(node("p", "Runs locally: opens saved results and paragraph search. No upload or new model fit.", "secondary"), analyze, panel);
    article.append(tools);
    const body = node("div", "", "random-body");
    for (const paragraph of post.paragraphs) body.append(node("p", paragraph));
    if (!post.paragraphs.length)
      body.append(
        node(
          "p",
          "No article text was included in this export. Open the original post to read it.",
        ),
      );
    article.append(body);
  }

  function renderAnalysis(post, panel) {
    // The actual NLTK cleaning and MALLET fitting happened in Python/Java.
    // This offline panel reads their saved outputs; it never claims to run
    // those packages in JavaScript or to fit a topic model to a single article.
    panel.append(node("h4", "Inspect the text"));
    panel.append(
      node(
        "p",
        "This panel opens saved NLTK and MALLET results where available. No model is retrained, and no text is uploaded.",
      ),
    );
    const modeled = modeledById.get(post.id);
    if (modeled) {
      panel.append(node("h4", "NLTK · words after cleaning"));
      panel.append(
        node(
          "p",
          modeled.cleanedTokens.toLocaleString() +
            " cleaned word occurrences · " +
            modeled.wordCounts.length +
            " distinct lemmas · " +
            modeled.modelTokens.toLocaleString() +
            " tokens retained for MALLET.",
        ),
      );
      panel.append(
        node(
          "p",
          "Counts use the saved stopword-filtered, lemmatized analysis text, not the full reading copy. A lemma groups word forms; frequent words are not automatically the most important ideas.",
          "secondary",
        ),
      );
      const words = [...modeled.wordCounts]
        .sort(
          (a, b) =>
            b[1] - a[1] ||
            analysis.dictionary[a[0]].localeCompare(analysis.dictionary[b[0]]),
        )
        .slice(0, 12);
      const wordList = node("ol", "", "post-word-list");
      for (const [index, count] of words)
        wordList.append(node("li", analysis.dictionary[index] + " · " + count));
      panel.append(wordList, node("h4", "MALLET · this post’s topic mixture"));
      const label = node("label", "Saved model run ");
      const select = node("select", "");
      select.id = "post-analysis-model";
      for (const model of Object.values(analysis.models)) {
        const option = node(
          "option",
          model.count +
            " topics · seed " +
            model.seed +
            (model.id === "k8_seed42" ? " · reviewed labels" : ""),
        );
        option.value = model.id;
        select.append(option);
      }
      select.value = "k8_seed42";
      label.append(select);
      const topics = node("div", "", "post-topic-profile");
      function updateTopics() {
        const model = analysis.models[select.value];
        topics.replaceChildren();
        const ordered = model.mixtures[post.id]
          .map((weight, id) => ({ weight, id }))
          .sort((a, b) => b.weight - a.weight);
        for (const { weight, id } of ordered) {
          const row = node("div", "", "post-topic-row");
          row.append(
            node(
              "p",
              "T" +
                id +
                " · " +
                model.topics[id].label +
                " · " +
                (100 * weight).toFixed(1) +
                "%",
            ),
          );
          const bar = document.createElement("meter");
          bar.min = 0;
          bar.max = 1;
          bar.value = weight;
          bar.setAttribute(
            "aria-label",
            model.topics[id].label + " mixture weight",
          );
          row.append(
            bar,
            node(
              "p",
              "Leading model words: " +
                model.topics[id].words
                  .slice(0, 6)
                  .map(([word]) => word)
                  .join(", "),
              "secondary",
            ),
          );
          topics.append(row);
        }
      }
      select.addEventListener("change", updateTopics);
      updateTopics();
      panel.append(
        label,
        topics,
        node(
          "p",
          "Weights describe a mixture from the whole-corpus model, not certainty, quality, or exclusive categories. Topic numbers are different across runs. Labels are human interpretations only in the reviewed eight-topic, seed-42 run; other runs show leading words.",
          "secondary",
        ),
      );
    } else {
      panel.append(node("h4", "Outside the modeled corpus"));
      panel.append(
        node(
          "p",
          "No saved NLTK word profile or MALLET mixture is available. Reason: " +
            post.analysisExclusion,
        ),
      );
      panel.append(
        node(
          "p",
          "This reader includes more posts than the 299-post model. Assigning topic weights here would require a documented inference or corpus-expansion step; the reader does not invent them.",
          "secondary",
        ),
      );
    }
    // Literal search is useful for every published post. It is deliberately
    // labelled separately from NLTK: inflected forms are not automatically matched.
    panel.append(node("h4", "Explore a word or phrase in context"));
    const searchLabel = node("label", "Search this reading copy ");
    const input = document.createElement("input");
    input.type = "search";
    input.maxLength = 100;
    input.placeholder = "Enter a word or phrase";
    input.id = "post-text-search";
    searchLabel.append(input);
    const results = node("div", "");
    results.id = "post-text-contexts";
    results.setAttribute("aria-live", "polite");
    input.addEventListener("input", () => {
      const query = input.value.trim().toLocaleLowerCase();
      results.replaceChildren();
      if (!query) return;
      const matches = post.paragraphs.filter((paragraph) =>
        paragraph.toLocaleLowerCase().includes(query),
      );
      results.append(
        node(
          "p",
          matches.length +
            " matching paragraphs · case-insensitive literal search; showing up to 8.",
        ),
      );
      for (const paragraph of matches.slice(0, 8))
        results.append(node("blockquote", paragraph));
    });
    panel.append(
      searchLabel,
      results,
      node(
        "p",
        "Context search uses the displayed reading copy and is a browser search, not a new NLTK analysis. Lemmas above may differ from the word forms in the original text.",
        "secondary",
      ),
    );
    const guide = node("a", "Read the analysis methods and limitations ↗");
    guide.href = "INTERACTIVE_GUIDE.html";
    guide.target = "_blank";
    guide.rel = "noopener noreferrer";
    panel.append(guide);
  }

  function draw() {
    const eligible = eligiblePosts();
    // Prevent an immediate repeat when there are at least two choices. This is
    // sampling with replacement across later draws, not a shuffled reading list.
    const pool =
      eligible.length > 1
        ? eligible.filter((post) => post.id !== currentId)
        : eligible;
    const selected = pool.length
      ? pool[Math.floor(Math.random() * pool.length)]
      : null;
    currentId = selected?.id || null;
    render(selected, eligible.length);
  }

  window.TowerReader = {
    open() {
      if (ready) return; // Returning to this tab preserves the current article.
      ready = true;
      for (const year of [...new Set(posts.map((post) => post.year))].sort()) {
        const option = node("option", year);
        option.value = year;
        byId("random-year").append(option);
      }
      byId("random-next").addEventListener("click", draw);
      for (const id of ["random-year", "random-kind"])
        byId(id).addEventListener("change", draw);
      draw();
    },
  };
})();
