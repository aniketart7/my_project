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
  sanskrit?: string;
  transliteration?: string;
  meaning: string;
  purpose: string;
  timing: string;
  trimester: (1 | 2 | 3)[];
  playUrl: string;
  spotifyUrl?: string;
  region: "india" | "western" | "islamic" | "eastasian" | "universal";
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
  playUrl?: string;
  spotifyUrl?: string;
  region: "india" | "western" | "islamic" | "eastasian" | "universal";
}

export interface PositivityItem {
  id: string;
  type: "affirmation" | "gratitude" | "visualization" | "breath";
  title: string;
  content: string;
  trimester: (1 | 2 | 3)[];
  emoji: string;
  region: "india" | "western" | "islamic" | "eastasian" | "universal";
}

// ──────────────────────────────────────────────
// YOGA POSES (universal — shared across regions)
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// MANTRAS — INDIAN (default)
// ──────────────────────────────────────────────
export const mantras: Mantra[] = [
  {
    id: "gayatri",
    title: "Gayatri Mantra",
    sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
    transliteration: "Om Bhur Bhuvaḥ Svaḥ, Tat Savitur Vareṇyaṃ, Bhargo Devasya Dhīmahi, Dhiyo Yo Naḥ Prachodayāt",
    meaning: "We meditate on the glory of the Creator who has created the Universe; who is worthy of worship; who is the embodiment of knowledge; who is the remover of all ignorance — may He enlighten our intellect.",
    purpose: "Universal wisdom, positive vibrations for the baby's developing mind",
    timing: "Morning, after sunrise · 108 repetitions",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=gayatri+mantra+108+times+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/gayatri%20mantra%20108%20times",
    region: "india",
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
    playUrl: "https://www.youtube.com/results?search_query=garbha+raksha+mantra+vishnu+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/garbha%20raksha%20mantra",
    region: "india",
  },
  {
    id: "santana_gopala",
    title: "Santana Gopala Mantra",
    sanskrit: "ॐ श्रीं ह्रीं क्लीं ग्लौं देवकीसुत गोविन्द वासुदेव जगत्पते देहि मे तनयं कृष्ण त्वामहं शरणं गतः",
    transliteration: "Om Shreem Hreem Kleem Glaum Devakisuta Govinda Vasudeva Jagat Pate, Dehi Me Tanayam Krishna Tvaamaham Sharanam Gatah",
    meaning: "O Krishna, son of Devaki, Lord of the universe, I surrender to you — please bless me with a healthy, noble child.",
    purpose: "For the blessing of a healthy child and safe delivery",
    timing: "Morning and evening · 11 or 108 times",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=santana+gopala+mantra+108+times+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/santana%20gopala%20mantra",
    region: "india",
  },
  {
    id: "mahamrityunjaya",
    title: "Mahamrityunjaya Mantra",
    sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्",
    transliteration: "Om Tryambakam Yajaamahe Sugandhim Pushti-Vardhanam, Urvarukamiva Bandhanaan Mrityor Mukshiya Maamritaat",
    meaning: "We worship the three-eyed Lord Shiva who is fragrant and nourishes all beings. May He free us from the bondage of death, like a ripe cucumber falling from its vine, and grant immortality.",
    purpose: "Health, healing, protection from harm and difficult labour",
    timing: "Daily, any time · Especially powerful on Mondays",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=mahamrityunjaya+mantra+108+times+pregnancy+powerful",
    spotifyUrl: "https://open.spotify.com/search/mahamrityunjaya%20mantra%20108%20times",
    region: "india",
  },
  {
    id: "saraswati",
    title: "Saraswati Mantra",
    sanskrit: "ॐ ऐं सरस्वत्यै नमः",
    transliteration: "Om Aim Saraswatyai Namah",
    meaning: "Salutations to Goddess Saraswati, the bestower of knowledge, intelligence and the arts.",
    purpose: "For baby's intelligence, creativity and communication skills",
    timing: "Morning · During second trimester when neural development peaks",
    trimester: [2, 3],
    playUrl: "https://www.youtube.com/results?search_query=saraswati+mantra+om+aim+108+times",
    spotifyUrl: "https://open.spotify.com/search/saraswati%20mantra%20om%20aim",
    region: "india",
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
    playUrl: "https://www.youtube.com/results?search_query=om+shreem+mahalakshmyai+namah+mantra+108",
    spotifyUrl: "https://open.spotify.com/search/om%20shreem%20mahalakshmyai%20namah",
    region: "india",
  },

  // ── ISLAMIC REGION ──
  {
    id: "surah_maryam",
    title: "Surah Maryam (Chapter 19)",
    meaning: "The chapter of the Quran dedicated to Mary, mother of Isa (Jesus). It narrates the story of pregnancy, faith and divine care — profoundly meaningful for expectant mothers.",
    purpose: "Blessings for a healthy pregnancy and delivery, modelled on the story of Maryam",
    timing: "After Fajr or before sleep · Daily recitation",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=surah+maryam+beautiful+recitation+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/surah%20maryam%20recitation",
    region: "islamic",
  },
  {
    id: "surah_luqman",
    title: "Surah Luqman (Chapter 31)",
    meaning: "Contains the wisdom of Luqman to his son — a blueprint for raising a righteous child with faith, gratitude and integrity.",
    purpose: "For baby's character development, wisdom and righteous upbringing",
    timing: "Evening · Regular recitation throughout pregnancy",
    trimester: [2, 3],
    playUrl: "https://www.youtube.com/results?search_query=surah+luqman+beautiful+recitation+tilawat",
    spotifyUrl: "https://open.spotify.com/search/surah%20luqman%20recitation",
    region: "islamic",
  },
  {
    id: "ayat_ul_kursi",
    title: "Ayat ul Kursi",
    meaning: "The verse of the Throne — the most powerful verse in the Quran for protection. 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence...'",
    purpose: "Protection of mother and child from all harm",
    timing: "Morning and evening · Before sleep",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=ayat+ul+kursi+beautiful+recitation+protection",
    spotifyUrl: "https://open.spotify.com/search/ayat%20ul%20kursi%20recitation",
    region: "islamic",
  },

  // ── WESTERN / UNIVERSAL ──
  {
    id: "universal_om",
    title: "Om Meditation",
    meaning: "The primordial sound 'Om' is universal — found in Hindu, Buddhist and yogic traditions. Scientific studies show that chanting Om reduces activity in the amygdala, creating deep calm.",
    purpose: "Deep calm, nervous system regulation, peaceful environment for baby",
    timing: "Morning and evening · 5–10 minutes",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=om+chanting+1+hour+meditation+deep",
    spotifyUrl: "https://open.spotify.com/search/om%20chanting%20meditation%201%20hour",
    region: "universal",
  },
  {
    id: "christian_prayer",
    title: "Gregorian Chant",
    meaning: "Ancient Christian monophonic chant from medieval Europe. Research shows Gregorian chant slows heart rate, reduces anxiety, and creates meditative calm — beneficial for both mother and baby.",
    purpose: "Spiritual peace, calm nervous system, historical connection to divine",
    timing: "Any time of day, especially during rest",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=gregorian+chant+meditation+peaceful+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/gregorian%20chant%20peaceful%20meditation",
    region: "western",
  },

  // ── EAST ASIAN ──
  {
    id: "buddhist_heart_sutra",
    title: "Heart Sutra (般若心經)",
    meaning: "One of the most beloved Buddhist sutras, chanted for over 2,000 years. Its syllables create calming vibrations associated with compassion, wisdom and letting go of fear.",
    purpose: "Compassion for self and baby, release of pregnancy anxiety, inner peace",
    timing: "Morning meditation · 5–10 minutes",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=heart+sutra+chanting+buddhist+meditation+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/heart%20sutra%20chanting%20buddhist",
    region: "eastasian",
  },
  {
    id: "buddhist_om_mani",
    title: "Om Mani Padme Hum",
    meaning: "The mantra of Avalokiteśvara, the Bodhisattva of compassion. Translates as 'the jewel in the lotus' — a symbol of purity arising from the waters of life.",
    purpose: "Compassion, love and peaceful energy for mother and child",
    timing: "Any time · Especially during baby movement sessions",
    trimester: [1, 2, 3],
    playUrl: "https://www.youtube.com/results?search_query=om+mani+padme+hum+108+times+tibetan+chant",
    spotifyUrl: "https://open.spotify.com/search/om%20mani%20padme%20hum%20tibetan",
    region: "eastasian",
  },
];

