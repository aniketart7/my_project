import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePregnancy } from "@/context/PregnancyContext";

const TOTAL_STEPS = 4;

// ── Step indicator ────────────────────────────────────────
function StepDots({ step }: { step: number }) {
  return (
    <View style={dot.row}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={[
            dot.base,
            i === step ? dot.active : i < step ? dot.done : dot.idle,
          ]}
        />
      ))}
    </View>
  );
}
const dot = StyleSheet.create({
  row: { flexDirection: "row", gap: 6, justifyContent: "center", marginBottom: 28 },
  base: { height: 6, borderRadius: 3 },
  active: { width: 22, backgroundColor: "#e8608a" },
  done: { width: 6, backgroundColor: "#e8608a80" },
  idle: { width: 6, backgroundColor: "#e0e0e0" },
});

// ── Week stepper ──────────────────────────────────────────
function WeekStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={ws.row}>
      <TouchableOpacity
        style={[ws.btn, value <= 1 && { opacity: 0.3 }]}
        onPress={() => { if (value > 1) { onChange(value - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } }}
        disabled={value <= 1}
      >
        <Feather name="minus" size={20} color="#e8608a" />
      </TouchableOpacity>
      <View style={ws.valBox}>
        <Text style={ws.valNum}>{value}</Text>
        <Text style={ws.valLabel}>of 40 weeks</Text>
      </View>
      <TouchableOpacity
        style={[ws.btn, value >= 40 && { opacity: 0.3 }]}
        onPress={() => { if (value < 40) { onChange(value + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } }}
        disabled={value >= 40}
      >
        <Feather name="plus" size={20} color="#e8608a" />
      </TouchableOpacity>
    </View>
  );
}
const ws = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, justifyContent: "center", marginVertical: 12 },
  btn: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#e8608a15", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#e8608a30" },
  valBox: { alignItems: "center", minWidth: 90 },
  valNum: { fontSize: 48, fontWeight: "900", color: "#e8608a", letterSpacing: -2 },
  valLabel: { fontSize: 13, color: "#e8608a80", fontWeight: "600", marginTop: -4 },
});

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { setMomName, setDadName, setCurrentWeek, setLmpDate, completeSetup } = usePregnancy();

  const [step, setStep] = useState(0);
  const [localMomName, setLocalMomName] = useState("");
  const [localDadName, setLocalDadName] = useState("");
  const [weekMode, setWeekMode] = useState<"week" | "lmp">("week");
  const [localWeek, setLocalWeek] = useState(8);
  const [lmpDay, setLmpDay] = useState("");
  const [lmpMonth, setLmpMonth] = useState("");
  const [lmpYear, setLmpYear] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -30, duration: 120, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start();
    setStep((s) => s + 1);
  };

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep((s) => s - 1);
  };

  const finish = () => {
    // Persist everything
    if (localMomName.trim()) setMomName(localMomName.trim());
    if (localDadName.trim()) setDadName(localDadName.trim());

    if (weekMode === "lmp") {
      const d = parseInt(lmpDay), m = parseInt(lmpMonth) - 1, y = parseInt(lmpYear);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y > 2000) {
        setLmpDate(new Date(y, m, d));
      } else {
        setCurrentWeek(localWeek);
      }
    } else {
      setCurrentWeek(localWeek);
    }

    completeSetup();
    router.replace("/");
  };

  const lmpValid = () => {
    if (weekMode === "week") return true;
    const d = parseInt(lmpDay), m = parseInt(lmpMonth), y = parseInt(lmpYear);
    return d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 2020 && y <= 2026;
  };

  const topPad = Platform.OS === "web" ? 60 : insets.top;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff8f9" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ─── STEP 0: Welcome ─── */}
        {step === 0 && (
          <View style={styles.stepWrap}>
            <View style={styles.welcomeHero}>
              {/* Decorative circles */}
              <View style={[styles.circle, styles.circleOuter]} />
              <View style={[styles.circle, styles.circleMid]} />
              <View style={[styles.circle, styles.circleInner]} />
              <Text style={styles.heroEmoji}>🤰</Text>
            </View>

            <Text style={styles.welcomeTitle}>Your Pregnancy{"\n"}Journey Starts Here</Text>
            <Text style={styles.welcomeSub}>
              A beautiful companion for every week of your 40-week journey — for mom, dad, and baby together.
            </Text>

            <View style={styles.featureList}>
              {[
                { icon: "calendar", text: "Week-by-week fetal development" },
                { icon: "heart", text: "Mom & Dad guides every week" },
                { icon: "activity", text: "Health vitals & test tracker" },
                { icon: "wind", text: "Yoga, mantras & garbhasanskar" },
              ].map((f) => (
                <View key={f.icon} style={styles.featureRow}>
                  <View style={styles.featureIcon}>
                    <Feather name={f.icon as any} size={16} color="#e8608a" />
                  </View>
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={goNext} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Begin Journey</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ─── STEP 1: Names ─── */}
        {step === 1 && (
          <Animated.View style={[styles.stepWrap, { transform: [{ translateY: slideAnim }] }]}>
            <StepDots step={step} />
            <View style={styles.stepIcon}>
              <Text style={{ fontSize: 40 }}>👩‍👨‍👧</Text>
            </View>
            <Text style={styles.stepTitle}>Let's personalise{"\n"}your journey</Text>
            <Text style={styles.stepSub}>
              Tell us a little about yourselves. You can always change these later in settings.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mom's name</Text>
              <TextInput
                style={styles.input}
                value={localMomName}
                onChangeText={setLocalMomName}
                placeholder="e.g. Priya"
                placeholderTextColor="#ccc"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dad / Partner's name <Text style={styles.inputOptional}>(optional)</Text></Text>
              <TextInput
                style={styles.input}
                value={localDadName}
                onChangeText={setLocalDadName}
                placeholder="e.g. Arjun"
                placeholderTextColor="#ccc"
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={goBack}>
                <Feather name="arrow-left" size={18} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }]}
                onPress={goNext}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>
                  {localMomName.trim() ? `Hi, ${localMomName.trim()}! Continue` : "Continue"}
                </Text>
                <Feather name="arrow-right" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* ─── STEP 2: Week / LMP ─── */}
        {step === 2 && (
          <Animated.View style={[styles.stepWrap, { transform: [{ translateY: slideAnim }] }]}>
            <StepDots step={step} />
            <View style={styles.stepIcon}>
              <Text style={{ fontSize: 40 }}>📅</Text>
            </View>
            <Text style={styles.stepTitle}>How far along{"\n"}are you?</Text>
            <Text style={styles.stepSub}>
              Set your current week directly, or enter your last menstrual cycle date to calculate it automatically.
            </Text>

            {/* Mode tabs */}
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[styles.modeTab, weekMode === "week" && styles.modeTabActive]}
                onPress={() => setWeekMode("week")}
              >
                <Feather name="hash" size={14} color={weekMode === "week" ? "#e8608a" : "#999"} />
                <Text style={[styles.modeTabText, weekMode === "week" && { color: "#e8608a" }]}>
                  Current Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeTab, weekMode === "lmp" && styles.modeTabActive]}
                onPress={() => setWeekMode("lmp")}
              >
                <Feather name="calendar" size={14} color={weekMode === "lmp" ? "#e8608a" : "#999"} />
                <Text style={[styles.modeTabText, weekMode === "lmp" && { color: "#e8608a" }]}>
                  Last Period Date
                </Text>
              </TouchableOpacity>
            </View>

            {weekMode === "week" && (
              <View style={styles.weekPickerWrap}>
                <Text style={styles.weekPickerHint}>Move the arrows to set your current pregnancy week</Text>
                <WeekStepper value={localWeek} onChange={setLocalWeek} />
                <View style={[styles.trimesterTag, { backgroundColor: localWeek <= 13 ? "#e8608a15" : localWeek <= 26 ? "#9b6db515" : "#5b8fd615" }]}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: localWeek <= 13 ? "#e8608a" : localWeek <= 26 ? "#9b6db5" : "#5b8fd6" }}>
                    {localWeek <= 13 ? "First Trimester" : localWeek <= 26 ? "Second Trimester" : "Third Trimester"}
                    {"  ·  "}~{Math.round((localWeek / 40) * 100)}% complete
                  </Text>
                </View>
              </View>
            )}

            {weekMode === "lmp" && (
              <View style={styles.lmpWrap}>
                <Text style={styles.weekPickerHint}>Enter the first day of your last menstrual period</Text>
                <View style={styles.lmpRow}>
                  <View style={styles.lmpField}>
                    <Text style={styles.lmpFieldLabel}>Day</Text>
                    <TextInput
                      style={styles.lmpInput}
                      value={lmpDay}
                      onChangeText={(t) => setLmpDay(t.replace(/\D/g, "").slice(0, 2))}
                      placeholder="DD"
                      placeholderTextColor="#ccc"
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.lmpField}>
                    <Text style={styles.lmpFieldLabel}>Month</Text>
                    <TextInput
                      style={styles.lmpInput}
                      value={lmpMonth}
                      onChangeText={(t) => setLmpMonth(t.replace(/\D/g, "").slice(0, 2))}
                      placeholder="MM"
                      placeholderTextColor="#ccc"
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <View style={[styles.lmpField, { flex: 1.5 }]}>
                    <Text style={styles.lmpFieldLabel}>Year</Text>
                    <TextInput
                      style={styles.lmpInput}
                      value={lmpYear}
                      onChangeText={(t) => setLmpYear(t.replace(/\D/g, "").slice(0, 4))}
                      placeholder="YYYY"
                      placeholderTextColor="#ccc"
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                </View>
                {lmpValid() && lmpDay && lmpMonth && lmpYear.length === 4 && (
                  <View style={[styles.trimesterTag, { backgroundColor: "#6db58a15" }]}>
                    <Feather name="check-circle" size={13} color="#6db58a" />
                    <Text style={{ fontSize: 13, fontWeight: "600", color: "#6db58a" }}>
                      {"  "}Due date will be calculated automatically
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={goBack}>
                <Feather name="arrow-left" size={18} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }, !lmpValid() && { opacity: 0.5 }]}
                onPress={goNext}
                disabled={!lmpValid()}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Continue</Text>
                <Feather name="arrow-right" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* ─── STEP 3: All set ─── */}
        {step === 3 && (
          <Animated.View style={[styles.stepWrap, { transform: [{ translateY: slideAnim }] }]}>
            <StepDots step={step} />

            <View style={styles.doneHero}>
              <View style={[styles.circle, styles.circleOuter, { borderColor: "#6db58a30" }]} />
              <View style={[styles.circle, styles.circleMid, { borderColor: "#6db58a20" }]} />
              <Text style={styles.heroEmoji}>🌸</Text>
            </View>

            <Text style={styles.stepTitle}>You're all set{"\n"}{localMomName.trim() ? localMomName.trim() + "!" : "!"}</Text>
            <Text style={styles.stepSub}>
              Your pregnancy journey is ready. Explore week-by-week updates, track your health, and nurture your bond with baby.
            </Text>

            <View style={styles.summaryCard}>
              {localMomName.trim() && (
                <View style={styles.summaryRow}>
                  <Feather name="heart" size={15} color="#e8608a" />
                  <Text style={styles.summaryText}>Mom: <Text style={{ fontWeight: "700" }}>{localMomName.trim()}</Text></Text>
                </View>
              )}
              {localDadName.trim() && (
                <View style={styles.summaryRow}>
                  <Feather name="user" size={15} color="#5b8fd6" />
                  <Text style={styles.summaryText}>Partner: <Text style={{ fontWeight: "700" }}>{localDadName.trim()}</Text></Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Feather name="calendar" size={15} color="#9b6db5" />
                <Text style={styles.summaryText}>
                  {weekMode === "week"
                    ? `Starting at Week ${localWeek}`
                    : `LMP: ${lmpDay}/${lmpMonth}/${lmpYear}`}
                </Text>
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={goBack}>
                <Feather name="arrow-left" size={18} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, { flex: 1, backgroundColor: "#6db58a" }]} onPress={finish} activeOpacity={0.85}>
                <Text style={styles.primaryBtnText}>Start My Journey</Text>
                <Feather name="arrow-right" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  // ── Step wrapper ──────────────────────────────────────
  stepWrap: {
    flex: 1,
    paddingTop: 20,
  },

  // ── Welcome hero ──────────────────────────────────────
  welcomeHero: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginBottom: 12,
  },
  circle: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  circleOuter: { width: 180, height: 180, borderColor: "#e8608a20" },
  circleMid: { width: 130, height: 130, borderColor: "#e8608a30" },
  circleInner: { width: 80, height: 80, borderColor: "#e8608a40" },
  heroEmoji: { fontSize: 60 },

  welcomeTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 14,
  },
  welcomeSub: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  featureList: {
    gap: 12,
    marginBottom: 36,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e8608a12",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // ── Step content ──────────────────────────────────────
  stepIcon: {
    alignItems: "center",
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 10,
  },
  stepSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },

  // ── Inputs ────────────────────────────────────────────
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  inputOptional: {
    color: "#aaa",
    fontWeight: "400",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#f0e0e5",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#222",
    ...Platform.select({
      ios: { shadowColor: "#e8608a", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
    }),
    elevation: 1,
  },

  // ── Mode tabs ─────────────────────────────────────────
  modeTabs: {
    flexDirection: "row",
    backgroundColor: "#f5f5f8",
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  modeTabActive: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
    }),
    elevation: 2,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },

  // ── Week picker ───────────────────────────────────────
  weekPickerWrap: { alignItems: "center", gap: 8 },
  weekPickerHint: { fontSize: 13, color: "#999", textAlign: "center" },
  trimesterTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },

  // ── LMP inputs ────────────────────────────────────────
  lmpWrap: { gap: 10 },
  lmpRow: { flexDirection: "row", gap: 10 },
  lmpField: { flex: 1, gap: 6 },
  lmpFieldLabel: { fontSize: 12, fontWeight: "600", color: "#888" },
  lmpInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#f0e0e5",
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },

  // ── Done hero ─────────────────────────────────────────
  doneHero: {
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    marginBottom: 12,
  },

  // ── Summary card ──────────────────────────────────────
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0e0e5",
    padding: 16,
    gap: 12,
    marginBottom: 28,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
    }),
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryText: {
    fontSize: 14,
    color: "#555",
  },

  // ── Buttons ───────────────────────────────────────────
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#e8608a",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#f5f5f8",
    alignItems: "center",
    justifyContent: "center",
  },
});
