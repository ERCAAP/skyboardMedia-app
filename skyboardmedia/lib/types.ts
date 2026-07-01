export type District = "Tekkeköy" | "Atakum" | "İlkadım" | "Çarşamba";

export type Environment = "İç" | "Dış";

export type ScreenType = "LED" | "Dijital";

export type ScreenOrientation = "Dikey" | "Yatay";

export type Screen = {
  id: string;
  locationId: string;
  name: string;
  type: ScreenType;
  format: string;
  orientation: ScreenOrientation;
  widthCm: number;
  heightCm: number;
  resolution?: string;
  phone?: string;
  imageUrl?: string;
  floor?: string;
  description?: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  district: District;
  environment: Environment;
  floor?: string;
  lat: number;
  lng: number;
  totalScreens: number;
  featured?: boolean;
};

export type Filters = {
  district?: District;
  environment?: Environment;
  type?: ScreenType;
  floor?: string;
};

export type LocationWithScreens = Location & {
  screens: Screen[];
};
