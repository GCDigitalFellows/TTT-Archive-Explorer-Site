/* Shared archive search: saved text only, with no NLP, upload or new model fit.
 * All-words matches whole words in any indexed field. Exact-phrase requires
 * adjacent whole words inside one field/paragraph. Case, accents and punctuation
 * are normalized; quotation marks are punctuation, not a separate query syntax.
 * Keep metadata fields separate so a phrase cannot cross two unrelated credits.
 */
"use strict";
const TowerSearch = (() => {
  function normalize(value) {
    return String(value || "").normalize("NFKD").replace(/\p{M}/gu, "")
      .toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  }
  function matches(fields, query, mode = "words") {
    const normalized = normalize(query);
    if (!normalized) return true;
    const texts = fields.map(normalize);
    if (mode === "phrase")
      return texts.some(text => (" " + text + " ").includes(" " + normalized + " "));
    const words = new Set(texts.flatMap(text => text.split(" ")));
    return normalized.split(" ").every(word => words.has(word));
  }
  function excerpt(paragraphs, budget = 950) {
    const selected = [];
    let remaining = budget;
    for (const text of paragraphs) {
      if (remaining < 30) break;
      if (text.length > remaining) {
        selected.push(text.slice(0, remaining).replace(/\s+\S*$/, "") + "…");
        break;
      }
      selected.push(text); remaining -= text.length;
    }
    return selected;
  }
  function snippet(paragraphs, query, mode = "words", budget = 220) {
    if (!normalize(query)) return "";
    const paragraph = paragraphs.find(text => matches([text], query, mode));
    // A query may match only metadata or words in separate paragraphs. Do not
    // present an unrelated opening passage as evidence of a phrase match.
    if (!paragraph) return "Match in metadata or across saved-text passages.";
    const first = normalize(query).split(" ")[0];
    // Locate the original token, retaining accents and character offsets.
    const token = [...paragraph.matchAll(/[\p{L}\p{N}\p{M}]+/gu)]
      .find(match => normalize(match[0]) === first);
    const position = token ? token.index : 0;
    const start = Math.max(0, position - 60);
    const text = paragraph.slice(start, start + budget);
    return (start ? "…" : "") + text + (start + budget < paragraph.length ? "…" : "");
  }
  return {normalize, matches, excerpt, snippet};
})();
if (typeof module !== "undefined" && module.exports) module.exports = TowerSearch;
if (typeof window !== "undefined") window.TowerSearch = TowerSearch;
