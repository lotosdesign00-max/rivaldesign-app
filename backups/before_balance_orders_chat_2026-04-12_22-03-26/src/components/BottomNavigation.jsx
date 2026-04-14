/**
 * BOTTOM NAVIGATION — Refined & Clean
 * Упрощённая премиальная навигация
 */

import React from 'react';
import './BottomNavigation.css';
import { useCart } from '../contexts/CartContext';
import sound from '../services/sound';

const NAV_ITEMS = [
  { id: 'gallery', icon: '🎨', label: 'Gallery' },
  { id: 'ai', icon: '✨', label: 'AI' },
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'courses', icon: '📚', label: 'Courses' },
  { id: 'pricing', icon: '💎', label: 'Pricing' },
];

export default function BottomNavigation({ currentPage, onNavigate }) {
  const { count: cartCount } = useCart();

  const handleClick = (pageId) => {
    sound.tap();
    onNavigate(pageId);
  };

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__container">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id;
          const isHome = item.id === 'home';

          return (
            <button
              key={item.id}
              className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''} ${
                isHome ? 'bottom-nav__item--home' : ''
              }`}
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

              {/* Cart badge */}
              {item.id === 'pricing' && cartCount > 0 && (
                <span className="bottom-nav__badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
