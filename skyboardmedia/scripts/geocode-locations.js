const https = require('https');
const fs = require('fs');
const path = require('path');

// Google Maps API Key - Environment variable'dan alınmalı
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

/**
 * Google Maps Geocoding API ile adres koordinatlarını alır
 */
async function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.status === 'OK' && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            console.log(`✅ ${address}: ${location.lat}, ${location.lng}`);
            resolve({
              lat: location.lat,
              lng: location.lng
            });
          } else {
            console.warn(`⚠️  ${address}: Koordinat bulunamadı (${response.status})`);
            resolve({ lat: 0, lng: 0 });
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Lokasyonları geocode eder ve günceller
 */
async function geocodeLocations() {
  try {
    const locationsPath = path.join(__dirname, '..', 'data', 'imported-locations.json');
    const locations = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));

    console.log(`🏙️  ${locations.length} lokasyon için koordinat bilgisi alınıyor...\n`);

    for (const location of locations) {
      // Samsun, Tekkeköy, Atatürk Bulvarı için tam adres oluştur
      const fullAddress = `${location.name}, Tekkeköy, Samsun, Türkiye`;

      try {
        const coordinates = await geocodeAddress(fullAddress);

        // Koordinatları güncelle
        location.lat = coordinates.lat;
        location.lng = coordinates.lng;

        // Kısa bir bekleme - API rate limit için
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ ${location.name}: ${error.message}`);
        location.lat = 0;
        location.lng = 0;
      }
    }

    // Güncellenmiş veriyi kaydet
    fs.writeFileSync(locationsPath, JSON.stringify(locations, null, 2), 'utf8');

    console.log(`\n✅ Tüm lokasyonlar güncellendi ve ${locationsPath} dosyasına kaydedildi.`);

    // İstatistikler
    const validCoords = locations.filter(loc => loc.lat !== 0 && loc.lng !== 0);
    console.log(`📍 Geçerli koordinat: ${validCoords.length}/${locations.length} lokasyon`);

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

// CLI kullanımı
if (require.main === module) {
  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') {
    console.log(`
🔑 Google Maps API Key gerekli!

1. Google Cloud Console'da yeni bir proje oluşturun
2. Maps API'yi etkinleştirin
3. API Key oluşturun
4. Environment variable olarak ayarlayın:

   export GOOGLE_MAPS_API_KEY=your_api_key_here

5. Script'i çalıştırın:
   node scripts/geocode-locations.js
`);
    process.exit(1);
  }

  geocodeLocations();
}

module.exports = { geocodeAddress, geocodeLocations };
