# 🔐 Supabase Authentication Kurulum Rehberi

Bu doküman, SkyboardMedia uygulamasına eklenen Supabase authentication sisteminin kurulum ve kullanım rehberidir.

## 📋 İçindekiler

1. [Özellikler](#özellikler)
2. [Kurulum Adımları](#kurulum-adımları)
3. [Kullanım](#kullanım)
4. [Dosya Yapısı](#dosya-yapısı)
5. [API Referansı](#api-referansı)
6. [Sorun Giderme](#sorun-giderme)

---

## ✨ Özellikler

### Kullanıcı Yönetimi
- ✅ **Email ile kayıt**: Kullanıcı adı, email, şifre ile kayıt
- ✅ **Email ile giriş**: Email ve şifre ile giriş
- ✅ **Beni Hatırla**: Giriş bilgilerini hatırlama özelliği
- ✅ **Şifre sıfırlama**: Email ile şifre sıfırlama
- ✅ **Otomatik oturum yönetimi**: Token yenileme ve oturum kontrolü
- ✅ **Çıkış yapma**: Güvenli logout işlemi

### Profil Yönetimi
- ✅ **Profil görüntüleme**: Kullanıcı profil bilgileri
- ✅ **Profil güncelleme**: İsim, şirket, telefon bilgileri
- ✅ **İletişim tercihi**: WhatsApp veya Email
- ✅ **KVKK onayı**: Veri işleme onayı

### Admin Paneli
- ✅ **Kullanıcı listesi**: Tüm kullanıcıları görüntüleme
- ✅ **Rol yönetimi**: Admin/User rolü değiştirme
- ✅ **İstatistikler**: Toplam kullanıcı ve admin sayısı
- ✅ **Erişim kontrolü**: Sadece adminler erişebilir

### Güvenlik
- ✅ **Row Level Security (RLS)**: Veritabanı seviyesinde güvenlik
- ✅ **Protected Routes**: Kimlik doğrulaması gerektiren sayfalar
- ✅ **Rol tabanlı erişim**: Admin ve user rolleri
- ✅ **Güvenli şifre saklama**: Supabase'in bcrypt hash sistemi

---

## 🚀 Kurulum Adımları

### 1. Gerekli Paketleri Yükleyin

Proje klasöründe terminalde şu komutu çalıştırın:

```bash
cd /Users/omerercan/Documents/HolePix/skyboardMedia-app/skyboardmedia
npm install
```

Yüklenen paketler:
- `@supabase/supabase-js@^2.47.10` - Supabase client
- `@react-native-async-storage/async-storage@^2.1.0` - Oturum saklama
- `react-native-url-polyfill@^2.0.0` - URL API polyfill

### 2. Supabase Projesi Oluşturun

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. Proje bilgilerini doldurun:
   ```
   Name: skyboardmedia
   Database Password: [Güçlü bir şifre]
   Region: Frankfurt (eu-central-1)
   ```
4. Projeyi oluşturun (1-2 dakika sürebilir)

### 3. API Keys'leri Alın

1. Supabase Dashboard'da **Settings** > **API** sayfasına gidin
2. Şu değerleri kopyalayın:
   - **Project URL**: `https://ixpjbjzvoutlzixhzupj.supabase.co`
   - **anon public key**: (uzun bir string)

### 4. Environment Variables'ı Ayarlayın

`.env` dosyasını açın ve şu değerleri güncelleyin:

```env
EXPO_PUBLIC_SUPABASE_URL=https://ixpjbjzvoutlzixhzupj.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=REDACTED
```

**ÖNEMLİ:** `.env` dosyasını asla git'e commit etmeyin! `.gitignore`'da olduğundan emin olun.

### 5. Database Migration'ı Çalıştırın

1. Supabase Dashboard'da **SQL Editor** sayfasına gidin
2. "New Query" butonuna tıklayın
3. `supabase/migrations/001_initial_schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. **Run** butonuna tıklayın
5. "Success" mesajını görmelisiniz

### 6. İlk Admin Kullanıcısı Oluşturun

#### Yöntem 1: Uygulama Üzerinden

1. Uygulamayı başlatın: `npm start`
2. Profile sekmesine gidin
3. "Kayıt Ol" butonuna tıklayın
4. Kayıt formunu doldurun ve kayıt olun

#### Yöntem 2: SQL ile Admin Yapma

Kayıt olduktan sonra, kullanıcıyı admin yapmak için:

1. Supabase Dashboard'da **Table Editor** > **user_profiles**'a gidin
2. Kayıt olduğunuz kullanıcıyı bulun
3. `role` sütunundaki değeri `user`'dan `admin`'e değiştirin

Veya SQL Editor'da:

```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 7. Uygulamayı Başlatın

```bash
npm start
```

Ardından:
- iOS: `i` tuşuna basın veya `npm run ios`
- Android: `a` tuşuna basın veya `npm run android`

---

## 📱 Kullanım

### Kullanıcı Kayıt ve Giriş

#### Kayıt Ol
1. Uygulamayı açın
2. **Profile** sekmesine gidin
3. **Kayıt Ol** butonuna tıklayın
4. Formu doldurun:
   - E-posta (zorunlu)
   - Kullanıcı adı (zorunlu, benzersiz, min 3 karakter)
   - Ad Soyad (opsiyonel)
   - Şifre (zorunlu, min 6 karakter)
   - Şifre Tekrar (zorunlu, eşleşmeli)
5. **Kayıt Ol** butonuna tıklayın
6. E-posta onay linkini kontrol edin (spam klasörüne de bakın)

#### Giriş Yap
1. **Profile** sekmesinden **Giriş Yap** butonuna tıklayın
2. E-posta ve şifrenizi girin
3. "Beni Hatırla" seçeneğini işaretleyebilirsiniz (opsiyonel)
4. **Giriş Yap** butonuna tıklayın

#### Şifremi Unuttum
1. Login sayfasında **Şifremi Unuttum** linkine tıklayın
2. E-posta adresinizi girin
3. **Sıfırlama Bağlantısı Gönder** butonuna tıklayın
4. E-postanızı kontrol edin ve şifre sıfırlama linkine tıklayın

### Profil Yönetimi

Giriş yaptıktan sonra Profile sekmesinde:

1. **Profil Bilgileri**
   - Ad Soyad
   - Şirket / Ünvan
   - E-posta (değiştirilemez)
   - Telefon

2. **İletişim Tercihi**
   - WhatsApp
   - E-posta

3. **KVKK Rızası**
   - Veri işleme onayı

4. **Kaydet** butonuna tıklayarak değişiklikleri kaydedin

5. Sağ üstteki **Çıkış** butonuyla oturumu kapatabilirsiniz

### Admin Paneli

Admin kullanıcılar için:

1. Profile sekmesinde **Admin Paneline Git** butonu görünür
2. Butona tıklayarak admin paneline gidin
3. Admin panelinde:
   - Toplam kullanıcı sayısını görün
   - Admin sayısını görün
   - Kullanıcı listesini görüntüleyin
   - Kullanıcıların rollerini değiştirin (Admin ↔ Kullanıcı)

---

## 📁 Dosya Yapısı

```
skyboardmedia/
├── app/
│   ├── (auth)/                     # Authentication sayfaları
│   │   ├── _layout.tsx            # Auth stack layout
│   │   ├── login.tsx              # Giriş sayfası
│   │   ├── register.tsx           # Kayıt sayfası
│   │   └── forgot-password.tsx    # Şifre sıfırlama
│   │
│   ├── (admin)/                    # Admin paneli
│   │   ├── _layout.tsx            # Admin stack layout
│   │   └── dashboard.tsx          # Admin dashboard
│   │
│   ├── (tabs)/                     # Ana uygulama
│   │   └── profile.tsx            # Güncellendi: Auth entegrasyonu
│   │
│   └── _layout.tsx                # Root layout (AuthProvider eklendi)
│
├── lib/
│   ├── supabase.ts                # Supabase client
│   ├── auth-types.ts              # TypeScript type tanımları
│   ├── auth-context.tsx           # Auth provider ve hooks
│   └── store.ts                   # Güncellendi: Auth state eklendi
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql # Database schema
│   └── README.md                  # Database kurulum rehberi
│
├── .env                            # Environment variables
├── .env.example                    # Örnek env dosyası
└── AUTH_SETUP.md                   # Bu dosya
```

---

## 🔧 API Referansı

### Auth Hooks

#### `useAuth()`
Ana authentication hook'u.

```typescript
const { signUp, signIn, signOut, resetPassword } = useAuth();
```

**Metodlar:**

##### `signUp(email, password, username, name?)`
Yeni kullanıcı kaydı.

```typescript
const { error } = await signUp(
  "user@example.com",
  "password123",
  "username",
  "Ad Soyad" // opsiyonel
);

if (error) {
  console.error(error.message);
}
```

##### `signIn(email, password, rememberMe?)`
Kullanıcı girişi.

```typescript
const { error } = await signIn(
  "user@example.com",
  "password123",
  true // beni hatırla
);
```

##### `signOut()`
Oturum kapatma.

```typescript
await signOut();
```

##### `resetPassword(email)`
Şifre sıfırlama isteği.

```typescript
const { error } = await resetPassword("user@example.com");
```

### State Hooks

#### `useIsAuthenticated()`
Kullanıcının giriş yapıp yapmadığını kontrol eder.

```typescript
const isAuthenticated = useIsAuthenticated();

if (isAuthenticated) {
  // Kullanıcı giriş yapmış
}
```

#### `useUser()`
Mevcut kullanıcı bilgilerini döner.

```typescript
const user = useUser();

console.log(user?.email);
console.log(user?.id);
```

#### `useUserProfile()`
Kullanıcı profil bilgilerini döner.

```typescript
const userProfile = useUserProfile();

console.log(userProfile?.username);
console.log(userProfile?.role); // 'user' veya 'admin'
console.log(userProfile?.name);
```

#### `useSession()`
Mevcut oturum bilgilerini döner.

```typescript
const session = useSession();

console.log(session?.access_token);
console.log(session?.expires_at);
```

#### `useAuthLoading()`
Auth yüklenme durumunu döner.

```typescript
const isLoading = useAuthLoading();

if (isLoading) {
  return <LoadingSpinner />;
}
```

### Zustand Store

#### Auth State

```typescript
const useAppStore = useAppStore();

// Getter
const user = useAppStore((state) => state.user);
const session = useAppStore((state) => state.session);
const userProfile = useAppStore((state) => state.userProfile);
const isAuthenticated = useAppStore((state) => state.isAuthenticated);

// Actions
useAppStore.getState().setAuth(user, session, profile);
useAppStore.getState().clearAuth();
useAppStore.getState().setRememberMe(true);
```

---

## 🔍 Örnekler

### Protected Component

Sadece giriş yapmış kullanıcılar için:

```typescript
import { useIsAuthenticated } from "@/lib/auth-context";
import { router } from "expo-router";
import { useEffect } from "react";

export default function ProtectedScreen() {
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View>
      <Text>Protected Content</Text>
    </View>
  );
}
```

### Admin Only Component

Sadece admin kullanıcılar için:

```typescript
import { useUserProfile } from "@/lib/auth-context";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";

export default function AdminOnlyScreen() {
  const userProfile = useUserProfile();

  useEffect(() => {
    if (userProfile?.role !== "admin") {
      Alert.alert("Erişim Reddedildi", "Bu sayfaya erişim yetkiniz yok");
      router.back();
    }
  }, [userProfile]);

  if (userProfile?.role !== "admin") {
    return null;
  }

  return (
    <View>
      <Text>Admin Only Content</Text>
    </View>
  );
}
```

### Custom Login Form

```typescript
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Alert, TextInput, Button } from "react-native";

export default function CustomLoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signIn(email, password, true);
    setLoading(false);

    if (error) {
      Alert.alert("Hata", error.message);
    } else {
      Alert.alert("Başarılı", "Giriş yapıldı!");
    }
  };

  return (
    <>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />
      <Button
        title={loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        onPress={handleLogin}
        disabled={loading}
      />
    </>
  );
}
```

---

## 🐛 Sorun Giderme

### "Invalid API key" Hatası

**Sebep:** Environment variables yanlış veya yüklenmemiş.

**Çözüm:**
1. `.env` dosyasını kontrol edin
2. `EXPO_PUBLIC_` prefix'inin doğru olduğundan emin olun
3. Metro bundler'ı yeniden başlatın:
   ```bash
   # Terminalde Ctrl+C ile durdurun
   npm start --clear
   ```

### "relation does not exist" Hatası

**Sebep:** Database migration çalıştırılmamış.

**Çözüm:**
1. Supabase Dashboard > SQL Editor
2. `supabase/migrations/001_initial_schema.sql` içeriğini kopyalayın
3. Run butonuna tıklayın

### Profil Oluşturulamıyor

**Sebep:** Username zaten kullanımda veya RLS politikaları yanlış.

**Çözüm:**
1. Farklı bir username deneyin
2. SQL Editor'da RLS kontrol edin:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
   ```

### "Authentication session missing" Hatası

**Sebep:** Oturum süresi dolmuş veya AsyncStorage temizlenmiş.

**Çözüm:**
1. Uygulamayı yeniden başlatın
2. Tekrar giriş yapın
3. "Beni Hatırla" seçeneğini işaretleyin

### Admin Paneline Erişilemiyor

**Sebep:** Kullanıcı admin rolüne sahip değil.

**Çözüm:**
1. Supabase Dashboard > Table Editor > user_profiles
2. Kullanıcınızın `role` sütununu `admin` olarak değiştirin
3. Uygulamayı yeniden başlatın

### Email Onay Linki Gelmiyor

**Sebep:** Supabase email ayarları veya spam klasörü.

**Çözüm:**
1. Spam klasörünü kontrol edin
2. Supabase Dashboard > Authentication > Email Templates
3. "Confirm signup" template'ini kontrol edin
4. Test mode'da development için email onayını devre dışı bırakabilirsiniz:
   - Dashboard > Authentication > Settings
   - "Enable email confirmations" kapatın (sadece development için!)

---

## 📞 Destek

Sorunlarınız için:
1. Bu dokümanı kontrol edin
2. `supabase/README.md` dosyasına bakın
3. [Supabase Documentation](https://supabase.com/docs)
4. [Expo Documentation](https://docs.expo.dev)

---

## ✅ Checklist

Kurulum tamamlandı mı? Kontrol edin:

- [ ] `npm install` çalıştırıldı
- [ ] Supabase projesi oluşturuldu
- [ ] `.env` dosyası yapılandırıldı
- [ ] Database migration çalıştırıldı
- [ ] İlk admin kullanıcısı oluşturuldu
- [ ] Kayıt ol/Giriş yap test edildi
- [ ] Profil sayfası çalışıyor
- [ ] Admin paneli erişilebiliyor (admin kullanıcı için)
- [ ] "Beni Hatırla" özelliği test edildi
- [ ] Şifre sıfırlama test edildi

Tebrikler! 🎉 Authentication sisteminiz hazır!
