# 🎨 RIVAL ADMIN PANEL - Полная документация

## 📋 Что это?

**Админ-панель Rival Design** — Telegram Mini App + веб-приложение для полного визуального управления всем контентом без кода.

- 📱 Работает внутри Telegram (Mini App)
- 💻 Работает в браузере (веб-версия)
- 🔄 Синхронизация через Supabase в реальном времени
- ✨ Современный UI с glassmorphism эффектами

---

## 🚀 Быстрый старт

### Шаг 1: Настройка Supabase

1. Открой SQL Editor в Supabase: https://tlzxcghfvgazkzaoawtj.supabase.co
2. Скопируй содержимое файла `supabase/admin_schema.sql`
3. Вставь в SQL Editor и нажми "Run"
4. ✅ Таблицы созданы!

### Шаг 2: Добавь SUPABASE_ANON_KEY в .env

Открой `.env` и добавь:

```env
# Supabase Anon Key (для чтения в основном приложении)
VITE_SUPABASE_ANON_KEY=твой_anon_ключ

# Supabase Service Key (для записи в админке - только сервер!)
SUPABASE_SERVICE_KEY=твой_secret_ключ
```

**Где найти ключи:**
- Supabase Dashboard → Settings → API
- `anon` = публичный ключ (можно на клиенте)
- `service_role` = секретный ключ (ТОЛЬКО на сервере!)

### Шаг 3: Подключение к Vercel

1. Зайди на https://vercel.com
2. Import your GitHub репозиторий
3. В настройках проекта добавь Environment Variables:
   - `SUPABASE_SERVICE_KEY` = твой secret key
   - `SUPABASE_URL` = https://tlzxcghfvgazkzaoawtj.supabase.co
4. Deploy!

### Шаг 4: Создание Telegram Mini App

1. Открой @BotFather в Telegram
2. `/newbot` → создай бота (или используй существующего)
3. `/newapp` → выбери бота
4. Укажи URL: `https://твой-vercel-url.vercel.app/admin`
5. Готово! Теперь админка доступна через Telegram

---

## 📁 Структура проекта

```
rivaldesign-app-main/
├── admin/                      ← АДМИНКА
│   ├── AdminApp.jsx            ← Главный компонент
│   ├── main.jsx                ← Точка входа
│   ├── index.html              ← HTML шаблон
│   └── helpers.js              ← Формы и конфиги
│
├── src/
│   ├── core/supabase/
│   │   ├── client.js           ← Supabase клиент
│   │   ├── hooks.js            ← Хуки для чтения
│   │   └── adminApi.js         ← API функции для админки
│   └── ...
│
├── api/                        ← SERVERLESS FUNCTIONS (Vercel)
│   └── admin/
│       ├── [...endpoint].js    ← Заказы, платежи, пользователи
│       └── content/[action].js ← CRUD для контента
│
├── supabase/
│   └── admin_schema.sql        ← SQL для создания таблиц
│
└── vercel.json                 ← Настройки деплоя
```

---

## 🎯 Функционал админки

### 📊 Dashboard
- Статистика: заказы, доход, клиенты
- Последние заказы и платежи
- Быстрый обзор всего

### 📦 Портфолио
- ✅ Список всех работ
- ➕ Добавить новую работу
- ✏️ Редактировать
- 🗑 Удалить
- Поля: название, категория, описание, фото, теги, популярность

### 📚 Курсы
- ✅ Список курсов
- ➕ Добавить курс
- ✏️ Редактировать
- 🗑 Удалить
- Поля: название, категория, описание, уровень, длительность, уроки, цена, рейтинг, темы

### 💼 Услуги
- ✅ Список услуг
- ➕ Добавить услугу
- ✏️ Редактировать
- 🗑 Удалить
- Поля: иконка, название (RU/EN), цена, время, описание, фичи

### ⭐ Отзывы
- ✅ Список отзывов
- ➕ Добавить отзыв
- ✏️ Редактировать
- 🗑 Удалить
- Поля: имя, telegram, рейтинг, текст, время, подтверждение

### ❓ FAQ
- ✅ Список вопросов
- ➕ Добавить вопрос/ответ
- ✏️ Редактировать
- 🗑 Удалить

### 🏠 Главная
- Редактирование статистики
- Редактирование соцсетей

### 📝 Входящие заказы
- Список всех заказов
- Изменение статуса
- Добавление заметок
- Отправка ссылки на результат
- 💬 Чат с клиентом

### 💰 Платежи
- Список всех платежей
- Изменение статуса
- Подтверждение оплаты

### 👥 Клиенты
- Список всех клиентов
- Изменение баланса
- Просмотр telegram_id

---

