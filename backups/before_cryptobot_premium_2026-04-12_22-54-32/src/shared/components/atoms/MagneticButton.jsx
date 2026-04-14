/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAGNETIC BUTTON — Premium Interactive Button
 * Features: Magnetic hover, ripple effect, haptic feedback, sound, loading states
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SoundSystem } from '../../../core/audio/SoundSystem';
import { HapticSystem } from '../../../core/haptics/HapticSystem';

export const MagneticButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  magnetic = true,
  ripple = true,
  sound = true,
  haptic = true,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  // Magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // ═══════════════════════════════════════════════════════════════════════
  // MAGNETIC HOVER EFFECT
  // ═══════════════════════════════════════════════════════════════════════

  const handleMouseMove = useCallback(
    (e) => {
      if (!magnetic || disabled || loading) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Magnetic pull strength
      const strength = 0.3;
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    },
    [magnetic, disabled, loading, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  // ═══════════════════════════════════════════════════════════════════════
  // RIPPLE EFFECT
  // ═══════════════════════════════════════════════════════════════════════

  const createRipple = useCallback(
    (e) => {
      if (!ripple || disabled || loading) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple = {
        x,
        y,
        size,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    },
    [ripple, disabled, loading]
  );

  // ═══════════════════════════════════════════════════════════════════════
  // CLICK HANDLER
  // ═══════════════════════════════════════════════════════════════════════

  const handleClick = useCallback(
    (e) => {
      if (disabled || loading) return;

      createRipple(e);

      // Haptic feedback
      if (haptic) {
        HapticSystem.light();
      }

      // Sound feedback
      if (sound) {
        SoundSystem.play('tap');
      }

      // Call onClick
      if (onClick) {
        onClick(e);
      }
    },
    [disabled, loading, onClick, haptic, sound, createRipple]
  );

  // ═══════════════════════════════════════════════════════════════════════
  // VARIANTS
  // ═══════════════════════════════════════════════════════════════════════

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--secondary-500) 100%)',
      color: 'var(--text-on-accent)',
      border: '1px solid var(--accent-600)',
      boxShadow: 'var(--shadow-md), var(--shadow-glow-sm)',
    },
    secondary: {
      background: 'var(--glass-medium)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-sm), var(--rim-light)',
      backdropFilter: 'blur(12px)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
      boxShadow: 'none',
    },
    danger: {
      background: 'linear-gradient(135deg, var(--color-error) 0%, var(--color-error-dark) 100%)',
      color: 'var(--text-on-accent)',
      border: '1px solid var(--color-error-dark)',
      boxShadow: 'var(--shadow-md), 0 0 20px rgba(239, 68, 68, 0.3)',
    },
  };

  const sizes = {
    sm: {
      height: 'var(--button-height-sm)',
      padding: '0 var(--button-padding-x-sm)',
      fontSize: 'var(--text-sm)',
      borderRadius: 'var(--radius-md)',
    },
    md: {
      height: 'var(--button-height-md)',
      padding: '0 var(--button-padding-x-md)',
      fontSize: 'var(--text-base)',
      borderRadius: 'var(--radius-lg)',
    },
    lg: {
      height: 'var(--button-height-lg)',
      padding: '0 var(--button-padding-x-lg)',
      fontSize: 'var(--text-lg)',
      borderRadius: 'var(--radius-xl)',
    },
    xl: {
      height: 'var(--button-height-xl)',
      padding: '0 var(--button-padding-x-xl)',
      fontSize: 'var(--text-xl)',
      borderRadius: 'var(--radius-2xl)',
    },
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  // ═══════════════════════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════════════════════

  const buttonStyles = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-text)',
    fontWeight: 'var(--weight-semibold)',
    letterSpacing: 'var(--tracking-tight)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    overflow: 'hidden',
    transition: 'all var(--duration-normal) var(--ease-out)',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 'var(--disabled-opacity)' : 1,
    ...currentSize,
    ...currentVariant,
    ...style,
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <motion.button
      ref={buttonRef}
      className={`magnetic-button magnetic-button-${variant} magnetic-button-${size} ${className}`}
      style={{
        ...buttonStyles,
        x: springX,
        y: springY,
      }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      whileHover={
        !disabled && !loading
          ? {
              scale: 1.02,
              boxShadow:
                variant === 'primary'
                  ? 'var(--shadow-lg), var(--shadow-glow-md)'
                  : 'var(--shadow-lg)',
            }
          : {}
      }
      whileTap={!disabled && !loading ? { scale: 0.96 } : {}}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            pointerEvents: 'none',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Glow effect on hover */}
      {isHovered && variant === 'primary' && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -2,
            background: 'linear-gradient(135deg, var(--accent-500), var(--secondary-500))',
            opacity: 0.5,
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <motion.svg
          style={{
            width: currentSize.fontSize,
            height: currentSize.fontSize,
          }}
          viewBox="0 0 24 24"
          fill="none"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset="40"
            opacity="0.3"
          />
        </motion.svg>
      )}

      {/* Icon left */}
      {icon && iconPosition === 'left' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}

      {/* Content */}
      {children && <span style={{ display: 'flex', alignItems: 'center' }}>{children}</span>}

      {/* Icon right */}
      {icon && iconPosition === 'right' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}
    </motion.button>
  );
};
