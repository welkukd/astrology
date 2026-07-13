from datetime import datetime, timezone
from typing import Optional, Literal
from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from enum import Enum


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


class BirthDataRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    time: Optional[str] = Field(None, pattern=r"^\d{2}:\d{2}$")
    time_unknown: bool = False
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timezone: str = Field(..., min_length=3)
    zodiac: ZodiacSystem = ZodiacSystem.TROPICAL
    house_system: HouseSystem = HouseSystem.PLACIDUS
    ayanamsa: Optional[Ayanamsa] = None

    @property
    def datetime_utc(self) -> datetime:
        from flatlib.datetime import DateTime
        if self.time_unknown or self.time is None:
            dt = DateTime(self.date, "12:00", self.timezone)
        else:
            dt = DateTime(self.date, self.time, self.timezone)
        return dt.toUTC()


class PlanetPosition(BaseModel):
    name: str
    longitude: float
    latitude: float
    speed: float
    sign: str
    degree_in_sign: float
    house: Optional[int] = None
    retrograde: bool
    element: Optional[str] = None
    modality: Optional[str] = None


class HouseCusp(BaseModel):
    number: int
    longitude: float
    sign: str
    degree_in_sign: float


class Aspect(BaseModel):
    planet1: str
    planet2: str
    aspect: str
    orb: float
    applying: bool


class ChartMetadata(BaseModel):
    calculated_at: datetime
    engine: str = "flatlib"
    ephemeris: str = "Moshier"
    precision_note: str = "~0.1 arcsec (Moshier ephemeris)"


class NatalChartResponse(BaseModel):
    chart_id: str
    subject: BirthDataRequest
    planets: list[PlanetPosition]
    houses: list[HouseCusp]
    aspects: list[Aspect]
    metadata: ChartMetadata


class ChartSummary(BaseModel):
    id: str
    subject_name: str
    birth_datetime_utc: str
    zodiac_system: str
    created_at: str


class ChartListResponse(BaseModel):
    charts: list[ChartSummary]
    total: int