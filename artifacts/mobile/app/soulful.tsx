import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
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
  GarbhasanskarActivity,
  Mantra,
  PositivityItem,
  YogaPose,
  getActivitiesForRegion,
  getMantrasForRegion,
  getPositivityForRegion,
  getRegionForCountry,
  getTrimesterFromWeek,
  getYogaForTrimester,
} from "@/data/soulfulData";

type Tab = "yoga" | "mantra" | "garbhasanskar" | "positivity";

// ─── open URL helper ───────────────────────────────────────────────────────────
async function openUrl(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    // silently ignore
  }
}

// ─── Play Button ──────────────────────────────────────────────────────────────
function PlayButton({
  playUrl,
  spotifyUrl,
  small,
}: {
  playUrl: string;
  spotifyUrl?: string;
  small?: boolean;
}) {
  const c = colors.light;
  const [expanded, setExpanded] = useState(false);

  if (!spotifyUrl) {
    return (
      <TouchableOpacity
        style={[styles.playBtn, small && styles.playBtnSmall]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          openUrl(playUrl);
        }}
        activeOpacity={0.8}
      >
        <Feather name="play-circle" size={small ? 14 : 16} color="#fff" />
        <Text style={[styles.playBtnText, small && styles.playBtnTextSmall]}>Play</Text>
      </TouchableOpacity>
    );
  }

  if (expanded) {
    return (
      <View style={styles.playRow}>
        <TouchableOpacity
          style={[styles.playBtn, styles.playBtnYt]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            openUrl(playUrl);
            setExpanded(false);
          }}
          activeOpacity={0.8}
        >
          <Feather name="youtube" size={14} color="#fff" />
          <Text style={styles.playBtnText}>YouTube</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.playBtn, styles.playBtnSpotify]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            openUrl(spotifyUrl!);
            setExpanded(false);
          }}
          activeOpacity={0.8}
        >
          <Feather name="music" size={14} color="#fff" />
          <Text style={styles.playBtnText}>Spotify</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtnClose} onPress={() => setExpanded(false)}>
          <Feather name="x" size={14} color={c.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.playBtn, small && styles.playBtnSmall]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setExpanded(true);
      }}
      activeOpacity={0.8}
    >
      <Feather name="play-circle" size={small ? 14 : 16} color="#fff" />
      <Text style={[styles.playBtnText, small && styles.playBtnTextSmall]}>Play</Text>
    </TouchableOpacity>
  );
}

