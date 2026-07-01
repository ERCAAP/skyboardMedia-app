/**
 * Veri entegrasyonunu test eder
 */

const { getLocations, getLocationScreens, getLocationsWithScreens } = require('../lib/api.ts');

// Test fonksiyonları
async function testIntegration() {
  console.log('🧪 Veri entegrasyon testi başlatılıyor...\n');

  try {
    // 1. Lokasyonları test et
    console.log('📍 Lokasyon testi:');
    const locations = await getLocations();
    console.log(`   ✅ ${locations.length} lokasyon bulundu`);

    locations.forEach(loc => {
      console.log(`   - ${loc.name}: ${loc.lat}, ${loc.lng} (${loc.district})`);
    });

    // 2. Ekranları test et
    console.log('\n📺 Ekran testi:');
    if (locations.length > 0) {
      const screens = await getLocationScreens(locations[0].id);
      console.log(`   ✅ ${screens.length} ekran bulundu (${locations[0].name})`);

      // İlk 5 ekranı göster
      screens.slice(0, 5).forEach(screen => {
        console.log(`   - ${screen.name}: ${screen.format} ${screen.orientation}`);
      });
    }

    // 3. Lokasyon + ekran kombinasyonunu test et
    console.log('\n🏢 Lokasyon + Ekran testi:');
    const locationsWithScreens = await getLocationsWithScreens();
    console.log(`   ✅ ${locationsWithScreens.length} lokasyon+ekran kombinasyonu bulundu`);

    locationsWithScreens.forEach(lws => {
      console.log(`   - ${lws.name}: ${lws.screens.length} ekran`);
    });

    console.log('\n✅ Tüm testler başarılı! Veri entegrasyonu çalışıyor.');

  } catch (error) {
    console.error('❌ Test hatası:', error.message);
    process.exit(1);
  }
}

// Sadece Node.js ortamında çalıştır
if (typeof window === 'undefined') {
  testIntegration();
}

module.exports = { testIntegration };
