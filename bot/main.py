"""Rival Design Telegram Bot - Main entry point."""
import os
import asyncio
import logging
from decimal import Decimal
from aiocryptopay import CryptoPay, Coin
from aiogram import Bot, Dispatcher, Router, F
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties

from database import db
from kb import (
    main_menu_kb, profile_kb, deposit_kb, orders_kb,
    order_category_kb, back_to_menu_kb, payment_success_kb
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8436545534:AAFTX3j_035ivCEw92G_7pmLypNYL1wg03k")
CRYPTOPAY_TOKEN = os.getenv("CRYPTOPAY_API_TOKEN", "566807:AAvEKRLYVdNzCxiO6ZpHYINsOLg95HCT2nc")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://rivaldesign.app")

# Initialize CryptoPay
cryptopay = CryptoPay(token=CRYPTOPAY_TOKEN)

# Router
router = Router()

# Brand colors for premium feel
BRAND = {
    "gold": "◈",
    "diamond": "◆",
    "arrow": "↗",
    "back": "◀",
    "check": "✓",
    "star": "★",
}


def get_user_status(orders_count: int) -> tuple[str, str]:
    """Determine user status based on orders count."""
    if orders_count < 5:
        return "Эфеб", "✦ Базовый статус"
    return "Полит", "✦ Скидка 10% на все заказы"


async def ensure_user(message: Message) -> dict:
    """Ensure user exists in database."""
    user = message.from_user
    return await db.get_or_create_user(
        telegram_id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        photo_url=user.photo_url
    )


@router.message(CommandStart())
async def cmd_start(message: Message):
    """Handle /start command."""
    await ensure_user(message)

    welcome_text = (
        "<b>RIVAL DESIGN</b>\n"
        "─────────────────\n\n"
        "Премиальный дизайн\n"
        "для вашего бизнеса\n\n"
        "Мы создаём логотипы, брендинг,\n"
        "веб-дизайн и не только.\n\n"
        "<i>Выберите действие:</i>"
    )

    await message.answer_video(
        video="AgACAgIAAxkDAAO7Z_8jO5aW1d...",  # Placeholder - replace with real VIDEO_ID
        caption=welcome_text,
        parse_mode=ParseMode.HTML,
        reply_markup=main_menu_kb()
    )


@router.message(Command("menu"))
async def cmd_menu(message: Message):
    """Handle /menu command."""
    await ensure_user(message)

    menu_text = (
        "<b>RIVAL DESIGN</b>\n"
        "─────────────────\n\n"
        "<i>Главное меню</i>"
    )

    await message.answer(
        text=menu_text,
        parse_mode=ParseMode.HTML,
        reply_markup=main_menu_kb()
    )


@router.callback_query(F.data == "menu_order")
async def callback_order(callback):
    """Show order category selection."""
    services = await db.get_services()

    order_text = (
        "<b>RIVAL DESIGN</b>\n"
        "─────────────────\n\n"
        "<i>Выберите услугу</i>"
    )

    await callback.message.edit_text(
        text=order_text,
        parse_mode=ParseMode.HTML,
        reply_markup=order_category_kb(services)
    )
    await callback.answer()


@router.callback_query(F.data == "menu_profile")
async def callback_profile(callback):
    """Show user profile."""
    user = await ensure_user(callback.message)
    balance = Decimal(str(user.get("balance", "0.00")))
    orders_count = await db.get_user_orders_count(callback.from_user.id)
    status, status_bonus = get_user_status(orders_count)

    username = callback.from_user.username or callback.from_user.first_name or "Друг"

    profile_text = (
        f"<b>Профиль</b>\n"
        f"─────────────────\n\n"
        f"◈ <b>@{username}</b>\n\n"
        f"◈ <b>Статус:</b> {status}\n"
        f"  {status_bonus}\n\n"
        f"◈ <b>Баланс:</b> {balance:.2f} ₽\n"
        f"◈ <b>Заказов:</b> {orders_count}"
    )

    await callback.message.edit_text(
        text=profile_text,
        parse_mode=ParseMode.HTML,
        reply_markup=profile_kb()
    )
    await callback.answer()


@router.callback_query(F.data == "profile_deposit")
async def callback_deposit(callback):
    """Show deposit options."""
    deposit_text = (
        "<b>Пополнение</b>\n"
        "─────────────────\n\n"
        "<i>Выберите сумму</i>\n"
        "Минимальная: 500 ₽"
    )

    await callback.message.edit_text(
        text=deposit_text,
        parse_mode=ParseMode.HTML,
        reply_markup=deposit_kb()
    )
    await callback.answer()


@router.callback_query(F.data.startswith("deposit_"))
async def callback_deposit_amount(callback):
    """Create invoice for deposit."""
    amount = int(callback.data.split("_")[1])

    try:
        # Create CryptoPay invoice
        invoice = await cryptopay.create_invoice(
            asset=Coin.USDT,
            amount=amount,
            description=f"Пополнение Rival Design: {amount} ₽"
        )

        payment_text = (
            f"<b>Счёт на пополнение</b>\n"
            "─────────────────\n\n"
            f"◈ Сумма: <b>{amount} ₽</b>\n"
            f"◈ Валюта: USDT (TON)\n\n"
            "Нажмите кнопку для оплаты.\n"
            "Баланс зачислится автоматически."
        )

        await callback.message.edit_text(
            text=payment_text,
            parse_mode=ParseMode.HTML,
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[[
                InlineKeyboardButton(text="◈ Оплатить", url=invoice.pay_url)
            ], [
                InlineKeyboardButton(text="◀ Назад", callback_data="profile_deposit")
            ]])
        )

        # Store payment for later confirmation
        user = await db.get_user(callback.from_user.id)
        if user:
            await db.create_payment(
                user_id=user["id"],
                amount=Decimal(str(amount)),
                invoice_id=str(invoice.invoice_id),
                pay_url=invoice.pay_url
            )

    except Exception as e:
        logger.error(f"Failed to create invoice: {e}")
        await callback.message.edit_text(
            text="◉ Не удалось создать счёт.\nПопробуйте позже.",
            parse_mode=ParseMode.HTML,
            reply_markup=back_to_menu_kb()
        )

    await callback.answer()


