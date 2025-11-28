-- Clean up existing learning modules tables and policies
-- Run this BEFORE running the main migration

-- Drop all policies first
DROP POLICY IF EXISTS "Anyone can view published modules" ON public.learning_modules;
DROP POLICY IF EXISTS "Admins can manage all modules" ON public.learning_modules;
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_module_progress;
DROP POLICY IF EXISTS "Users can create own progress" ON public.user_module_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_module_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_module_progress;
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_learning_preferences;
DROP POLICY IF EXISTS "Admins can view all preferences" ON public.user_learning_preferences;

-- Drop triggers
DROP TRIGGER IF EXISTS update_learning_modules_updated_at ON public.learning_modules;
DROP TRIGGER IF EXISTS update_user_module_progress_updated_at ON public.user_module_progress;
DROP TRIGGER IF EXISTS update_user_learning_preferences_updated_at ON public.user_learning_preferences;

-- Drop functions
DROP FUNCTION IF EXISTS increment_module_views(UUID);
DROP FUNCTION IF EXISTS enroll_in_module(UUID);
DROP FUNCTION IF EXISTS complete_module(UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.user_learning_preferences CASCADE;
DROP TABLE IF EXISTS public.user_module_progress CASCADE;
DROP TABLE IF EXISTS public.learning_modules CASCADE;

-- Confirm cleanup
SELECT 'Learning modules tables cleaned up successfully' AS status;
