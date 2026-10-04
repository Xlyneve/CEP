(function () {
  'use strict';
  if (window.CEPConceptPreview) return;
  // Honour direct formatting on existing saved concept links as well as inherited formatting.
  const linkSelector = 'a.conceptLink,a.cep-xgpt-concept,a.xgpt-concept-link';
  const preserveDirectFormatting = scope => {
    const links = [...(scope.matches?.(linkSelector) ? [scope] : []), ...scope.querySelectorAll?.(linkSelector) || []];
    links.forEach(link => {
      [link, ...link.querySelectorAll('.conceptLabel,.cep-xgpt-concept-label')].forEach(element => {
        ['color','font-family','font-size','font-weight','font-style','line-height'].forEach(property => {
          const value = element.style.getPropertyValue(property);
          if (value && element.style.getPropertyPriority(property) !== 'important') element.style.setProperty(property, value, 'important');
        });
      });
    });
  };
  preserveDirectFormatting(document);
  new MutationObserver(records => records.forEach(record => {
    if (record.type === 'attributes') {
      const link = record.target.closest(linkSelector);
      if (link) preserveDirectFormatting(link);
    }
    else record.addedNodes.forEach(node => { if (node.nodeType === 1) preserveDirectFormatting(node); });
  })).observe(document.documentElement, { childList:true, subtree:true, attributes:true, attributeFilter:['style'] });
  window.CEPConceptPreview = {
    install({ selector, tip, show, close }) {
      let hoverTimer, hideTimer, pinned = false, activeLink = null, sequence = 0;
      const cancelTimers = () => { clearTimeout(hoverTimer); clearTimeout(hideTimer); };
      const dismiss = () => { cancelTimers(); pinned = false; activeLink = null; sequence++; close(); };
      const open = async (link, event, pin) => {
        cancelTimers(); pinned = pin; activeLink = link;
        const request = ++sequence;
        await show(event, () => request === sequence && link.isConnected);
      };
      const scheduleClose = () => {
        clearTimeout(hoverTimer);
        if (!pinned) hideTimer = setTimeout(dismiss, 180);
      };
      document.addEventListener('mouseover', event => {
        const link = event.target.closest?.(selector);
        if (!link || pinned || !matchMedia('(hover: hover)').matches || link.contains(event.relatedTarget)) return;
        cancelTimers();
        hoverTimer = setTimeout(() => open(link, event, false), 250);
      });
      document.addEventListener('mouseout', event => {
        const link = event.target.closest?.(selector);
        if (link && !link.contains(event.relatedTarget) && !tip.contains(event.relatedTarget)) scheduleClose();
      });
      tip.addEventListener('mouseenter', cancelTimers);
      tip.addEventListener('mouseleave', scheduleClose);
      document.addEventListener('click', event => {
        const link = event.target.closest?.(selector);
        if (!link) return;
        event.preventDefault(); event.stopPropagation();
        open(link, event, true);
      }, true);
      document.addEventListener('pointerdown', event => {
        if (activeLink && !tip.contains(event.target) && !event.target.closest?.(selector)) dismiss();
      }, true);
      document.addEventListener('keydown', event => { if (event.key === 'Escape') dismiss(); });
      document.addEventListener('scroll', event => {
        if (activeLink && !tip.contains(event.target)) dismiss();
      }, true);
      return { dismiss };
    }
  };
})();
