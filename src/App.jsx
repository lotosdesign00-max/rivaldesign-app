import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const TABS = {
  GALLERY: "gallery",
  REVIEWS: "reviews",
  PRICING: "pricing",
  ABOUT: "about",
  FAQ: "faq",
  AI: "ai",
};

// ТЕМЫ С ЦВЕТОВЫМИ СХЕМАМИ (фиксированные цвета)
const THEMES = {
  DARK: {
    id: "dark",
    name: "Темная",
    icon: "🌙",
    colors: {
      primary: "#0a0a0a",
      secondary: "#1a1a1a",
      accent: "#7c3aed",
      text: "#f8fafc",
      textSecondary: "#94a3b8",
      border: "#2d3748",
      card: "#1a1a1a",
      button: "#7c3aed",
      buttonText: "#ffffff",
      tabActive: "#7c3aed",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
      gradient: "linear-gradient(145deg, #0a0a0a, #1a1a1a)"
    }
  },
  LIGHT: {
    id: "light", 
    name: "Светлая",
    icon: "☀️",
    colors: {
      primary: "#f1f5f9",
      secondary: "#ffffff",
      accent: "#2563eb",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      card: "#ffffff",
      button: "#2563eb",
      buttonText: "#ffffff",
      tabActive: "#2563eb",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      gradient: "linear-gradient(145deg, #f1f5f9, #e2e8f0)"
    }
  },
  RED: {
    id: "red",
    name: "Красная",
    icon: "🔴",
    colors: {
      primary: "#1a0000",
      secondary: "#2a0000",
      accent: "#dc2626",
      text: "#fef2f2",
      textSecondary: "#fca5a5",
      border: "#7f1d1d",
      card: "#2a0000",
      button: "#dc2626",
      buttonText: "#ffffff",
      tabActive: "#dc2626",
      shadow: "0 4px 12px rgba(220, 38, 38, 0.15)",
      gradient: "linear-gradient(145deg, #1a0000, #2a0000)"
    }
  },
  BLUE: {
    id: "blue",
    name: "Синяя",
    icon: "🔵",
    colors: {
      primary: "#0c1a2d",
      secondary: "#1e293b",
      accent: "#0ea5e9",
      text: "#e2e8f0",
      textSecondary: "#94a3b8",
      border: "#334155",
      card: "#1e293b",
      button: "#0ea5e9",
      buttonText: "#ffffff",
      tabActive: "#0ea5e9",
      shadow: "0 4px 12px rgba(14, 165, 233, 0.1)",
      gradient: "linear-gradient(145deg, #0c1a2d, #1e293b)"
    }
  },
  PURPLE: {
    id: "purple",
    name: "Фиолетовая",
    icon: "🟣",
    colors: {
      primary: "#1e0b3a",
      secondary: "#2d1b4e",
      accent: "#a855f7",
      text: "#f5f3ff",
      textSecondary: "#c4b5fd",
      border: "#4c1d95",
      card: "#2d1b4e",
      button: "#a855f7",
      buttonText: "#ffffff",
      tabActive: "#a855f7",
      shadow: "0 4px 12px rgba(168, 85, 247, 0.1)",
      gradient: "linear-gradient(145deg, #1e0b3a, #2d1b4e)"
    }
  },
  GRADIENT: {
    id: "gradient",
    name: "Градиент",
    icon: "🌈",
    colors: {
      primary: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      secondary: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
      accent: "#ffd166",
      text: "#ffffff",
      textSecondary: "rgba(255,255,255,0.85)",
      border: "rgba(255,255,255,0.25)",
      card: "rgba(255,255,255,0.12)",
      button: "#ffd166",
      buttonText: "#000000",
      tabActive: "#ffd166",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
    }
  },
  NEON: {
    id: "neon",
    name: "Неон",
    icon: "💡",
    colors: {
      primary: "#000000",
      secondary: "#0a0a0a",
      accent: "#00ff9d",
      text: "#ffffff",
      textSecondary: "#00ff9d",
      border: "#00ff9d",
      card: "#0a0a0a",
      button: "#00ff9d",
      buttonText: "#000000",
      tabActive: "#00ff9d",
      shadow: "0 0 10px rgba(0, 255, 157, 0.3)",
      gradient: "linear-gradient(145deg, #000000, #0a0a0a)"
    }
  }
};

