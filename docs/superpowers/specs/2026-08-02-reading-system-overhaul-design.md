# Reading System Overhaul — Design Spec

## Goal

Replace the current pre-written template readings with a Gemini AI-powered reading engine that generates personalized, chart-specific content in Malayalam and English. Build a downloadable PDF report. Rebuild the Dasha tab with actual calculated dates.

## Problem

1. **Readings are generic** — Pre-written templates produce fortune-cookie text ("Your Moon in Capricorn suggests emotional depth"). No reference to actual degrees, aspects, or house cusps.
2. **Dasha tab is useless** — Shows generic dasha text with no dates, no current period highlight, no antardasha breakdown.
3. **No Malayalam** — Indian users need Malayalam. ProKerala and old Windows apps support this.
4. **No PDF export** — Users expect a downloadable 15-20 page report like ProKerala.

## Architecture

### Reading Generation Flow

```
User opens /chart/[id]/read
  → Frontend checks cache: GET /api/reading/{chart_id}?lang=ml
  → If cached: return cached reading
  → If not cached: POST /api/reading/generate
    → Backend assembles full chart JSON (planets, houses, aspects, nakshatras, dashas with dates)
    → Sends to Gemini Flash with detailed Vedic astrologer prompt
    → Gemini returns structured JSON reading (~6000+ words)
    → Saved to `interpretations` table (chart_id + language = unique)
    → Returned to frontend
  → Frontend renders reading sections
```

### Backend API

**New endpoint: `POST /api/v1/reading/generate`**

Request:
```json
{
  "chart_id": "uuid",
  "language": "ml"  // "en" or "ml"
}
```

Response:
```json
{
  "chart_id": "uuid",
  "language": "ml",
  "sections": {
    "overview": "...",
    "personality": "...",
    "career": "...",
    "love": "...",
    "wealth": "...",
    "health": "...",
    "spirituality": "...",
    "challenges": "...",
    "dasha": {
      "summary": "...",
      "mahadashas": [
        {
          "planet": "Jupiter",
          "start": "2019-04-15",
          "end": "2035-10-15",
          "is_current": true,
          "interpretation": "...",
          "antardashas": [
            {
              "planet": "Saturn",
              "start": "2026-01-15",
              "end": "2027-06-15",
              "is_current": true,
              "interpretation": "..."
            }
          ]
        }
      ]
    },
    "yearly": {
      "2026": "...",
      "2027": "...",
      "2028": "..."
    },
    "nakshatra": "..."
  }
}
```

**Modified endpoint: `GET /api/v1/reading/{chart_id}?lang=ml`**

Returns cached reading or 404 if not generated yet.

### Gemini Prompt Strategy

The prompt is the core of quality. Key elements:

