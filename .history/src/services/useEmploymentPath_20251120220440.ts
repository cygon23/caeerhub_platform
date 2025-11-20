import { supabase } from "@/integrations/supabase/client";

export interface CareerStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "pending";
  resources: Array<{ name: string; url: string }>;
  level: string;
}

export interface SkillData {
  id: string;
  name: string;
  category: "technical" | "soft" | "domain";
  importance: "high" | "medium" | "low";
}

export interface MarketData {
  averageSalary: string;
  openPositions: number;
  growthRate: string;
  topEmployers: string[];
  inDemandSkills: string[];
}

export interface OnboardingData {
  user_id: string;
  education_level: string;
  strongest_subjects: string[];
  interests: string[];
  dream_career: string;
  preferred_path: string;
  ai_strengths: string[];
  ai_roadmap_json: any;
  ai_generation_status: string;
}

export interface SkillsAnalysis {
  skillsToLearn: Array<{
    name: string;
    category: string;
    importance: string;
    reason: string;
  }>;
  learningPath: Array<{
    step: number;
    skill: string;
    duration: string;
    priority: string;
    description: string;
  }>;
}

class EmploymentPathService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
  }

  /**
   * Call Groq API with error handling
   */
  private async callGroqAPI(
    prompt: string,
    maxTokens: number = 2000
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        "GROQ API key not configured. Please add VITE_GROQ_API_KEY to your .env file"
      );
    }

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `API request failed with status ${response.status}. Please check your API key.`
        );
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response from API");
      }

      return data.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract JSON from AI response
   */
  private extractJSON(text: string): any {
    const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Fetch user's onboarding data
   */
  async getOnboardingData(userId: string): Promise<OnboardingData> {
    const { data, error } = await supabase
      .from("onboarding_responses")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Generate career roadmap using AI
   */
  async generateRoadmap(onboarding: OnboardingData): Promise<CareerStep[]> {
    const prompt = `Create a detailed career roadmap for someone who wants to become a ${
      onboarding.dream_career
    }. 
    
Their education level: ${onboarding.education_level}
Their interests: ${onboarding.interests?.join(", ") || "Not specified"}
Their strengths: ${onboarding.ai_strengths?.join(", ") || "Not specified"}

Generate 6-8 progressive steps from beginner to professional level. For each step, include:
1. Title (clear and actionable)
2. Description (2-3 sentences explaining what to achieve)
3. Duration estimate (realistic timeframe)
4. Priority (high/medium/low)
5. 3-4 specific, real online resources with actual URLs
6. Level (Beginner/Intermediate/Advanced/Professional)

IMPORTANT for resources - Only include real, accessible URLs from these platforms:
- freeCodeCamp.org
- MDN Web Docs (developer.mozilla.org)
- Coursera.org
- edX.org
- YouTube.com (official channels)
- Official documentation sites
- Khan Academy (khanacademy.org)
- W3Schools.com
- GitHub.com (learning repositories)

Return ONLY a JSON array with this exact structure (no additional text):
[{
  "title": "string",
  "description": "string",
  "duration": "string",
  "priority": "high|medium|low",
  "level": "string",
  "resources": [{"name": "string", "url": "string"}]
}]`;

    try {
      const response = await this.callGroqAPI(prompt, 3000);
      const steps = this.extractJSON(response);

      // Add IDs and status
      return steps.map((step: any, index: number) => ({
        ...step,
        id: `step-${index + 1}`,
        status: index === 0 ? "in-progress" : "pending",
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save roadmap to database
   */
  async saveRoadmap(userId: string, steps: CareerStep[]): Promise<void> {
    const { error } = await supabase
      .from("onboarding_responses")
      .update({
        ai_roadmap_json: { steps },
        ai_generation_status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;
  }

  /**
   * Load career skills from database or generate new ones
   */
  async loadCareerSkills(career: string): Promise<SkillData[]> {
    const { data: existingSkills, error } = await supabase
      .from("career_skills")
      .select("*")
      .eq("career_title", career)
      .maybeSingle();

    if (!error && existingSkills && existingSkills.skills) {
      if (!Array.isArray(existingSkills.skills)) return [];
      return existingSkills.skills.map((s: any) => ({
        ...s,
        name: String(s.name),
        category: String(s.category),
        id: String(s.id),
      }));
    }

    return await this.generateCareerSkills(career);
  }

  /**
   * Generate career skills using AI
   */
  async generateCareerSkills(career: string): Promise<SkillData[]> {
    const prompt = `List 20-25 essential skills for a ${career}. Include:
- Technical skills specific to this career
- Soft skills that are important
- Domain knowledge required

Return ONLY a JSON array (no additional text):
[{
  "name": "string",
  "category": "technical|soft|domain",
  "importance": "high|medium|low"
}]

Example format:
[
  {"name": "JavaScript", "category": "technical", "importance": "high"},
  {"name": "Communication", "category": "soft", "importance": "high"}
]`;

    try {
      const response = await this.callGroqAPI(prompt, 2000);
      const skills = this.extractJSON(response);

      // Add IDs
      const skillsWithIds = skills.map((skill: any, index: number) => ({
        ...skill,
        id: `skill-${index + 1}`,
      }));

      // Save to database
      await this.saveCareerSkills(career, skillsWithIds);

      return skillsWithIds;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save career skills to database
   */
  async saveCareerSkills(career: string, skills: SkillData[]): Promise<void> {
    try {
      const { error } = await supabase.from("career_skills").upsert(
        {
          career_title: career,
          skills: skills, // Pass array directly, do NOT stringify
          updated_at: new Date().toISOString(),
        },
        { onConflict: "career_title" }
      );

      if (error) console.error("Error saving career skills:", error);
    } catch (err) {
      console.error(err);
    }
  }

  async getCareerSkillAnalysis(
    userId: string,
    selectedSkillIds: string[]
  ): Promise<SkillsAnalysis> {
    try {
      const onboarding = await this.getOnboardingData(userId);
      const allSkills = await this.loadCareerSkills(onboarding.dream_career);

      // Run AI analysis for the missing skills
      const analysis = await this.analyzeSkillsGap(
        onboarding.dream_career,
        selectedSkillIds,
        allSkills
      );

      return analysis;
    } catch (error) {
      console.error("Error getting skill analysis:", error);
      throw error;
    }
  }

  /**
   * Analyze skills gap
   */
  async analyzeSkillsGap(
    dreamCareer: string,
    currentSkills: string[],
    allSkills: SkillData[]
  ): Promise<SkillsAnalysis> {
    const currentSkillNames = allSkills
      .filter((s) => currentSkills.includes(s.id))
      .map((s) => s.name);

    const prompt = `A person wants to become a ${dreamCareer}.

They currently have these skills: ${currentSkillNames.join(", ")}

All required skills for this career: ${allSkills.map((s) => s.name).join(", ")}

Analyze the skills gap and provide:
1. List of top 8-10 skills they need to develop (prioritized by importance)
2. A learning path with 4-5 steps

Return ONLY a JSON object (no additional text):
{
  "skillsToLearn": [
    {
      "name": "string",
      "category": "string",
      "importance": "high|medium|low",
      "reason": "string (one sentence why it's important)"
    }
  ],
  "learningPath": [
    {
      "step": 1,
      "skill": "string",
      "duration": "string",
      "priority": "high|medium|low",
      "description": "string (2 sentences about what to learn)"
    }
  ]
}`;

    try {
      const response = await this.callGroqAPI(prompt, 2000);
      return this.extractJSON(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Load market data for a career
   */
  async loadMarketData(career: string): Promise<MarketData> {
    const prompt = `Provide realistic current market data for ${career} in East Africa (Kenya, Tanzania, Uganda).

Return ONLY a JSON object (no additional text):
{
  "averageSalary": "TZ X,XXX - X,XXX per month",
  "openPositions": 150,
  "growthRate": "XX%",
  "topEmployers": ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"],
  "inDemandSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"]
}

Provide realistic data based on the East African job market.`;

    try {
      const response = await this.callGroqAPI(prompt, 1000);
      return this.extractJSON(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update step status
   */
  async updateStepStatus(
    userId: string,
    stepId: string,
    status: CareerStep["status"]
  ): Promise<void> {
    const { data: onboarding } = await supabase
      .from("onboarding_responses")
      .select("ai_roadmap_json")
      .eq("user_id", userId)
      .single();

    if (!onboarding?.ai_roadmap_json?.steps) return;

    const updatedSteps = onboarding.ai_roadmap_json.steps.map(
      (step: CareerStep) => (step.id === stepId ? { ...step, status } : step)
    );

    await supabase
      .from("onboarding_responses")
      .update({
        ai_roadmap_json: { steps: updatedSteps },
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  }
}

export const employmentPathService = new EmploymentPathService();
