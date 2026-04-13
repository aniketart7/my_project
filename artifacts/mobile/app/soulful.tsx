import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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
import { usePregnancy } from "@/context/PregnancyContext";
import {
  getGarbhasanskarForTrimester,
  getMantrasForTrimester,
  getPositivityForTrimester,
  getTrimesterFromWeek,
  getYogaForTrimester,
  type GarbhasanskarActivity,
  type Mantra,
  type PositivityItem,
  type YogaPose,
} from "@/data/soulfulData";

type TabType = "yoga" | "mantra" | "garbhasanskar" | "positivity";

const TABS: { id: TabType; label: string; icon: string; color: string }[] = [
  { id: "yoga", label: "Yoga", icon: "wind", color: "#6db58a" },
  { id: "mantra", label: "Mantra", icon: "volume-2", color: "#9b6db5" },
  { id: "garbhasanskar", label: "Garbhasanskar", icon: "music", color: "#f0a500" },
  { id: "positivity", label: "Positivity", icon: "sun", color: "#e8608a" },
];

export default function SoulfulScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const { currentWeek } = usePregnancy();
  const [activeTab, setActiveTab] = useState<TabType>("yoga");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const trimester = getTrimesterFromWeek(currentWeek);
  const activeTabData = TABS.find((t) => t.id === activeTab)!;

  const toggle = (id: string) => {
    Haptics.selectionAsync();
    setExpandedItem((prev) => (prev === id ? null : id));
  };

  const yoga = getYogaForTrimester(trimester);
  const mantras = getMantrasForTrimester(trimester);
  const garbhasanskar = getGarbhasanskarForTrimester(trimester);
  const positivity = getPositivityForTrimester(trimester);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 16, backgroundColor: activeTabData.color },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Traditional & Soulful</Text>
            <Text style={styles.headerSubtitle}>
              Week {currentWeek} · Trimester {trimester} guidance
            </Text>
          </View>
        </View>

        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: "rgba(255,255,255,0.25)" },
              ]}
              onPress={() => {
                setActiveTab(tab.id);
                setExpandedItem(null);
                Haptics.selectionAsync();
              }}
            >
              <Feather
                name={tab.icon as any}
                size={14}
                color={activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.65)"}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.65)" },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 40, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "yoga" && (
          <YogaTab
            poses={yoga}
            expandedItem={expandedItem}
            toggle={toggle}
            c={c}
            trimester={trimester}
          />
        )}
        {activeTab === "mantra" && (
          <MantraTab
            mantras={mantras}
            expandedItem={expandedItem}
            toggle={toggle}
            c={c}
          />
        )}
        {activeTab === "garbhasanskar" && (
          <GarbhasanskarTab
            activities={garbhasanskar}
            expandedItem={expandedItem}
            toggle={toggle}
            c={c}
          />
        )}
        {activeTab === "positivity" && (
          <PositivityTab
            items={positivity}
            expandedItem={expandedItem}
            toggle={toggle}
            c={c}
          />
        )}
      </ScrollView>
    </View>
  );
}

