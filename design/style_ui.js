/* The appearance controller changes only CSS variables and design labels.
 * It never touches analysis inputs, model choices, chart scales, or post data.
 * See style_math.js for the small, testable calculations behind each preset.
 */
"use strict";

(() => {
  const catalog = JSON.parse(document.getElementById("style-data").textContent);
  const math = window.TowerStyle;
  const root = document.documentElement;
  let choices = math.choicesFromHash(catalog, window.location.hash);
  const byId = (id) => document.getElementById(id);

  function text(tag, value, className = "") {
    const node = document.createElement(tag);
    node.textContent = value;
    node.className = className;
    return node;
  }

  function sourceLink(source) {
    const link = text("a", source.title);
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function renderEvidence(preset) {
    byId("design-name").textContent = preset.name;
    byId("design-name-detail").textContent = preset.name;
    byId("design-year-display").textContent = String(preset.year);
    byId("design-year-output").textContent = String(preset.year);
    byId("design-evidence-label").textContent = preset.evidenceLabel;
    byId("design-description").textContent = preset.description;
    byId("design-caveat").textContent = preset.caveat;
    byId("design-selected-year").textContent = String(preset.year);
    byId("design-selected-description").textContent =
      preset.description + " " + preset.caveat;
    const list = byId("design-source-list");
    list.replaceChildren();
    for (const id of preset.sources) {
      const source = catalog.sources.find((item) => item.id === id);
      const row = document.createElement("li");
      row.append(sourceLink(source));
      row.append(
        text(
          "p",
          source.publisher + " · " + source.date + " · " + source.kind,
          "secondary",
        ),
      );
      row.append(text("p", source.support, "secondary"));
      list.append(row);
    }
  }

  function applyAppearance(remember = false) {
    const appearance = math.appearanceFor(catalog, choices);
    choices = appearance.choices;
    for (const [key, value] of Object.entries(appearance.palette)) {
      root.style.setProperty("--" + key, value);
    }
    root.style.setProperty("--heading-font", appearance.typeStyle.family);
    root.style.setProperty("--heading-weight", String(appearance.typeStyle.weight));
    root.style.setProperty("--heading-tracking", appearance.typeStyle.tracking);
    root.style.setProperty("--heading-scale", appearance.typeStyle.scale);
    root.style.setProperty("--panel-radius", appearance.radius + "px");
    root.style.setProperty("--control-radius", appearance.controlRadius + "px");
    root.style.setProperty("--shadow-size", appearance.shadowSize + "px");
    root.style.setProperty("--panel-border", appearance.borderWidth + "px");
    root.style.setProperty("--ornament", String(appearance.ornament));
    root.style.setProperty("color-scheme", appearance.scheme);
    Object.assign(root.dataset, {
      designYear: String(choices.year),
      depth: appearance.depth,
      layout: appearance.layout,
      pattern: appearance.pattern,
      typography: appearance.type,
      density: appearance.density,
      reader: String(choices.strength === 0),
    });
    byId("design-year").value = String(choices.year);
    byId("design-year-select").value = String(choices.year);
    byId("design-strength").value = String(choices.strength);
    byId("design-strength-output").textContent = choices.strength + "%";
    for (const key of ["typography", "depth", "layout", "density", "appearance"]) {
      byId("design-" + key).value = choices[key];
    }
    byId("design-previous").disabled = choices.year === 2012;
    byId("design-next").disabled = choices.year === 2026;
    byId("design-live-summary").textContent =
      choices.year +
      " · " +
      appearance.preset.name +
      " · " +
      (choices.strength === 0 ? "reader view" : choices.strength + "% styling") +
      ". Applied across every explorer view. Analysis selections are unchanged.";
    renderEvidence(appearance.preset);
    if (remember) {
      // A bookmark carries appearance only. It does not leak a selected writer
      // or imply a different statistical subset. File URLs may restrict history.
      try {
        const bookmark = new URLSearchParams(math.hashForChoices(catalog, choices).slice(1));
        const selectedView = document.querySelector('.view-nav [aria-pressed="true"]');
        if (selectedView) bookmark.set("view", selectedView.dataset.view);
        window.history.replaceState(null, "", "#" + bookmark.toString());
        const linkField = document.getElementById("view-link-address");
        if (linkField) linkField.value = window.location.href;
      } catch (_) {
        /* All controls still work if the host disallows URL updates. */
      }
    }
  }

  function downloadChoices() {
    const preset = catalog.presets.find((item) => item.year === choices.year);
    const record = {
      description: "Appearance settings only; no analysis filters or model changes.",
      choices,
      preset: preset.name,
      evidence: preset.sources.map((id) =>
        catalog.sources.find((source) => source.id === id),
      ),
      researchCutoff: catalog.researchCutoff,
    };
    const address = URL.createObjectURL(
      new Blob([JSON.stringify(record, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = address;
    link.download = "tagging-the-tower-design-" + choices.year + ".json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(address), 1000);
  }

  function initialize() {
    const yearSelect = byId("design-year-select");
    for (const preset of catalog.presets) {
      const option = text("option", preset.year + " · " + preset.name);
      option.value = String(preset.year);
      yearSelect.append(option);
    }
    // Both year controls stay synchronized; no timers or autoplay are used.
    byId("design-year").addEventListener("input", () => {
      choices.year = Number(byId("design-year").value);
      yearSelect.value = String(choices.year);
      applyAppearance(true);
    });
    yearSelect.addEventListener("change", () => {
      choices.year = Number(yearSelect.value);
      applyAppearance(true);
    });
    byId("design-previous").addEventListener("click", () => {
      choices.year = Math.max(2012, choices.year - 1);
      applyAppearance(true);
      yearSelect.value = String(choices.year);
    });
    byId("design-next").addEventListener("click", () => {
      choices.year = Math.min(2026, choices.year + 1);
      applyAppearance(true);
      yearSelect.value = String(choices.year);
    });
    byId("design-strength").addEventListener("input", () => {
      choices.strength = Number(byId("design-strength").value);
      applyAppearance(true);
    });
    for (const key of ["typography", "depth", "layout", "density", "appearance"]) {
      byId("design-" + key).addEventListener("change", () => {
        choices[key] = byId("design-" + key).value;
        applyAppearance(true);
      });
    }
    byId("design-reset").addEventListener("click", () => {
      choices = math.normalizeChoices(catalog, { year: choices.year });
      applyAppearance(true);
    });
    byId("design-reader").addEventListener("click", () => {
      choices.strength = 0;
      applyAppearance(true);
    });
    byId("design-download").addEventListener("click", downloadChoices);
    byId("design-evidence-button").addEventListener("click", () => {
      byId("style-evidence").open = true;
      byId("style-evidence").scrollIntoView({ behavior: "instant", block: "start" });
      byId("style-evidence-summary").focus();
    });
    window.addEventListener("hashchange", () => {
      if (!window.location.hash.includes("design-year=")) return;
      choices = math.choicesFromHash(catalog, window.location.hash);
      yearSelect.value = String(choices.year);
      applyAppearance();
    });
    yearSelect.value = String(choices.year);
    applyAppearance();
  }

  initialize();
})();
