// emoji.js (complete, auto-inject, minimalist, NO close button)
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

  function nukeOldCloseUI() {
    document
      .querySelectorAll(".emojiClose, .emojiHeader, .emojiTitle")
      .forEach(el => el.remove());
  }

  function ensureEmojiUI() {
    nukeOldCloseUI();

    // Button
    let btn = document.getElementById(IDS.btn);
    if (!btn) {
      btn = document.createElement("button");
      btn.id = IDS.btn;
      btn.className = "emojiFab emojiFabDots";
      btn.type = "button";
      btn.setAttribute("aria-label", "Emoji picker");
      document.body.appendChild(btn);
    }

    // Modal
    let modal = document.getElementById(IDS.modal);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = IDS.modal;
      document.body.appendChild(modal);
    }

    // Force modal to ONLY grid (wipes any leftover X/header inside modal)
    modal.innerHTML = `<div id="${IDS.grid}" class="emojiGrid" role="list"></div>`;

    // Accessibility defaults (closed)
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

  function initEmojiPicker() {
    const emojiModal = document.getElementById(IDS.modal);
    const emojiIcon  = document.getElementById(IDS.btn);
    const emojiGrid  = emojiModal ? emojiModal.querySelector(`#${IDS.grid}`) : null;

    if (!emojiModal || !emojiGrid || !emojiIcon) return;

    // Always re-render so new emojis appear immediately
    renderEmojiGrid(emojiGrid);

    // Only attach listeners once
    if (window[FLAG]) return;
    window[FLAG] = true;

    const isOpen = () => emojiModal.classList.contains("open");

    const openEmoji = () => {
      nukeOldCloseUI();
      emojiModal.classList.add("open");
      emojiModal.setAttribute("aria-hidden", "false");
      emojiModal.inert = false;
    };

    const closeEmoji = () => {
      // IMPORTANT: move focus OUT before hiding from AT (fixes the console warning)
      if (emojiModal.contains(document.activeElement)) {
        emojiIcon.focus({ preventScroll: true });
      }

      emojiModal.classList.remove("open");
      emojiModal.setAttribute("aria-hidden", "true");
      emojiModal.inert = true;
    };

    const toggleEmoji = () => (isOpen() ? closeEmoji() : openEmoji());

    emojiIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleEmoji();
    });

    emojiGrid.addEventListener("click", async (e) => {
      const btn = e.target.closest(".emojiBtn");
      if (!btn) return;

      const emoji = btn.getAttribute("data-emoji") || btn.textContent || "";
      if (!emoji) return;

      try {
        await navigator.clipboard.writeText(emoji);
        btn.style.transform = "scale(1.06)";
        setTimeout(() => (btn.style.transform = ""), 120);
      } catch {
        window.prompt("Copy:", emoji);
      }

      // optional auto-close after selecting:
      // closeEmoji();
    });

    // Click outside closes
    document.addEventListener("click", (e) => {
      if (!isOpen()) return;
      if (emojiModal.contains(e.target)) return;
      if (emojiIcon.contains(e.target)) return;
      closeEmoji();
    });

    // Escape closes
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!isOpen()) return;
      closeEmoji();
    });
  }

  function boot() {
    // CHANGED: nuke first, then build UI
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
