-- =====================================================
-- STORAGE BUCKET SETUP FOR STUDY MATERIALS
-- =====================================================
-- This migration ONLY creates the storage bucket and policies.
-- Run this if you've already created the tables but uploads are failing.

-- Create storage bucket for study materials (safe to run multiple times)
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE RLS POLICIES
-- =====================================================

-- Drop existing policies if they exist (to ensure clean state)
DROP POLICY IF EXISTS "Users can upload their own study materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own study materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own study materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own study materials" ON storage.objects;

-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own study materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'study-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own files
CREATE POLICY "Users can view their own study materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'study-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own study materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'study-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own study materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'study-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- VERIFICATION QUERY (Optional - run separately)
-- =====================================================
-- Run this to verify the bucket and policies are created:
--
-- SELECT * FROM storage.buckets WHERE id = 'study-materials';
--
-- SELECT policyname
-- FROM pg_policies
-- WHERE tablename = 'objects'
-- AND schemaname = 'storage'
-- AND policyname LIKE '%study materials%';