// ──────────────────────────────────────────────
// GARBHASANSKAR / ENRICHMENT ACTIVITIES
// ──────────────────────────────────────────────
export const garbhasanskarActivities: GarbhasanskarActivity[] = [
  // ── INDIAN ──
  {
    id: "classical_music",
    category: "music",
    title: "Classical Indian Ragas",
    description: "Babies can hear sounds from week 18. Play Ragas — Yaman, Bhairavi, or Bhimpalasi — which are scientifically linked to calm, focus and positive emotions.",
    duration: "20–30 min/day",
    trimester: [2, 3],
    tip: "Play softly (50–60 dB) — the same volume as a quiet conversation. Baby responds best to low-frequency sounds.",
    emoji: "🎵",
    playUrl: "https://www.youtube.com/results?search_query=raga+yaman+bhairavi+for+pregnancy+baby+in+womb",
    spotifyUrl: "https://open.spotify.com/search/raga%20yaman%20classical%20indian",
    region: "india",
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
    playUrl: "https://www.youtube.com/results?search_query=vishnu+sahasranama+garbhasanskar+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/vishnu%20sahasranama%20garbhasanskar",
    region: "india",
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
    playUrl: "https://www.youtube.com/results?search_query=ramayan+stories+for+baby+in+womb+garbhasanskar",
    region: "india",
  },
  {
    id: "poetry_reading",
    category: "reading",
    title: "Indian Poetry & Bhajans",
    description: "Reading poetry with rhythm exposes your baby to language patterns. Try Kabir dohas, Mirabai bhajans, or Tukaram abhangas.",
    duration: "10 min/day",
    trimester: [1, 2, 3],
    tip: "The rhythmic pattern of poetry is especially soothing — both for you and your baby.",
    emoji: "📜",
    playUrl: "https://www.youtube.com/results?search_query=mirabai+bhajan+kabir+doha+beautiful+for+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/mirabai%20bhajan%20kabir%20doha",
    region: "india",
  },

  // ── UNIVERSAL / SHARED ──
  {
    id: "guided_meditation",
    category: "meditation",
    title: "Pregnancy Guided Meditation",
    description: "A simple 10-minute visualisation: imagine a warm, golden light surrounding your baby. Breathe love in, breathe worries out. Research shows this reduces stress hormones.",
    duration: "10–15 min/day",
    trimester: [1, 2, 3],
    tip: "Best done after yoga in the morning, or before sleep. Keep hands resting on your belly throughout.",
    emoji: "🧘",
    playUrl: "https://www.youtube.com/results?search_query=pregnancy+guided+meditation+golden+light+baby",
    spotifyUrl: "https://open.spotify.com/search/pregnancy%20guided%20meditation",
    region: "universal",
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
    region: "universal",
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
    playUrl: "https://www.youtube.com/results?search_query=nature+sounds+birds+rain+for+pregnancy+baby",
    region: "universal",
  },
  {
    id: "art_creativity",
    category: "art",
    title: "Creative Expression",
    description: "Draw, paint, cook something new, arrange flowers, or journal. Engaging in creative activity floods the brain with dopamine and serotonin — chemicals that cross the placenta.",
    duration: "30 min · 3x per week",
    trimester: [1, 2, 3],
    tip: "Don't worry about the result — the joy of creating is what matters. Even colouring books count!",
    emoji: "🎨",
    region: "universal",
  },
  {
    id: "belly_massage",
    category: "communication",
    title: "Belly Massage & Touch",
    description: "Gently massage your belly in circular motions with warm coconut or sesame oil. Babies respond to touch from as early as week 8.",
    duration: "5–10 min/day",
    trimester: [2, 3],
    tip: "Do this at the same time each day — baby will begin to anticipate and respond. Dad can participate too!",
    emoji: "🤲",
    region: "universal",
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
    region: "universal",
  },

  // ── WESTERN ──
  {
    id: "mozart_effect",
    category: "music",
    title: "Classical Western Music",
    description: "The 'Mozart Effect' — studies show classical music stimulates neural pathway development. Mozart, Bach and Vivaldi create complex, ordered sound patterns beneficial for developing minds.",
    duration: "20–30 min/day",
    trimester: [2, 3],
    tip: "Keep volume low (below 65 dB). Choose slower, calmer movements like Adagio rather than loud orchestral pieces.",
    emoji: "🎻",
    playUrl: "https://www.youtube.com/results?search_query=mozart+classical+music+for+baby+brain+development+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/mozart%20for%20pregnancy%20baby%20brain",
    region: "western",
  },
  {
    id: "lullabies_western",
    category: "music",
    title: "Classic Lullabies",
    description: "Lullabies like Brahms' Lullaby, Twinkle Twinkle and You Are My Sunshine have soothed babies for centuries. Babies born to mothers who sang to them recognise these songs after birth.",
    duration: "15–20 min/day",
    trimester: [2, 3],
    tip: "Sing yourself — your voice is more powerful than any recording. Your baby already knows your voice better than any other.",
    emoji: "🌙",
    playUrl: "https://www.youtube.com/results?search_query=classic+lullabies+baby+in+womb+brahms+twinkle",
    spotifyUrl: "https://open.spotify.com/search/classic%20lullabies%20baby",
    region: "western",
  },
  {
    id: "mindfulness_audio",
    category: "meditation",
    title: "Mindfulness Meditation",
    description: "Evidence-based mindfulness has been shown to reduce pregnancy anxiety by 40%, improve sleep, and lead to higher birth weight babies. Even 10 minutes daily makes a measurable difference.",
    duration: "10–20 min/day",
    trimester: [1, 2, 3],
    tip: "Try a body scan meditation before sleep — mentally relaxing each body part from toes to head. Your body will thank you.",
    emoji: "🌀",
    playUrl: "https://www.youtube.com/results?search_query=mindfulness+meditation+pregnancy+anxiety+calm",
    spotifyUrl: "https://open.spotify.com/search/mindfulness%20meditation%20pregnancy",
    region: "western",
  },
  {
    id: "positive_podcasts",
    category: "reading",
    title: "Positive Birth Stories & Podcasts",
    description: "Listening to positive birth experiences rewires your fear response and builds confidence for labour. Seek out uplifting, empowering birth stories from diverse voices.",
    duration: "30–60 min, a few times a week",
    trimester: [2, 3],
    tip: "Avoid scary or traumatic birth stories — they increase anxiety without benefit. Choose deliberately joyful narratives.",
    emoji: "🎙️",
    playUrl: "https://www.youtube.com/results?search_query=positive+birth+stories+podcast+hypnobirthing",
    region: "western",
  },

  // ── ISLAMIC ──
  {
    id: "quran_recitation",
    category: "music",
    title: "Quran Recitation for Baby",
    description: "Surah Maryam, Surah Luqman, Surah Al-Fatiha and Surah Ikhlas are traditionally recited during pregnancy. The melodious recitation creates deep calm and spiritual connection.",
    duration: "20–30 min/day",
    trimester: [1, 2, 3],
    tip: "Play softly or recite yourself. Babies born to mothers who recited Quran regularly show recognition of familiar verses shortly after birth.",
    emoji: "📿",
    playUrl: "https://www.youtube.com/results?search_query=quran+recitation+baby+surah+maryam+luqman+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/quran%20recitation%20surah%20maryam",
    region: "islamic",
  },
  {
    id: "islamic_nasheeds",
    category: "music",
    title: "Islamic Nasheeds & Lullabies",
    description: "Beautiful Islamic vocal music (nasheeds) without musical instruments — Tala' al-Badru Alayna and traditional lullabies from across the Muslim world create a serene atmosphere.",
    duration: "15–20 min/day",
    trimester: [2, 3],
    tip: "Lullabies in your mother tongue — Arabic, Urdu, Malay — are especially comforting. Your baby will recognise the language you speak.",
    emoji: "🌙",
    playUrl: "https://www.youtube.com/results?search_query=islamic+nasheed+lullaby+baby+tala+al+badru",
    region: "islamic",
  },
  {
    id: "dhikr_meditation",
    category: "meditation",
    title: "Dhikr & Contemplation",
    description: "SubhanAllah (Glory to Allah), Alhamdulillah (Praise be to Allah), Allahu Akbar — these repeated remembrances slow the breath, calm the heart and bring mindful presence.",
    duration: "10–15 min/day",
    trimester: [1, 2, 3],
    tip: "Use a misbaha (prayer beads) to count 33 repetitions each. This creates a meditative rhythm similar to breathing exercises.",
    emoji: "🙏",
    playUrl: "https://www.youtube.com/results?search_query=dhikr+meditation+subhanallah+alhamdulillah+peaceful",
    region: "islamic",
  },

  // ── EAST ASIAN ──
  {
    id: "buddhist_music",
    category: "music",
    title: "Buddhist Meditation Music",
    description: "Tibetan singing bowls, Japanese shakuhachi flute and temple bells create healing frequencies (particularly 432 Hz and 528 Hz) associated with cellular healing and calm.",
    duration: "20–30 min/day",
    trimester: [1, 2, 3],
    tip: "Tibetan singing bowl frequencies have been shown to reduce heart rate and cortisol — ideal for late evening use.",
    emoji: "🔔",
    playUrl: "https://www.youtube.com/results?search_query=tibetan+singing+bowl+meditation+pregnancy+baby",
    spotifyUrl: "https://open.spotify.com/search/tibetan%20singing%20bowl%20meditation",
    region: "eastasian",
  },
  {
    id: "japanese_koto",
    category: "music",
    title: "Japanese Koto & Classical Asian Music",
    description: "Koto, guqin (Chinese zither) and Korean gayageum music has been used for centuries to create calm and harmony. Complex yet gentle — perfect for fetal music stimulation.",
    duration: "20–30 min/day",
    trimester: [2, 3],
    tip: "The gentle plucking sounds of koto and guqin are particularly well-received by babies in the womb due to their mid-range frequency.",
    emoji: "🎋",
    playUrl: "https://www.youtube.com/results?search_query=japanese+koto+music+peaceful+meditation+pregnancy",
    spotifyUrl: "https://open.spotify.com/search/japanese%20koto%20music%20peaceful",
    region: "eastasian",
  },
  {
    id: "zen_reading",
    category: "meditation",
    title: "Zen & Mindfulness Practice",
    description: "Japanese Zazen, mindful breathing and simple walking meditation are supported by extensive scientific evidence showing reductions in cortisol, improved sleep and better birth outcomes.",
    duration: "10–20 min/day",
    trimester: [1, 2, 3],
    tip: "Even 5 minutes of mindful breathing with focused attention changes your neurochemistry. Consistency matters more than duration.",
    emoji: "⛩️",
    playUrl: "https://www.youtube.com/results?search_query=zen+meditation+pregnancy+mindful+breathing+japanese",
    region: "eastasian",
  },
];

