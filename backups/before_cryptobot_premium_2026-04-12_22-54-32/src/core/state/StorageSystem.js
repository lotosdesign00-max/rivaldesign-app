/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STORAGE SYSTEM
 * Enhanced localStorage wrapper with type safety and error handling
 * ═══════════════════════════════════════════════════════════════════════════
 */

class StorageSystemClass {
  constructor() {
    this.prefix = 'rival_design_';
    this.available = this.checkAvailability();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // AVAILABILITY CHECK
  // ═══════════════════════════════════════════════════════════════════════

  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('localStorage not available:', error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CORE METHODS
  // ═══════════════════════════════════════════════════════════════════════

  set(key, value) {
    if (!this.available) return false;

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.warn('Storage set error:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    if (!this.available) return defaultValue;

    try {
      const item = localStorage.getItem(this.prefix + key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn('Storage get error:', error);
      return defaultValue;
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
      keys.forEach((key) => {
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

  // ═══════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════

  has(key) {
    if (!this.available) return false;
    return localStorage.getItem(this.prefix + key) !== null;
  }

  keys() {
    if (!this.available) return [];

    try {
      const allKeys = Object.keys(localStorage);
      return allKeys
        .filter((key) => key.startsWith(this.prefix))
        .map((key) => key.replace(this.prefix, ''));
    } catch (error) {
      console.warn('Storage keys error:', error);
      return [];
    }
  }

  size() {
    return this.keys().length;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ADVANCED METHODS
  // ═══════════════════════════════════════════════════════════════════════

  setWithExpiry(key, value, ttl) {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    return this.set(key, item);
  }

  getWithExpiry(key, defaultValue = null) {
    const item = this.get(key);
    if (!item) return defaultValue;

    if (Date.now() > item.expiry) {
      this.remove(key);
      return defaultValue;
    }

    return item.value;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // BATCH OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  setMultiple(items) {
    if (!this.available) return false;

    try {
      Object.entries(items).forEach(([key, value]) => {
        this.set(key, value);
      });
      return true;
    } catch (error) {
      console.warn('Storage setMultiple error:', error);
      return false;
    }
  }

  getMultiple(keys, defaultValue = null) {
    if (!this.available) return {};

    const result = {};
    keys.forEach((key) => {
      result[key] = this.get(key, defaultValue);
    });
    return result;
  }

  removeMultiple(keys) {
    if (!this.available) return false;

    try {
      keys.forEach((key) => {
        this.remove(key);
      });
      return true;
    } catch (error) {
      console.warn('Storage removeMultiple error:', error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // EXPORT / IMPORT
  // ═══════════════════════════════════════════════════════════════════════

  export() {
    if (!this.available) return null;

    try {
      const data = {};
      this.keys().forEach((key) => {
        data[key] = this.get(key);
      });
      return data;
    } catch (error) {
      console.warn('Storage export error:', error);
      return null;
    }
  }

  import(data, overwrite = false) {
    if (!this.available) return false;

    try {
      Object.entries(data).forEach(([key, value]) => {
        if (overwrite || !this.has(key)) {
          this.set(key, value);
        }
      });
      return true;
    } catch (error) {
      console.warn('Storage import error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const StorageSystem = new StorageSystemClass();
