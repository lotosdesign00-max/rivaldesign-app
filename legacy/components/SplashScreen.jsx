import React, { useEffect, useState, useRef } from "react";
import BrandLogo from "./BrandLogo";

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
        ? "drop-shadow(0 0 20px rgba(99,102,241,0.8)) drop-shadow(0 0 8px rgba(255,255,255,0.4))"
        : "drop-shadow(0 0 10px rgba(99,102,241,0.4))",
      transition: "filter 0.8s ease",
    }}
  >
    {/* Внешнее свечение */}
    <circle
      cx="32" cy="32" r="32"
      fill="url(#splashOrbitalGlow)"
      opacity={glowing ? 0.3 : 0.15}
    />
    {/* Орбитальное кольцо */}
    <circle
      cx="32" cy="32" r="19.5"
      stroke="rgba(255,255,255,.22)"
      strokeWidth="1.25"
      style={{
        animation: glowing ? "orbitalRingRotate 8s linear infinite" : "none",
        transformOrigin: "32px 32px",
      }}
    />
    {/* Центральный круг */}
    <circle
      cx="32" cy="32" r="15.5"
      fill="#050608"
      style={{
        animation: glowing ? "orbitalCorePulse 3s ease-in-out infinite" : "none",
        transformOrigin: "32px 32px",
      }}
    />
    {/* Логотип */}
    <path
      d="M32 11.5c-10.8 0-19.5 8.7-19.5 19.5S21.2 50.5 32 50.5 51.5 41.8 51.5 31 42.8 11.5 32 11.5Zm0 6.2c7.37 0 13.3 5.93 13.3 13.3S39.37 44.3 32 44.3 18.7 38.37 18.7 31 24.63 17.7 32 17.7Z"
      fill="#F6F8FB"
      style={{ animation: glowing ? "orbitalCorePulse 3s ease-in-out infinite" : "none", transformOrigin: "32px 32px" }}
    />
    {/* Диагональная линия */}
    <path
      d="M10 53.4 49.6 10.6c1.5-1.62 3.95-1.79 5.66-.39 1.7 1.39 2.07 3.88.84 5.71L18.1 54.26c-1.48 1.81-4.11 2.13-5.98.73-1.88-1.41-2.26-4.08-.86-5.99Z"
      fill="url(#splashOrbitalSlash)"
      style={{ animation: glowing ? "orbitalSlashGlow 3s ease-in-out infinite" : "none" }}
    />
    <path
      d="M15 51.8 52.8 13"
      stroke="rgba(255,255,255,.5)"
      strokeWidth="1.2"
      strokeLinecap="round"
      style={{ animation: glowing ? "orbitalSlashGlow 3s ease-in-out infinite" : "none" }}
    />
    {/* Определения градиентов */}
    <defs>
      <linearGradient id="splashOrbitalSlash" x1="13.2" y1="51.8" x2="53.9" y2="12.1" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" stopOpacity=".03" />
        <stop offset=".18" stopColor="#c7d2fe" />
        <stop offset=".5" stopColor="#818cf8" />
        <stop offset=".82" stopColor="#e0e7ff" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity=".05" />
      </linearGradient>
      <radialGradient id="splashOrbitalGlow" cx="32" cy="32" r="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" stopOpacity="0.5" />
        <stop offset="0.5" stopColor="#6366f1" stopOpacity="0.2" />
        <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

// Мини частица звезды для burst эффекта
const StarParticle = ({ delay, angle, dist }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: 3,
      height: 3,
      borderRadius: "50%",
      background: "rgba(200,210,255,1)",
      boxShadow: "0 0 8px rgba(99,102,241,1), 0 0 16px rgba(99,102,241,0.5)",
      animation: `starBurst 1.4s cubic-bezier(.22,1,.36,1) ${delay}s both`,
      "--tx": `${Math.cos(angle) * dist}px`,
      "--ty": `${Math.sin(angle) * dist}px`,
    }}
  />
);

