import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

interface InterviewResponseData {
  session_id: string;
  question_number: number;
  question_text: string;
  question_type: 'behavioral' | 'technical' | 'situational';
  response_text: string;
  position: string;
  industry: string;
  difficulty: 'entry' | 'intermediate' | 'senior';
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function generateInterviewAnalysisPrompt(data: InterviewResponseData): string {
  return `You are an expert interview coach and HR professional. Analyze the following interview response and provide detailed, constructive feedback.

**Interview Context:**
- Position: ${data.position}
- Industry: ${data.industry}
- Experience Level: ${data.difficulty}
- Question Type: ${data.question_type}

**Question:**
${data.question_text}

**Candidate's Response:**
${data.response_text}

Provide a comprehensive analysis in the following JSON format:
{
  "score": <number 0-100 representing overall quality>,
  "communication_score": <number 0-100 for clarity, articulation, and professionalism>,
  "content_score": <number 0-100 for relevance, depth, and accuracy>,
  "structure_score": <number 0-100 for organization and logical flow>,
  "strengths": [
    {
      "point": "specific strength identified",
      "explanation": "why this is a strength"
    }
  ],
  "improvements": [
    {
      "issue": "area needing improvement",
      "suggestion": "specific actionable advice",
      "priority": "high|medium|low"
    }
  ],
  "suggested_answer": "A well-crafted example answer that demonstrates best practices for this question",
  "key_points_covered": ["point1", "point2", ...],
  "key_points_missed": ["point1", "point2", ...],
  "overall_feedback": "Comprehensive 2-3 sentence summary of the response quality"
}

**Analysis Guidelines:**
${data.question_type === 'behavioral'
  ? '- Evaluate use of STAR method (Situation, Task, Action, Result)\n- Check for specific examples and measurable outcomes\n- Assess storytelling and impact demonstration'
  : data.question_type === 'technical'
  ? '- Evaluate technical accuracy and depth\n- Check for clear explanation and problem-solving approach\n- Assess practical knowledge and real-world application'
  : '- Evaluate problem-solving approach and decision-making\n- Check for understanding of priorities and stakeholder management\n- Assess judgment and professional maturity'}

${data.difficulty === 'senior'
  ? '- Expect strategic thinking and leadership examples\n- Look for team management and mentoring capabilities\n- Assess business impact and scalability mindset'
  : data.difficulty === 'intermediate'
  ? '- Expect solid technical/functional knowledge\n- Look for collaboration and growth mindset\n- Assess ability to handle complexity'
  : '- Expect foundational knowledge and enthusiasm\n- Look for learning agility and potential\n- Assess cultural fit and communication skills'}

Return ONLY the JSON object, no additional text.`;
}

async function callGroqAPI(
  messages: GroqMessage[],
  temperature: number = 0.5,
  maxRetries: number = 2
): Promise<any> {
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages,
          temperature,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GROQ API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in GROQ API response');
      }

      // Extract JSON from response (handle markdown code blocks)
      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const parsedAnalysis = JSON.parse(jsonContent);

      return {
        analysis: parsedAnalysis,
        tokens_used: result.usage?.total_tokens || 0,
      };
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error('Failed to get response from GROQ API after retries');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestData: InterviewResponseData = await req.json();

    // Try to get user from auth header if provided
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
        userId = user?.id || null;
      } catch (e) {
        console.log('Could not extract user from token, proceeding without user_id');
      }
    }

    // Validate required fields
    if (!requestData.session_id || !requestData.question_text || !requestData.response_text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing interview response for user:', userId || 'anonymous');

    const startTime = Date.now();

    // Generate analysis prompt
    const prompt = generateInterviewAnalysisPrompt(requestData);

    // Call GROQ API
    const { analysis, tokens_used } = await callGroqAPI([
      {
        role: 'system',
        content: 'You are an expert interview coach providing detailed, constructive feedback on interview responses. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const processingTime = Date.now() - startTime;

    console.log('Analysis completed in', processingTime, 'ms');
    console.log('Tokens used:', tokens_used);

    // Save response to database (service role bypasses RLS)
    const responseData = {
      session_id: requestData.session_id,
      user_id: userId,
      question_number: requestData.question_number,
      question_text: requestData.question_text,
      question_type: requestData.question_type,
      response_text: requestData.response_text,
      score: analysis.score,
      communication_score: analysis.communication_score,
      content_score: analysis.content_score,
      structure_score: analysis.structure_score,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      suggested_answer: analysis.suggested_answer,
      key_points_covered: analysis.key_points_covered,
      key_points_missed: analysis.key_points_missed,
      ai_model_used: GROQ_MODEL,
      tokens_used,
      processing_time: processingTime,
    };

    const { data: savedResponse, error: saveError } = await supabaseClient
      .from('interview_responses')
      .insert(responseData)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving response:', saveError);
      throw saveError;
    }

    // Update session with latest question number
    const sessionUpdate = supabaseClient
      .from('interview_sessions')
      .update({
        current_question: requestData.question_number,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.session_id);

    if (userId) {
      sessionUpdate.eq('user_id', userId);
    }

    await sessionUpdate;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          response_id: savedResponse.id,
          analysis: {
            ...analysis,
            overall_feedback: analysis.overall_feedback || 'Analysis completed successfully.',
          },
          tokens_used,
          processing_time: processingTime,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-interview-response:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: error.message || 'An error occurred during analysis',
          details: error.toString(),
        },
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
