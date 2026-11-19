(function () {
  let centerToggle = document.querySelector(".center-toggle");

if (!centerToggle) {
  centerToggle = document.createElement("div");
  centerToggle.className = "center-toggle";
  centerToggle.innerHTML = `
    <div class="toggle-icon" id="menuToggle">☐</div>
    <div class="rays"></div>
  `;
  document.body.appendChild(centerToggle);
}

const toggleIcon = centerToggle.querySelector(".toggle-icon");
const menuContainer = centerToggle.querySelector(".rays");

if (!toggleIcon || !menuContainer) return;
toggleIcon.setAttribute('role', 'button');
toggleIcon.setAttribute('tabindex', '0');
toggleIcon.setAttribute('aria-label', 'Open navigation menu');
toggleIcon.title = 'Menu';

  let searchOverlay = null, cachedSearchOverlay = null;
  // Prefetch only the HTML shell; this does not start its Firebase loaders.
  if(!new URLSearchParams(location.search).has('cepSearchEmbed')){
    const prefetch=document.createElement('link');prefetch.rel='prefetch';prefetch.as='document';
    prefetch.href=new URL('home-search-window.html?cepSearchEmbed=1',location.href).href;document.head.append(prefetch);
  }

  function closeEmbeddedSearch() {
    if (!searchOverlay) return;
    const closing=searchOverlay;searchOverlay=null;
    closing.classList.remove('is-open');document.body.classList.remove('cep-search-overlay-open');
    setTimeout(()=>{if(searchOverlay!==closing)closing.style.display='none';},180);
    centerToggle.querySelector('.header-search-trigger')?.focus();
  }
  async function openEmbeddedSearch() {
    if(typeof window.openCepUniversalSearch==='function'){window.openCepUniversalSearch();return;}
    if(searchOverlay)return;
    if(cachedSearchOverlay?.isConnected){
      searchOverlay=cachedSearchOverlay;searchOverlay.style.display='grid';
      document.body.classList.add('cep-search-overlay-open');requestAnimationFrame(()=>searchOverlay?.classList.add('is-open'));
      searchOverlay.querySelector('iframe')?.contentWindow.postMessage({type:'cep-universal-search-open'},location.origin);return;
    }
    const overlay=document.createElement('div');overlay.className='cep-search-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Search all Xlyneve notes and pages');
    const loading=document.createElement('span');loading.className='cep-search-overlay-loading';loading.textContent='Opening Search…';loading.style.cssText='color:var(--theme-ink,#39353a);z-index:1;pointer-events:none;text-shadow:none';
    const frame=document.createElement('iframe');frame.className='cep-search-overlay-frame';frame.title='Home search — all notes and pages';
    frame.style.setProperty('opacity','1','important');
    frame.style.setProperty('background','var(--clinical-panel,#fff)','important');
    frame.addEventListener('load',()=>{
      try{
        const doc=frame.contentDocument,panel=doc?.getElementById('universalSearchPanel');
        if(!panel)return;
        doc.documentElement.dataset.cepSearchOnly='true';
        doc.body.classList.add('cep-search-embed');
        // Keep the search above Home layout wrappers and never show its dashboard.
        if(panel.parentElement!==doc.body)doc.body.append(panel);
        frame.contentWindow.openCepUniversalSearch?.();
      }catch{}
    });
    frame.src=new URL('home-search-window.html?cepSearchEmbed=1',location.href).href;
    overlay.append(loading,frame);overlay.addEventListener('click',event=>{if(event.target===overlay)closeEmbeddedSearch();});
    window.addEventListener('message',event=>{
      if(event.origin!==location.origin||event.source!==frame.contentWindow)return;
      if(event.data?.type==='cep-universal-search-ready')overlay.classList.add('search-is-ready');
      if(event.data?.type==='cep-universal-search-close')closeEmbeddedSearch();
      if(event.data?.type==='cep-universal-search-navigate'){
        try{const url=new URL(event.data.url,location.href);if(['http:','https:'].includes(url.protocol)){closeEmbeddedSearch();location.assign(url.href);}}catch{}
      }
    });
    searchOverlay=cachedSearchOverlay=overlay;document.body.append(overlay);document.body.classList.add('cep-search-overlay-open');
    requestAnimationFrame(()=>overlay.classList.add('is-open'));
  }

  let headerSearchButton = centerToggle.querySelector('.header-search-trigger');
  if (!headerSearchButton) {
    headerSearchButton = document.createElement('button');
    headerSearchButton.type = 'button';
    headerSearchButton.className = 'header-search-trigger';
    headerSearchButton.innerHTML = '';
    headerSearchButton.setAttribute('aria-label', 'Search all notes and pages');
    headerSearchButton.title = 'Search all notes and pages (Ctrl/⌘ K)';
    centerToggle.appendChild(headerSearchButton);
  }
  // Universal Search matches the menu/rays control, with a visible search glyph.
  const searchIcon=document.createElementNS('http://www.w3.org/2000/svg','svg');
  searchIcon.setAttribute('viewBox','0 0 24 24');searchIcon.setAttribute('aria-hidden','true');
  searchIcon.innerHTML='<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>';
  for(const [name,value] of Object.entries({display:'block',width:'72%',height:'72%',fill:'none',stroke:'currentColor','stroke-width':'1.9','stroke-linecap':'round','pointer-events':'none'}))searchIcon.style.setProperty(name,value,'important');
  headerSearchButton.replaceChildren(searchIcon);
  function matchSearchToMenu(){
    const menuStyle=getComputedStyle(toggleIcon);
    for(const name of ['background','border','border-radius','box-shadow','width','height','animation'])headerSearchButton.style.setProperty(name,menuStyle.getPropertyValue(name),'important');
    for(const [name,value] of Object.entries({display:'grid','place-items':'center',padding:'0','box-sizing':'border-box',color:'var(--theme-ink,var(--page-header-ink,#303632))','-webkit-text-fill-color':'currentColor','min-width':'0','min-height':'0',filter:'none'}))headerSearchButton.style.setProperty(name,value,'important');
  }
  let searchStyleFrame;
  const scheduleSearchStyle=()=>{cancelAnimationFrame(searchStyleFrame);searchStyleFrame=requestAnimationFrame(matchSearchToMenu);};
  matchSearchToMenu();scheduleSearchStyle();
  new MutationObserver(scheduleSearchStyle).observe(document.documentElement,{attributes:true,attributeFilter:['data-xlyneve-color-theme','style','class']});
  window.addEventListener('cep-theme-css-ready',scheduleSearchStyle);
  window.addEventListener('load',scheduleSearchStyle,{once:true});
  window.addEventListener('resize',scheduleSearchStyle,{passive:true});
  headerSearchButton.addEventListener('click', event => {
    event.stopPropagation();
    hideMenu();
    openEmbeddedSearch();
  });

  const pageSearchInput = document.querySelector('#searchInput');
  if (pageSearchInput && !pageSearchInput.closest('.cep-global-search-panel')) {
    pageSearchInput.classList.add('cep-page-search-input');
    if (pageSearchInput.parentElement?.childElementCount === 1) {
      pageSearchInput.parentElement.classList.add('cep-page-search-shell');
    }
    const pageSearchToggle = document.createElement('button');
    pageSearchToggle.type = 'button';
    pageSearchToggle.className = 'cep-page-search-toggle';
    pageSearchToggle.innerHTML = '<span aria-hidden="true">⌕</span>';
    pageSearchToggle.setAttribute('aria-label', 'Search this page');
    pageSearchToggle.title = 'Search this page';
    document.body.appendChild(pageSearchToggle);
    const collapsePageSearch = () => {
      if (pageSearchInput.value) return;
      pageSearchInput.classList.remove('is-expanded');
      pageSearchToggle.classList.remove('is-hidden');
    };
    pageSearchToggle.addEventListener('click', () => {
      pageSearchInput.classList.add('is-expanded');
      pageSearchToggle.classList.add('is-hidden');
      pageSearchInput.focus();
    });
    pageSearchInput.addEventListener('blur', () => setTimeout(collapsePageSearch, 120));
    pageSearchInput.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      pageSearchInput.value = '';
      pageSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
      pageSearchInput.blur();
    });
  }

  const menuGroups = [
    {
      name: "Main",
      links: [
        { text: "Home", link: "home.html" },
        { text: "Nurse Notes", link: "PN.html" },
        { text: "Info", link: "info.html" },
        { text: "Templates", link: "explain.html" },
        { text: "Practice Nurse", link: "practiceN.html" },
        { text: "Recalls", link: "recalls.html" },
        { text: "Clinical Notes", link: "Clinicalnotes.html" }
      ]
    },
    {
      name: "Clinical",
      links: [
        { text: "Xgpt", link: "chatgptx.html" },
        { text: "Links", link: "forms.html" },
        { text: "Drug Calc", link: "OHcalc.html" },
         { text: "Vaccines", link: "complete-vaccine-info.html" },
        { text: "Vaccine Calc", link: "vaccine-spacing.html" },
        { text: "Meds", link: "Npres.html" },
        { text: "Consult", link: "RNCNP.html" }
      ]
    },
    {
      name: "Admin",
      links: [
        { text: "Inteleviewer", link: "inteleviewer.html" },
        { text: "Notes", link: "Notes.html" },
        { text: "OH CME", link: "https://onehealthgpuc.github.io/cases-site/" },
        { text: "Roster", link: "https://ohnurse-43369.web.app/" },
        { text: "Timesheet", link: "timesheet.html" }
      ]
    }
  ];

  const groupStorageKey = 'cep-header-last-group-v1';
  const usageStorageKey = 'cep-header-link-use-v1';
  let linkUsage = {};
  try { linkUsage = JSON.parse(localStorage.getItem(usageStorageKey) || '{}') || {}; } catch {}
  let currentGroup = Math.max(0, Math.min(menuGroups.length, Number(localStorage.getItem(groupStorageKey)) || 0));

  const linkKey = item => item.link.toLocaleLowerCase();
  const allMenuLinks = () => menuGroups.flatMap(group => group.links);
  function frequentLinks() {
    const ranked = allMenuLinks().filter(item => linkUsage[linkKey(item)])
      .sort((a, b) => (linkUsage[linkKey(b)]?.count || 0) - (linkUsage[linkKey(a)]?.count || 0));
    return (ranked.length ? ranked : [
      { text: 'Nurse Notes', link: 'PN.html' }, { text: 'Info', link: 'info.html' },
      { text: 'Xgpt', link: 'chatgptx.html' }, { text: 'Clinical Notes', link: 'Clinicalnotes.html' }
    ]).slice(0, 7);
  }
  function visibleGroups() {
    return [{ name: '★ Frequent', links: frequentLinks() }, ...menuGroups];
  }
  function recordLinkUse(item) {
    const key = linkKey(item); const previous = linkUsage[key] || {};
    linkUsage[key] = { count: (previous.count || 0) + 1, last: Date.now() };
    try { localStorage.setItem(usageStorageKey, JSON.stringify(linkUsage)); } catch {}
  }

  function buildMenu() {
    menuContainer.innerHTML = "";

    const groups = visibleGroups();
    const group = groups[currentGroup] || groups[0];

    const pill = document.createElement("div");
    pill.className = "glass-pill-menu";

    const tabs = document.createElement('div');
    tabs.className = 'glass-pill-tabs';
    tabs.setAttribute('role', 'tablist');
    groups.forEach((candidate, index) => {
      const tab = document.createElement('button');
      tab.type = 'button'; tab.className = 'glass-pill-tab'; tab.textContent = candidate.name;
      tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', String(index === currentGroup));
      if (index === currentGroup) tab.classList.add('is-active');
      tab.addEventListener('click', event => {
        event.stopPropagation(); currentGroup = index;
        try { localStorage.setItem(groupStorageKey, String(index)); } catch {}
        buildMenu();
      });
      tabs.appendChild(tab);
    });
    const links = document.createElement('div');
    links.className = 'glass-pill-links';
    pill.append(tabs, links);

    group.links.forEach((item) => {
      const link = document.createElement("a");
      link.className = "glass-pill-link";
      link.href = item.link;
      const external = /^https?:\/\//i.test(item.link) && new URL(item.link, location.href).origin !== location.origin;
      link.textContent = `${item.text}${external ? ' ↗' : ''}`;
      const destination = new URL(item.link, location.href);
      if (destination.pathname.toLocaleLowerCase() === location.pathname.toLocaleLowerCase()) {
        link.classList.add('active'); link.setAttribute('aria-current', 'page');
      }
      link.addEventListener('click', () => recordLinkUse(item));
      links.appendChild(link);
    });

    menuContainer.appendChild(pill);

    requestAnimationFrame(() => {
      pill.classList.add("show");
    });

  }

  function showMenu() {
    centerToggle.classList.add("active");
    toggleIcon.classList.add("active");
    buildMenu();
  }

  function hideMenu() {
    const pill = menuContainer.querySelector(".glass-pill-menu");

    if (pill) {
      pill.classList.remove("show");

      setTimeout(() => {
        menuContainer.innerHTML = "";
      }, 180);
    }

    centerToggle.classList.remove("active");
    toggleIcon.classList.remove("active");
  }

  toggleIcon.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = centerToggle.classList.contains("active");

    if (isOpen) hideMenu();
    else showMenu();
  });

  toggleIcon.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault(); toggleIcon.click();
  });

  document.addEventListener("click", (e) => {
    if (!centerToggle.contains(e.target)) {
      hideMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") return;
    event.preventDefault();
    hideMenu();
    openEmbeddedSearch();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && searchOverlay) closeEmbeddedSearch();
    else if (event.key === 'Escape' && centerToggle.classList.contains('active')) hideMenu();
    if (!centerToggle.classList.contains('active') || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    const links = [...menuContainer.querySelectorAll('.glass-pill-link')];
    if (!links.length) return;
    event.preventDefault();
    const activeIndex = links.indexOf(document.activeElement);
    links[(activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + links.length) % links.length].focus();
  });
})();
