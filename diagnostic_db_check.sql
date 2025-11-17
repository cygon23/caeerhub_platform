-- COMPREHENSIVE DATABASE DIAGNOSTIC FOR USER REGISTRATION ISSUES
-- Run this in Supabase SQL Editor to see the full picture

-- ============================================
-- 1. CHECK AUTH.USERS TABLE
-- ============================================
SELECT 'AUTH USERS' as section, count(*) as count FROM auth.users;

-- ============================================
-- 2. CHECK PUBLIC.USERS TABLE
-- ============================================
SELECT 'PUBLIC USERS' as section, count(*) as count FROM public.users;

-- ============================================
-- 3. CHECK PROFILES TABLE
-- ============================================
SELECT 'PROFILES' as section, count(*) as count FROM public.profiles;

-- ============================================
-- 4. RLS STATUS ON CRITICAL TABLES
-- ============================================
SELECT
    'RLS STATUS' as section,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname IN ('public', 'auth')
    AND tablename IN ('users', 'profiles', 'user_roles', 'organizations', 'organization_members')
ORDER BY tablename;

-- ============================================
-- 5. ALL RLS POLICIES ON PUBLIC.USERS
-- ============================================
SELECT
    'USERS TABLE POLICIES' as section,
    policyname,
    permissive,
    roles,
    cmd as operation,
    qual as using_clause,
    with_check as with_check_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- ============================================
-- 6. ALL RLS POLICIES ON PUBLIC.PROFILES
-- ============================================
SELECT
    'PROFILES TABLE POLICIES' as section,
    policyname,
    permissive,
    roles,
    cmd as operation,
    qual as using_clause,
    with_check as with_check_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- 7. CHECK TABLE STRUCTURES
-- ============================================
SELECT
    'USERS TABLE STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'users'
ORDER BY ordinal_position;

SELECT
    'PROFILES TABLE STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================
-- 8. CHECK TRIGGERS ON USERS/PROFILES
-- ============================================
SELECT
    'TRIGGERS' as section,
    trigger_name,
    event_manipulation as trigger_event,
    event_object_table as table_name,
    action_statement as trigger_action
FROM information_schema.triggers
WHERE event_object_schema = 'public'
    AND event_object_table IN ('users', 'profiles')
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 9. CHECK FUNCTIONS RELATED TO USER CREATION
-- ============================================
SELECT
    'FUNCTIONS' as section,
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND (routine_name LIKE '%user%' OR routine_name LIKE '%profile%' OR routine_name LIKE '%auth%')
ORDER BY routine_name;

-- ============================================
-- 10. CHECK GRANTS ON PUBLIC.USERS
-- ============================================
SELECT
    'USERS TABLE GRANTS' as section,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
    AND table_name = 'users'
ORDER BY grantee, privilege_type;

-- ============================================
-- 11. CHECK GRANTS ON PUBLIC.PROFILES
-- ============================================
SELECT
    'PROFILES TABLE GRANTS' as section,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
    AND table_name = 'profiles'
ORDER BY grantee, privilege_type;

-- ============================================
-- 12. CHECK IF SERVICE ROLE HAS BYPASS RLS
-- ============================================
SELECT
    'SERVICE ROLE CHECK' as section,
    rolname,
    rolsuper,
    rolbypassrls,
    rolcanlogin
FROM pg_roles
WHERE rolname IN ('postgres', 'service_role', 'authenticated', 'anon', 'authenticator')
ORDER BY rolname;

-- ============================================
-- 13. RECENT USER REGISTRATIONS (LAST 10)
-- ============================================
SELECT
    'RECENT AUTH USERS' as section,
    id,
    email,
    created_at,
    confirmed_at,
    email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 14. CHECK FOR ORPHANED RECORDS
-- ============================================
SELECT
    'ORPHANED USERS' as section,
    u.id,
    u.email,
    u.created_at
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE au.id IS NULL;

SELECT
    'ORPHANED PROFILES' as section,
    p.id,
    p.user_id,
    p.created_at
FROM public.profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE au.id IS NULL;

-- ============================================
-- 15. CHECK SCHEMA PERMISSIONS
-- ============================================
SELECT
    'SCHEMA PERMISSIONS' as section,
    nspname as schema_name,
    nspacl as permissions
FROM pg_namespace
WHERE nspname IN ('public', 'auth')
ORDER BY nspname;
