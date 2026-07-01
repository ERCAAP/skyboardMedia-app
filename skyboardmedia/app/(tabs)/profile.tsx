import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { useAuth, useIsAuthenticated, useUserProfile } from "@/lib/auth-context";

const CONTACT_OPTIONS: Array<{ label: string; value: "WhatsApp" | "E-posta" }> = [
  { label: "WhatsApp", value: "WhatsApp" },
  { label: "E-posta", value: "E-posta" },
];

type ProfileForm = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  contactPreference: "WhatsApp" | "E-posta";
  consent: boolean;
};

export default function ProfileScreen() {
  const { colors } = useTheme();
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const isAuthenticated = useIsAuthenticated();
  const userProfile = useUserProfile();
  const { signOut } = useAuth();

  const [form, setForm] = useState<ProfileForm>(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  function handleChange<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit() {
    updateProfile(form);
    Alert.alert("Kaydedildi", "Profil bilgileriniz güncellendi.");
  }

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            await signOut();
            Alert.alert("Başarılı", "Hesabınızdan çıkış yapıldı");
          },
        },
      ]
    );
  };

  // If not authenticated, show login/register buttons
  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surfaceVariant }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: "center" }}>
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                borderWidth: 2,
                borderColor: colors.border,
              }}
            >
              <Feather name="user" size={50} color={colors.textSecondary} />
            </View>
            <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "700", marginBottom: 8 }}>
              Hoş Geldiniz
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 20 }}>
              Devam etmek için lütfen giriş yapın veya yeni bir hesap oluşturun
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <Pressable
              onPress={() => router.push("/(auth)/login")}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Feather name="log-in" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Giriş Yap</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/register")}
              style={{
                backgroundColor: colors.surface,
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.primary,
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Feather name="user-plus" size={20} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 16 }}>Kayıt Ol</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  // If authenticated, show profile form
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surfaceVariant }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        {/* Header with user info and logout */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <View>
            <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: "700" }}>Profil</Text>
            {userProfile && (
              <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}>
                @{userProfile.username}
              </Text>
            )}
          </View>
          <Pressable
            onPress={handleLogout}
            style={{
              backgroundColor: colors.surface,
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Feather name="log-out" size={20} color={colors.error} />
          </Pressable>
        </View>

        {/* Role Badge */}
        {userProfile?.role === "admin" && (
          <Pressable
            onPress={() => router.push("/(admin)/dashboard")}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Feather name="shield" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              Admin Paneline Git
            </Text>
          </Pressable>
        )}

        <View style={{ gap: 12 }}>
          <InputField
            label="Ad Soyad"
            placeholder="Adınızı girin"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <InputField
            label="Şirket / Ünvan"
            placeholder="Şirket adınız"
            value={form.company ?? ""}
            onChangeText={(text) => handleChange("company", text)}
          />
          <InputField
            label="E-posta"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="ornek@firma.com"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          <InputField
            label="Telefon"
            keyboardType="phone-pad"
            placeholder="+90555..."
            value={form.phone ?? ""}
            onChangeText={(text) => handleChange("phone", text)}
          />
        </View>

        <View style={{ gap: 12 }}>
          <Text style={{ color: colors.textPrimary, fontWeight: "600", fontSize: 16 }}>İletişim Tercihi</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {CONTACT_OPTIONS.map((option) => {
              const isActive = form.contactPreference === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleChange("contactPreference", option.value)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isActive ? colors.primary : colors.border,
                    backgroundColor: isActive ? colors.surface : colors.surfaceVariant,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: isActive ? colors.primary : colors.textSecondary, fontWeight: "600" }}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderRadius: 16,
            backgroundColor: colors.surface,
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: "600", marginBottom: 4 }}>KVKK Rızası</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Teklif ve iletişim amaçlı kişisel bilgilerimin işlenmesine onay veriyorum.
            </Text>
          </View>
          <Switch value={form.consent} onValueChange={(value) => handleChange("consent", value)} />
        </View>

        <Pressable
          onPress={handleSubmit}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Kaydet</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

function InputField({ label, placeholder, value, onChangeText, keyboardType = "default", autoCapitalize = "sentences" }: InputFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={colors.textSecondary}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          color: colors.textPrimary,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      />
    </View>
  );
}
