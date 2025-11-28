-- Create audit_logs table for tracking all system actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  category TEXT NOT NULL CHECK (category IN ('authentication', 'user_management', 'system', 'data', 'security', 'school_management', 'student_management')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON public.audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON public.audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON public.audit_logs(success);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin users can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Only system can insert audit logs (via service role)
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource TEXT,
  p_category TEXT,
  p_severity TEXT DEFAULT 'low',
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
  v_user_email TEXT;
  v_user_role TEXT;
BEGIN
  -- Get user email and role
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = p_user_id;

  SELECT role INTO v_user_role
  FROM public.user_roles
  WHERE user_id = p_user_id
  LIMIT 1;

  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id,
    user_email,
    user_role,
    action,
    resource,
    resource_id,
    category,
    severity,
    details,
    success,
    error_message
  ) VALUES (
    p_user_id,
    v_user_email,
    v_user_role,
    p_action,
    p_resource,
    p_resource_id,
    p_category,
    p_severity,
    p_details,
    p_success,
    p_error_message
  ) RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to log authentication events
CREATE OR REPLACE FUNCTION public.log_auth_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Log successful sign in
  IF TG_OP = 'UPDATE' AND NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    PERFORM public.log_audit_event(
      NEW.id,
      'User Login',
      'Authentication',
      'authentication',
      'low',
      NEW.id::TEXT,
      jsonb_build_object('email', NEW.email, 'last_sign_in', NEW.last_sign_in_at),
      true,
      NULL
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auth events (optional - can be enabled if needed)
-- DROP TRIGGER IF EXISTS trigger_log_auth_events ON auth.users;
-- CREATE TRIGGER trigger_log_auth_events
--   AFTER UPDATE ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.log_auth_event();

-- Create materialized view for audit log statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS public.audit_log_stats AS
SELECT
  DATE(timestamp) as log_date,
  category,
  severity,
  success,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.audit_logs
WHERE timestamp >= NOW() - INTERVAL '90 days'
GROUP BY DATE(timestamp), category, severity, success;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_audit_log_stats_date ON public.audit_log_stats(log_date DESC);

-- Create function to refresh audit log stats
CREATE OR REPLACE FUNCTION public.refresh_audit_log_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.audit_log_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions on view
GRANT SELECT ON public.audit_log_stats TO authenticated;

-- Add some initial audit log entries for testing
INSERT INTO public.audit_logs (user_id, user_email, user_role, action, resource, category, severity, details, success)
VALUES
  (NULL, 'system@careerhub.com', 'system', 'System Startup', 'System', 'system', 'low', '{"message": "System initialized"}', true),
  (NULL, 'system@careerhub.com', 'system', 'Database Migration', 'Database', 'system', 'medium', '{"migration": "20251128000001_create_audit_logs"}', true);
