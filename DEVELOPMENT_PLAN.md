# AI-Powered Astrology App — Complete Development Plan

---

## Executive Summary

This plan outlines a realistic, cost-effective path to build an AI-powered astrology app that:
- **Calculates astronomically accurate charts** using established open-source engines
- **Interprets results with AI** (not fabricating positions)
- **Operates ethically** with clear disclaimers and privacy protection
- **Starts at $0/month** using free tiers, scales predictably

**Recommended MVP Stack**: Next.js (Vercel) + Astrologer API (RapidAPI free tier) + Supabase (PostgreSQL + Auth) + Groq/Gemini Flash (AI) + Upstash (Redis caching)

---

## 1. Astrology System for V1: Western (Tropical) First

### Recommendation: **Western/Tropical as Primary, Sidereal as Optional Toggle**

| Factor | Western (Tropical) | Vedic (Sidereal) | Both |
|--------|-------------------|------------------|------|
| **Library Support** | Excellent (all libs) | Good (kerykeion, flatlib, xalen, VedAstro) | kerykeion, xalen support 48-50 ayanamsas |
| **Market Size (Global)** | Larger (Western countries, Latin America) | Large (India, diaspora) | Maximum |
| **Complexity** | Lower (12 signs, standard houses) | Higher (27 nakshatras, 9 grahas, dashas, vargas) | 2x development |
| **User Expectation** | Sun sign + rising + houses | Moon sign + nakshatra + dasha periods | Confusion risk if not segmented |
| **Calculation Precision** | Mature, well-tested | Requires ayanamsa choice (Lahiri default) | Ayanamsa selection UI needed |

### Decision: **Launch with Western/Tropical only**

**Rationale:**
- Simpler MVP (1 calculation path, 1 interpretation style)
- kerykeion/flatlib/xalen all excel at Western
- Add Sidereal in Phase 2 via ayanamsa toggle (Lahiri default, user-selectable)
- VedAstro available as separate Vedic-focused track if demand validates

**Supported in V1:**
- Tropical zodiac (12 signs)
- 22 house systems (Placidus default, user-selectable)
- Planets: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, North Node
- Aspects: conjunction, opposition, trine, square, sextile, quincunx, semi-sextile, semi-square, sesquiquadrate
- Transits (current + date range)
- Synastry (2-chart comparison)
- Composite charts (midpoint method)

---

## 2. Essential MVP Features

### Core Calculations (via Astrologer API / flatlib)
| Feature | Description | Priority |
|---------|-------------|----------|
| Natal Chart | Complete birth chart with positions, houses, aspects | P0 |
| Chart Visualization | SVG wheel chart (10 themes, responsive) | P0 |
| Current Transits | Planets now vs natal positions | P1 |
| Transit Forecast | Date-range transit list with aspects | P1 |
| Synastry | Two-chart comparison with inter-aspects | P1 |
| Composite Chart | Relationship midpoint chart | P2 |
| Solar/Lunar Returns | Birthday charts for current year | P2 |
| Moon Phase | Current phase + natal phase | P1 |

### AI Interpretations
| Feature | Description | Priority |
|---------|-------------|----------|
| Natal Overview | "Your chart at a glance" summary | P0 |
| Planet in Sign/House | Per-placement interpretation | P0 |
| Aspect Interpretations | Major aspects explained simply | P0 |
| Transit Narratives | "What's happening now" daily/weekly | P1 |
| Compatibility Summary | Synastry strengths/challenges | P1 |
| Question Answering | "What does Mars in 7th mean?" | P2 |

### User Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Birth Data Input | Date, time (with "unknown" option), location search | P0 |
| Profile Management | Multiple saved charts (self, family, partners) | P0 |
| Data Export | JSON + PDF report download | P1 |
| Chart Sharing | Shareable link (obfuscated ID, revocable) | P2 |
| Notifications | Daily transit alert (opt-in) | P2 |

### Responsible AI / Compliance
| Feature | Description | Priority |
|---------|-------------|----------|
| Disclaimer Banner | Persistent, dismissible, links to full policy | P0 |
| Data Deletion | One-click account + data purge | P0 |
| Privacy Policy | GDPR/CCPA compliant, plain language | P0 |
| Age Gate | 13+ (COPPA), 18+ for payments | P0 |
| Content Moderation | Filter harmful AI outputs | P1 |

---

## 3. Recommended Free/Open-Source Calculation Engine

### Primary Choice: **Astrologer API (RapidAPI Free Tier)** — Fastest to Market

| Aspect | Details |
|--------|---------|
| **Base Library** | kerykeion (AGPL-3.0) — but consumed as hosted API, so no license contamination |
| **Cost** | Free tier: generous for prototyping; Pro $9/mo (5K req), Ultra $18/mo (50K) |
| **Features** | Natal, Synastry, Transits, Composite, Solar/Lunar Returns, Moon Phase, AI Context XML, SVG Charts (6 themes, 10 langs), 22 house systems, 48 ayanamsas |
| **Reliability** | 2,800+ subscribers, production-tested, 99.9% uptime SLA on paid tiers |
| **Latency** | ~200-500ms p95 |
| **Data Source** | Swiss Ephemeris (DE441) — gold standard |

### Fallback / Migration Path: **Self-Hosted flatlib (MIT) + Moshier Ephemeris**

