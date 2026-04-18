import React from "react";

const BRAND_LOGO_SRC = "/images/brand/rival-black-hole-logo.png";

function BrandLogo({
  size = 28,
  glowing = false,
  ariaLabel = "Rival Space",
  style,
}) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={ariaLabel}
      width={size}
      height={size}
      decoding="async"
      draggable={false}
      style={{
        display: "block",
        width: size,
        height: size,
        objectFit: "contain",
        mixBlendMode: "screen",
        userSelect: "none",
        pointerEvents: "none",
        filter: glowing
          ? "brightness(1.22) contrast(1.12) drop-shadow(0 0 18px rgba(255,255,255,.34))"
          : "brightness(1.12) contrast(1.08) drop-shadow(0 0 7px rgba(255,255,255,.16))",
        ...style,
      }}
    />
  );
}

export { BRAND_LOGO_SRC };
export default BrandLogo;
