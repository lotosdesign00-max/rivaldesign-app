-- ==========================================
-- RIVAL DESIGN - Supabase Schema
-- Запусти это в Supabase SQL Editor
-- Dashboard: https://tlzxcghfvgazkzaoawtj.supabase.co
-- ==========================================

-- 1. ГАЛЕРЕЯ (Портфолио)
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  cat TEXT NOT NULL DEFAULT 'Превью',
  title TEXT NOT NULL,
  description TEXT,
  img TEXT,
  tags TEXT[] DEFAULT '{}',
  popular BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. КУРСЫ
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  cat TEXT NOT NULL DEFAULT 'Новый',
  title TEXT NOT NULL,
  description TEXT,
  level TEXT DEFAULT 'Средний',
  duration TEXT DEFAULT '3 ч',
  lessons INTEGER DEFAULT 6,
  img TEXT,
  popular BOOLEAN DEFAULT false,
  free BOOLEAN DEFAULT false,
  price NUMERIC DEFAULT 10,
  rating NUMERIC DEFAULT 5,
  students INTEGER DEFAULT 0,
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. УСЛУГИ
CREATE TABLE IF NOT EXISTS services (
  id BIGINT PRIMARY KEY,
  icon TEXT DEFAULT '✦',
  key TEXT UNIQUE NOT NULL,
  price_usd NUMERIC DEFAULT 10,
  ru TEXT NOT NULL,
  en TEXT,
  ua TEXT,
  kz TEXT,
  by TEXT,
  desc_ru TEXT,
  desc_en TEXT,
  time_ru TEXT DEFAULT '1–2 дня',
  time_en TEXT DEFAULT '1–2 days',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ОТЗЫВЫ
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tg TEXT,
  rating INTEGER DEFAULT 5,
  text TEXT,
  time TEXT DEFAULT 'сегодня',
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FAQ
CREATE TABLE IF NOT EXISTS faq (
  id SERIAL PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ГЛАВНАЯ - СТАТИСТИКА
CREATE TABLE IF NOT EXISTS home_stats (
  id SERIAL PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '0',
  label_ru TEXT NOT NULL,
  label_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ГЛАВНАЯ - СОЦСЕТИ
CREATE TABLE IF NOT EXISTS home_socials (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'telegram',
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  accent TEXT DEFAULT '#229ED9',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- RLS (Row Level Security) - публичное чтение
-- ==========================================

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_socials ENABLE ROW LEVEL SECURITY;

-- Публичное чтение (для основного приложения с anon ключом)
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read access" ON faq FOR SELECT USING (true);
CREATE POLICY "Public read access" ON home_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON home_socials FOR SELECT USING (true);

-- Запись только через service_role (админка/сервер)
CREATE POLICY "Service role full access" ON gallery FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON courses FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON services FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON reviews FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON faq FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON home_stats FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON home_socials FOR ALL USING (auth.role() = 'service_role');

-- ==========================================
-- ИНДЕКСЫ для скорости
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_gallery_popular ON gallery (popular DESC, views DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_cat ON gallery (cat);
CREATE INDEX IF NOT EXISTS idx_courses_popular ON courses (popular DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating DESC);

-- ==========================================
-- ФУНКЦИЯ обновления updated_at
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
