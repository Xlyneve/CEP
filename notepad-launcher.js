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
    .homepage-notepad { position:fixed; z-index:10000; width:min(320px, calc(100vw - 16px)); height:min(340px, calc(100dvh - 16px)); overflow:hidden; border-radius:14px; background:white; box-shadow:0 12px 36px #39263730; }
    .homepage-notepad iframe { display:block; width:100%; height:100%; border:0; background:white; }
    .homepage-notepad-close, .homepage-notepad-resize { position:absolute; z-index:2; border:0; background:transparent; color:#777; cursor:pointer; }
    .homepage-notepad-close { top:6px; right:8px; width:26px; height:26px; font:20px system-ui; opacity:0; transition:opacity .15s; }
    .homepage-notepad:hover .homepage-notepad-close, .homepage-notepad-close:focus-visible { opacity:1; }
    .homepage-notepad-resize { right:0; bottom:0; width:24px; height:24px; cursor:nwse-resize; touch-action:none; }
    .homepage-notepad-resize::after { content:""; position:absolute; right:6px; bottom:6px; width:8px; height:8px; border-right:2px solid #bbb; border-bottom:2px solid #bbb; }
    @media (hover:none) { .homepage-notepad-close { opacity:1; } }
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
      panel.querySelector("iframe").contentDocument?.querySelector(".dot-yellow")?.focus();
      return;
    }
    panel = document.createElement("section");
    panel.className = "homepage-notepad";
    panel.setAttribute("aria-label", "Homepage notepad");
    const close = document.createElement("button");
    close.className = "homepage-notepad-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close homepage notepad");
    close.onclick = () => { panel.hidden = true; launcher.focus(); };
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
        handle.addEventListener(name, () => { gesture = null; });
      }
      handle.addEventListener("keydown", event => {
        const delta = { ArrowLeft:[-16,0], ArrowRight:[16,0], ArrowUp:[0,-16], ArrowDown:[0,16] }[event.key];
        if (!delta) return;
        event.preventDefault();
        if (resizing) sizePanel(panel.offsetWidth + delta[0], panel.offsetHeight + delta[1]);
        else movePanel(panel.offsetLeft + delta[0], panel.offsetTop + delta[1]);
      });
    }
    frame.addEventListener("load", () => {
      const doc = frame.contentDocument;
      const embeddedStyle = doc.createElement("style");
      embeddedStyle.textContent = `
        body { padding:0; background:white; }
        main { border:0; border-radius:0; background:white; box-shadow:none; }
        .notes { padding:36px 0 0; }
        .note-card { min-height:100%; margin:0; border:0; border-radius:0; box-shadow:none; }
        .timestamp { right:28px; }
        .dot-yellow { cursor:grab; touch-action:none; }
        .dot-yellow:active { cursor:grabbing; }
        .dot-yellow:focus-visible { outline:2px solid #ad8e20; outline-offset:4px; }
      `;
      doc.head.append(embeddedStyle);
      const handle = doc.createElement("button");
      handle.type = "button";
      handle.className = "dot dot-yellow";
      handle.setAttribute("aria-label", "Move notepad: drag or use arrow keys");
      handle.title = "Drag to move, or use arrow keys";
      doc.querySelector(".dot-yellow").replaceWith(handle);
      bindHandle(handle, false);
    });
    bindHandle(resize, true);
    panel.append(frame, close, resize);
    document.body.append(panel);
    movePanel(innerWidth - 344, 100);
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
    if (panel && !panel.hidden) {
      panel.style.width = Math.min(panel.offsetWidth, innerWidth - 16) + "px";
      panel.style.height = Math.min(panel.offsetHeight, innerHeight - 16) + "px";
      movePanel(panel.offsetLeft, panel.offsetTop);
    }
  });
})();
