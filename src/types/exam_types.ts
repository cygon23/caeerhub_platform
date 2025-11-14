export type EducationLevel = 
  | 'form_1' 
  | 'form_2' 
  | 'form_3' 
  | 'form_4' 
  | 'form_5' 
  | 'form_6';

export type ExamType = 
  | 'necta_form_2' 
  | 'necta_form_4' 
  | 'necta_form_6';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionType = 'multiple_choice' | 'short_answer' | 'essay';

export type MaterialCategory = 
  | 'notes' 
  | 'study-guide' 
  | 'past-papers' 
  | 'revision' 
  | 'reference';

export type FileType = 'pdf' | 'docx' | 'pptx' | 'image' | 'video';

export type SessionType = 
  | 'practice_questions' 
  | 'study_guide' 
  | 'material_review';

export interface StudentAcademicLevel {
  id: string;
  user_id: string;
  education_level: EducationLevel;
  exam_type: ExamType;
  created_at: string;
  updated_at: string;
}

export interface StudyMaterial {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: FileType;
  file_size: number;
  subject: string;
  category: MaterialCategory;
  description?: string;
  ai_processed: boolean;
  ai_summary?: string;
  extracted_text?: string;
  topics?: string[];
  key_concepts?: string[];
  created_at: string;
  updated_at: string;
}

export interface PracticeQuestion {
  id: string;
  user_id: string;
  material_id?: string;
  subject: string;
  difficulty_level: DifficultyLevel;
  question_type: QuestionType;
  question_text: string;
  options?: string[]; // For multiple choice
  correct_answer: string;
  explanation?: string;
  source_reference?: string;
  ai_generated: boolean;
  times_attempted: number;
  times_correct: number;
  created_at: string;
  updated_at: string;
}

export interface QuestionAttempt {
  id: string;
  user_id: string;
  question_id: string;
  student_answer: string;
  is_correct: boolean;
  time_spent_seconds?: number;
  attempted_at: string;
}

export interface StudyGuideContent {
  summary: string;
  key_points: string[];
  formulas?: Array<{
    name: string;
    formula: string;
    explanation: string;
  }>;
  definitions?: Array<{
    term: string;
    definition: string;
  }>;
  examples?: string[];
  mnemonics?: string[];
}

export interface StudyGuide {
  id: string;
  user_id: string;
  material_id?: string;
  subject: string;
  title: string;
  content: StudyGuideContent;
  is_customized: boolean;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentPerformance {
  id: string;
  user_id: string;
  subject: string;
  total_questions_attempted: number;
  correct_answers: number;
  accuracy_percentage: number;
  average_time_per_question: number;
  topics_mastered: string[];
  topics_needs_improvement: string[];
  study_time_minutes: number;
  exam_readiness_percentage: number;
  last_practice_date?: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject: string;
  session_type: SessionType;
  duration_minutes: number;
  questions_attempted: number;
  started_at: string;
  ended_at: string;
  created_at: string;
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface UploadMaterialRequest {
  file: File;
  subject: string;
  category: MaterialCategory;
  description?: string;
}

export interface GenerateQuestionsRequest {
  material_id: string;
  subject: string;
  difficulty_level: DifficultyLevel;
  question_type: QuestionType;
  count?: number; // Number of questions to generate
}

export interface GenerateStudyGuideRequest {
  material_id: string;
  subject: string;
  include_formulas?: boolean;
  include_mnemonics?: boolean;
}

export interface SubmitAnswerRequest {
  question_id: string;
  student_answer: string;
  time_spent_seconds?: number;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  correct_answer: string;
  explanation?: string;
  performance_update: {
    accuracy_percentage: number;
    total_attempted: number;
  };
}

export interface QuestionGenerationResponse {
  questions: PracticeQuestion[];
  cached: boolean; // Whether these were retrieved from cache or newly generated
}

// =====================================================
// UI STATE TYPES
// =====================================================

export interface QuestionFilters {
  subject?: string;
  difficulty_level?: DifficultyLevel;
  question_type?: QuestionType;
}

export interface PerformanceChartData {
  subject: string;
  accuracy: number;
  questionsAttempted: number;
  examReadiness: number;
}

export interface SubjectProgress {
  subject: string;
  accuracy: number;
  totalQuestions: number;
  topicsMastered: number;
  topicsNeedImprovement: number;
  studyTimeMinutes: number;
  lastPracticeDate?: string;
}