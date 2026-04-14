/**
 * Примеры интеграции улучшенных компонентов
 * Готовые примеры для быстрого старта
 */

import React, { useState } from 'react';
import EnhancedButton from './components/EnhancedButton';
import PremiumCard from './components/PremiumCard';
import EnhancedImageCard from './components/EnhancedImageCard';
import EnhancedToast from './components/EnhancedToast';
import SwipeableCard from './components/SwipeableCard';
import ContextMenu from './components/ContextMenu';
import PullToRefresh from './components/PullToRefresh';
import SkeletonLoader from './components/SkeletonLoader';
import { EnhancedSFX } from './components/EnhancedSoundSystem';

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
// ПРИМЕР 1: Улучшенная галерея с новыми компонентами
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ

export function EnhancedGalleryExample() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  const showToast = (message, type = 'info') => {
    const toast = {
      id: Date.now(),
      message,
      type,
      duration: 3000,
    };
    setToasts(prev => [...prev, toast]);
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Загрузка данных
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    showToast('Галерея обновлена!', 'success');
  };

  const handleLike = (id) => {
    EnhancedSFX.like();
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, liked: !item.liked } : item
    ));
    showToast('Добавлено в избранное', 'success');
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  return (
    <div>
      <PullToRefresh onRefresh={handleRefresh}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
          padding: 16,
        }}>
          {loading ? (
            <SkeletonLoader variant="card" count={6} />
          ) : (
            items.map((item, index) => (
              <EnhancedImageCard
                key={item.id}
                image={item.img}
                title={item.title}
                description={item.desc}
                tags={item.tags}
                views={item.views}
                popular={item.popular}
                liked={item.liked}
                onLike={() => handleLike(item.id)}
                onClick={() => console.log('Open', item.id)}
                onContextMenu={(e) => handleContextMenu(e, item)}
                sfx={EnhancedSFX}
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))
          )}
        </div>
      </PullToRefresh>

      {/* Toast notifications */}
      <EnhancedToast
        toasts={toasts}
        onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
        sfx={EnhancedSFX}
      />

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          items={[
            {
              icon: "вќ¤",
              label: "Добавить в избранное",
              onClick: () => handleLike(contextMenu.item.id)
            },
            {
              icon: "📤",
              label: "Поделиться",
              onClick: () => showToast('Скопировано в буфер', 'success')
            },
            {
              icon: "💾",
              label: "Скачать",
              onClick: () => showToast('Загрузка началась', 'info')
            },
            { divider: true },
            {
              icon: "🗑",
              label: "Удалить",
              onClick: () => showToast('Удалено', 'error'),
              danger: true
            },
          ]}
          onClose={() => setContextMenu(null)}
          sfx={EnhancedSFX}
        />
      )}
    </div>
  );
}

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
// ПРИМЕР 2: Улучшенная корзина со swipe
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ

export function EnhancedCartExample() {
  const [cart, setCart] = useState([
    { id: 1, name: 'Аватарка', price: 5, qty: 1 },
    { id: 2, name: 'Превью', price: 5, qty: 2 },
  ]);

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    EnhancedSFX.remove();
  };

  const addToFavorites = (id) => {
    EnhancedSFX.like();
    console.log('Added to favorites:', id);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Корзина</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cart.map(item => (
          <SwipeableCard
            key={item.id}
            onSwipeLeft={() => removeItem(item.id)}
            onSwipeRight={() => addToFavorites(item.id)}
            leftAction={{ icon: "🗑", color: "#ef4444", label: "Delete" }}
            rightAction={{ icon: "вќ¤", color: "#10b981", label: "Like" }}
            sfx={EnhancedSFX}
          >
            <PremiumCard variant="default" hover>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(100,116,139,0.7)' }}>
                    Количество: {item.qty}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900 }}>
                  ${item.price * item.qty}
                </div>
              </div>
            </PremiumCard>
          </SwipeableCard>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <EnhancedButton
          variant="gradient"
          size="lg"
          fullWidth
          magnetic
          shimmer
          onClick={() => {
            EnhancedSFX.order();
            console.log('Order placed!');
          }}
          sfx={EnhancedSFX}
        >
          Оформить заказ — ${cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
        </EnhancedButton>
      </div>
    </div>
  );
}

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
// ПРИМЕР 3: Улучшенная форма с валидацией
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ

export function EnhancedFormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type) => {
    setToasts(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      duration: 3000,
    }]);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      EnhancedSFX.error();
      showToast('Заполните все поля', 'error');
      return;
    }

    setLoading(true);
    EnhancedSFX.tap();

    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLoading(false);
    EnhancedSFX.success();
    showToast('Сообщение отправлено!', 'success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      <PremiumCard variant="gradient" glow>
        <h2 style={{ marginTop: 0 }}>Связаться с нами</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="text"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.2)',
              background: 'rgba(13,15,26,0.6)',
              color: '#fff',
              fontSize: 14,
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.2)',
              background: 'rgba(13,15,26,0.6)',
              color: '#fff',
              fontSize: 14,
            }}
          />

          <textarea
            placeholder="Сообщение"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={4}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.2)',
              background: 'rgba(13,15,26,0.6)',
              color: '#fff',
              fontSize: 14,
              resize: 'vertical',
            }}
          />

          <EnhancedButton
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onClick={handleSubmit}
            sfx={EnhancedSFX}
          >
            Отправить
          </EnhancedButton>
        </div>
      </PremiumCard>

      <EnhancedToast
        toasts={toasts}
        onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
        sfx={EnhancedSFX}
      />
    </div>
  );
}

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
// ПРИМЕР 4: Улучшенный список с фильтрами
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ

export function EnhancedListExample() {
  const [filter, setFilter] = useState('all');
  const [items] = useState([
    { id: 1, title: 'Item 1', category: 'design' },
    { id: 2, title: 'Item 2', category: 'code' },
    { id: 3, title: 'Item 3', category: 'design' },
  ]);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.category === filter);

  return (
    <div style={{ padding: 16 }}>
      {/* Фильтры */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all', 'design', 'code'].map(f => (
          <EnhancedButton
            key={f}
            variant={filter === f ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              setFilter(f);
              EnhancedSFX.filter();
            }}
            sfx={EnhancedSFX}
          >
            {f}
          </EnhancedButton>
        ))}
      </div>

      {/* Список */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredItems.map((item, index) => (
          <PremiumCard
            key={item.id}
            variant="default"
            hover
            style={{
              animation: 'fadeInUp 0.4s ease both',
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(100,116,139,0.7)', marginTop: 4 }}>
              {item.category}
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

export default {
  EnhancedGalleryExample,
  EnhancedCartExample,
  EnhancedFormExample,
  EnhancedListExample,
};

