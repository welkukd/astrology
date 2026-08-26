import time
from datetime import date, datetime
from typing import Any, Dict, List, Optional, cast
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.core.database import get_supabase_client
from app.core.security import get_current_user_id
from app.schemas.guide import (
    DreamEntryCreate,
    DreamEntryListResponse,
    DreamEntryResponse,
    DreamEntrySummary,
    DreamEntryUpdate,
    GuideSessionCreate,
    GuideSessionResponse,
    GuideSessionSummary,
    SessionType,
    HabitEntryCreate,
    HabitEntryListResponse,
    HabitEntryResponse,
    HabitEntrySummary,
    HabitEntryUpdate,
    HabitFrequency,
    HabitStreakStats,
    MeditationCreate,
    MeditationResponse,
    MeditationSummary,
    MeditationType,
)
from app.services.ai import call_ai_json
from app.services.guide_engine import (
    DEFAULT_MEDITATION_TECHNIQUES,
    generate_daily_meditation_guidance,
    generate_daily_practice_hash,
    generate_daily_practice_sections,
    get_daily_tarot_card,
    get_weekly_monthly_stats,
    interpret_dream_with_ai,
    calculate_habit_streaks,
)

# Type alias for Supabase response
SupabaseResult = Dict[str, Any]

router = APIRouter(prefix="/v1/guide", tags=["guide"])

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


# ============================================
# Request/Response Models for Guide-specific endpoints
# ============================================

class DailyPracticeResponse(BaseModel):
    practice_id: UUID
    practice_date: date
    practice_hash: str
    sections: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True


class MeditationGenerateRequest(BaseModel):
    meditation_type: MeditationType = MeditationType.BREATHING
    duration_seconds: int = Field(default=300, ge=60, le=7200)
    technique: Optional[str] = Field(None, max_length=200)
    background_sound: Optional[str] = Field(None, max_length=200)
    chimes: bool = True


class MeditationGenerateResponse(BaseModel):
    session_id: UUID
    meditation_id: UUID
    guidance_script: str
    audio_url_placeholder: str
    chimes: List[Dict[str, Any]]
    duration_seconds: int
    meditation_type: MeditationType
    title: str


class DreamInterpretRequest(BaseModel):
    force_regenerate: bool = False


class DreamInterpretResponse(BaseModel):
    dream_id: UUID
    ai_interpretation: Dict[str, Any]
    interpreted_at: datetime


class HabitLogRequest(BaseModel):
    entry_date: date
    completed_count: int = Field(default=1, ge=0)
    notes: Optional[str] = None


class HabitLogResponse(BaseModel):
    habit_id: UUID
    entry_date: date
    completed_count: int
    streak_current: int
    streak_longest: int


# ============================================
# DAILY PRACTICE ENDPOINTS
# ============================================

