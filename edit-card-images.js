import { getApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { uploadReferenceImage } from "./image-storage.js?v=20260826-2";

const attachedEditors = new WeakSet();
const savedRanges = new WeakMap();
let columnResize = null;
let pendingCardReveal = null;
const clinicalNotesPage = /(?:^|\/)Clinicalnotes\.html$/i.test(location.pathname);
const textMeasureCanvas = document.createElement('canvas');

function measuredCellWidth(cell) {
  const text = (cell.innerText || cell.textContent || '').trim();
  if (!text && !cell.querySelector('img,table')) return 38;
  const context = textMeasureCanvas.getContext('2d');
  const style = getComputedStyle(cell);
  context.font = style.font || `${style.fontSize} ${style.fontFamily}`;
  const longestLine = text.split(/\r?\n/).reduce((width, line) =>
    Math.max(width, context.measureText(line || ' ').width), 0);
  return Math.max(38, Math.ceil(longestLine + 18));
}

function installStyles() {
  if (document.getElementById('cepPnEditorStyles')) return;
  const style = document.createElement('style');
  style.id = 'cepPnEditorStyles';
  style.textContent = `
    .cep-pn-editor {
      width: 100% !important; min-height: 82px; box-sizing: border-box !important;
      padding: 8px 9px !important; overflow-wrap: anywhere;
      border: 1px solid rgba(255,255,255,.58) !important; border-radius: 9px !important;
      outline: 0; background: rgba(255,255,255,.30) !important;
      box-shadow: inset 0 1px 2px rgba(75,65,70,.08);
      font: 11px/1.5 Tahoma,sans-serif !important;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    }
    .cep-pn-editor:focus { border-color: rgba(109,92,101,.38) !important; box-shadow: 0 0 0 3px rgba(109,92,101,.08), inset 0 1px 2px rgba(75,65,70,.07); }
    #noteText.editable.cep-pn-editor {
      flex:0 0 auto !important; flex-shrink:0 !important; max-height:none !important;
      overflow:visible !important;
    }
    .cep-pn-editor-toolbar { display:flex; flex-wrap:wrap; align-items:center; gap:3px; margin:5px 0 7px; }
    .cep-pn-editor-toolbar[hidden],
    .editor-buttons[hidden], .main-editor-buttons[hidden], .edit-table-tools[hidden],
    .formatting-buttons[hidden], .format-buttons[hidden],
    .custom-file-btn[hidden], label[hidden], #uploadPhotoBtn[hidden] {
      display:none !important;
    }
    .cep-pn-editor-toolbar button {
      min-width:24px; min-height:23px; padding:4px 6px; border:1px solid rgba(255,255,255,.62);
      border-radius:6px; background:rgba(255,255,255,.38); color:#433b3f;
      box-shadow:0 1px 3px rgba(75,65,70,.07); font:600 9px/1 Tahoma,sans-serif; cursor:pointer;
    }
    .cep-pn-editor-toolbar button:hover, .cep-pn-editor-toolbar button:focus-visible { background:rgba(255,255,255,.78); }
    .cep-pn-editor-toolbar button:disabled { cursor:wait; opacity:.66; }
    .cep-pn-editor-divider { width:1px; height:20px; margin:0 2px; background:rgba(90,80,85,.16); }
    .cep-pn-editor img { max-width:min(100%,420px); height:auto; border-radius:8px; cursor:zoom-in; }
    .gradient-highlight, .highlight-gradient, .note-gradient-highlight,
    .note-card mark.gradient-highlight, .note-tile mark.gradient-highlight, .cep-pn-editor mark.gradient-highlight {
      background:linear-gradient(90deg,#fff3a6 0%,#ffd7b5 52%,#ffc7da 100%) !important;
      color:#171717 !important; border-radius:5px !important; padding:0 3px !important;
      box-shadow:inset 0 -1px 0 rgba(110,72,20,.20),0 0 0 1px rgba(255,255,255,.5) !important;
      -webkit-box-decoration-break:clone; box-decoration-break:clone;
    }
    .cep-pn-editor table, .note-card table, .note-tile table {
      width:100% !important; margin:8px 0 !important; border-collapse:collapse !important; border-spacing:0 !important;
      max-width:100% !important; min-width:0 !important;
      overflow:hidden; border:1px solid #000 !important; border-radius:8px;
      background:rgba(246,246,247,.84) !important; color:#2f2b2d !important;
      box-shadow:0 3px 10px rgba(75,65,70,.07);
    }
    .cep-pn-editor th, .cep-pn-editor td,
    .note-card th, .note-card td, .note-tile th, .note-tile td {
      min-width:48px !important; padding:6px 7px !important;
      box-sizing:border-box !important;
      border:1px solid #000 !important;
      background:rgba(255,255,255,.76) !important;
      position:relative; vertical-align:top; touch-action:pan-y;
    }
    .cep-pn-editor td:not(:last-child)::after,
    .cep-pn-editor th:not(:last-child)::after {
      content:""; position:absolute; z-index:4; top:0; right:-8px; width:16px; height:100%;
      cursor:col-resize; touch-action:none;
    }
    .cep-pn-editor table { table-layout:auto; }
    .cep-pn-editor td, .cep-pn-editor th {
      white-space:normal; overflow-wrap:anywhere; word-break:normal;
    }
    body.cep-clinical-notes-page .cep-pn-editor table,
    body.cep-clinical-notes-page .note-card table {
      background:transparent !important; box-shadow:none !important;
    }
    body.cep-clinical-notes-page .cep-pn-editor td,
    body.cep-clinical-notes-page .cep-pn-editor th,
    body.cep-clinical-notes-page .note-card td,
    body.cep-clinical-notes-page .note-card th {
      background:transparent !important;
    }
    body.cep-resizing-table-column, body.cep-resizing-table-column * {
      cursor:col-resize !important; user-select:none !important;
    }
    .cep-pn-editor tr:nth-child(even) td, .note-card tr:nth-child(even) td, .note-tile tr:nth-child(even) td {
      background:rgba(229,232,234,.76) !important;
    }
    .note-card:has(.cep-pn-editor) input[type="text"], .note-tile:has(.cep-pn-editor) input[type="text"] {
      width:100% !important; box-sizing:border-box !important; margin:4px 0 6px !important;
      padding:7px 9px !important; border:1px solid rgba(255,255,255,.58) !important;
      border-radius:8px !important; background:rgba(255,255,255,.34) !important;
      font:11px/1.35 Tahoma,sans-serif !important;
    }
    .note-card:has(.cep-pn-editor) .btn-save, .note-card:has(.cep-pn-editor) .btn-cancel,
    .note-tile:has(.cep-pn-editor) .btn-save, .note-tile:has(.cep-pn-editor) .btn-cancel {
      border-radius:7px !important; font:600 10px/1 Tahoma,sans-serif !important;
    }
    @media (max-width:600px) {
      .cep-pn-editor-toolbar { gap:4px; }
      .cep-pn-editor-toolbar button { padding:6px 8px; }
    }
    .cep-saved-card-reveal {
      position:relative;
      animation:cepSavedCardReveal 2.4s ease-out both !important;
    }
    @keyframes cepSavedCardReveal {
      0%,18% { box-shadow:0 0 0 4px rgba(255,255,255,.94),0 0 0 9px rgba(219,158,131,.48),0 16px 38px rgba(92,72,82,.24) !important; }
      100% { box-shadow:inherit; }
    }
  `;
  document.head.appendChild(style);
}

function revealSavedCard(card) {
  if (!card?.isConnected) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  card.classList.remove('cep-saved-card-reveal');
  void card.offsetWidth;
  card.classList.add('cep-saved-card-reveal');
  setTimeout(() => card.classList.remove('cep-saved-card-reveal'), 2500);
}

function findPendingCard() {
  if (!pendingCardReveal || Date.now() > pendingCardReveal.expires) {
    pendingCardReveal = null;
    return;
  }
  let card = null;
  if (pendingCardReveal.id) {
    card = [...document.querySelectorAll('.note-card[data-id], .note-tile[data-id]')]
      .find(candidate => candidate.dataset.id === pendingCardReveal.id);
  } else if (pendingCardReveal.adding) {
    card = [...document.querySelectorAll('.note-card.new-note-highlight, .note-tile.new-note-highlight')]
      .find(candidate => !pendingCardReveal.existingIds?.has(candidate.dataset.id || ''));
  }
  if (!card || card === pendingCardReveal.lastCard) return;
  pendingCardReveal.lastCard = card;
  requestAnimationFrame(() => requestAnimationFrame(() => revealSavedCard(card)));
  if (pendingCardReveal.adding && card.dataset.id) pendingCardReveal.id = card.dataset.id;
}

document.addEventListener('click', event => {
  const button = event.target.closest?.('button');
  if (!button) return;
  const label = `${button.textContent || ''} ${button.title || ''}`.trim().toLocaleLowerCase();
  const card = button.closest('.note-card, .note-tile');
  const isSave = card && (/\bsave\b/.test(label) || button.matches('.btn-save,.btn-save-edit,.save-mini'));
  if (isSave) {
    pendingCardReveal = { id: card.dataset.id || '', adding: false, lastCard: null, expires: Date.now() + 12000 };
    setTimeout(findPendingCard, 80);
    setTimeout(findPendingCard, 450);
    setTimeout(findPendingCard, 1200);
    return;
  }
  const isAdd = !card && (/\badd\b/.test(label) || button.matches('.add-btn,#addNoteBtn'));
  if (isAdd) {
    const existingIds = new Set([...document.querySelectorAll('.note-card.new-note-highlight, .note-tile.new-note-highlight')]
      .map(candidate => candidate.dataset.id || ''));
    pendingCardReveal = { id: '', adding: true, existingIds, lastCard: null, expires: Date.now() + 15000 };
    setTimeout(findPendingCard, 250);
  }
}, true);

function openImageZoom(source, alt = 'Note image') {
  document.querySelector('.cep-edit-image-zoom')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'cep-edit-image-zoom';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Enlarged note image');
  overlay.tabIndex = -1;
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483645;display:grid;place-items:center;padding:24px;background:rgba(27,28,32,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);cursor:zoom-out;';
  const image = document.createElement('img');
  image.src = source; image.alt = alt;
  image.style.cssText = 'display:block;max-width:min(94vw,1400px);max-height:90vh;width:auto;height:auto;object-fit:contain;border-radius:12px;box-shadow:0 20px 70px rgba(0,0,0,.38),0 0 0 1px rgba(255,255,255,.55);';
  overlay.appendChild(image);
  const onKeyDown = event => { if (event.key === 'Escape') close(); };
  const close = () => { document.removeEventListener('keydown', onKeyDown); overlay.remove(); };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKeyDown);
  document.body.appendChild(overlay);
  overlay.focus();
}

