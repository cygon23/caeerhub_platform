-- CORRECT DATABASE DIAGNOSTIC FOR PROFILES-BASED SCHEMA
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. COUNT RECORDS
-- ============================================
SELECT 'AUTH USERS' as section, count(*) as count FROM auth.users;
SELECT 'PROFILES' as section, count(*) as count FROM public.profiles;
SELECT 'USER ROLES' as section, count(*) as count FROM public.user_roles;

-- ============================================
-- 2. CHECK RLS ON PROFILES
-- ============================================
SELECT
    'RLS STATUS' as section,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- ============================================
-- 3. ALL RLS POLICIES ON PROFILES
-- ============================================
SELECT
    'PROFILES POLICIES' as section,
    policyname,
    permissive,
    roles,
    cmd as operation,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY cmd, policyname;

-- ============================================
-- 4. CHECK GRANTS ON PROFILES TABLE
-- ============================================
SELECT
    'PROFILES GRANTS' as section,
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY grantee, privilege_type;

-- ============================================
-- 5. CHECK TRIGGERS ON PROFILES
-- ============================================
SELECT
    'PROFILES TRIGGERS' as section,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public' AND event_object_table = 'profiles';

-- ============================================
-- 6. CHECK FOR TRIGGER FUNCTIONS
-- ============================================
SELECT
    'TRIGGER FUNCTIONS' as section,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND (routine_name LIKE '%profile%' OR routine_name LIKE '%user%')
ORDER BY routine_name;

-- ============================================
-- 7. RECENT AUTH USERS (LAST 10)
-- ============================================
SELECT
    'RECENT AUTH USERS' as section,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 8. CHECK ORPHANED PROFILES
-- ============================================
SELECT
    'ORPHANED PROFILES' as section,
    p.id,
    p.user_id,
    p.display_name,
    p.created_at
FROM public.profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE au.id IS NULL;

-- ============================================
-- 9. CHECK AUTH USERS WITHOUT PROFILES
-- ============================================
SELECT
    'AUTH USERS WITHOUT PROFILES' as section,
    au.id,
    au.email,
    au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.id IS NULL
ORDER BY au.created_at DESC
LIMIT 10;

-- ============================================
-- 10. CHECK SERVICE ROLE BYPASS RLS
-- ============================================
SELECT
    'ROLE PERMISSIONS' as section,
    rolname,
    rolsuper,
    rolbypassrls
FROM pg_roles
WHERE rolname IN ('postgres', 'service_role', 'authenticated', 'anon', 'authenticator');

-- ============================================
-- 11. DETAILED PROFILE STRUCTURE
-- ============================================
SELECT
    'PROFILES STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;
