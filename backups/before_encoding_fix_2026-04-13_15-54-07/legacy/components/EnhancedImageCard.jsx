import React, { useState, useRef, useEffect } from "react";

/**
 * EnhancedImageCard — премиум карточка изображения с продвинутыми эффектами
 * - Parallax hover
 * - Zoom on hover
 * - Gradient overlay
 * - Shimmer loading
 * - Smooth transitions
 */

export default function EnhancedImageCard({
  image,
  title,
  description,
  tags = [],
  views,
  popular = false,
  liked = false,
  onLike,
  onClick,
  onContextMenu,
  sfx,
  style = {},
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleLike = (e) => {
    e.stopPropagation();
    sfx?.like?.();
    onLike?.();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    sfx?.tap?.();
    onContextMenu?.(e);
  };

  const parallaxX = (mousePos.x - 0.5) * 20;
  const parallaxY = (mousePos.y - 0.5) * 20;

  return (
    <>
      <style>{`
        @keyframes imageCardIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shimmerLoad {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes likeHeart {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.1); }
        }
        @keyframes tagFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .image-card {
          animation: imageCardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .image-card:hover {
          transform: translateY(-6px) scale(1.02);
        }
        .image-card:active {
          transform: scale(0.98);
        }
        .image-card-img {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .image-card:hover .image-card-img {
          transform: scale(1.1);
        }
        .like-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .like-btn:active {
          animation: likeHeart 0.4s ease;
        }
        .tag-chip {
          transition: all 0.2s ease;
        }
        .tag-chip:hover {
          transform: translateY(-2px);
          background: rgba(99,102,241,0.25) !important;
        }
      `}</style>

      <div
        ref={cardRef}
        className="image-card"
        onClick={onClick}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsHovered(true);
          sfx?.hover?.();
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          borderRadius: 18,
          overflow: "hidden",
          background: "rgba(13,15,26,0.8)",
          border: "1px solid rgba(99,102,241,0.14)",
          boxShadow: isHovered
            ? "0 16px 48px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.2)"
            : "0 8px 32px rgba(3,4,8,0.4)",
          ...style,
        }}
      >
        {/* Popular badge */}
        {popular && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 3,
              padding: "4px 10px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#fff",
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: ".08em",
              boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            🔥 POPULAR
          </div>
        )}

        {/* Like button */}
        <button
          className="like-btn"
          onClick={handleLike}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 3,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: liked
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "rgba(13,15,26,0.8)",
            backdropFilter: "blur(12px)",
            color: liked ? "#fff" : "rgba(148,163,184,0.7)",
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: liked
              ? "0 4px 16px rgba(239,68,68,0.5)"
              : "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {liked ? "❤" : "♡"}
        </button>

        {/* Image container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 200,
            overflow: "hidden",
            background: "rgba(13,15,26,0.9)",
          }}
        >
          {/* Shimmer loading */}
          {!isLoaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(13,15,26,0.9) 0%, rgba(30,35,60,0.8) 50%, rgba(13,15,26,0.9) 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmerLoad 1.5s ease infinite",
              }}
            />
          )}

          {/* Image */}
          <img
            src={image}
            alt={title}
            className="image-card-img"
            onLoad={() => setIsLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
              transform: isHovered
                ? `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`
                : "none",
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, transparent 0%, rgba(13,15,26,0.4) 50%, rgba(13,15,26,0.9) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Hover glow */}
          {isHovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at ${mousePos.x * 100}% ${
                  mousePos.y * 100
                }%, rgba(99,102,241,0.2) 0%, transparent 60%)`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 12 }}>
          {/* Title */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(224,231,255,0.95)",
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: 11,
                color: "rgba(100,116,139,0.75)",
                marginBottom: 8,
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="tag-chip"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "rgba(165,180,252,0.8)",
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Views */}
          {views && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                color: "rgba(100,116,139,0.7)",
              }}
            >
              <span>👁</span>
              <span>{views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}</span>
            </div>
          )}
        </div>

        {/* Bottom shine */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20%",
            right: "20%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </>
  );
}
