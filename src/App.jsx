import React, { useState } from "react";
import Gallery from "./components/Gallery";
import reviewsData from "./data/reviews.json";

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
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "alt" : "dark"));

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return <Gallery />;
      case TABS.REVIEWS:
        return (
          <div className="card">
            <h2 className="section-title">Отзывы клиентов</h2>
            <p className="section-subtitle">
              Реальные отзывы с аватаркой-буквой
            </p>
            <div className="row">
              {reviewsData.map(r => (
                <div
                  key={r.id}
                  className="card"
                  style={{ width: "100%", marginBottom: 8 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        background: "#ff3040",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {r.name[0].toUpperCase()}
                    </div>
                    <div>
                      <b>{r.name}</b>
                      <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
                        {r.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case TABS.PRICING:
        return (
          <div className="card">
            <h2 className="section-title">Прайс / Услуги</h2>
            <p className="section-subtitle">Примеры услуг и стоимость</p>
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
            <p className="hint-text">
              Здесь можно добавить фото, ссылки на Behance, Instagram, Telegram.
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
      case TABS.AI:
        return (
          <div className="card">
            <h2 className="section-title">AI — генератор идей</h2>
            <p className="section-subtitle">
              Здесь можно сгенерировать идеи, палитры и референсы.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderFixedButton = () => {
    const isAI = activeTab === TABS.AI;
    return (
      <button
        className="primary-btn wide fixed-order-btn"
        onClick={() => {
          if (isAI) {
            alert("Сгенерировать идею!");
          } else {
            window.open(`https://t.me/${CONTACT_TG}`, "_blank");
          }
        }}
      >
        {isAI ? "Сгенерировать идею" : "Оформить заказ"}
      </button>
    );
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

        {/* Контент */}
        <main className="tab-content">{renderContent()}</main>

        {/* Фиксированная кнопка */}
        {renderFixedButton()}
      </div>
    </div>
  );
}
