from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from enum import Enum


class HDType(str, Enum):
    MANIFESTOR = "Manifestor"
    GENERATOR = "Generator"
    MANIFESTING_GENERATOR = "Manifesting Generator"
    PROJECTOR = "Projector"
    REFLECTOR = "Reflector"


class HDAuthority(str, Enum):
    EMOTIONAL = "Emotional"
    SACRAL = "Sacral"
    SPLENIC = "Splenic"
    EGO = "Ego"
    SELF_PROJECTED = "Self-Projected"
    MENTAL = "Mental"
    LUNAR = "Lunar"


class DefinitionType(str, Enum):
    SINGLE = "Single"
    SPLIT = "Split"
    TRIPLE_SPLIT = "Triple Split"
    QUADRUPLE_SPLIT = "Quadruple Split"
    NO_DEFINITION = "No Definition"


class CenterType(str, Enum):
    HEAD = "Head"
    AJNA = "Ajna"
    THROAT = "Throat"
    G = "G Center"
    HEART = "Heart/Ego"
    SOLAR_PLEXUS = "Solar Plexus"
    SPLEEN = "Spleen"
    SACRAL = "Sacral"
    ROOT = "Root"


class CenterStatus(str, Enum):
    DEFINED = "defined"
    UNDEFINED = "undefined"
    OPEN = "open"


class VariableArrow(str, Enum):
    LEFT = "left"
    RIGHT = "right"


# ============================================
# Bodygraph Data Structures
# ============================================

class HDCenter(BaseModel):
    id: CenterType
    name: str
    status: CenterStatus
    defined: bool
    gates: List[int] = Field(default_factory=list)  # Gate numbers active in this center
    description: Optional[str] = None
    theme: Optional[str] = None
    shadow: Optional[str] = None


class HDChannel(BaseModel):
    id: str  # e.g., "1-8", "34-20"
    name: str
    gate_start: int
    gate_end: int
    center_start: CenterType
    center_end: CenterType
    defined: bool
    description: Optional[str] = None
    theme: Optional[str] = None
    shadow: Optional[str] = None
    circuit: Optional[str] = None  # Individual, Tribal, Collective


class HDGate(BaseModel):
    number: int
    name: str
    center: CenterType
    line: int  # 1-6
    color: int  # 1-6
    tone: int  # 1-6
    base: int  # 1-5
    defined: bool
    conscious: bool  # Personality (black) vs Design (red)
    description: Optional[str] = None
    keynotes: List[str] = Field(default_factory=list)
    harmonic_gate: Optional[int] = None


class HDVariable(BaseModel):
    name: str  # "PHS", "Environment", "Perspective", "Motivation"
    arrow: VariableArrow
    color: int
    tone: int
    base: int
    description: Optional[str] = None


class HDIncarnationCross(BaseModel):
    name: str
    conscious_sun_gate: int
    conscious_earth_gate: int
    unconscious_sun_gate: int
    unconscious_earth_gate: int
    quarter: str
    theme: Optional[str] = None


class HDProfileLine(BaseModel):
    line: int
    name: str
    description: Optional[str] = None
    keynotes: List[str] = Field(default_factory=list)


class HDProfile(BaseModel):
    profile: str  # e.g., "1/3", "2/4"
    conscious_line: HDProfileLine
    unconscious_line: HDProfileLine
    description: Optional[str] = None


class HDBodygraphData(BaseModel):
    centers: List[HDCenter] = Field(default_factory=list)
    channels: List[HDChannel] = Field(default_factory=list)
    gates: List[HDGate] = Field(default_factory=list)
    variables: List[HDVariable] = Field(default_factory=list)
    profile: Optional[HDProfile] = None
    incarnation_cross: Optional[HDIncarnationCross] = None
    definition_type: Optional[DefinitionType] = None


class HDDesignData(BaseModel):
    """Design (unconscious/red) nodes - calculated ~88 days before birth"""
    datetime_utc: datetime
    planets: Dict[str, Dict[str, Any]]  # planet -> {gate, line, color, tone, base}
    nodes: Dict[str, Dict[str, Any]]  # north_node, south_node


class HDPersonalityData(BaseModel):
    """Personality (conscious/black) nodes - calculated at birth moment"""
    datetime_utc: datetime
    planets: Dict[str, Dict[str, Any]]
    nodes: Dict[str, Dict[str, Any]]


