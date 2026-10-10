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

function reveal(element) {
  if (!element?.animate) return;
  element.animate(
    [{ opacity: 0.72 }, { opacity: 1 }],
    { duration: 140, easing: "ease-out" }
  );
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
  // Balanced columns redistribute every visible card whenever a batch is added.
  // Build these layouts offscreen and publish the completed cards together.
  const columnCount = Number.parseInt(getComputedStyle(container).columnCount, 10);
  const staged = columnCount > 1 ? document.createDocumentFragment() : null;

  const appendBatch = (count) => {
    const fragment = document.createDocumentFragment();
    const end = Math.min(index + count, items.length);

    while (index < end) {
      const element = createElement(items[index], index);
      index += 1;
      if (element) {
        fragment.appendChild(element);
        if (!staged) reveal(element);
      }
    }

    (staged || container).appendChild(fragment);
    if (!staged) onBatch?.({ rendered: index, total: items.length });
  };

  const finish = () => {
    if (staged) {
      container.appendChild(staged);
      onBatch?.({ rendered: index, total: items.length });
    }
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
