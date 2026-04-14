import React from "react";

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ariaHidden: true,
};

function Svg(props) {
  const { size = 18, children, style, className } = props;
  return (
    <svg
      viewBox={base.viewBox}
      width={size}
      height={size}
      fill={base.fill}
      stroke={base.stroke}
      strokeWidth={base.strokeWidth}
      strokeLinecap={base.strokeLinecap}
      strokeLinejoin={base.strokeLinejoin}
      aria-hidden="true"
      className={className}
      style={{ display: "block", ...style }}
    >
      {children}
    </svg>
  );
}

function iconFor(name) {
  const aliases = {
    "◎": "about",
    "✦": "visual",
    "◈": "custom",
    "▣": "template",
    "▤": "banner",
    "◉": "promo",
    "◐": "custom",
    "⌕": "search",
    "✈": "telegram",
    "♡": "heart",
    "♥": "heart-filled",
    "❤": "heart-filled",
    "👁": "eye",
    "★": "star",
    "📅": "calendar",
    "🔥": "fire",
    "🎯": "target",
    "🧠": "brain",
    "🌐": "globe",
    "🔒": "lock",
    "🎁": "gift",
    "🏆": "trophy",
    "✓": "check",
    "✕": "close",
    "⚠": "warning",
    "💫": "xp",
    "📤": "telegram",
    "💾": "template",
    "🗑": "close",
    "💳": "wallet",
    "📦": "gift",
    "🎨": "palette",
    "📚": "template",
    "Aa": "xp",
    "▩": "texture",
    "✏": "brush",
    "◫": "mockup",
    "▶": "play",
    "💡": "idea",
    "👥": "users",
    "👋": "hand",
    "🛒": "cart",
    "🌙": "moon",
    "☀️": "sun",
    "🌅": "sunrise",
    "🌆": "sunset",
    "🎉": "party",
    "🎓": "cap",
    "←": "arrow-left",
    "→": "arrow-right",
  };
  const normalized = aliases[name] || name;
  switch (normalized) {
    case "about":
      return <><circle cx="12" cy="12" r="8" /><path d="M12 10.2v5.1" /><circle cx="12" cy="7.3" r=".9" fill="currentColor" stroke="none" /></>;
    case "reviews":
      return <><path d="M7.5 18.2 3.8 20l.8-4A7.8 7.8 0 1 1 20 12.8" /><path d="M9 10.7h6" /><path d="M9 13.6h4.5" /></>;
    case "faq":
      return <><path d="M9.3 9a3 3 0 1 1 5.2 2c-.9 1-1.7 1.5-1.7 2.7" /><circle cx="12" cy="17.2" r=".8" fill="currentColor" stroke="none" /></>;
    case "tools":
      return <><circle cx="12" cy="12" r="3.1" /><path d="M19 12h2" /><path d="M3 12h2" /><path d="M12 3v2" /><path d="M12 19v2" /><path d="m17.2 6.8 1.4-1.4" /><path d="m5.4 18.6 1.4-1.4" /><path d="m17.2 17.2 1.4 1.4" /><path d="m5.4 5.4 1.4 1.4" /></>;
    case "avatar":
      return <><circle cx="12" cy="9" r="2.8" /><path d="M6.8 18c1.3-2.7 9.1-2.7 10.4 0" /></>;
    case "preview":
      return <><rect x="4" y="5.5" width="16" height="13" rx="2.5" /><path d="M7.5 14.2 10 11.5l2.4 2.4 1.8-1.8 2.3 2.1" /><circle cx="15.8" cy="9.2" r="1.2" /></>;
    case "banner":
      return <><rect x="3.5" y="7" width="17" height="10" rx="2.2" /><path d="M7 10h10" /><path d="M7 13h6.5" /></>;
    case "visual":
      return <><path d="M6 7.5h5.5V13H6z" /><path d="M12.5 7.5H18V11h-5.5z" /><path d="M12.5 12.2H18V16.5h-5.5z" /><path d="M6 14.2h5.5v2.3H6z" /></>;
    case "promo":
      return <><path d="M6.4 14.7 17.8 9.6" /><path d="M6.2 10.1 17.8 5.6" /><path d="M7.2 18.4c.7-1.6 1.2-3 1.2-4.7" /><path d="M18.2 5.6c1 .7 1.8 1.7 1.8 2.9 0 2.2-2.5 4.1-6.2 4.9" /></>;
    case "custom":
      return <><path d="M12 4.8 8.3 8.5 12 12.2l3.7-3.7L12 4.8Z" /><path d="M12 12.2 8.3 15.9 12 19.6l3.7-3.7L12 12.2Z" /></>;
    case "telegram":
      return <><path d="m20 5-2.4 13.4c-.2 1-1 1.3-1.8.9l-3.7-2.8-1.8 1.7c-.2.2-.4.4-.9.4l.3-3.9 7.2-6.5c.3-.3-.1-.5-.4-.3l-8.9 5.6-3.8-1.2c-.9-.3-.9-.9.2-1.3L18.7 5c.8-.3 1.5.2 1.3 1Z" /></>;
    case "wallet":
      return <><rect x="3.5" y="6.5" width="17" height="11" rx="2.5" /><path d="M16 11.2h4.5v2.6H16a1.3 1.3 0 1 1 0-2.6Z" /><circle cx="16.8" cy="12.5" r=".6" fill="currentColor" stroke="none" /></>;
    case "cart":
      return <><circle cx="9" cy="18.2" r="1.2" /><circle cx="17" cy="18.2" r="1.2" /><path d="M4.5 5.8h1.8l1.7 8.2h9.2l2-6.2H7.4" /></>;
    case "search":
      return <><circle cx="11" cy="11" r="5.8" /><path d="m19 19-3.2-3.2" /></>;
    case "heart":
      return <path d="m12 19-1.4-1.2C6 13.9 4 12 4 9.5A3.5 3.5 0 0 1 7.5 6c1.4 0 2.8.7 3.5 1.9A4.1 4.1 0 0 1 14.5 6 3.5 3.5 0 0 1 18 9.5c0 2.5-2 4.4-6.6 8.3L12 19Z" />;
    case "heart-filled":
      return <path d="m12 19-1.4-1.2C6 13.9 4 12 4 9.5A3.5 3.5 0 0 1 7.5 6c1.4 0 2.8.7 3.5 1.9A4.1 4.1 0 0 1 14.5 6 3.5 3.5 0 0 1 18 9.5c0 2.5-2 4.4-6.6 8.3L12 19Z" fill="currentColor" stroke="none" />;
    case "eye":
      return <><path d="M2.8 12s3.2-5.2 9.2-5.2 9.2 5.2 9.2 5.2-3.2 5.2-9.2 5.2S2.8 12 2.8 12Z" /><circle cx="12" cy="12" r="2.4" /></>;
    case "top":
      return <><path d="m12 3.8 2.1 4.2 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7L5.2 8.7l4.7-.7L12 3.8Z" /></>;
    case "calendar":
      return <><rect x="4.2" y="5.6" width="15.6" height="14" rx="2.5" /><path d="M8 3.8v3.1" /><path d="M16 3.8v3.1" /><path d="M4.2 9.4h15.6" /></>;
    case "fire":
      return <><path d="M12.4 3.9c.9 2-.2 3.4-1.4 4.7-1.1 1.3-2.1 2.3-2.1 4.1A3.9 3.9 0 0 0 13 16.6c2.2 0 3.8-1.7 3.8-4.2 0-2.3-1.4-4.1-4.4-8.5Z" /><path d="M11.1 13.8c0-1 .6-1.7 1.5-2.5.7.8 1 1.4 1 2.2a1.8 1.8 0 1 1-3.6.3Z" /></>;
    case "star":
      return <path d="m12 4.2 2.1 4.3 4.8.7-3.5 3.3.9 4.7-4.3-2.2-4.3 2.2.9-4.7-3.5-3.3 4.8-.7L12 4.2Z" />;
    case "xp":
      return <><path d="m7 7 10 10" /><path d="m17 7-10 10" /><circle cx="12" cy="12" r="8.2" /></>;
    case "target":
      return <><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></>;
    case "brain":
      return <><path d="M9 7.2a2.6 2.6 0 1 1 4.6-1.7 2.8 2.8 0 0 1 4 2.5c1.4.5 2.4 1.8 2.4 3.4 0 1.7-1.1 3.1-2.7 3.5a2.8 2.8 0 0 1-2.8 2.5H9.6a3 3 0 0 1-2.9-2.4A3.7 3.7 0 0 1 4 11.4c0-1.6 1-2.9 2.4-3.4A2.8 2.8 0 0 1 9 7.2Z" /><path d="M9.3 8.6c1 .5 1.5 1.4 1.5 2.6v5" /><path d="M14.2 7.8c-1 .5-1.5 1.4-1.5 2.6v5" /></>;
    case "globe":
      return <><circle cx="12" cy="12" r="8" /><path d="M4.6 12h14.8" /><path d="M12 4a12.5 12.5 0 0 1 0 16" /><path d="M12 4a12.5 12.5 0 0 0 0 16" /></>;
    case "lock":
      return <><rect x="5.5" y="11" width="13" height="9" rx="2.2" /><path d="M8 11V8.7A4 4 0 0 1 12 4.8a4 4 0 0 1 4 3.9V11" /></>;
    case "gift":
      return <><rect x="4.2" y="10" width="15.6" height="9.3" rx="2" /><path d="M12 10v9.3" /><path d="M4.2 10h15.6" /><path d="M12 10H8.4a2 2 0 1 1 0-4c1.6 0 2.5 1.2 3.6 4Z" /><path d="M12 10h3.6a2 2 0 1 0 0-4C14 6 13.1 7.2 12 10Z" /></>;
    case "trophy":
      return <><path d="M8 5.5h8v2.4A4 4 0 0 1 12 12a4 4 0 0 1-4-4.1V5.5Z" /><path d="M8 7H5.6A2.1 2.1 0 0 0 7.7 9.8H8" /><path d="M16 7h2.4a2.1 2.1 0 0 1-2.1 2.8H16" /><path d="M12 12v3.2" /><path d="M9.2 20h5.6" /><path d="M10 15.2h4" /></>;
    case "plus":
      return <><path d="M12 5v14" /><path d="M5 12h14" /></>;
    case "minus":
      return <path d="M5 12h14" />;
    case "close":
      return <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>;
    case "check":
      return <path d="m5.5 12.5 4 4 9-9" />;
    case "warning":
      return <><path d="M12 5 4.5 18h15L12 5Z" /><path d="M12 9.2v4.6" /><circle cx="12" cy="16.2" r=".9" fill="currentColor" stroke="none" /></>;
    case "info":
      return <><circle cx="12" cy="12" r="8" /><path d="M12 11.2v4.2" /><circle cx="12" cy="8" r=".9" fill="currentColor" stroke="none" /></>;
    case "palette":
      return <><path d="M12.1 4.8c-4.4 0-7.6 3-7.6 6.9 0 3.3 2.5 5.9 5.9 5.9H12c.7 0 1.2-.5 1.2-1.2 0-.6-.3-1-.3-1.5 0-.7.6-1.2 1.3-1.2h.9c2.6 0 4.2-1.7 4.2-3.9 0-2.6-2.4-4.6-7.2-4.6Z" /><circle cx="8.2" cy="10.2" r=".9" /><circle cx="11.4" cy="8.5" r=".8" /><circle cx="14.8" cy="8.8" r=".8" /><circle cx="16.1" cy="12" r=".8" /></>;
    case "brush":
      return <><path d="M14.2 4.8 19 9.6" /><path d="M12.8 6.2 7 12a3.2 3.2 0 0 0-1 2.3c0 1.8-1.2 3.1-3 3.1 1.1-.9 1.1-2.1 1.1-2.7a3 3 0 0 1 .9-2.1l6-6.4a2 2 0 0 1 2.8-.1Z" /></>;
    case "texture":
      return <><path d="M5.5 7.2h13" /><path d="M5.5 12h13" /><path d="M5.5 16.8h13" /><path d="M7.5 5.2v13.6" /><path d="M12 5.2v13.6" /><path d="M16.5 5.2v13.6" /></>;
    case "template":
      return <><rect x="4.5" y="5.2" width="15" height="13.6" rx="2.2" /><path d="M9.5 5.2v13.6" /><path d="M9.5 10h10" /></>;
    case "mockup":
      return <><rect x="5.2" y="4.8" width="13.6" height="14.4" rx="2.2" /><path d="M9 19.2h6" /><circle cx="12" cy="16.4" r=".6" fill="currentColor" stroke="none" /></>;
    case "graphics":
      return <><path d="M6 17.5 10.2 7l3.6 6 2-3.3L18 17.5" /><path d="M6 17.5h12" /><circle cx="9" cy="8" r="1.1" /></>;
    case "play":
      return <path d="m9 7.8 7.2 4.2L9 16.2V7.8Z" fill="currentColor" stroke="none" />;
    case "pause":
      return <><rect x="8" y="7" width="2.6" height="10" rx="1" fill="currentColor" stroke="none" /><rect x="13.4" y="7" width="2.6" height="10" rx="1" fill="currentColor" stroke="none" /></>;
    case "users":
      return <><circle cx="9" cy="9.2" r="2.3" /><circle cx="15.6" cy="10.2" r="1.8" /><path d="M5.8 17.6c.9-2.1 6.3-2.1 7.2 0" /><path d="M13.7 17.3c.5-1.5 4-1.8 5.3-.5" /></>;
    case "clock":
      return <><circle cx="12" cy="12" r="8" /><path d="M12 7.8v4.6l3 1.8" /></>;
    case "idea":
      return <><path d="M9.3 17.3h5.4" /><path d="M10.1 20h3.8" /><path d="M8.4 14.8c-1.1-.9-1.9-2.3-1.9-3.9a5.5 5.5 0 1 1 11 0c0 1.6-.7 3-1.9 3.9-.7.6-1.1 1.2-1.3 1.9h-4.6c-.2-.7-.6-1.3-1.3-1.9Z" /></>;
    case "spark":
      return <><path d="m12 4 1.3 3.7L17 9l-3.7 1.3L12 14l-1.3-3.7L7 9l3.7-1.3L12 4Z" /><path d="m18.5 15.5.7 2 .8-2 .8-.7-2-.8-.7-2-.8 2-.8.8 2 .7Z" /><path d="m5 15 .8 2.2.9-2.2 2.2-.8-2.2-.9L5 11l-.8 2.3-2.2.9 2.2.8Z" /></>;
    case "moon":
      return <path d="M15.8 4.8A7.6 7.6 0 1 0 19.2 18 8.3 8.3 0 0 1 15.8 4.8Z" />;
    case "sun":
      return <><circle cx="12" cy="12" r="3.2" /><path d="M12 3.5v2.2" /><path d="M12 18.3v2.2" /><path d="m5.9 5.9 1.5 1.5" /><path d="m16.6 16.6 1.5 1.5" /><path d="M3.5 12h2.2" /><path d="M18.3 12h2.2" /><path d="m5.9 18.1 1.5-1.5" /><path d="m16.6 7.4 1.5-1.5" /></>;
    case "sunrise":
      return <><path d="M5 16.5h14" /><path d="M7.2 16.5a4.8 4.8 0 0 1 9.6 0" /><path d="M12 6v3.2" /><path d="m8.7 9 1.4 1.4" /><path d="m15.3 9-1.4 1.4" /></>;
    case "sunset":
      return <><path d="M5 16.5h14" /><path d="M7.2 16.5a4.8 4.8 0 0 1 9.6 0" /><path d="M12 6v3.2" /><path d="m8.7 9 1.4 1.4" /><path d="m15.3 9-1.4 1.4" /><path d="M6 20h12" /></>;
    case "party":
      return <><path d="m8.5 7.5 8 8" /><path d="m13 6 5 5-4 1-2 4-5-5 1-5 5-1Z" /><path d="M6 5.5h.01" /><path d="M4.8 9.2h.01" /><path d="M18.6 5.4h.01" /></>;
    case "cap":
      return <><path d="m3.8 10.1 8.2-4.1 8.2 4.1-8.2 4.1-8.2-4.1Z" /><path d="M7.4 12.1v3.1c2.6 1.9 6.6 1.9 9.2 0v-3.1" /></>;
    case "arrow-left":
      return <><path d="m14.8 6.5-5.6 5.5 5.6 5.5" /><path d="M18.8 12H9.5" /></>;
    case "arrow-right":
      return <><path d="m9.2 6.5 5.6 5.5-5.6 5.5" /><path d="M5.2 12h9.3" /></>;
    case "medal":
      return <><circle cx="12" cy="14" r="4.2" /><path d="M9.4 4.5h5.2l-.6 5.1h-4Z" /><path d="m12 12.1 1 1.8 2 .3-1.4 1.3.3 2-1.9-1-1.9 1 .3-2-1.4-1.3 2-.3 1-1.8Z" /></>;
    case "hand":
      return <><path d="M8.5 12V7.3a1.2 1.2 0 1 1 2.4 0V11" /><path d="M10.9 11V6.4a1.2 1.2 0 1 1 2.4 0V11" /><path d="M13.3 11V7.4a1.2 1.2 0 1 1 2.4 0V12" /><path d="M8.5 11.2 7 10.1a1.4 1.4 0 0 0-1.8 2.1l2.6 2.6c1.2 1.2 1.8 2.8 4.2 2.8h1.4c2.4 0 4-1.9 4-4.2V12" /></>;
    default:
      return <circle cx="12" cy="12" r="7" />;
  }
}

