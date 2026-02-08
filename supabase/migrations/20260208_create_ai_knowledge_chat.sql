-- Migration: AI Knowledge Chat System
-- Created: 2026-02-08
-- Description: Creates tables for AI-powered knowledge chat with history and file uploads

-- ============================================
-- 1. AI Chat Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session metadata
  title text NOT NULL DEFAULT 'New Chat',
  category text, -- ICT Skills, Business & Entrepreneurship, etc.

  -- Session stats
  message_count integer DEFAULT 0,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),

  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_updated_at ON public.ai_chat_sessions(updated_at DESC);

COMMENT ON TABLE public.ai_chat_sessions IS 'Stores AI chat sessions for knowledge assistant';

-- ============================================
-- 2. AI Chat Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Message content
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,

  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at timestamptz DEFAULT now(),

  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id ON public.ai_chat_messages(user_id);

COMMENT ON TABLE public.ai_chat_messages IS 'Stores individual messages within AI chat sessions';

-- ============================================
-- 3. AI Knowledge Uploads Table (for tracking daily limits)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_knowledge_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.ai_chat_sessions(id) ON DELETE SET NULL,

  -- File metadata
  file_name text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('pdf', 'image')),
  file_size bigint NOT NULL,
  storage_path text NOT NULL,

  -- Processing status
  status text NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'failed')),

  -- Extracted content (for RAG)
  extracted_text text,

  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,

  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_uploads_user_id ON public.ai_knowledge_uploads(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_uploads_session_id ON public.ai_knowledge_uploads(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_uploads_created_date ON public.ai_knowledge_uploads(user_id, DATE(created_at));

COMMENT ON TABLE public.ai_knowledge_uploads IS 'Tracks file uploads for AI knowledge chat with daily limits';

-- ============================================
-- 4. Function to check daily upload limits
-- ============================================
CREATE OR REPLACE FUNCTION public.check_daily_upload_limit(
  p_user_id uuid,
  p_file_type text
)
RETURNS TABLE (
  can_upload boolean,
  count_today integer,
  limit_per_day integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
  v_limit integer := 2; -- 2 files per day per type
BEGIN
  -- Count uploads today for this file type
  SELECT COUNT(*)
  INTO v_count
  FROM ai_knowledge_uploads
  WHERE user_id = p_user_id
    AND file_type = p_file_type
    AND DATE(created_at) = CURRENT_DATE;

  RETURN QUERY SELECT
    (v_count < v_limit) as can_upload,
    v_count as count_today,
    v_limit as limit_per_day;
END;
$$;

COMMENT ON FUNCTION public.check_daily_upload_limit IS 'Checks if user can upload more files today';

-- ============================================
-- 5. Function to update session on new message
-- ============================================
CREATE OR REPLACE FUNCTION public.update_chat_session_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE ai_chat_sessions
  SET
    message_count = message_count + 1,
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at
  WHERE id = NEW.session_id;

  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_session_on_message ON public.ai_chat_messages;
CREATE TRIGGER trigger_update_session_on_message
  AFTER INSERT ON public.ai_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_session_on_message();

-- ============================================
-- 6. Auto-update timestamps trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.update_ai_chat_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ai_chat_sessions_updated_at ON public.ai_chat_sessions;
CREATE TRIGGER ai_chat_sessions_updated_at
  BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_chat_updated_at();

-- ============================================
-- 7. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_knowledge_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_chat_sessions
DROP POLICY IF EXISTS "Users can view own chat sessions" ON public.ai_chat_sessions;
CREATE POLICY "Users can view own chat sessions" ON public.ai_chat_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own chat sessions" ON public.ai_chat_sessions;
CREATE POLICY "Users can insert own chat sessions" ON public.ai_chat_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own chat sessions" ON public.ai_chat_sessions;
CREATE POLICY "Users can update own chat sessions" ON public.ai_chat_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own chat sessions" ON public.ai_chat_sessions;
CREATE POLICY "Users can delete own chat sessions" ON public.ai_chat_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_chat_messages
DROP POLICY IF EXISTS "Users can view own chat messages" ON public.ai_chat_messages;
CREATE POLICY "Users can view own chat messages" ON public.ai_chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own chat messages" ON public.ai_chat_messages;
CREATE POLICY "Users can insert own chat messages" ON public.ai_chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_knowledge_uploads
DROP POLICY IF EXISTS "Users can view own uploads" ON public.ai_knowledge_uploads;
CREATE POLICY "Users can view own uploads" ON public.ai_knowledge_uploads
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own uploads" ON public.ai_knowledge_uploads;
CREATE POLICY "Users can insert own uploads" ON public.ai_knowledge_uploads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own uploads" ON public.ai_knowledge_uploads;
CREATE POLICY "Users can delete own uploads" ON public.ai_knowledge_uploads
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 8. Grant necessary permissions
-- ============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_chat_sessions TO authenticated;
GRANT SELECT, INSERT ON public.ai_chat_messages TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.ai_knowledge_uploads TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_daily_upload_limit TO authenticated;

-- ============================================
-- Complete
-- ============================================
