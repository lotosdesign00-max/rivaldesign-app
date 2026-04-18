import React, { useEffect, useRef } from "react";
import SystemIcon from "./SystemIcon";
import { cancelIdle, isMobilePerfMode, runAfterTap, scheduleIdle } from "../utils/performance";

function SideDrawer({
  open,
  onClose,
  th,
  t,
  theme,
  setTheme,
  lang,
  setLang,
  soundOn,
  setSoundOn,
  volume,
  setVolume,
  streak,
  sfx,
  getLevel,
  getLevelProgress,
  tgUser,
}) {
  const g = (typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {};
  const { LANGS = {}, THEMES = {}, ls, isTg = false } = g;
  const safeLs = ls || { set: () => {} };
  const safeStreak = streak || { xp: 0 };
  const isMobilePerf = isMobilePerfMode();
  const persistTasksRef = useRef({});

  const persistLater = (key, value, timeout = 550) => {
    cancelIdle(persistTasksRef.current[key]);
    persistTasksRef.current[key] = scheduleIdle(() => {
      safeLs.set(key, value);
      delete persistTasksRef.current[key];
    }, timeout);
  };

  useEffect(() => {
    if (open) sfx.drawer?.();
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, sfx]);

  useEffect(() => () => {
    Object.values(persistTasksRef.current).forEach(cancelIdle);
    persistTasksRef.current = {};
  }, []);

  if (!open) return null;

  const level = getLevel(safeStreak.xp);
  const prog = getLevelProgress(safeStreak.xp);
  const avatarUrl = tgUser?.photo_url || "";
  const avatarLetter = tgUser?.first_name?.[0]?.toUpperCase() || tgUser?.username?.[0]?.toUpperCase() || "R";
  const langItems = Object.entries(LANGS);
  const langShort = { ru: "RU", en: "EN", ua: "UA", kz: "KZ", by: "BY" };
  const themeItems = [
    {
      id: "deepspace",
      label: lang === "en" ? "Deep Space" : "Deep Space",
      sub: lang === "en" ? "Nebula glow" : "Туманности и свечение",
      swatch: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 58%, #22d3ee 100%)",
    },
    {
      id: "graphite",
      label: "Graphite",
      sub: lang === "en" ? "Dark premium graphite" : "Строгий графитовый стиль",
      swatch: "linear-gradient(135deg, #ffffff 0%, #d4d4d8 42%, #52525b 100%)",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(3,4,8,.80)",
          backdropFilter: isMobilePerf ? "none" : "blur(10px)", WebkitBackdropFilter: isMobilePerf ? "none" : "blur(10px)",
          animation: isMobilePerf ? "fadeIn .16s ease" : "fadeIn .25s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed", left: 0, top: 0, bottom: 0,
          width: "82vw", maxWidth: 340, zIndex: 301,
          background: `
            radial-gradient(circle at 9% 7%, rgba(99,102,241,.18) 0 1px, transparent 1.9px),
            radial-gradient(circle at 76% 11%, rgba(139,92,246,.14) 0 .95px, transparent 1.8px),
            radial-gradient(circle at 21% 46%, rgba(34,211,238,.10) 0 .9px, transparent 1.8px),
            radial-gradient(circle at 85% 67%, rgba(99,102,241,.10) 0 .95px, transparent 1.85px),
            radial-gradient(circle at 17% 88%, rgba(139,92,246,.12) 0 .95px, transparent 1.85px),
            linear-gradient(180deg, rgba(3,4,8,.995) 0%, rgba(5,6,16,.99) 52%, rgba(8,9,20,.995) 100%)
          `,
          borderRight: "1px solid rgba(99,102,241,.15)",
          display: "flex", flexDirection: "column",
          animation: "drawerSlide .3s cubic-bezier(.4,0,.2,1) both",
          overflowY: "auto", WebkitOverflowScrolling: "touch",
          boxShadow: isMobilePerf ? "0 14px 36px rgba(0,0,0,.42)" : "0 20px 60px rgba(0,0,0,.5), 0 0 40px rgba(99,102,241,.08)",
        }}
      >
        {/* Animated star particles */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(circle at 13% 19%, rgba(99,102,241,.22) 0 1px, transparent 1.9px),
            radial-gradient(circle at 71% 17%, rgba(139,92,246,.18) 0 .95px, transparent 1.8px),
            radial-gradient(circle at 27% 63%, rgba(34,211,238,.12) 0 .85px, transparent 1.7px),
            radial-gradient(circle at 89% 79%, rgba(99,102,241,.14) 0 .95px, transparent 1.8px)
          `,
          animation: isMobilePerf ? "none" : "drawerStarsDrift 36s linear infinite",
        }} />

        {/* ── PROFILE HEADER ── */}
        <div style={{
          background: "linear-gradient(180deg, rgba(8,8,16,.96) 0%, rgba(7,7,14,.9) 100%)",
          padding: "24px 20px 20px", position: "relative", overflow: "hidden",
          borderBottom: "1px solid rgba(99,102,241,.14)",
        }}>
          {/* Indigo glow orb */}
          <div style={{
            position: "absolute", left: "50%", top: -60, width: 280, height: 280,
            transform: "translateX(-50%)", borderRadius: "50%",
            background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,.20) 0%, rgba(139,92,246,.08) 30%, transparent 65%)",
            pointerEvents: "none",
            animation: isMobilePerf ? "none" : "drawerPortholeFloat 18s ease-in-out infinite alternate",
          }} />
          {!isMobilePerf && <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(99,102,241,.08)", filter: "blur(16px)", pointerEvents: "none" }} />}
          {!isMobilePerf && <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(139,92,246,.06)", filter: "blur(12px)", pointerEvents: "none" }} />}

          {/* Avatar */}
          <div style={{
            position: "relative",
            zIndex: 1,
            width: 64,
            height: 64,
            borderRadius: "50%",
            padding: 2,
            marginBottom: 14,
            background: avatarUrl
              ? "linear-gradient(135deg, rgba(255,255,255,.45), rgba(255,255,255,.08) 48%, rgba(129,140,248,.24))"
              : "linear-gradient(135deg, rgba(99,102,241,.28), rgba(139,92,246,.18))",
            boxShadow: "0 10px 24px rgba(0,0,0,.20)",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(255,255,255,.07), rgba(255,255,255,.025))",
              border: "1px solid rgba(255,255,255,.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "rgba(255,255,255,.94)",
              fontWeight: 900,
            }}>
            <span style={{ position: "relative", zIndex: 1 }}>{avatarLetter}</span>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={tgUser?.first_name ? `${tgUser.first_name} avatar` : "Telegram avatar"}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(event) => { event.currentTarget.style.display = "none"; }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 2,
                }}
              />
            )}
            </div>
          </div>
          <div className="type-display" style={{ position: "relative", zIndex: 1, fontSize: 16, color: "rgba(224,231,255,.95)" }}>
            {tgUser?.first_name || "Designer"}
          </div>
          <div className="type-micro" style={{ position: "relative", zIndex: 1, fontSize: 9.5, color: "#818cf8", marginBottom: 14 }}>
            LVL {level} · {safeStreak.xp} XP
          </div>

          {/* XP bar — indigo glow */}
          <div style={{ position: "relative", zIndex: 1, height: 5, borderRadius: 999, background: "rgba(99,102,241,.18)", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${prog * 100}%`, borderRadius: 999,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              transition: "width .5s ease",
              boxShadow: "0 0 10px rgba(99,102,241,.6)",
            }} />
          </div>
        </div>

        {/* ── SETTINGS ── */}
        <div style={{ padding: "14px 20px 0", display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          <div
            style={{
              borderRadius: 22, padding: 16,
              border: "1px solid rgba(99,102,241,.14)",
              background: "linear-gradient(180deg, rgba(13,15,26,.85) 0%, rgba(8,9,20,.80) 100%)",
              boxShadow: "0 8px 28px rgba(3,4,8,.3), inset 0 1px 0 rgba(255,255,255,.04)",
              display: "flex", flexDirection: "column", gap: 16,
            }}
          >
            {/* Sound toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div className="type-micro" style={{ fontSize: 9, color: "rgba(100,116,139,.7)" }}>{t.settingsTitle}</div>
                <div className="type-display" style={{ fontSize: 13, color: "rgba(224,231,255,.9)", marginTop: 4 }}>
                  {lang === "en" ? "Controls" : "Управление"}
                </div>
              </div>
              <div
                style={{
                  padding: "8px 12px", borderRadius: 13,
                  border: `1px solid ${soundOn ? "rgba(99,102,241,.50)" : "rgba(99,102,241,.14)"}`,
                  background: soundOn ? "rgba(99,102,241,.18)" : "rgba(5,6,14,.6)",
                  display: "flex", alignItems: "center", gap: 7, minWidth: 88, justifyContent: "center",
                  cursor: "pointer", transition: "all .2s ease",
                  boxShadow: soundOn ? "0 4px 14px rgba(99,102,241,.25)" : "none",
                }}
                onClick={() => runAfterTap(() => { const next = !soundOn; setSoundOn(next); persistLater("rs_sound4", next); sfx.toggle?.(); })}
              >
                <span style={{ fontSize: 13, lineHeight: 1, color: soundOn ? "#c7d2fe" : "rgba(100,116,139,.65)" }}>
                  {soundOn ? "в™Є" : "×"}
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: soundOn ? "#c7d2fe" : "rgba(100,116,139,.65)" }}>
                  {soundOn ? (lang === "en" ? "Sound" : "Звук") : (lang === "en" ? "Muted" : "Тихо")}
                </span>
              </div>
            </div>

            {/* Language */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="type-micro" style={{ fontSize: 9, color: "rgba(100,116,139,.7)" }}>{t.settingsLang}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 7 }}>
                {langItems.map(([code]) => {
                  const active = lang === code;
                  return (
                    <button
                      key={code}
                      onClick={() => { if (lang === code) return; runAfterTap(() => { sfx.lang?.(); setLang(code); persistLater("rs_lang4", code); }); }}
                      style={{
                        minHeight: 48, padding: "6px 4px", borderRadius: 14,
                        border: `1px solid ${active ? "rgba(99,102,241,.55)" : "rgba(99,102,241,.12)"}`,
                        background: active ? "rgba(99,102,241,.22)" : "rgba(5,6,14,.6)",
                        boxShadow: active ? "0 0 0 1px rgba(99,102,241,.18) inset, 0 4px 14px rgba(99,102,241,.20)" : "none",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all .18s ease",
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 900, color: active ? "#c7d2fe" : "rgba(100,116,139,.65)", letterSpacing: ".06em" }}>
                        {langShort[code] || code.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="type-micro" style={{ fontSize: 9, color: "rgba(100,116,139,.7)" }}>{t.settingsTheme}</div>
                <div className="type-micro" style={{ fontSize: 8.5, color: "rgba(99,102,241,.5)" }}>
                  {theme.label}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {themeItems.map((item) => {
                  const active = theme.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => runAfterTap(() => {
                        if (theme.id === item.id) return;
                        const next = THEMES[item.id];
                        if (!next) return;
                        setTheme(next);
                        persistLater("rs_theme4", item.id);
                        persistLater("rs_theme_schema4", "v2");
                        sfx.theme?.();
                      })}
                      style={{
                        minHeight: 64,
                        padding: "10px 10px 11px",
                        borderRadius: 16,
                        border: `1px solid ${active ? "rgba(99,102,241,.46)" : "rgba(99,102,241,.12)"}`,
                        background: active ? "rgba(99,102,241,.16)" : "rgba(5,6,14,.6)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 8,
                        cursor: "pointer",
                        boxShadow: active ? "0 6px 18px rgba(99,102,241,.20), inset 0 1px 0 rgba(255,255,255,.05)" : "none",
                        transition: "all .18s ease",
                      }}
                    >
                      <div style={{
                        width: "100%",
                        height: 10,
                        borderRadius: 999,
                        background: item.swatch,
                        boxShadow: active ? "0 0 14px rgba(99,102,241,.24)" : "none",
                      }} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: active ? "#e5e7eb" : "rgba(224,231,255,.86)" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: 8.5, color: active ? "rgba(199,210,254,.74)" : "rgba(100,116,139,.68)", marginTop: 3, lineHeight: 1.35 }}>
                          {item.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="type-micro" style={{ fontSize: 9, color: "rgba(100,116,139,.7)" }}>{t.settingsVol}</div>
                <div className="type-micro" style={{ fontSize: 8.5, color: "#818cf8" }}>{Math.round(volume * 100)}%</div>
              </div>
              <input
                type="range" min={0} max={1} step={0.05} value={volume}
                onChange={(e) => { const v = +e.target.value; setVolume(v); persistLater("rs_volume4", v, 700); }}
                style={{ width: "100%", accentColor: "#6366f1" }}
              />
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ padding: "16px 20px 24px", marginTop: "auto" }}>
          <div style={{
            padding: "14px 16px", borderRadius: 18,
            border: "1px solid rgba(99,102,241,.14)",
            background: "linear-gradient(180deg, rgba(13,15,26,.80) 0%, rgba(8,9,20,.88) 100%)",
            textAlign: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><SystemIcon name="spark" size={22} color="rgba(199,210,254,.92)" animated tone="glow" /></div>
            <div className="type-display" style={{ fontSize: 14, color: "rgba(224,231,255,.9)" }}>Rival Space</div>
            <div className="type-micro" style={{ fontSize: 8.5, color: "rgba(99,102,241,.6)", marginTop: 6 }}>
              v4.0 Ultra · {isTg ? "Telegram Mini App" : "Web Preview"}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes drawerStarsDrift {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-2.5%, 2%, 0); }
          }
          @keyframes drawerPortholeFloat {
            0% { transform: translateX(-50%) translateY(0) scale(1); opacity: .9; }
            100% { transform: translateX(-50%) translateY(8px) scale(1.04); opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
}

export default React.memo(SideDrawer);
