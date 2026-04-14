import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import TypewriterText from "./TypewriterText";
import SystemIcon from "./SystemIcon";

function homeCopy(lang) {
  return lang === "en"
    ? {
        sectionStudio: "Studio",
        sectionTrust: "Trust",
        sectionProcess: "Process",
        heroKicker: "Orbital design station",
        heroBody:
          "Premium visual systems for creators, streamers and brands. Clear direction, clean hierarchy and a result that feels expensive from the first second.",
        ctaPrimary: "Start a project",
        ctaSecondary: "Open gallery",
        featuredTitle: "Highlighted works",
        featuredSub: "Selected pieces with the strongest click and brand presence.",
        toolkitTitle: "Toolkit",
        toolkitSub: "Core software stack for graphics, motion and depth.",
        processTitle: "How we work",
        trustTitle: "Client confidence",
        reviewsLabel: "reviews",
        moreReviews: "View more",
        allReviewsTitle: "All reviews",
        backLabel: "Back",
        verifiedLabel: "Verified review",
        profileTitle: "About the designer",
        profileBody:
          "Focused on sharp visual direction for creators, streamers and digital brands. I build work that feels clean, controlled and premium without unnecessary noise.",
        profileMeta: [
          "Direction: premium digital identity",
          "Focus: thumbnails, banners, logos, avatars",
          "Format: clear process and concise communication",
        ],
        socialTitle: "Socials",
        faqTitle: "Fast answers",
        steps: [
          "Brief in Telegram",
          "Direction and references",
          "Production",
          "Refinement and delivery",
        ],
      }
    : {
        sectionStudio: "Студия",
        sectionTrust: "Доверие",
        sectionProcess: "Процесс",
        heroKicker: "Орбитальная дизайн-станция",
        heroBody:
          "Премиальные визуальные системы для креаторов, стримеров и брендов. Чёткое направление, чистая иерархия и результат, который ощущается дорогим с первого экрана.",
        ctaPrimary: "Начать проект",
        ctaSecondary: "Открыть галерею",
        featuredTitle: "Выбранные работы",
        featuredSub: "Подборка работ с самым сильным визуальным акцентом и подачей.",
        toolkitTitle: "Инструменты",
        toolkitSub: "Основной стек для графики, моушна и глубины.",
        processTitle: "Как идет работа",
        trustTitle: "Почему доверяют",
        reviewsLabel: "отзывов",
        moreReviews: "Посмотреть больше",
        allReviewsTitle: "Все отзывы",
        backLabel: "Назад",
        verifiedLabel: "Проверенный отзыв",
        profileTitle: "Обо мне",
        profileBody:
          "Фокусируюсь на четком визуальном направлении для креаторов, стримеров и digital-брендов. Делаю работы, которые ощущаются чисто, собранно и премиально без лишнего шума.",
        profileMeta: [
          "Направление: премиальная digital-айдентика",
          "Фокус: превью, баннеры, логотипы, аватарки",
          "Формат: понятный процесс и четкая коммуникация",
        ],
        socialTitle: "Соцсети",
        faqTitle: "Быстрые ответы",
        steps: [
          "Бриф в Telegram",
          "Направление и референсы",
          "Производство",
          "Доработка и сдача",
        ],
      };
}

function Panel({ children, style }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 28,
        border: "1px solid rgba(255,255,255,.08)",
        background: "linear-gradient(180deg, rgba(13,15,26,.84) 0%, rgba(8,10,18,.94) 100%)",
        boxShadow: "0 20px 48px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.05)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 14% 16%, rgba(99,102,241,.14) 0%, transparent 26%), radial-gradient(circle at 84% 22%, rgba(34,211,238,.08) 0%, transparent 24%)",
        }}
      />
      {children}
    </section>
  );
}

