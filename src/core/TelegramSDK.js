/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TELEGRAM SDK — WebApp Integration
 * Wrapper for Telegram Mini App API
 * ═══════════════════════════════════════════════════════════════════════════
 */

class TelegramSDKClass {
  constructor() {
    this.webApp = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    try {
      if (window.Telegram?.WebApp) {
        this.webApp = window.Telegram.WebApp;

        // Initialize WebApp
        this.webApp.ready();
        this.webApp.expand();

        // Disable vertical swipes (if supported)
        if (this.isVersionAtLeast('6.1')) {
          this.webApp.disableVerticalSwipes?.();
        }

        // Enable closing confirmation
        if (this.isVersionAtLeast('6.1')) {
          this.webApp.enableClosingConfirmation?.();
        }

        // Set header color
        this.webApp.setHeaderColor?.('#050608');
        this.webApp.setBackgroundColor?.('#050608');

        this.initialized = true;
      }
    } catch (error) {
      console.warn('Telegram SDK initialization error:', error);
    }
  }

  isVersionAtLeast(version) {
    return this.webApp?.isVersionAtLeast?.(version) || false;
  }

  getUser() {
    return this.webApp?.initDataUnsafe?.user || null;
  }

  getUserId() {
    return this.getUser()?.id || null;
  }

  getStartParam() {
    return this.webApp?.initDataUnsafe?.start_param || null;
  }

  showBackButton(onClick) {
    if (!this.webApp?.BackButton) return;

    try {
      this.webApp.BackButton.show();
      if (onClick) {
        this.webApp.BackButton.onClick(onClick);
      }
    } catch (error) {
      console.warn('Show back button error:', error);
    }
  }

  hideBackButton() {
    if (!this.webApp?.BackButton) return;

    try {
      this.webApp.BackButton.hide();
    } catch (error) {
      console.warn('Hide back button error:', error);
    }
  }

  showMainButton(text, onClick) {
    if (!this.webApp?.MainButton) return;

    try {
      this.webApp.MainButton.setText(text);
      this.webApp.MainButton.show();
      if (onClick) {
        this.webApp.MainButton.onClick(onClick);
      }
    } catch (error) {
      console.warn('Show main button error:', error);
    }
  }

  hideMainButton() {
    if (!this.webApp?.MainButton) return;

    try {
      this.webApp.MainButton.hide();
    } catch (error) {
      console.warn('Hide main button error:', error);
    }
  }

  openLink(url, options = {}) {
    if (!this.webApp) return;

    try {
      this.webApp.openLink(url, options);
    } catch (error) {
      console.warn('Open link error:', error);
      window.open(url, '_blank');
    }
  }

  openTelegramLink(url) {
    if (!this.webApp) return;

    try {
      this.webApp.openTelegramLink(url);
    } catch (error) {
      console.warn('Open Telegram link error:', error);
      window.open(url, '_blank');
    }
  }

  close() {
    if (!this.webApp) return;

    try {
      this.webApp.close();
    } catch (error) {
      console.warn('Close error:', error);
    }
  }

  sendData(data) {
    if (!this.webApp) return;

    try {
      this.webApp.sendData(JSON.stringify(data));
    } catch (error) {
      console.warn('Send data error:', error);
    }
  }

  isInTelegram() {
    return !!this.webApp;
  }

  getThemeParams() {
    return this.webApp?.themeParams || {};
  }

  getColorScheme() {
    return this.webApp?.colorScheme || 'dark';
  }

  getViewportHeight() {
    return this.webApp?.viewportHeight || window.innerHeight;
  }

  getViewportStableHeight() {
    return this.webApp?.viewportStableHeight || window.innerHeight;
  }
}

export const TelegramSDK = new TelegramSDKClass();
