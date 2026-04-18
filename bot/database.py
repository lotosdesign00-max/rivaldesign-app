"""Database operations with Supabase REST API."""
import os
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any

import httpx
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Keep database usable when imported directly from tests or scripts.
load_dotenv(Path(__file__).with_name(".env"))

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_SECRET_KEY", ""))

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL is not set in bot/.env")
if not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_SERVICE_KEY is not set in bot/.env")


class Database:
    def __init__(self):
        self._client: httpx.AsyncClient | None = None

    async def get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=f"{SUPABASE_URL}/rest/v1",
                timeout=20,
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                },
            )
        return self._client

    @asynccontextmanager
    async def session(self):
        client = await self.get_client()
        yield client

    async def _request(
        self,
        method: str,
        table: str,
        *,
        params: dict[str, Any] | None = None,
        json: Any = None,
        prefer: str | None = None,
    ) -> Any:
        client = await self.get_client()
        headers = {"Prefer": prefer} if prefer else None
        response = await client.request(method, f"/{table}", params=params, json=json, headers=headers)
        response.raise_for_status()
        if response.status_code == 204 or not response.content:
            return None
        return response.json()

    async def _select(self, table: str, params: dict[str, Any]) -> list[dict]:
        data = await self._request("GET", table, params=params)
        return data if isinstance(data, list) else []

    async def _insert(self, table: str, payload: dict) -> dict | None:
        data = await self._request("POST", table, json=payload, prefer="return=representation")
        return data[0] if data else None

    async def _update(self, table: str, filters: dict[str, str], payload: dict) -> list[dict]:
        params = {"select": "*", **filters}
        data = await self._request(
            "PATCH",
            table,
            params=params,
            json=payload,
            prefer="return=representation",
        )
        return data if isinstance(data, list) else []

    async def get_or_create_user(
        self,
        telegram_id: int,
        username: str | None = None,
        first_name: str | None = None,
        last_name: str | None = None,
        photo_url: str | None = None,
    ) -> dict | None:
        """Get existing user or create new one."""
        existing = await self._select(
            "users",
            {"select": "*", "telegram_id": f"eq.{telegram_id}", "limit": "1"},
        )
        if existing:
            return existing[0]

        return await self._insert(
            "users",
            {
                "telegram_id": telegram_id,
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                "photo_url": photo_url,
                "balance": "0.00",
            },
        )

    async def get_user(self, telegram_id: int) -> dict | None:
        """Get user by telegram ID."""
        users = await self._select(
            "users",
            {"select": "*", "telegram_id": f"eq.{telegram_id}", "limit": "1"},
        )
        return users[0] if users else None

    async def get_user_balance(self, telegram_id: int) -> Decimal:
        """Get user's balance."""
        user = await self.get_user(telegram_id)
        return Decimal(str(user["balance"])) if user else Decimal("0.00")

    async def get_user_orders_count(self, telegram_id: int) -> int:
        """Count user's completed orders."""
        user = await self.get_user(telegram_id)
        if not user:
            return 0

        delivered = await self._select(
            "orders",
            {"select": "id", "user_id": f"eq.{user['id']}", "status": "eq.delivered"},
        )
        closed = await self._select(
            "orders",
            {"select": "id", "user_id": f"eq.{user['id']}", "status": "eq.closed"},
        )
        return len(delivered) + len(closed)

    async def get_user_orders(self, telegram_id: int) -> list[dict]:
        """Get user's order history."""
        user = await self.get_user(telegram_id)
        if not user:
            return []

        return await self._select(
            "orders",
            {
                "select": "*",
                "user_id": f"eq.{user['id']}",
                "order": "created_at.desc",
            },
        )

    async def update_balance(self, telegram_id: int, amount: Decimal) -> bool:
        """Add amount to user's balance."""
        user = await self.get_user(telegram_id)
        if not user:
            return False

        current_balance = Decimal(str(user.get("balance") or "0.00"))
        new_balance = current_balance + amount
        updated = await self._update(
            "users",
            {"id": f"eq.{user['id']}"},
            {"balance": str(new_balance)},
        )
        return bool(updated)

    async def create_payment(
        self,
        user_id: str,
        amount: Decimal,
        invoice_id: str | None = None,
        pay_url: str | None = None,
    ) -> dict | None:
        """Create a pending payment record."""
        return await self._insert(
            "payments",
            {
                "user_id": user_id,
                "amount": str(amount),
                "status": "pending",
                "crypto_invoice_id": invoice_id,
                "crypto_pay_url": pay_url,
                "payment_method": "cryptobot",
            },
        )

    async def get_payment(self, payment_id: str) -> dict | None:
        """Get payment by ID."""
        payments = await self._select("payments", {"select": "*", "id": f"eq.{payment_id}", "limit": "1"})
        return payments[0] if payments else None

    async def mark_payment_paid(self, payment_id: str) -> bool:
        """Mark payment as paid."""
        updated = await self._update(
            "payments",
            {"id": f"eq.{payment_id}", "status": "eq.pending"},
            {
                "status": "paid",
                "paid_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        return bool(updated)

    async def get_services(self) -> list[dict]:
        """Get all active services."""
        return await self._select(
            "services",
            {"select": "*", "is_active": "eq.true", "order": "sort_order.asc"},
        )


db = Database()
