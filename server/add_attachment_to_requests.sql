-- 1. Add column to requests table
ALTER TABLE public.requests 
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- 2. Create storage bucket for solicitudes if it doesn't exist
-- Note: Supabase storage buckets are managed via the storage schema
INSERT INTO storage.buckets (id, name, public)
VALUES ('solicitudes', 'solicitudes', true)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS Policies for the new bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'solicitudes');

-- Allow users to view their own uploaded files
CREATE POLICY "Allow individual read access"
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'solicitudes' AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() = owner));

-- Allow admins/managers to view all solicitudes files
-- (This assumes users are organized by their ID as the first part of the path, e.g. 'solicitudes/{user_id}/file.pdf')
CREATE POLICY "Allow admin read access"
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'solicitudes' AND (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
));
