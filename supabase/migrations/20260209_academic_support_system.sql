-- Migration: AI-Driven Academic Support System
-- Created: 2026-02-09
-- Description: Tables for academic profiles, study groups, assignments, quizzes, and schedules

-- ============================================
-- 1. Academic Profiles (onboarding data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.academic_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Education info
  education_level text NOT NULL,
  -- e.g. 'primary', 'secondary_form4', 'secondary_form6', 'certificate_diploma', 'university_student', 'university_graduate'

  -- Subjects they need help with (JSONB array)
  subjects_need_help jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- e.g. [{"name": "Mathematics", "topics": ["Algebra", "Trigonometry"]}, ...]

  -- What kind of help
  help_types text[] NOT NULL DEFAULT '{}',
  -- e.g. {'understanding_concepts', 'exam_preparation', 'assignment_help', 'study_scheduling', 'finding_groups', 'tutoring'}

  -- Specific struggles (free text)
  specific_struggles text,

  -- AI-generated summary
  ai_profile_summary text,

  -- Timestamps
  onboarding_completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT unique_academic_profile UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_academic_profiles_user ON public.academic_profiles(user_id);

ALTER TABLE public.academic_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own academic profile" ON public.academic_profiles
  FOR ALL USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_profiles TO authenticated;

-- ============================================
-- 2. Study Groups
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name text NOT NULL,
  subject text NOT NULL,
  description text,
  max_members integer NOT NULL DEFAULT 20,
  member_count integer NOT NULL DEFAULT 1,

  -- Schedule info
  schedule_day text, -- e.g. 'monday', 'wednesday'
  schedule_time text, -- e.g. '16:00'
  is_recurring boolean DEFAULT false,

  -- Status
  is_active boolean DEFAULT true,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_groups_subject ON public.study_groups(subject);
CREATE INDEX IF NOT EXISTS idx_study_groups_active ON public.study_groups(is_active) WHERE is_active = true;

ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active groups" ON public.study_groups
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Users can create groups" ON public.study_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update own groups" ON public.study_groups
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete own groups" ON public.study_groups
  FOR DELETE USING (auth.uid() = created_by);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_groups TO authenticated;

-- ============================================
-- 3. Study Group Members
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  role text NOT NULL DEFAULT 'member', -- 'admin', 'member'
  joined_at timestamptz DEFAULT now(),

  CONSTRAINT unique_group_member UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.study_group_members(user_id);

ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view group members" ON public.study_group_members
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can join groups" ON public.study_group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON public.study_group_members
  FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON public.study_group_members TO authenticated;

-- Auto-update member_count on study_groups
CREATE OR REPLACE FUNCTION public.update_group_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE study_groups SET member_count = member_count + 1, updated_at = now()
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE study_groups SET member_count = GREATEST(member_count - 1, 0), updated_at = now()
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_group_member_count ON public.study_group_members;
CREATE TRIGGER trigger_update_group_member_count
AFTER INSERT OR DELETE ON public.study_group_members
FOR EACH ROW EXECUTE FUNCTION public.update_group_member_count();

-- ============================================
-- 4. Academic Assignments
-- ============================================
CREATE TABLE IF NOT EXISTS public.academic_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title text NOT NULL,
  subject text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  priority text NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'

  -- Optional group assignment
  group_id uuid REFERENCES public.study_groups(id) ON DELETE SET NULL,

  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assignments_user ON public.academic_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due ON public.academic_assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.academic_assignments(user_id, status);

ALTER TABLE public.academic_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own assignments" ON public.academic_assignments
  FOR ALL USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_assignments TO authenticated;

-- ============================================
-- 5. Academic Quizzes
-- ============================================
CREATE TABLE IF NOT EXISTS public.academic_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title text NOT NULL,
  subject text NOT NULL,
  description text,
  time_limit_minutes integer, -- null = no time limit

  -- Questions stored as JSONB array
  -- [{question, type: 'multiple_choice'|'true_false'|'short_answer', options: [], correct_answer, explanation}]
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  question_count integer NOT NULL DEFAULT 0,

  -- Sharing
  is_public boolean DEFAULT false,
  group_id uuid REFERENCES public.study_groups(id) ON DELETE SET NULL,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_creator ON public.academic_quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON public.academic_quizzes(subject);

ALTER TABLE public.academic_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own and public quizzes" ON public.academic_quizzes
  FOR SELECT USING (auth.uid() = created_by OR is_public = true);

CREATE POLICY "Users can create quizzes" ON public.academic_quizzes
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own quizzes" ON public.academic_quizzes
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own quizzes" ON public.academic_quizzes
  FOR DELETE USING (auth.uid() = created_by);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_quizzes TO authenticated;

-- ============================================
-- 6. Quiz Attempts
-- ============================================
CREATE TABLE IF NOT EXISTS public.academic_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.academic_quizzes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  percentage numeric(5,2) NOT NULL DEFAULT 0,
  time_spent_seconds integer,

  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.academic_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON public.academic_quiz_attempts(quiz_id);

ALTER TABLE public.academic_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own quiz attempts" ON public.academic_quiz_attempts
  FOR ALL USING (auth.uid() = user_id);

GRANT SELECT, INSERT ON public.academic_quiz_attempts TO authenticated;

-- ============================================
-- 7. Study Schedules
-- ============================================
CREATE TABLE IF NOT EXISTS public.study_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  subject text NOT NULL,
  title text, -- optional label
  day_of_week integer NOT NULL, -- 0=Sunday, 1=Monday ... 6=Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_recurring boolean DEFAULT true,
  color text, -- hex color for calendar display

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedules_user ON public.study_schedules(user_id);

ALTER TABLE public.study_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own schedules" ON public.study_schedules
  FOR ALL USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_schedules TO authenticated;

-- ============================================
-- 8. Updated_at triggers
-- ============================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'academic_profiles',
      'study_groups',
      'academic_assignments',
      'academic_quizzes',
      'study_schedules'
    ])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.%I; CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      tbl, tbl
    );
  END LOOP;
END;
$$;
