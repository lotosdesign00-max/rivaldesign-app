/**
 * ANALYTICS DASHBOARD
 * Personal analytics and insights
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getUser } from '../core/user';
import analytics from '../core/analytics';

export default function AnalyticsDashboard({ lang = 'ru' }) {
  const user = getUser();
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    const data = analytics.getSummary();
    setSummary(data);
  };

  const stats = useMemo(() => {
    if (!user) return [];

    return [
      {
        id: 'level',
        icon: '⭐',
        label: lang === 'ru' ? 'Уровень' : 'Level',
        value: user.level,
        color: '#8B5CF6',
      },
      {
        id: 'xp',
        icon: '✨',
        label: lang === 'ru' ? 'Опыт' : 'XP',
        value: user.xp.toLocaleString(),
        color: '#22D3EE',
      },
      {
        id: 'streak',
        icon: '🔥',
        label: lang === 'ru' ? 'Стрик' : 'Streak',
        value: `${user.streak} ${lang === 'ru' ? 'дн' : 'd'}`,
        color: '#F59E0B',
      },
      {
        id: 'achievements',
        icon: '🏆',
        label: lang === 'ru' ? 'Достижения' : 'Achievements',
        value: user.achievements?.length || 0,
        color: '#10B981',
      },
    ];
  }, [user, lang]);

  const activities = useMemo(() => {
    if (!user?.stats) return [];

    return [
      {
        id: 'views',
        label: lang === 'ru' ? 'Просмотры галереи' : 'Gallery views',
        value: user.stats.galleryViews || 0,
        icon: '👁️',
      },
      {
        id: 'likes',
        label: lang === 'ru' ? 'Лайки' : 'Likes',
        value: user.stats.likes || 0,
        icon: '❤️',
      },
      {
        id: 'courses',
        label: lang === 'ru' ? 'Курсы начато' : 'Courses started',
        value: user.stats.coursesStarted || 0,
        icon: '📚',
      },
      {
        id: 'lessons',
        label: lang === 'ru' ? 'Уроки пройдено' : 'Lessons completed',
        value: user.stats.lessonsCompleted || 0,
        icon: '✅',
      },
      {
        id: 'ai',
        label: lang === 'ru' ? 'AI чаты' : 'AI chats',
        value: user.stats.aiChats || 0,
        icon: '🤖',
      },
    ];
  }, [user, lang]);

  const timeSpent = useMemo(() => {
    if (!user?.stats?.timeSpent) return '0m';
    const minutes = Math.floor(user.stats.timeSpent / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }, [user]);

  return (
    <div style={{
      padding: 20,
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #C7D2FE, #8B5CF6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>
          {lang === 'ru' ? 'Аналитика' : 'Analytics'}
        </h1>
        <p style={{
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.6)',
        }}>
          {lang === 'ru' ? 'Твоя активность и прогресс' : 'Your activity and progress'}
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
      }}>
        {['week', 'month', 'all'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: timeRange === range
                ? '1px solid #8B5CF6'
                : '1px solid rgba(255, 255, 255, 0.1)',
              background: timeRange === range
                ? 'rgba(139, 92, 246, 0.15)'
                : 'rgba(255, 255, 255, 0.03)',
              color: timeRange === range ? '#C7D2FE' : 'rgba(255, 255, 255, 0.6)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {range === 'week' && (lang === 'ru' ? 'Неделя' : 'Week')}
            {range === 'month' && (lang === 'ru' ? 'Месяц' : 'Month')}
            {range === 'all' && (lang === 'ru' ? 'Всё время' : 'All time')}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32,
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: 20,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${stat.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}>
                {stat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 12,
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: 4,
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: stat.color,
                }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity List */}
      <div style={{
        padding: 24,
        borderRadius: 20,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: 32,
      }}>
        <h2 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#fff',
          marginBottom: 20,
        }}>
          {lang === 'ru' ? 'Активность' : 'Activity'}
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 20 }}>{activity.icon}</div>
                <div style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}>
                  {activity.label}
                </div>
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#8B5CF6',
              }}>
                {activity.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Spent */}
      <div style={{
        padding: 24,
        borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.05))',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: 8,
        }}>
          {lang === 'ru' ? 'Время в приложении' : 'Time in app'}
        </div>
        <div style={{
          fontSize: 36,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #C7D2FE, #8B5CF6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {timeSpent}
        </div>
      </div>

      {/* Insights */}
      <div style={{
        marginTop: 32,
        padding: 24,
        borderRadius: 20,
        background: 'rgba(34, 211, 238, 0.05)',
        border: '1px solid rgba(34, 211, 238, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 24 }}>💡</div>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#22D3EE',
          }}>
            {lang === 'ru' ? 'Инсайты' : 'Insights'}
          </h3>
        </div>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {user.streak >= 7 && (
            <li style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.7)',
              paddingLeft: 20,
              position: 'relative',
            }}>
              <span style={{ position: 'absolute', left: 0 }}>🔥</span>
              {lang === 'ru'
                ? `Отличная серия! ${user.streak} дней подряд`
                : `Great streak! ${user.streak} days in a row`}
            </li>
          )}
          {user.stats.coursesStarted > 0 && user.stats.coursesCompleted === 0 && (
            <li style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.7)',
              paddingLeft: 20,
              position: 'relative',
            }}>
              <span style={{ position: 'absolute', left: 0 }}>📚</span>
              {lang === 'ru'
                ? 'Завершите начатый курс, чтобы получить сертификат'
                : 'Complete your started course to earn a certificate'}
            </li>
          )}
          {user.stats.likes < 10 && (
            <li style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.7)',
              paddingLeft: 20,
              position: 'relative',
            }}>
              <span style={{ position: 'absolute', left: 0 }}>❤️</span>
              {lang === 'ru'
                ? 'Лайкайте работы, чтобы создать персональную коллекцию'
                : 'Like works to build your personal collection'}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
