-- Create school_registrations table for pending school applications
CREATE TABLE IF NOT EXISTS public.school_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE(contact_email),
  UNIQUE(registration_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_school_registrations_status ON public.school_registrations(status);
CREATE INDEX IF NOT EXISTS idx_school_registrations_email ON public.school_registrations(contact_email);

-- Enable RLS
ALTER TABLE public.school_registrations ENABLE ROW LEVEL SECURITY;

-- Admin users can see all school registrations
CREATE POLICY "Admins can view all school registrations"
  ON public.school_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admin users can update school registrations (approve/reject)
CREATE POLICY "Admins can update school registrations"
  ON public.school_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Anyone can insert a school registration (public signup)
CREATE POLICY "Anyone can create school registration"
  ON public.school_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_school_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_school_registrations_timestamp
  BEFORE UPDATE ON public.school_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_school_registrations_updated_at();

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.school_registrations TO anon;
GRANT SELECT, INSERT, UPDATE ON public.school_registrations TO authenticated;
