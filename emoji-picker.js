// emoji-picker.js


let savedRange = null;
let pickerWrapper = null;
let activeTextField = null;
let activeStart = 0;
let activeEnd = 0;

const RECENT_KEY = "recentEmojiSymbols";
const RECENT_LIMIT = 14;

let recentItems = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");

const emojiGroups = {
  "Clinical": [
    "🩺", "💊", "💉", "🩹", "🧪", "🧬", "🦠", "🩸",
    "🫁", "🫀", "🧠", "🦷", "👁", "👂", "👃", "👄",
    "🦴", "😷", "🤒", "🤧", "🤮", "🤕", "🥵", "🥶",
    "🌡", "🚑", "🏥", "⚕", "♿"
  ],

  "Travel": [
    "✈", "🛫", "🛬", "🧳", "🎒", "🛂", "🛃", "🛅",
    "🌍", "🌎", "🌏", "🗺", "📍", "📌", "🏨", "🏝",
    "🏖", "⛱", "🚗", "🚕", "🚌", "🚆", "🚢", "🛳",
    "🛟", "🪪", "💳", "💵", "💰", "📅", "🕒", "⏰"
  ],

  "Contact / Website": [
    "☎", "☏", "📞", "📱", "📲", "✉", "📧", "📨",
    "🌐", "🔗", "🖥", "💻", "⌨", "🖱", "🔍", "📡",
    "📤", "📥", "📎", "📁", "📂", "🗂", "📋", "📝"
  ],

  "Login / Password": [
    "👤", "👥", "🪪", "🔐", "🔒", "🔓", "🔑", "🗝",
    "🛡", "✅", "☑", "✔", "❌", "✖", "⚠", "‼",
    "⁉", "❗", "❓", "🔁", "🔄", "📌", "📍", "📝"
  ],

  "Faces": [
    "😀", "😃", "😄", "😁", "🙂", "😊", "😅", "😂",
    "🤣", "😌", "😍", "🥰", "😎", "🤔", "😐", "😬",
    "🙄", "😴", "😢", "😭", "😡", "😳", "😱", "😵",
    "🤢", "🤮", "🤧", "🥴"
  ],

  "Hands": [
    "👍", "👎", "👌", "✌", "🤞", "👏", "🙌", "🙏",
    "👋", "🤚", "✋", "☝", "👆", "👇", "👈", "👉",
    "✍", "🤝"
  ],

  "Hearts / Colour": [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "🤎",
    "🖤", "💕", "💖", "💗", "💓", "💔", "❣", "♥",
    "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪"
  ],

  "Arrows": [
    "→", "←", "↑", "↓", "↔", "↕", "↩", "↪",
    "➜", "➤", "➔", "➙", "➝", "➞", "⇒", "⇐",
    "⇧", "⇩", "⬅", "➡", "⬆", "⬇", "🔼", "🔽",
    "⏪", "⏩", "⏫", "⏬"
  ],

  "Ticks / Boxes": [
    "☐", "☑", "☒", "✓", "✔", "✅", "✕", "✖",
    "✗", "✘", "❌", "⭕", "○", "●", "◯", "◉",
    "◎", "◌", "□", "■", "◇", "◆", "▫", "▪"
  ],

  "Most Symbols": [
    "•", "◦", "▪", "▫", "▸", "▹", "▾", "▿",
    "★", "☆", "✦", "✧", "✩", "⚠", "‼", "⁉",
    "❗", "❓", "°", "℃", "℉", "±", "×", "÷",
    "≈", "≠", "≤", "≥", "µ", "Ω", "∞", "∴",
    "∵", "∆", "∑", "§", "¶", "©", "®", "™",
    "#", "@", "&", "%", "$", "£", "€", "¥",
    "+", "-", "=", "/", "\\", "|", "_", "~",
    "^", "*", ":", ";", "'", "\"", "`"
  ],

  "Keyboard / UI": [
    "⌘", "⌥", "⌃", "⇧", "⏎", "⌫", "⌦", "␣",
    "⎋", "↵", "⇥", "⇤", "⭾", "⏻", "⏸", "▶",
    "⏹", "⏺", "🔎", "⚙", "🧭", "📶", "🔋", "🔌"
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  createEmojiSymbolPicker();
});

function addToRecent(item) {
  recentItems = recentItems.filter(x => x !== item);
  recentItems.unshift(item);
  recentItems = recentItems.slice(0, RECENT_LIMIT);

  localStorage.setItem(RECENT_KEY, JSON.stringify(recentItems));
  renderRecentItems();
}

