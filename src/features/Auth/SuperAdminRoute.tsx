import { Navigate } from 'react-router-dom';
import { useProfile } from '@/features/Profile/hooks/useProfile';

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const isSuperAdmin = profile?.role === 'super admin';

  if (!isSuperAdmin) {
    return <Navigate to="/settings" replace />;
  }

  return <>{children}</>;
} 