-- ============================================================================
-- RE-ENABLE RLS AND RESTORE POLICIES AFTER TESTING
-- ============================================================================
-- Run this after testing to restore security

-- Step 1: Re-enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 2: Restore policies WITH THE FIX for trigger inserts
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id           -- Normal user insert
    OR auth.uid() IS NULL          -- System/trigger insert during signup
  );

DROP POLICY IF EXISTS "System can insert roles during signup" ON public.user_roles;
CREATE POLICY "System can insert roles during signup"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL             -- System/trigger insert during signup
    OR public.is_admin()           -- Admins can assign roles
  );

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL             -- System/trigger insert
    OR public.is_admin()           -- Admins can create notifications
  );

-- Step 3: Verify RLS is enabled
SELECT
    'RLS STATUS AFTER RE-ENABLE' as section,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'user_roles', 'notifications')
ORDER BY tablename;

-- Step 4: Verify policies are correct
SELECT
    'POLICIES AFTER RESTORE' as section,
    tablename,
    policyname,
    cmd as operation,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'user_roles', 'notifications')
ORDER BY tablename, policyname;
