import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2024-11-20.acacia",
});

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, planKey, successUrl, cancelUrl, promoCode } =
      await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user's billing settings
    const { data: billing, error: billingError } = await supabaseClient
      .from("billing_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (billingError) throw billingError;

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("plan_key", planKey)
      .single();

    if (planError || !plan) throw new Error("Plan not found");

    // Create or retrieve Stripe customer
    let customerId = billing.stripe_customer_id;

    if (!customerId) {
      const { data: user } = await supabaseClient.auth.admin.getUserById(
        userId
      );

      const customer = await stripe.customers.create({
        email: user.user?.email,
        metadata: {
          supabase_user_id: userId,
        },
      });

      customerId = customer.id;

      // Save Stripe customer ID
      await supabaseClient
        .from("billing_settings")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId);
    }

    // Build checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        plan_key: planKey,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_key: planKey,
        },
      },
    };

    // Apply promo code if provided
    if (promoCode) {
      const { data: promo } = await supabaseClient
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode)
        .eq("is_active", true)
        .single();

      if (promo && promo.stripe_coupon_id) {
        sessionParams.discounts = [{ coupon: promo.stripe_coupon_id }];
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});