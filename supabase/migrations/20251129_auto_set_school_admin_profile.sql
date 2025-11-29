-- =====================================================
-- Auto-assign school_id to admin's profile when school is created
-- =====================================================

-- Function to automatically set school_id in profile when school is registered
CREATE OR REPLACE FUNCTION auto_set_school_admin_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profile of the user who created the school
  -- Set their school_id to the new school's registration_number
  UPDATE profiles
  SET school_id = NEW.registration_number
  WHERE user_id = NEW.created_by;

  -- Log for debugging
  RAISE NOTICE 'Auto-assigned school_id % to admin profile for user %', NEW.registration_number, NEW.created_by;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after a school is registered
DROP TRIGGER IF EXISTS trigger_auto_set_school_admin_profile ON school_registrations;

CREATE TRIGGER trigger_auto_set_school_admin_profile
  AFTER INSERT ON school_registrations
  FOR EACH ROW
  WHEN (NEW.created_by IS NOT NULL)
  EXECUTE FUNCTION auto_set_school_admin_profile();

-- =====================================================
-- Backfill existing school admins (one-time fix)
-- =====================================================

-- Update all existing school admins who don't have a school_id set
UPDATE profiles p
SET school_id = sr.registration_number
FROM school_registrations sr
WHERE p.user_id = sr.created_by
  AND p.school_id IS NULL;

-- =====================================================
-- Grant permissions
-- =====================================================

GRANT EXECUTE ON FUNCTION auto_set_school_admin_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION auto_set_school_admin_profile() TO service_role;

-- =====================================================
-- Verification query (optional - for testing)
-- =====================================================

-- You can run this to verify:
-- SELECT
--   p.user_id,
--   p.display_name,
--   p.school_id,
--   sr.school_name
-- FROM profiles p
-- LEFT JOIN school_registrations sr ON p.school_id = sr.registration_number
-- WHERE p.user_id IN (SELECT user_id FROM user_roles WHERE role = 'school_admin');
