/* Meet the people: counts of saved credit labels and annual role evidence.
 * The writer summary responds to writing scope/evidence. Team controls select a
 * separate roster population. Current affiliations never populate past years.
 * Original authors retain source-text credit, not automatic project authorship.
 */
"use strict";
function createPathwaysPeople({ root, data, openPost, announce }) {
  const get = (n) => root.querySelector("#" + n),
    saved = data.peopleHistory;
  const fellowFamilies = new Set([
    "digital",
    "social-media",
    "manifold",
    "advising",
    "scholarship-center",
    "videography",
  ]);
  const includeStaff = () => get("wp-cohort-staff").checked;
  const reportView = () => get("wp-cohort-source").value === "reports";
  const byName = new Map([...saved.roster, ...saved.people].map((p) => [p.name, p]));
  const byPost = new Map(data.posts.map((p) => [p.id, p]));
  let scope = "local",
    tier = "named",
    population = "all",
    role = get("wp-cohort-role").value,
    dimension = get("wp-cohort-dimension").value;
  const current = () => saved.scopes[scope + "-" + tier];
  const make = (tag, text, className) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (className) n.className = className;
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
        (includeStaff() || fellowFamilies.has(a.role_family)) &&
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
  // Report names remain verbatim. The confirmed current snapshot is a separate
  // source kind, never an invented annual report or a historical backfill.
  function staffingGroup(year) {
    const report = saved.staffingReports.find((group) => group.year === year);
    if (report) return report;
    const cells = saved.annual.filter(
      (cell) =>
        cell.academic_year === year && cell.basis === "human-confirmed annual roster",
    );
    if (!cells.length) return null;
    return {
      period: year,
      year,
      kind: "confirmed-snapshot",
      sourceUrl: saved.sourceUrl,
      rows: cells.map((cell) => ({
        name: cell.name,
        role: saved.roles[cell.role_family],
        fellow: fellowFamilies.has(cell.role_family),
        digital: cell.role_family === "digital",
        page: "",
        evidence: cell.evidence,
      })),
    };
  }
  function staffingCounts(rows) {
    const names = new Set(rows.map((row) => row.name));
    const digital = new Set(rows.filter((row) => row.digital).map((row) => row.name));
    return {
      total: names.size,
      digital: digital.size,
      other: names.size - digital.size,
    };
  }
  function reportRows(group, staff = includeStaff()) {
    return group.rows.filter((row) => staff || row.fellow);
  }
  function reportPageLink(group, row) {
    if (!group.sourceUrl)
      return "https://gcdigitalfellows.github.io/TTT-Archive-Explorer-Site/annual_reports/staffing.csv";
    const firstPage = row.page.match(/\d+/)?.[0];
    return group.sourceUrl + (firstPage ? "#page=" + firstPage : "");
  }
  function inspectReport(group, rows, origin) {
    const target = get("wp-people-detail");
    target.replaceChildren(make("h4", group.period + " · " + group.kind));
    target.append(
      make(
        "p",
        "Names and roles as transcribed in this source; no new identity matches or appointment dates are inferred. " +
          staffingCounts(rows).total +
          " distinct listed names under the selected inclusion rule.",
      ),
    );
    if (group.kind === "pooled")
      target.append(
        make(
          "p",
          "One roster covering 2012–2014; these names cannot be allocated to separate years from this evidence.",
        ),
      );
    if (group.kind === "snapshot")
      target.append(
        make(
          "p",
          "The 2015 snapshot lists Digital Fellows, not a complete all-program staffing census.",
        ),
      );
    target.append(
      table(
        ["Recorded name", "Recorded role", "Source"],
        "Roster evidence · report page numbers count from the PDF cover",
        rows.map((row) => [
          row.name,
          row.role,
          source(
            row.page
              ? (group.sourceUrl ? "PDF p. " : "Roster transcription · report p. ") +
                  row.page
              : group.kind === "confirmed-snapshot"
                ? "Confirmed directory snapshot"
                : "Saved transcription / source register",
            reportPageLink(group, row),
          ),
        ]),
      ),
    );
    if (group.kind === "confirmed-snapshot")
      target.append(
        make(
          "p",
          "The saved November 2026 snapshot was assigned to 2026–2027 by Ian G. Williams. This is not an annual report.",
        ),
      );
    focusEvidence(
      "Roster evidence · " + group.period,
      "wp-cohort-evidence-slot",
      origin,
    );
  }
  function renderReportCohorts() {
    get("wp-cohort-source-note").textContent =
      "Annual-report rosters are shown without directory backfill. A missing annual roster stays unknown. Fellowship titles are a proxy for student fellowship roles, not verified enrollment, funded lines or full-time equivalents. The confirmed 2026–2027 current roster uses its own source label.";
    get("wp-cohort-summary").textContent = includeStaff()
      ? "Report-listed people, including staff and postdoctoral roles. Each recorded name counts once within a roster."
      : "Report-listed fellowship-role holders; staff-only and explicitly postdoctoral titles excluded. Explicit Fellow-and-Coordinator titles remain included.";
    const rows = saved.years.map((year) => {
      const group = staffingGroup(year);
      const cells = group ? reportRows(group) : [];
      return { year, group, cells, counts: staffingCounts(cells) };
    });
    const max = Math.max(1, ...rows.map((row) => row.counts.total));
    get("wp-cohort-bars").replaceChildren();
    for (const row of rows) {
      const label = row.group
        ? `${row.counts.total} total · ${row.counts.digital} Digital Fellows · ${row.counts.other} other listed people${row.group.kind === "confirmed-snapshot" ? " · confirmed current roster" : ""}`
        : "No annual roster available";
      const bar = button("", (event) =>
        inspectReport(row.group, row.cells, event.currentTarget),
      );
      bar.className = "annual-row";
      bar.disabled = !row.group;
      const track = make("span", undefined, "annual-track");
      track.setAttribute("aria-hidden", "true");
      if (row.group)
        for (const kind of ["digital", "other"]) {
          const segment = make("span", undefined, "annual-fill annual-" + kind);
          segment.style.width = (100 * row.counts[kind]) / max + "%";
          track.append(segment);
        }
      bar.append(make("span", row.year), track, make("span", label, "annual-counts"));
      bar.setAttribute(
        "aria-label",
        row.year +
          ": " +
          label +
          (row.group ? "; inspect named roster and sources" : ""),
      );
      get("wp-cohort-bars").append(bar);
    }
    const nonannual = get("wp-nonannual-rosters");
    nonannual.replaceChildren(
      make("h3", "Pooled and snapshot rosters"),
      make(
        "p",
        "These sources are not assigned to separate annual bars. The 2012–2014 roster covers two years; the 2015 Digital Fellows snapshot is not a complete GCDI census.",
        "small",
      ),
    );
    for (const group of saved.staffingReports.filter((group) => !group.year)) {
      const cells = reportRows(group);
      nonannual.append(
        button(
          group.period +
            ": " +
            staffingCounts(cells).total +
            " listed people · inspect roster",
          (event) => inspectReport(group, cells, event.currentTarget),
        ),
      );
    }
  }
  function renderStaffingComparison() {
    const rows = saved.years.map((year) => {
      const group = staffingGroup(year);
      const reportCells = group ? reportRows(group, false) : [];
      const counts = staffingCounts(reportCells);
      const directoryCells = saved.annual.filter(
        (cell) => cell.academic_year === year && fellowFamilies.has(cell.role_family),
      );
      const directory = PathwaysAnalysis.cohortComposition(
        directoryCells,
        saved.annual,
        year,
      );
      const reportCell = group
        ? button(
            `${counts.total} (${counts.digital} Digital Fellows)${group.kind === "confirmed-snapshot" ? " · confirmed snapshot" : ""}`,
            (event) => inspectReport(group, reportCells, event.currentTarget),
          )
        : "No separate annual roster";
      const directoryCell = button(
        `${directory.total} (${directory.digital} Digital Fellows)`,
        (event) =>
          inspectCells(
            directoryCells,
            "Directory evidence · " + year,
            event.currentTarget,
          ),
      );
      return [year, reportCell, directoryCell];
    });
    get("wp-staffing-comparison").replaceChildren(
      table(
        [
          "Academic year",
          "Annual report / confirmed current roster",
          "Directory-derived fellowship roles",
        ],
        "Source comparison · unfiltered fellowship-role headcounts, staff excluded",
        rows,
      ),
    );
  }
  function renderCohorts() {
    renderStaffingComparison();
    get("wp-directory-controls").hidden = reportView();
    get("wp-nonannual-rosters").hidden = !reportView();
    if (reportView()) {
      renderReportCohorts();
      return;
    }
    get("wp-cohort-source-note").textContent =
      "Directory-derived affiliations, not annual-report staffing totals. Alumni date ranges do not establish exact appointment dates or simultaneous service. The confirmed 2026–2027 roster is marked separately.";
    const annual = selectedAnnual(),
      names = new Set(annual.map((a) => a.name)),
      years = saved.years;
    get("wp-cohort-summary").textContent =
      `${names.size} distinct ${includeStaff() ? "people including staff" : "fellowship-role holders"} in this directory-derived view · ${population === "all" ? "all eligible directory names" : "selected credited writers"} · ${role === "all" ? "GCDI roles kept separate" : saved.roles[role]}. Source snapshot: ${saved.sourceDate}. The 2026–2027 roster uses the role assignments from the November 2026 snapshot and the academic year confirmed by Ian G. Williams.`;
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
      const composition = PathwaysAnalysis.cohortComposition(
        r.cells,
        saved.annual,
        r.year,
      );
      const n = composition.total;
      const b = button("", (event) =>
        inspectCells(r.cells, "Recorded team · " + r.year, event.currentTarget),
      );
      b.className = "annual-row";
      b.disabled = !r.available;
      const track = make("span");
      track.className = "annual-track";
      track.setAttribute("aria-hidden", "true");
      for (const [kind, count] of [
        ["digital", composition.digital],
        ["other", composition.other],
      ]) {
        const fill = make("span");
        fill.className = "annual-fill annual-" + kind;
        fill.style.width = (100 * count) / max + "%";
        track.append(fill);
      }
      const breakdown = `${n} total · ${composition.digital} Digital Fellows · ${composition.other} other recorded members`;
      b.title = r.available ? breakdown : "No annual roster evidence";
      b.append(
        make("span", r.year),
        track,
        make("span", r.available ? breakdown : "— · no dated data", "annual-counts"),
      );
      b.setAttribute(
        "aria-label",
        r.year +
          ": " +
          (r.available
            ? breakdown + "; inspect evidence"
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
    ["wp-cohort-source", "source"],
    ["wp-cohort-staff", "staff"],
  ])
    get(id).addEventListener("change", (e) => {
      if (key === "scope") scope = e.target.value;
      else if (key === "tier") tier = e.target.value;
      else if (key === "population") population = e.target.value;
      else if (key === "role") role = e.target.value;
      else if (key === "dimension") dimension = e.target.value;
      evidencePanel.hidden = true;
      evidenceOrigin = undefined;
      render();
    });
  return { render };
}
