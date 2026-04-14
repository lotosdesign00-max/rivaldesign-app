/**
 * TEST APP
 * Simple app to test new core systems
 */

import React, { useState, useEffect } from 'react';
import { getUser, addXP } from './core/user';
import { getTheme } from './core/theme';
import OnboardingSystem from './features/OnboardingSystem';
import NotificationSystem from './features/NotificationSystem';
import AnalyticsDashboard from './features/AnalyticsDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const theme = getTheme('deepspace');

  useEffect(() => {
    const userData = getUser();
    setUser(userData);

    // Show onboarding if not completed
    if (!userData.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    const userData = getUser();
    setUser(userData);
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.bg.primary,
        color: theme.text.primary,
      }}>
        <div style={{ fontSize: 24 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg.primary,
      color: theme.text.primary,
      fontFamily: theme.fonts?.text || 'Inter, sans-serif',
    }}>
      {/* Onboarding */}
      {showOnboarding && (
        <OnboardingSystem
          lang="ru"
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Header */}
      <header style={{
        padding: '20px',
        borderBottom: `1px solid ${theme.border.subtle}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 900,
            background: theme.gradient.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>
            Rival Design 5.0
          </h1>
          <p style={{
            fontSize: 12,
            color: theme.text.tertiary,
            margin: '4px 0 0',
          }}>
            Premium Portfolio & Learning Platform
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* User Info */}
          <div style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: theme.glass.medium,
            border: `1px solid ${theme.border.subtle}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 12, color: theme.text.tertiary }}>
                Level {user.level}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {user.xp} XP
              </div>
            </div>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: theme.gradient.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>
              {user.role === 'designer' && '🎨'}
              {user.role === 'streamer' && '🎮'}
              {user.role === 'brand' && '🏢'}
              {user.role === 'student' && '📚'}
              {!user.role && '👤'}
            </div>
          </div>

          {/* Notifications */}
          <NotificationSystem lang="ru" />
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${theme.border.subtle}`,
        display: 'flex',
        gap: 8,
      }}>
        {['home', 'analytics', 'gallery', 'courses'].map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: currentPage === page
                ? `1px solid ${theme.border.strong}`
                : `1px solid ${theme.border.subtle}`,
              background: currentPage === page
                ? theme.glass.strong
                : theme.glass.subtle,
              color: currentPage === page ? theme.text.primary : theme.text.secondary,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {page === 'home' && '🏠 Главная'}
            {page === 'analytics' && '📊 Аналитика'}
            {page === 'gallery' && '🖼️ Галерея'}
            {page === 'courses' && '📚 Курсы'}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: 20 }}>
        {currentPage === 'home' && (
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>
              Добро пожаловать, {user.name || 'Пользователь'}! 👋
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}>
              {/* Stats */}
              <div style={{
                padding: 24,
                borderRadius: 16,
                background: theme.glass.medium,
                border: `1px solid ${theme.border.subtle}`,
              }}>
                <div style={{ fontSize: 14, color: theme.text.tertiary, marginBottom: 8 }}>
                  Уровень
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: theme.accent.primary }}>
                  {user.level}
                </div>
              </div>

              <div style={{
                padding: 24,
                borderRadius: 16,
                background: theme.glass.medium,
                border: `1px solid ${theme.border.subtle}`,
              }}>
                <div style={{ fontSize: 14, color: theme.text.tertiary, marginBottom: 8 }}>
                  Опыт
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: theme.accent.secondary }}>
                  {user.xp}
                </div>
              </div>

              <div style={{
                padding: 24,
                borderRadius: 16,
                background: theme.glass.medium,
                border: `1px solid ${theme.border.subtle}`,
              }}>
                <div style={{ fontSize: 14, color: theme.text.tertiary, marginBottom: 8 }}>
                  Стрик
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: theme.semantic.warning }}>
                  {user.streak} 🔥
                </div>
              </div>

              <div style={{
                padding: 24,
                borderRadius: 16,
                background: theme.glass.medium,
                border: `1px solid ${theme.border.subtle}`,
              }}>
                <div style={{ fontSize: 14, color: theme.text.tertiary, marginBottom: 8 }}>
                  Достижения
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: theme.semantic.success }}>
                  {user.achievements?.length || 0} 🏆
                </div>
              </div>
            </div>

            {/* Test Button */}
            <button
              onClick={() => {
                addXP(10, 'test');
                setUser(getUser());
              }}
              style={{
                padding: '14px 28px',
                borderRadius: 12,
                border: 'none',
                background: theme.gradient.primary,
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: theme.shadow.glow,
              }}
            >
              Получить +10 XP (тест)
            </button>
          </div>
        )}

        {currentPage === 'analytics' && (
          <AnalyticsDashboard lang="ru" />
        )}

        {currentPage === 'gallery' && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🖼️</div>
            <h2 style={{ fontSize: 24, marginBottom: 12 }}>Галерея</h2>
            <p style={{ color: theme.text.tertiary }}>
              Smart Gallery в разработке...
            </p>
          </div>
        )}

        {currentPage === 'courses' && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📚</div>
            <h2 style={{ fontSize: 24, marginBottom: 12 }}>Курсы</h2>
            <p style={{ color: theme.text.tertiary }}>
              Interactive Course Platform в разработке...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
