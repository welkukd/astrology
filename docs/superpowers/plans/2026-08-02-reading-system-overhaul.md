# Reading System Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace static pre-written readings with AI (Gemini) generated personalized readings in Malayalam and English, with actual calculated Dasha dates, and a downloadable PDF report.

**Architecture:** One unified AI service (`services/ai.py`) calls Gemini with rich chart context. A new `GET /api/v1/reading/{chart_id}?lang=ml` endpoint serves cached or freshly-generated readings. The frontend reading page calls this endpoint, displays AI content, and offers a PDF download. Dasha data (with real dates) comes from the existing `dasha.py` calculator. PDF generated via `weasyprint` on the backend.

**Tech Stack:** Gemini Flash (`gemini-flash-latest`), FastAPI, `weasyprint` (PDF), `httpx` (AI calls), Next.js 16, Supabase (cache), `@supabase/supabase-js`.

## Global Constraints

- Gemini model: `gemini-flash-latest` (free tier, 15 RPM, 1M tokens/day)
- Backend env var: `GEMINI_API_KEY` (already set on Railway)
- Frontend env var: `NEXT_PUBLIC_API_URL=https://astrology-api-production-813b.up.railway.app` (already set on Vercel)
- Supabase project: `pefvkvpcsxuanhctuoms` (already configured)
- Default language: Malayalam (`ml`); toggle to English (`en`)
- No medical/death/financial predictions ( existing safety language in prompts)
- No new paid dependencies — all free tier

---

## File Structure

**Backend (apps/api):**
- **Create** `app/services/ai.py` — Unified Gemini service (replaces duplicated `_call_gemini` in readings.py + ai.py)
- **Create** `app/services/pdf_generator.py` — WeasyPrint PDF generation
- **Create** `app/api/routes/reading_v2.py` — New unified reading endpoint (GET + POST generate + GET PDF)
- **Modify** `app/main.py:6,32-34` — Register `reading_v2` router
- **Modify** `app/services/dasha.py:129` — Fix `datetime.now()` → `datetime.now(timezone.utc)` for UTC
- **Modify** `app/api/routes/readings.py` — Keep existing endpoints (backward compat), refactor to use `services/ai.py`

**Frontend (apps/web):**
- **Create** `src/app/api/reading-v2/route.ts` — New proxy for `reading_v2` backend endpoints
- **Modify** `src/app/chart/[chart_id]/read/page.tsx` — Rewrite to fetch AI readings + language toggle + PDF button + rebuilt Dasha tab
- **Modify** `src/lib/utils.ts` — Add Malayalam date formatter helper

**Database:**
- **Modify** `supabase/schema.sql` — Add `language` column + `reading_data` JSONB column to `interpretations`

---

## Task 1: Database Schema Update

**Files:**
- Modify: `supabase/schema.sql:26-37`
- Apply via: Supabase Management API (SQL query)

**Interfaces:**
- Produces: `interpretations` table with new `language TEXT DEFAULT 'en'` and `reading_data JSONB` columns; unique constraint `(chart_id, type, language)`

- [ ] **Step 1: Apply schema migration via Supabase API**

Run this to add the two columns and update the unique constraint:

```bash
curl -s -X POST "https://api.supabase.com/v1/projects/pefvkvpcsxuanhctuoms/database/query" \
  -H "Authorization: Bearer sbp_0a34658bea2b1e8d383ea0e42a6b8a48a4054ec2" \
  -H "Content-Type: application/json" \
  -d '{"query":"ALTER TABLE interpretations ADD COLUMN IF NOT EXISTS language TEXT DEFAULT '\''en'\''; ALTER TABLE interpretations ADD COLUMN IF NOT EXISTS reading_data JSONB; ALTER TABLE interpretations DROP CONSTRAINT IF EXISTS interpretations_chart_id_type_context_key; ALTER TABLE interpretations ADD UNIQUE (chart_id, type, language);"}'
```

Expected: `[{"success":true}]` or similar success response

- [ ] **Step 2: Update the schema.sql file to match**

Add the new columns and constraint to `supabase/schema.sql` so the file reflects the live DB:

```sql
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
```

- [ ] **Step 3: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add language + reading_data columns to interpretations table"
```

---

## Task 2: Unified AI Service (`services/ai.py`)

**Files:**
- Create: `apps/api/app/services/ai.py`
- Modify: `apps/api/app/api/routes/readings.py:94-103` (replace inline `_call_gemini` with import)
- Modify: `apps/api/app/api/routes/ai.py:130-142` (replace inline `_call_gemini` with import)

**Interfaces:**
- Produces: `async def call_gemini(prompt: str, max_tokens: int = 8192) -> str` — single entry point for all Gemini calls. Higher token limit (8192) for long readings.

- [ ] **Step 1: Create `app/services/ai.py`**

```python
import httpx
from app.core.config import settings


GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"


