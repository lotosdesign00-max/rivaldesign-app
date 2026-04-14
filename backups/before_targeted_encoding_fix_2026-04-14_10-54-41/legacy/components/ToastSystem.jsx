import React, { useEffect, useState } from "react";
import SystemIcon from "./SystemIcon";

const TYPE_CONFIG = {
  success: {
    bg: "linear-gradient(135deg, rgba(16,185,129,.95), rgba(5,150,105,.90))",
    bgDark: "rgba(5,46,22,.95)",
    border: "rgba(16,185,129,.4)",
    glow: "rgba(16,185,129,.35)",
    progress: "#10b981",
    icon: "check",
  },
  error: {
    bg: "linear-gradient(135deg, rgba(239,68,68,.95), rgba(185,28,28,.90))",
    bgDark: "rgba(69,10,10,.95)",
    border: "rgba(239,68,68,.4)",
    glow: "rgba(239,68,68,.35)",
    progress: "#ef4444",
    icon: "close",
  },
  warning: {
    bg: "linear-gradient(135deg, rgba(245,158,11,.92), rgba(180,113,0,.90))",
    bgDark: "rgba(69,26,3,.95)",
    border: "rgba(245,158,11,.4)",
    glow: "rgba(245,158,11,.3)",
    progress: "#f59e0b",
    icon: "warning",
  },
  info: {
    bg: "linear-gradient(135deg, rgba(99,102,241,.95), rgba(139,92,246,.88))",
    bgDark: "rgba(30,27,75,.95)",
    border: "rgba(99,102,241,.45)",
    glow: "rgba(99,102,241,.35)",
    progress: "#a5b4fc",
    icon: "info",
  },
};

function Toast({ msg, type, id, duration = 3000 }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const [progress, setProgress] = useState(100);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct <= 0) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "13px 16px 10px",
      borderRadius: 20,
      background: "rgba(10,11,20,.94)",
      border: `1px solid ${cfg.border}`,
      boxShadow: `0 12px 36px rgba(3,4,8,.55), 0 0 24px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,.07)`,
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      animation: "toastIn .38s cubic-bezier(.175,.885,.32,1.275) both",
      pointerEvents: "auto",
      maxWidth: "100%",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Left accent line */}
      <div style={{
        position: "absolute", left: 0, top: "12%", bottom: "12%", width: 3,
        background: `linear-gradient(180deg, ${cfg.progress}, ${cfg.progress}88)`,
        borderRadius: "0 3px 3px 0",
        boxShadow: `0 0 8px ${cfg.glow}`,
      }} />

      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: `${cfg.progress}22`,
        border: `1px solid ${cfg.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 900, color: cfg.progress,
        boxShadow: `0 2px 8px ${cfg.glow}`,
        marginLeft: 4,
      }}><SystemIcon name={cfg.icon} size={14} color={cfg.progress} animated /></div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: 4 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "rgba(224,231,255,.95)",
          lineHeight: 1.45, letterSpacing: "-.01em",
        }}>{msg}</div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2.5,
        background: "rgba(255,255,255,.08)",
      }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: `linear-gradient(90deg, ${cfg.progress}, ${cfg.progress}aa)`,
          borderRadius: 999, transition: "width .03s linear",
          boxShadow: `0 0 6px ${cfg.glow}`,
        }} />
      </div>
    </div>
  );
}

function ToastSystem({ toasts, th, isTg }) {
  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-14px) scale(.92); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
      <div style={{
        position: "fixed",
        top: isTg ? 8 : 16,
        left: "50%", transform: "translateX(-50%)",
        zIndex: 9998,
        display: "flex", flexDirection: "column", gap: 8,
        pointerEvents: "none",
        width: "min(360px, 90vw)",
      }}>
        {toasts.map(t => (
          <Toast key={t.id} msg={t.msg} type={t.type} id={t.id} th={th} />
        ))}
      </div>
    </>
  );
}

export default ToastSystem;
