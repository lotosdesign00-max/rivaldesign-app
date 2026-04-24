/**
 * THEMES — Visual theme definitions
 * Single source of truth for theme tokens consumed by all components.
 */

export const THEMES = {
  // ── DEEP SPACE (default) — Rival Space 2.0 ──
  deepspace: {
    id: "deepspace", label: "Deep Space", emoji: "🌌", tone: "dark",
    // Backgrounds
    bg: "#030408",
    nav: "rgba(8,9,20,0.92)",
    card: "rgba(13,15,26,0.80)",
    surface: "rgba(8,9,18,0.70)",
    // Borders
    border: "rgba(99,102,241,0.14)",
    // Accent — indigo-violet nebula
    accent: "#c7d2fe",
    accentB: "#818cf8",
    accentC: "#22d3ee",
    // Glows — real colored glows!
    glow: "rgba(99,102,241,0.35)",
    glowCyan: "rgba(34,211,238,0.25)",
    glowViolet: "rgba(139,92,246,0.30)",
    // Text
    text: "rgba(224,231,255,0.95)",
    sub: "rgba(100,116,139,0.80)",
    hi: "#ffffff",
    // Buttons
    btn: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    btnTxt: "#ffffff",
    // Gradient — indigo to violet
    grad: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #818cf8 100%)",
    gradCyan: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
    // Shadows
    shadow: "0 16px 48px rgba(3,4,8,0.5), 0 0 30px rgba(99,102,241,0.15)",
    shadowGlow: "0 8px 32px rgba(99,102,241,0.40), 0 2px 8px rgba(99,102,241,0.25)",
    // Mesh / extra
    mesh: "radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(139,92,246,0.08) 0%, transparent 55%)",
    tag: "rgba(99,102,241,0.20)",
  },
  graphite: {
    id: "graphite", label: "Graphite", emoji: "⬢", tone: "dark",
    bg: "#07080b",
    nav: "rgba(15,16,22,0.94)",
    card: "rgba(23,24,30,0.86)",
    surface: "rgba(15,16,22,0.88)",
    border: "rgba(255,255,255,0.08)",
    accent: "#f3f4f6",
    accentB: "#d1d5db",
    accentC: "#9ca3af",
    glow: "rgba(255,255,255,0.14)",
    glowCyan: "rgba(255,255,255,0.08)",
    glowViolet: "rgba(255,255,255,0.10)",
    text: "rgba(244,244,245,0.96)",
    sub: "rgba(161,161,170,0.84)",
    hi: "#ffffff",
    btn: "linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)",
    btnTxt: "#111111",
    grad: "linear-gradient(135deg, #ffffff 0%, #d4d4d8 48%, #a1a1aa 100%)",
    gradCyan: "linear-gradient(135deg, #fafafa 0%, #d4d4d8 100%)",
    shadow: "0 16px 48px rgba(0,0,0,0.52), 0 0 24px rgba(255,255,255,0.06)",
    shadowGlow: "0 8px 28px rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.34)",
    mesh: "radial-gradient(ellipse at 18% 0%, rgba(255,255,255,0.06) 0%, transparent 52%), radial-gradient(ellipse at 82% 100%, rgba(255,255,255,0.04) 0%, transparent 48%)",
    tag: "rgba(255,255,255,0.10)",
  },
};

/**
 * Normalize a stored theme ID to a valid THEMES key.
 * Auto-migrates deprecated "graphite" to "deepspace".
 */
export function normalizeThemeId(stored) {
  const id = stored === "graphite" ? "deepspace" : stored;
  return THEMES[id] ? id : "deepspace";
}
