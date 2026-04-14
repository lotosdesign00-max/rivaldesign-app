import React, { useState, useEffect, useCallback } from "react";
import SystemIcon from "./SystemIcon";

const FORMAT_COLORS = {
  otf: "#f59e0b", ttf: "#f59e0b", woff: "#f59e0b", woff2: "#f59e0b",
  png: "#10b981", jpg: "#10b981", jpeg: "#10b981", webp: "#10b981",
  psd: "#3b82f6", psb: "#3b82f6",
  ai: "#f97316", eps: "#f97316",
  zip: "#8b5cf6", rar: "#8b5cf6",
  mp4: "#ef4444", mov: "#ef4444",
  pdf: "#dc2626",
};

function getExt(name = "") {
  return (name.split(".").pop() || "").toLowerCase();
}

function packIconName(id) {
  switch (id) {
    case "all": return "palette";
    case "fonts": return "xp";
    case "textures": return "texture";
    case "brushes": return "brush";
    case "templates": return "template";
    case "mockups": return "mockup";
    case "graphics": return "graphics";
    default: return "custom";
  }
}

function FormatBadge({ name }) {
  const ext = getExt(name);
  const color = FORMAT_COLORS[ext] || "#6366f1";
  return (
    <span style={{
      fontSize: 8, fontWeight: 900, letterSpacing: ".06em",
      textTransform: "uppercase", padding: "2px 5px",
      borderRadius: 5, color,
      background: `${color}1A`,
      border: `1px solid ${color}30`,
    }}>{ext || "file"}</span>
  );
}

