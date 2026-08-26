import hashlib
import random
import time
from datetime import date, datetime
from typing import Any, Dict, List, Optional, Tuple

# Tarot deck definition
SUITS = ["Wands", "Cups", "Swords", "Pentacles"]
SUIT_SYMBOLS = {
    "Wands": "wands",
    "Cups": "cups",
    "Swords": "swords",
    "Pentacles": "pentacles"
}

MAJOR_ARCANA = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
]

MINOR_ARCANA = []
for suit in SUITS:
    for num in range(1, 11):  # Ace to 10
        MINOR_ARCANA.append(f"{num} of {suit}")
    for court in ["Page", "Knight", "Queen", "King"]:
        MINOR_ARCANA.append(f"{court} of {suit}")

DECK = MAJOR_ARCANA + MINOR_ARCANA  # 78 cards


# Full 78-card metadata with meanings
CARD_METADATA = {}

# Major Arcana metadata
MAJOR_METADATA = [
    {
        "card_id": "0",
        "name": "The Fool",
        "number": 0,
        "arcana": "major",
        "suit": None,
        "keywords": ["beginnings", "innocence", "spontaneity", "faith"],
        "meaning_upright": "New beginnings, spontaneity, faith in the unknown, taking a leap of faith",
        "meaning_reversed": "Recklessness, foolishness, lack of planning, hesitation, fear of the unknown",
        "element": "air",
        "zodiac_association": "Uranus",
        "hebrew_letter": "Aleph",
        "number_roman": "0"
    },
    {
        "card_id": "1",
        "name": "The Magician",
        "number": 1,
        "arcana": "major",
        "suit": None,
        "keywords": ["manifestation", "resourcefulness", "power", "inspired action"],
        "meaning_upright": "Manifestation, resourcefulness, power, inspired action, using one's talents",
        "meaning_reversed": "Manipulation, deception, unused talents, trickery, self-doubt",
        "element": "air",
        "zodiac_association": "Mercury",
        "hebrew_letter": "Bet",
        "number_roman": "I"
    },
    {
        "card_id": "2",
        "name": "The High Priestess",
        "number": 2,
        "arcana": "major",
        "suit": None,
        "keywords": ["intuition", "sacred knowledge", "divine feminine", "subconscious"],
        "meaning_upright": "Intuition, sacred knowledge, divine feminine, subconscious mind, mystery",
        "meaning_reversed": "Secrets, disconnected from intuition, withdrawal, repression",
        "element": "water",
        "zodiac_association": "Moon",
        "hebrew_letter": "Gimel",
        "number_roman": "II"
    },
    {
        "card_id": "3",
        "name": "The Empress",
        "number": 3,
        "arcana": "major",
        "suit": None,
        "keywords": ["femininity", "beauty", "nature", "abundance", "nurturing"],
        "meaning_upright": "Fertility, femininity, beauty, nature, abundance, nurturing, creativity",
        "meaning_reversed": "Creative block, dependence, smothering, neglect, lack of growth",
        "element": "earth",
        "zodiac_association": "Venus",
        "hebrew_letter": "Dalet",
        "number_roman": "III"
    },
    {
        "card_id": "4",
        "name": "The Emperor",
        "number": 4,
        "arcana": "major",
        "suit": None,
        "keywords": ["authority", "structure", "control", "fatherhood"],
        "meaning_upright": "Authority, structure, control, fatherhood, stability, leadership",
        "meaning_reversed": "Tyranny, rigidity, coldness, lack of discipline, abuse of power",
        "element": "fire",
        "zodiac_association": "Aries",
        "hebrew_letter": "He",
        "number_roman": "IV"
    },
    {
        "card_id": "5",
        "name": "The Hierophant",
        "number": 5,
        "arcana": "major",
        "suit": None,
        "keywords": ["tradition", "conformity", "morality", "ethics", "spiritual wisdom"],
        "meaning_upright": "Tradition, conformity, morality, ethics, spiritual wisdom, institutional learning",
        "meaning_reversed": "Rebellion, nonconformity, dogmatism, restriction, corruption",
        "element": "earth",
        "zodiac_association": "Taurus",
        "hebrew_letter": "Vav",
        "number_roman": "V"
    },
    {
        "card_id": "6",
        "name": "The Lovers",
        "number": 6,
        "arcana": "major",
        "suit": None,
        "keywords": ["love", "harmony", "relationships", "values alignment", "choices"],
        "meaning_upright": "Love, harmony, relationships, values alignment, choices, union",
        "meaning_reversed": "Disharmony, imbalance, misalignment, difficult choices, separation",
        "element": "air",
        "zodiac_association": "Gemini",
        "hebrew_letter": "Zayin",
        "number_roman": "VI"
    },
    {
        "card_id": "7",
        "name": "The Chariot",
        "number": 7,
        "arcana": "major",
        "suit": None,
        "keywords": ["control", "willpower", "victory", "assertion", "determination"],
        "meaning_upright": "Control, willpower, victory, assertion, determination, triumph",
        "meaning_reversed": "Lack of control, aggression, lack of direction, defeat",
        "element": "water",
        "zodiac_association": "Cancer",
        "hebrew_letter": "Chet",
        "number_roman": "VII"
    },
    {
        "card_id": "8",
        "name": "Strength",
        "number": 8,
        "arcana": "major",
        "suit": None,
        "keywords": ["strength", "courage", "patience", "control", "compassion"],
        "meaning_upright": "Strength, courage, patience, control, compassion, inner power",
        "meaning_reversed": "Self-doubt, weakness, insecurity, lack of self-discipline",
        "element": "fire",
        "zodiac_association": "Leo",
        "hebrew_letter": "Tet",
        "number_roman": "VIII"
    },
    {
        "card_id": "9",
        "name": "The Hermit",
        "number": 9,
        "arcana": "major",
        "suit": None,
        "keywords": ["soul searching", "introspection", "being alone", "inner guidance"],
        "meaning_upright": "Soul searching, introspection, being alone, inner guidance, wisdom",
        "meaning_reversed": "Isolation, loneliness, withdrawal, fear of silence",
        "element": "earth",
        "zodiac_association": "Virgo",
        "hebrew_letter": "Yod",
        "number_roman": "IX"
    },
    {
        "card_id": "10",
        "name": "Wheel of Fortune",
        "number": 10,
        "arcana": "major",
        "suit": None,
        "keywords": ["good luck", "karma", "life cycles", "destiny", "turning point"],
        "meaning_upright": "Good luck, karma, life cycles, destiny, turning point, change",
        "meaning_reversed": "Bad luck, resistance to change, breaking cycles, misfortune",
        "element": "fire",
        "zodiac_association": "Jupiter",
        "hebrew_letter": "Kaf",
        "number_roman": "X"
    },
    {
        "card_id": "11",
        "name": "Justice",
        "number": 11,
        "arcana": "major",
        "suit": None,
        "keywords": ["justice", "fairness", "truth", "cause and effect", "law"],
        "meaning_upright": "Justice, fairness, truth, cause and effect, law, balance",
        "meaning_reversed": "Injustice, dishonesty, unfairness, lack of accountability, bias",
        "element": "air",
        "zodiac_association": "Libra",
        "hebrew_letter": "Lamed",
        "number_roman": "XI"
    },
    {
        "card_id": "12",
        "name": "The Hanged Man",
        "number": 12,
        "arcana": "major",
        "suit": None,
        "keywords": ["pause", "surrender", "letting go", "new perspectives"],
        "meaning_upright": "Pause, surrender, letting go, new perspectives, sacrifice",
        "meaning_reversed": "Stalling, indecision, avoidance, martyrdom, resistance",
        "element": "water",
        "zodiac_association": "Neptune",
        "hebrew_letter": "Mem",
        "number_roman": "XII"
    },
    {
        "card_id": "13",
        "name": "Death",
        "number": 13,
        "arcana": "major",
        "suit": None,
        "keywords": ["endings", "change", "transformation", "transition"],
        "meaning_upright": "Endings, change, transformation, transition, rebirth",
        "meaning_reversed": "Resistance to change, inability to move on, stagnation, decay",
        "element": "water",
        "zodiac_association": "Scorpio",
        "hebrew_letter": "Nun",
        "number_roman": "XIII"
    },
    {
        "card_id": "14",
        "name": "Temperance",
        "number": 14,
        "arcana": "major",
        "suit": None,
        "keywords": ["balance", "moderation", "patience", "purpose", "meaning"],
        "meaning_upright": "Balance, moderation, patience, purpose, meaning, harmony",
        "meaning_reversed": "Imbalance, excess, impatience, lack of direction, extremism",
        "element": "fire",
        "zodiac_association": "Sagittarius",
        "hebrew_letter": "Samekh",
        "number_roman": "XIV"
    },
    {
        "card_id": "15",
        "name": "The Devil",
        "number": 15,
        "arcana": "major",
        "suit": None,
        "keywords": ["shadow self", "attachment", "addiction", "restriction", "sexuality"],
        "meaning_upright": "Shadow self, attachment, addiction, restriction, sexuality, materialism",
        "meaning_reversed": "Release, breaking free, detachment, reclaiming power, awareness",
        "element": "earth",
        "zodiac_association": "Capricorn",
        "hebrew_letter": "Ayin",
        "number_roman": "XV"
    },
    {
        "card_id": "16",
        "name": "The Tower",
        "number": 16,
        "arcana": "major",
        "suit": None,
        "keywords": ["sudden change", "upheaval", "chaos", "revelation", "awakening"],
        "meaning_upright": "Sudden change, upheaval, chaos, revelation, awakening, liberation",
        "meaning_reversed": "Fear of change, avoiding disaster, delayed upheaval, internal crisis",
        "element": "fire",
        "zodiac_association": "Mars",
        "hebrew_letter": "Pe",
        "number_roman": "XVI"
    },
    {
        "card_id": "17",
        "name": "The Star",
        "number": 17,
        "arcana": "major",
        "suit": None,
        "keywords": ["hope", "faith", "purpose", "renewal", "spirituality"],
        "meaning_upright": "Hope, faith, purpose, renewal, spirituality, inspiration",
        "meaning_reversed": "Despair, lack of faith, disconnection, hopelessness, insecurity",
        "element": "air",
        "zodiac_association": "Aquarius",
        "hebrew_letter": "Tzadi",
        "number_roman": "XVII"
    },
    {
        "card_id": "18",
        "name": "The Moon",
        "number": 18,
        "arcana": "major",
        "suit": None,
        "keywords": ["illusion", "fear", "anxiety", "subconscious", "intuition"],
        "meaning_upright": "Illusion, fear, anxiety, subconscious, intuition, dreams",
        "meaning_reversed": "Confusion released, clarity, overcoming fear, deception revealed",
        "element": "water",
        "zodiac_association": "Pisces",
        "hebrew_letter": "Qof",
        "number_roman": "XVIII"
    },
    {
        "card_id": "19",
        "name": "The Sun",
        "number": 19,
        "arcana": "major",
        "suit": None,
        "keywords": ["positivity", "fun", "warmth", "success", "vitality"],
        "meaning_upright": "Positivity, fun, warmth, success, vitality, joy, enlightenment",
        "meaning_reversed": "Temporary setback, sadness, lack of vitality, delayed success",
        "element": "fire",
        "zodiac_association": "Sun",
        "hebrew_letter": "Resh",
        "number_roman": "XIX"
    },
    {
        "card_id": "20",
        "name": "Judgement",
        "number": 20,
        "arcana": "major",
        "suit": None,
        "keywords": ["judgement", "rebirth", "inner calling", "absolution"],
        "meaning_upright": "Judgement, rebirth, inner calling, absolution, awakening",
        "meaning_reversed": "Self-doubt, inner critic, ignoring the call, lack of self-evaluation",
        "element": "fire",
        "zodiac_association": "Pluto",
        "hebrew_letter": "Shin",
        "number_roman": "XX"
    },
    {
        "card_id": "21",
        "name": "The World",
        "number": 21,
        "arcana": "major",
        "suit": None,
        "keywords": ["completion", "integration", "accomplishment", "travel"],
        "meaning_upright": "Completion, integration, accomplishment, travel, wholeness",
        "meaning_reversed": "Incompletion, lack of closure, delays, unfulfilled potential",
        "element": "earth",
        "zodiac_association": "Saturn",
        "hebrew_letter": "Tav",
        "number_roman": "XXI"
    }
]

