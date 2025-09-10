-- Create products table with proper RLS policies for public read access
-- Drop existing table if it exists
DROP TABLE IF EXISTS public.products CASCADE;

-- Create products table
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

-- Create policy for public read access (no authentication required)
CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_new ON public.products(is_new);
CREATE INDEX idx_products_best_seller ON public.products(is_best_seller);
CREATE INDEX idx_products_on_sale ON public.products(is_on_sale);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);

-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, category, image, is_featured, is_new, is_best_seller, is_on_sale) VALUES
('تيشيرت تصميم سعودي', 'تيشيرت بتصميم سعودي مميز', 75.00, 100.00, 'تصاميم وطنية', '/placeholder.svg?height=400&width=400', true, true, false, true),
('تيشيرت أنمي كلاسيكي', 'تصميم أنمي كلاسيكي عالي الجودة', 65.00, 80.00, 'تصاميم أنمي', '/placeholder.svg?height=400&width=400', false, true, true, false),
('تيشيرت رياضي', 'تصميم رياضي للتمارين والأنشطة', 55.00, 70.00, 'تصاميم قوة ورياضة', '/placeholder.svg?height=400&width=400', true, false, true, true);
