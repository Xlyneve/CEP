(function () {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    .cep-note-overlay { position:fixed; inset:0; z-index:20000; display:flex; align-items:center; justify-content:center; padding:16px; box-sizing:border-box; background:#0005; }
    html:root body .cep-note-popup { width:min(720px,100%); max-height:calc(100dvh - 32px); overflow:auto; padding:20px; box-sizing:border-box; border-radius:16px; background:var(--clinical-panel,#fff); color:var(--theme-ink,#39353a); box-shadow:0 16px 48px #0004; }
    .cep-note-popup h2 { margin:0 0 14px; font:600 18px Tahoma,sans-serif; }
    html:root body :is(.cep-note-popup,.pn-edit-popup) { position:relative; }
    html:root body .cep-note-close { position:absolute; top:12px; right:12px; width:32px; height:32px; padding:0; border:0; background:transparent; box-shadow:none; color:inherit; font:24px/1 Tahoma,sans-serif; cursor:pointer; }
    html:root body.cep-add-popup-open :is(#toggleFormBtn,#toggleInputBtn,#toggleInput) { z-index:20001 !important; }
    html:root body .cep-note-popup [data-popup-content] { position:static !important; width:100% !important; max-width:none !important; min-width:0 !important; margin:0 !important; padding:0 !important; opacity:1 !important; transform:none !important; transition:none !important; background:none !important; box-shadow:none !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important; box-sizing:border-box; }
    html:root body .cep-note-popup :is(input:not([type=file]),textarea,.edit-note,.edit-box) { width:100% !important; box-sizing:border-box; }
    html:root body .cep-note-popup :is(textarea,.edit-note,.edit-box) { min-height:220px !important; max-height:none !important; }
    html:root body .cep-note-notice { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); z-index:20010; display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; background:var(--clinical-panel,#fff); color:var(--theme-ink,#39353a); box-shadow:0 4px 24px #0003; font:13px Tahoma,sans-serif; max-width:calc(100vw - 32px); box-sizing:border-box; }
    .cep-note-notice button { cursor:pointer; white-space:nowrap; }
    html:root body .note-card.cep-note-saved { outline:3px solid #b89cc9 !important; outline-offset:4px; }
    html:root body :is(.cep-note-popup,.pn-edit-popup) .cep-add-layout { display:grid !important; grid-template-columns:minmax(0,220px) minmax(0,1fr); grid-template-rows:auto 1fr; gap:20px; min-height:420px; align-items:stretch; }
    html:root body .cep-add-controls { grid-column:1; grid-row:1; }
    html:root body .cep-add-controls { display:flex; flex-direction:column; gap:12px; min-width:0; }
    html:root body .cep-add-controls > input:not([type=file]) { flex:0 0 auto !important; height:36px !important; min-height:0 !important; max-height:none !important; margin:0 !important; width:100% !important; box-sizing:border-box; }
    html:root body .cep-add-controls :is(.editor-buttons,.format-buttons,.formatting-buttons,.action-buttons) { display:flex !important; flex-wrap:wrap; gap:6px; width:100% !important; margin:0 !important; box-sizing:border-box; }
    html:root body .cep-add-layout [hidden] { display:none !important; }
    html:root body .cep-add-has-toolbar :is(.main-editor-buttons,.format-buttons,.formatting-buttons) { display:none !important; }
    html:root body .cep-add-controls .cep-pn-editor-toolbar { display:flex; flex-direction:column; align-items:flex-start; gap:6px; width:100%; margin:12px 0 0; box-sizing:border-box; }
    html:root body .cep-add-format-row { display:flex; gap:4px; align-items:center; }
    html:root body .cep-add-controls .cep-pn-editor-divider { display:none; }
    html:root body .cep-add-definition-actions { display:flex; flex-wrap:wrap; gap:6px; margin-top:12px; }
    .cep-add-definition-label { flex-basis:100%; font:12px Tahoma,sans-serif; }
    .cep-saved-note-title { margin:0 0 14px; font:600 16px Tahoma,sans-serif; overflow-wrap:anywhere; }
    .cep-saved-note-body { overflow-wrap:anywhere; font:13px/1.6 Tahoma,sans-serif; }
    .cep-saved-note-body img,.cep-saved-note-image { max-width:100%; height:auto; }
    .cep-saved-note-actions { display:flex; gap:10px; margin-top:20px; }
    html:root body .cep-add-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:32px; grid-column:1; grid-row:2; align-self:end; }
    html:root body .cep-add-actions button { width:auto !important; margin:0 !important; }
    html:root body .cep-add-body { min-width:0; grid-column:2; grid-row:1 / span 2; }
    html:root body .cep-add-body :is(textarea,[contenteditable=true]) { width:100% !important; height:100% !important; min-height:340px !important; max-height:none !important; overflow:auto; margin:0 !important; box-sizing:border-box; }
    @media (max-width:768px) {
      html:root body :is(.cep-note-popup,.pn-edit-popup) {
        background:linear-gradient(var(--clinical-panel,#fff),var(--clinical-panel,#fff)),#fff !important;
        color:var(--theme-ink,#39353a) !important;
        opacity:1 !important;
        border:1px solid var(--clinical-edge,rgba(255,255,255,.7));
        box-shadow:var(--porcelain-recessed,0 16px 48px #0004) !important;
        width:100%; max-width:720px; max-height:calc(100dvh - 32px);
        overflow:auto; overscroll-behavior:contain;
      }
      html:root body .pn-edit-popup #nurseFormWrapper,
      html:root body .cep-note-popup :is(#inputGroup,#nurseFormWrapper,[data-popup-content]) {
        position:static !important; inset:auto !important; width:100% !important;
        max-width:none !important; max-height:none !important; padding:0 !important;
        margin:0 !important; transform:none !important; opacity:1 !important;
        background:none !important; box-shadow:none !important; overflow:visible !important;
        backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
      }
    }
    @media (max-width:600px) {
      html:root body :is(.cep-note-popup,.pn-edit-popup) .cep-add-layout { grid-template-columns:minmax(0,1fr); grid-template-rows:auto auto auto; gap:16px; min-height:0; }
      html:root body .cep-add-body { grid-column:1; grid-row:2; }
      html:root body .cep-add-actions { grid-column:1; grid-row:3; margin-top:8px; }
      html:root body .cep-add-body :is(textarea,[contenteditable=true]) { height:220px !important; min-height:220px !important; }
    }
  `;
  document.head.append(style);
  let active = null, revealId = null, recentId = null, recentUntil = 0;
  const position = () => ({ window:scrollY, body:document.body.scrollTop });
  const restore = pos => { window.scrollTo({ top:pos.window, behavior:'instant' }); document.body.scrollTop = pos.body; };
  const find = id => [...document.querySelectorAll('.note-card[data-id]')].find(card => card.dataset.id === id && !card.closest('.cep-note-overlay'));
  function highlight(card) {
    if (!card) return;
    card.classList.add('cep-note-saved');
    setTimeout(() => card.classList.remove('cep-note-saved'), 2600);
  }
  function close() {
    if (!active) return;
    const state = active;
    active = null;
    document.body.classList.remove('cep-add-popup-open');
    if (state.placeholder.isConnected) state.placeholder.replaceWith(state.content);
    state.content.removeAttribute('data-popup-content');
    state.overlay.remove();
    document.body.style.overflow = state.overflow;
    document.removeEventListener('keydown', state.keyHandler);
    restore(state.pos);
    if (state.focus?.isConnected) state.focus.focus({ preventScroll:true });
  }
  function open(content, title, cancel, add = false) {
    if (active) active.cancel();
    const pos = position(), focus = document.activeElement, overflow = document.body.style.overflow;
    const placeholder = document.createElement('div');
    placeholder.style.height = content.getBoundingClientRect().height + 'px';
    if (content.parentNode) content.before(placeholder);
    const overlay = document.createElement('div');
    overlay.className = 'cep-note-overlay';
    const popup = document.createElement('section');
    popup.className = 'cep-note-popup';
    popup.setAttribute('role','dialog'); popup.setAttribute('aria-modal','true'); popup.setAttribute('aria-label',title);
    const heading = document.createElement('h2'); heading.textContent = title;
    popup.append(heading,content); overlay.append(popup); document.body.append(overlay);
    if (add) {
      document.body.classList.add('cep-add-popup-open');
      const closeButton = document.createElement('button');
      closeButton.type = 'button'; closeButton.className = 'cep-note-close'; closeButton.textContent = '×'; closeButton.setAttribute('aria-label','Close add note');
      closeButton.onclick = () => { if (!active?.busy) active?.cancel(); };
      popup.append(closeButton);
    }
    content.setAttribute('data-popup-content','');
    if (add && !content.querySelector('.cep-note-cancel,#cancelAddNote')) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'cep-note-cancel'; button.textContent = 'Cancel';
      button.onclick = () => active?.cancel(); content.append(button);
    }
    if (add) arrangeAdd(content);
    const keyHandler = event => {
      if (document.querySelector('dialog[open]')) return;
      if (event.key === 'Escape') { event.preventDefault(); if (!active?.busy) active?.cancel(); }
      if (event.key === 'Tab') {
        const controls = [...popup.querySelectorAll('input,textarea,button,a[href],[contenteditable=true]')].filter(el => !el.disabled && el.getClientRects().length);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    active = { content, placeholder, overlay, focus, pos, overflow, cancel, keyHandler };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown',keyHandler);
    content.querySelector('input:not([type=file]),textarea,[contenteditable=true]')?.focus({ preventScroll:true });
  }
  function saved(id, reveal) {
    recentId = id; recentUntil = Date.now() + 2600;
    highlight(find(id));
    document.querySelector('.cep-note-notice')?.remove();
    const notice = document.createElement('div'); notice.className = 'cep-note-notice';
    notice.innerHTML = '<span role="status">Note saved</span><button type="button">View note</button><button type="button" aria-label="Dismiss saved notification">×</button>';
    notice.querySelector('button').onclick = () => {
      const card = find(id);
      if (card) { card.scrollIntoView({ behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'center' }); highlight(card); }
      else { revealId = id; reveal(); }
    };
    notice.querySelectorAll('button')[1].onclick = () => notice.remove();
    document.body.append(notice);
  }
  function preview(id, note, reveal) {
    document.querySelector('.cep-note-notice')?.remove();
    document.querySelector('.pn-save-notice')?.remove();
    const content = document.createElement('div');
    const title = document.createElement('h3'); title.className = 'cep-saved-note-title'; title.textContent = note.title || 'Untitled';
    const body = document.createElement('div'); body.className = 'cep-saved-note-body note-content';
    if (window.CEPSecurity) CEPSecurity.setHTML(body,note.note || note.text || '');
    else body.textContent = note.note || note.text || '';
    content.append(title,body);
    if (note.image && /^(https?:|data:image\/(?:png|jpeg|gif|webp);base64,)/i.test(note.image)) {
      const image = document.createElement('img'); image.className = 'cep-saved-note-image'; image.src = note.image; image.alt = 'Note image'; content.append(image);
    }
    if (note.url) {
      try {
        const url = new URL(note.url,location.href);
        if (/^https?:$/.test(url.protocol)) {
          const link = document.createElement('a'); link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Open URL'; link.className = 'cep-saved-url';
          const row = document.createElement('p'); row.append(link); content.append(row);
        }
      } catch {}
    }
    const actions = document.createElement('div'); actions.className = 'cep-saved-note-actions';
    const closeButton = document.createElement('button'); closeButton.type = 'button'; closeButton.textContent = 'Close'; closeButton.onclick = close;
    const viewButton = document.createElement('button'); viewButton.type = 'button'; viewButton.textContent = 'View in page';
    viewButton.onclick = () => {
      close();
      const card = find(id);
      if (card) { card.scrollIntoView({ behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'center' }); highlight(card); }
      else { revealId = id; reveal(); }
    };
    actions.append(closeButton,viewButton); content.append(actions);
    open(content,'Note saved',close);
    closeButton.focus({ preventScroll:true });
  }
  function beginRender(container) {
    const pos = active?.pos || position();
    container.style.minHeight = container.getBoundingClientRect().height + 'px';
    return () => {
      container.style.minHeight = '';
      restore(pos);
      if (recentUntil > Date.now()) highlight(find(recentId));
      if (revealId) {
        const card = find(revealId);
        if (card) { revealId = null; card.scrollIntoView({ behavior:'smooth', block:'center' }); highlight(card); }
      }
    };
  }
  async function submit(action) {
    const state = active;
    if (state?.busy) return;
    if (state) state.busy = true;
    const controls = [...(state?.content.querySelectorAll('button,input,textarea') || [])];
    const disabled = controls.map(el => el.disabled);
    controls.forEach(el => el.disabled = true);
    try { return await action(); }
    catch (error) { alert('The note could not be saved. Please try again.'); }
    finally {
      controls.forEach((el,index) => el.disabled = disabled[index]);
      if (state) state.busy = false;
    }
  }
  function arrangeAdd(form) {
    if (form.classList.contains('cep-add-layout')) return;
    const editor = form.querySelector('#noteText,#nurseNote');
    if (!editor) return;
    const controls = document.createElement('div'); controls.className = 'cep-add-controls';
    const body = document.createElement('div'); body.className = 'cep-add-body';
    const actions = document.createElement('div'); actions.className = 'cep-add-actions';
    body.append(editor);
    const title = form.querySelector('#noteTitle,#nurseTitle');
    const url = form.querySelector('#noteUrl,#nurseURL');
    if (title) controls.append(title);
    if (url) controls.append(url);
    form.querySelectorAll('.editor-buttons,.format-buttons,.formatting-buttons').forEach(toolbar => controls.append(toolbar));
    form.querySelectorAll('.add-btn,#cancelAddNote,.cep-note-cancel').forEach(button => actions.append(button));
    [...form.children].forEach(extra => {
      if (extra.children.length || extra.textContent.trim() || extra.matches('input,label,button')) controls.append(extra);
      else extra.remove();
    });
    form.replaceChildren(controls,body,actions);
    form.classList.add('cep-add-layout');
    const syncToolbar = () => {
      const toolbar = form.querySelector('.cep-pn-editor-toolbar');
      if (!toolbar) return;
      form.classList.add('cep-add-has-toolbar');
      const anchor = url || title;
      if (anchor && anchor.nextElementSibling !== toolbar) anchor.after(toolbar);
      if (!toolbar.querySelector('.cep-add-format-row')) {
        const buttons = [...toolbar.querySelectorAll('button')];
        const formatting = document.createElement('div'); formatting.className = 'cep-add-format-row';
        const tables = document.createElement('div'); tables.className = 'cep-add-format-row';
        buttons.slice(0,3).forEach(button => formatting.append(button));
        const labels = ['Table','R+','R-','C+','C-'];
        buttons.slice(3,8).forEach((button,index) => { button.textContent = labels[index]; tables.append(button); });
        toolbar.prepend(formatting,tables);
      }
      const definitionButtons = [...form.querySelectorAll('.pn-add-definition,.pn-edit-definition,.pn-remove-definition')];
      let definitions = controls.querySelector('.cep-add-definition-actions');
      if (definitionButtons.length && !definitions) {
        definitions = document.createElement('div');
        definitions.className = 'cep-add-definition-actions';
        const heading = document.createElement('span'); heading.className = 'cep-add-definition-label'; heading.textContent = 'Definition:';
        definitions.append(heading);
        toolbar.after(definitions);
      }
      definitionButtons.forEach(button => {
        if (button.parentElement === definitions) return;
        const label = button.classList.contains('pn-add-definition') ? 'Add definition' : button.classList.contains('pn-edit-definition') ? 'Edit definition' : 'Remove definition';
        button.title = label;
        button.setAttribute('aria-label',label);
        button.textContent = button.classList.contains('pn-add-definition') ? 'Add' : button.classList.contains('pn-edit-definition') ? 'Edit' : 'Remove';
        definitions.append(button);
      });
    };
    syncToolbar();
    new MutationObserver(syncToolbar).observe(form, { childList:true, subtree:true });
  }
  window.CEPNotePopup = { open, close, saved, preview, beginRender, submit, arrangeAdd, get editorId() { return active?.content.dataset.id; } };
})();
