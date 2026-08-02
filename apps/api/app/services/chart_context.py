from app.services.dasha import calculate_dasha


def build_chart_context(chart: dict) -> str:
    """Build a rich text summary of the chart for the AI prompt.
    Includes planetary positions with degrees, nakshatras, houses,
    aspects, and full Vimshottari Dasha timeline with dates."""
    planets = chart.get("planets", [])
    houses = chart.get("houses", [])
    aspects = chart.get("aspects", [])
    subject = chart.get("subject", {})
    vedic = chart.get("vedic", {})

    lines = [
        f"Name: {subject.get('name', 'Unknown')}",
        f"Birth Date: {subject.get('date')}",
        f"Birth Time: {subject.get('time', 'Unknown')}",
        f"Location: {subject.get('latitude')}, {subject.get('longitude')}",
        f"Zodiac: {subject.get('zodiac', 'tropical')} | Houses: {subject.get('house_system', 'Placidus')}",
    ]

    if vedic.get("moon_nakshatra"):
        lines.append(f"Birth Nakshatra: {vedic['moon_nakshatra']} Pada {vedic.get('moon_nakshatra_pada', '?')} (Lord: {vedic.get('moon_nakshatra_lord', '?')})")

    lines.append("")
    lines.append("=== PLANETARY POSITIONS ===")
    for p in planets:
        retro = " (Retrograde)" if p.get("retrograde") else ""
        nak = f" | Nakshatra: {p.get('nakshatra', '?')} (Pada {p.get('nakshatra_pada', '?')}, Lord {p.get('nakshatra_lord', '?')})" if p.get("nakshatra") else ""
        lines.append(
            f"  {p['name']}: {p['sign']} {p.get('degree_in_sign', 0):.2f}° "
            f"in House {p.get('house', '?')}{retro}{nak}"
        )

    lines.append("")
    lines.append("=== HOUSE CUSPS ===")
    for h in houses:
        lines.append(f"  House {h['number']}: {h['sign']} {h.get('degree_in_sign', 0):.2f}°")

    lines.append("")
    lines.append("=== MAJOR ASPECTS ===")
    for a in aspects:
        applying = " (Applying)" if a.get("applying") else ""
        lines.append(
            f"  {a['planet1']} {a['aspect']} {a['planet2']} "
            f"(orb {a.get('orb', 0):.2f}°){applying}"
        )

    lines.append("")
    lines.append("=== VIMSHOTTARI DASHA TIMELINE ===")
    try:
        dasha = calculate_dasha(chart)
        lines.append(f"  Birth Nakshatra: {dasha.get('birth_nakshatra', '?')} Pada {dasha.get('nakshatra_pada', '?')}")
        lines.append(f"  Starting Lord: {dasha.get('starting_lord', '?')}")
        lines.append("")
        cp = dasha.get("current_period")
        if cp:
            lines.append(
                f"  *** CURRENT PERIOD: {cp['mahadasha']} Mahadasha "
                f"(ends {cp['mahadasha_end']}, {cp['mahadasha_remaining']} remaining) ***"
            )
            lines.append(
                f"  *** CURRENT SUB-PERIOD: {cp['antardasha']} Antardasha "
                f"(ends {cp['antardasha_end']}, {cp['antardasha_remaining']} remaining) ***"
            )
            lines.append("")
        for md in dasha.get("mahadashas", []):
            current = " *** ACTIVE NOW ***" if md.get("planet") == dasha.get("current_mahadasha") else ""
            lines.append(f"  {md['planet']} Mahadasha: {md['start_date']} to {md['end_date']}{current}")
            for ad in md.get("antardashas", []):
                ad_current = " (NOW)" if ad.get("planet") == dasha.get("current_antardasha") and md.get("planet") == dasha.get("current_mahadasha") else ""
                lines.append(f"      {ad['planet']} Antardasha: {ad['start_date']} to {ad['end_date']}{ad_current}")
    except Exception as e:
        lines.append(f"  Dasha calculation error: {e}")

    return "\n".join(lines)
