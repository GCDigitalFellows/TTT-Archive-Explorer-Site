/* Pure candidate selection for the archive quotation card; no network calls or rewriting.
 * Article-first sampling prevents longer articles gaining extra draw chances.
 * A history of article IDs—not text or visitor identity—is kept by the UI.
 */
"use strict";
const QuoteLab = {
  // Preserve the original sentence records. Collection metadata selects IDs only;
  // article-first sampling below remains identical in both modes.
  collectionCandidates(saved, mode) {
    if (mode === "broad") return saved.candidates;
    const ids = new Set(saved.collection.entries.map((e) => e.id));
    return saved.candidates.filter((c) => ids.has(c.id));
  },
  reasons(c, p, s) {
    const reasons = [...c.hard];
    if (s.tier === "supported" && p.tier !== "source-supported")
      reasons.push("outside source-supported credit scope");
    if (s.tier === "named" && p.tier === "unresolved-account")
      reasons.push("posting-account-only credit");
    if (c.words < s.min || c.words > s.max || c.characters > s.characters)
      reasons.push("outside length limits");
    if (s.context && c.cautions.length) reasons.push(...c.cautions);
    if (s.repeats && c.repeatedInPosts >= 3)
      reasons.push("sentence repeated in at least three local posts");
    if (s.signal !== "all" && !(p.signals || []).includes(s.signal))
      reasons.push("outside article title/tag signal");
    if (s.query && !c.text.toLocaleLowerCase().includes(s.query.toLocaleLowerCase()))
      reasons.push("sentence does not contain search text");
    if (s.sampling === "topic" && !p.weights)
      reasons.push("no saved MALLET profile for topic sampling");
    return reasons;
  },
  eligible(candidates, posts, s) {
    const map = new Map();
    for (const c of candidates) {
      const p = posts.get(c.post);
      if (!this.reasons(c, p, s).length) {
        if (!map.has(p.id)) map.set(p.id, []);
        map.get(p.id).push(c);
      }
    }
    return map;
  },
  draw(pool, posts, history, sampling, random = Math.random) {
    if (!pool.size) return null;
    let remaining = [...pool.keys()].filter((id) => !history.seen.includes(id)),
      cycled = false;
    let seen = [...history.seen];
    if (!remaining.length) {
      cycled = true;
      seen = seen.filter((id) => !pool.has(id));
      remaining = [...pool.keys()].filter(
        (id) => pool.size === 1 || id !== history.last,
      );
    }
    if (!remaining.length) remaining = [...pool.keys()];
    const pick = (list) =>
      list[Math.min(list.length - 1, Math.floor(random() * list.length))];
    let choices = remaining;
    if (sampling !== "article") {
      const groups = new Map();
      for (const id of remaining) {
        const p = posts.get(id);
        const key =
          sampling === "year" ? p.year : p.weights.indexOf(Math.max(...p.weights));
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(id);
      }
      choices = pick([...groups.values()]);
    }
    const article = pick(choices),
      sentence = pick(pool.get(article));
    return {
      article,
      sentence,
      cycled,
      history: { seen: [...new Set([...seen, article])], last: article },
    };
  },
};
if (typeof module !== "undefined" && module.exports) module.exports = QuoteLab;
