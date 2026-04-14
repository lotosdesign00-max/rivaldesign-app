/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TELEGRAM SDK WRAPPER
 * Enhanced Telegram WebApp API integration
 * ═══════════════════════════════════════════════════════════════════════════
 */

class TelegramSDKWrapper {
  constructor() {
    this.telegram = window.Telegram?.WebApp;
    this.initialized = false;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  init() {
    if (this.initialized || !this.telegram) return;

    try {
      this.telegram.ready();
      this.telegram.expand();

      // Disable vertical swipes if supported
      if (this.isVersionAtLeast('6.1')) {
        this.telegram.disableVerticalSwipes?.();
      }

      // Enable closing confirmation
      if (this.isVersionAtLeast('6.1')) {
        this.telegram.enableClosingConfirmation?.();
      }

      this.initialized = true;
    } catch (error) {
      console.warn('Telegram SDK initialization error:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // VERSION CHECK
  // ═══════════════════════════════════════════════════════════════════════

  isVersionAtLeast(version) {
    return this.telegram?.isVersionAtLeast?.(version) || false;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // USER DATA
  // ═══════════════════════════════════════════════════════════════════════

  getUser() {
    return this.telegram?.initDataUnsafe?.user || null;
  }

  getUserId() {
    return this.getUser()?.id || null;
  }

  getUserName() {
    const user = this.getUser();
    return user?.username || `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
  }

  getUserLanguage() {
    return this.getUser()?.language_code || 'en';
  }

  // ═══════════════════════════════════════════════════════════════════════
  // THEME & COLORS
  // ═══════════════════════════════════════════════════════════════════════

  getThemeParams() {
    return this.telegram?.themeParams || {};
  }

  getColorScheme() {
    return this.telegram?.colorScheme || 'dark';
  }

  setHeaderColor(color) {
    if (!this.isVersionAtLeast('6.1')) return;
    try {
      this.telegram.setHeaderColor?.(color);
    } catch (error) {
      console.warn('Set header color error:', error);
    }
  }

  setBackgroundColor(color) {
    if (!this.isVersionAtLeast('6.1')) return;
    try {
      this.telegram.setBackgroundColor?.(color);
    } catch (error) {
      console.warn('Set background color error:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // BACK BUTTON
  // ═══════════════════════════════════════════════════════════════════════

  showBackButton(callback) {
    if (!this.isVersionAtLeast('6.1')) return;
    try {
      this.telegram.BackButton?.show();
      if (callback) {
        this.telegram.BackButton?.onClick(callback);
      }
    } catch (error) {
      console.warn('Show back button error:', error);
    }
  }

  hideBackButton() {
    if (!this.isVersionAtLeast('6.1')) return;
    try {
      this.telegram.BackButton?.hide();
    } catch (error) {
      console.warn('Hide back button error:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MAIN BUTTON
  // ═══════════════════════════════════════════════════════════════════════

  showMainButton(text, callback) {
    if (!this.telegram?.MainButton) return;
    try {
      this.telegram.MainButton.setText(text);
      this.telegram.MainButton.show();
      if (callback) {
        this.telegram.MainButton.onClick(callback);
      }
    } catch (error) {
      console.warn('Show main button error:', error);
    }
  }

  hideMainButton() {
    if (!this.telegram?.MainButton) return;
    try {
      this.telegram.MainButton.hide();
    } catch (error) {
      console.warn('Hide main button error:', error);
    }
  }

  setMainButtonText(text) {
    if (!this.telegram?.MainButton) return;
    try {
      this.telegram.MainButton.setText(text);
    } catch (error) {
      console.warn('Set main button text error:', error);
    }
  }

  enableMainButton() {
    if (!this.telegram?.MainButton) return;
    try {
      this.telegram.MainButton.enable();
    } catch (error) {
      console.warn('Enable main button error:', error);
    }
  }

  disableMainButton() {
    if (!this.telegram?.MainButton) return;
    try {
      this.telegram.MainButton.disable();
    } catch (error) {
      console.warn('Disable main button error:', error);
    }
  }

  showMainButtonProgress() {
    if (!this.telegram?.MainButton) return;
    try {
      this.telegram.MainButton.showProgress();
    } catch (error) {
      console.warn('Show main button progress error:', error);
    }
  }

  hideMainButtonProgress() {
    if (!this.telegram?.MainButton) return;
    try {
      this.telegram.MainButton.hideProgress();
    } catch (error) {
      console.warn('Hide main button progress error:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // VIEWPORT
  // ═══════════════════════════════════════════════════════════════════════

  getViewportHeight() {
    return this.telegram?.viewportHeight || window.innerHeight;
  }

  getViewportStableHeight() {
    return this.telegram?.viewportStableHeight || window.innerHeight;
  }

  isExpanded() {
    return this.telegram?.isExpanded || false;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LINKS & NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════

  openLink(url, options = {}) {
    if (!this.telegram) {
      window.open(url, '_blank');
      return;
    }
    try {
      this.telegram.openLink(url, options);
    } catch (error) {
      console.warn('Open link error:', error);
      window.open(url, '_blank');
    }
  }

  openTelegramLink(url) {
    if (!this.telegram) return;
    try {
      this.telegram.openTelegramLink(url);
    } catch (error) {
      console.warn('Open telegram link error:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CLOUD STORAGE
  // ═══════════════════════════════════════════════════════════════════════

  async cloudStorageGet(key) {
    if (!this.isVersionAtLeast('6.9')) return null;
    return new Promise((resolve) => {
      try {
        this.telegram.CloudStorage?.getItem(key, (error, value) => {
          if (error) {
            console.warn('Cloud storage get error:', error);
            resolve(null);
          } else {
            resolve(value);
          }
        });
      } catch (error) {
        console.warn('Cloud storage get error:', error);
        resolve(null);
      }
    });
  }

  async cloudStorageSet(key, value) {
    if (!this.isVersionAtLeast('6.9')) return false;
    return new Promise((resolve) => {
      try {
        this.telegram.CloudStorage?.setItem(key, value, (error, success) => {
          if (error) {
            console.warn('Cloud storage set error:', error);
            resolve(false);
          } else {
            resolve(success);
          }
        });
      } catch (error) {
        console.warn('Cloud storage set error:', error);
        resolve(false);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════

  close() {
    if (!this.telegram) return;
    try {
      this.telegram.close();
    } catch (error) {
      console.warn('Close error:', error);
    }
  }

  sendData(data) {
    if (!this.telegram) return;
    try {
      this.telegram.sendData(JSON.stringify(data));
    } catch (error) {
      console.warn('Send data error:', error);
    }
  }

  isAvailable() {
    return !!this.telegram;
  }

  getPlatform() {
    return this.telegram?.platform || 'unknown';
  }
}

// Export singleton instance
export const TelegramSDK = new TelegramSDKWrapper();
