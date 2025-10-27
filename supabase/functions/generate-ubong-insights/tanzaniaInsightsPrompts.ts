import type { AIAnalysisResult } from "../../../src/types/types.ts";

// City context data for better AI responses
const CITY_CONTEXT = {
  dar_es_salaam: {
    name: "Dar es Salaam",
    population: "6M+",
    economy: "Financial hub, tech startups, logistics, manufacturing",
    strengths: "Largest economy, international connections, diverse industries",
  },
  arusha: {
    name: "Arusha",
    population: "600K+",
    economy: "Tourism, safari industry, conservation, agriculture",
    strengths: "Safari gateway, international organizations, eco-tourism",
  },
  mwanza: {
    name: "Mwanza",
    population: "1M+",
    economy: "Fishing, agriculture, mining, trade",
    strengths:
      "Lake Victoria access, regional trade hub, growing manufacturing",
  },
  dodoma: {
    name: "Dodoma",
    population: "500K+",
    economy: "Government, public administration, education",
    strengths: "Capital city, government employment, infrastructure growth",
  },
  mbeya: {
    name: "Mbeya",
    population: "400K+",
    economy: "Agriculture, mining, tourism, highland crops",
    strengths: "Strategic location, mining sector, agricultural potential",
  },
};

// ============================================
// SYSTEM PROMPT
// ============================================

export const TANZANIA_INSIGHTS_SYSTEM_PROMPT = `You are a career insights specialist for Tanzania's job market. You provide accurate, realistic, and actionable career information based on:
- Current economic trends in Tanzania (2024-2025)
- Regional differences across major cities
- Local salary ranges in Tanzanian Shillings (TZS)
- Skills in demand by Tanzanian employers
- Growth sectors and emerging opportunities

Your insights must be:
1. Specific to Tanzania's context and economy
2. Realistic and achievable for youth
3. Based on actual market conditions
4. Include proper TZS salary ranges
5. Consider regional economic differences

Always respond with valid JSON only. No markdown, no explanations outside JSON.`;

// ============================================
// MARKET OVERVIEW PROMPT
// ============================================

export const generateMarketOverviewPrompt = (
  location: string,
  userProfile: {
    personalityType: string;
    strengths: string[];
    interests: string[];
  }
) => {
  const cityContext = CITY_CONTEXT[location as keyof typeof CITY_CONTEXT];

  return `Generate a detailed job market overview for ${
    cityContext.name
  }, Tanzania.

CITY CONTEXT:
${JSON.stringify(cityContext, null, 2)}

USER PROFILE:
- Personality Type: ${userProfile.personalityType}
- Key Strengths: ${userProfile.strengths.join(", ")}
- Interests: ${userProfile.interests.join(", ")}

TASK:
Create 4 growth sectors in ${
    cityContext.name
  } that match this user's profile. Each sector should be realistic for Tanzania's current job market (2024-2025).

REQUIRED JSON OUTPUT:
{
  "sectors": [
    {
      "name": "Technology & Digital Services",
      "growth": "+15%",
      "openings": 120,
      "avgSalary": "TZS 1.2M - 4.5M",
      "demand": "High",
      "demandLevel": "high",
      "description": "Brief description of this sector in ${cityContext.name}",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "matchReason": "Why this matches the user's profile (1-2 sentences)",
      "topEmployers": ["Company 1", "Company 2", "Company 3"],
      "entryRequirements": "What's needed to enter this field"
    }
  ]
}

GUIDELINES:
1. Salary ranges must be realistic for Tanzania (use TZS)
2. Entry-level: TZS 600K - 1.5M per year
3. Mid-level: TZS 1.5M - 4M per year
4. Senior: TZS 4M - 10M+ per year
5. Growth percentages should reflect actual sector trends
6. Job openings should be realistic for ${cityContext.name} market size
7. Skills should be in-demand in Tanzania
8. Match each sector to the user's strengths/personality
9. Demand levels: "Very High", "High", "Medium"
10. Include real company types that operate in ${cityContext.name}

Respond with ONLY the JSON object.`;
};

// ============================================
// EMERGING OPPORTUNITIES PROMPT
// ============================================

export const generateEmergingOpportunitiesPrompt = (
  location: string,
  userProfile: {
    personalityType: string;
    strengths: string[];
    weaknesses: string[];
  }
) => {
  const cityContext = CITY_CONTEXT[location as keyof typeof CITY_CONTEXT];

  return `Generate emerging career opportunities for ${
    cityContext.name
  }, Tanzania.

CITY CONTEXT:
${JSON.stringify(cityContext, null, 2)}

USER PROFILE:
- Personality: ${userProfile.personalityType}
- Strengths: ${userProfile.strengths.join(", ")}
- Development Areas: ${userProfile.weaknesses.join(", ")}

TASK:
Identify 3-4 emerging opportunities in ${cityContext.name} that:
1. Are realistic for Tanzania's developing market
2. Match the user's strengths
3. Are expected to grow in next 6-36 months
4. Consider local economic development plans

REQUIRED JSON OUTPUT:
{
  "opportunities": [
    {
      "title": "Green Energy Solutions",
      "description": "Solar power installation and maintenance for homes and businesses",
      "timeframe": "6-18 months",
      "potential": "High",
      "potentialLevel": "high",
      "skillsNeeded": ["Solar Installation", "Electrical Engineering", "Sales"],
      "whyEmerging": "Government push for renewable energy + unreliable grid",
      "estimatedJobs": 200,
      "salaryRange": "TZS 800K - 2.5M",
      "entryBarrier": "Low to Medium",
      "matchScore": 85,
      "whyGoodFit": "Matches your [strength] and aligns with your interest in [interest]"
    }
  ]
}

GUIDELINES:
1. Focus on realistic emerging sectors for Tanzania:
   - Renewable energy (solar especially)
   - Mobile money & fintech
   - AgriTech and smart farming
   - E-commerce and delivery
   - EdTech and online learning
   - Healthcare tech (telemedicine)
   - Tourism tech (booking, experiences)
2. Timeframes should be realistic (6-36 months)
3. Potential levels: "Very High", "High", "Medium"
4. Consider government initiatives and infrastructure projects
5. Include why each opportunity is emerging NOW
6. Match opportunities to user's profile (matchScore 0-100)
7. Entry barriers: "Low", "Medium", "High"
8. Salary ranges in TZS appropriate for emerging fields

Respond with ONLY the JSON object.`;
};

// ============================================
// HELPER: Extract User Profile from Assessment
// ============================================

export const extractUserProfile = (assessment: AIAnalysisResult) => {
  return {
    personalityType: assessment.personalityProfile.type,
    strengths: assessment.strengths.map((s) => s.name).slice(0, 3),
    weaknesses: assessment.weaknesses.map((w) => w.name).slice(0, 2),
    interests: assessment.personalityProfile.traits.slice(0, 3),
  };
};

// ============================================
// VALIDATION HELPER
// ============================================

export const validateInsightsResponse = (data: any): boolean => {
  if (!data) return false;

  // Validate market overview
  if (data.sectors) {
    if (!Array.isArray(data.sectors)) return false;
    if (data.sectors.length < 3) return false;

    for (const sector of data.sectors) {
      if (!sector.name || !sector.growth || !sector.avgSalary) return false;
    }
  }

  // Validate opportunities
  if (data.opportunities) {
    if (!Array.isArray(data.opportunities)) return false;
    if (data.opportunities.length < 3) return false;

    for (const opp of data.opportunities) {
      if (!opp.title || !opp.description || !opp.timeframe) return false;
    }
  }

  return true;
};
