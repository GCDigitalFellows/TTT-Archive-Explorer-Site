/* Saved word-count displays for human reviewers.
 * Input: build-time aggregates of the 299 preserved NLTK-cleaned documents.
 * Output: a top-60 word cloud or year -> top-five-word sunburst and exact table.
 * These controls select saved counts; they never fit a topic model, clean text,
 * apply author/network filters, or assign new authorship or themes.
 */
'use strict';
function createPathwaysWords({root,data,showPosts,clearDetails,announce}){
  const get=name=>root.querySelector('#'+name);
  const evidence=data.wordViews;
  let year='all',mode='cloud';
  const make=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  const svgTag=(tag,attrs={})=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
  function inspect(group,row){
    const label=`${row.word} · ${group.label} · ${row.count} occurrences in ${row.ids.length} posts`;
    get('wp-word-detail').textContent=label+'. Source posts appear below.';
    showPosts(row.ids,label);
  }
  function sourceButton(group,row){const b=make('button',row.word);b.type='button';b.addEventListener('click',()=>inspect(group,row));return b;}
  // Annular sectors use angles proportional to occurrence counts. Years sum
  // ONLY their top five leaves. This is deliberately not a whole-corpus total.
  function sector(start,end,inner,outer){
    const point=(r,a)=>[380+r*Math.cos(a),380+r*Math.sin(a)].join(',');
    const large=end-start>Math.PI?1:0;
    // Avoid a degenerate full-circle arc for a one-year selection.
    end=Math.min(end,start+2*Math.PI-.00001);
    return `M${point(outer,start)} A${outer},${outer} 0 ${large} 1 ${point(outer,end)} L${point(inner,end)} A${inner},${inner} 0 ${large} 0 ${point(inner,start)} Z`;
  }
  function sunburst(groups){
    const target=get('wp-word-sun');target.replaceChildren();
    const nonempty=groups.filter(g=>g.words.length);
    const total=nonempty.reduce((s,g)=>s+g.words.slice(0,5).reduce((n,w)=>n+w.count,0),0);
    if(!total){target.append(make('p','No analyzed tokens are available in this scope.'));return;}
    const svg=svgTag('svg',{viewBox:'0 0 760 760',class:'word-sunburst',role:'group','aria-label':'Sunburst: academic years inside, their top five words outside. Exact counts and source controls follow in the table.'});
    const colors=['#7392b7','#c99c66','#a58cb8','#72a39a','#c88d94'];
    let start=-Math.PI/2;
    nonempty.forEach((g,index)=>{
      const top=g.words.slice(0,5),sum=top.reduce((n,w)=>n+w.count,0),end=start+2*Math.PI*sum/total;
      const arc=svgTag('path',{d:sector(start,end,105,210),fill:colors[index%colors.length]});
      const title=svgTag('title');title.textContent=`${g.label}: ${sum} top-five occurrences, ${g.posts} analyzed posts`;arc.append(title);svg.append(arc);
      const middle=(start+end)/2;
      const label=svgTag('text',{x:380+157*Math.cos(middle),y:380+157*Math.sin(middle),'text-anchor':'middle','dominant-baseline':'middle'});label.setAttribute('transform',`rotate(${middle*180/Math.PI+(Math.cos(middle)<0?180:0)} ${380+157*Math.cos(middle)} ${380+157*Math.sin(middle)})`);label.textContent=g.label;if(end-start>.2)svg.append(label);
      let next=start;
      for(const row of top){
        const stop=next+2*Math.PI*row.count/total;
        const a=svgTag('a',{href:'#wp-word-detail',role:'button','aria-label':`${g.label}, ${row.word}, ${row.count} occurrences; inspect source posts`});
        const wedge=svgTag('path',{d:sector(next,stop,215,350),fill:colors[index%colors.length],'fill-opacity':'1'});
        const tip=svgTag('title');tip.textContent=`${g.label} · ${row.word}: ${row.count}`;wedge.append(tip);a.append(wedge);
        a.addEventListener('click',event=>{event.preventDefault();inspect(g,row);});
        a.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();inspect(g,row);}});
        svg.append(a);
        // Keep small leaves unlabelled rather than overlapping; all leaves are
        // named on focus/hover and have an equivalent source-linked table.
        if(stop-next>.085){const angle=(next+stop)/2;const t=svgTag('text',{x:380+280*Math.cos(angle),y:380+280*Math.sin(angle),'text-anchor':'middle','pointer-events':'none'});t.setAttribute('transform',`rotate(${angle*180/Math.PI+(Math.cos(angle)<0?180:0)} ${380+280*Math.cos(angle)} ${380+280*Math.sin(angle)})`);t.textContent=row.word;svg.append(t);}
        next=stop;
      }
      start=end;
    });
    const text=svgTag('text',{x:380,y:375,'text-anchor':'middle'});text.textContent=total.toLocaleString()+' occurrences';svg.append(text);
    const sub=svgTag('text',{x:380,y:397,'text-anchor':'middle'});sub.textContent='top five per year only';svg.append(sub);target.append(svg);
  }
  function countTable(groups){
    const table=make('table');table.className='data-table';table.append(make('caption',mode==='cloud'?'Up to 60 most frequent cleaned words in the selected scope':'Five most frequent cleaned words per academic year; denominator is all retained tokens in that year'));
    const head=make('thead'),tr=make('tr');for(const h of ['Scope','Word / source posts','Occurrences','Per 1,000 tokens']){const th=make('th',h);th.scope='col';tr.append(th);}head.append(tr);table.append(head);
    const body=make('tbody');for(const group of groups)for(const row of group.words.slice(0,mode==='cloud'?60:5)){const line=make('tr');const scope=make('th',group.label);scope.scope='row';const word=make('td');word.append(sourceButton(group,row));line.append(scope,word,make('td',row.count.toLocaleString()),make('td',(1000*row.count/group.tokens).toFixed(2)));body.append(line);}table.append(body);get('wp-word-table').replaceChildren(table);
  }
  function render(){
    const group=year==='all'?evidence.all:evidence.years.find(g=>g.label===year);
    const groups=year==='all'?evidence.years:[group];
    get('wp-word-cloud').hidden=mode!=='cloud';get('wp-word-sun').hidden=mode!=='sun';
    get('wp-word-cloud-button').setAttribute('aria-pressed',String(mode==='cloud'));get('wp-word-sun-button').setAttribute('aria-pressed',String(mode==='sun'));
    get('wp-word-summary').textContent=`${group.label}: ${group.posts} analyzed posts · ${group.tokens.toLocaleString()} retained tokens · ${group.unique.toLocaleString()} distinct cleaned forms. `+(mode==='cloud'?'Up to 60 words shown.':'Sunburst displays only five words per year; exact counts below.');
    const cloud=get('wp-word-cloud');cloud.replaceChildren();
    if(mode==='cloud'){
      const max=group.words[0]?.count||1;
      for(const row of group.words){const b=sourceButton(group,row);b.style.fontSize=(.85+2.8*Math.sqrt(row.count/max))+'rem';b.title=`${row.word}: ${row.count} occurrences in ${row.ids.length} posts`;b.setAttribute('aria-label',b.title+'; inspect sources');cloud.append(b);}
      if(!group.words.length)cloud.append(make('p','No saved analyzed words in this academic year. This is not evidence of an absence of activity.'));
      countTable([group]);
    }else{sunburst(groups);countTable(groups);}
  }
  const select=get('wp-word-year');
  for(const [value,label] of [['all','Entire analyzed corpus · all years'],...evidence.years.map(g=>[g.label,g.label+' · '+g.posts+' analyzed posts'])]){const o=make('option',label);o.value=value;select.append(o);}
  select.addEventListener('change',()=>{year=select.value;get('wp-word-detail').textContent='Select a word to inspect source posts.';clearDetails();render();announce('Word views: '+(year==='all'?'entire analyzed corpus':year));});
  for(const [button,value]of[['wp-word-cloud-button','cloud'],['wp-word-sun-button','sun']])get(button).addEventListener('click',()=>{mode=value;render();announce(value==='cloud'?'Word cloud displayed':'Top-five sunburst displayed');});
  return {render};
}
