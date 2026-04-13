import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
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

type TabType = "baby" | "mom" | "dad";

export default function WeekDetailScreen() {
  const { week } = useLocalSearchParams<{ week: string }>();
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const { currentWeek, setCurrentWeek, momName, dadName, babyName, dietaryPreference } = usePregnancy();
  const [activeTab, setActiveTab] = useState<TabType>("baby");

  const weekNum = parseInt(week || "1", 10);
  const weekData = getWeekData(weekNum);
  const personalizedDiet = weekData
    ? getPersonalizedDiet(weekData.momDiet, weekNum, dietaryPreference)
    : [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!weekData) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <Text style={[styles.errorText, { color: c.mutedForeground }]}>Week not found</Text>
      </View>
    );
  }

  const trimesterColor =
    weekData.trimester === 1
      ? "#e8608a"
      : weekData.trimester === 2
      ? "#9b6db5"
      : "#5b8fd6";

  const isCurrentWeek = weekNum === currentWeek;

  const handleSetCurrentWeek = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCurrentWeek(weekNum);
  };

  const tabColor = activeTab === "mom" ? "#e8608a" : activeTab === "dad" ? "#5b8fd6" : "#6db58a";

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: trimesterColor }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Week {weekNum}</Text>
            <Text style={styles.headerSubtitle}>
              {weekData.trimester === 1
                ? "First Trimester"
                : weekData.trimester === 2
                ? "Second Trimester"
                : "Third Trimester"}
            </Text>
          </View>
          {!isCurrentWeek && (
            <TouchableOpacity style={styles.setCurrentBtn} onPress={handleSetCurrentWeek}>
              <Text style={styles.setCurrentText}>Set as Current</Text>
            </TouchableOpacity>
          )}
          {isCurrentWeek && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Current Week</Text>
            </View>
          )}
        </View>

        <View style={styles.tabs}>
          {(["baby", "mom", "dad"] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveTab(tab);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === "baby"
                  ? babyName || "Baby"
                  : tab === "mom"
                  ? momName || "Mom"
                  : dadName || "Dad"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.highlight}>
          <Feather name="star" size={14} color={trimesterColor} />
          <Text style={[styles.highlightText, { color: c.foreground }]}>
            {weekData.weekHighlight}
          </Text>
        </View>

        {activeTab === "baby" && (
          <>
            <FetalVisual weekData={weekData} />
            <SectionCard
              title="Fetal Development"
              icon="zap"
              accentColor="#6db58a"
              items={weekData.fetalDevelopment}
            />
          </>
        )}

        {activeTab === "mom" && (
          <>
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
            />
            <SectionCard
              title="Exercise & Movement"
              icon="heart"
              accentColor="#e8608a"
              items={weekData.momExercise}
            />
            <SectionCard
              title="Mood & Emotional Wellness"
              icon="sun"
              accentColor="#e8608a"
              items={weekData.momMoodTips}
            />
          </>
        )}

        {activeTab === "dad" && (
          <>
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
            />
          </>
        )}

        <View style={styles.weekNav}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: c.card, borderColor: c.border }, weekNum <= 1 && styles.disabledBtn]}
            onPress={() => weekNum > 1 && router.replace({ pathname: "/week/[week]", params: { week: (weekNum - 1).toString() } })}
            disabled={weekNum <= 1}
          >
            <Feather name="chevron-left" size={20} color={weekNum <= 1 ? c.mutedForeground : trimesterColor} />
            <Text style={[styles.navBtnText, { color: weekNum <= 1 ? c.mutedForeground : trimesterColor }]}>
              Week {weekNum - 1}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: c.card, borderColor: c.border }, weekNum >= 40 && styles.disabledBtn]}
            onPress={() => weekNum < 40 && router.replace({ pathname: "/week/[week]", params: { week: (weekNum + 1).toString() } })}
            disabled={weekNum >= 40}
          >
            <Text style={[styles.navBtnText, { color: weekNum >= 40 ? c.mutedForeground : trimesterColor }]}>
              Week {weekNum + 1}
            </Text>
            <Feather name="chevron-right" size={20} color={weekNum >= 40 ? c.mutedForeground : trimesterColor} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  setCurrentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  setCurrentText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  currentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  currentBadgeText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  activeTabText: {
    color: "#333",
  },
  scroll: {
    flex: 1,
  },
  highlight: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
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
  weekNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