# Minor Arcana suits
MINOR_SUITS = {
    "Wands": {"element": "fire", "keywords": ["energy", "passion", "creativity", "willpower"]},
    "Cups": {"element": "water", "keywords": ["emotions", "relationships", "intuition", "creativity"]},
    "Swords": {"element": "air", "keywords": ["intellect", "communication", "conflict", "truth"]},
    "Pentacles": {"element": "earth", "keywords": ["material", "finances", "work", "manifestation"]},
}

MINOR_RANKS = [
    {"number": 1, "name": "Ace", "keywords": ["new beginnings", "potential", "opportunity"]},
    {"number": 2, "name": "Two", "keywords": ["balance", "partnership", "duality", "choices"]},
    {"number": 3, "name": "Three", "keywords": ["growth", "expansion", "creativity", "collaboration"]},
    {"number": 4, "name": "Four", "keywords": ["stability", "structure", "rest", "contemplation"]},
    {"number": 5, "name": "Five", "keywords": ["conflict", "loss", "change", "adversity", "growth through challenge"]},
    {"number": 6, "name": "Six", "keywords": ["harmony", "balance", "giving", "receiving", "progress"]},
    {"number": 7, "name": "Seven", "keywords": ["assessment", "patience", "perseverance", "spiritual growth"]},
    {"number": 8, "name": "Eight", "keywords": ["movement", "action", "power", "mastery", "progress"]},
    {"number": 9, "name": "Nine", "keywords": ["fruition", "attainment", "wisdom", "completion", "reflection"]},
    {"number": 10, "name": "Ten", "keywords": ["completion", "fulfillment", "end of cycle", "transition"]},
    {"number": 11, "name": "Page", "keywords": ["messenger", "curiosity", "beginnings", "learning", "potential"]},
    {"number": 12, "name": "Knight", "keywords": ["action", "movement", "quest", "idealism", "energy"]},
    {"number": 13, "name": "Queen", "keywords": ["nurturing", "maturity", "embodiment", "compassion", "mastery"]},
    {"number": 14, "name": "King", "keywords": ["authority", "mastery", "leadership", "control", "vision"]},
]

