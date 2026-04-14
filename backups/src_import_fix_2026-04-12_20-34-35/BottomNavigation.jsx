/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BOTTOM NAVIGATION — Premium Navigation Bar
 * Simplified 4-tab navigation with premium animations
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../core/state/store';
import { SoundSystem } from '../../core/audio/SoundSystem';
import { HapticSystem } from '../../core/haptics/HapticSystem';

const NAV_ITEMS = [
  { id: 'discover', icon: '🏠', label: 'Home' },
  { id: 'gallery', icon: '🎨', label: 'Gallery' },
  { id: 'studio', icon: '✨', label: 'Studio' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

export const BottomNavigation = () => {
  const currentTab = useAppStore((state) => state.currentTab);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const settings = useAppStore((state) => state.settings);

  const handleTabChange = (tabId) => {
    if (tabId === currentTab) return;

    setCurrentTab(tabId);

    if (settings.hapticsEnabled) {
      HapticSystem.light();
    }

    if (settings.soundEnabled) {
      SoundSystem.play('tab');
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottom-nav-safe-height)',
        background: 'var(--glass-strong)',
        backdropFilter: 'blur(var(--blur-xl))',
        borderTop: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-2xl), var(--rim-light)',
        zIndex: 'var(--z-fixed)',
        paddingBottom: 'var(--safe-area-bottom)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '64px',
          padding: '0 var(--space-2)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-1)',
                padding: 'var(--space-2)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                transition: 'color var(--duration-fast) var(--ease-out)',
                minWidth: '64px',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon */}
              <motion.span
                style={{
                  fontSize: 'var(--text-2xl)',
                  filter: isActive ? 'drop-shadow(var(--glow-primary))' : 'none',
                }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
              </motion.span>

              {/* Label */}
              <span
                style={{
                  fontSize: 'var(--text-2xs)',
                  fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                }}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '32px',
                    height: '3px',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--glow-primary)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