# ============================================
# Request/Response Models
# ============================================

class HDChartCreate(BaseModel):
    subject_name: str = Field(default="Me", max_length=100)
    birth_datetime_utc: datetime
    birth_latitude: float = Field(..., ge=-90, le=90)
    birth_longitude: float = Field(..., ge=-180, le=180)
    birth_timezone: str = Field(..., min_length=3)
    time_unknown: bool = False


class HDChartUpdate(BaseModel):
    subject_name: Optional[str] = Field(None, max_length=100)
    # Computed fields are not directly updatable


class HDChartResponse(BaseModel):
    id: UUID
    user_id: UUID
    subject_name: str
    birth_datetime_utc: datetime
    birth_latitude: float
    birth_longitude: float
    birth_timezone: str
    time_unknown: bool
    # Computed HD fields
    hd_type: HDType
    authority: HDAuthority
    profile: str
    strategy: str
    signature: str
    not_self_theme: str
    # Bodygraph data
    bodygraph_data: HDBodygraphData
    definition_type: Optional[DefinitionType]
    incarnation_cross: Optional[str]
    # Design/Personality data
    design_data: Optional[HDDesignData] = None
    personality_data: Optional[HDPersonalityData] = None
    # Chart metadata
    chart_data: Dict[str, Any]
    chart_hash: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HDChartSummary(BaseModel):
    id: UUID
    subject_name: str
    birth_datetime_utc: datetime
    hd_type: HDType
    authority: HDAuthority
    profile: str
    definition_type: Optional[DefinitionType]
    created_at: datetime

    class Config:
        from_attributes = True


class HDChartListResponse(BaseModel):
    charts: List[HDChartSummary]
    total: int


# ============================================
# Computed Field Helpers (for service layer)
# ============================================

class HDTypeInfo(BaseModel):
    type: HDType
    strategy: str
    signature: str
    not_self_theme: str
    aura_type: str
    population_percentage: str
    description: str


class HDAuthorityInfo(BaseModel):
    authority: HDAuthority
    description: str
    decision_making: str
    waiting_time: Optional[str] = None


HD_TYPE_INFO: Dict[HDType, HDTypeInfo] = {
    HDType.MANIFESTOR: HDTypeInfo(
        type=HDType.MANIFESTOR,
        strategy="To Inform",
        signature="Peace",
        not_self_theme="Anger",
        aura_type="Closed and Repelling",
        population_percentage="~9%",
        description="Manifestors are the only type designed to initiate action independently. They have a closed, repelling aura that protects their creative flow. Their strategy is to inform others before acting to reduce resistance.",
    ),
    HDType.GENERATOR: HDTypeInfo(
        type=HDType.GENERATOR,
        strategy="To Respond",
        signature="Satisfaction",
        not_self_theme="Frustration",
        aura_type="Open and Enveloping",
        population_percentage="~37%",
        description="Generators have sustainable life force energy through their defined Sacral center. They are designed to respond to life rather than initiate. Their strategy is to wait for something to respond to.",
    ),
    HDType.MANIFESTING_GENERATOR: HDTypeInfo(
        type=HDType.MANIFESTING_GENERATOR,
        strategy="To Respond, then Inform",
        signature="Satisfaction",
        not_self_theme="Frustration / Anger",
        aura_type="Open and Enveloping",
        population_percentage="~33%",
        description="Manifesting Generators are a hybrid type with both Sacral definition and a motor-to-Throat channel. They have the Generator's sustainable energy and the Manifestor's speed. Strategy: respond first, then inform.",
    ),
    HDType.PROJECTOR: HDTypeInfo(
        type=HDType.PROJECTOR,
        strategy="Wait for the Invitation",
        signature="Success",
        not_self_theme="Bitterness",
        aura_type="Focused and Absorbing",
        population_percentage="~20%",
        description="Projectors have no defined Sacral and no motor-to-Throat. They are here to guide and manage energy, not generate it. Their focused aura penetrates others. Strategy: wait for recognition and invitation.",
    ),
    HDType.REFLECTOR: HDTypeInfo(
        type=HDType.REFLECTOR,
        strategy="Wait a Lunar Cycle (28 days)",
        signature="Surprise",
        not_self_theme="Disappointment",
        aura_type="Resistant and Sampling",
        population_percentage="~1%",
        description="Reflectors have all centers undefined. They are lunar beings who mirror their environment. Their strategy is to wait a full lunar cycle (28 days) before major decisions, sampling each gate activation.",
    ),
}

