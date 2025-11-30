import React, { useState } from "react";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import AI from "./components/AI";

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

const CONTACT_TG = "Rivaldsg";

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark"); // dark | alt

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "alt" : "dark"));
  };

  const handleOrderClick = () => {
    if (activeTab === TABS.AI) {
      alert("Генерируем идею!");
      return;
    }
    window.open(`https://t.me/${CONTACT_TG}`, "_blank");
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return <Gallery />;
      case TABS.REVIEWS:
        return <Reviews />;
      case TABS.AI:
        return <AI />;
      case TABS.PRICING:
        return (
          <div className="card">
            <h2 className="section-title">Прайс / Услуги</h2>
            <ul className="list">
              <li>Логотип — от 𝑋ₓₓₓ грн</li>
              <li>Фирменный стиль — от 𝑋ₓₓₓ грн</li>
              <li>Оформление соцсетей — от 𝑋ₓₓₓ грн</li>
              <li>Рекламные баннеры — от 𝑋ₓₓₓ грн</li>
            </ul>
          </div>
        );
      case TABS.ABOUT:
        return (
          <div className="card">
            <h2 className="section-title">Обо мне</h2>
            <p className="section-subtitle">
              Я Rival, дизайнер. Работаю с брендами, помогаю выделиться в соцсетях и рекламе.
            </p>
          </div>
        );
      case TABS.FAQ:
        return (
          <div className="card">
            <h2 className="section-title">FAQ / Частые вопросы</h2>
            <ul className="list">
              <li>Как проходит работа?</li>
              <li>Какие файлы я получу?</li>
              <li>Сколько правок входит в стоимость?</li>
            </ul>
          </div>
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

          <div className="controls">
            <button className="icon-btn" onClick={toggleTheme}>🌗</button>
            <button className="icon-btn">🌐</button>
          </div>
        </div>

        {/* Вкладки */}
        <nav className="tabs">
          {Object.values(TABS).map((tabKey) => (
            <button
              key={tabKey}
              className={
                "tab-btn" + (activeTab === tabKey ? " tab-btn-active" : "")
              }
              onClick={() => setActiveTab(tabKey)}
            >
              {TAB_LABELS[tabKey]}
            </button>
          ))}
        </nav>

        {/* Контент */}
        <main className="tab-content">{renderContent()}</main>

        {/* Фиксированная кнопка внизу */}
        <button className="order-fixed" onClick={handleOrderClick}>
          {activeTab === TABS.AI ? "Сгенерировать идею" : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
}
