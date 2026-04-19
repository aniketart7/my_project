import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React from "react";
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
import { FetalVisual } from "@/components/FetalVisual";
import { SectionCard } from "@/components/SectionCard";
import { usePregnancy } from "@/context/PregnancyContext";
import { getWeekData } from "@/data/pregnancyData";
import { getPersonalizedDiet, DIETARY_LABELS, DIETARY_COLORS } from "@/data/dietaryData";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const { currentWeek, momName, dadName, babyName, dietaryPreference, dueDate, daysToGo } = usePregnancy();
  const weekData = getWeekData(currentWeek);
  const personalizedDiet = weekData
    ? getPersonalizedDiet(weekData.momDiet, currentWeek, dietaryPreference)
    : [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const trimesterColor =
    weekData?.trimester === 1
      ? "#e8608a"
      : weekData?.trimester === 2
      ? "#9b6db5"
      : "#5b8fd6";

  if (!weekData) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <Text style={[styles.errorText, { color: c.mutedForeground }]}>
          No data for week {currentWeek}
        </Text>
      </View>
    );
  }

  const handleWeekChange = (delta: number) => {
    const newWeek = currentWeek + delta;
    if (newWeek >= 1 && newWeek <= 40) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({ pathname: "/week/[week]", params: { week: newWeek.toString() } });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 16, backgroundColor: trimesterColor },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingSmall}>
              {momName ? `Hello, ${momName}` : "Your Pregnancy Journey"}
            </Text>
            <Text style={styles.weekTitle}>Week {currentWeek}</Text>
            <Text style={styles.trimesterLabel}>
              {weekData.trimester === 1
                ? "First Trimester"
                : weekData.trimester === 2
                ? "Second Trimester"
                : "Third Trimester"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push("/settings")}
          >
            <Feather name="settings" size={22} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekNav}>
          <TouchableOpacity
            style={[styles.navBtn, currentWeek <= 1 && styles.navBtnDisabled]}
            onPress={() => handleWeekChange(-1)}
            disabled={currentWeek <= 1}
          >
            <Feather name="chevron-left" size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.weekBadgePill}
            onPress={() => router.push("/journey")}
          >
            <Text style={styles.weekBadgePillText}>View All 40 Weeks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, currentWeek >= 40 && styles.navBtnDisabled]}
            onPress={() => handleWeekChange(1)}
            disabled={currentWeek >= 40}
          >
            <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.highlightBanner}>
        <Feather name="star" size={14} color={trimesterColor} />
        <Text style={[styles.highlightText, { color: c.foreground }]}>
          {weekData.weekHighlight}
        </Text>
      </View>

      {dueDate && (
        <View style={[styles.dueDateRow, { backgroundColor: c.card, borderColor: c.border }]}>
          <Feather name="gift" size={14} color="#9b6db5" />
          <Text style={[styles.dueDateText, { color: c.mutedForeground }]}>
            Due date:{" "}
            <Text style={{ color: "#9b6db5", fontWeight: "700" }}>
              {dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </Text>
          <View style={[styles.daysLeft, { backgroundColor: "#9b6db520" }]}>
            <Text style={{ color: "#9b6db5", fontSize: 11, fontWeight: "700" }}>
              {Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}d left
            </Text>
          </View>
        </View>
      )}

      <View style={styles.heroCompact}>
        <View style={styles.heroLeft}>
          <FetalVisual weekData={weekData} />
        </View>
        <View style={styles.heroRight}>
          <View style={[styles.countdownCard, { backgroundColor: c.card, borderColor: c.border }]}>
            <Feather name="calendar" size={14} color="#9b6db5" />
            <Text style={[styles.countdownLabel, { color: c.mutedForeground }]}>Days to go</Text>
            <Text style={[styles.countdownValue, { color: "#9b6db5" }]}>
              {daysToGo ?? "—"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.heroShortcut, { backgroundColor: "#9b6db510", borderColor: "#9b6db530" }]}
            onPress={() => router.push("/settings")}
          >
            <Feather name="sliders" size={14} color="#9b6db5" />
            <Text style={[styles.heroShortcutText, { color: "#9b6db5" }]}>Personalize</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionTitle}>
        <View style={[styles.sectionDot, { backgroundColor: "#e8608a" }]} />
        <Text style={[styles.sectionTitleText, { color: c.foreground }]}>
          {momName ? `${momName}'s Guide` : "Mom's Guide"}
        </Text>
      </View>

      <SectionCard
        title="Symptoms This Week"
        icon="activity"
        accentColor="#e8608a"
        items={weekData.momSymptoms}
      />
      <SectionCard
        title={`Diet & Nutrition · ${DIETARY_LABELS[dietaryPreference]}`}
        icon="coffee"
        accentColor={DIETARY_COLORS[dietaryPreference]}
        items={personalizedDiet}
        collapsed
      />
      <SectionCard
        title="Exercise & Movement"
        icon="heart"
        accentColor="#e8608a"
        items={weekData.momExercise}
        collapsed
      />
      <SectionCard
        title="Mood & Emotional Wellness"
        icon="sun"
        accentColor="#e8608a"
        items={weekData.momMoodTips}
        collapsed
      />

      <View style={styles.quickPeekRow}>
          <TouchableOpacity
            style={[styles.quickPeekCard, { borderColor: "#5b8fd630", backgroundColor: "#5b8fd610" }]}
            onPress={() => router.push({ pathname: "/week/[week]", params: { week: currentWeek.toString() } })}
          >
          <Feather name="calendar" size={16} color="#5b8fd6" />
          <Text style={[styles.quickPeekTitle, { color: "#5b8fd6" }]}>Dad</Text>
          <Text style={[styles.quickPeekSub, { color: "#5b8fd680" }]}>Open current week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickPeekCard, { borderColor: "#6db58a30", backgroundColor: "#6db58a10" }]}
          onPress={() => router.push("/soulful")}
        >
          <Feather name="wind" size={16} color="#6db58a" />
          <Text style={[styles.quickPeekTitle, { color: "#6db58a" }]}>Soulful</Text>
          <Text style={[styles.quickPeekSub, { color: "#6db58a80" }]}>Tap for chants</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickPeekCard, { borderColor: "#ef6c4b30", backgroundColor: "#ef6c4b10" }]}
          onPress={() => router.push("/health")}
        >
          <Feather name="activity" size={16} color="#ef6c4b" />
          <Text style={[styles.quickPeekTitle, { color: "#ef6c4b" }]}>Health</Text>
          <Text style={[styles.quickPeekSub, { color: "#ef6c4b80" }]}>Track vitals</Text>
        </TouchableOpacity>
      </View>

      <SectionCard title="Symptoms This Week" icon="activity" accentColor="#e8608a" items={weekData.momSymptoms} />
      <SectionCard
        title={`Diet · ${DIETARY_LABELS[dietaryPreference]}`}
        icon="coffee"
        accentColor={DIETARY_COLORS[dietaryPreference]}
        items={personalizedDiet}
        collapsed
      />
      <SectionCard
        title="Top Actions"
        icon="check-square"
        accentColor="#5b8fd6"
        items={weekData.dadActions.slice(0, 3)}
      />
      <SectionCard
        title="Baby Development"
        icon="zap"
        accentColor="#6db58a"
        items={weekData.fetalDevelopment.slice(0, 3)}
        collapsed
      />

      <View style={styles.quickLinksRow}>
        <TouchableOpacity
          style={[styles.quickLinkCard, { backgroundColor: "#ef6c4b10", borderColor: "#ef6c4b30" }]}
          onPress={() => router.push("/health")}
        >
          <View style={[styles.quickLinkIcon, { backgroundColor: "#ef6c4b20" }]}>
            <Feather name="activity" size={20} color="#ef6c4b" />
          </View>
          <Text style={[styles.quickLinkTitle, { color: "#ef6c4b" }]}>Health{"\n"}Tracker</Text>
          <Text style={[styles.quickLinkSub, { color: "#ef6c4b80" }]}>Vitals · Tests · Scans</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickLinkCard, { backgroundColor: "#6db58a10", borderColor: "#6db58a30" }]}
          onPress={() => router.push("/soulful")}
        >
          <View style={[styles.quickLinkIcon, { backgroundColor: "#6db58a20" }]}>
            <Feather name="wind" size={20} color="#6db58a" />
          </View>
          <Text style={[styles.quickLinkTitle, { color: "#6db58a" }]}>Traditional{"\n"}& Soulful</Text>
          <Text style={[styles.quickLinkSub, { color: "#6db58a80" }]}>Yoga · Mantra · Garbhasanskar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.resourcesShortcut, { backgroundColor: "#9b6db510", borderColor: "#9b6db530" }]}
        onPress={() => router.push("/resources")}
      >
        <View style={[styles.resourcesShortcutIcon, { backgroundColor: "#9b6db520" }]}>
          <Feather name="external-link" size={18} color="#9b6db5" />
        </View>
        <View style={styles.resourcesShortcutContent}>
          <Text style={[styles.resourcesShortcutTitle, { color: "#9b6db5" }]}>
            Explore Pregnancy Resources
          </Text>
          <Text style={[styles.resourcesShortcutSub, { color: "#9b6db580" }]}>
            Guides, tools, and expert links for every stage
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color="#9b6db5" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greetingSmall: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
    marginBottom: 4,
  },
  weekTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
  },
  trimesterLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    marginTop: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  weekBadgePill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  weekBadgePillText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  highlightBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#fff8f9",
    gap: 8,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dueDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dueDateText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },
  daysLeft: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quickLinksRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
    gap: 10,
  },
  quickLinkCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    alignItems: "flex-start",
  },
  quickLinkIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  quickLinkTitle: { fontSize: 13, fontWeight: "800", lineHeight: 18 },
  quickLinkSub: { fontSize: 10, fontWeight: "500" },
  resourcesShortcut: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  resourcesShortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resourcesShortcutContent: { flex: 1 },
  resourcesShortcutTitle: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  resourcesShortcutSub: { fontSize: 12 },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "700",
  },
  heroCompact: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
    alignItems: "stretch",
  },
  heroLeft: {
    flex: 1,
    minHeight: 220,
  },
  heroRight: {
    width: 120,
    gap: 10,
  },
  countdownCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 4,
    alignItems: "flex-start",
  },
  countdownLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  countdownValue: {
    fontSize: 28,
    fontWeight: "800",
  },
  heroShortcut: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 4,
    alignItems: "flex-start",
  },
  heroShortcutText: {
    fontSize: 12,
    fontWeight: "700",
  },
  quickPeekRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  quickPeekCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 4,
    alignItems: "flex-start",
  },
  quickPeekTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  quickPeekSub: {
    fontSize: 10,
    fontWeight: "600",
  },
});