// Курсы валют (примерные)
const EXCHANGE_RATES = {
  USD: 1,
  RUB: 95,
  UAH: 40,
  BYN: 3.2,
  KZT: 450,
};

const LANGUAGE_TO_CURRENCY = {
  ru: { symbol: "₽", code: "RUB" },
  ua: { symbol: "₴", code: "UAH" },
  en: { symbol: "$", code: "USD" },
  by: { symbol: "Br", code: "BYN" },
  kz: { symbol: "₸", code: "KZT" },
};

const TAB_LABELS = {
  ru: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Отзывы",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Обо мне",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI идеи",
  },
  en: {
    [TABS.GALLERY]: "Gallery",
    [TABS.REVIEWS]: "Reviews",
    [TABS.PRICING]: "Pricing",
    [TABS.ABOUT]: "About",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI Ideas",
  },
  ua: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Відгуки",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Про мене",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI ідеї",
  },
  kz: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Пікірлер",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Мен туралы",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI идеялар",
  },
  by: {
    [TABS.GALLERY]: "Галерэя",
    [TABS.REVIEWS]: "Водгукі",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Пра мяне",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI ідэі",
  },
};

// Категории галереи для разных языков
const GALLERY_CATEGORIES_TRANSLATIONS = {
  ru: ["Аватарки", "Превью", "Баннеры"],
  en: ["Avatars", "Previews", "Banners"],
  ua: ["Аватарки", "Прев'ю", "Банери"],
  kz: ["Аватарлар", "Превью", "Баннерлер"],
  by: ["Аватаркі", "Прэв'ю", "Банеры"]
};

// FAQ вопросы для разных языков
const FAQ_ITEMS_TRANSLATIONS = {
  ru: [
    "Как проходит работа?",
    "Какие файлы я получу?",
    "Сколько правок входит в стоимость?",
  ],
  en: [
    "How does the process work?",
    "What files will I receive?",
    "How many revisions are included?",
  ],
  ua: [
    "Як проходить робота?",
    "Які файли я отримаю?",
    "Скільки правок входить у вартість?",
  ],
  kz: [
    "Жұмыс қалай өтеді?",
    "Қандай файлдарды аламын?",
    "Қанша өзгеріс енгізуге болады?",
  ],
  by: [
    "Як праходзіць работа?",
    "Якія файлы я атрымаю?",
    "Колькі праўкі ўваходзіць у кошт?",
  ]
};

// Текст для кнопки "нажми, чтобы увеличить"
const ZOOM_HINT_TRANSLATIONS = {
  ru: "🔍 нажми, чтобы увеличить",
  en: "🔍 click to zoom",
  ua: "🔍 натисніть, щоб збільшити",
  kz: "🔍 үлкейту үшін басыңыз",
  by: "🔍 націсніце, каб павялічыць"
};

