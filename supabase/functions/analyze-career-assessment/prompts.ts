import {
  AssessmentQuestion,
  AssessmentResponses,
  CategoryScores,
} from "../../../src/types/types.ts";

// ============================================
// SYSTEM PROMPTS
// ============================================

export const SYSTEM_PROMPT = `You are an expert career psychologist and assessment specialist with deep knowledge of:
- Personality psychology (Big Five, MBTI, Holland Codes)
- Career development theory
- Strengths-based coaching
- Behavioral analysis
- Skills assessment

Your role is to analyze career assessment responses and provide:
1. Accurate, evidence-based insights
2. Specific, actionable recommendations
3. Confidence scores for each insight
4. Personalized development plans

Always base your analysis on the actual responses provided. Be honest about limitations and use confidence scores appropriately.

Response Format: Always respond with valid JSON only. No markdown, no explanations outside the JSON structure.`;

// ============================================
// STAGE 1: PERSONALITY PROFILE GENERATION
// ============================================

export const generatePersonalityPrompt = (
  questions: AssessmentQuestion[],
  responses: AssessmentResponses,
  categoryScores: CategoryScores
): string => {
  const responseSummary = questions.map((q) => ({
    question: q.question,
    response: responses[q.id],
    category: q.subcategory,
    weight: q.weight,
    context: q.context,
  }));

  return `Analyze this career assessment and generate a comprehensive personality profile.

ASSESSMENT DATA:
${JSON.stringify({ responseSummary, categoryScores }, null, 2)}

TASK:
Create a detailed personality profile based on the responses. Consider patterns across all categories.

REQUIRED JSON OUTPUT:
{
  "personalityType": "A creative 2-4 word descriptor (e.g., 'The Analytical Innovator', 'The Strategic Collaborator')",
  "description": "2-3 paragraph detailed description of this person's personality, work style, and professional approach",
  "traits": ["List 5-7 key personality traits with brief explanations"],
  "categoryScores": {
    // Include scores for all 29 subcategories based on responses
    "social_orientation": 75,
    "analytical_thinking": 85,
    // ... etc for all categories
  },
  "keyCharacteristics": [
    "Characteristic 1 with specific evidence from responses",
    "Characteristic 2 with specific evidence from responses",
    "Characteristic 3 with specific evidence from responses",
    "Characteristic 4 with specific evidence from responses",
    "Characteristic 5 with specific evidence from responses"
  ],
  "workStylePreferences": {
    "preferredEnvironment": "collaborative/independent/hybrid - explain why",
    "communicationStyle": "direct/diplomatic/analytical - explain why",
    "decisionMaking": "quick/deliberate/consultative - explain why",
    "workPace": "fast-paced/steady/flexible - explain why"
  },
  "teamDynamics": [
    "How they contribute to teams",
    "Their natural role in group settings",
    "How they handle conflict",
    "Their collaboration strengths"
  ],
  "confidenceScore": 85
}

ANALYSIS GUIDELINES:
1. Base personality type on the strongest patterns across ALL responses
2. Reference specific responses as evidence (e.g., "High score on Q2 indicates...")
3. Look for consistency and contradictions in responses
4. Be specific and avoid generic statements
5. Confidence score should reflect consistency of responses (high consistency = high confidence)
6. Consider question weights in your analysis

Respond with ONLY the JSON object, no additional text.`;
};

// ============================================
// STAGE 2: STRENGTHS EXTRACTION
// ============================================

