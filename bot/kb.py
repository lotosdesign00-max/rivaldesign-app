"""Keyboard definitions for the bot."""
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

# WebApp URL - replace with your actual Mini App URL
WEBAPP_URL = "https://rivaldesign.app"

# Placeholder video ID for welcome message
VIDEO_ID = ""  # Set your actual Telegram video file_id here


def main_menu_kb() -> InlineKeyboardMarkup:
    """Main menu keyboard."""
    builder = InlineKeyboardBuilder()

    # Row 1: Primary actions
    builder.row(
        InlineKeyboardButton(text="⚪ Оставить заказ", callback_data="menu_order"),
        InlineKeyboardButton(text="👤 Мой профиль", callback_data="menu_profile"),
    )

    # Divider
    builder.row(
        InlineKeyboardButton(text="─" * 20, callback_data="ignore")
    )

    # Row 2: Grid buttons (2x2)
    builder.row(
        InlineKeyboardButton(text="◈ Портфолио", url="https://rivaldesign.app/portfolio"),
        InlineKeyboardButton(text="◈ Цены", url="https://rivaldesign.app/pricing"),
    )
    builder.row(
        InlineKeyboardButton(text="◈ Услуги", url="https://rivaldesign.app/services"),
        InlineKeyboardButton(text="◈ Отзывы", url="https://rivaldesign.app/reviews"),
    )

    # Divider
    builder.row(
        InlineKeyboardButton(text="─" * 20, callback_data="ignore")
    )

    # Row 3: Open Rival Space (WebApp)
    builder.row(
        InlineKeyboardButton(
            text="⟡ Открыть Rival Space",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )
    )

    return builder.as_markup()


def profile_kb() -> InlineKeyboardMarkup:
    """Profile keyboard."""
    builder = InlineKeyboardBuilder()

    builder.row(
        InlineKeyboardButton(text="◈ Пополнить баланс", callback_data="profile_deposit")
    )
    builder.row(
        InlineKeyboardButton(text="◈ История заказов", callback_data="profile_orders")
    )

    # Divider
    builder.row(
        InlineKeyboardButton(text="─" * 20, callback_data="ignore")
    )

    builder.row(
        InlineKeyboardButton(text="◀ Назад в меню", callback_data="back_to_menu")
    )

    return builder.as_markup()


def deposit_kb() -> InlineKeyboardMarkup:
    """Deposit keyboard with amount options."""
    builder = InlineKeyboardBuilder()

    # Quick amounts row
    amounts = [500, 1000, 2500]
    for amount in amounts:
        builder.row(
            InlineKeyboardButton(text=f"{amount} ₽", callback_data=f"deposit_{amount}")
        )

    # Large amounts row
    amounts_large = [5000, 10000, 25000]
    for amount in amounts_large:
        builder.row(
            InlineKeyboardButton(text=f"{amount} ₽", callback_data=f"deposit_{amount}")
        )

    # Divider
    builder.row(
        InlineKeyboardButton(text="─" * 20, callback_data="ignore")
    )

    builder.row(
        InlineKeyboardButton(text="◀ Назад", callback_data="menu_profile")
    )

    return builder.as_markup()


def orders_kb() -> InlineKeyboardMarkup:
    """Orders history keyboard."""
    builder = InlineKeyboardBuilder()

    builder.row(
        InlineKeyboardButton(text="◀ Назад в профиль", callback_data="menu_profile")
    )

    return builder.as_markup()


def order_category_kb(services: list[dict]) -> InlineKeyboardMarkup:
    """Order category selection keyboard."""
    builder = InlineKeyboardBuilder()

    for service in services:
        price = float(service.get("price", 0))
        price_text = f"${price:.0f}" if service.get("currency") == "USD" else f"{price:.0f} ₽"
        builder.row(
            InlineKeyboardButton(
                text=f"◆ {service.get('name')} — {price_text}",
                callback_data=f"order_service_{service['id']}"
            )
        )

    # Divider
    builder.row(
        InlineKeyboardButton(text="─" * 20, callback_data="ignore")
    )

    builder.row(
        InlineKeyboardButton(text="◀ Назад в меню", callback_data="back_to_menu")
    )

    return builder.as_markup()


def back_to_menu_kb() -> InlineKeyboardMarkup:
    """Simple back to menu button."""
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="◀ Назад в меню", callback_data="back_to_menu")
    ]])


def payment_success_kb() -> InlineKeyboardMarkup:
    """Payment success keyboard."""
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="◀ Назад в профиль", callback_data="menu_profile")
    ]])