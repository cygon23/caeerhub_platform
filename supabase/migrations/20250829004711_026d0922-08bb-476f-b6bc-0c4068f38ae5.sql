-- Create test accounts with different roles
-- Insert test admin user role
INSERT INTO user_roles (user_id, role) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert test mentor user role  
INSERT INTO user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000002', 'mentor')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert test youth user role
INSERT INTO user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000003', 'youth')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update the is_admin function to include the test admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  ) OR auth.uid()::text = '00000000-0000-0000-0000-000000000001';
$$;