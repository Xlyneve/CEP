// Paint legacy inline-important fills without changing table HTML or saved styles.
(() => {
  'use strict';
  if (window.CEPTableCellPaint) return;
  window.CEPTableCellPaint = true;
  const paint = document.createElement('style');
  paint.id = 'cep-table-cell-paint';
  document.head.append(paint);
  const path = cell => {
    const parts = [];
    for (let element = cell; element && element !== document.documentElement; element = element.parentElement) {
      let index = 1;
      for (let sibling = element.previousElementSibling; sibling; sibling = sibling.previousElementSibling) index++;
      parts.unshift(`${element.localName}:nth-child(${index})`);
    }
    return 'html:not(#cep-cell-paint-scope):not(#cep-cell-paint-exclusion) > ' + parts.join(' > ');
  };
  let queued = false;
  function render() {
    queued = false;
    const groups = new Map();
    // Measure only the original shadows, then retain them above the color layer.
    paint.sheet.disabled = true;
    document.querySelectorAll('table td,table th').forEach(cell => {
      if (!['background','background-color','background-image'].some(name => cell.style.getPropertyPriority(name) === 'important')) return;
      const original = getComputedStyle(cell).boxShadow;
      const fill = cell.matches('th,thead td') ? '--cep-cell-heading' : '--cep-cell-body';
      const shadow = (original === 'none' ? '' : original + ',') + `inset 0 0 0 100vmax var(${fill})`;
      if (!groups.has(shadow)) groups.set(shadow, []);
      groups.get(shadow).push(path(cell));
    });
    paint.sheet.disabled = false;
    const css = [...groups].map(([shadow, selectors]) => `${selectors.join(',')}{box-shadow:${shadow} !important;}`).join('\n');
    if (paint.textContent !== css) paint.textContent = css;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(render); } }
  function start() {
    schedule();
    new MutationObserver(records => {
      if (records.some(record => {
        const target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
        return target?.closest('table') || (record.type === 'childList' && target?.querySelector('table'));
      })) schedule();
    }).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class','rowspan','colspan']});
    new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['style','class','data-xlyneve-color-theme']});
    document.addEventListener('load',event => { if (event.target.matches?.('link[rel="stylesheet"]')) schedule(); },true);
    window.addEventListener('load',schedule);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
