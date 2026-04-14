import React, { useState, useEffect, useMemo, useCallback } from 'react'
import * as adminApi from '../src/core/supabase/adminApi'
import { 
  getDefaultFormData, 
  getContentConfig, 
  getModalTitle, 
  renderForm,
  labelStyle,
  inputStyle,
  textareaStyle,
} from './helpers'

// ==========================================
// TELEGRAM WEBAPP INTEGRATION
// ==========================================
const tg = window.Telegram?.WebApp
const isTelegram = !!tg?.initDataUnsafe?.user
const telegramUser = tg?.initDataUnsafe?.user

// ==========================================
// UI/UX DESIGN SYSTEM (Dark Glassmorphism Admin)
// Следуем UI/UX Pro Max: Accessibility, Touch targets, Performance, Style
// ==========================================
const theme = {
  // Цвета - Dark mode с glassmorphism
  bg: '#05070b',
  bgGradient: 'radial-gradient(circle at top left, rgba(96,104,255,.18), transparent 24%), radial-gradient(circle at top right, rgba(56,189,248,.12), transparent 22%), linear-gradient(180deg, #05070b 0%, #090b12 100%)',
  cardBg: 'linear-gradient(180deg, rgba(17,19,28,.92) 0%, rgba(10,12,18,.96) 100%)',
  cardBorder: '1px solid rgba(255,255,255,.08)',
  cardShadow: '0 18px 56px rgba(0,0,0,.36), inset 0 1px 0 rgba(255,255,255,.04)',
  
  // Текст
  text: 'rgba(244,244,245,.96)',
  textSecondary: 'rgba(161,161,170,.82)',
  textMuted: 'rgba(161,161,170,.6)',
  
  // Акценты
  primary: '#6366f1',
  primaryGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  primaryGradientBg: 'linear-gradient(135deg, rgba(99,102,241,.22), rgba(56,189,248,.16))',
  success: '#10b981',
  successGradient: 'linear-gradient(135deg, rgba(16,185,129,.22), rgba(5,150,105,.18))',
  danger: '#ef4444',
  dangerBg: 'rgba(248,113,113,.08)',
  dangerBorder: '1px solid rgba(248,113,113,.18)',
  warning: '#f59e0b',
  
  // Размеры - UI/UX Pro Max: Touch targets >= 44px
  buttonHeight: 48,
  inputHeight: 48,
  borderRadius: 16,
  cardRadius: 28,
  
  // Spacing - 8dp grid
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 18, xxl: 24, xxxl: 32 },
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function Card({ children, style, ...props }) {
  return (
    <div
      style={{
        border: theme.cardBorder,
        background: theme.cardBg,
        borderRadius: theme.cardRadius,
        boxShadow: theme.cardShadow,
        backdropFilter: 'blur(18px)',
        padding: theme.spacing.xl,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function Button({ children, variant = 'primary', style, disabled, loading, onClick, ...props }) {
  const variants = {
    primary: {
      background: theme.primaryGradient,
      color: '#fff',
      border: '1px solid rgba(255,255,255,.08)',
    },
    secondary: {
      background: 'rgba(255,255,255,.05)',
      color: '#fff',
      border: theme.cardBorder,
    },
    success: {
      background: theme.successGradient,
      color: '#ecfdf5',
      border: '1px solid rgba(16,185,129,.22)',
    },
    danger: {
      background: theme.dangerBg,
      color: '#fecaca',
      border: theme.dangerBorder,
    },
  }

  const [pressed, setPressed] = useState(false)

  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        height: theme.buttonHeight,
        padding: `0 ${theme.spacing.lg}px`,
        borderRadius: theme.borderRadius,
        fontWeight: 800,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : pressed ? 0.9 : 1,
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.15s ease-out',
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {loading ? '⏳ Загрузка...' : children}
    </button>
  )
}

function Input({ label, error, style, ...props }) {
  const [focused, setFocused] = useState(false)
  
  return (
    <div style={{ display: 'grid', gap: theme.spacing.sm }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: theme.textSecondary }}>
          {label}
        </label>
      )}
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: theme.inputHeight,
          borderRadius: theme.borderRadius,
          border: `1px solid ${error ? 'rgba(239,68,68,.4)' : focused ? 'rgba(99,102,241,.4)' : 'rgba(255,255,255,.08)'}`,
          background: 'rgba(255,255,255,.04)',
          color: theme.text,
          padding: `0 ${theme.spacing.lg}px`,
          fontSize: 15,
          outline: 'none',
          transition: 'border-color 0.15s ease-out',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: theme.danger }}>{error}</span>}
    </div>
  )
}

