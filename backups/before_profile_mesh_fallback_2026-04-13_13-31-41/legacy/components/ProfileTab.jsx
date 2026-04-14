import React, { useEffect, useMemo, useState } from "react";
import FreePackTab from "./FreePackTab";
import ClientHub from "./ClientHub";

function ProfileTab({
  th,
  t,
  lang,
  streak,
  achievements,
  showToast,
  setTab,
  setSelectedAchievement,
  walletBalance = 0,
  paymentHistory = [],
  orders = [],
  onRequestTopUp,
  onMarkPaymentSubmitted,
  onRefreshInvoiceStatus,
  onAddOrderMessage,
  onOpenCryptoBot,
  onOpenTelegram,
}) {
  const g = (typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {};
  const {
    ls,
    getLevel = () => 1,
    getLevelProgress = () => 0,
    tgUser,
    SFX = {},
    ACHIEVEMENTS = [],
  } = g;

  const safeLs = ls || { get: (_k, d) => d };
  const safeStreak = streak || { xp: 0, count: 0, achievementsUnlocked: [] };
  const unlockedAchievements = achievements || [];
  const unlockedIds = safeStreak.achievementsUnlocked || unlockedAchievements.map((item) => item.id);
  const level = getLevel(safeStreak.xp);
  const levelProgress = Math.max(0, Math.min(1, getLevelProgress(safeStreak.xp)));
  const firstVisit = safeLs.get("rs_first_visit", new Date().toISOString());
  const daysInApp = Math.max(1, Math.floor((Date.now() - new Date(firstVisit).getTime()) / 86400000) + 1);
  const [showAchievementsList, setShowAchievementsList] = useState(false);
  const [showPackSection, setShowPackSection] = useState(false);
  const [paintReady, setPaintReady] = useState(false);
  const isPackUnlocked = safeLs.get("freepack_subscribed", false);

  const stats = [
    { icon: "📅", label: lang === "en" ? "Days in app" : "Дней в приложении", value: daysInApp, color: "#3b82f6" },
    { icon: "🔥", label: lang === "en" ? "Current streak" : "Текущий стрик", value: safeStreak.count, color: "#f97316" },
    { icon: "★", label: lang === "en" ? "Level" : "Уровень", value: level, color: "#a855f7" },
    { icon: "✦", label: "XP", value: safeStreak.xp, color: "#06b6d4" },
  ];

  const achievementCategories = [
    { id: "general", name: lang === "en" ? "General" : "Общие", icon: "🎯" },
    { id: "quiz", name: lang === "en" ? "Quiz" : "Викторина", icon: "🧠" },
    { id: "social", name: lang === "en" ? "Social" : "Социальные", icon: "🌐" },
    { id: "special", name: lang === "en" ? "Secret" : "Секретные", icon: "🔒" },
  ];

  const getAchievementCategory = (achievement) => {
    if (achievement.secret) return "special";
    if (achievement.id.includes("quiz")) return "quiz";
    if (achievement.id.includes("social") || achievement.id.includes("wishlist") || achievement.id.includes("lang")) return "social";
    return "general";
  };

  const groupedAchievements = useMemo(
    () =>
      achievementCategories.map((category) => ({
        ...category,
        items: ACHIEVEMENTS.filter((achievement) => getAchievementCategory(achievement) === category.id),
      })),
    [ACHIEVEMENTS]
  );

  const unlockedCount = unlockedIds.length;
  const totalAchievements = ACHIEVEMENTS.length || 1;
  const achievementsPercent = Math.round((unlockedCount / totalAchievements) * 100);

  useEffect(() => {
    if (!isPackUnlocked) {
      showToast?.(lang === "en" ? "Claim your free pack in profile" : "Забери бесплатный пак в профиле", "info");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let rafA = 0;
    let rafB = 0;
    rafA = window.requestAnimationFrame(() => {
      rafB = window.requestAnimationFrame(() => {
        setPaintReady(true);
        window.dispatchEvent(new Event("resize"));
      });
    });
    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, []);

  return (
    <div
      style={{
        padding: "8px 0 40px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        transform: paintReady ? "translateZ(0)" : "translate3d(0,0,0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {/* в”Ђв”Ђ HERO CARD в”Ђв”Ђ */}
      <div style={{
        backgroundColor: th.surface,
        background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
        borderRadius: 32, padding: "28px 24px",
        position: "relative", overflow: "hidden",
        border: `1px solid ${th.border}`,
        boxShadow: th.id === "graphite"
          ? "0 20px 56px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.05)"
          : "0 20px 56px rgba(3,4,8,.42), 0 0 32px rgba(99,102,241,.09), inset 0 1px 0 rgba(255,255,255,.06)",
        isolation: "isolate",
        transform: "translateZ(0)",
        willChange: "transform",
      }}>
        {/* Dynamic Nebula Orbs */}
        <div style={{ position: "absolute", top: -80, right: -60, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${th.glow} 0%, transparent 70%)`, filter: "blur(20px)", opacity: 0.55, pointerEvents: "none", transform: "translateZ(0)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${th.accent}22 0%, transparent 68%)`, filter: "blur(18px)", opacity: 0.42, pointerEvents: "none", transform: "translateZ(0)" }} />
        {/* Top border intense glow */}
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1.5, background: `linear-gradient(90deg, transparent, ${th.accent}, ${th.hi || th.accentB}, transparent)`, pointerEvents: "none", opacity: 0.72, boxShadow: `0 2px 14px ${th.glow}` }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative", zIndex: 1 }}>
          {/* Avatar Premium */}
          <div style={{
            position: "relative", width: 80, height: 80, borderRadius: 24,
            background: `linear-gradient(135deg, ${th.accent}55, ${th.accentB}26)`,
            border: `1px solid ${th.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, fontWeight: 900, color: "#fff",
            boxShadow: th.id === "graphite"
              ? "0 12px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.08)"
              : `0 12px 30px ${th.glow}, inset 0 1px 0 rgba(255,255,255,.12)`,
            textShadow: "0 4px 16px rgba(0,0,0,0.4)"
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%)", borderRadius: "inherit", pointerEvents: "none" }} />
            {tgUser?.first_name?.[0]?.toUpperCase() || "R"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 26, color: "#fff", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-.02em" }}>
              {tgUser?.first_name || "Designer"}
            </div>
            <div style={{ fontSize: 13, color: th.sub, fontWeight: 700, marginTop: 6, letterSpacing: ".02em" }}>
              {tgUser?.username ? `@${tgUser.username}` : "Rival Space"}
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12,
              padding: "4px 12px", borderRadius: 999,
              background: `linear-gradient(90deg, ${th.accent}18, ${th.accentB}10)`,
              border: `1px solid ${th.border}`,
              fontSize: 11, fontWeight: 900, color: th.text,
              fontFamily: "var(--font-number)", letterSpacing: ".05em"
            }}>
              <span style={{ color: th.sub }}>LVL</span> {level}
              <span style={{ margin: "0 2px", opacity: 0.3 }}>|</span> 
              {safeStreak.xp.toLocaleString()} <span style={{ color: th.sub }}>XP</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div style={{ marginTop: 26, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, color: th.sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em" }}>
              {lang === "en" ? `Next Level: ${level + 1}` : `След. уровень: ${level + 1}`}
            </span>
            <span style={{ fontSize: 13, color: th.text, fontWeight: 900, fontFamily: "var(--font-number)" }}>{Math.round(levelProgress * 100)}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,.05)", overflow: "hidden", position: "relative", boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)" }}>
            <div style={{
              width: `${levelProgress * 100}%`, height: "100%", borderRadius: 999,
              background: `linear-gradient(90deg, ${th.accent}, ${th.accentB}, ${th.hi || th.accent})`,
              boxShadow: `0 0 16px ${th.glow}`,
              transition: "width 1s cubic-bezier(.34,1.56,.64,1)",
            }} />
            {/* Shimmer sweep effect */}
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: "30%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              animation: "shimmerSweep 3s infinite",
              pointerEvents: "none"
            }} />
          </div>
        </div>
      </div>

      <ClientHub
        th={th}
        lang={lang}
        walletBalance={walletBalance}
        paymentHistory={paymentHistory}
        orders={orders}
        onRequestTopUp={onRequestTopUp}
        onMarkPaymentSubmitted={onMarkPaymentSubmitted}
        onRefreshInvoiceStatus={onRefreshInvoiceStatus}
        onAddOrderMessage={onAddOrderMessage}
        onOpenCryptoBot={onOpenCryptoBot}
        onOpenTelegram={onOpenTelegram}
      />

      {/* в”Ђв”Ђ STATS GRID в”Ђв”Ђ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            style={{
              background: "linear-gradient(180deg, rgba(13,15,26,.85) 0%, rgba(8,9,20,.90) 100%)",
              border: `1px solid ${stat.color}15`,
              borderRadius: 24, padding: "20px 18px",
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: "0 8px 30px rgba(3,4,8,.35), inset 0 1px 0 rgba(255,255,255,.03)",
              backdropFilter: "blur(18px)",
              transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
              position: "relative", overflow: "hidden"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = `${stat.color}35`; e.currentTarget.style.boxShadow = `0 12px 30px ${stat.color}10, inset 0 1px 0 rgba(255,255,255,.05)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${stat.color}15`; e.currentTarget.style.boxShadow = "0 8px 30px rgba(3,4,8,.35), inset 0 1px 0 rgba(255,255,255,.03)"; }}
          >
            <div style={{ position: "absolute", top: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${stat.color}10 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{
              width: 54, height: 54, borderRadius: 18,
              background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)`, 
              border: `1px solid ${stat.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, flexShrink: 0,
              boxShadow: `0 6px 20px ${stat.color}20`,
              position: "relative", zIndex: 1
            }}>
              {stat.icon}
            </div>
            <div style={{ minWidth: 0, position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(100,116,139,.8)", marginBottom: 6, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 26, color: "rgba(224,231,255,.95)", fontWeight: 900, lineHeight: 1, fontFamily: "var(--font-number)", letterSpacing: "-.02em" }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { setShowPackSection((prev) => !prev); SFX.tap?.(); }}
        style={{
          width: "100%",
          border: `1px solid ${showPackSection ? "rgba(99,102,241,.5)" : "rgba(99,102,241,.18)"}`,
          background: showPackSection
            ? "linear-gradient(180deg, rgba(99,102,241,.14) 0%, rgba(13,15,26,.95) 100%)"
            : "linear-gradient(135deg, rgba(13,15,26,.88) 0%, rgba(8,9,20,.95) 100%)",
          borderRadius: 26, padding: "22px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          cursor: "pointer",
          boxShadow: showPackSection ? "0 12px 40px rgba(99,102,241,0.2)" : "0 10px 30px rgba(3,4,8,.4), inset 0 1px 0 rgba(255,255,255,.05)",
          textAlign: "left", position: "relative", overflow: "hidden",
          transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
          transform: "translateY(0)"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        onTouchStart={e => e.currentTarget.style.transform = "scale(0.98)"}
        onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <div style={{ position: "absolute", top: -30, right: -20, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: isPackUnlocked ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#fff",
              boxShadow: isPackUnlocked ? "0 8px 24px rgba(16,185,129,.4)" : "0 8px 24px rgba(99,102,241,.45)",
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.15)"
            }}
          >
            🎁
          </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,.95)", letterSpacing: "-.01em" }}>
                {lang === "en" ? "Free design pack" : "Бесплатный дизайн-пак"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(165,180,252,.7)", marginTop: 6, lineHeight: 1.55, fontWeight: 500 }}>
                {isPackUnlocked
                  ? lang === "en" ? "Your pack is already unlocked. Open it here anytime." : "Пак уже открыт. Теперь его можно открыть здесь в любой момент."
                  : lang === "en" ? "Claim fonts, textures and useful assets right from your profile." : "Забери шрифты, текстуры и полезные материалы прямо из профиля."}
              </div>
            </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, position: "relative", zIndex: 1 }}>
          {!isPackUnlocked && (
            <div
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                boxShadow: "0 6px 16px rgba(99,102,241,0.3)"
              }}
            >
              {lang === "en" ? "Claim" : "Забрать"}
            </div>
          )}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              border: `1px solid ${showPackSection ? "rgba(99,102,241,.5)" : "rgba(99,102,241,.2)"}`,
              background: showPackSection ? "rgba(99,102,241,.2)" : "rgba(5,6,14,.6)",
              color: showPackSection ? "#fff" : "rgba(165,180,252,.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 900,
              transition: "all .3s ease",
              transform: showPackSection ? "rotate(180deg)" : "rotate(0deg)"
            }}
          >
            {showPackSection ? "−" : "+"}
          </div>
        </div>
      </button>

      {showPackSection && (
        <div style={{ animation: "cardIn .3s ease both" }}>
          <FreePackTab th={th} t={t} lang={lang} />
        </div>
      )}

      <button
        onClick={() => {
          setShowAchievementsList((prev) => !prev);
          SFX.tap?.();
        }}
        style={{
          width: "100%",
          border: `1px solid ${showAchievementsList ? th.accent : th.border}`,
          background: showAchievementsList
            ? `linear-gradient(180deg, ${th.accent}12 0%, ${th.card} 100%)`
            : `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
          borderRadius: 24,
          padding: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          cursor: "pointer",
          boxShadow: `0 10px 28px rgba(0,0,0,.12)`,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: th.grad,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: "#fff",
              boxShadow: `0 6px 20px rgba(0,0,0,.14)`,
              flexShrink: 0,
            }}
          >
            🏆
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: th.text }}>{t.achievements}</div>
            <div style={{ fontSize: 11, color: th.sub, marginTop: 4, lineHeight: 1.45 }}>
              {lang === "en"
                ? `${unlockedCount} of ${ACHIEVEMENTS.length} unlocked`
                : `${unlockedCount} из ${ACHIEVEMENTS.length} открыто`}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: th.accent }}>{achievementsPercent}%</div>
            <div style={{ fontSize: 10, color: th.sub }}>{lang === "en" ? "progress" : "прогресс"}</div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              border: `1px solid ${showAchievementsList ? th.accent : th.border}`,
              background: showAchievementsList ? th.accent + "18" : th.surface,
              color: showAchievementsList ? th.accent : th.sub,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
            }}
          >
            {showAchievementsList ? "−" : "+"}
          </div>
        </div>
      </button>

      {showAchievementsList && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "cardIn .3s ease both" }}>
          {groupedAchievements.map((category) => {
            if (!category.items.length) return null;
            return (
              <div
                key={category.id}
                style={{
                  background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
                  border: `1px solid ${th.border}`,
                  borderRadius: 24,
                  padding: 16,
                  boxShadow: `0 8px 24px rgba(0,0,0,.1)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: 18 }}>{category.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: th.text, textTransform: "uppercase", letterSpacing: ".08em" }}>
                    {category.name}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {category.items.map((achievement, index) => {
                    const unlocked = unlockedIds.includes(achievement.id);
                    const isSecretLocked = achievement.secret && !unlocked;
                    return (
                      <button
                        key={achievement.id}
                        onClick={() => {
                          if (unlocked) {
                            SFX.achievement?.();
                            setSelectedAchievement?.(achievement);
                            return;
                          }
                          SFX.tap?.();
                          showToast?.(
                            isSecretLocked
                              ? lang === "en"
                                ? "This achievement is still hidden"
                                : "Р­С‚Рѕ РґРѕСЃС‚РёР¶РµРЅРёРµ РїРѕРєР° СЃРєСЂС‹С‚Рѕ"
                              : lang === "en"
                                ? "Unlock this achievement in the app"
                                : "РћС‚РєСЂРѕР№ СЌС‚Рѕ РґРѕСЃС‚РёР¶РµРЅРёРµ РІРЅСѓС‚СЂРё РїСЂРёР»РѕР¶РµРЅРёСЏ",
                            "info"
                          );
                        }}
                        style={{
                          width: "100%",
                          border: `1px solid ${unlocked ? th.accent + "4a" : th.border}`,
                          background: unlocked ? th.accent + "0f" : th.surface,
                          borderRadius: 18,
                          padding: "14px 15px",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          cursor: "pointer",
                          textAlign: "left",
                          opacity: isSecretLocked ? 0.78 : 1,
                        }}
                      >
                        <div
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 15,
                            background: unlocked ? th.grad : th.card,
                            border: `1px solid ${unlocked ? th.accent + "44" : th.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            color: unlocked ? "#fff" : th.sub,
                            flexShrink: 0,
                            boxShadow: unlocked ? th.shadow : "none",
                            filter: isSecretLocked ? "blur(4px)" : "none",
                          }}
                        >
                          {isSecretLocked ? "?" : achievement.icon}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 900, color: unlocked ? th.text : th.sub }}>
                            {isSecretLocked
                              ? lang === "en"
                                ? "Secret achievement"
                                : "РЎРµРєСЂРµС‚РЅРѕРµ РґРѕСЃС‚РёР¶РµРЅРёРµ"
                              : achievement.title}
                          </div>
                          <div style={{ fontSize: 11, color: th.sub, lineHeight: 1.55, marginTop: 4 }}>
                            {isSecretLocked
                              ? "?"
                              : achievement.desc}
                          </div>
                        </div>

                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 900, color: unlocked ? th.accent : th.sub }}>+{achievement.xp}</div>
                          <div style={{ fontSize: 9, color: th.sub, marginTop: 2 }}>XP</div>
                          {unlocked && <div style={{ fontSize: 14, color: th.accent, marginTop: 4 }}>вњ“</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default ProfileTab;




