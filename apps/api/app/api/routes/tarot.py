import hashlib
import time
from datetime import date, datetime
from typing import Any, Dict, List, Optional, cast

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from uuid import UUID

from app.core.config import get_settings
from app.core.database import get_supabase_client
from app.core.security import get_current_user_id
from app.schemas.tarot import (
    CardPosition,
    SpreadConfiguration,
    SpreadType,
    TarotCardReference,
    TarotDailyDrawCreate,
    TarotDailyDrawResponse,
    TarotJournalEntryCreate,
    TarotJournalEntryResponse,
    TarotReadingCreate,
    TarotReadingResponse,
    TarotReadingSummary,
)
from app.services.ai import call_ai_json
from app.services.tarot import (
    CARD_METADATA,
    SPREADS,
    compute_spread_hash,
    generate_interpretation,
    get_all_spreads,
    get_deck_metadata,
    get_daily_card,
    get_spread,
    perform_reading,
)

# Type alias for Supabase response
SupabaseResult = Dict[str, Any]

router = APIRouter(prefix="/v1/tarot", tags=["tarot"])

settings = get_settings()

# Rate limiting (in-memory, per user)
_rate_limits: Dict[str, List[float]] = {}
_MAX_REQUESTS = settings.RATE_LIMIT_REQUESTS  # 60
_WINDOW_SECONDS = settings.RATE_LIMIT_WINDOW  # 60


def _check_rate_limit(user_id: str) -> None:
    """Raise HTTP 429 if user has exceeded rate limit."""
    now = time.time()
    timestamps = _rate_limits.get(user_id, [])
    # Prune timestamps older than window
    _rate_limits[user_id] = [t for t in timestamps if now - t < _WINDOW_SECONDS]
    if len(_rate_limits[user_id]) >= _MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded: max {_MAX_REQUESTS} requests per minute.",
        )
    _rate_limits[user_id].append(now)


class TarotReadingRequest(BaseModel):
    spread_type: SpreadType = Field(default=SpreadType.THREE_CARD)
    question: Optional[str] = Field(None, max_length=1000)
    seed: Optional[int] = Field(None, description="Optional seed for deterministic draws")
    language: str = Field(default="en", pattern=r"^[a-z]{2}$")


class TarotReadingGenerateResponse(BaseModel):
    reading_id: UUID
    spread_type: SpreadType
    cards_drawn: List[CardPosition]
    interpretation: Dict[str, Any]


