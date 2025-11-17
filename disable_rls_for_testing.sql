-- ============================================================================
-- TEMPORARY: DISABLE RLS FOR TESTING USER REGISTRATION
-- ============================================================================
-- This will help confirm if RLS is blocking user registration
-- IMPORTANT: Re-enable RLS after testing!

-- Option 1: Disable RLS on critical tables for testing
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
    'RLS STATUS' as section,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'user_roles', 'notifications')
ORDER BY tablename;

-- ============================================================================
-- AFTER TESTING: RUN THIS TO RE-ENABLE RLS
-- ============================================================================
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
