import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { collection, doc, getDoc, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const sources = [
  ['nurseNotes','PN.html','PN',['title','note','url']],
  ['informationNotes','info.html','Info',['title','text','url']],
  ['explainNotes','explain.html','Explain',['title','text']],
  ['recallNotes','recalls.html','Recall',['title','note','url']],
  ['practiceNNotes','practiceN.html','Practice Notes',['title','text','url']],
  ['notebookNotes','Notes.html','Nurse Notes',['text']],
  ['ecgNotes','ECG.html','ECG',['note']],
  ['urgentCareNotes','Urgent_Care.html','Urgent Care',['note']],
  ['faceNotes','face.html','Urgent Care — Head',['note']],
  ['handNotes','Hand.html','Urgent Care — Hand & Wrist',['note']],
  ['upperArmNotes','Sha.html','Urgent Care — Shoulder & Elbow',['note']],
  ['abdominisNotes','Abdo.html','Urgent Care — Thorax & Abdomen',['note']],
  ['spineNotes','Spine.html','Urgent Care — Back & Spine',['note']],
  ['footlegNotes','LF.html','Urgent Care — Lower Limb & Foot',['note']],
  ['urlForms','forms.html','Information Links',['title','note','url'],'url']
];

const textFromHtml = value => {
  const parsed = new DOMParser().parseFromString(String(value || ''), 'text/html');
  parsed.body.querySelectorAll('br').forEach(node => node.replaceWith('\n'));
  parsed.body.querySelectorAll('p,div,li,tr,h1,h2,h3,h4,h5,h6,blockquote,pre').forEach(node => node.append('\n'));
  return (parsed.body.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
const imageUrlsFromHtml = value => {
  const parsed = new DOMParser().parseFromString(String(value || ''), 'text/html');
  return [...parsed.body.querySelectorAll('img[src]')].map(image => image.getAttribute('src')).filter(Boolean);
};
const structuredContentSelector = 'table,thead,tbody,tfoot,tr,th,td,ul,ol,li,h1,h2,h3,h4,h5,h6,blockquote,pre,figure,figcaption';
export function hasStructuredSearchContent(html) {
  if (!html) return false;
  const parsed = new DOMParser().parseFromString(String(html), 'text/html');
  return Boolean(parsed.body.querySelector(structuredContentSelector));
}

const normalizeSearchValue = value => String(value || '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
const searchTextCache = new WeakMap();
function getSearchText(entry) {
  let indexed = searchTextCache.get(entry);
  if (!indexed || indexed.rawTitle !== entry.title || indexed.rawText !== entry.text) {
    indexed = { rawTitle: entry.title, rawText: entry.text,
      title: normalizeSearchValue(entry.title),
      text: normalizeSearchValue(entry.text), words: null };
    searchTextCache.set(entry, indexed);
  }
  return indexed;
}

let entriesPromise;
let xgptEntriesPromise;
let xgptConceptMedia = {};
let xgptConceptCounts = new Map();
let xgptDb;
const normalizeConcept = value => String(value || '').toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim();
function getXgptAuth() {
  const config = {
    apiKey: 'AIzaSyDtv3x9PAMzZUW6yVuUSLgLzA0ejcDidF4',
    authDomain: 'notes-chat-c5ff3.firebaseapp.com', projectId: 'notes-chat-c5ff3',
    storageBucket: 'notes-chat-c5ff3.firebasestorage.app', messagingSenderId: '597780727252',
    appId: '1:597780727252:web:8407eb4096dbe301d74241'
  };
  const app = getApps().find(candidate => candidate.name === 'notes-chat') || initializeApp(config, 'notes-chat');
  return { app, auth: getAuth(app) };
}
export async function loadXgptEntries() {
  if (xgptEntriesPromise) return xgptEntriesPromise;
  xgptEntriesPromise = (async () => {
  try {
    const { app, auth } = getXgptAuth();
    if (typeof auth.authStateReady === 'function') await auth.authStateReady();
    if (!auth.currentUser) {
      const error = new Error('Sign in to include Xgpt Notes.');
      error.code = 'xgpt/auth-required';
      throw error;
    }
    const db = getFirestore(app);
    xgptDb = db;
    const snapshot = await getDocs(collection(db, 'notes'));
    const mediaSnapshot = await getDocs(collection(db, 'concept_media')).catch(error => {
      console.warn('Xgpt concept images are unavailable in header search.', error);
      return null;
    });
    xgptConceptMedia = Object.fromEntries((mediaSnapshot?.docs || []).map(item => {
      const media = item.data() || {};
      return [normalizeConcept(media.concept || item.id), { imageUrl: media.imageUrl || '', caption: media.caption || '' }];
    }));
    const entries = snapshot.docs.map(note => {
      const rawHtml = note.data().content || note.data().note || note.data().text || '';
      const text = textFromHtml(rawHtml).replace(/\[\[([^\]]+)\]\]/g, '$1');
      const firstLine = text.split(/[.!?]\s|\n/)[0].trim();
      return {
        id: note.id, file: 'chatgptx.html', sourceTitle: 'Xgpt Notes',
        title: firstLine ? `Xgpt — ${firstLine.slice(0,72)}` : 'Xgpt Note', text, richHtml: rawHtml
      };
    });
    xgptConceptCounts = new Map();
    entries.forEach(entry => {
      const concepts = new Set([...String(entry.richHtml || '').matchAll(/\[\[([^\]\[]+?)\]\]/g)]
        .map(match => normalizeConcept(match[1])).filter(Boolean));
      concepts.forEach(concept => xgptConceptCounts.set(concept, (xgptConceptCounts.get(concept) || 0) + 1));
    });
    return entries;
  } catch (error) {
    xgptEntriesPromise = null;
    if (error?.code === 'xgpt/auth-required') throw error;
    console.warn('Search could not load Xgpt Notes.', error);
    return [];
  }
  })();
  return xgptEntriesPromise;
}

export async function loadXgptConceptMedia(concept) {
  const key = normalizeConcept(concept);
  if (!key) return null;
  if (xgptConceptMedia[key]?.imageUrl) return xgptConceptMedia[key];
  if (!xgptDb) await loadXgptEntries();
  if (!xgptDb) return null;
  try {
    const snapshot = await getDoc(doc(xgptDb, 'concept_media', key));
    if (!snapshot.exists()) return null;
    const data = snapshot.data() || {};
    return xgptConceptMedia[key] = { imageUrl: data.imageUrl || '', caption: data.caption || '' };
  } catch (error) {
    console.warn(`Xgpt concept image could not load for ${concept}.`, error);
    return null;
  }
}

export function getCachedXgptConceptMedia(concept) {
  return xgptConceptMedia[normalizeConcept(concept)] || null;
}

async function loadEntries(onProgress) {
  if (entriesPromise) return entriesPromise;
  entriesPromise = (async () => {
    await window.CEP_AUTH_READY;
    const db = getFirestore(getApp());
    const batches = await Promise.all(sources.map(async ([collectionName,file,sourceTitle,fields,directField]) => {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        onProgress?.(sourceTitle);
        return snapshot.docs.map(note => {
          const data = note.data();
          const title = textFromHtml(data.title).replace(/\s+/g, ' ').trim() || sourceTitle;
          const text = fields.map(field => textFromHtml(data[field])).filter(Boolean).join('\n');
          const displayText = textFromHtml(data.note || data.text || data.content || '') || text;
          const richHtml = data.note || data.text || data.content || '';
          const imageUrls = [...new Set([
            data.image || '',
            ...fields.flatMap(field => imageUrlsFromHtml(data[field]))
          ].filter(Boolean))];
          const directUrl = directField && data[directField];
          return {
            id: note.id, file, sourceTitle, title: title === sourceTitle ? title : `${sourceTitle} — ${title}`,
            text, displayText, directUrl, cardColour: file === 'Notes.html' ? (data.color || '#C0B7BB') : '',
            imageUrl: data.image || '', imageUrls, richHtml
          };
        });
      } catch (error) {
        console.warn(`Search could not load ${collectionName}.`, error);
        return [];
      }
    }));
    return batches.flat();
  })();
  return entriesPromise;
}

export function preloadUniversalSearch() {
  void loadEntries();
  void loadXgptEntries().catch(() => {});
}

function addHighlightedText(parent, text, terms) {
  if (!terms.length) { parent.textContent = text; return; }
  const escaped = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  text.split(pattern).forEach(part => {
    if (terms.includes(part.toLocaleLowerCase())) {
      const mark = document.createElement('mark'); mark.textContent = part; parent.appendChild(mark);
    } else parent.appendChild(document.createTextNode(part));
  });
}

function makeSnippet(entry, terms) {
  const displayText = String(entry.displayText || entry.text || entry.title || '').trim();
  return displayText;
}

function makeNavigationHint(entry, terms) {
  const displayText = makeSnippet(entry, terms);
  if (!displayText) return '';
  const lower = displayText.toLocaleLowerCase();
  const positions = terms.map(term => lower.indexOf(term)).filter(position => position >= 0);
  if (!positions.length) {
    const words = [...lower.matchAll(/[\p{L}\p{N}]+/gu)];
    for (const term of terms) {
      const tolerance = term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0;
      const similar = tolerance && words.find(match =>
        Math.abs(match[0].length - term.length) <= tolerance && editDistance(term, match[0]) <= tolerance
      );
      if (similar) positions.push(similar.index);
    }
  }
  const start = positions.length ? Math.max(0, Math.min(...positions) - 70) : 0;
  const end = Math.min(displayText.length, start + 230);
  return `${start ? '…' : ''}${displayText.slice(start, end)}${end < displayText.length ? '…' : ''}`;
}

const imageFirstSources = new Set([
  'info.html', 'practicen.html', 'ecg.html', 'urgent_care.html',
  'face.html', 'hand.html', 'sha.html', 'abdo.html', 'spine.html', 'lf.html'
]);
function createSearchResultImages(imageUrls, file) {
  return [...new Set((imageUrls || []).filter(Boolean))].flatMap(imageUrl => {
    let safeUrl;
    try {
      const candidate = new URL(String(imageUrl), location.href);
      if (['https:', 'http:'].includes(candidate.protocol)) safeUrl = candidate.href;
      else if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(String(imageUrl))) safeUrl = String(imageUrl);
    } catch {}
    if (!safeUrl) return [];
    const image = document.createElement('img');
    image.className = 'cep-search-attachment';
    if (String(file).toLowerCase() === 'pn.html') image.classList.add('is-pn-image');
    image.src = safeUrl; image.alt = 'Note image'; image.loading = 'lazy'; image.decoding = 'async';
    return [image];
  });
}
function appendSearchResultContent(card, title, body, images, file) {
  card.append(title);
  if (images.length && imageFirstSources.has(String(file).toLowerCase())) card.append(...images);
  card.append(body);
  if (images.length && !imageFirstSources.has(String(file).toLowerCase())) card.append(...images);
}

export function renderXgptSearchRichContent(parent, html, terms = []) {
  const content = document.createElement('div');
  if (window.CEPSecurity?.setHTML) window.CEPSecurity.setHTML(content, html);
  else content.textContent = textFromHtml(html);
  const nodes = [];
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement?.closest('a,button')) return;
    const text = node.nodeValue || '', pattern = /\[\[([^\]\[]+?)\]\]/g;
    if (!pattern.test(text)) return;
    pattern.lastIndex = 0; const fragment = document.createDocumentFragment(); let last = 0;
    text.replace(pattern, (match, inner, offset) => {
      fragment.append(document.createTextNode(text.slice(last, offset)));
      const concept = String(inner || '').trim(); const link = document.createElement('a');
      link.href = '#'; link.className = 'cep-xgpt-concept xgpt-concept-link';
      const label = document.createElement('span'); label.className = 'cep-xgpt-concept-label'; label.textContent = concept;
      link.appendChild(label);
      const media = xgptConceptMedia[normalizeConcept(concept)];
      if (media?.imageUrl) { link.classList.add('has-image'); link.dataset.image = media.imageUrl; link.dataset.caption = media.caption || ''; }
      const count = xgptConceptCounts.get(normalizeConcept(concept)) || 1;
      if (count) {
        const badge = document.createElement('span'); badge.className = 'cep-xgpt-concept-count';
        badge.dataset.count = String(count); badge.setAttribute('aria-hidden', 'true'); link.appendChild(badge);
      }
      fragment.append(link); last = offset + match.length; return match;
    });
    fragment.append(document.createTextNode(text.slice(last))); node.replaceWith(fragment);
  });
  const richTextNodes = []; const highlightWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  while (highlightWalker.nextNode()) richTextNodes.push(highlightWalker.currentNode);
  richTextNodes.forEach(node => {
    if (node.parentElement?.closest('.cep-xgpt-concept')) return;
    if (!node.nodeValue || !terms.some(term => node.nodeValue.toLocaleLowerCase().includes(term))) return;
    const fragment = document.createDocumentFragment(); addHighlightedText(fragment, node.nodeValue, terms); node.replaceWith(fragment);
  });
  const tables = [...content.querySelectorAll('table')];
  parent.append(...content.childNodes);
  tables.forEach(enableSearchTableZoom);
}