document.addEventListener('click', event => {
  const image = event.target.closest?.('.note-card img, .note-tile img');
  if (!image || image.closest('.cep-edit-image-zoom')) return;
  // Some pages (for example info.html) provide a richer image viewer with
  // zoom, pan, and highlighting tools. Let their delegated click handler run
  // instead of replacing it with the shared basic viewer.
  if (document.getElementById('imgModal')) return;
  event.preventDefault(); event.stopImmediatePropagation();
  openImageZoom(image.currentSrc || image.src, image.alt || 'Note image');
}, true);

function tableCellAtResizeEdge(target, clientX) {
  const cell = target.closest?.('.cep-pn-editor td, .cep-pn-editor th');
  if (!cell || !cell.nextElementSibling) return null;
  const bounds = cell.getBoundingClientRect();
  return Math.abs(bounds.right - clientX) <= 16 ? cell : null;
}

document.addEventListener('pointermove', event => {
  if (columnResize) {
    const delta = event.clientX - columnResize.startX;
    const requestedWidth = Math.max(19, columnResize.leftWidth + delta);
    const requestedTableWidth = columnResize.tableWidth + (requestedWidth - columnResize.leftWidth);
    const adjustedTableWidth = Math.min(columnResize.maximumTableWidth, Math.max(19, requestedTableWidth));
    const adjustedLeft = Math.max(19, columnResize.leftWidth + (adjustedTableWidth - columnResize.tableWidth));
    [...columnResize.table.rows].forEach(row => {
      const resizedCell = row.cells[columnResize.columnIndex];
      resizedCell?.style.setProperty('width', `${adjustedLeft}px`, 'important');
      if (resizedCell) resizedCell.dataset.cepColumnResized = 'true';
    });
    columnResize.table.dataset.cepTableResized = 'true';
    columnResize.table.style.setProperty('width', `${adjustedTableWidth}px`, 'important');
    columnResize.table.style.setProperty('max-width', '100%', 'important');
    return;
  }
  const cell = tableCellAtResizeEdge(event.target, event.clientX);
  if (event.target instanceof HTMLElement) event.target.style.cursor = cell ? 'col-resize' : '';
}, true);

