import React, { useState, useRef, useEffect } from "react";

/**
 * EnhancedButton — премиум кнопка с продвинутыми эффектами
 * - Ripple эффект
 * - Магнитный эффект (magnetic hover)
 * - Shimmer анимация
 * - Haptic feedback
 * - Sound effects
 */

export default function EnhancedButton({
  children,
  onClick,
  variant = "primary", // primary, secondary, ghost, gradient
  size = "md", // sm, md, lg
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  fullWidth = false,
  magnetic = false,
  shimmer = false,
  sfx,
  style = {},
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
    sfx?.tap?.();
    // Haptic feedback
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }
    onClick?.(e);
  };

  // Variant styles
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "#ffffff",
      border: "1px solid rgba(99,102,241,0.3)",
      boxShadow: "0 8px 24px rgba(99,102,241,0.35), 0 2px 8px rgba(99,102,241,0.2)",
      hoverShadow: "0 12px 32px rgba(99,102,241,0.45), 0 4px 12px rgba(99,102,241,0.3)",
    },
    secondary: {
      background: "rgba(99,102,241,0.12)",
      color: "#c7d2fe",
      border: "1px solid rgba(99,102,241,0.25)",
      boxShadow: "0 4px 16px rgba(3,4,8,0.2)",
      hoverShadow: "0 6px 20px rgba(99,102,241,0.2)",
    },
    ghost: {
      background: "transparent",
      color: "rgba(165,180,252,0.85)",
      border: "1px solid rgba(99,102,241,0.15)",
      boxShadow: "none",
      hoverShadow: "0 4px 16px rgba(99,102,241,0.15)",
    },
    gradient: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)",
      color: "#ffffff",
      border: "none",
      boxShadow: "0 8px 24px rgba(99,102,241,0.4), 0 0 40px rgba(139,92,246,0.2)",
      hoverShadow: "0 12px 32px rgba(99,102,241,0.5), 0 0 50px rgba(139,92,246,0.3)",
    },
  };

  // Size styles
  const sizes = {
    sm: { padding: "8px 14px", fontSize: 11, borderRadius: 10, height: 32 },
    md: { padding: "11px 18px", fontSize: 13, borderRadius: 12, height: 40 },
    lg: { padding: "14px 24px", fontSize: 15, borderRadius: 14, height: 48 },
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <>
<style>{`
        @keyframes shimmerMove {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(200%) translateY(200%) rotate(45deg); }
        }
        @keyframes rippleEffect {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .enhanced-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: system-ui, -apple-system, sans-serif;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          touch-action: manipulation;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }
        .enhanced-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
        .enhanced-btn:active:not(:disabled) {
          transform: scale(0.96) translate(${mousePos.x}px, ${mousePos.y}px);
        }
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .enhanced-btn,
          .enhanced-btn:active:not(:disabled) {
            transition: none;
            transform: none;
          }
          .shimmer-overlay,
          .ripple {
            animation: none;
          }
        }
        /* Eco mode */
        html[data-rs-performance="smooth"] .enhanced-btn,
        html[data-rs-power="eco"] .enhanced-btn {
          transition: none;
          will-change: auto;
        }
        html[data-rs-performance="smooth"] .shimmer-overlay,
        html[data-rs-power="eco"] .shimmer-overlay {
          display: none;
        }
        .enhanced-btn-loading {
          pointer-events: none;
        }
        .shimmer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          width: 50%;
          height: 200%;
          animation: shimmerMove 3s infinite;
          pointer-events: none;
        }
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          animation: rippleEffect 0.6s ease-out;
          pointer-events: none;
        }
        .btn-glow {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          background: radial-gradient(circle at center, rgba(99,102,241,0.4), transparent 70%);
          filter: blur(8px);
        }
        .enhanced-btn:hover .btn-glow {
          opacity: 1;
        }
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

<button
        ref={buttonRef}
        className={`enhanced-btn ${loading ? "enhanced-btn-loading" : ""}`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={loading}
        type={props.type || "button"}
        style={{
          ...variantStyle,
          ...sizeStyle,
          width: fullWidth ? "100%" : "auto",
          transform: magnetic && isHovered ? `translate(${mousePos.x}px, ${mousePos.y}px)` : "none",
          boxShadow: isHovered ? variantStyle.hoverShadow : variantStyle.boxShadow,
          ...style,
        }}
        {...props}
      >
        {/* Glow effect */}
        <div className="btn-glow" />

        {/* Shimmer effect */}
        {shimmer && !loading && <div className="shimmer-overlay" />}

        {/* Ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}

        {/* Content */}
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          <>
            {icon && iconPosition === "left" && <span>{icon}</span>}
            {children}
            {icon && iconPosition === "right" && <span>{icon}</span>}
          </>
        )}
      </button>
    </>
  );
}

