-- Migration: Update Subscription Plans with Snipe.sh Prices
-- Created: 2026-02-08
-- Description: Adds Snipe.sh pricing (TSh 15,000 and TSh 30,000) to existing plans

-- Update Student plan with Snipe.sh prices
UPDATE public.subscription_plans
SET
  price_monthly_snippe = 15000.00,  -- TSh 15,000 per month
  price_yearly_snippe = 153000.00,  -- TSh 15,000 * 12 * 0.85 (15% discount)
  snippe_enabled = true
WHERE plan_key = 'student';

-- Update Professional plan with Snipe.sh prices
UPDATE public.subscription_plans
SET
  price_monthly_snippe = 30000.00,  -- TSh 30,000 per month
  price_yearly_snippe = 306000.00,  -- TSh 30,000 * 12 * 0.85 (15% discount)
  snippe_enabled = true
WHERE plan_key = 'professional';

-- Free plan doesn't need Snipe.sh pricing
UPDATE public.subscription_plans
SET
  snippe_enabled = false
WHERE plan_key = 'free';

-- Verification query (comment out in production)
-- SELECT
--   plan_key,
--   plan_name,
--   price_monthly,
--   price_yearly,
--   price_monthly_snippe,
--   price_yearly_snippe,
--   snippe_enabled
-- FROM subscription_plans
-- ORDER BY display_order;
