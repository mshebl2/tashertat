-- Drop existing products table if it exists and recreate with proper structure
DROP TABLE IF EXISTS public.products CASCADE;

-- Create products table with proper structure
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

-- Create policies for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert" ON public.products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.products
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON public.products
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_new ON public.products(is_new);
CREATE INDEX idx_products_best_seller ON public.products(is_best_seller);
CREATE INDEX idx_products_on_sale ON public.products(is_on_sale);
CREATE INDEX idx_products_created_at ON public.products(created_at);

-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, category, image, is_featured, is_new, is_best_seller, is_on_sale) VALUES
('تيشيرت سعودي كلاسيكي', 'تيشيرت بتصميم سعودي أنيق ومريح', 75.00, 100.00, 'تصاميم وطنية', '/placeholder.svg?height=400&width=400', true, true, true, true),
('تيشيرت أنمي ناروتو', 'تيشيرت بشخصية ناروتو المحبوبة', 65.00, 80.00, 'تصاميم أنمي', '/placeholder.svg?height=400&width=400', true, true, false, true),
('تيشيرت رياضي فتنس', 'تيشيرت رياضي مناسب للتمارين', 55.00, NULL, 'تصاميم قوة ورياضة', '/placeholder.svg?height=400&width=400', false, true, true, false),
('تيشيرت مناسبات خاصة', 'تيشيرت أنيق للمناسبات الخاصة', 85.00, 110.00, 'تصاميم المناسبات', '/placeholder.svg?height=400&width=400', true, false, false, true),
('تيشيرت عصري مودرن', 'تيشيرت بتصميم عصري وألوان جذابة', 70.00, NULL, 'تصاميم عصرية', '/placeholder.svg?height=400&width=400', false, true, true, false);

-- Update the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