@router.callback_query(F.data == "profile_orders")
async def callback_orders(callback):
    """Show user orders history."""
    orders = await db.get_user_orders(callback.from_user.id)

    if not orders:
        orders_text = (
            "<b>История заказов</b>\n"
            "─────────────────\n\n"
            "У вас пока нет заказов."
        )
    else:
        orders_lines = [
            "<b>История заказов</b>\n"
            "─────────────────"
        ]
        for order in orders[:10]:  # Show last 10
            order_num = order.get("order_number", "—")
            service = order.get("service_name", "—")
            status = order.get("status", "—")
            amount = float(order.get("total_amount", 0))

            status_display = {
                "waiting_payment": "Ожидает оплаты",
                "payment_review": "Проверка оплаты",
                "queued": "В очереди",
                "in_progress": "В работе",
                "preview_sent": "Превью отправлено",
                "revision": "На доработке",
                "delivered": "Доставлен",
                "closed": "Завершён",
                "canceled": "Отменён"
            }.get(status, status)

            orders_lines.append(
                f"\n◆ <code>{order_num}</code>\n"
                f"  {service}\n"
                f"  {amount:.2f} ₽ — {status_display}"
            )

        orders_text = "\n".join(orders_lines)

    await callback.message.edit_text(
        text=orders_text,
        parse_mode=ParseMode.HTML,
        reply_markup=orders_kb()
    )
    await callback.answer()


@router.callback_query(F.data == "back_to_menu")
async def callback_back_to_menu(callback):
    """Return to main menu."""
    await ensure_user(callback.message)

    menu_text = (
        "<b>RIVAL DESIGN</b>\n"
        "─────────────────\n\n"
        "<i>Главное меню</i>"
    )

    await callback.message.edit_text(
        text=menu_text,
        parse_mode=ParseMode.HTML,
        reply_markup=main_menu_kb()
    )
    await callback.answer()


@router.callback_query(F.data == "ignore")
async def callback_ignore(callback):
    """Ignore divider button presses."""
    await callback.answer()


async def handle_crypto_payment(update: dict):
    """Handle CryptoPay webhook updates."""
    try:
        if update.get("status") == "paid":
            invoice_id = update.get("invoice_id")
            amount = Decimal(str(update.get("amount_paid", "0")))

            async with db.session() as client:
                response = await client.table("payments").select("*").eq("crypto_invoice_id", str(invoice_id)).eq("status", "pending").execute()

                if response.data:
                    payment = response.data[0]
                    user_id = payment["user_id"]

                    await db.mark_payment_paid(payment["id"])

                    user_response = await client.table("users").select("balance").eq("id", user_id).execute()
                    if user_response.data:
                        current_balance = Decimal(str(user_response.data[0]["balance"] or "0.00"))
                        new_balance = current_balance + amount
                        await client.table("users").update({"balance": new_balance}).eq("id", user_id).execute()

                    logger.info(f"Payment {invoice_id} processed: {amount} to user {user_id}")
    except Exception as e:
        logger.error(f"Failed to process payment: {e}")


async def main():
    """Main entry point."""
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()
    dp.include_router(router)

    logger.info("Rival Design Bot started")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())