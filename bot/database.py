"""Database operations with Supabase."""
import os
from decimal import Decimal
from supabase import create_client, AsyncClient
from contextlib import asynccontextmanager

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://tlzxcghfvgazkzaoawtj.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_SECRET_KEY", ""))


class Database:
    def __init__(self):
        self._client: AsyncClient | None = None

    async def get_client(self) -> AsyncClient:
        if self._client is None:
            self._client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return self._client

    @asynccontextmanager
    async def session(self):
        client = await self.get_client()
        yield client

    async def get_or_create_user(self, telegram_id: int, username: str | None = None,
                                  first_name: str | None = None, last_name: str | None = None,
                                  photo_url: str | None = None) -> dict | None:
        """Get existing user or create new one."""
        async with self.session() as client:
            # Try to get existing user
            response = await client.table("users").select("*").eq("telegram_id", telegram_id).execute()
            if response.data:
                return response.data[0]

            # Create new user
            payload = {
                "telegram_id": telegram_id,
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                "photo_url": photo_url,
                "balance": Decimal("0.00"),
            }
            response = await client.table("users").insert(payload).execute()
            return response.data[0] if response.data else None

    async def get_user(self, telegram_id: int) -> dict | None:
        """Get user by telegram ID."""
        async with self.session() as client:
            response = await client.table("users").select("*").eq("telegram_id", telegram_id).execute()
            return response.data[0] if response.data else None

    async def get_user_balance(self, telegram_id: int) -> Decimal:
        """Get user's balance."""
        user = await self.get_user(telegram_id)
        return Decimal(str(user["balance"])) if user else Decimal("0.00")

    async def get_user_orders_count(self, telegram_id: int) -> int:
        """Count user's completed orders."""
        async with self.session() as client:
            # First get user's UUID by telegram_id
            user_response = await client.table("users").select("id").eq("telegram_id", telegram_id).execute()
            if not user_response.data:
                return 0
            user_id = user_response.data[0]["id"]

            # Count completed orders (delivered + closed)
            response = await client.table("orders").select("id", count="exact").eq("user_id", user_id).eq("status", "delivered").execute()
            delivered = response.count if hasattr(response, 'count') else 0
            response = await client.table("orders").select("id", count="exact").eq("user_id", user_id).eq("status", "closed").execute()
            closed = response.count if hasattr(response, 'count') else 0
            return delivered + closed

    async def get_user_orders(self, telegram_id: int) -> list[dict]:
        """Get user's order history."""
        async with self.session() as client:
            user_response = await client.table("users").select("id").eq("telegram_id", telegram_id).execute()
            if not user_response.data:
                return []
            user_id = user_response.data[0]["id"]

            response = await client.table("orders").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return response.data if response.data else []

    async def update_balance(self, telegram_id: int, amount: Decimal) -> bool:
        """Add amount to user's balance."""
        async with self.session() as client:
            user_response = await client.table("users").select("id, balance").eq("telegram_id", telegram_id).execute()
            if not user_response.data:
                return False

            user_id = user_response.data[0]["id"]
            current_balance = Decimal(str(user_response.data[0]["balance"] or "0.00"))
            new_balance = current_balance + amount

            response = await client.table("users").update({"balance": new_balance}).eq("id", user_id).execute()
            return bool(response.data)

    async def create_payment(self, user_id: str, amount: Decimal, invoice_id: str | None = None,
                            pay_url: str | None = None) -> dict | None:
        """Create a pending payment record."""
        async with self.session() as client:
            payload = {
                "user_id": user_id,
                "amount": amount,
                "status": "pending",
                "crypto_invoice_id": invoice_id,
                "crypto_pay_url": pay_url,
                "payment_method": "cryptobot",
            }
            response = await client.table("payments").insert(payload).execute()
            return response.data[0] if response.data else None

    async def get_payment(self, payment_id: str) -> dict | None:
        """Get payment by ID."""
        async with self.session() as client:
            response = await client.table("payments").select("*").eq("id", payment_id).execute()
            return response.data[0] if response.data else None

    async def mark_payment_paid(self, payment_id: str) -> bool:
        """Mark payment as paid."""
        async with self.session() as client:
            response = await client.table("payments").update({
                "status": "paid",
                "paid_at": "now()"
            }).eq("id", payment_id).eq("status", "pending").execute()
            return bool(response.data)

    async def get_services(self) -> list[dict]:
        """Get all active services."""
        async with self.session() as client:
            response = await client.table("services").select("*").eq("is_active", True).order("sort_order").execute()
            return response.data if response.data else []


db = Database()