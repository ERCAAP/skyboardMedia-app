import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/lib/theme";
import type { Screen } from "@/lib/types";
import {
  formatDimensions,
  getStatusBadgeColor,
  getStatusLabel,
} from "@/lib/utils";

type ScreenCardProps = {
  screen: Screen;
  isSelected?: boolean;
  onPress?: (screen: Screen) => void;
};

export function ScreenCard({ screen, onPress, isSelected }: ScreenCardProps) {
  const { colors } = useTheme();
  const statusColor = getStatusBadgeColor(screen.status);

  return (
    <Pressable
      onPress={() => onPress?.(screen)}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 14,
        borderRadius: 18,
        backgroundColor: isSelected ? colors.primaryLight : colors.surface,
        borderWidth: isSelected ? 2.5 : 1.5,
        borderColor: isSelected ? colors.primary : colors.border,
        shadowColor: isSelected ? colors.primary : "#000",
        shadowOffset: { width: 0, height: isSelected ? 6 : 3 },
        shadowOpacity: isSelected ? 0.2 : 0.08,
        shadowRadius: isSelected ? 12 : 8,
        elevation: isSelected ? 6 : 2,
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
      accessibilityRole="button"
      accessibilityLabel={`${screen.name} ${getStatusLabel(screen.status)}`}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: isSelected ? colors.primary : colors.primary + "15",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: isSelected ? colors.primaryDark : colors.primary + "30",
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text
          style={{
            color: isSelected ? "#FFFFFF" : colors.primary,
            fontWeight: "800",
            fontSize: 11,
            textAlign: "center",
            letterSpacing: 0.3,
          }}
        >
          {screen.format}
        </Text>
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 16,
              fontWeight: "700",
              letterSpacing: 0.2,
            }}
          >
            {screen.name}
          </Text>
          <View
            style={{
              backgroundColor: statusColor,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 10,
              shadowColor: statusColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 0.5,
              }}
            >
              {getStatusLabel(screen.status)}
            </Text>
          </View>
        </View>
        <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "500", lineHeight: 18 }}>
          {screen.type} • {screen.orientation} • {formatDimensions(screen.widthCm, screen.heightCm)}
        </Text>
      </View>
    </Pressable>
  );
}
