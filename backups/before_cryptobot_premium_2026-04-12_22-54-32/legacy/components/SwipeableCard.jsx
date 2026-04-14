import React, { useState, useRef, useEffect } from "react";

/**
 * SwipeableCard — карточка с swipe жестами
 * Swipe left для удаления, swipe right для действия
 */

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = { icon: "🗑", color: "#ef4444", label: "Delete" },
  rightAction = { icon: "❤", color: "#10b981", label: "Like" },
  threshold = 100,
  sfx,
}) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragX) >= threshold) {
      if (dragX > 0) {
        sfx?.like?.();
        onSwipeRight?.();
      } else {
        sfx?.remove?.();
        onSwipeLeft?.();
      }
    }
    setDragX(0);
    setIsDragging(false);
  };

  const progress = Math.min(Math.abs(dragX) / threshold, 1);
  const isLeft = dragX < 0;
  const action = isLeft ? leftAction : rightAction;

  return (
    <>
      <style>{`
        .swipeable-card {
          position: relative;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .swipe-action {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.2s ease;
        }
      `}</style>

      <div style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
        {/* Left action (delete) */}
        <div
          className="swipe-action"
          style={{
            left: 0,
            background: leftAction.color,
            opacity: isLeft ? progress : 0,
            transform: `translateX(${isLeft ? Math.min(dragX + 80, 0) : -80}px)`,
          }}
        >
          <div style={{ fontSize: 24 }}>{leftAction.icon}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>
            {leftAction.label}
          </div>
        </div>

        {/* Right action (like) */}
        <div
          className="swipe-action"
          style={{
            right: 0,
            background: rightAction.color,
            opacity: !isLeft ? progress : 0,
            transform: `translateX(${!isLeft ? Math.max(dragX - 80, 0) : 80}px)`,
          }}
        >
          <div style={{ fontSize: 24 }}>{rightAction.icon}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>
            {rightAction.label}
          </div>
        </div>

        {/* Card content */}
        <div
          ref={cardRef}
          className="swipeable-card"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(${dragX}px) rotate(${dragX * 0.02}deg)`,
            transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
