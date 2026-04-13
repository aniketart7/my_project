export interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  trimester: (1 | 2 | 3)[];
  duration: string;
  benefits: string[];
  instructions: string[];
  caution?: string;
  emoji: string;
}

export interface Mantra {
  id: string;
  title: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  purpose: string;
  timing: string;
  trimester: (1 | 2 | 3)[];
}

export interface GarbhasanskarActivity {
  id: string;
  category: "music" | "reading" | "meditation" | "communication" | "art" | "nature";
  title: string;
  description: string;
  duration: string;
  trimester: (1 | 2 | 3)[];
  tip: string;
  emoji: string;
}

export interface PositivityItem {
  id: string;
  type: "affirmation" | "gratitude" | "visualization" | "breath";
  title: string;
  content: string;
  trimester: (1 | 2 | 3)[];
  emoji: string;
}

export const yogaPoses: YogaPose[] = [
  {
    id: "cat_cow",
    name: "Cat-Cow Stretch",
    sanskritName: "Marjaryasana-Bitilasana",
    trimester: [1, 2, 3],
    duration: "5 minutes",
    benefits: [
      "Relieves back pain and stiffness",
      "Improves spinal flexibility",
      "Calms the nervous system",
      "Encourages optimal fetal positioning",
    ],
    instructions: [
      "Come on all fours — wrists under shoulders, knees under hips",
      "Inhale: drop belly, lift chest and tailbone (Cow)",
      "Exhale: round spine, tuck chin and tailbone (Cat)",
      "Move slowly and synchronise with breath",
      "Repeat 10–15 times, rest in Child's Pose after",
    ],
    emoji: "🐄",
  },
  {
    id: "butterfly",
    name: "Butterfly Pose",
    sanskritName: "Baddha Konasana",
    trimester: [1, 2, 3],
    duration: "3–5 minutes",
    benefits: [
      "Opens hips and inner thighs",
      "Improves blood circulation to pelvis",
      "Eases leg cramps and sciatica",
      "Prepares body for labour",
    ],
    instructions: [
      "Sit on a folded blanket for support",
      "Bring soles of feet together, let knees drop outward",
      "Hold ankles; sit tall and breathe deeply",
      "Gently flap knees like butterfly wings (optional)",
      "Stay for 3–5 minutes with eyes closed",
    ],
    emoji: "🦋",
  },
  {
    id: "warrior2",
    name: "Warrior II",
    sanskritName: "Virabhadrasana II",
    trimester: [1, 2],
    duration: "30–45 seconds each side",
    benefits: [
      "Builds strength in legs and core",
      "Increases stamina and endurance",
      "Boosts confidence and inner power",
      "Improves hip flexibility",
    ],
    instructions: [
      "Stand with feet wide apart (3–4 feet)",
      "Turn right foot out 90°, left foot slightly in",
      "Bend right knee over ankle; extend arms to sides",
      "Gaze over right hand; breathe steadily",
      "Hold 30–45 seconds; switch sides",
    ],
    caution: "Avoid in third trimester if balance is difficult. Use a chair for support.",
    emoji: "⚔️",
  },
  {
    id: "triangle",
    name: "Triangle Pose",
    sanskritName: "Trikonasana",
    trimester: [1, 2],
    duration: "30 seconds each side",
    benefits: [
      "Stretches side body and spine",
      "Reduces hip and back pain",
      "Improves digestion",
      "Strengthens legs",
    ],
    instructions: [
      "Stand with feet wide (3 feet apart)",
      "Extend right arm down toward right shin (not floor)",
      "Extend left arm upward, gaze at left hand",
      "Keep core engaged and chest open",
      "Hold 30 seconds, switch sides",
    ],
    caution: "Use a block or chair instead of reaching the floor.",
    emoji: "📐",
  },
  {
    id: "supported_squat",
    name: "Supported Squat",
    sanskritName: "Malasana (supported)",
    trimester: [2, 3],
    duration: "1–3 minutes",
    benefits: [
      "Opens pelvis for birth preparation",
      "Strengthens thighs and pelvic floor",
      "Relieves pelvic pressure",
      "Encourages baby to descend in late pregnancy",
    ],
    instructions: [
      "Place a rolled blanket or yoga block under heels for support",
      "Squat with feet hip-width or wider",
      "Bring palms together at chest; use elbows to gently push knees apart",
      "Keep spine tall; breathe deeply",
      "Rise slowly using a wall or chair for support",
    ],
    emoji: "🪑",
  },
  {
    id: "legs_up_wall",
    name: "Legs Up the Wall",
    sanskritName: "Viparita Karani",
    trimester: [1, 2],
    duration: "5–10 minutes",
    benefits: [
      "Relieves swollen ankles and varicose veins",
      "Calms the nervous system",
      "Reduces fatigue and headaches",
      "Improves circulation",
    ],
    instructions: [
      "Sit sideways against a wall, then swing legs up",
      "Place folded blanket under hips for comfort",
      "Arms rest at sides, palms up",
      "Close eyes; breathe deeply and slowly",
      "Stay 5–10 minutes, then roll to one side before sitting up",
    ],
    caution: "Avoid after 30 weeks if it feels uncomfortable. Try a 45° incline instead.",
    emoji: "🦵",
  },
  {
    id: "child_pose",
    name: "Child's Pose (Wide-Knee)",
    sanskritName: "Balasana",
    trimester: [1, 2, 3],
    duration: "3–5 minutes",
    benefits: [
      "Deep rest and restoration",
      "Relieves back, neck and shoulder tension",
      "Calms anxiety and racing thoughts",
      "Gently stretches hips",
    ],
    instructions: [
      "Kneel with knees wide enough for your belly to fit between",
      "Walk hands forward, lowering chest toward the floor",
      "Rest forehead on folded hands or a bolster",
      "Breathe deeply into the back body",
      "Stay as long as you need — this is your resting pose",
    ],
    emoji: "🙇",
  },
  {
    id: "side_lying",
    name: "Side-Lying Relaxation",
    sanskritName: "Lateral Savasana",
    trimester: [2, 3],
    duration: "10–15 minutes",
    benefits: [
      "Optimal resting position in late pregnancy",
      "Improves blood flow to baby and placenta",
      "Reduces pressure on spine and organs",
      "Deeply restorative",
    ],
    instructions: [
      "Lie on your left side (improves circulation to baby)",
      "Place a pillow between knees and under belly",
      "Rest head on arm or pillow",
      "Close eyes; soften face, jaw and shoulders",
      "Breathe naturally; let your body melt into the ground",
    ],
    emoji: "😴",
  },
];

