import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  user: null | { id: string; name: string; email: string };
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const login = async (email: string, password: string) => {
    try {
      // This would be replaced with an actual API call
      // const response = await authService.login(email, password);
      
      // Mock successful login
      const mockToken = 'mock_jwt_token';
      const mockUser = { id: '1', name: 'User', email };
      
      localStorage.setItem('auth_token', mockToken);
      
      setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // This would be replaced with an actual API call
      // const response = await authService.register(name, email, password);
      
      // Mock successful registration
      const mockToken = 'mock_jwt_token';
      const mockUser = { id: '1', name, email };
      
      localStorage.setItem('auth_token', mockToken);
      
      setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}