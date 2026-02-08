import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SNIPPE_API_KEY = Deno.env.get("SNIPPE_API_KEY");
const SNIPPE_API_URL = "https://api.snippe.sh/v1"; // Update with actual Snipe.sh API URL

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Validate and format Tanzanian phone number
 */
function formatPhoneNumber(phone: string): { valid: boolean; formatted?: string; error?: string } {
  // Remove spaces and special characters
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Handle different formats
  if (cleaned.startsWith('0')) {
    // Convert 0712345678 to 255712345678
    cleaned = '255' + cleaned.substring(1);
  } else if (cleaned.startsWith('+255')) {
    // Convert +255712345678 to 255712345678
    cleaned = cleaned.substring(1);
  } else if (!cleaned.startsWith('255')) {
    return { valid: false, error: 'Phone number must be a valid Tanzanian number' };
  }

  // Validate format: 255 followed by 6XX or 7XX (9 digits total after 255)
  const regex = /^255[67]\d{8}$/;
  if (!regex.test(cleaned)) {
    return { valid: false, error: 'Invalid Tanzanian phone number format. Must be 255 6XX or 7XX' };
  }

  return { valid: true, formatted: cleaned };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, planKey, billingPeriod, phoneNumber } = await req.json();

    // Validate input
    if (!userId || !planKey || !billingPeriod || !phoneNumber) {
      throw new Error("Missing required fields: userId, planKey, billingPeriod, phoneNumber");
    }

    // Validate phone number
    const phoneValidation = formatPhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      throw new Error(phoneValidation.error);
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("plan_key", planKey)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    if (!plan.snippe_enabled) {
      throw new Error("This plan does not support mobile money payments");
    }

    // Calculate amount based on billing period
    const amount = billingPeriod === 'monthly'
      ? plan.price_monthly_snippe
      : plan.price_yearly_snippe;

    if (!amount || amount <= 0) {
      throw new Error("Invalid pricing for this plan");
    }

    // Generate unique payment reference
    const paymentReference = `PMT-${Date.now()}-${userId.substring(0, 8)}`;

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from("snippe_payments")
      .insert({
        user_id: userId,
        payment_reference: paymentReference,
        phone_number: phoneValidation.formatted,
        amount: amount,
        currency: 'TZS',
        status: 'pending',
        plan_key: planKey,
        billing_period: billingPeriod,
        metadata: {
          plan_name: plan.plan_name,
          initiated_at: new Date().toISOString(),
        }
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Database error:", paymentError);
      throw new Error("Failed to create payment record");
    }

    // Initialize payment with Snipe.sh API
    const snippeResponse = await fetch(`${SNIPPE_API_URL}/payments/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SNIPPE_API_KEY!,
      },
      body: JSON.stringify({
        reference: paymentReference,
        amount: amount,
        currency: "TZS",
        phone_number: phoneValidation.formatted,
        description: `${plan.plan_name} - ${billingPeriod} subscription`,
        callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/snippe-webhook`,
        metadata: {
          user_id: userId,
          plan_key: planKey,
          billing_period: billingPeriod,
        }
      }),
    });

    if (!snippeResponse.ok) {
      const errorData = await snippeResponse.json();
      console.error("Snipe.sh API error:", errorData);

      // Update payment status to failed
      await supabaseClient
        .from("snippe_payments")
        .update({
          status: 'failed',
          snippe_response: errorData,
        })
        .eq("id", payment.id);

      throw new Error(errorData.message || "Failed to initialize payment with Snipe.sh");
    }

    const snippeData = await snippeResponse.json();

    // Update payment with Snipe.sh transaction ID
    await supabaseClient
      .from("snippe_payments")
      .update({
        status: 'processing',
        snippe_transaction_id: snippeData.transaction_id,
        snippe_response: snippeData,
      })
      .eq("id", payment.id);

    // Update billing settings with mobile number
    await supabaseClient
      .from("billing_settings")
      .update({
        mobile_number: phoneValidation.formatted,
      })
      .eq("user_id", userId);

    return new Response(
      JSON.stringify({
        success: true,
        paymentId: payment.id,
        reference: paymentReference,
        transactionId: snippeData.transaction_id,
        message: "Payment initiated successfully. Please check your phone to complete the payment.",
        status: "processing",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
