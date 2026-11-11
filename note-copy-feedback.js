(() => {
  if (window.showCEPNoteCopyFeedback) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const presses = new WeakMap();
  let status, announcement, dismiss;

  window.showCEPNoteCopyFeedback = card => {
    if (card?.isConnected) {
      const surface = card.querySelector('.cep-source-surface,.cep-source-notebook,.cep-source-form,.cep-source-chat') || card;
      presses.get(surface)?.();
      const properties = ['box-shadow', 'scale', 'translate'];
      const original = properties.map(name => [name, surface.style.getPropertyValue(name), surface.style.getPropertyPriority(name)]);
      const themeInset = getComputedStyle(surface).getPropertyValue('--note-editor-inset').trim();
      const inset = themeInset && themeInset !== 'none' ? themeInset
        : 'inset 3px 4px 7px rgba(83,98,108,.3), inset -3px -3px 6px rgba(255,255,251,.95)';
      surface.style.setProperty('box-shadow', inset, 'important');
      if (!reducedMotion.matches) {
        surface.style.setProperty('scale', '.96', 'important');
        surface.style.setProperty('translate', '0 2px', 'important');
      }
      const release = () => {
        clearTimeout(releaseTimer);
        for (const [name, value, priority] of original) {
          if (value) surface.style.setProperty(name, value, priority);
          else surface.style.removeProperty(name);
        }
        presses.delete(surface);
      };
      const releaseTimer = setTimeout(release, 220);
      presses.set(surface, release);
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
