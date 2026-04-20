// ─── Symptom checker rules ────────────────────────────────────────────────────
export type SymptomSeverity = "normal" | "watch" | "seek";

export interface SymptomRule {
  id: string;
  label: string;
  category: string;
  trimester: number[]; // 1,2,3 — which trimesters it applies
  severity: SymptomSeverity;
  guidance: string;
}

export const SYMPTOM_RULES: SymptomRule[] = [
  // Normal
  { id: "nausea_mild", label: "Mild nausea / morning sickness", category: "Digestion", trimester: [1], severity: "normal", guidance: "Very common in T1. Eat small frequent meals, avoid spicy/oily food, try ginger tea." },
  { id: "fatigue", label: "Fatigue / tiredness", category: "General", trimester: [1,2,3], severity: "normal", guidance: "Normal throughout pregnancy. Rest as needed and maintain a balanced diet with iron-rich foods." },
  { id: "back_mild", label: "Mild back pain", category: "Body", trimester: [2,3], severity: "normal", guidance: "Common as baby grows. Try prenatal yoga, warm compress, and avoid heavy lifting." },
  { id: "breast_tender", label: "Breast tenderness", category: "Body", trimester: [1,2], severity: "normal", guidance: "Normal hormonal change. Wear a supportive bra." },
  { id: "frequent_urination", label: "Frequent urination", category: "General", trimester: [1,2,3], severity: "normal", guidance: "Normal due to uterus pressure on bladder. Stay hydrated but reduce fluids before bed." },
  { id: "heartburn", label: "Heartburn / acid reflux", category: "Digestion", trimester: [2,3], severity: "normal", guidance: "Common as baby pushes on stomach. Eat smaller meals, sit upright for 30 min after eating." },
  { id: "leg_cramps", label: "Leg cramps at night", category: "Body", trimester: [2,3], severity: "normal", guidance: "Common in later trimesters. Stretch calves before bed, stay hydrated, and increase calcium/magnesium." },
  { id: "constipation", label: "Constipation", category: "Digestion", trimester: [1,2,3], severity: "normal", guidance: "Very common due to progesterone. Increase fiber and water intake. Gentle walks help." },
  { id: "light_spotting", label: "Light spotting (T1)", category: "Bleeding", trimester: [1], severity: "watch", guidance: "Can be implantation bleeding or cervical sensitivity. Mention at your next visit. Seek care if it increases." },
  { id: "swelling_feet", label: "Mild ankle/feet swelling", category: "Body", trimester: [3], severity: "normal", guidance: "Common in T3. Elevate feet when resting. Avoid standing for long periods. Wear comfortable shoes." },
  // Watch & wait
  { id: "headache_mild", label: "Mild headache", category: "Head", trimester: [1,2,3], severity: "watch", guidance: "Common but monitor. Stay hydrated and rest. Paracetamol is usually safe — check with your doctor. Seek care if severe or won't go away." },
  { id: "dizziness", label: "Dizziness / lightheadedness", category: "General", trimester: [1,2,3], severity: "watch", guidance: "Often from low blood pressure or low blood sugar. Sit or lie down, eat a snack, drink water. Seek care if frequent or you faint." },
  { id: "pelvic_pressure", label: "Pelvic pressure / heaviness", category: "Body", trimester: [3], severity: "watch", guidance: "Common in T3 as baby drops. Mention at your next visit. Seek care if accompanied by contractions or bleeding." },
  { id: "reduced_movement", label: "Reduced fetal movement (less than usual)", category: "Baby", trimester: [2,3], severity: "watch", guidance: "Count kicks for 2 hours. You should feel 10 movements. If not, seek care immediately." },
  { id: "vomiting_severe", label: "Severe vomiting / can't keep food down", category: "Digestion", trimester: [1], severity: "watch", guidance: "May be hyperemesis gravidarum. See your doctor if you can't keep any fluids down for 24 hours — you may need IV fluids." },
  { id: "itching_mild", label: "Itchy skin (mild)", category: "Skin", trimester: [2,3], severity: "watch", guidance: "Common as skin stretches. Use moisturiser. If intense itching is on hands/feet, seek care — could be cholestasis." },
  // Seek care immediately
  { id: "heavy_bleeding", label: "Heavy vaginal bleeding", category: "Bleeding", trimester: [1,2,3], severity: "seek", guidance: "Call your doctor or go to emergency immediately. Heavy bleeding at any stage needs urgent evaluation." },
  { id: "no_movement_2hr", label: "No fetal movement for >2 hours (Week 28+)", category: "Baby", trimester: [3], severity: "seek", guidance: "Call your doctor immediately. Go to hospital for a non-stress test (NST) and monitoring." },
  { id: "severe_headache_vision", label: "Severe headache + blurred vision", category: "Head", trimester: [2,3], severity: "seek", guidance: "Possible pre-eclampsia — a serious condition. Seek emergency care immediately. Also check for BP >140/90." },
  { id: "chest_pain", label: "Chest pain or shortness of breath (severe)", category: "Chest", trimester: [1,2,3], severity: "seek", guidance: "Could indicate pulmonary embolism or cardiac issue. Seek emergency care immediately." },
  { id: "fever_high", label: "High fever (>38°C / 100.4°F)", category: "General", trimester: [1,2,3], severity: "seek", guidance: "Fever during pregnancy can harm the baby. Contact your doctor immediately for assessment and safe treatment." },
  { id: "sudden_swelling", label: "Sudden severe swelling (face/hands/feet)", category: "Body", trimester: [2,3], severity: "seek", guidance: "Sudden severe swelling with headache or vision changes may be pre-eclampsia. Seek care immediately." },
  { id: "contraction_early", label: "Regular contractions before Week 37", category: "Labour", trimester: [2,3], severity: "seek", guidance: "Could be preterm labour. Go to hospital immediately for assessment and monitoring." },
  { id: "fluid_leaking", label: "Fluid leaking from vagina", category: "Labour", trimester: [2,3], severity: "seek", guidance: "Could be amniotic fluid (waters breaking). Go to hospital immediately." },
];

