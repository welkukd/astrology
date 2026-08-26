from datetime import datetime, date
from typing import Optional, Literal, List, Dict, Any
from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from enum import Enum


class TarotSuit(str, Enum):
    WANDS = "wands"
    CUPS = "cups"
    SWORDS = "swords"
    PENTACLES = "pentacles"
    MAJOR = "major"


class TarotArcana(str, Enum):
    MAJOR = "major"
    MINOR = "minor"


class SpreadType(str, Enum):
    SINGLE_CARD = "single_card"
    THREE_CARD = "three_card"
    CELTIC_CROSS = "celtic_cross"
    HORSESHOE = "horseshoe"
    RELATIONSHIP = "relationship"
    CAREER = "career"
    MONTHLY = "monthly"
    YEAR_AHEAD = "year_ahead"
    CUSTOM = "custom"


class CardPosition(BaseModel):
    position: int
    position_name: str
    card_id: str
    name: str
    suit: Optional[TarotSuit] = None
    number: Optional[int] = None
    arcana: TarotArcana
    upright: bool = True
    image_url: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)
    meaning_upright: Optional[str] = None
    meaning_reversed: Optional[str] = None


class TarotReadingCreate(BaseModel):
    spread_type: SpreadType
    question: Optional[str] = Field(None, max_length=1000)
    cards_drawn: List[CardPosition]
    reading_data: Optional[Dict[str, Any]] = Field(default_factory=dict)
    language: str = Field(default="en", pattern=r"^[a-z]{2}$")


class TarotReadingUpdate(BaseModel):
    question: Optional[str] = Field(None, max_length=1000)
    interpretation: Optional[Dict[str, Any]] = None
    reading_data: Optional[Dict[str, Any]] = None
    is_favorite: Optional[bool] = None


class TarotReadingResponse(BaseModel):
    id: UUID
    user_id: UUID
    spread_type: SpreadType
    question: Optional[str]
    cards_drawn: List[CardPosition]
    interpretation: Optional[Dict[str, Any]]
    reading_data: Dict[str, Any]
    model: Optional[str]
    tokens_in: Optional[int]
    tokens_out: Optional[int]
    language: str
    is_favorite: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TarotReadingSummary(BaseModel):
    id: UUID
    spread_type: SpreadType
    question: Optional[str]
    cards_count: int
    is_favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TarotJournalEntryCreate(BaseModel):
    reading_id: Optional[UUID] = None
    title: Optional[str] = Field(None, max_length=200)
    content: str = Field(..., min_length=1)
    tags: List[str] = Field(default_factory=list)
    mood: Optional[str] = Field(None, max_length=50)
    is_private: bool = True


class TarotJournalEntryUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    tags: Optional[List[str]] = None
    mood: Optional[str] = Field(None, max_length=50)
    is_private: Optional[bool] = None


class TarotJournalEntryResponse(BaseModel):
    id: UUID
    user_id: UUID
    reading_id: Optional[UUID]
    title: Optional[str]
    content: str
    tags: List[str]
    mood: Optional[str]
    is_private: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TarotDailyDrawCreate(BaseModel):
    draw_date: date
    card_id: str
    card_name: str
    card_suit: Optional[TarotSuit] = None
    card_number: Optional[int] = None
    card_arcana: TarotArcana
    card_upright: bool = True
    card_image_url: Optional[str] = None
    card_keywords: List[str] = Field(default_factory=list)
    personal_reflection: Optional[str] = None
    ai_guidance: Optional[Dict[str, Any]] = None


class TarotDailyDrawUpdate(BaseModel):
    card_upright: Optional[bool] = None
    personal_reflection: Optional[str] = None
    ai_guidance: Optional[Dict[str, Any]] = None


class TarotDailyDrawResponse(BaseModel):
    id: UUID
    user_id: UUID
    draw_date: date
    card_id: str
    card_name: str
    card_suit: Optional[TarotSuit]
    card_number: Optional[int]
    card_arcana: TarotArcana
    card_upright: bool
    card_image_url: Optional[str]
    card_keywords: List[str]
    personal_reflection: Optional[str]
    ai_guidance: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# 78-card deck reference
