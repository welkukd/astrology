# Gaia v1 — Private Spiritual Toolkit

## Project Overview
Transform the production-ready astrology app into **Gaia** — a private spiritual toolkit combining Astrology + Tarot + AI Spiritual Guide + Human Design. Dark glassmorphism, gold accent, Playfair Display + Inter, one gold triangle, zero emojis, zero community.

## Current Foundation (Astrology — DONE)
- **Frontend**: Next.js 15, TS, Tailwind at `/apps/web`
- **Backend**: FastAPI, flatlib + Swiss Eph at `/apps/api`
- **Database**: Supabase schema ready at `/supabase/schema.sql`
- **Deploy**: Vercel + Railway configs ready
- **Git**: `github.com/welkukd/astrology` (clean main)

## Gaia v1 Scope (4 Pillars)

### 1. Astrology (✅ Complete — extend only)
- Natal charts, transits, synastry, dasha, PDF reports
- Western wheel + Vedic grid chart views
- 22 house systems, tropical/sidereal, 48 ayanamsas
- AI interpretations (overview, planet, aspect, transit, question)

### 2. Tarot (🆕 NEW)
- **Readings**: 1-card, 3-card (past/present/future), Celtic Cross (10-card), custom spreads
- **Deck**: Rider-Waite-Smith imagery (78 cards — Major Arcana 22, Minor Arcana 56)
- **Features**: Reversals, card meanings (upright/reversed), daily draw, reading history, journal
- **AI**: Interpretation per spread position, synthesized narrative, follow-up questions
- **Storage**: Encrypted readings in Supabase, local-first cache

### 3. AI Spiritual Guide (🆕 NEW)
- **Daily Practice**: Personalized morning/evening ritual (meditation, breathwork, journaling, movement)
- **Guided Meditations**: Text → audio (ElevenLabs/OpenAI TTS), timer, background sounds
- **Reflection Prompts**: Contextual (chart-based, seasonal, lunar phase, life events)
- **Dream Journal**: Entry, pattern detection, symbol dictionary, AI analysis
- **Habit Tracker**: Spiritual habits (meditation, journal, tarot, prayer, nature, gratitude)
- **Privacy**: All conversations encrypted, local-first, export/delete anytime

### 4. Human Design / Gene Keys (🆕 NEW)
- **Bodygraph**: SVG rendering (centers, channels, gates, circuits)
- **Core**: Type, Strategy, Authority, Profile, Definition, Incarnation Cross
- **Centers**: 9 centers (defined/undefined), themes, not-self signatures
- **Channels**: 36 channels, keynotes, quantum names
- **Gates**: 64 gates, lines (1-6), Gene Keys shadows/gifts/siddhis
- **Variables**: PHS (tone, base, color), Environment, Perspective, Motivation
- **AI**: Personalized deconditioning guide, experiment suggestions

## Design System (DESIGN.md — ✅ Created)
- **Colors**: `#08090a` bg, `#fbbf24` gold accent, grayscale text
- **Fonts**: Playfair Display (headings, cv01/ss03), Inter (body), JetBrains Mono (data)
- **Components**: Defined in DESIGN.md (buttons, cards, inputs, nav, tabs, charts, tarot, HD, AI)
- **Motion**: 200-300ms, respects prefers-reduced-motion
- **Responsive**: Mobile-first, 44px touch targets

## Technical Architecture

### Frontend (`/apps/web`)
```
src/
├── app/
│   ├── (auth)/           # login, register, settings
│   ├── (dashboard)/      # protected routes
│   │   ├── astrology/    # existing chart views
│   │   ├── tarot/        # NEW: readings, deck, journal, daily
│   │   ├── guide/        # NEW: AI guide, meditation, dreams, habits
│   │   ├── humandesign/  # NEW: bodygraph, centers, channels, gates
│   │   └── library/      # NEW: content player, courses
│   └── api/              # Next.js API routes (proxy to FastAPI)
├── components/
│   ├── astrology/        # existing: ChartWheel, VedicChart
│   ├── tarot/            # NEW: TarotCard, SpreadLayout, CardMeaning
│   ├── guide/            # NEW: MeditationPlayer, HabitTracker, DreamJournal
│   ├── humandesign/      # NEW: Bodygraph, Center, Channel, Gate
│   ├── ui/               # NEW: design system primitives (Button, Card, Input, etc.)
│   └── layout/           # Navbar, Footer, Sidebar
├── lib/
│   ├── design-tokens.ts  # DESIGN.md tokens as TS objects
│   ├── utils.ts          # existing cn(), formatDate, etc.
│   └── api.ts            # typed API client
└── hooks/                # NEW: useTarot, useGuide, useHumanDesign
```

