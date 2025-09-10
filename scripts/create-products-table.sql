-- Create products table in Supabase
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  sizes TEXT[], -- Array of sizes
  colors TEXT[], -- Array of colors
  print_types TEXT[], -- Array of print types
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  sale_percentage INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug) VALUES
('تصاميم وطنية', 'national-designs'),
('تصاميم قوة ورياضة', 'sports-fitness'),
('تصاميم أنمي', 'anime-designs'),
('تصاميم المناسبات', 'special-occasions'),
('تصاميم عصرية', 'modern-trendy'),
('تصاميم حسب الطلب', 'custom-designs')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage data
CREATE POLICY "Allow authenticated users to manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