| Aspect | Details |
|--------|---------|
| **License** | MIT — fully commercial-friendly, no copyleft |
| **Language** | Python (FastAPI wrapper) or JavaScript (via Pyodide/WASM) |
| **Ephemeris** | Moshier (built-in, zero files, ~1" precision) — sufficient for interpretation |
| **Precision Trade-off** | ±1 arcsecond planets, few arcseconds Moon vs Swiss Eph ±0.001" |
| **Deployment** | Cloudflare Workers (free), Railway ($5/mo), Fly.io, or Vercel Functions |
| **Features** | Natal, transits, progressions, directions, 10+ house systems, fixed stars, Arabic parts |
| **Sidereal Support** | Lahiri, Raman, Krishnamurti, Fagan-Bradley, Yukteshwar, more |

### Long-Term High-Performance Option: **xalen-ephemeris (Apache-2.0, Rust/WASM)**

| Aspect | Details |
|--------|---------|
| **License** | Apache-2.0 — commercial-friendly, patent grant |
| **Precision** | JPL DE440/DE441 kernel (auto-downloads 32MB), sub-arcsecond |
| **Systems** | 12+ traditions (Western, Vedic, Chinese, Hellenistic, etc.), 23 house systems, 50 ayanamsas |
| **Deployment** | WASM in browser/edge (Cloudflare Workers, Deno Deploy), Python/Node bindings |
| **Charts** | Built-in SVG rendering (multiple themes) |
| **Status** | Active (updated 10 days ago), 933 stars |

### Ephemeris Data Comparison

| Source | License | Size | Precision | Range | Best For |
|--------|---------|------|-----------|-------|----------|
| **Swiss Ephemeris (DE441)** | AGPL / Commercial (CHF 750) | 99 MB | ≤0.001" | 13000 BCE – 17000 CE | Professional grade |
| **JPL DE441** | Public Domain | 2.6 GB | Highest | Same | Research, custom engines |
| **Moshier** | Public Domain / GPL-2.0 | 0 MB (compiled in) | ~1" planets | 3000 BCE – 3000 CE | Zero-dep, "good enough" |
| **xalen DE440 kernel** | Public Domain (JPL) | 32 MB | Sub-arcsec | 13000 BCE – 17000 CE | High precision, self-hosted |

**Recommendation**: Start with **Astrologer API** (zero infrastructure). Migrate to **flatlib + Moshier** on Cloudflare Workers when free tier limits hit (~$9/mo Pro tier). Evaluate **xalen** for Phase 3 if Vedic/Chinese systems needed.

---

## 4. How Calculations and AI Work Together

### Architecture: Strict Separation of Concerns

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER REQUEST                              │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. VALIDATE & NORMALIZE INPUT                                   │
│     - Birth datetime → UTC, timezone                             │
│     - Location → lat/lon (geocoding)                             │
│     - System selection (Tropical/Sidereal, ayanamsa, houses)    │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. CALCULATION ENGINE (Deterministic, No AI)                    │
│     - Astrologer API / flatlib / xalen                           │
│     - Returns STRUCTURED JSON:                                   │
│       { planets: [...], houses: [...], aspects: [...],          │
│         chart_metadata: {...}, svg_chart: "..." }               │
│     - CACHED by birth data hash (immutable)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. AI INTERPRETATION LAYER (Probabilistic, Language)           │
│     - Input: Structured JSON + User Question/Context            │
│     - System Prompt: "You are an AI astrology assistant.        │
│       Interpret the provided calculated data. Do not invent     │
│       positions. Cite specific degrees/houses from data."       │
│     - Output: Plain-language interpretation                     │
│     - CACHED by (chart_hash + question_type)                    │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. RESPONSE ASSEMBLY                                            │
│     - Chart SVG + AI Text + Metadata + Disclaimers              │
│     - Store in DB (user charts, interpretations)                │
└─────────────────────────────────────────────────────────────────┘
```

### Data Contract: Calculation Engine → AI

```json
{
  "chart_id": "uuid",
  "subject": { "name": "User", "birth_utc": "1990-05-15T14:30:00Z", "lat": 40.7128, "lon": -74.0060, "tz": "America/New_York" },
  "system": { "zodiac": "tropical", "house_system": "placidus", "ayanamsa": null },
  "planets": [
    { "name": "Sun", "longitude": 54.23, "latitude": 0.0, "speed": 0.98, "sign": "Taurus", "degree_in_sign": 24.23, "house": 10, "retrograde": false },
    { "name": "Moon", "longitude": 182.45, "latitude": -2.1, "speed": 13.2, "sign": "Libra", "degree_in_sign": 2.45, "house": 4, "retrograde": false }
  ],
  "houses": [ { "number": 1, "longitude": 42.1, "sign": "Taurus" }, ... ],
  "aspects": [ { "p1": "Sun", "p2": "Moon", "aspect": "opposition", "orb": 2.3, "applying": true }, ... ],
  "chart_metadata": { "calculated_at": "2026-07-12T...", "engine": "kerykeion", "ephemeris": "DE441", "precision_arcsec": 0.001 }
}
```

### AI Prompting Strategy

| Interpretation Type | Prompt Approach |
|---------------------|-----------------|
| **Natal Overview** | "Summarize this chart in 3 paragraphs. Focus on Sun/Moon/Rising, chart ruler, dominant elements/modes, key configurations (stellium, grand trine, etc.). Use supportive, non-deterministic language." |
| **Planet in Sign/House** | "Explain {planet} in {sign} in the {house} house. Include: core meaning, strengths, challenges, how it expresses in this house. 150-200 words. Reference the exact degree ({degree}°{sign})." |
| **Aspect Interpretation** | "Interpret {planet1} {aspect} {planet2} with {orb}° orb. Explain the dynamic, growth opportunity, potential tension. Avoid fatalistic language." |
| **Transit Narrative** | "Transiting {planet} is {aspect} natal {planet} (orb {orb}°). Explain what this transit typically signifies, timeframe, how to work with it constructively. Mention it's a temporary influence." |
| **Synastry Summary** | "Compare two charts. Highlight 3-5 strongest connections (conjunctions/trines to personal planets), 2-3 challenges (hard aspects to Saturn/Pluto), overall tone. Emphasize free will." |

### Safety Guards
- **Temperature**: 0.3-0.5 (consistent, not creative)
- **Max tokens**: 1000 (prevent rambling)
- **System prompt**: Hardcoded, not user-injectable
- **Output validation**: Check for medical/financial/legal advice keywords → reject/rewrite
- **Citation requirement**: AI must reference specific degrees/houses from input JSON

---

## 5. User Experience & Screen-by-Screen Flow

### User Journey Map

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  LANDING    │───▶│  BIRTH DATA  │───▶│  CHART VIEW  │───▶│  EXPLORE     │
│  PAGE       │    │  FORM        │    │  + AI INTRO  │    │  DEEPER      │
└─────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
                    │  VALIDATION  │    │  DISCLAIMER  │    │  FEATURES:   │
                    │  & ERRORS    │    │  BANNER      │    │  • Transits  │
                    └──────────────┘    └──────────────┘    │  • Synastry  │
                                                             │  • Reports   │
                                                             │  • Settings  │
                                                             └──────────────┘
```

### Screen Specifications

#### 1. Landing Page (`/`)
- **Hero**: "AI Astrology Assistant — Your Birth Chart, Explained"
- **Subtext**: "Astronomically calculated. AI interpreted. For reflection, not prediction."
- **CTA**: "Get Your Free Chart" → `/chart/new`
- **Trust Signals**: "Powered by Swiss Ephemeris (NASA JPL data)" | "Open-source calculation engine" | "Your data encrypted, never sold"
- **Footer**: Links to Privacy, Terms, Disclaimer, Methodology, About

#### 2. Birth Data Form (`/chart/new`)
| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Name/Nickname | Text (optional) | Max 50 chars | Display only |
| Date of Birth | Date picker | Required, 1900-present | Local date |
| Time of Birth | Time picker + "Unknown" toggle | Required unless unknown | 24hr/12hr toggle |
| Birth Location | Autocomplete (Mapbox/Geoapify) | Required | Search → lat/lon + timezone |
| Timezone | Auto-detected from location | Read-only, editable | IANA tz database |
| Astrology System | Radio: Tropical (default) / Sidereal | Required | V1: Tropical only, show "Sidereal coming soon" |
| House System | Select (Placidus default) | Required | 22 options, searchable |
| Ayanamsa | Select (Lahiri default) | Sidereal only | 48 options |

**Error States**: Inline validation, "Time unknown" → uses noon UTC, no house cusps/ASC, warning banner.

#### 3. Chart View (`/chart/:id`)
- **Top Bar**: Chart name, edit/delete/share, disclaimer badge
- **Main**: SVG Chart Wheel (responsive, theme toggle: light/dark/colorblind)
- **Sidebar Tabs**:
  - **Overview**: AI summary (3 paragraphs) + Sun/Moon/Rising cards
  - **Planets**: Grid of planet cards → click for AI interpretation
  - **Houses**: List with sign on cusp + planets in house
  - **Aspects**: Table (planet1, aspect, planet2, orb, applying/separating)
  - **Transits**: "Now" + date picker for forecast
- **Bottom**: "Ask a Question" input → AI chat (context-aware)

#### 4. Synastry/Compatibility (`/chart/:id/synastry/:id2`)
- Dual chart wheel (inner/outer)
- Inter-aspect table with AI summaries
- Composite chart toggle
- Relationship dynamics: "Communication," "Emotional," "Growth," "Challenges"

#### 5. Transit Forecast (`/chart/:id/transits`)
- Date range selector (today, this week, this month, custom)
- Chronological list: Date | Transiting Planet | Aspect | Natal Planet | Orb | AI blurb
- Filter by: planet, aspect type, applying/separating
- "Add to calendar" (ICS export)

#### 6. Reports (`/chart/:id/reports`)
- **Free**: Basic natal summary (2 pages PDF)
- **Paid**: Detailed natal (15+ pages), Yearly transit guide, Compatibility report, Solar return
- Preview → Purchase → Download

#### 7. Settings (`/settings`)
- Profile: name, email, password, 2FA
- Data: Export all (JSON), Delete account (irreversible)
- Preferences: Default house system, theme, notifications, language
- Subscription: Manage plan, billing history, cancel

#### 8. Auth Screens
- `/login`, `/register` (email/password + OAuth: Google, Apple)
- `/forgot-password`, `/reset-password`
- Email verification required

---

## 6. Database, Backend, Frontend, Privacy & Security Architecture

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS | Vercel native, SEO, RSC, great DX |
| **UI Components** | shadcn/ui + Radix UI, Lucide icons | Accessible, customizable, no runtime dep |
| **Charts** | AstroChart (TypeScript SVG) or kerykeion SVG via API | High-quality, themeable, responsive |
| **State** | TanStack Query (server), Zustand (client) | Caching, optimistic updates |
| **Forms** | React Hook Form + Zod | Validation, type-safe |
| **Backend** | Next.js API Routes (Vercel Functions) + Supabase Edge Functions | Serverless, scales to zero, integrated auth |
| **Database** | Supabase (PostgreSQL) | Free tier 500MB, auth, realtime, RLS, backups |
| **Cache** | Upstash Redis (serverless) | Free 10K req/day, interpretation caching |
| **Auth** | Supabase Auth (email, OAuth, MFA) | Built-in, GDPR-ready, row-level security |
| **AI** | Vercel AI SDK + Groq/Gemini Flash/OpenRouter | Streaming, tool calls, model switching |
| **Geocoding** | Geoapify (free 3K/day) or Mapbox | Location search → lat/lon/timezone |
| **Payments** | Stripe (Checkout, Billing, Customer Portal) | Subscriptions, one-time, tax handling |
| **Email** | Resend (3K/mo free) | Transactional, marketing |
| **Analytics** | PostHog (self-hosted on Railway) or Plausible | Privacy-friendly, no cookies |
| **Errors** | Sentry (free 5K events/mo) | Error tracking, performance |
| **CI/CD** | GitHub Actions → Vercel (preview + prod) | Automated, zero-config |

### Database Schema (PostgreSQL)

```sql
-- Users (Supabase Auth extends this)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  email TEXT UNIQUE NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  default_house_system TEXT DEFAULT 'placidus',
  default_zodiac TEXT DEFAULT 'tropical',
  default_ayanamsa TEXT DEFAULT 'lahiri',
  theme TEXT DEFAULT 'system',
  notification_prefs JSONB DEFAULT '{"daily_transit": false, "weekly_summary": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete for GDPR
);

-- Birth Charts (immutable once created)
CREATE TABLE charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_name TEXT, -- "Me", "Partner", "Child"
  birth_datetime_utc TIMESTAMPTZ NOT NULL,
  birth_lat DOUBLE PRECISION NOT NULL,
  birth_lon DOUBLE PRECISION NOT NULL,
  birth_tz TEXT NOT NULL, -- IANA tz
  time_unknown BOOLEAN DEFAULT FALSE,
  zodiac_system TEXT NOT NULL DEFAULT 'tropical', -- 'tropical', 'sidereal'
  house_system TEXT NOT NULL DEFAULT 'placidus',
  ayanamsa TEXT, -- only for sidereal
  chart_data JSONB NOT NULL, -- full calculation engine output
  chart_hash TEXT NOT NULL, -- SHA256 of birth data for caching
  svg_chart TEXT, -- cached SVG
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, chart_hash) -- prevent duplicates
);

-- AI Interpretations (cached by chart + type)
CREATE TABLE interpretations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id UUID NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'overview', 'planet', 'aspect', 'transit', 'synastry', 'question'
  context JSONB, -- { planet: 'Sun', house: 10, question: '...' }
  content TEXT NOT NULL,
  model TEXT NOT NULL, -- 'gemini-1.5-flash', 'llama-3.1-70b'
  tokens_in INTEGER,
  tokens_out INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chart_id, type, context) -- cache key
);

-- Synastry/Composite (links two charts)
CREATE TABLE chart_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chart_a_id UUID NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  chart_b_id UUID NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'synastry', -- 'synastry', 'composite'
  relationship_label TEXT, -- 'Partner', 'Business', 'Friend'
  synastry_data JSONB,
  composite_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (Stripe integration)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing'
  plan_id TEXT, -- 'monthly', 'yearly', 'lifetime'
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases (one-time reports)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  report_type TEXT NOT NULL, -- 'detailed_natal', 'yearly_transit', 'compatibility', 'solar_return'
  chart_id UUID REFERENCES charts(id) ON DELETE SET NULL,
  chart_b_id UUID REFERENCES charts(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- 'succeeded', 'refunded', 'failed'
  download_url TEXT, -- signed, expires
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log (GDPR compliance)
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'chart_created', 'data_exported', 'account_deleted', 'interpretation_generated'
  metadata JSONB,
  ip_hash TEXT, -- hashed IP, not raw
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_charts_user ON charts(user_id);
CREATE INDEX idx_charts_hash ON charts(chart_hash);
CREATE INDEX idx_interpretations_chart_type ON interpretations(chart_id, type);
CREATE INDEX idx_audit_user_time ON audit_logs(user_id, created_at DESC);

-- Row Level Security (Supabase)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own their charts" ON charts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own their interpretations" ON interpretations FOR ALL USING (
  EXISTS (SELECT 1 FROM charts WHERE charts.id = interpretations.chart_id AND charts.user_id = auth.uid())
);
-- ... similar for other tables
```

### Privacy & Security Implementation

| Layer | Measures |
|-------|----------|
| **Data Collection** | Only: birth datetime UTC, lat/lon, timezone, optional name. No SSN, medical, financial data. |
| **Encryption at Rest** | Supabase: Transparent encryption (AES-256). Application-level: encrypt `birth_datetime_utc`, `lat`, `lon` columns via `pgcrypto` or app-layer before insert. |
| **Encryption in Transit** | TLS 1.3 enforced (Vercel, Supabase, Upstash, Stripe all default) |
| **Pseudonymization** | `charts` linked to `profiles` via UUID only. No PII in chart data JSON. |
| **Access Control** | RLS policies ensure users only see own data. Service-role key only for backend jobs. |
| **API Security** | Rate limiting (Upstash: 60 req/min/user), CORS restricted to app domain, input validation (Zod), JWT verification on all mutating endpoints. |
| **Secrets Management** | Vercel/Supabase/Stripe secret stores. No secrets in repo. Rotate quarterly. |
| **Data Retention** | Active: retained. Inactive 2yr: soft delete → anonymize (keep chart hash, drop birth coords). Deletion request: hard delete within 30 days (cron job). Backups: 30-day retention, excluded from restore on deletion. |
| **GDPR/CCPA** | Privacy Policy (plain language), Data Export (JSON + PDF), Right to Deletion (one-click), DPA with Supabase/Vercel/Upstash/Stripe, Cookie consent (only essential), No "sale" of data. |
| **Logging** | Structured JSON logs. Birth data NEVER logged. `audit_logs` table for compliance actions only. |
| **Incident Response** | 72-hr breach notification procedure documented. Encrypted backups. |

---

## 7. AI Model Options

### Decision Matrix

| Criterion | Groq (Llama 3.1 70B) | Gemini 1.5 Flash | GPT-4o-mini | Local (Ollama) |
|-----------|---------------------|------------------|-------------|----------------|
| **Cost** | Free (rate limited) | $0.075/$0.30 per 1M | $0.15/$0.60 per 1M | $0 (hardware) |
| **Quality** | Excellent | Excellent | Best | Good (8B) / Excellent (70B) |
| **Latency** | ~300ms | ~500ms | ~800ms | ~200ms (local) / ~2s (70B) |
| **Context** | 128K | 1M | 128K | 128K |
| **Privacy** | API (data to Groq) | API (data to Google) | API (data to OpenAI) | **Full local** |
| **Reliability** | Good | Excellent | Excellent | Depends on infra |
| **Setup** | API key only | API key only | API key only | GPU server / Docker |

### Recommendation by Phase

| Phase | Primary | Fallback | Rationale |
|-------|---------|----------|-----------|
| **MVP (0-100 DAU)** | Groq Free Tier | Gemini Flash | $0 cost, high quality, no infra |
| **Launch (100-1K DAU)** | Gemini 1.5 Flash | GPT-4o-mini | Cheapest paid, 1M context for long chats |
| **Growth (1K-10K DAU)** | Gemini Flash + Cache | Groq + Local (8B) | Cache hits >80%, local for premium tier |
| **Scale (10K+ DAU)** | Hybrid: Local (70B) + API | - | Break-even at ~5K DAU for GPU server |

### Implementation: Vercel AI SDK

```typescript
// lib/ai.ts
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, generateText } from 'ai';

const models = {
  groq: createGroq({ apiKey: process.env.GROQ_API_KEY })('llama-3.1-70b-versatile'),
  gemini: createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_AI_API_KEY })('gemini-1.5-flash'),
  gpt4omini: createOpenAI({ apiKey: process.env.OPENAI_API_KEY })('gpt-4o-mini'),
};

export async function interpretChart(
  chartData: ChartJSON,
  type: InterpretationType,
  context: Record<string, unknown>,
  model: keyof typeof models = 'gemini'
) {
  const systemPrompt = getSystemPrompt(type);
  const userPrompt = buildUserPrompt(chartData, type, context);

  const { text, usage } = await generateText({
    model: models[model],
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.3,
    maxTokens: 1000,
  });

  return { text, tokensIn: usage?.promptTokens, tokensOut: usage?.completionTokens };
}
```

### Caching Strategy (Critical for Cost)

```typescript
// Cache key: SHA256(chart_hash + type + JSON.stringify(context))
// TTL: 30 days (interpretations don't change unless chart changes)
// Invalidation: On chart delete/update
const cacheKey = `interpret:${chartHash}:${type}:${hash(context)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const result = await interpretChart(...);
await redis.setex(cacheKey, 60 * 60 * 24 * 30, JSON.stringify(result));
return result;
```

**Expected cache hit rate**: 85%+ (same charts, same questions repeated)

---

## 8. Disclaimers & Responsible-AI Safeguards

### Mandatory Disclaimer (Persistent Banner)

> **⚠️ Important Disclaimer**
>
> This app provides astrological interpretations for **entertainment, self-reflection, and general guidance only**.
>
> - **Not professional advice**: Results are AI-generated interpretations of calculated astronomical data, not guaranteed predictions.
> - **Not a substitute**: Do not make medical, legal, financial, relationship, or safety decisions based solely on this app.
> - **AI & software can make mistakes**: Astronomical calculations use established ephemeris data (Swiss Ephemeris/JPL), but interpretations are generated by an AI language model and may contain inaccuracies.
> - **Your data is sensitive**: Birth information is personal data. We encrypt it and never sell it. [Privacy Policy](/privacy)
> - **No astrologer personas**: This is an AI assistant, not a human astrologer. We don't use fake profiles or credentials.
>
> [Read Full Disclaimer & Methodology](/disclaimer) · [Data & Privacy](/privacy)

### Full Disclaimer Page (`/disclaimer`)

| Section | Content |
|---------|---------|
| **Purpose** | Entertainment, reflection, general guidance |
| **Calculation Method** | Swiss Ephemeris (DE441) / Moshier / JPL DE440 — cite sources |
| **AI Role** | Interprets structured data only. Does not calculate positions. |
| **Limitations** | Orb tolerances, house system differences, ayanamsa choices, unknown birth time |
| **No Guarantees** | Not predictive, not deterministic, free will emphasized |
| **Prohibited Uses** | Medical, legal, financial, psychological, safety-critical decisions |
| **Data Handling** | Encryption, retention, deletion rights, no third-party sale |
| **Age Requirement** | 13+ (COPPA), 18+ for purchases |
| **Contact** | support@domain.com for concerns |

### AI Safety Controls

| Control | Implementation |
|---------|----------------|
| **System Prompt Lock** | Hardcoded in backend, not user-modifiable. Includes: "Never give medical/legal/financial advice. Never predict death, illness, lottery numbers, or specific events. Use language: 'may indicate,' 'suggests,' 'invites reflection on,' 'some astrologers associate.'" |
| **Output Filter** | Post-generation scan for: medical terms (diagnosis, prescription, treatment), legal (lawsuit, liable, contract), financial (investment, guaranteed return, bankruptcy), self-harm, violence. Flag → rewrite or block. |
| **Refusal Training** | Few-shot examples in system prompt for refusing inappropriate requests. |
| **Rate Limiting** | Per-user: 30 interpretations/hour. Prevents spam, reduces cost. |
| **Audit Trail** | Log every interpretation request (user, chart, type, model, tokens) — no PII. |
| **Human Review Queue** | Flagged outputs → admin review dashboard (Phase 2). |
| **Model Version Pinning** | Lock model versions (e.g., `gemini-1.5-flash-002`), test before upgrading. |

### Content Moderation Keywords (Block/Rewrite)

```
Medical: diagnosis, prescription, medication, treatment, cure, heal, symptom, disease, disorder, cancer, tumor, pregnancy (advice), fertility (advice), mental health advice
Legal: lawsuit, sue, court, judge, liable, guilty, innocent, contract, legal advice, attorney, lawyer
Financial: investment, stock, crypto, lottery, gambling, guaranteed profit, bankruptcy, debt relief, get rich
Safety: suicide, self-harm, violence, weapon, kill, die, death prediction, accident prediction
Relationship: "they will leave you," "divorce is certain," "toxic" (diagnostic), "narcissist" (diagnostic)
```

---

## 9. Estimated Operating Costs at Different User Levels

### Monthly Cost Breakdown

| Component | Prototype (10 DAU) | Launch (100 DAU) | Growth (1K DAU) | Scale (10K DAU) | Large (100K DAU) |
|-----------|-------------------|------------------|-----------------|-----------------|------------------|
| **AI (Gemini Flash)** | $0.001 | $0.01 | $0.10 | $1.00 | $10.00 |
| **AI (GPT-4o-mini)** | $0.002 | $0.02 | $0.20 | $2.00 | $20.00 |
| **AI (Groq Free)** | $0 | $0 | $0* | $0* | N/A |
| **Database (Supabase)** | Free | Free | $25 (Pro) | $100 (Team) | $500+ (Dedicated) |
| **Cache (Upstash)** | Free | Free | Free | $10 | $50 |
| **Hosting (Vercel)** | Free | Free | $20 (Pro) | $100+ | $500+ |
| **Auth (Supabase)** | Free | Free | Included | Included | Included |
| **Email (Resend)** | Free | Free | Free | $20 | $100 |
| **Errors (Sentry)** | Free | Free | Free | $26 | $80 |
| **Analytics (PostHog)** | Free (self-hosted) | $5 (Railway) | $20 | $50 | $200 |
| **Payments (Stripe)** | 2.9% + 30¢ | 2.9% + 30¢ | 2.9% + 30¢ | 2.9% + 30¢ | Volume discount |
| **Geocoding (Geoapify)** | Free | Free | Free | $5 | $50 |
| **Domain/SSL** | $1 | $1 | $1 | $1 | $1 |
| **TOTAL (Managed AI)** | **~$1** | **~$5** | **~$70** | **~$315** | **~$1,500** |
| **TOTAL (Self-hosted AI)** | **~$1** | **~$5** | **~$50** | **~$200** | **~$800** |

\* Groq free tier has rate limits; not reliable for production at scale.

### Cost Per User (at Scale)

| Scale | Monthly Cost | DAU | Cost/DAU | Cost/MAU (est. 3x DAU) |
|-------|-------------|-----|----------|------------------------|
| 100 DAU | $5 | 100 | $0.05 | $0.017 |
| 1,000 DAU | $70 | 1,000 | $0.07 | $0.023 |
| 10,000 DAU | $315 | 10,000 | $0.03 | $0.010 |
| 100,000 DAU | $1,500 | 100,000 | $0.015 | $0.005 |

**Key Insight**: Cost per user **decreases** with scale due to caching efficiency and volume discounts.

### Break-Even Analysis

| Monetization | Price | Users to Break Even (at 10K DAU, $315/mo cost) |
|--------------|-------|------------------------------------------------|
| Subscription | $9.99/mo | 32 paying users (0.3% conversion) |
| One-time Report | $19.99 | 16 reports/month |
| Freemium (5% convert, $15 ARPU) | - | 420 paying users (4.2% of DAU) |

---

## 10. Monetization Options (Ethical, Non-Misleading)

### Pricing Strategy: "Fair Value, No Dark Patterns"

| Model | Price | What's Included | Ethical Guardrails |
|-------|-------|-----------------|-------------------|
| **Free Tier** | $0 | Natal chart (full), Sun/Moon/Rising, basic aspects, SVG chart, 3 AI questions/day, data export | No feature gating on core chart |
| **Monthly Subscription** | $9.99/mo | Unlimited AI interpretations, transit forecasts, synastry/composite, all report previews, priority support, no ads | Cancel anytime, no annual lock-in, prorated refunds |
| **Yearly Subscription** | $79/yr ($6.58/mo) | Same as monthly + 2 free detailed reports/year | Clear savings, easy downgrade |
| **Detailed Natal Report** | $19.99 one-time | 15+ page PDF: all planets, houses, aspects, patterns, life themes, exercises | Preview first 3 pages free |
| **Yearly Transit Guide** | $24.99 one-time | 12-month transit calendar with interpretations, key dates highlighted | Free "this month" preview |
| **Compatibility Report** | $29.99 one-time | Synastry + composite + dynamics analysis (20+ pages) | Requires both charts (user-owned) |
| **Solar Return Report** | $14.99 one-time | Birthday-year forecast with monthly breakdown | Free summary |
| **Developer API** | $29/mo + usage | Chart calculation, interpretation endpoints, webhooks | Rate limits, no resale without agreement |
| **White-Label (Waitlist)** | $99/mo per practitioner | Branded client portal, practitioner dashboard, custom reports | For certified astrologers only |

### Revenue Projection (Conservative)

| Month | Free Users | Paid Subscribers | Report Sales | MRR |
|-------|------------|------------------|--------------|-----|
| 1 | 100 | 0 | 0 | $0 |
| 3 | 500 | 10 | 5 | $150 |
| 6 | 2,000 | 80 | 30 | $950 |
| 12 | 10,000 | 500 | 150 | $6,500 |
| 24 | 50,000 | 3,000 | 800 | $35,000 |

**Assumptions**: 5% free→paid conversion, $15 ARPU, 2 reports/subscriber/year, 30% churn annually.

### What We DON'T Do

- ❌ Fake "master astrologer" profiles or testimonials
- ❌ "Curses," "blockages," "karma removal" upsells
- ❌ Fear-based notifications ("Mars retrograde will ruin your life!")
- ❌ Auto-renew without clear notice
- ❌ Hidden fees or credit bundles with expiration
- ❌ Selling birth data to third parties
- ❌ Medical/financial/legal advice disguised as astrology
- ❌ "Free reading" that requires credit card

---

## 11. Phased Development Roadmap

### Phase 0: Validation (Week 1-2) — **NO CODE YET**

| Task | Deliverable |
|------|-------------|
| Market research | Survey 50+ target users, competitive analysis |
| Technical spike | Test Astrologer API + Groq + Vercel deployment |
| Cost verification | Confirm free tier limits, estimate real costs |
| Legal review | Draft disclaimer, privacy policy, terms (template + lawyer) |
| **Go/No-Go Decision** | Proceed only if: API works, costs viable, legal clear |

### Phase 1: MVP Core (Week 3-6) — **First Code Milestone**

| Sprint | Tasks | Definition of Done |
|--------|-------|-------------------|
| 1 | Next.js + Supabase setup, Auth (email + Google), Birth data form with validation, Geocoding integration | User can sign up, enter birth data, see validated data |
| 2 | Astrologer API integration, Chart calculation + SVG display, Basic chart view (wheel + planet list) | Birth data → chart SVG + JSON in <3s |
| 3 | AI Interpretation (Groq/Gemini), Overview + Planet-in-sign/house, Caching (Upstash), Disclaimer banner | Chart view shows AI summary + 3 planet interpretations, cached |
| 4 | Profile dashboard (saved charts), Edit/Delete/Share, Data export (JSON), Settings (theme, house system) | User manages multiple charts, exports data |
| **MVP Launch** | Deploy to Vercel, custom domain, analytics, error tracking | **Live at astrology.app** |

**Phase 1 Acceptance Criteria:**
- [ ] End-to-end: Sign up → Birth data → Chart → AI interpretation → Share
- [ ] Cost < $5/month at 100 DAU
- [ ] Disclaimer visible on every chart page
- [ ] Data deletion works (GDPR test)
- [ ] No PII in logs
- [ ] Lighthouse: Performance >90, Accessibility >95, SEO >90

### Phase 2: Core Features (Week 7-12)

| Sprint | Feature | Notes |
|--------|---------|-------|
| 5-6 | Transits (current + forecast), Date range picker, Transit interpretations | Cache aggressively |
| 7-8 | Synastry (two-chart), Composite chart, Compatibility AI summaries | Requires two saved charts |
| 9-10 | Solar/Lunar Returns, Moon Phase, Progressions (secondary) | Optional: secondary progressions |
| 11-12 | PDF Reports (free basic + paid detailed), Stripe integration, Purchase flow | Test with real cards |

### Phase 3: Growth & Polish (Month 4-6)

| Area | Tasks |
|------|-------|
| **Performance** | Migration to self-hosted flatlib/xalen if API costs >$50/mo, Edge caching, Image optimization |
| **Vedic/Sidereal** | Ayanamsa selector, Nakshatra calculations, Dasha periods (Vimshottari), Vedic chart style |
| **Mobile** | PWA (installable), Push notifications (daily transit), Offline chart view |
| **Community** | Anonymous chart sharing (opt-in), "Chart of the day," Interpretation feedback (thumbs up/down) |
| **Admin** | Dashboard: users, revenue, API usage, flagged AI outputs, audit logs |

### Phase 4: Scale & B2B (Month 6-12)

| Initiative | Description |
|------------|-------------|
| **Developer API** | Public API with keys, rate limits, documentation, Stripe Connect for billing |
| **White-Label** | Multi-tenant architecture, practitioner dashboard, custom branding, client management |
| **Enterprise** | SSO (SAML/OIDC), SLA, dedicated support, data residency options |
| **Internationalization** | Spanish, French, German, Hindi, Chinese (AI prompts + UI) |
| **Advanced AI** | Fine-tuned model on astrology corpus, RAG with classical texts, Voice interpretations |

---

## 12. Technical & Business Risks

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Astrologer API rate limits / shutdown** | Medium | High | Migration path to flatlib documented; cache aggressively; monitor API health |
| **AI hallucination (inventing positions)** | Low (with strict prompts) | High | Structured input contract, output validation, citation requirement, low temperature |
| **Ephemeris precision issues (Moshier)** | Low | Medium | Document precision (±1"); offer Swiss Eph upgrade path; user-selectable engine |
| **Supabase/Vercel free tier changes** | Low | Medium | Infrastructure-as-code; portable to Railway/Fly.io/Cloudflare; multi-cloud prep |
| **Database scale (PostgreSQL)** | Low (until 100K+) | Medium | Read replicas, partitioning by user_id, connection pooling (PgBouncer) |
| **Birth time unknown handling** | High (user error) | Medium | Clear UI: "No houses/ASC without time"; noon UTC fallback with warning banner |
| **Timezone/DST bugs** | Medium | High | Use IANA tz database (Intl API), store UTC only, test edge cases (1918, 1942, polar) |
| **Geocoding failures/limits** | Medium | Low | Fallback to manual lat/lon entry, cache results, multiple providers |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Low conversion (free→paid)** | High | High | Freemium value must be real; test pricing early; gather feedback on report previews |
| **App Store rejection (astrology category)** | Medium | Medium | PWA first; native later; clear disclaimer; no medical claims |
| **Regulatory action (medical claims)** | Low | Critical | Strict output filters; legal review of all copy; insurance |
| **Competition (Co-Star, The Pattern, Sanctuary)** | High | Medium | Differentiate: transparency, no fake personas, data ownership, open methodology, cheaper |
| **AI backlash / "AI astrology is fake"** | Medium | Medium | Lead with "calculated by Swiss Ephemeris, interpreted by AI"; show raw data |
| **Key person dependency (solo founder)** | High | High | Document everything; bus factor >1 for critical infra; automated deployments |
| **Payment processing holds (Stripe high-risk)** | Low | High | Clear terms, low refund rate, monitor dispute rate, reserve fund |
| **Viral growth → cost spike** | Low | High | Hard limits on free tier (3 AI Qs/day); auto-upgrade prompts; cache warming |

### Legal/Compliance Risks

| Risk | Mitigation |
|------|------------|
| **GDPR/CCPA non-compliance** | Privacy by design, DPA with all processors, 30-day deletion, DPIA for AI processing |
| **COPPA (under 13)** | Age gate at signup, no marketing to minors, parental consent flow if needed |
| **Accessibility (WCAG 2.1 AA)** | Semantic HTML, ARIA labels, color contrast, keyboard nav, screen reader testing |
| **Terms of Service enforceability** | Plain language, arbitration clause, jurisdiction, updates with notice |
| **Intellectual Property** | Original code (MIT/Apache libs), no copyrighted text in training, AI output not copyrighted |

---

## What's Free vs. What Costs Money

### Free to Build & Run (Prototype → ~1K DAU)
| Component | Free Tier Limit |
|-----------|-----------------|
| Frontend Hosting (Vercel) | 100GB bandwidth, unlimited personal projects |
| Backend Functions (Vercel) | 100GB-hours/mo |
| Database (Supabase) | 500MB, 50MB files, 2GB egress |
| Auth (Supabase) | Unlimited MAU |
| Cache (Upstash Redis) | 10K req/day, 256MB |
| AI (Groq) | Rate-limited free tier |
| AI (Gemini Flash) | $0.075/1M in — ~$0.01/mo at 1K DAU |
| Email (Resend) | 3K/mo |
| Errors (Sentry) | 5K events/mo |
| Analytics (PostHog self-hosted) | Free on Railway ($5/mo) |
| Geocoding (Geoapify) | 3K/day |
| Domain | ~$12/yr (only hard cost) |

### Costs Money at Scale
| Component | When It Costs | Est. Monthly at 10K DAU |
|-----------|---------------|-------------------------|
| AI Tokens | >Free tier / better quality | $40-80 (Gemini Flash) |
| Database | >500MB / >2GB egress | $50-100 (Neon/Supabase Pro) |
| Hosting | >Pro limits / global latency | $100-200 (Vercel Pro / Fly.io) |
| Cache | >10K req/day | $10-50 (Upstash Pro) |
| Email | >3K/mo | $20-100 (Resend) |
| CDN/Bandwidth | >100GB | $20-100 |
| Monitoring | >Free tiers | $50-100 |
| **Total** | | **$300-700/mo** |

### One-Time Costs
- Domain: $12-50/yr
- Legal review (privacy/terms): $500-2,000 (one-time)
- Logo/branding: $0 (DIY) - $5,000 (pro)
- Apple Developer Account: $99/yr (for native app)
- Google Play Console: $25 one-time

---

## Exact First Development Milestone (Awaiting Your Approval)

### Milestone 1: "Chart Calculator MVP" (2 Weeks)

**Scope**: Deploy a working app where a user can:
1. Sign up (email + password)
2. Enter birth data (date, time, location with autocomplete)
3. See their natal chart (SVG wheel + planet list)
4. Read an AI-generated overview interpretation
5. See the mandatory disclaimer
6. Export their chart data as JSON
7. Delete their account and all data

**Tech Stack**:
- Next.js 15 (App Router) + TypeScript + Tailwind
- Supabase (Auth + PostgreSQL + RLS)
- Astrologer API (RapidAPI free tier) for calculations
- Groq (Llama 3.1 70B) or Gemini 1.5 Flash for AI
- Upstash Redis for interpretation caching
- Vercel for hosting
- Geoapify for geocoding

**Definition of Done**:
- [ ] Live at `https://astrology-app.vercel.app` (or custom domain)
- [ ] End-to-end flow works in <10 seconds
- [ ] Disclaimer banner on chart page, links to full disclaimer
- [ ] Data export (JSON) contains all chart data
- [ ] Account deletion removes all data (verified in Supabase dashboard)
- [ ] No birth data in Vercel/Supabase/Upstash logs
- [ ] Lighthouse scores: Perf >90, A11y >95, SEO >90
- [ ] Monthly cost < $5 at 100 DAU (verified in billing dashboards)
- [ ] Error tracking (Sentry) captures zero unhandled errors in testing
- [ ] GitHub repo with CI/CD (lint, typecheck, test, deploy preview)

**Estimated Effort**: 40-60 hours (solo, experienced full-stack)

**Go/No-Go for Phase 2**: 100+ signups, >40% complete chart, >20% return within 7 days, zero critical bugs.

---

## Appendix: Key Resources & References

### Libraries & APIs
- **Astrologer API**: https://rapidapi.com/gbattaglia/api/astrologer | Docs: https://www.kerykeion.net/astrologer-api/docs/v5
- **flatlib**: https://github.com/flatangle/flatlib (MIT)
- **xalen-ephemeris**: https://github.com/vedika-io/xalen-ephemeris (Apache-2.0)
- **VedAstro**: https://github.com/VedAstro/VedAstro (MIT)
- **AstroChart (SVG)**: https://github.com/AstroDraw/AstroChart (MIT)
- **Swiss Ephemeris Files**: https://github.com/aloistr/swisseph/tree/master/ephe
- **JPL DE441**: https://ssd.jpl.nasa.gov/ftp/eph/planets/Linux/de441/

### Hosting & Services
- **Vercel**: https://vercel.com/pricing
- **Supabase**: https://supabase.com/pricing
- **Upstash**: https://upstash.com/pricing
- **Groq**: https://console.groq.com/keys
- **Google AI Studio**: https://aistudio.google.com/apikey
- **Stripe**: https://stripe.com/pricing
- **Resend**: https://resend.com/pricing
- **Geoapify**: https://www.geoapify.com/pricing

### Legal Templates (Review with Lawyer)
- **Privacy Policy**: Termly, Iubenda, or custom based on GDPR Art. 13/14
- **Terms of Service**: Include arbitration, limitation of liability, disclaimer incorporation
- **DPA Templates**: Supabase, Vercel, Upstash, Stripe provide standard DPAs
- **Cookie Policy**: Only essential cookies (auth, preferences) — no consent banner needed

---

**Next Step**: Please review this plan. Reply with **APPROVED** to begin Milestone 1, or request changes to any section.