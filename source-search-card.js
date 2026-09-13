import { createSourceCard, sourceCardDefinitions } from './source-card-model.js';
import { sourceCardProfiles, sourceCardRules } from './source-card-styles.js';
const sheets = new Map();
const palette = ['229, 203, 204','211, 224, 223','225, 226, 195','239, 237, 232','219, 158, 131'];
function hash(value) { let result=2166136261; for(let i=0;i<value.length;i++){result^=value.charCodeAt(i);result=Math.imul(result,16777619);}return result>>>0; }
function cssFor(file) {
  const profile=sourceCardProfiles[file];
  return ':host{display:block;min-width:0;width:100%;text-align:left;contain:style}*{box-sizing:border-box}' +
    Object.entries(profile.styles).map(([selector,index])=>{
      let css=sourceCardRules[index];
      if (['note-card','note-tile'].includes(sourceCardDefinitions[file].card) && /(?:table|th|td)$/.test(selector)) {
        css=css.split(';').map(rule=>/^(?:background-color|background-image|border|padding|border-collapse|border-spacing|color|max-width):/.test(rule)?rule+' !important':rule).join(';');
        if(selector.endsWith('table'))css+=';width:100% !important;min-width:0 !important;margin:8px 0 !important';
        else css+=';min-width:48px !important';
      }
      return `${selector}{${css}}`;
    }).join('\n') +
    '.source-card{width:100%;min-width:0;max-width:100%;height:auto;margin:0;position:relative;overflow-wrap:anywhere}' +
    '.source-body{min-width:0;max-width:100%;overflow-x:auto}.source-body img,.source-image{height:auto !important;max-width:100% !important;cursor:zoom-in}' +
    '.source-table-scroll{display:block;width:100%;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}' +
    '.source-table-hint{display:block;font:12px/1.4 Arial,sans-serif;color:#655b60;margin:6px 0 3px}' +
    '.source-body table{max-width:100%}.source-body [contenteditable]{cursor:inherit}' +
    '.source-url a{cursor:pointer}.source-body mark.cep-search-match{background:rgba(255,237,125,.72);color:inherit;padding:0 1px;border-radius:3px}' +
    '.xgpt-concept-link,.cep-xgpt-concept{display:inline;color:#9a3f00!important;font-weight:600;text-decoration:none!important;border-bottom:0;cursor:pointer}' +
    '.xgpt-concept-link.has-image,.cep-xgpt-concept.has-image{cursor:zoom-in}.xgpt-concept-link.has-image:after,.cep-xgpt-concept.has-image:after{content:"";display:inline-block;width:8px;height:8px;margin-left:4px;border-radius:50%;background:#ffb000;box-shadow:0 0 0 2px rgba(255,255,255,.9),0 0 8px rgba(255,176,0,.95);vertical-align:middle}' +
    '.source-card.copy-feedback{transform-origin:center;animation:copyGlassSquish 400ms cubic-bezier(.22,.72,.2,1)}' +
    '.copy-feedback-layer{position:absolute!important;inset:0;z-index:100!important;overflow:hidden;border-radius:inherit;pointer-events:none}' +
    '.copy-feedback-border{display:block;width:100%;height:100%;overflow:visible}.copy-feedback-border rect{fill:none;stroke:#fff;stroke-width:4.5;stroke-linecap:round;stroke-dasharray:26 74;stroke-dashoffset:var(--copy-race-start);vector-effect:non-scaling-stroke;filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 10px rgba(255,255,255,.88));animation:copyBorderRace 820ms cubic-bezier(.3,.65,.25,1) forwards}' +
    '.copy-feedback-layer:after{content:"";position:absolute;inset:-20% -45%;background:linear-gradient(110deg,transparent 32%,rgba(190,210,255,.12) 40%,rgba(255,255,255,.72) 49%,rgba(255,255,255,.3) 55%,transparent 65%);transform:translateX(-65%);animation:copyGlassShimmer 430ms ease-out forwards}' +
    '@keyframes copyGlassSquish{0%{transform:translateY(0) scale(1)}28%{transform:translateY(2px) scaleX(1.018) scaleY(.955)}62%{transform:translateY(0) scaleX(.99) scaleY(1.015)}82%{transform:translateY(0) scaleX(1.004) scaleY(.997)}100%{transform:translateY(0) scale(1)}}@keyframes copyGlassShimmer{from{transform:translateX(-65%);opacity:0}22%{opacity:1}to{transform:translateX(65%);opacity:0}}@keyframes copyBorderRace{0%{stroke-dashoffset:var(--copy-race-start);opacity:.25}12%{opacity:1}100%{stroke-dashoffset:var(--copy-race-end);opacity:0}}';
}
function applyStyles(shadow,file) {
  let sheet=sheets.get(file);
  if (!sheet) { const css=cssFor(file); try { sheet=new CSSStyleSheet();sheet.replaceSync(css); } catch { sheet=css; } sheets.set(file,sheet); }
  if(typeof sheet==='string'){const style=document.createElement('style');style.textContent=sheet;shadow.append(style);}else shadow.adoptedStyleSheets=[sheet];
}
function applyTableTheme(table,file) {
  if (!['note-card','note-tile'].includes(sourceCardDefinitions[file].card)) return;
  const styles=sourceCardProfiles[file].styles;
  const property=(selector,name)=>{
    const rule=sourceCardRules[styles[selector]] || '';
    return rule.split(';').find(value=>value.startsWith(name+':'))?.slice(name.length+1);
  };
  const base=property('.source-body table','background-color');
  const alternate=property('.source-body tr:nth-child(even) td','background-color');
  const border=property('.source-body table','border');
  // Match the source page's display-time theme, including legacy inline !important colours.
  if(base)table.style.setProperty('background',base,'important');
  if(border)table.style.setProperty('border',border,'important');
  table.querySelectorAll('td,th').forEach(cell=>{
    const colour=cell.parentElement.rowIndex % 2 ? alternate : base;
    if(colour)cell.style.setProperty('background',colour,'important');
    if(border)cell.style.setProperty('border',border,'important');
  });
}
function safeAsset(value,image=false) {
  if(!value)return '';
  try {const url=new URL(value,location.href);return ['http:','https:'].includes(url.protocol)||(image&&/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(value))?url.href:'';}catch{return '';}
}
function openZoom(full, label) {
  const dialog=document.createElement('dialog');
  dialog.setAttribute('aria-label',label);
  dialog.style.cssText='padding:12px;border:0;border-radius:12px;max-width:94vw;max-height:94vh;background:#fff';
  const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Close '+label.toLowerCase());close.title='Close '+label.toLowerCase();close.className='cep-image-close';
  const closeStyle=document.createElement('style');closeStyle.textContent='.cep-image-close{display:block;width:36px;height:36px;margin:10px auto 0;padding:0;border:1px solid rgba(255,255,255,.88);border-radius:12px;background:rgba(229,203,204,.55);color:#40363b;font:400 24px/1 Arial,sans-serif;box-shadow:0 3px 10px rgba(63,52,57,.08);backdrop-filter:blur(12px);cursor:pointer}.cep-image-close:hover{background:rgba(229,203,204,.8)}.cep-image-close:focus-visible{outline:2px solid #6a6166;outline-offset:3px}';dialog.append(closeStyle);
  close.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{event.stopPropagation();if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>dialog.remove());
  dialog.append(full,close);document.body.append(dialog);dialog.showModal();
}
function zoomImage(image) {
  const full=document.createElement('img');full.src=image.currentSrc||image.src;full.alt=image.alt||'Note image';full.style.cssText='display:block;max-width:90vw;max-height:82vh;object-fit:contain';
  openZoom(full,'Image');
}
function zoomTable(table,file) {
  const full=document.createElement('div');full.style.cssText='width:max-content;max-width:calc(94vw - 24px);max-height:76vh;overflow:auto;margin:0 auto;text-align:left';
  const shadow=full.attachShadow({mode:'open'});applyStyles(shadow,file);
  const body=document.createElement('div');body.className='source-body';
  const copy=table.cloneNode(true);copy.removeAttribute('tabindex');copy.removeAttribute('aria-label');copy.removeAttribute('aria-haspopup');
  body.append(copy);shadow.append(body);
  const style=document.createElement('style');style.textContent=':host .source-body{width:max-content;max-width:none;margin:0}:host .source-body table{width:max-content !important;min-width:0 !important;max-width:none !important;margin:0 !important;cursor:default !important}:host .source-body td,:host .source-body th{max-width:60vw;overflow-wrap:anywhere}';shadow.append(style);
  openZoom(full,'Table');
}
function showCopyFeedback(card,clientX,clientY) {
  clearTimeout(card._copyFeedbackTimer);card.querySelector('.copy-feedback-layer')?.remove();card.classList.remove('copy-feedback');void card.offsetWidth;
  const bounds=card.getBoundingClientRect(),width=Math.max(bounds.width,1),height=Math.max(bounds.height,1);
  const x=Number.isFinite(clientX)?Math.min(Math.max(clientX-bounds.left,0),width):width/2,y=Number.isFinite(clientY)?Math.min(Math.max(clientY-bounds.top,0),height):0;
  const edges=[y,width-x,height-y,x],nearest=edges.indexOf(Math.min(...edges)),perimeter=2*(width+height);
  const distance=nearest===0?x:nearest===1?width+y:nearest===2?width+height+(width-x):(2*width)+height+(height-y);
  const layer=document.createElement('span');layer.className='copy-feedback-layer';layer.setAttribute('aria-hidden','true');
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('copy-feedback-border');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('preserveAspectRatio','none');
  const border=document.createElementNS('http://www.w3.org/2000/svg','rect');border.setAttribute('x','2');border.setAttribute('y','2');border.setAttribute('width',String(Math.max(width-4,1)));border.setAttribute('height',String(Math.max(height-4,1)));border.setAttribute('rx',String(Math.min(parseFloat(getComputedStyle(card).borderRadius)||12,width/2,height/2)));border.setAttribute('pathLength','100');
  const start=(distance/perimeter)*100;border.style.setProperty('--copy-race-start',String(-start));border.style.setProperty('--copy-race-end',String(-(start+100)));
  svg.append(border);layer.append(svg);card.append(layer);card.classList.add('copy-feedback');
  card._copyFeedbackTimer=setTimeout(()=>{layer.remove();card.classList.remove('copy-feedback');card._copyFeedbackTimer=null;},900);
}
async function copySourceBody(source,mode,event) {
  const body=source.querySelector('.source-body');if(!body)return;
  let plain=body.innerText;if(mode==='plain-normalized')plain=plain.replace(/\r\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
  if(!plain.trim())return;
  if(mode==='rich'&&navigator.clipboard?.write&&window.ClipboardItem) {
    try {await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([body.innerHTML],{type:'text/html'}),'text/plain':new Blob([plain],{type:'text/plain'})})]);showCopyFeedback(source,event.clientX,event.clientY);return;} catch {}
  }
  if(mode==='rich') {
    const onCopy=copyEvent=>{copyEvent.preventDefault();copyEvent.clipboardData.setData('text/html',body.innerHTML);copyEvent.clipboardData.setData('text/plain',plain);};
    document.addEventListener('copy',onCopy,{once:true});
    if(document.execCommand('copy')){showCopyFeedback(source,event.clientX,event.clientY);return;}
    document.removeEventListener('copy',onCopy);
  }
  if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(plain);
  else {const textarea=document.createElement('textarea');textarea.value=plain;document.body.append(textarea);textarea.select();document.execCommand('copy');textarea.remove();}
  showCopyFeedback(source,event.clientX,event.clientY);
}
function addSearchCardInteraction(card,source,file) {
  const mode=sourceCardDefinitions[file].copy;if(!mode)return;
  let timer=0,navigating=false;
  const interactive=event=>event.composedPath().some(node=>node!==card&&node.matches?.('a,button,input,textarea,[contenteditable="true"],img,table'));
  const navigate=()=>{if(navigating)return;navigating=true;card.dataset.cepSearchNavigate='1';card.click();delete card.dataset.cepSearchNavigate;};
  card.addEventListener('click',event=>{
    if(card.dataset.cepSearchNavigate||event.detail===0||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.defaultPrevented||interactive(event))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(event.detail>1){clearTimeout(timer);navigate();return;}
    clearTimeout(timer);timer=setTimeout(()=>copySourceBody(source,mode,event).catch(error=>console.error('Copy failed',error)),240);
  },true);
  card.addEventListener('dblclick',event=>{if(interactive(event))return;event.preventDefault();event.stopImmediatePropagation();clearTimeout(timer);navigate();},true);
}
export function renderSourceCard(card,entry,terms,renderRich) {
  const file=entry.sourcePage||entry.file;
  const profile=sourceCardProfiles[file];
  if(!profile||!entry.record?.data)return false;
  const data={...entry.record.data};if(data.color&&!CSS.supports('color',data.color))data.color='';data.image=safeAsset(data.image,true);data.url=safeAsset(data.url);
  const host=document.createElement('span');host.className='cep-source-card-host';
  const shadow=host.attachShadow({mode:'open'});applyStyles(shadow,file);
  const source=createSourceCard(document,file,data,(body,html)=>{
    renderRich(body,html,terms);
    body.querySelectorAll('[contenteditable]').forEach(el=>el.removeAttribute('contenteditable'));
  });
  if(profile.themed&&profile.offset>=0&&!sourceCardDefinitions[file].savedColor){
    const seed=`${file.toLowerCase()}:${profile.offset+(entry.sourceIndex||0)}::${sourceCardDefinitions[file].card}`;
    source.style.backgroundColor=`rgba(${palette[hash(seed)%palette.length]}, 0.74)`;
    source.style.color='#39190f';
  }
  source.querySelectorAll('table').forEach(table=>{
    applyTableTheme(table,file);table.tabIndex=0;table.setAttribute('aria-label','Enlarge table');table.setAttribute('aria-haspopup','dialog');table.style.cursor='zoom-in';
    if(table.parentElement.closest('table'))return;
    const hint=document.createElement('span');hint.className='source-table-hint';hint.textContent='Swipe sideways for more columns · Tap table to enlarge';
    const scroll=document.createElement('div');scroll.className='source-table-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','Scrollable table');
    table.before(hint,scroll);scroll.append(table);
  });
  shadow.addEventListener('keydown',event=>{if(event.target.matches?.('table')&&['Enter',' '].includes(event.key)){event.preventDefault();event.stopPropagation();zoomTable(event.target,file);}});
  shadow.append(source);card.append(host);
  card.classList.add('cep-search-card','cep-source-preview');
  card.style.cssText+=';display:block;padding:0;border:0;background:transparent;box-shadow:none;min-height:0;color:inherit;text-decoration:none';
  card.setAttribute('aria-label',entry.title||entry.sourceTitle||'Open note');
  addSearchCardInteraction(card,source,file);
  shadow.addEventListener('click',event=>{
    const target=event.target;
    if(target.closest?.('.xgpt-concept-link,.cep-xgpt-concept'))return;
    if(target.closest?.('a')){event.stopPropagation();return;}
    const image=target.closest?.('img');if(image){event.preventDefault();event.stopPropagation();zoomImage(image);return;}
    const table=target.closest?.('table');if(table){event.preventDefault();event.stopPropagation();zoomTable(table,file);}
  });
  return true;
}
