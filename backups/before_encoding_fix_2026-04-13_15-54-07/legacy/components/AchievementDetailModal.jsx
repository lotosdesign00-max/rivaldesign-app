import React, { useEffect, useState } from "react";

function AchievementDetailModal({ achievement, th, onClose, sfx }) {
  const [animateState, setAnimateState] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    sfx?.modalOpen?.();
    setAnimateState(true);
    return () => { document.body.style.overflow = ""; };
  }, [sfx]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10001,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => { sfx?.tap?.(); onClose(); }}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(2,3,7,.92)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          animation: "achieveBgIn .3s ease both",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "relative", zIndex: 10002,
        width: "min(360px, 92vw)",
        background: "linear-gradient(145deg, rgba(13,15,26,.98) 0%, rgba(8,9,20,1) 100%)",
        border: "1px solid rgba(99,102,241,.30)",
        borderRadius: 36,
        padding: "40px 24px 34px",
        boxShadow: "0 40px 140px rgba(3,4,8,.8), 0 0 60px rgba(99,102,241,.2), inset 0 1px 0 rgba(255,255,255,.08)",
        animation: "achieveModalIn .45s cubic-bezier(.34,1.56,.64,1) both",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Animated Background Nebula */}
        <div style={{
          position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,.2) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "nebulaPulse 6s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        
        {/* Top glow line */}
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 1.5,
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,.8), rgba(34,211,238,.6), rgba(139,92,246,.8), transparent)",
          pointerEvents: "none",
        }} />

        {/* Close button  */}
        <button
          onClick={() => { sfx?.tap?.(); onClose(); }}
          style={{
            position: "absolute", top: 18, right: 18,
            width: 36, height: 36, borderRadius: 14,
            background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.25)",
            color: "rgba(200,210,255,.8)", fontSize: 16, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "all .2s cubic-bezier(.34,1.56,.64,1)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1) rotate(90deg)"; e.currentTarget.style.background = "rgba(99,102,241,.28)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotate(0deg)"; e.currentTarget.style.background = "rgba(99,102,241,.12)"; e.currentTarget.style.color = "rgba(200,210,255,.8)"; }}
        >✕</button>

        {/* Icon Area */}
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 26, marginTop: 8 }}>
          {/* Orbital rings */}
          <div style={{
            position: "absolute", inset: -16, borderRadius: "50%",
            border: "1px dashed rgba(99,102,241,.3)",
            animation: "spin 12s linear infinite",
          }} />
          <div style={{
            position: "absolute", inset: -24, borderRadius: "50%",
            border: "1px solid rgba(139,92,246,.15)",
            animation: "spinReverse 18s linear infinite",
          }} />

          {/* Spinning glowing aura */}
          <div style={{
            position: "absolute", inset: -12, borderRadius: "50%",
            background: "conic-gradient(from 0deg, transparent 0%, #6366f1 20%, #8b5cf6 40%, transparent 60%, #06b6d4 80%, transparent 100%)",
            animation: "spin 4s linear infinite",
            filter: "blur(10px)", opacity: 0.7,
            maskImage: "radial-gradient(transparent 55%, black 65%)",
            WebkitMaskImage: "radial-gradient(transparent 55%, black 65%)"
          }} />
          
          {/* Core Icon Box */}
          <div style={{
            width: 96, height: 96, borderRadius: 28, position: "relative", zIndex: 1,
            background: "linear-gradient(135deg, rgba(99,102,241,.32), rgba(139,92,246,.25))",
            border: "1px solid rgba(99,102,241,.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48,
            boxShadow: "0 16px 40px rgba(99,102,241,.45), inset 0 2px 0 rgba(255,255,255,.2)",
            animation: "achieveIconPop .6s cubic-bezier(.34,1.56,.64,1) .2s both",
          }}>
            {achievement.icon}
          </div>
        </div>

        {/* Categories / Tags */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14, animation: "achieveFadeUp .4s ease .3s both" }}>
          <div style={{
            fontSize: 9.5, fontWeight: 900, color: "#818cf8",
            letterSpacing: ".16em", textTransform: "uppercase",
            padding: "4px 12px", background: "rgba(99,102,241,.1)",
            border: "1px solid rgba(99,102,241,.25)", borderRadius: 999
          }}>✦ Achievement</div>
          {achievement.secret && (
            <div style={{
              fontSize: 9.5, fontWeight: 900, color: "#f59e0b",
              letterSpacing: ".16em", textTransform: "uppercase",
              padding: "4px 12px", background: "rgba(245,158,11,.12)",
              border: "1px solid rgba(245,158,11,.3)", borderRadius: 999,
              animation: "lockPulse 2s infinite"
            }}>🔒 Secret</div>
          )}
        </div>

        {/* Details */}
        <div style={{ animation: "achieveFadeUp .4s ease .4s both" }}>
          <div style={{
            fontSize: 26, fontWeight: 900,
            background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 60%, #c7d2fe 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 14, letterSpacing: "-.03em", lineHeight: 1.1,
            textShadow: "0 4px 20px rgba(99,102,241,0.2)"
          }}>
            {achievement.title}
          </div>

          <div style={{
            fontSize: 14, color: "rgba(100,116,139,.85)",
            fontWeight: 600, marginBottom: 28, lineHeight: 1.7, padding: "0 10px",
          }}>
            {achievement.desc}
          </div>
        </div>

        {/* Reward Box */}
        <div style={{ animation: "achieveFadeUp .4s ease .5s both" }}>
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            background: "linear-gradient(180deg, rgba(99,102,241,.12) 0%, rgba(99,102,241,.04) 100%)",
            border: "1px solid rgba(99,102,241,.3)",
            padding: "14px 34px", borderRadius: 24,
            boxShadow: "0 8px 30px rgba(99,102,241,.25), inset 0 1px 0 rgba(255,255,255,.08)",
            position: "relative", overflow: "hidden"
          }}>
             {/* Reward inner glow */}
             <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background: "linear-gradient(90deg, transparent, #818cf8, transparent)" }}/>
             <div style={{ fontSize: 10, color: "rgba(165,180,252,.7)", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>
               Reward
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
               <span style={{ fontSize: 24 }}>💫</span>
               <span style={{ fontSize: 22, fontWeight: 900, color: "#e0e7ff", textShadow: "0 0 16px rgba(165,180,252,0.6)" }}>
                 +{achievement.xp} XP
               </span>
             </div>
          </div>
        </div>
        
        {/* Awesome Button */}
        <div style={{ marginTop: 24, animation: "achieveFadeUp .4s ease .6s both" }}>
           <button 
             style={{
               width: "100%", padding: "16px", borderRadius: 18, border: "none",
               background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
               color: "#fff", fontSize: 15, fontWeight: 900, letterSpacing: ".02em",
               boxShadow: "0 8px 24px rgba(99,102,241,.45), inset 0 1px 0 rgba(255,255,255,.2)",
               cursor: "pointer", transition: "all .2s cubic-bezier(.34,1.56,.64,1)"
             }}
             onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,.6), inset 0 1px 0 rgba(255,255,255,.2)"; }}
             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,.45), inset 0 1px 0 rgba(255,255,255,.2)"; }}
             onClick={() => { sfx?.tap?.(); onClose(); }}
           >
             Awesome!
           </button>
        </div>

        <style>{`
          @keyframes achieveBgIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes achieveModalIn {
            from { opacity: 0; transform: scale(.9) translateY(20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes achieveIconPop {
            0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
            60% { transform: scale(1.15) rotate(5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes achieveFadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes nebulaPulse {
            0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
            50%      { opacity: 1; transform: translateX(-50%) scale(1.1); }
          }
          @keyframes spinReverse {
            from { transform: rotate(360deg); }
            to   { transform: rotate(0deg); }
          }
          @keyframes lockPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
            50%      { box-shadow: 0 0 0 4px rgba(245,158,11,0); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AchievementDetailModal;