function FreePackTab({ th, t, lang }) {
  const g = (typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {};
  const { SFX, openTg, ls, DESIGN_PACK_CONFIG, MOCK_DESIGN_PACK } = g;
  const [isSubscribed, setIsSubscribed] = useState(() => ls?.get("freepack_subscribed", false));
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [animate, setAnimate] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => { setAnimate(true); }, []);

  const allFiles = Object.values(MOCK_DESIGN_PACK || {}).flat();

  const catDefs = {
    ru: [
      { id: "all",       name: "Все",       icon: "palette" },
      { id: "fonts",     name: "Шрифты",    icon: "xp" },
      { id: "textures",  name: "Текстуры",  icon: "texture" },
      { id: "brushes",   name: "Кисти",     icon: "brush" },
      { id: "templates", name: "Шаблоны",   icon: "template" },
      { id: "mockups",   name: "Мокапы",    icon: "mockup" },
      { id: "graphics",  name: "Графика",   icon: "graphics" },
    ],
    en: [
      { id: "all",       name: "All",       icon: "palette" },
      { id: "fonts",     name: "Fonts",     icon: "xp" },
      { id: "textures",  name: "Textures",  icon: "texture" },
      { id: "brushes",   name: "Brushes",   icon: "brush" },
      { id: "templates", name: "Templates", icon: "template" },
      { id: "mockups",   name: "Mockups",   icon: "mockup" },
      { id: "graphics",  name: "Graphics",  icon: "graphics" },
    ],
  };

  const cats = (catDefs[lang] || catDefs.ru).map(cat => ({
    ...cat,
    count: cat.id === "all" ? allFiles.length : allFiles.filter(f => f.category === cat.id).length,
  }));

  const filteredFiles = allFiles.filter(file => {
    const matchesCat = selectedCategory === "all" || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubscribe = useCallback(() => {
    if (subscribing) return;
    setSubscribing(true);
    SFX?.promo?.();
    openTg?.(DESIGN_PACK_CONFIG?.TELEGRAM_CHANNEL || "rivaldsg");
    setTimeout(() => {
      setIsSubscribed(true);
      ls?.set("freepack_subscribed", true);
      SFX?.success?.();
      setSubscribing(false);
    }, 2000);
  }, [subscribing, SFX, openTg, ls, DESIGN_PACK_CONFIG]);

  const handleDownload = useCallback((file) => {
    setDownloading(file.id);
    SFX?.tap?.();
    window.open(file.downloadUrl, "_blank");
    setTimeout(() => setDownloading(null), 1200);
  }, [SFX]);

  /* ── LOCKED GATE ── */
  if (!isSubscribed) {
    const previewItems = [
      { icon: "xp", title: lang === "ru" ? "Шрифты"   : "Fonts",     count: "25+", color: "#f59e0b", desc: lang === "ru" ? "Premium типографика" : "Premium typefaces" },
      { icon: "texture",  title: lang === "ru" ? "Текстуры" : "Textures",  count: "40+", color: "#10b981", desc: lang === "ru" ? "Фоны и нойзы" : "Backgrounds & noise" },
      { icon: "brush",  title: lang === "ru" ? "Кисти"    : "Brushes",   count: "30+", color: "#3b82f6", desc: lang === "ru" ? "Для Photoshop/Procreate" : "For PS/Procreate" },
      { icon: "template",  title: lang === "ru" ? "Шаблоны"  : "Templates", count: "15+", color: "#8b5cf6", desc: lang === "ru" ? "Готовые макеты" : "Ready-made layouts" },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: animate ? "packFadeIn .5s ease both" : "none" }}>
        <style>{`
          @keyframes packFadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
          @keyframes packGlow { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:.9; transform:scale(1.06); } }
          @keyframes packTileIn { from { opacity:0; transform:translateY(14px) scale(.95); } to { opacity:1; transform:none; } }
          @keyframes subPulse { 0%,100%{ box-shadow:0 8px 28px rgba(99,102,241,.45); } 50%{ box-shadow:0 12px 40px rgba(99,102,241,.7); } }
          .sub-btn { transition: all .2s cubic-bezier(.34,1.56,.64,1) !important; }
          .sub-btn:hover { transform: translateY(-2px) !important; }
          .sub-btn:active { transform: scale(0.96) !important; }
          .pack-preview-tile { transition: all .2s ease !important; }
          .pack-preview-tile:hover { border-color: rgba(99,102,241,.25) !important; transform: translateY(-2px) !important; }
        `}</style>

        {/* Hero unlock card */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(145deg, rgba(13,15,26,.97) 0%, rgba(8,9,20,1) 100%)",
          borderRadius: 28, border: "1px solid rgba(99,102,241,.32)",
          padding: "46px 24px 40px", textAlign: "center",
          boxShadow: "0 24px 70px rgba(3,4,8,.6), 0 0 60px rgba(99,102,241,.12), inset 0 1px 0 rgba(255,255,255,.06)",
        }}>
          {/* BG orbs */}
          <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.18) 0%, transparent 65%)", pointerEvents: "none", animation: "packGlow 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          {/* Top glow line */}
          <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,.75), rgba(139,92,246,.55), transparent)" }} />
          {/* Grid pattern */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "linear-gradient(rgba(99,102,241,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px", pointerEvents: "none",
          }} />

          {/* Lock icon */}
          <div style={{
            position: "relative", zIndex: 1,
            width: 90, height: 90, borderRadius: 28, margin: "0 auto 24px",
            background: "linear-gradient(135deg, rgba(99,102,241,.3), rgba(139,92,246,.22))",
            border: "1px solid rgba(99,102,241,.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 40,
            boxShadow: "0 16px 44px rgba(99,102,241,.38), inset 0 1px 0 rgba(255,255,255,.12)",
          }}><SystemIcon name="gift" size={34} color="#fff" animated /></div>

          <div style={{
            position: "relative", zIndex: 1,
            fontSize: 9.5, fontWeight: 900, color: "#818cf8",
            letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <SystemIcon name="visual" size={10} color="#818cf8" animated />
            {lang === "ru" ? "Эксклюзивный пак" : "Exclusive Pack"}
            <SystemIcon name="visual" size={10} color="#818cf8" animated />
          </div>

          <h2 style={{
            position: "relative", zIndex: 1,
            fontSize: 30, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-.03em",
            background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #818cf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {lang === "ru" ? "Бесплатный дизайн-пак" : "Free Design Pack"}
          </h2>

          <p style={{
            position: "relative", zIndex: 1,
            fontSize: 13.5, color: "rgba(100,116,139,.8)", lineHeight: 1.78,
            maxWidth: 340, margin: "0 auto 28px",
          }}>
            {lang === "ru"
              ? "Подпишись на Telegram-канал, чтобы открыть бесплатные шрифты, текстуры, кисти, шаблоны и полезные материалы."
              : "Subscribe to the Telegram channel to unlock free fonts, textures, brushes and templates."}
          </p>

          {/* Stats chips */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28, position: "relative", zIndex: 1 }}>
            {[
              { label: "110+", sub: lang === "ru" ? "Файлов" : "Files" },
              { label: "FREE", sub: lang === "ru" ? "Цена" : "Price" },
              { label: "HD", sub: lang === "ru" ? "Качество" : "Quality" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "7px 14px", borderRadius: 12,
                background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#c7d2fe", lineHeight: 1 }}>{s.label}</div>
                <div style={{ fontSize: 9, color: "rgba(100,116,139,.7)", marginTop: 2, fontWeight: 600, letterSpacing: ".04em" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <button
            className="sub-btn"
            onClick={handleSubscribe}
            disabled={subscribing}
            style={{
              position: "relative", zIndex: 1,
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "15px 34px", fontSize: 14, fontWeight: 900,
              color: "#fff",
              background: subscribing
                ? "rgba(99,102,241,.5)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", borderRadius: 18, cursor: subscribing ? "not-allowed" : "pointer",
              animation: subscribing ? "none" : "subPulse 2.5s ease infinite",
              boxShadow: "0 8px 28px rgba(99,102,241,.45), inset 0 1px 0 rgba(255,255,255,.15)",
              letterSpacing: ".02em",
              transition: "all .2s ease",
            }}
          >
            {subscribing ? (
              <>⏳ {lang === "ru" ? "Открываем..." : "Unlocking..."}</>
            ) : (
              <>↗ {lang === "ru" ? "Подписаться на канал" : "Subscribe to Channel"}</>
            )}
          </button>

          <div style={{ position: "relative", zIndex: 1, marginTop: 14, fontSize: 11, color: "rgba(99,102,241,.55)" }}>
            @{DESIGN_PACK_CONFIG?.TELEGRAM_CHANNEL || "rivaldsg"}
          </div>
        </div>

        {/* Blurred preview tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {previewItems.map((item, i) => (
            <div key={i} className="pack-preview-tile" style={{
              background: "rgba(13,15,26,.78)", border: "1px solid rgba(99,102,241,.10)",
              borderRadius: 22, padding: "18px 16px",
              opacity: 0.55, filter: "blur(0.3px)",
              animation: `packTileIn .5s ease both ${i * 0.08}s`,
              backdropFilter: "blur(10px)",
              cursor: "not-allowed",
              boxShadow: "0 4px 16px rgba(3,4,8,.2)",
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: `${item.color}18`, border: `1px solid ${item.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 0 12px", color: item.color, fontSize: 18, fontWeight: 900,
                boxShadow: `0 4px 12px ${item.color}18`,
              }}><SystemIcon name={item.icon} size={18} color={item.color} animated /></div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(224,231,255,.7)", marginBottom: 3 }}>{item.title}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 10, color: "rgba(100,116,139,.6)" }}>{item.desc}</div>
                <div style={{
                  fontSize: 11, fontWeight: 900, color: item.color,
                  padding: "1px 6px", borderRadius: 6,
                  background: `${item.color}18`,
                }}>{item.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ═══════════════════ UNLOCKED VIEW ═══════════════════ */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <style>{`
        @keyframes packFadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        @keyframes dlSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .pack-file-card { transition: all .2s cubic-bezier(.34,1.56,.64,1) !important; }
        .pack-file-card:hover { transform: translateY(-3px) scale(1.02) !important; border-color: rgba(99,102,241,.28) !important; box-shadow: 0 12px 36px rgba(99,102,241,.18) !important; }
        .pack-file-card:active { transform: scale(0.96) !important; }
        .pack-cat-pill { transition: all .2s cubic-bezier(.34,1.56,.64,1) !important; cursor: pointer !important; }
        .pack-cat-pill:active { transform: scale(0.94) !important; }
      `}</style>

      {/* Access banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16,185,129,.12) 0%, rgba(13,15,26,.92) 100%)",
        border: "1px solid rgba(16,185,129,.30)", borderRadius: 22,
        padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
        animation: "packFadeIn .5s ease both",
        boxShadow: "0 8px 26px rgba(16,185,129,.12), inset 0 1px 0 rgba(255,255,255,.04)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(16,185,129,.5), transparent)" }} />
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: "rgba(16,185,129,.14)", border: "1px solid rgba(16,185,129,.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, color: "#10b981",
          boxShadow: "0 4px 14px rgba(16,185,129,.2)",
        }}><SystemIcon name="check" size={20} color="#10b981" animated /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "rgba(224,231,255,.93)" }}>
            {lang === "ru" ? "Доступ открыт!" : "Access Unlocked!"}
          </div>
          <div style={{ fontSize: 11.5, color: "rgba(100,116,139,.7)", marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.2)",
              borderRadius: 6, padding: "1px 6px", fontSize: 11, fontWeight: 700, color: "#10b981",
            }}>{allFiles.length}</span>
            {lang === "ru" ? "файлов доступно" : "files available"}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", animation: "packFadeIn .5s ease both .06s" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(99,102,241,.5)", pointerEvents: "none" }}><SystemIcon name="search" size={14} color="rgba(99,102,241,.5)" animated /></span>
        <input
          type="text"
          placeholder={lang === "ru" ? "Поиск файлов..." : "Search files..."}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 16px 12px 38px",
            fontSize: 13, border: "1px solid rgba(99,102,241,.16)",
            borderRadius: 16, background: "rgba(13,15,26,.78)",
            color: "rgba(224,231,255,.92)", outline: "none",
            transition: "border-color .2s ease, background .2s ease", fontFamily: "inherit",
            backdropFilter: "blur(12px)",
          }}
          onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,.45)"; e.target.style.background = "rgba(18,20,36,.9)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(99,102,241,.16)"; e.target.style.background = "rgba(13,15,26,.78)"; }}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none", padding: "2px 0", animation: "packFadeIn .5s ease both .1s" }}>
        {cats.map(cat => {
          const active = selectedCategory === cat.id;
          return (
            <button key={cat.id}
              className="pack-cat-pill"
              onClick={() => { setSelectedCategory(cat.id); SFX?.filter?.(); }}
              style={{
                flexShrink: 0, padding: "7px 12px", fontSize: 11, fontWeight: 700,
                border: `1px solid ${active ? "rgba(99,102,241,.5)" : "rgba(99,102,241,.12)"}`,
                borderRadius: 999,
                background: active ? "linear-gradient(135deg, rgba(99,102,241,.22), rgba(139,92,246,.15))" : "rgba(8,9,20,.65)",
                color: active ? "#c7d2fe" : "rgba(100,116,139,.7)",
                whiteSpace: "nowrap",
                boxShadow: active ? "0 3px 12px rgba(99,102,241,.22)" : "none",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <SystemIcon name={cat.icon} size={11} color={active ? "#c7d2fe" : "rgba(100,116,139,.72)"} animated={active} />
              {cat.name}
              {cat.count > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 800,
                  background: active ? "rgba(99,102,241,.3)" : "rgba(99,102,241,.12)",
                  border: `1px solid ${active ? "rgba(165,180,252,.3)" : "rgba(99,102,241,.15)"}`,
                  borderRadius: 5, padding: "1px 5px", marginLeft: 1,
                  color: active ? "#c7d2fe" : "rgba(100,116,139,.6)",
                }}>{cat.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Files grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 10, animation: "packFadeIn .5s ease both .16s" }}>
        {filteredFiles.length === 0 ? (
          <div style={{
            gridColumn: "1 / -1", textAlign: "center", padding: "44px 20px",
            color: "rgba(100,116,139,.6)", animation: "packFadeIn .35s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, opacity: 0.75 }}><SystemIcon name="palette" size={32} color="rgba(100,116,139,.6)" animated /></div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(224,231,255,.6)", marginBottom: 6 }}>
              {lang === "ru" ? "Ничего не найдено" : "No files found"}
            </div>
            <div style={{ fontSize: 12 }}>
              {lang === "ru" ? "Попробуй другой запрос" : "Try a different query"}
            </div>
          </div>
        ) : filteredFiles.map((file, i) => {
          const isDown = downloading === file.id;
          const isHov = hovered === file.id;
          const ext = getExt(file.name);
          const extColor = FORMAT_COLORS[ext] || "#6366f1";
          return (
            <div key={file.id}
              className="pack-file-card"
              onMouseEnter={() => setHovered(file.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleDownload(file)}
              style={{
                background: "linear-gradient(180deg, rgba(13,15,26,.9) 0%, rgba(8,9,20,.94) 100%)",
                border: `1px solid ${isHov ? "rgba(99,102,241,.28)" : "rgba(99,102,241,.11)"}`,
                borderRadius: 20, overflow: "hidden", cursor: "pointer",
                animation: `packFadeIn .5s ease both ${Math.min(i * 0.04, 0.6)}s`,
                boxShadow: isHov
                  ? "0 12px 36px rgba(99,102,241,.18), inset 0 1px 0 rgba(255,255,255,.05)"
                  : "0 4px 18px rgba(3,4,8,.25), inset 0 1px 0 rgba(255,255,255,.03)",
              }}
            >
              {/* Preview */}
              <div style={{
                height: 110,
                background: file.preview
                  ? `url(${file.preview}) center/cover`
                  : `linear-gradient(135deg, ${extColor}18, rgba(99,102,241,.08))`,
                position: "relative",
              }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(3,4,8,.75) 100%)" }} />

                {/* Format badge top-left */}
                <div style={{ position: "absolute", top: 8, left: 8 }}>
                  <FormatBadge name={file.name} />
                </div>

                {/* Download button */}
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  width: 30, height: 30, borderRadius: "50%",
                  background: isDown ? "rgba(16,185,129,.85)" : "rgba(99,102,241,.85)",
                  border: "1px solid rgba(255,255,255,.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isDown ? 12 : 14, color: "#fff",
                  boxShadow: `0 4px 12px ${isDown ? "rgba(16,185,129,.5)" : "rgba(99,102,241,.5)"}`,
                  transition: "all .25s ease",
                }}>
                  {isDown ? (
                    <span style={{ animation: "dlSpin .6s linear infinite", display: "inline-block" }}>↻</span>
                  ) : "↓"}
                </div>

                {/* Category icon if no preview */}
                {!file.preview && (
                  <div style={{
                    position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
                    fontSize: 26, color: extColor, opacity: .8,
                    filter: `drop-shadow(0 0 8px ${extColor}60)`,
                  }}>
                    <SystemIcon name={cats.find(c => c.id === file.category)?.icon || packIconName(file.category)} size={24} color={extColor} animated />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "10px 12px 11px" }}>
                <div style={{
                  fontSize: 11.5, fontWeight: 800, color: "rgba(224,231,255,.9)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  marginBottom: 5,
                }} title={file.name}>{file.name}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 10, color: "rgba(100,116,139,.65)", fontWeight: 600 }}>{file.size}</div>
                  {file.premium && (
                    <span style={{
                      fontSize: 8, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase",
                      padding: "2px 5px", borderRadius: 5, color: "#f59e0b",
                      background: "rgba(245,158,11,.12)", border: "1px solid rgba(245,158,11,.25)",
                    }}>PRO</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FreePackTab;