// Частица космической пыли
const DustParticle = ({ x, y, delay, size }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: "50%",
      background: "rgba(200,210,255,0.4)",
      boxShadow: "0 0 4px rgba(99,102,241,0.3)",
      animation: `dustFloat 3s ease-in-out ${delay}s infinite`,
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
    const t1 = setTimeout(() => setPhase(1), 350);
    // Phase 1b — glow up
    const t1b = setTimeout(() => setGlowing(true), 900);
    // Phase 2 — type title
    const t2 = setTimeout(() => setPhase(2), 1100);
    // Phase 3 — status bar
    const t3 = setTimeout(() => setPhase(3), 1700);

    // Type title char by char
    let charIdx = 0;
    const charIv = setInterval(() => {
      charIdx++;
      setCharCount(charIdx);
      if (charIdx >= title.length) clearInterval(charIv);
    }, 60);

    // Progress bar
    let p = 0;
    let si = 0;
    const progressIv = setInterval(() => {
      p += Math.random() * 6 + 4;
      const capped = Math.min(p, 100);
      setProgress(capped);
      const newSi = Math.min(Math.floor(capped / 25), 3);
      if (newSi !== si) { si = newSi; setStatusIdx(newSi); }
      if (capped >= 100) {
        clearInterval(progressIv);
        setTimeout(onDone, 500);
      }
    }, 100);

    return () => {
      clearTimeout(t1); clearTimeout(t1b); clearTimeout(t2); clearTimeout(t3);
      clearInterval(charIv); clearInterval(progressIv);
    };
  }, [onDone, sfx]);

  // Генерируем частицы звездного взрыва
  const particles = Array.from({ length: 20 }, (_, i) => ({
    angle: (i / 20) * Math.PI * 2,
    dist: 65 + Math.random() * 55,
    delay: 0.7 + Math.random() * 0.5,
  }));

  // Генерируем космическую пыль
  const dustParticles = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 2 + 1,
  }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(180deg, #030408 0%, #040610 50%, #060812 100%)",
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
          0% { opacity: 0; transform: scale(0.3) rotate(-20deg); filter: blur(25px); }
          60% { opacity: 1; filter: blur(0px); }
          80% { transform: scale(1.1) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0px); }
        }
        @keyframes splashLogoFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes splashTitleChar {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashSubIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashBarIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashProgressGlow {
          0%,100% { box-shadow: 0 0 10px rgba(99,102,241,0.7), 0 0 20px rgba(99,102,241,0.3); }
          50%      { box-shadow: 0 0 25px rgba(99,102,241,1), 0 0 50px rgba(99,102,241,0.5), 0 0 6px rgba(200,210,255,1); }
        }
        @keyframes starBurst {
          0% { opacity: 0; transform: translate(-50%,-50%) translate(0,0) scale(0); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(1.8); }
        }
        @keyframes splashRingPulse {
          0%,100% { transform: scale(1); opacity: 0.3; }
          50%      { transform: scale(1.2); opacity: 0.7; }
        }
        @keyframes nebulaFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dustFloat {
          0%,100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(10px, -15px); opacity: 0.6; }
        }
        @keyframes orbitalRingRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitalCorePulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        @keyframes orbitalSlashGlow {
          0%,100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes auroraPulse {
          0%,100% { opacity: 0.15; transform: scaleY(1); }
          50% { opacity: 0.3; transform: scaleY(1.1); }
        }
      `}</style>

      {/* Космический фон */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        overflow: "hidden",
      }}>
        {/* Основная туманность */}
        <div style={{
          position: "absolute",
          top: "-30%",
          left: "-20%",
          width: "80%",
          height: "60%",
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "auroraPulse 6s ease-in-out infinite",
        }} />
        {/* Вторичная туманность */}
        <div style={{
          position: "absolute",
          bottom: "-20%",
          right: "-15%",
          width: "60%",
          height: "50%",
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.03) 50%, transparent 70%)",
          filter: "blur(50px)",
          animation: "auroraPulse 8s ease-in-out 2s infinite",
        }} />
        {/* Северное сияние hint */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(180deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 30%, transparent 100%)",
          filter: "blur(40px)",
          animation: "auroraPulse 10s ease-in-out infinite",
        }} />
        {/* Звёзды */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.9) 0 1.5px, transparent 2px),
            radial-gradient(circle at 35% 75%, rgba(200,210,255,0.7) 0 1px, transparent 1.5px),
            radial-gradient(circle at 55% 30%, rgba(255,255,255,0.8) 0 1.2px, transparent 1.8px),
            radial-gradient(circle at 75% 60%, rgba(200,220,255,0.75) 0 1px, transparent 1.5px),
            radial-gradient(circle at 85% 15%, rgba(255,255,255,0.85) 0 1.3px, transparent 2px),
            radial-gradient(circle at 25% 45%, rgba(220,220,255,0.7) 0 1px, transparent 1.5px),
            radial-gradient(circle at 65% 85%, rgba(255,255,255,0.8) 0 1.2px, transparent 1.8px),
            radial-gradient(circle at 45% 55%, rgba(200,210,255,0.65) 0 .9px, transparent 1.4px)
          `,
          animation: "nebulaFade 2s ease both",
        }} />
        {/* Космическая пыль */}
        {dustParticles.map((dust, i) => (
          <DustParticle key={i} {...dust} />
        ))}
      </div>

      {/* Logo section */}
      <div
        style={{
          position: "relative",
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 36,
          animation: phase >= 1 ? "splashLogoMaterialize 1s cubic-bezier(.18,.9,.24,1) both, splashLogoFloat 5s ease-in-out 1.4s infinite" : "none",
          opacity: phase >= 1 ? 1 : 0,
        }}
      >
        {/* Пульсирующие орбитальные кольца */}
        <div style={{
          position: "absolute",
          inset: -28,
          borderRadius: "50%",
          border: "1px solid rgba(99,102,241,0.3)",
          animation: glowing ? "splashRingPulse 2.5s ease-in-out infinite" : "none",
        }} />
        <div style={{
          position: "absolute",
          inset: -48,
          borderRadius: "50%",
          border: "1px solid rgba(99,102,241,0.15)",
          animation: glowing ? "splashRingPulse 3.5s ease-in-out 0.5s infinite" : "none",
        }} />
        <div style={{
          position: "absolute",
          inset: -68,
          borderRadius: "50%",
          border: "1px solid rgba(139,92,246,0.08)",
          animation: glowing ? "splashRingPulse 4.5s ease-in-out 1s infinite" : "none",
        }} />

        {/* Glow halo */}
        <div style={{
          position: "absolute",
          inset: -30,
          background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)",
          filter: "blur(15px)",
          transition: "opacity 1s ease",
          opacity: glowing ? 1 : 0,
        }} />

        <BrandLogo size={100} glowing={glowing} />

        {/* Star burst частицы */}
        {glowing && particles.map((p, i) => (
          <StarParticle key={i} {...p} />
        ))}
      </div>

      {/* Title — character by character */}
      <div style={{
        textAlign: "center",
        marginBottom: 14,
        minHeight: 48,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div style={{
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: ".18em",
          color: "#ffffff",
          fontFamily: "var(--font-display)",
          textShadow: "0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.3)",
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
                transform: charCount > i ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.15s ease, transform 0.15s ease`,
                color: char === " " ? "transparent" : i < 5 ? "#c7d2fe" : "#e0e7ff",
                textShadow: charCount > i ? "0 0 25px rgba(99,102,241,0.7)" : "none",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
        <div style={{
          fontSize: 10,
          color: "rgba(148,163,184,0.7)",
          marginTop: 10,
          letterSpacing: ".22em",
          fontFamily: "var(--font-micro)",
          animation: phase >= 2 ? "splashSubIn .7s ease .4s both" : "none",
          opacity: phase >= 2 ? 1 : 0,
        }}>
          {isTg ? "TELEGRAM MINI APP · v6.0" : "WEB BUILD · v6.0"}
        </div>
      </div>

      {/* Progress + Status */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          width: 260,
          marginTop: 28,
          animation: phase >= 3 ? "splashBarIn .6s ease both" : "none",
          opacity: phase >= 3 ? 1 : 0,
        }}
      >
        <div style={{
          width: "100%",
          height: 3,
          borderRadius: 999,
          background: "rgba(99,102,241,0.15)",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(99,102,241,0.1)",
        }}>
          <div
            style={{
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #6366f1, #818cf8, #22d3ee, #818cf8, #6366f1)",
              backgroundSize: "300% 100%",
              width: `${progress}%`,
              transition: "width .15s ease",
              animation: "splashProgressGlow 2s ease-in-out infinite, gradientShift 3s linear infinite",
            }}
          />
        </div>
        <div style={{
          fontSize: 9,
          color: "rgba(148,163,184,0.65)",
          fontWeight: 700,
          letterSpacing: ".2em",
          fontFamily: "var(--font-micro)",
          transition: "opacity .35s ease",
        }}>
          {statuses[statusIdx]}
        </div>
      </div>

      {/* Дополнительные декоративные элементы */}
      <div style={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 8,
        opacity: phase >= 3 ? 0.5 : 0,
        transition: "opacity 0.5s ease",
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "rgba(99,102,241,0.6)",
              animation: `starTwinkle 2s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default SplashScreen;