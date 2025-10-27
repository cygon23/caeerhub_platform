// ============================================
// COMPREHENSIVE CAREER ASSESSMENT QUESTIONS
// 29 Questions across 4 categories
// ============================================

export interface AssessmentQuestion {
  id: number;
  question: string;
  category: QuestionCategory;
  subcategory: string;
  weight: number; // Importance weight (1-3)
  responseType: "scale" | "scenario";
  context?: string; // Additional context for AI analysis
}

export type QuestionCategory =
  | "personality_workstyle"
  | "skills_competencies"
  | "interests_values"
  | "behavioral_scenarios";

export const assessmentQuestions: AssessmentQuestion[] = [
  // ============================================
  // CATEGORY 1: PERSONALITY & WORK STYLE (10 questions)
  // ============================================
  {
    id: 1,
    question: "I prefer working with people rather than data and numbers..",
    category: "personality_workstyle",
    subcategory: "social_orientation",
    weight: 2,
    responseType: "scale",
    context: "Indicates preference for interpersonal vs analytical work",
  },
  {
    id: 2,
    question: "I enjoy solving complex problems step by step",
    category: "personality_workstyle",
    subcategory: "analytical_thinking",
    weight: 3,
    responseType: "scale",
    context: "Measures analytical and systematic thinking ability",
  },
  {
    id: 3,
    question: "I like to create new ideas and think outside the box",
    category: "personality_workstyle",
    subcategory: "creativity",
    weight: 2,
    responseType: "scale",
    context: "Assesses creative and innovative thinking",
  },
  {
    id: 4,
    question:
      "I feel comfortable leading group discussions and making decisions",
    category: "personality_workstyle",
    subcategory: "leadership",
    weight: 3,
    responseType: "scale",
    context: "Evaluates leadership potential and confidence",
  },
  {
    id: 5,
    question:
      "I prefer structured tasks with clear guidelines over ambiguous projects",
    category: "personality_workstyle",
    subcategory: "structure_preference",
    weight: 2,
    responseType: "scale",
    context: "Determines preference for structure vs flexibility",
  },
  {
    id: 6,
    question:
      "I enjoy hands-on activities and practical work more than theoretical discussions",
    category: "personality_workstyle",
    subcategory: "practical_orientation",
    weight: 2,
    responseType: "scale",
    context: "Identifies practical vs theoretical preference",
  },
  {
    id: 7,
    question: "I work best when I can set my own schedule and pace",
    category: "personality_workstyle",
    subcategory: "autonomy",
    weight: 2,
    responseType: "scale",
    context: "Measures need for autonomy and self-direction",
  },
  {
    id: 8,
    question:
      "I find it easy to focus on one task for extended periods without getting distracted",
    category: "personality_workstyle",
    subcategory: "focus_persistence",
    weight: 3,
    responseType: "scale",
    context: "Evaluates concentration and persistence abilities",
  },
  {
    id: 9,
    question:
      "I prefer to take calculated risks rather than always choosing the safe option",
    category: "personality_workstyle",
    subcategory: "risk_tolerance",
    weight: 2,
    responseType: "scale",
    context: "Assesses risk-taking propensity",
  },
  {
    id: 10,
    question: "I often come up with multiple solutions to a single problem",
    category: "personality_workstyle",
    subcategory: "divergent_thinking",
    weight: 2,
    responseType: "scale",
    context: "Measures creative problem-solving ability",
  },

  // ============================================
  // CATEGORY 2: SKILLS & COMPETENCIES (7 questions)
  // ============================================
  {
    id: 11,
    question:
      "I am comfortable using technology and learning new digital tools quickly",
    category: "skills_competencies",
    subcategory: "technical_aptitude",
    weight: 3,
    responseType: "scale",
    context: "Evaluates digital literacy and tech adaptability",
  },
  {
    id: 12,
    question:
      "I can clearly explain complex ideas to people who are unfamiliar with the topic",
    category: "skills_competencies",
    subcategory: "communication",
    weight: 3,
    responseType: "scale",
    context: "Measures communication and teaching ability",
  },
  {
    id: 13,
    question:
      "I'm skilled at organizing information, schedules, and resources efficiently",
    category: "skills_competencies",
    subcategory: "organization",
    weight: 3,
    responseType: "scale",
    context: "Assesses organizational and planning skills",
  },
  {
    id: 14,
    question:
      "I can quickly adapt my approach when circumstances change unexpectedly",
    category: "skills_competencies",
    subcategory: "adaptability",
    weight: 3,
    responseType: "scale",
    context: "Evaluates flexibility and resilience",
  },
  {
    id: 15,
    question:
      "I'm good at identifying patterns and connections that others might miss",
    category: "skills_competencies",
    subcategory: "pattern_recognition",
    weight: 2,
    responseType: "scale",
    context: "Measures analytical insight and intuition",
  },
  {
    id: 16,
    question:
      "I can work effectively with people from diverse backgrounds and perspectives",
    category: "skills_competencies",
    subcategory: "collaboration",
    weight: 3,
    responseType: "scale",
    context: "Assesses teamwork and cultural intelligence",
  },
  {
    id: 17,
    question:
      "I regularly seek out opportunities to learn new skills or knowledge",
    category: "skills_competencies",
    subcategory: "learning_agility",
    weight: 3,
    responseType: "scale",
    context: "Evaluates growth mindset and continuous learning",
  },

  // ============================================
  // CATEGORY 3: INTERESTS & VALUES (6 questions)
  // ============================================
  {
    id: 18,
    question:
      "Making a positive impact on society is more important to me than financial success",
    category: "interests_values",
    subcategory: "purpose_orientation",
    weight: 2,
    responseType: "scale",
    context: "Identifies value priorities: impact vs compensation",
  },
  {
    id: 19,
    question:
      "I'm drawn to careers that allow me to help and support others directly",
    category: "interests_values",
    subcategory: "helping_orientation",
    weight: 2,
    responseType: "scale",
    context: "Measures altruistic and service-oriented motivation",
  },
  {
    id: 20,
    question:
      "I value having a good work-life balance over rapid career advancement",
    category: "interests_values",
    subcategory: "work_life_balance",
    weight: 2,
    responseType: "scale",
    context: "Assesses life priorities and values",
  },
  {
    id: 21,
    question:
      "I'm interested in staying at the cutting edge of technology and innovation",
    category: "interests_values",
    subcategory: "innovation_interest",
    weight: 2,
    responseType: "scale",
    context: "Identifies tech-forward and innovation mindset",
  },
  {
    id: 22,
    question:
      "I find satisfaction in building systems and processes that improve efficiency",
    category: "interests_values",
    subcategory: "systems_thinking",
    weight: 2,
    responseType: "scale",
    context: "Measures interest in optimization and systems",
  },
  {
    id: 23,
    question:
      "I'm motivated by recognition and acknowledgment of my achievements",
    category: "interests_values",
    subcategory: "recognition_motivation",
    weight: 2,
    responseType: "scale",
    context: "Identifies extrinsic motivation factors",
  },

  // ============================================
  // CATEGORY 4: BEHAVIORAL SCENARIOS (6 questions)
  // ============================================
  {
    id: 24,
    question:
      "When facing a tight deadline, I prioritize completing tasks on time even if they're not perfect",
    category: "behavioral_scenarios",
    subcategory: "deadline_management",
    weight: 3,
    responseType: "scale",
    context: "Reveals approach to time pressure and perfectionism",
  },
  {
    id: 25,
    question:
      "When given a new assignment, I start by breaking it down into smaller, manageable steps",
    category: "behavioral_scenarios",
    subcategory: "planning_approach",
    weight: 3,
    responseType: "scale",
    context: "Shows strategic planning and organization habits",
  },
  {
    id: 26,
    question:
      "If I disagree with a team decision, I voice my concerns rather than going along silently",
    category: "behavioral_scenarios",
    subcategory: "assertiveness",
    weight: 2,
    responseType: "scale",
    context: "Measures assertiveness and conflict navigation",
  },
  {
    id: 27,
    question:
      "When learning something new, I prefer to experiment and figure things out myself rather than following step-by-step instructions",
    category: "behavioral_scenarios",
    subcategory: "learning_style",
    weight: 2,
    responseType: "scale",
    context: "Identifies learning preferences: exploratory vs structured",
  },
  {
    id: 28,
    question:
      "I regularly set specific goals for my personal and professional development",
    category: "behavioral_scenarios",
    subcategory: "goal_orientation",
    weight: 3,
    responseType: "scale",
    context: "Assesses proactive career planning and goal-setting",
  },
  {
    id: 29,
    question:
      "When I make a mistake, I focus on learning from it rather than dwelling on the failure",
    category: "behavioral_scenarios",
    subcategory: "growth_mindset",
    weight: 3,
    responseType: "scale",
    context: "Evaluates resilience and growth mindset",
  },
];