export const mantras: Mantra[] = [
  {
    id: "gayatri",
    title: "Gayatri Mantra",
    sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
    transliteration: "Om Bhur Bhuvaḥ Svaḥ, Tat Savitur Vareṇyaṃ, Bhargo Devasya Dhīmahi, Dhiyo Yo Naḥ Prachodayāt",
    meaning: "We meditate on the glory of the Creator who has created the Universe; who is worthy of worship; who is the embodiment of knowledge; who is the remover of all ignorance — may He enlighten our intellect.",
    purpose: "Universal wisdom, positive vibrations for the baby's developing mind",
    timing: "Morning, after sunrise",
    trimester: [1, 2, 3],
  },
  {
    id: "garbha_raksha",
    title: "Garbha Raksha Mantra",
    sanskrit: "ॐ विष्णवे नमः। ॐ नमो भगवते वासुदेवाय।",
    transliteration: "Om Vishnave Namaḥ. Om Namo Bhagavate Vasudevaya.",
    meaning: "Salutations to Lord Vishnu, the protector. Salutations to Lord Vasudeva.",
    purpose: "Protection of the womb and safe pregnancy",
    timing: "Any time, especially before sleep",
    trimester: [1, 2, 3],
  },
  {
    id: "santana_gopala",
    title: "Santana Gopala Mantra",
    sanskrit: "ॐ श्रीं ह्रीं क्लीं ग्लौं देवकीसुत गोविन्द वासुदेव जगत्पते देहि मे तनयं कृष्ण त्वामहं शरणं गतः",
    transliteration: "Om Shreem Hreem Kleem Glaum Devakisuta Govinda Vasudeva Jagat Pate, Dehi Me Tanayam Krishna Tvaamaham Sharanam Gatah",
    meaning: "O Krishna, son of Devaki, Lord of the universe, I surrender to you — please bless me with a healthy, noble child.",
    purpose: "For the blessing of a healthy child and safe delivery",
    timing: "Morning and evening, 11 or 108 times",
    trimester: [1, 2, 3],
  },
  {
    id: "mahamrityunjaya",
    title: "Mahamrityunjaya Mantra",
    sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्",
    transliteration: "Om Tryambakam Yajaamahe Sugandhim Pushti-Vardhanam, Urvarukamiva Bandhanaan Mrityor Mukshiya Maamritaat",
    meaning: "We worship the three-eyed Lord Shiva who is fragrant and nourishes all beings. May He free us from the bondage of death, like a ripe cucumber falling from its vine, and grant immortality.",
    purpose: "Health, healing, protection from harm and difficult labour",
    timing: "Daily, any time. Especially powerful on Mondays.",
    trimester: [1, 2, 3],
  },
  {
    id: "saraswati",
    title: "Saraswati Mantra",
    sanskrit: "ॐ ऐं सरस्वत्यै नमः",
    transliteration: "Om Aim Saraswatyai Namah",
    meaning: "Salutations to Goddess Saraswati, the bestower of knowledge, intelligence and the arts.",
    purpose: "For baby's intelligence, creativity and communication skills",
    timing: "Morning, during second trimester when neural development peaks",
    trimester: [2, 3],
  },
  {
    id: "lakshmi",
    title: "Lakshmi Mantra",
    sanskrit: "ॐ श्रीं महालक्ष्म्यै नमः",
    transliteration: "Om Shreem Mahalakshmyai Namah",
    meaning: "Salutations to Goddess Mahalakshmi, the bestower of abundance, prosperity and wellbeing.",
    purpose: "For prosperity, health and abundance throughout pregnancy",
    timing: "Friday mornings",
    trimester: [1, 2, 3],
  },
];

