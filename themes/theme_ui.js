/* Interactive thematic reading, using only saved assignments.
 * Start at open(). All strings from posts are inserted with textContent.
 * A heatmap click inspects a cell; global controls define the chart population.
 */
"use strict";
(() => {
  const byId = (id) => document.getElementById(id);
  const math = window.TowerThemeMath;
  let data, ready=false, selectedTheme="", selectedPair=null, inspectYear="all", postLimit=12;
  let currentPosts=[], currentRows=[], matchingPosts=[];
  function node(tag,text="",className="") {
    const element=document.createElement(tag);
    element.textContent=text; element.className=className; return element;
  }
  function button(text,action,label) {
    const result=node("button",text); result.type="button";
    if(label) result.setAttribute("aria-label",label);
    result.addEventListener("click",action); return result;
  }
  function options(id,entries) {
    byId(id).replaceChildren(...entries.map(([value,label]) => {
      const option=node("option",label);option.value=value;return option;
    }));
  }
  function mode() {return byId("theme-mode").value;}
  function choices() {return {year:byId("theme-year").value,author:byId("theme-author").value,explicit:byId("theme-explicit").checked,supportedOnly:byId("theme-supported").checked};}
  // Cell and pair selections narrow only the evidence list, not the global chart filters.
  function chooseEvidence(theme,year="all",pair=null) {
    selectedTheme=theme;selectedPair=pair;inspectYear=year;postLimit=12;
    byId("theme-focus").value=theme;
    renderAuthors();renderPosts();
  }
  function tableHead(labels,caption) {
    const table=node("table");table.append(node("caption",caption));
    const head=node("thead"),row=node("tr");
    for(const label of labels){const cell=node("th",label);cell.scope="col";row.append(cell);}
    head.append(row);table.append(head);return table;
  }
  // Render a real HTML table with focusable cells: color is never the sole evidence.
  function renderHeatmap() {
    const themes=data.modes[mode()].themes;
    const share=mode()!=="essay" && byId("theme-measure").value==="share";
    const table=tableHead(["Academic year · eligible posts",...themes],data.modes[mode()].label + (share ? " · share within each year" : " · matching post counts"));
    const maximumCount=Math.max(1,...currentRows.flatMap((row)=>row.counts));
    const body=node("tbody");
    for(const row of currentRows){
      const tr=node("tr"),heading=node("th",`${row.year} · n=${row.denominator}`);heading.scope="row";tr.append(heading);
      row.counts.forEach((count,index) => {
        const cell=node("td"),theme=themes[index];
        const fraction=row.denominator ? count/row.denominator : 0;
        const label=row.denominator ? (share ? `${(100*fraction).toFixed(1)}%` : String(count)) : "—";
        const control=button(label,()=>chooseEvidence(theme,row.year),`${theme}, ${row.year}: ${count} of ${row.denominator} eligible posts. Inspect evidence.`);
        control.disabled=!row.denominator;
        // A bounded fill strengthens a value without changing its meaning.
        control.style.setProperty("--theme-fill",`${Math.round(100*(share ? fraction : count/maximumCount))}%`);
        control.className="theme-cell";
        control.append(node("small",`${count}/${row.denominator}`));
        cell.append(control);tr.append(cell);
      });
      body.append(tr);
    }
    table.append(body);byId("theme-heatmap").replaceChildren(table);
  }
  // Pair counts are set intersections. The non-exhaustive essay labels cannot support this table.
  function renderOverlap() {
    if (mode() === "essay") {
      byId("theme-overlap").replaceChildren(node("p",
        "No overlap matrix is shown for the essay layer. Its posts were chosen as illustrative examples under particular headings, not exhaustively coded for every theme. Off-diagonal zeros would incorrectly suggest that the interpretive themes do not overlap in those texts."));
      return;
    }
    const themes = data.modes[mode()].themes;
    const maximum = Math.max(1, ...themes.map((theme) =>
      math.themeOverlap(currentPosts, mode(), theme, theme).intersection));
    const table = tableHead(["Theme", ...themes],
      "Distinct posts matching both themes · fill scaled to the largest count in this matrix");
    const body = node("tbody");
    for (const first of themes) {
      const row = node("tr");
      const heading = node("th", first);
      heading.scope = "row";
      row.append(heading);
      for (const second of themes) {
        const overlap = math.themeOverlap(currentPosts, mode(), first, second);
        const cell = node("td");
        const control = button(String(overlap.intersection), () => {
          chooseEvidence(first, "all", first === second ? null : second);
          byId("theme-overlap-detail").textContent =
            `${overlap.intersection} distinct posts match both labels; ${overlap.first} match “${first}”, ${overlap.second} match “${second}”, and ${overlap.union} match at least one. These are overlapping post sets, not a collaboration network.`;
        }, `${first} and ${second}: ${overlap.intersection} shared posts. Inspect evidence.`);
        control.className = "theme-cell";
        control.style.setProperty("--theme-fill",
          `${Math.round(100 * overlap.intersection / maximum)}%`);
        cell.append(control);
        row.append(cell);
      }
      body.append(row);
    }
    table.append(body);
    byId("theme-overlap").replaceChildren(table);
  }
  // Show all credited names on request; the initial ten-name limit is a display choice.
  function renderAuthors() {
    const authors=math.themeAuthors(currentPosts,mode(),selectedTheme);
    const setting=byId("theme-author-limit").value;
    const visible=authors.slice(0,setting==="all" ? authors.length : Number(setting));
    const list=node("ul","","theme-writer-list");
    const max=Math.max(1,...visible.map((row)=>row.matches));
    for(const row of visible){
      const item=node("li"),control=button(row.author,()=>{
        byId("theme-author").value=row.author;inspectYear="all";selectedPair=null;postLimit=12;render();
      },`Filter thematic views to ${row.author}: ${row.matches} matching post credits.`);
      const bar=node("span","","theme-writer-track");bar.setAttribute("aria-hidden","true");
      const fill=node("span");fill.style.width=`${100*row.matches/max}%`;bar.append(fill);
      item.append(control,bar,node("span",`${row.matches}/${row.eligible} post credits · ${row.provisional} matching credits provisional`));list.append(item);
    }
    byId("theme-author-bars").replaceChildren(list);
    byId("theme-author-scope").textContent=`${visible.length} of ${authors.length} credited names shown for “${selectedTheme}”. Counts span the global filters; a heatmap-cell inspection does not silently narrow these bars. Zero-match writers remain eligible.`;
  }
  // Preserve original source credits and their uncertainty beside each matching article.
  function renderPosts() {
    matchingPosts=currentPosts.filter((post)=>post.signals[mode()].includes(selectedTheme) &&
      (!selectedPair || post.signals[mode()].includes(selectedPair)) && (inspectYear==="all" || post.year===inspectYear));
    const eligible=inspectYear==="all" ? currentPosts.length : currentPosts.filter((p)=>p.year===inspectYear).length;
    byId("theme-post-scope").textContent=`${matchingPosts.length} of ${eligible} eligible posts · ${selectedTheme}${selectedPair ? " AND "+selectedPair : ""} · ${inspectYear==="all" ? "all filtered years" : inspectYear}. Showing up to ${postLimit}.`;
    const list=node("div");
    for(const post of matchingPosts.slice(0,postLimit)){
      const card=node("article","","theme-source-card"),heading=node("h4");
      const title=node("a",post.title);
      try{const url=new URL(post.url);if(["https:","http:"].includes(url.protocol)){title.href=url.href;title.target="_blank";title.rel="noopener noreferrer";}}catch(_){/* Unusable URLs stay plain labels. */}
      heading.append(title);
      card.append(heading,node("p",`${post.year} · ${post.authors.join("; ")} · ${post.authorshipTier}`),node("p",`Credit basis: ${post.creditStatus}. Original credit: ${post.originalAuthors.join("; ")}.`,"secondary"));
      const detail=node("details");detail.append(node("summary","Why this post appears"));
      if(mode()==="headline") detail.append(node("p",`Recorded matching terms: ${[...new Set([selectedTheme,selectedPair].filter(Boolean).flatMap((theme)=>post.titleTagTerms[theme]||[]))].join(", ") || "See saved dictionary flag"}.`));
      else if(mode()==="fulltext") detail.append(node("p","Saved title/tag/body dictionary flag. Literal body-match locations were not stored in the original metadata; inspect the original post before interpreting the match. A match may be incidental or negated."));
      else detail.append(node("p","Explicit membership in this theme’s source examples in the essay. This is an interpretive assignment by the agent, not a machine topic weight or independently human-validated code."));
      if(post.creditQuote)detail.append(node("blockquote",post.creditQuote));
      card.append(detail);list.append(card);
    }
    if(!matchingPosts.length)list.append(node("p","No matching posts. Try another theme or clear a filter. This is not evidence that the theme is absent from unexamined texts."));
    byId("theme-posts").replaceChildren(list);
    byId("theme-more").hidden=matchingPosts.length<=postLimit;
    byId("theme-export-posts").disabled=!matchingPosts.length;
  }
  function exportRows(filename,rows) {
    const address=URL.createObjectURL(new Blob([window.TowerMath.csvText(rows)],{type:"text/csv;charset=utf-8"}));
    const link=node("a");link.href=address;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(address),1000);
  }
  // One global filter population feeds all charts. Rebuilding never changes saved assignments.
  function render() {
    const definition=data.modes[mode()];
    currentPosts=math.eligibleThemePosts(data.posts,mode(),choices());
    const themes=definition.themes;
    if(!themes.includes(selectedTheme))selectedTheme=themes[0];
    options("theme-focus",themes.map((theme)=>[theme,theme]));byId("theme-focus").value=selectedTheme;
    const years=choices().year==="all" ? [...new Set(data.posts.map((p)=>p.year))].sort() : [choices().year];
    currentRows=math.themeYearCounts(currentPosts,mode(),themes,years);
    if(mode()==="essay")byId("theme-measure").value="count";
    byId("theme-measure").disabled=mode()==="essay";
    byId("theme-method").textContent=`${definition.population}. ${definition.basis} ${mode()==="essay" ? "Counts only: missing sample years and unselected posts cannot be interpreted as no theme." : "Denominators include eligible posts with no dictionary match. These charts use 325 possible records, unlike the 299-post topic corpus and older 307-post body-motif analysis."}`;
    const provisional=currentPosts.filter((p)=>p.creditStatus==="provisional posting-account attribution").length;
    byId("theme-scope").textContent=`${currentPosts.length} eligible posts · ${provisional} account-only; ${currentPosts.filter(p=>p.authorshipTier==="source-supported").length} source-supported; ${currentPosts.filter(p=>p.authorshipTier==="declared-credit").length} declared-only · ${themes.length} ${mode()==="essay" ? "interpretive headings" : "overlapping theme signals"} · ${definition.label}. No model was refitted.`;
    byId("theme-overlap-detail").textContent="Select a pair to inspect its intersection and denominator.";
    renderHeatmap();renderOverlap();renderAuthors();renderPosts();
  }
  function open() {
    if(ready)return;
    data=JSON.parse(byId("theme-data").textContent);ready=true;
    options("theme-year",[["all","All academic years"],...[...new Set(data.posts.map((p)=>p.year))].sort().map((year)=>[year,year])]);
    options("theme-author",[["all","All credited writers"],...[...new Set(data.posts.flatMap((p)=>p.authors))].sort().map((author)=>[author,author])]);
    for(const id of ["theme-mode","theme-year","theme-author","theme-explicit","theme-supported","theme-measure"])
      byId(id).addEventListener("change",()=>{inspectYear="all";selectedPair=null;postLimit=12;render();});
    byId("theme-focus").addEventListener("change",()=>chooseEvidence(byId("theme-focus").value));
    byId("theme-author-limit").addEventListener("change",renderAuthors);
    byId("theme-all-years").addEventListener("click",()=>{inspectYear="all";postLimit=12;renderPosts();});
    byId("theme-more").addEventListener("click",()=>{postLimit+=20;renderPosts();});
    byId("theme-reset").addEventListener("click",()=>{
      byId("theme-mode").value="headline";byId("theme-year").value="all";byId("theme-author").value="all";
      byId("theme-explicit").checked=false;byId("theme-supported").checked=false;byId("theme-measure").value="share";byId("theme-author-limit").value="10";
      selectedTheme="";selectedPair=null;inspectYear="all";postLimit=12;render();
    });
    byId("theme-export-years").addEventListener("click",()=>exportRows("tagging-the-tower-theme-years.csv",currentRows.flatMap((row)=>data.modes[mode()].themes.map((theme,index)=>({evidence_layer:mode(),academic_year:row.year,theme,matching_posts:row.counts[index],eligible_posts:row.denominator,writer_filter:choices().author,explicit_credit_required:choices().explicit,source_supported_required:choices().supportedOnly})))));
    byId("theme-export-posts").addEventListener("click",()=>exportRows("tagging-the-tower-theme-posts.csv",matchingPosts.map((post)=>({evidence_layer:mode(),theme:selectedTheme,second_theme:selectedPair||"",inspected_year:inspectYear,id:post.id,title:post.title,academic_year:post.year,credited_writers:post.authors.join("; "),original_credit:post.originalAuthors.join("; "),credit_basis:post.creditStatus,authorship_disposition:post.authorshipTier,url:post.url}))));
    render();
  }
  window.TowerThemes={open};
})();
