export function mountHomeLinks({ load, save, signOut }) {
  const nav = document.querySelector('.top-links');
  const light = document.querySelector('.cep-sign-out-light');
  if (!nav || !light) return;
  const defaults = [...nav.querySelectorAll('a')].map(a => ({ title: a.textContent.trim(), url: a.href }));
  let links = defaults, ready = false, loadError = false, busy = false;
  const usageKey = 'cep-home-link-usage-v1';
  let usage = {};
  try {
    const stored = JSON.parse(localStorage.getItem(usageKey) || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) usage = stored;
  } catch {}
  const linkKey = link => new URL(link.url).href;
  const saveUsage = () => {
    try { localStorage.setItem(usageKey, JSON.stringify(usage)); } catch {}
  };
  const normalize = value => {
    const title = String(value.title || '').trim();
    let url = String(value.url || '').trim();
    if (!/^[a-z][a-z\d+.-]*:/i.test(url)) url = 'https://' + url;
    const parsed = new URL(url);
    if (!title || !['https:', 'http:'].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) throw Error('Enter a link name and a valid http or https website address.');
    return { title, url: parsed.href };
  };
  function render() {
    const ordered = links.map((link, index) => ({ link, index, uses: Number(usage[linkKey(link)]) || 0 }))
      .sort((a, b) => b.uses - a.uses || a.index - b.index)
      .map(item => item.link);
    nav.replaceChildren(...ordered.map(link => {
      const a = document.createElement('a'); a.href = link.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.dataset.homeLinkKey = linkKey(link);
      const icon = document.createElement('img'); icon.className = 'site-favicon'; icon.alt = '';
      icon.src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(new URL(link.url).hostname) + '&sz=32';
      a.append(icon, document.createTextNode(link.title)); return a;
    }));
  }
  nav.addEventListener('click', event => {
    const anchor = event.target.closest('a[data-home-link-key]');
    if (!anchor) return;
    const key = anchor.dataset.homeLinkKey;
    usage[key] = Math.min(Number.MAX_SAFE_INTEGER, (Number(usage[key]) || 0) + 1);
    saveUsage();
  });
  const style = document.createElement('style');
  style.textContent = `
    .home-options {position:fixed;inset:auto auto max(50px,calc(env(safe-area-inset-bottom) + 44px)) max(10px,env(safe-area-inset-left));margin:0;padding:7px;min-width:150px;border:1px solid #ffffffd9;border-radius:14px;background:inherit;box-shadow:0 8px 30px #493c3426;color:#40363b}
    .home-options button {display:block;width:100%;text-align:left}
    .home-options button,.home-links-editor button {min-height:44px;padding:9px 14px;border:1px solid #bfc3c866;border-radius:10px;background:#ffffffa6;color:#40363b;font:14px/1.4 Arial,sans-serif;cursor:pointer}
    .home-options button + button {margin-top:5px}
    .home-links-editor {box-sizing:border-box;width:min(640px,calc(100vw - 24px));max-height:85dvh;padding:20px;border:1px solid #fff;border-radius:18px;background:inherit;color:#40363b;box-shadow:0 12px 50px #493c3433;font:14px/1.4 Arial,sans-serif;overflow:auto}
    .home-links-editor::backdrop {background:#30292c66;backdrop-filter:blur(3px)}
    .home-links-editor h2 {margin:0 0 6px;font:600 21px/1.3 Arial,sans-serif}
    .home-links-editor p {margin:0 0 14px}
    .home-link-row {display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr) auto;gap:8px;align-items:end;margin:0 0 12px;padding:12px;border:1px solid #d6d9dd;border-radius:12px}
    .home-link-row label {display:grid;gap:4px;min-width:0;font-size:12px}
    .home-link-row input {box-sizing:border-box;width:100%;min-width:0;padding:10px;border:1px solid #c4c8ce;border-radius:8px;background:#fff;color:#40363b;font:16px/1.3 Arial,sans-serif}
    .home-links-actions {display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:12px}
    .home-links-editor .home-links-save {background:#e1e2c3}
    .home-links-status {color:#805047;min-height:20px}
    .home-links-editor button:disabled {opacity:.5;cursor:wait}
    @media(max-width:540px){.home-link-row{grid-template-columns:minmax(0,1fr) auto}.home-link-row label{grid-column:1/-1}.home-link-row button{grid-column:2}.home-links-editor{padding:16px}}
  `;
  document.head.append(style);
  const menu = document.createElement('div'); menu.id = 'homeOptions'; menu.className = 'home-options'; menu.setAttribute('popover', 'auto');
  const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = 'Edit links';
  const logout = document.createElement('button'); logout.type = 'button'; logout.textContent = 'Sign out';
  menu.append(edit, logout); document.body.append(menu);
  light.title = 'Options'; light.setAttribute('aria-label', 'Home options'); light.setAttribute('aria-controls', menu.id); light.setAttribute('aria-expanded', 'false');
  menu.addEventListener('toggle', e => light.setAttribute('aria-expanded', String(e.newState === 'open')));
  window.CEP_HOME_OPTIONS = () => menu.togglePopover();
  logout.addEventListener('click', () => { menu.hidePopover(); signOut(); });
  const dialog = document.createElement('dialog'); dialog.className = 'home-links-editor'; dialog.setAttribute('aria-labelledby', 'homeLinksTitle');
  dialog.innerHTML = '<h2 id="homeLinksTitle">Edit links</h2><p>Choose the links shown below the header.</p><form><div class="home-links-rows"></div><button type="button" class="home-links-add">Add link</button><p class="home-links-status" role="status"></p><div class="home-links-actions"><button type="button" class="home-links-cancel">Cancel</button><button type="submit" class="home-links-save">Save links</button></div></form>';
  document.body.append(dialog);
  const form = dialog.querySelector('form'), rows = dialog.querySelector('.home-links-rows'), status = dialog.querySelector('.home-links-status');
  function addRow(link = { title: '', url: '' }) {
    const row = document.createElement('div'); row.className = 'home-link-row';
    for (const [key, label] of [['title', 'Name'], ['url', 'Website address']]) {
      const field = document.createElement('label'); field.textContent = label;
      const input = document.createElement('input'); input.name = key; input.value = link[key]; input.required = true; input.maxLength = key === 'title' ? 100 : 2048;
      if (key === 'url') { input.inputMode = 'url'; input.autocapitalize = 'none'; input.spellcheck = false; input.placeholder = 'https://example.com'; }
      field.append(input); row.append(field);
    }
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', 'Remove ' + (link.title || 'new link'));
    remove.addEventListener('click', () => { row.remove(); dialog.querySelector('.home-links-add').focus(); }); row.append(remove); rows.append(row); return row;
  }
  async function fetchLinks() {
    ready = false; loadError = false; edit.disabled = true;
    try { const saved = await load(); links = saved == null ? defaults : saved.map(normalize); render(); ready = true; }
    catch { loadError = true; }
    finally { edit.disabled = false; }
  }
  edit.addEventListener('click', async () => {
    menu.hidePopover();
    if (loadError) await fetchLinks();
    rows.replaceChildren(); links.forEach(addRow);
    status.textContent = ready ? '' : 'Could not load saved links. Close and try again before editing.';
    form.querySelectorAll('button,input').forEach(el => el.disabled = !ready);
    dialog.querySelector('.home-links-cancel').disabled = false;
    dialog.showModal();
  });
  dialog.querySelector('.home-links-add').addEventListener('click', () => addRow().querySelector('input').focus());
  dialog.querySelector('.home-links-cancel').addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', e => { if (busy) e.preventDefault(); });
  dialog.addEventListener('close', () => light.focus());
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (!ready || busy) return;
    let updated;
    try { updated = [...rows.children].map(row => normalize({ title: row.querySelector('[name=title]').value, url: row.querySelector('[name=url]').value })); }
    catch (error) { status.textContent = error.message; return; }
    busy = true; form.querySelectorAll('button,input').forEach(el => el.disabled = true); status.textContent = 'Saving…';
    try {
      await save(updated);
      const active = new Set(updated.map(linkKey));
      for (const key of Object.keys(usage)) if (!active.has(key)) delete usage[key];
      saveUsage(); links = updated; render(); dialog.close();
    }
    catch { status.textContent = 'Could not save links. Your changes are still here—please try again.'; }
    finally { busy = false; form.querySelectorAll('button,input').forEach(el => el.disabled = false); }
  });
  render();
  void fetchLinks();
}
