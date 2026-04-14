import React, { useState, useRef, useEffect } from "react";

/**
 * PremiumCard — карточка премиум-уровня
 * - Glassmorphism эффект
 * - Parallax при наведении
 * - Gradient borders
 * - Shimmer эффект
 * - Smooth animations
 */

export default function PremiumCard({
  children,
  variant = "default", // default, gradient, glow, glass
  hover = true,
  parallax = false,
  shimmer = false,
  glow = false,
  onClick,
  style = {},
  className = "",
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!parallax || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePos({ x: (x - 0.5) * 20, y: (y - 0.5) * 20 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const variants = {
    default: {
      background: "rgba(13,15,26,0.80)",
      border: "1px solid rgba(99,102,241,0.14)",
      boxShadow: "0 8px 32px rgba(3,4,8,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
    },
    gradient: {
      background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
      border: "1px solid rgba(99,102,241,0.25)",
      boxShadow: "0 12px 40px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
    },
    glow: {
      background: "rgba(13,15,26,0.85)",
      border: "1px solid rgba(99,102,241,0.3)",
      boxShadow: "0 8px 32px rgba(99,102,241,0.3), 0 0 60px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
    },
    glass: {
      background: "rgba(13,15,26,0.60)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
    },
  };

  const variantStyle = variants[variant];

  return (
    <>
      <style>{`
        @keyframes cardShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes cardGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .premium-card {
          position: relative;
          border-radius: 20px;
          padding: 16px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .premium-card-hover:hover {
          transform: translateY(-4px) scale(1.01);
        }
        .premium-card-clickable {
          cursor: pointer;
        }
        .premium-card-clickable:active {
          transform: scale(0.98);
        }
        .card-shimmer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: cardShimmer 3s infinite;
          pointer-events: none;
        }
        .card-glow-effect {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(99,102,241,0.4) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          filter: blur(20px);
        }
        .premium-card:hover .card-glow-effect {
          opacity: 1;
          animation: cardGlow 2s ease-in-out infinite;
        }
        .card-gradient-border {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #22d3ee);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .premium-card:hover .card-gradient-border {
          opacity: 1;
        }
        .card-top-shine {
          position: absolute;
          top: 0;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
          pointer-events: none;
        }
        .card-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div
        ref={cardRef}
        className={`premium-card ${hover ? "premium-card-hover" : ""} ${onClick ? "premium-card-clickable" : ""} ${className}`}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          ...variantStyle,
          transform: parallax && isHovered
            ? `perspective(1000px) rotateX(${-mousePos.y * 0.1}deg) rotateY(${mousePos.x * 0.1}deg)`
            : undefined,
          ...style,
        }}
      >
        {/* Top shine */}
        <div className="card-top-shine" />

        {/* Gradient border */}
        {variant === "gradient" && <div className="card-gradient-border" />}

        {/* Glow effect */}
        {glow && (
          <div
            className="card-glow-effect"
            style={{
              "--mouse-x": `${((mousePos.x + 10) / 20) * 100}%`,
              "--mouse-y": `${((mousePos.y + 10) / 20) * 100}%`,
            }}
          />
        )}

        {/* Shimmer effect */}
        {shimmer && <div className="card-shimmer-overlay" />}

        {/* Content */}
        <div className="card-content">
          {children}
        </div>
      </div>
    </>
  );
}
