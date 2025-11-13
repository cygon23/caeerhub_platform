import Groq from "groq-sdk";
import { creditService } from './creditService';
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // For production, use a backend proxy
});

interface OnboardingInput {
  educationLevel: string;
  strongestSubjects: string[];
  industriesOfInterest: string[];
  dreamCareer: string;
  preferredPath: string;
  focusLevel: number;
  timeManagement: number;
  studySupport: string[];
}

interface AIRoadmapResponse {
  personality_summary: string;
  learning_style: string;
  strengths: string[];
  challenges: string[];
  recommended_path: "employment" | "self_employment" | "investor";
  recommendation_reasoning: string;
  roadmap: {
    phases: Array<{
      timeline: string;
      title: string;
      milestones: string[];
      estimated_cost_tzs: number;
      resources: string[];
    }>;
    total_estimated_duration: string;
    total_estimated_cost_tzs: number;
  };
}

export async function generateAIRoadmap(
  input: OnboardingInput,
  userId: string 
): Promise<AIRoadmapResponse> {
   // 1. CHECK CREDITS FIRST - ADD THIS BLOCK
  const creditCheck = await creditService.canUseFeature(userId, 'ai_roadmap');

   if (!creditCheck.canUse) {
    throw new Error(`INSUFFICIENT_CREDITS:${creditCheck.reason}:${creditCheck.creditsRequired}:${creditCheck.creditsAvailable}`);
  }

  const prompt = `You are a career counselor AI specializing in the Tanzanian job market and education system. Analyze the following youth profile and create a detailed, actionable career roadmap.

**Profile:**
- Education Level: ${input.educationLevel}
- Strongest Subjects: ${input.strongestSubjects.join(", ")}
- Industries of Interest: ${input.industriesOfInterest.join(", ")}
- Dream Career: ${input.dreamCareer}
- Preferred Path: ${input.preferredPath}
- Focus Level: ${input.focusLevel}/10
- Time Management: ${input.timeManagement}/10
- Support Preferences: ${input.studySupport.join(", ")}

**Required JSON Output Structure:**
{
  "personality_summary": "A 2-3 sentence personality analysis based on subjects and interests",
  "learning_style": "Visual/Auditory/Kinesthetic/Reading-Writing learner with brief explanation",
  "strengths": ["List 3-5 key strengths based on profile"],
  "challenges": ["List 2-4 potential challenges they may face"],
  "recommended_path": "employment|self_employment|investor",
  "recommendation_reasoning": "2-3 sentences explaining why this path suits them best, considering Tanzania's job market",
  "roadmap": {
    "phases": [
      {
        "timeline": "0-6 months",
        "title": "Foundation Phase",
        "milestones": ["Specific actionable tasks"],
        "estimated_cost_tzs": 500000,
        "resources": ["Specific courses, platforms, or institutions in Tanzania"]
      },
      {
        "timeline": "6-12 months",
        "title": "Skill Building Phase",
        "milestones": ["Specific actionable tasks"],
        "estimated_cost_tzs": 1000000,
        "resources": ["Specific resources"]
      },
      {
        "timeline": "1-2 years",
        "title": "Experience & Growth Phase",
        "milestones": ["Specific actionable tasks"],
        "estimated_cost_tzs": 500000,
        "resources": ["Specific opportunities"]
      },
      {
        "timeline": "2-5 years",
        "title": "Career Establishment Phase",
        "milestones": ["Specific actionable tasks"],
        "estimated_cost_tzs": 0,
        "resources": ["Specific advancement strategies"]
      }
    ],
    "total_estimated_duration": "5 years",
    "total_estimated_cost_tzs": 2000000
  }
}

**Important Guidelines:**
1. Base recommendations on Tanzania's job market realities
2. Include local institutions (e.g., VETA, universities, online platforms accessible in Tanzania)
3. Consider the person's education level and suggest realistic next steps
4. For costs, use realistic Tanzanian Shilling amounts
5. If they chose "${
    input.preferredPath
  }" path, explain if you agree or recommend differently
6. Make milestones SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
7. Consider their focus and time management scores when planning timelines
8. Return ONLY valid JSON, no markdown formatting or extra text`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert career counselor for Tanzanian youth. You provide detailed, actionable career roadmaps in JSON format. Always return valid JSON without markdown code blocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    // Parse and validate JSON
    const aiResponse: AIRoadmapResponse = JSON.parse(responseText);

    // Validate required fields
    if (
      !aiResponse.personality_summary ||
      !aiResponse.roadmap ||
      !aiResponse.roadmap.phases
    ) {
      throw new Error("Invalid AI response structure");
    }

    // 2. DEDUCT CREDITS AFTER SUCCESS - ADD THIS BLOCK
    await creditService.deductCredits(
      userId,
      'ai_roadmap',
      null,
      'onboarding_responses',
      { 
        education_level: input.educationLevel,
        dream_career: input.dreamCareer 
      }
    );

    return aiResponse;
  } catch (error: any) {
    console.error("AI Roadmap Generation Error:", error);
    throw new Error(`Failed to generate AI roadmap: ${error.message}`);
  }
}

