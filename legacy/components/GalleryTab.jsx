import React, { useState, useMemo, useCallback } from "react";
import SystemIcon from "./SystemIcon";

function getOptimizedSrcSet(src) {
  if (typeof src !== "string" || !src.startsWith("/images/optimized/") || !src.endsWith(".jpg")) return undefined;
  return `${src.replace(/\.jpg$/, "-450.jpg")} 450w, ${src} 900w`;
}

function GalleryTab({ th, t, lang, wishlist, toggleWishlist, onOpenImage }) {
  const g = (typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {};
  const { SFX, GALLERY, CAT_ICONS } = g;
  const items = GALLERY?.[lang] || GALLERY?.ru || [];
  const cats = useMemo(() => ["all", ...[...new Set(items.map(i => i.cat))]], [items]);
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("pop");
  const [view, setView] = useState("grid");
  const [hovered, setHovered] = useState(null);
  const [imgLoaded, setImgLoaded] = useState({});
  const isMobilePerf = typeof document !== "undefined" && document.documentElement.dataset.rsMobile === "true";

  const filtered = useMemo(() => {
    let r = items.filter(i =>
      (cat === "all" || i.cat === cat) &&
      (search === "" || i.title.toLowerCase().includes(search.toLowerCase()) ||
       i.tags?.some(tg => tg.includes(search.toLowerCase())))
    );
    if (sort === "pop") r = [...r].sort((a, b) => b.views - a.views);
    if (sort === "new") r = [...r].reverse();
    if (sort === "alpha") r = [...r].sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [items, cat, search, sort]);

  const handleImgLoad = useCallback((id) => {
    setImgLoaded(prev => ({ ...prev, [id]: true }));
  }, []);

  const fmtViews = (v) => v >= 1000 ? (v / 1000).toFixed(1) + "k" : v;
  const iconNameForCat = (value) => {
    const key = String(value || "").toLowerCase();
    if (key === "all") return "palette";
    if (key.includes("avatar")) return "avatar";
    if (key.includes("preview")) return "preview";
    if (key.includes("banner")) return "banner";
    if (key.includes("logo")) return "visual";
    if (key.includes("pack")) return "gift";
    return "custom";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <style>{`
        @keyframes galCardIn {
          from { opacity: 0; transform: translateY(18px) scale(.95); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes shimmerGal {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes galGroupIn {
          from { opacity: .72; transform: translateY(10px) scale(.985); }
          to   { opacity: 1; transform: none; }
        }
        .gal-card {
          transition: transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease;
          cursor: pointer;
          will-change: transform;
        }
        .gal-card:hover { transform: translateY(-3px) scale(1.015); }
        .gal-card:active { transform: scale(0.96) !important; }
        .gal-open-layer {
          opacity: 0;
          transition: opacity .22s ease;
        }
        .gal-card:hover .gal-open-layer,
        .gal-card:focus-within .gal-open-layer {
          opacity: 1;
        }
        .gal-open-chip {
          transform: translateY(7px) scale(.96);
          transition: transform .22s cubic-bezier(.34,1.56,.64,1), opacity .22s ease;
        }
        .gal-card:hover .gal-open-chip,
        .gal-card:focus-within .gal-open-chip {
          transform: translateY(0) scale(1);
        }
        .gal-grid-wrap,
        .gal-list-wrap {
          animation: galGroupIn .24s ease both;
        }
        .gal-wl-btn {
          transition: all .18s cubic-bezier(.34,1.56,.64,1);
        }
        .gal-wl-btn:active { animation: heartPop .3s ease; }
        .gal-wl-btn:hover { transform: scale(1.12); }
        .cat-pill {
          transition: all .22s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .cat-pill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,.07) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform .4s ease;
        }
        .cat-pill:hover::after { transform: translateX(100%); }
        .gal-sort-btn { transition: all .18s ease; cursor: pointer; }
        .gal-sort-btn:hover { opacity: 0.85; }
        .gal-sort-btn:active { transform: scale(0.95); }
        .gal-img-shimmer {
          background: linear-gradient(90deg, rgba(13,15,26,0.9) 0%, rgba(30,35,60,0.8) 50%, rgba(13,15,26,0.9) 100%);
          background-size: 200% 100%;
          animation: shimmerGal 1.5s ease infinite;
        }
        .gal-list-row {
          transition: all .2s ease;
          cursor: pointer;
        }
        .gal-list-row:hover {
          border-color: rgba(99,102,241,.35) !important;
          background: rgba(20,22,40,.9) !important;
          transform: translateX(3px);
        }
        .gal-list-row:active { transform: scale(0.98); }
        .view-toggle-btn { transition: all .2s ease; cursor: pointer; }
        .view-toggle-btn:hover { border-color: rgba(99,102,241,.4) !important; }
        .view-toggle-btn:active { transform: scale(0.92); }
        .search-clear-btn { transition: all .18s ease; cursor: pointer; }
        .search-clear-btn:hover { background: rgba(99,102,241,.25) !important; }
        html[data-rs-mobile="true"] .gal-card,
        html[data-rs-mobile="true"] .gal-list-row {
          animation-duration: .22s !important;
          transition: transform .14s ease, border-color .14s ease, background .14s ease, box-shadow .14s ease !important;
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
          will-change: auto !important;
        }
        html[data-rs-mobile="true"] .gal-card:hover,
        html[data-rs-mobile="true"] .gal-list-row:hover {
          transform: none !important;
        }
        html[data-rs-mobile="true"] .gal-open-layer {
          opacity: 1 !important;
          background: linear-gradient(180deg, transparent 10%, rgba(3,4,8,.24) 100%) !important;
        }
        html[data-rs-mobile="true"] .gal-open-chip {
          transform: translateY(0) scale(.94) !important;
        }
        html[data-rs-mobile="true"] .gal-grid-wrap,
        html[data-rs-mobile="true"] .gal-list-wrap {
          animation-duration: .18s !important;
        }
        html[data-rs-mobile="true"] .gal-img-shimmer {
          animation-duration: 2.4s !important;
        }
        html[data-rs-mobile="true"] .cat-pill::after {
          display: none !important;
        }
        html[data-rs-mobile="true"] .gal-sort-btn,
        html[data-rs-mobile="true"] .view-toggle-btn,
        html[data-rs-mobile="true"] .search-clear-btn {
          transition-duration: .12s !important;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontSize: 24, fontWeight: 900,
            background: "linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 50%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", fontFamily: "var(--font-display)", letterSpacing: "-.03em",
            lineHeight: 1.1,
          }}>
            {t.galleryTitle}
          </div>
          <div style={{ fontSize: 12, color: "rgba(100,116,139,.7)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "rgba(99,102,241,.15)", border: "1px solid rgba(99,102,241,.2)",
              borderRadius: 6, padding: "1px 7px", fontSize: 11, fontWeight: 700,
              color: "rgba(165,180,252,.85)",
            }}>{filtered.length}</span>
            <span>/ {items.length} {lang === "en" ? "works" : "работ"}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Sort */}
          <div style={{
            display: "flex", gap: 4, background: "rgba(13,15,26,.8)",
            borderRadius: 12, padding: 4, border: "1px solid rgba(99,102,241,.12)",
            backdropFilter: "blur(12px)",
          }}>
            {[["pop", "top"], ["new", "visual"], ["alpha", null]].map(([v, icon]) => (
              <button
                key={v}
                onClick={() => { SFX?.filter(); setSort(v); }}
                className="gal-sort-btn"
                style={{
                  padding: "5px 9px", borderRadius: 8, border: "none",
                  background: sort === v ? "linear-gradient(135deg, rgba(99,102,241,.4), rgba(139,92,246,.35))" : "transparent",
                  color: sort === v ? "#c7d2fe" : "rgba(100,116,139,.65)",
                  fontSize: 12, fontWeight: 700,
                  boxShadow: sort === v ? "0 2px 8px rgba(99,102,241,.2)" : "none",
                }}
              >{icon ? <SystemIcon name={icon} size={13} color={sort === v ? "#c7d2fe" : "rgba(100,116,139,.68)"} animated={sort === v} /> : "A"}</button>
            ))}
          </div>

          {/* View toggle */}
          <button
            onClick={() => { SFX?.filter(); setView(v => v === "grid" ? "list" : "grid"); }}
            className="view-toggle-btn"
            style={{
              width: 38, height: 38, borderRadius: 12,
              border: "1px solid rgba(99,102,241,.18)",
              background: "rgba(13,15,26,.8)",
              color: "rgba(165,180,252,.8)", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            {view === "grid" ? <SystemIcon name="banner" size={15} color="rgba(165,180,252,.8)" animated /> : <SystemIcon name="visual" size={15} color="rgba(165,180,252,.8)" animated />}
          </button>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          fontSize: 14, color: "rgba(99,102,241,.5)", pointerEvents: "none", zIndex: 1,
        }}><SystemIcon name="search" size={15} color="rgba(99,102,241,.55)" animated /></span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.gallerySearch || "Поиск..."}
          style={{
            width: "100%", padding: "12px 40px 12px 38px",
            borderRadius: 16, border: "1px solid rgba(99,102,241,.16)",
            background: "rgba(13,15,26,.75)", color: "rgba(224,231,255,.9)",
            fontSize: 13, outline: "none", fontFamily: "inherit",
            boxSizing: "border-box", backdropFilter: "blur(12px)",
            transition: "border-color .2s ease, background .2s ease",
          }}
          onFocus={e => {
            e.target.style.borderColor = "rgba(99,102,241,.45)";
            e.target.style.background = "rgba(18,20,36,.9)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(99,102,241,.16)";
            e.target.style.background = "rgba(13,15,26,.75)";
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="search-clear-btn"
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "rgba(99,102,241,.15)", border: "1px solid rgba(99,102,241,.2)",
              color: "rgba(165,180,252,.8)", fontSize: 11,
              width: 22, height: 22, borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          ><SystemIcon name="close" size={12} color="rgba(165,180,252,.8)" /></button>
        )}
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div style={{
        display: "flex", gap: 7, overflowX: "auto",
        scrollbarWidth: "none", WebkitOverflowScrolling: "touch", paddingBottom: 3,
      }}>
        {cats.map((c, i) => {
          const active = cat === c;
          const icon = iconNameForCat(c);
          return (
            <button
              key={c}
              className="cat-pill"
              onClick={() => { setCat(c); SFX?.filter(); }}
              style={{
                whiteSpace: "nowrap", padding: "8px 16px",
                borderRadius: 999, fontSize: 12, fontWeight: 700,
                background: active
                  ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                  : "rgba(13,15,26,.65)",
                color: active ? "#fff" : "rgba(100,116,139,.75)",
                border: active ? "1px solid rgba(165,180,252,.2)" : "1px solid rgba(99,102,241,.12)",
                flexShrink: 0,
                boxShadow: active
                  ? "0 4px 16px rgba(99,102,241,.4), inset 0 1px 0 rgba(255,255,255,.12)"
                  : "none",
                animation: `fadeUpIn .3s ease ${i * .04}s both`,
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <SystemIcon name={icon} size={11} color={active ? "#fff" : "rgba(100,116,139,.72)"} animated={active} />
              {c === "all" ? (t.filterAll || "Все") : c}
            </button>
          );
        })}
      </div>

      {/* ── EMPTY STATE ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", animation: "fadeUpIn .4s ease" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 18px",
            background: "radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%)",
            border: "1px solid rgba(99,102,241,.18)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
          }}><SystemIcon name="palette" size={28} color="rgba(99,102,241,.6)" animated /></div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(224,231,255,.75)", marginBottom: 8 }}>
            {lang === "en" ? "Nothing found" : "Ничего не найдено"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(100,116,139,.6)" }}>
            {lang === "en" ? "Try a different query or category" : "Попробуй другой запрос или категорию"}
          </div>
          <button
            onClick={() => { setSearch(""); setCat("all"); }}
            style={{
              marginTop: 16, padding: "9px 22px", borderRadius: 12,
              background: "rgba(99,102,241,.15)", border: "1px solid rgba(99,102,241,.25)",
              color: "rgba(165,180,252,.9)", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            {lang === "en" ? "Reset filters" : "Сбросить фильтры"}
          </button>
        </div>

      ) : view === "grid" ? (
        /* ── GRID VIEW ── */
        <div
          key={`grid-${cat}-${sort}-${search}`}
          className="gal-grid-wrap"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {filtered.map((item, i) => {
            const wl = wishlist.includes(item.id);
            const isHov = hovered === item.id;
            const loaded = imgLoaded[item.id];
            return (
              <div
                key={item.id}
                className="gal-card"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onTouchStart={() => setHovered(item.id)}
                onTouchEnd={() => window.setTimeout(() => setHovered(null), 180)}
                style={{
                  borderRadius: 20, overflow: "hidden",
                  background: "rgba(13,15,26,.85)",
                  border: `1px solid ${wl ? "rgba(99,102,241,.4)" : isHov ? "rgba(99,102,241,.22)" : "rgba(99,102,241,.11)"}`,
                  backdropFilter: "blur(12px)",
                  animation: `galCardIn .4s ease ${i * .045}s both`,
                  boxShadow: wl
                    ? "0 8px 32px rgba(99,102,241,.25), inset 0 1px 0 rgba(255,255,255,.05)"
                    : isHov
                      ? "0 12px 36px rgba(3,4,8,.5), 0 0 0 1px rgba(99,102,241,.15)"
                      : "0 4px 16px rgba(3,4,8,.3)",
                  position: "relative",
                  contentVisibility: "auto",
                  containIntrinsicSize: "420px",
                }}
              >
                {/* Image area */}
                <div
                  onClick={() => { onOpenImage(item); SFX?.open(); }}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  {/* Shimmer while loading */}
                  {!loaded && (
                    <div className="gal-img-shimmer" style={{ width: "100%", aspectRatio: "1080/1280" }} />
                  )}
                  <img
                    src={item.img} alt={item.title}
                    srcSet={getOptimizedSrcSet(item.img)}
                    sizes="(max-width: 520px) 48vw, 220px"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={i === 0 ? "high" : "auto"}
                    onLoad={() => handleImgLoad(item.id)}
                    style={{
                      width: "100%", aspectRatio: "1080/1280", objectFit: "cover",
                      display: "block",
                      opacity: loaded ? 1 : 0,
                      transition: "opacity .4s ease, transform .3s ease",
                      transform: isHov ? "scale(1.045)" : "scale(1)",
                    }}
                  />

                  {/* Gradient overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, transparent 40%, rgba(3,4,8,.82) 100%)",
                    transition: "opacity .25s ease",
                    opacity: isHov ? 0.9 : 0.7,
                  }} />

                  {/* Hover reveal: action hint */}
                  <div
                    className="gal-open-layer"
                    style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(13,15,26,.25)",
                  }}>
                    <div
                      className="gal-open-chip"
                      style={{
                      padding: "8px 16px", borderRadius: 12,
                      background: "rgba(13,15,26,.85)", border: "1px solid rgba(165,180,252,.25)",
                      backdropFilter: "blur(16px)",
                      color: "rgba(224,231,255,.9)", fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                    <SystemIcon name="search" size={13} color="rgba(224,231,255,.9)" animated />
                    {lang === "en" ? "View" : "Открыть"}
                    </div>
                  </div>

                  {/* TOP badge */}
                  {item.popular && (
                    <div style={{
                      position: "absolute", top: 8, left: 8,
                      padding: "3px 9px", borderRadius: 999,
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff", fontSize: 8, fontWeight: 900,
                      boxShadow: "0 2px 10px rgba(99,102,241,.5)",
                      letterSpacing: ".06em", textTransform: "uppercase",
                      display: "flex", alignItems: "center", gap: 3,
                    }}>
                      <SystemIcon name="top" size={10} color="#fff" animated /> TOP
                    </div>
                  )}

                  {/* Views badge */}
                  <div style={{
                    position: "absolute", bottom: 8, right: 8,
                    padding: "3px 8px", borderRadius: 999,
                    background: "rgba(3,4,8,.75)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,.08)",
                    color: "rgba(200,210,255,.85)", fontSize: 9, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <SystemIcon name="eye" size={10} color="rgba(200,210,255,.85)" animated />
                    {fmtViews(item.views)}
                  </div>
                </div>

                {/* Card info */}
                <div style={{ padding: "10px 12px 12px", background: "rgba(6,8,18,.7)" }}>
                  <div style={{
                    fontSize: 12, fontWeight: 800, color: "rgba(224,231,255,.92)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    marginBottom: 2,
                  }}>{item.title}</div>
                  <div style={{
                    fontSize: 9.5, color: "rgba(99,102,241,.7)", marginBottom: 9,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <SystemIcon name={iconNameForCat(item.cat)} size={10} color="rgba(99,102,241,.7)" animated />
                    {item.cat}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {item.tags?.slice(0, 2).map(tag => (
                        <span key={tag} style={{
                          fontSize: 8, padding: "2px 5px", borderRadius: 5,
                          background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.15)",
                          color: "rgba(165,180,252,.7)", fontWeight: 600,
                        }}>#{tag}</span>
                      ))}
                    </div>
                    <button
                      className="gal-wl-btn"
                      onClick={e => { e.stopPropagation(); toggleWishlist(item.id); SFX?.wishlist(); }}
                      style={{
                        width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                        border: `1px solid ${wl ? "rgba(165,180,252,.5)" : "rgba(99,102,241,.14)"}`,
                        background: wl ? "rgba(99,102,241,.25)" : "rgba(99,102,241,.06)",
                        color: wl ? "#c7d2fe" : "rgba(100,116,139,.6)",
                        cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: wl ? "0 0 10px rgba(99,102,241,.3)" : "none",
                      }}
                    ><SystemIcon name={wl ? "heart-filled" : "heart"} size={14} color={wl ? "#c7d2fe" : "rgba(100,116,139,.68)"} animated /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      ) : (
        /* ── LIST VIEW ── */
        <div
          key={`list-${cat}-${sort}-${search}`}
          className="gal-list-wrap"
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {filtered.map((item, i) => {
            const wl = wishlist.includes(item.id);
            const loaded = imgLoaded[item.id];
            return (
              <div
                key={item.id}
                onClick={() => { onOpenImage(item); SFX?.open(); }}
                className="gal-list-row"
                style={{
                  display: "flex", gap: 12, alignItems: "center",
                  background: "rgba(13,15,26,.8)",
                  borderRadius: 18, border: `1px solid ${wl ? "rgba(99,102,241,.3)" : "rgba(99,102,241,.11)"}`,
                  padding: "10px 12px",
                  animation: `galCardIn .32s ease ${i * .04}s both`,
                  backdropFilter: "blur(12px)",
                  contentVisibility: "auto",
                  containIntrinsicSize: "76px",
                }}
              >
                <div style={{ position: "relative", flexShrink: 0, borderRadius: 12, overflow: "hidden" }}>
                  {!loaded && (
                    <div className="gal-img-shimmer" style={{ width: 72, height: 54 }} />
                  )}
                  <img
                    src={item.img} alt={item.title}
                    srcSet={getOptimizedSrcSet(item.img)}
                    sizes="72px"
                    loading="lazy"
                    decoding="async"
                    onLoad={() => handleImgLoad(item.id)}
                    style={{
                      width: 72, height: 54, objectFit: "cover", borderRadius: 12, display: "block",
                      opacity: loaded ? 1 : 0, transition: "opacity .3s ease",
                    }}
                  />
                  {item.popular && (
                    <div style={{
                      position: "absolute", top: -3, right: -3,
                      width: 16, height: 16, borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, color: "#fff", boxShadow: "0 2px 6px rgba(99,102,241,.5)",
                    }}><SystemIcon name="top" size={9} color="#fff" animated /></div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 800, color: "rgba(224,231,255,.92)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: "rgba(100,116,139,.7)", marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
                    <SystemIcon name={iconNameForCat(item.cat)} size={10} color="rgba(100,116,139,.7)" animated />
                    <span>{item.cat}</span>
                    <span style={{ opacity: .4 }}>·</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><SystemIcon name="eye" size={10} color="rgba(100,116,139,.7)" animated /> {fmtViews(item.views)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                    {item.tags?.slice(0, 2).map(tag => (
                      <span key={tag} style={{
                        fontSize: 8, padding: "1px 5px", borderRadius: 4,
                        background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.14)",
                        color: "rgba(165,180,252,.65)", fontWeight: 600,
                      }}>#{tag}</span>
                    ))}
                  </div>
                </div>

                <button
                  className="gal-wl-btn"
                  onClick={e => { e.stopPropagation(); toggleWishlist(item.id); SFX?.wishlist(); }}
                  style={{
                    width: 34, height: 34, borderRadius: 11, flexShrink: 0,
                    border: `1px solid ${wl ? "rgba(165,180,252,.4)" : "rgba(99,102,241,.14)"}`,
                    background: wl ? "rgba(99,102,241,.22)" : "transparent",
                    color: wl ? "#c7d2fe" : "rgba(100,116,139,.65)",
                    cursor: "pointer", fontSize: 17,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: wl ? "0 0 12px rgba(99,102,241,.3)" : "none",
                  }}
                ><SystemIcon name={wl ? "heart-filled" : "heart"} size={15} color={wl ? "#c7d2fe" : "rgba(100,116,139,.68)"} animated /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GalleryTab;



