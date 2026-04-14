import React, { useEffect, useState } from "react";

const OrbitalMark = ({ size = 56, glowing = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
    style={{
      display: "block",
      filter: glowing
        ? "drop-shadow(0 0 18px rgba(99,102,241,0.7)) drop-shadow(0 0 6px rgba(255,255,255,0.3))"
        : "drop-shadow(0 0 8px rgba(99,102,241,0.3))",
      transition: "filter 0.6s ease",
    }}
  >
    <circle cx="32" cy="32" r="15.5" fill="#050608" />
    <circle cx="32" cy="32" r="19.5" stroke="rgba(255,255,255,.18)" strokeWidth="1.25" />
    <path
      d="M32 11.5c-10.8 0-19.5 8.7-19.5 19.5S21.2 50.5 32 50.5 51.5 41.8 51.5 31 42.8 11.5 32 11.5Zm0 6.2c7.37 0 13.3 5.93 13.3 13.3S39.37 44.3 32 44.3 18.7 38.37 18.7 31 24.63 17.7 32 17.7Z"
      fill="#F6F8FB"
    />
    <path
      d="M10 53.4 49.6 10.6c1.5-1.62 3.95-1.79 5.66-.39 1.7 1.39 2.07 3.88.84 5.71L18.1 54.26c-1.48 1.81-4.11 2.13-5.98.73-1.88-1.41-2.26-4.08-.86-5.99Z"
      fill="url(#splashOrbitalSlash)"
    />
    <path
      d="M15 51.8 52.8 13"
      stroke="rgba(255,255,255,.45)"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="splashOrbitalSlash" x1="13.2" y1="51.8" x2="53.9" y2="12.1" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" stopOpacity=".02" />
        <stop offset=".18" stopColor="#c7d2fe" />
        <stop offset=".5" stopColor="#818cf8" />
        <stop offset=".82" stopColor="#e0e7ff" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity=".04" />
      </linearGradient>
    </defs>
  </svg>
);

// Mini star particle for burst effect
const StarParticle = ({ x, y, delay, angle, dist }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: 2,
      height: 2,
      borderRadius: "50%",
      background: "rgba(200,210,255,0.9)",
      boxShadow: "0 0 4px rgba(99,102,241,0.8)",
      animation: `starBurst 1.2s cubic-bezier(.22,1,.36,1) ${delay}s both`,
      "--tx": `${Math.cos(angle) * dist}px`,
      "--ty": `${Math.sin(angle) * dist}px`,
    }}
  />
);

