(function () {
  "use strict";
  const launchers = [...document.querySelectorAll(".home-calendar-launcher")];
  if (!launchers.length) return;

  const fullUrl = "homecal.html";
  const embeddedUrl = "homecal.html?homeEmbed=today&v=4";
  const layoutKey = "xlyneve-calendar-home-layout";
  let calendarWindow = null;
  let panel = null;
  let choices = null;
  let activeLauncher = launchers[0];
  let collapsedWidth = 380;
  let hoverTimer = null;
  let closeTimer = null;

  const style = document.createElement("style");
  style.textContent = `
    .calendar-launch-choices { display:grid; grid-template-columns:1fr; gap:4px; position:fixed; z-index:10021; padding:8px; border:1px solid #cabec8; border-radius:14px; background:#fff9fc; box-shadow:0 8px 30px #39263730; }
    .calendar-launch-choices[hidden] { display:none; }
    .calendar-launch-choices button { display:block; width:100%; padding:10px 14px; border:0; border-radius:8px; background:transparent; color:#493d49; font:14px system-ui; text-align:left; cursor:pointer; }
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
    ["window", "Open in new window", () => {
      if (!calendarWindow || calendarWindow.closed) calendarWindow = window.open(fullUrl, "xlyneveCalendar", "popup=yes,width=1050,height=760,resizable=yes,scrollbars=yes,location=no,toolbar=no,menubar=no,status=no");
      calendarWindow?.focus();
    }]
  ];
  modes.forEach(([mode, text, action]) => {
    const choice = document.createElement("button"); choice.type = "button"; choice.dataset.mode = mode;
    choice.setAttribute("aria-label", text); choice.title = text;
    choice.textContent = text;
    choice.addEventListener("click", () => {
      closeChoices(); action();
    });
    choices.appendChild(choice);
  });
  function showChoices(launcher) {
    activeLauncher = launcher;
    clearTimeout(closeTimer);
    if (!choices.hidden) return;
    choices.hidden = false; launcher.setAttribute("aria-expanded", "true");
    const rect = launcher.getBoundingClientRect();
    choices.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - choices.offsetWidth - 8))}px`;
    choices.style.top = `${Math.max(8, Math.min(rect.bottom + 8, innerHeight - choices.offsetHeight - 8))}px`;
    choices.querySelector("button")?.focus();
  }
  function toggleChoices(launcher) {
    if (!choices.hidden) { closeChoices(); return; }
    showChoices(launcher);
  }
  function scheduleCloseChoices() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeChoices, 250);
  }
  const prepareLauncher = launcher => {
    launcher.setAttribute("aria-haspopup", "true"); launcher.setAttribute("aria-expanded", "false");
    launcher.title = "Open calendar in a new tab · Hover 3 seconds for more options";
  };
  launchers.forEach(prepareLauncher);
  const launcherFromEvent = event => event.target.closest?.(".home-calendar-launcher");
  document.addEventListener("click", event => {
    const launcher = launcherFromEvent(event);
    if (!launcher) return;
    event.preventDefault(); activeLauncher = launcher;
    clearTimeout(hoverTimer); closeChoices(); window.open(fullUrl, "_blank", "noopener");
  }, { capture:true });
  document.addEventListener("mouseover", event => {
    const launcher = launcherFromEvent(event);
    if (!launcher || launcher.contains(event.relatedTarget)) return;
    prepareLauncher(launcher);
    clearTimeout(hoverTimer); clearTimeout(closeTimer);
    hoverTimer = setTimeout(() => {
      if (launcher.isConnected && launcher.matches(":hover")) showChoices(launcher);
    }, 3000);
  });
  document.addEventListener("mouseout", event => {
    const launcher = launcherFromEvent(event);
    if (!launcher || launcher.contains(event.relatedTarget)) return;
    clearTimeout(hoverTimer);
    if (!choices.hidden) scheduleCloseChoices();
  });
  document.addEventListener("contextmenu", event => {
    const launcher = launcherFromEvent(event);
    if (!launcher) return;
    event.preventDefault(); prepareLauncher(launcher); toggleChoices(launcher);
  });
  choices.addEventListener("mouseenter", () => clearTimeout(closeTimer));
  choices.addEventListener("mouseleave", scheduleCloseChoices);
  document.addEventListener("pointerdown", event => {
    if (!choices.contains(event.target) && !launcherFromEvent(event)) closeChoices();
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !choices.hidden) closeChoices(); });
  window.addEventListener("resize", () => { clearTimeout(hoverTimer); closeChoices(); if (panel) movePanel(panel.offsetLeft, panel.offsetTop); });
})();
