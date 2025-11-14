-- =====================================================
-- STUDENT LEARNING PLATFORM SCHEMA
-- =====================================================
-- This migration creates tables for student academic tracking,
-- study materials management, AI-powered practice questions,
-- and performance analytics.

-- =====================================================
-- TABLES
-- =====================================================

-- 1. Student Academic Level (One-time setup per user)
CREATE TABLE IF NOT EXISTS public.student_academic_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    education_level VARCHAR(50) NOT NULL, -- 'form_1', 'form_2', 'form_3', 'form_4', 'form_5', 'form_6'
    exam_type VARCHAR(50) NOT NULL, -- 'necta_form_2', 'necta_form_4', 'necta_form_6'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT student_academic_levels_user_id_key UNIQUE (user_id)
);

CREATE INDEX idx_student_levels_user_id ON public.student_academic_levels(user_id);

-- 2. Uploaded Study Materials
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL, -- Supabase storage URL
    file_type VARCHAR(50) NOT NULL, -- 'pdf', 'docx', 'pptx', 'image', 'video'
    file_size BIGINT NOT NULL,
    subject VARCHAR(100) NOT NULL, -- 'Mathematics', 'Physics', 'Chemistry', etc.
    category VARCHAR(50) NOT NULL, -- 'notes', 'study-guide', 'past-papers', 'revision', 'reference'
    description TEXT,
    ai_processed BOOLEAN DEFAULT FALSE, -- Whether AI has analyzed this material
    ai_summary TEXT, -- AI-generated summary of the content
    extracted_text TEXT, -- Full text extracted from the document
    topics JSONB, -- Extracted topics/chapters: ["Algebra", "Geometry", ...]
    key_concepts JSONB, -- Important concepts identified by AI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_study_materials_user_id ON public.study_materials(user_id);
CREATE INDEX idx_study_materials_subject ON public.study_materials(subject);
CREATE INDEX idx_study_materials_category ON public.study_materials(user_id, category);

-- 3. Generated Practice Questions
CREATE TABLE IF NOT EXISTS public.practice_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.study_materials(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
    question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'short_answer', 'essay'
    question_text TEXT NOT NULL,
    options JSONB, -- For multiple choice: ["A) ...", "B) ...", "C) ...", "D) ..."]
    correct_answer TEXT NOT NULL,
    explanation TEXT, -- AI explanation of the correct answer
    source_reference TEXT, -- Reference to the material where this came from
    ai_generated BOOLEAN DEFAULT TRUE,
    times_attempted INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_practice_questions_user_id ON public.practice_questions(user_id);
CREATE INDEX idx_practice_questions_subject ON public.practice_questions(user_id, subject);
CREATE INDEX idx_practice_questions_difficulty ON public.practice_questions(user_id, difficulty_level);
CREATE INDEX idx_practice_questions_material ON public.practice_questions(material_id);

-- 4. Student Question Attempts (Performance Tracking)
CREATE TABLE IF NOT EXISTS public.question_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.practice_questions(id) ON DELETE CASCADE,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER, -- How long student took to answer
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_question_attempts_user_id ON public.question_attempts(user_id);
CREATE INDEX idx_question_attempts_question_id ON public.question_attempts(question_id);
CREATE INDEX idx_question_attempts_date ON public.question_attempts(user_id, attempted_at DESC);

-- 5. AI-Generated Study Guides
CREATE TABLE IF NOT EXISTS public.study_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.study_materials(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL, -- Structured content with sections
    -- Content structure:
    -- {
    --   "summary": "...",
    --   "key_points": ["...", "..."],
    --   "formulas": [{"name": "...", "formula": "...", "explanation": "..."}],
    --   "definitions": [{"term": "...", "definition": "..."}],
    --   "examples": ["...", "..."],
    --   "mnemonics": ["...", "..."]
    -- }
    is_customized BOOLEAN DEFAULT FALSE,
    ai_generated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_study_guides_user_id ON public.study_guides(user_id);
CREATE INDEX idx_study_guides_subject ON public.study_guides(user_id, subject);
CREATE INDEX idx_study_guides_material ON public.study_guides(material_id);

-- 6. Performance Metrics (Subject-wise tracking)
CREATE TABLE IF NOT EXISTS public.student_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    total_questions_attempted INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
    average_time_per_question INTEGER DEFAULT 0, -- in seconds
    topics_mastered JSONB DEFAULT '[]'::jsonb, -- ["Algebra", "Geometry"]
    topics_needs_improvement JSONB DEFAULT '[]'::jsonb,
    study_time_minutes INTEGER DEFAULT 0,
    exam_readiness_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_practice_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT student_performance_user_subject_key UNIQUE (user_id, subject)
);

CREATE INDEX idx_student_performance_user_id ON public.student_performance(user_id);
CREATE INDEX idx_student_performance_subject ON public.student_performance(user_id, subject);

-- 7. Study Sessions (Time tracking)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    session_type VARCHAR(50) NOT NULL, -- 'practice_questions', 'study_guide', 'material_review'
    duration_minutes INTEGER NOT NULL,
    questions_attempted INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_date ON public.study_sessions(user_id, started_at DESC);

-- =====================================================
-- STORAGE BUCKET SETUP
-- =====================================================

-- Create storage bucket for study materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE RLS POLICIES
-- =====================================================

-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own study materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'study-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own files
CREATE POLICY "Users can view their own study materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'study-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own study materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'study-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own study materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'study-materials' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Create or replace the update function (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_student_academic_levels_updated_at
    BEFORE UPDATE ON student_academic_levels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_materials_updated_at
    BEFORE UPDATE ON study_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_questions_updated_at
    BEFORE UPDATE ON practice_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_guides_updated_at
    BEFORE UPDATE ON study_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_performance_updated_at
    BEFORE UPDATE ON student_performance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update performance metrics when questions are attempted
CREATE OR REPLACE FUNCTION update_performance_metrics()
RETURNS TRIGGER AS $$
DECLARE
    v_subject VARCHAR(100);
    v_total_attempted INTEGER;
    v_correct_count INTEGER;
    v_avg_time INTEGER;
BEGIN
    -- Get the subject from the question
    SELECT subject INTO v_subject
    FROM practice_questions
    WHERE id = NEW.question_id;

    -- Calculate metrics
    SELECT
        COUNT(*),
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END),
        AVG(time_spent_seconds)::INTEGER
    INTO v_total_attempted, v_correct_count, v_avg_time
    FROM question_attempts
    WHERE user_id = NEW.user_id
    AND question_id IN (
        SELECT id FROM practice_questions WHERE subject = v_subject
    );

    -- Insert or update performance record
    INSERT INTO student_performance (
        user_id,
        subject,
        total_questions_attempted,
        correct_answers,
        accuracy_percentage,
        average_time_per_question,
        last_practice_date
    ) VALUES (
        NEW.user_id,
        v_subject,
        v_total_attempted,
        v_correct_count,
        ROUND((v_correct_count::DECIMAL / NULLIF(v_total_attempted, 0) * 100), 2),
        v_avg_time,
        NEW.attempted_at
    )
    ON CONFLICT (user_id, subject)
    DO UPDATE SET
        total_questions_attempted = v_total_attempted,
        correct_answers = v_correct_count,
        accuracy_percentage = ROUND((v_correct_count::DECIMAL / NULLIF(v_total_attempted, 0) * 100), 2),
        average_time_per_question = v_avg_time,
        last_practice_date = NEW.attempted_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_performance_metrics
    AFTER INSERT ON question_attempts
    FOR EACH ROW EXECUTE FUNCTION update_performance_metrics();