class TarotCardReference(BaseModel):
    card_id: str
    name: str
    suit: Optional[TarotSuit]
    number: Optional[int]
    arcana: TarotArcana
    image_url: Optional[str] = None
    keywords: List[str]
    meaning_upright: str
    meaning_reversed: str
    element: Optional[str] = None
    zodiac_association: Optional[str] = None
    hebrew_letter: Optional[str] = None
    number_roman: Optional[str] = None


# Common spreads configuration
class SpreadPosition(BaseModel):
    position: int
    name: str
    meaning: str


class SpreadConfiguration(BaseModel):
    spread_type: SpreadType
    name: str
    description: str
    card_count: int
    positions: List[SpreadPosition]


# Default 78-card deck data (abbreviated - full deck in service)
MAJOR_ARCANA_CARDS = [
    {"card_id": "0", "name": "The Fool", "number": 0, "arcana": "major", "keywords": ["beginnings", "innocence", "spontaneity", "faith"]},
    {"card_id": "1", "name": "The Magician", "number": 1, "arcana": "major", "keywords": ["manifestation", "resourcefulness", "power", "inspired action"]},
    {"card_id": "2", "name": "The High Priestess", "number": 2, "arcana": "major", "keywords": ["intuition", "sacred knowledge", "divine feminine", "subconscious"]},
    {"card_id": "3", "name": "The Empress", "number": 3, "arcana": "major", "keywords": ["femininity", "beauty", "nature", "abundance", "nurturing"]},
    {"card_id": "4", "name": "The Emperor", "number": 4, "arcana": "major", "keywords": ["authority", "structure", "control", "fatherhood"]},
    {"card_id": "5", "name": "The Hierophant", "number": 5, "arcana": "major", "keywords": ["tradition", "conformity", "morality", "ethics", "spiritual wisdom"]},
    {"card_id": "6", "name": "The Lovers", "number": 6, "arcana": "major", "keywords": ["love", "harmony", "relationships", "values alignment", "choices"]},
    {"card_id": "7", "name": "The Chariot", "number": 7, "arcana": "major", "keywords": ["control", "willpower", "victory", "assertion", "determination"]},
    {"card_id": "8", "name": "Strength", "number": 8, "arcana": "major", "keywords": ["strength", "courage", "patience", "control", "compassion"]},
    {"card_id": "9", "name": "The Hermit", "number": 9, "arcana": "major", "keywords": ["soul searching", "introspection", "being alone", "inner guidance"]},
    {"card_id": "10", "name": "Wheel of Fortune", "number": 10, "arcana": "major", "keywords": ["good luck", "karma", "life cycles", "destiny", "turning point"]},
    {"card_id": "11", "name": "Justice", "number": 11, "arcana": "major", "keywords": ["justice", "fairness", "truth", "cause and effect", "law"]},
    {"card_id": "12", "name": "The Hanged Man", "number": 12, "arcana": "major", "keywords": ["pause", "surrender", "letting go", "new perspectives"]},
    {"card_id": "13", "name": "Death", "number": 13, "arcana": "major", "keywords": ["endings", "change", "transformation", "transition"]},
    {"card_id": "14", "name": "Temperance", "number": 14, "arcana": "major", "keywords": ["balance", "moderation", "patience", "purpose", "meaning"]},
    {"card_id": "15", "name": "The Devil", "number": 15, "arcana": "major", "keywords": ["shadow self", "attachment", "addiction", "restriction", "sexuality"]},
    {"card_id": "16", "name": "The Tower", "number": 16, "arcana": "major", "keywords": ["sudden change", "upheaval", "chaos", "revelation", "awakening"]},
    {"card_id": "17", "name": "The Star", "number": 17, "arcana": "major", "keywords": ["hope", "faith", "purpose", "renewal", "spirituality"]},
    {"card_id": "18", "name": "The Moon", "number": 18, "arcana": "major", "keywords": ["illusion", "fear", "anxiety", "subconscious", "intuition"]},
    {"card_id": "19", "name": "The Sun", "number": 19, "arcana": "major", "keywords": ["positivity", "fun", "warmth", "success", "vitality"]},
    {"card_id": "20", "name": "Judgement", "number": 20, "arcana": "major", "keywords": ["judgement", "rebirth", "inner calling", "absolution"]},
    {"card_id": "21", "name": "The World", "number": 21, "arcana": "major", "keywords": ["completion", "integration", "accomplishment", "travel"]},
]

