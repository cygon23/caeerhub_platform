# 🚀 Stripe Webhook Fix - Deployment Instructions

## ✅ What Was Fixed

1. **Webhook Handler**: Changed from `constructEvent()` to `constructEventAsync()` to fix the async error
2. **Billing Data**: Created SQL script to update current user's data with real subscription ID
3. **UI**: Fixed payment method query to handle empty results gracefully

---

## 📋 Step-by-Step Deployment

### **Step 1: Run the SQL Fix Script** (Do this first!)

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Go to: **SQL Editor**
3. Open the file: `supabase/migrations/fix_existing_payment_data.sql`
4. Copy the entire content and paste into SQL Editor
5. Click **Run**
6. ✅ Verify output shows `plan_tier: 'student'`

**Expected Result:**
```
plan_tier: student
subscription_status: active
stripe_subscription_id: sub_1SYXUwKGU0hfcppgHreMliNC
last_payment_amount: 15000
```

---

### **Step 2: Deploy the Fixed Webhook Handler**

#### **Option A: Using Supabase CLI** (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref pmcxanorldofcazuwefw

# Deploy the webhook function
supabase functions deploy stripe-webhook-handler
```

#### **Option B: Using Supabase Dashboard**

1. Go to: **Edge Functions** in your Supabase Dashboard
2. Find: `stripe-webhook-handler`
3. Click **Edit** or **Create New Version**
4. Copy the content from: `supabase/functions/stripe-webhook-handler/index.ts`
5. Paste and click **Deploy**

---

### **Step 3: Replay the Failed Webhook Event** (Optional but recommended)

This will populate payment method details for the current payment:

1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Find the **Events** tab
4. Search for event ID: `evt_1SYXV0KGU0hfcppgjRH2RXL3`
5. Click the **⋮** (three dots) menu
6. Click **Resend event**
7. ✅ Check that it shows "200 OK" instead of "400 Bad Request"

---

### **Step 4: Verify Everything Works**

1. **Check UI**:
   - Open: http://localhost:8080/dashboard/youth
   - Navigate to Settings → Billing
   - Should show: "Student Plan" (not "Free Plan")
   - Should show: Next billing date and last payment amount

2. **Check Database**:
   ```sql
   -- Run this in Supabase SQL Editor
   SELECT
     plan_tier,
     subscription_status,
     stripe_subscription_id,
     last_payment_amount
   FROM billing_settings
   WHERE user_id = 'e4786876-58d7-40e4-842b-29be4ea2e0c7';
   ```
   Expected: plan_tier = 'student'

3. **Test New Payment** (Optional):
   - Process a test payment using Stripe test mode
   - Verify webhook processes successfully (200 OK in Stripe)
   - Verify billing_settings updates automatically
   - Verify payment_method_details are populated

---

## 🔍 What Changed

### File: `supabase/functions/stripe-webhook-handler/index.ts`
**Line 17**: Changed from `constructEvent()` to `constructEventAsync()`

```diff
- const event = stripe.webhooks.constructEvent(
+ const event = await stripe.webhooks.constructEventAsync(
```

**Why**: Stripe's newer API version requires async webhook verification

---

### File: `supabase/migrations/fix_existing_payment_data.sql`
**New file**: Updates existing user data with:
- Subscription ID: `sub_1SYXUwKGU0hfcppgHreMliNC`
- Plan tier: `student`
- Payment amount: `15000` TZS
- Credits: `100`
- Creates credit transaction record
- Creates stripe_payments record

---

### File: `src/components/settings/tabs/BillingTab.tsx`
**Line 147**: Changed from `.single()` to `.maybeSingle()`

```diff
- .single();
+ .maybeSingle();
```

**Why**: Prevents 406 error when no payment records exist yet

---

## ✅ Success Criteria

After deployment, the following should work:

- ✅ User sees "Student Plan" in billing UI
- ✅ Next billing date is displayed
- ✅ Last payment amount shows "TZS 15,000"
- ✅ New payments automatically update database via webhook
- ✅ Payment method details are captured and displayed
- ✅ No more 400/406 errors in browser console
- ✅ Webhook shows "200 OK" in Stripe dashboard

---

## 🆘 Troubleshooting

### Issue: SQL script fails to run
**Solution**: Check that the user_id exists in your database. Update the UUID in the script if needed.

### Issue: Webhook still shows 400 error after deployment
**Solution**:
1. Clear Supabase Edge Function cache
2. Wait 30 seconds for deployment to propagate
3. Retry the webhook event

### Issue: UI still shows "Free Plan"
**Solution**:
1. Verify SQL script ran successfully
2. Hard refresh the page (Ctrl+Shift+R)
3. Check browser console for errors

### Issue: Payment method not showing
**Solution**:
1. Replay the webhook event from Stripe
2. Or wait for the next payment (monthly renewal)
3. The webhook will populate payment method details

---

## 📞 Support

If you encounter any issues:
1. Check Supabase Edge Function logs
2. Check Stripe webhook delivery logs
3. Check browser console for errors
4. Verify database tables have correct RLS policies

---

## 🎉 After Deployment

Your billing system will now:
- ✅ Automatically update database when payments succeed
- ✅ Capture payment method details (card brand, last4, etc.)
- ✅ Show real subscription data in UI
- ✅ Handle recurring payments correctly
- ✅ Track credits and usage properly

All future payments will work automatically! 🚀
