import './concept-photo-gallery.js?v=20261003-1';

function installViewerStyles(){
 if(document.getElementById('cep-shared-media-viewer-style'))return;
 const style=document.createElement('style');style.id='cep-shared-media-viewer-style';style.textContent=`.cep-search-image-viewer[hidden] { display:none !important; }
.cep-search-image-viewer {
  position:fixed; inset:0; z-index:2147483647; display:flex; align-items:center; justify-content:center;
  padding:clamp(10px,3vw,28px); box-sizing:border-box; background:rgba(18,17,18,.82);
}
.cep-search-image-viewer-panel {
  display:flex; flex-direction:column; width:min(1200px,96vw); height:min(900px,92dvh); min-width:0;
  padding:0; box-sizing:border-box; border:0; border-radius:0; background:transparent; box-shadow:none;
}
.cep-search-image-viewer-controls { display:flex; flex:0 0 auto; justify-content:flex-end; gap:7px; padding:0 0 9px; }
.cep-search-image-viewer-controls button {
  min-width:34px; height:32px; padding:0 10px; border:1px solid rgba(255,255,255,.30); border-radius:9px;
  background:rgba(35,32,34,.82); color:#fff; font:700 12px/1 Arial,sans-serif; cursor:pointer;
}
.cep-search-image-viewer-controls button:hover,.cep-search-image-viewer-controls button:focus-visible { background:rgba(219,158,131,.92); color:#30292c; outline:none; }
.cep-search-image-viewer-controls .cep-search-image-viewer-close { margin-left:auto; font-size:21px; }
.cep-search-image-viewer-viewport {
  flex:1 1 auto; min-width:0; min-height:0; overflow:auto; padding:0; box-sizing:border-box;
  border:0; border-radius:0; background:transparent; overscroll-behavior:contain; touch-action:pan-x pan-y;
}
.cep-search-image-viewer-stage { position:relative; min-width:100%; min-height:100%; }
.cep-search-image-viewer-image {
  position:absolute; top:0; left:0; display:block; max-width:none !important; max-height:none !important;
  margin:0; border:0; border-radius:0; background:transparent; box-shadow:none; transform-origin:top left; cursor:grab;
}
.cep-search-image-viewer-image:active { cursor:grabbing; }
.cep-global-search-result img,.cep-structured-rich-content img,.cep-xgpt-rich-content img { cursor:zoom-in; }
.cep-search-table-zoom[hidden] { display:none !important; }
.cep-search-table-zoom {
  position:fixed; inset:0; z-index:2147483647; display:flex; align-items:center; justify-content:center;
  padding:clamp(10px,3vw,28px); box-sizing:border-box; background:rgba(25,22,24,.72);
}
/* Keep the expanded table floating like the photo viewer in every theme. */
html:root:root:root:root:root:root:root body .cep-search-table-zoom {
  background:rgba(18,20,26,.35) !important;
  backdrop-filter:blur(10px) !important;
  -webkit-backdrop-filter:blur(10px) !important;
}
html:root:root:root:root:root:root:root body .cep-search-table-zoom :is(.cep-search-table-zoom-panel,.cep-search-table-zoom-viewport,.cep-search-table-zoom-stage,.cep-search-table-zoom-controls) {
  background:transparent !important; background-image:none !important;
  border:0 !important; border-radius:0 !important; box-shadow:none !important;
  backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
}
html:root:root:root:root:root:root:root body .cep-search-table-zoom :is(.cep-search-table-zoom-panel,.cep-search-table-zoom-viewport,.cep-search-table-zoom-stage,.cep-search-table-zoom-controls)::before,
html:root:root:root:root:root:root:root body .cep-search-table-zoom :is(.cep-search-table-zoom-panel,.cep-search-table-zoom-viewport,.cep-search-table-zoom-stage,.cep-search-table-zoom-controls)::after {
  content:none !important; display:none !important;
}
html:root:root:root:root:root:root:root body .cep-search-table-zoom-controls button {
  font-weight:400 !important;
}
.cep-search-table-zoom-panel {
  display:flex; flex-direction:column; width:min(1100px,96vw); height:min(820px,92dvh); min-width:0;
  padding:0; box-sizing:border-box; border:0; border-radius:0; background:transparent; box-shadow:none;
}
.cep-search-table-zoom-controls { display:flex; flex:0 0 auto; justify-content:flex-end; gap:7px; padding:0 0 9px; }
.cep-search-table-zoom-controls button {
  min-width:34px; height:32px; padding:0 10px; border:1px solid rgba(120,99,108,.24); border-radius:9px;
  background:rgba(255,255,255,.88); color:#40363b; font:700 12px/1 Arial,sans-serif; cursor:pointer;
}
.cep-search-table-zoom-controls button:hover,.cep-search-table-zoom-controls button:focus-visible { background:var(--page-header-glass,rgba(219,158,131,.82)); outline:none; }
.cep-search-table-zoom-controls .cep-search-table-zoom-close { margin-left:auto; font-size:21px; }
.cep-search-table-zoom-viewport {
  flex:1 1 auto; min-width:0; min-height:0; overflow:auto; padding:0; box-sizing:border-box;
  border-radius:0; background:transparent; overscroll-behavior:contain; touch-action:pan-x pan-y;
}
.cep-search-table-zoom-stage { position:relative; min-width:100%; min-height:100%; }
.cep-search-table-zoom-content {
  position:absolute; top:0; left:0; margin:0;
  border-collapse:collapse; table-layout:auto; border-radius:8px; transform-origin:top left;
  background:#ecebeb; color:#40363b;
  box-shadow:0 6px 14px rgba(50,38,44,.20),inset 0 1px 0 rgba(255,255,255,.68);
}
.cep-search-table-zoom-content th,.cep-search-table-zoom-content td {
  padding:4px 6px; border:1px solid rgba(112,126,125,.30); background:#ecebeb;
  text-align:left; vertical-align:top; overflow-wrap:normal;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.48),inset 0 -1px 0 rgba(72,55,63,.07);
}
.cep-search-table-zoom-content tbody tr:nth-child(even) td { background:#f2edf4; }
.cep-search-table-zoom-content th,.cep-search-table-zoom-content thead td { background:#d5d0d3; font-weight:700; }

html:root:root:root:root:root:root:root:root body :is(.cep-search-image-viewer,.cep-search-table-zoom) {background:rgba(18,20,26,.35)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;}
html:root:root:root:root:root:root:root:root body :is(.cep-search-image-viewer-panel,.cep-search-table-zoom-panel) {position:relative!important;display:flex!important;flex-direction:column!important;width:min(1100px,96vw)!important;height:min(820px,92dvh)!important;max-width:100%!important;max-height:100%!important;margin:0!important;transform:none!important;}
html:root:root:root:root:root:root:root:root body :is(.cep-search-image-viewer-panel,.cep-search-table-zoom-panel,.cep-search-image-viewer-viewport,.cep-search-image-viewer-stage,.cep-search-image-viewer-controls) {background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}
html:root:root:root:root:root:root:root:root body :is(.cep-search-image-viewer-panel,.cep-search-table-zoom-panel,.cep-search-image-viewer-viewport,.cep-search-image-viewer-stage,.cep-search-image-viewer-controls)::before,
html:root:root:root:root:root:root:root:root body :is(.cep-search-image-viewer-panel,.cep-search-table-zoom-panel,.cep-search-image-viewer-viewport,.cep-search-image-viewer-stage,.cep-search-image-viewer-controls)::after {content:none!important;display:none!important;}
html:root:root:root:root:root:root:root:root body :is(.cep-search-image-viewer-controls,.cep-search-table-zoom-controls) button {position:static!important;min-width:36px!important;height:36px!important;padding:0 10px!important;border:1px solid rgba(255,255,255,.6)!important;border-radius:8px!important;background:rgba(20,20,25,.7)!important;color:#fff!important;-webkit-text-fill-color:#fff!important;font:400 16px/1 Tahoma,sans-serif!important;box-shadow:none!important;transform:none!important;}
html:root:root:root:root:root:root:root:root body .cep-search-image-viewer {z-index:2147483647!important;}
html:root:root:root:root:root:root:root:root body .cep-search-table-zoom {z-index:2147483644!important;}
`;document.head.append(style);
}

