import json
import re
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from pydantic import BaseModel

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.services.ai import call_ai
from app.services.chart_context import build_chart_context
from app.services.dasha import calculate_dasha

router = APIRouter(prefix="/v1", tags=["reading-v2"])


class GenerateRequest(BaseModel):
    language: str = "ml"  # "ml" or "en"
    force: bool = False   # True = skip cache, regenerate


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
async def get_reading(chart_id: str, lang: str = "ml", force: bool = False, user_id: str = Depends(get_current_user_id)):
    _fetch_chart(chart_id, user_id)
    if not force:
        cached = _get_cached(chart_id, lang)
        if cached:
            return {"status": "cached", "reading": cached}
    return {"status": "not_generated"}


@router.post("/reading/{chart_id}/generate")
async def generate_reading(chart_id: str, req: GenerateRequest, user_id: str = Depends(get_current_user_id)):
    lang = req.language if req.language in ("ml", "en") else "ml"
    lang_inst = LANGUAGE_INSTRUCTION[lang]

    # Check cache first (unless force=true)
    if not req.force:
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

    prompt = f"""You are a professional Vedic astrologer. Analyze this birth chart and provide a comprehensive reading.

{context}

{lang_inst}

Write your response as a JSON object with these keys (ALL values must be strings):
{{
  "overview": "800-word comprehensive life overview",
  "personality": "500-word personality analysis",
  "career": "500-word career analysis",
  "love": "500-word love/relationship analysis",
  "wealth": "400-word wealth analysis",
  "health": "400-word health analysis",
  "spirituality": "400-word spirituality analysis",
  "challenges": "500-word challenges and growth areas",
  "nakshatra": "400-word Moon nakshatra analysis"
}}

Return ONLY valid JSON. No markdown, no code fences, no extra text."""

    raw = await call_ai(prompt, max_tokens=8192, temperature=0.5)
    if not raw:
        raise HTTPException(status_code=502, detail="AI returned empty response")
    text = raw.strip()

    # Robust JSON extraction: strip markdown fences, find first { ... } block
    cleaned = re.sub(r'```(?:json)?\s*\n?', '', text)
    cleaned = re.sub(r'\n?```\s*$', '', cleaned)
    cleaned = cleaned.strip()

    try:
        sections = json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r'\{[\s\S]*\}', cleaned)
        if match:
            try:
                sections = json.loads(match.group())
            except json.JSONDecodeError:
                sections = {"overview": raw}
        else:
            sections = {"overview": raw}

    # Fix double-encoded JSON: reasoning models sometimes wrap the entire
    # JSON response as a string inside {"overview": "<json_string>"}
    # The inner string may also have markdown code fences or escaped characters
    if isinstance(sections, dict):
        keys = list(sections.keys())
        if len(keys) == 1 and keys[0] == "overview" and isinstance(sections["overview"], str):
            inner = sections["overview"].strip()
            # Strip markdown code fences from the inner string
            inner = re.sub(r'^```(?:json)?\s*\n?', '', inner)
            inner = re.sub(r'\n?```\s*$', '', inner)
            inner = inner.strip()
            if inner.startswith("{"):
                try:
                    sections = json.loads(inner)
                except json.JSONDecodeError:
                    pass
        # Also fix: if multiple keys exist but values are JSON strings containing
        # the full response (e.g. {"overview": "{\"overview\":...}"})
        elif len(keys) > 1:
            first_val = sections.get(list(sections.keys())[0])
            if isinstance(first_val, str) and first_val.strip().startswith(("{", "```")):
                inner = first_val.strip()
                inner = re.sub(r'^```(?:json)?\s*\n?', '', inner)
                inner = re.sub(r'\n?```\s*$', '', inner)
                inner = inner.strip()
                if inner.startswith("{"):
                    try:
                        parsed = json.loads(inner)
                        if isinstance(parsed, dict) and len(parsed) > len(sections):
                            sections = parsed
                    except json.JSONDecodeError:
                        pass

    # Unescape escaped characters in section values (from reasoning model double-encoding)
    # The AI returns \\n, \\\" etc as literal characters that need to be converted
    if isinstance(sections, dict):
        for key in sections:
            val = sections[key]
            if isinstance(val, str):
                # Unescape common JSON string escapes without destroying non-ASCII
                val = val.replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"').replace('\\/', '/')
                sections[key] = val

    reading = {
        "sections": sections,
        "dasha": dasha_data,
    }

    _save_cache(chart_id, lang, reading)
    return {"status": "generated", "reading": reading}


@router.get("/reading/{chart_id}/pdf")
async def get_reading_pdf(chart_id: str, lang: str = "ml", user_id: str = Depends(get_current_user_id)):
    cached = _get_cached(chart_id, lang)
    if not cached:
        raise HTTPException(status_code=404, detail="Reading not generated yet")

    chart_data = None
    try:
        chart_data = _fetch_chart(chart_id, user_id)
    except Exception:
        pass

    # Try to generate a real PDF using weasyprint
    try:
        from app.services.pdf_generator import generate_reading_pdf
        pdf_bytes = generate_reading_pdf(cached, chart_data or {}, lang)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="astrology-report-{chart_id}.pdf"'},
        )
    except Exception:
        pass

    # Fallback: return styled HTML if PDF generation fails
    sections = cached.get("sections", {})

    html_parts = ["<html><head><style>body{font-family:Georgia,serif;max-width:800px;margin:0 auto;padding:40px;line-height:1.8;color:#333}h1{color:#2d1b69;border-bottom:2px solid #6c3baf;padding-bottom:10px}h2{color:#6c3baf;margin-top:30px}p{margin:15px 0;text-align:justify}</style></head><body>"]

    name = "Your"
    if chart_data and isinstance(chart_data, dict):
        name = chart_data.get("subject", {}).get("name", "Your")

    html_parts.append(f"<h1>{name} Birth Chart Reading</h1>")

    section_titles = {
        "overview": "Life Overview",
        "personality": "Personality",
        "career": "Career & Purpose",
        "love": "Love & Relationships",
        "wealth": "Wealth & Finance",
        "health": "Health & Wellbeing",
        "spirituality": "Spirituality",
        "challenges": "Challenges & Growth",
        "nakshatra": "Nakshatra Analysis",
    }

    for key, title in section_titles.items():
        content = sections.get(key, "")
        if content:
            html_parts.append(f"<h2>{title}</h2>")
            paragraphs = content.split("\n\n") if "\n\n" in content else [content]
            for p in paragraphs:
                p = p.strip()
                if p:
                    html_parts.append(f"<p>{p}</p>")

    html_parts.append("<hr><p><em>This reading is for entertainment and reflection only. AI-generated interpretations of astronomical data.</em></p>")
    html_parts.append("</body></html>")

    html = "\n".join(html_parts)

    return Response(
        content=html,
        media_type="text/html",
        headers={"Content-Disposition": f'inline; filename="astrology-report-{chart_id}.html"'},
    )
