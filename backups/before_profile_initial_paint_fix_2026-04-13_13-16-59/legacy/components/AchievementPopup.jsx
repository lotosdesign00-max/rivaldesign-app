import React, { useEffect } from "react";

function AchievementPopup({ achievement, th, onClose, sfx }) {
  useEffect(() => {
    sfx?.achievement?.();
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [sfx, onClose]);

  return (
    <div style={{
      position: "fixed",
      right: "max(16px, calc(50% - 240px + 16px))",
      bottom: "calc(72px + 24px + env(safe-area-inset-bottom, 0px))",
      zIndex: 10000,
      width: "min(280px, calc(100vw - 32px))",
      background: "linear-gradient(135deg, rgba(13,15,26,.95) 0%, rgba(8,9,20,.98) 100%)",
      border: "1px solid rgba(99,102,241,.35)",
      borderRadius: 22,
      padding: "16px",
      boxShadow: "0 20px 50px rgba(3,4,8,.65), 0 0 35px rgba(99,102,241,.25), inset 0 1px 0 rgba(255,255,255,.1)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      animation: "achievePopupIn .5s cubic-bezier(.175,.885,.32,1.275) both, achieveFloat 4s ease-in-out infinite alternate",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      overflow: "hidden",
      cursor: "pointer",
    }} onClick={() => { sfx?.tap?.(); onClose(); }}>
      {/* Dynamic border glow */}
      <div style={{
        position: "absolute", top: 0, left: "-50%", right: "-50%", height: 1.5,
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,.8), rgba(139,92,246,.8), rgba(34,211,238,.6), transparent)",
        animation: "achieveBorderSweep 3s linear infinite",
      }} />

      {/* Progress bar — auto-shrinking */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
        background: "rgba(255,255,255,.05)",
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)",
          boxShadow: "0 0 10px rgba(99,102,241,.6)",
          animation: "achieveProgressShrink 4s linear forwards",
        }} />
      </div>

      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 16, flexShrink: 0, position: "relative",
        background: "linear-gradient(135deg, rgba(99,102,241,.25) 0%, rgba(139,92,246,.15) 100%)",
        border: "1px solid rgba(99,102,241,.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24,
        boxShadow: "0 8px 24px rgba(99,102,241,.35), inset 0 1px 0 rgba(255,255,255,.15)",
        animation: "achieveIconPulse 2s ease-in-out infinite",
      }}>
        {/* Glow behind icon */}
        <div style={{
          position:"absolute", inset:-5, background:"rgba(99,102,241,0.4)", filter:"blur(8px)", zIndex:-1, borderRadius:"50%"
        }} />
        {achievement.icon}
      </div>

      {/* Text Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 9, fontWeight: 900, color: "#818cf8",
          letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 4,
          display: "flex", alignItems: "center", gap: 4
        }}>
          <span style={{ animation: "sparkle 1.5s ease-in-out infinite" }}>✦</span> Achievement Unlocked
        </div>
        <div style={{
          fontSize: 14, fontWeight: 900, color: "rgba(224,231,255,.98)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          marginBottom: 4, letterSpacing: "-.02em"
        }}>
          {achievement.title}
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 999,
          background: "linear-gradient(135deg, rgba(99,102,241,.2), rgba(139,92,246,.15))",
          border: "1px solid rgba(139,92,246,.3)",
          fontSize: 10, fontWeight: 900, color: "#e0e7ff",
          boxShadow: "0 2px 8px rgba(139,92,246,.25)"
        }}>
          <span style={{ fontSize: 11 }}>⭐</span> +{achievement.xp} XP
        </div>
      </div>

      <style>{`
        @keyframes achievePopupIn {
          from { opacity: 0; transform: translateX(120%) scale(.85) rotate(5deg); }
          to   { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
        }
        @keyframes achieveFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes achieveProgressShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes achieveBorderSweep {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
        @keyframes achieveIconPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(0.8); }
          50%      { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default AchievementPopup;
