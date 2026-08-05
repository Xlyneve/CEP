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
  const cardIndex = Number.parseInt(params.get("cepCard") || "", 10);
  const previewMode = params.get("cepPreview") === "card";
  const previewKey = params.get("cepPreviewKey") || "";
  if (previewMode) {
    document.documentElement.classList.add("cep-card-preview-pending");
    const pendingStyle = document.createElement("style");
    pendingStyle.id = "cepCardPreviewPendingStyle";
    pendingStyle.textContent = "html.cep-card-preview-pending body{visibility:hidden!important}";
    document.head.appendChild(pendingStyle);
  }
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

    const candidates = [...new Set(document.querySelectorAll(cardSelector))]
      .filter(card => !card.parentElement?.closest(cardSelector));
    if (Number.isInteger(cardIndex) && candidates[cardIndex]) return candidates[cardIndex];
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

    if (previewMode) {
      document.documentElement.classList.add("cep-card-preview");
      card.classList.add("global-search-card", "global-search-card--compact");
      card.tabIndex = 0;
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", `Open ${normalize(card.textContent).slice(0, 80) || "search result"}`);
      const previewRoot = document.createElement("main");
      previewRoot.className = "global-search-card-root";
      previewRoot.appendChild(card);
      document.body.appendChild(previewRoot);
      [...document.body.children].forEach(child => {
        if (child !== previewRoot) child.remove();
      });
      const style = document.createElement("style");
      style.textContent = `
        html.cep-card-preview { min-height: 0 !important; background: transparent !important; scrollbar-width: none; }
        html.cep-card-preview::-webkit-scrollbar { display: none; }
        html.cep-card-preview body {
          min-height: 0 !important; margin: 0 !important; padding: 0 !important;
          overflow: hidden !important; background: transparent !important;
        }
        html.cep-card-preview::before,
        html.cep-card-preview::after,
        html.cep-card-preview body::before,
        html.cep-card-preview body::after { display: none !important; content: none !important; }
        .global-search-card-root {
          display: block !important; width: 100% !important; min-width: 0 !important;
          margin: 0 !important; padding: 3px !important; box-sizing: border-box !important;
          overflow: hidden !important; background: transparent !important;
        }
        .global-search-card.global-search-card--compact {
          width: 100% !important; max-width: none !important; min-width: 0 !important;
          margin: 0 !important; padding: clamp(10px, 3vw, 16px) !important;
          box-sizing: border-box !important; font-size: 90% !important;
          background-color: rgba(240, 241, 239, 0.94) !important;
          overflow-wrap: anywhere !important; word-break: normal !important;
          cursor: pointer !important;
        }
        .global-search-card.global-search-card--compact img,
        .global-search-card.global-search-card--compact table,
        .global-search-card.global-search-card--compact pre { max-width: 100% !important; }
      `;
      document.head.appendChild(style);
      const isInternalControl = target => target instanceof Element && Boolean(
        target.closest("button,a,input,textarea,select,summary,[contenteditable='true'],[role='button']")
      );
      card.addEventListener("click", event => {
        if (isInternalControl(event.target)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        parent.postMessage({ type: "cep-card-preview-open", key: previewKey }, location.origin);
      }, true);
      card.addEventListener("keydown", event => {
        if (isInternalControl(event.target) || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        parent.postMessage({ type: "cep-card-preview-open", key: previewKey }, location.origin);
      }, true);
      document.documentElement.classList.remove("cep-card-preview-pending");
      const reportPreview = () => {
        if (!card.isConnected) return;
        parent.postMessage({
          type: "cep-card-preview-size",
          key: previewKey,
          height: Math.ceil(Math.max(previewRoot.scrollHeight, card.getBoundingClientRect().height) + 6)
        }, location.origin);
      };
      requestAnimationFrame(() => requestAnimationFrame(reportPreview));
      [250, 800, 1800].forEach(delay => setTimeout(reportPreview, delay));
      if (window.ResizeObserver) new ResizeObserver(reportPreview).observe(previewRoot);
      return;
    }

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
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", startSearchFocus, { once: true });
      return;
    }
    const immediate = matchingCard();
    if (immediate) {
      revealCard(immediate);
      return;
    }

    const startedAt = Date.now();
    const awaitCard = () => {
      const card = matchingCard();
      if (card) { revealCard(card); return; }
      if (Date.now() - startedAt < 15000) { requestAnimationFrame(awaitCard); return; }
      if (previewMode) parent.postMessage({ type: "cep-card-preview-error", key: previewKey }, location.origin);
    };
    requestAnimationFrame(awaitCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSearchFocus, { once: true });
  } else {
    startSearchFocus();
  }
})();
