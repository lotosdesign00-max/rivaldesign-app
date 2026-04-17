import React from "react";

function MeshBg() {
  const drift = {
    nebulaNear: "translate3d(0, 0, 0)",
    nebulaFar: "translate3d(0, 0, 0)",
    starsNear: "translate3d(0, 0, 0)",
    starsFar: "translate3d(0, 0, 0)",
    glow: "translate3d(0, 0, 0)",
  };

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
        <div
          className="rs-mesh-nebula rs-mesh-nebula-a"
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "70%",
            height: "65%",
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)",
            filter: "blur(40px)",
            transform: drift.nebulaNear,
            transition: "transform .42s cubic-bezier(.22,1,.36,1)",
            animation: "nebulaFloat1 22s ease-in-out infinite alternate",
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
              "radial-gradient(ellipse at center, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.03) 45%, transparent 70%)",
            filter: "blur(50px)",
            transform: drift.nebulaFar,
            transition: "transform .5s cubic-bezier(.22,1,.36,1)",
            animation: "nebulaFloat2 28s ease-in-out infinite alternate",
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
              "radial-gradient(ellipse at center, rgba(34,211,238,0.07) 0%, rgba(34,211,238,0.02) 45%, transparent 70%)",
            filter: "blur(35px)",
            transform: drift.nebulaNear,
            transition: "transform .45s cubic-bezier(.22,1,.36,1)",
            animation: "nebulaFloat3 18s ease-in-out infinite alternate",
          }}
        />

        <div
          className="rs-mesh-stars rs-mesh-stars-near"
          style={{
            position: "absolute",
            inset: "-12%",
            backgroundImage: `
              radial-gradient(circle at 8% 15%, rgba(255,255,255,.95) 0 1px, transparent 1.6px),
              radial-gradient(circle at 19% 72%, rgba(200,210,255,.72) 0 1px, transparent 1.7px),
              radial-gradient(circle at 28% 32%, rgba(255,255,255,.85) 0 1.1px, transparent 1.8px),
              radial-gradient(circle at 41% 18%, rgba(200,220,255,.68) 0 .9px, transparent 1.6px),
              radial-gradient(circle at 58% 61%, rgba(255,255,255,.74) 0 1px, transparent 1.6px),
              radial-gradient(circle at 72% 27%, rgba(220,220,255,.88) 0 1.1px, transparent 1.8px),
              radial-gradient(circle at 83% 79%, rgba(255,255,255,.70) 0 1px, transparent 1.7px),
              radial-gradient(circle at 92% 41%, rgba(200,215,255,.82) 0 .9px, transparent 1.5px),
              radial-gradient(circle at 35% 55%, rgba(255,255,255,.60) 0 .8px, transparent 1.4px),
              radial-gradient(circle at 67% 88%, rgba(180,200,255,.55) 0 .8px, transparent 1.4px),
              radial-gradient(circle at 12% 85%, rgba(255,255,255,.65) 0 .9px, transparent 1.5px),
              radial-gradient(circle at 88% 12%, rgba(200,230,255,.70) 0 1px, transparent 1.6px)
            `,
            opacity: 0.78,
            transform: drift.starsNear,
            transition: "transform .55s cubic-bezier(.22,1,.36,1)",
            animation: "starfieldDrift 55s linear infinite",
          }}
        />

        <div
          className="rs-mesh-stars rs-mesh-stars-far"
          style={{
            position: "absolute",
            inset: "-8%",
            backgroundImage: `
              radial-gradient(circle at 14% 48%, rgba(255,255,255,.45) 0 .8px, transparent 1.4px),
              radial-gradient(circle at 34% 84%, rgba(200,210,255,.38) 0 .7px, transparent 1.3px),
              radial-gradient(circle at 49% 23%, rgba(255,255,255,.42) 0 .75px, transparent 1.3px),
              radial-gradient(circle at 66% 88%, rgba(220,220,255,.35) 0 .7px, transparent 1.2px),
              radial-gradient(circle at 79% 13%, rgba(255,255,255,.48) 0 .8px, transparent 1.3px),
              radial-gradient(circle at 91% 57%, rgba(200,215,255,.40) 0 .75px, transparent 1.3px),
              radial-gradient(circle at 23% 62%, rgba(255,255,255,.35) 0 .65px, transparent 1.2px),
              radial-gradient(circle at 55% 39%, rgba(210,220,255,.38) 0 .7px, transparent 1.3px)
            `,
            opacity: 0.55,
            transform: drift.starsFar,
            transition: "transform .65s cubic-bezier(.22,1,.36,1)",
            animation: "starfieldDriftReverse 80s linear infinite",
          }}
        />

        <div
          className="rs-mesh-glow"
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: `translateX(-50%) ${drift.glow}`,
            width: "80%",
            height: "35%",
            background:
              "radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 65%)",
            filter: "blur(10px)",
            transition: "transform .5s cubic-bezier(.22,1,.36,1)",
          }}
        />

        <div
          className="rs-mesh-vignette"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(3,4,8,0.65) 100%)",
            pointerEvents: "none",
          }}
        />

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
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(200,210,255,.22) 20%, rgba(255,255,255,.75) 50%, rgba(200,210,255,.2) 80%, rgba(255,255,255,0) 100%)",
            transform: "rotate(-46deg)",
            transformOrigin: "left center",
            boxShadow: "0 0 8px rgba(200,210,255,.25)",
            animation: "shootingStar1 11s ease-in-out infinite",
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
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(160,180,255,.18) 20%, rgba(255,255,255,.6) 50%, rgba(160,180,255,.16) 80%, rgba(255,255,255,0) 100%)",
            transform: "rotate(-38deg)",
            transformOrigin: "left center",
            animation: "shootingStar2 17s ease-in-out 5s infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes nebulaFloat1 {
          0%  { transform: translate3d(0, 0, 0) scale(1); opacity: 0.85; }
          100%{ transform: translate3d(4%, 3%, 0) scale(1.06); opacity: 1; }
        }
        @keyframes nebulaFloat2 {
          0%  { transform: translate3d(0, 0, 0) scale(1); opacity: 0.7; }
          100%{ transform: translate3d(-5%, -3%, 0) scale(1.1); opacity: 0.95; }
        }
        @keyframes nebulaFloat3 {
          0%  { transform: translate3d(0, 0, 0) scale(1); opacity: 0.6; }
          100%{ transform: translate3d(3%, -4%, 0) scale(1.08); opacity: 0.9; }
        }
        @keyframes starfieldDrift {
          0%   { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(-2.5%,2.5%,0) scale(1.04); }
        }
        @keyframes starfieldDriftReverse {
          0%   { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(2%,-2%,0) scale(1.03); }
        }
        @keyframes shootingStar1 {
          0%,62%,100% { opacity: 0; transform: translate3d(0,0,0) rotate(-46deg); }
          8%           { opacity: 1; }
          30%          { opacity: 0.15; transform: translate3d(16vw,12vh,0) rotate(-46deg); }
          34%          { opacity: 0; }
        }
        @keyframes shootingStar2 {
          0%,70%,100% { opacity: 0; transform: translate3d(0,0,0) rotate(-38deg); }
          10%          { opacity: 0.8; }
          32%          { opacity: 0.1; transform: translate3d(-12vw,9vh,0) rotate(-38deg); }
          36%          { opacity: 0; }
        }
      `}</style>
    </>
  );
}

export default React.memo(MeshBg);
