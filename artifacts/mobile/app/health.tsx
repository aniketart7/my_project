import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
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
  getDietSuggestionsForResult,
  getTestById,
  scheduledTests,
  type HealthField,
  type HealthRecord,
  type ScheduledTest,
} from "@/data/healthData";

type TabType = "vital" | "blood" | "scan";

const TAB_COLOR: Record<TabType, string> = {
  vital: "#e8608a",
  blood: "#ef6c4b",
  scan: "#5b8fd6",
};

const TAB_ICON: Record<TabType, string> = {
  vital: "activity",
  blood: "droplet",
  scan: "eye",
};

const TAB_LABEL: Record<TabType, string> = {
  vital: "Vitals",
  blood: "Blood Tests",
  scan: "Scans",
};

const IMPORTANCE_COLOR: Record<string, string> = {
  routine: "#6db58a",
  important: "#f0a500",
  critical: "#e8608a",
};

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}:8080`;

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const { currentWeek, getRecordsForTest, addHealthRecord } = usePregnancy();

  const [activeTab, setActiveTab] = useState<TabType>("vital");
  const [modalTest, setModalTest] = useState<ScheduledTest | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formNotes, setFormNotes] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const trimester = currentWeek <= 13 ? 1 : currentWeek <= 26 ? 2 : 3;

  const filteredTests = scheduledTests.filter((t) => t.type === activeTab);

  const openModal = (test: ScheduledTest) => {
    setModalTest(test);
    setFormValues({});
    setFormNotes("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const closeModal = () => {
    setModalTest(null);
    setFormValues({});
    setFormNotes("");
  };

  const handleExtractFromPhoto = async () => {
    if (!modalTest) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo access to extract results.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const base64 = asset.base64;
    if (!base64) {
      Alert.alert("Error", "Could not read image. Please try again.");
      return;
    }

    setExtracting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await fetch(`${API_BASE}/extract-health`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: `data:image/jpeg;base64,${base64}`,
          testName: modalTest.name,
          fields: modalTest.fields,
        }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json() as { extracted: Record<string, string> };

      const extracted = data.extracted || {};
      const hasValues = Object.values(extracted).some((v) => v && v.trim() !== "");

      if (hasValues) {
        setFormValues(extracted);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "✅ Results Extracted!",
          "We've extracted values from your report. Please review and correct any errors before saving.",
          [{ text: "Review", style: "default" }]
        );
      } else {
        Alert.alert(
          "Could not extract",
          "The image may not be clear enough. Please enter values manually.",
          [{ text: "OK" }]
        );
      }
    } catch {
      Alert.alert(
        "Extraction failed",
        "Could not connect to extraction service. Please enter values manually.",
        [{ text: "OK" }]
      );
    } finally {
      setExtracting(false);
    }
  };

  const handleSave = () => {
    if (!modalTest) return;
    const hasAnyValue = Object.values(formValues).some((v) => v.trim() !== "");
    if (!hasAnyValue) {
      Alert.alert("No values", "Please enter at least one value before saving.");
      return;
    }

    setSaving(true);
    const dietSuggestions = getDietSuggestionsForResult(modalTest.id, formValues);
    const record: HealthRecord = {
      testId: modalTest.id,
      date: new Date().toISOString(),
      values: { ...formValues },
      notes: formNotes.trim(),
      dietSuggestions,
    };

    addHealthRecord(record);
    setSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeModal();

    if (dietSuggestions.length > 0) {
      setTimeout(() => {
        Alert.alert(
          "🍽️ Diet Suggestions",
          dietSuggestions.slice(0, 2).join("\n\n"),
          [{ text: "Got it", style: "default" }]
        );
      }, 400);
    }
  };

  const isTestDue = (test: ScheduledTest): boolean => {
    return currentWeek >= test.weekRange[0] && currentWeek <= test.weekRange[1];
  };

  const getLatestRecord = (testId: string): HealthRecord | undefined => {
    const records = getRecordsForTest(testId);
    return records[0];
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: "#ef6c4b" }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Health Tracker</Text>
            <Text style={styles.headerSubtitle}>
              Week {currentWeek} · Trimester {trimester}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {(["vital", "blood", "scan"] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab);
                Haptics.selectionAsync();
              }}
            >
              <Feather
                name={TAB_ICON[tab] as any}
                size={14}
                color={activeTab === tab ? "#ef6c4b" : "rgba(255,255,255,0.7)"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.tabTextActive : { color: "rgba(255,255,255,0.7)" },
                ]}
              >
                {TAB_LABEL[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 40, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Week info banner */}
        <View style={[styles.infoBanner, { backgroundColor: "#ef6c4b10", borderColor: "#ef6c4b30" }]}>
          <Feather name="calendar" size={13} color="#ef6c4b" />
          <Text style={[styles.infoBannerText, { color: c.mutedForeground }]}>
            Tests highlighted in pink are scheduled for your current week range.
          </Text>
        </View>

        {filteredTests.map((test) => {
          const isDue = isTestDue(test);
          const latestRecord = getLatestRecord(test.id);
          const recordCount = getRecordsForTest(test.id).length;

          return (
            <TouchableOpacity
              key={test.id}
              style={[
                styles.testCard,
                {
                  backgroundColor: c.card,
                  borderColor: isDue ? TAB_COLOR[activeTab] : c.border,
                  borderWidth: isDue ? 1.5 : 1,
                },
              ]}
              onPress={() => openModal(test)}
              activeOpacity={0.8}
            >
              <View style={styles.testCardHeader}>
                <View
                  style={[
                    styles.testBadge,
                    { backgroundColor: TAB_COLOR[activeTab] + "18" },
                  ]}
                >
                  <Text
                    style={[styles.testBadgeText, { color: TAB_COLOR[activeTab] }]}
                  >
                    W{test.weekRange[0]}–{test.weekRange[1]}
                  </Text>
                </View>
                <View
                  style={[
                    styles.importanceDot,
                    { backgroundColor: IMPORTANCE_COLOR[test.importance] },
                  ]}
                />
                {isDue && (
                  <View style={[styles.dueBadge, { backgroundColor: TAB_COLOR[activeTab] + "20" }]}>
                    <Text style={[styles.dueBadgeText, { color: TAB_COLOR[activeTab] }]}>
                      Due now
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }} />
                {recordCount > 0 && (
                  <View style={[styles.recordBadge, { backgroundColor: "#6db58a20" }]}>
                    <Feather name="check-circle" size={12} color="#6db58a" />
                    <Text style={[styles.recordBadgeText, { color: "#6db58a" }]}>
                      {recordCount} logged
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.testName, { color: c.foreground }]}>{test.name}</Text>
              <Text style={[styles.testDesc, { color: c.mutedForeground }]} numberOfLines={2}>
                {test.description}
              </Text>

              {latestRecord && (
                <View style={[styles.latestResult, { backgroundColor: c.secondary, borderColor: c.border }]}>
                  <Text style={[styles.latestResultLabel, { color: c.mutedForeground }]}>
                    Last result ({new Date(latestRecord.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })})
                  </Text>
                  <Text style={[styles.latestResultValues, { color: c.foreground }]} numberOfLines={1}>
                    {Object.entries(latestRecord.values)
                      .filter(([, v]) => v)
                      .map(([k, v]) => {
                        const field = test.fields.find((f) => f.key === k);
                        return `${field?.label || k}: ${v}${field?.unit ? " " + field.unit : ""}`;
                      })
                      .join(" · ")}
                  </Text>
                </View>
              )}

              <View style={styles.testCardFooter}>
                <Text style={[styles.tapToLog, { color: TAB_COLOR[activeTab] }]}>
                  {latestRecord ? "Update result" : "Log result"} →
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Add Result Modal */}
      <Modal
        visible={!!modalTest}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        {modalTest && (
          <ResultModal
            test={modalTest}
            formValues={formValues}
            setFormValues={setFormValues}
            formNotes={formNotes}
            setFormNotes={setFormNotes}
            onExtract={handleExtractFromPhoto}
            onSave={handleSave}
            onClose={closeModal}
            extracting={extracting}
            saving={saving}
            existingRecords={getRecordsForTest(modalTest.id)}
            c={c}
            accentColor={TAB_COLOR[activeTab]}
          />
        )}
      </Modal>
    </View>
  );
}

function ResultModal({
  test,
  formValues,
  setFormValues,
  formNotes,
  setFormNotes,
  onExtract,
  onSave,
  onClose,
  extracting,
  saving,
  existingRecords,
  c,
  accentColor,
}: {
  test: ScheduledTest;
  formValues: Record<string, string>;
  setFormValues: (v: Record<string, string>) => void;
  formNotes: string;
  setFormNotes: (s: string) => void;
  onExtract: () => void;
  onSave: () => void;
  onClose: () => void;
  extracting: boolean;
  saving: boolean;
  existingRecords: HealthRecord[];
  c: typeof colors.light;
  accentColor: string;
}) {
  const insets = useSafeAreaInsets();
  const dietSuggestions =
    Object.values(formValues).some((v) => v.trim() !== "")
      ? getDietSuggestionsForResult(test.id, formValues)
      : [];

  return (
    <ScrollView
      style={[styles.modalContainer, { backgroundColor: c.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Modal Header */}
      <View style={[styles.modalHeader, { backgroundColor: accentColor, paddingTop: insets.top + 16 }]}>
        <View style={styles.modalHeaderRow}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Feather name="x" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{test.name}</Text>
          <TouchableOpacity
            style={[styles.modalSaveBtn, saving && { opacity: 0.6 }]}
            onPress={onSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.modalSaveBtnText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.modalSubtitle}>
          Week {test.weekRange[0]}–{test.weekRange[1]} · {test.description.split(".")[0]}
        </Text>
      </View>

      {/* AI Extract button */}
      <TouchableOpacity
        style={[styles.extractBtn, { borderColor: accentColor + "50", backgroundColor: accentColor + "10" }]}
        onPress={onExtract}
        disabled={extracting}
      >
        {extracting ? (
          <ActivityIndicator size="small" color={accentColor} />
        ) : (
          <Feather name="camera" size={18} color={accentColor} />
        )}
        <View style={styles.extractBtnContent}>
          <Text style={[styles.extractBtnTitle, { color: accentColor }]}>
            {extracting ? "Extracting from photo..." : "Extract from Report Photo"}
          </Text>
          <Text style={[styles.extractBtnSub, { color: c.mutedForeground }]}>
            AI will read your lab report image automatically
          </Text>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.orRow}>
        <View style={[styles.orLine, { backgroundColor: c.border }]} />
        <Text style={[styles.orText, { color: c.mutedForeground }]}>or enter manually</Text>
        <View style={[styles.orLine, { backgroundColor: c.border }]} />
      </View>

      {/* Fields */}
      <View style={[styles.fieldsCard, { backgroundColor: c.card, borderColor: c.border }]}>
        {test.fields.map((field: HealthField, idx: number) => (
          <React.Fragment key={field.key}>
            <View style={styles.fieldRow}>
              <View style={styles.fieldMeta}>
                <Text style={[styles.fieldLabel, { color: c.foreground }]}>{field.label}</Text>
                {field.normalRange && (
                  <Text style={[styles.fieldNormal, { color: c.mutedForeground }]}>
                    Normal: {field.normalRange}
                  </Text>
                )}
              </View>
              <View style={styles.fieldInputWrap}>
                <TextInput
                  style={[styles.fieldInput, { color: c.foreground, backgroundColor: c.secondary, borderColor: c.border }]}
                  value={formValues[field.key] || ""}
                  onChangeText={(text) =>
                    setFormValues({ ...formValues, [field.key]: text })
                  }
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  placeholderTextColor={c.mutedForeground}
                  keyboardType={field.unit && field.unit !== "" ? "decimal-pad" : "default"}
                />
                {field.unit && (
                  <Text style={[styles.fieldUnit, { color: c.mutedForeground }]}>{field.unit}</Text>
                )}
              </View>
            </View>
            {idx < test.fields.length - 1 && (
              <View style={[styles.fieldSep, { backgroundColor: c.border }]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Notes */}
      <View style={[styles.notesCard, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.notesLabel, { color: c.mutedForeground }]}>Doctor's Notes (optional)</Text>
        <TextInput
          style={[styles.notesInput, { color: c.foreground }]}
          value={formNotes}
          onChangeText={setFormNotes}
          placeholder="Add any notes from your visit..."
          placeholderTextColor={c.mutedForeground}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Diet Suggestions Preview */}
      {dietSuggestions.length > 0 && (
        <View style={styles.dietPreviewSection}>
          <View style={styles.dietPreviewHeader}>
            <Feather name="zap" size={14} color="#6db58a" />
            <Text style={[styles.dietPreviewTitle, { color: "#6db58a" }]}>
              Diet suggestions based on your result
            </Text>
          </View>
          {dietSuggestions.map((s, i) => (
            <View key={i} style={[styles.dietSuggestionItem, { backgroundColor: "#6db58a10", borderColor: "#6db58a20" }]}>
              <Text style={[styles.dietSuggestionText, { color: c.foreground }]}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      {/* History */}
      {existingRecords.length > 0 && (
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: c.mutedForeground }]}>PREVIOUS RESULTS</Text>
          {existingRecords.slice(0, 3).map((record, i) => (
            <View key={i} style={[styles.historyCard, { backgroundColor: c.card, borderColor: c.border }]}>
              <Text style={[styles.historyDate, { color: c.mutedForeground }]}>
                {new Date(record.date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </Text>
              {Object.entries(record.values)
                .filter(([, v]) => v)
                .map(([k, v]) => {
                  const field = test.fields.find((f) => f.key === k);
                  return (
                    <Text key={k} style={[styles.historyValue, { color: c.foreground }]}>
                      {field?.label || k}: <Text style={{ fontWeight: "700" }}>{v}</Text>
                      {field?.unit ? ` ${field.unit}` : ""}
                    </Text>
                  );
                })}
              {record.notes && (
                <Text style={[styles.historyNotes, { color: c.mutedForeground }]}>
                  Note: {record.notes}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff" },
  headerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tab: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", paddingVertical: 10, borderRadius: 10, gap: 6,
  },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 12, fontWeight: "600" },
  tabTextActive: { color: "#ef6c4b", fontWeight: "700" },
  infoBanner: {
    flexDirection: "row", alignItems: "flex-start",
    marginHorizontal: 16, marginBottom: 12,
    padding: 12, borderRadius: 12, borderWidth: 1, gap: 8,
  },
  infoBannerText: { flex: 1, fontSize: 12, lineHeight: 17 },
  testCard: {
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 16, padding: 16,
  },
  testCardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  testBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  testBadgeText: { fontSize: 11, fontWeight: "700" },
  importanceDot: { width: 8, height: 8, borderRadius: 4 },
  dueBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  dueBadgeText: { fontSize: 11, fontWeight: "700" },
  recordBadge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4,
  },
  recordBadgeText: { fontSize: 11, fontWeight: "700" },
  testName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  testDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  latestResult: {
    padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 10, gap: 3,
  },
  latestResultLabel: { fontSize: 11, fontWeight: "600" },
  latestResultValues: { fontSize: 13, fontWeight: "500" },
  testCardFooter: { alignItems: "flex-end" },
  tapToLog: { fontSize: 13, fontWeight: "700" },
  modalContainer: { flex: 1 },
  modalHeader: { paddingHorizontal: 20, paddingBottom: 20 },
  modalHeaderRow: {
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8,
  },
  modalCloseBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: "800", color: "#fff" },
  modalSaveBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 10, backgroundColor: "rgba(255,255,255,0.25)",
  },
  modalSaveBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  modalSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  extractBtn: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    padding: 16, borderRadius: 16, borderWidth: 1.5, gap: 12,
  },
  extractBtnContent: { flex: 1 },
  extractBtnTitle: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  extractBtnSub: { fontSize: 12 },
  orRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginVertical: 16, gap: 10 },
  orLine: { flex: 1, height: 1 },
  orText: { fontSize: 12, fontWeight: "600" },
  fieldsCard: {
    marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: "hidden",
  },
  fieldRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  fieldMeta: { flex: 1 },
  fieldLabel: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  fieldNormal: { fontSize: 11 },
  fieldInputWrap: { alignItems: "flex-end", gap: 4 },
  fieldInput: {
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 15, fontWeight: "600", minWidth: 100, textAlign: "right",
  },
  fieldUnit: { fontSize: 11, fontWeight: "500" },
  fieldSep: { height: 1, marginHorizontal: 16 },
  notesCard: {
    marginHorizontal: 16, marginTop: 12, borderRadius: 16,
    borderWidth: 1, padding: 16,
  },
  notesLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  notesInput: { fontSize: 14, minHeight: 72, textAlignVertical: "top" },
  dietPreviewSection: { marginHorizontal: 16, marginTop: 16 },
  dietPreviewHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  dietPreviewTitle: { fontSize: 13, fontWeight: "700" },
  dietSuggestionItem: {
    padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 6,
  },
  dietSuggestionText: { fontSize: 13, lineHeight: 18 },
  historySection: { marginHorizontal: 16, marginTop: 24 },
  historyTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 10 },
  historyCard: {
    borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8, gap: 4,
  },
  historyDate: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  historyValue: { fontSize: 13 },
  historyNotes: { fontSize: 12, marginTop: 4, fontStyle: "italic" },
});
