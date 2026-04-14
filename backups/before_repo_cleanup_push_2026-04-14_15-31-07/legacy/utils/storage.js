/**
 * LOCAL STORAGE UTILITIES
 * Безопасная работа с localStorage для персистентности данных
 */

export const storage = {
  // Wishlist
  getWishlist: () => {
    try {
      const data = localStorage.getItem('rival_wishlist');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setWishlist: (items) => {
    try {
      localStorage.setItem('rival_wishlist', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save wishlist:', e);
    }
  },

  // Cart
  getCart: () => {
    try {
      const data = localStorage.getItem('rival_cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCart: (items) => {
    try {
      localStorage.setItem('rival_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  },

  // Settings
  getSettings: () => {
    try {
      const data = localStorage.getItem('rival_settings');
      return data ? JSON.parse(data) : {
        theme: 'deepspace',
        language: 'ru',
        soundEnabled: true,
      };
    } catch {
      return {
        theme: 'deepspace',
        language: 'ru',
        soundEnabled: true,
      };
    }
  },

  setSettings: (settings) => {
    try {
      localStorage.setItem('rival_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  // Achievements
  getAchievements: () => {
    try {
      const data = localStorage.getItem('rival_achievements');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setAchievements: (achievements) => {
    try {
      localStorage.setItem('rival_achievements', JSON.stringify(achievements));
    } catch (e) {
      console.warn('Failed to save achievements:', e);
    }
  },
};

export default storage;

