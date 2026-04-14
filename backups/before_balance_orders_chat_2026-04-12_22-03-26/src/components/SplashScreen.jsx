/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SPLASH SCREEN — Loading Screen
 * Animated splash screen with logo and loading indicator
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';

const SplashScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--color-bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 'var(--z-max)',
    }}>
      {/* Logo */}
      <div style={{
        fontSize: 'var(--text-5xl)',
        fontWeight: 'var(--weight-black)',
        fontFamily: 'var(--font-display)',
        background: 'linear-gradient(135deg, var(--accent-200) 0%, var(--accent-400) 50%, var(--secondary-400) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 'var(--space-8)',
        animation: 'fadeInUp var(--duration-slow) var(--ease-out) both',
      }}>
        RIVAL
      </div>

      {/* Loading indicator */}
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid var(--glass-medium)',
        borderTop: '3px solid var(--accent-500)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />

      {/* Tagline */}
      <div style={{
        marginTop: 'var(--space-8)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-tertiary)',
        letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase',
        animation: 'fadeIn var(--duration-slow) var(--ease-out) 0.3s both',
      }}>
        Premium Design Platform
      </div>
    </div>
  );
};

export default SplashScreen;
