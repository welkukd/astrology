"""
Human Design Engine — Core calculation and rendering logic for Human Design charts.

Implements: bodygraph calculation, Type/Authority/Profile/Cross computation,
Design/Personality nodes, Variables (PHS), SVG rendering, AI interpretation prompts.
"""

import hashlib
import json
import math
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from flatlib.chart import Chart
from flatlib.datetime import Datetime
from flatlib.geopos import GeoPos
from flatlib import const
from flatlib.ephem import swe as flatlib_swe

import swisseph as swe

from app.schemas.humandesign import (
    HDAuthority,
    HDCenter,
    HDChannel,
    HDDefinitionType,
    HDGate,
    HDGateDetail,
    HDIncarnationCross,
    HDProfile,
    HDProfileLine,
    HDType,
    HDVariable,
    HDVariableDetail,
)

# ============================================
# Reference Data
# ============================================

# Gate definitions: number -> (name, center, line, color, tone, base, keynotes)
GATE_DATA = {
    1: ("The Creative", "G Center", 1, 1, 1, 1, ["creativity", "individuality", "expression"]),
    2: ("The Receptive", "G Center", 2, 2, 2, 2, ["receptivity", "direction", "higher self"]),
    3: ("Ordering", "Sacral", 3, 3, 3, 3, ["mutation", "adaptation", "innovation"]),
    4: ("Youthful Folly", "Ajna", 4, 4, 4, 4, ["formulation", "mental answers", "questions"]),
    5: ("Waiting", "Sacral", 5, 5, 5, 5, ["fixed rhythm", "patience", "timing"]),
    6: ("Conflict", "Solar Plexus", 6, 6, 6, 6, ["friction", "openness", "clarity"]),
    7: ("The Army", "G Center", 1, 1, 1, 1, ["leadership", "strategy", "collective"]),
    8: ("Holding Together", "Throat", 2, 2, 2, 2, ["contribution", "influence", "group"]),
    9: ("Small Restraint", "Sacral", 3, 3, 3, 3, ["focus", "concentration", "details"]),
    10: ("Treading", "G Center", 4, 4, 4, 4, ["behavior", "self-conduct", "authenticity"]),
    11: ("Peace", "Ajna", 5, 5, 5, 5, ["harmony", "ideals", "peace"]),
    12: ("Standstill", "Throat", 6, 6, 6, 6, ["caution", "retreat", "standstill"]),
    13: ("Fellowship", "G Center", 1, 1, 1, 1, ["fellowship", "community", "shared values"]),
    14: ("Great Possession", "Sacral", 2, 2, 2, 2, ["power", "competence", "greatness"]),
    15: ("Modesty", "G Center", 3, 3, 3, 3, ["humility", "modesty", "extremes"]),
    16: ("Enthusiasm", "Spleen", 4, 4, 4, 4, ["skills", "mastery", "identification"]),
    17: ("Following", "Ajna", 5, 5, 5, 5, ["opinions", "influence", "guidance"]),
    18: ("Work on Decay", "Spleen", 6, 6, 6, 6, ["correction", "renewal", "decay"]),
    19: ("Approach", "Root", 1, 1, 1, 1, ["approach", "sensitivity", "oversight"]),
    20: ("Contemplation", "Throat", 2, 2, 2, 2, ["view", "observation", "contemplation"]),
    21: ("Biting Through", "Heart/Ego", 3, 3, 3, 3, ["justice", "determination", "reform"]),
    22: ("Grace", "Solar Plexus", 4, 4, 4, 4, ["beauty", "grace", "adornment"]),
    23: ("Splitting Apart", "Ajna", 5, 5, 5, 5, ["deterioration", "separation", "end"]),
    24: ("Return", "Root", 6, 6, 6, 6, ["return", "cycle", "turning point"]),
    25: ("Innocence", "G Center", 1, 1, 1, 1, ["innocence", "spontaneity", "universal love"]),
    26: ("Taming Power", "Heart/Ego", 2, 2, 2, 2, ["power", "willpower", "control"]),
    27: ("Corners of Mouth", "Sacral", 3, 3, 3, 3, ["nourishment", "self-care", "providing"]),
    28: ("Preponderance", "Sacral", 4, 4, 4, 4, ["excess", "greatness", "burden"]),
    29: ("The Abysmal", "Sacral", 5, 5, 5, 5, ["danger", "depth", "trust"]),
    30: ("Clinging", "Solar Plexus", 6, 6, 6, 6, ["dependence", "clarity", "attachment"]),
    31: ("Influence", "Throat", 1, 1, 1, 1, ["influence", "leadership", "expression"]),
    32: ("Duration", "Spleen", 2, 2, 2, 2, ["endurance", "perseverance", "commitment"]),
    33: ("Retreat", "G Center", 3, 3, 3, 3, ["retreat", "withdrawal", "preservation"]),
    34: ("Great Power", "Sacral", 4, 4, 4, 4, ["power", "vitality", "satisfaction"]),
    35: ("Progress", "Throat", 5, 5, 5, 5, ["progress", "change", "expansion"]),
    36: ("Darkening", "Solar Plexus", 6, 6, 6, 6, ["crisis", "darkness", "inner light"]),
    37: ("Family", "Solar Plexus", 1, 1, 1, 1, ["community", "family", "closeness"]),
    38: ("Opposition", "Spleen", 2, 2, 2, 2, ["opposition", "strength", "perseverance"]),
    39: ("Obstruction", "Root", 3, 3, 3, 3, ["obstruction", "water", "flow"]),
    40: ("Deliverance", "Heart/Ego", 4, 4, 4, 4, ["liberation", "release", "deliverance"]),
    41: ("Decrease", "Root", 5, 5, 5, 5, ["decrease", "reduction", "simplification"]),
    42: ("Increase", "Root", 6, 6, 6, 6, ["increase", "growth", "benefit"]),
    43: ("Breakthrough", "Ajna", 1, 1, 1, 1, ["breakthrough", "determination", "resolution"]),
    44: ("Coming to Meet", "Spleen", 2, 2, 2, 2, ["meeting", "encounter", "attraction"]),
    45: ("Gathering", "Throat", 3, 3, 3, 3, ["gathering", "meeting", "assembling"]),
    46: ("Pushing Upward", "G Center", 4, 4, 4, 4, ["growth", "ascending", "progress"]),
    47: ("Oppression", "Ajna", 5, 5, 5, 5, ["oppression", "exhaustion", "confined"]),
    48: ("The Well", "Spleen", 6, 6, 6, 6, ["resource", "nourishment", "sharing"]),
    49: ("Revolution", "Root", 1, 1, 1, 1, ["revolution", "change", "molting"]),
    50: ("The Cauldron", "Spleen", 2, 2, 2, 2, ["transformation", "holding", "vessel"]),
    51: ("Arousing", "Heart/Ego", 3, 3, 3, 3, ["shock", "awakening", "thunder"]),
    52: ("Keeping Still", "Root", 4, 4, 4, 4, ["stillness", "meditation", "mountain"]),
    53: ("Development", "Root", 5, 5, 5, 5, ["growth", "gradual", "perseverance"]),
    54: ("Marrying Maiden", "Spleen", 6, 6, 6, 6, ["relationships", "marriage", "union"]),
    55: ("Abundance", "Solar Plexus", 1, 1, 1, 1, ["abundance", "fullness", "peak"]),
    56: ("Wanderer", "Spleen", 2, 2, 2, 2, ["wandering", "traveler", "transient"]),
    57: ("Gentle", "Spleen", 3, 3, 3, 3, ["gentle", "penetrating", "wind"]),
    58: ("Joyous", "Spleen", 4, 4, 4, 4, ["joy", "lake", "openness"]),
    59: ("Dispersion", "Sacral", 5, 5, 5, 5, ["dispersion", "dissolution", "flow"]),
    60: ("Limitation", "Root", 6, 6, 6, 6, ["limitation", "structure", "boundaries"]),
    61: ("Inner Truth", "Head", 1, 1, 1, 1, ["truth", "sincerity", "inner knowing"]),
    62: ("Small Excess", "Throat", 2, 2, 2, 2, ["preponderance", "small excess", "detail"]),
    63: ("After Completion", "Head", 3, 3, 3, 3, ["completion", "order", "discipline"]),
    64: ("Before Completion", "Head", 4, 4, 4, 4, ["unfinished", "transition", "caution"]),
}

