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
  ru: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Отзывы",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Обо мне",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI идеи",
  },
  // остальные языки можно добавить аналогично
};

const TEXTS = {
  ru: {
    appTitle: "Rival App",
    appSubtitle: "портфолио дизайнера",
    galleryTitle: "Галерея работ",
    gallerySubtitle: "Аватарки, превью, баннеры и другие проекты.",
    galleryHint: "Выбери категорию сверху и листай работы свайпом.",
    reviewsTitle: "Отзывы клиентов",
    reviewsSubtitle: "Настоящие отзывы твоих клиентов.",
    reviewsAddButton: "Оставить отзыв",
    pricingTitle: "Прайс / Услуги",
    pricingItems: [
      "Логотип — от X грн",
      "Фирменный стиль — от X грн",
      "Оформление соцсетей — от X грн",
      "Рекламные баннеры — от X грн",
    ],
    aboutTitle: "Обо мне",
    aboutSubtitle:
      "Я Rival, дизайнер. Помогаю брендам выделяться в соцсетях и рекламе.",
    faqTitle: "FAQ",
    faqItems: [
      "Как проходит работа?",
      "Какие файлы я получу?",
      "Сколько правок входит в стоимость?",
    ],
    aiTitle: "AI идеи",
    aiSubtitle:
      "Генератор идей для палитр, референсов и концептов (в разработке).",
    bottomOrder: "Оформить заказ",
    bottomGenerate: "Сгенерировать идею",
    orderAlert:
      "Скоро здесь будет переход к твоему Telegram для оформления заказа 😉",
    aiAlert: "Скоро здесь будет генератор идей на AI 🚀",
  },
};

const GALLERY_CATEGORIES = ["Аватарки", "Превью", "Баннеры"];
const GALLERY_ITEMS = [
  { id: "1", category: "Аватарки", title: "Аватар 1", image: "/images/podborka1.jpg", description: "Описание аватарки 1" },
  { id: "2", category: "Превью", title: "Превью 1", image: "/images/avatar1.jpg", description: "Описание превью 1" },
  { id: "3", category: "Баннеры", title: "Баннер 1", image: "/images/banner1.jpg", description: "Описание баннера 1" },
];

const REVIEWS_ITEMS = [
  { id: "r1", name: "Alice", text: "Отличная работа!" },
  { id: "r2", name: "Bob", text: "Очень понравилось." },
  { id: "r3", name: "Charlie", text: "Буду обращаться ещё." },
];

const AI_CATEGORIES = ["Скамер", "Доксер", "Криптан", "Абузы", "Осинтеры"];
const AI_NAMES = ["CryptoFox", "ShadowHunter", "NeoBot", "Abyss", "ZeroOne"];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [language, setLanguage] = useState("ru");
  const [activeCategory, setActiveCategory] = useState(GALLERY_CATEGORIES[0]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [aiIdea, setAiIdea] = useState("");

  const t = TEXTS[language];
  const labels = TAB_LABELS[language];

  const handleBottomButton = () => {
    if (activeTab === TABS.AI) {
      generateAiIdea();
    } else {
      alert(t.orderAlert);
    }
  };

  const generateAiIdea = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomCategory =
      AI_CATEGORIES[Math.floor(Math.random() * AI_CATEGORIES.length)];
    const randomName = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
    const randomNick = `${randomName}${Math.floor(Math.random() * 999)}`;
    setAiIdea(
      `Категория: ${randomCategory}\nИмя: ${randomNick}\nЦвет: ${randomColor}`
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <div>
            <h2>{t.galleryTitle}</h2>
            <p>{t.gallerySubtitle}</p>
            <div>
              {GALLERY_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {GALLERY_ITEMS.filter((p) => p.category === activeCategory).map(
                (p) => (
                  <SwiperSlide key={p.id}>
                    <img
                      src={p.image}
                      alt={p.title}
                      onClick={() => setSelectedImage(p)}
                      style={{ width: "200px", cursor: "pointer" }}
                    />
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        );

      case TABS.REVIEWS:
        return (
          <div>
            <h2>{t.reviewsTitle}</h2>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {REVIEWS_ITEMS.map((r) => (
                <SwiperSlide key={r.id} style={{ width: 250 }}>
                  <div>
                    <div>{r.name}</div>
                    <div>{r.text}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );

      case TABS.AI:
        return (
          <div>
            <h2>{t.aiTitle}</h2>
            <p>{t.aiSubtitle}</p>
            {aiIdea && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#000", // черный текст
                  whiteSpace: "pre-line",
                }}
              >
                {aiIdea}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <nav>
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontWeight: activeTab === tab ? "bold" : "normal",
              marginRight: "5px",
            }}
          >
            {labels[tab]}
          </button>
        ))}
      </nav>
      <main>{renderContent()}</main>
      <button onClick={handleBottomButton}>
        {activeTab === TABS.AI ? t.bottomGenerate : t.bottomOrder}
      </button>
    </div>
  );
}
