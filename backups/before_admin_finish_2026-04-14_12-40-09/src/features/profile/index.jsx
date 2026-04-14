/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROFILE PAGE — User Profile
 * User info, dashboard, statistics, achievements, settings
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, getBalance } from '../../core/supabase/client';
import { useAppStore } from '../../core/state/store';
import { GlassCard } from '../../shared/components/atoms/GlassCard';
import { SoundSystem } from '../../core/audio/SoundSystem';
import Balance from '../balance';
import Orders from '../orders';

const Profile = ({ onOpenChat }) => {
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [activeSection, setActiveSection] = useState(null); // 'balance' | 'orders' | null

  const tg = window.Telegram?.WebApp;
  const telegramUser = tg?.initDataUnsafe?.user;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!telegramUser?.id) return;
    try {
      const currentUser = await getCurrentUser(telegramUser.id);
      setUser(currentUser);
      const bal = await getBalance(telegramUser.id);
      setBalance(bal);
    } catch (err) {
      console.error('Load user data error:', err);
    }
  };

  const handleNavigate = (section) => {
    SoundSystem?.tap?.();
    setActiveSection(section);
  };

  const handleBack = () => {
    SoundSystem?.tap?.();
    setActiveSection(null);
  };

  // Render Balance section
  if (activeSection === 'balance') {
    return <Balance />;
  }

  // Render Orders section
  if (activeSection === 'orders') {
    return <Orders onOpenChat={onOpenChat} />;
  }

  return (
    <div style={{ padding: 'var(--space-4)', paddingTop: 'calc(var(--space-6) + var(--safe-area-top))' }}>
      {/* User Info */}
      <GlassCard variant="glass-strong" padding="lg" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}>
            👤
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-primary)', margin: 0 }}>
              {user?.username || user?.first_name || 'Пользователь'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>
              ID: {telegramUser?.id || 'Не авторизован'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Баланс
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>
              ${balance.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Заказы
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
              0
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Menu Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {/* Balance */}
        <button
          onClick={() => handleNavigate('balance')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-4)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-xl)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <span style={{ fontSize: '24px' }}>💰</span>
          <span style={{ flex: 1 }}>Баланс</span>
          <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>${balance.toFixed(2)}</span>
          <span style={{ fontSize: '18px', color: 'var(--text-tertiary)' }}>→</span>
        </button>

        {/* Orders */}
        <button
          onClick={() => handleNavigate('orders')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-4)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-xl)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <span style={{ fontSize: '24px' }}>📦</span>
          <span style={{ flex: 1 }}>Мои заказы</span>
          <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>0 активных</span>
          <span style={{ fontSize: '18px', color: 'var(--text-tertiary)' }}>→</span>
        </button>

        {/* Admin Panel (only for admins) */}
        {user?.is_admin && (
          <button
            onClick={() => {
              SoundSystem?.tap?.();
              setCurrentTab('admin');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-4)',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 'var(--radius-xl)',
              color: '#8b5cf6',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <span style={{ fontSize: '24px' }}>⚙️</span>
            <span style={{ flex: 1 }}>Админ-панель</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
