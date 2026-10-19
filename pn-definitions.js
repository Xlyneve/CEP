(function () {
  'use strict';
  const selector = '.pn-definition[data-pn-definition]';
  const style = document.createElement('style');
  style.textContent = `
    .pn-definition { text-decoration:underline dotted; text-underline-offset:3px; cursor:pointer; }
    #pn-definition-tip { position:fixed; z-index:20030; max-width:min(320px,calc(100vw - 24px)); padding:12px; border:1px solid rgba(100,90,110,.2); border-radius:12px; background:var(--clinical-panel,#fff); color:var(--theme-ink,#39353a); box-shadow:0 6px 22px #0002; font:12px/1.5 Tahoma,sans-serif; overflow-wrap:anywhere; max-height:calc(100dvh - 24px); overflow:auto; box-sizing:border-box; overscroll-behavior:contain; }
    #pn-definition-tip[hidden] { display:none; }
    #pn-definition-tip p { margin:0 0 8px; white-space:pre-wrap; }
    #pn-definition-tip button { font:11px Tahoma,sans-serif; margin-right:6px; }
    #pn-definition-dialog { max-height:calc(100dvh - 32px);overflow:auto; width:min(340px,calc(100vw - 32px)); box-sizing:border-box; border:1px solid #aaa5; border-radius:14px; background:var(--clinical-panel,#fff); color:var(--theme-ink,#39353a); font:13px/1.5 Tahoma,sans-serif; }
    #pn-definition-dialog::backdrop { background:#0003; }
    #pn-definition-dialog textarea { box-sizing:border-box; width:100%; min-height:100px; margin:10px 0; padding:8px; font:13px/1.5 Tahoma,sans-serif; }
    #pn-definition-dialog p { font-size:11px; }
    #pn-definition-dialog button { margin-right:8px; }
  `;
  document.head.append(style);
  const tip = document.createElement('div');
  tip.id = 'pn-definition-tip'; tip.hidden = true; tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-label', 'Word definition');
  const meaning = document.createElement('div');
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
  let photoFiles = [], photoUrls = [], saving = false;
  const photoArea=document.createElement('div');
  photoArea.hidden=!/\/pn\.html$/i.test(location.pathname);
  const photoInput=document.createElement('input');photoInput.type='file';photoInput.accept='image/*';photoInput.multiple=true;photoInput.hidden=true;photoInput.id='pn-definition-photos';
  const photoButton=document.createElement('button');photoButton.type='button';photoButton.textContent='🖼 Add photos';photoButton.setAttribute('aria-label','Add definition photos');
  const previews=document.createElement('div');previews.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:10px 0';
  const photoHelp=document.createElement('small');photoHelp.textContent='Photos are compressed and shared with ChatGPTX. Add up to 5 at a time.';
  const status=document.createElement('p');status.setAttribute('role','status');status.style.cssText='overflow-wrap:anywhere';status.hidden=true;
  photoArea.append(photoButton,photoInput,previews,photoHelp);
  aliases.after(photoArea,status);
  function clearPhotoFiles() {
    photoUrls.forEach(url=>URL.revokeObjectURL(url));photoUrls=[];photoFiles=[];photoInput.value='';
  }
  function renderPhotos(term) {
    previews.replaceChildren();
    const media=window.CEPSharedDefinitions?.mediaFor?.(term) || {};
    const existing=media.images?.length ? media.images : media.imageUrl ? [{imageUrl:media.imageUrl}] : [];
    for(const [index,photo] of existing.entries()) {
      const img=document.createElement('img');img.src=photo.imageUrl;img.alt='Saved concept photo '+(index+1);img.style.cssText='width:64px;height:64px;object-fit:contain;border-radius:8px';previews.append(img);
    }
    photoFiles.forEach((file,index)=>{
      const item=document.createElement('span');item.style.cssText='position:relative;display:inline-flex';
      const img=document.createElement('img');img.src=photoUrls[index];img.alt='New photo: '+file.name;img.style.cssText='width:64px;height:64px;object-fit:contain;border-radius:8px';
      const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.setAttribute('aria-label','Remove '+file.name);remove.style.cssText='align-self:start;margin:0';
      remove.onclick=()=>{if(saving)return;URL.revokeObjectURL(photoUrls[index]);photoUrls.splice(index,1);photoFiles.splice(index,1);renderPhotos(term);};
      item.append(img,remove);previews.append(item);
    });
  }
  const currentTerm=()=>pendingWord?.textContent || pendingRange?.toString() || '';
  photoButton.onclick=()=>photoInput.click();
  photoInput.onchange=()=>{
    const files=[...photoInput.files];
    if(photoFiles.length+files.length>5){status.textContent='Add up to 5 photos at a time.';status.hidden=false;photoInput.value='';return;}
    if(files.some(file=>!file.type.startsWith('image/') || file.size>20*1024*1024)){status.textContent='Choose image files smaller than 20 MB each.';status.hidden=false;photoInput.value='';return;}
    photoFiles.push(...files);photoUrls.push(...files.map(file=>URL.createObjectURL(file)));
    photoInput.value='';status.hidden=true;renderPhotos(currentTerm());
  };
  dialog.addEventListener('cancel',event=>{if(saving)event.preventDefault();});
  dialog.addEventListener('close',()=>{clearPhotoFiles();status.hidden=true;});
  let selectedRange = null, selectedEditor = null, activeWord = null, pendingWord = null, pendingRange = null, pendingEditor = null, timer;
  const titleSelector = '#nurseTitle,input.edit-title';
  let selectedTitle = null;
  const captureTitleSelection = () => {
    const input = document.activeElement;
    if (!input?.matches(titleSelector)) return false;
    const start = input.selectionStart, end = input.selectionEnd;
    if (!Number.isInteger(start) || end <= start) { selectedTitle = null; selectedRange = null; return true; }
    selectedTitle = {input,text:input.value.slice(start,end)};
    selectedEditor = input; selectedRange = null;
    return true;
  };
  ['select','keyup','pointerup'].forEach(type => document.addEventListener(type,event => {
    if (event.target.matches?.(titleSelector)) captureTitleSelection();
  }));
  const editorOf = element => element?.closest('#nurseNote,.edit-note[contenteditable="true"]');
  document.addEventListener('selectionchange', () => {
    if (captureTitleSelection()) return;
    const selection = getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const parent = node => node.nodeType === 1 ? node : node.parentElement;
    const editor = editorOf(parent(range.startContainer));
    if (editor && editor === editorOf(parent(range.endContainer))) {
      selectedTitle = null; selectedEditor = editor; selectedRange = range.cloneRange();
    }
  });
  function hide() { clearTimeout(timer); tip.hidden = true; activeWord = null; }
  function show(word) {
    clearTimeout(timer);
    if (activeWord === word && !tip.hidden) return;
    activeWord = word;
    const shared = window.CEPSharedDefinitions;
    if (shared?.renderPreview) shared.renderPreview(meaning, shared.find(word.dataset.sharedTerm || word.textContent), word.dataset.pnDefinition);
    else meaning.textContent = word.dataset.pnDefinition;
    tip.hidden = false;
    const box = word.getBoundingClientRect();
    tip.style.left = `${Math.max(12, Math.min(box.left, innerWidth - tip.offsetWidth - 12))}px`;
    tip.style.top = `${Math.max(12, Math.min(box.bottom + 6, innerHeight - tip.offsetHeight - 12))}px`;
  }
  const existingDialog=document.createElement('dialog');
  existingDialog.id='pn-existing-definition-dialog';
  existingDialog.setAttribute('aria-labelledby','pn-existing-definition-heading');
  existingDialog.style.cssText='width:min(360px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:auto;box-sizing:border-box;border:1px solid #aaa5;border-radius:14px;padding:18px;background:linear-gradient(var(--clinical-panel,#fff),var(--clinical-panel,#fff)),#fff;color:var(--theme-ink,#39353a);font:13px/1.5 Tahoma,sans-serif;box-shadow:var(--note-editor-depth,0 8px 28px #0003)';
  const existingHeading=document.createElement('h2');existingHeading.id='pn-existing-definition-heading';existingHeading.textContent='This word already has a definition.';existingHeading.style.cssText='font-size:15px;margin:0 0 10px';
  const existingTerm=document.createElement('p');
  const existingPreview=document.createElement('div');existingPreview.style.cssText='max-height:40dvh;overflow:auto;overflow-wrap:anywhere;white-space:pre-wrap;margin-bottom:14px';
  const editExisting=document.createElement('button');editExisting.type='button';editExisting.textContent='Edit existing';
  const cancelExisting=document.createElement('button');cancelExisting.type='button';cancelExisting.textContent='Cancel';cancelExisting.style.marginLeft='8px';
  existingDialog.append(existingHeading,existingTerm,existingPreview,editExisting,cancelExisting);document.body.append(existingDialog);
  let existingAction=null;
  editExisting.onclick=()=>{const action=existingAction;existingAction=null;existingDialog.close();action?.();};
  cancelExisting.onclick=()=>existingDialog.close();
  existingDialog.addEventListener('close',()=>{existingAction=null;});
  function openDialog(editor, range, word, adding = false) {
    const term=word ? word.textContent : range.toString();
    const record=window.CEPSharedDefinitions?.find(term);
    if (adding && (record || word?.dataset.pnDefinition)) {
      hide();
      existingTerm.textContent=record?.concept && window.CEPSharedDefinitions.normalize(record.concept)!==window.CEPSharedDefinitions.normalize(term)
        ? '“'+term+'” is an alias of “'+record.concept+'”.' : '“'+term+'”';
      if(window.CEPSharedDefinitions?.renderPreview) window.CEPSharedDefinitions.renderPreview(existingPreview,record,word?.dataset.pnDefinition || '');
      else existingPreview.textContent=word?.dataset.pnDefinition || '';
      existingAction=()=>openDialog(editor,range,word);
      existingDialog.showModal();cancelExisting.focus();
      return;
    }
    pendingEditor = editor; pendingRange = range; pendingWord = word;
    dialog.querySelector('label').textContent = `Definition of “${word ? word.textContent : range.toString()}”`;
    const shared = window.CEPSharedDefinitions?.find(word ? word.textContent : range.toString());
    field.value = shared?.value || (shared?.valueHtml ? window.CEPSharedDefinitions.plain(shared.valueHtml) : '') || word?.dataset.pnDefinition || '';
    aliases.value = (shared?.aliases || []).join(', ');
    clearPhotoFiles();status.hidden=true;renderPhotos(word ? word.textContent : range.toString());
    hide(); dialog.showModal(); field.focus();
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
    const definitionButton = event.target.closest('.pn-add-definition,.pn-edit-definition,.pn-remove-definition');
    if (definitionButton && selectedTitle?.input.isConnected) {
      const scope = definitionButton.closest('.pn-edit-fields,.pn-edit-popup,.cep-note-popup,.note-card') || document;
      if ((scope === document ? selectedTitle.input.matches("#nurseTitle") : scope.contains(selectedTitle.input)) && selectedEditor === selectedTitle.input) {
        event.preventDefault();
        const {input,text} = selectedTitle;
        const shared = window.CEPSharedDefinitions?.find(text);
        if (definitionButton.matches('.pn-remove-definition')) {
          if (!shared) { alert('Select a title word with a definition first.'); return; }
          try { await window.CEPSharedDefinitions.remove(shared.concept); hide(); input.focus(); }
          catch(error) { alert(error.message); }
        } else if (definitionButton.matches('.pn-edit-definition') && !shared) {
          alert('Select a title word with a definition first.');
        } else openDialog(input,{toString:() => text},null,definitionButton.matches('.pn-add-definition'));
        return;
      }
    }
    const manageButton = event.target.closest('.pn-edit-definition,.pn-remove-definition');
    if (manageButton) {
      event.preventDefault();
      const scope = manageButton.closest('.pn-edit-fields,.pn-edit-popup,.cep-note-popup,.note-card') || document;
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
      const scope = button.closest('.pn-edit-fields,.pn-edit-popup,.cep-note-popup,.note-card') || document;
      const editor = scope.querySelector('.edit-note[contenteditable="true"]');
      if (!selectedRange || selectedEditor !== editor || !editor?.contains(selectedRange.commonAncestorContainer) || !selectedRange.toString().trim()) {
        alert('Select a word or phrase in the note first.'); return;
      }
      const node = selectedRange.startContainer;
      let word = (node.nodeType === 1 ? node : node.parentElement).closest(selector);
      if (!word) word=[...editor.querySelectorAll(selector)].find(candidate=>
        candidate.textContent.trim()===selectedRange.toString().trim() && selectedRange.intersectsNode(candidate));
      if (!word && selectedRange.cloneContents().querySelector(selector)) { alert('Edit existing definitions individually, or select text without a definition.'); return; }
      openDialog(editor, selectedRange.cloneRange(), word, true); return;
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
    event.preventDefault(); const value = field.value.trim(); if (saving || !value || !pendingEditor?.isConnected) return;
    const submit = dialog.querySelector('button[type="submit"]');
    const controls=[...dialog.querySelectorAll('button,input,textarea')];
    saving=true;controls.forEach(control=>control.disabled=true);submit.textContent='Saving…';status.hidden=true;
    try {
      const term=currentTerm();
      await window.CEPSharedDefinitions.save(term,value,aliases.value.split(','));
      if(photoFiles.length) {
        status.textContent='Uploading photos…';status.hidden=false;
        await window.CEPSharedDefinitions.uploadPhotos(term,photoFiles);
        clearPhotoFiles();
      }
    } catch(error) {
      status.textContent='Could not finish saving: '+error.message+' Your selected photos are kept so you can retry.';
      status.hidden=false;return;
    } finally {
      saving=false;controls.forEach(control=>control.disabled=false);submit.textContent='Save definition';
    }
    if (pendingEditor.matches(titleSelector)) {
      pendingEditor.dispatchEvent(new Event('input', {bubbles:true}));
      dialog.close(); pendingEditor.focus(); return;
    }
    let word = pendingWord;
    if (!word) {
      word = document.createElement('span'); word.className = 'pn-definition';
      word.append(pendingRange.extractContents()); pendingRange.insertNode(word);
    }
    word.dataset.pnDefinition = value;
    prepare();
    pendingEditor.dispatchEvent(new Event('input', { bubbles:true })); dialog.close(); pendingEditor.focus();
  };
  dialog.querySelector('form > button[type="button"]').onclick = () => {if(!saving)dialog.close();};
  function prepare() {
    document.querySelectorAll(selector).forEach(word => { word.tabIndex = 0; word.setAttribute('aria-label', `${word.textContent}: ${word.dataset.pnDefinition}`); });
  }
  new MutationObserver(prepare).observe(document.body, { subtree:true, childList:true }); prepare();
})();
