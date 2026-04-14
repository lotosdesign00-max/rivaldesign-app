/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADMIN PANEL — Панель дизайнера
 * Управление заказами, смена статусов, ответы в чате
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, getCurrentUser, getUserOrders, updateOrderStatus, getOrderMessages, sendMessage } from '../../core/supabase/client';
import { GlassCard } from '../../shared/components/atoms/GlassCard';
import { SoundSystem } from '../../core/audio/SoundSystem';

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

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [deliveryUrl, setDeliveryUrl] = useState('');
  const [designerNotes, setDesignerNotes] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // orders | payments

  const tg = window.Telegram?.WebApp;
  const telegramUser = tg?.initDataUnsafe?.user;

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin && user) {
      loadAllOrders();
    }
  }, [isAdmin, user]);

  useEffect(() => {
    if (selectedOrder?.id) {
      loadOrderMessages(selectedOrder.id);
    }
  }, [selectedOrder?.id]);

  const checkAdmin = async () => {
    if (!telegramUser?.id) return;

    const currentUser = await getCurrentUser(telegramUser.id);
    setUser(currentUser);

    if (currentUser?.is_admin) {
      setIsAdmin(true);
    } else {
      // Не админ — показываем заглушку
      setIsAdmin(false);
    }
  };

  const loadAllOrders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          users (telegram_id, username, first_name)
        `)
        .order('created_at', { ascending: false });

      setOrders(data || []);
    } catch (err) {
      console.error('Load all orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderMessages = async (orderId) => {
    const { data } = await getOrderMessages(orderId);
    setChatMessages(data || []);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    SoundSystem?.tap?.();
    await updateOrderStatus(orderId, newStatus);
    loadAllOrders();

    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }

    tg?.showAlert(`Статус изменён на: ${ORDER_STATUSES.find(s => s.key === newStatus)?.label}`);
  };

  const handleSendDesignerMessage = async () => {
    const text = newMessage.trim();
    if (!text || !user || !selectedOrder) return;

    SoundSystem?.tap?.();

    try {
      await sendMessage(selectedOrder.id, user.id, 'designer', text);
      setNewMessage('');
      loadOrderMessages(selectedOrder.id);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleSaveDelivery = async () => {
    if (!selectedOrder) return;

    try {
      await supabase
        .from('orders')
        .update({
          delivery_url: deliveryUrl,
          status: 'delivered',
          delivered_at: new Date().toISOString(),
        })
        .eq('id', selectedOrder.id);

      setSelectedOrder((prev) => ({ ...prev, delivery_url: deliveryUrl, status: 'delivered' }));
      loadAllOrders();
      tg?.showAlert('Ссылка сохранена, статус: Доставлено');
    } catch (err) {
      console.error('Save delivery error:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedOrder) return;

    try {
      await supabase
        .from('orders')
        .update({ designer_notes: designerNotes })
        .eq('id', selectedOrder.id);

      setSelectedOrder((prev) => ({ ...prev, designer_notes: designerNotes }));
      tg?.showAlert('Заметка сохранена');
    } catch (err) {
      console.error('Save notes error:', err);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base, #0a0a0f)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 8px' }}>
            Доступ запрещён
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
            Эта страница только для администратора
          </p>
        </div>
      </div>
    );
  }

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
      <div style={{ padding: '0 16px 20px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#fff',
          margin: 0,
        }}>
          ⚙️ Админ-панель
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 16px', marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {['orders', 'payments'].map((tab) => (
          <button
            key={tab}
            onClick={() => { SoundSystem?.tap?.(); setActiveTab(tab); }}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === tab ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeTab === tab ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '12px',
              color: activeTab === tab ? '#3b82f6' : 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {tab === 'orders' ? '📦 Заказы' : '💰 Платежи'}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {activeTab === 'orders' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '12px',
          }}>
            {orders.length} заказов
          </div>

          {orders.map((order) => {
            const statusInfo = ORDER_STATUSES.find(s => s.key === order.status);
            const clientName = order.users?.username || order.users?.first_name || 'Клиент';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '10px' }}
              >
                <GlassCard
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    padding: '14px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedOrder(order);
                    setDeliveryUrl(order.delivery_url || '');
                    setDesignerNotes(order.designer_notes || '');
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>
                        {order.order_number}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                        {order.service_name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                        👤 {clientName}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: statusInfo?.color,
                        marginTop: '4px',
                      }}>
                        {statusInfo?.icon} {statusInfo?.label}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              overflowY: 'auto',
              padding: '16px',
            }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '500px',
                margin: '0 auto',
                background: 'linear-gradient(135deg, rgba(30,30,40,0.98), rgba(15,15,20,0.98))',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '24px',
                padding: '20px',
              }}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>

              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 16px' }}>
                {selectedOrder.order_number}
              </h3>

              {/* Client Info */}
              <div style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  Клиент
                </div>
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>
                  👤 {selectedOrder.users?.username || selectedOrder.users?.first_name || 'Неизвестный'}
                  {selectedOrder.users?.telegram_id && (
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginLeft: '8px' }}>
                      (ID: {selectedOrder.users.telegram_id})
                    </span>
                  )}
                </div>
              </div>

              {/* Status Change */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: '600' }}>
                  Изменить статус
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ORDER_STATUSES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleStatusChange(selectedOrder.id, s.key)}
                      style={{
                        padding: '8px 12px',
                        background: selectedOrder.status === s.key ? `${s.color}25` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${selectedOrder.status === s.key ? s.color : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '8px',
                        color: selectedOrder.status === s.key ? s.color : 'rgba(255,255,255,0.5)',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery URL */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Ссылка на готовую работу
                </label>
                <input
                  value={deliveryUrl}
                  onChange={(e) => setDeliveryUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={handleSaveDelivery}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '12px',
                    background: 'rgba(16,185,129,0.2)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '10px',
                    color: '#10b981',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  💾 Сохранить и отметить как доставлено
                </button>
              </div>

              {/* Designer Notes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Заметка для клиента
                </label>
                <textarea
                  value={designerNotes}
                  onChange={(e) => setDesignerNotes(e.target.value)}
                  placeholder="Сообщение клиенту..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={handleSaveNotes}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '12px',
                    background: 'rgba(139,92,246,0.2)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '10px',
                    color: '#8b5cf6',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  💾 Сохранить заметку
                </button>
              </div>

              {/* Chat */}
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginBottom: '8px' }}>
                  💬 Чат с клиентом
                </div>
                <div style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  marginBottom: '8px',
                }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px', padding: '20px' }}>
                      Нет сообщений
                    </div>
                  ) : (
                    chatMessages.map((msg) => {
                      const isDesigner = msg.sender_role === 'designer';
                      return (
                        <div key={msg.id} style={{
                          marginBottom: '8px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: isDesigner ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isDesigner ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                          <div style={{ fontSize: '13px', color: '#fff', lineHeight: '1.4' }}>
                            {msg.text}
                          </div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendDesignerMessage()}
                    placeholder="Сообщение..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleSendDesignerMessage}
                    style={{
                      padding: '10px 16px',
                      background: 'rgba(59,130,246,0.2)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: '10px',
                      color: '#3b82f6',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
