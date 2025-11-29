-- =====================================================
-- Auto-create/update school_id in admin's profile when school is registered
-- Uses UPSERT to create profile if it doesn't exist
-- =====================================================

-- Function to automatically create or update profile with school_id
CREATE OR REPLACE FUNCTION auto_set_school_admin_profile()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Find the user_id for the admin whose email matches the school's contact_email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = NEW.contact_email;

  -- If user exists, insert or update their profile
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO profiles (user_id, display_name, school_id, status)
    VALUES (
      admin_user_id,
      'School Admin',
      NEW.registration_number,
      'active'
    )
    ON CONFLICT (user_id) DO UPDATE
    SET school_id = NEW.registration_number,
        updated_at = now();

    -- Log for debugging
    RAISE NOTICE 'Auto-assigned school_id % to admin profile for email % (user_id: %)',
      NEW.registration_number, NEW.contact_email, admin_user_id;
  ELSE
    RAISE NOTICE 'No auth.users record found for email %', NEW.contact_email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS trigger_auto_set_school_admin_profile ON school_registrations;

-- Create trigger that fires after a school is registered or updated
CREATE TRIGGER trigger_auto_set_school_admin_profile
  AFTER INSERT OR UPDATE ON school_registrations
  FOR EACH ROW
  WHEN (NEW.contact_email IS NOT NULL)
  EXECUTE FUNCTION auto_set_school_admin_profile();

-- =====================================================
-- Backfill existing school admins (one-time fix)
-- =====================================================

-- Create or update profiles for all existing school admins
INSERT INTO profiles (user_id, display_name, school_id, status)
SELECT
  au.id as user_id,
  'School Admin' as display_name,
  sr.registration_number as school_id,
  'active' as status
FROM school_registrations sr
JOIN auth.users au ON au.email = sr.contact_email
ON CONFLICT (user_id) DO UPDATE
SET school_id = EXCLUDED.school_id,
    updated_at = now();

-- =====================================================
-- Grant permissions
-- =====================================================

GRANT EXECUTE ON FUNCTION auto_set_school_admin_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION auto_set_school_admin_profile() TO service_role;

-- =====================================================
-- Verification query
-- =====================================================

-- Run this to verify the fix worked:
-- SELECT
--   au.email as admin_email,
--   p.user_id,
--   p.display_name,
--   p.school_id,
--   sr.school_name
-- FROM profiles p
-- JOIN auth.users au ON p.user_id = au.id
-- LEFT JOIN school_registrations sr ON p.school_id = sr.registration_number
-- WHERE au.email IN (SELECT contact_email FROM school_registrations);
