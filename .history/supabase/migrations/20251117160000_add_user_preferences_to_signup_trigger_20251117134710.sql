-- Update handle_new_user trigger to auto-create user_preferences row on signup
-- This ensures user_preferences row exists immediately when a user signs up
-- preventing "relation user_preferences does not exist" errors when frontend
-- tries to read/update preferences immediately after signup

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role app_role := 'youth';
BEGIN
  -- Check email to assign appropriate role for testing
  IF NEW.email LIKE '%admin%' THEN
    user_role := 'admin';
  ELSIF NEW.email LIKE '%mentor%' THEN
    user_role := 'mentor';
  ELSE
    user_role := 'youth';
  END IF;

  -- Insert into profiles (wrap in error handling to prevent transaction abort)
  BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User')
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;

  -- Insert user role (wrap in error handling to prevent transaction abort)
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create user role for user %: %', NEW.id, SQLERRM;
  END;

  -- INSERT INTO user_preferences to ensure preferences row exists for new users
  BEGIN
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create user preferences for user %: %', NEW.id, SQLERRM;
  END;

  -- Send welcome notification (make this optional - don't fail if notifications table doesn't exist or insert fails)
  BEGIN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.id,
      'Welcome to Career na Mimi! 🎉',
      'Your journey to career success starts here. Complete your onboarding to get personalized recommendations.',
      'info'
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create welcome notification for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- This outer exception should rarely trigger now since all ops are wrapped
    RAISE WARNING 'Error in handle_new_user trigger for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure the trigger is up-to-date
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates profile, user_preferences row, assigns role, and sends welcome notification when a new user signs up. Handles errors gracefully to ensure user creation succeeds even if related operations fail.';