export default function SystemIcon({ name = "star", size = 18, color = "currentColor", animated = true, tone = "soft", style, className }) {
  const motionProfile = (() => {
    if (!animated) return "";
    if (["tools", "globe"].includes(name)) return "spin";
    if (["spark", "party", "star", "top"].includes(name)) return "twinkle";
    if (["heart", "heart-filled"].includes(name)) return "beat";
    if (["telegram", "arrow-right", "play"].includes(name)) return "glide";
    if (["brain", "idea", "fire"].includes(name)) return "pulse";
    return "float";
  })();

  return (
    <>
      <style>{`
        @keyframes rsIconFloat {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          25% { transform: translate3d(0, -1px, 0) scale(1.02); }
          50% { transform: translate3d(0, -2.5px, 0) scale(1.03); }
          75% { transform: translate3d(0, -1px, 0) scale(1.015); }
        }
        @keyframes rsIconPulse {
          0%, 100% { opacity: .88; filter: saturate(1); }
          50% { opacity: 1; filter: saturate(1.12); }
        }
        @keyframes rsIconSpinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rsIconTwinkle {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: .9; }
          20% { transform: translate3d(0, -1px, 0) rotate(-4deg) scale(1.04); opacity: 1; }
          45% { transform: translate3d(0, -2px, 0) rotate(4deg) scale(1.08); opacity: .96; }
          70% { transform: translate3d(0, -1px, 0) rotate(-2deg) scale(1.03); opacity: 1; }
        }
        @keyframes rsIconBeat {
          0%, 100% { transform: scale(1); }
          18% { transform: scale(1.08); }
          32% { transform: scale(.98); }
          50% { transform: scale(1.12); }
          68% { transform: scale(1); }
        }
        @keyframes rsIconGlide {
          0%, 100% { transform: translate3d(0, 0, 0); }
          30% { transform: translate3d(1.5px, -1px, 0); }
          60% { transform: translate3d(2.5px, 0, 0); }
        }
        .rs-icon-wrap {
          transition: transform .22s ease, opacity .22s ease, filter .22s ease;
          transform-origin: 50% 50%;
          will-change: transform, opacity, filter;
        }
        .rs-icon-svg {
          transition: transform .22s ease, opacity .22s ease, filter .22s ease;
          transform-origin: 50% 50%;
          will-change: transform, opacity, filter;
        }
        .rs-icon-wrap--float { animation: rsIconFloat 3.6s cubic-bezier(.37,0,.22,1) infinite, rsIconPulse 3.6s ease-in-out infinite; }
        .rs-icon-wrap--twinkle { animation: rsIconTwinkle 3.4s cubic-bezier(.37,0,.22,1) infinite; }
        .rs-icon-wrap--beat { animation: rsIconBeat 3.1s ease-in-out infinite; }
        .rs-icon-wrap--glide { animation: rsIconGlide 3.2s cubic-bezier(.37,0,.22,1) infinite, rsIconPulse 3.2s ease-in-out infinite; }
        .rs-icon-wrap--pulse { animation: rsIconFloat 3s ease-in-out infinite, rsIconPulse 2.2s ease-in-out infinite; }
        .rs-icon-svg--spin { animation: rsIconSpinSlow 9s linear infinite; }
      `}</style>
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          filter: tone === "glow" ? `drop-shadow(0 0 10px ${color}33)` : "none",
          ...style,
        }}
      >
        <span className={`rs-icon-wrap ${motionProfile ? `rs-icon-wrap--${motionProfile}` : ""}`}>
        <Svg
          size={size}
          className={`rs-icon-svg ${(name === "tools" || name === "globe") && animated ? "rs-icon-svg--spin" : ""}`}
        >
          {iconFor(name)}
        </Svg>
        </span>
      </span>
    </>
  );
}
