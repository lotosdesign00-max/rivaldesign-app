import React, { useState } from "react";

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

const CONTACT_TG = "Rivaldsg";

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
        return (
          <section className="card">
            <h2 className="section-title">Галерея работ</h2>
            <p className="section-subtitle">
              Здесь будут твои работы: логотипы, постеры, баннеры, брендинг и т.д.
            </p>
            <p className="hint-text">
              Позже сюда можно прикрутить свайпы, категории и кнопку "Подробнее".
            </p>
          </section>
        );

      case TABS.REVIEWS:
        return (
          <section className="card">
            <h2 className="section-title">Отзывы клиентов</h2>
            <p className="section-subtitle">
              Здесь будут карточки с отзывами, именем и аватаркой.
            </p>
            <button className="secondary-btn">Оставить отзыв</button>
          </section>
        );

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
              Укажи тип проекта, сроки, примерный бюджет и пожелания.
            </p>
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
            <p className="hint-text">
              Здесь можно добавить фото, ссылки на Behance, Instagram, Telegram и т.д.
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
              Здесь можно сделать блок, где бот предлагает палитры, референсы и концепты.
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
          <button className="icon-btn" onClick={toggleTheme}>
            🌗
          </button>
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
