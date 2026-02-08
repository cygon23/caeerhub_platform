import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SNIPPE_API_KEY = Deno.env.get("SNIPPE_API_KEY");
const SNIPPE_API_URL = "https://api.snippe.sh/v1"; // Update with actual Snipe.sh API URL

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { paymentId } = await req.json();

    if (!paymentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: paymentId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get payment details from database
    const { data: payment, error: paymentError } = await supabaseClient
      .from("snippe_payments")
      .select("*")
      .eq("id", paymentId)
      .eq("user_id", user.id) // Ensure user owns this payment
      .single();

    if (paymentError || !payment) {
      return new Response(
        JSON.stringify({ success: false, error: 'Payment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check status with Snipe.sh API
    const snippeResponse = await fetch(
      `${SNIPPE_API_URL}/payments/${payment.payment_reference}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": SNIPPE_API_KEY!,
        },
      }
    );

    if (!snippeResponse.ok) {
      const errorData = await snippeResponse.json();
      console.error("Snipe.sh API error:", errorData);
      throw new Error("Failed to check payment status");
    }

    const snippeData = await snippeResponse.json();

    // Update payment status in database
    const updatedStatus = snippeData.status.toLowerCase();

    const updateData: any = {
      status: updatedStatus,
      snippe_response: snippeData,
      updated_at: new Date().toISOString(),
    };

    if (snippeData.provider) {
      updateData.mobile_provider = snippeData.provider.toLowerCase();
    }

    if (updatedStatus === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    await supabaseClient
      .from("snippe_payments")
      .update(updateData)
      .eq("id", payment.id);

    // If payment completed, activate subscription
    if (updatedStatus === 'completed' && payment.status !== 'completed') {
      const { error: activateError } = await supabaseClient
        .rpc('activate_snippe_subscription', {
          p_payment_id: payment.id
        });

      if (activateError) {
        console.error("Error activating subscription:", activateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: updatedStatus,
        payment: {
          id: payment.id,
          reference: payment.payment_reference,
          amount: payment.amount,
          currency: payment.currency,
          status: updatedStatus,
          phone_number: payment.phone_number,
          mobile_provider: snippeData.provider || payment.mobile_provider,
          created_at: payment.created_at,
          completed_at: updateData.completed_at || payment.completed_at,
        }
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
