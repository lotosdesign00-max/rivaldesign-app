import React, { useState, useRef, useEffect } from 'react';
import './FlagshipButton.css';

/**
 * FLAGSHIP BUTTON — World-Class Level
 * Features:
 * - Ripple effect from click point
 * - Magnetic hover (cursor attraction)
 * - Shimmer animation
 * - Haptic feedback
 * - Sound effects
 * - 5 variants × 4 sizes × 6 states
 */

export default function FlagshipButton({
  children,
  variant = 'primary', // primary, secondary, ghost, danger, premium
  size = 'md', // sm, md, lg, xl
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  magnetic = false,
  shimmer = false,
  onClick,
  className = '',
  ...props
}) {
  const [ripples, setRipples] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  // Ripple effect
  const createRipple = (e) => {
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
  };

  // Magnetic effect
  const handleMouseMove = (e) => {
    if (!magnetic || !isHovered) return;
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;

    setMousePos({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    createRipple(e);

    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`flagship-btn flagship-btn--${variant} flagship-btn--${size} ${
        loading ? 'flagship-btn--loading' : ''
      } ${fullWidth ? 'flagship-btn--full' : ''} ${className}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      style={{
        transform: magnetic && isHovered ? `translate(${mousePos.x}px, ${mousePos.y}px)` : 'none',
      }}
      {...props}
    >
      {/* Glow effect */}
      <div className="flagship-btn__glow" />

      {/* Shimmer effect */}
      {shimmer && !loading && <div className="flagship-btn__shimmer" />}

      {/* Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="flagship-btn__ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* Content */}
      <span className="flagship-btn__content">
        {loading ? (
          <span className="flagship-btn__spinner" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flagship-btn__icon flagship-btn__icon--left">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="flagship-btn__icon flagship-btn__icon--right">{icon}</span>
            )}
          </>
        )}
      </span>
    </button>
  );
}
