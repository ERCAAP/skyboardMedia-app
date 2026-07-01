import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme";

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin");
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin");
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email.trim());
    setIsLoading(false);

    if (error) {
      Alert.alert("Hata", error.message || "Bir hata oluştu");
      return;
    }

    Alert.alert(
      "E-posta Gönderildi",
      "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.",
      [
        {
          text: "Tamam",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surfaceVariant }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            zIndex: 10,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>

        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Feather name="lock" size={40} color="#fff" />
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: "700" }}>
            Şifremi Unuttum
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginTop: 8,
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          {/* Email Input */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "600" }}>
              E-posta
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@firma.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor={colors.textTertiary}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                color: colors.textPrimary,
                borderWidth: 1,
                borderColor: colors.border,
                fontSize: 16,
              }}
            />
          </View>

          {/* Reset Button */}
          <Pressable
            onPress={handleResetPassword}
            disabled={isLoading}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Sıfırlama Bağlantısı Gönder
              </Text>
            )}
          </Pressable>

          {/* Back to Login */}
          <Pressable onPress={() => router.back()} style={{ alignItems: "center", marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}>
              Giriş sayfasına dön
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
