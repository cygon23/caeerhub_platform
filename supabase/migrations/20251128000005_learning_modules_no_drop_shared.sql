-- Learning Modules Migration - Doesn't drop shared functions
-- Safe migration that won't affect existing triggers

-- ============================================
-- PART 1: DROP TABLES (CASCADE will drop policies)
-- ============================================

DROP TABLE IF EXISTS public.user_learning_preferences CASCADE;
DROP TABLE IF EXISTS public.user_module_progress CASCADE;
DROP TABLE IF EXISTS public.learning_modules CASCADE;

-- ============================================
-- PART 2: DROP ONLY LEARNING MODULE SPECIFIC FUNCTIONS
-- ============================================

DROP FUNCTION IF EXISTS increment_module_views(UUID);
DROP FUNCTION IF EXISTS enroll_in_module(UUID);
DROP FUNCTION IF EXISTS complete_module(UUID);

-- NOTE: We do NOT drop update_updated_at_column() because it's used by many other tables

-- ============================================
-- PART 3: CREATE TABLES
-- ============================================

CREATE TABLE public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'ICT Skills',
    'Business & Entrepreneurship',
    'Career Development',
    'Soft Skills',
    'Academic Support',
    'Technical Skills',
    'Life Skills',
    'Other'
  )),
  difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'pdf', 'article', 'quiz', 'external_link', 'mixed')),
  video_url TEXT,
  pdf_url TEXT,
  external_link TEXT,
  prerequisites TEXT[],
  learning_objectives TEXT[],
  target_audience TEXT[] DEFAULT ARRAY['youth'],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  views_count INTEGER DEFAULT 0,
  enrollments_count INTEGER DEFAULT 0,
  completions_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

CREATE TABLE public.user_learning_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_topics TEXT[],
  learning_goals TEXT[],
  skill_gaps TEXT[],
  preferred_difficulty TEXT DEFAULT 'beginner' CHECK (preferred_difficulty IN ('beginner', 'intermediate', 'advanced')),
  preferred_categories TEXT[],
  conversation_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 4: CREATE INDEXES
-- ============================================

CREATE INDEX idx_learning_modules_category ON public.learning_modules(category);
CREATE INDEX idx_learning_modules_status ON public.learning_modules(status);
CREATE INDEX idx_learning_modules_difficulty ON public.learning_modules(difficulty_level);
CREATE INDEX idx_learning_modules_created_at ON public.learning_modules(created_at DESC);

CREATE INDEX idx_user_module_progress_user ON public.user_module_progress(user_id);
CREATE INDEX idx_user_module_progress_module ON public.user_module_progress(module_id);
CREATE INDEX idx_user_module_progress_status ON public.user_module_progress(status);

CREATE INDEX idx_user_learning_preferences_user ON public.user_learning_preferences(user_id);

-- ============================================
-- PART 5: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 6: CREATE RLS POLICIES
-- ============================================

CREATE POLICY "Anyone can view published modules"
  ON public.learning_modules
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage all modules"
  ON public.learning_modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Users can view own progress"
  ON public.user_module_progress
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own progress"
  ON public.user_module_progress
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON public.user_module_progress
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress"
  ON public.user_module_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Users can manage own preferences"
  ON public.user_learning_preferences
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all preferences"
  ON public.user_learning_preferences
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- PART 7: CREATE/UPDATE FUNCTIONS
-- ============================================

