import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  TANZANIA_INSIGHTS_SYSTEM_PROMPT,
  generateMarketOverviewPrompt,
  generateEmergingOpportunitiesPrompt,
  extractUserProfile,
  validateInsightsResponse,
} from "./tanzaniaInsightsPrompts.ts";

// ============================================
// CORS HEADERS
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================
// GROQ API CONFIGURATION
// ============================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callGroqAPI(
  messages: GroqMessage[],
  temperature: number = 0.4
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  tokensUsed?: number;
}> {
  const groqApiKey = Deno.env.get("GROQ_API_KEY");

  if (!groqApiKey) {
    return { success: false, error: "GROQ_API_KEY not configured" };
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature,
        max_tokens: 3000,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    const tokensUsed = result.usage?.total_tokens || 0;

    if (!content) {
      throw new Error("No content in Groq API response");
    }

    // Parse JSON response
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    }

    const parsedData = JSON.parse(cleanContent);

    return {
      success: true,
      data: parsedData,
      tokensUsed,
    };
  } catch (error) {
    console.error("Groq API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// MAIN HANDLER
// ============================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse request body
    const { location } = await req.json();

    if (!location) {
      throw new Error("Location is required");
    }

    console.log(`Generating insights for user ${user.id} in ${location}`);

    // ============================================
    // Check for cached insights (within 7 days)
    // ============================================

    const { data: cachedInsights, error: cacheError } = await supabaseClient
      .from("ubong_insights")
      .select("*")
      .eq("user_id", user.id)
      .eq("location", location)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cachedInsights && !cacheError) {
      console.log("Returning cached insights");
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            marketOverview: cachedInsights.market_overview,
            emergingOpportunities: cachedInsights.emerging_opportunities,
            cached: true,
            generatedAt: cachedInsights.generated_at,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // ============================================
    // Fetch user's assessment data
    // ============================================

    const { data: assessment, error: assessmentError } = await supabaseClient
      .from("career_assessments")
      .select("results")
      .eq("user_id", user.id)
      .eq("assessment_type", "personality")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError || !assessment) {
      throw new Error(
        "No assessment found. Please complete career assessment first."
      );
    }

    const userProfile = extractUserProfile(assessment.results);
    let totalTokensUsed = 0;

    // ============================================
    // STAGE 1: Generate Market Overview
    // ============================================

    console.log("Stage 1: Generating market overview...");

    const marketPrompt = generateMarketOverviewPrompt(location, userProfile);
    const marketResult = await callGroqAPI([
      { role: "system", content: TANZANIA_INSIGHTS_SYSTEM_PROMPT },
      { role: "user", content: marketPrompt },
    ]);

    if (!marketResult.success) {
      throw new Error(
        `Market overview generation failed: ${marketResult.error}`
      );
    }

    totalTokensUsed += marketResult.tokensUsed || 0;
    const marketOverview = marketResult.data.sectors;

    // ============================================
    // STAGE 2: Generate Emerging Opportunities
    // ============================================

    console.log("Stage 2: Generating emerging opportunities...");

    const oppPrompt = generateEmergingOpportunitiesPrompt(location, {
      personalityType: userProfile.personalityType,
      strengths: userProfile.strengths,
      weaknesses: userProfile.weaknesses,
    });

    const oppResult = await callGroqAPI([
      { role: "system", content: TANZANIA_INSIGHTS_SYSTEM_PROMPT },
      { role: "user", content: oppPrompt },
    ]);

    if (!oppResult.success) {
      throw new Error(`Opportunities generation failed: ${oppResult.error}`);
    }

    totalTokensUsed += oppResult.tokensUsed || 0;
    const emergingOpportunities = oppResult.data.opportunities;

    // ============================================
    // Save to database (cache for 7 days)
    // ============================================

    const processingTime = Math.round((Date.now() - startTime) / 1000);

    const { error: saveError } = await supabaseClient
      .from("ubong_insights")
      .upsert(
        {
          user_id: user.id,
          location,
          market_overview: marketOverview,
          emerging_opportunities: emergingOpportunities,
          generated_at: new Date().toISOString(),
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days
          ai_model: GROQ_MODEL,
          tokens_used: totalTokensUsed,
        },
        {
          onConflict: "user_id,location",
        }
      );

    if (saveError) {
      console.error("Error saving insights:", saveError);
    }

    console.log(`Insights generated successfully in ${processingTime}s`);

    // ============================================
    // Return Response
    // ============================================

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          marketOverview,
          emergingOpportunities,
          cached: false,
          generatedAt: new Date().toISOString(),
          processingTime,
          tokensUsed: totalTokensUsed,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in generate-ubong-insights:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          code: "INSIGHTS_ERROR",
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
