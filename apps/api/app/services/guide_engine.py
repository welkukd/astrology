import hashlib
import random
from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from app.services.ai import call_ai_json
from app.services.tarot import CARD_METADATA, draw_cards, get_daily_card

# ============================================
# Meditation content generators
# ============================================

DEFAULT_MEDITATION_TECHNIQUES = {
    "guided": {
        "name": "Guided Meditation",
        "description": "Follow along with a narrator",
        "default_duration": 600,  # 10 minutes
    },
    "breathing": {
        "name": "Breathing Exercise",
        "description": "Focus on breath patterns",
        "default_duration": 300,  # 5 minutes
        "default_intervals": [
            {"phase": "inhale", "duration": 4, "instruction": "Breathe in deeply"},
            {"phase": "hold", "duration": 4, "instruction": "Hold the breath"},
            {"phase": "exhale", "duration": 6, "instruction": "Breathe out slowly"},
            {"phase": "hold", "duration": 2, "instruction": "Pause before next breath"},
        ],
    },
    "mantra": {
        "name": "Mantra Meditation",
        "description": "Repeat a sacred sound or phrase",
        "default_duration": 900,  # 15 minutes
    },
    "body_scan": {
        "name": "Body Scan",
        "description": "Progressive relaxation through body awareness",
        "default_duration": 1200,  # 20 minutes
        "default_intervals": [
            {"area": "feet", "duration": 60},
            {"area": "calves", "duration": 60},
            {"area": "thighs", "duration": 60},
            {"area": "hips", "duration": 60},
            {"area": "abdomen", "duration": 60},
            {"area": "chest", "duration": 60},
            {"area": "hands", "duration": 60},
            {"area": "arms", "duration": 60},
            {"area": "shoulders", "duration": 60},
            {"area": "neck", "duration": 60},
            {"area": "face", "duration": 60},
            {"area": "head", "duration": 60},
        ],
    },
    "walking": {
        "name": "Walking Meditation",
        "description": "Mindful walking practice",
        "default_duration": 600,  # 10 minutes
    },
    "custom": {
        "name": "Custom Meditation",
        "description": "Your own meditation practice",
        "default_duration": 600,
    },
}

HABIT_CATEGORIES = [
    "health",
    "spiritual",
    "productivity",
    "creative",
    "social",
    "custom",
]

HABIT_FREQUENCIES = ["daily", "weekly", "monthly", "custom"]


def generate_daily_practice_hash(user_id: str, practice_date: date) -> str:
    """Generate deterministic hash for daily practice (user + date)."""
    content = f"{user_id}:{practice_date.isoformat()}"
    return hashlib.sha256(content.encode()).hexdigest()[:16]


def get_daily_tarot_card(user_id: str, practice_date: date) -> Dict[str, Any]:
    """Get deterministic daily tarot card for user/date."""
    return get_daily_card(user_id, practice_date)


