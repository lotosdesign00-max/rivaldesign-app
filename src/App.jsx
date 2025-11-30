import React, { useState } from "react";

// === Константы вкладок ===
const TABS = {
  GALLERY: "gallery",
  REVIEWS: "reviews",
  PRICING: "pricing",
  ABOUT: "about",
  FAQ: "faq",
  AI: "ai",
};

const TAB_LABELS = {
  [TABS.GALLERY]: "Галерея",
  [TABS.REVIEWS]: "Отзывы",
  [TABS.PRICING]: "Прайс",
  [TABS.ABOUT]: "Обо мне",
  [TABS.FAQ]: "FAQ",
  [TABS.AI]: "AI идеи",
};

// Галерея по категориям
const GALLERY_CATEGORIES = ["Аватарки", "Превью", "Баннеры"];
const galleryData = {
  "Аватарки": [
    { img: "avatars/avatar1.png", text: "Аватарка 1" },
    { img: "avatars/avatar2.png", text: "Аватарка 2" },
  ],
  "Превью": [
    { img: "previews/preview1.png", text: "Превью 1" },
    { img: "previews/preview2.png", text: "Превью 2" },
  ],
  "Баннеры": [
    { img: "banners/banner1.png", text: "Баннер 1" },
    { img: "banners/banner2.png", text: "Баннер 2" },
  ],
};

// Отзывы
const reviewsData = [
  { nickname: "Rival", text: "Очень крутая работа, спасибо!" },
  { nickname: "Gamer123", text: "Супер, рекомендую!" },
];

// Контакты
const CONTACT_TG = "Rivaldsg";

function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");
  const [activeGallery, setActiveGallery] = useState(GALLERY_CATEGORIES[0]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "alt" : "dark"));

  const handleOrderClick = () => {
    if (activeTab === TABS.AI) {
      alert("Запуск генерации AI идеи!");
    } else {
      window.open(`https://t.me/${CONTACT_TG}`, "_blank");
    }
  };

  const nextGalleryItem = () => {
    const items = galleryData[activeGallery];
    setGalleryIndex((galleryIndex + 1) % items.length);
  };

  const prevGalleryItem = () => {
    const items = galleryData[activeGallery];
    setGalleryIndex((galleryIndex - 1 + items.length) % items.length);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        const items = galleryData[activeGallery];
        const item = items[galleryIndex];
        return (
          <section className="card">
            <h2 className="section-title">Галерея: {activeGallery}</h2>
            <div className="gallery-controls">
              {GALLERY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`tab-btn ${activeGallery === cat ? "tab-btn-active" : ""}`}
                  onClick={() => { setActiveGallery(cat); setGalleryIndex(0); }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="gallery-item">
              <img src={item.img} alt={item.text} className="gallery-img" />
              <p className="gallery-text">{item.text}</p>
              <div className="gallery-nav">
                <button onClick={prevGalleryItem}>◀</button>
                <button onClick={nextGalleryItem}>▶</button>
              </div>
            </div>
          </section>
        );

      case TABS.REVIEWS:
        return (
          <section className="card">
            <h2 className="section-title">Отзывы клиентов</h2>
            {reviewsData.map((r, idx) => (
              <div key={idx} className="review-card">
                <div className="review-avatar">{r.nickname[0]}</div>
                <div className="review-text">
                  <strong>{r.nickname}</strong>
                  <p>{r.text}</p>
                </div>
              </div>
            ))}
          </section>
        );

      case TABS.PRICING:
        return (
          <section className="card">
            <h2 className="section-title">Прайс / Услуги</h2>
            <ul className="list">
              <li>Логотип — от 𝑋ₓₓₓ грн</li>
              <li>Фирменный стиль — от 𝑋ₓₓₓ грн</li>
              <li>Оформление соцсетей — от 𝑋ₓₓₓ грн</li>
              <li>Рекламные баннеры — от 𝑋ₓₓₓ грн</li>
            </ul>
          </section>
        );

      case TABS.ABOUT:
        return (
          <section className="card">
            <h2 className="section-title">Обо мне</h2>
            <p className="section-subtitle">
              Я Rival, дизайнер. Работаю с брендами, помогаю выделиться в соцсетях и рекламе.
            </p>
          </section>
        );

      case TABS.FAQ:
        return (
          <section className="card">
            <h2 className="section-title">FAQ / Частые вопросы</h2>
            <ul className="list">
              <li>Как проходит работа?</li>
              <li>Какие файлы я получу?</li>
              <li>Сколько правок входит в стоимость?</li>
            </ul>
          </section>
        );

      case TABS.AI:
        return (
          <section className="card">
            <h2 className="section-title">AI — генератор идей</h2>
            <p className="section-subtitle">
              Здесь бот предлагает палитры, референсы и концепты.
            </p>
          </section>
        );

      default:
        return null;
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
          <div className="top-bar-right">
            <button className="icon-btn" onClick={toggleTheme}>🌗</button>
            <button className="icon-btn">🌐</button> {/* смена языка */}
          </div>
        </div>

        {/* Вкладки */}
        <nav className="tabs">
          {Object.values(TABS).map(tabKey => (
            <button
              key={tabKey}
              className={"tab-btn" + (activeTab === tabKey ? " tab-btn-active" : "")}
              onClick={() => setActiveTab(tabKey)}
            >
              {TAB_LABELS[tabKey]}
            </button>
          ))}
        </nav>

        {/* Контент вкладки */}
        <main className="tab-content">{renderContent()}</main>

        {/* Статичная кнопка внизу */}
        <div className="bottom-btn-container">
          <button className="primary-btn bottom-btn" onClick={handleOrderClick}>
            {activeTab === TABS.AI ? "Сгенерировать идею" : "Оформить заказ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
