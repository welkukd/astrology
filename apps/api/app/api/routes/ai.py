from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.core.config import get_settings
from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.services.ai import call_ai

settings = get_settings()
router = APIRouter(prefix="/v1", tags=["ai"])


class InterpretationRequest(BaseModel):
    chart_id: str
    type: str
    context: Optional[dict] = None


INTERPRETATION_PROMPTS = {
    "overview": """You are an AI astrology assistant. Interpret this natal chart as an overview.
Focus on Sun/Moon/Rising signs, dominant elements, key configurations.
Use language like "may indicate," "suggests," "invites reflection on."
Be supportive and non-deterministic. Never predict death, illness, or specific events.
Never give medical, legal, or financial advice. Keep it under 300 words.
Chart data: {chart_json}""",

    "planet": """You are an AI astrology assistant. Interpret {planet} in {sign} in the {house} house.
Include core meaning, strengths, challenges, how it expresses in this house.
Use language like "may indicate," "suggests." 150-200 words.
Chart context: {chart_context}""",

    "aspect": """You are an AI astrology assistant. Interpret {p1} {aspect} {p2} with {orb}° orb.
Explain the dynamic, growth opportunity, potential tension. Avoid fatalistic language. 100-150 words.
Chart context: {chart_context}""",

    "transit": """You are an AI astrology assistant. Interpret this transit:
Transiting {planet} is {aspect} natal {natal_planet} (orb {orb}°).
Explain what this transit typically signifies and how to work with it. 100-150 words.
Chart context: {chart_context}""",

    "synastry": """You are an AI astrology assistant. Interpret these synastry aspects.
Highlight strongest connections and potential challenges. 200-250 words.
Chart context: {chart_context}""",

    "question": """You are an AI astrology assistant. Answer this question about the natal chart.
Use language like "may indicate," "suggests." Never predict specific events. 200-300 words.
Question: {question}
Chart data: {chart_json}""",
}


@router.post("/interpret")
async def interpret(data: InterpretationRequest, user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase_client()
    result = supabase.table("charts").select("*") \
        .eq("id", data.chart_id).eq("user_id", user_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")

    chart = result.data["chart_data"]
    prompt = build_prompt(data.type, chart, data.context or {})
    interpretation_text = await call_ai(prompt)

    supabase.table("interpretations").upsert({
        "chart_id": data.chart_id,
        "type": data.type,
        "context": data.context,
        "content": interpretation_text,
        "model": settings.AI_PROVIDER,
        "tokens_in": len(prompt) // 4,
        "tokens_out": len(interpretation_text) // 4,
        "language": "en",
    }, on_conflict="chart_id,type,language").execute()

    return {"type": data.type, "content": interpretation_text}


def build_prompt(itype: str, chart: dict, context: dict) -> str:
    chart_json = {
        "planets": chart.get("planets", []),
        "houses": chart.get("houses", []),
        "aspects": chart.get("aspects", []),
        "sun_sign": next((p["sign"] for p in chart.get("planets", []) if p["name"] == "Sun"), ""),
        "moon_sign": next((p["sign"] for p in chart.get("planets", []) if p["name"] == "Moon"), ""),
        "rising_sign": chart.get("houses", [{}])[0].get("sign", ""),
    }

    template = INTERPRETATION_PROMPTS.get(itype, INTERPRETATION_PROMPTS["question"])

    replacements = {
        "{chart_json}": str(chart_json),
        "{chart_context}": str(chart_json),
        "{planet}": context.get("planet", ""),
        "{sign}": context.get("sign", ""),
        "{house}": context.get("house", ""),
        "{p1}": context.get("p1", ""),
        "{p2}": context.get("p2", ""),
        "{aspect}": context.get("aspect", ""),
        "{orb}": str(context.get("orb", "")),
        "{natal_planet}": context.get("natal_planet", ""),
        "{question}": context.get("question", ""),
    }

    for k, v in replacements.items():
        template = template.replace(k, v)

    return template
