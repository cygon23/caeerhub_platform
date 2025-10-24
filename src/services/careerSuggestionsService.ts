import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface UserProfile {
  educationLevel: string;
  strongestSubjects: string[];
  interests: string[];
  dreamCareer: string;
  preferredPath: string;
  aiRecommendedPath: string;
}

interface CareerSuggestion {
  title: string;
  match: number;
  salary_range_tzs: {
    entry: number;
    mid: number;
    senior: number;
  };
  growth_rate: string;
  location: string;
  description: string;
  skills: string[];
  education: string;
  experience: string;
  demand: string;
  reasoning: string;
}

interface IndustryTrend {
  industry: string;
  growth: string;
  hot_jobs: string;
  relevance: string;
}

interface SkillRecommendation {
  skill: string;
  demand: number;
  time_to_learn: string;
  priority: string;
  gap_reason: string;
}

interface CareerSuggestionsResponse {
  alternative_careers: CareerSuggestion[];
  industry_trends: IndustryTrend[];
  skills_to_develop: SkillRecommendation[];
  overall_analysis: string;
}

export async function generateCareerSuggestions(
  profile: UserProfile
): Promise<CareerSuggestionsResponse> {
  const prompt = `You are a career counselor AI specializing in the Tanzanian job market. Analyze this youth's profile and suggest alternative career paths they might not have considered.

**User Profile:**
- Education Level: ${profile.educationLevel}
- Strongest Subjects: ${profile.strongestSubjects.join(", ")}
- Industries of Interest: ${profile.interests.join(", ")}
- Current Dream Career: ${profile.dreamCareer}
- Preferred Path: ${profile.preferredPath}
- AI Recommended Path: ${profile.aiRecommendedPath}

**Task:**
Generate 4 alternative career suggestions that:
1. Two careers RELATED to their dream career (similar field/industry)
2. Two careers that LEVERAGE their strong subjects but in DIFFERENT fields (help them explore options they might not have considered)

For each career, calculate a match percentage (0-100) based on:
- Subject alignment (40%)
- Interest alignment (30%)
- Path compatibility (20%)
- Market demand in Tanzania (10%)

**Required JSON Output:**
{
  "alternative_careers": [
    {
      "title": "Specific job title",
      "match": 85,
      "salary_range_tzs": {
        "entry": 1500000,
        "mid": 3000000,
        "senior": 6000000
      },
      "growth_rate": "+XX%",
      "location": "Specific cities or Remote",
      "description": "Clear 1-sentence description",
      "skills": ["Skill1", "Skill2", "Skill3", "Skill4"],
      "education": "Required education path",
      "experience": "Entry/Mid/Senior level",
      "demand": "Very High/High/Medium/Low",
      "reasoning": "Why this career matches their profile (2 sentences)"
    }
  ],
  "industry_trends": [
    {
      "industry": "Industry name",
      "growth": "+XX%",
      "hot_jobs": "Job1, Job2",
      "relevance": "Why this industry is relevant to user (1 sentence)"
    }
  ],
  "skills_to_develop": [
    {
      "skill": "Specific skill name",
      "demand": 85,
      "time_to_learn": "X-Y months",
      "priority": "High/Medium/Low",
      "gap_reason": "Why they need this skill (1 sentence)"
    }
  ],
  "overall_analysis": "2-3 sentences summarizing their career options and potential"
}

**Important Guidelines:**
1. Use REALISTIC Tanzanian Shilling (TZS) salary ranges for Tanzania's job market
2. Consider Tanzania's growing industries: Technology, Agriculture, Tourism, Healthcare, Education
3. Match percentages should be honest - not all careers will be 90%+
4. Include both traditional and emerging careers
5. For industry trends, focus on 2 from their interests + 2 trending industries they should consider
6. Skills should bridge gaps between current subjects and dream career
7. Be specific with skill names (not just "Programming" but "Python Programming" or "JavaScript")
8. Growth rates should reflect Tanzania and East Africa market realities
9. Return ONLY valid JSON, no markdown formatting

**Salary Reference (Monthly TZS in Tanzania):**
- Entry level: TZS 800,000 - 2,000,000
- Mid level: TZS 2,000,000 - 5,000,000
- Senior level: TZS 5,000,000 - 15,000,000
(Adjust based on career field and demand)`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert career counselor for Tanzanian youth. You provide realistic, actionable career suggestions in JSON format. Always return valid JSON without markdown code blocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const aiResponse: CareerSuggestionsResponse = JSON.parse(responseText);

    // Validate required fields
    if (
      !aiResponse.alternative_careers ||
      !Array.isArray(aiResponse.alternative_careers) ||
      aiResponse.alternative_careers.length === 0
    ) {
      throw new Error("Invalid AI response structure");
    }

    return aiResponse;
  } catch (error: any) {
    console.error("Career Suggestions Generation Error:", error);
    throw new Error(`Failed to generate career suggestions: ${error.message}`);
  }
}

