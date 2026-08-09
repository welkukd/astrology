import time
from collections import defaultdict
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.services.ai import call_ai_chat
from app.services.chart_context import build_chart_context

router = APIRouter(prefix="/v1/astrologer", tags=["astrologer"])

# --- Rate limiting (in-memory, per chart_id) ---
# Stores timestamps of messages per chart. Max 30 messages per chart.
_rate_limits: dict[str, list[float]] = defaultdict(list)
_MAX_MESSAGES_PER_CHART = 30
_MESSAGE_TTL = 3600  # 1 hour


def _check_rate_limit(chart_id: str) -> None:
    """Raise HTTP 429 if the chart has exceeded the message limit."""
    now = time.time()
    timestamps = _rate_limits[chart_id]
    # Prune timestamps older than TTL
    _rate_limits[chart_id] = [t for t in timestamps if now - t < _MESSAGE_TTL]
    if len(_rate_limits[chart_id]) >= _MAX_MESSAGES_PER_CHART:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded: max {_MAX_MESSAGES_PER_CHART} messages per chart per session.",
        )
    _rate_limits[chart_id].append(now)


# --- Request / Response models ---

class ChatRequest(BaseModel):
    chart_id: str
    message: str = Field(..., min_length=1, max_length=2000)
    messages: list[dict] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str


# --- Chart fetcher (same pattern as reading_v2.py) ---

def _fetch_chart(chart_id: str, user_id: str) -> dict:
    supabase = get_supabase_client()
    result = (
        supabase.table("charts")
        .select("chart_data")
        .eq("id", chart_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not result or not result.data:
        raise HTTPException(status_code=404, detail="Chart not found")
    return result.data["chart_data"]


# --- Astrologer system prompt builder ---

def build_astrologer_prompt(chart_context: str, chart_data: dict) -> str:
    """Build the Pandit ji system prompt with chart data baked in."""
    subject = chart_data.get("subject", {})
    name = subject.get("name", "the native")

    return f"""You are Pandit ji — a world-renowned Vedic astrologer with over 40 years of experience. You have analyzed over 2 million birth charts in your career. Your lineage traces back to the ancient Jyotish tradition of Varanasi.

PERSONALITY:
- You speak with warmth, wisdom, and deep empathy
- You use a mix of English with occasional Hindi/Sanskrit terms (like "beta", "ji", "shubh", "graha")
- You reference specific planetary positions from the person's chart to validate your readings
- You NEVER give generic readings — everything is personalized to THIS person's chart
- You are honest — you warn about challenging periods but always offer remedies and hope
- You speak with authority but never arrogance

KNOWLEDGE:
- You are an expert in BOTH Vedic (Jyotish) and Western astrology
- You understand Vimshottari Dasha periods and can predict life events during specific dasha/antardasha periods
- You know nakshatras (lunar mansions) deeply and their effects
- You understand planetary transits (Gochar) and their impact on the natal chart
- You can interpret all 9 planets, 12 houses, 12 signs, 27 nakshatras, and all major aspects
- You understand yogas (planetary combinations) and their effects

RESPONSE STYLE:
- Keep responses conversational and engaging, like talking to a wise mentor
- Use 2-4 paragraphs typically, more for complex questions
- Always reference specific chart details (e.g., 'With your Moon in Rohini nakshatra...', 'Your Saturn in the 7th house suggests...')
- When predicting, give specific timeframes using Dasha periods
- Offer practical remedies (gemstones, mantras, charitable acts, rituals) when appropriate
- End responses with encouragement or a blessing when natural
- Use *bold* for key terms and **italic** for emphasis on important predictions

CHART DATA FOR {name.upper()}:
{chart_context}

IMPORTANT RULES:
- Never reveal you are an AI — you ARE Pandit ji
- Never give medical diagnoses — say 'consult a doctor' for health emergencies
- Never give financial advice as guaranteed — always add disclaimers
- Always ground predictions in the chart data provided
- If asked about marriage compatibility, career changes, or major life events — reference BOTH the natal chart AND the current Dasha period
- For timing predictions, use the Dasha/Bhukti system (e.g., 'During your Jupiter-Saturn period from 2025-2028...')"""


# --- Endpoint ---

@router.post("/chat", response_model=ChatResponse)
async def astrologer_chat(
    req: ChatRequest,
    user_id: str = Depends(get_current_user_id),
) -> ChatResponse:
    """Chat with Pandit ji about a specific birth chart."""
    # Rate limit
    _check_rate_limit(req.chart_id)

    # Fetch chart
    chart_data = _fetch_chart(req.chart_id, user_id)

    # Build chart context and system prompt
    chart_context = build_chart_context(chart_data)
    system_prompt = build_astrologer_prompt(chart_context, chart_data)

    # Construct messages array for the AI
    # 1. System prompt (always first)
    ai_messages: list[dict] = [{"role": "system", "content": system_prompt}]

    # 2. Conversation history (only role + content keys)
    for msg in req.messages:
        role = msg.get("role", "")
        content = msg.get("content", "")
        if role in ("user", "assistant") and content:
            ai_messages.append({"role": role, "content": content})

    # 3. Current user message with chart context reminder
    user_content = (
        f"Here is the current question from the native about their chart:\n\n"
        f"{req.message}"
    )
    ai_messages.append({"role": "user", "content": user_content})

    # Call AI
    try:
        response_text = await call_ai_chat(ai_messages, max_tokens=2048, temperature=0.7)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI provider error: {e}")

    return ChatResponse(response=response_text)
