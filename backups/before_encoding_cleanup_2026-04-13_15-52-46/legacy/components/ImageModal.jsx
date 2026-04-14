import React, { useEffect, useRef, useState } from "react";

function ImageModal({ item, th, t, onClose, wishlist, toggleWishlist, showToast, sfx, openTg, lang }) {
  const wl = wishlist.includes(item.id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wlAnimating, setWlAnimating] = useState(false);
  const dragRef = useRef({ startY: 0, dragging: false, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Swipe-to-close
  const onTouchStart = (e) => {
    dragRef.current = { startY: e.touches[0].clientY, dragging: true, y: 0 };
  };
  const onTouchMove = (e) => {
    if (!dragRef.current.dragging) return;
    const dy = e.touches[0].clientY - dragRef.current.startY;
    if (dy > 0) {
      dragRef.current.y = dy;
      if (cardRef.current) {
        cardRef.current.style.transform = `translateY(${dy}px)`;
        cardRef.current.style.opacity = `${1 - dy / 300}`;
      }
    }
  };
  const onTouchEnd = () => {
    if (dragRef.current.y > 100) {
      onClose();
    } else {
      if (cardRef.current) {
        cardRef.current.style.transform = "";
        cardRef.current.style.opacity = "";
      }
    }
    dragRef.current = { startY: 0, dragging: false, y: 0 };
  };

  const handleWishlist = () => {
    setWlAnimating(true);
    toggleWishlist(item.id);
    sfx?.wishlist?.();
    setTimeout(() => setWlAnimating(false), 400);
  };

  const handleOrder = () => {
    sfx?.order?.();
    openTg("Rivaldsg", lang === "en"
      ? `Hi! I want a similar design: ${item.title}`
      : `Хочу похожий дизайн: ${item.title}`);
    onClose();
  };

  const handleShare = async () => {
    sfx?.copy?.();
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url: item.img });
      } else {
        await navigator.clipboard.writeText(item.img);
        showToast(t.copied || "Скопировано!", "success");
      }
    } catch {
      showToast(t.copied || "Скопировано!", "success");
    }
  };

  const fmtViews = (v) => v >= 1000 ? (v / 1000).toFixed(1) + "k" : v;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(2,3,7,.92)",
        backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "imgModalBgIn .25s ease",
        padding: "0 0 env(safe-area-inset-bottom, 0px)",
      }}
    >
      <style>{`
        @keyframes imgModalBgIn { from { opacity:0; } to { opacity:1; } }
        @keyframes imgModalCardIn {
          from { opacity:0; transform:translateY(40px) scale(.96); }
          to   { opacity:1; transform:none; }
        }
        @keyframes wlHeartPop {
          0%   { transform:scale(1); }
          35%  { transform:scale(1.55); }
          65%  { transform:scale(0.88); }
          100% { transform:scale(1); }
        }
        .img-close-btn { transition: all .18s ease !important; }
        .img-close-btn:hover { background: rgba(30,35,60,.9) !important; border-color: rgba(255,255,255,.2) !important; }
        .img-close-btn:active { transform: scale(0.9) !important; }
        .img-order-btn { transition: all .18s cubic-bezier(.34,1.56,.64,1) !important; }
        .img-order-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 30px rgba(99,102,241,.55) !important; }
        .img-order-btn:active { transform: scale(0.95) !important; }
        .img-share-btn { transition: all .18s ease !important; }
        .img-share-btn:hover { background: rgba(99,102,241,.18) !important; border-color: rgba(99,102,241,.35) !important; }
        .img-share-btn:active { transform: scale(0.95) !important; }
      `}</style>

      <div
        ref={cardRef}
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: "min(430px, 100vw)",
          background: "linear-gradient(180deg, rgba(13,15,26,.98) 0%, rgba(8,9,20,1) 100%)",
          borderRadius: "28px 28px 0 0",
          border: "1px solid rgba(99,102,241,.22)",
          borderBottom: "none",
          boxShadow: "0 -24px 80px rgba(3,4,8,.7), 0 0 40px rgba(99,102,241,.08)",
          animation: "imgModalCardIn .3s cubic-bezier(.22,1,.36,1) both",
          overflow: "hidden",
          transition: "transform .3s ease, opacity .3s ease",
          maxHeight: "92vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{
            width: 40, height: 4, borderRadius: 999,
            background: "rgba(255,255,255,.15)",
          }} />
        </div>

        {/* Image section */}
        <div style={{ position: "relative", margin: "4px 14px 0" }}>
          {/* Shimmer while loading */}
          {!imgLoaded && (
            <div style={{
              width: "100%", aspectRatio: "1080/1280", borderRadius: 20,
              background: "linear-gradient(90deg, rgba(13,15,26,0.9) 0%, rgba(30,35,60,0.8) 50%, rgba(13,15,26,0.9) 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmerGal 1.5s ease infinite",
            }} />
          )}
          <img
            src={item.img}
            alt={item.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", aspectRatio: "1080/1280",
              borderRadius: 20, display: "block", objectFit: "cover",
              boxShadow: "0 10px 40px rgba(3,4,8,.55)",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity .4s ease",
            }}
          />

          {/* Gradient bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
            borderRadius: "0 0 20px 20px",
            background: "linear-gradient(0deg, rgba(3,4,8,.8), transparent)",
            pointerEvents: "none",
          }} />

          {/* TOP badge */}
          {item.popular && (
            <div style={{
              position: "absolute", top: 10, left: 10,
              padding: "3px 10px", borderRadius: 999,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 8.5, fontWeight: 900,
              boxShadow: "0 2px 10px rgba(99,102,241,.55)",
              letterSpacing: ".06em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 3,
            }}>★ TOP</div>
          )}

          {/* Views */}
          <div style={{
            position: "absolute", bottom: 10, left: 10,
            padding: "3px 9px", borderRadius: 999,
            background: "rgba(3,4,8,.72)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,.08)",
            color: "rgba(200,210,255,.85)", fontSize: 9, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ opacity: .7 }}>👁</span> {fmtViews(item.views)}
          </div>

          {/* Close button */}
          <button
            className="img-close-btn"
            onClick={onClose}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(3,4,8,.78)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,.14)",
              color: "rgba(200,210,255,.8)", cursor: "pointer",
              fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Info section */}
        <div style={{ padding: "16px 18px 28px" }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 18, fontWeight: 900, color: "rgba(224,231,255,.95)",
                letterSpacing: "-.02em", lineHeight: 1.2, marginBottom: 4,
              }}>{item.title}</div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{
                  fontSize: 10, color: "#818cf8", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: ".08em",
                  background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)",
                  borderRadius: 7, padding: "2px 8px",
                }}>{item.cat}</span>
              </div>
            </div>

            {/* Wishlist btn */}
            <button
              onClick={handleWishlist}
              style={{
                width: 42, height: 42, borderRadius: 14, flexShrink: 0,
                border: `1px solid ${wl ? "rgba(165,180,252,.5)" : "rgba(99,102,241,.18)"}`,
                background: wl ? "rgba(99,102,241,.25)" : "rgba(99,102,241,.06)",
                color: wl ? "#c7d2fe" : "rgba(100,116,139,.65)",
                cursor: "pointer", fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: wl ? "0 4px 16px rgba(99,102,241,.3)" : "none",
                transition: "all .2s ease",
                animation: wlAnimating ? "wlHeartPop .4s ease" : "none",
              }}
            >{wl ? "♥" : "♡"}</button>
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 18 }}>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  padding: "3px 9px", borderRadius: 999,
                  background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.18)",
                  color: "#a5b4fc", fontSize: 9.5, fontWeight: 700,
                }}>#{tag}</span>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="img-order-btn"
              onClick={handleOrder}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: 16,
                padding: "14px", fontSize: 13, fontWeight: 900, cursor: "pointer",
                boxShadow: "0 6px 22px rgba(99,102,241,.42), inset 0 1px 0 rgba(255,255,255,.14)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <span>✈</span>
              {t.orderBtn || "Заказать"}
            </button>

            <button
              className="img-share-btn"
              onClick={handleShare}
              style={{
                width: 48, height: 48, borderRadius: 16, flexShrink: 0,
                background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.20)",
                color: "rgba(165,180,252,.8)", cursor: "pointer", fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >⌗</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
