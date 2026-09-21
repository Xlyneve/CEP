import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { collection, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
const structuredContentSelector = 'table,thead,tbody,tfoot,tr,th,td,ul,ol,li,h1,h2,h3,h4,h5,h6,blockquote,pre,figure,figcaption,p,br,strong,b,em,i,u,mark,s,small,sub,sup,img,span[style],div[style]';
export function hasStructuredSearchContent(html) {
  if (!html) return false;
  const parsed = new DOMParser().parseFromString(String(html), 'text/html');
  return Boolean(parsed.body.querySelector(structuredContentSelector));
}

const normalizeSearchValue = value => String(value || '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
const persistentSearchCacheName = 'cep-search-cache-v1';
const persistentSearchCacheStore = 'datasets';
const persistentSearchCacheTtl = 24 * 60 * 60 * 1000;
const persistentSearchInvalidationKey = 'cep-search-cache-invalidated-at';
const persistentSearchDatasetInvalidationPrefix = 'cep-search-cache-invalidated:';
const invalidatedDatasetFromEvent = event => {
  if (event?.type === 'cep-search-cache-invalidated') return String(event.detail?.dataset || '');
  const key = String(event?.key || '');
  return key.startsWith(persistentSearchDatasetInvalidationPrefix)
    ? key.slice(persistentSearchDatasetInvalidationPrefix.length)
    : '';
};
const persistentDatasetForKey = key => {
  const parts = String(key || '').split(':');
  if (parts[0] === 'xgpt') return `xgpt:${parts[3] || ''}`;
  if (parts[0] === 'main') return `main:${parts[2] || ''}`;
  return '';
};
let persistentSearchDbPromise;
const cacheSafeValue = value => {
  if (value == null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (value instanceof Date) return { __cepSearchDate: value.getTime() };
  if (typeof value?.toMillis === 'function') return { __cepSearchDate: value.toMillis() };
  if (Array.isArray(value)) return value.map(cacheSafeValue);
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([, item]) => typeof item !== 'function' && item !== undefined)
    .map(([key, item]) => [key, cacheSafeValue(item)]));
  return String(value);
};
const reviveCachedValue = value => {
  if (!value || typeof value !== 'object') return value;
  if (!Array.isArray(value) && Number.isFinite(value.__cepSearchDate)) return new Date(value.__cepSearchDate);
  if (Array.isArray(value)) return value.map(reviveCachedValue);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, reviveCachedValue(item)]));
};
const openPersistentSearchCache = () => {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  if (persistentSearchDbPromise) return persistentSearchDbPromise;
  persistentSearchDbPromise = new Promise(resolve => {
    const request = indexedDB.open(persistentSearchCacheName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(persistentSearchCacheStore, { keyPath: 'key' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });
  return persistentSearchDbPromise;
};
export async function readPersistentSearchCache(key) {
  try {
    const db = await openPersistentSearchCache();
    if (!db) return undefined;
    const record = await new Promise(resolve => {
      const request = db.transaction(persistentSearchCacheStore, 'readonly').objectStore(persistentSearchCacheStore).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
    // Derive from the key so records written before the Xgpt dataset-label fix
    // are invalidated correctly without requiring users to clear site data.
    const dataset = persistentDatasetForKey(key) || record?.dataset || '';
    const invalidatedAt = Math.max(
      Number(localStorage.getItem(persistentSearchInvalidationKey) || 0),
      Number(dataset ? localStorage.getItem(`${persistentSearchDatasetInvalidationPrefix}${dataset}`) || 0 : 0)
    );
    if (!record || record.savedAt < invalidatedAt || Date.now() - record.savedAt >= persistentSearchCacheTtl) return undefined;
    return reviveCachedValue(record.value);
  } catch { return undefined; }
}
export async function writePersistentSearchCache(key, value) {
  try {
    const db = await openPersistentSearchCache();
    if (!db) return;
    await new Promise(resolve => {
      const dataset = persistentDatasetForKey(key);
      const request = db.transaction(persistentSearchCacheStore, 'readwrite').objectStore(persistentSearchCacheStore)
        .put({ key, dataset, savedAt: Date.now(), value: cacheSafeValue(value) });
      request.onsuccess = request.onerror = () => resolve();
    });
  } catch {}
}
export function invalidatePersistentSearchCache(dataset = '') {
  try {
    const key = dataset ? `${persistentSearchDatasetInvalidationPrefix}${dataset}` : persistentSearchInvalidationKey;
    localStorage.setItem(key, String(Date.now()));
  } catch {}
}
const loadPersistentSearchValue = async (key, loader) => {
  const cached = await readPersistentSearchCache(key);
  if (cached !== undefined) return cached;
  const value = await loader();
  await writePersistentSearchCache(key, value);
  return value;
};
export function loadPersistentSearchDocuments(db, collectionName, scope) {
  return loadPersistentSearchValue(`${scope}:${collectionName}:documents:v1`, async () => {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(item => ({ id: item.id, data: item.data() }));
  });
}
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
let xgptConceptMediaLoaded = false;
let xgptConceptDefinitions = {};
let xgptConceptCounts = new Map();
const clearInMemorySearchCache = () => {
  entriesPromise = null;
  xgptEntriesPromise = null;
  xgptConceptMedia = {};
  xgptConceptMediaLoaded = false;
  xgptConceptDefinitions = {};
  xgptConceptCounts = new Map();
};
window.addEventListener('cep-search-cache-invalidated', clearInMemorySearchCache);
window.addEventListener('storage', event => {
  if (event.key === persistentSearchInvalidationKey || event.key?.startsWith(persistentSearchDatasetInvalidationPrefix)) clearInMemorySearchCache();
});
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
    const cacheScope = `xgpt:${auth.currentUser.uid}:v1`;
    const [entries, media, definitions] = await Promise.all([
      // v2 forces one clean reload after correcting the historic Xgpt dataset label.
      loadPersistentSearchValue(`${cacheScope}:notes:v2`, async () => {
        const snapshot = await getDocs(collection(db, 'notes'));
        return snapshot.docs.map(note => {
          const rawHtml = note.data().content || note.data().note || note.data().text || '';
          const text = textFromHtml(rawHtml).replace(/\[\[([^\]]+)\]\]/g, '$1');
          const firstLine = text.split(/[.!?]\s|\n/)[0].trim();
          return {
            id: note.id, file: 'chatgptx.html', sourceTitle: 'Xgpt Notes',
            title: firstLine ? `Xgpt — ${firstLine.slice(0,72)}` : 'Xgpt Note', text, richHtml: rawHtml
          };
        });
      }),
      loadPersistentSearchValue(`${cacheScope}:media`, async () => {
        const mediaSnapshot = await getDocs(collection(db, 'concept_media'));
        return Object.fromEntries(mediaSnapshot.docs.map(item => {
          const media = item.data() || {};
          return [normalizeConcept(media.concept || item.id), { imageUrl: media.imageUrl || '', caption: media.caption || '' }];
        }));
      }).catch(error => {
        console.warn('Xgpt concept images are unavailable in header search.', error);
        return {};
      }),
      loadPersistentSearchValue(`${cacheScope}:definitions`, async () => {
        const definitionsSnapshot = await getDocs(collection(db, 'concept_defs'));
        return Object.fromEntries(definitionsSnapshot.docs.map(item => {
          const definition = item.data() || {};
          return [normalizeConcept(definition.concept || item.id), {
            definition: definition.value || '', why: definition.why || ''
          }];
        }));
      }).catch(error => {
        console.warn('Xgpt concept definitions are unavailable in search.', error);
        return {};
      })
    ]);
    xgptConceptMedia = media;
    xgptConceptMediaLoaded = true;
    xgptConceptDefinitions = definitions;
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
  if (!xgptConceptMediaLoaded) await loadXgptEntries();
  return xgptConceptMedia[key]?.imageUrl ? xgptConceptMedia[key] : null;
}

export function getCachedXgptConceptMedia(concept) {
  return xgptConceptMedia[normalizeConcept(concept)] || null;
}

export function getCachedXgptConceptDefinition(concept) {
  return xgptConceptDefinitions[normalizeConcept(concept)] || null;
}

async function loadEntries(onProgress) {
  if (entriesPromise) return entriesPromise;
  entriesPromise = (async () => {
    await window.CEP_AUTH_READY;
    const db = getFirestore(getApp());
    const userId = getAuth(getApp()).currentUser?.uid || 'signed-in';
    const batches = await Promise.all(sources.map(async ([collectionName,file,sourceTitle,fields,directField]) => {
      try {
        const documents = await loadPersistentSearchDocuments(db, collectionName, `main:${userId}`);
        onProgress?.(sourceTitle);
        return documents.map(note => {
          const data = note.data;
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
            imageUrl: data.image || '', imageUrls, richHtml, record: { id: note.id, data }
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
    enableSearchImageZoom(image);
    return [image];
  });
}
function appendSearchResultContent(card, title, body, images, file) {
  if (title) card.append(title);
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
      const details = xgptConceptDefinitions[normalizeConcept(concept)];
      if (details?.definition) link.dataset.definition = details.definition;
      if (details?.why) link.dataset.why = details.why;
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
  const tables = [...content.querySelectorAll('table')]; const images = [...content.querySelectorAll('img')];
  parent.append(...content.childNodes);
  tables.forEach(enableSearchTableZoom);
  images.forEach(enableSearchImageZoom);
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
  const tables = [...content.querySelectorAll('table')]; const images = [...content.querySelectorAll('img')];
  parent.append(...content.childNodes);
  tables.forEach(enableSearchTableZoom);
  images.forEach(enableSearchImageZoom);
}

const sourceCardTypes = {
  'pn.html':'pn', 'notes.html':'notes', 'ecg.html':'ecg', 'urgent_care.html':'urgent',
  'face.html':'urgent', 'hand.html':'urgent', 'sha.html':'urgent', 'abdo.html':'urgent',
  'spine.html':'urgent', 'lf.html':'urgent', 'practicen.html':'practice', 'info.html':'info',
  'explain.html':'explain', 'recalls.html':'pn', 'forms.html':'forms'
};
const sourceDateValue = value => value?.toDate ? value.toDate() : value ? new Date(value) : null;
const sourceLegacyHtml = value => {
  const raw = String(value || '');
  if (raw.includes('<')) return raw;
  const escaped = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/==(.+?)==/g, '<mark class="gradient-highlight">$1</mark>').replace(/\n/g, '<br>');
};
const appendSourceRichContent = (parent, html, terms, className) => {
  const body = document.createElement('div'); body.className = className;
  renderStructuredSearchContent(body, html, terms); parent.appendChild(body); return body;
};
const appendSourceImage = (parent, url, className = 'cep-source-card-image') => {
  if (!String(url || '').trim()) return null;
  let safeUrl;
  try {
    const candidate = new URL(String(url || ''), location.href);
    if (['https:', 'http:'].includes(candidate.protocol)) safeUrl = candidate.href;
    else if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(String(url || ''))) safeUrl = String(url);
  } catch {}
  if (!safeUrl) return null;
  const image = document.createElement('img'); image.className = className; image.src = safeUrl;
  image.alt = 'Note image'; image.loading = 'lazy'; image.decoding = 'async'; enableSearchImageZoom(image);
  image.addEventListener('error', () => image.remove(), { once: true });
  parent.appendChild(image); return image;
};
const appendSourceLink = (parent, url, label) => {
  if (!url) return;
  let safeUrl;
  try { const candidate = new URL(String(url), location.href); if (['https:', 'http:', 'mailto:', 'tel:'].includes(candidate.protocol)) safeUrl = candidate.href; } catch {}
  if (!safeUrl) return;
  const wrap = document.createElement('div'); wrap.className = 'cep-source-card-url';
  const link = document.createElement('a'); link.href = safeUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.textContent = '🔗'; link.setAttribute('aria-label', label || 'Open link'); link.title = label || 'Open link';
  wrap.appendChild(link); parent.appendChild(wrap);
};

export function renderSourceSearchCard(parent, entry, terms = []) {
  const data = entry?.record?.data;
  const type = sourceCardTypes[String(entry?.file || '').toLocaleLowerCase()];
  if (!data || !type) return false;
  parent.classList.add('cep-source-card', `cep-source-card--${type}`);
  parent.dataset.sourceCardType = type;
  if (entry.cardColour) parent.style.background = entry.cardColour;

  if (type === 'forms') {
    const view = document.createElement('div'); view.className = 'cep-source-card-view';
    const title = document.createElement('strong'); title.textContent = data.title || 'Untitled'; view.appendChild(title);
    if (data.note) { const note = document.createElement('em'); renderStructuredSearchContent(note, data.note, terms); view.appendChild(note); }
    parent.appendChild(view); return true;
  }
  if (type === 'notes') {
    const display = document.createElement('div'); display.className = 'cep-source-note-display';
    addHighlightedText(display, String(data.text || ''), terms); parent.appendChild(display);
    const date = sourceDateValue(data.date);
    if (date && !Number.isNaN(date.valueOf())) {
      const dateLine = document.createElement('div'); dateLine.className = 'cep-source-card-date';
      dateLine.textContent = date.toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:false });
      parent.appendChild(dateLine);
    }
    return true;
  }
  if (type === 'ecg' || type === 'urgent') {
    if (type === 'ecg') {
      const date = sourceDateValue(data.createdAt);
      if (date && !Number.isNaN(date.valueOf())) {
        const dateLine = document.createElement('div'); dateLine.className = 'cep-source-card-date';
        dateLine.textContent = date.toLocaleDateString('en-NZ', { day:'2-digit', month:'short', year:'numeric' }); parent.appendChild(dateLine);
      }
    }
    appendSourceImage(parent, data.image);
    appendSourceRichContent(parent, data.note || '', terms, 'cep-source-note-text');
    return true;
  }
  if (type === 'pn') {
    const title = document.createElement('div'); title.className = 'cep-source-note-title'; title.textContent = data.title || ''; parent.appendChild(title);
    appendSourceRichContent(parent, data.note || '', terms, 'cep-source-note-content');
    appendSourceImage(parent, data.image, 'cep-source-card-image cep-source-card-image--pn');
    const date = sourceDateValue(data.time);
    if (date && !Number.isNaN(date.valueOf())) { const line = document.createElement('div'); line.className = 'cep-source-card-date'; line.textContent = date.toLocaleString(); parent.appendChild(line); }
    appendSourceLink(parent, data.url, '🔗 Open URL'); return true;
  }
  if (type === 'practice' || type === 'info' || type === 'explain') {
    if (type === 'info') appendSourceImage(parent, data.image);
    const title = document.createElement('div'); title.className = 'cep-source-note-title'; title.textContent = data.title || ''; parent.appendChild(title);
    if (type !== 'explain') appendSourceLink(parent, data.url, type === 'practice' ? '🔗 Open' : 'URL Link');
    appendSourceRichContent(parent, sourceLegacyHtml(data.text || ''), terms, 'cep-source-note-text');
    if (type === 'practice') appendSourceImage(parent, data.image);
    const date = sourceDateValue(data.timestamp);
    if (date && !Number.isNaN(date.valueOf())) { const line = document.createElement('div'); line.className = 'cep-source-card-date'; line.textContent = `${type === 'explain' ? 'Saved on ' : 'Added: '}${date.toLocaleString()}`; parent.appendChild(line); }
    return true;
  }
  return false;
}

export function getSearchCopyHtml(entry) {
  const data = entry?.record?.data;
  const type = sourceCardTypes[String(entry?.file || '').toLocaleLowerCase()];
  if (data && type === 'notes') return String(data.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  if (data && type === 'forms') return String(data.note || '');
  if (data && (type === 'pn' || type === 'ecg' || type === 'urgent')) return String(data.note || '');
  if (data && (type === 'practice' || type === 'info' || type === 'explain')) return sourceLegacyHtml(data.text || '');
  return String(entry?.richHtml || '');
}

let imageZoomUi;
function getSearchImageZoomUi() {
  if (imageZoomUi?.root?.isConnected) return imageZoomUi;
  const root = document.createElement('div'); root.className = 'cep-search-image-viewer'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Expanded image');
  const panel = document.createElement('div'); panel.className = 'cep-search-image-viewer-panel';
  const controls = document.createElement('div'); controls.className = 'cep-search-image-viewer-controls';
  const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.title = 'Zoom out'; minus.setAttribute('aria-label', 'Zoom out');
  const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = '100%'; reset.title = 'Reset zoom';
  const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.title = 'Zoom in'; plus.setAttribute('aria-label', 'Zoom in');
  const close = document.createElement('button'); close.type = 'button'; close.className = 'cep-search-image-viewer-close'; close.textContent = '×'; close.title = 'Close'; close.setAttribute('aria-label', 'Close expanded image');
  controls.append(minus, reset, plus, close);
  const viewport = document.createElement('div'); viewport.className = 'cep-search-image-viewer-viewport';
  const stage = document.createElement('div'); stage.className = 'cep-search-image-viewer-stage'; viewport.appendChild(stage);
  panel.append(controls, viewport); root.appendChild(panel); document.body.appendChild(root);
  let scale = 1; let image; let baseWidth = 0; let baseHeight = 0; let previousBodyOverflow = '';
  const sizeStage = () => {
    if (!image || !baseWidth || !baseHeight) return;
    const scaledWidth = Math.ceil(baseWidth * scale); const scaledHeight = Math.ceil(baseHeight * scale);
    const stageWidth = Math.max(scaledWidth, viewport.clientWidth); const stageHeight = Math.max(scaledHeight, viewport.clientHeight);
    stage.style.width = `${stageWidth}px`; stage.style.height = `${stageHeight}px`;
    image.style.left = `${Math.max(0, Math.floor((stageWidth - scaledWidth) / 2))}px`;
    image.style.top = `${Math.max(0, Math.floor((stageHeight - scaledHeight) / 2))}px`;
    image.style.transform = `scale(${scale})`; reset.textContent = `${Math.round(scale * 100)}%`;
  };
  const setScale = nextScale => {
    const oldScale = scale; const centerX = viewport.scrollLeft + viewport.clientWidth / 2; const centerY = viewport.scrollTop + viewport.clientHeight / 2;
    scale = Math.min(4, Math.max(.5, nextScale)); sizeStage();
    viewport.scrollLeft = centerX * (scale / oldScale) - viewport.clientWidth / 2;
    viewport.scrollTop = centerY * (scale / oldScale) - viewport.clientHeight / 2;
  };
  const closeViewer = () => {
    if (root.hidden) return;
    root.hidden = true; stage.replaceChildren(); image = null; baseWidth = 0; baseHeight = 0;
    document.body.style.overflow = previousBodyOverflow;
  };
  const open = sourceImage => {
    image = sourceImage.cloneNode(true); image.removeAttribute('id'); image.className = 'cep-search-image-viewer-image';
    image.removeAttribute('loading'); stage.replaceChildren(image); scale = 1;
    previousBodyOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; root.hidden = false;
    const prepare = () => requestAnimationFrame(() => {
      const sourceRect = sourceImage.getBoundingClientRect(); const naturalWidth = image.naturalWidth || sourceRect.width || 1;
      const naturalHeight = image.naturalHeight || sourceRect.height || 1;
      const fit = Math.min(1, Math.max(.01, (viewport.clientWidth - 12) / naturalWidth), Math.max(.01, (viewport.clientHeight - 12) / naturalHeight));
      baseWidth = Math.max(1, Math.round(naturalWidth * fit)); baseHeight = Math.max(1, Math.round(naturalHeight * fit));
      image.style.width = `${baseWidth}px`; image.style.height = `${baseHeight}px`; sizeStage();
      viewport.scrollTo({ left: 0, top: 0 }); close.focus();
    });
    if (image.complete) prepare(); else image.addEventListener('load', prepare, { once: true });
  };
  minus.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(scale - .25); });
  plus.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(scale + .25); });
  reset.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setScale(1); });
  close.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); closeViewer(); });
  root.addEventListener('click', event => { if (!event.target.closest('.cep-search-image-viewer-image,.cep-search-image-viewer-controls')) closeViewer(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !root.hidden) closeViewer(); });
  imageZoomUi = { root, open, close: closeViewer };
  return imageZoomUi;
}

