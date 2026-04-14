/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HAPTIC FEEDBACK SYSTEM
 * Telegram WebApp haptic feedback integration
 * ═══════════════════════════════════════════════════════════════════════════
 */

class HapticFeedbackSystem {
  constructor() {
    this.enabled = true;
    this.telegram = window.Telegram?.WebApp;
    this.supported = this.checkSupport();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SUPPORT CHECK
  // ═══════════════════════════════════════════════════════════════════════

  checkSupport() {
    return !!(
      this.telegram?.HapticFeedback &&
      this.telegram?.isVersionAtLeast?.('6.1')
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // IMPACT FEEDBACK
  // ═══════════════════════════════════════════════════════════════════════

  impact(style = 'light') {
    if (!this.enabled || !this.supported) return;

    try {
      this.telegram.HapticFeedback.impactOccurred(style);
    } catch (error) {
      console.warn('Haptic impact error:', error);
    }
  }

  light() {
    this.impact('light');
  }

  medium() {
    this.impact('medium');
  }

  heavy() {
    this.impact('heavy');
  }

  rigid() {
    this.impact('rigid');
  }

  soft() {
    this.impact('soft');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // NOTIFICATION FEEDBACK
  // ═══════════════════════════════════════════════════════════════════════

  notification(type = 'success') {
    if (!this.enabled || !this.supported) return;

    try {
      this.telegram.HapticFeedback.notificationOccurred(type);
    } catch (error) {
      console.warn('Haptic notification error:', error);
    }
  }

  success() {
    this.notification('success');
  }

  warning() {
    this.notification('warning');
  }

  error() {
    this.notification('error');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SELECTION FEEDBACK
  // ═══════════════════════════════════════════════════════════════════════

  selection() {
    if (!this.enabled || !this.supported) return;

    try {
      this.telegram.HapticFeedback.selectionChanged();
    } catch (error) {
      console.warn('Haptic selection error:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONTEXTUAL FEEDBACK
  // ═══════════════════════════════════════════════════════════════════════

  tap() {
    this.light();
  }

  click() {
    this.light();
  }

  buttonPress() {
    this.medium();
  }

  toggle() {
    this.light();
  }

  swipe() {
    this.light();
  }

  drag() {
    this.selection();
  }

  drop() {
    this.medium();
  }

  refresh() {
    this.medium();
  }

  delete() {
    this.heavy();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONTROLS
  // ═══════════════════════════════════════════════════════════════════════

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  isSupported() {
    return this.supported;
  }
}

// Export singleton instance
export const HapticSystem = new HapticFeedbackSystem();
