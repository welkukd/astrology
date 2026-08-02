from flatlib.datetime import Datetime, Date, Time
from flatlib.geopos import GeoPos
from flatlib.chart import Chart
from flatlib import const, aspects
from flatlib.ephem import swe as flatlib_swe
import hashlib
import os
import swisseph
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

SIGN_NAMES = [const.ARIES, const.TAURUS, const.GEMINI, const.CANCER,
              const.LEO, const.VIRGO, const.LIBRA, const.SCORPIO,
              const.SAGITTARIUS, const.CAPRICORN, const.AQUARIUS, const.PISCES]

PLANET_ORDER = [
    const.SUN, const.MOON, const.MERCURY, const.VENUS, const.MARS,
    const.JUPITER, const.SATURN, const.URANUS, const.NEPTUNE, const.PLUTO,
    const.CHIRON, const.NORTH_NODE,
]

HOUSE_KEYS = [
    const.HOUSE1, const.HOUSE2, const.HOUSE3, const.HOUSE4, const.HOUSE5, const.HOUSE6,
    const.HOUSE7, const.HOUSE8, const.HOUSE9, const.HOUSE10, const.HOUSE11, const.HOUSE12,
]

ELEMENTS = {
    const.ARIES: "Fire", const.LEO: "Fire", const.SAGITTARIUS: "Fire",
    const.TAURUS: "Earth", const.VIRGO: "Earth", const.CAPRICORN: "Earth",
    const.GEMINI: "Air", const.LIBRA: "Air", const.AQUARIUS: "Air",
    const.CANCER: "Water", const.SCORPIO: "Water", const.PISCES: "Water",
}

MODALITIES = {
    const.ARIES: "Cardinal", const.CANCER: "Cardinal", const.LIBRA: "Cardinal", const.CAPRICORN: "Cardinal",
    const.TAURUS: "Fixed", const.LEO: "Fixed", const.SCORPIO: "Fixed", const.AQUARIUS: "Fixed",
    const.GEMINI: "Mutable", const.VIRGO: "Mutable", const.SAGITTARIUS: "Mutable", const.PISCES: "Mutable",
}

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
    "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
    "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati",
]

NAKSHATRA_LORDS = {
    "Ashwini": "Ketu", "Bharani": "Venus", "Krittika": "Sun",
    "Rohini": "Moon", "Mrigashira": "Mars", "Ardra": "Rahu",
    "Punarvasu": "Jupiter", "Pushya": "Saturn", "Ashlesha": "Mercury",
    "Magha": "Ketu", "Purva Phalguni": "Venus", "Uttara Phalguni": "Sun",
    "Hasta": "Moon", "Chitra": "Mars", "Swati": "Rahu",
    "Vishakha": "Jupiter", "Anuradha": "Saturn", "Jyeshtha": "Mercury",
    "Mula": "Ketu", "Purva Ashadha": "Venus", "Uttara Ashadha": "Sun",
    "Shravana": "Moon", "Dhanishta": "Mars", "Shatabhisha": "Rahu",
    "Purva Bhadrapada": "Jupiter", "Uttara Bhadrapada": "Saturn",
    "Revati": "Mercury",
}

NAKSHATRA_SPAN = 13 + 20 / 60  # 13°20' = 13.3333...

ASPECT_NAMES = {0: "conjunction", 30: "semisextile", 36: "quintile", 45: "semisquare",
                60: "sextile", 72: "biquintile", 90: "square", 108: "sesquiquintile",
                120: "trine", 135: "sesquisquare", 144: "biquintile", 150: "quincunx", 180: "opposition"}

HOUSE_SYSTEM_MAP = {
    "Placidus": const.HOUSES_PLACIDUS,
    "Koch": const.HOUSES_KOCH,
    "Whole Sign": const.HOUSES_WHOLE_SIGN,
    "Equal": const.HOUSES_EQUAL,
    "Porphyry": const.HOUSES_PORPHYRIUS,
    "Regiomontanus": const.HOUSES_REGIOMONTANUS,
    "Campanus": const.HOUSES_CAMPANUS,
    "Morinus": const.HOUSES_MORINUS,
    "Polich-Page": const.HOUSES_POLICH_PAGE,
    "Alcabitius": const.HOUSES_ALCABITUS,
}


