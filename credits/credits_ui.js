/* Optional filtering of a complete, already-rendered credit register.
 * No request leaves the browser. Names and source records remain available
 * without JavaScript; this script only hides nonmatching acknowledgment cards.
 */
"use strict";
(() => {
  const search = document.getElementById("credits-search");
  if (!search) return;
  const context = document.getElementById("credits-context");
  const cards = [...document.querySelectorAll(".credit-person")];
  function filterCredits() {
    const query = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const card of cards) {
      const kinds = card.dataset.creditKinds.split(" ");
      const matches =
        card.dataset.creditSearch.includes(query) &&
        (context.value === "all" || kinds.includes(context.value));
      card.hidden = !matches;
      shown += Number(matches);
    }
    document.getElementById("credits-count").textContent =
      shown + " of " + cards.length + " human-name entries shown.";
    document.getElementById("credits-empty").hidden = shown !== 0;
  }
  search.addEventListener("input", filterCredits);
  context.addEventListener("change", filterCredits);
  document.getElementById("credits-clear").addEventListener("click", () => {
    search.value = "";
    context.value = "all";
    filterCredits();
    search.focus();
  });
})();