## 🔄 Как работает синхронизация

```
┌─────────────────┐
│   АДМИНКА       │
│ (через Telegram)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Serverless API  │
│ (Vercel)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SUPABASE      │
│ (База данных)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ОСНОВНОЕ        │
│ ПРИЛОЖЕНИЕ      │
└─────────────────┘
```

1. Ты редактируешь контент в админке
2. Данные отправляются в Supabase через API
3. Основное приложение читает из Supabase
4. Пользователи видят обновлённый контент

**GitHub не меняется!** Контент хранится в базе данных, не в коде.

---

## 🎨 Дизайн-система

Админка следует **UI/UX Pro Max** guidelines:

### Цвета
- **Фон:** Dark space (#05070b) с gradient overlays
- **Карточки:** Glassmorphism с blur эффектами
- **Акцент:** Indigo (#6366f1) с gradient
- **Успех:** Emerald (#10b981)
- **Ошибка:** Red (#ef4444)

### Размеры
- **Touch targets:** 48px минимум (UI/UX Pro Max guideline)
- **Border radius:** 16px (карточки 28px)
- **Spacing:** 8dp grid system

### Анимации
- **Micro-interactions:** 150ms ease-out
- **Modal entrance:** 300ms cubic-bezier
- **Toast auto-dismiss:** 3 seconds

### Accessibility
- **Contrast ratio:** >= 4.5:1 для текста
- **Focus states:** Visible focus rings
- **Touch spacing:** 8px+ между элементами
- **Label + Input:** Связанные через htmlFor

---

## 🛠️ Локальная разработка

### Запуск основного приложения:
```bash
npm run dev
# http://localhost:5173
```

### Запуск админки:
```bash
# В отдельном терминале
npm run dev -- --port 5174
# Открой http://localhost:5174/admin
```

### Тестирование Telegram Mini App:
```bash
# Используй ngrok для локального тестирования
ngrok http 5174
# Укажи URL в @BotFather
```

---

## 🔒 Безопасность

### Что защищено:
✅ **SUPABASE_SERVICE_KEY** — используется ТОЛЬКО в serverless функциях
✅ **RLS (Row Level Security)** — публичное чтение, запись только через service_role
✅ **Telegram WebApp** — автоматическая авторизация через initDataUnsafe
✅ **API endpoints** — только POST запросы

### Что НЕ защищено:
⚠️ **VITE_SUPABASE_ANON_KEY** — публичный ключ (только чтение, это OK)
⚠️ **Environment variables с префиксом VITE_** — видны на клиенте

---

## 📝 API Endpoints

### Контент (CRUD):
```
POST /api/admin/content/insert   — Добавить запись
POST /api/admin/content/update   — Обновить запись
POST /api/admin/content/delete   — Удалить запись
POST /api/admin/content/query    — Получить записи
```

### Заказы и платежи:
```
POST /api/admin/orders/list      — Список заказов
POST /api/admin/orders/update    — Обновить заказ
POST /api/admin/payments/list    — Список платежей
POST /api/admin/payments/update  — Обновить платёж
POST /api/admin/users/list       — Список пользователей
POST /api/admin/users/update-balance — Обновить баланс
POST /api/admin/messages/by-order — Сообщения заказа
POST /api/admin/messages/send    — Отправить сообщение
POST /api/admin/dashboard/stats  — Статистика
```

---

## 🚨 Troubleshooting

### "Missing SUPABASE_SERVICE_KEY"
- Добавь `SUPABASE_SERVICE_KEY` в .env (локально)
- Добавь в Vercel Environment Variables (на сервере)

### "Таблицы не найдены"
- Запусти `supabase/admin_schema.sql` в Supabase SQL Editor

### "Admin API request failed"
- Проверь что serverless функции задеплоились на Vercel
- Посмотри логи в Vercel Dashboard

### "Нет данных в админке"
- Проверь что Supabase таблицы не пустые
- Посмотри Network tab в браузере на ошибки

---

## 🎯 Следующие шаги

### Что можно улучшить:
1. **Загрузка фото** — добавить upload в Supabase Storage
2. **Редактор JSON** — для продвинутых пользователей
3. **Массовые операции** — выбрать несколько и удалить
4. **Поиск и фильтры** — в списках записей
5. **Preview** — предпросмотр перед сохранением
6. **История изменений** — лог всех правок
7. **Уведомления** — пуш о новых заказах

---

## 📞 Поддержка

Если что-то не работает:
1. Проверь логи в Vercel Dashboard
2. Проверь Supabase SQL Editor на ошибки
3. Проверь .env файлы
4. Открой консоль браузера (F12) на ошибки

---

**Сделано с ❤️ для Rival Design**