export function renderStructuredSearchContent(parent, html, terms = []) {
  const content = document.createElement('div');
  if (window.CEPSecurity?.setHTML) window.CEPSecurity.setHTML(content, html);
  else content.textContent = textFromHtml(html);
  const nodes = [];
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement?.closest('a,button')) return;
    if (!node.nodeValue || !terms.some(term => node.nodeValue.toLocaleLowerCase().includes(term))) return;
    const fragment = document.createDocumentFragment();
    addHighlightedText(fragment, node.nodeValue, terms);
    node.replaceWith(fragment);
  });
  const tables = [...content.querySelectorAll('table')];
  parent.append(...content.childNodes);
  tables.forEach(enableSearchTableZoom);
}

let tableZoomUi;
function getSearchTableZoomUi() {
  if (tableZoomUi?.root?.isConnected) return tableZoomUi;
  const root = document.createElement('div'); root.className = 'cep-search-table-zoom'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Expanded table');
  const panel = document.createElement('div'); panel.className = 'cep-search-table-zoom-panel';
  const controls = document.createElement('div'); controls.className = 'cep-search-table-zoom-controls';
  const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.title = 'Zoom out'; minus.setAttribute('aria-label', 'Zoom out');
  const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = '100%'; reset.title = 'Reset zoom';
  const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.title = 'Zoom in'; plus.setAttribute('aria-label', 'Zoom in');
  const close = document.createElement('button'); close.type = 'button'; close.className = 'cep-search-table-zoom-close'; close.textContent = '×'; close.title = 'Close'; close.setAttribute('aria-label', 'Close expanded table');
  controls.append(minus, reset, plus, close);
  const viewport = document.createElement('div'); viewport.className = 'cep-search-table-zoom-viewport';
  const stage = document.createElement('div'); stage.className = 'cep-search-table-zoom-stage'; viewport.appendChild(stage);
  panel.append(controls, viewport); root.appendChild(panel); document.body.appendChild(root);
  let scale = 1; let table; let previousBodyOverflow = '';
  const sizeStage = () => {
    if (!table) return;
    const width = table.scrollWidth || table.getBoundingClientRect().width;
    const height = table.scrollHeight || table.getBoundingClientRect().height;
    stage.style.width = `${Math.ceil(width * scale)}px`; stage.style.height = `${Math.ceil(height * scale)}px`;
    table.style.transform = `scale(${scale})`; reset.textContent = `${Math.round(scale * 100)}%`;
  };
  const setScale = nextScale => {
    const oldScale = scale; const centerX = viewport.scrollLeft + viewport.clientWidth / 2; const centerY = viewport.scrollTop + viewport.clientHeight / 2;
    scale = Math.min(3, Math.max(.5, nextScale)); sizeStage();
    viewport.scrollLeft = centerX * (scale / oldScale) - viewport.clientWidth / 2;
    viewport.scrollTop = centerY * (scale / oldScale) - viewport.clientHeight / 2;
  };
  const closeZoom = () => {
    if (root.hidden) return;
    root.hidden = true; stage.replaceChildren(); table = null; document.body.style.overflow = previousBodyOverflow;
  };
  const open = sourceTable => {
    table = sourceTable.cloneNode(true); table.querySelectorAll('[id]').forEach(element => element.removeAttribute('id')); table.removeAttribute('id');
    table.classList.add('cep-search-table-zoom-content'); stage.replaceChildren(table); scale = 1;
    previousBodyOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; root.hidden = false;
    requestAnimationFrame(() => { sizeStage(); viewport.scrollTo({ left: 0, top: 0 }); close.focus(); });
  };
  minus.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(scale - .25); });
  plus.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(scale + .25); });
  reset.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(1); });
  close.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); closeZoom(); });
  panel.addEventListener('click', event => event.stopPropagation());
  root.addEventListener('click', event => { if (event.target === root) closeZoom(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !root.hidden) closeZoom(); });
  tableZoomUi = { root, open, close: closeZoom };
  return tableZoomUi;
}

