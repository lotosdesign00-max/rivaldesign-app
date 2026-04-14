# Rival Space

Портфолио и Telegram Mini App для графического дизайнера с отдельной админкой, заказами, платежными сценариями и управляемым контентом.

## Что в проекте сейчас

- клиентское приложение на живой `legacy`-архитектуре
- отдельная админка в `/admin`
- серверные dev/prod endpoints через `vite.config.js` и `api/`
- Supabase для заказов, платежей, сообщений и админских данных
- локальное JSON-хранилище контента: `storage/admin-content.json`

## Актуальная структура

- `main.jsx` -> `App.jsx` -> `legacy/AppLegacy.jsx`
- `admin/` — отдельное админское приложение
- `legacy/` — текущее основное приложение
- `api/` — serverless endpoints для деплоя
- `storage/` — управляемый контент
- `supabase/admin_live_schema.sql` — текущая SQL-схема

## Быстрый запуск

```bash
npm install
npm run dev
```

Основное приложение:
- [http://localhost:5173/](http://localhost:5173/)

Админка:
- [http://localhost:5173/admin/](http://localhost:5173/admin/)

## Сборка

```bash
npm run build
```

## Переменные окружения

Нужны в `.env`:

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
CRYPTOPAY_API_TOKEN=
```

Поддерживается также `SUPABASE_SERVICE_KEY` как альтернативное имя серверного ключа.

## Supabase

Перед запуском админки и live-заказов примени схему:

- `supabase/admin_live_schema.sql`

После этого серверные endpoints смогут работать с:
- пользователями
- заказами
- платежами
- сообщениями
- админскими обновлениями

## Деплой

Проект подготовлен под Vercel:
- статическая сборка через `vite build`
- serverless endpoints в `api/`
- маршрут админки `/admin`

## Backup

Локальный бэкап:

```bash
npm run backup
```
