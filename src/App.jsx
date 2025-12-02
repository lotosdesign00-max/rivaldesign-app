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

// Labels, texts, rates (как у тебя выше) ...
// (для краткости можно вставить твой полный объект TAB_LABELS, BASE_TEXTS и RATES здесь)

const GALLERY_CATEGORIES = ["Аватарки", "Превью", "Баннеры"];

const GALLERY_ITEMS = [
  { id: "1", category: "Аватарки", title: "Аватар 1", image: "/images/avatar1.jpg", description: "Описание аватарки 1" },
  { id: "2", category: "Превью", title: "Превью 1", image: "/images/preview1.jpg", description: "Описание превью 1" },
  { id: "3", category: "Баннеры", title: "Баннер 1", image: "/images/banner1.jpg", description: "Описание баннера 1" },
  { id: "4", category: "Аватарки", title: "Аватар 2", image: "/images/avatar2.jpg", description: "Описание аватарки 2" },
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

  const t = buildPricingTexts(language);
  const labels = TAB_LABELS[language] || TAB_LABELS.ru;

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "alt" : "dark"));
  const toggleLangMenu = () => setShowLangMenu((prev) => !prev);
  const handleLangChange = (lang) => { setLanguage(lang); setShowLangMenu(false); };
  const handleBottomButton = () => alert(activeTab === TABS.AI ? t.aiAlert : t.orderAlert);

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <div className="card">
            <h2 className="section-title">{t.galleryTitle}</h2>
            <p className="section-subtitle">{t.gallerySubtitle}</p>

            <div className="tabs">
              {GALLERY_CATEGORIES.map((cat) => (
                <button key={cat} className={"tab-btn" + (cat === activeCategory ? " tab-btn-active" : "")} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {GALLERY_ITEMS.filter((p) => p.category === activeCategory).map((p) => (
                <SwiperSlide key={p.id} style={{ width: 320 }}>
                  <img src={p.image} alt={p.title} className="project-img" onClick={() => setModalImage(p.image)} />
                  <p className="hint-text">{p.description}</p>
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
                    <div style={{ fontWeight: "bold", fontSize: "24px", marginBottom: "4px" }}>{r.name[0]}</div>
                    <div>{r.name}</div>
                    <div className="hint-text">{r.text}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="secondary-btn" style={{ marginTop: 10 }}>{t.reviewsAddButton}</button>
          </div>
        );

      case TABS.PRICING:
        return (
          <div className="card">
            <h2 className="section-title">{t.pricingTitle}</h2>
            <ul className="list">{t.pricingItems.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
            <p className="hint-text" style={{ marginTop: 8 }}>{t.pricingAnimationNote}</p>
          </div>
        );

      case TABS.ABOUT:
        return <div className="card"><h2 className="section-title">{t.aboutTitle}</h2><p className="section-subtitle">{t.aboutSubtitle}</p></div>;
      case TABS.FAQ:
        return <div className="card"><h2 className="section-title">{t.faqTitle}</h2><ul className="list">{t.faqItems.map((item, idx) => <li key={idx}>{item}</li>)}</ul></div>;
      case TABS.AI:
        return <div className="card"><h2 className="section-title">{t.aiTitle}</h2><p className="section-subtitle">{t.aiSubtitle}</p></div>;
      default: return null;
    }
  };

  return (
    <div className={`app-root theme-${theme}`}>
      <div className="app-shell">
        <div className="top-bar">
          <div className="top-bar-left">
            <span className="app-title">{t.appTitle}</span>
            <span className="app-subtitle">{t.appSubtitle}</span>
          </div>
          <div className="controls">
            <button className="icon-btn" onClick={toggleTheme}>🌗</button>
            <div style={{ position: "relative" }}>
              <button className="icon-btn" onClick={toggleLangMenu}>🌐 {language.toUpperCase()}</button>
              {showLangMenu && (
                <div style={{ position: "absolute", top: "32px", right: 0, background: "#222", borderRadius: "10px", padding: "6px", display: "flex", flexDirection: "column", gap: "4px", minWidth: "80px", zIndex: 10 }}>
                  <button className="tab-btn" onClick={() => handleLangChange("ru")}>🇷🇺 RU</button>
                  <button className="tab-btn" onClick={() => handleLangChange("uk")}>🇺🇦 UA</button>
                  <button className="tab-btn" onClick={() => handleLangChange("kz")}>🇰🇿 KZ</button>
                  <button className="tab-btn" onClick={() => handleLangChange("by")}>🇧🇾 BY</button>
                  <button className="tab-btn" onClick={() => handleLangChange("en")}>🇬🇧 EN</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="tabs">
          {Object.values(TABS).map((tab) => (
            <button key={tab} className={"tab-btn" + (activeTab === tab ? " tab-btn-active" : "")} onClick={() => setActiveTab(tab)}>
              {labels[tab]}
            </button>
          ))}
        </nav>

        <main className="tab-content">{renderContent()}</main>

        <button className="primary-btn fixed-order-btn" onClick={handleBottomButton}>{activeTab === TABS.AI ? t.bottomGenerate : t.bottomOrder}</button>

        {modalImage && (
          <div className="modal" onClick={() => setModalImage(null)}>
            <img src={modalImage} alt="fullscreen" className="modal-img" />
          </div>
        )}
      </div>
    </div>
  );
}
