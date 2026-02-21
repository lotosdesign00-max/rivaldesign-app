import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion, AnimatePresence } from "framer-motion";

// ==================== SOUND DESIGN (optional) ====================
// Simple beep sound using Web Audio API
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
  } catch (e) {
    // Fallback if AudioContext fails
  }
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

// 10 professional color themes
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

// Currency rates
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

// Professional placeholder images
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

// ==================== MAIN COMPONENT ====================

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

  // Enable sound globally
  useEffect(() => {
    window.soundEnabled = soundEnabled;
  }, [soundEnabled]);

  // Simulate haptic feedback
  const triggerHaptic = () => {
    if (hapticEnabled && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  // Enhanced click handler with sound and haptic
  const handleClick = useCallback((action, soundType = 'click') => {
    if (soundEnabled) playSound(soundType);
    triggerHaptic();
    if (action) action();
  }, [soundEnabled, hapticEnabled]);

  // Load from localStorage
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

  // Save to localStorage
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

  // Notifications
  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000);
  }, []);

  // XP System
  const addXP = useCallback((amount) => {
    setUser((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  // Favorites
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

  // Like
  const toggleLike = useCallback((itemId) => {
    setLikedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    if (!likedItems[itemId]) addXP(1);
  }, [likedItems, addXP]);

  // History
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

  // Cart
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

  // Promo
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

  // Cart total
  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((sum, i) => sum + (i.price || i.priceUSD || 0) * i.quantity, 0);
    let discount = 0;
    if (promoApplied) discount += subtotal * 0.1;
    if (cart.length >= 3) discount += subtotal * 0.05;
    if (premium) discount += subtotal * 0.15;
    return { subtotal, discount, total: subtotal - discount, itemsCount: cart.reduce((s, i) => s + i.quantity, 0) };
  }, [cart, promoApplied, premium]);

  // Currency
  const currencyInfo = LANGUAGE_TO_CURRENCY[language] || LANGUAGE_TO_CURRENCY.en;
  const convertPrice = useCallback((usd) => Math.round(usd * EXCHANGE_RATES[currencyInfo.code]), [currencyInfo]);
  const formatPrice = useCallback((usd) => `${convertPrice(usd)} ${currencyInfo.symbol}`, [convertPrice, currencyInfo]);

  // Image error handler
  const handleImageError = (id) => setImageErrors((prev) => ({ ...prev, [id]: true }));

  // Follow
  const follow = useCallback(() => {
    setFollowers((f) => f + 1);
    addNotification("Followed successfully", "success");
  }, [addNotification]);

  // ========== TAB COMPONENTS ==========

  const HomeTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="tab-pane home"
    >
      <div className="welcome-card glass">
        <h2>Welcome back, {user.name}!</h2>
        <p>Level {user.level} • {user.xp} XP • Followers: {followers}</p>
        <div className="xp-bar"><motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${user.xp % 100}%` }}
          transition={{ duration: 0.5 }}
        /></div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="follow-btn" 
          onClick={() => handleClick(follow)}
        >➕ Follow</motion.button>
      </div>
      <h3>Recommendations</h3>
      <Swiper spaceBetween={12} slidesPerView={"auto"} className="feed-swiper">
        {PORTFOLIO_ITEMS.slice(0, 10).map((item) => (
          <SwiperSlide key={item.id} style={{ width: 200 }}>
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              className="feed-card glass"
              onClick={() => handleClick(() => { addToHistory(item); setSelectedItem(item); })}
            >
              {imageErrors[item.id] ? <div className="image-placeholder">🖼️</div> : <img src={item.image} alt={item.title} onError={() => handleImageError(item.id)} />}
              <h4>{item.title}</h4>
              <p>{formatPrice(item.price)}</p>
              <div className="card-actions-small">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); handleClick(() => toggleLike(item.id)); }}
                >{likedItems[item.id] ? "❤️" : "🤍"}</motion.button>
                <span>{item.likes}</span>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );

  const PortfolioTab = () => {
    const [category, setCategory] = useState("All");
    const [filtered, setFiltered] = useState(PORTFOLIO_ITEMS);

    useEffect(() => {
      let f = PORTFOLIO_ITEMS;
      if (category !== "All") f = f.filter((i) => i.category === category);
      if (searchQuery) {
        f = f.filter((i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      f = f.filter((i) => i.price >= filter.minPrice && i.price <= filter.maxPrice);
      if (filter.rating > 0) f = f.filter((i) => i.rating >= filter.rating);
      if (sortBy === "priceAsc") f.sort((a, b) => a.price - b.price);
      if (sortBy === "priceDesc") f.sort((a, b) => b.price - a.price);
      if (sortBy === "rating") f.sort((a, b) => b.rating - a.rating);
      if (sortBy === "popular") f.sort((a, b) => b.likes - a.likes);
      setFiltered(f);
    }, [category, searchQuery, filter, sortBy]);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="tab-pane portfolio"
      >
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(() => setShowFilters(!showFilters))}
          >🔍</motion.button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="filters glass"
            >
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {PORTFOLIO_CATEGORIES[language].map((c) => (<option key={c}>{c}</option>))}
              </select>
              <input type="number" placeholder="Min" value={filter.minPrice} onChange={(e) => setFilter({ ...filter, minPrice: +e.target.value })} />
              <input type="number" placeholder="Max" value={filter.maxPrice} onChange={(e) => setFilter({ ...filter, maxPrice: +e.target.value })} />
              <select value={filter.rating} onChange={(e) => setFilter({ ...filter, rating: +e.target.value })}>
                <option value={0}>Any</option><option value={4}>4+</option><option value={4.5}>4.5+</option><option value={5}>5</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option><option value="priceAsc">Price ↑</option><option value="priceDesc">Price ↓</option>
                <option value="rating">Rating</option><option value="popular">Popular</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="portfolio-grid">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              className="portfolio-card"
              onClick={() => handleClick(() => { addToHistory(item); setSelectedItem(item); })}
            >
              {imageErrors[item.id] ? <div className="image-placeholder">🖼️</div> : <img src={item.image} alt={item.title} onError={() => handleImageError(item.id)} />}
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <div className="card-footer">
                <span className="price">{formatPrice(item.price)}</span>
                <span className="rating">⭐ {item.rating}</span>
              </div>
              <div className="card-actions">
                <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleClick(() => toggleLike(item.id)); }}>{likedItems[item.id] ? "❤️" : "🤍"}</motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleClick(() => toggleFavorite(item)); }}>{favorites.some((f) => f.id === item.id) ? "★" : "☆"}</motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleClick(() => addToCart(item)); }}>🛒</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const ShopTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="tab-pane shop"
    >
      <h2>Merch Store</h2>
      <div className="shop-categories">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shop-cat active">Merch</motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shop-cat">NFT</motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shop-cat">Gifts</motion.button>
      </div>
      <div className="shop-grid">
        {MERCH.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="shop-card"
            onClick={() => setSelectedItem(item)}
          >
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p className="price">{formatPrice(item.price)}</p>
            <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleClick(() => addToCart({ ...item, priceUSD: item.price })); }}>Buy</motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const CartTab = () => {
    if (cart.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="tab-pane cart-empty"
        >
          <h2>Your cart is empty</h2>
          <p>Add items from portfolio or shop</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="primary-btn" 
            onClick={() => handleClick(() => setActiveTab(TABS.PORTFOLIO))}
          >Go to Portfolio</motion.button>
        </motion.div>
      );
    }
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="tab-pane cart"
      >
        <div className="cart-header">
          <h2>Cart ({cartTotal.itemsCount})</h2>
          <motion.button whileTap={{ scale: 0.95 }} className="clear-cart" onClick={() => handleClick(clearCart)}>Clear</motion.button>
        </div>
        <div className="cart-items">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="cart-item"
            >
              <div className="cart-item-image">
                {imageErrors[item.id] ? <div className="image-placeholder-small">🖼️</div> : <img src={item.image} alt={item.title || item.name} onError={() => handleImageError(item.id)} />}
              </div>
              <div className="cart-item-info">
                <h4>{item.title || item.name}</h4>
                <p className="cart-item-price">{formatPrice(item.price || item.priceUSD || 0)}</p>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-control">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleClick(() => updateQuantity(item.id, -1))}>-</motion.button>
                  <span>{item.quantity}</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleClick(() => updateQuantity(item.id, 1))}>+</motion.button>
                </div>
                <div className="cart-item-total">{formatPrice((item.price || item.priceUSD || 0) * item.quantity)}</div>
                <motion.button whileTap={{ scale: 0.9 }} className="remove-item" onClick={() => handleClick(() => removeFromCart(item.id))}>✕</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="promo-section">
          <input type="text" placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} disabled={promoApplied} />
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleClick(applyPromo)} disabled={promoApplied}>Apply</motion.button>
        </div>
        <div className="cart-summary">
          <div className="summary-row"><span>Subtotal:</span><span>{formatPrice(cartTotal.subtotal)}</span></div>
          {cartTotal.discount > 0 && <div className="summary-row discount"><span>Discount:</span><span>-{formatPrice(cartTotal.discount)}</span></div>}
          <div className="summary-row final"><span>Total:</span><span>{formatPrice(cartTotal.total)}</span></div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="checkout-btn" 
          onClick={() => handleClick(() => alert("Checkout simulation"))}
        >Checkout</motion.button>
      </motion.div>
    );
  };

  const LearnTab = () => {
    const [filteredCourses, setFilteredCourses] = useState(COURSES);
    useEffect(() => {
      let f = COURSES.filter(c => c.price >= courseFilter.priceRange[0] && c.price <= courseFilter.priceRange[1]);
      if (courseFilter.level !== "All") f = f.filter(c => c.level === courseFilter.level);
      setFilteredCourses(f);
    }, [courseFilter]);

    const enrollCourse = (course) => {
      if (!myCourses.some(c => c.id === course.id)) {
        setMyCourses([...myCourses, course]);
        addNotification(`Enrolled in "${course.title}"`, "success");
        addXP(10);
        setStats(prev => ({ ...prev, coursesCompleted: prev.coursesCompleted + 1 }));
      } else {
        addNotification("Already enrolled", "info");
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="tab-pane learn"
      >
        <h2>Learning Center</h2>
        <div className="learn-filters glass">
          <select onChange={(e) => setCourseFilter({ ...courseFilter, level: e.target.value })}>
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <input type="range" min="0" max="200" value={courseFilter.priceRange[1]} onChange={(e) => setCourseFilter({ ...courseFilter, priceRange: [0, +e.target.value] })} />
          <span>up to {formatPrice(courseFilter.priceRange[1])}</span>
        </div>
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="course-card glass"
              onClick={() => setActiveCourse(course)}
            >
              <img src={course.image} alt={course.title} />
              <h4>{course.title}</h4>
              <p>{course.level} • {course.lessons} lessons</p>
              <p className="price">{formatPrice(course.price)}</p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleClick(() => enrollCourse(course)); }}>Enroll</motion.button>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {activeCourse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="course-detail glass"
            >
              <h3>{activeCourse.title}</h3>
              <p>Level: {activeCourse.level}</p>
              <p>Duration: {activeCourse.duration}</p>
              <p>Students: {activeCourse.students}</p>
              <p>Rating: ⭐ {activeCourse.rating}</p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setActiveCourse(null)}>Close</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        {myCourses.length > 0 && (
          <div className="my-courses">
            <h3>My Courses</h3>
            {myCourses.map(c => (
              <div key={c.id} className="my-course-item">
                <span>{c.title}</span>
                <progress value={courseProgress[c.id] || 0} max="100"></progress>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                  const newProgress = Math.min(100, (courseProgress[c.id] || 0) + 10);
                  setCourseProgress({ ...courseProgress, [c.id]: newProgress });
                  if (newProgress === 100) {
                    addNotification(`Course "${c.title}" completed!`, "success");
                    setCertificates([...certificates, { id: Date.now(), course: c.title, date: new Date().toLocaleDateString() }]);
                    addXP(50);
                  }
                }}>Progress +10%</motion.button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const ProfileTab = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tab-pane profile"
    >
      <div className="profile-header glass">
        <div className="avatar-large">{user.name[0]}</div>
        <h2>{user.name}</h2>
        <p>Level {user.level} • {user.xp} XP • Followers: {followers}</p>
        <div className="xp-bar"><motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${user.xp % 100}%` }}
          transition={{ duration: 0.5 }}
        /></div>
        <motion.button whileTap={{ scale: 0.95 }} className="premium-btn" onClick={() => handleClick(() => setPremium(!premium))}>
          {premium ? "Premium ✓" : "Become Premium"}
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className="follow-btn" onClick={() => handleClick(follow)}>➕ Follow</motion.button>
      </div>
      <div className="stats-grid">
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card"><span>❤️</span> {favorites.length}</motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card"><span>🛒</span> {cart.length}</motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card"><span>👀</span> {history.length}</motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card"><span>📚</span> {myCourses.length}</motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card"><span>🎓</span> {certificates.length}</motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card"><span>🏅</span> {badges.length}</motion.div>
      </div>
      <h3>Achievements</h3>
      <div className="badge-grid">
        {ACHIEVEMENTS.slice(0, 12).map((a) => (
          <motion.div key={a.id} whileHover={{ scale: 1.05, y: -5 }} className="badge">
            <span className="badge-icon">{a.icon}</span>
            <span>{a.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const MoreTab = () => {
    const subItems = [
      { id: SUB_TABS.INSPIRATION, icon: "💡", label: "Inspiration" },
      { id: SUB_TABS.COLLECTIONS, icon: "📁", label: "Collections" },
      { id: SUB_TABS.CONTESTS, icon: "🏆", label: "Contests" },
      { id: SUB_TABS.FRIENDS, icon: "👥", label: "Friends" },
      { id: SUB_TABS.CHAT, icon: "💬", label: "Chat" },
      { id: SUB_TABS.NFT, icon: "🖼️", label: "NFT" },
      { id: SUB_TABS.CALENDAR, icon: "📅", label: "Calendar" },
      { id: SUB_TABS.ACHIEVEMENTS, icon: "🎖️", label: "Achievements" },
      { id: SUB_TABS.STATS, icon: "📊", label: "Statistics" },
      { id: SUB_TABS.BADGES, icon: "🏅", label: "Badges" },
      { id: SUB_TABS.CERTIFICATES, icon: "📜", label: "Certificates" },
      { id: SUB_TABS.PROJECTS, icon: "🛠️", label: "Projects" },
      { id: SUB_TABS.REVIEWS, icon: "⭐", label: "Reviews" },
      { id: SUB_TABS.QUESTIONS, icon: "❓", label: "Questions" },
      { id: SUB_TABS.SETTINGS, icon: "⚙️", label: "Settings" },
      { id: SUB_TABS.HELP, icon: "❓", label: "Help" },
    ];
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="tab-pane more"
      >
        <div className="more-grid">
          {subItems.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`more-item ${activeSubTab === s.id ? "active" : ""}`}
              onClick={() => handleClick(() => setActiveSubTab(s.id))}
            >
              <span className="more-icon">{s.icon}</span><span>{s.label}</span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeSubTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="sub-content glass"
          >
            {activeSubTab === SUB_TABS.SETTINGS && (
              <div className="settings">
                <h3>Settings</h3>
                <div className="setting-item"><span>Theme</span>
                  <select value={theme.id} onChange={(e) => setTheme(THEMES[e.target.value.toUpperCase()])}>
                    {Object.values(THEMES).map((th) => (<option key={th.id} value={th.id}>{th.name}</option>))}
                  </select>
                </div>
                <div className="setting-item"><span>Language</span>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {LANGUAGES.map((l) => (<option key={l.code} value={l.code}>{l.flag} {l.name}</option>))}
                  </select>
                </div>
                <div className="setting-item"><span>Sound</span><input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} /></div>
                <div className="setting-item"><span>Haptic</span><input type="checkbox" checked={hapticEnabled} onChange={() => setHapticEnabled(!hapticEnabled)} /></div>
              </div>
            )}
            {activeSubTab === SUB_TABS.INSPIRATION && (
              <div className="inspiration">
                <h3>AI Idea Generator</h3>
                <textarea placeholder="Describe your idea..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}></textarea>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setAiResult({ text: `Idea based on "${aiPrompt}": vibrant colors, geometric shapes, minimalism` }); addXP(3); }}>Generate</motion.button>
                {aiResult && <div className="ai-result glass">{aiResult.text}</div>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  };

  // ========== MODAL ==========
  const Modal = () => {
    if (!selectedItem) return null;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop show"
        onClick={() => setSelectedItem(null)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button 
            whileHover={{ rotate: 90 }}
            className="modal-close" 
            onClick={() => handleClick(() => setSelectedItem(null))}
          >✕</motion.button>
          {imageErrors[selectedItem.id] ? <div className="modal-image-placeholder">🖼️</div> : <img src={selectedItem.image} alt={selectedItem.title || selectedItem.name} onError={() => handleImageError(selectedItem.id)} />}
          <h2>{selectedItem.title || selectedItem.name}</h2>
          <p>{selectedItem.description || ""}</p>
          <p>Price: {formatPrice(selectedItem.price || selectedItem.priceUSD || 0)}</p>
          <div className="modal-actions">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleClick(() => toggleLike(selectedItem.id))}>{likedItems[selectedItem.id] ? "❤️ Unlike" : "🤍 Like"}</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleClick(() => toggleFavorite(selectedItem))}>{favorites.some((f) => f.id === selectedItem.id) ? "★ Remove" : "☆ Favorite"}</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleClick(() => addToCart(selectedItem))}>🛒 Add to cart</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => { window.open(`https://t.me/share/url?url=${window.location.href}&text=${selectedItem.title}`, '_blank'); }}>🔗 Share</motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ========== UI STATE ==========
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <div className="app-root" style={{
      "--color-primary": theme.colors.primary,
      "--color-secondary": theme.colors.secondary,
      "--color-accent": theme.colors.accent,
      "--color-text": theme.colors.text,
      "--color-text-secondary": theme.colors.textSecondary,
      "--color-border": theme.colors.border,
      "--color-card": theme.colors.card,
      "--color-button": theme.colors.button,
      "--color-button-text": theme.colors.buttonText,
      "--color-tab-active": theme.colors.tabActive,
      "--shadow": theme.colors.shadow,
      "--gradient": theme.colors.gradient,
    }}>
      <div className="app-shell">
        <header className="top-bar">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="menu-btn" 
            onClick={() => handleClick(() => setShowDrawer(true))}
          >☰</motion.button>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="app-title"
          >Rival Universe</motion.h1>
          <div className="header-actions">
            <div className="control-wrapper">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-btn" 
                onClick={() => handleClick(() => setShowThemeMenu(!showThemeMenu))}
              >{theme.icon}</motion.button>
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="dropdown-menu"
                  >
                    {Object.values(THEMES).map((th) => (
                      <motion.button
                        key={th.id}
                        whileHover={{ x: 5 }}
                        className={`dropdown-item ${theme.id === th.id ? "active" : ""}`}
                        onClick={() => { handleClick(() => { setTheme(th); setShowThemeMenu(false); }); }}
                      >{th.icon} {th.name}</motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="control-wrapper">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-btn" 
                onClick={() => handleClick(() => setShowLangMenu(!showLangMenu))}
              >🌐</motion.button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="dropdown-menu"
                  >
                    {LANGUAGES.map((l) => (
                      <motion.button
                        key={l.code}
                        whileHover={{ x: 5 }}
                        className={`dropdown-item ${language === l.code ? "active" : ""}`}
                        onClick={() => { handleClick(() => { setLanguage(l.code); setShowLangMenu(false); }); }}
                      >{l.flag} {l.name}</motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="main-content">
          <AnimatePresence mode="wait">
            {activeTab === TABS.HOME && <HomeTab key="home" />}
            {activeTab === TABS.PORTFOLIO && <PortfolioTab key="portfolio" />}
            {activeTab === TABS.SHOP && <ShopTab key="shop" />}
            {activeTab === TABS.CART && <CartTab key="cart" />}
            {activeTab === TABS.LEARN && <LearnTab key="learn" />}
            {activeTab === TABS.PROFILE && <ProfileTab key="profile" />}
            {activeTab === TABS.MORE && <MoreTab key="more" />}
          </AnimatePresence>
        </main>

        <nav className="bottom-nav">
          {[
            { id: TABS.HOME, icon: "🏠", label: TAB_LABELS[language]?.[TABS.HOME]?.label },
            { id: TABS.PORTFOLIO, icon: "🎨", label: TAB_LABELS[language]?.[TABS.PORTFOLIO]?.label },
            { id: TABS.SHOP, icon: "🛍️", label: TAB_LABELS[language]?.[TABS.SHOP]?.label },
            { id: TABS.CART, icon: "🛒", label: TAB_LABELS[language]?.[TABS.CART]?.label, badge: cart.length },
            { id: TABS.LEARN, icon: "📚", label: TAB_LABELS[language]?.[TABS.LEARN]?.label },
            { id: TABS.PROFILE, icon: "👤", label: TAB_LABELS[language]?.[TABS.PROFILE]?.label },
            { id: TABS.MORE, icon: "⋯", label: TAB_LABELS[language]?.[TABS.MORE]?.label },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleClick(() => { setActiveTab(tab.id); setActiveSubTab(null); })}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
              {tab.badge > 0 && <span className="nav-badge">{tab.badge}</span>}
            </motion.button>
          ))}
        </nav>

        <AnimatePresence>
          {showDrawer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="drawer-backdrop"
              onClick={() => setShowDrawer(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25 }}
                className="drawer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="drawer-header"><h3>Menu</h3><motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowDrawer(false)}>✕</motion.button></div>
                <ul>
                  {[
                    TABS.HOME, TABS.PORTFOLIO, TABS.SHOP, TABS.CART, TABS.LEARN, TABS.PROFILE,
                    ...Object.values(SUB_TABS)
                  ].map((item) => (
                    <motion.li
                      key={item}
                      whileHover={{ x: 10 }}
                      onClick={() => {
                        if (Object.values(TABS).includes(item)) {
                          setActiveTab(item);
                          setActiveSubTab(null);
                        } else {
                          setActiveSubTab(item);
                          setActiveTab(TABS.MORE);
                        }
                        setShowDrawer(false);
                      }}
                    >{item}</motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="notifications">
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className={`notification ${n.type}`}
              >{n.message}</motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {selectedItem && <Modal key="modal" />}
      </AnimatePresence>
    </div>
  );
}