export const garbhasanskarActivities: GarbhasanskarActivity[] = [
  {
    id: "classical_music",
    category: "music",
    title: "Classical Indian Music",
    description: "Babies can hear sounds from week 18. Play Ragas — Yaman, Bhairavi, or Bhimpalasi — which are scientifically linked to calm, focus and positive emotions.",
    duration: "20–30 min/day",
    trimester: [2, 3],
    tip: "Play softly (50–60 dB) — the same volume as a quiet conversation. Baby responds best to low-frequency sounds.",
    emoji: "🎵",
  },
  {
    id: "vedic_chants",
    category: "music",
    title: "Vedic Chants & Bhajans",
    description: "Sanskrit shlokas create healing vibrations. The sound 'Om' produces calming alpha waves. Try Vishnu Sahasranama or Hanuman Chalisa chanted softly.",
    duration: "15–20 min/day",
    trimester: [1, 2, 3],
    tip: "Your voice is the most familiar to your baby. Sing or chant yourself — even humming works beautifully.",
    emoji: "🕉️",
  },
  {
    id: "story_telling",
    category: "reading",
    title: "Storytelling to Baby",
    description: "Read or narrate stories from Ramayana, Mahabharata, Panchatantra, or modern positive children's books. Abhimanyu learned the Chakravyuha formation in the womb!",
    duration: "10–15 min/day",
    trimester: [2, 3],
    tip: "Gently place hands on belly as you read. Baby recognises your voice pattern and responds with movement.",
    emoji: "📖",
  },
  {
    id: "poetry_reading",
    category: "reading",
    title: "Poetry & Literature",
    description: "Reading poetry with rhythm exposes your baby to language patterns. Try Kabir dohas, Mirabai bhajans, or simply read poetry you love.",
    duration: "10 min/day",
    trimester: [1, 2, 3],
    tip: "The rhythmic pattern of poetry is especially soothing — both for you and your baby.",
    emoji: "📜",
  },
  {
    id: "guided_meditation",
    category: "meditation",
    title: "Pregnancy Meditation",
    description: "A simple 10-minute visualisation: imagine a warm, golden light surrounding your baby. Breathe love in, breathe worries out. Research shows this reduces stress hormones that reach the baby.",
    duration: "10–15 min/day",
    trimester: [1, 2, 3],
    tip: "Best done after yoga in the morning, or before sleep. Keep hands resting on your belly throughout.",
    emoji: "🧘",
  },
  {
    id: "baby_talk",
    category: "communication",
    title: "Talk to Your Baby",
    description: "Narrate your day, share your feelings, call baby by name. Babies exposed to more speech in the womb show better language development at 12 months.",
    duration: "Throughout the day",
    trimester: [2, 3],
    tip: "Both mom AND dad should talk to the baby. Babies recognise their father's voice at birth.",
    emoji: "💬",
  },
  {
    id: "nature_walk",
    category: "nature",
    title: "Nature & Sunlight Walk",
    description: "A 20-minute morning walk in nature exposes you to sunlight (vitamin D), fresh air and natural sounds — birds, water, breeze — all calming for the nervous system.",
    duration: "20–30 min/day",
    trimester: [1, 2, 3],
    tip: "Morning sunlight (before 10am) regulates circadian rhythm and supports your mood through serotonin production.",
    emoji: "🌳",
  },
  {
    id: "art_creativity",
    category: "art",
    title: "Creative Expression",
    description: "Draw, paint, cook something new, arrange flowers, or journal. Engaging in creative activity floods the brain with dopamine and serotonin — chemicals that cross the placenta.",
    duration: "30 min, 3x per week",
    trimester: [1, 2, 3],
    tip: "Don't worry about the result — the joy of creating is what matters. Even colouring books count!",
    emoji: "🎨",
  },
  {
    id: "belly_massage",
    category: "communication",
    title: "Belly Massage & Touch",
    description: "Gently massage your belly in circular motions with warm coconut or sesame oil. Babies respond to touch from as early as week 8 (though you feel it later).",
    duration: "5–10 min/day",
    trimester: [2, 3],
    tip: "Do this at the same time each day — baby will begin to anticipate and respond. Dad can participate too!",
    emoji: "🤲",
  },
  {
    id: "laugh_therapy",
    category: "art",
    title: "Laughter & Lightness",
    description: "Watch comedies, share jokes, spend time with joyful people. Laughter releases endorphins and reduces cortisol — your baby thrives in a happy hormonal environment.",
    duration: "As much as possible!",
    trimester: [1, 2, 3],
    tip: "Avoid negative news, stressful TV shows and toxic conversations during pregnancy. Protect your peace.",
    emoji: "😂",
  },
];