async def call_gemini(prompt: str, max_tokens: int = 8192, temperature: float = 0.4) -> str:
    """Call Gemini Flash. Raises httpx.HTTPStatusError on failure."""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
            "topP": 0.95,
        },
    }
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            GEMINI_URL,
            json=payload,
            params={"key": settings.GEMINI_API_KEY},
        )
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


async def call_gemini_json(prompt: str, max_tokens: int = 8192) -> dict:
    """Call Gemini and parse the response as JSON.
    Strips markdown code fences if present."""
    raw = await call_gemini(prompt, max_tokens=max_tokens, temperature=0.3)
    text = raw.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [ln for ln in lines if not ln.startswith("```")]
        text = "\n".join(lines)
    import json
    return json.loads(text)
```

- [ ] **Step 2: Update `readings.py` to import from the new service**

In `apps/api/app/api/routes/readings.py`, replace the inline `_call_gemini` function (lines 94-103) with an import. Add at top of file (after existing imports):

```python
from app.services.ai import call_gemini
```

And change all `_call_gemini(` calls in this file to `call_gemini(`. Delete the old `_call_gemini` function definition (lines 94-103).

- [ ] **Step 3: Update `ai.py` to import from the new service**

In `apps/api/app/api/routes/ai.py`, add at top:

```python
from app.services.ai import call_gemini
```

Replace the `_call_gemini` function body (lines 130-142) to delegate:

```python
async def _call_gemini(prompt: str) -> str:
    return await call_gemini(prompt, max_tokens=2000)
```

(This keeps backward compatibility with `ai.py`'s `call_ai` dispatcher that calls `_call_gemini`.)

- [ ] **Step 4: Verify backend imports succeed**

Run locally (the venv may not have all deps, so just check syntax):

```bash
cd apps/api && python3 -c "import ast; ast.parse(open('app/services/ai.py').read()); print('ai.py OK')"
```

Expected: `ai.py OK`

- [ ] **Step 5: Commit**

```bash
git add apps/api/app/services/ai.py apps/api/app/api/routes/readings.py apps/api/app/api/routes/ai.py
git commit -m "refactor: unify Gemini calls into services/ai.py"
```

---

## Task 3: Fix Dasha `now()` to use UTC

**Files:**
- Modify: `apps/api/app/services/dasha.py:129`

**Interfaces:**
- Produces: `calculate_dasha()` now uses UTC `now` for current-period detection (was server local time)

- [ ] **Step 1: Fix the `now` reference**

In `apps/api/app/services/dasha.py`, line 129, change:

```python
    now = datetime.now()
```

to:

```python
    now = datetime.now(timezone.utc).replace(tzinfo=None)
```

Also add `timezone` to the import on line 1:

```python
from datetime import datetime, timedelta, timezone
```

(The `.replace(tzinfo=None)` keeps it naive so the `strptime` comparisons below still work without tz-aware errors.)

- [ ] **Step 2: Commit**

```bash
git add apps/api/app/services/dasha.py
git commit -m "fix: use UTC for dasha current-period detection"
```

---

## Task 4: Rich Chart Context Builder

**Files:**
- Create: `apps/api/app/services/chart_context.py`

**Interfaces:**
- Produces: `build_chart_context(chart: dict) -> str` — a detailed multi-section text summary (planets with degrees/houses/nakshatras, houses, aspects, dasha periods with dates, current period). This replaces the weak `_chart_summary` in readings.py.

- [ ] **Step 1: Create `app/services/chart_context.py`**

```python
from app.services.dasha import calculate_dasha


def build_chart_context(chart: dict) -> str:
    """Build a rich text summary of the chart for the AI prompt.
    Includes planetary positions with degrees, nakshatras, houses,
    aspects, and full Vimshottari Dasha timeline with dates."""
    planets = chart.get("planets", [])
    houses = chart.get("houses", [])
    aspects = chart.get("aspects", [])
    subject = chart.get("subject", {})
    vedic = chart.get("vedic", {})

    lines = [
        f"Name: {subject.get('name', 'Unknown')}",
        f"Birth Date: {subject.get('date')}",
        f"Birth Time: {subject.get('time', 'Unknown')}",
        f"Location: {subject.get('latitude')}, {subject.get('longitude')}",
        f"Zodiac: {subject.get('zodiac', 'tropical')} | Houses: {subject.get('house_system', 'Placidus')}",
    ]

    if vedic.get("moon_nakshatra"):
        lines.append(f"Birth Nakshatra: {vedic['moon_nakshatra']} Pada {vedic.get('moon_nakshatra_pada', '?')} (Lord: {vedic.get('moon_nakshatra_lord', '?')})")

    lines.append("")
    lines.append("=== PLANETARY POSITIONS ===")
    for p in planets:
        retro = " (Retrograde)" if p.get("retrograde") else ""
        nak = f" | Nakshatra: {p.get('nakshatra', '?')} (Pada {p.get('nakshatra_pada', '?')}, Lord {p.get('nakshatra_lord', '?')})" if p.get("nakshatra") else ""
        lines.append(
            f"  {p['name']}: {p['sign']} {p.get('degree_in_sign', 0):.2f}° "
            f"in House {p.get('house', '?')}{retro}{nak}"
        )

    lines.append("")
    lines.append("=== HOUSE CUSPS ===")
    for h in houses:
        lines.append(f"  House {h['number']}: {h['sign']} {h.get('degree_in_sign', 0):.2f}°")

    lines.append("")
    lines.append("=== MAJOR ASPECTS ===")
    for a in aspects:
        applying = " (Applying)" if a.get("applying") else ""
        lines.append(
            f"  {a['planet1']} {a['aspect']} {a['planet2']} "
            f"(orb {a.get('orb', 0):.2f}°){applying}"
        )

    lines.append("")
    lines.append("=== VIMSHOTTARI DASHA TIMELINE ===")
    try:
        dasha = calculate_dasha(chart)
        lines.append(f"  Birth Nakshatra: {dasha.get('birth_nakshatra', '?')} Pada {dasha.get('nakshatra_pada', '?')}")
        lines.append(f"  Starting Lord: {dasha.get('starting_lord', '?')}")
        lines.append("")
        cp = dasha.get("current_period")
        if cp:
            lines.append(
                f"  *** CURRENT PERIOD: {cp['mahadasha']} Mahadasha "
                f"(ends {cp['mahadasha_end']}, {cp['mahadasha_remaining']} remaining) ***"
            )
            lines.append(
                f"  *** CURRENT SUB-PERIOD: {cp['antardasha']} Antardasha "
                f"(ends {cp['antardasha_end']}, {cp['antardasha_remaining']} remaining) ***"
            )
            lines.append("")
        for md in dasha.get("mahadashas", []):
            current = " *** ACTIVE NOW ***" if md.get("planet") == dasha.get("current_mahadasha") else ""
            lines.append(f"  {md['planet']} Mahadasha: {md['start_date']} to {md['end_date']}{current}")
            for ad in md.get("antardashas", []):
                ad_current = " (NOW)" if ad.get("planet") == dasha.get("current_antardasha") and md.get("planet") == dasha.get("current_mahadasha") else ""
                lines.append(f"      {ad['planet']} Antardasha: {ad['start_date']} to {ad['end_date']}{ad_current}")
    except Exception as e:
        lines.append(f"  Dasha calculation error: {e}")

    return "\n".join(lines)
```

- [ ] **Step 2: Verify syntax**

```bash
cd apps/api && python3 -c "import ast; ast.parse(open('app/services/chart_context.py').read()); print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add apps/api/app/services/chart_context.py
git commit -m "feat: add rich chart context builder for AI prompts"
```

---

## Task 5: New Reading Endpoint (`reading_v2.py`)

**Files:**
- Create: `apps/api/app/api/routes/reading_v2.py`
- Modify: `apps/api/app/main.py:6,32-34` (register the new router)

**Interfaces:**
- Produces:
  - `GET /api/v1/reading/{chart_id}?lang=ml` — Returns cached reading or `{"status": "not_generated"}`
  - `POST /api/v1/reading/{chart_id}/generate` — Body `{"language": "ml"}` → generates and caches a full structured reading, returns it
  - `GET /api/v1/reading/{chart_id}/pdf?lang=ml` — Returns PDF bytes

- [ ] **Step 1: Create the endpoint file**

Create `apps/api/app/api/routes/reading_v2.py`:

```python
import json
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.services.ai import call_gemini
from app.services.chart_context import build_chart_context
from app.services.dasha import calculate_dasha

router = APIRouter(prefix="/v1", tags=["reading-v2"])


class GenerateRequest(BaseModel):
    language: str = "ml"  # "ml" or "en"


LANGUAGE_INSTRUCTION = {
    "ml": "Write the ENTIRE response in Malayalam (മലയാളം). Use proper Malayalam astrological terminology. Do not use any English words except planet names.",
    "en": "Write the ENTIRE response in English.",
}


def _fetch_chart(chart_id: str, user_id: str) -> dict:
    supabase = get_supabase_client()
    result = supabase.table("charts").select("chart_data") \
        .eq("id", chart_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Chart not found")
    return result.data["chart_data"]


def _get_cached(chart_id: str, language: str) -> dict | None:
    supabase = get_supabase_client()
    result = supabase.table("interpretations").select("reading_data") \
        .eq("chart_id", chart_id).eq("type", "full_v2") \
        .eq("language", language).maybe_single().execute()
    if result.data and result.data.get("reading_data"):
        return result.data["reading_data"]
    return None


def _save_cache(chart_id: str, language: str, reading_data: dict):
    supabase = get_supabase_client()
    content_preview = json.dumps(reading_data)[:500]
    supabase.table("interpretations").upsert({
        "chart_id": chart_id,
        "type": "full_v2",
        "language": language,
        "content": content_preview,
        "reading_data": reading_data,
        "model": "gemini-flash-latest",
    }, on_conflict="chart_id,type,language").execute()


@router.get("/reading/{chart_id}")
async def get_reading(chart_id: str, lang: str = "ml", user_id: str = Depends(get_current_user_id)):
    cached = _get_cached(chart_id, lang)
    if cached:
        return {"status": "cached", "reading": cached}
    return {"status": "not_generated"}


@router.post("/reading/{chart_id}/generate")
async def generate_reading(chart_id: str, req: GenerateRequest, user_id: str = Depends(get_current_user_id)):
    lang = req.language if req.language in ("ml", "en") else "ml"
    lang_inst = LANGUAGE_INSTRUCTION[lang]

    # Check cache first
    cached = _get_cached(chart_id, lang)
    if cached:
        return {"status": "cached", "reading": cached}

    chart = _fetch_chart(chart_id, user_id)
    context = build_chart_context(chart)

    # Get dasha data for the response (separate from AI text)
    dasha_data = {}
    try:
        dasha_data = calculate_dasha(chart)
    except Exception:
        pass

    prompt = f"""You are a world-class Vedic astrologer with 30+ years of experience reading birth charts. You read charts HOLISTICALLY — synthesizing multiple factors, noting planetary dignities, combustion, retrograde effects, and house ruler relationships.

{lang_inst}

SAFETY RULES:
- Use language like "may indicate," "suggests," "invites reflection on." Be supportive and empowering.
- Never predict death, illness, or specific events. Never give medical, legal, or financial advice.

BIRTH CHART DETAILS:
{context}

Respond ONLY with valid JSON (no markdown, no code fences) in this exact structure:
{{
  "overview": "800-word holistic life overview reading the entire chart",
  "personality": "600-word synthesis of Sun, Moon, Rising and their interactions",
  "career": "500-word analysis of 10th house, MC, Saturn, Mercury, career indicators",
  "love": "500-word analysis of 7th house, Venus, Moon aspects, relationship patterns",
  "wealth": "400-word analysis of 2nd and 8th houses, Jupiter, Venus, wealth patterns",
  "health": "400-word analysis of 6th house, Mars, Saturn, Ascendant ruler",
  "spirituality": "400-word analysis of 12th house, Ketu, Jupiter, spiritual indicators",
  "challenges": "500-word analysis of hard aspects, squares, oppositions, growth edges",
  "nakshatra": "400-word deep dive into the Moon nakshatra and its pada significance"
}}

For each section, reference SPECIFIC placements from the chart data above. Do not write generic templates — write about THIS person's actual chart."""

    raw = await call_gemini(prompt, max_tokens=8192, temperature=0.5)
    text = raw.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [ln for ln in lines if not ln.startswith("```")]
        text = "\n".join(lines)

    try:
        sections = json.loads(text)
    except json.JSONDecodeError:
        sections = {"overview": raw}

    reading = {
        "sections": sections,
        "dasha": dasha_data,
    }

    _save_cache(chart_id, lang, reading)
    return {"status": "generated", "reading": reading}
```

- [ ] **Step 2: Register the router in `main.py`**

In `apps/api/app/main.py`, add to the imports (line 6):

```python
from app.api.routes import charts, ai, readings, reading_v2
```

Add after line 34 (the readings router registration):

```python
app.include_router(reading_v2.router, prefix="/api")
```

- [ ] **Step 3: Verify syntax**

```bash
cd apps/api && python3 -c "import ast; ast.parse(open('app/api/routes/reading_v2.py').read()); print('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add apps/api/app/api/routes/reading_v2.py apps/api/app/main.py
git commit -m "feat: add unified reading endpoint with AI generation + caching"
```

---

## Task 6: PDF Generator Service

**Files:**
- Create: `apps/api/app/services/pdf_generator.py`
- Modify: `apps/api/requirements.txt` (add weasyprint)

**Interfaces:**
- Produces: `generate_reading_pdf(reading: dict, chart: dict, language: str) -> bytes`

- [ ] **Step 1: Add weasyprint to requirements**

Add to `apps/api/requirements.txt`:

```
weasyprint>=62.0
```

- [ ] **Step 2: Create the PDF generator**

Create `apps/api/app/services/pdf_generator.py`:

```python
import html
from datetime import datetime


def _esc(text: str) -> str:
    return html.escape(str(text)) if text else ""


def generate_reading_pdf(reading: dict, chart: dict, language: str = "ml") -> bytes:
    """Generate a styled PDF report from the reading data."""
    sections = reading.get("sections", {})
    subject = chart.get("subject", {})
    planets = chart.get("planets", [])
    houses = chart.get("houses", [])
    aspects = chart.get("aspects", [])
    dasha_data = reading.get("dasha", {})

    font_family = "'Noto Sans Malayalam', 'Noto Sans', sans-serif" if language == "ml" else "'Noto Sans', sans-serif"

    # Cover + tables
    html_parts = [f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@page {{ size: A4; margin: 2cm; }}
body {{ font-family: {font_family}; font-size: 11pt; line-height: 1.6; color: #1a1a1a; }}
h1 {{ font-size: 22pt; color: #6d28d9; text-align: center; margin-top: 40px; }}
h2 {{ font-size: 15pt; color: #6d28d9; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 24px; }}
h3 {{ font-size: 12pt; color: #4c1d95; }}
table {{ width: 100%; border-collapse: collapse; margin: 12px 0; }}
th, td {{ border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; font-size: 10pt; }}
th {{ background: #f3f4f6; }}
.current {{ background: #fef3c7; font-weight: bold; }}
.section {{ white-space: pre-wrap; margin: 10px 0 20px; }}
</style></head><body>
"""]

    # Cover
    html_parts.append(f"""
<h1>{_esc(subject.get('name', 'Birth Chart'))} - Astrology Report</h1>
<p style="text-align:center; color:#6b7280;">
  {_esc(subject.get('date', ''))} | {_esc(subject.get('time', 'Unknown'))}<br>
  {_esc(str(subject.get('latitude', '')))}, {_esc(str(subject.get('longitude', '')))}
</p>
""")

    # Planet positions table
    if planets:
        html_parts.append("<h2>Planetary Positions</h2><table><tr><th>Planet</th><th>Sign</th><th>Degree</th><th>House</th><th>Nakshatra</th></tr>")
        for p in planets:
            html_parts.append(
                f"<tr><td>{_esc(p.get('name', ''))}</td><td>{_esc(p.get('sign', ''))}</td>"
                f"<td>{p.get('degree_in_sign', 0):.2f}°</td><td>{p.get('house', '?')}</td>"
                f"<td>{_esc(p.get('nakshatra', '—'))}</td></tr>"
            )
        html_parts.append("</table>")

    # Dasha timeline
    mahadashas = dasha_data.get("mahadashas", [])
    current_md = dasha_data.get("current_mahadasha")
    current_ad = dasha_data.get("current_antardasha")
    if mahadashas:
        html_parts.append("<h2>Vimshottari Dasha Timeline</h2><table><tr><th>Mahadasha</th><th>Start</th><th>End</th><th>Current Antardasha</th></tr>")
        for md in mahadashas:
            cls = ' class="current"' if md.get("planet") == current_md else ""
            ad_name = current_ad if md.get("planet") == current_md else ""
            html_parts.append(
                f"<tr{cls}><td>{_esc(md.get('planet', ''))}</td>"
                f"<td>{_esc(md.get('start_date', ''))}</td>"
                f"<td>{_esc(md.get('end_date', ''))}</td>"
                f"<td>{_esc(ad_name)}</td></tr>"
            )
        html_parts.append("</table>")

    # Reading sections
    section_titles = {
        "overview": "Life Overview",
        "personality": "Personality & Core Identity",
        "career": "Career & Purpose",
        "love": "Love & Relationships",
        "wealth": "Money & Wealth",
        "health": "Health & Wellbeing",
        "spirituality": "Spirituality",
        "challenges": "Challenges & Growth",
        "nakshatra": "Nakshatra Profile",
    }
    for key, title in section_titles.items():
        content = sections.get(key)
        if content:
            html_parts.append(f"<h2>{_esc(title)}</h2><div class='section'>{_esc(content)}</div>")

    # Disclaimer
    html_parts.append("<p style='font-size:9pt; color:#9ca3af; margin-top:40px; border-top:1px solid #e5e7eb; padding-top:10px;'>This report is for entertainment and reflection only. It is not a substitute for professional medical, legal, or financial advice.</p>")

    html_parts.append("</body></html>")

    html_str = "\n".join(html_parts)

    from weasyprint import HTML
    pdf_bytes = HTML(string=html_str).write_pdf()
    return pdf_bytes
```

- [ ] **Step 3: Add PDF endpoint to `reading_v2.py`**

Add this endpoint to `apps/api/app/api/routes/reading_v2.py` (at the bottom, before the last line):

```python
from fastapi.responses import Response


@router.get("/reading/{chart_id}/pdf")
async def get_reading_pdf(chart_id: str, lang: str = "ml", user_id: str = Depends(get_current_user_id)):
    cached = _get_cached(chart_id, lang)
    if not cached:
        raise HTTPException(status_code=404, detail="Reading not generated yet. POST /reading/{id}/generate first.")

    chart = _fetch_chart(chart_id, user_id)
    from app.services.pdf_generator import generate_reading_pdf
    pdf_bytes = generate_reading_pdf(cached, chart, lang)
    return Response(content=pdf_bytes, media_type="application/pdf",
                    headers={"Content-Disposition": f"attachment; filename=reading-{chart_id}.pdf"})
```

- [ ] **Step 4: Add nixpacks.toml for weasyprint system dependencies**

WeasyPrint needs `libpango`, `libcairo`, `libgdk-pixbuf-2.0-0`, and Malayalam font support. Create `apps/api/nixpacks.toml`:

```toml
[phases.setup]
aptPkgs = [
  "libpango-1.0-0",
  "libpangocairo-1.0-0",
  "libcairo2",
  "libgdk-pixbuf2.0-0",
  "libffi-dev",
  "fonts-noto",
  "fonts-noto-extra",
]
```

- [ ] **Step 5: Verify syntax**

```bash
cd apps/api && python3 -c "import ast; ast.parse(open('app/services/pdf_generator.py').read()); ast.parse(open('app/api/routes/reading_v2.py').read()); print('OK')"
```

Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add apps/api/app/services/pdf_generator.py apps/api/app/api/routes/reading_v2.py apps/api/requirements.txt apps/api/nixpacks.toml
git commit -m "feat: add PDF report generation with weasyprint"
```

---

## Task 7: Frontend Proxy for Reading V2

**Files:**
- Create: `apps/web/src/app/api/reading-v2/route.ts`
- Create: `apps/web/src/app/api/reading-v2/[chart_id]/generate/route.ts`
- Create: `apps/web/src/app/api/reading-v2/[chart_id]/pdf/route.ts`

**Interfaces:**
- Produces: Three Next.js route handlers that proxy to the backend `reading_v2` endpoints with the user's Bearer token

- [ ] **Step 1: Create the GET proxy (fetch cached reading)**

Create `apps/web/src/app/api/reading-v2/[chart_id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://astrology-api-production-813b.up.railway.app';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chart_id: string }> },
) {
  const { chart_id } = await params;
  const auth = request.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const lang = request.nextUrl.searchParams.get('lang') || 'ml';
  const res = await fetch(`${BACKEND}/api/v1/reading/${chart_id}?lang=${lang}`, {
    headers: { Authorization: auth },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

- [ ] **Step 2: Create the POST generate proxy**

Create `apps/web/src/app/api/reading-v2/[chart_id]/generate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://astrology-api-production-813b.up.railway.app';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chart_id: string }> },
) {
  const { chart_id } = await params;
  const auth = request.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const res = await fetch(`${BACKEND}/api/v1/reading/${chart_id}/generate`, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

- [ ] **Step 3: Create the PDF proxy**

Create `apps/web/src/app/api/reading-v2/[chart_id]/pdf/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://astrology-api-production-813b.up.railway.app';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chart_id: string }> },
) {
  const { chart_id } = await params;
  const auth = request.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const lang = request.nextUrl.searchParams.get('lang') || 'ml';
  const res = await fetch(`${BACKEND}/api/v1/reading/${chart_id}/pdf?lang=${lang}`, {
    headers: { Authorization: auth },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'PDF generation failed' }, { status: res.status });
  }

  const pdfBuffer = await res.arrayBuffer();
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reading-${chart_id}.pdf"`,
    },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/api/reading-v2/
git commit -m "feat: add frontend proxies for reading-v2 endpoints"
```

---

## Task 8: Rewrite Reading Page

**Files:**
- Modify: `apps/web/src/app/chart/[chart_id]/read/page.tsx` (full rewrite, 274 lines → ~400 lines)

**Interfaces:**
- Consumes: `/api/reading-v2/[chart_id]?lang=ml` (GET cached), `/api/reading-v2/[chart_id]/generate` (POST), `/api/reading-v2/[chart_id]/pdf?lang=ml` (GET PDF)
- Produces: Reading page with language toggle, AI-generated content, rebuilt Dasha timeline, PDF download button

- [ ] **Step 1: Rewrite the reading page**

Replace the ENTIRE contents of `apps/web/src/app/chart/[chart_id]/read/page.tsx` with:

```tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { Moon, Star, Sparkles, Calendar, Clock, ArrowLeft, Loader2, ChevronDown, ChevronRight, FileDown, Globe } from 'lucide-react';
import { cn, getSignEmoji, getPlanetEmoji } from '@/lib/utils';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

type ReadingData = {
  sections: Record<string, string>;
  dasha: {
    birth_nakshatra: string;
    nakshatra_pada: number;
    starting_lord: string;
    current_mahadasha: string | null;
    current_antardasha: string | null;
    current_period: {
      mahadasha: string;
      mahadasha_end: string;
      mahadasha_remaining: string;
      antardasha: string;
      antardasha_end: string;
      antardasha_remaining: string;
    } | null;
    mahadashas: Array<{
      planet: string;
      start_date: string;
      end_date: string;
      antardashas: Array<{
        planet: string;
        start_date: string;
        end_date: string;
      }>;
    }>;
  } | null;
};

const SECTION_META: Record<string, { title: string; icon: any }> = {
  overview: { title: 'Life Overview', icon: Sparkles },
  personality: { title: 'Personality & Identity', icon: Star },
  career: { title: 'Career & Purpose', icon: Sparkles },
  love: { title: 'Love & Relationships', icon: Moon },
  wealth: { title: 'Money & Wealth', icon: Sparkles },
  health: { title: 'Health & Wellbeing', icon: Moon },
  spirituality: { title: 'Spirituality', icon: Star },
  challenges: { title: 'Challenges & Growth', icon: Sparkles },
  nakshatra: { title: 'Nakshatra Profile', icon: Star },
};

export default function ReadingPage() {
  const router = useRouter();
  const params = useParams();
  const chartId = params.chart_id as string;
  const { session, loading: authLoading } = useAuth();

  const [chart, setChart] = useState<any>(null);
  const [reading, setReading] = useState<ReadingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [language, setLanguage] = useState<'ml' | 'en'>('ml');
  const [activeTab, setActiveTab] = useState('full');
  const [expandedDasha, setExpandedDasha] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  });

  const fetchReading = useCallback(async (lang: 'ml' | 'en') => {
    const res = await fetch(`/api/reading-v2/${chartId}?lang=${lang}`, { headers: authHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'cached' && data.reading) return data.reading as ReadingData;
    return null;
  }, [chartId, session]);

  const generateReading = useCallback(async (lang: 'ml' | 'en') => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/reading-v2/${chartId}/generate`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ language: lang }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      if (data.reading) setReading(data.reading as ReadingData);
    } catch (e) {
      console.error('Generation error:', e);
    } finally {
      setGenerating(false);
    }
  }, [chartId, session]);

  useEffect(() => {
    if (authLoading) return;
    if (!session) { router.push('/auth/login'); return; }

    (async () => {
      setLoading(true);
      // Fetch chart data
      try {
        const chartRes = await fetch(`/api/charts/${chartId}`, { headers: authHeaders() });
        if (chartRes.ok) setChart(await chartRes.json());
      } catch {}

      // Fetch cached reading
      const cached = await fetchReading(language);
      if (!cached) {
        await generateReading(language);
      } else {
        setReading(cached);
      }
      setLoading(false);
    })();
  }, [chartId, session, authLoading, router]);

  const switchLanguage = async (lang: 'ml' | 'en') => {
    setLanguage(lang);
    const cached = await fetchReading(lang);
    if (cached) {
      setReading(cached);
    } else {
      setReading(null);
      await generateReading(lang);
    }
  };

  const downloadPdf = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch(`/api/reading-v2/${chartId}/pdf?lang=${language}`, { headers: authHeaders() });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `astrology-report-${chartId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  const sections = reading?.sections || {};
  const dasha = reading?.dasha;
  const currentPeriod = dasha?.current_period;
  const planets = chart?.planets || [];

  const tabs = [
    { id: 'full', label: language === 'ml' ? 'പൂർണ്ണ വായന' : 'Full Reading', icon: Sparkles },
    { id: 'dasha', label: language === 'ml' ? 'ദശാ കാലം' : 'Dasha Timeline', icon: Clock },
    { id: 'planets', label: language === 'ml' ? 'ഗ്രഹങ്ങൾ' : 'Planets', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DisclaimerBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2">
              <ArrowLeft className="h-4 w-4" /> {language === 'ml' ? 'തിരികെ' : 'Back'}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {chart?.subject?.name || (language === 'ml' ? 'നിങ്ങളുടെ വായന' : 'Your Reading')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {chart?.subject?.date} {chart?.subject?.time && chart?.subject.time !== '12:00' ? `at ${chart.subject.time.slice(0, 5)}` : ''}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => switchLanguage('ml')}
                className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5',
                  language === 'ml' ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-gray-500')}
              >
                <Globe className="h-3.5 w-3.5" /> മലയാളം
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  language === 'en' ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-gray-500')}
              >
                English
              </button>
            </div>

            {/* PDF download */}
            <button
              onClick={downloadPdf}
              disabled={pdfLoading || !reading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              {language === 'ml' ? 'PDF ഡൗൺലോഡ്' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Generating state */}
        {generating && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'ml' ? 'നിങ്ങളുടെ വായന തയ്യാറാക്കുന്നു...' : 'Generating your personalized reading...'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {language === 'ml' ? '~20 സെക്കൻഡ് എടുക്കും' : 'This takes ~20 seconds'}
            </p>
          </div>
        )}

        {!generating && reading && (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    activeTab === tab.id ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800')}>
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Full Reading Tab */}
            {activeTab === 'full' && (
              <div className="space-y-4">
                {Object.entries(SECTION_META).map(([key, meta]) => {
                  const content = sections[key];
                  if (!content) return null;
                  const Icon = meta.icon;
                  return (
                    <div key={key} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                      <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                          <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{meta.title}</h3>
                      </div>
                      <div className="p-5">
                        <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dasha Timeline Tab */}
            {activeTab === 'dasha' && dasha && (
              <div className="space-y-4">
                {/* Current Period Card */}
                {currentPeriod && (
                  <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        {language === 'ml' ? 'നിലവിൽ സജീവം' : 'ACTIVE NOW'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {currentPeriod.mahadasha} Mahadasha
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {currentPeriod.mahadasha_end വരെ • {currentPeriod.mahadasha_remaining} ശേഷിക്കുന്നു
                    </p>
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentPeriod.antardasha} Antardasha
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {currentPeriod.antardasha_end വരെ • {currentPeriod.antardasha_remaining} ശേഷിക്കുന്നു
                      </p>
                    </div>
                  </div>
                )}

                {/* All Mahadashas */}
                {dasha.mahadashas?.map((md) => {
                  const isExpanded = expandedDasha === md.planet;
                  const isCurrent = md.planet === dasha.current_mahadasha;
                  return (
                    <div key={md.planet} className={cn('bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden',
                      isCurrent ? 'border-primary-300 dark:border-primary-700' : 'border-gray-200 dark:border-gray-800')}>
                      <button
                        onClick={() => setExpandedDasha(isExpanded ? null : md.planet)}
                        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                        <span className="text-2xl">{getPlanetEmoji(md.planet)}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {md.planet} Mahadasha
                            {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">NOW</span>}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {md.start_date} → {md.end_date}
                          </p>
                        </div>
                      </button>
                      {isExpanded && md.antardashas && (
                        <div className="pl-16 pr-5 pb-5 space-y-2">
                          {md.antardashas.map((ad) => {
                            const isCurrentAd = isCurrent && ad.planet === dasha.current_antardasha;
                            return (
                              <div key={ad.planet} className={cn('flex items-center justify-between py-2 px-3 rounded-lg',
                                isCurrentAd ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-800/50')}>
                                <span className="flex items-center gap-2">
                                  <span>{getPlanetEmoji(ad.planet)}</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ad.planet} Antardasha</span>
                                  {isCurrentAd && <span className="text-xs text-green-600 font-medium">●</span>}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{ad.start_date} → {ad.end_date}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Planets Tab */}
            {activeTab === 'planets' && (
              <div className="space-y-4">
                {planets.map((p: any) => (
                  <div key={p.name} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{getPlanetEmoji(p.name)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{p.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{getSignEmoji(p.sign)}</span>
                          <span>{p.sign} {p.degree_in_sign?.toFixed(1)}°</span>
                          {p.house && <><span>•</span><span>House {p.house}</span></>}
                          {p.retrograde && <span className="text-orange-500">(R)</span>}
                        </div>
                      </div>
                    </div>
                    {p.nakshatra && (
                      <div className="text-xs text-gray-400 mb-3">
                        Nakshatra: {p.nakshatra} Pada {p.nakshatra_pada} (Lord: {p.nakshatra_lord})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/web && npx tsc --noEmit --pretty 2>&1 | head -30
```

Expected: No errors related to the reading page. (Some pre-existing errors in other files are acceptable.)

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/chart/[chart_id]/read/page.tsx
git commit -m "feat: rewrite reading page with AI readings, language toggle, dasha timeline, PDF"
```

---

## Task 9: Deploy & Verify

**Files:**
- Deploy backend to Railway (via git push auto-deploy)
- Deploy frontend to Vercel (via `vercel --prod`)
- Run schema migration (done in Task 1)

- [ ] **Step 1: Push to GitHub (triggers Railway backend auto-deploy)**

```bash
git push origin main
```

- [ ] **Step 2: Deploy frontend to Vercel**

```bash
cd apps/web && vercel --yes --prod
```

- [ ] **Step 3: Wait for Railway deploy to complete (~2 min)**

Check Railway health:

```bash
curl -s "https://astrology-api-production-813b.up.railway.app/health"
```

Expected: `{"status":"healthy","version":"0.1.0"}`

- [ ] **Step 4: Verify the new reading endpoint exists**

```bash
curl -s -o /dev/null -w "%{http_code}" "https://astrology-api-production-813b.up.railway.app/api/v1/reading/test?lang=ml"
```

Expected: `401` (Unauthorized — endpoint exists, needs auth)

- [ ] **Step 5: Verify the reading page loads**

```bash
curl -s -o /dev/null -w "%{http_code}" "https://astrology-web-tawny.vercel.app/chart/c35fa1e8-6ccb-0e75-9741-35f9fb982a44/read"
```

Expected: `200`

- [ ] **Step 6: Commit final state**

If any fixup commits were needed during deploy verification:

```bash
git add -A && git commit -m "fix: deploy adjustments" && git push origin main
```

---

## Summary of Changes

| # | Change | Files |
|---|--------|-------|
| 1 | DB schema: add `language` + `reading_data` columns | `supabase/schema.sql` |
| 2 | Unified AI service | `app/services/ai.py` |
| 3 | Fix Dasha UTC time | `app/services/dasha.py` |
| 4 | Rich chart context builder | `app/services/chart_context.py` |
| 5 | New reading endpoint (GET/POST/PDF) | `app/api/routes/reading_v2.py` |
| 6 | PDF generator | `app/services/pdf_generator.py` |
| 7 | Frontend proxies | `src/app/api/reading-v2/` |
| 8 | Rewrite reading page | `src/app/chart/[chart_id]/read/page.tsx` |
| 9 | Deploy & verify | — |
