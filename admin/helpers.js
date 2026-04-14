// ==========================================
// ADMIN HELPER FUNCTIONS AND CONFIGS
// ==========================================

export function getDefaultFormData(type) {
  const defaults = {
    portfolio: {
      id: `g_${Date.now()}`,
      cat: 'Превью',
      title: 'Новая работа',
      description: 'Описание работы',
      img: '/images/new-work.jpg',
      tags: ['new'],
      popular: false,
      views: 0,
    },
    courses: {
      id: `c_${Date.now()}`,
      cat: 'Новый',
      title: 'Новый курс',
      description: 'Описание курса',
      level: 'Средний',
      duration: '3 ч',
      lessons: 6,
      img: '/images/course.jpg',
      popular: false,
      free: false,
      price: 10,
      rating: 5,
      students: 0,
      topics: ['Тема 1', 'Тема 2'],
    },
    services: {
      id: Date.now(),
      icon: '✦',
      key: `service_${Date.now()}`,
      price_usd: 10,
      ru: 'Новая услуга',
      en: 'New service',
      ua: 'Нова послуга',
      kz: 'Жаңа қызмет',
      by: 'Новая паслуга',
      desc_ru: 'Описание услуги',
      desc_en: 'Service description',
      time_ru: '1–2 дня',
      time_en: '1–2 days',
      features: ['Опция 1', 'Опция 2'],
    },
    reviews: {
      id: `r_${Date.now()}`,
      name: 'Новый клиент',
      tg: 'username',
      rating: 5,
      text: 'Текст отзыва',
      time: 'сегодня',
      verified: true,
    },
    faq: {
      q: 'Новый вопрос?',
      a: 'Новый ответ.',
    },
    home_stats: {
      value: '0',
      label_ru: 'Новый пункт',
      label_en: 'New stat',
    },
    home_socials: {
      kind: 'telegram',
      label: 'Telegram',
      url: 'https://t.me/username',
      accent: '#229ED9',
    },
  }
  return defaults[type] || {}
}

export function getContentConfig(section) {
  const configs = {
    portfolio: {
      title: '📦 Портфолио',
      dataKey: 'gallery',
      getLabel: (item) => item?.title || 'Без названия',
      getMeta: (item) => `${item?.cat || 'Без категории'} · 👁 ${item?.views || 0}`,
    },
    courses: {
      title: '📚 Курсы',
      dataKey: 'courses',
      getLabel: (item) => item?.title || 'Без названия',
      getMeta: (item) => `$${item?.price || 0} · ${item?.lessons || 0} уроков`,
    },
    services: {
      title: '💼 Услуги',
      dataKey: 'services',
      getLabel: (item) => item?.ru || item?.en || 'Без названия',
      getMeta: (item) => `$${item?.price_usd || 0}`,
    },
    reviews: {
      title: '⭐ Отзывы',
      dataKey: 'reviews',
      getLabel: (item) => item?.name || 'Аноним',
      getMeta: (item) => `${'⭐'.repeat(item?.rating || 0)} ${item?.time || ''}`,
    },
    faq: {
      title: '❓ FAQ',
      dataKey: 'faq',
      getLabel: (item) => item?.q || 'Вопрос',
      getMeta: (item) => item?.a?.slice(0, 50) + '...',
    },
    home_stats: {
      title: '🏠 Статистика',
      dataKey: 'home_stats',
      getLabel: (item) => item?.label_ru || 'Статистика',
      getMeta: (item) => item?.value || '0',
    },
    home_socials: {
      title: '🌐 Соцсети',
      dataKey: 'home_socials',
      getLabel: (item) => item?.label || item?.kind || 'Соцсеть',
      getMeta: (item) => item?.url || '',
    },
  }
  return configs[section]
}

export function getModalTitle(type, editingItem) {
  const titles = {
    portfolio: editingItem ? '✏️ Редактировать работу' : '➕ Новая работа',
    courses: editingItem ? '✏️ Редактировать курс' : '➕ Новый курс',
    services: editingItem ? '✏️ Редактировать услугу' : '➕ Новая услуга',
    reviews: editingItem ? '✏️ Редактировать отзыв' : '➕ Новый отзыв',
    faq: editingItem ? '✏️ Редактировать FAQ' : '➕ Новый вопрос',
    home_stats: editingItem ? '✏️ Редактировать статистику' : '➕ Новая статистика',
    home_socials: editingItem ? '✏️ Редактировать соцсеть' : '➕ Новая соцсеть',
  }
  return titles[type] || 'Редактирование'
}

