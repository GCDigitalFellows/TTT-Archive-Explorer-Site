/* Appearance calculations, independent of the analysis and the page.
 *
 * A preset is a researched interpretation of a period, not a data filter.
 * Only these appearance settings can be changed by the design controls.
 * Pure functions make palette checks possible without a browser or NLP tools.
 */
"use strict";

const TYPE_STYLES = {
  "sans-light": {
    family: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    weight: 350,
    tracking: "-0.045em",
    scale: "4.4rem",
  },
  sans: {
    family: 'Inter, "Segoe UI", Arial, sans-serif',
    weight: 650,
    tracking: "-0.045em",
    scale: "4.2rem",
  },
  editorial: {
    family: 'Georgia, "Times New Roman", serif',
    weight: 500,
    tracking: "-0.055em",
    scale: "4.6rem",
  },
  rounded: {
    family: 'ui-rounded, "Arial Rounded MT Bold", "Segoe UI", sans-serif',
    weight: 700,
    tracking: "-0.045em",
    scale: "4.1rem",
  },
  display: {
    family: '"Arial Black", Impact, "Segoe UI", sans-serif',
    weight: 850,
    tracking: "-0.065em",
    scale: "4.4rem",
  },
  monospace: {
    family: 'ui-monospace, "SFMono-Regular", Consolas, monospace',
    weight: 550,
    tracking: "-0.05em",
    scale: "3.8rem",
  },
};

const DEPTH_STYLES = ["flat", "quiet", "lifted", "soft", "glass", "hard"];
const LAYOUT_STYLES = ["open", "panels", "bento"];

function hexChannels(color) {
  return [1, 3, 5].map((index) => parseInt(color.slice(index, index + 2), 16));
}

