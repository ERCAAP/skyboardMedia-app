import type { Location, Environment, District } from "@/lib/types";

export type BaseLocation = {
  id: string;
  name: string;
  address: string;
  district: District;
  environment: Environment;
  lat: number;
  lng: number;
  floor?: string;
  featured?: boolean;
};

// Import edilmiş veriler (excel-to-json scripti ile oluşturulur)
import importedLocations from './imported-locations.json';

export const BASE_LOCATIONS: BaseLocation[] = (importedLocations || []) as BaseLocation[];

export function enrichLocation(
  base: BaseLocation,
  counts: Pick<Location, "totalScreens">,
): Location {
  return {
    ...base,
    ...counts,
  };
}
