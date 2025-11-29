-- =====================================================
-- BILLING SYSTEM: Functions, Policies, and Initial Data
-- =====================================================
-- This migration sets up the complete billing and credit system
-- with all necessary functions, RLS policies, and seed data

-- =====================================================
-- PART 1: Database Functions
-- =====================================================

-- Function: Check if user can use a feature
CREATE OR REPLACE FUNCTION can_use_feature(
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
    RETURN QUERY SELECT FALSE, 'No billing settings found', 0, v_feature_cost, 0, v_usage_limit;
    RETURN;
  END IF;

  -- Get plan details
  SELECT * INTO v_plan
  FROM subscription_plans
  WHERE plan_key = v_billing.plan_tier;

  -- Check if user has enough credits
  IF v_billing.ai_credits_remaining < v_feature_cost THEN
    RETURN QUERY SELECT
      FALSE,
      'Insufficient credits',
      v_billing.ai_credits_remaining,
      v_feature_cost,
      v_usage_count,
      v_usage_limit;
    RETURN;
  END IF;

  -- Check subscription status
  IF v_billing.subscription_status NOT IN ('active', 'trialing') THEN
    RETURN QUERY SELECT
      FALSE,
      'Subscription not active',
      v_billing.ai_credits_remaining,
      v_feature_cost,
      v_usage_count,
      v_usage_limit;
    RETURN;
  END IF;

  -- All checks passed
  RETURN QUERY SELECT
    TRUE,
    'Can use feature',
    v_billing.ai_credits_remaining,
    v_feature_cost,
    v_usage_count,
    v_usage_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Deduct credits after using a feature
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_feature_key TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_reference_table TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  success BOOLEAN,
  new_balance INTEGER,
  transaction_id UUID
) AS $$
DECLARE
  v_credits_to_deduct INTEGER := 1;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Deduct credits from billing_settings
  UPDATE billing_settings
  SET
    ai_credits_remaining = GREATEST(ai_credits_remaining - v_credits_to_deduct, 0),
    ai_credits_used = ai_credits_used + v_credits_to_deduct,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING ai_credits_remaining INTO v_new_balance;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, NULL::UUID;
    RETURN;
  END IF;

  -- Create transaction record
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    balance_after,
    feature_used,
    reference_id,
    reference_table,
    description,
    metadata
  )
  VALUES (
    p_user_id,
    'deduction',
    -v_credits_to_deduct,
    v_new_balance,
    p_feature_key,
    p_reference_id,
    p_reference_table,
    'Used ' || p_feature_key,
    p_metadata
  )
  RETURNING id INTO v_transaction_id;

  RETURN QUERY SELECT TRUE, v_new_balance, v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Add credits (for purchases or renewals)
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  success BOOLEAN,
  new_balance INTEGER,
  transaction_id UUID
) AS $$
DECLARE
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Add credits to billing_settings
  UPDATE billing_settings
  SET
    ai_credits_remaining = ai_credits_remaining + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING ai_credits_remaining INTO v_new_balance;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, NULL::UUID;
    RETURN;
  END IF;

  -- Create transaction record
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    balance_after,
    description,
    metadata
  )
  VALUES (
    p_user_id,
    p_transaction_type,
    p_amount,
    v_new_balance,
    COALESCE(p_description, 'Credits added'),
    p_metadata
  )
  RETURNING id INTO v_transaction_id;

  RETURN QUERY SELECT TRUE, v_new_balance, v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Reset monthly credits (called by subscription renewal)
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $$
BEGIN
  UPDATE billing_settings
  SET
    ai_credits_remaining = credits_monthly_allowance,
    ai_credits_used = 0,
    api_calls_this_month = 0,
    updated_at = NOW()
  WHERE
    subscription_status = 'active'
    AND next_billing_date <= NOW()
    AND plan_tier != 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Initialize billing settings for new user
CREATE OR REPLACE FUNCTION initialize_user_billing()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO billing_settings (
    user_id,
    plan_type,
    plan_tier,
    subscription_status,
    ai_credits_remaining,
    credits_monthly_allowance,
    monthly_api_limit,
    monthly_storage_limit_mb,
    auto_renew
  )
  VALUES (
    NEW.id,
    'free',
    'free',
    'active',
    10,  -- Free tier starting credits
    10,  -- Free tier monthly allowance
    100, -- Free tier API limit
    100, -- Free tier storage limit
    true
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create billing settings for new users
DROP TRIGGER IF EXISTS trigger_initialize_billing ON auth.users;
CREATE TRIGGER trigger_initialize_billing
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_billing();

-- =====================================================
-- PART 2: Credit Transactions Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  feature_used TEXT,
  reference_id UUID,
  reference_table TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT credit_transactions_type_check CHECK (
    transaction_type IN (
      'deduction',
      'purchase',
      'subscription_renewal',
      'bonus',
      'refund',
      'adjustment'
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user
  ON public.credit_transactions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_type
  ON public.credit_transactions(transaction_type);

COMMENT ON TABLE public.credit_transactions IS 'Tracks all credit additions and deductions for users';

-- =====================================================
-- PART 3: Row Level Security Policies
-- =====================================================

-- Enable RLS on all billing tables
ALTER TABLE public.billing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Billing Settings Policies
CREATE POLICY "Users can view their own billing settings"
  ON public.billing_settings
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own billing settings"
  ON public.billing_settings
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can manage all billing settings"
  ON public.billing_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
    )
  );

-- Subscription Plans Policies
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage subscription plans"
  ON public.subscription_plans
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
    )
  );

