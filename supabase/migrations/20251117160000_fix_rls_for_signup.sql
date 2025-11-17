-- Fix RLS policies to allow trigger function to insert during user registration
-- This migration adds policies that allow system inserts when auth.uid() is NULL (during signup)

-- ============================================================================
-- PROFILES TABLE - Allow system inserts during registration
-- ============================================================================

-- Drop the old restrictive policy for inserts
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create two policies: one for users, one for system (during signup)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert profiles during registration"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

-- ============================================================================
-- USER_ROLES TABLE - Allow system inserts during registration
-- ============================================================================

-- The current policy only allows admins, we need to add a system policy
CREATE POLICY "System can insert roles during registration"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

-- ============================================================================
-- NOTIFICATIONS TABLE - Allow system inserts
-- ============================================================================

-- Add policy to allow system to create notifications
CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

-- ============================================================================
-- UPDATE THE TRIGGER FUNCTION WITH FULL ERROR HANDLING
-- ============================================================================

-- This ensures user creation ALWAYS succeeds even if related inserts fail
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role app_role := 'youth';
BEGIN
  -- Determine user role based on email
  BEGIN
    IF NEW.email LIKE '%admin%' THEN
      user_role := 'admin';
    ELSIF NEW.email LIKE '%mentor%' THEN
      user_role := 'mentor';
    ELSE
      user_role := 'youth';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      user_role := 'youth';
  END;

  -- Try to insert into profiles (completely optional)
  BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User')
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log warning but don't fail - profiles table might not exist or have issues
      RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;

  -- Try to insert user role (completely optional)
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log warning but don't fail - user_roles table might not exist or have issues
      RAISE WARNING 'Failed to create user role for user %: %', NEW.id, SQLERRM;
  END;

  -- Try to send welcome notification (completely optional)
  BEGIN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.id,
      'Welcome to Career na Mimi! 🎉',
      'Your journey to career success starts here. Complete your onboarding to get personalized recommendations.',
      'info'
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log warning but don't fail - notifications table might not exist or have issues
      RAISE WARNING 'Failed to create welcome notification for user %: %', NEW.id, SQLERRM;
  END;

  -- ALWAYS return NEW to allow user creation to succeed
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Even if everything fails, ALWAYS allow the user to be created
    RAISE WARNING 'Error in handle_new_user trigger for user %, but allowing user creation: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add helpful comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates profile, assigns role, and sends welcome notification when a new user signs up. Has full error handling to ensure user creation ALWAYS succeeds even if related operations fail. Works with RLS policies that allow system inserts when auth.uid() IS NULL.';

-- ============================================================================
-- VERIFICATION QUERY (commented out - for manual testing)
-- ============================================================================

-- Run this after migration to verify RLS policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('profiles', 'user_roles', 'notifications')
-- ORDER BY tablename, policyname;
