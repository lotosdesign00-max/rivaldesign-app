/**
 * PerformanceOptimizer — утилиты для оптимизации производительности
 */

// Debounce функция
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle функция
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer для lazy loading
export function createLazyLoader(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, { ...defaultOptions, ...options });
}

// Оптимизация изображений
export function optimizeImage(src, width = 800, quality = 80) {
  // Для production можно использовать CDN с параметрами
  // Например: https://cdn.example.com/image.jpg?w=800&q=80
  return src;
}

// Prefetch для следующих страниц
export function prefetchPage(url) {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  document.head.appendChild(link);
}

// Проверка производительности устройства
export function getDevicePerformance() {
  const memory = navigator.deviceMemory || 4; // GB
  const cores = navigator.hardwareConcurrency || 4;
  const connection = navigator.connection?.effectiveType || "4g";

  if (memory >= 8 && cores >= 8 && connection === "4g") {
    return "high";
  } else if (memory >= 4 && cores >= 4) {
    return "medium";
  } else {
    return "low";
  }
}

// Адаптивная загрузка анимаций
export function shouldUseHeavyAnimations() {
  const performance = getDevicePerformance();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return performance === "high" && !prefersReducedMotion;
}

// Батч обновления DOM
export class DOMBatcher {
  constructor() {
    this.queue = [];
    this.scheduled = false;
  }

  add(callback) {
    this.queue.push(callback);
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  flush() {
    this.queue.forEach((callback) => callback());
    this.queue = [];
    this.scheduled = false;
  }
}

// Виртуализация списков (простая версия)
export function calculateVisibleItems(
  scrollTop,
  containerHeight,
  itemHeight,
  totalItems
) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    Math.ceil((scrollTop + containerHeight) / itemHeight),
    totalItems
  );
  const visibleCount = endIndex - startIndex;

  return {
    startIndex: Math.max(0, startIndex - 2), // buffer
    endIndex: Math.min(totalItems, endIndex + 2), // buffer
    visibleCount,
  };
}

// Мемоизация
export function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Очистка кэша
export function clearCache(cache, maxSize = 100) {
  if (cache.size > maxSize) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

// RAF throttle для scroll/resize
export function rafThrottle(callback) {
  let rafId = null;
  return (...args) => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      callback(...args);
      rafId = null;
    });
  };
}

// Проверка видимости элемента
export function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Оптимизация touch событий
export function optimizeTouchEvents(element, handlers) {
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  element.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      handlers.onStart?.(e);
    },
    { passive: true }
  );

  element.addEventListener(
    "touchmove",
    throttle((e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;
      handlers.onMove?.(e, { deltaX, deltaY });
    }, 16),
    { passive: true }
  );

  element.addEventListener(
    "touchend",
    (e) => {
      isDragging = false;
      handlers.onEnd?.(e);
    },
    { passive: true }
  );
}

// Предзагрузка критических ресурсов
export function preloadCriticalResources(resources) {
  resources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = resource.type; // 'image', 'font', 'script', etc.
    link.href = resource.url;
    if (resource.type === "font") {
      link.crossOrigin = "anonymous";
    }
    document.head.appendChild(link);
  });
}

// Мониторинг производительности
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      memory: [],
      loadTime: 0,
    };
    this.lastTime = performance.now();
    this.frameCount = 0;
  }

  start() {
    this.measureFPS();
    this.measureMemory();
    this.measureLoadTime();
  }

  measureFPS() {
    const measure = () => {
      const currentTime = performance.now();
      const delta = currentTime - this.lastTime;
      const fps = Math.round(1000 / delta);

      this.metrics.fps.push(fps);
      if (this.metrics.fps.length > 60) {
        this.metrics.fps.shift();
      }

      this.lastTime = currentTime;
      requestAnimationFrame(measure);
    };
    requestAnimationFrame(measure);
  }

  measureMemory() {
    if (performance.memory) {
      setInterval(() => {
        this.metrics.memory.push({
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
        });
        if (this.metrics.memory.length > 60) {
          this.metrics.memory.shift();
        }
      }, 1000);
    }
  }

  measureLoadTime() {
    window.addEventListener("load", () => {
      const perfData = performance.timing;
      this.metrics.loadTime =
        perfData.loadEventEnd - perfData.navigationStart;
    });
  }

  getAverageFPS() {
    const sum = this.metrics.fps.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.metrics.fps.length);
  }

  getMetrics() {
    return {
      avgFPS: this.getAverageFPS(),
      loadTime: this.metrics.loadTime,
      memory: this.metrics.memory[this.metrics.memory.length - 1],
    };
  }
}

export default {
  debounce,
  throttle,
  createLazyLoader,
  optimizeImage,
  prefetchPage,
  getDevicePerformance,
  shouldUseHeavyAnimations,
  DOMBatcher,
  calculateVisibleItems,
  memoize,
  clearCache,
  rafThrottle,
  isElementVisible,
  optimizeTouchEvents,
  preloadCriticalResources,
  PerformanceMonitor,
};

