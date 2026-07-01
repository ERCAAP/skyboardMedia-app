# 🎯 SON ADIMLAR - Sistemi Çalıştırmak İçin

## ✅ Tamamlananlar

- ✅ Tüm authentication kodları yazıldı
- ✅ Admin paneli oluşturuldu
- ✅ Database schema hazırlandı
- ✅ Paketler yüklendi (`npm install` tamamlandı)
- ✅ Environment dosyaları oluşturuldu

---

## ⚠️ Kritik: Yapılması Gerekenler

### 1️⃣ DOĞRU API KEY'İNİ ALIN (ÇOK ÖNEMLİ!)

Verdiğiniz key (`sbp_5b815eba...`) **yanlış key türü**. Doğru key'i almak için:

#### Adımlar:
1. Tarayıcınızda şu linki açın:
   ```
   https://supabase.com/dashboard/project/ixpjbjzvoutlzixhzupj/settings/api
   ```

2. Sayfada **"Project API keys"** bölümünü bulun

3. **"anon public"** yazan key'i kopyalayın
   - ✅ Bu key `eyJhbGc...` ile başlamalı
   - ✅ Çok uzun olmalı (400+ karakter)
   - ❌ `sbp_` ile başlayan key YANLIŞ!

4. Key'i bana verin veya `.env` dosyasını kendiniz güncelleyin:

**Dosya:** `/Users/omerercan/Documents/HolePix/skyboardMedia-app/skyboardmedia/.env`

```env
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (buraya yapıştırın)
```

---

### 2️⃣ DATABASE MIGRATION'I ÇALIŞTIRIN

Supabase Dashboard'da:

1. Sol menüden **SQL Editor** sayfasına gidin
   ```
   https://supabase.com/dashboard/project/ixpjbjzvoutlzixhzupj/sql/new
   ```

2. **"New Query"** butonuna tıklayın

3. Şu dosyanın içeriğini kopyalayıp yapıştırın:
   ```
   /Users/omerercan/Documents/HolePix/skyboardMedia-app/skyboardmedia/supabase/migrations/001_initial_schema.sql
   ```

4. **"Run"** veya **"F5"** tuşuna basın

5. **"Success"** mesajını görmelisiniz

---

### 3️⃣ UYGULAMAYI BAŞLATIN

Terminal'de:

```bash
cd /Users/omerercan/Documents/HolePix/skyboardMedia-app/skyboardmedia
npm start
```

Sonra:
- iOS: `i` tuşuna basın
- Android: `a` tuşuna basın

---

### 4️⃣ İLK KAYIT VE TEST

1. Uygulama açılınca **Profile** sekmesine gidin
2. **"Kayıt Ol"** butonuna tıklayın
3. Formu doldurun:
   - E-posta: test@example.com
   - Kullanıcı adı: testuser
   - Şifre: test123 (min 6 karakter)

4. Kayıt olduktan sonra giriş yapın

---

### 5️⃣ İLK ADMIN KULLANICIYI OLUŞTURUN

Kayıt olduktan sonra kendinizi admin yapın:

#### Yöntem 1: Supabase Dashboard
1. Supabase → **Table Editor** → **user_profiles**
   ```
   https://supabase.com/dashboard/project/ixpjbjzvoutlzixhzupj/editor
   ```

2. Kayıt olduğunuz kullanıcıyı bulun
3. **role** sütununa tıklayın
4. `user` → `admin` olarak değiştirin

#### Yöntem 2: SQL Editor
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'test@example.com';
```

---

## 🎯 Hızlı Özet

Yapmam gereken 3 şey:

1. **Doğru API key al** → `.env` dosyasını güncelle
2. **SQL migration çalıştır** → Database'i oluştur
3. **Kayıt ol ve admin yap** → İlk kullanıcı

---

## 📍 Bana Doğru Key'i Verin, Devam Edeyim!

Şu sayfaya gidin:
```
https://supabase.com/dashboard/project/ixpjbjzvoutlzixhzupj/settings/api
```

**"anon public"** key'ini kopyalayıp bana verin, ben sistemi bitireyim! 🚀

Key şuna benzeyecek:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

---

## 🆘 Yardım

Sorun yaşıyorsanız:
- **SUPABASE_KEY_NASIL_BULUNUR.md** dosyasına bakın
- Ekran görüntüsü alıp gönderin
- Dashboard linkini tekrar kontrol edin

**Not:** Verdiğiniz `sbp_` key'i büyük ihtimalle **service role** veya başka bir key. Bize **anon public** key gerekli!
