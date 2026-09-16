(function () {
  "use strict";
  const launcher = document.querySelector(".pageTitle");
  if (!launcher) return;
  const url = "notepad.html?v=20260830-8";
  let notepadWindow = null;
  let panel = null;
  const style = document.createElement("style");
  style.textContent = `
    .notepad-choices { position:fixed; z-index:10001; padding:8px; border:1px solid #cabec8; border-radius:14px; background:#fff9fc; box-shadow:0 8px 30px #39263730; }
    .notepad-choices[hidden], .homepage-notepad[hidden] { display:none; }
    .notepad-choices button { display:block; width:100%; padding:10px 14px; border:0; border-radius:8px; background:transparent; color:#493d49; font:14px system-ui; text-align:left; cursor:pointer; }
    .notepad-choices button:hover, .notepad-choices button:focus-visible { background:#eee5ef; }
    .homepage-notepad { position:fixed; z-index:10000; width:min(320px, calc(100vw - 16px)); height:min(540px, calc(100dvh - 16px)); display:flex; flex-direction:column; overflow:hidden; border:1px solid #cabec8; border-radius:14px; background:#eeeefe; box-shadow:0 12px 36px #39263735; }
    .homepage-notepad-bar { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:#eee5ef; color:#493d49; font:14px system-ui; cursor:move; touch-action:none; user-select:none; }
    .homepage-notepad-bar:focus-visible { outline:2px solid #80647f; outline-offset:-3px; }
    .homepage-notepad-bar button { border:0; background:transparent; color:inherit; font:22px system-ui; cursor:pointer; padding:0 6px; }
    .homepage-notepad iframe { width:100%; flex:1; min-height:0; border:0; }
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
    panel.style.top = `${Math.max(8, Math.min(y, innerHeight - panel.offsetHeight - 8))}px`;
  }
  function openOnHome() {
    if (panel) {
      panel.hidden = false;
      movePanel(parseFloat(panel.style.left), parseFloat(panel.style.top));
      panel.querySelector(".homepage-notepad-bar").focus();
      return;
    }
    panel = document.createElement("section");
    panel.className = "homepage-notepad";
    panel.setAttribute("aria-label", "Homepage notepad");
    const bar = document.createElement("div");
    bar.className = "homepage-notepad-bar";
    bar.tabIndex = 0;
    bar.setAttribute("aria-label", "Move notepad: drag or use arrow keys");
    bar.title = "Drag to move, or focus and use arrow keys";
    const label = document.createElement("span");
    label.textContent = "Mini notepad";
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close homepage notepad");
    close.onclick = () => { panel.hidden = true; launcher.focus(); };
    bar.append(label, close);
    const frame = document.createElement("iframe");
    frame.title = "Mini notepad";
    frame.src = url;
    panel.append(bar, frame);
    document.body.append(panel);
    movePanel(innerWidth - 344, 100);
    let drag = null;
    bar.addEventListener("pointerdown", event => {
      if (event.target.closest("button") || event.button !== 0) return;
      drag = { x:event.clientX - panel.offsetLeft, y:event.clientY - panel.offsetTop };
      bar.setPointerCapture(event.pointerId);
      frame.style.pointerEvents = "none";
      event.preventDefault();
      bar.focus();
    });
    bar.addEventListener("pointermove", event => {
      if (drag) movePanel(event.clientX - drag.x, event.clientY - drag.y);
    });
    function stopDrag() { drag = null; frame.style.pointerEvents = ""; }
    bar.addEventListener("pointerup", stopDrag);
    bar.addEventListener("pointercancel", stopDrag);
    bar.addEventListener("lostpointercapture", stopDrag);
    bar.addEventListener("keydown", event => {
      if (event.target !== bar) return;
      const delta = { ArrowLeft:[-16,0], ArrowRight:[16,0], ArrowUp:[0,-16], ArrowDown:[0,16] }[event.key];
      if (!delta) return;
      event.preventDefault();
      movePanel(panel.offsetLeft + delta[0], panel.offsetTop + delta[1]);
    });
    bar.focus();
  }
  for (const [text, action] of [
    ["Open on homepage", openOnHome],
    ["Open in new tab", () => window.open(url, "_blank", "noopener")],
    ["Open in new window", () => {
      if (!notepadWindow || notepadWindow.closed) {
        notepadWindow = window.open(url, "xlyneveMiniNotepad", "popup=yes,width=300,height=633,resizable=yes,scrollbars=no,location=no,toolbar=no,menubar=no,status=no");
      }
      notepadWindow?.focus();
    }]
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.onclick = () => { closeChoices(); action(); };
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
  launcher.addEventListener("click", toggleChoices);
  launcher.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleChoices();
  });
  document.addEventListener("pointerdown", event => {
    if (!choices.contains(event.target) && !launcher.contains(event.target)) closeChoices();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !choices.hidden) { closeChoices(); launcher.focus(); }
  });
  window.addEventListener("resize", () => {
    closeChoices();
    if (panel && !panel.hidden) movePanel(panel.offsetLeft, panel.offsetTop);
  });
})();
