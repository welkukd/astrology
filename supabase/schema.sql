-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Interpretations cache table
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

-- Subscriptions table
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

-- Purchases table (one-time reports)
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

-- Audit logs (GDPR compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    metadata JSONB,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TAROT PILLAR TABLES
-- ============================================

-- Tarot readings table
CREATE TABLE IF NOT EXISTS tarot_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    spread_type TEXT NOT NULL,
    question TEXT,
    cards_drawn JSONB NOT NULL, -- Array of {position, card_id, name, suit, number, arcana, upright, image_url, keywords}
    interpretation JSONB, -- Full AI interpretation response
    reading_data JSONB, -- Additional metadata: deck_used, reader_notes, etc.
    model TEXT,
    tokens_in INTEGER,
    tokens_out INTEGER,
    language TEXT NOT NULL DEFAULT 'en',
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Tarot journal entries table
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

-- Tarot daily draws table
CREATE TABLE IF NOT EXISTS tarot_daily_draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    draw_date DATE NOT NULL,
    card_id TEXT NOT NULL, -- Reference to 78-card deck
    card_name TEXT NOT NULL,
    card_suit TEXT,
    card_number INTEGER,
    card_arcana TEXT, -- 'major' or 'minor'
    card_upright BOOLEAN NOT NULL DEFAULT TRUE,
    card_image_url TEXT,
    card_keywords TEXT[],
    personal_reflection TEXT,
    ai_guidance JSONB, -- Optional AI interpretation
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(user_id, draw_date)
);

-- ============================================
-- GUIDE PILLAR TABLES
-- ============================================

-- Guide sessions table (umbrella for meditations, dreams, habits)
CREATE TABLE IF NOT EXISTS guide_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL, -- 'meditation', 'dream', 'habit'
    title TEXT,
    session_data JSONB NOT NULL, -- Flexible content based on type
    audio_url TEXT, -- Optional guided audio
    duration_seconds INTEGER,
    completed_at TIMESTAMPTZ,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Meditations table (detailed meditation records)
CREATE TABLE IF NOT EXISTS meditations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES guide_sessions(id) ON DELETE CASCADE,
    meditation_type TEXT NOT NULL, -- 'guided', 'breathing', 'mantra', 'body_scan', 'walking', 'custom'
    technique TEXT,
    guidance_text TEXT,
    background_sound TEXT,
    intervals JSONB, -- For interval-based meditations
    pre_mood TEXT,
    post_mood TEXT,
    heart_rate_before INTEGER,
    heart_rate_after INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Dream entries table
CREATE TABLE IF NOT EXISTS dream_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES guide_sessions(id) ON DELETE CASCADE,
    dream_date DATE NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    lucid BOOLEAN NOT NULL DEFAULT FALSE,
    recurring BOOLEAN NOT NULL DEFAULT FALSE,
    emotional_tone TEXT, -- 'positive', 'negative', 'neutral', 'mixed'
    symbols TEXT[], -- Extracted symbols/themes
    ai_interpretation JSONB, -- Optional AI dream analysis
    sleep_quality INTEGER, -- 1-10
    sleep_duration_hours DECIMAL(3,1),
    tags TEXT[],
    is_private BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Habit entries table
CREATE TABLE IF NOT EXISTS habit_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES guide_sessions(id) ON DELETE CASCADE,
    habit_name TEXT NOT NULL,
    habit_category TEXT, -- 'health', 'spiritual', 'productivity', 'creative', 'social', 'custom'
    frequency TEXT, -- 'daily', 'weekly', 'monthly', 'custom'
    target_count INTEGER NOT NULL DEFAULT 1,
    target_unit TEXT, -- 'times', 'minutes', 'pages', 'glasses', 'custom'
    completed_count INTEGER NOT NULL DEFAULT 0,
    entry_date DATE NOT NULL,
    streak_current INTEGER NOT NULL DEFAULT 0,
    streak_longest INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    metadata JSONB, -- Flexible extra data
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(user_id, habit_name, entry_date)
);

-- ============================================
-- HUMAN DESIGN PILLAR TABLES
-- ============================================

