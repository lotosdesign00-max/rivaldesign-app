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

const loadGalleryTab = () => import("./components/GalleryTab");
const loadAITab = () => import("./components/AITab");
const loadCoursesTab = () => import("./components/CoursesTab");
const loadPricingTab = () => import("./components/PricingTab");
const loadMoreTab = () => import("./components/MoreTab");
const loadProfileTab = () => import("./components/ProfileTab");
const GalleryTab = React.lazy(loadGalleryTab);
const AITab = React.lazy(loadAITab);
const CoursesTab = React.lazy(loadCoursesTab);
const PricingTab = React.lazy(loadPricingTab);
const MoreTab = React.lazy(loadMoreTab);
const ProfileTab = React.lazy(loadProfileTab);
const preloadLazyTabs = () => {
  const queue = [loadGalleryTab, loadAITab, loadCoursesTab, loadPricingTab, loadMoreTab, loadProfileTab];
  let index = 0;
  const loadNext = () => {
    const load = queue[index];
    index += 1;
    if (!load) return;
    load().catch(() => {}).finally(() => {
      if (index >= queue.length) return;
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(loadNext, { timeout: 1200 });
        return;
      }
      window.setTimeout(loadNext, 180);
    });
  };
  loadNext();
};
const makeEntityId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const roundMoney = (value) => Math.round(Number(value || 0) * 100) / 100;
const moneyUsd = (value) => `$${roundMoney(value).toFixed(2)}`;
const REMOTE_BRIEF_MARK = "__RIVAL_META__::";
const STARS_UAH_PER_STAR = 0.84;

function encodeRemoteBrief(userBrief = "", meta = {}) {
  return `${REMOTE_BRIEF_MARK}${JSON.stringify({
    userBrief,
    ...meta,
  })}`;
}

function decodeRemoteBrief(rawBrief = "") {
  if (typeof rawBrief !== "string" || !rawBrief.startsWith(REMOTE_BRIEF_MARK)) {
    return { userBrief: rawBrief || "", meta: {} };
  }

  try {
    const parsed = JSON.parse(rawBrief.slice(REMOTE_BRIEF_MARK.length));
    return {
      userBrief: parsed.userBrief || "",
      meta: parsed || {},
    };
  } catch {
    return { userBrief: rawBrief || "", meta: {} };
  }
}

function deriveBotInvoiceUrl(rawUrl = "") {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  if (rawUrl.includes("t.me/CryptoBot?start=")) return rawUrl;

  const startAppMatch = rawUrl.match(/startapp=invoice-([^&]+)/i);
  if (startAppMatch?.[1]) {
    return `https://t.me/CryptoBot?start=${startAppMatch[1]}`;
  }

  const webMatch = rawUrl.match(/\/invoices\/([^/?#]+)/i);
  if (webMatch?.[1]) {
    return `https://t.me/CryptoBot?start=${webMatch[1]}`;
  }

  return "";
}

function deriveInvoiceHash(input = "") {
  if (!input || typeof input !== "string") return "";

  const botMatch = input.match(/[?&]start=([^&]+)/i);
  if (botMatch?.[1]) return botMatch[1];

  const startAppMatch = input.match(/startapp=invoice-([^&]+)/i);
  if (startAppMatch?.[1]) return startAppMatch[1];

  const webMatch = input.match(/\/invoices\/([^/?#]+)/i);
  if (webMatch?.[1]) return webMatch[1];

  return "";
}

function getLangConfigByCode(currencyCode = "", langs = {}) {
  return Object.values(langs || {}).find((item) => item?.code === currencyCode) || null;
}

function getUahPerUsd(langs = {}) {
  return getLangConfigByCode("UAH", langs)?.rate || 40;
}

function getLocalPerStar(currencyCode = "USD", langs = {}) {
  if (currencyCode === "UAH") return STARS_UAH_PER_STAR;
  const localRate = getLangConfigByCode(currencyCode, langs)?.rate || 1;
  const usdPerStar = STARS_UAH_PER_STAR / getUahPerUsd(langs);
  return roundMoney(usdPerStar * localRate);
}

function estimateStarsFromUsd(amountUsd, langs = {}) {
  const totalUah = roundMoney(Number(amountUsd || 0) * getUahPerUsd(langs));
  return Math.max(1, Math.ceil(totalUah / STARS_UAH_PER_STAR));
}

/*в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
   RIVAL SPACE — TELEGRAM MINI APP v4.0 ULTRA
   Complete redesign with AI, achievements, rich animations, new UX
в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ*/

// ── TYPEWRITER ANIMATED TEXT COMPONENT ──


// ── AUDIO ENGINE ──
let _actx = null, _master = null, _soundEnabled = true, _volume = 0.55, _audioUnlocked = false;
function actx() {
  if (!_actx) { try { _actx = new (window.AudioContext || window.webkitAudioContext)(); _master = _actx.createGain(); _master.connect(_actx.destination); } catch {} }
  return _actx;
}
function unlockAudio() {
  _audioUnlocked = true;
  try { actx()?.resume?.(); } catch {}
}
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });
}
function note(f, t = "sine", v = 0.07, d = 0.12, delay = 0) {
  if (!_soundEnabled || !_audioUnlocked) return;
  const c = actx(); if (!c || !_master) return;
  try {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(_master); _master.gain.value = _volume;
    o.type = t; o.frequency.value = f;
    const n = c.currentTime + delay;
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(v, n + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, n + d);
    o.start(n); o.stop(n + d + 0.05);
  } catch {}
}
const SFX = {
  tap: () => { note(880, "sine", .05, .07); tgHaptic("light"); },
  tab: () => { note(660, "triangle", .06, .09); note(880, "sine", .04, .07, .04); tgSelection(); },
  open: () => { [440, 660, 880].forEach((f, i) => note(f, "sine", .06, .14, i * .04)); tgHaptic("medium"); },
  close: () => { [880, 660, 440].forEach((f, i) => note(f, "sine", .05, .1, i * .03)); },
  success: () => { [523, 659, 784, 1047].forEach((f, i) => note(f, "sine", .08, .18, i * .07)); tgNotif("success"); },
  error: () => { [350, 250].forEach((f, i) => note(f, "sawtooth", .06, .15, i * .06)); tgNotif("error"); },
  addCart: () => { [523, 659, 784].forEach((f, i) => note(f, "sine", .07, .12, i * .05)); tgHaptic("medium"); },
  remove: () => { note(280, "sawtooth", .05, .13); tgHaptic("light"); },
  clear: () => { [380, 280, 180].forEach((f, i) => note(f, "sawtooth", .05, .1, i * .05)); tgHaptic("heavy"); },
  order: () => { [261, 329, 392, 523, 659, 784].forEach((f, i) => note(f, "sine", .09, .2, i * .06)); tgNotif("success"); },
  theme: () => { [300, 400, 500, 600].forEach((f, i) => note(f, "sine", .05, .12, i * .04)); tgHaptic("medium"); },
  lang: () => { note(700, "sine", .06, .1); note(900, "sine", .05, .1, .06); tgSelection(); },
  ai: () => { [200, 300, 400, 500, 600, 700, 800].forEach((f, i) => note(f, "sine", .04, .14, i * .04)); tgHaptic("medium"); },
  aiDone: () => { [784, 988, 1175, 1568].forEach((f, i) => note(f, "sine", .08, .2, i * .08)); tgNotif("success"); },
  like: () => { note(880, "sine", .07, .14); note(1100, "sine", .05, .1, .07); tgHaptic("light"); },
  copy: () => { note(800, "sine", .05, .08); note(1000, "sine", .04, .07, .05); tgHaptic("light"); },
  filter: () => { note(600, "triangle", .04, .08); tgSelection(); },
  toggle: () => { note(700, "triangle", .05, .1); tgSelection(); },
  drawer: () => { [500, 700].forEach((f, i) => note(f, "sine", .05, .12, i * .05)); tgHaptic("medium"); },
  wishlist: () => { note(660, "sine", .07, .12); note(880, "sine", .05, .1, .07); tgHaptic("medium"); },
  confetti: () => { [400, 500, 600, 700, 800, 900, 1000].forEach((f, i) => note(f, "sine", .1, .25, i * .05)); tgNotif("success"); },
  boot: () => [261, 329, 392, 523].forEach((f, i) => note(f, "sine", .07, .2, i * .1)),
  course: () => { [440, 554, 659, 880].forEach((f, i) => note(f, "sine", .06, .16, i * .06)); tgHaptic("medium"); },
  levelUp: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, "sine", .09, .22, i * .08)); tgNotif("success"); },
  streak: () => { [600, 700, 800, 900, 1000, 1100].forEach((f, i) => note(f, "triangle", .05, .12, i * .04)); tgNotif("success"); },
  promo: () => { [784, 988, 1175].forEach((f, i) => note(f, "sine", .08, .18, i * .06)); tgNotif("success"); },
  quiz: () => { note(440, "triangle", .06, .12); tgHaptic("light"); },
  quizCorrect: () => { [523, 784, 1047].forEach((f, i) => note(f, "sine", .09, .2, i * .07)); tgNotif("success"); },
  quizWrong: () => { [300, 200].forEach((f, i) => note(f, "sawtooth", .06, .15, i * .08)); tgNotif("error"); },
  achievement: () => { [784, 1047, 1319, 1568].forEach((f, i) => note(f, "sine", .1, .25, i * .09)); tgNotif("success"); },
  ping: () => { note(1200, "sine", .04, .06); },
};

