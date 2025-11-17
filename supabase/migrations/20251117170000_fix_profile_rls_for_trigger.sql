-- ============================================================================
-- FIX PROFILE RLS TO ALLOW TRIGGER INSERTS DURING SIGNUP
-- ============================================================================
-- Problem: During signup, auth.uid() is NULL, so trigger can't insert profiles
-- Solution: Allow inserts when auth.uid() IS NULL (system/trigger) OR when user owns the profile

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create policy that allows BOTH user inserts AND system/trigger inserts
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id           -- Normal user insert
    OR auth.uid() IS NULL          -- System/trigger insert during signup
  );

-- Do the same for user_roles table
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "System can insert roles during signup"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL             -- System/trigger insert during signup
    OR public.is_admin()           -- Admins can assign roles
  );

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can update and delete roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- Do the same for notifications table
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL             -- System/trigger insert
    OR public.is_admin()           -- Admins can create notifications
  );

-- Add comment explaining the fix
COMMENT ON POLICY "Users can insert their own profile" ON public.profiles IS
'Allows users to create their own profile AND allows system/trigger to create profiles during signup when auth.uid() IS NULL';

-- ============================================================================
-- VERIFICATION: Check current policies
-- ============================================================================
-- Run this to verify the policies are correct:
-- SELECT tablename, policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename IN ('profiles', 'user_roles', 'notifications')
-- ORDER BY tablename, policyname;
