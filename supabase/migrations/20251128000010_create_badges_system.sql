-- Create badges system with multi-tier support
-- This enables gamification and achievement tracking for youth users

-- Create enum for badge categories
CREATE TYPE badge_category AS ENUM (
  'learning',
  'assessment',
  'activity',
  'career_readiness',
  'milestone',
  'achievement'
);

-- Create enum for badge tiers
CREATE TYPE badge_tier AS ENUM (
  'bronze',
  'silver',
  'gold'
);

-- Create badges table (predefined badges)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category badge_category NOT NULL,
  tier badge_tier NOT NULL,
  icon TEXT NOT NULL, -- Icon name from lucide-react
  color TEXT NOT NULL, -- Color theme (blue, purple, green, etc.)
  requirement_type TEXT NOT NULL, -- Type of requirement (modules_completed, assessments_completed, etc.)
  requirement_value INTEGER NOT NULL, -- Value needed to earn badge
  points INTEGER NOT NULL DEFAULT 0, -- Points awarded for earning badge
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_badges table (track earned badges)
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id) -- User can only earn each badge once
);

-- Add indexes for better query performance
CREATE INDEX idx_badges_category ON public.badges(category);
CREATE INDEX idx_badges_tier ON public.badges(tier);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON public.user_badges(badge_id);
CREATE INDEX idx_user_badges_earned_at ON public.user_badges(earned_at DESC);

-- Enable Row Level Security
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges table
-- Everyone can view all badges
CREATE POLICY "Anyone can view all badges"
  ON public.badges
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete badges
CREATE POLICY "Only admins can manage badges"
  ON public.badges
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- RLS Policies for user_badges table
-- Users can view their own earned badges
CREATE POLICY "Users can view their own earned badges"
  ON public.user_badges
  FOR SELECT
  USING (user_id = auth.uid());

-- System can insert badges for users (via service role)
CREATE POLICY "System can insert user badges"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all user badges
CREATE POLICY "Admins can view all user badges"
  ON public.user_badges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'school_admin')
    )
  );

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_badges_updated_at
  BEFORE UPDATE ON public.badges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert predefined badges

-- LEARNING BADGES (Bronze, Silver, Gold tiers)
INSERT INTO public.badges (name, description, category, tier, icon, color, requirement_type, requirement_value, points) VALUES
-- Bronze tier
('First Steps', 'Complete your first learning module', 'learning', 'bronze', 'BookOpen', 'blue', 'modules_completed', 1, 10),
('Knowledge Seeker', 'Complete 3 learning modules', 'learning', 'bronze', 'BookOpen', 'blue', 'modules_completed', 3, 30),
-- Silver tier
('Dedicated Learner', 'Complete 10 learning modules', 'learning', 'silver', 'BookOpen', 'purple', 'modules_completed', 10, 100),
('Module Champion', 'Complete 20 learning modules', 'learning', 'silver', 'GraduationCap', 'purple', 'modules_completed', 20, 200),
-- Gold tier
('Expert Learner', 'Complete 30 learning modules', 'learning', 'gold', 'Award', 'yellow', 'modules_completed', 30, 300),
('Learning Master', 'Complete all learning modules in a category', 'learning', 'gold', 'Trophy', 'yellow', 'category_mastery', 1, 500);

-- ASSESSMENT BADGES
INSERT INTO public.badges (name, description, category, tier, icon, color, requirement_type, requirement_value, points) VALUES
-- Bronze tier
('Know Yourself', 'Complete personality test', 'assessment', 'bronze', 'Brain', 'orange', 'personality_completed', 1, 20),
('Self Aware', 'Identify 3 personal strengths', 'assessment', 'bronze', 'Sparkles', 'orange', 'strengths_identified', 3, 30),
-- Silver tier
('Career Explorer', 'Complete 2 career assessments', 'assessment', 'silver', 'Compass', 'purple', 'assessments_completed', 2, 50),
('Strength Master', 'Identify 5+ personal strengths', 'assessment', 'silver', 'Star', 'purple', 'strengths_identified', 5, 100),
-- Gold tier
('Assessment Pro', 'Complete all career assessments', 'assessment', 'gold', 'CheckCircle', 'yellow', 'assessments_completed', 4, 200);

