(function () {
  "use strict";

  const originalPalette = [
    { rgb: "229, 203, 204", solid: "#e5cbcc", ink: "#39190f" },
    { rgb: "211, 224, 223", solid: "#d3e0df", ink: "#39190f" },
    { rgb: "225, 226, 195", solid: "#e1e2c3", ink: "#39190f" },
    { rgb: "239, 237, 232", solid: "#efede8", ink: "#39190f" },
    { rgb: "219, 158, 131", solid: "#db9e83", ink: "#39190f" },
  ];

  const berryPalette = [
    { rgb: "104, 0, 68", solid: "#680044", ink: "#ffffff" },
    { rgb: "232, 101, 152", solid: "#e86598", ink: "#303039" },
    { rgb: "217, 190, 220", solid: "#d9bedc", ink: "#303039" },
    { rgb: "255, 253, 252", solid: "#fffdfc", ink: "#303039" },
    { rgb: "255, 184, 46", solid: "#ffb82e", ink: "#303039" },
  ];

  const autumnPalette = [
    { rgb: "215, 190, 196", solid: "#d7bec4", ink: "#253f46" },
    { rgb: "239, 234, 238", solid: "#efeaee", ink: "#253f46" },
    { rgb: "169, 168, 176", solid: "#a9a8b0", ink: "#253f46" },
    { rgb: "146, 166, 167", solid: "#92a6a7", ink: "#253f46" },
    { rgb: "37, 87, 101", solid: "#255765", ink: "#ffffff" },
  ];

  const hoyaPalette = [
    { rgb: "248, 229, 221", solid: "#f8e5dd", ink: "#334b50" },
    { rgb: "139, 148, 102", solid: "#8b9466", ink: "#ffffff" },
    { rgb: "218, 162, 62", solid: "#daa23e", ink: "#334b50" },
    { rgb: "64, 88, 92", solid: "#40585c", ink: "#ffffff" },
    { rgb: "216, 215, 197", solid: "#d8d7c5", ink: "#334b50" },
  ];

  const lakeMistPalette = [
    { rgb: "191, 198, 198", solid: "#bfc6c6", ink: "#443d35" },
    { rgb: "243, 242, 237", solid: "#f3f2ed", ink: "#443d35" },
    { rgb: "219, 202, 208", solid: "#dbcad0", ink: "#443d35" },
    { rgb: "68, 61, 53", solid: "#443d35", ink: "#ffffff" },
    { rgb: "214, 207, 202", solid: "#d6cfca", ink: "#443d35" },
    { rgb: "162, 172, 158", solid: "#a2ac9e", ink: "#443d35" },
  ];

  const palmSpringsPalette = [
    { rgb: "31, 44, 44", solid: "#1f2c2c", ink: "#ffffff" },
    { rgb: "198, 160, 168", solid: "#c6a0a8", ink: "#263333" },
    { rgb: "189, 164, 135", solid: "#bda487", ink: "#263333" },
    { rgb: "241, 231, 227", solid: "#f1e7e3", ink: "#263333" },
    { rgb: "251, 248, 245", solid: "#fbf8f5", ink: "#263333" },
  ];

  const quietStonePalette = [
    { rgb: "57, 56, 49", solid: "#393831", ink: "#ffffff" },
    { rgb: "234, 234, 234", solid: "#eaeaea", ink: "#393831" },
    { rgb: "184, 174, 168", solid: "#b8aea8", ink: "#393831" },
    { rgb: "220, 207, 193", solid: "#dccfc1", ink: "#393831" },
    { rgb: "240, 239, 230", solid: "#f0efe6", ink: "#393831" },
    { rgb: "198, 201, 210", solid: "#c6c9d2", ink: "#393831" },
  ];

  const anatomyPalette = [
    { rgb: "250, 242, 232", solid: "#faf2e8", ink: "#22211f" },
    { rgb: "34, 33, 31", solid: "#22211f", ink: "#ffffff" },
    { rgb: "170, 162, 151", solid: "#aaa297", ink: "#22211f" },
    { rgb: "246, 182, 63", solid: "#f6b63f", ink: "#22211f" },
    { rgb: "232, 220, 205", solid: "#e8dccd", ink: "#22211f" },
  ];

  const sculptedPalette = [
    { rgb: "243, 235, 225", solid: "#f3ebe1", ink: "#313b3a" },
    { rgb: "168, 205, 210", solid: "#a8cdd2", ink: "#263535" },
    { rgb: "174, 198, 181", solid: "#aec6b5", ink: "#263535" },
    { rgb: "224, 199, 190", solid: "#e0c7be", ink: "#313b3a" },
    { rgb: "225, 211, 180", solid: "#e1d3b4", ink: "#313b3a" },
  ];

  const themeStorageKey = "xlyneve-color-theme";
  const excludedThemePages = new Set(["biosched1.html", "notes.html", "recalltracker.html"]);

  const pageName = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const themeIsAllowed = !excludedThemePages.has(pageName);
  let selectedTheme = "original";
  if (themeIsAllowed) {
    try {
      const storedTheme = localStorage.getItem(themeStorageKey);
      if (storedTheme === "berry" || storedTheme === "autumn" || storedTheme === "hoya" || storedTheme === "lake-mist" || storedTheme === "palm-springs" || storedTheme === "quiet-stone" || storedTheme === "anatomy" || storedTheme === "sculpted") selectedTheme = storedTheme;
    } catch {}
  }
  const palette = selectedTheme === "berry"
    ? berryPalette
    : selectedTheme === "autumn"
      ? autumnPalette
      : selectedTheme === "hoya"
        ? hoyaPalette
        : selectedTheme === "lake-mist"
          ? lakeMistPalette
          : selectedTheme === "palm-springs"
            ? palmSpringsPalette
            : selectedTheme === "quiet-stone"
              ? quietStonePalette
              : selectedTheme === "anatomy"
                ? anatomyPalette
                : selectedTheme === "sculpted"
                  ? sculptedPalette
      : originalPalette;

  function hash(text) {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  const pageColor = palette[hash(pageName) % palette.length];
  const root = document.documentElement;
  if (selectedTheme !== "original") root.dataset.xlyneveColorTheme = selectedTheme;
  root.style.setProperty("--page-header-glass", `rgba(${pageColor.rgb}, 0.78)`);
  root.style.setProperty("--page-header-solid", pageColor.solid);
  root.style.setProperty("--page-header-ink", pageColor.ink);
  const mastheadBarColors = {
    original: "#596b57",
    berry: "#680044",
    autumn: "#255765",
    hoya: "#40585c",
    "lake-mist": "#443d35",
    "palm-springs": "#1f2c2c",
    "quiet-stone": "#393831",
    anatomy: "#22211f",
    sculpted: "#5f8889"
  };
  root.style.setProperty("--masthead-bar", mastheadBarColors[selectedTheme]);
  root.style.setProperty("--masthead-bar-ink", "#ffffff");

  const themeStyle = document.createElement("style");
  themeStyle.id = "xlyneve-color-theme-styles";
  themeStyle.textContent = `
    html[data-xlyneve-color-theme="berry"] {
      --refresh-cocoa: #303039;
      --refresh-rose: #e86598;
      --refresh-lime: #d9bedc;
      --refresh-stone: #fffdfc;
      --refresh-blue: #d9bedc;
      --refresh-terracotta: #ffb82e;
      --refresh-edge: rgba(255, 255, 255, 0.8);
      --refresh-depth: 0 12px 30px rgba(104, 0, 68, 0.12);
      --theme-ink: #303039;
      --quick-panel: linear-gradient(145deg, rgba(255,253,252,.96), rgba(217,190,220,.9));
      --quick-ink: #303039;
      --quick-accent: #680044;
      --quick-accent-ink: #ffffff;
      --quick-soft: rgba(232,101,152,.2);
      --quick-field: rgba(255,253,252,.78);
      --quick-edge: rgba(232,101,152,.42);
      --copy-feedback-accent: #ffb82e;
      --copy-feedback-soft: rgba(232,101,152,.38);
      --clinical-panel: rgba(217,190,220,.86);
      --clinical-field: rgba(255,253,252,.78);
      --clinical-accent: #680044;
      --clinical-accent-ink: #ffffff;
      --clinical-edge: rgba(232,101,152,.46);
      --homecal-header: linear-gradient(135deg, rgba(104,0,68,.82), rgba(232,101,152,.72));
      --homecal-header-ink: #ffffff;
      --homecal-control: rgba(255,253,252,.82);
      --homecal-control-ink: #303039;
      --homecal-header-edge: rgba(255,184,46,.48);
      --homecal-today: linear-gradient(145deg,rgba(255,253,252,.96),rgba(217,190,220,.88));
      --homecal-today-edge: rgba(232,101,152,.5);
      --homecal-today-shadow: rgba(104,0,68,.16);
    }

    html[data-xlyneve-color-theme="berry"],
    html[data-xlyneve-color-theme="berry"] body {
      color: #303039;
      background-color: #f8f0ed !important;
      background-image:
        radial-gradient(circle at 15% 12%, rgba(255, 253, 252, 0.96), transparent 34%),
        radial-gradient(circle at 84% 20%, rgba(232, 101, 152, 0.16), transparent 38%),
        radial-gradient(circle at 22% 84%, rgba(217, 190, 220, 0.24), transparent 36%),
        linear-gradient(180deg, #fffdfc 0%, #f8f0ed 56%, #f2e5e5 100%) !important;
      background-attachment: fixed !important;
    }

    html[data-xlyneve-color-theme="berry"] body::before {
      opacity: 0.08 !important;
      filter: sepia(.16) hue-rotate(286deg) saturate(1.18);
    }

    html[data-xlyneve-color-theme="berry"] :is(
      .note-card, .card, .acc-item, .med-section, .vaccine-section,
      .vaccine-card, .calculator, .result, .table-mini,
      .private-note-editor, .editable-checklist,
      .day:not(.empty):not(.today), .todo-item:not(.priority)
    ) {
      color: var(--card-ink, #303039) !important;
      -webkit-text-fill-color: var(--card-ink, #303039);
      background: var(--card-glass, rgba(255, 253, 252, 0.76)) !important;
      background-image: none !important;
      border-color: rgba(255, 255, 255, 0.82) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        0 12px 28px rgba(104, 0, 68, 0.11) !important;
    }

    html[data-xlyneve-color-theme="berry"] body > header,
    html[data-xlyneve-color-theme="berry"] :is(.header, .header-bg, .topbar, .top-bar, .app-header, .page-header) {
      color: var(--page-header-ink, #303039) !important;
      background-color: var(--page-header-glass, rgba(232, 101, 152, 0.48)) !important;
      border-color: rgba(255, 255, 255, 0.82) !important;
      box-shadow: 0 12px 30px rgba(104, 0, 68, 0.1) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .section-admin {
      --section-glass: rgba(104, 0, 68, 0.78);
      --section-glass-hover: rgba(104, 0, 68, 0.88);
      --section-shadow: rgba(104, 0, 68, 0.2);
      --section-shadow-hover: rgba(104, 0, 68, 0.28);
    }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .section-home {
      --section-glass: rgba(217, 190, 220, 0.68);
      --section-glass-hover: rgba(217, 190, 220, 0.8);
      --section-shadow: rgba(104, 0, 68, 0.12);
      --section-shadow-hover: rgba(104, 0, 68, 0.2);
    }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .section-notes {
      --section-glass: rgba(232, 101, 152, 0.58);
      --section-glass-hover: rgba(232, 101, 152, 0.7);
      --section-shadow: rgba(104, 0, 68, 0.12);
      --section-shadow-hover: rgba(104, 0, 68, 0.2);
    }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .section-prescribing {
      --section-glass: rgba(255, 184, 46, 0.64);
      --section-glass-hover: rgba(255, 184, 46, 0.76);
      --section-shadow: rgba(104, 0, 68, 0.1);
      --section-shadow-hover: rgba(104, 0, 68, 0.18);
    }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .section-urgent {
      --section-glass: rgba(255, 253, 252, 0.76);
      --section-glass-hover: rgba(255, 253, 252, 0.9);
      --section-shadow: rgba(48, 48, 57, 0.1);
      --section-shadow-hover: rgba(48, 48, 57, 0.16);
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .main-content .card-group.section-card-group > .card {
      background: var(--section-glass) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .main-content .card-group.section-card-group > .card:hover {
      background: var(--section-glass-hover) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .main-content .section-admin > .card {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
    }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .main-content :is(.section-home, .section-notes, .section-prescribing, .section-urgent) > .card {
      color: #303039 !important;
      -webkit-text-fill-color: #303039 !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .top-links a {
      color: #303039 !important;
      background: rgba(255, 253, 252, 0.78) !important;
      border-color: rgba(217, 190, 220, 0.72) !important;
      box-shadow: 0 5px 14px rgba(104, 0, 68, 0.09) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 1) { background: rgba(104, 0, 68, .9) !important; color: #fff !important; }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 2) { background: rgba(232, 101, 152, .82) !important; color: #303039 !important; }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 3) { background: rgba(217, 190, 220, .82) !important; color: #303039 !important; }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 4) { background: rgba(255, 184, 46, .86) !important; color: #303039 !important; }
    html[data-xlyneve-color-theme="berry"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 5) { background: rgba(255, 253, 252, .9) !important; color: #303039 !important; }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search {
      color: #303039 !important;
      background: rgba(255, 253, 252, 0.96) !important;
      background-image:
        radial-gradient(circle at 92% 5%, rgba(232, 101, 152, 0.18), transparent 34%),
        linear-gradient(145deg, rgba(255,253,252,.98), rgba(217,190,220,.34)) !important;
      border-color: rgba(217, 190, 220, 0.9) !important;
      box-shadow: 0 22px 58px rgba(104, 0, 68, 0.22) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass #universalSearchInput {
      color: #303039 !important;
      -webkit-text-fill-color: #303039 !important;
      background: rgba(255, 253, 252, 0.94) !important;
      border-color: rgba(104, 0, 68, 0.2) !important;
      box-shadow: inset 0 1px 2px rgba(104, 0, 68, 0.06) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass #universalSearchInput:focus {
      border-color: rgba(232, 101, 152, 0.76) !important;
      box-shadow: 0 0 0 3px rgba(232, 101, 152, 0.18) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass :is(
      .universal-search-close,
      .universal-search-mode,
      .universal-search-filter
    ) {
      color: #303039 !important;
      background: rgba(255, 253, 252, 0.84) !important;
      border-color: rgba(217, 190, 220, 0.78) !important;
      box-shadow: 0 4px 11px rgba(104, 0, 68, 0.07) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass :is(
      .universal-search-mode.is-active,
      .universal-search-filter.is-active
    ) {
      color: #ffffff !important;
      background: rgba(104, 0, 68, 0.9) !important;
      border-color: transparent !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search-status {
      color: rgba(48, 48, 57, 0.76) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search-source-title {
      color: #680044 !important;
      -webkit-text-fill-color: #680044 !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search-native-card,
    html[data-xlyneve-color-theme="berry"].theme-home-glass .xgpt-header-style .universal-search-native-card {
      color: #303039 !important;
      -webkit-text-fill-color: #303039 !important;
      background: rgba(217, 190, 220, 0.42) !important;
      border-color: rgba(255, 255, 255, 0.88) !important;
      box-shadow: 0 8px 22px rgba(104, 0, 68, 0.1) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search-result-group:nth-child(even) .universal-search-native-card {
      background: rgba(232, 101, 152, 0.2) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass :is(
      .universal-search-native-snippet,
      .xgpt-header-style .universal-search-native-snippet
    ) {
      color: #303039 !important;
      -webkit-text-fill-color: #303039 !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search-results::-webkit-scrollbar-thumb {
      background: rgba(104, 0, 68, 0.42) !important;
    }

    html[data-xlyneve-color-theme="berry"] .cep-global-search-panel {
      color: #303039 !important;
      background: rgba(255, 253, 252, 0.97) !important;
      background-image: radial-gradient(circle at 92% 5%, rgba(232, 101, 152, 0.2), transparent 34%), linear-gradient(145deg, rgba(255,253,252,.98), rgba(217,190,220,.34)) !important;
      border-color: rgba(217, 190, 220, 0.9) !important;
      box-shadow: 0 22px 58px rgba(104, 0, 68, 0.2) !important;
    }
    html[data-xlyneve-color-theme="berry"] body.cep-search-overlay-open .cep-search-overlay .cep-search-overlay-host .cep-global-search-panel .cep-global-search-row input[type="search"] {
      color: #303039 !important;
      -webkit-text-fill-color: #303039 !important;
      background: rgba(255, 253, 252, 0.94) !important;
      background-color: rgba(255, 253, 252, 0.94) !important;
      border-color: rgba(232, 101, 152, 0.42) !important;
    }
    html[data-xlyneve-color-theme="berry"] body.cep-search-overlay-open .cep-search-overlay .cep-search-overlay-host .cep-global-search-panel .cep-global-search-row input[type="search"]:focus {
      border-color: rgba(232, 101, 152, 0.76) !important;
      box-shadow: 0 0 0 3px rgba(232, 101, 152, 0.2) !important;
    }
    html[data-xlyneve-color-theme="berry"] :is(.cep-global-search-row button, .cep-global-search-modes button, .cep-global-search-filters button) {
      color: #303039 !important;
      background: rgba(255, 253, 252, 0.78) !important;
      border-color: rgba(217, 190, 220, 0.74) !important;
    }
    html[data-xlyneve-color-theme="berry"] :is(.cep-global-search-modes button.is-active, .cep-global-search-filters button.is-active) {
      color: #ffffff !important;
      background: rgba(104, 0, 68, 0.9) !important;
      border-color: transparent !important;
    }
    html[data-xlyneve-color-theme="berry"] .cep-global-search-status { color: rgba(48, 48, 57, 0.76) !important; }
    html[data-xlyneve-color-theme="berry"] .cep-global-search-group-title { color: #680044 !important; }
    html[data-xlyneve-color-theme="berry"] :is(.cep-global-search-result, .cep-concept-search-result) {
      color: #303039 !important;
      -webkit-text-fill-color: #303039 !important;
      background: rgba(217, 190, 220, 0.42) !important;
      border-color: rgba(255, 255, 255, 0.88) !important;
      box-shadow: 0 8px 22px rgba(104, 0, 68, 0.1) !important;
    }
    html[data-xlyneve-color-theme="berry"] :is(.cep-global-search-result, .cep-concept-search-result) :is(mark, .cep-search-match) {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search-native-table :is(td, th) {
      color: #303039 !important;
      background: rgba(255, 253, 252, 0.76) !important;
      border-color: rgba(104, 0, 68, 0.16) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search-native-table th,
    html[data-xlyneve-color-theme="berry"].theme-home-glass .universal-search-native-table thead td {
      background: rgba(232, 101, 152, 0.34) !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-homecal .todo-item.done {
      color: #777980 !important;
      -webkit-text-fill-color: #777980 !important;
      background: rgba(190, 192, 197, 0.52) !important;
      background-image: none !important;
      border-color: rgba(255, 255, 255, 0.76) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        0 6px 15px rgba(48, 48, 57, 0.08) !important;
      filter: saturate(0.2);
    }

    html[data-xlyneve-color-theme="berry"].theme-homecal .todo-item.done textarea,
    html[data-xlyneve-color-theme="berry"].theme-homecal .todo-item.done input[type="text"],
    html[data-xlyneve-color-theme="berry"].theme-homecal .todo-item.done > div:last-child {
      color: #777980 !important;
      -webkit-text-fill-color: #777980 !important;
    }

    html[data-xlyneve-color-theme="berry"].theme-homecal .todo-item.done input[type="checkbox"] {
      accent-color: #777980;
      filter: grayscale(1);
    }

    html[data-xlyneve-color-theme="berry"] :is(
      .gradient-highlight,
      .highlight-gradient,
      .note-gradient-highlight,
      mark.highlight-hue,
      .note-text mark,
      .edit-note mark,
      .universal-search-native-snippet mark,
      .cep-search-match,
      .search-highlight
    ) {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }

    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) {
      background: radial-gradient(circle at 0 100%, rgba(232, 101, 152, 0.36), transparent 44%), radial-gradient(circle at 100% 100%, rgba(217, 190, 220, 0.72), transparent 48%), linear-gradient(145deg, #fffdfc 0%, #f7eaf1 100%) !important;
    }
    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) main {
      background: rgba(255, 253, 252, 0.84) !important;
      border-color: rgba(255, 255, 255, 0.94) !important;
      box-shadow: 0 18px 45px rgba(104, 0, 68, 0.16), 0 3px 10px rgba(48, 48, 57, 0.08) !important;
    }
    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) .note-card { background: rgba(255, 253, 252, 0.9) !important; }
    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) .notepad {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
      caret-color: #680044 !important;
      background: linear-gradient(rgba(255,253,252,.94), rgba(255,253,252,.94)) padding-box, repeating-linear-gradient(to bottom, transparent 0, transparent 26px, rgba(232,101,152,.2) 27px) !important;
    }
    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) .timestamp { color: rgba(104, 0, 68, 0.42) !important; }
    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) .dot-add { background: #e86598 !important; }
    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) .dot-yellow { background: #ffb82e !important; }
    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) .dot-purple { background: #d9bedc !important; }
    html[data-xlyneve-color-theme="berry"] body:has(.notes .notepad) :is(.pad-open-options button, .open-status, .open-options-menu) {
      color: #303039 !important;
      background: rgba(255, 253, 252, 0.94) !important;
      border-color: rgba(217, 190, 220, 0.86) !important;
    }

    html[data-xlyneve-color-theme="autumn"] {
      --refresh-cocoa: #253f46;
      --refresh-rose: #d7bec4;
      --refresh-lime: #92a6a7;
      --refresh-stone: #efeaee;
      --refresh-blue: #92a6a7;
      --refresh-terracotta: #a9a8b0;
      --refresh-edge: rgba(255, 255, 255, 0.82);
      --refresh-depth: 0 12px 30px rgba(37, 87, 101, 0.12);
      --theme-ink: #253f46;
      --quick-panel: linear-gradient(145deg, rgba(248,246,246,.96), rgba(146,166,167,.58));
      --quick-ink: #253f46;
      --quick-accent: #255765;
      --quick-accent-ink: #ffffff;
      --quick-soft: rgba(215,190,196,.42);
      --quick-field: rgba(255,255,255,.76);
      --quick-edge: rgba(146,166,167,.62);
      --copy-feedback-accent: #255765;
      --copy-feedback-soft: rgba(215,190,196,.56);
      --clinical-panel: rgba(146,166,167,.78);
      --clinical-field: rgba(248,246,246,.8);
      --clinical-accent: #255765;
      --clinical-accent-ink: #ffffff;
      --clinical-edge: rgba(37,87,101,.38);
      --homecal-header: linear-gradient(135deg, rgba(215,190,196,.88), rgba(146,166,167,.82));
      --homecal-header-ink: #253f46;
      --homecal-control: rgba(248,246,246,.78);
      --homecal-control-ink: #253f46;
      --homecal-header-edge: rgba(37,87,101,.34);
      --homecal-today: linear-gradient(145deg,rgba(239,234,238,.96),rgba(215,190,196,.88));
      --homecal-today-edge: rgba(146,166,167,.6);
      --homecal-today-shadow: rgba(37,87,101,.15);
    }

    html[data-xlyneve-color-theme="autumn"],
    html[data-xlyneve-color-theme="autumn"] body {
      color: #253f46;
      background-color: #f6f3f2 !important;
      background-image:
        radial-gradient(circle at 16% 10%, rgba(255, 255, 255, 0.98), transparent 34%),
        radial-gradient(circle at 82% 18%, rgba(215, 190, 196, 0.2), transparent 38%),
        radial-gradient(circle at 24% 84%, rgba(146, 166, 167, 0.22), transparent 38%),
        linear-gradient(180deg, #fbfaf9 0%, #f3efef 56%, #e8eded 100%) !important;
      background-attachment: fixed !important;
    }

    html[data-xlyneve-color-theme="autumn"] body::before {
      opacity: 0.07 !important;
      filter: grayscale(.18) sepia(.08) hue-rotate(135deg) saturate(.76);
    }

    html[data-xlyneve-color-theme="autumn"] :is(
      .note-card, .card, .acc-item, .med-section, .vaccine-section,
      .vaccine-card, .calculator, .result, .table-mini,
      .private-note-editor, .editable-checklist,
      .day:not(.empty):not(.today), .todo-item:not(.priority)
    ) {
      color: var(--card-ink, #253f46) !important;
      -webkit-text-fill-color: var(--card-ink, #253f46);
      background: var(--card-glass, rgba(239, 234, 238, 0.76)) !important;
      background-image: none !important;
      border-color: rgba(255, 255, 255, 0.84) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.92),
        0 12px 28px rgba(37, 87, 101, 0.11) !important;
    }

    html[data-xlyneve-color-theme="autumn"] body > header,
    html[data-xlyneve-color-theme="autumn"] :is(.header, .header-bg, .topbar, .top-bar, .app-header, .page-header) {
      color: var(--page-header-ink, #253f46) !important;
      background-color: var(--page-header-glass, rgba(215, 190, 196, 0.52)) !important;
      border-color: rgba(255, 255, 255, 0.84) !important;
      box-shadow: 0 12px 30px rgba(37, 87, 101, 0.1) !important;
    }

    html[data-xlyneve-color-theme="autumn"].theme-home-glass .section-admin {
      --section-glass: rgba(37, 87, 101, 0.82);
      --section-glass-hover: rgba(37, 87, 101, 0.9);
      --section-shadow: rgba(37, 87, 101, 0.2);
      --section-shadow-hover: rgba(37, 87, 101, 0.28);
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .section-home {
      --section-glass: rgba(146, 166, 167, 0.66);
      --section-glass-hover: rgba(146, 166, 167, 0.78);
      --section-shadow: rgba(37, 87, 101, 0.12);
      --section-shadow-hover: rgba(37, 87, 101, 0.2);
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .section-notes {
      --section-glass: rgba(215, 190, 196, 0.7);
      --section-glass-hover: rgba(215, 190, 196, 0.82);
      --section-shadow: rgba(37, 87, 101, 0.1);
      --section-shadow-hover: rgba(37, 87, 101, 0.18);
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .section-prescribing {
      --section-glass: rgba(169, 168, 176, 0.7);
      --section-glass-hover: rgba(169, 168, 176, 0.82);
      --section-shadow: rgba(37, 87, 101, 0.1);
      --section-shadow-hover: rgba(37, 87, 101, 0.18);
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .section-urgent {
      --section-glass: rgba(239, 234, 238, 0.8);
      --section-glass-hover: rgba(239, 234, 238, 0.92);
      --section-shadow: rgba(37, 87, 101, 0.08);
      --section-shadow-hover: rgba(37, 87, 101, 0.14);
    }

    html[data-xlyneve-color-theme="autumn"].theme-home-glass .main-content .card-group.section-card-group > .card {
      background: var(--section-glass) !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .main-content .card-group.section-card-group > .card:hover {
      background: var(--section-glass-hover) !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .main-content .section-admin > .card {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .main-content :is(.section-home, .section-notes, .section-prescribing, .section-urgent) > .card {
      color: #253f46 !important;
      -webkit-text-fill-color: #253f46 !important;
    }

    html[data-xlyneve-color-theme="autumn"].theme-home-glass .top-links a {
      color: #253f46 !important;
      background: rgba(255, 255, 255, 0.76) !important;
      border-color: rgba(215, 190, 196, 0.72) !important;
      box-shadow: 0 5px 14px rgba(37, 87, 101, 0.08) !important;
    }

    html[data-xlyneve-color-theme="autumn"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 1) { background: rgba(37, 87, 101, .92) !important; color: #fff !important; }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 2) { background: rgba(215, 190, 196, .86) !important; color: #253f46 !important; }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 3) { background: rgba(146, 166, 167, .86) !important; color: #253f46 !important; }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 4) { background: rgba(169, 168, 176, .86) !important; color: #253f46 !important; }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 5) { background: rgba(239, 234, 238, .94) !important; color: #253f46 !important; }

    html[data-xlyneve-color-theme="autumn"].theme-home-glass .universal-search {
      color: #253f46 !important;
      background: rgba(248, 246, 246, 0.97) !important;
      background-image:
        radial-gradient(circle at 92% 5%, rgba(215, 190, 196, 0.24), transparent 34%),
        linear-gradient(145deg, rgba(255,255,255,.98), rgba(146,166,167,.28)) !important;
      border-color: rgba(146, 166, 167, 0.78) !important;
      box-shadow: 0 22px 58px rgba(37, 87, 101, 0.2) !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass #universalSearchInput {
      color: #253f46 !important;
      -webkit-text-fill-color: #253f46 !important;
      background: rgba(255, 255, 255, 0.94) !important;
      border-color: rgba(37, 87, 101, 0.2) !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass #universalSearchInput:focus {
      border-color: rgba(37, 87, 101, 0.68) !important;
      box-shadow: 0 0 0 3px rgba(146, 166, 167, 0.24) !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass :is(.universal-search-close, .universal-search-mode, .universal-search-filter) {
      color: #253f46 !important;
      background: rgba(239, 234, 238, 0.88) !important;
      border-color: rgba(169, 168, 176, 0.62) !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass :is(.universal-search-mode.is-active, .universal-search-filter.is-active) {
      color: #ffffff !important;
      background: rgba(37, 87, 101, 0.92) !important;
      border-color: transparent !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .universal-search-status { color: rgba(37, 63, 70, 0.76) !important; }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .universal-search-source-title {
      color: #255765 !important;
      -webkit-text-fill-color: #255765 !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .universal-search-native-card,
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .xgpt-header-style .universal-search-native-card {
      color: #253f46 !important;
      -webkit-text-fill-color: #253f46 !important;
      background: rgba(215, 190, 196, 0.42) !important;
      border-color: rgba(255, 255, 255, 0.88) !important;
      box-shadow: 0 8px 22px rgba(37, 87, 101, 0.1) !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .universal-search-result-group:nth-child(even) .universal-search-native-card {
      background: rgba(146, 166, 167, 0.3) !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass :is(.universal-search-native-snippet, .xgpt-header-style .universal-search-native-snippet) {
      color: #253f46 !important;
      -webkit-text-fill-color: #253f46 !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-home-glass .universal-search-results::-webkit-scrollbar-thumb {
      background: rgba(37, 87, 101, 0.46) !important;
    }

    html[data-xlyneve-color-theme="autumn"] .cep-global-search-panel {
      color: #253f46 !important;
      background: rgba(248, 246, 246, 0.97) !important;
      background-image: radial-gradient(circle at 92% 5%, rgba(215, 190, 196, 0.24), transparent 34%), linear-gradient(145deg, rgba(255,255,255,.98), rgba(146,166,167,.28)) !important;
      border-color: rgba(146, 166, 167, 0.78) !important;
      box-shadow: 0 22px 58px rgba(37, 87, 101, 0.2) !important;
    }
    html[data-xlyneve-color-theme="autumn"] body.cep-search-overlay-open .cep-search-overlay .cep-search-overlay-host .cep-global-search-panel .cep-global-search-row input[type="search"] {
      color: #253f46 !important;
      -webkit-text-fill-color: #253f46 !important;
      background: rgba(255, 255, 255, 0.94) !important;
      background-color: rgba(255, 255, 255, 0.94) !important;
      border-color: rgba(37, 87, 101, 0.2) !important;
    }
    html[data-xlyneve-color-theme="autumn"] body.cep-search-overlay-open .cep-search-overlay .cep-search-overlay-host .cep-global-search-panel .cep-global-search-row input[type="search"]:focus {
      border-color: rgba(37, 87, 101, 0.68) !important;
      box-shadow: 0 0 0 3px rgba(146, 166, 167, 0.24) !important;
    }
    html[data-xlyneve-color-theme="autumn"] :is(.cep-global-search-row button, .cep-global-search-modes button, .cep-global-search-filters button) {
      color: #253f46 !important;
      background: rgba(239, 234, 238, 0.88) !important;
      border-color: rgba(169, 168, 176, 0.62) !important;
    }
    html[data-xlyneve-color-theme="autumn"] :is(.cep-global-search-modes button.is-active, .cep-global-search-filters button.is-active) {
      color: #ffffff !important;
      background: rgba(37, 87, 101, 0.92) !important;
      border-color: transparent !important;
    }
    html[data-xlyneve-color-theme="autumn"] .cep-global-search-status { color: rgba(37, 63, 70, 0.76) !important; }
    html[data-xlyneve-color-theme="autumn"] .cep-global-search-group-title { color: #255765 !important; }
    html[data-xlyneve-color-theme="autumn"] :is(.cep-global-search-result, .cep-concept-search-result) {
      color: #253f46 !important;
      -webkit-text-fill-color: #253f46 !important;
      background: rgba(215, 190, 196, 0.42) !important;
      border-color: rgba(255, 255, 255, 0.88) !important;
      box-shadow: 0 8px 22px rgba(37, 87, 101, 0.1) !important;
    }
    html[data-xlyneve-color-theme="autumn"] :is(.cep-global-search-result, .cep-concept-search-result) :is(mark, .cep-search-match) {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }

    html[data-xlyneve-color-theme="autumn"].theme-homecal .todo-item.done {
      color: #777980 !important;
      -webkit-text-fill-color: #777980 !important;
      background: rgba(190, 192, 197, 0.54) !important;
      background-image: none !important;
      border-color: rgba(255, 255, 255, 0.78) !important;
      filter: saturate(0.15);
    }
    html[data-xlyneve-color-theme="autumn"].theme-homecal .todo-item.done textarea,
    html[data-xlyneve-color-theme="autumn"].theme-homecal .todo-item.done input[type="text"],
    html[data-xlyneve-color-theme="autumn"].theme-homecal .todo-item.done > div:last-child {
      color: #777980 !important;
      -webkit-text-fill-color: #777980 !important;
    }
    html[data-xlyneve-color-theme="autumn"].theme-homecal .todo-item.done input[type="checkbox"] {
      accent-color: #777980;
      filter: grayscale(1);
    }

    html[data-xlyneve-color-theme="autumn"] :is(
      .gradient-highlight, .highlight-gradient, .note-gradient-highlight,
      mark.highlight-hue, .note-text mark, .edit-note mark,
      .universal-search-native-snippet mark, .cep-search-match, .search-highlight
    ) {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }

    html[data-xlyneve-color-theme="autumn"] table,
    html[data-xlyneve-color-theme="autumn"] table * {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }

    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) {
      background: radial-gradient(circle at 0 100%, rgba(146, 166, 167, 0.5), transparent 44%), radial-gradient(circle at 100% 100%, rgba(215, 190, 196, 0.54), transparent 48%), linear-gradient(145deg, #f8f5f5 0%, #e8eeee 100%) !important;
    }
    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) main {
      background: rgba(248, 246, 246, 0.86) !important;
      border-color: rgba(255, 255, 255, 0.94) !important;
      box-shadow: 0 18px 45px rgba(37, 87, 101, 0.16), 0 3px 10px rgba(37, 63, 70, 0.08) !important;
    }
    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) .note-card { background: rgba(239, 234, 238, 0.9) !important; }
    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) .notepad {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
      caret-color: #255765 !important;
      background: linear-gradient(rgba(255,255,255,.9), rgba(255,255,255,.9)) padding-box, repeating-linear-gradient(to bottom, transparent 0, transparent 26px, rgba(146,166,167,.24) 27px) !important;
    }
    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) .timestamp { color: rgba(37, 87, 101, 0.44) !important; }
    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) .dot-add { background: #255765 !important; }
    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) .dot-yellow { background: #d7bec4 !important; }
    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) .dot-purple { background: #92a6a7 !important; }
    html[data-xlyneve-color-theme="autumn"] body:has(.notes .notepad) :is(.pad-open-options button, .open-status, .open-options-menu) {
      color: #253f46 !important;
      background: rgba(248, 246, 246, 0.95) !important;
      border-color: rgba(146, 166, 167, 0.74) !important;
    }

    html[data-xlyneve-color-theme="hoya"] {
      --refresh-cocoa: #334b50;
      --refresh-rose: #f8e5dd;
      --refresh-lime: #8b9466;
      --refresh-stone: #d8d7c5;
      --refresh-blue: #40585c;
      --refresh-terracotta: #daa23e;
      --refresh-edge: rgba(255,255,255,.84);
      --refresh-depth: 0 12px 30px rgba(64,88,92,.14);
      --theme-ink: #334b50;
      --quick-panel: linear-gradient(145deg, rgba(249,247,242,.96), rgba(216,215,197,.9));
      --quick-ink: #334b50;
      --quick-accent: #40585c;
      --quick-accent-ink: #ffffff;
      --quick-soft: rgba(218,162,62,.28);
      --quick-field: rgba(255,255,255,.76);
      --quick-edge: rgba(139,148,102,.62);
      --copy-feedback-accent: #daa23e;
      --copy-feedback-soft: rgba(139,148,102,.42);
      --clinical-panel: rgba(216,215,197,.88);
      --clinical-field: rgba(249,247,242,.82);
      --clinical-accent: #40585c;
      --clinical-accent-ink: #ffffff;
      --clinical-edge: rgba(139,148,102,.5);
      --homecal-header: linear-gradient(135deg, rgba(218,162,62,.84), rgba(139,148,102,.82));
      --homecal-header-ink: #334b50;
      --homecal-control: rgba(249,247,242,.8);
      --homecal-control-ink: #334b50;
      --homecal-header-edge: rgba(64,88,92,.38);
      --homecal-today: linear-gradient(145deg,rgba(248,229,221,.96),rgba(139,148,102,.66));
      --homecal-today-edge: rgba(218,162,62,.54);
      --homecal-today-shadow: rgba(64,88,92,.17);
    }
    html[data-xlyneve-color-theme="hoya"],
    html[data-xlyneve-color-theme="hoya"] body {
      color: #334b50;
      background-color: #f4f1ea !important;
      background-image: radial-gradient(circle at 15% 12%, rgba(248,229,221,.8), transparent 35%), radial-gradient(circle at 84% 18%, rgba(218,162,62,.2), transparent 38%), radial-gradient(circle at 22% 84%, rgba(139,148,102,.2), transparent 38%), linear-gradient(180deg,#faf8f4 0%,#f3f0e7 55%,#e7e8dc 100%) !important;
      background-attachment: fixed !important;
    }
    html[data-xlyneve-color-theme="hoya"] body::before { opacity:.07 !important; filter:sepia(.16) hue-rotate(18deg) saturate(.84); }
    html[data-xlyneve-color-theme="hoya"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) {
      color:var(--card-ink,#334b50) !important;
      -webkit-text-fill-color:var(--card-ink,#334b50);
      background:var(--card-glass,rgba(216,215,197,.76)) !important;
      background-image:none !important;
      border-color:rgba(255,255,255,.84) !important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.92),0 12px 28px rgba(64,88,92,.12) !important;
    }
    html[data-xlyneve-color-theme="hoya"] body > header,
    html[data-xlyneve-color-theme="hoya"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) {
      color:var(--page-header-ink,#334b50) !important;
      background-color:var(--page-header-glass,rgba(248,229,221,.66)) !important;
      border-color:rgba(255,255,255,.84) !important;
      box-shadow:0 12px 30px rgba(64,88,92,.11) !important;
    }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .section-admin { --section-glass:rgba(64,88,92,.84);--section-glass-hover:rgba(64,88,92,.92);--section-shadow:rgba(64,88,92,.22);--section-shadow-hover:rgba(64,88,92,.3); }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .section-home { --section-glass:rgba(216,215,197,.76);--section-glass-hover:rgba(216,215,197,.88);--section-shadow:rgba(64,88,92,.1);--section-shadow-hover:rgba(64,88,92,.18); }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .section-notes { --section-glass:rgba(248,229,221,.82);--section-glass-hover:rgba(248,229,221,.94);--section-shadow:rgba(64,88,92,.09);--section-shadow-hover:rgba(64,88,92,.16); }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .section-prescribing { --section-glass:rgba(218,162,62,.72);--section-glass-hover:rgba(218,162,62,.84);--section-shadow:rgba(64,88,92,.11);--section-shadow-hover:rgba(64,88,92,.19); }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .section-urgent { --section-glass:rgba(139,148,102,.72);--section-glass-hover:rgba(139,148,102,.84);--section-shadow:rgba(64,88,92,.11);--section-shadow-hover:rgba(64,88,92,.2); }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important; }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .main-content .card-group.section-card-group > .card:hover { background:var(--section-glass-hover) !important; }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .main-content .section-admin > .card { color:#fff !important;-webkit-text-fill-color:#fff !important; }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .main-content :is(.section-home,.section-notes,.section-prescribing,.section-urgent) > .card { color:#334b50 !important;-webkit-text-fill-color:#334b50 !important; }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .top-links a { color:#334b50 !important;background:rgba(255,255,255,.78) !important;border-color:rgba(216,215,197,.82) !important;box-shadow:0 5px 14px rgba(64,88,92,.09) !important; }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .pageTitle {
      color:#ffffff !important;
      -webkit-text-fill-color:#ffffff !important;
      -webkit-text-stroke:.55px rgba(51,75,80,.42) !important;
      text-shadow:0 1px 0 rgba(255,255,255,.3),0 3px 3px rgba(51,75,80,.24),0 8px 22px rgba(51,75,80,.28) !important;
    }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 1){background:rgba(64,88,92,.94) !important;color:#fff !important;}
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 2){background:rgba(248,229,221,.94) !important;color:#334b50 !important;}
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 3){background:rgba(139,148,102,.88) !important;color:#fff !important;}
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 4){background:rgba(218,162,62,.9) !important;color:#334b50 !important;}
    html[data-xlyneve-color-theme="hoya"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 5){background:rgba(216,215,197,.94) !important;color:#334b50 !important;}

    html[data-xlyneve-color-theme="hoya"].theme-home-glass .universal-search,
    html[data-xlyneve-color-theme="hoya"] .cep-global-search-panel {
      color:#334b50 !important;background:rgba(249,247,242,.97) !important;background-image:radial-gradient(circle at 92% 5%,rgba(218,162,62,.22),transparent 34%),linear-gradient(145deg,rgba(255,255,255,.98),rgba(216,215,197,.38)) !important;border-color:rgba(139,148,102,.66) !important;box-shadow:0 22px 58px rgba(64,88,92,.2) !important;
    }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass #universalSearchInput { color:#334b50 !important;-webkit-text-fill-color:#334b50 !important;background:rgba(255,255,255,.94) !important;border-color:rgba(64,88,92,.22) !important; }
    html[data-xlyneve-color-theme="hoya"].theme-home-glass #universalSearchInput:focus { border-color:rgba(64,88,92,.7) !important;box-shadow:0 0 0 3px rgba(139,148,102,.23) !important; }
    html[data-xlyneve-color-theme="hoya"] body.cep-search-overlay-open .cep-search-overlay .cep-search-overlay-host .cep-global-search-panel .cep-global-search-row input[type="search"] { color:#334b50 !important;-webkit-text-fill-color:#334b50 !important;background:rgba(255,255,255,.94) !important;background-color:rgba(255,255,255,.94) !important;border-color:rgba(64,88,92,.24) !important; }
    html[data-xlyneve-color-theme="hoya"] body.cep-search-overlay-open .cep-search-overlay .cep-search-overlay-host .cep-global-search-panel .cep-global-search-row input[type="search"]:focus { border-color:rgba(64,88,92,.7) !important;box-shadow:0 0 0 3px rgba(139,148,102,.23) !important; }
    html[data-xlyneve-color-theme="hoya"] :is(.universal-search-close,.universal-search-mode,.universal-search-filter,.cep-global-search-row button,.cep-global-search-modes button,.cep-global-search-filters button) { color:#334b50 !important;background:rgba(248,229,221,.78) !important;border-color:rgba(139,148,102,.46) !important; }
    html[data-xlyneve-color-theme="hoya"] :is(.universal-search-mode.is-active,.universal-search-filter.is-active,.cep-global-search-modes button.is-active,.cep-global-search-filters button.is-active) { color:#fff !important;background:rgba(64,88,92,.94) !important;border-color:transparent !important; }
    html[data-xlyneve-color-theme="hoya"] :is(.universal-search-status,.cep-global-search-status) { color:rgba(51,75,80,.76) !important; }
    html[data-xlyneve-color-theme="hoya"] :is(.universal-search-source-title,.cep-global-search-group-title) { color:#40585c !important;-webkit-text-fill-color:#40585c !important; }
    html[data-xlyneve-color-theme="hoya"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#334b50 !important;-webkit-text-fill-color:#334b50 !important;background:rgba(216,215,197,.54) !important;border-color:rgba(255,255,255,.9) !important;box-shadow:0 8px 22px rgba(64,88,92,.1) !important; }
    html[data-xlyneve-color-theme="hoya"] :is(.universal-search-native-snippet,.xgpt-header-style .universal-search-native-snippet) { color:#334b50 !important;-webkit-text-fill-color:#334b50 !important; }

    html[data-xlyneve-color-theme="hoya"].theme-homecal .todo-item.done { color:#777980 !important;-webkit-text-fill-color:#777980 !important;background:rgba(190,192,197,.54) !important;background-image:none !important;border-color:rgba(255,255,255,.78) !important;filter:saturate(.15); }
    html[data-xlyneve-color-theme="hoya"].theme-homecal .todo-item.done :is(textarea,input[type="text"]),html[data-xlyneve-color-theme="hoya"].theme-homecal .todo-item.done > div:last-child { color:#777980 !important;-webkit-text-fill-color:#777980 !important; }
    html[data-xlyneve-color-theme="hoya"].theme-homecal .todo-item.done input[type="checkbox"] { accent-color:#777980;filter:grayscale(1); }
    html[data-xlyneve-color-theme="hoya"] :is(.gradient-highlight,.highlight-gradient,.note-gradient-highlight,mark.highlight-hue,.note-text mark,.edit-note mark,.universal-search-native-snippet mark,.cep-search-match,.search-highlight,.cep-global-search-result mark) { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="hoya"] table,html[data-xlyneve-color-theme="hoya"] table * { color:#000 !important;-webkit-text-fill-color:#000 !important; }

    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) { background:radial-gradient(circle at 0 100%,rgba(139,148,102,.46),transparent 44%),radial-gradient(circle at 100% 100%,rgba(218,162,62,.42),transparent 48%),linear-gradient(145deg,#f8e5dd 0%,#e8e8da 100%) !important; }
    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) main { background:rgba(249,247,242,.88) !important;border-color:rgba(255,255,255,.94) !important;box-shadow:0 18px 45px rgba(64,88,92,.16),0 3px 10px rgba(51,75,80,.08) !important; }
    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) .note-card { background:rgba(248,229,221,.72) !important; }
    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) .notepad { color:#000 !important;-webkit-text-fill-color:#000 !important;caret-color:#40585c !important;background:linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.9)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(139,148,102,.24) 27px) !important; }
    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) .timestamp { color:rgba(64,88,92,.45) !important; }
    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) .dot-add { background:#40585c !important; }
    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) .dot-yellow { background:#daa23e !important; }
    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) .dot-purple { background:#8b9466 !important; }
    html[data-xlyneve-color-theme="hoya"] body:has(.notes .notepad) :is(.pad-open-options button,.open-status,.open-options-menu) { color:#334b50 !important;background:rgba(249,247,242,.95) !important;border-color:rgba(139,148,102,.62) !important; }
    html[data-xlyneve-color-theme="hoya"] .xlyneve-theme-button { background:linear-gradient(135deg,#40585c 0 36%,#8b9466 36% 58%,#daa23e 58% 80%,#f8e5dd 80% 100%); }

    html[data-xlyneve-color-theme="lake-mist"] {
      --refresh-cocoa:#443d35;
      --refresh-rose:#dbcad0;
      --refresh-lime:#a2ac9e;
      --refresh-stone:#f3f2ed;
      --refresh-blue:#bfc6c6;
      --refresh-terracotta:#d6cfca;
      --refresh-edge:rgba(255,255,255,.82);
      --refresh-depth:0 12px 30px rgba(68,61,53,.12);
      --theme-ink:#443d35;
      --quick-panel:linear-gradient(145deg,rgba(243,242,237,.97),rgba(191,198,198,.88));
      --quick-ink:#443d35;
      --quick-accent:#443d35;
      --quick-accent-ink:#fff;
      --quick-soft:rgba(219,202,208,.48);
      --quick-field:rgba(243,242,237,.82);
      --quick-edge:rgba(162,172,158,.62);
      --copy-feedback-accent:#443d35;
      --copy-feedback-soft:rgba(219,202,208,.58);
      --clinical-panel:rgba(191,198,198,.86);
      --clinical-field:rgba(243,242,237,.84);
      --clinical-accent:#443d35;
      --clinical-accent-ink:#fff;
      --clinical-edge:rgba(162,172,158,.58);
      --homecal-header:linear-gradient(135deg,rgba(191,198,198,.9),rgba(162,172,158,.84));
      --homecal-header-ink:#443d35;
      --homecal-control:rgba(243,242,237,.82);
      --homecal-control-ink:#443d35;
      --homecal-header-edge:rgba(68,61,53,.32);
      --homecal-today:linear-gradient(145deg,rgba(243,242,237,.97),rgba(219,202,208,.82));
      --homecal-today-edge:rgba(162,172,158,.62);
      --homecal-today-shadow:rgba(68,61,53,.15);
    }
    html[data-xlyneve-color-theme="lake-mist"],
    html[data-xlyneve-color-theme="lake-mist"] body {
      color:#443d35;
      background-color:#f3f2ed !important;
      background-image:radial-gradient(circle at 14% 12%,rgba(243,242,237,.98),transparent 34%),radial-gradient(circle at 84% 18%,rgba(219,202,208,.34),transparent 38%),radial-gradient(circle at 20% 86%,rgba(162,172,158,.25),transparent 38%),linear-gradient(180deg,#f7f6f2 0%,#eeece8 56%,#e3e6e2 100%) !important;
      background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="lake-mist"] body::before { opacity:.07 !important;filter:sepia(.08) hue-rotate(338deg) saturate(.72); }
    html[data-xlyneve-color-theme="lake-mist"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) {
      color:var(--card-ink,#443d35) !important;-webkit-text-fill-color:var(--card-ink,#443d35);background:var(--card-glass,rgba(191,198,198,.72)) !important;background-image:none !important;border-color:rgba(255,255,255,.84) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 12px 28px rgba(68,61,53,.1) !important;
    }
    html[data-xlyneve-color-theme="lake-mist"] body > header,
    html[data-xlyneve-color-theme="lake-mist"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) { color:var(--page-header-ink,#443d35) !important;background-color:var(--page-header-glass,rgba(191,198,198,.72)) !important;border-color:rgba(255,255,255,.84) !important;box-shadow:0 12px 30px rgba(68,61,53,.1) !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .section-admin { --section-glass:rgba(68,61,53,.88);--section-glass-hover:rgba(68,61,53,.95);--section-shadow:rgba(68,61,53,.22);--section-shadow-hover:rgba(68,61,53,.3); }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .section-home { --section-glass:rgba(191,198,198,.8);--section-glass-hover:rgba(191,198,198,.9);--section-shadow:rgba(68,61,53,.1);--section-shadow-hover:rgba(68,61,53,.18); }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .section-notes { --section-glass:rgba(219,202,208,.82);--section-glass-hover:rgba(219,202,208,.94);--section-shadow:rgba(68,61,53,.09);--section-shadow-hover:rgba(68,61,53,.16); }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .section-prescribing { --section-glass:rgba(214,207,202,.84);--section-glass-hover:rgba(214,207,202,.94);--section-shadow:rgba(68,61,53,.1);--section-shadow-hover:rgba(68,61,53,.18); }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .section-urgent { --section-glass:rgba(162,172,158,.8);--section-glass-hover:rgba(162,172,158,.9);--section-shadow:rgba(68,61,53,.11);--section-shadow-hover:rgba(68,61,53,.19); }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .main-content .card-group.section-card-group > .card:hover { background:var(--section-glass-hover) !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .main-content .section-admin > .card { color:#fff !important;-webkit-text-fill-color:#fff !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .main-content :is(.section-home,.section-notes,.section-prescribing,.section-urgent) > .card { color:#443d35 !important;-webkit-text-fill-color:#443d35 !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .top-links a { color:#443d35 !important;background:rgba(243,242,237,.84) !important;border-color:rgba(191,198,198,.84) !important;box-shadow:0 5px 14px rgba(68,61,53,.08) !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .pageTitle { color:#443d35 !important;-webkit-text-fill-color:#443d35 !important;text-shadow:0 1px 0 rgba(255,255,255,.5),0 4px 18px rgba(68,61,53,.18) !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 1){background:rgba(68,61,53,.94) !important;color:#fff !important;}
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 2){background:rgba(191,198,198,.94) !important;color:#443d35 !important;}
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 3){background:rgba(219,202,208,.94) !important;color:#443d35 !important;}
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 4){background:rgba(162,172,158,.94) !important;color:#443d35 !important;}
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 5){background:rgba(214,207,202,.96) !important;color:#443d35 !important;}
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 6){background:rgba(243,242,237,.98) !important;color:#443d35 !important;}
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass .universal-search,
    html[data-xlyneve-color-theme="lake-mist"] .cep-global-search-panel { color:#443d35 !important;background:rgba(243,242,237,.98) !important;background-image:radial-gradient(circle at 92% 5%,rgba(219,202,208,.34),transparent 34%),linear-gradient(145deg,rgba(255,255,255,.98),rgba(191,198,198,.4)) !important;border-color:rgba(162,172,158,.7) !important;box-shadow:0 22px 58px rgba(68,61,53,.2) !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass #universalSearchInput,
    html[data-xlyneve-color-theme="lake-mist"] body.cep-search-overlay-open .cep-search-overlay .cep-search-overlay-host .cep-global-search-panel .cep-global-search-row input[type="search"] { color:#443d35 !important;-webkit-text-fill-color:#443d35 !important;background:rgba(243,242,237,.96) !important;background-color:rgba(243,242,237,.96) !important;border-color:rgba(68,61,53,.26) !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-home-glass #universalSearchInput:focus,
    html[data-xlyneve-color-theme="lake-mist"] body.cep-search-overlay-open .cep-search-overlay .cep-search-overlay-host .cep-global-search-panel .cep-global-search-row input[type="search"]:focus { border-color:rgba(68,61,53,.66) !important;box-shadow:0 0 0 3px rgba(162,172,158,.3) !important; }
    html[data-xlyneve-color-theme="lake-mist"] :is(.universal-search-close,.universal-search-mode,.universal-search-filter,.cep-global-search-row button,.cep-global-search-modes button,.cep-global-search-filters button) { color:#443d35 !important;background:rgba(219,202,208,.72) !important;border-color:rgba(162,172,158,.52) !important; }
    html[data-xlyneve-color-theme="lake-mist"] :is(.universal-search-mode.is-active,.universal-search-filter.is-active,.cep-global-search-modes button.is-active,.cep-global-search-filters button.is-active) { color:#fff !important;background:rgba(68,61,53,.94) !important;border-color:transparent !important; }
    html[data-xlyneve-color-theme="lake-mist"] :is(.universal-search-status,.cep-global-search-status) { color:rgba(68,61,53,.74) !important; }
    html[data-xlyneve-color-theme="lake-mist"] :is(.universal-search-source-title,.cep-global-search-group-title) { color:#443d35 !important;-webkit-text-fill-color:#443d35 !important; }
    html[data-xlyneve-color-theme="lake-mist"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#443d35 !important;-webkit-text-fill-color:#443d35 !important;background:rgba(191,198,198,.56) !important;border-color:rgba(255,255,255,.9) !important;box-shadow:0 8px 22px rgba(68,61,53,.1) !important; }
    html[data-xlyneve-color-theme="lake-mist"] :is(.universal-search-native-snippet,.xgpt-header-style .universal-search-native-snippet) { color:#443d35 !important;-webkit-text-fill-color:#443d35 !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-homecal .todo-item.done { color:#777980 !important;-webkit-text-fill-color:#777980 !important;background:rgba(190,192,197,.54) !important;background-image:none !important;border-color:rgba(255,255,255,.78) !important;filter:saturate(.15); }
    html[data-xlyneve-color-theme="lake-mist"].theme-homecal .todo-item.done :is(textarea,input[type="text"]),html[data-xlyneve-color-theme="lake-mist"].theme-homecal .todo-item.done > div:last-child { color:#777980 !important;-webkit-text-fill-color:#777980 !important; }
    html[data-xlyneve-color-theme="lake-mist"].theme-homecal .todo-item.done input[type="checkbox"] { accent-color:#777980;filter:grayscale(1); }
    html[data-xlyneve-color-theme="lake-mist"] :is(.gradient-highlight,.highlight-gradient,.note-gradient-highlight,mark.highlight-hue,.note-text mark,.edit-note mark,.universal-search-native-snippet mark,.cep-search-match,.search-highlight,.cep-global-search-result mark) { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="lake-mist"] table,html[data-xlyneve-color-theme="lake-mist"] table * { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) { background:radial-gradient(circle at 0 100%,rgba(162,172,158,.42),transparent 44%),radial-gradient(circle at 100% 100%,rgba(219,202,208,.46),transparent 48%),linear-gradient(145deg,#f3f2ed 0%,#e4e8e6 100%) !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) main { background:rgba(243,242,237,.9) !important;border-color:rgba(255,255,255,.94) !important;box-shadow:0 18px 45px rgba(68,61,53,.15),0 3px 10px rgba(68,61,53,.08) !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) .note-card { background:rgba(219,202,208,.7) !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) .notepad { color:#000 !important;-webkit-text-fill-color:#000 !important;caret-color:#443d35 !important;background:linear-gradient(rgba(255,255,255,.91),rgba(255,255,255,.91)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(162,172,158,.26) 27px) !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) .timestamp { color:rgba(68,61,53,.46) !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) .dot-add { background:#443d35 !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) .dot-yellow { background:#dbcad0 !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) .dot-purple { background:#a2ac9e !important; }
    html[data-xlyneve-color-theme="lake-mist"] body:has(.notes .notepad) :is(.pad-open-options button,.open-status,.open-options-menu) { color:#443d35 !important;background:rgba(243,242,237,.96) !important;border-color:rgba(162,172,158,.64) !important; }
    html[data-xlyneve-color-theme="lake-mist"] .xlyneve-theme-button { background:linear-gradient(135deg,#443d35 0 28%,#bfc6c6 28% 48%,#dbcad0 48% 66%,#a2ac9e 66% 84%,#f3f2ed 84% 100%); }

    html[data-xlyneve-color-theme="palm-springs"] {
      --refresh-cocoa:#1f2c2c;--refresh-rose:#c6a0a8;--refresh-lime:#bda487;--refresh-stone:#fbf8f5;--refresh-blue:#f1e7e3;--refresh-terracotta:#bda487;
      --refresh-edge:rgba(255,255,255,.84);--refresh-depth:0 12px 30px rgba(31,44,44,.14);--theme-ink:#263333;
      --quick-panel:linear-gradient(145deg,rgba(251,248,245,.98),rgba(198,160,168,.62));--quick-ink:#263333;--quick-accent:#1f2c2c;--quick-accent-ink:#fff;--quick-soft:rgba(198,160,168,.38);--quick-field:rgba(251,248,245,.9);--quick-edge:rgba(189,164,135,.62);
      --copy-feedback-accent:#bda487;--copy-feedback-soft:rgba(198,160,168,.5);--clinical-panel:rgba(198,160,168,.78);--clinical-field:rgba(251,248,245,.9);--clinical-accent:#1f2c2c;--clinical-accent-ink:#fff;--clinical-edge:rgba(189,164,135,.62);
      --homecal-header:linear-gradient(135deg,rgba(31,44,44,.94),rgba(198,160,168,.8));--homecal-header-ink:#fff;--homecal-control:rgba(251,248,245,.9);--homecal-control-ink:#263333;--homecal-header-edge:rgba(189,164,135,.58);--homecal-today:linear-gradient(145deg,rgba(251,248,245,.98),rgba(241,231,227,.9));--homecal-today-edge:rgba(198,160,168,.58);--homecal-today-shadow:rgba(31,44,44,.16);
    }
    html[data-xlyneve-color-theme="palm-springs"],html[data-xlyneve-color-theme="palm-springs"] body { color:#263333;background-color:#f1e7e3 !important;background-image:radial-gradient(circle at 14% 10%,rgba(251,248,245,.98),transparent 34%),radial-gradient(circle at 86% 20%,rgba(198,160,168,.3),transparent 40%),radial-gradient(circle at 18% 86%,rgba(189,164,135,.22),transparent 38%),linear-gradient(180deg,#fbf8f5 0%,#f1e7e3 58%,#e7d7d6 100%) !important;background-attachment:fixed !important; }
    html[data-xlyneve-color-theme="palm-springs"] body::before { opacity:.06 !important;filter:sepia(.08) hue-rotate(326deg) saturate(.82); }
    html[data-xlyneve-color-theme="palm-springs"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) { color:var(--card-ink,#263333) !important;-webkit-text-fill-color:var(--card-ink,#263333);background:var(--card-glass,rgba(241,231,227,.8)) !important;background-image:none !important;border-color:rgba(255,255,255,.88) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.92),0 12px 28px rgba(31,44,44,.11) !important; }
    html[data-xlyneve-color-theme="palm-springs"] body > header,html[data-xlyneve-color-theme="palm-springs"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) { color:var(--page-header-ink,#263333) !important;background-color:var(--page-header-glass,rgba(198,160,168,.74)) !important;border-color:rgba(255,255,255,.86) !important;box-shadow:0 12px 30px rgba(31,44,44,.12) !important; }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .section-admin { --section-glass:rgba(31,44,44,.92);--section-glass-hover:rgba(31,44,44,.97);--section-shadow:rgba(31,44,44,.24);--section-shadow-hover:rgba(31,44,44,.32); }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .section-home { --section-glass:rgba(241,231,227,.86);--section-glass-hover:rgba(241,231,227,.96);--section-shadow:rgba(31,44,44,.09);--section-shadow-hover:rgba(31,44,44,.16); }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .section-notes { --section-glass:rgba(198,160,168,.78);--section-glass-hover:rgba(198,160,168,.9);--section-shadow:rgba(31,44,44,.11);--section-shadow-hover:rgba(31,44,44,.18); }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .section-prescribing { --section-glass:rgba(189,164,135,.8);--section-glass-hover:rgba(189,164,135,.9);--section-shadow:rgba(31,44,44,.1);--section-shadow-hover:rgba(31,44,44,.18); }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .section-urgent { --section-glass:rgba(251,248,245,.88);--section-glass-hover:rgba(251,248,245,.97);--section-shadow:rgba(31,44,44,.08);--section-shadow-hover:rgba(31,44,44,.15); }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important; }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .main-content .section-admin > .card { color:#fff !important;-webkit-text-fill-color:#fff !important; }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .main-content :is(.section-home,.section-notes,.section-prescribing,.section-urgent) > .card { color:#263333 !important;-webkit-text-fill-color:#263333 !important; }
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 1){background:rgba(31,44,44,.96) !important;color:#fff !important;}html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 2){background:rgba(198,160,168,.92) !important;color:#263333 !important;}html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 3){background:rgba(189,164,135,.92) !important;color:#263333 !important;}html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 4){background:rgba(241,231,227,.96) !important;color:#263333 !important;}html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 5){background:rgba(251,248,245,.98) !important;color:#263333 !important;}
    html[data-xlyneve-color-theme="palm-springs"].theme-home-glass .universal-search,html[data-xlyneve-color-theme="palm-springs"] .cep-global-search-panel { color:#263333 !important;background:rgba(251,248,245,.98) !important;background-image:radial-gradient(circle at 92% 5%,rgba(198,160,168,.28),transparent 34%),linear-gradient(145deg,rgba(251,248,245,.99),rgba(241,231,227,.74)) !important;border-color:rgba(189,164,135,.68) !important;box-shadow:0 22px 58px rgba(31,44,44,.2) !important; }
    html[data-xlyneve-color-theme="palm-springs"] :is(#universalSearchInput,.cep-global-search-row input[type="search"]) { color:#263333 !important;-webkit-text-fill-color:#263333 !important;background:rgba(251,248,245,.96) !important;border-color:rgba(31,44,44,.24) !important; }
    html[data-xlyneve-color-theme="palm-springs"] :is(.universal-search-close,.universal-search-mode,.universal-search-filter,.cep-global-search-row button,.cep-global-search-modes button,.cep-global-search-filters button) { color:#263333 !important;background:rgba(241,231,227,.84) !important;border-color:rgba(198,160,168,.56) !important; }
    html[data-xlyneve-color-theme="palm-springs"] :is(.universal-search-mode.is-active,.universal-search-filter.is-active,.cep-global-search-modes button.is-active,.cep-global-search-filters button.is-active) { color:#fff !important;background:rgba(31,44,44,.96) !important;border-color:transparent !important; }
    html[data-xlyneve-color-theme="palm-springs"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#263333 !important;-webkit-text-fill-color:#263333 !important;background:rgba(241,231,227,.72) !important;border-color:rgba(255,255,255,.92) !important;box-shadow:0 8px 22px rgba(31,44,44,.1) !important; }
    html[data-xlyneve-color-theme="palm-springs"] :is(.gradient-highlight,.highlight-gradient,.note-gradient-highlight,mark.highlight-hue,.note-text mark,.edit-note mark,.universal-search-native-snippet mark,.cep-search-match,.search-highlight,.cep-global-search-result mark),html[data-xlyneve-color-theme="palm-springs"] table,html[data-xlyneve-color-theme="palm-springs"] table * { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) { background:radial-gradient(circle at 0 100%,rgba(189,164,135,.34),transparent 44%),radial-gradient(circle at 100% 100%,rgba(198,160,168,.4),transparent 48%),linear-gradient(145deg,#fbf8f5 0%,#f1e7e3 100%) !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) main { background:rgba(251,248,245,.92) !important;border-color:rgba(255,255,255,.95) !important;box-shadow:0 18px 45px rgba(31,44,44,.16),0 3px 10px rgba(31,44,44,.08) !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .note-card { background:rgba(198,160,168,.62) !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .notepad { color:#000 !important;-webkit-text-fill-color:#000 !important;caret-color:#1f2c2c !important;background:linear-gradient(rgba(251,248,245,.94),rgba(251,248,245,.94)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(198,160,168,.25) 27px) !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .dot-add { background:#1f2c2c !important; }html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .dot-yellow { background:#bda487 !important; }html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .dot-purple { background:#c6a0a8 !important; }
    html[data-xlyneve-color-theme="palm-springs"] .xlyneve-theme-button { background:linear-gradient(135deg,#1f2c2c 0 34%,#c6a0a8 34% 58%,#bda487 58% 78%,#f1e7e3 78% 100%); }

    html[data-xlyneve-color-theme="quiet-stone"] {
      --refresh-cocoa:#393831;--refresh-rose:#b8aea8;--refresh-lime:#dccfc1;--refresh-stone:#f0efe6;--refresh-blue:#c6c9d2;--refresh-terracotta:#b8aea8;--refresh-edge:rgba(255,255,255,.82);
      --card-ink:#393831;--card-glass:rgba(234,234,234,.82);--page-header-glass:rgba(184,174,168,.78);--page-header-ink:#393831;
      --quick-panel:linear-gradient(145deg,rgba(240,239,230,.98),rgba(198,201,210,.76));--quick-ink:#393831;--quick-accent:#393831;--quick-accent-ink:#fff;--quick-soft:rgba(220,207,193,.52);--quick-field:rgba(234,234,234,.86);--quick-edge:rgba(184,174,168,.66);
    }
    html[data-xlyneve-color-theme="quiet-stone"],html[data-xlyneve-color-theme="quiet-stone"] body { color:#393831;background-color:#f0efe6 !important;background-image:radial-gradient(circle at 12% 12%,rgba(234,234,234,.98),transparent 34%),radial-gradient(circle at 88% 22%,rgba(198,201,210,.34),transparent 40%),radial-gradient(circle at 16% 88%,rgba(220,207,193,.38),transparent 40%),linear-gradient(180deg,#f0efe6 0%,#eaeaea 100%) !important;background-attachment:fixed !important; }
    html[data-xlyneve-color-theme="quiet-stone"] body::before { opacity:.055 !important;filter:grayscale(.18) sepia(.05); }
    html[data-xlyneve-color-theme="quiet-stone"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) { color:var(--card-ink,#393831) !important;-webkit-text-fill-color:var(--card-ink,#393831);background:var(--card-glass,rgba(234,234,234,.82)) !important;background-image:none !important;border-color:rgba(255,255,255,.88) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.92),0 12px 28px rgba(57,56,49,.11) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] body > header,html[data-xlyneve-color-theme="quiet-stone"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) { color:var(--page-header-ink,#393831) !important;background-color:var(--page-header-glass,rgba(184,174,168,.78)) !important;border-color:rgba(255,255,255,.84) !important;box-shadow:0 12px 30px rgba(57,56,49,.12) !important; }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .section-admin { --section-glass:rgba(57,56,49,.94);--section-glass-hover:rgba(57,56,49,.98);--section-shadow:rgba(57,56,49,.24);--section-shadow-hover:rgba(57,56,49,.32); }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .section-home { --section-glass:rgba(234,234,234,.88);--section-glass-hover:rgba(234,234,234,.97);--section-shadow:rgba(57,56,49,.09);--section-shadow-hover:rgba(57,56,49,.16); }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .section-notes { --section-glass:rgba(184,174,168,.8);--section-glass-hover:rgba(184,174,168,.92);--section-shadow:rgba(57,56,49,.11);--section-shadow-hover:rgba(57,56,49,.18); }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .section-prescribing { --section-glass:rgba(220,207,193,.84);--section-glass-hover:rgba(220,207,193,.94);--section-shadow:rgba(57,56,49,.1);--section-shadow-hover:rgba(57,56,49,.18); }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .section-urgent { --section-glass:rgba(198,201,210,.82);--section-glass-hover:rgba(198,201,210,.94);--section-shadow:rgba(57,56,49,.09);--section-shadow-hover:rgba(57,56,49,.16); }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important; }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .main-content .section-admin > .card { color:#fff !important;-webkit-text-fill-color:#fff !important; }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .main-content :is(.section-home,.section-notes,.section-prescribing,.section-urgent) > .card { color:#393831 !important;-webkit-text-fill-color:#393831 !important; }
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 1){background:rgba(57,56,49,.96) !important;color:#fff !important;}html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 2){background:rgba(234,234,234,.96) !important;color:#393831 !important;}html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 3){background:rgba(184,174,168,.92) !important;color:#393831 !important;}html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 4){background:rgba(220,207,193,.94) !important;color:#393831 !important;}html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 5){background:rgba(240,239,230,.98) !important;color:#393831 !important;}html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(6n + 6){background:rgba(198,201,210,.94) !important;color:#393831 !important;}
    html[data-xlyneve-color-theme="quiet-stone"].theme-home-glass .universal-search,html[data-xlyneve-color-theme="quiet-stone"] .cep-global-search-panel { color:#393831 !important;background:rgba(240,239,230,.98) !important;background-image:radial-gradient(circle at 92% 5%,rgba(198,201,210,.38),transparent 34%),linear-gradient(145deg,rgba(240,239,230,.99),rgba(234,234,234,.8)) !important;border-color:rgba(184,174,168,.68) !important;box-shadow:0 22px 58px rgba(57,56,49,.2) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] :is(#universalSearchInput,.cep-global-search-row input[type="search"]) { color:#393831 !important;-webkit-text-fill-color:#393831 !important;background:rgba(240,239,230,.96) !important;border-color:rgba(57,56,49,.24) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] :is(.universal-search-close,.universal-search-mode,.universal-search-filter,.cep-global-search-row button,.cep-global-search-modes button,.cep-global-search-filters button) { color:#393831 !important;background:rgba(234,234,234,.88) !important;border-color:rgba(184,174,168,.58) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] :is(.universal-search-mode.is-active,.universal-search-filter.is-active,.cep-global-search-modes button.is-active,.cep-global-search-filters button.is-active) { color:#fff !important;background:rgba(57,56,49,.96) !important;border-color:transparent !important; }
    html[data-xlyneve-color-theme="quiet-stone"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#393831 !important;-webkit-text-fill-color:#393831 !important;background:rgba(234,234,234,.78) !important;border-color:rgba(255,255,255,.92) !important;box-shadow:0 8px 22px rgba(57,56,49,.1) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] :is(.gradient-highlight,.highlight-gradient,.note-gradient-highlight,mark.highlight-hue,.note-text mark,.edit-note mark,.universal-search-native-snippet mark,.cep-search-match,.search-highlight,.cep-global-search-result mark),html[data-xlyneve-color-theme="quiet-stone"] table,html[data-xlyneve-color-theme="quiet-stone"] table * { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="quiet-stone"] body:has(.notes .notepad) { background:radial-gradient(circle at 0 100%,rgba(220,207,193,.42),transparent 44%),radial-gradient(circle at 100% 100%,rgba(198,201,210,.4),transparent 48%),linear-gradient(145deg,#f0efe6 0%,#eaeaea 100%) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] body:has(.notes .notepad) main { background:rgba(240,239,230,.93) !important;border-color:rgba(255,255,255,.95) !important;box-shadow:0 18px 45px rgba(57,56,49,.16),0 3px 10px rgba(57,56,49,.08) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] body:has(.notes .notepad) .note-card { background:rgba(184,174,168,.62) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] body:has(.notes .notepad) .notepad { color:#000 !important;-webkit-text-fill-color:#000 !important;caret-color:#393831 !important;background:linear-gradient(rgba(240,239,230,.95),rgba(240,239,230,.95)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(184,174,168,.25) 27px) !important; }
    html[data-xlyneve-color-theme="quiet-stone"] body:has(.notes .notepad) .dot-add { background:#393831 !important; }html[data-xlyneve-color-theme="quiet-stone"] body:has(.notes .notepad) .dot-yellow { background:#dccfc1 !important; }html[data-xlyneve-color-theme="quiet-stone"] body:has(.notes .notepad) .dot-purple { background:#c6c9d2 !important; }
    html[data-xlyneve-color-theme="quiet-stone"] .xlyneve-theme-button { background:linear-gradient(135deg,#393831 0 25%,#b8aea8 25% 43%,#dccfc1 43% 61%,#f0efe6 61% 79%,#c6c9d2 79% 100%); }
    html[data-xlyneve-color-theme="anatomy"] {
      --refresh-cocoa:#22211f;
      --refresh-rose:#e8dccd;
      --refresh-lime:#aaa297;
      --refresh-stone:#faf2e8;
      --refresh-blue:#d8cdbf;
      --refresh-terracotta:#f6b63f;
      --refresh-edge:rgba(34,33,31,.2);
      --refresh-depth:0 12px 28px rgba(34,33,31,.12);
      --theme-ink:#22211f;
      --quick-panel:linear-gradient(145deg,rgba(255,250,244,.98),rgba(232,220,205,.92));
      --quick-ink:#22211f;
      --quick-accent:#f6b63f;
      --quick-accent-ink:#22211f;
      --quick-soft:rgba(246,182,63,.28);
      --quick-field:rgba(255,250,244,.9);
      --quick-edge:rgba(34,33,31,.28);
      --copy-feedback-accent:#f6b63f;
      --copy-feedback-soft:rgba(246,182,63,.42);
      --clinical-panel:rgba(232,220,205,.9);
      --clinical-field:rgba(255,250,244,.9);
      --clinical-accent:#22211f;
      --clinical-accent-ink:#fff;
      --clinical-edge:rgba(34,33,31,.25);
      --homecal-header:linear-gradient(135deg,rgba(34,33,31,.94),rgba(82,77,70,.9));
      --homecal-header-ink:#fff;
      --homecal-control:rgba(250,242,232,.92);
      --homecal-control-ink:#22211f;
      --homecal-header-edge:rgba(246,182,63,.58);
      --homecal-today:linear-gradient(145deg,rgba(246,182,63,.86),rgba(232,220,205,.9));
      --homecal-today-edge:rgba(34,33,31,.28);
      --homecal-today-shadow:rgba(34,33,31,.14);
    }
    html[data-xlyneve-color-theme="anatomy"],
    html[data-xlyneve-color-theme="anatomy"] body {
      color:#22211f;
      background-color:#faf2e8 !important;
      background-image:radial-gradient(circle at 14% 10%,rgba(255,255,255,.72),transparent 35%),radial-gradient(circle at 84% 18%,rgba(246,182,63,.12),transparent 38%),linear-gradient(180deg,#fff9f1 0%,#faf2e8 58%,#f1e5d7 100%) !important;
      background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="anatomy"] body::before { opacity:.035 !important;filter:sepia(.18) saturate(.55); }
    html[data-xlyneve-color-theme="anatomy"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) {
      color:var(--card-ink,#22211f) !important;-webkit-text-fill-color:var(--card-ink,#22211f);background:var(--card-glass,rgba(255,250,244,.84)) !important;background-image:none !important;border-color:rgba(34,33,31,.22) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.72),0 10px 24px rgba(34,33,31,.09) !important;
    }
    html[data-xlyneve-color-theme="anatomy"] body > header,
    html[data-xlyneve-color-theme="anatomy"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) { color:var(--page-header-ink,#22211f) !important;background-color:var(--page-header-glass,rgba(250,242,232,.9)) !important;border-color:rgba(34,33,31,.22) !important;box-shadow:0 10px 26px rgba(34,33,31,.09) !important; }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .section-admin { --section-glass:rgba(34,33,31,.92);--section-glass-hover:rgba(34,33,31,.98);--section-shadow:rgba(34,33,31,.22);--section-shadow-hover:rgba(34,33,31,.3); }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .section-home { --section-glass:rgba(250,242,232,.92);--section-glass-hover:rgba(255,250,244,.98);--section-shadow:rgba(34,33,31,.09);--section-shadow-hover:rgba(34,33,31,.15); }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .section-notes { --section-glass:rgba(232,220,205,.88);--section-glass-hover:rgba(239,229,216,.96);--section-shadow:rgba(34,33,31,.09);--section-shadow-hover:rgba(34,33,31,.15); }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .section-prescribing { --section-glass:rgba(246,182,63,.78);--section-glass-hover:rgba(246,182,63,.9);--section-shadow:rgba(34,33,31,.1);--section-shadow-hover:rgba(34,33,31,.18); }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .section-urgent { --section-glass:rgba(170,162,151,.76);--section-glass-hover:rgba(184,175,163,.88);--section-shadow:rgba(34,33,31,.1);--section-shadow-hover:rgba(34,33,31,.18); }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important; }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .main-content .card-group.section-card-group > .card:hover { background:var(--section-glass-hover) !important; }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .main-content .section-admin > .card { color:#fff !important;-webkit-text-fill-color:#fff !important; }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .main-content :is(.section-home,.section-notes,.section-prescribing,.section-urgent) > .card { color:#22211f !important;-webkit-text-fill-color:#22211f !important; }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .top-links a { color:#22211f !important;background:rgba(255,250,244,.9) !important;border-color:rgba(34,33,31,.22) !important;box-shadow:0 5px 14px rgba(34,33,31,.08) !important; }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .pageTitle { color:#22211f !important;-webkit-text-fill-color:#22211f !important;text-shadow:0 1px 0 rgba(255,255,255,.46),0 4px 18px rgba(34,33,31,.12) !important; }
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 1){background:rgba(34,33,31,.94) !important;color:#fff !important;}
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 2){background:rgba(250,242,232,.98) !important;color:#22211f !important;}
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 3){background:rgba(170,162,151,.9) !important;color:#22211f !important;}
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 4){background:rgba(246,182,63,.92) !important;color:#22211f !important;}
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 5){background:rgba(232,220,205,.96) !important;color:#22211f !important;}
    html[data-xlyneve-color-theme="anatomy"].theme-home-glass .universal-search,
    html[data-xlyneve-color-theme="anatomy"] .cep-global-search-panel { color:#22211f !important;background:rgba(255,250,244,.98) !important;background-image:linear-gradient(145deg,rgba(255,250,244,.99),rgba(232,220,205,.6)) !important;border-color:rgba(34,33,31,.28) !important;box-shadow:0 22px 56px rgba(34,33,31,.18) !important; }
    html[data-xlyneve-color-theme="anatomy"] :is(.universal-search-close,.universal-search-mode,.universal-search-filter,.cep-global-search-row button,.cep-global-search-modes button,.cep-global-search-filters button) { color:#22211f !important;background:rgba(250,242,232,.92) !important;border-color:rgba(34,33,31,.24) !important; }
    html[data-xlyneve-color-theme="anatomy"] :is(.universal-search-mode.is-active,.universal-search-filter.is-active,.cep-global-search-modes button.is-active,.cep-global-search-filters button.is-active) { color:#22211f !important;background:#f6b63f !important;border-color:rgba(34,33,31,.3) !important; }
    html[data-xlyneve-color-theme="anatomy"] :is(.universal-search-source-title,.cep-global-search-group-title) { color:#22211f !important;-webkit-text-fill-color:#22211f !important; }
    html[data-xlyneve-color-theme="anatomy"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#22211f !important;-webkit-text-fill-color:#22211f !important;background:rgba(250,242,232,.9) !important;border-color:rgba(34,33,31,.2) !important;box-shadow:0 8px 20px rgba(34,33,31,.08) !important; }
    html[data-xlyneve-color-theme="anatomy"] table,html[data-xlyneve-color-theme="anatomy"] table * { color:#22211f !important;-webkit-text-fill-color:#22211f !important; }
    html[data-xlyneve-color-theme="anatomy"] body:has(.notes .notepad) { background:linear-gradient(145deg,#fff9f1 0%,#eee1d1 100%) !important; }
    html[data-xlyneve-color-theme="anatomy"] body:has(.notes .notepad) main { background:rgba(255,250,244,.92) !important;border-color:rgba(34,33,31,.22) !important;box-shadow:0 18px 42px rgba(34,33,31,.14) !important; }
    html[data-xlyneve-color-theme="anatomy"] body:has(.notes .notepad) .notepad { color:#22211f !important;-webkit-text-fill-color:#22211f !important;caret-color:#22211f !important;background:linear-gradient(rgba(255,250,244,.94),rgba(255,250,244,.94)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(170,162,151,.32) 27px) !important; }
    html[data-xlyneve-color-theme="anatomy"] .xlyneve-theme-button { background:linear-gradient(135deg,#22211f 0 30%,#faf2e8 30% 54%,#aaa297 54% 74%,#f6b63f 74% 100%); }

    html[data-xlyneve-color-theme="sculpted"] {
      --refresh-cocoa:#313b3a;--refresh-rose:#e0c7be;--refresh-lime:#aec6b5;--refresh-stone:#f3ebe1;--refresh-blue:#a8cdd2;--refresh-terracotta:#e1d3b4;
      --refresh-edge:rgba(255,255,255,.7);--refresh-depth:12px 16px 30px rgba(96,80,68,.2);--theme-ink:#313b3a;
      --quick-panel:linear-gradient(145deg,#fffaf4,#eaded2);--quick-ink:#313b3a;--quick-accent:#79b8bd;--quick-accent-ink:#263535;--quick-soft:rgba(168,205,210,.42);--quick-field:rgba(255,250,244,.9);--quick-edge:rgba(255,255,255,.76);
      --copy-feedback-accent:#79b8bd;--copy-feedback-soft:rgba(224,199,190,.52);--clinical-panel:rgba(243,235,225,.94);--clinical-field:rgba(255,250,244,.9);--clinical-accent:#79b8bd;--clinical-accent-ink:#263535;--clinical-edge:rgba(255,255,255,.72);
      --homecal-header:linear-gradient(145deg,#a8cdd2,#78aeb5);--homecal-header-ink:#263535;--homecal-control:rgba(255,250,244,.88);--homecal-control-ink:#313b3a;--homecal-header-edge:rgba(255,255,255,.74);--homecal-today:linear-gradient(145deg,#fff8f1,#e0c7be);--homecal-today-edge:rgba(255,255,255,.8);--homecal-today-shadow:rgba(96,80,68,.22);
    }
    html[data-xlyneve-color-theme="sculpted"],html[data-xlyneve-color-theme="sculpted"] body {
      color:#313b3a;background-color:#e9dfd3 !important;
      background-image:radial-gradient(ellipse at 5% 4%,rgba(255,250,244,.98) 0 15%,transparent 34%),radial-gradient(ellipse at 95% 8%,rgba(168,205,210,.72) 0 14%,transparent 38%),radial-gradient(ellipse at 8% 90%,rgba(224,199,190,.5) 0 13%,transparent 36%),radial-gradient(ellipse at 92% 88%,rgba(174,198,181,.54) 0 15%,transparent 40%),linear-gradient(145deg,#f3ebe1 0%,#e7d9cd 100%) !important;background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="sculpted"] body::before { opacity:.025 !important;filter:sepia(.1) saturate(.62); }
    html[data-xlyneve-color-theme="sculpted"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) {
      color:var(--card-ink,#313b3a) !important;-webkit-text-fill-color:var(--card-ink,#313b3a);background:var(--card-glass,linear-gradient(145deg,rgba(255,250,244,.96),rgba(229,217,205,.9))) !important;border:1px solid rgba(255,255,255,.7) !important;border-radius:24px !important;box-shadow:inset 3px 3px 5px rgba(255,255,255,.88),inset -4px -5px 9px rgba(126,105,89,.12),10px 14px 28px rgba(96,80,68,.18),-5px -5px 14px rgba(255,255,255,.62) !important;
    }
    html[data-xlyneve-color-theme="sculpted"] body > header,html[data-xlyneve-color-theme="sculpted"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) { color:var(--page-header-ink,#313b3a) !important;background:linear-gradient(145deg,rgba(255,250,244,.94),rgba(229,217,205,.88)) !important;border:1px solid rgba(255,255,255,.7) !important;border-radius:0 0 28px 28px !important;box-shadow:inset 0 2px 2px rgba(255,255,255,.9),0 15px 30px rgba(96,80,68,.17) !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a,input,select,textarea) { border-radius:999px !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a) { border-color:rgba(255,255,255,.72) !important;box-shadow:inset 2px 2px 3px rgba(255,255,255,.9),inset -3px -4px 6px rgba(96,80,68,.13),5px 7px 14px rgba(96,80,68,.16),-3px -3px 8px rgba(255,255,255,.58) !important;transform:translateY(0);transition:transform .18s ease,box-shadow .18s ease !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a):hover { transform:translateY(-2px);box-shadow:inset 2px 2px 3px rgba(255,255,255,.94),inset -3px -4px 6px rgba(96,80,68,.1),8px 11px 20px rgba(96,80,68,.2),-4px -4px 10px rgba(255,255,255,.7) !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a):active { transform:translateY(1px);box-shadow:inset 3px 4px 8px rgba(96,80,68,.18),inset -2px -2px 5px rgba(255,255,255,.7),2px 3px 6px rgba(96,80,68,.1) !important; }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-admin { --section-glass:linear-gradient(145deg,rgba(174,198,181,.98),rgba(113,153,139,.94));--section-glass-hover:linear-gradient(145deg,rgba(187,211,193,.99),rgba(121,163,147,.96));--section-shadow:rgba(70,101,90,.24);--section-shadow-hover:rgba(70,101,90,.3); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-home { --section-glass:linear-gradient(145deg,rgba(255,250,244,.98),rgba(232,220,208,.94));--section-glass-hover:linear-gradient(145deg,#fffdf9,#eee2d6);--section-shadow:rgba(96,80,68,.15);--section-shadow-hover:rgba(96,80,68,.22); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-notes { --section-glass:linear-gradient(145deg,rgba(168,205,210,.98),rgba(112,165,174,.94));--section-glass-hover:linear-gradient(145deg,rgba(183,218,222,.99),rgba(122,177,185,.96));--section-shadow:rgba(66,111,119,.2);--section-shadow-hover:rgba(66,111,119,.28); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-prescribing { --section-glass:linear-gradient(145deg,rgba(224,199,190,.98),rgba(196,158,147,.94));--section-glass-hover:linear-gradient(145deg,rgba(235,212,204,.99),rgba(207,171,160,.96));--section-shadow:rgba(118,84,74,.18);--section-shadow-hover:rgba(118,84,74,.26); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-urgent { --section-glass:linear-gradient(145deg,rgba(225,211,180,.98),rgba(190,170,128,.94));--section-glass-hover:linear-gradient(145deg,rgba(235,223,195,.99),rgba(201,182,140,.96));--section-shadow:rgba(111,94,58,.18);--section-shadow-hover:rgba(111,94,58,.26); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important;border-radius:28px !important;box-shadow:inset 4px 4px 7px rgba(255,255,255,.72),inset -5px -6px 10px rgba(75,75,70,.13),12px 16px 28px var(--section-shadow),-6px -6px 14px rgba(255,255,255,.5) !important; }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .main-content .card-group.section-card-group > .card:hover { background:var(--section-glass-hover) !important;box-shadow:inset 4px 4px 7px rgba(255,255,255,.76),inset -5px -6px 10px rgba(75,75,70,.11),15px 19px 32px var(--section-shadow-hover),-7px -7px 16px rgba(255,255,255,.58) !important;transform:translateY(-3px) scale(1.01); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .pageTitle { color:#313b3a !important;-webkit-text-fill-color:#313b3a !important;text-shadow:0 2px 0 rgba(255,255,255,.76),0 6px 12px rgba(96,80,68,.16) !important; }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 1){background:linear-gradient(145deg,#c4d8cb,#82a995) !important;color:#263535 !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 2){background:linear-gradient(145deg,#fffaf4,#e4d6ca) !important;color:#313b3a !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 3){background:linear-gradient(145deg,#c8e0e3,#80b4bb) !important;color:#263535 !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 4){background:linear-gradient(145deg,#edd8d0,#c79688) !important;color:#313b3a !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 5){background:linear-gradient(145deg,#eadfbe,#c2ab75) !important;color:#313b3a !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .universal-search,html[data-xlyneve-color-theme="sculpted"] .cep-global-search-panel { color:#313b3a !important;background:linear-gradient(145deg,#fffaf4,#e5d8cb) !important;border:1px solid rgba(255,255,255,.74) !important;border-radius:30px !important;box-shadow:inset 4px 4px 8px rgba(255,255,255,.8),inset -5px -6px 10px rgba(96,80,68,.12),16px 22px 45px rgba(96,80,68,.22) !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#313b3a !important;-webkit-text-fill-color:#313b3a !important;background:linear-gradient(145deg,rgba(255,250,244,.98),rgba(232,220,208,.94)) !important;border-color:rgba(255,255,255,.72) !important;border-radius:20px !important;box-shadow:inset 2px 2px 3px rgba(255,255,255,.8),inset -3px -4px 6px rgba(96,80,68,.1),6px 9px 16px rgba(96,80,68,.14) !important; }
    html[data-xlyneve-color-theme="sculpted"] body:has(.notes .notepad) main { border-radius:28px !important;background:linear-gradient(145deg,#fffaf4,#e6d8ca) !important;box-shadow:inset 4px 4px 8px rgba(255,255,255,.84),inset -5px -6px 10px rgba(96,80,68,.12),14px 20px 36px rgba(96,80,68,.2) !important; }
    html[data-xlyneve-color-theme="sculpted"] body:has(.notes .notepad) .notepad { color:#313b3a !important;-webkit-text-fill-color:#313b3a !important;caret-color:#5f8889 !important;background:linear-gradient(rgba(255,250,244,.94),rgba(255,250,244,.94)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(168,205,210,.34) 27px) !important; }
    html[data-xlyneve-color-theme="sculpted"] .xlyneve-theme-button { background:linear-gradient(135deg,#f3ebe1 0 22%,#a8cdd2 22% 44%,#aec6b5 44% 65%,#e0c7be 65% 83%,#e1d3b4 83% 100%);box-shadow:inset 2px 2px 3px rgba(255,255,255,.84),inset -3px -3px 5px rgba(96,80,68,.16),5px 7px 13px rgba(96,80,68,.18) !important; }

    html[data-xlyneve-color-theme="autumn"] .xlyneve-theme-button {
      background: linear-gradient(135deg, #255765 0 42%, #92a6a7 42% 68%, #d7bec4 68% 100%);
    }

    html[data-xlyneve-color-theme].theme-home-glass .pageTitle {
      color:var(--page-header-ink,#39190f) !important;
      -webkit-text-fill-color:var(--page-header-ink,#39190f) !important;
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif !important;
      font-size:32px !important;
      font-weight:450 !important;
      line-height:1 !important;
      letter-spacing:.34em !important;
      text-transform:uppercase !important;
      -webkit-text-stroke:0 transparent !important;
      text-shadow:none !important;
      transform:none !important;
    }
    html[data-xlyneve-color-theme].theme-home-glass body > header .top-links a {
      color:var(--masthead-bar-ink,#fff) !important;
      -webkit-text-fill-color:var(--masthead-bar-ink,#fff) !important;
      background:transparent !important;
      border-color:transparent !important;
      box-shadow:none !important;
    }

    @media (max-width:1050px) {
      html[data-xlyneve-color-theme].theme-home-glass .pageTitle {
        font-size:17px !important;
      }
    }

    /* Keep the calculator logic and layout intact while carrying the selected
       colour palette through every Quick Calc surface. */
    html[data-xlyneve-color-theme] body :is(#quickCalc, #quickInteleviewer, #tabletCalculator, #syrupCalculator) {
      color: var(--quick-ink) !important;
      background: var(--quick-panel) !important;
      border-color: var(--quick-edge) !important;
      box-shadow: 0 16px 34px color-mix(in srgb, var(--quick-accent) 18%, transparent), inset 0 1px 0 rgba(255,255,255,.72) !important;
    }
    html[data-xlyneve-color-theme] body :is(#quickCalc, #quickInteleviewer, #tabletCalculator, #syrupCalculator)
      :is(.qc-title, .qi-title, .qt-title, .qs-title, .qc-label, .qt-label, .qs-label, .qs-strength-word) {
      color: var(--quick-ink) !important;
      -webkit-text-fill-color: var(--quick-ink) !important;
    }
    html[data-xlyneve-color-theme] body :is(#quickCalc, #tabletCalculator, #syrupCalculator)
      :is(input, select) {
      color: var(--quick-ink) !important;
      -webkit-text-fill-color: var(--quick-ink) !important;
      background: var(--quick-field) !important;
      border-color: var(--quick-edge) !important;
      caret-color: var(--quick-accent) !important;
    }
    html[data-xlyneve-color-theme] body :is(#quickCalc, #tabletCalculator, #syrupCalculator)
      :is(input, select):focus {
      border-color: var(--quick-accent) !important;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--quick-accent) 20%, transparent) !important;
      outline: none !important;
    }
    html[data-xlyneve-color-theme] body #quickCalc :is(.qc-tab, .qc-strength-btn, .qc-btn),
    html[data-xlyneve-color-theme] body #quickInteleviewer :is(.qi-row-item, .qi-copy-mini) {
      color: var(--quick-ink) !important;
      -webkit-text-fill-color: var(--quick-ink) !important;
      background: var(--quick-field) !important;
      border-color: var(--quick-edge) !important;
    }
    html[data-xlyneve-color-theme] body #quickCalc :is(.qc-tab, .qc-strength-btn):is(.active, [aria-selected="true"]),
    html[data-xlyneve-color-theme] body #quickCalc .qc-btn:hover,
    html[data-xlyneve-color-theme] body #quickInteleviewer :is(.qi-row-item, .qi-copy-mini):hover {
      color: var(--quick-accent-ink) !important;
      -webkit-text-fill-color: var(--quick-accent-ink) !important;
      background: var(--quick-accent) !important;
      border-color: var(--quick-accent) !important;
    }
    html[data-xlyneve-color-theme] body :is(#quickCalc, #tabletCalculator, #syrupCalculator)
      :is(.qc-results, .qt-formula, .qt-result, .qs-formula, .qs-result, .qc-pill) {
      color: var(--quick-ink) !important;
      -webkit-text-fill-color: var(--quick-ink) !important;
      background: var(--quick-soft) !important;
      border-color: var(--quick-edge) !important;
    }
    html[data-xlyneve-color-theme] body :is(#quickCalc, #quickInteleviewer, #tabletCalculator, #syrupCalculator)
      :is(.qc-toggle, .qi-toggle, .qt-toggle, .qs-toggle) {
      color: var(--quick-accent-ink) !important;
      -webkit-text-fill-color: var(--quick-accent-ink) !important;
      background: var(--quick-accent) !important;
      border-color: color-mix(in srgb, var(--quick-accent) 72%, #000) !important;
    }
    html[data-xlyneve-color-theme] body #quickCalc .qc-tabs::-webkit-scrollbar-thumb {
      background: var(--quick-accent) !important;
    }

    /* Clinical Notes defines its original glass after this shared stylesheet.
       These page-scoped selectors intentionally outrank those later visual
       rules without altering any note, auth, search, or Firebase behaviour. */
    html[data-xlyneve-color-theme].theme-clinical body .input-panel {
      color: var(--theme-ink) !important;
      background: var(--clinical-panel) !important;
      border-color: rgba(255,255,255,.84) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.86),
        0 18px 38px color-mix(in srgb, var(--clinical-accent) 16%, transparent) !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback) {
      color: var(--card-ink, var(--theme-ink)) !important;
      -webkit-text-fill-color: var(--card-ink, var(--theme-ink)) !important;
      background: var(--card-glass, var(--clinical-field)) !important;
      background-image: none !important;
      border-color: rgba(255,255,255,.86) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.88),
        0 12px 28px color-mix(in srgb, var(--clinical-accent) 14%, transparent) !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body #notesList > .note-card :is(.note-title, .note-content) {
      color: var(--card-ink, var(--theme-ink)) !important;
      -webkit-text-fill-color: var(--card-ink, var(--theme-ink)) !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback)::before {
      background: none !important;
      opacity: 0 !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback)::after {
      background: none !important;
      opacity: 0 !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body .input-panel :is(
      input,
      #noteText.editable,
      .pinned-note
    ),
    html[data-xlyneve-color-theme].theme-clinical body .top-search input {
      color: var(--theme-ink) !important;
      -webkit-text-fill-color: var(--theme-ink) !important;
      background: var(--clinical-field) !important;
      border-color: var(--clinical-edge) !important;
      caret-color: var(--clinical-accent) !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body .pinned-note :is(.pinned-note-title, .pinned-note-preview),
    html[data-xlyneve-color-theme].theme-clinical body :is(.pinned-title, #addNoteHint) {
      color: var(--theme-ink) !important;
      -webkit-text-fill-color: var(--theme-ink) !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body :is(
      .panel-toggle,
      .input-panel button,
      .format-buttons button,
      .note-actions button,
      .pinned-edit-toggle,
      .unpin-btn
    ) {
      color: var(--clinical-accent-ink) !important;
      -webkit-text-fill-color: var(--clinical-accent-ink) !important;
      background: var(--clinical-accent) !important;
      border-color: color-mix(in srgb, var(--clinical-accent) 70%, #000) !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body :is(
      .input-panel button,
      .format-buttons button,
      .note-actions button,
      .pinned-edit-toggle,
      .unpin-btn
    ):hover {
      color: var(--theme-ink) !important;
      -webkit-text-fill-color: var(--theme-ink) !important;
      background: var(--copy-feedback-soft) !important;
      border-color: var(--clinical-accent) !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body :is(.input-panel input, #noteText.editable, .top-search input):focus {
      border-color: var(--clinical-accent) !important;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--clinical-accent) 20%, transparent) !important;
    }
    html[data-xlyneve-color-theme].theme-clinical body .input-panel::-webkit-scrollbar-thumb {
      background: var(--clinical-accent) !important;
      border-color: rgba(255,255,255,.72) !important;
    }

    /* Only the full calendar page header follows the selected palette. The
       calendar grid and to-do surfaces deliberately retain their established
       colours and behaviour. */
    html[data-xlyneve-color-theme].theme-homecal body .calendar-header {
      color: var(--homecal-header-ink) !important;
      background: var(--homecal-header) !important;
      background-image: var(--homecal-header) !important;
      border-color: var(--homecal-header-edge) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.72),
        0 10px 28px color-mix(in srgb, var(--homecal-header-ink) 18%, transparent) !important;
    }
    html[data-xlyneve-color-theme].theme-homecal body .calendar-header h2#monthLabel {
      color: var(--homecal-header-ink) !important;
      -webkit-text-fill-color: var(--homecal-header-ink) !important;
      text-shadow: 0 1px 0 rgba(255,255,255,.34), 0 3px 12px rgba(0,0,0,.12) !important;
    }
    html[data-xlyneve-color-theme].theme-homecal body .calendar-header > div:last-child {
      background: color-mix(in srgb, var(--homecal-control) 28%, transparent) !important;
      background-image: none !important;
      border-color: rgba(255,255,255,.36) !important;
    }
    html[data-xlyneve-color-theme].theme-homecal body .calendar-header > div:last-child :is(button, select) {
      color: var(--homecal-control-ink) !important;
      -webkit-text-fill-color: var(--homecal-control-ink) !important;
      background: var(--homecal-control) !important;
      background-image: none !important;
      border-color: var(--homecal-header-edge) !important;
    }
    html[data-xlyneve-color-theme].theme-homecal body .calendar-header > div:last-child :is(button, select):hover {
      color: var(--homecal-control-ink) !important;
      -webkit-text-fill-color: var(--homecal-control-ink) !important;
      background: color-mix(in srgb, var(--homecal-control) 82%, #fff) !important;
      background-image: none !important;
      border-color: var(--homecal-header-ink) !important;
    }
    html[data-xlyneve-color-theme].theme-homecal body .calendar-header #noteFilterInput {
      color: var(--homecal-header-ink) !important;
      -webkit-text-fill-color: var(--homecal-header-ink) !important;
      caret-color: var(--homecal-header-ink) !important;
      background: color-mix(in srgb, var(--homecal-control) 62%, transparent) !important;
      border: 1px solid var(--homecal-header-edge) !important;
      border-radius: 999px !important;
      padding: 6px 10px !important;
    }
    html[data-xlyneve-color-theme].theme-homecal body .calendar-header #noteFilterInput::placeholder {
      color: var(--homecal-header-ink) !important;
      -webkit-text-fill-color: var(--homecal-header-ink) !important;
      opacity: .54 !important;
    }

    /* Theme today's day-note surface in the full calendar and its homepage
       embed without changing editor content or calendar behaviour. */
    html[data-xlyneve-color-theme].theme-homecal body .day.today:not(.empty),
    html[data-xlyneve-color-theme].theme-homecal.homecal-embed-today body .day.embedded-selected-day.today:not(.empty) {
      background:var(--homecal-today) !important;
      background-image:var(--homecal-today) !important;
      border-color:var(--homecal-today-edge) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.82),
        0 10px 24px var(--homecal-today-shadow) !important;
    }

    /* The original copy confirmation uses a white racing border. Give it a
       palette accent so it remains visible on the lighter themed note cards. */
    html[data-xlyneve-color-theme] body :is(.note-card, .pinned-note).copy-feedback {
      animation: xlyneveThemeCopyPulse 680ms cubic-bezier(.22,.72,.2,1) !important;
      outline: 2px solid var(--copy-feedback-accent) !important;
      outline-offset: 3px;
    }
    html[data-xlyneve-color-theme] body .copy-feedback-border rect {
      stroke: var(--copy-feedback-accent) !important;
      filter:
        drop-shadow(0 0 3px rgba(255,255,255,.92))
        drop-shadow(0 0 10px var(--copy-feedback-accent)) !important;
    }
    html[data-xlyneve-color-theme] body .copy-feedback-layer::after {
      background: linear-gradient(
        110deg,
        transparent 30%,
        var(--copy-feedback-soft) 41%,
        rgba(255,255,255,.82) 49%,
        var(--copy-feedback-soft) 57%,
        transparent 68%
      ) !important;
    }
    @keyframes xlyneveThemeCopyPulse {
      0%, 100% {
        transform: translateY(0) scale(1);
        box-shadow: 0 12px 28px color-mix(in srgb, var(--copy-feedback-accent) 18%, transparent);
      }
      38% {
        transform: translateY(1px) scale(.985);
        box-shadow:
          0 0 0 5px color-mix(in srgb, var(--copy-feedback-accent) 24%, transparent),
          0 10px 28px color-mix(in srgb, var(--copy-feedback-accent) 34%, transparent),
          inset 0 0 18px var(--copy-feedback-soft);
      }
      72% { transform: translateY(0) scale(1.008); }
    }

    /* Search results have their own copy class in both search interfaces. */
    html[data-xlyneve-color-theme] body :is(
      .universal-search-native-card,
      .cep-global-search-result
    ).is-copied {
      animation: xlyneveThemeSearchCopyPulse 720ms cubic-bezier(.22,.72,.2,1) both !important;
      outline: 2px solid var(--copy-feedback-accent) !important;
      outline-offset: 2px;
    }
    @keyframes xlyneveThemeSearchCopyPulse {
      0%, 100% {
        transform: translateY(0) scale(1);
        box-shadow: 0 5px 13px rgba(48,48,57,.13);
      }
      30% {
        transform: translateY(1px) scale(.985);
        box-shadow:
          0 0 0 5px color-mix(in srgb, var(--copy-feedback-accent) 26%, transparent),
          0 0 22px color-mix(in srgb, var(--copy-feedback-accent) 58%, transparent),
          inset 0 0 16px var(--copy-feedback-soft),
          0 5px 13px rgba(48,48,57,.13);
      }
      68% {
        transform: translateY(0) scale(1.008);
        box-shadow:
          0 0 0 3px color-mix(in srgb, var(--copy-feedback-accent) 18%, transparent),
          0 0 14px color-mix(in srgb, var(--copy-feedback-accent) 36%, transparent),
          0 5px 13px rgba(48,48,57,.13);
      }
    }

    .xlyneve-theme-control {
      position: fixed;
      right: max(14px, env(safe-area-inset-right));
      bottom: max(14px, env(safe-area-inset-bottom));
      z-index: 11990;
      font-family: Arial, sans-serif;
      color: #303039;
    }
    .xlyneve-theme-button {
      width: 46px;
      height: 46px;
      display: grid;
      place-items: center;
      padding: 0;
      border: 1px solid rgba(255,255,255,.9);
      border-radius: 50%;
      background: linear-gradient(135deg, #680044 0 48%, #e86598 48% 72%, #ffb82e 72% 100%);
      box-shadow: 0 9px 24px rgba(48,48,57,.2), inset 0 1px 0 rgba(255,255,255,.68);
      cursor: pointer;
    }
    .xlyneve-theme-button::after {
      content: "";
      width: 14px;
      height: 14px;
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 1px 5px rgba(48,48,57,.3);
    }
    .xlyneve-theme-button:focus-visible { outline: 3px solid #ffb82e; outline-offset: 3px; }
    .xlyneve-theme-panel {
      position: absolute;
      right: 0;
      bottom: 56px;
      width: 218px;
      padding: 14px;
      border: 1px solid rgba(255,255,255,.9);
      border-radius: 17px;
      background: rgba(255,253,252,.96);
      box-shadow: 0 16px 38px rgba(48,48,57,.2);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }
    .xlyneve-theme-panel[hidden] { display: none; }
    .xlyneve-theme-title { margin: 0 0 10px; color: #303039; font: 700 12px/1.2 Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
    .xlyneve-theme-option {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 6px;
      padding: 9px 10px;
      border: 1px solid transparent;
      border-radius: 11px;
      color: #303039;
      background: transparent;
      font: 600 13px/1.2 Arial, sans-serif;
      text-align: left;
      cursor: pointer;
    }
    .xlyneve-theme-option:hover,
    .xlyneve-theme-option[aria-pressed="true"] { background: rgba(217,190,220,.38); border-color: rgba(104,0,68,.12); }
    .xlyneve-theme-swatches { display: flex; gap: 3px; }
    .xlyneve-theme-swatch { width: 12px; height: 12px; border: 1px solid rgba(48,48,57,.12); border-radius: 50%; }
    @media (max-width: 600px) {
      .xlyneve-theme-control { right: 10px; bottom: 10px; }
      .xlyneve-theme-button { width: 42px; height: 42px; }
    }
  `;
  const headerSelector = [
    ".header",
    ".header-bg",
    ".topbar",
    ".top-bar",
    ".app-header",
    ".page-header",
    "body > header"
  ].join(",");

  const cardSelector = [
    ".note-card",
    ".card",
    ".acc-item",
    ".med-section",
    ".vaccine-section",
    ".vaccine-card",
    ".calculator",
    ".result",
    ".table-mini",
    ".private-note-editor",
    ".editable-checklist",
    ".day:not(.empty):not(.today)",
    ".todo-item:not(.priority)"
  ].join(",");

  const highlightSelector = [
    ".gradient-highlight",
    ".highlight-gradient",
    ".note-gradient-highlight",
    "mark.highlight-hue",
    ".note-text mark",
    ".edit-note mark"
  ].join(",");

  function removeEmptyHighlights(scope) {
    const highlights = [];
    if (scope.nodeType === 1 && scope.matches(highlightSelector)) highlights.push(scope);
    scope.querySelectorAll?.(highlightSelector).forEach((highlight) => highlights.push(highlight));

    highlights.forEach((highlight) => {
      const text = highlight.textContent.replace(/[\s\u200B-\u200D\uFEFF]/g, "");
      const richContent = highlight.querySelector("img, table, svg, video, audio");
      if (text || richContent || !highlight.isConnected) return;
      highlight.replaceWith(...highlight.childNodes);
    });
  }

  function colorCards(scope, getPageOrder) {
    const cards = [];
    if (scope.nodeType === 1 && scope.matches(cardSelector)) cards.push(scope);
    scope.querySelectorAll(cardSelector).forEach((card) => cards.push(card));

    const pendingCards = cards.filter(card => card.dataset.sharedPaletteColor !== "true");
    if (!pendingCards.length) return;
    // Build the page order once, rather than rescanning the page for every card.
    const pageOrder = getPageOrder ? getPageOrder() : new Map(
      Array.from(document.querySelectorAll(cardSelector), (card, index) => [card, index]));
    cards.forEach((card, index) => {
      if (card.dataset.sharedPaletteColor === "true") return;
      const pageIndex = pageOrder.get(card) ?? -1;
      const seed = `${pageName}:${pageIndex >= 0 ? pageIndex : index}:${card.id}:${card.className}`;
      const color = palette[hash(seed) % palette.length];
      card.style.setProperty("--card-glass", `rgba(${color.rgb}, 0.74)`);
      card.style.setProperty("--card-ink", color.ink);
      card.dataset.sharedPaletteColor = "true";
    });
  }

  function createThemePicker() {
    if (pageName !== "home.html" || !themeIsAllowed || document.getElementById("xlyneveThemeControl")) return;

    const control = document.createElement("div");
    control.className = "xlyneve-theme-control";
    control.id = "xlyneveThemeControl";

    const toggle = document.createElement("button");
    toggle.className = "xlyneve-theme-button";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Choose colour theme");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "xlyneveThemePanel");
    toggle.title = "Choose colour theme";

    const panel = document.createElement("div");
    panel.className = "xlyneve-theme-panel";
    panel.id = "xlyneveThemePanel";
    panel.hidden = true;
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", "Colour theme");

    const title = document.createElement("p");
    title.className = "xlyneve-theme-title";
    title.textContent = "Colour theme";
    panel.appendChild(title);

    const themeOptions = [
      {
        value: "original",
        label: "Original",
        colors: ["#e5cbcc", "#d3e0df", "#e1e2c3", "#db9e83"]
      },
      {
        value: "berry",
        label: "Berry",
        colors: ["#680044", "#e86598", "#d9bedc", "#ffb82e"]
      },
      {
        value: "autumn",
        label: "Autumn",
        colors: ["#255765", "#92a6a7", "#d7bec4", "#a9a8b0"]
      },
      {
        value: "hoya",
        label: "Hoya",
        colors: ["#40585c", "#8b9466", "#daa23e", "#f8e5dd"]
      },
      {
        value: "lake-mist",
        label: "Lake Mist",
        colors: ["#bfc6c6", "#f3f2ed", "#dbcad0", "#443d35", "#d6cfca", "#a2ac9e"]
      },
      {
        value: "palm-springs",
        label: "Palm Springs",
        colors: ["#1f2c2c", "#c6a0a8", "#bda487", "#f1e7e3", "#fbf8f5"]
      },
      {
        value: "quiet-stone",
        label: "Quiet Stone",
        colors: ["#393831", "#eaeaea", "#b8aea8", "#dccfc1", "#f0efe6", "#c6c9d2"]
      },
      {
        value: "anatomy",
        label: "Anatomy",
        colors: ["#faf2e8", "#22211f", "#aaa297", "#f6b63f", "#e8dccd"]
      },
      {
        value: "sculpted",
        label: "Sculpted 5D",
        colors: ["#f3ebe1", "#a8cdd2", "#aec6b5", "#e0c7be", "#e1d3b4"]
      }
    ];

    themeOptions.forEach((option) => {
      const button = document.createElement("button");
      button.className = "xlyneve-theme-option";
      button.type = "button";
      button.dataset.theme = option.value;
      button.setAttribute("aria-pressed", String(selectedTheme === option.value));

      const swatches = document.createElement("span");
      swatches.className = "xlyneve-theme-swatches";
      swatches.setAttribute("aria-hidden", "true");
      option.colors.forEach((color) => {
        const swatch = document.createElement("span");
        swatch.className = "xlyneve-theme-swatch";
        swatch.style.backgroundColor = color;
        swatches.appendChild(swatch);
      });

      const label = document.createElement("span");
      label.textContent = option.label;
      button.append(swatches, label);
      button.addEventListener("click", () => {
        try {
          if (option.value === "original") localStorage.removeItem(themeStorageKey);
          else localStorage.setItem(themeStorageKey, option.value);
        } catch {}
        location.reload();
      });
      panel.appendChild(button);
    });

    const closePicker = () => {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (open) panel.querySelector("button")?.focus();
    });
    document.addEventListener("pointerdown", (event) => {
      if (!control.contains(event.target)) closePicker();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || panel.hidden) return;
      closePicker();
      toggle.focus();
    });

    control.append(toggle, panel);
    document.body.appendChild(control);
  }

  function start() {
    if (!themeStyle.isConnected) document.head.appendChild(themeStyle);
    document.querySelectorAll(headerSelector).forEach((header) => {
      if (pageName === "home.html" && header.matches("body > header")) return;
      header.style.setProperty("background", `rgba(${pageColor.rgb}, 0.78)`, "important");
      header.style.setProperty("background-image", "none", "important");
      header.style.setProperty("color", pageColor.ink, "important");
    });
    colorCards(document);
    removeEmptyHighlights(document);
    document.addEventListener("input", (event) => {
      if (event.target?.isContentEditable) removeEmptyHighlights(event.target);
    });
    const observer = new MutationObserver((records) => {
      // All cards inserted in this delivery share the same page-order lookup.
      let pageOrder;
      const getPageOrder = () => pageOrder ||= new Map(
        Array.from(document.querySelectorAll(cardSelector), (card, index) => [card, index]));
      const visited = new Set();
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.isConnected && !visited.has(node)) {
            visited.add(node);
            colorCards(node, getPageOrder);
            removeEmptyHighlights(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    createThemePicker();
  }

  window.addEventListener("storage", (event) => {
    if (event.key === themeStorageKey) location.reload();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
