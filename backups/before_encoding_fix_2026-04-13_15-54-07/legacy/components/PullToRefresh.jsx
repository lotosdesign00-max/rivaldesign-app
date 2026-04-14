import React, { useState, useEffect, useRef } from "react";

/**
 * PullToRefresh — жест pull-to-refresh для обновления контента
 */

export default function PullToRefresh({ onRefresh, children, threshold = 80 }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === 0 || window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);

    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh?.();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  };

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 360;

  return (
    <>
      <style>{`
        @keyframes refreshSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .pull-refresh-indicator {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${pullDistance * 0.5}px)`,
          transition: pullDistance === 0 ? "transform 0.3s ease" : "none",
        }}
      >
        {/* Refresh indicator */}
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className="pull-refresh-indicator"
            style={{
              position: "absolute",
              top: -60,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
              border: "2px solid rgba(99,102,241,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
              opacity: Math.min(progress, 1),
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                border: "3px solid rgba(99,102,241,0.3)",
                borderTopColor: "#6366f1",
                borderRadius: "50%",
                transform: isRefreshing ? "none" : `rotate(${rotation}deg)`,
                animation: isRefreshing ? "refreshSpin 0.8s linear infinite" : "none",
              }}
            />
          </div>
        )}

        {children}
      </div>
    </>
  );
}
