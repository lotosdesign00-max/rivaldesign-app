/**
 * SMART NOTIFICATION SYSTEM
 * Advanced notification center with real-time updates
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { on, emit, EVENTS } from '../core/events';
import { getUser } from '../core/user';
import storage from '../core/storage';

const NOTIFICATION_ICONS = {
  achievement: '🏆',
  level_up: '⬆️',
  like: '❤️',
  comment: '💬',
  follow: '👤',
  course: '📚',
  system: '⚙️',
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export default function NotificationSystem({ lang = 'ru' }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();

    // Listen for new notifications
    const unsubscribe = on(EVENTS.NOTIFICATION_RECEIVED, handleNewNotification);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const loadNotifications = () => {
    const saved = storage.get('notifications', []);
    setNotifications(saved);
  };

  const saveNotifications = (notifs) => {
    storage.set('notifications', notifs);
    setNotifications(notifs);
  };

  const handleNewNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      timestamp: Date.now(),
      read: false,
      ...notification,
    };

    const updated = [newNotif, ...notifications].slice(0, 100);
    saveNotifications(updated);

    // Show toast
    showToast(newNotif);
  };

  const showToast = (notification) => {
    // Implement toast notification
    emit(EVENTS.TOAST_SHOWN, {
      message: notification.message,
      type: notification.type || 'info',
      duration: 3000,
    });
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return lang === 'ru' ? 'только что' : 'just now';
    if (minutes < 60) return lang === 'ru' ? `${minutes} мин назад` : `${minutes}m ago`;
    if (hours < 24) return lang === 'ru' ? `${hours} ч назад` : `${hours}h ago`;
    return lang === 'ru' ? `${days} д назад` : `${days}d ago`;
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          width: 44,
          height: 44,
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.03)',
          color: '#fff',
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 6px',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'fixed',
                top: 70,
                right: 20,
                width: 400,
                maxWidth: 'calc(100vw - 40px)',
                maxHeight: 'calc(100vh - 100px)',
                borderRadius: 20,
                background: 'rgba(13, 15, 26, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <h3 style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {lang === 'ru' ? 'Уведомления' : 'Notifications'}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: '#C7D2FE',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {lang === 'ru' ? 'Прочитать все' : 'Mark all read'}
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 0',
              }}>
                {notifications.length === 0 ? (
                  <div style={{
                    padding: 40,
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔕</div>
                    <div style={{ fontSize: 14 }}>
                      {lang === 'ru' ? 'Нет уведомлений' : 'No notifications'}
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => markAsRead(notif.id)}
                        style={{
                          padding: '12px 20px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          background: notif.read
                            ? 'transparent'
                            : 'rgba(139, 92, 246, 0.05)',
                          transition: 'background 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={{
                            fontSize: 24,
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: 'rgba(139, 92, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {NOTIFICATION_ICONS[notif.type] || '📬'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 14,
                              fontWeight: notif.read ? 400 : 600,
                              color: notif.read ? 'rgba(255, 255, 255, 0.7)' : '#fff',
                              marginBottom: 4,
                            }}>
                              {notif.title}
                            </div>
                            {notif.message && (
                              <div style={{
                                fontSize: 13,
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginBottom: 6,
                              }}>
                                {notif.message}
                              </div>
                            )}
                            <div style={{
                              fontSize: 11,
                              color: 'rgba(255, 255, 255, 0.4)',
                            }}>
                              {formatTime(notif.timestamp)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: 'none',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: 'rgba(255, 255, 255, 0.4)',
                              fontSize: 14,
                              cursor: 'pointer',
                              flexShrink: 0,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div style={{
                  padding: 16,
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'center',
                }}>
                  <button
                    onClick={clearAll}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#F87171',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {lang === 'ru' ? 'Очистить все' : 'Clear all'}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper to send notification
export const sendNotification = (notification) => {
  emit(EVENTS.NOTIFICATION_RECEIVED, notification);
};
