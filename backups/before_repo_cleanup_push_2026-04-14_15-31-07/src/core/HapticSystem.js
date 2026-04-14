/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HAPTIC SYSTEM — Tactile Feedback
 * Telegram WebApp haptic feedback wrapper
 * ═══════════════════════════════════════════════════════════════════════════
 */

class HapticSystemClass {
  constructor() {
    this.enabled = true;
    this.telegram = null;
  }

  init() {
    if (window.Telegram?.WebApp) {
      this.telegram = window.Telegram.WebApp;
    }
  }

  impact(style = 'light') {
    if (!this.enabled || !this.telegram?.HapticFeedback) return;

    try {
      // Styles: light, medium, heavy, rigid, soft
      this.telegram.HapticFeedback.impactOccurred(style);
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  notification(type = 'success') {
    if (!this.enabled || !this.telegram?.HapticFeedback) return;

    try {
      // Types: success, warning, error
      this.telegram.HapticFeedback.notificationOccurred(type);
    } catch (error) {
      console.warn('Haptic notification error:', error);
    }
  }

  selection() {
    if (!this.enabled || !this.telegram?.HapticFeedback) return;

    try {
      this.telegram.HapticFeedback.selectionChanged();
    } catch (error) {
      console.warn('Haptic selection error:', error);
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const HapticSystem = new HapticSystemClass();
