import { userAPI } from '@/entities/User/userAPI';
import { LoginCredentials, RegisterCredentials } from '@/entities/User/user';

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
} 