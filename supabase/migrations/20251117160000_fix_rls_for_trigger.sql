-- Fix RLS policies to allow trigger function to insert during user registration
-- The issue: During user registration, auth.uid() is NULL, so RLS policies block inserts
-- The solution: Add policies that allow system inserts (when auth.uid() IS NULL)

-- ============================================================================
-- PROFILES TABLE - Allow system inserts for new user creation
-- ============================================================================

-- Add policy to allow system inserts (from trigger) when auth.uid() IS NULL
DROP POLICY IF EXISTS "System can insert profiles during registration" ON public.profiles;
CREATE POLICY "System can insert profiles during registration"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

-- ============================================================================
-- USER_ROLES TABLE - Allow system inserts for role assignment during registration
-- ============================================================================

-- Add policy to allow system inserts (from trigger) when auth.uid() IS NULL
DROP POLICY IF EXISTS "System can insert roles during registration" ON public.user_roles;
CREATE POLICY "System can insert roles during registration"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

-- ============================================================================
-- NOTIFICATIONS TABLE - Allow system inserts for welcome notifications
-- ============================================================================

-- Add policy to allow system inserts (from trigger) when auth.uid() IS NULL
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

-- ============================================================================
-- DONE! User registration should now work for individual users.
-- ============================================================================

COMMENT ON POLICY "System can insert profiles during registration" ON public.profiles IS
'Allows the handle_new_user() trigger to create profiles during user registration when auth.uid() is NULL (system context)';

COMMENT ON POLICY "System can insert roles during registration" ON public.user_roles IS
'Allows the handle_new_user() trigger to assign roles during user registration when auth.uid() is NULL (system context)';

COMMENT ON POLICY "System can insert notifications" ON public.notifications IS
'Allows the handle_new_user() trigger and other system processes to create notifications when auth.uid() is NULL (system context)';
