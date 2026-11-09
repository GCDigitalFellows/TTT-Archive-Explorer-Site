/* Attached vocabulary comparison: distinct FORMS, not tokens/topic units.
 * All qualifying forms are saved. Browser controls only filter this evidence;
 * they do not change the corpus, source credits or the cross-year definition.
 * A companion chart avoids implying a false child relationship to the sunburst.
 */
"use strict";
function createYearExclusive({ root, data, chooseYear, showPosts, announce }) {
  const get = (name) => root.querySelector("#" + name),
    saved = data.yearExclusive;
  let year = "all",
    evidence = "all",
    query = "",
    limit = 50;
  const make = (tag, text) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    return n;
  };
  function inspect(group, row) {
    const label = `${row.word} · exclusive to ${group.year} in the saved analyzed corpus · ${row.occurrences} occurrences in ${row.posts} posts`;
    get("wp-word-detail").textContent = label;
    get("wp-word-selection-text").textContent =
      label + ". This can be a name, code term or artifact; inspect context.";
    get("wp-word-source-jump").hidden = false;
    showPosts(row.ids, label);
    announce(label);
  }
  function rows() {
    return saved.groups
      .filter((g) => year === "all" || g.year === year)
      .flatMap((group) =>
        group.forms
          .filter(
            (r) =>
              (evidence === "all" ||
                (evidence === "multiple" ? r.posts >= 2 : r.posts === 1)) &&
              r.word.toLocaleLowerCase().includes(query),
          )
          .map((row) => ({ group, row })),
      );
  }
  function renderList() {
    const all = rows(),
      selected = all.slice(0, limit);
    get("wp-exclusive-list-scope").textContent =
      `${year === "all" ? "All years" : year}: ${all.length.toLocaleString()} matching year-exclusive forms; showing ${selected.length.toLocaleString()}. Evidence filter and search apply to this list only.`;
    const table = make("table");
    table.className = "data-table";
    table.append(
      make(
        "caption",
        "Year-exclusive cleaned forms · exact occurrences, post counts and original source evidence",
      ),
    );
    const head = make("thead"),
      line = make("tr");
    for (const name of [
      "Academic year",
      "Cleaned form / source posts",
      "Occurrences",
      "Containing posts",
    ]) {
      const th = make("th", name);
      th.scope = "col";
      line.append(th);
    }
    head.append(line);
    table.append(head);
    const body = make("tbody");
    for (const { group, row } of selected) {
      const tr = make("tr"),
        th = make("th", group.year);
      th.scope = "row";
      const cell = make("td"),
        button = make("button", row.word);
      button.type = "button";
      button.setAttribute(
        "aria-label",
        `${row.word}, ${group.year}, ${row.occurrences} occurrences in ${row.posts} posts; inspect sources`,
      );
      button.addEventListener("click", () => inspect(group, row));
      cell.append(button);
      tr.append(th, cell, make("td", row.occurrences), make("td", row.posts));
      body.append(tr);
    }
    table.append(body);
    get("wp-exclusive-table").replaceChildren(table);
    if (!all.length)
      get("wp-exclusive-table").append(
        make(
          "p",
          "No forms match these list controls. Clear the search or choose another evidence option; absence here is not absence of activity.",
        ),
      );
    get("wp-exclusive-more").hidden = limit >= all.length;
  }
  function render(scope, visible) {
    get("wp-exclusive").hidden = !visible;
    get("wp-exclusive-jump").hidden = !visible;
    if (year !== scope) {
      year = scope;
      limit = 50;
    }
    if (!visible) return;
    const multi = saved.groups.reduce((n, g) => n + g.multiplePostTypes, 0),
      single = saved.exclusiveTypes - multi;
    get("wp-exclusive-summary").textContent =
      `${saved.exclusiveTypes.toLocaleString()} of ${saved.wholeVocabulary.toLocaleString()} corpus forms occur in exactly one year: ${single.toLocaleString()} in one post, ${multi.toLocaleString()} in multiple posts. All counts are within the same 299 analyzed posts. Year totals below are observed distinct forms, not equal sample sizes.`;
    const chart = get("wp-exclusive-bars");
    chart.replaceChildren();
    const max = Math.max(1, ...saved.groups.map((g) => g.allTypes));
    for (const group of saved.groups) {
      const button = make("button");
      button.type = "button";
      button.className = "exclusive-row";
      button.setAttribute(
        "aria-label",
        `${group.year}${group.year === "2026–2027" ? ", partial" : ""}: ${group.exclusiveTypes} exclusive forms, ${group.singlePostTypes} single-post and ${group.multiplePostTypes} multi-post, of ${group.allTypes} distinct forms in ${group.analyzedPosts} analyzed posts; inspect this year`,
      );
      button.setAttribute("aria-pressed", String(year === group.year));
      button.append(
        make("span", group.year + (group.year === "2026–2027" ? " · partial" : "")),
      );
      const track = make("span");
      track.className = "exclusive-track";
      track.setAttribute("aria-hidden", "true");
      for (const [value, cls] of [
        [group.singlePostTypes, "exclusive-one"],
        [group.multiplePostTypes, "exclusive-many"],
        [group.sharedAcrossYearsTypes, "exclusive-shared"],
      ]) {
        const bar = make("span");
        bar.className = cls;
        bar.style.width = (100 * value) / max + "%";
        track.append(bar);
      }
      button.append(
        track,
        make(
          "span",
          `${group.exclusiveTypes} exclusive (${group.multiplePostTypes} multi-post) / ${group.allTypes} total forms`,
        ),
      );
      button.addEventListener("click", () => chooseYear(group.year));
      chart.append(button);
    }
    renderList();
  }
  get("wp-exclusive-jump").addEventListener("click", () =>
    get("wp-exclusive-heading").focus(),
  );
  get("wp-exclusive-evidence").addEventListener("change", (e) => {
    evidence = e.target.value;
    limit = 50;
    renderList();
  });
  get("wp-exclusive-search").addEventListener("input", (e) => {
    query = e.target.value.toLocaleLowerCase().trim();
    limit = 50;
    renderList();
  });
  get("wp-exclusive-more").addEventListener("click", () => {
    limit += 50;
    renderList();
  });
  return { render };
}
