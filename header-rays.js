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

  const warmSearch = () => {
    Promise.resolve(window.CEP_AUTH_READY).then(authorized => {
      if (!authorized) return;
      import("./universal-search-overlay.js?v=4")
        .then(module => module.preloadUniversalSearch?.())
        .catch(error => console.warn("Universal Search preload was skipped.", error));
    });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(warmSearch, { timeout: 1400 });
  else setTimeout(warmSearch, 250);

  let searchOverlay = null;

  function closeEmbeddedSearch() {
    if (!searchOverlay) return;
    const closingOverlay = searchOverlay;
    searchOverlay = null;
    closingOverlay.classList.remove("is-open");
    document.body.classList.remove("cep-search-overlay-open");
    setTimeout(() => closingOverlay.remove(), 180);
  }

  async function openEmbeddedSearch() {
    if (typeof window.openCepUniversalSearch === "function") {
      window.openCepUniversalSearch();
      return;
    }
    if (searchOverlay) return searchOverlay.querySelector("input")?.focus();
    const overlay = document.createElement("div");
    overlay.className = "cep-search-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Search all Xlyneve notes and pages");
    const host = document.createElement("div");
    host.className = "cep-search-overlay-host";
    host.textContent = "Opening Search…";
    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeEmbeddedSearch();
    });
    overlay.append(host);
    document.body.appendChild(overlay);
    document.body.classList.add("cep-search-overlay-open");
    searchOverlay = overlay;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    try {
      const { mountUniversalSearch } = await import("./universal-search-overlay.js?v=4");
      if (searchOverlay !== overlay) return;
      await mountUniversalSearch(host, closeEmbeddedSearch);
    } catch (error) {
      console.error("Universal Search could not open.", error);
      host.textContent = "Search could not be opened. Please try again.";
    }
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
        { text: "Roster", link: "https://xlyneve.github.io/OHNRoster/" },
        { text: "Notes", link: "Notes.html" },
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
