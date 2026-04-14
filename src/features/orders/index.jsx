/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORDERS PAGE — Мои заказы
 * Список заказов со статусами и прогресс-баром
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, getUserOrders, updateOrderStatus } from '../../core/supabase/client';
import { GlassCard } from '../../shared/components/atoms/GlassCard';
import { SoundSystem } from '../../core/audio/SoundSystem';

// Статусы заказа в порядке выполнения
const ORDER_STATUSES = [
  { key: 'waiting_payment', label: 'Ожидание оплаты', icon: '⏳', color: '#f59e0b' },
  { key: 'payment_review', label: 'Проверка оплаты', icon: '🔍', color: '#3b82f6' },
  { key: 'queued', label: 'В очереди', icon: '📋', color: '#8b5cf6' },
  { key: 'in_progress', label: 'В работе', icon: '🎨', color: '#06b6d4' },
  { key: 'preview_sent', label: 'Превью готово', icon: '👁', color: '#10b981' },
  { key: 'revision', label: 'Правки', icon: '✏️', color: '#f97316' },
  { key: 'delivered', label: 'Доставлено', icon: '✅', color: '#22c55e' },
  { key: 'closed', label: 'Закрыт', icon: '🏁', color: '#6b7280' },
  { key: 'canceled', label: 'Отменён', icon: '❌', color: '#ef4444' },
];

const OrdersPage = ({ onOpenChat }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tg = window.Telegram?.WebApp;
  const telegramUser = tg?.initDataUnsafe?.user;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!telegramUser?.id) return;

    setLoading(true);
    try {
      const currentUser = await getCurrentUser(telegramUser.id);
      setUser(currentUser);

      if (currentUser) {
        const { data } = await getUserOrders(currentUser.id);
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return ORDER_STATUSES.findIndex((s) => s.key === status);
  };

  const getStatusInfo = (status) => {
    return ORDER_STATUSES.find((s) => s.key === status) || ORDER_STATUSES[0];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleOpenChat = (order) => {
    SoundSystem?.tap?.();
    if (onOpenChat) {
      onOpenChat(order);
    }
  };

  const handleContactDesigner = () => {
    // Открыть Telegram дизайнера
    tg?.openTelegramLink('https://t.me/RivalDesignBot');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base, #0a0a0f)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-base, #0a0a0f)',
      paddingBottom: 'var(--bottom-nav-safe-height, 80px)',
      paddingTop: 'calc(var(--safe-area-top, 20px) + 16px)',
    }}>
      {/* Header */}
      <div style={{ padding: '0 16px 24px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#fff',
          margin: 0,
          fontFamily: 'Gilroy, Inter, sans-serif',
        }}>
          Мои заказы
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          margin: '4px 0 0',
        }}>
          {orders.length} {orders.length === 1 ? 'заказ' : orders.length < 5 ? 'заказа' : 'заказов'}
        </p>
      </div>

      {/* Orders List */}
      <div style={{ padding: '0 16px' }}>
        {orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#fff',
              margin: '0 0 8px',
            }}>
              Пока нет заказов
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.4)',
              margin: 0,
            }}>
              Выберите услугу и оформите первый заказ
            </p>
          </div>
        ) : (
          orders.map((order, index) => {
            const statusInfo = getStatusInfo(order.status);
            const statusIndex = getStatusIndex(order.status);
            const progress = statusIndex >= 0 ? (statusIndex / (ORDER_STATUSES.length - 2)) * 100 : 0;
            const isCanceled = order.status === 'canceled';
            const isClosed = order.status === 'closed';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                style={{ marginBottom: '12px' }}
              >
                <GlassCard
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isCanceled ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  {/* Order Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: '4px',
                      }}>
                        {order.order_number}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#fff',
                      }}>
                        {order.service_name}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#fff',
                      fontFamily: 'monospace',
                    }}>
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: `${statusInfo.color}15`,
                    border: `1px solid ${statusInfo.color}30`,
                    marginBottom: '12px',
                  }}>
                    <span style={{ fontSize: '14px' }}>{statusInfo.icon}</span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: statusInfo.color,
                    }}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {!isCanceled && !isClosed && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        height: '4px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            background: `linear-gradient(90deg, ${statusInfo.color}, ${statusInfo.color}80)`,
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Order Date */}
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.3)',
                  }}>
                    {formatDate(order.created_at)}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedOrder?.id === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          marginTop: '16px',
                          paddingTop: '16px',
                          borderTop: '1px solid rgba(255,255,255,0.08)',
                        }}>
                          {/* Status Pipeline */}
                          {!isCanceled && (
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '12px',
                              }}>
                                Статус заказа
                              </div>
                              <div style={{
                                display: 'flex',
                                gap: '4px',
                                overflowX: 'auto',
                                paddingBottom: '8px',
                              }}>
                                {ORDER_STATUSES.filter(s => s.key !== 'canceled').map((s, i) => {
                                  const isActive = i <= statusIndex;
                                  const isCurrent = s.key === order.status;
                                  return (
                                    <div
                                      key={s.key}
                                      style={{
                                        flex: '0 0 auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px',
                                        minWidth: '48px',
                                      }}
                                    >
                                      <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: isActive ? `${s.color}25` : 'rgba(255,255,255,0.05)',
                                        border: `2px solid ${isActive ? s.color : 'rgba(255,255,255,0.1)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        transition: 'all 0.3s',
                                      }}>
                                        {isActive ? s.icon : '·'}
                                      </div>
                                      <span style={{
                                        fontSize: '9px',
                                        fontWeight: isCurrent ? '700' : '500',
                                        color: isCurrent ? s.color : 'rgba(255,255,255,0.3)',
                                        textAlign: 'center',
                                        lineHeight: '1.2',
                                      }}>
                                        {s.label.split(' ')[0]}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Brief */}
                          {order.brief && (
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'rgba(255,255,255,0.4)',
                                marginBottom: '6px',
                              }}>
                                Описание
                              </div>
                              <div style={{
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: '1.5',
                              }}>
                                {order.brief}
                              </div>
                            </div>
                          )}

                          {/* Designer Notes */}
                          {order.designer_notes && (
                            <div style={{
                              marginBottom: '16px',
                              padding: '12px',
                              background: 'rgba(139,92,246,0.1)',
                              border: '1px solid rgba(139,92,246,0.2)',
                              borderRadius: '12px',
                            }}>
                              <div style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#8b5cf6',
                                marginBottom: '6px',
                              }}>
                                💬 Сообщение от дизайнера
                              </div>
                              <div style={{
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: '1.5',
                              }}>
                                {order.designer_notes}
                              </div>
                            </div>
                          )}

                          {/* Delivery URL */}
                          {order.delivery_url && (
                            <div style={{ marginBottom: '16px' }}>
                              <a
                                href={order.delivery_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '12px',
                                  background: 'rgba(16,185,129,0.1)',
                                  border: '1px solid rgba(16,185,129,0.2)',
                                  borderRadius: '12px',
                                  color: '#10b981',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  textDecoration: 'none',
                                }}
                              >
                                📥 Скачать работу
                              </a>
                            </div>
                          )}

                          {/* Actions */}
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                          }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenChat(order);
                              }}
                              style={{
                                flex: 1,
                                padding: '12px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                              }}
                            >
                              💬 Чат с дизайнером
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContactDesigner();
                              }}
                              style={{
                                padding: '12px 16px',
                                background: 'rgba(59,130,246,0.15)',
                                border: '1px solid rgba(59,130,246,0.3)',
                                borderRadius: '12px',
                                color: '#3b82f6',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              ✉️
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;