// ── DESIGN SYSTEM ──
const THEMES = {
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
    id: "graphite", label: "Graphite", emoji: "в¬ў", tone: "dark",
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

const LANGS = {
  ru: { flag: "\uD83C\uDDF7\uD83C\uDDFA", name: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", cur: "\u20BD", code: "RUB", rate: 95 },
  en: { flag: "\uD83C\uDDFA\uD83C\uDDF8", name: "English", cur: "$", code: "USD", rate: 1 },
  ua: { flag: "\uD83C\uDDFA\uD83C\uDDE6", name: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430", cur: "\u20B4", code: "UAH", rate: 40 },
  kz: { flag: "\uD83C\uDDF0\uD83C\uDDFF", name: "\u049A\u0430\u0437\u0430\u049B\u0448\u0430", cur: "\u20B8", code: "KZT", rate: 450 },
  by: { flag: "\uD83C\uDDE7\uD83C\uDDFE", name: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F", cur: "Br", code: "BYN", rate: 3.2 },
};

// ── GALLERY ──
const GALLERY = {
  ru: [
    { id: "a1", cat: "Аватарки", title: "Киберпанк аватар", desc: "Неоновое свечение и sci-fi эстетика", img: "https://picsum.photos/seed/rsa1/1080/1280", tags: ["neon", "cyber", "scifi"], popular: true, views: 1240 },
    { id: "a2", cat: "Аватарки", title: "Минимал аватар", desc: "Чистый геометрический минимализм", img: "https://picsum.photos/seed/rsa2/1080/1280", tags: ["minimal", "geo"], popular: false, views: 560 },
    { id: "a3", cat: "Аватарки", title: "Тёмный аватар", desc: "Мрачный атмосферный стиль", img: "https://picsum.photos/seed/rsa3/1080/1280", tags: ["dark", "moody"], popular: true, views: 980 },
    { id: "a4", cat: "Аватарки", title: "Градиент аватар", desc: "Плавные переходы, мягкие тона", img: "https://picsum.photos/seed/rsa4/1080/1280", tags: ["gradient", "soft"], popular: false, views: 430 },
    { id: "a5", cat: "Аватарки", title: "Anime аватар", desc: "Иллюстрация в аниме-стиле", img: "https://picsum.photos/seed/rsa5/1080/1280", tags: ["anime", "illustration"], popular: true, views: 2100 },
    { id: "a6", cat: "Аватарки", title: "Pixel аватар", desc: "Пиксельное ретро искусство", img: "https://picsum.photos/seed/rsa6/1080/1280", tags: ["pixel", "retro"], popular: false, views: 310 },
    { id: "p1", cat: "Превью", title: "YouTube превью Gaming", desc: "Эпичный геймерский дизайн", img: "https://picsum.photos/seed/rsp1/1080/1280", tags: ["youtube", "game"], popular: true, views: 3400 },
    { id: "p2", cat: "Превью", title: "Twitch превью", desc: "Стримерский дизайн с индивидуальностью", img: "https://picsum.photos/seed/rsp2/1080/1280", tags: ["twitch", "stream"], popular: false, views: 780 },
    { id: "p3", cat: "Превью", title: "Viral превью", desc: "Заставит кликать каждого", img: "/images/podborka av 4.png", tags: ["viral", "bright"], popular: true, views: 5600 },
    { id: "p4", cat: "Превью", title: "Минимал превью", desc: "Элегантная лаконичность", img: "https://picsum.photos/seed/rsp4/1080/1280", tags: ["minimal", "clean"], popular: false, views: 290 },
    { id: "p5", cat: "Превью", title: "Dark превью", desc: "Тёмная тема, максимум атмосферы", img: "https://picsum.photos/seed/rsp5/1080/1280", tags: ["dark", "cinematic"], popular: true, views: 1870 },
    { id: "b1", cat: "Баннеры", title: "Twitch баннер PRO", desc: "Профессиональная шапка канала", img: "https://picsum.photos/seed/rsb1/1080/1280", tags: ["twitch", "channel"], popular: true, views: 2200 },
    { id: "b2", cat: "Баннеры", title: "Discord баннер", desc: "Уникальная серверная шапка", img: "https://picsum.photos/seed/rsb2/1080/1280", tags: ["discord"], popular: false, views: 650 },
    { id: "b3", cat: "Баннеры", title: "YouTube шапка 4K", desc: "Безупречный канальный арт", img: "https://picsum.photos/seed/rsb3/1080/1280", tags: ["youtube", "4k"], popular: true, views: 3100 },
    { id: "b4", cat: "Баннеры", title: "VK/TikTok баннер", desc: "Для соцсетей нового поколения", img: "https://picsum.photos/seed/rsb4/1080/1280", tags: ["vk", "tiktok"], popular: false, views: 410 },
    { id: "l1", cat: "Логотипы", title: "Gaming лого eSports", desc: "Победные символы для команд", img: "https://picsum.photos/seed/rsl1/1080/1280", tags: ["game", "esports", "logo"], popular: true, views: 4200 },
    { id: "l2", cat: "Логотипы", title: "Минимал лого", desc: "Современный геометрический бренд", img: "https://picsum.photos/seed/rsl2/1080/1280", tags: ["minimal", "geo", "logo"], popular: false, views: 740 },
    { id: "l3", cat: "Логотипы", title: "Неон лого", desc: "Светящийся знак в ночи", img: "https://picsum.photos/seed/rsl3/1080/1280", tags: ["neon", "glow", "logo"], popular: true, views: 1950 },
    { id: "l4", cat: "Логотипы", title: "3D лого PRO", desc: "Объёмный дизайн нового уровня", img: "https://picsum.photos/seed/rsl4/1080/1280", tags: ["3d", "volume", "logo"], popular: false, views: 580 },
    { id: "l5", cat: "Логотипы", title: "Mascot лого", desc: "Персонаж-маскот для бренда", img: "https://picsum.photos/seed/rsl5/1080/1280", tags: ["mascot", "character", "logo"], popular: true, views: 2800 },
  ],
  en: [
    { id: "a1", cat: "Avatars", title: "Cyberpunk Avatar", desc: "Neon glow sci-fi aesthetic", img: "https://picsum.photos/seed/rsa1/1080/1280", tags: ["neon", "cyber", "scifi"], popular: true, views: 1240 },
    { id: "a2", cat: "Avatars", title: "Minimal Avatar", desc: "Clean geometric minimalism", img: "https://picsum.photos/seed/rsa2/1080/1280", tags: ["minimal", "geo"], popular: false, views: 560 },
    { id: "a3", cat: "Avatars", title: "Dark Avatar", desc: "Moody atmospheric style", img: "https://picsum.photos/seed/rsa3/1080/1280", tags: ["dark", "moody"], popular: true, views: 980 },
    { id: "a4", cat: "Avatars", title: "Gradient Avatar", desc: "Smooth pastel transitions", img: "https://picsum.photos/seed/rsa4/1080/1280", tags: ["gradient", "soft"], popular: false, views: 430 },
    { id: "a5", cat: "Avatars", title: "Anime Avatar", desc: "Anime illustration style", img: "https://picsum.photos/seed/rsa5/1080/1280", tags: ["anime", "illustration"], popular: true, views: 2100 },
    { id: "a6", cat: "Avatars", title: "Pixel Avatar", desc: "Retro pixel art", img: "https://picsum.photos/seed/rsa6/1080/1280", tags: ["pixel", "retro"], popular: false, views: 310 },
    { id: "p1", cat: "Previews", title: "YouTube Gaming Preview", desc: "Epic gamer thumbnail design", img: "https://picsum.photos/seed/rsp1/1080/1280", tags: ["youtube", "game"], popular: true, views: 3400 },
    { id: "p2", cat: "Previews", title: "Twitch Preview", desc: "Streamer-focused unique design", img: "https://picsum.photos/seed/rsp2/1080/1280", tags: ["twitch"], popular: false, views: 780 },
    { id: "p3", cat: "Previews", title: "Viral Preview", desc: "Impossible not to click", img: "https://picsum.photos/seed/rsp3/1080/1280", tags: ["viral", "bright"], popular: true, views: 5600 },
    { id: "p4", cat: "Previews", title: "Minimal Preview", desc: "Elegant and clean", img: "https://picsum.photos/seed/rsp4/1080/1280", tags: ["minimal"], popular: false, views: 290 },
    { id: "p5", cat: "Previews", title: "Dark Preview", desc: "Dark cinematic atmosphere", img: "https://picsum.photos/seed/rsp5/1080/1280", tags: ["dark", "cinematic"], popular: true, views: 1870 },
    { id: "b1", cat: "Banners", title: "Twitch Banner PRO", desc: "Professional channel header", img: "https://picsum.photos/seed/rsb1/1080/1280", tags: ["twitch"], popular: true, views: 2200 },
    { id: "b2", cat: "Banners", title: "Discord Banner", desc: "Unique server header", img: "https://picsum.photos/seed/rsb2/1080/1280", tags: ["discord"], popular: false, views: 650 },
    { id: "b3", cat: "Banners", title: "YouTube Header 4K", desc: "Flawless channel art", img: "https://picsum.photos/seed/rsb3/1080/1280", tags: ["youtube"], popular: true, views: 3100 },
    { id: "b4", cat: "Banners", title: "VK/TikTok Banner", desc: "Next-gen social media", img: "https://picsum.photos/seed/rsb4/1080/1280", tags: ["tiktok"], popular: false, views: 410 },
    { id: "l1", cat: "Logos", title: "Gaming eSports Logo", desc: "Victory symbol for teams", img: "https://picsum.photos/seed/rsl1/1080/1280", tags: ["game", "esports"], popular: true, views: 4200 },
    { id: "l2", cat: "Logos", title: "Minimal Logo", desc: "Modern geometric brand", img: "https://picsum.photos/seed/rsl2/1080/1280", tags: ["minimal"], popular: false, views: 740 },
    { id: "l3", cat: "Logos", title: "Neon Logo", desc: "Glowing sign in the night", img: "https://picsum.photos/seed/rsl3/1080/1280", tags: ["neon"], popular: true, views: 1950 },
    { id: "l4", cat: "Logos", title: "3D Logo PRO", desc: "Next-level volumetric design", img: "https://picsum.photos/seed/rsl4/1080/1280", tags: ["3d"], popular: false, views: 580 },
    { id: "l5", cat: "Logos", title: "Mascot Logo", desc: "Character mascot for brand", img: "https://picsum.photos/seed/rsl5/1080/1280", tags: ["mascot"], popular: true, views: 2800 },
  ],
};
GALLERY.ua = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватарки", "Превью": "Прев'ю", "Баннеры": "Банери", "Логотипы": "Логотипи" }[i.cat] || i.cat }));
GALLERY.kz = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватарлар", "Превью": "Превью", "Баннеры": "Баннерлер", "Логотипы": "Логотиптер" }[i.cat] || i.cat }));
GALLERY.by = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватаркі", "Превью": "Прэв'ю", "Баннеры": "Банеры", "Логотипы": "Лагатыпы" }[i.cat] || i.cat }));

// Prefer real local works over picsum placeholders in gallery.
const LOCAL_GALLERY_ASSETS = {
  avatars: [
    "/images/podborka av 1.jpg",
    "/images/podborka av 2.jpg",
    "/images/podborka av 3.jpg",
    "/images/podborka av 4.png",
    "/images/podborka av 5.png",
  ],
  previews: [
    "/images/podborka prewiew 1.jpg",
    "/images/podborka prewiew 2.jpg",
    "/images/podborka prewiew 3.jpg",
    "/images/podborka prewiew 4.jpg",
    "/images/podborka prewiew 5.jpg",
    "/images/%D0%BC%D0%BE%D0%BA%D0%B0%D0%BF%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D1%80%D0%B5%D0%B2%D1%8C%D1%8E%D1%88%D0%B5%D0%BA.png",
  ],
};
LOCAL_GALLERY_ASSETS.banners = LOCAL_GALLERY_ASSETS.previews;
LOCAL_GALLERY_ASSETS.logos = LOCAL_GALLERY_ASSETS.avatars;

function pickGalleryAsset(pool, index) {
  if (!Array.isArray(pool) || pool.length === 0) return "";
  return pool[index % pool.length];
}

function resolveLocalGalleryImage(item, index) {
  const id = String(item?.id || "");
  if (id.startsWith("a")) return pickGalleryAsset(LOCAL_GALLERY_ASSETS.avatars, index);
  if (id.startsWith("p")) return pickGalleryAsset(LOCAL_GALLERY_ASSETS.previews, index);
  if (id.startsWith("b")) return pickGalleryAsset(LOCAL_GALLERY_ASSETS.banners, index);
  if (id.startsWith("l")) return pickGalleryAsset(LOCAL_GALLERY_ASSETS.logos, index);
  return item?.img || "";
}

Object.keys(GALLERY).forEach((locale) => {
  GALLERY[locale] = (GALLERY[locale] || []).map((item, index) => {
    const img = String(item?.img || "");
    if (!img.includes("picsum.photos")) return item;
    return { ...item, img: resolveLocalGalleryImage(item, index) };
  });
});
const CAT_ICONS = {
  "Аватарки": "●", "Avatars": "●", "Аватаркі": "●", "Аватарлар": "●",
  "Прев'ю": "▶", "Previews": "▶", "Превью": "▶", "Прэв'ю": "▶",
  "Баннеры": "▬", "Banners": "▬", "Банери": "▬", "Банеры": "▬", "Баннерлер": "▬",
  "Логотипы": "✦", "Logos": "✦", "Логотипи": "✦", "Лагатыпы": "✦", "Логотиптер": "✦",
};

// ── COURSES ──
const COURSES_DATA = {
  ru: [
{ id: "c1", cat: "Основы", title: "Photoshop с нуля", desc: "Полный курс базы графического дизайна", level: "Начинающий", duration: "3 ч", lessons: 12, img: "https://picsum.photos/seed/course1/600/340", popular: true, free: true, price: 0, rating: 4.9, students: 2840, topics: ["Интерфейс", "Слои", "Выделение", "Цвет", "Текст", "Фильтры", "Маски", "Смарт-объекты", "Экспорт", "Batch", "Шорткаты", "Финал"] },
{ id: "c2", cat: "Основы", title: "Теория цвета", desc: "Палитры, гармонии и психология цвета", level: "Начинающий", duration: "2 ч", lessons: 8, img: "https://picsum.photos/seed/course2/600/340", popular: true, free: true, price: 0, rating: 4.8, students: 1920, topics: ["Цветовой круг", "Тёплые/холодные", "Комплементарные", "Триады", "Психология", "Веб-палитры", "Брендинг", "Практика"] },
{ id: "c3", cat: "Продвинутый", title: "Аватарки PRO", desc: "Создавай аватары топового уровня", level: "Продвинутый", duration: "5 ч", lessons: 16, img: "https://picsum.photos/seed/course3/600/340", popular: true, free: false, price: 15, rating: 5.0, students: 680, topics: ["Тренды", "Композиция", "Свет/тень", "Неон", "Глитч", "Smoke", "3D элементы", "Текстуры", "Киберпанк", "Минимализм", "Градиент PRO", "Цветокоррекция", "Animated PFP", "Мокапы", "Портфолио", "Фриланс"] },
{ id: "c4", cat: "Продвинутый", title: "YouTube Thumbnail Master", desc: "Превью которые принесут миллионы просмотров", level: "Продвинутый", duration: "4 ч", lessons: 14, img: "https://picsum.photos/seed/course4/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 430, topics: ["Психология кликов", "Композиция", "Типографика", "Лицо", "Эмоции", "Контраст", "A/B тест", "Шаблоны", "Ниши", "Анимация", "CTR", "Тренды 2025", "Ошибки", "Проект"] },
{ id: "c5", cat: "Брендинг", title: "Логотип с нуля до профи", desc: "Полный гайд по логотипам и брендингу", level: "Средний", duration: "6 ч", lessons: 18, img: "https://picsum.photos/seed/course5/600/340", popular: true, free: false, price: 20, rating: 4.9, students: 1100, topics: ["История", "Типы", "Бриф", "Скетчинг", "Цвет", "Типографика", "Вектор", "Illustrator PRO", "Адаптивные", "Анимация", "Гайдлайн", "Мокапы", "Презентация", "Ценообразование", "Правки", "Авторское право", "Портфолио", "Фриланс"] },
{ id: "c6", cat: "Моушн", title: "Motion Design старт", desc: "Оживи свои дизайны анимацией", level: "Средний", duration: "8 ч", lessons: 20, img: "https://picsum.photos/seed/course6/600/340", popular: true, free: false, price: 25, rating: 4.8, students: 790, topics: ["After Effects", "Ключевые кадры", "Easing", "Текст", "Shape layers", "Маски", "Precomps", "Expressions", "Анимация лого", "Переходы", "Particles", "3D слои", "Камера", "Рендер", "GIF", "Lottie", "Веб", "Соцсети", "Шоурил", "Проект"] },
{ id: "c7", cat: "Бизнес", title: "Фриланс дизайнер", desc: "Как зарабатывать $1000+/мес на дизайне", level: "Все уровни", duration: "4 ч", lessons: 15, img: "https://picsum.photos/seed/course7/600/340", popular: false, free: false, price: 10, rating: 4.6, students: 560, topics: ["Ниша", "Портфолио", "Биржи", "Клиенты", "Ценообразование", "Переговоры", "Контракты", "Управление", "Дедлайны", "Обратная связь", "Масштаб", "Пассивный доход", "Личный бренд", "Соцсети", "Рост"] },
{ id: "c8", cat: "Бизнес", title: "Дизайн для стримеров", desc: "Полный пак для Twitch / YouTube", level: "Средний", duration: "5 ч", lessons: 14, img: "https://picsum.photos/seed/course8/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 380, topics: ["Оверлеи", "Панели Twitch", "Алерты", "Ожидание", "Шапка", "Эмоуты", "Брендинг", "Пак", "Анимация", "OBS", "Саб-бейджи", "Мерч", "Ценообразование", "Портфолио"] },
  ],
  en: [
    { id: "c1", cat: "Basics", title: "Photoshop from Zero", desc: "Complete graphic design foundation", level: "Beginner", duration: "3h", lessons: 12, img: "https://picsum.photos/seed/course1/600/340", popular: true, free: true, price: 0, rating: 4.9, students: 2840, topics: ["Interface", "Layers", "Selection", "Color", "Text", "Filters", "Masks", "Smart Objects", "Export", "Batch", "Shortcuts", "Final Project"] },
    { id: "c2", cat: "Basics", title: "Color Theory", desc: "Palettes, harmonies and psychology", level: "Beginner", duration: "2h", lessons: 8, img: "https://picsum.photos/seed/course2/600/340", popular: true, free: true, price: 0, rating: 4.8, students: 1920, topics: ["Color Wheel", "Warm/Cool", "Complementary", "Triads", "Psychology", "Web Palettes", "Branding", "Practice"] },
    { id: "c3", cat: "Advanced", title: "Avatar Design PRO", desc: "Create top-tier avatar artwork", level: "Advanced", duration: "5h", lessons: 16, img: "https://picsum.photos/seed/course3/600/340", popular: true, free: false, price: 15, rating: 5.0, students: 680, topics: ["Trends", "Composition", "Light & Shadow", "Neon", "Glitch", "Smoke", "3D Elements", "Textures", "Cyberpunk", "Minimalism", "Gradients PRO", "Color Grading", "Animated PFP", "Mockups", "Portfolio", "Freelance"] },
    { id: "c4", cat: "Advanced", title: "YouTube Thumbnail Master", desc: "Thumbnails that earn millions of views", level: "Advanced", duration: "4h", lessons: 14, img: "https://picsum.photos/seed/course4/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 430, topics: ["Click Psychology", "Composition", "Typography", "Face", "Emotions", "Contrast", "A/B Testing", "Templates", "Niches", "Animation", "CTR", "Trends 2025", "Mistakes", "Project"] },
    { id: "c5", cat: "Branding", title: "Logo from Zero to Pro", desc: "Full logo & branding guide", level: "Intermediate", duration: "6h", lessons: 18, img: "https://picsum.photos/seed/course5/600/340", popular: true, free: false, price: 20, rating: 4.9, students: 1100, topics: ["History", "Types", "Brief", "Sketching", "Color", "Typography", "Vector", "Illustrator PRO", "Adaptive", "Animation", "Guidelines", "Mockups", "Presentation", "Pricing", "Revisions", "Copyright", "Portfolio", "Freelance"] },
    { id: "c6", cat: "Motion", title: "Motion Design Start", desc: "Bring your designs to life", level: "Intermediate", duration: "8h", lessons: 20, img: "https://picsum.photos/seed/course6/600/340", popular: true, free: false, price: 25, rating: 4.8, students: 790, topics: ["After Effects", "Keyframes", "Easing", "Text", "Shape Layers", "Masks", "Precomps", "Expressions", "Logo Animation", "Transitions", "Particles", "3D Layers", "Camera", "Render", "GIF", "Lottie", "Web", "Social", "Showreel", "Project"] },
    { id: "c7", cat: "Business", title: "Freelance Designer", desc: "Earn $1000+/month with design", level: "All Levels", duration: "4h", lessons: 15, img: "https://picsum.photos/seed/course7/600/340", popular: false, free: false, price: 10, rating: 4.6, students: 560, topics: ["Niche", "Portfolio", "Platforms", "Clients", "Pricing", "Negotiations", "Contracts", "Management", "Deadlines", "Feedback", "Scaling", "Passive Income", "Brand", "Social", "Growth"] },
    { id: "c8", cat: "Business", title: "Design for Streamers", desc: "Full pack for Twitch / YouTube", level: "Intermediate", duration: "5h", lessons: 14, img: "https://picsum.photos/seed/course8/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 380, topics: ["Overlays", "Twitch Panels", "Alerts", "Waiting Screens", "Channel Header", "Emotes", "Branding", "Pack", "Animation", "OBS", "Sub Badges", "Merch", "Pricing", "Portfolio"] },
  ],
};
COURSES_DATA.ua = COURSES_DATA.ru;
COURSES_DATA.kz = COURSES_DATA.ru;
COURSES_DATA.by = COURSES_DATA.ru;
const LOCAL_COURSE_COVERS = [
  ...LOCAL_GALLERY_ASSETS.previews,
  ...LOCAL_GALLERY_ASSETS.avatars,
];
Object.keys(COURSES_DATA).forEach((locale) => {
  COURSES_DATA[locale] = (COURSES_DATA[locale] || []).map((course, index) => {
    const img = String(course?.img || "");
    if (!img.includes("picsum.photos")) return course;
    return { ...course, img: pickGalleryAsset(LOCAL_COURSE_COVERS, index) };
  });
});
const COURSES = COURSES_DATA;
const COURSE_CATS = [...new Set((COURSES_DATA.ru || []).map((course) => course.cat))];

// ── REVIEWS ──
const REVIEWS = [
  { id: "r1", name: "Darkslide", tg: "Darkslide", rating: 5, text: "Работа выполнена раньше срока и качество превзошло все ожидания. Аватарка получилась невероятной — рекомендую всем!", time: "2 дня назад", verified: true },
  { id: "r2", name: "VoidProxy", tg: "VoidProxy", rating: 5, text: "Отличный дизайнер с глубоким пониманием стиля. Работа выполнена профессионально и быстро.", time: "5 дней назад", verified: true },
  { id: "r3", name: "Nextra", tg: "Nextra", rating: 5, text: "Заказывал превью для YouTube — очень доволен результатом. CTR вырос на 40% после смены превью!", time: "1 нед назад", verified: true },
  { id: "r4", name: "HoskeHeviz", tg: "hoskefromheviz", rating: 5, text: "Благодарю за работу, всё профессионально, учтены все детали и пожелания.", time: "2 нед назад", verified: true },
  { id: "r5", name: "Solevoy", tg: "fazenemoy", rating: 5, text: "Рекомендую всем — работа безупречна, дизайнер понимает с полуслова.", time: "3 нед назад", verified: false },
  { id: "r6", name: "Aero", tg: "AeroDesig", rating: 5, text: "Заказывал логотип для своего проекта — получил шедевр. Спасибо огромное!", time: "1 мес назад", verified: true },
  { id: "r7", name: "Firessk", tg: "firessk", rating: 5, text: "Большое спасибо, порекомендую всем знакомым. Быстро и очень качественно.", time: "1 мес назад", verified: false },
  { id: "r8", name: "Helvite", tg: "Helvite0", rating: 5, text: "Работа на 10/10, всё детально и профессионально. Заказываю уже второй раз!", time: "1 мес назад", verified: true },
  { id: "r9", name: "Usepsyho", tg: "Usepsyho", rating: 5, text: "Быстро и профессионально — всё именно так, как и представлял. 10/10!", time: "2 мес назад", verified: true },
  { id: "r10", name: "Filling", tg: "Filling_tg", rating: 4, text: "Отличная работа, небольшие правки приняты без вопросов. 9/10.", time: "2 мес назад", verified: false },
  { id: "r11", name: "Arthur", tg: "Arthur_dsg", rating: 5, text: "Профессиональный подход, чёткое понимание ТЗ. Очень доволен!", time: "2 мес назад", verified: true },
  { id: "r12", name: "Kupiz", tg: "Kupiz", rating: 5, text: "Всё чётко и качественно. Превью набрало 500к за 2 дня после публикации!", time: "3 мес назад", verified: true },
];

// ── SERVICES ──
const SERVICES = [
  { id: 1, icon: "●", key: "avatar", priceUSD: 5, ru: "Аватарка", en: "Avatar", ua: "Аватарка", kz: "Аватар", by: "Аватарка", descRu: "Уникальный аватар в твоём стиле", descEn: "Unique avatar in your style", timeRu: "1–2 дня", timeEn: "1–2 days", features: ["PNG + PSD", "3 правки", "Исходник"] },
  { id: 2, icon: "▶", key: "preview", priceUSD: 5, ru: "Превью", en: "Preview", ua: "Прев'ю", kz: "Превью", by: "Прэв'ю", descRu: "YouTube / Twitch превью", descEn: "YouTube / Twitch thumbnail", timeRu: "1 день", timeEn: "1 day", features: ["PNG 1280×720", "3 варианта", "PSD файл"] },
  { id: 3, icon: "▬", key: "banner", priceUSD: 5, ru: "Баннер", en: "Banner", ua: "Банер", kz: "Баннер", by: "Банер", descRu: "Шапка канала / профиля", descEn: "Channel / profile header", timeRu: "1–2 дня", timeEn: "1–2 days", features: ["PNG + PSD", "Адаптив", "3 правки"] },
  { id: 4, icon: "✦", key: "logo", priceUSD: 5, ru: "Логотип", en: "Logo", ua: "Логотип", kz: "Логотип", by: "Лагатып", descRu: "Логотип для бренда", descEn: "Logo for your brand", timeRu: "2–3 дня", timeEn: "2–3 days", features: ["SVG + PNG", "Все форматы", "5 правок"] },
  { id: 5, icon: "◉", key: "pack", priceUSD: 18, ru: "Полный пак", en: "Full Pack", ua: "Повний пак", kz: "Толық пак", by: "Поўны пак", descRu: "Аватар + превью + баннер", descEn: "Avatar + preview + banner", timeRu: "2–4 дня", timeEn: "2–4 days", features: ["3 работы", "Приоритет", "Исходники"] },
];

const PROMO_CODES = {
  "AVATARPRO": { kind: "course", courseId: "c3", desc: "Аватарки PRO", title: "Аватарки PRO" },
};

// ==============================================================================
// ??                                -    
// ==============================================================================

//      :                                              !
const DESIGN_PACK_CONFIG = {
  // ID                 Google Drive      
  //        URL: https://drive.google.com/drive/folders/1ABC123xyz...
  //                   ID (            /folders/)
  GOOGLE_DRIVE_FOLDER_ID: "YOUR_FOLDER_ID_HERE",
  
  // Google Drive API      (           : console.cloud.google.com)
  GOOGLE_API_KEY: "YOUR_API_KEY_HERE",
  
  //     Telegram                             (    @)
  TELEGRAM_CHANNEL: "Rivaldsgn",
  
  //     Telegram username           (    @)
  TELEGRAM_CONTACT: "Rivaldsg",
};

//                (                                     Google Drive API)
const MOCK_DESIGN_PACK = {
  fonts: [
    { id: "f1", name: "Montserrat Bold.ttf", size: "245 KB", category: "fonts", preview: "https://picsum.photos/seed/font1/400/200", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "f2", name: "Bebas Neue.ttf", size: "189 KB", category: "fonts", preview: "https://picsum.photos/seed/font2/400/200", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "f3", name: "Roboto Condensed.ttf", size: "312 KB", category: "fonts", preview: "https://picsum.photos/seed/font3/400/200", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "f4", name: "Raleway Light.ttf", size: "267 KB", category: "fonts", preview: "https://picsum.photos/seed/font4/400/200", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  textures: [
    { id: "t1", name: "Grunge Texture Pack.zip", size: "45 MB", category: "textures", preview: "https://picsum.photos/seed/tex1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "t2", name: "Paper Textures.zip", size: "78 MB", category: "textures", preview: "https://picsum.photos/seed/tex2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "t3", name: "Metal Surfaces.zip", size: "92 MB", category: "textures", preview: "https://picsum.photos/seed/tex3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "t4", name: "Fabric Patterns.zip", size: "34 MB", category: "textures", preview: "https://picsum.photos/seed/tex4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  brushes: [
    { id: "b1", name: "Watercolor Brushes.abr", size: "12 MB", category: "brushes", preview: "https://picsum.photos/seed/brush1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "b2", name: "Sketch Brushes.abr", size: "8 MB", category: "brushes", preview: "https://picsum.photos/seed/brush2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "b3", name: "Smoke Brushes.abr", size: "15 MB", category: "brushes", preview: "https://picsum.photos/seed/brush3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "b4", name: "Ink Splatter.abr", size: "6 MB", category: "brushes", preview: "https://picsum.photos/seed/brush4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  templates: [
    { id: "p1", name: "Logo Template Pack.psd", size: "125 MB", category: "templates", preview: "https://picsum.photos/seed/temp1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "p2", name: "Social Media Kit.psd", size: "89 MB", category: "templates", preview: "https://picsum.photos/seed/temp2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "p3", name: "YouTube Thumbnail Bundle.psd", size: "156 MB", category: "templates", preview: "https://picsum.photos/seed/temp3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "p4", name: "Brand Identity Kit.ai", size: "67 MB", category: "templates", preview: "https://picsum.photos/seed/temp4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  mockups: [
    { id: "m1", name: "T-Shirt Mockups.psd", size: "234 MB", category: "mockups", preview: "https://picsum.photos/seed/mock1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "m2", name: "Business Card Mockup.psd", size: "145 MB", category: "mockups", preview: "https://picsum.photos/seed/mock2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "m3", name: "Laptop Screen Mockup.psd", size: "189 MB", category: "mockups", preview: "https://picsum.photos/seed/mock3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "m4", name: "Phone Mockup Pack.psd", size: "267 MB", category: "mockups", preview: "https://picsum.photos/seed/mock4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  graphics: [
    { id: "g1", name: "Abstract Shapes.eps", size: "23 MB", category: "graphics", preview: "https://picsum.photos/seed/graph1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "g2", name: "Icon Set 500+.ai", size: "45 MB", category: "graphics", preview: "https://picsum.photos/seed/graph2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "g3", name: "Geometric Patterns.svg", size: "12 MB", category: "graphics", preview: "https://picsum.photos/seed/graph3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "g4", name: "Vector Illustrations.ai", size: "67 MB", category: "graphics", preview: "https://picsum.photos/seed/graph4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
};

const AI_IDEA_PROMPTS_RU = [
  "🎨 Аватар: киберпанк + неоновые линии, палитра #0ff/#f0f/#ff0 — эффект голограммы в стиле blade runner",
  "🌊 Превью: океанские волны + крупный белый текст, градиент синий→фиолетовый, кинематографическое освещение",
  "🔥 Баннер: магма и лава, тёплые тона оранжевый→красный, название канала шрифтом с огненным эффектом",
  "✨ Логотип: буква из стекла с преломлением света и каустикой, chromatic aberration по краям",
  "🌈 Аватар: космический скафандр, внутри стекла отражение галактики, volumetric light",
  "🍃 Превью: ботанические иллюстрации ink-drop стиль, sage green + cream, editorial layout",
  "⚡ Баннер: молнии в slow-motion, тёмно-серый фон, неоновый жёлтый электрик",
  "🎭 Аватар: половина лица — реалистичный портрет, половина — пикселизация, duality concept",
  "🔮 Логотип: кристалл аметиста с внутренним свечением, amethyst purple с gold акцентом",
  "🏆 Превью: золотой кубок Champions League lighting, dramatic dark bg, particle dust",
  "🌸 Аватар: японская акварель, сакуры в bloom, mix pastel ink + золотые linework",
  "🤖 Баннер: нейронная сеть из светящихся узлов, dark bg, пульсирующие connections",
  "🎸 Логотип: расплавленная гитара, heavy metal aesthetic, splatter эффект",
  "🦋 Аватар: бабочка из геометрических форм low-poly, iridescent крылья",
  "🌈 Превью: ink-drop взрыв красок на матовом чёрном, dynamic motion blur",
  "🏔️ Баннер: горы в anime landscape стиле, sunset gradient, silhouette drama",
  "🎯 Логотип: оптический прицел + буква, tactical/military aesthetic, dark green",
  "🌐 Аватар: глобус из wireframe, cyberpunk city внутри, matrix code overlay",
];

const AI_IDEA_PROMPTS_EN = [
  "🎨 Avatar: cyberpunk + neon lines, palette #0ff/#f0f/#ff0 — hologram effect blade runner style",
  "🌊 Preview: ocean waves + large white text, blue→purple gradient, cinematic lighting",
  "🔥 Banner: magma & lava, warm orange→red tones, channel name in flame-effect font",
  "✨ Logo: glass letter with light refraction & caustics, chromatic aberration on edges",
  "🌈 Avatar: space suit, galaxy reflection inside visor glass, volumetric light rays",
  "🍃 Preview: botanical ink-drop illustration, sage green + cream, editorial layout",
  "⚡ Banner: slow-motion lightning, dark gray bg, electric neon yellow accent",
  "🎭 Avatar: half face realistic portrait, half pixelated — duality concept",
  "🔮 Logo: amethyst crystal with inner glow, amethyst purple with gold accent",
  "🏆 Preview: golden trophy, Champions League dramatic lighting, particle dust",
  "🌸 Avatar: Japanese watercolor sakura in bloom, pastel ink + gold linework",
  "🤖 Banner: neural network glowing nodes, dark bg, pulsing connections",
  "🎸 Logo: melted guitar, heavy metal aesthetic, splatter effect",
  "🦋 Avatar: butterfly from low-poly geometric shapes, iridescent wings",
  "🌈 Preview: ink-drop color explosion on matte black, dynamic motion blur",
];

// ── QUIZ QUESTIONS POOL (50 questions) ──
const QUIZ_QUESTIONS_POOL = [
  { q: "Какой формат лучше всего для логотипа?", opts: ["JPEG", "PNG", "SVG", "BMP"], correct: 2, exp: "SVG — векторный формат, масштабируется без потери качества" },
  { q: "Комплементарные цвета расположены...", opts: ["Рядом на круге", "Напротив на круге", "Через один", "На углах квадрата"], correct: 1, exp: "Напротив — максимальный контраст, сильнейшая гармония" },
  { q: "Разрешение Full HD?", opts: ["1280×720", "1920×1080", "2560×1440", "3840×2160"], correct: 1, exp: "1920×1080 — стандарт для большинства экранов" },
  { q: "Что означает аббревиатура RGB?", opts: ["Red Green Blue", "Red Gray Black", "Real Graphic Bit", "Random Grid Base"], correct: 0, exp: "Red Green Blue — аддитивная цветовая модель для экранов" },
  { q: "DPI для веб-графики?", opts: ["72", "150", "300", "600"], correct: 0, exp: "72 DPI — стандарт для экранного отображения" },
  { q: "Кернинг — это...", opts: ["Размер шрифта", "Расстояние между буквами", "Толщина линии", "Тип кривой"], correct: 1, exp: "Кернинг управляет расстоянием между конкретными парами букв" },
  { q: "Какой цвет ассоциируется с доверием?", opts: ["Красный", "Жёлтый", "Синий", "Зелёный"], correct: 2, exp: "Синий — цвет надёжности, доверия и профессионализма" },
  { q: "Золотое сечение ≈", opts: ["1.414", "1.618", "1.732", "2.000"], correct: 1, exp: "φ = 1.618... — основа гармоничных пропорций в дизайне" },
  { q: "Что такое CMYK?", opts: ["Модель для печати", "Модель для веба", "Тип шрифта", "Формат файла"], correct: 0, exp: "CMYK — субтрактивная модель для печати (Cyan, Magenta, Yellow, Key)" },
  { q: "Оптимальная ширина баннера для YouTube?", opts: ["1920×1080", "2560×1440", "1280×720", "3840×2160"], correct: 1, exp: "2560×1440 — рекомендуемое разрешение для YouTube баннера" },
  { q: "Что означает PSD?", opts: ["Photoshop Document", "Pixel Style Design", "Print Source Data", "Professional Design"], correct: 0, exp: "PSD — формат файлов Adobe Photoshop с поддержкой слоёв" },
  { q: "Какой шрифт лучше для логотипа?", opts: ["Serif", "Sans-serif", "Script", "Зависит от бренда"], correct: 3, exp: "Выбор шрифта зависит от характера и ценностей бренда" },
  { q: "Разрешение 4K это...", opts: ["1920×1080", "2560×1440", "3840×2160", "7680×4320"], correct: 2, exp: "4K UHD = 3840×2160 пикселей" },
  { q: "Что такое трекинг?", opts: ["Расстояние между всеми буквами", "Расстояние между словами", "Высота строки", "Размер шрифта"], correct: 0, exp: "Трекинг — равномерное расстояние между всеми символами" },
  { q: "Формат с прозрачностью?", opts: ["JPEG", "BMP", "PNG", "GIF"], correct: 2, exp: "PNG поддерживает альфа-канал (прозрачность)" },
  { q: "Что такое mockup?", opts: ["Эскиз", "Реалистичная презентация дизайна", "Цветовая палитра", "Тип шрифта"], correct: 1, exp: "Mockup — реалистичная визуализация дизайна в контексте" },
  { q: "Какая цветовая схема использует 3 цвета на равном расстоянии?", opts: ["Комплементарная", "Аналогичная", "Триадная", "Монохромная"], correct: 2, exp: "Триадная схема — 3 цвета на равном расстоянии на цветовом круге" },
  { q: "Что такое векторная графика?", opts: ["Из пикселей", "Из математических формул", "Из фотографий", "Из текстур"], correct: 1, exp: "Векторная графика основана на математических кривых, масштабируется без потерь" },
  { q: "Оптимальный размер аватарки для Discord?", opts: ["128×128", "256×256", "512×512", "1024×1024"], correct: 2, exp: "512×512 — рекомендуемый размер для Discord аватара" },
  { q: "Что такое безопасная зона в дизайне?", opts: ["Зона без важных элементов", "Зона для текста", "Зона для логотипа", "Зона обрезки"], correct: 0, exp: "Безопасная зона — область, где не размещают важные элементы из-за возможной обрезки" },
  { q: "Какой формат поддерживает анимацию?", opts: ["PNG", "JPEG", "GIF", "SVG"], correct: 2, exp: "GIF поддерживает покадровую анимацию" },
  { q: "Что такое градиент?", opts: ["Плавный переход цветов", "Резкая граница", "Текстура", "Фильтр"], correct: 0, exp: "Градиент — плавный переход между двумя или более цветами" },
  { q: "Разрешение для печати рекламы?", opts: ["72 DPI", "150 DPI", "300 DPI", "600 DPI"], correct: 2, exp: "300 DPI — стандарт для качественной печати" },
  { q: "Что такое композиция в дизайне?", opts: ["Цветовая схема", "Расположение элементов", "Тип шрифта", "Формат файла"], correct: 1, exp: "Композиция — организация и расположение визуальных элементов" },
  { q: "Какой цвет в психологии означает энергию?", opts: ["Синий", "Красный", "Зелёный", "Серый"], correct: 1, exp: "Красный ассоциируется с энергией, страстью и действием" },
  { q: "Что такое контраст?", opts: ["Яркость", "Разница между элементами", "Насыщенность", "Прозрачность"], correct: 1, exp: "Контраст — визуальная разница между элементами (цвет, размер, форма)" },
  { q: "Формат для веб-иконок?", opts: ["PSD", "AI", "ICO", "TIFF"], correct: 2, exp: "ICO — специальный формат для favicon и веб-иконок" },
  { q: "Что такое типографика?", opts: ["Искусство работы со шрифтами", "Цветовая палитра", "Работа с фото", "Анимация текста"], correct: 0, exp: "Типографика — искусство оформления текста и работы со шрифтами" },
  { q: "Какое соотношение сторон у YouTube превью?", opts: ["16:9", "4:3", "1:1", "21:9"], correct: 0, exp: "16:9 — стандартное соотношение для YouTube thumbnail (1280×720)" },
  { q: "Что такое белое пространство (whitespace)?", opts: ["Цвет фона", "Пустая область между элементами", "Ошибка", "Тип шрифта"], correct: 1, exp: "Whitespace — пустое пространство, улучшающее читаемость и восприятие" },
  { q: "Какой инструмент для векторной графики?", opts: ["Photoshop", "Illustrator", "After Effects", "Premiere"], correct: 1, exp: "Adobe Illustrator — профессиональный инструмент для векторной графики" },
  { q: "Что такое палитра?", opts: ["Набор цветов", "Кисть", "Слой", "Фильтр"], correct: 0, exp: "Палитра — подобранный набор цветов для проекта" },
  { q: "Размер превью для Twitch?", opts: ["1280×720", "1920×1080", "1200×600", "800×450"], correct: 1, exp: "1920×1080 — оптимальный размер для Twitch превью" },
  { q: "Что такое опасити (opacity)?", opts: ["Прозрачность", "Яркость", "Контраст", "Насыщенность"], correct: 0, exp: "Opacity — уровень прозрачности элемента (0-100%)" },
  { q: "Какой цвет означает роскошь?", opts: ["Красный", "Золотой", "Синий", "Зелёный"], correct: 1, exp: "Золотой ассоциируется с роскошью, богатством и премиальностью" },
  { q: "Что такое hierarchy (иерархия)?", opts: ["Порядок важности элементов", "Список файлов", "Цветовая схема", "Тип шрифта"], correct: 0, exp: "Иерархия — визуальная организация элементов по важности" },
  { q: "Формат для анимированных стикеров Telegram?", opts: ["GIF", "MP4", "TGS (Lottie)", "PNG"], correct: 2, exp: "TGS (Lottie JSON) — формат для анимированных стикеров Telegram" },
  { q: "Что такое баланс в композиции?", opts: ["Равновесие элементов", "Цвет", "Размер", "Шрифт"], correct: 0, exp: "Баланс — равномерное распределение визуального веса" },
  { q: "Какой цвет успокаивает?", opts: ["Красный", "Жёлтый", "Синий", "Оранжевый"], correct: 2, exp: "Синий имеет успокаивающий эффект" },
  { q: "Что такое ресэмплинг?", opts: ["Изменение размера изображения", "Смена цвета", "Поворот", "Обрезка"], correct: 0, exp: "Resampling — изменение разрешения с пересчётом пикселей" },
  { q: "Минимальный размер для печати визитки?", opts: ["50×90 мм", "85×55 мм", "100×70 мм", "A4"], correct: 1, exp: "85×55 мм — стандартный размер визитной карточки" },
  { q: "Что такое flat design?", opts: ["3D дизайн", "Минималистичный 2D стиль", "Реалистичный дизайн", "Анимация"], correct: 1, exp: "Flat design — минималистичный стиль без объёма и теней" },
  { q: "Какая программа для motion design?", opts: ["Photoshop", "Illustrator", "After Effects", "InDesign"], correct: 2, exp: "Adobe After Effects — стандарт индустрии для motion дизайна" },
  { q: "Что такое mood board?", opts: ["Доска вдохновения", "Список задач", "Палитра цветов", "Тип шрифта"], correct: 0, exp: "Mood board — коллаж изображений для передачи стиля и настроения проекта" },
  { q: "Размер обложки для Facebook?", opts: ["820×312", "851×315", "1200×628", "1640×924"], correct: 1, exp: "851×315 — рекомендуемый размер обложки Facebook" },
  { q: "Что такое UI/UX?", opts: ["Интерфейс и опыт пользователя", "Только дизайн", "Только код", "Анимация"], correct: 0, exp: "UI — визуальный интерфейс, UX — пользовательский опыт взаимодействия" },
  { q: "Какой формат лучше для фото в вебе?", opts: ["BMP", "TIFF", "JPEG/WebP", "PSD"], correct: 2, exp: "JPEG и WebP — оптимальные форматы для фото в интернете (малый вес)" },
  { q: "Что такое responsive design?", opts: ["Адаптивный дизайн", "Быстрый дизайн", "Дорогой дизайн", "Простой дизайн"], correct: 0, exp: "Responsive — дизайн, адаптирующийся под разные размеры экранов" },
  { q: "Что такое kerning pair?", opts: ["Пара букв с индивидуальным кернингом", "Два шрифта", "Два цвета", "Два слоя"], correct: 0, exp: "Kerning pair — пара символов с особым расстоянием (например, AV)" },
  { q: "Оптимальная длина строки текста?", opts: ["30-40 символов", "50-75 символов", "100+ символов", "Неважно"], correct: 1, exp: "50-75 символов на строку — оптимум для комфортного чтения" },
];

// ── QUIZ DAILY SYSTEM ──
function getQuizForToday() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  
  // Seeded shuffle algorithm
  const shuffled = [...QUIZ_QUESTIONS_POOL];
  let currentIndex = shuffled.length;
  const random = (max) => {
    const x = Math.sin(seed + currentIndex) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };
  
  while (currentIndex > 0) {
    const randomIndex = random(currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  // Return first 8 questions
  return shuffled.slice(0, 8).map(q => ({
    ...q,
    opts: [...q.opts].sort(() => 0.5 - Math.random()) // Shuffle answers
  }));
}

const QUIZ_DATA = getQuizForToday();

const FAQ_DATA = {
  ru: [
    { q: 'Как работает процесс заказа?', a: '1. Написать в Telegram\n2. Обсудить детали\n3. ТЗ и сроки\n4. Предоплата 50%\n5. 1-3 дня работы\n6. До 3 правок бесплатно\n7. Итоговый расчёт' },
    { q: 'Что я получу в итоге?', a: 'PSD/AI/AEP исходники, PNG/JPG/SVG, 3 бесплатных правки, поддержка' },
    { q: 'Способы оплаты?', a: 'Telegram Stars внутри mini app, банковская карта, CryptoBot (USDT/TON/BTC), схема 50%+50%' },
    { q: 'Срочный заказ?', a: 'От 3 часов с надбавкой +20-50%' },
    { q: 'Форматы файлов?', a: 'PNG, JPG, SVG, PSD, AI, GIF, MP4 — любой по запросу' },
    { q: 'Конфиденциальность?', a: 'Не публикую без разрешения. NDA по запросу' },
    { q: 'Иностранные клиенты?', a: 'Да, оплата в USDT/USD, русский и английский язык' },
    { q: 'Сколько правок?', a: '3 бесплатных, дополнительные по договорённости' },
  ],
  en: [
    { q: 'How does the order process work?', a: '1. Message on Telegram\n2. Discuss brief & timeline\n3. 50% upfront\n4. 1-3 days production\n5. 3 free revisions\n6. Final payment' },
    { q: 'What will I receive?', a: 'PSD/AI/AEP source files, PNG/JPG/SVG exports, 3 free revisions, support' },
    { q: 'Payment methods?', a: 'Telegram Stars inside the mini app, any bank card, CryptoBot (USDT/TON/BTC), 50%+50% scheme' },
    { q: 'Urgent orders?', a: 'Rush from 3 hours with +20-50% surcharge' },
    { q: 'File formats?', a: 'PNG, JPG, SVG, PSD, AI, GIF, MP4 — any on request' },
    { q: 'Confidentiality?', a: 'No publishing without permission. NDA available' },
    { q: 'International clients?', a: 'Yes, USDT/USD payment, English & Russian' },
    { q: 'How many revisions?', a: '3 free, extra by agreement' },
  ],
};
FAQ_DATA.ua = FAQ_DATA.ru; FAQ_DATA.kz = FAQ_DATA.ru; FAQ_DATA.by = FAQ_DATA.ru;

// ── ACHIEVEMENTS ──
const ACHIEVEMENTS = [
  { id: "first_visit", icon: "👋", title: "Первый визит", desc: "Добро пожаловать!", xp: 10, secret: false },
  { id: "explorer", icon: "🗺️", title: "Исследователь", desc: "Посетил все разделы", xp: 25, secret: false },
  { id: "quiz_master", icon: "🧠", title: "Знаток дизайна", desc: "Ответил правильно 5+ раз", xp: 50, secret: false },
  { id: "streak_3", icon: "🔥", title: "Стрик 3 дня", desc: "3 дня подряд", xp: 30, secret: false },
  { id: "streak_7", icon: "⚡", title: "Неделя", desc: "7 дней подряд", xp: 70, secret: true },
  { id: "streak_14", icon: "💪", title: "Две недели", desc: "14 дней подряд", xp: 120, secret: true },
  { id: "streak_30", icon: "👑", title: "Легенда", desc: "30 дней подряд", xp: 250, secret: true },
  { id: "wishlist_5", icon: "💜", title: "Коллекционер", desc: "5+ работ в вишлисте", xp: 20, secret: false },
  { id: "wishlist_10", icon: "💎", title: "Эстет", desc: "10+ работ в вишлисте", xp: 40, secret: false },
  { id: "wishlist_20", icon: "🎨", title: "Ценитель", desc: "20+ работ в вишлисте", xp: 80, secret: true },
  { id: "level_5", icon: "🏆", title: "Уровень 5", desc: "Достиг 5 уровня", xp: 100, secret: false },
  { id: "level_10", icon: "🌟", title: "Уровень 10", desc: "Достиг 10 уровня", xp: 200, secret: false },
  { id: "level_15", icon: "💫", title: "Уровень 15", desc: "Достиг 15 уровня", xp: 350, secret: true },
  { id: "ai_gen_5", icon: "🤖", title: "AI Адепт", desc: "5 идей от AI", xp: 30, secret: false },
  { id: "ai_gen_10", icon: "🧬", title: "AI Мастер", desc: "10 идей от AI", xp: 60, secret: false },
  { id: "ai_gen_25", icon: "🚀", title: "AI Гуру", desc: "25 идей от AI", xp: 150, secret: true },
  { id: "course_complete", icon: "🎓", title: "Студент", desc: "Прошёл курс на 100%", xp: 80, secret: false },
  { id: "course_complete_3", icon: "📚", title: "Отличник", desc: "Завершил 3 курса", xp: 150, secret: false },
  { id: "course_complete_all", icon: "🎖️", title: "Магистр", desc: "Прошёл все курсы", xp: 300, secret: true },
  { id: "cart_order", icon: "🛒", title: "Первый заказ", desc: "Добавил товар в корзину", xp: 15, secret: false },
  { id: "cart_full", icon: "🛍️", title: "Шопоголик", desc: "5+ товаров в корзине", xp: 25, secret: false },
  { id: "promo_hunter", icon: "🎫", title: "Охотник за скидками", desc: "Применил промокод", xp: 20, secret: false },
  { id: "night_owl", icon: "🦉", title: "Ночная сова", desc: "Зашёл после 23:00", xp: 15, secret: true },
  { id: "early_bird", icon: "🌅", title: "Жаворонок", desc: "Зашёл до 6:00", xp: 15, secret: true },
  { id: "speed_quiz", icon: "⚡", title: "Спидраннер", desc: "Викторина за <2 мин", xp: 40, secret: true },
  { id: "quiz_perfect", icon: "💯", title: "Перфекционист", desc: "Все ответы верны", xp: 60, secret: false },
  { id: "theme_switcher", icon: "🎨", title: "Хамелеон", desc: "Сменил тему 5 раз", xp: 20, secret: false },
  { id: "lang_polyglot", icon: "🌐", title: "Полиглот", desc: "Переключил язык 3 раза", xp: 25, secret: true },
  { id: "gallery_explorer", icon: "🖼️", title: "Арт-критик", desc: "Просмотрел 20+ работ", xp: 30, secret: false },
  { id: "faq_reader", icon: "📖", title: "Любознательный", desc: "Прочитал все FAQ", xp: 15, secret: false },
  { id: "social_butterfly", icon: "🦋", title: "Социальный", desc: "Открыл все соцсети", xp: 10, secret: false },
  { id: "scroll_master", icon: "📜", title: "Скроллер", desc: "Проскроллил 10000px", xp: 20, secret: true },
  { id: "click_master", icon: "👆", title: "Кликер", desc: "100+ кликов", xp: 25, secret: true },
  { id: "loyal_user", icon: "💝", title: "Верный клиент", desc: "5+ визитов", xp: 50, secret: false },
{ id: "mega_fan", icon: "⭐", title: "Мега-фан", desc: "10+ визитов", xp: 100, secret: false },
  { id: "legend", icon: "🔱", title: "Легенда Rival", desc: "Собрал 1000+ XP", xp: 500, secret: true },
];

// ── TRANSLATIONS ──
const T = {
  ru: {
    appName: "Rival Space", homeHero: "\u0421\u043e\u0437\u0434\u0430\u044e \u0432\u0438\u0437\u0443\u0430\u043b\u044b \u043c\u0438\u0440\u043e\u0432\u043e\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f",
    homeSub: "\u0410\u0432\u0430\u0442\u0430\u0440\u043a\u0438 \u00b7 \u041f\u0440\u0435\u0432\u044c\u044e \u00b7 \u0411\u0430\u043d\u043d\u0435\u0440\u044b \u00b7 \u041b\u043e\u0433\u043e\u0442\u0438\u043f\u044b",
    stats: [{ v: "50+", l: "\u041f\u0440\u043e\u0435\u043a\u0442\u043e\u0432" }, { v: "19+", l: "\u041a\u043b\u0438\u0435\u043d\u0442\u043e\u0432" }, { v: "1+", l: "\u0413\u043e\u0434 \u043e\u043f\u044b\u0442\u0430" }, { v: "5.0", l: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433" }],
    navHome: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f", navGallery: "\u0413\u0430\u043b\u0435\u0440\u0435\u044f", navAI: "AI", navOrders: "\u0417\u0430\u043a\u0430\u0437\u044b", navCourses: "\u041a\u0443\u0440\u0441\u044b", navPricing: "\u041f\u0440\u0430\u0439\u0441", navFreePack: "\u041f\u0430\u043a", navMore: "\u0415\u0449\u0451", navProfile: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c",
    galleryTitle: "\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e", gallerySearch: "\u041f\u043e\u0438\u0441\u043a...",
    reviewsTitle: "\u041e\u0442\u0437\u044b\u0432\u044b", pricingTitle: "\u041f\u0440\u0430\u0439\u0441-\u043b\u0438\u0441\u0442",
    cartTitle: "\u041a\u043e\u0440\u0437\u0438\u043d\u0430", addCart: "\u0412 \u043a\u043e\u0440\u0437\u0438\u043d\u0443", clearCart: "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c",
    orderBtn: "\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c", discount: "\u0421\u043a\u0438\u0434\u043a\u0430 10%", finalPrice: "\u0418\u0442\u043e\u0433\u043e",
    aboutTitle: "\u041e\u0431\u043e \u043c\u043d\u0435",
    aboutText: "\u042f Rival \u2014 \u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0434\u0438\u0437\u0430\u0439\u043d\u0435\u0440 \u0441 \u043e\u043f\u044b\u0442\u043e\u043c \u0431\u043e\u043b\u0435\u0435 \u0433\u043e\u0434\u0430.\n\n\u0421\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0438\u0440\u0443\u044e\u0441\u044c \u043d\u0430 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u0438 \u0432\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u043e\u0439 \u0438\u0434\u0435\u043d\u0442\u0438\u0447\u043d\u043e\u0441\u0442\u0438 \u0434\u043b\u044f \u043a\u043e\u043d\u0442\u0435\u043d\u0442-\u043c\u0435\u0439\u043a\u0435\u0440\u043e\u0432, \u0441\u0442\u0440\u0438\u043c\u0435\u0440\u043e\u0432 \u0438 \u0431\u0440\u0435\u043d\u0434\u043e\u0432.\n\n\u041a\u0430\u0436\u0434\u0430\u044f \u0440\u0430\u0431\u043e\u0442\u0430 \u2014 \u044d\u0442\u043e \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442, \u0441\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0439 \u043f\u043e\u0434 \u0442\u0432\u043e\u0438 \u0446\u0435\u043b\u0438 \u0438 \u0430\u0443\u0434\u0438\u0442\u043e\u0440\u0438\u044e.",
    faqTitle: "FAQ", aiTitle: "AI Studio", aiSub: "\u0413\u0435\u043d\u0435\u0440\u0430\u0442\u043e\u0440 \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0445 \u0438\u0434\u0435\u0439 \u0434\u043b\u044f \u0434\u0438\u0437\u0430\u0439\u043d\u0430",
    aiBtn: "\u2728 \u0413\u0435\u043d\u0435\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0438\u0434\u0435\u044e", aiLoading: "AI \u0434\u0443\u043c\u0430\u0435\u0442...", aiEmpty: "\u041d\u0430\u0436\u043c\u0438 \u043a\u043d\u043e\u043f\u043a\u0443 \u0434\u043b\u044f \u043f\u0435\u0440\u0432\u043e\u0439 \u0438\u0434\u0435\u0438",
    aiHist: "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0438\u0434\u0435\u0439", settingsTitle: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", settingsTheme: "\u0422\u0435\u043c\u0430",
    settingsLang: "\u042f\u0437\u044b\u043a", settingsSound: "\u0417\u0432\u0443\u043a", settingsVol: "\u0413\u0440\u043e\u043c\u043a\u043e\u0441\u0442\u044c",
    pricingHint: "\u0426\u0435\u043d\u044b \u0432 {cur} \u00b7 1$ = {rate} {cur}", discountNote: "\uD83C\uDF81 \u0421\u043a\u0438\u0434\u043a\u0430 10% \u043f\u0440\u0438 \u0437\u0430\u043a\u0430\u0437\u0435 2+ \u043f\u043e\u0437\u0438\u0446\u0438\u0439",
    orderAll: "\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c \u0432\u0441\u0451", quantityLabel: "\u0448\u0442", toTelegram: "\u041d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 Telegram",
    copied: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u043e!", filterAll: "\u0412\u0441\u0435", popular: "\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u043e\u0435",
    zoomHint: "\u041d\u0430\u0436\u043c\u0438 \u0434\u043b\u044f \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0430", reviewSearch: "\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u043e\u0442\u0437\u044b\u0432\u0430\u043c...", allRatings: "\u0412\u0441\u0435",
    coursesTitle: "\u041a\u0443\u0440\u0441\u044b \u0438 \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435", courseSub: "\u041f\u0440\u043e\u043a\u0430\u0447\u0430\u0439 \u043d\u0430\u0432\u044b\u043a\u0438 \u0434\u0438\u0437\u0430\u0439\u043d\u0430",
    courseStart: "\u041d\u0430\u0447\u0430\u0442\u044c \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435", courseFree: "\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e", courseLessons: "\u0443\u0440\u043e\u043a\u043e\u0432",
    courseProgress: "\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441", courseTopics: "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430 \u043a\u0443\u0440\u0441\u0430",
    quizTitle: "\u0414\u0438\u0437\u0430\u0439\u043d-\u0432\u0438\u043a\u0442\u043e\u0440\u0438\u043d\u0430", quizScore: "\u0421\u0447\u0451\u0442", quizCorrect: "\u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e! \u2713",
    quizWrong: "\u041d\u0435\u0432\u0435\u0440\u043d\u043e \u2717", quizResult: "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442",
    streakTitle: "\u0414\u043d\u0435\u0439 \u043f\u043e\u0434\u0440\u044f\u0434", xpTitle: "\u041e\u043f\u044b\u0442", levelTitle: "\u0423\u0440\u043e\u0432\u0435\u043d\u044c",
    promoPlaceholder: "\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434...", promoApply: "\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c",
    promoSuccess: "\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434 \u043f\u0440\u0438\u043c\u0435\u043d\u0451\u043d!", promoError: "\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043f\u0440\u043e\u043c\u043e\u043a\u043e\u0434",
    calcTitle: "\u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440", calcComplex: "\u0421\u043b\u043e\u0436\u043d\u043e\u0441\u0442\u044c", calcUrgent: "\u0421\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u044c", calcTotal: "\u0418\u0442\u043e\u0433\u043e",
    sortPop: "\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435", sortNew: "\u041d\u043e\u0432\u044b\u0435", sortAlpha: "\u0410\u2013\u042f",
    achievements: "\u0414\u043e\u0441\u0442\u0438\u0436\u0435\u043d\u0438\u044f", achieveNew: "\u041d\u043e\u0432\u043e\u0435 \u0434\u043e\u0441\u0442\u0438\u0436\u0435\u043d\u0438\u0435!",
    viewsLabel: "\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u043e\u0432", studentsLabel: "\u0441\u0442\u0443\u0434\u0435\u043d\u0442\u043e\u0432",
    onlineStatus: "\u041e\u041d\u041b\u0410\u0419\u041d \u00b7 \u0413\u041e\u0422\u041e\u0412 \u041a \u0417\u0410\u041a\u0410\u0417\u0410\u041c",
    orderConfirm: "\u0417\u0430\u043a\u0430\u0437 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d!", addedToWishlist: "\u0414\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u043e \u0432 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
    removedFromWishlist: "\u0423\u0434\u0430\u043b\u0435\u043d\u043e \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e",
    deliveryTime: "\u0421\u0440\u043e\u043a: ", includes: "\u0412\u043a\u043b\u044e\u0447\u0435\u043d\u043e:",
    packageDeal: "\u0412\u044b\u0433\u043e\u0434\u043d\u044b\u0439 \u043f\u0430\u043a\u0435\u0442", savePercent: "\u044d\u043a\u043e\u043d\u043e\u043c\u0438\u044f",
  },
  en: {
    appName: "Rival Space", homeHero: "Creating world-class visuals",
    homeSub: "Avatars · Previews · Banners · Logos",
    stats: [{ v: "50+", l: "Projects" }, { v: "19+", l: "Clients" }, { v: "1+", l: "Yr exp." }, { v: "5.0", l: "Rating" }],
    navHome: "Home", navGallery: "Gallery", navAI: "AI", navOrders: "Orders", navCourses: "Courses", navPricing: "Pricing", navFreePack: "Pack", navMore: "More", navProfile: "Profile",
    galleryTitle: "Portfolio", gallerySearch: "Search...",
    reviewsTitle: "Reviews", pricingTitle: "Pricing",
    cartTitle: "Cart", addCart: "Add", clearCart: "Clear",
    orderBtn: "Order", discount: "10% off", finalPrice: "Total",
    aboutTitle: "About Me",
    aboutText: "I'm Rival — a graphic designer with over a year of experience.\n\nI specialize in creating visual identity for content creators, streamers, and brands.\n\nEvery project is unique and crafted for your goals and audience.",
    faqTitle: "FAQ", aiTitle: "AI Studio", aiSub: "Unique design idea generator",
    aiBtn: "✨ Generate Idea", aiLoading: "AI thinking...", aiEmpty: "Press the button for your first idea",
    aiHist: "Idea History", settingsTitle: "Settings", settingsTheme: "Theme",
    settingsLang: "Language", settingsSound: "Sound", settingsVol: "Volume",
    pricingHint: "Prices in {cur} · $1 = {rate} {cur}", discountNote: "🎁 10% off for 2+ items",
    orderAll: "Order all", quantityLabel: "qty", toTelegram: "Write on Telegram",
    copied: "Copied!", filterAll: "All", popular: "Popular",
    zoomHint: "Tap to view", reviewSearch: "Search reviews...", allRatings: "All",
    coursesTitle: "Courses & Learning", courseSub: "Level up your design skills",
    courseStart: "Start Learning", courseFree: "Free", courseLessons: "lessons",
    courseProgress: "Progress", courseTopics: "Course Program",
    quizTitle: "Design Quiz", quizScore: "Score", quizCorrect: "Correct! \u2713",
    quizWrong: "Wrong \u2717", quizResult: "Result",
    streakTitle: "Day Streak", xpTitle: "Experience", levelTitle: "Level",
    promoPlaceholder: "Promo code...", promoApply: "Apply",
    promoSuccess: "Promo applied!", promoError: "Invalid code",
    calcTitle: "Calculator", calcComplex: "Complexity", calcUrgent: "Urgency", calcTotal: "Total",
    sortPop: "Popular", sortNew: "Newest", sortAlpha: "A\u2013Z",
    achievements: "Achievements", achieveNew: "New Achievement!",
    viewsLabel: "views", studentsLabel: "students",
    onlineStatus: "ONLINE \u00b7 READY FOR ORDERS",
    orderConfirm: "Order sent!", addedToWishlist: "Added to wishlist",
    removedFromWishlist: "Removed from wishlist",
    deliveryTime: "Time: ", includes: "Includes:",
    packageDeal: "Best deal", savePercent: "savings",
  },
};
T.ua = { ...T.ru, appName: "Rival Space", homeHero: "\u0421\u0442\u0432\u043e\u0440\u044e\u044e \u0432\u0456\u0437\u0443\u0430\u043b\u0438 \u0441\u0432\u0456\u0442\u043e\u0432\u043e\u0433\u043e \u0440\u0456\u0432\u043d\u044f", navHome: "\u0413\u043e\u043b\u043e\u0432\u043d\u0430", navGallery: "\u0413\u0430\u043b\u0435\u0440\u0435\u044f", navAI: "AI", navCourses: "\u041a\u0443\u0440\u0441\u0438", navOrders: "\u0417\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f", navPricing: "\u041f\u0440\u0430\u0439\u0441", navMore: "\u0429\u0435", navProfile: "\u041f\u0440\u043e\u0444\u0456\u043b\u044c", galleryTitle: "\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0456\u043e", addCart: "\u0423 \u043a\u043e\u0448\u0438\u043a", orderBtn: "\u0417\u0430\u043c\u043e\u0432\u0438\u0442\u0438", coursesTitle: "\u041a\u0443\u0440\u0441\u0438", toTelegram: "Telegram" };
T.kz = { ...T.ru, appName: "Rival Space", homeHero: "\u04d2\u043b\u0435\u043c\u0434\u0456\u043a \u0434\u0435\u04a3\u0433\u0435\u0439\u0434\u0435\u0433\u0456 \u0432\u0438\u0437\u0443\u0430\u043b\u0434\u0430\u0440", navHome: "\u0411\u0430\u0441\u0442\u044b", navGallery: "\u0413\u0430\u043b\u0435\u0440\u0435\u044f", navAI: "AI", navCourses: "\u041a\u0443\u0440\u0441\u0442\u0430\u0440", navOrders: "\u0422\u0430\u043f\u0441\u044b\u0440\u044b\u0441\u0442\u0430\u0440", navPricing: "\u041f\u0440\u0430\u0439\u0441", navMore: "\u041a\u04e9\u0431\u0456\u0440\u0435\u043a", navProfile: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c", galleryTitle: "\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e", addCart: "\u0421\u0435\u0431\u0435\u0442\u043a\u0435", orderBtn: "\u0422\u0430\u043f\u0441\u044b\u0440\u0443", coursesTitle: "\u041a\u0443\u0440\u0441\u0442\u0430\u0440", toTelegram: "Telegram" };
T.by = { ...T.ru, appName: "Rival Space", homeHero: "\u0421\u0442\u0432\u0430\u0440\u0430\u044e \u0432\u0456\u0437\u0443\u0430\u043b\u044b \u0441\u0443\u0441\u0432\u0435\u0442\u043d\u0430\u0433\u0430 \u045e\u0437\u0440\u043e\u045e\u043d\u044e", navHome: "\u0413\u0430\u043b\u043e\u045e\u043d\u0430\u044f", navGallery: "\u0413\u0430\u043b\u0435\u0440\u044d\u044f", navAI: "AI", navCourses: "\u041a\u0443\u0440\u0441\u044b", navOrders: "\u0417\u0430\u043c\u043e\u045e\u044b", navPricing: "\u041f\u0440\u0430\u0439\u0441", navMore: "\u042f\u0448\u0447\u044d", navProfile: "\u041f\u0440\u043e\u0444\u0456\u043b\u044c", galleryTitle: "\u041f\u0430\u0440\u0442\u0444\u043e\u043b\u0456\u0430", addCart: "\u0423 \u043a\u043e\u0448\u044b\u043a", orderBtn: "\u0417\u0430\u043c\u043e\u0432\u0456\u0446\u044c", coursesTitle: "\u041a\u0443\u0440\u0441\u044b", toTelegram: "Telegram" };



/*
  { q: "Какой цвет ассоциируется с доверием?", opts: ["Красный", "Жёлтый", "Синий", "Зелёный"], correct: 2, exp: "Синий — цвет надёжности, доверия и профессионализма" },
{ q: "Золотое сечение ≈", opts: ["1.414", "1.618", "1.732", "2.000"], correct: 1, exp: "φ = 1.618... — основа гармоничных пропорций в дизайне" },
  { q: "Что такое CMYK?", opts: ["Модель для печати", "Модель для веба", "Тип шрифта", "Формат файла"], correct: 0, exp: "CMYK — субтрактивная модель для печати (Cyan, Magenta, Yellow, Key)" },
  { q: "Оптимальная ширина баннера для YouTube?", opts: ["1920×1080", "2560×1440", "1280×720", "3840×2160"], correct: 1, exp: "2560×1440 — рекомендуемое разрешение для YouTube баннера" },
  { q: "Что означает PSD?", opts: ["Photoshop Document", "Pixel Style Design", "Print Source Data", "Professional Design"], correct: 0, exp: "PSD — формат файлов Adobe Photoshop с поддержкой слоёв" },
  { q: "Какой шрифт лучше для логотипа?", opts: ["Serif", "Sans-serif", "Script", "Зависит от бренда"], correct: 3, exp: "Выбор шрифта зависит от характера и ценностей бренда" },
  { q: "Разрешение 4K это...", opts: ["1920×1080", "2560×1440", "3840×2160", "7680×4320"], correct: 2, exp: "4K UHD = 3840×2160 пикселей" },
  { q: "Что такое трекинг?", opts: ["Расстояние между всеми буквами", "Расстояние между словами", "Высота строки", "Размер шрифта"], correct: 0, exp: "Трекинг — равномерное расстояние между всеми символами" },
  { q: "Формат с прозрачностью?", opts: ["JPEG", "BMP", "PNG", "GIF"], correct: 2, exp: "PNG поддерживает альфа-канал (прозрачность)" },
  { q: "Что такое mockup?", opts: ["Эскиз", "Реалистичная презентация дизайна", "Цветовая палитра", "Тип шрифта"], correct: 1, exp: "Mockup — реалистичная визуализация дизайна в контексте" },
  { q: "Какая цветовая схема использует 3 цвета на равном расстоянии?", opts: ["Комплементарная", "Аналогичная", "Триадная", "Монохромная"], correct: 2, exp: "Триадная схема — 3 цвета на равном расстоянии на цветовом круге" },
  { q: "Что такое векторная графика?", opts: ["Из пикселей", "Из математических формул", "Из фотографий", "Из текстур"], correct: 1, exp: "Векторная графика основана на математических кривых, масштабируется без потерь" },
  { q: "Оптимальный размер аватарки для Discord?", opts: ["128×128", "256×256", "512×512", "1024×1024"], correct: 2, exp: "512×512 — рекомендуемый размер для Discord аватара" },
  { q: "Что такое безопасная зона в дизайне?", opts: ["Зона без важных элементов", "Зона для текста", "Зона для логотипа", "Зона обрезки"], correct: 0, exp: "Безопасная зона — область, где не размещают важные элементы из-за возможной обрезки" },
  { q: "Какой формат поддерживает анимацию?", opts: ["PNG", "JPEG", "GIF", "SVG"], correct: 2, exp: "GIF поддерживает покадровую анимацию" },
  { q: "Что такое градиент?", opts: ["Плавный переход цветов", "Резкая граница", "Текстура", "Фильтр"], correct: 0, exp: "Градиент — плавный переход между двумя или более цветами" },
  { q: "Разрешение для печати рекламы?", opts: ["72 DPI", "150 DPI", "300 DPI", "600 DPI"], correct: 2, exp: "300 DPI — стандарт для качественной печати" },
  { q: "Что такое композиция в дизайне?", opts: ["Цветовая схема", "Расположение элементов", "Тип шрифта", "Формат файла"], correct: 1, exp: "Композиция — организация и расположение визуальных элементов" },
  { q: "Какой цвет в психологии означает энергию?", opts: ["Синий", "Красный", "Зелёный", "Серый"], correct: 1, exp: "Красный ассоциируется с энергией, страстью и действием" },
  { q: "Что такое контраст?", opts: ["Яркость", "Разница между элементами", "Насыщенность", "Прозрачность"], correct: 1, exp: "Контраст — визуальная разница между элементами (цвет, размер, форма)" },
  { q: "Формат для веб-иконок?", opts: ["PSD", "AI", "ICO", "TIFF"], correct: 2, exp: "ICO — специальный формат для favicon и веб-иконок" },
  { q: "Что такое типографика?", opts: ["Искусство работы со шрифтами", "Цветовая палитра", "Работа с фото", "Анимация текста"], correct: 0, exp: "Типографика — искусство оформления текста и работы со шрифтами" },
  { q: "Какое соотношение сторон у YouTube превью?", opts: ["16:9", "4:3", "1:1", "21:9"], correct: 0, exp: "16:9 — стандартное соотношение для YouTube thumbnail (1280×720)" },
  { q: "Что такое белое пространство (whitespace)?", opts: ["Цвет фона", "Пустая область между элементами", "Ошибка", "Тип шрифта"], correct: 1, exp: "Whitespace — пустое пространство, улучшающее читаемость и восприятие" },
  { q: "Какой инструмент для векторной графики?", opts: ["Photoshop", "Illustrator", "After Effects", "Premiere"], correct: 1, exp: "Adobe Illustrator — профессиональный инструмент для векторной графики" },
  { q: "Что такое палитра?", opts: ["Набор цветов", "Кисть", "Слой", "Фильтр"], correct: 0, exp: "Палитра — подобранный набор цветов для проекта" },
  { q: "Размер превью для Twitch?", opts: ["1280×720", "1920×1080", "1200×600", "800×450"], correct: 1, exp: "1920×1080 — оптимальный размер для Twitch превью" },
  { q: "Что такое опасити (opacity)?", opts: ["Прозрачность", "Яркость", "Контраст", "Насыщенность"], correct: 0, exp: "Opacity — уровень прозрачности элемента (0-100%)" },
  { q: "Какой цвет означает роскошь?", opts: ["Красный", "Золотой", "Синий", "Зелёный"], correct: 1, exp: "Золотой ассоциируется с роскошью, богатством и премиальностью" },
  { q: "Что такое hierarchy (иерархия)?", opts: ["Порядок важности элементов", "Список файлов", "Цветовая схема", "Тип шрифта"], correct: 0, exp: "Иерархия — визуальная организация элементов по важности" },
  { q: "Формат для анимированных стикеров Telegram?", opts: ["GIF", "MP4", "TGS (Lottie)", "PNG"], correct: 2, exp: "TGS (Lottie JSON) — формат для анимированных стикеров Telegram" },
  { q: "Что такое баланс в композиции?", opts: ["Равновесие элементов", "Цвет", "Размер", "Шрифт"], correct: 0, exp: "Баланс — равномерное распределение визуального веса" },
  { q: "Какой цвет успокаивает?", opts: ["Красный", "Жёлтый", "Синий", "Оранжевый"], correct: 2, exp: "Синий имеет успокаивающий эффект" },
  { q: "Что такое ресэмплинг?", opts: ["Изменение размера изображения", "Смена цвета", "Поворот", "Обрезка"], correct: 0, exp: "Resampling — изменение разрешения с пересчётом пикселей" },
  { q: "Минимальный размер для печати визитки?", opts: ["50×90 мм", "85×55 мм", "100×70 мм", "A4"], correct: 1, exp: "85×55 мм — стандартный размер визитной карточки" },
  { q: "Что такое flat design?", opts: ["3D дизайн", "Минималистичный 2D стиль", "Реалистичный дизайн", "Анимация"], correct: 1, exp: "Flat design — минималистичный стиль без объёма и теней" },
  { q: "Какая программа для motion design?", opts: ["Photoshop", "Illustrator", "After Effects", "InDesign"], correct: 2, exp: "Adobe After Effects — стандарт индустрии для motion дизайна" },
  { q: "Что такое mood board?", opts: ["Доска вдохновения", "Список задач", "Палитра цветов", "Тип шрифта"], correct: 0, exp: "Mood board — коллаж изображений для передачи стиля и настроения проекта" },
  { q: "Размер обложки для Facebook?", opts: ["820×312", "851×315", "1200×628", "1640×924"], correct: 1, exp: "851×315 — рекомендуемый размер обложки Facebook" },
  { q: "Что такое UI/UX?", opts: ["Интерфейс и опыт пользователя", "Только дизайн", "Только код", "Анимация"], correct: 0, exp: "UI — визуальный интерфейс, UX — пользовательский опыт взаимодействия" },
  { q: "Какой формат лучше для фото в вебе?", opts: ["BMP", "TIFF", "JPEG/WebP", "PSD"], correct: 2, exp: "JPEG и WebP — оптимальные форматы для фото в интернете (малый вес)" },
  { q: "Что такое responsive design?", opts: ["Адаптивный дизайн", "Быстрый дизайн", "Дорогой дизайн", "Простой дизайн"], correct: 0, exp: "Responsive — дизайн, адаптирующийся под разные размеры экранов" },
  { q: "Что такое kerning pair?", opts: ["Пара букв с индивидуальным кернингом", "Два шрифта", "Два цвета", "Два слоя"], correct: 0, exp: "Kerning pair — пара символов с особым расстоянием (например, AV)" },
  { q: "Оптимальная длина строки текста?", opts: ["30-40 символов", "50-75 символов", "100+ символов", "Неважно"], correct: 1, exp: "50-75 символов на строку — оптимум для комфортного чтения" },
];

// ── QUIZ DAILY SYSTEM ──
function getQuizForToday() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  
  // Seeded shuffle algorithm
  const shuffled = [...QUIZ_QUESTIONS_POOL];
  let currentIndex = shuffled.length;
  const random = (max) => {
    const x = Math.sin(seed + currentIndex) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };
  
  while (currentIndex > 0) {
    const randomIndex = random(currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  // Return first 8 questions
  return shuffled.slice(0, 8).map(q => ({
    ...q,
    opts: [...q.opts].sort(() => 0.5 - Math.random()) // Shuffle answers
  }));
}

const QUIZ_DATA = getQuizForToday();

const FAQ_DATA = {
  ru: [
    { q: "📝 Как работает процесс заказа?", a: "1. Пишешь мне в Telegram\n2. Обсуждаем детали и стиль\n3. Согласуем ТЗ и сроки\n4. Предоплата 50%\n5. Выполнение за 1–3 дня\n6. Первый результат\n7. До 3 правок бесплатно\n8. Итоговый расчёт и файлы" },
    { q: "💾 Что я получу в итоге?", a: "✅ Исходники PSD/AI/AEP\n✅ PNG/JPG/SVG экспорт\n✅ 3 бесплатных правки\n✅ Поддержка после сдачи\n✅ Конфиденциальность" },
    { q: "✏️ Сколько правок включено?", a: "🔄 3 бесплатных правки\n💰 Доп. правки по договорённости\n⚡ Правки в течение суток" },
    { q: "💳 Способы оплаты?", a: "⭐ Telegram Stars внутри mini app\n💳 Карта любой страны\n💸 CryptoBot (USDT/TON/BTC)\n💵 Схема 50% + 50%\n🔒 Безопасная сделка" },
    { q: "⚡ Срочный заказ?", a: "🔥 Срочность от 3 часов\n💰 Надбавка +20–50%\n📞 Напиши — обсудим!" },
    { q: "📁 Какие форматы файлов?", a: "📦 PNG · JPG · SVG\n🎨 PSD · AI\n🎬 AEP · GIF · MP4\n✅ Любой формат по запросу" },
    { q: "🔒 Моя работа останется конфиденциальной?", a: "🔒 Твой проект — только твой\n✅ Не публикую без разрешения\n✅ NDA по запросу" },
    { q: "🌍 Работаешь с иностранными клиентами?", a: "✅ Да, оплата в USDT/USD\n✅ Общение на русском и английском\n🌈 Нет географических ограничений" },
  ],
  en: [
    { q: "📝 How does the order process work?", a: "1. Message me on Telegram\n2. Discuss details & style\n3. Agree on brief & timeline\n4. 50% upfront payment\n5. Production in 1–3 days\n6. First delivery\n7. Up to 3 free revisions\n8. Final payment & files" },
    { q: "💾 What will I receive?", a: "✅ Source files PSD/AI/AEP\n✅ PNG/JPG/SVG exports\n✅ 3 free revisions\n✅ Post-delivery support\n✅ Confidentiality" },
    { q: "✏️ How many revisions?", a: "🔄 3 free revisions\n💰 Extra revisions by agreement\n⚡ Revisions within 24 hours" },
    { q: "💳 Payment methods?", a: "⭐ Telegram Stars inside the mini app\n💳 Card from any country\n💸 CryptoBot (USDT/TON/BTC)\n💵 50% + 50% scheme\n🔒 Secure transaction" },
    { q: "⚡ Urgent orders?", a: "🔥 Rush from 3 hours\n💰 +20–50% surcharge\n📞 Write me — let's discuss!" },
    { q: "📁 What file formats?", a: "📦 PNG · JPG · SVG\n🎨 PSD · AI\n🎬 AEP · GIF · MP4\n✅ Any format on request" },
    { q: "🔒 Confidentiality?", a: "🔒 Your project stays private\n✅ No publishing without permission\n✅ NDA available" },
    { q: "🌍 Working with international clients?", a: "✅ Yes, payment in USDT/USD\n✅ Communication in English & Russian\n🌈 No geographic limits" },
  ],
};
FAQ_DATA.ua = FAQ_DATA.ru; FAQ_DATA.kz = FAQ_DATA.ru; FAQ_DATA.by = FAQ_DATA.ru;

// ── ACHIEVEMENTS ──
const ACHIEVEMENTS = [
  { id: "first_visit", icon: "👋", title: "Первый визит", desc: "Добро пожаловать!", xp: 10, secret: false },
  { id: "explorer", icon: "🗺️", title: "Исследователь", desc: "Посетил все разделы", xp: 25, secret: false },
  { id: "quiz_master", icon: "🧠", title: "Знаток дизайна", desc: "Ответил правильно 5+ раз", xp: 50, secret: false },
  { id: "streak_3", icon: "🔥", title: "Стрик 3 дня", desc: "3 дня подряд", xp: 30, secret: false },
  { id: "streak_7", icon: "⚡", title: "Неделя", desc: "7 дней подряд", xp: 70, secret: true },
  { id: "streak_14", icon: "💪", title: "Две недели", desc: "14 дней подряд", xp: 120, secret: true },
  { id: "streak_30", icon: "👑", title: "Легенда", desc: "30 дней подряд", xp: 250, secret: true },
  { id: "wishlist_5", icon: "💜", title: "Коллекционер", desc: "5+ работ в вишлисте", xp: 20, secret: false },
  { id: "wishlist_10", icon: "💎", title: "Эстет", desc: "10+ работ в вишлисте", xp: 40, secret: false },
  { id: "wishlist_20", icon: "🎨", title: "Ценитель", desc: "20+ работ в вишлисте", xp: 80, secret: true },
  { id: "level_5", icon: "🏆", title: "Уровень 5", desc: "Достиг 5 уровня", xp: 100, secret: false },
  { id: "level_10", icon: "🌟", title: "Уровень 10", desc: "Достиг 10 уровня", xp: 200, secret: false },
  { id: "level_15", icon: "💫", title: "Уровень 15", desc: "Достиг 15 уровня", xp: 350, secret: true },
  { id: "ai_gen_5", icon: "🤖", title: "AI Адепт", desc: "5 идей от AI", xp: 30, secret: false },
  { id: "ai_gen_10", icon: "🧬", title: "AI Мастер", desc: "10 идей от AI", xp: 60, secret: false },
  { id: "ai_gen_25", icon: "🚀", title: "AI Гуру", desc: "25 идей от AI", xp: 150, secret: true },
  { id: "course_complete", icon: "🎓", title: "Студент", desc: "Прошёл курс на 100%", xp: 80, secret: false },
  { id: "course_complete_3", icon: "📚", title: "Отличник", desc: "Завершил 3 курса", xp: 150, secret: false },
  { id: "course_complete_all", icon: "🎖️", title: "Магистр", desc: "Прошёл все курсы", xp: 300, secret: true },
  { id: "cart_order", icon: "🛒", title: "Первый заказ", desc: "Добавил товар в корзину", xp: 15, secret: false },
  { id: "cart_full", icon: "🛍️", title: "Шопоголик", desc: "5+ товаров в корзине", xp: 25, secret: false },
  { id: "promo_hunter", icon: "🎫", title: "Охотник за скидками", desc: "Применил промокод", xp: 20, secret: false },
  { id: "night_owl", icon: "🦉", title: "Ночная сова", desc: "Зашёл после 23:00", xp: 15, secret: true },
  { id: "early_bird", icon: "🌅", title: "Жаворонок", desc: "Зашёл до 6:00", xp: 15, secret: true },
  { id: "speed_quiz", icon: "⚡", title: "Спидраннер", desc: "Викторина за <2 мин", xp: 40, secret: true },
  { id: "quiz_perfect", icon: "💯", title: "Перфекционист", desc: "Все ответы верны", xp: 60, secret: false },
  { id: "theme_switcher", icon: "🎨", title: "Хамелеон", desc: "Сменил тему 5 раз", xp: 20, secret: false },
  { id: "lang_polyglot", icon: "🌐", title: "Полиглот", desc: "Переключил язык 3 раза", xp: 25, secret: true },
  { id: "gallery_explorer", icon: "🖼️", title: "Арт-критик", desc: "Просмотрел 20+ работ", xp: 30, secret: false },
  { id: "faq_reader", icon: "📖", title: "Любознательный", desc: "Прочитал все FAQ", xp: 15, secret: false },
  { id: "social_butterfly", icon: "🦋", title: "Социальный", desc: "Открыл все соцсети", xp: 10, secret: false },
  { id: "scroll_master", icon: "📜", title: "Скроллер", desc: "Проскроллил 10000px", xp: 20, secret: true },
  { id: "click_master", icon: "👆", title: "Кликер", desc: "100+ кликов", xp: 25, secret: true },
  { id: "loyal_user", icon: "💝", title: "Верный клиент", desc: "5+ визитов", xp: 50, secret: false },
  { id: "mega_fan", icon: "⭐", title: "Мега-фан", desc: "10+ визитов", xp: 100, secret: false },
*/

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

// ── HELPERS ──
const tgUserId = tgUser?.id || "local";
const lsPendingWrites = new Map();
let lsFlushTimer = null;
const REMOTE_ENTITY_KEYS = new Set(["rs_wallet_balance4", "rs_payment_history4", "rs_orders4"]);
const EXTRA_SETTING_KEYS = new Set(["freepack_subscribed"]);

function shouldSyncSettingKey(key) {
  return typeof key === "string" && ((key.startsWith("rs_") && !REMOTE_ENTITY_KEYS.has(key)) || EXTRA_SETTING_KEYS.has(key));
}

function getUserStoragePrefix() {
  return `rs_${tgUserId}_`;
}

function parseStoredValue(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeThemeId(stored) {
  const id = stored === "graphite" ? "deepspace" : stored;
  return THEMES[id] ? id : "deepspace";
}

function collectLocalSettings() {
  if (typeof window === "undefined") return {};
  const prefix = getUserStoragePrefix();
  const settings = {};
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const storageKey = localStorage.key(i);
      if (!storageKey || !storageKey.startsWith(prefix)) continue;
      const key = storageKey.slice(prefix.length);
      if (!shouldSyncSettingKey(key)) continue;
      settings[key] = parseStoredValue(localStorage.getItem(storageKey), null);
    }
  } catch {}
  return settings;
}

function hydrateLocalSettings(settings = {}) {
  if (typeof window === "undefined" || !settings || typeof settings !== "object") return;
  const prefix = getUserStoragePrefix();
  window.__RIVAL_REMOTE_SETTINGS_CACHE = { ...(window.__RIVAL_REMOTE_SETTINGS_CACHE || {}), ...settings };
  for (const [key, value] of Object.entries(settings)) {
    if (!shouldSyncSettingKey(key)) continue;
    try {
      localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    } catch {}
  }
}

function flushLocalStorageQueue() {
  lsFlushTimer = null;
  for (const [key, value] of lsPendingWrites) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
  lsPendingWrites.clear();
}

function scheduleLocalStorageWrite(key, value) {
  lsPendingWrites.set(key, value);
  if (lsFlushTimer) return;
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    lsFlushTimer = window.requestIdleCallback(flushLocalStorageQueue, { timeout: 900 });
  } else {
    lsFlushTimer = setTimeout(flushLocalStorageQueue, 120);
  }
}

if (typeof window !== "undefined" && !window.__rsLocalStorageFlushBound) {
  window.__rsLocalStorageFlushBound = true;
  window.addEventListener("pagehide", flushLocalStorageQueue, { passive: true });
  window.addEventListener("beforeunload", flushLocalStorageQueue);
}

const ls = {
  get: (k, d) => { 
    try { 
      if (
        typeof window !== "undefined"
        && window.__RIVAL_REMOTE_SETTINGS_CACHE
        && Object.prototype.hasOwnProperty.call(window.__RIVAL_REMOTE_SETTINGS_CACHE, k)
      ) {
        return window.__RIVAL_REMOTE_SETTINGS_CACHE[k];
      }
      const key = `rs_${tgUserId}_${k}`;
      if (lsPendingWrites.has(key)) return JSON.parse(lsPendingWrites.get(key));
      const v = localStorage.getItem(key); 
      return v ? JSON.parse(v) : d; 
    } catch { return d; } 
  },
  set: (k, v) => { 
    try { 
      const key = `rs_${tgUserId}_${k}`;
      scheduleLocalStorageWrite(key, JSON.stringify(v));
      if (typeof window !== "undefined") {
        if (!window.__RIVAL_REMOTE_SETTINGS_CACHE) window.__RIVAL_REMOTE_SETTINGS_CACHE = {};
        if (shouldSyncSettingKey(k)) {
          window.__RIVAL_REMOTE_SETTINGS_CACHE[k] = v;
          window.__RIVAL_REMOTE_SETTINGS_SYNC?.(k, v);
        }
      }
    } catch {} 
  },
};
const openTg = (path, msg = "") => window.open(`https://t.me/${path}${msg ? "?text=" + encodeURIComponent(msg) : ""}`, "_blank");
function getGreeting(lang) {
  const h = new Date().getHours();
  const g = "";
  const map = {
    ru: [g + " Доброй ночи", g + " Доброе утро", g + " Добрый день", g + " Добрый вечер"],
    en: [g + " Good night", g + " Good morning", g + " Good afternoon", g + " Good evening"],
    ua: [g + " Доброї ночі", g + " Доброго ранку", g + " Добрий день", g + " Добрий вечір"],
    kz: [g + " Жақсы түн", g + " Қайырлы таң", g + " Жақсы күн", g + " Жақсы кеш"],
    by: [g + " Добрай ночы", g + " Добрай раніцы", g + " Добры дзень", g + " Добры вечар"],
  };
  return (map[lang] || map.ru)[h < 6 ? 0 : h < 12 ? 1 : h < 18 ? 2 : 3];
}
function getStreak() {
  const data = ls.get("rs_streak4", { last: "", count: 0, xp: 0, totalQuizCorrect: 0, aiGenCount: 0, tabsVisited: [], achievementsUnlocked: [], lastQuizDate: "" });
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (data.last === today) return data;
  if (data.last === yesterday) { data.count++; data.xp += 10; } else { data.count = 1; data.xp += 5; }
  data.last = today;
  ls.set("rs_streak4", data);
  return data;
}
function saveStreak(data) { ls.set("rs_streak4", data); }
function addXP(amount, data) {
  const d = { ...data, xp: data.xp + amount };
  saveStreak(d);
  return d;
}
function getLevel(xp) { return Math.max(1, Math.floor(Math.sqrt(xp / 50))); }
function getLevelXP(level) { return level * level * 50; }
function getLevelProgress(xp) {
  const level = getLevel(xp);
  const curr = getLevelXP(level), next = getLevelXP(level + 1);
  return (xp - curr) / (next - curr);
}

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
  const [soundOn, setSoundOn] = useState(() => { const s = ls.get("rs_sound4", true); _soundEnabled = s; return s; });
  const [volume, setVolume] = useState(() => { const v = ls.get("rs_volume4", .55); _volume = v; return v; });
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

  useEffect(() => { _soundEnabled = soundOn; }, [soundOn]);
  useEffect(() => { _volume = volume; }, [volume]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
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

  const createSparkles = (x, y) => {
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
      const lowMemory = Number(navigator.deviceMemory || 8) <= 4;
      const lowCore = Number(navigator.hardwareConcurrency || 8) <= 4;
      const smooth = Boolean(reduced || isTg || (coarse && narrow) || lowMemory || lowCore);
      document.documentElement.dataset.rsPerformance = smooth ? "smooth" : "full";
    };

    syncPerformanceMode();
    mediaQueries.forEach((query) => query.addEventListener?.("change", syncPerformanceMode));
    return () => {
      mediaQueries.forEach((query) => query.removeEventListener?.("change", syncPerformanceMode));
    };
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
    window.__RIVAL_GLOBALS = {
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
    };
  }, [liveCourses, liveFaq, liveGallery, liveHome, liveLangs, liveReviews, liveServices]);
  
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
      setTab("home");
      SFX.tab();
    });
  }, [tab, selImage, drawerOpen]);

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

  useEffect(() => { ls.set("rs_cart4", cart); }, [cart]);
  useEffect(() => { ls.set("rs_wl4", wishlist); }, [wishlist]);
  useEffect(() => { ls.set("rs_wallet_balance4", walletBalance); }, [walletBalance]);
  useEffect(() => { ls.set("rs_payment_history4", paymentHistory); }, [paymentHistory]);
  useEffect(() => { ls.set("rs_orders4", orders); }, [orders]);

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
      _soundEnabled = settings.rs_sound4;
      setSoundOn(settings.rs_sound4);
    }
    if (typeof settings.rs_volume4 === "number") {
      const nextVolume = Math.max(0, Math.min(1, settings.rs_volume4));
      _volume = nextVolume;
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
        :root{--font-body:"Inter",system-ui,sans-serif;--font-display:"Gilroy-Bold","Gilroy-Heavy","Inter",system-ui,sans-serif;--font-button:"Gilroy-Medium","Gilroy-Bold","Inter",system-ui,sans-serif;--font-number:"Gilroy-Heavy","Gilroy-Bold","Inter",system-ui,sans-serif;--font-micro:"Inter",system-ui,sans-serif;--tg-app-height:100dvh;--tg-stable-height:100dvh;--tg-visual-height:100dvh;--tg-side-gap:clamp(2px,1.2vw,4px);--tg-bar-gap:clamp(1px,.8vw,2px);--tg-shell-width:420px;--tg-shell-scale:1;--rs-tg-bg:var(--tg-theme-bg-color,#030408);--rs-tg-text:var(--tg-theme-text-color,rgba(224,231,255,.95));--rs-tg-hint:var(--tg-theme-hint-color,#64748b);--rs-tg-secondary-bg:var(--tg-theme-secondary-bg-color,#090b14);}
        *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:0;height:0;}*{scrollbar-width:none;}
        html{scroll-behavior:smooth;overscroll-behavior:none;overflow:hidden;overflow-x:clip;height:var(--tg-app-height,100dvh);width:100%;max-width:100%;background:var(--rs-tg-bg,#030408);color-scheme:dark;}
        body{margin:0;padding:0;overflow:hidden;overflow-x:clip;height:var(--tg-app-height,100dvh);width:100%;max-width:100%;overscroll-behavior-y:none;-webkit-overflow-scrolling:touch;font-family:var(--font-body);background:var(--rs-tg-bg,#030408);color:var(--rs-tg-text,rgba(224,231,255,.95));}
        #root{height:var(--tg-app-height,100dvh);width:100%;max-width:100%;overflow:hidden;overflow-x:clip;}
        html[data-rs-paused] *,html[data-rs-paused] *::before,html[data-rs-paused] *::after{animation-play-state:paused!important;}
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
        html[data-rs-mobile="true"] .rs-content{-webkit-overflow-scrolling:touch;overscroll-behavior:contain;scroll-behavior:auto!important;will-change:scroll-position;}
        html[data-rs-mobile="true"] .rs-content > div{contain:layout style;}
        html[data-rs-mobile="true"] .rs-content img,html[data-rs-mobile="true"] .rs-content svg{backface-visibility:hidden;}
        html[data-rs-mobile="true"] .rs-mesh-nebula{animation:none!important;filter:none!important;opacity:.34!important;transform:translate3d(0,0,0)!important;}
        html[data-rs-mobile="true"] .rs-mesh-nebula-c,html[data-rs-mobile="true"] .rs-mesh-glow{display:none!important;}
        html[data-rs-mobile="true"] .rs-mesh-stars-near{animation:none!important;opacity:.46!important;transform:none!important;}
        html[data-rs-mobile="true"] header > div,html[data-rs-mobile="true"] .rs-bottom-nav{backdrop-filter:blur(9px)!important;-webkit-backdrop-filter:blur(9px)!important;box-shadow:0 12px 28px rgba(3,4,8,.36),inset 0 1px 0 rgba(255,255,255,.05)!important;}
        html[data-rs-mobile="true"] .rs-nav-icon-cycle{animation-duration:6.4s!important;}
        html[data-rs-mobile="true"] .rs-content > div{animation-duration:.2s!important;animation-timing-function:cubic-bezier(.2,.8,.2,1)!important;}
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
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} th={th} t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} soundOn={soundOn} setSoundOn={setSoundOn} volume={volume} setVolume={setVolume} streak={streak} sfx={SFX} getLevel={getLevel} getLevelProgress={getLevelProgress} tgUser={tgUser} />

      <div className="rs-shell" style={{ width: "var(--tg-shell-width, 480px)", maxWidth: "var(--tg-shell-width, 480px)", display: "flex", flexDirection: "column", height: "calc(var(--tg-app-height, 100dvh) / var(--tg-shell-scale, 1))", position: "relative", zIndex: 1, overflowX: "hidden", transform: "scale(var(--tg-shell-scale, 1))", transformOrigin: "top center", flexShrink: 0 }}>
        {/* Header */}
        <header style={{ flexShrink: 0, position: "sticky", top: 0, zIndex: 100, padding: "calc(10px + var(--tg-safe-top, 0px)) var(--tg-bar-gap) 0", background: "transparent" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 58, padding: "12px 14px", borderRadius: 24, background: `linear-gradient(180deg, ${th.nav} 0%, ${th.surface} 100%)`, border: `1px solid ${th.border}`, boxShadow: th.shadow, backdropFilter: "blur(28px)", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 14% 18%, rgba(255,255,255,.09) 0 1px, transparent 1.8px), radial-gradient(circle at 84% 72%, rgba(255,255,255,.07) 0 1px, transparent 1.8px), radial-gradient(circle at 72% 24%, rgba(255,255,255,.05) 0 .8px, transparent 1.6px), linear-gradient(135deg, rgba(255,255,255,.03) 0%, transparent 45%, rgba(255,255,255,.02) 100%)", opacity: 0.9, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.95, background: "radial-gradient(circle at 8% 72%, rgba(255,255,255,.08) 0 1px, transparent 1.9px), radial-gradient(circle at 28% 34%, rgba(255,255,255,.05) 0 .9px, transparent 1.7px), radial-gradient(circle at 58% 18%, rgba(255,255,255,.05) 0 .9px, transparent 1.6px), radial-gradient(circle at 92% 58%, rgba(255,255,255,.08) 0 1.05px, transparent 1.9px), linear-gradient(122deg, transparent 16%, rgba(255,255,255,.08) 18%, transparent 21%), radial-gradient(ellipse at 70% -30%, rgba(255,255,255,.06) 0%, transparent 58%), radial-gradient(ellipse at -10% 100%, rgba(255,255,255,.04) 0%, transparent 52%)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 70, position: "relative", zIndex: 1 }}>
              <button onClick={(e) => {
                createSparkles(e.clientX, e.clientY);
                SFX.drawer();
                setDrawerOpen(true);
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
                <OrbitalMark size={24} />
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
                setTab("pricing");
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
                  setTab("profile");
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

        <main className="rs-content" ref={mainRef} style={{ flex: 1, padding: "14px var(--tg-side-gap) calc(128px + var(--tg-safe-bottom, 0px))", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
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
              {tab === "home" && <HomeTab th={th} t={t} lang={lang} onGoGallery={() => setTab("gallery")} onGoCourses={() => setTab("courses")} onGoPricing={() => setTab("pricing")} onGoMore={() => setTab("more")} cartCount={cartCount} streak={streak} onUnlockAchieve={unlockAchievement} />}
              {tab === "gallery" && <GalleryTab th={th} t={t} lang={lang} wishlist={wishlist} toggleWishlist={toggleWishlist} onOpenImage={item => setSelImage(item)} />}
              {tab === "ai" && <AITab th={th} t={t} lang={lang} showToast={showToast} />}
              {tab === "courses" && <CoursesTab th={th} t={t} lang={lang} showToast={showToast} addXPfn={addXPfn} onUnlockAchieve={unlockAchievement} streak={streak} setStreak={setStreak} />}
              {tab === "pricing" && <PricingTab th={th} t={t} lang={lang} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} updateQty={updateQty} clearCart={clearCart} showToast={showToast} onUnlockAchieve={unlockAchievement} setTab={setTab} walletBalance={walletBalance} createCheckoutOrder={createCheckoutOrder} openCryptoBot={openCryptoBot} openStarsInvoice={openStarsInvoice} openOrderTelegram={openOrderTelegram} />}

              {tab === "more" && <MoreTab th={th} t={t} lang={lang} showToast={showToast} streak={streak} onUnlockAchieve={unlockAchievement} addXPfn={addXPfn} />}
              {tab === "profile" && <ProfileTab th={th} t={t} lang={lang} streak={streak} achievements={achievements} showToast={showToast} setTab={setTab} setSelectedAchievement={setSelectedAchievement} walletBalance={walletBalance} paymentHistory={paymentHistory} orders={orders} onRequestTopUp={requestTopUp} onMarkPaymentSubmitted={markPaymentSubmitted} onRefreshInvoiceStatus={refreshInvoiceStatus} onAddOrderMessage={addOrderMessage} onOpenCryptoBot={openCryptoBot} onOpenStarsInvoice={openStarsInvoice} onOpenTelegram={openOrderTelegram} onRequestPaymentDetails={requestPaymentDetails} />}
            </React.Suspense>
          </div>
        </main>

        <BottomNav active={tab} onChange={setTab} th={th} t={t} cartCount={cartCount} ordersCount={activeOrdersCount} walletBalance={walletBalance} sfx={SFX} />
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


