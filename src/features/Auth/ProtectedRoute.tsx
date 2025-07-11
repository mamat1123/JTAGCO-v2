import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/Auth/stores/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}