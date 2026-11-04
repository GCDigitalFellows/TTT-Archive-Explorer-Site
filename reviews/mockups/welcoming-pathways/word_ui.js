/* Five analytic lenses on one preserved 299-post corpus.
 * Python supplies the versioned aggregates; JavaScript selects and partitions
 * them. No browser NLP/model fit, source edit or authorship inference occurs.
 * Keep raw counts, incidence shares, distinctiveness scores and topic weights
 * separate: their units and denominators cannot be used interchangeably.
 */
'use strict';
function createPathwaysWords({root,data,showPosts,clearDetails,announce}){
  const get=name=>root.querySelector('#'+name),evidence=data.wordViews;
  let year='all',mode='cloud',lens='shared',order='years',topicFocus='all',leading=true;
  const make=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  const svgTag=(tag,attrs={})=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
  const number=n=>Number.isInteger(n)?n.toLocaleString():n.toFixed(3);
  const view=()=>data.hierarchies.modes[lens];
  function inspect(group,row,cloud=false){
    const unit=cloud?'token occurrences':view().unit;
    const label=`${group.label} · ${row.word} · ${number(row.count)} ${unit} · ${row.ids.length} containing/contributing posts`;
    get('wp-word-detail').textContent=label+'. Source posts appear below.';
    get('wp-word-selection-text').textContent=label+(lens==='topics'&&!cloud?'. Posts are ordered by saved topic weight; a positive weight is not a verified thematic assignment.':'. Inspect context before interpreting the term.');
    get('wp-word-source-jump').hidden=false;
    showPosts(row.ids,label);announce(label);
  }
  function sourceButton(group,row,cloud=false){const b=make('button',row.word);b.type='button';b.addEventListener('click',()=>inspect(group,row,cloud));return b;}
  function resetDetail(){clearDetails();get('wp-word-detail').textContent='Select a branch or table value to inspect source posts.';get('wp-word-selection-text').textContent='Select a year to expand it, or a word/topic to inspect its evidence.';get('wp-word-source-jump').hidden=true;}
  function chooseYear(value){year=value;if(mode==='heat')mode='sun';get('wp-word-year').value=value;resetDetail();render();get('wp-word-summary').tabIndex=-1;get('wp-word-summary').focus();announce(value==='all'?'All academic years displayed':value+' expanded');}
  // Same data, reversed nesting: each fractional topic contribution is retained.
  function chartGroups(){
    const groups=view().groups.filter(g=>year==='all'||g.label===year);
    if(lens!=='topics'||order==='years')return groups;
    return data.topics.map((topic,index)=>{
      const rows=groups.map(g=>{const r=g.rows[index];return {...r,word:g.label,key:g.label,year:g.label};});
      const mass=rows.reduce((n,r)=>n+r.count,0);
      return {label:topic.label,topicIndex:index,mass,posts:new Set(rows.flatMap(r=>r.ids)).size,rows:rows.map(r=>({...r,value:mass?r.count/mass:0}))};
    }).filter(g=>topicFocus==='all'||g.topicIndex===Number(topicFocus));
  }
  function sector(start,end,inner,outer){
    const point=(r,a)=>[380+r*Math.cos(a),380+r*Math.sin(a)].join(',');const large=end-start>Math.PI?1:0;
    end=Math.min(end,start+2*Math.PI-.00001);
    return `M${point(outer,start)} A${outer},${outer} 0 ${large} 1 ${point(outer,end)} L${point(inner,end)} A${inner},${inner} 0 ${large} 0 ${point(inner,start)} Z`;
  }
  function action(svg,label,path,fn){
    const a=svgTag('a',{href:'#wp-word-detail',role:'button','aria-label':label});const title=svgTag('title');title.textContent=label;path.append(title);a.append(path);
    a.addEventListener('click',e=>{e.preventDefault();fn();});a.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();fn();}});svg.append(a);return a;
  }
  function radial(svg,label,angle,radius,always=false,width=0){
    if(!always&&width<.045)return;
    const x=380+radius*Math.cos(angle),y=380+radius*Math.sin(angle);
    const text=svgTag('text',{x,y,'text-anchor':'middle','dominant-baseline':'middle','pointer-events':'none',transform:`rotate(${angle*180/Math.PI+(Math.cos(angle)<0?180:0)} ${x} ${y})`});text.textContent=label;svg.append(text);
  }
  function sunburst(){
    const target=get('wp-word-sun');target.replaceChildren();const groups=chartGroups().filter(g=>g.mass>0),total=groups.reduce((n,g)=>n+g.mass,0);
    if(!total){target.append(make('p','No eligible values in this scope. Check the thresholds and corpus inclusion rules.'));return;}
    const svg=svgTag('svg',{viewBox:'0 0 760 760',class:'word-sunburst',role:'group','aria-label':view().label+' sunburst. '+view().explanation+' Exact values follow in the table.'});
    const colors=['#88a9ca','#d4b380','#b5a0cc','#91b8ac','#d9a4ae'];let start=-Math.PI/2;
    groups.forEach((g,index)=>{
      const end=start+2*Math.PI*g.mass/total,mid=(start+end)/2;
      action(svg,g.label+': '+g.posts+' analyzed posts; '+(lens==='topics'&&order==='topics'?'show topic sources':'expand year'),svgTag('path',{d:sector(start,end,105,210),fill:colors[index%colors.length]}),()=>{
        if(lens==='topics'&&order==='topics'){
          topicFocus=String(g.topicIndex);get('wp-topic-focus').value=topicFocus;render();get('wp-word-summary').tabIndex=-1;get('wp-word-summary').focus();const rows=g.rows;inspect(g,{word:'All contributing years',count:g.mass,ids:data.posts.filter(p=>rows.some(r=>r.ids.includes(p.id))).sort((a,b)=>b.weights[g.topicIndex]-a.weights[g.topicIndex]).map(p=>p.id)});
        }else chooseYear(g.label);
      });
      // Every year is named, even when its outer leaves have small angular spans.
      const short=g.label.length>22?g.label.slice(0,20)+'…':g.label;
      radial(svg,short,mid,157,true);
      let next=start;
      const rows=leading&&['shared','raw','phrases'].includes(lens)?g.rows.filter(r=>r.key!=='__other__'):g.rows;
      const shown=rows.reduce((n,r)=>n+r.value,0);
      for(const row of rows){
        const stop=next+(end-start)*row.value/shown;
        if(stop<=next)continue;
        action(svg,`${g.label}, ${row.word}: ${number(row.count)} ${view().unit}; inspect sources`,svgTag('path',{d:sector(next,stop,215,350),fill:row.key==='__other__'?'#d1d4d5':colors[index%colors.length]}),()=>inspect(g,row));
        // Adaptive estimate in SVG units: words fit along the radial thickness;
        // minimum tangential span prevents unreadable labels. Tables never omit.
        radial(svg,row.word.length>20?row.word.slice(0,18)+'…':row.word,(next+stop)/2,280,false,stop-next);
        next=stop;
      }
      start=end;
    });
    for(const [text,y]of[[lens==='topics'?number(total)+' post units':groups.length+' equal year units',375],[(leading&&['shared','raw','phrases'].includes(lens)?'Leading five enlarged':view().label.replace(' · research','')),398]]){const t=svgTag('text',{x:380,y,'text-anchor':'middle'});t.textContent=text;svg.append(t);}target.append(svg);
  }
  function makeTable(headers,caption){const table=make('table');table.className='data-table';table.append(make('caption',caption));const head=make('thead'),line=make('tr');for(const name of headers){const th=make('th',name);th.scope='col';line.append(th);}head.append(line);table.append(head);const body=make('tbody');table.append(body);return {table,body};}
  function countTable(){
    const cloud=mode==='cloud';const groups=cloud?[year==='all'?evidence.all:evidence.years.find(g=>g.label===year)]:view().groups.filter(g=>year==='all'||g.label===year);
    const {table,body}=makeTable(['Academic year / scope','Word, phrase or topic / sources',cloud?'Token occurrences':view().unit,cloud?'Per 1,000 retained tokens':view().heatUnit],cloud?'Up to 60 most frequent saved cleaned forms':view().label+' · complete displayed branches; Other completes applicable totals');
    for(const g of groups)for(const row of cloud?g.words:g.rows){const tr=make('tr'),th=make('th',g.label);th.scope='row';const td=make('td');td.append(sourceButton(g,row,cloud));tr.append(th,td,make('td',number(row.count)),make('td',cloud?(1000*row.count/g.tokens).toFixed(2):row.heat===null?'—':row.heat.toFixed(2)));body.append(tr);}get('wp-word-table').replaceChildren(table);
  }
  function heatmap(){
    const target=get('wp-word-heat');target.replaceChildren();const matrix=view().matrix,years=view().groups.map(g=>g.label);
    const {table,body}=makeTable(['Word, phrase or topic',...years],view().label+' · '+view().heatUnit+'. Common row set across all years; 2026–2027 partial. Dash = unavailable. Numeric values remain readable without colour.');
    const finite=matrix.flatMap(r=>r.cells.map(c=>c.value)).filter(v=>v!==null),max=Math.max(1e-9,...finite);
    for(const row of matrix){const tr=make('tr'),th=make('th',row.label);th.scope='row';tr.append(th);
      for(const cell of row.cells){const td=make('td');if(cell.value===null){td.textContent='—';td.title='No eligible value under this lens; not an observed zero';}else{
        const b=make('button',cell.value.toFixed(2));b.type='button';b.style.backgroundColor=`hsl(207 45% ${97-28*Math.max(0,cell.value)/max}%)`;b.setAttribute('aria-label',`${cell.year}, ${row.label}: ${cell.value.toFixed(3)} ${view().heatUnit}; inspect sources`);b.addEventListener('click',()=>inspect({label:cell.year},{word:row.label,count:cell.count,ids:cell.ids}));td.append(b);}tr.append(td);}body.append(tr);}target.append(table);
  }
  const exclusiveView=createYearExclusive({root,data,chooseYear,showPosts,announce});
  function render(){
    const group=year==='all'?evidence.all:evidence.years.find(g=>g.label===year),cloud=mode==='cloud';
    get('wp-word-cloud').hidden=!cloud;get('wp-word-sun').hidden=mode!=='sun';get('wp-word-heat').hidden=mode!=='heat';get('wp-word-selection').hidden=cloud;get('wp-word-lens-controls').hidden=cloud;
    get('wp-topic-order-label').hidden=lens!=='topics'||mode!=='sun';get('wp-topic-focus-label').hidden=lens!=='topics'||order!=='topics'||mode!=='sun';get('wp-word-research-note').hidden=lens!=='distinct';get('wp-word-research-note').textContent='Research settings: ≥3 occurrences in the year, ≥2 containing posts in the year, ≥3 in the corpus; smoothing 0.5; positive scores only. Raising the year minimum to 3 posts retains '+(year==='all'?'between 0 and 5 of the original five words across years':data.hierarchies.distinct_sensitivity.find(r=>r.year===year).shared_words+' of the original five words in this year')+'. Rankings are sensitive to these choices; see the methods sensitivity table.';get('wp-word-leading-label').hidden=mode!=='sun'||!['shared','raw','phrases'].includes(lens);get('wp-word-lens-explanation').textContent=view().explanation+(mode==='sun'&&leading&&['shared','raw','phrases'].includes(lens)?' Chart focus: Other is omitted and the leading five are enlarged to fill each year; these are shares of the selected five only. The table retains Other and full denominators.':'');
    for(const [name,value]of[['wp-word-cloud-button','cloud'],['wp-word-sun-button','sun'],['wp-word-heat-button','heat']])get(name).setAttribute('aria-pressed',String(mode===value));
    get('wp-word-summary').textContent=cloud?`${group.label}: ${group.posts} analyzed posts · ${group.tokens.toLocaleString()} retained tokens · ${group.unique.toLocaleString()} cleaned forms. Up to 60 shown.`:mode==='heat'?`${view().label}: all 15 years compared regardless of the year selector. ${view().heatUnit}. Selecting a year opens its sunburst; the count table follows that year.`:`${view().label}: ${year==='all'?'all academic years':year}. ${group.posts} analyzed posts in scope. ${view().unit}; see the explanation for sector sizes.`;
    if(cloud){const target=get('wp-word-cloud');target.replaceChildren();const max=group.words[0]?.count||1;for(const row of group.words){const b=sourceButton(group,row,true);b.style.fontSize=(.85+2.8*Math.sqrt(row.count/max))+'rem';b.title=`${row.word}: ${row.count} occurrences in ${row.ids.length} posts`;b.setAttribute('aria-label',b.title+'; inspect sources');target.append(b);}if(!group.words.length)target.append(make('p','No saved analyzed words in this academic year.'));}
    else if(mode==='sun')sunburst();else heatmap();
    const buttons=get('wp-word-year-buttons');buttons.replaceChildren();
    if(!cloud)for(const g of view().groups){const b=make('button',g.label+(g.label==='2026–2027'?' · partial':'')+' · n='+g.posts);b.type='button';b.setAttribute('aria-pressed',String(year===g.label));b.addEventListener('click',()=>chooseYear(g.label));buttons.append(b);}
    countTable();exclusiveView.render(year,mode==='sun');
  }
  const select=get('wp-word-year');for(const [value,label]of[['all','Entire analyzed corpus · all years'],...evidence.years.map(g=>[g.label,g.label+(g.label==='2026–2027'?' · partial':'')+' · '+g.posts+' analyzed posts'])]){const o=make('option',label);o.value=value;select.append(o);}
  select.addEventListener('change',()=>chooseYear(select.value));
  for(const [name,value]of[['wp-word-cloud-button','cloud'],['wp-word-sun-button','sun'],['wp-word-heat-button','heat']])get(name).addEventListener('click',()=>{mode=value;resetDetail();render();announce(value==='cloud'?'Word cloud displayed':value==='sun'?'Sunburst displayed':'Year comparison heatmap displayed');});
  get('wp-word-lens').addEventListener('change',e=>{lens=e.target.value;resetDetail();render();announce(view().label+' selected');});
  for(const [value,label]of[['all','All saved topics'],...data.topics.map((t,i)=>[String(i),t.label])]){const o=make('option',label);o.value=value;get('wp-topic-focus').append(o);}
  get('wp-topic-focus').addEventListener('change',e=>{topicFocus=e.target.value;resetDetail();render();announce('Topic branch expanded');});
  get('wp-topic-order').addEventListener('change',e=>{order=e.target.value;resetDetail();render();announce('Topic hierarchy changed; numerical contributions are unchanged');});
  get('wp-word-leading').addEventListener('change',e=>{leading=e.target.checked;render();announce(leading?'Leading-five focus; Other retained in table':'Full distribution including Other');});
  get('wp-word-all-years').addEventListener('click',()=>chooseYear('all'));
  get('wp-word-source-jump').addEventListener('click',()=>{const heading=root.querySelector('#wp-analysis-posts h2');heading.tabIndex=-1;heading.focus();});
  return {render};
}
