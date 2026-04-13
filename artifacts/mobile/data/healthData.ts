export interface HealthField {
  key: string;
  label: string;
  unit: string;
  normalRange?: string;
  placeholder?: string;
}

export interface ScheduledTest {
  id: string;
  type: "vital" | "blood" | "scan";
  name: string;
  shortName: string;
  weekRange: [number, number];
  trimester: 1 | 2 | 3;
  description: string;
  fields: HealthField[];
  importance: "routine" | "important" | "critical";
}

export interface HealthRecord {
  testId: string;
  date: string;
  values: Record<string, string>;
  notes?: string;
  photoUri?: string;
  dietSuggestions: string[];
  aiExtracted?: boolean;
}

export const scheduledTests: ScheduledTest[] = [
  // ── VITALS ──
  {
    id: "bp_routine",
    type: "vital",
    name: "Blood Pressure",
    shortName: "BP",
    weekRange: [1, 40],
    trimester: 1,
    description: "Measured at every prenatal visit. High BP can indicate preeclampsia.",
    importance: "critical",
    fields: [
      { key: "systolic", label: "Systolic", unit: "mmHg", normalRange: "< 120", placeholder: "e.g. 110" },
      { key: "diastolic", label: "Diastolic", unit: "mmHg", normalRange: "< 80", placeholder: "e.g. 70" },
    ],
  },
  {
    id: "weight",
    type: "vital",
    name: "Weight",
    shortName: "Weight",
    weekRange: [1, 40],
    trimester: 1,
    description: "Track weekly weight gain to ensure healthy fetal growth.",
    importance: "routine",
    fields: [
      { key: "weight", label: "Weight", unit: "kg", normalRange: "Gain 0.5–1 kg/week (T2&T3)", placeholder: "e.g. 62.5" },
    ],
  },
  {
    id: "fetal_hr",
    type: "vital",
    name: "Fetal Heart Rate",
    shortName: "FHR",
    weekRange: [10, 40],
    trimester: 1,
    description: "Normal fetal heart rate is 110–160 bpm. Measured via Doppler.",
    importance: "important",
    fields: [
      { key: "fhr", label: "Heart Rate", unit: "bpm", normalRange: "110–160 bpm", placeholder: "e.g. 145" },
    ],
  },
  {
    id: "fundal_height",
    type: "vital",
    name: "Fundal Height",
    shortName: "FH",
    weekRange: [20, 40],
    trimester: 2,
    description: "Measured in cm, should roughly equal the gestational week (±2cm).",
    importance: "routine",
    fields: [
      { key: "fh", label: "Fundal Height", unit: "cm", normalRange: "≈ Week number ±2cm", placeholder: "e.g. 28" },
    ],
  },

  // ── BLOOD TESTS ──
  {
    id: "cbc_t1",
    type: "blood",
    name: "Complete Blood Count",
    shortName: "CBC",
    weekRange: [6, 12],
    trimester: 1,
    description: "Screens for anemia, infections and other blood disorders.",
    importance: "critical",
    fields: [
      { key: "hb", label: "Hemoglobin", unit: "g/dL", normalRange: ">= 11 g/dL", placeholder: "e.g. 11.5" },
      { key: "hct", label: "Hematocrit", unit: "%", normalRange: "33–44%", placeholder: "e.g. 36" },
      { key: "wbc", label: "WBC Count", unit: "×10³/μL", normalRange: "6–16 ×10³/μL", placeholder: "e.g. 8" },
      { key: "platelets", label: "Platelets", unit: "×10³/μL", normalRange: "150–400", placeholder: "e.g. 220" },
    ],
  },
  {
    id: "blood_group",
    type: "blood",
    name: "Blood Group & Rh",
    shortName: "BG+Rh",
    weekRange: [6, 10],
    trimester: 1,
    description: "Determines Rh compatibility. Rh-negative moms need anti-D injection.",
    importance: "critical",
    fields: [
      { key: "blood_group", label: "Blood Group", unit: "", placeholder: "e.g. B+" },
      { key: "rh", label: "Rh Factor", unit: "", placeholder: "Positive / Negative" },
    ],
  },
  {
    id: "tsh",
    type: "blood",
    name: "Thyroid Function (TSH)",
    shortName: "TSH",
    weekRange: [6, 12],
    trimester: 1,
    description: "Thyroid disorders affect fetal brain development. Target TSH < 2.5 in T1.",
    importance: "important",
    fields: [
      { key: "tsh", label: "TSH", unit: "mIU/L", normalRange: "0.1–2.5 (T1), < 3.0 (T2/T3)", placeholder: "e.g. 1.8" },
    ],
  },
  {
    id: "glucose_fasting",
    type: "blood",
    name: "Fasting Blood Glucose",
    shortName: "FBG",
    weekRange: [6, 12],
    trimester: 1,
    description: "Early screening for pre-existing diabetes.",
    importance: "important",
    fields: [
      { key: "fbg", label: "Fasting Glucose", unit: "mg/dL", normalRange: "< 92 mg/dL", placeholder: "e.g. 85" },
    ],
  },
  {
    id: "double_marker",
    type: "blood",
    name: "Double Marker Test",
    shortName: "Double Marker",
    weekRange: [11, 13],
    trimester: 1,
    description: "Screens for chromosomal abnormalities (Down syndrome, Trisomy 18). Done with NT scan.",
    importance: "critical",
    fields: [
      { key: "b_hcg", label: "Free β-hCG", unit: "MoM", normalRange: "0.5–2.0 MoM", placeholder: "e.g. 1.2" },
      { key: "papp_a", label: "PAPP-A", unit: "MoM", normalRange: "0.5–2.0 MoM", placeholder: "e.g. 1.0" },
      { key: "risk", label: "Risk (1:X)", unit: "", placeholder: "e.g. 1:1500" },
    ],
  },
  {
    id: "ogtt",
    type: "blood",
    name: "Glucose Tolerance (OGTT)",
    shortName: "OGTT",
    weekRange: [24, 28],
    trimester: 2,
    description: "Gold standard for gestational diabetes screening.",
    importance: "critical",
    fields: [
      { key: "fasting", label: "Fasting", unit: "mg/dL", normalRange: "< 92", placeholder: "e.g. 82" },
      { key: "one_hr", label: "1-hour", unit: "mg/dL", normalRange: "< 180", placeholder: "e.g. 152" },
      { key: "two_hr", label: "2-hour", unit: "mg/dL", normalRange: "< 153", placeholder: "e.g. 130" },
    ],
  },
  {
    id: "cbc_t2",
    type: "blood",
    name: "CBC (Repeat)",
    shortName: "CBC",
    weekRange: [24, 28],
    trimester: 2,
    description: "Repeat blood count to monitor for iron-deficiency anemia.",
    importance: "important",
    fields: [
      { key: "hb", label: "Hemoglobin", unit: "g/dL", normalRange: ">= 11 g/dL", placeholder: "e.g. 11.0" },
      { key: "ferritin", label: "Serum Ferritin", unit: "ng/mL", normalRange: "15–150", placeholder: "e.g. 25" },
    ],
  },
  {
    id: "gbs",
    type: "blood",
    name: "Group B Strep (GBS)",
    shortName: "GBS",
    weekRange: [35, 37],
    trimester: 3,
    description: "Vaginal/rectal swab to check for GBS bacteria. Positive moms get antibiotics in labor.",
    importance: "important",
    fields: [
      { key: "result", label: "Result", unit: "", placeholder: "Positive / Negative" },
    ],
  },

  // ── SCANS ──
  {
    id: "dating_scan",
    type: "scan",
    name: "Dating Scan",
    shortName: "Dating",
    weekRange: [6, 9],
    trimester: 1,
    description: "Confirms pregnancy, gestational age, number of fetuses and heartbeat.",
    importance: "critical",
    fields: [
      { key: "ga", label: "Gestational Age", unit: "weeks+days", placeholder: "e.g. 7+2" },
      { key: "heartbeat", label: "Fetal Heartbeat", unit: "bpm", normalRange: "100–170 bpm", placeholder: "e.g. 158" },
      { key: "crown_rump", label: "Crown-Rump Length", unit: "mm", placeholder: "e.g. 10" },
    ],
  },
  {
    id: "nt_scan",
    type: "scan",
    name: "NT Scan",
    shortName: "NT Scan",
    weekRange: [11, 13],
    trimester: 1,
    description: "Nuchal Translucency scan screens for chromosomal issues. Done with Double Marker.",
    importance: "critical",
    fields: [
      { key: "nt", label: "NT Measurement", unit: "mm", normalRange: "< 3.0 mm", placeholder: "e.g. 1.5" },
      { key: "fhr", label: "Fetal HR", unit: "bpm", normalRange: "110–170 bpm", placeholder: "e.g. 160" },
      { key: "nasal_bone", label: "Nasal Bone", unit: "", placeholder: "Present / Absent" },
    ],
  },
  {
    id: "anomaly_scan",
    type: "scan",
    name: "Anomaly Scan",
    shortName: "Anomaly",
    weekRange: [18, 22],
    trimester: 2,
    description: "Detailed scan to check all fetal organs, placenta and amniotic fluid.",
    importance: "critical",
    fields: [
      { key: "bpd", label: "BPD", unit: "mm", placeholder: "e.g. 50" },
      { key: "fl", label: "Femur Length", unit: "mm", placeholder: "e.g. 35" },
      { key: "ac", label: "Abdominal Circumference", unit: "mm", placeholder: "e.g. 160" },
      { key: "afi", label: "Amniotic Fluid Index", unit: "cm", normalRange: "8–18 cm", placeholder: "e.g. 12" },
      { key: "placenta", label: "Placenta Position", unit: "", placeholder: "e.g. Posterior" },
    ],
  },
  {
    id: "growth_scan",
    type: "scan",
    name: "Growth Scan",
    shortName: "Growth",
    weekRange: [28, 32],
    trimester: 3,
    description: "Checks fetal growth and wellbeing. Estimates baby's weight.",
    importance: "important",
    fields: [
      { key: "efw", label: "Estimated Fetal Weight", unit: "grams", placeholder: "e.g. 1200" },
      { key: "afi", label: "Amniotic Fluid Index", unit: "cm", normalRange: "8–18 cm", placeholder: "e.g. 14" },
      { key: "presentation", label: "Presentation", unit: "", placeholder: "e.g. Cephalic" },
    ],
  },
  {
    id: "wellbeing_scan",
    type: "scan",
    name: "Fetal Wellbeing Scan",
    shortName: "Wellbeing",
    weekRange: [34, 36],
    trimester: 3,
    description: "BPP and Doppler to assess fetal health and blood flow.",
    importance: "important",
    fields: [
      { key: "bpp", label: "Biophysical Profile", unit: "/8", normalRange: ">= 6/8", placeholder: "e.g. 8/8" },
      { key: "doppler", label: "Umbilical Doppler", unit: "", placeholder: "Normal / Abnormal" },
      { key: "efw", label: "Estimated Fetal Weight", unit: "grams", placeholder: "e.g. 2400" },
    ],
  },
];

