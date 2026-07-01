import { parseISO, format } from "date-fns";
import { tr } from "date-fns/locale";

import type { Location, Screen } from "@/lib/types";
import { SCREENS } from "@/data/screens";

export function getMarkerColor(location: Location) {
  const locationScreens = SCREENS.filter(screen => screen.locationId === location.id);
  const hasLED = locationScreens.some(screen => screen.type === "LED");
  const hasDigital = locationScreens.some(screen => screen.type === "Dijital");

  if (hasLED && hasDigital) {
    return "#F59E0B"; // Turuncu - karma
  }
  if (hasLED) {
    return "#3B82F6"; // Mavi - LED
  }
  if (hasDigital) {
    return "#8B5CF6"; // Mor - Dijital
  }
  return "#6B7280"; // Gri - hiç ekran yok
}

export function getLocationStatusLabel(location: Location) {
  const locationScreens = SCREENS.filter(screen => screen.locationId === location.id);
  const types = Array.from(new Set(locationScreens.map(screen => screen.type)));

  if (types.length === 0) return "Ekran Yok";
  if (types.length === 1) return types[0];
  return "Karma";
}

export function formatDimensions(widthCm: number, heightCm: number) {
  return `${widthCm}×${heightCm} cm`;
}

export function formatTimeRange(startISO: string, endISO: string) {
  const start = format(parseISO(startISO), "HH:mm", { locale: tr });
  const end = format(parseISO(endISO), "HH:mm", { locale: tr });
  return `${start} – ${end}`;
}

export function groupScreenTypes(screens: Screen[]) {
  const unique = Array.from(new Set(screens.map((screen) => screen.type)));
  return unique;
}
