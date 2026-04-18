export function isMobilePerfMode() {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.rsMobile === "true";
}

export function scheduleIdle(fn, timeout = 900) {
  if (typeof window === "undefined") {
    fn();
    return undefined;
  }

  if ("requestIdleCallback" in window) {
    return {
      type: "idle",
      id: window.requestIdleCallback(fn, { timeout }),
    };
  }

  return {
    type: "timeout",
    id: window.setTimeout(fn, Math.min(timeout, 240)),
  };
}

export function cancelIdle(handle) {
  if (typeof window === "undefined" || handle === undefined || handle === null) return;
  if (typeof handle === "object") {
    if (handle.type === "idle") window.cancelIdleCallback?.(handle.id);
    if (handle.type === "timeout") window.clearTimeout(handle.id);
    return;
  }
  window.cancelIdleCallback?.(handle);
  window.clearTimeout(handle);
}

export function markInteraction(duration = 260) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.rsInteracting = "true";
  window.clearTimeout(window.__rsInteractionTimer);
  window.__rsInteractionTimer = window.setTimeout(() => {
    delete root.dataset.rsInteracting;
  }, duration);
}

export function runAfterTap(fn) {
  if (typeof window === "undefined") {
    fn();
    return;
  }

  markInteraction();
  window.requestAnimationFrame(() => {
    fn();
  });
}

export function makeLazyPreloader(loaders) {
  const cache = new Map();

  return (id) => {
    const load = loaders[id];
    if (!load) return undefined;
    if (cache.has(id)) return cache.get(id);

    const task = load().catch((error) => {
      cache.delete(id);
      throw error;
    });

    cache.set(id, task);
    return task;
  };
}

export function debounce(fn, wait = 300) {
  let timeout;
  return (...args) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => fn(...args), wait);
  };
}

export function throttle(fn, limit = 100) {
  let locked = false;
  return (...args) => {
    if (locked) return;
    fn(...args);
    locked = true;
    window.setTimeout(() => {
      locked = false;
    }, limit);
  };
}

export function lazyLoadImage(img) {
  if (!img || typeof window === "undefined") return;
  if (!("IntersectionObserver" in window)) {
    img.src = img.dataset.src;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove("lazy");
      observer.unobserve(lazyImage);
    });
  });
  observer.observe(img);
}

export function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

export function isInViewport(element) {
  if (!element || typeof window === "undefined") return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
