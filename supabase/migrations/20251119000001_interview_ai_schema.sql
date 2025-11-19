-- Interview AI Coach Database Schema
-- This migration creates tables for storing interview practice sessions and AI feedback

-- Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Session Configuration
  position text NOT NULL,
  industry text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('entry', 'intermediate', 'senior')),

  -- Session Status
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  current_question integer DEFAULT 0,
  total_questions integer DEFAULT 0,

  -- Session Results
  overall_score integer CHECK (overall_score >= 0 AND overall_score <= 100),
  completion_time integer, -- in seconds

  -- Metadata
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interview Responses Table (stores individual question responses)
CREATE TABLE IF NOT EXISTS interview_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Question Details
  question_number integer NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('behavioral', 'technical', 'situational')),
  question_tips jsonb DEFAULT '[]'::jsonb,

  -- User Response
  response_text text NOT NULL,
  response_time integer, -- time taken to answer in seconds

  -- AI Analysis
  score integer CHECK (score >= 0 AND score <= 100),
  strengths jsonb DEFAULT '[]'::jsonb,
  improvements jsonb DEFAULT '[]'::jsonb,
  suggested_answer text,
  key_points_covered jsonb DEFAULT '[]'::jsonb,
  key_points_missed jsonb DEFAULT '[]'::jsonb,
  communication_score integer CHECK (communication_score >= 0 AND communication_score <= 100),
  content_score integer CHECK (content_score >= 0 AND content_score <= 100),
  structure_score integer CHECK (structure_score >= 0 AND structure_score <= 100),

  -- AI Metadata
  ai_model_used text DEFAULT 'llama-3.3-70b-versatile',
  tokens_used integer DEFAULT 0,
  processing_time integer,

  created_at timestamptz DEFAULT now()
);

-- Interview Feedback Table (stores overall session feedback)
CREATE TABLE IF NOT EXISTS interview_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Overall Assessment
  overall_impression text,
  readiness_level text CHECK (readiness_level IN ('needs_practice', 'developing', 'ready', 'well_prepared')),

  -- Detailed Analysis
  top_strengths jsonb DEFAULT '[]'::jsonb,
  areas_for_improvement jsonb DEFAULT '[]'::jsonb,
  improvement_plan jsonb DEFAULT '[]'::jsonb,

  -- Score Breakdown
  communication_avg integer CHECK (communication_avg >= 0 AND communication_avg <= 100),
  content_avg integer CHECK (content_avg >= 0 AND content_avg <= 100),
  structure_avg integer CHECK (structure_avg >= 0 AND structure_avg <= 100),

  -- Recommendations
  recommended_resources jsonb DEFAULT '[]'::jsonb,
  practice_questions jsonb DEFAULT '[]'::jsonb,
  next_steps jsonb DEFAULT '[]'::jsonb,

  created_at timestamptz DEFAULT now()
);

-- Indexes for better query performance
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_status ON interview_sessions(status);
CREATE INDEX idx_interview_sessions_created_at ON interview_sessions(created_at DESC);

CREATE INDEX idx_interview_responses_session_id ON interview_responses(session_id);
CREATE INDEX idx_interview_responses_user_id ON interview_responses(user_id);
CREATE INDEX idx_interview_responses_question_number ON interview_responses(question_number);

CREATE INDEX idx_interview_feedback_session_id ON interview_feedback(session_id);
CREATE INDEX idx_interview_feedback_user_id ON interview_feedback(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interview_sessions
CREATE POLICY "Users can view their own interview sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview sessions"
  ON interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview sessions"
  ON interview_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for interview_responses
CREATE POLICY "Users can view their own interview responses"
  ON interview_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview responses"
  ON interview_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview responses"
  ON interview_responses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview responses"
  ON interview_responses FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for interview_feedback
CREATE POLICY "Users can view their own interview feedback"
  ON interview_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview feedback"
  ON interview_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview feedback"
  ON interview_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview feedback"
  ON interview_feedback FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_interview_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on interview_sessions
CREATE TRIGGER update_interview_sessions_updated_at
  BEFORE UPDATE ON interview_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_interview_session_updated_at();
