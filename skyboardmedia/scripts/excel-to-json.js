const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

/**
 * Excel verilerini JSON formatına dönüştüren script
 * Kullanım: node scripts/excel-to-json.js <excel-dosyası> [çıkış-dizini]
 */

function excelToJson(excelFilePath, outputDir = 'data') {
  try {
    // Excel dosyasını oku
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // JSON'a dönüştür
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`📊 ${rawData.length} satır veri bulundu`);

    // Verileri işle ve dönüştür
    const locations = [];
    const screens = [];
    const locationMap = new Map(); // Adres bazlı location id mapping

    rawData.forEach((row, index) => {
      const locationId = `loc_${index + 1}`;

      // Location bilgilerini çıkar (örnek mapping - Excel kolonlarına göre düzenleyin)
      const location = {
        id: locationId,
        name: row['Lokasyon Adı'] || row['Mahalle'] || `Lokasyon ${index + 1}`,
        address: row['Adres'] || row['Tam Adres'] || '',
        district: mapDistrict(row['İlçe'] || row['Semt']),
        environment: mapEnvironment(row['Ortam'] || row['İç/Dış']),
        lat: parseFloat(row['Enlem']) || 0,
        lng: parseFloat(row['Boylam']) || 0,
        floor: row['Kat'] || undefined,
        featured: row['Öne Çıkan'] === 'Evet' || false
      };

      // Aynı adrese sahip location varsa tekrar ekleme
      const addressKey = `${location.district}-${location.address}`;
      if (!locationMap.has(addressKey)) {
        locations.push(location);
        locationMap.set(addressKey, locationId);
      }

      // Screen bilgilerini çıkar
      const screen = {
        id: `screen_${index + 1}`,
        locationId: locationMap.get(addressKey) || locationId,
        name: row['Ekran Adı'] || `Ekran ${index + 1}`,
        type: mapScreenType(row['Ekran Türü'] || row['Tür']),
        format: row['Format'] || row['Boyut'] || '1080x1920',
        orientation: mapOrientation(row['Yönelim'] || row['Dikey/Yatay']),
        widthCm: parseFloat(row['Genişlik (cm)']) || 50,
        heightCm: parseFloat(row['Yükseklik (cm)']) || 100,
        resolution: row['Çözünürlük'] || undefined,
        phone: row['Telefon'] || undefined,
        imageUrl: row['Resim URL'] || undefined,
        floor: row['Kat'] || undefined,
        description: row['Açıklama'] || undefined
      };

      screens.push(screen);
    });

    // Çıkış dizinini oluştur
    const outputPath = path.resolve(__dirname, '..', outputDir);
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // JSON dosyalarını yaz
    fs.writeFileSync(
      path.join(outputPath, 'imported-locations.json'),
      JSON.stringify(locations, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      path.join(outputPath, 'imported-screens.json'),
      JSON.stringify(screens, null, 2),
      'utf8'
    );

    console.log(`✅ Veri başarıyla dönüştürüldü:`);
    console.log(`   📍 ${locations.length} lokasyon`);
    console.log(`   📺 ${screens.length} ekran`);
    console.log(`   📁 Çıkış dizini: ${outputPath}`);

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

// Yardımcı fonksiyonlar - Excel verilerinize göre düzenleyin
function mapDistrict(district) {
  const districtMap = {
    'Tekkeköy': 'Tekkeköy',
    'Atakum': 'Atakum',
    'İlkadım': 'İlkadım',
    'Çarşamba': 'Çarşamba'
    // Diğer ilçeleri ekleyin
  };
  return districtMap[district] || 'Tekkeköy'; // Varsayılan
}

function mapEnvironment(env) {
  if (env?.toLowerCase().includes('iç')) return 'İç';
  if (env?.toLowerCase().includes('dış')) return 'Dış';
  return 'Dış'; // Varsayılan
}

function mapScreenType(type) {
  if (type?.toLowerCase().includes('led')) return 'LED';
  if (type?.toLowerCase().includes('dijital')) return 'Dijital';
  return 'LED'; // Varsayılan
}

function mapOrientation(orientation) {
  if (orientation?.toLowerCase().includes('dikey')) return 'Dikey';
  if (orientation?.toLowerCase().includes('yatay')) return 'Yatay';
  return 'Dikey'; // Varsayılan
}


// CLI kullanımı
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
📊 Excel'den JSON'a Dönüştürücü

Kullanım: node scripts/excel-to-json.js <excel-dosyası.xlsx> [çıkış-dizini]

Örnek: node scripts/excel-to-json.js data/ekranlar.xlsx data

Excel kolon örnekleri:
- Lokasyon Adı, Adres, İlçe, Ortam (İç/Dış)
- Enlem, Boylam (koordinatlar)
- Ekran Türü (LED/Dijital), Format, Yönelim
- Telefon, Kat, Açıklama, vb.
`);
  process.exit(1);
}

excelToJson(args[0], args[1]);
