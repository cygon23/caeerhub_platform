-- STEP 1: Check what tables actually exist in the database

-- List all tables in public schema
SELECT
    'EXISTING PUBLIC TABLES' as section,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check auth.users exists
SELECT
    'AUTH SCHEMA TABLES' as section,
    table_name
FROM information_schema.tables
WHERE table_schema = 'auth'
ORDER BY table_name;

-- Count users in auth (this should work)
SELECT 'AUTH USERS COUNT' as section, count(*) as count FROM auth.users;
