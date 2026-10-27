# Railway Backend Deployment Checklist
## Astrology API — https://astrology-api.railway.app

---

## ✅ Current Status (Verified 2026-10-27)

| Component | Status | Evidence |
|-----------|--------|----------|
| GitHub repo | ✅ Linked | `origin` → `https://github.com/welkukd/astrology.git` |
| `railway.json` | ✅ Present & correct | Root level, `workingDirectory: apps/api` |
| `nixpacks.toml` | ✅ Present & correct | Root level, flatlib deps included |
| Local TestClient | ✅ All routes work | `/api/v1/natal`, `/api/v1/charts` return 401 (auth required) |
| Railway `/health` | ✅ Returns 200 | `https://astrology-api.railway.app/health` |
| Railway `/api/v1/*` | ❌ Returns 404 | **Root cause: Railway not linked to GitHub or stale build** |

---

## 🔧 Required Railway Dashboard Actions

### 1. Link Railway Project to GitHub Repository
- Go to [Railway Dashboard](https://railway.app/dashboard)
- Select your project (or create new: **New Project → Deploy from GitHub repo**)
- Connect GitHub account if not already connected
- Select repository: **welkukd/astrology**
- **Critical**: Ensure the **working directory** is set to `apps/api` (or verify `railway.json` is respected)

### 2. Verify Build Configuration
In Railway project settings, confirm:
- **Builder**: NIXPACKS (auto-detected from `railway.json`)
- **Build Command**: Auto (NIXPACKS handles this)
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (from `railway.json`)
- **Working Directory**: `apps/api` (from `railway.json` → `deploy.workingDirectory`)
- **Healthcheck Path**: `/health` (from `railway.json`)

### 3. Set Environment Variables
In Railway **Variables** tab, add **all three** (required for runtime):

| Variable | Value | Source |
|----------|-------|--------|
| `GEMINI_API_KEY` | `your-gemini-api-key` | Google AI Studio → Get API Key |
| `SUPABASE_URL` | `https://your-project.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | Supabase Dashboard → Settings → API |

> ⚠️ **Do NOT use `SUPABASE_ANON_KEY`** — backend needs service role for RLS bypass on writes.

### 4. Trigger Fresh Deployment
- After linking repo + setting variables, click **Deploy** (or push to `main` branch)
- Watch build logs for:
  - NIXPACKS installing apt packages (`libpango`, `libcairo`, `fonts-noto`, etc.)
  - Python dependencies installing from `requirements.txt`
  - `uvicorn` starting on `0.0.0.0:$PORT`

---

## ✅ Post-Deploy Verification

Run these commands **after deployment completes**:

```bash
# 1. Health check (should return 200)
curl -s https://astrology-api.railway.app/health

# 2. API route test (should return 401 auth required, NOT 404)
curl -s https://astrology-api.railway.app/api/v1/natal \
  -X POST -H "Content-Type: application/json" \
  -d '{"date":"1990-01-01","time":"12:00","time_unknown":false,"latitude":28.6139,"longitude":77.2090,"timezone":"Asia/Kolkata","name":"Test","zodiac":"tropical","house_system":"placidus"}'

# 3. List charts (should return 401 auth required, NOT 404)
curl -s https://astrology-api.railway.app/api/v1/charts
```

**Expected results:**
- `/health` → `{"status":"healthy","version":"0.1.0"}`
- `/api/v1/natal` → `{"detail":"Not authenticated"}` (401)
- `/api/v1/charts` → `{"detail":"Not authenticated"}` (401)

**If any returns 404** → Deployment still not using latest code. Re-check working directory and trigger rebuild.

---

## 🔄 Frontend Configuration (Already Deployed)

Frontend is live at: **https://astrology-awbato3ho-zone-1433.vercel.app**

Ensure Vercel environment variables are set:
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://astrology-api.railway.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |

---

## 📋 Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `/api/v1/*` returns 404 | Railway not linked to GitHub / stale build | Re-link repo, verify `workingDirectory: apps/api`, trigger fresh deploy |
| Build fails on `flatlib` / `pyswisseph` | Missing system deps | Confirm `nixpacks.toml` has all apt packages listed |
| `uvicorn` fails to start | Wrong working directory | Verify `railway.json` has `workingDirectory: apps/api` |
| 500 errors on API calls | Missing env vars | Add all 3 required env vars in Railway Variables tab |
| CORS errors from frontend | CORS origins not configured | Backend reads `CORS_ORIGINS` from settings — ensure Vercel URL is allowed |

---

## 📁 Key Files Reference

```
/Users/admin/Desktop/DESKTOP FILE/astrology/
├── railway.json              # Railway deployment config (root)
├── nixpacks.toml             # NIXPACKS build config (root)
├── apps/api/
│   ├── app/main.py           # FastAPI app with /api/v1/* routes
│   ├── requirements.txt      # Python dependencies
│   └── runtime.txt           # Python version (3.11)
└── supabase/schema.sql       # Run this in Supabase SQL Editor
```

---

## ✅ Checklist Summary

- [ ] Railway project linked to `welkukd/astrology` GitHub repo
- [ ] Working directory set to `apps/api` (or `railway.json` respected)
- [ ] `GEMINI_API_KEY` added to Railway Variables
- [ ] `SUPABASE_URL` added to Railway Variables
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added to Railway Variables
- [ ] Fresh deployment triggered (push to main or manual deploy)
- [ ] `/health` returns 200
- [ ] `/api/v1/natal` returns 401 (not 404)
- [ ] `/api/v1/charts` returns 401 (not 404)
- [ ] Frontend Vercel env vars updated with Railway URL
- [ ] Supabase schema.sql applied in Supabase SQL Editor

---

**Once all ✅ — backend will be fully functional at `https://astrology-api.railway.app`**