function renderRecentItems() {
  const recentGrid = document.getElementById("recentGrid");
  const recentSection = document.getElementById("recentSection");

  if (!recentGrid || !recentSection) return;

  recentGrid.innerHTML = "";

  if (recentItems.length === 0) {
    recentSection.style.display = "none";
    return;
  }

  recentSection.style.display = "block";

  recentItems.forEach(item => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = item;

    btn.style.cssText = `
      border: none;
      background: transparent;
      border-radius: 6px;
      width: 100%;
      height: 30px;
      padding: 0;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      text-align: center;
      font-family: Tahoma, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    btn.addEventListener("mouseenter", () => {
      btn.style.background = "rgba(180,180,180,0.12)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.background = "transparent";
    });

    btn.addEventListener("click", () => {
      insertAtCursor(item);
      addToRecent(item);
      hideEmojiPicker();
    });

    recentGrid.appendChild(btn);
  });
}

function createEmojiSymbolPicker() {
  if (document.getElementById("emojiPickerWrapper")) return;

  pickerWrapper = document.createElement("div");
  pickerWrapper.id = "emojiPickerWrapper";

pickerWrapper.innerHTML = `
  <div id="recentSection">
    <div id="recentHeader">Recently used</div>
    <div id="recentGrid"></div>
  </div>

  <div id="categoryTabs"></div>

  <div id="symbolSection">
    <div id="symbolHeader">Clinical</div>
    <div id="symbolGrid"></div>
  </div>
`;
  
  pickerWrapper.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 20px;
  z-index: 999999;
  display: none;
  width: min(380px, 94vw);
  max-height: min(720px, 90vh);
  overflow-y: auto;
  overflow-x: hidden;

  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.08)
  );

  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);

  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 22px;

  box-shadow:
    0 18px 45px rgba(80, 60, 130, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12);

  scrollbar-width: thin;
  scrollbar-color: rgba(170, 155, 210, 0.45) transparent;
`;

  document.body.appendChild(pickerWrapper);

  const pickerGlassStyle = document.createElement("style");
pickerGlassStyle.textContent = `
  #emojiPickerWrapper::-webkit-scrollbar,
  #symbolGrid::-webkit-scrollbar {
    width: 8px;
  }

  #emojiPickerWrapper::-webkit-scrollbar-track,
  #symbolGrid::-webkit-scrollbar-track {
    background: transparent;
  }

  #emojiPickerWrapper::-webkit-scrollbar-thumb,
  #symbolGrid::-webkit-scrollbar-thumb {
    background: rgba(170, 155, 210, 0.38);
    border-radius: 999px;
    border: 2px solid rgba(255,255,255,0.35);
  }

  #emojiPickerWrapper emoji-picker {
    --background: rgba(255,255,255,0.28);
    --border-color: transparent;
    --category-emoji-padding: 4px;
    --emoji-padding: 6px;
    --indicator-color: rgba(160, 130, 220, 0.75);
    --input-border-color: rgba(255,255,255,0.5);
    --input-font-color: #555;
    --input-placeholder-color: #888;
    --outline-color: rgba(190,170,230,0.6);
  }
`;
document.head.appendChild(pickerGlassStyle);

  const recentSection = pickerWrapper.querySelector("#recentSection");
const recentHeader = pickerWrapper.querySelector("#recentHeader");
const recentGrid = pickerWrapper.querySelector("#recentGrid");

const symbolSection = pickerWrapper.querySelector("#symbolSection");
const symbolHeader = pickerWrapper.querySelector("#symbolHeader");
const symbolGrid = pickerWrapper.querySelector("#symbolGrid");
const categoryTabs = pickerWrapper.querySelector("#categoryTabs");
let activeCategory = "Clinical";

  recentSection.style.cssText = `
  padding: 10px 10px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

recentHeader.style.cssText = `
  font-family: Tahoma, Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #555;
`;

recentGrid.style.cssText = `
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  min-height: 30px;
`;

  categoryTabs.style.cssText = `
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
  overflow-x: hidden;
  overflow-y: visible;
  border-bottom: 1px solid rgba(255, 255, 255, 0.38);
background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;
  
  symbolSection.style.cssText = `
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

  symbolHeader.style.cssText = `
    font-family: Tahoma, Arial, sans-serif;
    font-size: 10px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #555;
  `;

  symbolGrid.style.cssText = `
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  max-height: 230px;
  overflow-y: auto;
  padding-right: 2px;
`;

  function renderCategory(categoryName) {
  activeCategory = categoryName;
  symbolHeader.textContent = categoryName;
  symbolGrid.innerHTML = "";

  emojiGroups[categoryName].forEach(symbol => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = symbol;

    btn.style.cssText = `
      border: none;
      background: transparent;
      border-radius: 8px;
      width: 100%;
      height: 36px;
      padding: 0;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      text-align: center;
      font-family: Tahoma, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    btn.addEventListener("mouseenter", () => {
      btn.style.background = "rgba(210, 195, 255, 0.28)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.background = "transparent";
    });

    btn.addEventListener("click", () => {
      insertAtCursor(symbol);
      addToRecent(symbol);
      hideEmojiPicker();
    });

    symbolGrid.appendChild(btn);
  });
}