-- ACTIVITY BADGES
INSERT INTO public.badges (name, description, category, tier, icon, color, requirement_type, requirement_value, points) VALUES
-- Bronze tier
('Getting Started', 'Active for 3 days', 'activity', 'bronze', 'Calendar', 'green', 'days_active', 3, 15),
('Engaged User', 'Active for 7 days', 'activity', 'bronze', 'Zap', 'green', 'days_active', 7, 35),
-- Silver tier
('Week Warrior', 'Active for 14 days', 'activity', 'silver', 'Flame', 'purple', 'days_active', 14, 70),
('Consistent Achiever', 'Active for 30 days', 'activity', 'silver', 'TrendingUp', 'purple', 'days_active', 30, 150),
-- Gold tier
('Dedicated Champion', 'Active for 60 days', 'activity', 'gold', 'Crown', 'yellow', 'days_active', 60, 300),
('Platform Veteran', 'Active for 90+ days', 'activity', 'gold', 'Medal', 'yellow', 'days_active', 90, 500);

-- CAREER READINESS BADGES
INSERT INTO public.badges (name, description, category, tier, icon, color, requirement_type, requirement_value, points) VALUES
-- Bronze tier
('CV Creator', 'Complete your CV', 'career_readiness', 'bronze', 'FileText', 'blue', 'cv_completed', 1, 50),
('Getting Ready', 'Reach 25% career readiness', 'career_readiness', 'bronze', 'Target', 'blue', 'career_readiness', 25, 25),
-- Silver tier
('Half Way There', 'Reach 50% career readiness', 'career_readiness', 'silver', 'TrendingUp', 'purple', 'career_readiness', 50, 100),
('Almost Ready', 'Reach 75% career readiness', 'career_readiness', 'silver', 'Rocket', 'purple', 'career_readiness', 75, 150),
-- Gold tier
('Career Ready', 'Reach 100% career readiness', 'career_readiness', 'gold', 'Trophy', 'yellow', 'career_readiness', 100, 500),
('Job Seeker', 'Apply to your first job', 'career_readiness', 'gold', 'Briefcase', 'yellow', 'job_applications', 1, 100);

-- MILESTONE BADGES
INSERT INTO public.badges (name, description, category, tier, icon, color, requirement_type, requirement_value, points) VALUES
-- Bronze tier
('Welcome Aboard', 'Complete onboarding', 'milestone', 'bronze', 'PartyPopper', 'green', 'onboarding_completed', 1, 20),
('Profile Complete', 'Fill out your complete profile', 'milestone', 'bronze', 'User', 'green', 'profile_completed', 1, 30),
-- Silver tier
('Mentored', 'Connect with a mentor', 'milestone', 'silver', 'Users', 'purple', 'mentors_connected', 1, 75),
('Community Member', 'Active in platform for 1 month', 'milestone', 'silver', 'Heart', 'purple', 'days_active', 30, 100),
-- Gold tier
('Career Champion', 'Complete entire career journey', 'milestone', 'gold', 'Crown', 'yellow', 'full_journey', 1, 1000);

-- ACHIEVEMENT BADGES (Special accomplishments)
INSERT INTO public.badges (name, description, category, tier, icon, color, requirement_type, requirement_value, points) VALUES
-- Bronze tier
('Quick Starter', 'Complete 3 activities in first week', 'achievement', 'bronze', 'Zap', 'cyan', 'quick_start', 3, 50),
('First Win', 'Earn your first 100 points', 'achievement', 'bronze', 'Award', 'cyan', 'points_earned', 100, 25),
-- Silver tier
('Point Collector', 'Earn 500 points', 'achievement', 'silver', 'Coins', 'purple', 'points_earned', 500, 100),
('High Achiever', 'Earn 1000 points', 'achievement', 'silver', 'Gem', 'purple', 'points_earned', 1000, 200),
-- Gold tier
('Point Master', 'Earn 2000+ points', 'achievement', 'gold', 'Diamond', 'yellow', 'points_earned', 2000, 500),
('Perfect Score', 'Achieve 100% in any assessment', 'achievement', 'gold', 'Star', 'yellow', 'perfect_score', 1, 250);

-- Add comment to tables
COMMENT ON TABLE public.badges IS 'Predefined badges that users can earn through various achievements';
COMMENT ON TABLE public.user_badges IS 'Tracks which badges each user has earned and when';
