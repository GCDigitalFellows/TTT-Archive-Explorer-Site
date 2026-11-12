/* Inputs: six saved public article examples in data.js. Outputs: sample reading
 * cards and source links. Search and random selection affect these six examples
 * only; no model, live archive query, tracking or settings storage runs here. */
"use strict";
const preview = window.REDESIGN_PREVIEW;
const get = (id) => document.getElementById(id);
const make = (tag, text) => {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  return el;
};
let path = "all";
function render() {
  const query = get("sample-search").value.trim().toLowerCase();
  const rows = preview.posts.filter(
    (row) =>
      (path === "all" || row.path === path) &&
      (!query ||
        [row.title, row.authors.join(" "), row.paragraph]
          .join(" ")
          .toLowerCase()
          .includes(query)),
  );
  const root = get("examples");
  root.replaceChildren();
  for (const row of rows) {
    const post = make("article");
    post.className = "post";
    const title = make("h3", row.title);
    post.append(title, make("p", row.connection));
    post.lastChild.className = "connection";
    const names = row.authors.join("; ");
    if (row.authors.length > 3) {
      const credits = make("details");
      credits.className = "credits";
      credits.append(
        make(
          "summary",
          row.authors.length + " source-credited coauthors · " + row.year,
        ),
        make("p", names),
      );
      post.append(credits);
    } else {
      const credits = make("p", names + " · " + row.year);
      credits.className = "credits";
      post.append(credits);
    }
    const detail = make("details");
    detail.append(
      make("summary", "Read a saved passage"),
      make("blockquote", row.paragraph),
    );
    post.append(detail);
    const original = make("a", "Read the original post ↗");
    original.href = row.url;
    post.append(original);
    const credit = make(
      "p",
      row.creditEvidence === "source-supported"
        ? "Credit supported by the saved source."
        : "Credit recorded in the post’s author metadata.",
    );
    credit.className = "credits";
    post.append(credit);
    root.append(post);
  }
  get("results-status").textContent = rows.length + " of 6 prototype examples shown.";
  if (!rows.length)
    root.append(make("p", "No examples match. Clear the search or show all examples."));
  return rows;
}
for (const button of document.querySelectorAll("[data-path]"))
  button.onclick = () => {
    path = button.dataset.path;
    for (const other of document.querySelectorAll("[data-path]"))
      other.setAttribute("aria-pressed", String(other === button));
    render();
  };
get("sample-search").addEventListener("input", render);
get("reset").onclick = () => {
  path = "all";
  get("sample-search").value = "";
  for (const button of document.querySelectorAll("[data-path]"))
    button.setAttribute("aria-pressed", "false");
  render();
};
get("random").onclick = () => {
  const rows = render();
  if (!rows.length) return;
  const index = Math.floor(Math.random() * rows.length);
  const card = get("examples").children[index];
  card.querySelector("details:not(.credits)").open = true;
  card.tabIndex = -1;
  card.focus();
  get("results-status").textContent = "Selected an example: " + rows[index].title;
};
const analysisFrame = document.querySelector(".analysis-frame");

// The published prototype and explorer share an origin. A local preview
// can still display the public explorer with its own styles.
function applyAnalysisReadingOptions() {
  const explorer = analysisFrame.contentDocument;
  if (!explorer?.documentElement || explorer.URL === "about:blank") return;

  if (!explorer.getElementById("prototype-analysis-reading-style")) {
    const stylesheet = explorer.createElement("link");
    stylesheet.id = "prototype-analysis-reading-style";
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("analysis-reading.css", document.baseURI).href;
    explorer.head.append(stylesheet);
  }

  explorer.documentElement.dataset.readingTheme = get("appearance").value;
  explorer.documentElement.dataset.readingFont = get("font").value;
  explorer.documentElement.dataset.readingSize = get("size").value;
}

// The embedded explorer can focus its heading on load. Start it only after
// someone chooses Analysis, so it cannot pull the homepage away from Start here.
const loadAnalysisButton = get("load-analysis");

function loadAnalysis() {
  if (analysisFrame.hasAttribute("src")) return;
  analysisFrame.hidden = false;
  analysisFrame.src = analysisFrame.dataset.src;
  loadAnalysisButton.hidden = true;
}

function loadAnalysisFromRoute() {
  if (location.hash === "#analysis") loadAnalysis();
}

loadAnalysisButton.hidden = false;
loadAnalysisButton.addEventListener("click", loadAnalysis);
window.addEventListener("hashchange", loadAnalysisFromRoute);
analysisFrame.addEventListener("load", applyAnalysisReadingOptions);
loadAnalysisFromRoute();
applyAnalysisReadingOptions();

for (const [control, attribute] of [
  ["font", "data-font"],
  ["size", "data-size"],
  ["spacing", "data-spacing"],
  ["appearance", "data-theme"],
])
  get(control).addEventListener("change", () => {
    document.documentElement.setAttribute(attribute, get(control).value);
    applyAnalysisReadingOptions();
  });
