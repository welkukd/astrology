export type ReadingSection = {
  title: string;
  content: string;
  icon: string;
};

// ---------------------------------------------------------------------------
// Planet in Sign interpretations
// ---------------------------------------------------------------------------
const PLANET_SIGNS: Record<string, Record<string, string>> = {
  Sun: {
    Aries:
      "Your Sun in Aries suggests a pioneering spirit and natural leadership ability. You may indicate a strong drive to initiate projects and forge your own path, often inspiring others with your courage. This placement invites reflection on balancing assertiveness with consideration for those around you.",
    Taurus:
      "Your Sun in Taurus points to a grounded, steady approach to life. You may indicate a deep appreciation for beauty, comfort, and material security, building lasting value through persistence. This placement invites reflection on finding stability without becoming overly attached to the status quo.",
    Gemini:
      "Your Sun in Gemini suggests a quick, curious mind that thrives on variety and connection. You may indicate a gift for communication, weaving ideas together with effortless versatility. This placement invites reflection on deepening focus while honoring your love of intellectual exploration.",
    Cancer:
      "Your Sun in Cancer reveals a nurturing, emotionally attuned nature. You may indicate a strong connection to home, family, and the people you protect, offering deep empathy and care. This placement invites reflection on setting healthy emotional boundaries while staying open-hearted.",
    Leo:
      "Your Sun in Leo radiates creativity, warmth, and a natural magnetism. You may indicate a desire for self-expression and recognition, shining brightest when you share your unique gifts. This placement invites reflection on cultivating confidence without seeking external validation.",
    Virgo:
      "Your Sun in Virgo suggests an analytical, service-oriented approach to life. You may indicate a keen eye for detail and a desire to improve everything you touch through practical wisdom. This placement invites reflection on embracing imperfection while still striving for excellence.",
    Libra:
      "Your Sun in Libra points to a deep need for harmony, beauty, and meaningful partnership. You may indicate a natural diplomat who sees all sides of a situation and seeks balance in every relationship. This placement invites reflection on honoring your own needs while maintaining peace.",
    Scorpio:
      "Your Sun in Scorpio reveals an intense, transformative nature. You may indicate a powerful ability to dive beneath the surface, uncovering truth and navigating the deeper currents of life. This placement invites reflection on embracing vulnerability as a source of strength.",
    Sagittarius:
      "Your Sun in Sagittarius suggests an expansive, philosophical outlook on life. You may indicate a love of adventure, learning, and broadening your horizons through experience and wisdom. This placement invites reflection on channeling your optimism into meaningful, grounded pursuits.",
    Capricorn:
      "Your Sun in Capricorn reveals a disciplined, ambitious nature driven by long-term goals. You may indicate a natural ability to build structures, lead with authority, and turn visions into tangible achievements. This placement invites reflection on balancing ambition with self-care and connection.",
    Aquarius:
      "Your Sun in Aquarius suggests an innovative, independent spirit that marches to its own beat. You may indicate a visionary quality, drawn to humanitarian causes and groundbreaking ideas that challenge convention. This placement invites reflection on balancing independence with meaningful community ties.",
    Pisces:
      "Your Sun in Pisces reveals a deeply intuitive, compassionate, and spiritual nature. You may indicate a rich inner world and a gift for connecting with the unseen dimensions of life. This placement invites reflection on grounding your sensitivity in practical reality while honoring your dreams.",
  },

  Moon: {
    Aries:
      "Your Moon in Aries suggests emotionally quick responses and a need for independence in your inner world. You may indicate a fiery emotional nature that processes feelings rapidly and recovers quickly from setbacks. This placement invites reflection on pausing before reacting to honor both your impulses and those around you.",
    Taurus:
      "Your Moon in Taurus points to a deep need for emotional security, comfort, and stability. You may indicate a calming presence that finds peace in nature, beauty, and reliable routines. This placement invites reflection on finding emotional grounding without becoming resistant to necessary change.",
    Gemini:
      "Your Moon in Gemini suggests an emotionally communicative and intellectually curious inner world. You may indicate a need to talk through feelings and process emotions through connection and mental engagement. This placement invites reflection on sitting with emotions rather than always analyzing them.",
    Cancer:
      "Your Moon in Cancer amplifies your natural emotional depth and nurturing instincts. You may indicate a profound sensitivity to the emotional currents around you and a deep need for belonging and safety. This placement invites reflection on caring for yourself with the same tenderness you offer others.",
    Leo:
      "Your Moon in Leo suggests a warm, expressive emotional nature that craves recognition and appreciation. You may indicate a dramatic flair in how you process and share feelings, with a generous heart that lights up a room. This placement invites reflection on finding emotional validation from within.",
    Virgo:
      "Your Moon in Virgo points to an emotionally analytical nature that finds comfort in order and usefulness. You may indicate a tendency to process feelings through practical action and a desire to be of service. This placement invites reflection on allowing emotions to be felt fully without immediately trying to fix them.",
    Libra:
      "Your Moon in Libra suggests a deep emotional need for harmony, beauty, and balanced relationships. You may indicate a soothing presence that naturally mediates and creates peace in emotional environments. This placement invites reflection on honoring your own emotional needs alongside your desire for partnership.",
    Scorpio:
      "Your Moon in Scorpio reveals an intensely emotional and deeply perceptive inner world. You may indicate a powerful ability to sense the unspoken and navigate complex emotional landscapes with courage. This placement invites reflection on trusting others with your vulnerability and allowing emotional transformation.",
    Sagittarius:
      "Your Moon in Sagittarius suggests an emotionally optimistic and freedom-loving nature. You may indicate a need for adventure and growth in your emotional life, finding solace in philosophy and exploration. This placement invites reflection on finding emotional depth without feeling confined by routine.",
    Capricorn:
      "Your Moon in Capricorn points to an emotionally reserved and deeply responsible inner world. You may indicate a tendency to contain feelings and process them privately, finding comfort in structure and achievement. This placement invites reflection on softening emotional walls and allowing yourself to receive support.",
    Aquarius:
      "Your Moon in Aquarius suggests an emotionally independent and intellectually driven inner life. You may indicate a unique way of processing feelings, often detaching to gain perspective before re-engaging. This placement invites reflection on connecting emotionally with others even when it feels vulnerable.",
    Pisces:
      "Your Moon in Pisces amplifies your emotional sensitivity and intuitive nature. You may indicate a profound ability to absorb and transmute the emotions of those around you, with a rich dream life and deep compassion. This placement invites reflection on protecting your emotional energy while staying open to the beauty of feeling deeply.",
  },

  Mercury: {
    Aries:
      "Your Mercury in Aries suggests a quick, direct, and assertive communication style. You may indicate a mind that processes ideas rapidly and speaks with confidence and clarity. This placement invites reflection on pausing to consider how your words land with others before diving in.",
    Taurus:
      "Your Mercury in Taurus points to a deliberate, practical, and grounded way of thinking. You may indicate a mind that prefers concrete information and takes time to form well-considered opinions. This placement invites reflection on remaining open to new perspectives even when your views feel solid.",
    Gemini:
      "Your Mercury in Gemini enhances your natural intellectual agility and communicative gifts. You may indicate a mind that thrives on variety, connecting disparate ideas with ease and charm. This placement invites reflection on deepening your focus to match your breadth of knowledge.",
    Cancer:
      "Your Mercury in Cancer suggests an emotionally intuitive and memory-rich communication style. You may indicate a mind that processes information through feeling and personal experience, with a gift for nurturing conversations. This placement invites reflection on balancing emotional responses with objective analysis.",
    Leo:
      "Your Mercury in Leo points to a warm, expressive, and creative communication style. You may indicate a mind that enjoys storytelling, performance, and ideas that allow for self-expression. This placement invites reflection on listening as deeply as you speak to create true dialogue.",
    Virgo:
      "Your Mercury in Virgo sharpens your analytical and detail-oriented thinking. You may indicate a mind that excels at organizing, editing, and refining information with precision. This placement invites reflection on embracing good-enough rather than chasing unattainable perfection.",
    Libra:
      "Your Mercury in Libra suggests a diplomatic, balanced, and aesthetically attuned communication style. You may indicate a mind that naturally considers multiple perspectives and seeks fairness in every exchange. This placement invites reflection on voicing your own opinion even when it disrupts harmony.",
    Scorpio:
      "Your Mercury in Scorpio reveals a penetrating, investigative, and intensely focused mind. You may indicate a gift for getting to the heart of any matter and communicating with depth and conviction. This placement invites reflection on sharing your insights with gentleness rather than intensity alone.",
    Sagittarius:
      "Your Mercury in Sagittarius suggests an expansive, philosophical, and optimistic communication style. You may indicate a mind that loves exploring big ideas and sharing wisdom with enthusiasm. This placement invites reflection on attending to details and nuance alongside your love of the big picture.",
    Capricorn:
      "Your Mercury in Capricorn points to a structured, practical, and authoritative way of thinking. You may indicate a mind that communicates with clarity and purpose, building ideas into actionable plans. This placement invites reflection on allowing creative and unconventional thoughts to flourish alongside your disciplined thinking.",
    Aquarius:
      "Your Mercury in Aquarius suggests an innovative, independent, and forward-thinking communication style. You may indicate a mind that generates original ideas and challenges conventional thinking with ease. This placement invites reflection on grounding your visionary concepts in practical reality for broader impact.",
    Pisces:
      "Your Mercury in Pisces reveals a deeply intuitive, imaginative, and empathetic way of thinking. You may indicate a mind that processes information through feelings, images, and spiritual insight. This placement invites reflection on clarifying your thoughts through writing or structured communication to share your inner visions effectively.",
  },

  Venus: {
    Aries:
      "Your Venus in Aries suggests a passionate, direct, and independent approach to love and beauty. You may indicate an attraction to excitement and spontaneity in relationships, pursuing love with courage and enthusiasm. This placement invites reflection on balancing your need for independence with the tenderness of partnership.",
    Taurus:
      "Your Venus in Taurus deepens your appreciation for sensual beauty, comfort, and lasting love. You may indicate a need for stability, loyalty, and physical affection in relationships, building deep bonds through shared pleasures. This placement invites reflection on finding security without becoming possessive.",
    Gemini:
      "Your Venus in Gemini suggests a playful, intellectually stimulating approach to love and connection. You may indicate an attraction to wit, conversation, and variety in relationships, keeping love alive through mental engagement. This placement invites reflection on deepening emotional intimacy alongside your love of intellectual exchange.",
    Cancer:
      "Your Venus in Cancer reveals a deeply nurturing, protective, and emotionally attuned style of love. You may indicate a need for emotional security, home, and family in your relationships, offering unconditional care. This placement invites reflection on creating emotional safety without becoming overly dependent on others.",
    Leo:
      "Your Venus in Leo suggests a warm, generous, and dramatic approach to love and romance. You may indicate a desire for admiration, loyalty, and grand gestures in relationships, loving with a big, open heart. This placement invites reflection on sharing the spotlight and loving without needing to be the center of attention.",
    Virgo:
      "Your Venus in Virgo points to a practical, devoted, and service-oriented style of love. You may indicate a tendency to show affection through acts of care and attention to detail, valuing substance over flash. This placement invites reflection on accepting love imperfectly rather than seeking an idealized version.",
    Libra:
      "Your Venus in Libra enhances your natural affinity for beauty, harmony, and partnership. You may indicate a deep romantic nature that thrives in balanced, aesthetically pleasing relationships filled with mutual respect. This placement invites reflection on honoring your own desires alongside your partner's.",
    Scorpio:
      "Your Venus in Scorpio reveals an intense, transformative, and deeply passionate approach to love. You may indicate a desire for soul-deep connection and complete emotional honesty in relationships. This placement invites reflection on trusting love without seeking to control or possess the object of your affection.",
    Sagittarius:
      "Your Venus in Sagittarius suggests a free-spirited, adventurous, and philosophical approach to love. You may indicate an attraction to partners who expand your world and share your love of exploration and growth. This placement invites reflection on finding commitment without feeling restricted by it.",
    Capricorn:
      "Your Venus in Capricorn points to a reserved, loyal, and long-term approach to love and relationships. You may indicate a tendency to build love slowly, valuing commitment, stability, and shared ambitions. This placement invites reflection on opening your heart more freely and allowing vulnerability to deepen your connections.",
    Aquarius:
      "Your Venus in Aquarius suggests an unconventional, friendship-based, and intellectually driven approach to love. You may indicate a need for independence and authenticity in relationships, attracted to unique and progressive partners. This placement invites reflection on balancing your need for freedom with the deeper emotional demands of intimacy.",
    Pisces:
      "Your Venus in Pisces reveals a deeply romantic, compassionate, and spiritually attuned style of love. You may indicate a tendency to idealize partners and love with boundless devotion and empathy. This placement invites reflection on maintaining healthy boundaries while honoring your beautiful capacity for unconditional love.",
  },

  Mars: {
    Aries:
      "Your Mars in Aries amplifies your natural drive, courage, and assertiveness. You may indicate a powerful pioneering energy that initiates action and tackles challenges head-on with fearless determination. This placement invites reflection on channeling your competitive fire into constructive pursuits that uplift everyone involved.",
    Taurus:
      "Your Mars in Taurus suggests a steady, persistent, and methodical approach to action and desire. You may indicate a slow-burning determination that builds momentum over time, achieving goals through patience and dedication. This placement invites reflection on remaining flexible when your carefully laid plans need adjustment.",
    Gemini:
      "Your Mars in Gemini points to a mentally agile, communicative, and multitasking approach to action. You may indicate a restless energy that thrives on variety and intellectual stimulation, acting quickly on new ideas. This placement invites reflection on following through with focus rather than constantly jumping to the next project.",
    Cancer:
      "Your Mars in Cancer suggests an emotionally driven and protective approach to action. You may indicate a fierce determination that emerges when your loved ones or values are threatened, fighting for emotional security. This placement invites reflection on expressing anger directly rather than retreating into passive resistance.",
    Leo:
      "Your Mars in Leo reveals a bold, creative, and dramatic approach to action and desire. You may indicate a powerful need for recognition and self-expression, pursuing goals with theatrical flair and confidence. This placement invites reflection on pursuing challenges for their own sake rather than for applause.",
    Virgo:
      "Your Mars in Virgo points to a precise, analytical, and service-oriented approach to action. You may indicate a meticulous energy that excels at detailed work, health-conscious pursuits, and practical problem-solving. This placement invites reflection on trusting your instincts alongside your careful analysis.",
    Libra:
      "Your Mars in Libra suggests a diplomatic, cooperative, and aesthetically driven approach to action. You may indicate a tendency to seek balance and fairness in how you assert yourself, often acting through partnership. This placement invites reflection on asserting your own needs directly rather than always deferring to others.",
    Scorpio:
      "Your Mars in Scorpio intensifies your drive, willpower, and capacity for deep transformation. You may indicate a relentless determination that pursues goals with strategic precision and emotional depth. This placement invites reflection on channeling your intensity into healing and regeneration rather than control.",
    Sagittarius:
      "Your Mars in Sagittarius suggests an adventurous, optimistic, and philosophically driven approach to action. You may indicate a boundless energy that thrives on exploration, learning, and expanding your horizons through bold action. This placement invites reflection on committing to projects long enough to see real results.",
    Capricorn:
      "Your Mars in Capricorn points to a disciplined, ambitious, and structurally focused approach to action. You may indicate a strategic energy that builds empires through patience, hard work, and unwavering determination. This placement invites reflection on balancing relentless ambition with moments of rest and self-care.",
    Aquarius:
      "Your Mars in Aquarius suggests an innovative, unconventional, and humanitarian approach to action. You may indicate a rebellious energy that fights for progress, equality, and groundbreaking change. This placement invites reflection on grounding your revolutionary ideals in practical, achievable steps.",
    Pisces:
      "Your Mars in Pisces reveals a spiritually driven, compassionate, and intuitively guided approach to action. You may indicate a gentle but persistent energy that acts on behalf of others, driven by empathy and idealism. This placement invites reflection on asserting your boundaries while staying connected to your compassionate nature.",
  },

  Jupiter: {
    Aries:
      "Your Jupiter in Aries suggests expansive growth through courage, independence, and pioneering action. You may indicate natural leadership luck that attracts opportunities when you boldly forge new paths. This placement invites reflection on sharing your pioneering spirit to inspire others while maintaining humility.",
    Taurus:
      "Your Jupiter in Taurus points to abundance through patience, practicality, and appreciation of life's pleasures. You may indicate a gift for attracting material comfort and financial security through steady, grounded efforts. This placement invites reflection on sharing your abundance and finding spiritual wealth alongside material prosperity.",
    Gemini:
      "Your Jupiter in Gemini suggests expansion through communication, learning, and intellectual curiosity. You may indicate a lucky streak in writing, speaking, or any form of information exchange that connects people and ideas. This placement invites reflection on deepening your knowledge as broadly as you explore it.",
    Cancer:
      "Your Jupiter in Cancer deepens your capacity for emotional abundance, nurturing growth, and protective generosity. You may indicate a natural gift for creating warm, supportive environments where everyone feels welcome and cared for. This placement invites reflection on expanding your emotional world while maintaining healthy boundaries.",
    Leo:
      "Your Jupiter in Leo suggests expansive growth through creativity, generosity, and joyful self-expression. You may indicate a magnetic presence that attracts abundance when you shine authentically and share your gifts with the world. This placement invites reflection on using your natural magnetism to uplift others rather than simply basking in attention.",
    Virgo:
      "Your Jupiter in Virgo points to growth through service, attention to detail, and practical improvement. You may indicate a fortunate ability to find abundance in small, meaningful acts of care and refinement. This placement invites reflection on celebrating progress rather than waiting for perfection.",
    Libra:
      "Your Jupiter in Libra suggests expansion through partnership, beauty, and harmonious relationships. You may indicate a natural grace that attracts fortunate connections and creates balance wherever you go. This placement invites reflection on pursuing justice and fairness as paths to your own growth and abundance.",
    Scorpio:
      "Your Jupiter in Scorpio reveals transformative growth through depth, emotional honesty, and fearless self-examination. You may indicate a powerful ability to attract resources and regeneration through confronting life's deeper truths. This placement invites reflection on sharing your transformative insights to help others heal.",
    Sagittarius:
      "Your Jupiter in Sagittarius amplifies your natural optimism, philosophical depth, and love of adventure. You may indicate extraordinary luck through travel, education, and expanding your worldview through diverse experiences. This placement invites reflection on grounding your expansive vision in practical action to create lasting impact.",
    Capricorn:
      "Your Jupiter in Capricorn suggests growth through discipline, structure, and long-term strategic planning. You may indicate a fortunate ability to build lasting empires through patience, hard work, and unwavering commitment to your goals. This placement invites reflection on balancing ambition with generosity and recognizing that true success includes lifting others up.",
    Aquarius:
      "Your Jupiter in Aquarius points to expansion through innovation, humanitarian efforts, and unconventional thinking. You may indicate a lucky streak when you embrace your uniqueness and contribute to collective progress and social change. This placement invites reflection on connecting your visionary ideas with grounded action to create meaningful reform.",
    Pisces:
      "Your Jupiter in Pisces deepens your spiritual abundance, intuitive wisdom, and compassionate generosity. You may indicate a profound connection to universal abundance that flows through acts of kindness, creativity, and spiritual practice. This placement invites reflection on trusting your inner wisdom as your most reliable guide to growth and fulfillment.",
  },

  Saturn: {
    Aries:
      "Your Saturn in Aries suggests lessons around developing self-confidence, independence, and personal initiative. You may indicate a need to build courage gradually, learning that your individual desires and actions have real value. This placement invites reflection on embracing your leadership potential even when it feels uncomfortable.",
    Taurus:
      "Your Saturn in Taurus points to lessons around security, self-worth, and the responsible use of resources. You may indicate a need to build financial stability slowly, learning the difference between healthy security and fearful attachment. This placement invites reflection on trusting your ability to create abundance through patient, practical effort.",
    Gemini:
      "Your Saturn in Gemini suggests lessons around communication, learning, and mental discipline. You may indicate a need to develop your voice carefully, learning to express ideas with clarity and conviction. This placement invites reflection on embracing your intellectual gifts even when self-doubt makes sharing them feel vulnerable.",
    Cancer:
      "Your Saturn in Cancer reveals lessons around emotional security, family, and nurturing yourself and others. You may indicate a need to build emotional foundations slowly, learning to feel safe while remaining open-hearted. This placement invites reflection on creating the emotional home you seek, both internally and externally.",
    Leo:
      "Your Saturn in Leo suggests lessons around creative expression, confidence, and authentic self-representation. You may indicate a need to develop your creative voice through discipline and practice, learning that your unique expression matters. This placement invites reflection on shining your light without needing external permission or approval.",
    Virgo:
      "Your Saturn in Virgo points to lessons around perfectionism, service, and practical self-care. You may indicate a need to develop healthy work habits and self-acceptance, learning that good enough is often truly good enough. This placement invites reflection on finding meaning in service without losing yourself in the details.",
    Libra:
      "Your Saturn in Libra suggests lessons around partnership, balance, and the mature expression of love. You may indicate a need to develop equal, respectful relationships that honor both your needs and your partner's. This placement invites reflection on learning to compromise without compromising your own integrity.",
    Scorpio:
      "Your Saturn in Scorpio reveals lessons around transformation, emotional depth, and the responsible use of personal power. You may indicate a need to confront your deepest fears and desires, learning to wield intensity with wisdom and compassion. This placement invites reflection on trusting the process of emotional death and rebirth as a path to genuine empowerment.",
    Sagittarius:
      "Your Saturn in Sagittarius points to lessons around faith, philosophy, and the disciplined pursuit of truth. You may indicate a need to develop your beliefs through experience and study, learning to balance optimism with realism. This placement invites reflection on building a personal philosophy that can withstand life's challenges.",
    Capricorn:
      "Your Saturn in Capricorn amplifies your natural discipline, ambition, and sense of responsibility. You may indicate a deep drive to build lasting structures and achieve meaningful goals through patience and perseverance. This placement invites reflection on softening your relentless standards to include joy and self-compassion along the way.",
    Aquarius:
      "Your Saturn in Aquarius suggests lessons around independence, innovation, and responsible contribution to society. You may indicate a need to balance your unconventional nature with practical commitments and community responsibilities. This placement invites reflection on building structures that support both your individuality and your desire to serve the greater good.",
    Pisces:
      "Your Saturn in Pisces reveals lessons around spiritual discipline, boundaries, and the practical expression of compassion. You may indicate a need to ground your spiritual gifts in reality, learning to serve others without losing yourself in their pain. This placement invites reflection on building a spiritual practice that sustains you through life's inevitable challenges.",
  },

  Uranus: {
    Aries:
      "Your Uranus in Aries suggests sudden breakthroughs in personal identity and independence. You may indicate a generational influence that pushes you toward pioneering change and authentic self-expression. This placement invites reflection on embracing your uniqueness as a catalyst for personal and collective transformation.",
    Taurus:
      "Your Uranus in Taurus points to revolutionary changes in values, resources, and your relationship with the material world. You may indicate a need to rethink what truly matters to you beyond conventional definitions of security. This placement invites reflection on finding innovative ways to create stability while remaining open to transformation.",
    Gemini:
      "Your Uranus in Gemini suggests sudden shifts in communication, learning, and intellectual exchange. You may indicate a gift for innovative thinking and connecting ideas in ways that challenge the status quo. This placement invites reflection on using your intellectual gifts to inspire progressive change in how information is shared and understood.",
    Cancer:
      "Your Uranus in Cancer reveals revolutionary changes in emotional patterns, family dynamics, and your sense of belonging. You may indicate a need to break free from inherited emotional patterns while still honoring your roots. This placement invites reflection on creating new forms of emotional security and family that reflect your authentic values.",
    Leo:
      "Your Uranus in Leo suggests sudden breakthroughs in creative expression, leadership, and personal authenticity. You may indicate a powerful drive to express your uniqueness in ways that inspire and liberate others. This placement invites reflection on using your creative innovations to challenge conventional ideas about self-expression and leadership.",
    Virgo:
      "Your Uranus in Virgo points to revolutionary changes in work, health, and daily routines. You may indicate a gift for innovative approaches to service, wellness, and practical problem-solving. This placement invites reflection on embracing change in your daily life as a path to greater efficiency and personal freedom.",
    Libra:
      "Your Uranus in Libra suggests sudden shifts in relationships, partnerships, and the pursuit of balance. You may indicate a need to revolutionize how you relate to others, seeking more authentic and equal connections. This placement invites reflection on redefining partnership on your own terms while maintaining respect for others.",
    Scorpio:
      "Your Uranus in Scorpio reveals transformative breakthroughs in emotional depth, intimacy, and personal power. You may indicate a powerful ability to catalyze deep transformation in yourself and others through fearless honesty. This placement invites reflection on channeling your transformative energy toward healing and regeneration.",
    Sagittarius:
      "Your Uranus in Sagittarius suggests sudden expansion in philosophy, travel, and your understanding of the world. You may indicate a gift for challenging limiting beliefs and inspiring broader perspectives through your unconventional wisdom. This placement invites reflection on sharing your visionary ideas in ways that empower others to think freely.",
    Capricorn:
      "Your Uranus in Capricorn points to revolutionary changes in structures, authority, and societal systems. You may indicate a powerful drive to reform outdated institutions and create more innovative, equitable structures. This placement invites reflection on building new systems that honor both progress and practical sustainability.",
    Aquarius:
      "Your Uranus in Aquarius amplifies your natural drive for innovation, independence, and humanitarian progress. You may indicate a generational influence that pushes you to champion equality, technology, and collective advancement. This placement invites reflection on using your revolutionary spirit to create meaningful, lasting change in your community and beyond.",
    Pisces:
      "Your Uranus in Pisces reveals sudden breakthroughs in spiritual awareness, intuition, and compassion. You may indicate a gift for channeling universal insights into creative or healing work that benefits all beings. This placement invites reflection on grounding your transcendent visions in practical action to manifest real-world healing.",
  },

  Neptune: {
    Aries:
      "Your Neptune in Aries suggests spiritual inspiration through courageous self-discovery and pioneering action. You may indicate a visionary quality that dreams of new beginnings and authentic self-expression. This placement invites reflection on grounding your spiritual visions in tangible, courageous action.",
    Taurus:
      "Your Neptune in Taurus points to spiritual depth through sensory beauty, nature, and material simplicity. You may indicate a refined aesthetic sense that finds the sacred in everyday pleasures and natural rhythms. This placement invites reflection on distinguishing between healthy spiritual materialism and genuine transcendence.",
    Gemini:
      "Your Neptune in Gemini suggests spiritual connection through communication, storytelling, and the exchange of ideas. You may indicate a gift for inspiring others through words and for finding spiritual meaning in intellectual exploration. This placement invites reflection on using your communicative gifts to share truths that elevate and heal.",
    Cancer:
      "Your Neptune in Cancer reveals spiritual depth through emotional connection, family, and nurturing love. You may indicate a profound sensitivity to the emotional currents of those around you, with a gift for healing through compassion. This placement invites reflection on protecting your emotional boundaries while maintaining your beautiful openness.",
    Leo:
      "Your Neptune in Leo suggests spiritual expression through creativity, joy, and authentic self-representation. You may indicate a gift for channeling divine inspiration into artistic or performative work that moves others. This placement invites reflection on sharing your spiritual gifts without seeking attention or validation for doing so.",
    Virgo:
      "Your Neptune in Virgo points to spiritual growth through service, attention to detail, and practical healing. You may indicate a gift for finding the sacred in everyday acts of care and for serving others with quiet devotion. This placement invites reflection on maintaining spiritual clarity amidst the demands of practical service.",
    Libra:
      "Your Neptune in Libra suggests spiritual connection through partnership, beauty, and the pursuit of harmony. You may indicate a deep longing for ideal love and a gift for creating sacred spaces of balance and peace. This placement invites reflection on accepting the imperfections of human relationships while still honoring your spiritual ideals.",
    Scorpio:
      "Your Neptune in Scorpio reveals spiritual transformation through emotional depth, intimacy, and fearless truth-telling. You may indicate a powerful ability to navigate the unseen dimensions of the psyche and to heal through deep emotional engagement. This placement invites reflection on using your transformative gifts with discernment and compassion.",
    Sagittarius:
      "Your Neptune in Sagittarius suggests spiritual expansion through philosophy, travel, and the pursuit of universal truth. You may indicate a visionary quality that dreams of a more just, compassionate world and inspires others to believe in possibility. This placement invites reflection on grounding your expansive spiritual vision in practical, achievable action.",
    Capricorn:
      "Your Neptune in Capricorn points to spiritual growth through discipline, responsibility, and the reform of structures. You may indicate a gift for bringing spiritual awareness into institutions and systems that serve the greater good. This placement invites reflection on maintaining spiritual integrity while working within conventional frameworks.",
    Aquarius:
      "Your Neptune in Aquarius suggests spiritual connection through innovation, community, and humanitarian ideals. You may indicate a visionary quality that dreams of collective healing and progressive social change. This placement invites reflection on translating your spiritual ideals into concrete actions that benefit your community and the world.",
    Pisces:
      "Your Neptune in Pisces amplifies your natural spiritual sensitivity, intuition, and compassionate depth. You may indicate a profound connection to universal consciousness and a gift for channeling spiritual insight into healing work. This placement invites reflection on grounding your transcendent experiences in practical reality to serve others effectively.",
  },

  Pluto: {
    Aries:
      "Your Pluto in Aries suggests transformative power through personal courage, independence, and pioneering action. You may indicate a generational influence that drives you to reinvent yourself and challenge the status quo through bold individual expression. This placement invites reflection on channeling your transformative energy toward creation rather than destruction.",
    Taurus:
      "Your Pluto in Taurus points to deep transformation around values, resources, and self-worth. You may indicate a powerful process of rebuilding your relationship with material security and personal values from the ground up. This placement invites reflection on releasing attachment to what no longer serves your highest good.",
    Gemini:
      "Your Pluto in Gemini suggests transformative power through communication, learning, and the exchange of ideas. You may indicate a gift for uncovering hidden truths and sharing insights that challenge conventional thinking. This placement invites reflection on using your investigative nature to illuminate rather than manipulate.",
    Cancer:
      "Your Pluto in Cancer reveals deep transformation around family, emotional patterns, and your sense of belonging. You may indicate a powerful process of healing inherited emotional wounds and creating new foundations of emotional security. This placement invites reflection on honoring your roots while transforming painful patterns into sources of strength.",
    Leo:
      "Your Pluto in Leo suggests transformative power through creative expression, leadership, and personal authenticity. You may indicate a generational influence that drives profound changes in how self-expression and leadership are understood. This placement invites reflection on using your creative power to inspire transformation in others.",
    Virgo:
      "Your Pluto in Virgo points to deep transformation around work, health, and daily service. You may indicate a powerful process of refining your approach to wellness and meaningful contribution. This placement invites reflection on embracing imperfection as a path to genuine healing and personal growth.",
    Libra:
      "Your Pluto in Libra suggests transformative power through partnership, balance, and the mature expression of love. You may indicate a generational influence that drives deep changes in how relationships and equality are understood. This placement invites reflection on creating partnerships that honor both individual power and mutual respect.",
    Scorpio:
      "Your Pluto in Scorpio amplifies your natural capacity for deep transformation, emotional honesty, and personal empowerment. You may indicate a powerful ability to navigate the deepest depths of the human experience and emerge transformed. This placement invites reflection on using your transformative gifts with wisdom, compassion, and discernment.",
    Sagittarius:
      "Your Pluto in Sagittarius suggests transformative power through philosophy, truth-seeking, and the expansion of consciousness. You may indicate a generational influence that drives profound changes in belief systems and cultural understanding. This placement invites reflection on channeling your transformative vision toward creating a more just and compassionate world.",
    Capricorn:
      "Your Pluto in Capricorn points to deep transformation of structures, authority, and societal systems. You may indicate a generational influence that drives fundamental changes in how power and institutions operate. This placement invites reflection on building new structures that honor both transformative change and practical sustainability.",
    Aquarius:
      "Your Pluto in Aquarius suggests transformative power through innovation, independence, and collective progress. You may indicate a generational influence that drives revolutionary changes in technology, society, and human connection. This placement invites reflection on using your transformative energy to create systems that serve the greater good.",
    Pisces:
      "Your Pluto in Pisces reveals deep spiritual transformation, intuitive power, and the dissolution of boundaries between self and universal consciousness. You may indicate a profound capacity for spiritual rebirth and healing that transcends personal experience. This placement invites reflection on channeling your transcendent gifts into practical service that benefits all beings.",
  },

  "North Node": {
    Aries:
      "Your North Node in Aries calls you toward developing courage, independence, and authentic self-assertion. You may indicate a life path that asks you to trust your instincts, take the lead, and pursue your own desires with confidence. This placement invites reflection on balancing your need for independence with healthy interdependence.",
    Taurus:
      "Your North Node in Taurus invites you toward stability, self-sufficiency, and the appreciation of life's simple pleasures. You may indicate a life path that asks you to build something lasting, trust your senses, and find contentment in the present moment. This placement invites reflection on cultivating inner security that transcends material circumstances.",
    Gemini:
      "Your North Node in Gemini calls you toward learning, communication, and the joyful exchange of ideas. You may indicate a life path that asks you to stay curious, connect with diverse perspectives, and share your thoughts with the world. This placement invites reflection on deepening your knowledge as broadly as you explore it.",
    Cancer:
      "Your North Node in Cancer invites you toward emotional depth, nurturing relationships, and the creation of a loving home. You may indicate a life path that asks you to honor your feelings, care for yourself and others, and build emotional security from within. This placement invites reflection on trusting your emotional wisdom as a guide through life.",
    Leo:
      "Your North Node in Leo calls you toward creative self-expression, authentic leadership, and joyful self-representation. You may indicate a life path that asks you to shine your unique light, embrace your creativity, and lead with heart. This placement invites reflection on sharing your gifts generously while remaining humble and open-hearted.",
    Virgo:
      "Your North Node in Virgo invites you toward service, practical improvement, and the refinement of your skills. You may indicate a life path that asks you to contribute meaningfully through attention to detail, continuous learning, and acts of care. This placement invites reflection on finding fulfillment in the quiet dignity of everyday service.",
    Libra:
      "Your North Node in Libra calls you toward partnership, harmony, and the pursuit of beauty and balance in all things. You may indicate a life path that asks you to develop your relational skills, seek fairness, and create peace wherever you go. This placement invites reflection on honoring your own needs alongside your deep desire for connection.",
    Scorpio:
      "Your North Node in Scorpio invites you toward emotional depth, transformation, and the responsible use of personal power. You may indicate a life path that asks you to confront your deepest fears, embrace vulnerability, and undergo profound personal transformation. This placement invites reflection on trusting the process of death and rebirth as a path to genuine empowerment.",
    Sagittarius:
      "Your North Node in Sagittarius calls you toward adventure, wisdom, and the expansion of your philosophical horizons. You may indicate a life path that asks you to trust your optimism, explore new territories, and share your wisdom generously. This placement invites reflection on grounding your expansive vision in practical action that creates lasting impact.",
    Capricorn:
      "Your North Node in Capricorn invites you toward discipline, ambition, and the building of lasting structures. You may indicate a life path that asks you to take responsibility, work patiently toward long-term goals, and develop your leadership abilities. This placement invites reflection on balancing ambition with self-care and recognizing that true success includes lifting others up.",
    Aquarius:
      "Your North Node in Aquarius calls you toward innovation, independence, and service to the collective. You may indicate a life path that asks you to embrace your uniqueness, champion progressive causes, and contribute to community progress. This placement invites reflection on finding belonging through authentic self-expression and service to something greater than yourself.",
    Pisces:
      "Your North Node in Pisces invites you toward spiritual growth, compassion, and the dissolution of rigid boundaries. You may indicate a life path that asks you to trust your intuition, embrace empathy, and connect with universal consciousness. This placement invites reflection on grounding your spiritual gifts in practical reality to serve others effectively.",
  },

  Chiron: {
    Aries:
      "Your Chiron in Aries highlights a wound around identity, self-assertion, and the courage to be yourself. You may indicate a deep-seated hesitation to take up space and assert your needs, paired with a powerful healing gift for helping others find their voice. This placement invites reflection on embracing your authentic self as a source of healing for the world.",
    Taurus:
      "Your Chiron in Taurus points to a wound around self-worth, security, and the ability to feel at peace in your body and the material world. You may indicate a journey of learning to trust your senses and find contentment beyond external validation. This placement invites reflection on recognizing that your inherent worth is never in question.",
    Gemini:
      "Your Chiron in Gemini suggests a wound around communication, learning, and the ability to express your thoughts clearly. You may indicate a healing gift for helping others find their voice and connect through language. This placement invites reflection on embracing your intellectual gifts and sharing them with confidence and vulnerability.",
    Cancer:
      "Your Chiron in Cancer reveals a wound around emotional security, belonging, and the ability to nurture yourself and others. You may indicate a deep journey of learning to create emotional safety and trust your feelings. This placement invites reflection on recognizing that you are worthy of the same love and care you so generously give to others.",
    Leo:
      "Your Chiron in Leo highlights a wound around creative expression, self-worth, and the courage to shine. You may indicate a healing gift for helping others reclaim their joy and authentic self-expression. This placement invites reflection on embracing your creative power and sharing your unique light with the world without apology.",
    Virgo:
      "Your Chiron in Virgo points to a wound around perfectionism, self-criticism, and the ability to feel good enough. You may indicate a journey of learning to embrace imperfection while still honoring your gifts of service and analysis. This placement invites reflection on recognizing that your worth is inherent and not dependent on productivity or perfection.",
    Libra:
      "Your Chiron in Libra suggests a wound around relationships, partnership, and the ability to feel worthy of balanced love. You may indicate a healing gift for helping others find harmony and justice in their connections. This placement invites reflection on honoring your own needs in relationships while maintaining your natural grace and diplomacy.",
    Scorpio:
      "Your Chiron in Scorpio reveals a wound around intimacy, trust, and the ability to be vulnerable with others. You may indicate a profound journey of learning to let go of control and allow genuine connection. This placement invites reflection on recognizing that true power comes from surrendering to transformation rather than resisting it.",
    Sagittarius:
      "Your Chiron in Sagittarius points to a wound around faith, belief, and the ability to trust in something greater than yourself. You may indicate a healing gift for helping others find meaning and expand their perspective. This placement invites reflection on rebuilding your faith through experience, study, and an open heart.",
    Capricorn:
      "Your Chiron in Capricorn suggests a wound around authority, ambition, and the ability to trust your own path. You may indicate a journey of learning to build your own structures and claim your authority without seeking external approval. This placement invites reflection on recognizing that your ambition, when guided by integrity, is a force for good.",
    Aquarius:
      "Your Chiron in Aquarius highlights a wound around belonging, community, and the ability to feel accepted for who you truly are. You may indicate a healing gift for helping others embrace their uniqueness and find their tribe. This placement invites reflection on recognizing that your unconventional nature is precisely what the world needs.",
    Pisces:
      "Your Chiron in Pisces reveals a wound around spiritual connection, boundaries, and the ability to navigate the unseen dimensions of life. You may indicate a profound journey of learning to protect your sensitivity while maintaining your connection to universal compassion. This placement invites reflection on recognizing that your spiritual gifts, when grounded in practice, can heal both yourself and others.",
  },
};

