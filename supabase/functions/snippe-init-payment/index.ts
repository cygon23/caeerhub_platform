import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SNIPPE_API_URL = 'https://api.snippe.sh';
const SNIPPE_API_KEY = Deno.env.get('SNIPPE_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PaymentRequest {
  planKey: string;
  billingPeriod: "monthly" | "yearly";
  phoneNumber: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData: PaymentRequest = await req.json();
    const { planKey, billingPeriod, phoneNumber, userId } = requestData;

    if (!planKey || !billingPeriod || !phoneNumber || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: planKey, billingPeriod, phoneNumber, userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user matches authenticated user
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'User ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('plan_key', planKey)
      .single();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: 'Plan not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get amount based on billing period
    const amount = billingPeriod === 'monthly'
      ? plan.price_monthly_snippe
      : plan.price_yearly_snippe;

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid pricing for this plan and billing period' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate subscription dates
    const start_date = new Date();
    const end_date = new Date(start_date);

    if (billingPeriod === 'monthly') {
      end_date.setMonth(end_date.getMonth() + 1);
    } else if (billingPeriod === 'yearly') {
      end_date.setFullYear(end_date.getFullYear() + 1);
    }

    // Create subscription record (using existing subscriptions table)
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_name: plan.plan_name,
        billing_period: billingPeriod,
        status: 'trialing',
        amount: amount,
        currency: 'TZS',
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
        next_billing_date: end_date.toISOString(),
        payment_method: 'mobile_money',
        phone_number: phoneNumber,
      })
      .select()
      .single();

    if (subError) {
      console.error('Subscription creation error:', subError);
      return new Response(
        JSON.stringify({ error: 'Failed to create subscription', details: subError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create payment record (using existing subscription_payments table)
    const { data: payment, error: payError } = await supabase
      .from('subscription_payments')
      .insert({
        subscription_id: subscription.id,
        user_id: user.id,
        amount: amount,
        currency: 'TZS',
        status: 'pending',
        payment_method: 'mobile_money',
        phone_number: phoneNumber,
        billing_period_start: start_date.toISOString(),
        billing_period_end: end_date.toISOString(),
        metadata: {
          plan_name: plan.plan_name,
          plan_key: planKey,
          billing_period: billingPeriod,
        },
      })
      .select()
      .single();

    if (payError) {
      console.error('Payment record creation error:', payError);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment record', details: payError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile for customer info
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single();

    const firstname = profile?.first_name || 'Customer';
    const lastname = profile?.last_name || 'User';

    // Prepare Snippe.sh API payload
    const snippePayload = {
      payment_type: "mobile",
      details: {
        amount: amount,
        currency: "TZS"
      },
      phone_number: phoneNumber,
      customer: {
        firstname: firstname,
        lastname: lastname,
        email: user.email || ''
      },
      webhook_url: `${SUPABASE_URL}/functions/v1/snippe-webhook`,
      metadata: {
        payment_id: payment.id,
        subscription_id: subscription.id,
        plan_name: plan.plan_name,
        plan_key: planKey,
        billing_period: billingPeriod,
      }
    };

    console.log('Initiating Snippe payment:', JSON.stringify(snippePayload, null, 2));

    // Call Snippe.sh API
    const snippeResponse = await fetch(`${SNIPPE_API_URL}/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SNIPPE_API_KEY}`,
        'Idempotency-Key': `${payment.id}-${Date.now()}`
      },
      body: JSON.stringify(snippePayload)
    });

    const snippeData = await snippeResponse.json();

    console.log('Snippe response:', JSON.stringify(snippeData, null, 2));

    if (!snippeResponse.ok || snippeData.status !== 'success') {
      // Mark payment as failed
      await supabase
        .from('subscription_payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payment initialization failed',
          details: snippeData
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paymentData = snippeData.data;

    // Update payment with Snippe order ID
    await supabase
      .from('subscription_payments')
      .update({
        snippe_order_id: paymentData.reference,
        metadata: {
          ...payment.metadata,
          snippe_response: paymentData,
        },
      })
      .eq('id', payment.id);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        paymentId: payment.id,
        reference: paymentData.reference,
        transactionId: paymentData.reference,
        subscriptionId: subscription.id,
        status: paymentData.status,
        message: 'Payment initiated successfully. Please check your phone to complete the payment.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in snippe-init-payment:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
