import React, { useState } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div>
            <h1>Дашборд</h1>
            {/* Добавьте здесь содержимое дашборда */}
          </div>
        );
      case 'CRM':
        return (
          <div>
            <h1>CRM</h1>
            {/* Добавьте здесь содержимое CRM */}
          </div>
        );
      case 'Billing':
        return (
          <div>
            <h1>Биллинг</h1>
            {/* Добавьте здесь содержимое биллинга */}
          </div>
        );
      case 'Free Pack':
        return (
          <div>
            <h1>Твой подарок</h1>
            <ul>
              <li>Бесплатный доступ к базовым функциям</li>
              <li>5 бесплатных бонусов</li>
              {/* Добавьте еще бонусы */}
            </ul>
            <button onClick={() => {
              console.log('Пак получен');
              // Измените текст кнопки
            }}>Забрать</button>
          </div>
        );
      default:
        return (
          <div>
            <h1>404: Страница не найдена</h1>
          </div>
        );
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li onClick={() => handleTabChange('Dashboard')}>Дашборд</li>
          <li onClick={() => handleTabChange('CRM')}>CRM</li>
          <li onClick={() => handleTabChange('Billing')}>Биллинг</li>
          <li onClick={() => handleTabChange('Free Pack')}>Бесплатный пак</li>
        </ul>
      </nav>
      <main>{renderContent()}</main>
    </div>
  );
};

export default App;
