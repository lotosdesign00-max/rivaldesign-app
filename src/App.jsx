import React, { useState } from "react";
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

const TAB_LABELS = {
  ru: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Отзывы",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Обо мне",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI идеи",
  },
  uk: {
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
    [TABS.PRICING]: "Бағалар",
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
  en: {
    [TABS.GALLERY]: "Gallery",
    [TABS.REVIEWS]: "Reviews",
    [TABS.PRICING]: "Pricing",
    [TABS.ABOUT]: "About",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI Ideas",
  },
};

const BASE_TEXTS = {
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
    faqItems: [
      "Как проходит работа?",
      "Какие файлы я получу?",
      "Сколько правок входит в стоимость?",
    ],
    aiTitle: "AI идеи",
    aiSubtitle:
      "Генератор идей для палитр, референсов и концептов (в разработке).",
    bottomOrder: "Оформить заказ",
    bottomGenerate: "Сгенерировать идею",
    orderAlert:
      "Скоро здесь будет переход к твоему Telegram для оформления заказа 😉",
    aiAlert: "Скоро здесь будет генератор идей на AI 🚀",
  },
  uk: {
    appTitle: "Rival App",
    appSubtitle: "портфоліо дизайнера",
    galleryTitle: "Галерея робіт",
    gallerySubtitle: "Аватарки, превʼю, банери та інші проєкти.",
    galleryHint: "Обери категорію зверху та гортай роботи свайпом.",
    reviewsTitle: "Відгуки клієнтів",
    reviewsSubtitle: "Реальні відгуки твоїх клієнтів.",
    reviewsAddButton: "Залишити відгук",
    pricingTitle: "Прайс / Послуги",
    aboutTitle: "Про мене",
    aboutSubtitle:
      "Я Rival, дизайнер. Допомагаю брендам виділятися в соцмережах та рекламі.",
    faqTitle: "FAQ",
    faqItems: [
      "Як проходить робота?",
      "Які файли я отримаю?",
      "Скільки правок входить у вартість?",
    ],
    aiTitle: "AI ідеї",
    aiSubtitle:
      "Генератор ідей для палітр, референсів і концептів (у розробці).",
    bottomOrder: "Оформити замовлення",
    bottomGenerate: "Згенерувати ідею",
    orderAlert:
      "Скоро тут буде перехід у твій Telegram для оформлення замовлення 😉",
    aiAlert: "Скоро тут буде AI-генератор ідей 🚀",
  },
  kz: {
    appTitle: "Rival App",
    appSubtitle: "дизайнер портфолиосы",
    galleryTitle: "Жұмыстар галереясы",
    gallerySubtitle: "Аватарлар, превью, баннерлер және басқа жобалар.",
    galleryHint: "Жоғарыдан категорияны таңдап, жұмыстарды свайппен қара.",
    reviewsTitle: "Клиент пікірлері",
    reviewsSubtitle: "Сенің клиенттеріңнің шынайы пікірлері.",
    reviewsAddButton: "Пікір қалдыру",
    pricingTitle: "Бағалар / Қызметтер",
    aboutTitle: "Мен туралы",
    aboutSubtitle:
      "Мен Rival, дизайнермін. Брендтерге әлеуметтік желі мен жарнамада ерекшеленуге көмектесемін.",
    faqTitle: "FAQ",
    faqItems: [
      "Жұмыс қалай жүреді?",
      "Қандай файлдарды аламын?",
      "Бағаға қанша түзету кіреді?",
    ],
    aiTitle: "AI идеялар",
    aiSubtitle:
      "Түстер палитрасы, референстер және концепттерге арналған идея генераторы (әзірленуде).",
    bottomOrder: "Тапсырыс беру",
    bottomGenerate: "Идея генерациялау",
    orderAlert: "Жақында осында тапсырыс беру үшін Telegram-ға өту шығады 😉",
    aiAlert: "Жақында осында AI идея генераторы болады 🚀",
  },
  by: {
    appTitle: "Rival App",
    appSubtitle: "партфоліа дызайнера",
    galleryTitle: "Галерэя работ",
    gallerySubtitle: "Аватаркі, прэв'ю, банеры і іншыя праекты.",
    galleryHint: "Абяры катэгорыю зверху і гартай работы свайпам.",
    reviewsTitle: "Водгукі кліентаў",
    reviewsSubtitle: "Сапраўдныя водгукі тваіх кліентаў.",
    reviewsAddButton: "Пакінуць водгук",
    pricingTitle: "Прайс / Паслугі",
    aboutTitle: "Пра мяне",
    aboutSubtitle:
      "Я Rival, дызайнер. Дапамагаю брэндам вылучацца ў сацсетках і рэкламе.",
    faqTitle: "FAQ",
    faqItems: [
      "Як праходзіць работа?",
      "Якія файлы я атрымаю?",
      "Колькі праўкі ўваходзіць у кошт?",
    ],
    aiTitle: "AI ідэі",
    aiSubtitle:
      "Генератар ідэй для палітраў, рэферэнсаў і канцэптаў (у распрацоўцы).",
    bottomOrder: "Аформіць заказ",
    bottomGenerate: "Згенераваць ідэю",
    orderAlert:
      "Хутка тут будзе пераход у твой Telegram для афармлення замовы 😉",
    aiAlert: "Хутка тут будзе AI-генератар ідэй 🚀",
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
    faqItems: [
      "How does the process work?",
      "What files will I receive?",
      "How many revisions are included?",
    ],
    aiTitle: "AI ideas",
    aiSubtitle:
      "Idea generator for palettes, references and concepts (coming soon).",
    bottomOrder: "Place an order",
    bottomGenerate: "Generate idea",
    orderAlert: "Soon this will open your Telegram for orders 😉",
    aiAlert: "Soon this will be an AI idea generator 🚀",
  },
};

