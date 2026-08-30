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
    } catch {
      // Keep every pad usable when storage is unavailable.
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

  window.addEventListener("pagehide", save);
  render(false);
})();
