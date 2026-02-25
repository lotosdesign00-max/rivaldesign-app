import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { 
  initGA, 
  trackAppStart, 
  trackTrafficSource, 
  trackSectionView,
  trackFunnelStep,
  trackUserActivity 
} from "./utils/analytics";

/* ═══════════════════════════════════════════════════════════════════════
   RIVAL SPACE — TELEGRAM MINI APP v4.0 ULTRA
   Complete redesign with AI, achievements, rich animations, new UX
═══════════════════════════════════════════════════════════════════════ */

// ── TYPEWRITER ANIMATED TEXT COMPONENT ──
const TypewriterText = ({ texts = ["Создаю стильные визуалы"], theme }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    if (isTyping && !isDeleting) {
      // Typing animation
      if (displayedText.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, 80); // Speed of typing
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, wait 2 seconds then start fading
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    }

    if (isDeleting) {
      // Fade out animation
      if (opacity > 0) {
        const timeout = setTimeout(() => {
          setOpacity(prev => Math.max(0, prev - 0.05));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        // After fade out, reset and move to next text
        setDisplayedText("");
        setIsTyping(true);
        setIsDeleting(false);
        setOpacity(1);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [displayedText, currentTextIndex, texts, isTyping, isDeleting, opacity]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        minHeight: '1.5em',
      }}
    >
      <span
        style={{
          fontSize: 'clamp(24px, 5vw, 42px)',
          fontWeight: 800,
          color: 'transparent',
          backgroundImage: theme.grad,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          opacity: opacity,
          transition: 'opacity 0.3s ease-out',
          display: 'inline-block',
          position: 'relative',
        }}
      >
        {displayedText || '\u00A0'}
        <span
          style={{
            display: 'inline-block',
            width: '3px',
            height: '0.9em',
            background: theme.accent,
            marginLeft: '4px',
            animation: 'blink 1s infinite',
            verticalAlign: 'middle',
            boxShadow: `0 0 12px ${theme.glow}`,
          }}
        />
      </span>
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ── TELEGRAM SDK ──
const TG = window.Telegram?.WebApp;
const tgReady = () => { try { TG?.ready(); TG?.expand(); TG?.disableVerticalSwipes?.(); TG?.enableClosingConfirmation?.(); } catch {} };
const tgHaptic = (t = "light") => { try { TG?.HapticFeedback?.impactOccurred?.(t); } catch {} };
const tgNotif = (t = "success") => { try { TG?.HapticFeedback?.notificationOccurred?.(t); } catch {} };
const tgBackBtn = (show, cb) => { try { if (show) { TG?.BackButton?.show(); if (cb) TG?.BackButton?.onClick(cb); } else { TG?.BackButton?.hide(); TG?.BackButton?.offClick?.(cb); } } catch {} };
const isTg = !!TG;
const tgUser = TG?.initDataUnsafe?.user;

// ── AUDIO ENGINE ──
let _actx = null, _master = null, _soundEnabled = true, _volume = 0.55;
function actx() {
  if (!_actx) { try { _actx = new (window.AudioContext || window.webkitAudioContext)(); _master = _actx.createGain(); _master.connect(_actx.destination); } catch {} }
  return _actx;
}
function note(f, t = "sine", v = 0.07, d = 0.12, delay = 0) {
  if (!_soundEnabled) return;
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
  tab: () => { note(660, "triangle", .06, .09); note(880, "sine", .04, .07, .04); tgHaptic("light"); },
  open: () => { [440, 660, 880].forEach((f, i) => note(f, "sine", .06, .14, i * .04)); tgHaptic("medium"); },
  close: () => { [880, 660, 440].forEach((f, i) => note(f, "sine", .05, .1, i * .03)); },
  success: () => { [523, 659, 784, 1047].forEach((f, i) => note(f, "sine", .08, .18, i * .07)); tgNotif("success"); },
  error: () => { [350, 250].forEach((f, i) => note(f, "sawtooth", .06, .15, i * .06)); tgNotif("error"); },
  addCart: () => { [523, 659, 784].forEach((f, i) => note(f, "sine", .07, .12, i * .05)); tgHaptic("medium"); },
  remove: () => { note(280, "sawtooth", .05, .13); tgHaptic("light"); },
  clear: () => { [380, 280, 180].forEach((f, i) => note(f, "sawtooth", .05, .1, i * .05)); tgHaptic("heavy"); },
  order: () => { [261, 329, 392, 523, 659, 784].forEach((f, i) => note(f, "sine", .09, .2, i * .06)); tgNotif("success"); },
  theme: () => { [300, 400, 500, 600].forEach((f, i) => note(f, "sine", .05, .12, i * .04)); tgHaptic("medium"); },
  lang: () => { note(700, "sine", .06, .1); note(900, "sine", .05, .1, .06); tgHaptic("light"); },
  ai: () => { [200, 300, 400, 500, 600, 700, 800].forEach((f, i) => note(f, "sine", .04, .14, i * .04)); tgHaptic("medium"); },
  aiDone: () => { [784, 988, 1175, 1568].forEach((f, i) => note(f, "sine", .08, .2, i * .08)); tgNotif("success"); },
  like: () => { note(880, "sine", .07, .14); note(1100, "sine", .05, .1, .07); tgHaptic("light"); },
  copy: () => { note(800, "sine", .05, .08); note(1000, "sine", .04, .07, .05); tgHaptic("light"); },
  filter: () => { note(600, "triangle", .04, .08); tgHaptic("light"); },
  toggle: () => { note(700, "triangle", .05, .1); tgHaptic("light"); },
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
  void: {
    id: "void", label: "Void", emoji: "◼",
    bg: "#050510", nav: "#0a0a1a", card: "#0e0e22", surface: "#12122e",
    border: "rgba(120,80,255,.18)", accent: "#7c3aed", accentB: "#6025d1",
    glow: "rgba(124,58,237,.35)", text: "#f0ebff", sub: "#7068a0",
    btn: "#7c3aed", btnTxt: "#fff", hi: "#a78bfa",
    grad: "linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)",
    mesh: "radial-gradient(ellipse at 20% 20%,rgba(124,58,237,.15) 0%,transparent 60%), radial-gradient(ellipse at 80% 80%,rgba(79,70,229,.12) 0%,transparent 60%)",
    shadow: "0 12px 40px rgba(124,58,237,.25)", tag: "#7c3aed",
  },
  ice: {
    id: "ice", label: "Ice", emoji: "❄",
    bg: "#f0f7ff", nav: "#ffffff", card: "#f8fbff", surface: "#ebf4ff",
    border: "rgba(59,130,246,.15)", accent: "#2563eb", accentB: "#1d4ed8",
    glow: "rgba(37,99,235,.2)", text: "#0f172a", sub: "#64748b",
    btn: "#2563eb", btnTxt: "#fff", hi: "#3b82f6",
    grad: "linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%)",
    mesh: "radial-gradient(ellipse at 30% 0%,rgba(37,99,235,.08) 0%,transparent 60%), radial-gradient(ellipse at 70% 100%,rgba(14,165,233,.06) 0%,transparent 60%)",
    shadow: "0 12px 40px rgba(37,99,235,.15)", tag: "#2563eb",
  },
  ember: {
    id: "ember", label: "Ember", emoji: "🔥",
    bg: "#090400", nav: "#130800", card: "#1a0c00", surface: "#201100",
    border: "rgba(251,146,60,.15)", accent: "#f97316", accentB: "#ea6c10",
    glow: "rgba(249,115,22,.3)", text: "#fff8f0", sub: "#b87040",
    btn: "#f97316", btnTxt: "#fff", hi: "#fb923c",
    grad: "linear-gradient(135deg,#f97316 0%,#ef4444 100%)",
    mesh: "radial-gradient(ellipse at 50% 0%,rgba(249,115,22,.2) 0%,transparent 60%), radial-gradient(ellipse at 100% 100%,rgba(239,68,68,.1) 0%,transparent 60%)",
    shadow: "0 12px 40px rgba(249,115,22,.22)", tag: "#f97316",
  },
  aurora: {
    id: "aurora", label: "Aurora", emoji: "🌌",
    bg: "#00060c", nav: "#000e18", card: "#001220", surface: "#001828",
    border: "rgba(34,211,238,.13)", accent: "#22d3ee", accentB: "#0ea5e9",
    glow: "rgba(34,211,238,.28)", text: "#e0faff", sub: "#4bbdd4",
    btn: "#22d3ee", btnTxt: "#001020", hi: "#67e8f9",
    grad: "linear-gradient(135deg,#22d3ee 0%,#818cf8 100%)",
    mesh: "radial-gradient(ellipse at 0% 50%,rgba(34,211,238,.18) 0%,transparent 60%), radial-gradient(ellipse at 100% 50%,rgba(129,140,248,.12) 0%,transparent 60%)",
    shadow: "0 12px 40px rgba(34,211,238,.2)", tag: "#22d3ee",
  },
  neon: {
    id: "neon", label: "Neon", emoji: "⚡",
    bg: "#000000", nav: "#030303", card: "#060606", surface: "#080808",
    border: "rgba(0,255,136,.18)", accent: "#00ff88", accentB: "#00e077",
    glow: "rgba(0,255,136,.32)", text: "#eaffef", sub: "#00a055",
    btn: "#00ff88", btnTxt: "#000", hi: "#39ffa0",
    grad: "linear-gradient(135deg,#00ff88 0%,#00e0ff 100%)",
    mesh: "radial-gradient(ellipse at 50% 50%,rgba(0,255,136,.12) 0%,transparent 70%)",
    shadow: "0 12px 40px rgba(0,255,136,.22)", tag: "#00ff88",
  },
  sakura: {
    id: "sakura", label: "Sakura", emoji: "🌸",
    bg: "#fff5f9", nav: "#fff", card: "#fff0f6", surface: "#ffe8f2",
    border: "rgba(236,72,153,.13)", accent: "#ec4899", accentB: "#db2777",
    glow: "rgba(236,72,153,.22)", text: "#4a0520", sub: "#9d5570",
    btn: "#ec4899", btnTxt: "#fff", hi: "#f472b6",
    grad: "linear-gradient(135deg,#ec4899 0%,#f43f5e 100%)",
    mesh: "radial-gradient(ellipse at 20% 0%,rgba(236,72,153,.1) 0%,transparent 60%), radial-gradient(ellipse at 80% 100%,rgba(244,63,94,.08) 0%,transparent 60%)",
    shadow: "0 12px 40px rgba(236,72,153,.18)", tag: "#ec4899",
  },
  gold: {
    id: "gold", label: "Gold", emoji: "👑",
    bg: "#070500", nav: "#0e0c00", card: "#161200", surface: "#1e1900",
    border: "rgba(251,191,36,.15)", accent: "#fbbf24", accentB: "#f59e0b",
    glow: "rgba(251,191,36,.28)", text: "#fffbeb", sub: "#8a6a00",
    btn: "#fbbf24", btnTxt: "#000", hi: "#fcd34d",
    grad: "linear-gradient(135deg,#fbbf24 0%,#f97316 100%)",
    mesh: "radial-gradient(ellipse at 50% 0%,rgba(251,191,36,.18) 0%,transparent 60%)",
    shadow: "0 12px 40px rgba(251,191,36,.22)", tag: "#fbbf24",
  },
  mint: {
    id: "mint", label: "Mint", emoji: "🌿",
    bg: "#f0fff8", nav: "#fff", card: "#f0fdf8", surface: "#e8faf2",
    border: "rgba(16,185,129,.14)", accent: "#10b981", accentB: "#059669",
    glow: "rgba(16,185,129,.22)", text: "#052e1c", sub: "#4a7c63",
    btn: "#10b981", btnTxt: "#fff", hi: "#34d399",
    grad: "linear-gradient(135deg,#10b981 0%,#0ea5e9 100%)",
    mesh: "radial-gradient(ellipse at 30% 30%,rgba(16,185,129,.1) 0%,transparent 60%)",
    shadow: "0 12px 40px rgba(16,185,129,.18)", tag: "#10b981",
  },
};

const LANGS = {
  ru: { flag: "🇷🇺", name: "Русский", cur: "₽", code: "RUB", rate: 95 },
  en: { flag: "🇺🇸", name: "English", cur: "$", code: "USD", rate: 1 },
  ua: { flag: "🇺🇦", name: "Українська", cur: "₴", code: "UAH", rate: 40 },
  kz: { flag: "🇰🇿", name: "Қазақша", cur: "₸", code: "KZT", rate: 450 },
  by: { flag: "🇧🇾", name: "Беларуская", cur: "Br", code: "BYN", rate: 3.2 },
};

// ── GALLERY ──
const GALLERY = {
  ru: [
    { id: "a1", cat: "Аватарки", title: "Киберпанк аватар", desc: "Неоновое свечение и sci-fi эстетика", img: "https://picsum.photos/seed/rsa1/400/400", tags: ["neon", "cyber", "scifi"], popular: true, views: 1240 },
    { id: "a2", cat: "Аватарки", title: "Минимал аватар", desc: "Чистый геометрический минимализм", img: "https://picsum.photos/seed/rsa2/400/400", tags: ["minimal", "geo"], popular: false, views: 560 },
    { id: "a3", cat: "Аватарки", title: "Тёмный аватар", desc: "Мрачный атмосферный стиль", img: "https://picsum.photos/seed/rsa3/400/400", tags: ["dark", "moody"], popular: true, views: 980 },
    { id: "a4", cat: "Аватарки", title: "Градиент аватар", desc: "Плавные переходы, мягкие тона", img: "https://picsum.photos/seed/rsa4/400/400", tags: ["gradient", "soft"], popular: false, views: 430 },
    { id: "a5", cat: "Аватарки", title: "Anime аватар", desc: "Иллюстрация в аниме-стиле", img: "https://picsum.photos/seed/rsa5/400/400", tags: ["anime", "illustration"], popular: true, views: 2100 },
    { id: "a6", cat: "Аватарки", title: "Pixel аватар", desc: "Пиксельное ретро искусство", img: "https://picsum.photos/seed/rsa6/400/400", tags: ["pixel", "retro"], popular: false, views: 310 },
    { id: "p1", cat: "Превью", title: "YouTube превью Gaming", desc: "Эпичный геймерский дизайн", img: "https://picsum.photos/seed/rsp1/600/340", tags: ["youtube", "game"], popular: true, views: 3400 },
    { id: "p2", cat: "Превью", title: "Twitch превью", desc: "Стримерский дизайн с индивидуальностью", img: "https://picsum.photos/seed/rsp2/600/340", tags: ["twitch", "stream"], popular: false, views: 780 },
    { id: "p3", cat: "Превью", title: "Viral превью", desc: "Заставит кликать каждого", img: "https://picsum.photos/seed/rsp3/600/340", tags: ["viral", "bright"], popular: true, views: 5600 },
    { id: "p4", cat: "Превью", title: "Минимал превью", desc: "Элегантная лаконичность", img: "https://picsum.photos/seed/rsp4/600/340", tags: ["minimal", "clean"], popular: false, views: 290 },
    { id: "p5", cat: "Превью", title: "Dark превью", desc: "Тёмная тема, максимум атмосферы", img: "https://picsum.photos/seed/rsp5/600/340", tags: ["dark", "cinematic"], popular: true, views: 1870 },
    { id: "b1", cat: "Баннеры", title: "Twitch баннер PRO", desc: "Профессиональная шапка канала", img: "https://picsum.photos/seed/rsb1/800/220", tags: ["twitch", "channel"], popular: true, views: 2200 },
    { id: "b2", cat: "Баннеры", title: "Discord баннер", desc: "Уникальная серверная шапка", img: "https://picsum.photos/seed/rsb2/800/220", tags: ["discord"], popular: false, views: 650 },
    { id: "b3", cat: "Баннеры", title: "YouTube шапка 4K", desc: "Безупречный канальный арт", img: "https://picsum.photos/seed/rsb3/800/220", tags: ["youtube", "4k"], popular: true, views: 3100 },
    { id: "b4", cat: "Баннеры", title: "VK/TikTok баннер", desc: "Для соцсетей нового поколения", img: "https://picsum.photos/seed/rsb4/800/220", tags: ["vk", "tiktok"], popular: false, views: 410 },
    { id: "l1", cat: "Логотипы", title: "Gaming лого eSports", desc: "Победные символы для команд", img: "https://picsum.photos/seed/rsl1/400/400", tags: ["game", "esports", "logo"], popular: true, views: 4200 },
    { id: "l2", cat: "Логотипы", title: "Минимал лого", desc: "Современный геометрический бренд", img: "https://picsum.photos/seed/rsl2/400/400", tags: ["minimal", "geo", "logo"], popular: false, views: 740 },
    { id: "l3", cat: "Логотипы", title: "Неон лого", desc: "Светящийся знак в ночи", img: "https://picsum.photos/seed/rsl3/400/400", tags: ["neon", "glow", "logo"], popular: true, views: 1950 },
    { id: "l4", cat: "Логотипы", title: "3D лого PRO", desc: "Объёмный дизайн нового уровня", img: "https://picsum.photos/seed/rsl4/400/400", tags: ["3d", "volume", "logo"], popular: false, views: 580 },
    { id: "l5", cat: "Логотипы", title: "Mascot лого", desc: "Персонаж-маскот для бренда", img: "https://picsum.photos/seed/rsl5/400/400", tags: ["mascot", "character", "logo"], popular: true, views: 2800 },
  ],
  en: [
    { id: "a1", cat: "Avatars", title: "Cyberpunk Avatar", desc: "Neon glow sci-fi aesthetic", img: "https://picsum.photos/seed/rsa1/400/400", tags: ["neon", "cyber", "scifi"], popular: true, views: 1240 },
    { id: "a2", cat: "Avatars", title: "Minimal Avatar", desc: "Clean geometric minimalism", img: "https://picsum.photos/seed/rsa2/400/400", tags: ["minimal", "geo"], popular: false, views: 560 },
    { id: "a3", cat: "Avatars", title: "Dark Avatar", desc: "Moody atmospheric style", img: "https://picsum.photos/seed/rsa3/400/400", tags: ["dark", "moody"], popular: true, views: 980 },
    { id: "a4", cat: "Avatars", title: "Gradient Avatar", desc: "Smooth pastel transitions", img: "https://picsum.photos/seed/rsa4/400/400", tags: ["gradient", "soft"], popular: false, views: 430 },
    { id: "a5", cat: "Avatars", title: "Anime Avatar", desc: "Anime illustration style", img: "https://picsum.photos/seed/rsa5/400/400", tags: ["anime", "illustration"], popular: true, views: 2100 },
    { id: "a6", cat: "Avatars", title: "Pixel Avatar", desc: "Retro pixel art", img: "https://picsum.photos/seed/rsa6/400/400", tags: ["pixel", "retro"], popular: false, views: 310 },
    { id: "p1", cat: "Previews", title: "YouTube Gaming Preview", desc: "Epic gamer thumbnail design", img: "https://picsum.photos/seed/rsp1/600/340", tags: ["youtube", "game"], popular: true, views: 3400 },
    { id: "p2", cat: "Previews", title: "Twitch Preview", desc: "Streamer-focused unique design", img: "https://picsum.photos/seed/rsp2/600/340", tags: ["twitch"], popular: false, views: 780 },
    { id: "p3", cat: "Previews", title: "Viral Preview", desc: "Impossible not to click", img: "https://picsum.photos/seed/rsp3/600/340", tags: ["viral", "bright"], popular: true, views: 5600 },
    { id: "p4", cat: "Previews", title: "Minimal Preview", desc: "Elegant and clean", img: "https://picsum.photos/seed/rsp4/600/340", tags: ["minimal"], popular: false, views: 290 },
    { id: "p5", cat: "Previews", title: "Dark Preview", desc: "Dark cinematic atmosphere", img: "https://picsum.photos/seed/rsp5/600/340", tags: ["dark", "cinematic"], popular: true, views: 1870 },
    { id: "b1", cat: "Banners", title: "Twitch Banner PRO", desc: "Professional channel header", img: "https://picsum.photos/seed/rsb1/800/220", tags: ["twitch"], popular: true, views: 2200 },
    { id: "b2", cat: "Banners", title: "Discord Banner", desc: "Unique server header", img: "https://picsum.photos/seed/rsb2/800/220", tags: ["discord"], popular: false, views: 650 },
    { id: "b3", cat: "Banners", title: "YouTube Header 4K", desc: "Flawless channel art", img: "https://picsum.photos/seed/rsb3/800/220", tags: ["youtube"], popular: true, views: 3100 },
    { id: "b4", cat: "Banners", title: "VK/TikTok Banner", desc: "Next-gen social media", img: "https://picsum.photos/seed/rsb4/800/220", tags: ["tiktok"], popular: false, views: 410 },
    { id: "l1", cat: "Logos", title: "Gaming eSports Logo", desc: "Victory symbol for teams", img: "https://picsum.photos/seed/rsl1/400/400", tags: ["game", "esports"], popular: true, views: 4200 },
    { id: "l2", cat: "Logos", title: "Minimal Logo", desc: "Modern geometric brand", img: "https://picsum.photos/seed/rsl2/400/400", tags: ["minimal"], popular: false, views: 740 },
    { id: "l3", cat: "Logos", title: "Neon Logo", desc: "Glowing sign in the night", img: "https://picsum.photos/seed/rsl3/400/400", tags: ["neon"], popular: true, views: 1950 },
    { id: "l4", cat: "Logos", title: "3D Logo PRO", desc: "Next-level volumetric design", img: "https://picsum.photos/seed/rsl4/400/400", tags: ["3d"], popular: false, views: 580 },
    { id: "l5", cat: "Logos", title: "Mascot Logo", desc: "Character mascot for brand", img: "https://picsum.photos/seed/rsl5/400/400", tags: ["mascot"], popular: true, views: 2800 },
  ],
};
GALLERY.ua = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватарки", "Превью": "Прев'ю", "Баннеры": "Банери", "Логотипи": "Логотипи" }[i.cat] || i.cat }));
GALLERY.kz = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватарлар", "Превью": "Превью", "Баннеры": "Баннерлер", "Логотипы": "Логотиптер" }[i.cat] || i.cat }));
GALLERY.by = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватаркі", "Превью": "Прэв'ю", "Баннеры": "Банеры", "Логотипы": "Лагатыпы" }[i.cat] || i.cat }));

const CAT_ICONS = {
  "Аватарки": "◈", "Avatars": "◈", "Аватаркі": "◈", "Аватарлар": "◈",
  "Прев'ю": "▣", "Previews": "▣", "Превью": "▣", "Прэв'ю": "▣",
  "Баннеры": "▬", "Banners": "▬", "Банери": "▬", "Банеры": "▬", "Баннерлер": "▬",
  "Логотипы": "✦", "Logos": "✦", "Логотипи": "✦", "Лагатыпы": "✦", "Логотиптер": "✦",
};

// ── COURSES ──
const COURSES_DATA = {
  ru: [
    { id: "c1", cat: "Основы", title: "Photoshop с нуля", desc: "Полный курс базы графического дизайна", level: "Начинающий", duration: "3 ч", lessons: 12, img: "https://picsum.photos/seed/course1/600/340", popular: true, free: true, price: 0, rating: 4.9, students: 2840, topics: ["Интерфейс", "Слои", "Выделение", "Цвет", "Текст", "Фильтры", "Маски", "Смарт-объекты", "Экспорт", "Batch", "Шорткаты", "Финал"] },
    { id: "c2", cat: "Основы", title: "Теория цвета", desc: "Палитры, гармонии и психология цвета", level: "Начинающий", duration: "2 ч", lessons: 8, img: "https://picsum.photos/seed/course2/600/340", popular: true, free: true, price: 0, rating: 4.8, students: 1920, topics: ["Цветовой круг", "Тёплые/холодные", "Комплементарные", "Триады", "Психология", "Веб-палитры", "Брендинг", "Практика"] },
    { id: "c3", cat: "Продвинутый", title: "Аватарки PRO", desc: "Создавай аватары топового уровня", level: "Продвинутый", duration: "5 ч", lessons: 16, img: "https://picsum.photos/seed/course3/600/340", popular: true, free: false, price: 15, rating: 5.0, students: 680, topics: ["Тренды", "Композиция", "Свет/тень", "Неон", "Глитч", "Smoke", "3D элементы", "Текстуры", "Киберпанк", "Минимализм", "Градиент PRO", "Цветокоррекция", "Animated PFP", "Мокапы", "Портфолио", "Фриланс"] },
    { id: "c4", cat: "Продвинутый", title: "YouTube Thumbnail Master", desc: "Превью которые приносят миллионы просмотров", level: "Продвинутый", duration: "4 ч", lessons: 14, img: "https://picsum.photos/seed/course4/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 430, topics: ["Психология кликов", "Композиция", "Типографика", "Лицо", "Эмоции", "Контраст", "A/B тест", "Шаблоны", "Ниши", "Анимация", "CTR", "Тренды 2025", "Ошибки", "Проект"] },
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
  { id: 1, icon: "◈", key: "avatar", priceUSD: 5, ru: "Аватарка", en: "Avatar", ua: "Аватарка", kz: "Аватар", by: "Аватарка", descRu: "Уникальный аватар в твоём стиле", descEn: "Unique avatar in your style", timeRu: "1–2 дня", timeEn: "1–2 days", features: ["PNG + PSD", "3 правки", "Исходник"] },
  { id: 2, icon: "▣", key: "preview", priceUSD: 5, ru: "Превью", en: "Preview", ua: "Прев'ю", kz: "Превью", by: "Прэв'ю", descRu: "YouTube / Twitch превью", descEn: "YouTube / Twitch thumbnail", timeRu: "1 день", timeEn: "1 day", features: ["PNG 1280×720", "3 варианта", "PSD файл"] },
  { id: 3, icon: "▬", key: "banner", priceUSD: 5, ru: "Баннер", en: "Banner", ua: "Банер", kz: "Баннер", by: "Банер", descRu: "Шапка канала / профиля", descEn: "Channel / profile header", timeRu: "1–2 дня", timeEn: "1–2 days", features: ["PNG + PSD", "Адаптив", "3 правки"] },
  { id: 4, icon: "✦", key: "logo", priceUSD: 5, ru: "Логотип", en: "Logo", ua: "Логотип", kz: "Логотип", by: "Лагатып", descRu: "Логотип для бренда", descEn: "Logo for your brand", timeRu: "2–3 дня", timeEn: "2–3 days", features: ["SVG + PNG", "Все форматы", "5 правок"] },
  { id: 5, icon: "◉", key: "pack", priceUSD: 18, ru: "Полный пак", en: "Full Pack", ua: "Повний пак", kz: "Толық пак", by: "Поўны пак", descRu: "Аватар + превью + баннер", descEn: "Avatar + preview + banner", timeRu: "2–4 дня", timeEn: "2–4 days", features: ["3 работы", "Скидка 20%", "Приоритет"] },
];

const PROMO_CODES = {
  "RIVAL10": { discount: 10, type: "percent", desc: "-10%" },
  "FIRST20": { discount: 20, type: "percent", desc: "-20%" },
  "DESIGN5": { discount: 5, type: "flat", desc: "-$5" },
  "VIP25": { discount: 25, type: "percent", desc: "-25%" },
  "NEWUSER": { discount: 15, type: "percent", desc: "-15%" },
  "RIVAL30": { discount: 30, type: "percent", desc: "-30% VIP" },
};

const AI_IDEA_PROMPTS_RU = [
  "🎨 Аватар: киберпанк + неоновые линии, палитра #0ff/#f0f/#ff0 — эффект голограммы в стиле blade runner",
  "🌊 Превью: океанские волны + крупный белый текст, градиент синий→фиолетовый, кинематографическое освещение",
  "🔥 Баннер: магма и лава, тёплые тона оранжевый→красный, название канала шрифтом с огненным эффектом",
  "✨ Логотип: буква из стекла с преломлением света и каустиком, chromatic aberration по краям",
  "🌌 Аватар: космический скафандр, внутри стекла отражение галактики, volumetric light",
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
  "🌌 Avatar: space suit, galaxy reflection inside visor glass, volumetric light rays",
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
    { q: "📝 Как работает процесс заказа?", a: "1. Пишешь мне в Telegram\n2. Обсуждаем детали и стиль\n3. Согласуем ТЗ и сроки\n4. Предоплата 50%\n5. Выполнение за 1–3 дня\n6. Первый результат\n7. До 3 правок бесплатно\n8. Итоговый расчёт и файлы" },
    { q: "💾 Что я получу в итоге?", a: "✅ Исходники PSD/AI/AEP\n✅ PNG/JPG/SVG экспорт\n✅ 3 бесплатных правки\n✅ Поддержка после сдачи\n✅ Конфиденциальность" },
    { q: "✏️ Сколько правок включено?", a: "🔄 3 бесплатных правки\n💰 Доп. правки по договорённости\n⚡ Правки в течение суток" },
    { q: "💳 Способы оплаты?", a: "💳 Карта любой страны\n💸 CryptoBot (USDT/TON/BTC)\n💵 Схема 50% + 50%\n🔒 Безопасная сделка" },
    { q: "⚡ Срочный заказ?", a: "🔥 Срочность от 3 часов\n💸 Надбавка +20–50%\n📞 Напиши — обсудим!" },
    { q: "📁 Какие форматы файлов?", a: "📦 PNG · JPG · SVG\n🎨 PSD · AI\n🎬 AEP · GIF · MP4\n✅ Любой формат по запросу" },
    { q: "🔒 Моя работа останется конфиденциальной?", a: "🔒 Твой проект — только твой\n✅ Не публикую без разрешения\n✅ NDA по запросу" },
    { q: "🌍 Работаешь с иностранными клиентами?", a: "✅ Да, оплата в USDT/USD\n✅ Общение на русском и английском\n🌐 Нет географических ограничений" },
  ],
  en: [
    { q: "📝 How does the order process work?", a: "1. Message me on Telegram\n2. Discuss details & style\n3. Agree on brief & timeline\n4. 50% upfront payment\n5. Production in 1–3 days\n6. First delivery\n7. Up to 3 free revisions\n8. Final payment & files" },
    { q: "💾 What will I receive?", a: "✅ Source files PSD/AI/AEP\n✅ PNG/JPG/SVG exports\n✅ 3 free revisions\n✅ Post-delivery support\n✅ Confidentiality" },
    { q: "✏️ How many revisions?", a: "🔄 3 free revisions\n💰 Extra revisions by agreement\n⚡ Revisions within 24 hours" },
    { q: "💳 Payment methods?", a: "💳 Card from any country\n💸 CryptoBot (USDT/TON/BTC)\n💵 50% + 50% scheme\n🔒 Secure transaction" },
    { q: "⚡ Urgent orders?", a: "🔥 Rush from 3 hours\n💸 +20–50% surcharge\n📞 Write me — let's discuss!" },
    { q: "📁 What file formats?", a: "📦 PNG · JPG · SVG\n🎨 PSD · AI\n🎬 AEP · GIF · MP4\n✅ Any format on request" },
    { q: "🔒 Confidentiality?", a: "🔒 Your project stays private\n✅ No publishing without permission\n✅ NDA available" },
    { q: "🌍 Working with international clients?", a: "✅ Yes, payment in USDT/USD\n✅ Communication in English & Russian\n🌐 No geographic limits" },
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
    appName: "Rival Space", homeHero: "Создаю визуалы мирового уровня",
    homeSub: "Аватарки · Превью · Баннеры · Логотипы",
    stats: [{ v: "50+", l: "Проектов" }, { v: "19+", l: "Клиентов" }, { v: "1+", l: "Год опыта" }, { v: "5★", l: "Рейтинг" }],
    navHome: "Главная", navGallery: "Галерея", navCourses: "Курсы", navFreePack: "Бесплатный пак", navPricing: "Прайс", navMore: "Ещё",
    galleryTitle: "Портфолио", gallerySearch: "Поиск...",
    reviewsTitle: "Отзывы", pricingTitle: "Прайс-лист",
    cartTitle: "Корзина", addCart: "В корзину", clearCart: "Очистить",
    orderBtn: "Заказать", discount: "Скидка 10%", finalPrice: "Итого",
    aboutTitle: "Обо мне",
    aboutText: "Я Rival — графический дизайнер с опытом более года.\n\nСпециализируюсь на создании визуальной идентичности для контент-мейкеров, стримеров и брендов.\n\nКаждая работа — это уникальный проект, созданный под твои цели и аудиторию.",
    faqTitle: "FAQ", aiTitle: "AI Studio", aiSub: "Генератор уникальных идей для дизайна",
    aiBtn: "✨ Генерировать идею", aiLoading: "AI думает...", aiEmpty: "Нажми кнопку для первой идеи",
    aiHist: "История идей", settingsTitle: "Настройки", settingsTheme: "Тема",
    settingsLang: "Язык", settingsSound: "Звук", settingsVol: "Громкость",
    pricingHint: "Цены в {cur} · 1$ = {rate} {cur}", discountNote: "🎁 Скидка 10% при заказе 2+ позиций",
    orderAll: "Заказать всё", quantityLabel: "шт", toTelegram: "Написать в Telegram",
    copied: "Скопировано!", filterAll: "Все", popular: "Популярное",
    zoomHint: "Нажми для просмотра", reviewSearch: "Поиск по отзывам...", allRatings: "Все",
    coursesTitle: "Курсы и обучение", courseSub: "Прокачай навыки дизайна",
    courseStart: "Начать обучение", courseFree: "Бесплатно", courseLessons: "уроков",
    courseProgress: "Прогресс", courseTopics: "Программа курса",
    quizTitle: "Дизайн-викторина", quizScore: "Счёт", quizCorrect: "Правильно! ✓",
    quizWrong: "Неверно ✗", quizResult: "Результат",
    streakTitle: "Дней подряд", xpTitle: "Опыт", levelTitle: "Уровень",
    promoPlaceholder: "Промокод...", promoApply: "Применить",
    promoSuccess: "Промокод применён!", promoError: "Неверный промокод",
    calcTitle: "Калькулятор", calcComplex: "Сложность", calcUrgent: "Срочность", calcTotal: "Итого",
    sortPop: "Популярные", sortNew: "Новые", sortAlpha: "А–Я",
    achievements: "Достижения", achieveNew: "Новое достижение!",
    viewsLabel: "просмотров", studentsLabel: "студентов",
    onlineStatus: "ОНЛАЙН · ГОТОВ К ЗАКАЗАМ",
    orderConfirm: "Заказ отправлен!", addedToWishlist: "Добавлено в избранное",
    removedFromWishlist: "Удалено из избранного",
    deliveryTime: "Срок: ", includes: "Включено:",
    packageDeal: "Выгодный пакет", savePercent: "экономия",
  },
  en: {
    appName: "Rival Space", homeHero: "Creating world-class visuals",
    homeSub: "Avatars · Previews · Banners · Logos",
    stats: [{ v: "50+", l: "Projects" }, { v: "19+", l: "Clients" }, { v: "1+", l: "Yr exp." }, { v: "5★", l: "Rating" }],
    navHome: "Home", navGallery: "Gallery", navCourses: "Courses", navFreePack: "Free Pack", navPricing: "Pricing", navMore: "More",
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
    quizTitle: "Design Quiz", quizScore: "Score", quizCorrect: "Correct! ✓",
    quizWrong: "Wrong ✗", quizResult: "Result",
    streakTitle: "Day Streak", xpTitle: "Experience", levelTitle: "Level",
    promoPlaceholder: "Promo code...", promoApply: "Apply",
    promoSuccess: "Promo applied!", promoError: "Invalid code",
    calcTitle: "Calculator", calcComplex: "Complexity", calcUrgent: "Urgency", calcTotal: "Total",
    sortPop: "Popular", sortNew: "Newest", sortAlpha: "A–Z",
    achievements: "Achievements", achieveNew: "New Achievement!",
    viewsLabel: "views", studentsLabel: "students",
    onlineStatus: "ONLINE · READY FOR ORDERS",
    orderConfirm: "Order sent!", addedToWishlist: "Added to wishlist",
    removedFromWishlist: "Removed from wishlist",
    deliveryTime: "Time: ", includes: "Includes:",
    packageDeal: "Best deal", savePercent: "savings",
  },
};
T.ua = { ...T.ru, appName: "Rival Space", homeHero: "Створюю візуали світового рівня", navHome: "Головна", navGallery: "Галерея", navCourses: "Курси", navFreePack: "Безкоштовний пак", navPricing: "Прайс", navMore: "Ще", galleryTitle: "Портфоліо", addCart: "У кошик", orderBtn: "Замовити", coursesTitle: "Курси", toTelegram: "Telegram" };
T.kz = { ...T.ru, appName: "Rival Space", homeHero: "Әлемдік деңгейдегі визуалдар", navHome: "Басты", navGallery: "Галерея", navCourses: "Курстар", navFreePack: "Тегін пак", navPricing: "Прайс", navMore: "Көбірек", galleryTitle: "Портфолио", addCart: "Себетке", orderBtn: "Тапсыру", coursesTitle: "Курстар", toTelegram: "Telegram" };
T.by = { ...T.ru, appName: "Rival Space", homeHero: "Стварую візуалы сусветнага ўзроўню", navHome: "Галоўная", navGallery: "Галерэя", navCourses: "Курсы", navFreePack: "Бясплатны пак", navPricing: "Прайс", navMore: "Яшчэ", galleryTitle: "Партфоліа", addCart: "У кошык", orderBtn: "Замовіць", coursesTitle: "Курсы", toTelegram: "Telegram" };

// ── HELPERS ──
const ls = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const openTg = (path, msg = "") => window.open(`https://t.me/${path}${msg ? "?text=" + encodeURIComponent(msg) : ""}`, "_blank");
function getGreeting(lang) {
  const h = new Date().getHours();
  const g = h < 6 ? "🌙" : h < 12 ? "🌅" : h < 18 ? "☀️" : "🌆";
  const map = {
    ru: [g + " Доброй ночи", g + " Доброе утро", g + " Добрый день", g + " Добрый вечер"],
    en: [g + " Good night", g + " Good morning", g + " Good afternoon", g + " Good evening"],
    ua: [g + " Доброї ночі", g + " Доброго ранку", g + " Добрий день", g + " Добрий вечір"],
    kz: [g + " Жақсы түн", g + " Қайырлы таң", g + " Жақсы күн", g + " Жақсы кеш"],
    by: [g + " Добрай ночы", g + " Добры раніцы", g + " Добры дзень", g + " Добры вечар"],
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
function MeshBg({ th }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: th.mesh,
      animation: "meshAnim 15s ease-in-out infinite alternate",
    }} />
  );
}

// ── CONFETTI ──
function Confetti({ active, accent }) {
  const canRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: -10,
      vx: (Math.random() - 0.5) * 5, vy: Math.random() * 5 + 2,
      rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 10,
      w: Math.random() * 12 + 4, h: Math.random() * 7 + 3,
      color: [accent, "#fff", "#fbbf24", "#f472b6", "#34d399", "#60a5fa"][Math.floor(Math.random() * 6)],
      life: 1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.life -= 0.007;
        if (p.life > 0 && p.y < canvas.height) {
          alive = true;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
          ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });
      if (alive) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active, accent]);
  return <canvas ref={canRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }} />;
}

