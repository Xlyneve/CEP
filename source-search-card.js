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
    '.source-body{min-width:0}.source-body img,.source-image{height:auto;max-width:100%;cursor:zoom-in}' +
    '.source-body table{max-width:100%}.source-body [contenteditable]{cursor:inherit}' +
    '.source-url a{cursor:pointer}.source-body mark.cep-search-match{background:rgba(255,237,125,.72);color:inherit;padding:0 1px;border-radius:3px}' +
    '.xgpt-concept-link,.cep-xgpt-concept{display:inline;color:inherit;font-weight:600;text-decoration:none;border-bottom:1px dotted rgba(90,72,82,.5);cursor:pointer}' +
    '.xgpt-concept-link.has-image,.cep-xgpt-concept.has-image{cursor:zoom-in}';
}
function applyStyles(shadow,file) {
  let sheet=sheets.get(file);
  if (!sheet) { const css=cssFor(file); try { sheet=new CSSStyleSheet();sheet.replaceSync(css); } catch { sheet=css; } sheets.set(file,sheet); }
  if(typeof sheet==='string'){const style=document.createElement('style');style.textContent=sheet;shadow.append(style);}else shadow.adoptedStyleSheets=[sheet];
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
  close.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>dialog.remove());
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
    // Saved highlights retain their source style; only new matches get search yellow.
    body.querySelectorAll('mark:not([class]):not([style])').forEach(mark=>mark.classList.add('cep-search-match'));
  });
  if(profile.themed&&profile.offset>=0&&!sourceCardDefinitions[file].savedColor){
    const seed=`${file.toLowerCase()}:${profile.offset+(entry.sourceIndex||0)}::${sourceCardDefinitions[file].card}`;
    source.style.backgroundColor=`rgba(${palette[hash(seed)%palette.length]}, 0.74)`;
    source.style.color='#39190f';
  }
  source.querySelectorAll('table').forEach(table=>{table.tabIndex=0;table.setAttribute('aria-label','Enlarge table');table.setAttribute('aria-haspopup','dialog');table.style.cursor='zoom-in';});
  shadow.addEventListener('keydown',event=>{if(event.target.matches?.('table')&&['Enter',' '].includes(event.key)){event.preventDefault();event.stopPropagation();zoomTable(event.target,file);}});
  shadow.append(source);card.append(host);
  card.classList.add('cep-search-card','cep-source-preview');
  card.style.cssText+=';display:block;padding:0;border:0;background:transparent;box-shadow:none;min-height:0;color:inherit;text-decoration:none';
  card.setAttribute('aria-label',entry.title||entry.sourceTitle||'Open note');
  shadow.addEventListener('click',event=>{
    const target=event.target;
    if(target.closest?.('.xgpt-concept-link,.cep-xgpt-concept'))return;
    if(target.closest?.('a')){event.stopPropagation();return;}
    const image=target.closest?.('img');if(image){event.preventDefault();event.stopPropagation();zoomImage(image);return;}
    const table=target.closest?.('table');if(table){event.preventDefault();event.stopPropagation();zoomTable(table,file);}
  });
  return true;
}
