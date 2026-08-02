import html
from datetime import datetime


def _esc(text: str) -> str:
    return html.escape(str(text)) if text else ""


def generate_reading_pdf(reading: dict, chart: dict, language: str = "ml") -> bytes:
    """Generate a styled PDF report from the reading data."""
    sections = reading.get("sections", {})
    subject = chart.get("subject", {})
    planets = chart.get("planets", [])
    houses = chart.get("houses", [])
    aspects = chart.get("aspects", [])
    dasha_data = reading.get("dasha", {})

    font_family = "'Noto Sans Malayalam', 'Noto Sans', sans-serif" if language == "ml" else "'Noto Sans', sans-serif"

    # Cover + tables
    html_parts = [f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@page {{ size: A4; margin: 2cm; }}
body {{ font-family: {font_family}; font-size: 11pt; line-height: 1.6; color: #1a1a1a; }}
h1 {{ font-size: 22pt; color: #6d28d9; text-align: center; margin-top: 40px; }}
h2 {{ font-size: 15pt; color: #6d28d9; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 24px; }}
h3 {{ font-size: 12pt; color: #4c1d95; }}
table {{ width: 100%; border-collapse: collapse; margin: 12px 0; }}
th, td {{ border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; font-size: 10pt; }}
th {{ background: #f3f4f6; }}
.current {{ background: #fef3c7; font-weight: bold; }}
.section {{ white-space: pre-wrap; margin: 10px 0 20px; }}
</style></head><body>
"""]

    # Cover
    html_parts.append(f"""
<h1>{_esc(subject.get('name', 'Birth Chart'))} - Astrology Report</h1>
<p style="text-align:center; color:#6b7280;">
  {_esc(subject.get('date', ''))} | {_esc(subject.get('time', 'Unknown'))}<br>
  {_esc(str(subject.get('latitude', '')))}, {_esc(str(subject.get('longitude', '')))}
</p>
""")

    # Planet positions table
    if planets:
        html_parts.append("<h2>Planetary Positions</h2><table><tr><th>Planet</th><th>Sign</th><th>Degree</th><th>House</th><th>Nakshatra</th></tr>")
        for p in planets:
            html_parts.append(
                f"<tr><td>{_esc(p.get('name', ''))}</td><td>{_esc(p.get('sign', ''))}</td>"
                f"<td>{p.get('degree_in_sign', 0):.2f}°</td><td>{p.get('house', '?')}</td>"
                f"<td>{_esc(p.get('nakshatra', '—'))}</td></tr>"
            )
        html_parts.append("</table>")

    # Dasha timeline
    mahadashas = dasha_data.get("mahadashas", [])
    current_md = dasha_data.get("current_mahadasha")
    current_ad = dasha_data.get("current_antardasha")
    if mahadashas:
        html_parts.append("<h2>Vimshottari Dasha Timeline</h2><table><tr><th>Mahadasha</th><th>Start</th><th>End</th><th>Current Antardasha</th></tr>")
        for md in mahadashas:
            cls = ' class="current"' if md.get("planet") == current_md else ""
            ad_name = current_ad if md.get("planet") == current_md else ""
            html_parts.append(
                f"<tr{cls}><td>{_esc(md.get('planet', ''))}</td>"
                f"<td>{_esc(md.get('start_date', ''))}</td>"
                f"<td>{_esc(md.get('end_date', ''))}</td>"
                f"<td>{_esc(ad_name)}</td></tr>"
            )
        html_parts.append("</table>")

    # Reading sections
    section_titles = {
        "overview": "Life Overview",
        "personality": "Personality & Core Identity",
        "career": "Career & Purpose",
        "love": "Love & Relationships",
        "wealth": "Money & Wealth",
        "health": "Health & Wellbeing",
        "spirituality": "Spirituality",
        "challenges": "Challenges & Growth",
        "nakshatra": "Nakshatra Profile",
    }
    for key, title in section_titles.items():
        content = sections.get(key)
        if content:
            html_parts.append(f"<h2>{_esc(title)}</h2><div class='section'>{_esc(content)}</div>")

    # Disclaimer
    html_parts.append("<p style='font-size:9pt; color:#9ca3af; margin-top:40px; border-top:1px solid #e5e7eb; padding-top:10px;'>This report is for entertainment and reflection only. It is not a substitute for professional medical, legal, or financial advice.</p>")

    html_parts.append("</body></html>")

    html_str = "\n".join(html_parts)

    from weasyprint import HTML
    pdf_bytes = HTML(string=html_str).write_pdf()
    return pdf_bytes