### Backend (`/apps/api`)
```
app/
├── api/routes/
│   ├── charts.py         # existing
│   ├── readings_v2.py    # existing
│   ├── tarot.py          # NEW: readings, meanings, deck
│   ├── guide.py          # NEW: daily practice, meditations, dreams, habits
│   ├── humandesign.py    # NEW: bodygraph, centers, channels, gates
│   └── content.py        # NEW: library, courses
├── services/
│   ├── calculator.py     # existing
│   ├── ai.py             # existing
│   ├── tarot_engine.py   # NEW: spread logic, card data, meanings
│   ├── guide_engine.py   # NEW: practice generator, meditation scripts
│   ├── humandesign_engine.py  # NEW: bodygraph calculation, gate data
│   └── tts.py            # NEW: ElevenLabs/OpenAI TTS
└── schemas/              # NEW: tarot, guide, humandesign Pydantic models
```

### Database (Supabase — extend schema.sql)
```sql
-- Tarot
CREATE TABLE tarot_readings (...);
CREATE TABLE tarot_journal_entries (...);
CREATE TABLE tarot_daily_draws (...);

-- AI Guide
CREATE TABLE guide_sessions (...);
CREATE TABLE meditations (...);
CREATE TABLE dream_entries (...);
CREATE TABLE habit_entries (...);

-- Human Design
CREATE TABLE hd_charts (...);
```

## Implementation Waves

### Wave 1 — Foundation & Design System (3 agents)
| Agent | Task | Files |
|-------|------|-------|
| 1 | Design system primitives + tokens | `/apps/web/src/components/ui/*`, `/apps/web/src/lib/design-tokens.ts` |
| 2 | Layout shell (navbar, sidebar, routing) | `/apps/web/src/components/layout/*`, `/apps/web/src/app/(dashboard)/layout.tsx` |
| 3 | Supabase schema extensions + API types | `/supabase/schema.sql` (append), `/apps/api/app/schemas/*` |

### Wave 2 — Tarot Module (3 agents)
| Agent | Task | Files |
|-------|------|-------|
| 1 | Tarot engine + card data (78 cards) | `/apps/api/app/services/tarot_engine.py`, card JSON |
| 2 | Tarot API routes | `/apps/api/app/api/routes/tarot.py` |
| 3 | Tarot frontend (cards, spreads, readings, journal) | `/apps/web/src/components/tarot/*`, `/apps/web/src/app/(dashboard)/tarot/*` |

### Wave 3 — AI Spiritual Guide (3 agents)
| Agent | Task | Files |
|-------|------|-------|
| 1 | Guide engine + TTS + daily practice | `/apps/api/app/services/guide_engine.py`, `/apps/api/app/services/tts.py` |
| 2 | Guide API routes | `/apps/api/app/api/routes/guide.py` |
| 3 | Guide frontend (chat, meditation player, dream journal, habits) | `/apps/web/src/components/guide/*`, `/apps/web/src/app/(dashboard)/guide/*` |

### Wave 4 — Human Design (3 agents)
| Agent | Task | Files |
|-------|------|-------|
| 1 | HD engine + bodygraph calculation | `/apps/api/app/services/humandesign_engine.py`, gate/channel JSON |
| 2 | HD API routes | `/apps/api/app/api/routes/humandesign.py` |
| 3 | HD frontend (bodygraph SVG, centers, channels, gates) | `/apps/web/src/components/humandesign/*`, `/apps/web/src/app/(dashboard)/humandesign/*` |

### Wave 4.5 — Polish & Integration (2 agents)
| Agent | Task | Files |
|-------|------|-------|
| 1 | Cross-module navigation, unified search, settings | `/apps/web/src/app/(dashboard)/*`, `/apps/web/src/components/layout/*` |
| 2 | Build verification, type fixes, deploy prep | All |

## Deployment Checklist (Post-Code)
- [ ] Supabase: run extended `schema.sql`
- [ ] Vercel: set `NEXT_PUBLIC_API_URL`, Supabase keys, design tokens
- [ ] Railway: set `SUPABASE_*`, `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, CORS
- [ ] GitHub: push, connect Vercel + Railway
- [ ] Verify: all 4 pillars load, auth works, charts calculate, tarot draws, guide responds, HD renders

## Success Criteria
- **Build**: `npm run build` (web) + `uvicorn` startup (api) — zero errors
- **Performance**: <2s chart calc, <3s tarot reading, <5s HD bodygraph, <1s guide response
- **Privacy**: Zero external requests except AI/TTS/CDN, all user data encrypted
- **Design**: Matches DESIGN.md exactly — gold triangle count = 1 per major section
- **Mobile**: All 4 pillars usable on 375px viewport, 44px touch targets

## Risk Mitigation
| Risk | Mitigation |
|------|------------|
| 78-card imagery licensing | Use public domain RWS (pre-1923) or CC0 alternatives; placeholder SVGs for v1 |
| HD bodygraph SVG complexity | Start with centers + channels only; gates as interactive overlay v2 |
| TTS cost/latency | Cache generated audio; fallback to browser SpeechSynthesis |
| AI token costs | Aggressive caching (chart_hash + question_type); streaming responses |
| Scope creep | Hard freeze: 4 pillars only. No community, no marketplace, no social. |

## Agent Dispatch Notes
- Each agent gets: DESIGN.md, AGENTS.md, this PLAN.md, relevant existing files
- Agents MUST NOT run `next build` — orchestrator verifies after each wave
- Explicit file ownership per agent — no overlapping edits
- Agents return file paths created/modified for verification