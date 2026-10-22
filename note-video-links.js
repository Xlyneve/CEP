(() => {
  'use strict';
  if (window.CEPNoteVideoLinks?.version === 3) return;
  document.getElementById('cep-note-video-link-styles')?.remove();
  const style = document.createElement('style');
  style.id = 'cep-note-video-link-styles';
  style.textContent = `
    html:root:root:root:root:root:root:root:root:root:root:root body a.cep-note-video-link {
      display:inline-flex !important; align-items:center; gap:4px;
      padding:3px 7px !important; margin:0 !important; border:1.5px solid color-mix(in srgb,var(--clinical-accent,var(--quick-accent,#9b6e7d)) 65%,var(--theme-ink,#37434a)) !important; border-radius:7px !important;
      background:transparent !important; background-image:none !important; box-shadow:none !important;
      color:var(--theme-ink,#37434a) !important; -webkit-text-fill-color:currentColor !important;
      font:700 11px/1.3 Tahoma,sans-serif !important; text-decoration:none !important;
      cursor:pointer; white-space:nowrap; opacity:1 !important;
    }
    html:root:root:root:root:root:root:root:root:root:root:root body a.cep-note-video-link.cep-watch-raised {
      background:var(--cep-watch-fill,#e4dce8) !important;
      background-image:linear-gradient(145deg,rgba(255,255,255,.26),rgba(255,255,255,0)) !important;
      color:var(--cep-watch-ink,#34313a) !important;
      border-color:color-mix(in srgb,var(--cep-watch-fill,#e4dce8) 65%,var(--cep-watch-ink,#34313a)) !important;
      box-shadow:inset 1px 1px 1px rgba(255,255,255,.8),inset -1px -1px 1px rgba(0,0,0,.12),2px 3px 4px rgba(0,0,0,.22) !important;
    }
    html:root:root:root:root:root:root:root:root:root:root:root body a.cep-note-video-link.cep-watch-raised svg {color:inherit !important;}
    html:root:root:root:root:root:root:root:root:root:root:root body a.cep-note-video-link.cep-watch-raised:active {
      box-shadow:inset 1px 2px 3px rgba(0,0,0,.2),inset -1px -1px 1px rgba(255,255,255,.6) !important;
      transform:translateY(1px);
    }
    html:root:root:root:root:root:root:root:root:root:root:root body a.cep-note-video-link span {
      color:inherit !important; -webkit-text-fill-color:currentColor !important;
      font:inherit !important;
    }
    html:root:root:root:root:root:root:root:root:root:root:root body a.cep-note-video-link svg {
      width:14px !important; height:14px !important; flex:0 0 14px;
      color:color-mix(in srgb,var(--clinical-accent,var(--quick-accent,#9b6e7d)) 65%,var(--theme-ink,#37434a)) !important;
      fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
    }
    html:root:root:root:root:root:root body .cep-note-video-footer {
      display:flex; flex-wrap:wrap; align-items:center; gap:10px; zoom:1 !important;
      margin-top:10px; padding-top:3px; white-space:normal;
      background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel {
      position:fixed !important; inset:12px 12px 12px auto !important; margin:0 !important;
      width:min(520px,42vw); min-width:300px; height:calc(100dvh - 24px); max-height:calc(100dvh - 24px);
      box-sizing:border-box; padding:0; border:1px solid var(--clinical-edge,#d8d3d4); border-radius:16px;
      background:linear-gradient(var(--clinical-field,#faf9f7),var(--clinical-field,#faf9f7)),#faf9f7;
      color:var(--theme-ink,#37434a); box-shadow:var(--note-editor-depth,0 8px 28px #0003);
      overflow:hidden; z-index:2147483647; display:none; flex-direction:column;
    }
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel.is-open { display:flex !important; }
    #cepNoteLinkPanel::backdrop { background:transparent; pointer-events:none; }
    #cepNoteLinkPanel .cep-link-panel-header { display:flex; align-items:center; gap:8px; padding:8px 10px; flex:none; }
    #cepNoteLinkPanel .cep-link-panel-title { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:600 13px/1.4 Tahoma,sans-serif; }
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel .cep-link-panel-header button {
      flex:none; width:30px; height:30px; min-width:30px; min-height:30px; padding:0;
      border:0 !important; border-radius:8px; background:transparent !important; box-shadow:none !important;
      color:inherit !important; -webkit-text-fill-color:currentColor !important; font:22px/1 Tahoma,sans-serif;
      cursor:pointer;
    }
    #cepNoteLinkPanel .cep-link-panel-zoom{display:flex;align-items:center;gap:2px;flex:none;}
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel .cep-link-panel-zoom button{width:24px;min-width:24px;height:26px;min-height:26px;font:400 15px/1 Tahoma,sans-serif;}
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel .cep-link-panel-zoom [data-zoom="reset"]{width:44px;min-width:44px;font-size:12px;}
    #cepNoteLinkPanel :is(.cep-link-panel-zoom button:disabled){opacity:.4;cursor:default;}
    #cepNoteLinkPanel:is(.is-collapsed,.is-video) .cep-link-panel-zoom{display:none!important;}
    #cepNoteLinkPanel .cep-link-panel-body { display:flex; flex:1; min-height:0; flex-direction:column; overflow:auto; }
    #cepNoteLinkPanel .cep-link-panel-frame { flex:1; min-height:0; background:#fff; overflow:hidden; }
    #cepNoteLinkPanel iframe,#cepNoteLinkPanel video { display:block; width:100%; height:100%; border:0; }
    #cepNoteLinkPanel .cep-link-panel-footer { display:flex; justify-content:flex-end; padding:8px 12px; flex:none; }
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel .cep-link-panel-new-tab {
      display:inline-flex; align-items:center; gap:5px; color:inherit !important; -webkit-text-fill-color:currentColor !important;
      font:600 12px/1.5 Tahoma,sans-serif; text-decoration:underline; background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel.is-video { bottom:auto !important; height:auto; }
    #cepNoteLinkPanel.is-video .cep-link-panel-frame { flex:none; aspect-ratio:16/9; background:#000; }
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel.is-collapsed { width:46px; min-width:46px; height:auto; bottom:auto !important; }
    #cepNoteLinkPanel.is-collapsed .cep-link-panel-header { flex-direction:column; padding:6px; gap:6px; }
    #cepNoteLinkPanel.is-collapsed :is(.cep-link-panel-title,.cep-link-panel-body,.cep-link-panel-footer) { display:none !important; }
    @media(max-width:600px) {
      html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel { inset:8px 8px 8px auto !important; width:calc(100vw - 16px); min-width:0; max-height:calc(100dvh - 16px); height:calc(100dvh - 16px); }
      html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel.is-video { height:auto; }
      html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel.is-collapsed { width:46px; min-width:46px; height:auto; }
    }

  `;

  style.textContent += `
    html:root:root:root:root:root:root:root:root:root #cepNoteLinkPanel.is-sized:not(.is-collapsed) {
      width:var(--panel-width) !important; height:var(--panel-height) !important;
      min-width:0 !important; bottom:auto !important;
    }
    #cepNoteLinkPanel.is-sized.is-video .cep-link-panel-frame { flex:1; aspect-ratio:auto; }
    #cepNoteLinkPanel .cep-link-panel-resize {
      position:absolute; left:0; bottom:0; width:22px; height:22px;
      cursor:nesw-resize; touch-action:none; z-index:2;
    }
    #cepNoteLinkPanel .cep-link-panel-resize::after {
      content:''; position:absolute; left:6px; bottom:6px; width:7px; height:7px;
      border-left:2px solid currentColor; border-bottom:2px solid currentColor; opacity:.45;
    }
    #cepNoteLinkPanel.is-collapsed .cep-link-panel-resize { display:none; }
    #cepNoteLinkPanel.is-resizing iframe { pointer-events:none; }
    #cepNoteLinkPanel .cep-link-panel-footer { flex-wrap:wrap; gap:6px 12px; }
    #cepNoteLinkPanel .cep-link-panel-help { flex:1; font:11px/1.4 Tahoma,sans-serif; opacity:.8; }
  `;
  document.head.append(style);
function getYouTubeVideoId(rawUrl) {
  try {
    const url = new URL(rawUrl, location.href);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let id = '';

    if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
      else {
        const parts = url.pathname.split('/').filter(Boolean);
        if (['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1] || '';
      }
    }

    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
  } catch {
    return '';
  }
}

function getNoteVideoKind(rawUrl) {
  try {
    const url = new URL(rawUrl, location.href);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    if (getYouTubeVideoId(url.href)) return 'youtube';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (/\.(?:mp4|webm|mov|m4v|ogv)$/i.test(url.pathname)) return 'file';
    if ((host === 'vimeo.com' || host === 'player.vimeo.com') && /\/\d+(?:\/|$)/.test(url.pathname)) return 'vimeo';
    if (host === 'fb.watch' || ((host === 'facebook.com' || host.endsWith('.facebook.com')) && (/\/(?:videos|reel|reels|share\/(?:r|v))\//.test(url.pathname) || ((url.pathname === '/watch' || url.pathname === '/watch/' || url.pathname === '/video.php') && url.searchParams.has('v'))))) return 'facebook';
  } catch {}
  return '';
}

function linkifyPlainVideoUrls(root) {
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
  const runs=[]; let nodes=[],block=null;
  const flush=()=>{if(nodes.length)runs.push(nodes);nodes=[];};
  while(walker.nextNode()){
    const node=walker.currentNode;
    if(node.nodeType===1){if(node.tagName==='BR')flush();continue;}
    if(!node.data)continue;
    const excluded=node.parentElement.closest('a,button,script,style,code,pre,textarea,.cep-note-video-footer');
    if(excluded&&root.contains(excluded)){flush();continue;}
    const nextBlock=node.parentElement.closest('p,li,td,th,div,h1,h2,h3,h4,h5,h6')||root;
    if(nextBlock!==block){flush();block=nextBlock;}
    nodes.push(node);
  }
  flush();
  for(const run of runs){
    let total=0;
    const pieces=run.map(node=>{const start=total;total+=node.data.length;return {node,start,end:total};});
    const text=run.map(node=>node.data).join('');
    const matches=[...text.matchAll(/\b(?:https?:\/\/|www\.)[^\s<>"']+/gi)].reverse();
    for(const match of matches){
      let value=match[0].replace(/[.,!?;:]+$/,'');
      while(value.endsWith(')')&&(value.match(/\)/g)||[]).length>(value.match(/\(/g)||[]).length)value=value.slice(0,-1);
      const href=/^www\./i.test(value)?'https://'+value:value;
      if(!getNoteVideoKind(href))continue;
      const start=match.index,end=start+value.length;
      const first=pieces.find(piece=>piece.end>start),last=pieces.find(piece=>piece.end>=end);
      if(!first||!last||!root.contains(first.node)||!root.contains(last.node))continue;
      const range=document.createRange();range.setStart(first.node,start-first.start);range.setEnd(last.node,end-last.start);
      const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener noreferrer';link.textContent=value;
      range.deleteContents();range.insertNode(link);
    }
  }
  root.querySelectorAll('mark.cep-search-match,mark.underlineMatch').forEach(mark=>{if(!mark.textContent&&!mark.children.length)mark.remove();});
}

function decorateNoteVideoLinks(root) {
  linkifyPlainVideoUrls(root);
  let footer = root.querySelector(':scope > .cep-note-video-footer');
  root.querySelectorAll('a[href]').forEach(link => {
    if (link.classList.contains('conceptLink')) return;
    if (!link.classList.contains('cep-note-video-link') && !getNoteVideoKind(link.href)) return;
    link.classList.add('cep-note-video-link');
    const card=link.closest('.chatBubble,.cep-source-chat') || (root.matches?.('.chatBubble,.cep-source-chat') ? root : null);
    if(card){
      link.classList.add('cep-watch-raised');
      // Pick a different material from this theme's own palette, retaining its readable ink.
      const solid=getComputedStyle(card).getPropertyValue('--card-solid').trim() || '#efefef';
      const rgb=hex=>/^#[a-f0-9]{6}$/i.test(hex) ? [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)) : [239,239,239];
      const base=rgb(solid);let chosen, distance=-1;
      for(let i=0;i<20;i++){
        const color=window.getCepSourceCardColour?.('chatgptx.html',i,'note-card');if(!color)break;
        const delta=rgb(color.solid).reduce((sum,value,j)=>sum+(value-base[j])**2,0);
        if(delta>distance){chosen=color;distance=delta;}
      }
      if(chosen){link.style.setProperty('--cep-watch-fill',distance<400 ? `color-mix(in srgb,${chosen.solid} 84%,${chosen.ink})` : chosen.solid);link.style.setProperty('--cep-watch-ink',chosen.ink);}
    }

    link.title = 'Watch here — ' + link.href;
    link.setAttribute('aria-label', 'Watch video');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(icon.namespaceURI, 'path');
    path.setAttribute('d', 'M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm12 4 6-3v10l-6-3');
    icon.append(path);
    const label = document.createElement('span'); label.textContent = 'Watch here';
    link.replaceChildren(icon, label);
    if (!footer) { footer = document.createElement('div'); footer.className = 'cep-note-video-footer'; }
    let parent = link.parentElement;
    footer.appendChild(link);
    // Remove only wrappers left empty by moving a standalone URL, never table cells.
    while (parent && parent !== root && parent !== footer && parent.matches('p,div,span') && !parent.children.length && !parent.textContent.trim()) {
      const next = parent.parentElement; parent.remove(); parent = next;
    }
  });
  if (footer?.children.length) root.appendChild(footer);
}

  let panel,frame,title,newTab,collapseButton,currentUrl='',lastTrigger;
  let panelZoom=1;
  function setPanelZoom(value){
    panelZoom=Math.max(.5,Math.min(2,Math.round(value*10)/10));
    const iframe=frame?.querySelector('iframe');
    if(iframe){
      // Let the browser lay out the frame at its zoom level instead of scaling a rasterized layer.
      iframe.style.setProperty('width','100%','important');
      iframe.style.setProperty('height','100%','important');
      iframe.style.removeProperty('transform-origin');
      iframe.style.removeProperty('transform');
      iframe.style.setProperty('zoom',String(panelZoom),'important');
    }
    panel.querySelector('[data-zoom="reset"]').textContent=Math.round(panelZoom*100)+'%';
    panel.querySelector('[data-zoom="out"]').disabled=panelZoom<=.5;
    panel.querySelector('[data-zoom="in"]').disabled=panelZoom>=2;
  }

  const dialogHosts=new WeakSet();
  const preferredSizes={};
  let sizeKind='link';
  function readPanelSize(kind) {
    if(preferredSizes[kind])return preferredSizes[kind];
    try {
      const value=JSON.parse(localStorage.getItem('cep-link-panel-size-'+kind));
      if(value&&Number.isFinite(value.width)&&Number.isFinite(value.height)&&value.width>0&&value.height>0)
        return preferredSizes[kind]=value;
    }catch{}
    return null;
  }
  function restorePanelSize() {
    const size=readPanelSize(sizeKind);
    panel.classList.toggle('is-sized',Boolean(size));
    if(!size){panel.style.removeProperty('--panel-width');panel.style.removeProperty('--panel-height');return;}
    // Clamp only the displayed dimensions; keep the preferred desktop size.
    panel.style.setProperty('--panel-width',Math.min(size.width,Math.max(1,innerWidth-24))+'px');
    panel.style.setProperty('--panel-height',Math.min(size.height,Math.max(1,innerHeight-24))+'px');
  }
  function savePanelSize() {
    if(!panel.classList.contains('is-sized'))return;
    const width=parseFloat(panel.style.getPropertyValue('--panel-width'));
    const height=parseFloat(panel.style.getPropertyValue('--panel-height'));
    if(!Number.isFinite(width)||!Number.isFinite(height))return;
    preferredSizes[sizeKind]={width,height};
    try{localStorage.setItem('cep-link-panel-size-'+sizeKind,JSON.stringify({width,height}));}catch{}
  }
  function ensurePanel(host) {
    if(!panel){
      panel=document.createElement('aside');panel.id='cepNoteLinkPanel';panel.setAttribute('popover','manual');
      panel.setAttribute('role','complementary');panel.setAttribute('aria-label','Link panel');panel.setAttribute('aria-hidden','true');
      panel.innerHTML='<div class="cep-link-panel-header"><span class="cep-link-panel-title"></span><div class="cep-link-panel-zoom" role="group" aria-label="Webpage zoom"><button type="button" data-zoom="out" aria-label="Zoom webpage out" title="Zoom out">−</button><button type="button" data-zoom="reset" aria-label="Reset webpage zoom" title="Reset zoom" aria-live="polite">100%</button><button type="button" data-zoom="in" aria-label="Zoom webpage in" title="Zoom in">+</button></div><button type="button" data-action="collapse" aria-label="Collapse link panel" aria-expanded="true">›</button><button type="button" data-action="close" aria-label="Close link panel">×</button></div><div class="cep-link-panel-body"><div class="cep-link-panel-frame"></div></div><div class="cep-link-panel-footer"><a class="cep-link-panel-new-tab" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a></div>';
      const help=document.createElement('span');help.className='cep-link-panel-help';
      help.textContent='Some sites block embedded viewing. If blank or refused, open in a new tab.';
      panel.querySelector('.cep-link-panel-footer').prepend(help);
      const grip=document.createElement('div');grip.className='cep-link-panel-resize';grip.title='Drag to resize link panel';
      panel.append(grip);
      grip.addEventListener('pointerdown',event=>{
        if(event.button!==0)return;
        event.preventDefault();
        const start=panel.getBoundingClientRect(),x=event.clientX,y=event.clientY;
        grip.setPointerCapture(event.pointerId);panel.classList.add('is-resizing');
        const move=e=>{
          const width=Math.max(Math.min(260,innerWidth-16),Math.min(start.width+x-e.clientX,start.right-8));
          const height=Math.max(Math.min(180,innerHeight-16),Math.min(start.height+e.clientY-y,innerHeight-start.top-8));
          panel.style.setProperty('--panel-width',width+'px');panel.style.setProperty('--panel-height',height+'px');
          panel.classList.add('is-sized');
        };
        const end=()=>{savePanelSize();panel.classList.remove('is-resizing');grip.removeEventListener('pointermove',move);grip.removeEventListener('pointerup',end);grip.removeEventListener('pointercancel',end);};
        grip.addEventListener('pointermove',move);grip.addEventListener('pointerup',end);grip.addEventListener('pointercancel',end);
      });
      window.addEventListener('resize',restorePanelSize);
      frame=panel.querySelector('.cep-link-panel-frame');title=panel.querySelector('.cep-link-panel-title');newTab=panel.querySelector('a');collapseButton=panel.querySelector('[data-action="collapse"]');
      panel.querySelector('[data-action="close"]').onclick=closePanel;
      panel.querySelector('[data-zoom="out"]').onclick=()=>setPanelZoom(panelZoom-.1);
      panel.querySelector('[data-zoom="reset"]').onclick=()=>setPanelZoom(1);
      panel.querySelector('[data-zoom="in"]').onclick=()=>setPanelZoom(panelZoom+.1);

      collapseButton.onclick=()=>{
        const collapsed=panel.classList.toggle('is-collapsed');
        collapseButton.textContent=collapsed?'‹':'›';collapseButton.setAttribute('aria-expanded',String(!collapsed));
        collapseButton.setAttribute('aria-label',collapsed?'Expand link panel':'Collapse link panel');
        if(collapsed)frame.querySelector('video')?.pause();
      };
    }
    if(panel.parentElement!==host){
      try{if(panel.matches(':popover-open'))panel.hidePopover();}catch{}
      host.appendChild(panel);
    }
    if(host.tagName==='DIALOG'&&!dialogHosts.has(host)){
      host.addEventListener('close',()=>{if(panel.parentElement===host)closePanel(false);});dialogHosts.add(host);
    }
  }
  function closePanel(restoreFocus=true) {
    if(!panel)return;
    try{panel.hidePopover?.();}catch{}
    panel.classList.remove('is-open','is-collapsed');panel.setAttribute('aria-hidden','true');
    frame.querySelector('video')?.pause();frame.replaceChildren();currentUrl='';
    if(restoreFocus&&lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});
  }
  function openExternalTab(url) {
    // noopener prevents the external site from controlling this page.
    window.open(url,'_blank','noopener,noreferrer');
  }
  function openLink(rawUrl,options={}) {
    let url;try{url=new URL(rawUrl,location.href);if(!['http:','https:'].includes(url.protocol))return;}catch{return;}
    // Keep links from Home's embedded widgets in the main window's panel.
    if(window.parent!==window){try{if(window.parent.CEPNoteVideoLinks?.open){window.parent.CEPNoteVideoLinks.open(url.href,{video:options.video});return;}}catch{}}
    // Search results carry the same opening preference as Information Links.
    if(options.trigger?.dataset.formLinkMode==='external'){closePanel(false);openExternalTab(url.href);return;}
    // This server explicitly disallows framing its PDFs. Open during the user's
    // click so popup blockers can recognise the new tab as user initiated.
    const blockedPdf=url.hostname.replace(/^www\./,'')==='sexualwellbeing.org.nz'&&/\.pdf$/i.test(url.pathname);
    if(blockedPdf){closePanel(false);openExternalTab(url.href);return;}
    const host=options.trigger?.closest('dialog[open]')||document.body;
    ensurePanel(host);lastTrigger=options.trigger||null;
    panel.classList.remove('is-collapsed');collapseButton.textContent='›';collapseButton.setAttribute('aria-expanded','true');collapseButton.setAttribute('aria-label','Collapse link panel');
    if(currentUrl!==url.href||!frame.children.length){
      frame.querySelector('video')?.pause();frame.replaceChildren();frame.style.background='';
      const kind=getNoteVideoKind(url.href);let embedUrl=url.href,label=url.hostname.replace(/^www\./,'');
      if(kind==='youtube'){embedUrl=`https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(url.href)}?autoplay=1&rel=0`;label='YouTube';}
      else if(kind==='facebook'){embedUrl=`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.href)}&show_text=false&width=900&autoplay=true`;label='Facebook video';}
      else if(kind==='vimeo'){
        const parts=url.pathname.split('/').filter(Boolean),index=parts.findIndex(part=>/^\d+$/.test(part));
        const embed=new URL('https://player.vimeo.com/video/'+parts[index]);embed.searchParams.set('autoplay','1');
        const hash=url.searchParams.get('h')||parts[index+1];if(hash&&/^[a-z0-9]+$/i.test(hash))embed.searchParams.set('h',hash);
        embedUrl=embed.href;label='Vimeo';
      }
      panel.classList.toggle('is-video',Boolean(kind||options.video));
      sizeKind=kind||options.video?'video':'link';
      restorePanelSize();
      if(kind==='file'){
        const video=document.createElement('video');video.src=url.href;video.controls=true;video.autoplay=true;video.playsInline=true;frame.append(video);
      }else{
        const iframe=document.createElement('iframe');iframe.src=embedUrl;iframe.title=label+' preview';
        iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.addEventListener('error',()=>{
          // Some browser/network failures report an error; framing-policy blocks
          // usually do not. Never guess from a timeout or cross-origin access.
          if(currentUrl!==url.href||!iframe.isConnected)return;
          closePanel(false);openExternalTab(url.href);
        },{once:true});
        iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';frame.append(iframe);
      }
      title.textContent=label;title.title=url.href;newTab.href=url.href;currentUrl=url.href;
      setPanelZoom(1);
    }
    panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');
    try{if(panel.showPopover&&!panel.matches(':popover-open'))panel.showPopover();}catch{}
    collapseButton.focus({preventScroll:true});
  }
  window.CEPNoteVideoLinks=Object.freeze({version:3,decorate:decorateNoteVideoLinks,kind:getNoteVideoKind,youtubeId:getYouTubeVideoId,open:openLink,close:closePanel});
  window.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href]');
    if(!link||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    // Information Links cards point straight to saved URLs, rather than a note page.
    // Open only these search cards on a single click; other result cards retain copy.
    if(link.matches('a.cep-search-source[data-source-file="forms.html"]')){
      let url;try{url=new URL(link.href,location.href);}catch{return;}
      if(!['http:','https:'].includes(url.protocol))return;
      event.preventDefault();event.stopImmediatePropagation();openLink(url.href,{trigger:link});return;
    }
    // Information Links has its own permanent preview. Its normal links use
    // their native new-tab behaviour; links inside search results keep the panel.
    if(document.body.dataset.cepLinkPanel==='off'&&!link.closest('.cep-search-source'))return;
    if(link.closest('#cepNoteLinkPanel,[contenteditable="true"]')||link.matches('[download],[role="button"],.conceptLink,.cep-xgpt-concept,.xgpt-concept-link,.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result,.cep-search-source'))return;
    const raw=link.getAttribute('href')?.trim();if(!raw||raw.startsWith('#'))return;
    let url;try{url=new URL(raw,location.href);if(!['http:','https:'].includes(url.protocol))return;}catch{return;}
    const image=link.querySelector('img');
    if(image&&(/\.(?:png|jpe?g|gif|webp|avif|svg)$/i.test(url.pathname)||url.href===image.src||link.closest('.kbPhotoStrip,.cep-photo-gallery,.image-gallery,.photo-gallery')))return;
    const saved=link.matches('.cep-note-video-link,.note-link,.cep-saved-url,.vaccine-link')||link.closest('.note-url');
    if(url.origin===location.origin&&!saved)return;
    // Authentication handoffs must keep their normal browser flow.
    if(url.hostname==='accounts.google.com'&&/oauth|signin/.test(url.pathname))return;
    event.preventDefault();event.stopImmediatePropagation();openLink(url.href,{trigger:link,video:link.classList.contains('cep-note-video-link')});
  },true);
  window.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&panel?.classList.contains('is-open')){event.preventDefault();event.stopImmediatePropagation();closePanel();}
  },true);
})();
