import React, { useState } from "react";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import AI from "./components/AI";

export default function App() {
  const TABS = {
    GALLERY: "gallery",
    REVIEWS: "reviews",
    AI: "ai",
  };

  const TAB_LABELS = {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Отзывы",
    [TABS.AI]: "AI идеи",
  };

  const CONTACT_TG = "Rivaldsg";

  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "alt" : "dark"));

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return <Gallery />;
      case TABS.REVIEWS:
        return <Reviews />;
      case TABS.AI:
        return <AI />;
      default:
        return null;
    }
  };

  const handleFixedOrderClick = () => {
    if (activeTab === TABS.AI) {
      alert("Сгенерировать идею!");
    } else {
      window.open(`https://t.me/${CONTACT_TG}`, "_blank");
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

          {/* Кнопки темы и языка справа */}
          <div className="top-bar-right">
            <button className="icon-btn" onClick={toggleTheme}>
              🌗
            </button>
            <button className="icon-btn">🌐</button>
          </div>
        </div>

        {/* Основные вкладки */}
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

        <main className="tab-content">{renderContent()}</main>

        {/* Фиксированная кнопка заказа/генерации */}
        <button
          className="fixed-order-btn primary-btn"
          onClick={handleFixedOrderClick}
        >
          {activeTab === TABS.AI ? "Сгенерировать идею" : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
}