function TextArea({ label, error, style, ...props }) {
  const [focused, setFocused] = useState(false)
  
  return (
    <div style={{ display: 'grid', gap: theme.spacing.sm }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: theme.textSecondary }}>
          {label}
        </label>
      )}
      <textarea
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          borderRadius: theme.borderRadius,
          border: `1px solid ${error ? 'rgba(239,68,68,.4)' : focused ? 'rgba(99,102,241,.4)' : 'rgba(255,255,255,.08)'}`,
          background: 'rgba(255,255,255,.04)',
          color: theme.text,
          padding: theme.spacing.lg,
          fontSize: 15,
          outline: 'none',
          resize: 'vertical',
          minHeight: 120,
          lineHeight: 1.6,
          transition: 'border-color 0.15s ease-out',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: theme.danger }}>{error}</span>}
    </div>
  )
}

function Select({ label, options, style, ...props }) {
  return (
    <div style={{ display: 'grid', gap: theme.spacing.sm }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: theme.textSecondary }}>
          {label}
        </label>
      )}
      <select
        style={{
          height: theme.inputHeight,
          borderRadius: theme.borderRadius,
          border: '1px solid rgba(255,255,255,.08)',
          background: 'rgba(255,255,255,.04)',
          color: theme.text,
          padding: `0 ${theme.spacing.lg}px`,
          fontSize: 15,
          outline: 'none',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  )
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: { bg: 'rgba(16,185,129,.15)', border: 'rgba(16,185,129,.3)', text: '#ecfdf5' },
    error: { bg: 'rgba(239,68,68,.15)', border: 'rgba(239,68,68,.3)', text: '#fecaca' },
    info: { bg: 'rgba(56,189,248,.15)', border: 'rgba(56,189,248,.3)', text: '#e0f2fe' },
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        padding: '14px 20px',
        borderRadius: theme.borderRadius,
        background: colors[type].bg,
        border: `1px solid ${colors[type].border}`,
        color: colors[type].text,
        fontWeight: 700,
        animation: 'slideIn 0.3s ease-out',
        backdropFilter: 'blur(18px)',
      }}
    >
      {type === 'success' ? '✅ ' : type === 'error' ? '❌ ' : 'ℹ️ '}{message}
    </div>
  )
}

