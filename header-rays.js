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

  const basePath = "https://xlyneve.github.io/CEP/";

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
         { text: "Clinical Notes", link: "https://xlyneve.github.io/CEP/Clinicalnotes.html" }
      ]
    },
    {
      name: "Clinical",
      links: [
        { text: "Links", link: "https://xlyneve.github.io/CEP/forms.html" },
        { text: "Drug Calc", link: "OHcalc.html" },
         { text: "Vaccines", link: "complete-vaccine-info.html" },
        { text: "Vaccine Calc", link: "vaccine-spacing.html" },
        { text: "Meds", link: "Npres.html" },
         { text: "Consult", link: "https://xlyneve.github.io/CEP/RNCNP.html" }
      ]
    },
    {
      name: "Admin",
      links: [
        { text: "Roster", link: "https://xlyneve.github.io/OHNRoster/" },
        { text: "Notes", link: "https://xlyneve.github.io/CEP/Notes.html" },
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

    group.links.forEach((item) => {
      const link = document.createElement("a");
      link.className = "glass-pill-link";
      link.href = item.link.startsWith("http") ? item.link : basePath + item.link;
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
})();
