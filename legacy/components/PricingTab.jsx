import React, { useEffect, useMemo, useState } from "react";
import SystemIcon from "./SystemIcon";

const DS = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  emerald: "#10b981",
  gold: "#f59e0b",
  red: "#ef4444",
  text: "rgba(224,231,255,0.95)",
  sub: "rgba(100,116,139,0.80)",
  card: "rgba(13,15,26,0.80)",
  surface: "rgba(8,9,18,0.70)",
  border: "rgba(99,102,241,0.14)",
};

function moneyUsd(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function roundToPrice(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function ServiceCard({ svc, qty, onAdd, onSub, onExamples, lang, th, isFullPack = false }) {
  const isSelected = qty > 0;
  const getSvcName = (s) => s?.[lang] || s?.en || s?.ru || "";
  const getSvcDesc = (s) => (lang === "en" ? s?.descEn : s?.descRu) || "";
  const [hovered, setHovered] = useState(false);
  const isMobilePerf = typeof document !== "undefined" && document.documentElement.dataset.rsMobile === "true";
  const ui = th || {
    text: DS.text,
    sub: DS.sub,
    card: DS.card,
    surface: DS.surface,
    border: DS.border,
    accent: DS.indigo,
    accentB: DS.violet,
    btnTxt: "#fff",
  };
  const effectiveHovered = !isMobilePerf && hovered;

  return (
    <div
      className="pricing-service-card"
      onMouseEnter={() => !isMobilePerf && setHovered(true)}
      onMouseLeave={() => !isMobilePerf && setHovered(false)}
      style={{
        position: "relative",
        borderRadius: isFullPack ? 26 : 22,
        border: isFullPack
          ? `1px solid ${effectiveHovered ? "rgba(245,158,11,0.5)" : "rgba(245,158,11,0.35)"}`
          : `1px solid ${isSelected ? `${ui.accentB}66` : effectiveHovered ? `${ui.accent}3d` : ui.border}`,
        background: isFullPack
          ? "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(139,92,246,0.08) 100%)"
          : isSelected
            ? `linear-gradient(135deg, ${ui.accent}20 0%, ${ui.surface} 100%)`
            : `linear-gradient(180deg, ${ui.card} 0%, ${ui.surface} 100%)`,
        padding: isFullPack ? "20px 18px" : "16px 14px",
        boxShadow: isFullPack
          ? `0 ${effectiveHovered ? "12px 40px" : "8px 32px"} rgba(245,158,11,${effectiveHovered ? 0.25 : 0.15}), inset 0 1px 0 rgba(255,255,255,0.08)`
          : isSelected
            ? `0 8px 24px ${ui.accent}30, inset 0 1px 0 rgba(255,255,255,0.05)`
            : effectiveHovered
              ? "0 8px 24px rgba(3,4,8,0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 4px 16px rgba(3,4,8,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: isMobilePerf ? "transform .14s ease, border-color .14s ease, background .14s ease" : "all .3s cubic-bezier(.34,1.56,.64,1)",
        transform: effectiveHovered ? "translateY(-3px)" : "translateY(0)",
        gridColumn: isFullPack ? "1 / -1" : undefined,
        contentVisibility: "auto",
        containIntrinsicSize: isFullPack ? "260px" : "220px",
      }}
    >
      {isFullPack && (
        <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1.5, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.8), rgba(139,92,246,0.6), transparent)" }} />
      )}

      {isFullPack && (
        <div style={{ position: "absolute", top: -12, right: 18, padding: "4px 12px", borderRadius: 999, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", fontSize: 9, fontWeight: 900, letterSpacing: ".12em", fontFamily: "var(--font-micro)", boxShadow: "0 6px 16px rgba(245,158,11,0.5)" }}>
          BEST DEAL
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: isFullPack ? 14 : 10 }}>
        <div style={{ width: isFullPack ? 48 : 42, height: isFullPack ? 48 : 42, borderRadius: isFullPack ? 16 : 14, background: isFullPack ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(139,92,246,0.20))" : isSelected ? `linear-gradient(135deg, ${ui.accent}30, ${ui.accentB}20)` : `${ui.accent}14`, border: isFullPack ? "1px solid rgba(245,158,11,0.35)" : `1px solid ${isSelected ? `${ui.accent}66` : ui.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isFullPack ? 22 : 18, flexShrink: 0 }}>
          {svc.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexWrap: "wrap" }}>
            <div style={{ fontSize: isFullPack ? 15 : 13.5, fontWeight: 900, color: ui.text, letterSpacing: "-.02em" }}>{getSvcName(svc)}</div>
            <div style={{ padding: "3px 9px", borderRadius: 999, background: isFullPack ? "linear-gradient(135deg, rgba(245,158,11,0.20), rgba(139,92,246,0.15))" : `${ui.accent}18`, border: isFullPack ? "1px solid rgba(245,158,11,0.30)" : `1px solid ${ui.accent}55`, fontSize: 11, fontWeight: 900, fontFamily: "var(--font-number)", color: isFullPack ? "#fcd34d" : ui.text }}>
              ${svc.priceUSD}
            </div>
          </div>

          <div style={{ fontSize: 11, color: isSelected ? ui.text : ui.sub, lineHeight: 1.5, marginTop: 4 }}>{getSvcDesc(svc)}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {(svc.features || []).map((feature, i) => (
          <span key={`${svc.id}_feature_${i}`} style={{ fontSize: 9.5, fontWeight: 700, color: isFullPack ? "rgba(252,211,77,0.9)" : isSelected ? ui.text : ui.sub, padding: "4px 10px", borderRadius: 999, background: isFullPack ? "rgba(245,158,11,0.12)" : isSelected ? `${ui.accent}18` : `${ui.accent}10`, border: isFullPack ? "1px solid rgba(245,158,11,0.25)" : `1px solid ${isSelected ? `${ui.accent}44` : `${ui.accent}22`}` }}>
            {feature}
          </span>
        ))}
      </div>

      <div style={{ fontSize: 10, color: ui.sub, marginBottom: 12 }}>{lang === "en" ? svc.timeEn : svc.timeRu}</div>

      <div className="pricing-service-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onExamples} style={{ padding: "10px 14px", borderRadius: 12, background: effectiveHovered ? `${ui.accent}16` : `${ui.accent}10`, border: `1px solid ${effectiveHovered ? `${ui.accent}55` : `${ui.accent}22`}`, color: ui.text, fontSize: 10.5, fontWeight: 800, cursor: "pointer", flex: 1 }}>
          {lang === "en" ? "Examples" : "Примеры"}
        </button>

        <div className="pricing-service-stepper" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={onSub} disabled={qty === 0} style={{ width: 34, height: 34, borderRadius: 10, border: qty === 0 ? `1px solid ${ui.accent}18` : `1px solid ${ui.accent}55`, background: qty === 0 ? `${ui.accent}0f` : `${ui.accent}18`, color: qty === 0 ? ui.sub : ui.text, fontSize: 18, fontWeight: 900, cursor: qty === 0 ? "not-allowed" : "pointer" }}>−</button>
          <div style={{ width: 32, textAlign: "center", fontSize: 16, fontWeight: 900, fontFamily: "var(--font-number)", color: isSelected ? ui.text : ui.sub, background: isSelected ? `${ui.accent}18` : `${ui.accent}0f`, borderRadius: 10, padding: "7px 0", border: isSelected ? `1px solid ${ui.accent}44` : `1px solid ${ui.accent}18` }}>{qty}</div>
          <button onClick={onAdd} style={{ width: 34, height: 34, borderRadius: 10, background: isFullPack ? "linear-gradient(135deg, #f59e0b, #d97706)" : `linear-gradient(135deg, ${ui.accent}, ${ui.accentB})`, color: th?.btnTxt || "#fff", border: "1px solid rgba(255,255,255,0.15)", fontSize: 18, fontWeight: 900, cursor: "pointer" }}>+</button>
        </div>
      </div>
    </div>
  );
}

export default function PricingTab({
  th,
  t,
  lang,
  cart = [],
  addToCart,
  removeFromCart,
  updateQty: updateCartQty,
  clearCart,
  showToast,
  onUnlockAchieve,
  setTab,
  walletBalance = 0,
  createCheckoutOrder,
  openCryptoBot,
  openStarsInvoice,
  openOrderTelegram,
}) {
  const g = (typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {};
  const {
    LANGS = {},
    PROMO_CODES = {},
    SERVICES = [],
    SFX = {},
    ls = { get: (_k, d) => d, set: () => {} },
    estimateStarsFromUsd = (value) => Math.max(1, Math.ceil(Number(value || 0) * 48)),
    getLocalPerStar = () => 0.84,
  } = g;
  const ui = th || {
    text: DS.text,
    sub: DS.sub,
    card: DS.card,
    surface: DS.surface,
    border: DS.border,
    accent: DS.indigo,
    accentB: DS.violet,
    btnTxt: "#fff",
  };
  const premiumSurface = th?.id === "graphite"
    ? "linear-gradient(135deg, #f3f4f6 0%, #d4d4d8 60%, #a1a1aa 100%)"
    : `linear-gradient(135deg, ${ui.accent} 0%, ${ui.accentB} 60%, ${ui.accent} 100%)`;
  const premiumOnSurface = th?.id === "graphite" ? "#111111" : "#ffffff";
  const premiumSub = th?.id === "graphite" ? "rgba(17,17,17,.68)" : "rgba(255,255,255,.72)";
  const L = LANGS[lang] || LANGS.ru || { cur: "$", rate: 1 };
  const regularServices = useMemo(() => SERVICES.filter((s) => s.key !== "pack"), [SERVICES]);
  const packService = useMemo(() => SERVICES.find((s) => s.key === "pack"), [SERVICES]);
  const fmt = (usd) => `${Math.round(usd * L.rate)} ${L.cur}`;
  const isEn = lang === "en";

  const copy = isEn ? {
    serviceTitle: "Services",
    priceRate: `Prices in ${L.cur} · $1 = ${L.rate} ${L.cur}`,
    urgencyNormal: "Normal",
    urgencyFast: "Fast",
    urgencyRush: "Rush",
    etaNormal: "3 days",
    etaFast: "1 day",
    etaRush: "3 hours",
    payable: "Total",
    orderBtn: "Create order",
    checkoutHint: "The order will be saved inside the profile with payment tracking and a mini-chat.",
    tariffTitle: "Level of detail",
    tariffHint: "Affects the final price",
    urgencyTitle: "Urgency",
    urgencyHint: "When do you need it?",
    deliveryTitle: "Delivery",
    paymentTitle: "Payment method",
    paymentHint: "Choose the flow that fits the client best",
    walletTitle: "Balance available",
    balanceLow: "Not enough balance for this order",
    briefTitle: "Short brief",
    briefHint: "Write the style, mood or references to start from.",
    briefPlaceholder: "For example: dark premium YouTube preview with clean typography and metallic accents.",
    paymentBalance: "Balance",
    paymentBalanceDesc: "Instant inside the app",
    paymentStars: "Telegram Stars",
    paymentStarsDesc: "Native Telegram checkout inside the mini app",
    paymentCrypto: "CryptoBot",
    paymentCryptoDesc: "Create a payment draft and finish in CryptoBot",
    paymentManual: "Manual",
    paymentManualDesc: "Ask for details in Telegram",
    promoTitle: "Course access code",
    promoHint: "Enter a code to unlock a premium course.",
    promoAlready: "Already activated",
    promoSaved: "Course unlocked",
    promoSuccessTitle: "Premium course unlocked!",
    promoOpenCourse: "Open course",
    orderCreated: "Order created in profile",
    orderBalance: "Order paid from balance",
    orderStars: "Stars checkout opened",
    orderPending: "Payment draft created",
    itemsLabel: "services",
    starsEstimate: "Estimated",
  } : {
    serviceTitle: "Услуги",
    priceRate: `Цены в ${L.cur} · $1 = ${L.rate} ${L.cur}`,
    urgencyNormal: "Обычно",
    urgencyFast: "Быстро",
    urgencyRush: "Срочно",
    etaNormal: "3 дня",
    etaFast: "1 день",
    etaRush: "3 часа",
    payable: "Итого",
    orderBtn: "Создать заказ",
    checkoutHint: "Заказ сохранится в профиле с трекингом оплаты, статуса и мини-чатом.",
    tariffTitle: "Детализация",
    tariffHint: "Влияет на финальную цену",
    urgencyTitle: "Срочность",
    urgencyHint: "Как быстро нужно сделать?",
    deliveryTitle: "Срок",
    paymentTitle: "Способ оплаты",
    paymentHint: "Выбери сценарий, который удобнее клиенту",
    walletTitle: "Доступно на балансе",
    balanceLow: "На балансе не хватает средств для этого заказа",
    briefTitle: "Короткий бриф",
    briefHint: "Напиши стиль, настроение или референсы, от которых стартуем.",
    briefPlaceholder: "Например: темное премиальное YouTube preview с чистой типографикой и металлическими акцентами.",
    paymentBalance: "Баланс",
    paymentBalanceDesc: "Моментально внутри приложения",
    paymentStars: "Telegram Stars",
    paymentStarsDesc: "Нативная оплата прямо внутри mini app",
    paymentCrypto: "CryptoBot",
    paymentCryptoDesc: "Создать черновик оплаты и завершить в CryptoBot",
    paymentManual: "Вручную",
    paymentManualDesc: "Запросить реквизиты в Telegram",
    promoTitle: "Код доступа к курсу",
    promoHint: "Введи код, чтобы открыть платный курс.",
    promoAlready: "Уже активирован",
    promoSaved: "Курс открыт",
    promoSuccessTitle: "Премиум-курс открыт!",
    promoOpenCourse: "Открыть курс",
    orderCreated: "Заказ создан в профиле",
    orderBalance: "Заказ оплачен с баланса",
    orderStars: "Окно оплаты Stars открыто",
    orderPending: "Черновик платежа создан",
    itemsLabel: "услуги",
    starsEstimate: "Оценка",
  };

  const [quantities, setQuantities] = useState(() => {
    const init = {};
    (cart || []).forEach((item) => {
      const svc = SERVICES.find((s) => s.id === item.id);
      if (svc && item.qty > 0) init[svc.key] = item.qty;
    });
    return init;
  });
  const [calcComplexity, setCalcComplexity] = useState("standard");
  const [calcUrgent, setCalcUrgent] = useState("normal");
  const [paymentMethod, setPaymentMethod] = useState(walletBalance > 0 ? "balance" : "stars");
  const [brief, setBrief] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromos, setAppliedPromos] = useState(() => ls.get("rs_applied_promos4", []));
  const [promoUnlock, setPromoUnlock] = useState(null);

  useEffect(() => {
    ls.set("rs_applied_promos4", appliedPromos);
  }, [appliedPromos, ls]);

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const getQty = (key) => quantities[key] || 0;
  const getSvcName = (svc) => svc?.[lang] || svc?.en || svc?.ru || "";
  const selectedServices = useMemo(() => SERVICES.filter((svc) => getQty(svc.key) > 0), [SERVICES, quantities]);

  const getTariffPrice = () => (calcComplexity === "plus" ? 10 : calcComplexity === "advanced" ? 15 : 7);
  const urgencyMult = calcUrgent === "normal" ? 1 : calcUrgent === "fast" ? 1.5 : 2;
  const getDelivery = () => (calcUrgent === "fast" ? copy.etaFast : calcUrgent === "urgent" ? copy.etaRush : copy.etaNormal);

  const summary = useMemo(() => {
    const subtotalUsd = roundToPrice(getTariffPrice() * urgencyMult * totalItems);
    return { subtotalUsd };
  }, [calcComplexity, urgencyMult, totalItems]);

  useEffect(() => {
    if (paymentMethod === "balance" && walletBalance < summary.subtotalUsd) {
      setPaymentMethod("stars");
    }
  }, [paymentMethod, summary.subtotalUsd, walletBalance]);
  const estimatedStars = useMemo(() => estimateStarsFromUsd(summary.subtotalUsd), [estimateStarsFromUsd, summary.subtotalUsd]);
  const localStarValue = useMemo(() => getLocalPerStar(L.code, LANGS), [L.code, LANGS, getLocalPerStar]);

  const updateQty = (svc, delta) => {
    SFX.tap?.();
    setQuantities((prev) => {
      const next = Math.max(0, (prev[svc.key] || 0) + delta);
      const updated = { ...prev, [svc.key]: next };
      if (next === 0) delete updated[svc.key];
      return updated;
    });
  };

  useEffect(() => {
    SERVICES.forEach((svc) => {
      const localQty = quantities[svc.key] || 0;
      const cartItem = (cart || []).find((i) => i.id === svc.id);
      const cartQty = cartItem?.qty || 0;
      if (localQty === cartQty) return;
      if (localQty <= 0) {
        if (cartQty > 0) removeFromCart?.(svc.id);
        return;
      }
      if (cartQty <= 0) {
        for (let i = 0; i < localQty; i += 1) addToCart?.(svc, getSvcName(svc));
        return;
      }
      updateCartQty?.(svc.id, localQty);
    });
  }, [quantities, cart, addToCart, removeFromCart, updateCartQty, lang, SERVICES]);

  useEffect(() => {
    if (totalItems >= 1) onUnlockAchieve?.("cart_order");
    if (totalItems >= 5) onUnlockAchieve?.("cart_full");
  }, [onUnlockAchieve, totalItems]);

  const openExamples = (svc) => {
    SFX.open?.();
    const categoryMap = {
      ru: { avatar: "Аватарки", preview: "Превью", banner: "Баннеры", logo: "Логотипы", pack: "Превью" },
      en: { avatar: "Avatars", preview: "Previews", banner: "Banners", logo: "Logos", pack: "Previews" },
    };
    const cat = (categoryMap[lang] || categoryMap.ru)[svc.key];
    setTimeout(() => {
      setTab("gallery");
      setTimeout(() => {
        const btn = document.querySelector(`[data-gallery-category="${cat}"]`);
        if (btn) {
          btn.click();
          setTimeout(() => btn.scrollIntoView({ behavior: "smooth", inline: "center" }), 80);
        }
      }, 260);
    }, 100);
  };

  const applyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    if (!code) return;
    const promo = PROMO_CODES[code];
    if (!promo) {
      SFX.error?.();
      showToast?.(t.promoError, "error");
      return;
    }
    if (appliedPromos.some((p) => p.code === code)) {
      SFX.error?.();
      showToast?.(copy.promoAlready, "error");
      return;
    }
    const payload = { code, courseId: promo.courseId, title: promo.title || code };
    ls.set("rs_course_access4", { ...(ls.get("rs_course_access4", {}) || {}), [promo.courseId]: true });
    ls.set("rs_pending_course_open4", promo.courseId);
    setAppliedPromos((prev) => [...prev, payload]);
    setPromoUnlock(payload);
    setPromoInput("");
    onUnlockAchieve?.("promo_hunter");
    SFX.promo?.();
    showToast?.(`${copy.promoSaved}: ${payload.title}`, "success");
  };

  const placeOrder = async () => {
    if (!totalItems || !createCheckoutOrder) return;

    const result = await createCheckoutOrder({
      items: selectedServices.map((svc) => ({
        id: svc.id,
        key: svc.key,
        name: getSvcName(svc),
        qty: getQty(svc.key),
        icon: svc.icon,
      })),
      totalUSD: summary.subtotalUsd,
      paymentMethod,
      brief,
      complexity: calcComplexity,
      urgency: calcUrgent,
      deliveryLabel: getDelivery(),
      bonusCourses: appliedPromos.map((promo) => promo.courseId),
    });

    if (!result || result.error === "empty") return;
    if (result.error === "insufficient_balance") {
      setPaymentMethod("stars");
      showToast?.(copy.balanceLow, "error");
      return;
    }

    if (paymentMethod === "stars") {
      openStarsInvoice?.(result.order);
      showToast?.(copy.orderStars, "success");
    } else if (paymentMethod === "cryptobot") {
      openCryptoBot?.(result.order);
      showToast?.(copy.orderPending, "success");
    } else if (paymentMethod === "manual") {
      openOrderTelegram?.(result.order, "payment");
      showToast?.(copy.orderCreated, "success");
    } else {
      showToast?.(copy.orderBalance, "success");
    }

    clearCart?.();
    setQuantities({});
    setBrief("");
    setTab("profile");
  };

  return (
    <>
      <style>{`
        @media (max-width: 390px) {
          .pricing-service-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .pricing-option-grid {
            grid-template-columns: 1fr !important;
          }
          .pricing-service-card {
            padding: 18px 16px !important;
          }
          .pricing-service-actions {
            gap: 8px !important;
          }
          .pricing-service-actions > button {
            min-height: 40px !important;
          }
          .pricing-service-stepper button,
          .pricing-service-stepper div {
            width: 38px !important;
            height: 38px !important;
            min-width: 38px !important;
          }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          borderRadius: 28,
          border: `1px solid ${ui.border}`,
          background: `linear-gradient(180deg, ${ui.card} 0%, ${ui.surface} 100%)`,
          boxShadow: "0 18px 42px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.04)",
          padding: "22px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 28%)", pointerEvents: "none" }} />
        <div className="type-micro" style={{ fontSize: 8.5, color: ui.sub, marginBottom: 10 }}>
          {lang === "en" ? "Pricing desk" : "Прайс-деск"}
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: ui.text, letterSpacing: "-.03em", lineHeight: 1.04 }}>{copy.serviceTitle}</div>
        <div style={{ fontSize: 13, color: ui.sub, marginTop: 8, lineHeight: 1.65, maxWidth: 420 }}>
          {copy.priceRate}. {lang === "en" ? "After checkout, the project goes straight into the order desk with payment and status tracking." : "После оформления проект сразу попадает в кабинет заказов с оплатой и трекингом статуса."}
        </div>
      </div>

      <div className="pricing-service-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {regularServices.map((svc) => (
          <ServiceCard
            key={svc.id}
            svc={svc}
            qty={getQty(svc.key)}
            onAdd={() => updateQty(svc, 1)}
            onSub={() => updateQty(svc, -1)}
            onExamples={() => openExamples(svc)}
            lang={lang}
            th={th}
          />
        ))}

        {packService && (
          <div style={{ gridColumn: "1 / -1" }}>
            <ServiceCard
              svc={packService}
              qty={getQty(packService.key)}
              onAdd={() => updateQty(packService, 1)}
              onSub={() => updateQty(packService, -1)}
              onExamples={() => openExamples(packService)}
              lang={lang}
              th={th}
              isFullPack
            />
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <>
          <div style={{ background: `linear-gradient(180deg, ${ui.card} 0%, ${ui.surface} 100%)`, borderRadius: 24, border: `1px solid ${ui.border}`, padding: 20, boxShadow: "0 10px 30px rgba(3,4,8,0.22)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: ui.text, marginBottom: 4 }}>{copy.tariffTitle}</div>
            <div style={{ fontSize: 11, color: ui.sub, marginBottom: 14, fontWeight: 600 }}>{copy.tariffHint}</div>
            <div className="pricing-option-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { id: "standard", name: "STANDARD", color: "#6b7280", price: "$7" },
                { id: "plus", name: "PLUS", color: "#6366f1", price: "$10" },
                { id: "advanced", name: "ADVANCED", color: "#8b5cf6", price: "$15" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    SFX.tap?.();
                    setCalcComplexity(item.id);
                  }}
                  style={{ padding: "16px 8px", borderRadius: 16, border: `2px solid ${calcComplexity === item.id ? item.color : ui.border}`, background: calcComplexity === item.id ? `${item.color}1A` : "rgba(255,255,255,.03)", color: calcComplexity === item.id ? item.color : ui.sub, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
                >
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".06em" }}>{item.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 900, fontFamily: "var(--font-number)" }}>{item.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: `linear-gradient(180deg, ${ui.card} 0%, ${ui.surface} 100%)`, borderRadius: 24, border: `1px solid ${ui.border}`, padding: 20, boxShadow: "0 10px 30px rgba(3,4,8,0.22)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: ui.text, marginBottom: 4 }}>{copy.urgencyTitle}</div>
            <div style={{ fontSize: 11, color: ui.sub, marginBottom: 14, fontWeight: 600 }}>{copy.urgencyHint}</div>
            <div className="pricing-option-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { id: "normal", name: copy.urgencyNormal, eta: copy.etaNormal, color: "#6b7280" },
                { id: "fast", name: copy.urgencyFast, eta: copy.etaFast, color: "#f59e0b" },
                { id: "urgent", name: copy.urgencyRush, eta: copy.etaRush, color: "#ef4444" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    SFX.tap?.();
                    setCalcUrgent(item.id);
                  }}
                  style={{ padding: "16px 8px", borderRadius: 16, border: `2px solid ${calcUrgent === item.id ? item.color : ui.border}`, background: calcUrgent === item.id ? `${item.color}16` : "rgba(255,255,255,.03)", color: calcUrgent === item.id ? item.color : ui.sub, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
                >
                  <span style={{ fontSize: 10, fontWeight: 900 }}>{item.name}</span>
                  <span style={{ fontSize: 11, opacity: 0.9, fontFamily: "var(--font-number)", fontWeight: 700 }}>{item.eta}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)", borderRadius: 20, border: "1px solid rgba(99,102,241,0.3)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "#818cf8", fontWeight: 800, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".12em" }}>{copy.deliveryTitle}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: ui.text }}>{getDelivery()}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: ui.text, fontFamily: "var(--font-number)", background: `${ui.accent}18`, padding: "6px 14px", borderRadius: 12, border: `1px solid ${ui.accent}44` }}>{fmt(summary.subtotalUsd)}</div>
          </div>

          <div style={{ background: `linear-gradient(180deg, ${ui.card} 0%, ${ui.surface} 100%)`, borderRadius: 24, border: `1px solid ${ui.border}`, padding: 20, boxShadow: "0 10px 30px rgba(3,4,8,0.22)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: ui.text }}>{copy.paymentTitle}</div>
                <div style={{ fontSize: 11, color: ui.sub, marginTop: 4 }}>{copy.paymentHint}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: ui.sub, textTransform: "uppercase", letterSpacing: ".1em" }}>{copy.walletTitle}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: walletBalance >= summary.subtotalUsd ? "#34d399" : "#fbbf24" }}>{moneyUsd(walletBalance)}</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {[
                { id: "balance", title: copy.paymentBalance, desc: copy.paymentBalanceDesc, disabled: walletBalance < summary.subtotalUsd },
                { id: "stars", title: copy.paymentStars, desc: `${copy.paymentStarsDesc} · ${estimatedStars} ★`, disabled: false },
                { id: "cryptobot", title: copy.paymentCrypto, desc: copy.paymentCryptoDesc, disabled: false },
                { id: "manual", title: copy.paymentManual, desc: copy.paymentManualDesc, disabled: false },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!item.disabled) {
                      SFX.tap?.();
                      setPaymentMethod(item.id);
                    }
                  }}
                  style={{ minHeight: 58, borderRadius: 18, border: `1px solid ${paymentMethod === item.id ? th.accent : item.disabled ? "rgba(255,255,255,.06)" : th.border}`, background: paymentMethod === item.id ? `${th.accent}14` : "rgba(255,255,255,.03)", color: item.disabled ? "rgba(148,163,184,.45)" : th.text, cursor: item.disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 16px", textAlign: "left" }}
                >
                  <div>
                      <div style={{ fontSize: 13, fontWeight: 900 }}>{item.title}</div>
                      <div style={{ fontSize: 11.5, color: item.disabled ? "rgba(148,163,184,.45)" : ui.sub, marginTop: 4 }}>{item.desc}</div>
                      {item.id === "stars" && (
                        <div style={{ fontSize: 10.5, color: ui.sub, marginTop: 6 }}>
                          {copy.starsEstimate}: 1 ★ ≈ {localStarValue} {L.cur}
                        </div>
                      )}
                      {item.id === "balance" && item.disabled && <div style={{ fontSize: 10.5, color: "#fbbf24", marginTop: 6 }}>{copy.balanceLow}</div>}
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${paymentMethod === item.id ? th.accent : item.disabled ? "rgba(255,255,255,.12)" : th.sub}`, background: paymentMethod === item.id ? th.accent : "transparent", flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: `linear-gradient(180deg, ${ui.card} 0%, ${ui.surface} 100%)`, borderRadius: 24, border: `1px solid ${ui.border}`, padding: 20, boxShadow: "0 10px 30px rgba(3,4,8,0.22)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: ui.text }}>{copy.briefTitle}</div>
            <div style={{ fontSize: 11, color: ui.sub, lineHeight: 1.55, marginTop: 4 }}>{copy.briefHint}</div>
            <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder={copy.briefPlaceholder} style={{ width: "100%", minHeight: 108, marginTop: 14, borderRadius: 18, border: `1px solid ${ui.border}`, background: "rgba(255,255,255,.03)", color: ui.text, padding: 16, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
          </div>

          <div style={{ background: premiumSurface, borderRadius: 30, padding: "26px 28px", boxShadow: `0 12px 40px ${ui.accent}45, inset 0 1px 0 rgba(255,255,255,0.15)`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(30px)", pointerEvents: "none" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, position: "relative", zIndex: 1, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, color: premiumSub, fontWeight: 800, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".12em" }}>{copy.payable}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: premiumOnSurface, letterSpacing: "-.03em", fontFamily: "var(--font-number)" }}>{fmt(summary.subtotalUsd)}</div>
                <div style={{ fontSize: 12, color: premiumSub, marginTop: 6, fontWeight: 600 }}>{totalItems} {copy.itemsLabel} · {getDelivery()} · {estimatedStars} ★</div>
              </div>
              <button onClick={placeOrder} style={{ padding: "16px 32px", borderRadius: 18, background: th?.id === "graphite" ? "rgba(17,17,17,0.94)" : "rgba(255,255,255,0.95)", color: th?.id === "graphite" ? "#ffffff" : "#111111", border: "none", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", flexShrink: 0 }}>{copy.orderBtn}</button>
            </div>
            <div style={{ position: "relative", zIndex: 1, marginTop: 18, fontSize: 11, color: premiumSub, lineHeight: 1.5, fontWeight: 600 }}>{copy.checkoutHint}</div>
          </div>
        </>
      )}

      <div style={{ background: `linear-gradient(180deg, ${ui.card} 0%, ${ui.surface} 100%)`, borderRadius: 24, border: `1px solid ${ui.border}`, padding: 20, boxShadow: "0 8px 30px rgba(3,4,8,0.22)" }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: ui.text, marginBottom: 4 }}>{copy.promoTitle}</div>
        <div style={{ fontSize: 11, color: ui.sub, lineHeight: 1.55, marginBottom: 16 }}>{copy.promoHint}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyPromo()} placeholder={t.promoPlaceholder} style={{ flex: 1, padding: "14px 16px", borderRadius: 14, border: `1px solid ${ui.border}`, background: "rgba(255,255,255,.03)", color: ui.text, fontSize: 13, outline: "none", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: ".08em" }} />
          <button onClick={applyPromo} style={{ padding: "14px 20px", borderRadius: 14, background: `linear-gradient(135deg, ${ui.accent}, ${ui.accentB})`, color: th?.btnTxt || "#fff", border: "1px solid rgba(255,255,255,0.1)", fontSize: 13, fontWeight: 900, cursor: "pointer", boxShadow: `0 6px 20px ${ui.accent}45`, flexShrink: 0 }}>{t.promoApply}</button>
        </div>
        {appliedPromos.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {appliedPromos.map((item) => (
              <span key={item.code} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.15)", color: "#34d399", fontSize: 10.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}><SystemIcon name="check" size={12} color="#34d399" animated /> {item.title}</span>
            ))}
          </div>
        )}
      </div>

      {promoUnlock && (
        <div onClick={() => setPromoUnlock(null)} style={{ position: "fixed", inset: 0, zIndex: 9800, background: "rgba(2,3,7,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(420px, calc(100vw - 32px))", borderRadius: 32, border: "1px solid rgba(99,102,241,0.35)", background: "linear-gradient(180deg, rgba(13,15,26,0.97) 0%, rgba(8,9,20,1) 100%)", boxShadow: "0 30px 100px rgba(3,4,8,0.7), 0 0 50px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.06)", padding: 32, textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 24, margin: "0 auto 20px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><SystemIcon name="check" size={32} color="#fff" animated /></div>
            <div style={{ fontSize: 24, fontWeight: 900, color: ui.text, lineHeight: 1.15, marginBottom: 10, letterSpacing: "-.02em" }}>{copy.promoSuccessTitle}</div>
            <div style={{ fontSize: 13.5, color: ui.sub, lineHeight: 1.6, marginBottom: 20, fontWeight: 600 }}>{promoUnlock.title}</div>
            <div style={{ padding: "12px 16px", borderRadius: 16, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 13, color: "#c7d2fe", fontWeight: 900, marginBottom: 24, letterSpacing: ".1em" }}>{promoUnlock.code}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { SFX.tap?.(); setPromoUnlock(null); }} style={{ flex: 1, height: 50, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: ui.text, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>OK</button>
              <button onClick={() => { SFX.tap?.(); ls.set("rs_pending_course_open4", promoUnlock.courseId); setPromoUnlock(null); setTab("courses"); }} style={{ flex: 1.5, height: 50, borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", background: `linear-gradient(135deg, ${ui.accent}, ${ui.accentB})`, color: th?.btnTxt || "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: `0 6px 20px ${ui.accent}45` }}>{copy.promoOpenCourse}</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}


