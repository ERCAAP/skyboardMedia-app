# Lokasyon Ekleme Sistemi

Admin kullanıcıları için GPS veya adres girişi ile yeni lokasyon ekleme sistemi.

## Özellikler

### 1. **İki Lokasyon Ekleme Yöntemi**
- **Ben Burdayım**: GPS ile otomatik konum algılama
- **Adres Gir**: Manuel adres girişi ve geocoding

### 2. **Ekran Tipi Seçimi**
Admin, lokasyon eklerken şu ekran tiplerinden seçim yapabilir:
- Billboard
- Megalight
- Tramvay Tutamaç
- Tramvay Durak
- Otobüs Durak
- CLP Raket
- Dijital Ekran

Her ekran tipinden birden fazla adet eklenebilir.

### 3. **Harita Görünümü**
- Eklenen lokasyonlar haritada marker olarak görünür
- Marker'da toplam ekran sayısı gösterilir
- Marker'a tıklanınca detaylar alt panelde açılır

## Veritabanı Yapısı

### Tablolar

#### `locations`
```sql
- id: UUID (Primary Key)
- name: TEXT (Lokasyon adı)
- address: TEXT (Tam adres)
- lat: NUMERIC(10,8) (Enlem)
- lng: NUMERIC(11,8) (Boylam)
- created_by: UUID (Oluşturan admin kullanıcı)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### `screen_types`
```sql
- id: UUID (Primary Key)
- name: TEXT (Teknik isim, örn: 'billboard')
- display_name: TEXT (Görünen isim, örn: 'Billboard')
- created_at: TIMESTAMPTZ
```

#### `location_screens`
```sql
- id: UUID (Primary Key)
- location_id: UUID (Foreign Key -> locations)
- screen_type_id: UUID (Foreign Key -> screen_types)
- quantity: INTEGER (Ekran adedi)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

## Kurulum

### 1. Supabase Migration Çalıştırma

Migration dosyası hazır: `supabase/migrations/002_locations_with_screens.sql`

#### Seçenek A: Supabase Dashboard Üzerinden
1. Supabase Dashboard'a gidin
2. SQL Editor'ı açın
3. `002_locations_with_screens.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. Run'a basın

#### Seçenek B: Supabase CLI ile
```bash
# Supabase CLI kurulumu (eğer yoksa)
npm install -g supabase

# Supabase'e login
supabase login

# Migration çalıştırma
cd skyboardmedia
supabase db push
```

### 2. .env Ayarları

`.env` dosyanızda şu değişkenlerin olduğundan emin olun:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Kullanım

### Admin Panelden Lokasyon Ekleme

1. Admin hesabı ile giriş yapın
2. Profile -> Admin Panel'e gidin
3. "Lokasyon Ekle" butonuna tıklayın
4. İki seçenekten birini seçin:
   - **Ben Burdayım**: Bulunduğunuz konumu otomatik alır
   - **Adres Gir**: Manuel adres girip "Adresi Bul"a basın
5. Konum haritada işaretlenince, ekran tipi seçim paneli açılır
6. İstediğiniz ekran tiplerini seçin ve adetlerini ayarlayın
7. "Kaydet" butonuna basın

### Haritada Lokasyonları Görüntüleme

- Ana harita ekranında tüm lokasyonlar marker olarak görünür
- Marker'ların üzerinde toplam ekran sayısı yazar
- Marker'a tıkladığınızda alt panelde detaylar açılır
- Detaylarda ekran tipleri ve adetleri listelenir

## API Güncellemeleri

### `lib/api.ts`

`getLocations()` fonksiyonu artık:
1. Önce Supabase'den lokasyonları çeker
2. Eğer hata varsa veya veri yoksa, statik verilere (eski sistem) fallback yapar
3. Her iki kaynaktaki verileri birleştirir

`getLocationScreens()` fonksiyonu:
1. Supabase'den lokasyona ait ekranları çeker
2. `quantity` değerine göre birden fazla ekran oluşturur
3. Fallback olarak statik SCREENS verisini kullanır

## Güvenlik

### Row Level Security (RLS) Politikaları

#### Locations
- **SELECT**: Herkes görebilir
- **INSERT**: Sadece adminler ekleyebilir
- **UPDATE**: Sadece adminler güncelleyebilir
- **DELETE**: Sadece adminler silebilir

#### Screen Types
- **SELECT**: Herkes görebilir

#### Location Screens
- **SELECT**: Herkes görebilir
- **INSERT/UPDATE/DELETE**: Sadece adminler

## Dosya Yapısı

```
skyboardmedia/
├── app/
│   ├── (admin)/
│   │   ├── dashboard.tsx       # Admin panel ana sayfa
│   │   └── locations.tsx       # Yeni! Lokasyon ekleme sayfası
│   └── (tabs)/
│       └── map.tsx             # Harita ekranı
├── lib/
│   ├── api.ts                  # Güncellendi - Supabase entegrasyonu
│   ├── hooks.ts                # Lokasyon hooks
│   └── supabase.ts             # Supabase client
├── components/
│   └── LocationMarker.tsx      # Harita marker component
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql
        └── 002_locations_with_screens.sql  # Yeni migration
```

## Önemli Notlar

1. **Konum İzinleri**: "Ben Burdayım" özelliği için kullanıcıdan konum izni istenir
2. **Geocoding**: Adres girişinde Expo Location API'sinin geocoding servisi kullanılır
3. **Fallback**: Supabase erişilemezse, sistem otomatik olarak statik verilere geçer
4. **Admin Kontrolü**: Tüm admin sayfalarında `userProfile.role === 'admin'` kontrolü yapılır

## Test Etme

1. Admin kullanıcı oluşturun (veya mevcut kullanıcınızı admin yapın)
2. Migration'ı çalıştırın
3. Admin panel -> Lokasyon Ekle
4. Test lokasyonu ekleyin
5. Ana haritada görünüp görünmediğini kontrol edin
6. Marker'a tıklayıp detayları görün

## Sorun Giderme

### Migration çalışmıyor
- Supabase Dashboard'dan manuel olarak SQL'i çalıştırın
- RLS politikalarının doğru oluşturulduğunu kontrol edin

### Lokasyonlar görünmüyor
- Console'da hata kontrolü yapın
- Supabase bağlantısını test edin
- Fallback olarak statik veriler yükleniyorsa Supabase hatası var demektir

### Konum izni alınamıyor
- iOS: Info.plist'te location izinleri tanımlı mı kontrol edin
- Android: Manifest'te izinler var mı kontrol edin

## Gelecek Geliştirmeler

- [ ] Lokasyon düzenleme
- [ ] Lokasyon silme
- [ ] Toplu lokasyon import (Excel/CSV)
- [ ] Lokasyon fotoğrafları
- [ ] Müsaitlik durumu
- [ ] Fiyatlandırma bilgisi
