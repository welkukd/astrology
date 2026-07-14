"""Transit calculator — compares current planetary positions to a natal chart."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import swisseph as swe

# ── Swiss Ephemeris setup ────────────────────────────────────────────────
# Use the same monkeypatch approach as calculator.py
try:
    import flatlib
    import os
    from flatlib.ephem import swe as flatlib_swe

    swefiles = os.path.join(os.path.dirname(flatlib.__file__), "resources", "swefiles")
    if os.path.isdir(swefiles):
        flatlib_swe.setPath(swefiles)
except Exception:
    pass

# Planet constants mapped to swisseph IDs
TRANSIT_PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mercury": swe.MERCURY,
    "Venus": swe.VENUS,
    "Mars": swe.MARS,
    "Jupiter": swe.JUPITER,
    "Saturn": swe.SATURN,
    "Uranus": swe.URANUS,
    "Neptune": swe.NEPTUNE,
    "Pluto": swe.PLUTO,
    "North Node": swe.TRUE_NODE,
    "Chiron": swe.CHIRON,
}

# Aspect definitions: name → (angle, default orb)
ASPECTS = {
    "conjunction": (0, 8.0),
    "sextile": (60, 6.0),
    "square": (90, 8.0),
    "trine": (120, 8.0),
    "opposition": (180, 8.0),
}

SIGN_NAMES = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]


def _sign_name(lon: float) -> str:
    return SIGN_NAMES[int(lon // 30) % 12]


def _normalize(lon: float) -> float:
    return lon % 360


def _angle_diff(a: float, b: float) -> float:
    """Smallest angle between two longitudes (0–180)."""
    d = abs(_normalize(a) - _normalize(b))
    return d if d <= 180 else 360 - d


def _calc_planet(planet_id: int, jd: float) -> dict | None:
    """Calculate a planet's position for a Julian day. Returns None on failure."""
    try:
        data, _ = swe.calc_ut(jd, planet_id, swe.FLG_SWIEPH | swe.FLG_SPEED)
        lon = float(data[0][0])
        lat = float(data[0][1])
        speed = float(data[0][3])
        return {"longitude": lon, "latitude": lat, "speed": speed, "retrograde": speed < 0}
    except Exception:
        try:
            data, _ = swe.calc_ut(jd, planet_id, swe.FLG_SPEED)
            lon = float(data[0][0])
            lat = float(data[0][1])
            speed = float(data[0][3])
            return {"longitude": lon, "latitude": lat, "speed": speed, "retrograde": speed < 0}
        except Exception:
            return None


def _jd_now() -> float:
    """Julian day for the current moment (UTC)."""
    now = datetime.now(timezone.utc)
    return swe.julday(now.year, now.month, now.day, now.hour + now.minute / 60.0)


def _check_aspect(natal_lon: float, transit_lon: float, aspect_name: str) -> dict | None:
    """Check if a transit-natal pair forms a specific aspect within orb."""
    angle, default_orb = ASPECTS[aspect_name]
    diff = _angle_diff(transit_lon, natal_lon)
    orb = abs(diff - angle)
    if orb <= default_orb:
        return {"aspect": aspect_name, "angle": angle, "orb": round(orb, 2)}
    return None


def _find_exact_transit_dates(
    natal_lon: float,
    transit_planet_id: int,
    aspect_name: str,
    months: int = 12,
) -> list[str]:
    """
    Iterate forward day-by-day to find exact aspect dates.
    Returns ISO date strings of exact hits within the given window.
    """
    angle, _ = ASPECTS[aspect_name]
    jd_start = _jd_now()
    jd_end = jd_start + months * 30.44  # approximate days in period
    results: list[str] = []
    prev_diff: float | None = None

    jd = jd_start
    while jd <= jd_end:
        pos = _calc_planet(transit_planet_id, jd)
        if pos is None:
            jd += 1
            continue

        transit_lon = _normalize(pos["longitude"])
        diff = _angle_diff(transit_lon, natal_lon)
        orb_at = abs(diff - angle)

        # Detect crossing: orb was > 0.5 yesterday, now < 0.5
        if prev_diff is not None and prev_diff > 0.5 and orb_at < 0.5:
            # Refine to approximate exact date
            dt = swe.revjul(jd)
            date_str = f"{int(dt[0]):04d}-{int(dt[1]):02d}-{int(dt[2]):02d}"
            if date_str not in results:
                results.append(date_str)

        prev_diff = orb_at
        jd += 1

    return results


# ── Public API ───────────────────────────────────────────────────────────


