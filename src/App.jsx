import React, { useState } from "react";
import Gallery from "./components/Gallery";

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

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "alt" : "dark"));
  };

  const handleOrderClick = () => {
    window.open(`https://t.me/${CONTACT_TG}`, "_blank");
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return <Gallery />;
      case TABS.REVIEWS:
        return (
          <div className="card">
            <h2>Отзывы</h2>
            <p>Здесь будут отзывы клиентов</p>
          </div>
        );
      case TABS.ORDER:
        return (
          <div className="card">
            <h2>Заказать</h2>
            <button onClick={handleOrderClick}>Написать @{CONTACT_TG}</button>
          </div>
        );
      default:
        return <div className="card">Содержимое</div>;
    }
  };

  return (
    <div className={`app-root theme-${theme}`}>
      <div className="top-bar">
        <div className="top-bar-left">
          <span className="app-title">Rival App</span>
          <span className="app-subtitle">портфолио дизайнера</span>
        </div>
        <button className="icon-btn" onClick={toggleTheme}>🌗</button>
      </div>

      <nav className="tabs">
        {Object.values(TABS).map(tabKey => (
          <button
            key={tabKey}
            className={activeTab === tabKey ? "tab-btn tab-btn-active" : "tab-btn"}
            onClick={() => setActiveTab(tabKey)}
          >
            {TAB_LABELS[tabKey]_
