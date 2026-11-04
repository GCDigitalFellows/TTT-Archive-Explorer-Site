/* Stable public bookmarks, including supported routes from the former app.
 * Only view, post ID and design year are serialized during normal navigation.
 * Explicit inbound search/year/name filters may be read, never added silently.
 */
'use strict';
const ExplorerRoutes={
  parse(hash){
    const text=String(hash||'').replace(/^#/,''),p=new URLSearchParams(text);
    const legacy={overview:'home',index:'browse',random:'random',reading:'wisdom',themes:'analysis',topics:'analysis',language:'analysis',checks:'analysis',audit:'accounting',credits:'credits',history:'history',methods:'methods',reports:'reports'};
    let view=p.get('view')||'home';
    if(text.startsWith('reading-'))view='wisdom';
    if(text.startsWith('history-')||text.startsWith('work-'))view='history';
    if(text.startsWith('credits-')||text.startsWith('credited-person-'))view='credits';
    if(text==='roster-coverage')view='analysis';
    view=legacy[view]||view;
    if(!['home','browse','read','random','wisdom','analysis','about','design','accounting','credits','history','methods','reports'].includes(view))view='home';
    const post=p.get('post')||p.get('postId');
    return {view,post:post&&/^\d+$/.test(post)?post:null,era:p.get('design-year'),
      query:p.get('q')||'',year:p.get('year')||'all',author:p.get('author')||'all'};
  },
  hash(view,post,era){const p=new URLSearchParams();p.set('view',view);if(view==='read'&&post)p.set('post',post);if(Number(era)!==2026)p.set('design-year',String(era));return '#'+p.toString();},
  documents:{accounting:'ARCHIVE_COVERAGE.html',credits:'CREDITS_AND_PROCESS.html',history:'PROJECT_HISTORY.html',methods:'METHODS_AND_DATA.html',reports:'FOR_REPORTS.html'}
};
if(typeof module!=='undefined'&&module.exports)module.exports=ExplorerRoutes;
