export function renderSearchCard(card, entry, terms, renderRich) {
  installCardStyles();
  card.classList.add('cep-search-card');
  card.classList.toggle('cep-search-xgpt', entry.sourceTitle === 'Xgpt Notes');
  const title = document.createElement('span');
  title.className = 'cep-search-title';
  title.textContent = entry.title;
  const body = document.createElement('div');
  body.className = 'cep-search-body';
  if (entry.richHtml) {
    body.classList.add('cep-search-rich');
    renderRich(body, entry.richHtml, terms);
  } else {
    const pattern = terms.length ? new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi') : null;
    String(entry.text || '').split(pattern || /$^/).forEach(part => {
      if (terms.includes(part.toLocaleLowerCase())) {
        const mark = document.createElement('mark'); mark.textContent = part; body.append(mark);
      } else body.append(document.createTextNode(part));
    });
  }
  card.append(title, body);
  const safeUrl = (value, image = false) => {
    try {
      const url = new URL(value, location.href);
      if (['https:', 'http:'].includes(url.protocol) || (image && /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(value))) return url.href;
    } catch {}
    return null;
  };
  const imageUrl = entry.imageUrl && safeUrl(entry.imageUrl, true);
  if (imageUrl) {
    const image = document.createElement('img');
    image.className = 'cep-search-attachment';
    image.src = imageUrl; image.alt = 'Note image'; image.loading = 'lazy'; image.decoding = 'async';
    card.append(image);
  }
  const noteUrl = entry.noteUrl && safeUrl(entry.noteUrl);
  if (noteUrl) {
    const link = document.createElement('a');
    link.className = 'cep-search-note-link'; link.href = noteUrl;
    link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = '🔗 Open URL';
    link.addEventListener('click', event => event.stopPropagation());
    card.append(link);
  }
}
function installCardStyles() {
  if (document.getElementById('cep-shared-search-card-styles')) return;
  const style = document.createElement('style');
  style.id = 'cep-shared-search-card-styles';
  style.textContent = `
  a.cep-search-card {
    display:block; box-sizing:border-box; min-height:88px; padding:12px 14px;
    border:1px solid rgba(255,255,255,.88); border-radius:13px; color:#30292c;
    background:var(--search-card,rgba(255,255,255,.62)); box-shadow:0 3px 10px rgba(63,52,57,.08);
    font:11.5px/1.35 Arial,sans-serif; text-decoration:none; transform:none; transition:none;
  }
  a.cep-search-card:hover,a.cep-search-card:focus-visible {
    border-color:#fff; background:var(--search-card,rgba(255,255,255,.62));
    box-shadow:0 5px 13px rgba(63,52,57,.13); transform:none;
  }
  a.cep-search-card > .cep-search-title {display:block; margin:0 0 6px; color:inherit; font:700 13px/1.25 Arial,sans-serif; white-space:normal;}
  a.cep-search-card > .cep-search-body {display:block; color:#534a4e; font:11.5px/1.35 Arial,sans-serif; white-space:normal; overflow-wrap:anywhere;}
  .cep-search-card .cep-search-body span {display:inline; font:inherit; color:inherit; white-space:inherit;}
  .cep-search-card .cep-search-body strong {font:inherit; font-weight:700;}
  .cep-search-card .cep-search-body mark {padding:0 1px; border-radius:3px; background:rgba(255,237,125,.72); color:inherit;}
  .cep-search-card .cep-search-body mark.gradient-highlight,
  .cep-search-card .cep-search-body span[style*="background-color"] {
    display:inline; padding:0 3px; border-radius:5px;
    background:linear-gradient(90deg,#fff3a6 0%,#ffd7b5 52%,#ffc7da 100%) !important;
    color:#171717 !important; box-shadow:inset 0 -1px 0 rgba(110,72,20,.20),0 0 0 1px rgba(255,255,255,.5);
    -webkit-box-decoration-break:clone; box-decoration-break:clone;
  }
  .cep-search-rich > :first-child {margin-top:0;}
  .cep-search-rich > :last-child {margin-bottom:0;}
  .cep-search-rich p,.cep-search-rich div {margin:0 0 7px;}
  .cep-search-attachment {display:block;max-width:100%;height:auto;margin-top:10px;border-radius:6px;}
  .cep-search-note-link {display:block;margin-top:8px;font:12px/1.35 Arial,sans-serif;}
  .cep-search-rich img {max-width:100%;height:auto;}
  .cep-search-rich table {max-width:100%;border-collapse:collapse;}
  .cep-search-rich td,.cep-search-rich th {padding:3px 6px;border:1px solid rgba(130,130,136,.42);}
  a.cep-search-card.cep-search-xgpt {
    display:flex; min-height:0; flex-direction:column; gap:6px; padding:13px 14px;
    border:1px solid rgba(255,255,255,.78); border-radius:14px; color:#40363b;
    box-shadow:0 4px 14px rgba(75,65,70,.08); transition:transform 150ms ease,background 150ms ease;
  }
  a.cep-search-card.cep-search-xgpt:hover,a.cep-search-card.cep-search-xgpt:focus-visible {transform:translateY(-1px);background:rgba(255,255,255,.86);}
  a.cep-search-xgpt > .cep-search-title {margin:0;}
  a.cep-search-xgpt > .cep-search-body {line-height:1.45;white-space:pre-wrap;}
  a.cep-search-xgpt > .cep-search-rich {white-space:normal;}
  `;
  document.head.append(style);
}
