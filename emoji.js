// emoji.js (complete, auto-inject, minimalist, safe)
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
    { name: 'tick',   symbol: '✅' },
    { name: 'alert',  symbol: '⚠️' },
    { name: 'med',    symbol: '💊' },
    { name: 'blood',  symbol: '🩸' },
    { name: 'stet',   symbol: '🩺' },
    { name: 'female', symbol: '♀️' },
  ];

  const IDS = { btn: "emojiSearchIcon", modal: "emojiModal", grid: "emojiGrid" };
  const FLAG = "__emojiPickerInitialized__";

  function ensureEmojiUI() {
    if (!document.getElementById(IDS.btn)) {
      const btn = document.createElement("button");
      btn.id = IDS.btn;
      btn.className = "emojiFab emojiFabDots";
      btn.type = "button";
      btn.setAttribute("aria-label", "Emoji picker");
      document.body.appendChild(btn);
    }

    if (!document.getElementById(IDS.modal)) {
      const modal = document.createElement("div");
      modal.id = IDS.modal;
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="emojiHeader">
          <div class="emojiTitle" style="display:none;"></div>
          <button class="emojiClose" type="button" aria-label="Close">✕</button>
        </div>
        <div id="${IDS.grid}" class="emojiGrid" role="list"></div>
      `;
      document.body.appendChild(modal);
    }
  }

  function initEmojiPicker() {
    if (window[FLAG]) return;
    window[FLAG] = true;

    const emojiModal = document.getElementById(IDS.modal);
    const emojiGrid  = document.getElementById(IDS.grid);
    const emojiIcon  = document.getElementById(IDS.btn);
    const emojiClose = emojiModal?.querySelector(".emojiClose");

    if (!emojiModal || !emojiGrid || !emojiIcon || !emojiClose) return;

    const isOpen = () => emojiModal.classList.contains("open");

    const openEmoji = () => {
      emojiModal.classList.add("open");
      emojiModal.setAttribute("aria-hidden", "false");
    };

    const closeEmoji = () => {
      emojiModal.classList.remove("open");
      emojiModal.setAttribute("aria-hidden", "true");
    };

    const toggleEmoji = () => (isOpen() ? closeEmoji() : openEmoji());

    emojiGrid.innerHTML = EMOJI_DATA.map(e =>
      `<button class="emojiBtn" type="button" title="${e.name}" aria-label="${e.name}" data-emoji="${e.symbol}">${e.symbol}</button>`
    ).join("");

    emojiIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleEmoji();
    });

    emojiClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeEmoji();
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
    });

    // click outside closes (only emoji)
    document.addEventListener("click", (e) => {
      if (!isOpen()) return;
      if (emojiModal.contains(e.target)) return;
      if (emojiIcon.contains(e.target)) return;
      closeEmoji();
    });

    // Escape closes emoji ONLY
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!isOpen()) return;
      closeEmoji();
    });
  }

  function boot() {
    ensureEmojiUI();
    initEmojiPicker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
