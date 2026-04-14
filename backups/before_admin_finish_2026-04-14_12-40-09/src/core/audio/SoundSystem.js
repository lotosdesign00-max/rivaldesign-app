/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PREMIUM SOUND SYSTEM — Enhanced Audio Engine
 * Web Audio API based sound system with rich, premium sounds
 * ═══════════════════════════════════════════════════════════════════════════
 */

class PremiumSoundSystem {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.enabled = true;
    this.volume = 0.6;
    this.initialized = false;
    this.sounds = new Map();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  init() {
    if (this.initialized) return;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.masterGain.gain.value = this.volume;
      this.initialized = true;

      // Auto-resume on user interaction
      document.addEventListener('click', () => this.resume(), { once: true });
      document.addEventListener('touchstart', () => this.resume(), { once: true });
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TONE GENERATION
  // ═══════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════
  // CHORD GENERATION
  // ═══════════════════════════════════════════════════════════════════════

  playChord(frequencies, type = 'sine', volume = 0.08, duration = 0.2) {
    frequencies.forEach((freq, index) => {
      this.playTone(freq, type, volume, duration, index * 0.02);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PREMIUM SOUND LIBRARY
  // ═══════════════════════════════════════════════════════════════════════

  play(soundName) {
    if (!this.enabled || !this.initialized) return;

    const sounds = {
      // ─────────────────────────────────────────────────────────────────────
      // UI INTERACTIONS — Subtle & Refined
      // ─────────────────────────────────────────────────────────────────────
      tap: () => {
        this.playTone(880, 'sine', 0.04, 0.06);
        this.playTone(1100, 'sine', 0.02, 0.04, 0.02);
      },

      click: () => {
        this.playTone(1000, 'triangle', 0.05, 0.08);
      },

      hover: () => {
        this.playTone(660, 'sine', 0.03, 0.05);
      },

      // ─────────────────────────────────────────────────────────────────────
      // NAVIGATION — Smooth Transitions
      // ─────────────────────────────────────────────────────────────────────
      tab: () => {
        this.playChord([523, 659, 784], 'sine', 0.05, 0.12);
      },

      pageTransition: () => {
        this.playChord([440, 554, 659, 880], 'sine', 0.06, 0.18);
      },

      open: () => {
        [440, 554, 659, 880].forEach((f, i) =>
          this.playTone(f, 'sine', 0.06, 0.14, i * 0.04)
        );
      },

      close: () => {
        [880, 659, 554, 440].forEach((f, i) =>
          this.playTone(f, 'sine', 0.05, 0.1, i * 0.03)
        );
      },

      drawer: () => {
        this.playChord([500, 700, 900], 'sine', 0.05, 0.15);
      },

      // ─────────────────────────────────────────────────────────────────────
      // FEEDBACK — Clear Communication
      // ─────────────────────────────────────────────────────────────────────
      success: () => {
        // Major chord progression
        [523, 659, 784, 1047].forEach((f, i) =>
          this.playTone(f, 'sine', 0.08, 0.2, i * 0.08)
        );
      },

      error: () => {
        // Dissonant descending tones
        [400, 350, 300].forEach((f, i) =>
          this.playTone(f, 'sawtooth', 0.06, 0.15, i * 0.06)
        );
      },

      warning: () => {
        // Alert pattern
        [600, 500, 600].forEach((f, i) =>
          this.playTone(f, 'triangle', 0.06, 0.12, i * 0.08)
        );
      },

      info: () => {
        this.playChord([659, 784, 988], 'sine', 0.05, 0.15);
      },

      // ─────────────────────────────────────────────────────────────────────
      // ACTIONS — Satisfying Feedback
      // ─────────────────────────────────────────────────────────────────────
      like: () => {
        // Heart pop sound
        this.playTone(880, 'sine', 0.08, 0.12);
        this.playTone(1100, 'sine', 0.06, 0.1, 0.06);
        this.playTone(1320, 'sine', 0.04, 0.08, 0.1);
      },

      unlike: () => {
        this.playTone(880, 'sine', 0.05, 0.08);
        this.playTone(660, 'sine', 0.04, 0.06, 0.04);
      },

      favorite: () => {
        // Star sparkle
        [784, 988, 1175, 1568].forEach((f, i) =>
          this.playTone(f, 'sine', 0.07, 0.15, i * 0.05)
        );
      },

      share: () => {
        // Whoosh send
        this.playTone(400, 'sine', 0.06, 0.2);
        this.playTone(800, 'sine', 0.05, 0.15, 0.05);
        this.playTone(1200, 'sine', 0.04, 0.1, 0.1);
      },

      copy: () => {
        this.playTone(800, 'sine', 0.05, 0.08);
        this.playTone(1000, 'sine', 0.04, 0.07, 0.05);
      },

      download: () => {
        // Download complete
        [523, 659, 784, 1047, 1319].forEach((f, i) =>
          this.playTone(f, 'sine', 0.07, 0.18, i * 0.06)
        );
      },

      upload: () => {
        // Upload progress
        [523, 659, 784].forEach((f, i) =>
          this.playTone(f, 'sine', 0.06, 0.15, i * 0.08)
        );
      },

      // ─────────────────────────────────────────────────────────────────────
      // CART & COMMERCE
      // ─────────────────────────────────────────────────────────────────────
      addToCart: () => {
        // Cash register ding
        this.playChord([523, 659, 784], 'sine', 0.08, 0.15);
      },

      removeFromCart: () => {
        this.playTone(400, 'sawtooth', 0.05, 0.1);
      },

      checkout: () => {
        // Success fanfare
        [523, 659, 784, 1047, 1319, 1568].forEach((f, i) =>
          this.playTone(f, 'sine', 0.09, 0.22, i * 0.07)
        );
      },

      payment: () => {
        // Payment success
        this.playChord([659, 784, 988, 1175], 'sine', 0.08, 0.2);
      },

      // ─────────────────────────────────────────────────────────────────────
      // FILTERS & SEARCH
      // ─────────────────────────────────────────────────────────────────────
      filter: () => {
        this.playTone(600, 'triangle', 0.04, 0.08);
      },

      search: () => {
        this.playTone(700, 'sine', 0.05, 0.1);
        this.playTone(900, 'sine', 0.04, 0.08, 0.05);
      },

      clearFilters: () => {
        [600, 500, 400].forEach((f, i) =>
          this.playTone(f, 'triangle', 0.04, 0.08, i * 0.04)
        );
      },

      // ─────────────────────────────────────────────────────────────────────
      // TOGGLE & SWITCHES
      // ─────────────────────────────────────────────────────────────────────
      toggleOn: () => {
        this.playTone(700, 'triangle', 0.06, 0.1);
        this.playTone(900, 'triangle', 0.05, 0.08, 0.05);
      },

      toggleOff: () => {
        this.playTone(700, 'triangle', 0.05, 0.08);
        this.playTone(500, 'triangle', 0.04, 0.06, 0.04);
      },

      // ─────────────────────────────────────────────────────────────────────
      // AI & STUDIO
      // ─────────────────────────────────────────────────────────────────────
      aiThinking: () => {
        // Pulsing AI sound
        [200, 300, 400, 500, 600, 700, 800].forEach((f, i) =>
          this.playTone(f, 'sine', 0.04, 0.15, i * 0.04)
        );
      },

      aiResponse: () => {
        // AI completion
        [784, 988, 1175, 1568].forEach((f, i) =>
          this.playTone(f, 'sine', 0.08, 0.2, i * 0.08)
        );
      },

      generate: () => {
        // Generation start
        this.playChord([440, 554, 659, 880], 'sine', 0.07, 0.18);
      },

      // ─────────────────────────────────────────────────────────────────────
      // ACHIEVEMENTS & GAMIFICATION
      // ─────────────────────────────────────────────────────────────────────
      achievement: () => {
        // Epic achievement fanfare
        [784, 1047, 1319, 1568, 2093].forEach((f, i) =>
          this.playTone(f, 'sine', 0.1, 0.25, i * 0.09)
        );
      },

      levelUp: () => {
        // Level up sound
        [523, 659, 784, 1047, 1319].forEach((f, i) =>
          this.playTone(f, 'sine', 0.09, 0.22, i * 0.08)
        );
      },

      streak: () => {
        // Streak maintained
        [600, 700, 800, 900, 1000, 1100].forEach((f, i) =>
          this.playTone(f, 'triangle', 0.06, 0.15, i * 0.04)
        );
      },

      badge: () => {
        // Badge earned
        this.playChord([659, 784, 988, 1175], 'sine', 0.08, 0.18);
      },

      // ─────────────────────────────────────────────────────────────────────
      // COURSES & LEARNING
      // ─────────────────────────────────────────────────────────────────────
      lessonComplete: () => {
        this.playChord([523, 659, 784, 1047], 'sine', 0.08, 0.2);
      },

      quizCorrect: () => {
        [523, 784, 1047].forEach((f, i) =>
          this.playTone(f, 'sine', 0.09, 0.2, i * 0.07)
        );
      },

      quizWrong: () => {
        [350, 250].forEach((f, i) =>
          this.playTone(f, 'sawtooth', 0.06, 0.15, i * 0.08)
        );
      },

      courseComplete: () => {
        // Course completion fanfare
        [523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) =>
          this.playTone(f, 'sine', 0.1, 0.28, i * 0.08)
        );
      },

      // ─────────────────────────────────────────────────────────────────────
      // SPECIAL EVENTS
      // ─────────────────────────────────────────────────────────────────────
      boot: () => {
        // App startup
        [261, 329, 392, 523, 659].forEach((f, i) =>
          this.playTone(f, 'sine', 0.07, 0.22, i * 0.1)
        );
      },

      confetti: () => {
        // Celebration
        [400, 500, 600, 700, 800, 900, 1000, 1100, 1200].forEach((f, i) =>
          this.playTone(f, 'sine', 0.1, 0.25, i * 0.05)
        );
      },

      notification: () => {
        // Gentle notification
        this.playTone(880, 'sine', 0.06, 0.12);
        this.playTone(1100, 'sine', 0.05, 0.1, 0.08);
      },

      // ─────────────────────────────────────────────────────────────────────
      // THEME & SETTINGS
      // ─────────────────────────────────────────────────────────────────────
      themeChange: () => {
        [300, 400, 500, 600].forEach((f, i) =>
          this.playTone(f, 'sine', 0.05, 0.12, i * 0.04)
        );
      },

      languageChange: () => {
        this.playTone(700, 'sine', 0.06, 0.1);
        this.playTone(900, 'sine', 0.05, 0.1, 0.06);
      },
    };

    const soundFn = sounds[soundName];
    if (soundFn) {
      soundFn();
    } else {
      console.warn(`Sound "${soundName}" not found`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONTROLS
  // ═══════════════════════════════════════════════════════════════════════

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

  getVolume() {
    return this.volume;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Export singleton instance
export const SoundSystem = new PremiumSoundSystem();