MINOR_ARCANA_SUITS = {
    "wands": {"element": "fire", "keywords": ["energy", "passion", "creativity", "willpower"]},
    "cups": {"element": "water", "keywords": ["emotions", "relationships", "intuition", "creativity"]},
    "swords": {"element": "air", "keywords": ["intellect", "communication", "conflict", "truth"]},
    "pentacles": {"element": "earth", "keywords": ["material", "finances", "work", "manifestation"]},
}

MINOR_ARCANA_RANKS = [
    {"number": 1, "name": "Ace", "keywords": ["new beginnings", "potential", "opportunity"]},
    {"number": 2, "name": "Two", "keywords": ["balance", "partnership", "duality", "choices"]},
    {"number": 3, "name": "Three", "keywords": ["growth", "expansion", "creativity", "collaboration"]},
    {"number": 4, "name": "Four", "keywords": ["stability", "structure", "rest", "contemplation"]},
    {"number": 5, "name": "Five", "keywords": ["conflict", "loss", "change", "adversity", "growth through challenge"]},
    {"number": 6, "name": "Six", "keywords": ["harmony", "balance", "giving", "receiving", "progress"]},
    {"number": 7, "name": "Seven", "keywords": ["assessment", "patience", "perseverance", "spiritual growth"]},
    {"number": 8, "name": "Eight", "keywords": ["movement", "action", "power", "mastery", "progress"]},
    {"number": 9, "name": "Nine", "keywords": ["fruition", "attainment", "wisdom", "completion", "reflection"]},
    {"number": 10, "name": "Ten", "keywords": ["completion", "fulfillment", "end of cycle", "transition"]},
    {"number": 11, "name": "Page", "keywords": ["messenger", "curiosity", "beginnings", "learning", "potential"]},
    {"number": 12, "name": "Knight", "keywords": ["action", "movement", "quest", "idealism", "energy"]},
    {"number": 13, "name": "Queen", "keywords": ["nurturing", "maturity", "embodiment", "compassion", "mastery"]},
    {"number": 14, "name": "King", "keywords": ["authority", "mastery", "leadership", "control", "vision"]},
]

DEFAULT_SPREADS = {
    SpreadType.SINGLE_CARD: SpreadConfiguration(
        spread_type=SpreadType.SINGLE_CARD,
        name="Single Card",
        description="Quick insight or daily guidance",
        card_count=1,
        positions=[SpreadPosition(position=1, name="Guidance", meaning="The energy or message for you right now")],
    ),
    SpreadType.THREE_CARD: SpreadConfiguration(
        spread_type=SpreadType.THREE_CARD,
        name="Three Card Spread",
        description="Past, present, future or situation, action, outcome",
        card_count=3,
        positions=[
            SpreadPosition(position=1, name="Past / Situation", meaning="What led to this moment or the current situation"),
            SpreadPosition(position=2, name="Present / Action", meaning="Current energy or recommended action"),
            SpreadPosition(position=3, name="Future / Outcome", meaning="Likely outcome or direction"),
        ],
    ),
    SpreadType.CELTIC_CROSS: SpreadConfiguration(
        spread_type=SpreadType.CELTIC_CROSS,
        name="Celtic Cross",
        description="Classic 10-card deep dive",
        card_count=10,
        positions=[
            SpreadPosition(position=1, name="Present", meaning="Current situation"),
            SpreadPosition(position=2, name="Challenge", meaning="Immediate obstacle"),
            SpreadPosition(position=3, name="Past", meaning="Foundation or recent past"),
            SpreadPosition(position=4, name="Future", meaning="Near future"),
            SpreadPosition(position=5, name="Above", meaning="Conscious goal or aspiration"),
            SpreadPosition(position=6, name="Below", meaning="Subconscious influence"),
            SpreadPosition(position=7, name="Self", meaning="Your attitude"),
            SpreadPosition(position=8, name="Environment", meaning="External influences"),
            SpreadPosition(position=9, name="Hopes/Fears", meaning="Inner hopes or fears"),
            SpreadPosition(position=10, name="Outcome", meaning="Final outcome"),
        ],
    ),
}