Object.keys(emojiGroups).forEach(categoryName => {
  const tab = document.createElement("button");
  tab.type = "button";
  tab.textContent = categoryName;

  tab.style.cssText = `
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.12);
  color: #4b4260;
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 10.5px;
  font-family: Tahoma, Arial, sans-serif;
  white-space: nowrap;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.35),
    0 2px 8px rgba(120,100,160,0.08);
  flex: 0 0 auto;
`;

  tab.addEventListener("click", () => {
    renderCategory(categoryName);

    [...categoryTabs.querySelectorAll("button")].forEach(btn => {
      btn.style.background = "rgba(255,255,255,0.32)";
      btn.style.color = "#555";
      btn.style.fontWeight = "normal";
    });

   tab.style.background = "rgba(255, 255, 255, 0.26)";
   tab.style.color = "#3f3260";
   tab.style.fontWeight = "bold";
  });

  categoryTabs.appendChild(tab);
});

renderCategory(activeCategory);

const firstTab = categoryTabs.querySelector("button");
if (firstTab) {
  firstTab.style.background = "rgba(210, 195, 255, 0.38)";
  firstTab.style.color = "#3f3260";
  firstTab.style.fontWeight = "bold";
}

  
  renderRecentItems();
}

// Save cursor position
document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const active = document.activeElement;

  if (
    active &&
    (
      active.tagName === "TEXTAREA" ||
      active.tagName === "INPUT" ||
      active.isContentEditable
    )
  ) {
    savedRange = selection.getRangeAt(0).cloneRange();
  }
});

// Keyboard shortcut:
// Mac: Command + Shift + E or Control + Shift + E
// Windows: Ctrl + Shift + E
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === "e") {
    e.preventDefault();
    toggleEmojiPicker();
  }

  if (e.key === "Escape") {
    hideEmojiPicker();
  }
});

function toggleEmojiPicker() {
  if (!pickerWrapper) {
    console.log("Emoji picker not loaded yet.");
    return;
  }

  pickerWrapper.style.display =
    pickerWrapper.style.display === "none" ? "block" : "none";
}

function hideEmojiPicker() {
  if (pickerWrapper) {
    pickerWrapper.style.display = "none";
  }
}

function insertAtCursor(text) {
  const active = document.activeElement;

  // Use currently focused textarea/input if available
  if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
    activeTextField = active;
    activeStart = active.selectionStart || 0;
    activeEnd = active.selectionEnd || 0;
  }

  // Textarea/input insertion
  if (activeTextField && (activeTextField.tagName === "TEXTAREA" || activeTextField.tagName === "INPUT")) {
    activeTextField.focus();

    const start = activeStart;
    const end = activeEnd;

    activeTextField.setRangeText(text, start, end, "end");

    activeStart = activeTextField.selectionStart;
    activeEnd = activeTextField.selectionEnd;

    // VERY IMPORTANT: triggers your homecal saveCalendar listener
    activeTextField.dispatchEvent(new Event("input", { bubbles: true }));

    return;
  }

  // contenteditable insertion
  if (savedRange) {
    const selection = window.getSelection();

    selection.removeAllRanges();
    selection.addRange(savedRange);

    savedRange.deleteContents();

    const textNode = document.createTextNode(text);
    savedRange.insertNode(textNode);

    savedRange.setStartAfter(textNode);
    savedRange.setEndAfter(textNode);

    selection.removeAllRanges();
    selection.addRange(savedRange);

    const editableParent = getEditableParent(textNode);

    if (editableParent) {
      editableParent.focus();
      editableParent.dispatchEvent(new Event("input", { bubbles: true }));
    }

    return;
  }

  console.log("Click inside a text box first, then choose a symbol or emoji.");
}

function saveActiveTextField(el) {
  if (!el) return;

  if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
    activeTextField = el;

    activeStart =
      typeof el.selectionStart === "number" ? el.selectionStart : el.value.length;

    activeEnd =
      typeof el.selectionEnd === "number" ? el.selectionEnd : el.value.length;
  }
}


document.addEventListener("focusin", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
    saveActiveTextField(e.target);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
    saveActiveTextField(e.target);
  }
});

document.addEventListener("keyup", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
    saveActiveTextField(e.target);
  }
});

document.addEventListener("mouseup", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
    saveActiveTextField(e.target);
  }
});

document.addEventListener("input", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
    saveActiveTextField(e.target);
  }
});

document.addEventListener("select", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
    saveActiveTextField(e.target);
  }
});

function getEditableParent(node) {
  let current = node.parentNode;

  while (current) {
    if (current.isContentEditable) return current;
    current = current.parentNode;
  }

  return null;
}

// Close picker when clicking outside it
document.addEventListener("click", (e) => {
  if (!pickerWrapper) return;

  const clickedInsidePicker = pickerWrapper.contains(e.target);

  if (!clickedInsidePicker) {
    hideEmojiPicker();
  }
});