-- Update question statistics when attempted
CREATE OR REPLACE FUNCTION update_question_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE practice_questions
    SET
        times_attempted = times_attempted + 1,
        times_correct = times_correct + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END
    WHERE id = NEW.question_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_question_stats
    AFTER INSERT ON question_attempts
    FOR EACH ROW EXECUTE FUNCTION update_question_stats();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE student_academic_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for student_academic_levels
CREATE POLICY "Users can view their own academic level"
    ON student_academic_levels FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own academic level"
    ON student_academic_levels FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own academic level"
    ON student_academic_levels FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies for study_materials
CREATE POLICY "Users can view their own materials"
    ON study_materials FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own materials"
    ON study_materials FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials"
    ON study_materials FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own materials"
    ON study_materials FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for practice_questions
CREATE POLICY "Users can view their own questions"
    ON practice_questions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questions"
    ON practice_questions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies for question_attempts
CREATE POLICY "Users can view their own attempts"
    ON question_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts"
    ON question_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies for study_guides
CREATE POLICY "Users can view their own guides"
    ON study_guides FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own guides"
    ON study_guides FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guides"
    ON study_guides FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guides"
    ON study_guides FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for student_performance
CREATE POLICY "Users can view their own performance"
    ON student_performance FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance"
    ON student_performance FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance"
    ON student_performance FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies for study_sessions
CREATE POLICY "Users can view their own sessions"
    ON study_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
    ON study_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE student_academic_levels IS 'Stores one-time student academic level setup';
COMMENT ON TABLE study_materials IS 'Uploaded study materials with AI processing metadata';
COMMENT ON TABLE practice_questions IS 'AI-generated practice questions from materials';
COMMENT ON TABLE question_attempts IS 'Student answers and performance tracking';
COMMENT ON TABLE study_guides IS 'AI-generated customizable study guides';
COMMENT ON TABLE student_performance IS 'Aggregated performance metrics by subject';
COMMENT ON TABLE study_sessions IS 'Time tracking for study activities';
