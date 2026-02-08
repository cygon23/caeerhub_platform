-- Migration: Daily Token Usage Tracking
-- Created: 2026-02-09
-- Description: Adds table and functions for tracking daily token usage per user
--              with 100,000 token daily limit and 2-hour cooldown

-- ============================================
-- 1. Daily Token Usage Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_daily_token_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Usage tracking
  tokens_used bigint NOT NULL DEFAULT 0,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,

  -- Limit tracking
  limit_reached_at timestamptz,
  cooldown_ends_at timestamptz,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- One record per user per day
  CONSTRAINT unique_user_daily_usage UNIQUE (user_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_ai_daily_token_usage_user_date
  ON public.ai_daily_token_usage(user_id, usage_date DESC);

COMMENT ON TABLE public.ai_daily_token_usage IS 'Tracks daily token usage per user for rate limiting';

-- ============================================
-- 2. Function to record token usage
-- ============================================
CREATE OR REPLACE FUNCTION public.record_token_usage(
  p_user_id uuid,
  p_tokens integer
)
RETURNS TABLE (
  tokens_used bigint,
  daily_limit integer,
  limit_reached boolean,
  cooldown_ends_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_daily_limit integer := 100000;
  v_cooldown_hours integer := 2;
  v_current_usage bigint;
  v_cooldown timestamptz;
BEGIN
  -- Upsert daily usage record
  INSERT INTO ai_daily_token_usage (user_id, tokens_used, usage_date)
  VALUES (p_user_id, p_tokens, CURRENT_DATE)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET
    tokens_used = ai_daily_token_usage.tokens_used + p_tokens,
    updated_at = now();

  -- Get current usage
  SELECT adt.tokens_used, adt.cooldown_ends_at
  INTO v_current_usage, v_cooldown
  FROM ai_daily_token_usage adt
  WHERE adt.user_id = p_user_id AND adt.usage_date = CURRENT_DATE;

  -- Check if limit just reached
  IF v_current_usage >= v_daily_limit AND v_cooldown IS NULL THEN
    v_cooldown := now() + (v_cooldown_hours || ' hours')::interval;
    UPDATE ai_daily_token_usage
    SET limit_reached_at = now(), cooldown_ends_at = v_cooldown
    WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
  END IF;

  RETURN QUERY SELECT
    v_current_usage as tokens_used,
    v_daily_limit as daily_limit,
    (v_current_usage >= v_daily_limit) as limit_reached,
    v_cooldown as cooldown_ends_at;
END;
$$;

COMMENT ON FUNCTION public.record_token_usage IS 'Records token usage and checks daily limits';

-- ============================================
-- 3. Function to check daily token usage
-- ============================================
CREATE OR REPLACE FUNCTION public.get_daily_token_usage(
  p_user_id uuid
)
RETURNS TABLE (
  tokens_used bigint,
  daily_limit integer,
  limit_reached boolean,
  cooldown_ends_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_daily_limit integer := 100000;
  v_tokens bigint;
  v_cooldown timestamptz;
BEGIN
  SELECT adt.tokens_used, adt.cooldown_ends_at
  INTO v_tokens, v_cooldown
  FROM ai_daily_token_usage adt
  WHERE adt.user_id = p_user_id AND adt.usage_date = CURRENT_DATE;

  IF NOT FOUND THEN
    v_tokens := 0;
    v_cooldown := NULL;
  END IF;

  -- If cooldown has passed, reset
  IF v_cooldown IS NOT NULL AND v_cooldown <= now() THEN
    UPDATE ai_daily_token_usage
    SET tokens_used = 0, limit_reached_at = NULL, cooldown_ends_at = NULL, updated_at = now()
    WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
    v_tokens := 0;
    v_cooldown := NULL;
  END IF;

  RETURN QUERY SELECT
    COALESCE(v_tokens, 0::bigint) as tokens_used,
    v_daily_limit as daily_limit,
    (COALESCE(v_tokens, 0::bigint) >= v_daily_limit) as limit_reached,
    v_cooldown as cooldown_ends_at;
END;
$$;

COMMENT ON FUNCTION public.get_daily_token_usage IS 'Returns current daily token usage for a user';

-- ============================================
-- 4. Enable RLS
-- ============================================
ALTER TABLE public.ai_daily_token_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own token usage" ON public.ai_daily_token_usage;
CREATE POLICY "Users can view own token usage" ON public.ai_daily_token_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 5. Grant permissions
-- ============================================
GRANT SELECT ON public.ai_daily_token_usage TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_token_usage TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_daily_token_usage TO authenticated;
