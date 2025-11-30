import React, { useState } from "react";
import Header from "./Header";
import Gallery from "./Gallery";
import FAQ from "./FAQ";
import Pricing from "./Pricing";
import About from "./About";
import IdeaGenerator from "./IdeaGenerator";
import Reviews from "./Reviews";
import { CONTACT_TG, SOCIAL_LINKS } from "./config";

const TABS = {
  GALLERY: "gallery",
  REVIEWS: "reviews",
  ORDER: "order",
  PRICING: "pricing",
  ABOUT: "about",
  FAQ: "faq",
  AI: "ai",
};

const TAB_LABELS = {
  [TABS.GALLERY]: "Галерея",
  [TABS.REVIEWS]: "Отзывы",
  [TABS.ORDER]: "Заказать",
  [TABS.PRICING]: "Прайс",
  [TABS.ABOUT]: "Обо мне",
  [TABS.FAQ]: "FAQ",
  [TABS.AI]: "AI идеи",
};

function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark"); // dark | alt

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "alt" : "dark"));
  };

  const handleOrderClick = () => {
    window.open(`https://t.me/${CONTACT_TG}`, "_blank");
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return <Gallery />;

      case TABS.REVIEWS:
        return <Reviews />;

      case TABS.ORDER:
        return (
          <section className="card">
            <h2 className="section-title">Заказать дизайн</h2>
            <p className="section-subtitle">
              Напиши мне в Telegram, чтобы обсудить проект:
            </p>
            <button className="primary-btn wide" onClick={handleOrderClick}>
              Написать @{CONTACT_TG}
            </button>
            <p className="hint-text">
              Укажи тип проекта, сроки, примерный бюджет и пожелания — я отвечу
              как можно быстрее.
            </p>
          </section>
        );

      case TABS.PRICING:
        return <Pricing />;

      case TABS.ABOUT:
        return (
          <>
            <About />
            <section className="card">
              <h3 className="section-title">Контакты / Соцсети</h3>
              <div className="social-chips">
                {SOCIAL_LINKS.map((item) => (
                  <button
                    key={item.label}
                    className="chip"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
          </>
        );

      case TABS.FAQ:
        return <FAQ />;

      case TABS.AI:
        return <IdeaGenerator />;

      default:
        return <Gallery />;
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
          <button className="icon-btn" onClick={toggleTheme}>
            🌗
          </button>
        </div>

        {/* Блок с шапкой профиля */}
        <Header />

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

        {/* Контент вкладки */}
        <main className="tab-content">{renderContent()}</main>

        {/* Фиксированная кнопка заказа снизу */}
        <button
          className="primary-btn fixed-order-btn"
          onClick={handleOrderClick}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

export default App;
