import React, { useState, useRef } from 'react';
import './FlagshipCard.css';

/**
 * FLAGSHIP CARD — Premium Level
 * Features:
 * - Glassmorphism
 * - Parallax on hover
 * - Gradient borders
 * - Shimmer effect
 * - Glow effect
 * - 4 variants
 */

export default function FlagshipCard({
  children,
  variant = 'glass', // glass, elevated, premium, interactive
  hover = true,
  parallax = false,
  shimmer = false,
  glow = false,
  onClick,
  className = '',
  style = {},
}) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!parallax || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0.5, y: 0.5 });
  };

  const parallaxX = (mousePos.x - 0.5) * 20;
  const parallaxY = (mousePos.y - 0.5) * 20;

  return (
    <div
      ref={cardRef}
      className={`flagship-card flagship-card--${variant} ${
        hover ? 'flagship-card--hover' : ''
      } ${onClick ? 'flagship-card--clickable' : ''} ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: parallax && isHovered
          ? `perspective(1000px) rotateX(${-parallaxY * 0.1}deg) rotateY(${parallaxX * 0.1}deg)`
          : undefined,
        ...style,
      }}
    >
      {/* Top shine */}
      <div className="flagship-card__shine" />

      {/* Gradient border (for premium variant) */}
      {variant === 'premium' && <div className="flagship-card__gradient-border" />}

      {/* Glow effect */}
      {glow && (
        <div
          className="flagship-card__glow"
          style={{
            '--mouse-x': `${mousePos.x * 100}%`,
            '--mouse-y': `${mousePos.y * 100}%`,
          }}
        />
      )}

      {/* Shimmer effect */}
      {shimmer && <div className="flagship-card__shimmer" />}

      {/* Content */}
      <div className="flagship-card__content">{children}</div>
    </div>
  );
}