function SplashScreen({ th, onDone, sfx, isTg }) {
  const [phase, setPhase] = useState(0);
  // 0 = darkness
  // 1 = logo materializes
  // 2 = title types in
  // 3 = status bar
  // 4 = done / UI in

  const [progress, setProgress] = useState(0);
  const [glowing, setGlowing] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const title = "RIVAL SPACE";
  const statuses = [
    "SYSTEMS INITIALIZING...",
    "LOADING ATLAS...",
    "CALIBRATING ORBIT...",
    "SYSTEMS ONLINE ●●●●●",
  ];

  useEffect(() => {
    sfx.boot();

    // Phase 1 — logo in
    const t1 = setTimeout(() => setPhase(1), 300);
    // Phase 1b — glow up
    const t1b = setTimeout(() => setGlowing(true), 800);
    // Phase 2 — type title
    const t2 = setTimeout(() => setPhase(2), 950);
    // Phase 3 — status bar
    const t3 = setTimeout(() => setPhase(3), 1550);

    // Type title char by char
    let charIdx = 0;
    const charIv = setInterval(() => {
      charIdx++;
      setCharCount(charIdx);
      if (charIdx >= title.length) clearInterval(charIv);
    }, 55);

    // Progress bar
    let p = 0;
    let si = 0;
    const progressIv = setInterval(() => {
      p += Math.random() * 7 + 4;
      const capped = Math.min(p, 100);
      setProgress(capped);
      const newSi = Math.min(Math.floor(capped / 25), 3);
      if (newSi !== si) { si = newSi; setStatusIdx(newSi); }
      if (capped >= 100) {
        clearInterval(progressIv);
        setTimeout(onDone, 420);
      }
    }, 90);

    return () => {
      clearTimeout(t1); clearTimeout(t1b); clearTimeout(t2); clearTimeout(t3);
      clearInterval(charIv); clearInterval(progressIv);
    };
  }, [onDone, sfx]);

  // Generate star burst particles
  const particles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i / 16) * Math.PI * 2,
    dist: 60 + Math.random() * 50,
    delay: 0.6 + Math.random() * 0.4,
  }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(180deg, #030408 0%, #040610 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        gap: 0,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes splashVoidIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes splashLogoMaterialize {
          0%   { opacity: 0; transform: scale(0.3) rotate(-20deg); filter: blur(20px); }
          60%  { opacity: 1; filter: blur(0px); }
          80%  { transform: scale(1.08) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0px); }
        }
        @keyframes splashLogoFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes splashTitleChar {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashSubIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashBarIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashProgressGlow {
          0%,100% { box-shadow: 0 0 8px rgba(99,102,241,0.6); }
          50%      { box-shadow: 0 0 18px rgba(99,102,241,0.9), 0 0 4px rgba(200,210,255,0.8); }
        }
        @keyframes starBurst {
          0%   { opacity: 0; transform: translate(-50%,-50%) translate(0,0) scale(0); }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(1.5); }
        }
        @keyframes splashRingPulse {
          0%,100% { transform: scale(1); opacity: 0.4; }
          50%      { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes nebulaFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Nebula bg hint */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 40% 30%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(139,92,246,0.06) 0%, transparent 55%)",
        animation: "nebulaFade 1.5s ease both",
      }} />

      {/* Logo section */}
      <div
        style={{
          position: "relative",
          width: 130,
          height: 130,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
          animation: phase >= 1 ? "splashLogoMaterialize 0.9s cubic-bezier(.18,.9,.24,1) both, splashLogoFloat 4.6s ease-in-out 1.2s infinite" : "none",
          opacity: phase >= 1 ? 1 : 0,
        }}
      >
        {/* Pulsing orbit ring */}
        <div style={{
          position: "absolute",
          inset: -20,
          borderRadius: "50%",
          border: "1px solid rgba(99,102,241,0.25)",
          animation: glowing ? "splashRingPulse 2.8s ease-in-out infinite" : "none",
        }} />
        <div style={{
          position: "absolute",
          inset: -36,
          borderRadius: "50%",
          border: "1px solid rgba(99,102,241,0.10)",
          animation: glowing ? "splashRingPulse 3.4s ease-in-out 0.4s infinite" : "none",
        }} />

        {/* Glow halo */}
        <div style={{
          position: "absolute",
          inset: -20,
          background: "radial-gradient(circle, rgba(99,102,241,0.20) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
          filter: "blur(12px)",
          transition: "opacity 0.8s ease",
          opacity: glowing ? 1 : 0,
        }} />

        <OrbitalMark size={72} glowing={glowing} />

        {/* Star burst particles */}
        {glowing && particles.map((p, i) => (
          <StarParticle key={i} {...p} />
        ))}
      </div>

      {/* Title — character by character */}
      <div style={{
        textAlign: "center",
        marginBottom: 12,
        minHeight: 44,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div style={{
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: ".16em",
          color: "#ffffff",
          fontFamily: "var(--font-display)",
          textShadow: "0 0 30px rgba(99,102,241,0.5)",
          display: "flex",
          gap: 0,
          overflow: "hidden",
        }}>
          {title.split("").map((char, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: charCount > i ? 1 : 0,
                transform: charCount > i ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.12s ease, transform 0.12s ease`,
                color: char === " " ? "transparent" : i < 5 ? "#c7d2fe" : "#e0e7ff",
                textShadow: charCount > i ? "0 0 20px rgba(99,102,241,0.6)" : "none",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
        <div style={{
          fontSize: 11,
          color: "rgba(148,163,184,0.7)",
          marginTop: 8,
          letterSpacing: ".18em",
          fontFamily: "var(--font-micro)",
          animation: phase >= 2 ? "splashSubIn .6s ease .3s both" : "none",
          opacity: phase >= 2 ? 1 : 0,
        }}>
          {isTg ? "TELEGRAM MINI APP · v5.0" : "WEB BUILD · v5.0"}
        </div>
      </div>

      {/* Progress + Status */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          width: 240,
          marginTop: 24,
          animation: phase >= 3 ? "splashBarIn .5s ease both" : "none",
          opacity: phase >= 3 ? 1 : 0,
        }}
      >
        <div style={{
          width: "100%",
          height: 3,
          borderRadius: 999,
          background: "rgba(99,102,241,0.15)",
          overflow: "hidden",
        }}>
          <div
            style={{
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #6366f1, #818cf8, #22d3ee)",
              backgroundSize: "200% 100%",
              width: `${progress}%`,
              transition: "width .12s ease",
              animation: "splashProgressGlow 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <div style={{
          fontSize: 9.5,
          color: "rgba(148,163,184,0.6)",
          fontWeight: 700,
          letterSpacing: ".18em",
          fontFamily: "var(--font-micro)",
          transition: "opacity .3s ease",
        }}>
          {statuses[statusIdx]}
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
