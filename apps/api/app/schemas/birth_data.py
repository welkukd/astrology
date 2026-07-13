from datetime import datetime
from typing import Optional, Literal
from enum import Enum
from pydantic import BaseModel, Field, field_validator


class ZodiacSystem(str, Enum):
    TROPICAL = "tropical"
    SIDEREAL = "sidereal"


class HouseSystem(str, Enum):
    PLACIDUS = "Placidus"
    KOCH = "Koch"
    WHOLE_SIGN = "Whole Sign"
    EQUAL = "Equal"
    PORPHYRY = "Porphyry"
    REGIOMONTANUS = "Regiomontanus"
    CAMPANUS = "Campanus"
    MORINUS = "Morinus"
    POLICH_PAGE = "Polich-Page"
    ALCABITIUS = "Alcabitius"


class Ayanamsa(str, Enum):
    LAHIRI = "Lahiri"
    RAMAN = "Raman"
    KRISHNAMURTI = "Krishnamurti"
    FAGAN_BRADLEY = "Fagan-Bradley"


class BirthData(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    date: str = Field(..., description="YYYY-MM-DD")
    time: Optional[str] = Field(None, description="HH:MM in 24h format")
    time_unknown: bool = False
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timezone: str = Field(..., description="IANA timezone, e.g., America/New_York")
    zodiac: ZodiacSystem = ZodiacSystem.TROPICAL
    house_system: HouseSystem = HouseSystem.PLACIDUS
    ayanamsa: Optional[Ayanamsa] = None

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be YYYY-MM-DD")
        return v

    @field_validator("time")
    @classmethod
    def validate_time(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        try:
            datetime.strptime(v, "%H:%M")
        except ValueError:
            raise ValueError("Time must be HH:MM 24-hour format")
        return v