function YogaTab({
  poses,
  expandedItem,
  toggle,
  c,
  trimester,
}: {
  poses: YogaPose[];
  expandedItem: string | null;
  toggle: (id: string) => void;
  c: typeof colors.light;
  trimester: 1 | 2 | 3;
}) {
  return (
    <>
      <View style={[styles.bannerCard, { backgroundColor: "#6db58a10", borderColor: "#6db58a30" }]}>
        <Text style={styles.bannerEmoji}>🧘‍♀️</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerTitle, { color: "#6db58a" }]}>
            Trimester {trimester} Yoga
          </Text>
          <Text style={[styles.bannerText, { color: c.mutedForeground }]}>
            {trimester === 1
              ? "Gentle, grounding poses to ease nausea and establish a connection with your baby."
              : trimester === 2
              ? "Energising yet safe poses to build strength and prepare your body for birth."
              : "Restorative and opening poses to ease pressure and prepare for labour."}
          </Text>
        </View>
      </View>

      <View style={[styles.safetyNote, { backgroundColor: "#f0a50010", borderColor: "#f0a50030" }]}>
        <Feather name="alert-triangle" size={14} color="#f0a500" />
        <Text style={[styles.safetyNoteText, { color: c.mutedForeground }]}>
          Always practice on an empty stomach, wear comfortable clothing, and listen to your body. Stop immediately if you feel pain, dizziness or breathlessness. Consult your doctor before starting.
        </Text>
      </View>

      {poses.map((pose) => (
        <TouchableOpacity
          key={pose.id}
          style={[styles.card, { backgroundColor: c.card, borderColor: expandedItem === pose.id ? "#6db58a" : c.border }]}
          onPress={() => toggle(pose.id)}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>{pose.emoji}</Text>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.cardTitle, { color: c.foreground }]}>{pose.name}</Text>
              <Text style={[styles.cardSubtitle, { color: "#6db58a" }]}>{pose.sanskritName}</Text>
            </View>
            <View style={styles.cardMeta}>
              <View style={[styles.durationBadge, { backgroundColor: "#6db58a15" }]}>
                <Feather name="clock" size={11} color="#6db58a" />
                <Text style={[styles.durationText, { color: "#6db58a" }]}>{pose.duration}</Text>
              </View>
              <Feather
                name={expandedItem === pose.id ? "chevron-up" : "chevron-down"}
                size={16}
                color={c.mutedForeground}
              />
            </View>
          </View>

          {expandedItem === pose.id && (
            <View style={styles.cardContent}>
              <View style={[styles.separator, { backgroundColor: c.border }]} />

              <Text style={[styles.sectionHeading, { color: "#6db58a" }]}>✨ Benefits</Text>
              {pose.benefits.map((b, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={[styles.listDot, { backgroundColor: "#6db58a" }]} />
                  <Text style={[styles.listText, { color: c.foreground }]}>{b}</Text>
                </View>
              ))}

              <Text style={[styles.sectionHeading, { color: "#6db58a", marginTop: 14 }]}>📋 How to do it</Text>
              {pose.instructions.map((ins, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={[styles.listNum, { backgroundColor: "#6db58a" }]}>
                    <Text style={styles.listNumText}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.listText, { color: c.foreground }]}>{ins}</Text>
                </View>
              ))}

              {pose.caution && (
                <View style={[styles.cautionBox, { backgroundColor: "#f0a50010", borderColor: "#f0a50040" }]}>
                  <Feather name="alert-circle" size={14} color="#f0a500" />
                  <Text style={[styles.cautionText, { color: c.foreground }]}>{pose.caution}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </>
  );
}

function MantraTab({
  mantras,
  expandedItem,
  toggle,
  c,
}: {
  mantras: Mantra[];
  expandedItem: string | null;
  toggle: (id: string) => void;
  c: typeof colors.light;
}) {
  return (
    <>
      <View style={[styles.bannerCard, { backgroundColor: "#9b6db510", borderColor: "#9b6db530" }]}>
        <Text style={styles.bannerEmoji}>🕉️</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerTitle, { color: "#9b6db5" }]}>Sacred Mantras</Text>
          <Text style={[styles.bannerText, { color: c.mutedForeground }]}>
            Sanskrit vibrations have been scientifically shown to induce calm, reduce cortisol, and create positive neural patterns for your growing baby.
          </Text>
        </View>
      </View>

      {mantras.map((mantra) => (
        <TouchableOpacity
          key={mantra.id}
          style={[styles.card, { backgroundColor: c.card, borderColor: expandedItem === mantra.id ? "#9b6db5" : c.border }]}
          onPress={() => toggle(mantra.id)}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>🪬</Text>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.cardTitle, { color: c.foreground }]}>{mantra.title}</Text>
              <Text style={[styles.cardSubtitle, { color: "#9b6db5" }]}>{mantra.timing}</Text>
            </View>
            <Feather
              name={expandedItem === mantra.id ? "chevron-up" : "chevron-down"}
              size={16}
              color={c.mutedForeground}
            />
          </View>

          {expandedItem === mantra.id && (
            <View style={styles.cardContent}>
              <View style={[styles.separator, { backgroundColor: c.border }]} />

              <View style={[styles.sanskritBox, { backgroundColor: "#9b6db508", borderColor: "#9b6db530" }]}>
                <Text style={[styles.sanskritText, { color: "#9b6db5" }]}>{mantra.sanskrit}</Text>
              </View>

              <Text style={[styles.sectionHeading, { color: "#9b6db5" }]}>🔤 Transliteration</Text>
              <Text style={[styles.translitText, { color: c.foreground }]}>{mantra.transliteration}</Text>

              <Text style={[styles.sectionHeading, { color: "#9b6db5", marginTop: 14 }]}>💡 Meaning</Text>
              <Text style={[styles.meaningText, { color: c.foreground }]}>{mantra.meaning}</Text>

              <View style={[styles.purposeBox, { backgroundColor: "#9b6db510", borderColor: "#9b6db530" }]}>
                <Feather name="star" size={13} color="#9b6db5" />
                <Text style={[styles.purposeText, { color: c.foreground }]}>
                  <Text style={{ fontWeight: "700", color: "#9b6db5" }}>Purpose: </Text>
                  {mantra.purpose}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </>
  );
}

function GarbhasanskarTab({
  activities,
  expandedItem,
  toggle,
  c,
}: {
  activities: GarbhasanskarActivity[];
  expandedItem: string | null;
  toggle: (id: string) => void;
  c: typeof colors.light;
}) {
  const categoryColor: Record<string, string> = {
    music: "#9b6db5",
    reading: "#5b8fd6",
    meditation: "#6db58a",
    communication: "#e8608a",
    art: "#ef6c4b",
    nature: "#6db58a",
  };

  return (
    <>
      <View style={[styles.bannerCard, { backgroundColor: "#f0a50010", borderColor: "#f0a50030" }]}>
        <Text style={styles.bannerEmoji}>🌸</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerTitle, { color: "#f0a500" }]}>Garbhasanskar</Text>
          <Text style={[styles.bannerText, { color: c.mutedForeground }]}>
            The ancient practice of nurturing your baby's mind, personality and soul while still in the womb — through music, stories, meditation and mindful living.
          </Text>
        </View>
      </View>

      {activities.map((activity) => {
        const accent = categoryColor[activity.category] || "#e8608a";
        return (
          <TouchableOpacity
            key={activity.id}
            style={[styles.card, { backgroundColor: c.card, borderColor: expandedItem === activity.id ? accent : c.border }]}
            onPress={() => toggle(activity.id)}
            activeOpacity={0.85}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{activity.emoji}</Text>
              <View style={styles.cardHeaderText}>
                <Text style={[styles.cardTitle, { color: c.foreground }]}>{activity.title}</Text>
                <Text style={[styles.cardSubtitle, { color: accent }]}>{activity.duration}</Text>
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: accent + "18" }]}>
                <Text style={[styles.categoryBadgeText, { color: accent }]}>
                  {activity.category}
                </Text>
              </View>
              <Feather
                name={expandedItem === activity.id ? "chevron-up" : "chevron-down"}
                size={16}
                color={c.mutedForeground}
              />
            </View>

            {expandedItem === activity.id && (
              <View style={styles.cardContent}>
                <View style={[styles.separator, { backgroundColor: c.border }]} />
                <Text style={[styles.activityDesc, { color: c.foreground }]}>{activity.description}</Text>
                <View style={[styles.tipBox, { backgroundColor: accent + "12", borderColor: accent + "30" }]}>
                  <Feather name="lightbulb" size={14} color={accent} />
                  <Text style={[styles.tipText, { color: c.foreground }]}>
                    <Text style={{ fontWeight: "700", color: accent }}>Tip: </Text>
                    {activity.tip}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </>
  );
}

function PositivityTab({
  items,
  expandedItem,
  toggle,
  c,
}: {
  items: PositivityItem[];
  expandedItem: string | null;
  toggle: (id: string) => void;
  c: typeof colors.light;
}) {
  const typeColor: Record<string, string> = {
    affirmation: "#e8608a",
    gratitude: "#f0a500",
    visualization: "#9b6db5",
    breath: "#5b8fd6",
  };

  const typeLabel: Record<string, string> = {
    affirmation: "Affirmation",
    gratitude: "Gratitude",
    visualization: "Visualisation",
    breath: "Breathwork",
  };

  return (
    <>
      <View style={[styles.bannerCard, { backgroundColor: "#e8608a10", borderColor: "#e8608a30" }]}>
        <Text style={styles.bannerEmoji}>☀️</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerTitle, { color: "#e8608a" }]}>Mind & Heart</Text>
          <Text style={[styles.bannerText, { color: c.mutedForeground }]}>
            Your thoughts, emotions and peace of mind directly influence your baby's environment. Nourish your inner world every single day.
          </Text>
        </View>
      </View>

      {items.map((item) => {
        const accent = typeColor[item.type] || "#e8608a";
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: c.card, borderColor: expandedItem === item.id ? accent : c.border }]}
            onPress={() => toggle(item.id)}
            activeOpacity={0.85}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <View style={styles.cardHeaderText}>
                <Text style={[styles.cardTitle, { color: c.foreground }]}>{item.title}</Text>
                <Text style={[styles.cardSubtitle, { color: accent }]}>{typeLabel[item.type]}</Text>
              </View>
              <Feather
                name={expandedItem === item.id ? "chevron-up" : "chevron-down"}
                size={16}
                color={c.mutedForeground}
              />
            </View>

            {expandedItem === item.id && (
              <View style={styles.cardContent}>
                <View style={[styles.separator, { backgroundColor: c.border }]} />
                <View style={[styles.positivityContent, { backgroundColor: accent + "08", borderColor: accent + "25" }]}>
                  <Text style={[styles.positivityText, { color: c.foreground }]}>{item.content}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingBottom: 12,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#fff" },
  headerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  tabBarContent: { gap: 6, paddingBottom: 12 },
  tab: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 12, gap: 6,
  },
  tabText: { fontSize: 12, fontWeight: "600" },
  bannerCard: {
    flexDirection: "row", alignItems: "flex-start",
    marginHorizontal: 16, marginBottom: 12,
    padding: 16, borderRadius: 16, borderWidth: 1, gap: 12,
  },
  bannerEmoji: { fontSize: 28 },
  bannerTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  bannerText: { fontSize: 13, lineHeight: 18 },
  safetyNote: {
    flexDirection: "row", alignItems: "flex-start",
    marginHorizontal: 16, marginBottom: 12,
    padding: 12, borderRadius: 12, borderWidth: 1, gap: 8,
  },
  safetyNoteText: { flex: 1, fontSize: 12, lineHeight: 17 },
  card: {
    marginHorizontal: 16, marginBottom: 10,
    borderRadius: 16, borderWidth: 1.5,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row", alignItems: "center",
    padding: 16, gap: 12,
  },
  cardEmoji: { fontSize: 26 },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  cardSubtitle: { fontSize: 12, fontWeight: "600" },
  cardMeta: { alignItems: "flex-end", gap: 6 },
  durationBadge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4,
  },
  durationText: { fontSize: 11, fontWeight: "600" },
  cardContent: { paddingHorizontal: 16, paddingBottom: 16 },
  separator: { height: 1, marginBottom: 14 },
  sectionHeading: { fontSize: 13, fontWeight: "700", marginBottom: 8 },
  listItem: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 6 },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  listNum: {
    width: 20, height: 20, borderRadius: 6,
    alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
  },
  listNumText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  listText: { flex: 1, fontSize: 13, lineHeight: 20 },
  cautionBox: {
    flexDirection: "row", alignItems: "flex-start",
    padding: 12, borderRadius: 12, borderWidth: 1, gap: 8, marginTop: 12,
  },
  cautionText: { flex: 1, fontSize: 13, lineHeight: 18 },
  sanskritBox: {
    padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 14,
  },
  sanskritText: { fontSize: 15, lineHeight: 26, textAlign: "center" },
  translitText: { fontSize: 14, lineHeight: 22, fontStyle: "italic", marginBottom: 4 },
  meaningText: { fontSize: 13, lineHeight: 20 },
  purposeBox: {
    flexDirection: "row", alignItems: "flex-start",
    padding: 12, borderRadius: 12, borderWidth: 1, gap: 8, marginTop: 12,
  },
  purposeText: { flex: 1, fontSize: 13, lineHeight: 18 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryBadgeText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  activityDesc: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  tipBox: {
    flexDirection: "row", alignItems: "flex-start",
    padding: 12, borderRadius: 12, borderWidth: 1, gap: 8,
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18 },
  positivityContent: {
    padding: 16, borderRadius: 14, borderWidth: 1,
  },
  positivityText: { fontSize: 14, lineHeight: 24 },
});
