-- Make handle_new_user trigger minimal and fully optional
-- This ensures user registration ALWAYS succeeds, even if related tables have issues

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role app_role := 'youth';
BEGIN
  -- Determine user role based on email
  BEGIN
    IF NEW.email LIKE '%admin%' THEN
      user_role := 'admin';
    ELSIF NEW.email LIKE '%mentor%' THEN
      user_role := 'mentor';
    ELSE
      user_role := 'youth';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      user_role := 'youth';
  END;

  -- Try to insert into profiles (completely optional)
  BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User')
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Silently ignore - profiles table might not exist or have issues
      RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;

  -- Try to insert user role (completely optional)
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Silently ignore - user_roles table might not exist or have issues
      RAISE WARNING 'Failed to create user role for user %: %', NEW.id, SQLERRM;
  END;

  -- Try to send welcome notification (completely optional)
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
      -- Silently ignore - notifications table might not exist or have issues
      RAISE WARNING 'Failed to create welcome notification for user %: %', NEW.id, SQLERRM;
  END;

  -- ALWAYS return NEW to allow user creation to succeed
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Even if everything fails, ALWAYS allow the user to be created
    RAISE WARNING 'Error in handle_new_user trigger for user %, but allowing user creation: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Minimal trigger for new user signup. Attempts to create profile, assign role, and send notification, but ALWAYS allows user creation to succeed even if any operation fails. Does NOT create preferences - those are created on-demand when users access their settings.';