// ============================================
// QUESTION METADATA & HELPERS
// ============================================

export const questionCategories = {
  personality_workstyle: {
    name: "Personality & Work Style",
    description: "Understanding how you prefer to work and interact",
    icon: "Brain",
    color: "#8B5CF6",
  },
  skills_competencies: {
    name: "Skills & Competencies",
    description: "Assessing your current abilities and strengths",
    icon: "Target",
    color: "#10B981",
  },
  interests_values: {
    name: "Interests & Values",
    description: "Exploring what matters most to you in your career",
    icon: "Heart",
    color: "#F59E0B",
  },
  behavioral_scenarios: {
    name: "Behavioral Patterns",
    description: "How you typically respond in real-world situations",
    icon: "Users",
    color: "#3B82F6",
  },
};

// Get questions by category
export const getQuestionsByCategory = (category: QuestionCategory) => {
  return assessmentQuestions.filter((q) => q.category === category);
};

// Get category progress
export const getCategoryProgress = (
  category: QuestionCategory,
  responses: Record<number, number>
): { completed: number; total: number; percentage: number } => {
  const categoryQuestions = getQuestionsByCategory(category);
  const completed = categoryQuestions.filter(
    (q) => responses[q.id] !== undefined
  ).length;
  const total = categoryQuestions.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};

