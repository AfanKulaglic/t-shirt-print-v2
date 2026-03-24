-- ============================================================
-- Shirt Shop — Database Migration
-- Run this manually against your new Supabase project.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- app_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_secure BOOLEAN DEFAULT true,
  smtp_user TEXT,
  smtp_pass TEXT,
  smtp_from TEXT,
  order_notify_emails TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(10,2),
  cost_price NUMERIC(10,2),
  sku TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_personalizable BOOLEAN DEFAULT false,
  model_path TEXT,
  zoom_header NUMERIC DEFAULT 3,
  zoom_card NUMERIC DEFAULT 2,
  zoom_editor NUMERIC DEFAULT 3,
  default_color TEXT DEFAULT '#ffffff',
  variants JSONB DEFAULT '[]',
  stock_quantity INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','printing','quality_check','shipped','delivered','cancelled','refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_method TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_name TEXT,
  shipping_address JSONB,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  coupon_id UUID,
  notes TEXT,
  internal_notes TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  company_name TEXT,
  company_id TEXT,
  pdv_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  variant JSONB,
  is_personalized BOOLEAN DEFAULT false,
  customization_data JSONB,
  design_preview_url TEXT,
  model_render_url TEXT,
  design_images TEXT[] DEFAULT '{}',
  model_path TEXT,
  design_code TEXT,
  editor_type TEXT DEFAULT '3d',
  personalization_data JSONB,
  model_render_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- order_status_history
-- ============================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  changed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- coupons
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage','fixed')),
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_order_amount NUMERIC(10,2),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- saved_designs
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  session_id TEXT,
  design_data JSONB NOT NULL,
  preview_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_saved_designs_code ON saved_designs(code);
CREATE INDEX IF NOT EXISTS idx_saved_designs_session_id ON saved_designs(session_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- ============================================================
-- Seed: shirt category
-- ============================================================
INSERT INTO categories (name, slug, description, sort_order, is_active)
VALUES ('Majice', 'majice', 'Personalizirane majice', 1, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Seed: shirt product (personalizable, with 3D model)
-- ============================================================
INSERT INTO products (
  name, slug, description, short_description,
  price, category_id, status, is_featured,
  is_personalizable, model_path,
  zoom_header, zoom_card, zoom_editor,
  default_color, tags, sort_order
)
SELECT
  'Majica',
  'majica',
  'Personalizirana majica sa tvojim dizajnom. Dodaj slike, tekst i odaberi boju.',
  'Personalizirana majica',
  25.00,
  c.id,
  'active',
  true,
  true,
  '/shirt/scene.gltf',
  5.5,
  2,
  3,
  '#ffffff',
  ARRAY['majica','personalizacija','3d'],
  1
FROM categories c
WHERE c.slug = 'majice'
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Seed: default app_settings row (empty SMTP — uses .env fallback)
-- ============================================================
INSERT INTO app_settings (smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass, smtp_from, order_notify_emails)
VALUES (NULL, NULL, NULL, NULL, NULL, NULL, '{}')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Storage bucket (run in Supabase dashboard or via API)
-- Supabase SQL cannot create storage buckets directly.
-- Create a PUBLIC bucket named "3dmodel" in the Supabase dashboard:
--   Storage → New Bucket → Name: 3dmodel → Public: ON
-- ============================================================
