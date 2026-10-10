(function () {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    .cep-note-overlay { position:fixed; inset:0; z-index:20000; display:flex; align-items:center; justify-content:center; padding:16px; box-sizing:border-box; background:#0005; }
    html:root body .cep-note-popup { width:min(720px,100%); max-height:calc(100dvh - 32px); overflow:auto; padding:20px; box-sizing:border-box; border-radius:16px; background:var(--clinical-panel,#fff); color:var(--theme-ink,#39353a); box-shadow:0 16px 48px #0004; }
    .cep-note-popup h2 { margin:0 0 14px; font:600 18px Tahoma,sans-serif; }
    html:root body .cep-note-popup [data-popup-content] { position:static !important; width:100% !important; max-width:none !important; min-width:0 !important; margin:0 !important; padding:0 !important; opacity:1 !important; transform:none !important; transition:none !important; background:none !important; box-shadow:none !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important; box-sizing:border-box; }
    html:root body .cep-note-popup :is(input:not([type=file]),textarea,.edit-note,.edit-box) { width:100% !important; box-sizing:border-box; }
    html:root body .cep-note-popup :is(textarea,.edit-note,.edit-box) { min-height:220px !important; max-height:none !important; }
    html:root body .cep-note-notice { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); z-index:20010; display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; background:var(--clinical-panel,#fff); color:var(--theme-ink,#39353a); box-shadow:0 4px 24px #0003; font:13px Tahoma,sans-serif; max-width:calc(100vw - 32px); box-sizing:border-box; }
    .cep-note-notice button { cursor:pointer; white-space:nowrap; }
    html:root body .note-card.cep-note-saved { outline:3px solid #b89cc9 !important; outline-offset:4px; }
    html:root body :is(.cep-note-popup,.pn-edit-popup) .cep-add-layout { display:grid !important; grid-template-columns:minmax(0,220px) minmax(0,1fr); gap:20px; align-items:start; }
    html:root body .cep-add-controls { display:flex; flex-direction:column; gap:12px; min-width:0; }
    html:root body .cep-add-controls > input:not([type=file]) { flex:0 0 auto !important; height:36px !important; min-height:0 !important; max-height:none !important; margin:0 !important; width:100% !important; box-sizing:border-box; }
    html:root body .cep-add-controls :is(.editor-buttons,.format-buttons,.formatting-buttons,.action-buttons) { display:flex !important; flex-wrap:wrap; gap:6px; width:100% !important; margin:0 !important; box-sizing:border-box; }
    html:root body .cep-add-actions { display:flex; flex-wrap:wrap; gap:8px; }
    html:root body .cep-add-actions button { width:auto !important; margin:0 !important; }
    html:root body .cep-add-body { min-width:0; }
    html:root body .cep-add-body :is(textarea,[contenteditable=true]) { width:100% !important; min-height:340px !important; max-height:60dvh !important; overflow:auto; margin:0 !important; box-sizing:border-box; }
    @media (max-width:600px) {
      html:root body :is(.cep-note-popup,.pn-edit-popup) .cep-add-layout { grid-template-columns:minmax(0,1fr); gap:16px; }
      html:root body .cep-add-body :is(textarea,[contenteditable=true]) { min-height:220px !important; }
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
    controls.append(actions);
    form.replaceChildren(controls,body);
    form.classList.add('cep-add-layout');
  }
  window.CEPNotePopup = { open, close, saved, beginRender, submit, arrangeAdd, get editorId() { return active?.content.dataset.id; } };
})();
