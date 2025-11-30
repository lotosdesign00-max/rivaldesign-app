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

  const toggleTheme = () =&gt; {
    setTheme((prev) =&gt; (prev === "dark" ? "alt" : "dark"));
  };

  const handleOrderClick = () =&gt; {
    window.open(<code>https://t.me/${CONTACT_TG}</code>, "_blank");
  };

  const renderContent = () =&gt; {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          &lt;section className="card"&gt;
            &lt;h2 className="section-title"&gt;Галерея работ&lt;/h2&gt;
            &lt;p className="section-subtitle"&gt;
              Здесь будут твои работы: логотипы, постеры, баннеры, брендинг и т.д.
            &lt;/p&gt;
            &lt;p className="hint-text"&gt;
              Позже сюда можно прикрутить свайпы, категории и кнопку "Подробнее".
            &lt;/p&gt;
          &lt;/section&gt;
        );

      case TABS.REVIEWS:
        return (
          &lt;section className="card"&gt;
            &lt;h2 className="section-title"&gt;Отзывы клиентов&lt;/h2&gt;
            &lt;p className="section-subtitle"&gt;
              Здесь будут карточки с отзывами, именем и аватаркой.
            &lt;/p&gt;
            &lt;button className="secondary-btn"&gt;Оставить отзыв&lt;/button&gt;
          &lt;/section&gt;
        );

      case TABS.ORDER:
        return (
          &lt;section className="card"&gt;
            &lt;h2 className="section-title"&gt;Заказать дизайн&lt;/h2&gt;
            &lt;p className="section-subtitle"&gt;
              Напиши мне в Telegram, чтобы обсудить проект:
            &lt;/p&gt;
            &lt;button className="primary-btn wide" onClick={handleOrderClick}&gt;
              Написать @{CONTACT_TG}
            &lt;/button&gt;
            &lt;p className="hint-text"&gt;
              Укажи тип проекта, сроки, примерный бюджет и пожелания.
            &lt;/p&gt;
          &lt;/section&gt;
        );

      case TABS.PRICING:
        return (
          &lt;section className="card"&gt;
            &lt;h2 className="section-title"&gt;Прайс / Услуги&lt;/h2&gt;
            &lt;ul className="list"&gt;
              &lt;li&gt;Логотип — от 𝑋ₓₓₓ грн&lt;/li&gt;
              &lt;li&gt;Фирменный стиль — от 𝑋ₓₓₓ грн&lt;/li&gt;
              &lt;li&gt;Оформление соцсетей — от 𝑋ₓₓₓ грн&lt;/li&gt;
              &lt;li&gt;Рекламные баннеры — от 𝑋ₓₓₓ грн&lt;/li&gt;
            &lt;/ul&gt;
          &lt;/section&gt;
        );

      case TABS.ABOUT:
        return (
          &lt;section className="card"&gt;
            &lt;h2 className="section-title"&gt;Обо мне&lt;/h2&gt;
            &lt;p className="section-subtitle"&gt;
              Я Rival, дизайнер. Работаю с брендами, помогаю выделиться в соцсетях и рекламе.
            &lt;/p&gt;
            &lt;p className="hint-text"&gt;
              Здесь можно добавить фото, ссылки на Behance, Instagram, Telegram и т.д.
            &lt;/p&gt;
          &lt;/section&gt;
        );

      case TABS.FAQ:
        return (
          &lt;section className="card"&gt;
            &lt;h2 className="section-title"&gt;FAQ / Частые вопросы&lt;/h2&gt;
            &lt;ul className="list"&gt;
              &lt;li&gt;Как проходит работа?&lt;/li&gt;
              &lt;li&gt;Какие файлы я получу?&lt;/li&gt;
              &lt;li&gt;Сколько правок входит в стоимость?&lt;/li&gt;
            &lt;/ul&gt;
          &lt;/section&gt;
        );

      case TABS.AI:
        return (
          &lt;section className="card"&gt;
            &lt;h2 className="section-title"&gt;AI — генератор идей&lt;/h2&gt;
            &lt;p className="section-subtitle"&gt;
              Здесь можно сделать блок, где бот предлагает палитры, референсы и концепты.
            &lt;/p&gt;
          &lt;/section&gt;
        );

      default:
        return null;
    }
  };

  return (
    &lt;div className={<code>app-root theme-${theme}</code>}&gt;
      &lt;div className="app-shell"&gt;
        {/* Верхняя панель */}
        &lt;div className="top-bar"&gt;
          &lt;div className="top-bar-left"&gt;
            &lt;span className="app-title"&gt;Rival App&lt;/span&gt;
            &lt;span className="app-subtitle"&gt;портфолио дизайнера&lt;/span&gt;
          &lt;/div&gt;
          &lt;button className="icon-btn" onClick={toggleTheme}&gt;
            🌗
          &lt;/button&gt;
        &lt;/div&gt;

        {/* Вкладки */}
        &lt;nav className="tabs"&gt;
          {Object.values(TABS).map((tabKey) =&gt; (
            &lt;button
              key={tabKey}
              className={
                "tab-btn" + (activeTab === tabKey ? " tab-btn-active" : "")
              }
              onClick={() =&gt; setActiveTab(tabKey)}
            &gt;
              {TAB_LABELS[tabKey]}
            &lt;/button&gt;
          ))}
        &lt;/nav&gt;

        {/* Контент вкладки */}
        &lt;main className="tab-content"&gt;{renderContent()}&lt;/main&gt;

        {/* Фиксированная кнопка заказа снизу */}
        &lt;button
          className="primary-btn fixed-order-btn"
          onClick={handleOrderClick}
        &gt;
          Оформить заказ
        &lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}

