import React from "react";

const NAV_ITEMS = [
  { id: "gallery", icon: "palette-mark", label: "navGallery" },
  { id: "ai",      icon: "gear-mark",    label: "navAI" },
  { id: "home",    icon: "home-mark",    label: "navHome" },
  { id: "courses", icon: "book-mark",    label: "navCourses" },
  { id: "pricing", icon: "price-mark",   label: "navPricing" },
];

function PaletteMark({ active, th }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nav-pal-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={active ? th.hi : "rgba(148,163,184,.5)"} />
          <stop offset="100%" stopColor={active ? th.accentB : "rgba(100,116,139,.4)"} />
        </linearGradient>
      </defs>
      <path
        d="M12.1 4.6c-4.6 0-8 3.2-8 7.3 0 3.5 2.7 6.3 6.2 6.3h1.7c.8 0 1.4-.6 1.4-1.4 0-.7-.4-1.2-.4-1.8 0-.8.7-1.4 1.5-1.4h1c2.7 0 4.5-1.8 4.5-4.2 0-2.8-2.6-4.8-7.9-4.8Z"
        fill={active ? th.tag : "rgba(255,255,255,.02)"}
        stroke="url(#nav-pal-g)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="8"    cy="10"   r="1.1"  fill="none" stroke="url(#nav-pal-g)" strokeWidth="1.4" />
      <circle cx="11.2" cy="8.2"  r="1.05" fill="none" stroke="url(#nav-pal-g)" strokeWidth="1.35" />
      <circle cx="14.8" cy="8.6"  r="1.05" fill="none" stroke="url(#nav-pal-g)" strokeWidth="1.35" />
      <circle cx="16.4" cy="12.2" r="1.05" fill="none" stroke="url(#nav-pal-g)" strokeWidth="1.35" />
      <circle cx="13.3" cy="14.6" r="1"    fill="none" stroke="url(#nav-pal-g)" strokeWidth="1.3" />
    </svg>
  );
}

function HomeMark({ active, th }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nav-home-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={active ? th.hi : "rgba(148,163,184,.5)"} />
          <stop offset="100%" stopColor={active ? th.accentB : "rgba(100,116,139,.4)"} />
        </linearGradient>
      </defs>
      <path
        d="M4.4 11.2 12 4.9l7.6 6.3"
        fill="none" stroke="url(#nav-home-g)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M6.8 10.9v7.2c0 .7.5 1.2 1.2 1.2h2.7v-4.4c0-.6.5-1.1 1.1-1.1h.6c.6 0 1.1.5 1.1 1.1v4.4h2.7c.7 0 1.2-.5 1.2-1.2v-7.2"
        fill={active ? th.tag : "rgba(255,255,255,.02)"}
        stroke="url(#nav-home-g)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function BookMark({ active, th }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nav-book-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={active ? th.hi : "rgba(148,163,184,.5)"} />
          <stop offset="100%" stopColor={active ? th.accentB : "rgba(100,116,139,.4)"} />
        </linearGradient>
      </defs>
      <path
        d="M7.2 6.1h8.6c1.2 0 2.1.9 2.1 2v8.5c0 .8-.6 1.4-1.4 1.4H8.6c-1.3 0-2.4-.8-2.4-2.1V8.3c0-1.3.9-2.2 2-2.2Z"
        fill={active ? th.tag : "rgba(255,255,255,.02)"}
        stroke="url(#nav-book-g)" strokeWidth="1.7" strokeLinejoin="round"
      />
      <path d="M7 8.2c.3-.7 1-.9 1.8-.9h7.7" fill="none" stroke="url(#nav-book-g)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.8 10.3h6.7M8.8 12.6h6.7M8.8 14.9h5.6" fill="none" stroke="url(#nav-book-g)" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
      <path d="M6.2 8.1v7.8c0 1 1 2.1 2.4 2.1" fill="none" stroke="url(#nav-book-g)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ProfileMark({ active, th }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nav-profile-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={active ? th.hi : "rgba(148,163,184,.5)"} />
          <stop offset="100%" stopColor={active ? th.accentB : "rgba(100,116,139,.4)"} />
        </linearGradient>
      </defs>
      <circle
        cx="12" cy="9" r="3.8"
        fill={active ? th.tag : "rgba(255,255,255,.02)"}
        stroke="url(#nav-profile-g)" strokeWidth="1.6"
      />
      <path
        d="M5.8 20.4c0-3.4 2.8-6.2 6.2-6.2s6.2 2.8 6.2 6.2"
        fill={active ? th.tag : "rgba(255,255,255,.02)"}
        stroke="url(#nav-profile-g)" strokeWidth="1.6" strokeLinecap="round"
      />
    </svg>
  );
}

