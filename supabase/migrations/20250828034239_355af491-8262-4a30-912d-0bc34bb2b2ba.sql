-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('youth', 'mentor', 'admin');

-- Create user status enum
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'pending', 'suspended');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  status user_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create mentorship table
CREATE TABLE public.mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mentee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mentor_id, mentee_id)
);

-- Create onboarding_responses table
CREATE TABLE public.onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  education_level TEXT,
  strongest_subjects TEXT[],
  interests TEXT[],
  dream_career TEXT,
  preferred_path TEXT CHECK (preferred_path IN ('employment', 'self_employment', 'investor')),
  habits JSONB, -- Store ratings as JSON
  support_preferences TEXT[],
  reminder_frequency TEXT DEFAULT 'daily',
  ai_personality_summary TEXT,
  ai_roadmap TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create career_assessments table
CREATE TABLE public.career_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_type TEXT NOT NULL,
  questions JSONB NOT NULL,
  responses JSONB NOT NULL,
  results JSONB,
  ai_analysis TEXT,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning_modules table
CREATE TABLE public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration INTEGER, -- in minutes
  prerequisites TEXT[],
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_module_progress table
CREATE TABLE public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'abandoned')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  time_spent INTEGER DEFAULT 0, -- in minutes
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Create job_opportunities table
CREATE TABLE public.job_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  skills_required TEXT[],
  location TEXT,
  salary_range TEXT,
  employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship')),
  application_url TEXT,
  is_active BOOLEAN DEFAULT true,
  posted_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_cvs table
CREATE TABLE public.user_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'My CV',
  personal_info JSONB,
  education JSONB,
  experience JSONB,
  skills JSONB,
  achievements JSONB,
  ai_score INTEGER,
  ai_feedback TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentorship_sessions table
CREATE TABLE public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentorship_id UUID REFERENCES public.mentorships(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  session_type TEXT DEFAULT 'video_call' CHECK (session_type IN ('video_call', 'phone', 'in_person', 'chat')),
  notes TEXT,
  mentor_feedback TEXT,
  mentee_feedback TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  contact_email TEXT,
  partnership_type TEXT[],
  is_active BOOLEAN DEFAULT true,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_mentor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'mentor'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- RLS Policies for mentorships
CREATE POLICY "Users can view their mentorships" ON public.mentorships
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Mentors can manage their mentorships" ON public.mentorships
  FOR ALL USING (auth.uid() = mentor_id OR public.is_admin());

-- RLS Policies for onboarding_responses
CREATE POLICY "Users can manage their own onboarding" ON public.onboarding_responses
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for career_assessments
CREATE POLICY "Users can manage their own assessments" ON public.career_assessments
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for learning_modules
CREATE POLICY "Anyone can view published modules" ON public.learning_modules
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage modules" ON public.learning_modules
  FOR ALL USING (public.is_admin());

-- RLS Policies for user_module_progress
CREATE POLICY "Users can manage their own progress" ON public.user_module_progress
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for job_opportunities
CREATE POLICY "Anyone can view active jobs" ON public.job_opportunities
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage jobs" ON public.job_opportunities
  FOR ALL USING (public.is_admin());

-- RLS Policies for user_cvs
CREATE POLICY "Users can manage their own CVs" ON public.user_cvs
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for mentorship_sessions
CREATE POLICY "Participants can view their sessions" ON public.mentorship_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentorships m
      WHERE m.id = mentorship_id 
      AND (m.mentor_id = auth.uid() OR m.mentee_id = auth.uid())
    )
  );

CREATE POLICY "Mentors can manage their sessions" ON public.mentorship_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.mentorships m
      WHERE m.id = mentorship_id AND m.mentor_id = auth.uid()
    ) OR public.is_admin()
  );

-- RLS Policies for partners
CREATE POLICY "Anyone can view active partners" ON public.partners
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage partners" ON public.partners
  FOR ALL USING (public.is_admin());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- RLS Policies for system_settings
CREATE POLICY "Admins can manage system settings" ON public.system_settings
  FOR ALL USING (public.is_admin());

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorships_updated_at
  BEFORE UPDATE ON public.mentorships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at
  BEFORE UPDATE ON public.learning_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_opportunities_updated_at
  BEFORE UPDATE ON public.job_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_cvs_updated_at
  BEFORE UPDATE ON public.user_cvs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_sessions_updated_at
  BEFORE UPDATE ON public.mentorship_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();