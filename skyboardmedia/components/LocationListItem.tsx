import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Location, Screen } from "@/lib/types";
import { useTheme } from "@/lib/theme";
import { groupScreenTypes } from "@/lib/utils";

type LocationListItemProps = {
  location: Location;
  screens?: Screen[];
  onPress?: (location: Location) => void;
};

export function LocationListItem({ location, onPress, screens = [] }: LocationListItemProps) {
  const { colors } = useTheme();
  const formats = groupScreenTypes(screens);

  return (
    <Pressable
      onPress={() => onPress?.(location)}
      style={({ pressed }) => ({
        padding: 20,
        backgroundColor: colors.surface,
        borderRadius: 20,
        gap: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1.5,
        borderColor: colors.border,
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
    >
      <View>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 19,
            fontWeight: "800",
            letterSpacing: 0.3,
            marginBottom: 6,
          }}
        >
          {location.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary }} />
          <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "500" }}>
            {location.district} • {location.environment}
          </Text>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              backgroundColor: colors.primary + "20",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: colors.primary + "40",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Ionicons name="tv" size={16} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "800" }}>
              {location.totalScreens} Ekran
            </Text>
          </View>
          {formats.length ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 }}>
              {formats.map((format) => (
                <View
                  key={format}
                  style={{
                    backgroundColor: colors.surfaceVariant,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: colors.borderLight,
                  }}
                >
                  <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: "700" }}>
                    {format}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