export function enableSearchTableZoom(table) {
  if (!table || table.dataset.cepSearchTableZoom === 'true') return;
  table.dataset.cepSearchTableZoom = 'true'; table.tabIndex = 0;
  table.setAttribute('aria-label', 'Open enlarged table');
  const open = event => { event.preventDefault(); event.stopPropagation(); getSearchTableZoomUi().open(table); };
  table.addEventListener('click', open);
  table.addEventListener('dblclick', event => { event.preventDefault(); event.stopPropagation(); });
  table.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') open(event); });
}

const interactiveSearchChildSelector = 'table,img,button,input,textarea,select,summary,[contenteditable="true"],.cep-xgpt-concept,.xgpt-concept-link,a:not(.cep-global-search-result):not(.universal-search-native-card)';
export function installSearchCardInteractions(card, { copyText, navigate, onNavigate } = {}) {
  let clickTimer;
  const isInteractiveChild = target => target instanceof Element && Boolean(target.closest(interactiveSearchChildSelector));
  card.addEventListener('click', event => {
    if (isInteractiveChild(event.target)) {
      const nestedLink = event.target.closest?.('a:not(.cep-global-search-result):not(.universal-search-native-card):not(.cep-xgpt-concept):not(.xgpt-concept-link)');
      if (!nestedLink) { event.preventDefault(); event.stopPropagation(); }
      return;
    }
    event.preventDefault();
    clearTimeout(clickTimer);
    clickTimer = setTimeout(async () => {
      try {
        await navigator.clipboard.writeText(String(copyText || '').trim());
        card.classList.add('is-copied'); setTimeout(() => card.classList.remove('is-copied'), 550);
      } catch (error) { console.warn('Search result could not be copied.', error); }
    }, 260);
  });
  card.addEventListener('dblclick', event => {
    if (isInteractiveChild(event.target)) { event.preventDefault(); event.stopPropagation(); return; }
    event.preventDefault(); event.stopPropagation(); clearTimeout(clickTimer); onNavigate?.(); navigate?.();
  });
}

