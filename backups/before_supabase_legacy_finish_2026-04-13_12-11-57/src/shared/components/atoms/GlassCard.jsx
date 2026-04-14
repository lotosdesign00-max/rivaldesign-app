/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLASS CARD — Premium Glassmorphic Container
 * Features: Multi-layer glass, dynamic blur, rim lighting, parallax, glow
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HapticSystem } from '../../../core/haptics/HapticSystem';
import { SoundSystem } from '../../../core/audio/SoundSystem';

export const GlassCard = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  glow = false,
  parallax = false,
  gradient = false,
  sound = false,
  haptic = false,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // ═══════════════════════════════════════════════════════════════════════
  // PARALLAX HANDLER
  // ═══════════════════════════════════════════════════════════════════════

  const handleMouseMove = (e) => {
    if (!parallax || !hoverable) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CLICK HANDLER
  // ═══════════════════════════════════════════════════════════════════════

  const handleClick = (e) => {
    if (!clickable) return;

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
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VARIANTS
  // ═══════════════════════════════════════════════════════════════════════

  const variants = {
    default: {
      background: 'var(--color-bg-elevated-1)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-md), var(--rim-light)',
    },
    glass: {
      background: 'var(--glass-medium)',
      border: '1px solid var(--border-light)',
      backdropFilter: 'blur(var(--blur-lg))',
      WebkitBackdropFilter: 'blur(var(--blur-lg))',
      boxShadow: 'var(--shadow-lg), var(--rim-light)',
    },
    'glass-strong': {
      background: 'var(--glass-strong)',
      border: '1px solid var(--border-medium)',
      backdropFilter: 'blur(var(--blur-xl))',
      WebkitBackdropFilter: 'blur(var(--blur-xl))',
      boxShadow: 'var(--shadow-xl), var(--rim-light-strong)',
    },
    elevated: {
      background: 'var(--color-bg-elevated-2)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-xl), var(--rim-light-strong)',
    },
    gradient: {
      background:
        'linear-gradient(135deg, var(--color-bg-elevated-1) 0%, var(--color-bg-elevated-2) 100%)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-lg), var(--rim-light)',
    },
  };

  const paddings = {
    none: { padding: 0 },
    sm: { padding: 'var(--card-padding-sm)' },
    md: { padding: 'var(--card-padding-md)' },
    lg: { padding: 'var(--card-padding-lg)' },
    xl: { padding: 'var(--card-padding-xl)' },
  };

  const currentVariant = variants[variant];
  const currentPadding = paddings[padding];

  // ═══════════════════════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════════════════════

  const cardStyles = {
    position: 'relative',
    borderRadius: 'var(--radius-2xl)',
    overflow: 'hidden',
    transition: 'all var(--duration-normal) var(--ease-out)',
    cursor: clickable ? 'pointer' : 'default',
    userSelect: 'none',
    ...currentVariant,
    ...currentPadding,
    ...style,
  };

  const hoverStyles = hoverable
    ? {
        transform: 'translateY(-2px)',
        boxShadow: glow
          ? 'var(--shadow-2xl), var(--shadow-glow-md), var(--rim-light-strong)'
          : 'var(--shadow-2xl), var(--rim-light-strong)',
      }
    : {};

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card glass-card-${variant} ${hoverable ? 'glass-card-hoverable' : ''} ${
        clickable ? 'glass-card-clickable' : ''
      } ${className}`}
      style={{
        ...cardStyles,
        ...(parallax && {
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={hoverable ? hoverStyles : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Glow effect */}
      {glow && isHovered && (
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

      {/* Shimmer effect on hover */}
      {isHovered && hoverable && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          ...(parallax && { transform: 'translateZ(20px)' }),
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};
