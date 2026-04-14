/**
 * EnhancedSoundSystem — улучшенная система звуков
 * Более богатые и приятные звуковые эффекты
 */

let _actx = null;
let _master = null;
let _soundEnabled = true;
let _volume = 0.55;
let _audioUnlocked = false;

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
  try {
    actx()?.resume?.();
  } catch {}
}

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });
}

// Улучшенная функция для создания нот с envelope
function note(f, t = "sine", v = 0.07, d = 0.12, delay = 0, envelope = "default") {
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

    // Разные envelope для разных звуков
    if (envelope === "soft") {
      g.gain.setValueAtTime(0, n);
      g.gain.linearRampToValueAtTime(v, n + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, n + d);
    } else if (envelope === "sharp") {
      g.gain.setValueAtTime(v, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + d);
    } else if (envelope === "pluck") {
      g.gain.setValueAtTime(v, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + d * 0.3);
    } else {
      // default
      g.gain.setValueAtTime(0, n);
      g.gain.linearRampToValueAtTime(v, n + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, n + d);
    }

    o.start(n);
    o.stop(n + d + 0.05);
  } catch {}
}

// Функция для создания аккордов
function chord(frequencies, type = "sine", volume = 0.05, duration = 0.15, delay = 0) {
  frequencies.forEach((f, i) => {
    note(f, type, volume * (1 - i * 0.1), duration, delay, "soft");
  });
}

// Haptic feedback (если доступен)
const tgHaptic = (t = "light") => {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(t);
  } catch {}
};

const tgNotif = (t = "success") => {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.(t);
  } catch {}
};