export const generateStrengthsPrompt = (
  questions: AssessmentQuestion[],
  responses: AssessmentResponses,
  personalityProfile: any
): string => {
  const highScoreResponses = questions
    .filter((q) => responses[q.id] >= 4)
    .map((q) => ({
      question: q.question,
      response: responses[q.id],
      category: q.subcategory,
      context: q.context,
    }));

  return `Based on the assessment responses and personality profile, identify the top 5 strengths.

PERSONALITY PROFILE:
${JSON.stringify(personalityProfile, null, 2)}

HIGH-SCORING RESPONSES (4-5 ratings):
${JSON.stringify(highScoreResponses, null, 2)}

TASK:
Identify exactly 5 key strengths. Each must be:
1. Supported by specific response evidence
2. Career-relevant
3. Actionable for development

REQUIRED JSON OUTPUT:
{
  "strengths": [
    {
      "name": "Strength name (e.g., 'Analytical Problem Solving')",
      "level": 85,
      "category": "Cognitive/Interpersonal/Technical/Leadership/Creative/Organizational",
      "description": "2-3 sentence description of this strength",
      "evidence": [
        "Specific response pattern 1 (reference question numbers)",
        "Specific response pattern 2 (reference question numbers)",
        "How this shows up in their assessment"
      ],
      "careerRelevance": "Specific careers/industries where this strength is valuable. Be concrete.",
      "impact": "High/Medium/Low",
      "confidenceScore": 85,
      "developmentTips": [
        "Specific tip 1 to leverage this strength",
        "Specific tip 2 to further develop it",
        "Specific tip 3 for career application"
      ]
    }
  ]
}

ANALYSIS GUIDELINES:
1. Select strengths from different categories for diversity
2. Prioritize strengths with strongest evidence (multiple supporting responses)
3. Level should be 70-95 for top strengths
4. Impact = High if strength differentiates them significantly
5. Confidence score based on consistency of evidence
6. Make career relevance specific (name actual jobs/industries)
7. Development tips should be actionable, not generic

Respond with ONLY the JSON object, no additional text.`;
};

// ============================================
// STAGE 3: WEAKNESSES IDENTIFICATION
// ============================================

export const generateWeaknessesPrompt = (
  questions: AssessmentQuestion[],
  responses: AssessmentResponses,
  personalityProfile: any,
  strengths: any[]
): string => {
  const lowScoreResponses = questions
    .filter((q) => responses[q.id] <= 2)
    .map((q) => ({
      question: q.question,
      response: responses[q.id],
      category: q.subcategory,
      context: q.context,
    }));

  const neutralResponses = questions
    .filter((q) => responses[q.id] === 3)
    .map((q) => ({
      question: q.question,
      category: q.subcategory,
    }));

  return `Based on the assessment, identify 3-4 key development areas (weaknesses).

CONTEXT:
- Personality Profile: ${JSON.stringify(personalityProfile, null, 2)}
- Identified Strengths: ${JSON.stringify(
    strengths.map((s) => s.name),
    null,
    2
  )}

LOW-SCORING RESPONSES (1-2 ratings):
${JSON.stringify(lowScoreResponses, null, 2)}

NEUTRAL RESPONSES (3 ratings - may indicate uncertainty):
${JSON.stringify(neutralResponses, null, 2)}

TASK:
Identify 3-4 development areas that:
1. Are supported by response evidence
2. Could impact career growth
3. Are improvable with effort
4. Balance the identified strengths

REQUIRED JSON OUTPUT:
{
  "weaknesses": [
    {
      "name": "Development area name (e.g., 'Time Management & Prioritization')",
      "level": 45,
      "category": "Time Management/Communication/Technical/Organizational/Interpersonal/Emotional",
      "description": "2-3 sentence description of this weakness and how it manifests",
      "rootCause": "Deeper analysis of why this might be challenging (2-3 sentences)",
      "impact": "High/Medium/Low",
      "improvementPlan": {
        "actions": [
          "Specific action 1 (very concrete)",
          "Specific action 2 (very concrete)",
          "Specific action 3 (very concrete)",
          "Specific action 4 (very concrete)"
        ],
        "timeline": "3 months/6 months/12 months",
        "milestones": [
          "Milestone 1 with specific metric",
          "Milestone 2 with specific metric",
          "Milestone 3 with specific metric"
        ],
        "resources": [
          "Specific book/course/tool 1",
          "Specific book/course/tool 2",
          "Specific book/course/tool 3"
        ],
        "successMetrics": [
          "How to measure improvement 1",
          "How to measure improvement 2"
        ]
      },
      "confidenceScore": 75
    }
  ]
}

ANALYSIS GUIDELINES:
1. Focus on HIGH IMPACT weaknesses that are improvable
2. Level should be 30-60 for genuine development areas
3. Root cause should go deeper than surface behavior
4. Actions must be specific (not "improve communication" but "Join Toastmasters")
5. Resources should be real, named tools/books/courses
6. Success metrics must be measurable
7. Timeline should match the difficulty (harder = longer)
8. Be constructive, not judgmental - frame as "growth opportunities"

Respond with ONLY the JSON object, no additional text.`;
};

