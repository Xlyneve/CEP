// Keep card rebuilding out of the input event and combine rapid keystrokes.
export function debounceSearch(callback, delay = 120) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(this, args), delay);
  };
}
