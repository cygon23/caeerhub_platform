-- =====================================================
-- MANUAL DATABASE UPDATE FOR SUCCESSFUL PAYMENT
-- =====================================================
-- Run this in Supabase SQL Editor to update your account after successful payment
--
-- PAYMENT DETAILS:
-- Payment Intent: pi_3SYUFTKGU0hfcppg0AGibJPE
-- Amount: TZS 15,000
-- Plan: Student Plan
-- Date: November 28, 2025
-- =====================================================

-- STEP 1: Find your user_id
-- Replace 'your_email@example.com' with YOUR email
DO $$
DECLARE
  v_user_id UUID;
  v_plan_id UUID;
BEGIN
  -- Get your user ID (CHANGE THE EMAIL!)
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'godfreymuganyizi45@gmail.com';  -- ⬅️ CHANGE THIS TO YOUR EMAIL

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found. Please update the email in the script.';
  END IF;

  -- Get Student Plan ID
  SELECT id INTO v_plan_id
  FROM subscription_plans
  WHERE plan_key = 'student';

  -- STEP 2: Update billing_settings
  RAISE NOTICE 'Updating billing settings for user: %', v_user_id;

  UPDATE billing_settings
  SET
    plan_type = 'student',
    plan_tier = 'student',
    subscription_status = 'active',
    subscription_start = NOW(),
    next_billing_date = NOW() + INTERVAL '30 days',
    ai_credits_remaining = 100,  -- Student plan credits
    credits_monthly_allowance = 100,
    last_payment_date = '2025-11-28'::timestamp,
    last_payment_amount = 15000.00,
    payment_failed_count = 0,
    updated_at = NOW()
  WHERE user_id = v_user_id;

  -- STEP 3: Add credits transaction
  RAISE NOTICE 'Adding credit transaction...';

  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    balance_after,
    description,
    metadata,
    created_at
  )
  VALUES (
    v_user_id,
    'subscription_renewal',
    100,  -- Student plan credits
    100,
    'Manual update: Student Plan subscription activated',
    jsonb_build_object(
      'payment_intent', 'pi_3SYUFTKGU0hfcppg0AGibJPE',
      'plan_key', 'student',
      'amount_paid', 15000,
      'manual_update', true,
      'date', '2025-11-28'
    ),
    '2025-11-28'::timestamp
  );

  -- STEP 4: Record the payment
  RAISE NOTICE 'Recording Stripe payment...';

  INSERT INTO stripe_payments (
    user_id,
    stripe_payment_intent_id,
    amount,
    currency,
    status,
    payment_type,
    subscription_period_start,
    subscription_period_end,
    metadata,
    created_at
  )
  VALUES (
    v_user_id,
    'pi_3SYUFTKGU0hfcppg0AGibJPE',
    1500000,  -- Amount in cents (TZS 15,000 = 1,500,000 cents)
    'TZS',
    'succeeded',
    'subscription',
    '2025-11-28'::timestamp,
    '2025-12-28'::timestamp,
    jsonb_build_object(
      'plan_key', 'student',
      'manual_update', true,
      'receipt_number', '2942-0316',
      'invoice_number', 'Z2HVSSYH-0001'
    ),
    '2025-11-28'::timestamp
  );

  RAISE NOTICE '✅ Database updated successfully!';
  RAISE NOTICE 'User is now on Student Plan with 100 AI credits';
END $$;

-- =====================================================
-- VERIFICATION: Check the updates
-- =====================================================
SELECT
  'Billing Settings' as table_name,
  plan_tier as plan,
  subscription_status as status,
  ai_credits_remaining as credits,
  last_payment_amount as last_payment,
  next_billing_date
FROM billing_settings
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'godfreymuganyizi45@gmail.com'  -- ⬅️ CHANGE THIS
);

-- Check credit transaction
SELECT
  'Credit Transaction' as table_name,
  transaction_type,
  amount,
  balance_after,
  description,
  created_at
FROM credit_transactions
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'godfreymuganyizi45@gmail.com'  -- ⬅️ CHANGE THIS
)
ORDER BY created_at DESC
LIMIT 1;

-- Check payment record
SELECT
  'Stripe Payment' as table_name,
  stripe_payment_intent_id,
  amount / 100 as amount_tzs,
  status,
  payment_type,
  created_at
FROM stripe_payments
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'godfreymuganyizi45@gmail.com'  -- ⬅️ CHANGE THIS
)
ORDER BY created_at DESC
LIMIT 1;

-- =====================================================
-- EXPECTED RESULTS:
-- =====================================================
-- table_name          | plan    | status | credits | last_payment | next_billing_date
-- --------------------|---------|--------|---------|--------------|------------------
-- Billing Settings    | student | active | 100     | 15000.00     | 2025-12-28

-- table_name          | transaction_type      | amount | balance_after
-- --------------------|-----------------------|--------|---------------
-- Credit Transaction  | subscription_renewal  | 100    | 100

-- table_name      | stripe_payment_intent_id      | amount_tzs | status
-- ----------------|-------------------------------|------------|----------
-- Stripe Payment  | pi_3SYUFTKGU0hfcppg0AGibJPE  | 15000      | succeeded
