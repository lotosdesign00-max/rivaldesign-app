-- ═══════════════════════════════════════════════════════════════════════════
-- RIVAL DESIGN — Supabase Database Schema
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── USERS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);

-- ─── SERVICES (услуги дизайнера) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PAYMENTS (история платежей) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'canceled', 'refunded')),
  crypto_invoice_id TEXT,
  crypto_pay_url TEXT,
  payment_method TEXT DEFAULT 'cryptobot',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ─── ORDERS (заказы) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'waiting_payment' CHECK (status IN (
    'waiting_payment',
    'payment_review',
    'queued',
    'in_progress',
    'preview_sent',
    'revision',
    'delivered',
    'closed',
    'canceled'
  )),
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  brief TEXT,
  designer_notes TEXT,
  delivery_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- ─── MESSAGES (чат заказ-дизайнер) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_role TEXT DEFAULT 'client' CHECK (sender_role IN ('client', 'designer')),
  text TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_order_id ON messages(order_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ─── NOTIFICATIONS (уведомления) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'order_update', 'payment', 'message')),
  is_read BOOLEAN DEFAULT FALSE,
  related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- User settings: synced Mini App preferences and feature state.
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS POLICIES (Row Level Security) ────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users: can read own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Payments: users can view own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Orders: users can view own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Orders: insert own orders
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Messages: users can view messages for their orders
CREATE POLICY "Users can view order messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o WHERE o.id = messages.order_id AND o.user_id::text = auth.uid()::text
    )
  );

-- Messages: users can send messages to their orders
CREATE POLICY "Users can send order messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o WHERE o.id = messages.order_id AND o.user_id::text = auth.uid()::text
    )
  );

-- Notifications: users can view own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- User settings: users can view and manage own settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Services: everyone can read active services
CREATE POLICY "Everyone can view active services" ON services
  FOR SELECT USING (is_active = TRUE);

-- ─── ADMIN POLICIES (для дизайнера-админа) ────────────────────────────────

-- Admin can do everything on orders
CREATE POLICY "Admin full access orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.is_admin = TRUE)
  );

-- Admin can view all messages
CREATE POLICY "Admin view all messages" ON messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.is_admin = TRUE)
  );

-- Admin can send messages
CREATE POLICY "Admin send messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.is_admin = TRUE)
  );

-- Admin can view all payments
CREATE POLICY "Admin view all payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.is_admin = TRUE)
  );

-- Admin can update payments
CREATE POLICY "Admin update payments" ON payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.is_admin = TRUE)
  );

-- Admin can view all users
CREATE POLICY "Admin view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.is_admin = TRUE)
  );

-- Admin can update users (balance)
CREATE POLICY "Admin update users" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.is_admin = TRUE)
  );

-- Admin can manage all user settings
CREATE POLICY "Admin full access settings" ON user_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.is_admin = TRUE)
  );

-- ─── SEED DATA ─────────────────────────────────────────────────────────────

INSERT INTO services (name, name_en, description, price, image_url, sort_order) VALUES
  ('Логотип', 'Logo Design', 'Уникальный логотип для вашего бренда', 150.00, NULL, 1),
  ('Брендинг', 'Branding', 'Полный фирменный стиль: логотип, цвета, шрифты, гайдлайн', 400.00, NULL, 2),
  ('Социальные сети', 'Social Media Pack', 'Дизайн для Instagram, Telegram, VK — аватар, баннер, шаблоны постов', 120.00, NULL, 3),
  ('Веб-дизайн', 'Web Design', 'Дизайн лендинга или сайта', 300.00, NULL, 4),
  ('Презентация', 'Presentation', 'Дизайн презентации для инвесторов или клиентов', 200.00, NULL, 5),
  ('Баннер / Реклама', 'Banner / Ad', 'Рекламный баннер для любой платформы', 80.00, NULL, 6)
ON CONFLICT DO NOTHING;

-- ─── FUNCTIONS ─────────────────────────────────────────────────────────────

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'RD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