document.addEventListener('pointerdown', event => {
  const cell = tableCellAtResizeEdge(event.target, event.clientX);
  if (!cell) return;
  const table = cell.closest('table');
  const columnIndex = cell.cellIndex;
  const tableWidth = table.getBoundingClientRect().width;
  const editorWidth = table.closest('.cep-pn-editor')?.getBoundingClientRect().width || table.parentElement?.getBoundingClientRect().width || tableWidth;
  event.preventDefault(); event.stopPropagation();
  table.style.setProperty('table-layout', 'fixed', 'important');
  columnResize = {
    table,
    cell,
    pointerId: event.pointerId,
    columnIndex,
    startX: event.clientX,
    leftWidth: cell.getBoundingClientRect().width,
    tableWidth,
    maximumTableWidth: editorWidth
  };
  try { cell.setPointerCapture(event.pointerId); } catch {}
  document.body.classList.add('cep-resizing-table-column');
}, true);

function finishColumnResize() {
  if (!columnResize) return;
  const editor = columnResize.table.closest('.cep-pn-editor');
  columnResize.table.style.setProperty('table-layout', 'auto', 'important');
  try { columnResize.cell.releasePointerCapture(columnResize.pointerId); } catch {}
  columnResize = null;
  document.body.classList.remove('cep-resizing-table-column');
  if (editor) notifyEditorChanged(editor, 'insertText');
}
document.addEventListener('pointerup', finishColumnResize, true);
document.addEventListener('pointercancel', finishColumnResize, true);

