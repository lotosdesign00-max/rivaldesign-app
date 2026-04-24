import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import TypewriterText from "./components/TypewriterText";
import MeshBg from "./components/MeshBg";
import Confetti from "./components/Confetti";
import Sparkles from "./components/Sparkles";
import ToastSystem from "./components/ToastSystem";
import AchievementPopup from "./components/AchievementPopup";
import BottomNav from "./components/BottomNav";
import SideDrawer from "./components/SideDrawer";
import ImageModal from "./components/ImageModal";
import SplashScreen from "./components/SplashScreen";
import BrandLogo from "./components/BrandLogo";
import AchievementDetailModal from "./components/AchievementDetailModal";
import HomeTab from "./components/HomeTab";
import SystemIcon from "./components/SystemIcon";
import PaymentDetailsModal from "./components/PaymentDetailsModal";
import {
  TG,
  isTg,
  tgUser,
  tgReady,
  tgHaptic,
  tgNotif,
  tgSelection,
  bindTelegramTheme,
  bindTelegramViewport,
  setTelegramBackButton,
  syncTelegramChrome,
  openTelegramLink,
  openExternalLink,
  openInvoice as openTelegramInvoice,
} from "./utils/tma";
import { cancelIdle, makeLazyPreloader, markInteraction, runAfterTap, scheduleIdle } from "./utils/performance";

// ── EXTRACTED MODULES (Phase A: Foundation) ──
import {
  THEMES, normalizeThemeId,
  LANGS, T,
  GALLERY, CAT_ICONS,
  COURSES, COURSE_CATS,
  REVIEWS, SERVICES, PROMO_CODES,
  DESIGN_PACK_CONFIG, MOCK_DESIGN_PACK,
  ACHIEVEMENTS,
  QUIZ_DATA, getQuizForToday, FAQ_DATA,
  AI_IDEA_PROMPTS_RU, AI_IDEA_PROMPTS_EN,
} from "./data";
import { SFX, setSoundEnabled, setVolume as setSfxVolume } from "./audio/sfx";
import { ls, openTg, collectLocalSettings, hydrateLocalSettings, shouldSyncSettingKey } from "./utils/lsEngine";
import {
  roundMoney, moneyUsd, makeEntityId,
  STARS_UAH_PER_STAR, REMOTE_BRIEF_MARK,
  encodeRemoteBrief, decodeRemoteBrief,
  deriveBotInvoiceUrl, deriveInvoiceHash,
  getLangConfigByCode, getUahPerUsd, getLocalPerStar, estimateStarsFromUsd,
} from "./utils/money";
import { getStreak, saveStreak, addXP, getLevel, getLevelXP, getLevelProgress, getGreeting } from "./utils/gamification";

const loadGalleryTab = () => import("./components/GalleryTab");
const loadAITab = () => import("./components/AITab");
const loadCoursesTab = () => import("./components/CoursesTab");
const loadPricingTab = () => import("./components/PricingTab");
const loadMoreTab = () => import("./components/MoreTab");
const loadProfileTab = () => import("./components/ProfileTab");
const TAB_LOADERS = {
  gallery: loadGalleryTab,
  ai: loadAITab,
  courses: loadCoursesTab,
  pricing: loadPricingTab,
  more: loadMoreTab,
  profile: loadProfileTab,
};
const GalleryTab = React.lazy(loadGalleryTab);
const AITab = React.lazy(loadAITab);
const CoursesTab = React.lazy(loadCoursesTab);
const PricingTab = React.lazy(loadPricingTab);
const MoreTab = React.lazy(loadMoreTab);
const ProfileTab = React.lazy(loadProfileTab);
const preloadLazyTab = makeLazyPreloader(TAB_LOADERS);
const preloadLazyTabs = () => {
  const queue = Object.keys(TAB_LOADERS);
  let index = 0;
  const loadNext = () => {
    const tabId = queue[index];
    index += 1;
    if (!tabId) return;
    preloadLazyTab(tabId)?.catch(() => {}).finally(() => {
      if (index >= queue.length) return;
      scheduleIdle(loadNext, 1200);
    });
  };
  loadNext();
};
const preloadTabById = (tabId) => {
  preloadLazyTab(tabId)?.catch(() => {});
};

// Data models, utilities, audio engine extracted to ./data/, ./utils/, ./audio/

const OrbitalMark = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", filter: "drop-shadow(0 0 6px rgba(255,255,255,.16))" }}
  >
    {/* Анимированное внешнее кольцо — медленное вращение */}
    <circle
      cx="32" cy="32" r="19.5"
      stroke="rgba(255,255,255,.14)"
      strokeWidth="1.25"
      style={{
        animation: "orbitalRingRotate 12s linear infinite",
        transformOrigin: "32px 32px",
      }}
    />
    {/* Внутренний круг — пульсация */}
    <circle
      cx="32" cy="32" r="15.5"
      fill="#050608"
      style={{
        animation: "orbitalCorePulse 3.5s ease-in-out infinite",
        transformOrigin: "32px 32px",
      }}
    />
    <path
      d="M32 11.5c-10.8 0-19.5 8.7-19.5 19.5S21.2 50.5 32 50.5 51.5 41.8 51.5 31 42.8 11.5 32 11.5Zm0 6.2c7.37 0 13.3 5.93 13.3 13.3S39.37 44.3 32 44.3 18.7 38.37 18.7 31 24.63 17.7 32 17.7Z"
      fill="#F6F8FB"
      style={{ animation: "orbitalCorePulse 3.5s ease-in-out infinite", transformOrigin: "32px 32px" }}
    />
    {/* Диагональная линия — мерцание */}
    <path
      d="M10 53.4 49.6 10.6c1.5-1.62 3.95-1.79 5.66-.39 1.7 1.39 2.07 3.88.84 5.71L18.1 54.26c-1.48 1.81-4.11 2.13-5.98.73-1.88-1.41-2.26-4.08-.86-5.99Z"
      fill="url(#orbitalSlash)"
      style={{ animation: "orbitalSlashGlow 3.5s ease-in-out infinite" }}
    />
    <path
      d="M15 51.8 52.8 13"
      stroke="rgba(255,255,255,.38)"
      strokeWidth="1.2"
      strokeLinecap="round"
      style={{ animation: "orbitalSlashGlow 3.5s ease-in-out infinite" }}
    />
    <defs>
      <linearGradient id="orbitalSlash" x1="13.2" y1="51.8" x2="53.9" y2="12.1" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" stopOpacity=".02" />
        <stop offset=".18" stopColor="#D6D9DE" />
        <stop offset=".5" stopColor="#636972" />
        <stop offset=".82" stopColor="#EEF2F7" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity=".04" />
      </linearGradient>
    </defs>
  </svg>
);



// ── ANIMATED MESH BG ──


// ── CONFETTI ──


// ── SPARKLES EFFECT ──


// ── TOAST ──



// ── ACHIEVEMENT POPUP ──


// ── BOTTOM NAV ──



// ── SIDE DRAWER ──


// ── SKELETON ──
function Skeleton({ w = "100%", h = 16, r = 8, th }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: th.border, animation: "shimmer 1.5s ease infinite" }} />;
}

// ── HOME TAB ──


// ── GALLERY TAB ──


// ── COURSES TAB ──


// ── PRICING TAB ──


// ── FREE PACK TAB ──


// ── MORE TAB ──


// ── IMAGE MODAL ──


// ── SPLASH ──


// ── PROFILE TAB ──


// ── ACHIEVEMENT DETAIL MODAL ──