export default App;

styles.css
:root{
  --bg:#0b0b0b; /* black primary */
  --accent:#e11b23; /* red accent for alt theme */
  --card:#121212;
  --muted:#9b9b9b;
  --text:#f5f5f5;
  --accent-weak:#8a0f12;
}

/* alt theme variables (red accents) */
[data-theme="alt"]{
  --bg: linear-gradient(180deg,#070707 0%, #0b0506 100%);
  --accent: #e11b23;
  --card:#160606;
  --muted:#c1a9a9;
  --text:#fff;
  --accent-weak:#9b1216;
}

*{box-sizing:border-box}
body{
  margin:0;
  font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  background:var(--bg);
  color:var(--text);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.app{
  max-width:920px;
  margin:12px auto;
  padding:14px;
}

.header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}

.logo{
  display:flex;
  gap:12px;
  align-items:center;
}

.logo .dot{
  width:36px;height:36px;border-radius:8px;background:var(--accent);
}

.h1{font-size:20px;font-weight:700}

.card{
  background:var(--card);
  padding:12px;
  border-radius:12px;
  margin:12px 0;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
}

/* header top-right controls */
.controls{display:flex;gap:8px;align-items:center}
.icon-btn{background:transparent;border:none;color:var(--text);font-size:18px;padding:8px;border-radius:8px;cursor:pointer}
.icon-btn:hover{background:rgba(255,255,255,0.03)}

/* gallery */
.swiper {
  padding: 16px 0;
}
.project-img{
  width:100%;
  height:220px;
  object-fit:cover;
  border-radius:10px;
}

/* small */
.row {display:flex;gap:12px;flex-wrap:wrap}
.btn{
  background:var(--accent); color:white; border:none; padding:10px 14px; border-radius:10px; cursor:pointer;
}
.muted{color:var(--muted);font-size:13px}
.input, textarea{
  width:100%; padding:8px; border-radius:8px; border:1px solid #222;background:#0d0d0d;color:var(--text);margin-top:6px;
}
.footer{margin-top:20px;text-align:center;color:var(--muted);font-size:13px}

/* social icons row */
.socials{display:flex;gap:10px;align-items:center;margin-top:8px}
.social-link{background:transparent;border:1px solid rgba(255,255,255,0.06);padding:8px 10px;border-radius:8px;color:var(--text);text-decoration:none;font-size:14px}

/* make order fixed button (appears at bottom) */
.order-fixed{
  position:fixed;
  left:50%;
  transform:translateX(-50%);
  bottom:18px;
  z-index:50;
  background:var(--accent);
  color:white;
  border:none;
  padding:12px 18px;
  border-radius:999px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  cursor:pointer;
}

/* responsive */
@media(max-width:480px){
  .project-img{height:180px}
  .app{padding:10px}
}

/* Центрируем приложение и фиксируем ширину */

.app-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 8px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
}

.theme-dark {
  background: #050509;
  color: #f5f5f5;
}

.theme-alt {
  background: #1a0004;
  color: #ffecec;
}

.app-shell {
  width: 100%;
  max-width: 480px;
  position: relative;
}

/* Верхняя панель */

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.top-bar-left {
  display: flex;
  flex-direction: column;
}

.app-title {
  font-size: 16px;
  font-weight: 600;
}

.app-subtitle {
  font-size: 12px;
  opacity: 0.7;
}

.icon-btn {
  border: none;
  outline: none;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  cursor: pointer;
}

/* Вкладки */

.tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 6px 2px 8px;
  margin-bottom: 8px;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  flex: 0 0 auto;
  border-radius: 999px;
  border: none;
  padding: 6px 12px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  cursor: pointer;
  white-space: nowrap;
  opacity: 0.7;
}

.tab-btn-active {
  background: #ff3040;
  opacity: 1;
}

/* Карточки и текст */

.card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 14px 14px 16px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.section-subtitle {
  font-size: 13px;
  opacity: 0.85;
  margin-bottom: 10px;
}

.hint-text {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
}

.list {
  font-size: 13px;
  padding-left: 18px;
}

.list li {
  margin-bottom: 4px;
}

/* Кнопки */

.primary-btn,
.secondary-btn {
  border: none;
  outline: none;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.primary-btn {
  background: #ff3040;
  color: #fff;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.06);
  color: inherit;
}

.primary-btn.wide {
  width: 100%;
}

/* Контент вкладки + место под кнопку снизу */

.tab-content {
  padding-bottom: 80px;
}

/* Фиксированная нижняя кнопка */

.fixed-order-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  width: 100%;
  max-width: 480px;
  border-radius: 999px;
}﷯
</div>
