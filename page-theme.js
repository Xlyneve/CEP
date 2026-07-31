(function () {
  "use strict";

  const palette = [
    { rgb: "229, 203, 204", solid: "#e5cbcc", ink: "#39190f" },
    { rgb: "211, 224, 223", solid: "#d3e0df", ink: "#39190f" },
    { rgb: "225, 226, 195", solid: "#e1e2c3", ink: "#39190f" },
    { rgb: "239, 237, 232", solid: "#efede8", ink: "#39190f" },
    { rgb: "219, 158, 131", solid: "#db9e83", ink: "#39190f" },

  ];

  const pageName = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  function hash(text) {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  const pageColor = palette[hash(pageName) % palette.length];
  const root = document.documentElement;
  root.style.setProperty("--page-header-glass", `rgba(${pageColor.rgb}, 0.78)`);
  root.style.setProperty("--page-header-solid", pageColor.solid);
  root.style.setProperty("--page-header-ink", pageColor.ink);

  const headerSelector = [
    ".header",
    ".header-bg",
    ".topbar",
    ".top-bar",
    ".app-header",
    ".page-header",
    "body > header"
  ].join(",");

  const cardSelector = [
    ".note-card",
    ".card",
    ".acc-item",
    ".med-section",
    ".vaccine-section",
    ".vaccine-card",
    ".calculator",
    ".result",
    ".table-mini",
    ".private-note-editor",
    ".editable-checklist",
    ".day:not(.empty):not(.today)",
    ".todo-item:not(.priority)"
  ].join(",");

  function colorCards(scope) {
    const cards = [];
    if (scope.nodeType === 1 && scope.matches(cardSelector)) cards.push(scope);
    scope.querySelectorAll(cardSelector).forEach((card) => cards.push(card));

    cards.forEach((card, index) => {
      if (card.dataset.sharedPaletteColor === "true") return;
      const pageIndex = Array.prototype.indexOf.call(
        document.querySelectorAll(cardSelector),
        card
      );
      const seed = `${pageName}:${pageIndex >= 0 ? pageIndex : index}:${card.id}:${card.className}`;
      const color = palette[hash(seed) % palette.length];
      card.style.setProperty("--card-glass", `rgba(${color.rgb}, 0.74)`);
      card.style.setProperty("--card-ink", color.ink);
      card.dataset.sharedPaletteColor = "true";
    });
  }

  function start() {
    document.querySelectorAll(headerSelector).forEach((header) => {
      if (pageName === "home.html" && header.matches("body > header")) return;
      header.style.setProperty("background", `rgba(${pageColor.rgb}, 0.78)`, "important");
      header.style.setProperty("background-image", "none", "important");
      header.style.setProperty("color", pageColor.ink, "important");
    });
    colorCards(document);
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) colorCards(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
