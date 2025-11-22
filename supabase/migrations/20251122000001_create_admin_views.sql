-- Create a view that combines users, profiles, and roles for admin queries
-- This solves the PostgREST relationship issue by doing the join in Postgres

CREATE OR REPLACE VIEW admin_users_view AS
SELECT
    p.id as profile_id,
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.phone,
    p.location,
    p.status,
    p.bio,
    p.school_id,
    p.created_at as profile_created_at,
    p.updated_at as profile_updated_at,
    u.email,
    u.created_at as user_created_at,
    u.last_sign_in_at,
    u.confirmed_at,
    COALESCE(ur.role, 'youth') as role
FROM profiles p
INNER JOIN auth.users u ON p.user_id = u.id
LEFT JOIN user_roles ur ON p.user_id = ur.user_id;

-- Grant access to authenticated users
GRANT SELECT ON admin_users_view TO authenticated;

-- Create RLS policy for the view
ALTER VIEW admin_users_view SET (security_invoker = true);

-- Add comment
COMMENT ON VIEW admin_users_view IS 'Combined view of users, profiles, and roles for admin interface';