HD_AUTHORITY_INFO: Dict[HDAuthority, HDAuthorityInfo] = {
    HDAuthority.EMOTIONAL: HDAuthorityInfo(
        authority=HDAuthority.EMOTIONAL,
        description="Decisions must be made through emotional clarity over time. Never decide in the moment.",
        decision_making="Wait for emotional wave to settle; feel the highs and lows before committing.",
    ),
    HDAuthority.SACRAL: HDAuthorityInfo(
        authority=HDAuthority.SACRAL,
        description="Instant gut response - sacral sounds (uh-huh, un-uh) guide decisions.",
        decision_making="Listen for sacral response in the moment; trust the body's yes/no.",
    ),
    HDAuthority.SPLENIC: HDAuthorityInfo(
        authority=HDAuthority.SPLENIC,
        description="Intuitive, in-the-moment knowing. Quiet, instantaneous, never repeats.",
        decision_making="Trust the sudden intuitive hit; it speaks once and is gone.",
    ),
    HDAuthority.EGO: HDAuthorityInfo(
        authority=HDAuthority.EGO,
        description="Decisions based on willpower and what's genuinely desired. 'I want' or 'I don't want'.",
        decision_making="Speak it out loud; hear your own truth in your voice.",
    ),
    HDAuthority.SELF_PROJECTED: HDAuthorityInfo(
        authority=HDAuthority.SELF_PROJECTED,
        description="Need to hear themselves speak their truth to know what's correct.",
        decision_making="Talk it through with trusted listeners; identity reveals itself in speech.",
    ),
    HDAuthority.MENTAL: HDAuthorityInfo(
        authority=HDAuthority.MENTAL,
        description="Sound boarding - need to talk through decisions in the right environment with right people.",
        decision_making="Discuss options in correct environments; mental clarity comes through externalizing.",
    ),
    HDAuthority.LUNAR: HDAuthorityInfo(
        authority=HDAuthority.LUNAR,
        description="Must wait 28-day lunar cycle, tracking how each gate activation feels.",
        decision_making="Track responses across lunar cycle; clarity emerges over time.",
        waiting_time="28 days (full lunar cycle)",
    ),
}

HD_DEFINITION_TYPE_INFO: Dict[DefinitionType, Dict[str, Any]] = {
    DefinitionType.SINGLE: {
        "name": "Single Definition",
        "description": "All defined centers are connected in one continuous circuit. Energy flows smoothly internally.",
        "characteristics": ["Self-contained", "Consistent energy flow", "Less dependent on others for wholeness"],
    },
    DefinitionType.SPLIT: {
        "name": "Split Definition",
        "description": "Two separate islands of definition. Need others to bridge the split for wholeness.",
        "characteristics": ["Two areas of life", "Seek bridging through relationships", "Can feel split internally"],
    },
    DefinitionType.TRIPLE_SPLIT: {
        "name": "Triple Split Definition",
        "description": "Three separate islands of definition. Need multiple bridges/people for wholeness.",
        "characteristics": ["Three distinct areas", "Need variety in relationships", "Fast processing when bridged"],
    },
    DefinitionType.QUADRUPLE_SPLIT: {
        "name": "Quadruple Split Definition",
        "description": "Four separate islands. Rare. Need many bridges; very fast processing when connected.",
        "characteristics": ["Four distinct areas", "Highly dependent on environment/people", "Very fast when bridged"],
    },
    DefinitionType.NO_DEFINITION: {
        "name": "No Definition (Reflector)",
        "description": "All centers undefined. Completely open to conditioning. Mirror of environment.",
        "characteristics": ["No consistent energy", "Wisdom through sampling", "Environment is everything"],
    },
}

