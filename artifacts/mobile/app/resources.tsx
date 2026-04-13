import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { resourceCategories, Resource } from "@/data/resourcesData";

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const [expandedCategory, setExpandedCategory] = useState<string | null>("general");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleOpenLink = async (url: string, title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch {
      // silently fail
    }
  };

  const toggleCategory = (id: string) => {
    Haptics.selectionAsync();
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: "#9b6db5" }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Resources</Text>
            <Text style={styles.headerSubtitle}>Curated pregnancy guides & tools</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 40, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.infoBanner, { backgroundColor: "#9b6db510", borderColor: "#9b6db530" }]}>
          <Feather name="info" size={14} color="#9b6db5" />
          <Text style={[styles.infoBannerText, { color: c.mutedForeground }]}>
            Tap any link to open it in your browser. All resources are from trusted medical and
            parenting organisations.
          </Text>
        </View>

        {resourceCategories.map((category) => {
          const isExpanded = expandedCategory === category.id;
          return (
            <View key={category.id} style={styles.categorySection}>
              <TouchableOpacity
                style={[
                  styles.categoryHeader,
                  {
                    backgroundColor: c.card,
                    borderColor: isExpanded ? category.color : c.border,
                    borderBottomLeftRadius: isExpanded ? 0 : 16,
                    borderBottomRightRadius: isExpanded ? 0 : 16,
                  },
                ]}
                onPress={() => toggleCategory(category.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + "18" }]}>
                  <Feather name={category.icon as any} size={18} color={category.color} />
                </View>
                <Text style={[styles.categoryTitle, { color: c.foreground }]}>
                  {category.title}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: category.color + "20" }]}>
                  <Text style={[styles.countText, { color: category.color }]}>
                    {category.resources.length}
                  </Text>
                </View>
                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={c.mutedForeground}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View
                  style={[
                    styles.resourcesList,
                    { backgroundColor: c.card, borderColor: category.color },
                  ]}
                >
                  {category.resources.map((resource, idx) => (
                    <React.Fragment key={resource.url}>
                      <ResourceItem
                        resource={resource}
                        accentColor={category.color}
                        onPress={() => handleOpenLink(resource.url, resource.title)}
                      />
                      {idx < category.resources.length - 1 && (
                        <View style={[styles.resourceSeparator, { backgroundColor: c.border }]} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={[styles.disclaimer, { backgroundColor: c.card, borderColor: c.border }]}>
          <Feather name="alert-circle" size={14} color={c.mutedForeground} />
          <Text style={[styles.disclaimerText, { color: c.mutedForeground }]}>
            These resources are for informational purposes only. Always consult your doctor or
            midwife for personalised medical advice during pregnancy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ResourceItem({
  resource,
  accentColor,
  onPress,
}: {
  resource: Resource;
  accentColor: string;
  onPress: () => void;
}) {
  const c = colors.light;

  return (
    <TouchableOpacity style={styles.resourceItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.resourceContent}>
        <Text style={[styles.resourceTitle, { color: c.foreground }]}>{resource.title}</Text>
        <Text style={[styles.resourceDesc, { color: c.mutedForeground }]} numberOfLines={2}>
          {resource.description}
        </Text>
        <View style={styles.resourceUrl}>
          <Feather name="external-link" size={11} color={accentColor} />
          <Text style={[styles.resourceUrlText, { color: accentColor }]} numberOfLines={1}>
            {resource.url.replace("https://", "").split("/")[0]}
          </Text>
        </View>
      </View>
      <View style={[styles.openBtn, { backgroundColor: accentColor + "15", borderColor: accentColor + "30" }]}>
        <Feather name="arrow-up-right" size={16} color={accentColor} />
      </View>
    </TouchableOpacity>
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
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#ffffff" },
  headerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  infoBannerText: { flex: 1, fontSize: 13, lineHeight: 18 },
  categorySection: { marginHorizontal: 16, marginBottom: 10 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: { flex: 1, fontSize: 15, fontWeight: "700" },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: { fontSize: 12, fontWeight: "700" },
  resourcesList: {
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  resourceContent: { flex: 1, gap: 3 },
  resourceTitle: { fontSize: 14, fontWeight: "700" },
  resourceDesc: { fontSize: 12, lineHeight: 17 },
  resourceUrl: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  resourceUrlText: { fontSize: 11, fontWeight: "600" },
  openBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  resourceSeparator: { height: 1, marginHorizontal: 14 },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