// ============================================
// STAGE 4: DEVELOPMENT GOALS & ROADMAP
// ============================================

export const generateDevelopmentGoalsPrompt = (
  personalityProfile: any,
  strengths: any[],
  weaknesses: any[]
): string => {
  return `Create a comprehensive 3-6 month development roadmap with specific goals.

CONTEXT:
Personality: ${personalityProfile.personalityType}
Strengths: ${JSON.stringify(
    strengths.map((s) => s.name),
    null,
    2
  )}
Weaknesses: ${JSON.stringify(
    weaknesses.map((w) => w.name),
    null,
    2
  )}

TASK:
Create 3-5 development goals that:
1. Address high-impact weaknesses
2. Leverage existing strengths
3. Build toward career advancement
4. Are achievable in 3-6 months

REQUIRED JSON OUTPUT:
{
  "developmentGoals": [
    {
      "goal": "Specific, measurable goal statement",
      "priority": "High/Medium/Low",
      "timeline": "3 months/6 months",
      "category": "Professional Skills/Leadership/Technical/Personal Development",
      "actions": [
        "Specific action step 1",
        "Specific action step 2",
        "Specific action step 3",
        "Specific action step 4"
      ],
      "milestones": [
        {
          "description": "Milestone 1 description",
          "targetDate": "YYYY-MM-DD",
          "completed": false
        },
        {
          "description": "Milestone 2 description",
          "targetDate": "YYYY-MM-DD",
          "completed": false
        }
      ],
      "progress": 0,
      "relatedStrengths": ["Strength name 1", "Strength name 2"],
      "addressesWeaknesses": ["Weakness name 1"]
    }
  ],
  "careerRecommendations": [
    {
      "careerPath": "Specific career path name",
      "matchScore": 85,
      "reasoning": "Why this career aligns with their profile (2-3 sentences)",
      "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
      "strengthsAlignment": ["How strength 1 helps", "How strength 2 helps"],
      "developmentAreas": ["What they need to develop"],
      "typicalRoles": ["Job Title 1", "Job Title 2", "Job Title 3"],
      "industryExamples": ["Company/Industry 1", "Company/Industry 2"]
    }
  ],
  "overallInsights": {
    "keyTakeaways": [
      "Key insight 1 about their profile",
      "Key insight 2 about their potential",
      "Key insight 3 about development focus"
    ],
    "growthPotential": "2-3 sentences about their career potential and trajectory",
    "recommendedFocus": [
      "Primary focus area for next 3 months",
      "Secondary focus area",
      "Tertiary focus area"
    ]
  }
}

ANALYSIS GUIDELINES:
1. Goals should directly address top weaknesses
2. Leverage strengths as foundations for goals
3. Make milestones specific and time-bound
4. Career recommendations should be realistic based on profile
5. Match scores should reflect honest fit (70-95 for good matches)
6. Include 3-5 career recommendations
7. Overall insights should synthesize everything
8. Be encouraging but realistic

Respond with ONLY the JSON object, no additional text.`;
};

// ============================================
// ERROR RECOVERY PROMPTS
// ============================================

export const RETRY_PROMPT = `The previous response was not valid JSON. Please respond with ONLY a valid JSON object, no markdown formatting, no explanations, no additional text. Just the raw JSON.`;

export const SIMPLIFY_PROMPT = `Please provide a simpler, more concise version of the analysis while maintaining all required fields. Focus on clarity and brevity.`;

// ============================================
// VALIDATION HELPERS
// ============================================

export const validateJSONResponse = (
  response: string
): { isValid: boolean; data?: any; error?: string } => {
  try {
    // Remove markdown code blocks if present
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleanResponse);
    return { isValid: true, data: parsed };
  } catch (error) {
    return {
      isValid: false,
      error: `JSON parsing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
