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

const SYSTEM_PROMPT = `You are an AI academic planner for CaeerHub, an education platform in Tanzania.
You generate personalized, actionable academic plans based on a student's profile.

You MUST respond with ONLY valid JSON, no markdown, no code blocks, no extra text.

The JSON must have this exact structure:
{
  "study_focus": {
    "summary": "2-3 sentence personalized insight about their academic situation and what to focus on this week",
    "weekly_tips": ["tip1", "tip2", "tip3"],
    "priority_subject": "the subject they should focus most on and why (1 sentence)"
  },
  "assignments": [
    {
      "title": "specific assignment title",
      "subject": "must match one of their subjects exactly",
      "description": "detailed description of what to do, with specific chapters/topics/exercises",
      "priority": "high|medium|low",
      "days_until_due": 1-14
    }
  ],
  "quizzes": [
    {
      "title": "quiz title",
      "subject": "must match one of their subjects exactly",
      "description": "what this quiz covers",
      "time_limit_minutes": 10-30,
      "questions": [
        {
          "question": "the question text",
          "type": "multiple_choice",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "the correct option text exactly",
          "explanation": "why this is correct"
        }
      ]
    }
  ],
  "schedule": [
    {
      "subject": "must match one of their subjects exactly",
      "title": "what to study in this session",
      "day_of_week": 0-6,
      "start_time": "HH:MM",
      "end_time": "HH:MM"
    }
  ]
}

RULES:
- Generate 5-8 assignments spread across ALL their subjects, with realistic deadlines (1-14 days)
- Generate 1 quiz per subject with 5 questions each (use multiple_choice type primarily)
- Generate a balanced weekly schedule covering all subjects (2-3 sessions per subject per week)
- Schedule should be between 06:00 and 20:00, sessions 1-2 hours each
- All content must be appropriate for their education level
- For Form 4 students: use CSEE-level content
- For Form 6: use ACSEE-level content
- For University: use university-level content
- Make assignments specific: reference actual topics, chapters, exercises
- Make quiz questions educational and challenging but fair for their level
- If they mentioned specific struggles, address those in assignments and quizzes`;

interface AcademicProfile {
  education_level: string;
  subjects_need_help: { name: string; topics: string[] }[];
  help_types: string[];
  specific_struggles: string | null;
}

interface PlanRequest {
  userId: string;
  profile: AcademicProfile;
  regenerate?: boolean; // true = generate fresh content
  type?: 'full' | 'assignments' | 'quizzes' | 'schedule'; // what to generate
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

    // Verify auth
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
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

    const requestData: PlanRequest = await req.json();
    const { profile, type = 'full' } = requestData;

    if (!profile || !profile.education_level || !profile.subjects_need_help) {
      return new Response(
        JSON.stringify({ error: 'Invalid profile data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the user prompt
    const subjectsList = profile.subjects_need_help
      .map(s => `${s.name}${s.topics.length > 0 ? ` (topics: ${s.topics.join(', ')})` : ''}`)
      .join(', ');

    const userPrompt = `Generate a personalized academic plan for this student:

Education Level: ${profile.education_level.replace(/_/g, ' ')}
Subjects needing help: ${subjectsList}
Types of help needed: ${profile.help_types.join(', ')}
${profile.specific_struggles ? `Specific struggles: ${profile.specific_struggles}` : ''}

Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
Today's day of week number is ${new Date().getDay()} (0=Sunday, 6=Saturday).

Generate: ${type === 'full' ? 'complete plan with study_focus, assignments, quizzes, and schedule' :
  type === 'assignments' ? 'only assignments (5-8 new ones)' :
  type === 'quizzes' ? 'only quizzes (1 per subject, 5 questions each)' :
  'only schedule blocks'}

Respond with ONLY the JSON object, nothing else.`;

    // Call Groq
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.9,
        response_format: { type: 'json_object' },
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
    const rawContent = groqData.choices[0]?.message?.content || '{}';

    let plan;
    try {
      plan = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', rawContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save AI-generated content to database
    const now = new Date();
    const results: any = { plan };

    // Save study focus to academic profile
    if (plan.study_focus) {
      await supabase
        .from('academic_profiles')
        .update({ ai_profile_summary: JSON.stringify(plan.study_focus) })
        .eq('user_id', user.id);
    }

    // Save assignments
    if (plan.assignments && plan.assignments.length > 0) {
      const assignmentsToInsert = plan.assignments.map((a: any) => ({
        user_id: user.id,
        title: a.title,
        subject: a.subject,
        description: a.description,
        priority: a.priority || 'medium',
        due_date: new Date(now.getTime() + (a.days_until_due || 7) * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      }));

      const { data: savedAssignments, error: assignError } = await supabase
        .from('academic_assignments')
        .insert(assignmentsToInsert)
        .select();

      if (assignError) console.error('Assignment save error:', assignError);
      results.assignments = savedAssignments;
    }

    // Save quizzes
    if (plan.quizzes && plan.quizzes.length > 0) {
      const quizzesToInsert = plan.quizzes.map((q: any) => ({
        created_by: user.id,
        title: q.title,
        subject: q.subject,
        description: q.description,
        time_limit_minutes: q.time_limit_minutes || 15,
        questions: q.questions || [],
        question_count: (q.questions || []).length,
        is_public: false,
      }));

      const { data: savedQuizzes, error: quizError } = await supabase
        .from('academic_quizzes')
        .insert(quizzesToInsert)
        .select();

      if (quizError) console.error('Quiz save error:', quizError);
      results.quizzes = savedQuizzes;
    }

    // Save schedule
    if (plan.schedule && plan.schedule.length > 0) {
      // Clear existing AI-generated schedule first
      await supabase
        .from('study_schedules')
        .delete()
        .eq('user_id', user.id);

      const SUBJECT_COLORS: Record<string, string> = {
        Mathematics: '#6366f1', English: '#06b6d4', Physics: '#f59e0b',
        Chemistry: '#10b981', Biology: '#ef4444', Geography: '#8b5cf6',
        History: '#f97316', Kiswahili: '#ec4899', ICT: '#3b82f6',
      };

      const schedulesToInsert = plan.schedule.map((s: any) => ({
        user_id: user.id,
        subject: s.subject,
        title: s.title || null,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        is_recurring: true,
        color: SUBJECT_COLORS[s.subject] || '#6366f1',
      }));

      const { data: savedSchedules, error: schedError } = await supabase
        .from('study_schedules')
        .insert(schedulesToInsert)
        .select();

      if (schedError) console.error('Schedule save error:', schedError);
      results.schedules = savedSchedules;
    }

    return new Response(
      JSON.stringify({ success: true, ...results, usage: groqData.usage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-academic-plan:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
