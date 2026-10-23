/* Render-only styling: no note DOM, attributes, saved HTML or editor commands change. */
(() => {
  'use strict';
  const scopes = '.note-text,.note-content,.edit-note,.edit-box,.edit-notes-box,.vaccine-notes-input,.note-display,#note,#noteText,#notes,#noteInput,#nurseNote,.editableNote,.chatBubble,.cep-pn-editor,.cep-source-note-text,.cep-source-note-content,.cep-source-note-display,.cep-xgpt-rich-content,.universal-search-native-snippet';
  const authored = '.gradient-highlight,.highlight-gradient,.note-gradient-highlight,mark.highlight-hue,.cep-content-highlight,.cep-chosen-highlight';
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
      parts.unshift(`${element.localName}${element.id ? `#${CSS.escape(element.id)}` : ""}:nth-child(${index})`);
      element = element.parentElement;
    }
    return `html:root:root:root:root:root:root:root:root:root:root > ${parts.join(' > ')}`;
  };
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
    const selectors = [], emptySelectors = [], glowSelectors = [], importantSelectors = [];
    const importantFill = [...source.cssRules].find(rule => rule.selectorText === '.cep-content-highlight-important-fill').style.cssText;
    const chosenSelectors = [];
    document.querySelectorAll(`${authored},${search}`).forEach(element => {
      if (!element.closest(excluded) && !element.textContent.trim() && !element.querySelector('img,svg,table,video,audio,iframe,input,button')) emptySelectors.push(path(element));
    });
    highlights.forEach(element => {
      if (!eligible(element)) return;
      if (element.closest('.cep-removed-highlight')) return;
      const chosen = element.closest('.cep-chosen-highlight');
      if (chosen && chosen !== element) return;
      const selector = path(element);
      if (!element.textContent.trim() && !element.querySelector('img,svg,table,video,audio,iframe,input,button')) {
        emptySelectors.push(selector); return;
      }
      // Saved explicit colour choices stay the same on source pages and in search.
      if (chosen) chosenSelectors.push(selector);
      else selectors.push(selector);
      const important = ['background','background-color','background-image'].some(property => element.style.getPropertyPriority(property) === 'important');
      if (important && !chosen) importantSelectors.push(selector);
      if (element.matches('.ml-highlight')) glowSelectors.push(`${selector}::before`);

    });
    const rules = [];
    if (chosenSelectors.length) rules.push(`${chosenSelectors.join(',')} {${declaration.replace(/background:[^;]*;/, '')}}`);
    if (selectors.length) rules.push(`${[...new Set(selectors)].join(',')} {${declaration}}`);
    if (importantSelectors.length) rules.push(`${importantSelectors.join(',')} {${importantFill}}`);
    const textSelectors=[...new Set([...selectors,...chosenSelectors])].flatMap(selector=>[selector,`${selector} *`]);
    if(textSelectors.length)rules.push(`${textSelectors.join(',')} {color:#303030 !important;-webkit-text-fill-color:#303030 !important;text-shadow:none !important;}`);
    if (emptySelectors.length) rules.push(`${[...new Set(emptySelectors)].join(',')} {background:transparent !important;padding:0 !important;box-shadow:none !important;visibility:hidden !important;}`);
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
