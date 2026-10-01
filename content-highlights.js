/* Render-only styling: no note DOM, attributes, saved HTML or editor commands change. */
(() => {
  'use strict';
  const scopes = '.note-text,.note-content,.edit-note,.edit-box,.edit-notes-box,.vaccine-notes-input,.note-display,#note,#noteText,#notes,#noteInput,.editableNote,.chatBubble,.cep-pn-editor,.cep-source-note-text,.cep-source-note-content,.cep-source-note-display,.cep-xgpt-rich-content,.universal-search-native-snippet';
  const authored = '.gradient-highlight,.highlight-gradient,.note-gradient-highlight,mark.highlight-hue,.cep-content-highlight';
  const search = '.cep-search-match,.underlineMatch,.search-highlight,.search-hit';
  const excluded = 'button,[role="button"],.badge,[class$="-badge"],h1,h2,h3,h4,h5,h6,.note-title,.cep-source-note-title,.editor-buttons,.format-buttons,.cep-pn-editor-toolbar';
  const runtime = document.createElement('style');
  runtime.id = 'cep-content-highlight-render-styles';
  document.head.appendChild(runtime);
  const path = element => {
    const parts = [];
    while (element && element !== document.documentElement) {
      let index = 1;
      for (let sibling = element.previousElementSibling; sibling; sibling = sibling.previousElementSibling) index++;
      parts.unshift(`${element.localName}:nth-child(${index})`);
      element = element.parentElement;
    }
    return `html > ${parts.join(' > ')}`;
  };
  function luminance(color) {
    const values = color.match(/[\d.]+/g)?.map(Number);
    if (!values || values.length < 3) return null;
    const rgb = values.slice(0, 3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  }
  const pale = luminance('rgb(241,243,245)'), dark = luminance('rgb(79,84,89)');
  const contrast = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  function needsDark(element) {
    const computed = getComputedStyle(element);
    const color = computed.webkitTextFillColor || computed.color;
    const light = luminance(color);
    // Choose dark only for light text whose contrast improves to readable levels.
    return light !== null && light > dark && contrast(light, pale) < 4.5 && contrast(light, dark) >= 4.5;
  }
  function hasInlineHighlight(element) {
    const background = element.style.backgroundColor;
    return (background && background !== 'transparent' && !/rgba\([^)]*,\s*0\s*\)/.test(background)) ||
      (element.style.backgroundImage && element.style.backgroundImage !== 'none');
  }
  function eligible(element) {
    return !element.closest(`${search},${excluded}`) &&
      !element.matches('.cep-concept-search-result mark');
  }
  let queued = false;
  function render() {
    queued = false;
    const source = [...document.styleSheets].find(sheet => sheet.href?.includes('/content-highlights.css'));
    const declaration = source && [...source.cssRules].find(rule => rule.selectorText === '.cep-content-highlight')?.style.cssText;
    if (!declaration) return;
    const highlights = new Set(document.querySelectorAll(authored));
    document.querySelectorAll(scopes).forEach(scope => {
      scope.querySelectorAll('mark,span.highlight,span[style],font[style]').forEach(element => {
        if (element.tagName === 'MARK' || element.matches('span.highlight') || hasInlineHighlight(element)) highlights.add(element);
      });
    });
    // Calculator dose emphasis is deliberately preserved, not calculator panels.
    if (location.pathname.toLowerCase().endsWith('/ohcalc.html')) {
      document.querySelectorAll('span.ml-highlight').forEach(element => highlights.add(element));
    }
    const selectors = [], darkSelectors = [], emptySelectors = [], glowSelectors = [], importantSelectors = [], importantDarkSelectors = [];
    const importantFill = [...source.cssRules].find(rule => rule.selectorText === '.cep-content-highlight-important-fill').style.cssText;
    const importantDarkFill = [...source.cssRules].find(rule => rule.selectorText === '.cep-content-highlight-important-dark-fill').style.cssText;
    highlights.forEach(element => {
      if (!eligible(element)) return;
      const selector = path(element);
      if (!element.textContent.trim() && !element.querySelector('img,svg,table')) {
        emptySelectors.push(selector); return;
      }
      selectors.push(selector);
      const important = ['background','background-color','background-image'].some(property => element.style.getPropertyPriority(property) === 'important');
      if (important) importantSelectors.push(selector);
      if (element.matches('.ml-highlight')) glowSelectors.push(`${selector}::before`);
      const textParents = new Set();
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim()) textParents.add(walker.currentNode.parentElement);
      }
      const visibleParents = [...textParents].filter(eligible);
      if (visibleParents.length && visibleParents.every(needsDark)) {
        darkSelectors.push(selector);
        if (important) importantDarkSelectors.push(selector);
      } else {
        visibleParents.forEach(parent => {
          if (needsDark(parent)) {
            // Mixed colours get a dark backdrop only behind their light-text segment.
            if (parent !== element) selectors.push(path(parent));
            darkSelectors.push(path(parent));
            if (important && parent === element) importantDarkSelectors.push(selector);
          }
        });
      }
    });
    const rules = [];
    if (selectors.length) rules.push(`${[...new Set(selectors)].join(',')} {${declaration}}`);
    if (darkSelectors.length) rules.push(`${[...new Set(darkSelectors)].join(',')} {background:var(--cep-highlight-dark-paper) !important;box-shadow:var(--cep-highlight-dark-shadow) !important;}`);
    if (importantSelectors.length) rules.push(`${importantSelectors.join(',')} {${importantFill}}`);
    if (importantDarkSelectors.length) rules.push(`${importantDarkSelectors.join(',')} {${importantDarkFill}}`);
    if (emptySelectors.length) rules.push(`${emptySelectors.join(',')} {background:transparent !important;padding:0 !important;box-shadow:none !important;}`);
    if (glowSelectors.length) rules.push(`${glowSelectors.join(',')} {content:none !important;}`);
    const css = rules.join('\n');
    if (runtime.textContent !== css) runtime.textContent = css;
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(render); }
  }
  const observer = new MutationObserver(records => {
    if (records.some(record => record.target !== runtime && !runtime.contains(record.target))) schedule();
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class','style','data-xlyneve-color-theme'] });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class','style','data-xlyneve-color-theme'] });
  document.addEventListener('input', schedule, true);
  document.addEventListener('load', schedule, true);
  window.addEventListener('resize', schedule);
  schedule();
})();
