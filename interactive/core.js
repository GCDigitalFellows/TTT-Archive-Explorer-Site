/* Calculations for the interactive explorer.
 *
 * These functions have no page controls, network calls, or hidden model fitting.
 * They receive saved data and choices and return ordinary arrays/objects.
 * Node tests compare them with independently saved Python/MALLET tables.
 * A topic weight is a mixture component, not a confidence in an interpretation.
 */

"use strict";

// A membership match describes a recorded credit, not verified authorship.
// Keep the original signed-list basis when no choice is supplied, so older
// calculations and their independently saved reference tables stay reproducible.
function membershipNames(post, basis = "signed") {
  if (basis === "signed") return post.cohortNames || post.membershipByBasis?.signed || [];
  return post.membershipByBasis?.[basis] || [];
}

function filterPosts(posts, choices) {
  // Collective posts contain several names. Include/exclude means membership
  // in that credited-name list, not sole authorship or a causal author effect.
  return posts.filter(
    (post) =>
      post.startYear >= choices.firstYear &&
      post.startYear <= choices.lastYear &&
      (!choices.supportedOnly || post.authorshipTier === "source-supported") &&
      (!choices.cohortOnly || membershipNames(post, choices.membershipBasis).length > 0) &&
      (!choices.author || post.authors.includes(choices.author)) &&
      (!choices.excludeAuthor || !post.authors.includes(choices.excludeAuthor)),
  );
}

function topicAverages(posts, model, weighting = "posts") {
  // Use one weight per post, or its number of MALLET input tokens. This is
  // aggregation of an existing model; changing filters never retrains MALLET.
  const years = [...new Set(posts.map((post) => post.year))].sort();
  return years.map((year) => {
    const selected = posts.filter((post) => post.year === year);
    const denominator = selected.reduce(
      (sum, post) => sum + (weighting === "tokens" ? post.modelTokens : 1),
      0,
    );
    const weights = Array(model.count).fill(0);
    for (const post of selected) {
      const influence = weighting === "tokens" ? post.modelTokens : 1;
      model.mixtures[post.id].forEach((value, topic) => {
        weights[topic] += (value * influence) / denominator;
      });
    }
    return { year, posts: selected.length, denominator, weights };
  });
}

function rankPosts(posts, model, topic, selectedYear = "all") {
  return posts
    .filter((post) => selectedYear === "all" || post.year === selectedYear)
    .map((post) => ({ ...post, weight: model.mixtures[post.id][topic] }))
    .sort(
      (left, right) => right.weight - left.weight || left.id.localeCompare(right.id),
    );
}

function wordFrequencies(posts, dictionary, measure = "count") {
  // Each post's sparse wordCounts list contains one pair per distinct lemma.
  // Count occurrences and document presence separately so they cannot be confused.
  const totals = new Map();
  for (const post of posts) {
    for (const [index, occurrences] of post.wordCounts) {
      const row = totals.get(index) || {
        word: dictionary[index],
        count: 0,
        documents: 0,
      };
      row.count += occurrences;
      row.documents += 1;
      totals.set(index, row);
    }
  }
  return [...totals.values()].sort(
    (a, b) => b[measure] - a[measure] || a.word.localeCompare(b.word),
  );
}

function phraseRanking(phrases, measure, minimumDocuments) {
  // Scores are saved WHOLE-CORPUS NLTK scores, not recomputed for filtered years.
  return phrases
    .filter((row) => row.documents >= minimumDocuments)
    .slice()
    .sort((a, b) => b[measure] - a[measure] || a.phrase.localeCompare(b.phrase));
}

function publicationCounts(publications) {
  // Drafts never enter published bars. They remain selectable in the audit list.
  const years = [...new Set(publications.map((row) => row.year))].sort();
  return years.map((year) => {
    const rows = publications.filter((row) => row.year === year);
    return {
      year,
      local: rows.filter(
        (row) => row.status === "publish" && row.kind === "local/unflagged",
      ).length,
      curated: rows.filter(
        (row) => row.status === "publish" && row.kind !== "local/unflagged",
      ).length,
      drafts: rows.filter((row) => row.status === "draft").length,
    };
  });
}

function motifCounts(rows, motif) {
  const periods = [...new Set(rows.map((row) => row.period))].sort();
  return periods.map((period) => {
    const selected = rows.filter((row) => row.period === period);
    const count = selected.filter((row) => row.matches.includes(motif)).length;
    return {
      period,
      posts: selected.length,
      count,
      proportion: count / selected.length,
    };
  });
}

function csvText(rows) {
  // Quoting protects commas and quotation marks. A leading apostrophe prevents
  // a title/name beginning with a spreadsheet formula from being executed.
  if (!rows.length) return "";
  const columns = Object.keys(rows[0]);
  function cell(value) {
    let text = String(value ?? "");
    if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }
  return [columns, ...rows.map((row) => columns.map((name) => row[name]))]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
}

// One shared implementation works in the page and in the independent Node tests.
const TowerMath = {
  membershipNames,
  filterPosts,
  topicAverages,
  rankPosts,
  wordFrequencies,
  phraseRanking,
  publicationCounts,
  motifCounts,
  csvText,
};
if (typeof module !== "undefined" && module.exports) module.exports = TowerMath;
if (typeof window !== "undefined") window.TowerMath = TowerMath;
