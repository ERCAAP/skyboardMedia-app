import type { Session, User } from "@supabase/supabase-js";

export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  role: UserRole;
  contact_preference?: "WhatsApp" | "E-posta";
  consent?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  name?: string;
}
