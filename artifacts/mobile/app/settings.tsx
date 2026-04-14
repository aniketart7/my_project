import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { DietaryPreference, usePregnancy } from "@/context/PregnancyContext";
import { DIETARY_COLORS, DIETARY_LABELS } from "@/data/dietaryData";
import { COUNTRIES_LIST, COUNTRY_REGION_MAP } from "@/data/soulfulData";

type WeekMode = "lmp" | "manual";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function parseDMY(str: string): Date | null {
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const y = parseInt(parts[2], 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  const date = new Date(y, m, d);
  if (isNaN(date.getTime())) return null;
  return date;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const {
    currentWeek,
    setCurrentWeek,
    lmpDate,
    setLmpDate,
    dueDate,
    momName,
    setMomName,
    dadName,
    setDadName,
    babyName,
    setBabyName,
    dietaryPreference,
    setDietaryPreference,
    country,
    setCountry,
  } = usePregnancy();

  const [weekMode, setWeekMode] = useState<WeekMode>(lmpDate ? "lmp" : "manual");
  const [tempMom, setTempMom] = useState(momName);
  const [tempDad, setTempDad] = useState(dadName);
  const [tempBaby, setTempBaby] = useState(babyName);
  const [tempWeek, setTempWeek] = useState(currentWeek.toString());
  const [tempLmp, setTempLmp] = useState(
    lmpDate ? `${lmpDate.getDate().toString().padStart(2, "0")}/${(lmpDate.getMonth() + 1).toString().padStart(2, "0")}/${lmpDate.getFullYear()}` : ""
  );
  const [lmpError, setLmpError] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSave = () => {
    if (weekMode === "lmp") {
      const lmp = parseDMY(tempLmp);
      if (!lmp) {
        setLmpError("Enter date as DD/MM/YYYY");
        return;
      }
      if (lmp > new Date()) {
        setLmpError("LMP date cannot be in the future");
        return;
      }
      const diffWeeks = Math.floor((Date.now() - lmp.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (diffWeeks > 42) {
        setLmpError("Date is too far in the past");
        return;
      }
      setLmpDate(lmp);
    } else {
      const week = parseInt(tempWeek, 10);
      if (isNaN(week) || week < 1 || week > 40) {
        Alert.alert("Invalid week", "Please enter a week between 1 and 40");
        return;
      }
      setLmpDate(null);
      setCurrentWeek(week);
    }
    setMomName(tempMom);
    setDadName(tempDad);
    setBabyName(tempBaby || "Baby");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const calcWeekFromLmp = (): number | null => {
    const lmp = parseDMY(tempLmp);
    if (!lmp) return null;
    const week = Math.floor((Date.now() - lmp.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    return Math.max(1, Math.min(40, week));
  };

  const previewWeek = weekMode === "lmp" ? calcWeekFromLmp() : parseInt(tempWeek, 10);
  const previewDueDate =
    weekMode === "lmp" && parseDMY(tempLmp)
      ? new Date(parseDMY(tempLmp)!.getTime() + 280 * 24 * 60 * 60 * 1000)
      : dueDate;

  const dietOptions: DietaryPreference[] = ["veg", "nonveg", "vegan"];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: "#e8608a" }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── YOUR JOURNEY ─── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>YOUR JOURNEY</Text>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {/* Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                weekMode === "lmp" && { backgroundColor: "#e8608a" },
              ]}
              onPress={() => { setWeekMode("lmp"); setLmpError(""); }}
            >
              <Feather name="calendar" size={14} color={weekMode === "lmp" ? "#fff" : c.mutedForeground} />
              <Text style={[styles.toggleText, weekMode === "lmp" ? styles.toggleTextActive : { color: c.mutedForeground }]}>
                Last Menstrual Period
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                weekMode === "manual" && { backgroundColor: "#e8608a" },
              ]}
              onPress={() => setWeekMode("manual")}
            >
              <Feather name="hash" size={14} color={weekMode === "manual" ? "#fff" : c.mutedForeground} />
              <Text style={[styles.toggleText, weekMode === "manual" ? styles.toggleTextActive : { color: c.mutedForeground }]}>
                Current Week
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.separator, { backgroundColor: c.border }]} />

          {weekMode === "lmp" ? (
            <View style={styles.lmpSection}>
              <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>
                First day of your last period (DD/MM/YYYY)
              </Text>
              <TextInput
                style={[
                  styles.lmpInput,
                  {
                    color: c.foreground,
                    backgroundColor: c.secondary,
                    borderColor: lmpError ? "#ef4444" : c.border,
                  },
                ]}
                value={tempLmp}
                onChangeText={(t) => { setTempLmp(t); setLmpError(""); }}
                placeholder="e.g. 15/09/2025"
                placeholderTextColor={c.mutedForeground}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />
              {lmpError ? (
                <Text style={styles.errorText}>{lmpError}</Text>
              ) : null}
              {previewWeek && !lmpError && tempLmp.length === 10 ? (
                <View style={[styles.previewBox, { backgroundColor: "#e8608a10", borderColor: "#e8608a30" }]}>
                  <View style={styles.previewRow}>
                    <Feather name="baby" size={14} color="#e8608a" />
                    <Text style={[styles.previewText, { color: "#e8608a" }]}>
                      You are currently on Week {previewWeek}
                    </Text>
                  </View>
                  {previewDueDate && (
                    <View style={styles.previewRow}>
                      <Feather name="gift" size={14} color="#9b6db5" />
                      <Text style={[styles.previewText, { color: "#9b6db5" }]}>
                        Estimated due date: {formatDate(previewDueDate)}
                      </Text>
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.weekSection}>
              <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>Current Week</Text>
              <View style={styles.weekSelector}>
                <TouchableOpacity
                  style={[styles.weekBtn, { backgroundColor: "#e8608a20" }]}
                  onPress={() => {
                    const w = Math.max(1, parseInt(tempWeek, 10) - 1);
                    setTempWeek(w.toString());
                    Haptics.selectionAsync();
                  }}
                >
                  <Feather name="minus" size={18} color="#e8608a" />
                </TouchableOpacity>
                <Text style={[styles.weekValue, { color: c.foreground }]}>Week {tempWeek}</Text>
                <TouchableOpacity
                  style={[styles.weekBtn, { backgroundColor: "#e8608a20" }]}
                  onPress={() => {
                    const w = Math.min(40, parseInt(tempWeek, 10) + 1);
                    setTempWeek(w.toString());
                    Haptics.selectionAsync();
                  }}
                >
                  <Feather name="plus" size={18} color="#e8608a" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* ─── DIETARY PREFERENCE ─── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>DIETARY PREFERENCE</Text>
        <Text style={[styles.sectionSubLabel, { color: c.mutedForeground }]}>
          We'll personalise diet recommendations for you
        </Text>

        <View style={styles.dietOptions}>
          {dietOptions.map((option) => {
            const isSelected = dietaryPreference === option;
            const accentColor = DIETARY_COLORS[option];
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dietOption,
                  {
                    backgroundColor: isSelected ? accentColor + "18" : c.card,
                    borderColor: isSelected ? accentColor : c.border,
                  },
                ]}
                onPress={() => {
                  setDietaryPreference(option);
                  Haptics.selectionAsync();
                }}
              >
                <Text style={styles.dietEmoji}>
                  {option === "veg" ? "🥦" : option === "nonveg" ? "🍗" : "🌱"}
                </Text>
                <Text
                  style={[
                    styles.dietLabel,
                    { color: isSelected ? accentColor : c.foreground },
                  ]}
                >
                  {DIETARY_LABELS[option]}
                </Text>
                {isSelected && (
                  <View style={[styles.checkDot, { backgroundColor: accentColor }]}>
                    <Feather name="check" size={10} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Preferred foods note */}
        <View style={[styles.prefNote, { backgroundColor: c.card, borderColor: c.border }]}>
          <Feather name="info" size={14} color={DIETARY_COLORS[dietaryPreference]} />
          <Text style={[styles.prefNoteText, { color: c.mutedForeground }]}>
            {dietaryPreference === "veg"
              ? "You'll see vegetarian-friendly diet tips — dairy, eggs, and plant-based proteins included."
              : dietaryPreference === "nonveg"
              ? "You'll see diet tips including lean meats, fish, and eggs alongside plant-based options."
              : "You'll see fully plant-based diet tips with special attention to B12, iron, calcium, and DHA."}
          </Text>
        </View>
      </View>

      {/* ─── COUNTRY / REGION ─── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>COUNTRY OF ORIGIN</Text>
        <Text style={[styles.sectionSubLabel, { color: c.mutedForeground }]}>
          Personalises mantras, music and spiritual guidance recommendations
        </Text>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 12, gap: 8 }}
          >
            {COUNTRIES_LIST.map((c_name) => {
              const isSelected = country === c_name;
              const regionKey = COUNTRY_REGION_MAP[c_name];
              const regionColors: Record<string, string> = {
                india: "#e8608a",
                western: "#5b8fd6",
                islamic: "#6db58a",
                eastasian: "#ef6c4b",
              };
              const accent = regionColors[regionKey] || "#9b6db5";
              return (
                <TouchableOpacity
                  key={c_name}
                  style={[
                    styles.countryChip,
                    isSelected
                      ? { backgroundColor: accent, borderColor: accent }
                      : { backgroundColor: c.background, borderColor: c.border },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCountry(c_name);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.countryChipText,
                      { color: isSelected ? "#fff" : c.foreground },
                    ]}
                  >
                    {c_name}
                  </Text>
                  {isSelected && <Feather name="check" size={12} color="#fff" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={[styles.currentCountryRow, { borderTopColor: c.border }]}>
            <Feather name="map-pin" size={14} color="#9b6db5" />
            <Text style={[styles.currentCountryText, { color: c.mutedForeground }]}>
              Selected: <Text style={{ fontWeight: "700", color: "#9b6db5" }}>{country}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* ─── PERSONALIZE ─── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>PERSONALIZE</Text>

        <View style={[styles.inputCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.inputRow}>
            <Feather name="heart" size={18} color="#e8608a" style={styles.inputIcon} />
            <View style={styles.inputContent}>
              <Text style={[styles.inputLabel, { color: c.mutedForeground }]}>Mom's Name</Text>
              <TextInput
                style={[styles.input, { color: c.foreground }]}
                value={tempMom}
                onChangeText={setTempMom}
                placeholder="Enter mom's name"
                placeholderTextColor={c.mutedForeground}
              />
            </View>
          </View>
          <View style={[styles.separator, { backgroundColor: c.border }]} />
          <View style={styles.inputRow}>
            <Feather name="user" size={18} color="#5b8fd6" style={styles.inputIcon} />
            <View style={styles.inputContent}>
              <Text style={[styles.inputLabel, { color: c.mutedForeground }]}>Dad's Name</Text>
              <TextInput
                style={[styles.input, { color: c.foreground }]}
                value={tempDad}
                onChangeText={setTempDad}
                placeholder="Enter dad's name"
                placeholderTextColor={c.mutedForeground}
              />
            </View>
          </View>
          <View style={[styles.separator, { backgroundColor: c.border }]} />
          <View style={styles.inputRow}>
            <Feather name="star" size={18} color="#6db58a" style={styles.inputIcon} />
            <View style={styles.inputContent}>
              <Text style={[styles.inputLabel, { color: c.mutedForeground }]}>Baby's Name</Text>
              <TextInput
                style={[styles.input, { color: c.foreground }]}
                value={tempBaby}
                onChangeText={setTempBaby}
                placeholder="Enter baby's name (optional)"
                placeholderTextColor={c.mutedForeground}
              />
            </View>
          </View>
        </View>
      </View>

      {/* ─── RESOURCES SHORTCUT ─── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>RESOURCES</Text>
        <TouchableOpacity
          style={[styles.resourcesBtn, { backgroundColor: c.card, borderColor: c.border }]}
          onPress={() => router.push("/resources")}
        >
          <View style={[styles.resourcesBtnIcon, { backgroundColor: "#9b6db520" }]}>
            <Feather name="external-link" size={20} color="#9b6db5" />
          </View>
          <View style={styles.resourcesBtnContent}>
            <Text style={[styles.resourcesBtnTitle, { color: c.foreground }]}>
              Pregnancy Resources
            </Text>
            <Text style={[styles.resourcesBtnSub, { color: c.mutedForeground }]}>
              Curated links for nutrition, exercise, mental health &amp; more
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={c.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* ─── ABOUT ─── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>ABOUT</Text>
        <View style={[styles.aboutCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.aboutTitle, { color: c.foreground }]}>Pregnancy Journey</Text>
          <Text style={[styles.aboutText, { color: c.mutedForeground }]}>
            Your week-by-week companion for both mom and dad. Track fetal development,
            get personalised diet guidance, and build a stronger bond through every step of
            this beautiful journey.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  saveBtnText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  section: { marginTop: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  sectionSubLabel: {
    fontSize: 12,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row",
    padding: 8,
    gap: 6,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  toggleTextActive: { color: "#ffffff" },
  separator: { height: 1 },
  lmpSection: { padding: 16, gap: 10 },
  fieldLabel: { fontSize: 12, fontWeight: "600" },
  lmpInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  errorText: { color: "#ef4444", fontSize: 12, fontWeight: "500" },
  previewBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },
  previewRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  previewText: { fontSize: 13, fontWeight: "600" },
  weekSection: { padding: 16, gap: 10 },
  weekSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weekBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  weekValue: { fontSize: 22, fontWeight: "700" },
  dietOptions: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  dietOption: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  dietEmoji: { fontSize: 22 },
  dietLabel: { fontSize: 11, fontWeight: "700", textAlign: "center" },
  checkDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  prefNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  prefNoteText: { flex: 1, fontSize: 13, lineHeight: 18 },
  inputCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  inputIcon: { flexShrink: 0 },
  inputContent: { flex: 1 },
  inputLabel: { fontSize: 11, fontWeight: "600", marginBottom: 4 },
  input: { fontSize: 15, fontWeight: "500", padding: 0 },
  resourcesBtn: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resourcesBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resourcesBtnContent: { flex: 1 },
  resourcesBtnTitle: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  resourcesBtnSub: { fontSize: 12, lineHeight: 16 },
  aboutCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  aboutTitle: { fontSize: 16, fontWeight: "700" },
  aboutText: { fontSize: 14, lineHeight: 22 },
  countryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  countryChipText: { fontSize: 13, fontWeight: "600" },
  currentCountryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  currentCountryText: { fontSize: 13 },
});