-- Create or update the shared function (won't affect existing triggers)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create learning module specific functions
CREATE OR REPLACE FUNCTION increment_module_views(module_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.learning_modules
  SET views_count = views_count + 1
  WHERE id = module_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION enroll_in_module(p_module_id UUID)
RETURNS UUID AS $$
DECLARE
  v_progress_id UUID;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  INSERT INTO public.user_module_progress (user_id, module_id, status, started_at, last_accessed_at)
  VALUES (v_user_id, p_module_id, 'in_progress', NOW(), NOW())
  ON CONFLICT (user_id, module_id)
  DO UPDATE SET
    status = CASE
      WHEN user_module_progress.status = 'not_started' THEN 'in_progress'
      ELSE user_module_progress.status
    END,
    started_at = COALESCE(user_module_progress.started_at, NOW()),
    last_accessed_at = NOW()
  RETURNING id INTO v_progress_id;

  UPDATE public.learning_modules
  SET enrollments_count = enrollments_count + 1
  WHERE id = p_module_id
  AND NOT EXISTS (
    SELECT 1 FROM public.user_module_progress
    WHERE user_id = v_user_id
    AND module_id = p_module_id
    AND created_at < NOW() - INTERVAL '1 second'
  );

  RETURN v_progress_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION complete_module(p_module_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  UPDATE public.user_module_progress
  SET
    status = 'completed',
    progress_percentage = 100,
    completed_at = NOW(),
    last_accessed_at = NOW()
  WHERE user_id = v_user_id AND module_id = p_module_id;

  UPDATE public.learning_modules
  SET completions_count = completions_count + 1
  WHERE id = p_module_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 8: CREATE TRIGGERS
-- ============================================

CREATE TRIGGER update_learning_modules_updated_at
  BEFORE UPDATE ON public.learning_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_module_progress_updated_at
  BEFORE UPDATE ON public.user_module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_learning_preferences_updated_at
  BEFORE UPDATE ON public.user_learning_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 9: INSERT SAMPLE DATA
-- ============================================

INSERT INTO public.learning_modules (
  title,
  description,
  content,
  category,
  difficulty_level,
  duration_minutes,
  content_type,
  video_url,
  learning_objectives,
  target_audience,
  status,
  published_at
) VALUES
(
  'Introduction to Web Development',
  'Learn the basics of HTML, CSS, and JavaScript to build your first website',
  'This comprehensive course covers the fundamentals of web development. You will learn HTML for structure, CSS for styling, and JavaScript for interactivity. By the end, you will be able to create responsive, interactive websites.',
  'ICT Skills',
  'beginner',
  180,
  'video',
  'https://www.youtube.com/watch?v=UB1O30fR-EE',
  ARRAY['Understand HTML structure', 'Style with CSS', 'Add interactivity with JavaScript', 'Build responsive layouts'],
  ARRAY['youth', 'student'],
  'published',
  NOW()
),
(
  'Starting Your Own Business',
  'A complete guide to entrepreneurship for young people in Kenya',
  'Learn how to identify business opportunities, create a business plan, register your business, and manage finances. This module includes real case studies from successful young Kenyan entrepreneurs.',
  'Business & Entrepreneurship',
  'beginner',
  120,
  'article',
  NULL,
  ARRAY['Identify business opportunities', 'Write a business plan', 'Register a business in Kenya', 'Manage business finances'],
  ARRAY['youth'],
  'published',
  NOW()
),
(
  'Effective Communication Skills',
  'Master the art of professional communication in the workplace',
  'Develop essential communication skills including verbal, written, and non-verbal communication. Learn how to give presentations, write professional emails, and handle difficult conversations.',
  'Soft Skills',
  'intermediate',
  90,
  'mixed',
  'https://www.youtube.com/watch?v=HAnw168huqA',
  ARRAY['Improve verbal communication', 'Write professional emails', 'Give effective presentations', 'Handle workplace conflicts'],
  ARRAY['youth', 'student'],
  'published',
  NOW()
),
(
  'CV Writing and Interview Preparation',
  'Get hired with a professional CV and ace your interviews',
  'Learn how to write a compelling CV that gets noticed, prepare for common interview questions, and present yourself professionally. Includes CV templates and mock interview practice.',
  'Career Development',
  'beginner',
  60,
  'article',
  NULL,
  ARRAY['Write an effective CV', 'Prepare for interviews', 'Answer common interview questions', 'Present professionally'],
  ARRAY['youth', 'student'],
  'published',
  NOW()
),
(
  'Microsoft Excel for Data Analysis',
  'Master Excel for business and academic purposes',
  'Learn Excel from basics to advanced features including formulas, pivot tables, charts, and data analysis tools. Perfect for students and young professionals.',
  'ICT Skills',
  'intermediate',
  150,
  'video',
  'https://www.youtube.com/watch?v=Vl0H-qTclOg',
  ARRAY['Use Excel formulas and functions', 'Create pivot tables', 'Visualize data with charts', 'Perform data analysis'],
  ARRAY['youth', 'student'],
  'published',
  NOW()
);

-- ============================================
-- PART 10: ADD COMMENTS
-- ============================================

COMMENT ON TABLE public.learning_modules IS 'Stores learning modules created by admins';
COMMENT ON TABLE public.user_module_progress IS 'Tracks user progress through learning modules';
COMMENT ON TABLE public.user_learning_preferences IS 'Stores user learning preferences for AI personalization';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT
  '✅ Learning modules system created successfully!' as status,
  '📊 Tables: learning_modules, user_module_progress, user_learning_preferences' as tables,
  '🔒 8 RLS policies active' as security,
  '⚡ 3 new functions: enroll_in_module, complete_module, increment_module_views' as functions,
  '📚 5 sample modules ready' as data,
  '✨ Ready to use!' as ready;
