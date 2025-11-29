-- =====================================================
-- Study Materials Storage Buckets Setup
-- =====================================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('study-materials-videos', 'study-materials-videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/ogg']),
  ('study-materials-documents', 'study-materials-documents', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']),
  ('study-materials-thumbnails', 'study-materials-thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RLS Policies for study-materials-videos bucket
-- =====================================================

-- Allow authenticated users to upload videos to their school folder
CREATE POLICY "School admins can upload videos to own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'study-materials-videos' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Allow public read access to videos (since bucket is public)
CREATE POLICY "Anyone can view videos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'study-materials-videos');

-- Allow school admins to update their own school's videos
CREATE POLICY "School admins can update own videos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'study-materials-videos' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Allow school admins to delete their own school's videos
CREATE POLICY "School admins can delete own videos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'study-materials-videos' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS Policies for study-materials-documents bucket
-- =====================================================

-- Allow authenticated users to upload documents to their school folder
CREATE POLICY "School admins can upload documents to own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'study-materials-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Allow public read access to documents (since bucket is public)
CREATE POLICY "Anyone can view documents"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'study-materials-documents');

-- Allow school admins to update their own school's documents
CREATE POLICY "School admins can update own documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'study-materials-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Allow school admins to delete their own school's documents
CREATE POLICY "School admins can delete own documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'study-materials-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS Policies for study-materials-thumbnails bucket
-- =====================================================

-- Allow authenticated users to upload thumbnails to their school folder
CREATE POLICY "School admins can upload thumbnails to own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'study-materials-thumbnails' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Allow public read access to thumbnails (since bucket is public)
CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'study-materials-thumbnails');

-- Allow school admins to update their own school's thumbnails
CREATE POLICY "School admins can update own thumbnails"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'study-materials-thumbnails' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Allow school admins to delete their own school's thumbnails
CREATE POLICY "School admins can delete own thumbnails"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'study-materials-thumbnails' AND
    (storage.foldername(name))[1] IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );
