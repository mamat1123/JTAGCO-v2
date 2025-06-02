import { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

export type Session = SupabaseSession;
export type AuthUser = SupabaseUser;

export type ProfileStatus = 'wait_for_approve' | 'approved' | 'rejected';

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
  fullname: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setSession: (session: Session | null) => void;
  logout: () => void;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  session: {
    access_token: string;
    refresh_token: string;
  };
}