// ──────────────────────────────────────────────
// POSITIVITY ITEMS
// ──────────────────────────────────────────────
export const positivityItems: PositivityItem[] = [
  {
    id: "aff_body_trust",
    type: "affirmation",
    title: "Trust Your Body",
    content: "My body is wise and knows exactly how to grow and nourish my baby. I trust in the incredible intelligence of my body. Millions of women have done this before me, and I am strong enough.",
    trimester: [1, 2, 3],
    emoji: "💪",
    region: "universal",
  },
  {
    id: "aff_love",
    type: "affirmation",
    title: "Boundless Love",
    content: "I am already deeply connected to my baby. Every heartbeat, every breath, every thought filled with love is a gift to my child. The bond between us grows stronger each day.",
    trimester: [1, 2, 3],
    emoji: "❤️",
    region: "universal",
  },
  {
    id: "aff_calm",
    type: "affirmation",
    title: "Peace in the Present",
    content: "Right now, in this moment, my baby is safe and loved. I release worry and choose peace. Each breath I take brings calm to both of us. I am enough, exactly as I am.",
    trimester: [1, 2, 3],
    emoji: "🕊️",
    region: "universal",
  },
  {
    id: "aff_strength",
    type: "affirmation",
    title: "Inner Strength",
    content: "I am growing a human being. This is one of the most powerful things a person can do. I am strong, I am capable, I am resilient. Every challenge I face makes me a wiser, more compassionate mother.",
    trimester: [2, 3],
    emoji: "🌟",
    region: "universal",
  },
  {
    id: "aff_birth",
    type: "affirmation",
    title: "Birth Confidence",
    content: "My body was designed for this. I surrender to the process of birth with trust and courage. I breathe through each surge, knowing my baby and I are working together. I welcome my baby earthside with joy.",
    trimester: [3],
    emoji: "🌸",
    region: "universal",
  },
  {
    id: "grat_journey",
    type: "gratitude",
    title: "Gratitude for This Moment",
    content: "Today, take 5 minutes to write down:\n1. Three things about this pregnancy that you're grateful for\n2. One thing your body did today that amazed you\n3. One message of love to your baby",
    trimester: [1, 2, 3],
    emoji: "📓",
    region: "universal",
  },
  {
    id: "grat_support",
    type: "gratitude",
    title: "Gratitude for Support",
    content: "Think of the people who love and support you. Your partner, family, friends, doctors. Silently or out loud, thank each person. Let yourself feel held by this web of love. You don't do this alone.",
    trimester: [1, 2, 3],
    emoji: "🤝",
    region: "universal",
  },
  {
    id: "vis_birth",
    type: "visualization",
    title: "Golden Birth Visualisation",
    content: "Close your eyes. Breathe deeply. Imagine your birthing room filled with warm golden light. See yourself calm, strong and surrounded by loving support. Imagine your baby being placed on your chest — the warmth, the weight, the overwhelming love. Hold that feeling in your heart. Breathe it in.",
    trimester: [3],
    emoji: "✨",
    region: "universal",
  },
  {
    id: "vis_womb",
    type: "visualization",
    title: "Safe Haven Visualisation",
    content: "Close your eyes. Imagine your womb as a warm, luminous ocean of light — perfectly safe, perfectly nourishing. See your baby floating peacefully, fully loved, completely protected. Breathe love in. Breathe trust out. Your baby is safe in you.",
    trimester: [1, 2, 3],
    emoji: "🌊",
    region: "universal",
  },
  {
    id: "breath_478",
    type: "breath",
    title: "4-7-8 Calming Breath",
    content: "This powerful breathing technique calms the nervous system within minutes:\n\n1. Inhale quietly through your nose for 4 counts\n2. Hold your breath for 7 counts\n3. Exhale completely through your mouth for 8 counts\n\nRepeat 4 times. Use this when feeling anxious, before sleep, or during difficult moments.",
    trimester: [1, 2, 3],
    emoji: "🌬️",
    region: "universal",
  },
  {
    id: "breath_ocean",
    type: "breath",
    title: "Ocean Breath (Ujjayi)",
    content: "This yogic breath activates the parasympathetic nervous system:\n\n1. Breathe in through your nose, filling lungs completely (3–4 counts)\n2. Constrict the back of your throat slightly as you breathe — make a gentle ocean sound\n3. Breathe out through your nose with the same sound (5–6 counts)\n\nPractise for 5 minutes daily. Especially helpful during labour contractions.",
    trimester: [2, 3],
    emoji: "🌊",
    region: "universal",
  },
  {
    id: "islamic_tawakkul",
    type: "affirmation",
    title: "Tawakkul — Trust in Allah",
    content: "Ya Allah, I place my complete trust in You. My baby is a gift and an amanah from You. You are Al-Hafiz (the Guardian), Al-Latif (the Subtle), Al-Rahman (the Most Merciful). I release my fears and rest in Your infinite care. Alhamdulillah for this blessing.",
    trimester: [1, 2, 3],
    emoji: "☪️",
    region: "islamic",
  },
  {
    id: "islamic_dua",
    type: "affirmation",
    title: "Dua for a Righteous Child",
    content: "رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاء\n\nRabbi hab li min ladunka dhurriyyatan tayyibatan innaka sami'u al-dua\n\n'My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.' (Quran 3:38)",
    trimester: [1, 2, 3],
    emoji: "🤲",
    region: "islamic",
  },
  {
    id: "eastasian_impermanence",
    type: "affirmation",
    title: "Embracing the Present Moment",
    content: "This moment — right now — is whole and complete. My baby and I are on a journey together, moment by moment. I do not need to control the future or fix the past. I breathe in this moment, and I am enough. 一期一会 (Ichi-go ichi-e): this precious moment, never to come again.",
    trimester: [1, 2, 3],
    emoji: "🌸",
    region: "eastasian",
  },
];

