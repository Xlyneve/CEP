(function () {
  "use strict";

  const storageKey = "xlyneve-mini-notepad";
  const note = document.getElementById("notepad");
  let saveTimer = 0;

  try {
    note.value = localStorage.getItem(storageKey) || "";
  } catch {
    // The notepad remains usable when storage is unavailable.
  }

  function save() {
    window.clearTimeout(saveTimer);
    try {
      localStorage.setItem(storageKey, note.value);
    } catch {
      // Avoid interrupting typing if the browser blocks or fills storage.
    }
  }

  note.addEventListener("input", () => {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(save, 180);
  });
  window.addEventListener("pagehide", save);
  note.focus();
})();
