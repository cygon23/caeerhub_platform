-- =====================================================
-- Study Materials Table & Storage Setup
-- =====================================================

-- Create study_materials table
CREATE TABLE IF NOT EXISTS public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT NOT NULL REFERENCES public.school_registrations(registration_number) ON DELETE CASCADE,

  -- Material info
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'document', 'link')),

  -- Classification
  subject TEXT NOT NULL,
  form_level INTEGER NOT NULL CHECK (form_level BETWEEN 1 AND 6),
  category TEXT, -- e.g., 'lesson', 'assignment', 'reference'

  -- File/Link info
  file_url TEXT, -- Supabase storage path or external URL
  thumbnail_url TEXT, -- Thumbnail image
  file_size BIGINT, -- Size in bytes
  mime_type TEXT, -- e.g., 'video/mp4', 'application/pdf'

  -- Video-specific
  duration INTEGER, -- Duration in seconds
  video_source TEXT CHECK (video_source IN ('upload', 'youtube', 'vimeo', 'external')),

  -- Metadata
  tags TEXT[], -- Array of tags
  views_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Indexes
  CONSTRAINT valid_file_url CHECK (file_url IS NOT NULL)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_materials_school_id ON public.study_materials(school_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_type ON public.study_materials(type);
CREATE INDEX IF NOT EXISTS idx_study_materials_subject ON public.study_materials(subject);
CREATE INDEX IF NOT EXISTS idx_study_materials_form_level ON public.study_materials(form_level);
CREATE INDEX IF NOT EXISTS idx_study_materials_created_at ON public.study_materials(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: School admins can view their own school's materials
CREATE POLICY "School admins can view own materials"
  ON public.study_materials
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Policy: School admins can insert materials for their school
CREATE POLICY "School admins can insert materials"
  ON public.study_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    school_id IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Policy: School admins can update their own school's materials
CREATE POLICY "School admins can update own materials"
  ON public.study_materials
  FOR UPDATE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    school_id IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Policy: School admins can delete their own school's materials
CREATE POLICY "School admins can delete own materials"
  ON public.study_materials
  FOR DELETE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- Storage Buckets Setup
-- =====================================================

-- Create storage buckets (run these in Supabase dashboard or via SQL)
-- Note: These need to be created via Supabase dashboard or API
-- The buckets are:
-- 1. study-materials-videos
-- 2. study-materials-documents
-- 3. study-materials-thumbnails

-- Storage RLS Policies (apply after creating buckets)

-- Allow authenticated users to upload to their school's folder
-- Example policy for videos bucket:
-- CREATE POLICY "School admins can upload videos"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     bucket_id = 'study-materials-videos' AND
--     (storage.foldername(name))[1] IN (
--       SELECT school_id FROM profiles WHERE user_id = auth.uid()
--     )
--   );

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_study_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_study_materials_timestamp
  BEFORE UPDATE ON public.study_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_study_materials_updated_at();

-- =====================================================
-- Sample Data (optional - remove in production)
-- =====================================================

COMMENT ON TABLE public.study_materials IS 'Stores educational materials (videos, documents, links) for schools';
COMMENT ON COLUMN public.study_materials.type IS 'Type of material: video, document, or link';
COMMENT ON COLUMN public.study_materials.video_source IS 'Source of video: upload, youtube, vimeo, or external';
COMMENT ON COLUMN public.study_materials.file_size IS 'File size in bytes (max 50MB for documents)';
