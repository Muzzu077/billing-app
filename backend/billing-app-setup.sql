-- =====================================================
-- COMPLETE SUPABASE SETUP FOR BILLING APP
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- This creates everything needed for bill saving

-- =====================================================
-- 1. CREATE ALL TABLES
-- =====================================================

-- Drop existing tables if they exist (this will delete all data)
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Create admins table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  price_multiplier DECIMAL(5,2) DEFAULT 1.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brands table
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'piece',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotations table (with EXACT column names frontend expects)
CREATE TABLE quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand VARCHAR(255) NOT NULL,
  customerName VARCHAR(255) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  products JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  gst DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  paid BOOLEAN DEFAULT false,
  terms JSONB DEFAULT '{
    "taxes": "Including taxes @18%",
    "validity": "Validity only 3 days",
    "supply": "Material Supply 7 working Days"
  }'::jsonb,
  contactInfo JSONB DEFAULT '{
    "name": "T THRINATH REDDY (Deputy Manager)",
    "phone": "8125237316"
  }'::jsonb,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE SECURITY POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on admins" ON admins;
DROP POLICY IF EXISTS "Allow all operations on brands" ON brands;
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
DROP POLICY IF EXISTS "Allow all operations on quotations" ON quotations;

-- Create new policies
CREATE POLICY "Allow all operations on admins" ON admins FOR ALL USING (true);
CREATE POLICY "Allow all operations on brands" ON brands FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on quotations" ON quotations FOR ALL USING (true);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(createdAt);
CREATE INDEX IF NOT EXISTS idx_quotations_brand ON quotations(brand);
CREATE INDEX IF NOT EXISTS idx_quotations_customer_name ON quotations(customerName);

-- =====================================================
-- 5. INSERT SAMPLE DATA
-- =====================================================

-- bcrypt hash generated with bcryptjs.genSalt(10) for the password 'Afaanreyo'
INSERT INTO admins (username, password, display_name, price_multiplier) VALUES 
('AyeshaEle', '$2a$10$KM0wmvcdUtnt9u4R44uO1ebXburzT7XIOYvnIuau9N4leihyuftY6', 'Ayesha Electrical', 1.00);

-- Insert sample brands
INSERT INTO brands (name, logo_url) VALUES 
('Havells', 'https://example.com/havells-logo.png'),
('Crompton', 'https://example.com/crompton-logo.png'),
('Philips', 'https://example.com/philips-logo.png'),
('Osram', 'https://example.com/osram-logo.png'),
('Bajaj', 'https://example.com/bajaj-logo.png');

-- Insert sample products
INSERT INTO products (brand_id, name, description, price, unit) VALUES 
((SELECT id FROM brands WHERE name = 'Havells'), 'LED Bulb 9W', 'Energy efficient LED bulb', 150.00, 'piece'),
((SELECT id FROM brands WHERE name = 'Havells'), 'LED Tube 18W', 'T8 LED tube light', 450.00, 'piece'),
((SELECT id FROM brands WHERE name = 'Crompton'), 'LED Bulb 12W', 'Bright LED bulb', 180.00, 'piece'),
((SELECT id FROM brands WHERE name = 'Crompton'), 'LED Panel 24W', 'Square LED panel', 800.00, 'piece'),
((SELECT id FROM brands WHERE name = 'Philips'), 'LED Bulb 10W', 'Philips LED bulb', 200.00, 'piece'),
((SELECT id FROM brands WHERE name = 'Osram'), 'LED Bulb 8W', 'Osram LED bulb', 120.00, 'piece'),
((SELECT id FROM brands WHERE name = 'Bajaj'), 'LED Bulb 15W', 'Bajaj LED bulb', 250.00, 'piece');

-- =====================================================
-- 6. REFRESH SCHEMA CACHE
-- =====================================================

NOTIFY pgrst, 'reload schema';

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

-- Check all tables were created
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Check quotations table columns (should match frontend expectations)
SELECT 'Quotations table columns:' as status;
SELECT column_name FROM information_schema.columns WHERE table_name = 'quotations' ORDER BY ordinal_position;

-- Check admin user exists
SELECT 'Admin user:' as status;
SELECT username, display_name FROM admins;

-- Check sample data
SELECT 'Sample brands:' as status;
SELECT name FROM brands;

SELECT 'Sample products:' as status;
SELECT p.name, b.name as brand_name FROM products p JOIN brands b ON p.brand_id = b.id LIMIT 5;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT '🎉 COMPLETE SETUP FINISHED! Your billing app is ready to save bills!' as status;