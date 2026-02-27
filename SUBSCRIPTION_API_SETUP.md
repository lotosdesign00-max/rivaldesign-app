# Настройка проверки подписки на Telegram канал

## Текущее состояние (ДЕМО режим)

Сейчас проверка подписки работает в демо-режиме:
- Первый клик на "Проверить подписку" → показывает ошибку
- Второй клик → успешно пропускает пользователя

## Для реальной проверки подписки нужно:

### 1. Настроить бота

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Добавьте бота администратором в ваш канал `https://t.me/+a7SsFZHmCaJiNDMy`
4. Дайте боту права на чтение списка участников

### 2. Настроить бэкенд API

Вам нужен API endpoint для проверки подписки. Варианты:

#### Вариант A: Использовать существующий бот (bot/main.py)

1. Установите зависимости:
```bash
pip install aiogram aiohttp
```

2. Настройте `bot/config.py`:
```python
TOKEN = "ваш_токен_бота"
CHANNEL_ID = "-100xxxxxxxxxx"  # ID вашего канала
```

3. Запустите бота:
```bash
python bot/main.py
```

API будет доступен на `http://localhost:8080/check_subscription`

#### Вариант B: Serverless функция (Vercel/Netlify)

Создайте API endpoint:

```javascript
// api/check-subscription.js
export default async function handler(req, res) {
  const { user_id } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHANNEL_ID = process.env.CHANNEL_ID;
  
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHANNEL_ID}&user_id=${user_id}`
    );
    const data = await response.json();
    
    const isSubscribed = ['creator', 'administrator', 'member'].includes(data.result?.status);
    
    res.json({ is_subscribed: isSubscribed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 3. Обновить фронтенд

В `src/App.jsx` замените блок проверки:

```javascript
// Найдите эту часть в функции checkSubscription:
const response = await fetch('/api/check-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: userId })
});
const data = await response.json();
const isReallySubscribed = data.is_subscribed;

// И используйте isReallySubscribed вместо демо логики
```

### 4. Получить ID канала

Для приватного канала:
1. Перешлите сообщение из канала боту [@userinfobot](https://t.me/userinfobot)
2. Он покажет ID канала (например: `-1001234567890`)

## Переменные окружения

Создайте `.env` файл:

```env
VITE_API_URL=https://your-api.com
BOT_TOKEN=your_bot_token_here
CHANNEL_ID=-1001234567890
```

## Безопасность

⚠️ **ВАЖНО**: Никогда не храните токен бота в клиентском коде!
Всегда используйте серверный API для проверки подписки.

## Тестирование

1. Откройте приложение через Telegram WebApp
2. Нажмите "Подписаться на канал"
3. Подпишитесь на канал
4. Вернитесь в приложение
5. Нажмите "Проверить подписку"
6. Если подписаны → доступ открыт ✅
7. Если не подписаны → ошибка ❌
