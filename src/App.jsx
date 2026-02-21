import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion, AnimatePresence } from "framer-motion";

// ==================== SOUND DESIGN (optional) ====================
const playSound = (type = 'click') => {
  if (!window.soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = type === 'click' ? 800 : type === 'success' ? 1000 : 400;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {}
};

// ==================== CONSTANTS ====================

const TABS = {
  HOME: "home",
  PORTFOLIO: "portfolio",
  SHOP: "shop",
  CART: "cart",
  LEARN: "learn",
  PROFILE: "profile",
  MORE: "more",
};

const SUB_TABS = {
  INSPIRATION: "inspiration",
  COLLECTIONS: "collections",
  CONTESTS: "contests",
  FRIENDS: "friends",
  CHAT: "chat",
  NFT: "nft",
  CALENDAR: "calendar",
  ACHIEVEMENTS: "achievements",
  SETTINGS: "settings",
  HELP: "help",
  STATS: "stats",
  BADGES: "badges",
  CERTIFICATES: "certificates",
  PROJECTS: "projects",
  REVIEWS: "reviews",
  QUESTIONS: "questions",
};

const THEMES = {
  DARK: { id: "dark", name: "Dark", icon: "🌙", colors: { primary: "#0a0a0f", secondary: "#1a1a24", accent: "#a78bfa", text: "#ffffff", textSecondary: "#a1a1b0", border: "#2d2d3a", card: "rgba(25,25,35,0.9)", button: "#a78bfa", buttonText: "#000000", tabActive: "#a78bfa", shadow: "0 20px 40px rgba(167,139,250,0.2)", gradient: "linear-gradient(145deg, #0a0a0f, #1a1a24)" } },
  LIGHT: { id: "light", name: "Light", icon: "☀️", colors: { primary: "#f8fafc", secondary: "#ffffff", accent: "#3b82f6", text: "#0f172a", textSecondary: "#475569", border: "#e2e8f0", card: "rgba(255,255,255,0.9)", button: "#3b82f6", buttonText: "#ffffff", tabActive: "#3b82f6", shadow: "0 20px 40px rgba(59,130,246,0.1)", gradient: "linear-gradient(145deg, #f1f5f9, #ffffff)" } },
  PURPLE: { id: "purple", name: "Purple", icon: "🟣", colors: { primary: "#1e1029", secondary: "#2d1b38", accent: "#d8b4fe", text: "#f5f0ff", textSecondary: "#c4b5fd", border: "#4c2a5c", card: "rgba(45,27,56,0.9)", button: "#d8b4fe", buttonText: "#000000", tabActive: "#d8b4fe", shadow: "0 20px 40px rgba(216,180,254,0.2)", gradient: "linear-gradient(145deg, #1e1029, #2d1b38)" } },
  NEON: { id: "neon", name: "Neon", icon: "💡", colors: { primary: "#0b0b0f", secondary: "#14141c", accent: "#00ffaa", text: "#ffffff", textSecondary: "#70ffd0", border: "#00ffaa", card: "rgba(10,20,15,0.9)", button: "#00ffaa", buttonText: "#000000", tabActive: "#00ffaa", shadow: "0 0 40px #00ffaa", gradient: "linear-gradient(145deg, #0b0b0f, #14141c)" } },
  OCEAN: { id: "ocean", name: "Ocean", icon: "🌊", colors: { primary: "#0b1a2e", secondary: "#1a2f3f", accent: "#38bdf8", text: "#ffffff", textSecondary: "#b0d4f0", border: "#2d4a62", card: "rgba(20,40,60,0.9)", button: "#38bdf8", buttonText: "#000000", tabActive: "#38bdf8", shadow: "0 20px 40px rgba(56,189,248,0.2)", gradient: "linear-gradient(145deg, #0b1a2e, #1a2f3f)" } },
  SUNSET: { id: "sunset", name: "Sunset", icon: "🌅", colors: { primary: "#2d1b1b", secondary: "#3d2a2a", accent: "#f97316", text: "#fff7ed", textSecondary: "#fed7aa", border: "#7f2d0f", card: "rgba(61,42,42,0.9)", button: "#f97316", buttonText: "#000000", tabActive: "#f97316", shadow: "0 20px 40px rgba(249,115,22,0.2)", gradient: "linear-gradient(145deg, #2d1b1b, #3d2a2a)" } },
  FOREST: { id: "forest", name: "Forest", icon: "🌲", colors: { primary: "#0f2b1f", secondary: "#1f3f2f", accent: "#4ade80", text: "#f0fdf4", textSecondary: "#bbf7d0", border: "#166534", card: "rgba(31,63,47,0.9)", button: "#4ade80", buttonText: "#000000", tabActive: "#4ade80", shadow: "0 20px 40px rgba(74,222,128,0.2)", gradient: "linear-gradient(145deg, #0f2b1f, #1f3f2f)" } },
  COSMIC: { id: "cosmic", name: "Cosmic", icon: "🚀", colors: { primary: "#0e0b1f", secondary: "#1e1b2f", accent: "#c084fc", text: "#f5f0ff", textSecondary: "#d8b4fe", border: "#4c1d95", card: "rgba(30,27,47,0.9)", button: "#c084fc", buttonText: "#000000", tabActive: "#c084fc", shadow: "0 20px 40px rgba(192,132,252,0.2)", gradient: "linear-gradient(145deg, #0e0b1f, #1e1b2f)" } },
  LAVENDER: { id: "lavender", name: "Lavender", icon: "🌸", colors: { primary: "#1f1729", secondary: "#2f1f39", accent: "#e879f9", text: "#faf5ff", textSecondary: "#f5d0fe", border: "#86198f", card: "rgba(47,31,57,0.9)", button: "#e879f9", buttonText: "#000000", tabActive: "#e879f9", shadow: "0 20px 40px rgba(232,121,249,0.2)", gradient: "linear-gradient(145deg, #1f1729, #2f1f39)" } },
  RETRO: { id: "retro", name: "Retro", icon: "📼", colors: { primary: "#2b1f1a", secondary: "#3b2f2a", accent: "#fbbf24", text: "#fef3c7", textSecondary: "#fde68a", border: "#92400e", card: "rgba(59,47,42,0.9)", button: "#fbbf24", buttonText: "#000000", tabActive: "#fbbf24", shadow: "0 20px 40px rgba(251,191,36,0.2)", gradient: "linear-gradient(145deg, #2b1f1a, #3b2f2a)" } },
};

const EXCHANGE_RATES = { USD: 1, RUB: 95, UAH: 40, BYN: 3.2, KZT: 450, EUR: 0.92, CNY: 7.2, GBP: 0.8, JPY: 150, INR: 83 };

const LANGUAGE_TO_CURRENCY = {
  ru: { symbol: "₽", code: "RUB" }, ua: { symbol: "₴", code: "UAH" }, en: { symbol: "$", code: "USD" },
  by: { symbol: "Br", code: "BYN" }, kz: { symbol: "₸", code: "KZT" }, de: { symbol: "€", code: "EUR" },
  fr: { symbol: "€", code: "EUR" }, es: { symbol: "€", code: "EUR" }, zh: { symbol: "¥", code: "CNY" }, jp: { symbol: "¥", code: "JPY" },
};

const LANGUAGES = [
  { code: "ru", name: "Русский", flag: "🇷🇺" }, { code: "en", name: "English", flag: "🇺🇸" }, { code: "ua", name: "Українська", flag: "🇺🇦" },
  { code: "kz", name: "Қазақша", flag: "🇰🇿" }, { code: "by", name: "Беларуская", flag: "🇧🇾" }, { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" }, { code: "es", name: "Español", flag: "🇪🇸" }, { code: "zh", name: "中文", flag: "🇨🇳" }, { code: "jp", name: "日本語", flag: "🇯🇵" },
];

const TAB_LABELS = {
  ru: {
    [TABS.HOME]: { label: "Главная", icon: "🏠" },
    [TABS.PORTFOLIO]: { label: "Портфолио", icon: "🎨" },
    [TABS.SHOP]: { label: "Магазин", icon: "🛍️" },
    [TABS.CART]: { label: "Корзина", icon: "🛒" },
    [TABS.LEARN]: { label: "Курсы", icon: "📚" },
    [TABS.PROFILE]: { label: "Профиль", icon: "👤" },
    [TABS.MORE]: { label: "Ещё", icon: "⋯" },
  },
  en: {
    [TABS.HOME]: { label: "Home", icon: "🏠" },
    [TABS.PORTFOLIO]: { label: "Portfolio", icon: "🎨" },
    [TABS.SHOP]: { label: "Shop", icon: "🛍️" },
    [TABS.CART]: { label: "Cart", icon: "🛒" },
    [TABS.LEARN]: { label: "Learn", icon: "📚" },
    [TABS.PROFILE]: { label: "Profile", icon: "👤" },
    [TABS.MORE]: { label: "More", icon: "⋯" },
  },
};

const PORTFOLIO_CATEGORIES = {
  ru: ["Все", "Аватарки", "Превью", "Баннеры", "Логотипы", "3D", "Анимация", "Иллюстрации", "NFT"],
  en: ["All", "Avatars", "Previews", "Banners", "Logos", "3D", "Animation", "Illustrations", "NFT"],
};

const PORTFOLIO_ITEMS = Array.from({ length: 50 }, (_, i) => ({
  id: `p${i}`,
  category: ["Аватарки", "Превью", "Баннеры", "Логотипы", "3D", "Анимация", "Иллюстрации", "NFT"][i % 8],
  title: `Work ${i + 1}`,
  image: `https://picsum.photos/400/300?random=${i}`,
  description: `Professional design work ${i + 1}`,
  price: 5 + (i % 20),
  rating: (4 + Math.random() * 1).toFixed(1),
  likes: Math.floor(Math.random() * 1000),
  views: Math.floor(Math.random() * 5000),
  author: "Rival",
  tags: ["design", "professional"],
}));

const REVIEWS = Array.from({ length: 30 }, (_, i) => ({
  id: `r${i}`,
  name: `Client ${i + 1}`,
  text: `Excellent designer! Professional work delivered on time. Very satisfied!`,
  rating: 4 + Math.floor(Math.random() * 2),
  avatar: "",
  date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
}));

const COURSES = [
  { id: "c1", title: "Photoshop Fundamentals", lessons: 10, price: 50, image: "https://picsum.photos/400/300?random=101", level: "Beginner", duration: "10h", students: 1234, rating: 4.8 },
  { id: "c2", title: "Advanced Design", lessons: 15, price: 80, image: "https://picsum.photos/400/300?random=102", level: "Intermediate", duration: "15h", students: 856, rating: 4.7 },
  { id: "c3", title: "3D Modeling", lessons: 20, price: 120, image: "https://picsum.photos/400/300?random=103", level: "Advanced", duration: "20h", students: 567, rating: 4.9 },
  { id: "c4", title: "Avatar Creation", lessons: 8, price: 40, image: "https://picsum.photos/400/300?random=104", level: "Beginner", duration: "8h", students: 2345, rating: 4.6 },
  { id: "c5", title: "Motion Design", lessons: 12, price: 90, image: "https://picsum.photos/400/300?random=105", level: "Intermediate", duration: "12h", students: 432, rating: 4.8 },
  { id: "c6", title: "UI/UX Basics", lessons: 10, price: 60, image: "https://picsum.photos/400/300?random=106", level: "Beginner", duration: "10h", students: 1567, rating: 4.7 },
  { id: "c7", title: "Illustrator Mastery", lessons: 12, price: 70, image: "https://picsum.photos/400/300?random=107", level: "Intermediate", duration: "12h", students: 987, rating: 4.6 },
  { id: "c8", title: "Figma Workflow", lessons: 8, price: 45, image: "https://picsum.photos/400/300?random=108", level: "Beginner", duration: "8h", students: 2134, rating: 4.9 },
  { id: "c9", title: "Logo Design", lessons: 6, price: 35, image: "https://picsum.photos/400/300?random=109", level: "Beginner", duration: "6h", students: 1876, rating: 4.5 },
  { id: "c10", title: "After Effects", lessons: 15, price: 100, image: "https://picsum.photos/400/300?random=110", level: "Advanced", duration: "15h", students: 654, rating: 4.8 },
];

const MERCH = [
  { id: "m1", name: "Design T-Shirt", price: 25, image: "https://picsum.photos/400/300?random=20" },
  { id: "m2", name: "Ceramic Mug", price: 15, image: "https://picsum.photos/400/300?random=21" },
  { id: "m3", name: "Sticker Pack", price: 10, image: "https://picsum.photos/400/300?random=22" },
  { id: "m4", name: "Premium Hoodie", price: 45, image: "https://picsum.photos/400/300?random=23" },
  { id: "m5", name: "Enamel Pin", price: 5, image: "https://picsum.photos/400/300?random=24" },
];

const ACHIEVEMENTS = Array.from({ length: 50 }, (_, i) => ({
  id: `a${i}`,
  name: `Achievement ${i + 1}`,
  description: `Description for achievement ${i + 1}`,
  icon: ["🌟", "❤️", "📝", "🧭", "👥", "💰", "💡", "🎥", "🖼️", "🏆"][i % 10],
  xp: 10 + (i % 20),
}));

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [theme, setTheme] = useState(THEMES.DARK);
  const [language, setLanguage] = useState("ru");
  const [showDrawer, setShowDrawer] = useState(false);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [user, setUser] = useState({ name: "Guest", avatar: null, level: 1, xp: 0, achievements: [] });
  const [viewedItems, setViewedItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [premium, setPremium] = useState(false);
  const [filter, setFilter] = useState({ category: "All", minPrice: 0, maxPrice: 1000, rating: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [courseFilter, setCourseFilter] = useState({ level: "All", priceRange: [0, 200] });
  const [myCourses, setMyCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [activeCourse, setActiveCourse] = useState(null);
  const [comments, setComments] = useState({});
  const [likedItems, setLikedItems] = useState({});
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({ orders: 0, totalSpent: 0, coursesCompleted: 0, projectsCreated: 0 });

  useEffect(() => {
    window.soundEnabled = soundEnabled;
  }, [soundEnabled]);

  const triggerHaptic = () => {
    if (hapticEnabled && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const handleClick = useCallback((action, soundType = 'click') => {
    if (soundEnabled) playSound(soundType);
    triggerHaptic();
    if (action) action();
  }, [soundEnabled, hapticEnabled]);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedCart = localStorage.getItem("cart"); if (savedCart) setCart(JSON.parse(savedCart));
        const savedFav = localStorage.getItem("favorites"); if (savedFav) setFavorites(JSON.parse(savedFav));
        const savedHistory = localStorage.getItem("history"); if (savedHistory) setHistory(JSON.parse(savedHistory));
        const savedCollections = localStorage.getItem("collections"); if (savedCollections) setCollections(JSON.parse(savedCollections));
        const savedFriends = localStorage.getItem("friends"); if (savedFriends) setFriends(JSON.parse(savedFriends));
        const savedMessages = localStorage.getItem("messages"); if (savedMessages) setMessages(JSON.parse(savedMessages));
        const savedUser = localStorage.getItem("user"); if (savedUser) setUser(JSON.parse(savedUser));
        const savedTheme = localStorage.getItem("theme"); if (savedTheme && THEMES[savedTheme.toUpperCase()]) setTheme(THEMES[savedTheme.toUpperCase()]);
        const savedLang = localStorage.getItem("language"); if (savedLang) setLanguage(savedLang);
        const savedPremium = localStorage.getItem("premium"); if (savedPremium) setPremium(JSON.parse(savedPremium));
        const savedMyCourses = localStorage.getItem("myCourses"); if (savedMyCourses) setMyCourses(JSON.parse(savedMyCourses));
        const savedCourseProgress = localStorage.getItem("courseProgress"); if (savedCourseProgress) setCourseProgress(JSON.parse(savedCourseProgress));
        const savedCertificates = localStorage.getItem("certificates"); if (savedCertificates) setCertificates(JSON.parse(savedCertificates));
        const savedBadges = localStorage.getItem("badges"); if (savedBadges) setBadges(JSON.parse(savedBadges));
        const savedStats = localStorage.getItem("stats"); if (savedStats) setStats(JSON.parse(savedStats));
      } catch (e) { console.error("Error loading data", e); } finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("history", JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem("collections", JSON.stringify(collections)); }, [collections]);
  useEffect(() => { localStorage.setItem("friends", JSON.stringify(friends)); }, [friends]);
  useEffect(() => { localStorage.setItem("messages", JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem("user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("theme", theme.id); }, [theme]);
  useEffect(() => { localStorage.setItem("language", language); }, [language]);
  useEffect(() => { localStorage.setItem("premium", JSON.stringify(premium)); }, [premium]);
  useEffect(() => { localStorage.setItem("myCourses", JSON.stringify(myCourses)); }, [myCourses]);
  useEffect(() => { localStorage.setItem("courseProgress", JSON.stringify(courseProgress)); }, [courseProgress]);
  useEffect(() => { localStorage.setItem("certificates", JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem("badges", JSON.stringify(badges)); }, [badges]);
  useEffect(() => { localStorage.setItem("stats", JSON.stringify(stats)); }, [stats]);

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000);
  }, []);

  const addXP = useCallback((amount) => {
    setUser((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  const toggleFavorite = useCallback((item) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        addNotification("Removed from favorites", "warning");
        return prev.filter((f) => f.id !== item.id);
      } else {
        addNotification("Added to favorites", "success");
        addXP(5);
        return [...prev, item];
      }
    });
  }, [addNotification, addXP]);

  const toggleLike = useCallback((itemId) => {
    setLikedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    if (!likedItems[itemId]) addXP(1);
  }, [likedItems, addXP]);

  const addToHistory = useCallback((item) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id);
      return [item, ...filtered].slice(0, 50);
    });
    setViewedItems((prev) => {
      const filtered = prev.filter((v) => v.id !== item.id);
      return [item, ...filtered].slice(0, 20);
    });
  }, []);

  const addToCart = useCallback((item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i));
      } else {
        return [...prev, { ...item, quantity }];
      }
    });
    addNotification("Item added to cart", "success");
    addXP(2);
  }, [addNotification, addXP]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    addNotification("Item removed from cart", "info");
  }, [addNotification]);

  const updateQuantity = useCallback((id, delta) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    addNotification("Cart cleared", "warning");
  }, [addNotification]);

  const applyPromo = useCallback(() => {
    if (promoCode.toLowerCase() === "rival20") {
      setPromoApplied(true);
      addNotification("20% promo applied!", "success");
    } else if (promoCode.toLowerCase() === "rival10") {
      setPromoApplied(true);
      addNotification("10% promo applied!", "success");
    } else {
      addNotification("Invalid promo code", "error");
    }
  }, [promoCode, addNotification]);

  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((sum, i) => sum + (i.price || i.priceUSD || 0) * i.quantity, 0);
    let discount = 0;
    if (promoApplied) discount += subtotal * 0.1;
    if (cart.length >= 3) discount += subtotal * 0.05;
    if (premium) discount += sub
