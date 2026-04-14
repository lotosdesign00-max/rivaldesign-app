/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORDER CHAT — Мини-чат с дизайнером
 * Realtime сообщения через Supabase
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCurrentUser,
  getOrderMessages,
  sendMessage,
  subscribeToMessages,
} from '../../core/supabase/client';
import { SoundSystem } from '../../core/audio/SoundSystem';

const OrderChat = ({ order, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const tg = window.Telegram?.WebApp;
  const telegramUser = tg?.initDataUnsafe?.user;

  useEffect(() => {
    loadMessages();
    return () => {
      // Cleanup subscription
      if (window._chatSubscription) {
        window._chatSubscription.unsubscribe();
      }
    };
  }, [order?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!order?.id || !telegramUser?.id) return;

    setLoading(true);
    try {
      const currentUser = await getCurrentUser(telegramUser.id);
      setUser(currentUser);

      const { data } = await getOrderMessages(order.id);
      setMessages(data || []);

      // Subscribe to new messages in real-time
      const subscription = subscribeToMessages(order.id, (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
        SoundSystem?.notification?.();
      });
      window._chatSubscription = subscription;
    } catch (err) {
      console.error('Load messages error:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !user || sending) return;

    setSending(true);
    SoundSystem?.tap?.();

    try {
      await sendMessage(order.id, user.id, 'client', text);
      setNewMessage('');
      inputRef.current?.focus();
    } catch (err) {
      console.error('Send message error:', err);
      tg?.showAlert('Ошибка отправки сообщения');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Сегодня';
    if (d.toDateString() === yesterday.toDateString()) return 'Вчера';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const groupMessagesByDate = (msgs) => {
    const groups = [];
    let currentDate = '';

    msgs.forEach((msg) => {
      const msgDate = formatDate(msg.created_at);
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ type: 'date', date: msgDate });
      }
      groups.push({ type: 'message', data: msg });
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--color-bg-base, #0a0a0f)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <button
          onClick={() => {
            SoundSystem?.tap?.();
            onClose();
          }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#fff',
          }}>
            {order?.order_number}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
          }}>
            {order?.service_name}
          </div>
        </div>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#10b981',
        }} />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
            <div className="spinner" style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'rgba(255,255,255,0.3)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Напишите первое сообщение дизайнеру
            </p>
          </div>
        ) : (
          groupedMessages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <div
                  key={`date-${index}`}
                  style={{
                    textAlign: 'center',
                    padding: '8px 0',
                  }}
                >
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                  }}>
                    {item.date}
                  </span>
                </div>
              );
            }

            const msg = item.data;
            const isDesigner = msg.sender?.is_admin || msg.sender_role === 'designer';
            const isMine = !isDesigner;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  justifyContent: isMine ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  borderBottomRightRadius: isMine ? '4px' : '16px',
                  borderBottomLeftRadius: isMine ? '16px' : '4px',
                  background: isMine
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'rgba(255,255,255,0.08)',
                  border: isMine ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#fff',
                    lineHeight: '1.4',
                    wordBreak: 'break-word',
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: isMine ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                    marginTop: '4px',
                    textAlign: 'right',
                  }}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение..."
          rows={1}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '14px',
            resize: 'none',
            outline: 'none',
            maxHeight: '100px',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.3)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.12)';
          }}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: newMessage.trim() && !sending
              ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
              : 'rgba(255,255,255,0.08)',
            border: 'none',
            color: newMessage.trim() && !sending ? '#fff' : 'rgba(255,255,255,0.3)',
            fontSize: '18px',
            cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          {sending ? (
            <div className="spinner" style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(255,255,255,0.2)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }} />
          ) : (
            '➤'
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        textarea::-webkit-scrollbar {
          width: 0;
        }
      `}</style>
    </div>
  );
};

export default OrderChat;
