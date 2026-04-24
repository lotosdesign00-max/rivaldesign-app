/**
 * EnhancedStyles — улучшенная система стилей
 * Премиум CSS с продвинутыми эффектами
 */

export const EnhancedStyles = `
/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   БАЗОВЫЕ СТИЛИ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

:root {
  /* Colors - Deep Space Theme */
  --color-bg: #030408;
  --color-surface: rgba(13,15,26,0.80);
  --color-card: rgba(13,15,26,0.85);
  --color-border: rgba(99,102,241,0.14);
  --color-border-bright: rgba(99,102,241,0.30);

  /* Accent Colors */
  --color-indigo: #6366f1;
  --color-violet: #8b5cf6;
  --color-cyan: #22d3ee;
  --color-emerald: #10b981;
  --color-gold: #f59e0b;
  --color-red: #ef4444;

  /* Text Colors */
  --color-text: rgba(224,231,255,0.95);
  --color-text-sub: rgba(100,116,139,0.80);
  --color-text-muted: rgba(100,116,139,0.60);

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-accent: linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #22d3ee 100%);
  --gradient-gold: linear-gradient(135deg, #f59e0b, #d97706);

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(3,4,8,0.2);
  --shadow-md: 0 4px 16px rgba(3,4,8,0.25);
  --shadow-lg: 0 8px 28px rgba(3,4,8,0.3);
  --shadow-xl: 0 12px 40px rgba(3,4,8,0.35);
  --shadow-glow: 0 0 40px rgba(99,102,241,0.3);

  /* Spacing (8px rhythm) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 22px;
  --radius-full: 999px;

  /* Typography Scale */
  --font-xs: 10px;
  --font-sm: 12px;
  --font-base: 14px;
  --font-md: 16px;
  --font-lg: 18px;
  --font-xl: 22px;
  --font-2xl: 26px;
  --font-3xl: 32px;

  /* Transitions */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   GLASSMORPHISM
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.glass {
  background: rgba(13,15,26,0.70);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
}

.glass-strong {
  background: rgba(13,15,26,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(99,102,241,0.15);
}

.glass-light {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   ГРАДИЕНТЫ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.gradient-text {
  background: linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-border {
  position: relative;
  border: 1px solid transparent;
  background-clip: padding-box;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #22d3ee);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   СВЕЧЕНИЯ (GLOWS)
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.glow-indigo {
  box-shadow: 0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.2);
}

.glow-violet {
  box-shadow: 0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.2);
}

.glow-cyan {
  box-shadow: 0 0 30px rgba(34,211,238,0.4), 0 0 60px rgba(34,211,238,0.2);
}

.glow-gold {
  box-shadow: 0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(245,158,11,0.2);
}

.glow-pulse {
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   КНОПКИ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-normal);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  overflow: hidden;
}

.btn-primary {
  background: var(--gradient-primary);
  color: #fff;
  border: 1px solid rgba(99,102,241,0.3);
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
}

.btn-primary:hover {
  box-shadow: 0 12px 32px rgba(99,102,241,0.45);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: scale(0.96);
}

/* Phase C: Shared Interaction Patterns */
.pressable {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.15s ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.pressable:active {
  transform: scale(0.94);
}

.touch-target {
  min-width: 44px;
  min-height: 44px;
}

@media (prefers-reduced-motion: reduce) {
  .pressable,
  .pressable:active,
  .btn-primary,
  .btn-primary:active {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }
}

.btn-secondary {
  background: rgba(99,102,241,0.12);
  color: #c7d2fe;
  border: 1px solid rgba(99,102,241,0.25);
}

.btn-secondary:hover {
  background: rgba(99,102,241,0.18);
  border-color: rgba(99,102,241,0.35);
}

.btn-ghost {
  background: transparent;
  color: rgba(165,180,252,0.85);
  border: 1px solid rgba(99,102,241,0.15);
}

.btn-ghost:hover {
  background: rgba(99,102,241,0.08);
  border-color: rgba(99,102,241,0.25);
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   КАРТОЧКИ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all var(--transition-normal);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl), 0 0 0 1px rgba(99,102,241,0.2);
  border-color: var(--color-border-bright);
}

.card-glow {
  position: relative;
}

.card-glow::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: radial-gradient(circle at center, rgba(99,102,241,0.3), transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
  filter: blur(12px);
}

.card-glow:hover::before {
  opacity: 1;
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   ЭФФЕКТЫ НАВЕДЕНИЯ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.hover-lift {
  transition: transform var(--transition-normal);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-scale {
  transition: transform var(--transition-normal);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow {
  transition: all var(--transition-normal);
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(99,102,241,0.4);
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   СКРОЛЛБАРЫ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(13,15,26,0.5);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(99,102,241,0.3);
  border-radius: 4px;
  transition: background var(--transition-fast);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(99,102,241,0.5);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   УТИЛИТЫ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.no-tap-highlight {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.smooth-scroll {
  scroll-behavior: smooth;
}

.backdrop-blur {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.text-gradient {
  background: linear-gradient(135deg, #e0e7ff, #a5b4fc, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   АДАПТИВНОСТЬ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

@media (max-width: 768px) {
  :root {
    --space-lg: 12px;
    --space-xl: 16px;
  }

  .card {
    padding: var(--space-md);
  }

  .btn {
    padding: 10px 16px;
    font-size: 12px;
  }
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   ТЕМНАЯ ТЕМА (по умолчанию)
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   ПРОИЗВОДИТЕЛЬНОСТЬ
   в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */

.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

.gpu-accelerated {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* Phase D: Visual Upgrade - Consistent Design Tokens */
.visually-consistent {
  font-size: var(--font-base);
  line-height: 1.5;
  letter-spacing: -0.01em;
}

.heading-xl { font-size: var(--font-3xl); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; }
.heading-lg { font-size: var(--font-2xl); font-weight: 900; letter-spacing: -0.02em; line-height: 1.15; }
.heading-md { font-size: var(--font-xl); font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
.heading-sm { font-size: var(--font-lg); font-weight: 700; letter-spacing: -0.01em; line-height: 1.3; }

.body-lg { font-size: var(--font-md); font-weight: 400; line-height: 1.6; }
.body-md { font-size: var(--font-base); font-weight: 400; line-height: 1.5; }
.body-sm { font-size: var(--font-sm); font-weight: 400; line-height: 1.5; }
.body-xs { font-size: var(--font-xs); font-weight: 500; line-height: 1.4; letter-spacing: 0.02em; }

.text-primary { color: var(--color-text); }
.text-secondary { color: var(--color-text-sub); }
.text-muted { color: var(--color-text-muted); }

.bg-surface { background: var(--color-surface); }
.bg-card { background: var(--color-card); }

/* Consistent spacing with 8px rhythm */
.p-v-xs { padding-top: var(--space-xs); padding-bottom: var(--space-xs); }
.p-v-sm { padding-top: var(--space-sm); padding-bottom: var(--space-sm); }
.p-v-md { padding-top: var(--space-md); padding-bottom: var(--space-md); }
.p-v-lg { padding-top: var(--space-lg); padding-bottom: var(--space-lg); }
.p-v-xl { padding-top: var(--space-xl); padding-bottom: var(--space-xl); }

.g-v-xs { gap: var(--space-xs); }
.g-v-sm { gap: var(--space-sm); }
.g-v-md { gap: var(--space-md); }
.g-v-lg { gap: var(--space-lg); }
.g-v-xl { gap: var(--space-xl); }

/* Consistent border radius */
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }

/* Consistent shadows */
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }

export default EnhancedStyles;

