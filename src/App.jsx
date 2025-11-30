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
  // Можно добавить другие языки...
};

const TEXTS = {
  ru: {
    aiTitle: "AI идеи",
    aiSubtitle: "Генератор идей для палитр, референсов и концептов (в разработке).",
    bottomGenerate: "Сгенерировать идею",
    aiAlert: "Скоро здесь будет генератор идей на AI 🚀",
  },
};

const GALLERY_CATEGORIES = ["Аватарки", "Превью", "Баннеры"];
const GALLERY_ITEMS = [
  { id: "1", category: "Аватарки", title: "Аватар 1", image: "/images/podborka1.jpg", description: "Описание аватарки 1" },
  { id: "2", category: "Превью", title: "Превью 1", image: "/images/avatar1.jpg", description: "Описание превью 1" },
  { id: "3", category: "Баннеры", title: "Баннер 1", image: "/images/banner1.jpg", description: "Описание баннера 1" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("ru");
  const [activeCategory, setActiveCategory] = useState(GALLERY_CATEGORIES[0]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [aiIdea, setAiIdea] = useState("");

  const t = TEXTS[language];
  const labels = TAB_LABELS[language];

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "alt" : "dark"));
  const toggleLangMenu = () => setShowLangMenu(prev => !prev);
  const handleLangChange = (lang) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const handleBottomButton = () => {
    if (activeTab === TABS.AI) {
      alert(t.aiAlert);
    } else {
      alert("Скоро тут будет переход к твоему Telegram для оформления заказа 😉");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <div className="card">
            <h2 className="section-title">Галерея</h2>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {GALLERY_ITEMS.filter(p => p.category === activeCategory).map(p => (
                <SwiperSlide key={p.id} style={{ width: 220 }}>
                  <div className="project-card" onClick={() => setSelectedImage(p)} style={{ cursor: "pointer" }}>
                    <div className="project-thumb-wrapper">
                      <img src={p.image} alt={p.title} className="project-thumb-img" />
                    </div>
                    <div className="project-info">
                      <div className="project-title">{p.title}</div>
                      <p className="hint-text">{p.description}</p>
                      <span className="hint-text">🔍 нажми, чтобы увеличить</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );

      case TABS.AI:
        return (
          <div className="card">
            <h2 className="section-title">{t.aiTitle}</h2>
            <p className="section-subtitle">{t.aiSubtitle}</p>

            <button
              className="primary-btn"
              style={{ marginTop: 10 }}
              onClick={() => {
                const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3"];
                const categories = ["Скамер", "Доксер", "Криптан", "Абузы", "Осинтер"];
                const names = ["CryptoFox", "ShadowHunter", "NeoBot", "Abyss", "ZeroOne"];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const category = categories[Math.floor(Math.random() * categories.length)];
                const name = names[Math.floor(Math.random() * names.length)];
                const nick = `${name}${Math.floor(Math.random() * 999)}`;
                setAiIdea(`Категория: ${category}\nИмя: ${nick}\nЦвет: ${color}`);
              }}
            >
              {t.bottomGenerate}
            </button>

            {aiIdea && (
              <pre
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  padding: "12px",
                  borderRadius: "12px",
                  marginTop: "12px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {aiIdea}
              </pre>
            )}
          </div>
        );

      default:
        return <div>Контент для других вкладок</div>;
    }
  };

  return (
    <div className={`app-root theme-${theme}`}>
      <div className="app-shell">
        {/* Верхняя панель */}
        <div className="top-bar">
          <div className="top-bar-left">
            <span className="app-title">Rival App</span>
            <span className="app-subtitle">портфолио дизайнера</span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button className="icon-btn" onClick={toggleTheme}>🌗</button>

            <div style={{ position: "relative" }}>
              <button className="icon-btn" onClick={toggleLangMenu}>🌐</button>
              {showLangMenu && (
                <div style={{
                  position: "absolute",
                  top: "30px",
                  right: 0,
                  background: "#222",
                  borderRadius: "10px",
                  padding: "6px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  zIndex: 10
                }}>
                  {["ru"].map(lang => (
                    <button key={lang} className="tab-btn" onClick={() => handleLangChange(lang)}>
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Основные вкладки */}
        <nav className="tabs">
          {Object.values(TABS).map(tab => (
            <button
              key={tab}
              className={"tab-btn" + (activeTab === tab ? " tab-btn-active" : "")}
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
          {activeTab === TABS.AI ? t.bottomGenerate : "Оформить заказ"}
        </button>
      </div>

      {/* Модальное окно увеличенной картинки */}
      {selectedImage && (
        <div className="image-modal-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn image-modal-close" onClick={() => setSelectedImage(null)}>✖</button>
            <img src={selectedImage.image} alt={selectedImage.title} className="image-modal-img" />
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