function mixColors(first, second, fraction) {
  // A channel-by-channel visual blend, not a statistical operation on the corpus.
  const left = hexChannels(first),
    right = hexChannels(second);
  return (
    "#" +
    left
      .map((value, index) =>
        Math.round(value + (right[index] - value) * fraction)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function luminance(color) {
  const channels = hexChannels(color).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function protectContrast(color, backgrounds, minimum, scheme) {
  // Historical styling is not a reason to reproduce faint text or invisible
  // controls. Move a role color toward readable ink when a blend needs it.
  const target = scheme === "dark" ? "#ffffff" : "#10151a";
  for (let step = 0; step <= 100; step += 1) {
    const candidate = mixColors(color, target, step / 100);
    if (
      backgrounds.every((background) => contrastRatio(candidate, background) >= minimum)
    )
      return candidate;
  }
  return target;
}

function neutralPalette(scheme) {
  return scheme === "dark"
    ? {
        paper: "#171e24",
        surface: "#232e36",
        ink: "#f3f5f7",
        quiet: "#bcc8d1",
        rule: "#7c8d99",
        series: "#82cbb4",
        curated: "#e2b17c",
        accent: "#9cbae0",
      }
    : {
        paper: "#f6f5f1",
        surface: "#ffffff",
        ink: "#202924",
        quiet: "#52605a",
        rule: "#6d7d73",
        series: "#256343",
        curated: "#90551e",
        accent: "#d4b58f",
      };
}

function normalizeChoices(catalog, input = {}) {
  // Whitelist values before placing them in CSS. Hash/bookmark settings never
  // become arbitrary CSS, JavaScript, URLs, or analytical parameters.
  const years = catalog.presets.map((preset) => preset.year);
  const year = years.includes(Number(input.year))
    ? Number(input.year)
    : catalog.defaultYear;
  const choose = (value, allowed) => (allowed.includes(value) ? value : "preset");
  const numericStrength = Number(input.strength ?? 100);
  return {
    year,
    strength: Number.isFinite(numericStrength)
      ? Math.max(0, Math.min(100, numericStrength))
      : 100,
    typography: choose(input.typography, ["preset", ...Object.keys(TYPE_STYLES)]),
    depth: choose(input.depth, ["preset", ...DEPTH_STYLES]),
    layout: choose(input.layout, ["preset", ...LAYOUT_STYLES]),
    density: choose(input.density, ["preset", "comfortable", "compact"]),
    appearance: choose(input.appearance, ["preset", "light", "dark"]),
  };
}

function appearanceFor(catalog, input) {
  const choices = normalizeChoices(catalog, input);
  const preset = catalog.presets.find((item) => item.year === choices.year);
  const amount = choices.strength / 100;
  const scheme = choices.appearance === "preset" ? preset.scheme : choices.appearance;
  const neutral = neutralPalette(scheme);
  let target = { ...preset.palette };
  if (scheme !== preset.scheme) {
    target = {
      ...neutral,
      series:
        scheme === "dark"
          ? mixColors(preset.palette.series, "#ffffff", 0.58)
          : mixColors(preset.palette.series, "#10151a", 0.5),
      curated:
        scheme === "dark"
          ? mixColors(preset.palette.curated, "#ffffff", 0.55)
          : mixColors(preset.palette.curated, "#10151a", 0.45),
      accent: preset.palette.accent,
    };
  }
  const palette = {};
  for (const key of Object.keys(neutral))
    palette[key] = mixColors(neutral[key], target[key], amount);
  const backgrounds = [palette.paper, palette.surface];
  palette.series = protectContrast(palette.series, backgrounds, 4.5, scheme);
  palette.curated = protectContrast(palette.curated, backgrounds, 3, scheme);
  palette.ink = protectContrast(
    palette.ink,
    [...backgrounds, mixColors(palette.surface, palette.series, 0.28)],
    4.5,
    scheme,
  );
  palette.quiet = protectContrast(palette.quiet, backgrounds, 4.5, scheme);
  palette.rule = protectContrast(palette.rule, backgrounds, 3, scheme);
  const type =
    amount === 0
      ? "sans"
      : choices.typography === "preset"
        ? preset.typography
        : choices.typography;
  const depth =
    amount === 0 ? "flat" : choices.depth === "preset" ? preset.depth : choices.depth;
  const layout =
    amount === 0
      ? "open"
      : choices.layout === "preset"
        ? preset.layout
        : choices.layout;
  const density = choices.density === "preset" ? "comfortable" : choices.density;
  return {
    choices,
    preset,
    palette,
    scheme,
    type,
    typeStyle: TYPE_STYLES[type],
    depth,
    layout,
    density,
    radius: Math.round(6 + (preset.radius - 6) * amount),
    controlRadius: Math.round(6 + (preset.controlRadius - 6) * amount),
    pattern: amount === 0 ? "none" : preset.pattern,
    ornament: amount,
    shadowSize: Math.round(10 * amount),
    borderWidth: depth === "hard" ? 1 + Math.round(2 * amount) : 1,
  };
}

function choicesFromHash(catalog, hash) {
  const parameters = new URLSearchParams(String(hash).replace(/^#/, ""));
  const input = {};
  for (const key of [
    "year",
    "strength",
    "typography",
    "depth",
    "layout",
    "density",
    "appearance",
  ]) {
    const value = parameters.get("design-" + key);
    if (value !== null) input[key] = value;
  }
  return normalizeChoices(catalog, input);
}

function hashForChoices(catalog, choices) {
  const normalized = normalizeChoices(catalog, choices);
  const parameters = new URLSearchParams();
  for (const [key, value] of Object.entries(normalized))
    parameters.set("design-" + key, String(value));
  return "#" + parameters.toString();
}

const TowerStyle = {
  TYPE_STYLES,
  DEPTH_STYLES,
  LAYOUT_STYLES,
  mixColors,
  contrastRatio,
  normalizeChoices,
  appearanceFor,
  choicesFromHash,
  hashForChoices,
};
if (typeof module !== "undefined" && module.exports) module.exports = TowerStyle;
if (typeof window !== "undefined") window.TowerStyle = TowerStyle;
