import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      webhookSecret
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Log webhook event
    const { data: existingEvent } = await supabaseClient
      .from("webhook_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .single();

    if (existingEvent) {
      // Already processed (idempotency check)
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
      });
    }

    // Insert webhook event log
    await supabaseClient.from("webhook_events").insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event,
      status: "pending",
    });

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, supabaseClient);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, supabaseClient);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, supabaseClient);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, supabaseClient);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabaseClient);
        break;
      }
    }

    // Mark webhook as processed
    await supabaseClient
      .from("webhook_events")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("stripe_event_id", event.id);

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      { status: 400 }
    );
  }
});

// Handler: Checkout completed (new subscription)
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  const userId = session.metadata?.user_id;
  const planKey = session.metadata?.plan_key;

  if (!userId || !planKey) return;

  // Get plan details
  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("plan_key", planKey)
    .single();

  // Get payment method details from PaymentIntent
  let paymentMethodDetails = null;
  let paymentMethodType = null;

  if (session.payment_intent) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent as string,
        { expand: ['payment_method'] }
      );

      if (paymentIntent.payment_method) {
        const pm = paymentIntent.payment_method as Stripe.PaymentMethod;
        paymentMethodType = pm.type;

        // Store detailed payment method info
        if (pm.card) {
          paymentMethodDetails = {
            type: 'card',
            card: {
              brand: pm.card.brand,
              last4: pm.card.last4,
              exp_month: pm.card.exp_month,
              exp_year: pm.card.exp_year,
              funding: pm.card.funding,
            }
          };
        }
      }
    } catch (err) {
      console.error('Error fetching payment method:', err);
    }
  }

  // Update billing_settings with customer ID and payment info
  await supabase
    .from("billing_settings")
    .update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      plan_type: planKey,
      plan_tier: planKey,
      subscription_status: "active",
      subscription_start: new Date().toISOString(),
      next_billing_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // +30 days
      ai_credits_remaining: plan.credits_monthly,
      credits_monthly_allowance: plan.credits_monthly,
      last_payment_date: new Date().toISOString(),
      last_payment_amount: session.amount_total / 100, // Stripe sends in cents
    })
    .eq("user_id", userId);

  // Add credits transaction
  await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: plan.credits_monthly,
    p_transaction_type: "subscription_renewal",
    p_description: `Subscription activated: ${plan.plan_name}`,
    p_metadata: { stripe_session_id: session.id, plan_key: planKey },
  });

  // Record payment with payment method details
  await supabase.from("stripe_payments").insert({
    user_id: userId,
    stripe_payment_intent_id: session.payment_intent,
    stripe_invoice_id: session.invoice,
    amount: session.amount_total,
    currency: session.currency,
    status: "succeeded",
    payment_type: "subscription",
    payment_method: paymentMethodType,
    payment_method_details: paymentMethodDetails,
    subscription_period_start: new Date().toISOString(),
    subscription_period_end: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    metadata: { session_id: session.id, plan_key: planKey },
  });
}

// Handler: Invoice payment succeeded (recurring billing)
async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any
) {
  const customerId = invoice.customer as string;

  // Find user by Stripe customer ID
  const { data: billing } = await supabase
    .from("billing_settings")
    .select("user_id, plan_tier")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!billing) return;

  // Get plan
  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("plan_key", billing.plan_tier)
    .single();

  // Get payment method details from PaymentIntent
  let paymentMethodDetails = null;
  let paymentMethodType = null;

  if (invoice.payment_intent) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        invoice.payment_intent as string,
        { expand: ['payment_method'] }
      );

      if (paymentIntent.payment_method) {
        const pm = paymentIntent.payment_method as Stripe.PaymentMethod;
        paymentMethodType = pm.type;

        if (pm.card) {
          paymentMethodDetails = {
            type: 'card',
            card: {
              brand: pm.card.brand,
              last4: pm.card.last4,
              exp_month: pm.card.exp_month,
              exp_year: pm.card.exp_year,
              funding: pm.card.funding,
            }
          };
        }
      }
    } catch (err) {
      console.error('Error fetching payment method:', err);
    }
  }

  // Update billing
  await supabase
    .from("billing_settings")
    .update({
      subscription_status: "active",
      last_payment_date: new Date().toISOString(),
      last_payment_amount: invoice.amount_paid / 100,
      next_billing_date: new Date(invoice.period_end * 1000).toISOString(),
      payment_failed_count: 0, // Reset failure counter
    })
    .eq("user_id", billing.user_id);

  // Reset monthly credits via stored procedure
  await supabase.rpc("reset_monthly_credits");

  // Record payment with payment method details
  await supabase.from("stripe_payments").insert({
    user_id: billing.user_id,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: invoice.payment_intent,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: "succeeded",
    payment_type: "subscription",
    payment_method: paymentMethodType,
    payment_method_details: paymentMethodDetails,
    subscription_period_start: new Date(
      invoice.period_start * 1000
    ).toISOString(),
    subscription_period_end: new Date(invoice.period_end * 1000).toISOString(),
  });
}

// Handler: Invoice payment failed
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: any
) {
  const customerId = invoice.customer as string;

  const { data: billing } = await supabase
    .from("billing_settings")
    .select("user_id, payment_failed_count")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!billing) return;

  const failureCount = (billing.payment_failed_count || 0) + 1;

  // Update billing
  await supabase
    .from("billing_settings")
    .update({
      subscription_status: failureCount >= 3 ? "past_due" : "active",
      payment_failed_count: failureCount,
      last_payment_failure_date: new Date().toISOString(),
      grace_period_ends_at: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 7-day grace
    })
    .eq("user_id", billing.user_id);

  // Create notification
  await supabase.from("notifications").insert({
    user_id: billing.user_id,
    title: "Payment Failed",
    message: `Your payment of TZS ${
      invoice.amount_due / 100
    } failed. Please update your payment method.`,
    type: "error",
    action_url: "/dashboard/settings/billing",
  });
}

// Handler: Subscription updated
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const customerId = subscription.customer as string;

  const { data: billing } = await supabase
    .from("billing_settings")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!billing) return;

  await supabase
    .from("billing_settings")
    .update({
      subscription_status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      subscription_end: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null,
    })
    .eq("user_id", billing.user_id);
}

// Handler: Subscription deleted/cancelled
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const customerId = subscription.customer as string;

  const { data: billing } = await supabase
    .from("billing_settings")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!billing) return;

  // Downgrade to free tier
  await supabase
    .from("billing_settings")
    .update({
      plan_type: "free",
      plan_tier: "free",
      subscription_status: "cancelled",
      subscription_end: new Date().toISOString(),
      cancelled_at: new Date().toISOString(),
      stripe_subscription_id: null,
      credits_monthly_allowance: 10, // Free tier allowance
    })
    .eq("user_id", billing.user_id);

  // Notification
  await supabase.from("notifications").insert({
    user_id: billing.user_id,
    title: "Subscription Cancelled",
    message:
      "Your subscription has been cancelled. You now have access to the free tier.",
    type: "info",
  });
}
