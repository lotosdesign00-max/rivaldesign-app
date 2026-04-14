/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SOUND SYSTEM — Premium Audio Feedback
 * Web Audio API based sound system with spatial audio support
 * ═══════════════════════════════════════════════════════════════════════════
 */

class SoundSystemClass {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.enabled = true;
    this.volume = 0.6;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.masterGain.gain.value = this.volume;
      this.initialized = true;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  playTone(frequency, type = 'sine', volume = 0.1, duration = 0.15, delay = 0) {
    if (!this.enabled || !this.initialized || !this.context) return;

    try {
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      const now = this.context.currentTime + delay;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration + 0.05);
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  }

  play(soundName) {
    if (!this.enabled || !this.initialized) return;

    const sounds = {
      // UI Interactions
      tap: () => this.playTone(880, 'sine', 0.05, 0.08),
      tab: () => {
        this.playTone(660, 'triangle', 0.06, 0.09);
        this.playTone(880, 'sine', 0.04, 0.07, 0.04);
      },
      click: () => this.playTone(1000, 'sine', 0.04, 0.06),

      // Navigation
      open: () => {
        [440, 660, 880].forEach((f, i) => this.playTone(f, 'sine', 0.06, 0.14, i * 0.04));
      },
      close: () => {
        [880, 660, 440].forEach((f, i) => this.playTone(f, 'sine', 0.05, 0.1, i * 0.03));
      },
      drawer: () => {
        [500, 700].forEach((f, i) => this.playTone(f, 'sine', 0.05, 0.12, i * 0.05));
      },

      // Feedback
      success: () => {
        [523, 659, 784, 1047].forEach((f, i) => this.playTone(f, 'sine', 0.08, 0.18, i * 0.07));
      },
      error: () => {
        [350, 250].forEach((f, i) => this.playTone(f, 'sawtooth', 0.06, 0.15, i * 0.06));
      },
      warning: () => {
        [600, 500].forEach((f, i) => this.playTone(f, 'triangle', 0.06, 0.12, i * 0.05));
      },

      // Actions
      like: () => {
        this.playTone(880, 'sine', 0.07, 0.14);
        this.playTone(1100, 'sine', 0.05, 0.1, 0.07);
      },
      copy: () => {
        this.playTone(800, 'sine', 0.05, 0.08);
        this.playTone(1000, 'sine', 0.04, 0.07, 0.05);
      },
      filter: () => this.playTone(600, 'triangle', 0.04, 0.08),
      toggle: () => this.playTone(700, 'triangle', 0.05, 0.1),

      // Special
      boot: () => {
        [261, 329, 392, 523].forEach((f, i) => this.playTone(f, 'sine', 0.07, 0.2, i * 0.1));
      },
      achievement: () => {
        [784, 1047, 1319, 1568].forEach((f, i) => this.playTone(f, 'sine', 0.1, 0.25, i * 0.09));
      },
      levelUp: () => {
        [523, 659, 784, 1047, 1319].forEach((f, i) => this.playTone(f, 'sine', 0.09, 0.22, i * 0.08));
      },

      // AI
      ai: () => {
        [200, 300, 400, 500, 600, 700, 800].forEach((f, i) => this.playTone(f, 'sine', 0.04, 0.14, i * 0.04));
      },
      aiDone: () => {
        [784, 988, 1175, 1568].forEach((f, i) => this.playTone(f, 'sine', 0.08, 0.2, i * 0.08));
      },
    };

    const soundFn = sounds[soundName];
    if (soundFn) {
      soundFn();
    }
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
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

export const SoundSystem = new SoundSystemClass();