export const SYMPTOM_CATEGORIES = [...new Set(SYMPTOM_RULES.map(s => s.category))];

// ─── Exercise guide by trimester ─────────────────────────────────────────────
export interface ExerciseItem {
  name: string;
  type: "recommended" | "avoid";
  note: string;
}

export const EXERCISE_GUIDE: Record<number, ExerciseItem[]> = {
  1: [
    { name: "Brisk walking", type: "recommended", note: "30 min/day — great for circulation and energy" },
    { name: "Prenatal yoga", type: "recommended", note: "Reduces nausea, improves flexibility" },
    { name: "Swimming", type: "recommended", note: "Low-impact, relieves early back tension" },
    { name: "Light stretching", type: "recommended", note: "Especially hip flexors and lower back" },
    { name: "Heavy weightlifting", type: "avoid", note: "Puts strain on abdominal muscles" },
    { name: "High-impact sports", type: "avoid", note: "Risk of falls and abdominal trauma" },
    { name: "Hot yoga / Bikram", type: "avoid", note: "Overheating is dangerous in T1" },
    { name: "Lying flat on back >10 min", type: "avoid", note: "Can reduce blood flow after 12 weeks" },
  ],
  2: [
    { name: "Prenatal yoga", type: "recommended", note: "Excellent for back pain and bonding" },
    { name: "Swimming / water aerobics", type: "recommended", note: "Supports your growing weight" },
    { name: "Light strength training", type: "recommended", note: "Resistance bands, light dumbbells — safe with good form" },
    { name: "Stationary cycling", type: "recommended", note: "Low fall risk, good cardio" },
    { name: "Walking", type: "recommended", note: "Target 8,000 steps/day in T2" },
    { name: "Lying flat on back", type: "avoid", note: "Avoidable after Week 16 — compresses vena cava" },
    { name: "Contact sports", type: "avoid", note: "Risk of abdominal impact" },
    { name: "High altitude exercise", type: "avoid", note: "Reduced oxygen affects baby" },
  ],
  3: [
    { name: "Gentle walking", type: "recommended", note: "Target 5,000 steps/day — helps with labour prep" },
    { name: "Pelvic floor exercises", type: "recommended", note: "Kegel exercises — strengthens muscles for birth" },
    { name: "Breathing exercises", type: "recommended", note: "Prepares for labour, reduces anxiety" },
    { name: "Gentle prenatal yoga", type: "recommended", note: "Avoid inversions or positions on back" },
    { name: "Sitting in squat position", type: "recommended", note: "Opens pelvis and helps baby's position" },
    { name: "Vigorous cardio", type: "avoid", note: "Heart rate over 140 BPM is not recommended" },
    { name: "Heavy lifting", type: "avoid", note: "Strains pelvic floor and lower back" },
    { name: "Exercises requiring balance", type: "avoid", note: "Shifted centre of gravity increases fall risk" },
  ],
};

// ─── WHO weight gain targets ──────────────────────────────────────────────────
export type BMICategory = "underweight" | "normal" | "overweight" | "obese";

export const WHO_WEIGHT_RANGE: Record<BMICategory, { min: number; max: number; label: string }> = {
  underweight: { min: 12.5, max: 18, label: "Underweight (BMI <18.5)" },
  normal:      { min: 11.5, max: 16, label: "Normal (BMI 18.5–24.9)" },
  overweight:  { min: 7,    max: 11.5, label: "Overweight (BMI 25–29.9)" },
  obese:       { min: 5,    max: 9,    label: "Obese (BMI ≥30)" },
};

// Recommended cumulative weight gain (kg) per week — normal BMI
export function getRecommendedWeightGain(week: number, bmiCategory: BMICategory): number {
  const { min, max } = WHO_WEIGHT_RANGE[bmiCategory];
  const mid = (min + max) / 2;
  if (week <= 12) return +(week * 0.5 * mid / 16).toFixed(1);
  return +(0.375 + (week - 12) * (mid / 28)).toFixed(1);
}