function isNoteEditor(editor) {
  if (!editor.matches('[contenteditable="true"]')) return false;
  if (editor.matches('.note-title, .edit-title, .med-name, .med-subtitle, .med-mechanism, [data-field="medication"], td, th')) return false;
  return Boolean(editor.closest([
    '.note-card', '.note-tile', '.editing-note', '.input-group', '#nurseFormWrapper',
    '#noteInputContainer', '.input-panel', '.edit-form', '.note-form', '.modal-content', 'form'
  ].join(','))) || /note|edit|text/i.test(`${editor.id} ${editor.className}`);
}

function rememberRange(editor) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (editor.contains(range.commonAncestorContainer)) savedRanges.set(editor, range.cloneRange());
}

function restoreEditorRange(editor) {
  editor.focus();
  const range = savedRanges.get(editor);
  if (!range || !editor.contains(range.commonAncestorContainer)) return;
  const selection = window.getSelection();
  selection.removeAllRanges(); selection.addRange(range);
}

function runCommand(editor, command, value = null) {
  restoreEditorRange(editor);
  document.execCommand(command, false, value);
  rememberRange(editor);
  editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'formatBold' }));
}

function notifyEditorChanged(editor, inputType = 'insertText') {
  editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType }));
  const fit = () => {
    if (!editor.isConnected) return;
    if (editor.id === 'noteText' && editor.classList.contains('editable')) {
      editor.style.setProperty('height', 'auto', 'important');
      editor.style.setProperty('flex-shrink', '0', 'important');
      const contentBottom = [...editor.querySelectorAll('table,img')].reduce((bottom, element) =>
        Math.max(bottom, element.offsetTop + element.offsetHeight), 0);
      const requiredHeight = Math.max(100, editor.scrollHeight, contentBottom + 24);
      editor.style.setProperty('height', `${Math.ceil(requiredHeight)}px`, 'important');
    }
  };
  fit();
  requestAnimationFrame(() => requestAnimationFrame(fit));
}

function closestHighlight(node, editor) {
  let element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  while (element && element !== editor) {
    if (element.matches?.('mark, .gradient-highlight, .highlight-gradient, .note-gradient-highlight, .highlight-hue')) return element;
    element = element.parentElement;
  }
  return null;
}

