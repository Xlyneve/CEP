export const sourceCardDefinitions = {
  'PN.html': { card: 'note-card', title: 'note-title', body: 'note-content', meta: '', image: 'note-image', url: 'note-url', container: 'nurseNotesList', imageAfter: true, dateField: 'time' },
  'info.html': { card: 'note-card', title: 'note-title', body: 'note-text', meta: 'timestamp', image: '', url: 'note-url', container: 'notesContainer', imageFirst: true, urlBefore: true, dateField: 'timestamp', datePrefix: 'Added: ' },
  'explain.html': { card: 'note-card', title: 'note-title', body: 'note-text', meta: 'timestamp', container: 'notesContainer', dateField: 'timestamp', datePrefix: 'Saved on ' },
  'recalls.html': { imageAfter: true, image: 'zoomable', card: 'note-card', title: 'note-title', body: 'note-content', meta: '', url: 'note-url', container: 'nurseNotesList', dateField: 'time' },
  'practiceN.html': { card: 'note-card', title: 'note-title', body: 'note-text', meta: 'timestamp', url: 'note-url', container: 'notesContainer', urlBefore: true, dateField: 'timestamp', datePrefix: 'Added: ' },
  'Notes.html': { card: 'note-tile', body: 'note-display', meta: 'note-date', container: 'noteGrid', dateField: 'date', savedColor: true },
  'forms.html': { card: 'file-item', title: '', body: '', container: 'fileList', form: true },
  'chatgptx.html': { card: 'message bot', body: 'chatBubble', container: 'messages' },
};
for (const name of ['ECG', 'Urgent_Care', 'face', 'Hand', 'Sha', 'Abdo', 'Spine', 'LF']) {
  sourceCardDefinitions[name + '.html'] = { card: 'note-card', body: 'note-text', image: 'note-image', container: 'notesContainer', imageFirst: true,
    ...(name === 'ECG' ? { meta: 'note-date', dateField: 'createdAt', dateFirst: true } : {}) };
}
export function sourceDate(value, file) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value.seconds != null ? value.seconds * 1000 : value);
  if (Number.isNaN(date.getTime())) return '';
  if (file === 'ECG.html') return date.toLocaleDateString('en-NZ', {day:'2-digit',month:'short',year:'numeric'});
  if (file === 'Notes.html') return date.toLocaleString('en-GB', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
  return date.toLocaleString();
}
// This creates display content only. Saving/editing stays on the source page.
export function createSourceCard(doc, file, data, renderRich) {
  const def = sourceCardDefinitions[file];
  const card = doc.createElement('div'); card.className = def.card + ' source-card';
  const make = (tag, original, alias) => { const el = doc.createElement(tag); el.className = [original, alias].filter(Boolean).join(' '); return el; };
  const title = make(def.form ? 'strong' : 'div', def.title, 'source-title');
  title.textContent = data.title || (def.form ? 'Untitled' : '');
  const body = make(def.form ? 'em' : 'div', def.body, 'source-body');
  let html = String(data.content || data.note || data.text || '');
  const escape = value => { const el=doc.createElement('div');el.textContent=value;return el.innerHTML; };
  if (file === 'Notes.html') html = escape(html);
  if (file === 'info.html' || file === 'practiceN.html') {
    const decoded=doc.createElement('textarea');decoded.innerHTML=html;html=decoded.value;
    if (!html.includes('<')) html=escape(html).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/==(.+?)==/g,'<mark class="gradient-highlight">$1</mark>').replace(/\n/g,'<br>');
  }
  renderRich(body, (file === 'chatgptx.html' ? '🤖 ' : '') + html);
  body.querySelectorAll('.table-control-toggle,.table-control-panel,.table-btn').forEach(el=>el.remove());
  const image = make('img', def.image, 'source-image'); image.alt = 'Note image'; image.loading = 'lazy'; image.decoding = 'async';
  if (data.image) image.src = data.image;
  if (file === 'PN.html') image.style.cssText = 'width:65%;max-width:220px;margin-top:10px;border-radius:6px;cursor:pointer;display:block';
  if (file === 'info.html' || file === 'recalls.html') image.style.cssText = 'max-width:100%;margin-top:10px;border-radius:6px;cursor:zoom-in';
  const meta = make('div', def.meta, 'source-meta');
  meta.textContent = (def.datePrefix || '') + sourceDate(data[def.dateField], file);
  if (def.dateField && !def.meta) meta.style.cssText = 'font-size:12px;margin-top:10px;color:#555';
  const url = make('div', def.url, 'source-url'); const link = doc.createElement('a');
  if (data.url) link.href = data.url;
  link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.textContent = file === 'practiceN.html' ? '🔗 Open' : def.urlBefore ? 'URL Link' : '🔗 Open URL';
  if (def.urlBefore) link.className = 'styled-link';
  url.append(link);
  if (def.savedColor) card.style.background = data.color || '#C0B7BB';
  if (def.dateFirst && data[def.dateField]) card.append(meta);
  if (def.imageFirst && data.image) card.append(image);
  if (def.form) {
    const view = doc.createElement('div'); view.className = 'view-mode'; view.append(title); if (data.note) view.append(body); card.append(view);
  } else {
    if (def.title) card.append(title);
    if (def.urlBefore && data.url) card.append(url);
    card.append(body);
  }
  if (def.imageAfter && data.image) card.append(image);
  if (def.dateField && !def.dateFirst && data[def.dateField]) card.append(meta);
  if (def.url && !def.urlBefore && data.url) card.append(url);
  return card;
}
