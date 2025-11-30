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
    pricingItems: [
      "Логотип — от X грн",
      "Фирменный стиль — от X грн",
      "Оформление соцсетей — от X грн",
      "Рекламные баннеры — от X грн",
    ],

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
    pricingItems: [
      "Logo — from X UAH",
      "Brand identity — from X UAH",
      "Social media design — from X UAH",
      "Ad banners — from X UAH",
    ],

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

  ua: {
    appTitle: "Rival App",
    appSubtitle: "портфоліо дизайнера",

    galleryTitle: "Галерея робіт",
    gallerySubtitle: "Аватарки, прев’ю, банери та інші проєкти.",
    galleryHint: "Обери категорію зверху та гортай роботи свайпом.",

    reviewsTitle: "Відгуки клієнтів",
    reviewsSubtitle: "Реальні відгуки твоїх клієнтів.",
    reviewsAddButton: "Залишити відгук",

    pricingTitle: "Прайс / Послуги",
    pricingItems: [
      "Логотип — від X грн",
      "Фірмовий стиль — від X грн",
      "Оформлення соцмереж — від X грн",
      "Рекламні банери — від X грн",
    ],

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
    pricingItems: [
      "Логотип — X теңгеден",
      "Фирмалық стиль — X теңгеден",
      "Әлеуметтік желі дизайны — X теңгеден",
      "Жарнамалық баннерлер — X теңгеден",
    ],

    aboutTitle: "Мен туралы",
    aboutSubtitle:
      "Мен Rival, дизайнермін. Брендтерге әлеуметтік желілерде және жарнамада ерекшеленуге көмектесемін.",

    faqTitle: "FAQ",
    faqItems: [
      "Жұмыс қалай өтеді?",
      "Қандай файлдарды аламын?",
      "Қанша өзгеріс енгізуге болады?",
    ],

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
    gallerySubtitle: "Аватаркі, прэв’ю, банеры і іншыя праекты.",
    galleryHint: "Абяры катэгорыю зверху і ліставай работы свайпам.",

    reviewsTitle: "Водгукі кліентаў",
    reviewsSubtitle: "Сапраўдныя водгукі тваіх кліентаў.",
    reviewsAddButton: "Пакінуць водгук",

    pricingTitle: "Прайс / Паслугі",
    pricingItems: [
      "Лагатып — ад X BYN",
      "Фірмовы стыль — ад X BYN",
      "Афармленне сацсетак — ад X BYN",
      "Рэкламныя банеры — ад X BYN",
    ],

    aboutTitle: "Пра мяне",
    aboutSubtitle:
      "Я Rival, дызайнер. Дапамагаю брэндам выдзяляцца ў сацсетках і рэкламе.",

    faqTitle: "FAQ",
    faqItems: [
      "Як праходзіць работа?",
      "Якія файлы я атрымаю?",
      "Колькі праўкі ўваходзіць у кошт?",
    ],

    aiTitle: "AI ідэі",
    aiSubtitle:
      "Генератар ідэй для палітр, рэферансаў і канцэптаў (у распрацоўцы).",

    bottomOrder: "Замовіць дызайн",
    bottomGenerate: "Згенераваць ідэю",

    orderAlert:
      "Хутка тут будзе пераход у твой Telegram для замовы 😉",
    aiAlert: "Хутка тут будзе AI-генератар ідэй 🚀",
  },
};

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
    image: "/images/avatar1.jpg",
    description: "Описание превью 1",
  },

  {
    id: "88",
    category: "Превью",
    title: "Превью 2",
    image: "/images/avatar1.jpg",
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
    id: "9",
    category: "Баннеры",
    title: "Баннер 2",
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
  // пример твоей своей работы
  // {
  //   id: "5",
  //   category: "Аватарки",
  //   title: "Rival Avatar",
  //   image: "/images/my-avatar-1.png",
  //   description: "Мой фирменный аватар",
  // },
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

  // для зума картинки
  const [selectedImage, setSelectedImage] = useState(null);

  const t = TEXTS[language];
  const labels = TAB_LABELS[language];

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
      // window.open("https://t.me/Rivaldsg", "_blank");
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
                <SwiperSlide key={p.id} style={{ width: 220 }}>
                  <div
                    className="project-card"
                    onClick={() => setSelectedImage(p)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="project-thumb-wrapper">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="project-thumb-img"
                      />
                    </div>
                    <div className="project-info">
                      <div className="project-title">{p.title}</div>
                      <p className="hint-text">{p.description}</p>
                      <span className="hint-text">
                        🔍 нажми, чтобы увеличить
                      </span>
                    </div>
                  </div>
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
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case TABS.AI:
        return (
          <div className="card">
            <h2 className="section-title">{t.aiTitle}</h2>
            <p className="section-subtitle">{t.aiSubtitle}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={app-root theme-${theme}}>
      <div className="app-shell">
        {/* Верхняя панель */}
        <div className="top-bar">
          <div className="top-bar-left">
            <span className="app-title">{t.appTitle}</span>
            <span className="app-subtitle">{t.appSubtitle}</span>
          </div>

          <div className="controls">
            <button className="icon-btn" onClick={toggleTheme}>
              🌗
            </button>

            <div style={{ position: "relative" }}>
              <button className="icon-btn" onClick={toggleLangMenu}>
                🌐
              </button>

              {showLangMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    right: 0,
                    background: "#222",
                    borderRadius: "10px",
                    padding: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    zIndex: 10,
                  }}
                >
                  <button
                    className="tab-btn"
                    onClick={() => handleLangChange("ru")}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      textAlign: "left",
                    }}
                  >
                    🇷🇺 Русский
                  </button>
                  <button
                    className="tab-btn"
                    onClick={() => handleLangChange("ua")}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      textAlign: "left",
                    }}
                  >
                    🇺🇦 Українська
                  </button>
                  <button
                    className="tab-btn"
                    onClick={() => handleLangChange("en")}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      textAlign: "left",
                    }}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    className="tab-btn"
                    onClick={() => handleLangChange("kz")}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      textAlign: "left",
                    }}
                  >
                    🇰🇿 Қазақша
                  </button>
                  <button
                    className="tab-btn"
                    onClick={() => handleLangChange("by")}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      textAlign: "left",
                    }}
                  >
                    🇧🇾 Беларуская
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Основные вкладки */}
        <nav className="tabs">
          {Object.values(TABS).map((tab) => (
            <button
              key={tab}
              className={
                "tab-btn" + (activeTab === tab ? " tab-btn-active" : "")
              }
              onClick={() => setActiveTab(tab)}
            >
              {labels[tab]}
            </button>
          ))}
        </nav>

        {/* Контент */}
        <main className="tab-content">{renderContent()}</main>

        {/* Нижняя кнопка */}
        <button
          className="primary-btn fixed-order-btn"
          onClick={handleBottomButton}
        >
          {activeTab === TABS.AI ? t.bottomGenerate : t.bottomOrder}
        </button>
      </div>

      {/* Модальное окно для увеличенной картинки */}
      {selectedImage && (
        <div
          className="image-modal-backdrop"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="icon-btn image-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="image-modal-img"
            />
            <div className="image-modal-text">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
