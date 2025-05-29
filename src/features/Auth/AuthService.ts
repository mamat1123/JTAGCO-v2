import { userAPI } from '@/entities/User/userAPI';
import { LoginCredentials, RegisterCredentials } from '@/entities/User/user';
import { supabase } from '@/shared/lib/supabase';

export class AuthService {
  static async login(credentials: LoginCredentials) {
    return userAPI.login(credentials);
  }

  static async register(credentials: RegisterCredentials) {
    return userAPI.register(credentials);
  }

  static async logout() {
    return userAPI.logout();
  }

  static async setSupabaseSession(accessToken: string, refreshToken: string) {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error setting Supabase session:', error);
      throw error;
    }
  }
} 