@router.post("/daily", response_model=DailyPracticeResponse)
async def create_or_get_daily_practice(
    user_id: str = Depends(get_current_user_id),
):
    """
    Get or generate today's daily practice for the authenticated user.
    Includes: tarot draw + meditation + habit suggestion + dream prompt.
    Deterministic per user per date (cached).
    """
    _check_rate_limit(user_id)

    today = date.today()
    supabase = get_supabase_client()
    practice_hash = generate_daily_practice_hash(user_id, today)

    # Check if already exists for today
    existing = (
        supabase.table("guide_sessions")
        .select("*")
        .eq("user_id", user_id)
        .eq("session_type", "daily_practice")
        .execute()
    )

    # Look for today's practice by hash in session_data
    if existing.data:
        for session in existing.data:
            session_data = session.get("session_data", {})
            if session_data.get("practice_hash") == practice_hash:
                # Found cached practice
                sections = session_data.get("sections", [])
                return DailyPracticeResponse(
                    practice_id=UUID(session["id"]),
                    practice_date=today,
                    practice_hash=practice_hash,
                    sections=sections,
                    created_at=datetime.fromisoformat(session["created_at"].replace("Z", "+00:00")),
                )

    # Generate new daily practice
    sections = await generate_daily_practice_sections(user_id, today)

    # Create guide session as umbrella
    session_data = {
        "practice_hash": practice_hash,
        "practice_date": today.isoformat(),
        "sections": sections,
    }

    insert_session = {
        "user_id": user_id,
        "session_type": "daily_practice",
        "title": f"Daily Practice - {today.isoformat()}",
        "session_data": session_data,
        "completed_at": datetime.now().isoformat(),
    }

    session_result = supabase.table("guide_sessions").insert(insert_session).execute()
    if not session_result.data:
        raise HTTPException(status_code=500, detail="Failed to create daily practice session")

    session = session_result.data[0]
    session_id = UUID(session["id"])

    # Also create individual records for tarot, meditation, habit, dream sections
    # This allows querying them separately later

    # Tarot section -> guide_sessions (tarot)
    tarot_section = next((s for s in sections if s["type"] == "tarot"), None)
    if tarot_section:
        tarot_session_data = {
            "practice_date": today.isoformat(),
            "practice_id": str(session_id),
            "card": tarot_section["content"],
        }
        supabase.table("guide_sessions").insert({
            "user_id": user_id,
            "session_type": "tarot",
            "title": "Daily Tarot Draw",
            "session_data": tarot_session_data,
        }).execute()

    # Meditation section
    meditation_section = next((s for s in sections if s["type"] == "meditation"), None)
    if meditation_section:
        meditation_content = meditation_section["content"]
        meditation_guidance = await generate_daily_meditation_guidance(
            meditation_type=meditation_content["meditation_type"],
            duration_seconds=meditation_content["duration_seconds"],
            user_id=user_id,
            practice_date=today,
        )

        # Create meditation record
        meditation_insert = {
            "user_id": user_id,
            "session_id": str(session_id),
            "meditation_type": meditation_content["meditation_type"],
            "technique": meditation_content.get("technique"),
            "guidance_text": meditation_guidance.get("script", ""),
            "background_sound": meditation_guidance.get("background_sound"),
            "intervals": meditation_guidance.get("chimes", []),
        }
        med_result = supabase.table("meditations").insert(meditation_insert).execute()
        meditation_id = UUID(med_result.data[0]["id"]) if med_result.data else None

        # Update guide session with meditation_id reference
        if meditation_id:
            supabase.table("guide_sessions").update({
                "session_data": {**session_data, "meditation_id": str(meditation_id)}
            }).eq("id", str(session_id)).execute()

    return DailyPracticeResponse(
        practice_id=session_id,
        practice_date=today,
        practice_hash=practice_hash,
        sections=sections,
        created_at=datetime.fromisoformat(session["created_at"].replace("Z", "+00:00")),
    )


@router.get("/daily", response_model=DailyPracticeResponse)
async def get_daily_practice(
    user_id: str = Depends(get_current_user_id),
):
    """Fetch today's daily practice for the authenticated user."""
    _check_rate_limit(user_id)

    today = date.today()
    supabase = get_supabase_client()
    practice_hash = generate_daily_practice_hash(user_id, today)

    existing = (
        supabase.table("guide_sessions")
        .select("*")
        .eq("user_id", user_id)
        .eq("session_type", "daily_practice")
        .execute()
    )

    if existing.data:
        for session in existing.data:
            session_data = session.get("session_data", {})
            if session_data.get("practice_hash") == practice_hash:
                sections = session_data.get("sections", [])
                return DailyPracticeResponse(
                    practice_id=UUID(session["id"]),
                    practice_date=today,
                    practice_hash=practice_hash,
                    sections=sections,
                    created_at=datetime.fromisoformat(session["created_at"].replace("Z", "+00:00")),
                )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No daily practice for today. POST to /daily to generate one.",
    )


# ============================================
# MEDITATION ENDPOINTS
# ============================================

