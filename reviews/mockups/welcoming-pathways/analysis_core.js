/* Saved-analysis aggregations, with no DOM, NLP cleaning or model fitting.
 * Each function receives an explicit population. Topic means use modeled posts;
 * keyword shares and credit edges use published local/unflagged posts.
 */
'use strict';
const PathwaysAnalysis=(()=>{
  function population(posts,choices={}){
    return posts.filter(p=>p.kind==='local/unflagged'&&(!choices.year||choices.year==='all'||p.year===choices.year)&&(!choices.author||choices.author==='all'||p.authors.includes(choices.author))&&(!choices.supported||p.tier==='source-supported'));
  }
  function topicYears(posts,years,topic){
    return years.map(year=>{const selected=posts.filter(p=>p.year===year&&p.weights);return{year,n:selected.length,value:selected.length?selected.reduce((sum,p)=>sum+p.weights[topic],0)/selected.length:null,ids:selected.map(p=>p.id)};});
  }
  function signalYears(posts,years,signal){
    return years.map(year=>{const selected=posts.filter(p=>p.year===year);const matching=selected.filter(p=>(p.signals||[]).includes(signal));return{year,n:selected.length,hits:matching.length,value:selected.length?matching.length/selected.length:null,ids:matching.map(p=>p.id)};});
  }
  function authorYears(posts){
    const edges=new Map();
    for(const post of posts){for(const author of new Set(post.authors)){const key=JSON.stringify([author,post.year]);const edge=edges.get(key)||{author,year:post.year,count:0,ids:[]};edge.count++;edge.ids.push(post.id);edges.set(key,edge);}}
    return [...edges.values()].sort((a,b)=>a.author.localeCompare(b.author)||a.year.localeCompare(b.year));
  }
  function authorTotals(posts){
    const rows=new Map();
    for(const post of posts){for(const author of new Set(post.authors)){const row=rows.get(author)||{author,count:0,unresolved:0,ids:[],years:new Set()};row.count++;row.unresolved+=Number(post.tier==='unresolved-account');row.ids.push(post.id);row.years.add(post.year);rows.set(author,row);}}
    return [...rows.values()].map(row=>({...row,years:[...row.years].sort()})).sort((a,b)=>b.count-a.count||a.author.localeCompare(b.author));
  }
  function sharedBylines(posts){
    const pairs=new Map();
    for(const post of posts){const names=[...new Set(post.authors)].sort();for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++){const key=JSON.stringify([names[i],names[j]]);const pair=pairs.get(key)||{first:names[i],second:names[j],count:0,ids:[]};pair.count++;pair.ids.push(post.id);pairs.set(key,pair);}}
    return [...pairs.values()].sort((a,b)=>b.count-a.count||a.first.localeCompare(b.first)||a.second.localeCompare(b.second));
  }
  return{population,topicYears,signalYears,authorYears,authorTotals,sharedBylines};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=PathwaysAnalysis;