// ── TOAST ──
function Toast({ msg, type, th }) {
  const colors = { success: "#10b981", error: "#ef4444", info: th.accent, warning: "#f59e0b" };
  return (
    <div style={{
      padding: "11px 20px", borderRadius: 16, fontSize: 13, fontWeight: 700,
      color: "#fff", textAlign: "center",
      background: colors[type] || colors.info,
      boxShadow: `0 8px 24px rgba(0,0,0,.4)`,
      animation: "toastIn .35s cubic-bezier(.175,.885,.32,1.275) both",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,.15)",
    }}>{msg}</div>
  );
}
function ToastSystem({ toasts, th }) {
  return (
    <div style={{ position: "fixed", top: isTg ? 8 : 16, left: "50%", transform: "translateX(-50%)", zIndex: 9998, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none", width: "min(360px,90vw)" }}>
      {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} th={th} />)}
    </div>
  );
}

// ── ACHIEVEMENT POPUP ──
function AchievementPopup({ achievement, th, onClose }) {
  useEffect(() => {
    SFX.achievement();
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
      zIndex: 9997, width: "min(340px,88vw)",
      background: th.card, border: `1px solid ${th.accent}50`,
      borderRadius: 20, padding: "14px 18px",
      boxShadow: `0 16px 48px rgba(0,0,0,.5), 0 0 40px ${th.glow}`,
      display: "flex", alignItems: "center", gap: 14,
      animation: "achieveIn .5s cubic-bezier(.175,.885,.32,1.275) both",
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: th.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, boxShadow: th.shadow }}>
        {achievement.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: th.accent, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 2 }}>🏆 Новое достижение!</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: th.text }}>{achievement.title}</div>
        <div style={{ fontSize: 11, color: th.sub }}>{achievement.desc} · +{achievement.xp} XP</div>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ──
