from aiogram import Bot, Dispatcher, types
from aiogram.utils import executor
from aiogram.types import WebAppInfo
from config import TOKEN, ADMIN_ID, SITE_URL, CHANNEL_ID, CHANNEL_INVITE_LINK
from aiohttp import web
import json

bot = Bot(token=TOKEN)
dp = Dispatcher(bot)

# Веб-сервер для проверки подписки
async def check_subscription(request):
    try:
        data = await request.json()
        user_id = data.get('user_id')
        
        if not user_id:
            return web.json_response({'error': 'user_id is required'}, status=400)
        
        try:
            # Проверяем статус пользователя в канале
            member = await bot.get_chat_member(chat_id=CHANNEL_ID, user_id=user_id)
            
            # Статусы: creator, administrator, member - подписан
            # left, kicked - не подписан
            is_subscribed = member.status in ['creator', 'administrator', 'member']
            
            return web.json_response({
                'is_subscribed': is_subscribed,
                'status': member.status
            })
        except Exception as e:
            return web.json_response({
                'is_subscribed': False,
                'error': str(e)
            })
    except Exception as e:
        return web.json_response({'error': str(e)}, status=500)

@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    kb = types.InlineKeyboardMarkup()
    kb.add(types.InlineKeyboardButton("Открыть приложение", web_app=WebAppInfo(url=SITE_URL)))
    await message.answer("Открой приложение:", reply_markup=kb)

async def on_startup(app):
    # Запускаем бота в фоне
    pass

async def on_shutdown(app):
    await bot.close()

if __name__ == '__main__':
    # Создаем веб-приложение
    app = web.Application()
    app.router.add_post('/check_subscription', check_subscription)
    app.on_startup.append(on_startup)
    app.on_shutdown.append(on_shutdown)
    
    # Запускаем бота и веб-сервер
    from aiogram import executor
    executor.start_polling(dp, skip_updates=True)
