# Numerology calculations based on Pythagorean system

def reduce_number(n: int) -> int:
    """Reduce a number to a single digit (or master number 11, 22, 33)."""
    while n >= 10 and n not in (11, 22, 33):
        n = sum(int(d) for d in str(n))
    return n

def letter_to_number(letter: str) -> int:
    """Convert a letter to its numerology number (A=1, B=2, ..., I=9, J=1, etc.)"""
    if not letter.isalpha():
        return 0
    return (ord(letter.upper()) - ord('A')) % 9 + 1

def calculate_life_path(birthdate: str) -> int:
    """
    Calculate Life Path Number from birthdate (YYYY-MM-DD).
    """
    try:
        year, month, day = map(int, birthdate.split('-'))
        total = year + month + day
        return reduce_number(total)
    except Exception:
        return 0

def calculate_expression_name(name: str) -> int:
    """
    Calculate Expression Number from full name (first, middle, last).
    """
    total = 0
    for char in name:
        if char.isalpha():
            total += letter_to_number(char)
    return reduce_number(total)

def calculate_heart_desire(name: str) -> int:
    """
    Calculate Heart's Desire Number (vowels only).
    """
    vowels = "AEIOU"
    total = 0
    for char in name.upper():
        if char in vowels:
            total += letter_to_number(char)
    return reduce_number(total)

def calculate_personality(name: str) -> int:
    """
    Calculate Personality Number (consonants only).
    """
    vowels = "AEIOU"
    total = 0
    for char in name.upper():
        if char.isalpha() and char not in vowels:
            total += letter_to_number(char)
    return reduce_number(total)

def calculate_birth_day(birthdate: str) -> int:
    """
    Calculate Birth Day Number (day of month reduced).
    """
    try:
        day = int(birthdate.split('-')[2])
        return reduce_number(day)
    except Exception:
        return 0