// ─── Step targets by trimester ────────────────────────────────────────────────
export const STEP_TARGETS: Record<number, number> = {
  1: 7000,
  2: 8000,
  3: 5000,
};

// ─── Sleep tips by trimester ──────────────────────────────────────────────────
export const SLEEP_TIPS: Record<number, string[]> = {
  1: [
    "Any sleep position is safe in the first trimester.",
    "Nausea often peaks at night — eat a small snack before bed.",
    "Keep your room cool and dark for better rest.",
    "Aim for 8–9 hours of sleep per night.",
  ],
  2: [
    "Start sleeping on your left side — it improves blood flow to baby.",
    "Use a pregnancy pillow between your knees for comfort.",
    "Heartburn at night? Elevate your head with an extra pillow.",
    "Leg cramps? Stretch your calves before bed.",
  ],
  3: [
    "Left-side sleeping is strongly recommended — best for blood flow to baby.",
    "A full-length body pillow helps support your bump and hips.",
    "Short naps (20–30 min) are great for T3 fatigue.",
    "Avoid drinking large amounts of water 2 hours before bed.",
    "Baby's movements may keep you up — this is normal.",
  ],
};

// ─── Key nutrients by trimester ───────────────────────────────────────────────
export const KEY_NUTRIENTS: Record<number, Array<{ name: string; target: string; foods: string }>> = {
  1: [
    { name: "Folic Acid", target: "400–800 mcg/day", foods: "Leafy greens, lentils, fortified cereals, citrus fruits" },
    { name: "Vitamin B6", target: "1.9 mg/day", foods: "Bananas, potatoes, chickpeas, poultry — helps with nausea" },
    { name: "Iron", target: "27 mg/day", foods: "Spinach, lentils, red meat, tofu, pumpkin seeds" },
  ],
  2: [
    { name: "Iron", target: "27 mg/day", foods: "Spinach, lentils, red meat, beans, fortified cereals" },
    { name: "Calcium", target: "1000 mg/day", foods: "Milk, yogurt, paneer, sesame seeds, almonds" },
    { name: "Vitamin D", target: "600 IU/day", foods: "Fatty fish, egg yolk, fortified milk, sunlight exposure" },
  ],
  3: [
    { name: "Calcium", target: "1000 mg/day", foods: "Dairy products, leafy greens, tofu, almonds" },
    { name: "DHA (Omega-3)", target: "200–300 mg/day", foods: "Fatty fish (salmon, sardines), flaxseeds, walnuts" },
    { name: "Iron", target: "27 mg/day", foods: "Iron-rich foods + Vitamin C for absorption" },
    { name: "Protein", target: "71 g/day", foods: "Eggs, lentils, paneer, chicken, Greek yogurt" },
  ],
};

// ─── Risk flag logic ──────────────────────────────────────────────────────────
export type RiskLevel = "low" | "medium" | "high";

export interface RiskFlag {
  id: string;
  label: string;
  detail: string;
  level: RiskLevel;
}

export function computeRiskFlags(params: {
  systolic?: number;
  diastolic?: number;
  spo2?: number;
  heartRate?: number;
  lastKickDate?: string;
  currentWeek: number;
}): RiskFlag[] {
  const flags: RiskFlag[] = [];

  if (params.systolic && params.diastolic) {
    if (params.systolic >= 160 || params.diastolic >= 110) {
      flags.push({ id: "bp_severe", label: "Severely High Blood Pressure", detail: `${params.systolic}/${params.diastolic} mmHg — seek care immediately`, level: "high" });
    } else if (params.systolic >= 140 || params.diastolic >= 90) {
      flags.push({ id: "bp_high", label: "High Blood Pressure", detail: `${params.systolic}/${params.diastolic} mmHg — possible pre-eclampsia risk, contact your doctor`, level: "medium" });
    }
  }

  if (params.spo2 && params.spo2 < 95) {
    flags.push({ id: "spo2_low", label: "Low Blood Oxygen", detail: `SpO₂ ${params.spo2}% — below 95% threshold, consult your doctor`, level: params.spo2 < 90 ? "high" : "medium" });
  }

  if (params.heartRate && params.heartRate > 100) {
    flags.push({ id: "hr_high", label: "Elevated Resting Heart Rate", detail: `${params.heartRate} BPM at rest — discuss with your doctor`, level: "medium" });
  }

  if (params.currentWeek >= 28 && params.lastKickDate) {
    const lastKick = new Date(params.lastKickDate);
    const hoursSince = (Date.now() - lastKick.getTime()) / (1000 * 60 * 60);
    if (hoursSince > 12) {
      flags.push({ id: "no_kick", label: "No Kick Count Logged Today", detail: "Reminder: count 10 kicks in 2 hours from Week 28", level: "medium" });
    }
  }

  return flags;
}