@router.post("/meditation", response_model=MeditationGenerateResponse)
async def generate_meditation_session(
    request: MeditationGenerateRequest,
    user_id: str = Depends(get_current_user_id),
):
    """Generate a new meditation session with AI guidance script."""
    _check_rate_limit(user_id)

    tech = DEFAULT_MEDITATION_TECHNIQUES.get(request.meditation_type.value, DEFAULT_MEDITATION_TECHNIQUES["guided"])
    duration = request.duration_seconds

    # Generate AI guidance
    guidance = await generate_daily_meditation_guidance(
        meditation_type=request.meditation_type.value,
        duration_seconds=duration,
        user_id=user_id,
        practice_date=date.today(),
    )

    supabase = get_supabase_client()

    # Create guide session
    session_insert = {
        "user_id": user_id,
        "session_type": "meditation",
        "title": guidance.get("title", f"{tech['name']} - {duration // 60} minutes"),
        "session_data": {
            "meditation_type": request.meditation_type.value,
            "duration_seconds": duration,
            "technique": request.technique,
        },
        "duration_seconds": duration,
        "completed_at": datetime.now().isoformat(),
    }
    session_result = supabase.table("guide_sessions").insert(session_insert).execute()
    if not session_result.data:
        raise HTTPException(status_code=500, detail="Failed to create meditation session")

    session = session_result.data[0]
    session_id = UUID(session["id"])

    # Create detailed meditation record
    meditation_insert = {
        "user_id": user_id,
        "session_id": str(session_id),
        "meditation_type": request.meditation_type.value,
        "technique": request.technique,
        "guidance_text": guidance.get("script", ""),
        "background_sound": request.background_sound or guidance.get("background_sound"),
        "intervals": guidance.get("chimes", []) if request.chimes else [],
    }
    med_result = supabase.table("meditations").insert(meditation_insert).execute()
    if not med_result.data:
        raise HTTPException(status_code=500, detail="Failed to create meditation record")

    meditation = med_result.data[0]
    meditation_id = UUID(meditation["id"])

    return MeditationGenerateResponse(
        session_id=session_id,
        meditation_id=meditation_id,
        guidance_script=guidance.get("script", ""),
        audio_url_placeholder=f"/api/v1/guide/meditation/{meditation_id}/audio",
        chimes=guidance.get("chimes", []) if request.chimes else [],
        duration_seconds=duration,
        meditation_type=request.meditation_type,
        title=guidance.get("title", f"{tech['name']} - {duration // 60} minutes"),
    )


