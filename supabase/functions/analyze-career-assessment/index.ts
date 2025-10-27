import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  generatePersonalityPrompt,
  generateStrengthsPrompt,
  generateWeaknessesPrompt,
  generateDevelopmentGoalsPrompt,
  validateJSONResponse,
  SYSTEM_PROMPT,
  RETRY_PROMPT,
} from "./prompts.ts";
import { calculateCategoryScores } from "./utils.ts";

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
  temperature: number = 0.3,
  maxRetries: number = 2
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

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
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
          max_tokens: 4000,
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

      // Validate JSON response
      const validation = validateJSONResponse(content);

      if (validation.isValid) {
        return {
          success: true,
          data: validation.data,
          tokensUsed,
        };
      } else {
        console.warn(
          `Attempt ${attempt + 1}: Invalid JSON response`,
          validation.error
        );

        // On retry, add clarification message
        if (attempt < maxRetries) {
          messages.push({
            role: "assistant",
            content: content,
          });
          messages.push({
            role: "user",
            content: RETRY_PROMPT,
          });
          continue;
        }

        return {
          success: false,
          error: `Failed to get valid JSON after ${maxRetries + 1} attempts: ${
            validation.error
          }`,
        };
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt === maxRetries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt))
      );
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

// ============================================
// LOG AI ANALYSIS
// ============================================

