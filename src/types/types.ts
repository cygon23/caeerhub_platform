// ============================================
// ASSESSMENT SYSTEM TYPES
// ============================================

export interface AssessmentQuestion {
  id: number;
  question: string;
  category: QuestionCategory;
  subcategory: string;
  weight: number;
  responseType: "scale" | "scenario";
  context?: string;
}

export type QuestionCategory =
  | "personality_workstyle"
  | "skills_competencies"
  | "interests_values"
  | "behavioral_scenarios";

export interface AssessmentResponse {
  questionId: number;
  value: number; // 1-5 scale
  answeredAt: string;
}

export interface AssessmentResponses {
  [questionId: number]: number;
}

// ============================================
// AI ANALYSIS RESULT TYPES
// ============================================

export interface PersonalityProfile {
  type: string; // e.g., "The Analytical Leader"
  description: string;
  traits: string[]; // Key personality traits
  categoryScores: CategoryScores;
  keyCharacteristics: string[];
  workStylePreferences: WorkStylePreferences;
  teamDynamics: string[];
  confidenceScore: number; // 0-100
}

export interface CategoryScores {
  social_orientation: number;
  analytical_thinking: number;
  creativity: number;
  leadership: number;
  structure_preference: number;
  practical_orientation: number;
  autonomy: number;
  focus_persistence: number;
  risk_tolerance: number;
  divergent_thinking: number;
  technical_aptitude: number;
  communication: number;
  organization: number;
  adaptability: number;
  pattern_recognition: number;
  collaboration: number;
  learning_agility: number;
  purpose_orientation: number;
  helping_orientation: number;
  work_life_balance: number;
  innovation_interest: number;
  systems_thinking: number;
  recognition_motivation: number;
  deadline_management: number;
  planning_approach: number;
  assertiveness: number;
  learning_style: number;
  goal_orientation: number;
  growth_mindset: number;
}

export interface WorkStylePreferences {
  preferredEnvironment: string; // "collaborative", "independent", "hybrid"
  communicationStyle: string; // "direct", "diplomatic", "analytical"
  decisionMaking: string; // "quick", "deliberate", "consultative"
  workPace: string; // "fast-paced", "steady", "flexible"
}

export interface Strength {
  name: string;
  level: number; // 0-100
  category: StrengthCategory;
  description: string;
  evidence: string[]; // Specific examples from responses
  careerRelevance: string; // How this applies to careers
  impact: "High" | "Medium" | "Low";
  confidenceScore: number; // 0-100
  developmentTips?: string[]; // How to leverage this strength
}

export type StrengthCategory =
  | "Cognitive"
  | "Interpersonal"
  | "Technical"
  | "Leadership"
  | "Creative"
  | "Organizational";

export interface Weakness {
  name: string;
  level: number; // 0-100 (lower = more problematic)
  category: WeaknessCategory;
  description: string;
  rootCause: string; // Why this might be a challenge
  impact: "High" | "Medium" | "Low";
  improvementPlan: ImprovementPlan;
  confidenceScore: number; // 0-100
}

export type WeaknessCategory =
  | "Time Management"
  | "Communication"
  | "Technical"
  | "Organizational"
  | "Interpersonal"
  | "Emotional";

export interface ImprovementPlan {
  actions: string[]; // Specific steps to take
  timeline: string; // "3 months", "6 months", etc.
  milestones: string[]; // Checkpoints for progress
  resources: string[]; // Books, courses, tools to use
  successMetrics: string[]; // How to measure improvement
}

export interface DevelopmentGoal {
  goal: string;
  priority: "High" | "Medium" | "Low";
  timeline: string;
  category: string;
  actions: string[];
  milestones: Milestone[];
  progress: number; // 0-100
  relatedStrengths: string[]; // Strengths that support this goal
  addressesWeaknesses: string[]; // Weaknesses this helps with
}

export interface Milestone {
  description: string;
  targetDate: string;
  completed: boolean;
}

export interface CareerRecommendation {
  careerPath: string;
  matchScore: number; // 0-100
  reasoning: string;
  requiredSkills: string[];
  strengthsAlignment: string[];
  developmentAreas: string[];
  typicalRoles: string[];
  industryExamples: string[];
}

// ============================================
// COMPLETE AI ANALYSIS RESULT
// ============================================

export interface AIAnalysisResult {
  personalityProfile: PersonalityProfile;
  strengths: Strength[];
  weaknesses: Weakness[];
  developmentGoals: DevelopmentGoal[];
  careerRecommendations: CareerRecommendation[];
  overallInsights: {
    keyTakeaways: string[];
    growthPotential: string;
    recommendedFocus: string[];
  };
  metadata: {
    analysisVersion: string;
    modelUsed: string;
    tokensUsed: number;
    processingTime: number; // seconds
    confidenceScore: number; // 0-100
    generatedAt: string;
  };
}

// ============================================
// DATABASE TYPES
// ============================================

export interface CareerAssessment {
  id: string;
  user_id: string;
  assessment_type: string;
  version: number;
  questions: AssessmentQuestion[];
  responses: AssessmentResponses;
  results: AIAnalysisResult;
  score: number;
  confidence_score: number;
  status: "pending" | "processing" | "completed" | "failed";
  processing_time?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface UserStrengthsWeaknesses {
  id: string;
  user_id: string;
  assessment_id: string;
  strengths: Strength[];
  weaknesses: Weakness[];
  development_goals: DevelopmentGoal[];
  career_recommendations: CareerRecommendation[];
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalityProfileDB {
  id: string;
  user_id: string;
  assessment_id: string;
  personality_type: string;
  description: string;
  traits: string[];
  category_scores: CategoryScores;
  key_characteristics: string[];
  work_style_preferences: WorkStylePreferences;
  team_dynamics: string[];
  confidence_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssessmentProgress {
  id: string;
  user_id: string;
  assessment_type: string;
  current_question: number;
  total_questions: number;
  responses: AssessmentResponses;
  started_at: string;
  last_updated: string;
  expires_at: string;
  is_completed: boolean;
}

export interface AIAnalysisLog {
  id: string;
  assessment_id: string;
  user_id: string;
  stage: "personality" | "strengths" | "weaknesses" | "goals";
  prompt_used: string;
  ai_response: string;
  tokens_used: number;
  processing_time: number;
  success: boolean;
  error_message?: string;
  model_used: string;
  created_at: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface AnalyzeAssessmentRequest {
  userId: string;
  assessmentId?: string; // Optional, will create new if not provided
  questions: AssessmentQuestion[];
  responses: AssessmentResponses;
}

export interface AnalyzeAssessmentResponse {
  success: boolean;
  data?: {
    assessmentId: string;
    analysis: AIAnalysisResult;
  };
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface GetLatestAssessmentRequest {
  userId: string;
}

export interface GetLatestAssessmentResponse {
  success: boolean;
  data?: {
    assessment: CareerAssessment;
    strengthsWeaknesses: UserStrengthsWeaknesses;
    personalityProfile: PersonalityProfileDB;
  };
  error?: {
    message: string;
    code: string;
  };
}

// ============================================
// GROQ API TYPES
// ============================================

export interface GroqChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqChatRequest {
  model: string;
  messages: GroqChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface GroqChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ============================================
// UTILITY TYPES
// ============================================

export type AssessmentStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "expired";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProgressInfo {
  currentQuestion: number;
  totalQuestions: number;
  percentage: number;
  category: QuestionCategory;
  categoryProgress: {
    [key in QuestionCategory]: {
      completed: number;
      total: number;
    };
  };
}
