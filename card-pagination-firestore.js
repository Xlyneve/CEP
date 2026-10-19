import { query,orderBy,documentId,startAfter,limit,onSnapshot,getDocs,where } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { createCardPager } from './card-pagination.js?v=20261019-1';
const configs={
 'pn.html':{container:'#nurseNotesList'},
 'explain.html':{container:'#notesContainer'},
 'clinicalnotes.html':{container:'#notesList',field:'time',direction:'desc',pins:true},
 'info.html':{container:'#notesContainer'},
 'practicen.html':{container:'#notesContainer'},
 'recalls.html':{container:'#nurseNotesList'},
 'notes.html':{container:'#noteGrid',field:'date',direction:'desc'},
 'complete-vaccine-info.html':{container:'#vaccineCards',search:'#searchBox'}
};
let active,remembered;
export function onCardSnapshot(collection,callback,error) {
  active?.stop();
  const config=configs[location.pathname.split('/').pop().toLowerCase()];
  let pins=[], latest, stopPins;
  const build=({all,after,take})=>{
    const clauses=[orderBy(config.field || documentId(),config.direction || 'asc')];
    if(!all){if(after)clauses.push(startAfter(after));clauses.push(limit(take));}
    return query(collection,...clauses);
  };
  const publish=snapshot=>{latest=snapshot;callback({...snapshot,pinnedDocs:pins});};
  const pager=createCardPager({
    ...config,initialState:remembered,
    read:options=>getDocs(build(options)),
    listen:(options,next,fail)=>onSnapshot(build(options),next,fail),
    deliver:publish,onError:error,
    onStop:()=>stopPins?.()
  });
  active=pager;
  if(config.pins) stopPins=onSnapshot(query(collection,where('pinned','==',true)),snapshot=>{
    pins=snapshot.docs;if(latest)publish(latest);
  },error=>console.error('Pinned notes:',error));
  return ()=>{remembered=pager.state;pager.stop();if(active===pager)active=null;};
}
