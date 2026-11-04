/* Small, testable calculations for the index. No DOM, network requests or model fitting.
 * Topic thresholds inspect each saved mixture; network edges count post credits.
 */
"use strict";
const indexSearch = typeof module !== "undefined" && module.exports ? require("./search_core.js") : window.TowerSearch;
function filterIndexPosts(posts, model, choices) {
  const query = choices.query.trim().toLocaleLowerCase();
  return posts.filter((post) => {
    if (choices.year !== "all" && post.year !== choices.year) return false;
    if (choices.author !== "all" && !post.authors.includes(choices.author))
      return false;
    if (choices.status !== "all" && post.status !== choices.status)
      return false;
    if (
      choices.kind !== "all" &&
      (choices.kind === "curated"
        ? post.kind === "local/unflagged"
        : post.kind !== choices.kind)
    )
      return false;
    if (
      choices.evidence === "explicit" &&
      !["explicit body credit", "author taxonomy", "reviewed export metadata credit", "reviewed institutional guide credit", "explicit source-author bio", "reviewed cross-reference credit"].includes(post.creditStatus)
    )
      return false;
    if (choices.evidence === "supported" && post.authorshipTier !== "source-supported") return false;
    if (choices.theme && choices.theme !== "all" && !(post.themeSignals || []).includes(choices.theme)) return false;
    // Membership qualifies a recorded credit; it does not validate a byline.
    if (choices.membershipBasis && choices.membershipBasis !== "all" && !(post.membershipByBasis?.[choices.membershipBasis] || []).length) return false;
    const weights = model.mixtures[post.id];
    if (choices.topic === "unmodeled" && weights) return false;
    if (
      !["all", "unmodeled"].includes(choices.topic) &&
      (!weights || weights[Number(choices.topic)] < choices.threshold)
    )
      return false;
    return indexSearch.matches(post.searchFields || [post.searchText], query, choices.searchMode || "words");
  });
}
function strongestTopic(post, model) {
  const weights = model.mixtures[post.id];
  return weights ? weights.indexOf(Math.max(...weights)) : null;
}
function authorYearEdges(posts) {
  // A collective article counts once for each distinct credited author.
  const edges = new Map();
  for (const post of posts) {
    if (post.status !== "publish" || post.kind !== "local/unflagged") continue;
    for (const author of new Set(post.authors)) {
      const key = JSON.stringify([author, post.year]);
      const edge = edges.get(key) || { author, year: post.year, count: 0 };
      edge.count += 1;
      edges.set(key, edge);
    }
  }
  return [...edges.values()].sort(
    (a, b) => a.author.localeCompare(b.author) || a.year.localeCompare(b.year),
  );
}
const TowerIndexMath = { filterIndexPosts, strongestTopic, authorYearEdges };
if (typeof module !== "undefined" && module.exports)
  module.exports = TowerIndexMath;
if (typeof window !== "undefined") window.TowerIndexMath = TowerIndexMath;