const NAV_ITEMS = [
  { id: "home", icon: "⌂", label: "navHome" },
  { id: "gallery", icon: "◈", label: "navGallery" },
  { id: "courses", icon: "📚", label: "navCourses" },
  { id: "freepack", icon: "🎁", label: "navFreePack" },
  { id: "pricing", icon: "◉", label: "navPricing" },
  { id: "more", icon: "⋮", label: "navMore" },
];
function BottomNav({ active, onChange, th, t, cartCount }) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "min(480px,100%)", zIndex: 200, background: th.nav,
      borderTop: `1px solid ${th.border}`,
      display: "grid", gridTemplateColumns: "repeat(6,1fr)",
      padding: `6px 0 calc(16px + env(safe-area-inset-bottom,0px))`,
      backdropFilter: "blur(20px)",
    }}>
      {NAV_ITEMS.map(n => {
        const isActive = active === n.id;
        return (
          <button key={n.id} onClick={() => { SFX.tab(); onChange(n.id); }} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            border: "none", background: "none", cursor: "pointer", padding: "4px 0", position: "relative",
          }}>
            <span style={{
              fontSize: 20, color: isActive ? th.accent : th.sub,
              filter: isActive ? `drop-shadow(0 0 8px ${th.accent})` : "none",
              transform: isActive ? "scale(1.3)" : "scale(1)",
              transition: "all .3s cubic-bezier(.175,.885,.32,1.275)",
            }}>{n.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: isActive ? th.accent : th.sub, letterSpacing: ".03em" }}>{t[n.label]}</span>
            {n.id === "pricing" && cartCount > 0 && (
              <span style={{ position: "absolute", top: 0, right: "14%", width: 17, height: 17, borderRadius: 999, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", animation: "ping .6s ease" }}>{cartCount}</span>
            )}
            {isActive && <div style={{ position: "absolute", bottom: -6, width: 28, height: 3, borderRadius: 999, background: th.accent, boxShadow: `0 0 10px ${th.accent}` }} />}
          </button>
        );
      })}
    </nav>
  );
}

