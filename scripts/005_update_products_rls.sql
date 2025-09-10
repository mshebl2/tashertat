-- Update RLS policies to ensure service role can bypass them
-- First, check if RLS is enabled and what policies exist
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

-- Show existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

-- Disable RLS temporarily to test if that's the issue
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with updated policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to view products" ON products;
DROP POLICY IF EXISTS "Allow admin users to manage products" ON products;

-- Create new policies that work with service role
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow service role full access to products" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON products TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
