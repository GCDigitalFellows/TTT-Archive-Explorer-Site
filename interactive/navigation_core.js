/* Readable, testable view links. Only view names and appearance settings travel
 * in a bookmark; author names and research filters are not silently serialized.
 */
"use strict";
const TOWER_VIEWS = ["overview", "reading", "themes", "topics", "language", "checks", "audit", "random", "index", "credits", "history", "methods", "reports"];
function viewFromHash(hash) {
  const text = String(hash).replace(/^#/, "");
  const view = new URLSearchParams(text).get("view");
  if (TOWER_VIEWS.includes(view)) return view;
  if (text.startsWith("reading-")) return "reading";
  if (text.startsWith("history-") || text.startsWith("work-")) return "history";
  if (text.startsWith("credits-") || text.startsWith("credited-person-")) return "credits";
  if (text === "roster-coverage") return "topics";
  return "overview";
}
function hashForView(view, hash) {
  const parameters = new URLSearchParams();
  parameters.set("view", TOWER_VIEWS.includes(view) ? view : "overview");
  for (const [key, value] of new URLSearchParams(String(hash).replace(/^#/, "")))
    if (key.startsWith("design-")) parameters.set(key, value);
  return "#" + parameters.toString();
}
const TowerNavigation = { TOWER_VIEWS, viewFromHash, hashForView };
if (typeof module !== "undefined" && module.exports) module.exports = TowerNavigation;
if (typeof window !== "undefined") window.TowerNavigation = TowerNavigation;
