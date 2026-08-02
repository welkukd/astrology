from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import httpx
import json

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.core.config import get_settings
from app.services.ai import call_gemini

settings = get_settings()
router = APIRouter(prefix="/v1", tags=["readings"])


class ChartIdRequest(BaseModel):
    chart_id: str


class YearlyRequest(BaseModel):
    chart_id: str
    year: int


class MonthlyRequest(BaseModel):
    chart_id: str
    year: int
    month: int


def _fetch_chart(chart_id: str, user_id: str) -> dict:
    supabase = get_supabase_client()
    result = supabase.table("charts").select("*") \
        .eq("id", chart_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Chart not found")
    return result.data["chart_data"]


def _get_transit_summary(chart: dict) -> str:
    try:
        from app.services.transits import get_transit_summary
        return get_transit_summary(chart)
    except Exception:
        return "Transit data unavailable."


def _get_dasha_summary(chart: dict) -> str:
    try:
        from app.services.dasha import get_dasha_summary
        return get_dasha_summary(chart)
    except Exception:
        return "Dasha data unavailable."


def _get_dasha_full(chart: dict) -> dict:
    try:
        from app.services.dasha import calculate_dasha
        return calculate_dasha(chart)
    except Exception:
        return {}


def _chart_summary(chart: dict) -> str:
    planets = chart.get("planets", [])
    houses = chart.get("houses", [])
    aspects = chart.get("aspects", [])
    subject = chart.get("subject", {})

    lines = [
        f"Name: {subject.get('name', 'Unknown')}",
        f"Date: {subject.get('date')} Time: {subject.get('time', 'Unknown')}",
        f"Location: {subject.get('latitude')}, {subject.get('longitude')}",
        f"Zodiac: {subject.get('zodiac', 'tropical')} Houses: {subject.get('house_system', 'Placidus')}",
        "",
        "Planetary Positions:",
    ]
    for p in planets:
        retro = " (R)" if p.get("retrograde") else ""
        lines.append(f"  {p['name']}: {p['sign']} {p.get('degree_in_sign', 0):.1f}° House {p.get('house', '?')}{retro}")

    lines.append("")
    lines.append("House Cusps:")
    for h in houses:
        lines.append(f"  House {h['number']}: {h['sign']} {h.get('degree_in_sign', 0):.1f}°")

    lines.append("")
    lines.append("Major Aspects:")
    for a in aspects:
        lines.append(f"  {a['planet1']} {a['aspect']} {a['planet2']} (orb {a.get('orb', 0):.1f}°)")

    return "\n".join(lines)


def _save_reading(chart_id: str, reading_type: str, content: str, context: dict = None):
    try:
        supabase = get_supabase_client()
        supabase.table("interpretations").upsert({
            "chart_id": chart_id,
            "type": reading_type,
            "context": context or {},
            "content": content,
            "model": "gemini-flash",
            "tokens_in": len(content) // 4,
            "tokens_out": len(content) // 4,
        }, on_conflict="chart_id,type,context").execute()
    except Exception:
        pass


def _get_cached_reading(chart_id: str, reading_type: str, context: dict = None) -> str | None:
    try:
        supabase = get_supabase_client()
        result = supabase.table("interpretations").select("content") \
            .eq("chart_id", chart_id).eq("type", reading_type).eq("context", context or {}).single().execute()
        return result.data["content"] if result.data else None
    except Exception:
        return None


# ── FULL NATAL READING ──────────────────────────────────────────────────

@router.post("/reading/full")
async def full_reading(data: ChartIdRequest, user_id: str = Depends(get_current_user_id)):
    chart = _fetch_chart(data.chart_id, user_id)
    chart_text = _chart_summary(chart)
    transit_text = _get_transit_summary(chart)
    dasha_text = _get_dasha_summary(chart)

    prompt = f"""You are an expert Vedic and Western astrologer. Provide a comprehensive natal chart reading.

Use language like "may indicate," "suggests," "invites reflection on." Be supportive and empowering.
Never predict death, illness, or specific events. Never give medical, legal, or financial advice.

{chart_text}

Current Transits:
{transit_text}

Current Dasha Period:
{dasha_text}

Provide a COMPLETE reading with these sections (use ### headings):

### Overview
A 2-3 sentence summary of the chart's overall theme.

### Personality & Core Identity
Who you are at your core. Sun, Moon, Rising sign analysis. 150-200 words.

### Career & Purpose
Career tendencies, professional strengths, life purpose indicators. 150-200 words.

### Love & Relationships
Relationship patterns, partnership style, what you need in love. 150-200 words.

### Money & Finances
Financial tendencies, earning style, wealth patterns. 100-150 words.

### Health & Wellbeing
General health tendencies, energy patterns, self-care suggestions. 100-150 words.

### Spirituality & Growth
Spiritual tendencies, karmic lessons, growth path. 100-150 words.

### Challenges & Lessons
Growth edges, challenges to work through, lessons the chart highlights. 100-150 words.

### Strengths & Talents
Natural gifts, special abilities, areas of excellence. 100-150 words.

### Current Life Chapter
What the current Dasha period means for you. 100-150 words.

### Active Transits
What current planetary transits are highlighting in your life. 100-150 words."""

    reading = await call_gemini(prompt)
    _save_reading(data.chart_id, "full_reading", reading)
    return {"type": "full_reading", "content": reading}


# ── YEARLY READING ──────────────────────────────────────────────────────

@router.post("/reading/yearly")
async def yearly_reading(data: YearlyRequest, user_id: str = Depends(get_current_user_id)):
    chart = _fetch_chart(data.chart_id, user_id)
    chart_text = _chart_summary(chart)
    transit_text = _get_transit_summary(chart)
    dasha_text = _get_dasha_summary(chart)

    prompt = f"""You are an expert Vedic and Western astrologer. Provide a detailed yearly horoscope prediction for {data.year}.

Use language like "may indicate," "suggests," "invites reflection on." Be supportive and empowering.
Never predict death, illness, or specific events. Never give medical, legal, or financial advice.

{chart_text}

Current Transits:
{transit_text}

Current Dasha Period:
{dasha_text}

Provide a COMPLETE yearly prediction with these sections (use ### headings):

### Overall Theme of {data.year}
The dominant energy and theme for the year. 100-150 words.

### Career & Work
Professional outlook, opportunities, challenges. 150-200 words.

### Love & Relationships
Romantic outlook, relationship dynamics, partnership themes. 150-200 words.

### Money & Finance
Financial outlook, earning potential, investment themes. 100-150 words.

### Health & Wellbeing
Health trends, energy levels, self-care focus areas. 100-150 words.

### Key Dates & Windows
Best months for career moves, relationships, finances. Approximate timing of important transits. 100-150 words.

### Advice for {data.year}
Practical guidance for navigating the year. 100-150 words."""

    reading = await call_gemini(prompt)
    _save_reading(data.chart_id, f"yearly_{data.year}", reading, {"year": data.year})
    return {"type": f"yearly_{data.year}", "content": reading}


# ── MONTHLY READING ─────────────────────────────────────────────────────

@router.post("/reading/monthly")
async def monthly_reading(data: MonthlyRequest, user_id: str = Depends(get_current_user_id)):
    chart = _fetch_chart(data.chart_id, user_id)
    chart_text = _chart_summary(chart)
    transit_text = _get_transit_summary(chart)
    dasha_text = _get_dasha_summary(chart)

    month_names = ["", "January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"]
    month_name = month_names[data.month]

    prompt = f"""You are an expert Vedic and Western astrologer. Provide a monthly horoscope for {month_name} {data.year}.

Use language like "may indicate," "suggests," "invites reflection on." Be supportive and empowering.
Never predict death, illness, or specific events. Never give medical, legal, or financial advice.

{chart_text}

Current Transits:
{transit_text}

Current Dasha Period:
{dasha_text}

Provide a COMPLETE monthly reading with these sections (use ### headings):

### {month_name} Theme
The dominant energy for the month. 50-100 words.

### Career
Professional outlook for the month. 50-100 words.

### Love
Romantic outlook for the month. 50-100 words.

### Money
Financial outlook for the month. 50-100 words.

### Health
Health trends for the month. 50-100 words.

### Best Dates
Best days/times for important actions. 50-100 words."""

    reading = await call_gemini(prompt)
    _save_reading(data.chart_id, f"monthly_{data.year}_{data.month}", reading, {"year": data.year, "month": data.month})
    return {"type": f"monthly_{data.year}_{data.month}", "content": reading}


# ── DASHA READING ───────────────────────────────────────────────────────

@router.post("/reading/dasha")
async def dasha_reading(data: ChartIdRequest, user_id: str = Depends(get_current_user_id)):
    chart = _fetch_chart(data.chart_id, user_id)
    dasha_data = _get_dasha_full(chart)
    chart_text = _chart_summary(chart)

    if not dasha_data or not dasha_data.get("mahadashas"):
        raise HTTPException(status_code=400, detail="Could not calculate Dasha periods")

    dasha_summary = _get_dasha_summary(chart)

    prompt = f"""You are an expert Vedic astrologer. Interpret the Vimshottari Dasha periods for this chart.

The Vimshottari Dasha system divides life into 120-year cycle of planetary periods.
Each Mahadasha (major period) is ruled by a planet and brings specific themes.

{chart_text}

Dasha Data:
{dasha_summary}

Birth Nakshatra: {dasha_data.get('birth_nakshatra', 'Unknown')} Pada {dasha_data.get('nakshatra_pada', '?')}
Starting Lord: {dasha_data.get('starting_lord', 'Unknown')}
Current Mahadasha: {dasha_data.get('current_mahadasha', 'Unknown')}
Current Antardasha: {dasha_data.get('current_antardasha', 'Unknown')}

Provide a COMPLETE Dasha interpretation with these sections (use ### headings):

### Life Chapters Overview
A summary of how the Dasha system shapes this person's life trajectory. 100-150 words.

### Current Period: {dasha_data.get('current_mahadasha', 'Unknown')} Mahadasha
What this major period brings. 150-200 words.

### Current Sub-Period: {dasha_data.get('current_antardasha', 'Unknown')} Antardasha
What this sub-period focuses on. 100-150 words.

### Key Transitions
Major Mahadasha changes coming up and what they mean. 100-150 words.

### Life Themes by Planet
Brief description of what each planet's Mahadasha brings:
- Ketu period
- Venus period
- Sun period
- Moon period
- Mars period
- Rahu period
- Jupiter period
- Saturn period
- Mercury period
(2-3 sentences each)

### Guidance
How to work with the current Dasha energy. 100-150 words."""

    reading = await call_gemini(prompt)
    _save_reading(data.chart_id, "dasha_reading", reading)
    return {"type": "dasha_reading", "content": reading, "dasha_data": dasha_data}


# ── TRANSITS READING ────────────────────────────────────────────────────

@router.post("/reading/transits")
async def transits_reading(data: ChartIdRequest, user_id: str = Depends(get_current_user_id)):
    chart = _fetch_chart(data.chart_id, user_id)
    chart_text = _chart_summary(chart)
    transit_text = _get_transit_summary(chart)

    prompt = f"""You are an expert Vedic and Western astrologer. Interpret the current planetary transits for this natal chart.

Transits show how current planetary positions interact with your birth chart.
They reveal what energies are active in your life right now.

{chart_text}

Current Transits:
{transit_text}

Provide a COMPLETE transit reading with these sections (use ### headings):

### Current Sky Overview
Summary of what's happening in the sky right now. 100-150 words.

### Major Transits Active
Detailed interpretation of each major transit (conjunction, square, opposition, trine). 200-300 words total.

### What to Expect
General themes and energies to be aware of. 100-150 words.

### Opportunities
Where to focus energy for growth. 100-150 words.

### Challenges
Areas that may need extra attention. 100-150 words.

### Timing
Key dates and windows for important transits in the coming months. 100-150 words.

### Advice
Practical guidance for working with current transit energies. 100-150 words."""

    reading = await call_gemini(prompt)
    _save_reading(data.chart_id, "transits_reading", reading)
    return {"type": "transits_reading", "content": reading}
