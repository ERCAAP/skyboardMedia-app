/**
 * Google Maps Geocoding API entegrasyonu
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  coordinates: Coordinates;
  formattedAddress: string;
  placeId?: string;
}

/**
 * Adresi koordinatlara çevirir (Google Maps Geocoding API)
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️  Google Maps API key bulunamadı. Mock koordinat kullanılıyor.');
    // Samsun Tekkeköy için varsayılan koordinatlar
    return {
      coordinates: { lat: 41.2076, lng: 36.4556 },
      formattedAddress: address
    };
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        formattedAddress: result.formatted_address,
        placeId: result.place_id
      };
    }

    console.warn(`⚠️  ${address}: Koordinat bulunamadı`);
    return null;

  } catch (error) {
    console.error(`❌ Geocoding hatası: ${address}`, error);
    return null;
  }
}

/**
 * Ters geocoding - koordinatlardan adres alır
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️  Google Maps API key bulunamadı.');
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    return null;

  } catch (error) {
    console.error(`❌ Reverse geocoding hatası: ${lat}, ${lng}`, error);
    return null;
  }
}

/**
 * Mesafe hesaplar (haversine formülü)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
