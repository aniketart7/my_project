import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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

// Progress bar for pregnancy journey (0–100%)
function ProgressBar({ week, color }: { week: number; color: string }) {
  const pct = Math.round((week / 40) * 100);
  return (
    <View style={pb.wrap}>
      <View style={[pb.track]}>
        <View style={[pb.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[pb.label, { color: "rgba(255,255,255,0.85)" }]}>{pct}% complete</Text>
    </View>
  );
}
const pb = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.25)" },
  fill: { height: 6, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: "600", minWidth: 80, textAlign: "right" },
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const {
    currentWeek,
    momName,
    dadName,
    babyName,
    dietaryPreference,
    dueDate,
    daysToGo,
  } = usePregnancy();

  const weekData = getWeekData(currentWeek);
  const personalizedDiet = weekData
    ? getPersonalizedDiet(weekData.momDiet, currentWeek, dietaryPreference)
    : [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const trimesterColor =
    weekData?.trimester === 1 ? "#e8608a" : weekData?.trimester === 2 ? "#9b6db5" : "#5b8fd6";

  const trimesterLabel =
    weekData?.trimester === 1
      ? "First Trimester"
      : weekData?.trimester === 2
      ? "Second Trimester"
      : "Third Trimester";

  if (!weekData) {
    return (
      <View style={[styles.container, { backgroundColor: c.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: c.mutedForeground, fontSize: 16 }}>No data for week {currentWeek}</Text>
      </View>
    );
  }

  const handleWeekChange = (delta: number) => {
    const nw = currentWeek + delta;
    if (nw >= 1 && nw <= 40) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({ pathname: "/week/[week]", params: { week: nw.toString() } });
    }
  };

  const dueDateFormatted = dueDate
    ? dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── HERO HEADER ─── */}
      <View style={[styles.hero, { paddingTop: topPad + 12, backgroundColor: trimesterColor }]}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {momName ? `Hello, ${momName} 👋` : "Your Pregnancy Journey"}
            </Text>
            <View style={styles.weekRow}>
              <Text style={styles.weekBig}>Week {currentWeek}</Text>
              <View style={styles.trimBadge}>
                <Text style={styles.trimBadgeText}>{trimesterLabel}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push("/settings")}>
            <Feather name="settings" size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>

        <ProgressBar week={currentWeek} color="rgba(255,255,255,0.9)" />

        {/* Week nav */}
        <View style={styles.weekNav}>
          <TouchableOpacity
            style={[styles.navBtn, currentWeek <= 1 && { opacity: 0.3 }]}
            onPress={() => handleWeekChange(-1)}
            disabled={currentWeek <= 1}
          >
            <Feather name="chevron-left" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.journeyPill} onPress={() => router.push("/journey")}>
            <Feather name="map" size={13} color="#fff" />
            <Text style={styles.journeyPillText}>All 40 Weeks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, currentWeek >= 40 && { opacity: 0.3 }]}
            onPress={() => handleWeekChange(1)}
            disabled={currentWeek >= 40}
          >
            <Feather name="chevron-right" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── DELIVERY COUNTDOWN ─── */}
      {dueDate && (
        <View style={[styles.countdownBanner, { borderColor: trimesterColor + "40" }]}>
          <View style={[styles.countdownLeft, { backgroundColor: trimesterColor + "15" }]}>
            <Text style={[styles.countdownNum, { color: trimesterColor }]}>{daysToGo ?? "—"}</Text>
            <Text style={[styles.countdownUnit, { color: trimesterColor }]}>days</Text>
            <Text style={[styles.countdownSub, { color: c.mutedForeground }]}>to go</Text>
          </View>
          <View style={styles.countdownRight}>
            <Feather name="gift" size={16} color={trimesterColor} />
            <Text style={[styles.countdownTitle, { color: c.foreground }]}>Due Date</Text>
            <Text style={[styles.countdownDate, { color: trimesterColor }]}>{dueDateFormatted}</Text>
            <View style={styles.countdownProgressRow}>
              <View style={[styles.countdownProgressTrack, { backgroundColor: trimesterColor + "20" }]}>
                <View
                  style={[
                    styles.countdownProgressFill,
                    { width: `${Math.round((currentWeek / 40) * 100)}%` as any, backgroundColor: trimesterColor },
                  ]}
                />
              </View>
              <Text style={[styles.countdownProgressLabel, { color: c.mutedForeground }]}>
                {Math.round((currentWeek / 40) * 100)}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* ─── WEEK HIGHLIGHT ─── */}
      <View style={[styles.highlight, { backgroundColor: trimesterColor + "12", borderColor: trimesterColor + "30" }]}>
        <Feather name="star" size={14} color={trimesterColor} />
        <Text style={[styles.highlightText, { color: c.foreground }]}>{weekData.weekHighlight}</Text>
      </View>

      {/* ─── QUICK NAV GRID ─── */}
      <Text style={[styles.sectionHeading, { color: c.mutedForeground }]}>QUICK ACCESS</Text>
      <View style={styles.navGrid}>
        <TouchableOpacity
          style={[styles.navCard, { backgroundColor: "#e8608a12", borderColor: "#e8608a30" }]}
          onPress={() => router.push({ pathname: "/week/[week]", params: { week: currentWeek.toString() } })}
          activeOpacity={0.8}
        >
          <View style={[styles.navCardIcon, { backgroundColor: "#e8608a20" }]}>
            <Feather name="heart" size={22} color="#e8608a" />
          </View>
          <Text style={[styles.navCardTitle, { color: "#e8608a" }]}>Mom</Text>
          <Text style={[styles.navCardSub, { color: "#e8608a80" }]}>Week guide</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navCard, { backgroundColor: "#5b8fd612", borderColor: "#5b8fd630" }]}
          onPress={() => router.push({ pathname: "/week/[week]", params: { week: currentWeek.toString() } })}
          activeOpacity={0.8}
        >
          <View style={[styles.navCardIcon, { backgroundColor: "#5b8fd620" }]}>
            <Feather name="user" size={22} color="#5b8fd6" />
          </View>
          <Text style={[styles.navCardTitle, { color: "#5b8fd6" }]}>Dad</Text>
          <Text style={[styles.navCardSub, { color: "#5b8fd680" }]}>Actions & tips</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navCard, { backgroundColor: "#6db58a12", borderColor: "#6db58a30" }]}
          onPress={() => router.push("/health")}
          activeOpacity={0.8}
        >
          <View style={[styles.navCardIcon, { backgroundColor: "#6db58a20" }]}>
            <Feather name="activity" size={22} color="#6db58a" />
          </View>
          <Text style={[styles.navCardTitle, { color: "#6db58a" }]}>Health</Text>
          <Text style={[styles.navCardSub, { color: "#6db58a80" }]}>Track vitals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navCard, { backgroundColor: "#9b6db512", borderColor: "#9b6db530" }]}
          onPress={() => router.push("/soulful")}
          activeOpacity={0.8}
        >
          <View style={[styles.navCardIcon, { backgroundColor: "#9b6db520" }]}>
            <Feather name="wind" size={22} color="#9b6db5" />
          </View>
          <Text style={[styles.navCardTitle, { color: "#9b6db5" }]}>Soulful</Text>
          <Text style={[styles.navCardSub, { color: "#9b6db580" }]}>Yoga & mantra</Text>
        </TouchableOpacity>
      </View>

      {/* ─── BABY THIS WEEK ─── */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: "#6db58a" }]} />
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>
            {babyName ? `${babyName}'s Development` : "Baby This Week"}
          </Text>
        </View>
        <FetalVisual weekData={weekData} />
        <SectionCard
          title="Fetal Development"
          icon="zap"
          accentColor="#6db58a"
          items={weekData.fetalDevelopment}
          collapsed
        />
      </View>

      {/* ─── MOM'S GUIDE ─── */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: "#e8608a" }]} />
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>
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
      </View>

      {/* ─── DAD'S GUIDE ─── */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: "#5b8fd6" }]} />
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>
            {dadName ? `${dadName}'s Guide` : "Dad's Guide"}
          </Text>
        </View>
        <SectionCard
          title="Actions This Week"
          icon="check-square"
          accentColor="#5b8fd6"
          items={weekData.dadActions}
        />
        <SectionCard
          title="Relationship & Bonding"
          icon="users"
          accentColor="#5b8fd6"
          items={weekData.dadRelationshipTips}
          collapsed
        />
      </View>

      {/* ─── RESOURCES LINK ─── */}
      <TouchableOpacity
        style={[styles.resourcesRow, { backgroundColor: "#9b6db510", borderColor: "#9b6db530" }]}
        onPress={() => router.push("/resources")}
        activeOpacity={0.8}
      >
        <View style={[styles.resourcesIcon, { backgroundColor: "#9b6db520" }]}>
          <Feather name="book-open" size={20} color="#9b6db5" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.resourcesTitle, { color: "#9b6db5" }]}>Pregnancy Resources</Text>
          <Text style={[styles.resourcesSub, { color: "#9b6db580" }]}>
            Expert guides, tools & links for every stage
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color="#9b6db5" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Hero ──────────────────────────────────────────────
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    marginBottom: 4,
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  weekBig: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  trimBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trimBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  journeyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  journeyPillText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  // ── Countdown ─────────────────────────────────────────
  countdownBanner: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  countdownLeft: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 0,
  },
  countdownNum: { fontSize: 36, fontWeight: "900", letterSpacing: -2 },
  countdownUnit: { fontSize: 14, fontWeight: "700", marginTop: -4 },
  countdownSub: { fontSize: 11, fontWeight: "500", marginTop: 2 },
  countdownRight: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  countdownTitle: { fontSize: 13, fontWeight: "800" },
  countdownDate: { fontSize: 16, fontWeight: "700" },
  countdownProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  countdownProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  countdownProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  countdownProgressLabel: { fontSize: 11, fontWeight: "600", minWidth: 28 },

  // ── Highlight ─────────────────────────────────────────
  highlight: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },

  // ── Section heading ───────────────────────────────────
  sectionHeading: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
  },

  // ── Nav Grid ──────────────────────────────────────────
  navGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 12,
    gap: 10,
  },
  navCard: {
    width: "46%",
    marginHorizontal: "2%",
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 6,
    alignItems: "flex-start",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
    }),
    elevation: 2,
  },
  navCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  navCardTitle: { fontSize: 15, fontWeight: "800" },
  navCardSub: { fontSize: 11, fontWeight: "500" },

  // ── Section blocks ────────────────────────────────────
  sectionBlock: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 17, fontWeight: "700" },

  // ── Resources ─────────────────────────────────────────
  resourcesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  resourcesIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resourcesTitle: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  resourcesSub: { fontSize: 12, lineHeight: 16 },
});
