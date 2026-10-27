// Mark a selected phrase in an editor; copy only that phrase when viewing.
(() => {
  if (window.CEPNoteCopyText) return;
  window.CEPNoteCopyText = true;
  const marker = '.cep-copy-text';
  const toolbars = '.cep-pn-editor-toolbar,#formatToolbar';
  const style = document.createElement('style');
  style.textContent = `
    .cep-copy-text {text-decoration:underline dotted;text-underline-offset:3px;cursor:copy;}
    [contenteditable="true"] .cep-copy-text {cursor:text;}
    .cep-copy-text-button svg {width:14px;height:14px;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.5;}
    .cep-copy-text:focus-visible {outline:1px solid currentColor;outline-offset:3px;}
    .cep-copy-text.cep-phrase-copied {outline:2px solid white;outline-offset:3px;filter:drop-shadow(0 0 3px white);}
  `;
  document.head.append(style);
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
    if(!phrase || phrase.closest('[contenteditable="true"],.editing-note,.is-editing'))return;
    event.preventDefault();event.stopImmediatePropagation();copy(phrase);
  },true);
  // Double-clicking a phrase must not trigger search's navigation shortcut.
  document.addEventListener('dblclick',event=>{
    const phrase=event.target.closest?.(marker);
    if(phrase && !phrase.closest('[contenteditable="true"],.editing-note,.is-editing')){
      event.preventDefault();event.stopImmediatePropagation();
    }
  },true);
  const observer=new MutationObserver(install);
  function start(){install();observer.observe(document.body,{subtree:true,childList:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
