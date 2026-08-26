import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { collection, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
  parsed.body.querySelectorAll('br,p,div,li,tr,h1,h2,h3,h4').forEach(node => node.append(' '));
  return (parsed.body.textContent || '').replace(/\s+/g, ' ').trim();
};

let entriesPromise;
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
          const text = fields.map(field => textFromHtml(data[field])).filter(Boolean).join(' · ');
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

export async function mountUniversalSearch(host, closeSearch) {
  const panel = document.createElement('section');
  panel.className = 'cep-global-search-panel';
  panel.innerHTML = `
    <div class="cep-global-search-row">
      <input type="search" autocomplete="off" spellcheck="false" placeholder="Search all notes and pages…" aria-label="Words to search for">
      <button type="button" aria-label="Close search">×</button>
    </div>
    <div class="cep-global-search-filters" aria-label="Filter search by section"></div>
    <div class="cep-global-search-status" aria-live="polite">Preparing saved-note sections…</div>
    <div class="cep-global-search-results"></div>`;
  host.replaceChildren(panel);
  const input = panel.querySelector('input');
  const filters = panel.querySelector('.cep-global-search-filters');
  const status = panel.querySelector('.cep-global-search-status');
  const results = panel.querySelector('.cep-global-search-results');
  panel.querySelector('button').addEventListener('click', closeSearch);
  let entries = [], activeSource = 'All', timer;

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
      if (!terms.every(term => title.includes(term) || text.includes(term))) return null;
      return { entry, score: (title.includes(query) ? 250 : 0) + (text.includes(query) ? 100 : 0) + terms.reduce((n,t) => n + (title.includes(t) ? 60 : 10), 0) };
    }).filter(Boolean).filter(match => activeSource === 'All' || match.entry.sourceTitle === activeSource)
      .sort((a,b) => b.score - a.score).slice(0, 40);
    status.textContent = matches.length ? `${matches.length}${matches.length === 40 ? '+' : ''} result${matches.length === 1 ? '' : 's'}` : 'No matching notes found.';
    matches.forEach(({ entry }) => {
      const link = document.createElement('a'); link.className = 'cep-global-search-result';
      if (entry.directUrl) { link.href = entry.directUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else {
        const destination = new URL(entry.file, location.href);
        destination.hash = new URLSearchParams({ cepId: entry.id, cepSearch: query, cepHint: entry.text.slice(0,230) }).toString();
        link.href = destination.href;
      }
      const title = document.createElement('strong'); title.textContent = entry.title;
      const snippet = document.createElement('span');
      const lower = entry.text.toLocaleLowerCase(); const first = terms.map(term => lower.indexOf(term)).filter(index => index >= 0).sort((a,b)=>a-b)[0] || 0;
      addHighlightedText(snippet, `${first > 70 ? '…' : ''}${entry.text.slice(Math.max(0,first-70), Math.max(0,first-70)+240)}`, terms);
      link.append(title, snippet); results.appendChild(link);
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
}