def calculate_transits(natal_chart: dict) -> dict:
    """
    Calculate current transits to a natal chart.

    Args:
        natal_chart: dict with 'planets' (list of dicts with 'name', 'longitude')
                     and optionally 'houses', 'aspects'.

    Returns:
        dict with:
        - current_planets: list of current planetary positions
        - active_transits: list of transit aspects to natal positions
        - transit_dates: dict of planet pairs with exact transit dates
    """
    jd = _jd_now()

    # ── Current planetary positions ──────────────────────────────────────
    current_planets: list[dict] = []
    for name, pid in TRANSIT_PLANETS.items():
        pos = _calc_planet(pid, jd)
        if pos is None:
            continue
        lon = _normalize(pos["longitude"])
        current_planets.append({
            "name": name,
            "longitude": round(lon, 4),
            "sign": _sign_name(lon),
            "degree_in_sign": round(lon % 30, 4),
            "speed": round(pos["speed"], 4),
            "retrograde": pos["retrograde"],
        })

    # ── Active transits ──────────────────────────────────────────────────
    natal_planets = natal_chart.get("planets", [])
    natal_houses = natal_chart.get("houses", [])

    # Build list of natal points to aspect against (planets + house cusps)
    natal_points: list[dict[str, Any]] = []
    for p in natal_planets:
        natal_points.append({
            "type": "planet",
            "name": p["name"],
            "longitude": p["longitude"],
        })
    for h in natal_houses:
        natal_points.append({
            "type": "house_cusp",
            "name": f"House {h['number']}",
            "longitude": h["longitude"],
        })

    active_transits: list[dict] = []
    for tp in current_planets:
        transit_lon = tp["longitude"]
        transit_name = tp["name"]

        for np in natal_points:
            natal_lon = np["longitude"]
            for asp_name in ASPECTS:
                result = _check_aspect(natal_lon, transit_lon, asp_name)
                if result:
                    active_transits.append({
                        "transit_planet": transit_name,
                        "natal_point": np["name"],
                        "natal_point_type": np["type"],
                        "aspect": result["aspect"],
                        "angle": result["angle"],
                        "orb": result["orb"],
                        "transit_longitude": transit_lon,
                        "natal_longitude": natal_lon,
                    })

    # ── Exact transit dates (major planets only, skip fast movers) ───────
    # Only compute future dates for slow/mid planets to natal planets
    slow_planets = {
        "Jupiter": TRANSIT_PLANETS["Jupiter"],
        "Saturn": TRANSIT_PLANETS["Saturn"],
        "Uranus": TRANSIT_PLANETS["Uranus"],
        "Neptune": TRANSIT_PLANETS["Neptune"],
        "Pluto": TRANSIT_PLANETS["Pluto"],
        "Chiron": TRANSIT_PLANETS["Chiron"],
    }
    major_aspects = ["conjunction", "square", "opposition", "trine"]

    transit_dates: dict[str, list[str]] = {}
    for np in natal_planets:
        natal_lon = np["longitude"]
        for tp_name, tp_id in slow_planets.items():
            for asp_name in major_aspects:
                # Only compute if currently within ~15° orb (approaching)
                tp_pos = _calc_planet(tp_id, jd)
                if tp_pos is None:
                    continue
                diff = _angle_diff(_normalize(tp_pos["longitude"]), natal_lon)
                angle = ASPECTS[asp_name][0]
                if abs(diff - angle) <= 15.0:
                    dates = _find_exact_transit_dates(natal_lon, tp_id, asp_name, months=12)
                    if dates:
                        key = f"{tp_name} {asp_name} natal {np['name']}"
                        transit_dates[key] = dates

    return {
        "current_planets": current_planets,
        "active_transits": active_transits,
        "transit_dates": transit_dates,
        "metadata": {
            "calculated_at": datetime.now(timezone.utc).isoformat(),
            "julian_day": round(jd, 6),
        },
    }


def get_transit_summary(natal_chart: dict) -> str:
    """
    Return a brief summary of current major transits.
    Useful for AI interpretation prompts.
    """
    result = calculate_transits(natal_chart)
    lines: list[str] = []

    # Group active transits by transit planet
    by_planet: dict[str, list[dict]] = {}
    for t in result["active_transits"]:
        tp = t["transit_planet"]
        by_planet.setdefault(tp, []).append(t)

    # Only include major aspects in summary
    major = {"conjunction", "square", "opposition", "trine", "sextile"}

    for planet, transits in sorted(by_planet.items()):
        major_transits = [t for t in transits if t["aspect"] in major]
        if not major_transits:
            continue
        for t in major_transits:
            applying = "applying" if t["orb"] > 0.1 else "exact"
            lines.append(
                f"Transiting {t['transit_planet']} {t['aspect']} natal {t['natal_point']} "
                f"(orb {t['orb']}°, {applying})"
            )

    # Add upcoming exact dates for slow planets
    if result["transit_dates"]:
        lines.append("")
        lines.append("Upcoming exact transit hits:")
        for pair, dates in sorted(result["transit_dates"].items()):
            date_str = ", ".join(dates[:3])  # show up to 3 dates
            lines.append(f"  {pair}: {date_str}")

    if not lines:
        return "No major transits active at this time."

    return "\n".join(lines)
