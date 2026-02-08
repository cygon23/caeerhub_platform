-- Migration: Add Snipe.sh Payment Support
-- Created: 2026-02-08
-- Description: Extends existing billing tables to support both Stripe and Snipe.sh payments

-- ============================================
-- 1. Extend billing_settings table
-- ============================================
ALTER TABLE public.billing_settings
ADD COLUMN IF NOT EXISTS payment_provider text DEFAULT 'stripe'
  CHECK (payment_provider IN ('stripe', 'snippe')),
ADD COLUMN IF NOT EXISTS snippe_payment_reference text,
ADD COLUMN IF NOT EXISTS mobile_number text,
ADD COLUMN IF NOT EXISTS mobile_provider text
  CHECK (mobile_provider IN ('mpesa', 'airtel', 'tigo', 'halopesa', NULL)),
ADD COLUMN IF NOT EXISTS last_payment_provider text;

COMMENT ON COLUMN billing_settings.payment_provider IS 'Primary payment provider (stripe or snippe)';
COMMENT ON COLUMN billing_settings.snippe_payment_reference IS 'Latest Snipe.sh payment reference ID';
COMMENT ON COLUMN billing_settings.mobile_number IS 'Tanzanian mobile number for mobile money payments';
COMMENT ON COLUMN billing_settings.mobile_provider IS 'Mobile money provider (auto-detected by Snipe.sh)';

-- ============================================
-- 2. Extend subscription_plans table
-- ============================================
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS price_monthly_snippe numeric(10,2),
ADD COLUMN IF NOT EXISTS price_yearly_snippe numeric(10,2),
ADD COLUMN IF NOT EXISTS snippe_enabled boolean DEFAULT false;

COMMENT ON COLUMN subscription_plans.price_monthly_snippe IS 'Monthly price in TSh for Snipe.sh mobile money';
COMMENT ON COLUMN subscription_plans.price_yearly_snippe IS 'Yearly price in TSh for Snipe.sh mobile money';
COMMENT ON COLUMN subscription_plans.snippe_enabled IS 'Whether this plan supports Snipe.sh payments';

-- ============================================
-- 3. Create snippe_payments table
-- ============================================
CREATE TABLE IF NOT EXISTS public.snippe_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Payment details
  payment_reference text NOT NULL UNIQUE,
  phone_number text NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'TZS',

  -- Status tracking
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  -- Snipe.sh response data
  snippe_transaction_id text,
  snippe_response jsonb,

  -- Subscription info
  plan_key text NOT NULL,
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),

  -- Provider info
  mobile_provider text CHECK (mobile_provider IN ('mpesa', 'airtel', 'tigo', 'halopesa')),

  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz,

  -- Indexes
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_snippe_payments_user_id ON public.snippe_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_snippe_payments_reference ON public.snippe_payments(payment_reference);
CREATE INDEX IF NOT EXISTS idx_snippe_payments_status ON public.snippe_payments(status);
CREATE INDEX IF NOT EXISTS idx_snippe_payments_created_at ON public.snippe_payments(created_at DESC);

COMMENT ON TABLE snippe_payments IS 'Tracks all Snipe.sh mobile money payment transactions';

-- ============================================
-- 4. Create snippe_subscriptions table
-- ============================================
CREATE TABLE IF NOT EXISTS public.snippe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Subscription details
  plan_key text NOT NULL,
  plan_name text NOT NULL,
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),

  -- Pricing
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'TZS',

  -- Status
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'suspended')),

  -- Dates
  start_date timestamptz,
  end_date timestamptz,
  next_billing_date timestamptz,
  cancelled_at timestamptz,

  -- Payment reference
  payment_id uuid REFERENCES public.snippe_payments(id) ON DELETE SET NULL,

  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_snippe_subscriptions_user_id ON public.snippe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_snippe_subscriptions_status ON public.snippe_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_snippe_subscriptions_end_date ON public.snippe_subscriptions(end_date);

COMMENT ON TABLE snippe_subscriptions IS 'Manages subscriptions purchased through Snipe.sh';

