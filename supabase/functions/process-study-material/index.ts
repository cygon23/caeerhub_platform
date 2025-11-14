import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  summary: string;
  topics: string[];
  key_concepts: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body with error handling
    let requestBody;
    try {
      const bodyText = await req.text();
      if (!bodyText || bodyText.trim() === '') {
        throw new Error('Request body is empty');
      }
      requestBody = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({
          error: 'Invalid request body: ' + parseError.message,
          success: false
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { material_id, content } = requestBody;

    if (!material_id || !content) {
      throw new Error('Missing material_id or content');
    }

    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch material details
    const { data: material, error: materialError } = await supabaseClient
      .from('study_materials')
      .select('*')
      .eq('id', material_id)
      .single();

    if (materialError) throw materialError;

    // Extract text content (handle base64 if needed)
    let extractedText = content;
    if (content.startsWith('data:')) {
      // For base64 encoded files, we'll extract just the metadata for now
      // In production, you'd use a PDF parser here
      extractedText = `Content from ${material.file_name}`;
    }

    // Limit content to first 8000 characters for API efficiency
    const contentToAnalyze = extractedText.substring(0, 8000);

    // Call Groq API for analysis
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content analyzer for Tanzanian NECTA examinations. 
Analyze study materials and extract key information to help students prepare for their exams.
Your analysis should be thorough, accurate, and aligned with Tanzania's education curriculum.
ALWAYS respond in valid JSON format with the exact structure specified.`
          },
          {
            role: 'user',
            content: `Analyze this ${material.subject} study material and provide:

1. A concise summary (2-3 sentences) of what this material covers
2. A list of main topics/chapters covered (5-10 topics)
3. Important key concepts that students should master (8-15 concepts)

Material content:
${contentToAnalyze}

Respond in this EXACT JSON format:
{
  "summary": "Brief summary of the material...",
  "topics": ["Topic 1", "Topic 2", "Topic 3", ...],
  "key_concepts": ["Concept 1", "Concept 2", "Concept 3", ...]
}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const analysis: AnalysisResult = JSON.parse(groqData.choices[0]?.message?.content || '{}');

    if (!analysis.summary || !analysis.topics || !analysis.key_concepts) {
      throw new Error('Invalid AI response format');
    }

    // Update material with AI processing results
    const { error: updateError } = await supabaseClient
      .from('study_materials')
      .update({
        ai_processed: true,
        ai_summary: analysis.summary,
        extracted_text: contentToAnalyze,
        topics: analysis.topics,
        key_concepts: analysis.key_concepts,
      })
      .eq('id', material_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        summary: analysis.summary,
        topics: analysis.topics,
        key_concepts: analysis.key_concepts,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing material:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process material',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});