def get_number_interpretation(number: int, number_type: str) -> str:
    """
    Get interpretation for a given number and type.
    """
    interpretations = {
        1: {
            "life_path": "You are a natural leader, independent, and driven. You have a strong desire to achieve and stand out.",
            "expression": "You express yourself as innovative, ambitious, and self-reliant. You excel in entrepreneurial ventures.",
            "heart_desire": "Your inner desire is for independence, leadership, and to be recognized for your unique talents.",
            "personality": "You appear confident, assertive, and pioneering to others. You take charge naturally.",
            "birth_day": "You possess leadership qualities and a strong sense of self from the day you were born."
        },
        2: {
            "life_path": "You are a diplomat, cooperative, and sensitive. You excel in partnerships and creating harmony.",
            "expression": "You express yourself as supportive, intuitive, and peacemaking. You work well in teams.",
            "heart_desire": "Your inner desire is for love, harmony, and deep connections with others.",
            "personality": "You appear gentle, tactful, and sensitive to others. You are seen as a mediator.",
            "birth_day": "You have a natural ability to cooperate and work well with others from birth."
        },
        3: {
            "life_path": "You are creative, expressive, and sociable. You bring joy and inspiration to others.",
            "expression": "You express yourself artistically, communicatively, and optimistically. You thrive in the spotlight.",
            "heart_desire": "Your inner desire is for self-expression, creativity, and social interaction.",
            "personality": "You appear charming, outgoing, and expressive. You attract attention with your charisma.",
            "birth_day": "You have a natural flair for creativity and communication from birth."
        },
        4: {
            "life_path": "You are practical, disciplined, and hardworking. You build solid foundations for yourself and others.",
            "expression": "You express yourself as organized, reliable, and methodical. You excel in detail-oriented work.",
            "heart_desire": "Your inner desire is for stability, security, and a sense of order in life.",
            "personality": "You appear dependable, systematic, and trustworthy to others. You are seen as the rock.",
            "birth_day": "You have a strong work ethic and practical nature from the day you were born."
        },
        5: {
            "life_path": "You are adventurous, freedom-loving, and adaptable. You thrive on change and new experiences.",
            "expression": "You express yourself as versatile, energetic, and progressive. You embrace variety and travel.",
            "heart_desire": "Your inner desire is for freedom, adventure, and experiencing life to the fullest.",
            "personality": "You appear dynamic, lively, and unpredictable to others. You are seen as a free spirit.",
            "birth_day": "You have a restless spirit and love for change from birth."
        },
        6: {
            "life_path": "You are nurturing, responsible, and service-oriented. You excel in caring for others and creating harmony.",
            "expression": "You express yourself as loving, protective, and domestic. You thrive in family and community roles.",
            "heart_desire": "Your inner desire is for love, family, and creating a harmonious home life.",
            "personality": "You appear warm, caring, and approachable to others. You are seen as the caregiver.",
            "birth_day": "You have a natural tendency to nurture and help others from birth."
        },
        7: {
            "life_path": "You are introspective, analytical, and spiritual. You seek truth and wisdom in life's mysteries.",
            "expression": "You express yourself as thoughtful, investigative, and philosophical. You excel in research and analysis.",
            "heart_desire": "Your inner desire is for knowledge, understanding, and spiritual growth.",
            "personality": "You appear mysterious, intelligent, and reserved to others. You are seen as the thinker.",
            "birth_day": "You have a contemplative and perceptive nature from birth."
        },
        8: {
            "life_path": "You are ambitious, authoritative, and financially savvy. You have a talent for manifesting wealth and power.",
            "expression": "You express yourself as powerful, successful, and goal-oriented. You excel in business and finance.",
            "heart_desire": "Your inner desire is for achievement, recognition, and material abundance.",
            "personality": "You appear confident, competent, and in control to others. You are seen as a leader.",
            "birth_day": "You have a strong drive for success and material accomplishment from birth."
        },
        9: {
            "life_path": "You are compassionate, humanitarian, and idealistic. You are here to serve humanity and make the world better.",
            "expression": "You express yourself as tolerant, generous, and compassionate. You thrive in helping roles.",
            "heart_desire": "Your inner desire is to make a difference, help others, and express universal love.",
            "personality": "You appear compassionate, tolerant, and accepting to others. You are seen as the humanitarian.",
            "birth_day": "You have a compassionate and generous nature from birth."
        },
        11: {
            "life_path": "You are intuitive, inspirational, and a spiritual illuminator. You have heightened sensitivity and insight.",
            "expression": "You express yourself as visionary, inspiring, and spiritually aware. You bring light to others.",
            "heart_desire": "Your inner desire is for spiritual enlightenment, intuition, and inspiring others.",
            "personality": "You appear charismatic, sensitive, and spiritually attuned to others. You are seen as a lightworker.",
            "birth_day": "You have intuitive and inspirational qualities from birth (master number)."
        },
        22: {
            "life_path": "You are a master builder, capable of turning dreams into reality on a large scale. You have great potential for achievement.",
            "expression": "You express yourself as capable, powerful, and practical. You can manifest large-scale projects.",
            "heart_desire": "Your inner desire is to create lasting value, build legacies, and achieve monumental goals.",
            "personality": "You appear capable, confident, and authoritative to others. You are seen as a master builder.",
            "birth_day": "You have exceptional potential for achievement and manifestation from birth (master number)."
        },
        33: {
            "life_path": "You are a master teacher, dedicated to uplifting humanity through love and wisdom. You embody compassion and guidance.",
            "expression": "You express yourself as loving, wise, and selfless. You inspire others through your example.",
            "heart_desire": "Your inner desire is to teach, heal, and serve humanity with unconditional love.",
            "personality": "You appear loving, compassionate, and wise to others. You are seen as a spiritual teacher.",
            "birth_day": "You have profound compassion and wisdom from birth (master number)."
        }
    }
    
    # Default to 9 if number not in interpretations (should not happen for 1-9,11,22,33)
    if number not in interpretations:
        number = 9
    
    return interpretations[number].get(number_type, "No interpretation available.")

def get_numerology_report(birthdate: str, full_name: str) -> dict:
    """
    Generate a complete numerology report.
    """
    life_path = calculate_life_path(birthdate)
    expression = calculate_expression_name(full_name)
    heart_desire = calculate_heart_desire(full_name)
    personality = calculate_personality(full_name)
    birth_day = calculate_birth_day(birthdate)
    
    return {
        "life_path": {
            "number": life_path,
            "interpretation": get_number_interpretation(life_path, "life_path")
        },
        "expression": {
            "number": expression,
            "interpretation": get_number_interpretation(expression, "expression")
        },
        "heart_desire": {
            "number": heart_desire,
            "interpretation": get_number_interpretation(heart_desire, "heart_desire")
        },
        "personality": {
            "number": personality,
            "interpretation": get_number_interpretation(personality, "personality")
        },
        "birth_day": {
            "number": birth_day,
            "interpretation": get_number_interpretation(birth_day, "birth_day")
        },
        "birthdate": birthdate,
        "full_name": full_name
    }