1. **Full chart context**: Send complete JSON with all planetary positions, degrees, houses, aspects, nakshatras, and dasha periods with dates.
2. **Role instruction**: "You are a world-class Vedic astrologer with 30+ years of experience. Read this birth chart holistically."
3. **Quality requirements**:
   - Reference SPECIFIC placements by degree ("Sun at 4.6° Virgo in 5th house")
   - Compare planetary dignities (exaltation, debilitation, own sign)
   - Note planetary war, combustion, retrograde effects
   - Synthesize multiple factors (don't read planets in isolation)
   - Give specific year predictions referencing transits
4. **Language instruction**: "Respond entirely in Malayalam using proper astrological terminology" (or English)
5. **Structure**: Request JSON output with specific section keys

### Dasha Data

The backend `dasha.py` calculator already computes:
- Birth nakshatra and pada
- All 9 Mahadasha periods with exact start/end dates
- All 81 Antardashas with dates
- Current Mahadasha and Antardasha

This data is sent to Gemini for interpretation. The frontend also gets the raw dates for the timeline UI.

### Caching

- `interpretations` table: `(chart_id, language)` unique constraint
- Reading is generated once per chart per language
- Language toggle triggers generation for new language if not cached
- Cache invalidation: manual (regenerate button) or if chart data changes

### PDF Export

- New endpoint: `GET /api/v1/reading/{chart_id}/pdf?lang=ml`
- Uses `weasyprint` (Python) to generate PDF from HTML template
- Template includes: chart wheel SVG, all reading sections, dasha timeline, planet positions table
- Malayalam font: Noto Sans Malayalam (bundled)
- Output: professional 15-20 page PDF

## Reading Sections (11 total)

| Section | Key | Target Length | Content |
|---------|-----|---------------|---------|
| Life Overview | `overview` | ~800 words | Core identity, life purpose, major patterns |
| Personality | `personality` | ~600 words | Sun/Moon/Rising synthesis, element balance |
| Career & Purpose | `career` | ~500 words | 10th house, MC, Saturn, Mercury |
| Love & Relationships | `love` | ~500 words | 7th house, Venus, Moon aspects |
| Money & Wealth | `wealth` | ~400 words | 2nd/8th house, Jupiter, Venus |
| Health & Wellbeing | `health` | ~400 words | 6th house, Mars, Saturn, Ascendant ruler |
| Spirituality | `spirituality` | ~400 words | 12th house, Ketu, Neptune, Jupiter |
| Challenges & Growth | `challenges` | ~500 words | Hard aspects, squares, oppositions |
| Dasha Timeline | `dasha` | ~1000 words | All periods with dates + interpretations |
| Yearly Forecast | `yearly` | ~800 words | Transit predictions 2024-2028 |
| Nakshatra Profile | `nakshatra` | ~400 words | Moon nakshatra deep dive |

**Total: ~6000+ words per reading**

## Frontend Changes

### Reading Page (`/chart/[id]/read`)

- **Language toggle**: മലയാളം / English switcher in header
- **Loading state**: "Generating your reading..." with progress (first load takes ~15-20s)
- **Sections**: Same tabbed layout but with AI-generated content
- **Dasha tab**: Rebuilt with actual dates timeline, expand/collapse, current period highlighted
- **PDF button**: "Download Report" button in header

### Dasha Tab UI

```
┌──────────────────────────────────────────┐
│  🔵 ACTIVE NOW                           │
│  Jupiter Mahadasha (Apr 2019 — Oct 2035) │
│  Jupiter-Saturn Antardasha               │
│  (Jan 2026 — Jun 2027)                   │
│                                           │
│  [AI interpretation of current period]   │
├──────────────────────────────────────────┤
│  ▼ Jupiter Mahadasha    Apr 2019 — Oct 2035│
│    ├ Saturn Antardasha  Jan 2026 — Jun 2027│
│    ├ Mercury Antardasha Jun 2027 — Nov 2029│
│    └ ...                                  │
│  ▶ Rahu Mahadasha       Oct 2035 — Oct 2053│
│  ▶ Saturn Mahadasha     Oct 2053 — Nov 2072│
│  ... (all 9, expandable)                  │
└──────────────────────────────────────────┘
```

### Language Toggle

- Default: Malayalam (`ml`)
- Toggle between `ml` and `en`
- Each language has its own cached reading
- First switch triggers generation (~15-20s), subsequent loads are instant

## PDF Report Structure

1. **Cover page**: Name, birth details, chart wheel
2. **Birth Details table**: Date, time, location, coordinates, timezone
3. **Planet Positions table**: Planet, sign, degree, house, nakshatra, pada
4. **House Positions table**: House number, sign, cusp degree
5. **Aspect Table**: Planet pairs, aspect type, orb
6. **Dasha Timeline**: All periods with dates
7. **Reading sections** (pages 7-18): All 11 sections
8. **Disclaimer**: "For entertainment and reflection only"

## Database Changes

`interpretations` table already exists. Add column:
```sql
ALTER TABLE interpretations ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE interpretations ADD COLUMN IF NOT EXISTS reading_data JSONB;
ALTER TABLE interpretations DROP CONSTRAINT IF EXISTS interpretations_chart_id_key;
ALTER TABLE interpretations ADD UNIQUE (chart_id, language);
```

## Tech Stack

- **AI**: Gemini Flash (`gemini-flash-latest`) — free tier
- **PDF**: `weasyprint` (Python) — free, handles Malayalam/Unicode
- **Fonts**: Noto Sans Malayalam (bundled in PDF template)
- **Caching**: Supabase `interpretations` table
- **Backend**: FastAPI endpoint for generation + serving
- **Frontend**: Next.js reading page with language toggle

## Cost

- Gemini free tier: 15 RPM, 1M tokens/day
- Each reading: ~8K input tokens + ~6K output tokens = ~14K tokens
- ~70 readings/day possible within free tier
- PDF generation: local (no API cost)

## Success Criteria

1. Reading quality matches or exceeds ProKerala's depth
2. Malayalam readings are natural, not machine-translated
3. Dasha tab shows actual calculated dates with current period highlighted
4. PDF export produces professional 15-20 page report
5. Reading generation completes in <20 seconds
6. Cached readings load instantly
