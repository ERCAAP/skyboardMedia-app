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

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email.trim(), password, rememberMe);
    setIsLoading(false);

    if (error) {
      Alert.alert("Giriş Başarısız", error.message || "Bir hata oluştu");
      return;
    }

    // Navigate to main app
    router.replace("/(tabs)/map");
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/(auth)/register");
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
            <Feather name="user" size={40} color="#fff" />
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: "700" }}>
            Giriş Yap
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>
            Hesabınıza giriş yapın
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

          {/* Password Input */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "600" }}>
              Şifre
            </Text>
            <View style={{ position: "relative" }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                placeholderTextColor={colors.textTertiary}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  paddingRight: 50,
                  color: colors.textPrimary,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontSize: 16,
                }}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 16,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                }}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: rememberMe ? colors.primary : colors.border,
                  backgroundColor: rememberMe ? colors.primary : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {rememberMe && <Feather name="check" size={14} color="#fff" />}
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Beni Hatırla</Text>
            </Pressable>

            <Pressable onPress={handleForgotPassword}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}>
                Şifremi Unuttum
              </Text>
            </Pressable>
          </View>

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
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
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Giriş Yap</Text>
            )}
          </Pressable>

          {/* Sign Up Link */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24, gap: 4 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Hesabınız yok mu?</Text>
            <Pressable onPress={handleSignUp}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "700" }}>
                Kayıt Ol
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
