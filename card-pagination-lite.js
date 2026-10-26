import { query,orderBy,documentId,startAfter,limit,getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-lite.js';
import { createCardPager } from './card-pagination.js?v=20261026-4';
export function createLiteCardPager(collection,deliver) {
  return createCardPager({
    container:'#notes',search:'#search',deliver,
    read:({all,after,take})=>{
      const clauses=[orderBy(documentId())];
      if(!all){if(after)clauses.push(startAfter(after));clauses.push(limit(take));}
      return getDocs(query(collection,...clauses));
    }
  });
}
