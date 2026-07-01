import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/lib/theme";
import type { CampaignSlot } from "@/lib/types";
import { PlayIcon } from "./icons/PlayIcon";

type LiveAdIndicatorProps = {
  campaign: CampaignSlot;
  screenName: string;
};

export function LiveAdIndicator({ campaign, screenName }: LiveAdIndicatorProps) {
  const { colors } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(campaign.endTime).getTime();
      const start = new Date(campaign.startTime).getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      const elapsed = Math.max(0, now - start);
      const total = end - start;
      const progressPct = Math.min(100, (elapsed / total) * 100);

      setTimeRemaining(remaining);
      setProgress(progressPct);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [campaign]);

  if (timeRemaining <= 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(239, 68, 68, 0.12)", "rgba(239, 68, 68, 0.03)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header with live indicator */}
        <View style={styles.header}>
          <View style={styles.liveContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.liveDot} />
            </Animated.View>
            <Text style={[styles.liveText, { color: colors.textSecondary }]}>CANLI YAYIN</Text>
          </View>
          <PlayIcon size={20} color="#EF4444" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <Text style={[styles.brandName, { color: colors.textPrimary }]}>
              {campaign.brand}
            </Text>
            <View style={styles.screenInfo}>
              <View style={[styles.screenDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.screenName, { color: colors.textSecondary }]}>
                {screenName}
              </Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerNumber}>{timeRemaining}</Text>
            <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>sn</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBackground, { backgroundColor: colors.surface }]}>
            <LinearGradient
              colors={["#EF4444", "#F87171"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBar, { width: `${progress}%` }]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {Math.round(progress)}%
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    padding: 20,
    gap: 16,
    borderWidth: 2,
    borderColor: "rgba(239, 68, 68, 0.25)",
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
  },
  liveText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flex: 1,
    gap: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  screenInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  screenDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  screenName: {
    fontSize: 13,
    fontWeight: "500",
  },
  timerContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: "#EF4444",
    lineHeight: 32,
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: -2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    minWidth: 40,
    textAlign: "right",
  },
});
