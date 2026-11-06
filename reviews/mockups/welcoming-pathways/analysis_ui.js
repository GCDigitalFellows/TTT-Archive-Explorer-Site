/* One additional prototype tab, with two views of saved evidence.
 * Dependencies are passed in by the existing interface. No production state,
 * source credits, saved weights or model inputs are changed by these controls.
 */
'use strict';
function createPathwaysAnalysis({root,data,posts,openPost,announce}){
  const id=name=>root.querySelector('#'+name);
  const math=PathwaysAnalysis;
  let selectionOpen=false;
  let redrawGraph=()=>{};
  let matrixReturnId='';
  const byPost=new Map(posts.map(p=>[p.id,p]));
  const years=[...new Set(posts.filter(p=>p.kind==='local/unflagged').map(p=>p.year))].sort();
  const state={year:'all',author:'all',supported:false,tab:'texts',topic:1,signal:data.keywordNames[0],mode:'years',limit:'12',detailIds:[],detailLabel:'',postLimit:6};
  const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const button=(label,action,cls)=>{const n=node('button',label,cls);n.type='button';n.addEventListener('click',action);return n;};
  function options(select,values){select.replaceChildren(...values.map(([value,label])=>{const n=node('option',label);n.value=value;return n;}));}
  function selected(){return math.population(posts,state);}
  function clearDetails(){matrixReturnId='';state.detailIds=[];state.detailLabel='';state.postLimit=6;renderDetails();}
  function showPosts(ids,label,cellId=''){matrixReturnId=cellId;state.detailIds=[...new Set(ids)];state.detailLabel=label;state.postLimit=6;renderDetails();announce(label+'; '+state.detailIds.length+' source posts available in Posts behind the selection.');}
  function renderDetails(){
    id('wp-a-detail-scope').textContent=state.detailLabel?state.detailLabel+' · '+state.detailIds.length+(state.detailIds.length===1?' matching post':' matching posts')+' · showing '+Math.min(state.postLimit,state.detailIds.length)+'.':'Select a year, name or connection to inspect its source posts.';
    const evidence=id('wp-network-detail-tiers');
    evidence.hidden=state.tab!=='networks'||!state.detailLabel;
    id('wp-network-return-cell').hidden=!matrixReturnId;
    if(!evidence.hidden){
      const tiers=state.detailIds.map(postId=>byPost.get(postId).tier);
      evidence.textContent=[
        [tiers.filter(tier=>tier==='source-supported').length,'source-supported'],
        [tiers.filter(tier=>tier==='declared-credit').length,'declared'],
        [tiers.filter(tier=>tier==='unresolved-account').length,'account-only'],
      ].map(([count,label])=>count+' '+label).join(' · ');
    }
    const cards=state.detailIds.slice(0,state.postLimit).map(postId=>{const p=byPost.get(postId);const card=node('article',undefined,'post');const title=button(p.title,()=>openPost(p,undefined,title),'post-title');title.id='wp-analysis-source-'+postId;card.append(node('p',p.year+' · '+p.authors.join('; '),'small'),title,node('p',PathwaysCore.creditLabel(p.tier),'small'));return card;});
    id('wp-a-posts').replaceChildren(...cards);id('wp-a-more').hidden=state.detailIds.length<=state.postLimit;
    if(state.detailLabel&&!state.detailIds.length)id('wp-a-posts').append(node('p','No source posts match this selection. Check the displayed denominator before interpreting an absence.'));
  }
  function bars(target,rows,kind){
    target.replaceChildren();
    for(const row of rows){
      const rankIds=kind==='topic'?[...row.ids].sort((a,b)=>byPost.get(b).weights[state.topic]-byPost.get(a).weights[state.topic]):row.ids;
      const label=kind==='topic'?'Topic weight · '+row.year:'Keyword signal · '+row.year;
      const n=button('',()=>showPosts(rankIds,label),'annual-row');n.disabled=row.value===null;
      const track=node('span',undefined,'annual-track');track.setAttribute('aria-hidden','true');const fill=node('span',undefined,'annual-fill');fill.style.width=(row.value===null?0:100*row.value)+'%';track.append(fill);
      const value=row.value===null?'— · n=0':(100*row.value).toFixed(1)+'% · '+(kind==='topic'?'n='+row.n:row.hits+'/'+row.n);
      n.append(node('span',row.year),track,node('span',value));n.setAttribute('aria-label',row.year+': '+value+(kind==='topic'?' mean topic weight':' matching-post share')+'; inspect posts');target.append(n);
    }
  }
  function renderText(pool){
    const displayYears=state.year==='all'?years:[state.year];
    id('wp-a-topic-words').textContent='Leading model words: '+data.topics[state.topic].words.join(', ')+'. Equal-post averages; the fitted model remains unchanged. 2026–27 is partial.';
    bars(id('wp-a-topic-bars'),math.topicYears(pool,displayYears,state.topic),'topic');
    bars(id('wp-a-signal-bars'),math.signalYears(pool,displayYears,state.signal),'signal');
  }
  function table(headers,rows,caption=headers[0]==='Credited name'?'Recorded publication credits within the selected analysis filters':'Shared recorded bylines within the selected analysis filters'){
    const t=node('table',undefined,'data-table');t.append(node('caption',caption));const head=node('thead');const line=node('tr');for(const label of headers){const th=node('th',label);th.scope='col';line.append(th);}head.append(line);t.append(head);
    const body=node('tbody');for(const values of rows){const row=node('tr');for(const [column,value] of values.entries()){const cell=node(column===0?'th':'td');if(column===0)cell.scope='row';if(typeof value==='string'||typeof value==='number')cell.textContent=value;else cell.append(value);row.append(cell);}body.append(row);}t.append(body);return t;
  }
  function graphNodes(left,right,edges,description){
    redrawGraph=()=>graphNodes(left,right,edges,description);
    const target=id('wp-a-network');target.replaceChildren();const width=target.clientWidth;
    // A complete, directly actionable table replaces the graph at narrow widths.
    id('wp-network-fallback').hidden=width>=580;
    id('wp-network-preview').hidden=width<580;
    if(width<580)return;
    if(!left.length||!right.length){target.append(node('p','No connections are available for these filters.'));return;}
    const ns='http://www.w3.org/2000/svg';
    const svgTag=(tag,attrs={})=>{const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
    const height=Math.max(230,Math.max(left.length,right.length)*29+70);
    const leftMargin=Math.min(220,width*.29),rightMargin=state.mode==='bylines'?Math.min(230,width*.3):100;
    const x1=leftMargin,x2=width-rightMargin;
    const y=(i,n)=>n===1?height/2:42+i*(height-76)/(n-1);
    const svg=svgTag('svg',{viewBox:'0 0 '+width+' '+height,width,height,role:'group','aria-label':description,class:'network-svg'});
    const title=svgTag('title');title.textContent=description;svg.append(title);
    const leftY=new Map(left.map((n,i)=>[n.key,y(i,left.length)])),rightY=new Map(right.map((n,i)=>[n.key,y(i,right.length)]));
    function action(label,callback){
      const a=svgTag('a',{href:'#wp-analysis-posts','aria-label':label,'data-tooltip':label});
      const preview=id('wp-network-preview');
      const reset=()=>{preview.textContent='Hover over or focus a name, year, or line for a preview.';};
      for(const event of ['pointerenter','focus'])a.addEventListener(event,()=>{preview.textContent=label;});
      a.addEventListener('pointerleave',()=>{if(!a.matches(':focus-visible'))reset();});
      a.addEventListener('blur',()=>{if(!a.matches(':hover'))reset();});
      a.addEventListener('click',event=>{event.preventDefault();callback();});
      const t=svgTag('title');t.textContent=label;a.append(t);return a;
    }
    for(const edge of edges){if(!leftY.has(edge.left)||!rightY.has(edge.right))continue;const y1=leftY.get(edge.left),y2=rightY.get(edge.right),middle=(x1+x2)/2;const a=action(edge.label,()=>showPosts(edge.ids,edge.label));a.append(svgTag('path',{d:`M${x1},${y1} C${middle},${y1} ${middle},${y2} ${x2},${y2}`,'stroke-width':Math.min(7,1+Math.sqrt(edge.count))}));svg.append(a);}
    function renderColumn(nodes,isLeft){nodes.forEach((n,i)=>{const yy=y(i,nodes.length),xx=isLeft?x1:x2;const a=action(n.label,()=>showPosts(n.ids,n.label));a.append(svgTag('circle',{cx:xx,cy:yy,r:4}));const available=isLeft?leftMargin-14:rightMargin-14;const cap=Math.max(10,Math.floor(available/7));const text=svgTag('text',{x:xx+(isLeft?-10:10),y:yy+4,'text-anchor':isLeft?'end':'start'});text.textContent=n.label.length>cap?n.label.slice(0,cap-1)+'…':n.label;a.append(text);svg.append(a);});}
    renderColumn(left,true);renderColumn(right,false);target.append(svg);
  }
  function renderNetworkMatrix(totals,edges){
    // Use the same post IDs as the graph. The graph's drawing cap does not
    // apply here, and each occupied cell opens its exact source set.
    const columns=state.year==='all'?years:[state.year];
    const cells=new Map(edges.map(edge=>[JSON.stringify([edge.author,edge.year]),edge]));
    const ordered=id('wp-network-matrix-order').value==='name'
      ? [...totals].sort((a,b)=>a.author.localeCompare(b.author)) : totals;
    const rows=ordered.map(({author})=>[author,...columns.map(year=>{
      const edge=cells.get(JSON.stringify([author,year]));
      if(!edge)return '0';
      const label=author+' · '+year+' · '+edge.count+(edge.count===1?' post':' posts');
      const cell=button(String(edge.count),()=>{
        showPosts(edge.ids,author+' · '+year,cell.id);
        const heading=id('wp-analysis-posts').querySelector('h2');
        heading.tabIndex=-1;
        heading.focus();
      });
      // The same cell can be rebuilt after the reader closes or the list sorts.
      cell.id='wp-matrix-cell-'+year+'-'+encodeURIComponent(author);
      cell.setAttribute('aria-label',label);
      return cell;
    })]);
    const target=id('wp-network-matrix');
    if(!rows.length){target.replaceChildren(node('p','No credited names match these filters.'));return;}
    const headings=columns.map(year=>year==='2026–2027'?year+' · partial':year);
    target.replaceChildren(table(['Credited name',...headings],rows,'Published local post credits by author and academic year'));
  }
  function renderNetwork(pool){
    const totals=math.authorTotals(pool),pairs=math.sharedBylines(pool),edgeRows=math.authorYears(pool);
    const count=state.limit==='all'?Infinity:Number(state.limit);
    const matrix=state.mode==='matrix';
    id('wp-network-matrix-controls').hidden=!matrix;
    id('wp-network-graph').hidden=matrix;
    id('wp-network-limit-label').hidden=matrix;
    id('wp-network-preview').textContent='Hover over or focus a name, year, or line for a preview.';
    id('wp-a-author-table').replaceChildren(table(['Credited name','Post credits','Academic years'],totals.map(row=>[button(row.author,()=>showPosts(row.ids,'Recorded credits: '+row.author),'link'),String(row.count)+(row.unresolved?' ('+row.unresolved+' account-only)':''),row.years.join(', ')])));
    id('wp-a-pairs').replaceChildren();
    if(pairs.length){
      const list=table(['Shared credited names','Posts'],pairs.map(pair=>[button(pair.first+' ↔ '+pair.second,()=>showPosts(pair.ids,'Shared recorded byline: '+pair.first+' / '+pair.second),'link'),pair.count]));
      const details=node('details');details.append(node('summary','Inspect all '+pairs.length+' recorded co-credit pairs'),list);id('wp-a-pairs').append(details);
    }else id('wp-a-pairs').append(node('p','No shared recorded bylines occur in this selection. This is not evidence of no collaboration.'));
    if(window.matchMedia('(max-width:650px)').matches)id('wp-a-network-table').open=true;
    const sharedSummary=id('wp-network-shared-summary');
    sharedSummary.replaceChildren();
    sharedSummary.hidden=state.mode!=='bylines';
    if(matrix){
      id('wp-a-network-scope').textContent=totals.length+' eligible credited names · '+pool.length+' local posts. Each cell counts posts for that name and year.';
      renderNetworkMatrix(totals,edgeRows);
    }else if(state.mode==='years'){
      const drawn=totals.slice(0,count);const keys=new Set(drawn.map(row=>row.author));
      const edges=edgeRows.filter(e=>keys.has(e.author));const graphYears=[...new Set(edges.map(e=>e.year))].sort();
      id('wp-a-network-scope').textContent=drawn.length+' of '+totals.length+' eligible credited names drawn · '+pool.length+' local posts. The complete table retains every eligible name, including those outside the graph limit.';
      graphNodes(drawn.map(row=>({key:row.author,label:row.author,ids:row.ids})),graphYears.map(year=>({key:year,label:year,ids:pool.filter(p=>p.year===year).map(p=>p.id)})),edges.map(e=>({left:e.author,right:e.year,count:e.count,ids:e.ids,label:e.author+' · '+e.year+' · '+e.count+' recorded post credits'})),'Author–academic-year network; edges count recorded local-post credits');
    }else{
      // A readable ego network shows one person's shared bylines, not a guessed
      // social network. With no selected author, choose the largest degree.
      const degrees=new Map();for(const pair of pairs){degrees.set(pair.first,(degrees.get(pair.first)||0)+1);degrees.set(pair.second,(degrees.get(pair.second)||0)+1);}
      const focus=state.author!=='all'?state.author:[...degrees].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0]?.[0];
      // A collective article can generate many pairs. Count each supporting
      // post once, before applying the graph's display limit.
      const allConnections=pairs.filter(p=>p.first===focus||p.second===focus);
      const sharedIds=[...new Set(allConnections.flatMap(pair=>pair.ids))];
      const connections=allConnections.slice(0,count);
      const right=connections.map(p=>({key:p.first===focus?p.second:p.first,label:p.first===focus?p.second:p.first,ids:p.ids}));
      const allCount=allConnections.length;
      id('wp-a-network-scope').textContent=focus?'Shared bylines around '+focus+' · '+connections.length+' of '+allCount+' other names drawn. Choose a credited name above to change the focus.':'No shared bylines are available for this selection.';
      if(sharedIds.length){
        const label=allCount+' other credited '+(allCount===1?'name':'names')+' across '+sharedIds.length+' distinct shared '+(sharedIds.length===1?'post':'posts');
        sharedSummary.append(node('p',label+'.'));
        const action=sharedIds.length===1?'Inspect '+byPost.get(sharedIds[0]).title:'Inspect all '+sharedIds.length+' distinct shared posts';
        sharedSummary.append(button(action,()=>showPosts(sharedIds,focus+' · '+label),'link'));
      }
      graphNodes(focus?[{key:focus,label:focus,ids:pool.filter(p=>p.authors.includes(focus)).map(p=>p.id)}]:[],right,connections.map((p,i)=>({left:focus,right:right[i].key,count:p.count,ids:p.ids,label:focus+' / '+right[i].label+' · '+p.count+(p.count===1?' shared recorded post':' shared recorded posts')})),'Shared-byline network around '+(focus||'no selected author')+'; not inferred collaboration');
    }
  }
  const wordViews=createPathwaysWords({root,data,showPosts,clearDetails,announce});
  function render(){
    const pool=selected();
    const choosing=selectionOpen||state.year!=='all'||state.author!=='all';
    id('wp-net-selection').hidden=!choosing;
    id('wp-net-year').value=state.year;id('wp-net-author').value=state.author;
    id('wp-net-all').setAttribute('aria-pressed',String(!choosing));
    id('wp-net-choose').setAttribute('aria-pressed',String(choosing));
    id('wp-net-credits-all').setAttribute('aria-pressed',String(!state.supported));
    id('wp-net-credits-supported').setAttribute('aria-pressed',String(state.supported));
    id('wp-a-year').value=state.year;id('wp-a-author').value=state.author;id('wp-a-evidence').value=state.supported?'supported':'all';
    id('wp-a-words').hidden=state.tab!=='words';id('wp-standard-analysis-filters').hidden=state.tab==='words';id('wp-a-scope').hidden=state.tab==='words';
    id('wp-a-texts').hidden=state.tab!=='texts';id('wp-a-networks').hidden=state.tab!=='networks';
    for(const b of root.querySelectorAll('[data-analysis-view]'))b.setAttribute('aria-pressed',String(b.dataset.analysisView===state.tab));
    id('wp-a-scope').textContent=pool.length+' eligible local posts · '+pool.filter(p=>p.weights).length+' modeled posts · '+math.authorTotals(pool).length+' credited names · '+pool.filter(p=>p.tier==='unresolved-account').length+' account-only credits. These filters are independent of archive search. Choosing a name retains entire coauthored posts; publication credits do not establish membership.';
    // Use the same evidence panel for every analysis. In the network it sits
    // immediately after the graph, without narrowing or duplicating the chart.
    const evidencePanel=id('wp-analysis-posts');
    const evidenceSlot=id(state.tab==='networks'?'wp-network-evidence-slot':'wp-analysis-evidence-slot');
    if(evidencePanel.parentElement!==evidenceSlot) evidenceSlot.append(evidencePanel);
    id('wp-network-detail-tiers').hidden=state.tab!=='networks'||!state.detailLabel;
    if(state.tab==='networks'){
      for(const [name,supported,label] of [['wp-net-credits-all',false,'All recorded credits'],
        ['wp-net-credits-supported',true,'Source-supported credits only']]){
        const eligible=math.population(posts,{...state,supported});
        id(name).textContent=label+' · '+eligible.length+' posts / '+math.authorTotals(eligible).length+' names';
      }
    }
    if(state.tab==='words')wordViews.render();else if(state.tab==='texts')renderText(pool);else renderNetwork(pool);
  }
  options(id('wp-a-year'),[['all','All academic years'],...years.map(y=>[y,y])]);
  options(id('wp-a-author'),[['all','All credited names'],...math.authorTotals(math.population(posts)).map(r=>r.author).sort((a,b)=>a.localeCompare(b)).map(a=>[a,a])]);
  options(id('wp-a-topic'),data.topics.map((t,i)=>[String(i),t.label]));id('wp-a-topic').value=String(state.topic);
  options(id('wp-a-signal'),data.keywordNames.map(s=>[s,s]));
  for(const b of root.querySelectorAll('[data-analysis-view]'))b.addEventListener('click',()=>{state.tab=b.dataset.analysisView;clearDetails();render();});
  for(const [name,key]of[['wp-a-year','year'],['wp-a-author','author']])id(name).addEventListener('change',event=>{state[key]=event.target.value;clearDetails();render();});
  id('wp-a-evidence').addEventListener('change',event=>{state.supported=event.target.value==='supported';clearDetails();render();});
  id('wp-a-clear').addEventListener('click',()=>{state.year='all';state.author='all';state.supported=false;selectionOpen=false;clearDetails();render();});
  id('wp-a-topic').addEventListener('change',event=>{state.topic=Number(event.target.value);clearDetails();render();});
  id('wp-a-signal').addEventListener('change',event=>{state.signal=event.target.value;clearDetails();render();});
  id('wp-a-network-mode').addEventListener('change',event=>{state.mode=event.target.value;clearDetails();render();});
  id('wp-open-network-matrix').addEventListener('click',()=>{
    id('wp-a-network-mode').value=state.mode='matrix';clearDetails();render();id('wp-network-matrix').focus();
  });
  id('wp-network-matrix-order').addEventListener('change',()=>renderNetwork(selected()));
  id('wp-network-return-cell').addEventListener('click',()=>{
    const cell=document.getElementById(matrixReturnId);
    if(cell)cell.focus();
  });
  id('wp-a-network-limit').addEventListener('change',event=>{state.limit=event.target.value;render();});
  // Mirror the analysis filters so year/person and evidence can be combined.
  // No arbitrary person/year is selected on the reader's behalf.
  options(id('wp-net-year'),[['all','All academic years'],...years.map(y=>[y,y])]);
  options(id('wp-net-author'),[['all','All credited names'],...math.authorTotals(math.population(posts)).map(r=>r.author).sort((a,b)=>a.localeCompare(b)).map(a=>[a,a])]);
  id('wp-net-all').addEventListener('click',()=>{state.year='all';state.author='all';selectionOpen=false;clearDetails();render();});
  id('wp-net-choose').addEventListener('click',()=>{selectionOpen=true;render();id('wp-net-year').focus();});
  for(const [name,key]of[['wp-net-year','year'],['wp-net-author','author']])id(name).addEventListener('change',event=>{state[key]=event.target.value;clearDetails();render();});
  for(const [name,supported]of[['wp-net-credits-all',false],['wp-net-credits-supported',true]])id(name).addEventListener('click',()=>{state.supported=supported;clearDetails();render();});
  id('wp-a-more').addEventListener('click',()=>{state.postLimit+=6;renderDetails();});
  // Refit only the graph on resize so table buttons and their focus survive.
  if(globalThis.ResizeObserver){
    let previousWidth;
    const graph=id('wp-a-network');
    const observer=new ResizeObserver(()=>{
      const width=graph.clientWidth;
      if(width!==previousWidth&&state.tab==='networks'&&state.mode!=='matrix'&&
        !root.querySelector('[data-view="analysis"]').hidden)redrawGraph();
      previousWidth=width;
    });
    observer.observe(graph);
  }
  return{render};
}