-- Human Design charts table
CREATE TABLE IF NOT EXISTS hd_charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL DEFAULT 'Me',
    birth_datetime_utc TIMESTAMPTZ NOT NULL,
    birth_latitude DOUBLE PRECISION NOT NULL,
    birth_longitude DOUBLE PRECISION NOT NULL,
    birth_timezone TEXT NOT NULL,
    time_unknown BOOLEAN NOT NULL DEFAULT FALSE,
    -- Computed HD fields
    hd_type TEXT NOT NULL, -- 'Manifestor', 'Generator', 'Manifesting Generator', 'Projector', 'Reflector'
    authority TEXT NOT NULL, -- 'Emotional', 'Sacral', 'Splenic', 'Ego', 'Self-Projected', 'Mental', 'Lunar'
    profile TEXT NOT NULL, -- e.g., '1/3', '2/4', '3/5', '4/6', '5/1', '6/2'
    strategy TEXT NOT NULL,
    signature TEXT NOT NULL,
    not_self_theme TEXT NOT NULL,
    -- Bodygraph data
    bodygraph_data JSONB NOT NULL, -- {centers: [], channels: [], gates: [], variables: [], lines: [], colors: [], tones: [], bases: []}
    definition_type TEXT, -- 'Single', 'Split', 'Triple Split', 'Quadruple Split', 'No Definition'
    incarnation_cross TEXT,
    -- Design/Personality data
    design_data JSONB, -- Design (unconscious) nodes
    personality_data JSONB, -- Personality (conscious) nodes
    -- Chart metadata
    chart_data JSONB NOT NULL, -- Full calculated chart for caching
    chart_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(user_id, chart_hash)
);

-- Indexes
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

-- Guide indexes
CREATE INDEX IF NOT EXISTS idx_guide_sessions_user_id ON guide_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_guide_sessions_type ON guide_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_guide_sessions_created_at ON guide_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meditations_user_id ON meditations(user_id);
CREATE INDEX IF NOT EXISTS idx_meditations_session_id ON meditations(session_id);
CREATE INDEX IF NOT EXISTS idx_meditations_created_at ON meditations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dream_entries_user_id ON dream_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_dream_entries_session_id ON dream_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_dream_entries_dream_date ON dream_entries(dream_date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_entries_user_id ON habit_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_session_id ON habit_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_entry_date ON habit_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_entries_habit_name ON habit_entries(user_id, habit_name);

-- Human Design indexes
CREATE INDEX IF NOT EXISTS idx_hd_charts_user_id ON hd_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_hd_charts_hash ON hd_charts(chart_hash);
CREATE INDEX IF NOT EXISTS idx_hd_charts_type ON hd_charts(hd_type);
CREATE INDEX IF NOT EXISTS idx_hd_charts_created_at ON hd_charts(created_at DESC);

-- Row Level Security
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Tarot RLS
ALTER TABLE tarot_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_daily_draws ENABLE ROW LEVEL SECURITY;

-- Guide RLS
ALTER TABLE guide_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

-- Human Design RLS
ALTER TABLE hd_charts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Charts policies
CREATE POLICY "Users can view own charts" ON charts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own charts" ON charts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts" ON charts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts" ON charts
    FOR DELETE USING (auth.uid() = user_id);

-- Interpretations policies
CREATE POLICY "Users can view own interpretations" ON interpretations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM charts WHERE charts.id = interpretations.chart_id AND charts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own interpretations" ON interpretations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM charts WHERE charts.id = interpretations.chart_id AND charts.user_id = auth.uid()
        )
    );

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Purchases policies
CREATE POLICY "Users can view own purchases" ON purchases
    FOR SELECT USING (auth.uid() = user_id);

-- Audit logs policies
CREATE POLICY "Users can view own audit logs" ON audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Tarot readings policies
CREATE POLICY "Users can view own tarot readings" ON tarot_readings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tarot readings" ON tarot_readings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tarot readings" ON tarot_readings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tarot readings" ON tarot_readings
    FOR DELETE USING (auth.uid() = user_id);

