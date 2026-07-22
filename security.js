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