export const positivityItems: PositivityItem[] = [
  {
    id: "aff_body_trust",
    type: "affirmation",
    title: "Trust Your Body",
    content: "My body is wise and knows exactly how to grow and nourish my baby. I trust in the incredible intelligence of my body. Millions of women have done this before me, and I am strong enough.",
    trimester: [1, 2, 3],
    emoji: "💪",
  },
  {
    id: "aff_love",
    type: "affirmation",
    title: "Boundless Love",
    content: "I am already deeply connected to my baby. Every heartbeat, every breath, every thought filled with love is a gift to my child. The bond between us grows stronger each day.",
    trimester: [1, 2, 3],
    emoji: "❤️",
  },
  {
    id: "aff_calm",
    type: "affirmation",
    title: "Peace in the Present",
    content: "Right now, in this moment, my baby is safe and loved. I release worry and choose peace. Each breath I take brings calm to both of us. I am enough, exactly as I am.",
    trimester: [1, 2, 3],
    emoji: "🕊️",
  },
  {
    id: "aff_strength",
    type: "affirmation",
    title: "Inner Strength",
    content: "I am growing a human being. This is one of the most powerful things a person can do. I am strong, I am capable, I am resilient. Every challenge I face makes me a wiser, more compassionate mother.",
    trimester: [2, 3],
    emoji: "🌟",
  },
  {
    id: "aff_birth",
    type: "affirmation",
    title: "Birth Confidence",
    content: "My body was designed for this. I surrender to the process of birth with trust and courage. I breathe through each surge, knowing my baby and I are working together. I welcome my baby earthside with joy.",
    trimester: [3],
    emoji: "🌸",
  },
  {
    id: "grat_journey",
    type: "gratitude",
    title: "Gratitude for This Moment",
    content: "Today, take 5 minutes to write down:\n1. Three things about this pregnancy that you're grateful for\n2. One thing your body did today that amazed you\n3. One message of love to your baby",
    trimester: [1, 2, 3],
    emoji: "📓",
  },
  {
    id: "grat_support",
    type: "gratitude",
    title: "Gratitude for Support",
    content: "Think of the people who love and support you. Your partner, family, friends, doctors. Silently or out loud, thank each person. Let yourself feel held by this web of love. You don't do this alone.",
    trimester: [1, 2, 3],
    emoji: "🤝",
  },
  {
    id: "vis_birth",
    type: "visualization",
    title: "Golden Birth Visualisation",
    content: "Close your eyes. Breathe deeply. Imagine your birthing room filled with warm golden light. See yourself calm, strong and surrounded by loving support. Imagine your baby being placed on your chest — the warmth, the weight, the overwhelming love. Hold that feeling in your heart. Breathe it in.",
    trimester: [3],
    emoji: "✨",
  },
  {
    id: "vis_womb",
    type: "visualization",
    title: "Safe Haven Visualisation",
    content: "Close your eyes. Imagine your womb as a warm, luminous ocean of light — perfectly safe, perfectly nourishing. See your baby floating peacefully, fully loved, completely protected. Breathe love in. Breathe trust out. Your baby is safe in you.",
    trimester: [1, 2, 3],
    emoji: "🌊",
  },
  {
    id: "breath_478",
    type: "breath",
    title: "4-7-8 Calming Breath",
    content: "This powerful breathing technique calms the nervous system within minutes:\n\n1. Inhale quietly through your nose for 4 counts\n2. Hold your breath for 7 counts\n3. Exhale completely through your mouth for 8 counts\n\nRepeat 4 times. Use this when feeling anxious, before sleep, or during difficult moments.",
    trimester: [1, 2, 3],
    emoji: "🌬️",
  },
  {
    id: "breath_ocean",
    type: "breath",
    title: "Ocean Breath (Ujjayi)",
    content: "This yogic breath activates the parasympathetic nervous system:\n\n1. Breathe in through your nose, filling lungs completely (3–4 counts)\n2. Constrict the back of your throat slightly as you breathe — make a gentle ocean sound\n3. Breathe out through your nose with the same sound (5–6 counts)\n\nPractise for 5 minutes daily. Especially helpful during labour contractions.",
    trimester: [2, 3],
    emoji: "🌊",
  },
];

export function getYogaForTrimester(trimester: 1 | 2 | 3): YogaPose[] {
  return yogaPoses.filter((p) => p.trimester.includes(trimester));
}

export function getMantrasForTrimester(trimester: 1 | 2 | 3): Mantra[] {
  return mantras.filter((m) => m.trimester.includes(trimester));
}

export function getGarbhasanskarForTrimester(trimester: 1 | 2 | 3): GarbhasanskarActivity[] {
  return garbhasanskarActivities.filter((a) => a.trimester.includes(trimester));
}

export function getPositivityForTrimester(trimester: 1 | 2 | 3): PositivityItem[] {
  return positivityItems.filter((p) => p.trimester.includes(trimester));
}

export function getTrimesterFromWeek(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
}
