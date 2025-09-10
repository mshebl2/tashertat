-- Create the designs storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('designs', 'designs', true);

-- Set up RLS policies for the designs bucket
CREATE POLICY "Allow anyone to upload files to designs bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'designs');

CREATE POLICY "Allow anyone to view files in designs bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'designs');

CREATE POLICY "Allow anyone to delete files in designs bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'designs');

-- Grant necessary permissions
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO anon;