render();

// Each gallery keeps its own position. With JavaScript disabled, all
// screenshots remain visible in reading order.
function initializeScreenshotGallery(prefix, initialIndex) {
  const slides = [...get(prefix + "-slides").querySelectorAll("figure")];
  const previous = get(prefix + "-previous");
  const next = get(prefix + "-next");
  const all = get(prefix + "-all");
  const position = get(prefix + "-position");
  const showAllLabel = all.textContent;
  let activeIndex = initialIndex;
  let showAll = false;

  function renderGallery() {
    for (const [index, slide] of slides.entries()) {
      slide.hidden = !showAll && index !== activeIndex;
    }
    const title = slides[activeIndex].querySelector("strong").textContent;
    position.textContent = showAll
      ? `Showing all ${slides.length} screenshots`
      : `${activeIndex + 1} of ${slides.length} · ${title}`;
    all.textContent = showAll ? "Return to carousel" : showAllLabel;
    previous.disabled = showAll;
    next.disabled = showAll;
  }

  previous.addEventListener("click", () => {
    activeIndex = (activeIndex + slides.length - 1) % slides.length;
    renderGallery();
  });
  next.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % slides.length;
    renderGallery();
  });
  all.addEventListener("click", () => {
    showAll = !showAll;
    renderGallery();
  });
  get(prefix + "-controls").hidden = false;
  renderGallery();
}

initializeScreenshotGallery("original-blog", 0);
initializeScreenshotGallery("design", 2);
initializeScreenshotGallery("featured-visualizations", 0);

// Use words from the saved common-word cloud and short phrases from the
// published excerpts in data.js. Sampling never reads raw posts or bylines.
function initializeWordTrail() {
  const vocabulary = [
    "digital", "research", "project", "data", "workshop", "technology",
    "create", "learning new skills", "building community", "geographic data",
    "the ethics of boundaries", "what we produce", "how we behave",
  ];
  const button = get("word-trail-toggle");
  const layer = get("word-trail");
  const motion = matchMedia("(any-hover: hover) and (prefers-reduced-motion: no-preference)");
  let lastDraw = -Infinity;
  let previousWord = "";

  function drawWord(event) {
    if (event.pointerType !== "mouse" || event.buttons || event.target.closest("a, button, input, select, summary")) return;
    if (event.timeStamp - lastDraw < 125) return;

    lastDraw = event.timeStamp;
    const choices = vocabulary.filter((word) => word !== previousWord);
    const word = choices[Math.floor(Math.random() * choices.length)];
    previousWord = word;
    const fragment = make("span", word);
    fragment.className = "word-trail-fragment";
    const placeToLeft = event.clientX > layer.clientWidth / 2;
    fragment.style.left = `${event.clientX + (placeToLeft ? -16 : 16)}px`;
    fragment.style.top = `${Math.max(36, event.clientY - 18)}px`;
    fragment.style.setProperty("--trail-offset", placeToLeft ? "-100%" : "0px");
    fragment.addEventListener("animationend", () => fragment.remove(), { once: true });
    // Bound the number of elements even when an animation is interrupted.
    if (layer.childElementCount >= 10) layer.firstElementChild.remove();
    layer.append(fragment);
  }

  function setEnabled(enabled) {
    button.setAttribute("aria-pressed", String(enabled));
    button.textContent = enabled ? "Word Trail On" : "Word Trail Off";
    if (enabled) {
      window.addEventListener("pointermove", drawWord, { passive: true });
    } else {
      window.removeEventListener("pointermove", drawWord);
      layer.replaceChildren();
    }
  }

  function updateAvailability() {
    if (!motion.matches) setEnabled(false);
    button.hidden = !motion.matches;
  }

  button.addEventListener("click", () => {
    setEnabled(motion.matches && button.getAttribute("aria-pressed") === "false");
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setEnabled(false);
  });
  motion.addEventListener("change", updateAvailability);
  updateAvailability();
  setEnabled(motion.matches);
}

initializeWordTrail();

const technologyDialog = get("technology-cloud-dialog");
const technologyLauncher = get("technology-cloud-launch");
const technologyFrame = technologyDialog.querySelector("iframe");

technologyLauncher.addEventListener("click", (event) => {
  // The ordinary link also works when native dialogs are unavailable.
  if (!technologyDialog.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  technologyDialog.showModal();
  if (!technologyFrame.hasAttribute("src")) technologyFrame.src = technologyFrame.dataset.src;
});

// Escape inside the embedded document must close the outer dialog too.
technologyFrame.addEventListener("load", () => {
  technologyFrame.contentDocument?.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && technologyDialog.open) technologyDialog.close();
  });
});
technologyDialog.addEventListener("close", () => technologyLauncher.focus());