export function enableSearchImageZoom(image) {
  if (!image || image.dataset.cepSearchImageZoom === 'true') return;
  image.dataset.cepSearchImageZoom = 'true'; image.tabIndex = 0; image.setAttribute('role', 'button');
  image.setAttribute('aria-label', image.alt ? `Open enlarged image: ${image.alt}` : 'Open enlarged image');
  const open = event => { event.preventDefault(); event.stopPropagation(); getSearchImageZoomUi().open(image); };
  image.addEventListener('click', open);
  image.addEventListener('dblclick', event => { event.preventDefault(); event.stopPropagation(); });
  image.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') open(event); });
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
  let scale = 1; let table; let baseTableWidth = 0; let baseTableHeight = 0; let previousBodyOverflow = '';
  const sizeStage = () => {
    if (!table) return;
    const width = baseTableWidth || table.scrollWidth || table.getBoundingClientRect().width;
    const height = baseTableHeight || table.scrollHeight || table.getBoundingClientRect().height;
    const scaledWidth = Math.ceil(width * scale); const scaledHeight = Math.ceil(height * scale);
    const stageWidth = Math.max(scaledWidth, viewport.clientWidth - 20);
    const stageHeight = Math.max(scaledHeight, viewport.clientHeight - 20);
    stage.style.width = `${stageWidth}px`; stage.style.height = `${stageHeight}px`;
    table.style.left = `${Math.max(0, Math.floor((stageWidth - scaledWidth) / 2))}px`;
    table.style.top = `${Math.max(0, Math.floor((stageHeight - scaledHeight) / 2))}px`;
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
    const sourceRect = sourceTable.getBoundingClientRect(); const sourceStyle = getComputedStyle(sourceTable);
    table = sourceTable.cloneNode(true); table.querySelectorAll('[id]').forEach(element => element.removeAttribute('id')); table.removeAttribute('id');
    table.style.setProperty('width', `${sourceRect.width}px`, 'important');
    table.style.setProperty('min-width', `${sourceRect.width}px`, 'important');
    table.style.setProperty('max-width', `${sourceRect.width}px`, 'important');
    table.style.setProperty('font-family', sourceStyle.fontFamily, 'important');
    table.style.setProperty('font-size', sourceStyle.fontSize, 'important');
    table.style.setProperty('line-height', sourceStyle.lineHeight, 'important');
    const sourceCells = [...sourceTable.querySelectorAll('th,td')]; const clonedCells = [...table.querySelectorAll('th,td')];
    clonedCells.forEach((cell, index) => {
      const sourceCell = sourceCells[index]; if (!sourceCell) return;
      const cellRect = sourceCell.getBoundingClientRect(); const cellStyle = getComputedStyle(sourceCell);
      cell.style.setProperty('width', `${cellRect.width}px`, 'important');
      cell.style.setProperty('min-width', `${cellRect.width}px`, 'important');
      cell.style.setProperty('max-width', `${cellRect.width}px`, 'important');
      cell.style.setProperty('white-space', cellStyle.whiteSpace, 'important');
      cell.style.setProperty('padding', cellStyle.padding, 'important');
      cell.style.setProperty('text-align', cellStyle.textAlign, 'important');
      cell.style.setProperty('vertical-align', cellStyle.verticalAlign, 'important');
    });
    table.classList.add('cep-search-table-zoom-content'); stage.replaceChildren(table); scale = 1;
    previousBodyOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; root.hidden = false;
    requestAnimationFrame(() => {
      baseTableWidth = sourceRect.width; baseTableHeight = table.scrollHeight || sourceRect.height;
      sizeStage(); viewport.scrollTo({ left: 0, top: 0 }); close.focus();
    });
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
async function writeSearchClipboard(copyText, copyHtml) {
  const plainText = String(copyText || '').trim();
  const safeHtml = copyHtml && window.CEPSecurity?.sanitizeHTML
    ? window.CEPSecurity.sanitizeHTML(String(copyHtml))
    : '';
  if (safeHtml && navigator.clipboard?.write && typeof ClipboardItem === 'function') {
    const item = new ClipboardItem({
      'text/plain': new Blob([plainText], { type:'text/plain' }),
      'text/html': new Blob([safeHtml], { type:'text/html' })
    });
    try {
      await navigator.clipboard.write([item]);
      return;
    } catch (error) {
      if (!navigator.clipboard?.writeText) throw error;
    }
  }
  await navigator.clipboard.writeText(plainText);
}
export function installSearchCardInteractions(card, { copyText, copyHtml, navigate, onNavigate } = {}) {
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
        await writeSearchClipboard(copyText, copyHtml);
        card.classList.remove('is-copied'); void card.offsetWidth; card.classList.add('is-copied');
        setTimeout(() => card.classList.remove('is-copied'), 720);
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
    const definition = link.dataset.definition || '', why = link.dataset.why || '';
    if ((!link.dataset.image && !definition && !why) || !link.isConnected) return;
    clearTimeout(hideTimer); const parts = [];
    if (link.dataset.image) { const image = document.createElement('img'); image.src = link.dataset.image; image.alt = link.textContent; parts.push(image); }
    if (link.dataset.caption) { const caption = document.createElement('div'); caption.className = 'cep-xgpt-media-caption'; caption.textContent = link.dataset.caption; parts.push(caption); }
    const appendSection = (labelText, bodyText) => {
      if (!bodyText) return;
      const section = document.createElement('div'); section.className = 'cep-xgpt-media-section';
      const label = document.createElement('div'); label.className = 'cep-xgpt-media-label'; label.textContent = labelText;
      const body = document.createElement('div'); body.className = 'cep-xgpt-media-text'; body.textContent = bodyText;
      section.append(label, body); parts.push(section);
    };
    appendSection('DEFINITION', definition); appendSection('WHY IT MATTERS', why);
    tip.replaceChildren(...parts); tip.hidden = false;
    const rect = link.getBoundingClientRect(), tipRect = tip.getBoundingClientRect();
    tip.style.left = `${Math.max(12, Math.min(innerWidth - tipRect.width - 12, rect.left))}px`;
    tip.style.top = `${Math.max(12, Math.min(innerHeight - tipRect.height - 12, rect.bottom + 8))}px`;
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
        heading.textContent = entry.sourceTitle === 'Xgpt Notes' ? 'Xgpt' : entry.sourceTitle; heading.href = entry.file;
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
      const sourceCardRendered = entry.file !== 'chatgptx.html' && renderSourceSearchCard(link, entry, renderTerms);
      const separateImageUrls = structuredRichContent
        ? (entry.imageUrls || [entry.imageUrl]).filter(imageUrl => imageUrl && !String(entry.richHtml || '').includes(imageUrl))
        : (entry.imageUrls || [entry.imageUrl]);
      const resultImages = sourceCardRendered ? [] : createSearchResultImages(separateImageUrls, entry.file);
      if (entry.file === 'chatgptx.html' && entry.richHtml) {
        cardBody.className = 'cep-xgpt-rich-content';
        renderXgptSearchRichContent(cardBody, entry.richHtml, renderTerms);
      } else if (sourceCardRendered) {
        // The shared source-card renderer already appended the original presentation.
      } else if (structuredRichContent) {
        cardBody.className = 'cep-structured-rich-content';
        renderStructuredSearchContent(cardBody, entry.richHtml, renderTerms);
      } else addHighlightedText(cardBody, snippetText, renderTerms);
      if (!sourceCardRendered) appendSearchResultContent(link, entry.file === 'chatgptx.html' ? null : title, cardBody, resultImages, entry.file);
      installSearchCardInteractions(link, {
        copyText: entry.displayText || entry.text || entry.title,
        copyHtml: getSearchCopyHtml(entry),
        navigate: () => {
          if (entry.directUrl) window.open(link.href, '_blank', 'noopener');
          else location.assign(link.href);
        }
      });
      group.querySelector('.cep-global-search-group-cards').appendChild(link);
    });
  };
  let mountedRefreshPromise = Promise.resolve();
  const refreshMountedEntries = async dataset => {
    if (!host.isConnected) return;
    try {
      if (!dataset || dataset.startsWith('main:')) {
        const xgptEntries = entries.filter(entry => entry.file === 'chatgptx.html');
        const mainEntries = await loadEntries(source => { status.textContent = `Refreshing ${source}…`; });
        if (!host.isConnected) return;
        entries = mainEntries.concat(xgptEntries);
      }
      if (!dataset || dataset.startsWith('xgpt:')) {
        const mainEntries = entries.filter(entry => entry.file !== 'chatgptx.html');
        const freshXgptEntries = await loadXgptEntries();
        if (!host.isConnected) return;
        entries = mainEntries.concat(freshXgptEntries);
        xgptPrompt.hidden = true;
      }
      renderFilters();
      runSearch();
    } catch (error) {
      if (error?.code === 'xgpt/auth-required') xgptPrompt.hidden = false;
      else console.warn('Search could not refresh its updated notes.', error);
    }
  };
  const queueMountedRefresh = event => {
    const dataset = invalidatedDatasetFromEvent(event);
    mountedRefreshPromise = mountedRefreshPromise.then(() => refreshMountedEntries(dataset));
  };
  const onSearchCacheInvalidated = event => { queueMountedRefresh(event); };
  const onSearchStorageInvalidated = event => {
    if (event.key === persistentSearchInvalidationKey || event.key?.startsWith(persistentSearchDatasetInvalidationPrefix)) {
      queueMountedRefresh(event);
    }
  };
  window.addEventListener('cep-search-cache-invalidated', onSearchCacheInvalidated);
  window.addEventListener('storage', onSearchStorageInvalidated);
  const mountedSearchObserver = new MutationObserver(() => {
    if (host.isConnected) return;
    window.removeEventListener('cep-search-cache-invalidated', onSearchCacheInvalidated);
    window.removeEventListener('storage', onSearchStorageInvalidated);
    mountedSearchObserver.disconnect();
  });
  mountedSearchObserver.observe(document.body, { childList: true, subtree: true });
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
