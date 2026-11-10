/* Saved-analysis aggregations, with no DOM, NLP cleaning or model fitting.
 * Each function receives an explicit population. Topic means use modeled posts;
 * keyword shares and credit edges use published local/unflagged posts.
 */
"use strict";
const PathwaysAnalysis = (() => {
  function population(posts, choices = {}) {
    return posts.filter(
      (p) =>
        p.kind === "local/unflagged" &&
        (!choices.year || choices.year === "all" || p.year === choices.year) &&
        (!choices.author ||
          choices.author === "all" ||
          p.authors.includes(choices.author)) &&
        (!choices.supported || p.tier === "source-supported"),
    );
  }
  function topicYears(posts, years, topic) {
    return years.map((year) => {
      const selected = posts.filter((p) => p.year === year && p.weights);
      return {
        year,
        n: selected.length,
        value: selected.length
          ? selected.reduce((sum, p) => sum + p.weights[topic], 0) / selected.length
          : null,
        ids: selected.map((p) => p.id),
      };
    });
  }
  // Compare the complete published snapshot with the CURRENT filtered model
  // selection. Exclusions are reported separately: they are not missing topics.
  function coverageYears(allPosts, selectedPosts, years) {
    return years.map((year) => {
      const published = allPosts.filter((p) => p.year === year);
      const local = published.filter((p) => p.kind === "local/unflagged");
      const modeled = local.filter((p) => p.weights);
      const reasons = new Map();
      for (const post of published.filter((p) => !p.weights)) {
        const reason = post.exclusion || "No saved model weight";
        reasons.set(reason, (reasons.get(reason) || 0) + 1);
      }
      return {
        year,
        published: published.length,
        local: local.length,
        modeled: modeled.length,
        selected: selectedPosts.filter((p) => p.year === year && p.weights).length,
        exclusions:
          [...reasons].map(([reason, count]) => `${count} ${reason}`).join("; ") ||
          "None",
      };
    });
  }
  function signalYears(posts, years, signal) {
    return years.map((year) => {
      const selected = posts.filter((p) => p.year === year);
      const matching = selected.filter((p) => (p.signals || []).includes(signal));
      return {
        year,
        n: selected.length,
        hits: matching.length,
        value: selected.length ? matching.length / selected.length : null,
        ids: matching.map((p) => p.id),
      };
    });
  }
  function authorYears(posts) {
    const edges = new Map();
    for (const post of posts) {
      for (const author of new Set(post.authors)) {
        const key = JSON.stringify([author, post.year]);
        const edge = edges.get(key) || { author, year: post.year, count: 0, ids: [] };
        edge.count++;
        edge.ids.push(post.id);
        edges.set(key, edge);
      }
    }
    return [...edges.values()].sort(
      (a, b) => a.author.localeCompare(b.author) || a.year.localeCompare(b.year),
    );
  }
  function authorTotals(posts) {
    const rows = new Map();
    for (const post of posts) {
      for (const author of new Set(post.authors)) {
        const row = rows.get(author) || {
          author,
          count: 0,
          unresolved: 0,
          ids: [],
          years: new Set(),
        };
        row.count++;
        row.unresolved += Number(post.tier === "unresolved-account");
        row.ids.push(post.id);
        row.years.add(post.year);
        rows.set(author, row);
      }
    }
    return [...rows.values()]
      .map((row) => ({ ...row, years: [...row.years].sort() }))
      .sort((a, b) => b.count - a.count || a.author.localeCompare(b.author));
  }
  // Keep articles as the direct evidence: one record per multi-credit post,
  // rather than one inferred relationship for every possible pair of names.
  // The input is already filtered by year, selected name and evidence choice.
  function sharedWriting(posts) {
    return posts
      .map((post) => ({
        ...post,
        names: [...new Set(post.authors)].sort((a, b) => a.localeCompare(b)),
      }))
      .filter((post) => post.names.length > 1)
      .sort((a, b) => a.year.localeCompare(b.year) || a.title.localeCompare(b.title));
  }
  function sharedBylines(posts) {
    const pairs = new Map();
    for (const post of posts) {
      const names = [...new Set(post.authors)].sort();
      for (let i = 0; i < names.length; i++)
        for (let j = i + 1; j < names.length; j++) {
          const key = JSON.stringify([names[i], names[j]]);
          const pair = pairs.get(key) || {
            first: names[i],
            second: names[j],
            count: 0,
            ids: [],
          };
          pair.count++;
          pair.ids.push(post.id);
          pairs.set(key, pair);
        }
    }
    return [...pairs.values()].sort(
      (a, b) =>
        b.count - a.count ||
        a.first.localeCompare(b.first) ||
        a.second.localeCompare(b.second),
    );
  }
  // Count each selected person once. A person with multiple roles belongs to
  // the Digital Fellow segment if that year's unfiltered saved roster records it.
  // The complement means no recorded DF role, not proven nonmembership.
  function cohortComposition(cells, roster, year) {
    const names = new Set(cells.map((cell) => cell.name));
    const digitalNames = new Set(
      roster
        .filter((cell) => cell.academic_year === year && cell.role_family === "digital")
        .map((cell) => cell.name),
    );
    const digital = [...names].filter((name) => digitalNames.has(name)).length;
    return { total: names.size, digital, other: names.size - digital };
  }
  // Slice geometry may rescale a leading-five selection. Always keep its
  // displayed denominator separate from the complete saved parent measurement.
  // Distinctiveness is a score partition, never corpus coverage.
  function sunburstFocus(group, lens, leading) {
    const focused = leading && ["shared", "raw", "phrases"].includes(lens);
    const rows = focused
      ? group.rows.filter((row) => row.key !== "__other__")
      : group.rows;
    const shown = rows.reduce((sum, row) => sum + row.count, 0);
    const denominator = group.denominator ?? group.mass;
    return {
      rows,
      shown,
      denominator,
      focused,
      coverage: lens === "distinct" || !denominator ? null : shown / denominator,
    };
  }
  function sunburstColor(kind, key) {
    const colors = [
      "#88a9ca",
      "#d4b380",
      "#b5a0cc",
      "#91b8ac",
      "#d9a4ae",
      "#c67de0",
      "#7edaf2",
      "#9ca1c6",
    ];
    const index =
      kind === "topic" ? Number(key) : Number(String(key).slice(0, 4)) - 2012;
    return colors[
      ((index % (kind === "topic" ? 8 : 5)) + 8 * 5) % (kind === "topic" ? 8 : 5)
    ];
  }
  return {
    sunburstFocus,
    sunburstColor,
    cohortComposition,
    population,
    topicYears,
    coverageYears,
    signalYears,
    authorYears,
    authorTotals,
    sharedBylines,
    sharedWriting,
  };
})();
if (typeof module !== "undefined" && module.exports) module.exports = PathwaysAnalysis;
