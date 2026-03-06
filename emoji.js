// emoji.js (insert at cursor instead of copy/paste)
(() => {
  const EMOJI_DATA = [
    { name: 'arrowR', symbol: '↪' },
    { name: 'arrowL', symbol: '↩' },
    { name: 'right',  symbol: '➜' },
    { name: 'left',   symbol: '←' },
    { name: 'up',     symbol: '⤴' },
    { name: 'down',   symbol: '⤵' },
    { name: 'dd',     symbol: '⤹' },
    { name: 'll',     symbol: '⤶' },
    { name: 'box',    symbol: '☐' },
    { name: 'tick',   symbol: '✔️' },
    { name: 'alert',  symbol: '⚠️' },
    { name: 'med',    symbol: '💊' },
    { name: 'blood',  symbol: '🩸' },
    { name: 'stet',   symbol: '🩺' },
    { name: 'female', symbol: '♀️' },
    { name: 'male',   symbol: '♂️' },
    { name: 'email',  symbol: '🌐' },
    { name: 'phone',  symbol: '☎️' },
  ];

  const IDS  = { btn: "emojiSearchIcon", modal: "emojiModal", grid: "emojiGrid" };
  const FLAG = "__emojiPickerInitialized__";

  let lastRange = null;
  let lastInput = null;

  function nukeOldCloseUI() {
    document
      .querySelectorAll(".emojiClose, .emojiHeader, .emojiTitle")
      .forEach(el => el.remove());
  }

  function ensureEmojiUI() {
    nukeOldCloseUI();

    let btn = document.getElementById(IDS.btn);
    if (!btn) {
      btn = document.createElement("button");
      btn.id = IDS.btn;
      btn.className = "emojiFab emojiFabDots";
      btn.type = "button";
      btn.setAttribute("aria-label", "Emoji picker");
      document.body.appendChild(btn);
    }

    let modal = document.getElementById(IDS.modal);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = IDS.modal;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `<div id="${IDS.grid}" class="emojiGrid" role="list"></div>`;
    modal.setAttribute("aria-hidden", "true");
    modal.inert = true;

    nukeOldCloseUI();
  }

  function renderEmojiGrid(emojiGrid) {
    if (!emojiGrid) return;

    emojiGrid.innerHTML = EMOJI_DATA.map(e =>
      `<button class="emojiBtn" type="button"
        title="${e.name}" aria-label="${e.name}"
        data-emoji="${e.symbol}">${e.symbol}</button>`
    ).join("");
  }

  function isEditable(el) {
    if (!el) return false;
    return (
      el.isContentEditable ||
      el.tagName === "TEXTAREA" ||
      (el.tagName === "INPUT" &&
        /^(text|search|url|tel|password|email)$/i.test(el.type || "text"))
    );
  }

  function saveSelection() {
    const active = document.activeElement;

    if (isEditable(active)) {
      lastInput = active;
    }

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (!range) return;

    let node = range.commonAncestorContainer;
    if (node.nodeType === 3) node = node.parentNode;

    if (node && node.closest) {
      const editableParent = node.closest('[contenteditable="true"]');
      if (editableParent) {
        lastRange = range.cloneRange();
      }
    }
  }

  function insertIntoContenteditable(emoji, target) {
    target.focus();

    const sel = window.getSelection();
    sel.removeAllRanges();

    if (lastRange) {
      sel.addRange(lastRange);
    }

    if (!sel.rangeCount) return false;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);

    lastRange = range.cloneRange();

    target.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }

  function insertIntoInputOrTextarea(emoji, target) {
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const value = target.value ?? "";

    target.value = value.slice(0, start) + emoji + value.slice(end);

    const newPos = start + emoji.length;
    target.focus();
    target.setSelectionRange(newPos, newPos);

    target.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }

  function insertEmojiAtCursor(emoji) {
    // 1. Prefer your app's activeEditable if it exists
    const preferred =
      window.activeEditable ||
      lastInput ||
      document.activeElement;

    if (preferred && preferred.isContentEditable) {
      return insertIntoContenteditable(emoji, preferred);
    }

    if (preferred && (
      preferred.tagName === "TEXTAREA" ||
      (preferred.tagName === "INPUT" &&
       /^(text|search|url|tel|password|email)$/i.test(preferred.type || "text"))
    )) {
      return insertIntoInputOrTextarea(emoji, preferred);
    }

    // 2. Fallback: try saved contenteditable range
    if (lastRange) {
      let node = lastRange.commonAncestorContainer;
      if (node.nodeType === 3) node = node.parentNode;

      const editableParent = node && node.closest
        ? node.closest('[contenteditable="true"]')
        : null;

      if (editableParent) {
        return insertIntoContenteditable(emoji, editableParent);
      }
    }

    return false;
  }

  function initEmojiPicker() {
    const emojiModal = document.getElementById(IDS.modal);
    const emojiIcon  = document.getElementById(IDS.btn);
    const emojiGrid  = emojiModal ? emojiModal.querySelector(`#${IDS.grid}`) : null;

    if (!emojiModal || !emojiGrid || !emojiIcon) return;

    renderEmojiGrid(emojiGrid);

    if (window[FLAG]) return;
    window[FLAG] = true;

    const isOpen = () => emojiModal.classList.contains("open");

    const openEmoji = () => {
      nukeOldCloseUI();
      saveSelection(); // save caret before picker steals focus
      emojiModal.classList.add("open");
      emojiModal.setAttribute("aria-hidden", "false");
      emojiModal.inert = false;
    };

    const closeEmoji = () => {
      emojiModal.classList.remove("open");
      emojiModal.setAttribute("aria-hidden", "true");
      emojiModal.inert = true;
    };

    const toggleEmoji = () => (isOpen() ? closeEmoji() : openEmoji());

    // Keep track of caret while user types/clicks
    document.addEventListener("selectionchange", () => {
      saveSelection();
    });

    document.addEventListener("focusin", () => {
      saveSelection();
    });

    emojiIcon.addEventListener("mousedown", (e) => {
      // prevent button from stealing caret before we save/use it
      e.preventDefault();
    });

    emojiIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleEmoji();
    });

    emojiGrid.addEventListener("mousedown", (e) => {
      e.preventDefault(); // keep existing caret
    });

    emojiGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".emojiBtn");
      if (!btn) return;

      const emoji = btn.getAttribute("data-emoji") || btn.textContent || "";
      if (!emoji) return;

      const inserted = insertEmojiAtCursor(emoji);

      btn.style.transform = "scale(1.06)";
      setTimeout(() => (btn.style.transform = ""), 120);

      if (!inserted) {
        console.warn("No editable field/cursor found for emoji insertion.");
      }

      // optional auto-close
      // closeEmoji();
    });

    document.addEventListener("click", (e) => {
      if (!isOpen()) return;
      if (emojiModal.contains(e.target)) return;
      if (emojiIcon.contains(e.target)) return;
      closeEmoji();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!isOpen()) return;
      closeEmoji();
    });
  }

  function boot() {
    nukeOldCloseUI();
    ensureEmojiUI();
    initEmojiPicker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
