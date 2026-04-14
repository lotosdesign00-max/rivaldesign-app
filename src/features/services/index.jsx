/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICES PAGE — Услуги дизайнера
 * Каталог услуг с возможностью покупки
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getServices, getCurrentUser, getBalance, createPayment, createOrder } from '../../core/supabase/client';
import { GlassCard } from '../../shared/components/atoms/GlassCard';
import { SoundSystem } from '../../core/audio/SoundSystem';

const ServicesPage = ({ onOrderCreated }) => {
  const [services, setServices] = useState([]);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [brief, setBrief] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  const tg = window.Telegram?.WebApp;
  const telegramUser = tg?.initDataUnsafe?.user;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!telegramUser?.id) return;

    setLoading(true);
    try {
      const currentUser = await getCurrentUser(telegramUser.id);
      setUser(currentUser);

      if (currentUser) {
        const bal = await getBalance(telegramUser.id);
        setBalance(bal);

        const { data } = await getServices();
        setServices(data || []);
      }
    } catch (err) {
      console.error('Load services error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (service) => {
    SoundSystem?.tap?.();
    setSelectedService(service);
    setShowBriefModal(true);
    setBrief('');
  };

  const handlePurchase = async () => {
    if (!selectedService || !user || purchasing) return;

    setPurchasing(true);

    try {
      if (balance >= selectedService.price) {
        // Списание с баланса — создаём заказ напрямую
        const { data: order, error: orderError } = await createOrder(
          user.id,
          selectedService.id,
          selectedService.name,
          selectedService.price,
          null,
          brief
        );

        if (orderError) throw orderError;

        // Обновляем баланс
        const newBalance = balance - selectedService.price;
        await fetch('/api/supabase/update-balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, balance: newBalance }),
        });

        setBalance(newBalance);
        setShowBriefModal(false);
        setSelectedService(null);

        if (onOrderCreated) onOrderCreated(order);

        tg?.showAlert(`✅ Заказ ${order.order_number} создан!`);
      } else {
        // Недостаточно средств — создаём инвойс CryptoBot
        const amountNeeded = selectedService.price - balance;

        const response = await fetch('/api/crypto-pay/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asset: 'USDT',
            amount: amountNeeded.toFixed(2),
            description: `Оплата заказа: ${selectedService.name}`,
            paid_btn_name: 'open_bot',
            paid_btn_url: 'https://t.me/RivalDesignBot',
          }),
        });

        const result = await response.json();

        if (result.ok && result.result) {
          const invoice = result.result;

          // Создаём платёж
          await createPayment(user.id, amountNeeded, invoice.invoice_id, invoice.bot_invoice_url);

          // Создаём заказ со статусом "ожидание оплаты"
          const { data: order } = await createOrder(
            user.id,
            selectedService.id,
            selectedService.name,
            selectedService.price,
            null,
            brief
          );

          setShowBriefModal(false);
          setSelectedService(null);

          // Открываем CryptoBot
          if (invoice.bot_invoice_url) {
            tg?.openTelegramLink(invoice.bot_invoice_url);
          }

          if (onOrderCreated) onOrderCreated(order);
        } else {
          tg?.showAlert('Ошибка создания счёта');
        }
      }
    } catch (err) {
      console.error('Purchase error:', err);
      tg?.showAlert('Ошибка оформления заказа');
    } finally {
      setPurchasing(false);
    }
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
          Услуги
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          margin: '4px 0 0',
        }}>
          Выберите услугу и оформите заказ
        </p>
      </div>

      {/* Balance Bar */}
      <div style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
        }}>
          <span style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
          }}>
            Ваш баланс
          </span>
          <span style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#fff',
            fontFamily: 'monospace',
          }}>
            ${balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ padding: '0 16px' }}>
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            style={{ marginBottom: '12px' }}
          >
            <GlassCard
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#fff',
                    margin: '0 0 6px',
                  }}>
                    {service.name}
                  </h3>
                  {service.description && (
                    <p style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.5)',
                      margin: 0,
                      lineHeight: '1.4',
                    }}>
                      {service.description}
                    </p>
                  )}
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#fff',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                  marginLeft: '16px',
                }}>
                  ${parseFloat(service.price).toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => handleBuy(service)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.2))',
                  border: '1px solid rgba(59,130,246,0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.3))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.2))';
                }}
              >
                Заказать
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Brief Modal */}
      <AnimatePresence>
        {showBriefModal && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px',
            }}
            onClick={() => setShowBriefModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '400px',
                background: 'linear-gradient(135deg, rgba(30,30,40,0.98) 0%, rgba(15,15,20,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '24px',
                padding: '24px',
              }}
            >
              <button
                onClick={() => setShowBriefModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>

              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
                margin: '0 0 8px',
              }}>
                {selectedService.name}
              </h3>

              <div style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#3b82f6',
                fontFamily: 'monospace',
                marginBottom: '20px',
              }}>
                ${parseFloat(selectedService.price).toFixed(2)}
              </div>

              {balance < selectedService.price && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#f59e0b',
                    lineHeight: '1.4',
                  }}>
                    ⚠️ На балансе ${balance.toFixed(2)}. Нужно доплатить ${(selectedService.price - balance).toFixed(2)} через CryptoBot.
                  </div>
                </div>
              )}

              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}>
                Описание заказа
              </label>

              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Опишите что вам нужно..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px',
                  color: '#fff',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                }}
              />

              <button
                onClick={handlePurchase}
                disabled={purchasing}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '16px',
                  background: purchasing
                    ? 'rgba(255,255,255,0.1)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '14px',
                  color: purchasing ? 'rgba(255,255,255,0.3)' : '#fff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: purchasing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {purchasing ? (
                  <>
                    <div className="spinner" style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.2)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }} />
                    Оформление...
                  </>
                ) : (
                  balance >= selectedService.price
                    ? '✓ Оплатить с баланса'
                    : '💳 Оплатить через CryptoBot'
                )}
              </button>
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

export default ServicesPage;
