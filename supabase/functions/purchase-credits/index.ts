import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2024-11-20.acacia",
});

serve(async (req) => {
  try {
    const { userId, creditAmount, successUrl, cancelUrl } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get customer ID
    const { data: billing } = await supabaseClient
      .from("billing_settings")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (!billing?.stripe_customer_id) {
      throw new Error("Customer not found");
    }

    // Calculate price: TZS 500 = 10 credits → TZS 50 per credit
    const pricePerCredit = 50;
    const totalPrice = creditAmount * pricePerCredit;

    // Create Checkout Session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: billing.stripe_customer_id,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "tzs",
            product_data: {
              name: `${creditAmount} AI Credits`,
              description: "One-time credit purchase",
            },
            unit_amount: totalPrice * 100, // Stripe uses smallest unit (cents)
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        credits_purchased: creditAmount,
        payment_type: "credit_purchase",
      },
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
