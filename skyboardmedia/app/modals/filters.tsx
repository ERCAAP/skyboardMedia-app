import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import type { District, Environment, Filters, ScreenStatus, ScreenType } from "@/lib/types";

const DISTRICTS: District[] = ["Tekkeköy", "Atakum", "İlkadım", "Çarşamba"];
const ENVIRONMENTS: Environment[] = ["İç", "Dış"];
const SCREEN_TYPES: ScreenType[] = ["LED", "Dijital"];
const STATUSES: ScreenStatus[] = ["VACANT", "OCCUPIED"];
const FLOORS = ["Zemin", "1", "2", "3"];

export default function FiltersModal() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);
  const clearFilters = useAppStore((state) => state.clearFilters);

  const [draft, setDraft] = useState<Filters>(filters);

  function toggleValue<K extends keyof Filters>(key: K, value: Filters[K]) {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  }

  const hasActiveFilters = Object.keys(draft).length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Modern Header with Glass Effect */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.surfaceElevated,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
            opacity: pressed ? 0.7 : 1,
            backgroundColor: colors.surfaceVariant,
          })}
        >
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </Pressable>

        <View style={{ alignItems: "center", gap: 2 }}>
          <Text style={{ color: colors.textPrimary, fontWeight: "800", fontSize: 20, letterSpacing: 0.3 }}>
            Filtreler
          </Text>
          {hasActiveFilters && (
            <View style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 10
            }}>
              <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>
                {Object.keys(draft).length} aktif
              </Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={() => {
            clearFilters();
            setDraft({});
          }}
          disabled={!hasActiveFilters}
          style={({ pressed }) => ({
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
            opacity: pressed ? 0.7 : hasActiveFilters ? 1 : 0.4,
            backgroundColor: hasActiveFilters ? colors.primaryLight : colors.surfaceVariant,
          })}
        >
          <Text style={{
            color: hasActiveFilters ? colors.primary : colors.textTertiary,
            fontWeight: "700",
            fontSize: 14
          }}>
            Temizle
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <FilterSection label="İlçe" iconName="location" description="Lokasyon seçin">
          {DISTRICTS.map((district) => (
            <FilterChip
              key={district}
              label={district}
              active={draft.district === district}
              onPress={() => toggleValue("district", district)}
            />
          ))}
        </FilterSection>

        <FilterSection label="İç / Dış" iconName="business" description="Mekan türü">
          {ENVIRONMENTS.map((env) => (
            <FilterChip
              key={env}
              label={env}
              active={draft.environment === env}
              onPress={() => toggleValue("environment", env)}
            />
          ))}
        </FilterSection>

        <FilterSection label="Ekran Tipi" iconName="tv" description="Teknoloji türü">
          {SCREEN_TYPES.map((type) => (
            <FilterChip
              key={type}
              label={type}
              active={draft.type === type}
              onPress={() => toggleValue("type", type)}
            />
          ))}
        </FilterSection>

        <FilterSection label="Kat" iconName="layers" description="Kat seviyesi">
          {FLOORS.map((floor) => (
            <FilterChip
              key={floor}
              label={floor}
              active={draft.floor === floor}
              onPress={() => toggleValue("floor", floor)}
            />
          ))}
        </FilterSection>

        <FilterSection label="Durum" iconName="radio-button-on" description="Ekran müsaitliği">
          {STATUSES.map((status) => (
            <FilterChip
              key={status}
              label={status === "VACANT" ? "Boş" : "Dolu"}
              active={draft.status === status}
              onPress={() => toggleValue("status", status)}
              statusColor={status === "VACANT" ? colors.accentVacant : colors.accentOccupied}
            />
          ))}
        </FilterSection>
      </ScrollView>

      {/* Elevated Footer with Actions */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 16),
          flexDirection: "row",
          gap: 12,
          backgroundColor: colors.surfaceElevated,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 16,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colors.border,
            alignItems: "center",
            backgroundColor: colors.surface,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ color: colors.textPrimary, fontWeight: "700", fontSize: 16 }}>Vazgeç</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setFilters(draft);
            router.back();
          }}
          style={({ pressed }) => ({
            flex: 2,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 8,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 0.5 }}>
            {hasActiveFilters ? `${Object.keys(draft).length} Filtre Uygula` : "Filtreleri Uygula"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function FilterSection({
  label,
  iconName,
  description,
  children,
}: {
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  description?: string;
  children: ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        gap: 12,
        padding: 16,
        backgroundColor: colors.surfaceVariant,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.borderLight,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {iconName && <Ionicons name={iconName} size={20} color={colors.textPrimary} />}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontWeight: "800",
              fontSize: 16,
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Text>
          {description && (
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                marginTop: 2,
              }}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>
    </View>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  statusColor?: string;
};

function FilterChip({ label, active, onPress, statusColor }: FilterChipProps) {
  const { colors } = useTheme();

  const backgroundColor = active
    ? statusColor
      ? statusColor + "20"
      : colors.primary + "20"
    : colors.surface;

  const borderColor = active ? (statusColor || colors.primary) : colors.border;
  const textColor = active ? (statusColor || colors.primary) : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: active ? 2 : 1.5,
        borderColor,
        backgroundColor,
        shadowColor: active ? borderColor : "transparent",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: active ? 0.25 : 0,
        shadowRadius: 6,
        elevation: active ? 3 : 0,
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {active && <Ionicons name="checkmark" size={14} color={textColor} />}
        <Text style={{ color: textColor, fontWeight: active ? "800" : "600", fontSize: 14 }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
