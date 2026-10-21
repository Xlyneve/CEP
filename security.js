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
    "class", "colspan", "rowspan", "scope", "title", "data-pn-definition"
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
        const allowedForImage = element.tagName === "IMG" && ["src", "alt", "width", "height", "data-cep-drawing"].includes(name);

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

  // Clipboard formatting is cleaned only at insertion, never on saved notes.
  const PASTE_STYLES = new Set([
    'font-weight', 'font-style', 'text-decoration', 'text-align', 'vertical-align',
    'white-space', 'margin-left', 'padding-left', 'width', 'max-width', 'min-width',
    'border', 'border-width', 'border-style', 'border-color', 'border-collapse'
  ]);

  function cleanPastedHTML(input, fontFamily = 'inherit') {
    const source = document.createElement('template');
    source.innerHTML = String(input || '');
    source.content.querySelectorAll('script,style,meta,link,title,iframe,object,embed').forEach(node => node.remove());
    const clean = document.createElement('template');
    clean.innerHTML = sanitizeHTML(source.innerHTML);
    for (const node of [...clean.content.querySelectorAll('*')]) {
      // A mark has its own browser background even when its style is removed.
      if (node.tagName === 'MARK') { node.replaceWith(...node.childNodes); continue; }
      node.removeAttribute('class');
      node.removeAttribute('id');
      for (const attribute of ['face','size','color','bgcolor','background']) node.removeAttribute(attribute);
      for (const property of Array.from(node.style)) if (!PASTE_STYLES.has(property)) node.style.removeProperty(property);
      node.style.setProperty('font-family','inherit');
      if (node.hasAttribute('data-pn-definition')) node.classList.add('pn-definition');
    }
    // Explicitly inherit the editor's font, including code/pre and plain text nodes.
    for (const node of [...clean.content.childNodes]) {
      if (node.nodeType === Node.ELEMENT_NODE) node.style.setProperty('font-family',fontFamily);
      else if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const span = document.createElement('span');
        span.style.fontFamily = fontFamily; span.textContent = node.textContent; node.replaceWith(span);
      }
    }
    return clean.innerHTML;
  }

  function insertPastedHTML(editor, html) {
    const selection = window.getSelection();
    let range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    if (!range || !editor.contains(range.commonAncestorContainer)) {
      range = document.createRange(); range.selectNodeContents(editor); range.collapse(false);
    }
    // Replace a split inline highlight in one editing command, preserving undo.
    // Only the pasted text leaves the highlight; the surrounding text keeps it.
    let highlight = null;
    let ancestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    for (; ancestor && ancestor !== editor; ancestor = ancestor.parentElement) {
      if (!['MARK','SPAN','FONT'].includes(ancestor.tagName)) continue;
      const background = getComputedStyle(ancestor);
      if (ancestor.tagName === 'MARK' || /(?:gradient-highlight|highlight-gradient|note-gradient-highlight|highlight-hue|cep-content-highlight)/.test(ancestor.className) ||
          background.backgroundImage !== 'none' || !['transparent','rgba(0, 0, 0, 0)'].includes(background.backgroundColor)) highlight = ancestor;
    }
    let caretOffset = null;
    if (highlight) {
      const prefix = document.createRange(); prefix.selectNodeContents(editor); prefix.setEnd(range.startContainer,range.startOffset);
      const pasted = document.createElement('template'); pasted.innerHTML = html;
      caretOffset = prefix.cloneContents().textContent.length + pasted.content.textContent.length;
      const beforeRange = document.createRange(); beforeRange.selectNodeContents(highlight); beforeRange.setEnd(range.startContainer,range.startOffset);
      const afterRange = document.createRange(); afterRange.selectNodeContents(highlight); afterRange.setStart(range.endContainer,range.endOffset);
      const before = highlight.cloneNode(false); before.append(beforeRange.cloneContents());
      const after = highlight.cloneNode(false); after.append(afterRange.cloneContents());
      html = (before.hasChildNodes() ? before.outerHTML : '') + html + (after.hasChildNodes() ? after.outerHTML : '');
      range.selectNode(highlight);
    }
    editor.focus({preventScroll:true});
    selection.removeAllRanges(); selection.addRange(range);
    let notified = false;
    const onInput = () => { notified = true; };
    editor.addEventListener('input',onInput);
    const before = editor.innerHTML;
    let inserted = false;
    try { inserted = document.execCommand('insertHTML',false,html); }
    catch (_) { /* Use the selection API when the editing command is unavailable. */ }
    if (!inserted && editor.innerHTML === before) {
      const fragment = range.createContextualFragment(html);
      const last = fragment.lastChild;
      range.deleteContents(); range.insertNode(fragment);
      if (last) range.setStartAfter(last);
      range.collapse(true); selection.removeAllRanges(); selection.addRange(range);
    }
    if (caretOffset !== null) {
      const walker = document.createTreeWalker(editor,NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (caretOffset <= node.length) {
          range = document.createRange(); range.setStart(node,caretOffset); range.collapse(true);
          selection.removeAllRanges(); selection.addRange(range); break;
        }
        caretOffset -= node.length;
      }
    }
    editor.removeEventListener('input',onInput);
    if (!notified) editor.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertFromPaste'}));
  }

  window.CEPSecurity = Object.freeze({ sanitizeHTML, setHTML, cleanPastedHTML });
  window.addEventListener('paste', event => {
    if (event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (target?.closest('input,textarea,select')) return;
    const editor = target?.closest('[contenteditable]');
    if (!editor?.isContentEditable || editor.getAttribute('contenteditable') === 'plaintext-only') return;
    const clipboard = event.clipboardData;
    if (!clipboard) return;
    const html = clipboard.getData('text/html');
    const text = clipboard.getData('text/plain');
    // Image/file-only pastes and native input/textarea pastes keep their normal behaviour.
    if (!html && !text) return;
    const font = getComputedStyle(editor).fontFamily;
    let content;
    if (html) content = cleanPastedHTML(html,font);
    if (!content) {
      const span = document.createElement('span');
      span.style.fontFamily = font; span.style.whiteSpace = 'pre-wrap'; span.textContent = text;
      content = span.outerHTML;
    }
    event.preventDefault();
    insertPastedHTML(editor,content);
  },true);
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
      const sourceParent = card.parentElement;
      const previewRoot = document.createElement("main");
      previewRoot.className = "global-search-card-root";
      sourceParent?.classList.forEach(className => previewRoot.classList.add(className));
      if (sourceParent?.id) previewRoot.id = sourceParent.id;
      const cardStyles = getComputedStyle(card);
      ["background", "border", "box-shadow", "backdrop-filter", "-webkit-backdrop-filter", "opacity"]
        .forEach(property => card.style.setProperty(property, cardStyles.getPropertyValue(property), "important"));
      for (let index = 0; index < cardStyles.length; index += 1) {
        const property = cardStyles.item(index);
        if (property.startsWith("--")) previewRoot.style.setProperty(property, cardStyles.getPropertyValue(property));
      }
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
          width: 88% !important; max-width: none !important; min-width: 0 !important;
          margin: 0 auto !important; padding: clamp(8px, 2.4vw, 14px) !important;
          box-sizing: border-box !important; font-size: 80% !important; line-height: 1.35 !important;
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
        window.parent.postMessage({ type: "cep-card-preview-open", key: previewKey }, location.origin);
      }, true);
      card.addEventListener("keydown", event => {
        if (isInternalControl(event.target) || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.parent.postMessage({ type: "cep-card-preview-open", key: previewKey }, location.origin);
      }, true);
      document.documentElement.classList.remove("cep-card-preview-pending");
      const reportPreview = () => {
        if (!card.isConnected) return;
        const cardRect = card.getBoundingClientRect();
        const rootHeight = previewRoot.scrollHeight;
        const cardHeight = Math.max(cardRect.height, card.scrollHeight);
        window.parent.postMessage({
          type: "cep-card-preview-size",
          key: previewKey,
          height: Math.ceil(Math.max(rootHeight, cardHeight) + 12)
        }, location.origin);
      };
      requestAnimationFrame(() => requestAnimationFrame(reportPreview));
      [250, 800, 1800].forEach(delay => setTimeout(reportPreview, delay));
      document.fonts?.ready.then(reportPreview);
      card.querySelectorAll("img").forEach(image => {
        if (!image.complete) image.addEventListener("load", reportPreview, { once: true });
      });
      if (window.ResizeObserver) {
        const previewObserver = new ResizeObserver(reportPreview);
        previewObserver.observe(previewRoot);
        previewObserver.observe(card);
      }
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
      if (previewMode) window.parent.postMessage({ type: "cep-card-preview-error", key: previewKey }, location.origin);
    };
    requestAnimationFrame(awaitCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSearchFocus, { once: true });
  } else {
    startSearchFocus();
  }
})();

