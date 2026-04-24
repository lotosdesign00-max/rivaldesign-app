/**
 * SFX — Audio engine for Rival Space
 * Web Audio API oscillator-based sound effects with Telegram haptic integration.
 *
 * All sounds are procedurally generated — no audio files needed.
 * Volume and enable/disable are controlled via setSoundEnabled / setVolume.
 */

import { tgHaptic, tgNotif, tgSelection, tgHapticMedium, tgHapticHeavy, tgNotifSuccess, tgNotifError } from "../utils/tma";

let _actx = null;
let _master = null;
let _soundEnabled = true;
let _volume = 0.55;
let _audioUnlocked = false;

// Дополнительные эффекты
let _ambientNode = null;
let _ambientGain = null;

function actx() {
  if (!_actx) {
    try {
      _actx = new (window.AudioContext || window.webkitAudioContext)();
      _master = _actx.createGain();
      _master.connect(_actx.destination);
    } catch {}
  }
  return _actx;
}

function unlockAudio() {
  _audioUnlocked = true;
  try { actx()?.resume?.(); } catch {}
}

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });
}

// Космический reverb эффект
function createReverb(duration = 1.5, decay = 2) {
  const c = actx();
  if (!c) return null;
  try {
    const convolver = c.createConvolver();
    const rate = c.sampleRate;
    const length = rate * duration;
    const impulse = c.createBuffer(2, length, rate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    convolver.buffer = impulse;
    return convolver;
  } catch {
    return null;
  }
}

// Космический ambient drone
function createAmbientDrone() {
  const c = actx();
  if (!c) return;
  try {
    const osc1 = c.createOscillator();
    const osc2 = c.createOscillator();
    const gain = c.createGain();
    const filter = c.createBiquadFilter();

    osc1.type = "sine";
    osc1.frequency.value = 55; // Низкая частота
    osc2.type = "sine";
    osc2.frequency.value = 82.5; // Квинта

    filter.type = "lowpass";
    filter.frequency.value = 200;
    filter.Q.value = 1;

    gain.gain.value = 0;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(_master);

    _ambientNode = { osc1, osc2 };
    _ambientGain = gain;
  } catch {}
}

function note(f, t = "sine", v = 0.07, d = 0.12, delay = 0) {
  if (!_soundEnabled || !_audioUnlocked) return;
  const c = actx();
  if (!c || !_master) return;
  try {
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(_master);
    _master.gain.value = _volume;
    o.type = t;
    o.frequency.value = f;
    const n = c.currentTime + delay;
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(v, n + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, n + d);
    o.start(n);
    o.stop(n + d + 0.05);
  } catch {}
}

// Космическая нота с reverb
function spaceNote(f, v = 0.05, d = 0.4, delay = 0) {
  if (!_soundEnabled || !_audioUnlocked) return;
  const c = actx();
  if (!c || !_master) return;
  try {
    const o = c.createOscillator();
    const g = c.createGain();
    const reverb = createReverb(0.8, 2.5);
    o.connect(g);
    g.connect(_master);
    if (reverb) {
      const dryGain = c.createGain();
      dryGain.gain.value = 0.7;
      const wetGain = c.createGain();
      wetGain.gain.value = 0.3;
      g.connect(dryGain);
      dryGain.connect(_master);
      g.connect(reverb);
      reverb.connect(wetGain);
      wetGain.connect(_master);
    } else {
      g.connect(_master);
    }
    _master.gain.value = _volume;
    o.type = "sine";
    o.frequency.value = f;
    const n = c.currentTime + delay;
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(v, n + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, n + d);
    o.start(n);
    o.stop(n + d + 0.1);
  } catch {}
}

export const SFX = {
  tap: () => { note(880, "sine", .05, .07); tgHaptic("light"); },
  tab: () => { note(660, "triangle", .06, .09); note(880, "sine", .04, .07, .04); tgSelection(); },
  open: () => { [440, 660, 880].forEach((f, i) => note(f, "sine", .06, .14, i * .04)); tgHaptic("medium"); },
  close: () => { [880, 660, 440].forEach((f, i) => note(f, "sine", .05, .1, i * .03)); },
  success: () => { [523, 659, 784, 1047].forEach((f, i) => note(f, "sine", .08, .18, i * .07)); tgNotifSuccess(); },
  error: () => { [350, 250].forEach((f, i) => note(f, "sawtooth", .06, .15, i * .06)); tgNotifError(); },
  addCart: () => { [523, 659, 784].forEach((f, i) => note(f, "sine", .07, .12, i * .05)); tgHapticMedium(); },
  remove: () => { note(280, "sawtooth", .05, .13); tgHaptic("light"); },
  clear: () => { [380, 280, 180].forEach((f, i) => note(f, "sawtooth", .05, .1, i * .05)); tgHapticHeavy(); },
  order: () => { [261, 329, 392, 523, 659, 784].forEach((f, i) => note(f, "sine", .09, .2, i * .06)); tgNotifSuccess(); },
  theme: () => { [300, 400, 500, 600].forEach((f, i) => note(f, "sine", .05, .12, i * .04)); tgHapticMedium(); },
  lang: () => { note(700, "sine", .06, .1); note(900, "sine", .05, .1, .06); tgSelection(); },
  ai: () => { [200, 300, 400, 500, 600, 700, 800].forEach((f, i) => note(f, "sine", .04, .14, i * .04)); tgHapticMedium(); },
  aiDone: () => { [784, 988, 1175, 1568].forEach((f, i) => note(f, "sine", .08, .2, i * .08)); tgNotifSuccess(); },
  like: () => { note(880, "sine", .07, .14); note(1100, "sine", .05, .1, .07); tgHaptic("light"); },
  copy: () => { note(800, "sine", .05, .08); note(1000, "sine", .04, .07, .05); tgHaptic("light"); },
  filter: () => { note(600, "triangle", .04, .08); tgSelection(); },
  toggle: () => { note(700, "triangle", .05, .1); tgSelection(); },
  drawer: () => { [500, 700].forEach((f, i) => note(f, "sine", .05, .12, i * .05)); tgHapticMedium(); },
  wishlist: () => { note(660, "sine", .07, .12); note(880, "sine", .05, .1, .07); tgHapticMedium(); },
  confetti: () => { [400, 500, 600, 700, 800, 900, 1000].forEach((f, i) => note(f, "sine", .1, .25, i * .05)); tgNotifSuccess(); },
  boot: () => [261, 329, 392, 523].forEach((f, i) => spaceNote(f, .06, .35, i * .12)),
  course: () => { [440, 554, 659, 880].forEach((f, i) => note(f, "sine", .06, .16, i * .06)); tgHapticMedium(); },
  levelUp: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, "sine", .09, .22, i * .08)); tgNotifSuccess(); },
  streak: () => { [600, 700, 800, 900, 1000, 1100].forEach((f, i) => note(f, "triangle", .05, .12, i * .04)); tgNotifSuccess(); },
  promo: () => { [784, 988, 1175].forEach((f, i) => note(f, "sine", .08, .18, i * .06)); tgNotifSuccess(); },
  quiz: () => { note(440, "triangle", .06, .12); tgHaptic("light"); },
  quizCorrect: () => { [523, 784, 1047].forEach((f, i) => note(f, "sine", .09, .2, i * .07)); tgNotifSuccess(); },
  quizWrong: () => { [300, 200].forEach((f, i) => note(f, "sawtooth", .06, .15, i * .08)); tgNotifError(); },
  achievement: () => { [784, 1047, 1319, 1568].forEach((f, i) => note(f, "sine", .1, .25, i * .09)); tgNotifSuccess(); },
  ping: () => { note(1200, "sine", .04, .06); },

  // Космические звуки
  launch: () => {
    // Запуск/отправка — космический whoosh
    [150, 200, 300, 500, 800].forEach((f, i) => note(f, "sawtooth", .04, .3, i * .03));
    tgHapticHeavy();
  },
  arrival: () => {
    // Прибытие — мягкое приземление
    [300, 250, 200].forEach((f, i) => spaceNote(f, .05, .4, i * .08));
    tgHapticMedium();
  },
  transmission: () => {
    // Передача данных — цифровой звук
    [800, 1000, 1200, 1000, 800].forEach((f, i) => note(f, "square", .03, .08, i * .04));
    tgHaptic("light");
  },
  anomaly: () => {
    // Аномалия — странный звук
    [200, 250, 200, 180, 220].forEach((f, i) => note(f, "sawtooth", .06, .2, i * .06));
    tgHaptic("heavy");
  },
  systemOnline: () => {
    // Система онлайн — последовательность
    [261, 329, 392, 523, 659].forEach((f, i) => spaceNote(f, .07, .5, i * .15));
    tgNotifSuccess();
  },
  warning: () => {
    // Предупреждение
    [400, 300, 400, 300].forEach((f, i) => note(f, "square", .05, .15, i * .1));
    tgNotif("warning");
  },

  // Управление ambient звуком
  startAmbient: () => {
    if (_ambientGain) return;
    createAmbientDrone();
    if (_ambientGain) {
      const c = actx();
      _ambientGain.gain.linearRampToValueAtTime(_volume * 0.15, c.currentTime + 2);
      _ambientNode?.osc1?.start?.();
      _ambientNode?.osc2?.start?.();
    }
  },
  stopAmbient: () => {
    if (_ambientGain) {
      const c = actx();
      _ambientGain.gain.linearRampToValueAtTime(0, c.currentTime + 1);
      setTimeout(() => {
        _ambientNode?.osc1?.stop?.();
        _ambientNode?.osc2?.stop?.();
        _ambientNode = null;
        _ambientGain = null;
      }, 1500);
    }
  },
};

/**
 * Control functions — call these from settings/context.
 */
export function setSoundEnabled(enabled) {
  _soundEnabled = enabled;
}

export function setVolume(vol) {
  _volume = vol;
  if (_master) _master.gain.value = vol;
}

export function getSoundEnabled() {
  return _soundEnabled;
}

export function getVolume() {
  return _volume;
}

// Экспорт для совместимости с AppLegacy
export { _soundEnabled, _volume };
