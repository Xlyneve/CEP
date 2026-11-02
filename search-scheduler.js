// Keep card rebuilding out of the input event and combine rapid keystrokes.
export function debounceSearch(callback, delay = 120) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(this, args), delay);
  };
}

// Yield to browser input/paint between bounded pieces of search work.
export function yieldSearchWork() {
  return globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise(resolve => setTimeout(resolve, 0));
}
export async function mapSearchBatches(items, map, isCurrent = () => true, { maxItems = 32, budget = 6 } = {}) {
  const result = [];
  let started = performance.now(), count = 0;
  for (let index = 0; index < items.length; index++) {
    if (!isCurrent()) return null;
    const value = map(items[index], index);
    if (value != null) result.push(value);
    if (++count >= maxItems || performance.now() - started >= budget) {
      await yieldSearchWork();
      if (!isCurrent()) return null;
      count = 0; started = performance.now();
    }
  }
  return isCurrent() ? result : null;
}
// Fuzzy searches revisit the same medical words across many cards and queries.
const similarWords = new Map();
export function similarSearchWord(term, word, tolerance) {
  if (Math.abs(word.length - term.length) > tolerance) return false;
  if (word === term) return true;
  const key = `${tolerance}:${term}:${word}`;
  if (similarWords.has(key)) return similarWords.get(key);
  const row = Array.from({length:word.length + 1}, (_, i) => i);
  for (let i = 1; i <= term.length; i++) {
    let diagonal = row[0]; row[0] = i;
    for (let j = 1; j <= word.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (term[i - 1] === word[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  const matches = row[word.length] <= tolerance;
  if (similarWords.size >= 12000) similarWords.clear();
  similarWords.set(key, matches);
  return matches;
}
