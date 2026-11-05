/* Meet the people: counts of saved credit labels and annual role evidence.
 * The main cards respond to writing scope/evidence. Team controls select a
 * separate roster population. Current affiliations never populate past years.
 * Original authors retain source-text credit, not automatic project authorship.
 */
'use strict';
function createPathwaysPeople({root,data,openPost,announce}){
  const get=n=>root.querySelector('#'+n),saved=data.peopleHistory;
  const byName=new Map([...saved.roster,...saved.people].map(p=>[p.name,p]));
  const byPost=new Map(data.posts.map(p=>[p.id,p]));
  let scope='local',tier='named',population='all',role='digital',dimension='fields';
  const current=()=>saved.scopes[scope+'-'+tier];
  const make=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  const button=(text,fn)=>{const b=make('button',text);b.type='button';b.addEventListener('click',fn);return b;};
  function source(text,url){const a=make('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function table(headers,caption,rows){const t=make('table');t.className='data-table';t.append(make('caption',caption));const head=make('thead'),line=make('tr');for(const name of headers){const th=make('th',name);th.scope='col';line.append(th);}head.append(line);t.append(head);const body=make('tbody');for(const values of rows){const tr=make('tr');values.forEach((v,i)=>{const td=make(i===0?'th':'td');if(i===0)td.scope='row';if(v instanceof Node)td.append(v);else td.textContent=v;tr.append(td);});body.append(tr);}t.append(body);return t;}
  function entryIncluded(e){return (scope==='all'||e.kind==='local/unflagged')&&(tier==='checked'?e.authorshipTier==='source-supported':['source-supported','declared-credit'].includes(e.authorshipTier));}
  function focusEvidence(text){get('wp-people-selection').textContent=text;announce(text);const h=root.querySelector('#wp-people-evidence h2');h.focus();}
  function inspectPerson(name){
    const p=byName.get(name);if(!p)return;
    const target=get('wp-people-detail');target.replaceChildren(make('h3',name));
    target.append(make('p',p.datedDigitalFellow?'Dated GC Digital Fellow history is recorded. This does not establish membership at every article date.':p.currentDigitalFellow?'The saved current-team snapshot names a GC Digital Fellow role, confirmed by Ian G. Williams as the 2026–2027 roster. Exact appointment dates and earlier membership are not inferred.':'No dated/current GC Digital Fellow match in this saved view; this does not establish nonmembership or guest status.'));
    target.append(make('h4','Academic-affiliation evidence'));
    if(!p.affiliations.length)target.append(make('p','No academic-affiliation label available from the saved directory evidence.'));
    const seen=new Set();for(const a of p.affiliations){const key=a.claimId;if(seen.has(key))continue;seen.add(key);const block=make('p');block.append(make('strong',a.label+' · '),make('span',a.basis+': '+a.passage+' '),source('Directory source ↗',a.source));target.append(block);}
    target.append(make('h4','Dated role evidence'));
    const cells=saved.annual.filter(a=>a.name===name);target.append(make('p',cells.length?cells.map(a=>a.academic_year+' · '+saved.roles[a.role_family]).join('; '):'No dated annual role cells in the saved directory.'));
    const entries=p.entries.filter(entryIncluded);target.append(make('h4',entries.length+' credited records under the writing controls'));
    for(const e of entries){const post=byPost.get(e.postId);const block=make('p');const read=button(e.title,event=>openPost(post,undefined,event.currentTarget));read.id='wp-person-post-'+e.postId;block.append(read,make('span',' · '+e.year+' · '+e.authorshipTier+(e.kind==='local/unflagged'?'':' · curated/source-linked')));if(e.evidence)block.append(make('small',' · Credit passage: '+e.evidence));target.append(block);}
    if(!entries.length)target.append(make('p','No named/checked published writing credit under these controls. Directory membership alone is not an article byline.'));
    focusEvidence('Source records for '+name);
  }
  function selectedAnnual(){const names=new Set(current().people);return saved.annual.filter(a=>(role==='all'||a.role_family==='digital')&&(population==='all'||names.has(a.name)));}
  function inspectCells(cells,label){
    const target=get('wp-people-detail');target.replaceChildren(make('h3',label));
    const names=[...new Set(cells.map(a=>a.name))].sort();target.append(make('p',names.length+' distinct recorded people; select a name to inspect affiliations, roles and any writing credits.'));
    for(const name of names)target.append(button(name,()=>inspectPerson(name)));
    const evidence=new Map(cells.flatMap(a=>a.evidence).map(e=>[e.id,e]));const detail=make('details');detail.append(make('summary','Source statements and confirmations behind this selection'));
    for(const e of evidence.values()){const p=make('p',e.raw+' ');p.append(source('Source ↗',e.url));detail.append(p);}target.append(detail);focusEvidence(label);
  }
  function renderCohorts(){
    const annual=selectedAnnual(),names=new Set(annual.map(a=>a.name)),years=saved.years;
    get('wp-cohort-summary').textContent=`${names.size} distinct people in this recorded annual team view · ${population==='all'?'all documented team members':'selected credited writers'} · ${role==='digital'?'GC Digital Fellows only':'GCDI roles kept separate'}. Source snapshot: ${saved.sourceDate}. The seven-person 2026–2027 Digital Fellow roster was confirmed by Ian G. Williams on November 4, 2026; earlier years use dated directory intervals. Other current role families remain undated.`;
    const rows=years.map(year=>({year,cells:annual.filter(a=>a.academic_year===year),available:saved.annual.some(a=>a.academic_year===year)}));
    const max=Math.max(1,...rows.map(r=>new Set(r.cells.map(a=>a.name)).size));get('wp-cohort-bars').replaceChildren();
    for(const r of rows){const n=new Set(r.cells.map(a=>a.name)).size;const b=button('',()=>inspectCells(r.cells,'Recorded team · '+r.year));b.className='annual-row';b.disabled=!r.available;const track=make('span');track.className='annual-track';track.setAttribute('aria-hidden','true');const fill=make('span');fill.className='annual-fill';fill.style.width=100*n/max+'%';track.append(fill);b.append(make('span',r.year),track,make('span',r.available?n+' people':'— · no dated data'));b.setAttribute('aria-label',r.year+': '+(r.available?n+' recorded people; inspect evidence':'no dated directory coverage'));get('wp-cohort-bars').append(b);}
    const keys=dimension==='roles'?Object.keys(saved.roles).filter(k=>annual.some(a=>a.role_family===k)):[...new Set(annual.flatMap(a=>a.fields))].sort();
    const values=keys.map(key=>[dimension==='roles'?saved.roles[key]:key,...rows.map(r=>{const cells=r.cells.filter(a=>dimension==='roles'?a.role_family===key:a.fields.includes(key));const n=new Set(cells.map(a=>a.name)).size;if(!r.available || (dimension==='roles' && !saved.annual.some(a=>a.academic_year===r.year && (a.basis==='dated directory interval' || a.role_family===key))))return '—';const b=button(String(n),()=>inspectCells(cells,(dimension==='roles'?saved.roles[key]:key)+' · '+r.year));b.setAttribute('aria-label',`${r.year}, ${dimension==='roles'?saved.roles[key]:key}: ${n} distinct recorded people; inspect sources`);b.style.backgroundColor=`hsl(207 45% ${97-28*n/max}%)`;return b;})]);
    get('wp-cohort-matrix').replaceChildren(table([dimension==='roles'?'GCDI role family':'Academic-affiliation label',...years],'Annual composition · distinct people per cell; labels can overlap; dash = no annual roster evidence',values));
  }
  function render(){
    const selected=current(),metrics=get('wp-people-metrics');metrics.replaceChildren();
    for(const [count,title,explanation]of[[selected.documentedDigitalCount,'Documented GC Digital Fellow writers',selected.digitalCount+' with dated history; '+selected.currentOnlyDigitalPeople.length+' additionally confirmed in the 2026–2027 roster. '+selected.digitalAtPublication.length+' match a dated interval at a credited publication.'],[selected.count,scope==='local'?'Named local-post writers':'Named writers represented',scope==='all'?'Includes credited source authors of curated external works.':'Includes guest writers and participants; not all are Fellows.'],[selected.affiliationCount,'Documented academic labels',`Programs/disciplines recorded for ${selected.affiliationPeople} of ${selected.count} writers; mixed granularity, not a formal program census.`],[selected.broaderFellowPeople.length,'Writers across GCDI Fellow families','Includes the GC Digital Fellows in the first count, plus other documented Fellow roles; not an additional headcount.']]){const card=make('article');card.className='people-metric';card.append(make('strong',count),make('span',title),make('p',explanation));metrics.append(card);}
    get('wp-people-summary').textContent=`${scope==='local'?'Local/unflagged records':'All published records including curated source works'} · ${tier==='named'?'named credits (checked or declared)':'source-supported credit evidence only'}. Across the full archive, ${saved.scopes['all-named'].count} named source writers are represented; ${saved.scopes['local-named'].count} have local-post credits and are included in that total. ${saved.accountOnlyNames.length} additional personal-name labels occur only as posting accounts and are excluded. These writers have ${selected.allRoleFamilies.length} documented GCDI role families: ${selected.allRoleFamilies.map(r=>saved.roles[r]).join(', ')}. Identity evidence and affiliations remain incomplete.`;
    const rows=selected.people.map(name=>{const p=byName.get(name);return [button(name,()=>inspectPerson(name)),p.datedDigitalFellow?'Dated GC Digital Fellow history':p.currentDigitalFellow?'GC Digital Fellow · confirmed 2026–2027':'No dated/current GC Digital Fellow match',[...new Set(p.affiliations.map(a=>a.label))].join('; ')||'Unknown in saved directory',[...new Set(p.roles.concat(p.currentRoles))].map(r=>saved.roles[r]).join('; ')||'No role match'];});
    get('wp-people-register').replaceChildren(table(['Credited person / sources','Fellowship evidence','Academic labels','GCDI role families'],'Selected source writers; missing directory matches are not proof of nonmembership',rows));
    get('wp-people-current').replaceChildren(table(['Name','Role and date basis','Academic label'], 'Current snapshot: Digital Fellows confirmed as 2026–2027; other roles undated',saved.current.map(r=>[button(r.name,()=>inspectPerson(r.name)),r.role+(r.academicYear?' · '+r.academicYear+' · human-confirmed':' · undated'),r.affiliation.label])));
    renderCohorts();
  }
  for(const [id,key]of[['wp-people-scope','scope'],['wp-people-tier','tier'],['wp-cohort-population','population'],['wp-cohort-role','role'],['wp-cohort-dimension','dimension']])get(id).addEventListener('change',e=>{if(key==='scope')scope=e.target.value;else if(key==='tier')tier=e.target.value;else if(key==='population')population=e.target.value;else if(key==='role')role=e.target.value;else dimension=e.target.value;get('wp-people-detail').replaceChildren();get('wp-people-selection').textContent='Controls changed; select a name or value to inspect source evidence.';render();});
  return {render};
}
