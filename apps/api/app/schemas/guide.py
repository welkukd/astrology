from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from enum import Enum


class SessionType(str, Enum):
    MEDITATION = "meditation"
    DREAM = "dream"
    HABIT = "habit"


class MeditationType(str, Enum):
    GUIDED = "guided"
    BREATHING = "breathing"
    MANTRA = "mantra"
    BODY_SCAN = "body_scan"
    WALKING = "walking"
    CUSTOM = "custom"


class HabitCategory(str, Enum):
    HEALTH = "health"
    SPIRITUAL = "spiritual"
    PRODUCTIVITY = "productivity"
    CREATIVE = "creative"
    SOCIAL = "social"
    CUSTOM = "custom"


class HabitFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"


class EmotionalTone(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    MIXED = "mixed"


# ============================================
# Guide Sessions (umbrella table)
# ============================================

class GuideSessionCreate(BaseModel):
    session_type: SessionType
    title: Optional[str] = Field(None, max_length=200)
    session_data: Dict[str, Any] = Field(default_factory=dict)
    audio_url: Optional[str] = Field(None, max_length=500)
    duration_seconds: Optional[int] = Field(None, ge=0)


class GuideSessionUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    session_data: Optional[Dict[str, Any]] = None
    audio_url: Optional[str] = Field(None, max_length=500)
    duration_seconds: Optional[int] = Field(None, ge=0)
    completed_at: Optional[datetime] = None
    is_favorite: Optional[bool] = None


class GuideSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    session_type: SessionType
    title: Optional[str]
    session_data: Dict[str, Any]
    audio_url: Optional[str]
    duration_seconds: Optional[int]
    completed_at: Optional[datetime]
    is_favorite: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GuideSessionSummary(BaseModel):
    id: UUID
    session_type: SessionType
    title: Optional[str]
    duration_seconds: Optional[int]
    completed_at: Optional[datetime]
    is_favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Meditations
# ============================================

class MeditationCreate(BaseModel):
    session_id: Optional[UUID] = None
    meditation_type: MeditationType
    technique: Optional[str] = Field(None, max_length=200)
    guidance_text: Optional[str] = None
    background_sound: Optional[str] = Field(None, max_length=200)
    intervals: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    pre_mood: Optional[str] = Field(None, max_length=50)
    post_mood: Optional[str] = Field(None, max_length=50)
    heart_rate_before: Optional[int] = Field(None, ge=30, le=220)
    heart_rate_after: Optional[int] = Field(None, ge=30, le=220)
    notes: Optional[str] = None


class MeditationUpdate(BaseModel):
    meditation_type: Optional[MeditationType] = None
    technique: Optional[str] = Field(None, max_length=200)
    guidance_text: Optional[str] = None
    background_sound: Optional[str] = Field(None, max_length=200)
    intervals: Optional[List[Dict[str, Any]]] = None
    pre_mood: Optional[str] = Field(None, max_length=50)
    post_mood: Optional[str] = Field(None, max_length=50)
    heart_rate_before: Optional[int] = Field(None, ge=30, le=220)
    heart_rate_after: Optional[int] = Field(None, ge=30, le=220)
    notes: Optional[str] = None


class MeditationResponse(BaseModel):
    id: UUID
    user_id: UUID
    session_id: Optional[UUID]
    meditation_type: MeditationType
    technique: Optional[str]
    guidance_text: Optional[str]
    background_sound: Optional[str]
    intervals: List[Dict[str, Any]]
    pre_mood: Optional[str]
    post_mood: Optional[str]
    heart_rate_before: Optional[int]
    heart_rate_after: Optional[int]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MeditationSummary(BaseModel):
    id: UUID
    meditation_type: MeditationType
    technique: Optional[str]
    duration_seconds: Optional[int]
    pre_mood: Optional[str]
    post_mood: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Dream Entries
# ============================================

class DreamEntryCreate(BaseModel):
    session_id: Optional[UUID] = None
    dream_date: date
    title: Optional[str] = Field(None, max_length=200)
    content: str = Field(..., min_length=1)
    lucid: bool = False
    recurring: bool = False
    emotional_tone: Optional[EmotionalTone] = None
    symbols: List[str] = Field(default_factory=list)
    ai_interpretation: Optional[Dict[str, Any]] = None
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    sleep_duration_hours: Optional[float] = Field(None, ge=0, le=24)
    tags: List[str] = Field(default_factory=list)
    is_private: bool = True


class DreamEntryUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    lucid: Optional[bool] = None
    recurring: Optional[bool] = None
    emotional_tone: Optional[EmotionalTone] = None
    symbols: Optional[List[str]] = None
    ai_interpretation: Optional[Dict[str, Any]] = None
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    sleep_duration_hours: Optional[float] = Field(None, ge=0, le=24)
    tags: Optional[List[str]] = None
    is_private: Optional[bool] = None


class DreamEntryResponse(BaseModel):
    id: UUID
    user_id: UUID
    session_id: Optional[UUID]
    dream_date: date
    title: Optional[str]
    content: str
    lucid: bool
    recurring: bool
    emotional_tone: Optional[EmotionalTone]
    symbols: List[str]
    ai_interpretation: Optional[Dict[str, Any]]
    sleep_quality: Optional[int]
    sleep_duration_hours: Optional[float]
    tags: List[str]
    is_private: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DreamEntrySummary(BaseModel):
    id: UUID
    dream_date: date
    title: Optional[str]
    lucid: bool
    recurring: bool
    emotional_tone: Optional[EmotionalTone]
    sleep_quality: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Habit Entries
# ============================================

class HabitEntryCreate(BaseModel):
    session_id: Optional[UUID] = None
    habit_name: str = Field(..., min_length=1, max_length=100)
    habit_category: Optional[HabitCategory] = None
    frequency: HabitFrequency = HabitFrequency.DAILY
    target_count: int = Field(default=1, ge=1)
    target_unit: str = Field(default="times", max_length=50)
    completed_count: int = Field(default=0, ge=0)
    entry_date: date
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class HabitEntryUpdate(BaseModel):
    habit_category: Optional[HabitCategory] = None
    frequency: Optional[HabitFrequency] = None
    target_count: Optional[int] = Field(None, ge=1)
    target_unit: Optional[str] = Field(None, max_length=50)
    completed_count: Optional[int] = Field(None, ge=0)
    entry_date: Optional[date] = None
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class HabitEntryResponse(BaseModel):
    id: UUID
    user_id: UUID
    session_id: Optional[UUID]
    habit_name: str
    habit_category: Optional[HabitCategory]
    frequency: HabitFrequency
    target_count: int
    target_unit: str
    completed_count: int
    entry_date: date
    streak_current: int
    streak_longest: int
    notes: Optional[str]
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HabitEntrySummary(BaseModel):
    id: UUID
    habit_name: str
    habit_category: Optional[HabitCategory]
    frequency: HabitFrequency
    target_count: int
    target_unit: str
    completed_count: int
    entry_date: date
    streak_current: int
    streak_longest: int
    completion_rate: float  # computed: completed_count / target_count

    class Config:
        from_attributes = True


class HabitStreakStats(BaseModel):
    habit_name: str
    current_streak: int
    longest_streak: int
    total_completions: int
    total_entries: int
    completion_rate: float
    last_completed: Optional[date]
    best_week: Optional[Dict[str, Any]] = None


# ============================================
# List/Filter responses
# ============================================

class GuideSessionListResponse(BaseModel):
    sessions: List[GuideSessionSummary]
    total: int
    page: int
    page_size: int


class MeditationListResponse(BaseModel):
    meditations: List[MeditationSummary]
    total: int
    page: int
    page_size: int


class DreamEntryListResponse(BaseModel):
    dreams: List[DreamEntrySummary]
    total: int
    page: int
    page_size: int


class HabitEntryListResponse(BaseModel):
    habits: List[HabitEntrySummary]
    total: int
    page: int
    page_size: int


# ============================================
# Predefined content for guided sessions
# ============================================

DEFAULT_MEDITATION_TECHNIQUES = {
    MeditationType.GUIDED: {
        "name": "Guided Meditation",
        "description": "Follow along with a narrator",
        "default_duration": 600,  # 10 minutes
    },
    MeditationType.BREATHING: {
        "name": "Breathing Exercise",
        "description": "Focus on breath patterns",
        "default_duration": 300,  # 5 minutes
        "default_intervals": [
            {"phase": "inhale", "duration": 4, "instruction": "Breathe in deeply"},
            {"phase": "hold", "duration": 4, "instruction": "Hold the breath"},
            {"phase": "exhale", "duration": 6, "instruction": "Breathe out slowly"},
            {"phase": "hold", "duration": 2, "instruction": "Pause before next breath"},
        ],
    },
    MeditationType.MANTRA: {
        "name": "Mantra Meditation",
        "description": "Repeat a sacred sound or phrase",
        "default_duration": 900,  # 15 minutes
    },
    MeditationType.BODY_SCAN: {
        "name": "Body Scan",
        "description": "Progressive relaxation through body awareness",
        "default_duration": 1200,  # 20 minutes
        "default_intervals": [
            {"area": "feet", "duration": 60},
            {"area": "calves", "duration": 60},
            {"area": "thighs", "duration": 60},
            {"area": "hips", "duration": 60},
            {"area": "abdomen", "duration": 60},
            {"area": "chest", "duration": 60},
            {"area": "hands", "duration": 60},
            {"area": "arms", "duration": 60},
            {"area": "shoulders", "duration": 60},
            {"area": "neck", "duration": 60},
            {"area": "face", "duration": 60},
            {"area": "head", "duration": 60},
        ],
    },
    MeditationType.WALKING: {
        "name": "Walking Meditation",
        "description": "Mindful walking practice",
        "default_duration": 600,  # 10 minutes
    },
    MeditationType.CUSTOM: {
        "name": "Custom Meditation",
        "description": "Your own meditation practice",
        "default_duration": 600,
    },
}

HABIT_CATEGORY_ICONS = {
    HabitCategory.HEALTH: "💪",
    HabitCategory.SPIRITUAL: "🧘",
    HabitCategory.PRODUCTIVITY: "⚡",
    HabitCategory.CREATIVE: "🎨",
    HabitCategory.SOCIAL: "🤝",
    HabitCategory.CUSTOM: "✨",
}

HABIT_CATEGORY_COLORS = {
    HabitCategory.HEALTH: "#EF4444",      # red
    HabitCategory.SPIRITUAL: "#8B5CF6",   # purple
    HabitCategory.PRODUCTIVITY: "#3B82F6", # blue
    HabitCategory.CREATIVE: "#F59E0B",    # amber
    HabitCategory.SOCIAL: "#EC4899",      # pink
    HabitCategory.CUSTOM: "#6B7280",      # gray
}