function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'grid',
        placeItems: 'center',
        padding: theme.spacing.xl,
        background: 'rgba(0,0,0,.6)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(600px, 100%)',
          maxHeight: '90vh',
          overflow: 'auto',
          ...theme.cardBg,
          border: theme.cardBorder,
          borderRadius: theme.cardRadius,
          boxShadow: theme.cardShadow,
          padding: theme.spacing.xxl,
          animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl }}>
          <h2 style={{ fontSize: 24, fontWeight: 900 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: theme.cardBorder,
              background: 'rgba(255,255,255,.05)',
              color: theme.text,
              cursor: 'pointer',
              fontSize: 20,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ==========================================
// NAVIGATION
// ==========================================
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Обзор', icon: '📊' },
  { id: 'inbox', label: 'Входящие', icon: '📝' },
  { id: 'payments', label: 'Платежи', icon: '💰' },
  { id: 'clients', label: 'Клиенты', icon: '👥' },
  { id: 'portfolio', label: 'Портфолио', icon: '📦' },
  { id: 'courses', label: 'Курсы', icon: '📚' },
  { id: 'services', label: 'Услуги', icon: '💼' },
  { id: 'reviews', label: 'Отзывы', icon: '⭐' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
  { id: 'home', label: 'Главная', icon: '🏠' },
  { id: 'socials', label: 'Соцсети', icon: '🌐' },
]

// ==========================================
// MAIN ADMIN APP
// ==========================================
export default function AdminApp() {
  const [section, setSection] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  
  // Data
  const [stats, setStats] = useState({})
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState([])
  const [users, setUsers] = useState([])
  const [content, setContent] = useState({
    gallery: [],
    courses: [],
    services: [],
    reviews: [],
    faq: [],
    home_stats: [],
    home_socials: [],
  })
  
  // UI State
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const [statsData, ordersData, paymentsData, usersData, 
             galleryData, coursesData, servicesData, reviewsData, faqData, statsListData, socialsData] = 
        await Promise.all([
          adminApi.dashboardStats().catch(() => ({})),
          adminApi.ordersList().catch(() => []),
          adminApi.paymentsList().catch(() => []),
          adminApi.usersList().catch(() => []),
          adminApi.galleryList().catch(() => []),
          adminApi.coursesList().catch(() => []),
          adminApi.servicesList().catch(() => []),
          adminApi.reviewsList().catch(() => []),
          adminApi.faqList().catch(() => []),
          adminApi.homeStatsList().catch(() => []),
          adminApi.homeSocialsList().catch(() => []),
        ])
      
      setStats(statsData)
      setOrders(ordersData)
      setPayments(paymentsData)
      setUsers(usersData)
      setContent({
        gallery: galleryData,
        courses: coursesData,
        services: servicesData,
        reviews: reviewsData,
        faq: faqData,
        home_stats: statsListData,
        home_socials: socialsData,
      })
      setSelectedOrderId(ordersData[0]?.id || null)
    } catch (err) {
      setError(err.message || 'Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Open modal for adding/editing
  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    setFormData(item || getDefaultFormData(type))
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
    setFormData({})
  }

  // Save content
  const handleSave = async () => {
    try {
      const apiMap = {
        portfolio: { add: adminApi.galleryAdd, update: adminApi.galleryUpdate, delete: adminApi.galleryDelete },
        courses: { add: adminApi.coursesAdd, update: adminApi.coursesUpdate, delete: adminApi.coursesDelete },
        services: { add: adminApi.servicesAdd, update: adminApi.servicesUpdate, delete: adminApi.servicesDelete },
        reviews: { add: adminApi.reviewsAdd, update: adminApi.reviewsUpdate, delete: adminApi.reviewsDelete },
        faq: { add: adminApi.faqAdd, update: adminApi.faqUpdate, delete: adminApi.faqDelete },
        home_stats: { add: adminApi.homeStatsAdd, update: adminApi.homeStatsUpdate, delete: adminApi.homeStatsDelete },
        home_socials: { add: adminApi.homeSocialsAdd, update: adminApi.homeSocialsUpdate, delete: adminApi.homeSocialsDelete },
      }

      const api = apiMap[modalType]
      if (!api) throw new Error('Unknown modal type')

      if (editingItem) {
        await api.update(editingItem.id, formData)
        showToast('Обновлено!')
      } else {
        await api.add(formData)
        showToast('Добавлено!')
      }

      closeModal()
      await loadData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // Delete item
  const handleDelete = async (type, id) => {
    if (!confirm('Удалить? Это действие нельзя отменить.')) return

    try {
      const apiMap = {
        portfolio: adminApi.galleryDelete,
        courses: adminApi.coursesDelete,
        services: adminApi.servicesDelete,
        reviews: adminApi.reviewsDelete,
        faq: adminApi.faqDelete,
        home_stats: adminApi.homeStatsDelete,
        home_socials: adminApi.homeSocialsDelete,
      }

      await apiMap[type](id)
      showToast('Удалено!')
      await loadData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // Render content section
  const renderContentSection = () => {
    const config = getContentConfig(section)
    if (!config) return null

    const items = content[config.dataKey] || []

    return (
      <div style={{ display: 'grid', gap: theme.spacing.xl }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: theme.spacing.md }}>
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.05em' }}>{config.title}</h2>
            <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6 }}>{items.length} записей</p>
          </div>
          <Button onClick={() => openModal(section)}>➕ Добавить</Button>
        </div>

        {/* Items list */}
        <div style={{ display: 'grid', gap: theme.spacing.md }}>
          {items.map((item, index) => (
            <Card key={item.id || index} style={{ padding: theme.spacing.lg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.lg }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{config.getLabel(item)}</div>
                  <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>{config.getMeta(item)}</div>
                </div>
                <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                  <Button variant="secondary" style={{ height: 40, padding: '0 14px' }} onClick={() => openModal(section, item)}>
                    ✏️
                  </Button>
                  <Button variant="danger" style={{ height: 40, padding: '0 14px' }} onClick={() => handleDelete(section, item.id)}>
                    🗑
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {items.length === 0 && (
          <Card style={{ padding: theme.spacing.xxl, textAlign: 'center', color: theme.textSecondary }}>
            <div style={{ fontSize: 48, marginBottom: theme.spacing.md }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Пока пусто</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>Нажмите "Добавить" чтобы создать первую запись</div>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: theme.bgGradient, color: theme.text }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        * { -webkit-tap-highlight-color: transparent; }
        input, textarea, select, button { font-family: inherit; }
        button:active { transform: scale(0.98) !important; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,.06)',
        padding: `${theme.spacing.xl}px ${theme.spacing.xl}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.lg,
        flexWrap: 'wrap',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5,7,11,.8)',
        backdropFilter: 'blur(18px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.04))',
            border: theme.cardBorder,
            fontSize: 24,
          }}>
            🎨
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-.04em' }}>Rival Admin</div>
            <div style={{ fontSize: 12, color: theme.textSecondary }}>
              {isTelegram ? `@${telegramUser?.username || 'Admin'}` : 'Веб-версия'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button variant="secondary" onClick={loadData} style={{ height: 40, padding: '0 14px' }}>
            🔄 Обновить
          </Button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: theme.spacing.xl, padding: theme.spacing.xl, maxWidth: 1600, margin: '0 auto' }}>
        {/* Sidebar - UI/UX Pro Max: Sidebar for desktop, bottom nav for mobile */}
        <aside style={{
          width: 260,
          flexShrink: 0,
          position: 'sticky',
          top: 100,
          height: 'calc(100vh - 120px)',
          overflow: 'auto',
        }}>
          <Card style={{ padding: theme.spacing.md }}>
            <nav style={{ display: 'grid', gap: theme.spacing.xs }}>
              {NAV_ITEMS.map(item => {
                const active = section === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.md,
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: theme.borderRadius,
                      border: `1px solid ${active ? 'rgba(99,102,241,.36)' : 'rgba(255,255,255,.06)'}`,
                      background: active ? theme.primaryGradientBg : 'rgba(255,255,255,.03)',
                      color: theme.text,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 14,
                      fontWeight: active ? 800 : 600,
                      transition: 'all 0.15s ease-out',
                    }}
                  >
                    <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </Card>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <Card style={{ padding: theme.spacing.xxxl, textAlign: 'center', color: theme.textSecondary }}>
              <div style={{ fontSize: 48, marginBottom: theme.spacing.md, animation: 'pulse 2s ease-in-out infinite' }}>⏳</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Загрузка...</div>
            </Card>
          ) : error ? (
            <Card style={{ padding: theme.spacing.xl, borderColor: 'rgba(239,68,68,.3)', color: theme.danger }}>
              ❌ {error}
            </Card>
          ) : (
            <>
              {/* Dashboard */}
              {section === 'dashboard' && <Dashboard stats={stats} orders={orders} payments={payments} />}
              
              {/* Inbox */}
              {section === 'inbox' && (
                <Inbox 
                  orders={orders}
                  payments={payments}
                  selectedOrderId={selectedOrderId}
                  setSelectedOrderId={setSelectedOrderId}
                  showToast={showToast}
                  loadData={loadData}
                />
              )}
              
              {/* Payments */}
              {section === 'payments' && (
                <PaymentsList 
                  payments={payments}
                  showToast={showToast}
                  loadData={loadData}
                />
              )}
              
              {/* Clients */}
              {section === 'clients' && (
                <ClientsList 
                  users={users}
                  showToast={showToast}
                  loadData={loadData}
                />
              )}
              
              {/* Content sections */}
              {['portfolio', 'courses', 'services', 'reviews', 'faq', 'home_stats', 'home_socials'].includes(section) && renderContentSection()}
            </>
          )}
        </main>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} title={getModalTitle(modalType, editingItem)} onClose={closeModal}>
        <div style={{ display: 'grid', gap: theme.spacing.lg }}>
          {renderForm(modalType, formData, setFormData)}
          <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
            <Button onClick={handleSave} style={{ flex: 1 }}>
              {editingItem ? '💾 Сохранить' : '➕ Добавить'}
            </Button>
            <Button variant="secondary" onClick={closeModal}>Отмена</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ==========================================
// DASHBOARD COMPONENT
// ==========================================
function Dashboard({ stats, orders, payments }) {
  const latestOrders = (orders || []).slice(0, 5)
  const latestPayments = (payments || []).slice(0, 5)

  return (
    <div style={{ display: 'grid', gap: theme.spacing.xl }}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.lg }}>
        <StatCard icon="📦" label="Активные заказы" value={stats.activeOrders || 0} sub="живые проекты" />
        <StatCard icon="💰" label="Доход" value={`$${stats.revenue || 0}`} sub="оплаченные платежи" />
        <StatCard icon="💬" label="Запросы" value={stats.inbox || 0} sub="реквизиты и диалоги" />
        <StatCard icon="👥" label="Клиенты" value={stats.users || 0} sub="в базе" />
      </div>

      {/* Recent Orders & Payments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: theme.spacing.xl }}>
        <Card>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: theme.spacing.lg }}>Свежие заказы</h3>
          <div style={{ display: 'grid', gap: theme.spacing.md }}>
            {latestOrders.map(order => (
              <div key={order.id} style={{
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius,
                border: '1px solid rgba(255,255,255,.06)',
                background: 'rgba(255,255,255,.03)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing.md }}>
                  <div>
                    <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}>{order.order_number}</div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{order.service_name}</div>
                    <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                      {order.users?.username || order.users?.first_name || 'Клиент'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900 }}>${Number(order.total_amount || 0).toFixed(2)}</div>
                    <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>{order.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: theme.spacing.lg }}>Платежный поток</h3>
          <div style={{ display: 'grid', gap: theme.spacing.md }}>
            {latestPayments.map(payment => (
              <div key={payment.id} style={{
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius,
                border: '1px solid rgba(255,255,255,.06)',
                background: 'rgba(255,255,255,.03)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing.md }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>
                      {payment.users?.username || payment.users?.first_name || 'Клиент'}
                    </div>
                    <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>{payment.payment_method}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900 }}>${Number(payment.amount || 0).toFixed(2)}</div>
                    <div style={{ fontSize: 12, color: payment.status === 'paid' ? theme.success : theme.warning, marginTop: 4 }}>
                      {payment.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub }) {
  return (
    <Card style={{ padding: theme.spacing.lg }}>
      <div style={{ width: 46, height: 46, borderRadius: 16, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,.22), rgba(56,189,248,.18))', marginBottom: theme.spacing.md, fontSize: 22 }}>
        {icon}
      </div>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', color: theme.textSecondary, marginBottom: theme.spacing.sm }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: '-.04em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 6 }}>{sub}</div>}
    </Card>
  )
}

// ==========================================
// INBOX COMPONENT
// ==========================================
function Inbox({ orders, payments, selectedOrderId, setSelectedOrderId, showToast, loadData }) {
  const [draftStatus, setDraftStatus] = useState('')
  const [draftNotes, setDraftNotes] = useState('')
  const [draftDelivery, setDraftDelivery] = useState('')
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState([])

  const selectedOrder = (orders || []).find(o => o.id === selectedOrderId)
  const paymentsById = useMemo(() => Object.fromEntries((payments || []).map(p => [p.id, p])), [payments])

  const STATUS_OPTIONS = [
    ['waiting_payment', 'Ожидает оплату'],
    ['payment_review', 'Проверка оплаты'],
    ['queued', 'В очереди'],
    ['in_progress', 'В работе'],
    ['preview_sent', 'Превью отправлено'],
    ['revision', 'Правки'],
    ['delivered', 'Готово'],
    ['closed', 'Закрыт'],
    ['canceled', 'Отменен'],
  ]

  useEffect(() => {
    if (selectedOrder) {
      setDraftStatus(selectedOrder.status || 'waiting_payment')
      setDraftNotes(selectedOrder.designer_notes || '')
      setDraftDelivery(selectedOrder.delivery_url || '')
      
      // Load messages
      adminApi.messagesByOrder(selectedOrder.id)
        .then(msgs => setMessages(msgs || []))
        .catch(() => setMessages([]))
    }
  }, [selectedOrder])

  const handleSaveOrder = async () => {
    try {
      await adminApi.ordersUpdate(selectedOrderId, {
        status: draftStatus,
        designerNotes: draftNotes,
        deliveryUrl: draftDelivery,
      })
      showToast('Заказ обновлён!')
      await loadData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    try {
      await adminApi.messageSend(selectedOrderId, messageText)
      setMessageText('')
      // Reload messages
      const msgs = await adminApi.messagesByOrder(selectedOrderId)
      setMessages(msgs || [])
      showToast('Сообщение отправлено!')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: theme.spacing.xl }}>
      {/* Orders list */}
      <Card style={{ padding: theme.spacing.md, maxHeight: 'calc(100vh - 140px)', overflow: 'auto' }}>
        <div style={{ display: 'grid', gap: theme.spacing.sm }}>
          {(orders || []).map(order => {
            const payment = order.payment_id ? paymentsById[order.payment_id] : null
            const active = selectedOrderId === order.id
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                style={{
                  textAlign: 'left',
                  padding: theme.spacing.lg,
                  borderRadius: theme.borderRadius,
                  border: `1px solid ${active ? 'rgba(99,102,241,.32)' : 'rgba(255,255,255,.06)'}`,
                  background: active ? 'linear-gradient(135deg, rgba(99,102,241,.14), rgba(56,189,248,.08))' : 'rgba(255,255,255,.03)',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing.md }}>
                  <div>
                    <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}>{order.order_number}</div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{order.service_name}</div>
                    <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 6 }}>
                      {order.users?.username || order.users?.first_name || 'Клиент'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900 }}>${Number(order.total_amount || 0).toFixed(2)}</div>
                    <div style={{ fontSize: 12, color: payment?.status === 'paid' ? theme.success : theme.textSecondary, marginTop: 6 }}>
                      {payment?.status || order.status}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Order details */}
      <div style={{ display: 'grid', gap: theme.spacing.lg }}>
        {selectedOrder ? (
          <>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                <div>
                  <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 6 }}>{selectedOrder.order_number}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-.04em' }}>{selectedOrder.service_name}</div>
                  <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 8 }}>
                    {selectedOrder.users?.username || selectedOrder.users?.first_name || 'Клиент'} · ${Number(selectedOrder.total_amount || 0).toFixed(2)}
                  </div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.05)', fontSize: 12 }}>
                  {selectedOrder.status}
                </div>
              </div>

              {/* Brief */}
              <Card style={{ marginBottom: theme.spacing.lg, background: 'rgba(255,255,255,.03)' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', color: theme.textSecondary, marginBottom: theme.spacing.sm }}>Бриф</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{selectedOrder.brief || '—'}</div>
              </Card>

              {/* Status & Delivery */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                <div>
                  <label style={labelStyle}>Статус</label>
                  <select value={draftStatus} onChange={e => setDraftStatus(e.target.value)} style={inputStyle}>
                    {STATUS_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Ссылка на выдачу</label>
                  <input value={draftDelivery} onChange={e => setDraftDelivery(e.target.value)} placeholder="https://..." style={inputStyle} />
                </div>
              </div>

              {/* Notes */}
              <label style={labelStyle}>Заметка для клиента</label>
              <textarea value={draftNotes} onChange={e => setDraftNotes(e.target.value)} rows={4} style={textareaStyle} />

              <div style={{ marginTop: theme.spacing.lg }}>
                <Button onClick={handleSaveOrder} style={{ width: '100%' }}>💾 Сохранить</Button>
              </div>
            </Card>

            {/* Chat */}
            <Card>
              <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: theme.spacing.lg }}>Чат заказа</h3>
              <div style={{ display: 'grid', gap: theme.spacing.md, maxHeight: 320, overflow: 'auto', paddingRight: 4, marginBottom: theme.spacing.lg }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius,
                    background: msg.sender_role === 'designer' ? 'rgba(99,102,241,.14)' : 'rgba(255,255,255,.04)',
                    border: `1px solid ${msg.sender_role === 'designer' ? 'rgba(99,102,241,.24)' : 'rgba(255,255,255,.06)'}`,
                  }}>
                    <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 6 }}>
                      {msg.sender_role === 'designer' ? 'Ты' : 'Клиент'} · {new Date(msg.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ lineHeight: 1.6 }}>{msg.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: theme.spacing.md }}>
                <textarea value={messageText} onChange={e => setMessageText(e.target.value)} rows={3} placeholder="Ответ клиенту..." style={textareaStyle} />
                <Button onClick={handleSendMessage} style={{ alignSelf: 'end' }}>📤 Отправить</Button>
              </div>
            </Card>
          </>
        ) : (
          <Card style={{ padding: theme.spacing.xxxl, textAlign: 'center', color: theme.textSecondary }}>
            <div style={{ fontSize: 48, marginBottom: theme.spacing.md }}>📝</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Выберите заказ</div>
          </Card>
        )}
      </div>
    </div>
  )
}

// ==========================================
// PAYMENTS LIST COMPONENT
// ==========================================
function PaymentsList({ payments, showToast, loadData }) {
  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const handleUpdate = async (paymentId, status) => {
    try {
      await adminApi.paymentsUpdate(paymentId, { status })
      showToast('Платёж обновлён!')
      await loadData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <Card style={{ padding: theme.spacing.lg }}>
      <div style={{ display: 'grid', gap: theme.spacing.md }}>
        {(payments || []).map(payment => (
          <div key={payment.id} style={{
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius,
            border: '1px solid rgba(255,255,255,.06)',
            background: 'rgba(255,255,255,.03)',
            display: 'grid',
            gridTemplateColumns: '1.1fr .8fr .7fr auto',
            alignItems: 'center',
            gap: theme.spacing.lg,
          }}>
            <div>
              <div style={{ fontWeight: 800 }}>
                {payment.users?.username || payment.users?.first_name || 'Клиент'}
              </div>
              <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                {payment.payment_method} · {formatDate(payment.created_at)}
              </div>
            </div>
            <div style={{ fontWeight: 900 }}>${Number(payment.amount || 0).toFixed(2)}</div>
            <select
              value={payment.status}
              onChange={e => handleUpdate(payment.id, e.target.value)}
              style={{
                height: 42,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,.08)',
                background: 'rgba(255,255,255,.04)',
                color: '#fff',
                padding: '0 12px',
              }}
            >
              <option value="pending">Ожидает</option>
              <option value="paid">Оплачен</option>
              <option value="canceled">Отменен</option>
              <option value="refunded">Возврат</option>
            </select>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ==========================================
// CLIENTS LIST COMPONENT
// ==========================================
function ClientsList({ users, showToast, loadData }) {
  const [drafts, setDrafts] = useState({})

  const handleUpdateBalance = async (userId, balance) => {
    try {
      await adminApi.usersUpdateBalance(userId, balance)
      showToast('Баланс обновлён!')
      await loadData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <Card style={{ padding: theme.spacing.lg }}>
      <div style={{ display: 'grid', gap: theme.spacing.md }}>
        {(users || []).map(user => (
          <div key={user.id} style={{
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius,
            border: '1px solid rgba(255,255,255,.06)',
            background: 'rgba(255,255,255,.03)',
            display: 'grid',
            gridTemplateColumns: '1fr 220px auto',
            gap: theme.spacing.lg,
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontWeight: 800 }}>
                {user.username || user.first_name || `ID ${user.telegram_id}`}
              </div>
              <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                telegram_id: {user.telegram_id}
              </div>
            </div>
            <input
              value={drafts[user.id] ?? Number(user.balance || 0)}
              onChange={e => setDrafts(prev => ({ ...prev, [user.id]: e.target.value }))}
              style={{
                height: 44,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,.08)',
                background: 'rgba(255,255,255,.04)',
                color: '#fff',
                padding: '0 12px',
                boxSizing: 'border-box',
              }}
            />
            <Button onClick={() => handleUpdateBalance(user.id, drafts[user.id] ?? user.balance)} style={{ height: 44 }}>
              💾 Сохранить
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