// ─── Yoga Tab ─────────────────────────────────────────────────────────────────
function YogaTab({ poses }: { poses: YogaPose[] }) {
  const c = colors.light;
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.infoBox, { backgroundColor: "#e8f4f0", borderColor: "#6db58a" }]}>
        <Feather name="info" size={14} color="#6db58a" />
        <Text style={[styles.infoText, { color: "#3a7a5c" }]}>
          Always practice with a certified prenatal yoga instructor for first sessions. Stop if any pose causes discomfort.
        </Text>
      </View>
      {poses.map((pose) => {
        const open = expanded === pose.id;
        return (
          <TouchableOpacity
            key={pose.id}
            style={styles.card}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setExpanded(open ? null : pose.id);
            }}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{pose.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{pose.name}</Text>
                <Text style={styles.cardSubtitle}>{pose.sanskritName} · {pose.duration}</Text>
              </View>
              <Feather name={open ? "chevron-up" : "chevron-down"} size={20} color={c.textSecondary} />
            </View>
            {open && (
              <View style={styles.cardBody}>
                <Text style={styles.sectionLabel}>Benefits</Text>
                {pose.benefits.map((b, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
                <Text style={[styles.sectionLabel, { marginTop: 12 }]}>How To</Text>
                {pose.instructions.map((step, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>{i + 1}.</Text>
                    <Text style={styles.bulletText}>{step}</Text>
                  </View>
                ))}
                {pose.caution && (
                  <View style={styles.cautionBox}>
                    <Feather name="alert-triangle" size={13} color="#c0392b" />
                    <Text style={styles.cautionText}>{pose.caution}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Mantra Tab ───────────────────────────────────────────────────────────────
function MantraTab({ mantras }: { mantras: Mantra[] }) {
  const c = colors.light;
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.infoBox, { backgroundColor: "#fff3e0", borderColor: "#f39c12" }]}>
        <Feather name="volume-2" size={14} color="#f39c12" />
        <Text style={[styles.infoText, { color: "#7d6608" }]}>
          Tap any card to expand. Use the Play button to open YouTube or Spotify and listen directly.
        </Text>
      </View>
      {mantras.map((m) => {
        const open = expanded === m.id;
        return (
          <TouchableOpacity
            key={m.id}
            style={styles.card}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setExpanded(open ? null : m.id);
            }}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>🕉️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{m.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>{m.purpose}</Text>
              </View>
              <View style={styles.headerRight}>
                <PlayButton playUrl={m.playUrl} spotifyUrl={m.spotifyUrl} small />
                <Feather
                  name={open ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={c.textSecondary}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </View>
            {open && (
              <View style={styles.cardBody}>
                {m.sanskrit && (
                  <>
                    <Text style={styles.sectionLabel}>Mantra</Text>
                    <Text style={styles.sanskritText}>{m.sanskrit}</Text>
                  </>
                )}
                {m.transliteration && (
                  <>
                    <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Transliteration</Text>
                    <Text style={styles.transliterationText}>{m.transliteration}</Text>
                  </>
                )}
                <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Meaning</Text>
                <Text style={styles.meaningText}>{m.meaning}</Text>
                <View style={styles.timingRow}>
                  <Feather name="clock" size={13} color="#9b6db5" />
                  <Text style={styles.timingText}>{m.timing}</Text>
                </View>
                <View style={styles.playRowFull}>
                  <PlayButton playUrl={m.playUrl} spotifyUrl={m.spotifyUrl} />
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Garbhasanskar Tab ────────────────────────────────────────────────────────
function GarbhasanskarTab({ activities }: { activities: GarbhasanskarActivity[] }) {
  const c = colors.light;
  const [expanded, setExpanded] = useState<string | null>(null);

  const categoryColors: Record<string, string> = {
    music: "#9b6db5",
    reading: "#5b8fd6",
    meditation: "#6db58a",
    communication: "#e8608a",
    art: "#ef6c4b",
    nature: "#3a7a5c",
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.infoBox, { backgroundColor: "#f3e5f5", borderColor: "#9b6db5" }]}>
        <Feather name="info" size={14} color="#9b6db5" />
        <Text style={[styles.infoText, { color: "#6a1b9a" }]}>
          Garbhasanskar is the practice of nurturing your baby's mind and soul through positive stimulation before birth.
        </Text>
      </View>
      {activities.map((activity) => {
        const open = expanded === activity.id;
        const catColor = categoryColors[activity.category] || c.primary;
        return (
          <TouchableOpacity
            key={activity.id}
            style={styles.card}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setExpanded(open ? null : activity.id);
            }}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{activity.emoji}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, { flexShrink: 1 }]}>{activity.title}</Text>
                  <View style={[styles.categoryBadge, { backgroundColor: catColor + "22" }]}>
                    <Text style={[styles.categoryText, { color: catColor }]}>{activity.category}</Text>
                  </View>
                </View>
                <Text style={styles.cardSubtitle}>{activity.duration}</Text>
              </View>
              <View style={styles.headerRight}>
                {activity.playUrl && (
                  <PlayButton playUrl={activity.playUrl} spotifyUrl={activity.spotifyUrl} small />
                )}
                <Feather
                  name={open ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={c.textSecondary}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </View>
            {open && (
              <View style={styles.cardBody}>
                <Text style={styles.descriptionText}>{activity.description}</Text>
                <View style={[styles.tipBox, { borderLeftColor: catColor }]}>
                  <Text style={[styles.tipLabel, { color: catColor }]}>💡 Tip</Text>
                  <Text style={styles.tipText}>{activity.tip}</Text>
                </View>
                {activity.playUrl && (
                  <View style={styles.playRowFull}>
                    <PlayButton playUrl={activity.playUrl} spotifyUrl={activity.spotifyUrl} />
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Positivity Tab ───────────────────────────────────────────────────────────
function PositivityTab({ items }: { items: PositivityItem[] }) {
  const c = colors.light;
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  const typeColors: Record<string, string> = {
    affirmation: "#e8608a",
    gratitude: "#6db58a",
    visualization: "#9b6db5",
    breath: "#5b8fd6",
  };
  const typeIcons: Record<string, string> = {
    affirmation: "heart",
    gratitude: "sun",
    visualization: "eye",
    breath: "wind",
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {items.map((item) => {
        const open = active === item.id;
        const col = typeColors[item.type] || c.primary;
        const icon = (typeIcons[item.type] || "star") as any;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, open && { borderColor: col, borderWidth: 1.5 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActive(open ? null : item.id);
            }}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.titleRow}>
                  <Feather name={icon} size={12} color={col} />
                  <Text style={[styles.typeText, { color: col }]}>
                    {" "}{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Text>
                </View>
              </View>
              <Feather name={open ? "chevron-up" : "chevron-down"} size={20} color={c.textSecondary} />
            </View>
            {open && (
              <View style={styles.cardBody}>
                <View style={[styles.positivityContent, { backgroundColor: col + "11" }]}>
                  <Text style={[styles.positivityText, { color: c.text }]}>{item.content}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SoulfulScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const { currentWeek, country } = usePregnancy();

  const trimester = getTrimesterFromWeek(currentWeek);
  const region = getRegionForCountry(country);

  const [activeTab, setActiveTab] = useState<Tab>("mantra");

  const poses = getYogaForTrimester(trimester);
  const mantras = getMantrasForRegion(trimester, region);
  const activities = getActivitiesForRegion(trimester, region);
  const positivity = getPositivityForRegion(trimester, region);

  const tabs: { id: Tab; label: string; icon: string; color: string }[] = [
    { id: "yoga", label: "Yoga", icon: "activity", color: "#6db58a" },
    { id: "mantra", label: "Mantra", icon: "volume-2", color: "#9b6db5" },
    { id: "garbhasanskar", label: "Garbha", icon: "music", color: "#ef6c4b" },
    { id: "positivity", label: "Peace", icon: "sun", color: "#e8608a" },
  ];

  const regionLabels: Record<string, string> = {
    india: "🇮🇳 Indian",
    western: "🌍 Western",
    islamic: "☪️ Islamic",
    eastasian: "🏮 East Asian",
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: "#9b6db5" }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Traditional & Soulful</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.headerSubtitle}>Week {currentWeek} · T{trimester}</Text>
            <View style={styles.regionBadge}>
              <Text style={styles.regionBadgeText}>{regionLabels[region] ?? "🌏 Indian"}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/settings" as any)}
          style={styles.settingsBtn}
        >
          <Feather name="settings" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: c.surface }]}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, active && { borderBottomColor: tab.color, borderBottomWidth: 2.5 }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab.id);
              }}
              activeOpacity={0.8}
            >
              <Feather name={tab.icon as any} size={16} color={active ? tab.color : c.textSecondary} />
              <Text
                style={[
                  styles.tabLabel,
                  { color: active ? tab.color : c.textSecondary, fontWeight: active ? "700" : "500" },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      {activeTab === "yoga" && <YogaTab poses={poses} />}
      {activeTab === "mantra" && <MantraTab mantras={mantras} />}
      {activeTab === "garbhasanskar" && <GarbhasanskarTab activities={activities} />}
      {activeTab === "positivity" && <PositivityTab items={positivity} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: { padding: 4 },
  settingsBtn: { padding: 4 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  regionBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  regionBadgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },

  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    }),
    elevation: 1,
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 10, gap: 3 },
  tabLabel: { fontSize: 11 },

  tabContent: { padding: 16, gap: 12, paddingBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
    }),
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.06)",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardEmoji: { fontSize: 26 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  cardSubtitle: { fontSize: 12, color: "#888", marginTop: 2 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  headerRight: { flexDirection: "row", alignItems: "center" },

  cardBody: { marginTop: 14, gap: 6 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9b6db5",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bulletRow: { flexDirection: "row", gap: 8 },
  bullet: { fontSize: 14, color: "#555", lineHeight: 22, minWidth: 16 },
  bulletText: { fontSize: 14, color: "#444", lineHeight: 22, flex: 1 },
  cautionBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#fde8e8",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: "flex-start",
  },
  cautionText: { fontSize: 13, color: "#c0392b", flex: 1, lineHeight: 19 },

  sanskritText: {
    fontSize: 16,
    color: "#9b6db5",
    lineHeight: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  transliterationText: { fontSize: 13, color: "#555", fontStyle: "italic", lineHeight: 22 },
  meaningText: { fontSize: 14, color: "#444", lineHeight: 22 },
  timingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  timingText: { fontSize: 12, color: "#9b6db5", fontStyle: "italic" },

  categoryBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  categoryText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  descriptionText: { fontSize: 14, color: "#444", lineHeight: 22 },
  tipBox: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    marginTop: 8,
  },
  tipLabel: { fontSize: 11, fontWeight: "700", marginBottom: 4 },
  tipText: { fontSize: 13, color: "#555", lineHeight: 20 },

  typeText: { fontSize: 12, fontWeight: "600" },
  positivityContent: { borderRadius: 12, padding: 14 },
  positivityText: { fontSize: 15, lineHeight: 26, fontStyle: "italic" },

  infoBox: {
    flexDirection: "row",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    alignItems: "flex-start",
  },
  infoText: { fontSize: 12, lineHeight: 18, flex: 1 },

  // ── Play buttons
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#9b6db5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  playBtnSmall: { paddingHorizontal: 8, paddingVertical: 4 },
  playBtnYt: { backgroundColor: "#c0392b" },
  playBtnSpotify: { backgroundColor: "#1db954" },
  playBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  playBtnTextSmall: { fontSize: 11 },
  playBtnClose: { padding: 4 },
  playRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  playRowFull: { marginTop: 10 },
});
