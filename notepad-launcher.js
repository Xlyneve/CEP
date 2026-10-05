(function () {
  "use strict";
  const launcher = document.querySelector(".pageTitle");
  if (!launcher) return;
  const url = "notepad.html?v=20260916-8";
  let notepadWindow = null;
  let panel = null;
  const compactLayout = matchMedia("(max-width: 600px)").matches;
  const layoutKey = compactLayout
    ? "xlyneve-notepad-home-layout-mobile"
    : "xlyneve-notepad-home-layout";
  const openStateKey = "xlyneve-notepad-home-open";
  let savedLayout = null;
  const rememberOpenState = open => {
    try {
      if (open) localStorage.setItem(openStateKey, "true");
      else localStorage.removeItem(openStateKey);
    } catch {}
  };
  const rememberedOpenState = () => {
    try { return localStorage.getItem(openStateKey) === "true"; }
    catch { return false; }
  };
  try {
    const value = JSON.parse(localStorage.getItem(layoutKey));
    if (value && [value.x, value.y, value.width, value.height].every(Number.isFinite) && value.width > 0 && value.height > 0) savedLayout = value;
  } catch {}
  function saveLayout() {
    if (!panel || panel.hidden) return;
    savedLayout = { x:panel.offsetLeft, y:panel.offsetTop, width:panel.offsetWidth, height:panel.offsetHeight };
    try { localStorage.setItem(layoutKey, JSON.stringify(savedLayout)); } catch {}
  }
  function restoreLayout() {
    if (!panel || panel.hidden) return;
    const mobileWidth = Math.min(320, innerWidth - 24);
    const mobileHeight = Math.min(380, innerHeight - 180);
    const layout = savedLayout || (compactLayout
      ? { x:(innerWidth - mobileWidth) / 2, y:180, width:mobileWidth, height:mobileHeight }
      : { x:innerWidth - 344, y:100, width:320, height:340 });
    panel.style.width = Math.min(Math.max(180, layout.width), Math.max(1, innerWidth - 16)) + "px";
    panel.style.height = Math.min(Math.max(160, layout.height), Math.max(1, innerHeight - 42)) + "px";
    movePanel(layout.x, layout.y);
  }
  const style = document.createElement("style");
  style.textContent = `
    .notepad-choices { display:grid; grid-template-columns:1fr 1fr; gap:4px; position:fixed; z-index:10001; padding:8px; border:1px solid #cabec8; border-radius:14px; background:#fff9fc; box-shadow:0 8px 30px #39263730; }
    .notepad-choices[hidden], .homepage-notepad[hidden] { display:none; }
    .notepad-choices button { display:block; width:100%; padding:10px 14px; border:0; border-radius:8px; background:transparent; color:#493d49; font:14px system-ui; text-align:left; cursor:pointer; }
    .notepad-choices button[data-mode="home"] { grid-column:1 / -1; }
    .notepad-choices button.notepad-choice-icon { display:flex; align-items:center; justify-content:center; min-width:44px; min-height:44px; padding:10px; }
    .notepad-choice-icon svg { width:20px; height:20px; pointer-events:none; }
    .notepad-choices button:hover, .notepad-choices button:focus-visible { background:#eee5ef; }
    .homepage-notepad { position:fixed; z-index:10000; width:min(320px, calc(100vw - 16px)); height:min(340px, calc(100dvh - 42px)); overflow:visible; border-radius:14px; background:var(--light-dove-grey, #e8e8e8); box-shadow:0 12px 36px #39263730; }
    .homepage-notepad iframe { display:block; width:100%; height:100%; border:0; border-radius:14px; background:transparent; }
    .homepage-notepad-resize { position:absolute; z-index:2; border:0; background:transparent; color:#777; cursor:pointer; }
    .homepage-notepad-resize { right:0; bottom:0; width:24px; height:24px; cursor:nwse-resize; touch-action:none; }
    .homepage-notepad-resize::after { content:""; position:absolute; right:6px; bottom:6px; width:8px; height:8px; border-right:2px solid #bbb; border-bottom:2px solid #bbb; }
    @media (max-width:600px) {
      .homepage-notepad-resize { width:34px; height:34px; }
      .homepage-notepad-resize::after { right:8px; bottom:8px; width:10px; height:10px; }
    }
  `;
  document.head.append(style);
  const choices = document.createElement("div");
  choices.className = "notepad-choices";
  choices.id = "notepad-choices";
  choices.hidden = true;
  choices.setAttribute("role", "group");
  choices.setAttribute("aria-label", "Open mini notepad");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", choices.id);
  document.body.append(choices);

  function closeChoices() {
    choices.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
  }
  function movePanel(x, y) {
    panel.style.left = `${Math.max(8, Math.min(x, innerWidth - panel.offsetWidth - 8))}px`;
    panel.style.top = `${Math.max(34, Math.min(y, innerHeight - panel.offsetHeight - 8))}px`;
  }
  function openOnHome() {
    rememberOpenState(true);
    if (panel) {
      panel.hidden = false;
      restoreLayout();
      panel.querySelector("iframe").contentDocument?.querySelector(".dot-yellow")?.focus();
      return;
    }
    panel = document.createElement("section");
    panel.className = "homepage-notepad";
    panel.setAttribute("aria-label", "Homepage notepad");
    const frame = document.createElement("iframe");
    frame.title = "Mini notepad";
    frame.src = url;
    const resize = document.createElement("button");
    resize.className = "homepage-notepad-resize";
    resize.type = "button";
    resize.setAttribute("aria-label", "Resize notepad: drag or use arrow keys");
    resize.title = "Drag to resize, or use arrow keys";
    function sizePanel(width, height) {
      panel.style.width = Math.min(Math.max(180, width), innerWidth - panel.offsetLeft - 8) + "px";
      panel.style.height = Math.min(Math.max(160, height), innerHeight - panel.offsetTop - 8) + "px";
    }
    function bindHandle(handle, resizing) {
      let gesture = null;
      handle.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        if (event.target !== handle && event.target.closest("button,a,input,select,textarea,[contenteditable]")) return;
        gesture = { x:event.screenX, y:event.screenY, left:panel.offsetLeft, top:panel.offsetTop, width:panel.offsetWidth, height:panel.offsetHeight };
        handle.setPointerCapture(event.pointerId);
        event.preventDefault();
        handle.focus();
      });
      handle.addEventListener("pointermove", event => {
        if (!gesture) return;
        const dx = event.screenX - gesture.x;
        const dy = event.screenY - gesture.y;
        if (resizing) sizePanel(gesture.width + dx, gesture.height + dy);
        else movePanel(gesture.left + dx, gesture.top + dy);
      });
      for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
        handle.addEventListener(name, () => { if (gesture) saveLayout(); gesture = null; });
      }
      handle.addEventListener("keydown", event => {
        if (event.target !== handle && event.target.closest("button,a,input,select,textarea,[contenteditable]")) return;
        const delta = { ArrowLeft:[-16,0], ArrowRight:[16,0], ArrowUp:[0,-16], ArrowDown:[0,16] }[event.key];
        if (!delta) return;
        event.preventDefault();
        if (resizing) sizePanel(panel.offsetWidth + delta[0], panel.offsetHeight + delta[1]);
        else movePanel(panel.offsetLeft + delta[0], panel.offsetTop + delta[1]);
        saveLayout();
      });
    }
    function prepareEmbeddedNotepad() {
      const doc = frame.contentDocument;
      if (!doc || doc.documentElement.dataset.homeNotepadReady === "1") return;
      const yellowDot = doc.querySelector(".dot-yellow");
      const purpleDot = doc.querySelector(".dot-purple");
      if (!yellowDot || !purpleDot) {
        window.setTimeout(prepareEmbeddedNotepad, 80);
        return;
      }
      doc.documentElement.dataset.homeNotepadReady = "1";
      doc.documentElement.classList.add("home-notepad-embedded");
      const embeddedStyle = doc.createElement("style");
      embeddedStyle.textContent = `
        html, body { background:transparent; }
        body { padding:0; }
        main { border:0; border-radius:0; background:transparent; box-shadow:none; }
        .notes { inset:36px 0 0; padding:0 8px 8px; }
        .note-card { margin:0 0 9px; border:0; border-radius:10px; box-shadow:none; }
        .note-card, .notepad { background:white; }
        .timestamp { right:28px; }
        html:root.home-notepad-embedded[data-xlyneve-color-theme="warm-medley"][data-home-notepad-ready="1"] body main {
          background:#16131f !important;
        }
        html:root.home-notepad-embedded[data-xlyneve-color-theme="warm-medley"][data-home-notepad-ready="1"] body .note-card {
          background:#806c79 !important;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 5px 12px rgba(0,0,0,.35),0 0 0 1px rgba(240,217,228,.18) !important;
        }
        html:root.home-notepad-embedded[data-xlyneve-color-theme="warm-medley"][data-home-notepad-ready="1"] body .notepad {
          background:#4a3f4b !important;
          color:#ffffff !important;
          -webkit-text-fill-color:#ffffff !important;
          caret-color:#ffffff !important;
        }
        html:root.home-notepad-embedded[data-xlyneve-color-theme="warm-medley"][data-home-notepad-ready="1"] body :is(.timestamp,.open-options-icon) {
          color:#ffffff !important;
          -webkit-text-fill-color:#ffffff !important;
        }
        html:root.home-notepad-embedded:is([data-xlyneve-color-theme="sculpted"],[data-xlyneve-color-theme="pastel-jumper"])[data-home-notepad-ready="1"] body main {
          background:linear-gradient(145deg,#cdb2cb,#a288b7) !important;
          box-shadow:inset 2px 2px 5px rgba(255,255,255,.45),inset -3px -3px 7px rgba(57,53,58,.18) !important;
        }
        html:root.home-notepad-embedded:is([data-xlyneve-color-theme="sculpted"],[data-xlyneve-color-theme="pastel-jumper"])[data-home-notepad-ready="1"] body #notes .note-card {
          background:#f1e6e8 !important;
          box-shadow:inset 2px 2px 4px rgba(255,255,255,.8),inset -2px -3px 5px rgba(57,53,58,.1),0 6px 10px rgba(57,53,58,.26),0 0 0 1px rgba(255,255,255,.45) !important;
        }
        html:root.home-notepad-embedded:is([data-xlyneve-color-theme="sculpted"],[data-xlyneve-color-theme="pastel-jumper"])[data-home-notepad-ready="1"] body .notepad {
          background:#f1e6e8 !important;
        }
        .pad-controls .dot { width:12px; height:12px; }
        .dot-purple { cursor:pointer; }
        .dot-purple:focus-visible { outline:2px solid #8c7bb5; outline-offset:4px; }
        .homepage-notepad-drag-bar { position:absolute; top:0; left:0; right:0; height:36px; z-index:3; border-radius:14px 14px 0 0; cursor:default; user-select:none; }
        html:root.home-notepad-embedded .homepage-notepad-drag-bar {
          background:var(--page-header-solid,#e8e8e8);
          color:var(--page-header-ink,#39353a);
          -webkit-text-fill-color:currentColor;
        }
        html:root.home-notepad-embedded .homepage-notepad-drag-bar .open-options-icon {
          color:var(--page-header-ink,#39353a) !important;
          -webkit-text-fill-color:currentColor !important;
        }
        html:root.home-notepad-embedded .homepage-notepad-drag-bar .dot {
          box-shadow:0 0 0 1px var(--page-header-ink,#39353a);
        }
        @media (hover:hover) and (pointer:fine) {
          html:root.home-notepad-embedded body .notes { inset:0 !important; }
          html:root.home-notepad-embedded body:hover .notes,
          html:root.home-notepad-embedded body:has(.homepage-notepad-drag-bar:focus-within) .notes {
            top:36px !important;
          }
          html:root.home-notepad-embedded .homepage-notepad-drag-bar {
            opacity:0; pointer-events:none; transform:translateY(-100%);
            transition:opacity 140ms ease,transform 140ms ease;
          }
          html:root.home-notepad-embedded body:hover .homepage-notepad-drag-bar,
          html:root.home-notepad-embedded .homepage-notepad-drag-bar:focus-within {
            opacity:1; pointer-events:auto; transform:translateY(0);
          }
        }
        @media (prefers-reduced-motion:reduce) {
          html:root.home-notepad-embedded .homepage-notepad-drag-bar { transition:none; }
        }
        .homepage-notepad-drag-handle { position:absolute; inset:0 44px 0 84px; cursor:grab; touch-action:none; }
        .homepage-notepad-drag-handle:active { cursor:grabbing; }
        .homepage-notepad-drag-handle:focus-visible { outline:2px solid #8c7bb5; outline-offset:-2px; }
        .dot-yellow { cursor:default; }
        html:root.home-notepad-embedded[data-xlyneve-color-theme="warm-medley"] body .dot-add { background:#f0d9e4 !important; }
        html:root.home-notepad-embedded[data-xlyneve-color-theme="warm-medley"] body .dot-yellow { background:#806c79 !important; }
        html:root.home-notepad-embedded[data-xlyneve-color-theme="warm-medley"] body .dot-purple { background:#c1a0ac !important; }
        html:root.home-notepad-embedded[data-xlyneve-color-theme="warm-medley"] body .dot { outline:1px solid rgba(255,255,255,.45); }
        .dot-yellow:focus-visible { outline:2px solid #ad8e20; outline-offset:4px; }
      `;
      doc.head.append(embeddedStyle);
      yellowDot.title = "Drag the middle of the top bar to move notepad";
      const close = doc.createElement("button");
      close.type = "button";
      close.className = "dot dot-purple";
      close.setAttribute("aria-label", "Close homepage notepad");
      close.title = "Close notepad";
      close.addEventListener("click", () => {
        saveLayout();
        panel.hidden = true;
        rememberOpenState(false);
        launcher.focus();
      });
      purpleDot.replaceWith(close);
      const topBar = doc.createElement("div");
      topBar.className = "homepage-notepad-drag-bar";
      const dragHandle = doc.createElement("div");
      dragHandle.className = "homepage-notepad-drag-handle";
      dragHandle.tabIndex = 0;
      dragHandle.setAttribute("role", "button");
      dragHandle.setAttribute("aria-label", "Move notepad: drag or use arrow keys");
      topBar.appendChild(dragHandle);
      topBar.setAttribute("role", "toolbar");
      topBar.setAttribute("aria-label", "Notepad title bar: drag or use arrow keys to move");
      topBar.title = "Drag the top bar to move notepad";
      const controls = doc.querySelector(".pad-controls");
      const openOptions = doc.querySelector(".pad-open-options");
      doc.querySelector("main").prepend(topBar);
      if (controls) topBar.appendChild(controls);
      if (openOptions) topBar.appendChild(openOptions);
      bindHandle(dragHandle, false);
    }
    frame.addEventListener("load", prepareEmbeddedNotepad);
    bindHandle(resize, true);
    panel.append(frame, resize);
    document.body.append(panel);
    restoreLayout();
    if (frame.contentDocument?.readyState === "complete") prepareEmbeddedNotepad();
  }
  const homeRequestKey = "xlyneve-notepad-open-home-request";
  const homeAcknowledgementKey = "xlyneve-notepad-open-home-ack";
  window.addEventListener("storage", event => {
    if (event.key !== homeRequestKey || !event.newValue) return;
    openOnHome();
    try { localStorage.setItem(homeAcknowledgementKey, event.newValue); } catch {}
    window.focus();
  });
  const launchParams = new URLSearchParams(location.search);
  if (launchParams.get("openNotepad") === "1") {
    openOnHome();
    launchParams.delete("openNotepad");
    const cleanUrl = `${location.pathname}${launchParams.size ? `?${launchParams}` : ""}${location.hash}`;
    history.replaceState(null, "", cleanUrl);
  }
  const modes = [
    ["home", "Open on homepage", openOnHome],
    ["tab", "Open in new tab", () => window.open(url, "_blank", "noopener")],
    ["window", "Open in new window", () => {
      if (!notepadWindow || notepadWindow.closed) {
        notepadWindow = window.open(url, "xlyneveMiniNotepad", "popup=yes,width=300,height=633,resizable=yes,scrollbars=no,location=no,toolbar=no,menubar=no,status=no");
      }
      notepadWindow?.focus();
    }]
  ];
  for (const [mode, text, action] of modes) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.mode = mode;
    button.setAttribute("aria-label", text);
    button.title = text;
    if (mode === "home") {
      button.textContent = text;
    } else {
      button.className = "notepad-choice-icon";
      const paths = mode === "tab"
        ? '<path d="M14 3h7v7M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>'
        : '<rect x="8" y="3" width="13" height="13" rx="2"/><path d="M8 8h13M5 8H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-1"/>';
      button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
    }
    button.onclick = () => {
      preferredMode = mode;
      try { localStorage.setItem(preferenceKey, mode); } catch {}
      closeChoices();
      action();
    };
    choices.append(button);
  }
  function toggleChoices() {
    if (!choices.hidden) { closeChoices(); return; }
    choices.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    const rect = launcher.getBoundingClientRect();
    choices.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - choices.offsetWidth - 8))}px`;
    choices.style.top = `${Math.max(8, Math.min(rect.bottom + 8, innerHeight - choices.offsetHeight - 8))}px`;
    choices.querySelector("button").focus();
  }
  const preferenceKey = "xlyneve-notepad-open-mode";
  let preferredMode = null;
  try { preferredMode = localStorage.getItem(preferenceKey); } catch {}
  launcher.title = "Open notepad · Shift-click or right-click to change how it opens";
  function launch(event) {
    const selected = modes.find(([mode]) => mode === preferredMode);
    if (event.shiftKey || !selected) { toggleChoices(); return; }
    closeChoices();
    selected[2]();
  }
  launcher.addEventListener("click", launch);
  launcher.addEventListener("contextmenu", event => {
    event.preventDefault();
    toggleChoices();
  });
  launcher.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    launch(event);
  });
  document.addEventListener("pointerdown", event => {
    if (!choices.contains(event.target) && !launcher.contains(event.target)) closeChoices();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !choices.hidden) { closeChoices(); launcher.focus(); }
  });
  window.addEventListener("resize", () => {
    closeChoices();
    restoreLayout();
  });
  window.addEventListener("pagehide", saveLayout);
  if (rememberedOpenState()) requestAnimationFrame(openOnHome);
})();
