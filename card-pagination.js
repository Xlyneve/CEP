// Cursor pagination shared by the card pages. One extra record identifies the last page.
export function createCardPager({read, listen, deliver, container, search = '#searchInput', pageSize = 20, onError, onStop, initialState, cacheSearch = false, searchDelay = 180} = {}) {
  const host = typeof container === 'string' ? document.querySelector(container) : container;
  if (!host) throw new Error('Card pagination container is missing.');
  const input = document.querySelector(search);
  if (!document.getElementById('cep-card-pagination-style')) {
    const style = document.createElement('style'); style.id = 'cep-card-pagination-style';
    style.textContent = `
      .cep-card-pagination { display:flex;flex:0 0 auto;align-items:center;justify-content:center;gap:12px;margin:8px auto 14px;color:var(--theme-ink,inherit);font:13px/1.3 Tahoma,sans-serif; }
      html:root:root body .cep-card-pagination button { display:grid;place-items:center;width:30px;height:30px;min-width:30px;padding:0;margin:0;border:0;border-radius:50%;font:24px/1 Tahoma,sans-serif;color:inherit;background:transparent;box-shadow:none;cursor:pointer; }
      html:root:root body .cep-card-pagination button:disabled { opacity:.25;cursor:default; }
      html:root:root:root:root:root:root:root:root body .cep-card-pagination,
      html:root:root:root:root:root:root:root:root body .cep-card-pagination .cep-card-page-number,
      html:root:root:root:root:root:root:root:root body .cep-card-pagination button,
      html:root:root:root:root:root:root:root:root body .cep-card-pagination button:is(:hover,:active,:focus,:disabled) {
        background:none !important;border:0 !important;border-radius:0 !important;
        box-shadow:none !important;text-shadow:none !important;filter:none !important;
        backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
        appearance:none !important;-webkit-appearance:none !important;
      }
      html:root:root:root:root:root:root:root:root body .cep-card-pagination button::before,
      html:root:root:root:root:root:root:root:root body .cep-card-pagination button::after { content:none !important;display:none !important; }
      .cep-card-pagination button:focus-visible { outline:2px solid currentColor;outline-offset:2px; }
      .cep-card-page-number { text-align:center;min-width:20px;font-weight:700; }
      .cep-card-page-number small { display:block;font-size:9px;font-weight:400;opacity:.65; }
      .cep-card-pagination[hidden] { display:none; }
      .cep-card-page-status { font:11px Tahoma,sans-serif; }
    `; document.head.append(style);
  }
  const nav=document.createElement('nav'); nav.className='cep-card-pagination'; nav.setAttribute('aria-label','Card pages');
  const previous=document.createElement('button'); previous.type='button';previous.textContent='‹';previous.setAttribute('aria-label','Previous page');
  const number=document.createElement('span');number.className='cep-card-page-number';number.setAttribute('aria-live','polite');
  const next=document.createElement('button');next.type='button';next.textContent='›';next.setAttribute('aria-label','Next page');
  const status=document.createElement('span');status.className='cep-card-page-status';status.setAttribute('role','status');status.hidden=true;
  nav.append(previous,number,next,status);host.after(nav);
  let page=initialState?.page || 0, anchors=initialState?.anchors || [null], pages=new Map(), mode='browse', more=false, busy=false, stopped=false, sequence=0, unsubscribe=null, timer, latest=null;
  let searchCache=null;
  let committedPage=page;
  let resolveReady;const waiters=[];
  const ready=new Promise(resolve=>resolveReady=resolve);
  const snapshot = docs => ({docs,size:docs.length,empty:!docs.length,forEach:callback=>docs.forEach(callback)});
  function controls() {
    nav.hidden=mode==='search';
    previous.disabled=busy || page===0;
    next.disabled=busy || !more;
    number.hidden=false;
    number.replaceChildren(document.createTextNode(String(page+1)));
    const last=!!latest&&!busy&&!more;
    number.setAttribute('aria-label','Page '+(page+1)+(last?', last page':''));
    if(last){const label=document.createElement('small');label.textContent='last';number.append(label);}
    next.title=last?'Last page':'Next page';previous.title='Previous page';
    host.setAttribute('aria-busy',String(busy));
  }
  function report(error) {
    const failedPage=page;
    if(latest&&mode==='browse')page=committedPage;
    busy=false;controls();nav.hidden=false;
    if(mode==='search'){number.hidden=true;previous.disabled=true;next.disabled=true;}
    status.hidden=false;status.textContent='Could not load. ';
    const retry=document.createElement('button');retry.type='button';retry.textContent='↻';retry.setAttribute('aria-label','Retry loading cards');
    retry.onclick=()=>{page=failedPage;subscribe();};status.append(retry);
    resolveReady(null);waiters.splice(0).forEach(waiter=>waiter.reject(error));
    console.error('Card pagination:',error);onError?.(error);
  }
  function receive(raw, ticket, scroll) {
    if(stopped||ticket!==sequence)return;
    if(cacheSearch && mode==='search')searchCache=raw;
    const docs=raw.docs || [];
    if(mode==='browse' && !docs.length && page>0){page--;anchors=anchors.slice(0,page+2);subscribe(scroll);return;}
    busy=false;
    let visible=docs;
    if(mode==='browse'){
      visible=docs.slice(0,pageSize);more=docs.length>pageSize;
      pages.set(page,visible);
      // Later cursors are invalid if a live update moved this boundary.
      const boundary=visible.at(-1);
      if(anchors[page+1]?.id!==boundary?.id){
        anchors=anchors.slice(0,page+1);
        for(const key of pages.keys())if(key>page)pages.delete(key);
      }
      anchors[page+1]=boundary || null;
    }
    committedPage=page;latest=snapshot(visible);controls();status.hidden=true;
    deliver(latest);
    resolveReady(latest);waiters.splice(0).forEach(waiter=>waiter.resolve(latest));
    if(scroll) requestAnimationFrame(()=>host.scrollIntoView({block:'start',behavior:'auto'}));
  }
  function subscribe(scroll=false) {
    if(stopped)return;
    unsubscribe?.();unsubscribe=null;
    const ticket=++sequence;
    busy=true;status.hidden=true;controls();
    const options={all:mode==='search',after:anchors[page] || null,take:pageSize+1};
    // Reuse this page session's full search snapshot while the normal listener refreshes it.
    if(cacheSearch && mode==='search' && searchCache){
      latest=snapshot(searchCache.docs || []);deliver(latest);
    }
    const accept=raw=>receive(raw,ticket,scroll);
    const fail=error=>{if(!stopped&&ticket===sequence)report(error);};
    if(listen) unsubscribe=listen(options,accept,fail);
    else Promise.resolve().then(()=>read(options)).then(accept,fail);
  }
  function editing() {
    return [...document.querySelectorAll('dialog[open],.cep-note-overlay,.pn-edit-overlay,.note-card.is-editing,.note-card.editing,.note-card.editing-note,.note-card [contenteditable="true"],.vaccine-card #edit-notes')]
      .some(element=>element.getClientRects().length);
  }
  function go(delta) {
    if(busy || (delta<0&&page===0) || (delta>0&&!more))return;
    if(editing()){status.textContent='Finish editing first';status.hidden=false;return;}
    page+=delta;subscribe(true);
  }
  previous.onclick=()=>go(-1);next.onclick=()=>go(1);
  function searchChanged() {
    clearTimeout(timer);
    timer=setTimeout(()=>{
      if(stopped)return;
      const desired=input?.value.trim()?'search':'browse';
      if(desired!==mode){mode=desired;subscribe();}
    },searchDelay);
  }
  input?.addEventListener('input',searchChanged,true);
  function refresh() {
    searchCache=null;pages.clear();mode=input?.value.trim()?'search':'browse';
    return new Promise((resolve,reject)=>{waiters.push({resolve,reject});subscribe();});
  }
  async function reveal(id) {
    if(stopped)return false;
    const ticket=++sequence;unsubscribe?.();unsubscribe=null;busy=true;controls();
    try {
      // An explicit "View note" may target any page; discover its cursor only on demand.
      const all=await read({all:true});
      if(stopped||ticket!==sequence)return false;
      const index=all.docs.findIndex(doc=>doc.id===id);
      if(index<0){subscribe();return false;}
      page=Math.floor(index/pageSize);anchors=[null];
      for(let offset=pageSize;offset<=page*pageSize;offset+=pageSize)anchors.push(all.docs[offset-1]);
      if(input){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));}
      mode='browse';subscribe(true);return true;
    } catch(error){if(ticket===sequence)report(error);return false;}
  }
  function stop() {stopped=true;waiters.splice(0).forEach(waiter=>waiter.resolve(null));++sequence;unsubscribe?.();clearTimeout(timer);input?.removeEventListener('input',searchChanged,true);nav.remove();onStop?.();}
  const api={ready,refresh,reveal,stop,get snapshot(){return latest;},get page(){return page+1;},get state(){return {page,anchors:[...anchors]};}};
  window.CEPCardPager=api;
  const params=new URLSearchParams(location.hash.replace(/^#/,''));
  if(input && !input.value && params.get('cepSearch'))input.value=params.get('cepSearch');
  mode=input?.value.trim()?'search':'browse';
  if(params.get('cepId'))reveal(params.get('cepId'));else subscribe();
  return api;
}
