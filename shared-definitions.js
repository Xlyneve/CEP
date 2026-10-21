(function () {
  'use strict';
  if (window.CEPSharedDefinitions) return;
  const normalize = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim();
  let records = [], adapter, index = new Map(), scheduled = false, mediaIndex = new Map();
  function update(items) {
    records = items; index = new Map();
    for (const record of records) if (!record.disabled) index.set(normalize(record.concept || record.id), record);
    for (const record of records) if (!record.disabled) for (const alias of record.aliases || []) if (!index.has(normalize(alias))) index.set(normalize(alias), record);
    for (const [key, media] of mediaIndex) {
      if (!index.has(key) && !records.some(record => record.disabled && normalize(record.concept || record.id) === key))
        index.set(key, media);
    }
    schedule();
  }
  const find = term => index.get(normalize(term));
  function updateMedia(items) {
    mediaIndex = new Map();
    for (const item of items) mediaIndex.set(normalize(item.concept || item.id), item);
    update(records);
  }
  function photos(record) {
    const media = mediaIndex.get(normalize(record?.concept || record?.id)) || record || {};
    const entries = Array.isArray(media.images) && media.images.length ? media.images : media.imageUrl ? [{imageUrl:media.imageUrl}] : [];
    return entries.filter(image => {
      try { return ['https:','http:'].includes(new URL(image.imageUrl).protocol); } catch { return false; }
    });
  }
  let imageViewer;
  function openDefinitionImage(source) {
    if (!imageViewer) {
      const style = document.createElement('style');
      style.textContent = `
        html:root:root body #cep-definition-image-viewer {position:fixed;inset:0;margin:auto;padding:12px;border:0!important;border-radius:0!important;box-shadow:none!important;width:min(940px,calc(100vw - 24px));height:min(800px,calc(100dvh - 24px));max-width:none;max-height:none;box-sizing:border-box;background:transparent!important;color:#fff;overflow:hidden;}
        #cep-definition-image-viewer::backdrop{background:rgba(20,20,25,.4);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
        #cep-definition-image-viewer .definition-image-controls{display:flex;align-items:center;justify-content:flex-end;gap:8px;height:40px;margin-bottom:8px}
        html:root:root body #cep-definition-image-viewer button{position:static;display:grid;place-items:center;min-width:36px;width:auto;height:36px;padding:0 10px;border:1px solid rgba(255,255,255,.6)!important;border-radius:8px;background:rgba(20,20,25,.7)!important;color:#fff!important;font:400 16px/1 Tahoma,sans-serif!important;cursor:pointer;transform:none}
        #cep-definition-image-viewer .definition-image-viewport{overflow:auto;height:calc(100% - 48px);overscroll-behavior:contain;touch-action:pan-x pan-y pinch-zoom}
        #cep-definition-image-viewer .definition-image-stage{display:grid;place-items:center;min-width:100%;min-height:100%;width:max-content}
        html:root:root body #cep-definition-image-viewer img{display:block;max-width:none!important;max-height:none!important;object-fit:contain;margin:0;border:0;border-radius:0}
      `;
      document.head.append(style);
      const dialog = document.createElement('dialog');
      dialog.id = 'cep-definition-image-viewer'; dialog.setAttribute('aria-label','Definition image zoom');
      const controls = document.createElement('div'); controls.className='definition-image-controls';
      const viewport = document.createElement('div'); viewport.className='definition-image-viewport';
      const stage = document.createElement('div'); stage.className='definition-image-stage';
      const image = document.createElement('img'); stage.append(image); viewport.append(stage);
      dialog.append(controls,viewport); document.body.append(dialog);
      let scale=1, baseWidth=0, baseHeight=0, origin, previousOverflow='', active=false;
      const restore = () => {if(!active)return;active=false;document.body.style.overflow=previousOverflow;if(origin?.isConnected)origin.focus({preventScroll:true});};
      const closeViewer = () => {dialog.close();restore();};
      const update = () => {
        image.style.width = baseWidth*scale+'px'; image.style.height=baseHeight*scale+'px';
        reset.textContent=Math.round(scale*100)+'%';
      };
      const fit = () => {
        const factor=Math.min(1,viewport.clientWidth/Math.max(1,image.naturalWidth),viewport.clientHeight/Math.max(1,image.naturalHeight));
        baseWidth=image.naturalWidth*factor; baseHeight=image.naturalHeight*factor; update();
      };
      const button = (label,text,action) => {
        const node=document.createElement('button');node.type='button';node.textContent=text;node.title=label;node.setAttribute('aria-label',label);
        node.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();action();});controls.append(node);return node;
      };
      button('Zoom out','−',()=>{scale=Math.max(.5,scale-.25);update();});
      const reset=button('Reset zoom','100%',()=>{scale=1;fit();});
      button('Zoom in','+',()=>{scale=Math.min(5,scale+.25);update();});
      button('Close image','×',()=>closeViewer());
      image.addEventListener('load',fit);
      dialog.addEventListener('click',event=>{event.stopPropagation();if(event.target===dialog || event.target===viewport || event.target===stage)closeViewer();});
      dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeViewer();}});
      dialog.addEventListener('cancel',event=>{event.preventDefault();event.stopPropagation();closeViewer();});
      dialog.addEventListener('close',()=>{if(!dialog.open)restore();});
      window.addEventListener('resize',()=>{if(dialog.open)fit();});
      imageViewer={open(source){
        origin=source;scale=1;image.alt=source.alt||'Definition image';
        if(!dialog.open){previousOverflow=document.body.style.overflow;active=true;dialog.showModal();document.body.style.overflow='hidden';}
        image.src=source.currentSrc||source.src;if(image.complete)fit();
      }};
    }
    imageViewer.open(source);
  }
  function appendVideo(container, rawUrl) {
    let url;try{url=new URL(rawUrl);}catch{return false;}
    if(!['https:','http:'].includes(url.protocol))return false;
    const footer=document.createElement('div');
    const link=document.createElement('a');link.href=url.href;link.className='cep-note-video-link';
    link.textContent='Watch here';link.setAttribute('aria-label','Watch video');link.target='_blank';link.rel='noopener noreferrer';
    footer.append(link);container.append(footer);window.CEPNoteVideoLinks?.decorate(footer);return true;
  }
  const gallerySource=new URL('concept-photo-gallery.js?v=20261003-1',document.currentScript?.src || location.href).href;
  const waitingGalleries=new Set();let galleryLoader;
  function decorateDefinitionGallery(strip) {
    if(window.CEPPhotoGallery){window.CEPPhotoGallery.decorate(strip);return;}
    waitingGalleries.add(strip);
    if(galleryLoader)return;
    galleryLoader=document.createElement('script');galleryLoader.src=gallerySource;
    galleryLoader.onload=()=>{for(const item of waitingGalleries)window.CEPPhotoGallery?.decorate(item);waitingGalleries.clear();};
    galleryLoader.onerror=()=>{galleryLoader=null;waitingGalleries.clear();};
    document.head.append(galleryLoader);
  }
  function renderPreview(container, record, fallback = '') {
    container.replaceChildren();
    const value = record?.value || plain(record?.valueHtml) || fallback;
    if (value) { const text = document.createElement('p'); text.textContent = value; container.append(text); }
    const media = mediaIndex.get(normalize(record?.concept || record?.id)) || record;
    const images = photos(record);
    const strip=document.createElement('div');
    strip.setAttribute('role','region');strip.setAttribute('aria-label','Definition photos');strip.tabIndex=0;
    strip.style.cssText='display:flex;gap:8px;min-width:0;max-width:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;overscroll-behavior-x:contain;';
    if(images.length)container.append(strip);

    for (const [index, photo] of images.entries()) {
      const image = document.createElement('img');
      image.src = photo.imageUrl; image.alt = (record?.concept || 'Concept') + ' — photo ' + (index + 1);
      image.style.cssText = 'display:block;width:100%;min-width:0;max-width:100%;height:240px;object-fit:contain;border-radius:8px;margin:8px 0;flex:0 0 100%;scroll-snap-align:start';
      image.style.cursor = 'zoom-in'; image.tabIndex=0;
      image.setAttribute('role','button'); image.setAttribute('aria-label','Zoom '+image.alt);
      image.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openDefinitionImage(image);});
      image.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();openDefinitionImage(image);}});
      strip.append(image);
    }
    if(images.length)decorateDefinitionGallery(strip);
    if (images.length && media?.caption) { const caption=document.createElement('p'); caption.textContent=media.caption; container.append(caption); }
    const video=appendVideo(container,record?.videoUrl);
    return !!(value || images.length || video);
  }
  async function save(term, value, aliases) {
    if (!adapter) throw new Error('Open chatgptx and sign in first to enable shared definitions.');
    const existing = find(term);
    const concept = existing?.concept || term.trim();
    const clean = [...new Set(aliases.map(alias => alias.trim()).filter(Boolean))];
    for (const alias of [concept,...clean]) {
      const conflict = find(alias);
      if (conflict && conflict.id !== existing?.id && normalize(conflict.concept) !== normalize(concept)) throw new Error(`“${alias}” already belongs to “${conflict.concept}”.`);
    }
    await adapter.save(existing?.id || normalize(concept), { concept, value, valueHtml:'', aliases:clean, disabled:false });
  }
  const mediaFor = term => {
    const record = find(term);
    return mediaIndex.get(normalize(record?.concept || term)) || record || {};
  };
  async function uploadPhotos(term, files) {
    if (!adapter?.uploadPhotos) throw new Error('Sign in and wait for shared definitions to finish loading, then try again.');
    const concept = find(term)?.concept || term.trim();
    return adapter.uploadPhotos(concept, files);
  }
  async function remove(term) {
    if (!adapter) throw new Error('Sign in to chatgptx first.');
    const record = find(term); if (record) await adapter.remove(record.id);
  }
  function refresh() {
    scheduled = false;
    const scopes = document.querySelectorAll('.theme-pn .note-title,.theme-explain .note-text,.note-content,.chatBubble,.universal-search-native-title,.universal-search-native-snippet,.cep-source-note-title,.cep-source-note-content,.cep-source-rich-content');
    for (const scope of scopes) {
      if (scope.closest('[contenteditable="true"],.editing-note')) continue;
      scope.querySelectorAll('.cep-shared-definition').forEach(word => word.replaceWith(...word.childNodes));
      scope.normalize();
      scope.querySelectorAll('.pn-definition').forEach(word => {
        const record = find(word.textContent);
        if (record) word.dataset.pnDefinition = record.value || plain(record.valueHtml);
        else if(records.some(item=>item.disabled&&[item.concept,...item.aliases||[]].some(term=>normalize(term)===normalize(word.textContent)))) word.replaceWith(...word.childNodes);
      });
      const aliases = [...index.keys()].sort((a,b)=>b.length-a.length);
      if (!aliases.length) continue;
      const escaped = aliases.map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
      const pattern = new RegExp(`(?<![\\p{L}\\p{N}_-])(${escaped.join('|')})(?![\\p{L}\\p{N}_-])`,'giu');
      const walker = document.createTreeWalker(scope,NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      const groups=[]; let group=[], block=null;
      const flush=()=>{if(group.length)groups.push(group);group=[];block=null;};
      while(walker.nextNode()){
        const node=walker.currentNode;
        if(node.nodeType===1){if(node.matches('br,img,hr,button,.pn-definition,script,style,textarea'))flush();continue;}
        const excluded=node.parentElement.closest('button,.pn-definition,script,style,textarea,[contenteditable="true"]');
        const link=node.parentElement.closest('a');
        if(excluded || (link && !link.matches('.universal-search-native-card,.cep-global-search-result') && scope.contains(link))){flush();continue;}
        const currentBlock=node.parentElement.closest('p,div,li,td,th,pre,blockquote')||scope;
        if(block&&block!==currentBlock)flush();block=currentBlock;group.push(node);
      }
      flush();
      for(const nodes of groups){
        const text=nodes.map(node=>node.nodeValue).join('');
        const point=offset=>{for(const node of nodes){if(offset<=node.nodeValue.length)return [node,offset];offset-=node.nodeValue.length;}};
        for(const match of [...text.matchAll(pattern)].reverse()){
          const record=find(match[0]);if(!record||(!record.value&&!record.valueHtml&&!record.videoUrl&&!photos(record).length))continue;
          const start=point(match.index),end=point(match.index+match[0].length);if(!start||!end)continue;
          const range=document.createRange();range.setStart(...start);range.setEnd(...end);
          const word=document.createElement('span');word.className='cep-shared-definition';word.tabIndex=0;
          word.dataset.sharedTerm=record.concept;word.setAttribute('aria-label',`${match[0]}: ${record.value||plain(record.valueHtml)}`);
          word.append(range.extractContents());range.insertNode(word);
        }
      }
    }
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{observer.disconnect();refresh();observer.observe(document.body,{childList:true,subtree:true});},0);}
  function plain(html){const node=document.createElement('div');window.CEPSecurity?.setHTML(node,html||'');return node.textContent||'';}
  const style=document.createElement('style');style.textContent='.cep-shared-definition { text-decoration:underline dotted; text-underline-offset:3px; cursor:pointer; } #cep-shared-tip { position:fixed;z-index:2147483646;max-width:min(320px,calc(100vw - 24px));padding:12px;border-radius:12px;background:var(--clinical-panel,#fff);color:var(--theme-ink,#39353a);box-shadow:0 6px 22px #0002;font:12px/1.5 Tahoma,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere;max-height:calc(100dvh - 24px);overflow:auto;box-sizing:border-box;overscroll-behavior:contain; } #cep-shared-tip[hidden]{display:none}';document.head.append(style);
  const tip=document.createElement('div');tip.id='cep-shared-tip';tip.hidden=true;tip.setAttribute('role','tooltip');document.body.append(tip);
  let hideTimer, activeWord;
  function hide(){clearTimeout(hideTimer);tip.hidden=true;activeWord=null;}
  const previewSelector = /\/(?:pn|explain)\.html$/i.test(location.pathname) ? '.cep-shared-definition' : '.cep-shared-definition,.pn-definition[data-pn-definition]';
  function show(word){clearTimeout(hideTimer);const record=find(word.dataset.sharedTerm||word.textContent);const value=record?.value||plain(record?.valueHtml)||word.dataset.pnDefinition;if(activeWord===word&&!tip.hidden)return;if(!renderPreview(tip,record,value))return;activeWord=word;tip.hidden=false;const box=word.getBoundingClientRect();tip.style.left=Math.max(12,Math.min(box.left,innerWidth-tip.offsetWidth-12))+'px';tip.style.top=Math.max(12,Math.min(box.bottom+6,innerHeight-tip.offsetHeight-12))+'px';}
  document.addEventListener('mouseover',e=>{const word=e.target.closest(previewSelector);if(word)show(word);},true);
  document.addEventListener('mouseout',e=>{const word=e.target.closest(previewSelector);if(word&&!word.contains(e.relatedTarget)&&!tip.contains(e.relatedTarget)){clearTimeout(hideTimer);hideTimer=setTimeout(hide,200);}},true);
  document.addEventListener('focusin',e=>{if(e.target.matches(previewSelector))show(e.target);});
  document.addEventListener('click',e=>{const word=e.target.closest(previewSelector);if(word){e.preventDefault();e.stopPropagation();show(word);}else if(!tip.contains(e.target))tip.hidden=true;},true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')tip.hidden=true;});
  tip.onmouseenter=()=>clearTimeout(hideTimer);tip.onmouseleave=e=>{if(!activeWord?.contains(e.relatedTarget))hide();};
  const observer=new MutationObserver(records=>{if(records.some(record=>!record.target.closest?.('#cep-shared-tip,#pn-definition-tip,#pn-definition-dialog')))schedule();});observer.observe(document.body,{childList:true,subtree:true});
  window.CEPSharedDefinitions={normalize,find,update,updateMedia,renderPreview,appendVideo,mediaFor,uploadPhotos,save,remove,connect(value){adapter=value;},plain};
})();