@router.get("/meditation/{meditation_id}", response_model=MeditationResponse)
async def get_meditation_session(
    meditation_id: UUID,
    user_id: str = Depends(get_current_user_id),
):
    """Fetch a meditation session by ID."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()
    result = (
        supabase.table("meditations")
        .select("*")
        .eq("id", str(meditation_id))
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meditation not found")

    data = result.data
    return MeditationResponse(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        session_id=UUID(data["session_id"]) if data.get("session_id") else None,
        meditation_type=MeditationType(data["meditation_type"]),
        technique=data.get("technique"),
        guidance_text=data.get("guidance_text"),
        background_sound=data.get("background_sound"),
        intervals=data.get("intervals", []),
        pre_mood=data.get("pre_mood"),
        post_mood=data.get("post_mood"),
        heart_rate_before=data.get("heart_rate_before"),
        heart_rate_after=data.get("heart_rate_after"),
        notes=data.get("notes"),
        created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
        updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
        deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
    )


# ============================================
# DREAM ENDPOINTS
# ============================================

@router.post("/dream", response_model=DreamEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_dream_entry(
    entry: DreamEntryCreate,
    user_id: str = Depends(get_current_user_id),
):
    """Create a new dream entry."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()

    # Create guide session if not provided
    session_id = entry.session_id
    if not session_id:
        session_insert = {
            "user_id": user_id,
            "session_type": "dream",
            "title": entry.title or f"Dream - {entry.dream_date.isoformat()}",
            "session_data": {
                "dream_date": entry.dream_date.isoformat(),
            },
        }
        session_result = supabase.table("guide_sessions").insert(session_insert).execute()
        if not session_result.data:
            raise HTTPException(status_code=500, detail="Failed to create dream session")
        session_id = UUID(session_result.data[0]["id"])

    insert_data = {
        "user_id": user_id,
        "session_id": str(session_id),
        "dream_date": entry.dream_date.isoformat(),
        "title": entry.title,
        "content": entry.content,
        "lucid": entry.lucid,
        "recurring": entry.recurring,
        "emotional_tone": entry.emotional_tone.value if entry.emotional_tone else None,
        "symbols": entry.symbols,
        "ai_interpretation": entry.ai_interpretation,
        "sleep_quality": entry.sleep_quality,
        "sleep_duration_hours": entry.sleep_duration_hours,
        "tags": entry.tags,
        "is_private": entry.is_private,
    }

    result = supabase.table("dream_entries").insert(insert_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create dream entry")

    data = result.data[0]
    return DreamEntryResponse(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        session_id=UUID(data["session_id"]) if data.get("session_id") else None,
        dream_date=date.fromisoformat(data["dream_date"]),
        title=data.get("title"),
        content=data["content"],
        lucid=data["lucid"],
        recurring=data["recurring"],
        emotional_tone=data.get("emotional_tone"),
        symbols=data.get("symbols", []),
        ai_interpretation=data.get("ai_interpretation"),
        sleep_quality=data.get("sleep_quality"),
        sleep_duration_hours=data.get("sleep_duration_hours"),
        tags=data.get("tags", []),
        is_private=data["is_private"],
        created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
        updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
        deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
    )


@router.get("/dream", response_model=DreamEntryListResponse)
async def list_dream_entries(
    user_id: str = Depends(get_current_user_id),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    dream_date: Optional[date] = Query(default=None),
    lucid: Optional[bool] = Query(default=None),
):
    """List user's dream entries (paginated), with optional filters."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()
    query = (
        supabase.table("dream_entries")
        .select("*", count="exact")
        .eq("user_id", user_id)
        .order("dream_date", desc=True)
        .range(offset, offset + limit - 1)
    )

    if dream_date:
        query = query.eq("dream_date", dream_date.isoformat())
    if lucid is not None:
        query = query.eq("lucid", lucid)

    result = query.execute()

    dreams = []
    for data in (result.data or []):
        dreams.append(
            DreamEntrySummary(
                id=UUID(data["id"]),
                dream_date=date.fromisoformat(data["dream_date"]),
                title=data.get("title"),
                lucid=data["lucid"],
                recurring=data["recurring"],
                emotional_tone=data.get("emotional_tone"),
                sleep_quality=data.get("sleep_quality"),
                created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
            )
        )

    return DreamEntryListResponse(
        dreams=dreams,
        total=result.count or 0,
        page=(offset // limit) + 1,
        page_size=limit,
    )


@router.post("/dream/{dream_id}/interpret", response_model=DreamInterpretResponse)
async def interpret_dream(
    dream_id: UUID,
    request: DreamInterpretRequest,
    user_id: str = Depends(get_current_user_id),
):
    """AI interpret a dream entry (symbols, emotions, actionable guidance)."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()

    # Fetch dream entry
    dream_result = (
        supabase.table("dream_entries")
        .select("*")
        .eq("id", str(dream_id))
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not dream_result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dream entry not found")

    dream = dream_result.data

    # Check if already interpreted
    existing_interpretation = dream.get("ai_interpretation")
    if existing_interpretation and not request.force_regenerate:
        return DreamInterpretResponse(
            dream_id=dream_id,
            ai_interpretation=existing_interpretation,
            interpreted_at=datetime.fromisoformat(dream["updated_at"].replace("Z", "+00:00")),
        )

    # Generate AI interpretation
    interpretation = await interpret_dream_with_ai(
        dream_content=dream["content"],
        dream_title=dream.get("title"),
        symbols=dream.get("symbols", []),
        emotional_tone=dream.get("emotional_tone"),
        user_id=user_id,
    )

    # Update dream entry with interpretation
    supabase.table("dream_entries").update({
        "ai_interpretation": interpretation,
    }).eq("id", str(dream_id)).eq("user_id", user_id).execute()

    return DreamInterpretResponse(
        dream_id=dream_id,
        ai_interpretation=interpretation,
        interpreted_at=datetime.now(),
    )


# ============================================
# HABIT ENDPOINTS
# ============================================

@router.get("/habit", response_model=HabitEntryListResponse)
async def list_habits(
    user_id: str = Depends(get_current_user_id),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    habit_name: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
):
    """List user's habits (paginated), with optional filters."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()
    query = (
        supabase.table("habit_entries")
        .select("*", count="exact")
        .eq("user_id", user_id)
        .order("entry_date", desc=True)
        .range(offset, offset + limit - 1)
    )

    if habit_name:
        query = query.eq("habit_name", habit_name)
    if category:
        query = query.eq("habit_category", category)

    result = query.execute()

    habits = []
    for data in (result.data or []):
        habits.append(
            HabitEntrySummary(
                id=UUID(data["id"]),
                habit_name=data["habit_name"],
                habit_category=data.get("habit_category"),
                frequency=HabitFrequency(data["frequency"]) if data.get("frequency") else HabitFrequency.DAILY,
                target_count=data["target_count"],
                target_unit=data.get("target_unit", "times"),
                completed_count=data["completed_count"],
                entry_date=date.fromisoformat(data["entry_date"]),
                streak_current=data.get("streak_current", 0),
                streak_longest=data.get("streak_longest", 0),
                completion_rate=round(data["completed_count"] / data["target_count"] * 100, 1) if data["target_count"] > 0 else 0,
            )
        )

    return HabitEntryListResponse(
        habits=habits,
        total=result.count or 0,
        page=(offset // limit) + 1,
        page_size=limit,
    )


@router.post("/habit", response_model=HabitEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    entry: HabitEntryCreate,
    user_id: str = Depends(get_current_user_id),
):
    """Create a new habit entry (or log for today)."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()

    # Create guide session if not provided
    session_id = entry.session_id
    if not session_id:
        session_insert = {
            "user_id": user_id,
            "session_type": "habit",
            "title": f"Habit: {entry.habit_name}",
            "session_data": {
                "habit_name": entry.habit_name,
                "category": entry.habit_category.value if entry.habit_category else None,
                "frequency": entry.frequency.value,
            },
        }
        session_result = supabase.table("guide_sessions").insert(session_insert).execute()
        if not session_result.data:
            raise HTTPException(status_code=500, detail="Failed to create habit session")
        session_id = UUID(session_result.data[0]["id"])

    # Calculate streaks from existing entries
    existing = (
        supabase.table("habit_entries")
        .select("*")
        .eq("user_id", user_id)
        .eq("habit_name", entry.habit_name)
        .execute()
    )

    streak_current, streak_longest, _, _ = calculate_habit_streaks(
        existing.data or [],
        entry.habit_name,
        entry.frequency.value,
        entry.target_count,
    )

    # If entry for today already exists, update it (upsert behavior)
    if entry.entry_date == date.today():
        existing_today = (
            supabase.table("habit_entries")
            .select("*")
            .eq("user_id", user_id)
            .eq("habit_name", entry.habit_name)
            .eq("entry_date", entry.entry_date.isoformat())
            .execute()
        )
        if existing_today.data:
            # Update existing
            updated_data = {
                "habit_category": entry.habit_category.value if entry.habit_category else None,
                "frequency": entry.frequency.value,
                "target_count": entry.target_count,
                "target_unit": entry.target_unit,
                "completed_count": entry.completed_count,
                "notes": entry.notes,
                "metadata": entry.metadata,
                "streak_current": streak_current,
                "streak_longest": streak_longest,
            }
            result = supabase.table("habit_entries").update(updated_data).eq("id", existing_today.data[0]["id"]).execute()
            data = result.data[0]
            return HabitEntryResponse(
                id=UUID(data["id"]),
                user_id=UUID(data["user_id"]),
                session_id=UUID(data["session_id"]) if data.get("session_id") else None,
                habit_name=data["habit_name"],
                habit_category=data.get("habit_category"),
                frequency=HabitFrequency(data["frequency"]),
                target_count=data["target_count"],
                target_unit=data["target_unit"],
                completed_count=data["completed_count"],
                entry_date=date.fromisoformat(data["entry_date"]),
                streak_current=data["streak_current"],
                streak_longest=data["streak_longest"],
                notes=data.get("notes"),
                metadata=data.get("metadata", {}),
                created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
                updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
                deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
            )

    insert_data = {
        "user_id": user_id,
        "session_id": str(session_id),
        "habit_name": entry.habit_name,
        "habit_category": entry.habit_category.value if entry.habit_category else None,
        "frequency": entry.frequency.value,
        "target_count": entry.target_count,
        "target_unit": entry.target_unit,
        "completed_count": entry.completed_count,
        "entry_date": entry.entry_date.isoformat(),
        "streak_current": streak_current,
        "streak_longest": streak_longest,
        "notes": entry.notes,
        "metadata": entry.metadata,
    }

    result = supabase.table("habit_entries").insert(insert_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create habit entry")

    data = result.data[0]
    return HabitEntryResponse(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        session_id=UUID(data["session_id"]) if data.get("session_id") else None,
        habit_name=data["habit_name"],
        habit_category=data.get("habit_category"),
        frequency=HabitFrequency(data["frequency"]),
        target_count=data["target_count"],
        target_unit=data["target_unit"],
        completed_count=data["completed_count"],
        entry_date=date.fromisoformat(data["entry_date"]),
        streak_current=data["streak_current"],
        streak_longest=data["streak_longest"],
        notes=data.get("notes"),
        metadata=data.get("metadata", {}),
        created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
        updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
        deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
    )


@router.post("/habit/{habit_id}/log", response_model=HabitLogResponse)
async def log_habit_completion(
    habit_id: UUID,
    request: HabitLogRequest,
    user_id: str = Depends(get_current_user_id),
):
    """Log a habit completion for a specific date."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()

    # Fetch the habit entry
    habit_result = (
        supabase.table("habit_entries")
        .select("*")
        .eq("id", str(habit_id))
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not habit_result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    habit = habit_result.data

    # Update completion count
    new_completed = request.completed_count

    # Calculate updated streaks
    existing = (
        supabase.table("habit_entries")
        .select("*")
        .eq("user_id", user_id)
        .eq("habit_name", habit["habit_name"])
        .execute()
    )

    streak_current, streak_longest, _, _ = calculate_habit_streaks(
        existing.data or [],
        habit["habit_name"],
        habit["frequency"],
        habit["target_count"],
    )

    # Update the entry
    update_data = {
        "completed_count": new_completed,
        "notes": request.notes,
        "streak_current": streak_current,
        "streak_longest": streak_longest,
    }

    result = supabase.table("habit_entries").update(update_data).eq("id", str(habit_id)).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to log habit completion")

    updated = result.data[0]
    return HabitLogResponse(
        habit_id=UUID(updated["id"]),
        entry_date=date.fromisoformat(updated["entry_date"]),
        completed_count=updated["completed_count"],
        streak_current=updated["streak_current"],
        streak_longest=updated["streak_longest"],
    )


@router.get("/habit/{habit_id}/stats", response_model=HabitStreakStats)
async def get_habit_stats(
    habit_id: UUID,
    user_id: str = Depends(get_current_user_id),
):
    """Get streak stats for a habit (current, longest, weekly/monthly completion)."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()

    # Fetch the habit entry to get habit_name
    habit_result = (
        supabase.table("habit_entries")
        .select("*")
        .eq("id", str(habit_id))
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not habit_result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    habit = habit_result.data
    habit_name = habit["habit_name"]

    # Fetch all entries for this habit
    entries_result = (
        supabase.table("habit_entries")
        .select("*")
        .eq("user_id", user_id)
        .eq("habit_name", habit_name)
        .execute()
    )

    entries = entries_result.data or []

    streak_current, streak_longest, total_completions, total_entries = calculate_habit_streaks(
        entries,
        habit_name,
        habit["frequency"],
        habit["target_count"],
    )

    weekly_monthly = get_weekly_monthly_stats(entries, habit_name)

    # Find last completed date
    completed_entries = [e for e in entries if e.get("completed_count", 0) >= habit["target_count"]]
    last_completed = None
    if completed_entries:
        last_completed = max(date.fromisoformat(e["entry_date"]) for e in completed_entries)

    completion_rate = round(total_completions / total_entries * 100, 1) if total_entries > 0 else 0.0

    return HabitStreakStats(
        habit_name=habit_name,
        current_streak=streak_current,
        longest_streak=streak_longest,
        total_completions=total_completions,
        total_entries=total_entries,
        completion_rate=completion_rate,
        last_completed=last_completed,
        best_week=weekly_monthly.get("weekly") if weekly_monthly else None,
    )