function SocialIcon({ kind, color }) {
  if (kind === "telegram") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={color} aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
      </svg>
    );
  }

  if (kind === "tiktok") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={color} aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function HomeTab({
  th,
  t,
  lang,
  onGoGallery,
  onGoCourses,
  onGoPricing,
  onGoMore,
}) {
  const g = (typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {};
  const { SFX = {}, openTg = () => {}, GALLERY = {}, REVIEWS = [], FAQ_DATA = {} } = g;
  const copy = homeCopy(lang);
  const items = (GALLERY[lang] || GALLERY.ru || []).filter((item) => item.popular).slice(0, 6);
  const featuredReviews = (REVIEWS || []).slice(0, 7);
  const allReviews = REVIEWS || [];
  const avgRating = ((REVIEWS || []).reduce((sum, item) => sum + item.rating, 0) / ((REVIEWS || []).length || 1)).toFixed(1);
  const faq = (FAQ_DATA[lang] || FAQ_DATA.ru || []).slice(0, 4);
  const [sheet, setSheet] = useState("studio");
  const [trustMode, setTrustMode] = useState("summary");

  const tools = useMemo(
    () => [
      {
        short: "Ps",
        title: "Photoshop",
        body: lang === "en" ? "Key visuals, covers and thumbnails." : "Кей-визуалы, обложки и превью.",
      },
      {
        short: "Ae",
        title: "After Effects",
        body: lang === "en" ? "Motion cues and animated emphasis." : "Моушн-акценты и анимированная подача.",
      },
      {
        short: "Bl",
        title: "Blender",
        body: lang === "en" ? "Depth, lighting and 3D form." : "Глубина, свет и 3D-форма.",
      },
    ],
    [lang]
  );

  const socials = useMemo(
    () => [
      { kind: "telegram", label: "Telegram", url: "https://t.me/+a7SsFZHmCaJiNDMy", accent: "#229ED9" },
      { kind: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@rivaldsgn", accent: "rgba(240,240,255,0.85)" },
      { kind: "youtube", label: "YouTube", url: "https://www.youtube.com/@RivalDesign", accent: "#FF0000" },
    ],
    []
  );

  const trustPoints = useMemo(
    () =>
      lang === "en"
        ? [
            { value: "50+", label: "Projects" },
            { value: "19+", label: "Clients" },
            { value: "5.0", label: "Rating" },
          ]
        : [
            { value: "50+", label: "Ïðîåêòîâ" },
            { value: "19+", label: "Êëèåíòîâ" },
            { value: "5.0", label: "Ðåéòèíã" },
          ],
    [lang]
  );

  const dockButtons = [
    { id: "studio", label: copy.sectionStudio, sub: lang === "en" ? "Core" : "ÐсÐ½Ð¾Ð²Ð°" },
    { id: "trust", label: copy.sectionTrust, sub: lang === "en" ? "Proof" : "ÐÐ¾ÐºÐ°Ð·Ð°сÐµÐ»сссÐ²Ð°" },
    { id: "process", label: copy.sectionProcess, sub: lang === "en" ? "Flow" : "ÐÐ¾сÐ¾Ðº" },
  ];

  return (
    <>
      <style>{`
        @keyframes homeReveal {
          from { opacity: 0; transform: translateY(18px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes homeGlow {
          0%, 100% { opacity: .55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        .home-lift {
          transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s ease, border-color .22s ease;
        }
        .home-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 48px rgba(0,0,0,.34), 0 0 0 1px rgba(99,102,241,.10);
        }
        .home-lift:active {
          transform: scale(.98);
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Panel
          style={{
            padding: "26px 22px 24px",
            animation: "homeReveal .48s cubic-bezier(.22,1,.36,1) both",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -74,
              right: -54,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: th.id === "graphite"
                ? "radial-gradient(circle, rgba(255,255,255,.10) 0%, rgba(161,161,170,.06) 46%, transparent 68%)"
                : "radial-gradient(circle, rgba(99,102,241,.18) 0%, rgba(139,92,246,.08) 46%, transparent 68%)",
              filter: "blur(26px)",
              animation: "homeGlow 6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(16,185,129,.26)",
              background: "rgba(16,185,129,.10)",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 14px rgba(16,185,129,.8)",
              }}
            />
            <span className="type-micro" style={{ fontSize: 8.5, color: "#34d399" }}>
              {t.onlineStatus}
            </span>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="type-micro" style={{ fontSize: 8.5, color: "rgba(148,163,184,.72)", marginBottom: 10 }}>
              {copy.heroKicker}
            </div>

            <div style={{ marginBottom: 12 }}>
              <TypewriterText
                texts={
                  lang === "en"
                    ? [
                        "Premium visuals for creators",
                        "Design that feels sharp and expensive",
                        "Avatars, previews, banners and systems",
                      ]
                    : [
                        "ÐсÐµÐ¼иÐ°Ð»сÐ½сÐ¹ Ð²иÐ·сÐ°Ð» для ÐºсÐµÐ°сÐ¾сÐ¾Ð²",
                        "ÐиÐ·Ð°Ð¹Ð½, ÐºÐ¾сÐ¾ссÐ¹ Ð¾сссÐ°Ðµссс Ð´Ð¾сÐ¾Ð³иÐ¼",
                        "ÐÐ²Ð°сÐ°сÐºи, Ð¿сÐµÐ²сс, Ð±Ð°Ð½Ð½Ðµсс и сиссÐµÐ¼с",
                      ]
                }
                theme={th}
              />
            </div>

            <div style={{ maxWidth: 420, fontSize: 13.5, lineHeight: 1.7, color: "rgba(196,206,224,.82)", marginBottom: 22 }}>
              {copy.heroBody}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="home-lift"
                onClick={() => {
                  SFX.order?.();
                  openTg("Rivaldsg", lang === "en" ? "Hi, I want to start a project." : "Привет, хочу начать проект.");
                }}
                style={{
                  border: "1px solid rgba(165,180,252,.24)",
                  borderRadius: 18,
                padding: "14px 20px",
                background: th.btn,
                color: th.btnTxt,
                fontSize: 13,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: th.id === "graphite"
                  ? "0 14px 36px rgba(255,255,255,.12), inset 0 1px 0 rgba(255,255,255,.18)"
                  : "0 14px 36px rgba(99,102,241,.34), inset 0 1px 0 rgba(255,255,255,.14)",
              }}
            >
              {copy.ctaPrimary}
            </button>

              <button
                className="home-lift"
                onClick={onGoGallery}
                style={{
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 18,
                  padding: "14px 18px",
                  background: "rgba(255,255,255,.03)",
                  color: "rgba(224,231,255,.92)",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {copy.ctaSecondary}
              </button>
            </div>
          </div>
        </Panel>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
            animation: "homeReveal .5s cubic-bezier(.22,1,.36,1) .06s both",
          }}
        >
          {trustPoints.map((item) => (
            <Panel key={item.label} style={{ padding: "16px 12px", textAlign: "center" }}>
              <div className="type-number" style={{ fontSize: 22, color: "rgba(248,250,252,.96)" }}>
                {item.value}
              </div>
              <div className="type-micro" style={{ fontSize: 8.5, color: "rgba(148,163,184,.74)", marginTop: 6 }}>
                {item.label}
              </div>
            </Panel>
          ))}
        </div>

        <Panel
          style={{
            padding: "16px 0 18px",
            animation: "homeReveal .52s cubic-bezier(.22,1,.36,1) .1s both",
          }}
        >
          <div style={{ padding: "0 16px 14px", display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div className="type-display" style={{ fontSize: 18, color: "rgba(248,250,252,.95)", letterSpacing: "-.04em" }}>
                {copy.featuredTitle}
              </div>
              <div style={{ fontSize: 12, color: "rgba(148,163,184,.74)", marginTop: 4, lineHeight: 1.6 }}>
                {copy.featuredSub}
              </div>
            </div>
            <button
              onClick={onGoGallery}
              style={{
                height: 40,
                borderRadius: 14,
                padding: "0 14px",
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.03)",
                color: "rgba(224,231,255,.92)",
                fontWeight: 700,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {lang === "en" ? "All works" : "ÐсÐµ сÐ°Ð±Ð¾сс"}
            </button>
          </div>

          <Swiper spaceBetween={12} slidesPerView="auto" style={{ padding: "0 16px" }}>
            {items.map((item) => (
              <SwiperSlide key={item.id} style={{ width: 188 }}>
                <button
                  className="home-lift"
                  onClick={onGoGallery}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "1px solid rgba(255,255,255,.07)",
                    background: "rgba(7,9,16,.72)",
                    borderRadius: 22,
                    overflow: "hidden",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: "100%", aspectRatio: "1080 / 1280", objectFit: "cover", display: "block" }}
                    />
                    {item.popular && (
                      <div
                        className="type-micro"
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,.92)",
                          color: "#0f172a",
                          fontSize: 8,
                        }}
                      >
                        TOP
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "12px 12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(248,250,252,.95)" }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(148,163,184,.74)", marginTop: 4, lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </Panel>

        <Panel
          style={{
            padding: 16,
            animation: "homeReveal .54s cubic-bezier(.22,1,.36,1) .14s both",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {dockButtons.map((item) => {
              const active = sheet === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSheet(item.id);
                    if (item.id !== "trust") setTrustMode("summary");
                    SFX.tab?.();
                  }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    borderRadius: 18,
                    border: `1px solid ${active ? th.border : "rgba(255,255,255,.07)"}`,
                    background: active
                      ? (th.id === "graphite"
                        ? "linear-gradient(135deg, rgba(255,255,255,.14), rgba(161,161,170,.08))"
                        : "linear-gradient(135deg, rgba(99,102,241,.18), rgba(139,92,246,.12))")
                      : "rgba(255,255,255,.02)",
                    color: active ? th.text : "rgba(148,163,184,.76)",
                    padding: "12px 8px",
                    cursor: "pointer",
                  }}
                >
                  <div className="type-button" style={{ fontSize: 12, fontWeight: 800 }}>
                    {item.label}
                  </div>
                  <div className="type-micro" style={{ fontSize: 7.5, marginTop: 4, opacity: active ? 0.86 : 0.58 }}>
                    {item.sub}
                  </div>
                </button>
              );
            })}
          </div>

          {sheet === "studio" && (
            <div style={{ animation: "homeReveal .32s ease both" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 14 }}>
                {tools.map((tool) => (
                  <div
                    key={tool.title}
                    className="home-lift"
                    style={{
                      borderRadius: 22,
                      border: "1px solid rgba(255,255,255,.07)",
                      padding: 14,
                      background: "rgba(255,255,255,.025)",
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 15,
                        display: "grid",
                        placeItems: "center",
                        background: th.id === "graphite"
                          ? "linear-gradient(135deg, rgba(255,255,255,.12), rgba(161,161,170,.08))"
                          : "linear-gradient(135deg, rgba(99,102,241,.16), rgba(139,92,246,.10))",
                        border: `1px solid ${th.border}`,
                        color: th.text,
                        fontWeight: 900,
                        marginBottom: 12,
                      }}
                    >
                      {tool.short}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(248,250,252,.95)" }}>{tool.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(148,163,184,.74)", marginTop: 6, lineHeight: 1.55 }}>
                      {tool.body}
                    </div>
                  </div>
                ))}
              </div>

              <Panel style={{ padding: 16, borderRadius: 22 }}>
                <div className="type-display" style={{ fontSize: 16, color: "rgba(248,250,252,.95)" }}>
                  {copy.profileTitle}
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(196,206,224,.82)", marginTop: 8, lineHeight: 1.7 }}>
                  {copy.profileBody}
                </div>
                <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                  {copy.profileMeta.map((line) => (
                    <div
                      key={line}
                      style={{
                        borderRadius: 16,
                        border: "1px solid rgba(255,255,255,.06)",
                        background: "rgba(255,255,255,.025)",
                        padding: "11px 12px",
                        fontSize: 11.5,
                        color: "rgba(224,231,255,.84)",
                        lineHeight: 1.55,
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 14 }}>
                  <div className="type-micro" style={{ fontSize: 8.5, color: "rgba(148,163,184,.72)", marginBottom: 10 }}>
                    {copy.socialTitle}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                    {socials.map((item) => (
                      <button
                        key={item.label}
                        className="home-lift"
                        onClick={() => {
                          SFX.tap?.();
                          window.open(item.url, "_blank");
                        }}
                        style={{
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,.06)",
                          background: "rgba(255,255,255,.025)",
                          padding: "14px 10px",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ display: "grid", placeItems: "center", marginBottom: 8 }}>
                          <SocialIcon kind={item.kind} color={item.accent} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(248,250,252,.95)" }}>{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>
          )}

          {sheet === "trust" && (
            <div style={{ animation: "homeReveal .32s ease both" }}>
              {trustMode === "summary" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1.08fr .92fr", gap: 10 }}>
                  <Panel style={{ padding: 16, borderRadius: 22, height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div className="type-display" style={{ fontSize: 16, color: "rgba(248,250,252,.95)" }}>
                          {copy.trustTitle}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(148,163,184,.74)", marginTop: 6 }}>
                          {allReviews.length} {copy.reviewsLabel} â¢ {avgRating}/5
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setTrustMode("all");
                          SFX.open?.();
                        }}
                        style={{
                          minHeight: 38,
                          minWidth: 90,
                          flex: "1 1 auto",
                          padding: "8px 12px",
                          borderRadius: 14,
                          border: `1px solid ${th.border}`,
                          background: th.id === "graphite" ? "rgba(255,255,255,.06)" : "rgba(99,102,241,.10)",
                          color: th.text,
                          fontWeight: 700,
                          fontSize: 11,
                          cursor: "pointer",
                          lineHeight: 1.3,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          textAlign: "center",
                        }}
                      >
                        {copy.moreReviews}
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                      {featuredReviews.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="home-lift"
                          style={{
                            borderRadius: 18,
                            border: "1px solid rgba(255,255,255,.06)",
                            background: "rgba(255,255,255,.02)",
                            padding: 14,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(248,250,252,.95)" }}>{item.name}</div>
                              <div style={{ fontSize: 10.5, color: "rgba(148,163,184,.68)", marginTop: 4 }}>
                                @{item.tg}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 2, color: "#fbbf24" }}>{Array.from({ length: 5 }).map((_, idx) => <SystemIcon key={idx} name="star" size={11} color="#fbbf24" animated />)}</div>
                          </div>
                          <div style={{ fontSize: 11.5, lineHeight: 1.62, color: "rgba(196,206,224,.82)", marginTop: 8 }}>
                            â{item.text}â
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>

                  <Panel style={{ padding: 16, borderRadius: 22, height: "100%" }}>
                    <div className="type-display" style={{ fontSize: 16, color: "rgba(248,250,252,.95)" }}>
                      {copy.faqTitle}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                      {faq.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            borderRadius: 18,
                            border: "1px solid rgba(255,255,255,.06)",
                            background: "rgba(255,255,255,.02)",
                            padding: 14,
                          }}
                        >
                          <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(248,250,252,.95)" }}>{item.q}</div>
                          <div style={{ fontSize: 11.5, lineHeight: 1.65, color: "rgba(148,163,184,.78)", marginTop: 8, whiteSpace: "pre-line" }}>
                            {item.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              ) : (
                <Panel style={{ padding: 16, borderRadius: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div>
                      <div className="type-display" style={{ fontSize: 18, color: "rgba(248,250,252,.95)" }}>
                        {copy.allReviewsTitle}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(148,163,184,.74)", marginTop: 6 }}>
                        {allReviews.length} {copy.reviewsLabel} â¢ {avgRating}/5
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setTrustMode("summary");
                        SFX.close?.();
                      }}
                      style={{
                        height: 38,
                        padding: "0 14px",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,.08)",
                        background: "rgba(255,255,255,.03)",
                        color: "rgba(224,231,255,.94)",
                        fontWeight: 700,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      >
                      <span style={{ display: "inline-flex", alignItems: "center" }}><SystemIcon name="arrow-left" size={13} color="rgba(224,231,255,.94)" style={{ marginRight: 6 }} /> {copy.backLabel}</span>
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {allReviews.map((item) => (
                      <div
                        key={item.id}
                        className="home-lift"
                        style={{
                          borderRadius: 20,
                          border: "1px solid rgba(255,255,255,.06)",
                          background: "rgba(255,255,255,.02)",
                          padding: 14,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(248,250,252,.95)" }}>{item.name}</div>
                            <div style={{ fontSize: 10.5, color: "rgba(148,163,184,.68)", marginTop: 4 }}>
                              @{item.tg} â¢ {item.time}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 2 }}>{Array.from({ length: item.rating }).map((_, idx) => <SystemIcon key={idx} name="star" size={11} color="#fbbf24" animated />)}</div>
                        </div>
                        <div style={{ fontSize: 11.5, lineHeight: 1.68, color: "rgba(196,206,224,.82)", marginTop: 10 }}>
                          â{item.text}â
                        </div>
                        <div style={{ fontSize: 10.5, color: "rgba(148,163,184,.68)", marginTop: 10 }}>
                          {item.verified ? copy.verifiedLabel : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}
            </div>
          )}

          {sheet === "process" && (
            <div style={{ animation: "homeReveal .32s ease both" }}>
              <div style={{ display: "grid", gap: 10 }}>
                <Panel style={{ padding: 16, borderRadius: 22 }}>
                  <div className="type-display" style={{ fontSize: 16, color: "rgba(248,250,252,.95)" }}>
                    {copy.processTitle}
                  </div>
                  <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                    {copy.steps.map((step, idx) => (
                      <div
                        key={step}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "38px 1fr",
                          gap: 12,
                          alignItems: "center",
                          borderRadius: 18,
                          border: "1px solid rgba(255,255,255,.06)",
                          background: "rgba(255,255,255,.02)",
                          padding: 12,
                        }}
                      >
                        <div
                          className="type-number"
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 14,
                            display: "grid",
                            placeItems: "center",
                            background: "linear-gradient(135deg, rgba(99,102,241,.18), rgba(139,92,246,.12))",
                            color: th.text,
                            border: `1px solid ${th.border}`,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(224,231,255,.92)" }}>{step}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