const TEXTS = {
  ru: {
    appTitle: "Rival App",
    appSubtitle: "портфолио дизайнера",
    galleryTitle: "Галерея работ",
    gallerySubtitle: "Аватарки, превью, баннеры и другие проекты.",
    galleryHint: "Выбери категорию сверху и листай работы свайпом.",
    reviewsTitle: "Отзывы клиентов",
    reviewsSubtitle: "Настоящие отзывы твоих клиентов.",
    reviewsAddButton: "Оставить отзыв",
    pricingTitle: "Прайс / Услуги",
    aboutTitle: "Обо мне",
    aboutSubtitle:
      "Я Rival, дизайнер. Помогаю брендам выделяться в соцсетях и рекламе.",
    faqTitle: "FAQ",
    aiTitle: "AI идеи",
    aiSubtitle:
      "Генератор идей для палитр, референсов и концептов (в разработке).",
    bottomOrder: "Оформить заказ",
    bottomGenerate: "Сгенерировать идею",
    orderAlert:
      "Скоро здесь будет переход к твоему Telegram для оформления заказа 😉",
    aiAlert: "Скоро здесь будет генератор идей на AI 🚀",
  },
  en: {
    appTitle: "Rival App",
    appSubtitle: "designer portfolio",
    galleryTitle: "Portfolio",
    gallerySubtitle: "Avatars, thumbnails, banners and other projects.",
    galleryHint: "Choose a category above and swipe through your works.",
    reviewsTitle: "Client reviews",
    reviewsSubtitle: "Real feedback from your clients.",
    reviewsAddButton: "Leave a review",
    pricingTitle: "Pricing / Services",
    aboutTitle: "About me",
    aboutSubtitle:
      "I'm Rival, a designer. I help brands stand out in social media and advertising.",
    faqTitle: "FAQ",
    aiTitle: "AI ideas",
    aiSubtitle:
      "Idea generator for palettes, references and concepts (coming soon).",
    bottomOrder: "Place an order",
    bottomGenerate: "Generate idea",
    orderAlert: "Soon this will open your Telegram for orders 😉",
    aiAlert: "Soon this will be an AI idea generator 🚀",
  },
  ua: {
    appTitle: "Rival App",
    appSubtitle: "портфоліо дизайнера",
    galleryTitle: "Галерея робіт",
    gallerySubtitle: "Аватарки, прев'ю, банери та інші проєкти.",
    galleryHint: "Обери категорію зверху та гортай роботи свайпом.",
    reviewsTitle: "Відгуки клієнтів",
    reviewsSubtitle: "Реальні відгуки твоїх клієнтів.",
    reviewsAddButton: "Залишити відгук",
    pricingTitle: "Прайс / Послуги",
    aboutTitle: "Про мене",
    aboutSubtitle:
      "Я Rival, дизайнер. Допомагаю брендам виділятися в соцмережах та рекламі.",
    faqTitle: "FAQ",
    aiTitle: "AI ідеї",
    aiSubtitle:
      "Генератор ідей для палітр, референсів та концептів (у розробці).",
    bottomOrder: "Замовити дизайн",
    bottomGenerate: "Згенерувати ідею",
    orderAlert: "Скоро тут буде перехід у твій Telegram для замовлення 😉",
    aiAlert: "Скоро тут буде AI-генератор ідей 🚀",
  },
  kz: {
    appTitle: "Rival App",
    appSubtitle: "дизайнер портфолиосы",
    galleryTitle: "Жұмыстар галереясы",
    gallerySubtitle: "Аватарлар, превью, баннерлер және басқа жобалар.",
    galleryHint: "Жоғарыдан санатты таңда да, жұмыстарды свайппен қара.",
    reviewsTitle: "Клиент пікірлері",
    reviewsSubtitle: "Нағыз клиенттерден пікірлер.",
    reviewsAddButton: "Пікір қалдыру",
    pricingTitle: "Прайс / Қызметтер",
    aboutTitle: "Мен туралы",
    aboutSubtitle:
      "Мен Rival, дизайнермін. Брендтерге әлеуметтік желілерде және жарнамада ерекшеленуге көмектесемін.",
    faqTitle: "FAQ",
    aiTitle: "AI идеялар",
    aiSubtitle:
      "Палитралар, референстер және концепттер үшін идея генераторы (әзірлеуде).",
    bottomOrder: "Дизайнға тапсырыс беру",
    bottomGenerate: "Идея генерациялау",
    orderAlert:
      "Жақында мұнда тапсырыс беру үшін сенің Telegram-ыңа өтуді қосамыз 😉",
    aiAlert: "Жақында мұнда AI идея генераторы болады 🚀",
  },
  by: {
    appTitle: "Rival App",
    appSubtitle: "партфоліа дызайнера",
    galleryTitle: "Галерэя работ",
    gallerySubtitle: "Аватаркі, прэв'ю, банеры і іншыя праекты.",
    galleryHint: "Абяры катэгорыю зверху і ліставай работы свайпам.",
    reviewsTitle: "Водгукі кліентаў",
    reviewsSubtitle: "Сапраўдныя водгукі тваіх кліентаў.",
    reviewsAddButton: "Пакінуць водгук",
    pricingTitle: "Прайс / Паслугі",
    aboutTitle: "Пра мяне",
    aboutSubtitle:
      "Я Rival, дызайнер. Дапамагаю брэндам выдзяляцца ў сацсетках і рэкламе.",
    faqTitle: "FAQ",
    aiTitle: "AI ідэі",
    aiSubtitle:
      "Генератар ідэй для палітр, рэферансаў і канцэптаў (у распрацоўцы).",
    bottomOrder: "Замовіць дызайн",
    bottomGenerate: "Згенераваць ідэю",
    orderAlert: "Хутка тут будзе пераход у твой Telegram для замовы 😉",
    aiAlert: "Хутка тут будзе AI-генератар ідэй 🚀",
  },
};

// Исходные данные галереи (на русском)
const GALLERY_ITEMS_RU = [
  { id: "4", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 4.jpg", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "1", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 1.jpg", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "2", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 2.jpg", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "3", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 3.jpg", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "20", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 1.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "21", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 2.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "22", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 3.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "23", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 4.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "24", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 5.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "3", category: "Баннеры", title: "Баннер 1", image: "/images/banner1.jpg", description: "Описание баннера 1" },
];

// Трансляции для галереи
const GALLERY_TRANSLATIONS = {
  ru: GALLERY_ITEMS_RU,
  en: [ 
    { id: "4", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 4.jpg", description: "Bring your idea to life in design with us" },
    { id: "1", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 1.jpg", description: "Bring your idea to life in design with us" },
    { id: "2", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 2.jpg", description: "Bring your idea to life in design with us" },
    { id: "3", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 3.jpg", description: "Bring your idea to life in design with us" },
    { id: "20", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 1.jpg", description: "Bring your idea to life in design with us" },
    { id: "21", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 2.jpg", description: "Bring your idea to life in design with us" },
    { id: "22", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 3.jpg", description: "Bring your idea to life in design with us" },
    { id: "23", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 4.jpg", description: "Bring your idea to life in design with us" },
    { id: "24", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 5.jpg", description: "Bring your idea to life in design with us" },
    { id: "3", category: "Banners", title: "Banner 1", image: "/images/banner1.jpg", description: "Banner description 1" },
  ],
  ua: [
    { id: "4", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 4.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "1", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 1.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "2", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 2.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "3", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 3.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "20", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 1.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "21", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 2.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "22", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 3.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "23", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 4.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "24", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 5.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "3", category: "Банери", title: "Банер 1", image: "/images/banner1.jpg", description: "Опис банера 1" },
  ],
  kz: [
    { id: "4", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 4.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "1", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 1.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "2", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 2.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "3", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 3.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "20", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 1.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "21", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 2.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "22", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 3.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "23", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 4.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "24", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 5.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "3", category: "Баннерлер", title: "Баннер 1", image: "/images/banner1.jpg", description: "Баннер сипаттамасы 1" },
  ],
  by: [
    { id: "4", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 4.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "1", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 1.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "2", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 2.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "3", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 3.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "20", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 1.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "21", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 2.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "22", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 3.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "23", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 4.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "24", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 5.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "3", category: "Банеры", title: "Банер 1", image: "/images/banner1.jpg", description: "Апісанне банеру 1" },
  ]
};

const REVIEWS_ITEMS = [
  { 
    id: "r1", 
    name: "W1tex", 
    text: "Работа выполнена превосходно, очень доволен результатом." 
  },
  { 
    id: "r2", 
    name: "Shyngyzx", 
    text: "Отличный специалист, рекомендую к сотрудничеству." 
  },
  { 
    id: "r3", 
    name: "Butter", 
    text: "Качество работы на высшем уровне, оценка 10/10." 
  },
  { 
    id: "r4", 
    name: "scarlet roses", 
    text: "Благодарю за проделанную работу, всё выполнено профессионально." 
  },
  { 
    id: "r5", 
    name: "Solevoy", 
    text: "Рекомендую всем — работа выполнена безупречно." 
  },
  { 
    id: "r6", 
    name: "Aero", 
    text: "Отличный результат, спасибо за качественную работу." 
  },
  { 
    id: "r7", 
    name: "Firessk", 
    text: "Большое спасибо, обязательно порекомендую вас своим знакомым." 
  },
  { 
    id: "r8", 
    name: "Helvite", 
    text: "Работа выполнена на оценку 10/10, всё качественно." 
  },
  { 
    id: "r9", 
    name: "Usepsyho", 
    text: "Всё выполнено быстро и профессионально, 10/10." 
  },
  { 
    id: "r10", 
    name: "Filling", 
    text: "Отличная работа, оценка 9/10, очень качественно." 
  },
  { 
    id: "r11", 
    name: "Arthur", 
    text: "Благодарю за профессиональный подход." 
  },
  { 
    id: "r12", 
    name: "Kupiz", 
    text: "Всё выполнено чётко и качественно." 
  },
  { 
    id: "r13", 
    name: "Du", 
    text: "Полностью доволен результатом, получил всё что хотел." 
  },
  { 
    id: "r14", 
    name: "ZetaMert", 
    text: "Всё отлично, работа выполнена качественно." 
  },
  { 
    id: "r15", 
    name: "Rare", 
    text: "Работа выполнена в указанные сроки, даже быстрее. Рекомендую специалиста @Rivaldsg." 
  },
  { 
    id: "r16", 
    name: "Xyi v tapke", 
    text: "Отличный результат, очень доволен." 
  },
  { 
    id: "r17", 
    name: "Yvonne", 
    text: "Работа выполнена именно так, как я и хотел." 
  },
  { 
    id: "r18", 
    name: "Wised", 
    text: "Заказывал баннер и аватарку — рекомендую специалиста @Rivaldsg, работа выполнена профессионально." 
  },
  { 
    id: "r19", 
    name: "Zahar", 
    text: "@Rivaldsg оперативно выполнил заказ, всё чётко и быстро." 
  }
];
// Базовые цены в USD
const BASE_PRICES = [
  { id: 1, service: "Аватарка", priceUSD: 5 },
  { id: 2, service: "Превью", priceUSD: 5 },
  { id: 3, service: "Баннеры", priceUSD: 5 },
  { id: 4, service: "Логотип", priceUSD: 5 },
];

const SERVICES_TRANSLATIONS = {
  ru: {
    "Аватарка": "Аватарка",
    "Превью": "Превью",
    "Баннеры": "Баннеры",
    "Логотип": "Логотип"
  },
  en: {
    "Аватарка": "Avatar",
    "Превью": "Preview",
    "Баннеры": "Banner",
    "Логотип": "Logo"
  },
  ua: {
    "Аватарка": "Аватарка",
    "Превью": "Прев'ю",
    "Баннеры": "Банер",
    "Логотип": "Логотип"
  },
  kz: {
    "Аватарка": "Аватар",
    "Превью": "Алдын ала қарау",
    "Баннеры": "Баннер",
    "Логотип": "Логотипі"
  },
  by: {
    "Аватарка": "Аватарка",
    "Превью": "Папярэдні прагляд",
    "Баннеры": "Банэр",
    "Логотип": "Лагатып"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState(THEMES.DARK);
  const [language, setLanguage] = useState("ru");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Аватарки");
  const [selectedImage, setSelectedImage] = useState(null);

  // Сохранение темы в localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme && THEMES[savedTheme.toUpperCase()]) {
      setTheme(THEMES[savedTheme.toUpperCase()]);
    }
  }, []);

  // Сброс активной категории при смене языка
  useEffect(() => {
    // Устанавливаем первую категорию для текущего языка
    const categories = GALLERY_CATEGORIES_TRANSLATIONS[language];
    if (categories && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [language]);

  const saveTheme = (themeId) => {
    localStorage.setItem("appTheme", themeId);
  };

  const currencyInfo = LANGUAGE_TO_CURRENCY[language];
  const t = TEXTS[language];
  const labels = TAB_LABELS[language];
  const galleryCategories = GALLERY_CATEGORIES_TRANSLATIONS[language] || GALLERY_CATEGORIES_TRANSLATIONS.ru;
  const faqItems = FAQ_ITEMS_TRANSLATIONS[language] || FAQ_ITEMS_TRANSLATIONS.ru;
  const galleryItems = GALLERY_TRANSLATIONS[language] || GALLERY_TRANSLATIONS.ru;
  const zoomHint = ZOOM_HINT_TRANSLATIONS[language] || ZOOM_HINT_TRANSLATIONS.ru;

  // Функция конвертации цены
  const convertPrice = (priceUSD) => {
    const rate = EXCHANGE_RATES[currencyInfo.code];
    return Math.round(priceUSD * rate);
  };

  // Функция форматирования цены
  const formatPrice = (priceUSD) => {
    const converted = convertPrice(priceUSD);
    return `${converted} ${currencyInfo.symbol}`;
  };

  // Получение переведенных названий услуг
  const getTranslatedServices = () => {
    return BASE_PRICES.map(item => ({
      ...item,
      translatedService: SERVICES_TRANSLATIONS[language][item.service] || item.service
    }));
  };

  const toggleTheme = () => {
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.findIndex(key => THEMES[key].id === theme.id);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    const newTheme = THEMES[themeKeys[nextIndex]];
    setTheme(newTheme);
    saveTheme(newTheme.id);
  };

  const selectTheme = (themeObj) => {
    setTheme(themeObj);
    saveTheme(themeObj.id);
    setShowThemeMenu(false);
  };

  const toggleLangMenu = () => {
    setShowLangMenu(prev => !prev);
    setShowThemeMenu(false);
  };

  const toggleThemeMenu = () => {
    setShowThemeMenu(prev => !prev);
    setShowLangMenu(false);
  };

  const handleLangChange = (lang) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const handleBottomButton = () => {
    if (activeTab === TABS.AI) {
      alert(t.aiAlert);
    } else {
      // Определяем, какую услугу просматривает пользователь
      let serviceType = "дизайн";
      if (activeTab === TABS.PRICING) {
        // Если пользователь в разделе Pricing, можно определить конкретную услугу
        serviceType = "услугу из прайса";
      } else if (activeTab === TABS.GALLERY) {
        serviceType = "работу из галереи";
      }
      
      // Создаем сообщение
      const message = encodeURIComponent(
        `Привет! Я с твоего портфолио. Хочу заказать ${serviceType}. ` +
        `Язык интерфейса: ${labels[TABS.ABOUT] === "Обо мне" ? "русский" : language}`
      );
      
      window.open(`https://t.me/Rivaldsg?text=${message}`, "_blank");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <div className="card" style={{ background: theme.colors.card, boxShadow: theme.colors.shadow }}>
            <h2 className="section-title" style={{ color: theme.colors.text }}>{t.galleryTitle}</h2>
            <p className="section-subtitle" style={{ color: theme.colors.textSecondary }}>{t.gallerySubtitle}</p>
            
            {/* Кнопки категорий с переводами */}
            <div 
              className="tabs" 
              style={{ 
                borderBottom: `1px solid ${theme.colors.border}`,
                background: theme.colors.secondary,
                borderRadius: '8px',
                padding: '4px',
                marginBottom: '16px'
              }}
            >
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  className={"tab-btn" + (cat === activeCategory ? " tab-btn-active" : "")}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    color: cat === activeCategory ? theme.colors.accent : theme.colors.textSecondary,
                    borderBottom: cat === activeCategory ? `2px solid ${theme.colors.accent}` : 'none',
                    background: 'transparent'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {galleryItems
                .filter((p) => p.category === activeCategory)
                .map((p) => (
                <SwiperSlide key={p.id} style={{ width: 220 }}>
                  <div 
                    className="project-card" 
                    onClick={() => setSelectedImage(p)} 
                    style={{ 
                      cursor: "pointer",
                      background: theme.colors.card,
                      border: `1px solid ${theme.colors.border}`,
                      boxShadow: theme.colors.shadow
                    }}
                  >
                    <div className="project-thumb-wrapper">
                      <img src={p.image} alt={p.title} className="project-thumb-img" />
                    </div>
                    <div className="project-info">
                      <div className="project-title" style={{ color: theme.colors.text }}>{p.title}</div>
                      <p className="hint-text" style={{ color: theme.colors.textSecondary }}>{p.description}</p>
                      <span className="hint-text" style={{ color: theme.colors.accent }}>{zoomHint}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <p className="hint-text" style={{ color: theme.colors.textSecondary }}>{t.galleryHint}</p>
          </div>
        );

      case TABS.REVIEWS:
        return (
          <div className="card" style={{ background: theme.colors.card, boxShadow: theme.colors.shadow }}>
            <h2 className="section-title" style={{ color: theme.colors.text }}>{t.reviewsTitle}</h2>
            <p className="section-subtitle" style={{ color: theme.colors.textSecondary }}>{t.reviewsSubtitle}</p>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {REVIEWS_ITEMS.map((r) => (
                <SwiperSlide key={r.id} style={{ width: 250 }}>
                  <div 
                    className="card" 
                    style={{ 
                      background: theme.colors.card,
                      border: `1px solid ${theme.colors.border}`,
                      boxShadow: theme.colors.shadow
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "24px", marginBottom: "4px", color: theme.colors.accent }}>
                      {r.name[0]}
                    </div>
                    <div style={{ color: theme.colors.text }}>{r.name}</div>
                    <div className="hint-text" style={{ color: theme.colors.textSecondary }}>{r.text}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button 
              className="secondary-btn" 
              style={{ 
                marginTop: 10,
                background: theme.colors.secondary,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              {t.reviewsAddButton}
            </button>
          </div>
        );

      case TABS.PRICING:
        const translatedServices = getTranslatedServices();
        return (
          <div className="card" style={{ background: theme.colors.card, boxShadow: theme.colors.shadow }}>
            <h2 className="section-title" style={{ color: theme.colors.text }}>{t.pricingTitle}</h2>
            <div className="currency-hint" style={{ fontSize: "12px", color: theme.colors.textSecondary, marginBottom: "10px" }}>
              Цены в {currencyInfo.symbol} (курс: 1$ ≈ {EXCHANGE_RATES[currencyInfo.code]} {currencyInfo.symbol})
            </div>
            <ul className="list">
              {translatedServices.map((item) => (
                <li key={item.id} style={{ color: theme.colors.text }}>
                  {item.translatedService} — от {formatPrice(item.priceUSD)}
                </li>
              ))}
            </ul>
          </div>
        );

      case TABS.ABOUT:
        return (
          <div className="card" style={{ background: theme.colors.card, boxShadow: theme.colors.shadow }}>
            <h2 className="section-title" style={{ color: theme.colors.text }}>{t.aboutTitle}</h2>
            <p className="section-subtitle" style={{ color: theme.colors.textSecondary }}>{t.aboutSubtitle}</p>
          </div>
        );

      case TABS.FAQ:
        return (
          <div className="card" style={{ background: theme.colors.card, boxShadow: theme.colors.shadow }}>
            <h2 className="section-title" style={{ color: theme.colors.text }}>{t.faqTitle}</h2>
            <ul className="list">
              {faqItems.map((item, index) => (
                <li key={index} style={{ color: theme.colors.text }}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case TABS.AI:
        return (
          <div className="card" style={{ background: theme.colors.card, boxShadow: theme.colors.shadow }}>
            <h2 className="section-title" style={{ color: theme.colors.text }}>{t.aiTitle}</h2>
            <p className="section-subtitle" style={{ color: theme.colors.textSecondary }}>{t.aiSubtitle}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`app-root theme-${theme.id}`} style={{ background: theme.colors.primary }}>
      <div className="app-shell">
        {/* Верхняя панель */}
        <div 
          className="top-bar" 
          style={{ 
            background: theme.colors.secondary,
            borderBottom: `1px solid ${theme.colors.border}`
          }}
        >
          <div className="top-bar-left">
            <span className="app-title" style={{ color: theme.colors.text }}>{t.appTitle}</span>
            <span className="app-subtitle" style={{ color: theme.colors.textSecondary }}>{t.appSubtitle}</span>
          </div>

          <div className="controls">
            {/* Меню тем */}
            <div style={{ position: "relative", marginRight: "8px" }}>
              <button 
                className="icon-btn" 
                onClick={toggleThemeMenu}
                style={{ 
                  background: theme.colors.accent,
                  color: theme.colors.buttonText,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                {theme.icon}
              </button>

              {showThemeMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    background: theme.colors.card,
                    borderRadius: "12px",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    boxShadow: theme.colors.shadow,
                    border: `1px solid ${theme.colors.border}`,
                    zIndex: 20,
                    minWidth: "140px"
                  }}
                >
                  {Object.values(THEMES).map((themeOption) => (
                    <button
                      key={themeOption.id}
                      className="theme-option"
                      onClick={() => selectTheme(themeOption)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: theme.id === themeOption.id ? theme.colors.accent + "20" : "transparent",
                        border: "none",
                        color: theme.id === themeOption.id ? theme.colors.accent : theme.colors.text,
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.accent + "10"}
                      onMouseLeave={(e) => e.currentTarget.style.background = theme.id === themeOption.id ? theme.colors.accent + "20" : "transparent"}
                    >
                      <span style={{ fontSize: "16px" }}>{themeOption.icon}</span>
                      <span>{themeOption.name}</span>
                      {theme.id === themeOption.id && (
                        <span style={{ marginLeft: "auto", color: theme.colors.accent }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Меню языка */}
            <div style={{ position: "relative" }}>
              <button 
                className="icon-btn" 
                onClick={toggleLangMenu}
                style={{ 
                  background: theme.colors.secondary,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                🌐
              </button>

              {showLangMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    background: theme.colors.card,
                    borderRadius: "12px",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    boxShadow: theme.colors.shadow,
                    border: `1px solid ${theme.colors.border}`,
                    zIndex: 10,
                    minWidth: "140px"
                  }}
                >
                  {Object.entries(LANGUAGE_TO_CURRENCY).map(([langCode, currency]) => (
                    <button
                      key={langCode}
                      className="tab-btn"
                      onClick={() => handleLangChange(langCode)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: language === langCode ? theme.colors.accent + "20" : "transparent",
                        border: "none",
                        color: language === langCode ? theme.colors.accent : theme.colors.text,
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.accent + "10"}
                      onMouseLeave={(e) => e.currentTarget.style.background = language === langCode ? theme.colors.accent + "20" : "transparent"}
                    >
                      <span>
                        {langCode === "ru" && "🇷🇺"}
                        {langCode === "ua" && "🇺🇦"}
                        {langCode === "en" && "🇺🇸"}
                        {langCode === "kz" && "🇰🇿"}
                        {langCode === "by" && "🇧🇾"}
                      </span>
                      <span>
                        {langCode === "ru" && "Русский"}
                        {langCode === "ua" && "Українська"}
                        {langCode === "en" && "English"}
                        {langCode === "kz" && "Қазақша"}
                        {langCode === "by" && "Беларуская"}
                      </span>
                      {language === langCode && (
                        <span style={{ marginLeft: "auto", color: theme.colors.accent }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Основные вкладки */}
        <nav 
          className="tabs" 
          style={{ 
            borderBottom: `1px solid ${theme.colors.border}`,
            background: theme.colors.secondary
          }}
        >
          {Object.values(TABS).map((tab) => (
            <button
              key={tab}
              className={"tab-btn" + (activeTab === tab ? " tab-btn-active" : "")}
              onClick={() => setActiveTab(tab)}
              style={{
                color: activeTab === tab ? theme.colors.accent : theme.colors.textSecondary,
                borderBottom: activeTab === tab ? `2px solid ${theme.colors.accent}` : 'none',
                background: 'transparent'
              }}
            >
              {labels[tab]}
            </button>
          ))}
        </nav>

        {/* Контент */}
        <main className="tab-content">
          {renderContent()}
        </main>

        {/* Нижняя кнопка */}
        <button
          className="primary-btn fixed-order-btn"
          onClick={handleBottomButton}
          style={{
            background: theme.colors.button,
            color: theme.colors.buttonText,
            border: `1px solid ${theme.colors.accent}`,
          }}
        >
          {activeTab === TABS.AI ? t.bottomGenerate : t.bottomOrder}
        </button>
      </div>

      {/* Модальное окно для увеличенной картинки */}
      {selectedImage && (
        <div 
          className="image-modal-backdrop" 
          onClick={() => setSelectedImage(null)}
          style={{ background: 'rgba(0,0,0,0.9)' }}
        >
          <div 
            className="image-modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.colors.shadow
            }}
          >
            <button 
              className="icon-btn image-modal-close" 
              onClick={() => setSelectedImage(null)}
              style={{ 
                background: theme.colors.accent,
                color: theme.colors.buttonText,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              ✖
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="image-modal-img"
            />
            <div className="image-modal-text">
              <h3 style={{ color: theme.colors.text }}>{selectedImage.title}</h3>
              <p style={{ color: theme.colors.textSecondary }}>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