// ---------------------------------------------------------------------------
// Planet in House interpretations
// ---------------------------------------------------------------------------
const PLANET_HOUSES: Record<string, Record<number, string>> = {
  Sun: {
    1: "With your Sun in the 1st House, your core identity is expressed directly through your personality and appearance. You may indicate a strong sense of self and a natural ability to take initiative, often being perceived as confident and self-assured. This placement invites reflection on how your personal magnetism shapes your interactions with the world.",
    2: "With your Sun in the 2nd House, your sense of self is closely tied to your values, resources, and material security. You may indicate a natural ability to attract and manage resources, building a strong foundation of self-worth through practical achievements. This placement invites reflection on finding identity beyond material possessions.",
    3: "With your Sun in the 3rd House, your identity is expressed through communication, learning, and connection with siblings or your immediate environment. You may indicate a curious, intellectually engaged nature that thrives on sharing ideas and gathering information. This placement invites reflection on deepening your focus while honoring your natural communicative gifts.",
    4: "With your Sun in the 4th House, your core identity is rooted in home, family, and emotional foundations. You may indicate a deep need for security and belonging, finding your true self in private, intimate settings. This placement invites reflection on building emotional security from within rather than relying solely on external circumstances.",
    5: "With your Sun in the 5th House, your identity shines through creative self-expression, romance, and joyful pursuits. You may indicate a natural charisma and a gift for inspiring others through your creativity and playfulness. This placement invites reflection on sharing your gifts generously while remaining grounded in authentic self-expression.",
    6: "With your Sun in the 6th House, your sense of self is expressed through service, daily routines, and attention to health and detail. You may indicate a diligent, service-oriented nature that finds fulfillment in meaningful work and self-improvement. This placement invites reflection on balancing productivity with self-care and celebrating progress over perfection.",
    7: "With your Sun in the 7th House, your identity is closely tied to partnerships and one-on-one relationships. You may indicate a natural ability to relate to others and a tendency to define yourself through your connections. This placement invites reflection on maintaining your individual identity while honoring the depth of your partnerships.",
    8: "With your Sun in the 8th House, your core identity is revealed through transformation, intimacy, and the deeper currents of life. You may indicate a powerful, magnetic presence drawn to exploring the hidden dimensions of existence. This placement invites reflection on embracing vulnerability as a source of genuine power and connection.",
    9: "With your Sun in the 9th House, your identity is expressed through philosophy, adventure, and the pursuit of wisdom. You may indicate a broad, optimistic perspective and a deep need to explore the world and expand your understanding. This placement invites reflection on grounding your expansive vision in practical, daily action.",
    10: "With your Sun in the 10th House, your core identity is closely connected to your career, public reputation, and life direction. You may indicate a strong drive for achievement and recognition, often being perceived as ambitious and authoritative. This placement invites reflection on building a career that aligns with your authentic values and inner truth.",
    11: "With your Sun in the 11th House, your identity is expressed through friendships, community involvement, and humanitarian ideals. You may indicate a forward-thinking, socially conscious nature that thrives in collective settings. This placement invites reflection on balancing your need for community with your individual goals and authentic self-expression.",
    12: "With your Sun in the 12th House, your core identity is deeply connected to the spiritual, intuitive, and hidden dimensions of life. You may indicate a rich inner world and a natural gift for compassion, often finding meaning in solitude and spiritual practice. This placement invites reflection on honoring your sensitivity while grounding yourself in practical reality.",
  },

  Moon: {
    1: "With your Moon in the 1st House, your emotional nature is immediately visible and central to your identity. You may indicate a sensitive, nurturing presence that others respond to instinctively. This placement invites reflection on how your emotional openness shapes your self-image and interactions with the world.",
    2: "With your Moon in the 2nd House, your emotional security is closely tied to your material resources and sense of self-worth. You may indicate a deep need for financial stability and physical comfort as foundations for emotional well-being. This placement invites reflection on finding emotional security that transcends material circumstances.",
    3: "With your Moon in the 3rd House, your emotional well-being is connected to communication, learning, and your immediate environment. You may indicate a need to process feelings through conversation and intellectual engagement. This placement invites reflection on finding emotional depth alongside your natural mental agility.",
    4: "With your Moon in the 4th House, your emotional life is deeply rooted in home, family, and your innermost feelings. You may indicate a profound need for emotional security, belonging, and a safe private space. This placement invites reflection on creating the emotional home you seek, both internally and in your living environment.",
    5: "With your Moon in the 5th House, your emotions are expressed through creativity, romance, and joyful self-expression. You may indicate a warm, playful emotional nature that thrives on love, art, and creative play. This placement invites reflection on honoring your emotional needs for joy and creative expression as vital to your well-being.",
    6: "With your Moon in the 6th House, your emotional well-being is connected to daily routines, service, and physical health. You may indicate a need for order and meaningful work to feel emotionally grounded. This placement invites reflection on creating daily practices that nurture your emotional body as well as your physical body.",
    7: "With your Moon in the 7th House, your emotional security is deeply tied to partnerships and close relationships. You may indicate a need for emotional connection and harmony in your one-on-one bonds. This placement invites reflection on developing emotional independence alongside your natural gift for deep partnership.",
    8: "With your Moon in the 8th House, your emotional life is intense, transformative, and deeply perceptive. You may indicate a powerful ability to sense the unspoken and navigate complex emotional terrain. This placement invites reflection on trusting the process of emotional transformation while maintaining healthy boundaries.",
    9: "With your Moon in the 9th House, your emotional well-being is connected to philosophy, travel, and the expansion of your worldview. You may indicate a need for adventure and meaning to feel emotionally fulfilled. This placement invites reflection on finding emotional grounding while honoring your need for growth and exploration.",
    10: "With your Moon in the 10th House, your emotional life is closely connected to your career, public image, and life direction. You may indicate a deep need for your work to feel meaningful and aligned with your emotional values. This placement invites reflection on building a career path that honors both your professional ambitions and your emotional well-being.",
    11: "With your Moon in the 11th House, your emotional security is tied to friendships, community, and your sense of belonging to something larger. You may indicate a need for meaningful social connections and a sense of collective purpose. This placement invites reflection on balancing your need for community with your individual emotional needs.",
    12: "With your Moon in the 12th House, your emotional life is deeply connected to the spiritual, intuitive, and unconscious dimensions of existence. You may indicate a profound sensitivity that requires regular solitude and spiritual practice to maintain balance. This placement invites reflection on protecting your emotional energy while honoring your deep connection to universal compassion.",
  },

  Mercury: {
    1: "With Mercury in the 1st House, your communication style and thinking patterns are central to your identity. You may indicate a quick, mentally agile nature that expresses ideas with confidence and clarity. This placement invites reflection on how your words shape others' perceptions of you and how to use your communicative gifts responsibly.",
    2: "With Mercury in the 2nd House, your thinking is focused on practical matters, values, and resource management. You may indicate a mind that excels at financial planning, budgeting, and translating ideas into tangible value. This placement invites reflection on expanding your thinking beyond material concerns to encompass broader intellectual interests.",
    3: "With Mercury in the 3rd House, your communication and intellectual gifts are amplified, making this a natural placement for writers, teachers, and speakers. You may indicate a quick, curious mind that thrives on gathering and sharing information. This placement invites reflection on deepening your focus to match your impressive breadth of knowledge.",
    4: "With Mercury in the 4th House, your thinking is deeply influenced by your home, family, and emotional foundations. You may indicate a mind that processes information through feeling and personal experience. This placement invites reflection on balancing emotional responses with objective analysis in your communication.",
    5: "With Mercury in the 5th House, your thinking is creative, playful, and self-expressive. You may indicate a mind that enjoys storytelling, games, and any intellectual activity that allows for personal expression. This placement invites reflection on channeling your creative thinking into projects that make a meaningful impact.",
    6: "With Mercury in the 6th House, your thinking is analytical, detail-oriented, and service-focused. You may indicate a mind that excels at organizing, editing, and refining information with precision. This placement invites reflection on trusting your instincts alongside your careful analysis for more balanced decision-making.",
    7: "With Mercury in the 7th House, your thinking is deeply influenced by partnerships and one-on-one interactions. You may indicate a mind that thrives through dialogue and values the perspectives of others. This placement invites reflection on developing your own independent thinking while honoring the collaborative process.",
    8: "With Mercury in the 8th House, your thinking is penetrating, investigative, and drawn to the deeper truths beneath the surface. You may indicate a mind that excels at research, psychological insight, and uncovering hidden information. This placement invites reflection on sharing your insights with gentleness rather than intensity alone.",
    9: "With Mercury in the 9th House, your thinking is expansive, philosophical, and drawn to big ideas and global perspectives. You may indicate a mind that thrives on exploring diverse cultures, belief systems, and intellectual frontiers. This placement invites reflection on grounding your expansive thinking in practical details for more effective communication.",
    10: "With Mercury in the 10th House, your thinking is focused on career, public communication, and long-term goals. You may indicate a mind that excels at strategic planning and professional communication. This placement invites reflection on ensuring your professional thinking aligns with your personal values and intellectual curiosity.",
    11: "With Mercury in the 11th House, your thinking is innovative, forward-looking, and community-oriented. You may indicate a mind that generates original ideas and values collective intellectual exchange. This placement invites reflection on translating your innovative thinking into practical actions that benefit your community.",
    12: "With Mercury in the 12th House, your thinking is deeply intuitive, reflective, and connected to the unconscious dimensions of the mind. You may indicate a gift for processing information through dreams, meditation, and inner reflection. This placement invites reflection on clarifying your thoughts through writing or structured communication to share your inner wisdom effectively.",
  },

  Venus: {
    1: "With Venus in the 1st House, your approach to love, beauty, and relationships is central to your identity. You may indicate a naturally charming, attractive presence that draws others to you with ease. This placement invites reflection on how your relational nature shapes your self-image and how to maintain authenticity in your connections.",
    2: "With Venus in the 2nd House, your love nature is expressed through devotion, sensuality, and the creation of beauty in your environment. You may indicate a deep appreciation for physical pleasures and a gift for building lasting relationships grounded in stability and trust. This placement invites reflection on finding love that transcends material comfort.",
    3: "With Venus in the 3rd House, your love nature is expressed through communication, intellectual connection, and playful exchange. You may indicate a gift for flirtation, verbal affection, and creating love through conversation and shared ideas. This placement invites reflection on deepening emotional intimacy alongside your love of intellectual engagement.",
    4: "With Venus in the 4th House, your love nature is deeply connected to home, family, and emotional security. You may indicate a nurturing, devoted approach to relationships that values comfort, loyalty, and shared emotional foundations. This placement invites reflection on creating romantic connections that feel like home while maintaining healthy emotional boundaries.",
    5: "With Venus in the 5th House, your love nature is romantic, creative, and joyfully expressive. You may indicate a passionate, generous approach to love that thrives on romance, art, and playful connection. This placement invites reflection on sharing your heart generously while maintaining your sense of individual identity within romantic partnerships.",
    6: "With Venus in the 6th House, your love nature is expressed through acts of service, devotion, and attention to detail. You may indicate a practical, caring approach to relationships that shows love through daily care and thoughtful gestures. This placement invites reflection on receiving love with the same grace with which you give it.",
    7: "With Venus in the 7th House, your love nature is deeply connected to partnership, balance, and the pursuit of harmonious relationships. You may indicate a natural grace in relating to others and a deep need for mutual respect and beauty in your partnerships. This placement invites reflection on honoring your own desires alongside your partner's for truly balanced love.",
    8: "With Venus in the 8th House, your love nature is intense, transformative, and deeply intimate. You may indicate a desire for soul-deep connection and complete emotional honesty in your closest relationships. This placement invites reflection on trusting love without seeking to control or possess the object of your affection.",
    9: "With Venus in the 9th House, your love nature is expressed through shared adventures, philosophical connection, and the expansion of your world through partnership. You may indicate a gift for finding love in diverse cultures, shared learning, and mutual growth. This placement invites reflection on building commitment that honors both freedom and devotion.",
    10: "With Venus in the 10th House, your love nature is connected to your career, public image, and long-term aspirations. You may indicate a desire for a partner who supports your professional ambitions and shares your vision for the future. This placement invites reflection on balancing career success with the cultivation of deep, meaningful romantic connections.",
    11: "With Venus in the 11th House, your love nature is friendship-based, egalitarian, and community-oriented. You may indicate a gift for finding love through shared ideals, group activities, and humanitarian pursuits. This placement invites reflection on deepening emotional intimacy within your naturally social and independent approach to relationships.",
    12: "With Venus in the 12th House, your love nature is deeply spiritual, selfless, and connected to universal compassion. You may indicate a tendency toward idealized love and a gift for loving without conditions or expectations. This placement invites reflection on maintaining healthy boundaries while honoring your beautiful capacity for unconditional love.",
  },

  Mars: {
    1: "With Mars in the 1st House, your drive, energy, and assertiveness are central to your identity. You may indicate a bold, action-oriented nature that takes initiative and pursues goals with fearless determination. This placement invites reflection on channeling your competitive fire into constructive pursuits that benefit both yourself and others.",
    2: "With Mars in the 2nd House, your drive is focused on building security, acquiring resources, and defending your values. You may indicate a persistent, determined energy that works steadily toward material goals. This placement invites reflection on ensuring your pursuit of security doesn't overshadow your deeper spiritual and emotional needs.",
    3: "With Mars in the 3rd House, your drive is expressed through communication, learning, and intellectual engagement. You may indicate a quick, assertive mind that debates passionately and pursues knowledge with enthusiasm. This placement invites reflection on using your communicative energy to inspire and uplift rather than dominate conversations.",
    4: "With Mars in the 4th House, your drive is connected to home, family, and emotional foundations. You may indicate a fierce protective energy that fights for the security of your loved ones and your inner world. This placement invites reflection on expressing anger directly rather than allowing it to simmer beneath the surface of domestic life.",
    5: "With Mars in the 5th House, your drive is expressed through creative passion, romance, and joyful self-expression. You may indicate a bold, enthusiastic approach to love and creativity that inspires others with your energy. This placement invites reflection on channeling your passionate energy into projects that create lasting beauty and meaningful connection.",
    6: "With Mars in the 6th House, your drive is focused on service, daily improvement, and physical well-being. You may indicate a diligent, hardworking energy that tackles tasks with precision and dedication. This placement invites reflection on balancing your drive for productivity with adequate rest and self-care.",
    7: "With Mars in the 7th House, your drive is activated through partnerships and one-on-one interactions. You may indicate a tendency to assert yourself strongly in relationships, sometimes creating friction but always bringing energy to partnerships. This placement invites reflection on learning to collaborate rather than compete in your closest bonds.",
    8: "With Mars in the 8th House, your drive is intense, transformative, and drawn to the deeper currents of life. You may indicate a powerful ability to channel your energy into profound personal transformation and healing work. This placement invites reflection on using your intensity wisely, avoiding destructive patterns while embracing positive change.",
    9: "With Mars in the 9th House, your drive is expressed through adventure, philosophy, and the pursuit of wisdom. You may indicate a bold, optimistic energy that takes risks in the name of learning and growth. This placement invites reflection on committing to your philosophical pursuits long enough to translate your adventurous spirit into lasting wisdom.",
    10: "With Mars in the 10th House, your drive is focused on career achievement, public recognition, and long-term goals. You may indicate a powerful ambition that propels you toward professional success and leadership positions. This placement invites reflection on balancing relentless ambition with moments of rest, self-care, and meaningful personal connection.",
    11: "With Mars in the 11th House, your drive is directed toward community action, social change, and collective progress. You may indicate a passionate energy that fights for causes you believe in and inspires others through your dedication. This placement invites reflection on channeling your activist energy into sustainable, long-term efforts that create real impact.",
    12: "With Mars in the 12th House, your drive is connected to the spiritual, intuitive, and unconscious dimensions of action. You may indicate a gentle but persistent energy that acts on behalf of others, driven by empathy and idealism. This placement invites reflection on asserting your boundaries while staying connected to your compassionate, spiritually guided nature.",
  },

  Jupiter: {
    1: "With Jupiter in the 1st House, your natural optimism, generosity, and expansive nature are central to your identity. You may indicate a magnetic presence that attracts opportunities and inspires others with your enthusiasm. This placement invites reflection on using your abundant energy to uplift others while remaining grounded in humility.",
    2: "With Jupiter in the 2nd House, your growth and abundance are connected to material resources, self-worth, and the appreciation of life's pleasures. You may indicate a natural ability to attract financial opportunities and build lasting security. This placement invites reflection on sharing your abundance and finding spiritual wealth alongside material prosperity.",
    3: "With Jupiter in the 3rd House, your growth comes through communication, learning, and connection with your immediate environment. You may indicate a gift for inspiring others through words and finding joy in the exchange of ideas. This placement invites reflection on deepening your knowledge as broadly as you explore it.",
    4: "With Jupiter in the 4th House, your growth and abundance are connected to home, family, and emotional foundations. You may indicate a natural ability to create warm, supportive environments where everyone feels welcome and cared for. This placement invites reflection on expanding your emotional world while maintaining healthy boundaries.",
    5: "With Jupiter in the 5th House, your growth comes through creativity, romance, and joyful self-expression. You may indicate a magnetic presence that attracts abundance when you shine authentically and share your gifts generously. This placement invites reflection on using your natural magnetism to inspire joy and creativity in others.",
    6: "With Jupiter in the 6th House, your growth is connected to service, daily routines, and physical well-being. You may indicate a fortunate ability to find abundance in meaningful work and acts of care. This placement invites reflection on celebrating progress and finding spiritual growth in the dignity of everyday service.",
    7: "With Jupiter in the 7th House, your growth comes through partnership, relationships, and the pursuit of balanced, harmonious connections. You may indicate a natural grace that attracts fortunate partnerships and creates mutual abundance. This placement invites reflection on pursuing justice and fairness as paths to your own growth.",
    8: "With Jupiter in the 8th House, your growth is transformative, deep, and connected to the hidden dimensions of life. You may indicate a powerful ability to attract resources through emotional honesty and fearless self-examination. This placement invites reflection on sharing your transformative insights to help others heal and grow.",
    9: "With Jupiter in the 9th House, your growth comes through adventure, philosophy, and the expansion of your worldview. You may indicate extraordinary luck through travel, education, and the pursuit of higher wisdom. This placement invites reflection on grounding your expansive vision in practical action to create lasting impact.",
    10: "With Jupiter in the 10th House, your growth and abundance are connected to career achievement, public recognition, and long-term goals. You may indicate a fortunate ability to build lasting success through patience, hard work, and unwavering commitment. This placement invites reflection on balancing ambition with generosity and lifting others as you climb.",
    11: "With Jupiter in the 11th House, your growth comes through community, friendship, and humanitarian efforts. You may indicate a lucky streak when you embrace your uniqueness and contribute to collective progress. This placement invites reflection on connecting your visionary ideas with grounded action to create meaningful social change.",
    12: "With Jupiter in the 12th House, your growth is spiritual, intuitive, and connected to universal compassion. You may indicate a profound connection to spiritual abundance that flows through acts of kindness and creative expression. This placement invites reflection on trusting your inner wisdom as your most reliable guide to growth and fulfillment.",
  },

  Saturn: {
    1: "With Saturn in the 1st House, your lessons center on developing self-confidence, personal responsibility, and a strong sense of identity. You may indicate a mature, disciplined nature that builds character through patience and perseverance. This placement invites reflection on embracing your leadership potential even when it feels uncomfortable or burdensome.",
    2: "With Saturn in the 2nd House, your lessons revolve around building financial stability, self-worth, and the responsible use of resources. You may indicate a cautious, practical approach to material security that learns through careful management. This placement invites reflection on trusting your ability to create abundance through patient, sustained effort.",
    3: "With Saturn in the 3rd House, your lessons center on communication, learning, and the disciplined use of your mind. You may indicate a thoughtful, careful communicator who develops intellectual confidence through practice and study. This placement invites reflection on sharing your ideas with conviction even when self-doubt makes vulnerability feel risky.",
    4: "With Saturn in the 4th House, your lessons revolve around emotional security, family responsibility, and the building of solid inner foundations. You may indicate a serious, protective nature that creates stability through dedication to home and loved ones. This placement invites reflection on creating the emotional home you seek through both inner work and external action.",
    5: "With Saturn in the 5th House, your lessons center on creative discipline, authentic self-expression, and the mature expression of love. You may indicate a serious approach to creativity that develops mastery through dedicated practice. This placement invites reflection on sharing your creative gifts with the world even when perfectionism holds you back.",
    6: "With Saturn in the 6th House, your lessons revolve around healthy work habits, service, and the responsible care of your body and daily routines. You may indicate a diligent, health-conscious nature that learns through attention to detail and consistent effort. This placement invites reflection on finding fulfillment in service without losing yourself in the pursuit of perfection.",
    7: "With Saturn in the 7th House, your lessons center on mature partnership, commitment, and the responsible expression of love. You may indicate a serious approach to relationships that learns through commitment and the challenges of long-term bonding. This placement invites reflection on building partnerships that honor both your needs and your partner's with equal respect.",
    8: "With Saturn in the 8th House, your lessons revolve around emotional depth, transformation, and the responsible use of personal power. You may indicate a serious, transformative nature that learns through confronting life's deeper truths. This placement invites reflection on channeling your intensity into healing and regeneration rather than control.",
    9: "With Saturn in the 9th House, your lessons center on building a personal philosophy, developing faith, and the disciplined pursuit of wisdom. You may indicate a serious, philosophical nature that develops beliefs through experience and study. This placement invites reflection on creating a worldview that can withstand life's inevitable challenges.",
    10: "With Saturn in the 10th House, your lessons revolve around career achievement, public responsibility, and the development of your life direction. You may indicate a highly ambitious, responsible nature that builds lasting success through patience and hard work. This placement invites reflection on softening your relentless standards to include joy and self-care along your path to achievement.",
    11: "With Saturn in the 11th House, your lessons center on friendship, community responsibility, and the balanced use of your social gifts. You may indicate a serious approach to social connections that develops through long-term commitment to causes and communities. This placement invites reflection on building meaningful friendships that support both your individual goals and collective progress.",
    12: "With Saturn in the 12th House, your lessons revolve around spiritual discipline, emotional boundaries, and the practical expression of compassion. You may indicate a deeply spiritual nature that develops through solitude, meditation, and acts of selfless service. This placement invites reflection on building a spiritual practice that sustains you through life's challenges while protecting your sensitive nature.",
  },

  Uranus: {
    1: "With Uranus in the 1st House, your sense of self is marked by originality, independence, and a pioneering spirit. You may indicate a revolutionary individual who challenges conventions and inspires others to embrace their uniqueness. This placement invites reflection on channeling your innovative energy into constructive change that benefits both yourself and your community.",
    2: "With Uranus in the 2nd House, your relationship with resources and values is marked by sudden changes and innovative approaches. You may indicate a need to rethink your relationship with material security and find freedom in simplicity. This placement invites reflection on finding stability that embraces change rather than resisting it.",
    3: "With Uranus in the 3rd House, your communication and thinking patterns are marked by originality, innovation, and unconventional approaches. You may indicate a gift for breakthrough ideas and revolutionary ways of sharing information. This placement invites reflection on using your innovative thinking to inspire progressive change in how ideas are communicated and understood.",
    4: "With Uranus in the 4th House, your home and family life are marked by sudden changes, independence, and unconventional foundations. You may indicate a need to create emotional security on your own terms, free from inherited patterns. This placement invites reflection on building new forms of belonging that honor both your need for stability and your drive for freedom.",
    5: "With Uranus in the 5th House, your creative expression and romantic life are marked by originality, independence, and sudden inspiration. You may indicate a unique, unconventional approach to love and self-expression that inspires others. This placement invites reflection on sharing your creative innovations freely while maintaining authentic connections.",
    6: "With Uranus in the 6th House, your daily routines, work, and health practices are marked by innovation and a need for flexibility. You may indicate a gift for finding efficient, unconventional solutions to everyday problems. This placement invites reflection on creating daily structures that support both your need for freedom and your commitment to meaningful service.",
    7: "With Uranus in the 7th House, your partnerships and close relationships are marked by independence, unconventional dynamics, and a need for freedom. You may indicate a tendency to attract or seek partners who challenge your expectations and inspire growth. This placement invites reflection on building relationships that honor both your need for connection and your need for autonomy.",
    8: "With Uranus in the 8th House, your experience of transformation, intimacy, and shared resources is marked by sudden insight and unconventional approaches. You may indicate a powerful ability to channel sudden breakthroughs into profound personal growth. This placement invites reflection on embracing transformative change as a natural and necessary part of your evolution.",
    9: "With Uranus in the 9th House, your philosophy, beliefs, and approach to learning are marked by innovation and a hunger for truth. You may indicate a gift for challenging limiting beliefs and inspiring broader perspectives through your unconventional wisdom. This placement invites reflection on sharing your visionary ideas in ways that empower others to think freely and independently.",
    10: "With Uranus in the 10th House, your career and public image are marked by innovation, independence, and unconventional success. You may indicate a need to build a career path that reflects your unique vision and values. This placement invites reflection on creating professional structures that honor both your need for stability and your drive for revolutionary change.",
    11: "With Uranus in the 11th House, your friendships, community involvement, and humanitarian ideals are marked by innovation and a progressive spirit. You may indicate a gift for inspiring collective change and connecting with like-minded visionaries. This placement invites reflection on channeling your innovative energy into sustainable social impact.",
    12: "With Uranus in the 12th House, your spiritual life and inner world are marked by sudden insight, unconventional wisdom, and a connection to universal consciousness. You may indicate a gift for channeling transcendent visions into healing work and creative expression. This placement invites reflection on grounding your spiritual breakthroughs in practical reality to serve others effectively.",
  },

  Neptune: {
    1: "With Neptune in the 1st House, your identity and self-expression are infused with spiritual sensitivity, compassion, and artistic inspiration. You may indicate a dreamy, empathetic presence that dissolves boundaries and inspires transcendence. This placement invites reflection on grounding your spiritual visions in practical action while honoring your deep connection to universal compassion.",
    2: "With Neptune in the 2nd House, your relationship with resources and values is marked by spiritual idealism and a desire for transcendent beauty. You may indicate a tendency to idealize material possessions or to find spiritual meaning in simplicity. This placement invites reflection on distinguishing between healthy spiritual materialism and genuine transcendence.",
    3: "With Neptune in the 3rd House, your communication and thinking are infused with intuition, imagination, and spiritual insight. You may indicate a gift for inspiring others through words that touch the soul and for finding spiritual meaning in everyday conversations. This placement invites reflection on clarifying your thoughts through writing or structured communication to share your inner visions effectively.",
    4: "With Neptune in the 4th House, your home and emotional life are deeply connected to spiritual sensitivity and universal compassion. You may indicate a profound need for a peaceful, spiritually nourishing home environment. This placement invites reflection on creating emotional security that honors both your deep sensitivity and your need for practical grounding.",
    5: "With Neptune in the 5th House, your creative expression and romantic life are infused with spiritual inspiration and boundless imagination. You may indicate a gift for channeling divine inspiration into art, music, or performance that moves others deeply. This placement invites reflection on sharing your creative gifts with discernment, maintaining boundaries while allowing your spiritual beauty to shine.",
    6: "With Neptune in the 6th House, your daily work, service, and health practices are marked by spiritual sensitivity and compassionate dedication. You may indicate a gift for healing work, selfless service, and finding the sacred in everyday routines. This placement invites reflection on protecting your energy while maintaining your beautiful commitment to serving others.",
    7: "With Neptune in the 7th House, your partnerships and close relationships are infused with spiritual idealism, deep compassion, and a longing for transcendent love. You may indicate a tendency to idealize partners or to seek soul-deep connection in your closest bonds. This placement invites reflection on accepting the imperfections of human relationships while still honoring your spiritual ideals for love.",
    8: "With Neptune in the 8th House, your experience of transformation, intimacy, and shared resources is deeply spiritual, intuitive, and permeable. You may indicate a powerful ability to sense the unspoken and navigate the unseen dimensions of the psyche. This placement invites reflection on channeling your transformative gifts into healing work while maintaining healthy emotional boundaries.",
    9: "With Neptune in the 9th House, your philosophy, beliefs, and approach to learning are infused with spiritual vision and universal compassion. You may indicate a gift for finding spiritual truth in diverse cultures and for inspiring others through your expansive worldview. This placement invites reflection on grounding your spiritual vision in practical reality to create meaningful, lasting impact.",
    10: "With Neptune in the 10th House, your career and public life are marked by spiritual sensitivity, artistic vision, and a desire to serve the greater good. You may indicate a need for your professional life to feel meaningful and aligned with your spiritual values. This placement invites reflection on building a career path that honors both your creative gifts and your commitment to compassionate service.",
    11: "With Neptune in the 11th House, your friendships, community involvement, and humanitarian ideals are deeply infused with spiritual compassion and universal love. You may indicate a gift for inspiring collective healing and connecting with like-minded spiritual seekers. This placement invites reflection on channeling your spiritual ideals into practical community action that creates real-world positive change.",
    12: "With Neptune in the 12th House, your spiritual life, intuition, and connection to universal consciousness are profoundly deep and naturally expressed. You may indicate a gifted spiritual channel, healer, or artist whose work transcends personal experience to touch the collective soul. This placement invites reflection on grounding your transcendent experiences in practical reality to serve others effectively while protecting your sensitive nature.",
  },

  Pluto: {
    1: "With Pluto in the 1st House, your identity and self-expression are marked by intensity, transformation, and a powerful drive for authenticity. You may indicate a magnetic, compelling presence that undergoes profound personal metamorphosis throughout life. This placement invites reflection on channeling your transformative power toward creation and healing rather than control.",
    2: "With Pluto in the 2nd House, your relationship with resources, values, and self-worth is marked by deep transformation and the need to rebuild from the ground up. You may indicate a powerful process of redefining what truly matters to you beyond conventional definitions of security. This placement invites reflection on releasing attachment to what no longer serves your highest good.",
    3: "With Pluto in the 3rd House, your communication, thinking, and intellectual expression are marked by depth, intensity, and investigative power. You may indicate a gift for uncovering hidden truths and sharing insights that challenge conventional thinking at its core. This placement invites reflection on using your investigative nature to illuminate rather than manipulate.",
    4: "With Pluto in the 4th House, your home, family, and emotional foundations are marked by profound transformation and the healing of deep inherited patterns. You may indicate a powerful process of emotional rebirth that transforms your relationship with belonging and security. This placement invites reflection on honoring your roots while transforming painful family patterns into sources of strength and wisdom.",
    5: "With Pluto in the 5th House, your creative expression, romance, and relationship with joy are marked by intensity, depth, and transformative passion. You may indicate a powerful creative force that channels deep emotional truths into art, performance, or romantic connection. This placement invites reflection on sharing your creative power with others while maintaining healthy emotional boundaries.",
    6: "With Pluto in the 6th House, your daily work, health, and service are marked by transformative dedication and the need for deep, meaningful contribution. You may indicate a powerful process of refining your approach to wellness and purposeful work. This placement invites reflection on embracing the transformative power of everyday service as a path to genuine healing and growth.",
    7: "With Pluto in the 7th House, your partnerships and close relationships are marked by intensity, transformation, and the need for deep, authentic connection. You may indicate a powerful dynamic in your closest bonds that demands honesty, vulnerability, and mutual transformation. This placement invites reflection on creating partnerships that honor both individual power and the transformative potential of genuine intimacy.",
    8: "With Pluto in the 8th House, your experience of transformation, intimacy, and shared resources is profoundly deep, intense, and naturally powerful. You may indicate a gifted transformer whose work with the hidden dimensions of life creates profound healing for yourself and others. This placement invites reflection on wielding your transformative power with wisdom, compassion, and discernment.",
    9: "With Pluto in the 9th House, your philosophy, beliefs, and approach to truth are marked by deep transformation and the need for authentic spiritual evolution. You may indicate a powerful process of rebuilding your belief systems from the ground up, often through challenging experiences that demand growth. This placement invites reflection on sharing your transformative wisdom to help others evolve their understanding of the world.",
    10: "With Pluto in the 10th House, your career, public image, and life direction are marked by transformative ambition and the need for deep, meaningful impact. You may indicate a powerful drive to reform structures and create lasting change through your professional work. This placement invites reflection on building a career path that honors both your ambition and your commitment to using power responsibly.",
    11: "With Pluto in the 11th House, your friendships, community involvement, and humanitarian ideals are marked by transformative power and the need for authentic collective change. You may indicate a powerful ability to catalyze social transformation and inspire others to embrace deep, meaningful reform. This placement invites reflection on channeling your revolutionary energy into sustainable movements that create lasting positive change.",
    12: "With Pluto in the 12th House, your spiritual life, intuition, and connection to the unconscious are profoundly deep, transformative, and naturally connected to universal healing. You may indicate a gifted spiritual healer or transformer whose work with the collective unconscious creates profound healing on a global scale. This placement invites reflection on channeling your transcendent gifts with discernment and compassion to serve the greatest good.",
  },

  "North Node": {
    1: "With your North Node in the 1st House, your life path calls you toward developing independence, personal identity, and courageous self-assertion. You may indicate a journey of learning to trust your instincts, take the lead, and pursue your own desires with confidence. This placement invites reflection on balancing your need for independence with healthy, interdependent relationships.",
    2: "With your North Node in the 2nd House, your life path invites you toward building stability, developing self-sufficiency, and appreciating life's simple pleasures. You may indicate a journey of learning to create lasting security, trust your senses, and find contentment in the present moment. This placement invites reflection on cultivating inner security that transcends material circumstances.",
    3: "With your North Node in the 3rd House, your life path calls you toward learning, communication, and the joyful exchange of ideas. You may indicate a journey of developing your voice, staying curious, and connecting with diverse perspectives. This placement invites reflection on deepening your knowledge as broadly as you explore it for more meaningful intellectual engagement.",
    4: "With your North Node in the 4th House, your life path invites you toward emotional depth, nurturing relationships, and the creation of a loving home. You may indicate a journey of honoring your feelings, caring for yourself and others, and building emotional security from within. This placement invites reflection on trusting your emotional wisdom as a reliable guide through life.",
    5: "With your North Node in the 5th House, your life path calls you toward creative self-expression, authentic leadership, and joyful self-representation. You may indicate a journey of learning to shine your unique light, embrace your creativity, and lead with heart. This placement invites reflection on sharing your gifts generously while remaining humble and open-hearted.",
    6: "With your North Node in the 6th House, your life path invites you toward service, practical improvement, and the refinement of your skills. You may indicate a journey of contributing meaningfully through attention to detail, continuous learning, and acts of care. This placement invites reflection on finding fulfillment in the quiet dignity of everyday service.",
    7: "With your North Node in the 7th House, your life path calls you toward partnership, harmony, and the pursuit of beauty and balance in all relationships. You may indicate a journey of developing your relational skills, seeking fairness, and creating peace wherever you go. This placement invites reflection on honoring your own needs alongside your deep desire for connection.",
    8: "With your North Node in the 8th House, your life path invites you toward emotional depth, transformation, and the responsible use of personal power. You may indicate a journey of confronting your deepest fears, embracing vulnerability, and undergoing profound personal transformation. This placement invites reflection on trusting the process of death and rebirth as a path to genuine empowerment.",
    9: "With your North Node in the 9th House, your life path calls you toward adventure, wisdom, and the expansion of your philosophical horizons. You may indicate a journey of trusting your optimism, exploring new territories, and sharing your wisdom generously. This placement invites reflection on grounding your expansive vision in practical action that creates lasting impact.",
    10: "With your North Node in the 10th House, your life path invites you toward discipline, ambition, and the building of lasting structures. You may indicate a journey of taking responsibility, working patiently toward long-term goals, and developing your leadership abilities. This placement invites reflection on balancing ambition with self-care and recognizing that true success includes lifting others up.",
    11: "With your North Node in the 11th House, your life path calls you toward innovation, independence, and service to the collective. You may indicate a journey of embracing your uniqueness, championing progressive causes, and contributing to community progress. This placement invites reflection on finding belonging through authentic self-expression and service to something greater than yourself.",
    12: "With your North Node in the 12th House, your life path invites you toward spiritual growth, compassion, and the dissolution of rigid boundaries. You may indicate a journey of trusting your intuition, embracing empathy, and connecting with universal consciousness. This placement invites reflection on grounding your spiritual gifts in practical reality to serve others effectively.",
  },

  Chiron: {
    1: "With Chiron in the 1st House, your core wound and greatest healing gift center on identity, self-assertion, and the courage to be yourself. You may indicate a deep journey of learning to take up space, trust your instincts, and embrace your authentic self as a source of healing for the world. This placement invites reflection on recognizing that your vulnerability is precisely what makes you a powerful healer.",
    2: "With Chiron in the 2nd House, your core wound and greatest healing gift center on self-worth, security, and the ability to feel at peace in your body and the material world. You may indicate a journey of learning to trust your senses, value yourself beyond material possessions, and find contentment in the present moment. This placement invites reflection on recognizing that your inherent worth is never in question.",
    3: "With Chiron in the 3rd House, your core wound and greatest healing gift center on communication, learning, and the ability to express your thoughts clearly. You may indicate a journey of learning to trust your voice, share your ideas with confidence, and find healing through intellectual connection. This placement invites reflection on recognizing that your words have the power to heal and transform.",
    4: "With Chiron in the 4th House, your core wound and greatest healing gift center on emotional security, belonging, and the ability to nurture yourself and others. You may indicate a journey of learning to create emotional safety, trust your feelings, and build a sense of home from within. This placement invites reflection on recognizing that you are worthy of the same love and care you so generously give to others.",
    5: "With Chiron in the 5th House, your core wound and greatest healing gift center on creative expression, self-worth, and the courage to shine. You may indicate a journey of learning to embrace your creativity, share your unique gifts, and find joy without seeking external validation. This placement invites reflection on recognizing that your creative light is needed in the world.",
    6: "With Chiron in the 6th House, your core wound and greatest healing gift center on perfectionism, self-criticism, and the ability to feel good enough. You may indicate a journey of learning to embrace imperfection, find meaning in service, and practice self-compassion alongside your dedication to improvement. This placement invites reflection on recognizing that your worth is inherent and not dependent on productivity.",
    7: "With Chiron in the 7th House, your core wound and greatest healing gift center on relationships, partnership, and the ability to feel worthy of balanced love. You may indicate a journey of learning to honor your own needs in relationships, develop healthy boundaries, and create partnerships based on mutual respect. This placement invites reflection on recognizing that you deserve the same love and care you offer to others.",
    8: "With Chiron in the 8th House, your core wound and greatest healing gift center on intimacy, trust, and the ability to be vulnerable with others. You may indicate a journey of learning to let go of control, embrace emotional honesty, and find healing through genuine connection. This placement invites reflection on recognizing that true power comes from surrendering to transformation rather than resisting it.",
    9: "With Chiron in the 9th House, your core wound and greatest healing gift center on faith, belief, and the ability to trust in something greater than yourself. You may indicate a journey of learning to rebuild your faith, expand your perspective, and find meaning through experience and study. This placement invites reflection on recognizing that your journey of doubt and discovery is itself a source of wisdom for others.",
    10: "With Chiron in the 10th House, your core wound and greatest healing gift center on authority, ambition, and the ability to trust your own path. You may indicate a journey of learning to claim your authority, build your own structures, and pursue your ambitions without seeking external approval. This placement invites reflection on recognizing that your ambition, guided by integrity, is a force for positive change.",
    11: "With Chiron in the 11th House, your core wound and greatest healing gift center on belonging, community, and the ability to feel accepted for who you truly are. You may indicate a journey of learning to embrace your uniqueness, find your tribe, and contribute your gifts to collective progress. This placement invites reflection on recognizing that your unconventional nature is precisely what the world needs.",
    12: "With Chiron in the 12th House, your core wound and greatest healing gift center on spiritual connection, boundaries, and the ability to navigate the unseen dimensions of life. You may indicate a journey of learning to protect your sensitivity, trust your intuition, and channel your spiritual gifts into healing work. This placement invites reflection on recognizing that your spiritual gifts, grounded in practice, can heal both yourself and the world.",
  },
};

