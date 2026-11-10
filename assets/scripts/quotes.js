/* Saved literal sentences only: no runtime NLP, rewriting or network requests.
 * Draw an article first to prevent longer posts receiving extra chances.
 * Tab-local IDs avoid repeats; storage failures fall back to in-memory history.
 */
"use strict";
(() => {
  const root = document.getElementById("welcoming-prototype"),
    get = (id) => document.getElementById(id);
  const data = JSON.parse(get("wp-data").textContent),
    saved = JSON.parse(get("quote-pool").textContent);
  const posts = new Map(data.posts.map((p) => [p.id, p]));
  const annotations = new Map(saved.collection.entries.map((e) => [e.id, e]));
  let pool = new Map(),
    mode = "selected",
    key = "",
    history = { seen: [], last: null },
    current = null,
    storage = true;
  // Each collection has its own cycle. Switching also avoids the article just
  // shown, when it exists in the new pool and another article is available.
  function chooseCollection() {
    const previous = current?.post;
    mode = get("quote-collection").value;
    pool = new Map();
    for (const c of QuoteLab.collectionCandidates(saved, mode)) {
      if (!pool.has(c.post)) pool.set(c.post, []);
      pool.get(c.post).push(c);
    }
    key = "ttt-archive-voice-" + saved.poolId + "-" + mode + "-" + saved.collection.id;
    history = { seen: [], last: null };
    try {
      const h = JSON.parse(sessionStorage.getItem(key) || "null");
      if (h && Array.isArray(h.seen))
        history = {
          seen: h.seen.filter((id) => pool.has(id)),
          last: pool.has(h.last) ? h.last : null,
        };
    } catch (_) {
      storage = false;
    }
    if (previous && pool.has(previous)) {
      history.last = previous;
      history.seen = [...new Set([...history.seen, previous])];
    }
  }
  const node = (tag, text) => {
    const n = document.createElement(tag);
    n.textContent = text;
    return n;
  };
  // Animate only the visual copy after an explicit Another voice action.
  // The full literal sentence is immediately available to assistive technology.
  // An invisible remainder reserves all lines, avoiding layout jumps while typing.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animationFrame = null;
  let finishReveal = () => {};
  function renderSentence(text, animate) {
    finishReveal();
    const fullText = node("span", text);
    fullText.className = "sr";
    const visual = node("span", "");
    visual.setAttribute("aria-hidden", "true");
    const typed = node("span", "");
    const remaining = node("span", text);
    remaining.style.visibility = "hidden";
    visual.append(typed, remaining);
    get("quote-text").replaceChildren(fullText, visual);
    const finish = () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      typed.textContent = text;
      remaining.textContent = "";
      const skip = get("quote-finish");
      const hadFocus = document.activeElement === skip;
      skip.hidden = true;
      if (hadFocus) get("quote-next").focus();
    };
    finishReveal = finish;
    if (!animate || reducedMotion.matches) {
      finish();
      return;
    }
    // Segment complete characters, including combining marks where supported.
    const characters =
      typeof Intl.Segmenter === "function"
        ? Array.from(
            new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
            (part) => part.segment,
          )
        : Array.from(text);
    const duration = Math.min(1400, Math.max(450, characters.length * 9));
    const started = performance.now();
    get("quote-finish").hidden = false;
    function frame(now) {
      const count = Math.min(
        characters.length,
        Math.floor((characters.length * (now - started)) / duration),
      );
      typed.textContent = characters.slice(0, count).join("");
      remaining.textContent = characters.slice(count).join("");
      if (count === characters.length) finish();
      else animationFrame = requestAnimationFrame(frame);
    }
    animationFrame = requestAnimationFrame(frame);
  }
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) finishReveal();
  });
  get("quote-finish").addEventListener("click", () => finishReveal());
  function draw({ animate = false } = {}) {
    const result = QuoteLab.draw(pool, posts, history, "article");
    if (!result) {
      get("quote-text").textContent = "No source sentence is available.";
      get("quote-context").disabled = true;
      return;
    }
    current = result.sentence;
    history = result.history;
    try {
      sessionStorage.setItem(key, JSON.stringify(history));
    } catch (_) {
      storage = false;
    }
    const post = posts.get(current.post);
    renderSentence(current.text, animate);
    get("quote-caption").textContent =
      post.title +
      " · article credited to " +
      post.authors.join("; ") +
      " · " +
      post.year;
    const annotation = mode === "selected" ? annotations.get(current.id) : null;
    get("quote-context-note").textContent = annotation?.context || "";
    get("quote-selection-reason").textContent = annotation
      ? "Why this excerpt was selected: " + annotation.reason
      : "";
    get("quote-about-excerpt").hidden = !annotation;
    get("quote-announcement").textContent =
      "New excerpt from " +
      post.title +
      ". " +
      (mode === "selected" ? "Selected collection." : "Broader random discovery.");
    get("quote-context").dataset.post = post.id;
    get("quote-status").textContent =
      pool.size +
      " eligible articles · " +
      [...pool.values()].reduce((n, a) => n + a.length, 0) +
      " sentences in " +
      (mode === "selected"
        ? "the selected collection. "
        : "broader random discovery. ") +
      (result.cycled ? "A new article cycle has begun. " : "") +
      (storage
        ? "Article-ID history stays in this tab’s session."
        : "Storage is unavailable; repeats are avoided only until this page reloads.");
  }
  get("quote-next").addEventListener("click", () => draw({ animate: true }));
  get("quote-collection").addEventListener("change", () => {
    chooseCollection();
    draw();
  });
  get("quote-context").addEventListener("click", () => {
    if (!current) return;
    finishReveal();
    const sentence = current;
    const full = [...root.querySelectorAll("#wp-read details")].find(
      (n) => n.querySelector("summary")?.textContent === "Read the full saved text",
    );
    if (!full) return;
    full.open = true;
    const p = [...full.querySelectorAll("p")][sentence.paragraph + 1];
    if (
      p &&
      p.textContent === posts.get(sentence.post).fullParagraphs[sentence.paragraph]
    ) {
      const text = Array.from(p.textContent),
        mark = node("mark", text.slice(sentence.start, sentence.end).join(""));
      mark.tabIndex = -1;
      p.replaceChildren(
        document.createTextNode(text.slice(0, sentence.start).join("")),
        mark,
        document.createTextNode(text.slice(sentence.end).join("")),
      );
      mark.focus();
      mark.scrollIntoView({ block: "center" });
    }
  });
  chooseCollection();
  draw();
})();