# Build full card metadata
for card in MAJOR_METADATA:
    CARD_METADATA[card["name"]] = card

for suit_name, suit_info in MINOR_SUITS.items():
    for rank in MINOR_RANKS:
        card_name = f"{rank['name']} of {suit_name}"
        card_id = f"{suit_info['element'][:1]}{rank['number']:02d}"  # e.g., f01, w14
        CARD_METADATA[card_name] = {
            "card_id": card_id,
            "name": card_name,
            "number": rank["number"] if rank["number"] <= 10 else None,
            "arcana": "minor",
            "suit": suit_name.lower(),
            "keywords": rank["keywords"] + suit_info["keywords"],
            "meaning_upright": f"{rank['name']} of {suit_name} upright: {', '.join(rank['keywords'][:3])} through {suit_info['keywords'][0]}",
            "meaning_reversed": f"{rank['name']} of {suit_name} reversed: blocked {rank['keywords'][0]}, challenged {suit_info['keywords'][0]}",
            "element": suit_info["element"],
            "zodiac_association": None,
            "hebrew_letter": None,
            "number_roman": None
        }


def create_deck() -> List[str]:
    """Return a fresh ordered deck."""
    return DECK.copy()


def shuffle_deck(deck: List[str], seed: Optional[int] = None) -> List[str]:
    """Shuffle the deck in place and return it. Optional seed for deterministic shuffling."""
    if seed is not None:
        rng = random.Random(seed)
        rng.shuffle(deck)
    else:
        random.shuffle(deck)
    return deck


