# Edge Function Deployment Guide

## Problem: AI Processing Fails with CORS Error

When uploading study materials, you're seeing:
```
CORS Missing Allow Origin
Status code: 500
AI processing error: FunctionsFetchError: Failed to send a request to the Edge Function
```

## Root Cause

The Edge Function `process-study-material` either:
1. Hasn't been deployed to Supabase yet, OR
2. Is deployed but missing the `GROQ_API_KEY` environment variable

## Solution: Deploy the Edge Function

### Step 1: Set Environment Variable in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `pmcxanorldofcazuwefw`
3. Navigate to **Settings** → **Edge Functions** (or **Project Settings** → **Functions**)
4. Click **Add new secret** or **Environment Variables**
5. Add the following variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** Your Groq API key (get one from https://console.groq.com)

### Step 2: Deploy the Edge Function

**Option A: Using Supabase Dashboard (Manual Deploy)**

1. Supabase Dashboard → **Edge Functions**
2. Click **Deploy a new function**
3. Select: `process-study-material`
4. Upload the function code from: `supabase/functions/process-study-material/index.ts`
5. Click **Deploy**

**Option B: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref pmcxanorldofcazuwefw

# Deploy the specific function
supabase functions deploy process-study-material

# Or deploy all functions at once
supabase functions deploy
```

### Step 3: Verify Deployment

After deployment:

1. Go to **Edge Functions** in Supabase Dashboard
2. You should see: `process-study-material` with status **Active**
3. Click on it to see recent invocations and logs

### Step 4: Test Upload Again

1. Login to your app
2. Navigate to **Examination Preparation** → **Upload Materials**
3. Upload a test file (PDF, Word, etc.)
4. Watch the progress:
   - ✅ Uploading (0-50%)
   - ✅ Processing (50-60%)
   - ✅ AI Analyzing (60-100%)
   - ✅ Completed with AI summary!

---

## What the Function Does

The `process-study-material` Edge Function:

1. **Receives:** Material ID and file content
2. **Extracts:** Text from uploaded documents
3. **Analyzes with AI:** Uses Groq LLaMA 3.3 70B to:
   - Generate a concise summary
   - Extract main topics/chapters
   - Identify key concepts students should master
4. **Updates Database:** Saves AI analysis to `study_materials` table

---

## Environment Variables Needed

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `GROQ_API_KEY` | AI analysis with Groq LLaMA | https://console.groq.com |
| `SUPABASE_URL` | Auto-provided by Supabase | N/A |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided by Supabase | N/A |

**Note:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available in Edge Functions. You only need to add `GROQ_API_KEY`.

---

## Troubleshooting

### Error: "GROQ_API_KEY not configured"

**Solution:** Add the GROQ_API_KEY environment variable in Supabase Dashboard.

### Error: "Failed to send a request to the Edge Function"

**Solution:**
1. Check that the function is deployed (Dashboard → Edge Functions)
2. Verify JWT settings (should be `verify_jwt = false` for this function)
3. Check function logs for errors

### Files Upload But No AI Summary

This is expected if:
- The Edge Function isn't deployed yet
- The GROQ_API_KEY is missing
- The AI processing failed (check Edge Function logs)

Files will still be uploaded and usable, just without AI analysis.

---

## Alternative: Skip AI Processing Temporarily

If you want to skip AI processing for now and just get uploads working:

**Option 1: Comment out AI processing in UploadMaterials.tsx**

In `src/components/dashboard/UploadMaterials.tsx`, comment out line 281:

```typescript
// Step 3: Trigger AI Processing via Edge Function
// await processWithAI(dbData.id, file);  // <-- Comment this out

// Mark as completed immediately
setUploadedFiles((prev) =>
  prev.map((f) =>
    f.id === dbData.id
      ? { ...f, status: "completed", progress: 100 }
      : f
  )
);
```

This will make uploads complete immediately without AI processing.

---

## Deployment Status

- ✅ Edge Function code exists: `supabase/functions/process-study-material/index.ts`
- ✅ Function configured in `supabase/config.toml`
- ✅ CORS headers properly configured
- ⏳ **TODO:** Deploy to Supabase
- ⏳ **TODO:** Add GROQ_API_KEY environment variable

---

## Commands Quick Reference

```bash
# Deploy all Edge Functions
supabase functions deploy

# Deploy specific function
supabase functions deploy process-study-material

# View function logs
supabase functions logs process-study-material

# Test function locally (optional)
supabase functions serve process-study-material
```

---

**After deployment, your complete upload flow will work:**
Upload → Storage → Database → AI Processing → Completed with Summary! 🎉
