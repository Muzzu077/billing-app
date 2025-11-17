-- =====================================================
-- COMPLETE SUPABASE SETUP FOR BILLING APP
-- =====================================================
-- Run this entire script inside the Supabase SQL editor.
-- It replaces every MongoDB artifact with a Supabase-native schema.

-- =====================================================
-- 1. TABLES
-- =====================================================
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  price_multiplier NUMERIC(8,2) DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  tagline TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  list_price NUMERIC(12,2) NOT NULL,
  coil_price NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  customername TEXT NOT NULL,
  date DATE DEFAULT current_date,
  products JSONB NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  gst NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  paid BOOLEAN DEFAULT false,
  terms JSONB DEFAULT '{
    "taxes": "Including taxes @18%",
    "validity": "Validity only 3 days",
    "supply": "Material Supply 7 working Days"
  }'::jsonb,
  contactinfo JSONB DEFAULT '{
    "name": "T THRINATH REDDY (Deputy Manager)",
    "phone": "8125237316"
  }'::jsonb,
  createdat TIMESTAMPTZ DEFAULT now(),
  updatedat TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 2. ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on admins" ON admins;
DROP POLICY IF EXISTS "Allow all operations on brands" ON brands;
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
DROP POLICY IF EXISTS "Allow all operations on quotations" ON quotations;

CREATE POLICY "Allow all operations on admins" ON admins FOR ALL USING (true);
CREATE POLICY "Allow all operations on brands" ON brands FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on quotations" ON quotations FOR ALL USING (true);

-- =====================================================
-- 3. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_description ON products(description);
CREATE INDEX IF NOT EXISTS idx_quotations_created ON quotations(createdat);
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON quotations(customername);

-- =====================================================
-- 4. SEED DATA
-- =====================================================
INSERT INTO admins (username, password, display_name, price_multiplier)
VALUES ('AyeshaEle', '$2a$10$KM0wmvcdUtnt9u4R44uO1ebXburzT7XIOYvnIuau9N4leihyuftY6', 'Ayesha Electrical', 1.00);

INSERT INTO brands (name, logo, tagline, category) VALUES
('Havells', 'https://example.com/logos/havells.png', 'Powering lives', 'HR-FR'),
('Finolex', 'https://example.com/logos/finolex.png', 'Trusted for generations', 'FR-LSZH'),
('GM', 'https://example.com/logos/gm.png', 'Quality wires', 'HR-FR'),
('Polycab', 'https://example.com/logos/polycab.png', 'Trusted by millions', 'HR-FR'),
('Goldmedal', 'https://example.com/logos/goldmedal.png', 'Excellence in wiring', 'HR-FR');

INSERT INTO products (brand_id, description, list_price, coil_price)
SELECT id, '1.0 Sqmm 90 Mtrs', 2010, 1328 FROM brands WHERE name = 'Havells'
UNION ALL SELECT id, '1.5 Sqmm 90 Mtrs', 3020, 1996 FROM brands WHERE name = 'Havells'
UNION ALL SELECT id, '2.5 Sqmm 90 Mtrs', 4695, 3102 FROM brands WHERE name = 'Finolex'
UNION ALL SELECT id, '4.0 Sqmm 90 Mtrs', 6875, 4543 FROM brands WHERE name = 'Finolex'
UNION ALL SELECT id, '6.0 Sqmm 90 Mtrs', 10250, 6780 FROM brands WHERE name = 'GM'
UNION ALL SELECT id, '10.0 Sqmm 90 Mtrs', 16800, 11100 FROM brands WHERE name = 'Polycab';

-- =====================================================
-- 5. REFRESH + VERIFY
-- =====================================================
NOTIFY pgrst, 'reload schema';

SELECT 'Tables' AS label, array_agg(table_name ORDER BY table_name) AS values
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('admins','brands','products','quotations');

SELECT 'Quotations columns' AS label, array_agg(column_name ORDER BY ordinal_position) AS values
FROM information_schema.columns
WHERE table_name = 'quotations';

SELECT 'Seed counts' AS label,
       (SELECT count(*) FROM admins) AS admins,
       (SELECT count(*) FROM brands) AS brands,
       (SELECT count(*) FROM products) AS products;

SELECT '🎉 COMPLETE SETUP FINISHED! Your billing app is ready to save bills!' AS status;

