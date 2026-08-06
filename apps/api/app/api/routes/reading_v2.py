import json
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.services.ai import call_ai
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
    if not result or not result.data:
        raise HTTPException(status_code=404, detail="Chart not found")
    return result.data["chart_data"]


def _get_cached(chart_id: str, language: str) -> dict | None:
    supabase = get_supabase_client()
    result = supabase.table("interpretations").select("reading_data") \
        .eq("chart_id", chart_id).eq("type", "full_v2") \
        .eq("language", language).maybe_single().execute()
    if result and result.data and result.data.get("reading_data"):
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
    _fetch_chart(chart_id, user_id)
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

    raw = await call_ai(prompt, max_tokens=8192, temperature=0.5)
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
