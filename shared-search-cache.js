// Shared by Home and header search on this site. No Firebase work happens here.
const DB_NAME = 'cep-shared-search-v1';
const MAX_AGE = 4 * 60 * 60 * 1000;
const RESET_KEY = 'cep-search-reset-v1';
const QUERY_PREFIX = 'cep-search-query-v1:';
const memory = new Map();
const pending = new Map();
let database;
let localVersion = '';

const readStorage = key => { try { return localStorage.getItem(key) || ''; } catch { return ''; } };
export const searchCacheVersion = () => localVersion + readStorage(RESET_KEY) + ':' + readStorage('cep-explicit-sign-out');
function openDatabase() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('records');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).catch(() => null);
  return database;
}
async function storageOperation(mode, action) {
  const db = await openDatabase();
  if (!db) return null;
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('records', mode);
      const request = action(tx.objectStore('records'));
      tx.oncomplete = () => resolve(request?.result ?? null);
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  } catch { return null; }
}
export async function sharedSearchRecords(project, uid, name, fetchRecords) {
  if (!uid) throw new Error('Sign in to search saved notes.');
  const version = searchCacheVersion();
  const key = JSON.stringify([version, project, uid, name]);
  const fresh = record => record && Date.now() - record.savedAt < MAX_AGE;
  if (fresh(memory.get(key))) return memory.get(key).records;
  if (pending.has(key)) return pending.get(key);
  const load = async () => {
    const stored = await storageOperation('readonly', store => store.get(key));
    if (fresh(stored)) { memory.set(key, stored); return stored.records; }
    const records = await fetchRecords();
    // An in-flight request must not refill a cache cleared by sign-out/refresh.
    if (version === searchCacheVersion()) {
      const value = { savedAt: Date.now(), records };
      memory.set(key, value);
      await storageOperation('readwrite', store => store.put(value, key));
    }
    return records;
  };
  const promise = (navigator.locks?.request
    ? navigator.locks.request('cep-search:' + key, load)
    : load()).finally(() => pending.delete(key));
  pending.set(key, promise);
  return promise;
}
function queryKey() {
  const uid = window.CEP_CURRENT_USER?.uid;
  return uid ? QUERY_PREFIX + uid : null;
}
export function getSharedSearchQuery() {
  const key = queryKey();
  return key ? readStorage(key) : '';
}
export function setSharedSearchQuery(value) {
  const key = queryKey();
  if (key) try { localStorage.setItem(key, String(value)); } catch {}
}
export async function clearSharedSearchCache({ queries = false } = {}) {
  const reset = String(Date.now()) + Math.random();
  try {
    localStorage.setItem(RESET_KEY, reset);
    if (queries) {
      for (const key of Object.keys(localStorage)) if (key.startsWith(QUERY_PREFIX)) localStorage.removeItem(key);
    }
  } catch { localVersion = reset; }
  memory.clear();
  await storageOperation('readwrite', store => store.clear());
}
window.addEventListener('storage', event => {
  if (event.key === RESET_KEY || event.key === 'cep-explicit-sign-out') memory.clear();
});
