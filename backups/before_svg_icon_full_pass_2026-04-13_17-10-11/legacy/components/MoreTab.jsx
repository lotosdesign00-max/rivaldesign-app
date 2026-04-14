import React, { useState, useMemo, useCallback } from "react";
import SystemIcon from "./SystemIcon";

const DS = {
  card: "rgba(13,15,26,.82)",
  border: "rgba(99,102,241,.14)",
  accent: "#6366f1",
  accentB: "#8b5cf6",
  text: "rgba(224,231,255,.93)",
  sub: "rgba(100,116,139,.72)",
  surface: "rgba(8,9,20,.90)",
};

function MoreTab({ th, t, lang, showToast, streak, onUnlockAchieve, addXPfn }) {
  const g = (typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {};
  const { SFX, openTg, ls, FAQ_DATA, REVIEWS } = g;
  const safeLs = ls || { get: (_k, d) => d, set: () => {} };
  const [section, setSection] = useState("about");
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [likes, setLikes] = useState(() => safeLs.get("rs_likes4", {}));
  const [reviewSearch, setReviewSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [copyHint, setCopyHint] = useState(null);

  const faqSource = FAQ_DATA || { ru: [] };
  const faq = faqSource[lang] || faqSource.ru || [];

  const filteredReviews = useMemo(
    () =>
      (REVIEWS || []).filter(
        (r) =>
          (ratingFilter === 0 || r.rating === ratingFilter) &&
          (reviewSearch === "" ||
            r.name.toLowerCase().includes(reviewSearch.toLowerCase()) ||
            r.text.toLowerCase().includes(reviewSearch.toLowerCase()))
      ),
    [reviewSearch, ratingFilter, REVIEWS]
  );

  const likeReview = useCallback((id) => {
    SFX?.like?.();
    setLikes((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 };
      safeLs.set("rs_likes4", next);
      return next;
    });
  }, [SFX, safeLs]);

  const avgRating = ((REVIEWS || []).reduce((sum, r) => sum + r.rating, 0) / ((REVIEWS || []).length || 1)).toFixed(1);
  const totalReviews = (REVIEWS || []).length;

  const sections = [
    { id: "about",   label: lang === "en" ? "About"   : "О нас",   icon: "about" },
    { id: "reviews", label: lang === "en" ? "Reviews" : "Отзывы",  icon: "reviews" },
    { id: "faq",     label: lang === "en" ? "FAQ"     : "FAQ",      icon: "faq" },
  ];

  const tools = [
    { short: "Ps", title: "Photoshop",    color: "#31a8ff", sub: lang === "en" ? "Key visuals & covers"  : "Кей-визуал и обложки" },
    { short: "Ae", title: "After Effects", color: "#9999ff", sub: lang === "en" ? "Motion & animation"   : "Моушн и анимация" },
    { short: "Bl", title: "Blender",      color: "#e87d0d", sub: lang === "en" ? "3D forms & depth"      : "3D-глубина и формы" },
  ];

  const directions = [
    { icon: "avatar", title: lang === "en" ? "Avatars"       : "Аватарки",       sub: lang === "en" ? "Profile identity, signature mood."  : "Визуальный образ и настроение." },
    { icon: "preview", title: lang === "en" ? "Previews"      : "Превью",          sub: lang === "en" ? "YouTube & Twitch visuals."          : "YouTube и Twitch-визуал." },
    { icon: "banner", title: lang === "en" ? "Banners"       : "Баннеры",         sub: lang === "en" ? "Channel headers & promos."          : "Шапки канала и промо." },
    { icon: "visual", title: lang === "en" ? "Visual Systems": "Визуал-системы",  sub: lang === "en" ? "Consistent content set."            : "Системный набор визуала." },
    { icon: "promo", title: lang === "en" ? "Promo"         : "Промо",           sub: lang === "en" ? "Launch & campaign graphics."        : "Анонсы и запуск." },
    { icon: "custom", title: lang === "en" ? "Custom"        : "Нестандарт",      sub: lang === "en" ? "Tailored to your niche."            : "Под твою нишу." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <style>{`
        @keyframes moreIn { from { opacity:0; transform:translateY(14px) scale(.97); } to { opacity:1; transform:none; } }
        @keyframes moreSlideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:none; } }
        @keyframes likeHeart { 0%{transform:scale(1)} 40%{transform:scale(1.5)} 70%{transform:scale(0.9)} 100%{transform:scale(1)} }
        @keyframes reviewCopyFade { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-12px)} }
        .more-sec-btn { transition: all .22s cubic-bezier(.34,1.56,.64,1) !important; }
        .more-sec-btn:active { transform: scale(0.94) !important; }
        .more-cta-btn { transition: all .18s cubic-bezier(.34,1.56,.64,1) !important; }
        .more-cta-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 28px rgba(99,102,241,.5) !important; }
        .more-cta-btn:active { transform: scale(0.96) !important; }
        .more-tool-card { transition: all .22s ease !important; }
        .more-tool-card:hover { transform: translateY(-2px) !important; border-color: rgba(99,102,241,.25) !important; }
        .more-dir-row { transition: all .18s ease !important; }
        .more-dir-row:hover { background: rgba(99,102,241,.06) !important; padding-inline: 10px !important; border-radius: 12px !important; }
        .more-review-card { transition: border-color .2s ease, box-shadow .2s ease !important; }
        .more-review-card:hover { border-color: rgba(99,102,241,.22) !important; box-shadow: 0 10px 28px rgba(3,4,8,.35) !important; }
        .more-like-btn { transition: all .18s cubic-bezier(.34,1.56,.64,1) !important; }
        .more-like-btn.liked { animation: likeHeart .35s ease !important; }
        .more-like-btn:hover { transform: scale(1.08) !important; }
        .more-tg-btn { transition: all .18s ease !important; }
        .more-tg-btn:hover { background: rgba(99,102,241,.22) !important; }
        .more-faq-tile { transition: all .22s cubic-bezier(.34,1.56,.64,1) !important; }
        .more-faq-tile:hover { transform: translateY(-2px) !important; }
        .more-faq-tile:active { transform: scale(0.97) !important; }
        .review-search-input:focus { border-color: rgba(99,102,241,.45) !important; background: rgba(18,20,36,.9) !important; }
        .more-rating-pill { transition: all .18s ease !important; }
        .more-rating-pill:active { transform: scale(0.94) !important; }
      `}</style>

      {/* ── SECTION TABS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {sections.map(({ id, label, icon }, i) => {
          const active = section === id;
          return (
            <button
              key={id}
              className="more-sec-btn"
              onClick={() => { setSection(id); SFX?.tab?.(); }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                padding: "12px 6px", borderRadius: 18,
                border: `1px solid ${active ? "rgba(99,102,241,.5)" : "rgba(99,102,241,.12)"}`,
                background: active
                  ? "linear-gradient(135deg, rgba(99,102,241,.22), rgba(139,92,246,.14))"
                  : "rgba(8,9,20,.62)",
                cursor: "pointer",
                boxShadow: active
                  ? "0 6px 22px rgba(99,102,241,.26), inset 0 1px 0 rgba(255,255,255,.06)"
                  : "0 2px 8px rgba(3,4,8,.2)",
                animation: `moreIn .35s ease ${i * .06}s both`,
              }}
            >
              <span style={{
                fontSize: 19, transition: "transform .2s ease",
                color: active ? "#c7d2fe" : "rgba(100,116,139,.6)",
                transform: active ? "scale(1.1)" : "scale(1)",
              }}>{/*icon*/}<SystemIcon name={icon} size={18} color={active ? "#c7d2fe" : "rgba(100,116,139,.7)"} animated={active} /></span>
              <span style={{
                fontSize: 9.5, fontWeight: 800,
                color: active ? "#c7d2fe" : "rgba(100,116,139,.65)",
                letterSpacing: ".04em", textTransform: "uppercase",
              }}>{label}</span>
              {active && (
                <div style={{
                  width: 16, height: 2, borderRadius: 999,
                  background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 6px rgba(99,102,241,.5)",
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════ ABOUT ══════════════════ */}
      {section === "about" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "moreIn .35s ease both" }}>

          {/* Author hero card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(13,15,26,.97) 0%, rgba(8,9,20,1) 100%)",
            borderRadius: 26, border: "1px solid rgba(99,102,241,.22)", padding: "24px 20px",
            position: "relative", overflow: "hidden",
            boxShadow: "0 20px 50px rgba(3,4,8,.5), inset 0 1px 0 rgba(255,255,255,.05)",
          }}>
            {/* BG glows */}
            <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.2) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, left: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,.7), transparent)", pointerEvents: "none" }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 11px",
              borderRadius: 999, background: "rgba(99,102,241,.14)", border: "1px solid rgba(99,102,241,.28)",
              marginBottom: 16, fontSize: 9, fontWeight: 900, color: "#818cf8",
              letterSpacing: ".14em", textTransform: "uppercase",
            }}>
              <SystemIcon name="visual" size={12} color="#818cf8" animated /> {lang === "en" ? "Graphic Designer" : "Графический дизайнер"}
            </div>

            {/* Name + handle */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
              <div style={{
                fontSize: 38, fontWeight: 900,
                background: "linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 60%, #818cf8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", letterSpacing: "-.04em", lineHeight: 1.05,
              }}>Rival</div>
              <div style={{
                fontSize: 13, color: "rgba(99,102,241,.9)", fontWeight: 700,
                background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)",
                borderRadius: 8, padding: "2px 8px",
              }}>@Rivaldsg</div>
            </div>

            <div style={{ fontSize: 13.5, color: DS.sub, lineHeight: 1.8, maxWidth: 460, marginBottom: 20, position: "relative", zIndex: 1 }}>
              {lang === "en"
                ? "Premium visuals for creators, streamers and brands. Clear direction, clean execution and a result that feels expensive without noise."
                : "Премиальный визуал для креаторов, стримеров и брендов. Чёткое направление, чистая подача и результат, который ощущается дорого без лишнего шума."}
            </div>

            {/* Stats row */}
            <div style={{
              display: "flex", gap: 10, marginBottom: 20,
              padding: "12px 14px", borderRadius: 16,
              background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.14)",
            }}>
              {[
                { v: "50+",  l: lang === "en" ? "Projects" : "Проектов" },
                { v: "19+",  l: lang === "en" ? "Clients"  : "Клиентов" },
                { v: "5.0★", l: lang === "en" ? "Rating"   : "Рейтинг" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    fontSize: 18, fontWeight: 900, letterSpacing: "-.02em",
                    background: "linear-gradient(135deg, #c7d2fe, #818cf8)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>{s.v}</div>
                  <div style={{ fontSize: 9.5, color: "rgba(100,116,139,.7)", marginTop: 2, fontWeight: 600, letterSpacing: ".04em" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* CTA btn */}
            <button
              className="more-cta-btn"
              onClick={() => { SFX?.order?.(); openTg?.("Rivaldsg", ""); }}
              style={{
                padding: "13px 24px", borderRadius: 16,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#fff", border: "none", fontSize: 13, fontWeight: 900, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(99,102,241,.45), inset 0 1px 0 rgba(255,255,255,.15)",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <SystemIcon name="telegram" size={15} color="#fff" animated />
              {lang === "en" ? "Write in Telegram" : "Написать в Telegram"}
            </button>
          </div>

          {/* Tools */}
          <div style={{
            background: DS.card, borderRadius: 24,
            border: "1px solid rgba(99,102,241,.12)", padding: 16,
            boxShadow: "0 8px 28px rgba(3,4,8,.25), inset 0 1px 0 rgba(255,255,255,.03)",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 900, color: "#818cf8",
              letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <SystemIcon name="tools" size={12} color="#818cf8" animated /> {lang === "en" ? "Tools" : "Инструменты"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
              {tools.map((tool) => (
                <div key={tool.title} className="more-tool-card" style={{
                  minHeight: 110, borderRadius: 18, padding: 12,
                  border: "1px solid rgba(99,102,241,.11)",
                  background: "linear-gradient(180deg, rgba(13,15,26,.88) 0%, rgba(8,9,20,.92) 100%)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.03), 0 4px 16px rgba(3,4,8,.2)",
                  cursor: "default",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 13,
                    background: `${tool.color}1A`, border: `1px solid ${tool.color}38`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 900, color: tool.color,
                    boxShadow: `0 4px 14px ${tool.color}22`,
                  }}>{tool.short}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: DS.text, marginBottom: 3 }}>{tool.title}</div>
                    <div style={{ fontSize: 10.5, color: DS.sub, lineHeight: 1.5 }}>{tool.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directions */}
          <div style={{
            background: DS.card, borderRadius: 22,
            border: "1px solid rgba(99,102,241,.12)", padding: 16,
            boxShadow: "0 8px 24px rgba(3,4,8,.22)",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 900, color: "#818cf8",
              letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <SystemIcon name="custom" size={12} color="#818cf8" animated /> {lang === "en" ? "Main directions" : "Направления"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {directions.map((item, i) => (
                <div key={item.title} className="more-dir-row" style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 6px",
                  borderBottom: i < directions.length - 1 ? "1px solid rgba(99,102,241,.07)" : "none",
                  transition: "all .18s ease",
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 11, flexShrink: 0,
                    background: "rgba(99,102,241,.10)", border: "1px solid rgba(99,102,241,.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, color: "#818cf8",
                  }}><SystemIcon name={item.icon} size={15} color="#818cf8" animated /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: DS.text, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 11.5, color: DS.sub, lineHeight: 1.55 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ REVIEWS ══════════════════ */}
      {section === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "moreIn .35s ease both" }}>

          {/* Rating hero */}
          <div style={{
            background: "linear-gradient(135deg, rgba(13,15,26,.94) 0%, rgba(8,9,20,.98) 100%)",
            borderRadius: 24, border: "1px solid rgba(99,102,241,.22)", padding: "18px 20px",
            position: "relative", overflow: "hidden",
            boxShadow: "0 16px 40px rgba(3,4,8,.4), inset 0 1px 0 rgba(255,255,255,.04)",
          }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,.6), transparent)" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{
                  fontSize: 22, fontWeight: 900, color: DS.text, marginBottom: 5,
                  background: "linear-gradient(135deg, #e0e7ff, #a5b4fc)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{t.reviewsTitle || "Отзывы"}</div>
                <div style={{ fontSize: 12, color: DS.sub, fontWeight: 600 }}>
                  {totalReviews} {lang === "en" ? "verified reviews" : "проверенных отзывов"}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  {[5, 4].map(n => (
                    <div key={n} style={{
                      display: "flex", alignItems: "center", gap: 4,
                      background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.15)",
                      borderRadius: 8, padding: "3px 8px",
                    }}>
                      <span style={{ fontSize: 11, color: "#fbbf24" }}>{"★".repeat(n)}</span>
                      <span style={{ fontSize: 10, color: DS.sub, fontWeight: 600 }}>
                        {(REVIEWS || []).filter(r => r.rating === n).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: 46, fontWeight: 900, lineHeight: 1, letterSpacing: "-.03em",
                  background: "linear-gradient(135deg, #c7d2fe, #818cf8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{avgRating}</div>
                <div style={{ fontSize: 18, color: "#fbbf24", marginTop: 4, letterSpacing: "2px" }}>★★★★★</div>
                <div style={{ fontSize: 9.5, color: DS.sub, marginTop: 3 }}>из 5.0</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(99,102,241,.5)", pointerEvents: "none" }}><SystemIcon name="search" size={14} color="rgba(99,102,241,.5)" animated /></span>
            <input
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              placeholder={t.reviewSearch || "Поиск по отзывам..."}
              className="review-search-input"
              style={{
                width: "100%", padding: "12px 16px 12px 38px", borderRadius: 14,
                border: "1px solid rgba(99,102,241,.16)", background: "rgba(13,15,26,.75)",
                color: DS.text, fontSize: 13, outline: "none", fontFamily: "inherit",
                boxSizing: "border-box", backdropFilter: "blur(10px)",
                transition: "border-color .2s ease, background .2s ease",
              }}
            />
          </div>

          {/* Rating filter */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
            {[0, 5, 4, 3].map((rating) => (
              <button key={rating}
                onClick={() => { setRatingFilter(rating); SFX?.filter?.(); }}
                className="more-rating-pill"
                style={{
                  whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 999,
                  fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                  background: ratingFilter === rating
                    ? "linear-gradient(135deg, rgba(99,102,241,.25), rgba(139,92,246,.2))"
                    : "rgba(13,15,26,.65)",
                  color: ratingFilter === rating ? "#c7d2fe" : DS.sub,
                  border: `1px solid ${ratingFilter === rating ? "rgba(99,102,241,.45)" : "rgba(99,102,241,.12)"}`,
                  boxShadow: ratingFilter === rating ? "0 2px 10px rgba(99,102,241,.2)" : "none",
                }}
              >
                {rating === 0 ? (t.allRatings || "Все") : "★".repeat(rating)}
              </button>
            ))}
          </div>

          {/* Review cards */}
          {filteredReviews.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: DS.sub, animation: "moreIn .35s ease" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><SystemIcon name="search" size={30} color="rgba(99,102,241,.7)" animated /></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: DS.text }}>
                {lang === "en" ? "No reviews found" : "Отзывы не найдены"}
              </div>
            </div>
          )}
          {filteredReviews.map((review, index) => {
            const likeCount = likes[review.id] || 0;
            const isExpanded = expanded === review.id;
            const liked = likeCount > 0;
            const isHov = hovered === review.id;
            return (
              <div key={review.id} className="more-review-card"
                onMouseEnter={() => setHovered(review.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: DS.card, borderRadius: 22,
                  border: `1px solid ${isHov ? "rgba(99,102,241,.22)" : "rgba(99,102,241,.12)"}`,
                  padding: "16px", backdropFilter: "blur(12px)",
                  animation: `moreIn .35s ease ${index * .045}s both`,
                  boxShadow: isHov
                    ? "0 10px 30px rgba(3,4,8,.35), inset 0 1px 0 rgba(255,255,255,.04)"
                    : "0 4px 18px rgba(3,4,8,.22), inset 0 1px 0 rgba(255,255,255,.03)",
                  position: "relative",
                }}>
                <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,.2), transparent)", opacity: isHov ? 1 : 0, transition: "opacity .2s ease" }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                    background: `linear-gradient(135deg, hsl(${review.name.charCodeAt(0) * 7 % 360}, 60%, 45%), hsl(${review.name.charCodeAt(0) * 13 % 360}, 70%, 35%))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 19, fontWeight: 900, color: "#fff",
                    boxShadow: "0 4px 14px rgba(99,102,241,.25)",
                    border: "1px solid rgba(255,255,255,.08)",
                  }}>{review.name[0]}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: DS.text }}>{review.name}</span>
                      {review.verified && (
                        <span style={{
                          fontSize: 8.5, background: "rgba(16,185,129,.14)", color: "#10b981",
                          fontWeight: 800, padding: "1px 7px", borderRadius: 999,
                          border: "1px solid rgba(16,185,129,.3)",
                          display: "flex", alignItems: "center", gap: 3,
                        }}>✓ verified</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#818cf8", marginTop: 1 }}>@{review.tg}</div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: "#fbbf24", letterSpacing: ".5px" }}>{"★".repeat(review.rating)}</div>
                    <div style={{ fontSize: 9.5, color: DS.sub, marginTop: 2 }}>{review.time}</div>
                  </div>
                </div>

                <p
                  onClick={() => setExpanded(isExpanded ? null : review.id)}
                  style={{
                    fontSize: 13, color: DS.sub, lineHeight: 1.75, margin: "0 0 12px",
                    cursor: "pointer", display: "-webkit-box",
                    WebkitLineClamp: isExpanded ? 100 : 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                    transition: "all .2s ease",
                    fontStyle: "italic", position: "relative",
                  }}
                >"{review.text}"</p>

                {!isExpanded && review.text.length > 120 && (
                  <div style={{ fontSize: 10.5, color: "rgba(99,102,241,.7)", fontWeight: 700, marginBottom: 10, cursor: "pointer" }}
                    onClick={() => setExpanded(review.id)}>
                    {lang === "en" ? "Read more →" : "Читать →"}
                  </div>
                )}

                <div style={{ display: "flex", gap: 7 }}>
                  <button
                    className="more-tg-btn"
                    onClick={() => { window.open(`https://t.me/${review.tg}`, "_blank"); SFX?.tap?.(); }}
                    style={{
                      fontSize: 11, color: "#c7d2fe",
                      background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.25)",
                      borderRadius: 10, padding: "6px 13px", cursor: "pointer", fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 5,
                    }}
                  ><SystemIcon name="telegram" size={12} color="#c7d2fe" animated /> TG</button>
                  <button
                    className={`more-like-btn ${liked ? "liked" : ""}`}
                    onClick={() => likeReview(review.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 11, fontWeight: 700, cursor: "pointer",
                      color: liked ? "#c7d2fe" : DS.sub,
                      background: liked ? "rgba(99,102,241,.16)" : "transparent",
                      border: `1px solid ${liked ? "rgba(99,102,241,.35)" : "rgba(99,102,241,.12)"}`,
                      borderRadius: 10, padding: "6px 13px",
                    }}
                  ><SystemIcon name={liked ? "heart-filled" : "heart"} size={12} color={liked ? "#c7d2fe" : "rgba(100,116,139,.72)"} animated /> {likeCount > 0 ? likeCount : ""}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════ FAQ ══════════════════ */}
      {section === "faq" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "moreIn .35s ease both" }}>

          {/* FAQ header */}
          <div style={{
            background: DS.card, borderRadius: 26, border: "1px solid rgba(99,102,241,.2)", padding: 20,
            boxShadow: "0 16px 36px rgba(3,4,8,.3), inset 0 1px 0 rgba(255,255,255,.04)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,.55), transparent)" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{
                  fontSize: 20, fontWeight: 900,
                  background: "linear-gradient(135deg, #e0e7ff, #a5b4fc)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  marginBottom: 6,
                }}>{t.faqTitle || "FAQ"}</div>
                <div style={{ fontSize: 12, color: DS.sub, lineHeight: 1.65 }}>
                  {lang === "en" ? "Answers about process, files, edits and payment." : "Ответы про процесс, файлы, правки и оплату."}
                </div>
              </div>
              <div style={{
                padding: "6px 13px", borderRadius: 999, flexShrink: 0,
                background: "rgba(99,102,241,.15)", border: "1px solid rgba(99,102,241,.28)",
                color: "#c7d2fe", fontSize: 11, fontWeight: 900,
              }}>{faq.length} Q&A</div>
            </div>

            {/* FAQ grid tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {faq.slice(0, 4).map((item, index) => {
                const isActive = (expandedFaq ?? 0) === index;
                return (
                  <button
                    key={index}
                    className="more-faq-tile"
                    onClick={() => { setExpandedFaq(index); SFX?.tap?.(); }}
                    style={{
                      border: `1px solid ${isActive ? "rgba(99,102,241,.5)" : "rgba(99,102,241,.11)"}`,
                      background: isActive
                        ? "linear-gradient(135deg, rgba(99,102,241,.2), rgba(139,92,246,.12))"
                        : "rgba(8,9,20,.55)",
                      borderRadius: 18, padding: 13, cursor: "pointer", textAlign: "left",
                      display: "flex", flexDirection: "column", gap: 8, minHeight: 90,
                      boxShadow: isActive ? "0 6px 18px rgba(99,102,241,.2), inset 0 1px 0 rgba(255,255,255,.05)" : "none",
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 6,
                      background: isActive ? "rgba(99,102,241,.3)" : "rgba(99,102,241,.1)",
                      border: `1px solid ${isActive ? "rgba(165,180,252,.4)" : "rgba(99,102,241,.15)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8.5, fontWeight: 900,
                      color: isActive ? "#c7d2fe" : "rgba(99,102,241,.6)",
                    }}>0{index + 1}</div>
                    <div style={{
                      fontSize: 11, color: isActive ? DS.text : "rgba(100,116,139,.75)",
                      fontWeight: 800, lineHeight: 1.45,
                      display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{item.q}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer panel */}
          <div style={{
            background: "linear-gradient(180deg, rgba(99,102,241,.1) 0%, rgba(13,15,26,.95) 100%)",
            borderRadius: 22, border: "1px solid rgba(99,102,241,.3)", padding: 20,
            boxShadow: "0 8px 28px rgba(99,102,241,.12), inset 0 1px 0 rgba(255,255,255,.04)",
            animation: "moreSlideIn .25s ease",
          }}>
            <div style={{
              fontSize: 9.5, color: "#818cf8", fontWeight: 900, textTransform: "uppercase",
              letterSpacing: ".12em", marginBottom: 10, display: "flex", alignItems: "center", gap: 5,
            }}>
              <SystemIcon name="faq" size={12} color="#818cf8" animated /> {lang === "en" ? "Answer" : "Ответ"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: DS.text, lineHeight: 1.4, marginBottom: 12 }}>
              {faq[expandedFaq ?? 0]?.q}
            </div>
            <div style={{
              fontSize: 13, color: DS.sub, lineHeight: 1.85, whiteSpace: "pre-line",
              padding: "14px 16px", borderRadius: 14,
              background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.12)",
            }}>
              {faq[expandedFaq ?? 0]?.a}
            </div>
          </div>

          {/* More FAQ list */}
          {faq.length > 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 900, color: "rgba(99,102,241,.55)", textTransform: "uppercase", letterSpacing: ".1em", paddingLeft: 4 }}>
                {lang === "en" ? "More questions" : "Ещё вопросы"}
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
                {faq.slice(4).map((item, index) => {
                  const actualIndex = index + 4;
                  const isActive = (expandedFaq ?? 0) === actualIndex;
                  return (
                    <button
                      key={actualIndex}
                      className="more-faq-tile"
                      onClick={() => { setExpandedFaq(actualIndex); SFX?.tap?.(); }}
                      style={{
                        minWidth: 210, maxWidth: 210,
                        border: `1px solid ${isActive ? "rgba(99,102,241,.45)" : "rgba(99,102,241,.12)"}`,
                        background: isActive
                          ? "linear-gradient(135deg, rgba(99,102,241,.18), rgba(139,92,246,.1))"
                          : DS.card,
                        borderRadius: 18, padding: 13, cursor: "pointer", textAlign: "left", flexShrink: 0,
                      }}
                    >
                      <div style={{
                        fontSize: 11, color: isActive ? DS.text : "rgba(100,116,139,.7)",
                        fontWeight: 800, lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>{item.q}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA bottom */}
          <div style={{
            padding: "16px 18px", borderRadius: 20,
            background: "linear-gradient(135deg, rgba(99,102,241,.12), rgba(139,92,246,.08))",
            border: "1px solid rgba(99,102,241,.2)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: DS.text, marginBottom: 3 }}>
                {lang === "en" ? "Still have questions?" : "Остались вопросы?"}
              </div>
              <div style={{ fontSize: 11.5, color: DS.sub }}>
                {lang === "en" ? "Ask directly in Telegram" : "Спроси напрямую в Telegram"}
              </div>
            </div>
            <button
              className="more-cta-btn"
              onClick={() => { SFX?.tap?.(); openTg?.("Rivaldsg", ""); }}
              style={{
                padding: "10px 18px", borderRadius: 13, flexShrink: 0,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", fontSize: 12, fontWeight: 900, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(99,102,241,.35)",
              }}
            ><SystemIcon name="telegram" size={13} color="#fff" animated /> TG</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoreTab;