function installXgptMediaUi() {
  if (document.querySelector('.cep-xgpt-media-tip')) return;
  const tip = document.createElement('div'); tip.className = 'cep-xgpt-media-tip'; tip.hidden = true;
  const zoom = document.createElement('div'); zoom.className = 'cep-xgpt-image-zoom';
  const zoomImage = document.createElement('img'); zoom.append(zoomImage); document.body.append(tip, zoom);
  let hideTimer; const hide = () => { hideTimer = setTimeout(() => { tip.hidden = true; tip.replaceChildren(); }, 180); };
  document.addEventListener('mouseover', async event => {
    const link = event.target.closest?.('.cep-xgpt-concept'); if (!link) return;
    if (!link.dataset.image) {
      const media = await loadXgptConceptMedia(link.textContent);
      if (media?.imageUrl) { link.classList.add('has-image'); link.dataset.image = media.imageUrl; link.dataset.caption = media.caption; }
    }
    if (!link.dataset.image || !link.isConnected) return;
    clearTimeout(hideTimer); const image = document.createElement('img'); image.src = link.dataset.image; image.alt = link.textContent;
    if (link.dataset.caption) { const caption = document.createElement('div'); caption.className = 'cep-xgpt-media-caption'; caption.textContent = link.dataset.caption; tip.replaceChildren(image, caption); } else tip.replaceChildren(image);
    const rect = link.getBoundingClientRect(); tip.style.left = `${Math.max(12, Math.min(innerWidth - 292, rect.left))}px`; tip.style.top = `${Math.max(12, Math.min(innerHeight - 250, rect.bottom + 8))}px`; tip.hidden = false;
  });
  document.addEventListener('mouseout', event => { if (event.target.closest?.('.cep-xgpt-concept') && !tip.contains(event.relatedTarget)) hide(); });
  tip.addEventListener('mouseenter', () => clearTimeout(hideTimer)); tip.addEventListener('mouseleave', hide);
  tip.addEventListener('click', event => { const image = event.target.closest('img'); if (!image) return; event.preventDefault(); event.stopPropagation(); zoomImage.src = image.src; zoom.classList.add('is-open'); });
  zoom.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    zoom.classList.remove('is-open');
    zoomImage.src = '';
  });
  document.addEventListener('click', event => { if (event.target.closest?.('.cep-xgpt-concept')) { event.preventDefault(); event.stopPropagation(); } }, true);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && zoom.classList.contains('is-open')) zoom.click(); });
}

