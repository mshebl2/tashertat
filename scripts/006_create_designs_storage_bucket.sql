-- Create storage bucket for design uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('designs', 'designs', true);

-- Create RLS policies for the designs bucket
CREATE POLICY "Allow public uploads to designs bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'designs');

CREATE POLICY "Allow public access to designs bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'designs');

CREATE POLICY "Allow public updates to designs bucket" ON storage.objects
FOR UPDATE USING (bucket_id = 'designs');

CREATE POLICY "Allow public deletes from designs bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'designs');
