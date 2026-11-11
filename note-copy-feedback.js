(() => {
  if (window.showCEPNoteCopyFeedback) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const presses = new WeakMap();
  let status, announcement, dismiss;

  window.showCEPNoteCopyFeedback = card => {
    if (card?.isConnected && card.animate && !reducedMotion.matches) {
      presses.get(card)?.cancel();
      const press = card.animate([
        { scale: '1', translate: '0 0' },
        { scale: '.99', translate: '0 2px', boxShadow: '0 1px 3px #0002', offset: .34 },
        { scale: '1', translate: '0 0' }
      ], { duration: 200, easing: 'ease-out' });
      presses.set(card, press);
      press.onfinish = () => {
        if (presses.get(card) === press) presses.delete(card);
      };
    }

    if (!status) {
      const style = document.createElement('style');
      style.textContent = `
        #cep-note-copy-status {
          position: fixed;
          z-index: 2147483647;
          left: 50%;
          bottom: max(20px, env(safe-area-inset-bottom));
          transform: translateX(-50%);
          pointer-events: none;
          padding: 6px 12px;
          border-radius: 10px;
          background: #25252b;
          color: #fff;
          -webkit-text-fill-color: #fff;
          font: 13px/1.4 system-ui, sans-serif;
        }
        #cep-note-copy-status:empty { opacity: 0; }
      `;
      document.head.append(style);
      status = document.createElement('div');
      status.id = 'cep-note-copy-status';
      status.setAttribute('role', 'status');
      document.body.append(status);
    }

    cancelAnimationFrame(announcement);
    clearTimeout(dismiss);
    status.textContent = '';
    announcement = requestAnimationFrame(() => {
      status.textContent = 'Copied';
      dismiss = setTimeout(() => { status.textContent = ''; }, 1100);
    });
  };
})();
