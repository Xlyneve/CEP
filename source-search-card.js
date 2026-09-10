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
function zoomImage(image) {
  const dialog=document.createElement('dialog');
  dialog.setAttribute('aria-label','Note image');
  dialog.style.cssText='padding:12px;border:0;border-radius:12px;max-width:94vw;max-height:94vh;background:#fff';
  const full=document.createElement('img');full.src=image.currentSrc||image.src;full.alt=image.alt||'Note image';full.style.cssText='display:block;max-width:90vw;max-height:82vh;object-fit:contain';
  const close=document.createElement('button');close.type='button';close.textContent='Close image';close.style.cssText='display:block;margin:8px auto 0;padding:6px 12px;cursor:pointer';
  close.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>dialog.remove());
  dialog.append(full,close);document.body.append(dialog);dialog.showModal();
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
  shadow.append(source);card.append(host);
  card.classList.add('cep-search-card','cep-source-preview');
  card.style.cssText+=';display:block;padding:0;border:0;background:transparent;box-shadow:none;min-height:0;color:inherit;text-decoration:none';
  card.setAttribute('aria-label',entry.title||entry.sourceTitle||'Open note');
  shadow.addEventListener('click',event=>{
    const target=event.target;
    if(target.closest?.('.xgpt-concept-link,.cep-xgpt-concept'))return;
    if(target.closest?.('a')){event.stopPropagation();return;}
    const image=target.closest?.('img');if(image){event.preventDefault();event.stopPropagation();zoomImage(image);}
  });
  return true;
}