export function generateFallbackSuggestions(
  profile: UserProfile
): CareerSuggestionsResponse {
  // Generic fallback based on interests
  const isInTech = profile.interests.some(
    (i) => i.includes("Technology") || i.includes("ICT")
  );
  const isInBusiness = profile.interests.some(
    (i) => i.includes("Business") || i.includes("Finance")
  );

  const fallbackCareers: CareerSuggestion[] = [];

  if (isInTech) {
    fallbackCareers.push({
      title: "Software Developer",
      match: 85,
      salary_range_tzs: { entry: 1500000, mid: 3500000, senior: 7000000 },
      growth_rate: "+22%",
      location: "Dar es Salaam, Remote",
      description:
        "Design and develop software applications using programming languages",
      skills: ["JavaScript", "Python", "Problem Solving", "Teamwork"],
      education: "Bachelor's in Computer Science or coding bootcamp",
      experience: "Entry to Mid-level",
      demand: "Very High",
      reasoning:
        "Your interest in technology aligns perfectly with this high-demand career. Strong analytical skills are a great foundation.",
    });

    fallbackCareers.push({
      title: "Data Analyst",
      match: 80,
      salary_range_tzs: { entry: 1200000, mid: 2800000, senior: 5500000 },
      growth_rate: "+18%",
      location: "Dar es Salaam, Arusha",
      description:
        "Analyze data to help organizations make informed business decisions",
      skills: ["Excel", "SQL", "Statistics", "Data Visualization"],
      education: "Bachelor's in any field + data analysis certification",
      experience: "Entry to Mid-level",
      demand: "High",
      reasoning:
        "Growing demand in Tanzania's business sector. Your analytical thinking would be valuable here.",
    });
  }

  if (isInBusiness) {
    fallbackCareers.push({
      title: "Digital Marketing Specialist",
      match: 78,
      salary_range_tzs: { entry: 1000000, mid: 2500000, senior: 5000000 },
      growth_rate: "+19%",
      location: "Major cities, Remote",
      description:
        "Develop and execute digital marketing campaigns across platforms",
      skills: ["SEO", "Social Media", "Analytics", "Content Creation"],
      education: "Bachelor's in Marketing or self-taught with certifications",
      experience: "Entry to Mid-level",
      demand: "High",
      reasoning:
        "Fast-growing field in Tanzania as businesses go digital. Creative and business skills combine well here.",
    });
  }

  // Add general career if we don't have 4 yet
  while (fallbackCareers.length < 4) {
    fallbackCareers.push({
      title: "Project Coordinator",
      match: 75,
      salary_range_tzs: { entry: 1200000, mid: 2800000, senior: 5000000 },
      growth_rate: "+15%",
      location: "Dar es Salaam, Regional offices",
      description:
        "Manage and coordinate projects across different departments",
      skills: [
        "Organization",
        "Communication",
        "Time Management",
        "Leadership",
      ],
      education: "Bachelor's degree in any field",
      experience: "Entry to Mid-level",
      demand: "Medium",
      reasoning:
        "Versatile career that values organization and people skills. Good starting point for many industries.",
    });
  }

  return {
    alternative_careers: fallbackCareers.slice(0, 4),
    industry_trends: [
      {
        industry: "Technology & ICT",
        growth: "+15%",
        hot_jobs: "Software Developer, Data Analyst",
        relevance:
          "Growing sector in Tanzania with increasing digital transformation",
      },
      {
        industry: "Agriculture & Agribusiness",
        growth: "+12%",
        hot_jobs: "Agri-tech Specialist, Supply Chain Manager",
        relevance: "Core sector in Tanzania with modernization opportunities",
      },
      {
        industry: "Healthcare",
        growth: "+10%",
        hot_jobs: "Health Data Analyst, Telemedicine Coordinator",
        relevance:
          "Expanding sector with increasing healthcare access initiatives",
      },
      {
        industry: "Education & Training",
        growth: "+8%",
        hot_jobs: "EdTech Specialist, Curriculum Developer",
        relevance: "Essential sector with ongoing education reforms",
      },
    ],
    skills_to_develop: [
      {
        skill: "Digital Literacy",
        demand: 90,
        time_to_learn: "2-4 months",
        priority: "High",
        gap_reason:
          "Essential skill for modern workplace across all industries",
      },
      {
        skill: "Communication Skills",
        demand: 85,
        time_to_learn: "3-6 months",
        priority: "High",
        gap_reason: "Critical for career advancement and professional success",
      },
      {
        skill: "Problem Solving",
        demand: 88,
        time_to_learn: "Ongoing",
        priority: "High",
        gap_reason: "Highly valued skill that opens doors across industries",
      },
      {
        skill: "Project Management",
        demand: 75,
        time_to_learn: "4-6 months",
        priority: "Medium",
        gap_reason: "Valuable for leadership roles and career progression",
      },
    ],
    overall_analysis:
      "You have a strong foundation with multiple career paths available. Focus on building digital skills and gaining practical experience. Your interests align well with growing sectors in Tanzania's economy.",
  };
}
