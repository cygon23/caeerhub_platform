# Snipe.sh Mobile Money Payment Integration - Setup Guide

Complete guide to set up Snipe.sh mobile money payments for Tanzanian users alongside existing Stripe integration.

## Overview

This integration adds **local Tanzanian mobile money payments** (M-Pesa, Airtel Money, Tigo Pesa, Halopesa) using **Snipe.sh** while keeping **Stripe for international credit card payments**.

### Payment Options
- 💳 **Stripe** - International credit card payments
- 📱 **Snipe.sh** - Local Tanzanian mobile money payments

### Pricing
**Student Plan:**
- Monthly: TSh 15,000
- Yearly: TSh 153,000 (15% discount)

**Professional Plan:**
- Monthly: TSh 30,000
- Yearly: TSh 306,000 (15% discount)

---

## Step 1: Snipe.sh Account Setup

### Get API Credentials

1. **Sign up** at [Snipe.sh](https://snippe.sh)
2. **Verify your account** and complete KYC
3. Navigate to **Settings → API Keys**
4. Copy your **API Key** (used for both authentication and webhooks)

---

## Step 2: Database Migrations

### Apply Migrations

```bash
# Navigate to project root
cd /home/user/caeerhub_platform

# Link to Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Migrations Applied:
1. **20260208_add_snippe_payment_support.sql**
   - Extends `billing_settings` table with Snipe.sh fields
   - Extends `subscription_plans` with Snipe.sh pricing
   - Creates `snippe_payments` table
   - Creates `snippe_subscriptions` table
   - Adds helper functions and triggers
   - Enables RLS policies

2. **20260208_update_plans_snippe_prices.sql**
   - Updates Student plan: TSh 15,000/month, TSh 153,000/year
   - Updates Professional plan: TSh 30,000/month, TSh 306,000/year

### Verify Tables

```sql
-- Check new tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('snippe_payments', 'snippe_subscriptions');

-- Check billing_settings columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'billing_settings'
AND column_name IN ('payment_provider', 'snippe_payment_reference', 'mobile_number');

-- Check subscription plans pricing
SELECT plan_key, plan_name, price_monthly_snippe, price_yearly_snippe, snippe_enabled
FROM subscription_plans;
```

---

## Step 3: Configure Supabase Edge Functions

### Set Environment Variables

In **Supabase Dashboard → Settings → Edge Functions** or via CLI:

```bash
# Set Snipe.sh API Key
supabase secrets set SNIPPE_API_KEY=your_snippe_api_key_here

# Set webhook URL (will be available after deployment)
supabase secrets set SNIPPE_WEBHOOK_URL=https://your-project-ref.supabase.co/functions/v1/snippe-webhook
```

### Deploy Edge Functions

```bash
# Deploy all three functions
supabase functions deploy snippe-init-payment
supabase functions deploy snippe-webhook
supabase functions deploy snippe-check-status

# Verify deployment
supabase functions list
```

**Functions Deployed:**
- `snippe-init-payment` - Initializes mobile money payment
- `snippe-webhook` - Handles payment status updates from Snipe.sh
- `snippe-check-status` - Manually checks payment status

---

## Step 4: Configure Snipe.sh Webhook

### Add Webhook in Snipe.sh Dashboard

1. Login to [Snipe.sh Dashboard](https://dashboard.snippe.sh)
2. Go to **Settings → Webhooks**
3. Click **Add New Webhook**
4. Configure:
   - **URL**: `https://your-project-ref.supabase.co/functions/v1/snippe-webhook`
   - **Events**: Select "Payment Status Updates"
   - **Secret**: Use your `SNIPPE_API_KEY` (same as authentication)
5. **Save** the webhook

### Test Webhook

```bash
# Test webhook is reachable
curl -X POST https://your-project-ref.supabase.co/functions/v1/snippe-webhook \
  -H "Content-Type: application/json" \
  -H "x-snippe-signature: test" \
  -d '{"event":"test"}'
```

---

## Step 5: Frontend Integration

### Files Updated

1. **src/services/snippePaymentService.ts** - New Snipe.sh payment service
2. **src/components/settings/tabs/BillingTab.tsx** - Will show payment method selection

### Test Phone Numbers (Development)

Snipe.sh provides test numbers for development:
- `255700000000` to `255700000009` - Various test scenarios
- `255712345678` - Success simulation
- `255787654321` - Failure simulation

---

## Step 6: Payment Flow

### User Journey

```
1. User selects subscription plan
   ↓
2. User chooses payment method:
   📱 Mobile Money (Snipe.sh) OR 💳 Credit Card (Stripe)
   ↓
3a. If Mobile Money:
   - Enter Tanzanian phone number (0712345678 or 255712345678)
   - Click "Pay with Mobile Money"
   - Receive payment prompt on phone
   - Complete payment via mobile money
   ↓
4. Snipe.sh webhook updates payment status
   ↓
5. Subscription activated automatically
   ↓
6. User redirected to success page
```

---

## Step 7: Testing

### Test Complete Payment Flow

1. **Navigate to Billing Tab**
   ```
   http://localhost:5173/dashboard/youth (development)
   ```

2. **Select a Plan** (Student or Professional)

3. **Choose "Mobile Money" payment option**

4. **Enter Test Phone Number**
   - Use: `255712345678` (success simulation)

5. **Complete Payment**
   - In test mode, payment completes automatically

6. **Verify Database**
   ```sql
   -- Check payment was created
   SELECT * FROM snippe_payments ORDER BY created_at DESC LIMIT 5;

   -- Check subscription was activated
   SELECT * FROM snippe_subscriptions WHERE status = 'active';

   -- Check billing settings updated
   SELECT user_id, plan_tier, payment_provider, mobile_number
   FROM billing_settings
   WHERE payment_provider = 'snippe';
   ```

---

## Step 8: Production Deployment

### Environment Variables

Update production environment variables:

```bash
# Production Snipe.sh API Key
SNIPPE_API_KEY=your_production_api_key

# Production webhook URL
SNIPPE_WEBHOOK_URL=https://your-production-ref.supabase.co/functions/v1/snippe-webhook
```

### Go Live Checklist

- [ ] Snipe.sh account approved and in production mode
- [ ] Production API keys configured
- [ ] Edge functions deployed to production
- [ ] Webhook URL added in Snipe.sh production dashboard
- [ ] Test with real phone numbers
- [ ] Monitor first few transactions
- [ ] Set up alerts for failed payments

---

## Troubleshooting

### Payment Not Completing

**Check Edge Function Logs:**
```bash
supabase functions logs snippe-init-payment --tail
supabase functions logs snippe-webhook --tail
```

**Common Issues:**
- Invalid phone number format → Must be 255 6XX or 7XX
- Webhook signature mismatch → Check API key matches
- Payment already processed → Check `snippe_payments` table

### Database Issues

**Check RLS Policies:**
```sql
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('snippe_payments', 'snippe_subscriptions');
```

**Check Triggers:**
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table LIKE 'snippe%';
```

---

## Monitoring

### Key Metrics

```sql
-- Payment success rate (last 30 days)
SELECT
  COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*) as success_rate,
  COUNT(*) as total_payments,
  SUM(amount) FILTER (WHERE status = 'completed') as total_revenue
