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
  parsed.body.querySelectorAll('p,div,li,tr,h1,h2,h3,h4,blockquote,pre').forEach(node => node.append('\n'));
  return (parsed.body.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

let entriesPromise;
let xgptEntriesPromise;
let xgptConceptMedia = {};
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
    return snapshot.docs.map(note => {
      const rawHtml = note.data().content || note.data().note || note.data().text || '';
      const text = textFromHtml(rawHtml).replace(/\[\[([^\]]+)\]\]/g, '$1');
      const firstLine = text.split(/[.!?]\s|\n/)[0].trim();
      return {
        id: note.id, file: 'chatgptx.html', sourceTitle: 'Xgpt Notes',
        title: firstLine ? `Xgpt — ${firstLine.slice(0,72)}` : 'Xgpt Note', text, richHtml: rawHtml
      };
    });
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
          const title = textFromHtml(data.title) || sourceTitle;
          const text = fields.map(field => textFromHtml(data[field])).filter(Boolean).join('\n');
          const directUrl = directField && data[directField];
          return { id: note.id, file, sourceTitle, title: title === sourceTitle ? title : `${sourceTitle} — ${title}`, text, directUrl };
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

function addXgptRichContent(parent, html, terms) {
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
      link.href = '#'; link.className = 'cep-xgpt-concept'; link.textContent = concept;
      const media = xgptConceptMedia[normalizeConcept(concept)];
      if (media?.imageUrl) { link.classList.add('has-image'); link.dataset.image = media.imageUrl; link.dataset.caption = media.caption || ''; }
      fragment.append(link); last = offset + match.length; return match;
    });
    fragment.append(document.createTextNode(text.slice(last))); node.replaceWith(fragment);
  });
  const richTextNodes = []; const highlightWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  while (highlightWalker.nextNode()) richTextNodes.push(highlightWalker.currentNode);
  richTextNodes.forEach(node => {
    if (!node.nodeValue || !terms.some(term => node.nodeValue.toLocaleLowerCase().includes(term))) return;
    const fragment = document.createDocumentFragment(); addHighlightedText(fragment, node.nodeValue, terms); node.replaceWith(fragment);
  });
  parent.append(...content.childNodes);
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
    const query = input.value.trim().toLocaleLowerCase();
    const terms = [...new Set(query.split(/\s+/).filter(Boolean))];
    results.replaceChildren();
    if (!query) { status.textContent = 'Type a word to search.'; return; }
    const matches = entries.map(entry => {
      const title = entry.title.toLocaleLowerCase(), text = entry.text.toLocaleLowerCase();
      const words = new Set(`${title} ${text}`.match(/[\p{L}\p{N}]+/gu) || []);
      let score = (title.includes(query) ? 250 : 0) + (text.includes(query) ? 100 : 0);
      let fuzzy = false;
      for (const term of terms) {
        if (title.includes(term)) score += 60;
        else if (text.includes(term)) score += 10;
        else {
          const tolerance = term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0;
          const similar = tolerance && [...words].some(word => Math.abs(word.length - term.length) <= tolerance && editDistance(term, word) <= tolerance);
          if (!similar) return null;
          fuzzy = true; score += 4;
        }
      }
      return { entry, score, fuzzy };
    }).filter(Boolean).filter(match => activeSource === 'All' || match.entry.sourceTitle === activeSource)
      .sort((a,b) => b.score - a.score).slice(0, 40);
    const onlySimilar = matches.length && matches.every(match => match.fuzzy);
    status.textContent = matches.length ? `${onlySimilar ? 'No exact matches · showing ' : ''}${matches.length}${matches.length === 40 ? '+' : ''} ${onlySimilar ? 'similar ' : ''}result${matches.length === 1 ? '' : 's'}` : 'No matching notes found.';
    const groups = new Map();
    matches.forEach(({ entry }) => {
      let group = groups.get(entry.sourceTitle);
      if (!group) {
        group = document.createElement('section'); group.className = 'cep-global-search-group';
        const sourceColours = {
          'pn.html': ['rgba(192,137,139,.58)', '#755255', 'rgba(239,221,222,.72)'],
          'info.html': ['rgba(126,161,158,.58)', '#4e706d', 'rgba(219,232,231,.76)'],
          'explain.html': ['rgba(170,173,111,.58)', '#686b40', 'rgba(235,235,211,.78)'],
          'recalls.html': ['rgba(199,132,101,.55)', '#82533f', 'rgba(240,220,211,.76)']
        };
        const [divider, headingColour, cardColour] = sourceColours[entry.file.toLocaleLowerCase()] ||
          ['rgba(112,126,125,.42)', '#655b60', 'rgba(255,255,255,.62)'];
        group.style.setProperty('--search-divider', divider);
        group.style.setProperty('--search-title', headingColour);
        group.style.setProperty('--search-card', cardColour);
        const heading = document.createElement('a'); heading.className = 'cep-global-search-group-title';
        heading.textContent = entry.sourceTitle; heading.href = entry.file;
        const cards = document.createElement('div'); cards.className = 'cep-global-search-group-cards';
        group.append(heading, cards); results.appendChild(group); groups.set(entry.sourceTitle, group);
      }
      const link = document.createElement('a'); link.className = 'cep-global-search-result';
      if (entry.directUrl) { link.href = entry.directUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else {
        const destination = new URL(entry.file, location.href);
        destination.hash = new URLSearchParams({ cepId: entry.id, cepSearch: query, cepHint: entry.text.slice(0,230) }).toString();
        link.href = destination.href;
      }
      const title = document.createElement('strong'); title.textContent = entry.title;
      const cardBody = document.createElement(entry.file === 'chatgptx.html' ? 'div' : 'span');
      if (entry.file === 'chatgptx.html' && entry.richHtml) {
        cardBody.className = 'cep-xgpt-rich-content';
        addXgptRichContent(cardBody, entry.richHtml, terms);
      } else addHighlightedText(cardBody, entry.text, terms);
      link.append(title, cardBody); group.querySelector('.cep-global-search-group-cards').appendChild(link);
    });
  };
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(runSearch, 140); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSearch();
    if (event.key === 'Enter') results.querySelector('a')?.click();
  });
  input.focus();
  entries = await loadEntries(source => { status.textContent = `Loading ${source}…`; });
  renderFilters(); runSearch(); input.focus();
  void requestXgptEntries();
}