// ---------------------------------------------------------------------------
// Aspect interpretations
// ---------------------------------------------------------------------------
const ASPECTS: Record<string, Record<string, string>> = {
  conjunction: {
    "Sun-Moon":
      "Your Sun-Moon conjunction suggests a powerful alignment between your core identity and emotional nature. You may indicate a person whose inner feelings and outer expression are deeply integrated, creating a strong sense of self. This aspect invites reflection on harnessing this natural alignment for focused, authentic action.",
    "Sun-Mercury":
      "Your Sun-Mercury conjunction suggests a natural alignment between your identity and your communication style. You may indicate a person whose thoughts and self-expression are closely connected, allowing for clear, confident articulation of ideas. This aspect invites reflection on using your communicative gifts to inspire and lead others.",
    "Sun-Venus":
      "Your Sun-Venus conjunction suggests a harmonious blend of your core identity with your values and capacity for love. You may indicate a naturally charming, aesthetically attuned person who attracts beauty and affection into their life. This aspect invites reflection on sharing your warmth and generosity while maintaining authentic self-expression.",
    "Sun-Mars":
      "Your Sun-Mars conjunction suggests a powerful fusion of your identity with drive, energy, and assertiveness. You may indicate a person of great courage and determination whose actions are closely aligned with their core sense of self. This aspect invites reflection on channeling your dynamic energy into constructive pursuits that benefit both yourself and others.",
    "Sun-Jupiter":
      "Your Sun-Jupiter conjunction suggests an expansive, optimistic alignment between your identity and your capacity for growth. You may indicate a naturally generous, philosophical person who attracts abundance and inspires others with your enthusiasm. This aspect invites reflection on using your abundant energy to uplift others while remaining grounded in humility.",
    "Sun-Saturn":
      "Your Sun-Saturn conjunction suggests a serious, disciplined alignment between your identity and your sense of responsibility. You may indicate a person of great determination and maturity who builds lasting structures through patience and hard work. This aspect invites reflection on balancing your relentless standards with moments of self-care and joy.",
    "Sun-Uranus":
      "Your Sun-Uranus conjunction suggests a revolutionary alignment between your identity and your drive for independence and innovation. You may indicate a person of original thought and sudden breakthroughs whose unique nature challenges conventions. This aspect invites reflection on channeling your innovative energy into constructive change that benefits both yourself and your community.",
    "Sun-Neptune":
      "Your Sun-Neptune conjunction suggests a spiritually infused alignment between your identity and your connection to universal compassion. You may indicate a person of great sensitivity and artistic inspiration whose life is guided by spiritual vision. This aspect invites reflection on grounding your transcendent gifts in practical action to serve others effectively.",
    "Sun-Pluto":
      "Your Sun-Pluto conjunction suggests a deeply transformative alignment between your identity and your power to regenerate and heal. You may indicate a person of intense depth and magnetic presence whose life is marked by profound personal metamorphosis. This aspect invites reflection on channeling your transformative power toward creation and healing rather than control.",
    "Moon-Mercury":
      "Your Moon-Mercury conjunction suggests a natural alignment between your emotional nature and your communication style. You may indicate a person who processes feelings through words and finds comfort in expressing emotions verbally. This aspect invites reflection on using your emotional intelligence to create meaningful, healing conversations.",
    "Moon-Venus":
      "Your Moon-Venus conjunction suggests a harmonious blend of your emotional nature with your capacity for love and beauty. You may indicate a naturally warm, affectionate person who creates beauty and comfort in their relationships. This aspect invites reflection on nurturing your own emotional needs alongside your deep desire to care for others.",
    "Moon-Mars":
      "Your Moon-Mars conjunction suggests a passionate fusion of your emotional nature with drive and assertiveness. You may indicate a person whose feelings are expressed with intensity and whose protective instincts are strongly activated. This aspect invites reflection on channeling your emotional energy into constructive action while maintaining healthy boundaries.",
    "Moon-Jupiter":
      "Your Moon-Jupiter conjunction suggests an expansive, optimistic alignment between your emotional nature and your capacity for growth. You may indicate a person of great emotional generosity and philosophical depth whose feelings are guided by faith and abundance. This aspect invites reflection on sharing your emotional warmth while maintaining realistic expectations.",
    "Moon-Saturn":
      "Your Moon-Saturn conjunction suggests a serious, disciplined alignment between your emotional nature and your sense of responsibility. You may indicate a person who processes feelings carefully and builds emotional security through patience and structure. This aspect invites reflection on softening your emotional boundaries to allow deeper connection and vulnerability.",
    "Moon-Uranus":
      "Your Moon-Uranus conjunction suggests a revolutionary alignment between your emotional nature and your need for independence and innovation. You may indicate a person whose feelings are unpredictable and whose emotional life is marked by sudden changes and breakthroughs. This aspect invites reflection on finding emotional stability amidst your natural need for freedom and change.",
    "Moon-Neptune":
      "Your Moon-Neptune conjunction suggests a spiritually infused alignment between your emotional nature and your connection to universal compassion. You may indicate a person of profound sensitivity and intuitive depth whose feelings transcend personal experience. This aspect invites reflection on protecting your emotional energy while honoring your deep connection to spiritual truth.",
    "Moon-Pluto":
      "Your Moon-Pluto conjunction suggests a deeply transformative alignment between your emotional nature and your power to heal and regenerate. You may indicate a person of intense emotional depth and perceptive ability whose feelings undergo profound transformation. This aspect invites reflection on trusting the process of emotional death and rebirth as a path to genuine empowerment.",
    "Mercury-Venus":
      "Your Mercury-Venus conjunction suggests a harmonious blend of your communication style with your values and capacity for love. You may indicate a person who expresses affection through words and finds beauty in intellectual exchange. This aspect invites reflection on using your verbal gifts to create connections that are both intellectually stimulating and emotionally fulfilling.",
    "Mercury-Mars":
      "Your Mercury-Mars conjunction suggests a passionate fusion of your communication style with drive and assertiveness. You may indicate a person who debates with energy and expresses ideas with confidence and conviction. This aspect invites reflection on using your communicative energy to inspire and uplift rather than dominate conversations.",
    "Mercury-Jupiter":
      "Your Mercury-Jupiter conjunction suggests an expansive, optimistic alignment between your communication style and your capacity for growth. You may indicate a person of broad intellectual horizons and philosophical depth who inspires others through words. This aspect invites reflection on grounding your expansive thinking in practical details for more effective communication.",
    "Mercury-Saturn":
      "Your Mercury-Saturn conjunction suggests a serious, disciplined alignment between your communication style and your sense of responsibility. You may indicate a person who communicates with precision, authority, and careful consideration. This aspect invites reflection on allowing creative and unconventional thoughts to flourish alongside your disciplined thinking.",
    "Mercury-Uranus":
      "Your Mercury-Uranus conjunction suggests a revolutionary alignment between your communication style and your drive for innovation. You may indicate a person of original thought and breakthrough ideas whose words challenge conventional thinking. This aspect invites reflection on sharing your innovative ideas in accessible ways that inspire progressive change.",
    "Mercury-Neptune":
      "Your Mercury-Neptune conjunction suggests a spiritually infused alignment between your communication style and your connection to universal compassion. You may indicate a person of deep intuition and artistic expression whose words carry spiritual insight. This aspect invites reflection on clarifying your transcendent visions through structured communication to share them effectively.",
    "Mercury-Pluto":
      "Your Mercury-Pluto conjunction suggests a deeply transformative alignment between your communication style and your investigative power. You may indicate a person whose words carry penetrating insight and whose thinking uncovers hidden truths. This aspect invites reflection on sharing your profound insights with gentleness and discernment.",
    "Venus-Mars":
      "Your Venus-Mars conjunction suggests a passionate fusion of your love nature with your drive and assertiveness. You may indicate a person of great romantic and creative energy who pursues love and beauty with courage and enthusiasm. This aspect invites reflection on channeling your passionate energy into relationships and creative projects that create lasting, meaningful connections.",
    "Venus-Jupiter":
      "Your Venus-Jupiter conjunction suggests an expansive, optimistic alignment between your love nature and your capacity for growth. You may indicate a person of great generosity and romantic warmth who attracts abundance in relationships and material pleasures. This aspect invites reflection on sharing your abundant love while maintaining discernment in your choices.",
    "Venus-Saturn":
      "Your Venus-Saturn conjunction suggests a serious, disciplined alignment between your love nature and your sense of responsibility. You may indicate a person who builds lasting relationships through commitment, patience, and devotion. This aspect invites reflection on opening your heart more freely and allowing vulnerability to deepen your connections.",
    "Venus-Uranus":
      "Your Venus-Uranus conjunction suggests a revolutionary alignment between your love nature and your need for independence and innovation. You may indicate a person attracted to unconventional relationships and sudden romantic changes. This aspect invites reflection on building relationships that honor both your need for freedom and your desire for deep connection.",
    "Venus-Neptune":
      "Your Venus-Neptune conjunction suggests a spiritually infused alignment between your love nature and your connection to universal compassion. You may indicate a person of profound romantic idealism and boundless devotion whose love transcends personal experience. This aspect invites reflection on maintaining healthy boundaries while honoring your beautiful capacity for unconditional love.",
    "Venus-Pluto":
      "Your Venus-Pluto conjunction suggests a deeply transformative alignment between your love nature and your power to heal and regenerate. You may indicate a person of intense romantic depth and magnetic charm whose relationships undergo profound transformation. This aspect invites reflection on trusting love without seeking to control the object of your affection.",
    "Mars-Jupiter":
      "Your Mars-Jupiter conjunction suggests an expansive, optimistic alignment between your drive and your capacity for growth. You may indicate a person of great energy and enthusiasm whose actions are guided by faith and philosophical vision. This aspect invites reflection on channeling your boundless energy into meaningful, long-term projects that create lasting impact.",
    "Mars-Saturn":
      "Your Mars-Saturn conjunction suggests a powerful fusion of your drive with discipline, responsibility, and strategic planning. You may indicate a person of great determination and patience who achieves goals through sustained, disciplined effort. This aspect invites reflection on balancing your relentless ambition with moments of rest and self-care.",
    "Mars-Uranus":
      "Your Mars-Uranus conjunction suggests a revolutionary alignment between your drive and your need for independence and innovation. You may indicate a person of sudden, explosive energy whose actions break through obstacles with originality and courage. This aspect invites reflection on channeling your rebellious energy into constructive change that benefits both yourself and your community.",
    "Mars-Neptune":
      "Your Mars-Neptune conjunction suggests a spiritually infused alignment between your drive and your connection to universal compassion. You may indicate a person of gentle but persistent energy whose actions are guided by spiritual vision and empathy. This aspect invites reflection on asserting your boundaries while staying connected to your compassionate, spiritually guided nature.",
    "Mars-Pluto":
      "Your Mars-Pluto conjunction suggests a deeply transformative alignment between your drive and your power to regenerate and heal. You may indicate a person of intense determination and transformative energy whose actions create profound change. This aspect invites reflection on channeling your transformative power toward healing and regeneration rather than control.",
    "Jupiter-Saturn":
      "Your Jupiter-Saturn conjunction suggests a powerful balance between expansion and discipline, optimism and realism. You may indicate a person who builds lasting success through a combination of vision and practical effort. This aspect invites reflection on honoring both your expansive dreams and your need for structured, patient action.",
    "Jupiter-Uranus":
      "Your Jupiter-Uranus conjunction suggests a revolutionary alignment between your capacity for growth and your drive for independence and innovation. You may indicate a person of sudden breakthroughs and expansive originality whose ideas challenge conventional thinking. This aspect invites reflection on channeling your innovative vision into practical action that creates meaningful, lasting change.",
    "Jupiter-Neptune":
      "Your Jupiter-Neptune conjunction suggests a spiritually infused alignment between your capacity for growth and your connection to universal compassion. You may indicate a person of profound faith and spiritual vision whose generosity extends to all beings. This aspect invites reflection on grounding your transcendent faith in practical action to serve others effectively.",
    "Jupiter-Pluto":
      "Your Jupiter-Pluto conjunction suggests a deeply transformative alignment between your capacity for growth and your power to regenerate and heal. You may indicate a person of great transformative power and philosophical depth whose growth benefits from confronting life's deeper truths. This aspect invites reflection on sharing your transformative wisdom to help others evolve and grow.",
    "Saturn-Uranus":
      "Your Saturn-Uranus conjunction suggests a powerful tension between discipline and innovation, structure and freedom. You may indicate a person who builds revolutionary structures and challenges conventions through patient, strategic effort. This aspect invites reflection on finding balance between honoring tradition and embracing necessary change.",
    "Saturn-Neptune":
      "Your Saturn-Neptune conjunction suggests a serious, spiritually infused alignment between your sense of responsibility and your connection to universal compassion. You may indicate a person who grounds spiritual vision in practical, disciplined action. This aspect invites reflection on building structures that serve the greater good while maintaining spiritual integrity.",
    "Saturn-Pluto":
      "Your Saturn-Pluto conjunction suggests a deeply transformative alignment between your sense of responsibility and your power to regenerate and heal. You may indicate a person of great transformative power and disciplined ambition whose work creates lasting structural change. This aspect invites reflection on wielding your power with wisdom, patience, and compassion.",
    "Uranus-Neptune":
      "Your Uranus-Neptune conjunction suggests a revolutionary, spiritually infused alignment between your drive for innovation and your connection to universal consciousness. You may indicate a person of visionary originality and transcendent wisdom whose ideas inspire collective awakening. This aspect invites reflection on channeling your revolutionary spiritual vision into practical action that benefits all beings.",
    "Uranus-Pluto":
      "Your Uranus-Pluto conjunction suggests a deeply transformative, revolutionary alignment between your drive for independence and your power to regenerate and heal. You may indicate a person of intense transformative power and original vision whose actions create profound, lasting change. This aspect invites reflection on channeling your revolutionary energy toward creation and healing rather than destruction.",
    "Neptune-Pluto":
      "Your Neptune-Pluto conjunction suggests a profoundly transformative, spiritually infused alignment between your connection to universal compassion and your power to regenerate and heal. You may indicate a person of deep spiritual transformation and collective healing whose work transcends personal experience. This aspect invites reflection on channeling your transcendent gifts with discernment and compassion to serve the greatest good.",
  },

  opposition: {
    "Sun-Moon":
      "Your Sun-Moon opposition suggests a dynamic tension between your core identity and your emotional needs. You may indicate a person who experiences a push-pull between outer expression and inner feelings, creating opportunities for growth through integration. This aspect invites reflection on finding balance between who you are and what you feel.",
    "Sun-Mercury":
      "Your Sun-Mercury opposition suggests a tension between your identity and your communication style. You may indicate a person who sometimes struggles to align thoughts with self-expression, creating opportunities for more conscious communication. This aspect invites reflection on ensuring your words authentically represent who you truly are.",
    "Sun-Venus":
      "Your Sun-Venus opposition suggests a dynamic tension between your core identity and your values and capacity for love. You may indicate a person who experiences challenges in balancing self-expression with the needs of relationships. This aspect invites reflection on finding harmony between honoring your own needs and caring for others.",
    "Sun-Mars":
      "Your Sun-Mars opposition suggests a powerful tension between your identity and your drive and assertiveness. You may indicate a person who sometimes experiences conflict between who they are and how they act, creating opportunities for more conscious self-expression. This aspect invites reflection on aligning your actions with your authentic self.",
    "Sun-Jupiter":
      "Your Sun-Jupiter opposition suggests a dynamic tension between your core identity and your capacity for growth. You may indicate a person who experiences a push-pull between self-focus and expansive optimism, creating opportunities for balanced growth. This aspect invites reflection on sharing your abundance while staying grounded in your authentic identity.",
    "Sun-Saturn":
      "Your Sun-Saturn opposition suggests a serious tension between your identity and your sense of responsibility. You may indicate a person who experiences challenges in balancing self-expression with duty and discipline, creating opportunities for mature growth. This aspect invites reflection on embracing both your light and your shadow with equal compassion.",
    "Sun-Uranus":
      "Your Sun-Uranus opposition suggests a revolutionary tension between your identity and your need for independence. You may indicate a person who experiences sudden breakthroughs in self-understanding through unexpected changes. This aspect invites reflection on embracing your uniqueness while maintaining stable, authentic self-expression.",
    "Sun-Neptune":
      "Your Sun-Neptune opposition suggests a spiritually infused tension between your identity and your connection to universal compassion. You may indicate a person who experiences challenges in maintaining clear boundaries between self and other, creating opportunities for spiritual growth. This aspect invites reflection on honoring your sensitivity while staying grounded in practical reality.",
    "Sun-Pluto":
      "Your Sun-Pluto opposition suggests a deeply transformative tension between your identity and your power to regenerate and heal. You may indicate a person who experiences profound personal metamorphosis through confrontation with power dynamics and shadow material. This aspect invites reflection on channeling your transformative power toward creation and healing rather than control.",
    "Moon-Mercury":
      "Your Moon-Mercury opposition suggests a tension between your emotional nature and your communication style. You may indicate a person who sometimes struggles to articulate feelings, creating opportunities for more emotionally intelligent communication. This aspect invites reflection on aligning your words with your emotional truth.",
    "Moon-Venus":
      "Your Moon-Venus opposition suggests a dynamic tension between your emotional needs and your values and capacity for love. You may indicate a person who experiences challenges in balancing emotional security with romantic desires, creating opportunities for relational growth. This aspect invites reflection on honoring both your feelings and your need for harmony in relationships.",
    "Moon-Mars":
      "Your Moon-Mars opposition suggests a powerful tension between your emotional nature and your drive and assertiveness. You may indicate a person who experiences emotional intensity and defensive reactions, creating opportunities for more conscious emotional expression. This aspect invites reflection on channeling your emotional energy into constructive action.",
    "Moon-Jupiter":
      "Your Moon-Jupiter opposition suggests a dynamic tension between your emotional nature and your capacity for growth. You may indicate a person who experiences a push-pull between emotional sensitivity and expansive optimism, creating opportunities for emotional maturation. This aspect invites reflection on finding emotional balance between sensitivity and faith.",
    "Moon-Saturn":
      "Your Moon-Saturn opposition suggests a serious tension between your emotional nature and your sense of responsibility. You may indicate a person who experiences emotional restraint and the need for structured feelings, creating opportunities for emotional maturity. This aspect invites reflection on softening your emotional boundaries while maintaining healthy responsibility.",
    "Moon-Uranus":
      "Your Moon-Uranus opposition suggests a revolutionary tension between your emotional nature and your need for independence. You may indicate a person who experiences sudden emotional changes and breakthroughs, creating opportunities for emotional freedom. This aspect invites reflection on finding emotional stability amidst your natural need for change and innovation.",
    "Moon-Neptune":
      "Your Moon-Neptune opposition suggests a spiritually infused tension between your emotional nature and your connection to universal compassion. You may indicate a person who experiences emotional overwhelm and boundary confusion, creating opportunities for spiritual growth. This aspect invites reflection on protecting your emotional energy while honoring your deep sensitivity.",
    "Moon-Pluto":
      "Your Moon-Pluto opposition suggests a deeply transformative tension between your emotional nature and your power to regenerate and heal. You may indicate a person who experiences intense emotional purging and transformation, creating opportunities for profound healing. This aspect invites reflection on trusting the process of emotional death and rebirth as a path to genuine empowerment.",
    "Mercury-Venus":
      "Your Mercury-Venus opposition suggests a tension between your communication style and your values and capacity for love. You may indicate a person who sometimes struggles to align thoughts with feelings in relationships, creating opportunities for more integrated expression. This aspect invites reflection on creating communication that honors both logic and emotion.",
    "Mercury-Mars":
      "Your Mercury-Mars opposition suggests a powerful tension between your communication style and your drive and assertiveness. You may indicate a person who debates with intensity and sometimes speaks before thinking, creating opportunities for more conscious communication. This aspect invites reflection on channeling your communicative energy into inspiring rather than dominating conversations.",
    "Mercury-Jupiter":
      "Your Mercury-Jupiter opposition suggests a dynamic tension between your communication style and your capacity for growth. You may indicate a person who sometimes struggles to balance detailed thinking with expansive vision, creating opportunities for more integrated intellectual expression. This aspect invites reflection on grounding your big ideas in practical, actionable communication.",
    "Mercury-Saturn":
      "Your Mercury-Saturn opposition suggests a serious tension between your communication style and your sense of responsibility. You may indicate a person who experiences mental discipline and careful thinking, creating opportunities for authoritative communication. This aspect invites reflection on allowing creative thoughts to flourish alongside your disciplined thinking.",
    "Mercury-Uranus":
      "Your Mercury-Uranus opposition suggests a revolutionary tension between your communication style and your drive for innovation. You may indicate a person who experiences sudden mental breakthroughs and original insights, creating opportunities for progressive communication. This aspect invites reflection on sharing your innovative ideas in accessible ways that inspire others.",
    "Mercury-Neptune":
      "Your Mercury-Neptune opposition suggests a spiritually infused tension between your communication style and your connection to universal compassion. You may indicate a person who experiences intuitive communication and artistic expression, creating opportunities for spiritual dialogue. This aspect invites reflection on clarifying your transcendent visions through structured communication.",
    "Mercury-Pluto":
      "Your Mercury-Pluto opposition suggests a deeply transformative tension between your communication style and your investigative power. You may indicate a person who uncovers hidden truths and communicates with penetrating insight, creating opportunities for transformative dialogue. This aspect invites reflection on sharing your profound insights with gentleness and discernment.",
    "Venus-Mars":
      "Your Venus-Mars opposition suggests a powerful tension between your love nature and your drive and assertiveness. You may indicate a person who experiences passionate romantic dynamics and creative tension, creating opportunities for deeper self-understanding. This aspect invites reflection on channeling your passionate energy into relationships that honor both love and independence.",
    "Venus-Jupiter":
      "Your Venus-Jupiter opposition suggests a dynamic tension between your love nature and your capacity for growth. You may indicate a person who experiences challenges in balancing romantic desires with expansive vision, creating opportunities for relational growth. This aspect invites reflection on sharing your abundant love while maintaining discernment in your choices.",
    "Venus-Saturn":
      "Your Venus-Saturn opposition suggests a serious tension between your love nature and your sense of responsibility. You may indicate a person who experiences challenges in balancing romantic desires with duty and commitment, creating opportunities for mature love. This aspect invites reflection on building lasting relationships that honor both love and responsibility.",
    "Venus-Uranus":
      "Your Venus-Uranus opposition suggests a revolutionary tension between your love nature and your need for independence. You may indicate a person who experiences sudden romantic changes and unconventional attractions, creating opportunities for freedom in love. This aspect invites reflection on building relationships that honor both your need for connection and your need for autonomy.",
    "Venus-Neptune":
      "Your Venus-Neptune opposition suggests a spiritually infused tension between your love nature and your connection to universal compassion. You may indicate a person who idealizes love and experiences spiritual romantic longing, creating opportunities for transcendent connection. This aspect invites reflection on maintaining healthy boundaries while honoring your beautiful capacity for unconditional love.",
    "Venus-Pluto":
      "Your Venus-Pluto opposition suggests a deeply transformative tension between your love nature and your power to regenerate and heal. You may indicate a person who experiences intense romantic dynamics and profound transformation through love, creating opportunities for soul-deep healing. This aspect invites reflection on trusting love without seeking to control the object of your affection.",
    "Mars-Jupiter":
      "Your Mars-Jupiter opposition suggests a dynamic tension between your drive and your capacity for growth. You may indicate a person who experiences challenges in balancing ambition with wisdom, creating opportunities for purposeful action. This aspect invites reflection on channeling your boundless energy into meaningful, long-term projects that create lasting impact.",
    "Mars-Saturn":
      "Your Mars-Saturn opposition suggests a powerful tension between your drive and your sense of responsibility. You may indicate a person who experiences internal conflict between action and caution, creating opportunities for disciplined growth. This aspect invites reflection on finding balance between your desire for achievement and your need for patient, structured effort.",
    "Mars-Uranus":
      "Your Mars-Uranus opposition suggests a revolutionary tension between your drive and your need for independence. You may indicate a person who experiences sudden bursts of energy and breakthrough action, creating opportunities for innovative achievement. This aspect invites reflection on channeling your rebellious energy into constructive change that benefits both yourself and your community.",
    "Mars-Neptune":
      "Your Mars-Neptune opposition suggests a spiritually infused tension between your drive and your connection to universal compassion. You may indicate a person who experiences challenges in aligning action with spiritual vision, creating opportunities for compassionate service. This aspect invites reflection on asserting your boundaries while staying connected to your spiritually guided nature.",
    "Mars-Pluto":
      "Your Mars-Pluto opposition suggests a deeply transformative tension between your drive and your power to regenerate and heal. You may indicate a person who experiences intense power dynamics and transformative action, creating opportunities for profound personal growth. This aspect invites reflection on channeling your transformative power toward healing and regeneration rather than control.",
    "Jupiter-Saturn":
      "Your Jupiter-Saturn opposition suggests a dynamic tension between expansion and discipline, optimism and realism. You may indicate a person who experiences challenges in balancing vision with practical effort, creating opportunities for grounded growth. This aspect invites reflection on honoring both your expansive dreams and your need for structured, patient action.",
    "Jupiter-Uranus":
      "Your Jupiter-Uranus opposition suggests a revolutionary tension between your capacity for growth and your drive for independence. You may indicate a person who experiences sudden breakthroughs in understanding and expansive originality, creating opportunities for innovative growth. This aspect invites reflection on channeling your visionary ideas into practical action that creates meaningful change.",
    "Jupiter-Neptune":
      "Your Jupiter-Neptune opposition suggests a spiritually infused tension between your capacity for growth and your connection to universal compassion. You may indicate a person who experiences challenges in grounding spiritual vision in practical action, creating opportunities for spiritual maturation. This aspect invites reflection on balancing your expansive faith with realistic, compassionate service.",
    "Jupiter-Pluto":
      "Your Jupiter-Pluto opposition suggests a deeply transformative tension between your capacity for growth and your power to regenerate and heal. You may indicate a person who experiences profound philosophical transformation through confronting life's deeper truths, creating opportunities for evolutionary growth. This aspect invites reflection on sharing your transformative wisdom to help others evolve.",
    "Saturn-Uranus":
      "Your Saturn-Uranus opposition suggests a powerful tension between discipline and innovation, structure and freedom. You may indicate a person who experiences challenges in balancing tradition with progress, creating opportunities for revolutionary structure-building. This aspect invites reflection on finding balance between honoring what works and embracing necessary change.",
    "Saturn-Neptune":
      "Your Saturn-Neptune opposition suggests a serious, spiritually infused tension between your sense of responsibility and your connection to universal compassion. You may indicate a person who experiences challenges in grounding spiritual vision in practical reality, creating opportunities for spiritual discipline. This aspect invites reflection on building structures that serve the greater good while maintaining spiritual integrity.",
    "Saturn-Pluto":
      "Your Saturn-Pluto opposition suggests a deeply transformative tension between your sense of responsibility and your power to regenerate and heal. You may indicate a person who experiences profound structural transformation through confronting power dynamics, creating opportunities for lasting change. This aspect invites reflection on wielding your power with wisdom, patience, and compassion.",
    "Uranus-Neptune":
      "Your Uranus-Neptune opposition suggests a revolutionary, spiritually infused tension between your drive for innovation and your connection to universal consciousness. You may indicate a person who experiences challenges in grounding visionary ideas in practical reality, creating opportunities for spiritual innovation. This aspect invites reflection on channeling your transcendent vision into action that benefits all beings.",
    "Uranus-Pluto":
      "Your Uranus-Pluto opposition suggests a deeply transformative, revolutionary tension between your drive for independence and your power to regenerate and heal. You may indicate a person who experiences intense power dynamics and revolutionary change, creating opportunities for profound transformation. This aspect invites reflection on channeling your revolutionary energy toward creation and healing rather than destruction.",
    "Neptune-Pluto":
      "Your Neptune-Pluto opposition suggests a profoundly transformative, spiritually infused tension between your connection to universal compassion and your power to regenerate and heal. You may indicate a person who experiences deep spiritual transformation and collective healing, creating opportunities for transcendent service. This aspect invites reflection on channeling your transcendent gifts with discernment and compassion to serve the greatest good.",
  },

  trine: {
    "Sun-Moon":
      "Your Sun-Moon trine suggests a harmonious flow between your core identity and your emotional nature. You may indicate a person whose inner feelings and outer expression work together gracefully, creating a strong sense of self and emotional ease. This aspect invites reflection on using this natural alignment to pursue your goals with confidence and emotional intelligence.",
    "Sun-Mercury":
      "Your Sun-Mercury trine suggests a natural harmony between your identity and your communication style. You may indicate a person whose thoughts and self-expression flow effortlessly, allowing for clear, confident articulation of ideas. This aspect invites reflection on using your communicative gifts to inspire and lead others with ease.",
    "Sun-Venus":
      "Your Sun-Venus trine suggests a harmonious blend of your core identity with your values and capacity for love. You may indicate a naturally charming, aesthetically attuned person who attracts beauty and affection into their life with grace. This aspect invites reflection on sharing your warmth and generosity while maintaining authentic self-expression.",
    "Sun-Mars":
      "Your Sun-Mars trine suggests a harmonious fusion of your identity with drive, energy, and assertiveness. You may indicate a person of natural courage and determination whose actions align easily with their core sense of self. This aspect invites reflection on channeling your dynamic energy into constructive pursuits that benefit both yourself and others.",
    "Sun-Jupiter":
      "Your Sun-Jupiter trine suggests an expansive, optimistic harmony between your identity and your capacity for growth. You may indicate a naturally generous, philosophical person who attracts abundance and inspires others with your enthusiasm. This aspect invites reflection on using your abundant energy to uplift others while remaining grounded in humility.",
    "Sun-Saturn":
      "Your Sun-Saturn trine suggests a balanced harmony between your identity and your sense of responsibility. You may indicate a person of natural discipline and maturity who builds lasting structures through patient effort. This aspect invites reflection on celebrating your accomplishments while continuing to grow with grace and self-compassion.",
    "Sun-Uranus":
      "Your Sun-Uranus trine suggests a harmonious alignment between your identity and your drive for independence and innovation. You may indicate a person of original thought and sudden breakthroughs whose unique nature is accepted and celebrated. This aspect invites reflection on embracing your uniqueness as a gift that naturally benefits those around you.",
    "Sun-Neptune":
      "Your Sun-Neptune trine suggests a spiritually infused harmony between your identity and your connection to universal compassion. You may indicate a person of great sensitivity and artistic inspiration whose life is guided by spiritual vision with ease. This aspect invites reflection on sharing your transcendent gifts with the world gracefully and generously.",
    "Sun-Pluto":
      "Your Sun-Pluto trine suggests a harmonious alignment between your identity and your power to regenerate and heal. You may indicate a person of deep transformation and magnetic presence whose growth comes naturally through life's challenges. This aspect invites reflection on using your transformative power for healing and positive change with confidence and grace.",
    "Moon-Mercury":
      "Your Moon-Mercury trine suggests a natural harmony between your emotional nature and your communication style. You may indicate a person who articulates feelings with ease and finds comfort in emotional expression through words. This aspect invites reflection on using your emotional intelligence to create meaningful, healing conversations that connect deeply with others.",
    "Moon-Venus":
      "Your Moon-Venus trine suggests a harmonious blend of your emotional nature with your values and capacity for love. You may indicate a naturally warm, affectionate person who creates beauty and comfort in their relationships with grace. This aspect invites reflection on nurturing your own emotional needs alongside your deep desire to care for others.",
    "Moon-Mars":
      "Your Moon-Mars trine suggests a harmonious fusion of your emotional nature with drive and assertiveness. You may indicate a person whose feelings are expressed with confident energy and whose protective instincts are naturally balanced. This aspect invites reflection on channeling your emotional energy into constructive action while maintaining healthy boundaries.",
    "Moon-Jupiter":
      "Your Moon-Jupiter trine suggests an expansive, optimistic harmony between your emotional nature and your capacity for growth. You may indicate a person of great emotional generosity and philosophical depth whose feelings are naturally guided by faith and abundance. This aspect invites reflection on sharing your emotional warmth while maintaining realistic expectations.",
    "Moon-Saturn":
      "Your Moon-Saturn trine suggests a balanced harmony between your emotional nature and your sense of responsibility. You may indicate a person who processes feelings with maturity and builds emotional security through patient, structured effort. This aspect invites reflection on celebrating your emotional resilience while continuing to open your heart to deeper connection.",
    "Moon-Uranus":
      "Your Moon-Uranus trine suggests a harmonious alignment between your emotional nature and your need for independence and innovation. You may indicate a person whose feelings are naturally original and whose emotional life is marked by positive, exciting changes. This aspect invites reflection on finding emotional stability that embraces your natural need for freedom and change.",
    "Moon-Neptune":
      "Your Moon-Neptune trine suggests a spiritually infused harmony between your emotional nature and your connection to universal compassion. You may indicate a person of profound sensitivity and intuitive depth whose feelings naturally transcend personal experience. This aspect invites reflection on sharing your spiritual sensitivity with the world in ways that heal and inspire.",
    "Moon-Pluto":
      "Your Moon-Pluto trine suggests a harmonious alignment between your emotional nature and your power to regenerate and heal. You may indicate a person of deep emotional transformation and perceptive ability whose feelings undergo natural, positive change. This aspect invites reflection on trusting the process of emotional transformation as a natural part of your growth.",
    "Mercury-Venus":
      "Your Mercury-Venus trine suggests a harmonious blend of your communication style with your values and capacity for love. You may indicate a person who expresses affection through words and finds beauty in intellectual exchange with ease. This aspect invites reflection on using your verbal gifts to create connections that are both intellectually stimulating and emotionally fulfilling.",
    "Mercury-Mars":
      "Your Mercury-Mars trine suggests a harmonious fusion of your communication style with drive and assertiveness. You may indicate a person who debates with energy and expresses ideas with natural confidence and conviction. This aspect invites reflection on using your communicative energy to inspire and uplift others with your natural verbal gifts.",
    "Mercury-Jupiter":
      "Your Mercury-Jupiter trine suggests an expansive, optimistic harmony between your communication style and your capacity for growth. You may indicate a person of broad intellectual horizons and philosophical depth who inspires others through words with ease. This aspect invites reflection on sharing your expansive thinking with others in ways that broaden their perspectives.",
    "Mercury-Saturn":
      "Your Mercury-Saturn trine suggests a balanced harmony between your communication style and your sense of responsibility. You may indicate a person who communicates with natural precision, authority, and careful consideration. This aspect invites reflection on celebrating your disciplined thinking while allowing creative thoughts to flourish alongside it.",
    "Mercury-Uranus":
      "Your Mercury-Uranus trine suggests a harmonious alignment between your communication style and your drive for innovation. You may indicate a person of original thought and breakthrough ideas whose words naturally challenge conventional thinking. This aspect invites reflection on sharing your innovative ideas in accessible ways that inspire progressive change with ease.",
    "Mercury-Neptune":
      "Your Mercury-Neptune trine suggests a spiritually infused harmony between your communication style and your connection to universal compassion. You may indicate a person of deep intuition and artistic expression whose words naturally carry spiritual insight. This aspect invites reflection on sharing your transcendent visions through communication that heals and inspires.",
    "Mercury-Pluto":
      "Your Mercury-Pluto trine suggests a harmonious alignment between your communication style and your investigative power. You may indicate a person whose words carry penetrating insight and whose thinking naturally uncovers hidden truths. This aspect invites reflection on sharing your profound insights with gentleness and discernment to help others understand deeply.",
    "Venus-Mars":
      "Your Venus-Mars trine suggests a harmonious fusion of your love nature with your drive and assertiveness. You may indicate a person of natural romantic and creative energy who pursues love and beauty with confident enthusiasm. This aspect invites reflection on channeling your passionate energy into relationships and creative projects that create lasting, meaningful connections.",
    "Venus-Jupiter":
      "Your Venus-Jupiter trine suggests an expansive, optimistic harmony between your love nature and your capacity for growth. You may indicate a person of natural generosity and romantic warmth who attracts abundance in relationships and material pleasures with ease. This aspect invites reflection on sharing your abundant love while maintaining discernment in your choices.",
    "Venus-Saturn":
      "Your Venus-Saturn trine suggests a balanced harmony between your love nature and your sense of responsibility. You may indicate a person who builds lasting relationships through natural commitment, patience, and devotion. This aspect invites reflection on celebrating the stability of your relationships while continuing to open your heart to deeper vulnerability.",
    "Venus-Uranus":
      "Your Venus-Uranus trine suggests a harmonious alignment between your love nature and your need for independence and innovation. You may indicate a person attracted to unconventional relationships and sudden romantic changes that feel liberating. This aspect invites reflection on building relationships that naturally honor both your need for freedom and your desire for deep connection.",
    "Venus-Neptune":
      "Your Venus-Neptune trine suggests a spiritually infused harmony between your love nature and your connection to universal compassion. You may indicate a person of profound romantic idealism and boundless devotion whose love naturally transcends personal experience. This aspect invites reflection on sharing your spiritual love with the world in ways that heal and inspire.",
    "Venus-Pluto":
      "Your Venus-Pluto trine suggests a harmonious alignment between your love nature and your power to regenerate and heal. You may indicate a person of deep romantic transformation and magnetic charm whose relationships naturally undergo positive change. This aspect invites reflection on trusting love as a natural force for healing and transformation in your life.",
    "Mars-Jupiter":
      "Your Mars-Jupiter trine suggests an expansive, optimistic harmony between your drive and your capacity for growth. You may indicate a person of natural energy and enthusiasm whose actions are naturally guided by faith and philosophical vision. This aspect invites reflection on channeling your boundless energy into meaningful, long-term projects that create lasting impact.",
    "Mars-Saturn":
      "Your Mars-Saturn trine suggests a harmonious balance between your drive and your sense of responsibility. You may indicate a person of natural determination and patience who achieves goals through sustained, disciplined effort with ease. This aspect invites reflection on celebrating your accomplishments while continuing to pursue your ambitions with grace and self-care.",
    "Mars-Uranus":
      "Your Mars-Uranus trine suggests a harmonious alignment between your drive and your need for independence and innovation. You may indicate a person of natural breakthrough energy whose actions easily break through obstacles with originality and courage. This aspect invites reflection on channeling your innovative energy into constructive change that benefits both yourself and your community.",
    "Mars-Neptune":
      "Your Mars-Neptune trine suggests a spiritually infused harmony between your drive and your connection to universal compassion. You may indicate a person of gentle but persistent energy whose actions are naturally guided by spiritual vision and empathy. This aspect invites reflection on using your compassionate drive to serve others in ways that are both effective and spiritually fulfilling.",
    "Mars-Pluto":
      "Your Mars-Pluto trine suggests a harmonious alignment between your drive and your power to regenerate and heal. You may indicate a person of natural transformative power and determination whose actions create positive, lasting change. This aspect invites reflection on channeling your transformative energy toward healing and regeneration with confidence and grace.",
    "Jupiter-Saturn":
      "Your Jupiter-Saturn trine suggests a harmonious balance between expansion and discipline, optimism and realism. You may indicate a person who naturally builds lasting success through a combination of vision and practical effort. This aspect invites reflection on celebrating your balanced approach to growth while continuing to expand your horizons with grounded action.",
    "Jupiter-Uranus":
      "Your Jupiter-Uranus trine suggests a harmonious alignment between your capacity for growth and your drive for independence and innovation. You may indicate a person of natural breakthrough energy and expansive originality whose ideas easily inspire progressive change. This aspect invites reflection on channeling your visionary ideas into practical action that creates meaningful, lasting impact.",
    "Jupiter-Neptune":
      "Your Jupiter-Neptune trine suggests a spiritually infused harmony between your capacity for growth and your connection to universal compassion. You may indicate a person of natural faith and spiritual vision whose generosity easily extends to all beings. This aspect invites reflection on sharing your transcendent faith with the world in ways that heal and inspire.",
    "Jupiter-Pluto":
      "Your Jupiter-Pluto trine suggests a harmonious alignment between your capacity for growth and your power to regenerate and heal. You may indicate a person of natural transformative power and philosophical depth whose growth naturally benefits from life's deeper experiences. This aspect invites reflection on sharing your transformative wisdom to help others evolve and grow with ease.",
    "Saturn-Uranus":
      "Your Saturn-Uranus trine suggests a harmonious balance between discipline and innovation, structure and freedom. You may indicate a person who naturally builds revolutionary structures and embraces necessary change through patient, strategic effort. This aspect invites reflection on celebrating your balanced approach to progress while continuing to innovate with grounded discipline.",
    "Saturn-Neptune":
      "Your Saturn-Neptune trine suggests a harmonious alignment between your sense of responsibility and your connection to universal compassion. You may indicate a person who naturally grounds spiritual vision in practical, disciplined action. This aspect invites reflection on celebrating your ability to serve the greater good while maintaining spiritual integrity in all you do.",
    "Saturn-Pluto":
      "Your Saturn-Pluto trine suggests a harmonious alignment between your sense of responsibility and your power to regenerate and heal. You may indicate a person of natural transformative power and disciplined ambition whose work creates positive, lasting structural change. This aspect invites reflection on celebrating your ability to wield power wisely and compassionately.",
    "Uranus-Neptune":
      "Your Uranus-Neptune trine suggests a harmonious, spiritually infused alignment between your drive for innovation and your connection to universal consciousness. You may indicate a person of natural visionary originality and transcendent wisdom whose ideas easily inspire collective awakening. This aspect invites reflection on sharing your revolutionary spiritual vision with the world in ways that heal and inspire.",
    "Uranus-Pluto":
      "Your Uranus-Pluto trine suggests a harmonious, transformative alignment between your drive for independence and your power to regenerate and heal. You may indicate a person of natural transformative power and original vision whose actions easily create positive, lasting change. This aspect invites reflection on channeling your revolutionary energy toward creation and healing with confidence and grace.",
    "Neptune-Pluto":
      "Your Neptune-Pluto trine suggests a profoundly transformative, spiritually infused alignment between your connection to universal compassion and your power to regenerate and heal. You may indicate a person of natural deep spiritual transformation and collective healing whose work easily transcends personal experience. This aspect invites reflection on sharing your transcendent gifts with discernment and compassion to serve the greatest good.",
  },

  square: {
    "Sun-Moon":
      "Your Sun-Moon square suggests a dynamic tension between your core identity and your emotional needs. You may indicate a person who experiences inner friction between outer expression and inner feelings, creating opportunities for growth through conscious integration. This aspect invites reflection on embracing both your light and your emotional depth as sources of strength.",
    "Sun-Mercury":
      "Your Sun-Mercury square suggests a challenge in aligning your identity with your communication style. You may indicate a person who sometimes struggles to express thoughts that feel authentic, creating opportunities for more conscious self-expression. This aspect invites reflection on developing your voice through practice and patience.",
    "Sun-Venus":
      "Your Sun-Venus square suggests a challenge in balancing your core identity with your values and capacity for love. You may indicate a person who sometimes experiences friction between self-expression and the needs of relationships. This aspect invites reflection on finding harmony between honoring your own needs and caring for others.",
    "Sun-Mars":
      "Your Sun-Mars square suggests a powerful challenge in aligning your identity with your drive and assertiveness. You may indicate a person who sometimes experiences conflict between who they are and how they act, creating opportunities for more conscious self-expression. This aspect invites reflection on channeling your dynamic energy into constructive pursuits.",
    "Sun-Jupiter":
      "Your Sun-Jupiter square suggests a challenge in balancing your core identity with your capacity for growth. You may indicate a person who sometimes struggles between self-focus and expansive optimism, creating opportunities for balanced growth. This aspect invites reflection on sharing your abundance while staying grounded in your authentic identity.",
    "Sun-Saturn":
      "Your Sun-Saturn square suggests a serious challenge between your identity and your sense of responsibility. You may indicate a person who sometimes experiences tension between self-expression and duty, creating opportunities for mature growth. This aspect invites reflection on embracing both your light and your shadow with equal compassion and patience.",
    "Sun-Uranus":
      "Your Sun-Uranus square suggests a revolutionary challenge between your identity and your need for independence. You may indicate a person who sometimes experiences sudden disruptions to self-understanding, creating opportunities for breakthrough growth. This aspect invites reflection on embracing your uniqueness while maintaining stable, authentic self-expression.",
    "Sun-Neptune":
      "Your Sun-Neptune square suggests a spiritually infused challenge between your identity and your connection to universal compassion. You may indicate a person who sometimes struggles to maintain clear boundaries between self and other, creating opportunities for spiritual growth. This aspect invites reflection on honoring your sensitivity while staying grounded in practical reality.",
    "Sun-Pluto":
      "Your Sun-Pluto square suggests a deeply transformative challenge between your identity and your power to regenerate and heal. You may indicate a person who sometimes experiences intense confrontation with power dynamics and shadow material, creating opportunities for profound growth. This aspect invites reflection on channeling your transformative power toward creation and healing rather than control.",
    "Moon-Mercury":
      "Your Moon-Mercury square suggests a challenge in aligning your emotional nature with your communication style. You may indicate a person who sometimes struggles to articulate feelings clearly, creating opportunities for more emotionally intelligent communication. This aspect invites reflection on developing your ability to express emotions through words with patience and practice.",
    "Moon-Venus":
      "Your Moon-Venus square suggests a challenge in balancing your emotional needs with your values and capacity for love. You may indicate a person who sometimes experiences friction between emotional security and romantic desires, creating opportunities for relational growth. This aspect invites reflection on honoring both your feelings and your need for harmony in relationships.",
    "Moon-Mars":
      "Your Moon-Mars square suggests a powerful challenge in aligning your emotional nature with your drive and assertiveness. You may indicate a person who sometimes experiences emotional reactivity and defensive reactions, creating opportunities for more conscious emotional expression. This aspect invites reflection on channeling your emotional energy into constructive action.",
    "Moon-Jupiter":
      "Your Moon-Jupiter square suggests a challenge in balancing your emotional nature with your capacity for growth. You may indicate a person who sometimes experiences a push-pull between emotional sensitivity and expansive optimism, creating opportunities for emotional maturation. This aspect invites reflection on finding emotional balance between sensitivity and faith.",
    "Moon-Saturn":
      "Your Moon-Saturn square suggests a serious challenge between your emotional nature and your sense of responsibility. You may indicate a person who sometimes experiences emotional restriction and the need for structured feelings, creating opportunities for emotional maturity. This aspect invites reflection on softening your emotional boundaries while maintaining healthy responsibility.",
    "Moon-Uranus":
      "Your Moon-Uranus square suggests a revolutionary challenge between your emotional nature and your need for independence. You may indicate a person who sometimes experiences sudden emotional disruptions, creating opportunities for emotional freedom. This aspect invites reflection on finding emotional stability amidst your natural need for change and innovation.",
    "Moon-Neptune":
      "Your Moon-Neptune square suggests a spiritually infused challenge between your emotional nature and your connection to universal compassion. You may indicate a person who sometimes experiences emotional overwhelm and boundary confusion, creating opportunities for spiritual growth. This aspect invites reflection on protecting your emotional energy while honoring your deep sensitivity.",
    "Moon-Pluto":
      "Your Moon-Pluto square suggests a deeply transformative challenge between your emotional nature and your power to regenerate and heal. You may indicate a person who sometimes experiences intense emotional purging and transformation, creating opportunities for profound healing. This aspect invites reflection on trusting the process of emotional death and rebirth as a path to genuine empowerment.",
    "Mercury-Venus":
      "Your Mercury-Venus square suggests a challenge in aligning your communication style with your values and capacity for love. You may indicate a person who sometimes struggles to match thoughts with feelings in relationships, creating opportunities for more integrated expression. This aspect invites reflection on developing communication that honors both logic and emotion.",
    "Mercury-Mars":
      "Your Mercury-Mars square suggests a powerful challenge in aligning your communication style with your drive and assertiveness. You may indicate a person who sometimes debates with intensity and speaks before thinking, creating opportunities for more conscious communication. This aspect invites reflection on channeling your communicative energy into inspiring rather than dominating conversations.",
    "Mercury-Jupiter":
      "Your Mercury-Jupiter square suggests a challenge in balancing your communication style with your capacity for growth. You may indicate a person who sometimes struggles to balance detailed thinking with expansive vision, creating opportunities for more integrated intellectual expression. This aspect invites reflection on grounding your big ideas in practical, actionable communication.",
    "Mercury-Saturn":
      "Your Mercury-Saturn square suggests a serious challenge between your communication style and your sense of responsibility. You may indicate a person who sometimes experiences mental blocks and careful thinking that delays expression, creating opportunities for disciplined communication. This aspect invites reflection on allowing creative thoughts to flourish alongside your disciplined thinking.",
    "Mercury-Uranus":
      "Your Mercury-Uranus square suggests a revolutionary challenge between your communication style and your drive for innovation. You may indicate a person who sometimes experiences mental restlessness and scattered thinking, creating opportunities for focused innovation. This aspect invites reflection on channeling your original ideas into focused, impactful communication.",
    "Mercury-Neptune":
      "Your Mercury-Neptune square suggests a spiritually infused challenge between your communication style and your connection to universal compassion. You may indicate a person who sometimes experiences confusion between thoughts and feelings, creating opportunities for intuitive clarity. This aspect invites reflection on clarifying your transcendent visions through structured communication.",
    "Mercury-Pluto":
      "Your Mercury-Pluto square suggests a deeply transformative challenge between your communication style and your investigative power. You may indicate a person who sometimes experiences intense mental pressure and the compulsion to uncover hidden truths, creating opportunities for transformative dialogue. This aspect invites reflection on sharing your profound insights with gentleness and discernment.",
    "Venus-Mars":
      "Your Venus-Mars square suggests a powerful challenge in aligning your love nature with your drive and assertiveness. You may indicate a person who sometimes experiences passionate romantic tension and creative friction, creating opportunities for deeper self-understanding. This aspect invites reflection on channeling your passionate energy into relationships that honor both love and independence.",
    "Venus-Jupiter":
      "Your Venus-Jupiter square suggests a challenge in balancing your love nature with your capacity for growth. You may indicate a person who sometimes struggles to balance romantic desires with expansive vision, creating opportunities for relational growth. This aspect invites reflection on sharing your abundant love while maintaining discernment in your choices.",
    "Venus-Saturn":
      "Your Venus-Saturn square suggests a serious challenge between your love nature and your sense of responsibility. You may indicate a person who sometimes experiences tension between romantic desires and duty, creating opportunities for mature love. This aspect invites reflection on building lasting relationships that honor both love and responsibility with patience.",
    "Venus-Uranus":
      "Your Venus-Uranus square suggests a revolutionary challenge between your love nature and your need for independence. You may indicate a person who sometimes experiences sudden romantic disruptions and unconventional attractions, creating opportunities for freedom in love. This aspect invites reflection on building relationships that honor both your need for connection and your need for autonomy.",
    "Venus-Neptune":
      "Your Venus-Neptune square suggests a spiritually infused challenge between your love nature and your connection to universal compassion. You may indicate a person who sometimes idealizes love and experiences spiritual romantic disappointment, creating opportunities for transcendent connection. This aspect invites reflection on maintaining healthy boundaries while honoring your beautiful capacity for unconditional love.",
    "Venus-Pluto":
      "Your Venus-Pluto square suggests a deeply transformative challenge between your love nature and your power to regenerate and heal. You may indicate a person who sometimes experiences intense romantic dynamics and possessive tendencies, creating opportunities for soul-deep healing. This aspect invites reflection on trusting love without seeking to control the object of your affection.",
    "Mars-Jupiter":
      "Your Mars-Jupiter square suggests a challenge in balancing your drive with your capacity for growth. You may indicate a person who sometimes experiences excess energy and overextension, creating opportunities for purposeful action. This aspect invites reflection on channeling your boundless energy into meaningful, long-term projects that create lasting impact.",
    "Mars-Saturn":
      "Your Mars-Saturn square suggests a powerful challenge between your drive and your sense of responsibility. You may indicate a person who sometimes experiences internal conflict between action and caution, creating opportunities for disciplined growth. This aspect invites reflection on finding balance between your desire for achievement and your need for patient, structured effort.",
    "Mars-Uranus":
      "Your Mars-Uranus square suggests a revolutionary challenge between your drive and your need for independence. You may indicate a person who sometimes experiences impulsive action and sudden disruptions, creating opportunities for innovative achievement. This aspect invites reflection on channeling your rebellious energy into constructive change that benefits both yourself and your community.",
    "Mars-Neptune":
      "Your Mars-Neptune square suggests a spiritually infused challenge between your drive and your connection to universal compassion. You may indicate a person who sometimes struggles to align action with spiritual vision, creating opportunities for compassionate service. This aspect invites reflection on asserting your boundaries while staying connected to your spiritually guided nature.",
    "Mars-Pluto":
      "Your Mars-Pluto square suggests a deeply transformative challenge between your drive and your power to regenerate and heal. You may indicate a person who sometimes experiences intense power struggles and controlling tendencies, creating opportunities for profound personal growth. This aspect invites reflection on channeling your transformative power toward healing and regeneration rather than control.",
    "Jupiter-Saturn":
      "Your Jupiter-Saturn square suggests a dynamic challenge between expansion and discipline, optimism and realism. You may indicate a person who sometimes experiences tension between vision and practical effort, creating opportunities for grounded growth. This aspect invites reflection on honoring both your expansive dreams and your need for structured, patient action.",
    "Jupiter-Uranus":
      "Your Jupiter-Uranus square suggests a revolutionary challenge between your capacity for growth and your drive for independence. You may indicate a person who sometimes experiences sudden disruptions to expansive plans, creating opportunities for innovative growth. This aspect invites reflection on channeling your visionary ideas into practical action that creates meaningful change.",
    "Jupiter-Neptune":
      "Your Jupiter-Neptune square suggests a spiritually infused challenge between your capacity for growth and your connection to universal compassion. You may indicate a person who sometimes struggles to ground spiritual vision in practical action, creating opportunities for spiritual maturation. This aspect invites reflection on balancing your expansive faith with realistic, compassionate service.",
    "Jupiter-Pluto":
      "Your Jupiter-Pluto square suggests a deeply transformative challenge between your capacity for growth and your power to regenerate and heal. You may indicate a person who sometimes experiences intense philosophical confrontation and transformative pressure, creating opportunities for evolutionary growth. This aspect invites reflection on sharing your transformative wisdom to help others evolve.",
    "Saturn-Uranus":
      "Your Saturn-Uranus square suggests a powerful challenge between discipline and innovation, structure and freedom. You may indicate a person who sometimes experiences tension between tradition and progress, creating opportunities for revolutionary structure-building. This aspect invites reflection on finding balance between honoring what works and embracing necessary change.",
    "Saturn-Neptune":
      "Your Saturn-Neptune square suggests a serious, spiritually infused challenge between your sense of responsibility and your connection to universal compassion. You may indicate a person who sometimes struggles to ground spiritual vision in practical reality, creating opportunities for spiritual discipline. This aspect invites reflection on building structures that serve the greater good while maintaining spiritual integrity.",
    "Saturn-Pluto":
      "Your Saturn-Pluto square suggests a deeply transformative challenge between your sense of responsibility and your power to regenerate and heal. You may indicate a person who sometimes experiences intense structural pressure and transformative confrontation, creating opportunities for lasting change. This aspect invites reflection on wielding your power with wisdom, patience, and compassion.",
    "Uranus-Neptune":
      "Your Uranus-Neptune square suggests a revolutionary, spiritually infused challenge between your drive for innovation and your connection to universal consciousness. You may indicate a person who sometimes experiences confusion between visionary ideas and practical reality, creating opportunities for spiritual innovation. This aspect invites reflection on channeling your transcendent vision into action that benefits all beings.",
    "Uranus-Pluto":
      "Your Uranus-Pluto square suggests a deeply transformative, revolutionary challenge between your drive for independence and your power to regenerate and heal. You may indicate a person who sometimes experiences intense power dynamics and revolutionary pressure, creating opportunities for profound transformation. This aspect invites reflection on channeling your revolutionary energy toward creation and healing rather than destruction.",
    "Neptune-Pluto":
      "Your Neptune-Pluto square suggests a profoundly transformative, spiritually infused challenge between your connection to universal compassion and your power to regenerate and heal. You may indicate a person who sometimes experiences deep spiritual confrontation and collective tension, creating opportunities for transcendent growth. This aspect invites reflection on channeling your transcendent gifts with discernment and compassion to serve the greatest good.",
  },

  sextile: {
    "Sun-Moon":
      "Your Sun-Moon sextile suggests a gentle, supportive flow between your core identity and your emotional nature. You may indicate a person whose inner feelings and outer expression naturally support each other, creating opportunities for easy integration. This aspect invites reflection on using this natural ease to pursue your goals with confidence and emotional intelligence.",
    "Sun-Mercury":
      "Your Sun-Mercury sextile suggests a supportive connection between your identity and your communication style. You may indicate a person whose thoughts and self-expression naturally complement each other, allowing for clear, confident articulation of ideas. This aspect invites reflection on using your communicative gifts to inspire and connect with others effortlessly.",
    "Sun-Venus":
      "Your Sun-Venus sextile suggests a gentle, supportive blend of your core identity with your values and capacity for love. You may indicate a naturally charming, aesthetically attuned person who attracts beauty and affection with ease. This aspect invites reflection on sharing your warmth and generosity while maintaining authentic self-expression.",
    "Sun-Mars":
      "Your Sun-Mars sextile suggests a supportive fusion of your identity with drive, energy, and assertiveness. You may indicate a person of natural courage and determination whose actions easily align with their core sense of self. This aspect invites reflection on channeling your dynamic energy into constructive pursuits that benefit both yourself and others.",
    "Sun-Jupiter":
      "Your Sun-Jupiter sextile suggests a gentle, expansive harmony between your identity and your capacity for growth. You may indicate a naturally generous, philosophical person who attracts abundance and inspires others with your enthusiasm. This aspect invites reflection on using your abundant energy to uplift others while remaining grounded in humility.",
    "Sun-Saturn":
      "Your Sun-Saturn sextile suggests a supportive, balanced connection between your identity and your sense of responsibility. You may indicate a person of natural discipline and maturity who builds lasting structures through patient effort with ease. This aspect invites reflection on celebrating your accomplishments while continuing to grow with grace and self-compassion.",
    "Sun-Uranus":
      "Your Sun-Uranus sextile suggests a gentle, supportive alignment between your identity and your drive for independence and innovation. You may indicate a person of original thought and sudden breakthroughs whose unique nature is naturally accepted and celebrated. This aspect invites reflection on embracing your uniqueness as a gift that naturally benefits those around you.",
    "Sun-Neptune":
      "Your Sun-Neptune sextile suggests a spiritually infused, supportive harmony between your identity and your connection to universal compassion. You may indicate a person of great sensitivity and artistic inspiration whose life is naturally guided by spiritual vision. This aspect invites reflection on sharing your transcendent gifts with the world gracefully and generously.",
    "Sun-Pluto":
      "Your Sun-Pluto sextile suggests a gentle, transformative connection between your identity and your power to regenerate and heal. You may indicate a person of deep transformation and magnetic presence whose growth comes naturally and easily through life's challenges. This aspect invites reflection on using your transformative power for healing and positive change with confidence and grace.",
    "Moon-Mercury":
      "Your Moon-Mercury sextile suggests a supportive connection between your emotional nature and your communication style. You may indicate a person who articulates feelings with ease and finds comfort in emotional expression through words. This aspect invites reflection on using your emotional intelligence to create meaningful, healing conversations that connect deeply with others.",
    "Moon-Venus":
      "Your Moon-Venus sextile suggests a gentle, supportive blend of your emotional nature with your values and capacity for love. You may indicate a naturally warm, affectionate person who creates beauty and comfort in their relationships with ease. This aspect invites reflection on nurturing your own emotional needs alongside your deep desire to care for others.",
    "Moon-Mars":
      "Your Moon-Mars sextile suggests a supportive fusion of your emotional nature with drive and assertiveness. You may indicate a person whose feelings are expressed with confident energy and whose protective instincts are naturally balanced. This aspect invites reflection on channeling your emotional energy into constructive action while maintaining healthy boundaries.",
    "Moon-Jupiter":
      "Your Moon-Jupiter sextile suggests a gentle, expansive harmony between your emotional nature and your capacity for growth. You may indicate a person of great emotional generosity and philosophical depth whose feelings are naturally guided by faith and abundance. This aspect invites reflection on sharing your emotional warmth while maintaining realistic expectations.",
    "Moon-Saturn":
      "Your Moon-Saturn sextile suggests a supportive, balanced connection between your emotional nature and your sense of responsibility. You may indicate a person who processes feelings with maturity and builds emotional security through patient, structured effort with ease. This aspect invites reflection on celebrating your emotional resilience while continuing to open your heart to deeper connection.",
    "Moon-Uranus":
      "Your Moon-Uranus sextile suggests a gentle, supportive alignment between your emotional nature and your need for independence and innovation. You may indicate a person whose feelings are naturally original and whose emotional life is marked by positive, exciting changes. This aspect invites reflection on finding emotional stability that embraces your natural need for freedom and change.",
    "Moon-Neptune":
      "Your Moon-Neptune sextile suggests a spiritually infused, supportive harmony between your emotional nature and your connection to universal compassion. You may indicate a person of profound sensitivity and intuitive depth whose feelings naturally transcend personal experience. This aspect invites reflection on sharing your spiritual sensitivity with the world in ways that heal and inspire.",
    "Moon-Pluto":
      "Your Moon-Pluto sextile suggests a gentle, transformative connection between your emotional nature and your power to regenerate and heal. You may indicate a person of deep emotional transformation and perceptive ability whose feelings undergo natural, positive change with ease. This aspect invites reflection on trusting the process of emotional transformation as a natural part of your growth.",
    "Mercury-Venus":
      "Your Mercury-Venus sextile suggests a supportive blend of your communication style with your values and capacity for love. You may indicate a person who expresses affection through words and finds beauty in intellectual exchange with ease. This aspect invites reflection on using your verbal gifts to create connections that are both intellectually stimulating and emotionally fulfilling.",
    "Mercury-Mars":
      "Your Mercury-Mars sextile suggests a supportive fusion of your communication style with drive and assertiveness. You may indicate a person who debates with energy and expresses ideas with natural confidence and conviction. This aspect invites reflection on using your communicative energy to inspire and uplift others with your natural verbal gifts.",
    "Mercury-Jupiter":
      "Your Mercury-Jupiter sextile suggests a gentle, expansive harmony between your communication style and your capacity for growth. You may indicate a person of broad intellectual horizons and philosophical depth who inspires others through words with ease. This aspect invites reflection on sharing your expansive thinking with others in ways that broaden their perspectives.",
    "Mercury-Saturn":
      "Your Mercury-Saturn sextile suggests a supportive, balanced connection between your communication style and your sense of responsibility. You may indicate a person who communicates with natural precision, authority, and careful consideration. This aspect invites reflection on celebrating your disciplined thinking while allowing creative thoughts to flourish alongside it.",
    "Mercury-Uranus":
      "Your Mercury-Uranus sextile suggests a gentle, supportive alignment between your communication style and your drive for innovation. You may indicate a person of original thought and breakthrough ideas whose words naturally challenge conventional thinking. This aspect invites reflection on sharing your innovative ideas in accessible ways that inspire progressive change with ease.",
    "Mercury-Neptune":
      "Your Mercury-Neptune sextile suggests a spiritually infused, supportive harmony between your communication style and your connection to universal compassion. You may indicate a person of deep intuition and artistic expression whose words naturally carry spiritual insight. This aspect invites reflection on sharing your transcendent visions through communication that heals and inspires.",
    "Mercury-Pluto":
      "Your Mercury-Pluto sextile suggests a gentle, transformative connection between your communication style and your investigative power. You may indicate a person whose words carry penetrating insight and whose thinking naturally uncovers hidden truths with ease. This aspect invites reflection on sharing your profound insights with gentleness and discernment to help others understand deeply.",
    "Venus-Mars":
      "Your Venus-Mars sextile suggests a supportive fusion of your love nature with your drive and assertiveness. You may indicate a person of natural romantic and creative energy who pursues love and beauty with confident enthusiasm. This aspect invites reflection on channeling your passionate energy into relationships and creative projects that create lasting, meaningful connections.",
    "Venus-Jupiter":
      "Your Venus-Jupiter sextile suggests a gentle, expansive harmony between your love nature and your capacity for growth. You may indicate a person of natural generosity and romantic warmth who attracts abundance in relationships and material pleasures with ease. This aspect invites reflection on sharing your abundant love while maintaining discernment in your choices.",
    "Venus-Saturn":
      "Your Venus-Saturn sextile suggests a supportive, balanced connection between your love nature and your sense of responsibility. You may indicate a person who builds lasting relationships through natural commitment, patience, and devotion with ease. This aspect invites reflection on celebrating the stability of your relationships while continuing to open your heart to deeper vulnerability.",
    "Venus-Uranus":
      "Your Venus-Uranus sextile suggests a gentle, supportive alignment between your love nature and your need for independence and innovation. You may indicate a person attracted to unconventional relationships and sudden romantic changes that feel liberating. This aspect invites reflection on building relationships that naturally honor both your need for freedom and your desire for deep connection.",
    "Venus-Neptune":
      "Your Venus-Neptune sextile suggests a spiritually infused, supportive harmony between your love nature and your connection to universal compassion. You may indicate a person of profound romantic idealism and boundless devotion whose love naturally transcends personal experience. This aspect invites reflection on sharing your spiritual love with the world in ways that heal and inspire.",
    "Venus-Pluto":
      "Your Venus-Pluto sextile suggests a gentle, transformative connection between your love nature and your power to regenerate and heal. You may indicate a person of deep romantic transformation and magnetic charm whose relationships naturally undergo positive change with ease. This aspect invites reflection on trusting love as a natural force for healing and transformation in your life.",
    "Mars-Jupiter":
      "Your Mars-Jupiter sextile suggests a gentle, expansive harmony between your drive and your capacity for growth. You may indicate a person of natural energy and enthusiasm whose actions are naturally guided by faith and philosophical vision. This aspect invites reflection on channeling your boundless energy into meaningful, long-term projects that create lasting impact.",
    "Mars-Saturn":
      "Your Mars-Saturn sextile suggests a supportive, balanced connection between your drive and your sense of responsibility. You may indicate a person of natural determination and patience who achieves goals through sustained, disciplined effort with ease. This aspect invites reflection on celebrating your accomplishments while continuing to pursue your ambitions with grace and self-care.",
    "Mars-Uranus":
      "Your Mars-Uranus sextile suggests a gentle, supportive alignment between your drive and your need for independence and innovation. You may indicate a person of natural breakthrough energy whose actions easily break through obstacles with originality and courage. This aspect invites reflection on channeling your innovative energy into constructive change that benefits both yourself and your community.",
    "Mars-Neptune":
      "Your Mars-Neptune sextile suggests a spiritually infused, supportive harmony between your drive and your connection to universal compassion. You may indicate a person of gentle but persistent energy whose actions are naturally guided by spiritual vision and empathy. This aspect invites reflection on using your compassionate drive to serve others in ways that are both effective and spiritually fulfilling.",
    "Mars-Pluto":
      "Your Mars-Pluto sextile suggests a gentle, transformative connection between your drive and your power to regenerate and heal. You may indicate a person of natural transformative power and determination whose actions create positive, lasting change with ease. This aspect invites reflection on channeling your transformative energy toward healing and regeneration with confidence and grace.",
    "Jupiter-Saturn":
      "Your Jupiter-Saturn sextile suggests a supportive, balanced connection between expansion and discipline, optimism and realism. You may indicate a person who naturally builds lasting success through a combination of vision and practical effort with ease. This aspect invites reflection on celebrating your balanced approach to growth while continuing to expand your horizons with grounded action.",
    "Jupiter-Uranus":
      "Your Jupiter-Uranus sextile suggests a gentle, supportive alignment between your capacity for growth and your drive for independence and innovation. You may indicate a person of natural breakthrough energy and expansive originality whose ideas easily inspire progressive change. This aspect invites reflection on channeling your visionary ideas into practical action that creates meaningful, lasting impact.",
    "Jupiter-Neptune":
      "Your Jupiter-Neptune sextile suggests a spiritually infused, supportive harmony between your capacity for growth and your connection to universal compassion. You may indicate a person of natural faith and spiritual vision whose generosity easily extends to all beings. This aspect invites reflection on sharing your transcendent faith with the world in ways that heal and inspire.",
    "Jupiter-Pluto":
      "Your Jupiter-Pluto sextile suggests a gentle, transformative connection between your capacity for growth and your power to regenerate and heal. You may indicate a person of natural transformative power and philosophical depth whose growth naturally benefits from life's deeper experiences with ease. This aspect invites reflection on sharing your transformative wisdom to help others evolve and grow effortlessly.",
    "Saturn-Uranus":
      "Your Saturn-Uranus sextile suggests a supportive, balanced connection between discipline and innovation, structure and freedom. You may indicate a person who naturally builds revolutionary structures and embraces necessary change through patient, strategic effort with ease. This aspect invites reflection on celebrating your balanced approach to progress while continuing to innovate with grounded discipline.",
    "Saturn-Neptune":
      "Your Saturn-Neptune sextile suggests a gentle, supportive alignment between your sense of responsibility and your connection to universal compassion. You may indicate a person who naturally grounds spiritual vision in practical, disciplined action with ease. This aspect invites reflection on celebrating your ability to serve the greater good while maintaining spiritual integrity in all you do.",
    "Saturn-Pluto":
      "Your Saturn-Pluto sextile suggests a gentle, transformative connection between your sense of responsibility and your power to regenerate and heal. You may indicate a person of natural transformative power and disciplined ambition whose work creates positive, lasting structural change with ease. This aspect invites reflection on celebrating your ability to wield power wisely and compassionately.",
    "Uranus-Neptune":
      "Your Uranus-Neptune sextile suggests a spiritually infused, supportive harmony between your drive for innovation and your connection to universal consciousness. You may indicate a person of natural visionary originality and transcendent wisdom whose ideas easily inspire collective awakening. This aspect invites reflection on sharing your revolutionary spiritual vision with the world in ways that heal and inspire.",
    "Uranus-Pluto":
      "Your Uranus-Pluto sextile suggests a gentle, transformative connection between your drive for independence and your power to regenerate and heal. You may indicate a person of natural transformative power and original vision whose actions easily create positive, lasting change with ease. This aspect invites reflection on channeling your revolutionary energy toward creation and healing with confidence and grace.",
    "Neptune-Pluto":
      "Your Neptune-Pluto sextile suggests a profoundly transformative, spiritually infused connection between your connection to universal compassion and your power to regenerate and heal. You may indicate a person of natural deep spiritual transformation and collective healing whose work easily transcends personal experience with ease. This aspect invites reflection on sharing your transcendent gifts with discernment and compassion to serve the greatest good.",
  },
};

