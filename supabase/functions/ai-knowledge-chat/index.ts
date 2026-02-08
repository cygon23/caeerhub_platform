import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// System prompt - restricts AI to education and career domain
const SYSTEM_PROMPT = `You are Ubongo, an AI career and education assistant for CaeerHub platform in Tanzania.

Your role is to help students and young professionals with:
- Career guidance and planning
- Educational pathways and course selection
- Study tips and learning strategies
- Job market insights and opportunities
- Interview preparation and CV guidance
- Skills development recommendations
- Business and entrepreneurship advice
- ICT skills and technology career paths

IMPORTANT RESTRICTIONS:
- ONLY provide assistance related to education, careers, and professional development
- Stay calm, gentle, and encouraging in all responses
- If asked about topics outside education/career domain, politely redirect to your area of expertise
- Maintain context throughout the conversation
- Provide practical, actionable advice tailored to Tanzanian context when relevant
- Be concise but thorough - aim for clear, well-structured responses

When users ask unrelated questions, respond with:
"I'm specialized in career and education guidance. I'd be happy to help you with questions about your career path, education, skills development, or professional growth. How can I assist you in these areas?"`;

interface ChatRequest {
  sessionId?: string;
  message: string;
  userId: string;
  category?: string;
  fileContext?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData: ChatRequest = await req.json();
    const { sessionId, message, userId, category, fileContext } = requestData;

    if (!message || !userId || userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let currentSessionId = sessionId;

    // Create new session if none provided
    if (!currentSessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('ai_chat_sessions')
        .insert({
          user_id: userId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          category: category || null,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return new Response(
          JSON.stringify({ error: 'Failed to create chat session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      currentSessionId = newSession.id;
    }

    // Get conversation history (last 20 messages for context)
    const { data: history, error: historyError } = await supabase
      .from('ai_chat_messages')
      .select('role, content')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: true })
      .limit(20);

    if (historyError) {
      console.error('History fetch error:', historyError);
    }

    // Build messages array for Groq
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add file context if provided
    if (fileContext) {
      messages.push({
        role: 'system',
        content: `User has uploaded a document. Here's the extracted content:\n\n${fileContext}\n\nUse this information to help answer the user's questions.`
      });
    }

    // Add conversation history
    if (history && history.length > 0) {
      messages.push(...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Save user message to database
    const { error: userMsgError } = await supabase
      .from('ai_chat_messages')
      .insert({
        session_id: currentSessionId,
        user_id: userId,
        role: 'user',
        content: message,
      });

    if (userMsgError) {
      console.error('User message save error:', userMsgError);
    }

    // Call Groq API
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and capable model
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const groqData = await groqResponse.json();
    const assistantMessage = groqData.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    // Save assistant message to database
    const { error: assistantMsgError } = await supabase
      .from('ai_chat_messages')
      .insert({
        session_id: currentSessionId,
        user_id: userId,
        role: 'assistant',
        content: assistantMessage,
        metadata: {
          model: groqData.model,
          usage: groqData.usage,
        }
      });

    if (assistantMsgError) {
      console.error('Assistant message save error:', assistantMsgError);
    }

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        sessionId: currentSessionId,
        message: assistantMessage,
        usage: groqData.usage,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-knowledge-chat:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
