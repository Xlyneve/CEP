/* Shared display formatting only; saved timestamps remain unchanged. */
(() => {
  'use strict';
  function toDate(value) {
    if (value == null || value === '') return null;
    try {
      let date;
      if (typeof value.toDate === 'function') date = value.toDate();
      else if (typeof value === 'object' && Number.isFinite(value.seconds ?? value._seconds)) {
        date = new Date((value.seconds ?? value._seconds) * 1000 + (value.nanoseconds ?? value._nanoseconds ?? 0) / 1e6);
      } else date = new Date(value);
      return date && Number.isFinite(date.getTime()) ? date : null;
    } catch { return null; }
  }
  const dateOptions = { timeZone: 'Pacific/Auckland', day: '2-digit', month: '2-digit', year: 'numeric' };
  const dateFormat = new Intl.DateTimeFormat('en-GB', dateOptions);
  const timestampFormat = new Intl.DateTimeFormat('en-GB', { ...dateOptions, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  function format(value, { dateOnly = false } = {}) {
    const date = toDate(value);
    if (!date) return value == null || value === '' ? '' : 'Date unavailable';
    return (dateOnly ? dateFormat : timestampFormat).format(date);
  }
  globalThis.CEPNoteDates = Object.freeze({ toDate, format });
})();
