/**
 * FLAGSHIP SOUND SYSTEM
 * Premium audio feedback with Web Audio API
 * Frequencies tuned for premium feel
 */

class FlagshipSoundSystem {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.volume = 0.3;
    this.initialized = false;
  }

  // Initialize audio context (must be called after user interaction)
  init() {
    if (this.initialized) return;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  // Create oscillator with envelope
  createTone(frequency, duration, type = 'sine', envelope = {}) {
    if (!this.enabled || !this.context) return;

    const {
      attack = 0.01,
      decay = 0.1,
      sustain = 0.7,
      release = 0.2,
    } = envelope;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

    // ADSR envelope
    const now = this.context.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume, now + attack);
    gainNode.gain.linearRampToValueAtTime(this.volume * sustain, now + attack + decay);
    gainNode.gain.setValueAtTime(this.volume * sustain, now + duration - release);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Create chord (multiple frequencies)
  createChord(frequencies, duration, type = 'sine') {
    frequencies.forEach((freq) => {
      this.createTone(freq, duration, type);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // INTERACTION SOUNDS
  // ═══════════════════════════════════════════════════════════════

  // Button tap - crisp, satisfying
  tap() {
    this.createTone(800, 0.08, 'sine', {
      attack: 0.005,
      decay: 0.02,
      sustain: 0.3,
      release: 0.05,
    });
  }

  // Button press - deeper, more substantial
  press() {
    this.createTone(400, 0.12, 'sine', {
      attack: 0.01,
      decay: 0.03,
      sustain: 0.5,
      release: 0.08,
    });
  }

  // Success - uplifting chord
  success() {
    this.createChord([523.25, 659.25, 783.99], 0.3, 'sine'); // C5, E5, G5
  }

  // Error - attention-grabbing
  error() {
    this.createTone(200, 0.15, 'square', {
      attack: 0.01,
      decay: 0.05,
      sustain: 0.4,
      release: 0.09,
    });
  }

  // Warning - alert but not harsh
  warning() {
    this.createTone(600, 0.1, 'triangle', {
      attack: 0.01,
      decay: 0.03,
      sustain: 0.5,
      release: 0.06,
    });
  }

  // Navigation - subtle transition
  navigate() {
    this.createTone(1000, 0.06, 'sine', {
      attack: 0.005,
      decay: 0.015,
      sustain: 0.4,
      release: 0.04,
    });
  }

  // Modal open - welcoming
  modalOpen() {
    this.createChord([440, 554.37], 0.2, 'sine'); // A4, C#5
  }

  // Modal close - dismissive
  modalClose() {
    this.createChord([554.37, 440], 0.15, 'sine'); // C#5, A4 (reversed)
  }

  // Toggle on - positive
  toggleOn() {
    this.createTone(880, 0.08, 'sine', {
      attack: 0.005,
      decay: 0.02,
      sustain: 0.5,
      release: 0.05,
    });
  }

  // Toggle off - neutral
  toggleOff() {
    this.createTone(440, 0.08, 'sine', {
      attack: 0.005,
      decay: 0.02,
      sustain: 0.5,
      release: 0.05,
    });
  }

  // Swipe - fluid motion
  swipe() {
    const now = this.context?.currentTime || 0;
    const oscillator = this.context?.createOscillator();
    const gainNode = this.context?.createGain();

    if (!oscillator || !gainNode) return;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

    gainNode.gain.setValueAtTime(this.volume * 0.5, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  // Pull to refresh - anticipation
  pullRefresh() {
    const now = this.context?.currentTime || 0;
    const oscillator = this.context?.createOscillator();
    const gainNode = this.context?.createGain();

    if (!oscillator || !gainNode) return;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.15);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.6, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  // Notification - gentle alert
  notification() {
    this.createChord([659.25, 783.99, 987.77], 0.25, 'sine'); // E5, G5, B5
  }

  // Focus - subtle acknowledgment
  focus() {
    this.createTone(1200, 0.05, 'sine', {
      attack: 0.005,
      decay: 0.01,
      sustain: 0.3,
      release: 0.03,
    });
  }

  // Blur - soft exit
  blur() {
    this.createTone(800, 0.05, 'sine', {
      attack: 0.005,
      decay: 0.01,
      sustain: 0.3,
      release: 0.03,
    });
  }

  // Hover - micro feedback
  hover() {
    this.createTone(1400, 0.03, 'sine', {
      attack: 0.003,
      decay: 0.007,
      sustain: 0.2,
      release: 0.02,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Play custom frequency
  play(frequency, duration = 0.1, type = 'sine') {
    this.createTone(frequency, duration, type);
  }

  // Play custom chord
  playChord(frequencies, duration = 0.2, type = 'sine') {
    this.createChord(frequencies, duration, type);
  }
}

// Create singleton instance
const soundSystem = new FlagshipSoundSystem();

// Auto-initialize on first user interaction
if (typeof window !== 'undefined') {
  const initOnInteraction = () => {
    soundSystem.init();
    document.removeEventListener('click', initOnInteraction);
    document.removeEventListener('touchstart', initOnInteraction);
  };

  document.addEventListener('click', initOnInteraction, { once: true });
  document.addEventListener('touchstart', initOnInteraction, { once: true });
}

export default soundSystem;

// Named exports for convenience
export const {
  tap,
  press,
  success,
  error,
  warning,
  navigate,
  modalOpen,
  modalClose,
  toggleOn,
  toggleOff,
  swipe,
  pullRefresh,
  notification,
  focus,
  blur,
  hover,
} = soundSystem;