-- ============================================
-- 5. Create function to update subscription on payment
-- ============================================
CREATE OR REPLACE FUNCTION public.activate_snippe_subscription(
  p_payment_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment snippe_payments%ROWTYPE;
  v_subscription_id uuid;
  v_end_date timestamptz;
  v_next_billing_date timestamptz;
BEGIN
  -- Get payment details
  SELECT * INTO v_payment
  FROM snippe_payments
  WHERE id = p_payment_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found';
  END IF;

  -- Calculate dates based on billing period
  IF v_payment.billing_period = 'monthly' THEN
    v_end_date := now() + interval '1 month';
    v_next_billing_date := now() + interval '1 month';
  ELSE
    v_end_date := now() + interval '1 year';
    v_next_billing_date := now() + interval '1 year';
  END IF;

  -- Create or update subscription
  INSERT INTO snippe_subscriptions (
    user_id,
    plan_key,
    plan_name,
    billing_period,
    amount,
    status,
    start_date,
    end_date,
    next_billing_date,
    payment_id
  )
  VALUES (
    v_payment.user_id,
    v_payment.plan_key,
    v_payment.plan_key,
    v_payment.billing_period,
    v_payment.amount,
    'active',
    now(),
    v_end_date,
    v_next_billing_date,
    p_payment_id
  )
  ON CONFLICT (user_id, plan_key)
  DO UPDATE SET
    status = 'active',
    start_date = now(),
    end_date = v_end_date,
    next_billing_date = v_next_billing_date,
    updated_at = now()
  RETURNING id INTO v_subscription_id;

  -- Update billing_settings
  UPDATE billing_settings
  SET
    plan_tier = v_payment.plan_key,
    subscription_status = 'active',
    payment_provider = 'snippe',
    snippe_payment_reference = v_payment.payment_reference,
    last_payment_amount = v_payment.amount,
    last_payment_provider = 'snippe',
    next_billing_date = v_next_billing_date,
    updated_at = now()
  WHERE user_id = v_payment.user_id;

END;
$$;

COMMENT ON FUNCTION activate_snippe_subscription IS 'Activates subscription when Snipe.sh payment is completed';

-- ============================================
-- 6. Create trigger to auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION public.update_snippe_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for snippe_payments
DROP TRIGGER IF EXISTS snippe_payments_updated_at ON public.snippe_payments;
CREATE TRIGGER snippe_payments_updated_at
  BEFORE UPDATE ON public.snippe_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_snippe_updated_at();

-- Trigger for snippe_subscriptions
DROP TRIGGER IF EXISTS snippe_subscriptions_updated_at ON public.snippe_subscriptions;
CREATE TRIGGER snippe_subscriptions_updated_at
  BEFORE UPDATE ON public.snippe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_snippe_updated_at();

-- ============================================
-- 7. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.snippe_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippe_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for snippe_payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.snippe_payments;
CREATE POLICY "Users can view own payments" ON public.snippe_payments
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payments" ON public.snippe_payments;
CREATE POLICY "Users can insert own payments" ON public.snippe_payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for snippe_subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.snippe_subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.snippe_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 8. Create helper function to get active subscription
-- ============================================
CREATE OR REPLACE FUNCTION public.get_active_snippe_subscription(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  plan_key text,
  plan_name text,
  status text,
  end_date timestamptz,
  next_billing_date timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.plan_key,
    s.plan_name,
    s.status,
    s.end_date,
    s.next_billing_date
  FROM snippe_subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status = 'active'
    AND s.end_date > now()
  ORDER BY s.end_date DESC
  LIMIT 1;
END;
$$;

-- ============================================
-- 9. Grant necessary permissions
-- ============================================
GRANT SELECT, INSERT ON public.snippe_payments TO authenticated;
GRANT SELECT ON public.snippe_subscriptions TO authenticated;
GRANT EXECUTE ON FUNCTION public.activate_snippe_subscription TO service_role;
GRANT EXECUTE ON FUNCTION public.get_active_snippe_subscription TO authenticated;

-- ============================================
-- Complete
-- ============================================