function unwrapHighlight(element) {
  if (!element?.parentNode) return;
  const parent = element.parentNode;
  while (element.firstChild) parent.insertBefore(element.firstChild, element);
  element.remove();
  parent.normalize();
}

function toggleHighlight(editor) {
  restoreEditorRange(editor);
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;
  const startHighlight = closestHighlight(selection.anchorNode, editor);
  const endHighlight = closestHighlight(selection.focusNode, editor);
  if (startHighlight || endHighlight) {
    const highlights = [...new Set([startHighlight, endHighlight].filter(Boolean))];
    highlights.forEach(unwrapHighlight);
    editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'formatBackColor' }));
    editor.focus();
    return;
  }
  if (range.collapsed) return;
  const mark = document.createElement('mark');
  mark.className = 'gradient-highlight';
  try {
    range.surroundContents(mark);
    selection.removeAllRanges();
    const highlightedRange = document.createRange();
    highlightedRange.selectNodeContents(mark);
    selection.addRange(highlightedRange);
    savedRanges.set(editor, highlightedRange.cloneRange());
  } catch {
    const fragment = range.cloneContents();
    const temporary = document.createElement('div');
    temporary.appendChild(fragment);
    document.execCommand('insertHTML', false, `<mark class="gradient-highlight">${temporary.innerHTML}</mark>`);
  }
  editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'formatBackColor' }));
}

function currentCell(editor) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return null;
  let node = selection.anchorNode;
  if (!editor.contains(node)) return null;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  return node?.closest?.('td,th') || null;
}

function insertTable(editor) {
  restoreEditorRange(editor);
  document.execCommand('insertHTML', false, '<table class="cep-note-table" style="width:auto;max-width:100%;border-collapse:collapse;border:1px solid #000;background:#f6f6f7"><tbody><tr><td style="width:1cm;padding:6px;border:1px solid #000;background:#fff"><br></td><td style="width:1cm;padding:6px;border:1px solid #000;background:#fff"><br></td></tr><tr><td style="width:1cm;padding:6px;border:1px solid #000;background:#e5e8ea"><br></td><td style="width:1cm;padding:6px;border:1px solid #000;background:#e5e8ea"><br></td></tr></tbody></table><br>');
  styleTables(editor);
  notifyEditorChanged(editor, 'insertFromPaste');
}

function changeTable(editor, action) {
  restoreEditorRange(editor);
  const cell = currentCell(editor);
  if (!cell) { alert('Click inside a table cell first.'); return; }
  const row = cell.parentElement;
  const table = cell.closest('table');
  const cellIndex = [...row.children].indexOf(cell);
  if (action === 'add-row') {
    const next = document.createElement('tr');
    [...row.children].forEach(() => { const td = document.createElement('td'); td.innerHTML = '<br>'; next.appendChild(td); });
    row.after(next);
  } else if (action === 'add-col') {
    [...table.rows].forEach(tableRow => { const td = document.createElement('td'); td.innerHTML = '<br>'; tableRow.children[cellIndex].after(td); });
  } else if (action === 'del-row') {
    if (table.rows.length <= 1) return alert('A table needs at least one row.');
    row.remove();
  } else if (action === 'del-col') {
    if (table.rows[0].cells.length <= 1) return alert('A table needs at least one column.');
    [...table.rows].forEach(tableRow => tableRow.children[cellIndex]?.remove());
  }
  styleTables(editor);
  notifyEditorChanged(editor);
}

function insertUploadedImage(editor, url) {
  const image = document.createElement('img');
  image.src = url; image.alt = 'Note image'; image.loading = 'lazy'; image.decoding = 'async';
  image.className = 'cep-edit-inserted-image';
  image.style.cssText = 'display:block;max-width:min(100%,420px);height:auto;margin:8px 0;border-radius:8px;cursor:zoom-in;';
  const spacer = document.createElement('br');
  const range = savedRanges.get(editor);
  if (range && editor.contains(range.commonAncestorContainer)) {
    range.deleteContents(); range.insertNode(spacer); range.insertNode(image); range.setStartAfter(spacer); range.collapse(true);
  } else editor.append(image, spacer);
  notifyEditorChanged(editor, 'insertFromPaste');
  editor.focus();
}

