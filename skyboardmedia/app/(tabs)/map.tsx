import { Feather } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import ClusteredMapView from "react-native-map-clustering";
import RNMapView, { Marker, Region } from "react-native-maps";

import { BottomSheetContent } from "@/components/BottomSheetContent";
import { LocationMarker } from "@/components/LocationMarker";
import { useLocations, useLocationScreens, useLocationPermission } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";

const INITIAL_REGION: Region = {
  latitude: 41.2867,
  longitude: 36.33,
  latitudeDelta: 0.4,
  longitudeDelta: 0.4,
};

export default function MapScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const mapRef = useRef<RNMapView | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const filters = useAppStore((state) => state.filters);
  const setSelectedLocation = useAppStore((state) => state.setSelectedLocation);
  const selectedLocationId = useAppStore((state) => state.selectedLocationId);

  const { data: locations = [] } = useLocations(filters);
  const { data: screens = [] } = useLocationScreens(selectedLocationId);

  // Uygulama açıldığında otomatik konum izni iste
  const { isGranted: hasLocationPermission } = useLocationPermission(true);

  const activeLocation = useMemo(
    () => locations.find((item) => item.id === selectedLocationId),
    [locations, selectedLocationId],
  );

  const snapPoints = useMemo(() => ["12%", "48%", "92%"], []);

  const animateToLocation = useCallback((latitude: number, longitude: number) => {
    mapRef.current?.animateCamera(
      {
        center: { latitude, longitude },
        zoom: 15,
      },
      { duration: 600 },
    );
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Konum İzni Gerekli',
          'Konumunuzu göstermek için konum iznine ihtiyacımız var.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation(location);

      // Haritayı kullanıcının konumuna odakla
      animateToLocation(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Konum alma hatası:', error);
      Alert.alert(
        'Konum Alınamadı',
        'Konumunuz alınırken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLocationLoading(false);
    }
  }, [animateToLocation]);

  const handleMarkerPress = useCallback(
    (locationId: string, latitude: number, longitude: number) => {
      setSelectedLocation(locationId);
      animateToLocation(latitude, longitude);
      // Use present() to open the modal
      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 100);
    },
    [animateToLocation, setSelectedLocation],
  );

  useEffect(() => {
    if (activeLocation) {
      animateToLocation(activeLocation.lat, activeLocation.lng);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocation, animateToLocation]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View
        style={{
          position: "absolute",
          top: insets.top + 14,
          left: 16,
          right: 16,
          zIndex: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 14,
          paddingHorizontal: 18,
          backgroundColor: colors.surface,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 10,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "500", letterSpacing: 0.5 }}>
            SAMSUN
          </Text>
          <Text style={{ color: colors.textPrimary, fontSize: 19, fontWeight: "800", marginTop: 2 }}>
            Reklam Noktaları
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
            onPress={() => router.push("/(tabs)/profile")}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 3,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Feather name="user" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ClusteredMapView
          style={{ flex: 1 }}
          ref={mapRef}
          initialRegion={INITIAL_REGION}
          radius={60}
          preserveClusterPressBehavior={true}
        >
          {locations.map((location) => (
            <LocationMarker
              key={location.id}
              location={location}
              onPress={(loc) => handleMarkerPress(loc.id, loc.lat, loc.lng)}
            />
          ))}
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}
              title="Konumunuz"
              description="Buradasınız"
              pinColor="blue"
            />
          )}
        </ClusteredMapView>
      </View>

      <Pressable
        onPress={() => {
          bottomSheetRef.current?.close();
          setSelectedLocation(undefined);
          mapRef.current?.animateToRegion(INITIAL_REGION, 600);
        }}
        style={{
          position: "absolute",
          bottom: insets.bottom + 8,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 8,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Feather name="navigation" size={24} color={colors.textPrimary} />
      </Pressable>

      <Pressable
        onPress={getCurrentLocation}
        disabled={locationLoading}
        style={{
          position: "absolute",
          bottom: insets.bottom + 74,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: locationLoading ? colors.surfaceVariant : colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: colors.border,
          opacity: locationLoading ? 0.7 : 1,
        }}
      >
        {locationLoading ? (
          <Feather name="loader" size={24} color={colors.textSecondary} />
        ) : (
          <Feather name="crosshair" size={24} color="#FFFFFF" />
        )}
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        enablePanDownToClose
        enableDismissOnClose
        onDismiss={() => {
          setSelectedLocation(undefined);
        }}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        {activeLocation ? (
          <BottomSheetContent
            location={activeLocation}
            screens={screens}
          />
        ) : (
          <View style={{ padding: 24 }}>
            <Text style={{ color: colors.textSecondary }}>Bir lokasyon seçin.</Text>
          </View>
        )}
      </BottomSheetModal>
    </View>
  );
}
