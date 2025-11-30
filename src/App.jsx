import React, { useState } from "react";

// Константы вкладок
const TABS = {
  GALLERY: "gallery",
  REVIEWS: "reviews",
  PRICING: "pricing",
  ABOUT: "about",
  FAQ: "faq",
  AI: "ai",
};

// Метки вкладок
const TAB_LABELS = {
  [TABS.GALLERY]: "Галерея",
  [TABS.REVIEWS]: "Отзывы",
  [TABS.PRICING]: "Прайс",
  [TABS.ABOUT]: "Обо мне",
  [TABS.FAQ]: "FAQ",
  [TABS.AI]: "AI идеи",
};

// Telegram для контакта
const CONTACT_TG = "Rivaldsg";

// Галерея
const galleryData = {
  avatars: [
    { src: "/avatars/avatar1.png", text: "Аватарка 1" },
    { src: "/avatars/avatar2.png", text: "Аватарка 2" },
  ],
  previews: [
    { src: "/previews/preview1.png", text: "Превью 1" },
    { src: "/previews/preview2.png", text: "Превью 2" },
  ],
  banners: [
    { src: "/banners/banner1.png", text: "Баннер 1" },
    { src: "/banners/banner2.png", text: "Баннер 2" },
  ],
};

// Пример отзывов
const reviewsData = [
  { nick: "Gamer1", text: "Отличная работа!" },
  { nick: "PixelPro", text: "Очень доволен дизайном." },
  { nick: "ArtFan", text: "Супер быстро и красиво!" },
];

function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark"); // dark | alt

  // Для галереи
  const [galleryCategory, setGalleryCategory] = useState("avatars");
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Смена темы
  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "alt" : "dark"));

  // Галерея листание
  const nextItem = () => {
    const items = galleryData[galleryCategory];
    setGalleryIndex((prev) => (prev + 1) % items.length);
  };
  const prevItem = () => {
    const items = galleryData[galleryCategory];
    setGalleryIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Контент вкладок
  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <section className="card gallery-card">
            <h2 className="section-title">Галерея — {galleryCategory}</h2>

            {/* Категории галереи */}
            <div className="category-tabs">
              {Object.keys(galleryData).map((cat) => (
                <button
                  key={cat}
                  className={galleryCategory === cat ? "tab-btn-active" : ""}
                  onClick={() => { setGalleryCategory(cat); setGalleryIndex(0); }}
                >
                  {cat[0].toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Карусель */}
            <div className="gallery-slider">
              <button onClick={prevItem}>◀</button>
              <div className="gallery-item">
                <img src={galleryData[galleryCategory][galleryIndex].src} />
                <p>{galleryData[galleryCategory][galleryIndex].text}</p>
              </div>
              <button onClick={nextItem}>▶</button>
            </div>
          </section>
        );

      case TABS.REVIEWS:
        return (
          <section className="card">
            <h2 className="section-title">Отзывы клиентов</h2>
            <div className="reviews-list">
              {reviewsData.map((r, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-avatar">{r.nick[0].toUpperCase()}</div>
                  <div className="review-text">
                    <strong>{r.nick}</strong>
                    <p>{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
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
            <p className="hint-text">Фото, ссылки на Behance, Instagram, Telegram и т.д.</p>
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
            <p className="section-subtitle">Бот предлагает палитры, референсы и концепты.</p>
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

          {/* Кнопки темы и инфо */}
          <div className="top-bar-right">
            <button className="icon-btn" onClick={toggleTheme}>🌗</button>
            <button className="icon-btn">ℹ️</button>
          </div>
        </div>

        {/* Вкладки */}
        <nav className="tabs">
          {Object.values(TABS).map((tabKey) => (
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

        {/* Кнопка заказа / генерации AI */}
        <div className="fixed-bottom-btn">
          {activeTab === TABS.AI ? (
            <button className="primary-btn wide">Сгенерировать идею</button>
          ) : (
            <button
              className="primary-btn wide"
              onClick={() => window.open(`https://t.me/${CONTACT_TG}`, "_blank")}
            >
              Оформить заказ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
