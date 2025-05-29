import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, Session } from '@/entities/User/user';

const STORAGE_KEY = 'auth-storage';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      setUser: (user: User | null) => set((state) => ({ 
        user, 
        isAuthenticated: !!user && !!state.session 
      })),
      setSession: (session: Session | null) => set((state) => ({ 
        session, 
        isAuthenticated: !!state.user && !!session
      })),
      logout: () => set({ user: null, session: null, isAuthenticated: false }),
    }),
    {
      name: STORAGE_KEY,
      // Only persist the session and user data
      partialize: (state) => ({
        session: state.session,
        user: state.user,
      }),
      // Initialize isAuthenticated from persisted data
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.user && !!state.session;
        }
      },
    }
  )
); 