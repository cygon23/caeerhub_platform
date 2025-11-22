-- Create a function to get all users for admin (with security definer)
-- This bypasses RLS on auth.users table

CREATE OR REPLACE FUNCTION get_admin_users()
RETURNS TABLE (
    profile_id uuid,
    user_id uuid,
    display_name text,
    avatar_url text,
    phone text,
    location text,
    status user_status,
    bio text,
    school_id text,
    profile_created_at timestamptz,
    profile_updated_at timestamptz,
    email text,
    user_created_at timestamptz,
    last_sign_in_at timestamptz,
    confirmed_at timestamptz,
    role text
)
LANGUAGE plpgsql
SECURITY DEFINER -- Run with function owner's permissions
SET search_path = public
AS $$
BEGIN
    -- Only allow admins to call this function
    IF NOT EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    RETURN QUERY
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
    LEFT JOIN user_roles ur ON p.user_id = ur.user_id
    ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute to authenticated users (they still need admin role to actually run it)
GRANT EXECUTE ON FUNCTION get_admin_users() TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_admin_users() IS 'Returns all users with their profiles and roles. Only accessible by admins. Uses SECURITY DEFINER to bypass RLS on auth.users.';