# Standard 64 Gates with basic info (abbreviated - full in service)
HD_GATES: Dict[int, Dict[str, Any]] = {
    1: {"name": "The Creative", "center": CenterType.AJNA, "keynotes": ["self-expression", "creativity", "individual knowing"]},
    2: {"name": "The Receptive", "center": CenterType.G, "keynotes": ["direction", "receptivity", "higher guidance"]},
    3: {"name": "Difficulty at the Beginning", "center": CenterType.SACRAL, "keynotes": ["innovation", "chaos", "new beginnings"]},
    4: {"name": "Youthful Folly", "center": CenterType.AJNA, "keynotes": ["formulation", "logic", "answers"]},
    5: {"name": "Waiting", "center": CenterType.SACRAL, "keynotes": ["fixed rhythms", "timing", "patience"]},
    6: {"name": "Conflict", "center": CenterType.SOLAR_PLEXUS, "keynotes": ["friction", "intimacy", "emotional clarity"]},
    7: {"name": "The Army", "center": CenterType.G, "keynotes": ["leadership", "strategy", "organization"]},
    8: {"name": "Holding Together", "center": CenterType.G, "keynotes": ["contribution", "cooperation", "role modeling"]},
    9: {"name": "The Taming Power of the Small", "center": CenterType.SACRAL, "keynotes": ["focus", "detail", "concentration"]},
    10: {"name": "Behavior of the Self", "center": CenterType.G, "keynotes": ["self-love", "authenticity", "empowerment"]},
    # ... (truncated for brevity - full 64 gates in service)
}

# Standard Channels (abbreviated)
HD_CHANNELS: Dict[str, Dict[str, Any]] = {
    "1-8": {"name": "Channel of Inspiration", "centers": [CenterType.AJNA, CenterType.THROAT], "circuit": "Individual"},
    "2-14": {"name": "Channel of the Beat", "centers": [CenterType.G, CenterType.SACRAL], "circuit": "Individual"},
    "3-60": {"name": "Channel of Mutation", "centers": [CenterType.SACRAL, CenterType.ROOT], "circuit": "Individual"},
    # ... (truncated - full in service)
}

# Profile definitions
HD_PROFILES: Dict[str, Dict[str, Any]] = {
    "1/3": {"conscious": 1, "unconscious": 3, "name": "Investigator / Martyr"},
    "1/4": {"conscious": 1, "unconscious": 4, "name": "Investigator / Opportunist"},
    "2/4": {"conscious": 2, "unconscious": 4, "name": "Hermit / Opportunist"},
    "2/5": {"conscious": 2, "unconscious": 5, "name": "Hermit / Heretic"},
    "3/5": {"conscious": 3, "unconscious": 5, "name": "Martyr / Heretic"},
    "3/6": {"conscious": 3, "unconscious": 6, "name": "Martyr / Role Model"},
    "4/1": {"conscious": 4, "unconscious": 1, "name": "Opportunist / Investigator"},
    "4/6": {"conscious": 4, "unconscious": 6, "name": "Opportunist / Role Model"},
    "5/1": {"conscious": 5, "unconscious": 1, "name": "Heretic / Investigator"},
    "5/2": {"conscious": 5, "unconscious": 2, "name": "Heretic / Hermit"},
    "6/2": {"conscious": 6, "unconscious": 2, "name": "Role Model / Hermit"},
    "6/3": {"conscious": 6, "unconscious": 3, "name": "Role Model / Martyr"},
}

# Center themes for reference
CENTER_THEMES: Dict[CenterType, Dict[str, str]] = {
    CenterType.HEAD: {"theme": "Inspiration / Mental Pressure", "question": "What inspires me?"},
    CenterType.AJNA: {"theme": "Conceptualization / Mental Awareness", "question": "What do I think?"},
    CenterType.THROAT: {"theme": "Manifestation / Communication", "question": "How do I express?"},
    CenterType.G: {"theme": "Identity / Direction / Love", "question": "Who am I? Where am I going?"},
    CenterType.HEART: {"theme": "Willpower / Ego / Value", "question": "What is my worth?"},
    CenterType.SOLAR_PLEXUS: {"theme": "Emotions / Spirit / Desire", "question": "What do I feel?"},
    CenterType.SPLEEN: {"theme": "Intuition / Survival / Health", "question": "What is safe/healthy?"},
    CenterType.SACRAL: {"theme": "Life Force / Sexuality / Work", "question": "Do I have energy for this?"},
    CenterType.ROOT: {"theme": "Pressure / Stress / Drive", "question": "What pressures me?"},
}