# Channel definitions: "start-end" -> (name, center_start, center_end, circuit, theme)
CHANNEL_DATA = {
    "1-8": ("Inspiration", "G Center", "Throat", "Individual", "creative expression"),
    "2-14": ("The Beat", "G Center", "Sacral", "Individual", "empowerment"),
    "3-60": ("Mutation", "Sacral", "Root", "Individual", "innovation"),
    "4-63": ("Logic", "Ajna", "Head", "Collective", "mental logic"),
    "5-15": ("Rhythm", "Sacral", "G Center", "Individual", "fixed patterns"),
    "6-59": ("Mating", "Solar Plexus", "Sacral", "Tribal", "sexuality"),
    "7-31": ("Alpha", "G Center", "Throat", "Individual", "leadership"),
    "8-1": ("Inspiration", "Throat", "G Center", "Individual", "creative contribution"),
    "9-52": ("Concentration", "Sacral", "Root", "Collective", "focus"),
    "10-20": ("Awakening", "G Center", "Throat", "Individual", "self-expression"),
    "10-57": ("Perfected Form", "G Center", "Spleen", "Individual", "survival instinct"),
    "11-56": ("Curiosity", "Ajna", "Throat", "Collective", "stories"),
    "12-22": ("Openness", "Throat", "Solar Plexus", "Individual", "social"),
    "13-33": ("Prodigal", "G Center", "Throat", "Collective", "listener"),
    "14-2": ("Beat", "Sacral", "G Center", "Individual", "empowerment"),
    "15-5": ("Rhythm", "G Center", "Sacral", "Individual", "extremes"),
    "16-48": ("Wavelength", "Throat", "Spleen", "Individual", "talent"),
    "17-62": ("Opinions", "Ajna", "Throat", "Collective", "understanding"),
    "18-58": ("Judgment", "Spleen", "Root", "Tribal", "correction"),
    "19-49": ("Sensitivity", "Root", "Solar Plexus", "Tribal", "principles"),
    "20-10": ("Awakening", "Throat", "G Center", "Individual", "now"),
    "20-34": ("Charisma", "Throat", "Sacral", "Individual", "busyness"),
    "21-45": ("Money", "Heart/Ego", "Throat", "Tribal", "control"),
    "22-12": ("Openness", "Solar Plexus", "Throat", "Individual", "social grace"),
    "23-43": ("Structuring", "Ajna", "Throat", "Individual", "genius"),
    "24-61": ("Rationalization", "Ajna", "Head", "Collective", "insight"),
    "25-51": ("Shock", "G Center", "Heart/Ego", "Individual", "initiation"),
    "26-44": ("Surrender", "Heart/Ego", "Spleen", "Tribal", "integrity"),
    "27-50": ("Nourishment", "Sacral", "Spleen", "Tribal", "caring"),
    "28-38": ("Struggle", "Sacral", "Spleen", "Individual", "purpose"),
    "29-46": ("Commitment", "Sacral", "G Center", "Collective", "saying yes"),
    "30-41": ("Recognition", "Solar Plexus", "Root", "Collective", "feelings"),
    "31-7": ("Alpha", "Throat", "G Center", "Individual", "leadership"),
    "32-54": ("Transformation", "Spleen", "Root", "Collective", "drive"),
    "33-13": ("Prodigal", "Throat", "G Center", "Collective", "witness"),
    "34-20": ("Charisma", "Sacral", "Throat", "Individual", "empowerment"),
    "34-57": ("Power", "Sacral", "Spleen", "Individual", "vitality"),
    "35-36": ("Transitoriness", "Throat", "Solar Plexus", "Collective", "crisis"),
    "36-35": ("Transitoriness", "Solar Plexus", "Throat", "Collective", "crisis"),
    "37-40": ("Community", "Solar Plexus", "Heart/Ego", "Tribal", "family"),
    "38-28": ("Struggle", "Spleen", "Sacral", "Individual", "fight"),
    "39-55": ("Provocation", "Root", "Solar Plexus", "Collective", "provocation"),
    "40-37": ("Aloneness", "Heart/Ego", "Solar Plexus", "Tribal", "work"),
    "41-30": ("Recognition", "Root", "Solar Plexus", "Collective", "fantasy"),
    "42-53": ("Maturation", "Root", "Root", "Individual", "growth"),
    "43-23": ("Genius", "Ajna", "Throat", "Individual", "insight"),
    "44-26": ("Coming to Meet", "Spleen", "Heart/Ego", "Tribal", "alertness"),
    "45-21": ("Dominance", "Throat", "Heart/Ego", "Tribal", "leadership"),
    "46-29": ("Serendipity", "G Center", "Sacral", "Collective", "luck"),
    "47-64": ("Abstraction", "Ajna", "Head", "Collective", "realization"),
    "48-16": ("Depth", "Spleen", "Throat", "Individual", "talent"),
    "49-19": ("Principles", "Solar Plexus", "Root", "Tribal", "revolution"),
    "50-27": ("Nourishment", "Spleen", "Sacral", "Tribal", "caring"),
    "51-25": ("Shock", "Heart/Ego", "G Center", "Individual", "competition"),
    "52-9": ("Concentration", "Root", "Sacral", "Collective", "stillness"),
    "53-42": ("Maturation", "Root", "Root", "Individual", "beginning"),
    "54-32": ("Ambition", "Root", "Spleen", "Collective", "drive"),
    "55-39": ("Abundance", "Solar Plexus", "Root", "Collective", "spirit"),
    "56-11": ("Curiosity", "Throat", "Ajna", "Collective", "stimulation"),
    "57-10": ("Perfected Form", "Spleen", "G Center", "Individual", "intuition"),
    "57-34": ("Power", "Spleen", "Sacral", "Individual", "intuition"),
    "58-18": ("Judgment", "Root", "Spleen", "Tribal", "vitality"),
    "59-6": ("Intimacy", "Sacral", "Solar Plexus", "Tribal", "sexuality"),
    "60-3": ("Mutation", "Root", "Sacral", "Individual", "limitation"),
    "61-24": ("Awareness", "Head", "Ajna", "Collective", "mystery"),
    "62-17": ("Opinions", "Throat", "Ajna", "Collective", "opinions"),
    "63-4": ("Doubt", "Head", "Ajna", "Collective", "logic"),
    "64-47": ("Confusion", "Head", "Ajna", "Collective", "confusion"),
}

