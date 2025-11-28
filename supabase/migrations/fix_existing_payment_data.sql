-- Fix existing payment data for user who already paid
-- This script manually updates the billing_settings for the user who successfully paid
-- User ID: e4786876-58d7-40e4-842b-29be4ea2e0c7
-- Stripe Customer: cus_TNuXdvnBvyP09t

-- Update billing_settings to reflect the Student plan purchase
UPDATE public.billing_settings
SET
  plan_type = 'student',
  plan_tier = 'student',
  subscription_status = 'active',
  subscription_start = NOW(),
  next_billing_date = NOW() + INTERVAL '30 days',
  last_payment_date = NOW(),
  last_payment_amount = 15000, -- TZS 15,000 for Student plan
  credits_monthly_allowance = 100,
  ai_credits_remaining = 100
WHERE
  user_id = 'e4786876-58d7-40e4-842b-29be4ea2e0c7'::uuid
  AND stripe_customer_id = 'cus_TNuXdvnBvyP09t';

-- Add credits transaction for the subscription
INSERT INTO public.credit_transactions (
  user_id,
  amount,
  transaction_type,
  description,
  balance_after,
  metadata
)
SELECT
  'e4786876-58d7-40e4-842b-29be4ea2e0c7'::uuid,
  100,
  'subscription_renewal',
  'Subscription activated: Student Plan',
  100,
  jsonb_build_object(
    'plan_key', 'student',
    'manual_fix', true,
    'reason', 'Webhook processing issue - manual correction'
  )
WHERE NOT EXISTS (
  SELECT 1 FROM public.credit_transactions
  WHERE user_id = 'e4786876-58d7-40e4-842b-29be4ea2e0c7'::uuid
  AND transaction_type = 'subscription_renewal'
  AND description LIKE '%Student Plan%'
);

-- NOTE: Payment method details need to be retrieved from Stripe
-- The webhook handler has been updated to store payment method details automatically
-- For this existing payment, you can either:
-- 1. Wait for the next payment to populate the payment method
-- 2. Manually add payment record if you have the Stripe payment intent ID
