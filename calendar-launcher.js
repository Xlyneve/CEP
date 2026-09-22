(function () {
  "use strict";
  const launchers = [...document.querySelectorAll(".home-calendar-launcher")];
  if (!launchers.length) return;

  const fullUrl = "homecal.html";
  const embeddedUrl = "homecal.html?homeEmbed=today&v=4";
  const preferenceKey = "xlyneve-calendar-open-mode";
  const layoutKey = "xlyneve-calendar-home-layout";
  let calendarWindow = null;
  let panel = null;
  let choices = null;
  let activeLauncher = launchers[0];
  let collapsedWidth = 380;

  const style = document.createElement("style");
  style.textContent = `
    .calendar-launch-choices { display:grid; grid-template-columns:1fr 1fr; gap:4px; position:fixed; z-index:10021; padding:8px; border:1px solid #cabec8; border-radius:14px; background:#fff9fc; box-shadow:0 8px 30px #39263730; }
    .calendar-launch-choices[hidden] { display:none; }
    .calendar-launch-choices button { display:block; width:100%; padding:10px 14px; border:0; border-radius:8px; background:transparent; color:#493d49; font:14px system-ui; text-align:left; cursor:pointer; }
    .calendar-launch-choices button[data-mode="home"] { grid-column:1 / -1; }
    .calendar-launch-choices button.calendar-choice-icon { display:flex; align-items:center; justify-content:center; min-width:44px; min-height:44px; padding:10px; }
    .calendar-choice-icon svg { width:20px; height:20px; pointer-events:none; }
    .calendar-launch-choices button:hover,.calendar-launch-choices button:focus-visible { background:#eee5ef; }
    .homepage-calendar { position:fixed; z-index:10020; display:flex; flex-direction:column; width:min(380px,calc(100vw - 16px)); height:min(460px,calc(100dvh - 42px)); overflow:hidden; border:1px solid rgba(255,255,255,.72); border-radius:16px; background:#e8e8e8; box-shadow:0 12px 36px #39263730; }
    .homepage-calendar-bar { display:flex; flex:0 0 34px; align-items:center; justify-content:space-between; padding:0 7px 0 12px; color:#554951; font:700 11px/1 system-ui; cursor:grab; touch-action:none; user-select:none; }
    .homepage-calendar-bar:active { cursor:grabbing; }
    .homepage-calendar-actions { display:flex; align-items:center; gap:4px; }
    .homepage-calendar-todo,.homepage-calendar-close { width:25px; height:25px; padding:0; border:0; border-radius:50%; background:rgba(255,255,255,.58); color:#655b60; cursor:pointer; line-height:1; }
    .homepage-calendar-todo { font:700 10px/1 Arial,sans-serif; }
    .homepage-calendar-close { font-size:17px; }
    .homepage-calendar iframe { display:block; flex:1 1 auto; width:100%; min-height:0; border:0; background:transparent; }
    .homepage-calendar-resize { position:absolute; z-index:2; right:0; bottom:0; width:28px; height:28px; border:0; background:transparent; cursor:nwse-resize; touch-action:none; }
    .homepage-calendar-resize::after { content:""; position:absolute; right:7px; bottom:7px; width:8px; height:8px; border-right:2px solid #aaa; border-bottom:2px solid #aaa; }
  `;
  document.head.appendChild(style);

  function savedLayout() {
    try {
      const value = JSON.parse(localStorage.getItem(layoutKey));
      if (value && [value.x, value.y, value.width, value.height].every(Number.isFinite)) return value;
    } catch {}
    return null;
  }
  function saveLayout() {
    if (!panel) return;
    const todoOpen = panel.classList.contains("todo-open");
    const width = todoOpen ? collapsedWidth : panel.offsetWidth;
    const x = todoOpen ? panel.offsetLeft + panel.offsetWidth - width : panel.offsetLeft;
    try {
      localStorage.setItem(layoutKey, JSON.stringify({
        x, y: panel.offsetTop, width, height: panel.offsetHeight
      }));
    } catch {}
  }
  function movePanel(x, y) {
    if (!panel) return;
    panel.style.left = `${Math.max(8, Math.min(x, innerWidth - panel.offsetWidth - 8))}px`;
    panel.style.top = `${Math.max(34, Math.min(y, innerHeight - panel.offsetHeight - 8))}px`;
  }
  function restoreLayout() {
    const compact = matchMedia("(max-width:600px)").matches;
    const fallbackWidth = Math.min(compact ? 340 : 380, innerWidth - 16);
    const fallbackHeight = Math.min(compact ? 430 : 460, innerHeight - 42);
    const layout = savedLayout() || {
      x: Math.max(8, innerWidth - fallbackWidth - 24), y: compact ? 110 : 90,
      width: fallbackWidth, height: fallbackHeight
    };
    collapsedWidth = Math.min(Math.max(300, layout.width), innerWidth - 16);
    panel.style.width = `${collapsedWidth}px`;
    panel.style.height = `${Math.min(Math.max(260, layout.height), innerHeight - 42)}px`;
    movePanel(layout.x, layout.y);
  }
  function closePanel() {
    saveLayout();
    panel?.remove();
    panel = null;
    activeLauncher?.focus();
  }
  function bindPointerHandle(handle, resize) {
    let gesture = null;
    handle.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      gesture = {
        x:event.screenX, y:event.screenY, left:panel.offsetLeft, top:panel.offsetTop,
        width:panel.offsetWidth, height:panel.offsetHeight
      };
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener("pointermove", event => {
      if (!gesture) return;
      const dx = event.screenX - gesture.x, dy = event.screenY - gesture.y;
      if (resize) {
        panel.style.width = `${Math.min(Math.max(300, gesture.width + dx), innerWidth - panel.offsetLeft - 8)}px`;
        panel.style.height = `${Math.min(Math.max(260, gesture.height + dy), innerHeight - panel.offsetTop - 8)}px`;
        if (!panel.classList.contains("todo-open")) collapsedWidth = panel.offsetWidth;
      } else movePanel(gesture.left + dx, gesture.top + dy);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(name =>
      handle.addEventListener(name, () => { if (gesture) saveLayout(); gesture = null; })
    );
  }
  function openOnHome() {
    if (panel) { panel.querySelector("iframe")?.focus(); return; }
    panel = document.createElement("section");
    panel.className = "homepage-calendar";
    panel.setAttribute("aria-label", "Today calendar and to-do");
    const bar = document.createElement("div"); bar.className = "homepage-calendar-bar";
    const label = document.createElement("span"); label.textContent = "Today";
    const actions = document.createElement("div"); actions.className = "homepage-calendar-actions";
    const todo = document.createElement("button"); todo.type = "button"; todo.className = "homepage-calendar-todo";
    todo.textContent = ">>"; todo.setAttribute("aria-label", "Show to-do list"); todo.setAttribute("aria-expanded", "false");
    todo.addEventListener("pointerdown", event => event.stopPropagation());
    todo.addEventListener("click", () => {
      panel?.querySelector("iframe")?.contentWindow?.postMessage({
        type: "homecal-set-todo", open: !panel.classList.contains("todo-open")
      }, location.origin);
    });
    const close = document.createElement("button"); close.type = "button"; close.className = "homepage-calendar-close";
    close.addEventListener("pointerdown", event => event.stopPropagation());
    close.textContent = "×"; close.setAttribute("aria-label", "Close homepage calendar"); close.addEventListener("click", closePanel);
    actions.append(todo, close); bar.append(label, actions);
    const frame = document.createElement("iframe"); frame.title = "Today calendar and to-do"; frame.src = embeddedUrl;
    const resize = document.createElement("button"); resize.type = "button"; resize.className = "homepage-calendar-resize";
    resize.setAttribute("aria-label", "Resize homepage calendar");
    panel.append(bar, frame, resize); document.body.appendChild(panel);
    restoreLayout(); bindPointerHandle(bar, false); bindPointerHandle(resize, true);
  }
  window.addEventListener("message", event => {
    if (!panel || event.origin !== location.origin || event.source !== panel.querySelector("iframe")?.contentWindow) return;
    if (event.data?.type !== "homecal-embedded-todo") return;
    const open = Boolean(event.data.open);
    if (open === panel.classList.contains("todo-open")) return;
    const rightEdge = panel.offsetLeft + panel.offsetWidth;
    if (open) {
      collapsedWidth = panel.offsetWidth;
      panel.classList.add("todo-open");
      const expandedWidth = Math.min(Math.max(collapsedWidth + 330, 620), innerWidth - 16);
      panel.style.width = `${expandedWidth}px`;
      movePanel(rightEdge - expandedWidth, panel.offsetTop);
    } else {
      panel.classList.remove("todo-open");
      const restoredWidth = Math.min(collapsedWidth, innerWidth - 16);
      panel.style.width = `${restoredWidth}px`;
      movePanel(rightEdge - restoredWidth, panel.offsetTop);
    }
    const todoButton = panel.querySelector(".homepage-calendar-todo");
    todoButton.textContent = open ? "<<" : ">>";
    todoButton.setAttribute("aria-expanded", String(open));
    todoButton.setAttribute("aria-label", open ? "Hide to-do list" : "Show to-do list");
  });

  choices = document.createElement("div"); choices.className = "calendar-launch-choices"; choices.hidden = true;
  choices.setAttribute("role", "group"); choices.setAttribute("aria-label", "Open calendar and to-do"); document.body.appendChild(choices);
  const closeChoices = () => { choices.hidden = true; activeLauncher?.setAttribute("aria-expanded", "false"); };
  const modes = [
    ["home", "Open on homepage", openOnHome],
    ["tab", "Open in new tab", () => window.open(fullUrl, "_blank", "noopener")],
    ["window", "Open in new window", () => {
      if (!calendarWindow || calendarWindow.closed) calendarWindow = window.open(fullUrl, "xlyneveCalendar", "popup=yes,width=1050,height=760,resizable=yes,scrollbars=yes,location=no,toolbar=no,menubar=no,status=no");
      calendarWindow?.focus();
    }]
  ];
  modes.forEach(([mode, text, action]) => {
    const choice = document.createElement("button"); choice.type = "button"; choice.dataset.mode = mode;
    choice.setAttribute("aria-label", text); choice.title = text;
    if (mode === "home") choice.textContent = text;
    else {
      choice.className = "calendar-choice-icon";
      const paths = mode === "tab"
        ? '<path d="M14 3h7v7M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>'
        : '<rect x="8" y="3" width="13" height="13" rx="2"/><path d="M8 8h13M5 8H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-1"/>';
      choice.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
    }
    choice.addEventListener("click", () => {
      try { localStorage.setItem(preferenceKey, mode); } catch {}
      closeChoices(); action();
    });
    choices.appendChild(choice);
  });
  function toggleChoices(launcher) {
    activeLauncher = launcher;
    if (!choices.hidden) { closeChoices(); return; }
    choices.hidden = false; launcher.setAttribute("aria-expanded", "true");
    const rect = launcher.getBoundingClientRect();
    choices.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - choices.offsetWidth - 8))}px`;
    choices.style.top = `${Math.max(8, Math.min(rect.bottom + 8, innerHeight - choices.offsetHeight - 8))}px`;
    choices.querySelector("button")?.focus();
  }
  launchers.forEach(launcher => {
    launcher.setAttribute("aria-haspopup", "true"); launcher.setAttribute("aria-expanded", "false");
    launcher.title = "Choose how to open calendar and to-do";
    launcher.addEventListener("click", event => {
      event.preventDefault(); activeLauncher = launcher;
      toggleChoices(launcher);
    }, { capture:true });
    launcher.addEventListener("contextmenu", event => { event.preventDefault(); toggleChoices(launcher); });
  });
  document.addEventListener("pointerdown", event => {
    if (!choices.contains(event.target) && !launchers.some(launcher => launcher.contains(event.target))) closeChoices();
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !choices.hidden) closeChoices(); });
  window.addEventListener("resize", () => { closeChoices(); if (panel) movePanel(panel.offsetLeft, panel.offsetTop); });
})();