# Center definitions
CENTER_DEFINITIONS = {
    "Head": {"type": "pressure", "theme": "inspiration", "shadow": "mental anxiety", "gates": [61, 63, 64]},
    "Ajna": {"type": "awareness", "theme": "conceptualization", "shadow": "mental uncertainty", "gates": [4, 11, 17, 23, 24, 43, 47, 62]},
    "Throat": {"type": "manifestation", "theme": "expression", "shadow": "pressure to speak", "gates": [8, 12, 13, 16, 20, 23, 31, 33, 35, 43, 45, 56, 62]},
    "G Center": {"type": "identity", "theme": "direction/love", "shadow": "lost identity", "gates": [1, 2, 7, 10, 13, 15, 25, 29, 46]},
    "Heart/Ego": {"type": "motor", "theme": "willpower", "shadow": "worthiness", "gates": [21, 25, 26, 40, 51]},
    "Solar Plexus": {"type": "emotional motor", "theme": "emotional clarity", "shadow": "emotional waves", "gates": [6, 12, 19, 22, 30, 36, 37, 39, 41, 49, 55]},
    "Spleen": {"type": "awareness", "theme": "intuition/survival", "shadow": "fear", "gates": [16, 18, 28, 38, 44, 48, 50, 54, 57, 58]},
    "Sacral": {"type": "motor", "theme": "life force/work", "shadow": "frustration", "gates": [3, 5, 9, 14, 20, 27, 29, 34, 42, 52, 53, 59, 60]},
    "Root": {"type": "pressure motor", "theme": "adrenaline/stress", "shadow": "pressure", "gates": [18, 19, 38, 39, 41, 42, 52, 53, 54, 58, 60]},
}

# Circuit groups
CIRCUITS = {
    "Individual": ["1-8", "2-14", "3-60", "4-63", "5-15", "7-31", "10-20", "10-57", "12-22", "16-48", "17-62", "23-43", "24-61", "25-51", "28-38", "34-20", "34-57", "43-23", "44-26", "47-64", "48-16", "51-25", "53-42", "57-10", "57-34"],
    "Tribal": ["6-59", "18-58", "19-49", "21-45", "26-44", "27-50", "37-40", "38-28", "40-37", "44-26", "45-21", "46-29", "49-19", "50-27", "59-6"],
    "Collective": ["4-63", "8-1", "9-52", "11-56", "13-33", "14-2", "15-5", "20-10", "29-46", "30-41", "32-54", "33-13", "35-36", "36-35", "39-55", "41-30", "42-53", "46-29", "47-64", "52-9", "53-42", "54-32", "55-39", "56-11", "61-24", "63-4", "64-47"],
}