// Validate all questions are answered
export const areAllQuestionsAnswered = (
  responses: Record<number, number>
): boolean => {
  return assessmentQuestions.every(
    (q) => responses[q.id] !== undefined && responses[q.id] > 0
  );
};

// Calculate weighted category scores
export const calculateCategoryScores = (responses: Record<number, number>) => {
  const categoryScores: Record<
    string,
    { total: number; weight: number; avg: number }
  > = {};

  assessmentQuestions.forEach((q) => {
    const response = responses[q.id] || 0;
    const weightedScore = response * q.weight;

    if (!categoryScores[q.subcategory]) {
      categoryScores[q.subcategory] = { total: 0, weight: 0, avg: 0 };
    }

    categoryScores[q.subcategory].total += weightedScore;
    categoryScores[q.subcategory].weight += q.weight;
  });

  // Calculate weighted averages
  Object.keys(categoryScores).forEach((key) => {
    const score = categoryScores[key];
    score.avg =
      score.weight > 0
        ? Math.round((score.total / (score.weight * 5)) * 100)
        : 0;
  });

  return categoryScores;
};

// Response scale labels
export const responseScale = {
  1: { label: "Strongly Disagree", color: "#EF4444" },
  2: { label: "Disagree", color: "#F97316" },
  3: { label: "Neutral", color: "#EAB308" },
  4: { label: "Agree", color: "#22C55E" },
  5: { label: "Strongly Agree", color: "#10B981" },
};

// Assessment completion time estimate
export const estimatedCompletionTime = "6-8 minutes";

// Total questions count
export const totalQuestions = assessmentQuestions.length;
