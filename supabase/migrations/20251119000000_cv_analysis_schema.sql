-- ============================================
-- CV ANALYSIS SCHEMA
-- ============================================
-- This migration creates tables for storing AI-powered CV analysis results

-- Create cv_analysis table
CREATE TABLE IF NOT EXISTS cv_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id uuid REFERENCES user_cvs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Scores (0-100)
  overall_score integer CHECK (overall_score >= 0 AND overall_score <= 100),
  ats_score integer CHECK (ats_score >= 0 AND ats_score <= 100),
  content_quality integer CHECK (content_quality >= 0 AND content_quality <= 100),
  keyword_optimization integer CHECK (keyword_optimization >= 0 AND keyword_optimization <= 100),
  structure_score integer CHECK (structure_score >= 0 AND structure_score <= 100),

  -- Analysis results (JSONB for flexibility)
  strengths jsonb DEFAULT '[]'::jsonb,
  improvements jsonb DEFAULT '[]'::jsonb,
  keyword_suggestions jsonb DEFAULT '[]'::jsonb,
  ats_compatibility jsonb DEFAULT '{}'::jsonb,
  experience_analysis jsonb DEFAULT '[]'::jsonb,
  skills_analysis jsonb DEFAULT '{}'::jsonb,
  summary text,

  -- Context
  target_role text,
  target_industry text,

  -- Metadata
  ai_model_used text DEFAULT 'llama-3.3-70b-versatile',
  tokens_used integer DEFAULT 0,
  processing_time integer, -- in seconds

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_cv_analysis_cv_id ON cv_analysis(cv_id);
CREATE INDEX idx_cv_analysis_user_id ON cv_analysis(user_id);
CREATE INDEX idx_cv_analysis_created_at ON cv_analysis(created_at DESC);
CREATE INDEX idx_cv_analysis_overall_score ON cv_analysis(overall_score DESC);

-- Enable Row Level Security
ALTER TABLE cv_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own CV analyses"
  ON cv_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CV analyses"
  ON cv_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV analyses"
  ON cv_analysis FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV analyses"
  ON cv_analysis FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_cv_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cv_analysis_updated_at
  BEFORE UPDATE ON cv_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_analysis_updated_at();

-- ============================================
-- CV IMPROVEMENT SUGGESTIONS APPLIED TRACKING
-- ============================================
-- Track which AI suggestions users have applied

CREATE TABLE IF NOT EXISTS cv_improvements_applied (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id uuid REFERENCES user_cvs(id) ON DELETE CASCADE NOT NULL,
  analysis_id uuid REFERENCES cv_analysis(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  improvement_type text NOT NULL, -- 'keyword', 'experience_bullet', 'skill', 'formatting'
  improvement_category text,
  original_content text,
  suggested_content text,
  applied_content text,

  applied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_cv_improvements_cv_id ON cv_improvements_applied(cv_id);
CREATE INDEX idx_cv_improvements_user_id ON cv_improvements_applied(user_id);
CREATE INDEX idx_cv_improvements_analysis_id ON cv_improvements_applied(analysis_id);

-- Enable RLS
ALTER TABLE cv_improvements_applied ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own applied improvements"
  ON cv_improvements_applied FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applied improvements"
  ON cv_improvements_applied FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- COMMENTS AND DOCUMENTATION
-- ============================================

COMMENT ON TABLE cv_analysis IS 'Stores AI-powered CV analysis results with detailed scoring and suggestions';
COMMENT ON COLUMN cv_analysis.overall_score IS 'Overall CV quality score (0-100)';
COMMENT ON COLUMN cv_analysis.ats_score IS 'Applicant Tracking System compatibility score (0-100)';
COMMENT ON COLUMN cv_analysis.content_quality IS 'Content quality and impact score (0-100)';
COMMENT ON COLUMN cv_analysis.keyword_optimization IS 'Industry keyword optimization score (0-100)';
COMMENT ON COLUMN cv_analysis.structure_score IS 'CV structure and organization score (0-100)';
COMMENT ON COLUMN cv_analysis.strengths IS 'Array of identified strengths with categories and impact';
COMMENT ON COLUMN cv_analysis.improvements IS 'Array of improvement suggestions with priority and examples';
COMMENT ON COLUMN cv_analysis.keyword_suggestions IS 'Array of recommended keywords to add';
COMMENT ON COLUMN cv_analysis.ats_compatibility IS 'Detailed ATS compatibility analysis';
COMMENT ON COLUMN cv_analysis.experience_analysis IS 'Per-job experience analysis with rewritten bullets';
COMMENT ON COLUMN cv_analysis.skills_analysis IS 'Skills gap analysis and suggestions';

COMMENT ON TABLE cv_improvements_applied IS 'Tracks which AI suggestions users have applied to their CVs';