FROM snippe_payments
WHERE created_at > NOW() - INTERVAL '30 days';

-- Payments by provider
SELECT
  mobile_provider,
  COUNT(*) as count,
  SUM(amount) as total
FROM snippe_payments
WHERE status = 'completed'
GROUP BY mobile_provider;

-- Active subscriptions
SELECT
  plan_key,
  billing_period,
  COUNT(*) as count
FROM snippe_subscriptions
WHERE status = 'active'
GROUP BY plan_key, billing_period;
```

---

## Support

### Snipe.sh Support
- **Email**: support@snippe.sh
- **Docs**: https://docs.snippe.sh
- **Dashboard**: https://dashboard.snippe.sh

### Useful Commands

```bash
# Check function deployment status
supabase functions list

# View real-time logs
supabase functions logs snippe-webhook --tail

# Test payment status check
curl -X POST https://your-ref.supabase.co/functions/v1/snippe-check-status \
  -H "Content-Type: application/json" \
  -d '{"paymentId":"payment-uuid-here"}'
```

---

## Next Steps

1. ✅ Apply database migrations
2. ✅ Configure Snipe.sh credentials
3. ✅ Deploy edge functions
4. ✅ Set up webhook
5. ⏳ Update BillingTab UI (next step)
6. ⏳ Test complete payment flow
7. ⏳ Deploy to production

---

**Last Updated**: 2026-02-08
**Version**: 1.0.0
**Status**: Ready for Testing