def draw_card(deck: List[str]) -> Tuple[str, List[str]]:
    """Draw a single card from the deck, returning the card and the remaining deck."""
    if not deck:
        deck = shuffle_deck(create_deck())
    card = deck.pop()
    return card, deck


def get_card_orientation(seed: Optional[int] = None, index: int = 0) -> str:
    """Deterministically determine if card is upright or reversed."""
    if seed is not None:
        rng = random.Random(seed + index * 1000)
        return rng.choice(["Upright", "Reversed"])
    return random.choice(["Upright", "Reversed"])


def draw_cards(
    num: int,
    deck: Optional[List[str]] = None,
    seed: Optional[int] = None
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    Draw a number of cards from the deck.
    Returns a tuple of (list of dicts with card name and orientation, updated deck).
    If deck is provided, uses and returns the updated deck.
    """
    if deck is None:
        deck = shuffle_deck(create_deck(), seed=seed)
    drawn = []
    for i in range(num):
        card, deck = draw_card(deck)
        orientation = get_card_orientation(seed, i)
        drawn.append({
            "card": card,
            "orientation": orientation,
            "arcana": "Major" if card in MAJOR_ARCANA else "Minor",
            "suit": None if card in MAJOR_ARCANA else next((s for s in SUITS if s in card), None)
        })
    return drawn, deck


# Common spreads
SPREADS = {
    "single_card": {
        "name": "Single Card",
        "num": 1,
        "positions": ["Present"]
    },
    "three_card": {
        "name": "Three-Card Spread",
        "num": 3,
        "positions": ["Past", "Present", "Future"]
    },
    "celtic_cross": {
        "name": "Celtic Cross",
        "num": 10,
        "positions": [
            "Present", "Challenge", "Past", "Future", "Above", "Below",
            "Advice", "External Influences", "Hopes and Fears", "Outcome"
        ]
    },
    "relationship": {
        "name": "Relationship Spread",
        "num": 7,
        "positions": [
            "You", "Partner", "Relationship Foundation", "Past Influences",
            "Future Potential", "Challenges", "Advice"
        ]
    }
}


def get_spread(spread_name: str) -> Dict[str, Any]:
    """Return spread configuration by name."""
    if spread_name not in SPREADS:
        raise ValueError(f"Unknown spread: {spread_name}")
    return SPREADS[spread_name]


def get_all_spreads() -> Dict[str, Dict[str, Any]]:
    """Return all available spread configurations."""
    return SPREADS


def get_deck_metadata() -> List[Dict[str, Any]]:
    """Return full 78-card deck metadata."""
    # Return in order: Major Arcana first (0-21), then Minor Arcana by suit
    metadata = []
    for i in range(22):
        card_name = MAJOR_ARCANA[i]
        meta = CARD_METADATA[card_name].copy()
        meta["position_in_deck"] = i
        metadata.append(meta)
    
    suit_order = ["Wands", "Cups", "Swords", "Pentacles"]
    for suit_idx, suit in enumerate(suit_order):
        for rank_idx, rank in enumerate(MINOR_RANKS):
            card_name = f"{rank['name']} of {suit}"
            meta = CARD_METADATA[card_name].copy()
            meta["position_in_deck"] = 22 + suit_idx * 14 + rank_idx
            metadata.append(meta)
    
    return metadata


def compute_spread_hash(spread_type: str, cards_drawn: List[Dict[str, Any]], question: Optional[str] = None) -> str:
    """Compute a hash for caching interpretations based on spread and cards."""
    content = f"{spread_type}:{question or ''}:"
    for card in cards_drawn:
        content += f"{card['card']}|{card['orientation']};"
    return hashlib.sha256(content.encode()).hexdigest()[:16]


def perform_reading(
    spread_name: str = "three_card",
    question: Optional[str] = None,
    seed: Optional[int] = None
) -> Dict[str, Any]:
    """
    Perform a tarot reading with the given spread.
    Returns a dict with spread info, cards drawn, and optional question.
    """
    spread = get_spread(spread_name)
    num_cards = spread["num"]
    deck = shuffle_deck(create_deck(), seed=seed)
    cards, _ = draw_cards(num_cards, deck, seed=seed)

    # Assign positions to cards
    for i, card in enumerate(cards):
        if i < len(spread["positions"]):
            card["position"] = spread["positions"][i]
        else:
            card["position"] = f"Position {i+1}"

    # Add metadata to each card
    for card in cards:
        meta = CARD_METADATA.get(card["card"], {})
        card["card_id"] = meta.get("card_id", "")
        card["number"] = meta.get("number")
        card["keywords"] = meta.get("keywords", [])
        card["meaning_upright"] = meta.get("meaning_upright", "")
        card["meaning_reversed"] = meta.get("meaning_reversed", "")
        card["element"] = meta.get("element")
        card["zodiac_association"] = meta.get("zodiac_association")

    return {
        "spread": spread["name"],
        "spread_key": spread_name,
        "question": question,
        "cards": cards,
        "timestamp": int(time.time()),
        "spread_hash": compute_spread_hash(spread_name, cards, question)
    }


async def generate_interpretation(
    spread_name: str,
    question: Optional[str],
    cards: List[Dict[str, Any]],
    language: str = "en"
) -> Dict[str, Any]:
    """Generate AI interpretation for a tarot reading."""
    from app.services.ai import call_ai_json
    
    # Build card descriptions
    card_descriptions = []
    for i, card in enumerate(cards):
        pos = card.get("position", f"Position {i+1}")
        orientation = card.get("orientation", "Upright")
        card_name = card.get("card", "")
        meta = CARD_METADATA.get(card_name, {})
        keywords = meta.get("keywords", [])
        meaning = meta.get(f"meaning_{orientation.lower()}", "")
        
        card_descriptions.append(
            f"Position {i+1} ({pos}): {card_name} ({orientation}) - "
            f"Keywords: {', '.join(keywords)} - Meaning: {meaning}"
        )
    
    cards_text = "\n".join(card_descriptions)
    
    prompt = f"""You are an expert tarot reader with deep knowledge of Rider-Waite-Smith symbolism.
Analyze this tarot reading and provide a comprehensive interpretation.

SPREAD: {SPREADS[spread_name]["name"]} ({spread_name})
QUESTION: {question or "General guidance"}
CARDS DRAWN:
{cards_text}

Provide a JSON response with these keys:
{{
  "overall_theme": "2-3 sentence summary of the reading's core message",
  "card_interpretations": [
    {{"position": "Past", "card": "The Fool (Upright)", "meaning": "Detailed interpretation for this position"}},
    ...
  ],
  "synthesis": "How the cards work together - narrative flow and connections",
  "guidance": "Practical advice or action steps based on the reading",
  "affirmation": "A positive affirmation or closing blessing"
}}

Write in {language}. Return ONLY valid JSON. No markdown, no extra text."""

    try:
        return await call_ai_json(prompt, max_tokens=4096)
    except Exception as e:
        # Fallback interpretation
        return {
            "overall_theme": f"This {SPREADS[spread_name]['name']} reveals important insights for your journey.",
            "card_interpretations": [
                {
                    "position": card.get("position", f"Position {i+1}"),
                    "card": f"{card['card']} ({card['orientation']})",
                    "meaning": CARD_METADATA.get(card['card'], {}).get(f"meaning_{card['orientation'].lower()}", "Contemplate this card's message.")
                }
                for i, card in enumerate(cards)
            ],
            "synthesis": "The cards together tell a story of transformation and growth.",
            "guidance": "Trust your intuition and take inspired action.",
            "affirmation": "I am open to the wisdom of the cards."
        }


def get_daily_card(user_id: str, draw_date: date) -> Dict[str, Any]:
    """Get deterministic daily card for a user on a specific date."""
    # Create deterministic seed from user_id and date
    seed_str = f"{user_id}:{draw_date.isoformat()}"
    seed = int(hashlib.sha256(seed_str.encode()).hexdigest()[:8], 16)
    
    # Shuffle deck with seed and draw first card
    deck = shuffle_deck(create_deck(), seed=seed)
    card_name = deck[0]
    orientation = get_card_orientation(seed, 0)
    
    meta = CARD_METADATA.get(card_name, {})
    
    return {
        "card_id": meta.get("card_id", ""),
        "card_name": card_name,
        "card_suit": meta.get("suit"),
        "card_number": meta.get("number"),
        "card_arcana": meta.get("arcana", "major"),
        "card_upright": orientation == "Upright",
        "card_image_url": None,  # TODO: add image URLs
        "card_keywords": meta.get("keywords", []),
        "draw_date": draw_date.isoformat()
    }