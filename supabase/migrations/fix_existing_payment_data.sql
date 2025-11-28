-- Fix existing payment data for user who already paid
-- This script manually updates the billing_settings for the user who successfully paid
-- Based on Stripe webhook event: evt_1SYXV0KGU0hfcppgjRH2RXL3
-- User ID: e4786876-58d7-40e4-842b-29be4ea2e0c7
-- Stripe Customer: cus_TNuXdvnBvyP09t
-- Stripe Subscription: sub_1SYXUwKGU0hfcppgHreMliNC

-- Update billing_settings to reflect the Student plan purchase
UPDATE public.billing_settings
SET
  plan_type = 'student',
  plan_tier = 'student',
  subscription_status = 'active',
  stripe_subscription_id = 'sub_1SYXUwKGU0hfcppgHreMliNC',
  subscription_start = '2025-11-28 22:38:34'::timestamp with time zone, -- Event created timestamp
  next_billing_date = '2025-11-28 22:38:34'::timestamp with time zone + INTERVAL '30 days',
  last_payment_date = '2025-11-28 22:38:34'::timestamp with time zone,
  last_payment_amount = 15000, -- TZS 15,000 (1,500,000 cents / 100)
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
    'stripe_subscription_id', 'sub_1SYXUwKGU0hfcppgHreMliNC',
    'stripe_event_id', 'evt_1SYXV0KGU0hfcppgjRH2RXL3',
    'manual_fix', true,
    'reason', 'Webhook async error - manual correction after fix deployed'
  )
WHERE NOT EXISTS (
  SELECT 1 FROM public.credit_transactions
  WHERE user_id = 'e4786876-58d7-40e4-842b-29be4ea2e0c7'::uuid
  AND transaction_type = 'subscription_renewal'
  AND description LIKE '%Student Plan%'
);

-- Record the payment in stripe_payments table
-- Note: Payment method details will be populated when webhook is replayed after deployment
INSERT INTO public.stripe_payments (
  user_id,
  stripe_invoice_id,
  amount,
  currency,
  status,
  payment_type,
  subscription_period_start,
  subscription_period_end,
  metadata
)
SELECT
  'e4786876-58d7-40e4-842b-29be4ea2e0c7'::uuid,
  'in_1SYXUwKGU0hfcppgBwfhbeEs',
  1500000, -- Amount in cents
  'tzs',
  'succeeded',
  'subscription',
  '2025-11-28 22:38:34'::timestamp with time zone,
  '2025-11-28 22:38:34'::timestamp with time zone + INTERVAL '30 days',
  jsonb_build_object(
    'plan_key', 'student',
    'stripe_event_id', 'evt_1SYXV0KGU0hfcppgjRH2RXL3',
    'stripe_subscription_id', 'sub_1SYXUwKGU0hfcppgHreMliNC',
    'manual_fix', true
  )
WHERE NOT EXISTS (
  SELECT 1 FROM public.stripe_payments
  WHERE stripe_invoice_id = 'in_1SYXUwKGU0hfcppgBwfhbeEs'
);

-- Verification query - run this to confirm the update
SELECT
  user_id,
  plan_tier,
  subscription_status,
  stripe_subscription_id,
  last_payment_amount,
  next_billing_date
FROM public.billing_settings
WHERE user_id = 'e4786876-58d7-40e4-842b-29be4ea2e0c7'::uuid;