function toolbarButton(label, title, action) {
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = label; button.title = title;
  button.addEventListener('mousedown', event => event.preventDefault());
  button.addEventListener('click', action);
  return button;
}

function hideLegacyFormatting(editor) {
  const host = editor.closest([
    '.note-card', '.note-tile', '.editing-note', '.input-group', '#nurseFormWrapper',
    '#noteInputContainer', '.input-panel', '.edit-form', '.note-form', '.modal-content', 'form'
  ].join(','));
  if (!host) return;
  host.querySelectorAll('.edit-table-tools, .main-editor-buttons, .formatting-buttons, .format-buttons')
    .forEach(element => { element.hidden = true; });
  host.querySelectorAll('.btn-bold, .btn-highlight').forEach(element => { element.hidden = true; });
  host.querySelectorAll('input[type="file"]:not(.cep-pn-image-input)').forEach(fileInput => {
    fileInput.hidden = true;
    const label = fileInput.id ? host.querySelector(`label[for="${CSS.escape(fileInput.id)}"]`) : null;
    if (label) label.hidden = true;
  });
  host.querySelectorAll('#uploadPhotoBtn').forEach(element => { element.hidden = true; });
  host.querySelectorAll('div').forEach(container => {
    if (container.classList.contains('cep-pn-editor-toolbar')) return;
    const buttons = [...container.children].filter(child => child.tagName === 'BUTTON');
    if (buttons.length >= 2 && buttons.every(button =>
      ['B', 'I', 'U', 'H', 'BOLD', 'ITALIC', 'UNDERLINE', 'HIGHLIGHT'].includes(button.textContent.trim().toUpperCase())
    )) {
      container.hidden = true;
    }
  });
}

