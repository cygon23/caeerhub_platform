-- Create table for interview practice sessions
CREATE TABLE public.interview_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    position TEXT NOT NULL,
    industry TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('entry', 'intermediate', 'senior')),
    questions JSONB NOT NULL,
    responses JSONB,
    overall_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for interview sessions
CREATE POLICY "Users can manage their own interview sessions" 
ON public.interview_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on interview_sessions
CREATE TRIGGER update_interview_sessions_updated_at
    BEFORE UPDATE ON public.interview_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();