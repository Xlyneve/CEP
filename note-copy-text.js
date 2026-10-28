// Mark a selected phrase in an editor; copy only that phrase when viewing.
(() => {
  if (window.CEPNoteCopyText) return;
  window.CEPNoteCopyText = true;
  const marker = '.cep-copy-text';
  const toolbars = '.cep-pn-editor-toolbar,#formatToolbar';
  const sharedTheme = !['rncnp.html','biosched1.html','recalltracker.html'].includes(location.pathname.split('/').pop().toLowerCase());
  let cursorPalette = '';
  function updateThemeCursors() {
    const root = document.documentElement;
    const probe = document.createElement('span');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none';
    root.append(probe);
    const resolve = expression => {
      probe.style.color = expression;
      const channels = getComputedStyle(probe).color.match(/[\d.]+/g).slice(0,3).map(Number);
      return '#' + channels.map(value => Math.round(value).toString(16).padStart(2,'0')).join('');
    };
    const accent = resolve('var(--clinical-accent,var(--page-header-solid,#e5cbcc))');
    const paper = resolve('var(--clinical-field,#efede8)');
    const ink = resolve('var(--theme-ink,#39190f)');
    probe.remove();
    const palette = [accent,paper,ink].join();
    if (palette === cursorPalette) return;
    cursorPalette = palette;
    root.style.setProperty('--cep-cursor-accent',accent);
    root.style.setProperty('--cep-cursor-paper',paper);
    root.style.setProperty('--cep-cursor-ink',ink);
    const image = (shape, width, height) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 40 48"><defs><radialGradient id="color" cx="65%" cy="65%" r="75%"><stop stop-color="${paper}"/><stop offset=".28" stop-color="${accent}"/><stop offset=".5" stop-color="${ink}"/><stop offset=".7" stop-color="${accent}"/><stop offset="1" stop-color="${paper}"/></radialGradient></defs><path d="${shape}" fill="none" stroke="${paper}" stroke-width="4" stroke-linejoin="round"/><path d="${shape}" fill="url(#color)" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
      return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
    };
    root.style.setProperty('--cep-theme-cursor',image('M5 3v37l10-9 8 14 7-4-8-14 13-3z',28,34) + ' 4 2,default');
    root.style.setProperty('--cep-theme-pointer',image('M13 25V6a3 3 0 0 1 6 0v12a3 3 0 0 1 6 0v2a3 3 0 0 1 6 0v3a3 3 0 0 1 6 0v9c0 8-5 13-12 13h-4c-5 0-7-3-10-7L4 28c-3-4 2-8 5-4l4 5z',32,40) + ' 13 4,pointer');
  }
  const style = document.createElement('style');
  style.textContent = `
    ${sharedTheme ? `html:root body {cursor:var(--cep-theme-cursor,default);}
    html:root body :is(a[href],button:not(:disabled),[role="button"],summary,input[type="button"],input[type="submit"],.note-card,.note-tile,.file-item,.chatBubble) {cursor:var(--cep-theme-pointer,pointer) !important;}
    html:root body :is(textarea,[contenteditable="true"],input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"])) {cursor:text !important;}` : ''}
    html:root body .cep-copy-text {text-decoration:underline dotted;text-underline-offset:3px;cursor:var(--cep-theme-pointer,pointer) !important;}
    html:root body .cep-copy-text * {cursor:var(--cep-theme-pointer,pointer) !important;}
    html:root body :is([contenteditable="true"],.editing-note,.is-editing) .cep-copy-text,
    html:root body :is([contenteditable="true"],.editing-note,.is-editing) .cep-copy-text * {cursor:text !important;}
    .cep-copy-text-button svg {width:14px;height:14px;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.5;}
    .cep-copy-text:focus-visible {outline:1px solid currentColor;outline-offset:3px;}
    .cep-copy-text.cep-phrase-copied {outline:2px solid white;outline-offset:3px;filter:drop-shadow(0 0 3px white);}
    #cep-copy-hover-tip {position:fixed;z-index:2147483647;pointer-events:none;padding:6px 10px;border:1px solid var(--cep-cursor-accent,#39190f);border-radius:8px;background:var(--cep-cursor-paper,#efede8);color:var(--cep-cursor-ink,#39190f);-webkit-text-fill-color:currentColor;font:12px/1.4 Tahoma,sans-serif;box-shadow:0 3px 12px #0004;white-space:nowrap;}
    #cep-copy-hover-tip[hidden] {display:none !important;}
  `;
  document.head.append(style);
  const viewingAttributes = new WeakMap();
  const isEditing = phrase => phrase.closest('[contenteditable="true"],.editing-note,.is-editing');
  let tip;
  function hideTip() { if (tip) tip.hidden = true; }
  function showTip(phrase, x, y) {
    if (isEditing(phrase)) { hideTip(); return; }
    if (!tip) {
      tip = document.createElement('div'); tip.id = 'cep-copy-hover-tip';
      tip.setAttribute('aria-hidden','true'); document.body.append(tip);
    }
    tip.textContent = phrase.classList.contains('email-copy') ? 'Copy email address' : 'Copy text';
    tip.hidden = false;
    tip.style.left = Math.max(4, Math.min(x + 20, innerWidth - tip.offsetWidth - 4)) + 'px';
    tip.style.top = Math.max(4, Math.min(y + 20, innerHeight - tip.offsetHeight - 4)) + 'px';
  }
  document.addEventListener('pointermove', event => {
    const phrase = event.target.closest?.(marker);
    if (phrase && event.pointerType !== 'touch') showTip(phrase,event.clientX,event.clientY);
    else hideTip();
  },true);
  document.addEventListener('focusin', event => {
    const phrase = event.target.closest?.(marker);
    if (phrase) { const box = phrase.getBoundingClientRect(); showTip(phrase,box.left,box.bottom); }
    else hideTip();
  });
  document.addEventListener('focusout',hideTip);
  document.addEventListener('pointerdown',hideTip,true);
  document.addEventListener('pointerleave',hideTip);
  document.addEventListener('scroll',hideTip,true);
  window.addEventListener('blur',hideTip);
  document.addEventListener('keydown',event => { if (event.key === 'Escape') hideTip(); });
  function preparePhrases() {
    document.querySelectorAll(marker).forEach(phrase => {
      if (isEditing(phrase)) {
        const original = viewingAttributes.get(phrase);
        if (original) {
          for (const [name, value] of original) {
            if (value === null) phrase.removeAttribute(name);
            else phrase.setAttribute(name, value);
          }
          viewingAttributes.delete(phrase);
        }
        return;
      }
      if (!viewingAttributes.has(phrase)) {
        viewingAttributes.set(phrase, ['role','tabindex','title','aria-label'].map(name =>
          [name, phrase.getAttribute(name)]));
      }
      phrase.setAttribute('role','button');
      phrase.tabIndex = 0;
      // Email controls already have a more specific copy label.
      if (!phrase.classList.contains('email-copy')) {
        phrase.title = 'Copy text';
        phrase.setAttribute('aria-label','Copy text: ' + phrase.textContent.trim());
      }
    });
  }
  let saved;
  function remember() {
    const selection = getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    const start = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
    const editor = start?.closest('[contenteditable="true"]');
    if (editor && editor.contains(range.endContainer)) saved = {editor,range:range.cloneRange()};
  }
  document.addEventListener('selectionchange', remember);
  function toggle() {
    if (!saved?.editor.isConnected || !saved.editor.isContentEditable) return;
    const {editor,range} = saved;
    if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) return;
    editor.focus({preventScroll:true});
    const selection = getSelection();selection.removeAllRanges();selection.addRange(range);
    const start = range.startContainer.nodeType===1?range.startContainer:range.startContainer.parentElement;
    const existing = start.closest(marker);
    if (existing && existing.contains(range.endContainer)) {
      existing.replaceWith(...existing.childNodes);
    } else {
      if (range.collapsed || !range.toString().trim()) return;
      // Keep authored formatting, including paragraph selections, intact.
      const fragment = range.cloneContents();
      if (fragment.querySelector('table,td,th,tr,img')) return;
      const span=document.createElement(fragment.querySelector('p,div,li,ul,ol,h1,h2,h3,h4,h5,h6,blockquote,pre') ? 'div' : 'span');span.className='cep-copy-text';
      fragment.querySelectorAll(marker).forEach(el=>el.replaceWith(...el.childNodes));
      span.append(fragment);
      document.execCommand('insertHTML',false,span.outerHTML);
    }
    editor.dispatchEvent(new Event('input',{bubbles:true}));remember();
  }
  function install() {
    preparePhrases();
    document.querySelectorAll(toolbars).forEach(toolbar=>{
      if(toolbar.querySelector('.cep-copy-text-button'))return;
      const button=document.createElement('button');button.type='button';
      button.className='cep-copy-text-button'+(toolbar.id==='formatToolbar'?' format-btn':'');
      button.title='Click-to-copy text: select a phrase, then click. Repeat to remove.';
      button.setAttribute('aria-label','Mark or unmark selected text as click-to-copy');
      button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>';
      button.addEventListener('pointerdown',event=>{remember();event.preventDefault();});
      button.addEventListener('mousedown',event=>event.preventDefault());
      button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();toggle();});
      toolbar.append(button);
    });
  }
  async function copy(phrase) {
    const text=(phrase.innerText || phrase.textContent).trim();if(!text)return;
    let copied=false;
    const handler=event=>{if(!event.clipboardData)return;event.clipboardData.setData('text/plain',text);event.preventDefault();copied=true;};
    document.addEventListener('copy',handler,true);
    try {document.execCommand('copy');} catch(_) {}
    finally {document.removeEventListener('copy',handler,true);}
    if(!copied) {
      try {await navigator.clipboard.writeText(text);copied=true;}catch(_){}
    }
    if(copied){phrase.classList.add('cep-phrase-copied');setTimeout(()=>phrase.classList.remove('cep-phrase-copied'),600);}
  }
  // Capture before card-copy, table zoom and definition handlers.
  document.addEventListener('click',event=>{
    const phrase=event.target.closest?.(marker);
    if(!phrase || isEditing(phrase))return;
    event.preventDefault();event.stopImmediatePropagation();copy(phrase);
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key !== 'Enter' && event.key !== ' ')return;
    const phrase=event.target.closest?.('.cep-copy-text[role="button"]');
    if(!phrase || isEditing(phrase))return;
    event.preventDefault();event.stopImmediatePropagation();copy(phrase);
  },true);
  // Double-clicking a phrase must not trigger search's navigation shortcut.
  document.addEventListener('dblclick',event=>{
    const phrase=event.target.closest?.(marker);
    if(phrase && !isEditing(phrase)){
      event.preventDefault();event.stopImmediatePropagation();
    }
  },true);
  const observer=new MutationObserver(install);
  function start(){
    updateThemeCursors(); install();
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['contenteditable','class']});
    new MutationObserver(updateThemeCursors).observe(document.documentElement,{attributes:true,attributeFilter:['data-xlyneve-color-theme','class','style']});
    window.addEventListener('load',updateThemeCursors);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