# Profile lines
PROFILE_LINES = {
    1: ("Investigator", "introspective", ["foundation", "depth", "security"]),
    2: ("Hermit", "projection", ["natural", "reclusive", "called out"]),
    3: ("Martyr", "experience", ["trial", "error", "adaptation"]),
    4: ("Opportunist", "social", ["network", "opportunity", "influence"]),
    5: ("Heretic", "universal", ["projection", "practical", "seductive"]),
    6: ("Role Model", "objective", ["perspective", "wisdom", "transition"]),
}

# Incarnation Crosses (simplified - 192 total)
INCARNATION_CROSSES = {
    "Right Angle Cross of the Sphinx": {"conscious_sun": 1, "conscious_earth": 2, "unconscious_sun": 7, "unconscious_earth": 13, "quarter": "Initiation", "theme": "direction through identity"},
    "Right Angle Cross of the Vessel": {"conscious_sun": 2, "conscious_earth": 1, "unconscious_sun": 13, "unconscious_earth": 7, "quarter": "Initiation", "theme": "receptivity"},
    "Right Angle Cross of the Sleeping Phoenix": {"conscious_sun": 3, "conscious_earth": 50, "unconscious_sun": 41, "unconscious_earth": 31, "quarter": "Initiation", "theme": "mutation"},
    "Right Angle Cross of the Four Ways": {"conscious_sun": 4, "conscious_earth": 49, "unconscious_sun": 31, "unconscious_earth": 41, "quarter": "Initiation", "theme": "formulation"},
    # ... more would be added
}

# Variables (PHS)
VARIABLES = {
    "PHS": {"name": "Determination", "left": ["consecutive", "alternating", "open", "closed", "hot", "cold", "high", "low", "direct", "indirect", "nervous", "calm"], "right": ["alternating", "consecutive", "closed", "open", "cold", "hot", "low", "high", "indirect", "direct", "calm", "nervous"]},
    "Environment": {"name": "Environment", "left": ["caves", "markets", "kitchens", "mountains", "valleys", "shores"], "right": ["shores", "valleys", "mountains", "kitchens", "markets", "caves"]},
    "Perspective": {"name": "Perspective", "left": ["survival", "possibility", "power", "want", "probability", "personal"], "right": ["personal", "probability", "want", "power", "possibility", "survival"]},
    "Motivation": {"name": "Motivation", "left": ["fear", "hope", "desire", "need", "guilt", "innocence"], "right": ["innocence", "guilt", "need", "desire", "hope", "fear"]},
}

# HD Types
HD_TYPES = ["Manifestor", "Generator", "Manifesting Generator", "Projector", "Reflector"]

# Authorities
AUTHORITIES = ["Emotional", "Sacral", "Splenic", "Ego", "Self-Projected", "Mental", "Lunar"]

# Definition types
DEFINITION_TYPES = ["Single", "Split", "Triple Split", "Quadruple Split", "No Definition"]


# ============================================
# Helper Functions
# ============================================

def _get_longitude(planet: str, chart: Chart) -> float:
    """Get planet longitude from flatlib chart."""
    try:
        obj = chart.get(planet)
        return obj.lon if obj else 0.0
    except:
        return 0.0


def _get_house_longitude(house: int, chart: Chart) -> float:
    """Get house cusp longitude."""
    try:
        h = chart.get(f"House{house}")
        return h.lon if h else 0.0
    except:
        return 0.0


def _normalize_longitude(lon: float) -> float:
    """Normalize longitude to 0-360."""
    return lon % 360


def _get_gate_from_longitude(lon: float) -> int:
    """Convert longitude (0-360) to gate number (1-64)."""
    # Each gate = 360/64 = 5.625 degrees
    # Gate 1 starts at 0 degrees (Aries 0)
    gate = int(lon / 5.625) + 1
    return max(1, min(64, gate))


def _get_line_from_longitude(lon: float) -> int:
    """Get line (1-6) within gate."""
    gate_start = ((_get_gate_from_longitude(lon) - 1) * 5.625)
    pos_in_gate = (lon - gate_start) % 5.625
    line = int(pos_in_gate / 0.9375) + 1  # 5.625/6 = 0.9375
    return max(1, min(6, line))


def _get_color_from_longitude(lon: float) -> int:
    """Get color (1-6) within gate."""
    pos_in_gate = (lon % 5.625)
    color = int(pos_in_gate / 0.9375) + 1
    return max(1, min(6, color))


def _get_tone_from_longitude(lon: float) -> int:
    """Get tone (1-6) within color."""
    pos_in_color = (lon % 0.9375)
    tone = int(pos_in_color / 0.15625) + 1  # 0.9375/6 = 0.15625
    return max(1, min(6, tone))


def _get_base_from_longitude(lon: float) -> int:
    """Get base (1-5) within tone."""
    pos_in_tone = (lon % 0.15625)
    base = int(pos_in_tone / 0.03125) + 1  # 0.15625/5 = 0.03125
    return max(1, min(5, base))


def _is_defined(gate_a: int, gate_b: int, active_gates: List[int]) -> bool:
    """Check if a channel is defined (both gates active)."""
    return gate_a in active_gates and gate_b in active_gates


def calculate_chart_hash(birth_data: Dict[str, Any]) -> str:
    """Generate deterministic hash for chart caching."""
    content = f"{birth_data['birth_datetime_utc']}:{birth_data['birth_latitude']}:{birth_data['birth_longitude']}:{birth_data['birth_timezone']}:{birth_data.get('time_unknown', False)}"
    return hashlib.sha256(content.encode()).hexdigest()[:16]


