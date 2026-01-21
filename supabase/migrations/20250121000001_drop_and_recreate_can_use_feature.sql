-- Drop all versions of can_use_feature function to resolve overloading conflict
-- This fixes PGRST203 error: "Could not choose the best candidate function"

-- Drop all existing versions (both VARCHAR and TEXT variants)
DROP FUNCTION IF EXISTS public.can_use_feature(uuid, text);
DROP FUNCTION IF EXISTS public.can_use_feature(uuid, varchar);
DROP FUNCTION IF EXISTS public.can_use_feature(uuid, character varying);

-- Recreate with only TEXT type (explicitly cast all return values)
CREATE OR REPLACE FUNCTION public.can_use_feature(
  p_user_id UUID,
  p_feature_key TEXT
)
RETURNS TABLE (
  can_use BOOLEAN,
  reason TEXT,
  credits_available INTEGER,
  credits_required INTEGER,
  usage_count INTEGER,
  usage_limit INTEGER
) AS $$
DECLARE
  v_billing billing_settings%ROWTYPE;
  v_plan subscription_plans%ROWTYPE;
  v_feature_cost INTEGER := 1;
  v_usage_count INTEGER := 0;
  v_usage_limit INTEGER := NULL;
BEGIN
  -- Get user's billing settings
  SELECT * INTO v_billing
  FROM billing_settings
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT
      FALSE::BOOLEAN,
      'No billing settings found'::TEXT,
      0::INTEGER,
      v_feature_cost::INTEGER,
      0::INTEGER,
      v_usage_limit::INTEGER;
    RETURN;
  END IF;

  -- Get plan details
  SELECT * INTO v_plan
  FROM subscription_plans
  WHERE plan_key = v_billing.plan_tier;

  -- Check if user has enough credits
  IF v_billing.ai_credits_remaining < v_feature_cost THEN
    RETURN QUERY SELECT
      FALSE::BOOLEAN,
      'Insufficient credits'::TEXT,
      v_billing.ai_credits_remaining::INTEGER,
      v_feature_cost::INTEGER,
      v_usage_count::INTEGER,
      v_usage_limit::INTEGER;
    RETURN;
  END IF;

  -- Check subscription status
  IF v_billing.subscription_status NOT IN ('active', 'trialing') THEN
    RETURN QUERY SELECT
      FALSE::BOOLEAN,
      'Subscription not active'::TEXT,
      v_billing.ai_credits_remaining::INTEGER,
      v_feature_cost::INTEGER,
      v_usage_count::INTEGER,
      v_usage_limit::INTEGER;
    RETURN;
  END IF;

  -- All checks passed
  RETURN QUERY SELECT
    TRUE::BOOLEAN,
    'Can use feature'::TEXT,
    v_billing.ai_credits_remaining::INTEGER,
    v_feature_cost::INTEGER,
    v_usage_count::INTEGER,
    v_usage_limit::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.can_use_feature IS 'Checks if a user has sufficient credits and permissions to use a feature (fixed overloading conflict)';

-- Verify the function exists and is unique
DO $$
BEGIN
  RAISE NOTICE 'Migration complete: can_use_feature function recreated successfully';
END $$;
