-- Create menu table for admin dashboard
CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample menu data
INSERT INTO menu (name, description, price, image_url) VALUES
('تيشيرت كلاسيكي', 'تيشيرت قطني عالي الجودة بتصميم كلاسيكي', 45.00, '/placeholder.svg?height=200&width=200'),
('تيشيرت رياضي', 'تيشيرت رياضي مناسب للتمارين والأنشطة', 55.00, '/placeholder.svg?height=200&width=200'),
('تيشيرت مطبوع', 'تيشيرت بطباعة عالية الجودة وتصميم مميز', 65.00, '/placeholder.svg?height=200&width=200'),
('تيشيرت بولو', 'تيشيرت بولو أنيق للمناسبات الرسمية', 75.00, '/placeholder.svg?height=200&width=200');

-- Enable Row Level Security
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON menu
  FOR ALL USING (auth.role() = 'authenticated');
