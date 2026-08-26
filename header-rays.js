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
      const { mountUniversalSearch } = await import("./universal-search-overlay.js?v=1");
      if (searchOverlay !== overlay) return;
      await mountUniversalSearch(host, closeEmbeddedSearch);
    } catch (error) {
      console.error("Universal Search could not open.", error);
      host.textContent = "Search could not be opened. Please try again.";
    }
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

  let currentGroup = 0;

  function buildMenu() {
    menuContainer.innerHTML = "";

    const group = menuGroups[currentGroup];

    const pill = document.createElement("div");
    pill.className = "glass-pill-menu";

    const groupLabel = document.createElement("div");
    groupLabel.className = "glass-pill-label";
    groupLabel.textContent = group.name;
    pill.appendChild(groupLabel);

    const searchLink = document.createElement("a");
    searchLink.className = "glass-pill-link glass-pill-search";
    searchLink.href = "home.html#cepSearch=open";
    searchLink.textContent = "🔎 Search";
    searchLink.setAttribute("aria-label", "Search all Xlyneve notes and pages");
    searchLink.title = "Search all notes and pages (Ctrl/⌘ K)";
    searchLink.addEventListener("click", (event) => {
      event.preventDefault();
      hideMenu();
      openEmbeddedSearch();
    });
    pill.appendChild(searchLink);

    group.links.forEach((item) => {
      const link = document.createElement("a");
      link.className = "glass-pill-link";
      link.href = item.link;
      link.textContent = item.text;
      pill.appendChild(link);
    });

    menuContainer.appendChild(pill);

    requestAnimationFrame(() => {
      pill.classList.add("show");
    });

    currentGroup = (currentGroup + 1) % menuGroups.length;
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

    if (isOpen) {
      buildMenu();
    } else {
      showMenu();
    }
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
  });
})();