export function getTestsForWeek(week: number): ScheduledTest[] {
  return scheduledTests.filter(
    (t) => week >= t.weekRange[0] && week <= t.weekRange[1]
  );
}

export function getTestsByType(type: ScheduledTest["type"]): ScheduledTest[] {
  return scheduledTests.filter((t) => t.type === type);
}

export function getTestById(id: string): ScheduledTest | undefined {
  return scheduledTests.find((t) => t.id === id);
}

export function getDietSuggestionsForResult(
  testId: string,
  values: Record<string, string>
): string[] {
  const suggestions: string[] = [];

  if (testId === "cbc_t1" || testId === "cbc_t2") {
    const hb = parseFloat(values.hb || "0");
    if (hb > 0 && hb < 11) {
      suggestions.push("🥬 Eat iron-rich foods daily: leafy greens (palak, methi), lentils (masoor, moong), rajma");
      suggestions.push("🍋 Pair iron foods with Vitamin C — amla juice, lemon, guava boost absorption by 3×");
      suggestions.push("☕ Avoid tea, coffee, and calcium supplements within 1 hour of iron-rich meals");
      suggestions.push("🥩 Include lean meats, chicken liver, or tofu if preferred — excellent iron sources");
    } else if (hb >= 11) {
      suggestions.push("✅ Your hemoglobin is in a healthy range — maintain iron-rich foods in your diet");
    }
    const ferritin = parseFloat(values.ferritin || "0");
    if (ferritin > 0 && ferritin < 15) {
      suggestions.push("💊 Your ferritin is low — talk to your doctor about iron supplementation alongside dietary changes");
    }
  }

  if (testId === "glucose_fasting" || testId === "ogtt") {
    const fbg = parseFloat(values.fbg || values.fasting || "0");
    const twoHr = parseFloat(values.two_hr || "0");
    if ((fbg > 0 && fbg >= 92) || (twoHr > 0 && twoHr >= 153)) {
      suggestions.push("🌾 Choose low-GI carbs: oats, brown rice, whole wheat roti instead of maida or white rice");
      suggestions.push("🥗 Eat small, frequent meals (5–6 per day) to prevent blood sugar spikes");
      suggestions.push("🚶 A 15-minute gentle walk after each meal significantly improves glucose tolerance");
      suggestions.push("🍰 Limit sweets, fruit juices, honey, and processed snacks");
      suggestions.push("🥜 Add protein (dahi, paneer, eggs, lentils) to every meal to slow glucose absorption");
    } else if (fbg > 0) {
      suggestions.push("✅ Blood sugar is normal — continue eating balanced meals with complex carbs and protein");
    }
  }

  if (testId === "bp_routine") {
    const sys = parseFloat(values.systolic || "0");
    const dia = parseFloat(values.diastolic || "0");
    if (sys >= 140 || dia >= 90) {
      suggestions.push("🧂 Reduce sodium: avoid pickles, papads, processed foods, restaurant meals, and added salt");
      suggestions.push("🫐 Eat potassium-rich foods: banana, sweet potato, coconut water, avocado");
      suggestions.push("🐟 Omega-3 foods (flaxseeds, walnuts, fatty fish) help lower blood pressure naturally");
      suggestions.push("🥦 DASH diet approach: more fruits, vegetables, whole grains, less saturated fat");
      suggestions.push("💧 Stay well hydrated — aim for 2.5–3 litres of water daily");
    } else if (sys > 0 && sys <= 90) {
      suggestions.push("🧂 Low BP: increase fluid and salt intake slightly — coconut water and nimbu pani are great");
      suggestions.push("🍽️ Don't skip meals — low blood sugar worsens low BP; eat small frequent meals");
    } else if (sys > 0) {
      suggestions.push("✅ Blood pressure is in a healthy range — maintain a low-sodium, balanced diet");
    }
  }

  if (testId === "tsh") {
    const tsh = parseFloat(values.tsh || "0");
    if (tsh > 0 && tsh > 2.5) {
      suggestions.push("🦐 Iodine-rich foods support thyroid: iodised salt, seafood, dairy, eggs");
      suggestions.push("🥗 Selenium-rich foods (Brazil nuts, sunflower seeds) aid thyroid hormone conversion");
      suggestions.push("⚠️ Avoid excessive raw cruciferous vegetables (broccoli, cabbage) — cooking deactivates goitrogens");
    } else if (tsh > 0 && tsh < 0.1) {
      suggestions.push("⚠️ Consult your doctor — dietary changes alone won't manage hyperthyroidism in pregnancy");
    } else if (tsh > 0) {
      suggestions.push("✅ Thyroid levels are within the pregnancy target range — maintain a balanced iodine intake");
    }
  }

  if (testId === "weight") {
    const w = parseFloat(values.weight || "0");
    if (w > 0) {
      suggestions.push("📊 Track weekly weight gain — recommended: 0.3–0.5 kg/week in T2 & T3 for normal BMI");
      suggestions.push("🥑 Focus on nutrient-dense calories: nuts, seeds, avocado, ghee (in moderation), dairy");
      suggestions.push("🍽️ Avoid 'eating for two' — quality over quantity; extra 300–500 kcal/day is sufficient");
    }
  }

  if (suggestions.length === 0) {
    suggestions.push("📋 Log your result and share with your doctor at the next visit for personalised advice");
  }

  return suggestions;
}
