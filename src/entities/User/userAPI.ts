import api from '@/lib/api';
import { AuthUser, LoginCredentials, RegisterCredentials, LoginResponse } from './user';

export const userAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthUser> => {
    const { data } = await api.post<AuthUser>('/auth/register', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
}; 