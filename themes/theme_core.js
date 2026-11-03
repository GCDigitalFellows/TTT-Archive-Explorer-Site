/* Pure thematic calculations: no page controls, network calls or model fitting.
 *
 * Read these functions to review what the charts count. A post can carry more
 * than one theme, so adding theme totals can count the same post several times.
 * A post with no matching signal still belongs in the eligible denominator.
 */
"use strict";

function eligibleThemePosts(posts, mode, choices) {
  // The interpretive essay has a deliberately smaller, selected population.
  // Credit filtering excludes provisional attribution, not uncertain identities.
  return posts.filter(
    (post) =>
      (mode !== "essay" || post.sample) &&
      (choices.year === "all" || post.year === choices.year) &&
      (choices.author === "all" || post.authors.includes(choices.author)) &&
      (!choices.supportedOnly || post.authorshipTier === "source-supported") &&
      (!choices.membershipBasis || choices.membershipBasis === "all" || (post.membershipByBasis?.[choices.membershipBasis] || []).length > 0) &&
      (!choices.explicit ||
        ["explicit body credit", "author taxonomy", "reviewed export metadata credit", "reviewed institutional guide credit", "explicit source-author bio", "reviewed cross-reference credit"].includes(post.creditStatus)),
  );
}

function themeYearCounts(posts, mode, themes, years) {
  // Return both counts and denominators. The interface decides how to display
  // them; this function never interprets a zero denominator as a zero percent.
  return years.map((year) => {
    const eligible = posts.filter((post) => post.year === year);
    return {
      year,
      denominator: eligible.length,
      counts: themes.map(
        (theme) =>
          eligible.filter((post) => post.signals[mode].includes(theme)).length,
      ),
    };
  });
}

function themeOverlap(posts, mode, first, second) {
  // Intersection = posts with both labels; union = posts with either label.
  // Count a shared post only once. This does not measure agreement or causality.
  const left = posts.filter((post) => post.signals[mode].includes(first));
  const right = posts.filter((post) => post.signals[mode].includes(second));
  const intersection = left.filter((post) =>
    post.signals[mode].includes(second),
  ).length;
  return {
    first: left.length,
    second: right.length,
    intersection,
    union: left.length + right.length - intersection,
  };
}

function themeAuthors(posts, mode, theme) {
  // A joint article contributes one credit to each distinct named writer.
  // Provisional credit counts stay attached to the matching posts, rather
  // than becoming a blanket judgment about every article by that person.
  const rows = new Map();
  for (const post of posts) {
    for (const author of new Set(post.authors)) {
      const row = rows.get(author) || {
        author,
        eligible: 0,
        matches: 0,
        provisional: 0,
      };
      row.eligible += 1;
      if (post.signals[mode].includes(theme)) {
        row.matches += 1;
        row.provisional += Number(
          post.creditStatus === "provisional posting-account attribution",
        );
      }
      rows.set(author, row);
    }
  }
  return [...rows.values()].sort(
    (left, right) =>
      right.matches - left.matches || left.author.localeCompare(right.author),
  );
}

const TowerThemeMath = {
  eligibleThemePosts,
  themeYearCounts,
  themeOverlap,
  themeAuthors,
};
if (typeof module !== "undefined" && module.exports)
  module.exports = TowerThemeMath;
if (typeof window !== "undefined") window.TowerThemeMath = TowerThemeMath;
