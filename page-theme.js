(function () {
  "use strict";

  // Consultation Templates keeps its own design regardless of the Home theme.
  if ((location.pathname.split("/").pop() || "").toLowerCase() === "rncnp.html") return;

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
    { rgb: "162, 136, 183", solid: "#a288b7", ink: "#ffffff" },
    { rgb: "109, 175, 191", solid: "#6dafbf", ink: "#39353a" },
    { rgb: "186, 146, 141", solid: "#ba928d", ink: "#39353a" },
    { rgb: "205, 178, 203", solid: "#cdb2cb", ink: "#39353a" },
    { rgb: "183, 189, 180", solid: "#b7bdb4", ink: "#39353a" },
  ];


  const pastelJumperPalette = [
    { rgb: "185, 166, 210", solid: "#b9a6d2", ink: "#393644" },
    { rgb: "231, 161, 161", solid: "#e7a1a1", ink: "#393644" },
    { rgb: "241, 237, 207", solid: "#f1edcf", ink: "#393644" },
    { rgb: "216, 203, 231", solid: "#d8cbe7", ink: "#393644" },
    { rgb: "250, 246, 229", solid: "#faf6e5", ink: "#393644" },
  ];

  // Soft sage, powder blue, lavender, blush and cream from the mindful palette.
  const mintCeramicPalette = [
    { rgb:"223, 232, 225", solid:"#dfe8e1", ink:"#353c38" },
    { rgb:"221, 232, 241", solid:"#dde8f1", ink:"#353c38" },
    { rgb:"230, 224, 239", solid:"#e6e0ef", ink:"#353c38" },
    { rgb:"240, 225, 229", solid:"#f0e1e5", ink:"#353c38" },
    { rgb:"242, 239, 217", solid:"#f2efd9", ink:"#353c38" },
    { rgb:"250, 250, 247", solid:"#fafaf7", ink:"#353c38" },
  ];
  const softStonePalette = [
    { rgb:"225, 226, 230", solid:"#e1e2e6", ink:"#303238" },
  ];
  const auroraPalette = [
    { rgb:"233, 235, 246", solid:"#e9ebf6", ink:"#28263c" },
  ];
  const moonClayPalette = [
    { rgb:"232, 232, 232", solid:"#e8e8e8", ink:"#48434d" },
    { rgb:"199, 180, 214", solid:"#c7b4d6", ink:"#48434d" },
    { rgb:"232, 183, 194", solid:"#e8b7c2", ink:"#48434d" },
    { rgb:"237, 203, 183", solid:"#edcbb7", ink:"#48434d" },
    { rgb:"241, 227, 189", solid:"#f1e3bd", ink:"#48434d" },
  ];
  const porcelainPalette = [
    { rgb:"233, 233, 225", solid:"#e9e9e1", ink:"#353833" },
  ];
  const frostOutlinePalette = [
    {rgb:"213, 224, 232",solid:"#d5e0e8",ink:"#34434f",outline:"rgba(55,158,233,.48)"},
    {rgb:"213, 224, 232",solid:"#d5e0e8",ink:"#34434f",outline:"rgba(102,186,240,.5)"},
    {rgb:"213, 224, 232",solid:"#d5e0e8",ink:"#34434f",outline:"rgba(180,82,201,.4)"},
    {rgb:"213, 224, 232",solid:"#d5e0e8",ink:"#34434f",outline:"rgba(42,175,193,.48)"}
  ];
  const pearlSilverPalette = [{rgb:"250, 250, 247",solid:"#fafaf7",ink:"#373d44"}];
  const lavenderGlassPalette = [{rgb:"234, 236, 243",solid:"#eaecf3",ink:"#44335d"}];
  const greyLavenderPalette = [{rgb:"240, 239, 245",solid:"#f0eff5",ink:"#44335d"}];
  const opalPearlPalette = [
    {rgb:"232, 241, 244",solid:"#e8f1f4",ink:"#35424d"},
    {rgb:"244, 232, 236",solid:"#f4e8ec",ink:"#35424d"},
    {rgb:"239, 236, 246",solid:"#efecf6",ink:"#35424d"},
    {rgb:"247, 243, 229",solid:"#f7f3e5",ink:"#35424d"}
  ];
  const pastelRosePalette = [
    {rgb:"243, 205, 212",solid:"#f3cdd4",ink:"#3c3037"},
    {rgb:"223, 234, 241",solid:"#dfeaf1",ink:"#3c3037"},
    {rgb:"248, 225, 190",solid:"#f8e1be",ink:"#3c3037"},
    {rgb:"248, 170, 128",solid:"#f8aa80",ink:"#3c3037"},
    {rgb:"206, 138, 159",solid:"#ce8a9f",ink:"#3c3037"}
  ];
  // Warm matte ivory, with the reference's restrained blush, sage, ochre and plum edges.
  const warmIvoryPalette = [
    {rgb:"237, 229, 218",solid:"#ede5da",ink:"#37352f",outline:"#baa997"},
    {rgb:"238, 226, 222",solid:"#eee2de",ink:"#37352f",outline:"#c4a09b"},
    {rgb:"229, 231, 220",solid:"#e5e7dc",ink:"#37352f",outline:"#a5ae96"},
    {rgb:"239, 232, 213",solid:"#efe8d5",ink:"#37352f",outline:"#c2aa73"},
    {rgb:"232, 224, 224",solid:"#e8e0e0",ink:"#37352f",outline:"#af969c"}
  ];
  const cloudGlassPalette = [
    {rgb:"233, 237, 249",solid:"#e9edf9",ink:"#273047",outline:"#ffffff"},
    {rgb:"234, 230, 250",solid:"#eae6fa",ink:"#273047",outline:"#ffffff"},
    {rgb:"228, 238, 249",solid:"#e4eef9",ink:"#273047",outline:"#ffffff"},
    {rgb:"245, 233, 237",solid:"#f5e9ed",ink:"#273047",outline:"#ffffff"},
    {rgb:"231, 240, 241",solid:"#e7f0f1",ink:"#273047",outline:"#ffffff"}
  ];
  const midnightGlassPalette = [
    {rgb:"37, 47, 59",solid:"#252f3b",ink:"#e9edf5",outline:"#56cde5"},
    {rgb:"45, 40, 59",solid:"#2d283b",ink:"#e9edf5",outline:"#9c70e0"},
    {rgb:"35, 47, 52",solid:"#232f34",ink:"#e9edf5",outline:"#64c9d7"},
    {rgb:"42, 43, 57",solid:"#2a2b39",ink:"#e9edf5",outline:"#8d84d8"},
    {rgb:"38, 44, 53",solid:"#262c35",ink:"#e9edf5",outline:"#669dcd"}
  ];
  const themeStorageKey = "xlyneve-color-theme";
  const removedThemes = new Set(["berry", "anatomy", "warm-medley"]);
  const deletedThemeStorageKey = "xlyneve-deleted-themes";
  let deletedThemes = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(deletedThemeStorageKey) || "[]");
    if (Array.isArray(saved)) deletedThemes = new Set(saved.filter(value => typeof value === "string" && value !== "original"));
  } catch {}

  const excludedThemePages = new Set(["biosched1.html", "recalltracker.html"]);

  const pageName = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const themeIsAllowed = !excludedThemePages.has(pageName);
  let selectedTheme = "original";
  if (themeIsAllowed) {
    try {
      const storedTheme = localStorage.getItem(themeStorageKey);
      if (storedTheme === "liquid-glass" || removedThemes.has(storedTheme)) localStorage.removeItem(themeStorageKey);
      if (storedTheme === "moon-clay" || storedTheme === "cloud-glass" || storedTheme === "midnight-glass" || storedTheme === "warm-ivory" || storedTheme === "opal-pearl" || storedTheme === "pastel-rose-5d" || storedTheme === "pastel-rose-recessed" || storedTheme === "lavender-glass" || storedTheme === "grey-lavender" || storedTheme === "pearl-silver" || storedTheme === "frost-outline" || storedTheme === "porcelain" || storedTheme === "aurora" || storedTheme === "soft-stone" || storedTheme === "mint-ceramic" || storedTheme === "berry" || storedTheme === "autumn" || storedTheme === "hoya" || storedTheme === "lake-mist" || storedTheme === "palm-springs" || storedTheme === "quiet-stone" || storedTheme === "anatomy" || storedTheme === "sculpted" || storedTheme === "pastel-jumper") selectedTheme = storedTheme;
    } catch {}
  }
  if (deletedThemes.has(selectedTheme) || removedThemes.has(selectedTheme)) {
    selectedTheme = "original";
    try { localStorage.removeItem(themeStorageKey); } catch {}
  }
  if(selectedTheme === "midnight-glass") {
    const contrastScript=document.createElement('script');
    contrastScript.src=new URL('./night-note-contrast.js?v=1',document.currentScript?.src || location.href).href;
    contrastScript.defer=true;document.head.append(contrastScript);
  }
  const palette = selectedTheme === "moon-clay" ? moonClayPalette : selectedTheme === "cloud-glass" ? cloudGlassPalette : selectedTheme === "midnight-glass" ? midnightGlassPalette : selectedTheme === "warm-ivory" ? warmIvoryPalette : selectedTheme === "opal-pearl" ? opalPearlPalette : (selectedTheme === "pastel-rose-5d" || selectedTheme === "pastel-rose-recessed") ? pastelRosePalette : selectedTheme === "lavender-glass" ? lavenderGlassPalette : selectedTheme === "grey-lavender" ? greyLavenderPalette : selectedTheme === "pearl-silver" ? pearlSilverPalette : selectedTheme === "frost-outline" ? frostOutlinePalette : selectedTheme === "porcelain" ? porcelainPalette : selectedTheme === "aurora" ? auroraPalette : selectedTheme === "soft-stone" ? softStonePalette : selectedTheme === "mint-ceramic" ? (pageName === "home.html" ? mintCeramicPalette.map(color => color.solid === "#dde8f1" ? { rgb:"230, 224, 239", solid:"#e6e0ef", ink:color.ink } : color) : mintCeramicPalette) : selectedTheme === "pastel-jumper" ? pastelJumperPalette : selectedTheme === "berry"
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
  palette.slice(0,3).forEach((color,index) => {
    root.style.setProperty(`--cep-palette-color-${index + 1}`,color.solid);
  });
  // Pair palette surfaces of similar brightness so both controls keep readable text.
  const controlLuminance = color => color.rgb.split(',').map(Number).map(v => {v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;}).reduce((sum,v,i) => sum + v * [.2126,.7152,.0722][i],0);
  const controlColors = palette.filter(color => selectedTheme === 'midnight-glass' ? controlLuminance(color) < .2 : controlLuminance(color) >= .3);
  const controlPalette = controlColors.length ? controlColors : palette;
  ['theme','signout'].forEach((name,index) => {
    const first = controlPalette[(index * 2) % controlPalette.length], last = controlPalette[(index * 2 + 1) % controlPalette.length];
    root.style.setProperty('--cep-' + name + '-start',first.solid);
    root.style.setProperty('--cep-' + name + '-end',last.solid);
    root.style.setProperty('--cep-' + name + '-ink',selectedTheme === 'midnight-glass' ? '#e9edf5' : '#25252b');
  });
  if (pageName === "vs.html") root.classList.add("theme-vitals-table");
  // Selected modes use the accent rather than the neutral card surface.
  const searchAccent = selectedTheme === 'original'
    ? [originalPalette[0].solid, originalPalette[0].ink]
    : selectedTheme === 'soft-stone' || selectedTheme === 'porcelain'
      ? [palette[0].ink, '#ffffff']
      : selectedTheme === 'aurora'
        ? ['#c5b0e3', palette[0].ink]
        : [`var(--quick-accent,${palette[0].solid})`, `var(--quick-accent-ink,${palette[0].ink})`];
  root.style.setProperty('--search-mode-selected', searchAccent[0]);
  root.style.setProperty('--search-mode-selected-ink', searchAccent[1]);


  const urgentCarePages = new Set(["anatomicald.html", "face.html", "hand.html", "sha.html", "abdo.html", "spine.html", "lf.html", "urgent_care.html"]);
  if (urgentCarePages.has(pageName)) root.classList.add("theme-urgent-care");
  if (selectedTheme !== "original") root.dataset.xlyneveColorTheme = selectedTheme;
  root.style.setProperty("--page-header-glass", `rgba(${pageColor.rgb}, 0.78)`);
  root.style.setProperty("--page-header-solid", pageColor.solid);
  root.style.setProperty("--page-header-ink", pageColor.ink);
  // Match the monogram to the contrast already chosen for the theme's header.
  const headerUsesLightInk = selectedTheme === "midnight-glass" || pageColor.ink.toLowerCase() === "#ffffff";
  root.style.setProperty("--page-logo-filter", headerUsesLightInk ? "brightness(0) invert(1)" : "contrast(1.08)");
  root.style.setProperty("--page-logo-opacity", headerUsesLightInk ? "0.96" : "0.85");
  const mastheadBarColors = {
    "moon-clay": "#e8e8e8",
    original: "#596b57",
    "cloud-glass":"#d4dcef",
    "midnight-glass":"#252b35",
    "warm-ivory": "#ded5c8",
    berry: "#680044",
    autumn: "#255765",
    hoya: "#40585c",
    "lake-mist": "#443d35",
    "palm-springs": "#1f2c2c",
    "quiet-stone": "#393831",
    anatomy: "#22211f",
    sculpted: "#a288b7",
    "mint-ceramic": "#dfe8e1",
    "soft-stone": "#e1e2e6",
    "lavender-glass":"#d8cdec",
    "grey-lavender":"#e8e7ef",
    "pearl-silver":"#e6e8e9",
    "frost-outline":"#d5e0e8",
    porcelain: "#e9e9e1",
    aurora: "#e1e4f2"
  };
  root.style.setProperty("--masthead-bar", mastheadBarColors[selectedTheme]);
  root.style.setProperty("--masthead-bar-ink", ["moon-clay","lavender-glass","grey-lavender","pearl-silver","frost-outline","mint-ceramic","soft-stone","aurora","porcelain"].includes(selectedTheme) ? "#414342" : "#ffffff");

  if (selectedTheme === "moon-clay") {
    const link = document.createElement("link");
    link.id = "cep-moon-clay-theme"; link.rel = "stylesheet";
    link.href = new URL("moon-clay-theme.css?v=8",document.currentScript?.src || location.href).href;
    document.head.append(link);
  }

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
       .cep-search-match, .search-highlight
    ) {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }

    html[data-xlyneve-color-theme="autumn"] table {
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
    html[data-xlyneve-color-theme="hoya"] :is(.cep-search-match,.search-highlight) { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="hoya"] table { color:#000 !important;-webkit-text-fill-color:#000 !important; }

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
    html[data-xlyneve-color-theme="lake-mist"] :is(.cep-search-match,.search-highlight) { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="lake-mist"] table { color:#000 !important;-webkit-text-fill-color:#000 !important; }
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
    html[data-xlyneve-color-theme="palm-springs"],html[data-xlyneve-color-theme="palm-springs"] body { color:#263333;background-color:#f2f3f3 !important;background-image:none !important; }
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
    html[data-xlyneve-color-theme="palm-springs"] :is(.cep-search-match,.search-highlight),html[data-xlyneve-color-theme="palm-springs"] table { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) { background:#f2f3f3 !important; background-image:none !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) main { background:rgba(251,248,245,.92) !important;border-color:rgba(255,255,255,.95) !important;box-shadow:0 18px 45px rgba(31,44,44,.16),0 3px 10px rgba(31,44,44,.08) !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .note-card { background:rgba(198,160,168,.62) !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .notepad { color:#000 !important;-webkit-text-fill-color:#000 !important;caret-color:#1f2c2c !important;background:linear-gradient(rgba(251,248,245,.94),rgba(251,248,245,.94)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(198,160,168,.25) 27px) !important; }
    html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .dot-add { background:#1f2c2c !important; }html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .dot-yellow { background:#bda487 !important; }html[data-xlyneve-color-theme="palm-springs"] body:has(.notes .notepad) .dot-purple { background:#c6a0a8 !important; }
    html[data-xlyneve-color-theme="palm-springs"] .xlyneve-theme-button { background:linear-gradient(135deg,#1f2c2c 0 34%,#c6a0a8 34% 58%,#bda487 58% 78%,#f1e7e3 78% 100%); }

    html[data-xlyneve-color-theme="pastel-jumper"] {
      --refresh-cocoa:#393644;--refresh-rose:#e7a1a1;--refresh-lime:#b9a6d2;--refresh-stone:#faf6e5;--refresh-blue:#f1edcf;--refresh-terracotta:#b9a6d2;
      --refresh-edge:rgba(255,255,255,.84);--refresh-depth:0 12px 30px rgba(57,54,68,.14);--theme-ink:#393644;
      --quick-panel:linear-gradient(145deg,rgba(250,246,229,.98),rgba(231,161,161,.62));--quick-ink:#393644;--quick-accent:#b9a6d2;--quick-accent-ink:#393644;--quick-soft:rgba(231,161,161,.38);--quick-field:rgba(250,246,229,.9);--quick-edge:rgba(185,166,210,.62);
      --copy-feedback-accent:#b9a6d2;--copy-feedback-soft:rgba(231,161,161,.5);--clinical-panel:rgba(231,161,161,.78);--clinical-field:rgba(250,246,229,.9);--clinical-accent:#b9a6d2;--clinical-accent-ink:#393644;--clinical-edge:rgba(185,166,210,.62);
      --homecal-header:linear-gradient(135deg,rgba(185,166,210,.94),rgba(231,161,161,.8));--homecal-header-ink:#393644;--homecal-control:rgba(250,246,229,.9);--homecal-control-ink:#393644;--homecal-header-edge:rgba(185,166,210,.58);--homecal-today:linear-gradient(145deg,rgba(250,246,229,.98),rgba(241,237,207,.9));--homecal-today-edge:rgba(231,161,161,.58);--homecal-today-shadow:rgba(57,54,68,.16);
    }
    html[data-xlyneve-color-theme="pastel-jumper"],html[data-xlyneve-color-theme="pastel-jumper"] body { color:#393644;background-color:#f1edcf !important;background-image:radial-gradient(circle at 14% 10%,rgba(250,246,229,.98),transparent 34%),radial-gradient(circle at 86% 20%,rgba(231,161,161,.3),transparent 40%),radial-gradient(circle at 18% 86%,rgba(185,166,210,.22),transparent 38%),linear-gradient(180deg,#faf6e5 0%,#f1edcf 58%,#f1edcf 100%) !important;background-attachment:fixed !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] body::before { opacity:.06 !important;filter:sepia(.08) hue-rotate(326deg) saturate(.82); }
    html[data-xlyneve-color-theme="pastel-jumper"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) { color:var(--card-ink,#393644) !important;-webkit-text-fill-color:var(--card-ink,#393644);background:var(--card-glass,rgba(241,237,207,.8)) !important;background-image:none !important;border-color:rgba(255,255,255,.88) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.92),0 12px 28px rgba(57,54,68,.11) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] body > header,html[data-xlyneve-color-theme="pastel-jumper"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) { color:var(--page-header-ink,#393644) !important;background-color:var(--page-header-glass,rgba(231,161,161,.74)) !important;border-color:rgba(255,255,255,.86) !important;box-shadow:0 12px 30px rgba(57,54,68,.12) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .section-admin { --section-glass:rgba(185,166,210,.92);--section-glass-hover:rgba(185,166,210,.97);--section-shadow:rgba(57,54,68,.24);--section-shadow-hover:rgba(57,54,68,.32); }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .section-home { --section-glass:rgba(241,237,207,.86);--section-glass-hover:rgba(241,237,207,.96);--section-shadow:rgba(57,54,68,.09);--section-shadow-hover:rgba(57,54,68,.16); }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .section-notes { --section-glass:rgba(231,161,161,.78);--section-glass-hover:rgba(231,161,161,.9);--section-shadow:rgba(57,54,68,.11);--section-shadow-hover:rgba(57,54,68,.18); }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .section-prescribing { --section-glass:rgba(185,166,210,.8);--section-glass-hover:rgba(185,166,210,.9);--section-shadow:rgba(57,54,68,.1);--section-shadow-hover:rgba(57,54,68,.18); }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .section-urgent { --section-glass:rgba(250,246,229,.88);--section-glass-hover:rgba(250,246,229,.97);--section-shadow:rgba(57,54,68,.08);--section-shadow-hover:rgba(57,54,68,.15); }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .main-content .section-admin > .card { color:#393644 !important;-webkit-text-fill-color:#393644 !important; }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .main-content :is(.section-home,.section-notes,.section-prescribing,.section-urgent) > .card { color:#393644 !important;-webkit-text-fill-color:#393644 !important; }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 1){background:rgba(185,166,210,.96) !important;color:#393644 !important;}html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 2){background:rgba(231,161,161,.92) !important;color:#393644 !important;}html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 3){background:rgba(185,166,210,.92) !important;color:#393644 !important;}html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 4){background:rgba(241,237,207,.96) !important;color:#393644 !important;}html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 5){background:rgba(250,246,229,.98) !important;color:#393644 !important;}
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass .universal-search,html[data-xlyneve-color-theme="pastel-jumper"] .cep-global-search-panel { color:#393644 !important;background:rgba(250,246,229,.98) !important;background-image:radial-gradient(circle at 92% 5%,rgba(231,161,161,.28),transparent 34%),linear-gradient(145deg,rgba(250,246,229,.99),rgba(241,237,207,.74)) !important;border-color:rgba(185,166,210,.68) !important;box-shadow:0 22px 58px rgba(57,54,68,.2) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] :is(#universalSearchInput,.cep-global-search-row input[type="search"]) { color:#393644 !important;-webkit-text-fill-color:#393644 !important;background:rgba(250,246,229,.96) !important;border-color:rgba(57,54,68,.24) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] :is(.universal-search-close,.universal-search-mode,.universal-search-filter,.cep-global-search-row button,.cep-global-search-modes button,.cep-global-search-filters button) { color:#393644 !important;background:rgba(241,237,207,.84) !important;border-color:rgba(231,161,161,.56) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] :is(.universal-search-mode.is-active,.universal-search-filter.is-active,.cep-global-search-modes button.is-active,.cep-global-search-filters button.is-active) { color:#393644 !important;background:rgba(185,166,210,.96) !important;border-color:transparent !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#393644 !important;-webkit-text-fill-color:#393644 !important;background:rgba(241,237,207,.72) !important;border-color:rgba(255,255,255,.92) !important;box-shadow:0 8px 22px rgba(57,54,68,.1) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] :is(.cep-search-match,.search-highlight),html[data-xlyneve-color-theme="pastel-jumper"] table { color:#000 !important;-webkit-text-fill-color:#000 !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] body:has(.notes .notepad) { background:radial-gradient(circle at 0 100%,rgba(185,166,210,.34),transparent 44%),radial-gradient(circle at 100% 100%,rgba(231,161,161,.4),transparent 48%),linear-gradient(145deg,#faf6e5 0%,#f1edcf 100%) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] body:has(.notes .notepad) main { background:rgba(250,246,229,.92) !important;border-color:rgba(255,255,255,.95) !important;box-shadow:0 18px 45px rgba(57,54,68,.16),0 3px 10px rgba(57,54,68,.08) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] body:has(.notes .notepad) .note-card { background:rgba(231,161,161,.62) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] body:has(.notes .notepad) .notepad { color:#000 !important;-webkit-text-fill-color:#000 !important;caret-color:#393644 !important;background:linear-gradient(rgba(250,246,229,.94),rgba(250,246,229,.94)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(231,161,161,.25) 27px) !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] body:has(.notes .notepad) .dot-add { background:#b9a6d2 !important; }html[data-xlyneve-color-theme="pastel-jumper"] body:has(.notes .notepad) .dot-yellow { background:#b9a6d2 !important; }html[data-xlyneve-color-theme="pastel-jumper"] body:has(.notes .notepad) .dot-purple { background:#e7a1a1 !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] .xlyneve-theme-button { background:linear-gradient(135deg,#393644 0 34%,#e7a1a1 34% 58%,#b9a6d2 58% 78%,#f1edcf 78% 100%); }

    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body :is(.dashboard-frequent-heading,.main-content > h2,.dashboard-section-toggle,.dashboard-section-toggle > span:first-child) { color:#393644 !important;-webkit-text-fill-color:#393644 !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] .xlyneve-theme-button { background:linear-gradient(135deg,#b9a6d2 0 33%,#e7a1a1 33% 66%,#f1edcf 66% 100%); }
    /* Sculpted depth for the jumper palette; surface colours stay pastel. */
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(.note-card,.card,.calculator,.vaccine-card,.med-section,.cep-global-search-result,.universal-search-native-card) {
      box-shadow:inset 3px 3px 5px rgba(255,255,255,.84),inset -4px -5px 8px rgba(185,166,210,.24),8px 11px 22px rgba(128,108,121,.19),-4px -4px 10px rgba(255,255,255,.7) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body .dashboard-frequent-circles .circle,
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(button,.glass-btn,.add-btn):not(:where(#recallBtn,.dashboard-section-toggle,.xlyneve-theme-option)) {
      box-shadow:inset 2px 2px 4px rgba(255,255,255,.88),inset -3px -4px 6px rgba(185,166,210,.28),6px 8px 16px rgba(128,108,121,.22),-3px -3px 8px rgba(255,255,255,.7) !important;
      transition:box-shadow .18s ease,transform .18s ease;
    }
    @media (hover:hover) {
      html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body .dashboard-frequent-circles .circle:hover {
        transform:translateY(-2px);
        box-shadow:inset 2px 2px 4px rgba(255,255,255,.9),inset -3px -4px 6px rgba(185,166,210,.24),9px 13px 22px rgba(128,108,121,.24),-4px -4px 10px rgba(255,255,255,.74) !important;
      }
    }
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(button,.circle):not(:where(#recallBtn,.dashboard-section-toggle,.xlyneve-theme-option)):active {
      box-shadow:inset 3px 4px 7px rgba(128,108,121,.22),inset -2px -2px 5px rgba(255,255,255,.8),2px 3px 6px rgba(128,108,121,.14) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(input:not([type="checkbox"]):not([type="radio"]),textarea,select) {
      box-shadow:inset 2px 3px 6px rgba(128,108,121,.16),inset -2px -2px 5px rgba(255,255,255,.85) !important;
    }
    @media (prefers-reduced-motion:reduce) {
      html[data-xlyneve-color-theme="pastel-jumper"] body :is(button,.circle) { transition:none !important; }
    }
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
    html[data-xlyneve-color-theme="quiet-stone"] :is(.cep-search-match,.search-highlight),html[data-xlyneve-color-theme="quiet-stone"] table { color:#000 !important;-webkit-text-fill-color:#000 !important; }
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
    html[data-xlyneve-color-theme="anatomy"] table { color:#22211f !important;-webkit-text-fill-color:#22211f !important; }
    html[data-xlyneve-color-theme="anatomy"] body:has(.notes .notepad) { background:linear-gradient(145deg,#fff9f1 0%,#eee1d1 100%) !important; }
    html[data-xlyneve-color-theme="anatomy"] body:has(.notes .notepad) main { background:rgba(255,250,244,.92) !important;border-color:rgba(34,33,31,.22) !important;box-shadow:0 18px 42px rgba(34,33,31,.14) !important; }
    html[data-xlyneve-color-theme="anatomy"] body:has(.notes .notepad) .notepad { color:#22211f !important;-webkit-text-fill-color:#22211f !important;caret-color:#22211f !important;background:linear-gradient(rgba(255,250,244,.94),rgba(255,250,244,.94)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(170,162,151,.32) 27px) !important; }
    html[data-xlyneve-color-theme="anatomy"] .xlyneve-theme-button { background:linear-gradient(135deg,#22211f 0 30%,#faf2e8 30% 54%,#aaa297 54% 74%,#f6b63f 74% 100%); }

    html[data-xlyneve-color-theme="sculpted"] {
      --refresh-cocoa:#39353a;--refresh-rose:#ba928d;--refresh-lime:#b7bdb4;--refresh-stone:#f1e6e8;--refresh-blue:#6dafbf;--refresh-terracotta:#cdb2cb;
      --refresh-edge:rgba(255,255,255,.7);--refresh-depth:12px 16px 30px rgba(57,53,58,.2);--theme-ink:#39353a;
      --quick-panel:linear-gradient(145deg,#f1e6e8,#cdb2cb);--quick-ink:#39353a;--quick-accent:#6dafbf;--quick-accent-ink:#39353a;--quick-soft:rgba(109,175,191,.42);--quick-field:rgba(241,230,232,.9);--quick-edge:rgba(255,255,255,.76);
      --copy-feedback-accent:#6dafbf;--copy-feedback-soft:rgba(186,146,141,.52);--clinical-panel:rgba(241,230,232,.94);--clinical-field:rgba(241,230,232,.9);--clinical-accent:#6dafbf;--clinical-accent-ink:#39353a;--clinical-edge:rgba(255,255,255,.72);
      --homecal-header:linear-gradient(145deg,#6dafbf,#5799a9);--homecal-header-ink:#39353a;--homecal-control:rgba(241,230,232,.88);--homecal-control-ink:#39353a;--homecal-header-edge:rgba(255,255,255,.74);--homecal-today:linear-gradient(145deg,#f1e6e8,#ba928d);--homecal-today-edge:rgba(255,255,255,.8);--homecal-today-shadow:rgba(57,53,58,.22);
    }
    html[data-xlyneve-color-theme="sculpted"],html[data-xlyneve-color-theme="sculpted"] body {
      color:#39353a;background-color:#eadde0 !important;
      background-image:radial-gradient(ellipse at 5% 4%,rgba(241,230,232,.98) 0 15%,transparent 34%),radial-gradient(ellipse at 95% 8%,rgba(109,175,191,.52) 0 14%,transparent 38%),radial-gradient(ellipse at 8% 90%,rgba(186,146,141,.42) 0 13%,transparent 36%),radial-gradient(ellipse at 92% 88%,rgba(183,189,180,.52) 0 15%,transparent 40%),linear-gradient(145deg,#f1e6e8 0%,#e4d5da 100%) !important;background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="sculpted"] body::before { opacity:.025 !important;filter:sepia(.1) saturate(.62); }
    html[data-xlyneve-color-theme="sculpted"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) {
      color:var(--card-ink,#39353a) !important;-webkit-text-fill-color:var(--card-ink,#39353a);background:var(--card-glass,linear-gradient(145deg,rgba(241,230,232,.96),rgba(205,178,203,.9))) !important;border:1px solid rgba(255,255,255,.7) !important;border-radius:24px !important;box-shadow:inset 3px 3px 5px rgba(255,255,255,.88),inset -4px -5px 9px rgba(57,53,58,.12),10px 14px 28px rgba(57,53,58,.18),-5px -5px 14px rgba(255,255,255,.62) !important;
    }
    /* Task text is part of the raised card, not a second raised input panel. */
    html:is([data-xlyneve-color-theme="sculpted"],[data-xlyneve-color-theme="pastel-jumper"]).theme-homecal body .todo-item :is(textarea,input[type="text"]) {
      background:transparent !important;
      background-image:none !important;
      border:0 !important;
      border-radius:0 !important;
      box-shadow:none !important;
    }
    html[data-xlyneve-color-theme="sculpted"] body > header,html[data-xlyneve-color-theme="sculpted"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) { color:var(--page-header-ink,#39353a) !important;background:linear-gradient(145deg,rgba(241,230,232,.94),rgba(205,178,203,.88)) !important;border:1px solid rgba(255,255,255,.7) !important;border-radius:0 0 28px 28px !important;box-shadow:inset 0 2px 2px rgba(255,255,255,.9),0 15px 30px rgba(57,53,58,.17) !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a,input,select,textarea) { border-radius:999px !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a) { border-color:rgba(255,255,255,.72) !important;box-shadow:inset 2px 2px 3px rgba(255,255,255,.9),inset -3px -4px 6px rgba(57,56,49,.13),5px 7px 14px rgba(57,56,49,.16),-3px -3px 8px rgba(255,255,255,.58) !important;transform:translateY(0);transition:transform .18s ease,box-shadow .18s ease !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a):hover { transform:translateY(-2px);box-shadow:inset 2px 2px 3px rgba(255,255,255,.94),inset -3px -4px 6px rgba(57,56,49,.1),8px 11px 20px rgba(57,56,49,.2),-4px -4px 10px rgba(255,255,255,.7) !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a):active { transform:translateY(1px);box-shadow:inset 3px 4px 8px rgba(57,56,49,.18),inset -2px -2px 5px rgba(255,255,255,.7),2px 3px 6px rgba(57,56,49,.1) !important; }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-admin { --section-glass:linear-gradient(145deg,#a288b7,#81699a);--section-glass-hover:linear-gradient(145deg,#af98c1,#8d75a5);--section-shadow:rgba(70,51,87,.24);--section-shadow-hover:rgba(70,51,87,.3); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-home { --section-glass:linear-gradient(145deg,#f1e6e8,#cdb2cb);--section-glass-hover:linear-gradient(145deg,#f8f0f2,#d7bfd5);--section-shadow:rgba(57,53,58,.15);--section-shadow-hover:rgba(57,53,58,.22); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-notes { --section-glass:linear-gradient(145deg,#6dafbf,#508f9f);--section-glass-hover:linear-gradient(145deg,#7ebbc9,#5b9aaa);--section-shadow:rgba(40,84,95,.2);--section-shadow-hover:rgba(40,84,95,.28); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-prescribing { --section-glass:linear-gradient(145deg,#ba928d,#9d746f);--section-glass-hover:linear-gradient(145deg,#c5a09b,#a9807b);--section-shadow:rgba(91,59,55,.18);--section-shadow-hover:rgba(91,59,55,.26); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .section-urgent { --section-glass:linear-gradient(145deg,#b7bdb4,#969e94);--section-glass-hover:linear-gradient(145deg,#c2c7c0,#a1a99f);--section-shadow:rgba(65,72,63,.18);--section-shadow-hover:rgba(65,72,63,.26); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important;border-radius:28px !important;box-shadow:inset 4px 4px 7px rgba(255,255,255,.72),inset -5px -6px 10px rgba(75,75,70,.13),12px 16px 28px var(--section-shadow),-6px -6px 14px rgba(255,255,255,.5) !important; }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .main-content .card-group.section-card-group > .card { color:#39353a !important;-webkit-text-fill-color:#39353a !important; }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .main-content .card-group.section-card-group.section-admin > .card { color:#fff !important;-webkit-text-fill-color:#fff !important; }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .main-content .card-group.section-card-group > .card:hover { background:var(--section-glass-hover) !important;box-shadow:inset 4px 4px 7px rgba(255,255,255,.76),inset -5px -6px 10px rgba(75,75,70,.11),15px 19px 32px var(--section-shadow-hover),-7px -7px 16px rgba(255,255,255,.58) !important;transform:translateY(-3px) scale(1.01); }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .main-content .card-group.section-card-group {
      grid-template-columns:repeat(auto-fill,minmax(184px,1fr)) !important;
    }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .main-content .card-group.section-card-group > .card {
      box-sizing:border-box !important;min-width:0 !important;padding-left:22px !important;padding-right:22px !important;
    }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass body.dashboard-hierarchy-active .dashboard-section-toggle {
      box-sizing:border-box !important;padding-left:22px !important;padding-right:18px !important;
    }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .pageTitle { color:#39353a !important;-webkit-text-fill-color:#39353a !important;text-shadow:0 2px 0 rgba(255,255,255,.76),0 6px 12px rgba(57,53,58,.16) !important; }
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 1){background:linear-gradient(145deg,#b39cc4,#81699a) !important;color:#fff !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 2){background:linear-gradient(145deg,#82bfcc,#508f9f) !important;color:#39353a !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 3){background:linear-gradient(145deg,#c8a7a3,#9d746f) !important;color:#39353a !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 4){background:linear-gradient(145deg,#dac3d8,#ac8eaa) !important;color:#39353a !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(5n + 5){background:linear-gradient(145deg,#c7cbc5,#969e94) !important;color:#39353a !important;}
    html[data-xlyneve-color-theme="sculpted"].theme-home-glass .universal-search,html[data-xlyneve-color-theme="sculpted"] .cep-global-search-panel { color:#39353a !important;background:linear-gradient(145deg,#f1e6e8,#cdb2cb) !important;border:1px solid rgba(255,255,255,.74) !important;border-radius:30px !important;box-shadow:inset 4px 4px 8px rgba(255,255,255,.8),inset -5px -6px 10px rgba(57,53,58,.12),16px 22px 45px rgba(57,53,58,.22) !important; }
    html[data-xlyneve-color-theme="sculpted"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#39353a !important;-webkit-text-fill-color:#39353a !important;background:linear-gradient(145deg,rgba(241,230,232,.98),rgba(205,178,203,.94)) !important;border-color:rgba(255,255,255,.72) !important;border-radius:20px !important;box-shadow:inset 2px 2px 3px rgba(255,255,255,.8),inset -3px -4px 6px rgba(57,53,58,.1),6px 9px 16px rgba(57,53,58,.14) !important; }
    /* Xgpt notes keep the Sculpted 5D container in every colour theme. */
    body:has(#chat) .message.bot { border-top:0 !important;padding-top:14px !important; }
    body:has(#chat) .chatBubble {
      color:#313b3a !important;-webkit-text-fill-color:#313b3a !important;
      background:linear-gradient(145deg,#ffffff 0%,#f7f8f8 58%,#eceff0 100%) !important;
      border:1px solid rgba(255,255,255,.9) !important;border-radius:24px !important;
      padding:16px 20px !important;
      box-shadow:inset 3px 3px 5px rgba(255,255,255,.98),inset -4px -5px 8px rgba(94,103,105,.1),9px 12px 22px rgba(83,92,94,.16),-5px -5px 12px rgba(255,255,255,.72) !important;
      backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
    }
    body:has(#chat) .message.user .chatBubble {
      background:linear-gradient(145deg,#fafbfb,#e8ebec) !important;
    }
    html[data-xlyneve-color-theme="sculpted"] body:has(.notes .notepad) main { border-radius:28px !important;background:linear-gradient(145deg,#f1e6e8,#cdb2cb) !important;box-shadow:inset 4px 4px 8px rgba(255,255,255,.84),inset -5px -6px 10px rgba(57,53,58,.12),14px 20px 36px rgba(57,53,58,.2) !important; }
    html[data-xlyneve-color-theme="sculpted"] body:has(.notes .notepad) .notepad { border-radius:0 !important;color:#39353a !important;-webkit-text-fill-color:#39353a !important;caret-color:#a288b7 !important;background:linear-gradient(rgba(241,230,232,.94),rgba(241,230,232,.94)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(109,175,191,.34) 27px) !important; }
    html[data-xlyneve-color-theme="sculpted"] .xlyneve-theme-button { background:linear-gradient(135deg,#a288b7 0 20%,#6dafbf 20% 40%,#ba928d 40% 60%,#cdb2cb 60% 80%,#b7bdb4 80% 100%);box-shadow:inset 2px 2px 3px rgba(255,255,255,.84),inset -3px -3px 5px rgba(57,53,58,.16),5px 7px 13px rgba(57,53,58,.18) !important; }

    html[data-xlyneve-color-theme="liquid-glass"] {
      --refresh-cocoa:#24272a;--refresh-rose:#ffb9b1;--refresh-lime:#64e1d5;--refresh-stone:#eee2d8;--refresh-blue:#dfe7e9;--refresh-terracotta:#8b65ff;
      --refresh-edge:rgba(255,255,255,.62);--refresh-depth:0 16px 36px rgba(38,42,55,.22);--theme-ink:#24272a;
      --quick-panel:linear-gradient(145deg,rgba(255,255,255,.48),rgba(238,226,216,.3));--quick-ink:#24272a;--quick-accent:#7654ef;--quick-accent-ink:#fff;--quick-soft:rgba(100,225,213,.28);--quick-field:rgba(255,255,255,.64);--quick-edge:rgba(255,255,255,.62);
      --copy-feedback-accent:#64e1d5;--copy-feedback-soft:rgba(139,101,255,.35);--clinical-panel:rgba(255,255,255,.42);--clinical-field:rgba(255,255,255,.64);--clinical-accent:#7654ef;--clinical-accent-ink:#fff;--clinical-edge:rgba(255,255,255,.64);
      --homecal-header:linear-gradient(135deg,rgba(100,225,213,.62),rgba(139,101,255,.48));--homecal-header-ink:#24272a;--homecal-control:rgba(255,255,255,.58);--homecal-control-ink:#24272a;--homecal-header-edge:rgba(255,255,255,.7);--homecal-today:linear-gradient(145deg,rgba(255,185,177,.66),rgba(139,101,255,.34));--homecal-today-edge:rgba(255,255,255,.72);--homecal-today-shadow:rgba(71,52,128,.24);
    }
    html[data-xlyneve-color-theme="liquid-glass"],html[data-xlyneve-color-theme="liquid-glass"] body {
      color:#24272a;background-color:#d7cec6 !important;
      background-image:radial-gradient(circle at 6% 8%,rgba(255,248,242,.98) 0 8%,transparent 26%),radial-gradient(circle at 89% 11%,rgba(82,105,128,.78) 0 9%,transparent 31%),radial-gradient(circle at 90% 78%,rgba(100,225,213,.52) 0 8%,transparent 28%),radial-gradient(circle at 78% 75%,rgba(139,101,255,.42) 0 5%,transparent 23%),radial-gradient(circle at 64% 72%,rgba(255,185,177,.48) 0 6%,transparent 25%),linear-gradient(135deg,#eee2d8 0%,#d8d1cd 52%,#8999a7 100%) !important;background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] body::before { opacity:.05 !important;filter:blur(.4px) saturate(1.16); }
    html[data-xlyneve-color-theme="liquid-glass"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)) {
      color:var(--card-ink,#24272a) !important;-webkit-text-fill-color:var(--card-ink,#24272a);background:var(--card-glass,linear-gradient(145deg,rgba(255,255,255,.52),rgba(238,226,216,.24))) !important;border:1px solid rgba(255,255,255,.62) !important;border-radius:22px !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.88),inset -1px -1px 0 rgba(255,255,255,.28),0 16px 32px rgba(38,42,55,.2),0 0 18px rgba(100,225,213,.08) !important;backdrop-filter:blur(22px) saturate(148%) !important;-webkit-backdrop-filter:blur(22px) saturate(148%) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] body > header,html[data-xlyneve-color-theme="liquid-glass"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) { color:var(--page-header-ink,#24272a) !important;background:linear-gradient(145deg,rgba(255,255,255,.5),rgba(223,231,233,.25)) !important;border:1px solid rgba(255,255,255,.64) !important;border-radius:0 0 26px 26px !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.86),0 18px 38px rgba(38,42,55,.19) !important;backdrop-filter:blur(26px) saturate(158%) !important;-webkit-backdrop-filter:blur(26px) saturate(158%) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a,input,select,textarea) { border-radius:999px !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a) { border:1px solid rgba(255,255,255,.68) !important;background:linear-gradient(145deg,rgba(255,255,255,.55),rgba(238,226,216,.27)) !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.9),0 9px 20px rgba(38,42,55,.2),0 0 14px rgba(100,225,213,.12) !important;backdrop-filter:blur(18px) saturate(155%) !important;-webkit-backdrop-filter:blur(18px) saturate(155%) !important;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a):hover { transform:translateY(-2px);filter:saturate(1.14);box-shadow:inset 1px 1px 0 rgba(255,255,255,.96),0 13px 26px rgba(38,42,55,.23),0 0 20px rgba(100,225,213,.28),0 0 15px rgba(139,101,255,.18) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a):active { transform:translateY(1px);box-shadow:inset 2px 3px 8px rgba(38,42,55,.14),0 4px 9px rgba(38,42,55,.14) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-admin { --section-glass:linear-gradient(145deg,rgba(53,65,79,.62),rgba(97,113,126,.3));--section-glass-hover:linear-gradient(145deg,rgba(60,75,91,.68),rgba(106,126,139,.36));--section-shadow:rgba(27,34,45,.28);--section-shadow-hover:rgba(27,34,45,.36); }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-home { --section-glass:linear-gradient(145deg,rgba(255,255,255,.6),rgba(238,226,216,.26));--section-glass-hover:linear-gradient(145deg,rgba(255,255,255,.7),rgba(247,237,228,.34));--section-shadow:rgba(38,42,55,.18);--section-shadow-hover:rgba(38,42,55,.25); }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-notes { --section-glass:linear-gradient(145deg,rgba(100,225,213,.58),rgba(100,225,213,.2));--section-glass-hover:linear-gradient(145deg,rgba(112,239,227,.68),rgba(100,225,213,.28));--section-shadow:rgba(29,111,107,.22);--section-shadow-hover:rgba(29,111,107,.3); }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-prescribing { --section-glass:linear-gradient(145deg,rgba(139,101,255,.62),rgba(139,101,255,.22));--section-glass-hover:linear-gradient(145deg,rgba(154,121,255,.72),rgba(139,101,255,.3));--section-shadow:rgba(78,54,153,.25);--section-shadow-hover:rgba(78,54,153,.34); }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-urgent { --section-glass:linear-gradient(145deg,rgba(255,185,177,.62),rgba(255,185,177,.24));--section-glass-hover:linear-gradient(145deg,rgba(255,201,194,.72),rgba(255,185,177,.32));--section-shadow:rgba(139,82,76,.2);--section-shadow-hover:rgba(139,82,76,.29); }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .main-content .card-group.section-card-group > .card { background:var(--section-glass) !important;border:1px solid rgba(255,255,255,.66) !important;border-radius:26px !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.84),0 17px 34px var(--section-shadow),0 0 20px rgba(100,225,213,.1) !important;backdrop-filter:blur(24px) saturate(155%) !important;-webkit-backdrop-filter:blur(24px) saturate(155%) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .main-content .card-group.section-card-group > .card:hover { background:var(--section-glass-hover) !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.9),0 22px 42px var(--section-shadow-hover),0 0 25px rgba(100,225,213,.2),0 0 18px rgba(139,101,255,.12) !important;transform:translateY(-3px); }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .main-content .section-admin > .card { color:#fff !important;-webkit-text-fill-color:#fff !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .pageTitle { color:#24272a !important;-webkit-text-fill-color:#24272a !important;text-shadow:0 1px 0 rgba(255,255,255,.86),0 5px 18px rgba(38,42,55,.2) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(4n + 1){background:linear-gradient(145deg,rgba(100,225,213,.84),rgba(69,184,177,.58)) !important;color:#183838 !important;}
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(4n + 2){background:linear-gradient(145deg,rgba(139,101,255,.84),rgba(104,72,220,.58)) !important;color:#fff !important;}
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(4n + 3){background:linear-gradient(145deg,rgba(255,185,177,.84),rgba(226,145,137,.58)) !important;color:#3c2b2b !important;}
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(4n + 4){background:linear-gradient(145deg,rgba(255,255,255,.7),rgba(223,231,233,.4)) !important;color:#24272a !important;}
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .universal-search,html[data-xlyneve-color-theme="liquid-glass"] .cep-global-search-panel { color:#24272a !important;background:linear-gradient(145deg,rgba(255,255,255,.58),rgba(223,231,233,.25)) !important;border:1px solid rgba(255,255,255,.68) !important;border-radius:28px !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.9),0 24px 52px rgba(38,42,55,.28),0 0 28px rgba(100,225,213,.22),0 0 22px rgba(139,101,255,.15) !important;backdrop-filter:blur(28px) saturate(165%) !important;-webkit-backdrop-filter:blur(28px) saturate(165%) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(.universal-search-native-card,.xgpt-header-style .universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) { color:#24272a !important;-webkit-text-fill-color:#24272a !important;background:linear-gradient(145deg,rgba(255,255,255,.56),rgba(238,226,216,.28)) !important;border:1px solid rgba(255,255,255,.66) !important;border-radius:18px !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.84),0 11px 24px rgba(38,42,55,.17) !important;backdrop-filter:blur(18px) saturate(150%) !important;-webkit-backdrop-filter:blur(18px) saturate(150%) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] body:has(.notes .notepad) main { border-radius:26px !important;background:linear-gradient(145deg,rgba(255,255,255,.56),rgba(238,226,216,.3)) !important;border:1px solid rgba(255,255,255,.66) !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.88),0 22px 44px rgba(38,42,55,.23),0 0 24px rgba(100,225,213,.15) !important;backdrop-filter:blur(26px) saturate(155%) !important;-webkit-backdrop-filter:blur(26px) saturate(155%) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] body:has(.notes .notepad) .notepad { color:#24272a !important;-webkit-text-fill-color:#24272a !important;caret-color:#7654ef !important;background:linear-gradient(rgba(255,255,255,.56),rgba(255,255,255,.56)) padding-box,repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(100,225,213,.32) 27px) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] .xlyneve-theme-button { background:linear-gradient(135deg,#eee2d8 0 22%,#64e1d5 22% 44%,#8b65ff 44% 66%,#ffb9b1 66% 83%,#dfe7e9 83% 100%);box-shadow:inset 1px 1px 0 rgba(255,255,255,.88),0 8px 18px rgba(38,42,55,.22),0 0 14px rgba(100,225,213,.28),0 0 12px rgba(139,101,255,.2) !important; }

    /* Liquid Glass: neutral translucent material with concentrated edge light. */
    html[data-xlyneve-color-theme="liquid-glass"],html[data-xlyneve-color-theme="liquid-glass"] body {
      background-color:#aaa39f !important;
      background-image:
        radial-gradient(ellipse at 12% 5%,rgba(255,242,230,.94) 0 7%,transparent 25%),
        radial-gradient(ellipse at 96% 8%,rgba(50,67,82,.88) 0 11%,transparent 35%),
        radial-gradient(ellipse at 6% 84%,rgba(239,220,207,.68) 0 9%,transparent 31%),
        radial-gradient(ellipse at 94% 88%,rgba(67,82,96,.8) 0 12%,transparent 36%),
        radial-gradient(circle at 78% 68%,rgba(100,225,213,.34) 0 2%,transparent 16%),
        radial-gradient(circle at 85% 73%,rgba(139,101,255,.3) 0 2%,transparent 15%),
        linear-gradient(118deg,#d9cec5 0%,#c0b7b1 48%,#7e8c98 100%) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)),
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .main-content .card-group.section-card-group > .card {
      color:#222629 !important;-webkit-text-fill-color:#222629 !important;
      background:
        radial-gradient(circle at 100% 100%,rgba(100,225,213,.12),transparent 30%),
        radial-gradient(circle at 0 0,rgba(255,255,255,.28),transparent 42%),
        linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.09)) !important;
      border:1px solid rgba(255,255,255,.6) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.82),inset -1px -1px 0 rgba(255,255,255,.18),0 18px 32px rgba(28,35,43,.3),0 3px 7px rgba(28,35,43,.18) !important;
      backdrop-filter:blur(30px) saturate(132%) !important;-webkit-backdrop-filter:blur(30px) saturate(132%) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .main-content .card-group.section-card-group > .card:hover {
      background:radial-gradient(circle at 100% 100%,rgba(100,225,213,.2),transparent 32%),radial-gradient(circle at 0 0,rgba(139,101,255,.1),transparent 38%),linear-gradient(145deg,rgba(255,255,255,.38),rgba(255,255,255,.12)) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.9),0 22px 40px rgba(28,35,43,.34),0 0 18px rgba(100,225,213,.22),0 0 12px rgba(139,101,255,.14) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] body > header,html[data-xlyneve-color-theme="liquid-glass"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) {
      background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.08)) !important;
      border-color:rgba(255,255,255,.58) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.78),0 18px 38px rgba(28,35,43,.28) !important;
      backdrop-filter:blur(32px) saturate(135%) !important;-webkit-backdrop-filter:blur(32px) saturate(135%) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a) {
      color:#24272a !important;-webkit-text-fill-color:#24272a !important;
      background:linear-gradient(145deg,rgba(255,255,255,.5),rgba(255,255,255,.14)) !important;
      border-color:rgba(255,255,255,.68) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.9),0 10px 20px rgba(28,35,43,.28),0 2px 5px rgba(28,35,43,.14) !important;
      backdrop-filter:blur(24px) saturate(138%) !important;-webkit-backdrop-filter:blur(24px) saturate(138%) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] :is(
      .universal-search-mode.is-active,.universal-search-filter.is-active,
      .cep-global-search-modes button.is-active,.cep-global-search-filters button.is-active,
      .qc-tab.active,.qc-strength-btn.active,.pr-toggle.active
    ) {
      color:#fff !important;-webkit-text-fill-color:#fff !important;
      background:linear-gradient(135deg,rgba(139,101,255,.96),rgba(113,78,238,.9)) !important;
      border-color:rgba(218,207,255,.84) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.42),0 9px 20px rgba(75,46,166,.38),0 0 18px rgba(139,101,255,.5) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] :is(.add-btn,.checklist-add-btn,#addBtn,#addNoteBtn) {
      background:linear-gradient(135deg,rgba(100,225,213,.92),rgba(61,194,187,.86)) !important;
      border-color:rgba(208,255,250,.86) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.5),0 10px 22px rgba(34,135,130,.34),0 0 18px rgba(100,225,213,.46) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] :is(input,select,textarea,[contenteditable="true"]) {
      color:#24272a !important;-webkit-text-fill-color:#24272a !important;
      background:rgba(255,255,255,.58) !important;border:1px solid rgba(255,255,255,.7) !important;
      box-shadow:inset 2px 3px 8px rgba(38,42,55,.1),inset -1px -1px 0 rgba(255,255,255,.72) !important;
      backdrop-filter:blur(18px) saturate(128%) !important;-webkit-backdrop-filter:blur(18px) saturate(128%) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .dashboard-frequent-circles .circle {
      border:1px solid rgba(255,255,255,.68) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.7),0 13px 24px rgba(28,35,43,.3),0 0 14px rgba(100,225,213,.14) !important;
      backdrop-filter:blur(22px) saturate(142%) !important;-webkit-backdrop-filter:blur(22px) saturate(142%) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .universal-search,html[data-xlyneve-color-theme="liquid-glass"] .cep-global-search-panel {
      background:radial-gradient(circle at 100% 100%,rgba(100,225,213,.18),transparent 28%),radial-gradient(circle at 0 100%,rgba(139,101,255,.12),transparent 26%),linear-gradient(145deg,rgba(255,255,255,.38),rgba(255,255,255,.1)) !important;
      border-color:rgba(255,255,255,.64) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.84),0 25px 54px rgba(28,35,43,.34),0 0 24px rgba(100,225,213,.24),0 0 18px rgba(139,101,255,.16) !important;
      backdrop-filter:blur(34px) saturate(142%) !important;-webkit-backdrop-filter:blur(34px) saturate(142%) !important;
    }

    /* Soft Studio: premium tactile UI with restrained neumorphic depth. */
    html[data-xlyneve-color-theme="liquid-glass"],html[data-xlyneve-color-theme="liquid-glass"] body {
      color:#33413f !important;background-color:#eeeae3 !important;
      background-image:radial-gradient(circle at 10% 10%,rgba(255,255,255,.92),transparent 31%),radial-gradient(circle at 88% 72%,rgba(230,201,195,.25),transparent 27%),linear-gradient(145deg,#f7f4ee 0%,#efebe4 58%,#e8e6df 100%) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] body::before { opacity:0 !important;filter:none !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.day:not(.empty):not(.today),.todo-item:not(.priority)),
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .main-content .card-group.section-card-group > .card {
      color:#33413f !important;-webkit-text-fill-color:#33413f !important;
      background:linear-gradient(145deg,#fbfaf6 0%,#f0f1eb 70%,#e2eee9 100%) !important;
      border:1px solid rgba(166,183,178,.55) !important;border-radius:24px !important;
      box-shadow:inset 2px 2px 1px rgba(255,255,255,.95),inset -1px -1px 1px rgba(157,174,169,.16),10px 12px 24px rgba(94,105,101,.13),-7px -7px 18px rgba(255,255,255,.74) !important;
      backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-admin > .card { background:linear-gradient(145deg,#fcfbf7,#edf2ed 68%,#dbece6) !important;color:#33413f !important;-webkit-text-fill-color:#33413f !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-home > .card { background:linear-gradient(145deg,#fffdfa,#f1f2ec 68%,#deeee9) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-notes > .card { background:linear-gradient(145deg,#fdfcf8,#eaf2ee 70%,#d4e9e2) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-prescribing > .card { background:linear-gradient(145deg,#fffdfa,#f6efec 70%,#eedbd6) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .section-urgent > .card { background:linear-gradient(145deg,#fffdfa,#f4ece9 68%,#e9d4cf) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .main-content .card-group.section-card-group > .card:hover {
      transform:translateY(-3px) !important;filter:none !important;
      box-shadow:inset 2px 2px 1px rgba(255,255,255,.98),inset -1px -1px 1px rgba(157,174,169,.14),13px 16px 28px rgba(94,105,101,.17),-8px -8px 20px rgba(255,255,255,.8) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] body > header,html[data-xlyneve-color-theme="liquid-glass"] :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) {
      color:#33413f !important;background:linear-gradient(180deg,#fbfaf6,#f2f0e9) !important;
      border-color:rgba(166,183,178,.48) !important;border-radius:0 0 24px 24px !important;
      box-shadow:inset 0 -1px 0 rgba(255,255,255,.78),0 10px 22px rgba(94,105,101,.12) !important;
      backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .pageTitle { color:#354240 !important;-webkit-text-fill-color:#354240 !important;text-shadow:0 1px 0 rgba(255,255,255,.86) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a) {
      color:#465350 !important;-webkit-text-fill-color:#465350 !important;
      background:linear-gradient(145deg,#fffefa,#eae9e3) !important;
      border:1px solid rgba(166,183,178,.46) !important;border-radius:999px !important;
      box-shadow:inset 1px 1px 1px #fff,6px 7px 14px rgba(94,105,101,.14),-4px -4px 10px rgba(255,255,255,.72) !important;
      backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a):hover { transform:translateY(-1px);filter:none !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.98),0 9px 17px rgba(82,101,96,.15) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(button,.glass-btn,.header-btn,.add-btn,.top-links a):active { transform:translateY(0);box-shadow:inset 2px 3px 7px rgba(82,101,96,.13),inset -1px -1px 0 rgba(255,255,255,.8),0 2px 5px rgba(82,101,96,.07) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(
      .universal-search-mode.is-active,.universal-search-filter.is-active,
      .cep-global-search-modes button.is-active,.cep-global-search-filters button.is-active,
      .qc-tab.active,.qc-strength-btn.active,.pr-toggle.active
    ) {
      color:#fff !important;-webkit-text-fill-color:#fff !important;
      background:linear-gradient(145deg,#9bd5ca,#78bdb3) !important;border-color:rgba(215,246,240,.74) !important;
      box-shadow:inset 1px 1px 0 rgba(255,255,255,.48),0 7px 14px rgba(69,128,119,.2) !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"] :is(.add-btn,.checklist-add-btn,#addBtn,#addNoteBtn) { color:#fff !important;-webkit-text-fill-color:#fff !important;background:linear-gradient(145deg,#a8dcd3,#83c5bb) !important;border-color:rgba(219,248,243,.78) !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.5),0 7px 14px rgba(69,128,119,.2) !important; }
    html[data-xlyneve-color-theme="liquid-glass"] :is(input,select,textarea,[contenteditable="true"]) {
      color:#465350 !important;-webkit-text-fill-color:#465350 !important;
      background:#efeee8 !important;border:1px solid rgba(166,183,178,.38) !important;border-radius:16px !important;
      box-shadow:inset 3px 4px 8px rgba(94,105,101,.11),inset -2px -2px 4px rgba(255,255,255,.8) !important;
      backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(odd) { color:#3e4c49 !important;background:radial-gradient(circle at 70% 75%,rgba(178,224,215,.46),transparent 55%),linear-gradient(145deg,rgba(255,255,255,.72),rgba(240,244,239,.44)) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .dashboard-frequent-circles .circle:nth-child(even) { color:#4d4847 !important;background:radial-gradient(circle at 70% 75%,rgba(246,214,209,.46),transparent 55%),linear-gradient(145deg,rgba(255,255,255,.72),rgba(248,240,237,.44)) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .dashboard-frequent-circles .circle { border-color:rgba(173,194,188,.34) !important;box-shadow:inset 1px 1px 0 rgba(255,255,255,.94),0 9px 18px rgba(82,101,96,.14) !important;backdrop-filter:blur(16px) saturate(108%) !important;-webkit-backdrop-filter:blur(16px) saturate(108%) !important; }
    html[data-xlyneve-color-theme="liquid-glass"].theme-home-glass .universal-search,html[data-xlyneve-color-theme="liquid-glass"] .cep-global-search-panel {
      color:#33413f !important;background:linear-gradient(145deg,#fffefa,#edf1eb 70%,#dcece7) !important;
      border:1px solid rgba(166,183,178,.54) !important;border-radius:26px !important;
      box-shadow:inset 2px 2px 1px rgba(255,255,255,.98),12px 16px 34px rgba(94,105,101,.18),-8px -8px 22px rgba(255,255,255,.76) !important;
      backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
    }

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
    html[data-xlyneve-color-theme] body :is(:is(#quickCalc,#timeCalculator), #quickInteleviewer, #tabletCalculator, #syrupCalculator) {
      color: var(--quick-ink) !important;
      background: var(--quick-panel) !important;
      border-color: var(--quick-edge) !important;
      box-shadow: 0 16px 34px color-mix(in srgb, var(--quick-accent) 18%, transparent), inset 0 1px 0 rgba(255,255,255,.72) !important;
    }
    html[data-xlyneve-color-theme] body :is(:is(#quickCalc,#timeCalculator), #quickInteleviewer, #tabletCalculator, #syrupCalculator)
      :is(.qc-title, .qi-title, .qt-title, .qs-title, .qc-label, .qt-label, .qs-label, .qs-strength-word) {
      color: var(--quick-ink) !important;
      -webkit-text-fill-color: var(--quick-ink) !important;
    }
    html[data-xlyneve-color-theme] body :is(:is(#quickCalc,#timeCalculator), #tabletCalculator, #syrupCalculator)
      :is(input, select) {
      color: var(--quick-ink) !important;
      -webkit-text-fill-color: var(--quick-ink) !important;
      background: var(--quick-field) !important;
      border-color: var(--quick-edge) !important;
      caret-color: var(--quick-accent) !important;
    }
    html[data-xlyneve-color-theme] body :is(:is(#quickCalc,#timeCalculator), #tabletCalculator, #syrupCalculator)
      :is(input, select):focus {
      border-color: var(--quick-accent) !important;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--quick-accent) 20%, transparent) !important;
      outline: none !important;
    }
    html[data-xlyneve-color-theme] body :is(#quickCalc,#timeCalculator) :is(.qc-tab, .qc-strength-btn, .qc-btn),
    html[data-xlyneve-color-theme] body #quickInteleviewer :is(.qi-row-item, .qi-copy-mini) {
      color: var(--quick-ink) !important;
      -webkit-text-fill-color: var(--quick-ink) !important;
      background: var(--quick-field) !important;
      border-color: var(--quick-edge) !important;
    }
    html[data-xlyneve-color-theme] body :is(#quickCalc,#timeCalculator) :is(.qc-tab, .qc-strength-btn):is(.active, [aria-selected="true"]),
    html[data-xlyneve-color-theme] body :is(#quickCalc,#timeCalculator) .qc-btn:hover,
    html[data-xlyneve-color-theme] body #quickInteleviewer :is(.qi-row-item, .qi-copy-mini):hover {
      color: var(--quick-accent-ink) !important;
      -webkit-text-fill-color: var(--quick-accent-ink) !important;
      background: var(--quick-accent) !important;
      border-color: var(--quick-accent) !important;
    }
    html[data-xlyneve-color-theme] body :is(:is(#quickCalc,#timeCalculator), #tabletCalculator, #syrupCalculator)
      :is(.qc-results, .qt-formula, .qt-result, .qs-formula, .qs-result, .qc-pill) {
      color: var(--quick-ink) !important;
      -webkit-text-fill-color: var(--quick-ink) !important;
      background: var(--quick-soft) !important;
      border-color: var(--quick-edge) !important;
    }
    html[data-xlyneve-color-theme] body :is(:is(#quickCalc,#timeCalculator), #quickInteleviewer, #tabletCalculator, #syrupCalculator)
      :is(.qc-toggle, .qi-toggle, .qt-toggle, .qs-toggle) {
      color: var(--quick-accent-ink) !important;
      -webkit-text-fill-color: var(--quick-accent-ink) !important;
      background: var(--quick-accent) !important;
      border-color: color-mix(in srgb, var(--quick-accent) 72%, #000) !important;
    }
    html[data-xlyneve-color-theme] body :is(#quickCalc,#timeCalculator) .qc-tabs::-webkit-scrollbar-thumb {
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
  themeStyle.textContent += `
    html:is([data-xlyneve-color-theme="sculpted"],[data-xlyneve-color-theme="pastel-jumper"]).theme-homecal body .todo-item {
      border-radius:22px !important;
      border:1px solid rgba(255,255,255,.75) !important;
      box-shadow:inset 4px 4px 7px rgba(255,255,255,.8),inset -5px -6px 9px rgba(102,81,115,.28),6px 9px 13px rgba(102,81,115,.3),-3px -3px 7px rgba(255,255,255,.65) !important;
    }
  `;
  themeStyle.textContent += `
    html:is([data-xlyneve-color-theme="sculpted"],[data-xlyneve-color-theme="pastel-jumper"]).theme-homecal body .todo-item:not(.priority) {
      background:linear-gradient(145deg,rgba(255,255,255,.3),transparent 42%,rgba(128,108,121,.16)),var(--card-glass,#d1bbd3) !important;
    }
  `;
  // Default card labels follow their actual themed parent; explicit note colours stay authored.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme] body :is(.note-card,.card,.acc-item,.med-section,.vaccine-section,.vaccine-card)[data-shared-palette-color="true"] :is(.note-text,.note-title,.card-title,h2,h3,h4,p,li):not([style*="color"]) {
      color:inherit !important;
      -webkit-text-fill-color:currentColor !important;
    }
    html[data-xlyneve-color-theme].theme-homecal body .todo-item:not(.done):not(.priority) :is(textarea,input[type="text"]) {
      color:var(--card-ink,#22211f) !important;
      -webkit-text-fill-color:currentColor !important;
    }
  `;
  // Final overrides include the selectors used by page-specific card themes.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(.note-card,.note-tile,.med-card,.acc-item,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.template-meta-card,.dose-modal-card,.cep-concept-search-result,.cep-global-search-result,.universal-search-native-card):not(#recallBtn),
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body .main-content .card-group.section-card-group > .card,
    html[data-xlyneve-color-theme="pastel-jumper"].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback),
    html[data-xlyneve-color-theme="pastel-jumper"].theme-clinical body #pinnedNotesList > .pinned-note,
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      box-shadow:inset 4px 4px 7px rgba(255,255,255,.9),inset -5px -6px 10px rgba(185,166,210,.32),10px 14px 24px rgba(128,108,121,.24),-5px -5px 12px rgba(255,255,255,.75) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body .main-content .card-group.section-card-group > .card:hover {
      box-shadow:inset 4px 4px 7px rgba(255,255,255,.94),inset -5px -6px 10px rgba(185,166,210,.28),12px 17px 28px rgba(128,108,121,.26),-6px -6px 14px rgba(255,255,255,.78) !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="sculpted"].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback) {
      box-shadow:
        inset 3px 3px 6px rgba(255,255,255,.88),
        inset -4px -5px 9px rgba(91,71,105,.15),
        7px 10px 20px rgba(57,53,58,.18),
        -3px -3px 9px rgba(255,255,255,.55) !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="mint-ceramic"] {
      --theme-ink:#353c38; --theme-muted-ink:#626b65;
      --refresh-cocoa:#353c38; --refresh-rose:#f0e1e5; --refresh-lime:#f2efd9;
      --refresh-stone:#e6e0ef; --refresh-blue:#dde8f1; --refresh-terracotta:#b8c9ad;
      --refresh-edge:#f8faf8; --refresh-depth:8px 10px 18px rgba(77,87,99,.24);
      --mint-grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.055' filter='url(%23grain)'/%3E%3C/svg%3E");
      --mint-raised:inset 2px 2px 3px rgba(255,255,251,.95),inset -3px -4px 5px rgba(93,105,116,.18),0 3px 2px rgba(82,94,104,.2),7px 10px 18px rgba(77,87,99,.23),-5px -5px 12px rgba(255,255,251,.88);
      --mint-pressed:inset 3px 4px 7px rgba(83,98,108,.3),inset -3px -3px 6px rgba(255,255,251,.95);
      --quick-panel:linear-gradient(145deg,#dfe8e1,#fafaf7); --quick-ink:#353c38;
      --quick-accent:#dde8f1; --quick-accent-ink:#353c38; --quick-soft:#dfe8e1; --quick-field:#f5f7f4; --quick-edge:#f8faf8;
      --clinical-panel:#fafaf7; --clinical-field:#f5f7f4; --clinical-accent:#b8c9ad; --clinical-accent-ink:#353c38; --clinical-edge:#f8faf8;
      --copy-feedback-accent:#b8c9ad; --copy-feedback-soft:#dfe8e1;
      --homecal-header:linear-gradient(145deg,#dde8f1,#fafaf7); --homecal-header-ink:#353c38;
      --homecal-control:#dfe8e1; --homecal-control-ink:#353c38; --homecal-header-edge:#f8faf8;
      --homecal-today:linear-gradient(145deg,#f2efd9,#e7e0bc); --homecal-today-edge:#f8faf8; --homecal-today-shadow:rgba(77,87,99,.24);
    }
    html[data-xlyneve-color-theme="mint-ceramic"],html[data-xlyneve-color-theme="mint-ceramic"] body {
      color:#353c38; background-color:#fafaf7 !important;
      background-image:var(--mint-grain),linear-gradient(145deg,#edf3f0 0%,#eef2f6 48%,#ede8f3 100%) !important;
      background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"] body::before { background:none !important;opacity:0 !important; }
    html[data-xlyneve-color-theme="mint-ceramic"] body :is(.note-card,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.template-card,.panel,.input-panel,.pinned-note,.day:not(.empty):not(.today),.todo-item:not(.priority)),
    html[data-xlyneve-color-theme="mint-ceramic"].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback),
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body .main-content .card-group.section-card-group > .card,
    html[data-xlyneve-color-theme="mint-ceramic"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      color:var(--card-ink,#353c38) !important;
      background-color:var(--card-solid,#fafaf7) !important;
      background-image:var(--mint-grain),linear-gradient(145deg,color-mix(in srgb,var(--card-solid,#fafaf7) 92%,white),var(--card-solid,#fafaf7)) !important;
      border:1px solid rgba(255,255,248,.82) !important;
      border-radius:22px !important; box-shadow:var(--mint-raised) !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"] body > header,
    html[data-xlyneve-color-theme="mint-ceramic"] body :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) {
      color:var(--page-header-ink,#353c38) !important; background-color:var(--page-header-solid,#fafaf7) !important;
      background-image:var(--mint-grain),linear-gradient(145deg,color-mix(in srgb,var(--page-header-solid,#fafaf7) 92%,white),var(--page-header-solid,#fafaf7)) !important;
      border-color:#f8faf8 !important; box-shadow:var(--mint-raised) !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"] body :is(button,.glass-btn,.add-btn,.header-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) {
      color:#353c38 !important; -webkit-text-fill-color:#353c38 !important;
      background-color:var(--mint-control-surface,#dde8f1) !important;
      background-image:var(--mint-grain),linear-gradient(145deg,var(--mint-control-surface,#dde8f1),var(--mint-control-surface,#dde8f1)) !important;
      border-color:#fafaf7 !important; box-shadow:var(--mint-raised) !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"] body :is(button,.glass-btn,.add-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)):active {
      box-shadow:var(--mint-pressed) !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      color:#353c38; background:#f5f7f4 !important;
      border-color:#fafaf7 !important; box-shadow:var(--mint-pressed) !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"] body :is(input,select,textarea,.editableNote,#noteText.editable):focus-visible {
      outline:2px solid #b8c9ad; outline-offset:3px;
    }
    html[data-xlyneve-color-theme="mint-ceramic"] body .todo-item :is(textarea,input[type="text"]),
    html[data-xlyneve-color-theme="mint-ceramic"] body #notes .notepad {
      background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body .dashboard-section-toggle {
      box-sizing:border-box !important; min-height:40px; padding:6px 22px !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body .dashboard-section-chevron {
      font-size:16px; line-height:1; flex:0 0 20px; text-align:center;
    }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body :is(.dashboard-frequent-heading,.main-content > h2,.dashboard-section-toggle) {
      color:#353c38 !important;-webkit-text-fill-color:#353c38 !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle {
      color:var(--mint-button-ink,#353c38) !important;-webkit-text-fill-color:var(--mint-button-ink,#353c38) !important;
      background-color:var(--mint-button-surface,#dde8f1) !important;
      background-image:var(--mint-grain),linear-gradient(145deg,color-mix(in srgb,var(--mint-button-surface,#dde8f1) 92%,white),var(--mint-button-surface,#dde8f1)) !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-section-toggle { border-radius:18px !important; }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(6n + 1) { --mint-button-surface:#dfe8e1;--mint-button-ink:#353c38; }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(6n + 2) { --mint-button-surface:#dde8f1;--mint-button-ink:#353c38; }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(6n + 3) { --mint-button-surface:#e6e0ef;--mint-button-ink:#353c38; }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(6n + 4) { --mint-button-surface:#f0e1e5;--mint-button-ink:#353c38; }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(6n + 5) { --mint-button-surface:#f2efd9;--mint-button-ink:#353c38; }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(6n + 6) { --mint-button-surface:#fafaf7;--mint-button-ink:#353c38; }
    html[data-xlyneve-color-theme="mint-ceramic"] .xlyneve-theme-button {
      background:linear-gradient(135deg,#dde8f1 0 50%,#fafaf7 50% 100%);color:#353c38;
    }
    @media (prefers-reduced-motion:no-preference) {
      html[data-xlyneve-color-theme="mint-ceramic"] body :is(button,.glass-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)) { transition:box-shadow .15s ease; }
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body .dashboard-frequent-section > :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      background:var(--mint-grain),linear-gradient(145deg,var(--mint-control-surface,#dde8f1),var(--mint-control-surface,#dde8f1)) !important;
      color:#353c38 !important;box-shadow:var(--mint-raised) !important;
      border:1px solid #fafaf7 !important;border-radius:16px !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="mint-ceramic"] body #notes .note-card :is(.notepad,.timestamp) {
      color:var(--card-ink,#353c38) !important;-webkit-text-fill-color:var(--card-ink,#353c38) !important;
    }
  `;

  // Home uses lavender in place of blue, alongside the sage, blush and cream palette.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass {
      --mint-control-surface:#e6e0ef; --quick-accent:#e6e0ef; --refresh-blue:#e6e0ef;
    }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass,
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body {
      background-image:var(--mint-grain),linear-gradient(145deg,#f5f3f8 0%,#f5f5ef 55%,#f0edf4 100%) !important;
    }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(6n + 2) {
      --mint-button-surface:#e6e0ef;
    }
    html[data-xlyneve-color-theme="mint-ceramic"].theme-home-glass .xlyneve-theme-button {
      background:linear-gradient(135deg,#e6e0ef 0 50%,#fafaf7 50% 100%);
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="soft-stone"] {
      --cep-highlight-paper:#e3dfd5;
      --cep-highlight-shadow:0 1px 2px rgba(80,84,96,.04),inset 0 1px 0 rgba(255,255,255,.4);
      --cep-highlight-dark-paper:#4c5059;
      --cep-highlight-dark-shadow:0 1px 2px rgba(32,36,45,.08),inset 0 1px 0 rgba(255,255,255,.08);
      --theme-ink:#303238; --theme-muted-ink:#72757c;
      --refresh-cocoa:#303238; --refresh-rose:#e1e2e6; --refresh-lime:#e1e2e6;
      --refresh-stone:#e1e2e6; --refresh-blue:#e1e2e6; --refresh-terracotta:#dfb53e;
      --refresh-edge:transparent; --refresh-depth:8px 10px 18px rgba(68,73,59,.24);
      --stone-grain:none;
      --stone-raised:inset 1px 1px 2px rgba(255,255,255,.25),6px 6px 12px rgba(166,169,179,.42),-6px -6px 12px rgba(255,255,255,.82);
      --stone-pressed:inset 4px 4px 7px rgba(166,169,179,.42),inset -4px -4px 7px rgba(255,255,255,.8);
      --quick-panel:linear-gradient(145deg,#e1e2e6,#e1e2e6); --quick-ink:#303238;
      --quick-accent:#e1e2e6; --quick-accent-ink:#303238; --quick-soft:#e1e2e6; --quick-field:#e1e2e6; --quick-edge:transparent;
      --clinical-panel:#e1e2e6; --clinical-field:#e1e2e6; --clinical-accent:#dfb53e; --clinical-accent-ink:#303238; --clinical-edge:transparent;
      --copy-feedback-accent:#dfb53e; --copy-feedback-soft:#e1e2e6;
      --homecal-header:linear-gradient(145deg,#e1e2e6,#e1e2e6); --homecal-header-ink:#303238;
      --homecal-control:#e1e2e6; --homecal-control-ink:#303238; --homecal-header-edge:transparent;
      --homecal-today:linear-gradient(145deg,#fff9e5,#f2e4ac); --homecal-today-edge:transparent; --homecal-today-shadow:rgba(68,73,59,.24);
    }
    html[data-xlyneve-color-theme="soft-stone"],html[data-xlyneve-color-theme="soft-stone"] body {
      color:#303238; background-color:#e1e2e6 !important;
      background-image:none !important;
      background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="soft-stone"] body::before { background:none !important;opacity:0 !important; }
    html[data-xlyneve-color-theme="soft-stone"] body :is(.note-card,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.template-card,.panel,.input-panel,.pinned-note,.day:not(.empty):not(.today),.todo-item:not(.priority)),
    html[data-xlyneve-color-theme="soft-stone"].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback),
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body .main-content .card-group.section-card-group > .card,
    html[data-xlyneve-color-theme="soft-stone"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      color:#303238 !important;
      background-color:#e1e2e6 !important;
      background-image:none !important;
      border:1px solid rgba(255,255,248,.82) !important;
      border-radius:24px !important; box-shadow:var(--stone-raised) !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="soft-stone"] body > header,
    html[data-xlyneve-color-theme="soft-stone"] body :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) {
      color:var(--page-header-ink,#303238) !important; background-color:#e1e2e6 !important;
      background-image:none !important;
      border-color:transparent !important; box-shadow:var(--stone-raised) !important;
    }
    html[data-xlyneve-color-theme="soft-stone"] body :is(button,.glass-btn,.add-btn,.header-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) {
      color:#303238 !important; -webkit-text-fill-color:#303238 !important;
      background-color:#e1e2e6 !important;
      background-image:none !important;
      border-color:#e1e2e6 !important; box-shadow:var(--stone-raised) !important;
    }
    html[data-xlyneve-color-theme="soft-stone"] body :is(button,.glass-btn,.add-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)):active {
      box-shadow:var(--stone-pressed) !important;
    }
    html[data-xlyneve-color-theme="soft-stone"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      color:#303238; background:#e1e2e6 !important;
      border-color:#e1e2e6 !important; box-shadow:var(--stone-pressed) !important;
    }
    html[data-xlyneve-color-theme="soft-stone"] body :is(input,select,textarea,.editableNote,#noteText.editable):focus-visible {
      outline:2px solid #dfb53e; outline-offset:3px;
    }
    html[data-xlyneve-color-theme="soft-stone"] body .todo-item :is(textarea,input[type="text"]),
    html[data-xlyneve-color-theme="soft-stone"] body #notes .notepad {
      background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body .dashboard-section-toggle {
      box-sizing:border-box !important; min-height:40px; padding:6px 22px !important;
    }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body .dashboard-section-chevron {
      font-size:16px; line-height:1; flex:0 0 20px; text-align:center;
    }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body :is(.dashboard-frequent-heading,.main-content > h2,.dashboard-section-toggle) {
      color:#303238 !important;-webkit-text-fill-color:#303238 !important;
    }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle {
      color:var(--stone-button-ink,#303238) !important;-webkit-text-fill-color:var(--stone-button-ink,#303238) !important;
      background-color:var(--stone-button-surface,#e1e2e6) !important;
      background-image:none !important;
    }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body.dashboard-hierarchy-active .dashboard-section-toggle { border-radius:18px !important; }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 1) { --stone-button-surface:#e1e2e6;--stone-button-ink:#303238; }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 2) { --stone-button-surface:#e1e2e6;--stone-button-ink:#303238; }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 3) { --stone-button-surface:#e1e2e6;--stone-button-ink:#303238; }
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 4) { --stone-button-surface:#e1e2e6;--stone-button-ink:#303238; }
    html[data-xlyneve-color-theme="soft-stone"] .xlyneve-theme-button {
      background:linear-gradient(135deg,#e1e2e6 0 50%,#e1e2e6 50% 100%);color:#303238;
    }
    @media (prefers-reduced-motion:no-preference) {
      html[data-xlyneve-color-theme="soft-stone"] body :is(button,.glass-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)) { transition:box-shadow .15s ease; }
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="soft-stone"].theme-home-glass body .dashboard-frequent-section > :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      background:#e1e2e6 !important;
      color:#303238 !important;box-shadow:var(--stone-raised) !important;
      border:1px solid #e1e2e6 !important;border-radius:16px !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="soft-stone"] body #notes .note-card :is(.notepad,.timestamp) {
      color:#303238 !important;-webkit-text-fill-color:#303238 !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="soft-stone"] body :is(.note-card,.card,.med-card,.todo-item) {
      color:#303238 !important;
    }
    html[data-xlyneve-color-theme="soft-stone"] body .todo-item :is(textarea,input[type="text"]) {
      background:transparent !important;box-shadow:none !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="soft-stone"] body :is(input[type="checkbox"],input[type="radio"]) { accent-color:#dfb53e; }
    html[data-xlyneve-color-theme="soft-stone"] body :is(.dashboard-section-chevron,.note-actions-toggle)::before { color:#72757c; }
    html[data-xlyneve-color-theme="soft-stone"] body .dashboard-section-toggle { border-color:transparent !important; }
    html[data-xlyneve-color-theme="soft-stone"] body .xlyneve-theme-button { background:#e1e2e6;box-shadow:var(--stone-raised); }
  `;

  // Search cards share the clean raised material, including dynamically added results.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="soft-stone"] body :is(.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) {
      background:#e1e2e6 !important;
      background-image:none !important;
      color:#303238 !important;
      border:1px solid transparent !important;
      border-radius:24px !important;
      box-shadow:var(--stone-raised) !important;
      backdrop-filter:none !important;
      -webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="soft-stone"] body :is(.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result):focus-visible {
      outline:2px solid #dfb53e;
      outline-offset:3px;
    }
    html[data-xlyneve-color-theme="soft-stone"] body :is(.universal-search-native-card,.cep-global-search-result) .cep-source-note-display {
      background:transparent !important;
      box-shadow:none !important;
      backdrop-filter:none !important;
      -webkit-backdrop-filter:none !important;
    }
  `;

  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] {
      --cep-highlight-paper:#e5ddd7;
      --cep-highlight-shadow:0 1px 2px rgba(80,84,96,.04),inset 0 1px 0 rgba(255,255,255,.4);
      --cep-highlight-dark-paper:#4c5059;
      --cep-highlight-dark-shadow:0 1px 2px rgba(32,36,45,.08),inset 0 1px 0 rgba(255,255,255,.08);
      --theme-ink:#353833; --theme-muted-ink:#747870;
      --refresh-cocoa:#353833; --refresh-rose:#e8c2c0; --refresh-lime:#e9e9e1;
      --refresh-stone:#e9e9e1; --refresh-blue:#9fb5d1; --refresh-terracotta:#9fb5d1;
      --refresh-edge:transparent; --refresh-depth:8px 10px 18px rgba(68,73,59,.24);
      --porcelain-grain:none;
      --porcelain-raised:inset 1px 1px 2px rgba(255,255,255,.25),8px 9px 14px rgba(153,157,146,.42),-8px -8px 14px rgba(255,255,255,.94);
      --porcelain-pressed:inset 4px 4px 8px rgba(153,157,146,.4),inset -4px -4px 7px rgba(255,255,255,.8);
      --porcelain-recessed:0 0 0 3px #e9e9e1,4px 5px 9px rgba(153,157,146,.25),inset 4px 4px 7px rgba(153,157,146,.44),inset -4px -4px 7px rgba(255,255,255,.9);
      --quick-panel:linear-gradient(145deg,#e9e9e1,#e9e9e1); --quick-ink:#353833;
      --quick-accent:#e9e9e1; --quick-accent-ink:#353833; --quick-soft:#e9e9e1; --quick-field:#e9e9e1; --quick-edge:transparent;
      --clinical-panel:#e9e9e1; --clinical-field:#e9e9e1; --clinical-accent:#9fb5d1; --clinical-accent-ink:#353833; --clinical-edge:transparent;
      --copy-feedback-accent:#9fb5d1; --copy-feedback-soft:#e9e9e1;
      --homecal-header:linear-gradient(145deg,#e9e9e1,#e9e9e1); --homecal-header-ink:#353833;
      --homecal-control:#e9e9e1; --homecal-control-ink:#353833; --homecal-header-edge:transparent;
      --homecal-today:#eed5d2; --homecal-today-edge:transparent; --homecal-today-shadow:rgba(68,73,59,.24);
    }
    html:root[data-xlyneve-color-theme="porcelain"],html:root[data-xlyneve-color-theme="porcelain"] body {
      color:#353833; background-color:#e9e9e1 !important;
      background-image:none !important;
      background-attachment:fixed !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body::before { background:none !important;opacity:0 !important; }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.note-card,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.template-card,.panel,.input-panel,.pinned-note,.day:not(.empty):not(.today),.todo-item:not(.priority)),
    html:root[data-xlyneve-color-theme="porcelain"].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback),
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body .main-content .card-group.section-card-group > .card,
    html:root[data-xlyneve-color-theme="porcelain"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      color:#353833 !important;
      background-color:#e9e9e1 !important;
      background-image:none !important;
      border:1px solid rgba(255,255,248,.82) !important;
      border-radius:30px !important; box-shadow:var(--porcelain-raised) !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body > header,
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) {
      color:var(--page-header-ink,#353833) !important; background-color:#e9e9e1 !important;
      background-image:none !important;
      border-color:transparent !important; box-shadow:var(--porcelain-raised) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(button,.glass-btn,.add-btn,.header-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) {
      color:#353833 !important; -webkit-text-fill-color:#353833 !important;
      background-color:#e9e9e1 !important;
      background-image:none !important;
      border-color:#e9e9e1 !important; box-shadow:var(--porcelain-raised) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(button,.glass-btn,.add-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)):active {
      box-shadow:var(--porcelain-pressed) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      color:#353833; background:#e9e9e1 !important;
      border-color:#e9e9e1 !important; box-shadow:var(--porcelain-pressed) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(input,select,textarea,.editableNote,#noteText.editable):focus-visible {
      outline:2px solid #9fb5d1; outline-offset:3px;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body .todo-item :is(textarea,input[type="text"]),
    html:root[data-xlyneve-color-theme="porcelain"] body #notes .notepad {
      background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body .dashboard-section-toggle {
      box-sizing:border-box !important; min-height:40px; padding:6px 22px !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body .dashboard-section-chevron {
      font-size:16px; line-height:1; flex:0 0 20px; text-align:center;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body :is(.dashboard-frequent-heading,.main-content > h2,.dashboard-section-toggle) {
      color:#353833 !important;-webkit-text-fill-color:#353833 !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle {
      color:var(--porcelain-button-ink,#353833) !important;-webkit-text-fill-color:var(--porcelain-button-ink,#353833) !important;
      background-color:var(--porcelain-button-surface,#e9e9e1) !important;
      background-image:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body.dashboard-hierarchy-active .dashboard-section-toggle { border-radius:18px !important; }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 1) { --porcelain-button-surface:#9fb5d1;--porcelain-button-ink:#353833; }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 2) { --porcelain-button-surface:#e8c2c0;--porcelain-button-ink:#353833; }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 3) { --porcelain-button-surface:#e9e9e1;--porcelain-button-ink:#353833; }
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 4) { --porcelain-button-surface:#e9e9e1;--porcelain-button-ink:#353833; }
    html:root[data-xlyneve-color-theme="porcelain"] .xlyneve-theme-button {
      background:linear-gradient(135deg,#e9e9e1 0 50%,#e9e9e1 50% 100%);color:#353833;
    }
    @media (prefers-reduced-motion:no-preference) {
      html:root[data-xlyneve-color-theme="porcelain"] body :is(button,.glass-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)) { transition:box-shadow .15s ease; }
    }
  `;

  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body .dashboard-frequent-section > :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      background:#e9e9e1 !important;
      color:#353833 !important;box-shadow:var(--porcelain-raised) !important;
      border:1px solid #e9e9e1 !important;border-radius:16px !important;
    }
  `;

  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] body #notes .note-card :is(.notepad,.timestamp) {
      color:#353833 !important;-webkit-text-fill-color:#353833 !important;
    }
  `;

  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.note-card,.card,.med-card,.todo-item) {
      color:#353833 !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body .todo-item :is(textarea,input[type="text"]) {
      background:transparent !important;box-shadow:none !important;
    }
  `;

  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] body :is(input[type="checkbox"],input[type="radio"]) { accent-color:#9fb5d1; }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.dashboard-section-chevron,.note-actions-toggle)::before { color:#747870; }
    html:root[data-xlyneve-color-theme="porcelain"] body .dashboard-section-toggle { border-color:transparent !important; }
    html:root[data-xlyneve-color-theme="porcelain"] body .xlyneve-theme-button { background:#e9e9e1;box-shadow:var(--porcelain-raised); }
  `;

  // Search cards share the clean raised material, including dynamically added results.
  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) {
      background:#e9e9e1 !important;
      background-image:none !important;
      color:#353833 !important;
      border:1px solid transparent !important;
      border-radius:30px !important;
      box-shadow:var(--porcelain-raised) !important;
      backdrop-filter:none !important;
      -webkit-backdrop-filter:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result):focus-visible {
      outline:2px solid #9fb5d1;
      outline-offset:3px;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.universal-search-native-card,.cep-global-search-result) .cep-source-note-display {
      background:transparent !important;
      box-shadow:none !important;
      backdrop-filter:none !important;
      -webkit-backdrop-filter:none !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="aurora"] {
      --cep-highlight-paper:#c5b0e3;
      --cep-highlight-shadow:inset 0 0 0 1px rgba(129,84,196,.3),0 1px 3px rgba(73,61,103,.12),inset 0 1px 0 rgba(255,255,255,.5);
      --cep-highlight-dark-paper:#514c60;
      --cep-highlight-dark-shadow:0 1px 3px rgba(38,31,56,.1),inset 0 1px 0 rgba(255,255,255,.1);
      --theme-ink:#28263c; --theme-muted-ink:#79778f;
      --refresh-cocoa:#28263c; --refresh-rose:#e9ebf6; --refresh-lime:#e9ebf6;
      --refresh-stone:#e9ebf6; --refresh-blue:#e9ebf6; --refresh-terracotta:#9d46c4;
      --refresh-edge:transparent; --refresh-depth:8px 10px 18px rgba(68,73,59,.24);
      --aurora-grain:none;
      --aurora-raised:inset 1px 1px 2px rgba(255,255,255,.25),6px 6px 12px rgba(169,172,197,.32),-6px -6px 12px rgba(255,255,255,.82);
      --aurora-pressed:inset 4px 4px 7px rgba(169,172,197,.32),inset -4px -4px 7px rgba(255,255,255,.8);
      --quick-panel:linear-gradient(145deg,#e9ebf6,#e9ebf6); --quick-ink:#28263c;
      --quick-accent:#e9ebf6; --quick-accent-ink:#28263c; --quick-soft:#e9ebf6; --quick-field:#e9ebf6; --quick-edge:transparent;
      --clinical-panel:#e9ebf6; --clinical-field:#e9ebf6; --clinical-accent:#9d46c4; --clinical-accent-ink:#28263c; --clinical-edge:transparent;
      --copy-feedback-accent:#9d46c4; --copy-feedback-soft:#e9ebf6;
      --homecal-header:linear-gradient(145deg,#e9ebf6,#e9ebf6); --homecal-header-ink:#28263c;
      --homecal-control:#e9ebf6; --homecal-control-ink:#28263c; --homecal-header-edge:transparent;
      --homecal-today:linear-gradient(145deg,#e7e7f2,#d8d4e7); --homecal-today-edge:rgba(169,172,197,.35); --homecal-today-shadow:rgba(169,172,197,.24);
    }
    html[data-xlyneve-color-theme="aurora"],html[data-xlyneve-color-theme="aurora"] body {
      color:#28263c; background-color:#e9ebf6 !important;
      background-image:none !important;
      background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="aurora"] body::before { background:none !important;opacity:0 !important; }
    html[data-xlyneve-color-theme="aurora"] body :is(.note-card,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.template-card,.panel,.input-panel,.pinned-note,.day:not(.empty):not(.today),.todo-item:not(.priority)),
    html[data-xlyneve-color-theme="aurora"].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback),
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body .main-content .card-group.section-card-group > .card,
    html[data-xlyneve-color-theme="aurora"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      color:#28263c !important;
      background-color:#e9ebf6 !important;
      background-image:none !important;
      border:1px solid rgba(255,255,248,.82) !important;
      border-radius:24px !important; box-shadow:var(--aurora-raised) !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="aurora"] body > header,
    html[data-xlyneve-color-theme="aurora"] body :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header) {
      color:var(--page-header-ink,#28263c) !important; background-color:#e9ebf6 !important;
      background-image:none !important;
      border-color:transparent !important; box-shadow:var(--aurora-raised) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(button,.glass-btn,.add-btn,.header-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) {
      color:#28263c !important; -webkit-text-fill-color:#28263c !important;
      background-color:#e9ebf6 !important;
      background-image:none !important;
      border-color:#e9ebf6 !important; box-shadow:var(--aurora-raised) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(button,.glass-btn,.add-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)):active {
      box-shadow:var(--aurora-pressed) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      color:#28263c; background:#e9ebf6 !important;
      border-color:#e9ebf6 !important; box-shadow:var(--aurora-pressed) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(input,select,textarea,.editableNote,#noteText.editable):focus-visible {
      outline:2px solid #9d46c4; outline-offset:3px;
    }
    html[data-xlyneve-color-theme="aurora"] body .todo-item :is(textarea,input[type="text"]),
    html[data-xlyneve-color-theme="aurora"] body #notes .notepad {
      background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body .dashboard-section-toggle {
      box-sizing:border-box !important; min-height:40px; padding:6px 22px !important;
    }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body .dashboard-section-chevron {
      font-size:16px; line-height:1; flex:0 0 20px; text-align:center;
    }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body :is(.dashboard-frequent-heading,.main-content > h2,.dashboard-section-toggle) {
      color:#28263c !important;-webkit-text-fill-color:#28263c !important;
    }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle {
      color:var(--aurora-button-ink,#28263c) !important;-webkit-text-fill-color:var(--aurora-button-ink,#28263c) !important;
      background-color:var(--aurora-button-surface,#e9ebf6) !important;
      background-image:none !important;
    }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body.dashboard-hierarchy-active .dashboard-section-toggle { border-radius:18px !important; }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 1) { --aurora-button-surface:#e9ebf6;--aurora-button-ink:#28263c; }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 2) { --aurora-button-surface:#e9ebf6;--aurora-button-ink:#28263c; }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 3) { --aurora-button-surface:#e9ebf6;--aurora-button-ink:#28263c; }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle:nth-child(4n + 4) { --aurora-button-surface:#e9ebf6;--aurora-button-ink:#28263c; }
    html[data-xlyneve-color-theme="aurora"] .xlyneve-theme-button {
      background:linear-gradient(135deg,#e9ebf6 0 50%,#e9ebf6 50% 100%);color:#28263c;
    }
    @media (prefers-reduced-motion:no-preference) {
      html[data-xlyneve-color-theme="aurora"] body :is(button,.glass-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)) { transition:box-shadow .15s ease; }
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body .dashboard-frequent-section > :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      background:#e9ebf6 !important;
      color:#28263c !important;box-shadow:var(--aurora-raised) !important;
      border:1px solid #e9ebf6 !important;border-radius:16px !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="aurora"] body #notes .note-card :is(.notepad,.timestamp) {
      color:#28263c !important;-webkit-text-fill-color:#28263c !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="aurora"] body :is(.note-card,.card,.med-card,.todo-item) {
      color:#28263c !important;
    }
    html[data-xlyneve-color-theme="aurora"] body .todo-item :is(textarea,input[type="text"]) {
      background:transparent !important;box-shadow:none !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="aurora"] body :is(input[type="checkbox"],input[type="radio"]) { accent-color:#9d46c4; }
    html[data-xlyneve-color-theme="aurora"] body :is(.dashboard-section-chevron,.note-actions-toggle)::before { color:#79778f; }
    html[data-xlyneve-color-theme="aurora"] body .dashboard-section-toggle { border-color:transparent !important; }
    html[data-xlyneve-color-theme="aurora"] body .xlyneve-theme-button { background:#e9ebf6;box-shadow:var(--aurora-raised); }
  `;

  // Search cards share the clean raised material, including dynamically added results.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="aurora"] body :is(.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result) {
      background:#e9ebf6 !important;
      background-image:none !important;
      color:#28263c !important;
      border:1px solid rgba(255,255,248,.82) !important;
      border-radius:24px !important;
      box-shadow:var(--aurora-raised) !important;
      backdrop-filter:none !important;
      -webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="aurora"] body .universal-search-native-card:not(.cep-source-card) { padding:13px 14px; }
    html[data-xlyneve-color-theme="aurora"] body .universal-search-native-title { margin:0; }
    html[data-xlyneve-color-theme="aurora"] body .universal-search-native-snippet { font:11.5px/1.45 Arial,sans-serif; }
    html[data-xlyneve-color-theme="aurora"] body .universal-search-native-card:hover { transform:translateY(-1px); }
    /* Only home cards adopt the established universal-card layout. */
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body .universal-search-native-card {
      background:#e9ebf6 !important;
      border:1px solid rgba(255,255,248,.82) !important;
      padding:16px 14px !important;
      display:flex;
      flex-direction:column;
      gap:6px;
      min-height:auto;
      min-width:0;
      box-sizing:border-box;
    }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body .universal-search-native-card.cep-source-card--pn::before { content:none; }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body .universal-search-native-card :is(.universal-search-native-title,.cep-source-note-title) { font-size:16px;line-height:1.3; }
    html[data-xlyneve-color-theme="aurora"].theme-home-glass body .universal-search-native-card :is(.universal-search-native-snippet,.cep-source-note-text,.cep-source-note-content) { font-size:14px;line-height:1.5; }

    html[data-xlyneve-color-theme="aurora"] body .cep-global-search-result { padding:16px 14px !important; }
    html[data-xlyneve-color-theme="aurora"] body .cep-global-search-result.cep-source-card--pn::before { content:none; }
    html[data-xlyneve-color-theme="aurora"] body .cep-global-search-result :is(.cep-source-note-title),
    html[data-xlyneve-color-theme="aurora"] body .cep-global-search-result > strong { font-size:16px;line-height:1.3; }
    html[data-xlyneve-color-theme="aurora"] body .cep-global-search-result :is(.cep-source-note-text,.cep-source-note-content,.cep-xgpt-rich-content,.cep-structured-rich-content),
    html[data-xlyneve-color-theme="aurora"] body .cep-global-search-result > span { font-size:14px;line-height:1.5; }
    html[data-xlyneve-color-theme="aurora"] body :is(.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result):focus-visible {
      outline:2px solid #9d46c4;
      outline-offset:3px;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(.universal-search-native-card,.cep-global-search-result) .cep-source-note-display {
      background:transparent !important;
      box-shadow:none !important;
      backdrop-filter:none !important;
      -webkit-backdrop-filter:none !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="aurora"],html[data-xlyneve-color-theme="aurora"] body {
      background-color:#d9ddef !important;
      background-image:none !important;
      background-size:cover !important;
      background-position:center !important;
      background-repeat:no-repeat !important;
      background-attachment:fixed !important;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(.cep-global-search-panel,.universal-search-panel) {
      background:rgba(233,235,246,.95) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body .dashboard-section-toggle { background:#e9ebf6 !important; }
  `;

  // Aurora accents for the universal search and shared header ray menu.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="aurora"] body .glass-pill-menu {
      background:rgba(233,235,246,.97) !important;
      border-color:rgba(255,255,255,.7) !important;
      box-shadow:var(--aurora-raised) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body .glass-pill-link {
      --aurora-accent-surface:#e6dcf4;
      background:var(--aurora-accent-surface) !important;
      color:#28263c !important;
      border-color:transparent !important;
    }
    html[data-xlyneve-color-theme="aurora"] body .glass-pill-link:nth-child(4n + 2) { --aurora-accent-surface:#dfe8f9; }
    html[data-xlyneve-color-theme="aurora"] body .glass-pill-link:nth-child(4n + 3) { --aurora-accent-surface:#e5eed1; }
    html[data-xlyneve-color-theme="aurora"] body .glass-pill-link:nth-child(4n + 4) { --aurora-accent-surface:#f0dfe8; }
    html[data-xlyneve-color-theme="aurora"] body :is(.glass-pill-link:hover,.glass-pill-link:focus-visible) {
      background:var(--aurora-accent-surface) !important;
      box-shadow:var(--aurora-raised) !important;
      outline:2px solid #8154c4;
      outline-offset:2px;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(.glass-pill-tab,.cep-global-search-modes button,.cep-global-search-filters button,.universal-search-mode,.universal-search-filter) {
      background:#e6dcf4 !important;
      color:#28263c !important;
      -webkit-text-fill-color:#28263c !important;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(.glass-pill-tab,.cep-global-search-modes button,.cep-global-search-filters button,.universal-search-mode,.universal-search-filter).is-active {
      background:#8154c4 !important;
      color:#fff !important;
      -webkit-text-fill-color:#fff !important;
      box-shadow:inset 0 1px 2px rgba(255,255,255,.3),0 3px 8px rgba(110,78,164,.23) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body .header-search-trigger {
      background:#7d9aeb !important;
      background-image:none !important;
      box-shadow:0 0 7px rgba(125,154,235,.6),inset 0 1px 1px rgba(255,255,255,.7) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body .toggle-icon {
      background:#c995d9 !important;
      box-shadow:0 0 7px rgba(169,114,207,.5),inset 0 1px 1px rgba(255,255,255,.7) !important;
    }
    html[data-xlyneve-color-theme="aurora"] body :is(.cep-global-search-group-title,.universal-search-source-title) { color:#684199 !important; }
  `;

  // Ceramic finish for the existing jumper colours; palette values stay unchanged.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="pastel-jumper"] {
      --pastel-grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.055' filter='url(%23grain)'/%3E%3C/svg%3E");
      --pastel-ceramic-raised:inset 2px 2px 3px rgba(255,255,251,.95),inset -3px -4px 5px rgba(98,104,89,.18),0 3px 2px rgba(78,83,70,.2),7px 10px 18px rgba(68,73,59,.23),-5px -5px 12px rgba(255,255,251,.88);
      --pastel-ceramic-pressed:inset 3px 4px 7px rgba(72,81,69,.3),inset -3px -3px 6px rgba(255,255,251,.95);
    }
    html[data-xlyneve-color-theme="pastel-jumper"],html[data-xlyneve-color-theme="pastel-jumper"] body {
      background-image:var(--pastel-grain),radial-gradient(circle at 14% 10%,rgba(250,246,229,.98),transparent 34%),radial-gradient(circle at 86% 20%,rgba(231,161,161,.3),transparent 40%),radial-gradient(circle at 18% 86%,rgba(185,166,210,.22),transparent 38%),linear-gradient(180deg,#faf6e5 0%,#f1edcf 58%,#f1edcf 100%) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"] body::before { opacity:0 !important; }
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(.note-card,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.template-card,.panel,.input-panel,.pinned-note,.day:not(.empty):not(.today),.todo-item:not(.priority)),
    html[data-xlyneve-color-theme="pastel-jumper"].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback),
    html[data-xlyneve-color-theme="pastel-jumper"].theme-clinical body #pinnedNotesList > .pinned-note,
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body .main-content .card-group.section-card-group > .card,
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background-image:var(--pastel-grain) !important;
      box-shadow:var(--pastel-ceramic-raised) !important;
      backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"] body > header,
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(.header,.header-bg,.topbar,.top-bar,.app-header,.page-header),
    html[data-xlyneve-color-theme="pastel-jumper"].theme-homecal body .calendar-header {
      background-image:var(--pastel-grain) !important;
      box-shadow:var(--pastel-ceramic-raised) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(button,.glass-btn,.add-btn,.header-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)),
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle {
      background-image:var(--pastel-grain) !important;
      box-shadow:var(--pastel-ceramic-raised) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(button,.glass-btn,.add-btn,.circle):not(:where(#recallBtn,.xlyneve-theme-option,.dot,.pick)):active {
      box-shadow:var(--pastel-ceramic-pressed) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      background-image:var(--pastel-grain) !important;box-shadow:var(--pastel-ceramic-pressed) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"] body .todo-item :is(textarea,input[type="text"]),
    html:root.home-notepad-embedded[data-xlyneve-color-theme="pastel-jumper"][data-home-notepad-ready="1"] body .notepad {
      background-image:none !important;box-shadow:none !important;
    }
    html:root.home-notepad-embedded[data-xlyneve-color-theme="pastel-jumper"][data-home-notepad-ready="1"] body #notes > .note-card:not(.copy-feedback):not(.copied-feedback) {
      background-image:var(--pastel-grain) !important;box-shadow:var(--pastel-ceramic-raised) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body.dashboard-hierarchy-active .dashboard-section-toggle {
      box-sizing:border-box !important;min-height:40px;padding:6px 22px !important;border-radius:18px !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body .dashboard-section-chevron { font-size:16px;line-height:1;flex:0 0 20px;text-align:center; }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-home-glass body .dashboard-frequent-section > :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      background-image:var(--pastel-grain) !important;box-shadow:var(--pastel-ceramic-raised) !important;border-radius:16px !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(.chatBubble,.form-card,.library-card,.template-card,.panel,.med-card),
    html[data-xlyneve-color-theme="pastel-jumper"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background-color:var(--card-glass,rgba(250,246,229,.92)) !important;
    }
    html[data-xlyneve-color-theme="pastel-jumper"].theme-homecal body .calendar-header { background-color:rgba(185,166,210,.94) !important; }
  `;

  // Porcelain material and blue/blush accents from the reference.
  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.glass-pill-menu,.cep-global-search-panel,.universal-search-panel,.universal-search) {
      background:#e9e9e1 !important; background-image:none !important;
      color:#353833 !important; border:1px solid rgba(255,255,255,.65) !important;
      border-radius:30px !important; box-shadow:var(--porcelain-raised) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body .glass-pill-link {
      background:#9fb5d1 !important; color:#353833 !important;
      border:0 !important; box-shadow:var(--porcelain-raised) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body .glass-pill-link:nth-child(even) { background:#e8c2c0 !important; }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.cep-global-search-light,.cep-global-search-trigger,.cep-page-search-toggle) {
      background:#9fb5d1 !important; color:#353833 !important; box-shadow:var(--porcelain-raised) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.cep-global-search-result,.universal-search-native-card,.cep-concept-search-result)::before {
      background:none !important; box-shadow:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.dashboard-section-toggle,.top-links) {
      background:#e9e9e1 !important; color:#353833 !important;
      box-shadow:var(--porcelain-raised) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body .top-links a { color:#353833 !important; }
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body .day.today:not(.empty) {
      box-shadow:var(--porcelain-raised) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body .day .date-number { color:#536b89 !important; }
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body .day.today .date-number { color:#353833 !important; }
    html:root.home-notepad-embedded[data-xlyneve-color-theme="porcelain"][data-home-notepad-ready="1"] body #notes > .note-card:not(.copy-feedback):not(.copied-feedback) {
      background:#e9e9e1 !important; background-image:none !important;
      color:#353833 !important; border-radius:24px !important; box-shadow:var(--porcelain-raised) !important;
    }
    html:root.home-notepad-embedded[data-xlyneve-color-theme="porcelain"] body .notepad {
      background:transparent !important; box-shadow:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body .dot-add { background:#9fb5d1 !important; }
    html:root[data-xlyneve-color-theme="porcelain"] body .dot-yellow { background:#e8c2c0 !important; }
    html:root[data-xlyneve-color-theme="porcelain"] body .dot-purple { background:#aebcaf !important; }
  `;

  // A raised porcelain rim surrounds the recessed face, without an overlay on text.
  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator,.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.template-card,.panel,.input-panel,.pinned-note,.day:not(.empty),.todo-item,.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result,.dashboard-section-toggle),
    html:root[data-xlyneve-color-theme="porcelain"].theme-clinical body #notesList > .note-card:not(.copy-feedback):not(.copied-feedback),
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body .main-content .card-group.section-card-group > .card,
    html:root[data-xlyneve-color-theme="porcelain"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator),
    html:root.home-notepad-embedded[data-xlyneve-color-theme="porcelain"][data-home-notepad-ready="1"] body #notes > .note-card:not(.copy-feedback):not(.copied-feedback) {
      box-shadow:var(--porcelain-recessed) !important;
      border:1px solid transparent !important; border-radius:30px !important;
    }
  `;

  // Keep filter pills and search-card edges clean inside scrolling containers.
  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.cep-global-search-filters,.cep-global-search-modes,.universal-search-filters,.universal-search-modes) {
      background:transparent !important; background-image:none !important;
      border:0 !important; box-shadow:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.cep-global-search-filters,.cep-global-search-modes,.universal-search-filters,.universal-search-modes) button {
      box-shadow:inset 2px 2px 3px rgba(255,255,255,.95),inset -2px -3px 4px rgba(153,157,146,.48) !important;
      border:1px solid rgba(255,255,255,.85) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.cep-global-search-result,.universal-search-native-card,.cep-concept-search-result) {
      box-shadow:var(--porcelain-recessed) !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"] body :is(.cep-global-search-group-cards,.universal-search-result-group) {
      background:transparent !important; box-shadow:none !important;
    }
  `;

  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"] body .note-card:not(.copy-feedback):not(.new-note-highlight)::before,
    html:root[data-xlyneve-color-theme="porcelain"] body .note-card:not(.copy-feedback):not(.new-note-highlight)::after {
      background:none !important; box-shadow:none !important; filter:none !important;
    }
  `;

  // Calendar colours reflect date roles, rather than card order.
  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body .day:not(.empty)[data-weekday] {
      background:#e4e5e1 !important; background-image:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body .day:not(.empty):is([data-weekday="0"],[data-weekday="6"]) {
      background:#d5d7d2 !important; background-image:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body .day.today:not(.empty) {
      background:#eed5d2 !important; background-image:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body .day .date-number {
      text-align:center !important; padding:2px 8px !important;
      width:100%; box-sizing:border-box; margin:0 auto 5px !important;
      color:#353833 !important;
    }
  `;

  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body #todoPanel {
      background:transparent !important; background-image:none !important;
      border:0 !important; box-shadow:none !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body #todoPanel::before {
      content:none !important; background:none !important; box-shadow:none !important;
    }
    html:root[data-xlyneve-color-theme="porcelain"].theme-homecal body #todoList .todo-item :is(textarea,input[type="text"]) {
      background:transparent !important; background-image:none !important;
      border:0 !important; box-shadow:none !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
  `;

  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="porcelain"].theme-home-glass body.dashboard-hierarchy-active .dashboard-frequent-circles .circle {
      box-sizing:border-box !important;
      border:6px solid #e9e9e1 !important;
      box-shadow:5px 6px 10px rgba(125,133,122,.35),-4px -4px 9px rgba(255,255,255,.9),inset 5px 5px 8px rgba(58,68,78,.46),inset -4px -4px 7px rgba(255,255,255,.88) !important;
    }
  `;

  // Task text stays directly on the rounded card, in every calendar theme.
  themeStyle.textContent += `
    html:root.theme-homecal body #todoPanel {
      background:transparent !important; background-image:none !important;
      border:0 !important; box-shadow:none !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root.theme-homecal body #todoPanel::before {
      content:none !important; background:none !important; box-shadow:none !important;
    }
    html:root.theme-homecal body #todoList .todo-item :is(textarea,input[type="text"]) {
      background:transparent !important; background-image:none !important;
      border:0 !important; box-shadow:none !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
  `;

  // Hover definitions use a solid surface so underlying content cannot bleed through.
  themeStyle.textContent += `
    html:root body :is(.xgpt-media-tip,.cep-xgpt-media-tip,#defTip,#cep-shared-tip,#pn-definition-tip) {
      background:#ffffff !important; background-image:none !important; opacity:1 !important;
      color:#39353a !important; -webkit-text-fill-color:currentColor !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
  `;

  // A gentle ceramic rim and shallow inset keep Palm Springs softer than the 5D themes.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="palm-springs"] {
      --palm-soft-depth:0 1px 0 rgba(251,248,245,.65),0 3px 7px rgba(31,44,44,.1),inset 5px 5px 8px rgba(31,44,44,.22),inset -4px -4px 7px rgba(251,248,245,.65);
    }
    html:root[data-xlyneve-color-theme="palm-springs"] body :is(.note-card,.card,.acc-item,.med-card,.med-section,.vaccine-section,.vaccine-card,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.panel,.input-panel,.pinned-note,.day:not(.empty),.todo-item,.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result,.cep-note-popup,.pn-edit-popup),
    html:root[data-xlyneve-color-theme="palm-springs"].theme-home-glass body .main-content .card-group.section-card-group > .card {
      border:2px solid rgba(251,248,245,.72) !important;
      box-shadow:var(--palm-soft-depth) !important;
    }
    html:root[data-xlyneve-color-theme="palm-springs"].theme-home-glass body .dashboard-frequent-circles .circle,
    html:root[data-xlyneve-color-theme="palm-springs"].theme-home-glass body .dashboard-frequent-circles .circle:is(:hover,:active,:focus) {
      box-shadow:none !important; filter:none !important; animation:none !important;
      transform:none !important; -webkit-tap-highlight-color:transparent;
    }
    html:root[data-xlyneve-color-theme="palm-springs"].theme-home-glass body .dashboard-frequent-circles .circle::after {
      content:none !important;
    }
  `;

  // Note creation and editing always have an opaque, theme-matched surface.
  themeStyle.textContent += `
    html { --note-editor-depth:none; --note-editor-inset:none; --note-editor-radius:16px; }
    html[data-xlyneve-color-theme="sculpted"] {
      --note-editor-depth:inset 3px 3px 5px rgba(255,255,255,.88),inset -4px -5px 9px rgba(57,53,58,.12),10px 14px 28px rgba(57,53,58,.18),-5px -5px 14px rgba(255,255,255,.62);
      --note-editor-inset:inset 4px 4px 7px rgba(57,53,58,.2),inset -4px -4px 7px rgba(255,255,255,.8);
      --note-editor-radius:24px;
    }
    html[data-xlyneve-color-theme="mint-ceramic"] { --note-editor-depth:var(--mint-raised); --note-editor-inset:var(--mint-pressed); --note-editor-radius:22px; }
    html[data-xlyneve-color-theme="pastel-jumper"] { --note-editor-depth:var(--pastel-ceramic-raised); --note-editor-inset:var(--pastel-ceramic-pressed); --note-editor-radius:22px; }
    html[data-xlyneve-color-theme="soft-stone"] { --note-editor-depth:var(--stone-raised); --note-editor-inset:var(--stone-pressed); --note-editor-radius:26px; }
    html[data-xlyneve-color-theme="aurora"] { --note-editor-depth:var(--aurora-raised); --note-editor-inset:var(--aurora-pressed); --note-editor-radius:26px; }
    html[data-xlyneve-color-theme="porcelain"] { --note-editor-depth:var(--porcelain-recessed); --note-editor-inset:var(--porcelain-pressed); --note-editor-radius:30px; }
    html[data-xlyneve-color-theme="palm-springs"] { --note-editor-depth:var(--palm-soft-depth); --note-editor-inset:var(--palm-soft-depth); --note-editor-radius:22px; }
    html:root:root body :is(.cep-note-popup,.pn-edit-popup,#inputGroup,#nurseFormWrapper,.input-panel,#formCard,#notePanel,.note-card.editing-note,.note-card.is-editing),
    html:root:root body .note-card:has(:is(.note-content[contenteditable="true"],.editableNote[contenteditable="true"],.edit-note[style*="display: block"],.edit-note[style*="display:block"])) {
      background:linear-gradient(var(--clinical-panel,#fff),var(--clinical-panel,#fff)),#fff !important;
      opacity:1 !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
      color:var(--theme-ink,#39353a) !important;
      border:1px solid var(--clinical-edge,#dedbd7) !important;
      border-radius:var(--note-editor-radius) !important;
      box-shadow:var(--note-editor-depth) !important;
    }
    html:root:root body :is(.cep-note-popup,.pn-edit-popup) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) {
      background:none !important; border:0 !important; box-shadow:none !important;
    }
    html:root:root body :is(.edit-note,.edit-box,.editableNote[contenteditable="true"],#noteInput,#noteText.editable,#nurseNote,#noteContent,#noteTextInput),
    html:root:root body :is(.cep-note-popup,.pn-edit-popup,.input-panel,#inputGroup,#nurseFormWrapper,#formCard,#notePanel) :is(textarea,[contenteditable="true"]) {
      background:linear-gradient(var(--clinical-field,#fff),var(--clinical-field,#fff)),#fff !important;
      opacity:1 !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
      box-shadow:var(--note-editor-inset) !important;
      border-radius:12px;
    }
  `;

  // Shared SVG media buttons stay recognisable and readable across browsers and themes.
  themeStyle.textContent += `
    html:root body a.cep-media-link {
      color:#263333 !important; -webkit-text-fill-color:#263333 !important;
      background:linear-gradient(145deg,#fffdf9,#e7e3dd) !important;
      display:inline-flex !important; align-items:center; justify-content:center;
      width:48px !important; height:48px !important; padding:0 !important;
      box-sizing:border-box; border-radius:15px !important;
      border:1px solid rgba(255,255,255,.9) !important;
      box-shadow:4px 5px 9px rgba(38,51,51,.22),-2px -2px 5px rgba(255,255,255,.5),inset 2px 2px 3px rgba(255,255,255,.95),inset -2px -3px 4px rgba(38,51,51,.15) !important;
      text-decoration:none; opacity:1 !important; vertical-align:middle;
      transition:transform .12s ease,box-shadow .12s ease;
    }
    html:root body a.cep-media-link:hover {
      background:linear-gradient(145deg,#fffdf9,#eee8e0) !important;
    }
    html:root body a.cep-media-link svg {
      width:28px; height:28px; display:block; flex:none; pointer-events:none;
    }
    html:root body a.cep-media-link:active {
      transform:translateY(1px);
      box-shadow:inset 2px 3px 5px rgba(38,51,51,.2),inset -2px -2px 4px rgba(255,255,255,.8) !important;
    }
    html:root body a.cep-media-link:focus-visible {
      outline:2px solid #263333; outline-offset:3px;
    }
    html:root body a.cep-media-link:not([aria-label="Play video"]) {
      width:30px !important; height:30px !important; border-radius:9px !important;
    }
    html:root body a.cep-media-link:not([aria-label="Play video"]) svg {
      width:18px; height:18px;
    }
    html:root.theme-pn body .note-url a.cep-media-link {
      width:30px !important; height:30px !important; border-radius:9px !important;
    }
    html:root.theme-pn body .note-url a.cep-media-link svg {
      width:18px; height:18px;
    }
  `;

  // Mint Ceramic controls sink into their surface while pressed.
  themeStyle.textContent += `
    html:root[data-xlyneve-color-theme="mint-ceramic"] body :is(button,a.cep-media-link,.glass-btn,.add-btn,.header-btn,.circle,.dashboard-section-toggle,[role="button"],.toggle-icon,.header-search-trigger):active {
      box-shadow:var(--mint-pressed) !important;
      translate:0 2px !important;
      scale:.96 !important;
    }
  `;

  // Set a readable table default without overriding authored descendant colours.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme] body table {
      color:#000 !important;
      -webkit-text-fill-color:#000 !important;
    }
  `;

  // Bare, theme-tinted scrollbar thumbs; no track material or end buttons.
  // Native thin bars bypass custom thumb paint in Chromium; preserve the
  // intentionally hidden navigation/embedded bars while enabling themed paint.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root {
      --cep-scrollbar-colour:color-mix(in srgb,var(--quick-accent,var(--page-header-solid,#a793a3)) 72%,var(--theme-ink,#554c56));
      --cep-scrollbar-glow:color-mix(in srgb,var(--quick-accent,var(--page-header-solid,#a793a3)) 42%,transparent);
    }
    @supports selector(::-webkit-scrollbar) {
      html:root:root:root:root:root:root:root:root,
      html:root:root:root:root:root:root:root:root * {scrollbar-color:auto!important;scrollbar-width:auto!important;}
      html:root:root:root:root:root:root:root:root.cep-card-preview,
      html:root:root:root:root:root:root:root:root :is(.universal-search-filters,.cep-global-search-filters,.top-links,.dashboard-frequent-circles,#formatToolbar,.glass-pill-tabs,.glass-pill-links,.urgent-care-nav),
      html:root:root:root:root:root:root:root:root.home-notepad-embedded #notes,
      html:root:root:root:root:root:root:root:root.homecal-embed-today #todoList {scrollbar-width:none!important;}
      html:root:root:root:root:root:root:root:root::-webkit-scrollbar,
      html:root:root:root:root:root:root:root:root *::-webkit-scrollbar {width:7px;height:7px;background:transparent!important;border:0!important;box-shadow:none!important;}
      html:root:root:root:root:root:root:root:root::-webkit-scrollbar-track,
      html:root:root:root:root:root:root:root:root *::-webkit-scrollbar-track,
      html:root:root:root:root:root:root:root:root::-webkit-scrollbar-track-piece,
      html:root:root:root:root:root:root:root:root *::-webkit-scrollbar-track-piece,
      html:root:root:root:root:root:root:root:root::-webkit-scrollbar-corner,
      html:root:root:root:root:root:root:root:root *::-webkit-scrollbar-corner {background:transparent!important;border:0!important;box-shadow:none!important;}
      html:root:root:root:root:root:root:root:root::-webkit-scrollbar-thumb,
      html:root:root:root:root:root:root:root:root *::-webkit-scrollbar-thumb {background:var(--cep-scrollbar-colour)!important;border:0!important;border-radius:999px!important;box-shadow:0 0 3px var(--cep-scrollbar-glow)!important;}
      html:root:root:root:root:root:root:root:root::-webkit-scrollbar-button,
      html:root:root:root:root:root:root:root:root *::-webkit-scrollbar-button {display:none!important;width:0!important;height:0!important;background:none!important;border:0!important;}
    }
    @supports not selector(::-webkit-scrollbar) {
      html:root:root:root:root:root:root:root:root,
      html:root:root:root:root:root:root:root:root * {scrollbar-color:var(--cep-scrollbar-colour) transparent!important;}
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

  // Search uses the existing palette and source order, without loading source records again.
  window.getCepSourceCardColour = (file, index, className = "note-card") => {
    const seed = `${String(file).toLowerCase()}:${Number.isInteger(index) ? index : 0}::${className}`;
    return palette[hash(seed) % palette.length];
  };

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
      card.style.setProperty("--card-solid", color.solid);
      if (color.outline) card.style.setProperty("--card-outline",color.outline);
      card.dataset.sharedPaletteColor = "true";
    });
  }

  themeStyle.textContent += `
    html body #xlyneveThemePanel {
      width:min(280px,calc(100vw - 48px));
      max-height:calc(100dvh - 100px);
      overflow-y:auto;
      box-sizing:border-box;
    }
    #xlyneveThemePanel .xlyneve-theme-heading { display:flex;align-items:center;justify-content:space-between;gap:8px; }
    #xlyneveThemePanel .xlyneve-theme-title { margin:0; }
    #xlyneveThemePanel .xlyneve-theme-manage {
      display:grid;place-items:center;flex:0 0 44px;width:44px;height:44px;
      padding:0 !important;border:0 !important;background:transparent !important;
      background-image:none !important;box-shadow:none !important;cursor:pointer;
    }
    #xlyneveThemePanel .xlyneve-theme-manage::before {
      content:"";width:16px;height:16px;border-radius:50%;
      background:var(--copy-feedback-accent,#8154c4);
      border:1px solid rgba(255,255,255,.9);
      box-shadow:0 0 7px rgba(129,84,196,.35),inset 0 1px 2px rgba(255,255,255,.55);
    }
    #xlyneveThemePanel .xlyneve-theme-manage[aria-pressed="true"]::before { outline:2px solid #8154c4;outline-offset:3px; }
    #xlyneveThemePanel .xlyneve-theme-manage:focus-visible { outline:2px solid #8154c4;outline-offset:-2px; }
    #xlyneveThemePanel:not(.is-managing-themes) :is(.xlyneve-theme-delete,.xlyneve-theme-restore) { display:none !important; }
    #xlyneveThemePanel .xlyneve-theme-row { display:flex;align-items:center;gap:4px; }
    #xlyneveThemePanel .xlyneve-theme-option { flex:1;min-width:0;gap:7px;margin-top:0; }
    #xlyneveThemePanel .xlyneve-theme-swatches { flex-shrink:0;gap:2px; }
    #xlyneveThemePanel .xlyneve-theme-swatch { width:8px;height:8px; }
    #xlyneveThemePanel :is(.xlyneve-theme-delete,.xlyneve-theme-restore) {
      background:transparent !important;background-image:none !important;
      color:#594c52 !important;-webkit-text-fill-color:#594c52 !important;
      border:0 !important;box-shadow:none !important;
      min-height:44px;padding:8px;cursor:pointer;
      font:11px/1.3 Arial,sans-serif;
    }
    #xlyneveThemePanel .xlyneve-theme-delete { flex:0 0 48px; }
    #xlyneveThemePanel .xlyneve-theme-restore { width:100%;text-align:left;text-decoration:underline; }
    #xlyneveThemePanel .xlyneve-theme-restore[hidden] { display:none; }
    #xlyneveThemePanel :is(.xlyneve-theme-delete,.xlyneve-theme-restore):focus-visible { outline:2px solid #8154c4;outline-offset:-2px; }
    #xlyneveThemePanel .xlyneve-theme-status { margin:4px 8px 0;color:#594c52;font:11px/1.4 Arial,sans-serif; }
    #xlyneveThemePanel .xlyneve-theme-status:empty { display:none; }
  `;

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
    const heading = document.createElement("div");
    heading.className = "xlyneve-theme-heading";
    const manage = document.createElement("button");
    manage.type = "button";
    manage.className = "xlyneve-theme-manage";
    manage.setAttribute("aria-label", "Show or hide theme delete buttons");
    manage.setAttribute("aria-pressed", "false");
    manage.title = "Show delete buttons";
    const setDeleteMode = (open) => {
      panel.classList.toggle("is-managing-themes", open);
      manage.setAttribute("aria-pressed", String(open));
      manage.title = open ? "Hide delete buttons" : "Show delete buttons";
    };
    manage.addEventListener("click", () => setDeleteMode(manage.getAttribute("aria-pressed") !== "true"));
    heading.append(title, manage);
    panel.appendChild(heading);

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
        colors: ["#a288b7", "#6dafbf", "#ba928d", "#cdb2cb", "#b7bdb4"]
      },
      {
        value: "anatomy",
        label: "Anatomy",
        colors: ["#faf2e8", "#22211f", "#aaa297", "#f6b63f", "#e8dccd"]
      },
      {
        value: "sculpted",
        label: "Sculpted 5D",
        colors: ["#a288b7", "#6dafbf", "#ba928d", "#cdb2cb", "#b7bdb4"]
      },
    ];

    themeOptions.push({value:"moon-clay",label:"Moon Clay",colors:["#e8e8e8","#c7b4d6","#e8b7c2","#edcbb7","#f1e3bd"]});
    themeOptions.push({value:"midnight-glass",label:"Midnight Glass",colors:["#20242c","#56cde5","#9c70e0","#e9edf5"]});
    themeOptions.push({value:"warm-ivory",label:"Warm Ivory",colors:["#e6dfd4","#c4a09b","#a5ae96","#c2aa73","#af969c"]});
    themeOptions.push({value:"cloud-glass",label:"Cloud Glass",colors:["#e4eef9","#eae6fa","#f5e9ed","#e7f0f1"]});
    themeOptions.push({value:"opal-pearl",label:"Opal Pearl 5D",colors:["#e8f1f4","#f4e8ec","#efecf6","#f7f3e5","#c9b67e"]});
    themeOptions.push({value:"pastel-rose-5d",label:"Pastel Rose 5D",colors:["#f3cdd4","#f8e1be","#dfeaf1","#f8aa80","#ce8a9f"]});
    themeOptions.push({value:"pastel-rose-recessed",label:"Pastel Rose Recessed",colors:["#f3cdd4","#f8e1be","#dfeaf1","#f8aa80","#ce8a9f"]});
    themeOptions.push({ value:"lavender-glass", label:"Lavender Glass", colors:["#d7c6ec","#eee7f6","#cfd3f2","#44335d"] });
    themeOptions.push({ value:"grey-lavender", label:"Grey Lavender Glass", colors:["#ebebeb","#f0eff5","#d8cdec","#44335d"] });
    themeOptions.push({ value:"pearl-silver", label:"Silver Pearl Glass", colors:["#ebebeb","#fafaf7","#dfecef","#e2e3ea"] });
    themeOptions.push({ value:"frost-outline", label:"Frost Outline 5D", colors:["#d5e0e8","#66baf0","#9acff2","#b452c9","#2aafc1"] });
    themeOptions.push({ value:"porcelain", label:"Porcelain", colors:["#e9e9e1","#9fb5d1","#e8c2c0"] });
    themeOptions.push({ value:"aurora", label:"Aurora 5D", colors:["#e9ebf6","#8154c4","#7d9aeb","#d091b0","#cee878"] });
    themeOptions.push({ value:"soft-stone", label:"Soft Stone 5D", colors:["#e1e2e6","#dfb53e","#72757c"] });
    themeOptions.push({ value:"mint-ceramic", label:"Mint Ceramic 5D", colors:["#dfe8e1","#dde8f1","#e6e0ef","#f0e1e5","#f2efd9"] });
    themeOptions.push({ value:"pastel-jumper", label:"Pastel Jumper", colors:["#b9a6d2", "#e7a1a1", "#f1edcf", "#d8cbe7", "#faf6e5"] });
    const list = document.createElement("div");
    const status = document.createElement("p");
    status.className = "xlyneve-theme-status";
    status.setAttribute("role", "status");
    const restore = document.createElement("button");
    restore.type = "button";
    restore.className = "xlyneve-theme-restore";
    restore.textContent = "Restore deleted themes";
    const drawOptions = () => {
      list.replaceChildren();
      restore.hidden = deletedThemes.size === 0;
      themeOptions.filter(option => !deletedThemes.has(option.value) && !removedThemes.has(option.value)).forEach((option) => {
      const row = document.createElement("div");
      row.className = "xlyneve-theme-row";

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
      row.appendChild(button);
      if (option.value !== "original") {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "xlyneve-theme-delete";
        remove.textContent = "Delete";
        remove.setAttribute("aria-label", `Delete ${option.label} theme`);
        remove.title = `Delete ${option.label} from this browser`;
        remove.addEventListener("click", () => {
          const next = new Set(deletedThemes);
          next.add(option.value);
          try { localStorage.setItem(deletedThemeStorageKey, JSON.stringify([...next])); }
          catch { status.textContent = "Could not save the change. Try again."; return; }
          deletedThemes = next;
          if (selectedTheme === option.value) {
            try { localStorage.removeItem(themeStorageKey); } catch {}
            location.reload();
            return;
          }
          drawOptions();
          status.textContent = `${option.label} deleted from this browser.`;
          list.querySelector("button")?.focus();
        });
        row.appendChild(remove);
      }
      list.appendChild(row);
    });
    };
    restore.addEventListener("click", () => {
      try { localStorage.removeItem(deletedThemeStorageKey); }
      catch { status.textContent = "Could not restore themes. Try again."; return; }
      deletedThemes = new Set();
      drawOptions();
      status.textContent = "Deleted themes restored.";
      list.querySelector("button")?.focus();
    });
    panel.append(list, restore, status);
    drawOptions();

    const closePicker = () => {
      setDeleteMode(false);
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = panel.hidden;
      setDeleteMode(false);
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

  themeStyle.textContent += `
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] {
      --frost-surface:#d5e0e8; --frost-ink:#34434f;
      --frost-raised:7px 7px 14px rgba(115,133,147,.38),-7px -7px 15px rgba(255,255,255,.82),inset 1px 1px 2px rgba(255,255,255,.48);
      --frost-inset:inset 5px 5px 9px rgba(115,133,147,.36),inset -5px -5px 9px rgba(255,255,255,.75);
      --theme-ink:#34434f; --theme-muted-ink:#627584;
      --glass-light:#d5e0e8; --glass-edge:rgba(140,176,207,.45); --glass-shadow:rgba(115,133,147,.3);
      --refresh-cocoa:#34434f; --refresh-rose:#d5e0e8; --refresh-lime:#d5e0e8;
      --refresh-stone:#d5e0e8; --refresh-blue:#d5e0e8; --refresh-terracotta:#379ee9;
      --quick-panel:#d5e0e8; --quick-ink:#34434f; --quick-field:#d5e0e8; --quick-soft:#d5e0e8;
      --quick-accent:#75bde9; --quick-accent-ink:#17354a; --quick-edge:rgba(140,176,207,.45);
      --clinical-panel:#d5e0e8; --clinical-field:#d5e0e8; --clinical-accent:#75bde9; --clinical-accent-ink:#17354a; --clinical-edge:rgba(140,176,207,.45);
      --homecal-header:#d5e0e8; --homecal-header-ink:#34434f; --homecal-control:#d5e0e8; --homecal-control-ink:#34434f;
      --homecal-header-edge:rgba(140,176,207,.45); --homecal-today:#d5e0e8; --homecal-today-edge:#bc86ce; --homecal-today-shadow:rgba(115,133,147,.3);
      --cal-light:#d5e0e8; --cal-ink:#34434f; --cal-edge:rgba(140,176,207,.45);
      --note-editor-depth:var(--frost-raised); --note-editor-inset:var(--frost-inset); --note-editor-radius:24px;
      --cep-highlight-paper:#e1e9ee; --cep-highlight-shadow:none;
      --copy-feedback-accent:#379ee9; --copy-feedback-soft:#e1e9ee;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"],html:root:root:root[data-xlyneve-color-theme="frost-outline"] body {
      background:#d5e0e8 !important; background-image:linear-gradient(125deg,rgba(249,218,229,.22),rgba(249,218,229,.05) 55%,rgba(249,218,229,.14)) !important; color:#34434f;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body::before { background:none !important; opacity:0 !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.panel,.input-panel,.pinned-note,.day:not(.empty),.todo-item,.file-item),
    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-clinical body #notesList > .note-card,
    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-home-glass body .main-content .card-group.section-card-group > .card {
      background:#d5e0e8 !important; background-image:none !important; color:#34434f !important;
      border:1px solid var(--card-outline,rgba(89,154,210,.4)) !important;
      border-radius:24px !important; box-shadow:var(--frost-raised) !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(.day.today,.day.current-day) { border:2px solid #bc86ce !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(.day.weekend,.day.saturday,.day.sunday) { border-color:rgba(70,175,186,.55) !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body .todo-item :is(input[type="text"],textarea) { background:transparent !important; box-shadow:none !important; border:0 !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(.calendar-container,.todo-container,.homepage-notepad,.homepage-calendar,.universal-search,.cep-global-search-panel,:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background:#d5e0e8 !important; background-image:none !important; color:#34434f !important;
      border:1px solid rgba(255,255,255,.35) !important; border-radius:28px !important;
      box-shadow:var(--frost-raised) !important; backdrop-filter:none !important;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.masthead,.dashboard-section-toggle) {
      background:#d5e0e8 !important; background-image:none !important; color:#34434f !important;
      box-shadow:var(--frost-raised) !important; border-color:rgba(255,255,255,.35) !important;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body .dashboard-section-toggle { border-radius:22px !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(button,.glass-btn,.add-btn,.header-btn,.circle,a.cep-media-link):not(:where(.dashboard-section-toggle,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick,.cep-search-copy-glow)) {
      background:linear-gradient(145deg,#b1dcf5,#75bde9) !important; color:#17354a !important; -webkit-text-fill-color:#17354a !important;
      border:1px solid rgba(255,255,255,.22) !important; box-shadow:var(--frost-raised) !important;
      backdrop-filter:none !important;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(button,.circle,a.cep-media-link):nth-child(4n + 2):not(:where(.dashboard-section-toggle,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) { background:linear-gradient(145deg,#b1dcf5,#75bde9) !important; color:#17354a !important; -webkit-text-fill-color:#17354a !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(button,.circle,a.cep-media-link):nth-child(4n + 3):not(:where(.dashboard-section-toggle,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) { background:linear-gradient(145deg,#cd81db,#b452c9) !important; color:#301735 !important; -webkit-text-fill-color:#301735 !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(button,.circle,a.cep-media-link):nth-child(4n):not(:where(.dashboard-section-toggle,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) { background:linear-gradient(145deg,#65d3dc,#2aafc1) !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(button,.circle,a.cep-media-link):active:not(:where(.dashboard-section-toggle,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) { box-shadow:var(--frost-inset) !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      background:#d5e0e8 !important; color:#34434f !important; border:1px solid rgba(255,255,255,.2) !important;
      box-shadow:var(--frost-inset) !important; border-radius:18px;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(input,textarea,select):focus-visible { outline:2px solid #75bde9; outline-offset:2px; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(#notes .notepad,.note-card.editing-note,.note-card.is-editing,.cep-note-popup,.pn-edit-popup) {
      background:#d5e0e8 !important; box-shadow:var(--frost-raised) !important; color:#34434f !important;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body .pad-controls,
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body .homepage-notepad-drag-bar { background:transparent !important; box-shadow:none !important; }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(.universal-search-filter-row,.cep-global-search-filters,.cep-global-search-group-cards,.universal-search-result-group) { background:transparent !important; box-shadow:none !important; }

    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body .todo-item.todo-item:not(#cep-frost-no-task) :is(input[type="text"],textarea) { background:transparent !important; box-shadow:none !important; border:0 !important; }

    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-home-glass body .dashboard-frequent-circles .circle,
    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-home-glass body :is(.qc,.qi,.qt,.qs) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      background:#d5e0e8 !important; background-image:none !important;
      color:#34434f !important; -webkit-text-fill-color:#34434f !important;
      border:1px solid var(--frost-home-outline,rgba(55,158,233,.48)) !important;
      box-shadow:var(--frost-raised) !important; backdrop-filter:none !important;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-home-glass body .dashboard-frequent-circles .circle:nth-child(4n + 2),
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body .qi { --frost-home-outline:rgba(102,186,240,.5); }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-home-glass body .dashboard-frequent-circles .circle:nth-child(4n + 3),
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body .qt { --frost-home-outline:rgba(180,82,201,.4); }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-home-glass body .dashboard-frequent-circles .circle:nth-child(4n),
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body .qs { --frost-home-outline:rgba(42,175,193,.48); }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-home-glass body .dashboard-frequent-circles .circle:active,
    html:root:root:root[data-xlyneve-color-theme="frost-outline"].theme-home-glass body :is(.qc,.qi,.qt,.qs) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle):active { box-shadow:var(--frost-inset) !important; }

    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(button,.qc-pill,.qt-pill,.qs-pill,.qc-result,.qt-result,.qs-result) {
      background:#d5e0e8 !important; background-image:none !important;
      color:#34434f !important; -webkit-text-fill-color:#34434f !important;
      border:1px solid var(--frost-home-outline,rgba(55,158,233,.48)) !important;
      box-shadow:var(--frost-raised) !important;
    }
    html:root:root:root[data-xlyneve-color-theme="frost-outline"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) button:is(.active,[aria-selected="true"],:active) {
      border:2px solid #75bde9 !important; box-shadow:var(--frost-inset) !important;
    }

  `;

  themeStyle.textContent += `
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] {
      --theme-ink:#373d44; --theme-muted-ink:#70757d;
      --pearl-base:#ebebeb; --pearl-card:rgba(250,250,247,.92);
      --pearl-reflection:linear-gradient(118deg,rgba(223,236,240,.7) 0%,rgba(249,234,227,.62) 24%,rgba(226,227,234,.75) 48%,rgba(247,247,245,.92) 68%,rgba(226,231,240,.6) 100%);
      --pearl-card-depth:inset 4px 4px 8px rgba(85,90,103,.16),inset -4px -4px 8px rgba(255,255,255,.94),0 1px 2px rgba(85,90,103,.08);
      --pearl-depth:0 7px 16px rgba(85,90,103,.14),inset 0 1px 1px rgba(255,255,255,.96),inset 0 -1px 1px rgba(132,139,149,.12);
      --pearl-inset:inset 2px 3px 6px rgba(100,108,119,.15),inset -2px -2px 5px rgba(255,255,255,.9);
      --glass-light:rgba(250,250,247,.92); --glass-edge:rgba(102,110,121,.25); --glass-shadow:rgba(85,90,103,.14);
      --refresh-cocoa:#373d44; --refresh-rose:#eeeeed; --refresh-lime:#f6f6f1; --refresh-stone:#ebebeb; --refresh-blue:#e4eaf0; --refresh-terracotta:#d9dce6;
      --quick-panel:#f2f2f0; --quick-field:#f6f6f3; --quick-ink:#373d44; --quick-soft:#e9edf0;
      --quick-accent:#d8e2e9; --quick-accent-ink:#373d44; --quick-edge:rgba(102,110,121,.25);
      --clinical-panel:#f6f6f3; --clinical-field:#fafaf7; --clinical-accent:#d8e2e9; --clinical-accent-ink:#373d44; --clinical-edge:rgba(102,110,121,.25);
      --homecal-header:var(--pearl-reflection); --homecal-header-ink:#373d44; --homecal-control:#f3f4f3; --homecal-control-ink:#373d44;
      --homecal-header-edge:rgba(102,110,121,.25); --homecal-today:#e5ecf0; --homecal-today-edge:#a4b9c7; --homecal-today-shadow:rgba(85,90,103,.14);
      --cal-light:#ebebeb; --cal-ink:#373d44; --cal-edge:rgba(102,110,121,.25);
      --note-editor-depth:var(--pearl-card-depth); --note-editor-inset:var(--pearl-inset); --note-editor-radius:22px;
      --cep-highlight-paper:#e7e9ed; --cep-highlight-shadow:inset 0 1px 0 rgba(255,255,255,.5);
      --copy-feedback-accent:#b9c9d4; --copy-feedback-soft:#f6f6f3;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"],html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body {
      background-color:#ebebeb !important;
      background-image:radial-gradient(ellipse at 8% 12%,rgba(228,240,244,.7),transparent 42%),radial-gradient(ellipse at 92% 65%,rgba(230,229,241,.6),transparent 44%),radial-gradient(ellipse at 75% 8%,rgba(245,222,210,.25),transparent 38%),linear-gradient(125deg,transparent 25%,rgba(255,255,249,.5) 35%,transparent 44%,rgba(219,233,240,.25) 69%,transparent 76%) !important;
      background-attachment:fixed !important; color:#373d44;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body::before { background:none !important; opacity:0 !important; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.chatBubble,.form-card,.library-card,.template-card,.panel,.pinned-note,.day:not(.empty),.todo-item,.file-item),
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"].theme-clinical body #notesList > .note-card,
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"].theme-home-glass body .main-content .card-group.section-card-group > .card {
      background:var(--pearl-reflection),#fafaf7 !important;
      color:#373d44 !important; border:1px solid rgba(90,102,114,.3) !important;
      border-radius:22px !important; box-shadow:var(--pearl-card-depth) !important;
      backdrop-filter:blur(8px) !important; -webkit-backdrop-filter:blur(8px) !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(.day.weekend,.day.saturday,.day.sunday) { background:#f1f2f2 !important; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body .day.today { background:#e5ecf0 !important; border:1px solid #a4b9c7 !important; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(.calendar-container,.todo-container,.homepage-notepad,.homepage-calendar,.universal-search,.cep-global-search-panel,:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background:linear-gradient(145deg,rgba(255,255,253,.9),rgba(240,241,239,.94)) !important;
      color:#373d44 !important; border:1px solid rgba(255,255,255,.92) !important;
      border-radius:26px !important; box-shadow:var(--pearl-depth) !important;
      backdrop-filter:blur(12px) !important; -webkit-backdrop-filter:blur(12px) !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.masthead,.dashboard-section-toggle) {
      background:var(--pearl-reflection) !important; color:#373d44 !important;
      border-color:rgba(255,255,255,.85) !important; box-shadow:var(--pearl-depth) !important;
      backdrop-filter:blur(8px) !important; -webkit-backdrop-filter:blur(8px) !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body .dashboard-section-toggle {
      box-sizing:border-box !important; min-height:48px !important; padding:10px 22px !important;
      line-height:1.3 !important; align-items:center !important;
      border:1px solid rgba(102,110,121,.25) !important; border-radius:24px !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(button,.glass-btn,.add-btn,.header-btn,.circle,a.cep-media-link):not(:where(.dashboard-section-toggle,.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) {
      background:var(--pearl-reflection) !important; color:#373d44 !important; -webkit-text-fill-color:#373d44 !important;
      border:1px solid rgba(90,102,114,.48) !important; box-shadow:var(--pearl-depth) !important;
      backdrop-filter:blur(8px) !important; -webkit-backdrop-filter:blur(8px) !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(button,.circle,a.cep-media-link):active:not(:where(.xlyneve-theme-option,.xlyneve-theme-button,.dot,.pick)) { box-shadow:var(--pearl-inset) !important; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      background:#f6f6f3 !important; color:#373d44 !important;
      border:1px solid rgba(102,110,121,.35) !important; border-radius:14px; box-shadow:var(--pearl-inset) !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(input,textarea,select):focus-visible { outline:2px solid #9eb9cb; outline-offset:2px; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(.cep-note-popup,.pn-edit-popup,#inputGroup,#nurseFormWrapper,.input-panel,#formCard,#notePanel,.note-card.editing-note,.note-card.is-editing) {
      background:#f6f6f3 !important; color:#373d44 !important; opacity:1 !important;
      box-shadow:var(--pearl-card-depth) !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body .todo-item.todo-item:not(#cep-pearl-no-task) :is(input[type="text"],textarea) { background:transparent !important; box-shadow:none !important; border:0 !important; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body #notes .notepad { background:var(--pearl-reflection),#fafaf7 !important; color:#373d44 !important; box-shadow:var(--pearl-card-depth) !important; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(.pad-controls,.homepage-notepad-drag-bar,.universal-search-filter-row,.cep-global-search-filters,.cep-global-search-group-cards,.universal-search-result-group) { background:transparent !important; box-shadow:none !important; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-pill,.qt-pill,.qs-pill,.qc-result,.qt-result,.qs-result) { background:#f6f6f3 !important; color:#373d44 !important; border-color:rgba(102,110,121,.25) !important; }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(:is(#quickCalc,#timeCalculator),#tabletCalculator,#syrupCalculator) button:is(.active,[aria-selected="true"]) { border:2px solid #9eb9cb !important; box-shadow:var(--pearl-inset) !important; }
    @media (max-width:600px) {
      html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(.note-card,.card,.day,.todo-item,.note-tile) { backdrop-filter:none !important; -webkit-backdrop-filter:none !important; }
    }

    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(.cep-note-popup,.pn-edit-popup) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) { background:none !important; border:0 !important; box-shadow:none !important; }

    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body:has(#chat) .chatBubble {
      background:var(--pearl-reflection),#fafaf7 !important; color:#373d44 !important;
      border:1px solid rgba(90,102,114,.3) !important; box-shadow:var(--pearl-card-depth) !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body .day.today { background:var(--pearl-reflection),#e5ecf0 !important; }

    html:root#homecal-embedded-document[data-xlyneve-color-theme="pearl-silver"] body#homecal-surface .day.embedded-selected-day,
    html:root#homecal-embedded-document[data-xlyneve-color-theme="pearl-silver"] body#homecal-surface #todoPanel #todoList .todo-item,
    html:root.home-notepad-embedded[data-xlyneve-color-theme="pearl-silver"] body #homepage-notepad-surface #notes .notepad {
      background:var(--pearl-reflection),#fafaf7 !important;
      border:1px solid rgba(90,102,114,.3) !important; box-shadow:var(--pearl-card-depth) !important;
    }

    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed {
      background:transparent !important; background-image:none !important;
      border:0 !important; border-radius:0 !important; box-shadow:none !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
      width:36px !important; min-width:36px !important; height:36px !important; padding:0 !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-head,.qi-head,.qt-head,.qs-head) {
      width:36px !important; height:36px !important; padding:0 !important;
      background:transparent !important; border:0 !important; box-shadow:none !important;
    }
    html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      width:36px !important; height:36px !important; min-width:36px !important;
      padding:0 !important; border-radius:50% !important;
      background:var(--pearl-reflection),#fafaf7 !important; color:#373d44 !important;
      border:1px solid rgba(90,102,114,.48) !important; box-shadow:var(--pearl-depth) !important;
      font-size:14px !important; line-height:1 !important;
    }
    @media (max-width:768px) {
      html:root:root:root[data-xlyneve-color-theme="pearl-silver"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) { font-size:0 !important; }
    }

  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="lavender-glass"] {
      --duo-base:#e1e3eb; --duo-panel:#eaecf3; --duo-field:#f3f5f9;
      --duo-material:linear-gradient(125deg,rgba(255,255,255,.65) 0%,rgba(255,255,255,.08) 21%,rgba(255,255,255,.02) 46%,rgba(215,232,255,.18) 70%,rgba(255,255,255,.4) 100%),linear-gradient(155deg,rgba(240,242,249,.16),rgba(205,222,240,.13));
      --duo-scene:radial-gradient(ellipse at 10% 8%,rgba(238,233,248,.65),transparent 48%),radial-gradient(ellipse at 90% 30%,rgba(202,225,245,.65),transparent 44%),radial-gradient(ellipse at 15% 90%,rgba(238,239,243,.75),transparent 44%),linear-gradient(125deg,#e3e3ec,#dce6f0 60%,#e6e2ed);
    }
    html[data-xlyneve-color-theme="grey-lavender"] {
      --duo-base:#ebebeb; --duo-panel:#f0eff5; --duo-field:#f7f6fa;
      --duo-material:linear-gradient(125deg,rgba(255,255,255,.74) 0%,rgba(255,255,255,.1) 21%,rgba(255,255,255,.03) 46%,rgba(219,229,251,.18) 70%,rgba(255,255,255,.48) 100%),linear-gradient(155deg,rgba(245,244,252,.15),rgba(214,214,233,.13));
      --duo-scene:radial-gradient(ellipse at 10% 8%,rgba(249,249,254,.9),transparent 48%),radial-gradient(ellipse at 90% 30%,rgba(218,213,237,.5),transparent 44%),radial-gradient(ellipse at 15% 90%,rgba(228,236,241,.65),transparent 44%),linear-gradient(125deg,#ebebeb,#e6e7ed 60%,#ece9ef);
    }
    html:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) {
      --theme-ink:#44335d; --theme-muted-ink:#716680;
      --duo-depth:inset 0 2px 3px rgba(255,255,255,.96),inset 1px 0 2px rgba(255,255,255,.65),inset 0 -1px 2px rgba(110,96,153,.18),0 0 9px rgba(235,235,255,.42),0 9px 20px rgba(89,68,119,.16);
      --duo-inset:inset 3px 3px 7px rgba(89,68,119,.15),inset -3px -3px 7px rgba(255,255,255,.8);
      --glass-light:var(--duo-panel); --glass-edge:rgba(255,255,255,.85); --glass-shadow:rgba(89,68,119,.12);
      --refresh-cocoa:#44335d; --refresh-rose:var(--duo-panel); --refresh-lime:var(--duo-panel); --refresh-stone:var(--duo-base); --refresh-blue:#dedcf2; --refresh-terracotta:#c5b5e3;
      --quick-panel:var(--duo-panel); --quick-field:var(--duo-field); --quick-ink:#44335d; --quick-soft:#e4dcef; --quick-accent:#d3c6ea; --quick-accent-ink:#44335d; --quick-edge:rgba(255,255,255,.85);
      --clinical-panel:var(--duo-panel); --clinical-field:var(--duo-field); --clinical-accent:#d3c6ea; --clinical-accent-ink:#44335d; --clinical-edge:rgba(255,255,255,.85);
      --homecal-header:var(--duo-material); --homecal-header-ink:#44335d; --homecal-control:var(--duo-field); --homecal-control-ink:#44335d;
      --homecal-header-edge:rgba(255,255,255,.85); --homecal-today:#e3d8f3; --homecal-today-edge:#baa4da; --homecal-today-shadow:rgba(89,68,119,.12);
      --cal-light:var(--duo-base); --cal-ink:#44335d; --cal-edge:rgba(255,255,255,.85);
      --note-editor-depth:var(--duo-depth); --note-editor-inset:var(--duo-inset); --note-editor-radius:24px;
      --cep-highlight-paper:#e6def1; --cep-highlight-shadow:none; --copy-feedback-accent:#bba6d9; --copy-feedback-soft:var(--duo-field);
    }
    html:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]),
    html:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body { background-color:var(--duo-base) !important; background-image:var(--duo-scene) !important; background-attachment:fixed !important; color:#44335d; }
    html:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body::before { background:none !important; opacity:0 !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.day:not(.empty),.todo-item,.file-item),
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]).theme-clinical body #notesList > .note-card,
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body:has(#chat) .chatBubble {
      background:var(--duo-material) !important; color:#44335d !important;
      border:1px solid rgba(255,255,255,.96) !important; border-radius:24px !important;
      box-shadow:var(--duo-depth) !important; backdrop-filter:blur(12px) saturate(135%) !important; -webkit-backdrop-filter:blur(12px) saturate(135%) !important;
    }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.dashboard-section-toggle,.calendar-container,.todo-container,.universal-search,.cep-global-search-panel,:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background:var(--duo-material) !important; color:#44335d !important;
      border-color:rgba(255,255,255,.85) !important; box-shadow:var(--duo-depth) !important; backdrop-filter:blur(10px) !important; -webkit-backdrop-filter:blur(10px) !important;
    }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body .dashboard-section-toggle { border:1px solid rgba(255,255,255,.96) !important; border-radius:24px !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(button,.circle,.glass-btn,.header-btn,.add-btn,a.cep-media-link):not(:where(.dot,.pick,.xlyneve-theme-option,.xlyneve-theme-button)) {
      background:var(--duo-material) !important; color:#44335d !important; -webkit-text-fill-color:#44335d !important;
      border:1px solid rgba(255,255,255,.96) !important; box-shadow:var(--duo-depth) !important; backdrop-filter:blur(8px) saturate(135%) !important; -webkit-backdrop-filter:blur(8px) saturate(135%) !important;
    }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(button,.circle,a.cep-media-link):active:not(:where(.dot,.pick,.xlyneve-theme-option,.xlyneve-theme-button)) { box-shadow:var(--duo-inset) !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      background:var(--duo-field) !important; color:#44335d !important; border:1px solid rgba(255,255,255,.85) !important; border-radius:16px; box-shadow:var(--duo-inset) !important;
    }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(.cep-note-popup,.pn-edit-popup,#inputGroup,#nurseFormWrapper,.input-panel,#formCard,#notePanel,.note-card.editing-note,.note-card.is-editing) {
      background:var(--duo-panel) !important; color:#44335d !important; opacity:1 !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important; box-shadow:var(--duo-depth) !important;
    }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(.cep-note-popup,.pn-edit-popup) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) { background:none !important; border:0 !important; box-shadow:none !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body .todo-item.todo-item:not(#cep-duo-no-task) :is(input[type="text"],textarea) { background:transparent !important; box-shadow:none !important; border:0 !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body #notes .notepad { background:var(--duo-material),var(--duo-field) !important; color:#44335d !important; box-shadow:var(--duo-depth) !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body .day.today { background:linear-gradient(145deg,rgba(234,222,249,.95),rgba(209,196,235,.85)) !important; border-color:#baa4da !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(.pad-controls,.homepage-notepad-drag-bar,.universal-search-filter-row,.cep-global-search-filters,.cep-global-search-group-cards,.universal-search-result-group) { background:transparent !important; box-shadow:none !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed {
      background:transparent !important; background-image:none !important; box-shadow:none !important; border:0 !important; backdrop-filter:none !important; width:36px !important; height:36px !important; padding:0 !important;
    }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-head,.qi-head,.qt-head,.qs-head) { background:transparent !important; border:0 !important; box-shadow:none !important; padding:0 !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) { width:36px !important; height:36px !important; padding:0 !important; border-radius:50% !important; }
    @media (max-width:600px) {
      html:root:root:root:root:is([data-xlyneve-color-theme="lavender-glass"],[data-xlyneve-color-theme="grey-lavender"]) body :is(.note-card,.note-tile,.day,.todo-item,.card) { backdrop-filter:blur(5px) saturate(125%) !important; -webkit-backdrop-filter:blur(5px) saturate(125%) !important; }
    }

  `;

  // Embedded Home windows have no material shell; only their actual cards are themed.
  themeStyle.textContent += `
    html:root:root:root:root:root:root body :is(#homepage-calendar,#homepage-notepad),
    html:root:root:root#homecal-embedded-document.homecal-embed-today,
    html:root:root:root#homecal-embedded-document.homecal-embed-today body#homecal-surface,
    html:root:root:root#homecal-embedded-document.homecal-embed-today body#homecal-surface :is(.calendar-container,.calendar-scroll-glass,.calendar,.todo-container,.todo-list),
    html:root:root:root.home-notepad-embedded,
    html:root:root:root.home-notepad-embedded body#homepage-notepad-document,
    html:root:root:root.home-notepad-embedded body :is(#homepage-notepad-surface,#notes) {
      background:transparent !important; background-image:none !important;
      border:0 !important; box-shadow:none !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root#homecal-embedded-document.homecal-embed-today body#homecal-surface :is(.calendar-container,.todo-container)::before,
    html:root:root:root#homecal-embedded-document.homecal-embed-today body#homecal-surface :is(.calendar-container,.todo-container)::after { content:none !important; }
  `;

  themeStyle.textContent += `
    html:root:root:root:root:root:root.theme-home-glass body .dashboard-section-toggle {
      box-sizing:border-box !important; min-height:48px !important;
      padding:10px 22px !important; line-height:1.3 !important; align-items:center !important;
    }
  `;

  themeStyle.textContent += `
    html:root:root:root:root:root:root body :is(#universalSearchRefresh,#universalSearchClose),
    html:root:root:root:root:root:root body .cep-global-search-row > button[aria-label="Close search"] {
      box-sizing:border-box !important; flex:0 0 30px !important;
      width:30px !important; height:30px !important; min-width:30px !important; min-height:30px !important;
      align-self:center !important; display:grid !important; place-items:center !important;
      padding:0 !important; border-radius:9px !important; font-size:19px !important; line-height:1 !important;
    }
  `;

  themeStyle.textContent += `
    html[data-xlyneve-color-theme="autumn"] { --classic-recessed-shade:rgba(54,53,54,.28); }
    html[data-xlyneve-color-theme="hoya"] { --classic-recessed-shade:rgba(51,75,80,.28); }
    html[data-xlyneve-color-theme="lake-mist"] { --classic-recessed-shade:rgba(68,61,53,.28); }
    html[data-xlyneve-color-theme="palm-springs"] { --classic-recessed-shade:rgba(31,44,44,.28); }
    html[data-xlyneve-color-theme="quiet-stone"] { --classic-recessed-shade:rgba(57,56,49,.28); }
    html:is([data-xlyneve-color-theme="autumn"],[data-xlyneve-color-theme="hoya"],[data-xlyneve-color-theme="lake-mist"],[data-xlyneve-color-theme="palm-springs"],[data-xlyneve-color-theme="quiet-stone"]) {
      --classic-recessed:inset 5px 5px 8px var(--classic-recessed-shade),inset -1px -1px 2px rgba(255,255,255,.16);
    }
    html:root:root:root:root:is([data-xlyneve-color-theme="autumn"],[data-xlyneve-color-theme="hoya"],[data-xlyneve-color-theme="lake-mist"],[data-xlyneve-color-theme="palm-springs"],[data-xlyneve-color-theme="quiet-stone"]) body :is(.note-card,.note-tile,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.file-item),
    html:root:root:root:root:is([data-xlyneve-color-theme="autumn"],[data-xlyneve-color-theme="hoya"],[data-xlyneve-color-theme="lake-mist"],[data-xlyneve-color-theme="palm-springs"],[data-xlyneve-color-theme="quiet-stone"]).theme-clinical body #notesList > .note-card { box-shadow:var(--classic-recessed) !important; }
    html:root:root:root:root:is([data-xlyneve-color-theme="autumn"],[data-xlyneve-color-theme="hoya"],[data-xlyneve-color-theme="lake-mist"],[data-xlyneve-color-theme="palm-springs"],[data-xlyneve-color-theme="quiet-stone"]) body:has(#chat) .chatBubble { box-shadow:var(--classic-recessed) !important; }
  `;

  // Editing fields use their own ink rather than the saved card's light ink.
  themeStyle.textContent += `
    html:root:root:root:root:root:root body :is(.note-title,.pinned-note-title,.note-content,.note-text,.editableNote)[contenteditable="true"],
    html:root:root:root:root:root body :is(.cep-note-popup,.pn-edit-popup,.note-card.is-editing,.note-card.editing-note,.input-panel,#inputGroup,#nurseFormWrapper,#formCard,#notePanel) :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),textarea,[contenteditable="true"]) {
      background:linear-gradient(var(--clinical-field,#fafafa),var(--clinical-field,#fafafa)),#fff !important;
      color:var(--theme-ink,#27323a) !important;
      -webkit-text-fill-color:var(--theme-ink,#27323a) !important;
      caret-color:var(--theme-ink,#27323a) !important;
      opacity:1 !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root:root:root:root body :is(.note-title,.pinned-note-title,.note-content,.note-text,.editableNote)[contenteditable="true"] :not([style*="color"]):not(table):not(table *),
    html:root:root:root:root:root:root body :is(.cep-note-popup,.pn-edit-popup,.note-card.is-editing,.note-card.editing-note) [contenteditable="true"] :not([style*="color"]):not(table):not(table *) {
      color:inherit !important; -webkit-text-fill-color:currentColor !important;
    }
  `;


  // Both search locations show a persistent, theme-matched selected mode.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root body :is(.universal-search-mode,.cep-global-search-modes button)[data-search-mode][aria-pressed="true"]:not(#cep-search-mode-unused) {
      background:var(--search-mode-selected,var(--page-header-solid)) !important;
      background-image:none !important;
      color:var(--search-mode-selected-ink,#253544) !important; -webkit-text-fill-color:var(--search-mode-selected-ink,#253544) !important;
      border-color:#8197aa !important; outline:2px solid rgba(71,100,124,.38) !important;
      outline-offset:-2px; opacity:1 !important;
    }
  `;


  // Vital-signs reference: theme materials and ink, with no changes to values.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root body #vital-signs-table,
    html:root:root:root:root:root:root:root:root.theme-vitals-table body > table {
      background:var(--duo-material,var(--pearl-reflection,var(--quick-panel,var(--clinical-panel,#efede8)))) !important;
      color:var(--theme-ink,var(--page-header-ink,#39190f)) !important;
      border:1px solid var(--clinical-edge,rgba(120,120,120,.25)) !important;
      border-radius:var(--note-editor-radius,16px) !important;
      box-shadow:var(--classic-recessed,var(--note-editor-depth,0 8px 24px rgba(40,40,40,.15))) !important;
    }
    html:root:root:root:root:root:root:root:root body #vital-signs-table :is(th,td),
    html:root:root:root:root:root:root:root:root.theme-vitals-table body > table :is(th,td):not(#cep-vitals-unused) {
      background:var(--clinical-field,var(--quick-field,#f5f3ef)) !important;
      color:var(--theme-ink,var(--page-header-ink,#39190f)) !important;
      -webkit-text-fill-color:currentColor !important;
      border:1px solid var(--clinical-edge,rgba(120,120,120,.25)) !important;
      text-shadow:none !important;
    }
    html:root:root:root:root:root:root:root:root body #vital-signs-table th,
    html:root:root:root:root:root:root:root:root.theme-vitals-table body > table th:not(#cep-vitals-unused),
    html:root:root:root:root:root:root:root:root body #vital-signs-table tbody tr:hover td,
    html:root:root:root:root:root:root:root:root.theme-vitals-table body > table tbody tr:hover td:not(#cep-vitals-unused) {
      background:var(--search-mode-selected,var(--clinical-accent,#e5cbcc)) !important;
      color:var(--search-mode-selected-ink,var(--clinical-accent-ink,#39190f)) !important;
      -webkit-text-fill-color:currentColor !important;
    }
    html:root:root:root:root:root:root:root:root body #vital-signs-table h2,
    html:root:root:root:root:root:root:root:root.theme-vitals-table body > h1 {
      color:var(--theme-ink,var(--page-header-ink,#39190f)) !important;
      -webkit-text-fill-color:currentColor !important;
    }
  `;


  // Pastel Rose twins: the same palette and layout, with distinct depth.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="pastel-rose-5d"] {
      --rose-depth:inset 2px 2px 3px rgba(255,255,251,.95),inset -3px -4px 5px rgba(137,91,104,.18),0 3px 2px rgba(137,91,104,.2),7px 10px 18px rgba(137,91,104,.23),-5px -5px 12px rgba(255,255,251,.88);
      --rose-edge:rgba(255,255,255,.85);
    }
    html[data-xlyneve-color-theme="pastel-rose-recessed"] {
      --rose-depth:inset 5px 6px 9px rgba(120,117,110,.36),inset -4px -4px 7px rgba(255,255,255,.92);
      --rose-edge:rgba(157,151,143,.28);
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) {
      --rose-base:#f6f5f3; --rose-panel:#f0efed; --rose-field:#faf9f7;
      --rose-well:inset 2px 3px 5px rgba(111,79,88,.22),inset 0 -1px 0 rgba(255,255,255,.75);
      --theme-ink:#3c3037; --theme-muted-ink:#7d6971;
      --glass-light:#f0efed; --glass-edge:var(--rose-edge); --glass-shadow:rgba(137,91,104,.16);
      --refresh-cocoa:#3c3037; --refresh-rose:#f3cdd4; --refresh-lime:#f8e1be; --refresh-stone:#fbf4f2; --refresh-blue:#dfeaf1; --refresh-terracotta:#f8aa80;
      --quick-panel:#f0efed; --quick-field:#faf9f7; --quick-ink:#3c3037; --quick-soft:#f3cdd4; --quick-accent:#ce8a9f; --quick-accent-ink:#3c3037; --quick-edge:var(--rose-edge);
      --clinical-panel:#f0efed; --clinical-field:#faf9f7; --clinical-accent:#ce8a9f; --clinical-accent-ink:#3c3037; --clinical-edge:var(--rose-edge);
      --homecal-header:#f0efed; --homecal-header-ink:#3c3037; --homecal-control:#faf9f7; --homecal-control-ink:#3c3037; --homecal-header-edge:var(--rose-edge);
      --homecal-today:#f8e1be; --homecal-today-edge:#dfc69f; --homecal-today-shadow:rgba(137,91,104,.12);
      --cal-light:#fbf4f2; --cal-ink:#3c3037; --cal-edge:var(--rose-edge);
      --note-editor-depth:var(--rose-depth); --note-editor-inset:var(--rose-well); --note-editor-radius:24px;
      --cep-highlight-paper:#f3dfe6; --cep-highlight-shadow:none;
      --copy-feedback-accent:#ce8a9f; --copy-feedback-soft:#f0efed;
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]),html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body {
      background:var(--rose-base) !important; background-image:none !important; color:#3c3037;
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body::before { background:none !important; opacity:0 !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.day:not(.empty),.todo-item,.file-item),
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]).theme-clinical body #notesList > .note-card,
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body:has(#chat) .chatBubble {
      background:var(--card-solid,#f3cdd4) !important; background-image:none !important;
      color:#3c3037 !important; -webkit-text-fill-color:currentColor !important;
      border:1px solid var(--rose-edge) !important; border-radius:24px !important;
      box-shadow:var(--rose-depth) !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.dashboard-section-toggle,.universal-search,.cep-global-search-panel,:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background:#f0efed !important; background-image:none !important; color:#3c3037 !important;
      border-color:var(--rose-edge) !important; border-radius:24px;
      box-shadow:var(--rose-depth) !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(button,.circle,.glass-btn,.header-btn,.add-btn,a.cep-media-link):not(:where(.dot,.pick,.xlyneve-theme-option,.xlyneve-theme-manage)) {
      background:var(--rose-button,#f0efed) !important; background-image:none !important;
      color:#3c3037 !important; -webkit-text-fill-color:#3c3037 !important;
      border:1px solid var(--rose-edge) !important; border-radius:16px; box-shadow:var(--rose-depth) !important;
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .dashboard-frequent-circles .circle { border-radius:50% !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .dashboard-frequent-circles .circle:nth-child(5n + 1) { --rose-button:#f3cdd4; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .dashboard-frequent-circles .circle:nth-child(5n + 2) { --rose-button:#f8aa80; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .dashboard-frequent-circles .circle:nth-child(5n + 3) { --rose-button:#dfeaf1; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .dashboard-frequent-circles .circle:nth-child(5n + 4) { --rose-button:#f8e1be; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .dashboard-frequent-circles .circle:nth-child(5n) { --rose-button:#ce8a9f; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(button,.circle,a.cep-media-link):active:not(:where(.dot,.pick,.xlyneve-theme-option,.xlyneve-theme-manage)) { box-shadow:var(--rose-well) !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      background:#faf9f7 !important; color:#3c3037 !important;
      border:1px solid rgba(157,119,132,.18) !important; border-radius:16px;
      box-shadow:var(--rose-well) !important;
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(.cep-note-popup,.pn-edit-popup,#inputGroup,#nurseFormWrapper,.input-panel,#formCard,#notePanel,.note-card.editing-note,.note-card.is-editing) {
      background:#f0efed !important; color:#3c3037 !important; opacity:1 !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important; box-shadow:var(--rose-depth) !important;
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(.cep-note-popup,.pn-edit-popup) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) { background:none !important; border:0 !important; box-shadow:none !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .todo-item.todo-item:not(#cep-rose-no-task) :is(input[type="text"],textarea) { background:transparent !important; border:0 !important; box-shadow:none !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body #notes .notepad { background:#faf9f7 !important; color:#3c3037 !important; box-shadow:var(--rose-depth) !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .day.today:not(.empty) { background:var(--homecal-today) !important; border-color:var(--homecal-today-edge) !important; box-shadow:var(--rose-depth) !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(.pad-controls,.homepage-notepad-drag-bar,.universal-search-filter-row,.cep-global-search-filters,.cep-global-search-group-cards,.universal-search-result-group) { background:transparent !important; box-shadow:none !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed {
      background:transparent !important; background-image:none !important; border-color:transparent !important; box-shadow:none !important;
    }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-head,.qi-head,.qt-head,.qs-head) { background:transparent !important; border:0 !important; box-shadow:none !important; }
    html:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(.note-card,.note-tile,.chatBubble,.notepad) :is([style*="color"],font[color]) { -webkit-text-fill-color:currentColor !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="pastel-rose-recessed"] body #notes .notepad {
      background:#f0efed !important; box-shadow:var(--rose-depth) !important;
    }
  `;


  themeStyle.textContent += `
    html:root:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.top-links) a,
    html:root:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.top-links) a * {
      color:#3c3037 !important; -webkit-text-fill-color:#3c3037 !important;
      text-shadow:none !important;
    }
  `;


  themeStyle.textContent += `
    html:root:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body :is(.top-links a,.glass-pill-menu,.glass-pill-link) {
      background:var(--rose-panel) !important; background-image:none !important;
      color:#3c3037 !important; -webkit-text-fill-color:#3c3037 !important;
      border-color:var(--rose-edge) !important; box-shadow:var(--rose-depth) !important;
    }
  `;


  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .top-links a {
      background:transparent !important; background-image:none !important;
      border:0 !important; border-radius:0 !important; box-shadow:none !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
      color:#3c3037 !important; -webkit-text-fill-color:#3c3037 !important;
    }
    html:root:root:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .top-links a::before,
    html:root:root:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body .top-links a::after { background:none !important; box-shadow:none !important; border:0 !important; }
  `;


  // Glossy opal: pearl-inspired colours and reflections over a neutral base.
  themeStyle.textContent += `
    html[data-xlyneve-color-theme="opal-pearl"] {
      --opal-panel:#f5f7f6; --opal-field:#fbfcfa;
      --opal-surface:radial-gradient(ellipse at 18% 0%,rgba(255,255,255,.96),transparent 58%),linear-gradient(135deg,rgba(246,249,248,.98),rgba(225,238,243,.96) 35%,rgba(239,228,238,.96) 63%,rgba(249,246,234,.98));
      --opal-depth:inset 0 2px 3px rgba(255,255,255,.95),inset 0 -2px 4px rgba(124,143,152,.12),0 7px 16px rgba(75,99,112,.2),0 1px 2px rgba(75,99,112,.1);
      --opal-well:inset 3px 4px 7px rgba(89,111,127,.2),inset -2px -2px 4px rgba(255,255,255,.85);
      --theme-ink:#35424d; --theme-muted-ink:#74828b;
      --glass-light:#f5f7f6; --glass-edge:rgba(255,255,255,.9); --glass-shadow:rgba(75,99,112,.18);
      --refresh-cocoa:#35424d; --refresh-rose:#f4e8ec; --refresh-lime:#f7f3e5; --refresh-stone:#f5f7f6; --refresh-blue:#e8f1f4; --refresh-terracotta:#c9b67e;
      --quick-panel:#f5f7f6; --quick-field:#fbfcfa; --quick-ink:#35424d; --quick-soft:#e8f1f4; --quick-accent:#b7ceda; --quick-accent-ink:#35424d; --quick-edge:rgba(255,255,255,.9);
      --clinical-panel:#f5f7f6; --clinical-field:#fbfcfa; --clinical-accent:#b7ceda; --clinical-accent-ink:#35424d; --clinical-edge:rgba(255,255,255,.9);
      --homecal-header:#f5f7f6; --homecal-header-ink:#35424d; --homecal-control:#fbfcfa; --homecal-control-ink:#35424d; --homecal-header-edge:rgba(255,255,255,.9);
      --homecal-today:linear-gradient(145deg,#f1e9ed,#e6e8f2); --homecal-today-edge:rgba(201,182,126,.6); --homecal-today-shadow:rgba(75,99,112,.14);
      --cal-light:#f5f7f6; --cal-ink:#35424d; --cal-edge:rgba(255,255,255,.9);
      --note-editor-depth:var(--opal-depth); --note-editor-inset:var(--opal-well); --note-editor-radius:26px;
      --cep-highlight-paper:#e9edf2; --cep-highlight-shadow:none;
      --copy-feedback-accent:#b7ceda; --copy-feedback-soft:#f5f7f6;
    }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"],html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body {
      background-color:#e8edf0 !important;
      background-image:linear-gradient(145deg,#f0f3f4,#f6f3ef 48%,#edf2f5) !important;
      background-size:cover !important; background-position:center !important; background-repeat:no-repeat !important;
      background-attachment:fixed !important; color:#35424d;
    }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body::before { background:none !important; opacity:0 !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.day:not(.empty),.todo-item,.file-item),
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"].theme-clinical body #notesList > .note-card,
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body:has(#chat) .chatBubble {
      background:var(--opal-surface) !important; color:#35424d !important;
      border:1px solid rgba(255,255,255,.95) !important; border-bottom-color:rgba(201,182,126,.32) !important;
      border-radius:26px !important; box-shadow:var(--opal-depth) !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.dashboard-section-toggle,.universal-search,.cep-global-search-panel,:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background:var(--opal-surface) !important; color:#35424d !important; border-color:rgba(255,255,255,.9) !important;
      border-radius:26px; box-shadow:var(--opal-depth) !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(button,.circle,.glass-btn,.header-btn,.add-btn,a.cep-media-link):not(:where(.dot,.pick,.xlyneve-theme-option,.xlyneve-theme-manage)) {
      background:var(--opal-surface) !important; color:#35424d !important; -webkit-text-fill-color:#35424d !important;
      border:1px solid rgba(255,255,255,.95) !important; border-radius:16px; box-shadow:var(--opal-depth) !important;
    }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body .dashboard-frequent-circles .circle { border-radius:50% !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(button,.circle,a.cep-media-link):active:not(:where(.dot,.pick,.xlyneve-theme-option,.xlyneve-theme-manage)) { box-shadow:var(--opal-well) !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable) {
      background:#fbfcfa !important; color:#35424d !important; border:1px solid rgba(160,179,190,.3) !important;
      border-radius:16px; box-shadow:var(--opal-well) !important;
    }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(.cep-note-popup,.pn-edit-popup,#inputGroup,#nurseFormWrapper,.input-panel,#formCard,#notePanel,.note-card.editing-note,.note-card.is-editing) {
      background:#f5f7f6 !important; color:#35424d !important; opacity:1 !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important; box-shadow:var(--opal-depth) !important;
    }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(.cep-note-popup,.pn-edit-popup) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) { background:none !important; border:0 !important; box-shadow:none !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body .todo-item.todo-item:not(#cep-opal-no-task) :is(input[type="text"],textarea) { background:transparent !important; border:0 !important; box-shadow:none !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body #notes .notepad { background:#fbfcfa !important; color:#35424d !important; box-shadow:var(--opal-depth) !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body .day.today:not(.empty) { background:var(--homecal-today) !important; border-color:var(--homecal-today-edge) !important; box-shadow:var(--opal-depth) !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(.pad-controls,.homepage-notepad-drag-bar,.universal-search-filter-row,.cep-global-search-filters,.cep-global-search-group-cards,.universal-search-result-group) { background:transparent !important; box-shadow:none !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed { background:transparent !important; background-image:none !important; border-color:transparent !important; box-shadow:none !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(:is(#quickCalc,#timeCalculator),#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-head,.qi-head,.qt-head,.qs-head) { background:transparent !important; border:0 !important; box-shadow:none !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(.note-card,.note-tile,.chatBubble,.notepad) :is([style*="color"],font[color]) { -webkit-text-fill-color:currentColor !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.top-links) a,
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.top-links) a * { color:#35424d !important; -webkit-text-fill-color:#35424d !important; text-shadow:none !important; }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body .top-links a {
      background:transparent !important; background-image:none !important; border:0 !important; border-radius:0 !important;
      box-shadow:none !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body .top-links a::before,html:root:root:root:root:root[data-xlyneve-color-theme="opal-pearl"] body .top-links a::after { background:none !important; border:0 !important; box-shadow:none !important; }
  `;


  themeStyle.textContent += `
    html:root:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]).theme-homecal body .day:not(.empty):not(.today) {
      background:#f0efed !important; background-image:none !important;
      color:#3c3037 !important; -webkit-text-fill-color:currentColor !important;
      border-color:var(--rose-edge) !important; box-shadow:var(--rose-depth) !important;
    }
  `;

  // Matte inset wells: a defined inner lip without a broad lower glow.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="pastel-rose-recessed"] {
      --rose-base:#e9e9e1; --rose-panel:#e9e9e1; --rose-field:#e9e9e1;
      --rose-depth:inset 0 2px 2px rgba(86,88,78,.27),inset 2px 5px 7px rgba(111,114,102,.23),inset 0 -1px 0 rgba(255,255,255,.65);
      --rose-well:inset 0 2px 2px rgba(86,88,78,.25),inset 1px 3px 5px rgba(111,114,102,.2),inset 0 -1px 0 rgba(255,255,255,.6);
      --rose-edge:transparent;
      --quick-panel:#e9e9e1; --quick-field:#e9e9e1;
      --clinical-panel:#e9e9e1; --clinical-field:#e9e9e1;
      --homecal-header:#e9e9e1; --homecal-control:#e9e9e1;
      --note-editor-radius:30px;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="pastel-rose-recessed"] body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.todo-item,.file-item),
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="pastel-rose-recessed"].theme-clinical body #notesList > .note-card,
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="pastel-rose-recessed"] body:has(#chat) .chatBubble {
      background:var(--card-solid,#f3cdd4) !important;
      background-image:none !important;
      border:1px solid transparent !important; border-radius:30px !important;
      box-shadow:var(--rose-depth) !important;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="pastel-rose-recessed"] body :is(.day:not(.empty),#notes .notepad) {
      border:1px solid transparent !important; border-radius:30px !important;
      box-shadow:var(--rose-depth) !important;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="pastel-rose-recessed"] body :is(button,.circle,.glass-btn,.header-btn,.add-btn,a.cep-media-link):not(:where(.dot,.pick,.xlyneve-theme-option,.xlyneve-theme-manage)) {
      border:1px solid transparent !important;
    }
  `;

  // Palm Springs cards keep their palette without the carved corner shadows.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="palm-springs"] body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.file-item,.day:not(.empty),.todo-item,.universal-search-native-card,.cep-global-search-result,.cep-concept-search-result),
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="palm-springs"].theme-clinical body #notesList > .note-card,
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="palm-springs"] body:has(#chat) .chatBubble,
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="palm-springs"] body #notes .notepad {
      box-shadow:none !important;
    }
  `;

  // ChatGPTX keeps pastel colour at the edge rather than filling the note.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme="pastel-rose-5d"],[data-xlyneve-color-theme="pastel-rose-recessed"]) body:has(#chat) .chatBubble {
      background:#faf9f7 !important; background-image:none !important;
      border:1.5px solid #d9a7b8 !important;
    }
  `;


  // Warm Ivory: matte surfaces, fine taupe rims and shallow tactile controls.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] {
      --ivory-base:#e6dfd4; --ivory-paper:#eee7dd; --ivory-field:#f4eee5; --ivory-edge:#b9ad9e;
      --ivory-depth:inset 0 1px 0 rgba(255,252,245,.72),0 2px 5px rgba(75,62,46,.10);
      --ivory-well:inset 0 1px 3px rgba(75,62,46,.14),0 1px 0 rgba(255,252,245,.55);
      --theme-ink:#37352f; --theme-muted-ink:#766d62;
      --glass-light:#eee7dd; --glass-edge:#c7bcad; --glass-shadow:rgba(75,62,46,.12);
      --refresh-cocoa:#37352f; --refresh-rose:#d8b9b3; --refresh-lime:#c9ceba; --refresh-stone:#e6dfd4; --refresh-blue:#b8c3b7; --refresh-terracotta:#c2aa73;
      --quick-panel:#eee7dd; --quick-field:#f4eee5; --quick-ink:#37352f; --quick-soft:#e6d7cd;
      --quick-accent:#c4a09b; --quick-accent-ink:#37352f; --quick-edge:#b9ad9e;
      --clinical-panel:#eee7dd; --clinical-field:#f4eee5; --clinical-accent:#c4a09b; --clinical-accent-ink:#37352f; --clinical-edge:#b9ad9e;
      --homecal-header:#e6dfd4; --homecal-header-ink:#37352f; --homecal-control:#eee7dd; --homecal-control-ink:#37352f; --homecal-header-edge:#b9ad9e;
      --homecal-today:#e2cf9f; --homecal-today-edge:#b49c64; --homecal-today-shadow:rgba(75,62,46,.12);
      --note-editor-depth:var(--ivory-depth); --note-editor-inset:var(--ivory-well); --note-editor-radius:20px;
      --vitals-panel:#eee7dd; --vitals-field:#f4eee5; color-scheme:light;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"], html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body {background:#e6dfd4!important;color:#37352f!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body {background-image:linear-gradient(140deg,#ece5db 0%,#e6dfd4 65%,#ded5c8 100%)!important;background-attachment:fixed;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body::before {background:none!important;opacity:0!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.todo-item,.file-item),
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"].theme-clinical body #notesList > .note-card,
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body:has(#chat) .chatBubble {
      background:var(--card-solid,#eee7dd)!important;background-image:none!important;
      color:#37352f!important;-webkit-text-fill-color:currentColor!important;
      border:1px solid var(--card-outline,#b9ad9e)!important;border-radius:20px!important;
      box-shadow:var(--ivory-depth)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.note-card,.note-tile,.card,.chatBubble,.file-item)::before,
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.note-card,.note-tile,.card,.chatBubble,.file-item)::after {content:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.dashboard-section-toggle,.universal-search,.cep-global-search-panel,.calendar-container,.todo-container,.homepage-notepad,.homepage-calendar,#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background:#e6dfd4!important;background-image:none!important;color:#37352f!important;
      border:1px solid #b9ad9e!important;box-shadow:var(--ivory-depth)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(button,.circle,.glass-btn,.header-btn,.add-btn,a.cep-media-link):not(:where(.dot,.pick,.xlyneve-theme-option,.xlyneve-theme-swatch,.highlight-color-choice,.font-color-choice,[data-color])) {
      background:var(--ivory-button,#eee7dd)!important;background-image:none!important;
      color:#37352f!important;-webkit-text-fill-color:currentColor!important;
      border:1px solid #b9ad9e!important;box-shadow:var(--ivory-depth)!important;text-shadow:none!important;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(button,.circle,a.cep-media-link):active:not(:where(.dot,.pick,.xlyneve-theme-option,[data-color])) {box-shadow:var(--ivory-well)!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-frequent-circles .circle {border-radius:50%!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-frequent-circles .circle:nth-child(5n+1) {--ivory-button:#d8b9b3;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-frequent-circles .circle:nth-child(5n+2) {--ivory-button:#c9ceba;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-frequent-circles .circle:nth-child(5n+3) {--ivory-button:#e2cf9f;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-frequent-circles .circle:nth-child(5n+4) {--ivory-button:#c9b8bd;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-frequent-circles .circle:nth-child(5n) {--ivory-button:#d7cbbb;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,.editableNote,#noteText.editable,.cep-pn-editor) {
      background:#f4eee5!important;color:#37352f!important;-webkit-text-fill-color:currentColor!important;
      border:1px solid #c7bcad!important;box-shadow:var(--ivory-well)!important;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.cep-note-popup,.pn-edit-popup,#inputGroup,#nurseFormWrapper,.input-panel,#formCard,#notePanel,.note-card.editing-note,.note-card.is-editing) {
      background:#eee7dd!important;background-image:none!important;color:#37352f!important;opacity:1!important;
      border:1px solid #b9ad9e!important;box-shadow:var(--ivory-depth)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.cep-note-popup,.pn-edit-popup) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .day:not(.empty) {background:#eee7dd!important;color:#37352f!important;border:1px solid #c7bcad!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .day.today:not(.empty) {background:#e2cf9f!important;border-color:#b49c64!important;box-shadow:var(--ivory-depth)!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .todo-item :is(input[type="text"],textarea) {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body #notes .notepad {background:#eee7dd!important;color:#37352f!important;border:1px solid #b9ad9e!important;box-shadow:var(--ivory-depth)!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.pad-controls,.homepage-notepad-drag-bar,.universal-search-filter-row,.cep-global-search-filters,.cep-global-search-group-cards,.universal-search-result-group) {background:transparent!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-head,.qi-head,.qt-head,.qs-head) {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) button:is(.active,[aria-selected="true"]) {background:#d8b9b3!important;box-shadow:var(--ivory-well)!important;border-color:#af969c!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.universal-search-modes,.cep-global-search-modes) button.is-active {background:#c4a09b!important;color:#37352f!important;border-color:#a8837e!important;box-shadow:var(--ivory-well)!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.xgpt-media-tip,.cep-xgpt-media-tip,#defTip,#cep-shared-tip,#pn-definition-tip) {background:#f4eee5!important;color:#37352f!important;border:1px solid #b9ad9e!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(.note-card,.note-tile,.chatBubble,.notepad) :is([style*="color"],font[color]) {-webkit-text-fill-color:currentColor!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .top-links a,html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .top-links a * {color:#37352f!important;-webkit-text-fill-color:#37352f!important;text-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .top-links a {background:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .top-links a::before,html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .top-links a::after {content:none!important;}
  `;

  themeStyle.textContent += `
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-section-toggle {border-radius:14px!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-section-heading {border-bottom:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body .dashboard-section-chevron {color:#8c7f6e!important;text-shadow:none!important;}
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      background:#eee7dd!important;color:#37352f!important;border:1px solid #b9ad9e!important;box-shadow:var(--ivory-depth)!important;
    }
    html:root:root:root:root:root:root:root[data-xlyneve-color-theme="warm-ivory"] body:has(#chat) .chatBubble {background:#eee7dd!important;border-color:#b9ad9e!important;}
  `;

  // Home's Sculpted icons use a diffuse matte face with no pressed halo.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body :is(.dashboard-frequent-circles .circle,#quickCalc .qc-toggle,#timeCalculator .qc-toggle,#quickInteleviewer .qi-toggle,#tabletCalculator .qt-toggle,#syrupCalculator .qs-toggle,.xlyneve-theme-button,.cep-sign-out-light,.header-search-trigger) {
      background-color:var(--sculpt-home-matte,var(--quick-field,#e9dee8))!important;
      background-image:none!important;color:#39353a!important;-webkit-text-fill-color:currentColor!important;
      border-color:rgba(87,72,94,.20)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 2px 5px rgba(57,53,58,.13)!important;
      backdrop-filter:none!important;-webkit-backdrop-filter:none!important;filter:none!important;
      animation:none!important;transition:transform 100ms ease-out!important;
      -webkit-tap-highlight-color:transparent;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body .dashboard-frequent-circles .circle:nth-child(5n+1) {--sculpt-home-matte:#b39cc4;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body .dashboard-frequent-circles .circle:nth-child(5n+2) {--sculpt-home-matte:#82bfcc;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body .dashboard-frequent-circles .circle:nth-child(5n+3) {--sculpt-home-matte:#c8a7a3;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body .dashboard-frequent-circles .circle:nth-child(5n+4) {--sculpt-home-matte:#dac3d8;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body .dashboard-frequent-circles .circle:nth-child(5n) {--sculpt-home-matte:#c7cbc5;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body .dashboard-frequent-circles .circle.home-search-icon {--sculpt-home-matte:var(--quick-field,#f4f1eb);}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body :is(.dashboard-frequent-circles .circle,#quickCalc .qc-toggle,#timeCalculator .qc-toggle,#quickInteleviewer .qi-toggle,#tabletCalculator .qt-toggle,#syrupCalculator .qs-toggle,.xlyneve-theme-button,.cep-sign-out-light,.header-search-trigger):is(:hover,:active) {
      box-shadow:none!important;filter:none!important;animation:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body :is(.dashboard-frequent-circles .circle,#quickCalc .qc-toggle,#timeCalculator .qc-toggle,#quickInteleviewer .qi-toggle,#tabletCalculator .qt-toggle,#syrupCalculator .qs-toggle,.xlyneve-theme-button,.cep-sign-out-light,.header-search-trigger):hover {transform:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body :is(.dashboard-frequent-circles .circle,#quickCalc .qc-toggle,#timeCalculator .qc-toggle,#quickInteleviewer .qi-toggle,#tabletCalculator .qt-toggle,#syrupCalculator .qs-toggle,.xlyneve-theme-button,.cep-sign-out-light,.header-search-trigger):active {transform:translateY(1px)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body .dashboard-frequent-circles .circle::after {
      content:none!important;display:none!important;background:none!important;box-shadow:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body :is(.dashboard-frequent-circles .circle,#quickCalc .qc-toggle,#timeCalculator .qc-toggle,#quickInteleviewer .qi-toggle,#tabletCalculator .qt-toggle,#syrupCalculator .qs-toggle,.xlyneve-theme-button,.cep-sign-out-light,.header-search-trigger):focus-visible {outline:2px solid #746081!important;outline-offset:3px;}
    @media(prefers-reduced-motion:reduce) {html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="sculpted"].theme-home-glass body :is(.dashboard-frequent-circles .circle,#quickCalc .qc-toggle,#timeCalculator .qc-toggle,#quickInteleviewer .qi-toggle,#tabletCalculator .qt-toggle,#syrupCalculator .qs-toggle,.xlyneve-theme-button,.cep-sign-out-light,.header-search-trigger) {transition:none!important;}}
  `;

  // Cloud Glass: airy blue/lavender frosting, thin white rims and quiet depth.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] {
      color-scheme:light;--theme-ink:#273047;--theme-muted-ink:#65718a;
      --cloud-surface:linear-gradient(145deg,rgba(255,255,255,.68),rgba(245,248,255,.30));
      --cloud-depth:inset 0 1px 0 rgba(255,255,255,.92),0 7px 20px rgba(91,108,155,.10);
      --cloud-well:inset 0 1px 4px rgba(105,116,153,.12),0 1px 0 rgba(255,255,255,.70);
      --glass-light:rgba(248,250,255,.60);--glass-edge:rgba(255,255,255,.83);--glass-shadow:rgba(91,108,155,.12);
      --refresh-cocoa:#273047;--refresh-rose:#d9c6e7;--refresh-lime:#c4ded9;--refresh-stone:#e9edf9;--refresh-blue:#c8daf1;--refresh-terracotta:#efcfb7;
      --quick-panel:#eef1fc;--quick-field:rgba(255,255,255,.76);--quick-ink:#273047;--quick-soft:#e6e2f6;
      --quick-accent:#c9bcec;--quick-accent-ink:#343957;--quick-edge:rgba(255,255,255,.85);
      --clinical-panel:#eef1fc;--clinical-field:#f6f8ff;--clinical-accent:#c9bcec;--clinical-accent-ink:#343957;--clinical-edge:#c5cce1;
      --homecal-header:#e5eafa;--homecal-header-ink:#273047;--homecal-control:#f2f5fe;--homecal-control-ink:#273047;--homecal-header-edge:rgba(255,255,255,.85);
      --homecal-today:#ddd5f5;--homecal-today-edge:#ada4d6;--homecal-today-shadow:rgba(108,108,164,.14);
      --note-editor-depth:var(--cloud-depth);--note-editor-inset:var(--cloud-well);--note-editor-radius:20px;
      --vitals-panel:#eef1fc;--vitals-field:#f6f8ff;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"],html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body {background:#e5eafa!important;color:#273047!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body {
      background-image:radial-gradient(ellipse at 3% 4%,rgba(176,180,244,.48),transparent 47%),radial-gradient(ellipse at 95% 8%,rgba(249,220,215,.38),transparent 36%),radial-gradient(ellipse at 83% 75%,rgba(175,208,249,.52),transparent 54%),radial-gradient(ellipse at 6% 92%,rgba(221,202,242,.55),transparent 48%),linear-gradient(125deg,#edf2fd,#e4eafa 65%,#eeeafa)!important;
      background-attachment:fixed;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body::before {background:none!important;opacity:0!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(h1,h2,h3,.pageTitle,.title,.dashboard-frequent-title,.dashboard-section-toggle,.dashboard-section-chevron,.note-title,.cep-source-title,.cep-source-note-title) {color:#273047!important;-webkit-text-fill-color:currentColor!important;text-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.todo-item,.file-item),
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"].theme-clinical body #notesList > .note-card,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body:has(#chat) .chatBubble {
      background:linear-gradient(145deg,rgba(255,255,255,.72),rgba(255,255,255,.30)),color-mix(in srgb,var(--card-solid,#e9edf9) 38%,transparent)!important;
      border:1px solid rgba(255,255,255,.88)!important;border-radius:20px!important;
      color:#273047!important;-webkit-text-fill-color:currentColor!important;
      box-shadow:var(--cloud-depth)!important;backdrop-filter:blur(10px) saturate(115%)!important;-webkit-backdrop-filter:blur(10px) saturate(115%)!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.note-card,.note-tile,.card,.chatBubble,.file-item)::before,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.note-card,.note-tile,.card,.chatBubble,.file-item)::after {content:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.dashboard-section-toggle,.universal-search,.cep-global-search-panel,.calendar-container,.todo-container,.homepage-notepad,.homepage-calendar,#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background:var(--cloud-surface)!important;color:#273047!important;border:1px solid rgba(255,255,255,.82)!important;
      box-shadow:var(--cloud-depth)!important;backdrop-filter:blur(16px) saturate(115%)!important;-webkit-backdrop-filter:blur(16px) saturate(115%)!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .dashboard-section-toggle {border-radius:18px!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .dashboard-section-heading {border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(button,.circle,.glass-btn,.header-btn,.add-btn,a.cep-media-link):not(:where(.dot,.pick,.xlyneve-theme-option,.highlight-color-choice,.font-color-choice,[data-color],.color-preset,.cep-search-image-viewer *,.cep-search-table-zoom *)) {
      background:linear-gradient(145deg,rgba(255,255,255,.86),rgba(237,242,254,.55))!important;color:#273047!important;-webkit-text-fill-color:currentColor!important;
      border:1px solid rgba(255,255,255,.91)!important;box-shadow:inset 0 1px 0 #fff,0 3px 10px rgba(100,113,160,.10)!important;text-shadow:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(button,.circle,a.cep-media-link):active:not(:where(.dot,.pick,[data-color],.cep-search-image-viewer *,.cep-search-table-zoom *)) {box-shadow:var(--cloud-well)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .dashboard-frequent-circles .circle {border-radius:50%!important;background:var(--cloud-surface)!important;animation:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .dashboard-frequent-circles .circle::after {content:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(#universalSearchButton,.home-search-icon) {background:var(--cloud-surface)!important;border:1px solid rgba(255,255,255,.92)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,[contenteditable="true"],#nurseNote,#noteInput,#noteText,#defBox,#whyBox,.editableNote,.cep-pn-editor) {
      background:rgba(255,255,255,.77)!important;color:#273047!important;-webkit-text-fill-color:currentColor!important;
      border:1px solid rgba(185,196,222,.58)!important;box-shadow:var(--cloud-well)!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(input,textarea)::placeholder {color:#6e7990!important;opacity:1!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body option {background:#f3f5fc;color:#273047;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.cep-note-popup,.pn-edit-popup,#inputGroup,#nurseFormWrapper,.input-panel,#formCard,#notePanel,.note-card.editing-note,.note-card.is-editing,#xlyneveThemePanel,#formEditDialog,#defPanel,#floatingEmojiPanel) {
      background:#f1f4fd!important;background-image:none!important;color:#273047!important;opacity:1!important;border:1px solid #d4dcee!important;
      box-shadow:0 12px 32px rgba(78,94,143,.17),inset 0 1px 0 #fff!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.cep-note-popup,.pn-edit-popup) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.universal-search-modes,.cep-global-search-modes) button.is-active {background:#d3c8ef!important;color:#343957!important;border-color:#b8acd8!important;box-shadow:var(--cloud-well)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) button:is(.active,[aria-selected="true"]) {background:#e0daf5!important;color:#343957!important;border-color:#c5bade!important;box-shadow:var(--cloud-well)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-head,.qi-head,.qt-head,.qs-head) {background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {background:var(--cloud-surface)!important;color:#273047!important;border:1px solid rgba(255,255,255,.9)!important;box-shadow:var(--cloud-depth)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle)::before {color:#273047!important;-webkit-text-fill-color:currentColor!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .day:not(.empty) {background:rgba(247,249,255,.55)!important;color:#273047!important;border:1px solid rgba(255,255,255,.85)!important;box-shadow:inset 0 1px 0 #fffc!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .day.today:not(.empty) {background:#ddd5f5!important;border-color:#ada4d6!important;box-shadow:0 2px 8px rgba(108,108,164,.12)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .todo-item :is(input[type="text"],textarea),html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(#calendar,.calendar-container) .day-note-editor {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body #notes .notepad {background:rgba(246,249,255,.66)!important;color:#273047!important;border:1px solid #fffd!important;box-shadow:var(--cloud-depth)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.pad-controls,.homepage-notepad-drag-bar,.universal-search-filter-row,.cep-global-search-filters,.cep-global-search-group-cards,.universal-search-result-group) {background:transparent!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.xgpt-media-tip,.cep-xgpt-media-tip,#defTip,#cep-shared-tip,#pn-definition-tip) {background:#f3f5fd!important;color:#273047!important;border:1px solid #cbd4e9!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.top-links a,.top-links a *,header a,.page-header a) {color:#273047!important;-webkit-text-fill-color:#273047!important;text-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .top-links a {background:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .top-links a::before,html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .top-links a::after {content:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .top-links {background:rgba(242,246,255,.42)!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body #xlyneveThemePanel :is(.xlyneve-theme-option,.xlyneve-theme-restore) {background:#f6f8ff!important;color:#273047!important;border-color:#cbd4e9!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body #xlyneveThemePanel .xlyneve-theme-option[aria-pressed="true"] {background:#ded5f5!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.note-card,.note-tile,.chatBubble,.notepad) :is([style*="color"],font[color]) {-webkit-text-fill-color:currentColor!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.todo-title,.date-number,.day-name,label) {color:#273047!important;-webkit-text-fill-color:currentColor!important;text-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(button,a,input,textarea,select):focus-visible {outline:2px solid #8f87bd;outline-offset:3px;}
    @media(max-width:760px),(prefers-reduced-motion:reduce) {
      html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body :is(.note-card,.note-tile,.card,.chatBubble,.file-item) {backdrop-filter:blur(5px)!important;-webkit-backdrop-filter:blur(5px)!important;}
    }
  `;

  // Home search floats directly over the page; use that same backdrop for
  // Cloud Glass lightbulb search so its translucent material is not darkened.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="cloud-glass"] body .cep-search-overlay {
      background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
  `;

  // Smoked glass with static cyan/violet rims. Editing surfaces remain opaque.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] {
      color-scheme:dark; --theme-ink:#e9edf5; --theme-muted-ink:#b2bdcd;
      --midnight-surface:linear-gradient(135deg,#2c3541,#20242d);
      --midnight-rim:linear-gradient(125deg,rgba(86,205,229,.9),rgba(104,143,209,.35) 48%,rgba(156,112,224,.85));
      --midnight-depth:inset 0 1px 0 rgba(224,245,255,.09),0 4px 14px rgba(0,0,0,.22),0 0 8px rgba(86,205,229,.06);
      --midnight-well:inset 0 2px 5px rgba(0,0,0,.32);
      --glass-light:#262d38; --glass-edge:#55768e; --glass-shadow:rgba(0,0,0,.3);
      --refresh-cocoa:#e9edf5; --refresh-rose:#8062af; --refresh-lime:#66c5d5; --refresh-stone:#20242c; --refresh-blue:#56cde5; --refresh-terracotta:#9c70e0;
      --quick-panel:#262d38; --quick-field:#202731; --quick-ink:#e9edf5; --quick-soft:#303c4d; --quick-accent:#56cde5; --quick-accent-ink:#16242b; --quick-edge:#567b95;
      --clinical-panel:#262d38; --clinical-field:#202731; --clinical-accent:#66bddc; --clinical-accent-ink:#15242d; --clinical-edge:#526a85;
      --homecal-header:#252c37; --homecal-header-ink:#e9edf5; --homecal-control:#2d3644; --homecal-control-ink:#e9edf5; --homecal-header-edge:#526a85;
      --homecal-today:#3a5070; --homecal-today-edge:#70d4e7; --homecal-today-shadow:rgba(86,205,229,.2);
      --note-editor-depth:var(--midnight-depth); --note-editor-inset:var(--midnight-well); --note-editor-radius:20px;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"],html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body {background:#1d2127!important;color:#e9edf5!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body {background-image:radial-gradient(ellipse at 10% 0%,rgba(63,123,147,.13),transparent 48%),radial-gradient(ellipse at 100% 80%,rgba(116,74,155,.09),transparent 48%)!important;background-attachment:fixed;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body::before {background:none!important;opacity:0!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(h1,h2,h3,.pageTitle,.title,.dashboard-frequent-title,.dashboard-section-chevron,.dashboard-section-toggle,.note-title,.note-text,.note-content,.note-display,.cep-source-title,.cep-source-text,.cep-source-content,.cep-source-note-title,.cep-source-note-text,.cep-xgpt-rich-content,.universal-search-native-title,.universal-search-native-snippet,.cep-structured-rich-content,.editableNote,.cep-pn-editor) {color:#e9edf5!important;-webkit-text-fill-color:currentColor!important;text-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.note-card,.note-tile,.card,.acc-item,.med-card,.med-section,.vaccine-card,.vaccine-section,.calculator,.result,.table-mini,.private-note-editor,.editable-checklist,.form-card,.library-card,.template-card,.pinned-note,.todo-item,.file-item),
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-clinical body #notesList > .note-card,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body:has(#chat) .chatBubble {
      background:linear-gradient(140deg,var(--card-solid,#262d38),#20242c) padding-box,var(--midnight-rim) border-box!important;
      color:#e9edf5!important;-webkit-text-fill-color:currentColor!important;border:1px solid transparent!important;border-radius:18px!important;
      box-shadow:var(--midnight-depth)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.note-card,.note-tile,.card,.chatBubble,.file-item)::before,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.note-card,.note-tile,.card,.chatBubble,.file-item)::after {content:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(header,.header,.header-bg,.topbar,.top-bar,.app-header,.page-header,.dashboard-section-toggle,.universal-search,.cep-global-search-panel,.calendar-container,.todo-container,.homepage-notepad,.homepage-calendar,#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) {
      background:var(--midnight-surface) padding-box,var(--midnight-rim) border-box!important;color:#e9edf5!important;
      border:1px solid transparent!important;box-shadow:var(--midnight-depth)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .dashboard-section-toggle {border-radius:16px!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .dashboard-section-heading {border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(button,.circle,.glass-btn,.header-btn,.add-btn,a.cep-media-link):not(:where(.dot,.pick,.xlyneve-theme-option,.highlight-color-choice,.font-color-choice,[data-color],.color-preset,.cep-search-image-viewer *,.cep-search-table-zoom *)) {
      background:var(--midnight-surface) padding-box,var(--midnight-rim) border-box!important;color:#e9edf5!important;-webkit-text-fill-color:currentColor!important;
      border:1px solid transparent!important;box-shadow:var(--midnight-depth)!important;text-shadow:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(button,.circle,a.cep-media-link):active:not(:where(.dot,.pick,[data-color],.cep-search-image-viewer *,.cep-search-table-zoom *)) {box-shadow:var(--midnight-well)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .dashboard-frequent-circles .circle {border-radius:50%!important;animation:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .dashboard-frequent-circles .circle::after {content:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#universalSearchButton,.home-search-icon) {background:var(--midnight-surface) padding-box,var(--midnight-rim) border-box!important;border:1px solid transparent!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .home-search-icon :is(.home-search-lens,.home-search-handle) {stroke:#d7f5ff!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea,[contenteditable="true"],#nurseNote,#noteInput,#noteText,#defBox,#whyBox,.editableNote,.cep-pn-editor) {
      background:#202731!important;color:#e9edf5!important;-webkit-text-fill-color:currentColor!important;
      border:1px solid #58718c!important;box-shadow:var(--midnight-well)!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body input::placeholder,html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body textarea::placeholder {color:#aebbd0!important;opacity:1!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body option {background:#252c37;color:#e9edf5;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.cep-note-popup,.pn-edit-popup,#inputGroup,#nurseFormWrapper,.input-panel,#formCard,#notePanel,.note-card.editing-note,.note-card.is-editing,#xlyneveThemePanel,#formEditDialog,#defPanel,#floatingEmojiPanel) {
      background:#262d38!important;background-image:none!important;color:#e9edf5!important;opacity:1!important;
      border:1px solid #6375a6!important;box-shadow:var(--midnight-depth)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.cep-note-popup,.pn-edit-popup) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.universal-search-modes,.cep-global-search-modes) button.is-active,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) button:is(.active,[aria-selected="true"]) {
      background:linear-gradient(115deg,#226778,#61408e)!important;color:#f3f8ff!important;-webkit-text-fill-color:#f3f8ff!important;border-color:#83c4e5!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-head,.qi-head,.qt-head,.qs-head) {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {
      background:var(--midnight-surface) padding-box,var(--midnight-rim) border-box!important;border:1px solid transparent!important;color:#e9edf5!important;box-shadow:var(--midnight-depth)!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body #timeCalculator .time-result-row {background:#d8e4ed!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .day:not(.empty) {background:#29313e!important;color:#e9edf5!important;border:1px solid #4c6077!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .day.today:not(.empty) {background:#3a5070!important;border-color:#70d4e7!important;box-shadow:0 0 8px rgba(86,205,229,.18)!important;}
    /* Keep task outlines, with a transparent inner text area. */
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-homecal body #todoPanel #todoList,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-homecal body #todoPanel #todoList .todo-item,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-homecal body #todoPanel #todoList .todo-item :is(textarea,input[type="text"]) {
      background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-homecal body #todoPanel #todoList .todo-item {border:1px solid #6375a6!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-homecal body #todoPanel #todoList .todo-item.priority {border-color:#83d9eb!important;}
    /* Retain the outer separator without a filled panel. */
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-homecal body #todoPanel.todo-container {
      background:transparent!important;border:1px solid #6375a6!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-homecal body #todoPanel.todo-container::before,
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-homecal body #todoPanel.todo-container::after {content:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .todo-item :is(input[type="text"],textarea) {background:transparent!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body #notes .notepad {background:#252c37!important;color:#e9edf5!important;border:1px solid #526a85!important;box-shadow:var(--midnight-depth)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.pad-controls,.homepage-notepad-drag-bar,.universal-search-filter-row,.cep-global-search-filters,.cep-global-search-group-cards,.universal-search-result-group) {background:transparent!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.xgpt-media-tip,.cep-xgpt-media-tip,#defTip,#cep-shared-tip,#pn-definition-tip) {background:#262d38!important;color:#e9edf5!important;border:1px solid #6375a6!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.top-links a,.top-links a *,header a,.page-header a) {color:#e9edf5!important;-webkit-text-fill-color:#e9edf5!important;text-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .top-links a {background:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .top-links a::before,html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .top-links a::after {content:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .top-links {background:#202630!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body #xlyneveThemePanel :is(.xlyneve-theme-option,.xlyneve-theme-restore) {background:#30394a!important;color:#e9edf5!important;border-color:#6375a6!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body #xlyneveThemePanel .xlyneve-theme-option[aria-pressed="true"] {background:linear-gradient(115deg,#226778,#61408e)!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.note-text,.note-content,#nurseNote,#noteInput,#noteText,#defBox,#whyBox,.editableNote,.cep-pn-editor,.chatBubble,.cep-source-text,.cep-source-content) :is(font[color="black"],font[color="#000000"],font[color="#000"],[style*="color: rgb(0, 0, 0)"],[style*="color: black"],[style*="color: #000000"],[style*="color:#000000"],[style*="color: #000;"],[style*="color:#000;"],[style*="color: #000!"],[style*="color:#000!"],[style="color: #000"],[style="color:#000"],[style*="color:black"],[style*="color:rgb(0,0,0)"],[style*="color:rgb(0, 0, 0)"]):not(table *) {color:#e9edf5!important;-webkit-text-fill-color:#e9edf5!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body table {background:#e1e6ed!important;color:#27313a!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body table :is(td,th) {color:#27313a;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .note-card :is([style*="color"],font[color]),html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .chatBubble :is([style*="color"],font[color]) {-webkit-text-fill-color:currentColor!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-vitals-table body table {background:#29313e!important;color:#e9edf5!important;border-color:#6375a6!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"].theme-vitals-table body table :is(th,td) {background:#29313e!important;color:#e9edf5!important;border-color:#526a85!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.qc-sub,.qt-sub,.qs-sub,.cep-global-search-status,.universal-search-status,.cep-global-search-source-title,.universal-search-source-title,footer) {color:#b2bdcd!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(button,a,input,textarea,select):focus-visible {outline:2px solid #83d9eb;outline-offset:3px;}
  `;

  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator) :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle)::before {color:#e9edf5!important;-webkit-text-fill-color:#e9edf5!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .dashboard-section-toggle > span:first-child::before {color:#83d9eb!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.note-card,.note-tile,.chatBubble,.file-item,.cep-search-source) a {color:#86daee!important;-webkit-text-fill-color:currentColor!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.todo-title,.date-number,.day-name) {color:#e9edf5!important;-webkit-text-fill-color:currentColor!important;text-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#calendar,.calendar-container) .day-note-editor {background:transparent!important;color:#e9edf5!important;-webkit-text-fill-color:currentColor!important;border:0!important;box-shadow:none!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .file-item :is(em,small),html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.preview-empty,.pdf-public-notice,.upload-status) {color:#b2bdcd!important;-webkit-text-fill-color:currentColor!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body .form-preview {background:#262d38!important;border-color:#6375a6!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#formEditDialog .form-dialog-body,#formEditDialog .form-dialog-footer) {background:transparent!important;color:#e9edf5!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body label {color:#e9edf5!important;}
    html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(.note-date,.note-time,.timestamp,.cep-source-date,.cep-source-card-date,.note-meta) {color:#b2bdcd!important;-webkit-text-fill-color:currentColor!important;}
  `;

  // Search matches must not inherit the old dark-on-transparent styling.
  themeStyle.textContent += `
    html:root:root:root:root:root:root:root:root:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#universalSearchPanel,.cep-global-search-panel,.cep-search-table-zoom) :is(.cep-search-match,.underlineMatch,.search-highlight,.search-hit,.cep-concept-search-result mark),
    html:root:root:root:root:root:root:root:root:root:root:root:root:root:root:root:root[data-xlyneve-color-theme="midnight-glass"] body :is(#universalSearchPanel,.cep-global-search-panel,.cep-search-table-zoom) :is(.cep-search-match,.underlineMatch,.search-highlight,.search-hit,.cep-concept-search-result mark) * {
      background:#f5e69a!important;color:#303030!important;-webkit-text-fill-color:#303030!important;
      text-shadow:none!important;box-shadow:none!important;
      border-radius:2px!important;border-bottom:1px solid #b4a465!important;
      padding:0 1px!important;box-decoration-break:clone;-webkit-box-decoration-break:clone;
    }
  `;


  // Editor chrome must not inherit saved-card ink or page-local white fills.
  // One scoped ID guard outranks legacy page rules without altering note HTML.
  const editorScopes = [
    '.cep-note-popup', '.pn-edit-popup', '#formEditDialog',
    '.note-card.editing-note', '.note-card.is-editing', '.note-tile.editing',
    '.note-card:has(>.edit-title:not([style*="display: none"]):not([style*="display:none"]))',
    '.file-item.is-editing', '.vaccine-card:has(.edit-notes-box)',
    '.med-card:has([contenteditable="true"])', '.acc-item:has([contenteditable="true"])',
    '.note-card:has(.note-content[contenteditable="true"],.note-text[contenteditable="true"],.editableNote[contenteditable="true"])',
    '#inputGroup', '#nurseFormWrapper', '.input-panel', '#formCard', '#notePanel',
  ];
  const editor = 'html:root body :is(' + editorScopes.join(',') + '):not(#cep-editor-style-exclusion)';
  themeStyle.textContent += `
    ${editor} {
      background:linear-gradient(var(--clinical-panel,#efede8),var(--clinical-panel,#efede8)),#efede8 !important;
      color:var(--theme-ink,#39353a) !important;
      -webkit-text-fill-color:currentColor !important;
      border-color:var(--clinical-edge,#b8b0ac) !important;
      opacity:1 !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
    }
    ${editor} :is([data-popup-content],.pn-edit-fields,.edit-mode,.form-dialog-body,.form-dialog-footer,.edit-main-actions,.edit-table-tools,.editor-buttons,.format-buttons,.formatting-buttons,.cep-pn-editor-toolbar) {
      background:transparent !important; color:var(--theme-ink,#39353a) !important;
      -webkit-text-fill-color:currentColor !important;
    }
    ${editor} :is(label,legend,h2,.table-tools-label,.cep-add-definition-label):not(:where([contenteditable="true"] *)) {
      color:var(--theme-ink,#39353a) !important; -webkit-text-fill-color:currentColor !important;
      text-shadow:none !important;
    }
    ${editor} :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]):not([type="file"]),select,textarea,[contenteditable="true"]) {
      background:linear-gradient(var(--clinical-field,#faf9f7),var(--clinical-field,#faf9f7)),#faf9f7 !important;
      color:var(--theme-ink,#39353a) !important; -webkit-text-fill-color:currentColor !important;
      caret-color:var(--theme-ink,#39353a) !important; border-color:var(--clinical-edge,#b8b0ac) !important;
    }
    ${editor} :is(input,textarea)::placeholder {
      color:var(--theme-ink,#39353a) !important; -webkit-text-fill-color:currentColor !important; opacity:.7 !important;
    }
    ${editor} :is(button,[role="button"]):not(.color-btn):not([data-color]):not(.color-swatch) {
      background:linear-gradient(var(--clinical-field,#faf9f7),var(--clinical-field,#faf9f7)),#faf9f7 !important;
      color:var(--theme-ink,#39353a) !important; -webkit-text-fill-color:currentColor !important;
      border-color:var(--clinical-edge,#b8b0ac) !important; text-shadow:none !important;
    }
    ${editor} :is(button,[role="button"]) :is(span,i,svg,path) {
      color:inherit !important; -webkit-text-fill-color:currentColor !important;
    }
    ${editor} button svg [stroke]:not([stroke="none"]) { stroke:currentColor !important; }
    ${editor} button svg [fill]:not([fill="none"]) { fill:currentColor !important; }
    ${editor} :is(button,[role="button"]):is([aria-pressed="true"],.active) {
      outline:2px solid var(--theme-ink,#39353a); outline-offset:1px;
    }
    ${editor} :is(button,input,select,textarea,[contenteditable="true"]):focus-visible {
      outline:2px solid var(--theme-ink,#39353a) !important; outline-offset:2px !important;
    }
    html:root body :is(.cep-note-popup,.pn-edit-popup):not(#cep-editor-style-exclusion) :is(#inputGroup,#nurseFormWrapper,[data-popup-content],.pn-edit-fields) {
      background:transparent !important; border:0 !important; box-shadow:none !important;
    }
  `;

  function start() {
    if (!themeStyle.isConnected) document.head.appendChild(themeStyle);
    document.querySelectorAll(headerSelector).forEach((header) => {
      if (pageName === "home.html" && header.matches("body > header")) return;
      if (selectedTheme === "moon-clay") {
        header.style.setProperty("background", "var(--moon-base)", "important");
      } else if (selectedTheme === "cloud-glass") {
        header.style.setProperty("background", "var(--cloud-surface)", "important");
      } else if (selectedTheme === "midnight-glass") {
        header.style.setProperty("background", "var(--midnight-surface)", "important");
      } else if (selectedTheme === "opal-pearl") {
        header.style.setProperty("background", "var(--opal-surface)", "important");
      } else if (selectedTheme === "pastel-rose-5d" || selectedTheme === "pastel-rose-recessed") {
        header.style.setProperty("background", "var(--rose-panel)", "important");
      } else if (selectedTheme === "lavender-glass" || selectedTheme === "grey-lavender") {
        header.style.setProperty("background", "var(--duo-material)", "important");
      } else if (selectedTheme === "pearl-silver") {
        header.style.setProperty("background", "var(--pearl-reflection)", "important");
      } else {
        header.style.setProperty("background", `rgba(${pageColor.rgb}, 0.78)`, "important");
        header.style.setProperty("background-image", "none", "important");
      }
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
    if (event.key === themeStorageKey || event.key === deletedThemeStorageKey) location.reload();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

// Decorate dedicated saved URL controls without changing inline links or navigation.
(() => {
  const selector = '.note-url a[href], a.note-link[href], a.cep-saved-url[href], a.vaccine-link[href]';
  function decorate(root) {
    const links = [...(root.matches?.(selector) ? [root] : []), ...root.querySelectorAll(selector)];
    for (const link of links) {
      if (link.classList.contains('cep-media-link') || link.closest('[contenteditable="true"]')) continue;
      const label = link.textContent.trim().replace(/^🔗\s*/, '');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      for (const [name,value] of Object.entries({viewBox:'0 0 24 24','aria-hidden':'true',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linejoin':'round'})) svg.setAttribute(name,value);
      for (const d of ['M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71','M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71']) {
        const path = document.createElementNS(svg.namespaceURI,'path'); path.setAttribute('d',d); svg.append(path);
      }
      link.replaceChildren(svg);
      link.classList.add('cep-media-link');
      link.title = /^(Open(?: URL| link)?|URL Link)$/i.test(label) ? 'Open link' : (label || 'Open link');
      link.setAttribute('aria-label',link.title);
    }
  }
  function start() {
    decorate(document);
    new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node.nodeType === 1 && node.isConnected) decorate(node);
      }
    }).observe(document.body,{childList:true,subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();


// Shared external-link panel is available even on pages with their own theme setup.
(() => {
  if (window.CEPNoteVideoLinks?.version === 3 || document.querySelector('script[data-cep-link-panel-loader]')) return;
  const script = document.createElement('script');
  script.dataset.cepLinkPanelLoader = 'true';
  script.src = new URL('note-video-links.js?v=20261026-safari-1', document.currentScript?.src || location.href).href;
  document.head.appendChild(script);
})();

// Fixed-size note pages use the same typography while adding, editing and viewing.
// These pages have no font-size controls. Keep table typography and headings intact;
// ChatGPTX and other editors with authored font sizes are deliberately outside this rule.
(() => {
  const page = decodeURIComponent(location.pathname.split('/').pop() || '').toLowerCase();
  const settings = {
    'abdo.html': [12, '#note[contenteditable],.note-text'],
    'ecg.html': [12, '#note[contenteditable],.note-text'],
    'hand.html': [12, '#note[contenteditable],.note-text'],
    'lf.html': [12, '#note[contenteditable],.note-text'],
    'sha.html': [12, '#note[contenteditable],.note-text'],
    'spine.html': [12, '#note[contenteditable],.note-text'],
    'urgent_care.html': [12, '#note[contenteditable],.note-text'],
    'face.html': [12, '#note[contenteditable],.note-text'],
    'pn.html': [12, '#nurseNote,.edit-note,.note-content'],
    'clinicalnotes.html': [12.5, '#noteText.editable,.note-content'],
    'info.html': [11, '#noteText.edit-note,.edit-note,.note-text'],
    'practicen.html': [12, '#noteText.edit-note,.edit-note,.note-text'],
    'recalls.html': [12, '#nurseNote,.edit-note,.note-content'],
    'complete-vaccine-info.html': [12, '#notes.vaccine-notes-input,#edit-notes.edit-notes-box']
  };
  // PN has no font-size controls: pasted table text must match its fixed note size.
  // Include PN search cards here so the displayed source size stays consistent.
  const pnTables = 'html:root:root body .cep-search-source[data-source-file="pn.html"] table';
  const tableScopes = page === 'pn.html'
    ? [pnTables, 'html:root:root body :is(#nurseNote,.edit-note,.note-content) table']
    : [pnTables];
  const tableStyle = document.createElement('style');
  tableStyle.id = 'cep-pn-table-typography';
  tableStyle.textContent = tableScopes.flatMap(scope => [scope,scope + ' *']).join(',') + '{font-size:12px !important;-webkit-text-size-adjust:100% !important;text-size-adjust:100% !important;}' +
    (page === 'pn.html' ? 'html:root:root,html:root:root body{-webkit-text-size-adjust:100% !important;text-size-adjust:100% !important;}' : '');
  document.head.append(tableStyle);
  const entry = settings[page];
  if (!entry) return;
  const [size, selectors] = entry;
  const scope = 'html:root:root body :is(' + selectors + ')';
  const style = document.createElement('style');
  style.id = 'cep-fixed-note-typography';
  style.textContent = scope + '{font-size:' + size + 'px !important;}' +
    scope + ' :not(h1,h2,h3,h4,h5,h6,table,table *){font-size:inherit !important;}';
  document.head.append(style);
})();

// Keep newly saved cards on their normal palette; save notices provide feedback.
(function () {
  const style = document.createElement('style');
  style.id = 'cep-saved-note-badge-layout';
  style.textContent = `
    html:root:root:root:root:root:root body .note-card.new-note-highlight::after {
      content:none !important; display:none !important; background:none !important;
      box-shadow:none !important; filter:none !important;
    }
  `;
  document.head.append(style);
})();

// Native inputs do not inherit the rich note editor's font automatically.
(() => {
  const page = decodeURIComponent(location.pathname.split('/').pop() || '').toLowerCase();
  const bodies = {
    'pn.html':'#nurseNote', 'recalls.html':'#nurseNote', 'inr calc.html':'#nurseNote',
    'clinicalnotes.html':'#noteText', 'info.html':'#noteText', 'practicen.html':'#noteText',
    'explain.html':'#noteText', 'forms.html':'#urlNote', 'recall-notes.html':'#noteInput',
    'complete-vaccine-info.html':'#notes.vaccine-notes-input'
  };
  const bodySelector = bodies[page];
  if (!bodySelector) return;
  const titles = 'input#nurseTitle,input#noteTitle,input#urlTitle,input#titleInput,input.edit-title,input[id^="editTitle-"],input[id^="edit-title-"]';
  const vaccineTitles = page === 'complete-vaccine-info.html' ? ',input#name,input#edit-name' : '';
  const style = document.createElement('style');
  style.id = 'cep-note-title-font';
  style.textContent = 'html:root:root:root:root body :is(' + titles + vaccineTitles + ',.note-title[contenteditable="true"]){font-family:var(--cep-note-editor-family,Tahoma,sans-serif) !important;}';
  document.head.append(style);
  const sync = () => {
    const editor = document.querySelector(bodySelector);
    if (editor) document.documentElement.style.setProperty('--cep-note-editor-family',getComputedStyle(editor).fontFamily);
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',sync,{once:true});
  else sync();
})();

// Rich text within a table follows its own authored foreground colour.
(() => {
  const style=document.createElement('style');style.id='cep-table-authored-colors';
  style.textContent='html:root:root:root:root:root:root:root body table *{-webkit-text-fill-color:currentColor !important;}';
  document.head.append(style);
})();

// Shared phrase-copy editing and viewing across card pages and search.
(() => {const script=document.createElement('script');script.src=new URL('note-copy-text.js?v=9',document.currentScript?.src || location.href).href;document.head.append(script);})();

// Theme cell fills independently of table layout and authored foregrounds.
(() => {
  const page = (location.pathname.split('/').pop() || '').toLowerCase();
  if (['rncnp.html','biosched1.html','recalltracker.html'].includes(page)) return;
  const link = document.createElement('link');
  link.id = 'cep-table-cell-theme'; link.rel = 'stylesheet';
  link.href = new URL('table-cell-theme.css?v=1',document.currentScript?.src || location.href).href;
  document.head.append(link);
  const script = document.createElement('script');
  script.src = new URL('table-cell-theme.js?v=1',document.currentScript?.src || location.href).href;
  document.head.append(script);
})();

// Compact raised Quickies controls in every Home palette; Moon Clay keeps its own palette rules.
(() => {
  if ((location.pathname.split('/').pop() || '').toLowerCase() !== 'home.html') return;
  const scope = 'html:not([data-xlyneve-color-theme="moon-clay"]):not(#quickies-surface):not(#quickies-edge):not(#quickies-size):not(#quickies-dot):not(#quickies-shell) body ';
  const panel = ':is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator)';
  const toggle = ':is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle)';
  const borderScope = 'html:not(#quickies-contrast):not(#quickies-palette):not(#quickies-outline):not(#quickies-frame):not(#quickies-visible):not(#quickies-neutral) body ';
  const style = document.createElement('style'); style.id = 'cep-compact-quickies';
  style.textContent = `
    ${scope}${panel}.collapsed {background:transparent !important;background-image:none !important;border:0 !important;box-shadow:none !important;backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}
    ${scope}${panel}.collapsed ${toggle} {
      background:var(--quick-panel,var(--glass-light,#efede8)) !important;background-image:none !important;
      border:2px solid var(--quickies-border,var(--cep-palette-color-1,#e5cbcc)) !important;
      box-shadow:3px 3px 6px #0003,-2px -2px 5px color-mix(in srgb,var(--quick-panel,#efede8) 75%,white) !important;
    }
    ${scope}#timeCalculator {--quickies-border:var(--cep-palette-color-1);}
    ${scope}#quickCalc {--quickies-border:var(--cep-palette-color-2);}
    ${scope}#quickInteleviewer {--quickies-border:var(--cep-palette-color-3);}
    ${scope}#tabletCalculator {--quickies-border:var(--cep-palette-color-1);}
    ${scope}#syrupCalculator {--quickies-border:var(--cep-palette-color-2);}
    ${scope}${panel} ${toggle}::before,${scope}${panel} ${toggle}::after {background:none !important;box-shadow:none !important;border:0 !important;}
    @media(min-width:769px) {
      ${scope}${panel}.collapsed ${toggle} {width:24px !important;height:24px !important;min-width:24px !important;padding:0 !important;border-radius:8px !important;color:transparent !important;-webkit-text-fill-color:transparent !important;text-indent:-9999px !important;}
      ${scope}${panel} ${toggle}::before,${scope}${panel} ${toggle}::after {content:none !important;}
    }
    @media(max-width:768px) {
      ${scope}.dashboard-frequent-section > ${panel}.collapsed ${toggle} {width:100% !important;height:46px !important;padding:5px !important;border-radius:14px !important;font-size:0 !important;}
      ${scope}.dashboard-frequent-section > ${panel}.collapsed ${toggle}::before {position:static !important;display:block !important;width:auto !important;height:auto !important;inset:auto !important;transform:none !important;animation:none !important;text-indent:0 !important;font-size:10px !important;line-height:1.1 !important;color:var(--quick-ink,#39190f) !important;-webkit-text-fill-color:currentColor !important;}
      ${scope}#timeCalculator.collapsed .qc-toggle::before {content:"Time" !important;}
      ${scope}#quickCalc.collapsed .qc-toggle::before {content:"Quick calc" !important;}
      ${scope}#quickInteleviewer.collapsed .qi-toggle::before {content:"Viewer" !important;}
      ${scope}#tabletCalculator.collapsed .qt-toggle::before {content:"Tablets" !important;}
      ${scope}#syrupCalculator.collapsed .qs-toggle::before {content:"Syrups" !important;}
      ${scope}${panel} ${toggle}::after {content:none !important;}
    }
    ${borderScope}${panel}.collapsed ${toggle} {
      border-width:3px !important;
      border-color:color-mix(in srgb,var(--moon-frequent-edge,var(--quickies-border,var(--quick-accent,#a793a3))) 80%,var(--quick-ink,var(--theme-ink,#39190f)) 20%) !important;
    }
    @media(min-width:769px) {
      ${borderScope}${panel}.collapsed ${toggle} {width:22px !important;height:22px !important;min-width:22px !important;box-sizing:border-box !important;}
    }
  `;
  document.head.append(style);
})();

// Home's embedded calendar has no extra surface behind the day and to-do cards.
(() => {
  const page = (location.pathname.split('/').pop() || '').toLowerCase();
  const embedded = page === 'homecal.html' && new URLSearchParams(location.search).get('homeEmbed') === 'today';
  if (page !== 'home.html' && !embedded) return;
  const root = 'html:not(#calendar-shell):not(#calendar-surface):not(#calendar-edge):not(#calendar-depth):not(#calendar-theme)';
  const targets = embedded
    ? [root, root + ' body', root + ' body :is(.calendar-container,.calendar-scroll-glass,.calendar,.todo-container,.todo-list)']
    : [root + ' body #homepage-calendar', root + ' body #homepage-calendar iframe'];
  const style = document.createElement('style'); style.id = 'cep-home-calendar-no-shell';
  style.textContent = targets.join(',') + '{background:transparent !important;background-image:none !important;border:0 !important;box-shadow:none !important;backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}' +
    (embedded ? root + ' body :is(.calendar-container,.todo-container)::before,' + root + ' body :is(.calendar-container,.todo-container)::after{content:none !important;}' : root + ' body #homepage-calendar-resize{opacity:0 !important;background:transparent !important;border:0 !important;box-shadow:none !important;}');
  document.head.append(style);
})();

// Theme and sign-out controls use distinct pairs from the selected palette.
(() => {
  const scope = 'html:not([data-xlyneve-color-theme="moon-clay"]):not(#palette-controls):not(#palette-fill):not(#palette-edge):not(#palette-ink) body ';
  const style = document.createElement('style'); style.id = 'cep-palette-account-controls';
  style.textContent = ['theme','signout'].map(name => scope + (name === 'theme' ? '.xlyneve-theme-button' : '.cep-sign-out-light') + '{background:linear-gradient(135deg,var(--cep-' + name + '-start),var(--cep-' + name + '-end)) !important;border-color:var(--cep-' + name + '-start) !important;color:var(--cep-' + name + '-ink) !important;-webkit-text-fill-color:currentColor !important;}').join('');
  document.head.append(style);
})();

// Home account controls share Moon Clay's compact rounded shape in every palette.
(() => {
  if ((location.pathname.split("/").pop() || "").toLowerCase() !== "home.html") return;
  const style = document.createElement("style"); style.id = "cep-home-account-shape";
  style.textContent = 'html:not(#account-shape):not(#account-radius):not(#account-size):not(#account-edge):not(#account-padding) body :is(.xlyneve-theme-button,.cep-sign-out-light){display:inline-flex !important;align-items:center !important;justify-content:center !important;box-sizing:border-box !important;width:auto !important;height:auto !important;min-width:0 !important;min-height:0 !important;padding:5px 7px !important;border-width:1px !important;border-style:solid !important;border-radius:16px !important;}';
  document.head.append(style);
})();

// Mobile Quickies keep their palette controls without visible text labels.
(() => {
  if ((location.pathname.split('/').pop() || '').toLowerCase() !== 'home.html') return;
  const scope = 'html' + ':not(#cep-mobile-quickies-labels)'.repeat(8) + ' body ';
  const buttons = ':is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle)';
  const style = document.createElement('style'); style.id = 'cep-mobile-quickies-no-labels';
  style.textContent = `@media(max-width:768px){
    ${scope}${buttons} {font-size:0!important;}
    ${scope}${buttons}::before {content:none!important;}
  }`;
  document.head.append(style);
})();

// Reserve five adjacent mobile grid cells for the compact Quickies controls.
(() => {
  if ((location.pathname.split('/').pop() || '').toLowerCase() !== 'home.html') return;
  const scope = 'html' + ':not(#cep-mobile-quickies-row)'.repeat(8) + ' body.dashboard-hierarchy-active ';
  const panels = ':is(#quickCalc,#timeCalculator,#quickInteleviewer,#tabletCalculator,#syrupCalculator).collapsed';
  const style = document.createElement('style'); style.id = 'cep-mobile-quickies-row';
  style.textContent = `@media(max-width:768px){
    ${scope}.dashboard-frequent-section {grid-template-columns:minmax(0,1fr) repeat(5,36px) minmax(0,1fr)!important;column-gap:8px!important;}
    ${scope}.dashboard-frequent-section > #timeCalculator.collapsed {grid-column:2!important;}
    ${scope}.dashboard-frequent-section > #quickCalc.collapsed {grid-column:3!important;}
    ${scope}.dashboard-frequent-section > #quickInteleviewer.collapsed {grid-column:4!important;}
    ${scope}.dashboard-frequent-section > #tabletCalculator.collapsed {grid-column:5!important;}
    ${scope}.dashboard-frequent-section > #syrupCalculator.collapsed {grid-column:6!important;}
    ${scope}.dashboard-frequent-section > ${panels} {width:36px!important;min-width:36px!important;height:36px!important;margin:0!important;box-sizing:border-box!important;}
    ${scope}.dashboard-frequent-section > ${panels} :is(.qc-head,.qi-head,.qt-head,.qs-head) {width:36px!important;height:36px!important;padding:0!important;}
    ${scope}.dashboard-frequent-section > ${panels} :is(.qc-toggle,.qi-toggle,.qt-toggle,.qs-toggle) {width:36px!important;min-width:36px!important;height:36px!important;padding:0!important;box-sizing:border-box!important;}
  }`;
  document.head.append(style);
})();
