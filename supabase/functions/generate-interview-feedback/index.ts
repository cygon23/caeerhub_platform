import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function generateSessionFeedbackPrompt(
  position: string,
  industry: string,
  difficulty: string,
  responses: any[]
): string {
  const responseSummary = responses
    .map(
      (r, i) => `
**Question ${i + 1}:** ${r.question_text}
**Type:** ${r.question_type}
**Score:** ${r.score}/100
**Response:** ${r.response_text.substring(0, 200)}...
`
    )
    .join('\n');

  return `You are a senior HR professional and interview coach. Based on the complete interview session below, provide comprehensive feedback and an improvement plan.

**Interview Details:**
- Position: ${position}
- Industry: ${industry}
- Experience Level: ${difficulty}
- Total Questions: ${responses.length}

**Responses Summary:**
${responseSummary}

Provide a detailed assessment in the following JSON format:
{
  "overall_impression": "2-3 paragraphs summarizing the candidate's overall performance, readiness, and potential",
  "readiness_level": "needs_practice|developing|ready|well_prepared",
  "top_strengths": [
    {
      "strength": "specific strength",
      "examples": "which questions/responses demonstrated this",
      "impact": "why this matters for the role"
    }
  ],
  "areas_for_improvement": [
    {
      "area": "specific area needing work",
      "current_level": "where they are now",
      "target_level": "where they should be",
      "priority": "high|medium|low"
    }
  ],
  "improvement_plan": [
    {
      "focus_area": "what to work on",
      "action_items": ["specific action 1", "specific action 2", ...],
      "timeframe": "suggested timeframe",
      "success_metrics": "how to measure improvement"
    }
  ],
  "recommended_resources": [
    {
      "resource": "book, course, or practice technique",
      "purpose": "what it will help with",
      "priority": "high|medium|low"
    }
  ],
  "practice_questions": [
    "question 1 they should practice",
    "question 2 they should practice",
    ...
  ],
  "next_steps": [
    "immediate next step 1",
    "immediate next step 2",
    ...
  ]
}

**Assessment Criteria:**
- ${difficulty === 'senior' ? 'Strategic thinking, leadership, and business impact' : difficulty === 'intermediate' ? 'Technical depth, collaboration, and growth trajectory' : 'Foundational knowledge, learning ability, and cultural fit'}
- Communication clarity and professionalism
- Use of frameworks (STAR method for behavioral questions)
- Specificity and measurable outcomes
- Relevance to the ${position} role in ${industry}

Return ONLY the JSON object, no additional text.`;
}

async function callGroqAPI(
  messages: GroqMessage[],
  temperature: number = 0.6,
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
          max_tokens: 3000,
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

      // Extract JSON from response
      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const parsedFeedback = JSON.parse(jsonContent);

      return {
        feedback: parsedFeedback,
        tokens_used: result.usage?.total_tokens || 0,
      };
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt === maxRetries) {
        throw error;
      }

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
    // Create auth client to validate user JWT
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Validate user authentication
    const { data: { user }, error: userError } = await authClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please sign in to use this service' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client with service role key to bypass RLS for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { session_id } = await req.json();

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing session_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating feedback for session:', session_id);

    // Get session details
    const { data: session, error: sessionError } = await supabaseClient
      .from('interview_sessions')
      .select('*')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all responses for this session
    const { data: responses, error: responsesError } = await supabaseClient
      .from('interview_responses')
      .select('*')
      .eq('session_id', session_id)
      .eq('user_id', user.id)
      .order('question_number', { ascending: true });

    if (responsesError || !responses || responses.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No responses found for this session' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = Date.now();

    // Generate feedback prompt
    const prompt = generateSessionFeedbackPrompt(
      session.position,
      session.industry,
      session.difficulty,
      responses
    );

    // Call GROQ API
    const { feedback, tokens_used } = await callGroqAPI([
      {
        role: 'system',
        content: 'You are a senior HR professional providing comprehensive interview feedback. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const processingTime = Date.now() - startTime;

    // Calculate score averages
    const avgScores = responses.reduce(
      (acc, r) => ({
        communication: acc.communication + (r.communication_score || 0),
        content: acc.content + (r.content_score || 0),
        structure: acc.structure + (r.structure_score || 0),
      }),
      { communication: 0, content: 0, structure: 0 }
    );

    const responseCount = responses.length;
    const overallScore = Math.round(
      responses.reduce((sum, r) => sum + (r.score || 0), 0) / responseCount
    );

    // Save feedback to database (service role bypasses RLS)
    const feedbackData = {
      session_id,
      user_id: user.id,
      overall_impression: feedback.overall_impression,
      readiness_level: feedback.readiness_level,
      top_strengths: feedback.top_strengths,
      areas_for_improvement: feedback.areas_for_improvement,
      improvement_plan: feedback.improvement_plan,
      communication_avg: Math.round(avgScores.communication / responseCount),
      content_avg: Math.round(avgScores.content / responseCount),
      structure_avg: Math.round(avgScores.structure / responseCount),
      recommended_resources: feedback.recommended_resources,
      practice_questions: feedback.practice_questions,
      next_steps: feedback.next_steps,
    };

    const { data: savedFeedback, error: saveFeedbackError } = await supabaseClient
      .from('interview_feedback')
      .insert(feedbackData)
      .select()
      .single();

    if (saveFeedbackError) {
      console.error('Error saving feedback:', saveFeedbackError);
      throw saveFeedbackError;
    }

    // Update session as completed
    const completionTime = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);

    await supabaseClient
      .from('interview_sessions')
      .update({
        status: 'completed',
        overall_score: overallScore,
        completed_at: new Date().toISOString(),
        completion_time: completionTime,
      })
      .eq('id', session_id)
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          feedback_id: savedFeedback.id,
          feedback,
          overall_score: overallScore,
          tokens_used,
          processing_time: processingTime,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-interview-feedback:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: error.message || 'An error occurred generating feedback',
          details: error.toString(),
        },
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