@router.post("/reading", response_model=TarotReadingGenerateResponse)
async def create_tarot_reading(
    request: TarotReadingRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Generate a new tarot reading.
    Returns reading_id, spread_type, cards_drawn[], and AI interpretation.
    """
    _check_rate_limit(user_id)

    spread_name = request.spread_type.value
    spread = get_spread(spread_name)

    try:
        # Perform the reading (draw cards)
        reading = perform_reading(
            spread_name=spread_name,
            question=request.question,
            seed=request.seed,
        )

        cards = reading["cards"]
        spread_hash = reading["spread_hash"]

        # Check cache for interpretation
        supabase = get_supabase_client()
        cached_result = supabase.table("tarot_readings").select("interpretation, reading_data").eq("user_id", user_id).eq("spread_type", spread_name).execute()

        # Look for matching spread_hash in recent readings
        cached_interpretation = None
        cached_data = cached_result.data or []
        for r in cached_data:
            if isinstance(r, dict):
                r_data = r.get("reading_data")
                if isinstance(r_data, dict) and r_data.get("spread_hash") == spread_hash:
                    cached_interpretation = r.get("interpretation")
                    break

        # Generate AI interpretation
        interpretation = await generate_interpretation(
            spread_name=spread_name,
            question=request.question,
            cards=cards,
            language=request.language,
        )

        # Prepare cards_drawn for storage and response
        cards_drawn = []
        for i, card in enumerate(cards):
            meta = CARD_METADATA.get(card["card"], {})
            cards_drawn.append(
                CardPosition(
                    position=i + 1,
                    position_name=card.get("position", f"Position {i+1}"),
                    card_id=meta.get("card_id", ""),
                    name=card["card"],
                    suit=meta.get("suit"),
                    number=meta.get("number"),
                    arcana=meta.get("arcana", "major"),
                    upright=card["orientation"] == "Upright",
                    image_url=None,
                    keywords=meta.get("keywords", []),
                    meaning_upright=meta.get("meaning_upright"),
                    meaning_reversed=meta.get("meaning_reversed"),
                )
            )

        # Save to Supabase
        reading_data = {
            "spread_key": spread_name,
            "spread_hash": spread_hash,
            "seed": request.seed,
            "timestamp": reading["timestamp"],
        }

        insert_data = {
            "user_id": user_id,
            "spread_type": spread_name,
            "question": request.question,
            "cards_drawn": [c.model_dump() for c in cards_drawn],
            "interpretation": interpretation,
            "reading_data": reading_data,
            "model": settings.AI_PROVIDER or "gemini",
            "language": request.language,
        }

        result = supabase.table("tarot_readings").insert(insert_data).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save reading")

        saved_reading = result.data[0]
        reading_id = UUID(saved_reading["id"])

        return TarotReadingGenerateResponse(
            reading_id=reading_id,
            spread_type=request.spread_type,
            cards_drawn=cards_drawn,
            interpretation=interpretation,
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the tarot reading: {str(e)}",
        )


@router.get("/reading/{reading_id}", response_model=TarotReadingResponse)
async def get_tarot_reading(
    reading_id: UUID,
    user_id: str = Depends(get_current_user_id),
):
    """Fetch a saved tarot reading by ID."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()
    result = supabase.table("tarot_readings").select("*").eq("id", str(reading_id)).eq("user_id", user_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reading not found")

    data = result.data
    # Convert cards_drawn to CardPosition models
    cards_drawn = [CardPosition(**c) for c in data.get("cards_drawn", [])]

    return TarotReadingResponse(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        spread_type=SpreadType(data["spread_type"]),
        question=data.get("question"),
        cards_drawn=cards_drawn,
        interpretation=data.get("interpretation"),
        reading_data=data.get("reading_data", {}),
        model=data.get("model"),
        tokens_in=data.get("tokens_in"),
        tokens_out=data.get("tokens_out"),
        language=data.get("language", "en"),
        is_favorite=data.get("is_favorite", False),
        created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
        updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
        deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
    )


@router.get("/deck", response_model=List[TarotCardReference])
async def get_tarot_deck():
    """Return full 78-card deck metadata."""
    deck = get_deck_metadata()
    return [TarotCardReference(**card) for card in deck]


@router.get("/spreads", response_model=Dict[str, SpreadConfiguration])
async def get_tarot_spreads():
    """Return all available spread configurations."""
    from app.schemas.tarot import SpreadPosition
    spreads = get_all_spreads()
    result = {}
    for key, spread in spreads.items():
        result[key] = SpreadConfiguration(
            spread_type=SpreadType(key),
            name=spread["name"],
            description=f"{spread['num']}-card spread: {', '.join(spread['positions'])}",
            card_count=spread["num"],
            positions=[
                SpreadPosition(position=i + 1, name=pos, meaning=f"The {pos} position")
                for i, pos in enumerate(spread["positions"])
            ],
        )
    return result


@router.post("/daily", response_model=TarotDailyDrawResponse)
async def create_or_get_daily_draw(
    user_id: str = Depends(get_current_user_id),
):
    """
    Get or set today's daily draw for the authenticated user.
    Deterministic per user per date.
    """
    _check_rate_limit(user_id)

    today = date.today()
    supabase = get_supabase_client()

    # Check if already exists for today
    existing = supabase.table("tarot_daily_draws").select("*").eq("user_id", user_id).eq("draw_date", today.isoformat()).single().execute()

    if existing.data:
        data = existing.data
        return TarotDailyDrawResponse(
            id=UUID(data["id"]),
            user_id=UUID(data["user_id"]),
            draw_date=date.fromisoformat(data["draw_date"]),
            card_id=data["card_id"],
            card_name=data["card_name"],
            card_suit=data.get("card_suit"),
            card_number=data.get("card_number"),
            card_arcana=data["card_arcana"],
            card_upright=data["card_upright"],
            card_image_url=data.get("card_image_url"),
            card_keywords=data.get("card_keywords", []),
            personal_reflection=data.get("personal_reflection"),
            ai_guidance=data.get("ai_guidance"),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
            updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
            deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
        )

    # Generate new daily draw
    daily_card = get_daily_card(user_id, today)

    # Generate AI guidance for daily card
    card_name = daily_card["card_name"]
    orientation = "Upright" if daily_card["card_upright"] else "Reversed"
    meta = CARD_METADATA.get(card_name, {})
    meaning = meta.get(f"meaning_{orientation.lower()}", "")

    try:
        ai_guidance = await call_ai_json(
            f"""You are a wise tarot guide. Provide brief daily guidance for this card.
Card: {card_name} ({orientation})
Meaning: {meaning}
Keywords: {', '.join(meta.get('keywords', []))}

Return JSON with:
{{
  "message": "2-3 sentence encouraging guidance for the day",
  "focus": "One word theme for the day",
  "action": "One practical action suggestion"
}}""",
            max_tokens=512,
        )
    except Exception:
        ai_guidance = {
            "message": f"Today's card {card_name} brings {meaning.lower()}. Trust the process.",
            "focus": "Awareness",
            "action": "Reflect on this card's message throughout your day.",
        }

    insert_data = {
        "user_id": user_id,
        "draw_date": today.isoformat(),
        "card_id": daily_card["card_id"],
        "card_name": daily_card["card_name"],
        "card_suit": daily_card["card_suit"],
        "card_number": daily_card["card_number"],
        "card_arcana": daily_card["card_arcana"],
        "card_upright": daily_card["card_upright"],
        "card_image_url": daily_card["card_image_url"],
        "card_keywords": daily_card["card_keywords"],
        "ai_guidance": ai_guidance,
    }

    result = supabase.table("tarot_daily_draws").insert(insert_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save daily draw")

    data = result.data[0]
    return TarotDailyDrawResponse(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        draw_date=date.fromisoformat(data["draw_date"]),
        card_id=data["card_id"],
        card_name=data["card_name"],
        card_suit=data.get("card_suit"),
        card_number=data.get("card_number"),
        card_arcana=data["card_arcana"],
        card_upright=data["card_upright"],
        card_image_url=data.get("card_image_url"),
        card_keywords=data.get("card_keywords", []),
        personal_reflection=data.get("personal_reflection"),
        ai_guidance=data.get("ai_guidance"),
        created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
        updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
        deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
    )


@router.get("/daily", response_model=TarotDailyDrawResponse)
async def get_daily_draw(
    user_id: str = Depends(get_current_user_id),
):
    """Fetch today's daily draw for the authenticated user."""
    _check_rate_limit(user_id)

    today = date.today()
    supabase = get_supabase_client()

    result = supabase.table("tarot_daily_draws").select("*").eq("user_id", user_id).eq("draw_date", today.isoformat()).single().execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No daily draw for today. POST to /daily to generate one.")

    data = result.data
    return TarotDailyDrawResponse(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        draw_date=date.fromisoformat(data["draw_date"]),
        card_id=data["card_id"],
        card_name=data["card_name"],
        card_suit=data.get("card_suit"),
        card_number=data.get("card_number"),
        card_arcana=data["card_arcana"],
        card_upright=data["card_upright"],
        card_image_url=data.get("card_image_url"),
        card_keywords=data.get("card_keywords", []),
        personal_reflection=data.get("personal_reflection"),
        ai_guidance=data.get("ai_guidance"),
        created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
        updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
        deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
    )


@router.get("/journal", response_model=List[TarotJournalEntryResponse])
async def list_journal_entries(
    user_id: str = Depends(get_current_user_id),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    reading_id: Optional[UUID] = Query(default=None),
):
    """List user's journal entries (paginated), optionally filtered by reading_id."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()
    query = supabase.table("tarot_journal_entries").select("*").eq("user_id", user_id).order("created_at", desc=True).range(offset, offset + limit - 1)

    if reading_id:
        query = query.eq("reading_id", str(reading_id))

    result = query.execute()

    entries = []
    for data in (result.data or []):
        entries.append(
            TarotJournalEntryResponse(
                id=UUID(data["id"]),
                user_id=UUID(data["user_id"]),
                reading_id=UUID(data["reading_id"]) if data.get("reading_id") else None,
                title=data.get("title"),
                content=data["content"],
                tags=data.get("tags", []),
                mood=data.get("mood"),
                is_private=data.get("is_private", True),
                created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
                updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
                deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
            )
        )
    return entries


@router.post("/journal", response_model=TarotJournalEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    entry: TarotJournalEntryCreate,
    user_id: str = Depends(get_current_user_id),
):
    """Create a journal entry, optionally linked to a reading."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()

    # Verify reading exists if reading_id provided
    if entry.reading_id:
        reading_check = supabase.table("tarot_readings").select("id").eq("id", str(entry.reading_id)).eq("user_id", user_id).single().execute()
        if not reading_check.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reading not found")

    insert_data = {
        "user_id": user_id,
        "reading_id": str(entry.reading_id) if entry.reading_id else None,
        "title": entry.title,
        "content": entry.content,
        "tags": entry.tags,
        "mood": entry.mood,
        "is_private": entry.is_private,
    }

    result = supabase.table("tarot_journal_entries").insert(insert_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create journal entry")

    data = result.data[0]
    return TarotJournalEntryResponse(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        reading_id=UUID(data["reading_id"]) if data.get("reading_id") else None,
        title=data.get("title"),
        content=data["content"],
        tags=data.get("tags", []),
        mood=data.get("mood"),
        is_private=data.get("is_private", True),
        created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
        updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
        deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
    )