// ──────────────────────────────────────────────
// REGION MAPPING
// ──────────────────────────────────────────────
export type AppRegion = "india" | "western" | "islamic" | "eastasian";

export const COUNTRY_REGION_MAP: Record<string, AppRegion> = {
  India: "india",
  Pakistan: "islamic",
  Bangladesh: "islamic",
  "Sri Lanka": "india",
  Nepal: "india",
  "United Arab Emirates": "islamic",
  "Saudi Arabia": "islamic",
  Malaysia: "islamic",
  Indonesia: "islamic",
  Turkey: "islamic",
  Egypt: "islamic",
  Jordan: "islamic",
  Japan: "eastasian",
  China: "eastasian",
  "South Korea": "eastasian",
  Thailand: "eastasian",
  Vietnam: "eastasian",
  Singapore: "eastasian",
  Myanmar: "eastasian",
  "United States": "western",
  "United Kingdom": "western",
  Australia: "western",
  Canada: "western",
  "New Zealand": "western",
  Ireland: "western",
  Germany: "western",
  France: "western",
  Netherlands: "western",
  "South Africa": "western",
};

export const COUNTRIES_LIST = [
  "India",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "United Arab Emirates",
  "Saudi Arabia",
  "Malaysia",
  "Indonesia",
  "Turkey",
  "Egypt",
  "Jordan",
  "Japan",
  "China",
  "South Korea",
  "Thailand",
  "Vietnam",
  "Singapore",
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "New Zealand",
  "Germany",
  "France",
  "Netherlands",
  "South Africa",
  "Other",
];

export function getRegionForCountry(country: string): AppRegion {
  return COUNTRY_REGION_MAP[country] || "india";
}

export function getMantrasForRegion(trimester: 1 | 2 | 3, region: AppRegion): Mantra[] {
  const regionMantras = mantras.filter(
    (m) => m.trimester.includes(trimester) && (m.region === region || m.region === "universal")
  );
  if (regionMantras.length === 0) {
    return mantras.filter((m) => m.trimester.includes(trimester) && m.region === "india");
  }
  return regionMantras;
}

export function getActivitiesForRegion(
  trimester: 1 | 2 | 3,
  region: AppRegion
): GarbhasanskarActivity[] {
  return garbhasanskarActivities.filter(
    (a) => a.trimester.includes(trimester) && (a.region === region || a.region === "universal")
  );
}

export function getYogaForTrimester(trimester: 1 | 2 | 3): YogaPose[] {
  return yogaPoses.filter((p) => p.trimester.includes(trimester));
}

export function getPositivityForRegion(
  trimester: 1 | 2 | 3,
  region: AppRegion
): PositivityItem[] {
  return positivityItems.filter(
    (p) => p.trimester.includes(trimester) && (p.region === region || p.region === "universal")
  );
}

export function getTrimesterFromWeek(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
}
