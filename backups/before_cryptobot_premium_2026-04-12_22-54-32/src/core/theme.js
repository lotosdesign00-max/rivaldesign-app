/**
 * THEME SYSTEM
 * Complete design system with multiple themes
 */

export const themes = {
  // ═══════════════════════════════════════════════════════════════
  // DEEP SPACE (Default) — Premium Dark
  // ═══════════════════════════════════════════════════════════════
  deepspace: {
    id: 'deepspace',
    name: 'Deep Space',
    emoji: '🌌',
    mode: 'dark',

    // Backgrounds
    bg: {
      primary: '#030408',
      secondary: '#0B0C12',
      tertiary: '#13141D',
      elevated: '#1B1C28',
      surface: '#23243A',
      overlay: 'rgba(3, 4, 8, 0.95)',
    },

    // Glass surfaces
    glass: {
      subtle: 'rgba(255, 255, 255, 0.02)',
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.09)',
      strong: 'rgba(255, 255, 255, 0.14)',
      ultra: 'rgba(255, 255, 255, 0.18)',
    },

    // Accent colors
    accent: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      tertiary: '#22D3EE',
      light: '#C7D2FE',
      dark: '#5B21B6',
    },

    // Semantic colors
    semantic: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },

    // Text colors
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(255, 255, 255, 0.85)',
      tertiary: 'rgba(255, 255, 255, 0.60)',
      disabled: 'rgba(255, 255, 255, 0.35)',
      muted: 'rgba(255, 255, 255, 0.45)',
    },

    // Borders
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.15)',
      strong: 'rgba(139, 92, 246, 0.40)',
      glow: 'rgba(139, 92, 246, 0.60)',
      bright: 'rgba(139, 92, 246, 0.80)',
    },

    // Gradients
    gradient: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      secondary: 'linear-gradient(135deg, #22D3EE 0%, #0891B2 100%)',
      vibrant: 'linear-gradient(135deg, #F472B6 0%, #8B5CF6 50%, #22D3EE 100%)',
      subtle: 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)',
    },

    // Shadows
    shadow: {
      xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
      sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
      md: '0 4px 8px rgba(0, 0, 0, 0.15)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.2)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.25)',
      xxl: '0 24px 48px rgba(0, 0, 0, 0.3)',
      glow: '0 0 20px rgba(139, 92, 246, 0.5)',
      glowStrong: '0 0 40px rgba(139, 92, 246, 0.7)',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // LIGHT MODE — Clean & Professional
  // ═══════════════════════════════════════════════════════════════
  light: {
    id: 'light',
    name: 'Light',
    emoji: '☀️',
    mode: 'light',

    bg: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      elevated: '#FFFFFF',
      surface: '#F9FAFB',
      overlay: 'rgba(255, 255, 255, 0.95)',
    },

    glass: {
      subtle: 'rgba(0, 0, 0, 0.02)',
      light: 'rgba(0, 0, 0, 0.04)',
      medium: 'rgba(0, 0, 0, 0.06)',
      strong: 'rgba(0, 0, 0, 0.08)',
      ultra: 'rgba(0, 0, 0, 0.12)',
    },

    accent: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      tertiary: '#22D3EE',
      light: '#A78BFA',
      dark: '#7C3AED',
    },

    semantic: {
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
    },

    text: {
      primary: 'rgba(0, 0, 0, 0.95)',
      secondary: 'rgba(0, 0, 0, 0.75)',
      tertiary: 'rgba(0, 0, 0, 0.55)',
      disabled: 'rgba(0, 0, 0, 0.35)',
      muted: 'rgba(0, 0, 0, 0.45)',
    },

    border: {
      subtle: 'rgba(0, 0, 0, 0.08)',
      medium: 'rgba(0, 0, 0, 0.15)',
      strong: 'rgba(139, 92, 246, 0.40)',
      glow: 'rgba(139, 92, 246, 0.60)',
      bright: 'rgba(139, 92, 246, 0.80)',
    },

    gradient: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      secondary: 'linear-gradient(135deg, #22D3EE 0%, #0891B2 100%)',
      vibrant: 'linear-gradient(135deg, #F472B6 0%, #8B5CF6 50%, #22D3EE 100%)',
      subtle: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)',
    },

    shadow: {
      xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
      sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
      md: '0 4px 8px rgba(0, 0, 0, 0.12)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.18)',
      xxl: '0 24px 48px rgba(0, 0, 0, 0.22)',
      glow: '0 0 20px rgba(139, 92, 246, 0.3)',
      glowStrong: '0 0 40px rgba(139, 92, 246, 0.5)',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // CYBERPUNK — Neon & Vibrant
  // ═══════════════════════════════════════════════════════════════
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    emoji: '🌃',
    mode: 'dark',

    bg: {
      primary: '#0A0118',
      secondary: '#150228',
      tertiary: '#1F0438',
      elevated: '#2A0548',
      surface: '#350658',
      overlay: 'rgba(10, 1, 24, 0.95)',
    },

    glass: {
      subtle: 'rgba(255, 0, 255, 0.03)',
      light: 'rgba(255, 0, 255, 0.06)',
      medium: 'rgba(255, 0, 255, 0.10)',
      strong: 'rgba(255, 0, 255, 0.15)',
      ultra: 'rgba(255, 0, 255, 0.20)',
    },

    accent: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      tertiary: '#FFFF00',
      light: '#FF66FF',
      dark: '#CC00CC',
    },

    semantic: {
      success: '#00FF00',
      warning: '#FFAA00',
      error: '#FF0055',
      info: '#00AAFF',
    },

    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.90)',
      tertiary: 'rgba(255, 0, 255, 0.80)',
      disabled: 'rgba(255, 255, 255, 0.30)',
      muted: 'rgba(255, 255, 255, 0.50)',
    },

    border: {
      subtle: 'rgba(255, 0, 255, 0.15)',
      medium: 'rgba(255, 0, 255, 0.30)',
      strong: 'rgba(255, 0, 255, 0.60)',
      glow: 'rgba(255, 0, 255, 0.80)',
      bright: 'rgba(255, 0, 255, 1)',
    },

    gradient: {
      primary: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
      secondary: 'linear-gradient(135deg, #00FFFF 0%, #FFFF00 100%)',
      vibrant: 'linear-gradient(135deg, #FF0055 0%, #FF00FF 50%, #00FFFF 100%)',
      subtle: 'linear-gradient(180deg, rgba(255, 0, 255, 0.15) 0%, transparent 100%)',
    },

    shadow: {
      xs: '0 1px 2px rgba(255, 0, 255, 0.1)',
      sm: '0 2px 4px rgba(255, 0, 255, 0.2)',
      md: '0 4px 8px rgba(255, 0, 255, 0.3)',
      lg: '0 8px 16px rgba(255, 0, 255, 0.4)',
      xl: '0 16px 32px rgba(255, 0, 255, 0.5)',
      xxl: '0 24px 48px rgba(255, 0, 255, 0.6)',
      glow: '0 0 30px rgba(255, 0, 255, 0.8)',
      glowStrong: '0 0 60px rgba(255, 0, 255, 1)',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // MINIMAL — Clean & Elegant
  // ═══════════════════════════════════════════════════════════════
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    emoji: '⚪',
    mode: 'light',

    bg: {
      primary: '#FAFAFA',
      secondary: '#F5F5F5',
      tertiary: '#EEEEEE',
      elevated: '#FFFFFF',
      surface: '#F5F5F5',
      overlay: 'rgba(250, 250, 250, 0.95)',
    },

    glass: {
      subtle: 'rgba(0, 0, 0, 0.01)',
      light: 'rgba(0, 0, 0, 0.02)',
      medium: 'rgba(0, 0, 0, 0.04)',
      strong: 'rgba(0, 0, 0, 0.06)',
      ultra: 'rgba(0, 0, 0, 0.08)',
    },

    accent: {
      primary: '#000000',
      secondary: '#424242',
      tertiary: '#757575',
      light: '#9E9E9E',
      dark: '#000000',
    },

    semantic: {
      success: '#2E7D32',
      warning: '#F57C00',
      error: '#C62828',
      info: '#1565C0',
    },

    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.80)',
      tertiary: 'rgba(0, 0, 0, 0.60)',
      disabled: 'rgba(0, 0, 0, 0.30)',
      muted: 'rgba(0, 0, 0, 0.45)',
    },

    border: {
      subtle: 'rgba(0, 0, 0, 0.06)',
      medium: 'rgba(0, 0, 0, 0.12)',
      strong: 'rgba(0, 0, 0, 0.25)',
      glow: 'rgba(0, 0, 0, 0.40)',
      bright: 'rgba(0, 0, 0, 0.60)',
    },

    gradient: {
      primary: 'linear-gradient(135deg, #000000 0%, #424242 100%)',
      secondary: 'linear-gradient(135deg, #424242 0%, #757575 100%)',
      vibrant: 'linear-gradient(135deg, #000000 0%, #424242 50%, #757575 100%)',
      subtle: 'linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, transparent 100%)',
    },

    shadow: {
      xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
      sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
      md: '0 4px 8px rgba(0, 0, 0, 0.08)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.10)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.12)',
      xxl: '0 24px 48px rgba(0, 0, 0, 0.15)',
      glow: '0 0 20px rgba(0, 0, 0, 0.15)',
      glowStrong: '0 0 40px rgba(0, 0, 0, 0.25)',
    },
  },
};

// Typography system
export const typography = {
  fonts: {
    display: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    text: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
  },

  sizes: {
    xs: '11px',
    sm: '13px',
    base: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '26px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '52px',
    '6xl': '64px',
  },

  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeights: {
    tight: 1.15,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    loose: 1.8,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.03em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
};

// Spacing system
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

// Border radius
export const radius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

// Transitions
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
  max: 9999,
};

// Export default theme
export const defaultTheme = themes.deepspace;

// Helper to get current theme
export const getTheme = (themeId = 'deepspace') => {
  return themes[themeId] || defaultTheme;
};