// Улучшенные звуковые эффекты
export const EnhancedSFX = {
  // Базовые взаимодействия
  tap: () => {
    note(880, "sine", 0.04, 0.06, 0, "sharp");
    tgHaptic("light");
  },

  tapSoft: () => {
    note(660, "sine", 0.03, 0.08, 0, "soft");
    tgHaptic("light");
  },

  // Переключение табов - более мелодичное
  tab: () => {
    chord([523, 659, 784], "sine", 0.04, 0.12);
    tgHaptic("light");
  },

  // Открытие модалок - восходящий аккорд
  open: () => {
    [392, 494, 587, 698].forEach((f, i) => note(f, "sine", 0.05, 0.16, i * 0.04, "soft"));
    tgHaptic("medium");
  },

  // Закрытие - нисходящий
  close: () => {
    [698, 587, 494].forEach((f, i) => note(f, "sine", 0.04, 0.12, i * 0.03, "soft"));
    tgHaptic("light");
  },

  // Успех - мажорный аккорд
  success: () => {
    chord([523, 659, 784, 1047], "sine", 0.07, 0.25);
    setTimeout(() => chord([659, 784, 1047], "sine", 0.05, 0.2), 100);
    tgNotif("success");
  },

  // Ошибка - диссонанс
  error: () => {
    note(350, "sawtooth", 0.06, 0.15, 0, "sharp");
    note(250, "sawtooth", 0.05, 0.18, 0.06, "sharp");
    tgNotif("error");
  },

  // Добавление в корзину - приятный звон
  addCart: () => {
    [659, 784, 988, 1175].forEach((f, i) => note(f, "sine", 0.06, 0.14, i * 0.04, "pluck"));
    tgHaptic("medium");
  },

  // Удаление - короткий свуп вниз
  remove: () => {
    note(440, "triangle", 0.04, 0.1, 0, "sharp");
    note(330, "triangle", 0.03, 0.08, 0.05, "sharp");
    tgHaptic("light");
  },

  // Очистка корзины
  clear: () => {
    [440, 330, 220].forEach((f, i) => note(f, "sawtooth", 0.04, 0.12, i * 0.05, "sharp"));
    tgHaptic("heavy");
  },

  // Оформление заказа - праздничный
  order: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, "sine", 0.08, 0.22, i * 0.06, "soft"));
    setTimeout(() => chord([523, 659, 784, 1047], "sine", 0.06, 0.3), 300);
    tgNotif("success");
  },

  // Смена темы - плавный переход
  theme: () => {
    [440, 554, 659, 784].forEach((f, i) => note(f, "triangle", 0.04, 0.14, i * 0.04, "soft"));
    tgHaptic("medium");
  },

  // Смена языка
  lang: () => {
    note(784, "sine", 0.05, 0.1, 0, "soft");
    note(988, "sine", 0.04, 0.1, 0.06, "soft");
    tgHaptic("light");
  },

  // AI генерация - футуристичный
  ai: () => {
    [220, 277, 330, 392, 440, 523, 659, 784].forEach((f, i) =>
      note(f, "sine", 0.03, 0.16, i * 0.03, "soft")
    );
    tgHaptic("medium");
  },

  // AI завершил - триумфальный
  aiDone: () => {
    chord([784, 988, 1175, 1568], "sine", 0.08, 0.3);
    setTimeout(() => chord([988, 1175, 1568], "sine", 0.06, 0.25), 150);
    tgNotif("success");
  },

  // Лайк - сердечко
  like: () => {
    note(1047, "sine", 0.06, 0.12, 0, "pluck");
    note(1319, "sine", 0.05, 0.1, 0.06, "pluck");
    tgHaptic("light");
  },

  // Копирование
  copy: () => {
    note(880, "sine", 0.04, 0.08, 0, "sharp");
    note(1047, "sine", 0.03, 0.07, 0.04, "sharp");
    tgHaptic("light");
  },

  // Фильтр
  filter: () => {
    note(659, "triangle", 0.03, 0.09, 0, "soft");
    tgHaptic("light");
  },

  // Переключатель
  toggle: () => {
    note(784, "triangle", 0.04, 0.1, 0, "pluck");
    tgHaptic("light");
  },

  // Drawer
  drawer: () => {
    [523, 659, 784].forEach((f, i) => note(f, "sine", 0.04, 0.14, i * 0.04, "soft"));
    tgHaptic("medium");
  },

  // Wishlist
  wishlist: () => {
    chord([659, 784, 988], "sine", 0.06, 0.15);
    tgHaptic("medium");
  },

  // Конфетти - праздничный каскад
  confetti: () => {
    [523, 659, 784, 988, 1175, 1319, 1568].forEach((f, i) =>
      note(f, "sine", 0.08, 0.25, i * 0.05, "soft")
    );
    setTimeout(() => chord([784, 988, 1175, 1568], "sine", 0.07, 0.3), 350);
    tgNotif("success");
  },

  // Загрузка приложения
  boot: () => {
    [261, 329, 392, 523, 659].forEach((f, i) => note(f, "sine", 0.06, 0.2, i * 0.1, "soft"));
    tgHaptic("medium");
  },

  // Курс
  course: () => {
    chord([440, 554, 659, 880], "sine", 0.05, 0.18);
    tgHaptic("medium");
  },

  // Level up - эпичный
  levelUp: () => {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) =>
      note(f, "sine", 0.09, 0.25, i * 0.08, "soft")
    );
    setTimeout(() => chord([784, 1047, 1319, 1568], "sine", 0.08, 0.35), 400);
    tgNotif("success");
  },

  // Streak
  streak: () => {
    [659, 784, 988, 1175, 1319, 1568].forEach((f, i) =>
      note(f, "triangle", 0.05, 0.14, i * 0.04, "pluck")
    );
    tgNotif("success");
  },

  // Промокод
  promo: () => {
    chord([784, 988, 1175, 1568], "sine", 0.07, 0.2);
    tgNotif("success");
  },

  // Достижение - величественный
  achievement: () => {
    [784, 988, 1175, 1319, 1568, 1976].forEach((f, i) =>
      note(f, "sine", 0.1, 0.28, i * 0.09, "soft")
    );
    setTimeout(() => chord([988, 1175, 1319, 1568, 1976], "sine", 0.08, 0.4), 500);
    tgNotif("success");
  },

  // Пинг - короткий
  ping: () => {
    note(1319, "sine", 0.03, 0.05, 0, "sharp");
  },

  // Свайп
  swipe: () => {
    note(523, "triangle", 0.03, 0.08, 0, "soft");
    tgHaptic("light");
  },

  // Hover (для десктопа)
  hover: () => {
    note(1047, "sine", 0.02, 0.06, 0, "soft");
  },
};

// Управление звуком
export const SoundControl = {
  enable: () => {
    _soundEnabled = true;
  },
  disable: () => {
    _soundEnabled = false;
  },
  toggle: () => {
    _soundEnabled = !_soundEnabled;
    return _soundEnabled;
  },
  setVolume: (v) => {
    _volume = Math.max(0, Math.min(1, v));
  },
  getVolume: () => _volume,
  isEnabled: () => _soundEnabled,
};

export default EnhancedSFX;

