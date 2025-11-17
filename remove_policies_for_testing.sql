-- ============================================================================
-- ALTERNATIVE: REMOVE SPECIFIC POLICIES FOR TESTING
-- ============================================================================
-- This removes only the INSERT policies that might be blocking registration
-- More targeted than disabling all RLS

-- Remove INSERT policies that might be blocking
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Check remaining policies
SELECT
    'REMAINING POLICIES' as section,
    tablename,
    policyname,
    cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'user_roles', 'notifications')
ORDER BY tablename, policyname;

-- ============================================================================
-- AFTER TESTING: RESTORE POLICIES WITH THE FIX
-- ============================================================================
-- Run this to restore policies with the correct fix:

-- CREATE POLICY "Users can insert their own profile"
--   ON public.profiles
--   FOR INSERT
--   WITH CHECK (
--     auth.uid() = user_id
--     OR auth.uid() IS NULL
--   );

-- CREATE POLICY "System can insert roles during signup"
--   ON public.user_roles
--   FOR INSERT
--   WITH CHECK (
--     auth.uid() IS NULL
--     OR public.is_admin()
--   );

-- CREATE POLICY "System can create notifications"
--   ON public.notifications
--   FOR INSERT
--   WITH CHECK (
--     auth.uid() IS NULL
--     OR public.is_admin()
--   );
