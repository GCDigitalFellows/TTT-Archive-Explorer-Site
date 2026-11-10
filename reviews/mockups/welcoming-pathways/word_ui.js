/* Five analytic lenses on one preserved current modeled-post corpus.
 * Python supplies the versioned aggregates; JavaScript selects and partitions
 * them. No browser NLP/model fit, source edit or authorship inference occurs.
 * Keep raw counts, incidence shares, distinctiveness scores and topic weights
 * separate: their units and denominators cannot be used interchangeably.
 */
"use strict";
function createPathwaysWords({ root, data, showPosts, clearDetails, announce }) {
  const get = (name) => root.querySelector("#" + name),
    evidence = data.wordViews;
  let year = "all",
    mode = "cloud",
    lens = "shared",
    order = "years",
    topicFocus = "all",
    leading = true;
  const cloudRoot = get("wp-word-cloud-view");
  const cloudChart = cloudRoot.querySelector("#cloud");
  let cloudRanking = "common";
  const make = (tag, text) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const svgTag = (tag, attrs = {}) => {
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    return n;
  };
  const number = (n) => (Number.isInteger(n) ? n.toLocaleString() : n.toFixed(3));
  const view = () => data.hierarchies.modes[lens];
  const focus = (group) => PathwaysAnalysis.sunburstFocus(group, lens, leading);
  const percent = (n) => (100 * n).toFixed(2) + "%";
  let pinned = null,
    pinnedRecord = null,
    lastComparisonLens = null,
    overviewYear = null;
  const branchControls = [];
  const branchId = (group, row) => JSON.stringify([group.label, row.key ?? row.word]);
  function measurement(group, row) {
    const scope = focus(group);
    const parentShare = scope.denominator ? row.count / scope.denominator : null;
    return (
      `${group.label} · ${row.word}: ${number(row.count)} ${view().unit}; ${row.ids.length} of ${group.posts} contributing posts. Parent denominator: ${number(scope.denominator)} ${view().unit}. ` +
      (lens === "distinct"
        ? "This is a positive score, not writing prevalence or statistical significance."
        : `Full-parent share: ${parentShare === null ? "unavailable" : percent(parentShare)}.`) +
      (scope.focused && scope.shown
        ? scope.rows.some((item) => item.key === row.key)
          ? ` Share among the five displayed branches: ${percent(row.count / scope.shown)}; the five cover ${percent(scope.coverage)} of the full parent count.`
          : " This branch is outside the displayed top five; no rescaled share is assigned to it."
        : "")
    );
  }
  function bindBranch(control, group, row) {
    const id = branchId(group, row);
    control.setAttribute("aria-pressed", String(id === pinned));
    control.setAttribute(
      "aria-label",
      measurement(group, row) + " Select to pin source evidence.",
    );
    branchControls.push({ control, id });
    const preview = () => {
      for (const entry of branchControls)
        entry.control.classList.toggle("sunburst-highlight", entry.id === id);
      get("wp-sun-preview").textContent =
        "Preview · " +
        measurement(group, row) +
        " Select to pin evidence; previews do not replace a pinned selection.";
    };
    control.addEventListener("pointerenter", preview);
    control.addEventListener("focus", preview);
    const clearPreview = () => {
      for (const entry of branchControls)
        entry.control.classList.remove("sunburst-highlight");
    };
    control.addEventListener("pointerleave", clearPreview);
    control.addEventListener("blur", clearPreview);
  }
  function pinEvidence(group, row) {
    pinned = branchId(group, row);
    pinnedRecord = { group, row };
    for (const entry of branchControls)
      entry.control.setAttribute("aria-pressed", String(entry.id === pinned));
    const panel = get("wp-sun-pinned");
    panel.replaceChildren(
      make("h4", "Pinned branch"),
      make("p", measurement(group, row)),
    );
    // Literal saved paragraphs, with title/credit context. They illustrate the
    // selected branch; they are not generated summaries or new model judgments.
    for (const id of row.ids.slice(0, 3)) {
      const post = data.posts.find((item) => item.id === id);
      if (!post) continue;
      const paragraph = (post.fullParagraphs || post.paragraphs || []).find((text) =>
        text.trim(),
      );
      const detail = make("details");
      detail.append(
        make(
          "summary",
          post.title +
            " · " +
            post.authors.join("; ") +
            " · " +
            post.year +
            " · " +
            PathwaysCore.creditLabel(post.tier),
        ),
      );
      detail.append(
        make(
          "p",
          "Opening paragraph from a contributing post; it may not contain the displayed cleaned form. Expand the original post for full context.",
        ),
      );
      if (paragraph) detail.append(make("blockquote", paragraph));
      const original = make("a", "Read original post ↗");
      original.href = post.url;
      detail.append(original);
      panel.append(detail);
    }
  }
  function inspect(group, row) {
    if (mode === "sun") pinEvidence(group, row);
    const unit = view().unit;
    const label = `${group.label} · ${row.word} · ${number(row.count)} ${unit} · ${row.ids.length} containing/contributing posts`;
    get("wp-word-detail").textContent = label + ". Source posts appear below.";
    get("wp-word-selection-text").textContent =
      label +
      (lens === "topics"
        ? ". Posts are ordered by saved topic weight; a positive weight is not a verified thematic assignment."
        : ". Inspect context before interpreting the term.");
    get("wp-word-source-jump").hidden = false;
    showPosts(row.ids, label);
    announce(label);
  }
  function sourceButton(group, row) {
    const b = make("button", row.word);
    b.type = "button";
    b.addEventListener("click", () => inspect(group, row));
    return b;
  }
  function resetDetail() {
    pinned = null;
    pinnedRecord = null;
    get("wp-sun-pinned").replaceChildren();
    get("wp-sun-preview").textContent =
      "Focus or hover over a branch for its full measurement. Select it to pin source evidence.";
    clearDetails();
    get("wp-word-detail").textContent =
      "Select a branch or table value to inspect source posts.";
    get("wp-word-selection-text").textContent =
      "Select a year to expand it, or a word/topic to inspect its evidence.";
    get("wp-word-source-jump").hidden = true;
  }
  function chooseYear(value) {
    year = value;
    topicFocus = "all";
    get("wp-topic-focus").value = "all";
    if (mode === "heat") mode = "sun";
    get("wp-word-year").value = value;
    resetDetail();
    render();
    get("wp-word-summary").tabIndex = -1;
    get("wp-word-summary").focus();
    announce(value === "all" ? "All academic years displayed" : value + " expanded");
  }
  // Same data, reversed nesting: each fractional topic contribution is retained.
  function chartGroups() {
    const groups = view().groups.filter((g) => year === "all" || g.label === year);
    if (lens !== "topics" || order === "years") return groups;
    return data.topics
      .map((topic, index) => {
        const rows = groups.map((g) => {
          const r = g.rows[index];
          return { ...r, word: g.label, key: g.label, year: g.label };
        });
        const mass = rows.reduce((n, r) => n + r.count, 0);
        return {
          label: topic.label,
          topicIndex: index,
          mass,
          denominator: mass,
          posts: new Set(rows.flatMap((r) => r.ids)).size,
          rows: rows.map((r) => ({ ...r, value: mass ? r.count / mass : 0 })),
        };
      })
      .filter((g) => topicFocus === "all" || g.topicIndex === Number(topicFocus));
  }
  function sector(start, end, inner, outer) {
    const point = (r, a) => [380 + r * Math.cos(a), 380 + r * Math.sin(a)].join(",");
    const large = end - start > Math.PI ? 1 : 0;
    end = Math.min(end, start + 2 * Math.PI - 0.00001);
    return `M${point(outer, start)} A${outer},${outer} 0 ${large} 1 ${point(outer, end)} L${point(inner, end)} A${inner},${inner} 0 ${large} 0 ${point(inner, start)} Z`;
  }
  function action(svg, label, path, fn) {
    const a = svgTag("a", {
      href: "#wp-word-detail",
      role: "button",
      "aria-label": label,
    });
    const title = svgTag("title");
    title.textContent = label;
    path.append(title);
    a.append(path);
    a.addEventListener("click", (e) => {
      e.preventDefault();
      fn();
    });
    a.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        e.preventDefault();
        fn();
      }
    });
    svg.append(a);
    return a;
  }
  const sunTarget = get("wp-word-sun");
  const rings = { center: 92, group: 220, leafStart: 225, leafEnd: 350 };
  let fitCurrentSunburst = () => {};

  // Measure the actual glyph bounds in SVG coordinates. All four corners
  // must fit within the ring and the angular span, with room for the stroke.
  function fitsSector(text, sector) {
    const box = text.getBBox();
    const rotation = sector.angle + (Math.cos(sector.angle) < 0 ? Math.PI : 0);
    const x = Number(text.getAttribute("x"));
    const y = Number(text.getAttribute("y"));
    const corners = [box.x - 2, box.x + box.width + 2].flatMap((left) =>
      [box.y - 2, box.y + box.height + 2].map((top) => {
        const dx = left - x;
        const dy = top - y;
        return [
          x + dx * Math.cos(rotation) - dy * Math.sin(rotation) - 380,
          y + dx * Math.sin(rotation) + dy * Math.cos(rotation) - 380,
        ];
      }),
    );
    return corners.every(([cx, cy]) => {
      const along = cx * Math.cos(sector.angle) + cy * Math.sin(sector.angle);
      const across = -cx * Math.sin(sector.angle) + cy * Math.cos(sector.angle);
      return (
        along >= sector.inner + 3 &&
        Math.hypot(cx, cy) <= sector.outer - 3 &&
        Math.abs(Math.atan2(across, along)) <= sector.span / 2
      );
    });
  }

  function fitSunburstLabels(svg, layer, candidates, center) {
    const width = svg.getBoundingClientRect().width;
    if (!width) return;
    layer.replaceChildren();
    const scale = width / 760;
    const minimum =
      0.875 * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const fontSize = Math.max(15, minimum / scale);
    const occupied = [];
    let omitted = 0;
    let abbreviated = false;
    const centerLabel = svgTag("text", {
      x: 380,
      y: 380,
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      class: "sunburst-center",
    });
    centerLabel.style.fontSize = fontSize + "px";
    centerLabel.textContent = center;
    layer.append(centerLabel);
    const centerBox = centerLabel.getBBox();
    if (Math.hypot(centerBox.width / 2 + 3, centerBox.height / 2 + 3) > rings.center)
      centerLabel.remove();
    for (const candidate of candidates) {
      const radius = (candidate.inner + candidate.outer) / 2;
      const x = 380 + radius * Math.cos(candidate.angle);
      const y = 380 + radius * Math.sin(candidate.angle);
      const turn =
        (candidate.angle * 180) / Math.PI + (Math.cos(candidate.angle) < 0 ? 180 : 0);
      const text = svgTag("text", {
        x,
        y,
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        transform: `rotate(${turn} ${x} ${y})`,
      });
      text.style.fontSize = fontSize + "px";
      layer.append(text);
      // Only academic years may use a compact date. Never truncate a word,
      // phrase or topic: if its complete text cannot fit, the full-label
      // panel/key and hover/focus evidence carry it instead.
      const shortYear = /^20(\d{2})–20(\d{2})$/.exec(candidate.label);
      const variants = shortYear
        ? [
            candidate.label,
            shortYear[1] + "–" + shortYear[2],
            "20" + shortYear[1],
            "’" + shortYear[1],
          ]
        : [candidate.label];
      const placed = variants.some((label) => {
        text.textContent = label;
        if (!fitsSector(text, candidate)) return false;
        const box = text.getBoundingClientRect();
        if (
          occupied.some(
            (other) =>
              box.left < other.right + 1 &&
              box.right > other.left - 1 &&
              box.top < other.bottom + 1 &&
              box.bottom > other.top - 1,
          )
        )
          return false;
        occupied.push(box);
        abbreviated ||= label !== candidate.label;
        return true;
      });
      if (!placed) {
        text.remove();
        omitted++;
      }
    }
    get("wp-sunburst-label-note").textContent =
      omitted || abbreviated
        ? "Some labels do not fit inside their slices and are omitted there. Complete names remain in the selected-year panel and chart key; words are never abbreviated."
        : "Select a slice or a name in the chart key to inspect its sources.";
  }

  new ResizeObserver(() => fitCurrentSunburst()).observe(sunTarget);
  new MutationObserver(() => fitCurrentSunburst()).observe(root, {
    attributes: true,
    attributeFilter: ["data-design-year", "class", "style"],
  });
  document.fonts?.ready.then(() => fitCurrentSunburst());
  // Give every drawn branch a full-size text control, even when its slice
  // cannot carry a label. The key and SVG share the same action and data.
  function keyButton(text, branch, onSelect) {
    const control = make("button", text);
    control.type = "button";
    control.addEventListener("click", onSelect);
    const highlight = () => branch.classList.add("sunburst-highlight");
    const clear = () => branch.classList.remove("sunburst-highlight");
    control.addEventListener("pointerenter", highlight);
    control.addEventListener("pointerleave", clear);
    control.addEventListener("focus", highlight);
    control.addEventListener("blur", clear);
    return control;
  }

  function sunburst() {
    const target = sunTarget;
    target.replaceChildren();
    const key = get("wp-sunburst-key");
    key.replaceChildren();
    fitCurrentSunburst = () => {};
    get("wp-sunburst-label-note").textContent = "";
    branchControls.length = 0;
    const groups = chartGroups().filter((g) => g.mass > 0),
      total = groups.reduce((n, g) => n + g.mass, 0);
    if (!total) {
      target.append(
        make(
          "p",
          "No eligible values in this scope. Check the thresholds and corpus inclusion rules.",
        ),
      );
      return;
    }
    const svg = svgTag("svg", {
      viewBox: "0 0 760 760",
      class: "word-sunburst",
      role: "group",
      "aria-label":
        view().label +
        " sunburst. " +
        view().explanation +
        " Exact values follow in the table.",
    });
    const groupLabels = [],
      leafLabels = [],
      outsideBranches = [];
    key.append(make("h4", "Sunburst chart key"));
    const keyRows = make("div");
    keyRows.className = "sunburst-key-rows";
    key.append(keyRows);

    let start = -Math.PI / 2;
    groups.forEach((g, index) => {
      const end = start + (2 * Math.PI * g.mass) / total,
        mid = (start + end) / 2;
      const selectGroup = () => {
        if (year === "all" && !(lens === "topics" && order === "topics")) {
          showOverviewYear(g);
          return;
        }
        if (lens === "topics" && order === "topics") {
          topicFocus = String(g.topicIndex);
          get("wp-topic-focus").value = topicFocus;
          render();
          get("wp-word-summary").tabIndex = -1;
          get("wp-word-summary").focus();
          const rows = g.rows;
          inspect(g, {
            word: "All contributing years",
            count: g.mass,
            ids: data.posts
              .filter((p) => rows.some((r) => r.ids.includes(p.id)))
              .sort((a, b) => b.weights[g.topicIndex] - a.weights[g.topicIndex])
              .map((p) => p.id),
          });
        } else chooseYear(g.label);
      };
      const groupAction = action(
        svg,
        g.label +
          ": " +
          g.posts +
          " analyzed posts; " +
          (lens === "topics" && order === "topics"
            ? "show topic sources"
            : year === "all"
              ? "select year in the overview"
              : "expand year"),
        svgTag("path", {
          d: sector(start, end, rings.center, rings.group),
          fill: PathwaysAnalysis.sunburstColor(
            lens === "topics" && order === "topics" ? "topic" : "year",
            g.topicIndex ?? g.label,
          ),
        }),
        selectGroup,
      );
      groupAction.dataset.sunYear = g.label;
      if (year === "all" && !(lens === "topics" && order === "topics")) {
        groupAction.addEventListener("pointerenter", () => showOverviewYear(g));
        groupAction.addEventListener("focus", () => showOverviewYear(g));
      }
      const keyGroup = make("section");
      const heading = make("h5");
      const scope = focus(g);
      const coverage =
        scope.coverage === null
          ? "positive score total; not corpus coverage"
          : `${percent(scope.coverage)} of full parent count displayed`;
      heading.append(
        keyButton(
          `${g.label} · n=${g.posts} · ${number(scope.denominator)} ${view().unit} · ${coverage}`,
          groupAction,
          selectGroup,
        ),
      );
      const terms = make("ul");
      const branchList = make("details");
      branchList.open = true;
      branchList.append(make("summary", "Full branch names and counts"), terms);
      keyGroup.append(heading, branchList);
      keyRows.append(keyGroup);
      groupLabels.push({
        label:
          year === "all" && /^(\d{4})–(\d{4})$/.test(g.label)
            ? g.label.slice(0, 5) + g.label.slice(-2)
            : g.label,
        angle: mid,
        span: end - start,
        inner: rings.center,
        outer: rings.group,
      });
      let next = start;
      const rows = scope.rows;
      const shown = rows.reduce((n, r) => n + r.value, 0);
      for (const row of rows) {
        const stop = next + ((end - start) * row.value) / shown;
        if (stop <= next) continue;
        const selectLeaf = () => inspect(g, row);
        const leafAction = action(
          svg,
          `${g.label}, ${row.word}: ${number(row.count)} ${view().unit}; inspect sources`,
          svgTag("path", {
            d: sector(next, stop, rings.leafStart, rings.leafEnd),
            fill:
              row.key === "__other__"
                ? "#d1d4d5"
                : PathwaysAnalysis.sunburstColor(
                    lens === "topics" ? "topic" : "year",
                    lens === "topics"
                      ? order === "topics"
                        ? g.topicIndex
                        : row.key
                      : g.label,
                  ),
          }),
          selectLeaf,
        );
        leafAction.dataset.sunYear = g.label;
        const item = make("li");
        const keyControl = keyButton(
          `${row.word} · ${number(row.count)} ${view().unit} · ${row.ids.length} posts`,
          leafAction,
          selectLeaf,
        );
        bindBranch(keyControl, g, row);
        bindBranch(leafAction, g, row);
        item.append(keyControl);
        terms.append(item);
        outsideBranches.push({
          group: g,
          row,
          angle: (next + stop) / 2,
          action: leafAction,
        });
        leafLabels.push({
          label: row.word,
          angle: (next + stop) / 2,
          span: stop - next,
          inner: rings.leafStart,
          outer: rings.leafEnd,
        });
        next = stop;
      }
      start = end;
    });
    const labelLayer = svgTag("g", { "pointer-events": "none", "aria-hidden": "true" });
    svg.append(labelLayer);
    target.append(svg);
    const unit = lens === "topics" && order === "topics" ? "topic" : "year";
    const center = groups.length + " " + unit + (groups.length === 1 ? "" : "s");
    // A focused year has few enough branches for full outside labels. At narrow
    // widths the unabridged HTML key takes over, rather than shrinking phrases.
    const outsideLayer = svgTag("g", { class: "sunburst-outside" });
    svg.append(outsideLayer);
    fitCurrentSunburst = () => {
      const wide = year !== "all" && order === "years" && target.clientWidth >= 680;
      svg.classList.toggle("sunburst-has-outside", wide);
      svg.setAttribute("viewBox", wide ? "-220 0 1200 760" : "0 0 760 760");
      for (let i = branchControls.length - 1; i >= 0; i--) {
        if (outsideLayer.contains(branchControls[i].control))
          branchControls.splice(i, 1);
      }
      outsideLayer.replaceChildren();
      fitSunburstLabels(
        svg,
        labelLayer,
        wide ? groupLabels : [...groupLabels, ...leafLabels],
        center,
      );
      if (wide) drawOutsideLabels(outsideLayer, outsideBranches, target.clientWidth);
      get("wp-sunburst-label-note").textContent = wide
        ? "Complete branch labels appear outside the circle with connecting lines. The full-label list below is also selectable."
        : "Full words and phrases appear in the expanded list below. Hover or focus a slice or list entry to highlight its matching branch; select it to pin evidence. Select a year for a larger chart.";
    };
    fitCurrentSunburst();
    renderOverviewDirectory(groups);
    renderSunburstExplanation();
    renderComparison();
    if (pinnedRecord) pinEvidence(pinnedRecord.group, pinnedRecord.row);
  }
  // Sort each side vertically before assigning label rows. Leader lines attach
  // to the actual slice midpoint; no label is shortened to fit its sector.
  function drawOutsideLabels(layer, branches, width) {
    const fontSize = Math.max(18, (16 * 1200) / width);
    for (const side of [-1, 1]) {
      const rows = branches
        .filter((b) => (Math.cos(b.angle) < 0 ? -1 : 1) === side)
        .sort((a, b) => Math.sin(a.angle) - Math.sin(b.angle));
      rows.forEach((branch, index) => {
        const y = 70 + ((index + 0.5) * 620) / rows.length;
        const x = side < 0 ? -210 : 770;
        const line = svgTag("path", {
          d: `M${380 + 350 * Math.cos(branch.angle)},${380 + 350 * Math.sin(branch.angle)} L${side < 0 ? 15 : 745},${y} L${side < 0 ? -10 : 765},${y}`,
          fill: "none",
          stroke: "currentColor",
          "stroke-width": 1.5,
          "pointer-events": "none",
        });
        layer.append(line);
        const control = svgTag("a", { href: "#wp-word-detail", role: "button" });
        const text = svgTag("text", {
          x,
          y,
          fill: "currentColor",
          "font-size": fontSize,
        });
        text.style.fontSize = fontSize + "px";
        text.style.fontFamily = "system-ui, sans-serif";
        control.append(text);
        layer.append(control);
        // Measure actual glyphs and wrap at spaces; the full HTML key also
        // retains every word, including unusually long unsplit forms.
        let span = svgTag("tspan", { x, dy: 0 });
        text.append(span);
        for (const word of branch.row.word.split(/\s+/)) {
          const previous = span.textContent;
          span.textContent = previous ? previous + " " + word : word;
          if (span.getComputedTextLength() > 200 && previous) {
            span.textContent = previous;
            span = svgTag("tspan", { x, dy: fontSize * 1.2 });
            text.append(span);
            span.textContent = word;
          }
        }
        const box = text.getBBox();
        text.setAttribute(
          "transform",
          `translate(0,${-box.height / 2 + fontSize / 2})`,
        );
        bindBranch(control, branch.group, branch.row);
        control.addEventListener("click", (event) => {
          event.preventDefault();
          inspect(branch.group, branch.row);
        });
        control.addEventListener("keydown", (event) => {
          if (event.key === " ") {
            event.preventDefault();
            inspect(branch.group, branch.row);
          }
        });
      });
    }
  }
  // The overview selects a year without changing the chart population. Only
  // the explicit Expand button changes the year filter; Show all years returns.
  function renderOverviewDirectory(groups) {
    const overview = get("wp-sun-overview");
    overview.hidden = year !== "all" || (lens === "topics" && order === "topics");
    if (overview.hidden) return;
    const directory = get("wp-sun-year-directory");
    directory.replaceChildren();
    for (const group of groups) {
      const button = make(
        "button",
        group.label + (group.label === "2026–2027" ? " · partial" : ""),
      );
      button.type = "button";
      button.dataset.overviewYear = group.label;
      button.addEventListener("click", () => showOverviewYear(group));
      directory.append(button);
    }
    showOverviewYear(groups.find((group) => group.label === overviewYear) || groups[0]);
  }
  function showOverviewYear(group) {
    if (!group) return;
    overviewYear = group.label;
    for (const branch of sunTarget.querySelectorAll(".sunburst-highlight"))
      branch.classList.remove("sunburst-highlight");
    get("wp-sun-preview").textContent =
      "Selected year · " +
      group.label +
      ". Complete branch names and counts appear in Explore a year; select a branch to pin its sources.";
    get("wp-sunburst-label-note").textContent =
      "Overview · " +
      group.label +
      " highlighted. Only complete word labels are drawn; labels that do not fit are omitted from slices. Read every full name in Explore a year below/beside the chart, or use Expand. Other years remain in the chart.";
    for (const button of get("wp-sun-year-directory").querySelectorAll("button"))
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.overviewYear === group.label),
      );
    for (const branch of sunTarget.querySelectorAll("a[data-sun-year]")) {
      const selected = branch.dataset.sunYear === group.label;
      branch.classList.toggle("sun-year-muted", !selected);
      branch.classList.toggle("sun-year-active", selected);
    }
    const panel = get("wp-sun-year-panel");
    for (let i = branchControls.length - 1; i >= 0; i--)
      if (panel.contains(branchControls[i].control)) branchControls.splice(i, 1);
    panel.replaceChildren(
      make("h4", group.label + (group.label === "2026–2027" ? " · partial year" : "")),
    );
    const scope = focus(group);
    panel.append(
      make(
        "p",
        `${group.posts} analyzed posts · ${number(scope.denominator)} ${view().unit}. ` +
          (scope.coverage === null
            ? "Scores are not writing prevalence."
            : `${percent(scope.coverage)} of full parent count displayed.`),
      ),
    );
    const expand = make("button", "Expand " + group.label + " →");
    expand.type = "button";
    expand.addEventListener("click", () => chooseYear(group.label));
    panel.append(expand);
    const list = make("ul");
    for (const row of scope.rows) {
      const item = make("li"),
        button = sourceButton(group, row);
      button.textContent = `${row.word} · ${number(row.count)} ${view().unit}`;
      bindBranch(button, group, row);
      item.append(button);
      list.append(item);
    }
    panel.append(list);
  }
  function renderSunburstExplanation() {
    const scope =
      year === "all"
        ? evidence.all
        : evidence.years.find((group) => group.label === year);
    const published = data.posts.filter(
      (post) => year === "all" || post.year === year,
    ).length;
    const rings =
      lens === "topics" && order === "topics"
        ? "Inner ring: saved topics. Outer ring: academic years."
        : `Inner ring: academic years. Outer ring: ${lens === "topics" ? "saved topics" : "words or phrases"}.`;
    get("wp-sun-measure").textContent =
      `${year === "all" ? "Overview: select a year without filtering; use Expand for a larger chart. " : ""}${rings} ${view().explanation} Scope: ${scope.posts} analyzed posts out of ${published} published records; ${scope.tokens.toLocaleString()} retained tokens. 2026–2027 is partial. Snapshot: ${data.snapshot}. ` +
      (lens === "topics"
        ? "Topic colors remain fixed across filters and hierarchy order. Weights are not confidence or verified subject assignments."
        : "Year colors remain fixed across filters; colors repeat, so year labels identify the groups.");
    const focused = leading && ["shared", "raw", "phrases"].includes(lens);
    const selected =
      year === "all" ? null : view().groups.find((group) => group.label === year);
    get("wp-sun-focus-status").textContent =
      lens === "distinct"
        ? "Research score view · five positive scores partition each year; these are not percentages of writing. Use ranked bars for a direct score comparison."
        : focused
          ? "TOP-FIVE FOCUS · RESCALED. Other is omitted from the chart, retained in the evidence table/CSV. " +
            (selected
              ? `The five cover ${percent(focus(selected).coverage)} of this year’s full count.`
              : "Each year’s full-count coverage is shown in its key heading.")
          : "COMPLETE DISTRIBUTION · all saved branches, including Other where applicable. Parent and child units agree.";
  }
  function renderComparison() {
    if (lens === "distinct" && lastComparisonLens !== lens)
      get("wp-sun-compare").open = true;
    lastComparisonLens = lens;
    const first = get("wp-sun-compare-a").value,
      second = get("wp-sun-compare-b").value;
    get("wp-sun-compare-unit").textContent =
      view().heatUnit +
      ". Values use the complete saved yearly denominator, not the rescaled top-five areas. " +
      (lens === "distinct"
        ? "Scores have no significance test; unavailable means the eligibility rules were not met."
        : "Repetition/length and sample coverage differ by lens; inspect the source posts.");
    const groups = view().groups.filter((group) =>
      [first, second].includes(group.label),
    );
    const keys = new Set(
      groups.flatMap((group) =>
        group.rows.filter((row) => row.key !== "__other__").map((row) => row.key),
      ),
    );
    let rows = view().matrix.filter((row) => keys.has(row.key));
    if (lens === "topics" && topicFocus !== "all")
      rows = rows.filter((row) => row.key === topicFocus);
    const cells = (row) =>
      [first, second].map((value) => row.cells.find((cell) => cell.year === value));
    rows = rows.sort(
      (a, b) =>
        Math.max(...cells(b).map((cell) => cell.value ?? -Infinity)) -
          Math.max(...cells(a).map((cell) => cell.value ?? -Infinity)) ||
        a.label.localeCompare(b.label),
    );
    const max = Math.max(
      1e-12,
      ...rows.flatMap((row) => cells(row).map((cell) => cell.value ?? 0)),
    );
    const { table, body } = makeTable(
      [
        "Word, phrase or topic",
        ...[first, second].map(
          (value) =>
            `${value}${value === "2026–2027" ? " · partial" : ""} · n=${view().groups.find((group) => group.label === value).posts}`,
        ),
      ],
      view().label + " · ranked comparison using " + view().heatUnit,
    );
    for (const row of rows) {
      const tr = make("tr"),
        th = make("th", row.label);
      th.scope = "row";
      tr.append(th);
      for (const cell of cells(row)) {
        const td = make("td");
        if (cell.value === null) td.textContent = "— · unavailable / ineligible";
        else {
          const group = view().groups.find((item) => item.label === cell.year);
          const control = make("button", number(cell.value) + " · inspect posts");
          control.type = "button";
          control.addEventListener("click", () =>
            inspect(group, {
              key: row.key,
              word: row.label,
              count: cell.count,
              ids: cell.ids,
            }),
          );
          const bar = make("span");
          bar.className = "sun-comparison-bar";
          bar.style.width = (100 * cell.value) / max + "%";
          bar.setAttribute("aria-hidden", "true");
          td.append(control, bar);
        }
        tr.append(td);
      }
      body.append(tr);
    }
    get("wp-sun-compare-bars").replaceChildren(table);
  }
  function makeTable(headers, caption) {
    const table = make("table");
    table.className = "data-table";
    table.append(make("caption", caption));
    const head = make("thead"),
      line = make("tr");
    for (const name of headers) {
      const th = make("th", name);
      th.scope = "col";
      line.append(th);
    }
    head.append(line);
    table.append(head);
    const body = make("tbody");
    table.append(body);
    return { table, body };
  }
  function countTable() {
    const groups = view().groups.filter((g) => year === "all" || g.label === year);
    const { table, body } = makeTable(
      [
        "Academic year / scope",
        "Word, phrase or topic / sources",
        view().unit,
        view().heatUnit,
      ],
      view().label +
        " · complete displayed branches; Other completes applicable totals",
    );
    for (const g of groups)
      for (const row of g.rows) {
        const tr = make("tr"),
          th = make("th", g.label);
        th.scope = "row";
        const td = make("td");
        td.append(sourceButton(g, row));
        tr.append(
          th,
          td,
          make("td", number(row.count)),
          make("td", row.heat === null ? "—" : row.heat.toFixed(2)),
        );
        body.append(tr);
      }
    get("wp-word-table").replaceChildren(table);
  }
  function heatmap() {
    const target = get("wp-word-heat");
    target.replaceChildren();
    const matrix = view().matrix,
      years = view().groups.map((g) => g.label);
    const { table, body } = makeTable(
      ["Word, phrase or topic", ...years],
      view().label +
        " · " +
        view().heatUnit +
        ". Common row set across all years; 2026–2027 partial. Dash = unavailable. Numeric values remain readable without colour.",
    );
    const finite = matrix
        .flatMap((r) => r.cells.map((c) => c.value))
        .filter((v) => v !== null),
      max = Math.max(1e-9, ...finite);
    for (const row of matrix) {
      const tr = make("tr"),
        th = make("th", row.label);
      th.scope = "row";
      tr.append(th);
      for (const cell of row.cells) {
        const td = make("td");
        if (cell.value === null) {
          td.textContent = "—";
          td.title = "No eligible value under this lens; not an observed zero";
        } else {
          const b = make("button", cell.value.toFixed(2));
          b.type = "button";
          b.style.backgroundColor = `hsl(207 45% ${97 - (28 * Math.max(0, cell.value)) / max}%)`;
          b.setAttribute(
            "aria-label",
            `${cell.year}, ${row.label}: ${cell.value.toFixed(3)} ${view().heatUnit}; inspect sources`,
          );
          b.addEventListener("click", () =>
            inspect(
              { label: cell.year },
              { word: row.label, count: cell.count, ids: cell.ids },
            ),
          );
          td.append(b);
        }
        tr.append(td);
      }
      body.append(tr);
    }
    target.append(table);
  }
  // Capture only the chart, in its current layout, at twice its CSS size.
  function chartCanvas(chart) {
    const bounds = chart.getBoundingClientRect();
    if (!bounds.width || !bounds.height) throw new Error("Chart has no visible bounds");
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(bounds.width * 2);
    canvas.height = Math.ceil(bounds.height * 2);
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    // Resolve the active theme background before drawing the chart.
    let background = "white";
    for (let element = chart; element; element = element.parentElement) {
      const color = getComputedStyle(element).backgroundColor;
      if (color !== "transparent" && color !== "rgba(0, 0, 0, 0)") {
        background = color;
        break;
      }
    }
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    return { canvas, context, bounds };
  }

  function paintCloud(chart, context, bounds) {
    for (const button of chart.querySelectorAll("button")) {
      const style = getComputedStyle(button);
      context.font = [
        style.fontStyle,
        style.fontWeight,
        style.fontSize,
        style.fontFamily,
      ].join(" ");
      context.fillStyle = style.color;
      context.textBaseline = "alphabetic";
      const metrics = context.measureText("Mg");
      // Read the browser’s line breaks, including words wrapped on narrow screens.
      const text = button.firstChild;
      const range = document.createRange();
      const lines = new Map();
      let offset = 0;
      for (const character of text.data) {
        range.setStart(text, offset);
        offset += character.length;
        range.setEnd(text, offset);
        const box = range.getBoundingClientRect();
        const line = lines.get(box.top) || { box, text: "" };
        line.text += character;
        lines.set(box.top, line);
      }
      for (const { box, text: line } of lines.values()) {
        const ascent = metrics.fontBoundingBoxAscent;
        const descent = metrics.fontBoundingBoxDescent;
        const baseline = Number.isFinite(ascent + descent)
          ? (box.height + ascent - descent) / 2
          : box.height * 0.8;
        context.fillText(line, box.left - bounds.left, box.top - bounds.top + baseline);
      }
    }
  }

  async function paintSunburst(chart, context, bounds) {
    const copy = chart.cloneNode(true);
    copy.setAttribute("width", bounds.width);
    copy.setAttribute("height", bounds.height);
    // The copied SVG has no page stylesheet. Preserve computed presentation.
    // Selection dims whole branch links, so copy their opacity as well as
    // individual glyph/path styles into the standalone PNG snapshot.
    const links = [...chart.querySelectorAll("a")];
    copy.querySelectorAll("a").forEach((link, index) => {
      link.style.opacity = getComputedStyle(links[index]).opacity;
    });
    const rendered = [...chart.querySelectorAll("path, text")];
    copy.querySelectorAll("path, text").forEach((element, index) => {
      const style = getComputedStyle(rendered[index]);
      for (const property of [
        "fill",
        "stroke",
        "stroke-width",
        "font-family",
        "font-size",
        "font-weight",
        "font-style",
        "letter-spacing",
      ]) {
        element.style.setProperty(property, style.getPropertyValue(property));
      }
    });
    const svg = new XMLSerializer().serializeToString(copy);
    const url = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    );
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      context.drawImage(image, 0, 0, bounds.width, bounds.height);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  // PNGs carry the chart's interpretive context and full names, not just the
  // SVG. Canvas text wraps before allocation so long labels are never clipped.
  // CSV separately retains complete values, including Other in focused mode.
  function captionedSunburst(base, bounds) {
    const width = Math.max(680, bounds.width),
      padding = 24,
      lineHeight = 21;
    const scratch = document.createElement("canvas").getContext("2d");
    scratch.font = "14px system-ui";
    function wrap(text, maxWidth) {
      const lines = [];
      let line = "";
      for (const word of text.split(/\s+/)) {
        const next = line ? line + " " + word : word;
        if (line && scratch.measureText(next).width > maxWidth) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      if (line) lines.push(line);
      return lines;
    }
    const scope =
      year === "all"
        ? evidence.all
        : evidence.years.find((group) => group.label === year);
    const heading = [
      "Tagging The Tower · " + view().label,
      `Scope: ${year === "all" ? "all academic years" : year} · ${scope.posts} analyzed posts · ${scope.tokens} retained tokens`,
      "Measure: " + view().unit + ". " + view().explanation,
      get("wp-sun-focus-status").textContent,
      "Snapshot: " + data.snapshot + ". 2026–2027 is partial.",
    ];
    const headerLines = heading.flatMap((text) => wrap(text, width - 2 * padding));
    const headerHeight = padding * 2 + headerLines.length * lineHeight;
    const chartHeight = (bounds.height * width) / bounds.width;
    const columnWidth = (width - 3 * padding) / 2,
      columnY = [
        headerHeight + chartHeight + padding,
        headerHeight + chartHeight + padding,
      ];
    const blocks = [];
    chartGroups()
      .filter((group) => group.mass > 0)
      .forEach((group, index) => {
        const summary = focus(group),
          column = index % 2;
        const lines = [
          group.label +
            ` · n=${group.posts} · parent=${number(summary.denominator)} ${view().unit}`,
          summary.coverage === null
            ? "Score shares, not writing prevalence"
            : percent(summary.coverage) + " of parent count displayed",
          ...summary.rows.map(
            (row) =>
              row.word + " — " + number(row.count) + "; " + row.ids.length + " posts",
          ),
        ].flatMap((text) => wrap(text, columnWidth));
        blocks.push({
          x: padding + column * (columnWidth + padding),
          y: columnY[column],
          lines,
        });
        columnY[column] += (lines.length + 1) * lineHeight;
      });
    const canvas = document.createElement("canvas");
    const height = Math.ceil(Math.max(...columnY) + padding);
    canvas.width = Math.ceil(width * 2);
    canvas.height = height * 2;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.fillStyle = getComputedStyle(root).backgroundColor;
    context.fillRect(0, 0, width, height);
    context.fillStyle = getComputedStyle(root).color;
    context.font = "14px system-ui";
    context.textBaseline = "top";
    headerLines.forEach((line, index) =>
      context.fillText(line, padding, padding + index * lineHeight),
    );
    context.drawImage(base, 0, headerHeight, width, chartHeight);
    for (const block of blocks)
      block.lines.forEach((line, index) =>
        context.fillText(line, block.x, block.y + index * lineHeight),
      );
    return canvas;
  }

  let exporting = false;
  function updateDownloadButtons() {
    get("wp-word-downloads").hidden = mode === "heat";
    get("wp-word-cloud-png").hidden = mode !== "cloud";
    get("wp-word-sun-png").hidden = mode !== "sun";
    get("wp-word-sun-csv").hidden = mode !== "sun";
    get("wp-word-cloud-png").disabled =
      exporting || !cloudChart.querySelector("button");
    get("wp-word-sun-png").disabled =
      exporting || !get("wp-word-sun").querySelector("svg");
  }

  async function downloadChart(kind) {
    if (exporting) return;
    const cloud = kind === "cloud";
    const chart = cloud ? cloudChart : get("wp-word-sun").querySelector("svg");
    const scope = year === "all" ? "all-years" : year.replace("–", "-");
    const details =
      lens === "topics"
        ? [
            order,
            topicFocus === "all" ? "all-topics" : "topic-" + (Number(topicFocus) + 1),
          ]
        : ["shared", "raw", "phrases"].includes(lens)
          ? [leading ? "leading-five" : "full"]
          : [];
    const name = cloud
      ? ["word-cloud", scope, cloudRanking]
      : ["sunburst", scope, lens, ...details];
    const status = get("wp-word-export-status");
    exporting = true;
    updateDownloadButtons();
    status.textContent = "Preparing PNG…";
    try {
      const base = chartCanvas(chart);
      let canvas = base.canvas;
      if (cloud) paintCloud(chart, base.context, base.bounds);
      else {
        await paintSunburst(chart, base.context, base.bounds);
        canvas = captionedSunburst(base.canvas, base.bounds);
      }
      const png = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("PNG encoding failed"))),
          "image/png",
        );
      });
      const url = URL.createObjectURL(png);
      const link = make("a");
      link.href = url;
      link.download = name.join("-") + ".png";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      status.textContent = "PNG download requested.";
    } catch (error) {
      console.error("Chart PNG export failed", error);
      status.textContent = "PNG export failed. Try downloading the chart again.";
    } finally {
      exporting = false;
      updateDownloadButtons();
    }
  }

  get("wp-word-cloud-png").addEventListener("click", () => downloadChart("cloud"));
  get("wp-word-sun-png").addEventListener("click", () => downloadChart("sun"));

  // Share one year across the cloud and hierarchy views without moving focus
  // when someone selects a timeline bar. Post metadata already exists on the page.
  const cloudPosts = data.posts
    .filter((post) => Object.hasOwn(data.cloudCounts, post.id))
    .map((post) => ({
      ...post,
      paragraphs: post.fullParagraphs,
      license: post.sourceLicense,
      words: data.cloudCounts[post.id],
    }));
  const cloudView = createArchiveWordCloud(
    cloudRoot,
    cloudPosts,
    (cloudYear, ranking) => {
      const nextYear = cloudYear || "all";
      if (year !== nextYear) {
        year = nextYear;
        get("wp-word-year").value = year;
        topicFocus = "all";
        get("wp-topic-focus").value = "all";
      }
      cloudRanking = ranking;
      updateDownloadButtons();
    },
  );
  const exclusiveView = createYearExclusive({
    root,
    data,
    chooseYear,
    showPosts,
    announce,
  });
  function render() {
    const group =
        year === "all" ? evidence.all : evidence.years.find((g) => g.label === year),
      cloud = mode === "cloud";
    get("wp-sun-measure-panel").hidden = mode !== "sun";
    get("wp-sun-compare").hidden = mode !== "sun";
    get("wp-sun-pinned").hidden = mode !== "sun";
    get("wp-sunburst-label-note").hidden = mode !== "sun";
    get("wp-sunburst-key").hidden = mode !== "sun";
    cloudRoot.hidden = !cloud;
    get("wp-word-year-label").hidden = cloud;
    get("wp-word-summary").hidden = cloud;
    get("wp-word-detail").hidden = cloud;
    get("wp-word-branch-counts").hidden = cloud;
    get("wp-word-sun").hidden = mode !== "sun";
    get("wp-word-heat").hidden = mode !== "heat";
    get("wp-word-selection").hidden = cloud;
    get("wp-word-lens-controls").hidden = cloud;
    get("wp-topic-order-label").hidden = lens !== "topics" || mode !== "sun";
    get("wp-topic-focus-label").hidden =
      lens !== "topics" || order !== "topics" || mode !== "sun";
    get("wp-word-research-note").hidden = lens !== "distinct";
    get("wp-word-research-note").textContent =
      "Research settings: ≥3 occurrences in the year, ≥2 containing posts in the year, ≥3 in the corpus; smoothing 0.5; positive scores only. Raising the year minimum to 3 posts retains " +
      (year === "all"
        ? "between 0 and 5 of the original five words across years"
        : data.hierarchies.distinct_sensitivity.find((r) => r.year === year)
            .shared_words + " of the original five words in this year") +
      ". Rankings are sensitive to these choices; see the methods sensitivity table.";
    get("wp-word-leading-label").hidden =
      mode !== "sun" || !["shared", "raw", "phrases"].includes(lens);
    get("wp-word-lens-explanation").textContent =
      view().explanation +
      (mode === "sun" && leading && ["shared", "raw", "phrases"].includes(lens)
        ? " Chart focus: Other is omitted and the leading five are enlarged to fill each year; these are shares of the selected five only. The table retains Other and full denominators."
        : "");
    for (const [name, value] of [
      ["wp-word-cloud-button", "cloud"],
      ["wp-word-sun-button", "sun"],
      ["wp-word-heat-button", "heat"],
    ])
      get(name).setAttribute("aria-pressed", String(mode === value));
    get("wp-word-summary").textContent = cloud
      ? `${group.label}: ${group.posts} analyzed posts · ${group.tokens.toLocaleString()} retained tokens · ${group.unique.toLocaleString()} cleaned forms.`
      : mode === "heat"
        ? `${view().label}: all 15 years compared regardless of the year selector. ${view().heatUnit}. Selecting a year opens its sunburst; the count table follows that year.`
        : `${view().label}: ${year === "all" ? "all academic years" : year}. ${group.posts} analyzed posts in scope. ${view().unit}; see the explanation for sector sizes.`;
    if (cloud) cloudView.setYear(year === "all" ? "" : year);
    else if (mode === "sun") sunburst();
    else heatmap();
    updateDownloadButtons();
    const buttons = get("wp-word-year-buttons");
    buttons.replaceChildren();
    if (!cloud)
      for (const g of view().groups) {
        const b = make(
          "button",
          g.label + (g.label === "2026–2027" ? " · partial" : "") + " · n=" + g.posts,
        );
        b.type = "button";
        b.setAttribute("aria-pressed", String(year === g.label));
        b.addEventListener("click", () => chooseYear(g.label));
        buttons.append(b);
      }
    if (!cloud) countTable();
    exclusiveView.render(year, mode === "sun");
  }
  const completeYears = evidence.years.filter((group) => group.label !== "2026–2027");
  for (const [id, offset] of [
    ["wp-sun-compare-a", 2],
    ["wp-sun-compare-b", 1],
  ]) {
    const control = get(id);
    for (const group of evidence.years) {
      const option = make(
        "option",
        group.label + (group.label === "2026–2027" ? " · partial" : ""),
      );
      option.value = group.label;
      control.append(option);
    }
    control.value = completeYears[Math.max(0, completeYears.length - offset)].label;
    control.addEventListener("change", renderComparison);
  }
  get("wp-word-sun-csv").addEventListener("click", () => {
    const rows = [
      [
        "lens",
        "parent",
        "branch",
        "count",
        "unit",
        "full_parent_denominator",
        "displayed_branch_denominator",
        "shown_in_chart",
        "contributing_posts",
        "post_ids",
        "snapshot",
      ],
    ];
    for (const group of chartGroups()) {
      const scope = focus(group);
      for (const row of group.rows)
        rows.push([
          lens,
          group.label,
          row.word,
          row.count,
          view().unit,
          scope.denominator,
          scope.shown,
          scope.rows.includes(row),
          row.ids.length,
          row.ids.join(";"),
          data.snapshot,
        ]);
    }
    const csv = rows
      .map((row) =>
        row.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = make("a");
    link.href = url;
    link.download = `sunburst-${lens}-${year}-evidence.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
  const select = get("wp-word-year");
  for (const [value, label] of [
    ["all", "Entire analyzed corpus · all years"],
    ...evidence.years.map((g) => [
      g.label,
      g.label +
        (g.label === "2026–2027" ? " · partial" : "") +
        " · " +
        g.posts +
        " analyzed posts",
    ]),
  ]) {
    const o = make("option", label);
    o.value = value;
    select.append(o);
  }
  select.addEventListener("change", () => chooseYear(select.value));
  for (const [name, value] of [
    ["wp-word-cloud-button", "cloud"],
    ["wp-word-sun-button", "sun"],
    ["wp-word-heat-button", "heat"],
  ])
    get(name).addEventListener("click", () => {
      mode = value;
      resetDetail();
      render();
      announce(
        value === "cloud"
          ? "Word cloud displayed"
          : value === "sun"
            ? "Sunburst displayed"
            : "Year comparison heatmap displayed",
      );
    });
  get("wp-word-lens").addEventListener("change", (e) => {
    lens = e.target.value;
    resetDetail();
    render();
    announce(view().label + " selected");
  });
  for (const [value, label] of [
    ["all", "All saved topics"],
    ...data.topics.map((t, i) => [String(i), t.label]),
  ]) {
    const o = make("option", label);
    o.value = value;
    get("wp-topic-focus").append(o);
  }
  get("wp-topic-focus").addEventListener("change", (e) => {
    topicFocus = e.target.value;
    resetDetail();
    render();
    announce("Topic branch expanded");
  });
  get("wp-topic-order").addEventListener("change", (e) => {
    order = e.target.value;
    topicFocus = "all";
    get("wp-topic-focus").value = "all";
    resetDetail();
    render();
    announce("Topic hierarchy changed; numerical contributions are unchanged");
  });
  get("wp-word-leading").addEventListener("change", (e) => {
    leading = e.target.checked;
    render();
    announce(
      leading
        ? "Leading-five focus; Other retained in table"
        : "Full distribution including Other",
    );
  });
  get("wp-word-all-years").addEventListener("click", () => chooseYear("all"));
  get("wp-word-source-jump").addEventListener("click", () => {
    const heading = root.querySelector("#wp-analysis-posts h2");
    heading.tabIndex = -1;
    heading.focus();
  });
  return { render };
}