// ── SIDE DRAWER ──
function SideDrawer({ open, onClose, th, t, theme, setTheme, lang, setLang, soundOn, setSoundOn, volume, setVolume, streak }) {
  useEffect(() => {
    if (open) SFX.drawer();
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  const level = getLevel(streak.xp);
  const prog = getLevelProgress(streak.xp);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 300, backdropFilter: "blur(6px)", animation: "fadeIn .25s ease" }} />
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: "82vw", maxWidth: 340,
        background: th.nav, borderRight: `1px solid ${th.border}`, zIndex: 301,
        display: "flex", flexDirection: "column", animation: "drawerSlide .3s cubic-bezier(.4,0,.2,1) both",
        overflowY: "auto", WebkitOverflowScrolling: "touch",
      }}>
        {/* Profile */}
        <div style={{ background: th.grad, padding: "24px 20px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
          <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 12, border: "2px solid rgba(255,255,255,.4)" }}>
            {tgUser?.first_name?.[0] || "✦"}
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{tgUser?.first_name || "Designer"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.75)", marginBottom: 14 }}>LVL {level} · {streak.xp} XP</div>
          <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,.25)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${prog * 100}%`, borderRadius: 999, background: "#fff", transition: "width .5s ease" }} />
          </div>
        </div>
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Theme */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: th.sub, marginBottom: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>{t.settingsTheme}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.values(THEMES).map(th2 => (
                <button key={th2.id} onClick={() => { SFX.theme(); setTheme(th2); ls.set("rs_theme4", th2.id); }} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                  borderRadius: 14, border: `1px solid ${theme.id === th2.id ? th.accent : th.border}`,
                  background: theme.id === th2.id ? th.accent + "22" : "transparent", cursor: "pointer",
                }}>
                  <span style={{ fontSize: 16 }}>{th2.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: theme.id === th2.id ? th.accent : th.text }}>{th2.label}</span>
                  {theme.id === th2.id && <span style={{ marginLeft: "auto", color: th.accent, fontSize: 14 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
          {/* Language */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: th.sub, marginBottom: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>{t.settingsLang}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(LANGS).map(([code, l]) => (
                <button key={code} onClick={() => { SFX.lang(); setLang(code); ls.set("rs_lang4", code); }} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                  borderRadius: 12, border: `1px solid ${lang === code ? th.accent : th.border}`,
                  background: lang === code ? th.accent + "18" : "transparent", cursor: "pointer",
                }}>
                  <span style={{ fontSize: 18 }}>{l.flag}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: lang === code ? th.accent : th.text }}>{l.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: th.sub }}>{l.cur}</span>
                  {lang === code && <span style={{ color: th.accent, fontWeight: 800, fontSize: 14 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
          {/* Sound */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: th.sub, marginBottom: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>{t.settingsSound}</div>
            <button onClick={() => { const n = !soundOn; setSoundOn(n); _soundEnabled = n; ls.set("rs_sound4", n); SFX.toggle(); }} style={{
              width: "100%", padding: "12px", borderRadius: 12,
              border: `1px solid ${soundOn ? th.accent : th.border}`,
              background: soundOn ? th.grad : "transparent",
              cursor: "pointer", color: soundOn ? th.btnTxt : th.sub, fontWeight: 800, fontSize: 13, marginBottom: 12,
            }}>{soundOn ? "🔊 Звук ВКЛ" : "🔇 Звук ВЫКЛ"}</button>
            <div style={{ fontSize: 12, color: th.sub, marginBottom: 8 }}>{t.settingsVol}: {Math.round(volume * 100)}%</div>
            <input type="range" min={0} max={1} step={0.05} value={volume} onChange={e => { const v = +e.target.value; setVolume(v); _volume = v; ls.set("rs_volume4", v); }} style={{ width: "100%", accentColor: th.accent }} />
          </div>
          {/* Footer */}
          <div style={{ padding: "16px", borderRadius: 16, border: `1px solid ${th.border}`, background: th.surface, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>✦</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: th.text }}>Rival Space</div>
            <div style={{ fontSize: 11, color: th.sub, marginTop: 2 }}>v4.0 Ultra · {isTg ? "Telegram Mini App" : "Web"}</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── SKELETON ──
function Skeleton({ w = "100%", h = 16, r = 8, th }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: th.border, animation: "shimmer 1.5s ease infinite" }} />;
}

// ── HOME TAB ──
function HomeTab({ th, t, lang, onGoGallery, onGoCourses, onGoPricing, onGoMore, cartCount, streak, onUnlockAchieve }) {
  const items = (GALLERY[lang] || GALLERY.ru).filter(i => i.popular);

  const level = getLevel(streak.xp);
  const levelProg = getLevelProgress(streak.xp);
  const nextLevelXP = getLevelXP(level + 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", background: th.surface, borderRadius: 28, border: `1px solid ${th.border}`, padding: "28px 22px 24px", boxShadow: th.shadow }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle,${th.accent}30,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle,${th.accent}15,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "#10b98122", border: "1px solid #10b98140", marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 8px #10b981", animation: "ping 1.5s ease infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", letterSpacing: ".05em" }}>{t.onlineStatus}</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <TypewriterText 
              texts={[
                "Создаю стильные визуалы",
                "Дизайн для YouTube",
                "Аватарки и превью",
                "Логотипы и баннеры",
                "Делаю твой бренд ярче"
              ]} 
              theme={th} 
            />
          </div>
          <div style={{ fontSize: 13, color: th.sub, marginBottom: 22, lineHeight: 1.5 }}>{t.homeSub}</div>
          <button onClick={() => { SFX.order(); openTg("Rivaldsg", "Привет! Хочу заказать дизайн"); }} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: th.grad, color: th.btnTxt, border: "none",
            borderRadius: 16, padding: "14px 24px", fontSize: 14, fontWeight: 900,
            cursor: "pointer", boxShadow: th.shadow, letterSpacing: ".02em",
          }}>
            <span>✈</span> {t.toTelegram}
          </button>
        </div>
      </div>

      {/* Unified Stats Card - Минималистичный дизайн */}
      <div style={{ background: th.card, borderRadius: 20, border: `1px solid ${th.border}`, padding: "20px 18px", animation: "cardIn .4s ease both" }}>
        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
          {[
            { emoji: "🔥", val: streak.count, lab: t.streakTitle, color: "#f97316" },
            { emoji: "⚡", val: streak.xp, lab: t.xpTitle, color: th.accent },
            { emoji: "🏆", val: level, lab: t.levelTitle, color: "#fbbf24" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: th.sub, fontWeight: 700, marginTop: 2 }}>{s.lab}</div>
            </div>
          ))}
        </div>
        
        {/* XP Progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: th.text }}>LVL {level} → LVL {level + 1}</span>
            <span style={{ fontSize: 10, color: th.accent, fontWeight: 700 }}>{streak.xp} / {nextLevelXP} XP</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: th.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${levelProg * 100}%`, borderRadius: 999, background: th.grad, transition: "width .6s ease", boxShadow: `0 0 8px ${th.glow}` }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        {t.stats.map((s, i) => (
          <div key={i} style={{ background: th.card, borderRadius: 16, border: `1px solid ${th.border}`, padding: "14px 8px", textAlign: "center", animation: `cardIn .4s ease ${i * .07}s both` }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: th.accent }}>{s.v}</div>
            <div style={{ fontSize: 10, color: th.sub, marginTop: 3, fontWeight: 700, lineHeight: 1.2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { icon: "◈", label: t.navGallery, sub: "20+ работ", color: th.accent, action: onGoGallery },
          { icon: "📚", label: t.navCourses, sub: "8 курсов", color: "#f472b6", action: onGoCourses },
          { icon: "◉", label: t.navPricing, sub: "от $5", color: "#fbbf24", action: onGoPricing },
          { icon: "✦", label: t.navMore, sub: "FAQ · AI", color: "#34d399", action: onGoMore },
        ].map((a, i) => (
          <button key={i} onClick={() => { SFX.tab(); a.action(); }} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "16px",
            borderRadius: 20, border: `1px solid ${th.border}`, background: th.card, cursor: "pointer",
            animation: `cardIn .4s ease ${i * .07 + .1}s both`, textAlign: "left",
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${a.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: a.color, flexShrink: 0 }}>{a.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: th.text }}>{a.label}</div>
              <div style={{ fontSize: 11, color: th.sub, marginTop: 2 }}>{a.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Popular Gallery Swiper */}
      <div style={{ background: th.card, borderRadius: 22, border: `1px solid ${th.border}`, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: th.text }}>{t.popular}</div>
            <div style={{ fontSize: 11, color: th.sub }}>{items.length} работ</div>
          </div>
          <button onClick={onGoGallery} style={{ fontSize: 13, color: th.accent, background: th.accent + "18", border: `1px solid ${th.accent}40`, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontWeight: 700 }}>Все →</button>
        </div>
        <Swiper spaceBetween={10} slidesPerView="auto" style={{ padding: "0 16px 16px" }}>
          {items.map((item, i) => (
            <SwiperSlide key={item.id} style={{ width: 150 }}>
              <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${th.border}`, animation: `cardIn .4s ease ${i * .06}s both` }}>
                <div style={{ position: "relative" }}>
                  <img src={item.img} alt={item.title} loading="lazy" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 6, right: 6, padding: "2px 7px", borderRadius: 999, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 9, fontWeight: 700 }}>
                    👁 {(item.views / 1000).toFixed(1)}k
                  </div>
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: th.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: th.sub, marginTop: 2 }}>{item.cat}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Social Links */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { icon: "✈", label: "Telegram", url: "https://t.me/Rivaldsg", color: "#229ED9", bg: "#229ED918" },
          { icon: "🔵", label: "VK", url: "https://vk.com/rivaldsg", color: "#4C75A3", bg: "#4C75A318" },
          { icon: "◈", label: "Behance", url: "https://behance.net/rivaldsg", color: "#1769FF", bg: "#1769FF18" },
        ].map(s => (
          <button key={s.label} onClick={() => { SFX.tap(); window.open(s.url, "_blank"); }} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px",
            borderRadius: 16, border: `1px solid ${th.border}`, background: s.bg, cursor: "pointer",
          }}>
            <span style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: s.color }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── GALLERY TAB ──
function GalleryTab({ th, t, lang, wishlist, toggleWishlist, onOpenImage }) {
  const items = GALLERY[lang] || GALLERY.ru;
  const cats = useMemo(() => ["all", ...[...new Set(items.map(i => i.cat))]], [items]);
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("pop");
  const [view, setView] = useState("grid");

  const filtered = useMemo(() => {
    let r = items.filter(i =>
      (cat === "all" || i.cat === cat) &&
      (search === "" || i.title.toLowerCase().includes(search.toLowerCase()) || i.tags.some(tg => tg.includes(search.toLowerCase())))
    );
    if (sort === "pop") r = [...r].sort((a, b) => b.views - a.views);
    if (sort === "new") r = [...r].reverse();
    if (sort === "alpha") r = [...r].sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [items, cat, search, sort]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: th.text }}>{t.galleryTitle}</div>
          <div style={{ fontSize: 12, color: th.sub }}>{filtered.length} / {items.length} работ</div>
        </div>
        <button onClick={() => { SFX.filter(); setView(v => v === "grid" ? "list" : "grid"); }} style={{ width: 38, height: 38, borderRadius: 12, border: `1px solid ${th.border}`, background: th.card, color: th.sub, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {view === "grid" ? "≡" : "⊞"}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: th.sub }}>◎</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.gallerySearch} style={{ width: "100%", padding: "11px 12px 11px 36px", borderRadius: 14, border: `1px solid ${th.border}`, background: th.card, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: th.sub, cursor: "pointer", fontSize: 16 }}>✕</button>}
      </div>

      {/* Sort */}
      <div style={{ display: "flex", gap: 6 }}>
        {[["pop", t.sortPop], ["new", t.sortNew], ["alpha", t.sortAlpha]].map(([v, l]) => (
          <button key={v} onClick={() => { SFX.filter(); setSort(v); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1px solid ${sort === v ? th.accent : th.border}`, background: sort === v ? th.accent + "22" : "transparent", color: sort === v ? th.accent : th.sub, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{l}</button>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {cats.map(c => {
          const active = cat === c;
          return (
            <button key={c} onClick={() => { setCat(c); SFX.filter(); }} style={{
              whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
              borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: active ? th.grad : "transparent", color: active ? th.btnTxt : th.sub,
              border: `1px solid ${active ? "transparent" : th.border}`, flexShrink: 0,
            }}>
              {c === "all" ? "◆" : (CAT_ICONS[c] || "◈")} {c === "all" ? t.filterAll : c}
            </button>
          );
        })}
      </div>

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: th.sub }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>◎</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Ничего не найдено</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Попробуй другой запрос</div>
        </div>
      ) : view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map((item, i) => {
            const wl = wishlist.includes(item.id);
            return (
              <div key={item.id} style={{ borderRadius: 20, overflow: "hidden", background: th.card, border: `1px solid ${th.border}`, cursor: "pointer", animation: `cardIn .35s ease ${i * .04}s both`, boxShadow: wl ? th.shadow : "none" }}>
                <div onClick={() => { onOpenImage(item); SFX.open(); }} style={{ position: "relative" }}>
                  <img src={item.img} alt={item.title} loading="lazy" style={{ width: "100%", height: 115, objectFit: "cover", display: "block" }} />
                  {item.popular && <div style={{ position: "absolute", top: 7, left: 7, padding: "2px 8px", borderRadius: 999, background: th.accent, color: th.btnTxt, fontSize: 9, fontWeight: 900 }}>★ TOP</div>}
                  <div style={{ position: "absolute", bottom: 7, right: 7, padding: "2px 7px", borderRadius: 999, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 9 }}>👁 {item.views >= 1000 ? (item.views / 1000).toFixed(1) + "k" : item.views}</div>
                </div>
                <div style={{ padding: "10px 11px 11px" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: th.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: th.sub, marginBottom: 9, marginTop: 2 }}>{item.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 9, color: th.accent, fontWeight: 700 }}>{t.zoomHint}</div>
                    <button onClick={e => { e.stopPropagation(); toggleWishlist(item.id); SFX.wishlist(); }} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${wl ? th.accent : th.border}`, background: wl ? th.accent + "22" : "transparent", color: wl ? th.accent : th.sub, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {wl ? "♥" : "♡"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((item, i) => (
            <div key={item.id} onClick={() => { onOpenImage(item); SFX.open(); }} style={{ display: "flex", gap: 12, alignItems: "center", background: th.card, borderRadius: 18, border: `1px solid ${th.border}`, padding: "10px 12px", cursor: "pointer", animation: `cardIn .3s ease ${i * .04}s both` }}>
              <img src={item.img} alt={item.title} loading="lazy" style={{ width: 68, height: 50, objectFit: "cover", borderRadius: 12, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: th.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                <div style={{ fontSize: 11, color: th.sub }}>{item.cat} · 👁 {item.views >= 1000 ? (item.views / 1000).toFixed(1) + "k" : item.views}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleWishlist(item.id); SFX.wishlist(); }} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${wishlist.includes(item.id) ? th.accent : th.border}`, background: wishlist.includes(item.id) ? th.accent + "22" : "transparent", color: wishlist.includes(item.id) ? th.accent : th.sub, cursor: "pointer", fontSize: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {wishlist.includes(item.id) ? "♥" : "♡"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── COURSES TAB ──
function CoursesTab({ th, t, lang, showToast, addXPfn, onUnlockAchieve, streak }) {
  const courses = COURSES_DATA[lang] || COURSES_DATA.ru;
  const cats = useMemo(() => ["all", ...[...new Set(courses.map(c => c.cat))]], [courses]);
  const [cat, setCat] = useState("all");
  const [selCourse, setSelCourse] = useState(null);
  const [progress, setProgress] = useState(() => ls.get("rs_course_prog4", {}));
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizStart, setQuizStart] = useState(null);
  const L = LANGS[lang] || LANGS.ru;
  const fmt = usd => usd === 0 ? t.courseFree : `${Math.round(usd * L.rate)} ${L.cur}`;
  const filtered = useMemo(() => courses.filter(c => cat === "all" || c.cat === cat), [courses, cat]);

  const completeTopic = (courseId, topicIdx, total) => {
    const newProg = { ...progress };
    if (!newProg[courseId]) newProg[courseId] = [];
    if (!newProg[courseId].includes(topicIdx)) {
      newProg[courseId] = [...newProg[courseId], topicIdx];
      addXPfn(15);
      showToast("+15 XP! ⚡", "success");
      if (newProg[courseId].length === total) {
        setTimeout(() => { SFX.levelUp(); showToast("🎓 Курс пройден! +50 XP", "success"); onUnlockAchieve("course_complete"); addXPfn(50); }, 500);
      }
    }
    setProgress(newProg);
    ls.set("rs_course_prog4", newProg);
  };

  const getCourseProgress = (courseId, total) => {
    const done = progress[courseId]?.length || 0;
    return Math.round((done / total) * 100);
  };

  const quizQ = QUIZ_DATA[quizIdx];
  const handleQuizAnswer = idx => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    const correct = idx === quizQ.correct;
    if (correct) { setQuizScore(s => s + 1); SFX.quizCorrect(); addXPfn(20); }
    else SFX.quizWrong();
    setTimeout(() => {
      if (quizIdx < QUIZ_DATA.length - 1) { setQuizIdx(i => i + 1); setQuizAnswer(null); }
      else {
        setQuizDone(true);
        const finalScore = quizScore + (correct ? 1 : 0);
        const today = new Date().toISOString().split('T')[0];
        setStreak(prev => ({ ...prev, totalQuizCorrect: prev.totalQuizCorrect + finalScore, lastQuizDate: today }));
        ls.set("rs_streak4", { ...streak, totalQuizCorrect: streak.totalQuizCorrect + finalScore, lastQuizDate: today });
        SFX.levelUp(); addXPfn(50);
        showToast(`🏆 ${finalScore}/${QUIZ_DATA.length} · +50 XP`, "success");
        if (finalScore >= 5) onUnlockAchieve("quiz_master");
        // speed check
        if (quizStart && (Date.now() - quizStart) < 120000) onUnlockAchieve("speed_quiz");
      }
    }, 1400);
  };

  if (quizMode) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "cardIn .35s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => { setQuizMode(false); setQuizIdx(0); setQuizScore(0); setQuizAnswer(null); setQuizDone(false); SFX.close(); }} style={{ width: 38, height: 38, borderRadius: 12, border: `1px solid ${th.border}`, background: th.card, color: th.sub, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: th.text }}>{t.quizTitle}</div>
          </div>
        </div>
        <div style={{ height: 5, borderRadius: 999, background: th.border, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((quizIdx + (quizDone ? 1 : 0)) / QUIZ_DATA.length) * 100}%`, borderRadius: 999, background: th.grad, transition: "width .35s ease" }} />
        </div>
        {quizDone ? (
          <div style={{ textAlign: "center", padding: "40px 20px", animation: "cardIn .35s ease both" }}>
            <div style={{ fontSize: 70, marginBottom: 16 }}>🏆</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: th.text, marginBottom: 8 }}>Результат!</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: th.accent, marginBottom: 6 }}>✅</div>
            <div style={{ fontSize: 14, color: th.sub, marginBottom: 24 }}>{quizScore >= 7 ? "🔥 Отлично!" : quizScore >= 5 ? "👍 Хорошо!" : "📚 Учись дальше!"}</div>
            <button onClick={() => { setQuizMode(false); setQuizIdx(0); setQuizScore(0); setQuizAnswer(null); setQuizDone(false); }} style={{ background: th.grad, color: th.btnTxt, border: "none", borderRadius: 16, padding: "14px 32px", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: th.shadow }}>Готово</button>
          </div>
        ) : (
          <div style={{ background: th.card, borderRadius: 24, border: `1px solid ${th.border}`, padding: "24px", animation: "cardIn .3s ease both" }}>
            <div style={{ fontSize: 11, color: th.sub, fontWeight: 800, marginBottom: 14, textTransform: "uppercase", letterSpacing: ".06em" }}>Вопрос {quizIdx + 1} из {QUIZ_DATA.length}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: th.text, marginBottom: 22, lineHeight: 1.5 }}>{quizQ.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quizQ.opts.map((opt, i) => {
                let bg = "transparent", brd = th.border, clr = th.text, icon = "";
                if (quizAnswer !== null) {
                  if (i === quizQ.correct) { bg = "#10b98118"; brd = "#10b981"; clr = "#10b981"; icon = " ✓"; }
                  else if (i === quizAnswer) { bg = "#ef444418"; brd = "#ef4444"; clr = "#ef4444"; icon = " ✗"; }
                }
                return (
                  <button key={i} onClick={() => handleQuizAnswer(i)} style={{ padding: "14px 16px", borderRadius: 14, border: `1px solid ${brd}`, background: bg, color: clr, cursor: quizAnswer !== null ? "default" : "pointer", fontSize: 14, fontWeight: 600, textAlign: "left", transition: "all .2s" }}>
                    {opt}{icon}
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 12, background: th.surface, border: `1px solid ${th.border}`, fontSize: 12, color: th.sub, animation: "fadeDown .2s ease" }}>
                💡 {quizQ.exp}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (selCourse) {
    const prog = getCourseProgress(selCourse.id, selCourse.topics.length);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "cardIn .35s ease both" }}>
        <button onClick={() => { setSelCourse(null); SFX.close(); }} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${th.border}`, background: th.card, color: th.sub, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>← {t.coursesTitle}</button>
        <div style={{ position: "relative" }}>
          <img src={selCourse.img} alt={selCourse.title} style={{ width: "100%", borderRadius: 22, height: 190, objectFit: "cover" }} />
          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
            {selCourse.popular && <span style={{ padding: "3px 10px", borderRadius: 999, background: th.accent, color: th.btnTxt, fontSize: 9, fontWeight: 900 }}>★ TOP</span>}
            <span style={{ padding: "3px 10px", borderRadius: 999, background: selCourse.free ? "#10b981" : "#fbbf24", color: selCourse.free ? "#fff" : "#000", fontSize: 9, fontWeight: 900 }}>{fmt(selCourse.price)}</span>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ padding: "4px 10px", borderRadius: 999, background: th.accent + "22", color: th.accent, fontSize: 11, fontWeight: 700 }}>{selCourse.level}</span>
            <span style={{ padding: "4px 10px", borderRadius: 999, background: th.surface, color: th.sub, fontSize: 11, fontWeight: 700 }}>⏱ {selCourse.duration}</span>
            <span style={{ padding: "4px 10px", borderRadius: 999, background: th.surface, color: th.sub, fontSize: 11, fontWeight: 700 }}>📚 {selCourse.lessons} {t.courseLessons}</span>
            <span style={{ padding: "4px 10px", borderRadius: 999, background: "#fbbf2420", color: "#fbbf24", fontSize: 11, fontWeight: 700 }}>⭐ {selCourse.rating}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: th.text, marginBottom: 6 }}>{selCourse.title}</div>
          <div style={{ fontSize: 13, color: th.sub, lineHeight: 1.6, marginBottom: 4 }}>{selCourse.desc}</div>
          <div style={{ fontSize: 11, color: th.sub }}>👥 {selCourse.students.toLocaleString()} {t.studentsLabel}</div>
        </div>
        <div style={{ background: th.card, borderRadius: 16, border: `1px solid ${th.border}`, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: th.text }}>{t.courseProgress}</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: th.accent }}>{prog}%</span>
          </div>
          <div style={{ height: 7, borderRadius: 999, background: th.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${prog}%`, borderRadius: 999, background: th.grad, transition: "width .6s ease", boxShadow: `0 0 8px ${th.glow}` }} />
          </div>
          {prog === 100 && <div style={{ marginTop: 8, fontSize: 12, color: "#10b981", fontWeight: 800 }}>✓ Курс пройден!</div>}
        </div>
        <div style={{ fontSize: 15, fontWeight: 900, color: th.text }}>{t.courseTopics}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {selCourse.topics.map((topic, i) => {
            const done = progress[selCourse.id]?.includes(i);
            return (
              <div key={i} onClick={() => completeTopic(selCourse.id, i, selCourse.topics.length)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 14, border: `1px solid ${done ? th.accent + "40" : th.border}`, background: done ? th.accent + "10" : th.card, cursor: "pointer", animation: `cardIn .3s ease ${i * .02}s both`, transition: "all .2s" }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: done ? th.grad : th.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: done ? th.btnTxt : th.sub, fontWeight: 900, flexShrink: 0, boxShadow: done ? th.shadow : "none" }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: done ? th.accent : th.text, flex: 1 }}>{topic}</span>
                {done && <span style={{ fontSize: 10, color: th.accent, fontWeight: 800 }}>+15 XP</span>}
              </div>
            );
          })}
        </div>
        {!selCourse.free && (
          <button onClick={() => { SFX.order(); openTg("Rivaldsg", `Хочу курс: ${selCourse.title}`); }} style={{ background: th.grad, color: th.btnTxt, border: "none", borderRadius: 18, padding: "16px", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: th.shadow }}>
            ✈ {t.orderBtn} — {fmt(selCourse.price)}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: th.text }}>{t.coursesTitle}</div>
        <div style={{ fontSize: 12, color: th.sub, marginTop: 2 }}>{t.courseSub}</div>
      </div>
      {/* Quiz Banner */}
      <div onClick={() => { 
        const today = new Date().toISOString().split('T')[0];
        if (streak.lastQuizDate === today) {
          SFX.error();
          return;
        }
        setQuizMode(true); 
        setQuizStart(Date.now()); 
        SFX.quiz(); 
        addXPfn(5); 
      }} style={{ 
        background: streak.lastQuizDate === new Date().toISOString().split('T')[0] ? th.surface : th.grad, 
        borderRadius: 22, 
        padding: "18px 20px", 
        cursor: streak.lastQuizDate === new Date().toISOString().split('T')[0] ? "not-allowed" : "pointer", 
        boxShadow: th.shadow, 
        display: "flex", 
        alignItems: "center", 
        gap: 14,
        opacity: streak.lastQuizDate === new Date().toISOString().split('T')[0] ? 0.6 : 1,
        transition: "all 0.3s ease"
      }}>
        <div style={{ fontSize: 40 }}>🧠</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: th.btnTxt }}>
            {streak.lastQuizDate === new Date().toISOString().split('T')[0] ? "✅ Викторина пройдена" : t.quizTitle}
          </div>
          <div style={{ fontSize: 12, color: th.btnTxt + "bb", marginTop: 2 }}>
            {streak.lastQuizDate === new Date().toISOString().split('T')[0] ? "Возвращайся завтра!" : QUIZ_DATA.length + " вопросов · +XP за каждый ответ"}
          </div>
        </div>
        <span style={{ fontSize: 22, color: th.btnTxt }}>→</span>
      </div>
      {/* Category Filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {cats.map(c => (
          <button key={c} onClick={() => { setCat(c); SFX.filter(); }} style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer", background: cat === c ? th.grad : "transparent", color: cat === c ? th.btnTxt : th.sub, border: `1px solid ${cat === c ? "transparent" : th.border}`, flexShrink: 0 }}>
            {c === "all" ? t.filterAll : c}
          </button>
        ))}
      </div>
      {/* Course List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((course, i) => {
          const prog = getCourseProgress(course.id, course.topics.length);
          return (
            <div key={course.id} onClick={() => { setSelCourse(course); SFX.course(); addXPfn(3); }} style={{ background: th.card, borderRadius: 22, border: `1px solid ${th.border}`, overflow: "hidden", cursor: "pointer", animation: `cardIn .35s ease ${i * .05}s both` }}>
              <div style={{ position: "relative" }}>
                <img src={course.img} alt={course.title} loading="lazy" style={{ width: "100%", height: 145, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
                  {course.popular && <span style={{ padding: "3px 8px", borderRadius: 999, background: th.accent, color: th.btnTxt, fontSize: 9, fontWeight: 900 }}>★ TOP</span>}
                  <span style={{ padding: "3px 8px", borderRadius: 999, background: course.free ? "#10b981" : "#fbbf24", color: course.free ? "#fff" : "#000", fontSize: 9, fontWeight: 900 }}>{fmt(course.price)}</span>
                </div>
                {prog > 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(0,0,0,.4)" }}><div style={{ height: "100%", width: `${prog}%`, background: th.grad }} /></div>}
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: th.text, marginBottom: 4 }}>{course.title}</div>
                <div style={{ fontSize: 12, color: th.sub, marginBottom: 10, lineHeight: 1.5 }}>{course.desc}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: th.accent, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: th.accent + "18" }}>{course.level}</span>
                  <span style={{ fontSize: 10, color: th.sub }}>⏱ {course.duration}</span>
                  <span style={{ fontSize: 10, color: th.sub }}>📚 {course.lessons} {t.courseLessons}</span>
                  <span style={{ fontSize: 10, color: "#fbbf24" }}>⭐ {course.rating}</span>
                  <span style={{ fontSize: 10, color: th.sub, marginLeft: "auto" }}>👥 {course.students.toLocaleString()}</span>
                </div>
                {prog > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: th.sub, fontWeight: 600 }}>{t.courseProgress}</span>
                      <span style={{ fontSize: 10, color: th.accent, fontWeight: 700 }}>{prog}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: th.border, overflow: "hidden" }}><div style={{ height: "100%", width: `${prog}%`, background: th.grad }} /></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PRICING TAB ──
function PricingTab({ th, t, lang, cart, addToCart, removeFromCart, updateQty, clearCart, showToast, onUnlockAchieve }) {
  const L = LANGS[lang] || LANGS.ru;
  const fmt = usd => `${Math.round(usd * L.rate)} ${L.cur}`;
  const [promo, setPromo] = useState("");
  const [promoDisc, setPromoDisc] = useState(0);
  const [promoInfo, setPromoInfo] = useState(null);
  const [calcComplexity, setCalcComplexity] = useState(1);
  const [calcUrgent, setCalcUrgent] = useState(1);
  const [calcItems, setCalcItems] = useState(["avatar"]);

  const applyPromo = () => {
    const code = PROMO_CODES[promo.toUpperCase()];
    if (code) { setPromoDisc(code.discount); setPromoInfo(code); SFX.promo(); showToast(`${t.promoSuccess} ${code.desc}`, "success"); }
    else { SFX.error(); showToast(t.promoError, "error"); }
  };

  const cartTotal = useMemo(() => {
    const sub = cart.reduce((s, i) => s + i.priceUSD * i.qty, 0);
    const items = cart.reduce((s, i) => s + i.qty, 0);
    
    // Расчет скидки за количество (10% от СУММЫ при 2+ товарах)
    const bulkDisc = items >= 2 ? sub * 0.1 : 0;
    
    // Расчет скидки по промокоду (от ИСХОДНОЙ СУММЫ, не от суммы после скидки)
    let promoDiscAmount = 0;
    if (promoDisc > 0 && promoInfo) {
      if (promoInfo.type === "percent") {
        promoDiscAmount = sub * (promoDisc / 100);
      } else {
        promoDiscAmount = promoDisc; // фиксированная скидка в USD
      }
    }
    
    // Общая скидка = скидка за количество + скидка по промокоду (от исходной суммы)
    const totalDisc = Math.min(bulkDisc + promoDiscAmount, sub);
    const discPercent = sub > 0 ? Math.round((totalDisc / sub) * 100) : 0;
    
    return { 
      items, 
      sub, 
      disc: totalDisc,
      bulkDisc,
      promoDisc: promoDiscAmount,
      discPercent,
      total: Math.max(sub - totalDisc, 0) 
    };
  }, [cart, promoDisc, promoInfo]);

  const calcBase = calcItems.length * 5;
  const calcTotal2 = Math.round(calcBase * calcComplexity * calcUrgent);

  const getSvcName = svc => svc[lang] || svc.en;
  const getSvcDesc = svc => lang === "en" ? svc.descEn : svc.descRu;
  const getSvcTime = svc => lang === "en" ? svc.timeEn : svc.timeRu;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: th.text }}>{t.pricingTitle}</div>
        <div style={{ fontSize: 12, color: th.sub, marginTop: 2 }}>{t.pricingHint.replace("{cur}", L.cur).replace("{rate}", L.rate).replace("{cur}", L.cur)}</div>
      </div>

      {/* Discount Notice */}
      <div style={{ padding: "11px 16px", borderRadius: 14, background: th.accent + "15", border: `1px solid ${th.accent}35`, fontSize: 12, color: th.accent, fontWeight: 700 }}>
        {t.discountNote}
      </div>

      {/* Services */}
      {SERVICES.map((svc, i) => {
        const inCart = cart.find(c => c.id === svc.id);
        const isPack = svc.key === "pack";
        return (
          <div key={svc.id} style={{
            background: th.card, borderRadius: 22, border: `1px solid ${inCart ? th.accent : isPack ? "#fbbf2450" : th.border}`,
            padding: "18px", boxShadow: inCart ? th.shadow : isPack ? "0 8px 30px rgba(251,191,36,.15)" : "none",
            animation: `cardIn .4s ease ${i * .07}s both`,
            position: "relative", overflow: "hidden",
          }}>
            {isPack && <div style={{ position: "absolute", top: 0, right: 0, background: "#fbbf24", color: "#000", fontSize: 9, fontWeight: 900, padding: "4px 12px", borderRadius: "0 0 0 12px" }}>💰 {t.packageDeal}</div>}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: th.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, boxShadow: th.shadow }}>
                {svc.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: th.text }}>{getSvcName(svc)}</div>
                <div style={{ fontSize: 12, color: th.sub, marginTop: 2, lineHeight: 1.5 }}>{getSvcDesc(svc)}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: th.sub }}>⏱ {t.deliveryTime}{getSvcTime(svc)}</span>
                </div>
                {/* Features */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {svc.features.map(f => (
                    <span key={f} style={{ fontSize: 10, color: th.accent, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: th.accent + "15", border: `1px solid ${th.accent}30` }}>✓ {f}</span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: th.accent, flexShrink: 0, textAlign: "right" }}>
                {fmt(svc.priceUSD)}
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
              {!inCart ? (
                <button onClick={() => { addToCart(svc, getSvcName(svc)); showToast(getSvcName(svc) + " → 🛒", "success"); SFX.addCart(); onUnlockAchieve("cart_order"); }} style={{ flex: 1, background: th.grad, color: th.btnTxt, border: "none", borderRadius: 14, padding: "12px", fontSize: 13, fontWeight: 900, cursor: "pointer", boxShadow: th.shadow }}>
                  {t.addCart}
                </button>
              ) : (
                <>
                  <button onClick={() => { updateQty(svc.id, inCart.qty - 1); SFX.tap(); }} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${th.border}`, background: "transparent", color: th.text, cursor: "pointer", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: th.accent }}>{inCart.qty}</div>
                    <div style={{ fontSize: 10, color: th.sub }}>{t.quantityLabel}</div>
                  </div>
                  <button onClick={() => { updateQty(svc.id, inCart.qty + 1); SFX.tap(); }} style={{ width: 40, height: 40, borderRadius: 12, border: "none", background: th.accent, color: th.btnTxt, cursor: "pointer", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  <button onClick={() => { removeFromCart(svc.id); SFX.remove(); }} style={{ width: 40, height: 40, borderRadius: 12, border: "1px solid #ef444440", background: "#ef444414", color: "#ef4444", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Promo */}
      <div style={{ background: th.card, borderRadius: 18, border: `1px solid ${th.border}`, padding: "16px" }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: th.text, marginBottom: 12 }}>🎁 Промокод</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={promo} onChange={e => setPromo(e.target.value)} placeholder={t.promoPlaceholder} style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: `1px solid ${th.border}`, background: th.surface, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: ".08em" }} />
          <button onClick={applyPromo} style={{ padding: "11px 18px", borderRadius: 12, background: th.grad, color: th.btnTxt, border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>{t.promoApply}</button>
        </div>
        {promoDisc > 0 && <div style={{ marginTop: 10, fontSize: 12, color: "#10b981", fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>✓ Применён · {promoInfo?.desc}</div>}
        {/* Hint */}
        <div style={{ marginTop: 10, fontSize: 11, color: th.sub }}>💡 Попробуй: RIVAL10, FIRST20, VIP25</div>
      </div>

      {/* Calculator */}
      <div style={{ background: th.card, borderRadius: 22, border: `1px solid ${th.border}`, padding: "18px" }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: th.text, marginBottom: 14 }}>🧮 {t.calcTitle}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {SERVICES.filter(s => s.key !== "pack").map(s => {
            const sel = calcItems.includes(s.key);
            return (
              <button key={s.key} onClick={() => { SFX.tap(); setCalcItems(prev => sel ? prev.filter(x => x !== s.key) : [...prev, s.key]); }} style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${sel ? th.accent : th.border}`, background: sel ? th.accent + "22" : "transparent", color: sel ? th.accent : th.sub, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                {s.icon} {getSvcName(s)}
              </button>
            );
          })}
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: th.sub, fontWeight: 700, marginBottom: 8 }}>{t.calcComplex}: ×{calcComplexity} {calcComplexity === 1 ? "(просто)" : calcComplexity <= 2 ? "(средне)" : "(сложно)"}</div>
          <input type="range" min={1} max={3} step={0.5} value={calcComplexity} onChange={e => setCalcComplexity(+e.target.value)} style={{ width: "100%", accentColor: th.accent }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: th.sub, fontWeight: 700, marginBottom: 8 }}>{t.calcUrgent}: ×{calcUrgent} {calcUrgent === 1 ? "(обычно)" : calcUrgent <= 1.5 ? "(быстро)" : "(срочно)"}</div>
          <input type="range" min={1} max={2} step={0.25} value={calcUrgent} onChange={e => setCalcUrgent(+e.target.value)} style={{ width: "100%", accentColor: th.accent }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 16, background: th.surface, border: `1px solid ${th.accent}40` }}>
          <div>
            <div style={{ fontSize: 12, color: th.sub, fontWeight: 600 }}>{t.calcTotal}</div>
            <div style={{ fontSize: 11, color: th.sub, marginTop: 2 }}>~{calcItems.length} позиц.</div>
          </div>
          <span style={{ fontSize: 28, fontWeight: 900, color: th.accent }}>{fmt(calcTotal2)}</span>
        </div>
        <button onClick={() => { SFX.order(); openTg("Rivaldsg", `Калькулятор: ${calcItems.join(",")} ×${calcComplexity} ×${calcUrgent} = ~${fmt(calcTotal2)}`); }} style={{ width: "100%", marginTop: 12, background: th.grad, color: th.btnTxt, border: "none", borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: th.shadow }}>
          ✈ {t.orderBtn}
        </button>
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div style={{ background: th.surface, borderRadius: 22, border: `2px solid ${th.accent}30`, padding: "20px", animation: "cardIn .3s ease both" }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: th.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🛒</span> {t.cartTitle}
            <span style={{ marginLeft: "auto", fontSize: 13, color: th.accent, fontWeight: 800 }}>{cartTotal.items} шт</span>
          </div>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "10px 12px", borderRadius: 12, background: th.card, border: `1px solid ${th.border}` }}>
              <div>
                <div style={{ fontSize: 13, color: th.text, fontWeight: 700 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: th.sub, marginTop: 2 }}>×{item.qty} · {fmt(item.priceUSD)} за шт</div>
              </div>
              <span style={{ fontSize: 15, color: th.accent, fontWeight: 900 }}>{fmt(item.priceUSD * item.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${th.border}`, marginTop: 12, paddingTop: 14 }}>
            {/* Исходная цена */}
            {cartTotal.disc > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: th.sub, fontWeight: 600 }}>Сумма</span>
                <span style={{ 
                  fontSize: 16, 
                  color: th.sub, 
                  fontWeight: 700,
                  textDecoration: "line-through",
                  opacity: 0.6
                }}>{fmt(cartTotal.sub)}</span>
              </div>
            )}
            
            {/* Детали скидок */}
            {cartTotal.disc > 0 && (
              <div style={{ 
                background: `${th.accent}10`, 
                borderRadius: 12, 
                padding: "12px 14px", 
                marginBottom: 12,
                border: `1px solid ${th.accent}30`
              }}>
                {/* Скидка за количество */}
                {cartTotal.bulkDisc > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>
                    <span>💚 Скидка за 2+ товара (10%)</span>
                    <span>−{fmt(cartTotal.bulkDisc)}</span>
                  </div>
                )}
                
                {/* Скидка по промокоду */}
                {cartTotal.promoDisc > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>
                    <span>🎁 Промокод {promoInfo?.desc}</span>
                    <span>−{fmt(cartTotal.promoDisc)}</span>
                  </div>
                )}
                
                {/* Общая скидка */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  fontSize: 13, 
                  color: th.accent, 
                  fontWeight: 900,
                  paddingTop: 8,
                  borderTop: cartTotal.bulkDisc > 0 || cartTotal.promoDisc > 0 ? `1px solid ${th.accent}20` : 'none'
                }}>
                  <span>✨ Ваша экономия ({cartTotal.discPercent}%)</span>
                  <span>−{fmt(cartTotal.disc)}</span>
                </div>
              </div>
            )}
            
            {/* Итоговая цена */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 900, marginBottom: 16, alignItems: "center" }}>
              <span style={{ color: th.text }}>{t.finalPrice}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ 
                  fontSize: 28, 
                  color: th.accent,
                  textShadow: `0 0 20px ${th.glow}`
                }}>{fmt(cartTotal.total)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { clearCart(); SFX.clear(); }} style={{ padding: "11px 16px", borderRadius: 12, border: `1px solid ${th.border}`, background: "transparent", color: th.sub, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>{t.clearCart}</button>
              <button onClick={() => { SFX.order(); const list = cart.map(i => `${i.name} ×${i.qty}`).join(", "); openTg("Rivaldsg", `Заказ: ${list}. Сумма: ${fmt(cartTotal.total)}`); }} style={{ flex: 1, background: th.grad, color: th.btnTxt, border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: th.shadow }}>
                {t.orderAll} — {fmt(cartTotal.total)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MORE TAB ──
// ── FREE PACK TAB ──
function FreePackTab({ th, t, lang }) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleClaimPack = () => {
    SFX.promo();
    openTg("Rivaldsg", "Хочу забрать бесплатный пак! 🎁");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero Section - Futuristic Dark Style */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
        borderRadius: 24,
        border: `2px solid ${th.accent}`,
        padding: "40px 24px",
        boxShadow: `0 0 40px ${th.glow}, 0 20px 60px rgba(0,0,0,0.5)`,
        animation: animate ? "cardIn .5s ease both" : "none"
      }}>
        {/* Animated Background Grid */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${th.accent}22 1px, transparent 1px),
            linear-gradient(90deg, ${th.accent}22 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          opacity: 0.3,
          animation: "shimmer 3s infinite"
        }} />

        {/* Glowing Orbs */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${th.accent}40 0%, transparent 70%)`,
          filter: "blur(60px)",
          animation: "ping 4s infinite"
        }} />
        
        <div style={{
          position: "absolute",
          bottom: "-50%",
          left: "-20%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${th.accentB}30 0%, transparent 70%)`,
          filter: "blur(50px)",
          animation: "ping 5s infinite 1s"
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Icon */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${th.accent} 0%, ${th.accentB} 100%)`,
            boxShadow: `0 0 30px ${th.glow}, 0 10px 30px rgba(0,0,0,0.3)`,
            marginBottom: 20,
            animation: "splashBounce 2s infinite"
          }}>
            <span style={{ fontSize: 40 }}>🎁</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 32,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${th.accent} 0%, ${th.hi} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 12,
            letterSpacing: "-0.02em",
            textShadow: `0 0 20px ${th.glow}`
          }}>
            {lang === "ru" ? "Эксклюзивные бонусы" : lang === "en" ? "Exclusive Bonuses" : lang === "ua" ? "Ексклюзивні бонуси" : lang === "kz" ? "Эксклюзивті бонустар" : "Эксклюзіўныя бонусы"}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 16,
            color: th.sub,
            marginBottom: 30,
            lineHeight: 1.5
          }}>
            {lang === "ru" ? "Получи бесплатный набор ресурсов для твоих проектов" : lang === "en" ? "Get a free pack of resources for your projects" : lang === "ua" ? "Отримай безкоштовний набір ресурсів для твоїх проектів" : lang === "kz" ? "Жобаларыңызға арналған тегін ресурстар жинағын алыңыз" : "Атрымай бясплатны набор рэсурсаў для тваіх праектаў"}
          </p>

          {/* Animated Button */}
          <button
            onClick={handleClaimPack}
                style={{
                  position: "relative",
                  padding: "18px 48px",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#000",
                  background: `linear-gradient(135deg, ${th.accent} 0%, ${th.hi} 100%)`,
                  border: "none",
                  borderRadius: 16,
                  cursor: "pointer",
                  boxShadow: `0 0 30px ${th.glow}, 0 10px 30px rgba(0,0,0,0.3)`,
                  overflow: "hidden",
                  transition: "all .3s ease",
                  animation: "shimmer 2s infinite"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 0 40px ${th.glow}, 0 15px 40px rgba(0,0,0,0.4)`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${th.glow}, 0 10px 30px rgba(0,0,0,0.3)`;
                }}
              >
            <span style={{ position: "relative", zIndex: 1 }}>
              🎁 {lang === "ru" ? "Забрать пак" : lang === "en" ? "Claim Pack" : lang === "ua" ? "Забрати пак" : lang === "kz" ? "Пакті алу" : "Забраць пак"}
            </span>
              
            
            {/* Button Shine Effect */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              animation: "shine 3s infinite"
            }} />
          </button>
        </div>
      </div>

      {/* Features Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { icon: "🎨", title: lang === "ru" ? "Шаблоны" : lang === "en" ? "Templates" : lang === "ua" ? "Шаблони" : lang === "kz" ? "Үлгілер" : "Шаблоны", desc: lang === "ru" ? "PSD файлы" : "PSD files" },
          { icon: "🖌️", title: lang === "ru" ? "Кисти" : lang === "en" ? "Brushes" : lang === "ua" ? "Пензлі" : lang === "kz" ? "Қылқалам" : "Пэндзлі", desc: lang === "ru" ? "Уникальные" : "Unique" },
          { icon: "🎭", title: lang === "ru" ? "Стили" : lang === "en" ? "Styles" : lang === "ua" ? "Стилі" : lang === "kz" ? "Стильдер" : "Стылі", desc: lang === "ru" ? "Эффекты" : "Effects" },
          { icon: "📐", title: lang === "ru" ? "Шрифты" : lang === "en" ? "Fonts" : lang === "ua" ? "Шрифти" : lang === "kz" ? "Қаріптер" : "Шрыфты", desc: lang === "ru" ? "Premium" : "Premium" }
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: th.card,
              border: `1px solid ${th.border}`,
              borderRadius: 16,
              padding: "20px 16px",
              textAlign: "center",
              transition: "all .3s ease",
              cursor: "pointer",
              animation: `cardIn .5s ease both ${i * 0.1}s`
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = th.accent;
              e.currentTarget.style.boxShadow = `0 8px 20px ${th.glow}`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = th.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: th.text, marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 11, color: th.sub }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Additional Animations in CSS */}
      <style>{`
        @keyframes shine {
          0%, 100% { left: -100%; }
          50% { left: 200%; }
        }
      `}</style>
    </div>
  );
}

function MoreTab({ th, t, lang, showToast, streak, onUnlockAchieve, addXPfn }) {
  const [section, setSection] = useState("about");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [aiIdea, setAiIdea] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState(() => ls.get("rs_ai_hist4", []));
  const [aiGenCount, setAiGenCount] = useState(() => ls.get("rs_ai_gen_count4", 0));
  const [likes, setLikes] = useState(() => ls.get("rs_likes4", {}));
  const [reviewSearch, setReviewSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [achievements, setAchievements] = useState(() => ls.get("rs_achievements4", []));

  const faq = FAQ_DATA[lang] || FAQ_DATA.ru;
  const ideasPool = lang === "en" ? AI_IDEA_PROMPTS_EN : AI_IDEA_PROMPTS_RU;

  const filteredReviews = useMemo(() => REVIEWS.filter(r =>
    (ratingFilter === 0 || r.rating === ratingFilter) &&
    (reviewSearch === "" || r.name.toLowerCase().includes(reviewSearch.toLowerCase()) || r.text.toLowerCase().includes(reviewSearch.toLowerCase()))
  ), [reviewSearch, ratingFilter]);

  const likeReview = id => {
    SFX.like();
    setLikes(prev => { const n = { ...prev, [id]: (prev[id] || 0) + 1 }; ls.set("rs_likes4", n); return n; });
  };

  const genAiIdea = async () => {
    SFX.ai();
    setAiLoading(true);
    try {
      const prompt = lang === "en"
        ? "Generate ONE creative and specific graphic design idea for a gaming/streaming content creator. Include style, colors, and mood. Keep it to 1-2 sentences. Be specific and inspiring. No intro, just the idea directly."
        : "Сгенерируй ОДНУ конкретную и творческую идею для дизайна (аватарка, превью, баннер или логотип) для гейминг/стриминг контент-мейкера. Укажи стиль, цвета и атмосферу. 1-2 предложения максимум. Без вступления, сразу идея.";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const idea = data.content?.[0]?.text?.trim() || ideasPool[Math.floor(Math.random() * ideasPool.length)];

      setAiIdea(idea);
      const nh = [...aiHistory.slice(-9), idea];
      setAiHistory(nh);
      ls.set("rs_ai_hist4", nh);
      const newCount = aiGenCount + 1;
      setAiGenCount(newCount);
      ls.set("rs_ai_gen_count4", newCount);
      addXPfn(10);
      if (newCount >= 5) onUnlockAchieve("ai_gen_5");
      SFX.aiDone();
      showToast("✨ Идея готова! +10 XP", "success");
    } catch {
      // fallback
      const pool = ideasPool.filter(i => !aiHistory.slice(-5).includes(i));
      const idea = (pool.length > 0 ? pool : ideasPool)[Math.floor(Math.random() * (pool.length || ideasPool.length))];
      setAiIdea(idea);
      const nh = [...aiHistory.slice(-9), idea];
      setAiHistory(nh);
      ls.set("rs_ai_hist4", nh);
      addXPfn(5);
      SFX.aiDone();
      showToast("✨ Идея готова!", "success");
    } finally {
      setAiLoading(false);
    }
  };

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  const SECTIONS = [
    ["about", t.aboutTitle, "◎"],
    ["reviews", t.reviewsTitle, "✦"],
    ["faq", t.faqTitle, "?"],
    ["ai", t.aiTitle, "✧"],
    ["achieve", t.achievements, "🏆"],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Section Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 6 }}>
        {SECTIONS.map(([id, label, icon]) => (
          <button key={id} onClick={() => { setSection(id); SFX.tab(); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 4px", borderRadius: 14, border: `1px solid ${section === id ? th.accent : th.border}`, background: section === id ? th.accent + "22" : th.card, cursor: "pointer" }}>
            <span style={{ fontSize: 16, color: section === id ? th.accent : th.sub }}>{icon}</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: section === id ? th.accent : th.sub, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* ABOUT */}
      {section === "about" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "cardIn .35s ease both" }}>
          <div style={{ background: th.card, borderRadius: 24, border: `1px solid ${th.border}`, overflow: "hidden" }}>
            <div style={{ height: 100, background: th.grad, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.2)" }} />
              <div style={{ position: "absolute", bottom: -32, left: 20, width: 64, height: 64, borderRadius: 20, background: th.surface, border: `3px solid ${th.card}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: th.shadow }}>✦</div>
            </div>
            <div style={{ padding: "42px 20px 22px" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: th.text }}>Rival</div>
              <div style={{ fontSize: 13, color: th.accent, fontWeight: 700, marginBottom: 14 }}>@Rivaldsg · Graphic Designer</div>
              <p style={{ fontSize: 13, color: th.sub, lineHeight: 1.75, whiteSpace: "pre-line", margin: 0 }}>{t.aboutText}</p>
            </div>
          </div>
          <div style={{ background: th.card, borderRadius: 20, border: `1px solid ${th.border}`, padding: "16px" }}>
            {[
              { icon: "✈", label: "Telegram", sub: "@Rivaldsg", url: "https://t.me/Rivaldsg", color: "#229ED9" },
              { icon: "▶", label: "VK", sub: "vk.com/rivaldsg", url: "https://vk.com/rivaldsg", color: "#4C75A3" },
              { icon: "◈", label: "Behance", sub: "Portfolio", url: "https://behance.net/rivaldsg", color: "#1769FF" },
            ].map(s => (
              <button key={s.label} onClick={() => { window.open(s.url, "_blank"); SFX.tap(); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: `1px solid ${th.border}`, background: "transparent", cursor: "pointer", width: "100%", marginBottom: 6 }}>
                <div style={{ width: 40, height: 40, borderRadius: 13, background: s.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: s.color, flexShrink: 0 }}>{s.icon}</div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: th.text }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: th.sub }}>{s.sub}</div>
                </div>
                <span style={{ color: th.sub }}>›</span>
              </button>
            ))}
          </div>
          <button onClick={() => { SFX.order(); openTg("Rivaldsg", "Привет!"); }} style={{ background: th.grad, color: th.btnTxt, border: "none", borderRadius: 18, padding: "16px", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: th.shadow }}>
            ✈ {t.toTelegram}
          </button>
        </div>
      )}

      {/* REVIEWS */}
      {section === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "cardIn .35s ease both" }}>
          <div style={{ background: th.card, borderRadius: 20, border: `1px solid ${th.border}`, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: `0 4px 16px ${th.glow}` }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: th.text, marginBottom: 4 }}>{t.reviewsTitle}</div>
              <div style={{ fontSize: 12, color: th.sub, fontWeight: 600 }}>{REVIEWS.length} отзывов</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: th.accent, lineHeight: 1, letterSpacing: "-.02em" }}>{avgRating}</div>
                <div style={{ fontSize: 14, color: "#fbbf24", marginTop: 2, letterSpacing: ".5px" }}>★★★★★</div>
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: th.sub }}>◎</span>
            <input value={reviewSearch} onChange={e => setReviewSearch(e.target.value)} placeholder={t.reviewSearch} style={{ width: "100%", padding: "11px 12px 11px 36px", borderRadius: 14, border: `1px solid ${th.border}`, background: th.card, color: th.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
            {[0, 5, 4, 3].map(r => (
              <button key={r} onClick={() => { setRatingFilter(r); SFX.filter(); }} style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, background: ratingFilter === r ? th.accent + "22" : "transparent", color: ratingFilter === r ? th.accent : th.sub, border: `1px solid ${ratingFilter === r ? th.accent : th.border}` }}>
                {r === 0 ? t.allRatings : "★".repeat(r)}
              </button>
            ))}
          </div>
          {filteredReviews.map((r, i) => {
            const likeCount = likes[r.id] || 0;
            const exp = expanded === r.id;
            return (
              <div key={r.id} style={{ background: th.card, borderRadius: 20, border: `1px solid ${th.border}`, padding: "16px", animation: `cardIn .35s ease ${i * .04}s both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: th.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 900, color: th.btnTxt, flexShrink: 0, boxShadow: th.shadow }}>{r.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: th.text }}>{r.name}</span>
                      {r.verified && <span style={{ fontSize: 9, background: "#10b98122", color: "#10b981", fontWeight: 800, padding: "1px 6px", borderRadius: 999, border: "1px solid #10b98140" }}>✓ verified</span>}
                    </div>
                    <div style={{ fontSize: 10, color: th.accent }}>@{r.tg}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#fbbf24" }}>{"★".repeat(r.rating)}</div>
                    <div style={{ fontSize: 10, color: th.sub, marginTop: 2 }}>{r.time}</div>
                  </div>
                </div>
                <p onClick={() => setExpanded(exp ? null : r.id)} style={{ fontSize: 13, color: th.sub, lineHeight: 1.65, margin: "0 0 12px", cursor: "pointer", display: "-webkit-box", WebkitLineClamp: exp ? 100 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  "{r.text}"
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { window.open(`https://t.me/${r.tg}`, "_blank"); SFX.tap(); }} style={{ fontSize: 11, color: th.accent, background: th.accent + "15", border: `1px solid ${th.accent}40`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontWeight: 700 }}>✈ TG</button>
                  <button onClick={() => likeReview(r.id)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: likeCount > 0 ? th.accent : th.sub, background: likeCount > 0 ? th.accent + "15" : "transparent", border: `1px solid ${likeCount > 0 ? th.accent + "40" : th.border}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontWeight: 700 }}>
                    ♡ {likeCount > 0 ? likeCount : ""}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAQ */}
      {section === "faq" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "cardIn .35s ease both" }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: th.text }}>{t.faqTitle}</div>
          {faq.map((item, i) => {
            const exp = expandedFaq === i;
            return (
              <div key={i} style={{ background: th.card, borderRadius: 18, border: `1px solid ${exp ? th.accent : th.border}`, overflow: "hidden", boxShadow: exp ? th.shadow : "none", animation: `cardIn .3s ease ${i * .05}s both` }}>
                <button onClick={() => { setExpandedFaq(exp ? null : i); SFX.tap(); }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 16px", background: "none", border: "none", color: th.text, cursor: "pointer", fontSize: 13, fontWeight: 800, textAlign: "left", fontFamily: "inherit" }}>
                  <span style={{ flex: 1 }}>{item.q}</span>
                  <span style={{ color: th.accent, fontSize: 22, fontWeight: 300, flexShrink: 0, transition: "transform .3s", transform: exp ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {exp && <div style={{ padding: "0 16px 18px", fontSize: 13, color: th.sub, lineHeight: 1.75, whiteSpace: "pre-line", animation: "fadeDown .25s ease" }}>{item.a}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* AI STUDIO */}
      {section === "ai" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "cardIn .35s ease both" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: th.text }}>{t.aiTitle}</div>
            <div style={{ fontSize: 12, color: th.sub, marginTop: 2 }}>{t.aiSub}</div>
          </div>
          {/* AI Idea Card */}
          <div style={{ minHeight: 140, background: th.card, borderRadius: 22, border: `2px solid ${aiIdea ? th.accent : th.border}`, padding: "22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: aiIdea ? th.shadow : "none", gap: 14, transition: "all .3s ease" }}>
            {aiLoading ? (
              <div style={{ textAlign: "center", color: th.sub }}>
                <div style={{ fontSize: 40, animation: "spin 1s linear infinite", display: "inline-block", marginBottom: 10 }}>✧</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{t.aiLoading}</div>
                <div style={{ fontSize: 11, color: th.sub, marginTop: 4 }}>AI генерирует идею...</div>
              </div>
            ) : aiIdea ? (
              <>
                <p style={{ fontSize: 14, color: th.text, lineHeight: 1.75, margin: 0, textAlign: "center" }}>{aiIdea}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { SFX.copy(); try { navigator.clipboard.writeText(aiIdea); } catch { } showToast(t.copied, "success"); }} style={{ padding: "7px 14px", borderRadius: 10, border: `1px solid ${th.border}`, background: "transparent", color: th.sub, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>⎘ Копировать</button>
                  <button onClick={() => { SFX.order(); openTg("Rivaldsg", "Идея для дизайна: " + aiIdea); }} style={{ padding: "7px 14px", borderRadius: 10, background: th.grad, border: "none", color: th.btnTxt, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✈ Заказать</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: th.sub }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>✧</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.aiEmpty}</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>Использует реальный AI</div>
              </div>
            )}
          </div>
          <button onClick={genAiIdea} disabled={aiLoading} style={{
            background: aiLoading ? "transparent" : th.grad, color: aiLoading ? th.sub : th.btnTxt,
            border: aiLoading ? `1px solid ${th.border}` : "none", borderRadius: 18,
            padding: "16px", fontSize: 15, fontWeight: 900, cursor: aiLoading ? "not-allowed" : "pointer",
            boxShadow: aiLoading ? "none" : th.shadow, letterSpacing: ".02em",
          }}>
            {aiLoading ? "⏳ Генерирую..." : t.aiBtn}
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: th.sub }}>Сгенерировано: <span style={{ color: th.accent, fontWeight: 800 }}>{aiGenCount}</span> идей</div>
            <div style={{ fontSize: 12, color: th.sub }}>+10 XP за идею</div>
          </div>
          {aiHistory.length > 0 && (
            <div style={{ background: th.card, borderRadius: 18, border: `1px solid ${th.border}`, padding: "14px" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: th.sub, marginBottom: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>{t.aiHist}</div>
              {[...aiHistory].reverse().slice(0, 5).map((idea, i) => (
                <div key={i} onClick={() => { setAiIdea(idea); SFX.tap(); }} style={{ fontSize: 12, color: th.sub, padding: "10px 12px", borderRadius: 10, border: `1px solid ${th.border}`, cursor: "pointer", marginBottom: 4, display: "flex", alignItems: "center", gap: 8, background: aiIdea === idea ? th.accent + "12" : "transparent", transition: "all .2s" }}>
                  <span style={{ flexShrink: 0, color: th.accent }}>✧</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idea}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {section === "achieve" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "cardIn .35s ease both" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: th.text }}>{t.achievements}</div>
            <div style={{ fontSize: 12, color: th.sub, marginTop: 2 }}>{streak.achievementsUnlocked?.length || 0} / {ACHIEVEMENTS.length} получено</div>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: th.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((streak.achievementsUnlocked?.length || 0) / ACHIEVEMENTS.length) * 100}%`, borderRadius: 999, background: th.grad, transition: "width .5s ease" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ACHIEVEMENTS.map((a, i) => {
              const unlocked = streak.achievementsUnlocked?.includes(a.id);
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 18, border: `1px solid ${unlocked ? th.accent + "50" : th.border}`, background: unlocked ? th.accent + "10" : th.card, animation: `cardIn .3s ease ${i * .03}s both`, opacity: a.secret && !unlocked ? 0.5 : 1 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: unlocked ? th.grad : th.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: unlocked ? th.shadow : "none", filter: !unlocked && a.secret ? "blur(4px)" : "none" }}>
                    {a.secret && !unlocked ? "?" : a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: unlocked ? th.text : th.sub }}>{a.secret && !unlocked ? "Секретное достижение" : a.title}</div>
                    <div style={{ fontSize: 11, color: th.sub, marginTop: 2 }}>{a.secret && !unlocked ? "???" : a.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: unlocked ? th.accent : th.sub }}>+{a.xp}</div>
                    <div style={{ fontSize: 9, color: th.sub, marginTop: 1 }}>XP</div>
                    {unlocked && <div style={{ fontSize: 16, marginTop: 2 }}>✓</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── IMAGE MODAL ──
function ImageModal({ item, th, t, onClose, wishlist, toggleWishlist, showToast }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const wl = wishlist.includes(item.id);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", zIndex: 9000, display: "flex", alignItems: "flex-end", animation: "fadeIn .25s ease", backdropFilter: "blur(10px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, margin: "0 auto", background: th.nav, borderRadius: "26px 26px 0 0", border: `1px solid ${th.border}`, animation: "sheetUp .35s cubic-bezier(.4,0,.2,1) both", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: th.border }} />
        </div>
        <div style={{ position: "relative", margin: "12px 16px 0" }}>
          <img src={item.img} alt={item.title} style={{ width: "100%", borderRadius: 20, display: "block", maxHeight: "52vh", objectFit: "cover" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: 10, background: "rgba(0,0,0,.8)", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          {item.popular && <div style={{ position: "absolute", top: 10, left: 10, padding: "4px 10px", borderRadius: 999, background: th.accent, color: th.btnTxt, fontSize: 11, fontWeight: 900 }}>★ TOP</div>}
          <div style={{ position: "absolute", bottom: 10, right: 10, padding: "4px 10px", borderRadius: 999, background: "rgba(0,0,0,.75)", color: "#fff", fontSize: 11, fontWeight: 700 }}>👁 {item.views >= 1000 ? (item.views / 1000).toFixed(1) + "k" : item.views}</div>
        </div>
        <div style={{ padding: "16px 20px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: th.text }}>{item.title}</div>
              <div style={{ fontSize: 12, color: th.sub, marginTop: 3 }}>{item.cat} · {item.desc}</div>
            </div>
            <button onClick={() => { toggleWishlist(item.id); SFX.wishlist(); }} style={{ width: 42, height: 42, borderRadius: 14, border: `1px solid ${wl ? th.accent : th.border}`, background: wl ? th.accent + "22" : "transparent", color: wl ? th.accent : th.sub, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {wl ? "♥" : "♡"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {item.tags.map(tag => (
              <span key={tag} style={{ padding: "3px 10px", borderRadius: 999, background: th.accent + "18", color: th.accent, fontSize: 11, fontWeight: 700 }}>#{tag}</span>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={() => { SFX.order(); openTg("Rivaldsg", `Хочу: ${item.title}`); }} style={{ background: th.grad, color: th.btnTxt, border: "none", borderRadius: 16, padding: "14px", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: th.shadow }}>
              ✈ {t.orderBtn}
            </button>
            <button onClick={() => { SFX.copy(); try { navigator.clipboard.writeText(item.img); } catch { } showToast(t.copied, "success"); }} style={{ background: th.card, color: th.text, border: `1px solid ${th.border}`, borderRadius: 16, padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              ⎘ Копировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SPLASH ──
function SplashScreen({ th, onDone }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Загрузка...");
  useEffect(() => {
    SFX.boot();
    const statuses = ["Инициализация...", "Загрузка тем...", "Загрузка курсов...", "Готово!"];
    let p = 0, si = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 7;
      const capped = Math.min(p, 100);
      setProgress(capped);
      si = Math.min(Math.floor(capped / 25), 3);
      setStatus(statuses[si]);
      if (capped >= 100) { clearInterval(iv); setTimeout(onDone, 400); }
    }, 80);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: th.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10000, gap: 28, animation: "fadeIn .3s ease" }}>
      <div style={{ position: "relative" }}>
        <div style={{ width: 90, height: 90, borderRadius: 28, background: th.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, boxShadow: `0 0 60px ${th.glow}`, animation: "splashBounce 2s ease infinite" }}>✦</div>
        <div style={{ position: "absolute", inset: -8, borderRadius: 36, border: `2px solid ${th.accent}`, opacity: 0.4, animation: "ping 2s ease infinite" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: th.text, letterSpacing: "-.03em" }}>Rival Space</div>
        <div style={{ fontSize: 13, color: th.sub, marginTop: 5 }}>v4.0 Ultra · {isTg ? "Telegram Mini App" : "Web App"}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 220 }}>
        <div style={{ width: "100%", height: 4, borderRadius: 999, background: th.border, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 999, background: th.grad, width: `${progress}%`, transition: "width .1s ease", boxShadow: `0 0 10px ${th.glow}` }} />
        </div>
        <div style={{ fontSize: 11, color: th.sub, fontWeight: 600 }}>{status}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ◆◆◆ MAIN APP ◆◆◆
// ═══════════════════════════════════════════════════════════
export default function App() {
  const mainRef = useRef(null);
  
  // ── GOOGLE ANALYTICS INITIALIZATION ──
  useEffect(() => {
    initGA();
    const userId = tgUser?.id;
    const startParam = TG?.initDataUnsafe?.start_param;
    trackAppStart(userId);
    if (startParam) trackTrafficSource(startParam, 'telegram');
    trackFunnelStep('app_start');
  }, []);
  
  const [theme, setTheme] = useState(() => { const id = ls.get("rs_theme4", "void"); return THEMES[id] || THEMES.void; });
  const [lang, setLang] = useState(() => { const l = ls.get("rs_lang4", "ru"); return LANGS[l] ? l : "ru"; });
  const [soundOn, setSoundOn] = useState(() => { const s = ls.get("rs_sound4", true); _soundEnabled = s; return s; });
  const [volume, setVolume] = useState(() => { const v = ls.get("rs_volume4", .55); _volume = v; return v; });
  const [tab, setTab] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState(() => ls.get("rs_cart4", []));
  const [wishlist, setWishlist] = useState(() => ls.get("rs_wl4", []));
  const [splash, setSplash] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selImage, setSelImage] = useState(null);
  const [streak, setStreak] = useState(() => getStreak());
  const [pendingAchieve, setPendingAchieve] = useState(null);

  const th = theme;
  const t = T[lang] || T.ru;

  useEffect(() => { tgReady(); }, []);
  
  // ── TRACK SECTION VIEWS ──
  useEffect(() => {
    if (tab && tab !== "home") {
      trackSectionView(tab);
      if (tab === "gallery") trackFunnelStep('view_gallery');
      if (tab === "pricing") trackFunnelStep('view_pricing');
    }
  }, [tab]);
  
  useEffect(() => {
    if (tab !== "home" || selImage || drawerOpen) {
      const cb = () => { if (selImage) { setSelImage(null); SFX.close(); } else if (drawerOpen) { setDrawerOpen(false); } else { setTab("home"); SFX.tab(); } };
      tgBackBtn(true, cb);
      return () => tgBackBtn(false, cb);
    } else { tgBackBtn(false); }
  }, [tab, selImage, drawerOpen]);

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
          if (newLevel >= 5) unlockAchievement("level_5");
        }, 300);
      }
      return newData;
    });
  }, [showToast, unlockAchievement]);

  const addToCart = useCallback((svc, name) => {
    setCart(prev => { const ex = prev.find(i => i.id === svc.id); if (ex) return prev.map(i => i.id === svc.id ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...svc, name, qty: 1 }]; });
    trackFunnelStep('select_plan', { plan_name: name, plan_price: svc.priceUSD });
  }, []);
  const removeFromCart = useCallback(id => { setCart(prev => prev.filter(i => i.id !== id)); }, []);
  const updateQty = useCallback((id, qty) => { if (qty < 1) { removeFromCart(id); return; } setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)); }, [removeFromCart]);
  const clearCart = useCallback(() => setCart([]), []);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const toggleWishlist = useCallback(id => {
    setWishlist(prev => {
      const n = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      showToast(prev.includes(id) ? t.removedFromWishlist : t.addedToWishlist, "info");
      ls.set("rs_wl4", n);
      return n;
    });
  }, [t]);

  const greeting = getGreeting(lang);

  return (
    <div style={{ height: "100dvh", background: th.bg, fontFamily: '"Nunito","Sora","DM Sans","Inter",system-ui,sans-serif', display: "flex", justifyContent: "center", position: "relative", overscrollBehavior: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:0;height:0;}*{scrollbar-width:none;}
        html{scroll-behavior:smooth;overscroll-behavior:none;overflow:hidden;height:100%;}
        body{margin:0;padding:0;overflow:hidden;height:100%;overscroll-behavior-y:none;-webkit-overflow-scrolling:touch;}
        button,[role="button"]{font-family:inherit;touch-action:manipulation;}
        input{font-family:inherit;}
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
        @keyframes splashBounce{0%,100%{transform:scale(1) rotate(0deg)}33%{transform:scale(1.15) rotate(8deg)}66%{transform:scale(.92) rotate(-5deg)}}
        @keyframes meshAnim{0%{opacity:0.7}100%{opacity:1}}
        @keyframes shimmer{0%,100%{opacity:.4}50%{opacity:.8}}
        @keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        input[type=range]{-webkit-appearance:none;height:5px;border-radius:99px;outline:none;background:${th.border};}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:${th.accent};cursor:pointer;box-shadow:0 2px 10px ${th.glow};}
        .swiper{overflow:visible!important;}
        @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important;}}
      `}</style>

      {splash && <SplashScreen th={th} onDone={() => setSplash(false)} />}
      <MeshBg th={th} />
      <ToastSystem toasts={toasts} th={th} />
      {confetti && <Confetti active={confetti} accent={th.accent} />}
      {pendingAchieve && <AchievementPopup achievement={pendingAchieve} th={th} onClose={() => setPendingAchieve(null)} />}
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} th={th} t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} soundOn={soundOn} setSoundOn={setSoundOn} volume={volume} setVolume={setVolume} streak={streak} />

      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", height: "100dvh", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header style={{ flexShrink: 0, position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: th.nav + "ee", borderBottom: `1px solid ${th.border}`, backdropFilter: "blur(24px)" }}>
          <button onClick={() => { SFX.drawer(); setDrawerOpen(true); }} style={{ display: "flex", flexDirection: "column", gap: 5, width: 34, height: 34, justifyContent: "center", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: i === 1 ? 16 : 24, height: 2, borderRadius: 999, background: th.sub, transition: "width .3s ease" }} />)}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: th.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: th.btnTxt, boxShadow: th.shadow }}>✦</div>
            <span style={{ 
              fontSize: 15, 
              fontWeight: 900, 
              backgroundImage: `linear-gradient(90deg, ${th.accent}, ${th.hi}, ${th.accentB}, ${th.accent})`,
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              MozBackgroundClip: "text",
              MozTextFillColor: "transparent",
              letterSpacing: "-.02em",
              display: "inline-block",
              animation: "gradientShift 3s ease infinite"
            }}>{t.appName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 999, background: th.accent + "18", border: `1px solid ${th.accent}30` }}>
              <span style={{ fontSize: 12 }}>🔥</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: th.accent }}>{streak.count}</span>
            </div>
            <button onClick={() => { 
              SFX.tap(); 
              setTab("pricing"); 
              setTimeout(() => {
                if (mainRef.current) {
                  mainRef.current.scrollTo({ top: mainRef.current.scrollHeight, behavior: 'smooth' });
                }
              }, 300);
            }} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${th.border}`, background: "none", color: th.accent, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              🛒
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 999, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </button>
          </div>
        </header>

        {tab === "home" && (
          <div style={{ flexShrink: 0, padding: "8px 16px 0", fontSize: 12, color: th.sub, fontWeight: 700 }}>
            {greeting}{tgUser?.first_name ? `, ${tgUser.first_name}` : ""} 👋
          </div>
        )}

        <main ref={mainRef} style={{ flex: 1, padding: "14px 16px 100px", overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
          <div key={tab} style={{ animation: "cardIn .35s ease both" }}>
            {tab === "home" && <HomeTab th={th} t={t} lang={lang} onGoGallery={() => setTab("gallery")} onGoCourses={() => setTab("courses")} onGoPricing={() => setTab("pricing")} onGoMore={() => setTab("more")} cartCount={cartCount} streak={streak} onUnlockAchieve={unlockAchievement} />}
            {tab === "gallery" && <GalleryTab th={th} t={t} lang={lang} wishlist={wishlist} toggleWishlist={toggleWishlist} onOpenImage={item => setSelImage(item)} />}
            {tab === "courses" && <CoursesTab th={th} t={t} lang={lang} showToast={showToast} addXPfn={addXPfn} onUnlockAchieve={unlockAchievement} streak={streak} />}
            {tab === "freepack" && <FreePackTab th={th} t={t} lang={lang} />}
            {tab === "pricing" && <PricingTab th={th} t={t} lang={lang} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} updateQty={updateQty} clearCart={clearCart} showToast={showToast} onUnlockAchieve={unlockAchievement} />}
            {tab === "more" && <MoreTab th={th} t={t} lang={lang} showToast={showToast} streak={streak} onUnlockAchieve={unlockAchievement} addXPfn={addXPfn} />}
          </div>
        </main>

        <BottomNav active={tab} onChange={setTab} th={th} t={t} cartCount={cartCount} />
      </div>

      {selImage && <ImageModal item={selImage} th={th} t={t} onClose={() => { setSelImage(null); SFX.close(); }} wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} />}
    </div>
  );
}