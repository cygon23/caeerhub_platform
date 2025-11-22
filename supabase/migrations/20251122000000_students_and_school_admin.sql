-- Migration: Add school_id to profiles and create students table
-- Description: Support for school admin and student management

-- 1. Add school_id column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_id text NULL;

-- 2. Add index for school_id for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);

-- 3. Add foreign key constraint to link school_id with school_registrations
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_school_id_fkey
  FOREIGN KEY (school_id)
  REFERENCES public.school_registrations(registration_number)
  ON DELETE SET NULL;

-- 4. Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id text NOT NULL,
  student_name text NOT NULL,
  form_level integer NOT NULL CHECK (form_level >= 1 AND form_level <= 6),
  registration_number text NOT NULL,
  email text NULL,
  phone text NULL,
  gender text NULL CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth date NULL,
  guardian_name text NULL,
  guardian_phone text NULL,
  guardian_email text NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_registration_number_key UNIQUE (registration_number),
  CONSTRAINT students_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.school_registrations(registration_number) ON DELETE CASCADE,
  CONSTRAINT students_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- 5. Create indexes for students table
CREATE INDEX IF NOT EXISTS idx_students_school_id ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_form_level ON public.students(form_level);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_registration_number ON public.students(registration_number);

-- 6. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_students_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_students_timestamp
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION update_students_updated_at();

-- 7. Add RLS policies for students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage all students"
  ON public.students
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- School admins can only manage their own school's students
CREATE POLICY "School admins can manage their school students"
  ON public.students
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
        AND school_id = students.school_id
        AND EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid() AND role = 'school_admin'
        )
    )
  );

-- Students can view their own record
CREATE POLICY "Students can view their own record"
  ON public.students
  FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 8. Add comment to tables
COMMENT ON TABLE public.students IS 'Stores student information managed by school admins';
COMMENT ON COLUMN public.profiles.school_id IS 'Links school admins and students to their school';
