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

RESPONSE FORMATTING RULES (CRITICAL - follow these exactly):
1. Structure every response clearly with headings, numbered lists, or bullet points where appropriate.
2. Always provide concrete examples when explaining concepts. For instance, if discussing programming languages, mention specific use cases.
3. Include references to real resources when relevant (websites, books, courses, organizations, tools). For example: "You can learn Python for free at freeCodeCamp (freecodecamp.org) or Codecademy (codecademy.com)."
4. Use plain text formatting. Do NOT use asterisks (*) for emphasis or bold. Instead, use clear section headings with line breaks, numbered steps, and descriptive language.
5. When listing steps or recommendations, use numbered lists (1. 2. 3.) for sequential items and dashes (-) for unordered items.
6. End responses with a follow-up question or next step suggestion to keep the conversation productive.
7. Keep paragraphs short (2-3 sentences max) for readability.
8. When discussing career paths or skills, include salary ranges or market demand where possible for Tanzanian context.

EXAMPLE RESPONSE FORMAT:
"Web development is one of the most in-demand skills in Tanzania's growing tech sector.

Here's a recommended learning path:

1. Start with HTML and CSS - These are the building blocks of every website. Try the free course at freecodecamp.org to get hands-on practice.

2. Learn JavaScript - This makes websites interactive. Resources like javascript.info provide excellent free tutorials.

3. Pick a framework - React or Vue.js are popular choices. React has more job postings in East Africa currently.

Useful resources:
- freeCodeCamp (freecodecamp.org) - Free, project-based learning
- The Odin Project (theodinproject.com) - Full-stack curriculum
- Dar es Salaam tech meetups on meetup.com

In Tanzania, junior web developers typically earn between 800,000 - 1,500,000 TZS monthly, with senior roles reaching 3,000,000+ TZS.

Would you like me to create a detailed 3-month study plan, or would you prefer to focus on a specific area like frontend or backend development?"

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

    // Check daily token limit before processing
    const { data: tokenUsage } = await supabase
      .rpc('get_daily_token_usage', { p_user_id: userId })
      .single();

    if (tokenUsage?.limit_reached) {
      const cooldownMsg = tokenUsage.cooldown_ends_at
        ? `Please wait until ${new Date(tokenUsage.cooldown_ends_at).toLocaleTimeString()} or upgrade to Pro for unlimited access.`
        : 'Please wait 2 hours or upgrade to Pro for unlimited access.';
      return new Response(
        JSON.stringify({
          success: false,
          error: `Daily token limit reached (${tokenUsage.tokens_used?.toLocaleString()} / 100,000 tokens used). ${cooldownMsg}`,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check session message limit (500 messages per session)
    if (sessionId) {
      const { data: sessionData } = await supabase
        .from('ai_chat_sessions')
        .select('message_count')
        .eq('id', sessionId)
        .single();

      if (sessionData && sessionData.message_count >= 500) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'This session has reached the 500 message limit. Please start a new chat.',
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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

    // Record token usage for daily tracking
    const totalTokens = groqData.usage?.total_tokens || 0;
    if (totalTokens > 0) {
      const { error: tokenError } = await supabase
        .rpc('record_token_usage', {
          p_user_id: userId,
          p_tokens: totalTokens,
        });

      if (tokenError) {
        console.error('Token usage recording error:', tokenError);
      }
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
