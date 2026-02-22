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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1>Твой подарок</h1>
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left' }}>
              <li>Бесплатный доступ к базовым функциям</li>
              <li>5 бесплатных бонусов</li>
              {/* Добавьте еще бонусы */}
            </ul>
            <button
              onClick={() => {
                console.log('Пак получен');
                setActiveTab('Free Pack Activated'); // Измените текст кнопки и состояние вкладки
              }}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#4CAF50',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Забрать
            </button>
          </div>
        );
      case 'Free Pack Activated':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1>Твой подарок активирован</h1>
            <p>Спасибо за покупку! Ваш пакет теперь доступен.</p>
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
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '10px 0' }}>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', gap: '20px' }}>
          <li onClick={() => handleTabChange('Dashboard')} style={{ cursor: 'pointer', color: activeTab === 'Dashboard' ? '#4CAF50' : '#333' }}>Дашборд</li>
          <li onClick={() => handleTabChange('CRM')} style={{ cursor: 'pointer', color: activeTab === 'CRM' ? '#4CAF50' : '#333' }}>CRM</li>
          <li onClick={() => handleTabChange('Billing')} style={{ cursor: 'pointer', color: activeTab === 'Billing' ? '#4CAF50' : '#333' }}>Биллинг</li>
          <li onClick={() => handleTabChange('Free Pack')} style={{ cursor: 'pointer', color: activeTab === 'Free Pack' || activeTab === 'Free Pack Activated' ? '#4CAF50' : '#333' }}>Бесплатный пак</li>
        </ul>
      </nav>
      <main style={{ padding: '20px' }}>{renderContent()}</main>
    </div>
  );
};

export default App;
