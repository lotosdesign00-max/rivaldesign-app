import React, { useState } from "react";
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

const GALLERY_CATEGORIES = ["Аватарки", "Превью", "Баннеры"];

const GALLERY_ITEMS = [
  { id: "1", category: "Аватарки", title: "Аватар 1", image: "/images/avatar1.jpg", description: "Описание аватарки 1" },
  { id: "2", category: "Превью", title: "Превью 1", image: "/images/preview1.jpg", description: "Описание превью 1" },
  { id: "3", category: "Баннеры", title: "Баннер 1", image: "/images/banner1.jpg", description: "Описание баннера 1" },
  { id: "4", category: "Аватарки", title: "Аватар 2", image: "/images/avatar2.jpg", description: "Описание аватарки 2" },
];

const REVIEWS_ITEMS = [
  { id: "r1", name: "Alice", text: "Отличная работа!" },
  { id: "r2", name: "Bob", text: "Очень понравилось." },
  { id: "r3", name: "Charlie", text: "Буду обращаться ещё." },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("ru");
  const [activeCategory, setActiveCategory] = useState(GALLERY_CATEGORIES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "alt" : "dark"));
  const toggleLangMenu = () => setShowLangMenu(prev => !prev);
  const handleLangChange = (lang) => { setLanguage(lang); setShowLangMenu(false); };
  
  const handleBottomButton = () => {
    if (activeTab === TABS.AI) alert("Генерируем идею...");
    else alert("Переход к Telegram для заказа");
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <div className="card">
            <h2 className="section-title">Галерея работ</h2>
            <div className="tabs">
              {GALLERY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={"tab-btn" + (cat === activeCategory ? " tab-btn-active" : "")}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {GALLERY_ITEMS.filter(p => p.category === activeCategory).map(p => (
                <SwiperSlide key={p.id} style={{width: 320}}>
                  <img src={p.image} alt={p.title} className="project-img"/>
                  <p className="hint-text">{p.description}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );

      case TABS.REVIEWS:
        return (
          <div className="card">
            <h2 className="section-title">Отзывы клиентов</h2>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {REVIEWS_ITEMS.map(r => (
                <SwiperSlide key={r.id} style={{width: 250}}>
                  <div className="card">
                    <div style={{fontWeight: "bold", fontSize: "24px", marginBottom: "4px"}}>
                      {r.name[0]}
                    </div>
                    <div>{r.name}</div>
                    <div className="hint-text">{r.text}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );

      case TABS.PRICING:
        return (
          <div className="card">
            <h2 className="section-title">Прайс / Услуги</h2>
            <ul className="list">
              <li>Логотип — от X грн</li>
              <li>Фирменный стиль — от X грн</li>
              <li>Оформление соцсетей — от X грн</li>
              <li>Рекламные баннеры — от X грн</li>
            </ul>
          </div>
        );

      case TABS.ABOUT:
        return (
          <div className="card">
            <h2 className="section-title">Обо мне</h2>
            <p className="section-subtitle">Я Rival, дизайнер. Работаю с брендами, помогаю выделиться.</p>
          </div>
        );

      case TABS.FAQ:
        return (
          <div className="card">
            <h2 className="section-title">FAQ</h2>
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
            <h2 className="section-title">AI идеи</h2>
            <p className="section-subtitle">Здесь можно сгенерировать палитры и концепты.</p>
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

            <div style={{position:"relative"}}>
              <button className="icon-btn" onClick={toggleLangMenu}>🌐</button>
              {showLangMenu && (
                <div style={{
                  position:"absolute", top:"30px", right:0, background:"#222", borderRadius:"8px", padding:"4px"
                }}>
                  <button className="tab-btn" onClick={()=>handleLangChange("ru")}>RU</button>
                  <button className="tab-btn" onClick={()=>handleLangChange("en")}>EN</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Основные вкладки */}
        <nav className="tabs">
          {Object.values(TABS).map(tab => (
            <button
              key={tab}
              className={"tab-btn" + (activeTab===tab?" tab-btn-active":"")}
              onClick={()=>setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>

        <main className="tab-content">{renderContent()}</main>

        <button className="primary-btn fixed-order-btn" onClick={handleBottomButton}>
          {activeTab===TABS.AI ? "Сгенерировать" : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
}
