-- Rival Space admin + live orders schema
create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint unique not null,
  username text,
  first_name text,
  last_name text,
  balance numeric(10,2) default 0.00,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_users_telegram_id on public.users(telegram_id);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  description text,
  price numeric(10,2) not null,
  currency text default 'USD',
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text default 'USD',
  status text default 'pending' check (status in ('pending','paid','canceled','refunded')),
  crypto_invoice_id text,
  crypto_pay_url text,
  payment_method text default 'cryptobot',
  created_at timestamptz default now(),
  paid_at timestamptz,
  updated_at timestamptz default now()
);

create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_status on public.payments(status);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  user_id uuid references public.users(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  service_name text not null,
  total_amount numeric(10,2) not null,
  status text default 'waiting_payment' check (status in ('waiting_payment','payment_review','queued','in_progress','preview_sent','revision','delivered','closed','canceled')),
  payment_id uuid references public.payments(id) on delete set null,
  brief text,
  designer_notes text,
  delivery_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  delivered_at timestamptz,
  closed_at timestamptz
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_order_number on public.orders(order_number);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  sender_id uuid references public.users(id) on delete cascade,
  sender_role text default 'client' check (sender_role in ('client','designer')),
  text text not null,
  attachment_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_messages_order_id on public.messages(order_id);
create index if not exists idx_messages_created_at on public.messages(created_at);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  body text,
  type text default 'info' check (type in ('info','order_update','payment','message')),
  is_read boolean default false,
  related_order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_unread on public.notifications(user_id, is_read);

alter table public.users enable row level security;
alter table public.payments enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.services enable row level security;

drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile" on public.users for select using (auth.uid()::text = id::text);

drop policy if exists "Users can view own payments" on public.payments;
create policy "Users can view own payments" on public.payments for select using (auth.uid()::text = user_id::text);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders for select using (auth.uid()::text = user_id::text);

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders" on public.orders for insert with check (auth.uid()::text = user_id::text);

drop policy if exists "Users can view order messages" on public.messages;
create policy "Users can view order messages" on public.messages for select using (
  exists (select 1 from public.orders o where o.id = messages.order_id and o.user_id::text = auth.uid()::text)
);

drop policy if exists "Users can send order messages" on public.messages;
create policy "Users can send order messages" on public.messages for insert with check (
  exists (select 1 from public.orders o where o.id = messages.order_id and o.user_id::text = auth.uid()::text)
);

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid()::text = user_id::text);

drop policy if exists "Everyone can view active services" on public.services;
create policy "Everyone can view active services" on public.services for select using (is_active = true);

drop policy if exists "Admin full access orders" on public.orders;
create policy "Admin full access orders" on public.orders for all using (
  exists (select 1 from public.users where public.users.id::text = auth.uid()::text and public.users.is_admin = true)
);

drop policy if exists "Admin view all messages" on public.messages;
create policy "Admin view all messages" on public.messages for select using (
  exists (select 1 from public.users where public.users.id::text = auth.uid()::text and public.users.is_admin = true)
);

drop policy if exists "Admin send messages" on public.messages;
create policy "Admin send messages" on public.messages for insert with check (
  exists (select 1 from public.users where public.users.id::text = auth.uid()::text and public.users.is_admin = true)
);

drop policy if exists "Admin view all payments" on public.payments;
create policy "Admin view all payments" on public.payments for select using (
  exists (select 1 from public.users where public.users.id::text = auth.uid()::text and public.users.is_admin = true)
);

drop policy if exists "Admin update payments" on public.payments;
create policy "Admin update payments" on public.payments for update using (
  exists (select 1 from public.users where public.users.id::text = auth.uid()::text and public.users.is_admin = true)
);

drop policy if exists "Admin view all users" on public.users;
create policy "Admin view all users" on public.users for select using (
  exists (select 1 from public.users where public.users.id::text = auth.uid()::text and public.users.is_admin = true)
);

drop policy if exists "Admin update users" on public.users;
create policy "Admin update users" on public.users for update using (
  exists (select 1 from public.users where public.users.id::text = auth.uid()::text and public.users.is_admin = true)
);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at before update on public.users for each row execute function public.update_updated_at_column();

drop trigger if exists update_payments_updated_at on public.payments;
create trigger update_payments_updated_at before update on public.payments for each row execute function public.update_updated_at_column();

drop trigger if exists update_orders_updated_at on public.orders;
create trigger update_orders_updated_at before update on public.orders for each row execute function public.update_updated_at_column();

create or replace function public.generate_order_number()
returns trigger as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'RD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_order_number on public.orders;
create trigger set_order_number before insert on public.orders for each row execute function public.generate_order_number();
