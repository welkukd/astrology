<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Astrology App - AGENTS.md

## Project
Self-hosted AI-powered astrology app. Zero recurring cost (flatlib + Gemini free tier + Supabase free + Vercel Hobby + Railway free).

## Stack
- **Frontend**: Next.js 15 (Vercel) — `/apps/web`
- **Backend**: FastAPI (Railway) — `/apps/api`
- **Auth/DB**: Supabase (free tier)
- **Calculation**: flatlib 0.2.3 + pyswisseph 2.10.3.2 (self-hosted, no paid API)
- **AI**: Gemini Flash (free tier, model: `gemini-flash-latest`)

## Key Files
- `apps/api/app/services/calculator.py` — core calculation engine (flatlib wrapper)
- `apps/api/app/api/routes/charts.py` — POST /api/v1/natal, GET/DELETE /api/v1/charts, POST export
- `apps/api/app/api/routes/ai.py` — POST /api/v1/interpret (Gemini/Groq/OpenAI)
- `apps/web/src/app/chart/new/page.tsx` — 3-step chart creation form
- `apps/web/src/app/chart/[chart_id]/page.tsx` — chart view with AI interpretations
- `apps/web/src/components/ChartWheel.tsx` — SVG chart wheel
- `supabase/schema.sql` — DB schema with RLS

## Flatlib API (confirmed working)
```python
from flatlib.datetime import Datetime, Date, Time
from flatlib.geopos import GeoPos
from flatlib.chart import Chart
from flatlib import const, aspects

chart = Chart(datetime, geopos, IDs=const.LIST_OBJECTS, hsys=const.HOUSES_PLACIDUS)
sun = chart.getObject(const.SUN)
house1 = chart.getHouse(const.HOUSE1)  # .id, .lon, .sign
asc = chart.getAngle(const.ASC)

# Aspects
aspect = aspects.getAspect(obj1, obj2, const.ALL_ASPECTS)
# aspect.type = 0/60/90/120/180 (angle int)
# aspect.movement() = "Applicative" | "Separative"
# aspect.orb = float
# aspect.active.id, aspect.passive.id

# House lookup: iterate HOUSE_KEYS, compare lon % 360
```

## Deployment
- Backend: `railway.json` + `nixpacks.toml` at root (workingDirectory: apps/api)
- Frontend: `vercel.json` in `apps/web/` (auto-detected by Vercel)
- Env vars needed:
  - Backend: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Routes
| Frontend (Next.js) | Proxies to | Backend (FastAPI) |
|---|---|---|
| POST /api/charts | → | POST /api/v1/natal |
| GET /api/charts | → | GET /api/v1/charts |
| GET /api/charts/[id] | → | GET /api/v1/charts/[id] |
| DELETE /api/charts/[id] | → | DELETE /api/v1/charts/[id] |
| POST /api/interpret | → | POST /api/v1/interpret |
| GET /api/geocode | → | Nominatim (direct) |

## Status
- ✅ Calculation engine (flatlib) — WORKS (12 planets, 12 houses, 44 aspects)
- ✅ AI interpretation (Gemini Flash) — WORKS (prompts for overview/planet/aspect/transit/synastry/question)
- ✅ Frontend build (Next.js) — PASSES (0 compile errors)
- ✅ Backend startup (local) — PASSES (uvicorn, all imports, TestClient verified)
- ✅ Frontend deployed — LIVE at https://astrology-awbato3ho-zone-1433.vercel.app
- ⚠️ Backend deployed — Railway returns 200 for /health but 404 for /api/v1/* routes
- ⏳ Supabase setup — needs user to create project + run schema.sql
- ⏳ Railway deployment — needs user to connect GitHub repo to Railway, configure env vars, trigger deploy

## External Blockers
| Blocker | Required For | Evidence Needed |
|---------|--------------|-----------------|
| Railway project connected to GitHub | Backend auto-deploy | Railway dashboard shows project linked to welkukd/astrology |
| Railway env vars set | Backend runtime | `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` in Railway |
| Supabase project created | DB + Auth | Supabase dashboard shows project with schema.sql applied |

## Verification Commands
```bash
# Frontend health
curl -s https://astrology-awbato3ho-zone-1433.vercel.app/api/health

# Backend health (Railway direct)
curl -s https://astrology-api.up.railway.app/health

# Backend API routes (should return 401 auth, not 404)
curl -s https://astrology-api.up.railway.app/api/v1/natal -X POST -H "Content-Type: application/json" -d '{"date":"1990-01-01","time":"12:00","time_unknown":false,"latitude":28.6139,"longitude":77.2090,"timezone":"Asia/Kolkata","name":"Test","zodiac":"tropical","house_system":"placidus"}'
```

# VERIFIED 2026-10-28 01:50:00 EDT — Autonomous orchestrator scan (RUN 3)
# Frontend DEPLOYED & WORKING at https://astrology-awbato3ho-zone-1433.vercel.app
# Backend CRITICAL ISSUE: Railway deployment serves DIFFERENT CODEBASE than GitHub repo
#   - Railway openapi.json shows: /api/auth/*, /api/nguoi/* (Vietnamese endpoints)
#   - Local main.py expects: /api/v1/* (charts, ai, readings, etc.)
#   - Frontend vercel.json rewrites /api/v1/* → Railway /api/v1/* (404 on Railway)
# Local TestClient confirms local routes work, return 401 auth required (correct behavior)
# GitHub push completed (origin/main up to date at 22bebb0)
# Railway config: root railway.json + nixpacks.toml, workingDirectory: apps/api (correct)
# DIAGNOSIS: Railway project linked to WRONG REPO or stale commit. Need user to:
#   1. In Railway dashboard: Link project to GitHub repo welkukd/astrology
#   2. Set workingDirectory to apps/api in Railway dashboard
#   3. Add env vars: GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
#   4. Trigger fresh deploy
# 
# VERIFIED 2026-10-28 01:50:00 EDT:
# - Frontend: https://astrology-awbato3ho-zone-1433.vercel.app/api/health returns OK
# - Frontend /api/charts: returns 401 Unauthorized (correct — auth required)
# - Frontend /api/interpret: returns "Interpretation failed" (backend 404)
# - Backend /health: https://astrology-api.up.railway.app/health returns {"ok":true,"mongo":"up"}
# - Backend /api/v1/*: All routes return 404 (Railway serves DIFFERENT CODEBASE)
# - Backend openapi.json: Shows /api/auth/*, /api/nguoi/* — NOT the local /api/v1/* routes
# - Local TestClient: All 11 API route modules work locally, return 401 auth required
# - GitHub repo: https://github.com/welkukd/astrology (synced, origin/main up to date)
# - Railway CLI: Not authenticated — requires user to login and link project
