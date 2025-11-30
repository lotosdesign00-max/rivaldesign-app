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

const CONTACT_TG = "Rivaldsg";

const MOCK_GALLERY = [
  { id: "1", category: "Аватарки", title: "Аватар 1", image: "/images/avatar1.jpg", description: "Описание аватарки 1" },
  { id: "2", category: "Превью", title: "Превью 1", image: "/images/preview1.jpg", description: "Описание превью 1" },
  { id: "3", category: "Баннеры", title: "Баннер 1", image: "/images/banner1.jpg", description: "Описание баннера 1" },
];

const MOCK_REVIEWS = [
  { id: "r1", name: "Alice", text: "Отличная работа!", avatar: "A" },
  { id: "r2", name: "Bob", text: "Очень доволен.", avatar: "B" },
  { id: "r3", name: "Charlie", text: "Рекомендую!", avatar: "C" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");
  const [galleryFilter, setGalleryFilter] = useState("Аватарки");

  const toggleTheme = () => setTheme(theme === "dark" ? "alt" : "dark");

  const handleOrderClick = () => {
    if (activeTab === TABS.AI) {
      alert("Генерируем идею...");
    } else {
      window.open(`https://t.me/${CONTACT_TG}`, "_blank");
    }
  };

  const renderGallery = () => {
    const filtered = MOCK_GALLERY.filter(item => item.category === galleryFilter);
    return (
      <section className="card">
        <h2 className="section-title">Галерея работ</h2>
        <div className="row" style={{marginBottom:"8px"}}>
          {["Аватарки","Превью","Баннеры"].map(cat => (
            <button
              key={cat}
              className={`tab-btn${galleryFilter===cat ? " tab-btn-active" : ""}`}
              onClick={()=>setGalleryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <Swiper spaceBetween={12} slidesPerView={"auto"}>
          {filtered.map(item => (
            <SwiperSlide key={item.id} style={{width:300}}>
              <img src={item.image} alt={item.title} className="project-img"/>
              <div style={{marginTop:"6px", fontSize:"13px"}}>{item.title}</div>
              <div style={{fontSize:"12px", opacity:0.7}}>{item.description}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  const renderReviews = () => (
    <section className="card">
      <h2 className="section-title">Отзывы клиентов</h2>
      <Swiper spaceBetween={12} slidesPerView={"auto"}>
        {MOCK_REVIEWS.map(r => (
          <SwiperSlide key={r.id} style={{width:250}}>
            <div style={{fontSize:"14px", fontWeight:600, marginBottom:"4px"}}>
              <span style={{
                display:"inline-block",
                width:32,
                height:32,
                borderRadius:"50%",
                background:"#ff3040",
                color:"#fff",
                textAlign:"center",
                lineHeight:"32px",
                marginRight:"6px"
              }}>{r.avatar}</span>
              {r.name}
            </div>
            <div style={{fontSize:"12px"}}>{r.text}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );

  const renderContent = () => {
    switch(activeTab){
      case TABS.GALLERY: return renderGallery();
      case TABS.REVIEWS: return renderReviews();
      case TABS.PRICING: return (
        <section className="card">
          <h2 className="section-title">Прайс / Услуги</h2>
          <ul className="list">
            <li>Логотип — от X грн</li>
            <li>Фирменный стиль — от X грн</li>
            <li>Оформление соцсетей — от X грн</li>
            <li>Рекламные баннеры — от X грн</li>
          </ul>
        </section>
      );
      case TABS.ABOUT: return (
        <section className="card">
          <h2 className="section-title">Обо мне</h2>
          <p>Я Rival, дизайнер. Работаю с брендами и соцсетями.</p>
        </section>
      );
      case TABS.FAQ: return (
        <section className="card">
          <h2 className="section-title">FAQ</h2>
          <ul className="list">
            <li>Как проходит работа?</li>
            <li>Какие файлы я получу?</li>
            <li>Сколько правок входит в стоимость?</li>
          </ul>
        </section>
      );
      case TABS.AI: return (
        <section className="card">
          <h2 className="section-title">AI — генератор идей</h2>
          <p>Выбирай идеи и вдохновляйся.</p>
        </section>
      );
      default: return null;
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
            <button className="icon-btn">🌐</button>
          </div>
        </div>

        <nav className="tabs">
          {Object.values(TABS).map(tabKey=>(
            <button
              key={tabKey}
              className={"tab-btn"+(activeTab===tabKey?" tab-btn-active":"")}
              onClick={()=>setActiveTab(tabKey)}
            >
              {TAB_LABELS[tabKey]}
            </button>
          ))}
        </nav>

        <main className="tab-content">{renderContent()}</main>

        <button
          className="primary-btn fixed-order-btn"
          onClick={handleOrderClick}
        >
          {activeTab===TABS.AI ? "Сгенерировать идею" : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
}
