(() => {
  'use strict';
  if (window.CEPNoteVideoLinks?.version === 2) return;
  document.getElementById('cep-note-video-link-styles')?.remove();
  const style = document.createElement('style');
  style.id = 'cep-note-video-link-styles';
  style.textContent = `
    html:root:root:root:root:root:root:root:root:root:root:root body a.cep-note-video-link {
      display:inline-flex !important; align-items:center; gap:4px;
      padding:2px 0 !important; margin:0 !important; border:0 !important; border-radius:0 !important;
      background:transparent !important; background-image:none !important; box-shadow:none !important;
      color:var(--theme-ink,#37434a) !important; -webkit-text-fill-color:currentColor !important;
      font:700 11px/1.3 Tahoma,sans-serif !important; text-decoration:none !important;
      cursor:pointer; white-space:nowrap; opacity:1 !important;
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
    #cepNoteSearchVideoPlayer { box-sizing:border-box; width:min(900px,calc(100vw - 30px)); max-height:calc(100dvh - 30px); overflow:auto; padding:12px; border:1px solid var(--clinical-edge,#ddd); border-radius:16px; background:linear-gradient(var(--clinical-field,#faf9f7),var(--clinical-field,#faf9f7)),#faf9f7; color:var(--theme-ink,#37434a); }
    #cepNoteSearchVideoPlayer::backdrop { background:rgba(28,24,27,.65); }
    #cepNoteSearchVideoPlayer .cep-note-search-video-frame { width:100%; aspect-ratio:16/9; background:#000; border-radius:10px; overflow:hidden; }
    #cepNoteSearchVideoPlayer iframe { display:block; width:100%; height:100%; border:0; }
    #cepNoteSearchVideoPlayer .cep-note-search-video-actions { display:flex; flex-wrap:wrap; align-items:center; justify-content:flex-end; gap:10px; padding-top:9px; font:12px Tahoma,sans-serif; }
    #cepNoteSearchVideoPlayer a { color:inherit; }
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

  let youtubePlayerOverlay, youtubePlayerFrame, youtubeExternalLink, youtubePlayerClose;
  function ensurePlayer() {
    if (youtubePlayerOverlay) return;
    youtubePlayerOverlay = document.createElement('dialog');
    youtubePlayerOverlay.id = 'cepNoteSearchVideoPlayer';
    youtubePlayerOverlay.setAttribute('role','dialog');
    youtubePlayerOverlay.setAttribute('aria-label','Video player');
    youtubePlayerOverlay.innerHTML = '<div><div class="cep-note-search-video-frame"></div><div class="cep-note-search-video-actions"><a target="_blank" rel="noopener noreferrer">Open video</a><button type="button" aria-label="Close video">×</button></div></div>';
    document.body.append(youtubePlayerOverlay);
    youtubePlayerFrame = youtubePlayerOverlay.querySelector('.cep-note-search-video-frame');
    youtubeExternalLink = youtubePlayerOverlay.querySelector('a');
    youtubePlayerClose = youtubePlayerOverlay.querySelector('button');
    youtubePlayerClose.onclick = () => youtubePlayerOverlay.close();
    youtubePlayerOverlay.addEventListener('close',()=>{
      youtubePlayerOverlay.classList.remove('is-open'); youtubePlayerOverlay.setAttribute('aria-hidden','true');
      youtubePlayerFrame.querySelector('video')?.pause(); youtubePlayerFrame.replaceChildren();
    });
    youtubePlayerOverlay.addEventListener('click',event=>{
      if (event.target !== youtubePlayerOverlay) return;
      const r=youtubePlayerOverlay.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)youtubePlayerOverlay.close();
    });
  }
function openNoteVideoFile(sourceUrl) {
  ensurePlayer();
  const video = document.createElement('video');
  video.src = sourceUrl; video.controls = true; video.autoplay = true; video.playsInline = true;
  video.style.cssText = 'width:100%;height:100%;display:block;';
  youtubePlayerFrame.replaceChildren(video);
  youtubePlayerOverlay.setAttribute('aria-label','Video player');
  youtubeExternalLink.href = sourceUrl; youtubeExternalLink.textContent = 'Open video';
  youtubePlayerOverlay.classList.add('is-open'); youtubePlayerOverlay.setAttribute('aria-hidden','false');
  if (!youtubePlayerOverlay.open) youtubePlayerOverlay.showModal();
  youtubePlayerClose.focus({preventScroll:true});
}

function openNoteVideo(sourceUrl) {
  ensurePlayer();
  let url;
  try { url = new URL(sourceUrl); if (!['http:','https:'].includes(url.protocol)) return; } catch { return; }
  const kind = getNoteVideoKind(url.href);
  if (kind === 'file') { openNoteVideoFile(url.href); return; }
  let embedUrl = url.href, title = 'Video player', externalLabel = 'Open video';
  if (kind === 'youtube') {
    embedUrl = `https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(url.href)}?autoplay=1&rel=0`;
    title = 'YouTube video player'; externalLabel = 'Open on YouTube';
  } else if (kind === 'facebook') {
    // Same Facebook embed route used in PN.html.
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.href)}&show_text=false&width=900&autoplay=true`;
    title = 'Facebook video player'; externalLabel = 'Open on Facebook';
  } else if (kind === 'vimeo') {
    const parts = url.pathname.split('/').filter(Boolean), index = parts.findIndex(part => /^\d+$/.test(part));
    const embed = new URL('https://player.vimeo.com/video/' + parts[index]);
    embed.searchParams.set('autoplay','1');
    const hash = url.searchParams.get('h') || parts[index + 1];
    if (hash && /^[a-z0-9]+$/i.test(hash)) embed.searchParams.set('h',hash);
    embedUrl = embed.href; title = 'Vimeo video player'; externalLabel = 'Open on Vimeo';
  }
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl; iframe.title = title;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true; iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  youtubePlayerOverlay.setAttribute('aria-label',title);
  youtubePlayerFrame.replaceChildren(iframe);
  youtubeExternalLink.href = url.href; youtubeExternalLink.textContent = externalLabel;
  youtubePlayerOverlay.classList.add('is-open'); youtubePlayerOverlay.setAttribute('aria-hidden','false');
  if (!youtubePlayerOverlay.open) youtubePlayerOverlay.showModal();
  youtubePlayerClose.focus({preventScroll:true});
}

  window.CEPNoteVideoLinks = Object.freeze({version:2,decorate:decorateNoteVideoLinks,kind:getNoteVideoKind,youtubeId:getYouTubeVideoId});
  // Handle these links before search card copy/navigation handlers, including full-note previews.
  window.addEventListener('click',event=>{
    const link=event.target.closest?.('.cep-search-source[data-source-file="chatgptx.html"] a.cep-note-video-link');
    if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    event.preventDefault(); event.stopImmediatePropagation(); openNoteVideo(link.href);
  },true);
})();