async function logAnalysis(
  supabase: any,
  assessmentId: string,
  userId: string,
  stage: string,
  promptUsed: string,
  aiResponse: string,
  tokensUsed: number,
  processingTime: number,
  success: boolean,
  errorMessage?: string
) {
  try {
    await supabase.from("ai_analysis_logs").insert({
      assessment_id: assessmentId,
      user_id: userId,
      stage,
      prompt_used: promptUsed.substring(0, 5000), // Truncate if too long
      ai_response: aiResponse.substring(0, 10000), // Truncate if too long
      tokens_used: tokensUsed,
      processing_time: processingTime,
      success,
      error_message: errorMessage,
      model_used: GROQ_MODEL,
    });
  } catch (error) {
    console.error("Failed to log analysis:", error);
    // Don't throw - logging failure shouldn't break the main flow
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
    const { questions, responses } = await req.json();

    if (!questions || !responses) {
      throw new Error("Missing required fields: questions and responses");
    }

    console.log(`Starting analysis for user ${user.id}`);

    // Calculate category scores
    const categoryScores = calculateCategoryScores(questions, responses);

    let totalTokensUsed = 0;
    let assessmentId: string | null = null;

    // ============================================
    // STAGE 1: PERSONALITY PROFILE
    // ============================================
    console.log("Stage 1: Generating personality profile...");
    const stage1Start = Date.now();

    const personalityPrompt = generatePersonalityPrompt(
      questions,
      responses,
      categoryScores
    );
    const personalityResult = await callGroqAPI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: personalityPrompt },
    ]);

    if (!personalityResult.success) {
      throw new Error(
        `Personality analysis failed: ${personalityResult.error}`
      );
    }

    const personalityProfile = personalityResult.data;
    totalTokensUsed += personalityResult.tokensUsed || 0;

    const stage1Time = Date.now() - stage1Start;
    console.log(`Stage 1 completed in ${stage1Time}ms`);

    // ============================================
    // STAGE 2: STRENGTHS EXTRACTION
    // ============================================
    console.log("Stage 2: Extracting strengths...");
    const stage2Start = Date.now();

    const strengthsPrompt = generateStrengthsPrompt(
      questions,
      responses,
      personalityProfile
    );
    const strengthsResult = await callGroqAPI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: strengthsPrompt },
    ]);

    if (!strengthsResult.success) {
      throw new Error(`Strengths analysis failed: ${strengthsResult.error}`);
    }

    const { strengths } = strengthsResult.data;
    totalTokensUsed += strengthsResult.tokensUsed || 0;

    const stage2Time = Date.now() - stage2Start;
    console.log(`Stage 2 completed in ${stage2Time}ms`);

    // ============================================
    // STAGE 3: WEAKNESSES IDENTIFICATION
    // ============================================
    console.log("Stage 3: Identifying weaknesses...");
    const stage3Start = Date.now();

    const weaknessesPrompt = generateWeaknessesPrompt(
      questions,
      responses,
      personalityProfile,
      strengths
    );
    const weaknessesResult = await callGroqAPI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: weaknessesPrompt },
    ]);

    if (!weaknessesResult.success) {
      throw new Error(`Weaknesses analysis failed: ${weaknessesResult.error}`);
    }

    const { weaknesses } = weaknessesResult.data;
    totalTokensUsed += weaknessesResult.tokensUsed || 0;

    const stage3Time = Date.now() - stage3Start;
    console.log(`Stage 3 completed in ${stage3Time}ms`);

    // ============================================
    // STAGE 4: DEVELOPMENT GOALS & RECOMMENDATIONS
    // ============================================
    console.log("Stage 4: Creating development roadmap...");
    const stage4Start = Date.now();

    const goalsPrompt = generateDevelopmentGoalsPrompt(
      personalityProfile,
      strengths,
      weaknesses
    );
    const goalsResult = await callGroqAPI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: goalsPrompt },
    ]);

    if (!goalsResult.success) {
      throw new Error(
        `Development goals analysis failed: ${goalsResult.error}`
      );
    }

    const { developmentGoals, careerRecommendations, overallInsights } =
      goalsResult.data;
    totalTokensUsed += goalsResult.tokensUsed || 0;

    const stage4Time = Date.now() - stage4Start;
    console.log(`Stage 4 completed in ${stage4Time}ms`);

    // ============================================
    // COMPILE COMPLETE RESULTS
    // ============================================
    const totalProcessingTime = Math.round((Date.now() - startTime) / 1000);

    const completeAnalysis = {
      personalityProfile,
      strengths,
      weaknesses,
      developmentGoals,
      careerRecommendations,
      overallInsights,
      metadata: {
        analysisVersion: "1.0",
        modelUsed: GROQ_MODEL,
        tokensUsed: totalTokensUsed,
        processingTime: totalProcessingTime,
        confidenceScore: Math.round(
          (personalityProfile.confidenceScore +
            strengths.reduce(
              (acc: number, s: any) => acc + s.confidenceScore,
              0
            ) /
              strengths.length +
            weaknesses.reduce(
              (acc: number, w: any) => acc + w.confidenceScore,
              0
            ) /
              weaknesses.length) /
            3
        ),
        generatedAt: new Date().toISOString(),
      },
    };

    // Calculate overall score
    const overallScore = Math.round(
      (strengths.reduce((acc: number, s: any) => acc + s.level, 0) /
        strengths.length +
        weaknesses.reduce((acc: number, w: any) => acc + (100 - w.level), 0) /
          weaknesses.length) /
        2
    );

    // ============================================
    // SAVE TO DATABASE
    // ============================================
    console.log("Saving to database...");

    // 1. Save career assessment
    const { data: assessment, error: assessmentError } = await supabaseClient
      .from("career_assessments")
      .insert({
        user_id: user.id,
        assessment_type: "personality",
        version: 1,
        questions,
        responses,
        results: completeAnalysis,
        score: overallScore,
        confidence_score: completeAnalysis.metadata.confidenceScore,
        status: "completed",
        processing_time: totalProcessingTime,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (assessmentError) {
      throw new Error(`Failed to save assessment: ${assessmentError.message}`);
    }

    assessmentId = assessment.id;

    // 2. Save personality profile
    const { error: profileError } = await supabaseClient
      .from("personality_profiles")
      .insert({
        user_id: user.id,
        assessment_id: assessmentId,
        personality_type: personalityProfile.personalityType,
        description: personalityProfile.description,
        traits: personalityProfile.traits,
        category_scores: personalityProfile.categoryScores,
        key_characteristics: personalityProfile.keyCharacteristics,
        work_style_preferences: personalityProfile.workStylePreferences,
        team_dynamics: personalityProfile.teamDynamics,
        confidence_score: personalityProfile.confidenceScore,
        is_active: true,
      });

    if (profileError) {
      console.error("Failed to save personality profile:", profileError);
    }

    // 3. Save strengths & weaknesses
    const { error: swError } = await supabaseClient
      .from("user_strengths_weaknesses")
      .insert({
        user_id: user.id,
        assessment_id: assessmentId,
        strengths,
        weaknesses,
        development_goals: developmentGoals,
        career_recommendations: careerRecommendations,
        version: 1,
        is_active: true,
      });

    if (swError) {
      console.error("Failed to save strengths/weaknesses:", swError);
    }

    // 4. Log all stages
    await logAnalysis(
      supabaseClient,
      assessmentId,
      user.id,
      "personality",
      personalityPrompt,
      JSON.stringify(personalityProfile),
      personalityResult.tokensUsed || 0,
      stage1Time,
      true
    );
    await logAnalysis(
      supabaseClient,
      assessmentId,
      user.id,
      "strengths",
      strengthsPrompt,
      JSON.stringify(strengths),
      strengthsResult.tokensUsed || 0,
      stage2Time,
      true
    );
    await logAnalysis(
      supabaseClient,
      assessmentId,
      user.id,
      "weaknesses",
      weaknessesPrompt,
      JSON.stringify(weaknesses),
      weaknessesResult.tokensUsed || 0,
      stage3Time,
      true
    );
    await logAnalysis(
      supabaseClient,
      assessmentId,
      user.id,
      "goals",
      goalsPrompt,
      JSON.stringify({ developmentGoals, careerRecommendations }),
      goalsResult.tokensUsed || 0,
      stage4Time,
      true
    );

    console.log(`Analysis completed successfully in ${totalProcessingTime}s`);

    // ============================================
    // RETURN RESPONSE
    // ============================================
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          assessmentId,
          analysis: completeAnalysis,
          processingTime: totalProcessingTime,
          tokensUsed: totalTokensUsed,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in analyze-career-assessment:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          code: "ANALYSIS_ERROR",
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
