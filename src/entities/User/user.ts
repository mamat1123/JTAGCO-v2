import { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

export type Session = SupabaseSession;
export type User = SupabaseUser;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  logout: () => void;
}