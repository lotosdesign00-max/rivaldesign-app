import React from "react";

/**
 * SkeletonLoader — красивый skeleton loader для загрузки контента
 */

export default function SkeletonLoader({
  variant = "card", // card, text, avatar, image, list
  count = 1,
  style = {},
}) {
  const skeletons = {
    card: (
      <div style={{
        background: "rgba(13,15,26,0.8)",
        borderRadius: 18,
        padding: 16,
        border: "1px solid rgba(99,102,241,0.1)",
        ...style,
      }}>
        <div style={{
          display: "flex",
          gap: 12,
          marginBottom: 12,
        }}>
          <div className="skeleton-pulse" style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
            backgroundSize: "200% 100%",
          }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton-pulse" style={{
              height: 16,
              borderRadius: 8,
              background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
              backgroundSize: "200% 100%",
              marginBottom: 8,
              width: "70%",
            }} />
            <div className="skeleton-pulse" style={{
              height: 12,
              borderRadius: 6,
              background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
              backgroundSize: "200% 100%",
              width: "90%",
            }} />
          </div>
        </div>
        <div className="skeleton-pulse" style={{
          height: 120,
          borderRadius: 12,
          background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
          backgroundSize: "200% 100%",
        }} />
      </div>
    ),
    text: (
      <div className="skeleton-pulse" style={{
        height: 14,
        borderRadius: 7,
        background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
        backgroundSize: "200% 100%",
        ...style,
      }} />
    ),
    avatar: (
      <div className="skeleton-pulse" style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
        backgroundSize: "200% 100%",
        ...style,
      }} />
    ),
    image: (
      <div className="skeleton-pulse" style={{
        width: "100%",
        height: 200,
        borderRadius: 16,
        background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
        backgroundSize: "200% 100%",
        ...style,
      }} />
    ),
    list: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, ...style }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="skeleton-pulse" style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
              backgroundSize: "200% 100%",
            }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton-pulse" style={{
                height: 14,
                borderRadius: 7,
                background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
                backgroundSize: "200% 100%",
                marginBottom: 6,
                width: "60%",
              }} />
              <div className="skeleton-pulse" style={{
                height: 10,
                borderRadius: 5,
                background: "linear-gradient(90deg, rgba(99,102,241,0.08) 25%, rgba(99,102,241,0.15) 50%, rgba(99,102,241,0.08) 75%)",
                backgroundSize: "200% 100%",
                width: "80%",
              }} />
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton-pulse {
          animation: skeletonPulse 2s ease-in-out infinite;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[...Array(count)].map((_, i) => (
          <div key={i}>{skeletons[variant]}</div>
        ))}
      </div>
    </>
  );
}

