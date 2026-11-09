/* Calculations shared by the isolated prototype and its Node checks.
 * Search is literal matching of saved metadata/excerpts, not NLP or inference.
 * A credit disposition describes the evidence for this article, not a person.
 */
"use strict";
const pathwaysSearch =
  typeof module !== "undefined" && module.exports
    ? require("../../../interactive/search_core.js")
    : window.TowerSearch;
const PathwaysCore = (() => {
  function normalize(value) {
    return String(value)
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }
  function searchText(post) {
    return normalize(
      [
        post.title,
        ...post.authors,
        ...post.originalAuthors,
        ...post.aliases,
        ...post.tags,
        ...post.paragraphs,
        post.account,
      ].join(" "),
    );
  }
  function filter(posts, choices) {
    return posts.filter(
      (post) =>
        (!choices.year || choices.year === "all" || post.year === choices.year) &&
        (!choices.author ||
          choices.author === "all" ||
          post.authors.includes(choices.author)) &&
        (!choices.kind ||
          choices.kind === "all" ||
          (choices.kind === "local"
            ? post.kind === "local/unflagged"
            : post.kind !== "local/unflagged")) &&
        (!choices.supported || post.tier === "source-supported") &&
        pathwaysSearch.matches(
          [
            post.title,
            ...post.authors,
            ...post.originalAuthors,
            ...post.aliases,
            ...post.tags,
            ...(post.fullParagraphs || post.paragraphs),
            post.account,
          ],
          choices.query || "",
          choices.searchMode || "words",
        ),
    );
  }
  function draw(posts, previousId, random = Math.random) {
    const eligible =
      posts.length > 1 ? posts.filter((post) => post.id !== previousId) : posts;
    return eligible.length ? eligible[Math.floor(random() * eligible.length)] : null;
  }
  function creditLabel(tier) {
    return tier === "source-supported"
      ? "Source-supported credit"
      : tier === "declared-credit"
        ? "Recorded author credit"
        : "Writer unverified · account credit";
  }
  return { normalize, searchText, filter, draw, creditLabel };
})();
if (typeof module !== "undefined" && module.exports) module.exports = PathwaysCore;
