-- Create user_preferences table to store user-specific settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Appearance settings
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  accent_color text DEFAULT 'blue',
  language text DEFAULT 'en',
  timezone text DEFAULT 'Africa/Dar_es_Salaam',

  -- Notification preferences
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,

  -- Privacy settings
  profile_discoverable boolean DEFAULT true,
  show_online_status boolean DEFAULT true,
  allow_messages_from text DEFAULT 'everyone' CHECK (allow_messages_from IN ('everyone', 'connections', 'nobody')),
  show_email boolean DEFAULT false,
  show_phone boolean DEFAULT false,

  -- Advanced settings
  api_access_enabled boolean DEFAULT false,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Ensure one row per user
  UNIQUE(user_id)
);

-- Add missing columns if they don't exist (for existing tables)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'user_preferences'
                 AND column_name = 'timezone') THEN
    ALTER TABLE public.user_preferences ADD COLUMN timezone text DEFAULT 'Africa/Dar_es_Salaam';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'user_preferences'
                 AND column_name = 'sms_notifications') THEN
    ALTER TABLE public.user_preferences ADD COLUMN sms_notifications boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'user_preferences'
                 AND column_name = 'show_email') THEN
    ALTER TABLE public.user_preferences ADD COLUMN show_email boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'user_preferences'
                 AND column_name = 'show_phone') THEN
    ALTER TABLE public.user_preferences ADD COLUMN show_phone boolean DEFAULT false;
  END IF;
END $$;

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Email notifications
  email_job_recommendations boolean DEFAULT true,
  email_weekly_digest boolean DEFAULT true,
  email_mentorship_updates boolean DEFAULT true,
  email_course_updates boolean DEFAULT true,

  -- Digest settings
  digest_frequency text DEFAULT 'weekly' CHECK (digest_frequency IN ('daily', 'weekly', 'monthly', 'never')),

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Ensure one row per user
  UNIQUE(user_id)
);

-- Create security_settings table
CREATE TABLE IF NOT EXISTS public.security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Security features
  two_factor_enabled boolean DEFAULT false,
  login_notification_email boolean DEFAULT true,

  -- Session management
  last_password_change timestamptz,
  failed_login_attempts integer DEFAULT 0,
  account_locked_until timestamptz,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Ensure one row per user
  UNIQUE(user_id)
);

-- Create billing_settings table
CREATE TABLE IF NOT EXISTS public.billing_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Subscription info
  plan_tier text DEFAULT 'free' CHECK (plan_tier IN ('free', 'basic', 'premium', 'enterprise')),
  subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'suspended', 'expired')),

  -- Credits system
  ai_credits_remaining integer DEFAULT 10,
  ai_credits_total integer DEFAULT 10,

  -- Payment info
  stripe_customer_id text,
  stripe_subscription_id text,

  -- Timestamps
  subscription_start_date timestamptz,
  subscription_end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Ensure one row per user
  UNIQUE(user_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON public.notification_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_security_settings_user_id ON public.security_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_settings_user_id ON public.billing_settings(user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_settings_updated_at ON public.notification_settings;
CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_security_settings_updated_at ON public.security_settings;
CREATE TRIGGER update_security_settings_updated_at
  BEFORE UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_settings_updated_at ON public.billing_settings;
CREATE TRIGGER update_billing_settings_updated_at
  BEFORE UPDATE ON public.billing_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all new tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones (idempotent approach)
-- RLS Policies for user_preferences
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own preferences" ON public.user_preferences;
CREATE POLICY "Users can delete their own preferences"
  ON public.user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for notification_settings
DROP POLICY IF EXISTS "Users can view their own notification settings" ON public.notification_settings;
CREATE POLICY "Users can view their own notification settings"
  ON public.notification_settings
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notification settings" ON public.notification_settings;
CREATE POLICY "Users can update their own notification settings"
  ON public.notification_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notification settings" ON public.notification_settings;
CREATE POLICY "Users can insert their own notification settings"
  ON public.notification_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notification settings" ON public.notification_settings;
CREATE POLICY "Users can delete their own notification settings"
  ON public.notification_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for security_settings
DROP POLICY IF EXISTS "Users can view their own security settings" ON public.security_settings;
CREATE POLICY "Users can view their own security settings"
  ON public.security_settings
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own security settings" ON public.security_settings;
CREATE POLICY "Users can update their own security settings"
  ON public.security_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own security settings" ON public.security_settings;
CREATE POLICY "Users can insert their own security settings"
  ON public.security_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own security settings" ON public.security_settings;
CREATE POLICY "Users can delete their own security settings"
  ON public.security_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for billing_settings
DROP POLICY IF EXISTS "Users can view their own billing settings" ON public.billing_settings;
CREATE POLICY "Users can view their own billing settings"
  ON public.billing_settings
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own billing settings" ON public.billing_settings;
CREATE POLICY "Users can update their own billing settings"
  ON public.billing_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own billing settings" ON public.billing_settings;
CREATE POLICY "Users can insert their own billing settings"
  ON public.billing_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all billing settings" ON public.billing_settings;
CREATE POLICY "Admins can view all billing settings"
  ON public.billing_settings
  FOR SELECT
  USING (public.is_admin());

-- Comments for clarity
COMMENT ON TABLE public.user_preferences IS 'Stores user-specific preferences including theme, notifications, privacy, and other settings. Created on-demand when users first access their settings page.';
COMMENT ON TABLE public.notification_settings IS 'Stores user notification preferences. Created on-demand when users access notification settings.';
COMMENT ON TABLE public.security_settings IS 'Stores user security settings. Created on-demand when users access security settings.';
COMMENT ON TABLE public.billing_settings IS 'Stores user billing and subscription information. Created on-demand when needed.';