// ---------------------------------------------------------------------------
// House in Sign interpretations
// ---------------------------------------------------------------------------
const HOUSE_SIGNS: Record<number, Record<string, string>> = {
  1: {
    Aries: "With Aries on your 1st House cusp, you present yourself as a bold, independent, and pioneering individual. Your identity is expressed through courage, initiative, and a natural leadership quality that others respond to instinctively. This placement invites reflection on how your assertive self-presentation shapes your interactions with the world.",
    Taurus: "With Taurus on your 1st House cusp, you present yourself as grounded, steady, and deeply connected to sensory experience. Your identity is expressed through reliability, patience, and a strong aesthetic sense that others find calming and trustworthy. This placement invites reflection on how your stable presence creates security in your relationships and environment.",
    Gemini: "With Gemini on your 1st House cusp, you present yourself as curious, communicative, and intellectually engaging. Your identity is expressed through versatility, wit, and a natural ability to connect with diverse people and ideas. This placement invites reflection on how your quick, mentally agile presence shapes others' perception of you.",
    Cancer: "With Cancer on your 1st House cusp, you present yourself as nurturing, protective, and deeply attuned to emotional currents. Your identity is expressed through care, sensitivity, and a strong connection to home and family that others find comforting. This placement invites reflection on how your emotional openness shapes your self-image and interactions.",
    Leo: "With Leo on your 1st House cusp, you present yourself as warm, confident, and naturally magnetic. Your identity is expressed through creativity, generosity, and a dramatic flair that draws attention and inspires others. This placement invites reflection on how your radiant presence influences those around you and shapes your experience of the world.",
    Virgo: "With Virgo on your 1st House cusp, you present yourself as analytical, detail-oriented, and service-minded. Your identity is expressed through precision, practicality, and a genuine desire to improve the world around you through careful attention and dedicated effort. This placement invites reflection on how your meticulous presence creates order and meaning in your life.",
    Libra: "With Libra on your 1st House cusp, you present yourself as diplomatic, charming, and deeply attuned to beauty and balance. Your identity is expressed through grace, fairness, and a natural ability to create harmony wherever you go. This placement invites reflection on how your relational grace shapes your self-image and connections with others.",
    Scorpio: "With Scorpio on your 1st House cusp, you present yourself as intense, perceptive, and deeply authentic. Your identity is expressed through depth, emotional honesty, and a powerful presence that others find compelling and transformative. This placement invites reflection on how your magnetic intensity shapes your experience of identity and connection.",
    Sagittarius: "With Sagittarius on your 1st House cusp, you present yourself as optimistic, adventurous, and philosophically minded. Your identity is expressed through enthusiasm, generosity, and a broad perspective that inspires others to think beyond their current limitations. This placement invites reflection on how your expansive presence shapes your experience of the world.",
    Capricorn: "With Capricorn on your 1st House cusp, you present yourself as ambitious, disciplined, and deeply responsible. Your identity is expressed through determination, maturity, and a strong sense of duty that others find reliable and trustworthy. This placement invites reflection on how your structured presence shapes your experience of identity and achievement.",
    Aquarius: "With Aquarius on your 1st House cusp, you present yourself as innovative, independent, and humanitarian in your outlook. Your identity is expressed through originality, progressive thinking, and a strong desire to contribute to collective progress and social change. This placement invites reflection on how your unconventional presence shapes your experience of self and community.",
    Pisces: "With Pisces on your 1st House cusp, you present yourself as intuitive, compassionate, and deeply spiritual. Your identity is expressed through sensitivity, imagination, and a natural connection to the unseen dimensions of life that others find healing and inspiring. This placement invites reflection on how your ethereal presence shapes your experience of identity and spiritual connection.",
  },
  2: {
    Aries: "With Aries on your 2nd House cusp, your approach to resources and values is pioneering, independent, and assertive. You may indicate a natural ability to attract material security through bold action and self-reliance. This placement invites reflection on building financial independence while remaining open to collaboration and shared resources.",
    Taurus: "With Taurus on your 2nd House cusp, your approach to resources and values is grounded, practical, and deeply connected to sensory pleasure. You may indicate a natural ability to build lasting material security through patience, persistence, and an appreciation for life's comforts. This placement invites reflection on finding balance between enjoying material pleasures and cultivating spiritual wealth.",
    Gemini: "With Gemini on your 2nd House cusp, your approach to resources and values is versatile, intellectual, and communicative. You may indicate a natural ability to attract resources through your communication skills, adaptability, and mental agility. This placement invites reflection on deepening your financial focus while honoring your natural curiosity and love of variety.",
    Cancer: "With Cancer on your 2nd House cusp, your approach to resources and values is nurturing, protective, and deeply connected to emotional security. You may indicate a natural ability to create material comfort through care, sensitivity, and a strong connection to home and family. This placement invites reflection on building emotional and financial security from within.",
    Leo: "With Leo on your 2nd House cusp, your approach to resources and values is generous, creative, and deeply connected to self-expression. You may indicate a natural ability to attract abundance through your creativity, charisma, and willingness to share your gifts generously with the world. This placement invites reflection on finding value beyond recognition and external validation.",
    Virgo: "With Virgo on your 2nd House cusp, your approach to resources and values is practical, analytical, and service-oriented. You may indicate a natural ability to manage resources carefully, finding value in efficiency, health, and meaningful contribution. This placement invites reflection on celebrating your resourcefulness while remaining open to abundance beyond practical concerns.",
    Libra: "With Libra on your 2nd House cusp, your approach to resources and values is balanced, aesthetic, and deeply relational. You may indicate a natural ability to attract resources through partnership, diplomacy, and an appreciation for beauty and harmony in all things. This placement invites reflection on finding value in both material and spiritual dimensions of life.",
    Scorpio: "With Scorpio on your 2nd House cusp, your approach to resources and values is intense, transformative, and deeply perceptive. You may indicate a natural ability to transform your relationship with resources through emotional honesty and fearless self-examination. This placement invites reflection on releasing attachment to what no longer serves your highest good.",
    Sagittarius: "With Sagittarius on your 2nd House cusp, your approach to resources and values is optimistic, expansive, and philosophically driven. You may indicate a natural ability to attract abundance through adventure, learning, and sharing your wisdom generously with the world. This placement invites reflection on grounding your expansive vision in practical resource management.",
    Capricorn: "With Capricorn on your 2nd House cusp, your approach to resources and values is disciplined, ambitious, and deeply structured. You may indicate a natural ability to build lasting material security through patience, hard work, and strategic planning. This placement invites reflection on balancing your ambition with generosity and self-care.",
    Aquarius: "With Aquarius on your 2nd House cusp, your approach to resources and values is innovative, unconventional, and community-oriented. You may indicate a natural ability to attract resources through progressive thinking, humanitarian efforts, and a commitment to collective progress. This placement invites reflection on finding value in both individual innovation and community contribution.",
    Pisces: "With Pisces on your 2nd House cusp, your approach to resources and values is intuitive, compassionate, and deeply spiritual. You may indicate a natural ability to attract resources through spiritual practice, creative expression, and acts of kindness and generosity. This placement invites reflection on grounding your spiritual gifts in practical resource management.",
  },
  3: {
    Aries: "With Aries on your 3rd House cusp, your communication style is direct, assertive, and pioneering. You may indicate a natural gift for initiating conversations, expressing ideas with confidence, and inspiring others through your bold intellectual engagement. This placement invites reflection on using your communicative energy to uplift and inspire rather than dominate.",
    Taurus: "With Taurus on your 3rd House cusp, your communication style is grounded, practical, and deeply connected to sensory experience. You may indicate a natural gift for expressing ideas with patience, reliability, and an appreciation for beauty in language and thought. This placement invites reflection on deepening your communication while maintaining your natural steadiness.",
    Gemini: "With Gemini on your 3rd House cusp, your communication style is versatile, curious, and intellectually agile. You may indicate a natural gift for connecting diverse ideas, engaging in lively conversation, and adapting your communication to any audience with ease. This placement invites reflection on deepening your focus to match your impressive breadth of knowledge.",
    Cancer: "With Cancer on your 3rd House cusp, your communication style is nurturing, emotionally attuned, and deeply connected to personal experience. You may indicate a natural gift for expressing feelings, creating emotional safety in conversations, and connecting through shared stories and memories. This placement invites reflection on balancing emotional expression with objective analysis.",
    Leo: "With Leo on your 3rd House cusp, your communication style is warm, expressive, and naturally dramatic. You may indicate a natural gift for storytelling, inspiring others through your words, and creating engaging, memorable conversations that light up any room. This placement invites reflection on listening as deeply as you speak to create true dialogue.",
    Virgo: "With Virgo on your 3rd House cusp, your communication style is analytical, precise, and service-oriented. You may indicate a natural gift for organizing information, expressing ideas with clarity and detail, and creating practical solutions through careful communication. This placement invites reflection on trusting your instincts alongside your careful analysis.",
    Libra: "With Libra on your 3rd House cusp, your communication style is diplomatic, balanced, and aesthetically attuned. You may indicate a natural gift for creating harmony through words, considering multiple perspectives, and expressing ideas with grace and fairness. This placement invites reflection on voicing your own opinion even when it disrupts harmony.",
    Scorpio: "With Scorpio on your 3rd House cusp, your communication style is penetrating, investigative, and deeply authentic. You may indicate a natural gift for uncovering hidden truths, expressing ideas with depth and conviction, and creating transformative dialogue that challenges the status quo. This placement invites reflection on sharing your insights with gentleness and discernment.",
    Sagittarius: "With Sagittarius on your 3rd House cusp, your communication style is expansive, philosophical, and optimistic. You may indicate a natural gift for inspiring others through big ideas, sharing wisdom with enthusiasm, and creating conversations that broaden perspectives and uplift spirits. This placement invites reflection on attending to details and nuance alongside your love of the big picture.",
    Capricorn: "With Capricorn on your 3rd House cusp, your communication style is structured, practical, and authoritative. You may indicate a natural gift for expressing ideas with clarity and purpose, building communication into actionable plans, and creating lasting impact through careful word choice. This placement invites reflection on allowing creative and unconventional thoughts to flourish alongside your disciplined thinking.",
    Aquarius: "With Aquarius on your 3rd House cusp, your communication style is innovative, independent, and forward-thinking. You may indicate a natural gift for generating original ideas, challenging conventional thinking, and inspiring progressive change through your unconventional communication. This placement invites reflection on grounding your visionary concepts in practical reality for broader impact.",
    Pisces: "With Pisces on your 3rd House cusp, your communication style is intuitive, imaginative, and deeply empathetic. You may indicate a natural gift for expressing spiritual insight, creating healing through words, and connecting with others on a soul level through compassionate communication. This placement invites reflection on clarifying your thoughts through writing or structured communication to share your inner visions effectively.",
  },
  4: {
    Aries: "With Aries on your 4th House cusp, your home and family life are marked by independence, initiative, and a pioneering spirit. You may indicate a need to create emotional security on your own terms, forging new paths within your domestic environment. This placement invites reflection on building emotional foundations that honor both your independence and your need for belonging.",
    Taurus: "With Taurus on your 4th House cusp, your home and family life are marked by stability, comfort, and deep appreciation for sensory pleasure. You may indicate a natural ability to create a warm, nurturing home environment that serves as a sanctuary from the outside world. This placement invites reflection on finding emotional grounding that transcends material comfort.",
    Gemini: "With Gemini on your 4th House cusp, your home and family life are marked by communication, variety, and intellectual engagement. You may indicate a need for mental stimulation and diverse experiences within your domestic environment. This placement invites reflection on creating emotional security that honors both your need for stability and your love of intellectual exploration.",
    Cancer: "With Cancer on your 4th House cusp, your home and family life are marked by deep emotional connection, nurturing, and a strong sense of belonging. You may indicate a profound need for emotional security, family roots, and a safe private space where you can fully be yourself. This placement invites reflection on building emotional security from within while creating a loving home environment.",
    Leo: "With Leo on your 4th House cusp, your home and family life are marked by warmth, creativity, and generous self-expression. You may indicate a natural ability to create a vibrant, joyful home environment where everyone feels welcomed and celebrated. This placement invites reflection on finding emotional validation from within while sharing your generous spirit with your loved ones.",
    Virgo: "With Virgo on your 4th House cusp, your home and family life are marked by order, service, and practical care. You may indicate a natural ability to create an organized, efficient home environment that supports the well-being of everyone in it. This placement invites reflection on finding emotional fulfillment through service while maintaining healthy boundaries in your domestic life.",
    Libra: "With Libra on your 4th House cusp, your home and family life are marked by harmony, beauty, and balanced relationships. You may indicate a natural ability to create an aesthetically pleasing, peaceful home environment that fosters connection and mutual respect. This placement invites reflection on honoring your own emotional needs alongside your deep desire for domestic harmony.",
    Scorpio: "With Scorpio on your 4th House cusp, your home and family life are marked by intensity, transformation, and deep emotional authenticity. You may indicate a powerful process of healing inherited emotional patterns and creating new foundations of emotional security. This placement invites reflection on honoring your roots while transforming painful family patterns into sources of strength.",
    Sagittarius: "With Sagittarius on your 4th House cusp, your home and family life are marked by adventure, philosophy, and expansive growth. You may indicate a need for freedom and exploration within your domestic environment, often creating a home that reflects your broad worldview. This placement invites reflection on finding emotional grounding while honoring your natural need for expansion and exploration.",
    Capricorn: "With Capricorn on your 4th House cusp, your home and family life are marked by discipline, responsibility, and long-term structure. You may indicate a natural ability to create stable, enduring domestic foundations through patience and dedication. This placement invites reflection on balancing your ambition with the cultivation of deep, nurturing home environments.",
    Aquarius: "With Aquarius on your 4th House cusp, your home and family life are marked by innovation, independence, and unconventional foundations. You may indicate a need to create emotional security on your own terms, free from inherited patterns and societal expectations. This placement invites reflection on building new forms of belonging that honor both your need for stability and your drive for freedom.",
    Pisces: "With Pisces on your 4th House cusp, your home and family life are marked by spiritual sensitivity, compassion, and deep emotional permeability. You may indicate a profound need for a peaceful, spiritually nourishing home environment that honors your deep sensitivity. This placement invites reflection on creating emotional security that honors both your spiritual gifts and your need for practical grounding.",
  },
  5: {
    Aries: "With Aries on your 5th House cusp, your creative expression and romantic life are marked by passion, independence, and bold self-expression. You may indicate a natural gift for initiating creative projects and pursuing love with courage and enthusiasm. This placement invites reflection on channeling your passionate energy into creative pursuits that inspire and uplift others.",
    Taurus: "With Taurus on your 5th House cusp, your creative expression and romantic life are marked by sensuality, patience, and deep appreciation for beauty. You may indicate a natural gift for creating lasting art and building romantic connections grounded in stability and physical affection. This placement invites reflection on finding creative fulfillment beyond material comfort and sensory pleasure.",
    Gemini: "With Gemini on your 5th House cusp, your creative expression and romantic life are marked by versatility, wit, and intellectual playfulness. You may indicate a natural gift for engaging in diverse creative pursuits and keeping romance alive through mental engagement and witty exchange. This placement invites reflection on deepening emotional intimacy alongside your love of intellectual stimulation.",
    Cancer: "With Cancer on your 5th House cusp, your creative expression and romantic life are marked by emotional depth, nurturing, and a strong connection to family and home. You may indicate a natural gift for creating emotionally resonant art and building romantic connections that feel like family. This placement invites reflection on honoring your emotional needs for creative expression and romantic connection.",
    Leo: "With Leo on your 5th House cusp, your creative expression and romantic life are marked by warmth, generosity, and natural charisma. You may indicate a powerful gift for self-expression, performance, and creating romantic connections that celebrate your unique light. This placement invites reflection on sharing your creative gifts generously while maintaining authentic self-expression.",
    Virgo: "With Virgo on your 5th House cusp, your creative expression and romantic life are marked by precision, analysis, and devoted service. You may indicate a natural gift for creating detailed, meaningful art and building romantic connections through acts of care and attention. This placement invites reflection on embracing imperfection while still striving for excellence in your creative and romantic pursuits.",
    Libra: "With Libra on your 5th House cusp, your creative expression and romantic life are marked by beauty, balance, and harmonious partnership. You may indicate a natural gift for creating aesthetically pleasing art and building romantic connections filled with mutual respect and shared appreciation for beauty. This placement invites reflection on honoring your own creative desires alongside your partner's.",
    Scorpio: "With Scorpio on your 5th House cusp, your creative expression and romantic life are marked by intensity, depth, and transformative passion. You may indicate a powerful gift for channeling deep emotional truths into art and building romantic connections that demand complete emotional honesty. This placement invites reflection on sharing your creative power while maintaining healthy emotional boundaries.",
    Sagittarius: "With Sagittarius on your 5th House cusp, your creative expression and romantic life are marked by adventure, optimism, and philosophical depth. You may indicate a natural gift for creating inspiring, expansive art and building romantic connections that broaden your perspective and inspire growth. This placement invites reflection on grounding your creative vision in practical action while honoring your love of freedom.",
    Capricorn: "With Capricorn on your 5th House cusp, your creative expression and romantic life are marked by discipline, ambition, and long-term commitment. You may indicate a natural gift for building lasting creative works and developing romantic connections through patience, dedication, and shared goals. This placement invites reflection on balancing your ambition with moments of creative joy and romantic spontaneity.",
    Aquarius: "With Aquarius on your 5th House cusp, your creative expression and romantic life are marked by innovation, independence, and humanitarian ideals. You may indicate a natural gift for creating groundbreaking, original art and building romantic connections that honor both freedom and deep connection. This placement invites reflection on sharing your unique creative vision with the world while maintaining authentic relationships.",
    Pisces: "With Pisces on your 5th House cusp, your creative expression and romantic life are marked by spiritual inspiration, boundless imagination, and deep compassion. You may indicate a natural gift for channeling divine inspiration into art and building romantic connections that transcend personal experience. This placement invites reflection on grounding your creative visions in practical reality while honoring your spiritual gifts.",
  },
  6: {
    Aries: "With Aries on your 6th House cusp, your approach to work, health, and daily routines is marked by initiative, independence, and pioneering energy. You may indicate a natural ability to tackle tasks with bold determination and create efficient, self-directed work systems. This placement invites reflection on channeling your competitive energy into meaningful service while maintaining work-life balance.",
    Taurus: "With Taurus on your 6th House cusp, your approach to work, health, and daily routines is marked by patience, practicality, and deep appreciation for sensory well-being. You may indicate a natural ability to create stable, comfortable work environments and maintain consistent health practices that honor your body's needs. This placement invites reflection on finding spiritual fulfillment in everyday service and routine.",
    Gemini: "With Gemini on your 6th House cusp, your approach to work, health, and daily routines is marked by versatility, communication, and intellectual engagement. You may indicate a natural ability to multitask, communicate effectively in work settings, and find mental stimulation in daily activities. This placement invites reflection on deepening your focus while honoring your natural curiosity and love of variety.",
    Cancer: "With Cancer on your 6th House cusp, your approach to work, health, and daily routines is marked by nurturing, emotional sensitivity, and a strong connection to home and family. You may indicate a natural ability to create caring work environments and maintain health practices that honor your emotional well-being. This placement invites reflection on balancing your need to nurture others with adequate self-care.",
    Leo: "With Leo on your 6th House cusp, your approach to work, health, and daily routines is marked by creativity, generosity, and natural leadership. You may indicate a natural ability to inspire colleagues, create joyful work environments, and maintain health practices that celebrate your body's vitality. This placement invites reflection on finding creative fulfillment in service while maintaining authentic self-expression.",
    Virgo: "With Virgo on your 6th House cusp, your approach to work, health, and daily routines is marked by precision, analysis, and devoted service. You may indicate a natural ability to create organized, efficient work systems and maintain detailed health practices that optimize your well-being. This placement invites reflection on celebrating progress rather than waiting for perfection in your daily service.",
    Libra: "With Libra on your 6th House cusp, your approach to work, health, and daily routines is marked by balance, diplomacy, and aesthetic appreciation. You may indicate a natural ability to create harmonious work environments and maintain balanced health practices that honor both beauty and function. This placement invites reflection on honoring your own needs alongside your desire to serve others harmoniously.",
    Scorpio: "With Scorpio on your 6th House cusp, your approach to work, health, and daily routines is marked by intensity, depth, and transformative dedication. You may indicate a natural ability to dive deep into work projects and maintain health practices that address the root causes of imbalance. This placement invites reflection on channeling your transformative energy into healing service while maintaining healthy boundaries.",
    Sagittarius: "With Sagittarius on your 6th House cusp, your approach to work, health, and daily routines is marked by optimism, adventure, and philosophical depth. You may indicate a natural ability to find meaning in service and maintain health practices that honor your need for growth and exploration. This placement invites reflection on grounding your expansive vision in practical daily action while honoring your love of freedom.",
    Capricorn: "With Capricorn on your 6th House cusp, your approach to work, health, and daily routines is marked by discipline, ambition, and long-term structure. You may indicate a natural ability to build efficient, productive work systems and maintain disciplined health practices that support your long-term goals. This placement invites reflection on balancing your relentless ambition with adequate rest and self-care.",
    Aquarius: "With Aquarius on your 6th House cusp, your approach to work, health, and daily routines is marked by innovation, independence, and humanitarian ideals. You may indicate a natural ability to create progressive, efficient work systems and maintain health practices that honor your need for freedom and authenticity. This placement invites reflection on grounding your innovative ideas in practical daily action while serving the greater good.",
    Pisces: "With Pisces on your 6th House cusp, your approach to work, health, and daily routines is marked by spiritual sensitivity, compassion, and intuitive guidance. You may indicate a natural ability to create healing work environments and maintain health practices that honor your deep connection to universal well-being. This placement invites reflection on protecting your energy while maintaining your beautiful commitment to serving others.",
  },
  7: {
    Aries: "With Aries on your 7th House cusp, your approach to partnerships is marked by independence, passion, and a desire for dynamic, active connections. You may indicate a natural attraction to bold, assertive partners who challenge you to grow and take initiative. This placement invites reflection on balancing your need for independence with the collaborative nature of deep partnership.",
    Taurus: "With Taurus on your 7th House cusp, your approach to partnerships is marked by loyalty, sensuality, and a desire for stable, lasting connections. You may indicate a natural attraction to reliable, grounded partners who value security and physical affection. This placement invites reflection on finding emotional depth alongside your natural desire for stability and comfort in relationships.",
    Gemini: "With Gemini on your 7th House cusp, your approach to partnerships is marked by intellectual stimulation, communication, and a desire for versatile, engaging connections. You may indicate a natural attraction to witty, communicative partners who keep you mentally stimulated and engaged. This placement invites reflection on deepening emotional intimacy alongside your love of intellectual exchange.",
    Cancer: "With Cancer on your 7th House cusp, your approach to partnerships is marked by emotional depth, nurturing, and a desire for safe, caring connections. You may indicate a natural attraction to sensitive, protective partners who create emotional security and a sense of home. This placement invites reflection on building emotional independence alongside your natural gift for deep partnership.",
    Leo: "With Leo on your 7th House cusp, your approach to partnerships is marked by warmth, generosity, and a desire for creative, expressive connections. You may indicate a natural attraction to confident, charismatic partners who celebrate your unique light and share your love of joy. This placement invites reflection on sharing the spotlight while maintaining authentic self-expression within partnership.",
    Virgo: "With Virgo on your 7th House cusp, your approach to partnerships is marked by devotion, analysis, and a desire for practical, service-oriented connections. You may indicate a natural attraction to helpful, detail-oriented partners who share your commitment to improvement and well-being. This placement invites reflection on accepting love imperfectly while still honoring your high standards for partnership.",
    Libra: "With Libra on your 7th House cusp, your approach to partnerships is marked by harmony, beauty, and a deep desire for balanced, egalitarian connections. You may indicate a natural attraction to diplomatic, charming partners who value fairness and create aesthetically pleasing relationships. This placement invites reflection on honoring your own desires alongside your partner's for truly balanced love.",
    Scorpio: "With Scorpio on your 7th House cusp, your approach to partnerships is marked by intensity, depth, and a desire for transformative, soul-deep connections. You may indicate a natural attraction to powerful, authentic partners who are willing to explore the depths of intimacy and emotional truth. This placement invites reflection on trusting love without seeking to control the object of your affection.",
    Sagittarius: "With Sagittarius on your 7th House cusp, your approach to partnerships is marked by optimism, adventure, and a desire for expansive, growth-oriented connections. You may indicate a natural attraction to philosophical, freedom-loving partners who share your love of exploration and wisdom. This placement invites reflection on finding commitment without feeling restricted by it.",
    Capricorn: "With Capricorn on your 7th House cusp, your approach to partnerships is marked by discipline, ambition, and a desire for structured, long-term connections. You may indicate a natural attraction to responsible, ambitious partners who share your commitment to building lasting success together. This placement invites reflection on opening your heart more freely while maintaining your natural sense of responsibility in partnerships.",
    Aquarius: "With Aquarius on your 7th House cusp, your approach to partnerships is marked by independence, innovation, and a desire for unconventional, progressive connections. You may indicate a natural attraction to unique, forward-thinking partners who honor your need for freedom and authenticity. This placement invites reflection on balancing your need for independence with the deeper emotional demands of intimacy.",
    Pisces: "With Pisces on your 7th House cusp, your approach to partnerships is marked by spiritual sensitivity, compassion, and a desire for transcendent, soul-deep connections. You may indicate a natural attraction to intuitive, empathetic partners who share your vision of love as a spiritual practice. This placement invites reflection on maintaining healthy boundaries while honoring your beautiful capacity for unconditional love.",
  },
  8: {
    Aries: "With Aries on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by courage, independence, and pioneering action. You may indicate a natural ability to initiate profound personal transformation and navigate deep emotional territory with fearless determination. This placement invites reflection on channeling your transformative energy toward healing and positive change.",
    Taurus: "With Taurus on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by patience, stability, and deep sensory awareness. You may indicate a natural ability to ground yourself during profound changes and find comfort in the steady rhythm of transformation. This placement invites reflection on finding security amidst change while honoring your need for stability.",
    Gemini: "With Gemini on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by curiosity, communication, and intellectual engagement. You may indicate a natural ability to process deep emotional experiences through conversation and mental analysis. This placement invites reflection on deepening your emotional engagement alongside your natural intellectual approach to transformation.",
    Cancer: "With Cancer on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by emotional depth, nurturing, and strong protective instincts. You may indicate a natural ability to navigate emotional transformation with care and create safe spaces for deep vulnerability. This placement invites reflection on trusting the process of emotional death and rebirth as a path to genuine empowerment.",
    Leo: "With Leo on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by warmth, generosity, and dramatic self-expression. You may indicate a natural ability to transform through creative expression and bring light to the deepest dimensions of human experience. This placement invites reflection on sharing your transformative power with others while maintaining authentic self-expression.",
    Virgo: "With Virgo on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by precision, analysis, and devoted service. You may indicate a natural ability to approach transformation with careful attention to detail and find meaning in the process of healing and improvement. This placement invites reflection on embracing imperfection while still striving for excellence in your transformative journey.",
    Libra: "With Libra on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by balance, diplomacy, and a deep desire for harmonious connection. You may indicate a natural ability to create balanced power dynamics in intimate relationships and navigate transformation with grace. This placement invites reflection on honoring your own needs alongside your partner's during profound change.",
    Scorpio: "With Scorpio on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by intensity, depth, and powerful perceptive ability. You may indicate a natural gift for navigating the deepest dimensions of human experience and facilitating profound healing transformation. This placement invites reflection on wielding your transformative power with wisdom, compassion, and discernment.",
    Sagittarius: "With Sagittarius on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by optimism, adventure, and philosophical depth. You may indicate a natural ability to find meaning and growth in life's most challenging transformations. This placement invites reflection on grounding your expansive vision of transformation in practical, emotional reality.",
    Capricorn: "With Capricorn on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by discipline, ambition, and long-term structure. You may indicate a natural ability to build enduring foundations for transformation through patience and dedicated effort. This placement invites reflection on balancing your ambition with the vulnerability required for deep intimacy and transformation.",
    Aquarius: "With Aquarius on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by innovation, independence, and humanitarian ideals. You may indicate a natural ability to approach transformation through progressive thinking and contribute to collective healing through your unique perspective. This placement invites reflection on grounding your innovative ideas in emotional reality while honoring your need for authentic transformation.",
    Pisces: "With Pisces on your 8th House cusp, your experience of transformation, intimacy, and shared resources is marked by spiritual sensitivity, compassion, and deep intuitive awareness. You may indicate a natural gift for navigating the unseen dimensions of transformation and channeling healing energy through your deep connection to universal consciousness. This placement invites reflection on protecting your sensitive nature while honoring your profound capacity for spiritual transformation.",
  },
  9: {
    Aries: "With Aries on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by independence, courage, and pioneering spirit. You may indicate a natural ability to forge your own philosophical path and inspire others through your bold exploration of truth. This placement invites reflection on grounding your adventurous spirit in practical wisdom that benefits both yourself and others.",
    Taurus: "With Taurus on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by patience, practicality, and deep appreciation for sensory experience. You may indicate a natural ability to find spiritual meaning in nature, art, and the simple pleasures of diverse cultures. This placement invites reflection on expanding your philosophical horizons while maintaining your natural grounding and stability.",
    Gemini: "With Gemini on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by curiosity, versatility, and intellectual engagement. You may indicate a natural gift for connecting diverse philosophical perspectives and finding wisdom in the exchange of ideas across cultures. This placement invites reflection on deepening your philosophical focus while honoring your natural love of intellectual variety.",
    Cancer: "With Cancer on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by emotional depth, nurturing, and a strong connection to home and family. You may indicate a natural ability to find spiritual meaning through emotional experience and create a sense of belonging wherever you go. This placement invites reflection on expanding your philosophical horizons while honoring your need for emotional security and connection.",
    Leo: "With Leo on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by warmth, creativity, and natural leadership. You may indicate a natural gift for inspiring others through your philosophical vision and sharing your wisdom with generosity and enthusiasm. This placement invites reflection on grounding your expansive philosophy in practical action that creates lasting impact.",
    Virgo: "With Virgo on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by precision, analysis, and devoted service. You may indicate a natural ability to organize and refine philosophical concepts with careful attention to detail. This placement invites reflection on embracing the big picture alongside your natural love of precision and practical improvement.",
    Libra: "With Libra on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by balance, diplomacy, and aesthetic appreciation. You may indicate a natural gift for finding harmony between diverse philosophical perspectives and creating beauty through your intellectual exploration. This placement invites reflection on voicing your own philosophical convictions alongside your natural desire for harmony.",
    Scorpio: "With Scorpio on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by intensity, depth, and transformative power. You may indicate a natural ability to dive deep into philosophical truth and undergo profound transformation through your intellectual exploration. This placement invites reflection on sharing your transformative wisdom with gentleness and discernment rather than intensity alone.",
    Sagittarius: "With Sagittarius on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by optimism, adventure, and expansive vision. You may indicate a natural gift for finding meaning and wisdom through exploration, study, and the sharing of your philosophical insights with others. This placement invites reflection on grounding your expansive philosophy in practical action that creates lasting, meaningful impact.",
    Capricorn: "With Capricorn on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by discipline, ambition, and long-term commitment. You may indicate a natural ability to build lasting philosophical structures through patient study and dedicated effort. This placement invites reflection on balancing your ambition with moments of philosophical wonder and intellectual freedom.",
    Aquarius: "With Aquarius on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by innovation, independence, and humanitarian ideals. You may indicate a natural gift for challenging conventional thinking and inspiring progressive philosophical perspectives through your unique exploration. This placement invites reflection on grounding your visionary philosophy in practical action that creates meaningful social change.",
    Pisces: "With Pisces on your 9th House cusp, your approach to philosophy, travel, and higher learning is marked by spiritual sensitivity, compassion, and deep intuitive awareness. You may indicate a natural gift for finding spiritual truth through meditation, prayer, and connection with diverse spiritual traditions. This placement invites reflection on grounding your transcendent philosophical insights in practical reality to serve others effectively.",
  },
  10: {
    Aries: "With Aries on your 10th House cusp, your career and public life are marked by independence, initiative, and pioneering leadership. You may indicate a natural drive to forge your own professional path and achieve recognition through bold action and self-reliance. This placement invites reflection on building a career that honors both your need for independence and your commitment to meaningful contribution.",
    Taurus: "With Taurus on your 10th House cusp, your career and public life are marked by patience, stability, and deep appreciation for quality and beauty. You may indicate a natural ability to build lasting professional success through steady effort and an eye for excellence. This placement invites reflection on finding fulfillment in your work while honoring your need for material security and aesthetic pleasure.",
    Gemini: "With Gemini on your 10th House cusp, your career and public life are marked by versatility, communication, and intellectual engagement. You may indicate a natural gift for connecting diverse professional opportunities and building a career that reflects your varied interests and communicative gifts. This placement invites reflection on deepening your professional focus while honoring your natural love of variety and intellectual stimulation.",
    Cancer: "With Cancer on your 10th House cusp, your career and public life are marked by nurturing, emotional sensitivity, and a strong connection to home and family. You may indicate a natural ability to create caring work environments and build a career that honors your emotional values and desire to serve others. This placement invites reflection on balancing your professional ambitions with your deep need for emotional security and connection.",
    Leo: "With Leo on your 10th House cusp, your career and public life are marked by warmth, creativity, and natural leadership. You may indicate a natural gift for inspiring others through your professional vision and achieving recognition for your creative contributions. This placement invites reflection on sharing your professional gifts generously while maintaining authentic self-expression in your career.",
    Virgo: "With Virgo on your 10th House cusp, your career and public life are marked by precision, analysis, and devoted service. You may indicate a natural ability to build a career through careful attention to detail and a genuine desire to improve the world through your professional contributions. This placement invites reflection on celebrating your professional progress while remaining open to new possibilities and growth.",
    Libra: "With Libra on your 10th House cusp, your career and public life are marked by balance, diplomacy, and aesthetic appreciation. You may indicate a natural gift for creating harmonious professional environments and building a career that values beauty, fairness, and partnership. This placement invites reflection on honoring your own professional desires alongside your deep desire for balance and harmony in your work.",
    Scorpio: "With Scorpio on your 10th House cusp, your career and public life are marked by intensity, depth, and transformative power. You may indicate a natural ability to undergo profound professional transformation and build a career that channels your deep emotional intelligence into meaningful impact. This placement invites reflection on wielding your professional power with wisdom, compassion, and discernment.",
    Sagittarius: "With Sagittarius on your 10th House cusp, your career and public life are marked by optimism, adventure, and philosophical depth. You may indicate a natural gift for finding meaning and purpose through your professional work and building a career that reflects your expansive worldview. This placement invites reflection on grounding your professional vision in practical action that creates lasting, meaningful impact.",
    Capricorn: "With Capricorn on your 10th House cusp, your career and public life are marked by discipline, ambition, and long-term structure. You may indicate a natural ability to build enduring professional success through patience, hard work, and strategic planning. This placement invites reflection on balancing your relentless ambition with moments of self-care and recognition of your accomplishments.",
    Aquarius: "With Aquarius on your 10th House cusp, your career and public life are marked by innovation, independence, and humanitarian ideals. You may indicate a natural gift for creating progressive professional structures and building a career that contributes to collective progress and social change. This placement invites reflection on grounding your visionary professional ideas in practical action that creates meaningful, lasting impact.",
    Pisces: "With Pisces on your 10th House cusp, your career and public life are marked by spiritual sensitivity, compassion, and deep intuitive awareness. You may indicate a natural ability to create healing professional environments and build a career that honors your spiritual gifts and desire to serve the greater good. This placement invites reflection on grounding your transcendent professional visions in practical reality to serve others effectively.",
  },
  11: {
    Aries: "With Aries on your 11th House cusp, your approach to friendships and community is marked by independence, initiative, and pioneering spirit. You may indicate a natural ability to forge new social connections and inspire collective action through your bold, self-reliant leadership. This placement invites reflection on channeling your independent energy into meaningful community contribution while honoring your need for personal autonomy.",
    Taurus: "With Taurus on your 11th House cusp, your approach to friendships and community is marked by loyalty, stability, and deep appreciation for lasting connections. You may indicate a natural ability to build enduring friendships and contribute to communities through patience, reliability, and practical support. This placement invites reflection on expanding your social horizons while maintaining your natural grounding and loyalty.",
    Gemini: "With Gemini on your 11th House cusp, your approach to friendships and community is marked by versatility, communication, and intellectual engagement. You may indicate a natural gift for connecting diverse social groups and building communities through lively conversation and shared ideas. This placement invites reflection on deepening your friendships while honoring your natural love of variety and intellectual stimulation.",
    Cancer: "With Cancer on your 11th House cusp, your approach to friendships and community is marked by nurturing, emotional sensitivity, and a strong sense of belonging. You may indicate a natural ability to create caring social environments and build communities that feel like family. This placement invites reflection on balancing your need to nurture others with your own emotional well-being within community settings.",
    Leo: "With Leo on your 11th House cusp, your approach to friendships and community is marked by warmth, generosity, and natural leadership. You may indicate a natural gift for inspiring collective action and building communities that celebrate individual expression and creative collaboration. This placement invites reflection on sharing your social gifts generously while maintaining authentic self-expression within community settings.",
    Virgo: "With Virgo on your 11th House cusp, your approach to friendships and community is marked by precision, analysis, and devoted service. You may indicate a natural ability to organize and improve community systems through careful attention to detail and dedicated effort. This placement invites reflection on embracing the big picture alongside your natural love of precision and practical service.",
    Libra: "With Libra on your 11th House cusp, your approach to friendships and community is marked by balance, diplomacy, and aesthetic appreciation. You may indicate a natural gift for creating harmonious social environments and building communities that value fairness, beauty, and mutual respect. This placement invites reflection on honoring your own social needs alongside your deep desire for harmony and balance in community settings.",
    Scorpio: "With Scorpio on your 11th House cusp, your approach to friendships and community is marked by intensity, depth, and transformative power. You may indicate a natural ability to catalyze profound social transformation and build communities that embrace deep, authentic connection and healing. This placement invites reflection on channeling your transformative social energy toward sustainable, positive change.",
    Sagittarius: "With Sagittarius on your 11th House cusp, your approach to friendships and community is marked by optimism, adventure, and philosophical depth. You may indicate a natural gift for inspiring collective vision and building communities that embrace growth, exploration, and shared wisdom. This placement invites reflection on grounding your expansive social vision in practical action that creates meaningful community impact.",
    Capricorn: "With Capricorn on your 11th House cusp, your approach to friendships and community is marked by discipline, ambition, and long-term commitment. You may indicate a natural ability to build enduring community structures and develop lasting friendships through patience, dedication, and shared goals. This placement invites reflection on balancing your ambition with moments of social connection and community joy.",
    Aquarius: "With Aquarius on your 11th House cusp, your approach to friendships and community is marked by innovation, independence, and humanitarian ideals. You may indicate a natural gift for creating progressive community structures and building friendships that honor both individuality and collective progress. This placement invites reflection on grounding your visionary social ideas in practical action that creates meaningful, lasting community change.",
    Pisces: "With Pisces on your 11th House cusp, your approach to friendships and community is marked by spiritual sensitivity, compassion, and deep intuitive awareness. You may indicate a natural ability to create healing social environments and build communities that honor spiritual connection and universal compassion. This placement invites reflection on protecting your sensitive nature while honoring your profound capacity for community healing and spiritual service.",
  },
  12: {
    Aries: "With Aries on your 12th House cusp, your spiritual life and inner world are marked by independence, courage, and pioneering spirit. You may indicate a natural ability to forge your own spiritual path and face the unconscious dimensions of life with fearless determination. This placement invites reflection on channeling your independent spiritual energy toward healing and positive transformation.",
    Taurus: "With Taurus on your 12th House cusp, your spiritual life and inner world are marked by patience, stability, and deep sensory awareness. You may indicate a natural ability to find spiritual grounding in nature, art, and the simple pleasures of life. This placement invites reflection on expanding your spiritual horizons while maintaining your natural grounding and appreciation for sensory beauty.",
    Gemini: "With Gemini on your 12th House cusp, your spiritual life and inner world are marked by curiosity, versatility, and intellectual engagement. You may indicate a natural gift for exploring diverse spiritual traditions and finding wisdom through the exchange of spiritual ideas. This placement invites reflection on deepening your spiritual focus while honoring your natural love of intellectual variety and exploration.",
    Cancer: "With Cancer on your 12th House cusp, your spiritual life and inner world are marked by emotional depth, nurturing, and a strong connection to home and family. You may indicate a natural ability to find spiritual meaning through emotional experience and create a sense of spiritual belonging wherever you go. This placement invites reflection on expanding your spiritual awareness while honoring your need for emotional security and connection.",
    Leo: "With Leo on your 12th House cusp, your spiritual life and inner world are marked by warmth, creativity, and natural leadership. You may indicate a natural gift for inspiring others through your spiritual vision and sharing your inner wisdom with generosity and enthusiasm. This placement invites reflection on grounding your expansive spiritual vision in practical action that creates lasting, meaningful impact.",
    Virgo: "With Virgo on your 12th House cusp, your spiritual life and inner world are marked by precision, analysis, and devoted service. You may indicate a natural ability to organize and refine your spiritual practice with careful attention to detail and dedicated effort. This placement invites reflection on embracing the mystery and wonder of spirituality alongside your natural love of precision and practical improvement.",
    Libra: "With Libra on your 12th House cusp, your spiritual life and inner world are marked by balance, diplomacy, and aesthetic appreciation. You may indicate a natural gift for finding harmony between diverse spiritual perspectives and creating beauty through your inner exploration. This placement invites reflection on honoring your own spiritual needs alongside your deep desire for harmony and balance in your spiritual life.",
    Scorpio: "With Scorpio on your 12th House cusp, your spiritual life and inner world are marked by intensity, depth, and transformative power. You may indicate a natural ability to dive deep into the unconscious dimensions of life and undergo profound spiritual transformation. This placement invites reflection on sharing your transformative spiritual wisdom with gentleness and discernment rather than intensity alone.",
    Sagittarius: "With Sagittarius on your 12th House cusp, your spiritual life and inner world are marked by optimism, adventure, and philosophical depth. You may indicate a natural gift for finding spiritual meaning through exploration, study, and the sharing of your spiritual insights with others. This placement invites reflection on grounding your expansive spiritual vision in practical action that creates lasting, meaningful impact.",
    Capricorn: "With Capricorn on your 12th House cusp, your spiritual life and inner world are marked by discipline, ambition, and long-term commitment. You may indicate a natural ability to build lasting spiritual structures through patient practice and dedicated effort. This placement invites reflection on balancing your ambition with moments of spiritual wonder and inner freedom.",
    Aquarius: "With Aquarius on your 12th House cusp, your spiritual life and inner world are marked by innovation, independence, and humanitarian ideals. You may indicate a natural gift for challenging conventional spiritual thinking and inspiring progressive spiritual perspectives through your unique inner exploration. This placement invites reflection on grounding your visionary spiritual ideas in practical action that creates meaningful collective healing.",
    Pisces: "With Pisces on your 12th House cusp, your spiritual life and inner world are marked by profound sensitivity, compassion, and deep intuitive awareness. You may indicate a natural gift for navigating the unseen dimensions of spirituality and channeling universal healing energy through your deep connection to cosmic consciousness. This placement invites reflection on grounding your transcendent spiritual experiences in practical reality to serve others effectively while protecting your sensitive nature.",
  },
};