export function generateFallbackRoadmap(
  input: OnboardingInput
): AIRoadmapResponse {
  // Generic fallback based on education level
  const isHighEducation = [
    "University Student",
    "University Graduate",
    "Certificate/Diploma",
  ].includes(input.educationLevel);

  return {
    personality_summary:
      "Based on your profile, you show strong potential in your chosen field. Your interests align well with current market opportunities.",
    learning_style:
      "Multimodal learner - You benefit from a mix of visual, hands-on, and reading-based learning approaches.",
    strengths: [
      "Strong foundation in selected subjects",
      "Clear career direction",
      "Motivated to learn and grow",
    ],
    challenges: [
      "May need to improve time management skills",
      "Building professional network will be important",
    ],
    recommended_path: input.preferredPath as any,
    recommendation_reasoning: `Your preference for ${input.preferredPath} aligns with your educational background and career goals. This path offers good opportunities in Tanzania's growing economy.`,
    roadmap: {
      phases: [
        {
          timeline: "0-6 months",
          title: "Foundation Building",
          milestones: [
            "Research specific requirements for your dream career",
            "Identify skill gaps and create learning plan",
            "Join relevant online communities and forums",
            "Start building portfolio or CV",
          ],
          estimated_cost_tzs: isHighEducation ? 300000 : 500000,
          resources: [
            "Coursera Tanzania",
            "YouTube educational channels",
            "Local vocational training centers",
          ],
        },
        {
          timeline: "6-12 months",
          title: "Skill Development",
          milestones: [
            "Complete relevant certification or course",
            "Build 2-3 practical projects",
            "Network with professionals in your field",
            "Apply for internships or entry positions",
          ],
          estimated_cost_tzs: isHighEducation ? 500000 : 800000,
          resources: [
            "VETA training programs",
            "Online learning platforms",
            "Local industry meetups",
          ],
        },
        {
          timeline: "1-2 years",
          title: "Experience Gaining",
          milestones: [
            "Secure your first professional role",
            "Continue learning advanced skills",
            "Build professional network",
            "Document your achievements",
          ],
          estimated_cost_tzs: 200000,
          resources: [
            "Professional associations",
            "Industry conferences",
            "Mentorship programs",
          ],
        },
        {
          timeline: "2-5 years",
          title: "Career Growth",
          milestones: [
            "Advance to mid-level position or grow business",
            "Become recognized in your field",
            "Mentor others",
            "Explore leadership opportunities",
          ],
          estimated_cost_tzs: 0,
          resources: [
            "Leadership training",
            "Advanced certifications",
            "Business development resources",
          ],
        },
      ],
      total_estimated_duration: "5 years",
      total_estimated_cost_tzs: isHighEducation ? 1000000 : 1500000,
    },
  };
}

