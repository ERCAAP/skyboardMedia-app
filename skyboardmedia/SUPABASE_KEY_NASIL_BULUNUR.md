# 🔑 Supabase API Key Nasıl Bulunur?

## ⚠️ Önemli Bilgi

Verdiğiniz key: `REDACTED`

Bu **Service Role Key** değil, başka bir key türü. Bize **anon (public)** key gerekli.

---

## 📍 Doğru Key'i Bulmak İçin Adımlar:

### 1. Supabase Dashboard'a Gidin
```
https://supabase.com/dashboard/project/ixpjbjzvoutlzixhzupj
```

### 2. Settings Menüsünü Açın
Sol menüden **Settings** (⚙️ Ayarlar) → **API** seçeneğine tıklayın

### 3. API Keys Bölümünü Bulun
Sayfada şu bölümü göreceksiniz:

```
Project API keys
┌─────────────────────────────────────────┐
│ Project URL                             │
│ https://ixpjbjzvoutlzixhzupj.supabase.co│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ anon public                             │
│ REDACTED │  ← BU KEY'İ KOPYALAYIN!
│ [Copy] [Reveal]                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ service_role secret                     │
│ REDACTED │  ← BU DEĞİL!
│ [Copy] [Reveal]                         │
└─────────────────────────────────────────┘
```

### 4. "anon public" Key'ini Kopyalayın

**ÖNEMLİ:**
- ✅ **"anon public"** key'ini kopyalayın (bu `eyJhbGc...` ile başlar)
- ❌ **"service_role"** key'ini KULLANMAYIN (bu güvenlik riski!)
- ❌ **"sbp_"** ile başlayan key yanlış key türü

### 5. .env Dosyasını Güncelleyin

Kopyaladığınız key'i buraya yapıştırın:

```env
EXPO_PUBLIC_SUPABASE_URL=https://ixpjbjzvoutlzixhzupj.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=REDACTED
```

---

## 🎯 Key Doğru mu Kontrol Edin

Key şöyle görünmeli:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cGpianp2b3V0bHppeGh6dXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzYxNjAsImV4cCI6MjAyNTQxMjE2MH0...
```

**Özellikler:**
- ✅ `eyJ` ile başlar (JWT token)
- ✅ Çok uzun (400+ karakter)
- ✅ İçinde nokta (.) işaretleri var
- ✅ "anon" kelimesini içerir (decode edildiğinde)

---

## 🚀 Key'i Bulduktan Sonra

1. `.env` dosyasını güncelleyin
2. Terminalde Metro bundler'ı yeniden başlatın:
   ```bash
   npm start --clear
   ```

3. Veya bana key'i verin, ben güncelleyeyim! 😊

---

## 🔐 Güvenlik Notu

- **Asla** service_role key'ini client tarafında kullanmayın!
- **Asla** key'leri GitHub'a commit etmeyin!
- `.env` dosyası `.gitignore`'da olmalı

---

## ❓ Sorun mu Yaşıyorsunuz?

Eğer Dashboard'da bu bölümü bulamıyorsanız:

1. Doğru projede olduğunuzdan emin olun
2. Project seçiciden "ixpjbjzvoutlzixhzupj" projesini seçin
3. Settings → API sayfasına gidin

**Veya:**

Screenshot alıp bana gönderin, ben yardımcı olurum! 📸