// ---------------------------------------------------------------------------
// Nakshatra interpretations for Moon
// ---------------------------------------------------------------------------
const NAKSHATRAS: Record<string, string> = {
  Ashwini:
    "Your Moon in Ashwini suggests a quick, healing energy with a pioneering spirit. You may indicate a natural ability to initiate new beginnings and heal others through your dynamic, compassionate presence. This nakshatra invites reflection on channeling your swift energy into meaningful, healing action that benefits both yourself and those around you.",
  Bharani:
    "Your Moon in Bharani suggests a transformative energy marked by creative power and the ability to navigate life's deeper challenges. You may indicate a natural capacity for enduring hardship and emerging stronger through the process of transformation. This nakshatra invites reflection on embracing your creative power while maintaining compassion through life's inevitable cycles of change.",
  Krittika:
    "Your Moon in Krittika suggests a sharp, transformative energy with a powerful ability to cut through illusion and reveal truth. You may indicate a natural gift for purification, both of yourself and your environment, through honest, direct action. This nakshatra invites reflection on wielding your transformative power with wisdom and compassion rather than harsh judgment.",
  Rohini:
    "Your Moon in Rohini suggests a sensual, creative energy deeply connected to beauty, abundance, and the material world. You may indicate a natural ability to attract resources and create beauty through your magnetic, grounded presence. This nakshatra invites reflection on finding spiritual wealth alongside material comfort and sharing your abundance generously with others.",
  Mrigashira:
    "Your Moon in Mrigashira suggests a curious, searching energy with a deep need for knowledge and exploration. You may indicate a natural gift for seeking truth, connecting with diverse perspectives, and finding wisdom through patient inquiry. This nakshatra invites reflection on grounding your curious nature in practical wisdom that benefits both yourself and your community.",
  Ardra:
    "Your Moon in Ardra suggests a transformative energy marked by emotional intensity and the ability to find growth through challenge. You may indicate a natural capacity for deep emotional healing and the creation of new beginnings through the process of transformation. This nakshatra invites reflection on embracing vulnerability as a source of strength and healing for yourself and others.",
  Punarvasu:
    "Your Moon in Punarvasu suggests an optimistic, renewing energy with a natural ability to bounce back from setbacks and find new hope. You may indicate a gift for spiritual renewal, creative expression, and inspiring others through your resilience and faith. This nakshatra invites reflection on channeling your optimistic energy into meaningful action that creates lasting positive change.",
  Pushya:
    "Your Moon in Pushya suggests a nurturing, caring energy deeply connected to service, devotion, and the well-being of others. You may indicate a natural gift for creating supportive environments and offering compassionate care to those in need. This nakshatra invites reflection on nurturing yourself with the same tenderness you offer to others and finding spiritual fulfillment through selfless service.",
  Ashlesha:
    "Your Moon in Ashlesha suggests an intense, perceptive energy with a deep ability to navigate the hidden dimensions of the psyche. You may indicate a natural gift for healing through intuition, understanding complex emotional dynamics, and channeling transformative wisdom. This nakshatra invites reflection on wielding your perceptive power with compassion and discernment rather than manipulation or control.",
  Magha:
    "Your Moon in Magha suggests a regal, authoritative energy connected to ancestral wisdom and the power of tradition. You may indicate a natural gift for leadership, honoring your roots, and channeling the strength of your lineage into positive action. This nakshatra invites reflection on balancing your natural authority with humility and using your power to uplift others and preserve meaningful traditions.",
  PurvaPhalguni:
    "Your Moon in Purva Phalguni suggests a creative, generous energy deeply connected to pleasure, romance, and artistic expression. You may indicate a natural gift for inspiring joy, creating beauty, and building meaningful connections through your warm, magnetic presence. This nakshatra invites reflection on sharing your creative gifts generously while maintaining authentic self-expression and healthy boundaries.",
  UttaraPhalguni:
    "Your Moon in Uttara Phalguni suggests a loyal, devoted energy connected to partnership, friendship, and meaningful service. You may indicate a natural gift for building lasting relationships, creating supportive communities, and serving others through dedicated, heartfelt action. This nakshatra invites reflection on honoring your own needs alongside your deep desire to serve and connect with others.",
  Hasta:
    "Your Moon in Hasta suggests a skilled, dexterous energy with a natural gift for craftsmanship, healing, and practical problem-solving. You may indicate a talent for using your hands, creating beautiful objects, and serving others through skilled, attentive care. This nakshatra invites reflection on channeling your practical gifts toward meaningful service and finding spiritual fulfillment through dedicated craftsmanship.",
  Chitra:
    "Your Moon in Chitra suggests a creative, artistic energy deeply connected to beauty, imagination, and spiritual vision. You may indicate a natural gift for creating stunning visual art, building beautiful environments, and channeling divine inspiration into tangible form. This nakshatra invites reflection on sharing your creative brilliance with the world while maintaining spiritual integrity and authentic self-expression.",
  Swati:
    "Your Moon in Swati suggests an independent, flexible energy with a natural ability to adapt to change and find balance in dynamic situations. You may indicate a gift for diplomacy, creative problem-solving, and building harmonious connections through your gentle, adaptable presence. This nakshatra invites reflection on grounding your flexible nature in clear boundaries and consistent action while honoring your need for independence.",
  Vishakha:
    "Your Moon in Vishakha suggests a determined, goal-oriented energy with a powerful ability to achieve long-term objectives through focused, patient effort. You may indicate a natural gift for perseverance, creating lasting impact, and building meaningful success through dedicated, purposeful action. This nakshatra invites reflection on channeling your determination toward goals that serve the greater good while maintaining balance and self-care.",
  Anuradha:
    "Your Moon in Anuradha suggests a devotional, cooperative energy deeply connected to spiritual practice, friendship, and collaborative effort. You may indicate a natural gift for building meaningful spiritual connections, creating harmonious partnerships, and serving others through devoted, heartfelt action. This nakshatra invites reflection on honoring your own spiritual path alongside your deep desire to connect with and serve others.",
  Jyeshtha:
    "Your Moon in Jyeshtha suggests a powerful, transformative energy connected to leadership, authority, and the responsible use of personal power. You may indicate a natural gift for guiding others through complex challenges, channeling transformative wisdom, and building meaningful impact through decisive, compassionate leadership. This nakshatra invites reflection on wielding your power with discernment, humility, and genuine care for those you lead.",
  Mula:
    "Your Moon in Mula suggests a deeply transformative energy connected to spiritual truth, roots, and the process of getting to the heart of any matter. You may indicate a natural gift for uncovering hidden truths, healing deep-rooted patterns, and channeling spiritual wisdom through fearless inquiry. This nakshatra invites reflection on grounding your transformative insights in practical action that creates lasting healing and positive change.",
  PurvaAshadha:
    "Your Moon in Purva Ashadha suggests an invincible, optimistic energy with a natural ability to rise above challenges and find renewal through faith and determination. You may indicate a gift for inspiring hope, creating positive change, and building meaningful success through resilient, heartfelt action. This nakshatra invites reflection on channeling your invincible spirit toward goals that uplift yourself and others.",
  UttaraAshadha:
    "Your Moon in Uttara Ashadha suggests a determined, victorious energy connected to lasting achievement, wisdom, and the patient pursuit of meaningful goals. You may indicate a natural gift for building enduring success, creating lasting impact, and serving others through dedicated, wise action. This nakshatra invites reflection on balancing your determination with moments of rest, reflection, and celebration of your accomplishments.",
  Shravana:
    "Your Moon in Shravana suggests a deeply attentive, listening energy with a natural gift for hearing the unspoken and understanding others through compassionate awareness. You may indicate a talent for creating sacred spaces of listening, building meaningful connections through empathy, and channeling wisdom through careful, attentive presence. This nakshatra invites reflection on sharing your listening gifts with the world while maintaining healthy boundaries and self-care.",
  Dhanishta:
    "Your Moon in Dhanishta suggests a rhythmic, prosperous energy connected to music, abundance, and the ability to create harmony through movement and expression. You may indicate a natural gift for attracting resources, building meaningful success through rhythmic, consistent effort, and creating beauty through music, dance, or other forms of rhythmic expression. This nakshatra invites reflection on sharing your abundant energy generously while maintaining spiritual integrity and authentic self-expression.",
  Shatabhisha:
    "Your Moon in Shatabhisha suggests a healing, mysterious energy connected to medicine, spirituality, and the ability to navigate the unseen dimensions of healing. You may indicate a natural gift for channeling healing energy, understanding complex spiritual dynamics, and creating profound transformation through intuitive, compassionate care. This nakshatra invites reflection on grounding your healing gifts in practical reality while honoring your deep connection to spiritual truth.",
  PurvaBhadrapada:
    "Your Moon in Purva Bhadrapada suggests a transformative, fiery energy connected to spiritual awakening, intense passion, and the ability to channel deep emotional truth into meaningful action. You may indicate a natural gift for inspiring profound change, building meaningful impact through fearless self-expression, and channeling your intense passion toward healing and transformation. This nakshatra invites reflection on wielding your transformative fire with wisdom, compassion, and discernment.",
  UttaraBhadrapada:
    "Your Moon in Uttara Bhadrapada suggests a wise, patient energy connected to deep spiritual insight, generous service, and the ability to channel profound wisdom into practical healing. You may indicate a natural gift for creating lasting impact through patient, devoted service, building meaningful connections through spiritual depth, and channeling your wisdom toward the greater good. This nakshatra invites reflection on sharing your profound insights with gentleness and maintaining spiritual integrity in all you do.",
  Revati:
    "Your Moon in Revati suggests a compassionate, spiritual energy connected to universal consciousness, healing, and the ability to channel divine love into practical service. You may indicate a natural gift for creating healing environments, building meaningful connections through spiritual sensitivity, and channeling universal compassion toward the greater good. This nakshatra invites reflection on grounding your transcendent spiritual gifts in practical reality to serve others effectively while protecting your sensitive nature.",
};

