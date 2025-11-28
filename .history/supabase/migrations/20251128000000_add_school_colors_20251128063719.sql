-- Add color fields to school_registrations table for school branding
ALTER TABLE public.school_registrations
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#FE047F',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#006807',
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT;

-- Add comment to document the color fields
COMMENT ON COLUMN public.school_registrations.primary_color IS 'Primary brand color for the school (hex format)';
COMMENT ON COLUMN public.school_registrations.secondary_color IS 'Secondary brand color for the school (hex format)';
