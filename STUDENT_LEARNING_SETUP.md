# Student Learning Platform Setup Guide

## Overview
This guide will help you set up the student learning platform with database tables, storage bucket, and RLS policies.

## The Problem You Were Facing

The error you encountered:
```
Upload error: StorageApiError: new row violates row-level security policy
```

**Root Cause:** This error occurs because the Supabase **Storage Bucket** for `study-materials` either:
1. Doesn't exist yet, OR
2. Exists but has no RLS policies configured

**Important Note:** Storage bucket RLS policies are SEPARATE from database table RLS policies. Disabling RLS on the `study_materials` table won't fix storage upload issues.

## Solution Steps

### Step 1: Apply the Database Migration

**IMPORTANT:** If you've already created the tables but uploads are still failing, skip to **Step 1B** below.

#### Step 1A: Full Schema Setup (If you haven't run anything yet)

The migration file has been created at:
`supabase/migrations/20251114053957_student_learning_schema.sql`

**Using Supabase Dashboard:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `pmcxanorldofcazuwefw`
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/20251114053957_student_learning_schema.sql`
6. Paste into the SQL editor
7. Click **Run** or press `Ctrl+Enter`

#### Step 1B: Storage Bucket Setup Only (If you already created the tables)

If you've already run the table creation SQL and only need the storage bucket setup:

**Using Supabase Dashboard:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `pmcxanorldofcazuwefw`
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/20251114054500_storage_bucket_setup.sql`
6. Paste into the SQL editor
7. Click **Run** or press `Ctrl+Enter`

This will:
- Create the `study-materials` storage bucket (safely, won't error if exists)
- Drop and recreate all storage RLS policies (ensuring they're correct)
- Fix your upload error without affecting existing tables

### Step 2: Verify Storage Bucket Creation

After running the migration, verify the storage bucket was created:

1. Go to Supabase Dashboard → **Storage** (left sidebar)
2. You should see a bucket named **study-materials**
3. Click on it to verify it's set to **Public**

### Step 3: Verify Storage RLS Policies

Check that the storage policies were created:

1. In Supabase Dashboard → **Storage** → **study-materials**
2. Click on **Policies** tab
3. You should see 4 policies:
   - ✅ Users can upload their own study materials (INSERT)
   - ✅ Users can view their own study materials (SELECT)
   - ✅ Users can update their own study materials (UPDATE)
   - ✅ Users can delete their own study materials (DELETE)

**If policies are missing**, you can create them manually using the SQL editor:

```sql
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
```

### Step 4: Verify Database Tables

Check that all tables were created:

1. In Supabase Dashboard → **Table Editor** (left sidebar)
2. You should see these new tables:
   - ✅ student_academic_levels
   - ✅ study_materials
   - ✅ practice_questions
   - ✅ question_attempts
   - ✅ study_guides
   - ✅ student_performance
   - ✅ study_sessions

### Step 5: Test the Upload Flow

1. Login to your application
2. Navigate to **Examination Preparation** → **Upload Materials**
3. Complete the academic level setup if prompted
4. Select a **Category** and **Subject**
5. Upload a test file (PDF, Word, etc.)
6. Watch the progress indicators:
   - **Uploading** (0-50%): File is being uploaded to storage
   - **Processing** (50-60%): Database record is being created
   - **AI Analyzing** (60-100%): AI is processing the content
   - **Completed**: File is ready with AI summary

## What the Migration Creates

### Database Tables (7 tables)
1. **student_academic_levels** - Stores user's education level (Form 1-6) and exam type
2. **study_materials** - Uploaded files with metadata and AI analysis
3. **practice_questions** - AI-generated questions from materials
4. **question_attempts** - Student answers and performance tracking
5. **study_guides** - AI-generated study guides
6. **student_performance** - Aggregated metrics by subject
7. **study_sessions** - Time tracking for study activities

### Storage Bucket
- **Bucket Name:** study-materials
- **Access:** Public (files are accessible via public URLs)
- **Structure:** Files organized by user ID in folders

### Security Features
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Storage policies enforce user-based file access
- ✅ Automatic triggers for performance metrics

### Automatic Features (Triggers)
- Auto-update timestamps on record changes
- Auto-calculate performance metrics when questions are attempted
- Auto-update question statistics (times attempted/correct)

## How the Upload Flow Works

```
User selects file
    ↓
Category & Subject validation
    ↓
Upload to Supabase Storage (study-materials bucket)
    └─ Path: {user_id}/{timestamp}-{filename}
    └─ Progress: 0-50%
    ↓
Save metadata to study_materials table
    └─ Includes: file_url, subject, category, size, type
    └─ Progress: 50-60%
    ↓
AI Processing (Edge Function: process-study-material)
    └─ Extracts text from document
    └─ Generates summary and key concepts
    └─ Updates study_materials with AI data
    └─ Progress: 60-100%
    ↓
Display in "My Materials" with AI badge
```

## Troubleshooting

### Error: "new row violates row-level security policy"
**Solution:** Make sure you've applied the migration and storage policies exist.

### Error: "Failed to upload file"
**Solution:**
1. Check that the user is authenticated (`auth.uid()` exists)
2. Verify the storage bucket exists
3. Check browser console for detailed error messages

### Files upload but don't appear in "My Materials"
**Solution:**
1. Check RLS policies on `study_materials` table
2. Verify the user_id matches the authenticated user
3. Try clicking the refresh button

### AI Processing fails
**Solution:**
1. This is expected if the Edge Function `process-study-material` isn't deployed yet
2. Files will still be uploaded and usable, just without AI summary
3. You can deploy the Edge Function later

## File Organization

After setup, your files will be organized as:
```
study-materials/
  ├── {user_1_uuid}/
  │   ├── 1234567890-Math_Notes.pdf
  │   ├── 1234567891-Physics_Guide.docx
  │   └── ...
  ├── {user_2_uuid}/
  │   └── ...
```

## Next Steps

After setup is complete:
1. ✅ Users can upload study materials
2. ✅ Materials are automatically categorized and tagged
3. ✅ AI processes documents (when Edge Function is deployed)
4. ⏳ Implement practice question generation
5. ⏳ Implement study guide generation
6. ⏳ Build performance analytics dashboard

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase logs in Dashboard → Logs
3. Verify all policies are active
4. Ensure user is authenticated

---

**Created:** 2025-11-14
**Migration File:** supabase/migrations/20251114053957_student_learning_schema.sql