export function renderForm(type, formData, setFormData) {
  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Array editor helper
  const ArrayEditor = ({ value = [], onChange, placeholder }) => {
    const items = Array.isArray(value) ? value : []
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <input
              value={item}
              onChange={e => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
              placeholder={placeholder}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,.08)',
                background: 'rgba(255,255,255,.04)',
                color: '#f4f4f5',
                padding: '0 12px',
                fontSize: 14,
              }}
            />
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: '1px solid rgba(248,113,113,.18)',
                background: 'rgba(248,113,113,.08)',
                color: '#fecaca',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...items, ''])}
          style={{
            height: 40,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,.08)',
            background: 'rgba(255,255,255,.05)',
            color: '#f4f4f5',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          + Добавить элемент
        </button>
      </div>
    )
  }

  // FORMS BY TYPE
  if (type === 'portfolio') {
    return (
      <>
        <label style={labelStyle}>Название</label>
        <input value={formData.title || ''} onChange={e => update('title', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Категория</label>
        <select value={formData.cat || ''} onChange={e => update('cat', e.target.value)} style={inputStyle}>
          <option value="Превью">Превью</option>
          <option value="Лого">Лого</option>
          <option value="Постеры">Постеры</option>
          <option value="Баннеры">Баннеры</option>
          <option value="Аватарки">Аватарки</option>
        </select>
        
        <label style={labelStyle}>Описание</label>
        <textarea value={formData.description || ''} onChange={e => update('description', e.target.value)} style={textareaStyle} />
        
        <label style={labelStyle}>URL картинки</label>
        <input value={formData.img || ''} onChange={e => update('img', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Теги</label>
        <ArrayEditor value={formData.tags || []} onChange={v => update('tags', v)} placeholder="Тег" />
        
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={formData.popular || false} onChange={e => update('popular', e.target.checked)} />
          Популярное
        </label>
      </>
    )
  }

  if (type === 'courses') {
    return (
      <>
        <label style={labelStyle}>Название</label>
        <input value={formData.title || ''} onChange={e => update('title', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Категория</label>
        <input value={formData.cat || ''} onChange={e => update('cat', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Описание</label>
        <textarea value={formData.description || ''} onChange={e => update('description', e.target.value)} style={textareaStyle} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Уровень</label>
            <select value={formData.level || ''} onChange={e => update('level', e.target.value)} style={inputStyle}>
              <option value="Новичок">Новичок</option>
              <option value="Средний">Средний</option>
              <option value="Продвинутый">Продвинутый</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Длительность</label>
            <input value={formData.duration || ''} onChange={e => update('duration', e.target.value)} style={inputStyle} placeholder="3 ч" />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Уроков</label>
            <input type="number" value={formData.lessons || 0} onChange={e => update('lessons', Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Цена ($)</label>
            <input type="number" value={formData.price || 0} onChange={e => update('price', Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Рейтинг</label>
            <input type="number" step="0.1" max="5" value={formData.rating || 5} onChange={e => update('rating', Number(e.target.value))} style={inputStyle} />
          </div>
        </div>
        
        <label style={labelStyle}>URL обложки</label>
        <input value={formData.img || ''} onChange={e => update('img', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Темы курса</label>
        <ArrayEditor value={formData.topics || []} onChange={v => update('topics', v)} placeholder="Тема" />
        
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.popular || false} onChange={e => update('popular', e.target.checked)} />
            Популярное
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.free || false} onChange={e => update('free', e.target.checked)} />
            Бесплатный
          </label>
        </div>
      </>
    )
  }

  if (type === 'services') {
    return (
      <>
        <label style={labelStyle}>Иконка</label>
        <input value={formData.icon || ''} onChange={e => update('icon', e.target.value)} style={inputStyle} placeholder="✦" />
        
        <label style={labelStyle}>Название (RU)</label>
        <input value={formData.ru || ''} onChange={e => update('ru', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Название (EN)</label>
        <input value={formData.en || ''} onChange={e => update('en', e.target.value)} style={inputStyle} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Цена ($)</label>
            <input type="number" value={formData.price_usd || 0} onChange={e => update('price_usd', Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Время (RU)</label>
            <input value={formData.time_ru || ''} onChange={e => update('time_ru', e.target.value)} style={inputStyle} />
          </div>
        </div>
        
        <label style={labelStyle}>Описание (RU)</label>
        <textarea value={formData.desc_ru || ''} onChange={e => update('desc_ru', e.target.value)} style={textareaStyle} />
        
        <label style={labelStyle}>Описание (EN)</label>
        <textarea value={formData.desc_en || ''} onChange={e => update('desc_en', e.target.value)} style={textareaStyle} />
        
        <label style={labelStyle}>Фичи</label>
        <ArrayEditor value={formData.features || []} onChange={v => update('features', v)} placeholder="Фича" />
      </>
    )
  }

  if (type === 'reviews') {
    return (
      <>
        <label style={labelStyle}>Имя клиента</label>
        <input value={formData.name || ''} onChange={e => update('name', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Telegram username</label>
        <input value={formData.tg || ''} onChange={e => update('tg', e.target.value)} style={inputStyle} placeholder="username" />
        
        <label style={labelStyle}>Рейтинг</label>
        <select value={formData.rating || 5} onChange={e => update('rating', Number(e.target.value))} style={inputStyle}>
          <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
          <option value={4}>⭐⭐⭐⭐ (4)</option>
          <option value={3}>⭐⭐⭐ (3)</option>
          <option value={2}>⭐⭐ (2)</option>
          <option value={1}>⭐ (1)</option>
        </select>
        
        <label style={labelStyle}>Текст отзыва</label>
        <textarea value={formData.text || ''} onChange={e => update('text', e.target.value)} style={textareaStyle} />
        
        <label style={labelStyle}>Время</label>
        <input value={formData.time || ''} onChange={e => update('time', e.target.value)} style={inputStyle} placeholder="сегодня" />
        
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={formData.verified || false} onChange={e => update('verified', e.target.checked)} />
          Подтверждённый клиент
        </label>
      </>
    )
  }

  if (type === 'faq') {
    return (
      <>
        <label style={labelStyle}>Вопрос</label>
        <input value={formData.q || ''} onChange={e => update('q', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Ответ</label>
        <textarea value={formData.a || ''} onChange={e => update('a', e.target.value)} style={textareaStyle} />
      </>
    )
  }

  if (type === 'home_stats') {
    return (
      <>
        <label style={labelStyle}>Значение</label>
        <input value={formData.value || ''} onChange={e => update('value', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Название (RU)</label>
        <input value={formData.label_ru || ''} onChange={e => update('label_ru', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Название (EN)</label>
        <input value={formData.label_en || ''} onChange={e => update('label_en', e.target.value)} style={inputStyle} />
      </>
    )
  }

  if (type === 'home_socials') {
    return (
      <>
        <label style={labelStyle}>Тип</label>
        <select value={formData.kind || ''} onChange={e => update('kind', e.target.value)} style={inputStyle}>
          <option value="telegram">Telegram</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
          <option value="website">Website</option>
        </select>
        
        <label style={labelStyle}>Название</label>
        <input value={formData.label || ''} onChange={e => update('label', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>URL</label>
        <input value={formData.url || ''} onChange={e => update('url', e.target.value)} style={inputStyle} placeholder="https://..." />
        
        <label style={labelStyle}>Цвет акцента</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="color" value={formData.accent || '#229ED9'} onChange={e => update('accent', e.target.value)} style={{ width: 48, height: 48, border: 'none', cursor: 'pointer' }} />
          <input value={formData.accent || '#229ED9'} onChange={e => update('accent', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        </div>
      </>
    )
  }

  return <div style={{ color: '#888' }}>Форма не найдена</div>
}

// Shared styles
export const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
  color: 'rgba(161,161,170,.82)',
  marginTop: 8,
}

export const inputStyle = {
  height: 48,
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,.08)',
  background: 'rgba(255,255,255,.04)',
  color: '#f4f4f5',
  padding: '0 14px',
  fontSize: 15,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

export const textareaStyle = {
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,.08)',
  background: 'rgba(255,255,255,.04)',
  color: '#f4f4f5',
  padding: 14,
  fontSize: 15,
  outline: 'none',
  minHeight: 100,
  lineHeight: 1.6,
  resize: 'vertical',
  width: '100%',
  boxSizing: 'border-box',
}
