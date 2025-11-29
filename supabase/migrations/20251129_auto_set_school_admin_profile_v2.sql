-- =====================================================
-- Auto-assign school_id to admin's profile when school is created
-- Updated to use contact_email instead of created_by
-- =====================================================

-- Function to automatically set school_id in profile when school is registered
CREATE OR REPLACE FUNCTION auto_set_school_admin_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profile of the admin whose email matches the school's contact_email
  -- Set their school_id to the new school's registration_number
  UPDATE profiles p
  SET school_id = NEW.registration_number
  FROM auth.users au
  WHERE p.user_id = au.id
    AND au.email = NEW.contact_email;

  -- Log for debugging
  RAISE NOTICE 'Auto-assigned school_id % to admin profile for email %', NEW.registration_number, NEW.contact_email;

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

-- Update all existing school admins who don't have a school_id set
-- Match by email: admin's email = school's contact_email
UPDATE profiles p
SET school_id = sr.registration_number
FROM school_registrations sr
JOIN auth.users au ON au.email = sr.contact_email
WHERE p.user_id = au.id
  AND p.school_id IS NULL;

-- =====================================================
-- Grant permissions
-- =====================================================

GRANT EXECUTE ON FUNCTION auto_set_school_admin_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION auto_set_school_admin_profile() TO service_role;

-- =====================================================
-- Verification query
-- =====================================================

-- Run this to verify the fix worked:
SELECT
  au.email as admin_email,
  p.user_id,
  p.display_name,
  p.school_id,
  sr.school_name
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
LEFT JOIN school_registrations sr ON p.school_id = sr.registration_number
WHERE au.email IN (SELECT contact_email FROM school_registrations);
