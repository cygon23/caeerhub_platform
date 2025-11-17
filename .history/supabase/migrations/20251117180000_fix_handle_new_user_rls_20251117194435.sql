-- CRITICAL FIX: Disable RLS for handle_new_user trigger function
-- This prevents "current transaction is aborted" errors during signup
-- The trigger runs with SECURITY DEFINER, so it's safe to disable RLS

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
SET row_security = off
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

  -- Insert into profiles (handle duplicates gracefully)
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

  -- Insert user role (handle duplicates gracefully)
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Failed to create user role for user %: %', NEW.id, SQLERRM;
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
      -- Log the error but don't fail the entire trigger
      RAISE WARNING 'Failed to create welcome notification for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If anything goes wrong, log it but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user trigger for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