let imageZoomUi;
function getSearchImageZoomUi() {
  if (imageZoomUi?.root?.isConnected) return imageZoomUi;
  installViewerStyles();
  const root = document.createElement('div'); root.className = 'cep-search-image-viewer'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Expanded image');
  const panel = document.createElement('div'); panel.className = 'cep-search-image-viewer-panel';
  const controls = document.createElement('div'); controls.className = 'cep-search-image-viewer-controls';
  const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.title = 'Zoom out'; minus.setAttribute('aria-label', 'Zoom out');
  const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = '100%'; reset.title = 'Reset zoom';
  const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.title = 'Zoom in'; plus.setAttribute('aria-label', 'Zoom in');
  const close = document.createElement('button'); close.type = 'button'; close.className = 'cep-search-image-viewer-close'; close.textContent = '×'; close.title = 'Close'; close.setAttribute('aria-label', 'Close expanded image');
  controls.append(minus, reset, plus, close);
  const viewport = document.createElement('div'); viewport.className = 'cep-search-image-viewer-viewport';
  const stage = document.createElement('div'); stage.className = 'cep-search-image-viewer-stage'; viewport.appendChild(stage);
  panel.append(controls, viewport); root.appendChild(panel); document.body.appendChild(root);
  let scale = 1; let image; let baseWidth = 0; let baseHeight = 0; let previousBodyOverflow = '';
  let gallery = [], galleryIndex = 0;
  const galleryNav = window.CEPPhotoGallery.navigation(index => { galleryIndex = index; show(gallery[index]); });
  galleryNav.bar.style.cssText += 'position:fixed;bottom:max(14px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:2147483646;padding:6px 10px;border-radius:12px;background:rgba(0,0,0,.65);color:white;';
  panel.appendChild(galleryNav.bar);
  const sizeStage = () => {
    if (!image || !baseWidth || !baseHeight) return;
    const scaledWidth = Math.ceil(baseWidth * scale); const scaledHeight = Math.ceil(baseHeight * scale);
    const stageWidth = Math.max(scaledWidth, viewport.clientWidth); const stageHeight = Math.max(scaledHeight, viewport.clientHeight);
    stage.style.width = `${stageWidth}px`; stage.style.height = `${stageHeight}px`;
    image.style.left = `${Math.max(0, Math.floor((stageWidth - scaledWidth) / 2))}px`;
    image.style.top = `${Math.max(0, Math.floor((stageHeight - scaledHeight) / 2))}px`;
    image.style.transform = `scale(${scale})`; reset.textContent = `${Math.round(scale * 100)}%`;
  };
  const setScale = nextScale => {
    const oldScale = scale; const centerX = viewport.scrollLeft + viewport.clientWidth / 2; const centerY = viewport.scrollTop + viewport.clientHeight / 2;
    scale = Math.min(4, Math.max(.5, nextScale)); sizeStage();
    viewport.scrollLeft = centerX * (scale / oldScale) - viewport.clientWidth / 2;
    viewport.scrollTop = centerY * (scale / oldScale) - viewport.clientHeight / 2;
  };
  const closeViewer = () => {
    if (root.hidden) return;
    root.hidden = true; stage.replaceChildren(); image = null; baseWidth = 0; baseHeight = 0;
    document.body.style.overflow = previousBodyOverflow;
    gallery = []; galleryIndex = 0;
  };
  const show = sourceImage => {
    image = sourceImage.cloneNode(true); image.removeAttribute('id'); image.className = 'cep-search-image-viewer-image';
    image.removeAttribute('loading'); image.removeAttribute('style'); stage.replaceChildren(image); scale = 1;
    galleryNav.update(galleryIndex, gallery.length);
    const currentImage = image;
    const prepare = () => requestAnimationFrame(() => {
      if (root.hidden || image !== currentImage) return;
      const sourceRect = sourceImage.getBoundingClientRect(); const naturalWidth = image.naturalWidth || sourceRect.width || 1;
      const naturalHeight = image.naturalHeight || sourceRect.height || 1;
      const fit = Math.min(1, Math.max(.01, (viewport.clientWidth - 12) / naturalWidth), Math.max(.01, (viewport.clientHeight - 12) / naturalHeight));
      baseWidth = Math.max(1, Math.round(naturalWidth * fit)); baseHeight = Math.max(1, Math.round(naturalHeight * fit));
      image.style.width = `${baseWidth}px`; image.style.height = `${baseHeight}px`; sizeStage();
      viewport.scrollTo({ left: 0, top: 0 });
    });
    if (image.complete) prepare(); else image.addEventListener('load', prepare, { once: true });
  };
  const open = (sourceImage, photos) => {
    gallery = photos?.length ? photos : window.CEPPhotoGallery.photosFor(sourceImage);
    galleryIndex = Math.max(0, gallery.indexOf(sourceImage));
    galleryNav.bar.hidden = gallery.length < 2;
    galleryNav.bar.style.display = galleryNav.bar.hidden ? 'none' : 'flex';
    if (root.hidden) previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; root.hidden = false;
    show(sourceImage); close.focus();
  };
  let drag;
  viewport.addEventListener('pointerdown',event=>{
    if(event.target!==image || event.button!==0)return;
    event.preventDefault();drag={x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
    image.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove',event=>{
    if(!drag)return;viewport.scrollLeft=drag.left+drag.x-event.clientX;viewport.scrollTop=drag.top+drag.y-event.clientY;
  });
  viewport.addEventListener('pointerup',event=>{
    if(!drag)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;drag=null;
    if(scale===1 && gallery.length>1 && Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5){
      galleryIndex=Math.max(0,Math.min(gallery.length-1,galleryIndex+(dx<0?1:-1)));show(gallery[galleryIndex]);
    }
  });
  viewport.addEventListener('pointercancel',()=>{drag=null;});
  minus.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(scale - .25); });
  plus.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(scale + .25); });
  reset.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(1); });
  close.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); closeViewer(); });
  root.addEventListener('click', event => { if (!event.target.closest('.cep-search-image-viewer-image,.cep-search-image-viewer-controls,.cep-photo-navigation')) closeViewer(); });
  document.addEventListener('keydown', event => {
    if (root.hidden) return;
    if (event.key === 'Escape') {event.preventDefault();event.stopImmediatePropagation();closeViewer();}
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && gallery.length > 1) {
      event.preventDefault(); event.stopPropagation();
      galleryIndex = Math.max(0, Math.min(gallery.length - 1, galleryIndex + (event.key === 'ArrowRight' ? 1 : -1)));
      show(gallery[galleryIndex]);
    }
  }, true);
  imageZoomUi = { root, open, close: closeViewer };
  return imageZoomUi;
}

