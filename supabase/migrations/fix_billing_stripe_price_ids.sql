-- =====================================================
-- QUICK FIX: Add Stripe Price IDs to Enable Payments
-- =====================================================
-- Run this in Supabase SQL Editor to fix the checkout error

-- STEP 1: Check current state
SELECT
  plan_key,
  plan_name,
  price_monthly,
  stripe_price_id,
  CASE
    WHEN stripe_price_id IS NULL THEN '❌ MISSING - Will cause error'
    ELSE '✅ Configured'
  END as status
FROM subscription_plans
WHERE is_active = true
ORDER BY display_order;

-- =====================================================
-- OPTION A: Use Test/Dummy IDs (For Testing UI Only)
-- =====================================================
-- This will enable the buttons and let you test the flow
-- NOTE: Actual payment will still fail, but UI will work

UPDATE subscription_plans
SET stripe_price_id = 'price_test_student_dummy_12345'
WHERE plan_key = 'student';

UPDATE subscription_plans
SET stripe_price_id = 'price_test_professional_dummy_67890'
WHERE plan_key = 'professional';

-- =====================================================
-- OPTION B: Use REAL Stripe Price IDs (For Real Payments)
-- =====================================================
-- Replace these with YOUR actual Stripe price IDs from Stripe Dashboard
-- To get these:
-- 1. Go to Stripe Dashboard → Products
-- 2. Click on each product
-- 3. Copy the Price ID (starts with "price_")

-- UNCOMMENT AND REPLACE WITH YOUR REAL IDS:
/*
UPDATE subscription_plans
SET stripe_price_id = 'price_1234567890abcdefGHIJ'  -- <-- Your Student Plan Price ID
WHERE plan_key = 'student';

UPDATE subscription_plans
SET stripe_price_id = 'price_0987654321zyxwvuTSRQ'  -- <-- Your Professional Plan Price ID
WHERE plan_key = 'professional';
*/

-- =====================================================
-- STEP 2: Verify the fix
-- =====================================================
SELECT
  plan_key,
  plan_name,
  stripe_price_id,
  CASE
    WHEN stripe_price_id IS NOT NULL THEN '✅ Ready'
    ELSE '❌ Still needs configuration'
  END as ready_for_checkout
FROM subscription_plans
WHERE is_active = true
ORDER BY display_order;

-- =====================================================
-- Expected Result After Fix:
-- =====================================================
-- plan_key     | stripe_price_id                    | ready_for_checkout
-- -------------|------------------------------------|-----------------
-- free         | NULL                               | ✅ Ready (free plan doesn't need it)
-- student      | price_1234567890abcdefGHIJ         | ✅ Ready
-- professional | price_0987654321zyxwvuTSRQ         | ✅ Ready

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Free plan doesn't need a stripe_price_id (it's free!)
-- 2. After running this, refresh your billing page
-- 3. The "Setup Required" warning should disappear
-- 4. "Upgrade Now" buttons should work
-- 5. With dummy IDs: Checkout will start but fail at Stripe
-- 6. With real IDs: Full payment flow will work

-- =====================================================
-- TROUBLESHOOTING:
-- =====================================================
-- If you still get errors after adding real Stripe IDs:
-- 1. Verify the price IDs are correct in Stripe Dashboard
-- 2. Make sure Stripe API keys are set in Supabase Edge Functions
-- 3. Check Edge Function logs: Supabase Dashboard → Edge Functions → Logs
