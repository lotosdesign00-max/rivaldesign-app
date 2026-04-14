import React, { useState, useRef } from 'react';
import './FlagshipNav.css';

/**
 * FLAGSHIP NAVIGATION — Premium Level
 * Features:
 * - Bottom navigation with elevated center button
 * - Ripple effect on tap
 * - Badge support
 * - Haptic feedback
 * - Smooth transitions
 * - 3 variants
 */

export default function FlagshipNav({
  items = [],
  activeIndex = 0,
  onChange,
  variant = 'glass', // glass, elevated, premium
  showLabels = true,
  elevatedCenter = false,
  className = '',
}) {
  const [ripples, setRipples] = useState([]);
  const navRef = useRef(null);

  const createRipple = (e, index) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
      index,
    };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const handleItemClick = (e, index) => {
    createRipple(e, index);

    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    onChange?.(index);
  };

  const centerIndex = elevatedCenter ? Math.floor(items.length / 2) : -1;

  return (
    <nav ref={navRef} className={`flagship-nav flagship-nav--${variant} ${className}`}>
      <div className="flagship-nav__container">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const isElevated = elevatedCenter && index === centerIndex;

          return (
            <button
              key={index}
              className={`flagship-nav__item ${isActive ? 'flagship-nav__item--active' : ''} ${
                isElevated ? 'flagship-nav__item--elevated' : ''
              }`}
              onClick={(e) => handleItemClick(e, index)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon */}
              <div className="flagship-nav__icon">
                {typeof item.icon === 'function' ? item.icon(isActive) : item.icon}
              </div>

              {/* Label */}
              {showLabels && !isElevated && (
                <span className="flagship-nav__label">{item.label}</span>
              )}

              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <span className="flagship-nav__badge">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}

              {/* Active indicator */}
              {!isElevated && <div className="flagship-nav__indicator" />}

              {/* Ripples */}
              {ripples
                .filter((r) => r.index === index)
                .map((ripple) => (
                  <span
                    key={ripple.id}
                    className="flagship-nav__ripple"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: ripple.size,
                      height: ripple.size,
                    }}
                  />
                ))}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
