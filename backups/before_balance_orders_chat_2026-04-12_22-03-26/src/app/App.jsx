/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIN APP COMPONENT — Premium Telegram Mini App
 * Complete overhaul with world-class UX
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';
import { Router } from './Router';
import { BottomNavigation } from '../components/BottomNavigation';
import { TelegramSDK } from '../core/telegram/TelegramSDK';
import { SoundSystem } from '../core/audio/SoundSystem';
import { useAppStore } from '../core/state/store';

// Import styles
import '../design-system/tokens.css';
import '../design-system/tokens/extended-tokens.css';
import '../design-system/animations.css';
import '../styles.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const settings = useAppStore((state) => state.settings);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Telegram SDK
        TelegramSDK.init();

        // Initialize Sound System
        if (settings.soundEnabled) {
          SoundSystem.init();
        }

        // Set theme colors
        TelegramSDK.setHeaderColor('#050608');
        TelegramSDK.setBackgroundColor('#050608');

        // Simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsLoading(false);

        // Play boot sound
        if (settings.soundEnabled) {
          SoundSystem.play('boot');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setIsLoading(false);
      }
    };

    initialize();
  }, [settings.soundEnabled]);

  // ═══════════════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════════════════

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-6xl)',
              marginBottom: 'var(--space-4)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            ✨
          </div>
          <div
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Rival Design
          </div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
              marginTop: 'var(--space-2)',
            }}
          >
            Loading premium experience...
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MAIN APP
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        position: 'relative',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--gradient-mesh-1), var(--gradient-mesh-2), var(--gradient-mesh-3)',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
        }}
      >
        <Router />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default App;
