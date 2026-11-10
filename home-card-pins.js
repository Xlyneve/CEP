/* Actual note cards pinned as movable Home widgets. Source notes remain authoritative. */
(() => {
  'use strict';
  if (window.CEPHomeCardPins) return;
  const mainProject='cepx-f9d2a';
  const sources={
    'pn.html':['PN.html','PN','nurseNotes'], 'clinicalnotes.html':['Clinicalnotes.html','Clinical Notes','clinicalNotes','notes-bcba6'],
    'chatgptx.html':['chatgptx.html','Xgpt Notes','notes','notes-chat-c5ff3'],
    'info.html':['info.html','Info','informationNotes'], 'explain.html':['explain.html','Explain','explainNotes'],
    'practicen.html':['practiceN.html','Practice Notes','practiceNNotes'], 'notes.html':['Notes.html','Nurse Notes','notebookNotes'],
    'recalls.html':['recalls.html','Recall','recallNotes'], 'ecg.html':['ECG.html','ECG','ecgNotes'],
    'urgent_care.html':['Urgent_Care.html','Urgent Care','urgentCareNotes'], 'face.html':['face.html','Urgent Care — Head','faceNotes'],
    'hand.html':['Hand.html','Urgent Care — Hand & Wrist','handNotes'], 'sha.html':['Sha.html','Urgent Care — Shoulder & Elbow','upperArmNotes'],
    'abdo.html':['Abdo.html','Urgent Care — Thorax & Abdomen','abdominisNotes'], 'spine.html':['Spine.html','Urgent Care — Back & Spine','spineNotes'],
    'lf.html':['LF.html','Urgent Care — Lower Limb & Foot','footlegNotes'], 'forms.html':['forms.html','Information Links','urlForms']
  };
  const secondaryApps={
    'notes-bcba6':{name:'clinical-notes',config:{apiKey:'AIzaSyDcM4E3wFhjUwZBYbnZoi1AAQtMe7TzNL8',authDomain:'notes-bcba6.firebaseapp.com',projectId:'notes-bcba6',appId:'1:101524739050:web:7e5fe1c8fa224d69909893'}},
    'notes-chat-c5ff3':{name:'notes-chat',config:{apiKey:'AIzaSyDtv3x9PAMzZUW6yVuUSLgLzA0ejcDidF4',authDomain:'notes-chat-c5ff3.firebaseapp.com',projectId:'notes-chat-c5ff3',appId:'1:597780727252:web:8407eb4096dbe301d74241'}}
  };
  const page=(location.pathname.split('/').pop()||'').toLowerCase(), home=page==='home.html';
  if (!home && !sources[page]) return;
  const cacheKey='cep-home-card-pins:v1', layoutKey='cep-home-card-pin-layout:v1';
  const selector='.cep-search-source,.note-card[data-id],.note-tile[data-id],.chatBubble[data-home-pin-id],.file-item[data-id]';
  const widgets=new Map(), sourceWatches=new Map(), authWatches=new Map();
  let pins=new Map(), readyStore, layer=9000, renderQueued=false, homeUnsubscribe, homeActive=false, lifecycle=0;
  try { pins=new Map(JSON.parse(localStorage.getItem(cacheKey)||'[]').map(pin=>[pin.key,pin])); } catch {}
  const icon='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 3 6 6-4 1-3 5-2 1-4-4 1-2 5-3Z"/><path d="m9 15-6 6"/></svg>';
  function message(text) {
    let status=document.getElementById('cep-home-pin-status');
    if(!status){status=document.createElement('div');status.id='cep-home-pin-status';status.setAttribute('role','status');document.body.append(status);}
    status.textContent=text;clearTimeout(message.timer);message.timer=setTimeout(()=>status.remove(),3000);
  }
  let cacheTimer;
  function changed(immediate=false) {
    clearTimeout(cacheTimer);
    const persist=()=>{try{localStorage.setItem(cacheKey,JSON.stringify([...pins.values()]));}catch{}};
    if(immediate)persist();else cacheTimer=setTimeout(persist,120);
    updateButtons();if(home)queueRender();
  }
  async function store() {
    if (!readyStore) readyStore=(async()=>{
      if(!window.CEP_AUTH_READY)throw Error('Sign in before pinning a card.');
      await window.CEP_AUTH_READY;
      const [apps,fs,auth]=await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js')
      ]);
      const app=apps.getApps().find(app=>app.options.projectId===mainProject);
      if(!app || !auth.getAuth(app).currentUser)throw Error('Sign in before pinning a card.');
      return {apps,fs,auth,db:fs.getFirestore(app)};
    })().catch(error=>{readyStore=null;throw error;});
    return readyStore;
  }
  const keyFor=(file,id)=>file.toLowerCase()+'_'+encodeURIComponent(id);
  function cleanHtml(html) {
    if(!window.CEPSecurity?.sanitizeHTML)throw Error('The note formatting helper is still loading. Try again.');
    return window.CEPSecurity.sanitizeHTML(html);
  }
  function identify(card) {
    if(card.closest('.cep-home-pin,.cep-note-popup,.pn-edit-popup,#cep-home-pin-status'))return null;
    const file=card.dataset.sourceFile?.toLowerCase()||page;
    const source=sources[file];if(!source)return null;
    let id=card.dataset.id||card.dataset.homePinId;
    if(!id && card.matches('a[href]')) {
      try {id=new URLSearchParams(new URL(card.href).hash.slice(1)).get('cepId');}catch{}
    }
    return id ? {file:source[0],id,key:keyFor(source[0],id),source} : null;
  }
  function snapshot(card, identity) {
    // Search cards retain their original record, avoiding compact preview sizes
    // and temporary search-match highlights in the pinned note.
    const original=card.__cepSourceEntry;
    if(original?.record?.data){
      const data={...original.record.data};
      for(const key of ['time','timestamp','createdAt','updatedAt'])if(typeof data[key]?.toDate==='function')data[key]=data[key].toDate().toISOString();
      const html=String(data.content??data.note??data.text??original.richHtml??'');
      const text=identity.file.toLowerCase()==='notes.html'?html:plainHtml(html);
      return {...original,file:identity.file,id:identity.id,sourceTitle:identity.source[1],text,displayText:text,richHtml:html,record:{id:identity.id,data}};
    }
    const title=card.querySelector('.note-title,.cep-source-title,.cep-source-note-title,.universal-search-native-title,strong');
    const body=card.querySelector('.note-content,.note-text,.note-display,.cep-source-content,.cep-source-text,.cep-source-note-content,.cep-source-note-text,.cep-xgpt-rich-content,.xgpt-rich-snippet')||card;
    const clone=body.cloneNode(true);
    clone.querySelectorAll('.cep-home-pin-button,.note-actions,.note-card-controls,.card-controls,.btn-group,.note-icon-actions,.timestamp,button,input,textarea,select,script,style').forEach(node=>node.remove());
    clone.querySelectorAll('mark.cep-search-match,mark.underlineMatch').forEach(mark=>mark.replaceWith(...mark.childNodes));
    clone.querySelectorAll('[contenteditable]').forEach(node=>node.removeAttribute('contenteditable'));
    const html=cleanHtml(clone.innerHTML), text=body.innerText||clone.textContent||'';
    const image=[...card.querySelectorAll('img')].find(img=>!img.closest('.note-actions,.note-icon-actions'))?.src||'';
    const url=card.dataset.homePinUrl||card.querySelector('.note-url a[href],.cep-source-url a[href],.view-mode>a[href]')?.href||'';
    const label=title?.textContent.trim()||text.trim().split('\n')[0].slice(0,100)||'Pinned note';
    const kind=identity.file.toLowerCase();
    const data={title:label,image:html.includes(image)&&image?'':image,url};
    if(kind==='chatgptx.html')data.content=html;
    else if(['notes.html','info.html','explain.html','practicen.html'].includes(kind))data.text=kind==='notes.html'?text:html;
    else data.note=html;
    if(identity.file.toLowerCase()==='forms.html'){data.note=card.querySelector('.view-mode em')?.textContent||'';data.openExternally=card.dataset.formExternal==='true';}
    return {file:identity.file,id:identity.id,sourceTitle:identity.source[1],title:label,text,displayText:text,richHtml:html,record:{id:identity.id,data}};
  }
  async function pin(card,identity) {
    const entry=snapshot(card,identity), previous=pins.get(identity.key);
    const value={key:identity.key,file:identity.file,sourceId:identity.id,collection:identity.source[2],project:identity.source[3]||mainProject,
      pinnedAt:previous?.pinnedAt||Date.now(),entry};
    const {db,fs}=await store();
    await fs.setDoc(fs.doc(db,'homePinnedCards',identity.key),JSON.parse(JSON.stringify(value)));
    pins.set(value.key,value);changed(true);message('Pinned to Home');
  }
  async function unpin(key) {
    const {db,fs}=await store();await fs.deleteDoc(fs.doc(db,'homePinnedCards',key));pins.delete(key);changed(true);message('Removed from Home');
  }
  function updateButton(button) {
      const active=pins.has(button.dataset.pinKey);button.classList.toggle('is-pinned',active);
      button.title=active?'Unpin from Home':'Pin to Home';button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',String(active));
      const label=button.querySelector('.cep-home-pin-label');if(label)label.textContent=button.title;
  }
  function updateButtons(){document.querySelectorAll('.cep-home-pin-button').forEach(updateButton);}
  function attach(card) {
    if(card.querySelector('.cep-home-pin-button') || card.matches('.editing-note,.is-editing') || card.closest('[contenteditable="true"]'))return;
    const identity=identify(card);if(!identity)return;
    const button=document.createElement('button');button.type='button';button.className='cep-home-pin-button';
    button.dataset.pinKey=identity.key;button.innerHTML=icon;
    const actions=card.querySelector('.note-actions,.btn-group,.card-actions,.card-buttons,.card-controls')
      || (card.matches('.chatBubble')?card.parentElement.querySelector('.note-icon-actions'):null);
    if(actions){button.classList.add('cep-home-pin-in-menu');const label=document.createElement('span');label.className='cep-home-pin-label';button.append(label);actions.append(button);}
    else {const surface=card.querySelector(':scope > .cep-source-surface,:scope > .cep-source-chat,:scope > .cep-source-form')||card;surface.dataset.homePinAvailable='true';surface.append(button);}
    button.addEventListener('cep-pin-click',async event=>{
      event.preventDefault();event.stopPropagation();button.disabled=true;
      try {if(pins.has(identity.key))await unpin(identity.key);else await pin(card,identity);}
      catch(error){message('Could not save the Home pin: '+error.message);}
      finally{button.disabled=false;}
    });
    // Prevent source-card copy/navigation handlers from receiving pin clicks.
    button.addEventListener('pointerdown',event=>event.stopPropagation());
    updateButton(button);
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('.cep-home-pin-button');
    if(!button)return;event.preventDefault();event.stopImmediatePropagation();
    // Invoke the button handler after stopping ancestor capture-copy listeners.
    if(!button.disabled)button.dispatchEvent(new CustomEvent('cep-pin-click'));
  },true);
  // Dedicated event avoids re-dispatching a DOM click to copyable cards.
  function scan(root) {
    const cards=[];if(root.nodeType===1&&root.matches(selector))cards.push(root);
    root.querySelectorAll?.(selector).forEach(card=>cards.push(card));
    for(const card of cards)attach(card);
  }
  const bounds=widget=>({left:widget.offsetLeft,top:widget.offsetTop,width:widget.offsetWidth,height:widget.offsetHeight});
  function viewState(widget){return widget._view||(widget._view={minimized:false,expanded:false,compact:null,beforeMinimize:null});}
  function updateViewControls(widget){
    const view=viewState(widget),tableOnly=widget.classList.contains('cep-home-pin-table-only');
    widget.classList.toggle('is-minimized',view.minimized);widget.classList.toggle('is-expanded',view.expanded&&!view.minimized);
    const min=widget.querySelector('.cep-home-pin-minimize'),expand=widget.querySelector('.cep-home-pin-expand');
    if(min){min.textContent=view.minimized?'+':'−';min.title=view.minimized?'Restore pinned note':'Minimise pinned note';min.setAttribute('aria-label',min.title);min.setAttribute('aria-expanded',String(!view.minimized));}
    if(expand){expand.hidden=!tableOnly;expand.textContent=view.expanded&&!view.minimized?'⤡':'⤢';expand.title=view.expanded&&!view.minimized?'Restore compact table':'View full table';expand.setAttribute('aria-label',expand.title);expand.setAttribute('aria-pressed',String(view.expanded&&!view.minimized));}
    const grip=widget.querySelector('.cep-home-pin-handle>span');if(grip)grip.textContent=view.minimized?(widget._pinTitle||'Pinned note'):'⠿';
  }
  function setBounds(widget,value){
    const minHeight=viewState(widget).minimized?32:110;
    const width=Math.min(Math.max(value.width||310,220),innerWidth-8),height=Math.min(Math.max(value.height||230,minHeight),innerHeight-8);
    Object.assign(widget.style,{width:width+'px',height:height+'px',left:Math.max(0,Math.min(value.left||0,innerWidth-width))+'px',top:Math.max(0,Math.min(value.top||0,innerHeight-height))+'px'});
  }
  function fitCompactTable(widget){
    const stage=widget.querySelector('.cep-home-pin-table-stage'),scroll=stage?.parentElement;
    if(!stage||viewState(widget).minimized)return;
    stage.style.zoom='1';
    if(viewState(widget).expanded)return;
    // Keep the original text and column sizes; only grow the height.
    widget.style.height=Math.max(110,Math.ceil(stage.scrollHeight)+52)+'px';
  }
  function fitFullTable(widget,key,persist=true){
    if(!widget.isConnected||viewState(widget).minimized)return;
    const stage=widget.querySelector('.cep-home-pin-table-stage');if(!stage)return;
    stage.style.zoom='1';
    const width=Math.min(innerWidth-16,Math.max(220,Math.ceil(stage.scrollWidth)+2));
    const height=Math.min(innerHeight-16,Math.max(110,Math.ceil(stage.scrollHeight)+52));
    setBounds(widget,{...bounds(widget),width,height});
    if(persist)saveLayout(key,widget);
  }
  function toggleFullTable(widget,key){
    const view=viewState(widget),wasMinimized=view.minimized;
    if(view.expanded&&!wasMinimized){view.expanded=false;setBounds(widget,view.compact||bounds(widget));}
    else{
      if(!view.expanded&&!wasMinimized)view.compact=bounds(widget);
      view.minimized=false;view.expanded=true;updateViewControls(widget);fitFullTable(widget,key,false);
    }
    updateViewControls(widget);fitCompactTable(widget);saveLayout(key,widget);
  }
  function toggleMinimized(widget,key){
    const view=viewState(widget);
    if(view.minimized){
      view.minimized=false;view.expanded=!!view.beforeMinimize?.expanded;updateViewControls(widget);
      setBounds(widget,view.beforeMinimize||view.compact||bounds(widget));
      if(view.expanded)fitFullTable(widget,key,false);
    }else{
      view.beforeMinimize={...bounds(widget),expanded:view.expanded};if(!view.expanded)view.compact=bounds(widget);
      view.minimized=true;updateViewControls(widget);setBounds(widget,{...bounds(widget),width:view.compact?.width||310,height:32});
    }
    updateViewControls(widget);fitCompactTable(widget);saveLayout(key,widget);
  }
  function startManualResize(widget){
    const view=viewState(widget);if(view.minimized)return false;
    view.expanded=false;updateViewControls(widget);return true;
  }
  function layout() {try{return JSON.parse(localStorage.getItem(layoutKey)||'{}');}catch{return {};}}
  const device=()=>innerWidth<=760?'mobile':'desktop';
  function saveLayout(key,widget) {
    if(!widget.isConnected)return;
    const view=viewState(widget);if(!view.minimized&&!view.expanded)view.compact=bounds(widget);
    const all=layout();all[device()+':'+key]={...bounds(widget),view};
    try{localStorage.setItem(layoutKey,JSON.stringify(all));}catch{}
  }
  function place(widget, saved, index) {
    const current=viewState(widget),stored=saved?.view;
    if(stored)widget._view={...current,...stored};
    const initial={left:saved?.left??(innerWidth-326-index*18),top:saved?.top??(Math.min(380,innerHeight*.48)+index*24),width:saved?.width||310,height:saved?.height||230};
    updateViewControls(widget);setBounds(widget,initial);
    if(!viewState(widget).compact)viewState(widget).compact=bounds(widget);
  }

  function drag(widget,handle,key) {
    handle.addEventListener('pointerdown',event=>{
      if(event.button!==0 || event.target.closest('button,a'))return;
      event.preventDefault();widget.style.zIndex=String(++layer);
      const start={x:event.clientX,y:event.clientY,left:widget.offsetLeft,top:widget.offsetTop};handle.setPointerCapture(event.pointerId);
      const move=e=>{widget.style.left=Math.max(0,Math.min(start.left+e.clientX-start.x,innerWidth-widget.offsetWidth))+'px';widget.style.top=Math.max(0,Math.min(start.top+e.clientY-start.y,innerHeight-widget.offsetHeight))+'px';};
      const stop=()=>{handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',stop);handle.removeEventListener('pointercancel',stop);saveLayout(key,widget);};
      handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',stop);handle.addEventListener('pointercancel',stop);
    });
  }
  function canRender(){return window.renderSourceSearchCard && window.applySourceSearchSkin && window.installSearchCardInteractions;}
  function plainHtml(html) {
    const root=document.createElement('div');window.CEPSecurity.setHTML(root,html);
    const blocks=new Set(['DIV','P','LI','TR','H1','H2','H3','H4','H5','H6','BLOCKQUOTE','PRE']);
    function read(parent){let text='';for(const node of parent.childNodes){
      if(node.nodeType===3){text+=node.nodeValue;continue;}
      if(node.nodeType!==1||node.matches('script,style,button,input,textarea,select'))continue;
      if(node.tagName==='BR'){text+='\n';continue;}
      const block=blocks.has(node.tagName);if(block&&text&&!text.endsWith('\n'))text+='\n';
      if(node.matches('td,th')&&text&&!text.endsWith('\n'))text+='\t';
      const value=read(node);text+=value;if(block&&(!value||!text.endsWith('\n')))text+='\n';
    }return text;}return read(root).replace(/^\n+|\n+$/g,'');
  }
  function entryFromData(pin,data) {
    const html=String(data.content??data.note??data.text??'');const title=String(data.title||pin.entry.title||'Pinned note');
    const text=pin.file.toLowerCase()==='notes.html'?html:plainHtml(html);
    return {...pin.entry,title,richHtml:html,text,displayText:text,
      record:{id:pin.sourceId,data}};
  }
  function withoutPreviewTools(html) {
    if(typeof html!=='string'||(!html.includes('data-cep-search-table-zoom')&&!html.includes('cep-table-preview-footer')))return html;
    const clone=document.createElement('div');window.CEPSecurity.setHTML(clone,html);
    clone.querySelectorAll('.cep-table-preview-footer').forEach(footer=>footer.remove());
    clone.querySelectorAll('table').forEach(table=>delete table.dataset.cepSearchTableZoom);
    return clone.innerHTML;
  }
  function tableOnly(entry){
    const data=entry.record?.data||{};
    const html=String(data.content??data.note??data.text??entry.richHtml??'');
    if(data.url || (data.image&&!html.includes(data.image)))return false;
    const clone=document.createElement('div');window.CEPSecurity.setHTML(clone,html);
    const tables=[...clone.querySelectorAll('table')].filter(table=>!table.parentElement.closest('table'));
    if(!tables.length)return false;tables.forEach(table=>table.remove());
    clone.querySelectorAll('.cep-table-preview-footer').forEach(node=>node.remove());
    return !clone.textContent.replace(/[\s\u00a0\u200b]+/g,'')&&!clone.querySelector('img,video,audio,iframe,hr,a[href]');
  }
  function paint(widget,pin) {
    const content=widget.querySelector('.cep-home-pin-content');content.replaceChildren();
    const card=document.createElement('div');card.className='cep-home-pin-card';
    const entry={...pin.entry,richHtml:withoutPreviewTools(pin.entry.richHtml),record:{...pin.entry.record,data:{...pin.entry.record?.data}}};
    for(const field of ['note','content','text'])if(!(field==='text'&&entry.file.toLowerCase()==='notes.html'))entry.record.data[field]=withoutPreviewTools(entry.record.data[field]);
    widget.setAttribute('aria-label','Pinned note: '+entry.title);widget._pinTitle=entry.title;
    const bareTable=!pin.missing&&tableOnly(entry);widget.classList.toggle('cep-home-pin-table-only',bareTable);
    widget.style.position=bareTable?'absolute':'';widget.style.maxHeight=bareTable?'none':'';
    if(!bareTable&&viewState(widget).beforeMinimize)viewState(widget).beforeMinimize.expanded=false;
    if(!bareTable&&viewState(widget).expanded){viewState(widget).expanded=false;if(!viewState(widget).minimized)setBounds(widget,viewState(widget).compact||bounds(widget));}
    updateViewControls(widget);
    if(pin.missing){const missing=document.createElement('p');missing.className='cep-home-pin-missing';missing.textContent='The original note was deleted. You can unpin this card.';content.append(missing);widget.style.setProperty('--cep-pin-ink',getComputedStyle(missing).color);return;}
    if(entry.file.toLowerCase()==='chatgptx.html') {
      const body=document.createElement('div');body.className='cep-xgpt-rich-content';
      if(window.renderXgptSearchRichContent)window.renderXgptSearchRichContent(body,entry.richHtml,[]);
      else window.CEPSecurity.setHTML(body,entry.richHtml);
      card.append(body);
    } else if(!window.renderSourceSearchCard(card,entry,[]))window.CEPSecurity.setHTML(card,entry.richHtml);
    if(bareTable){
      const scroll=document.createElement('div');scroll.className='cep-home-pin-table-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label',entry.title+' — scroll to view all rows and columns');
      const stage=document.createElement('div');stage.className='cep-home-pin-table-stage';
      // Use the complete saved body, never the shortened search preview.
      const original=document.createElement('div');const data=entry.record?.data||{};
      window.CEPSecurity.setHTML(original,String(data.content??data.note??data.text??entry.richHtml??''));
      const tables=[...original.querySelectorAll('table')].filter(table=>!table.parentElement.closest('table'));
      for(const table of tables){
        // Cloning removes table-click zoom handlers so text stays selectable here.
        const clone=table.cloneNode(true);clone.querySelectorAll('.cep-table-preview-footer').forEach(node=>node.remove());
        for(const item of [clone,...clone.querySelectorAll('table')]){delete item.dataset.cepSearchTableZoom;item.removeAttribute('tabindex');if(item.getAttribute('aria-label')==='Open enlarged table')item.removeAttribute('aria-label');}
        clone.querySelectorAll('img').forEach(image=>window.enableSearchImageZoom?.(image));stage.append(clone);
      }
      scroll.append(stage);content.append(scroll);widget.style.setProperty('--cep-pin-ink','var(--theme-ink,#39353a)');
      stage.addEventListener('load',()=>{if(viewState(widget).expanded)fitFullTable(widget,pin.key);else fitCompactTable(widget);},true);
      const view=viewState(widget);
      if(!view.naturalTableRows){
        view.naturalTableRows=true;view.expanded=false;
        if(view.beforeMinimize)view.beforeMinimize.expanded=false;
        updateViewControls(widget);
        if(!view.minimized)setBounds(widget,view.compact||{...bounds(widget),width:310,height:230});
      }
      if(view.expanded&&!view.minimized)fitFullTable(widget,pin.key,false);
      else fitCompactTable(widget);
      saveLayout(pin.key,widget);
      return;
    }
    window.applySourceSearchSkin(card,entry);
    window.installSearchCardInteractions(card,{copyText:entry.displayText||entry.text,copyHtml:window.getSearchCopyHtml?.(entry)||entry.richHtml});
    content.append(card);widget.setAttribute('aria-label','Pinned note: '+entry.title);
    const surface=card.querySelector('.cep-source-surface,.cep-source-chat,.cep-source-form')||card;
    widget.style.setProperty('--cep-pin-ink',getComputedStyle(surface).color);
  }
  function render() {
    renderQueued=false;if(!home||!canRender())return;
    for(const [key,widget]of widgets)if(!pins.has(key)){widget._resize?.disconnect();widget.remove();widgets.delete(key);}
    const ordered=[...pins.values()].sort((a,b)=>a.pinnedAt-b.pinnedAt);
    ordered.forEach((pin,index)=>{
      let widget=widgets.get(pin.key);
      if(!widget){
        widget=document.createElement('section');widget.className='cep-home-pin';widget.dataset.pinKey=pin.key;widget.style.zIndex=String(++layer);
        const handle=document.createElement('div');handle.className='cep-home-pin-handle';handle.title='Drag to move this card';handle.tabIndex=0;handle.setAttribute('aria-label','Move pinned note. Use arrow keys to move.');
        const grip=document.createElement('span');grip.textContent='⠿';grip.setAttribute('aria-hidden','true');handle.append(grip);
        const open=document.createElement('a');open.textContent='↗';open.title='Open original note';open.setAttribute('aria-label','Open original note');
        const url=new URL(pin.file,location.href);url.hash=new URLSearchParams({cepId:pin.sourceId}).toString();open.href=url.href;handle.append(open);
        const minimize=document.createElement('button');minimize.type='button';minimize.className='cep-home-pin-minimize';minimize.onclick=()=>toggleMinimized(widget,pin.key);handle.append(minimize);
        const expand=document.createElement('button');expand.type='button';expand.className='cep-home-pin-expand';expand.hidden=true;expand.onclick=()=>toggleFullTable(widget,pin.key);handle.append(expand);
        const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.title='Unpin from Home';remove.setAttribute('aria-label','Unpin from Home');
        remove.onclick=async()=>{remove.disabled=true;try{await unpin(pin.key);}catch(error){message(error.message);remove.disabled=false;}};handle.append(remove);
        const content=document.createElement('div');content.className='cep-home-pin-content';widget.append(content,handle);
        const resize=document.createElement('button');resize.type='button';resize.className='cep-home-pin-resize';resize.setAttribute('aria-label','Resize pinned note');resize.title='Drag to resize';resize.textContent='◢';widget.append(resize);
        resize.addEventListener('pointerdown',event=>{
          if(event.button!==0||!startManualResize(widget))return;event.preventDefault();event.stopPropagation();resize.setPointerCapture(event.pointerId);
          const start={x:event.clientX,y:event.clientY,width:widget.offsetWidth,height:widget.offsetHeight};
          const move=e=>{widget.style.width=Math.min(innerWidth-widget.offsetLeft,Math.max(220,start.width+e.clientX-start.x))+'px';widget.style.height=Math.min(innerHeight-widget.offsetTop,Math.max(110,start.height+e.clientY-start.y))+'px';};
          const stop=()=>{resize.removeEventListener('pointermove',move);resize.removeEventListener('pointerup',stop);resize.removeEventListener('pointercancel',stop);saveLayout(pin.key,widget);};
          resize.addEventListener('pointermove',move);resize.addEventListener('pointerup',stop);resize.addEventListener('pointercancel',stop);
        });
        handle.addEventListener('keydown',event=>{
          if(event.target!==handle||!event.key.startsWith('Arrow'))return;event.preventDefault();
          const step=event.shiftKey?30:10;
          widget.style.left=Math.max(0,Math.min(widget.offsetLeft+(event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0),innerWidth-widget.offsetWidth))+'px';
          widget.style.top=Math.max(0,Math.min(widget.offsetTop+(event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0),innerHeight-widget.offsetHeight))+'px';saveLayout(pin.key,widget);
        });
        resize.addEventListener('keydown',event=>{
          if(!event.key.startsWith('Arrow')||!startManualResize(widget))return;event.preventDefault();
          widget.style.width=Math.min(innerWidth-widget.offsetLeft,Math.max(220,widget.offsetWidth+(event.key==='ArrowRight'?10:event.key==='ArrowLeft'?-10:0)))+'px';
          widget.style.height=Math.min(innerHeight-widget.offsetTop,Math.max(110,widget.offsetHeight+(event.key==='ArrowDown'?10:event.key==='ArrowUp'?-10:0)))+'px';saveLayout(pin.key,widget);
        });
        document.body.append(widget);
        place(widget,layout()[device()+':'+pin.key],index);drag(widget,handle,pin.key);widgets.set(pin.key,widget);
        let timer;widget._resize=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{fitCompactTable(widget);saveLayout(pin.key,widget);},180);});widget._resize.observe(widget);
        widget.addEventListener('pointerdown',()=>widget.style.zIndex=String(++layer),{passive:true});
      }
      if(widget._entry!==pin.entry){paint(widget,pin);widget._entry=pin.entry;}
    });
  }
  function queueRender(){if(!renderQueued){renderQueued=true;requestAnimationFrame(render);}}
  async function watchSources() {
    if(!home||!homeActive)return;
    const generation=lifecycle;
    const {apps,fs,auth}=await store();
    if(!homeActive||generation!==lifecycle)return;
    for(const [key,watch]of sourceWatches)if(!pins.has(key)){watch.stop();sourceWatches.delete(key);}
    for(const pin of pins.values()) {
      if(sourceWatches.has(pin.key))continue;
      let app=apps.getApps().find(app=>app.options.projectId===pin.project);
      if(!app&&secondaryApps[pin.project]){const secondary=secondaryApps[pin.project];app=apps.initializeApp(secondary.config,secondary.name);}
      if(!app)continue;
      if(!authWatches.has(app.name))authWatches.set(app.name,auth.onAuthStateChanged(auth.getAuth(app),()=>{void watchSources();}));
      if(!auth.getAuth(app).currentUser)continue;
      const stop=fs.onSnapshot(fs.doc(fs.getFirestore(app),pin.collection,pin.sourceId),snapshot=>{
        if(!pins.has(pin.key))return;
        const current=pins.get(pin.key);
        if(!snapshot.exists()){if(!snapshot.metadata?.fromCache){current.missing=true;const widget=widgets.get(pin.key);if(widget)widget._entry=null;changed();}return;}
        current.missing=false;current.entry=entryFromData(current,snapshot.data());changed();
      },()=>{sourceWatches.delete(pin.key);/* Keep the cached card if the source project is signed out. */});
      sourceWatches.set(pin.key,{stop});
    }
  }
  async function startHome() {
    homeActive=true;const generation=++lifecycle;
    queueRender();
    try {
      const {db,fs}=await store();
      if(!homeActive||generation!==lifecycle)return;
      homeUnsubscribe?.();
      homeUnsubscribe=fs.onSnapshot(fs.collection(db,'homePinnedCards'),snapshot=>{
        const next=new Map();snapshot.forEach(item=>{
          const pin=item.data(),source=sources[String(pin.file).toLowerCase()];if(!source||typeof pin.sourceId!=='string'||!pin.sourceId||!pin.key||!pin.entry)return;
          pin.collection=source[2];pin.project=source[3]||mainProject;
          const previous=pins.get(pin.key);pin.missing=previous?.missing||false;if(previous && sourceWatches.has(pin.key))pin.entry=previous.entry;
          next.set(pin.key,pin);
        });pins=next;changed();void watchSources();
      },error=>message('Home pins could not sync: '+error.message));
    } catch(error){message(error.message);}
  }
  function start() {
    scan(document);
    new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)scan(node);}).observe(document.body,{childList:true,subtree:true});
    if(home)void startHome();
  }
  window.addEventListener('storage',event=>{if(event.key===cacheKey){try{pins=new Map(JSON.parse(event.newValue||'[]').map(pin=>[pin.key,pin]));updateButtons();if(home)queueRender();}catch{}}});
  window.addEventListener('cep-search-helpers-ready',()=>{if(home){queueRender();void watchSources();}});
  window.addEventListener('cep-theme-css-ready',()=>{if(home){for(const widget of widgets.values())widget._entry=null;queueRender();}});
  window.addEventListener('cep-search-cache-invalidated',()=>{if(home)void watchSources();});
  window.addEventListener('resize',()=>{let i=0;for(const [key,widget]of widgets){place(widget,layout()[device()+':'+key],i++);if(viewState(widget).expanded&&!viewState(widget).minimized)fitFullTable(widget,key,false);else fitCompactTable(widget);}},{passive:true});
  window.addEventListener('pagehide',()=>{homeActive=false;++lifecycle;homeUnsubscribe?.();homeUnsubscribe=null;for(const watch of sourceWatches.values())watch.stop();for(const stop of authWatches.values())stop();sourceWatches.clear();authWatches.clear();});
  window.addEventListener('pageshow',event=>{if(home&&event.persisted)void startHome();});
  window.CEPHomeCardPins={pin,unpin,has:key=>pins.has(key)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