-- Stripe Payments Policies
CREATE POLICY "Users can view their own payment history"
  ON public.stripe_payments
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payments"
  ON public.stripe_payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'school_admin')
    )
  );

-- Credit Transactions Policies
CREATE POLICY "Users can view their own credit transactions"
  ON public.credit_transactions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert credit transactions"
  ON public.credit_transactions
  FOR INSERT
  WITH CHECK (true);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Promo Codes Policies (view only for users)
CREATE POLICY "Users can view active promo codes"
  ON public.promo_codes
  FOR SELECT
  USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
    )
  );

-- Webhook Events Policies (admin only)
CREATE POLICY "Admins can view webhook events"
  ON public.webhook_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
    )
  );

-- =====================================================
-- PART 4: Seed Subscription Plans
-- =====================================================

-- Insert default subscription plans
INSERT INTO public.subscription_plans (
  plan_key,
  plan_name,
  price_monthly,
  price_yearly,
  credits_monthly,
  credits_bonus_signup,
  max_api_calls_monthly,
  max_storage_mb,
  features_included,
  description,
  is_popular,
  display_order,
  is_active
) VALUES
-- Free Plan
(
  'free',
  'Free Plan',
  0,
  0,
  10,
  0,
  100,
  100,
  '{
    "career_assessment": true,
    "basic_job_matching": true,
    "learning_modules_limited": true,
    "community_access": true
  }'::jsonb,
  'Perfect for exploring career options and getting started',
  false,
  1,
  true
),
-- Student Plan
(
  'student',
  'Student Plan',
  15000,
  150000,
  100,
  20,
  1000,
  1000,
  '{
    "career_assessment": true,
    "advanced_job_matching": true,
    "ai_resume_builder": true,
    "unlimited_learning_modules": true,
    "ai_career_insights": true,
    "interview_preparation": true,
    "priority_support": true,
    "mentor_matching": true,
    "skill_assessments": true
  }'::jsonb,
  'Unlock advanced AI features and accelerate your career journey',
  true,
  2,
  true
),
-- Professional Plan
(
  'professional',
  'Professional Plan',
  30000,
  300000,
  999999,
  50,
  10000,
  5000,
  '{
    "career_assessment": true,
    "advanced_job_matching": true,
    "ai_resume_builder": true,
    "unlimited_learning_modules": true,
    "ai_career_insights": true,
    "interview_preparation": true,
    "personal_career_coach": true,
    "priority_support": true,
    "mentor_matching": true,
    "skill_assessments": true,
    "unlimited_ai_credits": true,
    "job_application_tracking": true,
    "salary_negotiation_tools": true,
    "networking_opportunities": true
  }'::jsonb,
  'Ultimate career acceleration with unlimited AI and personal coaching',
  false,
  3,
  true
)
ON CONFLICT (plan_key) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  credits_monthly = EXCLUDED.credits_monthly,
  features_included = EXCLUDED.features_included,
  description = EXCLUDED.description,
  is_popular = EXCLUDED.is_popular,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- =====================================================
-- PART 5: Sample Promo Codes
-- =====================================================

INSERT INTO public.promo_codes (
  code,
  description,
  discount_type,
  discount_value,
  applies_to,
  max_uses,
  max_uses_per_user,
  valid_from,
  valid_until,
  is_active
) VALUES
(
  'WELCOME2025',
  'Welcome bonus for new users - 20% off first month',
  'percentage',
  20,
  'first_payment',
  1000,
  1,
  NOW(),
  NOW() + INTERVAL '3 months',
  true
),
(
  'STUDENT50',
  'Special discount for students - 50% off student plan',
  'percentage',
  50,
  'student',
  500,
  1,
  NOW(),
  NOW() + INTERVAL '6 months',
  true
)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- PART 6: Comments for Documentation
-- =====================================================

COMMENT ON FUNCTION can_use_feature IS 'Checks if a user has sufficient credits and permissions to use a feature';
COMMENT ON FUNCTION deduct_credits IS 'Deducts credits from user account and creates transaction record';
COMMENT ON FUNCTION add_credits IS 'Adds credits to user account (purchases, bonuses, renewals)';
COMMENT ON FUNCTION reset_monthly_credits IS 'Resets monthly credit allowance for active subscriptions';
COMMENT ON FUNCTION initialize_user_billing IS 'Automatically creates billing settings when new user signs up';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE ' Billing system setup complete!';
  RAISE NOTICE ' Functions created: can_use_feature, deduct_credits, add_credits, reset_monthly_credits';
  RAISE NOTICE ' RLS policies enabled on all billing tables';
  RAISE NOTICE ' Default subscription plans seeded';
  RAISE NOTICE ' Sample promo codes created';
END $$;
