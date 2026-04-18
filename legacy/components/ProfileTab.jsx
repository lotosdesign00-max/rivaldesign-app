import React, { useEffect, useMemo, useState } from "react";
import FreePackTab from "./FreePackTab";
import ClientHub from "./ClientHub";
import PaymentDetailsModal from "./PaymentDetailsModal";
import SystemIcon from "./SystemIcon";

function moneyUsd(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

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
  onOpenStarsInvoice,
  onOpenTelegram,
  onRequestPaymentDetails,
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
  const avatarUrl = tgUser?.photo_url || "";
  const avatarLetter = tgUser?.first_name?.[0]?.toUpperCase() || tgUser?.username?.[0]?.toUpperCase() || "R";
  const [showAchievementsList, setShowAchievementsList] = useState(false);
  const [showPackSection, setShowPackSection] = useState(false);
  const [showOrdersSection, setShowOrdersSection] = useState(false);
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [paintReady, setPaintReady] = useState(false);
  const isMobilePerf = typeof document !== "undefined" && document.documentElement.dataset.rsMobile === "true";
  const activeOrdersCount = orders.filter((o) => ["waiting_payment", "payment_review", "queued", "in_progress", "preview_sent", "revision"].includes(o.status)).length;
  const isPackUnlocked = safeLs.get("freepack_subscribed", false);

  const stats = [
    { icon: "calendar", label: lang === "en" ? "Days in app" : "Дней в приложении", value: daysInApp, color: "#3b82f6" },
    { icon: "fire", label: lang === "en" ? "Current streak" : "Текущий стрик", value: safeStreak.count, color: "#f97316" },
    { icon: "star", label: lang === "en" ? "Level" : "Уровень", value: level, color: "#a855f7" },
    { icon: "xp", label: "XP", value: safeStreak.xp, color: "#06b6d4" },
  ];

  const achievementCategories = [
    { id: "general", name: lang === "en" ? "General" : "Общие", icon: "target" },
    { id: "quiz", name: lang === "en" ? "Quiz" : "Викторина", icon: "brain" },
    { id: "social", name: lang === "en" ? "Social" : "Социальные", icon: "globe" },
    { id: "special", name: lang === "en" ? "Secret" : "Секретные", icon: "lock" },
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
        if (!isMobilePerf) {
          window.dispatchEvent(new Event("resize"));
        }
      });
    });
    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [isMobilePerf]);

  return (
    <div
      className="profile-tab"
      style={{
        padding: "8px 0 40px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        transform: paintReady ? "translateZ(0)" : "translate3d(0,0,0)",
        willChange: isMobilePerf ? "auto" : "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {/* ── HERO CARD ── */}
      <div style={{
        backgroundColor: th.surface,
        background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
        borderRadius: 32, padding: "28px 24px",
        position: "relative", overflow: "hidden",
        border: `1px solid ${th.border}`,
        boxShadow: "0 18px 42px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.04)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 30%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative", zIndex: 1 }}>
          {/* Avatar Premium */}
          <div style={{
            position: "relative",
            width: 82,
            height: 82,
            borderRadius: "50%",
            padding: 2,
            background: avatarUrl
              ? "linear-gradient(135deg, rgba(255,255,255,.52), rgba(255,255,255,.08) 48%, rgba(129,140,248,.24))"
              : "linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.045))",
            boxShadow: "0 14px 30px rgba(0,0,0,.20)",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.025))",
              border: `1px solid ${th.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 900,
              color: "#fff",
              textShadow: "0 4px 16px rgba(0,0,0,0.4)"
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
              background: "rgba(255,255,255,.05)",
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
              background: `linear-gradient(90deg, ${th.accent}, ${th.accentB})`,
              boxShadow: "none",
              transition: "width 1s cubic-bezier(.34,1.56,.64,1)",
            }} />
            {/* Shimmer sweep effect */}
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: "30%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              animation: "shimmerSweep 4s infinite",
              pointerEvents: "none"
            }} />
          </div>
        </div>
      </div>

      {/* ─── PREMIUM WALLET CARD ─── */}
      <div
        style={{
          borderRadius: 28,
          border: `1px solid ${walletBalance > 0 ? (th.id === "graphite" ? "rgba(255,255,255,.18)" : "rgba(99,102,241,.35)") : th.border}`,
          background: th.id === "graphite"
            ? "linear-gradient(135deg, rgba(39,39,42,.95) 0%, rgba(24,24,27,.97) 100%)"
            : `linear-gradient(135deg, ${th.card} 0%, ${th.surface} 100%)`,
          padding: "22px 20px",
          position: "relative",
          overflow: "hidden",
          boxShadow: walletBalance > 0
            ? (th.id === "graphite"
              ? "0 14px 40px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.10)"
              : `0 14px 40px ${th.accent}18, inset 0 1px 0 rgba(255,255,255,.06)`)
            : "0 10px 28px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.04)",
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: "absolute", top: -60, right: -40, width: 160, height: 160, borderRadius: "50%",
          background: th.id === "graphite"
            ? "radial-gradient(circle, rgba(255,255,255,.06) 0%, transparent 70%)"
            : `radial-gradient(circle, ${th.accent}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: th.id === "graphite" ? "linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent)" : `linear-gradient(90deg, transparent, ${th.accent}55, transparent)`, pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, position: "relative", zIndex: 1 }}>
          <div>
            <div className="type-micro" style={{ color: th.sub, fontSize: 10 }}>
              {lang === "en" ? "Wallet" : "Кошелёк"}
            </div>
            <div className="type-display" style={{ fontSize: 32, color: th.text, marginTop: 8, letterSpacing: "-.03em" }}>
              {moneyUsd(walletBalance)}
            </div>
            <div style={{ fontSize: 11.5, color: th.sub, lineHeight: 1.55, marginTop: 8, maxWidth: 240 }}>
              {lang === "en"
                ? "Use balance for instant checkout inside the app."
                : "Баланс для мгновенной оплаты заказов внутри приложения."}
            </div>
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: 20,
            background: th.id === "graphite"
              ? "linear-gradient(135deg, rgba(255,255,255,.12), rgba(161,161,170,.06))"
              : `linear-gradient(135deg, ${th.accent}25, ${th.accentB}15)`,
            border: `1px solid ${th.id === "graphite" ? "rgba(255,255,255,.15)" : th.accent + "44"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: th.id === "graphite"
              ? "0 8px 24px rgba(255,255,255,.08)"
              : `0 8px 24px ${th.accent}25`,
          }}>
            {/* Wallet SVG icon — анимация «доступ к ценности» */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", animation: "walletAccess 3.5s ease-in-out infinite" }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" style={{ transformOrigin: "center center" }}>
                <rect x="3" y="5" width="18" height="14" rx="3" stroke={th.id === "graphite" ? "rgba(255,255,255,.7)" : th.accent} strokeWidth="1.6" fill="none" style={{ animation: "walletFlapOpen 3.5s ease-in-out infinite", transformOrigin: "center 5px" }} />
                <path d="M3 10h18" stroke={th.id === "graphite" ? "rgba(255,255,255,.4)" : th.accent + "66"} strokeWidth="1.2" style={{ animation: "walletAccess 3.5s ease-in-out infinite" }} />
                <circle cx="17" cy="14" r="1.5" fill={th.id === "graphite" ? "rgba(255,255,255,.7)" : th.accent} style={{ animation: "walletDotPulse 3.5s ease-in-out infinite" }} />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ORDERS DESK (expandable) ─── */}
      <button
        onClick={() => {
          setShowOrdersSection((prev) => !prev);
          SFX.order?.();
        }}
        style={{
          width: "100%",
          borderRadius: 24,
          border: `1px solid ${showOrdersSection ? (th.id === "graphite" ? "rgba(255,255,255,.22)" : th.accent) : th.border}`,
          background: showOrdersSection
            ? (th.id === "graphite"
              ? "linear-gradient(180deg, rgba(255,255,255,.08) 0%, rgba(24,24,27,.95) 100%)"
              : `linear-gradient(180deg, ${th.accent}12 0%, ${th.card} 100%)`)
            : `linear-gradient(135deg, ${th.card} 0%, ${th.surface} 100%)`,
          boxShadow: showOrdersSection
            ? (th.id === "graphite"
              ? "0 12px 40px rgba(255,255,255,.08)"
              : `0 12px 40px ${th.accent}15`)
            : "0 12px 30px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.04)",
          padding: "18px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          cursor: "pointer",
          textAlign: "left",
          transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: showOrdersSection
                ? (th.id === "graphite"
                  ? "linear-gradient(135deg, rgba(255,255,255,.15), rgba(161,161,170,.08))"
                  : `linear-gradient(135deg, ${th.accent}30, ${th.accentB}20)`)
                : `linear-gradient(135deg, ${th.accent}22, ${th.accentB}18)`,
              border: `1px solid ${showOrdersSection ? (th.id === "graphite" ? "rgba(255,255,255,.22)" : th.accent + "55") : th.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: th.text,
              fontSize: 20,
              flexShrink: 0,
              boxShadow: showOrdersSection
                ? (th.id === "graphite" ? "0 6px 20px rgba(255,255,255,.10)" : `0 6px 20px ${th.accent}30`)
                : "none",
            }}
          >
            {/* Orders clipboard icon */}
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path d="M8 3h8c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2Z" stroke={showOrdersSection ? (th.id === "graphite" ? "rgba(255,255,255,.7)" : th.accent) : th.sub} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
              <path d="M10 3v2c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V3" stroke={showOrdersSection ? (th.id === "graphite" ? "rgba(255,255,255,.5)" : th.accent + "88") : th.sub} strokeWidth="1.3" strokeLinecap="round" fill="none" />
              <path d="M9 10h6M9 14h6M9 18h3" stroke={showOrdersSection ? (th.id === "graphite" ? "rgba(255,255,255,.4)" : th.accent + "66") : th.sub} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" fill="none" />
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: th.text }}>
                {lang === "en" ? "Order desk" : "Кабинет заказов"}
              </div>
              {activeOrdersCount > 0 && (
                <span style={{
                  padding: "2px 8px", borderRadius: 999,
                  background: th.grad, color: "#fff",
                  fontSize: 10, fontWeight: 900,
                  boxShadow: `0 4px 12px ${th.glow}`,
                }}>
                  {activeOrdersCount}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: th.sub, lineHeight: 1.55, marginTop: 4 }}>
              {lang === "en"
                ? "Payments, queue, statuses and messages"
                : "Платежи, очередь, статусы и сообщения"}
            </div>
          </div>
        </div>
        <div
          style={{
            minWidth: 40,
            height: 40,
            borderRadius: 14,
            border: `1px solid ${showOrdersSection ? (th.id === "graphite" ? "rgba(255,255,255,.22)" : th.accent + "55") : th.border}`,
            background: showOrdersSection
              ? (th.id === "graphite" ? "rgba(255,255,255,.10)" : th.accent + "18")
              : "rgba(255,255,255,.04)",
            color: showOrdersSection ? (th.id === "graphite" ? "#fff" : th.accent) : th.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 900,
            flexShrink: 0,
            transition: "all .3s ease",
            transform: showOrdersSection ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {showOrdersSection ? "−" : "+"}
        </div>
      </button>

      {showOrdersSection && (
        <div style={{ animation: "cardIn .3s ease both" }}>
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
            onOpenStarsInvoice={onOpenStarsInvoice}
            onOpenTelegram={onOpenTelegram}
            onOpenPaymentDetails={() => setPaymentDetailsOpen(true)}
          />
        </div>
      )}

      {paymentDetailsOpen && (
        <PaymentDetailsModal
          onClose={() => setPaymentDetailsOpen(false)}
          onRequestDetails={(country) => onRequestPaymentDetails?.(country)}
          lang={lang}
        />
      )}

      {/* ─── STATS GRID ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="profile-hover-card"
            style={{
              background: "linear-gradient(180deg, rgba(13,15,26,.85) 0%, rgba(8,9,20,.90) 100%)",
              border: `1px solid ${stat.color}15`,
              borderRadius: 24, padding: "20px 18px",
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: "0 8px 24px rgba(3,4,8,.18), inset 0 1px 0 rgba(255,255,255,.03)",
              transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
              position: "relative", overflow: "hidden"
            }}
            onMouseEnter={isMobilePerf ? undefined : e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = `${stat.color}35`; e.currentTarget.style.boxShadow = `0 12px 30px ${stat.color}10, inset 0 1px 0 rgba(255,255,255,.05)`; }}
            onMouseLeave={isMobilePerf ? undefined : e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${stat.color}15`; e.currentTarget.style.boxShadow = "0 8px 30px rgba(3,4,8,.35), inset 0 1px 0 rgba(255,255,255,.03)"; }}
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
              <SystemIcon name={stat.icon} size={22} color={stat.color} animated />
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
        onMouseEnter={isMobilePerf ? undefined : e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={isMobilePerf ? undefined : e => { e.currentTarget.style.transform = "translateY(0)"; }}
        onTouchStart={isMobilePerf ? undefined : e => e.currentTarget.style.transform = "scale(0.98)"}
        onTouchEnd={isMobilePerf ? undefined : e => e.currentTarget.style.transform = "scale(1)"}
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
            <SystemIcon name="gift" size={24} color="#fff" animated />
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
            <SystemIcon name="trophy" size={24} color="#fff" animated />
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
                  <div><SystemIcon name={category.icon} size={18} color={th.text} animated /></div>
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
                                : "Секретное достижение"
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
                          {unlocked && <div style={{ fontSize: 14, color: th.accent, marginTop: 4 }}>✓</div>}
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







