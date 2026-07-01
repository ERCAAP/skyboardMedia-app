import { Linking, Pressable, Text, View } from "react-native";
import { memo, useMemo } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

import type { Location, Screen } from "@/lib/types";
import { useTheme } from "@/lib/theme";
import {
  getLocationStatusLabel,
  groupScreenTypes,
} from "@/lib/utils";
import { ScreenTypesList } from "@/components/ScreenTypesList";

const ACTION_BUTTONS = [
  { key: "call", label: "Ara" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "quote", label: "Teklif İste" },
  { key: "directions", label: "Yol Tarifi" },
] as const;

type ActionKey = (typeof ACTION_BUTTONS)[number]["key"];

type BottomSheetContentProps = {
  location: Location;
  screens: Screen[];
};

function performAction(actionKey: ActionKey, location: Location, screens: Screen[]) {
  const primaryPhone = screens.find((screen) => screen.phone)?.phone;
  const destination = `${location.lat},${location.lng}`;

  switch (actionKey) {
    case "call":
      if (primaryPhone) {
        Linking.openURL(`tel:${primaryPhone}`);
      }
      break;
    case "whatsapp":
      if (primaryPhone) {
        const sanitized = primaryPhone.replace(/[^+\d]/g, "");
        Linking.openURL(`https://wa.me/${sanitized.replace(/^[+]/, "")}`);
      }
      break;
    case "quote":
      Linking.openURL(
        `https://wa.me/${primaryPhone ? primaryPhone.replace(/[^\d]/g, "") : "905554443322"}?text=${encodeURIComponent(
          `Merhaba, ${location.name} lokasyonundaki ${location.totalScreens} ekran için teklif rica ediyorum.`,
        )}`,
      );
      break;
    case "directions":
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
      );
      break;
    default:
      break;
  }
}

export const BottomSheetContent = memo(function BottomSheetContent({
  location,
  screens,
}: BottomSheetContentProps) {
  const { colors } = useTheme();

  const formats = useMemo(() => groupScreenTypes(screens), [screens]);

  return (
    <BottomSheetScrollView
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, gap: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Location Header Card */}
      <View
        style={{
          gap: 12,
          padding: 18,
          backgroundColor: colors.surfaceElevated,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.borderLight,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: colors.textPrimary,
              letterSpacing: 0.4,
            }}
          >
            {location.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20, flex: 1 }}>
              {location.address}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <View
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800", letterSpacing: 0.3 }}>
              {location.totalScreens} Ekran
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {formats.map((format) => (
            <View
              key={format}
              style={{
                backgroundColor: colors.surface,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "700" }}>
                {format}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Screen Types List */}
      <ScreenTypesList screens={screens} />

      {/* Action Buttons Grid */}
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.textSecondary, fontWeight: "600", fontSize: 13 }}>
          Hızlı İşlemler
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {ACTION_BUTTONS.map((action, index) => {
            const iconNames: Array<keyof typeof Ionicons.glyphMap> = ["call", "logo-whatsapp", "document-text", "navigate"];
            return (
              <Pressable
                key={action.key}
                onPress={() => performAction(action.key, location, screens)}
                style={({ pressed }) => ({
                  flex: 1,
                  minWidth: "22%",
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons name={iconNames[index]} size={20} color={colors.textSecondary} style={{ marginBottom: 4 }} />
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontWeight: "600",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  {action.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </BottomSheetScrollView>
  );
});
