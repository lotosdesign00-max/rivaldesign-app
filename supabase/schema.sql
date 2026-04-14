-- Drop existing constraints or tables if necessary (assuming fresh or additive start)
-- WARNING: For production, use migrations instead of DROP statements. This script uses IF NOT EXISTS where possible.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: settings
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_name TEXT NOT NULL DEFAULT 'Rival Space',
    contact_email TEXT,
    contact_phone TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    branding JSONB DEFAULT '{}'::jsonb,
    seo_defaults JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: homepage_content
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hero_headline TEXT,
    hero_subheadline TEXT,
    hero_cta JSONB DEFAULT '{}'::jsonb,
    about_text TEXT,
    section_titles JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: portfolio_items
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category TEXT,
    tags TEXT[],
    cover_image TEXT,
    gallery_images TEXT[],
    client_name TEXT,
    project_url TEXT,
    completed_at DATE,
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: courses
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_price NUMERIC(10,2),
    cover_image TEXT,
    duration TEXT,
    format TEXT,
    syllabus JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price_from NUMERIC(10,2) NOT NULL DEFAULT 0,
    delivery_time TEXT,
    icon TEXT,
    image TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_role TEXT,
    company TEXT,
    avatar TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    featured BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- NOTE: `users`, `orders`, and `payments` tables might already exist based on legacy app.
-- Extending them if necessary or redefining safely.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  telegram_id BIGINT UNIQUE,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  balance NUMERIC(10,2) DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  crypto_invoice_id TEXT,
  crypto_pay_url TEXT,
  payment_method TEXT DEFAULT 'cryptobot',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  brief TEXT,
  status TEXT DEFAULT 'waiting_payment',
  designer_notes TEXT,
  delivery_url TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('settings', 'homepage_content', 'portfolio_items', 'courses', 'services', 'testimonials', 'users', 'payments', 'orders')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;', t, t);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', t, t);
    END LOOP;
END;
$$;

-- RLS Policies
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
CREATE POLICY "Public can read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public can read homepage content" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Public can read published portfolio items" ON public.portfolio_items FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read published courses" ON public.courses FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read active services" ON public.services FOR SELECT USING (active = true);
CREATE POLICY "Public can read visible testimonials" ON public.testimonials FOR SELECT USING (visible = true);

-- Allow authenticated users to insert/update their own orders/payments (managed via Service Key usually)
CREATE POLICY "Users can read own users data" ON public.users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can read own payments" ON public.payments FOR SELECT USING (auth.uid()::text = user_id::text);

-- Admins overrides (If using Supabase Auth roles)
-- For simplicity, since the serverless functions use SERVICE_ROLE, they bypass RLS.
-- But if using Supabase client directly on the admin dashboard, we need a policy for admins:
-- Assuming admin checks based on users table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  status BOOLEAN;
BEGIN
  -- If using auth.users(), compare ID with users table
  SELECT is_admin INTO status FROM public.users WHERE id::text = auth.uid()::text;
  RETURN COALESCE(status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin full access policies
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('settings', 'homepage_content', 'portfolio_items', 'courses', 'services', 'testimonials', 'users', 'payments', 'orders')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Admins have full access to %I" ON %I;', t, t);
        EXECUTE format('CREATE POLICY "Admins have full access to %I" ON %I FOR ALL USING (public.is_admin());', t, t);
    END LOOP;
END;
$$;
