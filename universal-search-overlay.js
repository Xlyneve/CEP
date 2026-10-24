import { enableSearchImageZoom, enableSearchTableZoom } from './note-media-viewer.js?v=1';
export { enableSearchImageZoom, enableSearchTableZoom, openNoteTableZoom, openNoteImageZoom } from './note-media-viewer.js?v=1';
import "./information-link-markers.js?v=20261018-1";
import { applySourceSearchSkin } from "./search-source-cards.js?v=20261018-8";
import "./concept-markup.js?v=20261004-1";
import "./shared-definitions.js?v=20261007-3";
import "./pn-shared-definitions.js?v=20261007-3";
import "./concept-preview.js?v=20261004-2";
// One shared disclosure for Home and the lightbulb search; no search/data changes.
function installSearchHelp(modes) {
  if (!modes || modes.parentElement.querySelector('.cep-search-help-button')) return;
  if (!document.getElementById('cep-search-help-style')) {
    const style = document.createElement('style');
    style.id = 'cep-search-help-style';
    style.textContent = `
      html:root:root:root:root body .cep-search-help-button {
        display:inline-flex!important;align-items:center!important;justify-content:center!important;
        width:22px!important;height:22px!important;min-width:22px!important;min-height:22px!important;
        padding:0!important;margin:0!important;border-radius:50%!important;
        position:absolute!important;left:10px!important;top:50%!important;transform:translateY(-50%)!important;z-index:2;
        font:600 12px/1 sans-serif!important;color:inherit!important;flex:none!important;
      }
      html:root:root:root:root body .cep-search-has-help input{padding-left:42px!important}
      html:root:root:root:root body .cep-search-help-guide {
        margin:6px 0 10px!important;padding:10px 12px!important;border-radius:12px!important;
        background:var(--card-solid,#f7f6f2)!important;color:var(--theme-ink,#303039)!important;
        border:1px solid currentColor;font:12px/1.5 sans-serif!important;
      }
      html:root:root:root:root body .cep-search-help-guide[hidden]{display:none!important}
      .cep-search-help-guide p{margin:0 0 5px}.cep-search-help-guide p:last-child{margin-bottom:0}
    `;
    document.head.append(style);
  }
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'cep-search-help-button';
  button.textContent = '?'; button.title = 'How to search';
  button.setAttribute('aria-label','How to search'); button.setAttribute('aria-expanded','false');
  const guide = document.createElement('div');
  guide.className = 'cep-search-help-guide'; guide.hidden = true;
  guide.id = 'cep-search-help-' + (modes.classList.contains('universal-search-modes') ? 'home' : 'overlay');
  button.setAttribute('aria-controls',guide.id);
  guide.innerHTML = '<p><strong>Add commas to find cards matching any option.</strong><br>tuelle, bactigras, soft bandage<br>Shows cards containing tuelle OR bactigras OR both words soft and bandage.</p><p><strong>Without commas, each card must contain all your words.</strong><br>tuelle bactigras soft bandage<br>Shows only cards containing all four words, anywhere in the card.</p><p>No comma is needed between words belonging to one option, such as <strong>soft bandage</strong>.</p>';
  const inputWrap = modes.parentElement.querySelector('.cep-search-input-wrap');
  if (!inputWrap) return;
  inputWrap.classList.add('cep-search-has-help');
  inputWrap.append(button);
  modes.after(guide);
  button.addEventListener('click',event=>{
    event.preventDefault(); event.stopPropagation();
    guide.hidden = !guide.hidden; button.setAttribute('aria-expanded',String(!guide.hidden));
  });
  modes.parentElement.addEventListener('keydown',event=>{
    if(event.key === 'Escape' && !guide.hidden){
      event.preventDefault(); event.stopPropagation(); guide.hidden=true;
      button.setAttribute('aria-expanded','false'); button.focus();
    }
  });
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',()=>installSearchHelp(document.querySelector('.universal-search-modes')),{once:true});
else installSearchHelp(document.querySelector('.universal-search-modes'));
// Compact Default cards keep short notes readable; only crowded notes shrink.
const defaultCardStyle = document.createElement('style');
defaultCardStyle.id = 'cep-default-search-card-size';
defaultCardStyle.textContent = `
  html:root:root:root body .cep-search-table-zoom {z-index:2147483644 !important;}
  html:root:root:root body:has(.cep-search-table-zoom:not([hidden])) :is(.cep-xgpt-media-tip,.xgpt-media-tip,#cep-shared-tip,#pn-definition-tip) {z-index:2147483646 !important;}

  html:root:root:root:root:root:root:root body .cep-search-table-scroll {min-width:0 !important;max-width:100% !important;overflow-x:auto !important;}
  html:root:root:root:root:root:root:root body .cep-search-table-scroll :is(td,th),
  html:root:root:root:root:root:root:root body .cep-search-table-scroll :is(td,th) * {white-space:normal !important;overflow-wrap:anywhere !important;word-break:normal !important;max-width:100% !important;box-sizing:border-box !important;}

  html:root:root:root:root:root:root:root body .cep-search-source[data-source-file="clinicalnotes.html"]:not(.cep-clinical-search-pin) .cep-source-content {font-size:11.5px !important;}
  html:root:root:root:root:root:root:root body .cep-search-source[data-source-file="clinicalnotes.html"]:not(.cep-clinical-search-pin) .cep-source-title {font-size:12.5px !important;}
  html:root:root:root:root:root:root:root body :is(.universal-search-results,.cep-global-search-results) .cep-concept-search-result {font-size:10.5px !important;}

  html:root:root:root:root:root:root:root body :is(.universal-search-results,.cep-global-search-results) .cep-search-source:not(.cep-clinical-search-pin) > :is(.cep-source-surface,.cep-source-chat,.cep-source-form) { padding:8px 10px !important; }
  html:root:root:root:root:root:root:root body :is(.universal-search-results,.cep-global-search-results) .cep-concept-search-result { padding:10px 12px !important; gap:7px !important; }

  html:root:root:root:root:root:root:root body .cep-default-search-results .cep-search-source > :is(.cep-source-surface,.cep-source-chat,.cep-source-form) { padding:8px 10px !important; }
  html:root:root body .cep-default-search-results :is(.universal-search-native-card,.cep-global-search-result):not(.cep-search-source) { padding:8px 10px; min-height:64px; }
  html:root:root:root:root:root:root:root body .cep-default-search-results :is(.cep-xgpt-rich-content,.xgpt-rich-snippet) { zoom:1 !important; }
`;
document.head.append(defaultCardStyle);
const defaultCardFits = new WeakMap();
const defaultCardWidths = new WeakMap();
const pendingDefaultFits = new Set();
let defaultFitFrame = 0;
function scheduleDefaultCardFit(card) {
  pendingDefaultFits.add(card);
  if (defaultFitFrame) return;
  defaultFitFrame = requestAnimationFrame(() => {
    defaultFitFrame = 0;
    for (const pending of pendingDefaultFits) fitDefaultSearchCard(pending);
    pendingDefaultFits.clear();
  });
}
const defaultCardResize = typeof ResizeObserver === 'function' ? new ResizeObserver(entries => {
  for (const {target:card,contentRect} of entries) {
    if (!card.isConnected) { defaultCardResize.unobserve(card); continue; }
    if (contentRect.width <= 0 || Math.abs((defaultCardWidths.get(card) || 0)-contentRect.width)<1) continue;
    defaultCardWidths.set(card,contentRect.width); scheduleDefaultCardFit(card);
  }
}) : null;
function fitDefaultSearchCard(card) {
  if (!card.isConnected || !card.closest('.cep-default-search-results') || !card.getBoundingClientRect().width) return;
  let fit = defaultCardFits.get(card);
  if (!fit) {
    const wrappers = [...card.querySelectorAll('.cep-source-title,.cep-source-content,.cep-source-text,.cep-source-display,.cep-source-view,.universal-search-native-title,.universal-search-native-snippet')];
    const nodes = new Set(wrappers);
    // Tables retain their source typography instead of inheriting the larger note text.
    for (const node of card.querySelectorAll('table,table *')) nodes.add(node);
    for (const wrapper of wrappers) for (const node of wrapper.querySelectorAll('*')) {
      if ([...node.childNodes].some(child=>child.nodeType===Node.TEXT_NODE && child.textContent.trim()) && !node.closest('button,input,textarea,select,svg,.cep-media-link')) nodes.add(node);
    }
    fit = [...nodes].map(node=>{
      const original = parseFloat(getComputedStyle(node).fontSize)||14;
      return {node,size:.90*(node.closest('table') ? original : Math.max(original,node.matches('.cep-source-title,.universal-search-native-title')?15:14))};
    });
    defaultCardFits.set(card,fit);
    card.addEventListener('load',()=>scheduleDefaultCardFit(card),true);
    defaultCardResize?.observe(card);
  }
  // Measure at the readable size, then shrink only if the compact area needs it.
  for (const {node,size} of fit) node.style.setProperty('font-size',size+'px','important');
  const surface = card.querySelector(':scope > .cep-source-surface,:scope > .cep-source-chat,:scope > .cep-source-form') || card;
  const height = surface.getBoundingClientRect().height;
  const scale = Math.max(.86,Math.min(1,240/Math.max(height,1)));
  for (const {node,size} of fit) node.style.setProperty('font-size',(size*scale).toFixed(2)+'px','important');
  card.dataset.defaultFontFit = scale < 1 ? 'compact' : 'readable';
  // Height remains automatic so even very long notes retain their full content.
}
const conceptStyle = document.createElement('link');
conceptStyle.rel = 'stylesheet';
conceptStyle.href = new URL('./concept-links.css?v=20261004-2', import.meta.url).href;
document.head.appendChild(conceptStyle);
import "./concept-photo-gallery.js?v=20261003-1";
import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { collection, getDocs, getDocsFromServer, getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
  if (parts[0] === 'clinical') return 'clinical:clinicalNotes';
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
const loadPersistentSearchValue = async (key, loader, forceRefresh = false, waitForCacheWrite = true) => {
  if (!forceRefresh) {
    const cached = await readPersistentSearchCache(key);
    if (cached !== undefined) return cached;
  }
  const value = await loader();
  const saved=writePersistentSearchCache(key,value);
  if(waitForCacheWrite)await saved;else void saved.catch(()=>{});
  return value;
};
export function loadPersistentSearchDocuments(db, collectionName, scope, { forceRefresh = false, waitForCacheWrite = true } = {}) {
  return loadPersistentSearchValue(`${scope}:${collectionName}:documents:v1`, async () => {
    const snapshot = await (forceRefresh ? getDocsFromServer : getDocs)(collection(db, collectionName));
    return snapshot.docs.map(item => ({ id: item.id, data: item.data() }));
  }, forceRefresh, waitForCacheWrite);
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

let clinicalEntriesPromise;
export async function loadClinicalNotesEntries({ forceRefresh = false } = {}) {
  if (forceRefresh) clinicalEntriesPromise = null;
  if (!clinicalEntriesPromise) clinicalEntriesPromise = (async () => {
    const config = { apiKey:'AIzaSyDcM4E3wFhjUwZBYbnZoi1AAQtMe7TzNL8', authDomain:'notes-bcba6.firebaseapp.com', projectId:'notes-bcba6', storageBucket:'notes-bcba6.appspot.com', messagingSenderId:'101524739050', appId:'1:101524739050:web:7e5fe1c8fa224d69909893' };
    const app = getApps().find(app => app.name === 'clinical-notes') || initializeApp(config, 'clinical-notes');
    const auth = getAuth(app);
    await auth.authStateReady();
    if (!auth.currentUser) throw Object.assign(new Error('Open Clinical Notes and sign in, then return to search.'), { code:'clinical/auth-required' });
    const docs = await loadPersistentSearchDocuments(getFirestore(app), 'clinicalNotes', `clinical:${auth.currentUser.uid}`, { forceRefresh, waitForCacheWrite:false });
    const sourceOrder = new Map([...docs].sort((a,b)=>new Date(b.data.time)-new Date(a.data.time)).map((record,index)=>[record.id,index]));
    return docs.map(record => {
      const titleText=textFromHtml(record.data.title);
      const displayText=textFromHtml(record.data.note);
      return { id:record.id, focusId:record.id, nativeOnly:true, sourceIndex:sourceOrder.get(record.id),
        file:'Clinicalnotes.html', sourceTitle:'Clinical Notes', title:titleText || 'Untitled',
        text:[titleText,displayText].join('\n'), displayText, richHtml:record.data.note || '', record };
    });
  })().catch(error => { clinicalEntriesPromise = null; throw error; });
  return clinicalEntriesPromise;
}

let entriesPromise;
let xgptEntriesPromise;
let xgptConceptMedia = {};
let xgptConceptMediaLoaded = false;
let xgptConceptDefinitions = {};
let xgptConceptCounts = new Map();
let xgptConceptLabels = new Map();
const clearInMemorySearchCache = () => {
  clinicalEntriesPromise = null;
  entriesPromise = null;
  xgptEntriesPromise = null;
  xgptConceptMedia = {};
  xgptConceptMediaLoaded = false;
  xgptConceptDefinitions = {};
  xgptConceptCounts = new Map();
  xgptConceptLabels = new Map();
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
export async function loadXgptEntries({ forceRefresh = false } = {}) {
  if (forceRefresh) xgptEntriesPromise = null;
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
        const snapshot = await (forceRefresh ? getDocsFromServer : getDocs)(collection(db, 'notes'));
        return snapshot.docs.map(note => {
          const rawHtml = note.data().content || note.data().note || note.data().text || '';
          const text = textFromHtml(rawHtml).replace(/\[\[([^\]]+)\]\]/g, '$1');
          const firstLine = text.split(/[.!?]\s|\n/)[0].trim();
          return {
            id: note.id, file: 'chatgptx.html', sourceTitle: 'Xgpt Notes',
            title: firstLine ? `Xgpt — ${firstLine.slice(0,72)}` : 'Xgpt Note', text, richHtml: rawHtml
          };
        });
      }, forceRefresh),
      // Version the media cache: older records kept only imageUrl and lost the gallery.
      loadPersistentSearchValue(`${cacheScope}:media:v2`, async () => {
        const mediaSnapshot = await (forceRefresh ? getDocsFromServer : getDocs)(collection(db, 'concept_media'));
        return Object.fromEntries(mediaSnapshot.docs.map(item => {
          const media = item.data() || {};
          return [normalizeConcept(media.concept || item.id), { imageUrl: media.imageUrl || '', images: getXgptConceptImages(media), caption: media.caption || '' }];
        }));
      }, forceRefresh).catch(error => {
        console.warn('Xgpt concept images are unavailable in header search.', error);
        return {};
      }),
      loadPersistentSearchValue(`${cacheScope}:definitions`, async () => {
        const definitionsSnapshot = await (forceRefresh ? getDocsFromServer : getDocs)(collection(db, 'concept_defs'));
        return Object.fromEntries(definitionsSnapshot.docs.map(item => {
          const definition = item.data() || {};
          return [normalizeConcept(definition.concept || item.id), {
            definition: definition.value || '', why: definition.why || '', videoUrl:definition.videoUrl || ''
          }];
        }));
      }, forceRefresh).catch(error => {
        console.warn('Xgpt concept definitions are unavailable in search.', error);
        return {};
      })
    ]);
    xgptConceptMedia = media;
    xgptConceptMediaLoaded = true;
    xgptConceptDefinitions = definitions;
    xgptConceptCounts = new Map();
    xgptConceptLabels = new Map();
    entries.forEach(entry => {
      const concepts = new Set([...String(entry.richHtml || '').matchAll(/\[\[([^\]\[]+?)\]\]/g)]
        .map(match => {
          const label = textFromHtml(match[1]);
          const key = normalizeConcept(label);
          if (key && !xgptConceptLabels.has(key)) xgptConceptLabels.set(key, label);
          return key;
        }).filter(Boolean));
      concepts.forEach(concept => xgptConceptCounts.set(concept, (xgptConceptCounts.get(concept) || 0) + 1));
    });
    return entries;
  } catch (error) {
    xgptEntriesPromise = null;
    if (forceRefresh || error?.code === 'xgpt/auth-required') throw error;
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

export function getXgptConceptImages(media) {
  const images = Array.isArray(media?.images) ? media.images.filter(image =>
    typeof image?.imageUrl === 'string' && image.imageUrl) : [];
  return images.length ? images : media?.imageUrl ? [{ imageUrl: media.imageUrl }] : [];
}

// Shared by home search, universal search and their concept tooltips.
export function createXgptPhotoStrip(media, { height = 220, className = '', alt = 'Concept photo', zoom = false } = {}) {
  const images = getXgptConceptImages(media);
  if (!images.length) return null;
  const strip = document.createElement('div');
  strip.className = 'cep-concept-photo-strip';
  strip.tabIndex = 0;
  strip.setAttribute('role', 'region');
  strip.setAttribute('aria-label', 'Concept photos — scroll horizontally');
  strip.style.cssText = 'display:flex;gap:8px;min-width:0;max-width:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;';
  images.forEach(({ imageUrl }, index) => {
    const image = document.createElement('img');
    image.className = className;
    image.src = imageUrl;
    image.alt = `${alt} ${index + 1}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.style.cssText = `flex:0 0 100%;min-width:0;max-width:100%;width:100%;height:${height}px;max-height:${height}px;object-fit:contain;scroll-snap-align:start;`;
    if (zoom) enableSearchImageZoom(image);
    strip.appendChild(image);
  });
  return window.CEPPhotoGallery.decorate(strip);
}

export function getCachedXgptConceptMedia(concept) {
  return xgptConceptMedia[normalizeConcept(concept)] || null;
}

export function getCachedXgptConceptDefinition(concept) {
  return xgptConceptDefinitions[normalizeConcept(concept)] || null;
}

const conceptSearchTokens = value => normalizeSearchValue(value).match(/[\p{L}\p{N}]+/gu) || [];
const containsConceptPhrase = (text, phrase) => Boolean(phrase) && ` ${text} `.includes(` ${phrase} `);
const scoreReferencedConceptGroup = (concept, group) => {
  let score = 0;
  if (concept.labelTokenText === group.query) score += 500;
  else if (containsConceptPhrase(concept.labelTokenText, group.query)) score += 260;
  if (containsConceptPhrase(concept.searchTokenText, group.query)) score += 130;
  for (const term of group.terms) {
    if (concept.labelWords.includes(term)) score += 90;
    else if (concept.words.includes(term)) score += 28;
    else {
      const tolerance = term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0;
      const similar = tolerance && concept.words.some(word =>
        Math.abs(word.length - term.length) <= tolerance && editDistance(term, word) <= tolerance
      );
      if (!similar) return null;
      score += 8;
    }
  }
  return score;
};

export async function searchReferencedXgptConcepts(rawQuery) {
  await loadXgptEntries();
  const query = normalizeSearchValue(rawQuery);
  const commaGroups = query.includes(',')
    ? [...new Set(query.split(',').map(group => group.trim()).filter(Boolean))]
        .map(group => {
          const terms = [...new Set(conceptSearchTokens(group))];
          return { query: terms.join(' '), terms };
        }).filter(group => group.terms.length)
    : null;
  const terms = commaGroups
    ? [...new Set(commaGroups.flatMap(group => group.terms))]
    : [...new Set(conceptSearchTokens(query))];
  if (!query || !terms.length) return { results: [], terms };
  const concepts = [...xgptConceptCounts.entries()].map(([key, count]) => {
    const label = xgptConceptLabels.get(key) || key;
    const details = xgptConceptDefinitions[key] || {};
    const media = xgptConceptMedia[key] || {};
    const searchText = normalizeSearchValue([
      label, details.definition, details.why, media.caption
    ].filter(Boolean).join(' '));
    const labelTokens = conceptSearchTokens(label);
    const searchTokens = conceptSearchTokens(searchText);
    const labelWords = [...new Set(labelTokens)];
    const words = [...new Set(searchTokens)];
    return {
      key, label, count, definition: details.definition || '', why: details.why || '', videoUrl:details.videoUrl || '',
      imageUrl: media.imageUrl || '', images: getXgptConceptImages(media), caption: media.caption || '', searchText,
      labelWords, words, labelTokenText: labelTokens.join(' '), searchTokenText: searchTokens.join(' ')
    };
  });
  const results = concepts.map(concept => {
    if (commaGroups) {
      const matchedScores = commaGroups.map(group => scoreReferencedConceptGroup(concept, group)).filter(score => score !== null);
      if (!matchedScores.length) return null;
      return { concept, matchedGroupCount: matchedScores.length, score: matchedScores.reduce((sum, score) => sum + score, 0) };
    }
    const score = scoreReferencedConceptGroup(concept, { query: terms.join(' '), terms });
    return score === null ? null : { concept, matchedGroupCount: 1, score };
  }).filter(Boolean).sort((a, b) =>
    b.matchedGroupCount - a.matchedGroupCount || b.score - a.score || b.concept.count - a.concept.count ||
    a.concept.label.localeCompare(b.concept.label)
  ).slice(0, 30).map(match => match.concept);
  return { results, terms };
}

export function renderReferencedXgptConceptResults(container, concepts, terms = []) {
  const cards = concepts.map(concept => {
    const card = document.createElement('article');
    card.className = 'cep-concept-search-result';
    const heading = document.createElement('div'); heading.className = 'cep-concept-search-heading';
    const pill = document.createElement('span'); pill.className = 'cep-concept-search-pill';
    addHighlightedText(pill, concept.label, terms);
    const count = document.createElement('span'); count.className = 'cep-concept-search-count';
    count.textContent = String(concept.count); count.title = `${concept.count} Xgpt note${concept.count === 1 ? '' : 's'}`;
    heading.append(pill, count); card.appendChild(heading);
    const appendSection = (labelText, value) => {
      if (!value) return;
      const section = document.createElement('section'); section.className = 'cep-concept-search-section';
      const label = document.createElement('strong'); label.textContent = labelText;
      const body = document.createElement('div'); addHighlightedText(body, value, terms);
      section.append(label, body); card.appendChild(section);
    };
    appendSection('Definition', concept.definition);
    appendSection('Why it matters', concept.why);
    const photos = createXgptPhotoStrip(concept, { height: 240, className: 'cep-concept-search-image', alt: concept.caption || concept.label, zoom: true });
    if (photos) card.appendChild(photos);
    appendSection('Image note', concept.caption);
    window.CEPSharedDefinitions.appendVideo(card,concept.videoUrl);
    return card;
  });
  container.replaceChildren(...cards);
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
        return documents.map((note, sourceIndex) => {
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
            id: note.id, file, sourceIndex, sourceTitle, title: title === sourceTitle ? title : `${sourceTitle} — ${title}`,
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
      const mark = document.createElement('mark'); mark.className = 'cep-search-match'; mark.textContent = part; parent.appendChild(mark);
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

const legacySearchTableColours = new Set([
  '#ccd1d1', '#e2d5d9', 'rgb(204,209,209)', 'rgb(226,213,217)'
]);
const compactCssColour = value => String(value || '').toLocaleLowerCase().replace(/\s+/g, '');
const replaceLegacySearchTableColour = (element, nextColour) => {
  const background = element.style.getPropertyValue('background');
  const backgroundColour = element.style.getPropertyValue('background-color');
  if (![background, backgroundColour].some(value => legacySearchTableColours.has(compactCssColour(value)))) return;
  const priority = element.style.getPropertyPriority('background')
    || element.style.getPropertyPriority('background-color') || 'important';
  element.style.removeProperty('background-color');
  element.style.setProperty('background', nextColour, priority);
};
function replaceLegacySearchTableTheme(table) {
  replaceLegacySearchTableColour(table, '#ecebeb');
  table.querySelectorAll('th,td').forEach(cell => {
    const row = cell.closest('tr');
    const section = row?.parentElement;
    const rows = section ? [...section.children].filter(child => child.tagName === 'TR') : [];
    const rowIndex = Math.max(0, rows.indexOf(row));
    const isHeader = cell.tagName === 'TH' || section?.tagName === 'THEAD';
    const nextColour = isHeader ? '#d5d0d3' : rowIndex % 2 ? '#f2edf4' : '#ecebeb';
    replaceLegacySearchTableColour(cell, nextColour);
  });
}

function prepareScrollableSearchTable(table) {
  if (!table || table.parentElement?.classList.contains('cep-search-table-scroll')) return;
  replaceLegacySearchTableTheme(table);
  table.style.setProperty('width', 'max-content', 'important');
  table.style.setProperty('min-width', '100%', 'important');
  table.style.setProperty('max-width', 'none', 'important');
  table.style.setProperty('table-layout', 'auto', 'important');
  table.querySelectorAll('th,td').forEach(cell => {
    cell.style.setProperty('white-space', 'normal', 'important');
    cell.style.setProperty('overflow-wrap', 'anywhere', 'important');
    cell.style.setProperty('word-break', 'normal', 'important');
  });
  const scroll = document.createElement('div');
  scroll.className = 'cep-search-table-scroll';
  table.before(scroll); scroll.appendChild(table);
}

function searchConceptName(link) {
  return (link.dataset.concept || link.querySelector('.conceptLabel,.cep-xgpt-concept-label')?.textContent || link.textContent || '').trim();
}
function hydrateSearchConceptLink(link) {
  const concept = searchConceptName(link);
  link.dataset.concept = concept;
  if (!link.hasAttribute('href')) link.href = '#';
  link.classList.add('cep-xgpt-concept', 'xgpt-concept-link');
  const media = getCachedXgptConceptMedia(concept);
  const details = getCachedXgptConceptDefinition(concept);
  if (media?.imageUrl) { link.classList.add('has-image'); link.dataset.image = media.imageUrl; link.dataset.caption = media.caption || ''; }
  if (details?.definition) link.dataset.definition = details.definition;
  else if (link.dataset.def) link.dataset.definition = link.dataset.def;
  if (details?.why) link.dataset.why = details.why;
}
export function renderXgptSearchRichContent(parent, html, terms = []) {
  installXgptMediaUi();
  const content = document.createElement('div');
  if (window.CEPSecurity?.setHTML) window.CEPSecurity.setHTML(content, html);
  else content.textContent = textFromHtml(html);
  content.querySelectorAll('[style]').forEach(element => {
    const savedColor = element.style.color;
    if (savedColor && document.documentElement.dataset.xlyneveColorTheme !== 'midnight-glass') element.style.setProperty('-webkit-text-fill-color', savedColor, 'important');
  });
  CEPConceptMarkup.linkify(content, (concept, contentFragment) => {
      const link = document.createElement('a');
      link.href = '#'; link.className = 'cep-xgpt-concept xgpt-concept-link';
      const label = document.createElement('span'); label.className = 'cep-xgpt-concept-label'; label.appendChild(contentFragment);
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
      return link;
  });
  content.querySelectorAll('a.conceptLink,a.cep-xgpt-concept,a.xgpt-concept-link').forEach(hydrateSearchConceptLink);
  const richTextNodes = []; const highlightWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  while (highlightWalker.nextNode()) richTextNodes.push(highlightWalker.currentNode);
  richTextNodes.forEach(node => {
    if (node.parentElement?.closest('.cep-xgpt-concept')) return;
    if (!node.nodeValue || !terms.some(term => node.nodeValue.toLocaleLowerCase().includes(term))) return;
    const fragment = document.createDocumentFragment(); addHighlightedText(fragment, node.nodeValue, terms); node.replaceWith(fragment);
  });
  const tables = [...content.querySelectorAll('table')]; const images = [...content.querySelectorAll('img')];
  tables.forEach(prepareScrollableSearchTable);
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
  tables.forEach(prepareScrollableSearchTable);
  parent.append(...content.childNodes);
  tables.forEach(enableSearchTableZoom);
  images.forEach(enableSearchImageZoom);
}

const sourceCardTypes = {
  'clinicalnotes.html':'clinical', 'pn.html':'pn', 'notes.html':'notes', 'ecg.html':'ecg', 'urgent_care.html':'urgent',
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
  const isVideo = Boolean(getYouTubeVideoId(safeUrl) || getFacebookVideoUrl(safeUrl));
  link.textContent = isVideo ? '🎬 Play video' : '🔗 Open link';
  {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('fill', 'none'); icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.8'); icon.setAttribute('stroke-linejoin', 'round');
    for (const [tag, attrs] of (isVideo ? [['rect', {x:'2',y:'6',width:'14',height:'12',rx:'3'}], ['path', {d:'M16 10 22 6v12l-6-4Z'}], ['path', {d:'m7 9 4 3-4 3Z',fill:'currentColor',stroke:'none'}]] : [['path', {d:'M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'}], ['path', {d:'M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'}]])) {
      const shape = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([key, value]) => shape.setAttribute(key, value)); icon.append(shape);
    }
    link.replaceChildren(icon);
    link.classList.add('cep-media-link');
    link.title = isVideo ? 'Play video' : 'Open link';
    link.style.setProperty('font-size', '14px', 'important');
    link.style.setProperty('font-weight', '700', 'important');
  }
  link.setAttribute('aria-label', isVideo ? 'Play video' : 'Open link');
  link.title = isVideo ? 'Play video' : 'Open link';
  wrap.appendChild(link); parent.appendChild(wrap);
};

export function renderSourceSearchCard(parent, entry, terms = []) {
  const data = entry?.record?.data;
  const type = sourceCardTypes[String(entry?.file || '').toLocaleLowerCase()];
  if (!data || !type) return false;
  parent.classList.add('cep-source-card', `cep-source-card--${type}`);
  parent.dataset.sourceCardType = type;
  if (entry.cardColour) parent.style.background = entry.cardColour;

  if (type === 'clinical') {
    const title = document.createElement('div'); title.className = 'cep-source-note-title';
    addHighlightedText(title, data.title || 'Untitled', terms); parent.appendChild(title);
    appendSourceRichContent(parent, data.note || '', terms, 'cep-source-note-content');
    parent.style.borderRadius = '24px'; parent.style.padding = '14px';
    parent.style.background = 'linear-gradient(145deg,rgba(255,255,255,.32),rgba(255,255,255,.11))';
    title.style.fontSize = '13.5px'; title.style.fontWeight = '600';
    const body = parent.querySelector('.cep-source-note-content'); body.style.fontSize = '12.5px'; body.style.whiteSpace = 'pre-wrap';
    return true;
  }
  if (type === 'forms') {
    const view = document.createElement('div'); view.className = 'cep-source-card-view';
    const title = document.createElement('strong'); title.textContent = data.title || 'Untitled';
    const kind = window.CEPInformationLinks.classify(data.url, data);
    parent.dataset.formLinkMode = kind.external ? 'external' : kind.previewConfirmed ? 'preview' : 'auto';
    const badges = document.createElement('template');
    // Marker HTML consists only of fixed SVG/text strings from the shared helper.
    badges.innerHTML = window.CEPInformationLinks.badges(kind);
    title.append(badges.content); view.appendChild(title);
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

// Both searches copy source typography, independent of compact result-card sizing.
export function getSearchCopyHtml(entry) {
  const html = sourceSearchCopyHtml(entry);
  const file = String(entry?.file || '').toLowerCase();
  const sizes = {
    'explain.html':12, 'pn.html':12, 'clinicalnotes.html':12.5,
    'info.html':11, 'practicen.html':12, 'recalls.html':12,
    'abdo.html':12, 'ecg.html':12, 'hand.html':12, 'lf.html':12,
    'sha.html':12, 'spine.html':12, 'urgent_care.html':12, 'face.html':12
  };
  const size = sizes[file];
  if (!html) return html;
  const wrapper = document.createElement('div');
  if(window.CEPSecurity?.setHTML)window.CEPSecurity.setHTML(wrapper,html);
  else wrapper.innerHTML=html;
  // Fixed-size notes copy as document-sized 11pt, independent of compact card pixels.
  const copySize = '11pt';
  if(size)wrapper.style.fontSize=copySize;
  wrapper.querySelectorAll('*').forEach(element => {
    element.style.removeProperty('font-family');
    element.removeAttribute('face');
    if(!size)return;
    if (element.matches('h1,h2,h3,h4,h5,h6') || element.closest('h1,h2,h3,h4,h5,h6')) return;
    element.removeAttribute('size');
    element.style.fontSize = copySize;
  });
  return wrapper.outerHTML;
}

function sourceSearchCopyHtml(entry) {
  const data = entry?.record?.data;
  const type = sourceCardTypes[String(entry?.file || '').toLocaleLowerCase()];
  if (data && type === 'notes') return String(data.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  if (data && type === 'forms') return String(data.note || '');
  if (data && (type === 'pn' || type === 'ecg' || type === 'urgent')) return String(data.note || '');
  if (data && (type === 'practice' || type === 'info' || type === 'explain')) return sourceLegacyHtml(data.text || '');
  return String(entry?.richHtml || '');
}

const interactiveSearchChildSelector = 'table,img,button,input,textarea,select,summary,[contenteditable="true"],.cep-shared-definition,.pn-definition,.cep-xgpt-concept,.xgpt-concept-link,a:not(.cep-global-search-result):not(.universal-search-native-card)';

function getFacebookVideoUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const facebook = ['facebook.com', 'm.facebook.com', 'web.facebook.com'].includes(host);
    const path = url.pathname;
    if (host === 'fb.watch' || (facebook && (/\/(?:videos|reel|reels)\/[^/]+/.test(path) || /^\/share\/(?:v|r)\/[^/]+/.test(path) || ((path === '/watch' || path === '/watch/' || path === '/video.php') && url.searchParams.has('v'))))) return url.href;
  } catch {}
  return '';
}

function getYouTubeVideoId(rawUrl) {
  try {
    const url = new URL(rawUrl, location.href);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
      else {
        const parts = url.pathname.split('/').filter(Boolean);
        if (['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1] || '';
      }
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
  } catch { return ''; }
}

export function matchesSearchMedia(entry, kind = 'all') {
  if (kind === 'all') return true;
  const data = entry.record?.data || {};
  const urls = [data.url, entry.url, entry.directUrl].filter(Boolean);
  const content = document.createElement('div');
  const html = entry.richHtml || data.note || data.text || '';
  if (window.CEPSecurity?.setHTML) window.CEPSecurity.setHTML(content, html);
  else content.textContent = html;
  content.querySelectorAll('a[href]').forEach(link => urls.push(link.getAttribute('href')));
  return urls.some(raw => {
    try {
      const url = new URL(raw);
      if (!['http:', 'https:'].includes(url.protocol)) return false;
      const video = Boolean(getYouTubeVideoId(url.href) || getFacebookVideoUrl(url.href));
      return kind === 'videos' ? video : !video;
    } catch { return false; }
  });
}

let searchYouTubeUi;
function getSearchYouTubeUi() {
  if (searchYouTubeUi?.root?.isConnected) return searchYouTubeUi;
  if (!document.getElementById('cepSearchYouTubeStyles')) {
    const style = document.createElement('style');
    style.id = 'cepSearchYouTubeStyles';
    style.textContent = `
      .cep-search-youtube { position:fixed; inset:0; z-index:2147483647; display:flex; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; background:rgba(28,24,27,.72); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); }
      .cep-search-youtube[hidden] { display:none !important; }
      .cep-search-youtube-dialog { width:min(900px,94vw); padding:12px; border:1px solid rgba(255,255,255,.55); border-radius:16px; background:rgba(250,244,245,.92); box-shadow:0 18px 60px rgba(0,0,0,.35),0 0 22px rgba(208,160,163,.3); }
      .cep-search-youtube-frame { width:100%; aspect-ratio:16/9; overflow:hidden; border-radius:11px; background:#000; }
      .cep-search-youtube-frame iframe { width:100%; height:100%; border:0; }
      .cep-search-youtube-actions { display:flex; justify-content:flex-end; align-items:center; gap:12px; margin-top:9px; font:12px Tahoma,sans-serif; }
      .cep-search-youtube-actions a { color:#604853; }
      .cep-search-youtube-close { border:0; background:none; color:#604853; font-size:18px; cursor:pointer; }
    `;
    document.head.appendChild(style);
  }
  const root = document.createElement('div'); root.className = 'cep-search-youtube'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'YouTube video player');
  const dialog = document.createElement('div'); dialog.className = 'cep-search-youtube-dialog';
  const frame = document.createElement('div'); frame.className = 'cep-search-youtube-frame';
  const actions = document.createElement('div'); actions.className = 'cep-search-youtube-actions';
  const external = document.createElement('a'); external.target = '_blank'; external.rel = 'noopener noreferrer'; external.textContent = 'Open on YouTube';
  const close = document.createElement('button'); close.type = 'button'; close.className = 'cep-search-youtube-close'; close.textContent = '✕'; close.setAttribute('aria-label', 'Close video');
  actions.append(external, close); dialog.append(frame, actions); root.appendChild(dialog); document.body.appendChild(root);
  const closePlayer = () => { root.hidden = true; frame.replaceChildren(); };
  const open = (videoId, sourceUrl) => {
    const iframe = document.createElement('iframe');
    const facebookUrl = getFacebookVideoUrl(sourceUrl);
    iframe.src = facebookUrl ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(facebookUrl)}&show_text=false&width=900&autoplay=true` : `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = facebookUrl ? 'Facebook video player' : 'YouTube video player';
    root.setAttribute('aria-label', iframe.title);
    external.textContent = facebookUrl ? 'Open on Facebook' : 'Open on YouTube';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true; iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(iframe); external.href = sourceUrl; root.hidden = false; close.focus({ preventScroll:true });
  };
  close.addEventListener('click', closePlayer);
  dialog.addEventListener('click', event => event.stopPropagation());
  root.addEventListener('click', closePlayer);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !root.hidden) closePlayer(); });
  searchYouTubeUi = { root, open, close: closePlayer };
  return searchYouTubeUi;
}

function openSearchYouTubeUrl(rawUrl) {
  const videoId = getYouTubeVideoId(rawUrl);
  if (!videoId && !getFacebookVideoUrl(rawUrl)) return false;
  getSearchYouTubeUi().open(videoId, rawUrl);
  return true;
}

function prepareSearchClipboard(copyText, copyHtml) {
  return {
    plainText: String(copyText || '').trim(),
    safeHtml: copyHtml && window.CEPSecurity?.sanitizeHTML ? window.CEPSecurity.sanitizeHTML(String(copyHtml)) : ''
  };
}
async function writeSearchClipboard(copyText, copyHtml, prepared) {
  const { plainText, safeHtml } = prepared || prepareSearchClipboard(copyText, copyHtml);
  // A native copy event can commit both formats synchronously, avoiding the
  // delayed rich-clipboard promise on some desktop browsers. Keep the async
  // API as a fallback when the browser does not permit this command.
  if (typeof document.execCommand === 'function') {
    let populated = false;
    const nativeCopy = event => {
      if (!event.clipboardData) return;
      event.clipboardData.setData('text/plain', plainText);
      if (safeHtml) event.clipboardData.setData('text/html', safeHtml);
      event.preventDefault(); event.stopImmediatePropagation();
      populated = true;
    };
    document.addEventListener('copy', nativeCopy, true);
    try {
      if (document.execCommand('copy') && populated) return;
    } catch (_) { /* Continue with the standard clipboard API. */ }
    finally { document.removeEventListener('copy', nativeCopy, true); }
  }

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
  scheduleDefaultCardFit(card);
  let clickTimer, clipboardPayload, pressAnimation, glow, glowAnimation, attempt = 0, pressed = false;
  if (!document.getElementById('cep-search-copy-glow-style')) {
    const style = document.createElement('style');
    style.id = 'cep-search-copy-glow-style';
    style.textContent = `
      html:root:root body :is(.universal-search-native-card,.cep-global-search-result) { position:relative; }
      html:root:root body .cep-search-copy-glow {
        position:absolute !important; inset:0 !important; pointer-events:none !important;
        margin:0 !important; padding:0 !important; background:none !important;
        box-sizing:border-box !important; border:4px solid rgba(255,255,255,.98) !important;
        box-shadow:0 0 8px 4px rgba(255,255,255,.95),0 0 22px 8px rgba(255,255,255,.7),inset 0 0 12px 4px rgba(255,255,255,.8) !important;
        z-index:3; opacity:0;
      }
    `;
    document.head.append(style);
  }
  const clearGlow = () => { glowAnimation?.cancel(); glow?.remove(); glow = null; };
  const showCopyGlow = () => {
    clearGlow();
    glow = document.createElement('span');
    glow.className = 'cep-search-copy-glow'; glow.setAttribute('aria-hidden','true');
    const surface = card.querySelector('.cep-source-surface,.cep-source-notebook,.cep-source-form,.cep-source-chat') || card;
    glow.style.borderRadius = getComputedStyle(surface).borderRadius;
    card.append(glow);
    const currentGlow = glow;
    if (typeof glow.animate !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      glow.style.opacity = '1'; setTimeout(() => currentGlow.remove(), 650); return;
    }
    glowAnimation = glow.animate([{opacity:0},{opacity:1,offset:.16},{opacity:1,offset:.4},{opacity:0}],
      {duration:700,easing:'ease-out'});
    glowAnimation.onfinish = () => currentGlow.remove();
  };
  const isInteractiveChild = target => target instanceof Element && Boolean(target.closest(interactiveSearchChildSelector));
  const animatePress = down => {
    pressAnimation?.cancel();
    if (typeof card.animate !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    pressAnimation = card.animate(
      down ? [{ scale:'1', translate:'0 0' }, { scale:'0.99', translate:'0 2px' }]
           : [{ scale:'0.99', translate:'0 2px' }, { scale:'1', translate:'0 0' }],
      { duration:down ? 80 : 120, easing:'ease-out', fill:down ? 'forwards' : 'none' }
    );
  };
  const releasePress = () => {
    if (!pressed) return;
    pressed = false; animatePress(false);
  };
  card.addEventListener('pointerdown', event => {
    if (event.button !== 0 || isInteractiveChild(event.target)) return;
    pressed = true; animatePress(true);
  });
  card.addEventListener('pointerup', releasePress);
  card.addEventListener('pointercancel', releasePress);
  card.addEventListener('pointerleave', releasePress);
  card.addEventListener('lostpointercapture', releasePress);

  card.addEventListener('click', event => {
    if (isInteractiveChild(event.target)) {
      const nestedLink = event.target.closest?.('a:not(.cep-global-search-result):not(.universal-search-native-card):not(.cep-xgpt-concept):not(.xgpt-concept-link)');
      if (nestedLink && openSearchYouTubeUrl(nestedLink.href)) {
        event.preventDefault(); event.stopPropagation();
        return;
      }
      if (!nestedLink) { event.preventDefault(); event.stopPropagation(); }
      return;
    }
    event.preventDefault();
    clearTimeout(clickTimer); clearGlow();
    const currentAttempt = ++attempt;
    clickTimer = setTimeout(async () => {
      try {
        clipboardPayload ||= prepareSearchClipboard(copyText, copyHtml);
        await writeSearchClipboard(copyText, copyHtml, clipboardPayload);
        if (currentAttempt === attempt) showCopyGlow();

      } catch (error) {
        console.warn('Search result could not be copied.', error);
      }
    }, 260);
  });
  card.addEventListener('dblclick', event => {
    if (isInteractiveChild(event.target)) { event.preventDefault(); event.stopPropagation(); return; }
    event.preventDefault(); event.stopPropagation(); clearTimeout(clickTimer); ++attempt; clearGlow(); releasePress();
    if (openSearchYouTubeUrl(card.href)) return;
    onNavigate?.(); navigate?.();
  });
}

// Pinned shortcuts reuse the clinical search dataset; no additional database request.
export function renderClinicalSearchPins(container, entries, { navigate } = {}) {
  const pins = entries.filter(entry => entry.record?.data?.pinned === true);
  if (!pins.length) return null;
  if (!document.getElementById('cep-clinical-search-pins-style')) {
    const style = document.createElement('style');
    style.id = 'cep-clinical-search-pins-style';
    style.textContent = `
      html:root:root:root body .cep-clinical-search-pins { grid-column:1/-1; min-width:0; width:100%; margin:0 0 16px; }
      html:root:root:root body .cep-clinical-search-pins-heading { margin:0 0 8px; font-size:12px; font-weight:600; color:var(--theme-ink,inherit); }
      html:root:root:root body .cep-clinical-search-pins-row { display:flex; gap:10px; overflow-x:auto; padding:5px 7px 12px; align-items:stretch; }
      html:root:root:root:root:root:root:root body .cep-clinical-search-pin { display:block !important; flex:0 0 165px; width:165px !important; min-width:0 !important; max-width:165px !important; height:95px !important; min-height:0 !important; margin:0 !important; text-decoration:none; cursor:pointer; }
      html:root:root:root:root:root:root:root body .cep-clinical-search-pin .cep-source-surface { box-sizing:border-box !important; height:95px !important; min-height:0 !important; padding:10px !important; overflow:hidden !important; }
      html:root:root:root:root:root:root:root body .cep-clinical-search-pin .cep-source-note-title { display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; font-size:12px !important; line-height:1.3 !important; font-weight:600 !important; margin:0 0 5px !important; }
      html:root:root:root:root:root:root:root body .cep-clinical-search-pin .cep-source-note-content { display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; font-size:11px !important; line-height:1.35 !important; white-space:normal !important; }
    `;
    document.head.append(style);
  }
  const section = document.createElement('section');
  section.className = 'cep-clinical-search-pins'; section.setAttribute('aria-label','Pinned Clinical Notes');
  const heading = document.createElement('div'); heading.className = 'cep-clinical-search-pins-heading'; heading.textContent = 'Pinned notes';
  const row = document.createElement('div'); row.className = 'cep-clinical-search-pins-row';
  for (const entry of pins) {
    const card = document.createElement('a'); card.className = 'cep-global-search-result universal-search-native-card cep-clinical-search-pin';
    const destination = new URL(entry.file,location.href);
    destination.hash = new URLSearchParams({cepId:entry.focusId || entry.id}).toString(); card.href = destination.href;
    const title = document.createElement('div'); title.className = 'cep-source-note-title'; title.textContent = entry.title;
    const preview = document.createElement('div'); preview.className = 'cep-source-note-content'; preview.textContent = entry.displayText || entry.text || '';
    card.append(title,preview); applySourceSearchSkin(card,entry);
    installSearchCardInteractions(card, {
      copyText:entry.displayText || entry.text || entry.title, copyHtml:getSearchCopyHtml(entry),
      navigate:()=>navigate ? navigate(card.href) : location.assign(card.href)
    });
    row.append(card);
  }
  section.append(heading,row); container.prepend(section); return section;
}

function installXgptMediaUi() {
  if (document.querySelector('.cep-xgpt-media-tip')) return;
  const tip = document.createElement('div'); tip.className = 'cep-xgpt-media-tip'; tip.hidden = true;
  document.body.appendChild(tip);
  const showConceptPreview = async (event, isCurrent) => {
    const link = event.target.closest?.('.cep-xgpt-concept'); if (!link) return;
    const concept = searchConceptName(link);
    if (!link.dataset.image) {
      const media = await loadXgptConceptMedia(concept);
      if (media?.imageUrl) { link.classList.add('has-image'); link.dataset.image = media.imageUrl; link.dataset.caption = media.caption; }
    }
    hydrateSearchConceptLink(link);
    const details = getCachedXgptConceptDefinition(concept);
    const definition = details?.definition || link.dataset.definition || '', why = details?.why || link.dataset.why || '';
    if ((!link.dataset.image && !definition && !why && !details?.videoUrl) || !link.isConnected) return;
    if (!isCurrent()) return;
    const parts = [];
    const photos = createXgptPhotoStrip(getCachedXgptConceptMedia(concept) || { imageUrl: link.dataset.image }, { alt: concept, zoom: true });
    if (photos) parts.push(photos);
    if (link.dataset.caption) { const caption = document.createElement('div'); caption.className = 'cep-xgpt-media-caption'; caption.textContent = link.dataset.caption; parts.push(caption); }
    const appendSection = (labelText, bodyText) => {
      if (!bodyText) return;
      const section = document.createElement('div'); section.className = 'cep-xgpt-media-section';
      const label = document.createElement('div'); label.className = 'cep-xgpt-media-label'; label.textContent = labelText;
      const body = document.createElement('div'); body.className = 'cep-xgpt-media-text'; body.textContent = bodyText;
      section.append(label, body); parts.push(section);
    };
    appendSection('DEFINITION', definition); appendSection('WHY IT MATTERS', why);
    tip.replaceChildren(...parts); window.CEPSharedDefinitions.appendVideo(tip,details?.videoUrl); tip.hidden = false;
    const rect = link.getBoundingClientRect(), tipRect = tip.getBoundingClientRect();
    tip.style.left = `${Math.max(12, Math.min(innerWidth - tipRect.width - 12, rect.left))}px`;
    tip.style.top = `${Math.max(12, Math.min(innerHeight - tipRect.height - 12, rect.bottom + 8))}px`;
  };
  window.CEPConceptPreview.install({ selector: '.cep-xgpt-concept', tip, show: showConceptPreview,
    close: () => { tip.hidden = true; tip.replaceChildren(); } });
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
  if (!document.getElementById('cep-search-input-media-style')) {
    const style = document.createElement('style'); style.id = 'cep-search-input-media-style';
    style.textContent = `.cep-search-input-wrap { position:relative; flex:1; min-width:0; }
.cep-search-input-wrap input { box-sizing:border-box; width:100%; padding-right:86px !important; }
.cep-search-input-wrap .cep-search-media-filters { position:absolute; right:9px; top:50%; transform:translateY(-50%); display:flex; gap:4px; }
.cep-search-media-filters[hidden] { display:none !important; }
html:root:root body .cep-global-search-filters[hidden] { display:none !important; }
.cep-search-input-wrap .cep-search-media-filters button { width:30px; height:30px; padding:0 !important; flex:none; display:grid; place-items:center; border:1px solid transparent; border-radius:9px; background:transparent; color:var(--theme-ink,#40363b); font:17px/1 sans-serif !important; cursor:pointer; }
.cep-search-input-wrap .cep-search-media-filters button[aria-pressed="true"] { background:rgba(128,128,128,.18) !important; border:1px solid currentColor !important; }
`; document.head.append(style);
  }
  const panel = document.createElement('section');
  panel.className = 'cep-global-search-panel';
  panel.innerHTML = `
    <div class="cep-global-search-row">
      <div class="cep-search-input-wrap">
      <input type="search" autocomplete="off" spellcheck="false" placeholder="Search all notes and pages…" aria-label="Words to search for">
        <div class="cep-search-media-filters" aria-label="Filter by link type">
          <button type="button" data-search-media="videos" aria-pressed="false" aria-label="Videos" title="Videos">🎬</button>
          <button type="button" data-search-media="links" aria-pressed="false" aria-label="Links" title="Links">🔗</button>
        </div>
      </div>
      <button type="button" aria-label="Close search">×</button>
    </div>
    <div class="cep-global-search-modes" aria-label="Search mode">
      <button type="button" class="is-active" data-search-mode="default" aria-pressed="true">Default</button>
      <button type="button" data-search-mode="concepts" aria-pressed="false">Concepts</button>
      <button type="button" data-search-mode="clinical" aria-pressed="false">C.Notes</button>
    </div>
    <div class="cep-global-search-filters" aria-label="Filter search by section"></div>
    <div class="cep-global-search-status" aria-live="polite">Preparing saved-note sections…</div>
    <div class="cep-xgpt-auth-prompt" hidden><span>Sign in to include Xgpt Notes and concept images.</span><button type="button">Sign in to Xgpt</button></div>
    <div class="cep-global-search-results"></div>`;
  host.replaceChildren(panel);
  const input = panel.querySelector('input');
  const modes = panel.querySelector('.cep-global-search-modes');
  installSearchHelp(modes);
  const filters = panel.querySelector('.cep-global-search-filters');
  const mediaFilters = panel.querySelector('.cep-search-media-filters');
  let mediaFilter = 'all';
  const selectedMedia = new Set();
  const status = panel.querySelector('.cep-global-search-status');
  const xgptPrompt = panel.querySelector('.cep-xgpt-auth-prompt');
  const results = panel.querySelector('.cep-global-search-results');
  panel.querySelector('[aria-label="Close search"]').addEventListener('click', closeSearch);
  let clinicalEntries = [], clinicalLoadPromise=null;
  let entries = [], activeSource = 'All', searchMode = 'default', timer, conceptRequestId = 0;
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

  async function runConceptSearch() {
    const requestId = ++conceptRequestId;
    const query = normalizeSearchValue(input.value);
    results.replaceChildren();
    if (!query) { status.textContent = 'Type a word to search referenced concepts.'; return; }
    status.textContent = 'Searching referenced concepts…';
    try {
      const { results: conceptResults, terms } = await searchReferencedXgptConcepts(query);
      if (requestId !== conceptRequestId || searchMode !== 'concepts' || normalizeSearchValue(input.value) !== query) return;
      xgptPrompt.hidden = true;
      status.textContent = conceptResults.length
        ? `${conceptResults.length}${conceptResults.length === 30 ? '+' : ''} referenced concept${conceptResults.length === 1 ? '' : 's'}`
        : 'No matching referenced concepts found.';
      renderReferencedXgptConceptResults(results, conceptResults, terms);
    } catch (error) {
      if (requestId !== conceptRequestId) return;
      if (error?.code === 'xgpt/auth-required') {
        xgptPrompt.hidden = false;
        status.textContent = 'Sign in to search referenced concepts.';
      } else {
        status.textContent = 'Concept search could not be loaded.';
        console.warn('Referenced concept search could not load.', error);
      }
    }
  }

  const runSearch = () => {
    results.classList.toggle('cep-default-search-results',searchMode === 'default');
    if (searchMode === 'concepts') { void runConceptSearch(); return; }
    conceptRequestId++;
    if(searchMode==='clinical' && clinicalLoadPromise){status.textContent='Loading Clinical Notes…';return;}
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
    if (searchMode === 'clinical') renderClinicalSearchPins(results,clinicalEntries);
    if (!query && mediaFilter === 'all') { status.textContent = 'Type a word to search.'; return; }
    const scoredMatches = (searchMode === 'clinical' ? clinicalEntries : entries).filter(entry => matchesSearchMedia(entry, mediaFilter)).map(entry => {
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
    }).filter(Boolean).filter(match => searchMode === 'clinical' || activeSource === 'All' || match.entry.sourceTitle === activeSource)
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
    window.CEPInformationLinks.sortResults(matches, match => match.entry);
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
      if (entry.file === 'chatgptx.html') link.style.background = 'linear-gradient(145deg, #ebebeb 0%, #d5d0d3 48%, #ebebeb 100%)';
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
      applySourceSearchSkin(link, entry);
      installSearchCardInteractions(link, {
        copyText: entry.displayText || entry.text || entry.title,
        copyHtml: getSearchCopyHtml(entry),
        navigate: () => {
          if (entry.directUrl && entry.file === 'forms.html') window.CEPNoteVideoLinks.open(link.href, { trigger: link });
          else if (entry.directUrl) window.open(link.href, '_blank', 'noopener');
          else location.assign(link.href);
        }
      });
      group.querySelector('.cep-global-search-group-cards').appendChild(link);
    });
  };
  modes.querySelectorAll('[data-search-mode]').forEach(modeButton => {
    modeButton.addEventListener('click', async () => {
      searchMode = modeButton.dataset.searchMode;
      modes.querySelectorAll('[data-search-mode]').forEach(button => {
        const active = button === modeButton;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      mediaFilters.hidden = searchMode === 'concepts';
      filters.hidden = searchMode !== 'default';
      input.placeholder = searchMode === 'concepts' ? 'Search referenced concepts…' : searchMode === 'clinical' ? 'Search Clinical Notes titles and text…' : 'Search all notes and pages…';
      if (searchMode === 'clinical') {
        status.textContent = 'Loading Clinical Notes…';
        const request=loadClinicalNotesEntries();
        clinicalLoadPromise=request;
        try { clinicalEntries = await request; }
        catch (error) { if(searchMode!=='clinical')return;results.replaceChildren();status.textContent=error.message;return; }
        finally { if(clinicalLoadPromise===request)clinicalLoadPromise=null; }
        if (searchMode !== 'clinical') return;
      }
      runSearch();
      input.focus();
    });
  });
  mediaFilters.addEventListener('click', event => {
    const selected = event.target.closest('[data-search-media]');
    if (!selected) return;
    const kind = selected.dataset.searchMedia;
    if (selectedMedia.has(kind)) selectedMedia.delete(kind); else selectedMedia.add(kind);
    mediaFilter = selectedMedia.size === 1 ? [...selectedMedia][0] : 'all';
    mediaFilters.querySelectorAll('button').forEach(button => {
      const active = selectedMedia.has(button.dataset.searchMedia);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    runSearch(); input.focus();
  });
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
  const onSearchPageRestore = event => {
    if (event.persisted) queueMountedRefresh({ detail: { dataset: 'main:' } });
  };
  window.addEventListener('pageshow', onSearchPageRestore);
  const mountedSearchObserver = new MutationObserver(() => {
    if (host.isConnected) return;
    window.removeEventListener('cep-search-cache-invalidated', onSearchCacheInvalidated);
    window.removeEventListener('storage', onSearchStorageInvalidated);
    window.removeEventListener('pageshow', onSearchPageRestore);
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
