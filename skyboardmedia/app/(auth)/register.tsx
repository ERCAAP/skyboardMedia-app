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

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validation
    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Hata", "Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Hata", "Kullanıcı adı en az 3 karakter olmalıdır");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email.trim(), password, username.trim(), name.trim() || undefined);
    setIsLoading(false);

    if (error) {
      Alert.alert("Kayıt Başarısız", error.message || "Bir hata oluştu");
      return;
    }

    Alert.alert(
      "Kayıt Başarılı",
      "E-posta adresinizi doğrulamak için gelen kutunuzu kontrol edin.",
      [
        {
          text: "Tamam",
          onPress: () => router.replace("/(auth)/login"),
        },
      ]
    );
  };

  const handleLoginPress = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surfaceVariant }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 60 }}
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
        <View style={{ alignItems: "center", marginBottom: 32 }}>
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
            <Feather name="user-plus" size={40} color="#fff" />
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: "700" }}>
            Kayıt Ol
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8 }}>
            Yeni hesap oluşturun
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          {/* Email Input */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "600" }}>
              E-posta *
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

          {/* Username Input */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "600" }}>
              Kullanıcı Adı *
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="kullaniciadi"
              autoCapitalize="none"
              autoComplete="username"
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

          {/* Name Input */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "600" }}>
              Ad Soyad
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="İsim Soyisim"
              autoCapitalize="words"
              autoComplete="name"
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
              Şifre *
            </Text>
            <View style={{ position: "relative" }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="En az 6 karakter"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
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

          {/* Confirm Password Input */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "600" }}>
              Şifre Tekrar *
            </Text>
            <View style={{ position: "relative" }}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Şifrenizi tekrar girin"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
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
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: 16,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                }}
              >
                <Feather
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Register Button */}
          <Pressable
            onPress={handleRegister}
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
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Kayıt Ol</Text>
            )}
          </Pressable>

          {/* Login Link */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16, gap: 4 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Zaten hesabınız var mı?</Text>
            <Pressable onPress={handleLoginPress}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "700" }}>
                Giriş Yap
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
