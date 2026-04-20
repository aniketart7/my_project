import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { usePregnancy } from "@/context/PregnancyContext";
import { SYMPTOM_RULES, SYMPTOM_CATEGORIES, type SymptomSeverity } from "@/data/fitnessData";

const SEVERITY_CONFIG: Record<SymptomSeverity, { label: string; color: string; bg: string; icon: string }> = {
  normal: { label: "Normal", color: "#6db58a", bg: "#6db58a12", icon: "check-circle" },
  watch:  { label: "Watch & wait", color: "#f0a500", bg: "#f0a50012", icon: "eye" },
  seek:   { label: "Seek care immediately", color: "#e8608a", bg: "#e8608a12", icon: "alert-circle" },
};

export default function SymptomsScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const { currentWeek } = usePregnancy();
  const trimester = currentWeek <= 13 ? 1 : currentWeek <= 26 ? 2 : 3;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showResults, setShowResults] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  // Filter symptoms by trimester and category
  const filteredSymptoms = useMemo(() => {
    return SYMPTOM_RULES.filter(s => {
      const trimMatch = s.trimester.includes(trimester);
      const catMatch = activeCategory === "All" || s.category === activeCategory;
      return trimMatch && catMatch;
    });
  }, [trimester, activeCategory]);

  const toggleSymptom = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setShowResults(false);
  };

  const selectedRules = SYMPTOM_RULES.filter(s => selectedIds.has(s.id));

  // Determine highest severity among selected
  const highestSeverity: SymptomSeverity = selectedRules.some(s => s.severity === "seek")
    ? "seek"
    : selectedRules.some(s => s.severity === "watch")
    ? "watch"
    : "normal";

  const categories = ["All", ...SYMPTOM_CATEGORIES];

  const check = () => {
    if (selectedIds.size === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowResults(true);
  };

  const reset = () => {
    setSelectedIds(new Set());
    setShowResults(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Symptom Checker</Text>
          <Text style={styles.sub}>Week {currentWeek} · Trimester {trimester}</Text>
        </View>
        {selectedIds.size > 0 && (
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Feather name="refresh-ccw" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: "#f5f5f5" }]}>
          <Feather name="info" size={14} color="#888" />
          <Text style={styles.disclaimerText}>
            This tool is for general wellness guidance only. Always consult your OB/GYN for any health concerns.
          </Text>
        </View>

        <Text style={[styles.instruction, { color: c.mutedForeground }]}>
          Select all symptoms you are currently experiencing:
        </Text>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && { backgroundColor: "#e8608a", borderColor: "#e8608a" }]}
              onPress={() => { setActiveCategory(cat); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.catChipText, activeCategory === cat && { color: "#fff" }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Symptom list */}
        <View style={styles.symptomList}>
          {filteredSymptoms.map(symptom => {
            const isSelected = selectedIds.has(symptom.id);
            const cfg = SEVERITY_CONFIG[symptom.severity];
            return (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  { borderColor: isSelected ? cfg.color : c.border, backgroundColor: isSelected ? cfg.bg : c.card },
                  isSelected && { borderWidth: 1.5 },
                ]}
                onPress={() => toggleSymptom(symptom.id)}
                activeOpacity={0.8}
              >
                <View style={styles.symptomLeft}>
                  <View style={[styles.checkbox, isSelected && { backgroundColor: cfg.color, borderColor: cfg.color }]}>
                    {isSelected && <Feather name="check" size={12} color="#fff" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.symptomLabel, { color: c.foreground }, isSelected && { color: cfg.color, fontWeight: "700" }]}>
                      {symptom.label}
                    </Text>
                    <Text style={[styles.symptomCat, { color: c.mutedForeground }]}>{symptom.category}</Text>
                  </View>
                </View>
                <View style={[styles.severityPill, { backgroundColor: cfg.color + "20" }]}>
                  <Text style={[styles.severityPillText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results */}
        {showResults && selectedIds.size > 0 && (
          <View style={[styles.resultsCard, { borderColor: SEVERITY_CONFIG[highestSeverity].color, backgroundColor: SEVERITY_CONFIG[highestSeverity].bg }]}>
            <View style={styles.resultsHeader}>
              <Feather name={SEVERITY_CONFIG[highestSeverity].icon as any} size={22} color={SEVERITY_CONFIG[highestSeverity].color} />
              <Text style={[styles.resultsTitle, { color: SEVERITY_CONFIG[highestSeverity].color }]}>
                {SEVERITY_CONFIG[highestSeverity].label}
              </Text>
            </View>
            {highestSeverity === "seek" && (
              <Text style={[styles.resultsUrgent, { color: "#e8608a" }]}>
                One or more of your symptoms require immediate medical attention. Please contact your doctor or go to the nearest hospital right away.
              </Text>
            )}
            {highestSeverity === "watch" && (
              <Text style={[styles.resultsNote, { color: "#f0a500" }]}>
                Some of your symptoms need monitoring. Mention them at your next doctor visit. Seek care if they worsen.
              </Text>
            )}
            {highestSeverity === "normal" && (
              <Text style={[styles.resultsNote, { color: "#6db58a" }]}>
                Your symptoms appear normal for this stage of pregnancy. Follow the guidance below and mention them at your next visit.
              </Text>
            )}

            {/* Per-symptom guidance */}
            {selectedRules.map(s => (
              <View key={s.id} style={[styles.guidanceRow, { borderColor: SEVERITY_CONFIG[s.severity].color + "30" }]}>
                <View style={[styles.guidanceDot, { backgroundColor: SEVERITY_CONFIG[s.severity].color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.guidanceSymptom, { color: SEVERITY_CONFIG[s.severity].color }]}>{s.label}</Text>
                  <Text style={[styles.guidanceText, { color: c.foreground }]}>{s.guidance}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Check button */}
      {!showResults && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={[styles.checkBtn, selectedIds.size === 0 && { opacity: 0.4 }]}
            onPress={check}
            disabled={selectedIds.size === 0}
            activeOpacity={0.85}
          >
            <Feather name="shield" size={18} color="#fff" />
            <Text style={styles.checkBtnText}>
              {selectedIds.size === 0 ? "Select symptoms above" : `Check ${selectedIds.size} symptom${selectedIds.size > 1 ? "s" : ""}`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {showResults && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={[styles.checkBtn, { backgroundColor: "#6db58a" }]} onPress={reset} activeOpacity={0.85}>
            <Feather name="refresh-ccw" size={18} color="#fff" />
            <Text style={styles.checkBtnText}>Check again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: "#e8608a" },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  resetBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "800", color: "#fff" },
  sub: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  disclaimer: { flexDirection: "row", alignItems: "flex-start", gap: 8, margin: 16, marginBottom: 4, padding: 12, borderRadius: 12 },
  disclaimerText: { flex: 1, fontSize: 12, color: "#888", lineHeight: 17 },
  instruction: { fontSize: 14, fontWeight: "600", marginHorizontal: 16, marginTop: 12, marginBottom: 8 },
  catScroll: { marginBottom: 12 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#fff" },
  catChipText: { fontSize: 13, fontWeight: "600", color: "#666" },
  symptomList: { marginHorizontal: 16, gap: 8 },
  symptomCard: { borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  symptomLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: "#ccc", alignItems: "center", justifyContent: "center" },
  symptomLabel: { fontSize: 14, fontWeight: "500", lineHeight: 19 },
  symptomCat: { fontSize: 11, fontWeight: "500", marginTop: 2 },
  severityPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  severityPillText: { fontSize: 10, fontWeight: "700" },
  resultsCard: { margin: 16, marginTop: 20, borderRadius: 18, borderWidth: 1.5, padding: 16 },
  resultsHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  resultsTitle: { fontSize: 18, fontWeight: "800" },
  resultsUrgent: { fontSize: 14, fontWeight: "600", lineHeight: 20, marginBottom: 16 },
  resultsNote: { fontSize: 14, fontWeight: "500", lineHeight: 20, marginBottom: 16 },
  guidanceRow: { borderTopWidth: 1, paddingTop: 12, marginTop: 8, flexDirection: "row", gap: 10 },
  guidanceDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  guidanceSymptom: { fontSize: 13, fontWeight: "700", marginBottom: 4 },
  guidanceText: { fontSize: 13, lineHeight: 19 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 12, backgroundColor: "rgba(255,255,255,0.95)" },
  checkBtn: { backgroundColor: "#e8608a", borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  checkBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
