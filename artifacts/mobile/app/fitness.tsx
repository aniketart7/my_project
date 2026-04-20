import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { usePregnancy } from "@/context/PregnancyContext";
import {
  EXERCISE_GUIDE,
  SLEEP_TIPS,
  KEY_NUTRIENTS,
  STEP_TARGETS,
  WHO_WEIGHT_RANGE,
  getRecommendedWeightGain,
  computeRiskFlags,
  type BMICategory,
  type ExerciseItem,
} from "@/data/fitnessData";

type FitnessTab = "today" | "activity" | "weight" | "sleep";

const ACC = "#6db58a"; // green accent for fitness

// ─── Mini bar chart (SVG-free, pure View) ─────────────────────────────────────
function BarChart({ data, color, labels, unit }: { data: number[]; color: string; labels: string[]; unit: string }) {
  const max = Math.max(...data, 1);
  return (
    <View style={chart.wrap}>
      {data.map((v, i) => (
        <View key={i} style={chart.col}>
          <Text style={chart.val}>{v > 0 ? `${v}` : ""}</Text>
          <View style={[chart.barBg, { height: 80 }]}>
            <View style={[chart.bar, { height: (v / max) * 80, backgroundColor: color }]} />
          </View>
          <Text style={chart.lbl}>{labels[i]}</Text>
        </View>
      ))}
    </View>
  );
}
const chart = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "flex-end", gap: 6, paddingVertical: 8 },
  col: { flex: 1, alignItems: "center", gap: 2 },
  val: { fontSize: 9, color: "#888", fontWeight: "600" },
  barBg: { width: "100%", justifyContent: "flex-end", backgroundColor: "#f0f0f0", borderRadius: 4 },
  bar: { width: "100%", borderRadius: 4 },
  lbl: { fontSize: 9, color: "#aaa", fontWeight: "500" },
});

// ─── Ring progress ─────────────────────────────────────────────────────────────
function RingProgress({ value, max, color, label, sub }: { value: number; max: number; color: string; label: string; sub: string }) {
  const pct = Math.min(value / max, 1);
  return (
    <View style={ring.wrap}>
      <View style={[ring.outer, { borderColor: color + "30" }]}>
        <View style={[ring.fill, {
          borderColor: color,
          borderTopColor: pct > 0.25 ? color : "transparent",
          borderRightColor: pct > 0.5 ? color : "transparent",
          borderBottomColor: pct > 0.75 ? color : "transparent",
        }]} />
        <View style={ring.center}>
          <Text style={[ring.val, { color }]}>{Math.round(pct * 100)}%</Text>
        </View>
      </View>
      <Text style={ring.label}>{label}</Text>
      <Text style={ring.sub}>{sub}</Text>
    </View>
  );
}
const ring = StyleSheet.create({
  wrap: { alignItems: "center", gap: 4 },
  outer: { width: 72, height: 72, borderRadius: 36, borderWidth: 6, alignItems: "center", justifyContent: "center" },
  fill: { position: "absolute", width: 72, height: 72, borderRadius: 36, borderWidth: 6 },
  center: { alignItems: "center" },
  val: { fontSize: 13, fontWeight: "800" },
  label: { fontSize: 12, fontWeight: "700", color: "#333", textAlign: "center" },
  sub: { fontSize: 10, color: "#888", textAlign: "center" },
});

// ─── Section header ─────────────────────────────────────────────────────────────
function SectionHead({ title, color }: { title: string; color: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 16, marginTop: 20, marginBottom: 10 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#1a1a2e" }}>{title}</Text>
    </View>
  );
}

