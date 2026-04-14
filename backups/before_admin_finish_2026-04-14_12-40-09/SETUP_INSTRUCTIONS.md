# 🚀 Rival Design — Настройка Supabase и запуск

## 1. Настройка Supabase

### 1.1. Создай проект (уже создан ✅)
- URL: `https://tlzxcghfvgazkzaoawtj.supabase.co`
- Проект уже создан, осталось применить схему.

### 1.2. Примени SQL-схему
1. Открой [Supabase Dashboard](https://supabase.com/dashboard/project/tlzxcghfvgazkzaoawtj)
2. Перейди в **SQL Editor** (левое меню)
3. Нажми **New Query**
4. Скопируй содержимое файла `supabase_schema.sql` из корня проекта
5. Вставь и нажми **Run**

Это создаст все таблицы: `users`, `services`, `payments`, `orders`, `messages`, `notifications` + RLS политики.

### 1.3. Получи Service Key
1. В Supabase Dashboard → **Settings** (шестерёнка) → **API**
2. Найди **service_role key (secret)** — это длинная строка начинающаяся с `eyJ...`
3. Скопируй её

### 1.4. Добавь Service Key в .env
Открой `.env` и вставь ключ:
```
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsenhjZ2hmdmdhemt6YW9hd3RqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxMTUwNywiZXhwIjoyMDkxNTg3NTA3fQ.ТВОЙ_КЛЮЧ
```

### 1.5. Сделай себя админом
После первого входа в приложение, твой пользователь создастся в таблице `users`.
Чтобы получить доступ к админ-панели:

1. В Supabase Dashboard → **Table Editor** → таблица `users`
2. Найди свою запись (по telegram_id)
3. Измени `is_admin` с `false` на `true`
4. Сохрани

Или выполни SQL:
```sql
UPDATE users SET is_admin = true WHERE telegram_id = ТВОЙ_TELEGRAM_ID;
```

## 2. Запуск приложения

### Dev режим
```bash
npm run dev
```
Откроется на `http://localhost:5173`

### Для Telegram Mini App
Тебе нужно задеплоить приложение. Варианты:

**Вариант A — Vercel (бесплатно,推荐)**
```bash
npm run build
# Загрузи папку dist на Vercel
```

**Вариант B — Cloudflare Pages (бесплатно)**
```bash
npm run build
# Загрузи папку dist на Cloudflare Pages
```

**Вариант C — GitHub Pages**
```bash
npm run build
# Используй gh-pages или actions
```

После деплоя, укажи URL в @BotFather при настройке Mini App.

## 3. Настройка CryptoBot

### 3.1. Получи токен CryptoBot
1. Открой [@CryptoBot](https://t.me/CryptoBot) в Telegram
2. Напиши `/myapps`
3. Создай новое приложение или используй существующее
4. Скопируй API токен

### 3.2. Добавь токен в .env
```
CRYPTOPAY_API_TOKEN=ТВОЙ_ТОКЕН_ОТ_CRYPTOБОТА
```

## 4. Структура навигации

| Вкладка | Описание |
|---------|----------|
| 🏠 Главная | Discover — портфолио, работы |
| 💎 Услуги | Каталог услуг, покупка |
| 📦 Заказы | Мои заказы со статусами + чат |
| 💰 Баланс | Кошелёк, пополнение через CryptoBot |
| 👤 Профиль | Настройки пользователя |
| ⚙️ Админ | Панель дизайнера (скрыта, только для админа) |

## 5. Как работает оплата

### Сценарий 1: Достаточно средств на балансе
1. Клиент выбирает услугу → нажимает "Заказать"
2. Описывает задачу → "Оплатить с баланса"
3. Средства списываются, заказ создаётся со статусом "Проверка оплаты"

### Сценарий 2: Недостаточно средств
1. Клиент выбирает услугу → нажимает "Заказать"
2. Описывает задачу → "Оплатить через CryptoBot"
3. Создаётся инвойс в CryptoBot
4. Клиент переходит в @CryptoBot и оплачивает
5. После оплаты — webhook обновит баланс (нужно настроить webhook)
6. Заказ создаётся автоматически

## 6. Webhook от CryptoBot (опционально)

Для автоматического обновления баланса после оплаты CryptoBot, нужно настроить webhook.

Создай Edge Function в Supabase:

```sql
-- В Supabase Dashboard → Edge Functions
-- Создай функцию cryptobot-webhook
```

Или используй внешний сервер (Cloudflare Workers, Vercel API Routes).

## 7. Доступ к админ-панели

Админ-панель доступна по вкладке `admin` в навигации.
Чтобы добавить её в BottomNavigation для себя:

1. Открой `src/components/BottomNavigation.jsx`
2. Добавь в `NAV_ITEMS`:
```js
{ id: 'admin', icon: '⚙️', label: 'Админ' },
```

Или открывай напрямую по URL: добавь в навигацию временно.

## 8. Что дальше

- [ ] Настроить webhook от CryptoBot для авто-пополнения
- [ ] Добавить уведомления о новых заказах (Telegram Bot API)
- [ ] Добавить загрузку файлов в чат
- [ ] Добавить push-уведомления через Telegram