function attachEditor(editor) {
  if (attachedEditors.has(editor) || !isNoteEditor(editor)) return;
  attachedEditors.add(editor); editor.classList.add('cep-pn-editor');
  const toolbar = document.createElement('div');
  toolbar.className = 'cep-pn-editor-toolbar';
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*'; input.hidden = true; input.className = 'cep-pn-image-input';
  const bold = toolbarButton('B', 'Bold', () => runCommand(editor, 'bold'));
  const highlight = toolbarButton('H', 'Toggle gradient highlight', () => toggleHighlight(editor));
  const imageButton = toolbarButton('Img', 'Add image', () => input.click());
  const table = toolbarButton('T', 'Insert 2 × 2 table', () => insertTable(editor));
  const addRow = toolbarButton('R+', 'Add table row', () => changeTable(editor, 'add-row'));
  const addCol = toolbarButton('C+', 'Add table column', () => changeTable(editor, 'add-col'));
  const delRow = toolbarButton('R−', 'Delete table row', () => changeTable(editor, 'del-row'));
  const delCol = toolbarButton('C−', 'Delete table column', () => changeTable(editor, 'del-col'));
  const divider = document.createElement('span'); divider.className = 'cep-pn-editor-divider';
  toolbar.append(bold, highlight, imageButton, divider, table, addRow, delRow, addCol, delCol, input);
  ['keyup', 'mouseup', 'focus'].forEach(type => editor.addEventListener(type, () => rememberRange(editor)));
  editor.addEventListener('input', () => {
    rememberRange(editor);
    const activeCell = currentCell(editor);
    if (activeCell && activeCell.textContent.trim()) {
      delete activeCell.dataset.cepColumnResized;
      activeCell.closest('table')?.removeAttribute('data-cep-table-resized');
    }
    styleTables(editor);
  });
  toolbar.addEventListener('mousedown', () => rememberRange(editor), true);
  input.addEventListener('change', async () => {
    const file = input.files?.[0]; if (!file) return;
    imageButton.disabled = true; imageButton.textContent = 'Uploading…';
    try {
      const app = getApps().length ? getApp() : null;
      if (!app) throw new Error('The page is still connecting. Please try again.');
      insertUploadedImage(editor, await uploadReferenceImage(app, file, 'edited-card-images'));
      imageButton.textContent = 'Added ✓';
      setTimeout(() => { if (imageButton.isConnected) imageButton.textContent = 'Img'; }, 1200);
    } catch (error) {
      console.error('Card image upload failed.', error); alert(error?.message || 'The image could not be added.');
      imageButton.textContent = 'Img';
    } finally { imageButton.disabled = false; input.value = ''; }
  });
  editor.insertAdjacentElement('afterend', toolbar);
  const syncToolbarVisibility = () => {
    toolbar.hidden = editor.getAttribute('contenteditable') !== 'true' ||
      getComputedStyle(editor).display === 'none' || editor.getAttribute('aria-hidden') === 'true';
  };
  syncToolbarVisibility();
  new MutationObserver(syncToolbarVisibility).observe(editor, {
    attributes: true,
    attributeFilter: ['style', 'class', 'hidden', 'aria-hidden', 'contenteditable']
  });
  if (editor.id === 'noteText' && editor.classList.contains('editable')) {
    new MutationObserver(() => notifyEditorChanged(editor)).observe(editor, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  hideLegacyFormatting(editor);
}

function styleTables(root = document) {
  root.querySelectorAll?.('.cep-pn-editor table, .note-card table, .note-tile table').forEach(table => {
    const gridColor = clinicalNotesPage ? '#d9dce2' : '#000';
    table.style.setProperty('border-collapse', 'collapse', 'important');
    table.style.setProperty('table-layout', 'auto', 'important');
    table.style.setProperty('border', `1px solid ${gridColor}`, 'important');
    table.style.setProperty('background', clinicalNotesPage ? 'transparent' : '#f6f6f7', 'important');
    table.querySelectorAll('th,td').forEach(cell => {
      const isEmpty = !cell.textContent.trim() && !cell.querySelector('img,table');
      cell.style.setProperty('border', `1px solid ${gridColor}`, 'important');
      cell.style.setProperty('padding', '6px 7px', 'important');
      cell.style.setProperty('min-width', '0', 'important');
      if (!cell.dataset.cepColumnResized) {
        if (isEmpty) cell.style.setProperty('width', '1cm', 'important');
      }
      cell.style.setProperty(
        'background',
        clinicalNotesPage ? 'transparent' : (cell.parentElement.rowIndex % 2 ? '#e5e8ea' : '#ffffff'),
        'important'
      );
    });
    table.style.setProperty('max-width', '100%', 'important');
    table.style.setProperty('min-width', '0', 'important');
    if (!table.dataset.cepTableResized) {
      const columnCount = table.rows[0]?.cells.length || 0;
      let widths = Array.from({ length: columnCount }, (_, columnIndex) =>
        Math.max(...[...table.rows].map(row => {
          const cell = row.cells[columnIndex];
          return cell ? measuredCellWidth(cell) : 38;
        }))
      );
      const availableWidth = Math.max(38, table.parentElement?.clientWidth || table.closest('.note-card,.note-tile')?.clientWidth || 320);
      const desiredTotal = widths.reduce((sum, width) => sum + width, 0);
      if (desiredTotal > availableWidth) {
        const minimumTotal = widths.length * 38;
        const scale = Math.max(0, (availableWidth - minimumTotal) / Math.max(1, desiredTotal - minimumTotal));
        widths = widths.map(width => 38 + ((width - 38) * scale));
      }
      [...table.rows].forEach(row => widths.forEach((width, columnIndex) => {
        const cell = row.cells[columnIndex];
        if (cell && !cell.dataset.cepColumnResized) {
          cell.style.setProperty('width', `${Math.ceil(width)}px`, 'important');
        }
      }));
      table.style.setProperty('width', `${Math.ceil(Math.min(availableWidth, widths.reduce((sum, width) => sum + width, 0)))}px`, 'important');
    }
  });
}

function scan(root = document) {
  if (root.nodeType === 1 && root.matches?.('[contenteditable="true"]')) attachEditor(root);
  root.querySelectorAll?.('[contenteditable="true"]').forEach(attachEditor);
  styleTables(root);
}

if (clinicalNotesPage) document.body?.classList.add('cep-clinical-notes-page');
installStyles(); scan();
new MutationObserver(records => records.forEach(record => {
  if (record.type === 'attributes') {
    scan(record.target);
    return;
  }
  record.addedNodes.forEach(node => { if (node.nodeType === 1) scan(node); });
  findPendingCard();
})).observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['contenteditable']
});
