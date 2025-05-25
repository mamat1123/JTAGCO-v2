import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { AuthService } from './AuthService';
import { LoginCredentials, RegisterCredentials } from '@/entities/User/user';
import { useProfile } from '@/features/Profile/hooks/useProfile';

export const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const { fetchProfileByUserId } = useProfile();

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await AuthService.login(credentials);
      
      // First set the session
      setSession(response.session);
      // Then set the user
      setUser(response.user);
      
      // Wait a bit to ensure the session is set before fetching profile
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch user profile after successful login
      if (response.user?.id) {
        await fetchProfileByUserId(response.user.id);
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

