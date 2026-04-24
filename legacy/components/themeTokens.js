export function getThemeTokens(th) {
  const isGraphite = th?.id === "graphite";

  return {
    isGraphite,
    appBg: th?.bg || "#030408",
    bodyText: th?.text || "rgba(224,231,255,.95)",
    panel: `linear-gradient(180deg, ${th?.card || "rgba(13,15,26,.8)"} 0%, ${th?.surface || "rgba(8,9,18,.7)"} 100%)`,
    panelStrong: isGraphite
      ? "linear-gradient(180deg, rgba(24,25,30,.98) 0%, rgba(14,15,20,1) 100%)"
      : "linear-gradient(180deg, rgba(13,15,26,.97) 0%, rgba(8,9,20,1) 100%)",
    panelSoft: isGraphite
      ? "linear-gradient(180deg, rgba(22,23,29,.88) 0%, rgba(15,16,22,.94) 100%)"
      : "linear-gradient(180deg, rgba(13,15,26,.85) 0%, rgba(8,9,20,.9) 100%)",
    inputBg: isGraphite ? "rgba(18,19,24,.88)" : "rgba(13,15,26,.75)",
    inputBgFocus: isGraphite ? "rgba(26,27,33,.96)" : "rgba(18,20,36,.9)",
    soft: isGraphite ? "rgba(255,255,255,.06)" : "rgba(99,102,241,.10)",
    softAlt: isGraphite ? "rgba(255,255,255,.08)" : "rgba(99,102,241,.14)",
    softStrong: isGraphite ? "rgba(255,255,255,.12)" : "rgba(99,102,241,.18)",
    softBorder: isGraphite ? "rgba(255,255,255,.12)" : "rgba(99,102,241,.18)",
    softBorderStrong: isGraphite ? "rgba(255,255,255,.22)" : "rgba(99,102,241,.35)",
    softBorderBright: isGraphite ? "rgba(255,255,255,.30)" : "rgba(99,102,241,.5)",
    chipBg: isGraphite ? "rgba(255,255,255,.08)" : "rgba(99,102,241,.14)",
    chipBorder: isGraphite ? "rgba(255,255,255,.14)" : "rgba(99,102,241,.25)",
    chipText: isGraphite ? "rgba(244,244,245,.82)" : "rgba(165,180,252,.85)",
    ghostBg: isGraphite ? "rgba(255,255,255,.05)" : "rgba(99,102,241,.08)",
    ghostBgStrong: isGraphite ? "rgba(255,255,255,.1)" : "rgba(99,102,241,.16)",
    ghostBorder: isGraphite ? "rgba(255,255,255,.1)" : "rgba(99,102,241,.14)",
    ghostBorderStrong: isGraphite ? "rgba(255,255,255,.24)" : "rgba(99,102,241,.32)",
    mutedText: isGraphite ? "rgba(212,212,216,.8)" : "rgba(165,180,252,.82)",
    microText: isGraphite ? "rgba(161,161,170,.76)" : "rgba(100,116,139,.75)",
    titleGrad: isGraphite
      ? "linear-gradient(135deg, #ffffff 0%, #d4d4d8 55%, #a1a1aa 100%)"
      : "linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 50%, #8b5cf6 100%)",
    accentFill: isGraphite ? "rgba(255,255,255,.14)" : "rgba(99,102,241,.18)",
    accentFillStrong: isGraphite ? "rgba(255,255,255,.2)" : "rgba(99,102,241,.25)",
    accentBorder: isGraphite ? "rgba(255,255,255,.24)" : "rgba(99,102,241,.36)",
    glowLine: isGraphite
      ? "linear-gradient(90deg, transparent, rgba(255,255,255,.75), rgba(212,212,216,.55), transparent)"
      : "linear-gradient(90deg, transparent, rgba(99,102,241,.8), rgba(139,92,246,.65), transparent)",
    orbMain: isGraphite
      ? "radial-gradient(circle, rgba(255,255,255,.14) 0%, transparent 68%)"
      : "radial-gradient(circle, rgba(99,102,241,.18) 0%, transparent 68%)",
    orbSecondary: isGraphite
      ? "radial-gradient(circle, rgba(255,255,255,.09) 0%, transparent 68%)"
      : "radial-gradient(circle, rgba(139,92,246,.14) 0%, transparent 68%)",
    shadowSoft: isGraphite
      ? "0 8px 28px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.05)"
      : "0 8px 28px rgba(3,4,8,.34), inset 0 1px 0 rgba(255,255,255,.05)",
    shadowMedium: isGraphite
      ? "0 14px 40px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06)"
      : "0 12px 40px rgba(3,4,8,.4), inset 0 1px 0 rgba(255,255,255,.06)",
    shadowAccent: isGraphite
      ? "0 10px 30px rgba(255,255,255,.08), inset 0 1px 0 rgba(255,255,255,.08)"
      : "0 10px 30px rgba(99,102,241,.22), inset 0 1px 0 rgba(255,255,255,.08)",
    // Direct accent colors — consistent brand colors (work across both themes)
    accent: "#6366f1",
    accentB: "#8b5cf6",
    cyan: "#22d3ee",
    emerald: "#10b981",
    gold: "#f59e0b",
    red: "#ef4444",
    // Aliases for DS compatibility
    text: th?.text || "rgba(224,231,255,.95)",
    sub: th?.sub || "rgba(100,116,139,.8)",
    border: th?.border || "rgba(99,102,241,0.14)",
    btnTxt: th?.btnTxt || "#ffffff",
    card: th?.card || "rgba(13,15,26,0.80)",
    surface: th?.surface || "rgba(8,9,18,0.70)",

    // Typography scale (consistent across app)
    fontSize: {
      xs: 10,
      sm: 12,
      base: 14,
      md: 16,
      lg: 18,
      xl: 22,
      "2xl": 26,
      "3xl": 32,
    },
    // Font weights (consistent)
    fontWeight: {
      normal: 400,
      medium: 600,
      bold: 700,
      black: 900,
    },
    // Spacing (8px rhythm)
    space: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      "2xl": 32,
      "3xl": 48,
    },
    // Border radius (consistent)
    radius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 22,
      full: 999,
    },
    // Shadows (consistent elevation)
    elevation: {
      sm: "0 2px 8px rgba(3,4,8,0.2)",
      md: "0 4px 16px rgba(3,4,8,0.25)",
      lg: "0 8px 28px rgba(3,4,8,0.3)",
      xl: "0 12px 40px rgba(3,4,8,0.35)",
    },
  };
}