async def generate_daily_meditation_guidance(
    meditation_type: str,
    duration_seconds: int,
    user_id: str,
    practice_date: date,
) -> Dict[str, Any]:
    """Generate meditation guidance script using AI."""
    tech = DEFAULT_MEDITATION_TECHNIQUES.get(meditation_type, DEFAULT_MEDITATION_TECHNIQUES["guided"])
    minutes = duration_seconds // 60

    try:
        guidance = await call_ai_json(
            f"""You are a gentle, wise meditation guide. Create a {minutes}-minute {tech['name']} script.
Type: {meditation_type}
Duration: {minutes} minutes ({duration_seconds} seconds)
Technique: {tech.get('description', '')}

Return JSON with:
{{
  "title": "Session title",
  "script": "Full guidance script with pauses marked as [PAUSE: X seconds]",
  "chimes": [{{"time_seconds": 0, "type": "start"}}, {{"time_seconds": {duration_seconds}, "type": "end"}}],
  "background_sound": "recommended ambient sound (e.g., 'gentle_rain', 'singing_bowls', 'ocean_waves', 'silence')"
}}

Make the script calming, present-focused, and suitable for the technique. Include gentle transitions."""
        )
        return guidance
    except Exception:
        # Fallback guidance
        return {
            "title": f"{tech['name']} - {minutes} minutes",
            "script": f"Welcome to your {minutes}-minute {tech['name'].lower()}. Find a comfortable position. [PAUSE: 10 seconds] Gently close your eyes and bring your attention to your breath. [PAUSE: {duration_seconds - 20} seconds] Slowly bring awareness back to the room. [PAUSE: 10 seconds]",
            "chimes": [
                {"time_seconds": 0, "type": "start"},
                {"time_seconds": duration_seconds // 2, "type": "midpoint"},
                {"time_seconds": duration_seconds, "type": "end"},
            ],
            "background_sound": "gentle_rain",
        }


def generate_dream_prompt(practice_date: date) -> str:
    """Generate a reflective dream prompt for the day."""
    prompts = [
        "What symbols or images stood out in your dreams last night?",
        "How did you feel upon waking? What emotions linger?",
        "Did any recurring themes or characters appear?",
        "What message might your subconscious be offering today?",
        "Was there a moment of lucidity or awareness in your dream?",
    ]
    # Deterministic selection based on date
    idx = (practice_date.day + practice_date.month) % len(prompts)
    return prompts[idx]


def generate_habit_suggestions(user_id: str, practice_date: date) -> List[Dict[str, Any]]:
    """Generate personalized habit suggestions for the day."""
    # For now, return a few standard suggestions
    # Could be enhanced with user history analysis
    return [
        {
            "habit_name": "Morning meditation",
            "category": "spiritual",
            "frequency": "daily",
            "target_count": 1,
            "target_unit": "times",
            "suggestion_reason": "Start your day with presence",
        },
        {
            "habit_name": "Dream journaling",
            "category": "spiritual",
            "frequency": "daily",
            "target_count": 1,
            "target_unit": "entries",
            "suggestion_reason": "Capture dream insights while fresh",
        },
        {
            "habit_name": "Evening reflection",
            "category": "spiritual",
            "frequency": "daily",
            "target_count": 1,
            "target_unit": "times",
            "suggestion_reason": "Review the day with compassion",
        },
    ]


async def interpret_dream_with_ai(
    dream_content: str,
    dream_title: Optional[str],
    symbols: List[str],
    emotional_tone: Optional[str],
    user_id: str,
) -> Dict[str, Any]:
    """Use AI to interpret a dream entry."""
    symbols_text = ", ".join(symbols) if symbols else "none explicitly noted"
    title_text = dream_title or "Untitled dream"

    try:
        interpretation = await call_ai_json(
            f"""You are a compassionate dream analyst drawing from Jungian psychology, 
archetypal symbolism, and modern dream research. Interpret this dream with depth and care.

Dream Title: {title_text}
Dream Content: {dream_content}
Noted Symbols: {symbols_text}
Emotional Tone: {emotional_tone or "not specified"}

Return JSON with:
{{
  "summary": "2-3 sentence holistic interpretation",
  "symbols_analysis": [
    {{"symbol": "symbol_name", "archetype": "archetype", "meaning": "personal/collective meaning", "actionable_insight": "practical takeaway"}}
  ],
  "emotional_landscape": "Analysis of emotional themes and their significance",
  "recurring_patterns": "Any patterns or themes that suggest ongoing work",
  "actionable_guidance": [
    "Specific, gentle action for integration",
    "Reflection question for deeper exploration",
    "Creative or ritual suggestion"
  ],
  "shadow_work": "Optional: any shadow material surfacing",
  "integration_affirmation": "A supportive affirmation for the dreamer"
}}

Be psychologically sophisticated but accessible. Avoid deterministic predictions. Focus on empowerment and self-understanding."""
        )
        return interpretation
    except Exception as e:
        return {
            "summary": "Your dream holds personal meaning that unfolds with gentle attention.",
            "symbols_analysis": [
                {"symbol": s, "archetype": "personal", "meaning": "Unique to your experience", "actionable_insight": "Reflect on what this symbol means to you"} for s in symbols[:5]
            ],
            "emotional_landscape": f"The emotional tone of {emotional_tone or 'this dream'} invites exploration.",
            "recurring_patterns": "Consider tracking dreams over time to notice patterns.",
            "actionable_guidance": [
                "Write freely about this dream for 5 minutes",
                "What feeling from the dream wants your attention today?",
                "Consider a small creative expression inspired by this dream"
            ],
            "shadow_work": None,
            "integration_affirmation": "I honor the wisdom of my unconscious mind.",
        }


def calculate_habit_streaks(
    entries: List[Dict[str, Any]],
    habit_name: str,
    frequency: str,
    target_count: int,
) -> Tuple[int, int, int, int]:
    """Calculate current streak, longest streak, total completions, total entries."""
    if not entries:
        return 0, 0, 0, 0

    # Sort entries by date
    sorted_entries = sorted(entries, key=lambda e: e["entry_date"])
    
    total_completions = sum(1 for e in sorted_entries if e.get("completed_count", 0) >= target_count)
    total_entries = len(sorted_entries)
    
    # Calculate streaks
    current_streak = 0
    longest_streak = 0
    temp_streak = 0
    
    today = date.today()
    
    for i, entry in enumerate(sorted_entries):
        entry_date = entry["entry_date"]
        if isinstance(entry_date, str):
            entry_date = datetime.fromisoformat(entry_date).date()
        
        completed = entry.get("completed_count", 0) >= target_count
        
        if completed:
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 0
    
    # Current streak: count back from today
    # Check if today or yesterday has completion
    check_date = today
    for entry in reversed(sorted_entries):
        entry_date = entry["entry_date"]
        if isinstance(entry_date, str):
            entry_date = datetime.fromisoformat(entry_date).date()
        
        if entry_date == check_date and entry.get("completed_count", 0) >= target_count:
            current_streak += 1
            check_date -= timedelta(days=1) if frequency == "daily" else timedelta(weeks=1)
        elif entry_date < check_date:
            break
    
    return current_streak, longest_streak, total_completions, total_entries


def get_weekly_monthly_stats(entries: List[Dict[str, Any]], habit_name: str) -> Dict[str, Any]:
    """Calculate weekly and monthly completion rates."""
    if not entries:
        return {"weekly": {}, "monthly": {}}
    
    today = date.today()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    weekly_entries = [e for e in entries if e["entry_date"] >= week_ago]
    monthly_entries = [e for e in entries if e["entry_date"] >= month_ago]
    
    def calc_rate(relevant_entries: List[Dict[str, Any]], target: int) -> float:
        if not relevant_entries:
            return 0.0
        completed = sum(1 for e in relevant_entries if e.get("completed_count", 0) >= target)
        return round(completed / len(relevant_entries) * 100, 1)
    
    # Get target from most recent entry
    target = entries[-1].get("target_count", 1) if entries else 1
    
    return {
        "weekly": {
            "completion_rate": calc_rate(weekly_entries, target),
            "total_entries": len(weekly_entries),
            "completed": sum(1 for e in weekly_entries if e.get("completed_count", 0) >= target),
        },
        "monthly": {
            "completion_rate": calc_rate(monthly_entries, target),
            "total_entries": len(monthly_entries),
            "completed": sum(1 for e in monthly_entries if e.get("completed_count", 0) >= target),
        },
    }


async def generate_daily_practice_sections(
    user_id: str,
    practice_date: date,
) -> List[Dict[str, Any]]:
    """Generate all sections for the daily practice."""
    sections = []
    
    # 1. Tarot Draw
    daily_card = get_daily_tarot_card(user_id, practice_date)
    card_name = daily_card["card_name"]
    orientation = "Upright" if daily_card["card_upright"] else "Reversed"
    meta = CARD_METADATA.get(card_name, {})
    meaning = meta.get(f"meaning_{orientation.lower()}", "")
    
    sections.append({
        "type": "tarot",
        "title": "Daily Card",
        "content": {
            "card_name": card_name,
            "orientation": orientation,
            "image_url": daily_card.get("card_image_url"),
            "keywords": meta.get("keywords", []),
            "meaning": meaning,
            "guidance": f"Today's card {card_name} ({orientation}) invites you to {meaning.lower()}.",
        },
        "order": 1,
    })
    
    # 2. Meditation
    meditation_guidance = await generate_daily_meditation_guidance(
        meditation_type="breathing",
        duration_seconds=300,
        user_id=user_id,
        practice_date=practice_date,
    )
    sections.append({
        "type": "meditation",
        "title": "Guided Meditation",
        "content": {
            "meditation_type": "breathing",
            "duration_seconds": 300,
            "guidance_script": meditation_guidance.get("script", ""),
            "chimes": meditation_guidance.get("chimes", []),
            "background_sound": meditation_guidance.get("background_sound", "gentle_rain"),
            "title": meditation_guidance.get("title", "Breathing Meditation"),
        },
        "order": 2,
    })
    
    # 3. Habit
    habit_suggestions = generate_habit_suggestions(user_id, practice_date)
    sections.append({
        "type": "habit",
        "title": "Daily Habit",
        "content": {
            "suggestions": habit_suggestions,
            "prompt": "Choose one habit to focus on today, or continue your existing practice.",
        },
        "order": 3,
    })
    
    # 4. Dream Prompt
    dream_prompt = generate_dream_prompt(practice_date)
    sections.append({
        "type": "dream",
        "title": "Dream Reflection",
        "content": {
            "prompt": dream_prompt,
            "date": practice_date.isoformat(),
        },
        "order": 4,
    })
    
    return sections