/* Meet the people: counts of saved credit labels and annual role evidence.
 * The writer summary responds to writing scope/evidence. Team controls select a
 * separate roster population. Current affiliations never populate past years.
 * Original authors retain source-text credit, not automatic project authorship.
 */
"use strict";
function createPathwaysPeople({ root, data, openPost, announce }) {
  const get = (n) => root.querySelector("#" + n),
    saved = data.peopleHistory;
  const byName = new Map([...saved.roster, ...saved.people].map((p) => [p.name, p]));
  const byPost = new Map(data.posts.map((p) => [p.id, p]));
  let scope = "local",
    tier = "named",
    population = "all",
    role = get("wp-cohort-role").value,
    dimension = get("wp-cohort-dimension").value;
  const current = () => saved.scopes[scope + "-" + tier];
  const make = (tag, text) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const button = (text, fn) => {
    const b = make("button", text);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  };
  function source(text, url) {
    const a = make("a", text);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  function table(headers, caption, rows) {
    const t = make("table");
    t.className = "data-table";
    t.append(make("caption", caption));
    const head = make("thead"),
      line = make("tr");
    for (const name of headers) {
      const th = make("th", name);
      th.scope = "col";
      line.append(th);
    }
    head.append(line);
    t.append(head);
    const body = make("tbody");
    for (const values of rows) {
      const tr = make("tr");
      values.forEach((v, i) => {
        const td = make(i === 0 ? "th" : "td");
        if (i === 0) td.scope = "row";
        if (v instanceof Node) td.append(v);
        else td.textContent = v;
        tr.append(td);
      });
      body.append(tr);
    }
    t.append(body);
    return t;
  }
  function entryIncluded(e) {
    return (
      (scope === "all" || e.kind === "local/unflagged") &&
      (tier === "checked"
        ? e.authorshipTier === "source-supported"
        : ["source-supported", "declared-credit"].includes(e.authorshipTier))
    );
  }
  const evidencePanel = get("wp-people-evidence");
  const returnButton = get("wp-people-return");
  let evidenceOrigin;
  // Reuse one evidence panel next to whichever tool opened it. The original
  // control stays in place so keyboard users can return to their selection.
  function focusEvidence(text, slot, origin) {
    evidenceOrigin = origin;
    get(slot).append(evidencePanel);
    get("wp-people-selection").textContent = text;
    evidencePanel.hidden = false;
    evidencePanel.querySelector("h3").focus();
    announce(text);
  }
  returnButton.addEventListener("click", () => {
    evidencePanel.hidden = true;
    evidenceOrigin?.focus();
  });
  for (const link of root.querySelectorAll("[data-people-jump]")) {
    link.addEventListener("click", (event) => {
      // Keep the explorer route in the URL so reload still opens this page.
      event.preventDefault();
      const heading = get(link.hash.slice(1));
      heading.focus();
      heading.scrollIntoView({ block: "start" });
    });
  }
  function inspectPerson(name, slot, origin) {
    const p = byName.get(name);
    if (!p) return;
    const target = get("wp-people-detail");
    target.replaceChildren(make("h4", name));
    target.append(
      make(
        "p",
        p.datedDigitalFellow
          ? "Dated GC Digital Fellow history is recorded. This does not establish membership at every article date."
          : p.currentDigitalFellow
            ? "The saved current-team snapshot names a GC Digital Fellow role, confirmed by Ian G. Williams as the 2026–2027 roster. Exact appointment dates and earlier membership are not inferred."
            : "No dated/current GC Digital Fellow match in this saved view; this does not establish nonmembership or guest status.",
      ),
    );
    target.append(make("h5", "Academic-affiliation evidence"));
    if (!p.affiliations.length)
      target.append(
        make(
          "p",
          "No academic-affiliation label available from the saved directory evidence.",
        ),
      );
    const seen = new Set();
    for (const a of p.affiliations) {
      const key = a.claimId;
      if (seen.has(key)) continue;
      seen.add(key);
      const block = make("p");
      block.append(
        make("strong", a.label + " · "),
        make("span", a.basis + ": " + a.passage + " "),
        source("Directory source ↗", a.source),
      );
      target.append(block);
    }
    target.append(make("h5", "Dated role evidence"));
    const cells = saved.annual.filter((a) => a.name === name);
    target.append(
      make(
        "p",
        cells.length
          ? cells
              .map((a) => a.academic_year + " · " + saved.roles[a.role_family])
              .join("; ")
          : "No dated annual role cells in the saved directory.",
      ),
    );
    const entries = p.entries.filter(entryIncluded);
    target.append(
      make("h5", entries.length + " credited records under the writing controls"),
    );
    for (const e of entries) {
      const post = byPost.get(e.postId);
      const block = make("p");
      const read = button(e.title, (event) =>
        openPost(post, undefined, event.currentTarget),
      );
      read.id = "wp-person-post-" + e.postId;
      block.append(
        read,
        make(
          "span",
          " · " +
            e.year +
            " · " +
            e.authorshipTier +
            (e.kind === "local/unflagged" ? "" : " · curated/source-linked"),
        ),
      );
      if (e.evidence) block.append(make("small", " · Credit passage: " + e.evidence));
      target.append(block);
    }
    if (!entries.length)
      target.append(
        make(
          "p",
          "No named/checked published writing credit under these controls. Directory membership alone is not an article byline.",
        ),
      );
    focusEvidence("Source records for " + name, slot, origin);
  }
  // A roster row describes appointment evidence. Intersect with writers
  // only when that population is explicitly selected by the visitor.
  function selectedAnnual() {
    const names = new Set(current().people);
    return saved.annual.filter(
      (a) =>
        (role === "all" || a.role_family === role) &&
        (population === "all" || names.has(a.name)),
    );
  }
  function inspectCells(cells, label, origin) {
    const slot = "wp-cohort-evidence-slot";
    const target = get("wp-people-detail");
    target.replaceChildren(make("h4", label));
    const names = [...new Set(cells.map((a) => a.name))].sort();
    target.append(
      make(
        "p",
        names.length +
          " distinct recorded people; select a name to inspect affiliations, roles and any writing credits.",
      ),
    );
    for (const name of names)
      target.append(button(name, () => inspectPerson(name, slot, origin)));
    const evidence = new Map(cells.flatMap((a) => a.evidence).map((e) => [e.id, e]));
    const detail = make("details");
    detail.append(
      make("summary", "Source statements and confirmations behind this selection"),
    );
    for (const e of evidence.values()) {
      const p = make("p", e.raw + " ");
      p.append(source("Source ↗", e.url));
      detail.append(p);
    }
    target.append(detail);
    focusEvidence(label, slot, origin);
  }
  // Use the unfiltered roster to distinguish a missing role from a zero
  // under the selected writer scope. Historical years use directory counts.
  function hasAnnualEvidence(year, family) {
    return saved.annual.some(
      (row) =>
        row.academic_year === year &&
        (row.basis === "dated directory interval" ||
          family === "all" ||
          row.role_family === family),
    );
  }
  function renderCohorts() {
    const annual = selectedAnnual(),
      names = new Set(annual.map((a) => a.name)),
      years = saved.years;
    get("wp-cohort-summary").textContent =
      `${names.size} distinct people in this recorded annual team view · ${population === "all" ? "all documented team members" : "selected credited writers"} · ${role === "all" ? "GCDI roles kept separate" : saved.roles[role]}. Source snapshot: ${saved.sourceDate}. The 2026–2027 roster uses the role assignments from the November 2026 snapshot and the academic year confirmed by Ian G. Williams.`;
    const rows = years.map((year) => ({
      year,
      cells: annual.filter((a) => a.academic_year === year),
      available: hasAnnualEvidence(year, role),
    }));
    const max = Math.max(
      1,
      ...rows.map((r) => new Set(r.cells.map((a) => a.name)).size),
    );
    get("wp-cohort-bars").replaceChildren();
    for (const r of rows) {
      const n = new Set(r.cells.map((a) => a.name)).size;
      const b = button("", (event) =>
        inspectCells(r.cells, "Recorded team · " + r.year, event.currentTarget),
      );
      b.className = "annual-row";
      b.disabled = !r.available;
      const track = make("span");
      track.className = "annual-track";
      track.setAttribute("aria-hidden", "true");
      const fill = make("span");
      fill.className = "annual-fill";
      fill.style.width = (100 * n) / max + "%";
      track.append(fill);
      b.append(
        make("span", r.year),
        track,
        make("span", r.available ? n + " people" : "— · no dated data"),
      );
      b.setAttribute(
        "aria-label",
        r.year +
          ": " +
          (r.available
            ? n + " recorded people; inspect evidence"
            : "no annual roster evidence"),
      );
      get("wp-cohort-bars").append(b);
    }
    const keys =
      dimension === "roles"
        ? Object.keys(saved.roles).filter((k) => role === "all" || k === role)
        : [...new Set(annual.flatMap((a) => a.fields))].sort();
    const values = keys.map((key) => [
      dimension === "roles" ? saved.roles[key] : key,
      ...rows.map((r) => {
        const cells = r.cells.filter((a) =>
          dimension === "roles" ? a.role_family === key : a.fields.includes(key),
        );
        const n = new Set(cells.map((a) => a.name)).size;
        if (!r.available || (dimension === "roles" && !hasAnnualEvidence(r.year, key)))
          return "—";
        const b = button(String(n), (event) =>
          inspectCells(
            cells,
            (dimension === "roles" ? saved.roles[key] : key) + " · " + r.year,
            event.currentTarget,
          ),
        );
        b.setAttribute(
          "aria-label",
          `${r.year}, ${dimension === "roles" ? saved.roles[key] : key}: ${n} distinct recorded people; inspect sources`,
        );
        b.style.backgroundColor = `hsl(207 45% ${97 - (28 * n) / max}%)`;
        return b;
      }),
    ]);
    get("wp-cohort-matrix").replaceChildren(
      table(
        [
          dimension === "roles" ? "GCDI role family" : "Academic-affiliation label",
          ...years,
        ],
        "Annual composition · distinct people per cell; labels can overlap; dash = no annual roster evidence",
        values,
      ),
    );
  }
  function render() {
    const selected = current(),
      metrics = get("wp-people-metrics");
    // All figures come from the selected saved scope. The Fellow counts are
    // subsets of the writer total. Affiliations have their own coverage count.
    const writers =
      scope === "local"
        ? "named writers of posts classified as local to the blog"
        : "named writers across the published archive, including source authors of curated works";
    const headline = make("p");
    headline.append(
      make("strong", selected.count + " " + writers),
      make(
        "span",
        ". Of those, " +
          selected.documentedDigitalCount +
          " have documented GC Digital Fellow roles. The count is " +
          selected.broaderFellowPeople.length +
          " when other documented GCDI Fellow roles are included.",
      ),
    );
    const affiliations = make(
      "p",
      `Records identify an academic program or discipline for ${selected.affiliationPeople} of the ${selected.count} writers. Those records contain ${selected.affiliationCount} distinct labels, including both program names and broader fields.`,
    );
    const timing = make(
      "p",
      `Of the ${selected.documentedDigitalCount} writers with Digital Fellow roles, ${selected.digitalCount} have dated directory records and ${selected.currentOnlyDigitalPeople.length} are documented only in the confirmed 2026–2027 roster. For ${selected.digitalAtPublication.length} writers, a dated fellowship interval overlaps at least one credited post.`,
    );
    timing.className = "small";
    metrics.replaceChildren(headline, affiliations, timing);
    get("wp-people-summary").textContent =
      `${scope === "local" ? "Local/unflagged records" : "All published records including curated source works"} · ${tier === "named" ? "named credits (checked or declared)" : "source-supported credit evidence only"}. Across the full archive, ${saved.scopes["all-named"].count} named source writers are represented; ${saved.scopes["local-named"].count} have local-post credits and are included in that total. ${saved.accountOnlyNames.length} additional personal-name labels occur only as posting accounts and are excluded. These writers have ${selected.allRoleFamilies.length} documented GCDI role families: ${selected.allRoleFamilies.map((r) => saved.roles[r]).join(", ")}. Identity evidence and affiliations remain incomplete.`;
    const rows = selected.people.map((name) => {
      const p = byName.get(name);
      return [
        button(name, (event) =>
          inspectPerson(name, "wp-writer-evidence-slot", event.currentTarget),
        ),
        p.datedDigitalFellow
          ? "Dated GC Digital Fellow history"
          : p.currentDigitalFellow
            ? "GC Digital Fellow · confirmed 2026–2027"
            : "No dated/current GC Digital Fellow match",
        [...new Set(p.affiliations.map((a) => a.label))].join("; ") ||
          "Unknown in saved directory",
        [...new Set(p.roles.concat(p.currentRoles))]
          .map((r) => saved.roles[r])
          .join("; ") || "No role match",
      ];
    });
    get("wp-people-register").replaceChildren(
      table(
        [
          "Credited person / sources",
          "Fellowship evidence",
          "Academic labels",
          "GCDI role families",
        ],
        "Selected source writers; missing directory matches are not proof of nonmembership",
        rows,
      ),
    );
    renderCohorts();
  }
  for (const [id, key] of [
    ["wp-people-scope", "scope"],
    ["wp-people-tier", "tier"],
    ["wp-cohort-population", "population"],
    ["wp-cohort-role", "role"],
    ["wp-cohort-dimension", "dimension"],
  ])
    get(id).addEventListener("change", (e) => {
      if (key === "scope") scope = e.target.value;
      else if (key === "tier") tier = e.target.value;
      else if (key === "population") population = e.target.value;
      else if (key === "role") role = e.target.value;
      else dimension = e.target.value;
      evidencePanel.hidden = true;
      evidenceOrigin = undefined;
      render();
    });
  return { render };
}
