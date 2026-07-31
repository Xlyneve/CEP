(() => {
  const destinations = [
    { file: "home.html", label: "Home", icon: "🏠" },
    { file: "face.html", label: "Head / Face", icon: "💀" },
    { file: "Hand.html", label: "Hand / Wrist", icon: "🖐🏼" },
    { file: "Sha.html", label: "Shoulder / Elbow", icon: "💪🏻" },
    { file: "Abdo.html", label: "Thorax / Abdomen", icon: "🧘🏻‍♀️" },
    { file: "Spine.html", label: "Back / Spine", icon: "🦴" },
    { file: "LF.html", label: "Lower Limb / Foot", icon: "🦵🏻" },
    { file: "Urgent_Care.html", label: "Urgent Care", icon: "⏳" }
  ];

  const renderNavigation = () => {
    document.getElementById("homeMenu")?.remove();
    document.getElementById("homeMenuOverlay")?.remove();

    const currentFile =
      window.location.pathname.split("/").pop().toLowerCase() || "home.html";
    const nav = document.createElement("nav");
    nav.className = "urgent-care-nav";
    nav.setAttribute("aria-label", "Urgent Care sections");

    destinations.forEach(({ file, label, icon }) => {
      const link = document.createElement("a");
      link.className = "urgent-care-nav__link";
      link.href = file;
      link.title = label;
      link.setAttribute("aria-label", label);
      link.textContent = icon;

      if (file.toLowerCase() === currentFile) {
        link.setAttribute("aria-current", "page");
      }

      nav.appendChild(link);
    });

    document.body.prepend(nav);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderNavigation);
  } else {
    renderNavigation();
  }
})();
