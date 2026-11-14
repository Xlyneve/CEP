(function () {
  "use strict";
  const themeAssetBase = new URL(".", document.currentScript?.src || location.href);

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
    { rgb: "207, 177, 196", solid: "#cfb1c4", ink: "#30272e" },
    { rgb: "235, 231, 229", solid: "#ebe7e5", ink: "#30272e" },
    { rgb: "168, 136, 153", solid: "#a88899", ink: "#30272e" },
    { rgb: "178, 148, 148", solid: "#b29494", ink: "#30272e" },
    { rgb: "189, 176, 199", solid: "#bdb0c7", ink: "#30272e" },
    { rgb: "208, 155, 112", solid: "#d09b70", ink: "#30272e" },
  ];

  const hoyaPalette = [
    {rgb:"223, 200, 205",solid:"#dfc8cd",ink:"#403b3e",outline:"#c9b4bb"},
    {rgb:"209, 229, 229",solid:"#d1e5e5",ink:"#403b3e",outline:"#b9cfcf"},
    {rgb:"241, 237, 231",solid:"#f1ede7",ink:"#403b3e",outline:"#d9d0c7"},
    {rgb:"237, 214, 200",solid:"#edd6c8",ink:"#403b3e",outline:"#d5beaf"},
    {rgb:"202, 214, 225",solid:"#cad6e1",ink:"#403b3e",outline:"#b1c1d0"},
    {rgb:"220, 227, 213",solid:"#dce3d5",ink:"#403b3e",outline:"#c3cebb"}
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
    { rgb: "225, 209, 166", solid: "#e1d1a6", ink: "#263333" },
    { rgb: "177, 191, 193", solid: "#b1bfc1", ink: "#263333" },
    { rgb: "229, 205, 200", solid: "#e5cdc8", ink: "#263333" },
    { rgb: "199, 213, 199", solid: "#c7d5c7", ink: "#263333" },
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
  // Matte clay relief: sampled lavender, apricot, ivory and warm stone.
  const clayReliefPalette = [
    {rgb:"183, 166, 189",solid:"#b7a6bd",ink:"#3e3536",outline:"#a493ab"},
    {rgb:"216, 191, 174",solid:"#d8bfae",ink:"#3e3536",outline:"#bfaa9b"},
    {rgb:"236, 232, 225",solid:"#ece8e1",ink:"#3e3536",outline:"#d1c8be"},
    {rgb:"179, 165, 155",solid:"#b3a59b",ink:"#3e3536",outline:"#9d9087"},
    {rgb:"203, 197, 192",solid:"#cbc5c0",ink:"#3e3536",outline:"#b4aaa3"}
  ];
  const blushMarblePalette = [
    {rgb:"227, 196, 200",solid:"#e3c4c8",ink:"#403b40",outline:"#bea1a8"},
    {rgb:"242, 239, 234",solid:"#f2efea",ink:"#403b40",outline:"#c4bbb0"},
    {rgb:"194, 197, 198",solid:"#c2c5c6",ink:"#403b40",outline:"#9fa7aa"},
    {rgb:"214, 204, 202",solid:"#d6ccca",ink:"#403b40",outline:"#b8a9a7"},
    {rgb:"232, 214, 211",solid:"#e8d6d3",ink:"#403b40",outline:"#c5aaa6"}
  ];
  const oysterMistPalette = [
    {rgb:"129, 130, 99",solid:"#818263",ink:"#15180f",outline:"#6d7053"},
    {rgb:"194, 195, 149",solid:"#c2c395",ink:"#15180f",outline:"#a3a67c"},
    {rgb:"221, 186, 174",solid:"#ddbaae",ink:"#15180f",outline:"#be9d90"},
    {rgb:"239, 215, 207",solid:"#efd7cf",ink:"#15180f",outline:"#d0b7ad"},
    {rgb:"220, 212, 193",solid:"#dcd4c1",ink:"#15180f",outline:"#beb59f"},
    {rgb:"246, 234, 212",solid:"#f6ead4",ink:"#15180f",outline:"#d6c7aa"},
    {rgb:"255, 251, 243",solid:"#fffbf3",ink:"#15180f",outline:"#dfd8c8"}
  ];
  const colourPopPalette = [
    {rgb:"217, 228, 238",solid:"#d9e4ee",ink:"#74b9af",outline:"#d9e4ee"},
    {rgb:"230, 195, 242",solid:"#e6c3f2",ink:"#3f518f",outline:"#e6c3f2"},
    {rgb:"116, 185, 175",solid:"#74b9af",ink:"#f8f2df",outline:"#74b9af"},
    {rgb:"248, 242, 223",solid:"#f8f2df",ink:"#74b9af",outline:"#f8f2df"},
    {rgb:"190, 223, 244",solid:"#bedff4",ink:"#3f518f",outline:"#bedff4"},
    {rgb:"63, 81, 143",solid:"#3f518f",ink:"#f8f2df",outline:"#3f518f"}
  ];
  const mistSculpturePalette = [
    {rgb:"211, 212, 215",solid:"#d3d4d7",ink:"#303d43",outline:"#9cabad"},
    {rgb:"196, 193, 211",solid:"#c4c1d3",ink:"#303d43",outline:"#aaa9bd"},
    {rgb:"173, 208, 207",solid:"#add0cf",ink:"#303d43",outline:"#9ab9bb"},
    {rgb:"211, 183, 193",solid:"#d3b7c1",ink:"#303d43",outline:"#bda2af"},
    {rgb:"210, 218, 224",solid:"#d2dae0",ink:"#303d43",outline:"#aebdc8"},
    {rgb:"241, 232, 194",solid:"#f1e8c2",ink:"#303d43",outline:"#c6bd96"},
  ];
  const vintagePastelPalette = [
    {rgb:"163, 196, 188",solid:"#a3c4bc",ink:"#303632",outline:"#a3c4bc"},
    {rgb:"245, 202, 195",solid:"#f5cac3",ink:"#303632",outline:"#f5cac3"},
    {rgb:"234, 215, 209",solid:"#ead7d1",ink:"#303632",outline:"#ead7d1"},
    {rgb:"255, 248, 225",solid:"#fff8e1",ink:"#303632",outline:"#fff8e1"},
    {rgb:"255, 227, 179",solid:"#ffe3b3",ink:"#303632",outline:"#ffe3b3"},
    {rgb:"217, 234, 211",solid:"#d9ead3",ink:"#303632",outline:"#d9ead3"}
  ];
  const themeStorageKey = "xlyneve-color-theme";
  const removedThemes = new Set(["berry", "anatomy", "warm-medley", "colour-pop", "oyster-mist", "blush-marble"]);
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
      if (storedTheme === "vintage-pastel" || storedTheme === "mist-sculpture" || storedTheme === "colour-pop" || storedTheme === "oyster-mist" || storedTheme === "blush-marble" || storedTheme === "clay-relief" || storedTheme === "moon-clay" || storedTheme === "cloud-glass" || storedTheme === "midnight-glass" || storedTheme === "warm-ivory" || storedTheme === "opal-pearl" || storedTheme === "pastel-rose-5d" || storedTheme === "pastel-rose-recessed" || storedTheme === "lavender-glass" || storedTheme === "grey-lavender" || storedTheme === "pearl-silver" || storedTheme === "frost-outline" || storedTheme === "porcelain" || storedTheme === "aurora" || storedTheme === "soft-stone" || storedTheme === "mint-ceramic" || storedTheme === "berry" || storedTheme === "autumn" || storedTheme === "hoya" || storedTheme === "lake-mist" || storedTheme === "palm-springs" || storedTheme === "quiet-stone" || storedTheme === "anatomy" || storedTheme === "sculpted" || storedTheme === "pastel-jumper") selectedTheme = storedTheme;
    } catch {}
  }
  if (deletedThemes.has(selectedTheme) || removedThemes.has(selectedTheme)) {
    selectedTheme = "original";
    try { localStorage.removeItem(themeStorageKey); } catch {}
  }
  if(selectedTheme === "midnight-glass") {
    const contrastScript=document.createElement('script');
    contrastScript.id="cep-night-note-contrast-script";
    contrastScript.src=new URL('./night-note-contrast.js?v=1',document.currentScript?.src || location.href).href;
    contrastScript.defer=true;document.head.append(contrastScript);
  }
  function paletteForTheme(name) {
    return name === "vintage-pastel" ? vintagePastelPalette : name === "mist-sculpture" ? mistSculpturePalette : name === "colour-pop" ? colourPopPalette : name === "oyster-mist" ? oysterMistPalette : name === "blush-marble" ? blushMarblePalette : name === "clay-relief" ? clayReliefPalette : name === "moon-clay" ? moonClayPalette : name === "cloud-glass" ? cloudGlassPalette : name === "midnight-glass" ? midnightGlassPalette : name === "warm-ivory" ? warmIvoryPalette : name === "opal-pearl" ? opalPearlPalette : (name === "pastel-rose-5d" || name === "pastel-rose-recessed") ? pastelRosePalette : name === "lavender-glass" ? lavenderGlassPalette : name === "grey-lavender" ? greyLavenderPalette : name === "pearl-silver" ? pearlSilverPalette : name === "frost-outline" ? frostOutlinePalette : name === "porcelain" ? porcelainPalette : name === "aurora" ? auroraPalette : name === "soft-stone" ? softStonePalette : name === "mint-ceramic" ? (pageName === "home.html" ? mintCeramicPalette.map(color => color.solid === "#dde8f1" ? { rgb:"230, 224, 239", solid:"#e6e0ef", ink:color.ink } : color) : mintCeramicPalette) : name === "pastel-jumper" ? pastelJumperPalette : name === "berry"
    ? berryPalette
    : name === "autumn"
      ? autumnPalette
      : name === "hoya"
        ? hoyaPalette
        : name === "lake-mist"
          ? lakeMistPalette
          : name === "palm-springs"
            ? palmSpringsPalette
            : name === "quiet-stone"
              ? quietStonePalette
              : name === "anatomy"
                ? anatomyPalette
                : name === "sculpted"
                  ? sculptedPalette
      : originalPalette;
  }
  let palette = paletteForTheme(selectedTheme);

  function hash(text) {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  const root = document.documentElement;
  let pageColor;
  function applyThemeTokens() {
    pageColor = selectedTheme === "vintage-pastel" ? vintagePastelPalette[4] : selectedTheme === "mist-sculpture" ? mistSculpturePalette[0] : selectedTheme === "oyster-mist" ? {rgb:"194, 195, 149",solid:"#c2c395",ink:"#15180f"} : selectedTheme === "colour-pop" ? {rgb:"230, 195, 242",solid:"#e6c3f2",ink:"#3f518f"} : palette[hash(pageName) % palette.length];
    for (let i=1;i<=3;i++) root.style.removeProperty(`--cep-palette-color-${i}`);
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
    else delete root.dataset.xlyneveColorTheme;
    root.style.setProperty("--page-header-glass", `rgba(${pageColor.rgb}, 0.78)`);
    root.style.setProperty("--page-header-solid", pageColor.solid);
    root.style.setProperty("--page-header-ink", pageColor.ink);
    // Match the monogram to the contrast already chosen for the theme's header.
    const headerUsesLightInk = selectedTheme === "midnight-glass" || pageColor.ink.toLowerCase() === "#ffffff";
    root.style.setProperty("--page-logo-filter", headerUsesLightInk ? "brightness(0) invert(1)" : "contrast(1.08)");
    root.style.setProperty("--page-logo-opacity", headerUsesLightInk ? "0.96" : "0.85");
    const mastheadBarColors = {
      "mist-sculpture":"#dfc5ce",
      "vintage-pastel": "#ffe3b3",
      "colour-pop": "#e6c3f2",
      "oyster-mist": "#c2c395",
      "blush-marble": "#e3c4c8",
      "clay-relief": "#b7a6bd",
      "moon-clay": "#e8e8e8",
      original: "#596b57",
      "cloud-glass":"#d4dcef",
      "midnight-glass":"#252b35",
      "warm-ivory": "#ded5c8",
      berry: "#680044",
      autumn: "#bdb0c7",
      hoya: "#dfc8cd",
      "lake-mist": "#443d35",
      "palm-springs": "#b1bfc1",
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
    root.style.setProperty("--masthead-bar-ink", selectedTheme === "colour-pop" ? "#3f518f" : ["vintage-pastel","mist-sculpture","colour-pop","oyster-mist","palm-springs","autumn","hoya","blush-marble","clay-relief","moon-clay","lavender-glass","grey-lavender","pearl-silver","frost-outline","mint-ceramic","soft-stone","aurora","porcelain"].includes(selectedTheme) ? "#414342" : "#ffffff");
  }
  applyThemeTokens();

  if (selectedTheme === "moon-clay") {
    const link = document.createElement("link");
    link.id = "cep-moon-clay-theme"; link.rel = "stylesheet";
    link.setAttribute("blocking", "render");
    link.href = new URL("moon-clay-theme.css?v=8",document.currentScript?.src || location.href).href;
    document.head.append(link);
  }

  // BEGIN GENERATED THEME_BOOT
  const themeCssVersion = "364ba688397f";
  const themeBootCss = {"vintage-pastel":"html:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"vintage-pastel\"]{\n  color-scheme:light; --theme-ink:#303632; --theme-muted-ink:#626b65;\n  --vintage-paper:#ebebeb; --vintage-edge:#ccd1cc;\n  --vintage-grain:none;\n  --vintage-raised:0 2px 3px #30363212,2px 5px 10px #3036321a;\n  --vintage-panel:0 2px 6px #30363216;\n  --vintage-well:inset 1px 2px 4px #30363224;\n  --refresh-cocoa:#303632; --refresh-rose:#a3c4bc; --refresh-lime:#ebebeb;\n  --refresh-stone:#a3c4bc; --refresh-blue:#a3c4bc; --refresh-terracotta:#f5cac3;\n  --refresh-edge:#ccd1cc; --refresh-depth:var(--vintage-raised);\n  --quick-panel:#ebebeb; --quick-field:#fafaf8; --quick-ink:#303632;\n  --quick-accent:#a3c4bc; --quick-accent-ink:#303632; --quick-soft:#d9ead3; --quick-edge:#93b2a9;\n  --clinical-panel:#ebebeb; --clinical-field:#fafaf8; --clinical-accent:#a3c4bc;\n  --clinical-accent-ink:#303632; --clinical-edge:#bccbc3;\n  --homecal-header:#ffe3b3; --homecal-header-ink:#303632; --homecal-control:#ebebeb;\n  --homecal-control-ink:#303632; --homecal-header-edge:#93b2a9;\n  --homecal-today:#f5cac3; --homecal-today-edge:#d8b9af; --homecal-today-shadow:#30363226;\n  --cal-light:#ebebeb; --cal-ink:#303632; --cal-edge:#ccd1cc;\n  --note-editor-depth:var(--vintage-panel); --note-editor-inset:var(--vintage-well); --note-editor-radius:22px;\n  --vitals-panel:#ebebeb; --vitals-field:#fafaf8;\n  --copy-feedback-accent:#a3c4bc; --copy-feedback-soft:#ffe3b3;\n  --cep-highlight-paper:#ead7d1; --cep-highlight-shadow:inset 0 1px 0 #fff7;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"vintage-pastel\"],\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"vintage-pastel\"] body{\n  color:#303632!important; background-color:#ebebeb!important;\n  background-image:none!important;\n  background-attachment:fixed!important;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"vintage-pastel\"] body::before{content:none!important;}\n","mist-sculpture":"html:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"mist-sculpture\"]{\n  color-scheme:light; --theme-ink:#303d43; --theme-muted-ink:#606f76;\n  --mist-paper:#d3d4d7; --mist-edge:#9fadb0;\n  --mist-grain:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='144' height='144'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.035' filter='url(%23n)'/%3E%3C/svg%3E\");\n  --mist-raised:inset 2px 3px 5px #ffffffa6,inset -3px -4px 7px #66666626,7px 12px 22px #55555533,-4px -5px 12px #f5f5f55c;\n  --mist-panel:inset 1px 2px 4px #ffffff8c,5px 9px 20px #5555552b;\n  --mist-well:inset 3px 4px 7px #5555552e,inset -2px -2px 5px #f5f5f58c;\n  --refresh-cocoa:#303d43; --refresh-rose:#c4c1d3; --refresh-lime:#dedbe8;\n  --refresh-stone:#d3d4d7; --refresh-blue:#c4c1d3; --refresh-terracotta:#d3b7c1;\n  --refresh-edge:#9fadb0; --refresh-depth:var(--mist-raised);\n  --quick-panel:#dde8e3; --quick-field:#d8e0e2; --quick-ink:#303d43;\n  --quick-accent:#c4c1d3; --quick-accent-ink:#303d43; --quick-soft:#c4c1d3; --quick-edge:#aaa5bc;\n  --clinical-panel:#d3d4d7; --clinical-field:#d8e0e2; --clinical-accent:#c4c1d3;\n  --clinical-accent-ink:#303d43; --clinical-edge:#9fadb0;\n  --homecal-header:#dfc5ce; --homecal-header-ink:#303d43; --homecal-control:#dedbe8;\n  --homecal-control-ink:#303d43; --homecal-header-edge:#bda2af;\n  --homecal-today:#f1e8c2; --homecal-today-edge:#c6bd96; --homecal-today-shadow:#435c6933;\n  --cal-light:#d3d4d7; --cal-ink:#303d43; --cal-edge:#9fadb0;\n  --note-editor-depth:var(--mist-panel); --note-editor-inset:var(--mist-well); --note-editor-radius:22px;\n  --vitals-panel:#d3d4d7; --vitals-field:#d8e0e2;\n  --copy-feedback-accent:#c4c1d3; --copy-feedback-soft:#f1e8c2;\n  --cep-highlight-paper:#f1e8c2; --cep-highlight-shadow:inset 0 1px 0 #fff7;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"mist-sculpture\"],\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"mist-sculpture\"] body{\n  color:#303d43!important; background-color:#d3d4d7!important;\n  background-image:var(--mist-grain),linear-gradient(135deg,#dadbde,#ced0d3)!important;\n  background-attachment:fixed!important;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"mist-sculpture\"] body::before{content:none!important;}\n","colour-pop":"html:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"colour-pop\"]{\n  color-scheme:light; --theme-ink:#3f518f; --theme-muted-ink:#568b84;\n  --pop-paper:#ffffff; --pop-edge:#c6d8dc;\n  --pop-grain:none;\n  --pop-raised:0 2px 3px #3f518f12,2px 5px 10px #3f518f1a;\n  --pop-panel:0 2px 6px #3f518f16;\n  --pop-well:inset 1px 2px 4px #3f518f24;\n  --refresh-cocoa:#3f518f; --refresh-rose:#74b9af; --refresh-lime:#f5fafb;\n  --refresh-stone:#74b9af; --refresh-blue:#74b9af; --refresh-terracotta:#e6c3f2;\n  --refresh-edge:#c6d8dc; --refresh-depth:var(--pop-raised);\n  --quick-panel:#ffffff; --quick-field:#fffdf9; --quick-ink:#3f518f;\n  --quick-accent:#74b9af; --quick-accent-ink:#3f518f; --quick-soft:#bedff4; --quick-edge:#9ac5ce;\n  --clinical-panel:#ffffff; --clinical-field:#fffdf9; --clinical-accent:#74b9af;\n  --clinical-accent-ink:#3f518f; --clinical-edge:#b7cdd0;\n  --homecal-header:#e6c3f2; --homecal-header-ink:#3f518f; --homecal-control:#f5fafb;\n  --homecal-control-ink:#3f518f; --homecal-header-edge:#9ac5ce;\n  --homecal-today:#e6c3f2; --homecal-today-edge:#d5b3c0; --homecal-today-shadow:#3f518f26;\n  --cal-light:#f5fafb; --cal-ink:#3f518f; --cal-edge:#c6d8dc;\n  --note-editor-depth:var(--pop-panel); --note-editor-inset:var(--pop-well); --note-editor-radius:22px;\n  --vitals-panel:#ffffff; --vitals-field:#fffdf9;\n  --copy-feedback-accent:#74b9af; --copy-feedback-soft:#f8f2df;\n  --cep-highlight-paper:#d9e4ee; --cep-highlight-shadow:inset 0 1px 0 #fff7;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"colour-pop\"],\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"colour-pop\"] body{\n  color:#3f518f!important; background-color:#ffffff!important;\n  background-image:none!important;\n  background-attachment:fixed!important;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"colour-pop\"] body::before{content:none!important;}\n","oyster-mist":"html:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"oyster-mist\"]{\n  color-scheme:light; --theme-ink:#15180f; --theme-muted-ink:#626650;\n  --oyster-paper:#fffbf3; --oyster-edge:#c8c3af;\n  --oyster-grain:none;\n  --oyster-raised:0 2px 3px #42463112,2px 5px 10px #4246311a;\n  --oyster-panel:0 2px 6px #42463116;\n  --oyster-well:inset 1px 2px 4px #42463124;\n  --refresh-cocoa:#15180f; --refresh-rose:#818263; --refresh-lime:#fffbf3;\n  --refresh-stone:#818263; --refresh-blue:#818263; --refresh-terracotta:#ddbaae;\n  --refresh-edge:#c8c3af; --refresh-depth:var(--oyster-raised);\n  --quick-panel:#fffbf3; --quick-field:#fffdf8; --quick-ink:#15180f;\n  --quick-accent:#818263; --quick-accent-ink:#15180f; --quick-soft:#c2c395; --quick-edge:#a3a67c;\n  --clinical-panel:#fffbf3; --clinical-field:#fffdf8; --clinical-accent:#818263;\n  --clinical-accent-ink:#15180f; --clinical-edge:#b5b69a;\n  --homecal-header:#dcd4c1; --homecal-header-ink:#15180f; --homecal-control:#fffbf3;\n  --homecal-control-ink:#15180f; --homecal-header-edge:#a3a67c;\n  --homecal-today:#ddbaae; --homecal-today-edge:#c0a392; --homecal-today-shadow:#42463126;\n  --cal-light:#fffbf3; --cal-ink:#15180f; --cal-edge:#c8c3af;\n  --note-editor-depth:var(--oyster-panel); --note-editor-inset:var(--oyster-well); --note-editor-radius:22px;\n  --vitals-panel:#fffbf3; --vitals-field:#fffdf8;\n  --copy-feedback-accent:#818263; --copy-feedback-soft:#f6ead4;\n  --cep-highlight-paper:#efd7cf; --cep-highlight-shadow:inset 0 1px 0 #fff7;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"oyster-mist\"],\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"oyster-mist\"] body{\n  color:#15180f!important; background-color:#fffbf3!important;\n  background-image:none!important;\n  background-attachment:fixed!important;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"oyster-mist\"] body::before{content:none!important;}\n","blush-marble":"html:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"blush-marble\"]{\n  color-scheme:light; --theme-ink:#403b40; --theme-muted-ink:#787076;\n  --marble-paper:#ebe5e5; --marble-edge:#c7bfc1;\n  --marble-grain:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='540' height='460' viewBox='0 0 540 460'%3E%3Cpath d='M-30 380C90 320 118 260 180 220S325 170 370 80 490 40 580-20' fill='none' stroke='%23908a8d' stroke-opacity='.10' stroke-width='2'/%3E%3Cpath d='M-30 384C90 320 120 263 181 221S326 173 372 82 492 43 580-17M178 222C240 256 230 310 295 338' fill='none' stroke='%23b69a65' stroke-opacity='.17' stroke-width='.8'/%3E%3C/svg%3E\");\n  --marble-raised:inset 1px 2px 3px #fffb, inset -1px -2px 3px #51474d26, 0 2px 3px #51474d1c, 3px 6px 12px #51474d30;\n  --marble-panel:inset 0 1px 2px #fffc, 0 3px 10px #51474d26;\n  --marble-well:inset 2px 3px 5px #51474d26, inset -1px -2px 3px #fff9;\n  --refresh-cocoa:#403b40; --refresh-rose:#e3c4c8; --refresh-lime:#c2c5c6;\n  --refresh-stone:#e8d6d3; --refresh-blue:#e3c4c8; --refresh-terracotta:#f2efea;\n  --refresh-edge:#c7bfc1; --refresh-depth:var(--marble-raised);\n  --quick-panel:#ebe5e5; --quick-field:#f6f2f2; --quick-ink:#403b40;\n  --quick-accent:#b69a65; --quick-accent-ink:#30291f; --quick-soft:#eddbde; --quick-edge:#baa1a8;\n  --clinical-panel:#ebe5e5; --clinical-field:#f6f2f2; --clinical-accent:#b69a65;\n  --clinical-accent-ink:#30291f; --clinical-edge:#b9a8a4;\n  --homecal-header:#e3c4c8; --homecal-header-ink:#403b40; --homecal-control:#c2c5c6;\n  --homecal-control-ink:#403b40; --homecal-header-edge:#baa1a8;\n  --homecal-today:#f2efea; --homecal-today-edge:#b69a65; --homecal-today-shadow:#6c514033;\n  --cal-light:#ebe5e5; --cal-ink:#403b40; --cal-edge:#c7bfc1;\n  --note-editor-depth:var(--marble-panel); --note-editor-inset:var(--marble-well); --note-editor-radius:22px;\n  --vitals-panel:#ebe5e5; --vitals-field:#f6f2f2;\n  --copy-feedback-accent:#e3c4c8; --copy-feedback-soft:#ead6db;\n  --cep-highlight-paper:#e4d2c4; --cep-highlight-shadow:inset 0 1px 0 #fff7;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"blush-marble\"],\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"blush-marble\"] body{\n  color:#403b40!important; background-color:#ebe5e5!important;\n  background-image:radial-gradient(ellipse at 5% 20%,#e3c4c82b,transparent 46%),radial-gradient(ellipse at 95% 80%,#c2c5c633,transparent 48%),linear-gradient(135deg,#eeeaea,#dcd8d8)!important;\n  background-attachment:fixed!important;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"blush-marble\"] body::before{content:none!important;}\n","clay-relief":"html:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"clay-relief\"]{\n  color-scheme:light; --theme-ink:#3e3536; --theme-muted-ink:#746761;\n  --clay-paper:#e9e5df; --clay-edge:#c5b6aa;\n  --clay-grain:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='144' height='144'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.035' filter='url(%23n)'/%3E%3C/svg%3E\");\n  --clay-raised:inset 0 1px 1px #fffb, inset 0 -1px 1px #574a401c, 0 2px 3px #574a401a, 2px 4px 8px #574a4024;\n  --clay-panel:inset 0 1px 1px #fffb, 0 2px 6px #574a4024;\n  --clay-well:inset 1px 2px 4px #574a4026, inset -1px -1px 3px #fff8;\n  --refresh-cocoa:#3e3536; --refresh-rose:#b7a6bd; --refresh-lime:#ece8e1;\n  --refresh-stone:#cbc5c0; --refresh-blue:#b7a6bd; --refresh-terracotta:#d8bfae;\n  --refresh-edge:#c5b6aa; --refresh-depth:var(--clay-raised);\n  --quick-panel:#e9e5df; --quick-field:#f1eeea; --quick-ink:#3e3536;\n  --quick-accent:#b7a6bd; --quick-accent-ink:#3e3536; --quick-soft:#d8c9dd; --quick-edge:#aa94b3;\n  --clinical-panel:#e9e5df; --clinical-field:#f1eeea; --clinical-accent:#b7a6bd;\n  --clinical-accent-ink:#3e3536; --clinical-edge:#b6a392;\n  --homecal-header:#b7a6bd; --homecal-header-ink:#3e3536; --homecal-control:#ece8e1;\n  --homecal-control-ink:#3e3536; --homecal-header-edge:#aa94b3;\n  --homecal-today:#d8bfae; --homecal-today-edge:#bfaa9b; --homecal-today-shadow:#6c514033;\n  --cal-light:#e9e5df; --cal-ink:#3e3536; --cal-edge:#c5b6aa;\n  --note-editor-depth:var(--clay-panel); --note-editor-inset:var(--clay-well); --note-editor-radius:22px;\n  --vitals-panel:#e9e5df; --vitals-field:#f1eeea;\n  --copy-feedback-accent:#b7a6bd; --copy-feedback-soft:#e6d8ea;\n  --cep-highlight-paper:#e4d2c4; --cep-highlight-shadow:inset 0 1px 0 #fff7;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"clay-relief\"],\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"clay-relief\"] body{\n  color:#3e3536!important; background-color:#e9e5df!important;\n  background-image:var(--clay-grain),radial-gradient(ellipse at 0% 48%,#b3a59b33,transparent 48%),radial-gradient(ellipse at 94% 90%,#d8bfae20,transparent 46%),linear-gradient(135deg,#f0ede8,#e5e0da)!important;\n  background-attachment:fixed!important;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"clay-relief\"] body::before{content:none!important;}\n","original":"html:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"],[data-xlyneve-color-theme=\"warm-ivory\"],[data-xlyneve-color-theme=\"cloud-glass\"],[data-xlyneve-color-theme=\"midnight-glass\"]){\n  --subtle-edge-light:rgba(255,255,255,.56);\n  --subtle-edge-shade:rgba(35,38,44,.14);\n  --subtle-raised:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 2px var(--subtle-edge-shade),0 2px 3px rgba(35,38,44,.12),0 5px 12px rgba(35,38,44,.12);\n  --subtle-small:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 1px var(--subtle-edge-shade),0 2px 4px rgba(35,38,44,.18);\n  --subtle-inset:inset 2px 3px 5px rgba(35,38,44,.24),inset -1px -2px 3px var(--subtle-edge-light);\n  --note-editor-depth:var(--subtle-raised);\n  --note-editor-inset:var(--subtle-inset);\n}\nhtml:root:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n  --matte-raised:inset 0 1px 1px #fff8,inset 0 -1px 2px #51474d18,0 2px 3px #51474d16,2px 4px 8px #51474d20;\n  --matte-panel:inset 0 1px 1px #fff8,0 2px 6px #51474d20;\n  --matte-well:inset 2px 3px 5px #51474d26,inset -1px -2px 3px #fff9;\n  --note-editor-depth:var(--matte-panel);\n  --note-editor-inset:var(--matte-well);\n  --refresh-depth:var(--matte-raised);\n  --note-editor-radius:22px;\n}\n","moon-clay":"","cloud-glass":"html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"cloud-glass\"]{\n      color-scheme:light;--theme-ink:#273047;--theme-muted-ink:#65718a;\n      --cloud-surface:linear-gradient(145deg,rgba(255,255,255,.68),rgba(245,248,255,.30));\n      --cloud-depth:inset 0 1px 0 rgba(255,255,255,.92),0 7px 20px rgba(91,108,155,.10);\n      --cloud-well:inset 0 1px 4px rgba(105,116,153,.12),0 1px 0 rgba(255,255,255,.70);\n      --glass-light:rgba(248,250,255,.60);--glass-edge:rgba(255,255,255,.83);--glass-shadow:rgba(91,108,155,.12);\n      --refresh-cocoa:#273047;--refresh-rose:#d9c6e7;--refresh-lime:#c4ded9;--refresh-stone:#e9edf9;--refresh-blue:#c8daf1;--refresh-terracotta:#efcfb7;\n      --quick-panel:#eef1fc;--quick-field:rgba(255,255,255,.76);--quick-ink:#273047;--quick-soft:#e6e2f6;\n      --quick-accent:#c9bcec;--quick-accent-ink:#343957;--quick-edge:rgba(255,255,255,.85);\n      --clinical-panel:#eef1fc;--clinical-field:#f6f8ff;--clinical-accent:#c9bcec;--clinical-accent-ink:#343957;--clinical-edge:#c5cce1;\n      --homecal-header:#e5eafa;--homecal-header-ink:#273047;--homecal-control:#f2f5fe;--homecal-control-ink:#273047;--homecal-header-edge:rgba(255,255,255,.85);\n      --homecal-today:#ddd5f5;--homecal-today-edge:#ada4d6;--homecal-today-shadow:rgba(108,108,164,.14);\n      --note-editor-depth:var(--cloud-depth);--note-editor-inset:var(--cloud-well);--note-editor-radius:20px;\n      --vitals-panel:#eef1fc;--vitals-field:#f6f8ff;\n    }\nhtml:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"cloud-glass\"],html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"cloud-glass\"] body{background:#e5eafa!important;color:#273047!important;}\nhtml:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"cloud-glass\"] body{\n      background-image:radial-gradient(ellipse at 3% 4%,rgba(176,180,244,.48),transparent 47%),radial-gradient(ellipse at 95% 8%,rgba(249,220,215,.38),transparent 36%),radial-gradient(ellipse at 83% 75%,rgba(175,208,249,.52),transparent 54%),radial-gradient(ellipse at 6% 92%,rgba(221,202,242,.55),transparent 48%),linear-gradient(125deg,#edf2fd,#e4eafa 65%,#eeeafa)!important;\n      background-attachment:fixed;\n    }\nhtml:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"cloud-glass\"] body::before{background:none!important;opacity:0!important;}\nhtml:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"],[data-xlyneve-color-theme=\"warm-ivory\"],[data-xlyneve-color-theme=\"cloud-glass\"],[data-xlyneve-color-theme=\"midnight-glass\"]){\n  --subtle-edge-light:rgba(255,255,255,.56);\n  --subtle-edge-shade:rgba(35,38,44,.14);\n  --subtle-raised:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 2px var(--subtle-edge-shade),0 2px 3px rgba(35,38,44,.12),0 5px 12px rgba(35,38,44,.12);\n  --subtle-small:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 1px var(--subtle-edge-shade),0 2px 4px rgba(35,38,44,.18);\n  --subtle-inset:inset 2px 3px 5px rgba(35,38,44,.24),inset -1px -2px 3px var(--subtle-edge-light);\n  --note-editor-depth:var(--subtle-raised);\n  --note-editor-inset:var(--subtle-inset);\n}\n","midnight-glass":"html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"midnight-glass\"]{\n      color-scheme:dark; --theme-ink:#e9edf5; --theme-muted-ink:#b2bdcd;\n      --midnight-surface:linear-gradient(135deg,#2c3541,#20242d);\n      --midnight-rim:linear-gradient(125deg,rgba(86,205,229,.9),rgba(104,143,209,.35) 48%,rgba(156,112,224,.85));\n      --midnight-depth:inset 0 1px 0 rgba(224,245,255,.09),0 4px 14px rgba(0,0,0,.22),0 0 8px rgba(86,205,229,.06);\n      --midnight-well:inset 0 2px 5px rgba(0,0,0,.32);\n      --glass-light:#262d38; --glass-edge:#55768e; --glass-shadow:rgba(0,0,0,.3);\n      --refresh-cocoa:#e9edf5; --refresh-rose:#8062af; --refresh-lime:#66c5d5; --refresh-stone:#20242c; --refresh-blue:#56cde5; --refresh-terracotta:#9c70e0;\n      --quick-panel:#262d38; --quick-field:#202731; --quick-ink:#e9edf5; --quick-soft:#303c4d; --quick-accent:#56cde5; --quick-accent-ink:#16242b; --quick-edge:#567b95;\n      --clinical-panel:#262d38; --clinical-field:#202731; --clinical-accent:#66bddc; --clinical-accent-ink:#15242d; --clinical-edge:#526a85;\n      --homecal-header:#252c37; --homecal-header-ink:#e9edf5; --homecal-control:#2d3644; --homecal-control-ink:#e9edf5; --homecal-header-edge:#526a85;\n      --homecal-today:#3a5070; --homecal-today-edge:#70d4e7; --homecal-today-shadow:rgba(86,205,229,.2);\n      --note-editor-depth:var(--midnight-depth); --note-editor-inset:var(--midnight-well); --note-editor-radius:20px;\n    }\nhtml:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"midnight-glass\"],html:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"midnight-glass\"] body{background:#1d2127!important;color:#e9edf5!important;}\nhtml:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"midnight-glass\"] body{background-image:radial-gradient(ellipse at 10% 0%,rgba(63,123,147,.13),transparent 48%),radial-gradient(ellipse at 100% 80%,rgba(116,74,155,.09),transparent 48%)!important;background-attachment:fixed;}\nhtml:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"midnight-glass\"] body::before{background:none!important;opacity:0!important;}\nhtml:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"],[data-xlyneve-color-theme=\"warm-ivory\"],[data-xlyneve-color-theme=\"cloud-glass\"],[data-xlyneve-color-theme=\"midnight-glass\"]){\n  --subtle-edge-light:rgba(255,255,255,.56);\n  --subtle-edge-shade:rgba(35,38,44,.14);\n  --subtle-raised:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 2px var(--subtle-edge-shade),0 2px 3px rgba(35,38,44,.12),0 5px 12px rgba(35,38,44,.12);\n  --subtle-small:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 1px var(--subtle-edge-shade),0 2px 4px rgba(35,38,44,.18);\n  --subtle-inset:inset 2px 3px 5px rgba(35,38,44,.24),inset -1px -2px 3px var(--subtle-edge-light);\n  --note-editor-depth:var(--subtle-raised);\n  --note-editor-inset:var(--subtle-inset);\n}\nhtml:root:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"midnight-glass\"]{\n  --subtle-edge-light:rgba(224,245,255,.16);\n  --subtle-edge-shade:rgba(0,0,0,.3);\n  --subtle-inset:inset 2px 3px 5px rgba(0,0,0,.4),inset -1px -1px 2px rgba(224,245,255,.12);\n}\n","warm-ivory":"html:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"warm-ivory\"]{\n      --ivory-base:#e6dfd4; --ivory-paper:#eee7dd; --ivory-field:#f4eee5; --ivory-edge:#b9ad9e;\n      --ivory-depth:inset 0 1px 0 rgba(255,252,245,.72),0 2px 5px rgba(75,62,46,.10);\n      --ivory-well:inset 0 1px 3px rgba(75,62,46,.14),0 1px 0 rgba(255,252,245,.55);\n      --theme-ink:#37352f; --theme-muted-ink:#766d62;\n      --glass-light:#eee7dd; --glass-edge:#c7bcad; --glass-shadow:rgba(75,62,46,.12);\n      --refresh-cocoa:#37352f; --refresh-rose:#d8b9b3; --refresh-lime:#c9ceba; --refresh-stone:#e6dfd4; --refresh-blue:#b8c3b7; --refresh-terracotta:#c2aa73;\n      --quick-panel:#eee7dd; --quick-field:#f4eee5; --quick-ink:#37352f; --quick-soft:#e6d7cd;\n      --quick-accent:#c4a09b; --quick-accent-ink:#37352f; --quick-edge:#b9ad9e;\n      --clinical-panel:#eee7dd; --clinical-field:#f4eee5; --clinical-accent:#c4a09b; --clinical-accent-ink:#37352f; --clinical-edge:#b9ad9e;\n      --homecal-header:#e6dfd4; --homecal-header-ink:#37352f; --homecal-control:#eee7dd; --homecal-control-ink:#37352f; --homecal-header-edge:#b9ad9e;\n      --homecal-today:#e2cf9f; --homecal-today-edge:#b49c64; --homecal-today-shadow:rgba(75,62,46,.12);\n      --note-editor-depth:var(--ivory-depth); --note-editor-inset:var(--ivory-well); --note-editor-radius:20px;\n      --vitals-panel:#eee7dd; --vitals-field:#f4eee5; color-scheme:light;\n    }\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"warm-ivory\"], html:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"warm-ivory\"] body{background:#e6dfd4!important;color:#37352f!important;}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"warm-ivory\"] body{background-image:linear-gradient(140deg,#ece5db 0%,#e6dfd4 65%,#ded5c8 100%)!important;background-attachment:fixed;}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"warm-ivory\"] body::before{background:none!important;opacity:0!important;}\nhtml:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"],[data-xlyneve-color-theme=\"warm-ivory\"],[data-xlyneve-color-theme=\"cloud-glass\"],[data-xlyneve-color-theme=\"midnight-glass\"]){\n  --subtle-edge-light:rgba(255,255,255,.56);\n  --subtle-edge-shade:rgba(35,38,44,.14);\n  --subtle-raised:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 2px var(--subtle-edge-shade),0 2px 3px rgba(35,38,44,.12),0 5px 12px rgba(35,38,44,.12);\n  --subtle-small:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 1px var(--subtle-edge-shade),0 2px 4px rgba(35,38,44,.18);\n  --subtle-inset:inset 2px 3px 5px rgba(35,38,44,.24),inset -1px -2px 3px var(--subtle-edge-light);\n  --note-editor-depth:var(--subtle-raised);\n  --note-editor-inset:var(--subtle-inset);\n}\n","opal-pearl":"html[data-xlyneve-color-theme=\"opal-pearl\"]{\n      --opal-panel:#f5f7f6; --opal-field:#fbfcfa;\n      --opal-surface:radial-gradient(ellipse at 18% 0%,rgba(255,255,255,.96),transparent 58%),linear-gradient(135deg,rgba(246,249,248,.98),rgba(225,238,243,.96) 35%,rgba(239,228,238,.96) 63%,rgba(249,246,234,.98));\n      --opal-depth:inset 0 2px 3px rgba(255,255,255,.95),inset 0 -2px 4px rgba(124,143,152,.12),0 7px 16px rgba(75,99,112,.2),0 1px 2px rgba(75,99,112,.1);\n      --opal-well:inset 3px 4px 7px rgba(89,111,127,.2),inset -2px -2px 4px rgba(255,255,255,.85);\n      --theme-ink:#35424d; --theme-muted-ink:#74828b;\n      --glass-light:#f5f7f6; --glass-edge:rgba(255,255,255,.9); --glass-shadow:rgba(75,99,112,.18);\n      --refresh-cocoa:#35424d; --refresh-rose:#f4e8ec; --refresh-lime:#f7f3e5; --refresh-stone:#f5f7f6; --refresh-blue:#e8f1f4; --refresh-terracotta:#c9b67e;\n      --quick-panel:#f5f7f6; --quick-field:#fbfcfa; --quick-ink:#35424d; --quick-soft:#e8f1f4; --quick-accent:#b7ceda; --quick-accent-ink:#35424d; --quick-edge:rgba(255,255,255,.9);\n      --clinical-panel:#f5f7f6; --clinical-field:#fbfcfa; --clinical-accent:#b7ceda; --clinical-accent-ink:#35424d; --clinical-edge:rgba(255,255,255,.9);\n      --homecal-header:#f5f7f6; --homecal-header-ink:#35424d; --homecal-control:#fbfcfa; --homecal-control-ink:#35424d; --homecal-header-edge:rgba(255,255,255,.9);\n      --homecal-today:linear-gradient(145deg,#f1e9ed,#e6e8f2); --homecal-today-edge:rgba(201,182,126,.6); --homecal-today-shadow:rgba(75,99,112,.14);\n      --cal-light:#f5f7f6; --cal-ink:#35424d; --cal-edge:rgba(255,255,255,.9);\n      --note-editor-depth:var(--opal-depth); --note-editor-inset:var(--opal-well); --note-editor-radius:26px;\n      --cep-highlight-paper:#e9edf2; --cep-highlight-shadow:none;\n      --copy-feedback-accent:#b7ceda; --copy-feedback-soft:#f5f7f6;\n    }\nhtml:root:root:root:root:root[data-xlyneve-color-theme=\"opal-pearl\"],html:root:root:root:root:root[data-xlyneve-color-theme=\"opal-pearl\"] body{\n      background-color:#e8edf0 !important;\n      background-image:linear-gradient(145deg,#f0f3f4,#f6f3ef 48%,#edf2f5) !important;\n      background-size:cover !important; background-position:center !important; background-repeat:no-repeat !important;\n      background-attachment:fixed !important; color:#35424d;\n    }\nhtml:root:root:root:root:root[data-xlyneve-color-theme=\"opal-pearl\"] body::before{ background:none !important; opacity:0 !important; }\n","pastel-rose-5d":"html[data-xlyneve-color-theme=\"pastel-rose-5d\"]{\n      --rose-depth:inset 2px 2px 3px rgba(255,255,251,.95),inset -3px -4px 5px rgba(137,91,104,.18),0 3px 2px rgba(137,91,104,.2),7px 10px 18px rgba(137,91,104,.23),-5px -5px 12px rgba(255,255,251,.88);\n      --rose-edge:rgba(255,255,255,.85);\n    }\nhtml:root:root:root:root:root:is([data-xlyneve-color-theme=\"pastel-rose-5d\"],[data-xlyneve-color-theme=\"pastel-rose-recessed\"]){\n      --rose-base:#f6f5f3; --rose-panel:#f0efed; --rose-field:#faf9f7;\n      --rose-well:inset 2px 3px 5px rgba(111,79,88,.22),inset 0 -1px 0 rgba(255,255,255,.75);\n      --theme-ink:#3c3037; --theme-muted-ink:#7d6971;\n      --glass-light:#f0efed; --glass-edge:var(--rose-edge); --glass-shadow:rgba(137,91,104,.16);\n      --refresh-cocoa:#3c3037; --refresh-rose:#f3cdd4; --refresh-lime:#f8e1be; --refresh-stone:#fbf4f2; --refresh-blue:#dfeaf1; --refresh-terracotta:#f8aa80;\n      --quick-panel:#f0efed; --quick-field:#faf9f7; --quick-ink:#3c3037; --quick-soft:#f3cdd4; --quick-accent:#ce8a9f; --quick-accent-ink:#3c3037; --quick-edge:var(--rose-edge);\n      --clinical-panel:#f0efed; --clinical-field:#faf9f7; --clinical-accent:#ce8a9f; --clinical-accent-ink:#3c3037; --clinical-edge:var(--rose-edge);\n      --homecal-header:#f0efed; --homecal-header-ink:#3c3037; --homecal-control:#faf9f7; --homecal-control-ink:#3c3037; --homecal-header-edge:var(--rose-edge);\n      --homecal-today:#f8e1be; --homecal-today-edge:#dfc69f; --homecal-today-shadow:rgba(137,91,104,.12);\n      --cal-light:#fbf4f2; --cal-ink:#3c3037; --cal-edge:var(--rose-edge);\n      --note-editor-depth:var(--rose-depth); --note-editor-inset:var(--rose-well); --note-editor-radius:24px;\n      --cep-highlight-paper:#f3dfe6; --cep-highlight-shadow:none;\n      --copy-feedback-accent:#ce8a9f; --copy-feedback-soft:#f0efed;\n    }\nhtml:root:root:root:root:root:is([data-xlyneve-color-theme=\"pastel-rose-5d\"],[data-xlyneve-color-theme=\"pastel-rose-recessed\"]),html:root:root:root:root:root:is([data-xlyneve-color-theme=\"pastel-rose-5d\"],[data-xlyneve-color-theme=\"pastel-rose-recessed\"]) body{\n      background:var(--rose-base) !important; background-image:none !important; color:#3c3037;\n    }\nhtml:root:root:root:root:root:is([data-xlyneve-color-theme=\"pastel-rose-5d\"],[data-xlyneve-color-theme=\"pastel-rose-recessed\"]) body::before{ background:none !important; opacity:0 !important; }\n","pastel-rose-recessed":"html[data-xlyneve-color-theme=\"pastel-rose-recessed\"]{\n      --rose-depth:inset 5px 6px 9px rgba(120,117,110,.36),inset -4px -4px 7px rgba(255,255,255,.92);\n      --rose-edge:rgba(157,151,143,.28);\n    }\nhtml:root:root:root:root:root:is([data-xlyneve-color-theme=\"pastel-rose-5d\"],[data-xlyneve-color-theme=\"pastel-rose-recessed\"]){\n      --rose-base:#f6f5f3; --rose-panel:#f0efed; --rose-field:#faf9f7;\n      --rose-well:inset 2px 3px 5px rgba(111,79,88,.22),inset 0 -1px 0 rgba(255,255,255,.75);\n      --theme-ink:#3c3037; --theme-muted-ink:#7d6971;\n      --glass-light:#f0efed; --glass-edge:var(--rose-edge); --glass-shadow:rgba(137,91,104,.16);\n      --refresh-cocoa:#3c3037; --refresh-rose:#f3cdd4; --refresh-lime:#f8e1be; --refresh-stone:#fbf4f2; --refresh-blue:#dfeaf1; --refresh-terracotta:#f8aa80;\n      --quick-panel:#f0efed; --quick-field:#faf9f7; --quick-ink:#3c3037; --quick-soft:#f3cdd4; --quick-accent:#ce8a9f; --quick-accent-ink:#3c3037; --quick-edge:var(--rose-edge);\n      --clinical-panel:#f0efed; --clinical-field:#faf9f7; --clinical-accent:#ce8a9f; --clinical-accent-ink:#3c3037; --clinical-edge:var(--rose-edge);\n      --homecal-header:#f0efed; --homecal-header-ink:#3c3037; --homecal-control:#faf9f7; --homecal-control-ink:#3c3037; --homecal-header-edge:var(--rose-edge);\n      --homecal-today:#f8e1be; --homecal-today-edge:#dfc69f; --homecal-today-shadow:rgba(137,91,104,.12);\n      --cal-light:#fbf4f2; --cal-ink:#3c3037; --cal-edge:var(--rose-edge);\n      --note-editor-depth:var(--rose-depth); --note-editor-inset:var(--rose-well); --note-editor-radius:24px;\n      --cep-highlight-paper:#f3dfe6; --cep-highlight-shadow:none;\n      --copy-feedback-accent:#ce8a9f; --copy-feedback-soft:#f0efed;\n    }\nhtml:root:root:root:root:root:is([data-xlyneve-color-theme=\"pastel-rose-5d\"],[data-xlyneve-color-theme=\"pastel-rose-recessed\"]),html:root:root:root:root:root:is([data-xlyneve-color-theme=\"pastel-rose-5d\"],[data-xlyneve-color-theme=\"pastel-rose-recessed\"]) body{\n      background:var(--rose-base) !important; background-image:none !important; color:#3c3037;\n    }\nhtml:root:root:root:root:root:is([data-xlyneve-color-theme=\"pastel-rose-5d\"],[data-xlyneve-color-theme=\"pastel-rose-recessed\"]) body::before{ background:none !important; opacity:0 !important; }\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"pastel-rose-recessed\"]{\n      --rose-base:#e9e9e1; --rose-panel:#e9e9e1; --rose-field:#e9e9e1;\n      --rose-depth:inset 0 2px 2px rgba(86,88,78,.27),inset 2px 5px 7px rgba(111,114,102,.23),inset 0 -1px 0 rgba(255,255,255,.65);\n      --rose-well:inset 0 2px 2px rgba(86,88,78,.25),inset 1px 3px 5px rgba(111,114,102,.2),inset 0 -1px 0 rgba(255,255,255,.6);\n      --rose-edge:transparent;\n      --quick-panel:#e9e9e1; --quick-field:#e9e9e1;\n      --clinical-panel:#e9e9e1; --clinical-field:#e9e9e1;\n      --homecal-header:#e9e9e1; --homecal-control:#e9e9e1;\n      --note-editor-radius:30px;\n    }\n","lavender-glass":"html[data-xlyneve-color-theme=\"lavender-glass\"]{\n      --duo-base:#e1e3eb; --duo-panel:#eaecf3; --duo-field:#f3f5f9;\n      --duo-material:linear-gradient(125deg,rgba(255,255,255,.65) 0%,rgba(255,255,255,.08) 21%,rgba(255,255,255,.02) 46%,rgba(215,232,255,.18) 70%,rgba(255,255,255,.4) 100%),linear-gradient(155deg,rgba(240,242,249,.16),rgba(205,222,240,.13));\n      --duo-scene:radial-gradient(ellipse at 10% 8%,rgba(238,233,248,.65),transparent 48%),radial-gradient(ellipse at 90% 30%,rgba(202,225,245,.65),transparent 44%),radial-gradient(ellipse at 15% 90%,rgba(238,239,243,.75),transparent 44%),linear-gradient(125deg,#e3e3ec,#dce6f0 60%,#e6e2ed);\n    }\nhtml:root:root:root:is([data-xlyneve-color-theme=\"lavender-glass\"],[data-xlyneve-color-theme=\"grey-lavender\"]){\n      --theme-ink:#44335d; --theme-muted-ink:#716680;\n      --duo-depth:inset 0 2px 3px rgba(255,255,255,.96),inset 1px 0 2px rgba(255,255,255,.65),inset 0 -1px 2px rgba(110,96,153,.18),0 0 9px rgba(235,235,255,.42),0 9px 20px rgba(89,68,119,.16);\n      --duo-inset:inset 3px 3px 7px rgba(89,68,119,.15),inset -3px -3px 7px rgba(255,255,255,.8);\n      --glass-light:var(--duo-panel); --glass-edge:rgba(255,255,255,.85); --glass-shadow:rgba(89,68,119,.12);\n      --refresh-cocoa:#44335d; --refresh-rose:var(--duo-panel); --refresh-lime:var(--duo-panel); --refresh-stone:var(--duo-base); --refresh-blue:#dedcf2; --refresh-terracotta:#c5b5e3;\n      --quick-panel:var(--duo-panel); --quick-field:var(--duo-field); --quick-ink:#44335d; --quick-soft:#e4dcef; --quick-accent:#d3c6ea; --quick-accent-ink:#44335d; --quick-edge:rgba(255,255,255,.85);\n      --clinical-panel:var(--duo-panel); --clinical-field:var(--duo-field); --clinical-accent:#d3c6ea; --clinical-accent-ink:#44335d; --clinical-edge:rgba(255,255,255,.85);\n      --homecal-header:var(--duo-material); --homecal-header-ink:#44335d; --homecal-control:var(--duo-field); --homecal-control-ink:#44335d;\n      --homecal-header-edge:rgba(255,255,255,.85); --homecal-today:#e3d8f3; --homecal-today-edge:#baa4da; --homecal-today-shadow:rgba(89,68,119,.12);\n      --cal-light:var(--duo-base); --cal-ink:#44335d; --cal-edge:rgba(255,255,255,.85);\n      --note-editor-depth:var(--duo-depth); --note-editor-inset:var(--duo-inset); --note-editor-radius:24px;\n      --cep-highlight-paper:#e6def1; --cep-highlight-shadow:none; --copy-feedback-accent:#bba6d9; --copy-feedback-soft:var(--duo-field);\n    }\nhtml:root:root:root:is([data-xlyneve-color-theme=\"lavender-glass\"],[data-xlyneve-color-theme=\"grey-lavender\"]),\n    html:root:root:root:is([data-xlyneve-color-theme=\"lavender-glass\"],[data-xlyneve-color-theme=\"grey-lavender\"]) body{ background-color:var(--duo-base) !important; background-image:var(--duo-scene) !important; background-attachment:fixed !important; color:#44335d; }\nhtml:root:root:root:is([data-xlyneve-color-theme=\"lavender-glass\"],[data-xlyneve-color-theme=\"grey-lavender\"]) body::before{ background:none !important; opacity:0 !important; }\n","grey-lavender":"html[data-xlyneve-color-theme=\"grey-lavender\"]{\n      --duo-base:#ebebeb; --duo-panel:#f0eff5; --duo-field:#f7f6fa;\n      --duo-material:linear-gradient(125deg,rgba(255,255,255,.74) 0%,rgba(255,255,255,.1) 21%,rgba(255,255,255,.03) 46%,rgba(219,229,251,.18) 70%,rgba(255,255,255,.48) 100%),linear-gradient(155deg,rgba(245,244,252,.15),rgba(214,214,233,.13));\n      --duo-scene:radial-gradient(ellipse at 10% 8%,rgba(249,249,254,.9),transparent 48%),radial-gradient(ellipse at 90% 30%,rgba(218,213,237,.5),transparent 44%),radial-gradient(ellipse at 15% 90%,rgba(228,236,241,.65),transparent 44%),linear-gradient(125deg,#ebebeb,#e6e7ed 60%,#ece9ef);\n    }\nhtml:root:root:root:is([data-xlyneve-color-theme=\"lavender-glass\"],[data-xlyneve-color-theme=\"grey-lavender\"]){\n      --theme-ink:#44335d; --theme-muted-ink:#716680;\n      --duo-depth:inset 0 2px 3px rgba(255,255,255,.96),inset 1px 0 2px rgba(255,255,255,.65),inset 0 -1px 2px rgba(110,96,153,.18),0 0 9px rgba(235,235,255,.42),0 9px 20px rgba(89,68,119,.16);\n      --duo-inset:inset 3px 3px 7px rgba(89,68,119,.15),inset -3px -3px 7px rgba(255,255,255,.8);\n      --glass-light:var(--duo-panel); --glass-edge:rgba(255,255,255,.85); --glass-shadow:rgba(89,68,119,.12);\n      --refresh-cocoa:#44335d; --refresh-rose:var(--duo-panel); --refresh-lime:var(--duo-panel); --refresh-stone:var(--duo-base); --refresh-blue:#dedcf2; --refresh-terracotta:#c5b5e3;\n      --quick-panel:var(--duo-panel); --quick-field:var(--duo-field); --quick-ink:#44335d; --quick-soft:#e4dcef; --quick-accent:#d3c6ea; --quick-accent-ink:#44335d; --quick-edge:rgba(255,255,255,.85);\n      --clinical-panel:var(--duo-panel); --clinical-field:var(--duo-field); --clinical-accent:#d3c6ea; --clinical-accent-ink:#44335d; --clinical-edge:rgba(255,255,255,.85);\n      --homecal-header:var(--duo-material); --homecal-header-ink:#44335d; --homecal-control:var(--duo-field); --homecal-control-ink:#44335d;\n      --homecal-header-edge:rgba(255,255,255,.85); --homecal-today:#e3d8f3; --homecal-today-edge:#baa4da; --homecal-today-shadow:rgba(89,68,119,.12);\n      --cal-light:var(--duo-base); --cal-ink:#44335d; --cal-edge:rgba(255,255,255,.85);\n      --note-editor-depth:var(--duo-depth); --note-editor-inset:var(--duo-inset); --note-editor-radius:24px;\n      --cep-highlight-paper:#e6def1; --cep-highlight-shadow:none; --copy-feedback-accent:#bba6d9; --copy-feedback-soft:var(--duo-field);\n    }\nhtml:root:root:root:is([data-xlyneve-color-theme=\"lavender-glass\"],[data-xlyneve-color-theme=\"grey-lavender\"]),\n    html:root:root:root:is([data-xlyneve-color-theme=\"lavender-glass\"],[data-xlyneve-color-theme=\"grey-lavender\"]) body{ background-color:var(--duo-base) !important; background-image:var(--duo-scene) !important; background-attachment:fixed !important; color:#44335d; }\nhtml:root:root:root:is([data-xlyneve-color-theme=\"lavender-glass\"],[data-xlyneve-color-theme=\"grey-lavender\"]) body::before{ background:none !important; opacity:0 !important; }\n","pearl-silver":"html:root:root:root[data-xlyneve-color-theme=\"pearl-silver\"]{\n      --theme-ink:#373d44; --theme-muted-ink:#70757d;\n      --pearl-base:#ebebeb; --pearl-card:rgba(250,250,247,.92);\n      --pearl-reflection:linear-gradient(118deg,rgba(223,236,240,.7) 0%,rgba(249,234,227,.62) 24%,rgba(226,227,234,.75) 48%,rgba(247,247,245,.92) 68%,rgba(226,231,240,.6) 100%);\n      --pearl-card-depth:inset 4px 4px 8px rgba(85,90,103,.16),inset -4px -4px 8px rgba(255,255,255,.94),0 1px 2px rgba(85,90,103,.08);\n      --pearl-depth:0 7px 16px rgba(85,90,103,.14),inset 0 1px 1px rgba(255,255,255,.96),inset 0 -1px 1px rgba(132,139,149,.12);\n      --pearl-inset:inset 2px 3px 6px rgba(100,108,119,.15),inset -2px -2px 5px rgba(255,255,255,.9);\n      --glass-light:rgba(250,250,247,.92); --glass-edge:rgba(102,110,121,.25); --glass-shadow:rgba(85,90,103,.14);\n      --refresh-cocoa:#373d44; --refresh-rose:#eeeeed; --refresh-lime:#f6f6f1; --refresh-stone:#ebebeb; --refresh-blue:#e4eaf0; --refresh-terracotta:#d9dce6;\n      --quick-panel:#f2f2f0; --quick-field:#f6f6f3; --quick-ink:#373d44; --quick-soft:#e9edf0;\n      --quick-accent:#d8e2e9; --quick-accent-ink:#373d44; --quick-edge:rgba(102,110,121,.25);\n      --clinical-panel:#f6f6f3; --clinical-field:#fafaf7; --clinical-accent:#d8e2e9; --clinical-accent-ink:#373d44; --clinical-edge:rgba(102,110,121,.25);\n      --homecal-header:var(--pearl-reflection); --homecal-header-ink:#373d44; --homecal-control:#f3f4f3; --homecal-control-ink:#373d44;\n      --homecal-header-edge:rgba(102,110,121,.25); --homecal-today:#e5ecf0; --homecal-today-edge:#a4b9c7; --homecal-today-shadow:rgba(85,90,103,.14);\n      --cal-light:#ebebeb; --cal-ink:#373d44; --cal-edge:rgba(102,110,121,.25);\n      --note-editor-depth:var(--pearl-card-depth); --note-editor-inset:var(--pearl-inset); --note-editor-radius:22px;\n      --cep-highlight-paper:#e7e9ed; --cep-highlight-shadow:inset 0 1px 0 rgba(255,255,255,.5);\n      --copy-feedback-accent:#b9c9d4; --copy-feedback-soft:#f6f6f3;\n    }\nhtml:root:root:root[data-xlyneve-color-theme=\"pearl-silver\"],html:root:root:root[data-xlyneve-color-theme=\"pearl-silver\"] body{\n      background-color:#ebebeb !important;\n      background-image:radial-gradient(ellipse at 8% 12%,rgba(228,240,244,.7),transparent 42%),radial-gradient(ellipse at 92% 65%,rgba(230,229,241,.6),transparent 44%),radial-gradient(ellipse at 75% 8%,rgba(245,222,210,.25),transparent 38%),linear-gradient(125deg,transparent 25%,rgba(255,255,249,.5) 35%,transparent 44%,rgba(219,233,240,.25) 69%,transparent 76%) !important;\n      background-attachment:fixed !important; color:#373d44;\n    }\nhtml:root:root:root[data-xlyneve-color-theme=\"pearl-silver\"] body::before{ background:none !important; opacity:0 !important; }\n","frost-outline":"html:root:root:root[data-xlyneve-color-theme=\"frost-outline\"]{\n      --frost-surface:#d5e0e8; --frost-ink:#34434f;\n      --frost-raised:7px 7px 14px rgba(115,133,147,.38),-7px -7px 15px rgba(255,255,255,.82),inset 1px 1px 2px rgba(255,255,255,.48);\n      --frost-inset:inset 5px 5px 9px rgba(115,133,147,.36),inset -5px -5px 9px rgba(255,255,255,.75);\n      --theme-ink:#34434f; --theme-muted-ink:#627584;\n      --glass-light:#d5e0e8; --glass-edge:rgba(140,176,207,.45); --glass-shadow:rgba(115,133,147,.3);\n      --refresh-cocoa:#34434f; --refresh-rose:#d5e0e8; --refresh-lime:#d5e0e8;\n      --refresh-stone:#d5e0e8; --refresh-blue:#d5e0e8; --refresh-terracotta:#379ee9;\n      --quick-panel:#d5e0e8; --quick-ink:#34434f; --quick-field:#d5e0e8; --quick-soft:#d5e0e8;\n      --quick-accent:#75bde9; --quick-accent-ink:#17354a; --quick-edge:rgba(140,176,207,.45);\n      --clinical-panel:#d5e0e8; --clinical-field:#d5e0e8; --clinical-accent:#75bde9; --clinical-accent-ink:#17354a; --clinical-edge:rgba(140,176,207,.45);\n      --homecal-header:#d5e0e8; --homecal-header-ink:#34434f; --homecal-control:#d5e0e8; --homecal-control-ink:#34434f;\n      --homecal-header-edge:rgba(140,176,207,.45); --homecal-today:#d5e0e8; --homecal-today-edge:#bc86ce; --homecal-today-shadow:rgba(115,133,147,.3);\n      --cal-light:#d5e0e8; --cal-ink:#34434f; --cal-edge:rgba(140,176,207,.45);\n      --note-editor-depth:var(--frost-raised); --note-editor-inset:var(--frost-inset); --note-editor-radius:24px;\n      --cep-highlight-paper:#e1e9ee; --cep-highlight-shadow:none;\n      --copy-feedback-accent:#379ee9; --copy-feedback-soft:#e1e9ee;\n    }\nhtml:root:root:root[data-xlyneve-color-theme=\"frost-outline\"],html:root:root:root[data-xlyneve-color-theme=\"frost-outline\"] body{\n      background:#d5e0e8 !important; background-image:linear-gradient(125deg,rgba(249,218,229,.22),rgba(249,218,229,.05) 55%,rgba(249,218,229,.14)) !important; color:#34434f;\n    }\nhtml:root:root:root[data-xlyneve-color-theme=\"frost-outline\"] body::before{ background:none !important; opacity:0 !important; }\n","porcelain":"html:root[data-xlyneve-color-theme=\"porcelain\"]{\n      --cep-highlight-paper:#e5ddd7;\n      --cep-highlight-shadow:0 1px 2px rgba(80,84,96,.04),inset 0 1px 0 rgba(255,255,255,.4);\n      --cep-highlight-dark-paper:#4c5059;\n      --cep-highlight-dark-shadow:0 1px 2px rgba(32,36,45,.08),inset 0 1px 0 rgba(255,255,255,.08);\n      --theme-ink:#353833; --theme-muted-ink:#747870;\n      --refresh-cocoa:#353833; --refresh-rose:#e8c2c0; --refresh-lime:#e9e9e1;\n      --refresh-stone:#e9e9e1; --refresh-blue:#9fb5d1; --refresh-terracotta:#9fb5d1;\n      --refresh-edge:transparent; --refresh-depth:8px 10px 18px rgba(68,73,59,.24);\n      --porcelain-grain:none;\n      --porcelain-raised:inset 1px 1px 2px rgba(255,255,255,.25),8px 9px 14px rgba(153,157,146,.42),-8px -8px 14px rgba(255,255,255,.94);\n      --porcelain-pressed:inset 4px 4px 8px rgba(153,157,146,.4),inset -4px -4px 7px rgba(255,255,255,.8);\n      --porcelain-recessed:0 0 0 3px #e9e9e1,4px 5px 9px rgba(153,157,146,.25),inset 4px 4px 7px rgba(153,157,146,.44),inset -4px -4px 7px rgba(255,255,255,.9);\n      --quick-panel:linear-gradient(145deg,#e9e9e1,#e9e9e1); --quick-ink:#353833;\n      --quick-accent:#e9e9e1; --quick-accent-ink:#353833; --quick-soft:#e9e9e1; --quick-field:#e9e9e1; --quick-edge:transparent;\n      --clinical-panel:#e9e9e1; --clinical-field:#e9e9e1; --clinical-accent:#9fb5d1; --clinical-accent-ink:#353833; --clinical-edge:transparent;\n      --copy-feedback-accent:#9fb5d1; --copy-feedback-soft:#e9e9e1;\n      --homecal-header:linear-gradient(145deg,#e9e9e1,#e9e9e1); --homecal-header-ink:#353833;\n      --homecal-control:#e9e9e1; --homecal-control-ink:#353833; --homecal-header-edge:transparent;\n      --homecal-today:#eed5d2; --homecal-today-edge:transparent; --homecal-today-shadow:rgba(68,73,59,.24);\n    }\nhtml:root[data-xlyneve-color-theme=\"porcelain\"],html:root[data-xlyneve-color-theme=\"porcelain\"] body{\n      color:#353833; background-color:#e9e9e1 !important;\n      background-image:none !important;\n      background-attachment:fixed !important;\n    }\nhtml:root[data-xlyneve-color-theme=\"porcelain\"] body::before{ background:none !important;opacity:0 !important; }\nhtml[data-xlyneve-color-theme=\"porcelain\"]{ --note-editor-depth:var(--porcelain-recessed); --note-editor-inset:var(--porcelain-pressed); --note-editor-radius:30px; }\n","aurora":"html[data-xlyneve-color-theme=\"aurora\"]{\n      --cep-highlight-paper:#c5b0e3;\n      --cep-highlight-shadow:inset 0 0 0 1px rgba(129,84,196,.3),0 1px 3px rgba(73,61,103,.12),inset 0 1px 0 rgba(255,255,255,.5);\n      --cep-highlight-dark-paper:#514c60;\n      --cep-highlight-dark-shadow:0 1px 3px rgba(38,31,56,.1),inset 0 1px 0 rgba(255,255,255,.1);\n      --theme-ink:#28263c; --theme-muted-ink:#79778f;\n      --refresh-cocoa:#28263c; --refresh-rose:#e9ebf6; --refresh-lime:#e9ebf6;\n      --refresh-stone:#e9ebf6; --refresh-blue:#e9ebf6; --refresh-terracotta:#9d46c4;\n      --refresh-edge:transparent; --refresh-depth:8px 10px 18px rgba(68,73,59,.24);\n      --aurora-grain:none;\n      --aurora-raised:inset 1px 1px 2px rgba(255,255,255,.25),6px 6px 12px rgba(169,172,197,.32),-6px -6px 12px rgba(255,255,255,.82);\n      --aurora-pressed:inset 4px 4px 7px rgba(169,172,197,.32),inset -4px -4px 7px rgba(255,255,255,.8);\n      --quick-panel:linear-gradient(145deg,#e9ebf6,#e9ebf6); --quick-ink:#28263c;\n      --quick-accent:#e9ebf6; --quick-accent-ink:#28263c; --quick-soft:#e9ebf6; --quick-field:#e9ebf6; --quick-edge:transparent;\n      --clinical-panel:#e9ebf6; --clinical-field:#e9ebf6; --clinical-accent:#9d46c4; --clinical-accent-ink:#28263c; --clinical-edge:transparent;\n      --copy-feedback-accent:#9d46c4; --copy-feedback-soft:#e9ebf6;\n      --homecal-header:linear-gradient(145deg,#e9ebf6,#e9ebf6); --homecal-header-ink:#28263c;\n      --homecal-control:#e9ebf6; --homecal-control-ink:#28263c; --homecal-header-edge:transparent;\n      --homecal-today:linear-gradient(145deg,#e7e7f2,#d8d4e7); --homecal-today-edge:rgba(169,172,197,.35); --homecal-today-shadow:rgba(169,172,197,.24);\n    }\nhtml[data-xlyneve-color-theme=\"aurora\"],html[data-xlyneve-color-theme=\"aurora\"] body{\n      color:#28263c; background-color:#e9ebf6 !important;\n      background-image:none !important;\n      background-attachment:fixed !important;\n    }\nhtml[data-xlyneve-color-theme=\"aurora\"] body::before{ background:none !important;opacity:0 !important; }\nhtml[data-xlyneve-color-theme=\"aurora\"],html[data-xlyneve-color-theme=\"aurora\"] body{\n      background-color:#d9ddef !important;\n      background-image:none !important;\n      background-size:cover !important;\n      background-position:center !important;\n      background-repeat:no-repeat !important;\n      background-attachment:fixed !important;\n    }\nhtml[data-xlyneve-color-theme=\"aurora\"]{ --note-editor-depth:var(--aurora-raised); --note-editor-inset:var(--aurora-pressed); --note-editor-radius:26px; }\n","soft-stone":"html[data-xlyneve-color-theme=\"soft-stone\"]{\n      --cep-highlight-paper:#e3dfd5;\n      --cep-highlight-shadow:0 1px 2px rgba(80,84,96,.04),inset 0 1px 0 rgba(255,255,255,.4);\n      --cep-highlight-dark-paper:#4c5059;\n      --cep-highlight-dark-shadow:0 1px 2px rgba(32,36,45,.08),inset 0 1px 0 rgba(255,255,255,.08);\n      --theme-ink:#303238; --theme-muted-ink:#72757c;\n      --stone-lavender-mist:#c1a3e8; --stone-mist-gray:#d3b3d3; --stone-soft-mauve:#d8bfd8;\n      --stone-pale-lilac:#ead9f3; --stone-dusty-pink:#e4c1c1; --stone-soft-rose:#f4d7da;\n      --stone-surface:#e1e2e6; --stone-card-rim:var(--stone-dusty-pink);\n      --stone-control-rim:var(--stone-soft-mauve); --stone-todo-rim:#a9adb4;\n      --stone-rim-width:2px;\n      --refresh-cocoa:#303238; --refresh-rose:var(--stone-surface); --refresh-lime:var(--stone-surface);\n      --refresh-stone:var(--stone-surface); --refresh-blue:var(--stone-surface); --refresh-terracotta:#dfb53e;\n      --refresh-edge:var(--stone-card-rim); --refresh-depth:8px 10px 18px rgba(68,73,59,.24);\n      --stone-grain:none;\n      --stone-raised:inset 1px 1px 2px rgba(255,255,255,.25),6px 6px 12px rgba(166,169,179,.42),-6px -6px 12px rgba(255,255,255,.82);\n      --stone-pressed:inset 4px 4px 7px rgba(166,169,179,.42),inset -4px -4px 7px rgba(255,255,255,.8);\n      --quick-panel:linear-gradient(145deg,#e1e2e6,#e1e2e6); --quick-ink:#303238;\n      --quick-accent:#e1e2e6; --quick-accent-ink:#303238; --quick-soft:#e1e2e6; --quick-field:#e1e2e6; --quick-edge:transparent;\n      --clinical-panel:var(--stone-surface); --clinical-field:var(--stone-surface); --clinical-accent:#dfb53e; --clinical-accent-ink:#303238; --clinical-edge:var(--stone-card-rim);\n      --copy-feedback-accent:#dfb53e; --copy-feedback-soft:var(--stone-surface);\n      --homecal-header:linear-gradient(145deg,#e1e2e6,#e1e2e6); --homecal-header-ink:#303238;\n      --homecal-control:#e1e2e6; --homecal-control-ink:#303238; --homecal-header-edge:transparent;\n      --homecal-today:linear-gradient(145deg,#fff9e5,#f2e4ac); --homecal-today-edge:transparent; --homecal-today-shadow:rgba(68,73,59,.24);\n    }\nhtml[data-xlyneve-color-theme=\"soft-stone\"],html[data-xlyneve-color-theme=\"soft-stone\"] body{\n      color:#303238; background-color:#e1e2e6 !important;\n      background-image:none !important;\n      background-attachment:fixed !important;\n    }\nhtml[data-xlyneve-color-theme=\"soft-stone\"] body::before{ background:none !important;opacity:0 !important; }\nhtml[data-xlyneve-color-theme=\"soft-stone\"]{ --note-editor-depth:var(--stone-raised); --note-editor-inset:var(--stone-pressed); --note-editor-radius:26px; }\n","mint-ceramic":"html[data-xlyneve-color-theme=\"mint-ceramic\"]{\n      --theme-ink:#353c38; --theme-muted-ink:#626b65;\n      --refresh-cocoa:#353c38; --refresh-rose:#f0e1e5; --refresh-lime:#f2efd9;\n      --refresh-stone:#e6e0ef; --refresh-blue:#dde8f1; --refresh-terracotta:#b8c9ad;\n      --refresh-edge:#f8faf8; --refresh-depth:8px 10px 18px rgba(77,87,99,.24);\n      --mint-grain:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.055' filter='url(%23grain)'/%3E%3C/svg%3E\");\n      --mint-raised:inset 2px 2px 3px rgba(255,255,251,.95),inset -3px -4px 5px rgba(93,105,116,.18),0 3px 2px rgba(82,94,104,.2),7px 10px 18px rgba(77,87,99,.23),-5px -5px 12px rgba(255,255,251,.88);\n      --mint-pressed:inset 3px 4px 7px rgba(83,98,108,.3),inset -3px -3px 6px rgba(255,255,251,.95);\n      --quick-panel:linear-gradient(145deg,#dfe8e1,#fafaf7); --quick-ink:#353c38;\n      --quick-accent:#dde8f1; --quick-accent-ink:#353c38; --quick-soft:#dfe8e1; --quick-field:#f5f7f4; --quick-edge:#f8faf8;\n      --clinical-panel:#fafaf7; --clinical-field:#f5f7f4; --clinical-accent:#b8c9ad; --clinical-accent-ink:#353c38; --clinical-edge:#f8faf8;\n      --copy-feedback-accent:#b8c9ad; --copy-feedback-soft:#dfe8e1;\n      --homecal-header:linear-gradient(145deg,#dde8f1,#fafaf7); --homecal-header-ink:#353c38;\n      --homecal-control:#dfe8e1; --homecal-control-ink:#353c38; --homecal-header-edge:#f8faf8;\n      --homecal-today:linear-gradient(145deg,#f2efd9,#e7e0bc); --homecal-today-edge:#f8faf8; --homecal-today-shadow:rgba(77,87,99,.24);\n    }\nhtml[data-xlyneve-color-theme=\"mint-ceramic\"],html[data-xlyneve-color-theme=\"mint-ceramic\"] body{\n      color:#353c38; background-color:#fafaf7 !important;\n      background-image:var(--mint-grain),linear-gradient(145deg,#edf3f0 0%,#eef2f6 48%,#ede8f3 100%) !important;\n      background-attachment:fixed !important;\n    }\nhtml[data-xlyneve-color-theme=\"mint-ceramic\"] body::before{ background:none !important;opacity:0 !important; }\nhtml[data-xlyneve-color-theme=\"mint-ceramic\"].theme-home-glass{\n      --mint-control-surface:#e6e0ef; --quick-accent:#e6e0ef; --refresh-blue:#e6e0ef;\n    }\nhtml[data-xlyneve-color-theme=\"mint-ceramic\"].theme-home-glass,\n    html[data-xlyneve-color-theme=\"mint-ceramic\"].theme-home-glass body{\n      background-image:var(--mint-grain),linear-gradient(145deg,#f5f3f8 0%,#f5f5ef 55%,#f0edf4 100%) !important;\n    }\nhtml[data-xlyneve-color-theme=\"mint-ceramic\"]{ --note-editor-depth:var(--mint-raised); --note-editor-inset:var(--mint-pressed); --note-editor-radius:22px; }\n","autumn":"html[data-xlyneve-color-theme=\"autumn\"]{\n      --refresh-cocoa: #30272e;\n      --refresh-rose: #cfb1c4;\n      --refresh-lime: #b29494;\n      --refresh-stone: #ebe7e5;\n      --refresh-blue: #b29494;\n      --refresh-terracotta: #d09b70;\n      --refresh-edge: rgba(255, 255, 255, 0.82);\n      --refresh-depth: 0 12px 30px rgba(189, 176, 199, 0.12);\n      --theme-ink: #30272e;\n      --quick-panel: linear-gradient(145deg, rgba(248,246,246,.96), rgba(178, 148, 148,.58));\n      --quick-ink: #30272e;\n      --quick-accent: #bdb0c7;\n      --quick-accent-ink: #30272e;\n      --quick-soft: rgba(207, 177, 196,.42);\n      --quick-field: rgba(255,255,255,.76);\n      --quick-edge: rgba(178, 148, 148,.62);\n      --copy-feedback-accent: #bdb0c7;\n      --copy-feedback-soft: rgba(207, 177, 196,.56);\n      --clinical-panel: rgba(178, 148, 148,.78);\n      --clinical-field: rgba(248,246,246,.8);\n      --clinical-accent: #bdb0c7;\n      --clinical-accent-ink: #30272e;\n      --clinical-edge: rgba(189, 176, 199,.38);\n      --homecal-header: linear-gradient(135deg, rgba(207, 177, 196,.88), rgba(178, 148, 148,.82));\n      --homecal-header-ink: #30272e;\n      --homecal-control: rgba(248,246,246,.78);\n      --homecal-control-ink: #30272e;\n      --homecal-header-edge: rgba(189, 176, 199,.34);\n      --homecal-today: linear-gradient(145deg,rgba(235, 231, 229,.96),rgba(207, 177, 196,.88));\n      --homecal-today-edge: rgba(178, 148, 148,.6);\n      --homecal-today-shadow: rgba(189, 176, 199,.15);\n    }\nhtml[data-xlyneve-color-theme=\"autumn\"],\n    html[data-xlyneve-color-theme=\"autumn\"] body{\n      color: #30272e;\n      background-color: #f6f3f2 !important;\n      background-image:\n        radial-gradient(circle at 16% 10%, rgba(255, 255, 255, 0.98), transparent 34%),\n        radial-gradient(circle at 82% 18%, rgba(207, 177, 196, 0.2), transparent 38%),\n        radial-gradient(circle at 24% 84%, rgba(178, 148, 148, 0.22), transparent 38%),\n        linear-gradient(180deg, #fbfaf9 0%, #f3efef 56%, #e8e2e7 100%) !important;\n      background-attachment: fixed !important;\n    }\nhtml[data-xlyneve-color-theme=\"autumn\"] body::before{\n      opacity: 0.07 !important;\n      filter: grayscale(.18) sepia(.08) hue-rotate(135deg) saturate(.76);\n    }\nhtml[data-xlyneve-color-theme=\"autumn\"]{ --classic-recessed-shade:rgba(54,53,54,.28); }\nhtml:is([data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"hoya\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n      --classic-recessed:inset 5px 5px 8px var(--classic-recessed-shade),inset -1px -1px 2px rgba(255,255,255,.16);\n    }\nhtml:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"],[data-xlyneve-color-theme=\"warm-ivory\"],[data-xlyneve-color-theme=\"cloud-glass\"],[data-xlyneve-color-theme=\"midnight-glass\"]){\n  --subtle-edge-light:rgba(255,255,255,.56);\n  --subtle-edge-shade:rgba(35,38,44,.14);\n  --subtle-raised:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 2px var(--subtle-edge-shade),0 2px 3px rgba(35,38,44,.12),0 5px 12px rgba(35,38,44,.12);\n  --subtle-small:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 1px var(--subtle-edge-shade),0 2px 4px rgba(35,38,44,.18);\n  --subtle-inset:inset 2px 3px 5px rgba(35,38,44,.24),inset -1px -2px 3px var(--subtle-edge-light);\n  --note-editor-depth:var(--subtle-raised);\n  --note-editor-inset:var(--subtle-inset);\n}\nhtml:root:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n  --matte-raised:inset 0 1px 1px #fff8,inset 0 -1px 2px #51474d18,0 2px 3px #51474d16,2px 4px 8px #51474d20;\n  --matte-panel:inset 0 1px 1px #fff8,0 2px 6px #51474d20;\n  --matte-well:inset 2px 3px 5px #51474d26,inset -1px -2px 3px #fff9;\n  --note-editor-depth:var(--matte-panel);\n  --note-editor-inset:var(--matte-well);\n  --refresh-depth:var(--matte-raised);\n  --note-editor-radius:22px;\n}\n","hoya":"html[data-xlyneve-color-theme=\"hoya\"]{ --classic-recessed-shade:rgba(51,75,80,.28); }\nhtml:is([data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"hoya\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n      --classic-recessed:inset 5px 5px 8px var(--classic-recessed-shade),inset -1px -1px 2px rgba(255,255,255,.16);\n    }\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"hoya\"]{\n  color-scheme:light; --theme-ink:#403b3e; --theme-muted-ink:#786e70;\n  --hoya-paper:#f0ece8; --hoya-edge:#c8bfba;\n  --hoya-grain:linear-gradient(135deg,#ffffff12,transparent 65%);\n  --hoya-raised:inset 0 1px 1px #fff8, inset 0 -1px 2px #51474d18, 0 2px 3px #51474d16, 2px 4px 8px #51474d20;\n  --hoya-panel:inset 0 1px 1px #fff8, 0 2px 6px #51474d20;\n  --hoya-well:inset 2px 3px 5px #51474d26, inset -1px -2px 3px #fff9;\n  --refresh-cocoa:#403b3e; --refresh-rose:#dfc8cd; --refresh-lime:#f1ede7;\n  --refresh-stone:#cad6e1; --refresh-blue:#dfc8cd; --refresh-terracotta:#d1e5e5;\n  --refresh-edge:#c8bfba; --refresh-depth:var(--hoya-raised);\n  --quick-panel:#f0ece8; --quick-field:#f1eeea; --quick-ink:#403b3e;\n  --quick-accent:#dfc8cd; --quick-accent-ink:#403b3e; --quick-soft:#eddbde; --quick-edge:#bea1a4;\n  --clinical-panel:#f0ece8; --clinical-field:#f1eeea; --clinical-accent:#dfc8cd;\n  --clinical-accent-ink:#403b3e; --clinical-edge:#d0c3c0;\n  --homecal-header:#dfc8cd; --homecal-header-ink:#403b3e; --homecal-control:#f1ede7;\n  --homecal-control-ink:#403b3e; --homecal-header-edge:#bea1a4;\n  --homecal-today:#d1e5e5; --homecal-today-edge:#dfc8cd; --homecal-today-shadow:#6c514033;\n  --cal-light:#f0ece8; --cal-ink:#403b3e; --cal-edge:#c8bfba;\n  --note-editor-depth:var(--hoya-panel); --note-editor-inset:var(--hoya-well); --note-editor-radius:22px;\n  --vitals-panel:#f0ece8; --vitals-field:#f1eeea;\n  --copy-feedback-accent:#dfc8cd; --copy-feedback-soft:#ead6db;\n  --cep-highlight-paper:#e4d2c4; --cep-highlight-shadow:inset 0 1px 0 #fff7;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"hoya\"],\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"hoya\"] body{\n  color:#403b3e!important; background-color:#f0ece8!important;\n  background-image:radial-gradient(ellipse at 5% 20%,#dfc8cd2b,transparent 46%),radial-gradient(ellipse at 95% 80%,#f1ede733,transparent 48%),linear-gradient(135deg,#efedeb,#d9d6d3)!important;\n  background-attachment:fixed!important;\n}\nhtml:root:root:root:root:root:root:root[data-xlyneve-color-theme=\"hoya\"] body::before{content:none!important;}\n","lake-mist":"html[data-xlyneve-color-theme=\"lake-mist\"]{\n      --refresh-cocoa:#443d35;\n      --refresh-rose:#dbcad0;\n      --refresh-lime:#a2ac9e;\n      --refresh-stone:#f3f2ed;\n      --refresh-blue:#bfc6c6;\n      --refresh-terracotta:#d6cfca;\n      --refresh-edge:rgba(255,255,255,.82);\n      --refresh-depth:0 12px 30px rgba(68,61,53,.12);\n      --theme-ink:#443d35;\n      --quick-panel:linear-gradient(145deg,rgba(243,242,237,.97),rgba(191,198,198,.88));\n      --quick-ink:#443d35;\n      --quick-accent:#443d35;\n      --quick-accent-ink:#fff;\n      --quick-soft:rgba(219,202,208,.48);\n      --quick-field:rgba(243,242,237,.82);\n      --quick-edge:rgba(162,172,158,.62);\n      --copy-feedback-accent:#443d35;\n      --copy-feedback-soft:rgba(219,202,208,.58);\n      --clinical-panel:rgba(191,198,198,.86);\n      --clinical-field:rgba(243,242,237,.84);\n      --clinical-accent:#443d35;\n      --clinical-accent-ink:#fff;\n      --clinical-edge:rgba(162,172,158,.58);\n      --homecal-header:linear-gradient(135deg,rgba(191,198,198,.9),rgba(162,172,158,.84));\n      --homecal-header-ink:#443d35;\n      --homecal-control:rgba(243,242,237,.82);\n      --homecal-control-ink:#443d35;\n      --homecal-header-edge:rgba(68,61,53,.32);\n      --homecal-today:linear-gradient(145deg,rgba(243,242,237,.97),rgba(219,202,208,.82));\n      --homecal-today-edge:rgba(162,172,158,.62);\n      --homecal-today-shadow:rgba(68,61,53,.15);\n    }\nhtml[data-xlyneve-color-theme=\"lake-mist\"],\n    html[data-xlyneve-color-theme=\"lake-mist\"] body{\n      color:#443d35;\n      background-color:#f3f2ed !important;\n      background-image:radial-gradient(circle at 14% 12%,rgba(243,242,237,.98),transparent 34%),radial-gradient(circle at 84% 18%,rgba(219,202,208,.34),transparent 38%),radial-gradient(circle at 20% 86%,rgba(162,172,158,.25),transparent 38%),linear-gradient(180deg,#f7f6f2 0%,#eeece8 56%,#e3e6e2 100%) !important;\n      background-attachment:fixed !important;\n    }\nhtml[data-xlyneve-color-theme=\"lake-mist\"] body::before{ opacity:.07 !important;filter:sepia(.08) hue-rotate(338deg) saturate(.72); }\nhtml[data-xlyneve-color-theme=\"lake-mist\"]{ --classic-recessed-shade:rgba(68,61,53,.28); }\nhtml:is([data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"hoya\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n      --classic-recessed:inset 5px 5px 8px var(--classic-recessed-shade),inset -1px -1px 2px rgba(255,255,255,.16);\n    }\nhtml:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"],[data-xlyneve-color-theme=\"warm-ivory\"],[data-xlyneve-color-theme=\"cloud-glass\"],[data-xlyneve-color-theme=\"midnight-glass\"]){\n  --subtle-edge-light:rgba(255,255,255,.56);\n  --subtle-edge-shade:rgba(35,38,44,.14);\n  --subtle-raised:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 2px var(--subtle-edge-shade),0 2px 3px rgba(35,38,44,.12),0 5px 12px rgba(35,38,44,.12);\n  --subtle-small:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 1px var(--subtle-edge-shade),0 2px 4px rgba(35,38,44,.18);\n  --subtle-inset:inset 2px 3px 5px rgba(35,38,44,.24),inset -1px -2px 3px var(--subtle-edge-light);\n  --note-editor-depth:var(--subtle-raised);\n  --note-editor-inset:var(--subtle-inset);\n}\nhtml:root:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n  --matte-raised:inset 0 1px 1px #fff8,inset 0 -1px 2px #51474d18,0 2px 3px #51474d16,2px 4px 8px #51474d20;\n  --matte-panel:inset 0 1px 1px #fff8,0 2px 6px #51474d20;\n  --matte-well:inset 2px 3px 5px #51474d26,inset -1px -2px 3px #fff9;\n  --note-editor-depth:var(--matte-panel);\n  --note-editor-inset:var(--matte-well);\n  --refresh-depth:var(--matte-raised);\n  --note-editor-radius:22px;\n}\n","palm-springs":"html[data-xlyneve-color-theme=\"palm-springs\"]{\n      --refresh-cocoa:#b1bfc1;--refresh-rose:#e5cdc8;--refresh-lime:#e1d1a6;--refresh-stone:#f5f3ef;--refresh-blue:#c7d5c7;--refresh-terracotta:#e1d1a6;\n      --refresh-edge:rgba(255,255,255,.84);--refresh-depth:0 12px 30px rgba(177,191,193,.14);--theme-ink:#263333;\n      --quick-panel:linear-gradient(145deg,rgba(245,243,239,.98),rgba(229,205,200,.62));--quick-ink:#263333;--quick-accent:#b1bfc1;--quick-accent-ink:#263333;--quick-soft:rgba(229,205,200,.38);--quick-field:rgba(245,243,239,.9);--quick-edge:rgba(225,209,166,.62);\n      --copy-feedback-accent:#e1d1a6;--copy-feedback-soft:rgba(229,205,200,.5);--clinical-panel:rgba(229,205,200,.78);--clinical-field:rgba(245,243,239,.9);--clinical-accent:#b1bfc1;--clinical-accent-ink:#263333;--clinical-edge:rgba(225,209,166,.62);\n      --homecal-header:linear-gradient(135deg,rgba(177,191,193,.94),rgba(229,205,200,.8));--homecal-header-ink:#263333;--homecal-control:rgba(245,243,239,.9);--homecal-control-ink:#263333;--homecal-header-edge:rgba(225,209,166,.58);--homecal-today:linear-gradient(145deg,rgba(245,243,239,.98),rgba(199,213,199,.9));--homecal-today-edge:rgba(229,205,200,.58);--homecal-today-shadow:rgba(177,191,193,.16);\n    }\nhtml[data-xlyneve-color-theme=\"palm-springs\"],html[data-xlyneve-color-theme=\"palm-springs\"] body{ color:#263333;background-color:#f2f3f3 !important;background-image:none !important; }\nhtml[data-xlyneve-color-theme=\"palm-springs\"] body::before{ opacity:.06 !important;filter:sepia(.08) hue-rotate(326deg) saturate(.82); }\nhtml[data-xlyneve-color-theme=\"palm-springs\"]{\n      --palm-soft-depth:0 1px 0 rgba(251,248,245,.65),0 3px 7px rgba(31,44,44,.1),inset 5px 5px 8px rgba(31,44,44,.22),inset -4px -4px 7px rgba(251,248,245,.65);\n    }\nhtml[data-xlyneve-color-theme=\"palm-springs\"]{ --note-editor-depth:var(--palm-soft-depth); --note-editor-inset:var(--palm-soft-depth); --note-editor-radius:22px; }\nhtml[data-xlyneve-color-theme=\"palm-springs\"]{ --classic-recessed-shade:rgba(31,44,44,.28); }\nhtml:is([data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"hoya\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n      --classic-recessed:inset 5px 5px 8px var(--classic-recessed-shade),inset -1px -1px 2px rgba(255,255,255,.16);\n    }\nhtml:root:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n  --matte-raised:inset 0 1px 1px #fff8,inset 0 -1px 2px #51474d18,0 2px 3px #51474d16,2px 4px 8px #51474d20;\n  --matte-panel:inset 0 1px 1px #fff8,0 2px 6px #51474d20;\n  --matte-well:inset 2px 3px 5px #51474d26,inset -1px -2px 3px #fff9;\n  --note-editor-depth:var(--matte-panel);\n  --note-editor-inset:var(--matte-well);\n  --refresh-depth:var(--matte-raised);\n  --note-editor-radius:22px;\n}\n","quiet-stone":"html[data-xlyneve-color-theme=\"quiet-stone\"]{\n      --refresh-cocoa:#393831;--refresh-rose:#b8aea8;--refresh-lime:#dccfc1;--refresh-stone:#f0efe6;--refresh-blue:#c6c9d2;--refresh-terracotta:#b8aea8;--refresh-edge:rgba(255,255,255,.82);\n      --card-ink:#393831;--card-glass:rgba(234,234,234,.82);--page-header-glass:rgba(184,174,168,.78);--page-header-ink:#393831;\n      --quick-panel:linear-gradient(145deg,rgba(240,239,230,.98),rgba(198,201,210,.76));--quick-ink:#393831;--quick-accent:#393831;--quick-accent-ink:#fff;--quick-soft:rgba(220,207,193,.52);--quick-field:rgba(234,234,234,.86);--quick-edge:rgba(184,174,168,.66);\n    }\nhtml[data-xlyneve-color-theme=\"quiet-stone\"],html[data-xlyneve-color-theme=\"quiet-stone\"] body{ color:#393831;background-color:#f0efe6 !important;background-image:radial-gradient(circle at 12% 12%,rgba(234,234,234,.98),transparent 34%),radial-gradient(circle at 88% 22%,rgba(198,201,210,.34),transparent 40%),radial-gradient(circle at 16% 88%,rgba(220,207,193,.38),transparent 40%),linear-gradient(180deg,#f0efe6 0%,#eaeaea 100%) !important;background-attachment:fixed !important; }\nhtml[data-xlyneve-color-theme=\"quiet-stone\"] body::before{ opacity:.055 !important;filter:grayscale(.18) sepia(.05); }\nhtml[data-xlyneve-color-theme=\"quiet-stone\"]{ --classic-recessed-shade:rgba(57,56,49,.28); }\nhtml:is([data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"hoya\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n      --classic-recessed:inset 5px 5px 8px var(--classic-recessed-shade),inset -1px -1px 2px rgba(255,255,255,.16);\n    }\nhtml:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"],[data-xlyneve-color-theme=\"warm-ivory\"],[data-xlyneve-color-theme=\"cloud-glass\"],[data-xlyneve-color-theme=\"midnight-glass\"]){\n  --subtle-edge-light:rgba(255,255,255,.56);\n  --subtle-edge-shade:rgba(35,38,44,.14);\n  --subtle-raised:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 2px var(--subtle-edge-shade),0 2px 3px rgba(35,38,44,.12),0 5px 12px rgba(35,38,44,.12);\n  --subtle-small:inset 0 1px 1px var(--subtle-edge-light),inset 0 -1px 1px var(--subtle-edge-shade),0 2px 4px rgba(35,38,44,.18);\n  --subtle-inset:inset 2px 3px 5px rgba(35,38,44,.24),inset -1px -2px 3px var(--subtle-edge-light);\n  --note-editor-depth:var(--subtle-raised);\n  --note-editor-inset:var(--subtle-inset);\n}\nhtml:root:root:root:root:root:root:root:root:root:is([data-xlyneve-color-theme=\"original\"],[data-xlyneve-color-theme=\"palm-springs\"],[data-xlyneve-color-theme=\"autumn\"],[data-xlyneve-color-theme=\"lake-mist\"],[data-xlyneve-color-theme=\"quiet-stone\"]){\n  --matte-raised:inset 0 1px 1px #fff8,inset 0 -1px 2px #51474d18,0 2px 3px #51474d16,2px 4px 8px #51474d20;\n  --matte-panel:inset 0 1px 1px #fff8,0 2px 6px #51474d20;\n  --matte-well:inset 2px 3px 5px #51474d26,inset -1px -2px 3px #fff9;\n  --note-editor-depth:var(--matte-panel);\n  --note-editor-inset:var(--matte-well);\n  --refresh-depth:var(--matte-raised);\n  --note-editor-radius:22px;\n}\n","sculpted":"html[data-xlyneve-color-theme=\"sculpted\"]{\n      --refresh-cocoa:#39353a;--refresh-rose:#ba928d;--refresh-lime:#b7bdb4;--refresh-stone:#f1e6e8;--refresh-blue:#6dafbf;--refresh-terracotta:#cdb2cb;\n      --refresh-edge:rgba(255,255,255,.7);--refresh-depth:12px 16px 30px rgba(57,53,58,.2);--theme-ink:#39353a;\n      --quick-panel:linear-gradient(145deg,#f1e6e8,#cdb2cb);--quick-ink:#39353a;--quick-accent:#6dafbf;--quick-accent-ink:#39353a;--quick-soft:rgba(109,175,191,.42);--quick-field:rgba(241,230,232,.9);--quick-edge:rgba(255,255,255,.76);\n      --copy-feedback-accent:#6dafbf;--copy-feedback-soft:rgba(186,146,141,.52);--clinical-panel:rgba(241,230,232,.94);--clinical-field:rgba(241,230,232,.9);--clinical-accent:#6dafbf;--clinical-accent-ink:#39353a;--clinical-edge:rgba(255,255,255,.72);\n      --homecal-header:linear-gradient(145deg,#6dafbf,#5799a9);--homecal-header-ink:#39353a;--homecal-control:rgba(241,230,232,.88);--homecal-control-ink:#39353a;--homecal-header-edge:rgba(255,255,255,.74);--homecal-today:linear-gradient(145deg,#f1e6e8,#ba928d);--homecal-today-edge:rgba(255,255,255,.8);--homecal-today-shadow:rgba(57,53,58,.22);\n    }\nhtml[data-xlyneve-color-theme=\"sculpted\"],html[data-xlyneve-color-theme=\"sculpted\"] body{\n      color:#39353a;background-color:#eadde0 !important;\n      background-image:radial-gradient(ellipse at 5% 4%,rgba(241,230,232,.98) 0 15%,transparent 34%),radial-gradient(ellipse at 95% 8%,rgba(109,175,191,.52) 0 14%,transparent 38%),radial-gradient(ellipse at 8% 90%,rgba(186,146,141,.42) 0 13%,transparent 36%),radial-gradient(ellipse at 92% 88%,rgba(183,189,180,.52) 0 15%,transparent 40%),linear-gradient(145deg,#f1e6e8 0%,#e4d5da 100%) !important;background-attachment:fixed !important;\n    }\nhtml[data-xlyneve-color-theme=\"sculpted\"] body::before{ opacity:.025 !important;filter:sepia(.1) saturate(.62); }\nhtml[data-xlyneve-color-theme=\"sculpted\"]{\n      --note-editor-depth:inset 3px 3px 5px rgba(255,255,255,.88),inset -4px -5px 9px rgba(57,53,58,.12),10px 14px 28px rgba(57,53,58,.18),-5px -5px 14px rgba(255,255,255,.62);\n      --note-editor-inset:inset 4px 4px 7px rgba(57,53,58,.2),inset -4px -4px 7px rgba(255,255,255,.8);\n      --note-editor-radius:24px;\n    }\n","pastel-jumper":"html[data-xlyneve-color-theme=\"pastel-jumper\"]{\n      --refresh-cocoa:#393644;--refresh-rose:#e7a1a1;--refresh-lime:#b9a6d2;--refresh-stone:#faf6e5;--refresh-blue:#f1edcf;--refresh-terracotta:#b9a6d2;\n      --refresh-edge:rgba(255,255,255,.84);--refresh-depth:0 12px 30px rgba(57,54,68,.14);--theme-ink:#393644;\n      --quick-panel:linear-gradient(145deg,rgba(250,246,229,.98),rgba(231,161,161,.62));--quick-ink:#393644;--quick-accent:#b9a6d2;--quick-accent-ink:#393644;--quick-soft:rgba(231,161,161,.38);--quick-field:rgba(250,246,229,.9);--quick-edge:rgba(185,166,210,.62);\n      --copy-feedback-accent:#b9a6d2;--copy-feedback-soft:rgba(231,161,161,.5);--clinical-panel:rgba(231,161,161,.78);--clinical-field:rgba(250,246,229,.9);--clinical-accent:#b9a6d2;--clinical-accent-ink:#393644;--clinical-edge:rgba(185,166,210,.62);\n      --homecal-header:linear-gradient(135deg,rgba(185,166,210,.94),rgba(231,161,161,.8));--homecal-header-ink:#393644;--homecal-control:rgba(250,246,229,.9);--homecal-control-ink:#393644;--homecal-header-edge:rgba(185,166,210,.58);--homecal-today:linear-gradient(145deg,rgba(250,246,229,.98),rgba(241,237,207,.9));--homecal-today-edge:rgba(231,161,161,.58);--homecal-today-shadow:rgba(57,54,68,.16);\n    }\nhtml[data-xlyneve-color-theme=\"pastel-jumper\"],html[data-xlyneve-color-theme=\"pastel-jumper\"] body{ color:#393644;background-color:#f1edcf !important;background-image:radial-gradient(circle at 14% 10%,rgba(250,246,229,.98),transparent 34%),radial-gradient(circle at 86% 20%,rgba(231,161,161,.3),transparent 40%),radial-gradient(circle at 18% 86%,rgba(185,166,210,.22),transparent 38%),linear-gradient(180deg,#faf6e5 0%,#f1edcf 58%,#f1edcf 100%) !important;background-attachment:fixed !important; }\nhtml[data-xlyneve-color-theme=\"pastel-jumper\"] body::before{ opacity:.06 !important;filter:sepia(.08) hue-rotate(326deg) saturate(.82); }\nhtml[data-xlyneve-color-theme=\"pastel-jumper\"]{\n      --pastel-grain:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.055' filter='url(%23grain)'/%3E%3C/svg%3E\");\n      --pastel-ceramic-raised:inset 2px 2px 3px rgba(255,255,251,.95),inset -3px -4px 5px rgba(98,104,89,.18),0 3px 2px rgba(78,83,70,.2),7px 10px 18px rgba(68,73,59,.23),-5px -5px 12px rgba(255,255,251,.88);\n      --pastel-ceramic-pressed:inset 3px 4px 7px rgba(72,81,69,.3),inset -3px -3px 6px rgba(255,255,251,.95);\n    }\nhtml[data-xlyneve-color-theme=\"pastel-jumper\"],html[data-xlyneve-color-theme=\"pastel-jumper\"] body{\n      background-image:var(--pastel-grain),radial-gradient(circle at 14% 10%,rgba(250,246,229,.98),transparent 34%),radial-gradient(circle at 86% 20%,rgba(231,161,161,.3),transparent 40%),radial-gradient(circle at 18% 86%,rgba(185,166,210,.22),transparent 38%),linear-gradient(180deg,#faf6e5 0%,#f1edcf 58%,#f1edcf 100%) !important;\n    }\nhtml[data-xlyneve-color-theme=\"pastel-jumper\"] body::before{ opacity:0 !important; }\nhtml[data-xlyneve-color-theme=\"pastel-jumper\"]{ --note-editor-depth:var(--pastel-ceramic-raised); --note-editor-inset:var(--pastel-ceramic-pressed); --note-editor-radius:22px; }\n"};
  // END GENERATED THEME_BOOT

  const themeCssCacheKey = name => `cep-theme-css:${themeCssVersion}:${name}`;
  const themeCssUrl = name => new URL(`theme-styles/${name}.css?v=${themeCssVersion}`, themeAssetBase).href;
  function cachedThemeCss(name) {
    try {
      const css = sessionStorage.getItem(themeCssCacheKey(name));
      return css?.startsWith('/* CEP theme bundle:') ? css : '';
    } catch { return ''; }
  }
  function cacheThemeCss(name, css) {
    try {
      // Only retain the current build so repeated releases cannot fill storage.
      for (const key of Object.keys(sessionStorage)) {
        if (key.startsWith('cep-theme-css:') && !key.startsWith(`cep-theme-css:${themeCssVersion}:`)) sessionStorage.removeItem(key);
      }
      sessionStorage.setItem(themeCssCacheKey(name), css);
    } catch { /* Styles still work when session storage is unavailable. */ }
  }
  async function prepareThemeCss(name) {
    const cached = cachedThemeCss(name);
    if (cached) return cached;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    try {
      const response = await fetch(themeCssUrl(name), {signal:controller.signal});
      const css = await response.text();
      if (response.ok && css.startsWith('/* CEP theme bundle:')) { cacheThemeCss(name, css); return css; }
    } catch { /* The selected stylesheet can retry through the normal loader. */ }
    finally { clearTimeout(timeout); }
    return '';
  }
  const cachedCss = cachedThemeCss(selectedTheme);
  let selectedThemeSheet = document.createElement(cachedCss ? 'style' : 'link');
  selectedThemeSheet.id = 'cep-selected-theme-css';
  selectedThemeSheet.dataset.theme = selectedTheme;
  if (cachedCss) selectedThemeSheet.textContent = cachedCss;
  else {
    const boot = document.createElement('style');
    boot.id = 'cep-theme-boot'; boot.textContent = themeBootCss[selectedTheme] || '';
    document.head.appendChild(boot);
    selectedThemeSheet.rel = 'stylesheet';
    selectedThemeSheet.setAttribute('blocking', 'render');
    selectedThemeSheet.href = themeCssUrl(selectedTheme);
    selectedThemeSheet.addEventListener('load', () => {
      document.getElementById('cep-theme-boot')?.remove();
      window.dispatchEvent(new Event('cep-theme-css-ready'));
    }, {once:true});
    selectedThemeSheet.addEventListener('error', () => {
      // Keep the small selected-colour bootstrap; never leave a hidden page.
      window.dispatchEvent(new Event('cep-theme-css-ready'));
    }, {once:true});
  }
  document.head.appendChild(selectedThemeSheet);

  const themeStyle = document.createElement("style");
  themeStyle.id = "xlyneve-color-theme-styles";



  // Default card labels follow their actual themed parent; explicit note colours stay authored.

  // Final overrides include the selectors used by page-specific card themes.










  // Home uses lavender in place of blue, alongside the sage, blush and cream palette.












  // Search cards share the clean raised material, including dynamically added results.












  // Search cards share the clean raised material, including dynamically added results.












  // Search cards share the clean raised material, including dynamically added results.




  // Aurora accents for the universal search and shared header ray menu.


  // Ceramic finish for the existing jumper colours; palette values stay unchanged.




  // Porcelain material and blue/blush accents from the reference.


  // A raised porcelain rim surrounds the recessed face, without an overlay on text.


  // Keep filter pills and search-card edges clean inside scrolling containers.




  // Calendar colours reflect date roles, rather than card order.






  // Task text stays directly on the rounded card, in every calendar theme.


  // Hover definitions use a solid surface so underlying content cannot bleed through.


  // A gentle ceramic rim and shallow inset keep Palm Springs softer than the 5D themes.


  // Note creation and editing always have an opaque, theme-matched surface.


  // Shared SVG media buttons stay recognisable and readable across browsers and themes.


  // Mint Ceramic controls sink into their surface while pressed.


  // Set a readable table default without overriding authored descendant colours.


  // Bare, theme-tinted scrollbar thumbs; no track material or end buttons.
  // Native thin bars bypass custom thumb paint in Chromium; preserve the
  // intentionally hidden navigation/embedded bars while enabling themed paint.


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
    return palette[["vintage-pastel","oyster-mist","colour-pop"].includes(selectedTheme) ? Math.abs(Number.isInteger(index) ? index : 0) % palette.length : hash(seed) % palette.length];
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
      const color = palette[["vintage-pastel","oyster-mist","colour-pop"].includes(selectedTheme) ? (pageIndex >= 0 ? pageIndex : index) % palette.length : hash(seed) % palette.length];
      card.style.setProperty("--card-glass", `rgba(${color.rgb}, 0.74)`);
      card.style.setProperty("--card-ink", color.ink);
      card.style.setProperty("--card-solid", color.solid);
      if (color.outline) card.style.setProperty("--card-outline",color.outline);
      else card.style.removeProperty("--card-outline");
      card.dataset.sharedPaletteColor = "true";
    });
  }



  function waitForThemeAsset(element, create) {
    if (element?.sheet || (element?.tagName === 'SCRIPT' && document.getElementById('cep-night-note-contrast'))) return Promise.resolve();
    return new Promise((resolve,reject) => {
      const target = element || create();
      const timeout = setTimeout(() => { cleanup(); reject(new Error('Theme asset timed out')); }, 3000);
      const cleanup = () => { clearTimeout(timeout); target.removeEventListener('load',loaded); target.removeEventListener('error',failed); };
      const loaded = () => { cleanup(); resolve(); };
      const failed = () => { cleanup(); target.remove(); reject(new Error('Theme asset unavailable')); };
      target.addEventListener('load',loaded,{once:true}); target.addEventListener('error',failed,{once:true});
      if (!element) document.head.appendChild(target);
    });
  }
  function prepareThemeExtras(name) {
    if (name === 'moon-clay') return waitForThemeAsset(document.getElementById('cep-moon-clay-theme'), () => {
      const link=document.createElement('link'); link.id='cep-moon-clay-theme'; link.rel='stylesheet';
      link.href=new URL('moon-clay-theme.css?v=8',themeAssetBase).href; return link;
    });
    if (name === 'midnight-glass') return waitForThemeAsset(document.getElementById('cep-night-note-contrast-script'), () => {
      const script=document.createElement('script'); script.id='cep-night-note-contrast-script';
      script.src=new URL('night-note-contrast.js?v=1',themeAssetBase).href; return script;
    });
    return Promise.resolve();
  }
  function applyLiveTheme(name, css) {
    const sheet=document.createElement('style');
    sheet.id='cep-selected-theme-css'; sheet.dataset.theme=name; sheet.textContent=css;
    selectedThemeSheet.replaceWith(sheet); selectedThemeSheet=sheet;
    document.getElementById('cep-theme-boot')?.remove();
    if (name !== 'moon-clay') document.getElementById('cep-moon-clay-theme')?.remove();
    selectedTheme=name; palette=paletteForTheme(name); applyThemeTokens(); paintHeaders();
    document.querySelectorAll(cardSelector).forEach(card => { delete card.dataset.sharedPaletteColor; });
    colorCards(document);
    window.dispatchEvent(new Event('cep-theme-css-ready'));
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
        colors: ["#d09b70", "#b29494", "#a88899", "#cfb1c4", "#bdb0c7", "#ebe7e5"]
      },
      {
        value: "hoya",
        label: "Hoya",
        colors: ["#dfc8cd", "#d1e5e5", "#f1ede7", "#edd6c8", "#cad6e1", "#dce3d5"]
      },
      {
        value: "lake-mist",
        label: "Lake Mist",
        colors: ["#bfc6c6", "#f3f2ed", "#dbcad0", "#443d35", "#d6cfca", "#a2ac9e"]
      },
      {
        value: "palm-springs",
        label: "Palm Springs",
        colors: ["#e1d1a6", "#b1bfc1", "#e5cdc8", "#c7d5c7"]
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

    themeOptions.push({value:"vintage-pastel",label:"Vintage Pastel 3D",colors:["#a3c4bc","#f5cac3","#ead7d1","#fff8e1","#ffe3b3","#d9ead3"]});
    themeOptions.push({value:"mist-sculpture",label:"Mist Sculpture 3D",colors:["#d3d4d7","#c4c1d3","#add0cf","#d3b7c1","#d2dae0","#f1e8c2"]});
    themeOptions.push({value:"clay-relief",label:"Clay Relief 5D",colors:["#b7a6bd","#d8bfae","#ece8e1","#b3a59b","#cbc5c0"]});
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
    themeOptions.push({ value:"soft-stone", label:"Soft Stone 5D", colors:["#c1a3e8","#d3b3d3","#d8bfd8","#ead9f3","#e4c1c1","#f4d7da"] });
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
      let themeSelectionRequest = 0;
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
      if(option.colors.length>8){swatches.style.display="grid";swatches.style.gridTemplateColumns="repeat(6,12px)";swatches.style.flex="none";}
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
      button.addEventListener("click", async () => {
        const selection = ++themeSelectionRequest;
        if (option.value === selectedTheme) { closePicker(); return; }
        button.setAttribute('aria-busy','true');
        status.textContent = '';
        try {
          const [css] = await Promise.all([prepareThemeCss(option.value), prepareThemeExtras(option.value)]);
          if (selection !== themeSelectionRequest) return;
          if (!css) throw new Error('Theme stylesheet unavailable');
          applyLiveTheme(option.value, css);
          try {
            if (option.value === "original") localStorage.removeItem(themeStorageKey);
            else localStorage.setItem(themeStorageKey, option.value);
          } catch {}
          list.querySelectorAll('.xlyneve-theme-option').forEach(optionButton => {
            optionButton.setAttribute('aria-pressed',String(optionButton.dataset.theme === option.value));
          });
          closePicker();
        } catch {
          if (selection === themeSelectionRequest) status.textContent = 'Theme could not load. Please try again.';
        } finally { button.removeAttribute('aria-busy'); }
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







  // Embedded Home windows have no material shell; only their actual cards are themed.








  // Editing fields use their own ink rather than the saved card's light ink.



  // Both search locations show a persistent, theme-matched selected mode.



  // Vital-signs reference: theme materials and ink, with no changes to values.



  // Pastel Rose twins: the same palette and layout, with distinct depth.












  // Glossy opal: pearl-inspired colours and reflections over a neutral base.





  // Matte inset wells: a defined inner lip without a broad lower glow.


  // Palm Springs cards keep their palette without the carved corner shadows.


  // ChatGPTX keeps pastel colour at the edge rather than filling the note.



  // Warm Ivory: matte surfaces, fine taupe rims and shallow tactile controls.




  // Home's Sculpted icons use a diffuse matte face with no pressed halo.


  // Cloud Glass: airy blue/lavender frosting, thin white rims and quiet depth.


  // Home search floats directly over the page; use that same backdrop for
  // Cloud Glass lightbulb search so its translucent material is not darkened.


  // Smoked glass with static cyan/violet rims. Editing surfaces remain opaque.




  // Search matches must not inherit the old dark-on-transparent styling.



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

  // Preserve rule order while keeping only shared CSS and the selected theme.
  // This avoids parsing every other palette/material in the browser and search skins.
  // page-theme.js runs in the head: install before body parsing/first paint,
  // rather than waiting for DOMContentLoaded in start().
  document.head.appendChild(themeStyle);

  function paintHeaders() {
    document.querySelectorAll(headerSelector).forEach((header) => {
      if (pageName === "home.html" && header.matches("body > header")) return;
      if (selectedTheme === "vintage-pastel") {
        header.style.setProperty("background", "#ffe3b3", "important");
      } else if (selectedTheme === "colour-pop") {
        header.style.setProperty("background", "#e6c3f2", "important");
      } else if (selectedTheme === "moon-clay") {
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
  }

  function start() {
    if (!themeStyle.isConnected) document.head.appendChild(themeStyle);
    paintHeaders();
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

// Keep quick taps visibly pressed across themed cards and controls.
(() => {
  const page = (location.pathname.split('/').pop() || '').toLowerCase();
  if (['rncnp.html','biosched1.html','recalltracker.html'].includes(page)) return;
  const controls = 'button,[role="button"],a[href],summary,input[type="button"],input[type="submit"],.circle,.glass-btn,.header-btn,.add-btn,.card,.note-card,.note-tile,.file-item,.chatBubble,.cep-source-surface,.cep-source-chat,.cep-source-form,.universal-search-native-card,.cep-global-search-result';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map();
  const properties = ['box-shadow','scale','translate'];
  function press(event) {
    if (event.type === 'pointerdown' && event.button !== 0) return;
    if (event.type === 'keydown' && (event.repeat || !['Enter',' '].includes(event.key))) return;
    const control = event.target.closest?.(controls);
    if (!control || control.matches(':disabled,[aria-disabled="true"],.cep-copy-text,.cep-pin-zoom-corner,.cep-home-pin-resize,.cep-home-pin-button') ||
        control.closest('[contenteditable="true"],.editing-note,.is-editing') ||
        event.target.closest?.('textarea,select,input:not([type="button"]):not([type="submit"]),[contenteditable="true"]')) return;
    const surface = control.querySelector('.cep-source-surface,.cep-source-notebook,.cep-source-form,.cep-source-chat') || control;
    document.dispatchEvent(new CustomEvent('cep-before-surface-press',{detail:surface}));
    const key = event.type === 'pointerdown' ? 'pointer-' + event.pointerId : 'key-' + event.key;
    active.get(key)?.restore();
    for (const state of active.values()) if (state.surface === surface) state.restore();
    const original = properties.map(name => [name,surface.style.getPropertyValue(name),surface.style.getPropertyPriority(name)]);
    const computed = getComputedStyle(surface);
    const inset = computed.getPropertyValue('--note-editor-inset').trim();
    // Text links in the header press without gaining a surrounding surface.
    if (!control.closest('.top-links')) surface.style.setProperty('box-shadow',
      inset && inset !== 'none' ? inset : 'inset 3px 4px 7px rgba(83,98,108,.3),inset -3px -3px 6px rgba(255,255,251,.95)', 'important');
    if (!motion.matches) {
      const scale = computed.scale === 'none' ? ['1'] : computed.scale.split(' ');
      surface.style.setProperty('scale',scale.map(value => String(Number(value) * .96)).join(' '),'important');
      surface.style.setProperty('translate','0 2px','important');
    }
    let timer;
    const state = { surface, started:performance.now(), restore() {
      clearTimeout(timer);
      for (const [name,value,priority] of original) {
        if (value) surface.style.setProperty(name,value,priority);
        else surface.style.removeProperty(name);
      }
      if (active.get(key) === state) active.delete(key);
    }, release(immediate = false) {
      clearTimeout(timer);
      timer = setTimeout(() => state.restore(),immediate ? 0 : Math.max(0,160 - (performance.now() - state.started)));
    }};
    active.set(key,state);
  }
  function release(event) {
    const key = event.type === 'keyup' ? 'key-' + event.key : 'pointer-' + event.pointerId;
    active.get(key)?.release(event.type === 'pointercancel');
  }
  document.addEventListener('pointerdown',press,{capture:true,passive:true});
  document.addEventListener('keydown',press,true);
  document.addEventListener('pointerup',release,true);
  document.addEventListener('pointercancel',release,true);
  document.addEventListener('keyup',release,true);
  document.addEventListener('cep-before-surface-press',event => {
    for (const state of active.values()) if (state.surface === event.detail) state.restore();
  });
  window.addEventListener('blur',() => { for (const state of active.values()) state.restore(); });
})();

// Saved note cards can be pinned as movable widgets on Home.
(() => {
  const path=(location.pathname.split('/').pop()||'').toLowerCase();
  const pages=new Set(['home.html','pn.html','clinicalnotes.html','chatgptx.html','info.html','explain.html','practicen.html','notes.html','recalls.html','ecg.html','urgent_care.html','face.html','hand.html','sha.html','abdo.html','spine.html','lf.html','forms.html']);
  if(!pages.has(path))return;
  const base=document.currentScript?.src||location.href;
  const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('home-card-pins.css?v=5',base).href;document.head.append(css);
  const script=document.createElement('script');script.src=new URL('home-card-pins.js?v=6',base).href;document.head.append(script);
})();
