const getTg = () => (typeof window !== "undefined" ? window.Telegram?.WebApp : null);

export const TG = getTg();
export const isTg = !!TG;
export const tgUser = TG?.initDataUnsafe?.user;

const isHexColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || ""));

export const tgSupports = (version) => !!getTg()?.isVersionAtLeast?.(version);

export const setCssVar = (name, value) => {
  if (typeof document === "undefined" || value == null || value === "") return;
  document.documentElement.style.setProperty(name, String(value));
};

export const applyTelegramThemeParams = (params = getTg()?.themeParams || {}) => {
  const themeParams = params?.theme_params || params || {};
  const map = {
    bg_color: "--rs-tg-bg",
    text_color: "--rs-tg-text",
    hint_color: "--rs-tg-hint",
    link_color: "--rs-tg-link",
    button_color: "--rs-tg-button",
    button_text_color: "--rs-tg-button-text",
    secondary_bg_color: "--rs-tg-secondary-bg",
    header_bg_color: "--rs-tg-header-bg",
    section_bg_color: "--rs-tg-section-bg",
    section_header_text_color: "--rs-tg-section-header",
    subtitle_text_color: "--rs-tg-subtitle",
    destructive_text_color: "--rs-tg-destructive",
  };

  Object.entries(map).forEach(([key, cssVar]) => {
    const color = themeParams?.[key];
    if (isHexColor(color)) setCssVar(cssVar, color);
  });
};

export const syncTelegramChrome = (theme) => {
  if (typeof document === "undefined") return;
  const tg = getTg();
  const bg = isHexColor(theme?.bg) ? theme.bg : "#030408";
  const header = isHexColor(theme?.nav) ? theme.nav : bg;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);

  try {
    if (tgSupports("6.1")) {
      tg?.setBackgroundColor?.(bg);
      tg?.setHeaderColor?.(header);
    }
  } catch {}
};

export const tgReady = () => {
  const tg = getTg();
  try {
    tg?.ready?.();
    tg?.expand?.();
    if (tgSupports("6.1")) tg?.disableVerticalSwipes?.();
    if (tgSupports("6.1")) tg?.enableClosingConfirmation?.();
  } catch {}
};

export const tgHaptic = (style = "light") => {
  if (!tgSupports("6.1")) return;
  try {
    getTg()?.HapticFeedback?.impactOccurred?.(style);
  } catch {}
};

export const tgHapticImpact = (style = "medium") => {
  if (!tgSupports("6.1")) return;
  try {
    getTg()?.HapticFeedback?.impactOccurred?.(style);
  } catch {}
};

export const tgHapticLight = () => tgHapticImpact("light");
export const tgHapticMedium = () => tgHapticImpact("medium");
export const tgHapticHeavy = () => tgHapticImpact("heavy");
export const tgHapticRigid = () => tgHapticImpact("rigid");
export const tgHapticSoft = () => tgHapticImpact("soft");

export const tgNotif = (type = "success") => {
  if (!tgSupports("6.1")) return;
  try {
    getTg()?.HapticFeedback?.notificationOccurred?.(type);
  } catch {}
};

export const tgNotifSuccess = () => tgNotif("success");
export const tgNotifWarning = () => tgNotif("warning");
export const tgNotifError = () => tgNotif("error");

export const tgSelection = () => {
  if (!tgSupports("6.1")) return;
  try {
    getTg()?.HapticFeedback?.selectionChanged?.();
  } catch {}
};

let activeBackHandler = null;

export const setTelegramBackButton = (handler) => {
  const tg = getTg();
  if (!tgSupports("6.1") || !tg?.BackButton) return () => {};

  try {
    if (activeBackHandler) {
      tg.BackButton.offClick?.(activeBackHandler);
      activeBackHandler = null;
    }

    if (!handler) {
      tg.BackButton.hide?.();
      return () => {};
    }

    activeBackHandler = handler;
    tg.BackButton.show?.();
    tg.BackButton.onClick?.(handler);

    return () => {
      try {
        if (activeBackHandler === handler) {
          tg.BackButton.offClick?.(handler);
          tg.BackButton.hide?.();
          activeBackHandler = null;
        }
      } catch {}
    };
  } catch {
    return () => {};
  }
};

export const bindTelegramTheme = (onChange = applyTelegramThemeParams) => {
  const tg = getTg();
  applyTelegramThemeParams();

  try {
    tg?.onEvent?.("themeChanged", onChange);
  } catch {}

  return () => {
    try {
      tg?.offEvent?.("themeChanged", onChange);
    } catch {}
  };
};

