import { readStyleRules, splitStyleText } from './search-style-parser.js?v=20261012-1';
// Presentation only: no Firebase imports, reads, source-page scripts, or iframe loads.
const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = new URL('./search-source-cards.css?v=20261012-1', import.meta.url).href;
document.head.append(stylesheet);
const classes = {'note-card':'cep-source-surface','note-tile':'cep-source-notebook','chatBubble':'cep-source-chat','file-item':'cep-source-form','note-title':'cep-source-title','note-text':'cep-source-text','note-content':'cep-source-content'};
const supported = new Set(['pn.html','info.html','explain.html','practicen.html','recalls.html','clinicalnotes.html','notes.html','ecg.html','urgent_care.html','face.html','hand.html','sha.html','abdo.html','spine.html','lf.html','forms.html','chatgptx.html']);
const pageContexts = {'theme-pn':['pn.html'],'theme-info':['info.html'],'theme-explain':['explain.html'],'theme-practice':['practicen.html'],'theme-recalls':['recalls.html'],'theme-clinical':['clinicalnotes.html'],'theme-urgent-care':['urgent_care.html','face.html','hand.html','sha.html','abdo.html','spine.html','lf.html']};
let installed = false;
function installThemeStyles() {
  const themeStyle = document.getElementById('xlyneve-color-theme-styles');
  if (installed || !themeStyle) return;
  const output = [];
  function compile(rules) {
    let css = '';
    for (const rule of rules) {
      if (rule.rules) { const inner = compile(rule.rules); if(inner) css += `${rule.header}{${inner}}`; continue; }
      if (!rule.declarations) continue;
      const selectors = [];
      for (const rawSelector of splitStyleText(rule.header, ',')) {
        if (!/\.(note-card|note-tile|chatBubble|file-item)\b/.test(rawSelector)) continue;
        if (/copy-feedback|copied-feedback|editing-note/.test(rawSelector.replace(/:not\([^)]*\)/g,''))) continue;
        let selector = rawSelector.trim().replace(/\.([\w-]+)/g,(all,name)=>classes[name]?'.'+classes[name]:all);
        const context = Object.keys(pageContexts).find(name=>selector.includes('.'+name));
        if (selector.includes('body:has(#chat)')) {
          if (selector.includes('.message.user')) continue;
          selector = selector.replace('body:has(#chat)','html body .cep-search-source[data-source-file="chatgptx.html"]:not(#cep-source-no-chat-id)');
        } else if (context) {
          const hadListId = selector.includes('#notesList');
          selector = selector.replace('.'+context,'').replace(/#notesList\s*>?\s*/g,'');
          const source = `:is(${pageContexts[context].map(file=>`.cep-search-source[data-source-file="${file}"]`).join(',')})${hadListId?':not(#cep-source-no-list-id)':''}`;
          if (/\bbody\s+/.test(selector)) selector = selector.replace(/\bbody\s+/g,`body ${source} `);
          else selector = selector.replace(/^(\S+)\s+/, `$1 ${source} `);
        } else {
          if (/\bbody\s+/.test(selector)) selector = selector.replace(/\bbody\s+/g,'body .cep-search-source ');
          else selector = selector.replace(/^(\S+)\s+/, '$1 .cep-search-source ');
        }
        selector = selector.replace(/\bhtml(?=[:[.\s])/g,'html:root:root:root:root:root');
        selectors.push(selector);
      }
      if (selectors.length) css += `${selectors.join(',')}{${rule.body}}`;
    }
    return css;
  }
  output.push(compile(readStyleRules(themeStyle.textContent)));
  output.push(`
    html:root:root body .cep-search-source::before,html:root:root body .cep-search-source::after { content:none !important; }
    .cep-search-source > :is(.cep-source-surface,.cep-source-chat,.cep-source-form) { display:block; position:relative; width:100%; min-width:0; height:auto; margin:0 !important; box-sizing:border-box; overflow-wrap:anywhere; }
    .cep-search-source > :is(.cep-source-surface,.cep-source-chat,.cep-source-form) > * { position:relative; z-index:1; }
    html:root:root body .cep-search-source[data-source-file="chatgptx.html"] > .cep-source-chat {
      max-height:min(480px,60vh); overflow:auto; overscroll-behavior:contain;
      -webkit-overflow-scrolling:touch;
    }
    html:root:root body .cep-search-source[data-source-file="chatgptx.html"] .cep-source-chat > :is(.cep-xgpt-rich-content,.universal-search-native-snippet) {
      min-width:560px; max-width:none; overflow-wrap:normal; word-break:normal;
    }
    html:root:root body dialog.cep-chat-search-preview {
      width:min(900px,92vw); max-height:85vh; box-sizing:border-box;
      padding:40px 12px 12px; border:1px solid var(--clinical-edge,#ddd);
      border-radius:24px; background-color:#f5f4f0;
      color:var(--theme-ink,#222); overflow:auto;
      box-shadow:0 16px 50px rgba(0,0,0,.25);
    }
    dialog.cep-chat-search-preview::backdrop { background:rgba(0,0,0,.35); }
    html:root:root body .cep-chat-preview-close {
      position:absolute; top:7px; right:12px; width:28px; height:28px;
      padding:0; font-size:22px; line-height:1; border:0; border-radius:50%;
      background:#fff; color:#333; cursor:pointer;
    }
    html:root:root body .cep-chat-search-preview .cep-search-source > .cep-source-chat {
      max-height:none; overflow:visible;
    }
    html:root:root body .cep-search-source:is([data-source-file="pn.html"],[data-source-file="recalls.html"]) a.cep-media-link { width:30px !important;height:30px !important;border-radius:9px !important; }
    html:root:root body .cep-search-source:is([data-source-file="pn.html"],[data-source-file="recalls.html"]) a.cep-media-link svg { width:18px;height:18px; }
  `);
  const style = document.createElement('style'); style.id = 'cep-search-source-theme-styles';
  style.textContent = output.join('\n'); document.head.append(style); installed = true;
}
function openChatSearchPreview(card, surface) {
  const dialog = document.createElement('dialog');
  dialog.className = 'cep-chat-search-preview';
  const close = document.createElement('button');
  close.type = 'button'; close.className = 'cep-chat-preview-close';
  close.textContent = '×'; close.setAttribute('aria-label','Close full note');
  const content = document.createElement('div');
  content.className = 'cep-search-source'; content.dataset.sourceFile = 'chatgptx.html';
  const fullNote = surface.cloneNode(true);
  fullNote.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  content.append(fullNote); dialog.append(close,content); document.body.append(dialog);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.remove(), {once:true});
  dialog.showModal();
}
export function applySourceSearchSkin(parent, entry) {
  const file = String(entry?.file || '').toLowerCase();
  if (!supported.has(file) || parent.classList.contains('cep-search-source')) return;
  installThemeStyles();
  const surface = document.createElement('div');
  surface.style.fontSize = '16px'; surface.style.lineHeight = 'normal'; surface.style.fontWeight = '400'; surface.style.whiteSpace = 'normal';
  surface.className = file === 'forms.html' ? 'cep-source-form' : file === 'chatgptx.html' ? 'cep-source-chat' : 'cep-source-surface';
  if (file === 'notes.html') surface.classList.add('cep-source-notebook');
  for (const name of [...parent.classList]) if (name === 'cep-source-card' || name.startsWith('cep-source-card--')) { surface.classList.add(name); parent.classList.remove(name); }
  const index = entry.sourceIndex ?? entry.cardIndex ?? 0;
  surface.dataset.sourceMod5 = String(index % 5); surface.dataset.sourceMod6 = String(index % 6);
  surface.append(...parent.childNodes); parent.append(surface);
  if (file === 'chatgptx.html') {
    parent.addEventListener('contextmenu', event => {
      if (event.target.closest('a:not(.universal-search-native-card):not(.cep-global-search-result),button,input,textarea,select,[contenteditable="true"]')) return;
      event.preventDefault(); event.stopPropagation(); openChatSearchPreview(parent,surface);
    });
  }
  parent.classList.add('cep-search-source'); parent.dataset.sourceFile = file;
  const cardClass = file === 'notes.html' ? 'note-tile note-card' : 'note-card';
  if (surface.classList.contains('cep-source-surface')) {
    const colour = window.getCepSourceCardColour?.(file,entry.sourceIndex ?? entry.cardIndex,cardClass);
    if (colour) {
      surface.style.setProperty('--card-glass',`rgba(${colour.rgb}, .74)`);
      surface.style.setProperty('--card-solid',colour.solid);
      surface.style.setProperty('--card-ink',colour.ink);
      surface.dataset.sharedPaletteColor = 'true';
    }
  }
  if (entry.cardColour) surface.style.background = entry.cardColour;
  const addClass = (selector,name) => surface.querySelectorAll(selector).forEach(node=>node.classList.add(name));
  addClass('.cep-source-note-title,.universal-search-native-title','cep-source-title');
  addClass('.cep-source-note-content', 'cep-source-content');
  addClass('.cep-source-note-text,.universal-search-native-snippet,.cep-xgpt-rich-content','cep-source-text');
  addClass('.cep-source-card-date','cep-source-date');
  addClass('.cep-source-card-url','cep-source-url');
  addClass('.cep-source-note-display','cep-source-display');
  addClass('.cep-source-card-view','cep-source-view');
  addClass('.cep-source-card-image','cep-source-image');
  for (const property of ['background','border','box-shadow','padding','backdrop-filter','-webkit-backdrop-filter']) parent.style.setProperty(property,['background','border','box-shadow','backdrop-filter','-webkit-backdrop-filter'].includes(property)?'none':'0','important');
  surface.querySelectorAll('.cep-source-title,.cep-source-content,.cep-source-text').forEach(node=>{
    // Source rendering previously carried fixed search-specific typography inline.
    for (const property of ['font-size','font-weight','font-family','line-height','font-style']) node.style.setProperty(property,'inherit');
    node.style.whiteSpace = 'inherit';
    if (node.classList.contains('cep-source-title')) node.style.marginBottom = '0';
  });
}
window.applySourceSearchSkin = applySourceSearchSkin;
