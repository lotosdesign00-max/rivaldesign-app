import React, { useState } from "react";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import AI from "./components/AI";
import "./styles.css";

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

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "alt" : "dark"));
  };

  const handleOrderClick = () => {
    if (activeTab === TABS.AI) {
      alert("Генерируем идею!"); // сюда можно подключить реальный генератор
    } else {
      window.open(`https://t.me/${CONTACT_TG}`, "_blank");
    }
  };

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
            <button className="icon-btn">🌐</button> {/* смена языка / о приложении */}
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

        {/* Фиксированная кнопка */}
        <button className="primary-btn wide fixed-order-btn" onClick={handleOrderClick}>
          {activeTab === TABS.AI ? "Сгенерировать идею" : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
}
