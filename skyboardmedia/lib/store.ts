import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

import type { Filters } from "@/lib/types";
import type { UserProfile } from "@/lib/auth-types";

type ViewMode = "map" | "list";

type Profile = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  contactPreference: "WhatsApp" | "E-posta";
  consent: boolean;
};

type AppState = {
  viewMode: ViewMode;
  filters: Filters;
  selectedLocationId?: string;
  selectedScreenId?: string;
  profile: Profile;
  // Auth state
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  // Actions
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setFilters: (next: Filters) => void;
  clearFilters: () => void;
  setSelectedLocation: (id?: string) => void;
  setSelectedScreen: (id?: string) => void;
  updateProfile: (fields: Partial<Profile>) => void;
  // Auth actions
  setAuth: (user: User | null, session: Session | null, profile: UserProfile | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setRememberMe: (remember: boolean) => void;
  clearAuth: () => void;
};

const DEFAULT_PROFILE: Profile = {
  name: "",
  company: "",
  email: "",
  phone: "",
  contactPreference: "WhatsApp",
  consent: false,
};

export const useAppStore = create<AppState>((set) => ({
  viewMode: "map",
  filters: {},
  selectedLocationId: undefined,
  selectedScreenId: undefined,
  profile: DEFAULT_PROFILE,
  // Auth initial state
  user: null,
  session: null,
  userProfile: null,
  isAuthenticated: false,
  isLoading: true,
  rememberMe: false,
  // App actions
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () =>
    set((state) => ({ viewMode: state.viewMode === "map" ? "list" : "map" })),
  setFilters: (next) => set({ filters: next }),
  clearFilters: () => set({ filters: {} }),
  setSelectedLocation: (id) => set({ selectedLocationId: id, selectedScreenId: undefined }),
  setSelectedScreen: (id) => set({ selectedScreenId: id }),
  updateProfile: (fields) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...fields,
      },
    })),
  // Auth actions
  setAuth: (user, session, profile) =>
    set({
      user,
      session,
      userProfile: profile,
      isAuthenticated: !!user && !!session,
      isLoading: false,
    }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setLoading: (loading) => set({ isLoading: loading }),
  setRememberMe: (remember) => set({ rememberMe: remember }),
  clearAuth: () =>
    set({
      user: null,
      session: null,
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: false,
    }),
}));