function GearMark({ active, th }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nav-gear-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={active ? th.hi : "rgba(148,163,184,.5)"} />
          <stop offset="100%" stopColor={active ? th.accentB : "rgba(100,116,139,.4)"} />
        </linearGradient>
      </defs>
      <path
        d="M11 4.8h2l.5 1.7c.5.1.9.3 1.3.5l1.5-.9 1.4 1.4-.9 1.5c.2.4.4.9.5 1.3l1.7.5v2l-1.7.5c-.1.5-.3.9-.5 1.3l.9 1.5-1.4 1.4-1.5-.9c-.4.2-.8.4-1.3.5L13 19.2h-2l-.5-1.7c-.5-.1-.9-.3-1.3-.5l-1.5.9-1.4-1.4.9-1.5a5.4 5.4 0 0 1-.5-1.3l-1.7-.5v-2l1.7-.5c.1-.5.3-.9.5-1.3l-.9-1.5 1.4-1.4 1.5.9c.4-.2.8-.4 1.3-.5L11 4.8Z"
        fill={active ? th.tag : "rgba(255,255,255,.02)"}
        stroke="url(#nav-gear-g)" strokeWidth="1.6" strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.25" fill={active ? th.tag : "rgba(255,255,255,.01)"} stroke="url(#nav-gear-g)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.55" fill="none" stroke="url(#nav-gear-g)" strokeWidth="1.35" opacity="0.9" />
    </svg>
  );
}

