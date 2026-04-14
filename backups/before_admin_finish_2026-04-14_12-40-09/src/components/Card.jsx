/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CARD COMPONENT — Premium Container Element
 * Glassmorphic card with depth, glow, and interactions
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  glow = false,
  gradient = false,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Variant styles
  const variantStyles = {
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
    elevated: {
      background: 'var(--color-bg-elevated-2)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-xl), var(--rim-light-strong)',
    },
    gradient: {
      background: 'linear-gradient(135deg, var(--color-bg-elevated-1) 0%, var(--color-bg-elevated-2) 100%)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-lg), var(--rim-light)',
    },
  };

  // Padding styles
  const paddingStyles = {
    none: { padding: 0 },
    sm: { padding: 'var(--card-padding-sm)' },
    md: { padding: 'var(--card-padding-md)' },
    lg: { padding: 'var(--card-padding-lg)' },
    xl: { padding: 'var(--card-padding-xl)' },
  };

  const currentVariant = variantStyles[variant];
  const currentPadding = paddingStyles[padding];

  const baseStyles = {
    position: 'relative',
    borderRadius: 'var(--radius-2xl)',
    overflow: 'hidden',
    transition: 'all var(--duration-normal) var(--ease-out)',
    ...currentVariant,
    ...currentPadding,
    ...(clickable && {
      cursor: 'pointer',
      userSelect: 'none',
    }),
    ...(hoverable && isHovered && {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-2xl), var(--rim-light-strong)',
      ...(glow && {
        boxShadow: 'var(--shadow-2xl), var(--shadow-glow-md), var(--rim-light-strong)',
      }),
    }),
    ...style,
  };

  const handleClick = (e) => {
    if (clickable && onClick) {
      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
      onClick(e);
    }
  };

  return (
    <div
      className={`card card-${variant} ${hoverable ? 'card-hoverable' : ''} ${clickable ? 'card-clickable' : ''} ${className}`}
      style={baseStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      {...props}
    >
      {/* Gradient overlay (optional) */}
      {gradient && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Glow effect (optional) */}
      {glow && isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: -1,
            background: 'linear-gradient(135deg, var(--accent-500), var(--secondary-500))',
            opacity: 0.5,
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'glass', 'elevated', 'gradient']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  glow: PropTypes.bool,
  gradient: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Card;
