-- SAFE: Create a separate trigger ONLY for auto-creating user_preferences rows
-- This is independent of handle_new_user() so we don't risk breaking existing profile/role/notification logic
-- Fires AFTER handle_new_user() completes, so it's a second-pass safety net

CREATE OR REPLACE FUNCTION public.create_user_preferences_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
SET row_security = off
AS $$
BEGIN
  -- Only insert if user_preferences doesn't already exist (safety check)
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log warning but don't fail user creation
    RAISE WARNING 'Failed to create user_preferences for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop if exists to ensure clean creation
DROP TRIGGER IF EXISTS create_user_preferences_on_signup_trigger ON auth.users;

-- Create the trigger - fires AFTER the existing on_auth_user_created trigger
CREATE TRIGGER create_user_preferences_on_signup_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_user_preferences_on_signup();

-- Add comment
COMMENT ON FUNCTION public.create_user_preferences_on_signup() 
IS 'Safely creates user_preferences row for new users during signup. Runs independently from other signup triggers to avoid affecting existing profile/role/notification creation logic.';
