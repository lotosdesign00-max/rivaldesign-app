/**
 * STORAGE SYSTEM
 * Unified storage with localStorage, sessionStorage, and memory fallback
 */

class StorageSystem {
  constructor() {
    this.memory = new Map();
    this.prefix = 'rival_';
  }

  // Check if storage is available
  isAvailable(type = 'localStorage') {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Get storage instance
  getStorage(type = 'localStorage') {
    if (this.isAvailable(type)) {
      return window[type];
    }
    return null;
  }

  // Set item
  set(key, value, options = {}) {
    const { type = 'localStorage', ttl = null } = options;
    const prefixedKey = this.prefix + key;

    const data = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    const serialized = JSON.stringify(data);
    const storage = this.getStorage(type);

    if (storage) {
      try {
        storage.setItem(prefixedKey, serialized);
      } catch (e) {
        console.warn('Storage quota exceeded, using memory fallback');
        this.memory.set(prefixedKey, data);
      }
    } else {
      this.memory.set(prefixedKey, data);
    }
  }

  // Get item
  get(key, defaultValue = null, options = {}) {
    const { type = 'localStorage' } = options;
    const prefixedKey = this.prefix + key;
    const storage = this.getStorage(type);

    let data = null;

    if (storage) {
      try {
        const serialized = storage.getItem(prefixedKey);
        if (serialized) {
          data = JSON.parse(serialized);
        }
      } catch {
        // Invalid JSON, remove it
        storage.removeItem(prefixedKey);
      }
    }

    // Fallback to memory
    if (!data && this.memory.has(prefixedKey)) {
      data = this.memory.get(prefixedKey);
    }

    if (!data) {
      return defaultValue;
    }

    // Check TTL
    if (data.ttl && Date.now() - data.timestamp > data.ttl) {
      this.remove(key, options);
      return defaultValue;
    }

    return data.value;
  }

  // Remove item
  remove(key, options = {}) {
    const { type = 'localStorage' } = options;
    const prefixedKey = this.prefix + key;
    const storage = this.getStorage(type);

    if (storage) {
      storage.removeItem(prefixedKey);
    }

    this.memory.delete(prefixedKey);
  }

  // Clear all items
  clear(options = {}) {
    const { type = 'localStorage' } = options;
    const storage = this.getStorage(type);

    if (storage) {
      const keys = Object.keys(storage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          storage.removeItem(key);
        }
      });
    }

    this.memory.clear();
  }

  // Get all keys
  keys(options = {}) {
    const { type = 'localStorage' } = options;
    const storage = this.getStorage(type);
    const keys = [];

    if (storage) {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
    }

    // Add memory keys
    this.memory.forEach((_, key) => {
      if (key.startsWith(this.prefix)) {
        const cleanKey = key.replace(this.prefix, '');
        if (!keys.includes(cleanKey)) {
          keys.push(cleanKey);
        }
      }
    });

    return keys;
  }

  // Check if key exists
  has(key, options = {}) {
    return this.get(key, null, options) !== null;
  }

  // Get storage size
  getSize(options = {}) {
    const { type = 'localStorage' } = options;
    const storage = this.getStorage(type);
    let size = 0;

    if (storage) {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          size += storage.getItem(key).length;
        }
      }
    }

    return size;
  }
}

// Create singleton
const storage = new StorageSystem();

// Convenience methods
export const setItem = (key, value, options) => storage.set(key, value, options);
export const getItem = (key, defaultValue, options) => storage.get(key, defaultValue, options);
export const removeItem = (key, options) => storage.remove(key, options);
export const clearStorage = (options) => storage.clear(options);
export const hasItem = (key, options) => storage.has(key, options);
export const getKeys = (options) => storage.keys(options);
export const getStorageSize = (options) => storage.getSize(options);

export default storage;
