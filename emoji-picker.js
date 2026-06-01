// emoji-picker.js

// Load external emoji picker library
const emojiScript = document.createElement("script");
emojiScript.type = "module";
emojiScript.src = "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";
document.head.appendChild(emojiScript);

let savedRange = null;
let pickerWrapper = null;
let emojiButton = null;

const symbols = [
  "➜", "➤", "➔", "➙", "➝", "➞", "→", "←", "↑", "↓",
  "↔", "↕", "⇄", "⇅", "⇒", "⇐", "⇧", "⇩", "↩", "↪",
  "✓", "✔", "☑", "✕", "✖", "✗", "✘",
  "•", "◦", "▪", "▫", "■", "□", "◆", "◇", "●", "○",
  "★", "☆", "✦", "✧", "✩", "⚠", "‼", "⁉",
  "°", "℃", "℉", "±", "×", "÷", "≈", "≠", "≤", "≥",
  "µ", "Ω", "∞", "∴", "∵", "∆", "∑",
  "⌘", "⌥", "⌃", "⇧", "⏎", "⌫", "⌦", "␣", "⎋",
  "♥", "♡", "♪", "♫", "☀", "☁", "☂", "☎", "✉", "⚡"
];

emojiScript.onload = () => {
  createEmojiSymbolPicker();
};

emojiScript.onerror = () => {
  console.error("Emoji picker failed to load. Check internet connection or CDN link.");
};

function createEmojiSymbolPicker() {
  if (document.getElementById("emojiPickerWrapper")) return;

  pickerWrapper = document.createElement("div");
  pickerWrapper.id = "emojiPickerWrapper";

  pickerWrapper.innerHTML = `
    <div id="symbolSection">
      <div id="symbolHeader">Symbols</div>
      <div id="symbolGrid"></div>
    </div>

    <emoji-picker></emoji-picker>
  `;

  pickerWrapper.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 999999;
    display: none;
    width: min(380px, 94vw);
    max-height: 620px;
    overflow: hidden;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.18);
  `;

  document.body.appendChild(pickerWrapper);

  const symbolSection = pickerWrapper.querySelector("#symbolSection");
  const symbolHeader = pickerWrapper.querySelector("#symbolHeader");
  const symbolGrid = pickerWrapper.querySelector("#symbolGrid");
  const emojiPicker = pickerWrapper.querySelector("emoji-picker");

  symbolSection.style.cssText = `
    padding: 10px;
    border-bottom: 1px solid rgba(180,180,180,0.25);
    background: rgba(255,255,255,0.96);
  `;

  symbolHeader.style.cssText = `
    font-family: Tahoma, Arial, sans-serif;
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #555;
  `;

  symbolGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
    max-height: 150px;
    overflow-y: auto;
  `;

  symbols.forEach(symbol => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = symbol;

    btn.style.cssText = `
      border: 1px solid rgba(180,180,180,0.3);
      background: rgba(255,255,255,0.85);
      border-radius: 8px;
      padding: 6px 2px;
      font-size: 20px;
      cursor: pointer;
      text-align: center;
      font-family: Tahoma, Arial, sans-serif;
    `;

    btn.addEventListener("click", () => {
      insertAtCursor(symbol);
      hideEmojiPicker();
    });

    symbolGrid.appendChild(btn);
  });

  emojiPicker.addEventListener("emoji-click", (event) => {
    insertAtCursor(event.detail.unicode);
    hideEmojiPicker();
  });

  createEmojiButton();
}

function createEmojiButton() {
  emojiButton = document.createElement("button");
  emojiButton.id = "emojiPickerButton";
  emojiButton.textContent = "😊";
  emojiButton.type = "button";
  emojiButton.title = "Open emoji and symbol picker";

  emojiButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: white;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    font-size: 24px;
    cursor: pointer;
  `;

  emojiButton.addEventListener("click", () => {
    toggleEmojiPicker();
  });

  document.body.appendChild(emojiButton);
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

// Shortcut:
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

  // Input or textarea
  if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
    const start = active.selectionStart;
    const end = active.selectionEnd;

    active.value =
      active.value.substring(0, start) +
      text +
      active.value.substring(end);

    active.selectionStart = active.selectionEnd = start + text.length;
    active.focus();

    active.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  // contenteditable
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

function getEditableParent(node) {
  let current = node.parentNode;

  while (current) {
    if (current.isContentEditable) return current;
    current = current.parentNode;
  }

  return null;
}

// Close picker when clicking outside it and outside the emoji button
document.addEventListener("click", (e) => {
  if (!pickerWrapper || !emojiButton) return;

  const clickedInsidePicker = pickerWrapper.contains(e.target);
  const clickedEmojiButton = emojiButton.contains(e.target);

  if (!clickedInsidePicker && !clickedEmojiButton) {
    hideEmojiPicker();
  }
});