# ============================================
# Core Calculation Functions
# ============================================

def calculate_bodygraph(birth_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate complete Human Design bodygraph from birth data.
    
    Returns dict with all computed fields for chart storage and rendering.
    """
    # Parse birth data
    birth_dt = datetime.fromisoformat(birth_data["birth_datetime_utc"].replace("Z", "+00:00"))
    lat = birth_data["birth_latitude"]
    lon = birth_data["birth_longitude"]
    tz = birth_data["birth_timezone"]
    time_unknown = birth_data.get("time_unknown", False)
    
    # Create flatlib chart for personality (birth time)
    fl_dt = Datetime(birth_dt.year, birth_dt.month, birth_dt.day, birth_dt.hour, birth_dt.minute, birth_dt.second, tz=0)
    fl_pos = GeoPos(lat, lon)
    personality_chart = Chart(fl_dt, fl_pos, IDs=const.LIST_OBJECTS)
    
    # Calculate design chart (~88 days / 88 degrees before birth)
    design_dt = birth_dt - timedelta(days=88)
    fl_design_dt = Datetime(design_dt.year, design_dt.month, design_dt.day, design_dt.hour, design_dt.minute, design_dt.second, tz=0)
    design_chart = Chart(fl_design_dt, fl_pos, IDs=const.LIST_OBJECTS)
    
    # Get active gates from both charts
    active_gates = set()
    gate_details = {}
    
    # Process personality gates (black)
    for planet in const.LIST_OBJECTS:
        if planet in ["Asc", "MC", "Node", "Fortune", "Syzygy"]:
            continue
        try:
            obj = personality_chart.get(planet)
            if obj:
                gate_num = _get_gate_from_longitude(obj.lon)
                active_gates.add(gate_num)
                gate_details[gate_num] = gate_details.get(gate_num, {})
                gate_details[gate_num]["personality"] = True
                gate_details[gate_num]["planet"] = planet
        except:
            pass
    
    # Process design gates (red)
    for planet in const.LIST_OBJECTS:
        if planet in ["Asc", "MC", "Node", "Fortune", "Syzygy"]:
            continue
        try:
            obj = design_chart.get(planet)
            if obj:
                gate_num = _get_gate_from_longitude(obj.lon)
                active_gates.add(gate_num)
                gate_details[gate_num] = gate_details.get(gate_num, {})
                gate_details[gate_num]["design"] = True
                gate_details[gate_num]["planet"] = planet
        except:
            pass
    
    # Also check house cusps for additional activations
    for house in range(1, 13):
        try:
            h_personality = personality_chart.get(f"House{house}")
            h_design = design_chart.get(f"House{house}")
            if h_personality:
                gate_num = _get_gate_from_longitude(h_personality.lon)
                active_gates.add(gate_num)
                gate_details[gate_num] = gate_details.get(gate_num, {})
                gate_details[gate_num]["personality"] = True
                gate_details[gate_num]["house"] = house
            if h_design:
                gate_num = _get_gate_from_longitude(h_design.lon)
                active_gates.add(gate_num)
                gate_details[gate_num] = gate_details.get(gate_num, {})
                gate_details[gate_num]["design"] = True
                gate_details[gate_num]["house"] = house
        except:
            pass
    
    # Determine defined centers
    centers = {}
    for center_name, center_info in CENTER_DEFINITIONS.items():
        center_gates = center_info["gates"]
        defined_count = sum(1 for g in center_gates if g in active_gates)
        total_count = len(center_gates)
        
        if defined_count == total_count and total_count > 0:
            status = "defined"
        elif defined_count > 0:
            status = "undefined"
        else:
            status = "open"
        
        centers[center_name] = {
            "id": center_name,
            "name": center_name,
            "status": status,
            "defined": status == "defined",
            "gates": center_gates,
            "defined_gates": [g for g in center_gates if g in active_gates],
            "description": center_info.get("theme", ""),
            "theme": center_info.get("theme", ""),
            "shadow": center_info.get("shadow", ""),
        }
    
    # Determine defined channels
    channels = []
    defined_channels = []
    for channel_id, (name, center_start, center_end, circuit, theme) in CHANNEL_DATA.items():
        parts = channel_id.split("-")
        gate_start = int(parts[0])
        gate_end = int(parts[1])
        defined = _is_defined(gate_start, gate_end, list(active_gates))
        
        ch = {
            "id": channel_id,
            "name": name,
            "gate_start": gate_start,
            "gate_end": gate_end,
            "center_start": center_start,
            "center_end": center_end,
            "defined": defined,
            "description": theme,
            "theme": theme,
            "shadow": "",
            "circuit": circuit,
        }
        channels.append(ch)
        if defined:
            defined_channels.append(channel_id)
    
    # Build gates list with full details
    gates = []
    for gate_num in range(1, 65):
        gate_active = gate_num in active_gates
        detail = gate_details.get(gate_num, {})
        gdata = GATE_DATA.get(gate_num, ("Unknown", "Unknown", 1, 1, 1, 1, []))
        name, center, _, _, _, _, keynotes = gdata
        
        # Determine if conscious (personality) or design
        conscious = detail.get("personality", False)
        
        gate = {
            "number": gate_num,
            "name": name,
            "center": center,
            "line": _get_line_from_longitude(_get_longitude(detail.get("planet", ""), personality_chart)) if detail.get("personality") else 1,
            "color": _get_color_from_longitude(_get_longitude(detail.get("planet", ""), personality_chart)) if detail.get("personality") else 1,
            "tone": _get_tone_from_longitude(_get_longitude(detail.get("planet", ""), personality_chart)) if detail.get("personality") else 1,
            "base": _get_base_from_longitude(_get_longitude(detail.get("planet", ""), personality_chart)) if detail.get("personality") else 1,
            "defined": gate_active,
            "conscious": conscious,
            "description": "",
            "keynotes": keynotes,
            "harmonic_gate": None,
        }
        gates.append(gate)
    
    # Determine definition type
    defined_center_count = sum(1 for c in centers.values() if c["defined"])
    if defined_center_count == 0:
        definition_type = "No Definition"
    elif defined_center_count <= 2:
        # Check if connected
        definition_type = "Single"
    elif defined_center_count <= 4:
        definition_type = "Split"
    elif defined_center_count <= 6:
        definition_type = "Triple Split"
    else:
        definition_type = "Quadruple Split"
    
    # Calculate Type
    # Simplified: based on defined centers and throat connection
    throat_defined = centers.get("Throat", {}).get("defined", False)
    sacral_defined = centers.get("Sacral", {}).get("defined", False)
    heart_defined = centers.get("Heart/Ego", {}).get("defined", False)
    solar_plexus_defined = centers.get("Solar Plexus", {}).get("defined", False)
    spleen_defined = centers.get("Spleen", {}).get("defined", False)
    ajna_defined = centers.get("Ajna", {}).get("defined", False)
    
    # Simplified type logic
    if throat_defined and (heart_defined or sacral_defined):
        hd_type = "Manifestor"
    elif sacral_defined and not throat_defined:
        hd_type = "Generator"
    elif sacral_defined and throat_defined:
        hd_type = "Manifesting Generator"
    elif throat_defined and not sacral_defined:
        hd_type = "Projector"
    else:
        hd_type = "Reflector"
    
    # Calculate Authority (simplified)
    if solar_plexus_defined:
        authority = "Emotional"
    elif sacral_defined:
        authority = "Sacral"
    elif spleen_defined:
        authority = "Splenic"
    elif heart_defined:
        authority = "Ego"
    elif ajna_defined:
        authority = "Self-Projected"
    elif centers.get("Head", {}).get("defined", False):
        authority = "Mental"
    else:
        authority = "Lunar"
    
    # Calculate Profile
    # Simplified: use sun/earth gates
    sun_gate = _get_gate_from_longitude(_get_longitude("Sun", personality_chart))
    earth_gate = _get_gate_from_longitude(_get_longitude("Earth", personality_chart))
    design_sun_gate = _get_gate_from_longitude(_get_longitude("Sun", design_chart))
    design_earth_gate = _get_gate_from_longitude(_get_longitude("Earth", design_chart))
    
    # Get lines for profile
    conscious_line = _get_line_from_longitude(_get_longitude("Sun", personality_chart))
    unconscious_line = _get_line_from_longitude(_get_longitude("Sun", design_chart))
    
    profile_str = f"{conscious_line}/{unconscious_line}"
    
    # Calculate Incarnation Cross
    cross_name = _calculate_incarnation_cross(sun_gate, earth_gate, design_sun_gate, design_earth_gate)
    
    # Calculate Strategy
    strategy = _get_strategy(hd_type, authority, definition_type)
    
    # Calculate Signature & Not-Self
    signature, not_self = _get_signature_not_self(hd_type)
    
    # Variables (PHS) - simplified
    variables = _calculate_variables(birth_dt, design_dt)
    
    # Definition summary
    defined_centers = [c for c in centers if centers[c]["defined"]]
    undefined_centers = [c for c in centers if centers[c]["status"] == "undefined"]
    open_centers = [c for c in centers if centers[c]["status"] == "open"]
    
    definition_summary = {
        "defined_centers": defined_centers,
        "undefined_centers": undefined_centers,
        "open_centers": open_centers,
        "defined_channels": defined_channels,
        "total_defined_centers": len(defined_centers),
        "total_defined_channels": len(defined_channels),
    }
    
    # Compile result
    return {
        "hd_type": hd_type,
        "authority": authority,
        "profile": profile_str,
        "incarnation_cross": cross_name,
        "definition_type": definition_type,
        "strategy": strategy,
        "signature": signature,
        "not_self_theme": not_self,
        "centers": centers,
        "channels": channels,
        "gates": gates,
        "variables": variables,
        "definition_type": definition_type,
        "definition_summary": definition_summary,
        "design_data": {
            "gates": {k: v for k, v in gate_details.items() if v.get("design")},
            "chart_hash": calculate_chart_hash({
                "birth_datetime_utc": (birth_dt - timedelta(days=88)).isoformat(),
                "birth_latitude": lat,
                "birth_longitude": lon,
                "birth_timezone": tz,
                "time_unknown": time_unknown,
            }),
        },
        "personality_data": {
            "gates": {k: v for k, v in gate_details.items() if v.get("personality")},
            "chart_hash": calculate_chart_hash({
                "birth_datetime_utc": birth_dt.isoformat(),
                "birth_latitude": lat,
                "birth_longitude": lon,
                "birth_timezone": tz,
                "time_unknown": time_unknown,
            }),
        },
        "strategy": strategy,
        "signature": signature,
        "not_self_theme": not_self,
    }


def _calculate_incarnation_cross(sun: int, earth: int, design_sun: int, design_earth: int) -> str:
    """Calculate Incarnation Cross name from four gates."""
    # Simplified - in reality would look up from 192 crosses
    return f"Cross of {sun}/{earth}/{design_sun}/{design_earth}"


def _get_strategy(hd_type: str, authority: str, definition_type: str) -> str:
    """Get strategy for HD type."""
    strategies = {
        "Manifestor": "To inform before acting",
        "Generator": "To wait to respond",
        "Manifesting Generator": "To wait to respond, then inform",
        "Projector": "To wait for the invitation",
        "Reflector": "To wait a lunar cycle (28 days)",
    }
    return strategies.get(hd_type, "To wait")


def _get_signature_not_self(hd_type: str) -> Tuple[str, str]:
    """Get signature and not-self theme for type."""
    sigs = {
        "Manifestor": ("Peace", "Anger"),
        "Generator": ("Satisfaction", "Frustration"),
        "Manifesting Generator": ("Satisfaction", "Frustration + Anger"),
        "Projector": ("Success", "Bitterness"),
        "Reflector": ("Surprise", "Disappointment"),
    }
    return sigs.get(hd_type, ("", ""))


def _calculate_variables(birth_dt: datetime, design_dt: datetime) -> List[Dict[str, Any]]:
    """Calculate 4 PHS variables."""
    # Simplified - real calculation uses color/tone/base from Sun/Earth
    return [
        {"name": "Determination", "arrow": "left", "color": 1, "tone": 1, "base": 1, "description": "How you digest life"},
        {"name": "Environment", "arrow": "right", "color": 2, "tone": 2, "base": 2, "description": "Your optimal environment"},
        {"name": "Perspective", "arrow": "left", "color": 3, "tone": 3, "base": 3, "description": "Your unique perspective"},
        {"name": "Motivation", "arrow": "right", "color": 4, "tone": 4, "base": 4, "description": "What drives you"},
    ]


# ============================================
# Reference Data Accessors
# ============================================

def get_all_centers() -> List[Dict[str, Any]]:
    """Get all 9 centers with metadata."""
    result = []
    for name, info in CENTER_DEFINITIONS.items():
        result.append({
            "id": name,
            "name": name,
            "status": "open",  # Default, actual status from chart
            "defined": False,
            "gates": info["gates"],
            "description": info.get("theme", ""),
            "theme": info.get("theme", ""),
            "shadow": info.get("shadow", ""),
        })
    return result


def get_all_channels() -> List[Dict[str, Any]]:
    """Get all 36 channels with metadata."""
    result = []
    for ch_id, (name, start, end, circuit, theme) in CHANNEL_DATA.items():
        parts = ch_id.split("-")
        result.append({
            "id": ch_id,
            "name": name,
            "gate_start": int(parts[0]),
            "gate_end": int(parts[1]),
            "center_start": start,
            "center_end": end,
            "defined": False,
            "description": theme,
            "theme": theme,
            "shadow": "",
            "circuit": circuit,
        })
    return result


def get_all_gates() -> List[Dict[str, Any]]:
    """Get all 64 gates with full detail."""
    result = []
    for num in range(1, 65):
        name, center, line, color, tone, base, keynotes = GATE_DATA.get(num, ("Unknown", "Unknown", 1, 1, 1, 1, []))
        result.append({
            "number": num,
            "name": name,
            "center": center,
            "line": line,
            "color": color,
            "tone": tone,
            "base": base,
            "defined": False,
            "conscious": False,
            "description": "",
            "keynotes": keynotes,
            "harmonic_gate": None,
        })
    return result


def get_profile_details(profile: str) -> Optional[Dict[str, Any]]:
    """Get profile details by profile string (e.g., '1/3')."""
    try:
        conscious, unconscious = map(int, profile.split("/"))
    except:
        return None
    
    c_info = PROFILE_LINES.get(conscious, ("Unknown", "", []))
    u_info = PROFILE_LINES.get(unconscious, ("Unknown", "", []))
    
    return {
        "profile": profile,
        "conscious_line": {
            "line": conscious,
            "name": c_info[0],
            "description": f"Conscious {c_info[0]} line",
            "keynotes": c_info[2],
        },
        "unconscious_line": {
            "line": unconscious,
            "name": u_info[0],
            "description": f"Unconscious {u_info[0]} line",
            "keynotes": u_info[2],
        },
        "description": f"Profile {profile}: {c_info[0]}/{u_info[0]}",
        "keynotes": c_info[2] + u_info[2],
    }


def get_cross_details(cross_name: str) -> Optional[Dict[str, Any]]:
    """Get incarnation cross details."""
    return INCARNATION_CROSSES.get(cross_name)


def get_variables_details() -> List[Dict[str, Any]]:
    """Get all 4 PHS variables with left/right variations."""
    result = []
    for key, data in VARIABLES.items():
        result.append({
            "name": data["name"],
            "arrow": "left",
            "color": 1,
            "tone": 1,
            "base": 1,
            "description": f"{data['name']} - {key}",
        })
    return result


def generate_bodygraph_svg(bodygraph_data: Dict[str, Any]) -> str:
    """Generate SVG representation of bodygraph."""
    centers = bodygraph_data.get("centers", {})
    channels = bodygraph_data.get("channels", [])
    
    svg_parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" class="humandesign-bodygraph">',
        '<defs>',
        '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">',
        '<feGaussianBlur stdDeviation="4" result="coloredBlur"/>',
        '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>',
        '</filter>',
        '</defs>',
    ]
    
    # Center positions (from frontend types)
    positions = {
        "Head": (500, 120, 60),
        "Ajna": (500, 260, 55),
        "Throat": (500, 400, 50),
        "G Center": (500, 540, 65),
        "Heart/Ego": (300, 400, 55),
        "Solar Plexus": (700, 400, 55),
        "Spleen": (300, 540, 55),
        "Sacral": (500, 680, 60),
        "Root": (500, 820, 55),
    }
    
    # Draw channels first (behind centers)
    for ch in bodygraph_data.get("channels", []):
        if not ch.get("defined"):
            continue
        start = positions.get(ch["center_start"])
        end = positions.get(ch["center_end"])
        if start and end:
            x1, y1, _ = start
            x2, y2, _ = end
            svg_parts.append(
                f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
                f'stroke="#fbbf24" stroke-width="3" filter="url(#glow)" '
                f'stroke-linecap="round" opacity="0.8"/>'
            )
    
    # Draw centers
    centers = bodygraph_data.get("centers", {})
    for name, center in centers.items():
        pos = positions.get(name)
        if not pos:
            continue
        x, y, r = pos
        defined = center.get("defined", False)
        status = center.get("status", "open")
        
        if status == "defined":
            fill = "#1a1d21"
            stroke = "#fbbf24"
            stroke_width = "3"
            filter_attr = 'filter="url(#glow)"'
        elif status == "undefined":
            fill = "#0f1012"
            stroke = "#fbbf24"
            stroke_width = "1"
            filter_attr = ""
        else:
            fill = "#08090a"
            stroke = "rgba(251,191,36,0.2)"
            stroke_width = "1"
            filter_attr = ""
        
        svg_parts.append(
            f'<circle cx="{x}" cy="{y}" r="{r}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{stroke_width}" {filter_attr}/>'
        )
        
        # Center label
        svg_parts.append(
            f'<text x="{x}" y="{y + 5}" text-anchor="middle" '
            f'font-size="10" fill="#fbbf24" font-family="Inter">{name[:3]}</text>'
        )
    
    svg_parts.append('</svg>')
    return "".join(svg_parts)


async def interpret_chart_with_ai(
    chart_data: Dict[str, Any],
    focus: Optional[str] = None,
    question: Optional[str] = None
) -> Dict[str, Any]:
    """Generate AI interpretation of Human Design chart."""
    from app.services.ai import call_ai_json
    
    hd_type = chart_data.get("hd_type", "")
    authority = chart_data.get("authority", "")
    profile = chart_data.get("profile", "")
    cross = chart_data.get("incarnation_cross", "")
    definition_type = chart_data.get("definition_type", "")
    strategy = chart_data.get("strategy", "")
    signature = chart_data.get("signature", "")
    not_self = chart_data.get("not_self_theme", "")
    centers = chart_data.get("centers", {})
    defined_centers = [k for k, v in centers.items() if v.get("defined")]
    
    focus_areas = {
        "type": f"HD Type: {chart_data.get('hd_type', '')}. Strategy: {chart_data.get('strategy', '')}",
        "authority": f"Authority: {chart_data.get('authority', '')}. Decision-making style.",
        "profile": f"Profile: {chart_data.get('profile', '')}. Life theme and role.",
        "cross": f"Incarnation Cross: {chart_data.get('incarnation_cross', '')}. Life purpose.",
        "centers": f"Defined centers: {', '.join([c for c, v in chart_data.get('centers', {}).items() if v.get('defined')])}",
        "channels": "Defined channels create consistent energy patterns.",
        "gates": "Activated gates show specific energies and lessons.",
        "variables": "PHS variables reveal optimal digestion, environment, perspective, motivation.",
        "deconditioning": f"Not-self theme: {chart_data.get('not_self_theme', '')}. Signature: {chart_data.get('signature', '')}.",
    }
    
    focus_text = focus_areas.get(focus, "General overview of the chart.")
    
    prompt = f"""You are an expert Human Design analyst. Provide a deep, compassionate interpretation.

CHART DATA:
- Type: {chart_data.get('hd_type', '')}
- Authority: {chart_data.get('authority', '')}
- Profile: {chart_data.get('profile', '')}
- Incarnation Cross: {chart_data.get('incarnation_cross', '')}
- Definition Type: {chart_data.get('definition_type', '')}
- Strategy: {chart_data.get('strategy', '')}
- Signature: {chart_data.get('signature', '')}
- Not-Self: {chart_data.get('not_self_theme', '')}
- Defined Centers: {', '.join([k for k, v in chart_data.get('centers', {}).items() if v.get('defined')])}
- Definition Type: {chart_data.get('definition_type', '')}

FOCUS: {focus_text}
USER QUESTION: {question or "None"}

Return JSON with:
{{
  "overview": "2-3 paragraph holistic reading",
  "type_authority": "Type + Authority integration",
  "profile_cross": "Profile + Cross life purpose",
  "centers_channels": "Key defined centers and channels",
  "variables_phs": "PHS variables if available",
  "deconditioning_path": "Practical steps for living design",
  "actionable_guidance": ["3-5 specific practices"],
  "affirmation": "Supportive closing affirmation"
}}

Be psychologically sophisticated, empowering, and specific. Avoid deterministic predictions."""
    
    try:
        result = await call_ai_json(prompt, max_tokens=3000, temperature=0.7)
        return result
    except Exception as e:
        return {
            "overview": f"Your {chart_data.get('hd_type', '')} design with {chart_data.get('authority', '')} authority invites you to {chart_data.get('strategy', '').lower()}.",
            "type_authority": f"As a {chart_data.get('hd_type', '')} with {chart_data.get('authority', '')} authority, your decision-making is uniquely yours.",
            "profile_cross": f"Profile {chart_data.get('profile', '')} on the {chart_data.get('incarnation_cross', '')} cross speaks to your life theme.",
            "centers_channels": f"Your defined centers: {', '.join([k for k, v in chart_data.get('centers', {}).items() if v.get('defined')])}.",
            "variables_phs": "PHS variables available in full reading.",
            "deconditioning_path": f"Release {chart_data.get('not_self_theme', '').lower()}. Embody {chart_data.get('signature', '').lower()}.",
            "actionable_guidance": [
                f"Practice your strategy: {chart_data.get('strategy', '')}",
                f"Trust your {chart_data.get('authority', '')} authority",
                "Observe your not-self theme without judgment",
                "Experiment with your definition type"
            ],
            "affirmation": "I trust my design and follow my strategy and authority."
        }