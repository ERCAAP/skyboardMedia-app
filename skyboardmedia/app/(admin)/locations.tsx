import { useEffect, useState, useRef } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";

import { useTheme } from "@/lib/theme";
import { useUserProfile } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

interface ScreenType {
  id: string;
  name: string;
  display_name: string;
}

interface SelectedScreen {
  id: string;
  name: string;
  display_name: string;
  quantity: number;
}

const INITIAL_REGION: Region = {
  latitude: 41.2867,
  longitude: 36.33,
  latitudeDelta: 0.4,
  longitudeDelta: 0.4,
};

export default function AdminLocationsScreen() {
  const { colors } = useTheme();
  const userProfile = useUserProfile();
  const mapRef = useRef<MapView | null>(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showScreenSelector, setShowScreenSelector] = useState(false);
  const [locationMethod, setLocationMethod] = useState<"gps" | "address" | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [addressInput, setAddressInput] = useState("");
  const [screenTypes, setScreenTypes] = useState<ScreenType[]>([]);
  const [selectedScreens, setSelectedScreens] = useState<SelectedScreen[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (userProfile?.role !== "admin") {
      Alert.alert("Erişim Reddedildi", "Bu sayfaya erişim yetkiniz yok");
      router.back();
      return;
    }

    fetchScreenTypes();
  }, [userProfile]);

  const fetchScreenTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("screen_types")
        .select("*")
        .order("display_name");

      if (error) {
        console.error("Error fetching screen types:", error);
        return;
      }

      setScreenTypes(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLocationMethod("gps");
    setIsLoadingLocation(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Konum İzni Gerekli",
          "Konumunuzu almak için konum iznine ihtiyacımız var."
        );
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      const addressData = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let address = "Bilinmeyen Adres";
      if (addressData && addressData.length > 0) {
        const addr = addressData[0];
        address = [
          addr.street,
          addr.district,
          addr.city,
          addr.region,
          addr.country,
        ]
          .filter(Boolean)
          .join(", ");
      }

      setSelectedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        address,
      });

      // Animate map to location
      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );

      setShowLocationModal(false);
      setShowScreenSelector(true);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Konum Alınamadı",
        "Konumunuz alınırken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAddressInput = async () => {
    if (!addressInput.trim()) {
      Alert.alert("Hata", "Lütfen bir adres girin");
      return;
    }

    setLocationMethod("address");
    setIsLoadingLocation(true);

    try {
      // Geocode address to coordinates
      const geocoded = await Location.geocodeAsync(addressInput);

      if (geocoded.length === 0) {
        Alert.alert("Adres Bulunamadı", "Girdiğiniz adres bulunamadı. Lütfen tekrar deneyin.");
        setIsLoadingLocation(false);
        return;
      }

      const { latitude, longitude } = geocoded[0];

      setSelectedLocation({
        lat: latitude,
        lng: longitude,
        address: addressInput,
      });

      // Animate map to location
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );

      setShowLocationModal(false);
      setShowScreenSelector(true);
    } catch (error) {
      console.error("Error geocoding address:", error);
      Alert.alert(
        "Adres Alınamadı",
        "Adres koordinatları alınırken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const toggleScreenSelection = (screenType: ScreenType) => {
    const existingIndex = selectedScreens.findIndex((s) => s.id === screenType.id);

    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedScreens(selectedScreens.filter((s) => s.id !== screenType.id));
    } else {
      // Add with quantity 1
      setSelectedScreens([
        ...selectedScreens,
        { ...screenType, quantity: 1 },
      ]);
    }
  };

  const updateQuantity = (screenId: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectedScreens(
      selectedScreens.map((s) =>
        s.id === screenId ? { ...s, quantity } : s
      )
    );
  };

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      Alert.alert("Hata", "Lütfen bir konum seçin");
      return;
    }

    if (selectedScreens.length === 0) {
      Alert.alert("Hata", "Lütfen en az bir ekran tipi seçin");
      return;
    }

    setIsSaving(true);

    try {
      // Insert location
      const { data: locationData, error: locationError } = await supabase
        .from("locations")
        .insert({
          name: selectedLocation.address.split(",")[0] || "Yeni Lokasyon",
          address: selectedLocation.address,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          created_by: userProfile?.user_id,
        })
        .select()
        .single();

      if (locationError) {
        throw locationError;
      }

      // Insert location screens
      const screenInserts = selectedScreens.map((screen) => ({
        location_id: locationData.id,
        screen_type_id: screen.id,
        quantity: screen.quantity,
      }));

      const { error: screensError } = await supabase
        .from("location_screens")
        .insert(screenInserts);

      if (screensError) {
        throw screensError;
      }

      Alert.alert(
        "Başarılı",
        "Lokasyon başarıyla eklendi!",
        [
          {
            text: "Tamam",
            onPress: () => {
              // Reset state
              setSelectedLocation(null);
              setSelectedScreens([]);
              setAddressInput("");
              setShowScreenSelector(false);
              // Go back or refresh
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error saving location:", error);
      Alert.alert("Hata", "Lokasyon kaydedilirken bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  const resetAndClose = () => {
    setShowLocationModal(false);
    setShowScreenSelector(false);
    setLocationMethod(null);
    setSelectedLocation(null);
    setSelectedScreens([]);
    setAddressInput("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceVariant }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.surface,
          paddingTop: 60,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceVariant,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="arrow-left" size={20} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Feather name="map-pin" size={24} color={colors.primary} />
              <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "700" }}>
                Lokasyon Ekle
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
              Yeni reklam noktası oluştur
            </Text>
          </View>
        </View>
      </View>

      {/* Map */}
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={INITIAL_REGION}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
              }}
              title="Yeni Lokasyon"
              description={selectedLocation.address}
            />
          )}
        </MapView>
      </View>

      {/* Add Location Button */}
      <Pressable
        onPress={() => setShowLocationModal(true)}
        style={{
          position: "absolute",
          bottom: 30,
          left: 20,
          right: 20,
          backgroundColor: colors.primary,
          paddingVertical: 18,
          paddingHorizontal: 24,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Feather name="plus" size={24} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
          Lokasyon Ekle
        </Text>
      </Pressable>

      {/* Location Method Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 24,
                paddingBottom: 40,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 5,
                    backgroundColor: colors.border,
                    borderRadius: 3,
                    marginBottom: 16,
                  }}
                />
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  Konum Nasıl Eklensin?
                </Text>
              </View>

              <Pressable
                onPress={handleGetCurrentLocation}
                disabled={isLoadingLocation}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {isLoadingLocation && locationMethod === "gps" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Feather name="crosshair" size={20} color="#fff" />
                )}
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                  Ben Burdayım
                </Text>
              </Pressable>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginVertical: 16,
                }}
              >
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>veya</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              </View>

              <View style={{ gap: 12 }}>
                <TextInput
                  value={addressInput}
                  onChangeText={setAddressInput}
                  placeholder="Adres girin..."
                  placeholderTextColor={colors.textTertiary}
                  style={{
                    backgroundColor: colors.surfaceVariant,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    color: colors.textPrimary,
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />

                <Pressable
                  onPress={handleAddressInput}
                  disabled={isLoadingLocation || !addressInput.trim()}
                  style={{
                    backgroundColor: addressInput.trim()
                      ? colors.surface
                      : colors.surfaceVariant,
                    paddingVertical: 18,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  {isLoadingLocation && locationMethod === "address" ? (
                    <ActivityIndicator color={colors.textPrimary} />
                  ) : (
                    <Feather name="map-pin" size={20} color={colors.textPrimary} />
                  )}
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Adresi Bul
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => setShowLocationModal(false)}
                style={{
                  marginTop: 16,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
                  İptal
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Screen Selector Modal */}
      <Modal
        visible={showScreenSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowScreenSelector(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "85%",
            }}
          >
            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 20,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 5,
                    backgroundColor: colors.border,
                    borderRadius: 3,
                  }}
                />
              </View>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 4,
                }}
              >
                {selectedLocation?.address}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                }}
              >
                Ekran tiplerini seçin
              </Text>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 24 }}
            >
              {screenTypes.map((screenType) => {
                const isSelected = selectedScreens.find(
                  (s) => s.id === screenType.id
                );
                const quantity = isSelected?.quantity || 1;

                return (
                  <View
                    key={screenType.id}
                    style={{
                      backgroundColor: isSelected
                        ? colors.surfaceVariant
                        : colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <Pressable
                      onPress={() => toggleScreenSelection(screenType)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: isSelected
                              ? colors.primary
                              : colors.border,
                            backgroundColor: isSelected
                              ? colors.primary
                              : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSelected && (
                            <Feather name="check" size={14} color="#fff" />
                          )}
                        </View>
                        <Text
                          style={{
                            color: colors.textPrimary,
                            fontSize: 16,
                            fontWeight: isSelected ? "600" : "400",
                          }}
                        >
                          {screenType.display_name}
                        </Text>
                      </View>
                    </Pressable>

                    {isSelected && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 12,
                          paddingTop: 12,
                          borderTopWidth: 1,
                          borderTopColor: colors.border,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.textSecondary,
                            fontSize: 14,
                          }}
                        >
                          Adet
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <Pressable
                            onPress={() =>
                              updateQuantity(screenType.id, quantity - 1)
                            }
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                              backgroundColor: colors.surface,
                              alignItems: "center",
                              justifyContent: "center",
                              borderWidth: 1,
                              borderColor: colors.border,
                            }}
                          >
                            <Feather
                              name="minus"
                              size={16}
                              color={colors.textPrimary}
                            />
                          </Pressable>
                          <Text
                            style={{
                              color: colors.textPrimary,
                              fontSize: 18,
                              fontWeight: "600",
                              minWidth: 30,
                              textAlign: "center",
                            }}
                          >
                            {quantity}
                          </Text>
                          <Pressable
                            onPress={() =>
                              updateQuantity(screenType.id, quantity + 1)
                            }
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                              backgroundColor: colors.primary,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Feather name="plus" size={16} color="#fff" />
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <View
              style={{
                padding: 24,
                paddingBottom: 40,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                gap: 12,
              }}
            >
              <Pressable
                onPress={handleSaveLocation}
                disabled={selectedScreens.length === 0 || isSaving}
                style={{
                  backgroundColor:
                    selectedScreens.length === 0 || isSaving
                      ? colors.surfaceVariant
                      : colors.primary,
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="check" size={20} color="#fff" />
                    <Text
                      style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                    >
                      Kaydet ({selectedScreens.reduce((sum, s) => sum + s.quantity, 0)}{" "}
                      Ekran)
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={resetAndClose}
                disabled={isSaving}
                style={{
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
                  İptal
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
