import type { Filters, Location, LocationWithScreens, Screen } from "@/lib/types";
import { enrichLocation, BASE_LOCATIONS } from "@/data/locations";
import { SCREENS } from "@/data/screens";
import { geocodeAddress } from "@/lib/geocoding";
import { supabase } from "@/lib/supabase";

function matchesFilters(location: Location, screens: Screen[], filters: Filters): boolean {
  if (filters.district && location.district !== filters.district) {
    return false;
  }

  if (filters.environment && location.environment !== filters.environment) {
    return false;
  }

  if (filters.floor) {
    const hasFloor = location.floor === filters.floor;
    const hasScreenOnFloor = screens.some((screen) => screen.floor === filters.floor);
    if (!hasFloor && !hasScreenOnFloor) {
      return false;
    }
  }

  if (filters.type) {
    const hasType = screens.some((screen) => screen.type === filters.type);
    if (!hasType) {
      return false;
    }
  }

  return true;
}

function buildLocation(baseId: string, derivedScreens: Screen[]): Location {
  const base = BASE_LOCATIONS.find((item) => item.id === baseId);

  if (!base) {
    throw new Error(`Unknown location id: ${baseId}`);
  }

  const totalScreens = derivedScreens.length;

  return enrichLocation(base, {
    totalScreens,
  });
}

export async function getLocations(filters: Filters = {}): Promise<Location[]> {
  try {
    // Fetch locations from Supabase
    const { data: supabaseLocations, error } = await supabase
      .from("locations")
      .select(`
        *,
        location_screens (
          quantity,
          screen_type_id,
          screen_types (
            name,
            display_name
          )
        )
      `);

    if (error) {
      console.error("Error fetching locations from Supabase:", error);
      // Fallback to static data if there's an error
      return getStaticLocations(filters);
    }

    // Transform Supabase locations to Location type
    const transformedLocations: Location[] = (supabaseLocations || []).map((loc) => {
      const totalScreens = loc.location_screens?.reduce(
        (sum: number, ls: any) => sum + (ls.quantity || 0),
        0
      ) || 0;

      return {
        id: loc.id,
        name: loc.name,
        address: loc.address,
        lat: Number(loc.lat),
        lng: Number(loc.lng),
        district: "Samsun", // Default for now
        environment: "Şehir İçi", // Default for now
        totalScreens,
        floor: undefined,
      };
    });

    // Combine with static locations
    const staticLocations = await getStaticLocations(filters);
    const allLocations = [...transformedLocations, ...staticLocations];

    return allLocations;
  } catch (error) {
    console.error("Error in getLocations:", error);
    return getStaticLocations(filters);
  }
}

async function getStaticLocations(filters: Filters = {}): Promise<Location[]> {
  const screensByLocation = SCREENS.reduce<Record<string, Screen[]>>((acc, screen) => {
    if (!acc[screen.locationId]) {
      acc[screen.locationId] = [];
    }

    acc[screen.locationId].push(screen);
    return acc;
  }, {});

  const locations = BASE_LOCATIONS.map((base) => {
    const locationScreens = screensByLocation[base.id] ?? [];
    return buildLocation(base.id, locationScreens);
  });

  const filtered = locations.filter((location) => {
    const locationScreens = screensByLocation[location.id] ?? [];
    return matchesFilters(location, locationScreens, filters);
  });

  return filtered;
}

export async function getLocationScreens(locationId: string): Promise<Screen[]> {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from("location_screens")
      .select(`
        *,
        screen_types (
          name,
          display_name
        )
      `)
      .eq("location_id", locationId);

    if (error) {
      console.error("Error fetching location screens:", error);
      // Fallback to static data
      return SCREENS.filter((screen) => screen.locationId === locationId);
    }

    if (data && data.length > 0) {
      // Transform to Screen type
      const screens: Screen[] = data.flatMap((ls: any) => {
        const screenType = ls.screen_types;
        // Create multiple screen entries based on quantity
        return Array.from({ length: ls.quantity }, (_, index) => ({
          id: `${ls.id}-${index}`,
          locationId: locationId,
          name: `${screenType.display_name} ${index + 1}`,
          type: screenType.display_name,
          width: 0,
          height: 0,
          floor: undefined,
        }));
      });

      return screens;
    }

    // Fallback to static data if no Supabase data
    return SCREENS.filter((screen) => screen.locationId === locationId);
  } catch (error) {
    console.error("Error in getLocationScreens:", error);
    return SCREENS.filter((screen) => screen.locationId === locationId);
  }
}

export async function getLocationsWithScreens(filters: Filters = {}): Promise<LocationWithScreens[]> {
  const locations = await getLocations(filters);

  return Promise.all(
    locations.map(async (location) => {
      const screens = await getLocationScreens(location.id);
      return {
        ...location,
        screens,
      } satisfies LocationWithScreens;
    }),
  );
}

/**
 * Lokasyon koordinatlarını Google Maps API ile günceller
 */
export async function updateLocationCoordinates(locationId: string): Promise<boolean> {
  const location = BASE_LOCATIONS.find(loc => loc.id === locationId);
  if (!location) {
    throw new Error(`Lokasyon bulunamadı: ${locationId}`);
  }

  // Tam adres oluştur
  const fullAddress = `${location.name}, ${location.district}, Samsun, Türkiye`;

  try {
    const geocodeResult = await geocodeAddress(fullAddress);

    if (geocodeResult) {
      // Burada gerçekte veritabanına kaydetmek gerekirdi
      // Şimdilik sadece koordinatları döndürüyoruz
      console.log(`📍 ${location.name}: ${geocodeResult.coordinates.lat}, ${geocodeResult.coordinates.lng}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Koordinat güncelleme hatası: ${locationId}`, error);
    return false;
  }
}
