// emoji.js
(() => {
  const emojiData = [
    { name: 'arrowR', symbol: '↪' },
    { name: 'arrowL', symbol: '↩' },
    { name: 'right', symbol: '➜' },
    { name: 'left', symbol: '←' },
    { name: 'up', symbol: '⤴' },
    { name: 'down', symbol: '⤵' },
    { name: 'dd', symbol: '⤹' },
    { name: 'll', symbol: '⤶' },
    { name: 'tick', symbol: '✅' },
    { name: 'alert', symbol: '⚠️' },
    { name: 'med', symbol: '💊' },
    { name: 'blood', symbol: '🩸' },
    { name: 'stet', symbol: '🩺' },
    // ...paste your full list here...
    { name: 'female', symbol: '♀️' },
  ];

  function ensureEmojiUI() {
    // If already present (you pasted the snippet), don't duplicate it.
    if (document.getElementById("emojiModal") && document.getElementById("emojiSearchIcon")) return;

    const btn = document.createElement("button");
    btn.id = "emojiSearchIcon";
    btn.className = "emojiFab emojiFabDots";
    btn.type = "button";
    btn.setAttribute("aria-label", "Open emoji picker");

    const modal = document.createElement("div");
    modal.id = "emojiModal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="emojiHeader">
        <div class="emojiTitle">Emojis</div>
        <button class="emojiClose" type="button" aria-label="Close">✕</button>
      </div>
      <div id="emojiGrid" class="emojiGrid" role="list"></div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(modal);
  }

  function initEmojiPicker() {
    const emojiModal = document.getElementById("emojiModal");
    const emojiGrid  = document.getElementById("emojiGrid");
    const emojiIcon  = document.getElementById("emojiSearchIcon");
    const emojiClose = document.querySelector(".emojiClose");

    if (!emojiModal || !emojiGrid || !emojiIcon || !emojiClose) return;

    const openEmoji = () => {
      emojiModal.classList.add("open");
      emojiModal.setAttribute("aria-hidden", "false");
    };
    const closeEmoji = () => {
      emojiModal.classList.remove("open");
      emojiModal.setAttribute("aria-hidden", "true");
    };
    const toggleEmoji = () => emojiModal.classList.contains("open") ? closeEmoji() : openEmoji();

    emojiGrid.innerHTML = emojiData.map(e =>
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

    emojiGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".emojiBtn");
      if (!btn) return;

      const emoji = btn.getAttribute("data-emoji") || btn.textContent;

      navigator.clipboard.writeText(emoji).then(() => {
        btn.style.transform = "scale(1.06)";
        setTimeout(() => btn.style.transform = "", 120);
      }).catch(() => {
        window.prompt("Copy emoji:", emoji);
      });
    });

    document.addEventListener("click", (e) => {
      if (!emojiModal.classList.contains("open")) return;
      if (emojiModal.contains(e.target)) return;
      closeEmoji();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeEmoji();
    });
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      ensureEmojiUI();
      initEmojiPicker();
    });
  } else {
    ensureEmojiUI();
    initEmojiPicker();
  }
})();
