-- Trigger to auto-confirm school admin accounts
-- When a user with school_admin role is created, automatically confirm their email

CREATE OR REPLACE FUNCTION auto_confirm_school_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user has school_admin role
    IF EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = NEW.user_id AND role = 'school_admin'
    ) THEN
        -- Update auth.users to mark email as confirmed
        -- confirmed_at is a generated column, only update email_confirmed_at
        UPDATE auth.users
        SET email_confirmed_at = NOW()
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger on user_roles table
-- When school_admin role is inserted, auto-confirm the user
CREATE TRIGGER trigger_auto_confirm_school_admin
    AFTER INSERT ON user_roles
    FOR EACH ROW
    WHEN (NEW.role = 'school_admin')
    EXECUTE FUNCTION auto_confirm_school_admin();

COMMENT ON FUNCTION auto_confirm_school_admin IS 'Auto-confirms email for users with school_admin role so they can login immediately with generated credentials';

