import React, { useState } from "react";
import gallery from "./data/gallery.json"; // используем существующий файл
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
  const [galleryCategory, setGalleryCategory] = useState("Аватарки");

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "alt" : "dark"));
  };

  const handleOrderClick = () => {
    if (activeTab === TABS.AI) {
      alert("Генерация идеи..."); // здесь подключи свой AI генератор
    } else {
      window.open(`https://t.me/${CONTACT_TG}`, "_blank");
    }
  };

  const categories = ["Аватарки", "Превью", "Баннеры"];

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        const filteredGallery = gallery.filter(
          item => item.category === galleryCategory
        );
        return (
          <section className="card">
            <h2 className="section-title">Галерея работ</h2>
            <div className="section-subtitle">Листай свайпом работы</div>

            <div className="row" style={{ marginBottom: 10 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn${galleryCategory === cat ? " active" : ""}`}
                  onClick={() => setGalleryCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {filteredGallery.map(item => (
                <SwiperSlide key={item.id} style={{ width: 280 }}>
                  <img src={item.image} alt={item.title} className="project-img" />
                  <div className="section-subtitle" style={{ marginTop: 6 }}>
                    {item.title}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        );

      case TABS.REVIEWS:
        const reviews = [
          { nick: "Gamer1", text: "Очень доволен работой!" },
          { nick: "Alpha", text: "Супер дизайн, быстро!" },
          { nick: "BetaX", text: "Рекомендую!" },
        ];
        return (
          <section className="card">
            <h2 className="section-title">Отзывы клиентов</h2>
            {reviews.map((r, i) => (
              <div key={i} className="row" style={{ marginBottom: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#ff3040",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    marginRight: 10,
                  }}
                >
                  {r.nick[0].toUpperCase()}
                </div>
                <div>{r.text}</div>
              </div>
            ))}
            <button className="secondary-btn">Оставить отзыв</button>
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
              Здесь можно сделать блок с палитрами, референсами и концептами.
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

          <div style={{ display: "flex", gap: 6 }}>
            <button className="icon-btn" onClick={toggleTheme}>🌗</button>
            <button className="icon-btn">🌐</button>
          </div>
        </div>

        {/* Вкладки */}
        <nav className="tabs">
          {Object.values(TABS).map(tabKey => (
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

        {/* Фиксированная кнопка снизу */}
        <button
          className="primary-btn fixed-order-btn"
          onClick={handleOrderClick}
        >
          {activeTab === TABS.AI ? "Сгенерировать идею" : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
}
