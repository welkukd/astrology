from flatlib.datetime import Datetime, Date, Time
from flatlib.geopos import GeoPos
from flatlib.chart import Chart
from flatlib import const, aspects
import hashlib
from datetime import datetime, timezone

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

ASPECT_NAMES = {0: "conjunction", 30: "semisextile", 36: "quintile", 45: "semisquare",
                  60: "sextile", 72: "biquintile", 90: "square", 108: "sesquiquintile",
                  120: "trine", 135: "sesquisquare", 144: "quintile", 150: "quincunx", 180: "opposition"}

HOUSE_SYSTEM_MAP = {
    "Placidus": const.HOUSES_PLACIDUS,
    "Koch": const.HOUSES_KOCH,
    "Whole_Sign": const.HOUSES_WHOLE_SIGN,
    "Equal": const.HOUSES_EQUAL,
    "Porphyry": const.HOUSES_PORPHYRIUS,
    "Regiomontanus": const.HOUSES_REGIOMONTANUS,
    "Campanus": const.HOUSES_CAMPANUS,
    "Morinus": const.HOUSES_MORINUS,
    "Polich_Page": const.HOUSES_POLICH_PAGE,
    "Alcabitius": const.HOUSES_ALCABITUS,
}

TIMEZONE_OFFSETS = {
    "America/New_York": -5, "America/Chicago": -6, "America/Denver": -7,
    "America/Los_Angeles": -8, "America/Anchorage": -9, "Pacific/Honolulu": -10,
    "America/Phoenix": -7, "America/Juneau": -9,
    "Europe/London": 0, "Europe/Paris": 1, "Europe/Berlin": 1, "Europe/Madrid": 1,
    "Europe/Moscow": 3, "Europe/Istanbul": 3, "Europe/Athens": 2, "Europe/Rome": 1,
    "Asia/Kolkata": 5.5, "Asia/Shanghai": 8, "Asia/Tokyo": 9, "Asia/Seoul": 9,
    "Asia/Dubai": 4, "Asia/Singapore": 8, "Asia/Hong_Kong": 8,
    "Australia/Sydney": 11, "Australia/Melbourne": 11, "Australia/Perth": 8,
    "Australia/Brisbane": 10,
    "Africa/Cairo": 2, "Africa/Johannesburg": 2, "Africa/Lagos": 1,
    "America/Sao_Paulo": -3, "America/Argentina/Buenos_Aires": -3,
    "America/Mexico_City": -6, "America/Toronto": -5,
    "Pacific/Auckland": 13, "Pacific/Fiji": 12,
}


def _get_utc_offset(timezone_str: str, date_str: str) -> float:
    if timezone_str in TIMEZONE_OFFSETS:
        return TIMEZONE_OFFSETS[timezone_str]
    return 0


def _sign_name(lon: float) -> str:
    idx = int(lon // 30) % 12
    return SIGN_NAMES[idx]


def _element(sign: str) -> str:
    return ELEMENTS.get(sign, "")


def _modality(sign: str) -> str:
    return MODALITIES.get(sign, "")


def _generate_id(date: str, time: str, lat: float, lon: float, tz: str, zodiac: str, house_system: str) -> str:
    key = f"{date}|{time}|{lat}|{lon}|{tz}|{zodiac}|{house_system}"
    return hashlib.sha256(key.encode()).hexdigest()[:16]


def calculate_chart(
    date_str: str,
    time_str: str | None,
    time_unknown: bool,
    latitude: float,
    longitude: float,
    timezone_str: str,
    house_system: str = "Placidus",
) -> dict:
    year, month, day = map(int, date_str.split("-"))
    utc_offset = _get_utc_offset(timezone_str, date_str)

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

        planets.append({
            "name": obj.id,
            "longitude": round(obj.lon, 4),
            "latitude": round(obj.lat, 4),
            "speed": round(getattr(obj, 'lonspeed', 0), 4),
            "sign": sign,
            "degree_in_sign": round(degree_in_sign, 4),
            "house": house_num,
            "retrograde": getattr(obj, 'retrograde', False),
            "element": _element(sign),
            "modality": _modality(sign),
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

    chart_id = _generate_id(date_str, time_str or "unknown", latitude, longitude, timezone_str, "tropical", house_system)

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
            "zodiac": "tropical",
            "house_system": house_system,
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
    }
