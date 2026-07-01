import { ScrollView, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/lib/theme";
import type { Screen } from "@/lib/types";
import { ScreenIcon } from "./icons/ScreenIcon";

type ScreenTypesListProps = {
  screens: Screen[];
};

type ScreenTypeGroup = {
  format: string;
  type: string;
  orientation: string;
  count: number;
  vacantCount: number;
  dimensions: string;
};

function groupScreensByType(screens: Screen[]): ScreenTypeGroup[] {
  const groups = new Map<string, ScreenTypeGroup>();

  screens.forEach((screen) => {
    const key = `${screen.format}-${screen.type}-${screen.orientation}`;
    const existing = groups.get(key);

    if (existing) {
      existing.count++;
      if (screen.status === "VACANT") {
        existing.vacantCount++;
      }
    } else {
      groups.set(key, {
        format: screen.format,
        type: screen.type,
        orientation: screen.orientation,
        count: 1,
        vacantCount: screen.status === "VACANT" ? 1 : 0,
        dimensions: `${screen.widthCm}x${screen.heightCm} cm`,
      });
    }
  });

  return Array.from(groups.values());
}

export function ScreenTypesList({ screens }: ScreenTypesListProps) {
  const { colors } = useTheme();
  const screenTypes = groupScreensByType(screens);

  if (screenTypes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Ekran Çeşitleri</Text>
        <View style={[styles.badge, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
            {screenTypes.length} Tip
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {screenTypes.map((group, index) => {
          const isVacant = group.vacantCount > 0;
          const orientation = group.orientation === "Dikey" ? "vertical" : "horizontal";

          return (
            <View key={index} style={styles.card}>
              <LinearGradient
                colors={
                  isVacant
                    ? ["rgba(16, 185, 129, 0.10)", "rgba(16, 185, 129, 0.03)"]
                    : ["rgba(99, 102, 241, 0.10)", "rgba(99, 102, 241, 0.03)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientCard}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <ScreenIcon
                    size={36}
                    color={isVacant ? "#10B981" : colors.primary}
                    orientation={orientation}
                  />
                  <View
                    style={[
                      styles.countBadge,
                      { backgroundColor: isVacant ? "#10B981" : colors.primary },
                    ]}
                  >
                    <Text style={styles.countText}>{group.count}x</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={[styles.formatName, { color: colors.textPrimary }]}>
                  {group.format}
                </Text>

                {/* Info */}
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                      {group.type}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                      {group.orientation}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                      {group.dimensions}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                {isVacant && (
                  <View style={styles.statusContainer}>
                    <View style={styles.statusBadge}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>{group.vacantCount} Boş Slot</Text>
                    </View>
                  </View>
                )}
              </LinearGradient>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  scrollContent: {
    gap: 12,
    paddingRight: 20,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  gradientCard: {
    padding: 18,
    minWidth: 190,
    gap: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: 18,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  formatName: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  infoContainer: {
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statusText: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "700",
  },
});
