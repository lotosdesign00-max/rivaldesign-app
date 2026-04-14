/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BALANCE PAGE — Как в референсе Vendetta SMM
 * Баланс, пополнение через CryptoBot, история платежей
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, getBalance, getCurrentUser, createPayment, getUserPayments } from '../../core/supabase/client';
import { GlassCard } from '../../shared/components/atoms/GlassCard';
import { SoundSystem } from '../../core/audio/SoundSystem';

const BalancePage = () => {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  // Telegram WebApp
  const tg = window.Telegram?.WebApp;
  const telegramUser = tg?.initDataUnsafe?.user;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!telegramUser?.id) return;

    setLoading(true);
    try {
      // Get or create user
      const currentUser = await getCurrentUser(telegramUser.id);
      setUser(currentUser);

      // Get balance
      const bal = await getBalance(telegramUser.id);
      setBalance(bal);

      // Get payments
      if (currentUser) {
        const { data } = await getUserPayments(currentUser.id);
        setPayments(data || []);
      }
    } catch (err) {
      console.error('Load balance error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount < 1) {
      tg?.showAlert('Минимальная сумма: $1');
      return;
    }

    setCreatingInvoice(true);
    SoundSystem?.tap?.();

    try {
      // Create CryptoBot invoice via our Vite proxy
      const response = await fetch('/api/crypto-pay/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: 'USDT',
          amount: amount.toString(),
          description: `Пополнение баланса Rival Design — $${amount}`,
          paid_btn_name: 'open_bot',
          paid_btn_url: 'https://t.me/RivalDesignBot',
        }),
      });

      const result = await response.json();

      if (result.ok && result.result) {
        const invoice = result.result;

        // Save payment to Supabase
        if (user) {
          await createPayment(user.id, amount, invoice.invoice_id, invoice.bot_invoice_url);
        }

        // Open CryptoBot invoice
        if (invoice.bot_invoice_url) {
          tg?.openTelegramLink(invoice.bot_invoice_url);
        }

        setShowTopUpModal(false);
        setTopUpAmount('');

        // Refresh data after a delay
        setTimeout(() => loadData(), 3000);
      } else {
        tg?.showAlert('Ошибка создания счёта. Попробуйте позже.');
      }
    } catch (err) {
      console.error('Create invoice error:', err);
      tg?.showAlert('Ошибка подключения к CryptoBot');
    } finally {
      setCreatingInvoice(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'ОЖИДАНИЕ', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
      paid: { label: 'ОПЛАЧЕНО', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
      canceled: { label: 'ОТМЕНЕНО', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
      refunded: { label: 'ВОЗВРАТ', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    };
    return map[status] || map.pending;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

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
          Баланс
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.5)',
          margin: '4px 0 0',
        }}>
          Ваш кошелёк
        </p>
      </div>

      {/* Balance Card */}
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <GlassCard
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}>
            Текущий баланс
          </div>

          <div style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#fff',
            fontFamily: 'Gilroy, monospace',
            letterSpacing: '-1px',
          }}>
            ${balance.toFixed(2)}
          </div>

          <button
            onClick={() => {
              SoundSystem?.tap?.();
              setShowTopUpModal(true);
            }}
            style={{
              marginTop: '20px',
              padding: '14px 32px',
              background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span>
            Пополнить через CryptoBot
          </button>
        </GlassCard>
      </div>

      {/* Payment History */}
      <div style={{ padding: '0 16px' }}>
        <button
          onClick={() => {
            SoundSystem?.tap?.();
            setShowHistory(!showHistory);
          }}
          style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🕐</span>
            История платежей
          </span>
          <span style={{
            transform: showHistory ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
          }}>
            ▼
          </span>
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                marginTop: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '16px',
              }}>
                {payments.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '24px 0',
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '14px',
                  }}>
                    Нет платежей
                  </div>
                ) : (
                  payments.map((payment) => {
                    const status = getStatusBadge(payment.status);
                    return (
                      <div
                        key={payment.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 0',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#fff',
                            }}>
                              Пополнение
                            </span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: status.bg,
                              color: status.color,
                            }}>
                              {status.label}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.4)',
                          }}>
                            {formatDate(payment.created_at)}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#fff',
                          fontFamily: 'monospace',
                        }}>
                          ${parseFloat(payment.amount).toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
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
            onClick={() => setShowTopUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '360px',
                background: 'linear-gradient(135deg, rgba(30,30,40,0.98) 0%, rgba(15,15,20,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '24px',
                padding: '24px',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowTopUpModal(false)}
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
                margin: '0 0 24px',
                textAlign: 'center',
              }}>
                Пополнение баланса
              </h3>

              {/* Icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '24px',
              }}>
                💲
              </div>

              <p style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.6)',
                textAlign: 'center',
                margin: '0 0 20px',
                lineHeight: '1.5',
              }}>
                Введите сумму для пополнения через CryptoBot.
              </p>

              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
                textAlign: 'center',
              }}>
                Сумма (USDT)
              </label>

              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="100"
                min="1"
                step="1"
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              />

              <button
                onClick={handleTopUp}
                disabled={creatingInvoice || !topUpAmount}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '16px',
                  background: creatingInvoice ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.12)',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  borderRadius: '14px',
                  color: creatingInvoice ? 'rgba(255,255,255,0.3)' : '#fff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: creatingInvoice ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                {creatingInvoice ? (
                  <>
                    <span className="spinner" />
                    Создание счёта...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '18px' }}>+</span>
                    Создать счёт
                  </>
                )}
              </button>

              <p style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'center',
                margin: '16px 0 0',
              }}>
                После оплаты баланс обновится автоматически.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spinner CSS */}
      <style>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BalancePage;
