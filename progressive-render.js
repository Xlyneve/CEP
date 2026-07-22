const activeRenders = new WeakMap();

function cancelScheduled(handle) {
  if (!handle) return;
  if (handle.type === "idle") cancelIdleCallback(handle.id);
  else clearTimeout(handle.id);
}

function schedule(callback) {
  if ("requestIdleCallback" in window) {
    return {
      type: "idle",
      id: requestIdleCallback(callback, { timeout: 250 })
    };
  }

  return {
    type: "timeout",
    id: setTimeout(() => callback(), 16)
  };
}

export function renderInBatches(container, items, createElement, options = {}) {
  const {
    initialBatchSize = 12,
    batchSize = 8,
    onBatch,
    onComplete
  } = options;

  const previous = activeRenders.get(container);
  if (previous) {
    previous.cancelled = true;
    cancelScheduled(previous.handle);
  }

  const job = { cancelled: false, handle: null };
  activeRenders.set(container, job);
  let index = 0;

  const appendBatch = (count) => {
    const fragment = document.createDocumentFragment();
    const end = Math.min(index + count, items.length);

    while (index < end) {
      const element = createElement(items[index], index);
      index += 1;
      if (element) fragment.appendChild(element);
    }

    container.appendChild(fragment);
    onBatch?.({ rendered: index, total: items.length });
  };

  const finish = () => {
    if (activeRenders.get(container) === job) activeRenders.delete(container);
    onComplete?.();
  };

  const continueRendering = () => {
    if (job.cancelled) return;
    appendBatch(batchSize);

    if (index < items.length) job.handle = schedule(continueRendering);
    else finish();
  };

  appendBatch(initialBatchSize);
  if (index < items.length) job.handle = schedule(continueRendering);
  else finish();

  return () => {
    job.cancelled = true;
    cancelScheduled(job.handle);
    if (activeRenders.get(container) === job) activeRenders.delete(container);
  };
}
