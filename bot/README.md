# Rival Design Telegram Bot

Premium Telegram bot for Rival Design brand ecosystem.

## Setup

```bash
cd bot
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your tokens

# Run bot
python main.py
```

## Structure

- `main.py` - Bot logic, handlers, routing
- `database.py` - Supabase async operations
- `kb.py` - Inline keyboard definitions
- `requirements.txt` - Python dependencies

## Features

- Premium UI with video welcome
- User profile with real-time balance
- Status system (Эфеб/Полит)
- CryptoBot deposits via aiocryptopay
- Order category selection
- Order history

## Status System

- `Эфеб` — < 5 completed orders
- `Полит` — ≥ 5 orders (10% discount)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `CRYPTOPAY_API_TOKEN` | CryptoBot API token |
| `WEBAPP_URL` | Rival Space Mini App URL |