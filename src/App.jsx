return (
    <div className={app-root theme-${theme}}>
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
