-- Migration: Create Storage Bucket for AI Knowledge Chat
-- Created: 2026-02-08
-- Description: Creates storage bucket for PDF and image uploads

-- ============================================
-- 1. Create Storage Bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ai-knowledge-uploads',
  'ai-knowledge-uploads',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. Storage Policies
-- ============================================

-- Allow authenticated users to upload their own files
DROP POLICY IF EXISTS "Users can upload own knowledge files" ON storage.objects;
CREATE POLICY "Users can upload own knowledge files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ai-knowledge-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own files
DROP POLICY IF EXISTS "Users can view own knowledge files" ON storage.objects;
CREATE POLICY "Users can view own knowledge files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'ai-knowledge-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete own knowledge files" ON storage.objects;
CREATE POLICY "Users can delete own knowledge files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'ai-knowledge-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- Complete
-- ============================================