const RATES = {
  ru: { symbol: "₽", value5: 500, value10: 1000 },
  uk: { symbol: "₴", value5: 200, value10: 400 },
  kz: { symbol: "₸", value5: 2500, value10: 5000 },
  by: { symbol: "BYN", value5: 15, value10: 30 },
  en: { symbol: "$", value5: 5, value10: 10 },
};

function getTextsForLanguage(lang) {
  const base = BASE_TEXTS[lang] || BASE_TEXTS["ru"];
  const rate = RATES[lang] || RATES["en"];

  const pricingItems = {
    ru: [
      `Логотип — от ${rate.value5}${rate.symbol}`,
      `Фирменный стиль — от ${rate.value5}${rate.symbol}`,
      `Оформление соцсетей — от ${rate.value5}${rate.symbol}`,
      `Рекламные баннеры — от ${rate.value5}${rate.symbol}`,
    ],
    uk: [
      `Логотип — від ${rate.value5}${rate.symbol}`,
      `Фірмовий стиль — від ${rate.value5}${rate.symbol}`,
      `Оформлення соцмереж — від ${rate.value5}${rate.symbol}`,
      `Рекламні банери — від ${rate.value5}${rate.symbol}`,
    ],
    kz: [
      `Логотип — ${rate.value5}${rate.symbol} бастап`,
      `Фирмалық стиль — ${rate.value5}${rate.symbol} бастап`,
      `Әлеуметтік желі дизайны — ${rate.value5}${rate.symbol} бастап`,
      `Жарнамалық баннерлер — ${rate.value5}${rate.symbol} бастап`,
    ],
    by: [
      `Лагатып — ад ${rate.value5} ${rate.symbol}`,
      `Фірмовы стыль — ад ${rate.value5} ${rate.symbol}`,
      `Афармленне сацсетак — ад ${rate.value5} ${rate.symbol}`,
      `Рэкламныя банеры — ад ${rate.value5} ${rate.symbol}`,
    ],
    en: [
      `Logo — from ${rate.symbol}${rate.value5}`,
      `Brand identity — from ${rate.symbol}${rate.value5}`,
      `Social media design — from ${rate.symbol}${rate.value5}`,
      `Ad banners — from ${rate.symbol}${rate.value5}`,
    ],
  }[lang] || [`Service — from ${rate.value5}${rate.symbol}`];

  const animationNoteMap = {
    ru: `Анимация: +${rate.value10}${rate.symbol} к цене`,
    uk: `Анімація: +${rate.value10}${rate.symbol} до ціни`,
    kz: `Анимация: бағаға +${rate.value10}${rate.symbol}`,
    by: `Анімацыя: +${rate.value10}${rate.symbol} да кошту`,
    en: `Animation: +${rate.symbol}${rate.value10} to the price`,
  };

  return {
    ...base,
    pricingItems,
    pricingAnimationNote: animationNoteMap[lang] || animationNoteMap["en"],
  };
}

