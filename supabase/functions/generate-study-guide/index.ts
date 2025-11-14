import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateGuideRequest {
  user_id: string;
  material_id: string;
  subject: string;
  include_formulas?: boolean;
  include_mnemonics?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData: GenerateGuideRequest = await req.json();
    const {
      user_id,
      material_id,
      subject,
      include_formulas = true,
      include_mnemonics = true,
    } = requestData;

    if (!user_id || !material_id || !subject) {
      throw new Error('Missing required parameters');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch material content
    const { data: material, error: materialError } = await supabaseClient
      .from('study_materials')
      .select('*')
      .eq('id', material_id)
      .single();

    if (materialError) throw materialError;

    if (!material.ai_processed || !material.extracted_text) {
      throw new Error('Material has not been processed yet.');
    }

    // Build comprehensive prompt
    const prompt = buildStudyGuidePrompt(
      material,
      subject,
      include_formulas,
      include_mnemonics
    );

    // Call Groq API
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('Generating study guide with Groq AI...');
    
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
            content: `You are an expert educational content creator for Tanzanian students.
Your study guides should:
- Be comprehensive yet concise
- Use clear, accessible language
- Include practical examples
- Align with Tanzania's NECTA curriculum
- Help students understand and remember key concepts
- Be culturally relevant and contextual

ALWAYS respond in valid JSON format with the exact structure specified.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const generatedContent = JSON.parse(groqData.choices[0]?.message?.content || '{}');

    if (!generatedContent.summary || !generatedContent.key_points) {
      throw new Error('Invalid AI response format');
    }

    // Create title from material name
    const title = `${subject} Study Guide - ${material.file_name.replace(/\.[^/.]+$/, "")}`;

    // Save study guide to database
    const { data: studyGuide, error: insertError } = await supabaseClient
      .from('study_guides')
      .insert({
        user_id,
        material_id,
        subject,
        title,
        content: {
          summary: generatedContent.summary,
          key_points: generatedContent.key_points || [],
          formulas: generatedContent.formulas || [],
          definitions: generatedContent.definitions || [],
          examples: generatedContent.examples || [],
          mnemonics: generatedContent.mnemonics || [],
        },
        is_customized: false,
        ai_generated: true,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log('Successfully generated study guide');

    return new Response(
      JSON.stringify({
        success: true,
        study_guide: studyGuide,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error generating study guide:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate study guide',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function buildStudyGuidePrompt(
  material: any,
  subject: string,
  includeFormulas: boolean,
  includeMnemonics: boolean
): string {
  const contentPreview = material.extracted_text.substring(0, 7000);
  const topics = material.topics ? material.topics.join(', ') : 'various topics';
  const concepts = material.key_concepts ? material.key_concepts.join(', ') : 'key concepts';

  return `Create a comprehensive study guide for ${subject} based on this material.

MATERIAL INFORMATION:
Subject: ${subject}
File name: ${material.file_name}
Topics covered: ${topics}
Key concepts: ${concepts}

MATERIAL CONTENT:
${contentPreview}

TASK:
Generate a structured study guide that will help Tanzanian students prepare for NECTA examinations.

The study guide MUST include:

1. SUMMARY (2-3 paragraphs)
   - Overview of the main topics covered
   - Why these topics are important
   - How they relate to NECTA examination requirements

2. KEY POINTS (8-15 points)
   - Most important concepts to understand
   - Each point should be substantial (2-3 sentences)
   - Focus on "must-know" information for exams
   - Include practical applications where relevant

${includeFormulas ? `
3. FORMULAS (if applicable to ${subject})
   - List all important formulas
   - Each formula should include:
     * Name/description
     * The actual formula using standard notation
     * Clear explanation of what each variable represents
     * When and how to use it
   - Examples: For Physics - "Newton's Second Law: F = ma (Force equals mass times acceleration)"
` : ''}

4. DEFINITIONS (10-20 key terms)
   - Essential terms students must know
   - Clear, concise definitions
   - Use context from the material
   - Focus on terms likely to appear in exams

5. EXAMPLES (3-5 practical examples)
   - Real-world applications
   - Step-by-step explanations
   - Relevant to Tanzanian context when possible
   - Help illustrate difficult concepts

${includeMnemonics ? `
6. MNEMONICS & MEMORY AIDS (5-10 items)
   - Creative ways to remember difficult concepts
   - Acronyms, rhymes, or associations
   - Should be culturally appropriate
   - Help with exam recall
` : ''}

IMPORTANT GUIDELINES:
- All content must be factually accurate and based on the material
- Use clear, student-friendly language
- Organize information logically
- Make connections between concepts
- Highlight NECTA examination relevance
- Include Tanzanian context and examples where appropriate

${subject === 'Mathematics' || subject === 'Physics' || subject === 'Chemistry' ? `
SPECIAL NOTE FOR ${subject.toUpperCase()}:
- Include step-by-step problem-solving strategies
- Highlight common mistakes students make
- Provide calculation shortcuts where applicable
- Reference specific formula applications
` : ''}

Respond in this EXACT JSON format:
{
  "summary": "Comprehensive 2-3 paragraph overview...",
  "key_points": [
    "Detailed point 1 explaining concept with context...",
    "Detailed point 2...",
    ...
  ],
  ${includeFormulas ? `"formulas": [
    {
      "name": "Formula Name",
      "formula": "Mathematical notation",
      "explanation": "What it means and when to use it"
    },
    ...
  ],` : ''}
  "definitions": [
    {
      "term": "Term name",
      "definition": "Clear definition with context"
    },
    ...
  ],
  "examples": [
    "Practical example 1 with step-by-step explanation...",
    "Practical example 2...",
    ...
  ],
  ${includeMnemonics ? `"mnemonics": [
    "Memory aid 1: Clever mnemonic or association...",
    "Memory aid 2...",
    ...
  ]` : ''}
}

Generate the study guide NOW.`;
}