export function openNoteImageZoom(sourceImage, photos) {
  getSearchImageZoomUi().open(sourceImage, photos);
}

export function enableSearchImageZoom(image) {
  if (!image || image.dataset.cepSearchImageZoom === 'true') return;
  image.dataset.cepSearchImageZoom = 'true'; image.tabIndex = 0; image.setAttribute('role', 'button');
  image.setAttribute('aria-label', image.alt ? `Open enlarged image: ${image.alt}` : 'Open enlarged image');
  const open = event => { event.preventDefault(); event.stopPropagation(); getSearchImageZoomUi().open(image); };
  image.addEventListener('click', open);
  image.addEventListener('dblclick', event => { event.preventDefault(); event.stopPropagation(); });
  image.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') open(event); });
}

let tableZoomUi;
function getSearchTableZoomUi() {
  if (tableZoomUi?.root?.isConnected) return tableZoomUi;
  installViewerStyles();
  const root = document.createElement('div'); root.className = 'cep-search-table-zoom'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Expanded table');
  const panel = document.createElement('div'); panel.className = 'cep-search-table-zoom-panel';
  const controls = document.createElement('div'); controls.className = 'cep-search-table-zoom-controls';
  const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.title = 'Zoom out'; minus.setAttribute('aria-label', 'Zoom out');
  const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = '100%'; reset.title = 'Reset zoom';
  const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.title = 'Zoom in'; plus.setAttribute('aria-label', 'Zoom in');
  const close = document.createElement('button'); close.type = 'button'; close.className = 'cep-search-table-zoom-close'; close.textContent = '×'; close.title = 'Close'; close.setAttribute('aria-label', 'Close expanded table');
  controls.append(minus, reset, plus, close);
  const viewport = document.createElement('div'); viewport.className = 'cep-search-table-zoom-viewport';
  const stage = document.createElement('div'); stage.className = 'cep-search-table-zoom-stage'; viewport.appendChild(stage);
  panel.append(controls, viewport); root.appendChild(panel); document.body.appendChild(root);
  let scale = 1; let table; let baseTableWidth = 0; let baseTableHeight = 0; let previousBodyOverflow = '';
  const sizeStage = () => {
    if (!table) return;
    const width = baseTableWidth || table.scrollWidth || table.getBoundingClientRect().width;
    const height = baseTableHeight || table.scrollHeight || table.getBoundingClientRect().height;
    const scaledWidth = Math.ceil(width * scale); const scaledHeight = Math.ceil(height * scale);
    const stageWidth = Math.max(scaledWidth, viewport.clientWidth);
    const stageHeight = Math.max(scaledHeight, viewport.clientHeight);
    stage.style.width = `${stageWidth}px`; stage.style.height = `${stageHeight}px`;
    table.style.left = `${Math.max(0, Math.floor((stageWidth - scaledWidth) / 2))}px`;
    table.style.top = `${Math.max(0, Math.floor((stageHeight - scaledHeight) / 2))}px`;
    table.style.transform = `scale(${scale})`; reset.textContent = `${Math.round(scale * 100)}%`;
  };
  const setScale = nextScale => {
    const oldScale = scale; const centerX = viewport.scrollLeft + viewport.clientWidth / 2; const centerY = viewport.scrollTop + viewport.clientHeight / 2;
    scale = Math.min(3, Math.max(.5, nextScale)); sizeStage();
    viewport.scrollLeft = centerX * (scale / oldScale) - viewport.clientWidth / 2;
    viewport.scrollTop = centerY * (scale / oldScale) - viewport.clientHeight / 2;
  };
  const closeZoom = () => {
    if (root.hidden) return;
    root.hidden = true; stage.replaceChildren(); table = null; document.body.style.overflow = previousBodyOverflow;
  };
  const open = sourceTable => {
    const sourceRect = sourceTable.getBoundingClientRect(); const sourceStyle = getComputedStyle(sourceTable);
    table = sourceTable.cloneNode(true); table.querySelectorAll('[id]').forEach(element => element.removeAttribute('id')); table.removeAttribute('id');
    table.style.setProperty('width', `${sourceRect.width}px`, 'important');
    table.style.setProperty('min-width', `${sourceRect.width}px`, 'important');
    table.style.setProperty('max-width', `${sourceRect.width}px`, 'important');
    table.style.setProperty('font-family', sourceStyle.fontFamily, 'important');
    table.style.setProperty('font-size', sourceStyle.fontSize, 'important');
    table.style.setProperty('line-height', sourceStyle.lineHeight, 'important');
    const sourceCells = [...sourceTable.querySelectorAll('th,td')]; const clonedCells = [...table.querySelectorAll('th,td')];
    clonedCells.forEach((cell, index) => {
      const sourceCell = sourceCells[index]; if (!sourceCell) return;
      const cellRect = sourceCell.getBoundingClientRect(); const cellStyle = getComputedStyle(sourceCell);
      cell.style.setProperty('width', `${cellRect.width}px`, 'important');
      cell.style.setProperty('min-width', `${cellRect.width}px`, 'important');
      cell.style.setProperty('max-width', `${cellRect.width}px`, 'important');
      cell.style.setProperty('white-space', cellStyle.whiteSpace, 'important');
      cell.style.setProperty('padding', cellStyle.padding, 'important');
      cell.style.setProperty('text-align', cellStyle.textAlign, 'important');
      cell.style.setProperty('vertical-align', cellStyle.verticalAlign, 'important');
    });
    // Cloned PN words use the shared delegated preview, including on PN itself.
    table.querySelectorAll('.pn-definition[data-pn-definition]').forEach(word=>word.classList.add('cep-shared-definition'));
    table.classList.add('cep-search-table-zoom-content'); stage.replaceChildren(table); scale = 1;
    previousBodyOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; root.hidden = false;
    requestAnimationFrame(() => {
      baseTableWidth = sourceRect.width; baseTableHeight = table.scrollHeight || sourceRect.height;
      sizeStage(); viewport.scrollTo({ left: 0, top: 0 }); close.focus();
    });
  };
  minus.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(scale - .25); });
  plus.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(scale + .25); });
  reset.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(1); });
  close.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); closeZoom(); });
  panel.addEventListener('click', event => event.stopPropagation());
  root.addEventListener('click', event => { if (event.target === root) closeZoom(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !root.hidden && (!imageZoomUi || imageZoomUi.root.hidden)) {event.preventDefault();event.stopImmediatePropagation();closeZoom();} },true);
  tableZoomUi = { root, open, close: closeZoom };
  return tableZoomUi;
}

export function openNoteTableZoom(table) {
  if (table) getSearchTableZoomUi().open(table);
}

export function enableSearchTableZoom(table) {
  if (!table || table.dataset.cepSearchTableZoom === 'true') return;
  table.dataset.cepSearchTableZoom = 'true'; table.tabIndex = 0;
  table.setAttribute('aria-label', 'Open enlarged table');
  const open = event => { event.preventDefault(); event.stopPropagation(); getSearchTableZoomUi().open(table); };
  table.addEventListener('click', open);
  table.addEventListener('dblclick', event => { event.preventDefault(); event.stopPropagation(); });
  table.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') open(event); });
}