def _get_utc_offset(timezone_str: str) -> float:
    if not timezone_str or not timezone_str.strip():
        return 5.5
    try:
        dt_now = datetime.now(ZoneInfo(timezone_str))
        offset_seconds = dt_now.utcoffset().total_seconds() if dt_now.utcoffset() else 0
        return offset_seconds / 3600
    except (KeyError, TypeError, ValueError):
        return 5.5


def _sign_name(lon: float) -> str:
    idx = int(lon // 30) % 12
    return SIGN_NAMES[idx]


def _element(sign: str) -> str:
    return ELEMENTS.get(sign, "")


def _modality(sign: str) -> str:
    return MODALITIES.get(sign, "")


def _nakshatra(lon: float) -> tuple[str, int, str]:
    """Returns (nakshatra_name, pada, nakshatra_lord) for a given longitude."""
    idx = int((lon % 360) / NAKSHATRA_SPAN) % 27
    name = NAKSHATRAS[idx]
    start_lon = idx * NAKSHATRA_SPAN
    offset = (lon % 360) - start_lon
    pada = int(offset / (NAKSHATRA_SPAN / 4)) + 1
    lord = NAKSHATRA_LORDS[name]
    return name, pada, lord


def _generate_id(date: str, time: str, lat: float, lon: float, tz: str, zodiac: str, house_system: str) -> str:
    key = f"{date}|{time}|{lat}|{lon}|{tz}|{zodiac}|{house_system}"
    h = hashlib.sha256(key.encode()).hexdigest()
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def _setup_ephemeris():
    try:
        import flatlib
        swefiles = os.path.join(os.path.dirname(flatlib.__file__), 'resources', 'swefiles')
        if os.path.isdir(swefiles):
            flatlib_swe.setPath(swefiles)
    except Exception:
        pass


def _patch_swe_object():
    _setup_ephemeris()

    def _f(v):
        while isinstance(v, (tuple, list)):
            v = v[0]
        return float(v)

    def safe_calc_ut(jd, sweObj):
        try:
            data, flg = swisseph.calc_ut(jd, sweObj, swisseph.FLG_SWIEPH | swisseph.FLG_SPEED)
            data = [_f(v) for v in data]
            return data if len(data) >= 5 else data + [0.0] * (5 - len(data))
        except Exception:
            try:
                data, flg = swisseph.calc_ut(jd, sweObj, swisseph.FLG_SPEED)
                data = [_f(v) for v in data]
                return data if len(data) >= 5 else data + [0.0] * (5 - len(data))
            except Exception:
                return [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

    def patched_sweObject(obj, jd):
        sweObj = flatlib_swe.SWE_OBJECTS[obj]
        data = safe_calc_ut(jd, sweObj)
        return {
            'id': obj,
            'lon': data[0],
            'lat': data[1],
            'lonspeed': data[3],
            'latspeed': data[4],
        }

    flatlib_swe.sweObject = patched_sweObject

    def patched_sweObjectLon(obj, jd):
        sweObj = flatlib_swe.SWE_OBJECTS[obj]
        data = safe_calc_ut(jd, sweObj)
        return data[0]

    flatlib_swe.sweObjectLon = patched_sweObjectLon


_patch_swe_object()


def calculate_chart(
    date_str: str,
    time_str: str | None,
    time_unknown: bool,
    latitude: float,
    longitude: float,
    timezone_str: str,
    zodiac: str = "tropical",
    house_system: str = "Placidus",
    ayanamsa: str | None = None,
) -> dict:
    year, month, day = map(int, date_str.split("-"))
    utc_offset = _get_utc_offset(timezone_str)

    if time_unknown or not time_str:
        h, m = 12, 0
        utc_offset = 0
    else:
        h, m = map(int, time_str.split(":"))

    date = Date(f"{year}/{month:02d}/{day:02d}")
    time = Time(f"{h:02d}:{m:02d}")
    utcoffset_obj = Time(utc_offset)
    dt = Datetime(date, time, utcoffset_obj)
    pos = GeoPos(latitude, longitude)
    hsys = HOUSE_SYSTEM_MAP.get(house_system, const.HOUSES_PLACIDUS)

    chart = Chart(dt, pos, IDs=const.LIST_OBJECTS, hsys=hsys)

    planets = []
    for pid in PLANET_ORDER:
        obj = chart.getObject(pid)
        if obj is None:
            continue
        sign = _sign_name(obj.lon)
        degree_in_sign = obj.lon % 30

        house_num = None
        for i, hk in enumerate(HOUSE_KEYS):
            h = chart.getHouse(hk)
            next_hk = HOUSE_KEYS[(i + 1) % 12]
            next_h = chart.getHouse(next_hk)
            h_lon = h.lon % 360
            next_lon = next_h.lon % 360
            obj_lon = obj.lon % 360
            if next_lon > h_lon:
                if h_lon <= obj_lon < next_lon:
                    house_num = i + 1
                    break
            else:
                if obj_lon >= h_lon or obj_lon < next_lon:
                    house_num = i + 1
                    break

        retrograde = getattr(obj, 'lonspeed', 0) < 0 if hasattr(obj, 'lonspeed') else False

        planets.append({
            "name": obj.id,
            "longitude": round(obj.lon, 4),
            "latitude": round(obj.lat, 4),
            "speed": round(getattr(obj, 'lonspeed', 0), 4),
            "sign": sign,
            "degree_in_sign": round(degree_in_sign, 4),
            "house": house_num,
            "retrograde": retrograde,
            "element": _element(sign),
            "modality": _modality(sign),
            "nakshatra": _nakshatra(obj.lon)[0],
            "nakshatra_pada": _nakshatra(obj.lon)[1],
            "nakshatra_lord": _nakshatra(obj.lon)[2],
        })

    houses = []
    for i, hk in enumerate(HOUSE_KEYS):
        h = chart.getHouse(hk)
        if h:
            houses.append({
                "number": i + 1,
                "longitude": round(h.lon, 4),
                "sign": _sign_name(h.lon),
                "degree_in_sign": round(h.lon % 30, 4),
            })

    aspect_list = []
    objects = [chart.getObject(pid) for pid in PLANET_ORDER if chart.getObject(pid)]
    for i, o1 in enumerate(objects):
        for o2 in objects[i + 1:]:
            a = aspects.getAspect(o1, o2, const.ALL_ASPECTS)
            if a and a.exists() and a.type in ASPECT_NAMES:
                aspect_list.append({
                    "planet1": o1.id,
                    "planet2": o2.id,
                    "aspect": ASPECT_NAMES[a.type],
                    "orb": round(abs(a.orb), 2),
                    "applying": a.movement() == "Applicative",
                })

    chart_id = _generate_id(date_str, time_str or "unknown", latitude, longitude, timezone_str, zodiac, house_system)

    return {
        "chart_id": chart_id,
        "subject": {
            "name": None,
            "date": date_str,
            "time": time_str or "12:00",
            "time_unknown": time_unknown,
            "latitude": latitude,
            "longitude": longitude,
            "timezone": timezone_str,
            "zodiac": zodiac,
            "house_system": house_system,
            "ayanamsa": ayanamsa,
        },
        "planets": planets,
        "houses": houses,
        "aspects": aspect_list,
        "metadata": {
            "calculated_at": datetime.now(timezone.utc).isoformat(),
            "engine": "flatlib",
            "ephemeris": "Moshier / Swiss Ephemeris",
            "precision_note": "0.001 arcseconds (Swiss Eph) / 0.1 arcsec (Moshier)",
            "source": "self-hosted flatlib",
        },
        "vedic": {
            "moon_nakshatra": _nakshatra(chart.getObject(const.MOON).lon)[0] if chart.getObject(const.MOON) else "Unknown",
            "moon_nakshatra_pada": _nakshatra(chart.getObject(const.MOON).lon)[1] if chart.getObject(const.MOON) else 0,
            "moon_nakshatra_lord": _nakshatra(chart.getObject(const.MOON).lon)[2] if chart.getObject(const.MOON) else "Unknown",
            "birth_star": _nakshatra(chart.getObject(const.MOON).lon)[0] if chart.getObject(const.MOON) else "Unknown",
            "birth_nakshatra_lord": _nakshatra(chart.getObject(const.MOON).lon)[2] if chart.getObject(const.MOON) else "Unknown",
        },
    }
