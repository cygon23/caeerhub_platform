-- ============================================================================
-- VERIFICATION QUERIES - Run these to test the fix
-- ============================================================================

-- 1. Check current RLS policies on profiles
SELECT
    'PROFILES POLICIES' as section,
    policyname,
    cmd as operation,
    with_check as policy_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- 2. Check RLS policies on user_roles
SELECT
    'USER_ROLES POLICIES' as section,
    policyname,
    cmd as operation,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_roles'
ORDER BY policyname;

-- 3. Check RLS policies on notifications
SELECT
    'NOTIFICATIONS POLICIES' as section,
    policyname,
    cmd as operation,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'notifications'
ORDER BY policyname;

-- 4. Check if trigger exists and is active
SELECT
    'TRIGGERS ON AUTH.USERS' as section,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users'
ORDER BY trigger_name;

-- 5. Count auth users vs profiles (to see if there's a mismatch)
SELECT
    'USER COUNTS' as section,
    (SELECT count(*) FROM auth.users) as auth_users,
    (SELECT count(*) FROM public.profiles) as profiles,
    (SELECT count(*) FROM auth.users au WHERE NOT EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
    )) as users_without_profiles;

-- 6. Show users without profiles (if any)
SELECT
    'USERS WITHOUT PROFILES' as section,
    au.id,
    au.email,
    au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC
LIMIT 10;

-- 7. Test if auth.uid() is NULL (simulating trigger context)
-- This should show that during trigger execution, auth.uid() is NULL
SELECT
    'CURRENT AUTH STATE' as section,
    auth.uid() as current_user_id,
    CASE WHEN auth.uid() IS NULL THEN 'Unauthenticated (trigger context)' ELSE 'Authenticated' END as status;
