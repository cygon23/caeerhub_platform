-- Add extended profile fields to school_registrations table

ALTER TABLE school_registrations
ADD COLUMN IF NOT EXISTS established_year INTEGER,
ADD COLUMN IF NOT EXISTS school_type TEXT CHECK (school_type IN ('secondary', 'primary', 'combined')),
ADD COLUMN IF NOT EXISTS ownership TEXT CHECK (ownership IN ('government', 'private', 'religious', 'community')),
ADD COLUMN IF NOT EXISTS motto TEXT,
ADD COLUMN IF NOT EXISTS mission TEXT,
ADD COLUMN IF NOT EXISTS vision TEXT,
ADD COLUMN IF NOT EXISTS alternative_phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS total_capacity INTEGER,
ADD COLUMN IF NOT EXISTS current_enrollment INTEGER,
ADD COLUMN IF NOT EXISTS teaching_staff INTEGER,
ADD COLUMN IF NOT EXISTS non_teaching_staff INTEGER,
ADD COLUMN IF NOT EXISTS facilities JSONB DEFAULT '{
  "library": false,
  "laboratory": false,
  "computer_lab": false,
  "sports_ground": false,
  "hostel": false,
  "cafeteria": false
}'::jsonb;

-- Add comment
COMMENT ON COLUMN school_registrations.facilities IS 'JSON object storing available facilities (library, laboratory, computer_lab, sports_ground, hostel, cafeteria)';