// ── MAIN APP ──
export default function App() {
  const mainRef = useRef(null);
  
  const [theme, setTheme] = useState(() => {
    const stored = ls.get("rs_theme4", "graphite");
    const schema = ls.get("rs_theme_schema4", "v1");
    const id = schema === "v1" && stored === "graphite" ? "deepspace" : normalizeThemeId(stored);
    return THEMES[id] || THEMES.deepspace;
  });
  const [lang, setLang] = useState(() => { const l = ls.get("rs_lang4", "ru"); return LANGS[l] ? l : "ru"; });
  const [soundOn, setSoundOn] = useState(() => { const s = ls.get("rs_sound4", true); setSoundEnabled(s); return s; });
  const [volume, setVolume] = useState(() => { const v = ls.get("rs_volume4", .55); setSfxVolume(v); return v; });
  const [tab, setTab] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState(() => ls.get("rs_cart4", []));
  const [wishlist, setWishlist] = useState(() => ls.get("rs_wl4", []));
  const [walletBalance, setWalletBalance] = useState(() => roundMoney(ls.get("rs_wallet_balance4", 0)));
  const [paymentHistory, setPaymentHistory] = useState(() => ls.get("rs_payment_history4", []));
  const [orders, setOrders] = useState(() => ls.get("rs_orders4", []));
  const [remoteSync, setRemoteSync] = useState({ enabled: false, ready: false, user: null });
  const [managedContent, setManagedContent] = useState(null);
  const [splash, setSplash] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selImage, setSelImage] = useState(null);
  const [streak, setStreak] = useState(() => getStreak());
  const [pendingAchieve, setPendingAchieve] = useState(null);
  const [achievements, setAchievements] = useState(() => {
    const streakData = ls.get("rs_streak4", { achievementsUnlocked: [] });
    const unlockedIds = streakData.achievementsUnlocked || [];
    return unlockedIds.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
  });
  const [sparkles, setSparkles] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ level: 0, xp: 0 });
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const remoteSettingsAppliedRef = useRef(false);
  const remoteSettingsReadyRef = useRef(false);
  const remoteSettingsQueueRef = useRef({});
  const remoteSettingsTimerRef = useRef(null);
  const scrollRelaxTimerRef = useRef(null);
  const scrollFrameRef = useRef(0);

  useEffect(() => { setSoundEnabled(soundOn); }, [soundOn]);
  useEffect(() => { setSfxVolume(volume); }, [volume]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const isMobilePerf = document.documentElement.dataset.rsMobile === "true";
    if (isMobilePerf) return undefined;

    const runPreload = () => preloadLazyTabs();
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(runPreload, { timeout: 1800 });
      return () => window.cancelIdleCallback?.(idleId);
    }
    const timer = window.setTimeout(runPreload, 900);
    return () => window.clearTimeout(timer);
  }, []);

  const th = theme;
  const t = T[lang] || T.ru;
  const liveLangs = managedContent?.langs || LANGS;
  const liveGallery = managedContent?.gallery || GALLERY;
  const liveCourses = managedContent?.courses || COURSES;
  const liveReviews = managedContent?.reviews || REVIEWS;
  const liveServices = managedContent?.services || SERVICES;
  const liveFaq = managedContent?.faq || FAQ_DATA;
  const liveHome = managedContent?.home || {};
  const appGlobals = useMemo(() => ({
    THEMES,
    LANGS: liveLangs,
    PROMO_CODES,
    SERVICES: liveServices,
    SFX,
    openTg,
    tgUser,
    isTg,
    ls,
    STARS_UAH_PER_STAR,
    getLocalPerStar,
    estimateStarsFromUsd,
    COURSES: liveCourses,
    COURSE_CATS,
    ACHIEVEMENTS,
    getLevel,
    getLevelProgress,
    getStreak,
    saveStreak,
    addXP,
    getQuizForToday,
    getGreeting,
    COURSES_DATA: liveCourses,
    QUIZ_DATA,
    DESIGN_PACK_CONFIG,
    MOCK_DESIGN_PACK,
    CAT_ICONS,
    GALLERY: liveGallery,
    getLevelXP,
    AI_IDEA_PROMPTS_EN,
    AI_IDEA_PROMPTS_RU,
    FAQ_DATA: liveFaq,
    REVIEWS: liveReviews,
    HOME_CONTENT: liveHome,
  }), [liveCourses, liveFaq, liveGallery, liveHome, liveLangs, liveReviews, liveServices, openTg]);

  const changeTab = useCallback((nextTab) => {
    if (!nextTab) return;
    preloadTabById(nextTab);
    runAfterTap(() => {
      setTab((current) => (current === nextTab ? current : nextTab));
    });
  }, []);

  const createSparkles = (x, y) => {
    if (typeof document !== "undefined" && document.documentElement.dataset.rsPower === "eco") return null;
    const sparkId = Date.now();
    setSparkles({ id: sparkId, x, y });
    setTimeout(() => setSparkles(null), 600);
    return sparkId;
  };

  useEffect(() => {
    tgReady();
    return bindTelegramTheme();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const syncVisibility = () => {
      document.documentElement.toggleAttribute("data-rs-paused", document.hidden);
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return undefined;
    const mediaQueries = [
      window.matchMedia?.("(pointer: coarse)"),
      window.matchMedia?.("(max-width: 760px)"),
      window.matchMedia?.("(prefers-reduced-motion: reduce)"),
    ].filter(Boolean);

    const syncPerformanceMode = () => {
      const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
      const narrow = window.matchMedia?.("(max-width: 760px)")?.matches;
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const saveData = Boolean(navigator.connection?.saveData);
      const lowMemory = Number(navigator.deviceMemory || 8) <= 4;
      const lowCore = Number(navigator.hardwareConcurrency || 8) <= 4;
      const mobileLike = Boolean(isTg || (coarse && narrow));
      const smooth = Boolean(reduced || saveData || mobileLike || lowMemory || lowCore);
      document.documentElement.dataset.rsPerformance = smooth ? "smooth" : "full";
      document.documentElement.dataset.rsPower = smooth ? "eco" : "full";
    };

    syncPerformanceMode();
    mediaQueries.forEach((query) => query.addEventListener?.("change", syncPerformanceMode));
    return () => {
      mediaQueries.forEach((query) => query.removeEventListener?.("change", syncPerformanceMode));
    };
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || typeof document === "undefined" || !navigator.getBattery) return undefined;
    let battery = null;
    let disposed = false;

    const syncBatteryMode = () => {
      if (!battery || disposed) return;
      const lowBattery = !battery.charging && Number(battery.level || 1) <= 0.36;
      if (!lowBattery) return;
      document.documentElement.dataset.rsPower = "eco";
      document.documentElement.dataset.rsPerformance = "smooth";
    };

    navigator.getBattery()
      .then((nextBattery) => {
        if (disposed) return;
        battery = nextBattery;
        syncBatteryMode();
        battery.addEventListener?.("levelchange", syncBatteryMode);
        battery.addEventListener?.("chargingchange", syncBatteryMode);
      })
      .catch(() => {});

    return () => {
      disposed = true;
      battery?.removeEventListener?.("levelchange", syncBatteryMode);
      battery?.removeEventListener?.("chargingchange", syncBatteryMode);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return undefined;
    const root = document.documentElement;
    let idleTimer = 0;
    let lastActivity = 0;

    const settleIdle = () => {
      if (root.dataset.rsScrolling === "true") return;
      root.dataset.rsIdle = "true";
    };

    const markAwake = () => {
      const now = window.performance?.now?.() || Date.now();
      if (now - lastActivity < 140) return;
      lastActivity = now;
      root.dataset.rsIdle = "false";
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(settleIdle, root.dataset.rsPower === "eco" ? 900 : 1800);
    };

    markAwake();
    window.addEventListener("pointerdown", markAwake, { passive: true });
    window.addEventListener("touchmove", markAwake, { passive: true });
    window.addEventListener("keydown", markAwake);

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(scrollRelaxTimerRef.current);
      if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
      window.removeEventListener("pointerdown", markAwake);
      window.removeEventListener("touchmove", markAwake);
      window.removeEventListener("keydown", markAwake);
      delete root.dataset.rsIdle;
      delete root.dataset.rsScrolling;
    };
  }, []);

  const markScrollActivity = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (scrollFrameRef.current) return;
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = 0;
      const root = document.documentElement;
      root.dataset.rsScrolling = "true";
      root.dataset.rsIdle = "false";
      window.clearTimeout(scrollRelaxTimerRef.current);
      scrollRelaxTimerRef.current = window.setTimeout(() => {
        delete root.dataset.rsScrolling;
        root.dataset.rsIdle = "true";
      }, root.dataset.rsPower === "eco" ? 180 : 260);
    });
  }, []);

  useEffect(() => {
    syncTelegramChrome(th);
  }, [th.bg, th.nav]);

  useLayoutEffect(() => {
    return bindTelegramViewport({ designWidth: 420 });
  }, []);

  useEffect(() => {
    fetch("/api/public-content")
      .then((response) => response.json())
      .then((json) => {
        if (json?.ok && json?.result) {
          setManagedContent(json.result);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.__RIVAL_GLOBALS = appGlobals;
  }, [appGlobals]);
  
  useEffect(() => {
    const shouldShowBack = tab !== "home" || selImage || drawerOpen;
    if (!shouldShowBack) return setTelegramBackButton(null);

    return setTelegramBackButton(() => {
      if (selImage) {
        setSelImage(null);
        SFX.close();
        return;
      }
      if (drawerOpen) {
        setDrawerOpen(false);
        SFX.close();
        return;
      }
      changeTab("home");
      SFX.tab();
    });
  }, [tab, selImage, drawerOpen, changeTab]);

  useLayoutEffect(() => {
    if (!mainRef.current) return;
    const el = mainRef.current;
    const prevBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    el.scrollTop = 0;
    if (typeof el.scrollTo === "function") {
      el.scrollTo({ top: 0, behavior: "auto" });
    }
    void el.offsetHeight;
    el.style.scrollBehavior = prevBehavior;
  }, [tab]);

  useEffect(() => {
    if (new Date().getHours() >= 23) unlockAchievement("night_owl");
    unlockAchievement("first_visit");
  }, []);

  useEffect(() => {
    const s = getStreak();
    setStreak(s);
    if (s.count >= 3) setTimeout(() => { unlockAchievement("streak_3"); }, 2000);
    if (s.count >= 7) setTimeout(() => { unlockAchievement("streak_7"); }, 2500);
    if (s.count > 1) setTimeout(() => { SFX.streak(); showToast(`🔥 ${s.count} ${t.streakTitle}!`, "success"); }, 1500);
  }, []);

  useEffect(() => {
    const task = scheduleIdle(() => ls.set("rs_cart4", cart), 500);
    return () => cancelIdle(task);
  }, [cart]);
  useEffect(() => {
    const task = scheduleIdle(() => ls.set("rs_wl4", wishlist), 500);
    return () => cancelIdle(task);
  }, [wishlist]);
  useEffect(() => {
    const task = scheduleIdle(() => ls.set("rs_wallet_balance4", walletBalance), 500);
    return () => cancelIdle(task);
  }, [walletBalance]);
  useEffect(() => {
    const task = scheduleIdle(() => ls.set("rs_payment_history4", paymentHistory), 700);
    return () => cancelIdle(task);
  }, [paymentHistory]);
  useEffect(() => {
    const task = scheduleIdle(() => ls.set("rs_orders4", orders), 700);
    return () => cancelIdle(task);
  }, [orders]);

  useEffect(() => {
    setPaymentHistory(prev => prev.map((payment) => {
      const botUrl = payment?.cryptoInvoiceUrls?.bot || deriveBotInvoiceUrl(payment?.cryptoInvoiceUrl || payment?.cryptoInvoiceUrls?.mini || payment?.cryptoInvoiceUrls?.web || "");
      if (!botUrl || payment?.cryptoInvoiceUrl === botUrl) return payment;
      return {
        ...payment,
        cryptoInvoiceHash: payment?.cryptoInvoiceHash || deriveInvoiceHash(payment?.cryptoInvoiceUrl || payment?.cryptoInvoiceUrls?.mini || payment?.cryptoInvoiceUrls?.web || ""),
        cryptoInvoiceUrl: botUrl,
        cryptoInvoiceUrls: {
          mini: payment?.cryptoInvoiceUrls?.mini || "",
          bot: botUrl,
          web: payment?.cryptoInvoiceUrls?.web || payment?.cryptoInvoiceUrl || "",
        },
      };
    }));

    setOrders(prev => prev.map((order) => {
      const botUrl = order?.cryptoInvoiceUrls?.bot || deriveBotInvoiceUrl(order?.cryptoInvoiceUrl || order?.cryptoInvoiceUrls?.mini || order?.cryptoInvoiceUrls?.web || "");
      if (!botUrl || order?.cryptoInvoiceUrl === botUrl) return order;
      return {
        ...order,
        cryptoInvoiceHash: order?.cryptoInvoiceHash || deriveInvoiceHash(order?.cryptoInvoiceUrl || order?.cryptoInvoiceUrls?.mini || order?.cryptoInvoiceUrls?.web || ""),
        cryptoInvoiceUrl: botUrl,
        cryptoInvoiceUrls: {
          mini: order?.cryptoInvoiceUrls?.mini || "",
          bot: botUrl,
          web: order?.cryptoInvoiceUrls?.web || order?.cryptoInvoiceUrl || "",
        },
      };
    }));
  }, []);

  // Track tabs visited
  useEffect(() => {
    setStreak(prev => {
      const tabs = [...new Set([...(prev.tabsVisited || []), tab])];
      if (tabs.length >= 5 && !prev.achievementsUnlocked?.includes("explorer")) {
        setTimeout(() => unlockAchievement("explorer"), 500);
      }
      const newData = { ...prev, tabsVisited: tabs };
      saveStreak(newData);
      return newData;
    });
  }, [tab]);

  // Wishlist achievement
  useEffect(() => {
    if (wishlist.length >= 5) unlockAchievement("wishlist_5");
  }, [wishlist]);

  const showToast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  }, []);

  const postLegacySync = useCallback(async (endpoint, payload = {}) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        telegramUser: tgUser || null,
        telegramInitData: TG?.initData || "",
      }),
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.ok) {
      throw new Error(json?.error || "Legacy sync request failed");
    }
    return json.result;
  }, []);

  const flushRemoteSettings = useCallback(async () => {
    if (!remoteSync.user || !remoteSettingsReadyRef.current) return;
    const patch = remoteSettingsQueueRef.current;
    remoteSettingsQueueRef.current = {};
    if (!patch || !Object.keys(patch).length) return;
    try {
      await postLegacySync("/api/legacy-sync/save-settings", { settings: patch });
    } catch {}
  }, [postLegacySync, remoteSync.user]);

  const queueRemoteSetting = useCallback((key, value) => {
    if (!remoteSync.user || !remoteSettingsReadyRef.current || !shouldSyncSettingKey(key)) return;
    remoteSettingsQueueRef.current = {
      ...remoteSettingsQueueRef.current,
      [key]: value,
    };
    if (remoteSettingsTimerRef.current) clearTimeout(remoteSettingsTimerRef.current);
    remoteSettingsTimerRef.current = setTimeout(() => {
      remoteSettingsTimerRef.current = null;
      flushRemoteSettings();
    }, 650);
  }, [flushRemoteSettings, remoteSync.user]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    window.__RIVAL_REMOTE_SETTINGS_SYNC = queueRemoteSetting;
    return () => {
      if (window.__RIVAL_REMOTE_SETTINGS_SYNC === queueRemoteSetting) {
        window.__RIVAL_REMOTE_SETTINGS_SYNC = null;
      }
    };
  }, [queueRemoteSetting]);

  useEffect(() => () => {
    if (remoteSettingsTimerRef.current) clearTimeout(remoteSettingsTimerRef.current);
  }, []);

  const applyRemoteSettings = useCallback((settings = {}) => {
    if (!settings || typeof settings !== "object") return false;
    const keys = Object.keys(settings).filter(shouldSyncSettingKey);
    if (!keys.length) return false;

    remoteSettingsReadyRef.current = false;
    hydrateLocalSettings(settings);

    if (settings.rs_theme4) {
      setTheme(THEMES[normalizeThemeId(settings.rs_theme4)] || THEMES.deepspace);
    }
    if (settings.rs_lang4 && LANGS[settings.rs_lang4]) {
      setLang(settings.rs_lang4);
    }
    if (typeof settings.rs_sound4 === "boolean") {
      setSoundEnabled(settings.rs_sound4);
      setSoundOn(settings.rs_sound4);
    }
    if (typeof settings.rs_volume4 === "number") {
      const nextVolume = Math.max(0, Math.min(1, settings.rs_volume4));
      setSfxVolume(nextVolume);
      setVolume(nextVolume);
    }
    if (Array.isArray(settings.rs_cart4)) {
      setCart(settings.rs_cart4);
    }
    if (Array.isArray(settings.rs_wl4)) {
      setWishlist(settings.rs_wl4);
    }
    if (settings.rs_streak4 && typeof settings.rs_streak4 === "object") {
      setStreak(settings.rs_streak4);
      const unlockedIds = settings.rs_streak4.achievementsUnlocked || [];
      setAchievements(unlockedIds.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean));
    }

    return true;
  }, []);

  const syncRemoteState = useCallback(async ({ forceApply = false, silent = true } = {}) => {
    if (!tgUser?.id) return null;

    try {
      const result = await postLegacySync("/api/legacy-sync/bootstrap");
      const remoteUser = result?.user || null;
      const remotePayments = Array.isArray(result?.payments) ? result.payments : [];
      const remoteOrders = Array.isArray(result?.orders) ? result.orders : [];
      const remoteMessages = Array.isArray(result?.messages) ? result.messages : [];
      const remoteSettings = result?.settings && typeof result.settings === "object" ? result.settings : {};
      const hasRemoteSettings = Object.keys(remoteSettings).some(shouldSyncSettingKey);

      setRemoteSync({ enabled: true, ready: true, user: remoteUser });

      if (!remoteSettingsAppliedRef.current) {
        if (hasRemoteSettings) {
          applyRemoteSettings(remoteSettings);
        }
        remoteSettingsAppliedRef.current = true;
      }

      const paymentById = Object.fromEntries(remotePayments.map((item) => [item.id, item]));
      const orderByPaymentId = Object.fromEntries(
        remoteOrders.filter((item) => item.payment_id).map((item) => [item.payment_id, item])
      );
      const messagesByOrderId = remoteMessages.reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item);
        return acc;
      }, {});

      const mappedPayments = remotePayments.map((payment) => {
        const linkedOrder = orderByPaymentId[payment.id] || null;
        const derivedStatus = payment.status === "pending" && linkedOrder?.status === "payment_review"
          ? "review"
          : payment.status;
        const derivedBotUrl = deriveBotInvoiceUrl(payment.crypto_pay_url || "");

        return {
          id: `remote_payment_${payment.id}`,
          remotePaymentId: payment.id,
          orderId: linkedOrder?.id || null,
          remoteOrderId: linkedOrder?.id || null,
          type: linkedOrder ? "order" : "topup",
          method: payment.payment_method || "cryptobot",
          title: linkedOrder ? `${lang === "en" ? "Order" : "Заказ"} #${linkedOrder.order_number || linkedOrder.id.slice(0, 6)}` : (lang === "en" ? "Balance top-up" : "Пополнение баланса"),
          amountUSD: roundMoney(payment.amount),
          status: derivedStatus || "pending",
          createdAt: payment.created_at,
          paidAt: payment.paid_at || null,
          cryptoInvoiceId: payment.crypto_invoice_id || null,
          cryptoInvoiceHash: deriveInvoiceHash(payment.crypto_pay_url || ""),
          cryptoInvoiceUrl: derivedBotUrl || payment.crypto_pay_url || "",
          cryptoInvoiceUrls: {
            mini: payment.crypto_pay_url?.includes?.("startapp=invoice-") ? payment.crypto_pay_url : "",
            bot: derivedBotUrl || (payment.crypto_pay_url?.includes?.("t.me/CryptoBot?start=") ? payment.crypto_pay_url : ""),
            web: payment.crypto_pay_url || "",
          },
        };
      });

      const mappedOrders = remoteOrders.map((order) => {
        const { userBrief, meta } = decodeRemoteBrief(order.brief || "");
        const linkedPayment = order.payment_id ? paymentById[order.payment_id] : null;
        const rawMessages = messagesByOrderId[order.id] || [];
        const fallbackIntro = linkedPayment?.status === "paid"
          ? (lang === "en" ? "Order accepted. I will keep the progress updated here." : "Заказ принят. Дальше я буду обновлять прогресс прямо здесь.")
          : (lang === "en" ? "Order is saved. Complete the payment and then mark it inside the card." : "Заказ сохранен. Заверши оплату и затем отметь ее внутри карточки.");

        const timeline = [
          {
            id: `timeline_created_${order.id}`,
            at: order.created_at,
            title: lang === "en" ? "Order created" : "Заказ создан",
            text: userBrief || (lang === "en" ? "Brief saved inside the order." : "Бриф сохранен внутри заказа."),
            color: linkedPayment?.status === "paid" ? "#10b981" : "#f59e0b",
          },
        ];

        if (linkedPayment?.status === "paid") {
          timeline.unshift({
            id: `timeline_paid_${order.id}`,
            at: linkedPayment.paid_at || order.updated_at || order.created_at,
            title: lang === "en" ? "Payment confirmed" : "Оплата подтверждена",
            text: moneyUsd(linkedPayment.amount),
            color: "#10b981",
          });
        } else if (order.status === "payment_review") {
          timeline.unshift({
            id: `timeline_review_${order.id}`,
            at: order.updated_at || order.created_at,
            title: lang === "en" ? "Payment review" : "Проверка платежа",
            text: lang === "en" ? "Waiting for confirmation." : "Ожидаем подтверждение оплаты.",
            color: "#38bdf8",
          });
        }

        const storedUrl = linkedPayment?.crypto_pay_url || "";
        const derivedBotUrl = deriveBotInvoiceUrl(storedUrl);

        return {
          id: `remote_order_${order.id}`,
          remoteOrderId: order.id,
          orderNo: order.order_number || order.id.slice(0, 6),
          items: Array.isArray(meta.items) && meta.items.length
            ? meta.items
            : [{ id: order.service_id || order.id, key: "service", name: order.service_name, qty: 1, icon: "✦" }],
          totalUSD: roundMoney(order.total_amount),
          totalLocal: meta.totalLocal || Math.round(roundMoney(order.total_amount) * (LANGS[lang]?.rate || 1)),
          currencyCode: meta.currencyCode || LANGS[lang]?.code || "USD",
          paymentMethod: linkedPayment?.payment_method || meta.paymentMethod || "cryptobot",
          paymentId: linkedPayment ? `remote_payment_${linkedPayment.id}` : null,
          remotePaymentId: linkedPayment?.id || null,
          paymentStatus: linkedPayment
            ? (linkedPayment.status === "pending" && order.status === "payment_review" ? "review" : linkedPayment.status)
            : order.status === "payment_review"
              ? "review"
              : "pending",
          status: order.status || "waiting_payment",
          brief: userBrief,
          complexity: meta.complexity || "standard",
          urgency: meta.urgency || "normal",
          deliveryLabel: meta.deliveryLabel || (lang === "en" ? "3 days" : "3 дня"),
          bonusCourses: meta.bonusCourses || [],
          createdAt: order.created_at,
          updatedAt: order.updated_at || order.created_at,
          timeline,
          messages: rawMessages.length
            ? rawMessages.map((message) => ({
                id: `remote_msg_${message.id}`,
                sender: message.sender_role === "designer" ? "designer" : "client",
                text: message.text,
                at: message.created_at,
              }))
            : [{
                id: `remote_msg_intro_${order.id}`,
                sender: "designer",
                text: fallbackIntro,
                at: order.created_at,
              }],
          cryptoInvoiceId: linkedPayment?.crypto_invoice_id || null,
          cryptoInvoiceHash: deriveInvoiceHash(storedUrl || ""),
          cryptoInvoiceStatus: linkedPayment?.status || null,
          cryptoInvoiceUrl: derivedBotUrl || storedUrl || "",
          cryptoInvoiceUrls: {
            mini: storedUrl?.includes?.("startapp=invoice-") ? storedUrl : "",
            bot: derivedBotUrl || (storedUrl?.includes?.("t.me/CryptoBot?start=") ? storedUrl : ""),
            web: storedUrl || "",
          },
        };
      });

      const shouldApply = forceApply
        || mappedOrders.length > 0
        || mappedPayments.length > 0
        || roundMoney(remoteUser?.balance) > 0
        || (!orders.length && !paymentHistory.length);

      if (shouldApply) {
        setWalletBalance(roundMoney(remoteUser?.balance || 0));
        setPaymentHistory(mappedPayments);
        setOrders(mappedOrders);
      }

      remoteSettingsReadyRef.current = true;
      if (!hasRemoteSettings) {
        postLegacySync("/api/legacy-sync/save-settings", { settings: collectLocalSettings() }).catch(() => {});
      }

      return result;
    } catch (error) {
      remoteSettingsReadyRef.current = false;
      setRemoteSync(prev => ({ ...prev, ready: true }));
      if (!silent) {
        showToast(lang === "en" ? `Supabase sync unavailable: ${error.message}` : `Supabase недоступен: ${error.message}`, "info");
      }
      return null;
    }
  }, [applyRemoteSettings, lang, orders.length, paymentHistory.length, postLegacySync, showToast]);

  useEffect(() => {
    syncRemoteState({ silent: true });
  }, [syncRemoteState]);

  const unlockAchievement = useCallback((id) => {
    setStreak(prev => {
      if (prev.achievementsUnlocked?.includes(id)) return prev;
      const a = ACHIEVEMENTS.find(a => a.id === id);
      if (!a) return prev;
      const newData = { ...prev, achievementsUnlocked: [...(prev.achievementsUnlocked || []), id], xp: prev.xp + a.xp };
      saveStreak(newData);
      setPendingAchieve(a);
      SFX.achievement();
      setTimeout(() => setPendingAchieve(null), 4000);
      return newData;
    });
    setAchievements(prev => {
      if (prev.find(a => a.id === id)) return prev;
      const a = ACHIEVEMENTS.find(a => a.id === id);
      if (!a) return prev;
      return [...prev, a];
    });
  }, []);

  const addXPfn = useCallback((amount) => {
    setStreak(prev => {
      const oldLevel = getLevel(prev.xp);
      const newData = addXP(amount, prev);
      const newLevel = getLevel(newData.xp);
      if (newLevel > oldLevel) {
        setTimeout(() => {
          SFX.levelUp();
          showToast(`🏆 Level ${newLevel}! +${amount} XP`, "success");
          setConfetti(true);
          setTimeout(() => setConfetti(false), 3500);
          setLevelUpData({ level: newLevel, xp: newData.xp });
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
          if (newLevel >= 5) unlockAchievement("level_5");
          if (newLevel >= 10) unlockAchievement("level_10");
          if (newLevel >= 15) unlockAchievement("level_15");
        }, 300);
      }
      return newData;
    });
  }, [showToast, unlockAchievement]);

  // Level Up Notification Component
  const LevelUpNotification = () => (
    <div style={{
      position: "fixed",
      left: "50%",
      top: "20%",
      transform: "translateX(-50%)",
      zIndex: 10000,
      background: th.grad,
      padding: "20px 32px",
      borderRadius: 24,
      boxShadow: `0 24px 80px rgba(0,0,0,.6), 0 0 60px ${th.glow}`,
      border: `3px solid rgba(255,255,255,.3)`,
      textAlign: "center",
      animation: "levelUpIn .5s cubic-bezier(.175,.885,.32,1.275) both",
    }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><SystemIcon name="party" size={42} color="#fff" animated tone="glow" /></div>
      <div className="type-display" style={{ fontSize: 28, color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,.4)" }}>
        LEVEL {levelUpData.level}!
      </div>
      <div className="type-number" style={{ fontSize: 14, color: "rgba(255,255,255,.9)", marginTop: 4 }}>
        {levelUpData.xp} XP
      </div>
      <style>{`
        @keyframes levelUpIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(.8); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );

  const addToCart = useCallback((svc, name) => {
    setCart(prev => { const ex = prev.find(i => i.id === svc.id); if (ex) return prev.map(i => i.id === svc.id ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...svc, name, qty: 1 }]; });
  }, []);
  const removeFromCart = useCallback(id => { setCart(prev => prev.filter(i => i.id !== id)); }, []);
  const updateQty = useCallback((id, qty) => { if (qty < 1) { removeFromCart(id); return; } setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)); }, [removeFromCart]);
  const clearCart = useCallback(() => setCart([]), []);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const activeOrdersCount = useMemo(() => orders.filter((o) => ["waiting_payment", "payment_review", "queued", "in_progress", "preview_sent", "revision"].includes(o.status)).length, [orders]);
  const toggleWishlist = useCallback(id => {
    setWishlist(prev => {
      const n = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      showToast(prev.includes(id) ? t.removedFromWishlist : t.addedToWishlist, "info");
      ls.set("rs_wl4", n);
      return n;
    });
  }, [t]);

  const pushTimelineEntry = useCallback((orderId, entry) => {
    setOrders(prev => prev.map(order => order.id === orderId
      ? { ...order, updatedAt: entry.at, timeline: [entry, ...(order.timeline || [])] }
      : order
    ));
  }, []);

  const pushOrderMessage = useCallback((orderId, sender, text) => {
    if (!text) return;
    const at = new Date().toISOString();
    setOrders(prev => prev.map(order => order.id === orderId
      ? {
          ...order,
          updatedAt: at,
          messages: [...(order.messages || []), { id: makeEntityId("msg"), sender, text, at }],
        }
      : order
    ));
  }, []);

  const attachInvoiceMeta = useCallback((paymentId, orderId, invoice) => {
    const nextMeta = {
      cryptoInvoiceId: invoice.invoice_id,
      cryptoInvoiceHash: invoice.hash || deriveInvoiceHash(invoice.bot_invoice_url || invoice.mini_app_invoice_url || invoice.web_app_invoice_url || ""),
      cryptoInvoiceStatus: invoice.status,
      cryptoInvoiceUrl: invoice.bot_invoice_url || invoice.mini_app_invoice_url || invoice.web_app_invoice_url || "",
      cryptoInvoiceUrls: {
        mini: invoice.mini_app_invoice_url || "",
        bot: invoice.bot_invoice_url || "",
        web: invoice.web_app_invoice_url || "",
      },
      updatedAt: new Date().toISOString(),
    };

    setPaymentHistory(prev => prev.map(payment => payment.id === paymentId ? { ...payment, ...nextMeta } : payment));
    if (orderId) {
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...nextMeta, updatedAt: nextMeta.updatedAt } : order));
    }
  }, []);

  const attachStarsInvoiceMeta = useCallback((paymentId, orderId = null, invoice) => {
    const nextMeta = {
      starsInvoiceLink: invoice.invoiceLink || invoice.link || "",
      starsAmount: Number(invoice.amountStars || invoice.stars_amount || 0),
      starsInvoiceSlug: invoice.slug || "",
      updatedAt: new Date().toISOString(),
    };

    setPaymentHistory(prev => prev.map(payment => payment.id === paymentId ? { ...payment, ...nextMeta } : payment));
    if (orderId) {
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...nextMeta, updatedAt: nextMeta.updatedAt } : order));
    }
  }, []);

  const requestCryptoInvoice = useCallback(async ({ paymentId, orderId = null, amountUSD, title, payload }) => {
    const response = await fetch("/api/crypto-pay/create-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountUSD,
        asset: "USDT",
        description: title,
        hiddenMessage: lang === "en" ? "Rival Space payment draft" : "Черновик оплаты Rival Space",
        payload,
      }),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.ok || !json?.result) {
      throw new Error(json?.error || "Unable to create CryptoBot invoice");
    }

    attachInvoiceMeta(paymentId, orderId, json.result);
    return json.result;
  }, [attachInvoiceMeta, lang]);

  const requestStarsInvoice = useCallback(async ({ paymentId, orderId = null, amountUSD, amountStars, title, description, payload }) => {
    const response = await fetch("/api/telegram-stars/create-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountUSD,
        amountStars,
        title,
        description,
        payload,
      }),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.ok || !json?.result?.invoiceLink) {
      throw new Error(json?.error || "Unable to create Telegram Stars invoice");
    }

    attachStarsInvoiceMeta(paymentId, orderId, json.result);
    return json.result;
  }, [attachStarsInvoiceMeta]);

  const settlePaidPayment = useCallback(async (payment, invoiceStatus = "paid") => {
    const at = new Date().toISOString();
    setPaymentHistory(prev => prev.map(item => item.id === payment.id ? { ...item, status: "paid", cryptoInvoiceStatus: invoiceStatus, paidAt: at } : item));

    if (payment.type === "topup") {
      const nextBalance = roundMoney(walletBalance + Number(payment.amountUSD || 0));
      setWalletBalance(nextBalance);
      if (remoteSync.user && (payment.remotePaymentId || payment.id?.startsWith?.("remote_payment_"))) {
        try {
          await postLegacySync("/api/legacy-sync/payment-status", {
            paymentId: payment.remotePaymentId || String(payment.id).replace("remote_payment_", ""),
            status: "paid",
            userId: remoteSync.user.id,
            nextBalance,
          });
        } catch {}
      }
      showToast(lang === "en" ? "Balance credited" : "Баланс зачислен", "success");
      SFX.success?.();
      return true;
    }

    if (payment.orderId) {
      const order = orders.find((item) => item.id === payment.orderId);
      setOrders(prev => prev.map(orderItem => orderItem.id === payment.orderId ? { ...orderItem, status: "queued", paymentStatus: "paid", cryptoInvoiceStatus: invoiceStatus, updatedAt: at } : orderItem));
      pushTimelineEntry(payment.orderId, {
        id: makeEntityId("timeline"),
        at,
        title: lang === "en" ? "Payment confirmed" : "Оплата подтверждена",
        text: lang === "en" ? "The order is now queued for production." : "Заказ переведен в очередь на производство.",
        color: "#10b981",
      });
      pushOrderMessage(payment.orderId, "designer", lang === "en" ? "Payment is confirmed. I moved the order into the queue and will update progress here." : "Оплата подтверждена. Перевел заказ в очередь и дальше буду вести прогресс здесь.");
      if (remoteSync.user && (payment.remotePaymentId || payment.id?.startsWith?.("remote_payment_"))) {
        try {
          await postLegacySync("/api/legacy-sync/payment-status", {
            paymentId: payment.remotePaymentId || String(payment.id).replace("remote_payment_", ""),
            status: "paid",
            userId: remoteSync.user.id,
            orderId: order?.remoteOrderId || order?.id?.replace?.("remote_order_", "") || null,
            orderStatus: "queued",
          });
        } catch {}
      }
    }
    showToast(lang === "en" ? "Payment confirmed" : "Оплата подтверждена", "success");
    SFX.success?.();
    return true;
  }, [lang, orders, postLegacySync, pushOrderMessage, pushTimelineEntry, remoteSync.user, showToast, walletBalance]);

  const addOrderMessage = useCallback((orderId, sender, text) => {
    const safeText = String(text || "").trim();
    if (!safeText) return;
    pushOrderMessage(orderId, sender, safeText);

    const order = orders.find((item) => item.id === orderId);
    if (remoteSync.user && order?.remoteOrderId) {
      postLegacySync("/api/legacy-sync/add-message", {
        orderId: order.remoteOrderId,
        senderRole: sender === "designer" ? "designer" : "client",
        senderId: sender === "designer" ? null : remoteSync.user.id,
        text: safeText,
      }).catch(() => {});
    }

    if (sender === "client") {
      // Detect payment details request
      const isPaymentRequest = safeText.toLowerCase().includes("реквизит") ||
        safeText.toLowerCase().includes("payment detail") ||
        safeText.toLowerCase().includes("карт") ||
        safeText.toLowerCase().includes("card detail");

      const reply = isPaymentRequest
        ? (lang === "en"
          ? "Thanks for the request! I'll send you the payment details for your country in a moment. 💳"
          : "Спасибо за запрос! Сейчас пришлю реквизиты для твоей страны. 💳")
        : (lang === "en"
          ? "Got it. I saved your note inside the order and will continue the work there."
          : "Принял. Сохранил сообщение внутри заказа и продолжу вести процесс здесь.");
      window.setTimeout(() => pushOrderMessage(orderId, "designer", reply), 900);
    }
  }, [lang, orders, postLegacySync, pushOrderMessage, remoteSync.user]);

  const setOrderStatus = useCallback((orderId, status, note = "") => {
    const at = new Date().toISOString();
    setOrders(prev => prev.map(order => order.id === orderId
      ? { ...order, status, updatedAt: at }
      : order
    ));
    pushTimelineEntry(orderId, {
      id: makeEntityId("timeline"),
      at,
      title: status === "payment_review"
        ? (lang === "en" ? "Payment sent for review" : "Платеж отправлен на проверку")
        : status === "queued"
          ? (lang === "en" ? "Order moved to queue" : "Заказ поставлен в очередь")
          : status === "in_progress"
            ? (lang === "en" ? "Work started" : "Работа началась")
            : status === "preview_sent"
              ? (lang === "en" ? "Preview was sent" : "Превью отправлено")
              : status === "revision"
                ? (lang === "en" ? "Revision stage" : "Этап правок")
                : status === "delivered"
                  ? (lang === "en" ? "Final files delivered" : "Финальные файлы отправлены")
                  : (lang === "en" ? "Status updated" : "Статус обновлен"),
      text: note,
      color: status === "payment_review" ? "#38bdf8" : status === "queued" ? "#a78bfa" : status === "in_progress" ? "#6366f1" : status === "preview_sent" ? "#c084fc" : status === "revision" ? "#fb7185" : status === "delivered" ? "#10b981" : th.accent,
    });
  }, [lang, pushTimelineEntry, th.accent]);

  const requestTopUp = useCallback(async (amountInput, methodInput = "cryptobot") => {
    const amountUSD = roundMoney(Number(amountInput));
    if (!amountUSD || amountUSD <= 0) {
      showToast(lang === "en" ? "Enter a valid amount" : "Введи корректную сумму", "error");
      SFX.error?.();
      return null;
    }
    const method = methodInput === "stars" ? "stars" : "cryptobot";
    const starsAmount = estimateStarsFromUsd(amountUSD, LANGS);
    const payment = {
      id: makeEntityId("topup"),
      type: "topup",
      method,
      title: method === "stars"
        ? (lang === "en" ? "Balance top-up · Telegram Stars" : "Пополнение баланса · Telegram Stars")
        : (lang === "en" ? "Balance top-up" : "Пополнение баланса"),
      amountUSD,
      status: "pending",
      createdAt: new Date().toISOString(),
      starsAmount: method === "stars" ? starsAmount : undefined,
    };
    setPaymentHistory(prev => [payment, ...prev]);
    try {
      const invoice = method === "stars"
        ? await requestStarsInvoice({
            paymentId: payment.id,
            amountUSD,
            amountStars: starsAmount,
            title: lang === "en" ? "Rival Space Balance" : "Баланс Rival Space",
            description: lang === "en"
              ? `Top up the internal balance for ${starsAmount} Stars`
              : `Пополнение внутреннего баланса на ${starsAmount} Stars`,
            payload: JSON.stringify({ kind: "topup", paymentId: payment.id, amountUSD, starsAmount }),
          })
        : await requestCryptoInvoice({
            paymentId: payment.id,
            amountUSD,
            title: payment.title,
            payload: JSON.stringify({ kind: "topup", paymentId: payment.id }),
          });
      if (remoteSync.user) {
        try {
          const remoteResult = await postLegacySync("/api/legacy-sync/create-topup", {
            amountUSD,
            status: "pending",
            method,
            cryptoInvoiceId: method === "cryptobot" ? invoice.invoice_id : null,
            cryptoPayUrl: method === "cryptobot" ? (invoice.bot_invoice_url || invoice.mini_app_invoice_url || invoice.web_app_invoice_url || "") : null,
          });
          setPaymentHistory(prev => prev.map(item => item.id === payment.id ? {
            ...item,
            remotePaymentId: remoteResult?.payment?.id || null,
          } : item));
        } catch {}
      }
      showToast(
        method === "stars"
          ? (lang === "en" ? "Stars checkout created" : "Оплата Stars создана")
          : (lang === "en" ? "Invoice created" : "Счет создан"),
        "success"
      );
      SFX.success?.();
      return {
        ...payment,
        ...(method === "stars"
          ? {
              starsInvoiceLink: invoice.invoiceLink || "",
              starsAmount,
              starsInvoiceSlug: invoice.slug || "",
            }
          : {
              cryptoInvoiceId: invoice.invoice_id,
              cryptoInvoiceHash: invoice.hash || deriveInvoiceHash(invoice.bot_invoice_url || invoice.mini_app_invoice_url || invoice.web_app_invoice_url || ""),
              cryptoInvoiceUrl: invoice.bot_invoice_url || invoice.mini_app_invoice_url || invoice.web_app_invoice_url || "",
              cryptoInvoiceUrls: {
                bot: invoice.bot_invoice_url || "",
                mini: invoice.mini_app_invoice_url || "",
                web: invoice.web_app_invoice_url || "",
              },
            }),
      };
    } catch (error) {
      setPaymentHistory(prev => prev.map(item => item.id === payment.id ? { ...item, invoiceError: error.message } : item));
      showToast(
        method === "stars"
          ? (lang === "en" ? `Telegram Stars error: ${error.message}` : `Ошибка Telegram Stars: ${error.message}`)
          : (lang === "en" ? `CryptoBot error: ${error.message}` : `Ошибка CryptoBot: ${error.message}`),
        "error"
      );
      SFX.error?.();
    }
    return payment;
  }, [lang, postLegacySync, remoteSync.user, requestCryptoInvoice, requestStarsInvoice, showToast]);

  const createCheckoutOrder = useCallback(async (payload) => {
    const items = Array.isArray(payload?.items) ? payload.items.filter(item => item.qty > 0) : [];
    if (!items.length) return { error: "empty" };

    const totalUSD = roundMoney(payload.totalUSD);
    const paymentMethod = payload.paymentMethod || "stars";
    const createdAt = new Date().toISOString();
    const orderId = makeEntityId("order");
    const paymentId = makeEntityId("payment");
    const orderNo = String(Date.now()).slice(-6);
    const brief = String(payload.brief || "").trim();
    const localRate = LANGS[lang]?.rate || 1;
    const starsAmount = estimateStarsFromUsd(totalUSD, LANGS);

    if (paymentMethod === "balance" && walletBalance < totalUSD) {
      showToast(lang === "en" ? "Not enough balance" : "Недостаточно баланса", "error");
      SFX.error?.();
      return { error: "insufficient_balance" };
    }

    const baseOrder = {
      id: orderId,
      orderNo,
      items,
      totalUSD,
      totalLocal: Math.round(totalUSD * localRate),
      currencyCode: LANGS[lang]?.code || "USD",
      paymentMethod,
      paymentId,
      paymentStatus: paymentMethod === "balance" ? "paid" : "pending",
      status: paymentMethod === "balance" ? "queued" : "waiting_payment",
      brief,
      complexity: payload.complexity,
      urgency: payload.urgency,
      deliveryLabel: payload.deliveryLabel,
      bonusCourses: payload.bonusCourses || [],
      createdAt,
      updatedAt: createdAt,
      timeline: [
        {
          id: makeEntityId("timeline"),
          at: createdAt,
          title: lang === "en" ? "Order created" : "Заказ создан",
          text: brief || (lang === "en" ? "The brief is saved inside the order." : "Бриф сохранен внутри заказа."),
          color: paymentMethod === "balance" ? "#10b981" : "#f59e0b",
        },
      ],
      messages: [
        {
          id: makeEntityId("msg"),
          sender: "designer",
          text: paymentMethod === "balance"
            ? (lang === "en" ? "Order accepted. I will update the status here as the work moves forward." : "Заказ принят. Дальше я буду обновлять статус прямо здесь.")
            : (lang === "en" ? "Order is saved. Complete the payment and then tap “I've paid” inside the order card." : "Заказ сохранен. Заверши оплату и затем нажми «Я оплатил» внутри карточки заказа."),
          at: createdAt,
        },
      ],
    };

    const payment = {
      id: paymentId,
      orderId,
      type: "order",
      method: paymentMethod,
      title: `${lang === "en" ? "Order" : "Заказ"} #${orderNo}`,
      amountUSD: totalUSD,
      status: paymentMethod === "balance" ? "paid" : "pending",
      createdAt,
      paidAt: paymentMethod === "balance" ? createdAt : null,
      starsAmount: paymentMethod === "stars" ? starsAmount : undefined,
    };

    if (paymentMethod === "balance") {
      setWalletBalance(prev => roundMoney(prev - totalUSD));
      baseOrder.timeline.unshift({
        id: makeEntityId("timeline"),
        at: createdAt,
        title: lang === "en" ? "Paid from balance" : "Оплачено с баланса",
        text: moneyUsd(totalUSD),
        color: "#10b981",
      });
    }

    setOrders(prev => [baseOrder, ...prev]);
    setPaymentHistory(prev => [payment, ...prev]);

    if (paymentMethod === "stars") {
      try {
        const invoice = await requestStarsInvoice({
          paymentId,
          orderId,
          amountUSD: totalUSD,
          amountStars: starsAmount,
          title: `${lang === "en" ? "Rival Space Order" : "Заказ Rival Space"} #${orderNo}`,
          description: lang === "en"
            ? `${items.map(item => item.name).join(", ")} • ${starsAmount} Stars`
            : `${items.map(item => item.name).join(", ")} • ${starsAmount} Stars`,
          payload: JSON.stringify({ kind: "order", paymentId, orderId, orderNo, amountUSD: totalUSD, starsAmount }),
        });
        baseOrder.starsInvoiceLink = invoice.invoiceLink || "";
        baseOrder.starsAmount = starsAmount;
        baseOrder.starsInvoiceSlug = invoice.slug || "";
      } catch (error) {
        setPaymentHistory(prev => prev.map(item => item.id === paymentId ? { ...item, invoiceError: error.message } : item));
        setOrders(prev => prev.map(item => item.id === orderId ? { ...item, invoiceError: error.message } : item));
        showToast(lang === "en" ? `Telegram Stars error: ${error.message}` : `Ошибка Telegram Stars: ${error.message}`, "error");
        SFX.error?.();
      }
    } else if (paymentMethod === "cryptobot") {
      try {
        const invoice = await requestCryptoInvoice({
          paymentId,
          orderId,
          amountUSD: totalUSD,
          title: `${lang === "en" ? "Order" : "Заказ"} #${orderNo}`,
          payload: JSON.stringify({ kind: "order", paymentId, orderId, orderNo }),
        });
        baseOrder.cryptoInvoiceId = invoice.invoice_id;
        baseOrder.cryptoInvoiceHash = invoice.hash || deriveInvoiceHash(invoice.bot_invoice_url || invoice.mini_app_invoice_url || invoice.web_app_invoice_url || "");
        baseOrder.cryptoInvoiceUrl = invoice.bot_invoice_url || invoice.mini_app_invoice_url || invoice.web_app_invoice_url || "";
        baseOrder.cryptoInvoiceUrls = {
          bot: invoice.bot_invoice_url || "",
          mini: invoice.mini_app_invoice_url || "",
          web: invoice.web_app_invoice_url || "",
        };
      } catch (error) {
        setPaymentHistory(prev => prev.map(item => item.id === paymentId ? { ...item, invoiceError: error.message } : item));
        setOrders(prev => prev.map(item => item.id === orderId ? { ...item, invoiceError: error.message } : item));
        showToast(lang === "en" ? `CryptoBot error: ${error.message}` : `Ошибка CryptoBot: ${error.message}`, "error");
        SFX.error?.();
      }
    }

    if (remoteSync.user) {
      try {
        const remoteResult = await postLegacySync("/api/legacy-sync/create-order", {
          nextBalance: paymentMethod === "balance" ? roundMoney(walletBalance - totalUSD) : undefined,
          payment: {
            method: paymentMethod,
            amountUSD: totalUSD,
            status: paymentMethod === "balance" ? "paid" : "pending",
            cryptoInvoiceId: baseOrder.cryptoInvoiceId || null,
            cryptoPayUrl: baseOrder.cryptoInvoiceUrl || null,
          },
          order: {
            serviceName: items.map(item => item.name).join(" + "),
            totalUSD,
            status: paymentMethod === "balance" ? "queued" : "waiting_payment",
            brief: encodeRemoteBrief(brief, {
              items,
              totalLocal: Math.round(totalUSD * localRate),
              currencyCode: LANGS[lang]?.code || "USD",
              paymentMethod,
              complexity: payload.complexity,
              urgency: payload.urgency,
              deliveryLabel: payload.deliveryLabel,
              bonusCourses: payload.bonusCourses || [],
            }),
          },
        });

        if (remoteResult?.order) {
          baseOrder.remoteOrderId = remoteResult.order.id;
          baseOrder.orderNo = remoteResult.order.order_number || baseOrder.orderNo;
        }
        if (remoteResult?.payment) {
          payment.remotePaymentId = remoteResult.payment.id;
        }

        await syncRemoteState({ forceApply: true, silent: true });
      } catch (error) {
        showToast(lang === "en" ? `Supabase sync issue: ${error.message}` : `Проблема синхронизации с Supabase: ${error.message}`, "info");
      }
    }

    showToast(
      paymentMethod === "balance"
        ? (lang === "en" ? "Order created and paid" : "Заказ создан и оплачен")
        : paymentMethod === "stars"
          ? (lang === "en" ? "Stars checkout created" : "Оплата Stars создана")
          : (lang === "en" ? "Order draft created" : "Черновик заказа создан"),
      "success"
    );
    SFX.order?.();
    return { order: baseOrder, payment };
  }, [lang, postLegacySync, remoteSync.user, requestCryptoInvoice, requestStarsInvoice, showToast, syncRemoteState, walletBalance]);

  const refreshInvoiceStatus = useCallback(async (paymentId) => {
    const payment = paymentHistory.find(item => item.id === paymentId);
    if (!payment?.cryptoInvoiceId) {
      showToast(lang === "en" ? "Invoice is not linked yet" : "Счет еще не привязан", "error");
      return false;
    }

    try {
      const response = await fetch("/api/crypto-pay/get-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: payment.cryptoInvoiceId }),
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.ok) {
        throw new Error(json?.error || "Unable to fetch invoice");
      }

      const invoice = json.result;
      attachInvoiceMeta(payment.id, payment.orderId || null, invoice);
      if (invoice?.status === "paid" && payment.status !== "paid") {
        await settlePaidPayment(payment, invoice.status);
        return true;
      }

      if (invoice?.status === "active") {
        showToast(lang === "en" ? "Invoice is still waiting for payment" : "Счет все еще ожидает оплату", "info");
      } else if (invoice?.status) {
        showToast(`${lang === "en" ? "Invoice status" : "Статус счета"}: ${invoice.status}`, "info");
      }
      return false;
    } catch (error) {
      showToast(lang === "en" ? `Status check failed: ${error.message}` : `Не удалось проверить статус: ${error.message}`, "error");
      SFX.error?.();
      return false;
    }
  }, [attachInvoiceMeta, lang, paymentHistory, settlePaidPayment, showToast]);

  const markPaymentSubmitted = useCallback((paymentId, orderId = null) => {
    const payment = paymentHistory.find(item => item.id === paymentId);
    if (payment?.cryptoInvoiceId) {
      return refreshInvoiceStatus(paymentId);
    }

    const at = new Date().toISOString();
    let touched = false;
    setPaymentHistory(prev => prev.map(item => {
      if (item.id !== paymentId || item.status === "paid") return item;
      touched = true;
      return { ...item, status: "review", submittedAt: at };
    }));
    if (!touched) return false;
    if (orderId) {
      const order = orders.find((item) => item.id === orderId);
      setOrders(prev => prev.map(orderItem => orderItem.id === orderId ? { ...orderItem, status: "payment_review", paymentStatus: "review", updatedAt: at } : orderItem));
      pushTimelineEntry(orderId, {
        id: makeEntityId("timeline"),
        at,
        title: lang === "en" ? "Payment marked as sent" : "Платеж отмечен как отправленный",
        text: lang === "en" ? "The designer will confirm it manually." : "Дизайнер подтвердит его вручную.",
        color: "#38bdf8",
      });
      pushOrderMessage(orderId, "designer", lang === "en" ? "I received the payment notice. I'll confirm it and update the status shortly." : "Уведомление об оплате получил. Проверю и обновлю статус чуть позже.");
      if (remoteSync.user && (payment?.remotePaymentId || payment?.id?.startsWith?.("remote_payment_"))) {
        postLegacySync("/api/legacy-sync/payment-status", {
          paymentId: payment.remotePaymentId || String(payment.id).replace("remote_payment_", ""),
          status: "pending",
          userId: remoteSync.user.id,
          orderId: order?.remoteOrderId || order?.id?.replace?.("remote_order_", "") || null,
          orderStatus: "payment_review",
          note: lang === "en" ? "Payment is waiting for manual confirmation." : "Платеж ожидает ручного подтверждения.",
        }).catch(() => {});
      }
    }
    showToast(lang === "en" ? "Payment sent for review" : "Платеж отправлен на проверку", "success");
    SFX.success?.();
    return true;
  }, [lang, orders, paymentHistory, postLegacySync, pushOrderMessage, pushTimelineEntry, refreshInvoiceStatus, remoteSync.user, showToast]);

  const openCryptoBot = useCallback((context) => {
    if (context?.invoiceError && !context?.cryptoInvoiceUrl && !context?.cryptoInvoiceUrls?.mini && !context?.cryptoInvoiceUrls?.bot && !context?.cryptoInvoiceUrls?.web) {
      showToast(context.invoiceError, "error");
      return;
    }
    const invoiceHash = context?.cryptoInvoiceHash || deriveInvoiceHash(context?.cryptoInvoiceUrls?.bot || context?.cryptoInvoiceUrl || context?.cryptoInvoiceUrls?.mini || context?.cryptoInvoiceUrls?.web || "");
    const exactBotUrl = invoiceHash ? `https://t.me/CryptoBot?start=${invoiceHash}` : "";
    const invoiceUrl = exactBotUrl || context?.cryptoInvoiceUrls?.bot || context?.cryptoInvoiceUrl || context?.cryptoInvoiceUrls?.mini || context?.cryptoInvoiceUrls?.web;
    if (invoiceUrl) {
      try {
        if (invoiceUrl.startsWith("https://t.me/")) {
          openTelegramLink(invoiceUrl);
        } else if (invoiceUrl.startsWith("http")) {
          openExternalLink(invoiceUrl);
        } else {
          window.open(invoiceUrl, "_blank");
        }
      } catch {
        window.open(invoiceUrl, "_blank");
      }
      return;
    }
    const target = context?.type === "topup"
      ? (lang === "en" ? `Top up draft: ${moneyUsd(context.amountUSD)}.` : `Пополнение баланса: ${moneyUsd(context.amountUSD)}.`)
      : context?.orderNo
        ? (lang === "en" ? `Order #${context.orderNo} payment draft.` : `Оплата заказа #${context.orderNo}.`)
        : (lang === "en" ? "CryptoBot payment draft." : "Черновик оплаты через CryptoBot.");
    showToast(target, "info");
    openTelegramLink("https://t.me/send");
  }, [lang, showToast]);

  const openStarsInvoice = useCallback((context) => {
    const invoiceLink = context?.starsInvoiceLink || "";
    if (!invoiceLink) {
      showToast(
        context?.invoiceError || (lang === "en" ? "Telegram Stars checkout is not ready yet" : "Оплата Telegram Stars еще не готова"),
        "error"
      );
      return;
    }

    const paymentId = context?.paymentId || context?.id || null;
    const completeStarsPayment = async (status) => {
      if (status === "paid" && paymentId) {
        const payment = paymentHistory.find((item) => item.id === paymentId);
        if (payment && payment.status !== "paid") {
          await settlePaidPayment(payment, "paid");
        }
        return;
      }

      if (status === "cancelled") {
        showToast(lang === "en" ? "Telegram Stars payment canceled" : "Оплата Telegram Stars отменена", "info");
      }
    };

    try {
      if (openTelegramInvoice(invoiceLink, completeStarsPayment)) return;

      if (invoiceLink.startsWith("http")) {
        openExternalLink(invoiceLink);
        return;
      }
    } catch {
      window.open(invoiceLink, "_blank");
      return;
    }

    window.open(invoiceLink, "_blank");
  }, [lang, paymentHistory, settlePaidPayment, showToast]);

  const requestPaymentDetails = useCallback((country) => {
    const countryName = lang === "en" ? country.nameEn : country.name;
    const messageText = lang === "en"
      ? `Hi! I'd like to request payment details for ${countryName} ${country.flag}. Please send me the card details.`
      : `Привет! Запрашиваю реквизиты для оплаты: ${countryName} ${country.flag}. Пришли, пожалуйста, данные карты.`;

    // Find an active order to attach the message, or use a fallback
    const activeOrder = orders.find((o) =>
      ["waiting_payment", "payment_review", "queued", "in_progress", "preview_sent", "revision"].includes(o.status)
    );

    if (activeOrder) {
      // Send message to existing order
      addOrderMessage(activeOrder.id, "client", messageText);
      showToast(lang === "en" ? "Request sent to designer!" : "Запрос отправлен дизайнеру!", "success");
      SFX.success?.();
    } else {
      // Create a virtual inquiry order for the message
      const at = new Date().toISOString();
      const orderId = makeEntityId("inquiry");
      const inquiryOrder = {
        id: orderId,
        orderNo: String(Date.now()).slice(-6),
        status: "waiting_payment",
        paymentStatus: "pending",
        paymentMethod: "manual",
        totalUSD: 0,
        deliveryLabel: lang === "en" ? "Payment inquiry" : "Запрос реквизитов",
        items: [{ id: "inquiry", name: lang === "en" ? "Payment details request" : "Запрос реквизитов", qty: 1, icon: "💳" }],
        timeline: [],
        messages: [],
        createdAt: at,
        updatedAt: at,
      };
      setOrders((prev) => [inquiryOrder, ...prev]);
      pushTimelineEntry(orderId, {
        id: makeEntityId("timeline"),
        at,
        title: lang === "en" ? "Payment inquiry created" : "Создан запрос реквизитов",
        text: countryName,
        color: "#6366f1",
      });
      // Send the message
      window.setTimeout(() => {
        addOrderMessage(orderId, "client", messageText);
      }, 300);
      if (remoteSync.user) {
        postLegacySync("/api/legacy-sync/create-order", {
          order: {
            serviceName: lang === "en" ? "Payment details request" : "Запрос реквизитов",
            totalUSD: 0,
            status: "waiting_payment",
            brief: encodeRemoteBrief(messageText, {
              inquiry: true,
              country: countryName,
              countryCode: country.id,
            }),
          },
          messages: [
            {
              senderRole: "client",
              text: messageText,
            },
          ],
        })
          .then((remoteResult) => {
            if (!remoteResult?.order) return;
            setOrders((prev) =>
              prev.map((item) =>
                item.id === orderId
                  ? {
                      ...item,
                      remoteOrderId: remoteResult.order.id,
                      orderNo: remoteResult.order.order_number || item.orderNo,
                    }
                  : item
              )
            );
          })
          .catch(() => {});
      }
      showToast(lang === "en" ? "Request sent to designer!" : "Запрос отправлен дизайнеру!", "success");
      SFX.success?.();
    }
  }, [addOrderMessage, lang, orders, postLegacySync, pushTimelineEntry, remoteSync.user, showToast]);

  const openOrderTelegram = useCallback((order = null, mode = "order") => {
    const lines = [];
    if (mode === "balance") {
      lines.push(lang === "en" ? "Hi! I need payment details for Rival Space." : "Привет! Нужны реквизиты для оплаты в Rival Space.");
    } else if (order) {
      lines.push(`Rival Space • ${lang === "en" ? "order" : "заказ"} #${order.orderNo}`);
      lines.push(order.items.map(item => `${item.icon} ${item.name} ×${item.qty}`).join(", "));
      lines.push(`${lang === "en" ? "Total" : "Сумма"}: ${moneyUsd(order.totalUSD)}`);
      if (order.brief) lines.push(`${lang === "en" ? "Brief" : "Бриф"}: ${order.brief}`);
      if (mode === "payment") {
        lines.push(lang === "en" ? "I want to complete the payment manually." : "Хочу завершить оплату вручную.");
      } else {
        lines.push(lang === "en" ? "Need an update on the order." : "Нужен апдейт по заказу.");
      }
    }
    openTg("Rivaldsg", lines.join("\n"));
  }, [lang]);

  const greeting = getGreeting(lang);

  if (splash) {
    return <SplashScreen th={th} onDone={() => setSplash(false)} sfx={SFX} isTg={isTg} />;
  }

  return (
    <div
      onPointerDownCapture={() => markInteraction()}
      style={{
        height: "var(--tg-app-height, 100dvh)",
        minHeight: "var(--tg-app-height, 100dvh)",
        width: "100%",
        maxWidth: "100vw",
        paddingLeft: "var(--tg-safe-left, 0px)",
        paddingRight: "var(--tg-safe-right, 0px)",
        background: "transparent",
        fontFamily: "var(--font-body)",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        overscrollBehavior: "none",
        overflowX: "clip",
      }}
    >
      <style>{`
        :root{--font-body:"Inter",system-ui,sans-serif;--font-display:"Gilroy-Bold","Gilroy-Heavy","Inter",system-ui,sans-serif;--font-button:"Gilroy-Medium","Gilroy-Bold","Inter",system-ui,sans-serif;--font-number:"Gilroy-Heavy","Gilroy-Bold","Inter",system-ui,sans-serif;--font-micro:"Inter",system-ui,sans-serif;--tg-app-height:100dvh;--tg-stable-height:100dvh;--tg-visual-height:100dvh;--tg-side-gap:clamp(14px,4vw,18px);--tg-bar-gap:clamp(10px,3vw,14px);--tg-shell-width:min(420px,100dvw);--tg-shell-scale:1;--rs-tg-bg:var(--tg-theme-bg-color,#030408);--rs-tg-text:var(--tg-theme-text-color,rgba(224,231,255,.95));--rs-tg-hint:var(--tg-theme-hint-color,#64748b);--rs-tg-secondary-bg:var(--tg-theme-secondary-bg-color,#090b14);}
        *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:0;height:0;}*{scrollbar-width:none;}
        html{scroll-behavior:smooth;overscroll-behavior:none;overflow:hidden;overflow-x:clip;height:var(--tg-app-height,100dvh);width:100%;max-width:100%;background:var(--rs-tg-bg,#030408);color-scheme:dark;}
        body{margin:0;padding:0;overflow:hidden;overflow-x:clip;height:var(--tg-app-height,100dvh);width:100%;max-width:100%;overscroll-behavior-y:none;-webkit-overflow-scrolling:touch;font-family:var(--font-body);background:var(--rs-tg-bg,#030408);color:var(--rs-tg-text,rgba(224,231,255,.95));}
        #root{height:var(--tg-app-height,100dvh);width:100%;max-width:100%;overflow:hidden;overflow-x:clip;}
        html[data-rs-paused] *,html[data-rs-paused] *::before,html[data-rs-paused] *::after{animation-play-state:paused!important;}
        html[data-rs-power="eco"]{scroll-behavior:auto;}
        html[data-rs-power="eco"] *{text-rendering:optimizeSpeed;}
        html[data-rs-power="eco"] .rs-mesh-nebula,
        html[data-rs-power="eco"] .rs-mesh-stars,
        html[data-rs-power="eco"] .rs-shooting-star,
        html[data-rs-power="eco"] .rs-mesh-glow{animation:none!important;transition:none!important;filter:none!important;will-change:auto!important;}
        html[data-rs-power="eco"] .rs-mesh-nebula-b,
        html[data-rs-power="eco"] .rs-mesh-nebula-c,
        html[data-rs-power="eco"] .rs-mesh-stars-far,
        html[data-rs-power="eco"] .rs-shooting-star{display:none!important;}
        html[data-rs-power="eco"] .rs-mesh-nebula-a{opacity:.22!important;background:radial-gradient(ellipse at 28% 8%,rgba(99,102,241,.08) 0%,transparent 62%)!important;}
        html[data-rs-power="eco"] .rs-mesh-stars-near{opacity:.42!important;transform:none!important;}
        html[data-rs-power="eco"] header > div,
        html[data-rs-power="eco"] .rs-bottom-nav{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:0 10px 24px rgba(3,4,8,.34),inset 0 1px 0 rgba(255,255,255,.045)!important;}
        html[data-rs-power="eco"] header button *,
        html[data-rs-power="eco"] header .type-display,
        html[data-rs-power="eco"] .rs-nav-icon-cycle,
        html[data-rs-power="eco"] .rs-nav-icon-wrap,
        html[data-rs-power="eco"] .rs-icon-shell,
        html[data-rs-power="eco"] .rs-icon-wrap,
        html[data-rs-power="eco"] .rs-icon-svg,
        html[data-rs-power="eco"] .rs-icon-svg > *,
        html[data-rs-power="eco"] .gal-img-shimmer,
        html[data-rs-power="eco"] .skeleton{animation:none!important;filter:none!important;will-change:auto!important;}
        html[data-rs-power="eco"] .rs-icon-svg[data-animated="true"] > *{stroke-dasharray:none!important;stroke-dashoffset:0!important;}
        html[data-rs-power="eco"] .rs-content,
        html[data-rs-power="eco"] .rs-content > div{contain:layout style!important;will-change:auto!important;}
        html[data-rs-power="eco"] .rs-content [style*="blur"],
        html[data-rs-power="eco"] .rs-content [style*="drop-shadow"]{filter:none!important;}
        html[data-rs-power="eco"] .rs-content [style*="backdrop-filter"]{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}
        html[data-rs-power="eco"] [style*="infinite"]{animation:none!important;}
        html[data-rs-power="eco"] [style*="blur("]{filter:none!important;}
        html[data-rs-power="eco"] [style*="backdrop-filter"]{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}
        html[data-rs-power="eco"] .rs-bottom-nav button{min-height:58px;contain:layout style paint;}
        html[data-rs-power="eco"] .rs-bottom-nav [style*="drop-shadow"]{filter:none!important;}
        html[data-rs-power="eco"] .rs-content [style*="box-shadow"]{box-shadow:0 8px 18px rgba(3,4,8,.22),inset 0 1px 0 rgba(255,255,255,.035)!important;}
        html[data-rs-power="eco"] .rs-content [style*="transition: all"],
        html[data-rs-power="eco"] .rs-content [style*="transition:all"]{transition-property:transform,opacity,background,border-color,color!important;transition-duration:.14s!important;}
        html[data-rs-power="eco"][data-rs-scrolling="true"] .rs-content *{scroll-behavior:auto!important;}
        html[data-rs-power="eco"][data-rs-scrolling="true"] .rs-content [style*="box-shadow"]{box-shadow:inset 0 1px 0 rgba(255,255,255,.028)!important;}
        html[data-rs-power="eco"][data-rs-scrolling="true"] .rs-content [style*="filter"]{filter:none!important;}
        html[data-rs-power="eco"][data-rs-scrolling="true"] .rs-content [style*="transition"]{transition:none!important;}
        html[data-rs-power="eco"][data-rs-scrolling="true"] header > div,
        html[data-rs-power="eco"][data-rs-scrolling="true"] .rs-bottom-nav{box-shadow:0 8px 18px rgba(3,4,8,.30),inset 0 1px 0 rgba(255,255,255,.04)!important;}
        html[data-rs-power="eco"][data-rs-scrolling="true"] .rs-mesh-stars-near{opacity:.34!important;}
        @media (prefers-reduced-motion: reduce){
          *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important;}
        }
        html[data-rs-performance="smooth"]{scroll-behavior:auto;}
        html[data-rs-performance="smooth"] .rs-mesh-bg{contain:strict;transform:translateZ(0);}
        html[data-rs-performance="smooth"] .rs-mesh-nebula{animation:none!important;transition:none!important;filter:blur(18px)!important;opacity:.52!important;transform:translate3d(0,0,0)!important;}
        html[data-rs-performance="smooth"] .rs-mesh-nebula-b{display:none!important;}
        html[data-rs-performance="smooth"] .rs-mesh-stars-near{animation:starfieldDrift 160s linear infinite!important;transition:none!important;opacity:.48!important;}
        html[data-rs-performance="smooth"] .rs-mesh-stars-far{display:none!important;}
        html[data-rs-performance="smooth"] .rs-mesh-glow{filter:none!important;transition:none!important;opacity:.45!important;}
        html[data-rs-performance="smooth"] .rs-shooting-star{display:none!important;}
        html[data-rs-performance="smooth"] .rs-icon-shell,html[data-rs-performance="smooth"] .rs-icon-wrap,html[data-rs-performance="smooth"] .rs-icon-svg,html[data-rs-performance="smooth"] .rs-icon-svg > *{animation:none!important;transition-duration:.12s!important;filter:none!important;will-change:auto!important;}
        html[data-rs-performance="smooth"] .rs-icon-svg[data-animated="true"] > *{stroke-dasharray:none!important;stroke-dashoffset:0!important;}
        html[data-rs-performance="smooth"] .rs-bottom-nav button{contain:layout style;min-width:0;}
        html[data-rs-performance="smooth"] .rs-nav-icon-cycle{animation-duration:4.8s!important;animation-timing-function:cubic-bezier(.37,0,.22,1)!important;backface-visibility:hidden;transform:translateZ(0);will-change:transform;}
        html[data-rs-performance="smooth"] .rs-nav-icon-wrap{filter:none!important;backface-visibility:hidden;transform:translateZ(0);transition:transform .2s ease!important;will-change:transform;}
        html[data-rs-performance="smooth"] .rs-bottom-nav{backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;box-shadow:0 -14px 32px rgba(3,4,8,.46),inset 0 1px 0 rgba(255,255,255,.05)!important;}
        html[data-rs-performance="smooth"] .rs-content{scroll-behavior:auto!important;contain:layout paint;}
        html[data-rs-performance="smooth"] .rs-content > div{will-change:auto!important;}
        html[data-rs-mobile="true"]{scroll-behavior:auto;overscroll-behavior:none;}
        html[data-rs-mobile="true"] body,html[data-rs-mobile="true"] #root{overscroll-behavior:none;}
        html[data-rs-mobile="true"] .rs-shell,html[data-rs-mobile="true"] .rs-content{contain:layout style;transform:translateZ(0);}
        html[data-rs-mobile="true"] .rs-content{-webkit-overflow-scrolling:touch;overscroll-behavior:contain;scroll-behavior:auto!important;will-change:auto;}
        html[data-rs-mobile="true"] .rs-content > div{contain:layout style;}
        html[data-rs-mobile="true"] .rs-content img,html[data-rs-mobile="true"] .rs-content svg{backface-visibility:hidden;}
        html[data-rs-mobile="true"] .rs-mesh-nebula{animation:none!important;filter:none!important;opacity:.34!important;transform:translate3d(0,0,0)!important;}
        html[data-rs-mobile="true"] .rs-mesh-nebula-c,html[data-rs-mobile="true"] .rs-mesh-glow{display:none!important;}
        html[data-rs-mobile="true"] .rs-mesh-stars-near{animation:none!important;opacity:.46!important;transform:none!important;}
        html[data-rs-mobile="true"] header > div,html[data-rs-mobile="true"] .rs-bottom-nav{backdrop-filter:blur(9px)!important;-webkit-backdrop-filter:blur(9px)!important;box-shadow:0 12px 28px rgba(3,4,8,.36),inset 0 1px 0 rgba(255,255,255,.05)!important;}
        html[data-rs-mobile="true"] .rs-nav-icon-cycle{animation-duration:6.4s!important;}
        html[data-rs-mobile="true"] .rs-content > div{animation-duration:.2s!important;animation-timing-function:cubic-bezier(.2,.8,.2,1)!important;}
        html[data-rs-mobile="true"][data-rs-interacting="true"] .rs-nav-icon-cycle,
        html[data-rs-mobile="true"][data-rs-interacting="true"] .rs-mesh-stars-near,
        html[data-rs-mobile="true"][data-rs-interacting="true"] .rs-icon-shell,
        html[data-rs-mobile="true"][data-rs-interacting="true"] .rs-icon-wrap,
        html[data-rs-mobile="true"][data-rs-interacting="true"] .rs-icon-svg{animation-play-state:paused!important;transition-duration:.08s!important;}
        html[data-rs-mobile="true"][data-rs-interacting="true"] .rs-content{pointer-events:auto;scroll-behavior:auto!important;}
        .rs-shell{width:100%;max-width:100%;overflow-x:hidden;}
        .rs-content{width:100%;max-width:100%;overflow-x:hidden;}
        .rs-content *{min-width:0;}
        .rs-content img,.rs-content svg,.rs-content video,.rs-content canvas{max-width:100%;}
        button,[role="button"]{font-family:var(--font-button);font-weight:600;letter-spacing:-.01em;touch-action:manipulation;}
        input,textarea,select{font-family:var(--font-body);}
        .type-display{font-family:var(--font-display);font-weight:700;letter-spacing:-.03em;}
        .type-button{font-family:var(--font-button);font-weight:600;letter-spacing:-.01em;}
        .type-number{font-family:var(--font-number);font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums lining-nums;}
        .type-micro{font-family:var(--font-micro);font-weight:500;text-transform:uppercase;letter-spacing:.12em;}
        img{-webkit-user-drag:none;user-select:none;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
        @keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:none}}
        @keyframes drawerSlide{from{transform:translateX(-100%)}to{transform:none}}
        @keyframes toastIn{from{opacity:0;transform:translateY(-16px) scale(.88)}to{opacity:1;transform:none}}
        @keyframes achieveIn{from{opacity:0;transform:translateY(30px) scale(.9)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes ping{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.5}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.1);opacity:0.8}}
        @keyframes shimmer{0%,100%{opacity:.35}50%{opacity:.75}}
        @keyframes progressShine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes levelUpIn{from{opacity:0;transform:translateX(-50%) translateY(-30px) scale(.8)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
        @keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes nebulaFloat1{0%{transform:translate3d(0,0,0) scale(1);opacity:.85}100%{transform:translate3d(4%,3%,0) scale(1.06);opacity:1}}
        @keyframes nebulaFloat2{0%{transform:translate3d(0,0,0) scale(1);opacity:.7}100%{transform:translate3d(-5%,-3%,0) scale(1.1);opacity:.95}}
        @keyframes nebulaFloat3{0%{transform:translate3d(0,0,0) scale(1);opacity:.6}100%{transform:translate3d(3%,-4%,0) scale(1.08);opacity:.9}}

        /* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
           MENU ICON: «Справа-налево» (Premium Sequential Reveal)
           Линии появляются по одной справа налево без увеличения
           в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */
        @keyframes menuBarReveal {
          0%, 10%   { transform: scaleX(0); opacity: 0.5; }
          20%, 80%  { transform: scaleX(1); opacity: 1; }
          90%, 100% { transform: scaleX(0); opacity: 0.5; }
        }
        /* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
           CART ICON: «Приняла покупку» (Premium Accepted Weight)
           Корзина принимает вес товара, оседает, фиксирует покупку
           в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */
        @keyframes cartAcceptedPurchase {
          0%, 35% { transform: translateY(0) scale(1); }
          42% { transform: translateY(2px) scale(0.95); }
          52% { transform: translateY(-4px) scale(1.28); }
          62% { transform: translateY(-1px) scale(1.15); }
          74% { transform: translateY(2px) scale(1.03); }
          88% { transform: translateY(0) scale(1); }
          100% { transform: translateY(0) scale(1); }
        }
        /* в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
           LOGO ORBITAL MARK — «Живая орбита»
           Внешнее кольцо вращается, ядро дышит, slash мерцает
           в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ */
        /* Внешнее кольцо: медленное вращение (12s) */
        @keyframes orbitalRingRotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        /* Ядро: мягкая пульсация (3.5s, синхронизировано с иконками) */
        @keyframes orbitalCorePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.06); opacity: 0.9; }
        }
        /* Slash (диагональ): мерцание (3.5s) */
        @keyframes orbitalSlashGlow {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 0px transparent); }
          50%      { opacity: 0.6; filter: drop-shadow(0 0 4px rgba(255,255,255,0.3)); }
        }
        @keyframes walletAccess {
          0%, 50% { transform: translateY(0) scale(1); }
          58%     { transform: translateY(-2px) scale(1.05); }
          65%     { transform: translateY(-3px) scale(1.28); }
          75%     { transform: translateY(1px) scale(1.08); }
          85%     { transform: translateY(0) scale(1.01); }
          100%    { transform: translateY(0) scale(1); }
        }
        @keyframes walletFlapOpen {
          0%, 50% { transform: scaleY(1); }
          65%     { transform: scaleY(1.15) translateY(-1px); }
          75%     { transform: scaleY(1.05); }
          100%    { transform: scaleY(1); }
        }
        @keyframes walletDotPulse {
          0%, 50% { r: 1.5; opacity: 1; }
          65%     { r: 2.5; opacity: 0.8; }
          100%    { r: 1.5; opacity: 1; }
        }
        /* Profile: «Проявление личности» (Premium Presence) */
        @keyframes iconProfilePresence {
          0%, 45% { transform: perspective(200px) scale(1) translateY(0) rotateY(0deg); }
          52%     { transform: perspective(200px) scale(0.94) translateY(1px) rotateY(0deg); }
          62%     { transform: perspective(200px) scale(1.28) translateY(-2px) rotateY(8deg); }
          70%     { transform: perspective(200px) scale(1.3) translateY(-1px) rotateY(-12deg); }
          82%     { transform: perspective(200px) scale(1.02) translateY(0) rotateY(2deg); }
          100%    { transform: perspective(200px) scale(1) translateY(0) rotateY(0deg); }
        }
        @keyframes starfieldDrift{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(-2.5%,2.5%,0) scale(1.04)}}
        @keyframes starfieldDriftReverse{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(2%,-2%,0) scale(1.03)}}
        @keyframes shootingStar1{0%,62%,100%{opacity:0;transform:translate3d(0,0,0) rotate(-46deg)}8%{opacity:1}30%{opacity:.15;transform:translate3d(16vw,12vh,0) rotate(-46deg)}34%{opacity:0}}
        @keyframes shootingStar2{0%,70%,100%{opacity:0;transform:translate3d(0,0,0) rotate(-38deg)}10%{opacity:.8}32%{opacity:.1;transform:translate3d(-12vw,9vh,0) rotate(-38deg)}36%{opacity:0}}
        @keyframes splashLogoMaterialize{0%{opacity:0;transform:scale(.3) rotate(-20deg);filter:blur(20px)}60%{opacity:1;filter:blur(0)}80%{transform:scale(1.08) rotate(3deg)}100%{opacity:1;transform:scale(1) rotate(0);filter:blur(0)}}
        @keyframes splashLogoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes splashRingPulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.15);opacity:.8}}
        @keyframes starBurst{0%{opacity:0;transform:translate(-50%,-50%) translate(0,0) scale(0)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(1.5)}}
        @keyframes navArcIn{from{opacity:0;transform:scaleX(0)}to{opacity:1;transform:scaleX(1)}}
        @keyframes navIconPop{0%{transform:scale(.75)}55%{transform:scale(1.22)}80%{transform:scale(.95)}100%{transform:scale(1)}}
        @keyframes navGlowPulse{0%,100%{opacity:.55}50%{opacity:.9}}
        @keyframes heroGlow{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes onlinePing{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.4}}
        @keyframes homeSoftRise{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes homeDockSwap{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes homeFadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes nebulaFade{from{opacity:0}to{opacity:1}}
        @keyframes splashSubIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes splashBarIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes splashProgressGlow{0%,100%{box-shadow:0 0 8px ${th.glow}}50%{box-shadow:0 0 18px ${th.glow},0 0 4px ${th.accent}}}
        @keyframes pricingCardIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes priceGlow{0%,100%{box-shadow:0 12px 40px ${th.glow}}50%{box-shadow:0 12px 60px ${th.glow}}}
        input[type=range]{-webkit-appearance:none;height:5px;border-radius:99px;outline:none;background:${th.border};}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:${th.grad};cursor:pointer;box-shadow:0 2px 10px ${th.glow};}
        .swiper{overflow:visible!important;}
        @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important;}}
      `}</style>

      {tab === "profile" ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: th.id === "graphite"
              ? "linear-gradient(180deg, #0a0b10 0%, #101119 48%, #090a0f 100%)"
              : "linear-gradient(180deg, #05070d 0%, #090b14 46%, #05070d 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: th.id === "graphite"
                ? "radial-gradient(ellipse at 18% 16%, rgba(255,255,255,.04) 0%, transparent 44%), radial-gradient(ellipse at 82% 72%, rgba(255,255,255,.03) 0%, transparent 40%)"
                : "radial-gradient(ellipse at 18% 16%, rgba(99,102,241,.08) 0%, transparent 46%), radial-gradient(ellipse at 82% 72%, rgba(139,92,246,.06) 0%, transparent 42%)",
              opacity: 0.9,
            }}
          />
        </div>
      ) : (
        <MeshBg th={th} />
      )}
      <ToastSystem toasts={toasts} th={th} isTg={isTg} />
      {confetti && <Confetti active={confetti} accent={th.accent} />}
      {sparkles && <Sparkles x={sparkles.x} y={sparkles.y} th={th} />}
      {pendingAchieve && <AchievementPopup achievement={pendingAchieve} th={th} onClose={() => setPendingAchieve(null)} sfx={SFX} />}
      {showLevelUp && <LevelUpNotification />}
      <SideDrawer open={drawerOpen} onClose={() => runAfterTap(() => setDrawerOpen(false))} th={th} t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} soundOn={soundOn} setSoundOn={setSoundOn} volume={volume} setVolume={setVolume} streak={streak} sfx={SFX} getLevel={getLevel} getLevelProgress={getLevelProgress} tgUser={tgUser} globals={appGlobals} />

      <div className="rs-shell" style={{ width: "min(var(--tg-shell-width, 420px), 100dvw)", maxWidth: "min(var(--tg-shell-width, 420px), 100dvw)", display: "flex", flexDirection: "column", height: "var(--tg-app-height, 100dvh)", position: "relative", zIndex: 1, overflowX: "clip", transform: "translateZ(0)", transformOrigin: "top center", flexShrink: 0 }}>
        {/* Header */}
        <header style={{ flexShrink: 0, position: "sticky", top: 0, zIndex: 100, padding: "calc(10px + var(--tg-safe-top, 0px)) var(--tg-bar-gap) 0", background: "transparent" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 58, padding: "12px 14px", borderRadius: 24, background: `linear-gradient(180deg, ${th.nav} 0%, ${th.surface} 100%)`, border: `1px solid ${th.border}`, boxShadow: th.shadow, backdropFilter: "blur(28px)", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 14% 18%, rgba(255,255,255,.09) 0 1px, transparent 1.8px), radial-gradient(circle at 84% 72%, rgba(255,255,255,.07) 0 1px, transparent 1.8px), radial-gradient(circle at 72% 24%, rgba(255,255,255,.05) 0 .8px, transparent 1.6px), linear-gradient(135deg, rgba(255,255,255,.03) 0%, transparent 45%, rgba(255,255,255,.02) 100%)", opacity: 0.9, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.95, background: "radial-gradient(circle at 8% 72%, rgba(255,255,255,.08) 0 1px, transparent 1.9px), radial-gradient(circle at 28% 34%, rgba(255,255,255,.05) 0 .9px, transparent 1.7px), radial-gradient(circle at 58% 18%, rgba(255,255,255,.05) 0 .9px, transparent 1.6px), radial-gradient(circle at 92% 58%, rgba(255,255,255,.08) 0 1.05px, transparent 1.9px), linear-gradient(122deg, transparent 16%, rgba(255,255,255,.08) 18%, transparent 21%), radial-gradient(ellipse at 70% -30%, rgba(255,255,255,.06) 0%, transparent 58%), radial-gradient(ellipse at -10% 100%, rgba(255,255,255,.04) 0%, transparent 52%)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 70, position: "relative", zIndex: 1 }}>
              <button onClick={(e) => {
                createSparkles(e.clientX, e.clientY);
                SFX.drawer();
                runAfterTap(() => setDrawerOpen(true));
              }} style={{ display: "flex", flexDirection: "column", gap: 5, width: 38, height: 38, justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,.03)", border: `1px solid ${th.border}`, borderRadius: 14, cursor: "pointer", padding: 0, boxShadow: "inset 0 1px 0 rgba(255,255,255,.04)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end", justifyContent: "center", height: "100%", width: "100%", paddingRight: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 20,
                        height: 1.8,
                        borderRadius: 999,
                        background: th.sub,
                        transformOrigin: "right center",
                        animation: `menuBarReveal 3.5s ease-in-out infinite ${i * 0.25}s`,
                      }}
                    />
                  ))}
                </div>
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, position: "absolute", left: "50%", transform: "translateX(-50%)", zIndex: 1, padding: "0 12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, flexShrink: 0 }}>
                <BrandLogo size={30} />
              </div>
              <span className="type-display" style={{ 
                fontSize: 15, 
                fontWeight: 700, 
                backgroundImage: `linear-gradient(90deg, ${th.hi}, ${th.accent}, ${th.accentB})`,
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                MozBackgroundClip: "text",
                MozTextFillColor: "transparent",
                letterSpacing: "-.03em",
                display: "inline-block",
                animation: "gradientShift 5s ease infinite"
              }}>{t.appName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 84, justifyContent: "flex-end", position: "relative", zIndex: 1 }}>
              <button onClick={(e) => {
                createSparkles(e.clientX, e.clientY);
                SFX.tap();
                changeTab("pricing");
                setTimeout(() => {
                  if (mainRef.current) {
                    mainRef.current.scrollTo({ top: mainRef.current.scrollHeight, behavior: 'smooth' });
                  }
                }, 300);
              }} style={{ width: 38, height: 38, borderRadius: 14, border: `1px solid ${th.border}`, background: th.id === "graphite" ? "rgba(255,255,255,.06)" : th.tag, color: th.text, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: `inset 0 1px 0 rgba(255,255,255,.06), 0 0 0 0 ${th.glow}`, transition: "all .2s ease", overflow: "visible" }}>
                {/* Анимированная иконка корзины — «Приняла покупку» */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", animation: "cartAcceptedPurchase 3.5s ease-in-out infinite" }}>
                  <SystemIcon name="cart" size={16} color={th.text} animated />
                </div>
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 999, background: th.grad, color: th.btnTxt || "#fff", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", boxShadow: `0 2px 8px ${th.glow}` }}>{cartCount}</span>
                )}
              </button>
              {/* Profile Button (Header) */}
              <button
                onClick={(e) => {
                  createSparkles(e.clientX, e.clientY);
                  SFX.tap();
                  changeTab("profile");
                }}
                style={{
                  height: 38,
                  borderRadius: 14,
                  border: `1px solid ${th.border}`,
                  background: th.id === "graphite" ? "linear-gradient(135deg, rgba(255,255,255,.10), rgba(161,161,170,.08))" : "linear-gradient(135deg, rgba(99,102,241,.18), rgba(139,92,246,.12))",
                  color: th.text,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "0 14px",
                  boxShadow: th.id === "graphite" ? "0 4px 14px rgba(255,255,255,.10), inset 0 1px 0 rgba(255,255,255,.08)" : "0 4px 14px rgba(99,102,241,.22), inset 0 1px 0 rgba(255,255,255,.08)",
                  fontSize: 12,
                  fontWeight: 900,
                  transition: "all .2s ease",
                  letterSpacing: "-.01em",
                }}
                aria-label={t.navProfile}
                title={t.navProfile}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", animation: "iconProfilePresence 3.5s ease-in-out infinite", transformOrigin: "center center" }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="9" r="3.8" fill={th.id === "graphite" ? "rgba(255,255,255,.6)" : th.accent} />
                    <path d="M5.8 20.4c0-3.4 2.8-6.2 6.2-6.2s6.2 2.8 6.2 6.2" fill={th.id === "graphite" ? "rgba(255,255,255,.6)" : th.accent} strokeLinecap="round" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </header>

        {tab === "home" && (
          <div className="type-micro" style={{ flexShrink: 0, padding: "8px var(--tg-side-gap) 0", fontSize: 11, color: th.sub }}>
            {greeting}{tgUser?.first_name ? `, ${tgUser.first_name}` : ""} <SystemIcon name="hand" size={13} color={th.sub} animated />
          </div>
        )}

        <main className="rs-content" ref={mainRef} onScroll={markScrollActivity} style={{ flex: 1, padding: "14px var(--tg-side-gap) calc(128px + var(--tg-safe-bottom, 0px))", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
          <div
            key={tab}
            style={{
              animation: tab === "profile" ? "none" : "cardIn .35s ease both",
              opacity: 1,
              transform: "translateZ(0)",
              willChange: tab === "profile" ? "auto" : "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          >
            <React.Suspense fallback={<div style={{ minHeight: 280, borderRadius: 28, border: `1px solid ${th.border}`, background: th.card, opacity: 0.7 }} />}>
              {tab === "home" && <HomeTab th={th} t={t} lang={lang} onGoGallery={() => changeTab("gallery")} onGoCourses={() => changeTab("courses")} onGoPricing={() => changeTab("pricing")} onGoMore={() => changeTab("more")} cartCount={cartCount} streak={streak} onUnlockAchieve={unlockAchievement} globals={appGlobals} />}
              {tab === "gallery" && <GalleryTab th={th} t={t} lang={lang} wishlist={wishlist} toggleWishlist={toggleWishlist} onOpenImage={item => setSelImage(item)} globals={appGlobals} />}
              {tab === "ai" && <AITab th={th} t={t} lang={lang} showToast={showToast} globals={appGlobals} />}
              {tab === "courses" && <CoursesTab th={th} t={t} lang={lang} showToast={showToast} addXPfn={addXPfn} onUnlockAchieve={unlockAchievement} streak={streak} setStreak={setStreak} globals={appGlobals} />}
              {tab === "pricing" && <PricingTab th={th} t={t} lang={lang} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} updateQty={updateQty} clearCart={clearCart} showToast={showToast} onUnlockAchieve={unlockAchievement} setTab={changeTab} walletBalance={walletBalance} createCheckoutOrder={createCheckoutOrder} openCryptoBot={openCryptoBot} openStarsInvoice={openStarsInvoice} openOrderTelegram={openOrderTelegram} globals={appGlobals} />}

              {tab === "more" && <MoreTab th={th} t={t} lang={lang} showToast={showToast} streak={streak} onUnlockAchieve={unlockAchievement} addXPfn={addXPfn} globals={appGlobals} />}
              {tab === "profile" && <ProfileTab th={th} t={t} lang={lang} streak={streak} achievements={achievements} showToast={showToast} setTab={changeTab} setSelectedAchievement={setSelectedAchievement} walletBalance={walletBalance} paymentHistory={paymentHistory} orders={orders} onRequestTopUp={requestTopUp} onMarkPaymentSubmitted={markPaymentSubmitted} onRefreshInvoiceStatus={refreshInvoiceStatus} onAddOrderMessage={addOrderMessage} onOpenCryptoBot={openCryptoBot} onOpenStarsInvoice={openStarsInvoice} onOpenTelegram={openOrderTelegram} onRequestPaymentDetails={requestPaymentDetails} globals={appGlobals} />}
            </React.Suspense>
          </div>
        </main>

        <BottomNav active={tab} onChange={changeTab} onPreloadTab={preloadTabById} th={th} t={t} cartCount={cartCount} ordersCount={activeOrdersCount} walletBalance={walletBalance} sfx={SFX} />
      </div>

      {selImage && <ImageModal item={selImage} th={th} t={t} onClose={() => { setSelImage(null); SFX.close(); }} wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} sfx={SFX} openTg={openTg} />}
      {selectedAchievement && (
        <AchievementDetailModal
          achievement={selectedAchievement}
          th={th}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
}