function PriceMark({ active, th }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="nav-price-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={active ? th.hi : "rgba(148,163,184,.5)"} />
          <stop offset="100%" stopColor={active ? (th.accentC || th.accentB) : "rgba(100,116,139,.4)"} />
        </linearGradient>
      </defs>
      <path
        d="M9.2 6.7c.5-.7 1.4-1.1 2.8-1.1s2.3.4 2.8 1.1c.2.4.2.8.1 1.2-.1.4-.4.8-.8 1H10c-.4-.2-.7-.6-.8-1-.1-.4-.1-.8 0-1.2Z"
        fill={active ? th.tag : "rgba(255,255,255,.02)"}
        stroke="url(#nav-price-g)" strokeWidth="1.55" strokeLinejoin="round"
      />
      <path
        d="M12 9.2c4 0 6.3 2.1 6.3 5.2 0 2.8-2.5 4.8-6.3 4.8s-6.3-2-6.3-4.8c0-3.1 2.3-5.2 6.3-5.2Z"
        fill={active ? th.tag : "rgba(255,255,255,.02)"}
        stroke="url(#nav-price-g)" strokeWidth="1.6"
      />
      <path d="M12 11v5.6" fill="none" stroke="url(#nav-price-g)" strokeWidth="1.35" strokeLinecap="round" />
      <path
        d="M13.8 11.5c-.4-.4-1-.7-1.8-.7-1.2 0-1.9.6-1.9 1.4 0 .8.6 1.2 1.7 1.4 1.2.3 1.8.6 1.8 1.4 0 .9-.8 1.5-2 1.5-.8 0-1.5-.3-2-.8"
        fill="none" stroke="url(#nav-price-g)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M9.4 8.7h5.2" fill="none" stroke="url(#nav-price-g)" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function BottomNav({ active, onChange, th, t, cartCount, ordersCount = 0, walletBalance = 0, sfx }) {
  const handleTabClick = (id) => {
    sfx.tab?.();
    onChange(id);
  };

  return (
    <>
      <style>{`
        @keyframes navArcIn {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes navIconPop {
          0%   { transform: scale(0.75); }
          55%  { transform: scale(1.22); }
          80%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes navGlowPulse {
          0%,100% { opacity: 0.55; }
          50%      { opacity: 0.9; }
        }

        

        
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.35); }
        }

        
        
        @keyframes iconBounce {
          
          0%, 30% { transform: translateY(0) scale(1) rotate(0deg); }
          
          38% { transform: translateY(1px) scale(0.93) rotate(0deg); }
          
          50% { transform: translateY(-6px) scale(1.28) rotate(3deg); }
          
          62% { transform: translateY(1px) scale(1.05) rotate(-1deg); }
          
          75% { transform: translateY(-2px) scale(1.03) rotate(0deg); }
          
          88% { transform: translateY(0) scale(1) rotate(0deg); }
          
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }

        
        
        @keyframes iconSpin {
          
          0%, 55% { transform: scale(1) rotate(0deg); }
          
          62% { transform: scale(1.08) rotate(-3deg); }
          
          68% { transform: scale(1.28) rotate(35deg); }
          
          76% { transform: scale(1.12) rotate(28deg); }
          
          86% { transform: scale(1.02) rotate(2deg); }
          
          100% { transform: scale(1) rotate(0deg); }
        }

        
        
        @keyframes iconCoinPulse {
          
          0%, 55% { transform: scale(1) translateY(0); opacity: .94; }
          
          62% { transform: scale(1.05) translateY(-2px); opacity: .98; }
          
          70% { transform: scale(1.28) translateY(-3px); opacity: 1; }
          
          78% { transform: scale(1.1) translateY(1px); opacity: .98; }
          
          88% { transform: scale(1.01) translateY(0); opacity: .95; }
          
          100% { transform: scale(1) translateY(0); opacity: .94; }
        }

        
        @keyframes iconFlip {
          0%, 100% { transform: perspective(200px) rotateY(0deg) scale(1); }
          20%      { transform: perspective(200px) rotateY(30deg) scale(1.2); }
          50%      { transform: perspective(200px) rotateY(0deg) scale(1); }
          80%      { transform: perspective(200px) rotateY(-30deg) scale(1.2); }
        }

        
        
        @keyframes iconBookLayers {
          0%, 40%  { transform: translateY(0) scale(1); }
          48%      { transform: translateY(1px) scale(0.96); }
          58%      { transform: translateY(-5px) scale(1.26); }
          70%      { transform: translateY(-2px) scale(1.12); }
          82%      { transform: translateY(1px) scale(1.02); }
          100%     { transform: translateY(0) scale(1); }
        }

        
        
        @keyframes iconPaletteTilt {
          
          0%, 25% { transform: translateY(0) scale(1) rotate(0deg); }
          
          33% { transform: translateY(2px) scale(0.94) rotate(-2deg); }
          
          45% { transform: translateY(-5px) scale(1.15) rotate(4deg); }
          
          55% { transform: translateY(-4px) scale(1.3) rotate(-5deg); }
          
          68% { transform: translateY(0) scale(1.05) rotate(2deg); }
          
          82% { transform: translateY(0) scale(1) rotate(-1deg); }
          
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }

        
        
        @keyframes iconProfilePresence {
          
          0%, 45% { transform: perspective(200px) scale(1) translateY(0) rotateY(0deg); }
          
          52% { transform: perspective(200px) scale(0.94) translateY(1px) rotateY(0deg); }
          
          62% { transform: perspective(200px) scale(1.28) translateY(-2px) rotateY(8deg); }
          
          70% { transform: perspective(200px) scale(1.3) translateY(-1px) rotateY(-12deg); }
          
          82% { transform: perspective(200px) scale(1.02) translateY(0) rotateY(2deg); }
          
          100% { transform: perspective(200px) scale(1) translateY(0) rotateY(0deg); }
        }
      `}</style>
      <nav
        className="rs-bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          width: "calc(var(--tg-shell-width, 480px) + (var(--tg-side-gap, 10px) - var(--tg-bar-gap, 6px)) * 2)",
          maxWidth: "calc(var(--tg-shell-width, 480px) + (var(--tg-side-gap, 10px) - var(--tg-bar-gap, 6px)) * 2)",
          transform: "translateX(-50%) scale(var(--tg-shell-scale, 1))",
          transformOrigin: "bottom center",
          zIndex: 200,
          background: `linear-gradient(180deg, ${th.nav} 0%, ${th.surface} 100%)`,
          border: `1px solid ${th.border}`,
          borderBottom: "none",
          borderRadius: "32px 32px 0 0",
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          padding: "10px 6px calc(12px + env(safe-area-inset-bottom,0px))",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: `0 -2px 0 ${th.border}, 0 -24px 48px rgba(3,4,8,0.6), inset 0 2px 0 rgba(255,255,255,.06)`,
          overflow: "visible",
          boxSizing: "border-box",
        }}
      >
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 1,
          background: th.id === "graphite"
            ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.42) 40%, rgba(212,212,216,0.30) 55%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 30%, rgba(139,92,246,0.4) 50%, rgba(34,211,238,0.3) 70%, transparent 100%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: th.id === "graphite"
            ? "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)"
            : "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {NAV_ITEMS.map((n) => {
          const isActive = active === n.id;
          const isHome = n.id === "home";

          return (
            <button
              key={n.id}
              onClick={() => handleTabClick(n.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: isHome ? 2 : 3,
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: isHome ? "6px 0 4px" : "8px 0 4px",
                position: "relative",
                zIndex: 1,
                minWidth: 0,
                minHeight: isHome ? 62 : 58,
                contain: "layout style",
                transform: "translateZ(0)",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {isHome && (
                <div style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: isActive
                    ? (th.id === "graphite"
                      ? "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(161,161,170,0.10) 100%)"
                      : "linear-gradient(145deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 100%)")
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? th.border : "rgba(255,255,255,0.05)"}`,
                  backdropFilter: "blur(8px)",
                  boxShadow: isActive
                    ? (th.id === "graphite"
                      ? "0 4px 24px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.10)"
                      : "0 4px 24px rgba(99,102,241,0.30), inset 0 1px 0 rgba(255,255,255,0.08)")
                    : "none",
                  transition: "all .35s ease",
                  zIndex: -1,
                }} />
              )}
              {isActive && !isHome && (
                <div style={{
                  position: "absolute",
                  inset: "2px 6px",
                  borderRadius: 18,
                  background: th.id === "graphite"
                    ? "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)"
                    : "linear-gradient(180deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 100%)",
                  border: `1px solid ${th.border}`,
                  animation: "navArcIn .28s ease both",
                }} />
              )}
              <span className="rs-nav-icon-wrap" style={{
                display: "flex",
                width: isHome ? 30 : 26,
                height: isHome ? 30 : 26,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                lineHeight: 0,
                marginTop: isHome ? -10 : 0,
                transform: isActive
                  ? isHome ? "translateY(-3px) scale(1.05)" : "scale(1.05)"
                  : "scale(1)",
                animation: isActive ? "navIconPop .4s cubic-bezier(.18,.89,.32,1.28) both" : "none",
                filter: isActive
                  ? n.id === "pricing"
                    ? `drop-shadow(0 0 10px ${th.accentC || th.accentB})`
                    : `drop-shadow(0 0 12px ${th.glow})`
                  : "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                backfaceVisibility: "hidden",
                contain: "layout paint style",
                transition: "filter .35s ease, transform .35s cubic-bezier(.34,1.56,.64,1)",
                willChange: isActive ? "transform" : "auto",
              }}>
                <span className="rs-nav-icon-cycle" style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 0,
                  animation: (() => {
                      if (n.id === "home") return "iconBounce 3.5s ease-in-out infinite";
                      if (n.id === "ai") return "iconSpin 3.5s linear infinite";
                      if (n.id === "pricing") return "iconCoinPulse 3.5s ease-in-out infinite";
                      if (n.id === "courses") return "iconBookLayers 3.5s ease-in-out infinite";
                      return "iconPulse 3.5s ease-in-out infinite";
                    })(),
                  backfaceVisibility: "hidden",
                  contain: "layout paint style",
                  transformOrigin: "center center",
                  willChange: "transform",
                }}>
                  {n.id === "gallery" ? <PaletteMark  active={isActive} th={th} /> :
                   n.id === "ai"      ? <GearMark    active={isActive} th={th} /> :
                   n.id === "home"    ? <HomeMark    active={isActive} th={th} /> :
                   n.id === "courses" ? <BookMark    active={isActive} th={th} /> :
                                         <PriceMark  active={isActive} th={th} />}
                </span>
              </span>
              <span style={{
                fontSize: isHome ? 9 : 8.5,
                fontWeight: 700,
                fontFamily: "var(--font-micro)",
                letterSpacing: ".10em",
                textTransform: "uppercase",
                color: isActive
                  ? n.id === "pricing" ? (th.accentC || th.accentB) : th.text
                  : "rgba(100,116,139,0.7)",
                transition: "color .3s ease",
                marginTop: isHome ? 6 : 0,
              }}>
                {t[n.label] || n.label}
              </span>
              {n.id === "courses" && ordersCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: 0,
                  right: "12%",
                  minWidth: 17,
                  height: 17,
                  borderRadius: 999,
                  background: th.grad,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 3px",
                  boxShadow: `0 2px 8px ${th.glow}`,
                  animation: "ping .5s ease",
                }}>
                  {ordersCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default React.memo(BottomNav);

