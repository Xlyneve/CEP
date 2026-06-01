// emoji-picker.js

// Loads the external emoji picker library
const emojiScript = document.createElement("script");
emojiScript.type = "module";
emojiScript.src = "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";
document.head.appendChild(emojiScript);

let savedRange = null;
let pickerWrapper = null;
let emojiButton = null;

// When external emoji picker has loaded
emojiScript.onload = () => {
  createEmojiPicker();
};

emojiScript.onerror = () => {
  console.error("Emoji picker failed to load. Check internet connection or CDN link.");
};

function createEmojiPicker() {
  // Prevent duplicate picker if script accidentally loads twice
  if (document.getElementById("emojiPickerWrapper")) return;

  pickerWrapper = document.createElement("div");
  pickerWrapper.id = "emojiPickerWrapper";

  pickerWrapper.innerHTML = `
    <emoji-picker></emoji-picker>
  `;

  pickerWrapper.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 999999;
    display: none;
    box-shadow: 0 8px 25px rgba(0,0,0,0.18);
    border-radius: 16px;
    overflow: hidden;
    max-width: 95vw;
  `;

  document.body.appendChild(pickerWrapper);

  const emojiPicker = pickerWrapper.querySelector("emoji-picker");

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
  emojiButton.title = "Open emoji picker";

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

// Save cursor position from input, textarea, or contenteditable
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

// Keyboard shortcut
// Mac: Command + Shift + E OR Control + Shift + E
// Windows: Ctrl + Shift + E
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === "e") {
    e.preventDefault();
    toggleEmojiPicker();
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

  // For input and textarea
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

  // For contenteditable
  if (savedRange) {
    const selection = window.getSelection();

    selection.removeAllRanges();
    selection.addRange(savedRange);

    savedRange.deleteContents();

    const emojiNode = document.createTextNode(text);
    savedRange.insertNode(emojiNode);

    savedRange.setStartAfter(emojiNode);
    savedRange.setEndAfter(emojiNode);

    selection.removeAllRanges();
    selection.addRange(savedRange);

    const editableParent = getEditableParent(emojiNode);
    if (editableParent) {
      editableParent.dispatchEvent(new Event("input", { bubbles: true }));
      editableParent.focus();
    }

    return;
  }

  console.log("No cursor position saved yet. Click inside a text box first.");
}

function getEditableParent(node) {
  let current = node.parentNode;

  while (current) {
    if (current.isContentEditable) return current;
    current = current.parentNode;
  }

  return null;
}

// Close picker when pressing Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideEmojiPicker();
  }
});

// Close picker when clicking outside it and outside the emoji button
document.addEventListener("click", (e) => {
  if (!pickerWrapper || !emojiButton) return;

  const clickedInsidePicker = pickerWrapper.contains(e.target);
  const clickedEmojiButton = emojiButton.contains(e.target);

  if (!clickedInsidePicker && !clickedEmojiButton) {
    hideEmojiPicker();
  }
});