// ---------------------------------------------------------------------------
// Helper: look up a value in a nested record with fallback
// ---------------------------------------------------------------------------
function lookup(
  table: Record<string, any>,
  key1: string,
  key2: string | number,
  fallback: string,
): string {
  const inner = table[key1];
  if (!inner) return fallback;
  return inner[key2] ?? fallback;
}

function lookupByNumber(
  table: Record<number, any>,
  key1: number,
  key2: string,
  fallback: string,
): string {
  const inner = table[key1];
  if (!inner) return fallback;
  return inner[key2] ?? fallback;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Interpretation of a planet in a specific zodiac sign.
 */
export function getPlanetInSign(planet: string, sign: string): string {
  return lookup(
    PLANET_SIGNS,
    planet,
    sign,
    `The placement of ${planet} in ${sign} suggests unique qualities that shape your experience in meaningful ways. You may indicate gifts that are uniquely yours, shaped by the interplay of these celestial energies. This placement invites reflection on how these qualities contribute to your personal growth and relationships.`,
  );
}

/**
 * Interpretation of a planet in a specific house.
 */
export function getPlanetInHouse(planet: string, house: number): string {
  return lookup(
    PLANET_HOUSES,
    planet,
    house,
    `With ${planet} in the ${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"} House, this area of life is highlighted by the energy of ${planet}. You may indicate a natural connection between this planet's influence and the themes of this house. This placement invites reflection on how this alignment shapes your experience and growth.`,
  );
}

/**
 * Interpretation of an aspect between two planets.
 * `aspect` should be one of: conjunction, opposition, trine, square, sextile
 */
export function getAspectInterpretation(
  planet1: string,
  planet2: string,
  aspect: string,
): string {
  const key1 = `${planet1}-${planet2}`;
  const key2 = `${planet2}-${planet1}`;
  const lowerAspect = aspect.toLowerCase();

  const table = ASPECTS[lowerAspect];
  if (!table) {
    return `The ${aspect} between ${planet1} and ${planet2} suggests a dynamic interplay between these planetary energies. You may indicate a meaningful connection between these areas of your life that invites growth and integration. This aspect invites reflection on how these energies interact to shape your experience and personal evolution.`;
  }

  return (
    table[key1] ??
    table[key2] ??
    `The ${aspect} between ${planet1} and ${planet2} suggests a dynamic interplay between these planetary energies. You may indicate a meaningful connection between these areas of your life that invites growth and integration. This aspect invites reflection on how these energies interact to shape your experience and personal evolution.`
  );
}

/**
 * Interpretation of a house cusp in a specific zodiac sign.
 */
export function getHouseSignInterpretation(house: number, sign: string): string {
  return lookupByNumber(
    HOUSE_SIGNS,
    house,
    sign,
    `With ${sign} on your ${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"} House cusp, this area of your life is influenced by the qualities of ${sign}. You may indicate a natural connection between these themes and your personal experience. This placement invites reflection on how these energies shape your approach to this important area of life.`,
  );
}

/**
 * Vedic nakshatra interpretation for a planet (primarily Moon).
 */
export function getNakshatraInterpretation(
  planet: string,
  nakshatra: string,
): string {
  const nakInterpretation = NAKSHATRAS[nakshatra];
  if (nakInterpretation) {
    return nakInterpretation;
  }
  return `Your ${planet} in ${nakshatra} nakshatra suggests a unique blend of energies that shapes your experience in meaningful ways. You may indicate gifts and challenges that are uniquely yours, shaped by the interplay of these celestial influences. This nakshatra invites reflection on how these qualities contribute to your personal growth, spiritual development, and relationships.`;
}

/**
 * Assemble a complete natal chart reading from chart data.
 *
 * Expected chart shape:
 * {
 *   planets: Array<{ id: string; sign: string; house?: number; nakshatra?: string }>,
 *   aspects: Array<{ planet1: string; planet2: string; type: string }>,
 *   houses: Array<{ house: number; sign: string }>,
 * }
 */
export function getFullReading(chart: any): ReadingSection[] {
  const sections: ReadingSection[] = [];

  // 1. Ascendant / 1st House
  const ascendant = chart.houses?.find((h: any) => h.house === 1);
  if (ascendant) {
    const houseSign = getHouseSignInterpretation(1, ascendant.sign);
    sections.push({
      title: "Ascendant",
      content: houseSign,
      icon: "ASC",
    });
  }

  // 2. Planet in Sign sections
  if (chart.planets) {
    for (const planet of chart.planets) {
      const pname = planet.name || planet.id;
      const interp = getPlanetInSign(pname, planet.sign);
      sections.push({
        title: `${pname} in ${planet.sign}`,
        content: interp,
        icon: pname,
      });
    }
  }

  // 3. Planet in House sections
  if (chart.planets) {
    for (const planet of chart.planets) {
      const pname = planet.name || planet.id;
      if (planet.house) {
        const interp = getPlanetInHouse(pname, planet.house);
        sections.push({
          title: `${pname} in House ${planet.house}`,
          content: interp,
          icon: pname,
        });
      }
    }
  }

  // 4. Aspect sections
  if (chart.aspects) {
    for (const asp of chart.aspects) {
      const interp = getAspectInterpretation(asp.planet1, asp.planet2, asp.aspect || asp.type);
      sections.push({
        title: `${asp.planet1} ${asp.type} ${asp.planet2}`,
        content: interp,
        icon: asp.type,
      });
    }
  }

  // 5. House in Sign sections (beyond Ascendant)
  if (chart.houses) {
    for (const house of chart.houses) {
      if (house.house !== 1) {
        const interp = getHouseSignInterpretation(house.house, house.sign);
        sections.push({
          title: `House ${house.house} in ${house.sign}`,
          content: interp,
          icon: `H${house.house}`,
        });
      }
    }
  }

  // 6. Nakshatra sections
  if (chart.planets) {
    for (const planet of chart.planets) {
      if (planet.nakshatra) {
        const interp = getNakshatraInterpretation(planet.id, planet.nakshatra);
        sections.push({
          title: `${planet.id} in ${planet.nakshatra}`,
          content: interp,
          icon: planet.id,
        });
      }
    }
  }

  return sections;
}

/**
 * Generate a yearly prediction reading based on natal chart and year.
 */
export function getYearlyReading(chart: any, year: number): ReadingSection[] {
  const sections: ReadingSection[] = [];

  sections.push({
    title: `Year ${year} Overview`,
    content: `As you move through ${year}, the cosmic energies continue to shape your journey in meaningful ways. Your natal chart provides a foundation for understanding the themes and opportunities that this year may bring. You may indicate a period of growth, reflection, and transformation as planetary transits interact with your natal placements. This yearly reading invites you to embrace the possibilities of ${year} with awareness, courage, and an open heart.`,
    icon: "yearly",
  });

  // Life purpose themes based on Sun and North Node
  const sun = chart.planets?.find((p: any) => p.id === "Sun");
  const northNode = chart.planets?.find((p: any) => p.id === "North Node");

  if (sun) {
    const sunInterp = getPlanetInSign(sun.id, sun.sign);
    sections.push({
      title: "Core Identity Theme",
      content: `Your core identity theme for ${year} centers on ${sunInterp} This year invites you to express your authentic self with greater confidence and clarity, allowing your inner light to guide your path forward.`,
      icon: "Sun",
    });
  }

  if (northNode) {
    const nnInterp = getPlanetInSign(northNode.id, northNode.sign);
    sections.push({
      title: "Growth Direction",
      content: `Your growth direction for ${year} is highlighted by your North Node placement: ${nnInterp} This year invites you to step more fully into your soul's purpose by embracing the qualities of ${northNode.sign} with courage and openness.`,
      icon: "North Node",
    });
  }

  // Year-specific themes based on numerology of the year
  const yearSum = String(year)
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit), 0);
  const lifePathNumber = yearSum > 9 ? Math.floor(yearSum / 10) + (yearSum % 10) : yearSum;

  const yearThemes: Record<number, string> = {
    1: `This is a year of new beginnings and fresh starts. You may indicate a powerful drive to initiate projects, take the lead, and forge new paths in your personal and professional life. This energy supports bold action, independence, and the courage to pursue your aspirations with confidence.`,
    2: `This is a year of partnership, patience, and cooperation. You may indicate a time of building meaningful connections, developing your diplomatic skills, and creating harmony in your relationships. This energy supports collaboration, sensitivity, and the cultivation of inner peace.`,
    3: `This is a year of creative expression, communication, and joyful self-representation. You may indicate a time of sharing your gifts, engaging in lively conversation, and finding inspiration through artistic and intellectual pursuits. This energy supports optimism, social connection, and the celebration of life's beauty.`,
    4: `This is a year of building foundations, creating structure, and establishing stability. You may indicate a time of hard work, practical accomplishment, and laying the groundwork for lasting success. This energy supports discipline, dedication, and the patient pursuit of meaningful goals.`,
    5: `This is a year of change, adventure, and personal freedom. You may indicate a time of embracing new experiences, breaking free from limitations, and expanding your horizons through travel, learning, and diverse encounters. This energy supports adaptability, curiosity, and the courage to embrace the unknown.`,
    6: `This is a year of responsibility, nurturing, and creating harmony in home and family life. You may indicate a time of caring for loved ones, building community, and finding beauty in the details of everyday existence. This energy supports compassion, service, and the cultivation of meaningful relationships.`,
    7: `This is a year of introspection, spiritual growth, and inner exploration. You may indicate a time of deep reflection, meditation, and the pursuit of hidden knowledge and truth. This energy supports solitude, wisdom, and the development of your intuitive gifts.`,
    8: `This is a year of achievement, abundance, and material success. You may indicate a time of building financial security, manifesting your goals, and stepping into positions of authority and influence. This energy supports ambition, confidence, and the responsible use of personal power.`,
    9: `This is a year of completion, transformation, and humanitarian service. You may indicate a time of releasing old patterns, embracing new possibilities, and contributing to the greater good through acts of compassion and generosity. This energy supports wisdom, forgiveness, and the celebration of your journey.`,
  };

  sections.push({
    title: "Annual Theme",
    content:
      yearThemes[lifePathNumber] ??
      `This is a year of unique opportunities and meaningful growth. You may indicate a time of personal evolution, creative expression, and the deepening of your spiritual awareness. This energy supports authenticity, courage, and the pursuit of your highest aspirations.`,
    icon: "theme",
  });

  return sections;
}

