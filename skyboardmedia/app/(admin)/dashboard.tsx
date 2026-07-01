import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/lib/theme";
import { useUserProfile } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/lib/auth-types";

export default function AdminDashboardScreen() {
  const { colors } = useTheme();
  const userProfile = useUserProfile();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (userProfile?.role !== "admin") {
      Alert.alert("Erişim Reddedildi", "Bu sayfaya erişim yetkiniz yok");
      router.back();
      return;
    }

    fetchUsers();
  }, [userProfile]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        Alert.alert("Hata", "Kullanıcılar yüklenirken bir hata oluştu");
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    Alert.alert(
      "Rol Değiştir",
      `Bu kullanıcının rolünü ${newRole === "admin" ? "Admin" : "Kullanıcı"} olarak değiştirmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Değiştir",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("user_profiles")
                .update({ role: newRole })
                .eq("id", userId);

              if (error) {
                Alert.alert("Hata", "Rol güncellenirken bir hata oluştu");
                return;
              }

              Alert.alert("Başarılı", "Kullanıcı rolü güncellendi");
              fetchUsers();
            } catch (error) {
              Alert.alert("Hata", "Bir hata oluştu");
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => {
    const isAdmin = item.role === "admin";

    return (
      <View
        style={{
          backgroundColor: colors.surface,
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: isAdmin ? colors.primary : colors.border,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700" }}>
                {item.name || "İsimsiz"}
              </Text>
              {isAdmin && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>ADMIN</Text>
                </View>
              )}
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 2 }}>
              @{item.username}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              {item.email}
            </Text>
            {item.phone && (
              <Text style={{ color: colors.textTertiary, fontSize: 12, marginTop: 4 }}>
                📱 {item.phone}
              </Text>
            )}
            <Text style={{ color: colors.textTertiary, fontSize: 11, marginTop: 8 }}>
              Kayıt: {new Date(item.created_at).toLocaleDateString("tr-TR")}
            </Text>
          </View>

          <Pressable
            onPress={() => handleToggleRole(item.id, item.role)}
            style={{
              backgroundColor: isAdmin ? colors.error : colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Feather name={isAdmin ? "user" : "shield"} size={14} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
              {isAdmin ? "Kullanıcı" : "Admin"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surfaceVariant, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
              <Feather name="shield" size={24} color={colors.primary} />
              <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "700" }}>
                Admin Panel
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
              Kullanıcı Yönetimi
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Pressable
          onPress={() => router.push("/(admin)/locations")}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="map-pin" size={20} color="#fff" />
            </View>
            <View>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Lokasyon Ekle
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                Yeni reklam noktası oluştur
              </Text>
            </View>
          </View>
          <Feather name="arrow-right" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
              Toplam Kullanıcı
            </Text>
            <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: "700" }}>
              {users.length}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.primary,
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
              Admin Sayısı
            </Text>
            <Text style={{ color: colors.primary, fontSize: 28, fontWeight: "700" }}>
              {users.filter((u) => u.role === "admin").length}
            </Text>
          </View>
        </View>
      </View>

      {/* User List */}
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Feather name="users" size={48} color={colors.textTertiary} />
            <Text style={{ color: colors.textSecondary, fontSize: 16, marginTop: 12 }}>
              Henüz kullanıcı yok
            </Text>
          </View>
        }
      />
    </View>
  );
}
