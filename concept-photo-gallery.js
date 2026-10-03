/* Concept gallery controls are render-only; saved notes and media stay unchanged. */
(() => {
  if (window.CEPPhotoGallery) return;
  const decorated = new WeakMap();
  function navigation(onNavigate) {
    const bar = document.createElement('div');
    bar.className = 'cep-photo-navigation';
    bar.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;flex:0 0 auto;min-height:44px;padding:6px 0;';
    const previous = document.createElement('button');
    const next = document.createElement('button');
    const counter = document.createElement('span');
    counter.className = 'cep-photo-counter';
    counter.setAttribute('aria-live', 'polite');
    counter.setAttribute('aria-atomic', 'true');
    counter.style.cssText = 'min-width:90px;text-align:center;font-size:12px;line-height:1.4;';
    let index = 0, total = 1;
    for (const [button, label, symbol, direction] of [[previous, 'Previous photo', '‹', -1], [next, 'Next photo', '›', 1]]) {
      button.type = 'button';
      button.className = direction < 0 ? 'cep-photo-previous' : 'cep-photo-next';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.textContent = symbol;
      button.style.cssText = 'width:44px;height:44px;min-width:44px;flex:0 0 44px;border:1px solid #ccc;border-radius:8px;background:#f1f3f5;color:#333;font:26px/1 sans-serif;padding:0;cursor:pointer;';
      button.addEventListener('click', event => {
        event.preventDefault(); event.stopPropagation();
        if (!button.disabled) onNavigate(Math.max(0, Math.min(total - 1, index + direction)));
      });
    }
    bar.append(previous, counter, next);
    const update = (current, length) => {
      total = Math.max(1, length); index = Math.max(0, Math.min(total - 1, current));
      counter.textContent = total === 1 ? '1 photo' : `${index + 1} / ${total} photos`;
      previous.hidden = next.hidden = total === 1;
      previous.style.display = next.style.display = total === 1 ? 'none' : '';
      previous.disabled = index === 0; next.disabled = index === total - 1;
      previous.style.opacity = previous.disabled ? '.4' : '1';
      next.style.opacity = next.disabled ? '.4' : '1';
    };
    update(0, 1);
    return { bar, update };
  }
  function photosFor(image) {
    const gallery = image.closest('.cep-photo-gallery');
    return gallery ? [...gallery.querySelector('[data-cep-photo-strip]').querySelectorAll(':scope > img')] : [image];
  }
  function decorate(strip, { onOpen } = {}) {
    let state = decorated.get(strip);
    if (!state) {
      const root = document.createElement('div');
      root.className = 'cep-photo-gallery';
      root.style.cssText = 'min-width:0;max-width:100%;';
      strip.dataset.cepPhotoStrip = 'true';
      strip.before(root); root.appendChild(strip);
      let index = 0;
      const photos = () => [...strip.querySelectorAll(':scope > img')];
      const go = next => {
        const images = photos(); if (!images.length) return;
        index = Math.max(0, Math.min(images.length - 1, next));
        strip.scrollTo({ left: images[index].offsetLeft - images[0].offsetLeft, behavior: 'auto' });
        controls.update(index, images.length);
      };
      const controls = navigation(go); root.appendChild(controls.bar);
      strip.addEventListener('scroll', () => {
        const images = photos(); if (!images.length) return;
        let closest = 0, distance = Infinity;
        images.forEach((image, i) => {
          const delta = Math.abs(image.offsetLeft - images[0].offsetLeft - strip.scrollLeft);
          if (delta < distance) { closest = i; distance = delta; }
        });
        index = closest; controls.update(index, images.length);
      }, { passive: true });
      root.addEventListener('keydown', event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault(); event.stopPropagation();
        go(index + (event.key === 'ArrowRight' ? 1 : -1));
      });
      root.addEventListener('click', event => {
        const image = event.target.closest('img');
        if (!image || !strip.contains(image) || !state.onOpen) return;
        event.preventDefault(); event.stopPropagation(); state.onOpen(image, photos());
      });
      state = { root, onOpen, refresh: () => {
        const images = photos(); index = 0; strip.scrollLeft = 0; controls.update(0, images.length);
      } };
      decorated.set(strip, state);
    }
    state.onOpen = onOpen;
    state.refresh();
    return state.root;
  }
  window.CEPPhotoGallery = { navigation, decorate, photosFor };
})();
