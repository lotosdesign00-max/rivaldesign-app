import React, { useState } from "react";

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
    ORDER_BTN: "Оформить заказ",
    AI_BTN: "Сгенерировать",
  },
  en: {
    [TABS.GALLERY]: "Gallery",
    [TABS.REVIEWS]: "Reviews",
    [TABS.PRICING]: "Pricing",
    [TABS.ABOUT]: "About",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI Ideas",
    ORDER_BTN: "Order",
    AI_BTN: "Generate",
  },
};

const CONTACT_TG = "Rivaldsg";

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark"); // dark | alt
  const [lang, setLang] = useState("ru"); // ru | en
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "alt" : "dark"));
  };

  const handleOrderClick = () => {
    window.open(`https://t.me/${CONTACT_TG}`, "_blank");
  };

  const toggleLangMenu = () => {
    setLangMenuOpen((prev) => !prev);
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    setLangMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <section className="card">
            <h2 className="section-title">{TAB_LABELS[lang][TABS.GALLERY]}</h2>
            <p className="section-subtitle">
              Здесь будут твои работы: логотипы, постеры, баннеры, брендинг и т.д.
            </p>
          </section>
        );

      case TABS.REVIEWS:
        return (
          <section className="card">
            <h2 className="section-title">{TAB_LABELS[lang][TABS.REVIEWS]}</h2>
            <p className="section-subtitle">Отзывы клиентов с аватарками</p>
            <button className="secondary-btn">Оставить отзыв</button>
          </section>
        );

      case TABS.PRICING:
        return (
          <section className="card">
            <h2 className="section-title">{TAB_LABELS[lang][TABS.PRICING]}</h2>
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
            <h2 className="section-title">{TAB_LABELS[lang][TABS.ABOUT]}</h2>
            <p className="section-subtitle">
              Я Rival, дизайнер. Работаю с брендами, помогаю выделиться в соцсетях и рекламе.
            </p>
          </section>
        );

      case TABS.FAQ:
        return (
          <section className="card">
            <h2 className="section-title">{TAB_LABELS[lang][TABS.FAQ]}</h2>
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
            <h2 className="section-title">{TAB_LABELS[lang][TABS.AI]}</h2>
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

          {/* Кнопки справа: тема + язык */}
          <div style={{ display: "flex", gap: "6px", position: "relative" }}>
            <button className="icon-btn" onClick={toggleTheme}>
              🌗
            </button>
            <button className="icon-btn" onClick={toggleLangMenu}>
              🌐
            </button>
            {langMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "32px",
                  right: "0",
                  background: "#222",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  zIndex: 100,
                }}
              >
                <button
                  className="secondary-btn"
                  onClick={() => changeLang("ru")}
                >
                  RU
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => changeLang("en")}
                >
                  EN
                </button>
              </div>
            )}
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
              {TAB_LABELS[lang][tabKey]}
            </button>
          ))}
        </nav>

        {/* Контент вкладки */}
        <main className="tab-content">{renderContent()}</main>

        {/* Фиксированная кнопка снизу */}
        <button
          className="primary-btn fixed-order-btn"
          onClick={
            activeTab === TABS.AI ? () => alert("Генерируем идею!") : handleOrderClick
          }
        >
          {activeTab === TABS.AI
            ? TAB_LABELS[lang].AI_BTN
            : TAB_LABELS[lang].ORDER_BTN}
        </button>
      </div>
    </div>
  );
}