function editDistance(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

export async function mountUniversalSearch(host, closeSearch) {
  installXgptMediaUi();
  const panel = document.createElement('section');
  panel.className = 'cep-global-search-panel';
  panel.innerHTML = `
    <div class="cep-global-search-row">
      <input type="search" autocomplete="off" spellcheck="false" placeholder="Search all notes and pages…" aria-label="Words to search for">
      <button type="button" aria-label="Close search">×</button>
    </div>
    <div class="cep-global-search-filters" aria-label="Filter search by section"></div>
    <div class="cep-global-search-status" aria-live="polite">Preparing saved-note sections…</div>
    <div class="cep-xgpt-auth-prompt" hidden><span>Sign in to include Xgpt Notes and concept images.</span><button type="button">Sign in to Xgpt</button></div>
    <div class="cep-global-search-results"></div>`;
  host.replaceChildren(panel);
  const input = panel.querySelector('input');
  const filters = panel.querySelector('.cep-global-search-filters');
  const status = panel.querySelector('.cep-global-search-status');
  const xgptPrompt = panel.querySelector('.cep-xgpt-auth-prompt');
  const results = panel.querySelector('.cep-global-search-results');
  panel.querySelector('button').addEventListener('click', closeSearch);
  let entries = [], activeSource = 'All', timer;
  const mergeXgptEntries = xgptEntries => {
    const existingIds = new Set(entries.filter(entry => entry.file === 'chatgptx.html').map(entry => entry.id));
    entries = entries.concat(xgptEntries.filter(entry => !existingIds.has(entry.id)));
    xgptPrompt.hidden = true; renderFilters(); runSearch();
  };
  const requestXgptEntries = () => loadXgptEntries().then(mergeXgptEntries).catch(error => {
    if (error?.code === 'xgpt/auth-required') xgptPrompt.hidden = false;
    else console.warn('Search could not load Xgpt Notes.', error);
  });
  xgptPrompt.querySelector('button').addEventListener('click', async () => {
    const button = xgptPrompt.querySelector('button'); button.disabled = true; button.textContent = 'Signing in…';
    try {
      const { auth } = getXgptAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ login_hint: 'xeve06@gmail.com' });
      sessionStorage.setItem('cep-xgpt-return-search', '1');
      await signInWithRedirect(auth, provider);
    } catch (error) {
      if (error?.code !== 'auth/popup-closed-by-user') console.warn('Xgpt sign-in failed.', error);
    } finally { button.disabled = false; button.textContent = 'Sign in to Xgpt'; }
  });

  const renderFilters = () => {
    const names = ['All', ...new Set(entries.map(entry => entry.sourceTitle))];
    filters.replaceChildren(...names.map(name => {
      const chip = document.createElement('button'); chip.type = 'button'; chip.textContent = name;
      chip.className = name === activeSource ? 'is-active' : '';
      chip.addEventListener('click', () => { activeSource = name; renderFilters(); runSearch(); });
      return chip;
    }));
  };

  const runSearch = () => {
    const query = normalizeSearchValue(input.value);
    const terms = [...new Set(query.split(/\s+/).filter(Boolean))];
    const commaGroups = query.includes(',')
      ? [...new Set(query.split(',').map(group => group.trim()).filter(Boolean))]
          .map(group => ({ query: group, terms: [...new Set(group.split(/\s+/).filter(Boolean))] }))
      : null;
    const renderTerms = commaGroups
      ? [...new Set(commaGroups.flatMap(group => group.terms))]
      : terms;
    results.replaceChildren();
    if (!query) { status.textContent = 'Type a word to search.'; return; }
    const scoredMatches = entries.map(entry => {
      const indexed = getSearchText(entry);
      const { title, text } = indexed;
      if (commaGroups) {
        const matchedGroups = [];
        for (const group of commaGroups) {
          let groupScore = 0;
          if (title === group.query) groupScore += 500;
          else if (title.includes(group.query)) groupScore += 260;
          if (text.includes(group.query)) groupScore += 130;
          let fuzzy = false; let matched = true;
          for (const term of group.terms) {
            if (title.includes(term)) groupScore += 90;
            else if (text.includes(term)) groupScore += 28;
            else {
              const tolerance = term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0;
              const words = tolerance ? (indexed.words ||= [...new Set(`${title} ${text}`.match(/[\p{L}\p{N}]+/gu) || [])]) : [];
              const similar = tolerance && words.some(word => Math.abs(word.length - term.length) <= tolerance && editDistance(term, word) <= tolerance);
              if (!similar) { matched = false; break; }
              fuzzy = true; groupScore += 8;
            }
          }
          if (matched) matchedGroups.push({ score: groupScore, fuzzy });
        }
        if (!matchedGroups.length) return null;
        return {
          entry,
          score: matchedGroups.reduce((total, group) => total + group.score, 0),
          matchedGroupCount: matchedGroups.length,
          fuzzy: matchedGroups.every(group => group.fuzzy)
        };
      }
      let score = 0;
      if (title === query) score += 500;
      else if (title.includes(query)) score += 260;
      if (text.includes(query)) score += 130;
      let fuzzy = false;
      for (const term of terms) {
        if (title.includes(term)) score += 90;
        else if (text.includes(term)) score += 28;
        else {
          const tolerance = term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0;
          const words = tolerance ? (indexed.words ||= [...new Set(`${title} ${text}`.match(/[\p{L}\p{N}]+/gu) || [])]) : [];
          const similar = tolerance && words.some(word => Math.abs(word.length - term.length) <= tolerance && editDistance(term, word) <= tolerance);
          if (!similar) return null;
          fuzzy = true; score += 8;
        }
      }
      return { entry, score, fuzzy };
    }).filter(Boolean).filter(match => activeSource === 'All' || match.entry.sourceTitle === activeSource)
      .sort((a,b) => commaGroups
        ? b.matchedGroupCount - a.matchedGroupCount || b.score - a.score
        : b.score - a.score);
    const sourceResultCounts = new Map();
    const matches = [];
    for (const match of scoredMatches) {
      const sourceName = match.entry.sourceTitle || '';
      const sourceCount = sourceResultCounts.get(sourceName) || 0;
      if (sourceName === 'Xgpt Notes' && sourceCount >= 10) continue;
      matches.push(match);
      sourceResultCounts.set(sourceName, sourceCount + 1);
      if (matches.length >= 30) break;
    }
    const onlySimilar = matches.length && matches.every(match => match.fuzzy);
    status.textContent = matches.length ? `${onlySimilar ? 'No exact matches · showing ' : ''}${matches.length}${matches.length === 30 ? '+' : ''} ${onlySimilar ? 'similar ' : ''}result${matches.length === 1 ? '' : 's'}` : 'No matching notes found.';
    const groups = new Map();
    matches.forEach(({ entry }) => {
      const snippetText = entry.file === 'chatgptx.html' ? entry.text : makeSnippet(entry, renderTerms);
      const navigationHint = entry.file === 'chatgptx.html' ? entry.text : makeNavigationHint(entry, renderTerms);
      let group = groups.get(entry.sourceTitle);
      if (!group) {
        group = document.createElement('section'); group.className = 'cep-global-search-group';
        const sourceColours = {
          'pn.html': ['rgba(192,137,139,.58)', '#755255', 'rgba(239,221,222,.72)'],
          'info.html': ['rgba(126,161,158,.58)', '#4e706d', 'rgba(219,232,231,.76)'],
          'explain.html': ['rgba(170,173,111,.58)', '#686b40', 'rgba(235,235,211,.78)'],
          'recalls.html': ['rgba(199,132,101,.55)', '#82533f', 'rgba(240,220,211,.76)']
        };
        const sourceCardColours = {
          'pn.html':'rgba(229,203,204,.3)', 'info.html':'rgba(229,203,204,.3)',
          'explain.html':'rgba(229,203,204,.3)', 'recalls.html':'rgba(229,203,204,.3)',
          'practicen.html':'rgba(229,203,204,.22)', 'notes.html':'rgb(192,183,187)',
          'ecg.html':'rgba(239,237,232,.74)', 'urgent_care.html':'rgba(239,237,232,.74)',
          'face.html':'rgba(239,237,232,.74)', 'hand.html':'rgba(239,237,232,.74)',
          'sha.html':'rgba(239,237,232,.74)', 'abdo.html':'rgba(239,237,232,.74)',
          'spine.html':'rgba(239,237,232,.74)', 'lf.html':'rgba(239,237,232,.74)',
          'forms.html':'rgb(213,208,211)'
        };
        const fileKey = entry.file.toLocaleLowerCase();
        const [divider, headingColour] = sourceColours[fileKey] ||
          ['rgba(112,126,125,.42)', '#655b60'];
        const cardColour = sourceCardColours[fileKey] || 'rgba(255,255,255,.62)';
        group.style.setProperty('--search-divider', divider);
        group.style.setProperty('--search-title', headingColour);
        group.style.setProperty('--search-card', cardColour);
        const heading = document.createElement('a'); heading.className = 'cep-global-search-group-title';
        heading.textContent = entry.sourceTitle; heading.href = entry.file;
        const cards = document.createElement('div'); cards.className = 'cep-global-search-group-cards';
        group.append(heading, cards); results.appendChild(group); groups.set(entry.sourceTitle, group);
      }
      const link = document.createElement('a'); link.className = 'cep-global-search-result';
      if (entry.cardColour) link.style.background = entry.cardColour;
      if (entry.directUrl) { link.href = entry.directUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else {
        const destination = new URL(entry.file, location.href);
        destination.hash = new URLSearchParams({ cepId: entry.id, cepSearch: query, cepHint: navigationHint }).toString();
        link.href = destination.href;
      }
      const structuredRichContent = entry.file !== 'chatgptx.html' && hasStructuredSearchContent(entry.richHtml);
      const title = document.createElement('strong'); title.textContent = entry.title;
      const cardBody = document.createElement(entry.file === 'chatgptx.html' || structuredRichContent ? 'div' : 'span');
      const separateImageUrls = structuredRichContent
        ? (entry.imageUrls || [entry.imageUrl]).filter(imageUrl => imageUrl && !String(entry.richHtml || '').includes(imageUrl))
        : (entry.imageUrls || [entry.imageUrl]);
      const resultImages = createSearchResultImages(separateImageUrls, entry.file);
      if (entry.file === 'chatgptx.html' && entry.richHtml) {
        cardBody.className = 'cep-xgpt-rich-content';
        renderXgptSearchRichContent(cardBody, entry.richHtml, renderTerms);
      } else if (structuredRichContent) {
        cardBody.className = 'cep-structured-rich-content';
        renderStructuredSearchContent(cardBody, entry.richHtml, renderTerms);
      } else addHighlightedText(cardBody, snippetText, renderTerms);
      appendSearchResultContent(link, title, cardBody, resultImages, entry.file);
      installSearchCardInteractions(link, {
        copyText: entry.displayText || entry.text || entry.title,
        navigate: () => {
          if (entry.directUrl) window.open(link.href, '_blank', 'noopener');
          else location.assign(link.href);
        }
      });
      group.querySelector('.cep-global-search-group-cards').appendChild(link);
    });
  };
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(runSearch, 140); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSearch();
    if (event.key === 'Enter') {
      const firstResult = results.querySelector('.cep-global-search-result');
      if (firstResult?.href) location.assign(firstResult.href);
    }
  });
  input.focus();
  entries = await loadEntries(source => { status.textContent = `Loading ${source}…`; });
  renderFilters(); runSearch(); input.focus();
  void requestXgptEntries();
}
