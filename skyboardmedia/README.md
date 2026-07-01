# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Excel Veri Aktarımı

Excel tablosundaki reklam ekranı verilerini uygulamaya aktarmak için:

### 1. Excel Dosyası Hazırlama

Excel dosyanızda aşağıdaki kolonlar bulunmalıdır (örnek format):

| Lokasyon Adı | Adres | İlçe | Ortam | Enlem | Boylam | Ekran Türü | Format | Telefon |
|-------------|-------|------|------|-------|--------|-----------|--------|--------|
| Atakum AVM | Atakum, Samsun | Atakum | İç | 41.3333 | 36.2667 | LED | 1920x1080 | +905551234567 |

### 2. Veriyi JSON'a Dönüştürme

```bash
# Excel dosyasını JSON'a dönüştür
npm run excel-to-json data/ekranlar.xlsx

# Veya çıkış dizini belirterek
npm run excel-to-json data/ekranlar.xlsx data
```

### 3. Kolon Mapping'i

Script aşağıdaki kolonları tanır (Excel'deki kolon adlarına göre düzenleyin):
- **Lokasyon**: Lokasyon Adı, Mahalle, Adres
- **Koordinatlar**: Enlem, Boylam
- **Ekran**: Ekran Türü, Format, Telefon
- **Diğer**: Kat, Açıklama, vb.

### 4. Uygulamayı Çalıştırma

```bash
npm start
```

Haritada noktalar otomatik olarak görünecek ve detaylar BottomSheet'te görüntülenecektir.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
