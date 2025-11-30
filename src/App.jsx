import React, { useState, useEffect } from "react";
import gallery from "./gallery.json";
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

const categories = ["Аватарки", "Превью", "Баннеры"];

const reviewsData = [
  { id: 1, name: "Alex", text: "Отличная работа, быстро и качественно!" },
  { id: 2, name: "Mira", text: "Очень доволен логотипом и баннером." },
  { id: 3, name: "John", text: "Рекомендую! Все сделал идеально." },
];

function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");
  const [galleryCategory, setGalleryCategory] = useState(categories[0]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [descSwiper, setDescSwiper] = useState(null);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "alt" : "dark"));

  const handleOrderClick = () => {
    if (activeTab === TABS.AI) {
      alert("Сгенерировать идею!"); // здесь можно добавить логику генератора
    } else {
      window.open(`https://t.me/${CONTACT_TG}`, "_blank");
    }
  };

  const filteredGallery = gallery.filter(
    (item) => item.category === galleryCategory
  );

  useEffect(() => {
    if (descSwiper) descSwiper.slideTo(currentSlide);
  }, [currentSlide, descSwiper]);

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <section className="card">
            <h2 className="section-title">Галерея работ</h2>
            <div className="section-subtitle">Выбирай категорию и листай работы</div>

            {/* Категории */}
            <div className="row" style={{ marginBottom: 12 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn${galleryCategory === cat ? " active" : ""}`}
                  onClick={() => setGalleryCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Свайп изображений */}
            <Swiper
              spaceBetween={12}
              slidesPerView={"auto"}
              onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            >
              {filteredGallery.map((item) => (
                <SwiperSlide key={item.id} style={{ width: 280 }}>
                  <img src={item.image} alt={item.title} className="project-img" />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Свайп описаний */}
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              allowTouchMove={false}
              onSwiper={(swiper) => setDescSwiper(swiper)}
              style={{ marginTop: 8 }}
            >
              {filteredGallery.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="section-subtitle">{item.description}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        );

      case TABS.REVIEWS:
        return (
          <section className="card">
            <h2 className="section-title">Отзывы клиентов</h2>
            {reviewsData.map((rev) => (
              <div key={rev.id} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "#ff3040",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {rev.name[0]}
                </div>
                <div>
                  <b>{rev.name}</b>
                  <div>{rev.text}</div>
                </div>
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
          <div style={{ display: "flex", gap: 8 }}>
            <button className="icon-btn" onClick={toggleTheme}>🌗</button>
            <button className="icon-btn">🌐</button>
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

        {/* Фиксированная кнопка снизу */}
        <button className="primary-btn fixed-order-btn" onClick={handleOrderClick}>
          {activeTab === TABS.AI ? "Сгенерировать идею" : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
}

export default App;
