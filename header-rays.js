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

  let headerHomeButton = centerToggle.querySelector('.header-search-trigger');
  if (!headerHomeButton) {
    headerHomeButton = document.createElement('button');
    headerHomeButton.type = 'button';
    headerHomeButton.className = 'header-search-trigger header-home-trigger';
    headerHomeButton.innerHTML = '';
    headerHomeButton.setAttribute('aria-label', 'Go to Home');
    headerHomeButton.title = 'Home';
    centerToggle.appendChild(headerHomeButton);
  }
  // The Home shortcut matches the menu/rays control.
  const searchIcon=document.createElementNS('http://www.w3.org/2000/svg','svg');
  searchIcon.setAttribute('viewBox','0 0 24 24');searchIcon.setAttribute('aria-hidden','true');
  searchIcon.innerHTML='<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>';
  for(const [name,value] of Object.entries({display:'block',width:'72%',height:'72%',fill:'none',stroke:'currentColor','stroke-width':'1.9','stroke-linecap':'round','pointer-events':'none'}))searchIcon.style.setProperty(name,value,'important');
  headerHomeButton.replaceChildren(searchIcon);
  function matchSearchToMenu(){
    const menuStyle=getComputedStyle(toggleIcon);
    for(const name of ['background','border','border-radius','box-shadow','width','height','animation'])headerHomeButton.style.setProperty(name,menuStyle.getPropertyValue(name),'important');
    for(const [name,value] of Object.entries({display:'grid','place-items':'center',padding:'0','box-sizing':'border-box',color:'var(--theme-ink,var(--page-header-ink,#303632))','-webkit-text-fill-color':'currentColor','min-width':'0','min-height':'0',filter:'none'}))headerHomeButton.style.setProperty(name,value,'important');
  }
  let searchStyleFrame;
  const scheduleSearchStyle=()=>{cancelAnimationFrame(searchStyleFrame);searchStyleFrame=requestAnimationFrame(matchSearchToMenu);};
  matchSearchToMenu();scheduleSearchStyle();
  new MutationObserver(scheduleSearchStyle).observe(document.documentElement,{attributes:true,attributeFilter:['data-xlyneve-color-theme','style','class']});
  window.addEventListener('cep-theme-css-ready',scheduleSearchStyle);
  window.addEventListener('load',scheduleSearchStyle,{once:true});
  window.addEventListener('resize',scheduleSearchStyle,{passive:true});
  headerHomeButton.addEventListener('click', event => {
    event.stopPropagation();
    hideMenu();
    location.assign(new URL('home.html',location.href).href);
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

  document.addEventListener("keydown", event => {
    if (event.key === 'Escape' && centerToggle.classList.contains('active')) hideMenu();
    if (!centerToggle.classList.contains('active') || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    const links = [...menuContainer.querySelectorAll('.glass-pill-link')];
    if (!links.length) return;
    event.preventDefault();
    const activeIndex = links.indexOf(document.activeElement);
    links[(activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + links.length) % links.length].focus();
  });
})();
