-- Create products table with proper structure
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  image TEXT,
  sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  colors TEXT[] DEFAULT ARRAY['أبيض', 'أسود'],
  print_types TEXT[] DEFAULT ARRAY['طباعة عادية'],
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  is_best_seller BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for products (allow public read access, admin write access)
CREATE POLICY "products_select_public" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_admin" ON public.products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "products_update_admin" ON public.products
  FOR UPDATE USING (true);

CREATE POLICY "products_delete_admin" ON public.products
  FOR DELETE USING (true);

-- Create policies for categories (allow public read access, admin write access)
CREATE POLICY "categories_select_public" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "categories_insert_admin" ON public.categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "categories_update_admin" ON public.categories
  FOR UPDATE USING (true);

CREATE POLICY "categories_delete_admin" ON public.categories
  FOR DELETE USING (true);

-- Insert some default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('تصاميم سعودية', 'saudi-designs', 'تصاميم مستوحاة من التراث السعودي'),
  ('تصاميم عصرية', 'modern-trendy', 'تصاميم عصرية وأنيقة'),
  ('تصاميم أنمي', 'anime-designs', 'تصاميم مستوحاة من الأنمي'),
  ('تصاميم المناسبات', 'special-occasions', 'تصاميم للمناسبات الخاصة'),
  ('تصاميم قوة ورياضة', 'sports-fitness', 'تصاميم رياضية وقوة')
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
