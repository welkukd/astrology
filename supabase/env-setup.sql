-- ============================================================
-- KUNDLI.SITE — Supabase Environment Setup
-- Run after: supabase db reset or connect your existing project
-- ============================================================

-- 1. Create admin user (if not exists via Supabase dashboard)
--    Then enable RLS and run the schema below

-- 2. Master key SQL (run via Supabase SQL Editor)
-- ------------------------------------------------------------

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Row-level security helper function
CREATE OR REPLACE FUNCTION rls_eval(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$BEGIN
  IF current_setting('role') = 'authenticated' THEN
    RETURN auth.uid() IS NOT NULL;
  END IF;
  RETURN TRUE;
END
$$;

-- ============================================================
-- CORE TABLES (from kundli.site schema)
-- ============================================================

-- Charts table
CREATE TABLE IF NOT EXISTS charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL DEFAULT 'Me',
  birth_datetime_utc TIMESTAMPTZ NOT NULL,
  birth_latitude DOUBLE PRECISION NOT NULL,
  birth_longitude DOUBLE PRECISION NOT NULL,
  birth_timezone TEXT NOT NULL,
  time_unknown BOOLEAN NOT NULL DEFAULT FALSE,
  zodiac_system TEXT NOT NULL DEFAULT 'tropical',
  house_system TEXT NOT NULL DEFAULT 'Placidus',
  ayanamsa TEXT,
  chart_data JSONB NOT NULL,
  chart_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, chart_hash)
);

-- Interpretations cache
CREATE TABLE IF NOT EXISTS interpretations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chart_id UUID NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  context JSONB,
  content TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_in INTEGER,
  tokens_out INTEGER,
  language TEXT NOT NULL DEFAULT 'en',
  reading_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(chart_id, type, language)
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  plan_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Purchases (one-time reports)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  report_type TEXT NOT NULL,
  chart_id UUID REFERENCES charts(id) ON DELETE SET NULL,
  chart_b_id UUID REFERENCES charts(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,
  download_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs (GDPR)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TAROT PILLAR TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS tarot_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spread_type TEXT NOT NULL,
  question TEXT,
  cards_drawn JSONB NOT NULL,
  interpretation JSONB,
  reading_data JSONB,
  model TEXT,
  tokens_in INTEGER,
  tokens_out INTEGER,
  language TEXT NOT NULL DEFAULT 'en',
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tarot_journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_id UUID REFERENCES tarot_readings(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[],
  mood TEXT,
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tarot_daily_draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draw_date DATE NOT NULL,
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_suit TEXT,
  card_number INTEGER,
  card_arcana TEXT NOT NULL DEFAULT 'minor',
  card_upright BOOLEAN NOT NULL DEFAULT TRUE,
  card_image_url TEXT,
  card_keywords TEXT[],
  personal_reflection TEXT,
  ai_guidance JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, draw_date)
);

-- ============================================================
-- GUIDE PILLAR TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS guide_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  title TEXT,
  session_data JSONB NOT NULL,
  audio_url TEXT,
  duration_seconds INTEGER,
  completed_at TIMESTAMPTZ,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS meditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES guide_sessions(id) ON DELETE CASCADE,
  meditation_type TEXT NOT NULL,
  technique TEXT,
  guidance_text TEXT,
  background_sound TEXT,
  intervals JSONB,
  pre_mood TEXT,
  post_mood TEXT,
  heart_rate_before INTEGER,
  heart_rate_after INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dream_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES guide_sessions(id) ON DELETE CASCADE,
  dream_date DATE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  lucid BOOLEAN NOT NULL DEFAULT FALSE,
  recurring BOOLEAN NOT NULL DEFAULT FALSE,
  emotional_tone TEXT,
  symbols TEXT[],
  ai_interpretation JSONB,
  sleep_quality INTEGER,
  sleep_duration_hours DECIMAL(3,1),
  tags TEXT[],
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS habit_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES guide_sessions(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  habit_category TEXT,
  frequency TEXT,
  target_count INTEGER NOT NULL DEFAULT 1,
  target_unit TEXT,
  completed_count INTEGER NOT NULL DEFAULT 0,
  entry_date DATE NOT NULL,
  streak_current INTEGER NOT NULL DEFAULT 0,
  streak_longest INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, habit_name, entry_date)
);

-- ============================================================
-- HUMAN DESIGN PILLAR TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS hd_charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL DEFAULT 'Me',
  birth_datetime_utc TIMESTAMPTZ NOT NULL,
  birth_latitude DOUBLE PRECISION NOT NULL,
  birth_longitude DOUBLE PRECISION NOT NULL,
  birth_timezone TEXT NOT NULL,
  time_unknown BOOLEAN NOT NULL DEFAULT FALSE,
  hd_type TEXT NOT NULL,
  authority TEXT NOT NULL,
  profile TEXT NOT NULL,
  strategy TEXT NOT NULL,
  signature TEXT NOT NULL,
  not_self_theme TEXT NOT NULL,
  bodygraph_data JSONB NOT NULL,
  definition_type TEXT,
  incarnation_cross TEXT,
  design_data JSONB,
  personality_data JSONB,
  chart_data JSONB NOT NULL,
  chart_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, chart_hash)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_hash ON charts(chart_hash);
CREATE INDEX IF NOT EXISTS idx_interpretations_chart_type ON interpretations(chart_id, type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time ON audit_logs(user_id, created_at DESC);

-- Tarot indexes
CREATE INDEX IF NOT EXISTS idx_tarot_readings_user_id ON tarot_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_readings_created_at ON tarot_readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_readings_spread_type ON tarot_readings(spread_type);
CREATE INDEX IF NOT EXISTS idx_tarot_journal_user_id ON tarot_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_journal_reading_id ON tarot_journal_entries(reading_id);
CREATE INDEX IF NOT EXISTS idx_tarot_journal_created_at ON tarot_journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_daily_draws_user_id ON tarot_daily_draws(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_daily_draws_draw_date ON tarot_daily_draws(draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_tarot_daily_draws_user_date ON tarot_daily_draws(user_id, draw_date);

I need to handle the user's message that came in mid-turn. Let me re-read the instructions about mid-turn user messages.

The user's message says "why dont you do all rhese all by yourself." This appears to be a follow-up question about why I'm not doing all the work myself.

Given the context of the interrupted conversation about finishing the astrology project, and the user's message "why dont you do all rhese all by yourself" - this seems to be asking why I'm not doing all the work myself.

Since I can't actually perform the live operations (they require TTY/browser access I don't have), I should explain what I've done and what the user needs to do. Let me also note that I should have sent an interim acknowledgment if processing would take time, per the user preference.

Actually, looking more carefully - the user is asking why I'm not doing all these tasks myself. I should explain that I'm designed to coordinate agents and use tools, not to independently operate everything. And then I should provide the helpful preparation work I was doing.

Let me prepare a helpful response that sets up the state and asks what specifically they want me to do.
<tool_call>
<function=terminal>
<parameter=command>
ls "/Users/admin/Desktop/DESKTOP FILE/astrology/apps/web/src/app/chart/"