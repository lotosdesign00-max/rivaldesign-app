/**
 * BOTTOM NAVIGATION — Refined & Clean
 * Упрощённая премиальная навигация
 */

import React from 'react';
import './BottomNavigation.css';
import { SoundSystem } from '../core/audio/SoundSystem';

const NAV_ITEMS = [
  { id: 'discover', icon: '🏠', label: 'Главная' },
  { id: 'services', icon: '💎', label: 'Услуги' },
  { id: 'admin', icon: '⚙️', label: 'Админ' },
  { id: 'profile', icon: '👤', label: 'Профиль' },
];

export default function BottomNavigation({ currentPage, onNavigate }) {
  const handleClick = (pageId) => {
    SoundSystem?.tap?.();
    onNavigate(pageId);
  };

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__container">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
              onClick={() => handleClick(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon */}
              <span className="bottom-nav__icon">{item.icon}</span>

              {/* Label */}
              <span className="bottom-nav__label">{item.label}</span>

              {/* Active indicator */}
              {isActive && <div className="bottom-nav__indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
