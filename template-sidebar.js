/* Only the narrow-window template list presentation changes. */
(() => {
  const panel = document.getElementById('templateSidebar');
  const toggle = document.getElementById('templateSidebarToggle');
  const closeButton = document.getElementById('templateSidebarClose');
  if (!panel || !toggle || !closeButton) return;
  const narrow = window.matchMedia('(max-width: 1180px)');
  function close(returnFocus = true) {
    const wasOpen = panel.classList.contains('templates-open');
    panel.classList.remove('templates-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (wasOpen && narrow.matches && returnFocus) toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => {
    if (panel.classList.contains('templates-open')) return close();
    panel.classList.add('templates-open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.querySelector('input')?.focus({ preventScroll: true });
  });
  closeButton.addEventListener('click', () => close());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('templates-open')) close();
  });
  document.addEventListener('pointerdown', event => {
    if (narrow.matches && !panel.contains(event.target) && !toggle.contains(event.target)) close(false);
  });
  narrow.addEventListener('change', () => close(false));
  window.CEPTemplateSidebar = { close };
})();
