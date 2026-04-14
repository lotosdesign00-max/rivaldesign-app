/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STORAGE SYSTEM — Local Storage Wrapper
 * Type-safe localStorage with fallback
 * ═══════════════════════════════════════════════════════════════════════════
 */

class StorageSystemClass {
  constructor() {
    this.prefix = 'rival_';
    this.available = this.checkAvailability();
  }

  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  get(key, defaultValue = null) {
    if (!this.available) return defaultValue;

    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Storage get error:', error);
      return defaultValue;
    }
  }

  set(key, value) {
    if (!this.available) return false;

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Storage set error:', error);
      return false;
    }
  }

  remove(key) {
    if (!this.available) return false;

    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.warn('Storage remove error:', error);
      return false;
    }
  }

  clear() {
    if (!this.available) return false;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn('Storage clear error:', error);
      return false;
    }
  }

  has(key) {
    if (!this.available) return false;
    return localStorage.getItem(this.prefix + key) !== null;
  }

  keys() {
    if (!this.available) return [];

    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.warn('Storage keys error:', error);
      return [];
    }
  }
}

export const StorageSystem = new StorageSystemClass();
