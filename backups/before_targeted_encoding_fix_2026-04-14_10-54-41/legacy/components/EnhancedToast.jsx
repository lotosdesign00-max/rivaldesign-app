import React, { useState, useEffect } from "react";
import SystemIcon from "./SystemIcon";

/**
 * EnhancedToast — премиум система уведомлений
 * - Богатые анимации
 * - Иконки и прогресс-бар
 * - Swipe to dismiss
 * - Звуковые эффекты
 */

export default function EnhancedToast({ toasts = [], onDismiss, sfx }) {
  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(-100%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes toastSlideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-100%) scale(0.9);
          }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes toastGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .toast-container {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: min(420px, calc(100% - 32px));
          pointer-events: none;
        }
        .toast-item {
          pointer-events: auto;
          animation: toastSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .toast-item.exiting {
          animation: toastSlideOut 0.3s ease-out forwards;
        }
        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.6));
          animation: toastProgress var(--duration) linear forwards;
          border-radius: 0 0 0 12px;
        }
        .toast-glow {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          opacity: 0;
          pointer-events: none;
          filter: blur(12px);
          animation: toastGlow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            sfx={sfx}
          />
        ))}
      </div>
    </>
  );
}

function ToastItem({ toast, onDismiss, sfx }) {
  const [isExiting, setIsExiting] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    sfx?.close?.();
    setTimeout(() => {
      onDismiss?.(toast.id);
    }, 300);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - e.target.getBoundingClientRect().left;
    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragX) > 100) {
      handleDismiss();
    } else {
      setDragX(0);
    }
    setIsDragging(false);
  };

  const types = {
    success: {
      icon: "check",
      bg: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.10) 100%)",
      border: "rgba(16,185,129,0.35)",
      glow: "rgba(16,185,129,0.3)",
      iconBg: "linear-gradient(135deg, #10b981, #059669)",
    },
    error: {
      icon: "close",
      bg: "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.10) 100%)",
      border: "rgba(239,68,68,0.35)",
      glow: "rgba(239,68,68,0.3)",
      iconBg: "linear-gradient(135deg, #ef4444, #dc2626)",
    },
    warning: {
      icon: "warning",
      bg: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.10) 100%)",
      border: "rgba(245,158,11,0.35)",
      glow: "rgba(245,158,11,0.3)",
      iconBg: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    info: {
      icon: "info",
      bg: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(79,70,229,0.10) 100%)",
      border: "rgba(99,102,241,0.35)",
      glow: "rgba(99,102,241,0.3)",
      iconBg: "linear-gradient(135deg, #6366f1, #4f46e5)",
    },
  };

  const type = types[toast.type || "info"];

  return (
    <div
      className={`toast-item ${isExiting ? "exiting" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        background: type.bg,
        border: `1px solid ${type.border}`,
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 8px 32px ${type.glow}, 0 2px 8px rgba(0,0,0,0.2)`,
        transform: `translateX(${dragX}px)`,
        transition: isDragging ? "none" : "transform 0.3s ease",
      }}
    >
      {/* Glow */}
      <div
        className="toast-glow"
        style={{ background: `radial-gradient(circle, ${type.glow}, transparent 70%)` }}
      />

      {/* Icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: type.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 900,
          color: "#fff",
          flexShrink: 0,
          boxShadow: `0 4px 12px ${type.glow}`,
        }}
      >
        <SystemIcon name={type.icon} size={16} color="#fff" animated />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(224,231,255,0.95)",
              marginBottom: 2,
            }}
          >
            {toast.title}
          </div>
        )}
        <div
          style={{
            fontSize: 12,
            color: "rgba(148,163,184,0.85)",
            lineHeight: 1.4,
          }}
        >
          {toast.message}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          border: "none",
          background: "rgba(255,255,255,0.08)",
          color: "rgba(148,163,184,0.7)",
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          e.currentTarget.style.color = "rgba(224,231,255,0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "rgba(148,163,184,0.7)";
        }}
      >
        <SystemIcon name="close" size={14} color="rgba(148,163,184,0.7)" />
      </button>

      {/* Progress bar */}
      {toast.duration && (
        <div
          className="toast-progress"
          style={{ "--duration": `${toast.duration}ms` }}
        />
      )}
    </div>
  );
}

