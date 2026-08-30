(function () {
  "use strict";

  const launcher = document.querySelector(".pageTitle");
  if (!launcher) return;

  const windowName = "xlyneveMiniNotepad";
  let notepadWindow = null;

  function openNotepad() {
    if (notepadWindow && !notepadWindow.closed) {
      notepadWindow.focus();
      return;
    }

    notepadWindow = window.open(
      "notepad.html?v=20260830-3",
      windowName,
      "popup=yes,width=633,height=439,resizable=yes,scrollbars=no,location=no,toolbar=no,menubar=no,status=no"
    );
    notepadWindow?.focus();
  }

  launcher.addEventListener("click", openNotepad);
  launcher.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openNotepad();
  });
})();
