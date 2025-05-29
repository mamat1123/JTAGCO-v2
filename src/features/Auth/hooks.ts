import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { AuthService } from './AuthService';
import { LoginCredentials, RegisterCredentials } from '@/entities/User/user';
import { useProfile } from '@/features/Profile/hooks/useProfile';

export const useSetSupabaseSession = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);

  const setSupabaseSession = async (accessToken: string, refreshToken: string) => {
    try {
      const { session, user } = await AuthService.setSupabaseSession(accessToken, refreshToken);
      
      if (session) {
        setSession(session);
      }
      
      if (user) {
        setUser(user);
      }

      return { session, user };
    } catch (error) {
      console.error('Failed to set Supabase session:', error);
      throw error;
    }
  };

  return { setSupabaseSession };
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { fetchProfileByUserId } = useProfile();
  const { setSupabaseSession } = useSetSupabaseSession();

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await AuthService.login(credentials);
      
      // Set Supabase session with tokens from backend
      const { user } = await setSupabaseSession(response.session.access_token, response.session.refresh_token);
      
      // Fetch user profile after successful login
      if (user?.id) {
        await fetchProfileByUserId(user.id);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return { login };
};

export const useRegister = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const register = async (credentials: RegisterCredentials) => {
    try {
      const user = await AuthService.register(credentials);
      setUser(user);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return { register };
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { clearProfileData } = useProfile();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      logout();
      clearProfileData();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return { logout: handleLogout };
};

