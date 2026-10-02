/* Native spelling suggestions only while a text field is being edited. */
(() => {
  'use strict';
  const selector = 'textarea,input,[contenteditable],[spellcheck]';
  const textTypes = new Set(['text', 'search']);
  function editable(element) {
    if (element.matches('input')) return textTypes.has(element.type) && !element.disabled && !element.readOnly;
    if (element.matches('textarea')) return !element.disabled && !element.readOnly;
    return element.isContentEditable;
  }
  function sync(element) {
    const focused = document.activeElement;
    const enabled = editable(element) && (element === focused || element.contains(focused));
    if (element.spellcheck !== enabled || !element.hasAttribute('spellcheck')) element.spellcheck = enabled;
    if (enabled && !element.closest('[lang]')) element.lang = 'en-NZ';
  }
  function scan(root = document) {
    if (root.matches?.(selector)) sync(root);
    root.querySelectorAll?.(selector).forEach(sync);
  }
  document.body.spellcheck = false;
  scan();
  document.addEventListener('focusin', () => scan(), true);
  document.addEventListener('focusout', () => queueMicrotask(() => scan()), true);
  new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'attributes') scan(record.target);
      else record.addedNodes.forEach(node => { if (node.nodeType === 1) scan(node); });
    });
  }).observe(document.body, {
    subtree: true, childList: true, attributes: true,
    attributeFilter: ['contenteditable', 'readonly', 'disabled', 'type']
  });
})();
