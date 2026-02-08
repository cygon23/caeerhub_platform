import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const SNIPPE_WEBHOOK_SECRET = Deno.env.get("SNIPPE_WEBHOOK_SECRET");

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature, x-webhook-timestamp, x-webhook-event",
};

/**
 * Verify webhook signature from Snipe.sh
 * Format: HMAC-SHA256 of "{timestamp}.{raw_body}" using webhook secret
 */
async function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Create the signed message: "{timestamp}.{raw_body}"
    const message = `${timestamp}.${rawBody}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message)
    );

    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Use constant-time comparison
    return hashHex === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // Get webhook headers
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");
    const event = req.headers.get("x-webhook-event");

    if (!signature || !timestamp) {
      throw new Error("Missing webhook signature or timestamp headers");
    }

    console.log("Webhook received:", { event, timestamp });

    // Verify signature
    const isValid = await verifyWebhookSignature(rawBody, timestamp, signature, SNIPPE_WEBHOOK_SECRET!);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const {
      event,
      reference,
      transaction_id,
      status,
      amount,
      phone_number,
      provider,
      metadata
    } = body;

    console.log("Webhook received:", { event, reference, status });

    // Find the payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from("snippe_payments")
      .select("*")
      .eq("payment_reference", reference)
      .single();

    if (paymentError || !payment) {
      console.error("Payment not found:", reference);
      throw new Error("Payment not found");
    }

    // Update payment record based on status
    const updateData: any = {
      status: status.toLowerCase(),
      snippe_transaction_id: transaction_id,
      mobile_provider: provider?.toLowerCase(),
      snippe_response: body,
      updated_at: new Date().toISOString(),
    };

    if (status === 'COMPLETED' || status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    await supabaseClient
      .from("snippe_payments")
      .update(updateData)
      .eq("id", payment.id);

    // If payment is completed, activate subscription
    if (status === 'COMPLETED' || status === 'completed') {
      // Call the activate_snippe_subscription function
      const { error: activateError } = await supabaseClient
        .rpc('activate_snippe_subscription', {
          p_payment_id: payment.id
        });

      if (activateError) {
        console.error("Error activating subscription:", activateError);
        throw activateError;
      }

      console.log("Subscription activated for user:", payment.user_id);
    }

    // If payment failed, update status
    if (status === 'FAILED' || status === 'failed') {
      console.log("Payment failed for reference:", reference);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Webhook error:", error);
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
