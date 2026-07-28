(function () {
  "use strict";

  const ALLOWED_TAGS = new Set([
    "A", "B", "BLOCKQUOTE", "BR", "CODE", "DIV", "EM", "FIGCAPTION",
    "FIGURE", "H1", "H2", "H3", "H4", "H5", "H6", "HR", "I", "IMG",
    "LI", "MARK", "OL", "P", "PRE", "S", "SMALL", "SPAN", "STRONG",
    "SUB", "SUP", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR",
    "U", "UL"
  ]);

  const GLOBAL_ATTRIBUTES = new Set([
    "class", "colspan", "rowspan", "scope", "title"
  ]);

  const ALLOWED_STYLE_PROPERTIES = new Set([
    "background", "background-color", "border", "border-collapse", "border-color",
    "border-radius", "border-style", "border-width", "color", "display",
    "font-family", "font-size", "font-style", "font-weight", "height",
    "letter-spacing", "line-height", "margin", "margin-bottom", "margin-left",
    "margin-right", "margin-top", "max-height", "max-width", "min-height",
    "min-width", "padding", "padding-bottom", "padding-left", "padding-right",
    "padding-top", "text-align", "text-decoration", "vertical-align", "white-space",
    "width", "word-break"
  ]);

  function sanitizeStyle(value) {
    if (/url\s*\(|expression\s*\(|@import|javascript:/i.test(value)) return "";
    return String(value || "")
      .split(";")
      .map(declaration => declaration.trim())
      .filter(Boolean)
      .filter(declaration => {
        const separator = declaration.indexOf(":");
        if (separator < 1) return false;
        return ALLOWED_STYLE_PROPERTIES.has(declaration.slice(0, separator).trim().toLowerCase());
      })
      .join("; ");
  }

  function isSafeUrl(value, allowDataImage) {
    const normalized = String(value || "").trim();
    if (!normalized) return true;
    if (normalized.startsWith("#") || normalized.startsWith("/") || normalized.startsWith("./") || normalized.startsWith("../")) return true;
    if (allowDataImage && /^data:image\/(?:png|gif|jpeg|webp);base64,/i.test(normalized)) return true;

    try {
      const url = new URL(normalized, location.origin);
      return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function sanitizeHTML(input) {
    const template = document.createElement("template");
    template.innerHTML = String(input || "");

    const elements = Array.from(template.content.querySelectorAll("*"));
    for (const element of elements) {
      if (!ALLOWED_TAGS.has(element.tagName)) {
        element.replaceWith(...element.childNodes);
        continue;
      }

      for (const attribute of Array.from(element.attributes)) {
        const name = attribute.name.toLowerCase();
        const value = attribute.value;
        const allowedForLink = element.tagName === "A" && ["href", "target", "rel"].includes(name);
        const allowedForImage = element.tagName === "IMG" && ["src", "alt", "width", "height"].includes(name);

        if (name.startsWith("on")) {
          element.removeAttribute(attribute.name);
        } else if (name === "style") {
          const safeStyle = sanitizeStyle(value);
          if (safeStyle) element.setAttribute("style", safeStyle);
          else element.removeAttribute("style");
        } else if (!GLOBAL_ATTRIBUTES.has(name) && !allowedForLink && !allowedForImage) {
          element.removeAttribute(attribute.name);
        } else if (name === "href" && !isSafeUrl(value, false)) {
          element.removeAttribute(attribute.name);
        } else if (name === "src" && !isSafeUrl(value, true)) {
          element.removeAttribute(attribute.name);
        }
      }

      if (element.tagName === "A" && element.getAttribute("target") === "_blank") {
        element.setAttribute("rel", "noopener noreferrer");
      }
    }

    return template.innerHTML;
  }

  function setHTML(element, input) {
    element.innerHTML = sanitizeHTML(input);
    return element;
  }

  window.CEPSecurity = Object.freeze({ sanitizeHTML, setHTML });
})();

(() => {
  "use strict";

  const params = new URLSearchParams(location.hash.slice(1));
  const query = params.get("cepSearch");
  if (!query) return;

  const hint = params.get("cepHint") || "";
  const focusId = params.get("cepId") || "";
  const normalize = value => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();
  const queryTerms = [...new Set(normalize(query).split(" ").filter(Boolean))];
  const hintTerms = [...new Set(
    normalize(hint).split(/[^a-z0-9]+/).filter(term => term.length >= 4)
  )];
  const cardSelector = [
    ".note-card",
    ".note-tile",
    ".calculator",
    ".vaccine-section",
    ".acc-item",
    ".med-section",
    ".message",
    ".info-box",
    ".content-box",
    ".treatment-section",
    ".dose-card",
    ".card",
    "article"
  ].join(",");

  function installFocusStyle() {
    if (document.getElementById("cepSearchFocusStyle")) return;
    const style = document.createElement("style");
    style.id = "cepSearchFocusStyle";
    style.textContent = `
      .cep-search-focus {
        position: relative;
        z-index: 20;
        scroll-margin: 100px;
        outline: 3px solid rgba(255, 255, 255, 0.98) !important;
        outline-offset: 6px;
        box-shadow:
          0 0 0 7px rgba(255, 255, 255, 0.42),
          0 0 34px 14px rgba(255, 255, 255, 0.92),
          0 0 70px 28px rgba(213, 208, 211, 0.62) !important;
        animation: cepSearchFocusPulse 1.1s ease-in-out 3;
      }

      @keyframes cepSearchFocusPulse {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.2); }
      }

      @media (prefers-reduced-motion: reduce) {
        .cep-search-focus { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function matchingCard() {
    if (!queryTerms.length) return null;

    if (focusId) {
      return [...document.querySelectorAll("[data-id]")]
        .find(candidate => candidate.dataset.id === focusId) || null;
    }

    const candidates = [...new Set(document.querySelectorAll(cardSelector))];
    let best = null;
    let bestScore = -Infinity;

    candidates.forEach(candidate => {
      const text = normalize(candidate.textContent);
      if (!text || !queryTerms.every(term => text.includes(term))) return;

      const hintMatches = hintTerms.reduce(
        (count, term) => count + (text.includes(term) ? 1 : 0),
        0
      );
      const score = (hintMatches * 20) - (text.length / 1000);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    });

    if (best) return best;

    const textMatches = document.querySelectorAll("h1,h2,h3,h4,p,li,td,th");
    for (const element of textMatches) {
      const text = normalize(element.textContent);
      if (text && queryTerms.every(term => text.includes(term))) {
        return element.closest(cardSelector) || element.parentElement;
      }
    }

    return null;
  }

  function revealCard(card) {
    const accordion = card.matches(".acc-item") ? card : card.closest(".acc-item");
    const panel = accordion?.querySelector(".acc-panel");
    const toggle = accordion?.querySelector(".acc-title");
    if (panel && toggle && !panel.classList.contains("open")) toggle.click();

    installFocusStyle();
    card.classList.add("cep-search-focus");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const centerCard = behavior => {
      if (!card.isConnected) return;
      card.scrollIntoView({ behavior, block: "center", inline: "nearest" });
    };

    centerCard(reduceMotion ? "auto" : "smooth");
    [350, 1100, 2500].forEach(delay => {
      setTimeout(() => centerCard("auto"), delay);
    });

    setTimeout(() => card.classList.remove("cep-search-focus"), 5500);
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }

  function startSearchFocus() {
    const immediate = matchingCard();
    if (immediate) {
      revealCard(immediate);
      return;
    }

    const observer = new MutationObserver(() => {
      const card = matchingCard();
      if (!card) return;
      observer.disconnect();
      clearTimeout(timeout);
      revealCard(card);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 15000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSearchFocus, { once: true });
  } else {
    startSearchFocus();
  }
})();
