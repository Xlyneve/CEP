// emoji-picker.js

const emojiScript = document.createElement("script");
emojiScript.type = "module";
emojiScript.src = "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";
document.head.appendChild(emojiScript);

let savedRange = null;
let pickerWrapper = null;

emojiScript.onload = () => {
  createEmojiPicker();
};

function createEmojiPicker() {
  pickerWrapper = document.createElement("div");
  pickerWrapper.id = "emojiPickerWrapper";

  pickerWrapper.innerHTML = `<emoji-picker></emoji-picker>`;

  pickerWrapper.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 999999;
    display: none;
    box-shadow: 0 8px 25px rgba(0,0,0,0.18);
    border-radius: 16px;
    overflow: hidden;
  `;

  document.body.appendChild(pickerWrapper);

  const emojiPicker = pickerWrapper.querySelector("emoji-picker");

  emojiPicker.addEventListener("emoji-click", (event) => {
    insertAtCursor(event.detail.unicode);
    pickerWrapper.style.display = "none";
  });
}

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

document.addEventListener("keydown", (e) => {
 if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
    e.preventDefault();

    if (!pickerWrapper) return;

    pickerWrapper.style.display =
      pickerWrapper.style.display === "none" ? "block" : "none";
  }
});

function insertAtCursor(text) {
  const active = document.activeElement;

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

  if (savedRange) {
    const selection = window.getSelection();

    selection.removeAllRanges();
    selection.addRange(savedRange);

    savedRange.deleteContents();
    savedRange.insertNode(document.createTextNode(text));

    savedRange.collapse(false);

    selection.removeAllRanges();
    selection.addRange(savedRange);
  }
}
