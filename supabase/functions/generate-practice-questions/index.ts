// supabase/functions/generate-practice-questions/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateQuestionsRequest {
  user_id: string;
  material_id: string;
  subject: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  question_type: 'multiple_choice' | 'short_answer' | 'essay';
  count?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData: GenerateQuestionsRequest = await req.json();
    const {
      user_id,
      material_id,
      subject,
      difficulty_level,
      question_type,
      count = 10
    } = requestData;

    if (!user_id || !material_id || !subject) {
      throw new Error('Missing required parameters');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if questions already exist (caching)
    const { data: existingQuestions, error: checkError } = await supabaseClient
      .from('practice_questions')
      .select('*')
      .eq('user_id', user_id)
      .eq('material_id', material_id)
      .eq('difficulty_level', difficulty_level)
      .eq('question_type', question_type)
      .limit(count);

    if (checkError) throw checkError;

    // If we have enough cached questions, return them
    if (existingQuestions && existingQuestions.length >= count) {
      console.log('Returning cached questions');
      return new Response(
        JSON.stringify({
          success: true,
          questions: existingQuestions,
          cached: true,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Fetch material content
    const { data: material, error: materialError } = await supabaseClient
      .from('study_materials')
      .select('*')
      .eq('id', material_id)
      .single();

    if (materialError) throw materialError;

    if (!material.ai_processed || !material.extracted_text) {
      throw new Error('Material has not been processed yet. Please wait for AI processing to complete.');
    }

    // Build prompt based on question type and difficulty
    const prompt = buildQuestionPrompt(
      material,
      subject,
      difficulty_level,
      question_type,
      count
    );

    // Call Groq API
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('Generating questions with Groq AI...');
    
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
            content: `You are an expert Tanzanian NECTA examination question creator.
Your questions must:
- Align with Tanzania's national curriculum
- Follow NECTA examination format and standards
- Be appropriate for the specified difficulty level
- Include clear, unambiguous correct answers
- Provide educational explanations
- Reference specific parts of the study material

ALWAYS respond in valid JSON format with the exact structure specified.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
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

    if (!generatedContent.questions || !Array.isArray(generatedContent.questions)) {
      throw new Error('Invalid AI response format');
    }

    // Save questions to database
    const questionsToInsert = generatedContent.questions.map((q: any) => ({
      user_id,
      material_id,
      subject,
      difficulty_level,
      question_type,
      question_text: q.question,
      options: q.options || null,
      correct_answer: q.correct_answer,
      explanation: q.explanation || null,
      source_reference: q.source_reference || null,
      ai_generated: true,
    }));

    const { data: insertedQuestions, error: insertError } = await supabaseClient
      .from('practice_questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) throw insertError;

    console.log(`Successfully generated ${insertedQuestions.length} questions`);

    return new Response(
      JSON.stringify({
        success: true,
        questions: insertedQuestions,
        cached: false,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error generating questions:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate questions',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function buildQuestionPrompt(
  material: any,
  subject: string,
  difficulty: string,
  type: string,
  count: number
): string {
  const contentPreview = material.extracted_text.substring(0, 6000);
  const topics = material.topics ? material.topics.join(', ') : 'various topics';
  const concepts = material.key_concepts ? material.key_concepts.slice(0, 10).join(', ') : 'key concepts';

  let typeInstructions = '';
  let exampleFormat = '';

  if (type === 'multiple_choice') {
    typeInstructions = `Generate ${count} multiple choice questions with exactly 4 options (A, B, C, D).
- Each question should have ONE clearly correct answer
- Distractors (wrong options) should be plausible but definitively incorrect
- Options should be similar in length and complexity`;
    
    exampleFormat = `{
  "question": "What is the formula for calculating kinetic energy?",
  "options": [
    "A) KE = 1/2 mv²",
    "B) KE = mgh",
    "C) KE = mv",
    "D) KE = 1/2 m²v"
  ],
  "correct_answer": "A) KE = 1/2 mv²",
  "explanation": "Kinetic energy is calculated using KE = 1/2 mv², where m is mass and v is velocity. This formula shows that kinetic energy is proportional to mass and the square of velocity.",
  "source_reference": "Chapter 2: Energy and Motion, Page 15"
}`;
  } else if (type === 'short_answer') {
    typeInstructions = `Generate ${count} short answer questions requiring 1-3 sentence responses.
- Questions should test understanding, not just recall
- Answers should be concise and specific
- Focus on explaining concepts, not just defining them`;
    
    exampleFormat = `{
  "question": "Explain why temperature affects the rate of chemical reactions.",
  "correct_answer": "Higher temperatures increase the kinetic energy of molecules, causing more frequent and energetic collisions between reactant particles, which increases the reaction rate.",
  "explanation": "The correct answer demonstrates understanding of collision theory and the relationship between temperature and molecular motion. Temperature directly affects reaction kinetics by influencing collision frequency and energy.",
  "source_reference": "Section 3.2: Factors Affecting Reaction Rates"
}`;
  } else {
    typeInstructions = `Generate ${count} essay questions requiring detailed, multi-paragraph responses.
- Questions should be analytical and thought-provoking
- They should require synthesis of multiple concepts
- Model answers should be comprehensive (3-5 sentences minimum)
- Questions should allow for demonstration of deep understanding`;
    
    exampleFormat = `{
  "question": "Discuss the impact of deforestation on Tanzania's ecosystem and suggest sustainable solutions.",
  "correct_answer": "Deforestation in Tanzania leads to soil erosion, loss of biodiversity, disruption of water cycles, and contributes to climate change. Trees play a crucial role in carbon sequestration and maintaining local climates. Sustainable solutions include implementing agroforestry practices, establishing protected forest reserves, promoting sustainable logging methods, reforestation programs, and educating communities about the long-term benefits of forest conservation.",
  "explanation": "A complete answer should address multiple impacts (environmental, economic, social) and provide practical, culturally appropriate solutions for the Tanzanian context. Good responses integrate scientific understanding with local knowledge.",
  "source_reference": "Chapter 5: Environmental Conservation in East Africa"
}`;
  }

  let difficultyGuidance = '';
  if (difficulty === 'easy') {
    difficultyGuidance = `EASY level questions should:
- Test basic recall and fundamental understanding
- Use straightforward language
- Focus on definitions and simple concepts
- Have obvious correct answers`;
  } else if (difficulty === 'medium') {
    difficultyGuidance = `MEDIUM level questions should:
- Require application of concepts
- Test understanding, not just memorization
- May involve simple calculations or comparisons
- Require logical reasoning`;
  } else {
    difficultyGuidance = `HARD level questions should:
- Require analysis and synthesis
- Involve complex problem-solving
- May combine multiple concepts
- Test critical thinking and deep understanding`;
  }

  return `You are creating NECTA-style examination questions for ${subject}.

MATERIAL CONTEXT:
Subject: ${subject}
Topics covered: ${topics}
Key concepts: ${concepts}

MATERIAL CONTENT (excerpt):
${contentPreview}

TASK:
${typeInstructions}

DIFFICULTY LEVEL: ${difficulty}
${difficultyGuidance}

REQUIREMENTS:
1. Questions MUST be based on the material content provided
2. Each question must include a specific source_reference pointing to where in the material the answer can be found
3. Questions should align with Tanzania's NECTA examination standards
4. Use appropriate Tanzanian contexts and examples where relevant
5. Ensure questions are clear, unambiguous, and grammatically correct
6. Explanations should educate the student, not just state the answer

EXAMPLE QUESTION FORMAT:
${exampleFormat}

Respond with EXACTLY this JSON structure:
{
  "questions": [
    {
      "question": "...",
      ${type === 'multiple_choice' ? '"options": ["A) ...", "B) ...", "C) ...", "D) ..."],' : ''}
      "correct_answer": "...",
      "explanation": "...",
      "source_reference": "..."
    }
  ]
}

Generate ${count} high-quality questions NOW.`;
}