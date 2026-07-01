import { createContext, useContext, useEffect, type ReactNode } from "react";
import { supabase } from "./supabase";
import { useAppStore } from "./store";
import type { UserProfile } from "./auth-types";

type AuthContextType = {
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const setAuth = useAppStore((state) => state.setAuth);
  const setLoading = useAppStore((state) => state.setLoading);
  const setRememberMe = useAppStore((state) => state.setRememberMe);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const rememberMe = useAppStore((state) => state.rememberMe);

  useEffect(() => {
    // Check active session on mount
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          clearAuth();
          return;
        }

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setAuth(session.user, session, profile);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);

        if (event === "SIGNED_IN" && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setAuth(session.user, session, profile);
        } else if (event === "SIGNED_OUT") {
          clearAuth();
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setAuth(session.user, session, profile);
        } else if (event === "USER_UPDATED" && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setAuth(session.user, session, profile);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, setLoading, clearAuth]);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
    name?: string
  ): Promise<{ error: Error | null }> => {
    try {
      // Check if username already exists
      const { data: existingUsername } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUsername) {
        return { error: new Error("Bu kullanıcı adı zaten kullanılıyor") };
      }

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        return { error: signUpError };
      }

      if (!data.user) {
        return { error: new Error("Kayıt başarısız oldu") };
      }

      // Create user profile
      const { error: profileError } = await supabase.from("user_profiles").insert({
        user_id: data.user.id,
        username,
        email,
        name: name || "",
        role: "user",
      });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        return { error: new Error("Profil oluşturulamadı") };
      }

      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as Error };
    }
  };

  const signIn = async (
    email: string,
    password: string,
    remember: boolean = false
  ): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.session && data.user) {
        setRememberMe(remember);
        const profile = await fetchUserProfile(data.user.id);
        setAuth(data.user, data.session, profile);
      }

      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as Error };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      clearAuth();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "skyboardmedia://reset-password",
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: error as Error };
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom hooks for accessing auth state
export function useUser() {
  return useAppStore((state) => state.user);
}

export function useSession() {
  return useAppStore((state) => state.session);
}

export function useUserProfile() {
  return useAppStore((state) => state.userProfile);
}

export function useIsAuthenticated() {
  return useAppStore((state) => state.isAuthenticated);
}

export function useAuthLoading() {
  return useAppStore((state) => state.isLoading);
}
