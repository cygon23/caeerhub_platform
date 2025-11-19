import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  temperature: number = 0.4,
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
          top_p: 0.95,
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

      // Try to parse JSON response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            data: jsonData,
            tokensUsed,
          };
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.warn(`Attempt ${attempt + 1}: Failed to parse JSON`, parseError);

        if (attempt < maxRetries) {
          messages.push({
            role: "assistant",
            content: content,
          });
          messages.push({
            role: "user",
            content: "Please provide the response as valid JSON only, without any markdown formatting or additional text.",
          });
          continue;
        }

        return {
          success: false,
          error: `Failed to parse JSON after ${maxRetries + 1} attempts`,
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

      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt))
      );
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

// ============================================
// CV ANALYSIS SYSTEM PROMPT
// ============================================

const SYSTEM_PROMPT = `You are an expert CV/Resume analyst and career coach specializing in ATS (Applicant Tracking Systems) optimization and professional content enhancement.

Your role is to provide detailed, actionable feedback on CVs to help candidates improve their job application success rate.

You analyze CVs across multiple dimensions:
1. ATS Compatibility - How well the CV works with automated screening systems
2. Content Quality - Clarity, impact, and professionalism of the content
3. Keyword Optimization - Relevant industry and role-specific keywords
4. Structure & Formatting - Organization and readability
5. Achievement Impact - How well accomplishments are quantified and demonstrated

Provide specific, actionable feedback that candidates can immediately apply to improve their CV.`;

// ============================================
// GENERATE CV ANALYSIS PROMPT
// ============================================

function generateCVAnalysisPrompt(cvData: any, targetRole?: string, targetIndustry?: string): string {
  const { personal_info, experience, education, skills, achievements } = cvData;

  const context = targetRole && targetIndustry
    ? `\n\nTarget Role: ${targetRole}\nTarget Industry: ${targetIndustry}\n`
    : '';

  return `Analyze the following CV and provide comprehensive feedback.${context}

CV DATA:
${JSON.stringify({
  personal_info,
  experience: experience || [],
  education: education || [],
  skills: skills || { technical: [], soft: [] },
  achievements: achievements || []
}, null, 2)}

Provide a detailed analysis in the following JSON format:

{
  "overall_score": <number 0-100>,
  "ats_score": <number 0-100>,
  "content_quality": <number 0-100>,
  "keyword_optimization": <number 0-100>,
  "structure_score": <number 0-100>,
  "strengths": [
    {
      "category": "string (e.g., 'Technical Skills', 'Experience', 'Education')",
      "description": "string - specific strength identified",
      "impact": "string - why this is valuable"
    }
  ],
  "improvements": [
    {
      "category": "string",
      "issue": "string - what needs improvement",
      "suggestion": "string - specific actionable advice",
      "priority": "high" | "medium" | "low",
      "example": "string - example of improved version (if applicable)"
    }
  ],
  "keyword_suggestions": [
    {
      "keyword": "string",
      "relevance": "string - why this keyword matters",
      "where_to_add": "string - which section"
    }
  ],
  "ats_compatibility": {
    "formatting_issues": ["string array of formatting problems"],
    "missing_sections": ["string array of recommended sections not present"],
    "keyword_density": "string - assessment of keyword usage",
    "recommendations": ["string array of ATS-specific improvements"]
  },
  "experience_analysis": [
    {
      "position": "string - job title",
      "company": "string",
      "strengths": ["string array"],
      "improvements": ["string array"],
      "rewritten_bullets": ["string array - improved versions of bullet points"]
    }
  ],
  "skills_analysis": {
    "strong_areas": ["string array"],
    "gaps": ["string array - skills missing for target role"],
    "suggestions": ["string array - skills to add or emphasize"]
  },
  "summary": "string - 2-3 paragraph overall assessment and action plan"
}

Be specific and actionable. Provide concrete examples of improvements.`;
}

// ============================================
// MAIN HANDLER
// ============================================

serve(async (req) => {
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
    const { cv_id, cv_data, target_role, target_industry } = await req.json();

    if (!cv_data) {
      throw new Error("Missing required field: cv_data");
    }

    console.log(`Starting CV analysis for user ${user.id}`);

    // Generate analysis prompt
    const analysisPrompt = generateCVAnalysisPrompt(cv_data, target_role, target_industry);

    // Call GROQ API for analysis
    const analysisResult = await callGroqAPI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: analysisPrompt },
    ]);

    if (!analysisResult.success) {
      throw new Error(`CV analysis failed: ${analysisResult.error}`);
    }

    const analysis = analysisResult.data;
    const tokensUsed = analysisResult.tokensUsed || 0;
    const processingTime = Math.round((Date.now() - startTime) / 1000);

    console.log(`Analysis completed in ${processingTime}s using ${tokensUsed} tokens`);

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabaseClient
      .from("cv_analysis")
      .insert({
        cv_id: cv_id || null,
        user_id: user.id,
        overall_score: analysis.overall_score,
        ats_score: analysis.ats_score,
        content_quality: analysis.content_quality,
        keyword_optimization: analysis.keyword_optimization,
        structure_score: analysis.structure_score || analysis.ats_score,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        keyword_suggestions: analysis.keyword_suggestions,
        ats_compatibility: analysis.ats_compatibility,
        experience_analysis: analysis.experience_analysis,
        skills_analysis: analysis.skills_analysis,
        summary: analysis.summary,
        target_role: target_role || null,
        target_industry: target_industry || null,
        ai_model_used: GROQ_MODEL,
        tokens_used: tokensUsed,
        processing_time: processingTime,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save analysis:", saveError);
      // Continue even if save fails
    }

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          analysis_id: savedAnalysis?.id,
          analysis,
          processing_time: processingTime,
          tokens_used: tokensUsed,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in analyze-cv:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          code: "CV_ANALYSIS_ERROR",
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
