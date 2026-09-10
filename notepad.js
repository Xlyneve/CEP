(function () {
  "use strict";

  const storageKey = "xlyneve-mini-notepad";
  const notesElement = document.getElementById("notes");
  const addButton = document.getElementById("addNote");
  let saveTimer = 0;
  let notes = loadNotes();

  function createId() {
    return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function newNote(value) {
    return { id: createId(), value: value || "", createdAt: new Date().toISOString() };
  }

  function loadNotes() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return [newNote("")];

      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          const restored = parsed.map((item) => ({
            id: item.id || createId(),
            value: typeof item.value === "string" ? item.value : "",
            createdAt: item.createdAt || new Date().toISOString()
          })).filter((item) => item.value.trim());
          return restored.length ? restored : [newNote("")];
        }
      } catch {
        // Older versions stored one plain-text note; preserve it as the first pad.
      }

      return [newNote(saved)];
    } catch {
      return [newNote("")];
    }
  }

  function save() {
    window.clearTimeout(saveTimer);
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
      return true;
    } catch {
      // Keep every pad usable when storage is unavailable.
      return false;
    }
  }

  function formatStamp(value) {
    const date = new Date(value);
    return date.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function resizeNote(textarea) {
    const scrollTop = notesElement.scrollTop;
    textarea.style.height = "0px";
    textarea.style.height = Math.max(90, textarea.scrollHeight) + "px";
    notesElement.scrollTop = scrollTop;
  }

  function render(focusLast) {
    notesElement.replaceChildren();

    notes.forEach((note, index) => {
      const card = document.createElement("section");
      card.className = "note-card";

      const textarea = document.createElement("textarea");
      textarea.className = "notepad";
      textarea.value = note.value;
      textarea.placeholder = "freely type anything...";
      textarea.setAttribute("aria-label", `Note ${index + 1}`);
      textarea.addEventListener("input", () => {
        note.value = textarea.value;
        resizeNote(textarea);
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(save, 180);
      });
      textarea.addEventListener("blur", () => {
        window.setTimeout(() => {
          if (note.value.trim() || notes.length === 1) return;
          notes = notes.filter((item) => item.id !== note.id);
          card.remove();
          save();
        }, 80);
      });

      const stamp = document.createElement("time");
      stamp.className = "timestamp";
      stamp.dateTime = note.createdAt;
      stamp.textContent = formatStamp(note.createdAt);

      card.append(textarea, stamp);
      notesElement.append(card);
      resizeNote(textarea);
    });

    const target = focusLast
      ? notesElement.querySelector(".note-card:last-child .notepad")
      : notesElement.querySelector(".notepad");
    target?.focus();
    if (focusLast) target?.closest(".note-card")?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  addButton.addEventListener("click", () => {
    notes.push(newNote(""));
    save();
    render(true);
  });

  function moveNotepad(newWindow) {
    const status = document.getElementById("openStatus");
    status.hidden = true;
    // Flush the typing debounce before the destination reads the saved notes.
    if (!save()) {
      status.textContent = "Your browser could not save these notes. Please copy them before opening another view.";
      status.hidden = false;
      return;
    }
    const destination = new URL(location.href);
    destination.searchParams.set("v", "20260911-2");
    const opened = newWindow
      ? window.open(destination.href, "_blank", "popup=yes,width=900,height=760,resizable=yes,scrollbars=yes")
      : window.open(destination.href, "_blank");
    if (!opened) {
      status.textContent = "The browser blocked the new view. Allow popups for this site and try again.";
      status.hidden = false;
      return;
    }
    opened.focus();
    // Script-opened notepads can close themselves; a directly visited page stays open.
    if (window.opener) window.close();
  }
  document.getElementById("openNewTab").addEventListener("click", () => moveNotepad(false));
  document.getElementById("openNewWindow").addEventListener("click", () => moveNotepad(true));

  let previousWidth = 0;
  let resizeFrame = 0;
  const resizeNotes = () => {
    const width = notesElement.clientWidth;
    if (width === previousWidth) return;
    previousWidth = width;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      notesElement.querySelectorAll(".notepad").forEach(resizeNote);
    });
  };
  if (window.ResizeObserver) new ResizeObserver(resizeNotes).observe(notesElement);
  else window.addEventListener("resize", resizeNotes);

  window.addEventListener("pagehide", save);
  render(false);
})();
