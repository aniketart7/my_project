import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
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

type Mode = "kick" | "contraction";

interface KickEntry { time: string; }
interface ContractionEntry { start: string; end: string; durationSec: number; gapSec: number | null; }

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function formatClockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function KickCounterScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const { currentWeek } = usePregnancy();

  const [mode, setMode] = useState<Mode>("kick");

  // Kick counter state
  const [kicks, setKicks] = useState<KickEntry[]>([]);
  const [kickSessionStart, setKickSessionStart] = useState<Date | null>(null);
  const [kickElapsed, setKickElapsed] = useState(0);

  // Contraction timer state
  const [contractions, setContractions] = useState<ContractionEntry[]>([]);
  const [contractionStart, setContractionStart] = useState<Date | null>(null);
  const [contractionElapsed, setContractionElapsed] = useState(0);
  const [isContracting, setIsContracting] = useState(false);

  const kickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const contractionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  // Kick timer
  useEffect(() => {
    if (kickSessionStart) {
      kickTimerRef.current = setInterval(() => {
        setKickElapsed(Date.now() - kickSessionStart.getTime());
      }, 1000);
    } else {
      if (kickTimerRef.current) clearInterval(kickTimerRef.current);
    }
    return () => { if (kickTimerRef.current) clearInterval(kickTimerRef.current); };
  }, [kickSessionStart]);

  // Contraction timer
  useEffect(() => {
    if (isContracting && contractionStart) {
      contractionTimerRef.current = setInterval(() => {
        setContractionElapsed(Date.now() - contractionStart.getTime());
      }, 1000);
    } else {
      if (contractionTimerRef.current) clearInterval(contractionTimerRef.current);
    }
    return () => { if (contractionTimerRef.current) clearInterval(contractionTimerRef.current); };
  }, [isContracting, contractionStart]);

  // ─── Kick actions ──────────────────────────────────────────────────────────
  const startKickSession = () => {
    setKickSessionStart(new Date());
    setKicks([]);
    setKickElapsed(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const logKick = () => {
    if (!kickSessionStart) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newKicks = [...kicks, { time: new Date().toISOString() }];
    setKicks(newKicks);

    if (newKicks.length >= 10) {
      const elapsed = Date.now() - kickSessionStart.getTime();
      const mins = Math.round(elapsed / 60000);
      Alert.alert(
        "🎉 10 Kicks Reached!",
        `Baby reached 10 kicks in ${mins} minute${mins !== 1 ? "s" : ""}. This is a healthy count! You can stop the session.`,
        [{ text: "Great!" }]
      );
    }
  };

  const resetKick = () => {
    setKickSessionStart(null);
    setKicks([]);
    setKickElapsed(0);
  };

  // ─── Contraction actions ───────────────────────────────────────────────────
  const startContraction = () => {
    setContractionStart(new Date());
    setIsContracting(true);
    setContractionElapsed(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const endContraction = () => {
    if (!contractionStart) return;
    const now = new Date();
    const durationSec = Math.round((now.getTime() - contractionStart.getTime()) / 1000);
    const lastContraction = contractions[contractions.length - 1];
    const gapSec = lastContraction
      ? Math.round((contractionStart.getTime() - new Date(lastContraction.end).getTime()) / 1000)
      : null;

    const newEntry: ContractionEntry = {
      start: contractionStart.toISOString(),
      end: now.toISOString(),
      durationSec,
      gapSec,
    };

    const newContractions = [...contractions, newEntry];
    setContractions(newContractions);
    setIsContracting(false);
    setContractionStart(null);
    setContractionElapsed(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Check for 5 min apart rule
    if (gapSec !== null && gapSec <= 300 && newContractions.length >= 3) {
      Alert.alert(
        "⚠️ Contractions Close Together",
        "Your contractions are 5 minutes apart or less. If this has continued for more than 1 hour, go to the hospital immediately.",
        [{ text: "Go to hospital now", style: "destructive" }, { text: "Keep monitoring" }]
      );
    }
  };

  const resetContractions = () => {
    setContractions([]);
    setIsContracting(false);
    setContractionStart(null);
    setContractionElapsed(0);
  };

  // Avg contraction gap
  const gaps = contractions.map(c => c.gapSec).filter(g => g !== null) as number[];
  const avgGapMin = gaps.length > 0 ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length / 60) : null;
  const avgDurationSec = contractions.length > 0
    ? Math.round(contractions.reduce((a, b) => a + b.durationSec, 0) / contractions.length)
    : null;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: mode === "kick" ? "#e8608a" : "#5b8fd6" }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{mode === "kick" ? "Kick Counter" : "Contraction Timer"}</Text>
          <Text style={styles.sub}>Week {currentWeek} {mode === "kick" ? "· Start from Week 28" : "· Track labour contractions"}</Text>
        </View>
      </View>

      {/* Mode tabs */}
      <View style={[styles.modeTabs, { backgroundColor: c.card, borderColor: c.border }]}>
        <TouchableOpacity
          style={[styles.modeTab, mode === "kick" && { backgroundColor: "#e8608a" }]}
          onPress={() => { setMode("kick"); Haptics.selectionAsync(); }}
        >
          <Feather name="target" size={15} color={mode === "kick" ? "#fff" : "#888"} />
          <Text style={[styles.modeTabText, mode === "kick" && { color: "#fff" }]}>Kick Count</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, mode === "contraction" && { backgroundColor: "#5b8fd6" }]}
          onPress={() => { setMode("contraction"); Haptics.selectionAsync(); }}
        >
          <Feather name="clock" size={15} color={mode === "contraction" ? "#fff" : "#888"} />
          <Text style={[styles.modeTabText, mode === "contraction" && { color: "#fff" }]}>Contractions</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ──────────── KICK COUNTER ──────────── */}
        {mode === "kick" && (
          <>
            {currentWeek < 28 && (
              <View style={[styles.infoBanner, { backgroundColor: "#f0a50012", borderColor: "#f0a50040" }]}>
                <Feather name="info" size={14} color="#f0a500" />
                <Text style={[styles.infoBannerText, { color: "#f0a500" }]}>
                  Kick counting is typically recommended from Week 28. You are currently at Week {currentWeek}.
                </Text>
              </View>
            )}

            <View style={styles.kickCenter}>
              {/* Big kick counter */}
              <View style={[styles.kickCircle, { borderColor: "#e8608a" }]}>
                <Text style={[styles.kickNum, { color: "#e8608a" }]}>{kicks.length}</Text>
                <Text style={styles.kickNumLabel}>kicks</Text>
                <Text style={styles.kickGoal}>goal: 10</Text>
              </View>

              {/* Session timer */}
              {kickSessionStart && (
                <Text style={[styles.kickTimer, { color: c.mutedForeground }]}>
                  Session: {formatTime(kickElapsed)}
                </Text>
              )}

              {/* Controls */}
              {!kickSessionStart ? (
                <TouchableOpacity style={[styles.startBtn, { backgroundColor: "#e8608a" }]} onPress={startKickSession}>
                  <Feather name="play" size={20} color="#fff" />
                  <Text style={styles.startBtnText}>Start Session</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.kickControls}>
                  <TouchableOpacity style={[styles.kickBtn, { backgroundColor: "#e8608a" }]} onPress={logKick}>
                    <Text style={styles.kickBtnText}>Feel a kick?{"\n"}Tap here!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.resetSmallBtn, { borderColor: "#e8608a30" }]} onPress={resetKick}>
                    <Feather name="refresh-ccw" size={16} color="#e8608a" />
                    <Text style={{ color: "#e8608a", fontSize: 12, fontWeight: "600" }}>Reset</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Info cards */}
            <View style={[styles.infoCard, { backgroundColor: c.card, borderColor: c.border }]}>
              <Text style={[styles.infoCardTitle, { color: c.foreground }]}>How to count kicks</Text>
              {[
                "Choose a time when baby is usually active (often after meals)",
                "Lie on your left side or sit comfortably",
                "Count each movement: kick, roll, flutter, or swish",
                "Aim for 10 movements within 2 hours",
                "If you don't feel 10 kicks in 2 hours, contact your doctor",
              ].map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <Text style={[styles.tipNum, { color: "#e8608a" }]}>{i + 1}</Text>
                  <Text style={[styles.tipText, { color: c.foreground }]}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Kick log */}
            {kicks.length > 0 && (
              <View style={[styles.infoCard, { backgroundColor: c.card, borderColor: c.border }]}>
                <Text style={[styles.infoCardTitle, { color: c.foreground }]}>Session Log</Text>
                {kicks.slice().reverse().map((k, i) => (
                  <View key={i} style={[styles.logRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
                    <Text style={[styles.logNum, { color: "#e8608a" }]}>#{kicks.length - i}</Text>
                    <Text style={[styles.logTime, { color: c.mutedForeground }]}>{formatClockTime(k.time)}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* ──────────── CONTRACTION TIMER ──────────── */}
        {mode === "contraction" && (
          <>
            <View style={[styles.infoBanner, { backgroundColor: "#5b8fd612", borderColor: "#5b8fd630" }]}>
              <Feather name="alert-circle" size={14} color="#5b8fd6" />
              <Text style={[styles.infoBannerText, { color: "#5b8fd6" }]}>
                If contractions are 5 min apart for more than 1 hour, go to hospital. Call your doctor if before Week 37.
              </Text>
            </View>

            {/* Stats row */}
            {contractions.length > 0 && (
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { borderColor: "#5b8fd630", backgroundColor: "#5b8fd610" }]}>
                  <Text style={[styles.statNum, { color: "#5b8fd6" }]}>{contractions.length}</Text>
                  <Text style={styles.statLabel}>Contractions</Text>
                </View>
                <View style={[styles.statCard, { borderColor: "#9b6db530", backgroundColor: "#9b6db510" }]}>
                  <Text style={[styles.statNum, { color: "#9b6db5" }]}>{avgGapMin !== null ? `${avgGapMin}m` : "—"}</Text>
                  <Text style={styles.statLabel}>Avg apart</Text>
                </View>
                <View style={[styles.statCard, { borderColor: "#ef6c4b30", backgroundColor: "#ef6c4b10" }]}>
                  <Text style={[styles.statNum, { color: "#ef6c4b" }]}>{avgDurationSec !== null ? `${avgDurationSec}s` : "—"}</Text>
                  <Text style={styles.statLabel}>Avg duration</Text>
                </View>
              </View>
            )}

            {/* Big button */}
            <View style={styles.kickCenter}>
              {isContracting ? (
                <>
                  <View style={[styles.kickCircle, { borderColor: "#5b8fd6", borderWidth: 4 }]}>
                    <Text style={[styles.kickNum, { color: "#5b8fd6", fontSize: 36 }]}>{formatTime(contractionElapsed)}</Text>
                    <Text style={styles.kickNumLabel}>contraction active</Text>
                  </View>
                  <TouchableOpacity style={[styles.startBtn, { backgroundColor: "#5b8fd6" }]} onPress={endContraction}>
                    <Feather name="square" size={20} color="#fff" />
                    <Text style={styles.startBtnText}>Contraction ended</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={[styles.kickCircle, { borderColor: "#5b8fd630" }]}>
                    <Text style={[styles.kickNum, { color: "#5b8fd6" }]}>{contractions.length}</Text>
                    <Text style={styles.kickNumLabel}>logged</Text>
                    {contractions.length > 0 && contractions[contractions.length - 1].gapSec !== null && (
                      <Text style={[styles.kickGoal, { color: "#5b8fd6" }]}>
                        Last gap: {Math.round((contractions[contractions.length - 1].gapSec || 0) / 60)}m {(contractions[contractions.length - 1].gapSec || 0) % 60}s
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity style={[styles.startBtn, { backgroundColor: "#5b8fd6" }]} onPress={startContraction}>
                    <Feather name="circle" size={20} color="#fff" />
                    <Text style={styles.startBtnText}>Contraction started</Text>
                  </TouchableOpacity>
                  {contractions.length > 0 && (
                    <TouchableOpacity style={[styles.resetSmallBtn, { borderColor: "#5b8fd630" }]} onPress={resetContractions}>
                      <Feather name="refresh-ccw" size={16} color="#5b8fd6" />
                      <Text style={{ color: "#5b8fd6", fontSize: 12, fontWeight: "600" }}>Reset all</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            {/* Contraction log */}
            {contractions.length > 0 && (
              <View style={[styles.infoCard, { backgroundColor: c.card, borderColor: c.border }]}>
                <Text style={[styles.infoCardTitle, { color: c.foreground }]}>Contraction History</Text>
                {contractions.slice().reverse().map((entry, i) => (
                  <View key={i} style={[styles.logRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }, { flexDirection: "column", alignItems: "flex-start", gap: 2 }]}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <Text style={[styles.logNum, { color: "#5b8fd6" }]}>#{contractions.length - i}</Text>
                      <Text style={[styles.logTime, { color: c.foreground, fontWeight: "700" }]}>{entry.durationSec}s duration</Text>
                      {entry.gapSec !== null && (
                        <View style={[styles.gapBadge, { backgroundColor: entry.gapSec <= 300 ? "#e8608a20" : "#6db58a20" }]}>
                          <Text style={{ fontSize: 11, fontWeight: "700", color: entry.gapSec <= 300 ? "#e8608a" : "#6db58a" }}>
                            {Math.floor(entry.gapSec / 60)}m {entry.gapSec % 60}s apart
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.logTime, { color: c.mutedForeground }]}>
                      {formatClockTime(entry.start)} → {formatClockTime(entry.end)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* 5-1-1 rule */}
            <View style={[styles.infoCard, { backgroundColor: c.card, borderColor: c.border }]}>
              <Text style={[styles.infoCardTitle, { color: c.foreground }]}>The 5-1-1 Rule</Text>
              <Text style={[styles.ruleText, { color: c.foreground }]}>
                Go to hospital when contractions are:
              </Text>
              {[
                { key: "5", text: "5 minutes apart" },
                { key: "1", text: "1 minute long each" },
                { key: "1hr", text: "Going on for 1 hour" },
              ].map(r => (
                <View key={r.key} style={styles.ruleRow}>
                  <View style={[styles.ruleNumBox, { backgroundColor: "#5b8fd620" }]}>
                    <Text style={[styles.ruleNum, { color: "#5b8fd6" }]}>{r.key}</Text>
                  </View>
                  <Text style={[styles.ruleText, { color: c.foreground }]}>{r.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "800", color: "#fff" },
  sub: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  modeTabs: { flexDirection: "row", borderBottomWidth: 1, padding: 8, gap: 8, marginHorizontal: 16, marginTop: 16, borderRadius: 14 },
  modeTab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 10 },
  modeTabText: { fontSize: 14, fontWeight: "700", color: "#888" },
  infoBanner: { flexDirection: "row", alignItems: "flex-start", gap: 10, margin: 16, padding: 14, borderRadius: 14, borderWidth: 1 },
  infoBannerText: { flex: 1, fontSize: 13, fontWeight: "500", lineHeight: 18 },
  kickCenter: { alignItems: "center", paddingVertical: 24, gap: 20 },
  kickCircle: { width: 180, height: 180, borderRadius: 90, borderWidth: 4, alignItems: "center", justifyContent: "center" },
  kickNum: { fontSize: 56, fontWeight: "900", letterSpacing: -3 },
  kickNumLabel: { fontSize: 14, color: "#888", fontWeight: "600", marginTop: -4 },
  kickGoal: { fontSize: 12, color: "#aaa", marginTop: 4 },
  kickTimer: { fontSize: 18, fontWeight: "700" },
  startBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 16 },
  startBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  kickControls: { alignItems: "center", gap: 14 },
  kickBtn: { width: 160, height: 160, borderRadius: 80, alignItems: "center", justifyContent: "center" },
  kickBtnText: { color: "#fff", fontSize: 16, fontWeight: "800", textAlign: "center", lineHeight: 22 },
  resetSmallBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  statsRow: { flexDirection: "row", marginHorizontal: 16, gap: 10, marginBottom: 8 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "900", letterSpacing: -1 },
  statLabel: { fontSize: 10, color: "#888", fontWeight: "600", textAlign: "center" },
  infoCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, borderWidth: 1, padding: 16 },
  infoCardTitle: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  tipRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
  tipNum: { fontSize: 14, fontWeight: "800", minWidth: 18 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 19 },
  logRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  logNum: { fontSize: 13, fontWeight: "800", minWidth: 28 },
  logTime: { fontSize: 13, fontWeight: "500" },
  gapBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  ruleText: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  ruleNumBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  ruleNum: { fontSize: 13, fontWeight: "800" },
});