/**
 * Generate a Vimshottari Dasha reading based on natal chart.
 * Simplified: produces chapter-style sections for each major dasha period.
 */
export function getDashaReading(chart: any): ReadingSection[] {
  const sections: ReadingSection[] = [];

  const dashas = [
    {
      planet: "Ketu",
      title: "Ketu Dasha: Spiritual Awakening",
      content:
        "The Ketu Dasha period invites you into a time of spiritual awakening, detachment, and the release of worldly attachments. You may indicate a deep pull toward spiritual practice, meditation, and the exploration of life's deeper meaning beyond material concerns. This period invites reflection on what truly matters to your soul and the cultivation of inner peace through spiritual surrender.",
    },
    {
      planet: "Venus",
      title: "Venus Dasha: Love and Beauty",
      content:
        "The Venus Dasha period highlights themes of love, beauty, and creative expression. You may indicate a time of romantic fulfillment, artistic inspiration, and the deepening of your appreciation for life's pleasures. This period invites reflection on cultivating harmony in your relationships, sharing your creative gifts, and finding balance between personal desire and compassionate service.",
    },
    {
      planet: "Sun",
      title: "Sun Dasha: Identity and Purpose",
      content:
        "The Sun Dasha period brings focus to your core identity, life purpose, and authentic self-expression. You may indicate a time of increased confidence, leadership opportunities, and the clarification of your life direction. This period invites reflection on embracing your unique light, pursuing your goals with courage, and sharing your gifts generously with the world.",
    },
    {
      planet: "Moon",
      title: "Moon Dasha: Emotional Growth",
      content:
        "The Moon Dasha period highlights your emotional life, inner world, and nurturing capacities. You may indicate a time of emotional depth, intuitive development, and the cultivation of meaningful connections with others. This period invites reflection on honoring your feelings, caring for yourself and others, and trusting your emotional wisdom as a guide through life.",
    },
    {
      planet: "Mars",
      title: "Mars Dasha: Action and Courage",
      content:
        "The Mars Dasha period brings energy, drive, and assertiveness to the forefront. You may indicate a time of bold action, courageous self-expression, and the pursuit of your goals with determination and passion. This period invites reflection on channeling your competitive fire into constructive pursuits, asserting your boundaries with confidence, and creating meaningful change through decisive action.",
    },
    {
      planet: "Rahu",
      title: "Rahu Dasha: Expansion and Ambition",
      content:
        "The Rahu Dasha period amplifies your ambitions, desires, and drive for worldly success. You may indicate a time of intense focus on material achievement, career advancement, and the expansion of your influence and impact. This period invites reflection on balancing your worldly ambitions with spiritual integrity, maintaining ethical standards in your pursuit of success, and finding fulfillment beyond external validation.",
    },
    {
      planet: "Jupiter",
      title: "Jupiter Dasha: Wisdom and Abundance",
      content:
        "The Jupiter Dasha period highlights growth, wisdom, and the expansion of your philosophical and spiritual horizons. You may indicate a time of increased optimism, educational pursuits, and the deepening of your understanding of life's greater meaning. This period invites reflection on sharing your wisdom generously, pursuing truth with an open mind, and cultivating abundance through faith, generosity, and meaningful service.",
    },
    {
      planet: "Saturn",
      title: "Saturn Dasha: Discipline and Growth",
      content:
        "The Saturn Dasha period brings lessons of discipline, responsibility, and the building of lasting structures. You may indicate a time of hard work, patience, and the development of maturity through facing life's challenges with resilience. This period invites reflection on embracing your responsibilities with grace, building foundations for long-term success, and finding fulfillment through dedication, integrity, and meaningful contribution.",
    },
    {
      planet: "Mercury",
      title: "Mercury Dasha: Communication and Learning",
      content:
        "The Mercury Dasha period highlights communication, intellectual growth, and the exchange of ideas. You may indicate a time of increased mental agility, learning opportunities, and the development of your communicative gifts. This period invites reflection on expressing your thoughts with clarity and kindness, pursuing knowledge with curiosity and humility, and building meaningful connections through the power of language and understanding.",
    },
  ];

  // Determine which dasha is most relevant based on Moon's nakshatra
  const moon = chart.planets?.find((p: any) => (p.name || p.id) === "Moon");
  const moonNakshatra = moon?.nakshatra;

  const nakshatraLordMap: Record<string, string> = {
    Ashwini: "Ketu",
    Bharani: "Venus",
    Krittika: "Sun",
    Rohini: "Moon",
    Mrigashira: "Mars",
    Ardra: "Rahu",
    Punarvasu: "Jupiter",
    Pushya: "Saturn",
    Ashlesha: "Mercury",
    Magha: "Ketu",
    PurvaPhalguni: "Venus",
    UttaraPhalguni: "Sun",
    Hasta: "Moon",
    Chitra: "Mars",
    Swati: "Rahu",
    Vishakha: "Jupiter",
    Anuradha: "Saturn",
    Jyeshtha: "Mercury",
    Mula: "Ketu",
    PurvaAshadha: "Venus",
    UttaraAshadha: "Sun",
    Shravana: "Moon",
    Dhanishta: "Mars",
    Shatabhisha: "Rahu",
    PurvaBhadrapada: "Jupiter",
    UttaraBhadrapada: "Saturn",
    Revati: "Mercury",
  };

  const startingDasha = moonNakshatra
    ? nakshatraLordMap[moonNakshatra] ?? "Jupiter"
    : "Jupiter";

  // Reorder dashas so the starting dasha is first
  const startIndex = dashas.findIndex((d) => d.planet === startingDasha);
  const reorderedDahas =
    startIndex >= 0
      ? [...dashas.slice(startIndex), ...dashas.slice(0, startIndex)]
      : dashas;

  sections.push({
    title: "Life Chapters: Vimshottari Dasha",
    content:
      "The Vimshottari Dasha system divides your life into chapters governed by different planetary energies. Each period brings its own themes, challenges, and opportunities for growth. The following readings describe the general qualities of each dasha period as it relates to your natal chart.",
    icon: "dasha",
  });

  for (const dasha of reorderedDahas) {
    sections.push({
      title: dasha.title,
      content: dasha.content,
      icon: dasha.planet,
    });
  }

  return sections;
}
