# Supabase Database Setup

Bu klasör Supabase veritabanı migration dosyalarını içerir.

## Kurulum Adımları

### 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) hesabınıza giriş yapın
2. "New Project" butonuna tıklayın
3. Proje detaylarını doldurun:
   - Name: skyboardmedia
   - Database Password: Güçlü bir şifre seçin
   - Region: Türkiye'ye en yakın bölge (Frankfurt önerilir)

### 2. API Keys Alma

1. Supabase Dashboard'da sol menüden "Settings" > "API" sayfasına gidin
2. Aşağıdaki değerleri kopyalayın:
   - Project URL: `https://your-project-id.supabase.co`
   - `anon` `public` key

### 3. Environment Variables Ayarlama

`.env` dosyasını güncelleyin:

```env
EXPO_PUBLIC_SUPABASE_URL=https://ixpjbjzvoutlzixhzupj.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Database Migration Çalıştırma

Supabase Dashboard'da:

1. Sol menüden "SQL Editor" sayfasına gidin
2. "New Query" butonuna tıklayın
3. `migrations/001_initial_schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. "Run" butonuna tıklayarak migration'ı çalıştırın

### 5. İlk Admin Kullanıcısı Oluşturma

Uygulama üzerinden kayıt olduktan sonra, bu kullanıcıyı admin yapmak için:

1. Supabase Dashboard'da "Table Editor" > "user_profiles" tablosuna gidin
2. Kullanıcınızı bulun
3. `role` kolonunu `user`'dan `admin`'e değiştirin

Alternatif olarak SQL Editor'da şu komutu çalıştırabilirsiniz:

```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## Database Schema

### user_profiles Tablosu

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Primary key |
| user_id | UUID | auth.users tablosuna foreign key |
| username | TEXT | Benzersiz kullanıcı adı |
| email | TEXT | E-posta adresi |
| name | TEXT | Ad soyad (opsiyonel) |
| company | TEXT | Şirket adı (opsiyonel) |
| phone | TEXT | Telefon numarası (opsiyonel) |
| role | TEXT | 'user' veya 'admin' |
| contact_preference | TEXT | 'WhatsApp' veya 'E-posta' |
| consent | BOOLEAN | KVKK onayı |
| created_at | TIMESTAMPTZ | Oluşturulma tarihi |
| updated_at | TIMESTAMPTZ | Güncellenme tarihi |

## Row Level Security (RLS) Politikaları

- ✅ Kullanıcılar kendi profillerini görüntüleyebilir
- ✅ Kullanıcılar kendi profillerini güncelleyebilir
- ✅ Kullanıcılar kayıt sırasında kendi profillerini oluşturabilir
- ✅ Admin kullanıcılar tüm profilleri görüntüleyebilir
- ✅ Admin kullanıcılar tüm profilleri güncelleyebilir

## Authentication Email Templates (Opsiyonel)

Supabase Dashboard'da "Authentication" > "Email Templates" sayfasından e-posta şablonlarını Türkçe'ye çevirebilirsiniz:

1. **Confirm signup** - Kayıt onayı
2. **Reset password** - Şifre sıfırlama
3. **Magic link** - Magic link girişi (kullanılmıyorsa devre dışı bırakın)

## Test

Migration'ın başarılı olduğunu test etmek için:

```sql
-- Tabloların varlığını kontrol et
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- RLS politikalarını kontrol et
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

## Sorun Giderme

### "relation already exists" hatası
Migration'ı birden fazla kez çalıştırdıysanız, önce tabloyu silin:

```sql
DROP TABLE IF EXISTS public.user_profiles CASCADE;
```

Sonra migration'ı tekrar çalıştırın.

### RLS politikaları çalışmıyor
RLS'in aktif olduğundan emin olun:

```sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
```

### Kullanıcı profili oluşturulamıyor
`auth.users` tablosuna kullanıcının eklendiğinden emin olun. Supabase otomatik olarak kayıt sırasında bu tabloya ekler.