// ─── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ icon, label, value, unit, color, onAdd }: { icon: string; label: string; value: string; unit: string; color: string; onAdd?: () => void }) {
  return (
    <View style={[mc.card, { borderColor: color + "30", backgroundColor: color + "08" }]}>
      <View style={[mc.iconBox, { backgroundColor: color + "20" }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <Text style={[mc.val, { color }]}>{value}</Text>
      <Text style={mc.unit}>{unit}</Text>
      <Text style={mc.lbl}>{label}</Text>
      {onAdd && (
        <TouchableOpacity style={[mc.addBtn, { backgroundColor: color + "20" }]} onPress={onAdd}>
          <Feather name="plus" size={12} color={color} />
        </TouchableOpacity>
      )}
    </View>
  );
}
const mc = StyleSheet.create({
  card: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 12, alignItems: "center", gap: 2 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  val: { fontSize: 22, fontWeight: "900", letterSpacing: -1 },
  unit: { fontSize: 10, color: "#888", fontWeight: "600", marginTop: -2 },
  lbl: { fontSize: 11, color: "#555", fontWeight: "600", textAlign: "center" },
  addBtn: { marginTop: 6, width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});

export default function FitnessScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const { currentWeek } = usePregnancy();

  const [activeTab, setActiveTab] = useState<FitnessTab>("today");

  // Today's data (local state — would persist via AsyncStorage in full implementation)
  const [steps, setSteps] = useState(0);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [sleepHours, setSleepHours] = useState<number>(0);
  const [heartRate, setHeartRate] = useState<string>("");
  const [systolic, setSystolic] = useState<string>("");
  const [diastolic, setDiastolic] = useState<string>("");
  const [spo2, setSpo2] = useState<string>("");

  // Weight tracking
  const [weightEntries, setWeightEntries] = useState<{ week: number; kg: number }[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [bmiCategory, setBmiCategory] = useState<BMICategory>("normal");
  const [showWeightModal, setShowWeightModal] = useState(false);

  // Sleep log
  const [sleepLog, setSleepLog] = useState<number[]>(Array(7).fill(0));
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [sleepInput, setSleepInput] = useState("");

  // Vitals input modals
  const [showVitalsModal, setShowVitalsModal] = useState(false);

  const trimester = currentWeek <= 13 ? 1 : currentWeek <= 26 ? 2 : 3;
  const stepTarget = STEP_TARGETS[trimester];
  const waterTarget = 8; // 8 glasses = ~2L
  const sleepTarget = 9;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const riskFlags = computeRiskFlags({
    systolic: systolic ? parseInt(systolic) : undefined,
    diastolic: diastolic ? parseInt(diastolic) : undefined,
    spo2: spo2 ? parseFloat(spo2) : undefined,
    heartRate: heartRate ? parseInt(heartRate) : undefined,
    currentWeek,
  });

  const addWater = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWaterGlasses(w => Math.min(w + 1, 20));
  };

  const addSteps = () => {
    Alert.prompt("Log Steps", "Enter your step count for today:", [
      { text: "Cancel", style: "cancel" },
      { text: "Save", onPress: (v) => { if (v) setSteps(parseInt(v) || 0); } },
    ], "plain-text", steps.toString(), "number-pad");
  };

  const saveVitals = () => {
    setShowVitalsModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const saveWeight = () => {
    const kg = parseFloat(weightInput);
    if (isNaN(kg) || kg < 30 || kg > 200) { Alert.alert("Invalid weight", "Please enter a weight between 30 and 200 kg."); return; }
    setWeightEntries(prev => {
      const filtered = prev.filter(e => e.week !== currentWeek);
      return [...filtered, { week: currentWeek, kg }].sort((a, b) => a.week - b.week);
    });
    setWeightInput("");
    setShowWeightModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const saveSleep = () => {
    const hrs = parseFloat(sleepInput);
    if (isNaN(hrs) || hrs < 0 || hrs > 24) return;
    const newLog = [...sleepLog.slice(1), hrs];
    setSleepLog(newLog);
    setSleepHours(hrs);
    setSleepInput("");
    setShowSleepModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const weekLabels = ["6d", "5d", "4d", "3d", "2d", "Yest", "Today"];

  // Weight chart
  const latestWeight = weightEntries[weightEntries.length - 1]?.kg;
  const firstWeight = weightEntries[0]?.kg;
  const gained = latestWeight && firstWeight ? +(latestWeight - firstWeight).toFixed(1) : null;
  const recommended = getRecommendedWeightGain(currentWeek, bmiCategory);
  const whoRange = WHO_WEIGHT_RANGE[bmiCategory];

  const TABS: { key: FitnessTab; icon: string; label: string }[] = [
    { key: "today", icon: "grid", label: "Today" },
    { key: "activity", icon: "zap", label: "Activity" },
    { key: "weight", icon: "trending-up", label: "Weight" },
    { key: "sleep", icon: "moon", label: "Sleep" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: ACC }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Fitness Tracker</Text>
            <Text style={styles.headerSub}>Week {currentWeek} · Trimester {trimester}</Text>
          </View>
          <TouchableOpacity
            style={styles.symptomBtn}
            onPress={() => router.push("/symptoms")}
          >
            <Feather name="shield" size={16} color="#fff" />
            <Text style={styles.symptomBtnText}>Symptoms</Text>
          </TouchableOpacity>
        </View>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, activeTab === t.key && styles.tabActive]}
              onPress={() => { setActiveTab(t.key); Haptics.selectionAsync(); }}
            >
              <Feather name={t.icon as any} size={13} color={activeTab === t.key ? ACC : "rgba(255,255,255,0.7)"} />
              <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 60 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ──────────── TODAY TAB ──────────── */}
        {activeTab === "today" && (
          <>
            {/* Risk flags */}
            {riskFlags.length > 0 && (
              <View style={styles.riskBanner}>
                <Feather name="alert-triangle" size={15} color="#e8608a" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.riskTitle}>Health Flags</Text>
                  {riskFlags.map(f => (
                    <Text key={f.id} style={styles.riskItem}>
                      • {f.label}: <Text style={{ color: "#555" }}>{f.detail}</Text>
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Feather name="info" size={13} color="#999" />
              <Text style={styles.disclaimerText}>
                For general wellness guidance only. Always consult your OB/GYN for health concerns.
              </Text>
            </View>

            <SectionHead title="Today's Summary" color={ACC} />

            {/* 4 metric cards */}
            <View style={styles.metricsRow}>
              <MetricCard
                icon="footprint" label="Steps" value={steps.toLocaleString()} unit={`/ ${stepTarget.toLocaleString()}`}
                color="#5b8fd6"
                onAdd={() => addSteps()}
              />
              <MetricCard
                icon="droplet" label="Water" value={waterGlasses.toString()} unit={`/ ${waterTarget} glasses`}
                color="#6db58a"
                onAdd={addWater}
              />
            </View>
            <View style={[styles.metricsRow, { marginTop: 10 }]}>
              <MetricCard
                icon="moon" label="Sleep" value={sleepHours > 0 ? sleepHours.toString() : "—"} unit="hrs"
                color="#9b6db5"
                onAdd={() => setShowSleepModal(true)}
              />
              <MetricCard
                icon="heart" label="Heart Rate" value={heartRate || "—"} unit="BPM"
                color="#e8608a"
                onAdd={() => setShowVitalsModal(true)}
              />
            </View>

            {/* Progress rings */}
            <SectionHead title="Daily Goals" color="#5b8fd6" />
            <View style={[styles.ringsRow, { backgroundColor: c.card, borderColor: c.border }]}>
              <RingProgress value={steps} max={stepTarget} color="#5b8fd6" label="Steps" sub={`${stepTarget.toLocaleString()} goal`} />
              <RingProgress value={waterGlasses} max={waterTarget} color="#6db58a" label="Water" sub="8 glasses" />
              <RingProgress value={sleepHours} max={sleepTarget} color="#9b6db5" label="Sleep" sub="9 hrs target" />
            </View>

            {/* Vitals quick log */}
            <SectionHead title="Vitals Log" color="#ef6c4b" />
            <View style={[styles.vitalsCard, { backgroundColor: c.card, borderColor: c.border }]}>
              {[
                { label: "Blood Pressure", val: systolic && diastolic ? `${systolic}/${diastolic} mmHg` : null, icon: "activity", color: "#e8608a" },
                { label: "SpO₂", val: spo2 ? `${spo2}%` : null, icon: "wind", color: "#5b8fd6" },
                { label: "Heart Rate", val: heartRate ? `${heartRate} BPM` : null, icon: "heart", color: "#ef6c4b" },
              ].map((v, i) => (
                <View key={i} style={[styles.vitalsRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
                  <Feather name={v.icon as any} size={16} color={v.color} />
                  <Text style={[styles.vitalsLabel, { color: c.foreground }]}>{v.label}</Text>
                  <Text style={[styles.vitalsVal, { color: v.val ? v.color : c.mutedForeground }]}>
                    {v.val || "Not logged"}
                  </Text>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.logVitalsBtn, { borderColor: ACC + "40", backgroundColor: ACC + "10" }]}
                onPress={() => setShowVitalsModal(true)}
              >
                <Feather name="edit-2" size={14} color={ACC} />
                <Text style={[styles.logVitalsBtnText, { color: ACC }]}>Log / Update Vitals</Text>
              </TouchableOpacity>
            </View>

            {/* Quick actions */}
            <SectionHead title="Quick Actions" color="#9b6db5" />
            <View style={styles.quickActions}>
              {[
                { icon: "target", label: "Kick Counter", color: "#e8608a", onPress: () => router.push("/kick-counter") },
                { icon: "clock", label: "Contraction Timer", color: "#5b8fd6", onPress: () => router.push("/kick-counter") },
                { icon: "shield", label: "Symptom Checker", color: "#6db58a", onPress: () => router.push("/symptoms") },
                { icon: "trending-up", label: "Weight Tracker", color: "#9b6db5", onPress: () => setActiveTab("weight") },
              ].map((a) => (
                <TouchableOpacity
                  key={a.label}
                  style={[styles.quickAction, { backgroundColor: a.color + "12", borderColor: a.color + "30" }]}
                  onPress={a.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: a.color + "20" }]}>
                    <Feather name={a.icon as any} size={20} color={a.color} />
                  </View>
                  <Text style={[styles.quickActionLabel, { color: a.color }]}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Key nutrients */}
            <SectionHead title={`T${trimester} Key Nutrients`} color="#f0a500" />
            {KEY_NUTRIENTS[trimester].map((n, i) => (
              <View key={i} style={[styles.nutrientCard, { backgroundColor: c.card, borderColor: c.border }]}>
                <View style={styles.nutrientHeader}>
                  <Feather name="zap" size={14} color="#f0a500" />
                  <Text style={[styles.nutrientName, { color: c.foreground }]}>{n.name}</Text>
                  <Text style={[styles.nutrientTarget, { color: "#f0a500" }]}>{n.target}</Text>
                </View>
                <Text style={[styles.nutrientFoods, { color: c.mutedForeground }]}>{n.foods}</Text>
              </View>
            ))}
          </>
        )}

        {/* ──────────── ACTIVITY TAB ──────────── */}
        {activeTab === "activity" && (
          <>
            <SectionHead title="This Week's Activity" color="#5b8fd6" />
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              <View style={styles.stepGoalRow}>
                <View>
                  <Text style={styles.stepGoalTitle}>Daily Step Goal</Text>
                  <Text style={[styles.stepGoalNum, { color: "#5b8fd6" }]}>{stepTarget.toLocaleString()} steps</Text>
                  <Text style={styles.stepGoalSub}>Adjusted for Trimester {trimester}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.logStepsBtn, { backgroundColor: "#5b8fd620", borderColor: "#5b8fd640" }]}
                  onPress={addSteps}
                >
                  <Feather name="plus" size={16} color="#5b8fd6" />
                  <Text style={{ color: "#5b8fd6", fontWeight: "700", fontSize: 13 }}>Log Steps</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.stepBar, { backgroundColor: "#5b8fd620" }]}>
                <View style={[styles.stepBarFill, { width: `${Math.min((steps / stepTarget) * 100, 100)}%` as any, backgroundColor: "#5b8fd6" }]} />
              </View>
              <Text style={styles.stepBarLabel}>{steps.toLocaleString()} / {stepTarget.toLocaleString()} steps today</Text>
            </View>

            <SectionHead title={`T${trimester} Exercise Guide`} color="#6db58a" />
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              <Text style={[styles.exerciseDisclaimer, { color: "#999" }]}>
                ⚠️ Always consult your doctor before starting any new exercise routine during pregnancy.
              </Text>
              {EXERCISE_GUIDE[trimester].map((ex, i) => (
                <View key={i} style={[styles.exerciseRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
                  <View style={[styles.exerciseDot, { backgroundColor: ex.type === "recommended" ? "#6db58a" : "#e8608a" }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.exerciseNameRow}>
                      <Text style={[styles.exerciseName, { color: c.foreground }]}>{ex.name}</Text>
                      <View style={[styles.exerciseBadge, { backgroundColor: ex.type === "recommended" ? "#6db58a20" : "#e8608a20" }]}>
                        <Text style={[styles.exerciseBadgeText, { color: ex.type === "recommended" ? "#6db58a" : "#e8608a" }]}>
                          {ex.type === "recommended" ? "✓ Safe" : "✕ Avoid"}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.exerciseNote, { color: c.mutedForeground }]}>{ex.note}</Text>
                  </View>
                </View>
              ))}
            </View>

            <SectionHead title="WHO Activity Guidelines" color="#9b6db5" />
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              {[
                { icon: "clock", text: "150 min/week of moderate activity (21 min/day average)", color: "#9b6db5" },
                { icon: "heart", text: "Keep heart rate below 140 BPM during exercise", color: "#e8608a" },
                { icon: "thermometer", text: "Avoid overheating — exercise in cool, ventilated spaces", color: "#f0a500" },
                { icon: "droplet", text: "Drink water before, during, and after exercise", color: "#6db58a" },
              ].map((tip, i) => (
                <View key={i} style={[styles.tipRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
                  <Feather name={tip.icon as any} size={15} color={tip.color} />
                  <Text style={[styles.tipText, { color: c.foreground }]}>{tip.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ──────────── WEIGHT TAB ──────────── */}
        {activeTab === "weight" && (
          <>
            <SectionHead title="Weight Tracker" color="#9b6db5" />

            {/* BMI category selector */}
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              <Text style={[styles.bmiLabel, { color: c.mutedForeground }]}>Your pre-pregnancy BMI category:</Text>
              <View style={styles.bmiTabs}>
                {(["underweight", "normal", "overweight", "obese"] as BMICategory[]).map(b => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.bmiTab, bmiCategory === b && { backgroundColor: "#9b6db520", borderColor: "#9b6db540" }]}
                    onPress={() => setBmiCategory(b)}
                  >
                    <Text style={[styles.bmiTabText, { color: bmiCategory === b ? "#9b6db5" : "#999" }]}>
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[styles.whoRange, { backgroundColor: "#9b6db510" }]}>
                <Text style={[styles.whoRangeText, { color: "#9b6db5" }]}>
                  Recommended total gain: {whoRange.min}–{whoRange.max} kg
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.weightStats}>
              <View style={[styles.weightStatCard, { borderColor: "#9b6db530", backgroundColor: "#9b6db510" }]}>
                <Text style={[styles.weightStatNum, { color: "#9b6db5" }]}>{gained !== null ? `+${gained} kg` : "—"}</Text>
                <Text style={styles.weightStatLabel}>Gained so far</Text>
              </View>
              <View style={[styles.weightStatCard, { borderColor: "#6db58a30", backgroundColor: "#6db58a10" }]}>
                <Text style={[styles.weightStatNum, { color: "#6db58a" }]}>+{recommended} kg</Text>
                <Text style={styles.weightStatLabel}>Recommended at W{currentWeek}</Text>
              </View>
            </View>

            {/* Weight entry history */}
            {weightEntries.length > 0 && (
              <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
                <Text style={[styles.cardSectionLabel, { color: c.mutedForeground }]}>WEIGHT HISTORY</Text>
                {weightEntries.slice(-5).reverse().map((e, i) => {
                  const diff = i < weightEntries.length - 1 ? +(e.kg - (weightEntries[weightEntries.length - 2 - i]?.kg || e.kg)).toFixed(1) : null;
                  return (
                    <View key={i} style={[styles.weightEntry, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
                      <Text style={[styles.weightEntryWeek, { color: c.mutedForeground }]}>Week {e.week}</Text>
                      <Text style={[styles.weightEntryKg, { color: c.foreground }]}>{e.kg} kg</Text>
                      {diff !== null && diff !== 0 && (
                        <Text style={{ fontSize: 11, color: diff > 0 ? "#e8608a" : "#6db58a", fontWeight: "600" }}>
                          {diff > 0 ? `+${diff}` : diff} kg
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            <TouchableOpacity
              style={[styles.addWeightBtn, { backgroundColor: "#9b6db5", borderColor: "#9b6db5" }]}
              onPress={() => setShowWeightModal(true)}
            >
              <Feather name="plus" size={18} color="#fff" />
              <Text style={styles.addWeightBtnText}>Log This Week's Weight</Text>
            </TouchableOpacity>

            {/* WHO guidelines */}
            <SectionHead title="WHO Guidelines" color="#f0a500" />
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              {(Object.entries(WHO_WEIGHT_RANGE) as [BMICategory, typeof WHO_WEIGHT_RANGE[BMICategory]][]).map(([cat, r], i) => (
                <View key={cat} style={[styles.tipRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tipText, { color: c.foreground, fontWeight: bmiCategory === cat ? "700" : "500" }]}>{r.label}</Text>
                  </View>
                  <Text style={[styles.tipText, { color: "#f0a500", fontWeight: "700" }]}>{r.min}–{r.max} kg</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ──────────── SLEEP TAB ──────────── */}
        {activeTab === "sleep" && (
          <>
            <SectionHead title="Sleep This Week" color="#9b6db5" />
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              <View style={styles.sleepSummaryRow}>
                <View style={styles.sleepSummaryLeft}>
                  <Text style={[styles.sleepBigNum, { color: "#9b6db5" }]}>{sleepHours > 0 ? `${sleepHours}h` : "—"}</Text>
                  <Text style={styles.sleepBigLabel}>Last night</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sleepAvg, { color: c.foreground }]}>
                    7-day avg: <Text style={{ color: "#9b6db5", fontWeight: "700" }}>
                      {sleepLog.some(h => h > 0) ? (sleepLog.reduce((a, b) => a + b, 0) / Math.max(sleepLog.filter(h => h > 0).length, 1)).toFixed(1) + "h" : "—"}
                    </Text>
                  </Text>
                  <Text style={[styles.sleepTarget, { color: c.mutedForeground }]}>Target: 8–9 hours/night</Text>
                </View>
              </View>
              <BarChart data={sleepLog} color="#9b6db5" labels={weekLabels} unit="h" />
              <TouchableOpacity
                style={[styles.logVitalsBtn, { borderColor: "#9b6db540", backgroundColor: "#9b6db510", marginTop: 8 }]}
                onPress={() => setShowSleepModal(true)}
              >
                <Feather name="moon" size={14} color="#9b6db5" />
                <Text style={[styles.logVitalsBtnText, { color: "#9b6db5" }]}>Log Last Night's Sleep</Text>
              </TouchableOpacity>
            </View>

            <SectionHead title={`T${trimester} Sleep Tips`} color="#9b6db5" />
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              {SLEEP_TIPS[trimester].map((tip, i) => (
                <View key={i} style={[styles.tipRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
                  <Text style={{ fontSize: 14 }}>{["🌙", "💤", "🛏️", "💧", "👶"][i % 5]}</Text>
                  <Text style={[styles.tipText, { color: c.foreground }]}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Sleep position guide */}
            <SectionHead title="Sleep Position Guide" color="#5b8fd6" />
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              {[
                { t: "T1 (Weeks 1–13)", tip: "Any position is comfortable and safe.", color: "#e8608a" },
                { t: "T2 (Weeks 14–26)", tip: "Start transitioning to left-side sleeping. Improves blood flow to baby and kidneys.", color: "#9b6db5" },
                { t: "T3 (Weeks 27–40)", tip: "Left-side sleeping strongly recommended. Use a full-body pillow for support. Avoids compressing the inferior vena cava.", color: "#5b8fd6" },
              ].map((s, i) => (
                <View key={i} style={[styles.positionRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
                  <View style={[styles.positionDot, { backgroundColor: s.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.positionTitle, { color: s.color }]}>{s.t}</Text>
                    <Text style={[styles.positionTip, { color: c.foreground }]}>{s.tip}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* ── Vitals Modal ── */}
      <Modal visible={showVitalsModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowVitalsModal(false)}>
        <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 24, paddingTop: insets.top + 20 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Vitals</Text>
            <TouchableOpacity onPress={() => setShowVitalsModal(false)}>
              <Feather name="x" size={22} color="#555" />
            </TouchableOpacity>
          </View>
          {[
            { label: "Heart Rate (BPM)", val: heartRate, set: setHeartRate, placeholder: "e.g. 78", normal: "60–100 BPM at rest" },
            { label: "Blood Pressure — Systolic", val: systolic, set: setSystolic, placeholder: "e.g. 120", normal: "< 140 mmHg" },
            { label: "Blood Pressure — Diastolic", val: diastolic, set: setDiastolic, placeholder: "e.g. 80", normal: "< 90 mmHg" },
            { label: "Blood Oxygen SpO₂ (%)", val: spo2, set: setSpo2, placeholder: "e.g. 98", normal: "> 95%" },
          ].map((f, i) => (
            <View key={i} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{f.label}</Text>
              <Text style={[styles.inputNormal, { color: c.mutedForeground }]}>Normal: {f.normal}</Text>
              <TextInput
                style={[styles.inputField, { borderColor: c.border, color: c.foreground, backgroundColor: c.card }]}
                value={f.val}
                onChangeText={f.set}
                placeholder={f.placeholder}
                placeholderTextColor={c.mutedForeground}
                keyboardType="decimal-pad"
              />
            </View>
          ))}
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: ACC }]} onPress={saveVitals}>
            <Text style={styles.saveBtnText}>Save Vitals</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* ── Weight Modal ── */}
      <Modal visible={showWeightModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowWeightModal(false)}>
        <View style={{ flex: 1, backgroundColor: c.background, padding: 24, paddingTop: insets.top + 20 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Weight · Week {currentWeek}</Text>
            <TouchableOpacity onPress={() => setShowWeightModal(false)}>
              <Feather name="x" size={22} color="#555" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.inputLabel, { marginTop: 20 }]}>Your weight today (kg)</Text>
          <TextInput
            style={[styles.inputField, { borderColor: c.border, color: c.foreground, backgroundColor: c.card, fontSize: 24, fontWeight: "700", textAlign: "center" }]}
            value={weightInput}
            onChangeText={setWeightInput}
            placeholder="e.g. 65.5"
            placeholderTextColor={c.mutedForeground}
            keyboardType="decimal-pad"
            autoFocus
          />
          <Text style={[styles.inputNormal, { color: c.mutedForeground, textAlign: "center", marginTop: 8 }]}>
            Recommended gain by now: +{recommended} kg ({bmiCategory} BMI)
          </Text>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#9b6db5", marginTop: 20 }]} onPress={saveWeight}>
            <Text style={styles.saveBtnText}>Save Weight</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ── Sleep Modal ── */}
      <Modal visible={showSleepModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowSleepModal(false)}>
        <View style={{ flex: 1, backgroundColor: c.background, padding: 24, paddingTop: insets.top + 20 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Sleep</Text>
            <TouchableOpacity onPress={() => setShowSleepModal(false)}>
              <Feather name="x" size={22} color="#555" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.inputLabel, { marginTop: 20 }]}>Hours slept last night</Text>
          <TextInput
            style={[styles.inputField, { borderColor: c.border, color: c.foreground, backgroundColor: c.card, fontSize: 24, fontWeight: "700", textAlign: "center" }]}
            value={sleepInput}
            onChangeText={setSleepInput}
            placeholder="e.g. 8"
            placeholderTextColor={c.mutedForeground}
            keyboardType="decimal-pad"
            autoFocus
          />
          <Text style={[styles.inputNormal, { color: c.mutedForeground, textAlign: "center", marginTop: 8 }]}>
            Target: 8–9 hours for a healthy pregnancy
          </Text>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#9b6db5", marginTop: 20 }]} onPress={saveSleep}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 0, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  symptomBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  symptomBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  tabBar: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 12, padding: 4, marginBottom: 14, gap: 3 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 9, borderRadius: 9, gap: 4 },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 11, fontWeight: "600", color: "rgba(255,255,255,0.7)" },
  tabTextActive: { color: ACC, fontWeight: "700" },
  riskBanner: { flexDirection: "row", margin: 16, marginBottom: 0, padding: 14, backgroundColor: "#e8608a10", borderRadius: 14, borderWidth: 1, borderColor: "#e8608a30", gap: 10 },
  riskTitle: { fontSize: 13, fontWeight: "700", color: "#e8608a", marginBottom: 4 },
  riskItem: { fontSize: 12, color: "#e8608a", lineHeight: 17 },
  disclaimer: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginHorizontal: 16, marginTop: 12, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 10 },
  disclaimerText: { flex: 1, fontSize: 11, color: "#888", lineHeight: 15 },
  metricsRow: { flexDirection: "row", marginHorizontal: 16, gap: 10 },
  ringsRow: { flexDirection: "row", justifyContent: "space-around", marginHorizontal: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  vitalsCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  vitalsRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  vitalsLabel: { flex: 1, fontSize: 14, fontWeight: "600" },
  vitalsVal: { fontSize: 13, fontWeight: "700" },
  logVitalsBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, margin: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  logVitalsBtnText: { fontSize: 14, fontWeight: "700" },
  quickActions: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: 12, gap: 10 },
  quickAction: { width: "45%", marginHorizontal: "2.5%", borderRadius: 16, borderWidth: 1, padding: 14, alignItems: "center", gap: 8 },
  quickActionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quickActionLabel: { fontSize: 12, fontWeight: "700", textAlign: "center" },
  nutrientCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 14, borderWidth: 1, padding: 14 },
  nutrientHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  nutrientName: { flex: 1, fontSize: 14, fontWeight: "700" },
  nutrientTarget: { fontSize: 12, fontWeight: "700" },
  nutrientFoods: { fontSize: 12, lineHeight: 17 },
  card: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: "hidden", marginBottom: 4 },
  stepGoalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  stepGoalTitle: { fontSize: 12, color: "#888", fontWeight: "600", marginBottom: 2 },
  stepGoalNum: { fontSize: 28, fontWeight: "900", letterSpacing: -1 },
  stepGoalSub: { fontSize: 11, color: "#aaa" },
  logStepsBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  stepBar: { height: 8, borderRadius: 4, marginHorizontal: 16, marginBottom: 6 },
  stepBarFill: { height: 8, borderRadius: 4 },
  stepBarLabel: { fontSize: 12, color: "#888", textAlign: "center", paddingBottom: 16 },
  exerciseDisclaimer: { fontSize: 11, margin: 16, marginBottom: 0, lineHeight: 15 },
  exerciseRow: { flexDirection: "row", gap: 12, padding: 14, alignItems: "flex-start" },
  exerciseDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  exerciseNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  exerciseName: { flex: 1, fontSize: 14, fontWeight: "700" },
  exerciseBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  exerciseBadgeText: { fontSize: 11, fontWeight: "700" },
  exerciseNote: { fontSize: 12, lineHeight: 17 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 19 },
  bmiLabel: { fontSize: 13, fontWeight: "600", marginBottom: 10, padding: 14, paddingBottom: 0 },
  bmiTabs: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 14, paddingBottom: 14 },
  bmiTab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0" },
  bmiTabText: { fontSize: 12, fontWeight: "600" },
  whoRange: { margin: 14, marginTop: 0, padding: 10, borderRadius: 10, alignItems: "center" },
  whoRangeText: { fontSize: 13, fontWeight: "700" },
  weightStats: { flexDirection: "row", marginHorizontal: 16, gap: 10, marginBottom: 16 },
  weightStatCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center" },
  weightStatNum: { fontSize: 24, fontWeight: "900", letterSpacing: -1 },
  weightStatLabel: { fontSize: 11, color: "#888", fontWeight: "600", textAlign: "center" },
  cardSectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, padding: 14, paddingBottom: 0 },
  weightEntry: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  weightEntryWeek: { fontSize: 13, fontWeight: "500", flex: 1 },
  weightEntryKg: { fontSize: 15, fontWeight: "700" },
  addWeightBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginHorizontal: 16, marginTop: 14, padding: 16, borderRadius: 16 },
  addWeightBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  sleepSummaryRow: { flexDirection: "row", alignItems: "center", gap: 16, padding: 16, paddingBottom: 0 },
  sleepSummaryLeft: { alignItems: "center" },
  sleepBigNum: { fontSize: 40, fontWeight: "900", letterSpacing: -2 },
  sleepBigLabel: { fontSize: 11, color: "#888", fontWeight: "600", marginTop: -4 },
  sleepAvg: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  sleepTarget: { fontSize: 12 },
  positionRow: { flexDirection: "row", gap: 12, padding: 14, alignItems: "flex-start" },
  positionDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  positionTitle: { fontSize: 13, fontWeight: "700", marginBottom: 4 },
  positionTip: { fontSize: 13, lineHeight: 19 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#1a1a2e" },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 4 },
  inputNormal: { fontSize: 11, marginBottom: 6 },
  inputField: { borderWidth: 1.5, borderRadius: 12, padding: 14, fontSize: 16 },
  saveBtn: { borderRadius: 14, padding: 16, alignItems: "center", justifyContent: "center", marginTop: 8 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