export const bindTelegramViewport = ({ designWidth = 420 } = {}) => {
  if (typeof window === "undefined") return () => {};

  const applyViewport = () => {
    const tg = getTg();
    const root = document.documentElement;
    const visualViewport = window.visualViewport;
    const safe = tg?.contentSafeAreaInset || tg?.contentSafeAreaInsets || tg?.safeAreaInset || tg?.safeAreaInsets || {};
    const top = Number(safe?.top || 0);
    const right = Number(safe?.right || 0);
    const bottom = Number(safe?.bottom || 0);
    const left = Number(safe?.left || 0);
    const visualHeight = Number(visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 0);
    const telegramHeight = Number(tg?.viewportHeight || 0);
    const stableHeight = Number(tg?.viewportStableHeight || telegramHeight || visualHeight || 0);
    const appHeight = Math.max(320, Math.round(telegramHeight || visualHeight || stableHeight || window.innerHeight));
    const viewportWidth = Number(window.innerWidth || document.documentElement.clientWidth || 0);
    const availableWidth = Math.max(320, viewportWidth - left - right);
    const shellWidth = Math.min(designWidth, availableWidth);
    const sideGap = Math.max(14, Math.min(18, shellWidth * 0.04));
    const barGap = Math.max(10, Math.min(14, shellWidth * 0.03));
    const shellScale = 1;
    const coarse = Boolean(window.matchMedia?.("(pointer: coarse)")?.matches);
    const compact = viewportWidth <= 760;
    const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
    const mobile = Boolean(tg || coarse || compact || mobileUa);

    root.style.setProperty("--tg-safe-top", `${top}px`);
    root.style.setProperty("--tg-safe-right", `${right}px`);
    root.style.setProperty("--tg-safe-bottom", `${bottom}px`);
    root.style.setProperty("--tg-safe-left", `${left}px`);
    root.style.setProperty("--tg-app-height", `${appHeight}px`);
    root.style.setProperty("--tg-stable-height", `${Math.max(320, Math.round(stableHeight || appHeight))}px`);
    root.style.setProperty("--tg-visual-height", `${Math.max(320, Math.round(visualHeight || appHeight))}px`);
    root.style.setProperty("--tg-side-gap", `${sideGap}px`);
    root.style.setProperty("--tg-bar-gap", `${barGap}px`);
    root.style.setProperty("--tg-shell-width", `${shellWidth}px`);
    root.style.setProperty("--tg-shell-scale", `${shellScale}`);
    root.dataset.rsMobile = mobile ? "true" : "false";
  };

  let viewportRaf = 0;
  const syncViewport = () => {
    if (viewportRaf) window.cancelAnimationFrame(viewportRaf);
    viewportRaf = window.requestAnimationFrame(() => {
      viewportRaf = 0;
      applyViewport();
    });
  };

  applyViewport();
  window.addEventListener("resize", syncViewport, { passive: true });
  window.addEventListener("orientationchange", syncViewport, { passive: true });
  window.visualViewport?.addEventListener?.("resize", syncViewport, { passive: true });
  window.visualViewport?.addEventListener?.("scroll", syncViewport, { passive: true });

  const tg = getTg();
  try {
    tg?.onEvent?.("viewportChanged", syncViewport);
    tg?.onEvent?.("safeAreaChanged", syncViewport);
    tg?.onEvent?.("contentSafeAreaChanged", syncViewport);
  } catch {}

  return () => {
    if (viewportRaf) window.cancelAnimationFrame(viewportRaf);
    window.removeEventListener("resize", syncViewport);
    window.removeEventListener("orientationchange", syncViewport);
    window.visualViewport?.removeEventListener?.("resize", syncViewport);
    window.visualViewport?.removeEventListener?.("scroll", syncViewport);
    try {
      tg?.offEvent?.("viewportChanged", syncViewport);
      tg?.offEvent?.("safeAreaChanged", syncViewport);
      tg?.offEvent?.("contentSafeAreaChanged", syncViewport);
    } catch {}
  };
};

export const openTelegramLink = (url) => {
  const tg = getTg();
  try {
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(url);
      return;
    }
  } catch {
    // Fall through to browser fallback.
  }
  window.open(url, "_blank");
};

export const openExternalLink = (url) => {
  const tg = getTg();
  try {
    if (tg?.openLink) {
      tg.openLink(url);
      return;
    }
  } catch {
    // Fall through to browser fallback.
  }
  window.open(url, "_blank");
};

export const openInvoice = (invoiceLink, callback) => {
  const tg = getTg();
  if (tg?.openInvoice) {
    tg.openInvoice(invoiceLink, callback);
    return true;
  }
  return false;
};
