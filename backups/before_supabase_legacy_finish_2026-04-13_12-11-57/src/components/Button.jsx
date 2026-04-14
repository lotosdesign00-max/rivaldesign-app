/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BUTTON COMPONENT — Premium Interactive Element
 * World-class button with animations, sounds, haptics
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  onHaptic,
  onSound,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  // Ripple effect
  const createRipple = useCallback((event) => {
    if (disabled || loading) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

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
  }, [disabled, loading]);

  // Handle click
  const handleClick = useCallback((event) => {
    if (disabled || loading) return;

    createRipple(event);

    // Haptic feedback
    if (onHaptic) {
      onHaptic('light');
    } else if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    // Sound feedback
    if (onSound) {
      onSound('tap');
    }

    // Call onClick
    if (onClick) {
      onClick(event);
    }
  }, [disabled, loading, onClick, onHaptic, onSound, createRipple]);

  // Variant styles
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--secondary-500) 100%)',
      color: 'var(--text-on-accent)',
      border: '1px solid var(--accent-600)',
      boxShadow: 'var(--shadow-md), var(--shadow-glow-sm)',
      hover: {
        boxShadow: 'var(--shadow-lg), var(--shadow-glow-md)',
        transform: 'translateY(-1px)',
      },
      active: {
        transform: 'scale(0.96)',
      },
    },
    secondary: {
      background: 'var(--glass-medium)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-sm), var(--rim-light)',
      backdropFilter: 'blur(12px)',
      hover: {
        background: 'var(--glass-strong)',
        borderColor: 'var(--border-strong)',
      },
      active: {
        transform: 'scale(0.96)',
      },
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
      hover: {
        background: 'var(--glass-light)',
        color: 'var(--text-primary)',
      },
      active: {
        transform: 'scale(0.96)',
      },
    },
    danger: {
      background: 'linear-gradient(135deg, var(--color-error) 0%, var(--color-error-dark) 100%)',
      color: 'var(--text-on-accent)',
      border: '1px solid var(--color-error-dark)',
      boxShadow: 'var(--shadow-md), 0 0 20px rgba(239, 68, 68, 0.3)',
      hover: {
        boxShadow: 'var(--shadow-lg), 0 0 30px rgba(239, 68, 68, 0.5)',
      },
      active: {
        transform: 'scale(0.96)',
      },
    },
  };

  // Size styles
  const sizeStyles = {
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

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const baseStyles = {
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
  };

  return (
    <button
      ref={buttonRef}
      className={`button button-${variant} button-${size} ${className}`}
      style={baseStyles}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            transform: 'scale(0)',
            animation: 'ripple 600ms ease-out',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <svg
          style={{
            width: currentSize.fontSize,
            height: currentSize.fontSize,
            animation: 'spin 1s linear infinite',
          }}
          viewBox="0 0 24 24"
          fill="none"
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
        </svg>
      )}

      {/* Icon left */}
      {icon && iconPosition === 'left' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}

      {/* Content */}
      {children && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {children}
        </span>
      )}

      {/* Icon right */}
      {icon && iconPosition === 'right' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  onHaptic: PropTypes.func,
  onSound: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
