import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

export type ThemeColorKey =
  | "primary"
  | "primaryLight"
  | "primaryDark"
  | "surface"
  | "surfaceVariant"
  | "surfaceElevated"
  | "textPrimary"
  | "textSecondary"
  | "textTertiary"
  | "accentVacant"
  | "accentOccupied"
  | "accentMixed"
  | "border"
  | "borderLight"
  | "backgroundRaised"
  | "outline"
  | "success"
  | "warning"
  | "error"
  | "overlay";

export type Theme = {
  colorScheme: ColorSchemeName;
  colors: Record<ThemeColorKey, string>;
};

type ThemeContextValue = Theme;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const COLORS = {
  light: {
    primary: "#4F46E5",
    primaryLight: "#EEF2FF",
    primaryDark: "#3730A3",
    surface: "#FFFFFF",
    surfaceVariant: "#F8FAFC",
    surfaceElevated: "#FAFBFC",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textTertiary: "#94A3B8",
    accentVacant: "#10B981",
    accentOccupied: "#EF4444",
    accentMixed: "#F59E0B",
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    backgroundRaised: "#F1F5F9",
    outline: "#C7D2FE",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    overlay: "rgba(15, 23, 42, 0.5)",
  },
  dark: {
    primary: "#6366F1",
    primaryLight: "#1E1B4B",
    primaryDark: "#818CF8",
    surface: "#0F172A",
    surfaceVariant: "#1E293B",
    surfaceElevated: "#1E293B",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",
    accentVacant: "#10B981",
    accentOccupied: "#EF4444",
    accentMixed: "#F59E0B",
    border: "#334155",
    borderLight: "#1E293B",
    backgroundRaised: "#1E293B",
    outline: "#4C1D95",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    overlay: "rgba(0, 0, 0, 0.7)",
  },
} satisfies Record<string, Record<ThemeColorKey, string>>;

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const scheme = useColorScheme() ?? "dark";

  const value = useMemo<Theme>(() => {
    const palette = scheme === "light" ? COLORS.light : COLORS.dark;

    return {
      colorScheme: scheme,
      colors: palette,
    };
  }, [scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