-- Tarot journal entries policies
CREATE POLICY "Users can view own tarot journal entries" ON tarot_journal_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tarot journal entries" ON tarot_journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tarot journal entries" ON tarot_journal_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tarot journal entries" ON tarot_journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Tarot daily draws policies
CREATE POLICY "Users can view own tarot daily draws" ON tarot_daily_draws
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tarot daily draws" ON tarot_daily_draws
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tarot daily draws" ON tarot_daily_draws
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tarot daily draws" ON tarot_daily_draws
    FOR DELETE USING (auth.uid() = user_id);

-- Guide sessions policies
CREATE POLICY "Users can view own guide sessions" ON guide_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guide sessions" ON guide_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guide sessions" ON guide_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own guide sessions" ON guide_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Meditations policies
CREATE POLICY "Users can view own meditations" ON meditations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meditations" ON meditations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meditations" ON meditations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meditations" ON meditations
    FOR DELETE USING (auth.uid() = user_id);

-- Dream entries policies
CREATE POLICY "Users can view own dream entries" ON dream_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dream entries" ON dream_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dream entries" ON dream_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dream entries" ON dream_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Habit entries policies
CREATE POLICY "Users can view own habit entries" ON habit_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit entries" ON habit_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit entries" ON habit_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit entries" ON habit_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Human Design charts policies
CREATE POLICY "Users can view own HD charts" ON hd_charts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own HD charts" ON hd_charts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own HD charts" ON hd_charts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own HD charts" ON hd_charts
    FOR DELETE USING (auth.uid() = user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_charts_updated_at BEFORE UPDATE ON charts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tarot_readings_updated_at BEFORE UPDATE ON tarot_readings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tarot_journal_updated_at BEFORE UPDATE ON tarot_journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tarot_daily_draws_updated_at BEFORE UPDATE ON tarot_daily_draws
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_sessions_updated_at BEFORE UPDATE ON guide_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meditations_updated_at BEFORE UPDATE ON meditations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dream_entries_updated_at BEFORE UPDATE ON dream_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habit_entries_updated_at BEFORE UPDATE ON habit_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hd_charts_updated_at BEFORE UPDATE ON hd_charts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log triggers for GDPR compliance
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
DECLARE
    action_type TEXT;
    record_data JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        action_type = TG_TABLE_NAME || '_created';
        record_data = to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        action_type = TG_TABLE_NAME || '_updated';
        record_data = jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        );
    ELSIF TG_OP = 'DELETE' THEN
        action_type = TG_TABLE_NAME || '_deleted';
        record_data = to_jsonb(OLD);
    END IF;

    INSERT INTO audit_logs (user_id, action, metadata)
    VALUES (
        COALESCE(NEW.user_id, OLD.user_id),
        action_type,
        jsonb_build_object('table', TG_TABLE_NAME, 'record', record_data)
    );

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach audit triggers to all user data tables
CREATE TRIGGER audit_tarot_readings
    AFTER INSERT OR UPDATE OR DELETE ON tarot_readings
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_tarot_journal_entries
    AFTER INSERT OR UPDATE OR DELETE ON tarot_journal_entries
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_tarot_daily_draws
    AFTER INSERT OR UPDATE OR DELETE ON tarot_daily_draws
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_guide_sessions
    AFTER INSERT OR UPDATE OR DELETE ON guide_sessions
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_meditations
    AFTER INSERT OR UPDATE OR DELETE ON meditations
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_dream_entries
    AFTER INSERT OR UPDATE OR DELETE ON dream_entries
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_habit_entries
    AFTER INSERT OR UPDATE OR DELETE ON habit_entries
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_hd_charts
    AFTER INSERT OR UPDATE OR DELETE ON hd_charts
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

-- Also audit existing tables
CREATE TRIGGER audit_charts
    AFTER INSERT OR UPDATE OR DELETE ON charts
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_interpretations
    AFTER INSERT OR UPDATE OR DELETE ON interpretations
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_subscriptions
    AFTER INSERT OR UPDATE OR DELETE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_purchases
    AFTER INSERT OR UPDATE OR DELETE ON purchases
    FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();