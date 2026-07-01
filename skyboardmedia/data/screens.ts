import type { Screen } from "@/lib/types";

// Import edilmiş veriler (excel-to-json scripti ile oluşturulur)
import importedScreens from './imported-screens.json';

export const SCREENS: Screen[] = (importedScreens || []) as Screen[];
