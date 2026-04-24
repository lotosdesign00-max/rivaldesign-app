import React from "react";

function MeshBg() {
  return (
    <>
      <div
        aria-hidden="true"
        className="rs-mesh-bg"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          contain: "strict",
          transform: "translateZ(0)",
          background: "linear-gradient(180deg, #030408 0%, #040610 45%, #050810 100%)",
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            AURORA BOREALIS — Северное сияние на верхнем крае
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-aurora"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: `
              linear-gradient(180deg,
                rgba(16, 185, 129, 0.08) 0%,
                rgba(16, 185, 129, 0.04) 20%,
                rgba(139, 92, 246, 0.06) 40%,
                rgba(139, 92, 246, 0.03) 60%,
                transparent 100%
              )
            `,
            filter: "blur(60px)",
            animation: "auroraWave 12s ease-in-out infinite",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        />
        <div
          className="rs-mesh-aurora-b"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "25%",
            background: `
              linear-gradient(180deg,
                rgba(99, 102, 241, 0.05) 0%,
                rgba(99, 102, 241, 0.02) 50%,
                transparent 100%
              )
            `,
            filter: "blur(40px)",
            animation: "auroraWave2 18s ease-in-out infinite",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            NEBULAE — Плавающие космические туманности
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-nebula rs-mesh-nebula-a"
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "70%",
            height: "65%",
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
            filter: "blur(40px)",
            animation: "nebulaFloat1 22s ease-in-out infinite alternate",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        />

        <div
          className="rs-mesh-nebula rs-mesh-nebula-b"
          style={{
            position: "absolute",
            top: "30%",
            right: "-15%",
            width: "60%",
            height: "55%",
            background:
              "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 45%, transparent 70%)",
            filter: "blur(50px)",
            animation: "nebulaFloat2 28s ease-in-out infinite alternate",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        />

        <div
          className="rs-mesh-nebula rs-mesh-nebula-c"
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "20%",
            width: "50%",
            height: "40%",
            background:
              "radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, rgba(34,211,238,0.03) 45%, transparent 70%)",
            filter: "blur(35px)",
            animation: "nebulaFloat3 18s ease-in-out infinite alternate",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            MAGENTA NEBULA — Новый розово-пурпурный акцент
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-nebula rs-mesh-nebula-d"
          style={{
            position: "absolute",
            top: "50%",
            left: "60%",
            width: "40%",
            height: "35%",
            background:
              "radial-gradient(ellipse at center, rgba(236,72,153,0.06) 0%, rgba(236,72,153,0.02) 50%, transparent 70%)",
            filter: "blur(45px)",
            animation: "nebulaFloat4 32s ease-in-out infinite alternate",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            STAR LAYER FAR — Дальние звёзды (медленные)
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-stars rs-mesh-stars-far"
          style={{
            position: "absolute",
            inset: "-8%",
            backgroundImage: `
              radial-gradient(circle at 14% 48%, rgba(255,255,255,.5) 0 .8px, transparent 1.4px),
              radial-gradient(circle at 34% 84%, rgba(200,210,255,.42) 0 .7px, transparent 1.3px),
              radial-gradient(circle at 49% 23%, rgba(255,255,255,.48) 0 .75px, transparent 1.3px),
              radial-gradient(circle at 66% 88%, rgba(220,220,255,.40) 0 .7px, transparent 1.2px),
              radial-gradient(circle at 79% 13%, rgba(255,255,255,.52) 0 .8px, transparent 1.3px),
              radial-gradient(circle at 91% 57%, rgba(200,215,255,.45) 0 .75px, transparent 1.3px),
              radial-gradient(circle at 23% 62%, rgba(255,255,255,.40) 0 .65px, transparent 1.2px),
              radial-gradient(circle at 55% 39%, rgba(210,220,255,.42) 0 .7px, transparent 1.3px),
              radial-gradient(circle at 7% 33%, rgba(255,255,255,.38) 0 .6px, transparent 1.1px),
              radial-gradient(circle at 63% 5%, rgba(200,210,255,.36) 0 .6px, transparent 1.1px),
              radial-gradient(circle at 85% 45%, rgba(255,255,255,.44) 0 .7px, transparent 1.2px),
              radial-gradient(circle at 42% 72%, rgba(220,230,255,.40) 0 .65px, transparent 1.2px)
            `,
            opacity: 0.6,
            animation: "starfieldDriftReverse 80s linear infinite",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            STAR LAYER NEAR — Ближние звёзды (быстрые + мерцание)
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-stars rs-mesh-stars-near"
          style={{
            position: "absolute",
            inset: "-12%",
            backgroundImage: `
              radial-gradient(circle at 8% 15%, rgba(255,255,255,1) 0 1.2px, transparent 2px),
              radial-gradient(circle at 19% 72%, rgba(200,210,255,.8) 0 1px, transparent 1.8px),
              radial-gradient(circle at 28% 32%, rgba(255,255,255,.9) 0 1.3px, transparent 2px),
              radial-gradient(circle at 41% 18%, rgba(200,220,255,.75) 0 1px, transparent 1.7px),
              radial-gradient(circle at 58% 61%, rgba(255,255,255,.82) 0 1.2px, transparent 1.8px),
              radial-gradient(circle at 72% 27%, rgba(220,220,255,.95) 0 1.3px, transparent 2px),
              radial-gradient(circle at 83% 79%, rgba(255,255,255,.78) 0 1px, transparent 1.8px),
              radial-gradient(circle at 92% 41%, rgba(200,215,255,.88) 0 1.1px, transparent 1.7px),
              radial-gradient(circle at 35% 55%, rgba(255,255,255,.68) 0 .9px, transparent 1.5px),
              radial-gradient(circle at 67% 88%, rgba(180,200,255,.62) 0 .85px, transparent 1.5px),
              radial-gradient(circle at 12% 85%, rgba(255,255,255,.72) 0 1px, transparent 1.6px),
              radial-gradient(circle at 88% 12%, rgba(200,230,255,.78) 0 1.2px, transparent 1.8px)
            `,
            opacity: 0.85,
            animation: "starfieldDrift 55s linear infinite, starTwinkle 4s ease-in-out infinite",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            TWINKLING STARS — Яркие мерцающие звёзды (отдельный слой)
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-stars rs-mesh-stars-twinkle"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 15% 25%, rgba(255,255,255,1) 0 2px, transparent 3px),
              radial-gradient(circle at 45% 15%, rgba(200,220,255,1) 0 1.8px, transparent 3px),
              radial-gradient(circle at 75% 35%, rgba(255,255,255,1) 0 2px, transparent 3px),
              radial-gradient(circle at 25% 65%, rgba(220,210,255,1) 0 1.6px, transparent 2.5px),
              radial-gradient(circle at 65% 75%, rgba(255,255,255,1) 0 1.8px, transparent 3px),
              radial-gradient(circle at 85% 55%, rgba(200,230,255,1) 0 2px, transparent 3px),
              radial-gradient(circle at 5% 85%, rgba(255,255,255,.95) 0 1.5px, transparent 2.5px),
              radial-gradient(circle at 55% 45%, rgba(210,220,255,1) 0 1.7px, transparent 2.8px)
            `,
            opacity: 0.9,
            animation: "starTwinkle 3s ease-in-out infinite",
            transform: "translateZ(0)",
            willChange: "opacity",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            COSMIC DUST — Космическая пыль
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-dust"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(255,255,255,.15) 0 1px, transparent 1.5px),
              radial-gradient(circle at 30% 70%, rgba(200,200,255,.12) 0 .8px, transparent 1.3px),
              radial-gradient(circle at 50% 40%, rgba(255,255,255,.1) 0 .7px, transparent 1.2px),
              radial-gradient(circle at 70% 10%, rgba(220,220,255,.14) 0 .9px, transparent 1.4px),
              radial-gradient(circle at 90% 60%, rgba(255,255,255,.13) 0 .8px, transparent 1.3px),
              radial-gradient(circle at 20% 90%, rgba(200,210,255,.11) 0 .7px, transparent 1.2px),
              radial-gradient(circle at 60% 80%, rgba(255,255,255,.1) 0 .6px, transparent 1.1px),
              radial-gradient(circle at 80% 30%, rgba(220,230,255,.12) 0 .8px, transparent 1.3px)
            `,
            opacity: 0.5,
            animation: "dustDrift 120s linear infinite",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            GRAVITATIONAL WAVES — Гравитационные волны
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-gravity"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "150%",
            height: "150%",
            transform: "translate(-50%, -50%)",
            background: "transparent",
            animation: "gravityPulse 8s ease-out infinite",
            transformOrigin: "center center",
          }}
        >
          <div style={{
            position: "absolute",
            inset: "25%",
            border: "1px solid rgba(99,102,241,0.04)",
            borderRadius: "50%",
            animation: "gravityRing 8s ease-out infinite",
          }} />
          <div style={{
            position: "absolute",
            inset: "40%",
            border: "1px solid rgba(139,92,246,0.03)",
            borderRadius: "50%",
            animation: "gravityRing 8s ease-out 2s infinite",
          }} />
          <div style={{
            position: "absolute",
            inset: "55%",
            border: "1px solid rgba(34,211,238,0.02)",
            borderRadius: "50%",
            animation: "gravityRing 8s ease-out 4s infinite",
          }} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            TOP GLOW — Верхнее свечение
            ═══════════════════════════════════════════════════════════════ */}
<div
          className="rs-mesh-glow"
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "35%",
            background:
              "radial-gradient(ellipse at top, rgba(99,102,241,0.10) 0%, transparent 65%)",
            filter: "blur(10px)",
            willChange: "opacity",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            SHOOTING STARS — Падающие звёзды
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-shooting-star rs-shooting-star-a"
          style={{
            position: "absolute",
            top: "11%",
            left: "16%",
            width: "28vw",
            maxWidth: 240,
            minWidth: 120,
            height: 1.5,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(200,210,255,.28) 20%, rgba(255,255,255,.8) 50%, rgba(200,210,255,.25) 80%, rgba(255,255,255,0) 100%)",
            transform: "rotate(-46deg)",
            transformOrigin: "left center",
            boxShadow: "0 0 12px rgba(200,210,255,.35)",
            animation: "shootingStar1 11s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />

        <div
          className="rs-shooting-star rs-shooting-star-b"
          style={{
            position: "absolute",
            top: "52%",
            right: "8%",
            width: "20vw",
            maxWidth: 160,
            minWidth: 80,
            height: 1.5,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(160,180,255,.22) 20%, rgba(255,255,255,.65) 50%, rgba(160,180,255,.20) 80%, rgba(255,255,255,0) 100%)",
            transform: "rotate(-38deg)",
            transformOrigin: "left center",
            animation: "shootingStar2 17s ease-in-out 5s infinite",
            willChange: "transform, opacity",
          }}
        />

        <div
          className="rs-shooting-star rs-shooting-star-c"
          style={{
            position: "absolute",
            top: "75%",
            left: "35%",
            width: "15vw",
            maxWidth: 100,
            minWidth: 60,
            height: 1,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(180,200,255,.15) 30%, rgba(255,255,255,.5) 50%, rgba(180,200,255,.12) 70%, rgba(255,255,255,0) 100%)",
            transform: "rotate(-52deg)",
            transformOrigin: "left center",
            animation: "shootingStar3 23s ease-in-out 10s infinite",
            willChange: "transform, opacity",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            VIGNETTE — Затемнение по краям
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rs-mesh-vignette"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(3,4,8,0.7) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      <style>{`
        /* ═══════════════════════════════════════════════════════════════
           AURORA BOREALIS — Северное сияние
           ═══════════════════════════════════════════════════════════════ */
        @keyframes auroraWave {
          0% {
            transform: translate3d(-2%, 0, 0) scaleY(1);
            opacity: 0.7;
            filter: blur(60px);
          }
          50% {
            transform: translate3d(2%, -3%, 0) scaleY(1.1);
            opacity: 0.9;
            filter: blur(55px);
          }
          100% {
            transform: translate3d(-1%, -2%, 0) scaleY(1.05);
            opacity: 0.75;
            filter: blur(65px);
          }
        }
        @keyframes auroraWave2 {
          0% {
            transform: translate3d(1%, 0, 0) scaleY(1);
            opacity: 0.5;
          }
          50% {
            transform: translate3d(-2%, 2%, 0) scaleY(0.9);
            opacity: 0.7;
          }
          100% {
            transform: translate3d(2%, 1%, 0) scaleY(1);
            opacity: 0.55;
          }
        }

        /* ═══════════════════════════════════════════════════════════════
           NEBULAE — Плавающие туманности
           ═══════════════════════════════════════════════════════════════ */
        @keyframes nebulaFloat1 {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.85; }
          100%{ transform: translate3d(4%, 3%, 0) scale(1.08); opacity: 1; }
        }
        @keyframes nebulaFloat2 {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.7; }
          100%{ transform: translate3d(-5%, -3%, 0) scale(1.12); opacity: 0.95; }
        }
        @keyframes nebulaFloat3 {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.6; }
          100%{ transform: translate3d(3%, -4%, 0) scale(1.1); opacity: 0.9; }
        }
        @keyframes nebulaFloat4 {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.5; }
          100%{ transform: translate3d(-3%, 2%, 0) scale(1.15); opacity: 0.8; }
        }

        /* ═══════════════════════════════════════════════════════════════
           STARFIELD — Звёздное поле (параллакс)
           ═══════════════════════════════════════════════════════════════ */
        @keyframes starfieldDrift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(-2.5%, 2.5%, 0) scale(1.04); }
        }
        @keyframes starfieldDriftReverse {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(2%, -2%, 0) scale(1.03); }
        }

        /* ═══════════════════════════════════════════════════════════════
           STAR TWINKLE — Мерцание звёзд
           ═══════════════════════════════════════════════════════════════ */
        @keyframes starTwinkle {
          0%, 100% {
            opacity: 0.9;
            filter: brightness(1);
          }
          50% {
            opacity: 0.4;
            filter: brightness(0.6);
          }
        }

        /* ═══════════════════════════════════════════════════════════════
           COSMIC DUST — Космическая ��ыль
           ═══════════════════════════════════════════════════════════════ */
        @keyframes dustDrift {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-5%, 5%, 0); }
        }

        /* ═══════════════════════════════════════════════════════════════
           GRAVITATIONAL WAVES — Гравитационные волны
           ═══════════════════════════════════════════════════════════════ */
        @keyframes gravityPulse {
          0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes gravityRing {
          0% {
            transform: scale(0.5);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* ═══════════════════════════════════════════════════════════════
           SHOOTING STARS — Падающие звёзды
           ═══════════════════════════════════════════════════════════════ */
        @keyframes shootingStar1 {
          0%, 62%, 100% { opacity: 0; transform: translate3d(0, 0, 0) rotate(-46deg); }
          8% { opacity: 1; }
          30% { opacity: 0.2; transform: translate3d(16vw, 12vh, 0) rotate(-46deg); }
          34% { opacity: 0; }
        }
        @keyframes shootingStar2 {
          0%, 70%, 100% { opacity: 0; transform: translate3d(0, 0, 0) rotate(-38deg); }
          10% { opacity: 0.85; }
          32% { opacity: 0.15; transform: translate3d(-12vw, 9vh, 0) rotate(-38deg); }
          36% { opacity: 0; }
        }
        @keyframes shootingStar3 {
          0%, 75%, 100% { opacity: 0; transform: translate3d(0, 0, 0) rotate(-52deg); }
          12% { opacity: 0.7; }
          35% { opacity: 0.1; transform: translate3d(10vw, 8vh, 0) rotate(-52deg); }
          38% { opacity: 0; }
        }

        /* ═══════════════════════════════════════════════════════════════
           PERFORMANCE MODE — Reduced motion на слабых устройствах
           ═══════════════════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          .rs-mesh-bg > div {
            animation: none !important;
            animation-play-state: paused !important;
          }
          .rs-mesh-bg > div {
            opacity: 0.7 !important;
            filter: blur(50px) !important;
          }
        }

        /* ═══════════════════════════════════════════════════════════════
           PERFORMANCE MODE — Smooth/eco режим (низкое энергопотребление)
           ═══════════════════════════════════════════════════════════════ */
        html[data-rs-performance="smooth"] .rs-mesh-nebula,
        html[data-rs-power="eco"] .rs-mesh-nebula {
          animation: none !important;
          filter: blur(30px) !important;
          opacity: 0.5 !important;
        }
        html[data-rs-performance="smooth"] .rs-mesh-stars-twinkle,
        html[data-rs-power="eco"] .rs-mesh-stars-twinkle {
          animation: none !important;
          opacity: 0.4 !important;
        }
        html[data-rs-performance="smooth"] .rs-mesh-aurora,
        html[data-rs-power="eco"] .rs-mesh-aurora {
          animation: none !important;
          filter: blur(80px) !important;
          opacity: 0.3 !important;
        }
        html[data-rs-performance="smooth"] .rs-shooting-star,
        html[data-rs-power="eco"] .rs-shooting-star {
          animation: none !important;
        }
        html[data-rs-performance="smooth"] .rs-mesh-dust,
        html[data-rs-power="eco"] .rs-mesh-dust {
          animation: none !important;
          opacity: 0.2 !important;
        }
        html[data-rs-performance="smooth"] .rs-mesh-gravity,
        html[data-rs-power="eco"] .rs-mesh-gravity {
          display: none !important;
        }
        html[data-rs-performance="smooth"] .rs-mesh-stars,
        html[data-rs-power="eco"] .rs-mesh-stars {
          animation-duration: 120s !important;
        }

        /* ═══════════════════════════════════════════════════════════════
           MOBILE PERFORMANCE — Оптимизация для мобильных
           ═══════════════════════════════════════════════════════════════ */
        html[data-rs-mobile="true"] .rs-mesh-stars-twinkle {
          display: none;
        }
        html[data-rs-mobile="true"] .rs-mesh-aurora-b {
          display: none;
        }
        html[data-rs-mobile="true"] .rs-shooting-star-c {
          display: none;
        }
      `}</style>
    </>
  );
}

export default React.memo(MeshBg);