import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/lib/theme";

const BAR_HEIGHT = 10;

export function OccupancyBar({ percentage }: { percentage: number }) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(100, percentage));

  // Color gradients based on occupancy level
  const getBarGradient = (): [string, string] => {
    if (clamped >= 80) return ["#EF4444", "#DC2626"]; // High occupancy - red gradient
    if (clamped >= 50) return ["#F59E0B", "#D97706"]; // Medium occupancy - orange gradient
    return ["#10B981", "#059669"]; // Low occupancy - green gradient
  };

  const [startColor, endColor] = getBarGradient();

  return (
    <View
      style={{
        height: BAR_HEIGHT,
        borderRadius: BAR_HEIGHT / 2,
        backgroundColor: colors.surfaceVariant,
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor: colors.borderLight,
        shadowColor: startColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <LinearGradient
        colors={[startColor, endColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: `${clamped}%`,
          height: "100%",
          borderRadius: BAR_HEIGHT / 2,
        }}
      />
    </View>
  );
}
