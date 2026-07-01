import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/lib/theme";
import { useAppStore } from "@/lib/store";
import { useLocationsWithScreens, useLocationPermission } from "@/lib/hooks";
import { LocationListItem } from "@/components/LocationListItem";

export default function ListScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const filters = useAppStore((state) => state.filters);
  const toggleViewMode = useAppStore((state) => state.toggleViewMode);
  const setSelectedLocation = useAppStore((state) => state.setSelectedLocation);

  const { data: locations = [], refetch, isRefetching } = useLocationsWithScreens(filters);

  // Konum izni (sadece ilk seferinde ister)
  useLocationPermission(true);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceVariant }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "500", letterSpacing: 0.5 }}>
            SAMSUN
          </Text>
          <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800", marginTop: 2 }}>
            Lokasyonlar
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            onPress={() => router.push("/modals/filters")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.surfaceVariant,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Feather name="sliders" size={20} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            onPress={() => {
              toggleViewMode();
              router.push("/(tabs)/map");
            }}
            style={{
              borderRadius: 999,
              paddingHorizontal: 18,
              paddingVertical: 12,
              backgroundColor: colors.primary,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Feather name="map" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Harita</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: Math.max(insets.bottom + 100, 160) }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={() => (
          <View style={{ padding: 60, alignItems: "center", gap: 16 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.surfaceVariant,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: colors.border,
            }}>
              <Feather name="map-pin" size={36} color={colors.textSecondary} />
            </View>
            <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "700", textAlign: "center" }}>
              Lokasyon Bulunamadı
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 20 }}>
              Filtreleri değiştirmeyi deneyin veya{"\n"}farklı bir arama yapın
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <LocationListItem
            location={item}
            screens={item.screens}
            onPress={(location) => {
              setSelectedLocation(location.id);
              toggleViewMode();
              router.push("/(tabs)/map");
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
