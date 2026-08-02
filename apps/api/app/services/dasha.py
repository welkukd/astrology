from datetime import datetime, timedelta, timezone
from dateutil.relativedelta import relativedelta


NAKSHATRA_NAMES = [
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

MAHADASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
    "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17,
}

DASHA_SEQUENCE = [
    "Ketu", "Venus", "Sun", "Moon", "Mars",
    "Rahu", "Jupiter", "Saturn", "Mercury",
]

NAKSHATRA_SPAN = 13 + 20 / 60  # 13°20' = 13.3333...


def _get_moon_longitude(natal_chart: dict) -> float:
    for planet in natal_chart.get("planets", []):
        if planet["name"] == "Moon":
            return planet["longitude"] % 360
    raise ValueError("Moon not found in natal chart")


def _get_nakshatra_index(moon_lon: float) -> int:
    return int(moon_lon / NAKSHATRA_SPAN) % 27


def _get_nakshatra_pada(moon_lon: float, nakshatra_index: int) -> int:
    start_lon = nakshatra_index * NAKSHATRA_SPAN
    offset_in_nakshatra = moon_lon - start_lon
    pada_span = NAKSHATRA_SPAN / 4
    return int(offset_in_nakshatra / pada_span) + 1


def _next_planet(current: str) -> str:
    idx = DASHA_SEQUENCE.index(current)
    return DASHA_SEQUENCE[(idx + 1) % 9]


def _calculate_antardashas(
    mahadasha_lord: str, mahadasha_start: datetime, mahadasha_end: datetime
) -> list[dict]:
    total_days = (mahadasha_end - mahadasha_start).days
    mahadasha_years = MAHADASHA_YEARS[mahadasha_lord]
    antardashas = []
    current_start = mahadasha_start

    lord = mahadasha_lord
    for _ in range(9):
        ad_years = mahadasha_years * MAHADASHA_YEARS[lord] / 120
        ad_days = total_days * ad_years / mahadasha_years
        ad_end = current_start + timedelta(days=ad_days)
        if ad_end > mahadasha_end:
            ad_end = mahadasha_end

        antardashas.append({
            "planet": lord,
            "start_date": current_start.strftime("%Y-%m-%d"),
            "end_date": ad_end.strftime("%Y-%m-%d"),
        })
        current_start = ad_end
        lord = _next_planet(lord)

    return antardashas


def calculate_dasha(natal_chart: dict) -> dict:
    moon_lon = _get_moon_longitude(natal_chart)
    nakshatra_idx = _get_nakshatra_index(moon_lon)
    nakshatra_name = NAKSHATRA_NAMES[nakshatra_idx]
    nakshatra_pada = _get_nakshatra_pada(moon_lon, nakshatra_idx)
    starting_lord = NAKSHATRA_LORDS[nakshatra_name]

    birth_date_str = natal_chart["subject"]["date"]
    birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")

    start_lon = nakshatra_idx * NAKSHATRA_SPAN
    fraction_elapsed = (moon_lon - start_lon) / NAKSHATRA_SPAN
    first_dasha_years = MAHADASHA_YEARS[starting_lord]
    remaining_fraction = 1.0 - fraction_elapsed
    first_dasha_days = int(first_dasha_years * 365.25 * remaining_fraction)
    first_dasha_start = birth_date
    first_dasha_end = birth_date + timedelta(days=first_dasha_days)

    mahadashas = []
    current_lord = starting_lord
    current_start = first_dasha_start

    for _ in range(9):
        if current_lord == starting_lord and len(mahadashas) == 0:
            end = first_dasha_end
        else:
            years = MAHADASHA_YEARS[current_lord]
            end = current_start + relativedelta(years=years)

        antardashas = _calculate_antardashas(current_lord, current_start, end)
        mahadashas.append({
            "planet": current_lord,
            "start_date": current_start.strftime("%Y-%m-%d"),
            "end_date": end.strftime("%Y-%m-%d"),
            "antardashas": antardashas,
        })
        current_start = end
        current_lord = _next_planet(current_lord)

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    current_mahadasha = None
    current_antardasha = None
    for md in mahadashas:
        md_start = datetime.strptime(md["start_date"], "%Y-%m-%d")
        md_end = datetime.strptime(md["end_date"], "%Y-%m-%d")
        if md_start <= now <= md_end:
            current_mahadasha = md["planet"]
            for ad in md["antardashas"]:
                ad_start = datetime.strptime(ad["start_date"], "%Y-%m-%d")
                ad_end = datetime.strptime(ad["end_date"], "%Y-%m-%d")
                if ad_start <= now <= ad_end:
                    current_antardasha = ad["planet"]
                    break
            break

    current_period = None
    if current_mahadasha and current_antardasha:
        for md in mahadashas:
            if md["planet"] == current_mahadasha:
                md_end = datetime.strptime(md["end_date"], "%Y-%m-%d")
                for ad in md["antardashas"]:
                    if ad["planet"] == current_antardasha:
                        ad_start = datetime.strptime(ad["start_date"], "%Y-%m-%d")
                        ad_end = datetime.strptime(ad["end_date"], "%Y-%m-%d")
                        current_period = {
                            "mahadasha": current_mahadasha,
                            "mahadasha_end": md["end_date"],
                            "mahadasha_remaining": str(md_end - now).split(",")[0],
                            "antardasha": current_antardasha,
                            "antardasha_end": ad["end_date"],
                            "antardasha_remaining": str(ad_end - now).split(",")[0],
                        }
                        break
                break

    return {
        "birth_nakshatra": nakshatra_name,
        "nakshatra_pada": nakshatra_pada,
        "moon_longitude": round(moon_lon, 4),
        "starting_lord": starting_lord,
        "current_mahadasha": current_mahadasha,
        "current_antardasha": current_antardasha,
        "mahadashas": mahadashas,
        "current_period": current_period,
    }


def get_dasha_summary(natal_chart: dict) -> str:
    result = calculate_dasha(natal_chart)
    nakshatra = result["birth_nakshatra"]
    pada = result["nakshatra_pada"]
    md = result["current_mahadasha"]
    ad = result["current_antardasha"]
    period = result["current_period"]

    lines = [
        f"Birth Nakshatra: {nakshatra} Pada {pada}",
        f"Starting Lord: {result['starting_lord']}",
    ]

    if md and ad and period:
        lines.append(f"Current Mahadasha: {md} (ends {period['mahadasha_end']})")
        lines.append(f"Current Antardasha: {ad} (ends {period['antardasha_end']})")
        lines.append(f"Remaining: {period['antardasha_remaining']} in Antardasha, {period['mahadasha_remaining']} in Mahadasha")
    else:
        lines.append("Current period: Could not determine")

    return "\n".join(lines)
