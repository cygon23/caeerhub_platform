-- =====================================================
-- Allow school admins to read their own school data
-- =====================================================

-- Policy: School admins can read their own school data
-- This allows school admins to view and update their school profile
CREATE POLICY "School admins can read their own school"
  ON public.school_registrations
  FOR SELECT
  TO authenticated
  USING (
    registration_number IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- Policy: School admins can update their own school data
-- This allows school admins to update their school profile information
CREATE POLICY "School admins can update their own school"
  ON public.school_registrations
  FOR UPDATE
  TO authenticated
  USING (
    registration_number IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    registration_number IN (
      SELECT school_id
      FROM public.profiles
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- Verification query
-- =====================================================

-- Run this to verify the policies work:
-- SELECT * FROM school_registrations;
-- This should now return the school for the logged-in school admin
