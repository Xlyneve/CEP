(function () {
  'use strict';
  const selector = '.pn-definition[data-pn-definition]';
  const style = document.createElement('style');
  style.textContent = `
    .pn-definition { text-decoration:underline dotted; text-underline-offset:3px; cursor:pointer; }
    #pn-definition-tip { position:fixed; z-index:20030; max-width:min(320px,calc(100vw - 24px)); padding:12px; border:1px solid rgba(100,90,110,.2); border-radius:12px; background:var(--clinical-panel,#fff); color:var(--theme-ink,#39353a); box-shadow:0 6px 22px #0002; font:12px/1.5 Tahoma,sans-serif; overflow-wrap:anywhere; }
    #pn-definition-tip[hidden] { display:none; }
    #pn-definition-tip p { margin:0 0 8px; white-space:pre-wrap; }
    #pn-definition-tip button { font:11px Tahoma,sans-serif; margin-right:6px; }
    #pn-definition-dialog { width:min(340px,calc(100vw - 32px)); box-sizing:border-box; border:1px solid #aaa5; border-radius:14px; background:var(--clinical-panel,#fff); color:var(--theme-ink,#39353a); font:13px/1.5 Tahoma,sans-serif; }
    #pn-definition-dialog::backdrop { background:#0003; }
    #pn-definition-dialog textarea { box-sizing:border-box; width:100%; min-height:100px; margin:10px 0; padding:8px; font:13px/1.5 Tahoma,sans-serif; }
    #pn-definition-dialog p { font-size:11px; }
    #pn-definition-dialog button { margin-right:8px; }
  `;
  document.head.append(style);
  const tip = document.createElement('div');
  tip.id = 'pn-definition-tip'; tip.hidden = true; tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-label', 'Word definition');
  const meaning = document.createElement('p');
  const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = 'Edit definition';
  const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove definition';
  const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close';
  tip.append(meaning); document.body.append(tip);
  const dialog = document.createElement('dialog'); dialog.id = 'pn-definition-dialog';
  dialog.innerHTML = '<form><label for="pn-definition-text"></label><textarea id="pn-definition-text" required maxlength="2000"></textarea><p>Save the note afterwards to keep this definition.</p><button type="submit">Save definition</button><button type="button">Cancel</button></form>';
  document.body.append(dialog);
  const field = dialog.querySelector('textarea');
  const aliases = document.createElement('input'); aliases.placeholder = 'Aliases, separated by commas (e.g. T-cells)'; aliases.setAttribute('aria-label','Definition aliases'); aliases.style.cssText='box-sizing:border-box;width:100%;padding:8px;margin-bottom:10px'; field.after(aliases);
  dialog.querySelector('p').textContent = 'This definition and its aliases are shared across PN and chatgptx. Save the note to keep your edits.';
  let selectedRange = null, selectedEditor = null, activeWord = null, pendingWord = null, pendingRange = null, pendingEditor = null, timer;
  const editorOf = element => element?.closest('#nurseNote,.edit-note[contenteditable="true"]');
  document.addEventListener('selectionchange', () => {
    const selection = getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const parent = node => node.nodeType === 1 ? node : node.parentElement;
    const editor = editorOf(parent(range.startContainer));
    if (editor && editor === editorOf(parent(range.endContainer))) {
      selectedEditor = editor; selectedRange = range.cloneRange();
    }
  });
  function hide() { clearTimeout(timer); tip.hidden = true; activeWord = null; }
  function show(word) {
    clearTimeout(timer); activeWord = word; meaning.textContent = word.dataset.pnDefinition; tip.hidden = false;
    const box = word.getBoundingClientRect();
    tip.style.left = `${Math.max(12, Math.min(box.left, innerWidth - tip.offsetWidth - 12))}px`;
    tip.style.top = `${Math.max(12, Math.min(box.bottom + 6, innerHeight - tip.offsetHeight - 12))}px`;
  }
  function openDialog(editor, range, word) {
    pendingEditor = editor; pendingRange = range; pendingWord = word;
    dialog.querySelector('label').textContent = `Definition of “${word ? word.textContent : range.toString()}”`;
    const shared = window.CEPSharedDefinitions?.find(word ? word.textContent : range.toString());
    field.value = shared?.value || (shared?.valueHtml ? window.CEPSharedDefinitions.plain(shared.valueHtml) : '') || word?.dataset.pnDefinition || '';
    aliases.value = (shared?.aliases || []).join(', '); hide(); dialog.showModal(); field.focus();
  }
  function editableWord(word) {
    if (editorOf(word)) return word;
    const card = word.closest('.note-card');
    const index = [...card.querySelectorAll(selector)].indexOf(word);
    card.querySelector('.edit-btn')?.click();
    return card.querySelectorAll(selector)[index];
  }
  edit.onclick = () => { const word = editableWord(activeWord); if (word) openDialog(editorOf(word), null, word); };
  remove.onclick = () => {
    const word = editableWord(activeWord); if (!word) return;
    const editor = editorOf(word); word.replaceWith(...word.childNodes); hide();
    editor?.dispatchEvent(new Event('input', { bubbles:true })); editor?.focus();
  };
  close.onclick = hide;
  document.addEventListener('pointerdown', event => {
    if (event.target.closest('.pn-add-definition,.pn-edit-definition,.pn-remove-definition')) event.preventDefault();
    else if (!tip.contains(event.target) && !event.target.closest(selector)) hide();
  });
  document.addEventListener('click', async event => {
    const manageButton = event.target.closest('.pn-edit-definition,.pn-remove-definition');
    if (manageButton) {
      event.preventDefault();
      const scope = manageButton.closest('.note-card') || document;
      const editor = scope.querySelector('.edit-note[contenteditable="true"]');
      const node = selectedRange?.startContainer;
      const word = node && (node.nodeType === 1 ? node : node.parentElement).closest(selector);
      const shared = window.CEPSharedDefinitions?.find(selectedRange?.toString());
      if (!word && shared && selectedEditor === editor && editor?.contains(selectedRange.commonAncestorContainer)) {
        if (manageButton.matches('.pn-edit-definition')) openDialog(editor, selectedRange.cloneRange(), null);
        else { try { await window.CEPSharedDefinitions.remove(shared.concept); hide(); } catch(error) { alert(error.message); } }
        return;
      }
      if (!word || selectedEditor !== editor || !editor?.contains(word)) {
        alert('Click inside or select the word with a definition first.'); return;
      }
      if (manageButton.matches('.pn-edit-definition')) openDialog(editor, null, word);
      else {
        try { await window.CEPSharedDefinitions.remove(word.textContent); }
        catch(error) { alert(error.message); return; }
        word.replaceWith(...word.childNodes); hide(); editor.dispatchEvent(new Event('input', { bubbles:true })); editor.focus();
      }
      return;
    }
    if (event.target.closest('.pn-add-definition')) {
      event.preventDefault();
      const button = event.target.closest('.pn-add-definition');
      const scope = button.closest('.note-card') || document;
      const editor = scope.querySelector('.edit-note[contenteditable="true"]');
      if (!selectedRange || selectedEditor !== editor || !editor?.contains(selectedRange.commonAncestorContainer) || !selectedRange.toString().trim()) {
        alert('Select a word or phrase in the note first.'); return;
      }
      const node = selectedRange.startContainer;
      const word = (node.nodeType === 1 ? node : node.parentElement).closest(selector);
      if (!word && selectedRange.cloneContents().querySelector(selector)) { alert('Edit existing definitions individually, or select text without a definition.'); return; }
      openDialog(editor, selectedRange.cloneRange(), word); return;
    }
    const word = event.target.closest(selector); if (word) { event.preventDefault(); show(word); }
  });
  document.addEventListener('mouseover', event => { const word = event.target.closest(selector); if (word) show(word); });
  document.addEventListener('mouseout', event => { const word = event.target.closest(selector); if (word && !word.contains(event.relatedTarget) && !tip.contains(event.relatedTarget)) { clearTimeout(timer); timer = setTimeout(hide, 200); } });
  tip.onmouseenter = () => clearTimeout(timer); tip.onmouseleave = event => { if (!activeWord?.contains(event.relatedTarget)) hide(); };
  document.addEventListener('focusin', event => { if (event.target.matches(selector)) show(event.target); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
  window.addEventListener('resize', hide); document.addEventListener('scroll', event => { if (!tip.contains(event.target)) hide(); }, true);
  dialog.querySelector('form').onsubmit = async event => {
    event.preventDefault(); const value = field.value.trim(); if (!value || !pendingEditor?.isConnected) return;
    const submit = dialog.querySelector('button[type="submit"]'); submit.disabled = true;
    try { await window.CEPSharedDefinitions.save(pendingWord?.textContent || pendingRange.toString(), value, aliases.value.split(',')); }
    catch(error) { alert(error.message); submit.disabled = false; return; }
    submit.disabled = false;
    let word = pendingWord;
    if (!word) {
      word = document.createElement('span'); word.className = 'pn-definition';
      word.append(pendingRange.extractContents()); pendingRange.insertNode(word);
    }
    word.dataset.pnDefinition = value;
    prepare();
    pendingEditor.dispatchEvent(new Event('input', { bubbles:true })); dialog.close(); pendingEditor.focus();
  };
  dialog.querySelector('button[type="button"]').onclick = () => dialog.close();
  function prepare() {
    document.querySelectorAll(selector).forEach(word => { word.tabIndex = 0; word.setAttribute('aria-label', `${word.textContent}: ${word.dataset.pnDefinition}`); });
  }
  new MutationObserver(prepare).observe(document.body, { subtree:true, childList:true }); prepare();
})();
