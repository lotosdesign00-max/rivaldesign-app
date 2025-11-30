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
  en: {
    [TABS.GALLERY]: "Gallery",
    [TABS.REVIEWS]: "Reviews",
    [TABS.PRICING]: "Pricing",
    [TABS.ABOUT]: "About",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI Ideas",
  },
  ru: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Отзывы",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Обо мне",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI идеи",
  },
};

const CONTENT = {
  en: {
    [TABS.GALLERY]: {
      title: "Gallery of Works",
      subtitle: "Here will be your works: logos, posters, banners, branding, etc.",
    },
    [TABS.REVIEWS]: {
      title: "Customer Reviews",
      subtitle: "Here will be review cards with name and avatar.",
    },
    [TABS.PRICING]: {
      title: "Pricing / Services",
    },
    [TABS.ABOUT]: {
      title: "About Me",
      subtitle: "I am Rival, designer. I help brands stand out on social media.",
    },
    [TABS.FAQ]: {
      title: "FAQ / Frequently Asked",
    },
    [TABS.AI]: {
      title: "AI Idea Generator",
      subtitle: "Here the bot can suggest palettes, references, and concepts.",
    },
  },
  ru: {
    [TABS.GALLERY]: {
      title: "Галерея работ",
      subtitle: "Здесь будут твои работы: логотипы, постеры, баннеры, брендинг и т.д.",
    },
    [TABS.REVIEWS]: {
      title: "Отзывы клиентов",
      subtitle: "Здесь будут карточки с отзывами, именем и аватаркой.",
    },
    [TABS.PRICING]: {
      title: "Прайс / Услуги",
    },
    [TABS.ABOUT]: {
      title: "Обо мне",
      subtitle: "Я Rival, дизайнер. Работаю с брендами, помогаю выделиться в соцсетях и рекламе.",
    },
    [TABS.FAQ]: {
      title: "FAQ / Частые вопросы",
    },
    [TABS.AI]: {
      title: "AI — генератор идей",
      subtitle: "Здесь можно сделать блок, где бот предлагает палитры, референсы и концепты.",
    },
  },
};

const CONTACT_TG = "Rivaldsg";

function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("ru");

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "alt" : "dark"));
  const toggleLang = () => setLang(prev => (prev === "ru" ? "en" : "ru"));

  const handleOrderClick = () => {
    window.open(`https://t.me/${CONTACT_TG}`, "_blank");
  };

  const renderContent = () => {
    const content = CONTENT[lang][activeTab];
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <section className="card">
            <h2 className="section-title">{content.title}</h2>
            <p className="section-subtitle">{content.subtitle}</p>
          </section>
        );
      case TABS.REVIEWS:
        return (
          <section className="card">
            <h2 className="section-title">{content.title}</h2>
            <p className="section-subtitle">{content.subtitle}</p>
            <button className="secondary-btn">Оставить отзыв</button>
          </section>
        );
      case TABS.PRICING:
        return (
          <section className="card">
            <h2 className="section-title">{content.title}</h2>
          </section>
        );
      case TABS.ABOUT:
        return (
          <section className="card">
            <h2 className="section-title">{content.title}</h2>
            <p className="section-subtitle">{content.subtitle}</p>
          </section>
        );
      case TABS.FAQ:
        return (
          <section className="card">
            <h2 className="section-title">{content.title}</h2>
          </section>
        );
      case TABS.AI:
        return (
          <section className="card">
            <h2 className="section-title">{content.title}</h2>
            <p className="section-subtitle">{content.subtitle}</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`app-root theme-${theme}`}>
      <div className="app-shell">
        <div className="top-bar">
          <div className="top-bar-left">
            <span className="app-title">Rival App</span>
            <span className="app-subtitle">портфолио дизайнера</span>
          </div>
          <div className="controls">
            <button className="icon-btn" onClick={toggleTheme}>🌗</button>
            <button className="icon-btn" onClick={toggleLang}>{lang.toUpperCase()}</button>
          </div>
        </div>

        <nav className="tabs">
          {Object.values(TABS).map(tabKey => (
            <button
              key={tabKey}
              className={"tab-btn" + (activeTab === tabKey ? " tab-btn-active" : "")}
              onClick={() => setActiveTab(tabKey)}
            >
              {TAB_LABELS[lang][tabKey]}
            </button>
          ))}
        </nav>

        <main className="tab-content">{renderContent()}</main>

        <button
          className="primary-btn fixed-order-btn"
          onClick={handleOrderClick}
        >
          {activeTab === TABS.AI ? (lang === "ru" ? "Сгенерировать" : "Generate") : (lang === "ru" ? "Оформить заказ" : "Order")}
        </button>
      </div>
    </div>
  );
}

export default App;