const GALLERY_CATEGORIES = ["Аватарки", "Превью", "Баннеры"];

const GALLERY_ITEMS = [
  {
    id: "1",
    category: "Аватарки",
    title: "Аватар 1",
    image: "/images/podborka1.jpg",
    description: "Описание аватарки 1",
  },
  {
    id: "2",
    category: "Превью",
    title: "Превью 1",
    image: "/images/preview1.jpg",
    description: "Описание превью 1",
  },
  {
    id: "3",
    category: "Баннеры",
    title: "Баннер 1",
    image: "/images/banner1.jpg",
    description: "Описание баннера 1",
  },
  {
    id: "4",
    category: "Аватарки",
    title: "Аватар 2",
    image: "/images/avatar2.jpg",
    description: "Описание аватарки 2",
  },
];

const REVIEWS_ITEMS = [
  { id: "r1", name: "Alice", text: "Отличная работа!" },
  { id: "r2", name: "Bob", text: "Очень понравилось." },
  { id: "r3", name: "Charlie", text: "Буду обращаться ещё." },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("ru");
  const [activeCategory, setActiveCategory] = useState(GALLERY_CATEGORIES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const t = getTextsForLanguage(language);
  const labels = TAB_LABELS[language] || TAB_LABELS["ru"];

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "alt" : "dark"));

  const toggleLangMenu = () => setShowLangMenu((prev) => !prev);

  const handleLangChange = (lang) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const handleBottomButton = () => {
    if (activeTab === TABS.AI) {
      alert(t.aiAlert);
    } else {
      alert(t.orderAlert);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <div className="card">
            <h2 className="section-title">{t.galleryTitle}</h2>
            <p className="section-subtitle">{t.gallerySubtitle}</p>
            <div className="tabs">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={
                    "tab-btn" +
                    (cat === activeCategory ? " tab-btn-active" : "")
                  }
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {GALLERY_ITEMS.filter(
                (p) => p.category === activeCategory
              ).map((p) => (
                <SwiperSlide key={p.id} style={{ width: 140 }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="project-img-thumb"
                    style={{ width: "140px", height: "auto", objectFit: "cover" }}
                    onClick={() => setModalImage(p.image)}
                  />
                  <p className="hint-text">{p.title}</p>
                </SwiperSlide>
              ))}
            </Swiper>
            <p className="hint-text">{t.galleryHint}</p>
          </div>
        );

      case TABS.REVIEWS:
        return (
          <div className="card">
            <h2 className="section-title">{t.reviewsTitle}</h2>
            <p className="section-subtitle">{t.reviewsSubtitle}</p>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {REVIEWS_ITEMS.map((r) => (
                <SwiperSlide key={r.id} style={{ width: 250 }}>
                  <div className="card">
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        marginBottom: "4px",
                      }}
                    >
                      {r.name[0]}
                    </div>
                    <div>{r.name}</div>
                    <div className="hint-text">{r.text}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="secondary-btn" style={{ marginTop: 10 }}>
              {t.reviewsAddButton}
            </button>
          </div>
        );

      case TABS.PRICING:
        return (
          <div className="card">
            <h2 className="section-title">{t.pricingTitle}</h2>
            <ul className="list">
              {t.pricingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="hint-text" style={{ marginTop: 8 }}>
              {t.pricingAnimationNote}
            </p>
          </div>
        );

      case TABS.ABOUT:
        return (
          <div className="card">
            <h2 className="section-title">{t.aboutTitle}</h2>
            <p className="section-subtitle">{t.aboutSubtitle}</p>
          </div>
        );

      case TABS.FAQ:
        return (
          <div className="card">
            <h2 className="section-title">{t.faqTitle}</h2>
            <ul className="list">
              {t.faqItems.map((item, idx) => (
