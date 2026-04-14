/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOLOGRAPHIC IMAGE — Premium Image Component
 * Features: Chromatic aberration, iridescent overlay, tilt effect, zoom, lazy loading
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const HolographicImage = ({
  src,
  alt = '',
  width = '100%',
  height = 'auto',
  aspectRatio = '16/9',
  holographic = true,
  tilt = true,
  zoom = true,
  lazy = true,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef(null);

  // Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // ═══════════════════════════════════════════════════════════════════════
  // TILT HANDLER
  // ═══════════════════════════════════════════════════════════════════════

  const handleMouseMove = (e) => {
    if (!tilt) return;

    const image = imageRef.current;
    if (!image) return;

    const rect = image.getBoundingClientRect();
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
  // STYLES
  // ═══════════════════════════════════════════════════════════════════════

  const containerStyles = {
    position: 'relative',
    width,
    height,
    aspectRatio,
    overflow: 'hidden',
    borderRadius: 'var(--radius-xl)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform var(--duration-slow) var(--ease-out)',
    ...(zoom && isHovered && { transform: 'scale(1.05)' }),
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <motion.div
      ref={imageRef}
      className={`holographic-image ${className}`}
      style={{
        ...containerStyles,
        ...(tilt && {
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--glass-medium)',
            animation: 'shimmerSkeleton 2s infinite',
          }}
        />
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        style={imageStyles}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Holographic overlay */}
      {holographic && isHovered && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(255,0,255,0.1) 0%, rgba(0,255,255,0.1) 50%, rgba(255,255,0,0.1) 100%)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Chromatic aberration effect */}
      {holographic && isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            opacity: 0.3,
          }}
        >
          <img
            src={src}
            alt=""
            style={{
              ...imageStyles,
              filter: 'blur(1px)',
              transform: 'translate(-2px, 0)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      )}

      {/* Rim light */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-xl)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  );
};
