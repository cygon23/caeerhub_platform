# 🎯 Stripe Integration Setup Guide

Complete guide to configure Stripe payments for your pilot payment trial.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Apply Database Migration](#step-1-apply-database-migration)
3. [Step 2: Create Stripe Account](#step-2-create-stripe-account)
4. [Step 3: Create Products & Prices](#step-3-create-products--prices)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Deploy Edge Functions](#step-5-deploy-edge-functions)
7. [Step 6: Set Up Webhooks](#step-6-set-up-webhooks)
8. [Step 7: Test Payment Flow](#step-7-test-payment-flow)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ Supabase project active
- ✅ Database tables created (billing_settings, subscription_plans, etc.)
- ✅ Supabase CLI installed (`npm install -g supabase`)
- ✅ Access to your Supabase dashboard

---

## Step 1: Apply Database Migration

### 1.1 Run the Migration

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase Dashboard → **SQL Editor**
2. Open the migration file: `supabase/migrations/20251128000011_billing_system_functions_and_data.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click **Run**
6. Verify success message appears

**Option B: Using Supabase CLI**

```bash
# From your project root
cd /home/user/caeerhub_platform

# Apply all pending migrations
npx supabase db push

# Or apply specific migration
psql $DATABASE_URL -f supabase/migrations/20251128000011_billing_system_functions_and_data.sql
```

### 1.2 Verify Migration Success

Run this query in SQL Editor to confirm:

```sql
-- Check if functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_name IN (
  'can_use_feature',
  'deduct_credits',
  'add_credits',
  'reset_monthly_credits'
);

-- Check if subscription plans were seeded
SELECT plan_key, plan_name, price_monthly, credits_monthly
FROM subscription_plans
WHERE is_active = true;

-- Should return 3 plans: free, student, professional
```

Expected output:
```
plan_key     | plan_name         | price_monthly | credits_monthly
-------------|-------------------|---------------|----------------
free         | Free Plan         | 0             | 10
student      | Student Plan      | 15000         | 100
professional | Professional Plan | 30000         | 999999
```

---

## Step 2: Create Stripe Account

### 2.1 Sign Up

1. Go to [https://stripe.com](https://stripe.com)
2. Click **Start now** (free account)
3. Complete registration
4. Verify your email

### 2.2 Enable Test Mode

⚠️ **Important:** Start in TEST mode for pilot trials

1. In Stripe Dashboard, toggle **"Viewing test data"** (top right)
2. All API keys should show `sk_test_...` prefix

---

## Step 3: Create Products & Prices

### 3.1 Create Student Plan Product

1. Go to **Products** → **Add product**
2. Fill in details:
   - **Name:** `Student Plan`
   - **Description:** `Unlock advanced AI features and accelerate your career journey`
   - **Pricing model:** `Standard pricing`
   - **Price:** `15,000 TZS` (or your currency)
   - **Billing period:** `Monthly`
   - Click **Save product**

3. **Copy the Price ID** (starts with `price_...`)
   - Example: `price_1NXYZabcdefg123456`
   - You'll need this later!

### 3.2 Create Professional Plan Product

1. Go to **Products** → **Add product**
2. Fill in details:
   - **Name:** `Professional Plan`
   - **Description:** `Ultimate career acceleration with unlimited AI and personal coaching`
   - **Pricing model:** `Standard pricing`
   - **Price:** `30,000 TZS`
   - **Billing period:** `Monthly`
   - Click **Save product**

3. **Copy the Price ID** (starts with `price_...`)

### 3.3 Update Database with Stripe Price IDs

Run this in Supabase SQL Editor:

```sql
-- Update Student Plan
UPDATE subscription_plans
SET stripe_price_id = 'price_YOUR_STUDENT_PRICE_ID_HERE'
WHERE plan_key = 'student';

-- Update Professional Plan
UPDATE subscription_plans
SET stripe_price_id = 'price_YOUR_PROFESSIONAL_PRICE_ID_HERE'
WHERE plan_key = 'professional';

-- Verify
SELECT plan_key, stripe_price_id FROM subscription_plans WHERE plan_key != 'free';
```

---

## Step 4: Configure Environment Variables

### 4.1 Get Stripe API Keys

1. In Stripe Dashboard → **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`)
4. Click **Reveal test key token** if needed

### 4.2 Add to Supabase Edge Functions

```bash
# Set Stripe secret key (for Edge Functions)
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Verify it was set
npx supabase secrets list
```

### 4.3 Add to Your Frontend (.env)

Create or update `.env.local` in your project root:

```env
# Stripe Public Key (for frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Supabase (if not already set)
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Step 5: Deploy Edge Functions

### 5.1 Deploy All Stripe Functions

```bash
# Deploy create-checkout-session
npx supabase functions deploy create-checkout-session

# Deploy create-portal-session
npx supabase functions deploy create-portal-session

# Deploy stripe-webhook-handler
npx supabase functions deploy stripe-webhook-handler

# Deploy purchase-credits (optional, for one-time purchases)
npx supabase functions deploy purchase-credits
```

### 5.2 Verify Deployment

1. Go to Supabase Dashboard → **Edge Functions**
2. You should see all 4 functions listed
3. Click each function → **Details** to see the URL

Example URLs:
```
https://YOUR_PROJECT.supabase.co/functions/v1/create-checkout-session
https://YOUR_PROJECT.supabase.co/functions/v1/create-portal-session
https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook-handler
```

---

## Step 6: Set Up Webhooks

### 6.1 Get Webhook URL

Your webhook URL format:
```
https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook-handler
```

### 6.2 Create Webhook in Stripe

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Paste your webhook URL
4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Click **Add endpoint**

### 6.3 Get Webhook Signing Secret

1. After creating webhook, click on it
2. Click **Reveal** under "Signing secret"
3. Copy the secret (starts with `whsec_...`)

### 6.4 Add Webhook Secret to Supabase

```bash
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### 6.5 Restart Edge Functions

```bash
# Redeploy webhook handler to pick up new secret
npx supabase functions deploy stripe-webhook-handler
```

---

## Step 7: Test Payment Flow

### 7.1 Use Stripe Test Cards

Stripe provides test card numbers that simulate different scenarios:

**Successful Payment:**
```
Card Number:  4242 4242 4242 4242
Expiry:       Any future date (e.g., 12/25)
CVC:          Any 3 digits (e.g., 123)
ZIP:          Any 5 digits (e.g., 12345)
```

**Payment Fails:**
```
Card Number:  4000 0000 0000 0002
```

**Payment Requires Authentication (3D Secure):**
```
Card Number:  4000 0025 0000 3155
```

[More test cards](https://stripe.com/docs/testing#cards)

### 7.2 Test the Complete Flow

1. **Navigate to Billing:**
   - Log into your app
   - Go to Settings → Billing

2. **Initiate Upgrade:**
   - Click "Upgrade Now" on Student Plan
   - Should redirect to Stripe Checkout

3. **Complete Payment:**
   - Use test card: `4242 4242 4242 4242`
   - Fill in test details
   - Click "Pay"

4. **Verify Success:**
   - Should redirect back to your app
   - Check billing page shows upgraded plan
   - Verify credits updated

5. **Check Database:**
```sql
-- Check billing settings updated
SELECT
  plan_tier,
  subscription_status,
  ai_credits_remaining,
  stripe_customer_id,
  stripe_subscription_id
FROM billing_settings
WHERE user_id = 'YOUR_USER_ID';

-- Check payment recorded
SELECT * FROM stripe_payments
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 1;

-- Check webhook events
SELECT event_type, status, processed_at
FROM webhook_events
ORDER BY created_at DESC
LIMIT 5;
```

### 7.3 Test Subscription Management

1. Go to Billing → Click "Manage"
2. Should open Stripe Customer Portal
3. Test:
   - Updating payment method
   - Viewing invoices
   - Cancelling subscription

---

## 🎉 Success Checklist

Before going live with pilot trial, verify:

- [ ] ✅ Migration applied successfully
- [ ] ✅ Subscription plans visible in database
- [ ] ✅ Stripe products created with correct prices
- [ ] ✅ Database updated with Stripe Price IDs
- [ ] ✅ Environment variables set (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
- [ ] ✅ All 4 Edge Functions deployed
- [ ] ✅ Webhook endpoint created in Stripe
- [ ] ✅ Test payment completes successfully
- [ ] ✅ User's plan upgrades in database
- [ ] ✅ Credits added correctly
- [ ] ✅ Webhook events logged
- [ ] ✅ Customer portal works

---

## Troubleshooting

### Error: "Failed to start checkout process"

**Cause:** Edge function not deployed or API key missing

**Fix:**
```bash
# Check if function is deployed
npx supabase functions list

# Redeploy
npx supabase functions deploy create-checkout-session

# Verify secrets
npx supabase secrets list
```

### Error: "stripe_price_id cannot be null"

**Cause:** Price IDs not updated in database

**Fix:**
```sql
-- Check current values
SELECT plan_key, stripe_price_id FROM subscription_plans;

-- Update with your Stripe price IDs
UPDATE subscription_plans
SET stripe_price_id = 'price_YOUR_PRICE_ID'
WHERE plan_key = 'student';
```

### Webhook Not Triggering

**Symptoms:** Payment succeeds but plan doesn't upgrade

**Diagnosis:**
1. Check Stripe Dashboard → Webhooks → Click your endpoint
2. See "Recent deliveries" - any failures?

**Common Fixes:**
```bash
# 1. Verify webhook secret is set
npx supabase secrets list

# 2. Check Edge Function logs
npx supabase functions logs stripe-webhook-handler

# 3. Redeploy webhook handler
npx supabase functions deploy stripe-webhook-handler
```

### Credits Not Added After Payment

**Check webhook events table:**
```sql
SELECT * FROM webhook_events
WHERE event_type = 'checkout.session.completed'
ORDER BY created_at DESC
LIMIT 5;
```

If status is "failed", check error_message column.

### "Customer not found" Error

**Cause:** Stripe customer ID not saved

**Fix:**
```sql
-- Check if customer ID exists
SELECT user_id, stripe_customer_id
FROM billing_settings
WHERE user_id = 'YOUR_USER_ID';

-- If null, customer creation failed
-- Try checkout again - function will create new customer
```

---

## 📞 Need Help?

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Test Cards:** [https://stripe.com/docs/testing](https://stripe.com/docs/testing)
- **Supabase Edge Functions:** [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

---

## 🚀 Going Live (Production)

When ready to accept real payments:

1. **Switch to Live Mode in Stripe**
   - Toggle off "Viewing test data"
   - Complete account verification (business details, banking info)

2. **Get Live API Keys**
   - Copy live publishable key (`pk_live_...`)
   - Copy live secret key (`sk_live_...`)

3. **Update Environment Variables**
```bash
# Update Supabase secrets with LIVE keys
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY

# Update frontend .env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
```

4. **Create Live Products**
   - Recreate products in Live mode
   - Update database with new LIVE price IDs

5. **Set Up Live Webhook**
   - Create new webhook endpoint in Stripe (Live mode)
   - Update STRIPE_WEBHOOK_SECRET with live secret

6. **Deploy to Production**
```bash
# Redeploy functions with live secrets
npx supabase functions deploy create-checkout-session
npx supabase functions deploy stripe-webhook-handler
npx supabase functions deploy create-portal-session
```

---

**Last Updated:** November 28, 2025
**Version:** 1.0
